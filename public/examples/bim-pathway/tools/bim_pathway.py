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

import datetime
import hashlib
import importlib.metadata
import json
import logging
import shutil
import sys
import uuid
import xml.etree.ElementTree as ET
from pathlib import Path

import ifcopenshell
import ifcopenshell.api.pset
import ifcopenshell.api.sequence
import ifcopenshell.geom
import ifcopenshell.guid
import ifcopenshell.util.element
import ifcopenshell.util.representation
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



# --- BIM-007: coordination, an authored duct, clashes and an issue register ------------------------------------------
COORDINATION_BRIEF = 'coordination-brief.json'
REVIEW_GATES = 'review-gates.json'
COORDINATION_IFC = 'wall-with-opening-and-window.coordination.ifc'
PLANNED_IFC = 'wall-with-opening-and-window.planned.ifc'
FIXED_DATE = '2026-11-21T00:00:00'
BCF_DATE = '2026-11-21T00:00:00+00:00'
BCF_AUTHOR = 'Developer Dojo practice (not a person)'
# Every GlobalId and BCF Guid the script creates is derived from a name, so the outputs are byte-for-byte reproducible.
GUID_NAMESPACE = uuid.UUID('6f1c9a52-3d0e-5b7a-9c41-2b8e0d6a9f13')
# The XSD files bcf-client 0.9.0 ships, and the git blob ids of buildingSMART's official files at the v3.0 and v2.1 tags
# (github.com/buildingSMART/BCF-XML). A blob id is SHA-1 over "blob <size>\0" and the bytes, as git computes it.
OFFICIAL_BCF_XSD = {
    'v3': {'tag': 'v3.0', 'commit': '5834466b2477ac700d7a61990b4e67ec1005cc68', 'blobs': {
        'documents.xsd': 'f02331f65c32ef31c0b39f7fe11992d719cb910f', 'extensions.xsd': 'f22f79d88dedd249a5e6df012c9eb093b655f963',
        'markup.xsd': '59185058a3076765f7d468c7100fe75a68b3b05d', 'project.xsd': '9383d037df8d1b24dd6727402e090eb813f6bd53',
        'shared-types.xsd': '93dd4843fb1173818181905c94f2b4602ffe7f2d', 'version.xsd': '608b45fa71b0eef4f99563c9af30205b17143c88',
        'visinfo.xsd': '6e3053aa6a8346f1847189b9115ed83235d1c451'}},
    'v2': {'tag': 'v2.1', 'commit': 'a0fbab777706b5ac282105f724979e1f8e271e51', 'blobs': {
        'markup.xsd': '037464ee8f6726f1c8ef08fb900a06090fa1d5e6', 'project.xsd': '8203889b6c71edba8588319bbb05c32ef00e28e5',
        'version.xsd': '55cbd2be900f0b8b9f9c246e6705a9066681b64c', 'visinfo.xsd': '19cdf95d9746f421876c6de6796112622d79f3d0'}},
}
# The official BCF 2.1 visinfo.xsd limits a perspective camera's FieldOfView to 45-60 degrees.
BCF21_FIELD_OF_VIEW = (45.0, 60.0)


def guid_for(label: str) -> str:
    return ifcopenshell.guid.compress(uuid.uuid5(GUID_NAMESPACE, label).hex)


def bcf_guid(label: str) -> str:
    return str(uuid.uuid5(GUID_NAMESPACE, label))


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (OSError, ValueError) as err:
        fail(f'cannot read {path.name}: {err}')
        raise


def fixed_header(model: ifcopenshell.file, name: str, authorization: str) -> None:
    header = model.header.file_name
    header.name = name
    header.time_stamp = FIXED_DATE
    header.author = EDITED_HEADER['author']
    header.organization = EDITED_HEADER['organization']
    header.preprocessor_version = f'IfcOpenShell {ifcopenshell.version}'
    header.originating_system = 'Developer Dojo /examples/bim-pathway/tools/bim_pathway.py'
    header.authorization = authorization


def stable_new_guids(model: ifcopenshell.file, before: set[str], label: str) -> None:
    """Give every IfcRoot the API created a GlobalId derived from its place in the file, instead of a random one."""
    for entity in sorted(model.by_type('IfcRoot'), key=lambda e: e.id()):
        if entity.GlobalId not in before:
            entity.GlobalId = guid_for(f'{label}:{entity.id()}:{entity.is_a()}')


def element_by_role(model: ifcopenshell.file, role: str) -> ifcopenshell.entity_instance:
    classes = {'wall': 'IfcWall', 'opening': 'IfcOpeningElement', 'window': 'IfcWindow', 'duct': 'IfcDuctSegment'}
    if role not in classes:
        fail(f'unknown element role {role!r} in {COORDINATION_BRIEF}')
    found = model.by_type(classes[role])
    if len(found) != 1:
        fail(f'expected one {classes[role]}, found {len(found)}')
    return found[0]


def author_duct(model: ifcopenshell.file, brief: dict) -> ifcopenshell.entity_instance:
    """Add the brief's duct to the model with plain IFC4 entities: a rectangle profile extruded along the duct axis,
    placed in the storey, contained in it and grouped into a ventilation system."""
    d = brief['duct']
    to_model = 1 / ifcopenshell.util.unit.calculate_unit_scale(model)  # metres to the model length unit
    container = ifcopenshell.util.element.get_container(element_by_role(model, 'wall'))
    if container is None:
        fail('the wall has no spatial container to put the duct in')
    body = ifcopenshell.util.representation.get_context(model, 'Model', 'Body', 'MODEL_VIEW')
    if body is None:
        fail('the sample has no Model/Body/MODEL_VIEW context')
    origin = model.createIfcCartesianPoint([float(c * to_model) for c in d['start_m']])
    axis = model.createIfcDirection([0.0, 1.0, 0.0])  # the extrusion (local Z) runs along world +Y
    ref = model.createIfcDirection([1.0, 0.0, 0.0])  # local X stays world X, so the profile width is along the wall
    placement = model.createIfcLocalPlacement(container.ObjectPlacement, model.createIfcAxis2Placement3D(origin, axis, ref))
    profile = model.createIfcRectangleProfileDef('AREA', 'Duct section', model.createIfcAxis2Placement2D(model.createIfcCartesianPoint([0.0, 0.0]), None), float(d['width_m'] * to_model), float(d['height_m'] * to_model))
    solid = model.createIfcExtrudedAreaSolid(profile, model.createIfcAxis2Placement3D(model.createIfcCartesianPoint([0.0, 0.0, 0.0]), None, None), model.createIfcDirection([0.0, 0.0, 1.0]), float(d['length_m'] * to_model))
    shape = model.createIfcProductDefinitionShape(None, None, [model.createIfcShapeRepresentation(body, 'Body', 'SweptSolid', [solid])])
    duct = model.createIfcDuctSegment(guid_for('duct:' + d['name']), None, d['name'], d['description'], None, placement, shape, d['tag'], d['predefinedType'])
    rels = [r for r in model.by_type('IfcRelContainedInSpatialStructure') if r.RelatingStructure == container]
    if len(rels) != 1:
        fail(f'expected one containment relationship for the storey, found {len(rels)}')
    rels[0].RelatedElements = list(rels[0].RelatedElements) + [duct]
    system = model.createIfcDistributionSystem(guid_for('system:' + d['system']), None, d['system'], 'Practice system for the coordination kata', None, None, 'VENTILATION')
    model.createIfcRelAssignsToGroup(guid_for('group:' + d['system']), None, None, None, [duct], None, system)
    return duct


