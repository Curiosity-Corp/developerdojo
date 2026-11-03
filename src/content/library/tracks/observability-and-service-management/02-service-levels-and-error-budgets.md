---
title: "Service levels and error budgets"
description: "Turning 'it should be fast and available' into numbers you can keep, and using the error budget to decide between new features and reliability work."
section: "Observability and service management"
order: 2
track: "observability-and-service-management"
level: "core"
duration: "90 min"
outcomes:
  - "Define a service level indicator, objective and agreement, and tell them apart"
  - "Choose an objective based on what customers need and what you can afford"
  - "Calculate an error budget and use it to decide what the team works on"
  - "Direct an agent to draft service levels and verify the numbers against real data"
prerequisites:
  - "template-catalogue-entry"
resources:
  - "google-sre/service-level-objectives"
  - "google/sre-workbook-implementing-slos"
  - "google/sre-workbook-alerting-on-slos"
  - "google/sre-book"
  - "dora/software-delivery-performance-metrics"
  - "dora/dora-research-program"
updated: 2026-11-03
---

Lesson 2 of the Observability and service management track. It ties directly to the `service_levels` fields in the Catalogue Entry template (`/library/template-catalogue-entry`).

## 1. Why this matters

"The app should be fast and always available" is not a promise. It cannot be measured, so it cannot be met or missed, and everyone will hear it differently. A customer hears "never down". An engineer hears "as good as we can". A manager hears "no complaints".

A **service level objective**, or SLO, replaces the wish with a number and a window: "99.5 percent of checkout requests succeed, measured over 30 days". It gives you something to measure, a line that tells you when to worry, and a shared answer to a hard question: **how reliable is reliable enough?** Perfect reliability costs more than it is worth, and slows everything else down. An error budget lets you spend the gap on change.

This is a product decision, and it belongs to you.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Which journeys get an objective, what level, what happens when the budget is spent | Drafting indicators and objectives, calculating budgets from real data, proposing alert rules, preparing a budget report | Recomputing the number from raw data, checking that the indicator reflects what customers feel, checking the objective is in the catalogue entry | Operations and SRE (measurement and alerting), finance (cost of nines), customer support (what hurts customers), legal and sales (if any contract mentions service levels) |

## 2. Key ideas, explained

### Three terms

| Term | Meaning | Example |
|---|---|---|
| **SLI**, service level indicator | A measurement of how the service is doing, usually a ratio of good events to all events. | The share of checkout requests that succeed within 800 ms. |
| **SLO**, service level objective | The target for the indicator over a time window. Internal. | 99.5 percent over a rolling 30 days. |
| **SLA**, service level agreement | A promise to customers, often in a contract, with consequences if missed. | A contract that refunds fees below 99 percent. |

An SLA should be looser than the SLO, so that you notice and fix problems before you break a promise. Never write an SLA without involving whoever owns contracts and legal matters. This track teaches SLIs and SLOs; it does not advise on contracts. Google's [chapter on service level objectives](https://sre.google/sre-book/service-level-objectives/) is the classic reference.

### Choosing an indicator

A good indicator reflects **what the customer experiences** and is measured as a ratio.

- **Availability:** successful requests divided by all valid requests.
- **Latency:** requests faster than a threshold divided by all requests. Use a percentage under a threshold, not an average, because averages hide the slow tail.
- **Correctness or freshness:** results that are right, or data that is recent enough.
- **Journey success:** the synthetic check from lesson 1 passing.

Pick **a small number** per service, tied to the main journeys. Three well-chosen indicators beat twenty.

### Choosing an objective

Do not start with "as high as possible". Start with customers.

1. **What level do customers notice?** A customer will not notice 99.95 compared with 99.9. They will notice a failed order.
2. **What do you do today?** Measure the current level for a few weeks first. An objective far above what you achieve is a fantasy, and far below it is meaningless.
3. **What does the next level cost?** Each extra "nine" typically costs much more than the last, in engineering, in infrastructure and in slower change.
4. **Differ by importance.** The catalogue entry template uses tiers: a tier 1 service may promise 99.9 percent, a tier 3 service best effort.

What do the numbers mean in time? Over 30 days:

