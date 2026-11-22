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
| `coordination-brief.json` | The practice duct, clash rules, tasks and cost lines for BIM-007, BIM-008 and BIM-R02 | MIT, Developer Dojo |
| `review-gates.json` | The review gates G1 to G5: what each covers and the qualified reviewers it needs | MIT, Developer Dojo |
| `schemas/bcf-xml/v3.0/`, `schemas/bcf-xml/v2.1/` | buildingSMART's BCF-XML schema files, unchanged (tags v3.0 and v2.1) | CC BY-ND 4.0, © buildingSMART International Ltd. (`schemas/bcf-xml/LICENSE-buildingSMART-BCF-XML.txt`) |
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
| `generated/coordination/wall-with-opening-and-window.coordination.ifc` | The edited copy with one practice duct (IfcDuctSegment) added, BIM-007 | CC BY 4.0 adaptation of the buildingSMART sample |
| `generated/coordination/` | Geometry, schema and IDS results for that model, the clash results by both routes, and the issue register (`issues.json`, `issues.csv`, BCF 3.0 `issues.bcf`) with its schema check and read-back (`bcf-check.json`) | MIT, Developer Dojo |
| `generated/planning/wall-with-opening-and-window.planned.ifc` | The coordination model with a work schedule, tasks, product assignments and sequences added, BIM-008 | CC BY 4.0 adaptation of the buildingSMART sample |
| `generated/planning/` | The sequence (`schedule.json`, `schedule.csv`), the unpriced cost plan (`cost-plan.json`, `cost-plan.csv`) and the planned model's schema result | MIT, Developer Dojo |
| `generated/randori-coordination/` | The specialist Randori cards (BIM-R02): the clearance card's results and register, the BCF 2.1 export and its check | MIT, Developer Dojo |
| `generated/review/` | The review package: each gate, its reviewers and evidence, all not reviewed | MIT, Developer Dojo |
| `generated/summary.md` | The results in one page | MIT, Developer Dojo |

## Source of the model

buildingSMART Certification-datasets, commit `80d976a9b193a26a8e928c3e79bff67af1de68a8`, path
`IFC 4.0.2.1 (IFC 4 ADD2 TC1)/ISO Spec - ReferenceView_V1.2/wall-with-opening-and-window.ifc`,
SHA-256 `73b0e45d931d5dc13bfee5fdc7bd80f796526445458b2de74c4168d209097832`.
https://github.com/buildingSMART/Certification-datasets

## Source of the BCF schema files

buildingSMART BCF-XML, https://github.com/buildingSMART/BCF-XML, folder `Schemas/` at tag `v3.0` (commit
`5834466b2477ac700d7a61990b4e67ec1005cc68`) and tag `v2.1` (commit `a0fbab777706b5ac282105f724979e1f8e271e51`),
copied unchanged. The licence text is the repository's `LICENSE` file. The script checks every file's git blob id
against the ids it pins, so a changed copy stops it.

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

## Coordination, sequence and review (BIM-007, BIM-008, BIM-R02)

Construction work is kept apart from the shape and the building information.

- **Coordination:** one practice duct is added to the edited copy with plain IFC4 entities, routed through the
  wall on purpose. Clashes are found with IfcOpenShell's clash tree (the `opencascade.trianglebvh` tree IfcClash
  0.9 uses, collision mode with touching not allowed) and, independently, by box arithmetic on the built shapes,
  after checking that every built volume equals its box volume. The box route also gives the overlap volume. The
  script stops if the two routes disagree, or if the tree places any element differently from the built shapes.
- **Validation exception:** IfcClash's intersection mode (2 mm tolerance) reports no clash for the duct through the
  wall, although the collision mode and the box route both find it. `clashes.json` records that result under
  `intersectionMode`; nothing relies on it. Do not read an empty result from one clash mode as "no clash".
- **Issues:** each clash becomes an issue with the GlobalIds of both elements and the review gates that must close
  it. The register is written as BCF 3.0. Each XML part is validated with xmlschema against buildingSMART's
  official schema files (BCF-XML tags v3.0 and v2.1), and the script first proves each file by its git blob id.
  bcf-client reads the zip back and every selected GlobalId must be in the model.
  No other BCF tool has opened the files, so do not assume they interoperate.
- **Sequence:** tasks are written into an IFC copy with `ifcopenshell.api.sequence`. Every element is assigned to
  the one task that builds it, and every finish-to-start dependency comes from `IfcRelFillsElement` and
  `IfcRelVoidsElement` or from an open issue. The order is computed; a cycle stops the script. The file is read
  back and compared. No durations or dates are set.
- **Cost plan:** every line cites a traced quantity (BIM-006), an element count or an open issue. No line is priced.
- **Specialist Randori:** card R adds a 50 mm clearance rule, card F exports the register as BCF 2.1 and lists what
  does not carry over, card T compares the two clash routes and states when the second stops holding.
- **Review package:** five gates, each naming the qualified reviewers it needs. None is reviewed, and
  `constructionReady` is always false.

Standards: IFC4 (ADD2 TC1, as the sample declares), IDS 1.0, BCF-XML 3.0 and 2.1. Schema validation runs with
EXPRESS rules off. BCF parts are validated against buildingSMART's official BCF-XML schema files in
`schemas/bcf-xml/`, unchanged, because the installed bcf-client 0.9.0 lacks some of them. The 2.1 export also
checks the official field-of-view range (45 to 60 degrees) on its own.

No result here is combined into a single score, and none is professional, regulatory or construction approval.
The requirements are invented for practice. "REI 60" in the edited copy is a placeholder that meets a practice
pattern, not a fire rating.
