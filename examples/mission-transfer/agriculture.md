# Transfer practice: Agriculture

A practice sheet for one field, filled in from that field’s pathway. It is a learning aid: it is not proof that work or a review happened, and it awards no belt or rank.

Pathway: Agriculture: from a weather record to a checked irrigation estimate (https://developerdojo.org/katas/agriculture-pathway)

## How to practise
1. Practise the foundation. Do the foundation katas until you can say in one sentence which check confirms an assistant’s output before you keep it: PRACTICE-001 Compare AI instructions (https://developerdojo.org/katas/compare-instructions) and PRACTICE-002 Check context and trust (https://developerdojo.org/katas/context-trap)
2. Do the first field kata. Work it with the published inputs, and write down what this field uses as its independent check: AGR-001 Inspect a daily weather record: dates, units, gaps and flags (https://developerdojo.org/katas/agr-001-inspect-weather-record)
3. Apply the field’s own review gate. Keep an assistant’s output only when the gate confirms it, and log every time it did not: "Its code must reproduce FAO's worked example before you use it on the record." (Explaining assistant, AGR-002 Estimate reference evapotranspiration with FAO-56 from temperature data (https://developerdojo.org/katas/agr-002-reference-et))
4. Take an unseen change. Do the Randori without reading its cards first. For an independent assessment, the reviewer chooses the change instead: AGR-R01 Agriculture Randori: an unseen change of assumption (https://developerdojo.org/katas/agr-r01-randori)
5. Gather the evidence the rubric asks for. Collect each kind of evidence the transfer criteria name, and write down what is missing instead of filling the gap: MD-1: The actual artifacts, Reproducible configuration, Tests and checks, Decision evidence; SEN-2: Decision evidence, Reproducible configuration, Tests and checks
6. Ask someone else to assess the transfer. A reviewer who did not help you reruns the field’s checks on your work and records each criterion as Observed, Not yet observed or Unclear. Until then the result is unavailable. The reviewer reruns: FAO worked examples, the record inspection, daily and monthly reference evapotranspiration, the maize irrigation estimate and the Randori cards.

## Mission brief
- Goal, audience and decision-maker: Practice: carry the technique into Agriculture: from a weather record to a checked irrigation estimate. Replace this with your own goal and decision-maker if you take it into real work.
- Authorized inputs and permissions: Daily weather record, Fresno Yosemite International (GHCN-Daily USW00093193), 2023 (https://developerdojo.org/examples/agriculture-pathway/inputs/noaa-ghcnd-USW00093193-2023.csv): A US National Weather Service record from NOAA NCEI GHCN-Daily; works of the US federal government are not under copyright in the US (17 U.S.C. 105). NCEI asks for a citation and gives no warranty. Add an input of your own only with permission.
- Real-world constraints: No paid tools; Offline capable; No personal data.
- Chosen stack: Python standard library, with an assistant of your choice. Record the versions and permissions you actually use.
- Dependencies: The foundation katas PRACTICE-001 and PRACTICE-002, and the files on the pathway page (https://developerdojo.org/katas/agriculture-pathway).
- Acceptance criteria and who checks them: FAO worked examples, the record inspection, daily and monthly reference evapotranspiration, the maize irrigation estimate and the Randori cards. A reviewer reruns them; your own run does not count as the independent check.
- Independent review and qualified professional approval required: Qualified professional review is required for real use. None. Nothing here is an irrigation recommendation or has been reviewed by an agronomist, irrigation engineer or water authority; real water use needs the qualified people and local rules that apply to it.
- Katas practiced and how I will adapt them: AGR-001, AGR-002, AGR-003 and the Randori AGR-R01.

## Transfer record
- Foundation technique that transfers: An assistant may draft, explain or write code, but nothing it produces is kept until a check it did not write confirms it: an independently checkable answer, the source file itself or a published worked example. (from PRACTICE-001 and PRACTICE-002)
- Specialist capabilities and standards that change: Reference: FAO’s published worked examples, which the code must reproduce before it touches the weather record. Capabilities: Analyze data; Calculate. Standards: FAO Irrigation and Drainage Paper 56 (Crop evapotranspiration) (1998); FAO Training Manual 3 (Irrigation Water Needs) (1986).
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