| Objective | Allowed unreliability | About how long |
|---|---|---|
| 99 percent | 1 percent | 7 hours 12 minutes |
| 99.5 percent | 0.5 percent | 3 hours 36 minutes |
| 99.9 percent | 0.1 percent | 43 minutes |
| 99.99 percent | 0.01 percent | 4 minutes |

(These are the arithmetic of 30 days as 43,200 minutes. Check the sums yourself, or ask an agent and then verify, as the lesson's practice asks.) Seeing it in minutes helps decide whether you can really promise it, especially if one deployment or one dependency's outage takes you past it.

### The error budget

The **error budget** is the allowed unreliability: 100 percent minus the objective. With a 99.5 percent objective over 30 days, the budget is 0.5 percent of requests, or about 3.6 hours of full outage. Every failed request, every outage and every bad release **spends** budget.

The budget turns an argument into a decision.

| Budget state | What it means | What the team does |
|---|---|---|
| **Plenty left** | The service is more reliable than needed. | Ship features and take reasonable risks. Change faster. |
| **Running low** | Reliability is at risk. | Slow risky changes, add tests and checks, fix the largest causes. |
| **Spent** | The objective is missed. | Pause risky changes. Prioritise reliability work until the budget recovers. |

This works only if it is **agreed in advance**, written down, and followed. The product manager chooses the policy with the engineers, and the product manager is the one who holds the line when a feature is tempting but the budget is spent. The [Site Reliability Workbook](https://sre.google/workbook/implementing-slos/) shows how to implement SLOs step by step.

### Alerting on the budget

Alerting on every blip wakes people for nothing. Alerting only when the objective is already missed is too late. The better approach is to alert on how fast the budget is being spent, a **burn rate**: "at this rate the monthly budget is gone in two days" is worth an alert, and "one failed request" is not. Google's workbook chapter on [alerting on SLOs](https://sre.google/workbook/alerting-on-slos/) explains the idea. You do not need the formulas. You need to ask: **is this alert tied to an objective, and does it fire early enough but not too often?**

### Delivery measures and service measures

Service levels tell you how the product behaves for customers. A different set of measures tells you how well the team delivers change. The [DORA research](https://dora.dev/) identifies four, described in its [software delivery performance metrics](https://dora.dev/guides/dora-metrics/): how often you deploy, how long a change takes to reach production, how often a change causes a failure, and how long you take to recover. They are measures of the team and the pipeline, not of one service, and they should be used to find bottlenecks, not to rank people. Watch the pair: speed without stability, or stability without speed, is a signal.

### Where SLOs live

An SLO that exists only in a slide is forgotten. Put it in the service's **catalogue entry** as a file in git, next to the owner and the runbook, in the fields for service levels and support response:

```yaml
service_levels:
  availability: "99.5% per month"
  latency_p95_ms: 800
  support_response: "next business day"
```

Then the objective is reviewable, the owner is named, and the monitoring can be checked against it. Keep the **budget policy** in git too.

### A word on honesty

Only promise what you can measure. If a number cannot be computed from real data, write "not yet measured" rather than inventing one. An unmeasured objective is a hope.

## 3. Step by step: set an objective for one journey

1. **Choose the journey** and the customer it serves.
2. **Choose one to three indicators:** availability, latency, journey success.
3. **Measure the current level** for two to four weeks, from real data.
4. **Pick an objective** a little above the current level, based on what customers notice and what you can afford.
5. **Compute the budget** in requests and in minutes, and check the arithmetic.
6. **Write the budget policy:** what happens at plenty, low and spent.
7. **Agree the policy** with engineering and, if relevant, support and sales.
8. **Put the objective and policy in the catalogue entry** and in git.
9. **Set burn rate alerts** tied to the objective.
10. **Review** monthly: budget used, causes, changes to the objective.

## 4. Worked example: TrailMug

Maya has the journey check from lesson 1 and a month of data. She asks an agent to compute the current availability of the checkout journey from the data export, and to suggest an objective. The agent reports 99.7 percent, and proposes 99.95 percent "to be best in class".

She does not accept the proposal. She checks the number first: she recomputes the ratio herself from the raw export, and it is 99.6 percent. The agent had excluded a three-hour outage on a Saturday as "an outlier". She asks the agent to include every valid request, and the number agrees at 99.6 percent. She notes: the agent's first number was wrong because it dropped the worst event.

She then reasons about the objective. Customers order mugs on weekends, so she writes an objective of 99.5 percent per 30 days for checkout success within 800 ms. The budget is 0.5 percent of requests, about 3 hours 36 minutes of full outage. She writes the policy:

- More than half the budget left: ship normally.
- Less than a quarter left: no risky releases without Ravi's review, and the next sprint includes the largest cause.
- Budget spent: only reliability and bug fixes until it recovers.

She puts the objective into the catalogue entry file `catalogue/trailmug-app.yaml`, keeps the policy in `docs/slo-policy.md`, and asks an agent to draft burn rate alerts. In review she asks of each alert: which objective, and how long until the budget is gone at this rate? One alert is on a single failed request. She rejects it as noise.

In the following month a bad release spends 60 percent of the budget in one day. The policy fires, and the team pauses risky releases. The budget policy settled in advance meant there was no argument, and the retrospective (lesson 4) found the missing check, which became a gate.

## 5. Working with AI agents on this

**What the PDM decides:** which journeys get objectives, the level, the budget policy, and who holds the line.

**Delegate:** computing indicators from exports, drafting objective options with arithmetic shown, drafting the policy text, drafting alert rules, producing a monthly budget report.

**Verify:** recompute the number from raw data; check what was included and excluded; check the arithmetic; check each alert against an objective.

**Never delegate:** choosing the level, signing a customer-facing agreement, or deciding to ship while the budget is spent.

**Prompt to compute an indicator:**

```text
From this export, compute the success rate of the checkout journey for the last 30
days, counting every valid request. Show the formula, the number of good and total
events, and every exclusion you made and why. Do not exclude any outage. Then
compute what that means in minutes of full outage per 30 days. Mark anything you are
unsure of.
<attach export>
```

**Prompt to draft a policy:**

```text
Draft a one-page error budget policy for objective <X> over 30 days. Include the
budget in requests and in minutes, three states (plenty, low, spent) with the
actions at each, who decides to change the objective, and how often it is reviewed.
Use plain words. Do not invent customer commitments. Mark every number I must
confirm.
```

**Disclose** AI-computed numbers in the review and keep the raw data link.

## 6. Common mistakes and how to avoid them

- **Promising "as high as possible".** Fix: a number, a window and a customer reason.
- **Averages for latency.** Fix: percentage under a threshold.
- **An objective far above reality.** Fix: measure first, then set.
- **Dropping the worst event.** Fix: include every valid request; check exclusions.
- **A budget policy nobody agreed.** Fix: agree and write it before you need it.
- **Alerting on every blip.** Fix: burn rate alerts tied to the objective.
- **An SLA without legal input.** Fix: involve the people who own contracts.
- **Objectives only in slides.** Fix: catalogue entry in git.

## 7. Practice

**Deliverable in git:** `specs/obs-02.md`, `briefs/obs-02.md`, `reviews/obs-02.md`, `docs/slo-policy.md`, and a catalogue entry file.

1. Pick one journey and gather a few weeks of real or invented data.
2. Write a spec for drafting an objective and policy with at least six acceptance criteria, including "every exclusion is listed" and "arithmetic is shown".
3. Brief an agent using the first prompt in section 5.
4. Recompute the number yourself. Record any difference and its cause in `reviews/obs-02.md`.
5. Choose the objective. Compute the budget in minutes and check the table in this lesson.
6. Write `docs/slo-policy.md` and update the service levels in a catalogue entry file.
7. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] I can tell SLI, SLO and SLA apart.
- [ ] The indicator reflects what customers experience.
- [ ] The objective is based on measured data and customer need.
- [ ] I computed the budget in requests and minutes.
- [ ] The budget policy is written, agreed and followed.
- [ ] Alerts are tied to the objective, using burn rate.
- [ ] The objective is in the catalogue entry in git.
- [ ] I recomputed the agent's number from raw data.

## 9. Further learning

Read the SRE book chapter on objectives and the workbook chapter on implementing them, then the chapter on alerting. DORA's metrics give the delivery side of the picture. Lesson 3 takes the alerts and shows what happens when one fires.
