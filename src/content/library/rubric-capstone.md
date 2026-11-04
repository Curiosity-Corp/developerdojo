---
title: "Capstone rubric and the ten mandatory items"
description: "Six capstone skills with weights and four levels each, how points are worked out, and the ten items that must all pass."
section: "Assessment"
order: 3
level: advanced
duration: "60 min"
outcomes:
  - "Work out your capstone score from levels and weights."
  - "Describe what a proficient (level 3) result looks like for each of the six skills."
  - "List the ten mandatory items and explain how to meet each one."
  - "Self-grade before the final review and compare with your mentor."
resources:
  - adr/architectural-decision-records
  - renovate/docs
  - goharbor/docs
  - argo-cd/docs
  - hashicorp/terraform-intro
  - google-sre/postmortem-culture
  - sops/docs
  - opensource-guide/legal
prerequisites:
  - rubric-track-b-gates
---

The capstone is five days, 30 hours, on one product. This page is the rubric: how the work is scored and what you must show. Score yourself **before** the final review, then compare with your mentor.

**Pass mark: 70 points out of 100 AND all ten mandatory items.** Less is "not yet": fix forward and ask for a second review.

## How the points work

There are six skills. Their weights add up to 100. For each skill you get a level from 1 to 4, and each level is worth a share of the weight.

| Level | Name | Share of the weight |
|---|---|---|
| 1 | Missing | 0 percent |
| 2 | Developing | 50 percent |
| 3 | Proficient | 80 percent |
| 4 | Master | 100 percent |

Worked arithmetic. If the skill is worth 20 points:

- Level 1 gives 0 points.
- Level 2 gives 10 points.
- Level 3 gives 16 points.
- Level 4 gives 20 points.

For the whole capstone, add the six results. Example: OSS selection at level 3 (16 of 20), patch-fork at level 3 (16 of 20), IaC and GitOps at level 2 (10 of 20), catalogue at level 3 (12 of 15), ITIL at level 3 (12 of 15), and epic by hand at level 4 (10 of 10). Total: 16 + 16 + 10 + 12 + 12 + 10 = **76**. That is above 70, so the points are enough, but the ten mandatory items must still all pass.

Because level 3 is worth 80 percent, a learner who is proficient everywhere scores 80, which is a clear pass. A learner at level 2 everywhere scores 50, which is not a pass.

## The six skills

For each skill, level 3 is described as the program defines it. The other levels are described here in plain words, following the level names.

### Skill 1: OSS selection (weight 20)

**Proficient (level 3) looks like:** MUST and SHOULD needs written first. Three or more candidates. Licence file read. Fit percent with the unmet MUST list. One rung chosen. ADR filled.

| Level | What it looks like | TrailMug example |
|---|---|---|
| 1 Missing | No written needs, no candidates, or no ADR | The tool was chosen first. There is no decision record. |
| 2 Developing | Some needs and candidates, but the licence file was not read or the fit has no unmet-MUST list | Two candidates, fit percentages written, but the licence was copied from a web page. |
| 3 Proficient | As above | Three candidates, MUST and SHOULD needs written first, licence files read, fit calculated by hand, one rung chosen, ADR 0001 complete with a human name. |
| 4 Master | Level 3, and the ADR has a clear tech-debt statement, an exit plan and a reasoned note about a trap (for example a network copyleft candidate with the top score) | The ADR explains why the highest-scoring tool was rejected for its licence, and gives a one-week exit plan. |

### Skill 2: Patch-fork, or the alternative deliverable (weight 20)

**Proficient (level 3) looks like:** the upstream pinned with a tag and commit id. An update-bot custom manager for the pin file. A ledger with an owner and a removal condition for each patch. The pipeline re-applies the patches and runs tests. The image is stored in the registry.

If no project in your capstone needs patches, the program allows an **alternative deliverable** that shows the same discipline (for example, a vendored dependency with a pin, a ledger and a refresh job). Agree it with your mentor on Day 1.

