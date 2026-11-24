# 0001: AI-assisted planning and role terminology

- **Status:** Proposed. Nothing in this record is approved. The current rules stay in force until the
  approvals in [Approvals needed](#approvals-needed) are recorded.
- **Date:** 2026-11-14. Inventory re-checked against `master` on 2026-11-24.
- **Issue:** #80 (milestone "M1: Manifesto and policy review"). Related: #79 (universal development on the
  site), #81 (taxonomy).
- **AI disclosure:** an AI agent drafted this record from the repository. A person must check it before any
  approval.

## Context

The site is moving to a universal direction: "the orchestrator is the developer". Development becomes a
shared foundation plus field expertise (#79). Two older program rules conflict with that direction:

1. **The no-AI-epics rule** (Rule 1 of The Way). People write epics and roadmaps, and AI never does. AI may
   explain, spell-check, search facts, ask questions and break a human-written milestone into issues.
2. **The 2030 Product Development Manager framing.** The site and the maintainer docs describe one target
   role, a product person who directs agents. The universal direction treats that role as one
   specialization.

#79 says that any public statement that the old rules are superseded needs the approvals recorded here.
Additive site work must not silently rewrite historical rules.

## Rule register

One row per rule. "Review owner" is the role that must approve a change. The repository names no
people for these roles, so the people must be named in #80 before any approval is requested.

| ID | Rule (as it stands) | Authority | Affected assets | Conflict with the universal direction | Proposed disposition | Review owner | Approval state |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | **No AI epics.** People write every epic and roadmap; AI never does. | The Way, rule 1 (`the-way-five-rules.md`, `people-write-epics.md`); program guide (SharePoint, canonical) | Section A1 to A11 below | The universal direction expects disclosed AI drafting and decomposition of plans | Keep as the historical rule. Publish a reviewed successor (see [Proposal](#proposal-pending-approval)) for new cohorts and new challenge versions only. Link the successor from the old page; do not edit the old text | Program owner (Master Developer program) | Not requested |
| R2 | **Allowed AI list.** AI may only explain, spell-check, search facts, ask questions, and break a human-written milestone into issues. | Same pages as R1, plus `disclose-ai-use.md`, `program-ai-use-and-disclosure.md` | Same as R1 | Too narrow for AI-assisted planning | Replaced by the successor's "AI may draft, decompose and propose" clause. Old list stays on the historical page | Program owner | Not requested |
| R3 | **No AI personas, journey steps or quotes.** Persona and journey conclusions and customer quotes are written by people. | `people-write-epics.md`, deck 4, the personas and journeys templates | Templates 1 and 2, `template-personas.md`, personas-and-journeys track | None in substance. The universal direction keeps human-verified evidence | Keep. Carry into the successor as "evidence stays human-verified" | Program owner | Not requested |
| R4 | **Self-assessment honesty check.** A learner confirms they wrote every epic and roadmap sentence themselves. | Track A self-assessment rubric (`rubric-track-a-self-assessment.md`), persisted in the learner's browser | Section C below | Would contradict the successor | Keep version 1 answers with their meaning. A successor check ships as assessment version 2 | Program owner, then repository maintainers for the code | Not requested |
| R5 | **"Written by me, no AI" template column** and "NO AI WRITES YOUR EPICS" template notes. | Program workbooks (SharePoint, canonical) | Six learner templates under `public/templates/` (section D) | Would contradict the successor | Change the canonical workbook, keep the old version, then regenerate. Never edit the copies | Owner of the program SharePoint material | Not requested |
| R6 | **Challenge rule "People write the epics and the roadmap".** | Published challenge briefs (`src/lib/challenge-briefs.ts`) | Challenge pages, community e2e check | Would contradict the successor for new challenges | Challenges already run keep the old rule. New challenge versions name the rule version they use | Program owner, then repository maintainers | Not requested |
| R7 | **The 2030 Product Development Manager is the target role.** | `the-2030-product-development-manager.md` ("Start here", order 0); maintainer docs (`docs/style-guide.md`, `docs/handbook.md` section 4) | Section B below | The universal direction treats product as one specialization | Keep the page as the product specialization. Rewrite maintainer guidance as "the developer who orchestrates an outcome". Move the page from first position only once the universal entry page from #79 exists | Program owner for the role definition; repository maintainers for the docs | Not requested |
| R8 | **"The Dojo rules also never change"** (handbook section 4, which restates R1). | `docs/handbook.md` | Maintainer docs | Blocks any successor | Amend to "rules change only by an approved decision record, and old versions stay published" in the same MR as the successor | Repository maintainers | Not requested |

## Asset inventory

Searched with `rg -il` over the tree at `master` on 2026-11-24 for "no-AI-epics", "people write (the)
epics", "AI never does", "write your epic", "no AI" and "Product Development Manager". The lists are
complete for those phrases only; lessons that state a rule in other words may be missing.

### A. Assets carrying R1 to R3 and R6

| # | Asset | Where | Generated copy? | Proposed disposition |
| --- | --- | --- | --- | --- |
| A1 | Rule statement | `src/content/library/the-way-five-rules.md` (rule 1), `people-write-epics.md` | No: site canonical | Historical page stays. Successor page links back |
| A2 | Program application | `program-ai-use-and-disclosure.md`, `program-how-sensei-work.md`, `program-two-levels-and-capstone.md`, `program-why-and-who.md`, `master-developer-overview.md`, `disclose-ai-use.md`, `sensei-role-and-limits.md` | Program-guide pages (section D) | Follow the successor once approved. Unchanged until then |
| A3 | Teaching deck | `deck-02`, `deck-03`, `deck-04-no-ai-epics-rule.md`, `deck-05`, `deck-07`, `deck-09`, `deck-16` | **Yes** (section D) | Change the canonical deck first, keep the old version, regenerate |
| A4 | Templates (site pages) | `template-personas.md`, `templates-overview.md`, `epic-standard.md` | Template pages are copies (section D); `epic-standard.md` is a site standard | As A3 for copies; `epic-standard.md` follows the successor |
| A5 | Weekly material and worked example | `week-3-problems-to-epics.md`, `week-6-catalogue-demo-package.md`, `weekly-checklist-track-a.md`, `shiftwren-example.md`, `shiftwren-week-3-problems-to-epics.md` | **Yes** (learning path, checklist, worked example) | As A3. Add a note where older cohorts used the old rule |
| A6 | Rubrics | `rubric-track-a-self-assessment.md`, `rubric-track-b-gates.md` | **Yes** (program rubric) | See section C. Assessment meaning must not change retroactively |
| A7 | Track lessons | 32 lessons under `src/content/library/tracks/` in 9 tracks: frameworks (16), working-with-ai-agents (8), phantoms-stack (2), and one each in git-and-gitlab, leading-people-and-agents, personas-and-journeys, research-and-evidence, roadmapping-and-epics, stakeholder-communication | No: site canonical | Review each lesson against the successor. Most only cite the rule; a link to the current rule page is enough |
| A8 | Track pages | 6 pages under `src/content/tracks/`: decision-making, frameworks, phantoms-stack, research-and-evidence, roadmapping-and-epics, working-with-ai-agents | No | As A7 |
| A9 | Challenges | `src/lib/challenge-briefs.ts` (the brief rule, the "That breaks Rule 1" pitfall, the "A human-written epic" deliverable), `src/pages/challenges.astro`, `src/pages/challenges/[slug].astro` | No | See R6 |
| A10 | Certificates page and resource note | `src/pages/certificates.astro` (policy in `docs/certificates.md`); `src/content/resources/atlassian/ai-agents-in-project-management.yaml` | No | Issued certificates keep their meaning; wording changes need the certificate owner. Review the annotation wording only |
| A11 | Tests that pin the current wording | `e2e/library.spec.ts`, `e2e/lesson.spec.ts`, `e2e/search.spec.ts` (page title "People write epics"), `e2e/community.spec.ts` (challenge rule text), `e2e/tools.spec.ts` and `tests/self-assessment.test.ts` (assessment) | No | Keep the historical page title so these stay green. Successor MRs add tests for the new page rather than rewriting these |
| A12 | Maintainer docs | `docs/style-guide.md` ("People write epics and roadmaps"), `docs/handbook.md` (R8), `ROADMAP.md` (dated snapshot of 2026-11-03), `CONTRIBUTING.md` (example link only) | No | Update the style guide and the handbook in the same MR as the successor. Leave `ROADMAP.md` as a dated snapshot |

### B. Assets carrying R7 (Product Development Manager framing)

The phrase appears in 196 files. Almost all of them use it as the program's audience ("for the Product
Development Manager"), not as a rule. They split as follows:

| Group | Where | Proposed disposition |
| --- | --- | --- |
| Role definition | `src/content/library/the-2030-product-development-manager.md`; link from `src/pages/train.astro`; hero card in `src/components/NoteCard.astro` | As R7 |
| Maintainer guidance | `docs/style-guide.md` (who we train, the four questions every lesson answers), `docs/handbook.md` (section 4), `docs/track-videos/product-discovery.md` | Rewrite with the successor, same approval |
| Generated program copies | deck (16), program guide (8), Master Developer (8), Shiftwren example (7), learning path (5), templates (11), catalogue framework (8), assessment (6), Sensei handbook (7) pages under `src/content/library/` | Unchanged. They describe the product curriculum, which stays as a specialization |
| Site lessons and track pages | 92 lessons in 20 tracks, and 20 track pages, including fields such as robotics and bioinformatics that only name the audience | Replace the audience wording track by track once the universal entry page from #79 exists. No approval of R1 needed for pure audience wording, but the style-guide change (R7) comes first |
| Resource notes and roadmap | 4 resource annotations; `ROADMAP.md` line 14 (dated) | Annotations follow the tracks; `ROADMAP.md` unchanged |

### C. Persisted learner data (R4)

`src/lib/self-assessment.ts` stores a "No-AI-epics honesty check" with three questions: whether you wrote
every epic and roadmap sentence yourself, whether you used AI only for the allowed list, and whether you
can explain each epic without notes. The answers are saved in the learner's browser under
`dojo:self-assessment:track-a` (`ASSESSMENT_NAME = 'self-assessment:track-a'`, `ASSESSMENT_VERSION = 1`,
through `src/lib/storage.ts`). `src/components/SelfAssessment.astro` renders it.
`tests/self-assessment.test.ts` keeps the questions in step with `rubric-track-a-self-assessment.md`, and
`e2e/tools.spec.ts` checks the saved record.

Proposed disposition: do not change the meaning of saved answers. A successor rule ships as
`ASSESSMENT_VERSION = 2` with its own questions. Version 1 answers stay readable and are labelled with the
rule version they were given under. No silent migration.

### D. Generated training copies and their canonical source

These site files are copies of the Master Developer program material. The canonical originals are in the
program SharePoint folder named in `docs/handbook.md` section 3. No generation script is in this
repository, so the copies were produced outside it. Rule for every row: **do not edit the copy**. Change
the canonical original, keep its previous version, regenerate, and link the reviewed successor from the
old version. Prior approvals and issued certificates are not changed retroactively.

| Site copies | Canonical source (program SharePoint folder) | Carries |
| --- | --- | --- |
| 16 "Teaching deck" pages (`deck-01` to `deck-16`) | Teaching deck with speaker notes | R1, R2, R3, R7 |
| 8 "Program guide" pages (`program-*`), 8 "Master Developer" pages | Program guide | R1, R2, R7 |
| 11 "Templates" pages (`template-*`, `templates-overview.md`) and 16 files in `public/templates/` (Markdown, plus `.docx` and `.xlsx` workbooks); six of the Markdown templates carry "NO AI" wording | Eight blank workbooks | R3, R5, R7 |
| 4 rubric pages (`rubric-*`) in the "Assessment" section | Rubric | R4, R7 |
| 2 weekly checklists (`weekly-checklist-*`), 5 "Learning path" pages (`learning-path-*`) and the weekly lessons (`week-*`) | Weekly checklist; learning path | R1, R7 |
| 7 "Shiftwren example" pages | Worked example (published only as a fictional case study) | R1, R7 |
| 8 "Catalogue framework" pages | Catalogue guide | R7 |

## Findings recorded during review

These are recorded only. Fixing them would rewrite the historical rule, so no change is proposed here.

1. **The rule's reasons do not match across pages.** `people-write-epics.md` lists six reasons,
   `program-ai-use-and-disclosure.md` says "four reasons", and `deck-04-no-ai-epics-rule.md` says "three
   reasons". A successor should keep its reasons in one place.
2. **The canonical source of the deck is stated two ways.** `deck-01-the-humans-job.md` says "the source of
   truth is git" and the deck is a generated copy of it, while `docs/handbook.md` section 3 and
   `docs/source-map.md` name the program SharePoint folder as the home of the teaching deck. The program
   owner must say which is canonical before any successor is generated, or the copies and the original
   will drift.
3. **The SharePoint originals have not been re-checked.** `docs/source-map.md` says the folder was not
   re-checked on 2026-11-03, so the site copies may already differ from their originals.

## Proposal (pending approval)

A prospective successor to R1 and R2, effective for new cohorts and new challenge versions only:

- **AI may draft, decompose and propose plans**, including epics and roadmaps, when its use is disclosed.
- **A named person stays accountable for every planning decision.** They choose what is in, what is out
  and the order, and they can explain each choice without notes. This keeps the "explain it aloud" check.
- **Evidence stays human-verified** (keeps R3). No invented customers, quotes, numbers, approvals or
  sources. Persona and journey conclusions must trace to real evidence.
- **Disclosure stays mandatory**, as in `disclose-ai-use.md`.

Approving the product direction (#79) does not approve this proposal.

## Approvals needed

The repository does not name the program owner or the policy approvers. The people who sign must be named
in #80 before anything changes. Each approval is separate; one does not imply another.

| Decision | Rules | Approver | State |
| --- | --- | --- | --- |
| Adopt the successor to Rule 1 and the allowed list | R1, R2, R3 | Program owner (Master Developer program) | Not requested |
| Settle which source is canonical for the deck (finding 2) | all copies | Program owner | Not requested |
| Change the canonical deck and workbooks, and keep their old versions | R5, section D | Owner of the program SharePoint material | Not requested |
| Ship the self-assessment as version 2 | R4 | Program owner, then repository maintainers | Not requested |
| New challenge versions under the successor | R6 | Program owner, then repository maintainers | Not requested |
| Reposition the Product Development Manager role as a specialization | R7 | Program owner | Not requested |
| Change the repository guidance (`docs/style-guide.md`, `docs/handbook.md`) | R7, R8 | Repository maintainers | Not requested |
| Change certificate wording | A10 | Certificate owner (`docs/certificates.md`) | Not requested |

## Limitations

- The SharePoint originals were not opened (finding 3).
- The inventory is from phrase searches. Lessons that state a rule in other words may be missing.
- No learner data was inspected. Saved progress lives only in each learner's browser.

## Consequences if approved

- One successor page, linked from the old rule. The old page stays published as history, so its route and
  the tests in A11 stay as they are.
- One MR per surface, in this order: canonical sources, generated copies, site lessons, the assessment
  version 2, then maintainer docs. Each MR keeps routes and saved progress.
- #79 may then state publicly that the old rule is superseded, linking to this record.
