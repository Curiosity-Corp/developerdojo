# Transfer practice: Architecture and BIM

A practice sheet for one field, filled in from that field’s pathway. It is a learning aid: it is not proof that work or a review happened, and it awards no belt or rank.

Pathway: Architecture and BIM: from an IFC file to checked information (https://developerdojo.org/katas/bim-pathway)

## How to practise
1. Practise the foundation. Do the foundation katas until you can say in one sentence which check confirms an assistant’s output before you keep it: PRACTICE-001 Compare AI instructions (https://developerdojo.org/katas/compare-instructions) and PRACTICE-002 Check context and trust (https://developerdojo.org/katas/context-trap)
2. Do the first field kata. Work it with the published inputs, and write down what this field uses as its independent check: BIM-001 Inspect an IFC model: schema, units, spatial tree and relationships (https://developerdojo.org/katas/bim-001-inspect-model)
3. Apply the field’s own review gate. Keep an assistant’s output only when the gate confirms it, and log every time it did not: "You run the code on the file and keep only what the output shows." (Explaining assistant, BIM-001 Inspect an IFC model: schema, units, spatial tree and relationships (https://developerdojo.org/katas/bim-001-inspect-model))
4. Take an unseen change. Do the Randori without reading its cards first. For an independent assessment, the reviewer chooses the change instead: BIM-R01 BIM Randori: an unseen requirement change (https://developerdojo.org/katas/bim-r01-randori)
5. Gather the evidence the rubric asks for. Collect each kind of evidence the transfer criteria name, and write down what is missing instead of filling the gap: MD-1: The actual artifacts, Reproducible configuration, Tests and checks, Decision evidence; SEN-2: Decision evidence, Reproducible configuration, Tests and checks
6. Ask someone else to assess the transfer. A reviewer who did not help you reruns the field’s checks on your work and records each criterion as Observed, Not yet observed or Unclear. Until then the result is unavailable. The reviewer reruns: Inspection, property sets, IDS, schema and geometry on the original and the edited copy, the 3D mesh and its checks, the traced quantities and their cross-checks, the Randori cards, the coordination model with its clashes and BCF issue register, the planned model with its sequence and unpriced cost plan, the specialist Randori cards and the review package. Ask for the review with a review request for this transfer: https://developerdojo.org/review-request?subject=transfer:bim The reviewer records the result on the review record for this transfer: https://developerdojo.org/review-record?subject=transfer:bim

## Mission brief
- Goal, audience and decision-maker: Practice: carry the technique into Architecture and BIM: from an IFC file to checked information. Replace this with your own goal and decision-maker if you take it into real work.
- Authorized inputs and permissions: wall-with-opening-and-window.ifc (IFC4) (https://developerdojo.org/examples/bim-pathway/wall-with-opening-and-window.ifc): CC BY 4.0, © buildingSMART International Ltd. Add an input of your own only with permission.
- Real-world constraints: Licensed sample only; No paid tools; Offline capable.
- Chosen stack: Ifcopenshell and python, with an assistant of your choice. Record the versions and permissions you actually use.
- Dependencies: The foundation katas PRACTICE-001 and PRACTICE-002, and the files on the pathway page (https://developerdojo.org/katas/bim-pathway).
- Acceptance criteria and who checks them: Inspection, property sets, IDS, schema and geometry on the original and the edited copy, the 3D mesh and its checks, the traced quantities and their cross-checks, the Randori cards, the coordination model with its clashes and BCF issue register, the planned model with its sequence and unpriced cost plan, the specialist Randori cards and the review package. A reviewer reruns them; your own run does not count as the independent check.
- Independent review and qualified professional approval required: Qualified professional review is required for real use. None. Nothing here has professional, regulatory or construction approval of any kind, and a real project needs the qualified reviewers its contract and jurisdiction name.
- Katas practiced and how I will adapt them: BIM-001, BIM-002, BIM-003, BIM-004, BIM-005, BIM-006, BIM-007, BIM-008 and the Randori BIM-R01.

## Transfer record
- Foundation technique that transfers: An assistant may draft, explain or write code, but nothing it produces is kept until a check it did not write confirms it: an independently checkable answer, the source file itself or a published worked example. (from PRACTICE-001 and PRACTICE-002)
- Specialist capabilities and standards that change: Reference: The IFC file itself: a claim stays only when code run on the file shows it. Capabilities: Inspect model; Validate information; Edit model; Process geometry; Take off quantities; Coordinate disciplines; Plan sequence. Standards: Industry Foundation Classes (IFC) (IFC4 ADD2 TC1 (ISO 16739-1:2018), as declared by the sample file); Information Delivery Specification (IDS) (1.0); BIM Collaboration Format (BCF) (BCF-XML 3.0 (the register); BCF-XML 2.1 (the Randori format card)).
- Independent rubric result: Unavailable until an independent reviewer records it.
  - MD-1 Transfer to an unseen tool family or field: Unavailable. Given a brief the learner has not seen, in a tool family or field other than the one practiced, the learner chooses and adapts a stack, and the result passes checks the reviewer chose.
    - [ ] The actual artifacts:
    - [ ] Reproducible configuration:
    - [ ] Tests and checks:
    - [ ] Decision evidence:
  - SEN-2 Domain adaptations: Unavailable. The Sensei shows how the technique changes in a second field the reviewer names: the different inputs, tools, checks and the qualified review that field requires.
    - [ ] Decision evidence:
    - [ ] Reproducible configuration:
    - [ ] Tests and checks:

## Before you ask for review (a self-check, not a rubric result)
- [ ] I can name this field’s independent reference and show one assistant output it rejected or corrected.
- [ ] Every input I used is listed with its source and terms, and nothing private, confidential or personal is in this sheet.
- [ ] I ran the field’s checks myself and recorded the commands and results, failures included.
- [ ] I wrote down what this field requires from a qualified professional, and I did not claim that approval.

## Retrospective after the work
- What actually happened:
- Evidence that supports it:
- Failures and what changed:
- What remains uncertain or untested:
- A verified technique improvement or benchmark correction:
- Where I am sending it:
- What may be shared, by whom, under which licences:

## Where a verified improvement goes
- Technique improvement: A change to a kata step or technique that you reproduced and can show evidence for. Worksheet: https://developerdojo.org/examples/sensei/kata-improvement.md
- Benchmark correction: A dated benchmark or evidence claim on this site that your own reproduced run shows is wrong or out of date. Worksheet: https://developerdojo.org/examples/sensei/benchmark-correction.md

Do not put credentials or information you cannot share into an AI service or public repository. This document does not approve work or award a certificate.
