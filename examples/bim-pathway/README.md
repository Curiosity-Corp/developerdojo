# BIM pathway files

The worked example for the BIM pathway (/katas/bim-pathway, Developer Dojo issue #92). Everything under
`generated/` is computed by `tools/bim_pathway.py`. The site's CI reruns the script on every pipeline (job
`bim_pathway`) and fails if any file differs from the published copy, so these results are not typed by hand.

## Files

| File | What it is | Licence |
| --- | --- | --- |
| `wall-with-opening-and-window.ifc` | buildingSMART's IFC4 test sample, unchanged | CC BY 4.0, © buildingSMART International Ltd. (`LICENSE-buildingSMART.txt`) |
| `practice-requirements.ids` | Six practice requirements (REQ-01 to REQ-06), IDS 1.0 | MIT, Developer Dojo |
| `randori-cards.ids` | Three requirement cards for the Randori (CARD-A to CARD-C), IDS 1.0 | MIT, Developer Dojo |
| `tools/bim_pathway.py` | The script that makes the edit and runs every check | MIT, Developer Dojo |
| `tools/requirements.txt` | The pinned packages, with hashes (compiled from `tools/requirements.in` with uv) | Each package under its own licence |
| `generated/wall-with-opening-and-window.edited.ifc` | The sample with one property changed and its header rewritten | CC BY 4.0 adaptation of the buildingSMART sample |
| `generated/{original,edited}/` | Inspection, property sets, IDS (compact and IfcTester's full report), schema and geometry results | MIT, Developer Dojo |
| `generated/randori/` | The Randori cards checked against the edited copy | MIT, Developer Dojo |
| `generated/change.json` | Every property that differs between the two models, and the GlobalIds kept | MIT, Developer Dojo |
| `generated/manifest.json` | Tool versions and the SHA-256 of every input and of the edited copy | MIT, Developer Dojo |
| `generated/mesh/wall-with-opening-and-window.obj` | The wall and the window as a triangle mesh (Wavefront OBJ, metres, Z up), BIM-005 | CC BY 4.0 adaptation of the buildingSMART sample |
| `generated/mesh/mesh-checks.json` | Each mesh checked from its triangles: closed, oriented, Euler characteristic, area, volume | MIT, Developer Dojo |
| `generated/quantities/quantities.csv`, `quantities.json` | Eleven quantities with source entities, GlobalIds, unit, method and assumption, and the cross-checks (BIM-006) | MIT, Developer Dojo |
| `generated/summary.md` | The results in one page | MIT, Developer Dojo |

## Source of the model

buildingSMART Certification-datasets, commit `80d976a9b193a26a8e928c3e79bff67af1de68a8`, path
`IFC 4.0.2.1 (IFC 4 ADD2 TC1)/ISO Spec - ReferenceView_V1.2/wall-with-opening-and-window.ifc`,
SHA-256 `73b0e45d931d5dc13bfee5fdc7bd80f796526445458b2de74c4168d209097832`.
https://github.com/buildingSMART/Certification-datasets

## Rerun the checks

Python 3.12 on Linux x86-64 (the CI image is `python:3.12-slim`):

    python3.12 -m venv .venv
    .venv/bin/pip install --require-hashes -r tools/requirements.txt
    .venv/bin/python -I tools/bim_pathway.py . my-output
    diff -r my-output generated

Run it from this folder. The script removes and recreates the output folder you name, so give it a new one.
`diff` prints nothing when your results match the published ones.

## Three separate outcomes

- **Information:** the IDS checks (IfcTester 0.9.0). IfcTester reports an empty IfcLabel as a missing property.
- **Schema:** `ifcopenshell.validate` with EXPRESS rules off. Where-rules are not checked.
- **Geometry:** each element's shape built with `ifcopenshell.geom`, openings cut, in metres. That shows the
  shape can be processed; it is not a clash, tolerance or constructability check.

## Shape and quantities, from the original sample

- **3D mesh (BIM-005):** the wall and the window tessellated with `ifcopenshell.geom` and written to one OBJ. The
  checks use the triangles alone. The opening is not exported because it is a void. The OBJ keeps no IFC classes,
  properties, materials or relationships; the object names are the only link back.
- **Quantities (BIM-006):** read from the IFC parameters (axis, profiles, extrusion depths, material layers,
  window attributes) and cross-checked against the built geometry. The script stops without writing anything if
  a cross-check disagrees. The glazing area is an estimate from `Pset_WindowCommon.GlazingAreaFraction`. These
  are practice quantities on a test file, not a takeoff for cost, procurement or construction.

No result here is combined into a single score, and none is professional, regulatory or construction approval.
The requirements are invented for practice. "REI 60" in the edited copy is a placeholder that meets a practice
pattern, not a fire rating.
