---
title: "The ORBITAL layer: objective, resources and indicators"
description: "The seven ORBITAL elements (Objective, Resources, Budget, Indicators, Transport, Activities, Logistics) explained with a TrailMug example and the measurement principle."
section: "Catalogue framework"
order: 3
level: core
duration: "60 min"
outcomes:
  - "Write all seven ORBITAL elements for a product."
  - "Connect an objective to measurable, time-bound indicators."
  - "Link activities to your epic roadmap."
  - "Tell a measured result from a statement of intent."
resources:
  - atlassian/smart-goals
  - atlassian/product-roadmaps
  - atlassian/project-dependencies
  - svpg/alternative-to-roadmaps
  - google-sre/service-level-objectives
  - gitlab/milestones
prerequisites:
  - catalogue-master-layer
---

ORBITAL is layer 2 of the [catalogue framework](/library/catalogue-framework-overview). It turns the product idea into an organised objective and a resource plan. It makes visible the outcome you want, the money and people you need, how you will measure success, the work, and the practical arrangements.

The name is a list of seven letters. Each letter is a short section.

## Why it matters

Many plans fail between "we have a product" (Master) and "we shipped something" (ANDROID). The gap is: why, with what, for how much, measured how, in what order. ORBITAL is that gap written down. When someone asks "why are we doing this?", you point to Objective. When someone asks "how do we know it worked?", you point to Indicators.

## Key ideas

- **Seven elements, all required.** A gap in one makes the plan weak.
- **Objective in one outcome sentence.** If it is a list of tasks, it is not an objective.
- **Indicators are numbers with a date.** Observable and time-bound.
- **Evidence over intention.** "We will improve returns" is intention. "Return status visible for 90 percent of cups by 30 June" is an indicator.
- **Activities link to epics.** Your [epic roadmap](/library/template-epic-roadmap) is the source.

## The seven elements, explained

| Element | What to document | TrailMug example (fictional) |
|---|---|---|
| **O** Objective | The outcome, scope and intended result | A commuter always knows the status of her deposit. Scope: Dublin cafés, mobile app, refunds only. |
| **R** Resources | People, skills, tools, systems, data, vendors | One product manager, two engineers (part-time), a payments provider, the returns service, an email sender |
| **B** Budget | Costs, funding source, assumptions, timing, owner | 18,000 euro over six months. Funded by the pilot grant. Assumes 2,000 active cups. Owner: finance lead. |
| **I** Indicators | Targets, baselines, how measured, how often reported | Refund status visible for 90 percent of cups by 2027-06-30. Baseline today: 0. Measured from the returns database each Monday. |
| **T** Transport | How people, equipment, information and deliverables move | Cups move from café to wash site by weekly pickup. Return data moves from tablet to returns service by API. |
| **A** Activities | Workstreams, milestones, dependencies, owners | Epic 1 returns status (Leo). Milestone 1.1 status field live by 2027-04-15. Depends on payments provider approval. |
| **L** Logistics | Access, scheduling, buying, facilities, coordination | Tablets bought for 12 cafés; weekly café check-in call; read access to the provider dashboard for finance |

Use this table shape for your own page. One row can have several lines if needed.

## Steps

1. **Write the objective first.** One sentence, one outcome, one measure you could name.
2. **List resources from the Master layer.** Use the same names.
3. **Budget with assumptions.** Write the assumption beside every number.
4. **Write two or three indicators.** Each has a number, a date, a baseline and a source.
5. **Describe transport.** Include physical items and information.
6. **Copy activities from the roadmap.** Keep milestone dates and owners.
7. **List logistics** that could block work: access, buying, scheduling.
8. **Link back** to the Master page and forward to ANDROID.

## The measurement principle

Indicators should be **observable and time-bound** wherever possible. Prefer evidence of completed outputs and measured outcomes to statements of intention.

| Weak | Strong |
|---|---|
| Improve customer experience | 80 percent of returns confirmed within one hour by 2027-06-30 |
| Be more reliable | Refund job succeeds 99 percent of days, measured daily from the returns log |
| Launch the pilot | Twelve cafés live, each with a signed check-in, by 2027-05-31 |

## Working with AI agents

- **May:** check that each indicator has a number, a date, a baseline and a source. Compare resource names with the Master layer. Calculate totals you give them.
- **May not:** invent a budget, set a target, or decide the objective. Numbers without assumptions are fiction.
- **A safe brief:** "For each indicator in this table, say whether it has a number, a date, a baseline and a source. Report missing parts. Do not suggest values."

## Common mistakes

1. **An objective that is a task list.**
2. **Indicators with no date or baseline.**
3. **A budget without assumptions.**
4. **Forgetting transport.** Information and goods both move.
5. **Logistics left until the week of launch.**
6. **Resource names that do not match the Master layer.**

## Practice

1. Write your objective in one sentence. Check it names an outcome, not a task.
2. Rewrite two weak indicators as strong ones.
3. Add the assumption to every number in your budget.
4. List three logistics items that could stop you in week one.

## Checklist

- [ ] All seven elements are filled.
- [ ] The objective is one outcome with a measure.
- [ ] Every indicator has a number, date, baseline and source.
- [ ] Budget numbers carry assumptions and an owner.
- [ ] Activities match the epic roadmap.
- [ ] Resources match the Master layer.

## The 2030 Product Development Manager lens

- **You decide:** the objective, the targets, the budget and the order of activities.
- **You delegate to agents:** consistency checks, arithmetic, drafting the indicator table from numbers you provide, and tracking activity status from the tracker.
- **A sample brief:** "Read the milestone list and the activity table. List any milestone missing from the table, and any table row with no milestone. Do not change dates."
- **You verify by:** recalculating one budget line and opening the source of one indicator.
- **Disciplines involved:** strategy, finance, operations, procurement and delivery.
- **On the agent ladder:** **delegate** the checking and the tracking. **Govern** the targets: only a person sets them.

## Further learning

Next: the [ANDROID layer](/library/catalogue-android-layer). Review [roadmap standard](/library/roadmap-standard) and the [epic roadmap template](/library/template-epic-roadmap) for the activities.
