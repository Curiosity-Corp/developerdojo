"""BIM pathway checks (developerdojo#92). Rebuilds every generated file under public/examples/bim-pathway/generated/.

Usage: python -I /examples/bim-pathway/tools/bim_pathway.py <examples-dir> <out-dir>

  <examples-dir>  public/examples/bim-pathway (the inputs: the buildingSMART sample IFC and the two IDS files)
  <out-dir>       where to write the generated files; CI writes to a fresh folder and diffs it against
                  <examples-dir>/generated, so the published output is exactly what CI computed.

Three outcomes are kept apart on purpose and never folded into one score:
  * information: the IDS requirement results (ifctester);
  * schema: IFC schema validation of each model (ifcopenshell.validate);
  * geometry: whether each body shape can be built, with its volume and bounding box (ifcopenshell.geom).
Two more outputs, both from the original sample:
  * mesh: an OBJ of the physical elements and a topology check of each mesh (BIM-005, geometry without semantics);
  * quantities: wall, opening and window quantities traced to their source entities, cross-checked between the IFC
    parameters and the built geometry (BIM-006). The script writes nothing if a cross-check disagrees.
The output is deterministic: no dates, no absolute paths, floats rounded, keys sorted.
"""
from __future__ import annotations

import hashlib
import json
import logging
import shutil
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import ifcopenshell
import ifcopenshell.api.pset
import ifcopenshell.geom
import ifcopenshell.util.element
import ifcopenshell.util.shape
import ifcopenshell.util.unit
import ifcopenshell.validate
import ifctester
from ifctester import ids as ids_mod
from ifctester import reporter

SOURCE_IFC = 'wall-with-opening-and-window.ifc'
EDITED_IFC = 'wall-with-opening-and-window.edited.ifc'
PRACTICE_IDS = 'practice-requirements.ids'
RANDORI_IDS = 'randori-cards.ids'

# The BIM-004 change: the practice brief gives the wall a fire rating label in the practice format.
# It is a placeholder that satisfies REQ-03, not a fire assessment.
EDIT = {'element': 45, 'pset': 'Pset_WallCommon', 'property': 'FireRating', 'value': 'REI 60'}
# Fixed header values for the edited file, so it is byte-for-byte reproducible.
EDITED_HEADER = {
    'name': 'wall-with-opening-and-window.edited.ifc',
    'time_stamp': '2026-11-21T00:00:00',
    'author': ('Developer Dojo',),
    'organization': ('Developer Dojo',),
    'authorization': 'Practice edit, not approved for any project',
}


def fail(message: str) -> None:
    print(f'bim_pathway: {message}', file=sys.stderr)
    sys.exit(1)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def num(value: float) -> float:
    """Round so the output does not depend on the last bits of a float."""
    rounded = round(float(value), 6)
    return 0.0 if rounded == 0 else rounded


def plain(value: object) -> object:
    """A JSON-safe copy of an IFC attribute or property value."""
    if isinstance(value, ifcopenshell.entity_instance):
        return f'#{value.id()}={value.is_a()}'
    if isinstance(value, float):
        return num(value)
    if isinstance(value, (list, tuple)):
        return [plain(v) for v in value]
    return value


def write_json(path: Path, data: object) -> None:
    path.write_text(json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False, default=str) + '\n', encoding='utf-8')


def open_ifc(path: Path) -> ifcopenshell.file:
    try:
        return ifcopenshell.open(str(path))
    except (OSError, RuntimeError) as err:
        fail(f'cannot open {path.name}: {err}')
        raise


def make_edit(source: Path, target: Path) -> None:
    model = open_ifc(source)
    element = model.by_id(EDIT['element'])
    psets = ifcopenshell.util.element.get_psets(element, psets_only=True)
    if EDIT['pset'] not in psets:
        fail(f"#{EDIT['element']} has no {EDIT['pset']}; the sample is not the pinned file")
    pset = model.by_id(psets[EDIT['pset']]['id'])
    ifcopenshell.api.pset.edit_pset(model, pset=pset, properties={EDIT['property']: EDIT['value']})
    header = model.header.file_name
    header.name = EDITED_HEADER['name']
    header.time_stamp = EDITED_HEADER['time_stamp']
    header.author = EDITED_HEADER['author']
    header.organization = EDITED_HEADER['organization']
    header.preprocessor_version = f'IfcOpenShell {ifcopenshell.version}'
    header.originating_system = 'Developer Dojo /examples/bim-pathway/tools/bim_pathway.py'
    header.authorization = EDITED_HEADER['authorization']
    model.write(str(target))


def units(model: ifcopenshell.file) -> dict[str, str]:
    out = {}
    for unit_type in ('LENGTHUNIT', 'AREAUNIT', 'VOLUMEUNIT', 'PLANEANGLEUNIT'):
        unit = ifcopenshell.util.unit.get_project_unit(model, unit_type)
        out[unit_type] = ifcopenshell.util.unit.get_full_unit_name(unit) if unit else 'not set'
    return out