def box_of(entry: dict) -> tuple[list[float], list[float]]:
    return entry['bbox_m']['min'], entry['bbox_m']['max']


def box_overlap(a: tuple[list[float], list[float]], b: tuple[list[float], list[float]]) -> float:
    volume = 1.0
    for axis in range(3):
        side = min(a[1][axis], b[1][axis]) - max(a[0][axis], b[0][axis])
        if side <= 0:
            return 0.0
        volume *= side
    return volume


def box_gap(a: tuple[list[float], list[float]], b: tuple[list[float], list[float]]) -> float:
    return sum(max(0.0, b[0][axis] - a[1][axis], a[0][axis] - b[1][axis]) ** 2 for axis in range(3)) ** 0.5


def overlap_box(a: tuple[list[float], list[float]], b: tuple[list[float], list[float]]) -> tuple[list[float], list[float]]:
    return [max(a[0][i], b[0][i]) for i in range(3)], [min(a[1][i], b[1][i]) for i in range(3)]


def clash_tree(model: ifcopenshell.file, elements: list[ifcopenshell.entity_instance], geo: dict[int, dict]) -> tuple['ifcopenshell.geom.tree', float]:
    """The same tree and settings IfcClash 0.9 uses, with one thread so the result does not depend on scheduling.

    Returns the tree and the factor from the tree's length unit to metres. The unit is measured, not assumed: each
    element's placed triangles (local vertices through the shape matrix, as the tree places them) must give the same
    box as geometry() gives in metres, for one known factor. Any other result stops the script, so a placement or unit
    difference between the two routes cannot pass as "no clash"."""
    tree = ifcopenshell.geom.tree(backend='opencascade.trianglebvh')
    iterator = ifcopenshell.geom.iterator(ifcopenshell.geom.settings(), model, 1, include=elements)
    if not iterator.initialize():
        fail('the clash tree could not build any shape')
    placed: dict[int, tuple[list[float], list[float]]] = {}
    while True:
        shape = iterator.get()
        verts = ifcopenshell.util.shape.get_vertices(shape.geometry)
        matrix = ifcopenshell.util.shape.get_shape_matrix(shape)
        world = verts @ matrix[:3, :3].T + matrix[:3, 3]
        placed[shape.id] = ([float(v) for v in world.min(axis=0)], [float(v) for v in world.max(axis=0)])
        tree.add_element(shape)
        if not iterator.next():
            break
    missing = [e.id() for e in elements if e.id() not in placed]
    if missing:
        fail(f'the clash tree did not build {missing}')
    for factor in (1.0, 0.001):
        if all(abs(placed[e.id()][k][i] * factor - box_of(geo[e.id()])[k][i]) < 1e-6 for e in elements for k in (0, 1) for i in range(3)):
            return tree, factor
    seen = {f'#{e.id()}={e.is_a()}': {'tree': placed[e.id()], 'geometry_m': box_of(geo[e.id()])} for e in elements}
    fail(f'the clash tree places the elements differently from geometry() (neither metre nor millimetre): {seen}')


def tree_results(results: tuple, scale: float, keep: str) -> list[dict[str, object]]:
    """One result per pair: the deepest penetration (keep='max') or the smallest gap (keep='min')."""
    pairs: dict[tuple[str, str], dict[str, object]] = {}
    for r in results:
        entry = {
            'a': f'#{r.a.id()}={r.a.is_a()}', 'aGlobalId': r.a.GlobalId, 'b': f'#{r.b.id()}={r.b.is_a()}', 'bGlobalId': r.b.GlobalId,
            'type': ifcopenshell.geom.tree.get_clash_type(r.clash_type), 'distance_m': num(r.distance * scale),
            'p1_m': [num(c * scale) for c in r.p1], 'p2_m': [num(c * scale) for c in r.p2],
        }
        key = (entry['a'], entry['b'])
        held = pairs.get(key)
        if held is None or (entry['distance_m'] > held['distance_m'] if keep == 'max' else entry['distance_m'] < held['distance_m']):
            pairs[key] = entry
    return [pairs[k] for k in sorted(pairs)]