| Level | What it looks like | TrailMug example |
|---|---|---|
| 1 Missing | No pin, no ledger | The code was copied from upstream with edits mixed in. |
| 2 Developing | A pin and a few patches, but no ledger or no automatic re-apply | Patches exist as files but a person applies them by hand. |
| 3 Proficient | As above | Pinned tag and commit id, bot configured, `PATCHES.md` with owner and removal condition, pipeline applies patches and tests, image in the registry. |
| 4 Master | Level 3, and one patch has been sent upstream or a patch that no longer applies was fixed and explained | An upstream pull request is open for the delivery-report patch, and the ledger says "drop when merged". |

### Skill 3: Infrastructure as code and GitOps (weight 20)

**Proficient (level 3) looks like:** Kustomize base and overlays. A GitOps application with prune and self-heal. Secret names only through an external secret. Terraform for one resource. A drift plan with a fix-forward merge request.

| Level | What it looks like | TrailMug example |
|---|---|---|
| 1 Missing | No overlays, or live changes by hand | The service was deployed with a command typed on a laptop. |
| 2 Developing | Overlays exist but the controller has no prune or self-heal, or a secret is partly inline | Staging and production overlays, but a password-like value appears in a file. |
| 3 Proficient | As above | Base and two overlays, controller with prune and self-heal, secret names only, one cloud resource in Terraform with the plan in the merge request, a drift plan with a worked fix-forward merge request. |
| 4 Master | Level 3, and the same digest is promoted from staging to production, with a gate added after a drill | A small policy check fails any overlay that uses `latest`. |

### Skill 4: Catalogue and map (weight 15)

**Proficient (level 3) looks like:** product, service and CI entries using real schema fields. Interim carriers where a field is not yet supported. Edges resolve. Search answers are written down.

An **interim carrier** is a documented stand-in used when the catalogue does not yet have a field for something. **Edges** are the links between entries; they **resolve** when each link points to an entry that exists.

| Level | What it looks like | TrailMug example |
|---|---|---|
| 1 Missing | No entries | The catalogue folder is empty. |
| 2 Developing | Entries exist but have missing fields or dead links | The returns service entry names a dependency that has no entry. |
| 3 Proficient | As above | Entries for the product, the returns service and its pipeline, all fields filled, every link resolves, three written questions with answers found by search. |
| 4 Master | Level 3, and the entries answer an "impact" question (what changes if this service goes down) | A short note lists the three entries that depend on the returns service and who owns them. |

### Skill 5: ITIL change and incident (weight 15)

**Proficient (level 3) looks like:** a complete change record with a human risk decision. A rehearsal: flag off, then a forward fix. A blameless review with five whys. A service level target sheet.

| Level | What it looks like | TrailMug example |
|---|---|---|
| 1 Missing | No change record or no rehearsal | The incident was "fixed" by reverting. |
| 2 Developing | A change record without a risk decision, or a review that names a person | The five whys end with "the engineer forgot". |
| 3 Proficient | As above | Change record with a named risk owner; rehearsal with a named commander, flag off and a forward fix; five whys ending at a process cause; one SLI and one SLO marked as a proposal. |
| 4 Master | Level 3, and the review adds a gate that is shown failing on the original change | A test is added that would have caught the duplicated email, and it is shown red on the old commit. |

### Skill 6: Epic and roadmap by hand (weight 10)

**Proficient (level 3) looks like:** clear outcome, a journey, a repo list, testable done lines, five ordered milestones, and accepted risks with a name.

| Level | What it looks like | TrailMug example |
|---|---|---|
| 1 Missing | No epic, or it was written by AI | The epic text came from a chat tool. This also fails mandatory item M6. |
| 2 Developing | An epic with no measure or no milestones | A goal and a task list, no dates. |
| 3 Proficient | As above | One epic by hand with outcome, journey, repo list, testable done lines, five ordered milestones, and named risk owners. |
| 4 Master | Level 3, and others can retell the epic without notes | The mentor repeats the epic in one minute after reading it once. |

## The ten mandatory items

These are pass or fail. All ten must pass. Tick each only when it is really done.

