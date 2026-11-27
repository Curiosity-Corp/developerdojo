# Transfer practice: Robotics

A practice sheet for one field, filled in from that field’s pathway. It is a learning aid: it is not proof that work or a review happened, and it awards no belt or rank.

Pathway: Robotics: from an open robot model to a checked pose and joint solution, in simulation (https://developerdojo.org/katas/robotics-pathway)

## How to practise
1. Practise the foundation. Do the foundation katas until you can say in one sentence which check confirms an assistant’s output before you keep it: PRACTICE-001 Compare AI instructions (https://developerdojo.org/katas/compare-instructions) and PRACTICE-002 Check context and trust (https://developerdojo.org/katas/context-trap)
2. Do the first field kata. Work it with the published inputs, and write down what this field uses as its independent check: ROB-001 Inspect a robot model: what the UR5 description holds, in which units and conventions (https://developerdojo.org/katas/rob-001-inspect-robot-model)
3. Apply the field’s own review gate. Keep an assistant’s output only when the gate confirms it, and log every time it did not: "You keep its code only if it reproduces the library’s printed examples." (Explaining assistant, ROB-002 Compute forward kinematics three ways and show they agree (https://developerdojo.org/katas/rob-002-forward-kinematics))
4. Take an unseen change. Do the Randori without reading its cards first. For an independent assessment, the reviewer chooses the change instead: ROB-R01 Robotics Randori: an unseen change of unit, model or configuration (https://developerdojo.org/katas/rob-r01-randori)
5. Gather the evidence the rubric asks for. Collect each kind of evidence the transfer criteria name, and write down what is missing instead of filling the gap: MD-1: The actual artifacts, Reproducible configuration, Tests and checks, Decision evidence; SEN-2: Decision evidence, Reproducible configuration, Tests and checks
6. Ask someone else to assess the transfer. A reviewer who did not help you reruns the field’s checks on your work and records each criterion as Observed, Not yet observed or Unclear. Until then the result is unavailable. The reviewer reruns: The Modern Robotics code library’s worked examples, the UR5 file against Universal Robots’ DH table, the model inspection, forward kinematics by three methods, inverse kinematics checked by the joint chain, and the Randori cards. Ask for the review with a review request for this transfer: https://developerdojo.org/review-request?subject=transfer:robotics The reviewer records the result on the review record for this transfer: https://developerdojo.org/review-record?subject=transfer:robotics

## Mission brief
- Goal, audience and decision-maker: Practice: carry the technique into Robotics: from an open robot model to a checked pose and joint solution, in simulation. Replace this with your own goal and decision-maker if you take it into real work.
- Authorized inputs and permissions: UR5 default kinematics of the Universal Robots ROS 2 Description (config/ur5/default_kinematics.yaml): the six joint origins of the nominal UR5 arm in metres and radians (https://developerdojo.org/examples/robotics-pathway/inputs/ur5-default-kinematics.yaml): BSD-3-Clause, the licence of the Universal Robots ROS 2 Description; served byte for byte with that licence beside it. Nothing here implies endorsement by Universal Robots. The licence of the Universal Robots ROS 2 Description (LICENSE), at the same commit, served with the file as the licence asks (https://developerdojo.org/examples/robotics-pathway/inputs/ur-description-LICENSE.txt): The BSD-3-Clause licence text, served byte for byte. Add an input of your own only with permission.
- Real-world constraints: No paid tools; Offline capable; No personal data; Licensed sample only.
- Chosen stack: Python standard library, with an assistant of your choice. Record the versions and permissions you actually use.
- Dependencies: The foundation katas PRACTICE-001 and PRACTICE-002, and the files on the pathway page (https://developerdojo.org/katas/robotics-pathway).
- Acceptance criteria and who checks them: The Modern Robotics code library’s worked examples, the UR5 file against Universal Robots’ DH table, the model inspection, forward kinematics by three methods, inverse kinematics checked by the joint chain, and the Randori cards. A reviewer reruns them; your own run does not count as the independent check.
- Independent review and qualified professional approval required: Qualified professional review is required for real use. None. No robotics safety engineer, controls engineer or robot integrator has reviewed this pathway; it is simulation only, and anything on real hardware needs a risk assessment by qualified people under the standards that apply.
- Katas practiced and how I will adapt them: ROB-001, ROB-002, ROB-003 and the Randori ROB-R01.

## Transfer record
- Foundation technique that transfers: An assistant may draft, explain or write code, but nothing it produces is kept until a check it did not write confirms it: an independently checkable answer, the source file itself or a published worked example. (from PRACTICE-001 and PRACTICE-002)
- Specialist capabilities and standards that change: Reference: The values printed in the Modern Robotics code library’s worked examples and Universal Robots’ DH table, which the code must reproduce before it computes any pose. Capabilities: Inspect model; Calculate. Standards: REP 103, Standard Units of Measure and Coordinate Conventions (Status Active; created 2010-10-07, post-history 2014-12-31; read 2026-11-27); Universal Robots ROS 2 Description, UR5 default kinematics (config/ur5/default_kinematics.yaml at commit 0eb1a861…070c (SHA-256 4559bd02…e9c3ac), downloaded 2026-11-27); Modern Robotics code library (Python) (packages/Python/modern_robotics/core.py at commit 36f0f1b4…89f2, read 2026-11-27).
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
