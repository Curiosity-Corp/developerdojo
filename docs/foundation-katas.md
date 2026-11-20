# Staged foundation katas (FND-002 to FND-010)

The universal foundation family (#85) is recorded in `src/data/foundation-katas.ts` on the kata contract (#81, [kata-metadata.md](kata-metadata.md)). Every record is **staged**: it has no page, no execution record, no maintainer and no review, so it is not in `kataCatalog` or `KATA_DIRECTORY`, and `tests/foundation-katas.test.ts` fails if that changes. The shared foundation every record depends on, FND-001, is #84's record.

This file changes no program rule. The decision record in #80 is untouched.

## The family

| ID | Area | What it builds on (published) | Candidate external exercise | Rights | Main gap |
| --- | --- | --- | --- | --- | --- |
| FND-002 Harness Selection & Capability Limits | harness | stack-workbench, arena-evidence | SWE-agent paper (`swe-agent/agent-computer-interfaces`) | paper link only; code MIT | no harness-only Dojo run |
| FND-003 Model Routing & Escalation | models | budget-boss, arena-run-card | routing pattern (`anthropic/building-effective-agents`) | publisher terms, link only | no routing run, cost unavailable |
| FND-004 Instruction Engineering | instructions | compare-instructions (PRACTICE-001), stack-workbench | `anthropic/prompt-engineering-interactive-tutorial` | **no licence detected**: link only | tutorial not worked for the Dojo |
| FND-005 Context & Knowledge | context | context-trap (PRACTICE-002), research-and-compare | OWASP LLM Top 10 (`owasp/top-10-for-llm-applications`) | not checked | transfer exercise not run |
| FND-006 Agent Armory | skills and tools | stack-workbench, /armory/registry | `microsoft/mcp-for-beginners` | MIT | no equipped-capability run; security review |
| FND-007 Delegation & Agent Hierarchies | orchestration | delegate-and-review (!136), meeting-to-momentum | `anthropic/multi-agent-research-system` | publisher terms, link only | no hierarchy exercise |
| FND-008 Evidence, QA & Acceptance | verification | error-clinic, check-an-activity-report, arena-run-card | `anthropic/define-success-criteria` | publisher terms, link only | criteria-first exercise missing |
| FND-009 Cost, Reliability & Governance | governance | budget-boss, arena-run-card | `nist/ai-risk-management-framework` | publisher page, link only | no budgeted run, cost unavailable |
| FND-010 Unseen Mission | transfer | randori-challenges (!102), constraint-roulette | none required; Dojo-authored fictional mission | Dojo content, MIT | never attempted; needs a mission pool |

Prerequisites form a small graph: every record needs FND-001; FND-003 and FND-006 also need FND-002; FND-007 needs FND-004 and FND-008; FND-009 needs FND-003 and FND-008; FND-010 needs FND-007 and FND-009.

## What each record holds

Besides the contract fields, each record carries what the contract leaves to the tracking issue, so the evidence sits next to the claim:

- **outcome**: the finished, checkable artifact.
- **reusedPractice**: the published pages it builds on, what each supplies and what it does not show.
- **candidateExercise**: a real resource from the catalogue, the exercise, its state (`linked`, `planned`, `unverified`, `unavailable`), the date it was opened, and the rights state. `linked` means the URL answered and matched on that date; nothing was run.
- **assessment**: pass or fail rubric checks, a threshold, a smoke test and a transfer check.
- **evidenceAssessment**: what the existing material shows and does not show.
- **openGaps**: why the record is still staged.
- **maintainerRole** and `maintainer: 'unassigned'`: the role from [catalog-lifecycle.md](catalog-lifecycle.md); the person is recorded only when someone takes it.

FND-010 also carries the mission: goal, input, constraints and an answer key the test recomputes from the input. It names no model, harness, tool or hierarchy (tested).

## Moving a record out of staging

Follow "Checklist: add a specialization" in [kata-taxonomy.md](kata-taxonomy.md) for the page, directory and catalog steps. A record is ready when its openGaps are closed with evidence on its tracking issue: the candidate exercise has been worked and recorded, measured time and cost are recorded or explicitly unavailable, a maintainer has taken it, and a reviewer has applied the rubric. Then move the record into `kataCatalog` with its real `href`, delete it from `stagedFoundationKatas`, and keep its ID.

## Limitations

- Licences were read from repository metadata on 20 November 2026; that is not legal advice. Articles and documentation are linked, never copied.
- Rubrics are proposed. Nobody has applied them to a learner's work yet.
- Time and cost for every record are unavailable: no Dojo run was made for this staging.
