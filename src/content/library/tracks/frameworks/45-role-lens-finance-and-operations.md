---
title: "Role lens: finance and operations"
description: "How finance and operations people use ORBITAL budgets, FinOps habits, Mission Control, service levels and incident roles to keep a product affordable and running, how agent sessions help under policy, and how to verify their output."
section: "Frameworks"
order: 45
track: "frameworks"
level: "core"
duration: "55 min"
outcomes:
  - "Build a budget with cost lines per epic, including agent runs, and review it monthly"
  - "Set service levels, an error budget and incident roles that operations can run"
  - "Delegate gathering and drafting to agent sessions while keeping spend and incident decisions with people"
resources:
  - "finops-foundation/what-is-finops"
  - "finops-foundation/framework"
  - "google/sre-service-level-objectives"
  - "google/sre-managing-incidents"
  - "atlassian/incident-management"
  - "gitlab/docs-audit-events"
prerequisites:
  - "tracks/frameworks/40-role-lens-one-shared-language"
updated: 2026-11-03
---

**Dojo programme link:** this lens supports the Budget and Logistics parts of ORBITAL (lesson 31), the Optimize and Deliver areas of ANDROID Ops, and the Mission Control work of lesson 34.

## 1. Why this matters

Two questions decide whether a product survives after launch. **Can we afford it?** and **Can we keep it running?** Finance answers the first, operations the second. They are two seats, but they share a habit: they turn a vague worry into a number, a name and a date.

Agent sessions change the cost picture. A session that runs for hours, or many sessions in parallel, spend real money on compute and on model use. They also change the operations picture: more changes reach production, faster. Without cost lines, limits and gates, the bill and the incident count both climb quietly.

## 2. Key ideas, explained

### 2.1 What the two seats own

| Seat | Responsibility | Framework or artefact | File in git |
|---|---|---|---|
| Finance | Plan the money | ORBITAL Budget | `docs/orbital.md`, `finance/budget.md` |
| Finance | Track the spend | Cost lines per epic, FinOps habits | `finance/actuals.md` |
| Finance | Find funding | Funding plan (grants, sponsors), honest status | `finance/funding.md` |
| Operations | Keep it running | Mission Control, SLOs, alerts | `mission-control/` |
| Operations | Respond to trouble | Incident roles, runbooks, reviews | `mission-control/runbook.md` |
| Operations | Run changes safely | Launch Sequence stages 4 and 5, change records | `docs/launch/` |

### 2.2 Money: budget, actuals, cost per outcome

A budget is a plan with caps. For each epic, write a cost line for people, tools, services and agent runs. Then track **actuals** against the plan. A useful measure is **cost per outcome**: not "what did we spend?" but "what did a successful cup return cost us?".