def ref(element: ifcopenshell.entity_instance) -> dict[str, object]:
    return {'id': element.id(), 'class': element.is_a(), 'GlobalId': element.GlobalId, 'Name': element.Name}


def spatial_tree(element: ifcopenshell.entity_instance) -> dict[str, object]:
    node: dict[str, object] = ref(element)
    children = []
    for rel in getattr(element, 'IsDecomposedBy', []) or []:
        children += [spatial_tree(child) for child in rel.RelatedObjects]
    contained = []
    for rel in getattr(element, 'ContainsElements', []) or []:
        contained += [ref(e) for e in rel.RelatedElements]
    if children:
        node['children'] = children
    if contained:
        node['contains'] = contained
    return node


def inspection(model: ifcopenshell.file) -> dict[str, object]:
    products = [p for p in model.by_type('IfcProduct') if not p.is_a('IfcSpatialStructureElement')]
    counts: dict[str, int] = {}
    for product in products:
        counts[product.is_a()] = counts.get(product.is_a(), 0) + 1
    elements = []
    for product in sorted(products, key=lambda p: p.id()):
        container = ifcopenshell.util.element.get_container(product)
        element_type = ifcopenshell.util.element.get_type(product)
        item = ref(product)
        item['container'] = f'#{container.id()}={container.is_a()}' if container else None
        item['type'] = f'#{element_type.id()}={element_type.is_a()}' if element_type else None
        elements.append(item)
    voids = [{'wall': f'#{r.RelatingBuildingElement.id()}', 'opening': f'#{r.RelatedOpeningElement.id()}'} for r in model.by_type('IfcRelVoidsElement')]
    fills = [{'opening': f'#{r.RelatingOpeningElement.id()}', 'filledBy': f'#{r.RelatedBuildingElement.id()}'} for r in model.by_type('IfcRelFillsElement')]
    projects = model.by_type('IfcProject')
    if len(projects) != 1:
        fail(f'expected one IfcProject, found {len(projects)}')
    return {
        'schema': model.schema,
        'viewDefinition': list(model.header.file_description.description),
        'units': units(model),
        'counts': dict(sorted(counts.items())),
        'spatialTree': spatial_tree(projects[0]),
        'elements': elements,
        'relationships': {'voids': voids, 'fills': fills},
    }


def properties(model: ifcopenshell.file) -> dict[str, object]:
    out = {}
    for product in sorted(model.by_type('IfcElement'), key=lambda p: p.id()):
        psets = {}
        for pset_name, pset in sorted(ifcopenshell.util.element.get_psets(product).items()):
            values = {}
            pset_entity = model.by_id(pset['id'])
            for prop in getattr(pset_entity, 'HasProperties', None) or []:
                if not prop.is_a('IfcPropertySingleValue'):
                    continue
                nominal = prop.NominalValue
                value = plain(nominal.wrappedValue) if nominal is not None else None
                values[prop.Name] = {
                    'value': value,
                    'type': nominal.is_a() if nominal is not None else None,
                    'empty': value is None or value == '',
                }
            psets[pset_name] = {'id': pset['id'], 'properties': values}
        material = ifcopenshell.util.element.get_material(product)
        item = ref(product)
        item['attributes'] = {k: plain(v) for k, v in product.get_info(recursive=False).items() if k in ('OverallWidth', 'OverallHeight', 'PredefinedType')}
        item['material'] = f'#{material.id()}={material.is_a()}' if material else None
        item['propertySets'] = psets
        out[f'#{product.id()}'] = item
    return out


class Collect(logging.Handler):
    def __init__(self) -> None:
        super().__init__()
        self.records: list[dict[str, object]] = []

    def emit(self, record: logging.LogRecord) -> None:
        self.records.append({'level': record.levelname, 'message': str(record.getMessage())})


def schema_validation(model: ifcopenshell.file) -> dict[str, object]:
    logger = logging.getLogger('bim_pathway.validate')
    logger.propagate = False
    logger.handlers.clear()
    collect = Collect()
    logger.addHandler(collect)
    logger.setLevel(logging.DEBUG)
    ifcopenshell.validate.validate(model, logger, express_rules=False)
    issues = sorted(collect.records, key=lambda r: (str(r['level']), str(r['message'])))
    return {
        'checked': 'IFC schema: entity attributes, types, cardinalities and inverses (ifcopenshell.validate, express_rules=False). EXPRESS where-rules and implementer agreements are not checked here.',
        'issues': issues,
        'valid': not any(r['level'] in ('ERROR', 'CRITICAL') for r in issues),
    }