def coordination(model: ifcopenshell.file, brief: dict, clearance_m: float | None) -> dict[str, object]:
    """Clashes between the duct and every other physical element, by two independent routes: IfcOpenShell's clash tree
    (as IfcClash runs it) and plain box arithmetic. The script stops if the routes disagree. With clearance_m, also the
    pairs that do not touch but are closer than the clearance (the Randori requirement card)."""
    duct = element_by_role(model, 'duct')
    others = [element_by_role(model, role) for role in ('wall', 'window')]
    geo = {e['id']: e for e in geometry(model)['elements']}
    # The box route holds only if every element is its bounding box (the wall: its box less the opening's box).
    opening = element_by_role(model, 'opening')
    wall = element_by_role(model, 'wall')
    def box_volume(box: tuple[list[float], list[float]]) -> float:
        return box_overlap(box, box)
    box_checks = [
        {'element': f'#{duct.id()}={duct.is_a()}', 'built_m3': geo[duct.id()]['volume_m3'], 'boxes_m3': num(box_volume(box_of(geo[duct.id()])))},
        {'element': f'#{others[1].id()}={others[1].is_a()}', 'built_m3': geo[others[1].id()]['volume_m3'], 'boxes_m3': num(box_volume(box_of(geo[others[1].id()])))},
        {'element': f'#{wall.id()}={wall.is_a()}', 'built_m3': geo[wall.id()]['volume_m3'], 'boxes_m3': num(box_volume(box_of(geo[wall.id()])) - box_overlap(box_of(geo[wall.id()]), box_of(geo[opening.id()])))},
    ]
    for c in box_checks:
        c['agree'] = abs(c['built_m3'] - c['boxes_m3']) < 1e-6
        if not c['agree']:
            fail(f"box route does not hold for {c['element']}: built {c['built_m3']} m3, boxes {c['boxes_m3']} m3")
    analytic = []
    duct_box = box_of(geo[duct.id()])
    for other in others:
        box = box_of(geo[other.id()])
        volume = box_overlap(duct_box, box)
        if other == wall:
            volume -= box_overlap(overlap_box(duct_box, box), box_of(geo[opening.id()])) if box_overlap(duct_box, box) > 0 else 0.0
        analytic.append({'element': f'#{other.id()}={other.is_a()}', 'GlobalId': other.GlobalId, 'overlap_m3': num(volume), 'gap_m': num(box_gap(duct_box, box)) if volume <= 0 else 0.0})

    lo, hi = duct_box
    tree, scale = clash_tree(model, [duct] + others, geo)
    tolerance = float(brief['rules']['hardClash']['tolerance_m'])
    # Tolerances go into the tree in its own length unit and results come back in it; scale converts to metres.
    raw = tree.clash_intersection_many([duct], others, tolerance=tolerance / scale, check_all=True)
    hard = tree_results(raw, scale, keep='max')
    for clash in hard:
        for point in (clash['p1_m'], clash['p2_m']):
            if not all(lo[i] - 0.01 <= point[i] <= hi[i] + 0.01 for i in range(3)):
                fail(f'clash point {point} is outside the duct box {lo} to {hi}: the tree is not in the unit assumed')
    tree_hard = sorted(c['b'] for c in hard)
    box_hard = sorted(a['element'] for a in analytic if a['overlap_m3'] > 0)
    if tree_hard != box_hard:
        # Say what the tree does see, so the disagreement can be read from the log.
        touching = [f'{c["a"]}/{c["b"]} {c["type"]}' for c in tree_results(tree.clash_collision_many([duct], others, allow_touching=True), scale, keep='max')]
        fail(f'hard clashes disagree: clash tree {tree_hard}, box route {box_hard}; tree collisions (touching allowed): {touching}; unit factor {scale}')
    result: dict[str, object] = {
        'checked': 'Hard clashes between the practice duct and every other physical element, by IfcOpenShell\'s clash tree (the opencascade.trianglebvh tree and the intersection test IfcClash 0.9 uses) and, independently, by box arithmetic on the built shapes. The script writes nothing if the two routes disagree. The opening is a void, not a physical element, so it is not tested on its own.',
        'tolerance_m': tolerance,
        'treeLengthUnitToMetre': scale,
        'boxRoute': {'holds': True, 'checks': box_checks, 'pairs': analytic},
        'clashTree': {'hard': hard},
        'hardClashes': box_hard,
        'routesAgree': True,
    }
    if clearance_m is not None:
        raw_clear = tree.clash_clearance_many([duct], others, clearance=clearance_m / scale, check_all=True)
        near = [c for c in tree_results(raw_clear, scale, keep='min') if c['b'] not in box_hard]
        box_near = sorted(a['element'] for a in analytic if a['overlap_m3'] <= 0 and a['gap_m'] < clearance_m)
        if sorted(c['b'] for c in near) != box_near:
            fail(f'clearance results disagree: clash tree {[c["b"] for c in near]}, box route {box_near}')
        for c in near:
            gap = next(a['gap_m'] for a in analytic if a['element'] == c['b'])
            if abs(c['distance_m'] - gap) > 1e-4:
                fail(f"clearance distance to {c['b']} disagrees: clash tree {c['distance_m']} m, box route {gap} m")
        result['clearance_m'] = clearance_m
        result['clashTree']['clearance'] = near
        result['clearanceClashes'] = box_near
    return result


def issue_register(model: ifcopenshell.file, clashes: dict[str, object], brief: dict, model_path: str) -> list[dict[str, object]]:
    duct = element_by_role(model, 'duct')
    fire = ifcopenshell.util.element.get_pset(element_by_role(model, 'wall'), 'Pset_WallCommon', 'FireRating')
    geo = {e['id']: e for e in geometry(model)['elements']}
    issues = []
    for n, element in enumerate(clashes['hardClashes'], start=1):
        other = model.by_id(int(element.split('=')[0][1:]))
        pair = next(p for p in clashes['boxRoute']['pairs'] if p['element'] == element)
        lo, hi = overlap_box(box_of(geo[duct.id()]), box_of(geo[other.id()]))
        issues.append({
            'id': f'ISS-{n:03d}', 'type': 'Clash', 'kind': 'hard clash', 'status': 'Open', 'priority': 'High',
            'title': f'{duct.Name} passes through {other.Name or other.is_a()} with no opening for it',
            'elements': [f'#{duct.id()}={duct.is_a()}', element], 'GlobalIds': [duct.GlobalId, other.GlobalId],
            'measure': {'overlap_m3': pair['overlap_m3']}, 'location_m': [num((lo[i] + hi[i]) / 2) for i in range(3)],
            'description': f"The duct and the wall overlap by {pair['overlap_m3']} m³. The wall has no opening at that point, and its Pset_WallCommon.FireRating is “{fire}” (the practice label from BIM-004). Resolve by rerouting the duct or by a builder’s work opening with a fire-stopping detail; either needs the reviewers in gates G2 and G3 of the review package.",
            'assignedTo': brief['issueOwner'], 'reviewGates': ['G2', 'G3'], 'model': model_path,
        })
    return issues


def clearance_issues(model: ifcopenshell.file, clashes: dict[str, object], base: list[dict[str, object]], brief: dict, model_path: str) -> list[dict[str, object]]:
    duct = element_by_role(model, 'duct')
    issues = [dict(i) for i in base]
    for element in clashes['clearanceClashes']:
        other = model.by_id(int(element.split('=')[0][1:]))
        pair = next(p for p in clashes['boxRoute']['pairs'] if p['element'] == element)
        issues.append({
            'id': f'ISS-{len(issues) + 1:03d}', 'type': 'Clearance', 'kind': 'clearance', 'status': 'Open', 'priority': 'Normal',
            'title': f'{duct.Name} is {pair["gap_m"]} m from {other.Name or other.is_a()}, closer than the {clashes["clearance_m"]} m clearance',
            'elements': [f'#{duct.id()}={duct.is_a()}', element], 'GlobalIds': [duct.GlobalId, other.GlobalId],
            'measure': {'gap_m': pair['gap_m'], 'clearance_m': clashes['clearance_m']}, 'location_m': None,
            'description': f"Card CARD-R changes the requirement: keep {clashes['clearance_m']} m between the duct and every other element. The duct does not touch the window, but the gap is {pair['gap_m']} m.",
            'assignedTo': brief['issueOwner'], 'reviewGates': ['G2'], 'model': model_path,
        })
    return issues


