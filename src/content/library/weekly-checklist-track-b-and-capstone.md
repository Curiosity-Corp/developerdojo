---
title: "Weekly checklist: Track B and the capstone"
description: "Every Track B and capstone item, week by week, with hours, gate dates, what goes in git and what the mentor signs."
section: "Assessment"
order: 5
level: advanced
tool: checklist
duration: "10 to 13 hours per week, then 30 hours for the capstone"
outcomes:
  - "Plan the four Track B weeks, the gate dates and the five capstone days."
  - "Know what to put in your repositories at each step."
  - "Know which items your coach or mentor checks."
resources:
  - opengitops/principles
  - argo-cd/docs
  - renovate/docs
  - adr/architectural-decision-records
  - atlassian/change-management
  - google-sre/postmortem-culture
  - hashicorp/terraform-intro
  - sops/docs
prerequisites:
  - weekly-checklist-track-a
  - rubric-track-b-gates
---

Tick each box when it is **really done**. Items marked **[M]** are checked by your coach or mentor. Track B is the platform half of the Master Developer program. The hours given are the planned effort for a full-time pace.

Make your own copy of this checklist before you start. Keep it in your private capstone repository.

| Week | Theme | Planned hours | Gate |
|---|---|---|---|
| Track B week 1 | The company platform (chapter 9) | 10 | Gate 1 |
| Track B week 2 | The OSS-first ladder (chapter 10) | 11 | none yet |
| Track B week 3 | Patch-forks, IaC, GitOps and drift (chapters 11 and 12) | 13 | Gates 2 and 3 |
| Track B week 4 | ITIL on your stack and capstone prep (chapter 13) | 12 | Gate 4 |
| Capstone | 5 days | 30 | Final review |

The deck lessons give the teaching for these weeks: [Deck 10](/library/deck-10-internal-developer-platform) and [Deck 11](/library/deck-11-backstage-and-itsm-role-map) for week 1, [Deck 12](/library/deck-12-oss-first-ladder-and-licences) for week 2, [Deck 13](/library/deck-13-patch-fork-loop) and [Deck 14](/library/deck-14-gitops-iac-and-drift) for week 3, and [Deck 15](/library/deck-15-itil-in-git-change-and-incident) and [Deck 16](/library/deck-16-capstone-gates-and-certification) for week 4.

## Track B, week 1: The company platform (about 10 hours)

### Items

- [ ] **Read the platform chapter and the status labels (Built, Partial, Planned).** Planned means do not plan work that depends on it.
- [ ] **Do the chapter 9 exercises:** draw the stack from memory, add status labels, and fill the role map.
- [ ] **Name every component of your platform and where it lives.** For each job (map of everything, search, git host, update bot, registry, findings tracker, GitOps controller, standard pipeline) write the tool and its address in your own environment.
- [ ] **Say fairly why a second catalogue product is not adopted.** The fair-no pattern is in [Deck 11](/library/deck-11-backstage-and-itsm-role-map).
- [ ] **Fill the ITSM, ITIL and ERP role map and name each gap.**
- [ ] **Learning path Track B, week 1 items.**
- [ ] **[M] Gate 1 written test (20 of 25) and Task 1 (trace a change).**

### What goes in git

| File | Content |
|---|---|
| `platform/stack.md` | Your stack from memory, with status labels |
| `platform/role-map.md` | The role map with honest gaps |
| `platform/fair-no.md` | A half-page fair-no decision |
| `notes/b-week-1.md` | Weekly note |

## Track B, week 2: The OSS-first ladder (about 11 hours)

### Items

- [ ] **Read the OSS-first chapter:** four rungs, licences, the licence gate, the ADR.
- [ ] **Do the chapter 10 exercises.**
- [ ] **Compute fit percent with the formula and list the unmet MUST needs.** Fit = (2 × MUST met + SHOULD met) / (2 × MUST total + SHOULD total).
- [ ] **Read a licence file and name the SPDX id and any folders with a different licence.**
- [ ] **Explain the AGPL network trap in one minute.**
- [ ] **Write one licence-check record and one ADR with a tech-debt statement.**
- [ ] **Learning path Track B, week 2 items.**
- [ ] **Look ahead:** Gate 2 covers chapters 10 and 11, so you sit it early in week 3, after chapter 11.

### What goes in git

| File | Content |
|---|---|
| `docs/adr/0001-<tool>.md` | The ADR, from the [decision record template](/library/template-decision-record) |
| `docs/licence-checks/<tool>.md` | The licence-check record |
| `notes/b-week-2.md` | Weekly note |

## Track B, week 3: Patch-forks, IaC, GitOps and drift (about 13 hours)

### Items