def geometry(model: ifcopenshell.file) -> dict[str, object]:
    settings = ifcopenshell.geom.settings()
    settings.set('use-world-coords', True)
    scale = ifcopenshell.util.unit.calculate_unit_scale(model)  # model length unit to metres
    shapes = []
    for product in sorted(model.by_type('IfcElement'), key=lambda p: p.id()):
        if product.Representation is None:
            continue
        entry: dict[str, object] = {'id': product.id(), 'class': product.is_a(), 'GlobalId': product.GlobalId}
        try:
            shape = ifcopenshell.geom.create_shape(settings, product)
        except RuntimeError as err:
            entry.update({'built': False, 'error': str(err)})
            shapes.append(entry)
            continue
        geo = shape.geometry
        # ifcopenshell 0.9.0.post1 returns coordinates in the model length unit here (millimetre for the
        # sample); convert to metres. The CI diff and tests/bim-pathway.test.ts pin the wall at 1.5 m3.
        verts = ifcopenshell.util.shape.get_vertices(geo) * scale
        lo, hi = verts.min(axis=0), verts.max(axis=0)
        entry.update({
            'built': True,
            'vertices': int(len(verts)),
            'faces': int(len(ifcopenshell.util.shape.get_faces(geo))),
            'volume_m3': num(ifcopenshell.util.shape.get_volume(geo) * scale ** 3),
            'bbox_m': {'min': [num(v) for v in lo], 'max': [num(v) for v in hi]},
        })
        shapes.append(entry)
    return {
        'checked': 'Each element with a representation is built with ifcopenshell.geom in world coordinates, openings subtracted. Volume and bounding box converted from the model length unit to metres. No clash, tolerance or constructability check.',
        'lengthUnitToMetre': num(scale),
        'elements': shapes,
        'allBuilt': all(s.get('built') for s in shapes),
    }


def ids_check(ids_path: Path, model: ifcopenshell.file) -> tuple[dict[str, object], dict[str, object]]:
    try:
        spec = ids_mod.open(str(ids_path), validate=True)
    except Exception as err:  # ifctester raises several xmlschema error types; each means the IDS is invalid
        fail(f'{ids_path.name} is not a valid IDS 1.0 file: {err}')
        raise
    spec.validate(model)
    full = reporter.Json(spec).report()
    full.pop('date', None)
    compact = []
    # ifctester 0.9.0 does not keep the IDS identifier attribute, so read it from the XML in document order.
    namespace = {'ids': 'http://standards.buildingsmart.org/IDS'}
    identifiers = [s.get('identifier') for s in ET.parse(ids_path).getroot().iterfind('ids:specifications/ids:specification', namespace)]
    if len(identifiers) != len(full['specifications']):
        fail(f'{ids_path.name}: {len(identifiers)} specifications in the XML, {len(full["specifications"])} in the report')
    for result, identifier in zip(full['specifications'], identifiers):
        requirements = []
        for req in result['requirements']:
            requirements.append({
                'facet': req['facet_type'],
                'label': req.get('label'),
                'description': req['description'],
                'pass': req['total_pass'],
                'fail': req['total_fail'],
                'failures': [{'element': f"#{e['id']}", 'GlobalId': e.get('global_id'), 'reason': e.get('reason')} for e in req['failed_entities']],
            })
        compact.append({
            'identifier': identifier,
            'name': result['name'],
            'status': 'pass' if result['status'] else 'fail',
            'applicable': result['total_applicable'],
            'applicablePass': result['total_applicable_pass'],
            'applicableFail': result['total_applicable_fail'],
            'requirements': requirements,
        })
    summary = {
        'ids': ids_path.name,
        'title': full['title'],
        'specifications': compact,
        'passed': sum(1 for s in compact if s['status'] == 'pass'),
        'failed': sum(1 for s in compact if s['status'] == 'fail'),
    }
    return summary, full


# --- BIM-005: 3D geometry, kept apart from the BIM information ------------------------------------------------------
MESH_OBJ = 'wall-with-opening-and-window.obj'
# Physical elements only: an IfcOpeningElement is a void that is subtracted from the wall, not an object you could see.
MESH_CLASSES = ('IfcWall', 'IfcWindow')


def triangles(model: ifcopenshell.file, product: ifcopenshell.entity_instance) -> tuple['numpy.ndarray', 'numpy.ndarray', float]:
    """World-coordinate vertices in metres, triangle indices and IfcOpenShell's volume in m³ for one element, openings
    subtracted."""
    settings = ifcopenshell.geom.settings()
    settings.set('use-world-coords', True)
    scale = ifcopenshell.util.unit.calculate_unit_scale(model)
    try:
        shape = ifcopenshell.geom.create_shape(settings, product)
    except RuntimeError as err:
        fail(f'#{product.id()} {product.is_a()}: the shape cannot be built: {err}')
        raise
    verts = ifcopenshell.util.shape.get_vertices(shape.geometry) * scale
    faces = ifcopenshell.util.shape.get_faces(shape.geometry)
    return verts, faces, float(ifcopenshell.util.shape.get_volume(shape.geometry)) * scale ** 3


