---
title: "Cost, reliability and choosing a provider"
description: "Read a cloud bill, apply well-architected thinking, weigh lock-in honestly and record a provider decision you can defend."
section: "Cloud platforms"
order: 4
track: "cloud-platforms"
level: "core"
duration: "90 min"
outcomes:
  - "Name what drives a cloud bill and set a budget and alerts before building"
  - "Use the well-architected pillars as a question list for any design"
  - "Weigh lock-in, portability and multi-cloud with reasons rather than slogans"
  - "Write a decision record that compares providers and says what would change your mind"
prerequisites:
  - "the-way-five-rules"
resources:
  - "finops/what-is-finops"
  - "aws/well-architected"
  - "microsoft/well-architected"
  - "google-cloud/well-architected-framework"
  - "aws/managing-your-costs-with-aws-budgets"
  - "google-cloud/create-edit-or-delete-budgets-and-budget-alerts"
  - "aws/free-tier"
  - "google-cloud/free-trial-and-free-tier"
updated: 2026-11-03
---

Lesson 4 of the Cloud platforms track. It supports the Master Developer work on decisions and cost, and the decision record template. Lessons 1 to 3 should come first.

## 1. Why this matters

Two things surprise new cloud users: the bill and the outage. The bill surprises because the cloud charges for use, and an agent can create a lot of use very quickly. The outage surprises because "it is in the cloud" does not mean "it is always on". Both are design choices you can make on purpose.

Choosing a provider is also a product decision, with trade-offs among cost, skills, risk and freedom to move later. You will make this decision with partial information. The skill is to make it clearly, record why, and know what would make you change it.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| The monthly limit, the uptime the product needs, the provider and region, how much lock-in to accept | Estimating cost drivers, listing risks per pillar, comparing providers, drafting the decision record | Checking estimates against the provider's own calculator and bill, testing alerts, reading the failure stories | Finance (budget and forecast), operations (uptime), legal (contracts, data location), engineering (portability), leadership (risk appetite) |

## 2. Key ideas, explained

### What drives a cloud bill

You are charged for a handful of things, however the price list is dressed up.

| Driver | Plain words | Surprise to watch |
|---|---|---|
| **Compute time** | Machines or functions running | A forgotten machine runs all month |
| **Storage** | Gigabytes kept, per month | Backups and old copies pile up |
| **Data transfer out** | Data leaving the provider to the internet or another region | Often the surprise on a busy site |
| **Requests and operations** | Calls to services, queries, messages | A loop or bug can make millions |
| **Managed service premium** | You pay more for a service that someone else runs | Cheaper than your time, usually |
| **Support plans** | Paid help from the provider | Optional for a young product |

Prices differ by region and change over time, so this lesson quotes none. Use each provider's own pricing calculator, and treat any number from an agent as a guess until you check it.

### Free tiers and credits

