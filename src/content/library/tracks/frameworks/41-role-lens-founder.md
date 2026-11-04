---
title: "Role lens: the founder"
description: "How a founder uses DREAM, STAR, ORBITAL, ANDROID Ops, Launch Sequence and GROWTH to decide what is worth building, what to hand to agent sessions, and how to verify the work, with a TrailMug example."
section: "Frameworks"
order: 41
track: "frameworks"
level: "core"
duration: "45 min"
outcomes:
  - "Use the frameworks to turn a dream into a testable hypothesis and a first plan"
  - "Decide what a founder keeps and what agent sessions may prepare"
  - "Write a founder decision log in git that others, human and agent, can read"
resources:
  - "y-combinator/library"
  - "mit-ocw/new-enterprises"
  - "sba/plan-your-business"
  - "atlassian/product-launch"
  - "finops/what-is-finops"
  - "dora/dora-research-program"
prerequisites:
  - "tracks/frameworks/40-role-lens-one-shared-language"
updated: 2026-11-03
---

**Dojo programme link:** this lens supports Developer week 1 ([See the whole product](/library/week-1-see-the-whole-product)) and week 4 ([Defend the roadmap](/library/week-4-defend-the-roadmap)).

## 1. Why this matters

The founder's work is to choose. Which problem, for whom, with what money, by when, and what we will not do. Everything else in the company follows from those choices. A founder who cannot state them in plain words cannot brief a team, a funder or an agent session.

The frameworks give the founder a way to make the choices explicit and testable. They do not remove risk. They show where the risk sits, so you can look at it early.

You do not need to be a founder to use this page. Anyone running a product, a programme or a small organisation makes founder-type choices. A Product Development Manager (PDM) in a large company does it for a product line.

## 2. Key ideas, explained

### 2.1 The founder's five questions, mapped

| Question | Framework | Output |
|---|---|---|
| What are we trying to change, and for whom? | DREAM (Discover, Relate) | `docs/dream.md` with the people and the problem, from conversations |
| How will we know it is working? | STAR goals (Space, Track, Assist, Reach, written S.M.A.R.T.) | Two to four measurable goals |
| What do we need to get there? | ORBITAL (Objective, Resources, Budget, Indicators, Transport, Activities, Logistics) | A one to three page plan |
| What do we build first, and how? | ANDROID Ops focus areas | First epics and issues |
| How do we release safely and keep growing? | Launch Sequence, Mission Control, GROWTH | Gates, a board and a monthly review |

### 2.2 From dream to hypothesis

A dream such as "no cup goes to waste" inspires people but cannot be tested. The founder's task is to turn it into a **hypothesis**:

> If we give cafés a simple way to take back cups, then customers will return at least half of them within two weeks. We will know we are wrong if returns stay under a fifth after two months.

Two things stand out. It names a **measure**, so that it can be checked. And it names a **failure condition**, so that you can change course honestly. This is the Event Horizon idea from [lesson 35](/library/tracks/frameworks/35-capstone-growth-and-the-whole-product/) in a founder's hands.

### 2.3 Resources, money and honesty

A founder is often the person who signs off money and makes promises. Rules that protect you and your team:

- **Do not claim what you do not have.** Do not claim approvals, accreditation, customers or results that you cannot show. If an application is pending, say pending.
- **Do not invent numbers.** Mark examples as examples.
- **Keep the budget visible.** ORBITAL's Budget line is where the money lives. Give each epic a cost line, including agent runs.
- **Look for free and open options first** ([open source first](/library/open-source-first)).

For free structured guidance on plans and early companies, see the U.S. Small Business Administration's page on [planning your business](https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan), the [YC Startup Library](https://www.ycombinator.com/library), and the MIT course [New Enterprises](https://ocw.mit.edu/courses/15-390-new-enterprises-spring-2013/). Read them as perspectives, not rules.

### 2.4 Decisions as records

A founder makes many decisions. Write the important ones as short **decision records** in git (see the [decision record template](/library/template-decision-record)): the question, the options, the choice, the reason and the date. This helps in three ways. The team knows why. Agent sessions can read the records and stay consistent. And you can look back and learn how good your judgement was.

### 2.5 What the founder keeps

Some things must not drift to agents or to the team without you:

- The **dream** and the **hypothesis**.
- **Promises** to customers, funders, partners and the public.
- **Spending** above the limit you set.
- **Policy** for agent sessions: what they may and may not do.
- **Risk acceptance** for gate warnings that affect customers or reputation.