def mesh_check(verts: 'numpy.ndarray', faces: 'numpy.ndarray') -> dict[str, object]:
    """Topology and measures of a triangle mesh, computed from the triangles alone (no IFC semantics)."""
    import numpy

    # Weld coincident vertices (to the nanometre) so the edge counts see one vertex per corner.
    keys = [tuple(round(float(c), 9) for c in v) for v in verts]
    weld: dict[tuple[float, ...], int] = {}
    index = [weld.setdefault(k, len(weld)) for k in keys]
    tris = [(index[a], index[b], index[c]) for a, b, c in faces.tolist()]
    directed: dict[tuple[int, int], int] = {}
    for a, b, c in tris:
        for edge in ((a, b), (b, c), (c, a)):
            directed[edge] = directed.get(edge, 0) + 1
    undirected: dict[tuple[int, int], int] = {}
    for (a, b), n in directed.items():
        key = (min(a, b), max(a, b))
        undirected[key] = undirected.get(key, 0) + n
    closed = all(n == 2 for n in undirected.values())
    oriented = closed and all(n == 1 and directed.get((b, a)) == 1 for (a, b), n in directed.items())
    p = verts[faces]
    cross = numpy.cross(p[:, 1] - p[:, 0], p[:, 2] - p[:, 0])
    area = float(numpy.linalg.norm(cross, axis=1).sum() / 2)
    volume = float(numpy.einsum('ij,ij->i', p[:, 0], numpy.cross(p[:, 1], p[:, 2])).sum() / 6)
    v, e, f = len(weld), len(undirected), len(tris)
    euler = v - e + f
    return {
        'vertices': v,
        'edges': e,
        'triangles': f,
        'closed': closed,
        'consistentlyOriented': oriented,
        'eulerCharacteristic': euler,
        # For one closed, connected surface, genus = (2 - V + E - F) / 2: the number of holes that pass right through.
        'throughHoles': (2 - euler) // 2 if closed else None,
        'surfaceArea_m2': num(area),
        'enclosedVolume_m3': num(volume) if closed else None,
        'bbox_m': {'min': [num(c) for c in verts.min(axis=0)], 'max': [num(c) for c in verts.max(axis=0)]},
    }


def mesh(model: ifcopenshell.file) -> tuple[str, dict[str, object]]:
    """A Wavefront OBJ of the physical elements and a check of each mesh. The OBJ keeps names only."""
    lines = [
        '# Wavefront OBJ, triangles, metres, Z up, world coordinates.',
        '# Tessellated from buildingSMART wall-with-opening-and-window.ifc (CC BY 4.0, buildingSMART International Ltd.)',
        '# by /examples/bim-pathway/tools/bim_pathway.py with IfcOpenShell. An adaptation: geometry only.',
        '# A mesh keeps no IFC classes, properties or relationships; the object names below are the only link back.',
    ]
    elements = []
    offset = 0
    for product in sorted(model.by_type('IfcElement'), key=lambda p: p.id()):
        if product.is_a() not in MESH_CLASSES or product.Representation is None:
            continue
        verts, faces, ifc_volume = triangles(model, product)
        name = f'{product.is_a()}_{product.GlobalId}'
        lines.append(f'o {name}')
        lines += ['v ' + ' '.join(f'{num(c):.6f}' for c in v) for v in verts]
        lines += [f'f {a + 1 + offset} {b + 1 + offset} {c + 1 + offset}' for a, b, c in faces.tolist()]
        offset += len(verts)
        check = mesh_check(verts, faces)
        check['ifcopenshellVolume_m3'] = num(ifc_volume)
        check['volumesAgree'] = check['enclosedVolume_m3'] is not None and abs(check['enclosedVolume_m3'] - num(ifc_volume)) < 1e-6
        elements.append({'object': name, 'id': product.id(), 'class': product.is_a(), 'GlobalId': product.GlobalId, **check})
    excluded = [f'#{p.id()}={p.is_a()}' for p in sorted(model.by_type('IfcElement'), key=lambda p: p.id()) if p.is_a() not in MESH_CLASSES]
    return '\n'.join(lines) + '\n', {
        'checked': 'Each physical element is tessellated with ifcopenshell.geom (world coordinates, openings subtracted) and written to one OBJ. The mesh checks use the triangles alone: closed (every edge in exactly two triangles), consistently oriented (each edge once in each direction), Euler characteristic, surface area, enclosed volume and bounding box. The enclosed volume is compared with IfcOpenShell\'s own volume. No viewer, clash, tolerance or constructability check.',
        'file': MESH_OBJ,
        'units': 'metre',
        'excluded': excluded,
        'excludedWhy': 'An IfcOpeningElement is a void subtracted from its wall, not a physical object.',
        'lost': ['IFC classes and predefined types', 'property sets', 'materials', 'spatial containment', 'void and fill relationships', 'GlobalIds, except in the object names'],
        'elements': elements,
        'allClosed': all(e['closed'] for e in elements),
        'allVolumesAgree': all(e['volumesAgree'] for e in elements),
    }


# --- BIM-006: quantities traced to source objects ------------------------------------------------------------------
def _polyline_points(curve: ifcopenshell.entity_instance) -> list[tuple[float, float]]:
    if not curve.is_a('IfcPolyline'):
        fail(f'#{curve.id()} is {curve.is_a()}; this script reads IfcPolyline profiles only')
    return [tuple(float(c) for c in point.Coordinates[:2]) for point in curve.Points]