All three providers offer some free usage or starting credit, often time limited, and the terms change. Read the current pages: [AWS Free Tier](https://aws.amazon.com/free/) and [Google Cloud Free Trial and Free Tier](https://cloud.google.com/free), and see Azure's equivalent on its own site. Treat a free tier as a place to learn, not as a plan: know when it ends, and never put real customer data on a free test account. The most important free tool is a **budget alert**.

### Budgets and alerts: set them first

Before you build anything, set a **budget** and an **alert**. A budget is a limit you decide. An alert is an email or message when spending reaches a share of it, such as half, eighty percent and one hundred percent. See AWS's [Managing your costs with AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) and Google's [budgets and budget alerts](https://docs.cloud.google.com/billing/docs/how-to/budgets). Alerts tell you; they do not always stop spending. For test accounts, decide what happens at the limit, and who acts.

### FinOps in one paragraph

**FinOps** is the practice of making cloud cost visible and shared, so that engineering, finance and the business decide together. The FinOps Foundation's [What is FinOps?](https://www.finops.org/introduction/what-is-finops/) is a short start. Three habits do most of the work: **tag** every resource with what it is for and who owns it; **look** at spending by tag each week; **act** on waste, such as idle machines and forgotten test environments. When you direct agents, add one more: every resource an agent creates carries the issue number in its tag, so you can trace the cost back to the decision.

### Well-architected thinking

All three providers publish a guide to designing well, built on similar pillars. See [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/), the [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/) and the [Google Cloud Well-Architected Framework](https://docs.cloud.google.com/architecture/framework). The common questions, in plain words:

| Pillar | Question |
|---|---|
| **Operational excellence** | Can we run it, change it and learn from failures? |
| **Security** | Who can reach and change it, and is the data protected? |
| **Reliability** | If a part fails, does the product keep working, and how fast do we recover? |
| **Performance** | Is it fast enough, and does it stay fast as use grows? |
| **Cost optimisation** | Are we paying for what we need and nothing more? |
| **Sustainability** | Can we reduce the energy and waste of running it? |

Providers number and name these slightly differently, and the lists change over time, so read the current pages. The use for you is the habit: for any design, ask one question per pillar, and ask for the agent's best and worst answer to each.

### Reliability in plain numbers

Reliability is often stated as a percentage of time the service is up. Do the arithmetic yourself, because the numbers are not intuitive.

| Uptime | Allowed downtime in a 30-day month (about) |
|---|---|
| 99% | 7 hours 12 minutes |
| 99.9% | 43 minutes |
| 99.99% | 4 minutes 19 seconds |

Each extra nine usually costs much more: more copies, more zones, more people on call. A sign-up site that is down for an hour at night may be fine. A payment service may not. State the uptime your product actually needs, in business words ("sign-up may be down for up to an hour per month"), and let that set the design. The observability track covers how to measure it and agree it as a target.

Also decide two recovery numbers: how long you can be down (**recovery time**) and how much recent data you can afford to lose (**recovery point**). Those decide your backup frequency and whether you need a standby copy.

### Lock-in and portability

**Lock-in** means a choice that is costly to reverse. Some is fine: using a managed database saves effort, and the effort of leaving is a price you pay later. Think of it as a trade, not a sin.

Ways to keep the price of leaving low:

- Keep **code and data in standard forms**: containers, SQL, open file formats.
- Write infrastructure **as code**, in git, so a design is a document you can reread and redo (see the Infrastructure as code track).
- Keep a short list of the **provider-specific** parts. Maya's list in Lesson 2 is an example.
- Do not build your own layer to hide all providers. It rarely pays for itself.

**Multi-cloud** (using several providers at once) is often proposed for safety. For a young product it usually adds cost, skill needs and security surface, with little gain. A better protection against an outage is more zones within one provider, and a tested recovery plan. If a customer or law requires more than one provider, record that as the reason.

### Choosing a provider

There is rarely a wrong answer among the three. Compare on the points that matter to you.

| Factor | Question |
|---|---|
| **Fit with what you already use** | Does your company already use one provider's identity system or tools? |
| **Skills** | Whom do you have, or can you hire, who knows which? |
| **Region and data rules** | Does the provider have the regions your law and customers need? |
| **Services you need** | Is a specific managed service, such as a data or AI product, much better on one? |
| **Cost** | What does your actual workload cost, from each provider's calculator? |
| **Support and contracts** | What are the terms, and can you accept them? |
| **Exit** | How would you leave, and what would it cost? |

Choose, record, and set a date to review. An hour of comparison is worth it. A month of comparison is not.

## 3. Step by step: decide and set limits

1. **Write the uptime and recovery needs** in business words.
2. **Write the monthly limit** you are willing to spend, with finance if you have one.
3. **Set budgets and alerts** on the account before building, and test that alerts reach a real person.
4. **List the cost drivers** of your design, and estimate with the provider's calculator, not the agent's memory.
5. **Apply the pillar questions** and write the answers, including the weak ones.
6. **List provider-specific parts** and what leaving would involve.
7. **Compare two providers** on the factor table, with sources.
8. **Write the decision record,** including what would change your mind.
9. **Direct an agent** to tag all resources with the owner and issue number and to write the budget as code if the provider allows.
10. **Verify:** open the bill or cost explorer after a week and compare it with the estimate.
11. **Schedule the review** of the decision.

## 4. Worked example: TrailMug

Maya states the needs in business words: "Sign-up may be down for up to an hour a month before launch. After launch, aim for under an hour a quarter. We can lose at most a day of sign-ups." That is a recovery point of a day, which daily backups cover. A standby database is not needed yet.

She sets a monthly limit of an amount she has agreed with her co-founder, and sets budget alerts at half, eighty and one hundred percent, sent to two people. She tests the alert path by lowering the limit temporarily to see that the email arrives. It does.

She asks an agent to estimate the monthly cost of her design on two providers. The agent produces figures. She does not trust them. She opens each provider's pricing calculator, enters the same components, and finds one estimate off by a large margin because the agent forgot data transfer out for the site's images. She notes the correction and attaches the calculator results to the decision record.

Her comparison, in short: both providers have a suitable UK region; her one developer already knows one of them; the costs for her small workload are close; both support containers and SQL, so the exit cost is low as long as she keeps the code and data in standard forms. She picks the one her developer knows, writes "reason: skills and equal cost", and writes what would change her mind: "a customer requiring a specific region we lack, or a cost difference above a set share after launch". She sets a review for six months out.

The agent tags every resource with `owner=maya` and `issue=41`. A week later she looks at the cost view grouped by tag, and sees one orphaned test database from an experiment. She deletes it, through a merge request that removes it from the code, not by hand.

## 5. Working with AI agents on this

**What the PDM decides:** uptime, recovery needs, monthly limit, provider, accepted lock-in, when to review.

**Delegate:** listing cost drivers, drafting the pillar answers, comparing services, drafting the decision record, writing budget and tag rules as code, a weekly cost summary.

**Verify:** compare any estimate with the provider's calculator. Test that alerts reach a person. Compare the real bill with the estimate. Ask for the **worst-case answer** for each pillar.

**Prompt for a cost estimate you will check:**

```text
List the cost drivers of this design for <provider> and <region>: compute,
storage, data transfer out, requests, managed service charges. For each, give
the unit it is billed in and what in our design makes it grow. Do NOT give
prices; I will use the provider's calculator. Mark what you are unsure about
and what usage numbers I must supply.
<paste design>
```

**Prompt for a pillar review:**

```text
Review this design against the provider's well-architected pillars. For each
pillar give: the strongest point, the weakest point, and one question I should
ask a specialist. Be specific to this design. Do not give generic advice.
Mark anything you cannot judge from the text.
```

**Disclose** AI help on cost estimates and comparisons in the merge request, and say which numbers you checked in the calculator.

## 6. Common mistakes and how to avoid them

- **No budget or alert before building.** Fix: set both first, and test them.
- **Trusting an agent's price numbers.** Fix: use the provider's calculator.
- **Forgetting data transfer out.** Fix: include it in every estimate.
- **Forgotten test resources.** Fix: tags, a weekly look, and removal through code.
- **Chasing extra nines of uptime.** Fix: state the real need in business words.
- **Early multi-cloud.** Fix: one provider and more zones, until there is a real reason.
- **Fearing all lock-in.** Fix: weigh it, keep code and data standard, list the specific parts.
- **A decision with no review date.** Fix: schedule it.

## 7. Practice

**Deliverable in git:** `specs/cloud-04.md`, `briefs/cloud-04.md`, `reviews/cloud-04.md`, and `decisions/D-cloud-provider.md`.

1. Write your uptime and recovery needs in business words, and a monthly limit.
2. Write a spec for a cost-and-risk review with at least six acceptance criteria: cost drivers listed with units, no prices from the agent, one answer per pillar including the weakest, provider-specific parts listed, an exit note, tags defined.
3. Brief an agent to produce it for two providers. Plan first.
4. Verify estimates with each provider's calculator, and record the difference from the agent's figures. Set a real budget alert if you have an account; otherwise write the settings you would use.
5. Record one place the agent was wrong or too confident.
6. Write the decision record: options, choice, reasons, what would change your mind, review date.
7. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] Uptime and recovery needs are written in business words.
- [ ] A budget and alerts exist, and an alert reached a person.
- [ ] I checked estimates in the provider's calculator.
- [ ] I asked one question per pillar and recorded the weakest answers.
- [ ] I listed provider-specific parts and the cost of leaving.
- [ ] Resources carry owner and issue tags.
- [ ] The decision record has reasons, a change-my-mind note and a review date.

## 9. Further learning

Read the well-architected page of the provider you picked in full, and skim the others for their different emphasis. The FinOps introduction is short and worth your time. Use the free tiers to learn, with budgets set first. If you want a ready-made route through each provider's learning, the beginner paths listed in Lessons 1 and 2 are the next step.