def issues_csv(issues: list[dict[str, object]]) -> str:
    import csv
    import io

    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator='\n')
    writer.writerow(['id', 'type', 'status', 'priority', 'title', 'elements', 'GlobalIds', 'measure', 'assignedTo', 'reviewGates'])
    for i in issues:
        measure = ' '.join(f'{k}={v}' for k, v in sorted(i['measure'].items()))
        writer.writerow([i['id'], i['type'], i['status'], i['priority'], i['title'], ' '.join(i['elements']), ' '.join(i['GlobalIds']), measure, i['assignedTo'], ' '.join(i['reviewGates'])])
    return buffer.getvalue()


def xml_text(element: ET.Element) -> bytes:
    ET.indent(element)
    return b'<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(element, encoding='utf-8', xml_declaration=False) + b'\n'


def sub(parent: ET.Element, tag: str, text: str | None = None, **attrs: str) -> ET.Element:
    child = ET.SubElement(parent, tag, {k: v for k, v in attrs.items()})
    if text is not None:
        child.text = text
    return child


def camera(issue: dict[str, object]) -> tuple[list[float], list[float], list[float]]:
    """A perspective camera 3 m in front of the issue (on the -Y side of the wall), looking at it."""
    target = issue['location_m'] or [1.5, 0.15, 1.0]
    eye = [target[0], num(target[1] - 3.0), target[2]]
    return eye, [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]


def write_bcf(path: Path, issues: list[dict[str, object]], project_guid: str, model_path: str, version: str, people: list[str]) -> list[dict[str, bytes]]:
    """A BCF zip with one topic per issue, a viewpoint that selects the issue's elements, and no snapshot.
    Entries are written in a fixed order with fixed dates, so the zip is byte-for-byte reproducible."""
    import zipfile

    entries: list[tuple[str, bytes]] = []
    if version == '3.0':
        entries.append(('bcf.version', xml_text(ET.Element('Version', {'VersionId': '3.0'}))))
        ext = ET.Element('Extensions')
        for group, item, values in (('TopicTypes', 'TopicType', sorted({i['type'] for i in issues})), ('TopicStatuses', 'TopicStatus', ['Open']), ('Priorities', 'Priority', ['High', 'Normal']), ('TopicLabels', 'TopicLabel', ['Coordination', 'Practice']), ('Users', 'User', people)):
            g = sub(ext, group)
            for v in values:
                sub(g, item, v)
        entries.append(('extensions.xml', xml_text(ext)))
    else:
        v = ET.Element('Version', {'VersionId': '2.1'})
        sub(v, 'DetailedVersion', '2.1')
        entries.append(('bcf.version', xml_text(v)))
    for issue in issues:
        topic_guid = bcf_guid('topic:' + issue['id'])
        view_guid = bcf_guid('viewpoint:' + issue['id'])
        comment_guid = bcf_guid('comment:' + issue['id'])
        markup = ET.Element('Markup')
        header = sub(markup, 'Header')
        if version == '3.0':
            f = sub(sub(header, 'Files'), 'File', IfcProject=project_guid, IsExternal='true')
        else:
            f = sub(header, 'File', IfcProject=project_guid, isExternal='true')
        sub(f, 'Filename', Path(model_path).name)
        sub(f, 'Reference', model_path)
        topic = sub(markup, 'Topic', Guid=topic_guid, TopicType=issue['type'], TopicStatus=issue['status'])
        sub(topic, 'Title', f"{issue['id']}: {issue['title']}")
        sub(topic, 'Priority', issue['priority'])
        if version == '3.0':
            labels = sub(topic, 'Labels')
            for label in ('Coordination', 'Practice'):
                sub(labels, 'Label', label)
        else:
            for label in ('Coordination', 'Practice'):
                sub(topic, 'Labels', label)
        sub(topic, 'CreationDate', BCF_DATE)
        sub(topic, 'CreationAuthor', BCF_AUTHOR)
        sub(topic, 'AssignedTo', issue['assignedTo'])
        sub(topic, 'Description', issue['description'] + ' Practice issue on a test file; not a real coordination record.')
        comment_text = 'Raised by the Developer Dojo pathway script. Nobody has reviewed or resolved it.'
        if version == '3.0':
            comment = sub(sub(topic, 'Comments'), 'Comment', Guid=comment_guid)
            sub(comment, 'Date', BCF_DATE)
            sub(comment, 'Author', BCF_AUTHOR)
            sub(comment, 'Comment', comment_text)
            sub(comment, 'Viewpoint', Guid=view_guid)
            sub(sub(sub(topic, 'Viewpoints'), 'ViewPoint', Guid=view_guid), 'Viewpoint', 'viewpoint.bcfv')
        else:
            comment = sub(markup, 'Comment', Guid=comment_guid)
            sub(comment, 'Date', BCF_DATE)
            sub(comment, 'Author', BCF_AUTHOR)
            sub(comment, 'Comment', comment_text)
            sub(comment, 'Viewpoint', Guid=view_guid)
            sub(sub(markup, 'Viewpoints', Guid=view_guid), 'Viewpoint', 'viewpoint.bcfv')
        vis = ET.Element('VisualizationInfo', {'Guid': view_guid})
        components = sub(vis, 'Components')
        selection = sub(components, 'Selection')
        for g in issue['GlobalIds']:
            sub(selection, 'Component', IfcGuid=g)
        sub(components, 'Visibility', DefaultVisibility='true')
        eye, direction, up = camera(issue)
        cam = sub(vis, 'PerspectiveCamera')
        for tag, vector in (('CameraViewPoint', eye), ('CameraDirection', direction), ('CameraUpVector', up)):
            point = sub(cam, tag)
            for axis, value in zip('XYZ', vector):
                sub(point, axis, repr(float(value)))
        sub(cam, 'FieldOfView', '60.0')
        if version == '3.0':
            sub(cam, 'AspectRatio', '1.5')
        entries.append((f'{topic_guid}/markup.bcf', xml_text(markup)))
        entries.append((f'{topic_guid}/viewpoint.bcfv', xml_text(vis)))
    with zipfile.ZipFile(path, 'w') as archive:
        for name, data in entries:
            info = zipfile.ZipInfo(name, date_time=(2026, 11, 21, 0, 0, 0))
            info.compress_type = zipfile.ZIP_STORED
            info.create_system = 3
            info.external_attr = 0o644 << 16
            archive.writestr(info, data)
    return [{'name': name, 'data': data} for name, data in entries]