def _shoelace(points: list[tuple[float, float]]) -> float:
    return abs(sum(x1 * y2 - x2 * y1 for (x1, y1), (x2, y2) in zip(points, points[1:] + points[:1]))) / 2


def _extrusion(product: ifcopenshell.entity_instance) -> ifcopenshell.entity_instance:
    bodies = [r for r in product.Representation.Representations if r.RepresentationIdentifier == 'Body']
    if len(bodies) != 1 or len(bodies[0].Items) != 1 or not bodies[0].Items[0].is_a('IfcExtrudedAreaSolid'):
        fail(f'#{product.id()} has no single extruded Body; this script reads one IfcExtrudedAreaSolid per element')
    solid = bodies[0].Items[0]
    if not solid.SweptArea.is_a('IfcArbitraryClosedProfileDef'):
        fail(f'#{solid.SweptArea.id()} is {solid.SweptArea.is_a()}; this script reads IfcArbitraryClosedProfileDef only')
    if [float(c) for c in solid.ExtrudedDirection.DirectionRatios] != [0.0, 0.0, 1.0]:
        fail(f'#{solid.id()} is not extruded straight up; the face-area route assumes it is')
    return solid


def _side_area(verts: 'numpy.ndarray', faces: 'numpy.ndarray', normal: tuple[float, float, float]) -> float:
    """Total area of the triangles whose unit normal is the given axis direction."""
    import numpy

    p = verts[faces]
    cross = numpy.cross(p[:, 1] - p[:, 0], p[:, 2] - p[:, 0])
    length = numpy.linalg.norm(cross, axis=1)
    unit = cross / length[:, None]
    facing = unit @ numpy.array(normal) > 1 - 1e-9
    return float(length[facing].sum() / 2)


