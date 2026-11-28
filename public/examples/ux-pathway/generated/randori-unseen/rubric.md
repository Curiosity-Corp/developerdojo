# UX Randori, round U: review rubric

For the reviewer. It does not name the hidden constraint; the partner card does. Rows judged by the script are run by `node tools/ux_review.mjs <pack dir> <adapted flow.json> --first <first flow.json>`; the others are judged by the person named.

| Row | Criterion | Judged by | Passes when | Evidence |
| --- | --- | --- | --- | --- |
| structure | The flow holds together: every state is reachable, nothing is a dead end, every error has a way back, every dialog closes and every button is wired. | tools/ux_review.mjs (unique-states, screens-known, transitions-name-states, reachable, no-dead-ends, errors-recover, dialogs-close, buttons-wired, one-transition-per-pair) | Every listed check passes on the adapted flow file. | The flow file and the review sheet that tools/ux_review.mjs writes. |
| constraint | The hidden constraint is met. | tools/ux_review.mjs (the hidden constraint) | The constraint check passes on the adapted flow file. | The review sheet. |
| brief-covered | The flow does the job in the brief: booking, the clash and the way to a free slot, giving a slot up, and at least one error with its way back. | the reviewer | The reviewer can point to a state or a transition for each item in the brief's must-include list. | The sitemap, with the states named. |
| changed | The learner can say what the constraint changed, and the change is real. | the reviewer | The learner names the states and transitions the constraint added or removed. With the first flow file given, tools/ux_review.mjs computes them, and the learner's account must agree with that list. | Both flow files, and the learner's note of one or two sentences. |
| partner-walk | A partner who did not see the work walks the low-fidelity prototype without help and finishes each task in the brief. | the partner | The partner reaches every goal with no dead end. Every place they stopped or hesitated is written down, with what the learner changed or why they left it. | The walk notes: task, where they went, where they stopped. |
| words | Every error and the clash say what happened and what to do next, in plain words. | the reviewer | Each error state names the problem and the next step, with no code, jargon or blame. | The wireframes of the error states. |
| qa | The screens pass the pathway's QA checklist for wireframes: a visible label on every field, one heading per screen, focus in reading order, a target of at least 24 by 24 px for every control, and no sideways scroll at 320 px. | the reviewer | Every wireframe passes those items of the QA checklist, or the learner names the item it misses and the fix. | The wireframes and the filled QA checklist. |
| own-work | The round was done in the time box, without an assistant, and with fictional data only. | the learner | The learner says so on the review sheet; the partner confirms the time. | The review sheet, signed by both. |

Pass when every row passes. A row that does not pass is marked not yet, with the one change that would make it pass; nothing is scored by points.

## Not judged by this rubric

- Visual polish: the round is low fidelity on purpose.
- Whether the flow would work as software: it is a sitemap and a prototype, not an app.
- Usability with real users: one partner walk is a check for dead ends and confusion, not a usability study.