def git_blob(data: bytes) -> str:
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()


def check_bcf(path: Path, entries: list[dict[str, bytes]], version: str, model: ifcopenshell.file) -> dict[str, object]:
    """Validate each XML part against the schema files bcf-client ships, compare those schema files with
    buildingSMART's official ones, and read the zip back with bcf-client."""
    import bcf
    import xmlschema

    key = 'v3' if version == '3.0' else 'v2'
    xsd_dir = Path(bcf.__file__).parent / key / 'xsd'
    provenance = []
    for name, blob in sorted(OFFICIAL_BCF_XSD[key]['blobs'].items()):
        installed = xsd_dir / name
        if not installed.is_file():
            fail(f'bcf-client has no {key}/xsd/{name}')
        provenance.append({'file': name, 'matchesOfficial': git_blob(installed.read_bytes()) == blob})
    schemas = {}
    def schema(name: str) -> 'xmlschema.XMLSchema':
        if name not in schemas:
            schemas[name] = xmlschema.XMLSchema(str(xsd_dir / name))
        return schemas[name]
    parts = []
    for entry in entries:
        name = entry['name']
        xsd = 'version.xsd' if name == 'bcf.version' else 'extensions.xsd' if name == 'extensions.xml' else 'markup.xsd' if name.endswith('markup.bcf') else 'visinfo.xsd'
        errors = [str(e.reason) for e in schema(xsd).iter_errors(entry['data'].decode('utf-8'))]
        parts.append({'part': name.split('/')[-1] if '/' in name else name, 'topic': name.split('/')[0] if '/' in name else None, 'schema': xsd, 'errors': errors})
        if errors:
            fail(f'BCF {version} {name} is not valid against bcf-client {key}/xsd/{xsd}: {errors[0]}')
    if key == 'v3':
        from bcf.v3.bcfxml import BcfXml
    else:
        from bcf.v2.bcfxml import BcfXml
    known = {e.GlobalId for e in model.by_type('IfcRoot')}
    topics = []
    try:
        with BcfXml.load(path) as bcfxml:
            for guid, handler in sorted(bcfxml.topics.items()):
                selected = []
                for viewpoint in handler.viewpoints.values():
                    components = viewpoint.visualization_info.components
                    if components is not None and components.selection is not None:
                        selected += [c.ifc_guid for c in components.selection.component]
                topics.append({'guid': guid, 'title': handler.topic.title, 'status': handler.topic.topic_status, 'selected': selected, 'selectedInModel': all(g in known for g in selected)})
    except Exception as err:  # bcf-client raises xsdata and zipfile errors; any of them means the file did not read back
        fail(f'bcf-client could not read {path.name} back: {err}')
    if not topics or not all(t['selectedInModel'] and t['selected'] for t in topics):
        fail(f'{path.name}: a topic selects no element or an element that is not in the model')
    return {
        'version': version,
        'validatedWith': f"bcf-client {importlib.metadata.version('bcf-client')} schema files ({key}/xsd), with xmlschema {xmlschema.__version__}",
        'schemaFiles': provenance,
        'official': {'repository': 'https://github.com/buildingSMART/BCF-XML', 'tag': OFFICIAL_BCF_XSD[key]['tag'], 'commit': OFFICIAL_BCF_XSD[key]['commit']},
        'parts': parts,
        'readBack': {'tool': 'bcf-client', 'topics': topics},
        'snapshots': 0,
    }