def quantities(model: ifcopenshell.file) -> dict[str, object]:
    """Wall, opening and window quantities, each with its source entities, unit, method and assumption.

    Two routes are kept apart: parametric (numbers read from the IFC attributes and profiles) and geometric (the
    built, tessellated shape). Where both exist they must agree, or the script writes nothing.
    """
    scale = ifcopenshell.util.unit.calculate_unit_scale(model)
    walls, openings, windows = model.by_type('IfcWall'), model.by_type('IfcOpeningElement'), model.by_type('IfcWindow')
    if (len(walls), len(openings), len(windows)) != (1, 1, 1):
        fail(f'expected one wall, one opening and one window, found {len(walls)}, {len(openings)}, {len(windows)}')
    wall, opening, window = walls[0], openings[0], windows[0]
    voids = [r for r in model.by_type('IfcRelVoidsElement') if r.RelatingBuildingElement == wall and r.RelatedOpeningElement == opening]
    fills = [r for r in model.by_type('IfcRelFillsElement') if r.RelatingOpeningElement == opening and r.RelatedBuildingElement == window]
    if not voids or not fills:
        fail('the opening does not void the wall or the window does not fill the opening')

    axis = [r for r in wall.Representation.Representations if r.RepresentationIdentifier == 'Axis']
    if len(axis) != 1:
        fail(f'#{wall.id()} has no single Axis representation')
    axis_curve = axis[0].Items[0]
    (ax0, ay0), (ax1, ay1) = _polyline_points(axis_curve)[0], _polyline_points(axis_curve)[-1]
    wall_solid, opening_solid = _extrusion(wall), _extrusion(opening)
    wall_profile = wall_solid.SweptArea.OuterCurve
    opening_profile = opening_solid.SweptArea.OuterCurve
    wall_pts, opening_pts = _polyline_points(wall_profile), _polyline_points(opening_profile)
    usage = ifcopenshell.util.element.get_material(wall)
    if usage is None or not usage.is_a('IfcMaterialLayerSetUsage'):
        fail(f'#{wall.id()} has no IfcMaterialLayerSetUsage')
    layers = usage.ForLayerSet.MaterialLayers

    length = ((ax1 - ax0) ** 2 + (ay1 - ay0) ** 2) ** 0.5 * scale
    thickness = sum(float(layer.LayerThickness) for layer in layers) * scale
    height = float(wall_solid.Depth) * scale
    profile_width = (max(y for _, y in wall_pts) - min(y for _, y in wall_pts)) * scale
    gross_volume = _shoelace(wall_pts) * scale ** 2 * height
    opening_width = (max(x for x, _ in opening_pts) - min(x for x, _ in opening_pts)) * scale
    opening_depth = (max(y for _, y in opening_pts) - min(y for _, y in opening_pts)) * scale
    opening_height = float(opening_solid.Depth) * scale
    opening_volume = _shoelace(opening_pts) * scale ** 2 * opening_height
    goes_through = abs(opening_depth - profile_width) < 1e-9
    if not goes_through:
        fail('the opening does not pass through the whole wall thickness; the face-area deduction assumes it does')
    gross_face = length * height
    opening_face = opening_width * opening_height
    window_area = float(window.OverallWidth) * float(window.OverallHeight) * scale ** 2
    psets = ifcopenshell.util.element.get_psets(window)
    glazing_fraction = psets.get('Pset_WindowCommon', {}).get('GlazingAreaFraction')
    glazing_prop = [p for p in model.by_id(psets['Pset_WindowCommon']['id']).HasProperties if p.Name == 'GlazingAreaFraction'] if 'Pset_WindowCommon' in psets else []

    wall_verts, wall_faces, built_volume = triangles(model, wall)
    face_minus_y = _side_area(wall_verts, wall_faces, (0.0, -1.0, 0.0))
    face_plus_y = _side_area(wall_verts, wall_faces, (0.0, 1.0, 0.0))

    def src(*entities: ifcopenshell.entity_instance) -> list[str]:
        return [f'#{e.id()}={e.is_a()}' for e in entities]

    w, o, g = wall.GlobalId, opening.GlobalId, window.GlobalId
    rows = [
        {'id': 'Q-01', 'element': f'#{wall.id()}', 'quantity': 'Wall length', 'value': num(length), 'unit': 'm', 'method': 'parametric: distance between the two points of the wall axis polyline', 'sources': src(axis[0], axis_curve), 'GlobalIds': [w], 'assumption': 'The axis runs the full length of the wall body.'},
        {'id': 'Q-02', 'element': f'#{wall.id()}', 'quantity': 'Wall thickness', 'value': num(thickness), 'unit': 'm', 'method': 'parametric: sum of the material layer thicknesses', 'sources': src(usage, usage.ForLayerSet, *layers), 'GlobalIds': [w], 'assumption': f'Must equal the body profile width ({num(profile_width)} m); checked below.'},
        {'id': 'Q-03', 'element': f'#{wall.id()}', 'quantity': 'Wall height', 'value': num(height), 'unit': 'm', 'method': 'parametric: extrusion depth of the body', 'sources': src(wall_solid), 'GlobalIds': [w], 'assumption': 'Extruded straight up (checked), so the extrusion depth is the height.'},
        {'id': 'Q-04', 'element': f'#{wall.id()}', 'quantity': 'Wall gross volume', 'value': num(gross_volume), 'unit': 'm³', 'method': 'parametric: profile area (shoelace) × extrusion depth', 'sources': src(wall_solid, wall_solid.SweptArea, wall_profile), 'GlobalIds': [w], 'assumption': 'Before the opening is subtracted.'},
        {'id': 'Q-05', 'element': f'#{opening.id()}', 'quantity': 'Opening volume', 'value': num(opening_volume), 'unit': 'm³', 'method': 'parametric: profile area (shoelace) × extrusion depth', 'sources': src(opening_solid, opening_solid.SweptArea, opening_profile, voids[0]), 'GlobalIds': [o, w], 'assumption': 'Assumed to lie wholly inside the wall body; the net-volume cross-check against the built shape confirms it for this file.'},
        {'id': 'Q-06', 'element': f'#{wall.id()}', 'quantity': 'Wall net volume', 'value': num(gross_volume - opening_volume), 'unit': 'm³', 'method': 'parametric: Q-04 − Q-05', 'sources': src(wall_solid, opening_solid, voids[0]), 'GlobalIds': [w, o], 'assumption': 'One opening; no other voids.'},
        {'id': 'Q-07', 'element': f'#{wall.id()}', 'quantity': 'Wall gross face area, one side', 'value': num(gross_face), 'unit': 'm²', 'method': 'parametric: Q-01 × Q-03', 'sources': src(axis_curve, wall_solid), 'GlobalIds': [w], 'assumption': 'One broad face; edges and the opposite face not counted.'},
        {'id': 'Q-08', 'element': f'#{opening.id()}', 'quantity': 'Opening face area', 'value': num(opening_face), 'unit': 'm²', 'method': 'parametric: opening profile width along the wall × opening extrusion depth', 'sources': src(opening_solid, opening_profile), 'GlobalIds': [o], 'assumption': 'The opening passes right through the wall (checked: its depth equals the wall thickness), so it is deducted once from each face.'},
        {'id': 'Q-09', 'element': f'#{wall.id()}', 'quantity': 'Wall net face area, one side', 'value': num(gross_face - opening_face), 'unit': 'm²', 'method': 'parametric: Q-07 − Q-08', 'sources': src(axis_curve, wall_solid, opening_solid, voids[0]), 'GlobalIds': [w, o], 'assumption': 'No reveals, waste or other adjustments.'},
        {'id': 'Q-10', 'element': f'#{window.id()}', 'quantity': 'Window area (overall)', 'value': num(window_area), 'unit': 'm²', 'method': 'parametric: OverallWidth × OverallHeight attributes', 'sources': src(window, fills[0]), 'GlobalIds': [g, o], 'assumption': 'Overall size as the author declared it, not measured from geometry.'},
        {'id': 'Q-11', 'element': f'#{window.id()}', 'quantity': 'Glazing area (estimate)', 'value': num(window_area * glazing_fraction) if isinstance(glazing_fraction, (int, float)) else None, 'unit': 'm²', 'method': 'estimate: Q-10 × Pset_WindowCommon.GlazingAreaFraction', 'sources': src(*glazing_prop) if glazing_prop else [], 'GlobalIds': [g], 'assumption': 'The window has no separate glass geometry, so this is an estimate from a declared property, not a measurement.' if isinstance(glazing_fraction, (int, float)) else 'Unavailable: GlazingAreaFraction is not set.'},
    ]
    checks = [
        {'check': 'Wall thickness: material layers (Q-02) and body profile width', 'first': num(thickness), 'second': num(profile_width), 'unit': 'm'},
        {'check': 'Wall net volume: parametric (Q-06) and the built shape (ifcopenshell.geom)', 'first': num(gross_volume - opening_volume), 'second': num(built_volume), 'unit': 'm³'},
        {'check': 'Wall net face area: parametric (Q-09) and the built mesh face looking along -Y', 'first': num(gross_face - opening_face), 'second': num(face_minus_y), 'unit': 'm²'},
        {'check': 'Wall net face area: parametric (Q-09) and the built mesh face looking along +Y', 'first': num(gross_face - opening_face), 'second': num(face_plus_y), 'unit': 'm²'},
    ]
    for c in checks:
        c['agree'] = abs(c['first'] - c['second']) < 1e-6
        if not c['agree']:
            fail(f"quantity cross-check failed: {c['check']}: {c['first']} and {c['second']} {c['unit']}")
    return {
        'checked': 'Quantities read from the IFC attributes, profiles and material layers (parametric), each with its source entities, GlobalIds, unit, method and assumption. Where the built geometry gives the same quantity, the two routes must agree within 0.000001, or the script writes nothing. These are practice quantities for a test file: not a takeoff for cost, procurement or construction.',
        'units': {'length': 'm', 'area': 'm²', 'volume': 'm³', 'modelLengthUnitToMetre': num(scale)},
        'quantities': rows,
        'crossChecks': checks,
        'authoredQuantitySets': len(model.by_type('IfcElementQuantity')),
    }


