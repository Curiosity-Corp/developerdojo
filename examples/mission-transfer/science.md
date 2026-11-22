# Transfer practice: Science and research

A practice sheet for one field, filled in from that field’s pathway. It is a learning aid: it is not proof that work or a review happened, and it awards no belt or rank.

Pathway: Science and research: from a published record to a result with its uncertainty (https://developerdojo.org/katas/science-pathway)

## How to practise
1. Practise the foundation. Do the foundation katas until you can say in one sentence which check confirms an assistant’s output before you keep it: PRACTICE-001 Compare AI instructions (https://developerdojo.org/katas/compare-instructions) and PRACTICE-002 Check context and trust (https://developerdojo.org/katas/context-trap)
2. Do the first field kata. Work it with the published inputs, and write down what this field uses as its independent check: SCI-001 Inspect a published research record: columns, units, gaps and internal consistency (https://developerdojo.org/katas/sci-001-inspect-research-record)
3. Apply the field’s own review gate. Keep an assistant’s output only when the gate confirms it, and log every time it did not: "You run the code and keep it only if it reproduces the GUM's printed values." (Explaining assistant, SCI-002 Evaluate measurement uncertainty: Type A evaluation, correlated inputs and an uncertainty budget (https://developerdojo.org/katas/sci-002-uncertainty-budget))
4. Take an unseen change. Do the Randori without reading its cards first. For an independent assessment, the reviewer chooses the change instead: SCI-R01 Science Randori: an unseen change of assumption (https://developerdojo.org/katas/sci-r01-randori)
5. Gather the evidence the rubric asks for. Collect each kind of evidence the transfer criteria name, and write down what is missing instead of filling the gap: MD-1: The actual artifacts, Reproducible configuration, Tests and checks, Decision evidence; SEN-2: Decision evidence, Reproducible configuration, Tests and checks
6. Ask someone else to assess the transfer. A reviewer who did not help you reruns the field’s checks on your work and records each criterion as Observed, Not yet observed or Unclear. Until then the result is unavailable. The reviewer reruns: The GUM worked examples (Annex H.2 and H.3), the record inspection, the uncertainty budget, the least-squares line and the Randori cards.

## Mission brief
- Goal, audience and decision-maker: Practice: carry the technique into Science and research: from a published record to a result with its uncertainty. Replace this with your own goal and decision-maker if you take it into real work.
- Authorized inputs and permissions: GISTEMP v4 global land-ocean temperature anomalies (GLB.Ts+dSST.csv), NASA GISS (https://developerdojo.org/examples/science-pathway/inputs/gistemp-v4-global-land-ocean.csv): NASA material, generally not subject to copyright in the US (17 U.S.C. 105). Cited as GISS asks, with NASA credited as the source and no NASA endorsement implied. GISS revises the record monthly; this copy is pinned by its hash. Add an input of your own only with permission.
- Real-world constraints: No paid tools; Offline capable; No personal data.
- Chosen stack: Python standard library, with an assistant of your choice. Record the versions and permissions you actually use.
- Dependencies: The foundation katas PRACTICE-001 and PRACTICE-002, and the files on the pathway page (https://developerdojo.org/katas/science-pathway).
- Acceptance criteria and who checks them: The GUM worked examples (Annex H.2 and H.3), the record inspection, the uncertainty budget, the least-squares line and the Randori cards. A reviewer reruns them; your own run does not count as the independent check.
- Independent review and qualified professional approval required: Qualified professional review is required for real use. None. No metrologist, statistician or climate scientist has reviewed this pathway; a real measurement result, calibration or published finding needs the qualified reviewers its laboratory, journal or accreditation body names.
- Katas practiced and how I will adapt them: SCI-001, SCI-002, SCI-003 and the Randori SCI-R01.

## Transfer record
- Foundation technique that transfers: An assistant may draft, explain or write code, but nothing it produces is kept until a check it did not write confirms it: an independently checkable answer, the source file itself or a published worked example. (from PRACTICE-001 and PRACTICE-002)
- Specialist capabilities and standards that change: Reference: The GUM’s printed worked examples, which the code must reproduce before it touches the temperature record. Capabilities: Analyze data; Calculate. Standards: none recorded on these katas.
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