- [ ] **Read chapters 11 and 12.**
- [ ] **Do the chapter 11 and chapter 12 exercises.**
- [ ] **Write an update-bot custom manager for a pin file and a patch ledger.**
- [ ] **Read a GitOps application definition and spot a bad sync policy or an inline secret.**
- [ ] **Triage a drift, write the fix-forward merge request, and write the gate that prevents it next time.**
- [ ] **Never use `kubectl apply`, `patch` or `create`.**
- [ ] **Learning path Track B, week 3 items.**
- [ ] **[M] Gate 2 written test (20 of 25) and Task 2 (licence check and ADR), early in the week.**
- [ ] **[M] Gate 3 written test (20 of 25) and Task 3 (close a drift), at the end of the week.**

### What goes in git

| File | Content |
|---|---|
| `patches/PATCHES.md` | Patch ledger with owner and removal condition |
| `renovate.json` (or equivalent) | The custom manager for the pin file |
| `ops/overlays/` | Base and overlays |
| `ops/drift/<case>.md` | The drift note: diff, decision, fix, gate |
| `notes/b-week-3.md` | Weekly note |

## Track B, week 4: ITIL on your stack and capstone prep (about 12 hours)

### Items

- [ ] **Read chapter 13:** catalogue, configuration database, change enablement, incident, problem, service levels.
- [ ] **Do the chapter 13 exercises and drills D1 to D3.**
- [ ] **Write a catalogue entry, a change record and an incident record.** Use the [catalogue entry](/library/template-catalogue-entry) and [change record](/library/template-change-record) templates.
- [ ] **Explain "the merge request is the change record" to someone who uses a classic IT service tool.**
- [ ] **Choose your capstone need, write down the epic idea (by hand) and list the exercises you will reuse.**
- [ ] **Learning path Track B, week 4 items.**
- [ ] **[M] Gate 4 written test (20 of 25) and Task 4 (a change and an incident).**

### What goes in git

| File | Content |
|---|---|
| `catalogue/<service>.yaml` | A catalogue entry |
| `changes/0001-<change>.md` | A change record with a named risk decision |
| `incidents/0001-<incident>.md` | An incident record |
| `capstone/epic-idea.md` | The epic idea, written by hand |
| `notes/b-week-4.md` | Weekly note |

## Capstone (5 days, 30 hours) and certification

Plan six focused hours a day. A mentor signs a checkpoint at the end of each day.

### Items

- [ ] **Day 1: epic and roadmap by hand, OSS selection, ADR 0001 (checkpoint 1).**
- [ ] **Day 2: patch-fork or the alternative deliverable (checkpoint 2).**
- [ ] **Day 3: Kustomize, GitOps application, external secret, Terraform, drift test plan (checkpoint 3).**
- [ ] **Day 4: catalogue entries, change record, service level sheet (checkpoint 4).**
- [ ] **Day 5: incident rehearsal, blameless review, self-grade (checkpoint 5).**
- [ ] **Final mixed exam (34 of 40) and oral review (18 of 24).**
- [ ] **[M] Capstone final review: 70 points and all ten mandatory items.** See the [capstone rubric](/library/rubric-capstone).
- [ ] **No open integrity breach.** The mentor signs and the program lead merges the result record.

### What goes in git

| Day | Evidence in your private capstone repository |
|---|---|
| 1 | `epics/`, `ROADMAP.md`, `docs/adr/0001-...`, licence-check record |
| 2 | Pin file, patches, `PATCHES.md`, bot config, green pipeline link |
| 3 | Overlays, application definition, external secret (names only), Terraform for one resource, drift plan |
| 4 | Catalogue entries, change record, service level sheet marked "proposal" |
| 5 | Incident rehearsal record, blameless review with five whys, self-grade |

## The 2030 Product Development Manager lens

- **You decide:** the capstone product and epic, each rung and licence, which risks you accept, and your self-grade.
- **You delegate to agents** (where the starter kit allows): the pipeline, overlays, catalogue drafts after you chose the fields, the timeline for the incident rehearsal.
- **The brief you would write:** "Read my capstone repository and this day's checklist. For each item say present or missing, and cite the file. Do not edit anything."
- **You verify by:** opening the cited files and running the validation commands yourself.
- **Disciplines involved:** all of them, in one product: strategy, product, security, legal, finance, operations, service management and engineering.
- **On the agent ladder:** the capstone asks for **orchestrate** (several agent sessions on different pieces) and **govern** (written rules, gates and a mentor as the final gate). The advanced agent-orchestration track in this program goes deeper.

## Common mistakes

1. **Sitting Gate 2 before reading chapter 11.**
2. **Starting the capstone before Gate 4.**
3. **No evidence for ticked items.**
4. **Leaving a plaintext secret in a practice repository.** It breaks a critical behaviour.
5. **Letting the weekly note slide.**
6. **Treating hours as a target.** The hours are a planning aid; the gates are the measure.

## Practice

1. Put the gate dates in your calendar, in order.
2. Create the folder structure above in your capstone repository.
3. Write your own checklist of the ten mandatory items and tick them off each day.

## Where to go next

Read the [capstone rubric](/library/rubric-capstone), the [gates page](/library/rubric-track-b-gates) and the [Master Developer assessment overview](/library/master-developer-assessment).
