"""BIM pathway checks (developerdojo#92). Rebuilds every generated file under public/examples/bim-pathway/generated/.

Usage: python -I /examples/bim-pathway/tools/bim_pathway.py <examples-dir> <out-dir>

  <examples-dir>  public/examples/bim-pathway (the inputs: the buildingSMART sample IFC and the two IDS files)
  <out-dir>       where to write the generated files; CI writes to a fresh folder and diffs it against
                  <examples-dir>/generated, so the published output is exactly what CI computed.

Three outcomes are kept apart on purpose and never folded into one score:
  * information: the IDS requirement results (ifctester);
  * schema: IFC schema validation of each model (ifcopenshell.validate);
  * geometry: whether each body shape can be built, with its volume and bounding box (ifcopenshell.geom).
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
