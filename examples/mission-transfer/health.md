# Transfer practice: Health

A practice sheet for one field, filled in from that field’s pathway. It is a learning aid: it is not proof that work or a review happened, and it awards no belt or rank.

Pathway: Health: from a growth reference table to a checked BMI-for-age percentile (https://developerdojo.org/katas/health-pathway)

## How to practise
1. Practise the foundation. Do the foundation katas until you can say in one sentence which check confirms an assistant’s output before you keep it: PRACTICE-001 Compare AI instructions (https://developerdojo.org/katas/compare-instructions) and PRACTICE-002 Check context and trust (https://developerdojo.org/katas/context-trap)
2. Do the first field kata. Work it with the published inputs, and write down what this field uses as its independent check: HLT-001 Inspect a growth reference: what CDC’s BMI-for-age tables hold and how age selects a row (https://developerdojo.org/katas/hlt-001-inspect-growth-reference)
3. Apply the field’s own review gate. Keep an assistant’s output only when the gate confirms it, and log every time it did not: "You run the code and keep it only if it reproduces CDC’s worked examples." (Explaining assistant, HLT-002 Compute a BMI-for-age percentile and z-score with CDC’s LMS and extended methods (https://developerdojo.org/katas/hlt-002-bmi-for-age-percentile))
4. Take an unseen change. Do the Randori without reading its cards first. For an independent assessment, the reviewer chooses the change instead: HLT-R01 Health Randori: an unseen change of method, row or cut-off (https://developerdojo.org/katas/hlt-r01-randori)
5. Gather the evidence the rubric asks for. Collect each kind of evidence the transfer criteria name, and write down what is missing instead of filling the gap: MD-1: The actual artifacts, Reproducible configuration, Tests and checks, Decision evidence; SEN-2: Decision evidence, Reproducible configuration, Tests and checks
6. Ask someone else to assess the transfer. A reviewer who did not help you reruns the field’s checks on your work and records each criterion as Observed, Not yet observed or Unclear. Until then the result is unavailable. The reviewer reruns: CDC’s worked examples, every printed column of both tables, the table inspection, the fictional children’s scores and categories, and the Randori cards. Ask for the review with a review request for this transfer: https://developerdojo.org/review-request?subject=transfer:health The reviewer records the result on the review record for this transfer: https://developerdojo.org/review-record?subject=transfer:health

## Mission brief
- Goal, audience and decision-maker: Practice: carry the technique into Health: from a growth reference table to a checked BMI-for-age percentile. Replace this with your own goal and decision-maker if you take it into real work.
- Authorized inputs and permissions: CDC 2000 growth charts, BMI-for-age data file (bmiagerev.csv): L, M, S and the 3rd to 97th percentiles by sex and month of age, 2 to 20 years (https://developerdojo.org/examples/health-pathway/inputs/bmiagerev.csv): A work of CDC’s National Center for Health Statistics, a US government work in the public domain (cdc.gov, reusing CDC material). Served byte for byte; no CDC or HHS logo is used, and nothing here implies endorsement by CDC. CDC 2022 Extended BMI-for-age growth charts, data file (bmi-age-2022.csv): L, M, S, sigma, percentiles to the 99.99th and z-scores to 5 (https://developerdojo.org/examples/health-pathway/inputs/bmi-age-2022.csv): A work of CDC’s National Center for Health Statistics, a US government work in the public domain (cdc.gov, reusing CDC material). Served byte for byte; no CDC or HHS logo is used, and nothing here implies endorsement by CDC. Add an input of your own only with permission.
- Real-world constraints: No paid tools; Offline capable; No personal data.
- Chosen stack: Python standard library, with an assistant of your choice. Record the versions and permissions you actually use.
- Dependencies: The foundation katas PRACTICE-001 and PRACTICE-002, and the files on the pathway page (https://developerdojo.org/katas/health-pathway).
- Acceptance criteria and who checks them: CDC’s worked examples, every printed column of both tables, the table inspection, the fictional children’s scores and categories, and the Randori cards. A reviewer reruns them; your own run does not count as the independent check.
- Independent review and qualified professional approval required: Qualified professional review is required for real use. None. No paediatrician, registered dietitian or epidemiologist has reviewed this pathway; any real child needs a qualified clinician, and any real programme the review its own governance requires.
- Katas practiced and how I will adapt them: HLT-001, HLT-002, HLT-003 and the Randori HLT-R01.

## Transfer record
- Foundation technique that transfers: An assistant may draft, explain or write code, but nothing it produces is kept until a check it did not write confirms it: an independently checkable answer, the source file itself or a published worked example. (from PRACTICE-001 and PRACTICE-002)
- Specialist capabilities and standards that change: Reference: CDC’s printed worked examples and the columns of its growth chart tables, which the code must reproduce before it scores any fictional child. Capabilities: Analyze data; Calculate. Standards: CDC 2000 growth charts and 2022 Extended BMI-for-age growth charts, BMI-for-age data files and method (bmiagerev.csv (SHA-256 cbeea0e8…d8e39f) and bmi-age-2022.csv (SHA-256 7f416a21…d166e5), downloaded 2026-11-26; method page last reviewed by CDC 2024-09-02, read 2026-11-26).
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
