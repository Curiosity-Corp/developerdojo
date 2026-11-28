# UX Randori, round U: review sheet

Blank. Run `node tools/ux_review.mjs . your-flow.json --first your-first-flow.json --out review.md` to fill in the script rows.

| Row | Criterion | Judged by | Result | Findings, or the one change that would make it pass |
| --- | --- | --- | --- | --- |
| structure | The flow holds together: every state is reachable, nothing is a dead end, every error has a way back, every dialog closes and every button is wired. | tools/ux_review.mjs |  |  |
| constraint | The hidden constraint is met. | tools/ux_review.mjs |  |  |
| brief-covered | The flow does the job in the brief: booking, the clash and the way to a free slot, giving a slot up, and at least one error with its way back. | the reviewer |  |  |
| changed | The learner can say what the constraint changed, and the change is real. | the reviewer |  |  |
| partner-walk | A partner who did not see the work walks the low-fidelity prototype without help and finishes each task in the brief. | the partner |  |  |
| words | Every error and the clash say what happened and what to do next, in plain words. | the reviewer |  |  |
| qa | The screens pass the pathway's QA checklist for wireframes: a visible label on every field, one heading per screen, focus in reading order, a target of at least 24 by 24 px for every control, and no sideways scroll at 320 px. | the reviewer |  |  |
| own-work | The round was done in the time box, without an assistant, and with fictional data only. | the learner |  |  |

## Partner walk notes

| Task | Where they went | Where they stopped or hesitated | What changed, or why not |
| --- | --- | --- | --- |
| | | | |

Time box: 60 minutes. Started: ____ Finished: ____ Without an assistant, with fictional data only (learner): ____ Time confirmed (partner): ____

Pass when every row passes. A row that does not pass is marked not yet, with the one change that would make it pass; nothing is scored by points.