# --- BIM-008: the model mapped to a construction sequence and an unpriced cost plan -----------------------------------
def plan(model: ifcopenshell.file, brief: dict, issues: list[dict[str, object]], quantity_rows: list[dict[str, object]]) -> dict[str, object]:
    """Add the brief's tasks to the model, assign each element to the task that builds it, and derive each dependency
    from a relationship in the model or from an open issue. Durations are not invented: none is set."""
    before = {e.GlobalId for e in model.by_type('IfcRoot')}
    schedule = ifcopenshell.api.sequence.add_work_schedule(model, name=brief['schedule']['name'], predefined_type='PLANNED', start_time=datetime.datetime(2026, 11, 21))
    schedule.CreationDate = FIXED_DATE
    tasks = {}
    outputs: dict[int, str] = {}
    for spec in brief['schedule']['tasks']:
        task = ifcopenshell.api.sequence.add_task(model, work_schedule=schedule, name=spec['name'], identification=spec['id'], predefined_type=spec['predefinedType'])
        task.Description = spec['description']
        tasks[spec['id']] = task
        for role in spec['builds']:
            element = element_by_role(model, role)
            if element.id() in outputs:
                fail(f"{spec['id']} and {outputs[element.id()]} both build #{element.id()}")
            outputs[element.id()] = spec['id']
            ifcopenshell.api.sequence.assign_product(model, relating_product=element, related_object=task)
    physical = [e for e in model.by_type('IfcElement')]
    unassigned = [f'#{e.id()}={e.is_a()}' for e in physical if e.id() not in outputs]
    if unassigned:
        fail(f'no task builds {unassigned}')
    task_of = {element_id: tasks[task_id] for element_id, task_id in outputs.items()}
    deps: dict[tuple[str, str], list[str]] = {}
    def depend(before_task: ifcopenshell.entity_instance, after_task: ifcopenshell.entity_instance, why: str) -> None:
        if before_task != after_task:
            deps.setdefault((before_task.Identification, after_task.Identification), []).append(why)
    for fills in model.by_type('IfcRelFillsElement'):
        opening = fills.RelatingOpeningElement
        for voids in opening.VoidsElements:
            depend(task_of[voids.RelatingBuildingElement.id()], task_of[fills.RelatedBuildingElement.id()], f'#{fills.RelatedBuildingElement.id()} fills #{opening.id()} (#{fills.id()} IfcRelFillsElement), which voids #{voids.RelatingBuildingElement.id()} (#{voids.id()} IfcRelVoidsElement)')
    for issue in issues:
        ids = [int(e.split('=')[0][1:]) for e in issue['elements']]
        duct_id, host_id = ids[0], ids[1]
        depend(task_of[host_id], task_of[duct_id], f"{issue['id']}: #{duct_id} passes through #{host_id}, so it goes in after it")
        for spec in brief['schedule']['tasks']:
            if spec.get('resolves') == issue['kind']:
                depend(task_of[duct_id], tasks[spec['id']], f"{issue['id']}: {spec['id']} seals the penetration once the duct is in")
    # Order: Kahn's algorithm, ties broken by task id, so a cycle stops the script.
    preds = {t: sorted(a for (a, b) in deps if b == t) for t in tasks}
    order, ready = [], sorted(t for t in tasks if not preds[t])
    remaining = {t: set(p) for t, p in preds.items()}
    while ready:
        current = ready.pop(0)
        order.append(current)
        for t in sorted(tasks):
            if current in remaining[t]:
                remaining[t].discard(current)
                if not remaining[t] and t not in order and t not in ready:
                    ready.append(t)
                    ready.sort()
    if len(order) != len(tasks):
        fail(f'the dependencies have a cycle: ordered {order} of {sorted(tasks)}')
    for (a, b) in sorted(deps):
        ifcopenshell.api.sequence.assign_sequence(model, relating_process=tasks[a], related_process=tasks[b], sequence_type='FINISH_START')
    stable_new_guids(model, before, 'planned')
    rows = []
    for spec in brief['schedule']['tasks']:
        builds = [f'#{e}={model.by_id(e).is_a()}' for e, t in sorted(outputs.items()) if t == spec['id']]
        rows.append({'task': spec['id'], 'name': spec['name'], 'predefinedType': spec['predefinedType'], 'builds': builds, 'after': preds[spec['id']], 'because': [w for (a, b), why in sorted(deps.items()) if b == spec['id'] for w in why], 'duration': None, 'heldBy': [i['id'] for i in issues if spec.get('resolves') == i['kind']]})
    by_id = {r['id']: r for r in quantity_rows}
    lines = []
    for spec in brief['costPlan']:
        source = spec['source']
        if source.startswith('Q-'):
            row = by_id.get(source)
            if row is None:
                fail(f'cost line {spec["id"]} cites {source}, which is not a traced quantity')
            quantity, unit = row['value'], row['unit']
        elif source == 'count':
            quantity, unit = len(model.by_type(spec['class'])), 'nr'
        elif source == 'issues':
            quantity, unit = sum(1 for i in issues if i['kind'] == spec['kind']), 'nr'
        elif source == 'duct-length':
            # The brief's length, checked against the built duct's extent along its axis (world Y).
            duct = element_by_role(model, 'duct')
            built = next(e for e in geometry(model)['elements'] if e['id'] == duct.id())
            extent = num(built['bbox_m']['max'][1] - built['bbox_m']['min'][1])
            if abs(extent - brief['duct']['length_m']) > 1e-6:
                fail(f"duct length {brief['duct']['length_m']} m disagrees with the built duct ({extent} m)")
            quantity, unit = extent, 'm'
        else:
            fail(f'cost line {spec["id"]} has an unknown source {source!r}')
            raise SystemExit
        if spec['task'] not in tasks:
            fail(f'cost line {spec["id"]} names task {spec["task"]}, which the schedule does not have')
        lines.append({'id': spec['id'], 'item': spec['item'], 'task': spec['task'], 'quantity': quantity, 'unit': unit, 'source': source, 'rate': None, 'amount': None, 'rateStatus': 'unavailable: no unit-rate source that may be reused has been chosen, and no contract measurement rules apply to a test file'})
    return {
        'schedule': {
            'checked': 'Tasks from the practice brief, written into the IFC copy with ifcopenshell.api.sequence: each physical element is assigned to the one task that builds it (IfcRelAssignsToProduct), and each dependency (IfcRelSequence, finish to start) is derived from a relationship in the model or an open issue, never typed in. The order is computed, and a cycle stops the script. No durations or dates are set, because no productivity source has been chosen.',
            'tasks': rows,
            'order': order,
            'dependencies': [{'before': a, 'after': b, 'type': 'FINISH_START', 'because': why} for (a, b), why in sorted(deps.items())],
        },
        'costPlan': {
            'checked': 'Each cost line cites a traced quantity (BIM-006), a count of model elements or an open issue, and the task it belongs to. No line is priced.',
            'lines': lines,
            'priced': sum(1 for l in lines if l['rate'] is not None),
        },
    }


def read_back_plan(model: ifcopenshell.file) -> dict[str, object]:
    """What the planned IFC file holds, read from the written file, for comparison with what the script meant to write."""
    builds = sorted([o.Identification, f'#{r.RelatingProduct.id()}={r.RelatingProduct.is_a()}'] for r in model.by_type('IfcRelAssignsToProduct') for o in r.RelatedObjects)
    sequences = sorted([r.RelatingProcess.Identification, r.RelatedProcess.Identification, r.SequenceType] for r in model.by_type('IfcRelSequence'))
    return {'tasks': sorted(t.Identification for t in model.by_type('IfcTask')), 'builds': builds, 'sequences': sequences, 'workSchedules': len(model.by_type('IfcWorkSchedule'))}


def table_csv(header: list[str], rows: list[list[object]]) -> str:
    import csv
    import io

    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator='\n')
    writer.writerow(header)
    for row in rows:
        writer.writerow(['unavailable' if v is None else v for v in row])
    return buffer.getvalue()


# --- The review package: who must review what before anything is used ------------------------------------------------
def review_package(gates: dict, deliverables: dict[str, str]) -> dict[str, object]:
    covered = set()
    out = []
    for gate in gates['gates']:
        for d in gate['deliverables']:
            if d not in deliverables:
                fail(f"review gate {gate['id']} names {d}, which the script does not produce")
            covered.add(d)
        if not gate['reviewers']:
            fail(f"review gate {gate['id']} names no reviewer")
        out.append({**gate, 'evidence': [deliverables[d] for d in gate['deliverables']], 'status': 'not-reviewed', 'reviewedBy': None, 'decision': None})
    missing = sorted(set(deliverables) - covered)
    if missing:
        fail(f'no review gate covers {missing}')
    return {
        'status': gates['status'],
        'gates': out,
        'deliverables': deliverables,
        'reviewed': sum(1 for g in out if g['status'] != 'not-reviewed'),
        'constructionReady': False,
        'boundary': gates['boundary'],
    }


def review_markdown(package: dict[str, object]) -> str:
    lines = ['# Review package (practice)', '', package['status'], '', package['boundary'], '', '| Gate | What is reviewed | Required reviewers | Evidence | Status |', '| --- | --- | --- | --- | --- |']
    for g in package['gates']:
        lines.append(f"| {g['id']} {g['name']} | {g['scope']} | {'; '.join(g['reviewers'])} | {' '.join(g['evidence'])} | not reviewed |")
    lines += ['', f"Gates reviewed: {package['reviewed']} of {len(package['gates'])}. Construction ready: no.", '']
    return '\n'.join(lines)


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