[FinOps](https://www.finops.org/introduction/what-is-finops/) is the practice of bringing finance, engineering and product together so that cost is visible to the people who cause it, and so that decisions about spend are made quickly with data. The [FinOps Framework overview](https://www.finops.org/framework/) lists its principles and phases (inform, optimise, operate). For small teams, the habits matter more than the tools: tag spend by epic, review it monthly, set caps, and make an owner for each line.

For agent runs, the practical controls are: a monthly cap per session class, a record of spend per issue in the merge request, and an alert when the cap is near.

### 2.3 Funding: honest status

When money comes from grants or sponsors, track each source with its **real status**: idea, drafted, submitted, awarded, received. Do not list a pending application as income, and never claim an approval you do not hold. Public guidance such as Grants.gov's [Grants Learning Center](https://www.grants.gov/learn-grants) and the SBA pages explain how programmes work. Rules differ by country and programme; read the actual terms.

### 2.4 Service levels and the error budget

Operations turns "it should work" into numbers. A **service level indicator** is a measure of how well the service works, for example the share of searches that answer in under one second. A **service level objective (SLO)** is the target for it, for example 99 percent over 28 days. The gap, 1 percent, is the **error budget**. When the budget is used up, the team stops adding features and fixes reliability. The Google SRE chapter on [service level objectives](https://sre.google/sre-book/service-level-objectives/) is the clearest free reference.

Start with one or two. Choose measures that match what people feel.

### 2.5 Incidents: roles, runbooks, reviews

When something breaks and users are affected, clarity beats heroics. Keep three roles: **incident commander** (decides and coordinates), **operations lead** (makes the fix) and **communications lead** (tells users and the team). See [Managing incidents](https://sre.google/sre-book/managing-incidents/) and Atlassian's [incident management guide](https://www.atlassian.com/incident-management). A **runbook** is a short page for the likeliest failure: signs, first checks, who to call, how to switch the feature off. After the event, write a **blameless review**: what happened, how it was found, what helped, what changes.

### 2.6 Audit trail

Finance and operations both need to answer "who changed what, when and why". The change record (a merge request with the template filled in) and the platform's audit events give the trail. GitLab's [audit events](https://docs.gitlab.com/user/compliance/audit_events/) are one example. Keep records for as long as your obligations require.

## 3. Step by step

### 3.1 Finance

1. **List cost lines** by epic: people, services, tools, map or data providers, agent runs.
2. **Set caps** for each and name an owner.
3. **Record actuals** monthly, with the invoice or export as source.
4. **Compute cost per outcome** for one measure.
5. **List funding sources** with honest status.
6. **Review in the GROWTH Health step** and note the next cap changes.

### 3.2 Operations

1. **Choose one or two SLOs** and the error budget policy.
2. **List alerts** and give each an owner.
3. **Write a runbook** for the likeliest failure, including the turn-off.
4. **Name the incident roles** and rehearse once.
5. **Review each incident** within two days and add one gate or alert.
6. **Check the change record** for each release.

## 4. Worked example: TrailMug

TrailMug's volunteer treasurer and Maya share the two seats.

**Finance (extract).**

| Line | Plan per month | Actual (example) | Source | Owner |
|---|---|---|---|---|
| Hosting and database | small cap | under cap | provider export | Maya |
| Map provider | cap by 1,000 searches | near cap | usage page | Maya |
| Agent runs | cap per session class | 60 percent used | run log | Maya |
| Stands for cafés | one-off | per café | receipts | Treasurer |

Cost per successful return was calculated from the map and hosting lines divided by returns that month. Funding: one community grant at "drafted", one sponsor conversation at "idea", no income counted.

**Operations (extract).** SLO: 99 percent of searches under one second over 28 days. Alerts: search latency (owner Maya), zero cafés open (owner Maya), error rate (owner Maya). Runbook: "finder returns nothing" with the switch name and the first three checks. The drill showed a missing alert, which was added.

When the agent-run cost reached 85 percent of the cap in mid-month, the alert warned Maya. She paused two nonessential sessions, and wrote a decision record about running fewer parallel sessions.

## 5. Working with AI agents on this

**What the seats decide.** The budget and caps; whether to spend more; which SLOs; whether to roll out, switch off or roll forward; what to tell users.

**What is delegated, with the exact brief.**

```text
Read finance/budget.md and the exports in finance/exports/. Build a table
of plan versus actual for the month, by line, with the file and row for
each actual. Flag any line over 80 percent of cap. Do not move money,
change the budget or contact anyone.
```

```text
Read mission-control/board.md and the metrics export in data/metrics/.
For each SLO, compute the share of good events over 28 days, show the
formula, and say how much error budget is left. Do not recommend actions.
```

```text
Draft a runbook for "finder returns nothing" from the incident review in
mission-control/drill-review.md. Include signs, first three checks, the
switch name and the owner. Mark any step you are unsure of as UNSURE.
Do not run any commands.
```

**How to verify.** Recompute one row from the source export. Check that every number has a source. Test the runbook steps in a safe environment. Confirm that the session wrote only to its allowed files.

**Disciplines involved.** Founder (risk and promises), product (what to cut when money is short), engineering (cost and reliability trade-offs), marketing (channel spend), design (heavy assets).

**Policy and gates.** Sessions never hold payment credentials and never have authority to spend. They report. Production changes pass the Launch Sequence gates and a protected-environment approval. In larger operations, agent fleets run inside written policy with briefings and a decision queue; the [Agent orchestration](/library/tracks/agent-orchestration/) track explains that shape.

## 6. Common mistakes and how to avoid them

- **A budget without caps.** Add a cap and an owner to each line.
- **Counting funding that is not received.** Show real status.
- **Ignoring agent run costs.** Track them per epic.
- **Too many SLOs.** One or two, tied to what users feel.
- **Alerts with no owner.** Name one or delete.
- **No turn-off in the runbook.** Add the switch.
- **Blame in reviews.** Ask what in the system allowed it.
- **Giving sessions payment access.** Never.
- **Not rehearsing.** Run a drill.

## 7. Practice

**Deliverable in git:** a branch `finance-ops-lens`:

1. `finance/budget.md` with cost lines per epic, caps and owners, including agent runs.
2. `finance/actuals.md` for one month with sources and cost per outcome for one measure.
3. `finance/funding.md` with honest status for each source.
4. `mission-control/slo.md`: one or two SLOs, the error budget and the policy.
5. `mission-control/runbook.md` and the incident roles, with a drill review.
6. A merge request listing the agent briefs, what you checked and one number you corrected.

## 8. Review checklist

- [ ] Every cost line has a cap and an owner.
- [ ] Actuals have sources.
- [ ] Funding statuses are honest.
- [ ] SLOs have an error budget policy.
- [ ] Every alert has an owner.
- [ ] The runbook includes the turn-off and was tested.
- [ ] Sessions have no spending authority.
- [ ] Reviews are blameless and add a gate or alert.

**Next:** the [developer lens](/library/tracks/frameworks/46-role-lens-developer/) shows the Product Development Manager directing agent teams.
