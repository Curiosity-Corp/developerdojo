# Independent review pilot procedure

How the Dojo runs a pilot of an independent review against the proposed rank rubrics and belt stages, using
real learner work. Written for the pilot coordinator, the reviewer and the Maintainer. Read it with the
[certificate procedure](certificates.md) and the Sensei handbook in the library; this procedure reuses both and
changes neither.

**Status: proposed, not run.** The rubrics, the belt names and this pilot are proposals for the program policy
review (Curiosity-Corp/developerdojo#80). No pilot review has run. The data behind the public
[assessment map](https://developerdojo.org/assessment-map) is `src/data/assessment-map.ts`, checked by
`src/lib/assessment-map.ts` and `tests/assessment-map.test.ts` (developerdojo#90).

Contents: [1 What the pilot is](#1-what-the-pilot-is-and-is-not) · [2 Roles](#2-roles) · [3 Evidence](#3-the-evidence-the-reviewer-receives)
· [4 Run a pilot review](#4-run-a-pilot-review) · [5 After the review](#5-after-the-review-correct-withdraw-report)
· [6 What the pilot reuses](#6-what-the-pilot-reuses) · [7 Measures](#7-measures) · [8 What the tests check](#8-what-the-tests-check)
· [9 Specialist belts](#9-specialist-belts) · [10 The review record](#10-the-review-record)

## 1. What the pilot is (and is not)

The pilot answers one question: **do the proposed rubrics let an independent reviewer reach an evidence-based
judgment about real work, under an unseen task?** It is a test of the rubrics and the process, not of the learner.

- **It awards nothing.** A pilot review issues no belt and no rank. A checklist, attendance or time spent never
  awards a belt or a rank; only reviewed evidence can inform a decision.
- **It is not professional licensure or accreditation.** Dojo assessment is the Dojo's own. It never permits
  regulated work. Regulated or safety-critical work keeps its own independent validation and the approval of a
  qualified professional, separate from any Dojo review.
- **The website takes nothing in.** developerdojo.org is a static site. It takes no authenticated submissions and
  does not receive, store or send learner work, packets or review notes. Evidence moves between the learner and the
  reviewer only, in the learner's own repository or files.
- **The existing rank rules stand.** The Developer certificate (Product Package rubric), the Master Developer
  assessment and Sensei by application stay exactly as they are until #80 records the approvals.

## 2. Roles

| Role | Does | Must not |
| --- | --- | --- |
| **The learner** | Volunteers. Prepares the evidence. Decides what is kept and shared. | |
| **The reviewer** | Sets the unseen task, observes, records each criterion with evidence. | Review their own work or someone they have a conflict with ([certificates.md section 3](certificates.md#3-who-decides)). Promise a result. Paste learner work into an AI service without permission. |
| **The pilot coordinator** | Finds a volunteer and a reviewer, prepares the defect packet for SEN-3, writes the pilot report. | Review the same packet they coordinate. |
| **The Maintainer** | Reads the pilot report and proposes rubric changes to #80. | Turn a pilot result into a certificate. |

Two people, always: the reviewer and the coordinator are different people, as the reviewer and the approver are in
[certificates.md section 3](certificates.md#3-who-decides).

## 3. The evidence the reviewer receives

All six, in the learner's own repository or files, opened by the reviewer. A learner saying "it is there" is not
evidence ([certificates.md section 4](certificates.md#4-the-evidence-that-must-exist)).

| Evidence | What it is |
| --- | --- |
| **Artifacts** | The original work: files, a running prototype, a model, a report. Not screenshots or a summary. |
| **Reproducible configuration** | Harness, models, instructions, tools, versions and permissions, enough to repeat the main run. |
| **Tests and checks** | The learner's checks with real results, and the checks the reviewer chose and runs independently. |
| **Review log** | What the reviewer opened, ran and observed, criterion by criterion, with evidence references and questions. |
| **Failures** | What went wrong during the work and the unseen task, the cause, and the check that confirmed each repair. |
| **Decision evidence** | The main decisions, the alternatives rejected and why, and what is still unverified. |

The learner starts from the public review packet (`public/examples/belt-review-packet.md`, served at
`/examples/belt-review-packet.md`).

## 4. Run a pilot review

1. **Open a confidential issue** titled "Review pilot, <learner initials>", labelled `area::program`. It is the
   record of the case. No full name, no score and no link to private work in the title. This is the same rule as
   [certificates.md section 8](certificates.md#8-issue-a-certificate), step 1.
2. **Agree scope, access and consent in writing** in the issue: which rubric (Developer, Master Developer, Sensei)
   or which field belt stage, what the reviewer may open, keep and share, and for how long. Learner material never
   goes to an AI service without the learner's permission ([Sensei privacy and conduct](../src/content/library/sensei-privacy-and-conduct.md)).
   If you are not sure the person can agree for themselves (for example because of their age), stop and ask a
   project Owner, as in [certificates.md section 5](certificates.md#5-consent-before-anything-is-published).
3. **Choose the reviewer.** Relevant expertise, no conflict, not the coordinator. Record the choice and any declared
   conflict in the issue.
4. **The learner shares the six kinds of evidence** (section 3) by giving the reviewer read access. Nothing goes
   through the website.
5. **The reviewer prepares the unseen task privately,** before the session, and records it in a private note:
   - Developer: one changed requirement in the learner's own field.
   - Master Developer: a brief in a different tool family or field (MD-1), plus a tool withdrawal or injected
     failure during the task (MD-2).
   - Sensei: a technique to teach to a second volunteer with a reviewer-chosen constraint (SEN-1), a second field
     named on the day (SEN-2), and the coordinator's packet with one known defect (SEN-3).
   The learner does not see it in advance.
6. **Run the session** (about 30 to 60 minutes; the
   [30 minute review](../src/content/library/sensei-run-a-30-minute-review.md) is the base). Open the original
   artifact first. Reveal the unseen task, observe, and ask the learner to explain decisions without notes.
7. **Record every criterion** of the chosen rubric as *Observed*, *Not yet observed* or *Unclear*, each with an
   evidence reference (a file, a check result, a log line, a moment in the session). Absence of evidence is not a
   pass. No numeric score and no pass mark. Use the [review sheet](../src/content/library/sensei-review-sheet.md)
   layout and the [feedback sentences](../src/content/library/sensei-feedback-sentences.md). The
   [review record](#10-the-review-record) at `/review-record` holds steps 7 to 9 on the reviewer's own device.
8. **Give one strength and one gap,** both tied to evidence, and let the learner choose the next step.
9. **Write the review log** as a comment in the confidential issue: the rubric, each criterion with its observation
   and reference, the unseen task, the failures seen, the time taken, and any concern. No promise of a belt or rank.
10. **Close the case** in the issue: what the learner agreed may be kept, and what was deleted.

If something looks like a safety, privacy or conduct problem at any step, stop and follow
[when to ask the Maintainer](../src/content/library/sensei-when-to-ask-the-maintainer.md).

## 5. After the review: correct, withdraw, report

A pilot review is a record, not a certificate, but it follows the same correct and revoke discipline as the
registry ([certificates.md sections 9 and 10](certificates.md#9-correct-an-entry)):

1. **Correct.** If the learner shows the review log has a factual mistake, the reviewer adds a correcting comment in
   the same issue. The original comment stays; nothing is silently edited.
2. **Withdraw.** If the learner withdraws consent, the coordinator deletes the evidence copies the reviewer kept,
   removes the learner's material from the pilot report, and records the withdrawal and date in the issue.
3. **Report.** The coordinator writes a short pilot report on #90: how many reviews ran, which criteria were
   unclear to reviewers, the time each took, whether two reviewers agreed, and the rubric changes to propose to #80.
   No learner is identifiable without written consent.
4. **Update the public map.** In one merge request, set `pilot.status` in `src/data/assessment-map.ts` and fill
   the measures that now have values. A measure that was not measured stays `null` and shows *Unavailable*, never
   zero.

A learner who later wants a rank certificate goes through [certificates.md section 8](certificates.md#8-issue-a-certificate)
from step 1. A pilot review is not a substitute for any step there.

## 6. What the pilot reuses

| From | Reused for |
| --- | --- |
| [certificates.md](certificates.md) sections 3 and 4 (#60) | Two people, conflicts, evidence that is opened, not claimed. |
| [certificates.md](certificates.md) section 5 (#60) | Written consent, and the stop when someone may not be able to agree. |
| [certificates.md](certificates.md) sections 8, 9 and 10 (#60) | The confidential case issue, correction by a visible comment, removal on withdrawal. |
| Sensei handbook (#56): role and limits, 30 minute review, feedback sentences, privacy and conduct, when to ask the Maintainer, review sheet | How the reviewer behaves, runs the session and writes feedback. |
| The review packet on `/belt-review` (!118) | The learner's starting template and the six evidence dimensions. |
| Randori challenges and Constraint Roulette | Ideas for unseen constraints. |

## 7. Measures

The public map shows three pilot measures. Each is `null` until a pilot measures it.

| Measure | How to measure it |
| --- | --- |
| Pilot reviews completed | Count of closed pilot case issues with a review log. |
| Agreement between two reviewers | Two reviewers review the same packet independently; the share of criteria where both wrote the same observation. |
| Time one review takes | Minutes from opening the artifact to the end of the session, from the review log. |

## 8. What the tests check

`tests/assessment-map.test.ts`:

- the shipped map passes every rule in `checkAssessmentMap`, and every rubric and belt stage is `proposed`;
- an advanced criterion without an unseen constraint, a changed tool or failure, or independent judgment is rejected;
- a Master Developer rubric without transfer, and a Sensei rubric without teaching or domain adaptation, are rejected;
- a pilot measure with a value while the pilot status is `not-run` is rejected;
- each boundary statement (no award for a checklist or attendance, not licensure or accreditation, no authenticated
  submissions, qualified professional approval, consent) is required;
- the belts, certificates and review pages link to `/assessment-map`, and this procedure exists and is linked from
  the maintainer handbook.

`tests/review-record.test.ts` checks the review record: one specialist belt per sector pack at Brown and Black only,
each with its pack's professional-review limit; a record does not finish without consent, independence, the unseen
task, a strength, a gap and an evidence reference for every criterion; a finished record ignores edits and takes
only dated corrections; the log lists each criterion and states that it awards nothing; and a saved record for a
subject that no longer exists is dropped. `tests/assessment-map.test.ts` also rejects specialist belt criteria
without the `SPB-` prefix, without a Randori criterion carrying the advanced minimum, or without the field-limits
criterion, and reviewed stages out of order.

`e2e/review-record.spec.ts` drives the form in a browser: the specialist belts on the map link to a preselected
record, an incomplete record is refused with the reason, a finished record is locked across a reload, a correction
appears below the unchanged entries, the record is listed under Saved on this device, a new record starts empty,
the page fits 320 px, reads without JavaScript and passes the axe WCAG 2.1 AA scan in both themes.

`e2e/assessment-map.spec.ts` checks the page in a browser: the three ranks, the proposed labels, *Unavailable*
measures, the boundaries, the links from the belts and certificates pages, a 320 px screen without JavaScript, and
the axe WCAG 2.1 AA scan.

## 9. Specialist belts

A specialist belt is a belt stage in one field, reviewed against that field's own checks. It is proposed, like
everything in this procedure, and no specialist belt is issued.

- **Which fields.** One specialist belt per sector pack (`src/data/sector-packs.ts`): a field gets one when its
  pathway is complete, with checks CI reruns and a Randori. Today that is UX, BIM, agriculture and science. Other
  fields practice the shared stages on `/belts` with the learner's own checklist.
- **Which stages.** Brown and Black (`specialistBelts.reviewedStages`). Brown is the first stage that asks the
  learner to defend evidence under an unseen change, so it is the first an independent reviewer looks at.
- **What it asks.** The shared criteria SPB-1 to SPB-3 in `src/data/assessment-map.ts` (the learner's own artifact
  passes the field checks rerun by the reviewer; the field Randori, unseen; field limits and qualified review), plus
  the proof of the stage itself.
- **What comes from the field.** The checks the reviewer reruns, the Randori recipe and the qualified-review limit
  are read from the sector pack at build time (`src/lib/specialist-belts-content.ts`), never copied, so a pathway
  and its belt cannot disagree. A pack whose Randori has no recipe fails the build.
- **Unseen means unseen.** For SPB-2 the reviewer picks a change *of the kind* the field Randori describes that the
  learner has not practiced: not one of the published Randori cards as written.

## 10. The review record

`/review-record` is the reviewer's form for steps 7 to 9 of section 4. It is a static page: what the reviewer types is
saved in their own browser (key `dojo:review-record`) and copied out as Markdown. The website receives nothing.

- The reviewer chooses a rank rubric or a specialist belt stage; the criteria, and for a belt the field's
  qualified-review limit, are shown from the same data as `/assessment-map`.
- It does not finish until scope, access and consent are agreed, the reviewer confirms independence, the unseen task
  is described, every criterion has an observation and an evidence reference, and one strength and one gap are
  written. *Not yet observed* and *Unclear* are valid observations: a criterion is recorded, not passed.
- A finished record is locked. A factual mistake is fixed with a dated correction listed below the unchanged entries,
  the same discipline as [certificates.md section 9](certificates.md#9-correct-an-entry).
- The reviewer copies the review log into the confidential case issue (section 4, step 9). The record holds no
  learner name, and nothing on it awards a belt or a rank.
- One record is kept per browser. Starting a new record removes the old one from the device, so copy the log first.