def summary_coordination(c: dict[str, object]) -> str:
    clashes, issues, bcf3, sched, cost, cards, review = c['clashes'], c['issues'], c['bcf3'], c['plan']['schedule'], c['plan']['costPlan'], c['cards'], c['review']
    lines = ['## Coordination (BIM-007): a practice duct, clashes and an issue register', '',
             f"Model: coordination/{COORDINATION_IFC}, the edited copy plus one Dojo-authored practice duct. Schema issues: {len(c['schema']['issues'])}.", '',
             '| Pair | Box route overlap (m³) | Box route gap (m) | Clash tree |', '| --- | --- | --- | --- |']
    tree = {t['b']: t for t in clashes['clashTree']['hard']}
    for p in clashes['boxRoute']['pairs']:
        t = tree.get(p['element'])
        lines.append(f"| duct and {p['element']} | {p['overlap_m3']} | {p['gap_m']} | {'hard clash, depth ' + str(t['distance_m']) + ' m' if t else 'no hard clash'} |")
    lines += ['', 'The two routes agree. The opening is a void, not a physical element.', '', '| Issue | Type | Status | Title | Review gates |', '| --- | --- | --- | --- | --- |']
    lines += [f"| {i['id']} | {i['type']} | {i['status']} | {i['title']} | {' '.join(i['reviewGates'])} |" for i in issues]
    lines += ['', f"BCF {bcf3['version']}: every part valid against the schema files bcf-client ships; read back with bcf-client: {len(bcf3['readBack']['topics'])} topic(s), every selected GlobalId found in the model.",
              'Schema files compared with buildingSMART BCF-XML ' + bcf3['official']['tag'] + ': ' + ', '.join(f"{f['file']} {'same' if f['matchesOfficial'] else 'differs'}" for f in bcf3['schemaFiles']) + '.', '',
              '## Schedule and cost mapping (BIM-008), preliminary', '', f"Model: planning/{PLANNED_IFC}. Order: {' → '.join(sched['order'])}. Durations: none set.", '',
              '| Task | Name | Builds | After | Because |', '| --- | --- | --- | --- | --- |']
    lines += [f"| {t['task']} | {t['name']} | {' '.join(t['builds']) or 'nothing modelled'} | {' '.join(t['after']) or '-'} | {'; '.join(t['because']) or '-'} |" for t in sched['tasks']]
    lines += ['', '| Cost line | Item | Task | Quantity | Unit | Source | Rate |', '| --- | --- | --- | --- | --- | --- | --- |']
    lines += [f"| {l['id']} | {l['item']} | {l['task']} | {l['quantity']} | {l['unit']} | {l['source']} | unavailable |" for l in cost['lines']]
    lines += ['', f"Priced lines: {cost['priced']} of {len(cost['lines'])}.", '', '## Specialist Randori (BIM-R02)', '', '| Card | Changes | Result |', '| --- | --- | --- |']
    lines += [f"| {k['id']} | {k['changes']} | {k['result']} |" for k in cards['cards']]
    lines += ['', '## Review package', '', '| Gate | Required reviewers | Status |', '| --- | --- | --- |']
    lines += [f"| {g['id']} {g['name']} | {'; '.join(g['reviewers'])} | not reviewed |" for g in review['gates']]
    lines += ['', 'Construction ready: no. Nothing in this folder is approved for any project.', '']
    return '\n'.join(lines)