| Item | What it requires | How to meet it | Example of failing |
|---|---|---|---|
| **M1** | No plaintext secrets | Names only in git; values in a vault | A token in a config file |
| **M2** | No `kubectl apply`, `patch` or `create` | Look with `get`, `describe`, `logs`, `diff`; change through merge requests | A hand-typed apply |
| **M3** | ADR present, status Accepted, one rung | The ADR has status "Accepted" and names rung (b), (c) or (d) | An ADR with status "Draft" |
| **M4** | Licence checked and recorded | A licence-check record with SPDX id, file read, date, usage pattern, result | "MIT, I think" with no file |
| **M5** | Fix forward, not revert | Every repair is a new change that moves forward | A revert commit as the repair |
| **M6** | Epics hand-written | You wrote every epic and roadmap word | AI-written epic text |
| **M7** | Planned means simulated, and I marked it | Any Planned feature is marked "simulated" | Claiming a Planned step is running |
| **M8** | Human names on the ADR, the licence sign-off and the risk decision | Three named people (use real names in your own private repo) | "Approved by the team" |
| **M9** | Digests only: no `:latest`, no local builds | Images are referenced by digest; builds run in the pipeline | An image tagged `latest` |
| **M10** | Mentor sign-off on all five checkpoints | The mentor signs after Day 1, 2, 3, 4 and 5 | Four of five signed |

The five checkpoints are one per day: (1) epic and roadmap by hand, OSS selection, ADR 0001; (2) the patch-fork or alternative; (3) Kustomize, the GitOps application, external secret, Terraform, drift test plan; (4) catalogue entries, change record, service level sheet; (5) incident rehearsal, blameless review, self-grade.

## The 2030 Product Development Manager lens

- **You decide:** the epic, the rung, the risk owners, how you grade yourself, and when a mandatory item is truly met.
- **You delegate to agents** (where the starter kit allows): building the patch-fork pipeline, writing overlays, drafting catalogue entries from your decisions, running checks.
- **The brief you would write:** "For each mandatory item M1 to M10 in this repository, say met or not met, cite the file and line, and quote the text. Do not fix anything."
- **You verify by:** opening each cited file yourself and writing your own level for each skill before reading the agent's report.
- **Disciplines involved:** strategy (epic), engineering (pipelines), security (M1, M2, M9), legal (M4), finance (the tech-debt statement), operations (drift), service management (change and incident).
- **On the agent ladder:** the capstone is **orchestrate and govern** in miniature. Several agent sessions may work at once on different days' pieces, under written rules, with a mentor acting as the gate.

## Working with AI agents

- **Where allowed:** build, format, check. Where the task does not say AI is allowed, it is not.
- **Never:** epics, the self-grade, the oral review.
- **Disclose:** one line per use, kept in your capstone repository.
- **Planned features** must be simulated and marked so. An agent that quietly "makes it work" for a Planned feature has made a false claim.

## Common mistakes

1. **Chasing points and missing a mandatory item.** A pass needs both.
2. **Scoring yourself level 4 everywhere.** Your mentor will compare.
3. **Skipping the unmet MUST list.** It is a level 3 requirement.
4. **Leaving an ADR in "Draft".** M3 needs Accepted.
5. **Claiming Planned as running.** M7.
6. **Four checkpoints signed, not five.** M10.

## Practice

1. Write your own five-line plan for Day 1, with the product of each hour.
2. Score a sample capstone: use the TrailMug examples for level 3 in every skill and add up the points. (Answer: 16 + 16 + 16 + 12 + 12 + 8 = 80.)
3. Make a card with M1 to M10 and tick it after each day.
4. After the capstone, write what you would do differently in a three-line note to your mentor.

## Checklist

- [ ] I know the weights: 20, 20, 20, 15, 15, 10.
- [ ] I know the level shares: 0, 50, 80, 100 percent.
- [ ] I know the pass mark: 70 points and all ten mandatory items.
- [ ] I can say how to meet each of M1 to M10.
- [ ] I will self-grade before the final review.

## Where to go next

Read the [Track B weekly checklist and capstone plan](/library/weekly-checklist-track-b-and-capstone) and the [Master Developer assessment overview](/library/master-developer-assessment). For how the six Dojo Readiness areas line up with the rubrics, see the [readiness map](/library/rubric-readiness-map).
