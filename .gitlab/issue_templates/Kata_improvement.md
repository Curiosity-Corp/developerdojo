<!-- A reproducible kata improvement (Sensei contribution, see docs/sensei-contributions.md). Start from the worksheet at /examples/sensei/kata-improvement.md. Replace brackets. Do not put secrets, identifying learner details or private work in an issue. -->

## Learner outcome and reason
- Kata (ID and page) and the exact step, role or field:
- What does not work today, as it reads now (quote it):
- The proposed change, and what learners can do after it:

## The technique and how it transfers
[The reusable technique this improves, what stays the same in another field, what changes there, and where specialist or qualified professional review is needed.]

## The five checks
Answer each one. Write "unknown" or "not run" rather than leaving a gap; never write zero for a measurement nobody took.

### 1. Provenance and rights
- Source of the observation, and of every example, asset or data file reused (URL or site path, author, version or date):
- Licence and permission for the proposed use (unknown rights stay unknown):
- Confidentiality: what private learner or customer material is involved, and how it was kept out of this issue:

### 2. Security of anything that runs
- Does this improvement add or change code, a skill, a tool, an integration or a permission? (yes / no):
- If yes: what was reviewed, by whom (role), with what access, and what it may touch. A change to something that runs is not merged without this review.

### 3. Evidence reproduction
- Harness, model, instructions, tools and versions actually used (or "none: text only"):
- Steps someone else can follow:
- What was observed, and when (YYYY-MM-DD):
- What was not run or could not be reproduced:

### 4. Independent review
Roles are the certificate procedure's (`docs/certificates.md` section 3): a reviewer who is **not the author** (a reviewing Sensei, or a Maintainer who did not write it) reviews; the **Maintainer** decides and merges. No new authority.
- Author (role):
- Reviewer (role), filled in **only after** the review happened, or "unavailable" with the reason:
- Outcome: proposed / changes requested / applied (merged, no independent review yet) / accepted (independent review recorded) / declined, with the reason:
- Failures found during review and how each was corrected:

### 5. Version and change history
- What it replaces (the exact text, value or file before):
- What it becomes (after):
- Change-history entry (date, change, reason, review) added to the kata recipe's `changes` list or the evidence record's history, and the MR that carries it:

## Acceptance criteria
- [ ] Provenance, rights and confidentiality checked; unknowns documented; nothing private in this issue.
- [ ] Anything that runs was security-reviewed, or the change runs nothing.
- [ ] Someone other than the author can follow the reproduction steps; untested steps are named.
- [ ] Independent review recorded by a reviewer who is not the author, or recorded as unavailable (then the outcome is at most "applied").
- [ ] The recipe's `changes` list has the entry, and the public contribution log (`src/data/sensei-contributions.ts`) has the record; `npm test` and the pipeline are green.
- [ ] AI use disclosed.

/label ~"type::content" ~"area::tracks" ~"status::ready"
