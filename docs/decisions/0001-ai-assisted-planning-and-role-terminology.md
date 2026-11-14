# 0001: AI-assisted planning and role terminology

- **Status:** Proposed. Nothing in this record is approved. The current rules stay in force until the approvals below are recorded.
- **Date:** 2026-11-14
- **Issue:** #80 (milestone "M1: Manifesto and policy review"). Related: #79 (universal development on the site), #81 (taxonomy).
- **AI disclosure:** an AI agent drafted this record from the repository. A person must check it before any approval.

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

## Inventory of conflicting rules

The file lists are from `rg` over the tree at `origin/master` on 2026-11-14. They are complete for the
phrases searched ("no-AI-epics", "people write epics", "AI never does", "write your epic"), but other
wordings may exist.

### A. The no-AI-epics rule

| Asset | Where | Authority | Proposed disposition |
| --- | --- | --- | --- |
| Rule statement | `src/content/library/the-way-five-rules.md` (rule 1), `people-write-epics.md` | Canonical site rule | Keep the page as the historical rule. Publish a reviewed successor page and link it from the old one. Do not edit the old text in place. |
| Program application | `program-ai-use-and-disclosure.md`, `disclose-ai-use.md`, `sensei-role-and-limits.md`, `program-how-sensei-work.md`, `program-two-levels-and-capstone.md`, `program-why-and-who.md`, `master-developer-overview.md` | Program policy pages | Follow the successor once it is approved. Until then, unchanged. |
| Teaching deck | `deck-02`, `deck-03`, `deck-04-no-ai-epics-rule.md`, `deck-05`, `deck-07`, `deck-09`, `deck-16` | **Generated copies** of the SharePoint teaching deck (`docs/source-map.md`, "Not in GitLab") | Do not edit the copies. Change the canonical deck first, keep the old version, then regenerate. |
| Learner template | `public/templates/template-5-epic-roadmap.md`, `template-personas.md`, `templates-overview.md` | Copy of a program workbook | Same as the deck: change the source, keep the old version, then regenerate. |
| Weekly material and worked example | `week-3-problems-to-epics.md`, `week-6-catalogue-demo-package.md`, `weekly-checklist-track-a.md`, `shiftwren-example.md`, `shiftwren-week-3-problems-to-epics.md`, `epic-standard.md` | Program curriculum | Update only after the successor is approved. Leave a note where older cohorts used the old rule. |
| Rubrics | `rubric-track-a-self-assessment.md`, `rubric-track-b-gates.md` | Assessment policy | See section C. Assessment meaning must not change retroactively. |
| Tracks | 32 lessons under `src/content/library/tracks/` (frameworks, working-with-ai-agents, roadmapping-and-epics, git-and-gitlab, phantoms-stack, others) and 5 track pages under `src/content/tracks/` | Site lessons | Review each lesson against the successor. Most only cite the rule; a link to the current rule page is enough. |
| Challenges | `src/lib/challenge-briefs.ts` (brief rule "People write the epics and the roadmap", the "That breaks Rule 1" pitfall, the "A human-written epic" deliverable), `src/pages/challenges.astro`, `src/pages/challenges/[slug].astro` | Published challenge rules | Challenges already run under the old rule keep it. New challenge versions name the rule version they use. |
| Certificates page | `src/pages/certificates.astro` | Certificate policy (`docs/certificates.md`) | Certificates already issued keep their meaning. Any wording change needs the certificate owner. |
| Resource note | `src/content/resources/atlassian/ai-agents-in-project-management.yaml` | Library annotation | Review the annotation wording only. |
| Maintainer docs | `docs/style-guide.md` ("People write epics and roadmaps"), `docs/handbook.md` ("the Dojo rules also never change"), `ROADMAP.md` (dated snapshot of 2026-11-03), `CONTRIBUTING.md` (example link only) | Repository guidance | Update the style guide and the handbook in the same MR as the successor. Leave `ROADMAP.md` as a dated snapshot. |

**Inconsistency in the current rule, found during this review.** The rule's own reasons do not match
across pages. `people-write-epics.md` gives six reasons, `program-ai-use-and-disclosure.md` gives four, and
`deck-04-no-ai-epics-rule.md` says "three reasons". Any successor should take one source of truth for its
reasons. Fixing the old pages is not proposed here, because that would also rewrite the historical rule.

### B. The Product Development Manager framing

| Asset | Where | Proposed disposition |
| --- | --- | --- |
| Role page | `src/content/library/the-2030-product-development-manager.md` (section "Start here", order 0) | Keep it as the page for the product specialization. Move it out of the first position only once the universal entry page from #79 exists. |
| Voice and lesson questions | `docs/style-guide.md` (who we train, the four questions every lesson answers) | Rewrite as "the developer who orchestrates an outcome", with the product role as one specialization. This needs the same approval as A. |
| Handbook | `docs/handbook.md` (section 3, the questions the Product Development Manager answers) | As above. |
| Roadmap snapshot | `ROADMAP.md` line 14 | Unchanged; it is dated. |

### C. Persisted learner data

`src/lib/self-assessment.ts` stores a "No-AI-epics honesty check" with three questions: whether you wrote
every epic and roadmap sentence yourself, whether you used AI only for the allowed list, and whether you
can explain each epic without notes. The check is saved in the learner's browser
(`ASSESSMENT_NAME = 'self-assessment:track-a'`, `ASSESSMENT_VERSION = 1`, via `src/lib/storage.ts`).
`src/components/SelfAssessment.astro` renders it. `tests/self-assessment.test.ts` keeps the questions in
step with `rubric-track-a-self-assessment.md`.

Proposed disposition: do not change the meaning of saved answers. A successor rule ships as
`ASSESSMENT_VERSION = 2` with its own questions. Version 1 answers stay readable and are labelled with the
rule version they were given under. No silent migration.

## Proposal (pending approval)

A prospective successor to Rule 1, effective for new cohorts and new challenge versions only:

- **AI may draft, decompose and propose plans**, including epics and roadmaps, when its use is disclosed.
- **A named person stays accountable for every planning decision.** They choose what is in, what is out
  and the order, and they can explain each choice without notes. This keeps the "explain it aloud" check.
- **Evidence stays human-verified.** No invented customers, quotes, numbers, approvals or sources. Persona
  and journey conclusions must trace to real evidence. This keeps the strongest part of the current rule.
- **Disclosure stays mandatory**, as in `disclose-ai-use.md`.

Approving the product direction (#79) does not approve this proposal.

## Approvals needed

The repository does not name the program owner or the policy approvers. The people who sign must be
named in #80 before anything changes.

| Decision | Approver | State |
| --- | --- | --- |
| Adopt the successor to Rule 1 | Program owner (Master Developer program) | Not requested |
| Change the canonical deck and workbooks, and keep their old versions | Owner of the program SharePoint material | Not requested |
| Change the repository guidance (`docs/style-guide.md`, `docs/handbook.md`) | Repository maintainers | Not requested |
| Change certificate wording | Certificate owner (`docs/certificates.md`) | Not requested |

## Limitations

- The SharePoint originals were not opened. `docs/source-map.md` says they were not rechecked, so the
  deck and workbook copies may already differ from their source.
- The inventory is from phrase searches. Lessons that state the rule in other words may be missing.
- No learner data was inspected. Saved progress lives only in each learner's browser.

## Consequences if approved

- One successor page, linked from the old rule. The old page stays published as history.
- One MR per surface, in this order: canonical sources, generated copies, site lessons, the assessment
  `version 2`, then maintainer docs. Each MR keeps routes and saved progress.
- #79 may then state publicly that the old rule is superseded, linking to this record.