def run_coordination(examples: Path, out: Path, quantity_rows: list[dict[str, object]]) -> dict[str, object]:
    brief = read_json(examples / COORDINATION_BRIEF)
    gates = read_json(examples / REVIEW_GATES)
    coord = out / 'coordination'
    coord.mkdir()
    model = open_ifc(out / EDITED_IFC)
    author_duct(model, brief)
    fixed_header(model, COORDINATION_IFC, 'Practice coordination copy, not approved for any project')
    model.write(str(coord / COORDINATION_IFC))
    model = open_ifc(coord / COORDINATION_IFC)  # every check below reads the written file, not the object in memory
    model_ref = f'coordination/{COORDINATION_IFC}'
    geo = geometry(model)
    if not geo['allBuilt']:
        fail('an element of the coordination model does not build')
    clashes = coordination(model, brief, None)
    issues = issue_register(model, clashes, brief, model_ref)
    if not issues:
        fail('the practice duct was routed to clash with the wall, but no hard clash was found')
    project = model.by_type('IfcProject')[0].GlobalId
    entries = write_bcf(coord / 'issues.bcf', issues, project, model_ref, '3.0', [brief['issueOwner']])
    bcf3 = check_bcf(coord / 'issues.bcf', entries, '3.0', model)
    schema = schema_validation(model)
    ids_summary, ids_full = ids_check(examples / PRACTICE_IDS, model)
    write_json(coord / 'geometry.json', geo)
    write_json(coord / 'clashes.json', clashes)
    write_json(coord / 'issues.json', {'status': 'Practice issues on a test file. Nobody has reviewed or resolved them.', 'issues': issues})
    (coord / 'issues.csv').write_text(issues_csv(issues), encoding='utf-8')
    write_json(coord / 'bcf-check.json', bcf3)
    write_json(coord / 'schema.json', schema)
    write_json(coord / 'ids.json', ids_summary)
    write_json(coord / 'ids-ifctester.json', ids_full)

    planning = out / 'planning'
    planning.mkdir()
    planned = open_ifc(coord / COORDINATION_IFC)
    plan_data = plan(planned, brief, issues, quantity_rows)
    fixed_header(planned, PLANNED_IFC, 'Practice sequence, not a programme for any project')
    planned.write(str(planning / PLANNED_IFC))
    planned = open_ifc(planning / PLANNED_IFC)
    sched = plan_data['schedule']
    expected = {
        'tasks': sorted(t['task'] for t in sched['tasks']),
        'builds': sorted([t['task'], b] for t in sched['tasks'] for b in t['builds']),
        'sequences': sorted([d['before'], d['after'], d['type']] for d in sched['dependencies']),
        'workSchedules': 1,
    }
    back = read_back_plan(planned)
    if back != expected:
        fail(f'the planned IFC does not read back as written: wrote {expected}, read {back}')
    sched['readBack'] = {'matchesWhatWasWritten': True, **back}
    planned_schema = schema_validation(planned)
    write_json(planning / 'schedule.json', sched)
    (planning / 'schedule.csv').write_text(table_csv(['task', 'name', 'predefinedType', 'builds', 'after', 'because', 'duration', 'heldBy'], [[t['task'], t['name'], t['predefinedType'], ' '.join(t['builds']), ' '.join(t['after']), '; '.join(t['because']), t['duration'], ' '.join(t['heldBy'])] for t in sched['tasks']]), encoding='utf-8')
    write_json(planning / 'cost-plan.json', plan_data['costPlan'])
    (planning / 'cost-plan.csv').write_text(table_csv(['id', 'item', 'task', 'quantity', 'unit', 'source', 'rate', 'amount'], [[l['id'], l['item'], l['task'], l['quantity'], l['unit'], l['source'], l['rate'], l['amount']] for l in plan_data['costPlan']['lines']]), encoding='utf-8')
    write_json(planning / 'schema.json', planned_schema)

    randori = out / 'randori-coordination'
    randori.mkdir()
    clearance = float(brief['rules']['randoriClearance_m'])
    clashes_r = coordination(model, brief, clearance)
    issues_r = clearance_issues(model, clashes_r, issues, brief, model_ref)
    entries_r = write_bcf(randori / 'issues-clearance.bcf', issues_r, project, model_ref, '3.0', [brief['issueOwner']])
    bcf_r = check_bcf(randori / 'issues-clearance.bcf', entries_r, '3.0', model)
    entries21 = write_bcf(randori / 'issues-bcf21.bcf', issues, project, model_ref, '2.1', [brief['issueOwner']])
    bcf21 = check_bcf(randori / 'issues-bcf21.bcf', entries21, '2.1', model)
    fov_ok = BCF21_FIELD_OF_VIEW[0] <= 60.0 <= BCF21_FIELD_OF_VIEW[1]
    new_issues = [i['id'] for i in issues_r if i['id'] not in {j['id'] for j in issues}]
    cards = {'cards': [
        {'id': 'CARD-R', 'changes': 'requirement', 'card': f'Keep {clearance} m clear between the duct and every other element, not only avoid touching.',
         'result': f"{len(new_issues)} new issue(s): {', '.join(new_issues) or 'none'}", 'newIssues': new_issues, 'clearanceClashes': clashes_r['clearanceClashes'],
         'evidence': ['randori-coordination/clearance.json', 'randori-coordination/issues-clearance.json', 'randori-coordination/issues-clearance.bcf']},
        {'id': 'CARD-F', 'changes': 'format', 'card': 'The receiving tool reads BCF 2.1 only. Export the same issues as BCF 2.1 and say what does not carry over.',
         'result': f"valid against bcf-client's BCF 2.1 schema files and read back ({len(bcf21['readBack']['topics'])} topic(s)); some information does not carry over",
         'notCarried': ['extensions.xml: the BCF 3.0 lists of allowed topic types, statuses, priorities, labels and users have no file in this 2.1 export', 'PerspectiveCamera/AspectRatio: BCF 2.1 has no aspect ratio', 'The Comments and Viewpoints lists move out of Topic to the end of the markup file (structure, not loss)'],
         'fieldOfViewWithinOfficial21Range': fov_ok,
         'schemaNote': 'bcf-client 0.9.0 ships a BCF 2.1 visinfo.xsd that differs from buildingSMART v2.1: it allows a FieldOfView of 1 to 170 degrees (official: 45 to 60) and lowercase colour codes. The export uses 60 degrees so it fits the official range too; see schemaFiles in bcf21-check.json.',
         'evidence': ['randori-coordination/issues-bcf21.bcf', 'randori-coordination/bcf21-check.json']},
        {'id': 'CARD-T', 'changes': 'tool', 'card': 'Find the clashes with a second tool and compare, instead of trusting one clash engine.',
         'result': 'IfcOpenShell clash tree and box arithmetic agree on every pair; the box route only holds because every element here is box-shaped, which the script checks',
         'boxRouteChecks': clashes['boxRoute']['checks'], 'routesAgree': clashes['routesAgree'],
         'limitation': 'Box arithmetic is not a clash engine: it is right here only because each built volume equals its box volume (the wall: less the opening). Any sloped, curved or hollow element would stop the script instead of giving an answer.',
         'evidence': ['coordination/clashes.json']},
    ]}
    if not fov_ok:
        fail('the BCF 2.1 export uses a field of view outside the official 2.1 range')
    write_json(randori / 'clearance.json', clashes_r)
    write_json(randori / 'issues-clearance.json', {'status': 'Practice issues under the Randori clearance card. Nobody has reviewed or resolved them.', 'issues': issues_r})
    write_json(randori / 'bcf-clearance-check.json', bcf_r)
    write_json(randori / 'bcf21-check.json', bcf21)
    write_json(randori / 'cards.json', cards)

    review_dir = out / 'review'
    review_dir.mkdir()
    deliverables = {
        'coordination-model': model_ref, 'clash-results': 'coordination/clashes.json', 'issue-register': 'coordination/issues.bcf',
        'information-checks': 'coordination/ids.json', 'schema-checks': 'coordination/schema.json', 'quantities': 'quantities/quantities.json',
        'cost-plan': 'planning/cost-plan.json', 'planned-model': f'planning/{PLANNED_IFC}', 'schedule': 'planning/schedule.json',
        'randori-cards': 'randori-coordination/cards.json',
    }
    package = review_package(gates, deliverables)
    write_json(review_dir / 'review-package.json', package)
    (review_dir / 'review-package.md').write_text(review_markdown(package), encoding='utf-8')
    return {
        'clashes': clashes, 'issues': issues, 'bcf3': bcf3, 'plan': plan_data, 'cards': cards, 'review': package, 'schema': schema,
        'hashes': {name: sha256(out / name) for name in (model_ref, f'planning/{PLANNED_IFC}', 'coordination/issues.bcf', 'randori-coordination/issues-clearance.bcf', 'randori-coordination/issues-bcf21.bcf')},
    }


def main(argv: list[str]) -> None:
    if len(argv) != 3:
        fail('usage: bim_pathway.py <examples-dir> <out-dir>')
    examples, out = Path(argv[1]), Path(argv[2])
    for name in (SOURCE_IFC, PRACTICE_IDS, RANDORI_IDS, COORDINATION_BRIEF, REVIEW_GATES):
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
    coordination_data = run_coordination(examples, out, quantity_data['quantities'])

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
        'inputs': {name: sha256(examples / name) for name in (SOURCE_IFC, PRACTICE_IDS, RANDORI_IDS, COORDINATION_BRIEF, REVIEW_GATES)},
        'edited': {EDITED_IFC: sha256(out / EDITED_IFC)},
        'coordination': coordination_data['hashes'],
    }
    manifest['tools'].update({'bcf-client': importlib.metadata.version('bcf-client'), 'xmlschema': importlib.metadata.version('xmlschema')})
    write_json(out / 'manifest.json', manifest)
    (out / 'summary.md').write_text(summary_markdown(results, manifest) + '\n' + summary_coordination(coordination_data), encoding='utf-8')


if __name__ == '__main__':
    main(sys.argv)
