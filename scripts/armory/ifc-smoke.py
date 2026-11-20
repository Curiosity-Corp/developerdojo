"""Armory smoke test for IfcOpenShell (#88). Usage: python -I scripts/armory/ifc-smoke.py <file.ifc>

Read-only: opens the file, reports the schema and counts, and prints JSON. See docs/armory-registry.md.
"""
import sys, json, ifcopenshell
f = ifcopenshell.open(sys.argv[1])
wall = f.by_type('IfcWall')
out = {
  'ifcopenshell': ifcopenshell.version,
  'schema': f.schema,
  'counts': {t: len(f.by_type(t)) for t in ['IfcWall', 'IfcOpeningElement', 'IfcWindow', 'IfcBuildingStorey', 'IfcPropertySet']},
  'walls': [{'id': w.id(), 'GlobalId': w.GlobalId, 'Name': w.Name} for w in wall],
  'windows': [{'id': w.id(), 'Name': w.Name, 'OverallHeight': w.OverallHeight, 'OverallWidth': w.OverallWidth} for w in f.by_type('IfcWindow')],
}
print(json.dumps(out, indent=2))
