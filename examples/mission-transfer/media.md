# Transfer practice: Media

A practice sheet for one field, filled in from that field’s pathway. It is a learning aid: it is not proof that work or a review happened, and it awards no belt or rank.

Pathway: Media: from a recording to a measured, normalised programme loudness (https://developerdojo.org/katas/media-pathway)

## How to practise
1. Practise the foundation. Do the foundation katas until you can say in one sentence which check confirms an assistant’s output before you keep it: PRACTICE-001 Compare AI instructions (https://developerdojo.org/katas/compare-instructions) and PRACTICE-002 Check context and trust (https://developerdojo.org/katas/context-trap)
2. Do the first field kata. Work it with the published inputs, and write down what this field uses as its independent check: MED-001 Inspect a recording: its format, its peaks and its channels (https://developerdojo.org/katas/med-001-inspect-recording)
3. Apply the field’s own review gate. Keep an assistant’s output only when the gate confirms it, and log every time it did not: "You run the code and keep it only if it gives the Tech 3341 test responses within their tolerances." (Explaining assistant, MED-002 Measure programme loudness and true peak, with a meter you checked yourself (https://developerdojo.org/katas/med-002-measure-loudness))
4. Take an unseen change. Do the Randori without reading its cards first. For an independent assessment, the reviewer chooses the change instead: MED-R01 Media Randori: an unseen change to the meter or the delivery (https://developerdojo.org/katas/med-r01-randori)
5. Gather the evidence the rubric asks for. Collect each kind of evidence the transfer criteria name, and write down what is missing instead of filling the gap: MD-1: The actual artifacts, Reproducible configuration, Tests and checks, Decision evidence; SEN-2: Decision evidence, Reproducible configuration, Tests and checks
6. Ask someone else to assess the transfer. A reviewer who did not help you reruns the field’s checks on your work and records each criterion as Observed, Not yet observed or Unclear. Until then the result is unavailable. The reviewer reruns: The EBU Tech 3341 test responses, the recording inspection, its loudness and true peak, the R 128 normalisation and the Randori cards. Ask for the review with a review request for this transfer: https://developerdojo.org/review-request?subject=transfer:media The reviewer records the result on the review record for this transfer: https://developerdojo.org/review-record?subject=transfer:media

## Mission brief
- Goal, audience and decision-maker: Practice: carry the technique into Media: from a recording to a measured, normalised programme loudness. Replace this with your own goal and decision-maker if you take it into real work.
- Authorized inputs and permissions: NASA’s Artemis II launch recording from Pad Camera Site 4, a 33-second stereo WAV (48 kHz, 16-bit PCM) (https://developerdojo.org/examples/media-pathway/inputs/artemis-ii-launch-pad-camera-site-4.wav): A NASA Kennedy Space Center recording, a US government work in the public domain, kept on Wikimedia Commons (its SHA-1 there, b05c096e…f80038b4e, matches this copy). Served byte for byte; NASA’s name does not imply endorsement. Add an input of your own only with permission.
- Real-world constraints: No paid tools; Offline capable; No personal data.
- Chosen stack: Python standard library, with an assistant of your choice. Record the versions and permissions you actually use.
- Dependencies: The foundation katas PRACTICE-001 and PRACTICE-002, and the files on the pathway page (https://developerdojo.org/katas/media-pathway).
- Acceptance criteria and who checks them: The EBU Tech 3341 test responses, the recording inspection, its loudness and true peak, the R 128 normalisation and the Randori cards. A reviewer reruns them; your own run does not count as the independent check.
- Independent review and qualified professional approval required: Qualified professional review is required for real use. None. No broadcast audio engineer, delivery quality-control specialist or mastering engineer has reviewed this pathway; a real delivery needs the checks its broadcaster or platform asks for.
- Katas practiced and how I will adapt them: MED-001, MED-002, MED-003 and the Randori MED-R01.

## Transfer record
- Foundation technique that transfers: An assistant may draft, explain or write code, but nothing it produces is kept until a check it did not write confirms it: an independently checkable answer, the source file itself or a published worked example. (from PRACTICE-001 and PRACTICE-002)
- Specialist capabilities and standards that change: Reference: EBU Tech 3341’s published test signals and readings, which the meter must give within their tolerances before it measures any recording. Capabilities: Analyze data; Calculate. Standards: Recommendation ITU-R BS.1770-5, Algorithms to measure audio programme loudness and true-peak audio level (BS.1770-5 (11/2023); read 2026-11-25); EBU Tech 3341, Loudness metering, ‘EBU Mode’ metering to supplement EBU R 128 loudness normalisation (V4 (November 2023); read 2026-11-25); EBU R 128, Loudness normalisation and permitted maximum level of audio signals (V5 (November 2023); read 2026-11-25).
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
