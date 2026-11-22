# Sensei contributions: kata improvements, benchmark corrections and mentoring feedback

How people contribute to the Dojo's katas and evidence (#94), and how each contribution is checked, reviewed,
recorded and versioned. Written for contributors, reviewers and the Maintainer. It extends the Sensei handbook (#56)
and the certificate procedure (#60, [certificates.md](certificates.md)); it creates no new authority.

| Piece | Where |
| --- | --- |
| Public page: worksheets, review criteria, feedback process, boundaries, contribution record | `/sensei/contribute` (`src/pages/sensei/contribute.astro`) |
| Worksheets (blank, served as files) | `public/examples/sensei/*.md` |
| Issue templates | `.gitlab/issue_templates/Kata_improvement.md`, `Benchmark_correction.md`, `Mentoring_feedback.md` (confidential) |
| MR template | `.gitlab/merge_request_templates/Sensei_contribution.md` |
| Public contribution log | `src/data/sensei-contributions.ts`, checked by `src/lib/sensei-contributions.ts` |
| Change history on a kata | the recipe's `changes` list ([kata-recipes.md](kata-recipes.md)), shown as "Change history" on the kata page |
| Filled-in records of exercised contributions | [docs/contributions/](contributions/) |
| Tests | `tests/sensei-contributions.test.ts`, `e2e/sensei-contribution.spec.ts` |

## 1. Three kinds of contribution

| Kind | Template | Public? | What it changes |
| --- | --- | --- | --- |
| Kata improvement | `Kata_improvement` | Yes, once sanitized | A step, role, review gate, prompt or check in a kata recipe |
| Benchmark correction | `Benchmark_correction` | Yes, once sanitized | An Arena evidence record, by superseding it ([arena-evidence.md](arena-evidence.md)); never by editing measured numbers in place |
| Mentoring feedback | `Mentoring_feedback` | **Never.** Confidential issue, or kept with the learner | Nothing on the site. It is formative feedback to one learner |

The log rejects mentoring feedback outright, so it cannot be published by mistake.

## 2. The five checks

Every template asks for the same five, and the reviewer records which the evidence meets:

1. **Provenance and rights.** Source, author, version or date, licence and permission; confidentiality of any
   learner or customer material. Unknown rights stay unknown.
2. **Security of anything that runs.** Code, skills, tools, integrations and permissions are reviewed before they run,
   with the least access that works. The log refuses a change to something that runs without a recorded security
   review.
3. **Evidence reproduction.** Steps another person can follow; what was observed and when; what was not run. An
   unmeasured value is unavailable, never zero.
4. **Independent review.** See section 3.
5. **Version and change history.** Before and after, and an entry in the target's history: the recipe's `changes`
   list, or a superseding Arena record.

Plus the transfer question from the Sensei rubric: what the technique teaches, what changes in another field, and
what needs a qualified professional.

## 3. Roles and outcomes (no parallel authority)

The roles are [certificates.md section 3](certificates.md#3-who-decides), applied to contributions:

| Role | Does | Must not |
| --- | --- | --- |
| **Author** | Prepares the contribution and the evidence. | Review or approve their own contribution. |
| **Reviewer** (a reviewing Sensei, or a Maintainer who did not write it) | Reproduces what can be reproduced, records the five checks and the decision. | Be named before the review happened. Review with a conflict of interest. |
| **Maintainer** | Decides, merges the change through a reviewed MR with all site checks. | Mark a contribution accepted with no independent review. |

Outcomes (`review.outcome` in the log):

| Outcome | Meaning | The log requires |
| --- | --- | --- |
| `proposed` | Sent in, not decided | The target still reads as the "before" text |
| `changes-requested` | The reviewer asked for changes | Same |
| `applied` | The Maintainer merged it; **no independent review recorded yet** | `review.independent` is `{ unavailable }`; the target reads as "after"; a change-history entry on that date |
| `accepted` | A reviewer who is not the author recorded acceptance | `review.independent` is a recorded review; the target reads as "after"; a change-history entry whose review agrees |
| `declined` | Decided against, with the reason | The target still reads as "before" |

A contribution routed from the mission playbook's retrospective keeps the same state there
(`routed`, `applied`, `accepted` or `declined`); the check fails when the two disagree.

**Counts confer nothing.** The number of contributions, acceptances or reviews a person has never awards a belt, a
rank or the Sensei title. Only reviewed evidence against the published rubrics informs that decision
([independent-review-pilot.md](independent-review-pilot.md) section 1).

## 4. Process

1. The contributor fills the worksheet from `/sensei/contribute`.
2. A Maintainer opens an issue with the matching template (or the contributor does, if they have access). Mentoring
   feedback uses `Mentoring_feedback`, which makes the issue confidential.
3. The reviewer works through the five checks in the issue and records the outcome. A reviewer is written down only
   after the review happened.
4. For `applied` or `accepted`: one Draft MR with the `Sensei_contribution` template changes the target, adds the
   recipe's `changes` entry (or the superseding Arena record), adds the log entry and, for a routed improvement,
   updates the mission playbook status. `npm test` and the pipeline enforce the rules in section 3.
5. The contributor gets the decision and the reviewer's feedback in the issue, written with the feedback sentences
   from the Sensei handbook.
6. A filled-in copy of the template goes into [docs/contributions/](contributions/) as the durable record.

When an independent review happens later for an `applied` change: record the reviewer's role and decision in
`review.independent`, set the outcome to `accepted`, `changes-requested` or `declined`, update the recipe's change
entry `review`, and the mission playbook status. Nothing is backdated.

## 5. Exercised so far

| Record | Kind | Outcome | Independent review |
| --- | --- | --- | --- |
| [ux-005-review-gate](contributions/ux-005-review-gate.md) | Kata improvement | applied | Unavailable: no second person has reviewed it |

## 6. Limitations

- One contribution has been exercised, by the maintainers. No outside contributor has used the process yet, and no
  benchmark correction or mentoring feedback has been run through it.
- No independent human review of any contribution has happened.
- The site is static and takes no submissions; proposals reach the project through its tracker or the maintainer.
