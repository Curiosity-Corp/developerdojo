# Transfer practice: Education

A practice sheet for one field, filled in from that field’s pathway. It is a learning aid: it is not proof that work or a review happened, and it awards no belt or rank.

Pathway: Education: from a learning page to a checked accessibility report (https://developerdojo.org/katas/education-pathway)

## How to practise
1. Practise the foundation. Do the foundation katas until you can say in one sentence which check confirms an assistant’s output before you keep it: PRACTICE-001 Compare AI instructions (https://developerdojo.org/katas/compare-instructions) and PRACTICE-002 Check context and trust (https://developerdojo.org/katas/context-trap)
2. Do the first field kata. Work it with the published inputs, and write down what this field uses as its independent check: EDU-001 Inspect a learning page before you check it (https://developerdojo.org/katas/edu-001-inspect-learning-page)
3. Apply the field’s own review gate. Keep an assistant’s output only when the gate confirms it, and log every time it did not: "You run the code and keep it only if every approved W3C test case gives its expected outcome." (Explaining assistant, EDU-002 Run accessibility rules you checked against the W3C’s own test cases (https://developerdojo.org/katas/edu-002-run-act-rules))
4. Take an unseen change. Do the Randori without reading its cards first. For an independent assessment, the reviewer chooses the change instead: EDU-R01 Education Randori: an unseen change to a learning page (https://developerdojo.org/katas/edu-r01-randori)
5. Gather the evidence the rubric asks for. Collect each kind of evidence the transfer criteria name, and write down what is missing instead of filling the gap: MD-1: The actual artifacts, Reproducible configuration, Tests and checks, Decision evidence; SEN-2: Decision evidence, Reproducible configuration, Tests and checks
6. Ask someone else to assess the transfer. A reviewer who did not help you reruns the field’s checks on your work and records each criterion as Observed, Not yet observed or Unclear. Until then the result is unavailable. The reviewer reruns: The W3C ACT test cases, the page inspection, the four rules on the page, the WCAG 2.2 report and the Randori cards. Ask for the review with a review request for this transfer: https://developerdojo.org/review-request?subject=transfer:education The reviewer records the result on the review record for this transfer: https://developerdojo.org/review-record?subject=transfer:education

## Mission brief
- Goal, audience and decision-maker: Practice: carry the technique into Education: from a learning page to a checked accessibility report. Replace this with your own goal and decision-maker if you take it into real work.
- Authorized inputs and permissions: The Wikibooks open-textbook chapter High School Mathematics Extensions/Matrices, revision 266672, as served to a reader (HTML) (https://developerdojo.org/examples/education-pathway/inputs/matrices.html): Text under CC BY-SA 4.0 by the Wikibooks contributors listed in the page history. Served unchanged; the Randori changes are made to copies in memory and never published. The W3C ACT Rules test case index (testcases.json); the 36 approved test cases of the four rules sit beside it (https://developerdojo.org/examples/education-pathway/inputs/act-rules/testcases.json): W3C Software and Document License; the full notice is served beside the files (inputs/act-rules/NOTICE.md). Unchanged. The IANA Language Subtag Registry, File-Date 2026-11-18 (https://developerdojo.org/examples/education-pathway/inputs/language-subtag-registry.txt): An IANA protocol registry, published for anyone to use. Unchanged. Add an input of your own only with permission.
- Real-world constraints: No paid tools; Offline capable; No personal data; Licensed sample only.
- Chosen stack: Python standard library, with an assistant of your choice. Record the versions and permissions you actually use.
- Dependencies: The foundation katas PRACTICE-001 and PRACTICE-002, and the files on the pathway page (https://developerdojo.org/katas/education-pathway).
- Acceptance criteria and who checks them: The W3C ACT test cases, the page inspection, the four rules on the page, the WCAG 2.2 report and the Randori cards. A reviewer reruns them; your own run does not count as the independent check.
- Independent review and qualified professional approval required: Qualified professional review is required for real use. None. No digital accessibility specialist, assistive technology user or education accessibility compliance reviewer has reviewed this pathway; a real course or site needs a full evaluation against every success criterion.
- Katas practiced and how I will adapt them: EDU-001, EDU-002, EDU-003 and the Randori EDU-R01.

## Transfer record
- Foundation technique that transfers: An assistant may draft, explain or write code, but nothing it produces is kept until a check it did not write confirms it: an independently checkable answer, the source file itself or a published worked example. (from PRACTICE-001 and PRACTICE-002)
- Specialist capabilities and standards that change: Reference: The W3C’s approved ACT test cases, which every rule must give its expected outcome before it checks any learning page. Capabilities: Test accessibility; Validate information. Standards: Web Content Accessibility Guidelines (WCAG) 2.2 (W3C Recommendation, 12 December 2024; read 2026-11-25); W3C ACT Rules 2779a5, b5c3f8, bf051a and b4f0c3 (2779a5 and b5c3f8 of 31 August 2023, bf051a proposed version of 21 June 2022, b4f0c3 of 25 October 2022; read 2026-11-25); IANA Language Subtag Registry (File-Date 2026-11-18; downloaded 2026-11-25); W3C ACT Rules 2779a5, b5c3f8, bf051a and b4f0c3, mapped to WCAG 2.2 (As in EDU-002; WCAG 2.2 W3C Recommendation, 12 December 2024; read 2026-11-25).
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