def quantities_csv(data: dict[str, object]) -> str:
    import csv
    import io

    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator='\n')
    writer.writerow(['id', 'element', 'quantity', 'value', 'unit', 'method', 'sources', 'GlobalIds', 'assumption'])
    for row in data['quantities']:
        value = row['value'] if row['value'] is not None else 'unavailable'
        writer.writerow([row['id'], row['element'], row['quantity'], value, row['unit'], row['method'], ' '.join(row['sources']), ' '.join(row['GlobalIds']), row['assumption']])
    return buffer.getvalue()


def summary_markdown(results: dict[str, dict[str, dict[str, object]]], manifest: dict[str, object]) -> str:
    lines = [
        '# BIM pathway checks',
        '',
        'Generated by /examples/bim-pathway/tools/bim_pathway.py. CI recomputes every file in this folder and fails if one differs.',
        f"Tools: IfcOpenShell {manifest['tools']['ifcopenshell']}, IfcTester {manifest['tools']['ifctester']}, Python {manifest['tools']['python']}.",
        '',
        'Information, schema and geometry are separate outcomes. There is no combined score.',
        'None of these checks is a professional, regulatory or construction approval.',
        '',
    ]
    for label, key in (('Original buildingSMART sample', 'original'), ('Edited copy (BIM-004)', 'edited')):
        r = results[key]
        ids_r, schema_r, geo_r = r['ids'], r['schema'], r['geometry']
        lines += [f'## {label}', '', '### Information: IDS requirements', '', '| Requirement | Result | Applicable | Failures |', '| --- | --- | --- | --- |']
        for s in ids_r['specifications']:
            failures = '; '.join(f"{f['element']}: {f['reason']}" for req in s['requirements'] for f in req['failures']) or 'none'
            lines.append(f"| {s['identifier']} {s['name']} | {s['status']} | {s['applicable']} | {failures} |")
        lines += ['', f"{ids_r['passed']} passed, {ids_r['failed']} failed.", '', '### Schema validation', '']
        lines.append('No schema issues reported.' if not schema_r['issues'] else '\n'.join(f"- {i['level']}: {i['message']}" for i in schema_r['issues']))
        lines += ['', '### Geometry', '', '| Element | Built | Volume (m³) | Bounding box (m) |', '| --- | --- | --- | --- |']
        for g in geo_r['elements']:
            box = f"{g['bbox_m']['min']} to {g['bbox_m']['max']}" if g.get('built') else g.get('error', '')
            lines.append(f"| #{g['id']} {g['class']} | {'yes' if g.get('built') else 'no'} | {g.get('volume_m3', '')} | {box} |")
        lines.append('')
    m = results['mesh']['mesh']
    lines += ['## 3D geometry (BIM-005), original sample', '', '| Object | Triangles | Closed | Through holes | Area (m²) | Volume (m³) | IfcOpenShell volume (m³) |', '| --- | --- | --- | --- | --- | --- | --- |']
    for e in m['elements']:
        lines.append(f"| {e['object']} | {e['triangles']} | {'yes' if e['closed'] else 'no'} | {e['throughHoles']} | {e['surfaceArea_m2']} | {e['enclosedVolume_m3']} | {e['ifcopenshellVolume_m3']} |")
    q = results['quantities']['quantities']
    lines += ['', '## Quantities traced to source objects (BIM-006), original sample', '', '| Id | Quantity | Value | Unit | Method |', '| --- | --- | --- | --- | --- |']
    lines += [f"| {r['id']} | {r['quantity']} | {r['value'] if r['value'] is not None else 'unavailable'} | {r['unit']} | {r['method']} |" for r in q['quantities']]
    lines += ['', '| Cross-check | First | Second | Agree |', '| --- | --- | --- | --- |']
    lines += [f"| {c['check']} | {c['first']} | {c['second']} | {'yes' if c['agree'] else 'no'} |" for c in q['crossChecks']]
    lines.append('')
    rnd = results['randori']['ids']
    lines += ['## Randori cards, checked against the edited copy', '', '| Card | Result |', '| --- | --- |']
    lines += [f"| {s['identifier']} {s['name']} | {s['status']} |" for s in rnd['specifications']]
    lines.append('')
    return '\n'.join(lines)


