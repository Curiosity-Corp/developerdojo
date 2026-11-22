# Transfer practice: SaaS UX

A practice sheet for one field, filled in from that field’s pathway. It is a learning aid: it is not proof that work or a review happened, and it awards no belt or rank.

Pathway: SaaS UX: from sitemap to a tested screen (https://developerdojo.org/katas/ux-pathway)

## How to practise
1. Practise the foundation. Do the foundation katas until you can say in one sentence which check confirms an assistant’s output before you keep it: PRACTICE-001 Compare AI instructions (https://developerdojo.org/katas/compare-instructions) and PRACTICE-002 Check context and trust (https://developerdojo.org/katas/context-trap)
2. Do the first field kata. Work it with the published inputs, and write down what this field uses as its independent check: UX-001 Map a sitemap with branches and error states (https://developerdojo.org/katas/ux-001-sitemap)
3. Apply the field’s own review gate. Keep an assistant’s output only when the gate confirms it, and log every time it did not: "You compare every line with the flow and the done-when list before it goes into Penpot." (Drafting assistant, UX-001 Map a sitemap with branches and error states (https://developerdojo.org/katas/ux-001-sitemap))
4. Take an unseen change. Do the Randori without reading its cards first. For an independent assessment, the reviewer chooses the change instead: UX-R01 UX Randori: an unseen flow with a hidden constraint (https://developerdojo.org/katas/ux-r01-randori)
5. Gather the evidence the rubric asks for. Collect each kind of evidence the transfer criteria name, and write down what is missing instead of filling the gap: MD-1: The actual artifacts, Reproducible configuration, Tests and checks, Decision evidence; SEN-2: Decision evidence, Reproducible configuration, Tests and checks
6. Ask someone else to assess the transfer. A reviewer who did not help you reruns the field’s checks on your work and records each criterion as Observed, Not yet observed or Unclear. Until then the result is unavailable. The reviewer reruns: The Penpot file is rebuilt from the flow and tokens, and every token colour pair meets its contrast ratio; The working example is driven through every state with axe, reflow and focus checks, and the clickable prototype through every transition; The flow file is redrawn as a sitemap, a one-canvas journey and one low-fidelity screen per state, and rechecked for reachability, dead ends, error recovery, dialogs, button wiring and token contrast; The same script draws the style guide, the component sheet and every state at 390 px and 1440 px in high fidelity from the tokens and the brand file (tools/ux_hifi.mjs), and audits each drawing for token use, text and boundary contrast, control size and component coverage. Ask for the review with a review request for this transfer: https://developerdojo.org/review-request?subject=transfer:ux The reviewer records the result on the review record for this transfer: https://developerdojo.org/review-record?subject=transfer:ux

## Mission brief
- Goal, audience and decision-maker: Practice: carry the technique into SaaS UX: from sitemap to a tested screen. Replace this with your own goal and decision-maker if you take it into real work.
- Authorized inputs and permissions: Dojo practice material (https://developerdojo.org/examples/ux-pathway/README.md): Pocket Invoice is invented for practice. Its flow file, contrast pairs, tokens, Penpot file, drawings and screenshots are Dojo material under the MIT licence, generated from the site’s own data. Add an input of your own only with permission.
- Real-world constraints: Fictional data; No personal data; No paid tools.
- Chosen stack: Penpot and browser, with an assistant of your choice. Record the versions and permissions you actually use.
- Dependencies: The foundation katas PRACTICE-001 and PRACTICE-002, and the files on the pathway page (https://developerdojo.org/katas/ux-pathway).
- Acceptance criteria and who checks them: The Penpot file is rebuilt from the flow and tokens, and every token colour pair meets its contrast ratio; The working example is driven through every state with axe, reflow and focus checks, and the clickable prototype through every transition; The flow file is redrawn as a sitemap, a one-canvas journey and one low-fidelity screen per state, and rechecked for reachability, dead ends, error recovery, dialogs, button wiring and token contrast; The same script draws the style guide, the component sheet and every state at 390 px and 1440 px in high fidelity from the tokens and the brand file (tools/ux_hifi.mjs), and audits each drawing for token use, text and boundary contrast, control size and component coverage. A reviewer reruns them; your own run does not count as the independent check.
- Independent review and qualified professional approval required: Not required for this practice material. Not required for this invented practice product, and none was done. The automated checks are not an accessibility audit, and nothing here is a conformance statement for a real product.
- Katas practiced and how I will adapt them: UX-001, UX-002, UX-003, UX-004, UX-005 and the Randori UX-R01.

## Transfer record
- Foundation technique that transfers: An assistant may draft, explain or write code, but nothing it produces is kept until a check it did not write confirms it: an independently checkable answer, the source file itself or a published worked example. (from PRACTICE-001 and PRACTICE-002)
- Specialist capabilities and standards that change: Reference: The flow and the done-when list for each screen, and contrast ratios computed from the design tokens. Capabilities: Map flows; Design interaction; Design systems; Test accessibility. Standards: Web Content Accessibility Guidelines (WCAG) (2.2).
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
