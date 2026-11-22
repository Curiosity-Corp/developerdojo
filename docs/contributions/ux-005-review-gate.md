# Kata improvement: UX-005 review gate (exercised through the Kata_improvement template)

The first contribution taken through the Sensei contribution process (#94). Routed from the retrospective of the
worked mission on `/mission-playbook` (#95). The public record is the `ux-005-review-gate` entry in
`src/data/sensei-contributions.ts`; this file is the filled-in template behind it.

## Learner outcome and reason
- Kata (ID and page) and the exact step, role or field: UX-005, `/katas/ux-005-implement-and-qa`, agent role
  "Drafting assistant", `reviewGate`.
- What does not work today, as it reads now: "You compare every line with the flow and the done-when list before it
  goes into Penpot." In UX-005 the drafting assistant "Writes the page from the flow and tokens, one state at a time":
  the output is the web page, not the Penpot file. A learner following the gate literally would check the wrong
  destination.
- The proposed change: "You compare every line with the flow and the done-when list before it goes into the page."
  The learner then checks each drafted line before it enters the page they are building.

## The technique and how it transfers
The foundation technique (PRACTICE-001 and PRACTICE-002): nothing an assistant drafts is kept until a check it did not
write confirms it. The gate names *where* the draft is about to go, so the check happens before it lands. In UX-001
to UX-004 that is the Penpot file; in UX-005 it is the page. BIM and agriculture keep the same gate with their own
reference (the IFC file; FAO's worked examples). No specialist or professional review is needed for this wording.

## The five checks

### 1. Provenance and rights
- Source: the UX-005 recipe on master (`src/content/kata-recipes/ux-005-implement-and-qa.yaml`), read next to
  UX-001 to UX-004, on 2026-11-21. First noted on #94 (note from the #95 retrospective).
- Licence and permission: Dojo content, MIT. No outside material reused.
- Confidentiality: none involved. The kata uses an invented app (Pocket Invoice); the change is one sentence of Dojo
  text.

### 2. Security of anything that runs
- Adds or changes code, a skill, a tool, an integration or a permission: **no**. Text only.
- Review: not required beyond confirming that; recorded as "changes nothing that runs".

### 3. Evidence reproduction
- Harness, model, instructions, tools: none needed; text only. The recipes were read with `git grep`.
- Steps:
  1. Open UX-005 and read the review gate of the Drafting assistant.
  2. Read the same role in UX-001 to UX-004.
  3. Compare each gate with what the assistant produces in that kata (its responsibility line and the brief).
- Observed (2026-11-21): `git grep -n "before it goes into Penpot"` matched UX-001, UX-002, UX-003, UX-004 and UX-005.
  Only UX-005's assistant writes the page; in the other four it drafts work for the Penpot file, so their wording is
  right and stays.
- Not run: no learner has run UX-005 with either wording, so the effect on learners is not measured (unavailable).

### 4. Independent review
- Author (role): Dojo maintainers, with AI assistance (an AI agent read the recipes, drafted this record and made the
  change).
- Reviewer: **unavailable.** No second person has reviewed this change.
- Outcome: **applied** (merged by the maintainers as a wording correction; not accepted, because no independent review
  is recorded).
- Failures found during review and corrections: none recorded; no review has happened.

### 5. Version and change history
- Before: "You compare every line with the flow and the done-when list before it goes into Penpot."
- After: "You compare every line with the flow and the done-when list before it goes into the page."
- Change-history entry: `changes` in the UX-005 recipe, dated 2026-11-21, review `{ unavailable }`; shown under
  "Change history" on the kata page. The mission playbook's routed improvement moved from `routed` to `applied`.
  Carried by the #94 MR.

## Acceptance criteria
- [x] Provenance, rights and confidentiality checked; nothing private.
- [x] The change runs nothing.
- [x] Reproduction steps can be followed by someone else; the untested effect on learners is named.
- [x] Independent review recorded as unavailable; outcome is "applied", not "accepted".
- [x] Recipe `changes` entry and the contribution log entry added; `tests/sensei-contributions.test.ts` checks they agree.
- [x] AI use disclosed.

## Open item
An independent review by a second person. When it happens, follow [section 4 of the guide](../sensei-contributions.md#4-process).