def main(argv: list[str]) -> None:
    if len(argv) != 3:
        fail('usage: bim_pathway.py <examples-dir> <out-dir>')
    examples, out = Path(argv[1]), Path(argv[2])
    for name in (SOURCE_IFC, PRACTICE_IDS, RANDORI_IDS):
        if not (examples / name).is_file():
            fail(f'missing input {examples / name}')
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    make_edit(examples / SOURCE_IFC, out / EDITED_IFC)
    models = {'original': open_ifc(examples / SOURCE_IFC), 'edited': open_ifc(out / EDITED_IFC)}
    results: dict[str, dict[str, dict[str, object]]] = {}
    for key, model in models.items():
        folder = out / key
        folder.mkdir()
        ids_summary, ids_full = ids_check(examples / PRACTICE_IDS, model)
        results[key] = {'ids': ids_summary, 'schema': schema_validation(model), 'geometry': geometry(model)}
        write_json(folder / 'inspection.json', inspection(model))
        write_json(folder / 'properties.json', properties(model))
        write_json(folder / 'ids.json', ids_summary)
        write_json(folder / 'ids-ifctester.json', ids_full)
        write_json(folder / 'schema.json', results[key]['schema'])
        write_json(folder / 'geometry.json', results[key]['geometry'])

    randori_summary, randori_full = ids_check(examples / RANDORI_IDS, models['edited'])
    (out / 'randori').mkdir()
    write_json(out / 'randori' / 'ids.json', randori_summary)
    write_json(out / 'randori' / 'ids-ifctester.json', randori_full)
    results['randori'] = {'ids': randori_summary}

    (out / 'mesh').mkdir()
    obj_text, mesh_data = mesh(models['original'])
    (out / 'mesh' / MESH_OBJ).write_text(obj_text, encoding='utf-8')
    write_json(out / 'mesh' / 'mesh-checks.json', mesh_data)
    if not mesh_data['allClosed'] or not mesh_data['allVolumesAgree']:
        fail('a mesh is open or its enclosed volume differs from IfcOpenShell\'s volume')
    results['mesh'] = {'mesh': mesh_data}
    (out / 'quantities').mkdir()
    quantity_data = quantities(models['original'])
    write_json(out / 'quantities' / 'quantities.json', quantity_data)
    (out / 'quantities' / 'quantities.csv').write_text(quantities_csv(quantity_data), encoding='utf-8')
    results['quantities'] = {'quantities': quantity_data}

    before, after = properties(models['original']), properties(models['edited'])
    changes = []
    for element, data in after.items():
        for pset_name, pset in data['propertySets'].items():
            for prop, value in pset['properties'].items():
                old = before.get(element, {}).get('propertySets', {}).get(pset_name, {}).get('properties', {}).get(prop)
                if old != value:
                    changes.append({'element': element, 'GlobalId': data['GlobalId'], 'property': f'{pset_name}.{prop}', 'before': old, 'after': value})
    original_ids = {e.GlobalId for e in models['original'].by_type('IfcRoot')}
    edited_ids = {e.GlobalId for e in models['edited'].by_type('IfcRoot')}
    write_json(out / 'change.json', {
        'edit': EDIT,
        'propertyChanges': changes,
        'globalIdsInOriginal': len(original_ids),
        'globalIdsKept': len(original_ids & edited_ids),
        'globalIdsAdded': len(edited_ids - original_ids),
    })

    py = sys.version_info
    manifest = {
        'tools': {'ifcopenshell': ifcopenshell.version, 'ifctester': ifctester.__version__, 'python': f'{py.major}.{py.minor}'},
        'inputs': {name: sha256(examples / name) for name in (SOURCE_IFC, PRACTICE_IDS, RANDORI_IDS)},
        'edited': {EDITED_IFC: sha256(out / EDITED_IFC)},
    }
    write_json(out / 'manifest.json', manifest)
    (out / 'summary.md').write_text(summary_markdown(results, manifest), encoding='utf-8')


if __name__ == '__main__':
    main(sys.argv)