## 3. Step by step

1. **Talk to people** (at least five) who have the problem. Write what they say.
2. **Write the dream** in two sentences and the problem in one.
3. **Write the hypothesis** with a measure, a date and a failure condition.
4. **Set two to four STAR goals** from it.
5. **Draft the ORBITAL plan**, including a budget line for agent runs.
6. **Choose the first epics** with the PDM or yourself (the roadmap is a human product, see [People write epics](/library/people-write-epics)).
7. **Set the policy** for agent sessions and the approvals you will keep.
8. **Start the monthly GROWTH review** with a date in the calendar.
9. **Keep a decision log** in `docs/decisions/`.

## 4. Worked example: TrailMug

Maya founded TrailMug after talking to café owners. Her founder files:

- `docs/dream.md`: "A town where reusable cups are the normal choice." Evidence: eleven conversations, three cafés willing to try.
- Hypothesis: "If four cafés can take back cups in under ten seconds, returns will reach 50 percent within two months. We will know we are wrong if returns stay under 20 percent at the end of month two."
- STAR extract: one Reach goal tied to the hypothesis.
- ORBITAL budget: small amounts for a stand per café, a map provider, and agent runs, each with a monthly cap.
- Decision record: "Start with cafés, not offices", with two options considered and the reason (cafés have counters, offices do not).
- Policy: sessions may open merge requests; they may not merge, spend, or contact anyone outside the team.

Her approvals she keeps: spend over a set limit, any message to partners that promises something, and risk acceptance for warning gates.

## 5. Working with AI agents on this

**What the founder decides.** The dream, the hypothesis, the budget, the promises, the policy, and which warnings to accept.

**What is delegated, with the exact brief.**

```text
Read research/interviews/ (anonymised notes from eleven people). For each
person, extract: their role, the problem they described in their own words
(quote), and what they said they would pay or do. Then list the three
problems raised most often with counts. Mark anything you infer as
INFERRED. Do not suggest solutions or write the dream statement.
```

```text
Read docs/orbital.md and the invoices in finance/invoices/. Build a table
of planned versus actual spend by line, with the source file for each
actual. Flag any line over its cap. Do not move money or edit the plan.
```

```text
Read docs/decisions/. Check that each record has the question, options,
choice, reason and date. List any missing field. Do not rewrite records.
```

**How to verify.** Pick three interview quotes and find them in the notes. Recompute one total from the invoices. Open the flagged records.

**Disciplines involved.** Product (turning problems into epics), finance (budget and cost lines), marketing (what you say to the world), operations (what you can actually run), design (how it feels), engineering (what is possible).

**Ladder.** A founder mostly sits at rung one and two (use, delegate), and at rung four for policy: deciding what sessions may do and which gates matter. See [Agent orchestration](/library/tracks/agent-orchestration/) for how larger operations organise this.

## 6. Common mistakes and how to avoid them

- **A dream with no measure.** Add a hypothesis.
- **No failure condition.** If nothing could prove you wrong, you are not learning.
- **Fabricated traction.** Use real numbers or none.
- **Promising what the team has not built.** Check with the PDM first.
- **Letting an agent write the strategy.** Agents can summarise evidence; the choices are yours.
- **Hiding the budget.** Share cost lines with the people who spend.
- **No decision log.** The reason is forgotten in a month.
- **Claiming approvals or accreditation you do not hold.**

## 7. Practice

**Deliverable in git:** a branch `founder-lens` with:

1. `docs/dream.md` with at least five conversations as evidence.
2. `docs/hypothesis.md` with measure, date and failure condition.
3. Two to four STAR goals in `docs/star.md`.
4. A one-page `docs/orbital.md` with a budget that includes agent runs.
5. Three decision records in `docs/decisions/`.
6. `policy/founder-keeps.md`: the list of things you keep and the approval limits.
7. A merge request listing your agent briefs and your checks.

## 8. Review checklist

- [ ] The dream comes from real conversations.
- [ ] The hypothesis has a measure, a date and a failure condition.
- [ ] STAR goals are measurable.
- [ ] The budget has caps, including agent runs.
- [ ] Decisions are recorded with reasons.
- [ ] The list of what the founder keeps is written down.
- [ ] No claim exceeds the evidence.

**Next:** the [product lens](/library/tracks/frameworks/42-role-lens-product/) turns these choices into epics and a roadmap.
