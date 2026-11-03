---
title: "Case study: DanHup epics, roadmap and milestones"
description: "Template 5 filled in for DanHup: four ordered epics drafted from evidence, the seven-question quality check applied, a roadmap grid and illustrative milestones."
section: "Case study"
order: 4
level: core
duration: "75 min"
outcomes:
  - "Read four complete epics and see why each one crosses parts of the product."
  - "Apply the seven-question quality check to an epic."
  - "See how the order of epics follows value, risk and dependency."
  - "See how the first epic is cut into dated milestones."
resources:
  - gitlab/epics
  - gitlab/roadmap
  - gitlab/milestones
  - atlassian/product-roadmaps
  - atlassian/epics-stories-initiatives
  - svpg/alternative-to-roadmaps
prerequisites:
  - case-study-danhup-people-and-journeys
  - template-epic-roadmap
---

This is page 4 of the DanHup case study. It shows template 5, the [epic roadmap](/library/template-epic-roadmap), filled in. **EXAMPLE ONLY.** These epics illustrate the **shape**. They were drafted from the evidence on the earlier pages to show the format. A learner must write and defend their own, and a real DanHup epic would be written by the DanHup product manager. The milestones on this page are also illustrations. They are clearly marked, and they were not part of the original evidence.

## Why it matters

This page is the answer to a question every learner asks: "What does a finished epic roadmap look like?" It shows four epics with real reasons for their order, and it shows what changes when an epic begins with a **decision** rather than with code.

Remember the rule of the program: the human writes the epics. If you ask an agent to write yours from this page, you break the rule and you lose the learning.

## Key ideas

- **An epic crosses parts.** Each epic below names at least two parts from the repository map.
- **A measure is one number.** If you cannot name one, the epic is not ready.
- **Out of scope is real.** It names something a reasonable person would expect.
- **Order has a reason.** Value, risk and dependency decide it.
- **A decision can be an epic's first step.** Epic 4 begins with a written decision.

## Step 1: The four epics

| Field | Epic 1 | Epic 2 |
|---|---|---|
| Title | Website visitor becomes a registered user | Safe, visible operations |
| Problem | Visitors cannot see what DanHup does for them or how to start. The page still has template text. | Operations knowledge is spread over several places and no repository owns it. |
| Outcome | A hiring manager can read the offer, start, and reach the app sign-up in one session. | One ops home: dashboard, failure modes, cost limits and an owner. |
| Measure | Share of visitors who reach sign-up | Time to find the cause of a failure |
| In scope | Website copy, a clear call to action, the hand-off link to the app | Ops documents and dashboard, runbooks for the workflow fleet |
| Out of scope | Pricing and payment | New features |
| Parts touched | The site, the app, the email-capture service | The app, the workflow infrastructure |
| Dependencies | A decision on who may sign up, because the app is private | An owner named |
| Risks | The message may promise what the app does not do yet | Scope grows |
| Labels | audience::employer | area::ops |
| Start and due | 2026-11-02 to 2026-12-18 | 2026-11-09 to 2027-01-15 |
| State | Draft | Draft |
| Why this order | Everything after it needs people to arrive. | Cheap, and it lowers the risk of every other epic. |

| Field | Epic 3 | Epic 4 |
|---|---|---|
| Title | Sales sees the same cases as the app | Paid customers (decision first) |
| Problem | The CRM mirror is off, so sales cannot see cases and contacts. | No payment gateway and no pricing exist. Nobody has decided if they should. |
| Outcome | The CRM mirror is live, correct and used by sales. | A written decision, then, if yes: customers can pay and the finance team sees it. |
| Measure | Cases visible in the CRM within one hour | Decision date; then first paid account |
| In scope | Secret provisioning, mirror switch-on, the sales view | Pricing, gateway, app sign-up, CRM link |
| Out of scope | Billing | Taxes in new countries |
| Parts touched | The app, the CRM | The site, the app, the CRM |
| Dependencies | The external secret ready; a licence decision | A business decision on pricing |
| Risks | Data privacy review | Rushing before demand is proven |
| Labels | area::sales | area::finance |
| Start and due | 2026-12-01 to 2027-02-12 | 2027-01-04 to 2027-03-31 |
| State | Draft | Draft |
| Why this order | Needs epic 2 so failures are visible. | Comes after the audience and the CRM exist. |

## Step 2: The quality check applied to epic 1

| Question | Answer for epic 1 |
|---|---|
| 1. Does it touch more than one part of the product? | Yes: the site, the app and the email-capture service |
| 2. Does it name the person it helps and the journey step it fixes? | Yes: the hiring manager, at Awareness to Onboarding (T1 to T4) |
| 3. Is there one measure? | Yes: the share of visitors who reach sign-up |
| 4. Does "Out of scope" say something real? | Yes: pricing and payment are what people would expect next |
| 5. Are dependencies written? | Yes: a decision on who may sign up, because the app is private |
| 6. Written by me and defensible aloud? | For a learner, yes only if you wrote it yourself. These epics are illustrations. |
| 7. Does the order have a one-sentence reason? | Yes: "Everything after it needs people to arrive." |

**Commentary.** Question 6 cannot be answered for an example. That is exactly why you cannot hand in someone else's.

## Step 3: The roadmap grid

| Epic | Start | Due | Nov | Dec | Jan | Feb | Mar |
|---|---|---|---|---|---|---|---|
| 1 Website visitor becomes a registered user | 2026-11-02 | 2026-12-18 | ■ | ■ | | | |
| 2 Safe, visible operations | 2026-11-09 | 2027-01-15 | ■ | ■ | ■ | | |
| 3 Sales sees the same cases | 2026-12-01 | 2027-02-12 | | ■ | ■ | ■ | |
| 4 Paid customers (decision first) | 2027-01-04 | 2027-03-31 | | | ■ | ■ | ■ |

**Commentary.** Epics 1 and 2 overlap on purpose: one is about reach and one is about risk, and they use different parts of the product. Epic 4 overlaps epic 3 in January, but its first step is a decision, which costs little. Check that GitLab's Roadmap view shows the same four bars. If it does not, one of the two pictures is wrong.

## Step 4: Milestones for epic 1 (illustration)

A milestone is a slice that ships in one to four weeks. After a milestone is approved by its author, agents may break it into issues.

| Milestone | Dates | What ships | Ready for agents? |
|---|---|---|---|
| E1-M1 Message and offer | 2026-11-02 to 2026-11-13 | New landing copy that says in plain words what DanHup does and for whom; template text removed | Yes |
| E1-M2 The hand-off | 2026-11-16 to 2026-11-27 | The "Create Job Posting" button leads to a working sign-up path, checked by clicking it | No, needs the sign-up decision first |
| E1-M3 Capture and follow up | 2026-11-30 to 2026-12-11 | The notify-me form sends a first reply and records the visitor | Yes |
| E1-M4 Measure | 2026-12-14 to 2026-12-18 | A simple count of visitors who reach sign-up, visible to the planner | Yes |

**Commentary.** Look at E1-M2. "Ready for agents? No." This is an important skill. A milestone with an open decision is not ready, however nicely worded. An agent given it will invent the decision.

## Step 5: How it maps to GitLab

Create each epic in the product group. Paste the title, the description (problem to risks, in that order), the start and due dates and the labels. Use the parent field for hierarchy. Link milestones and issues after the epic exists. Then open the Roadmap view and compare it with the grid above. On GitLab Free, which has no epics feature, keep one file per epic and one roadmap table in the planning repository, as taught in [Deck 8](/library/deck-08-epics-and-roadmap-in-gitlab). Epics are a paid GitLab feature.

## Working with AI agents

- **May:** after you write a milestone, break it into issues and build them. Explain a term. Check spelling.
- **May not:** write, reorder or improve the epics. The order is a human decision.
- **A safe brief for E1-M1:** "Here is my milestone with its done-when line. Break it into issues of at most two days each. List the questions you have. Do not change the scope."

## Common mistakes

1. **Copying these epics.** They are not about your product.
2. **Measures that are feelings.** "Better experience" is not a number.
3. **An epic in one repository.** That is a milestone.
4. **Giving an agent a milestone with an open decision.**
5. **Dates with no reason.**
6. **Letting the roadmap grid and GitLab disagree.**

## Practice

1. Pick epic 2. Write its quality check table without looking at epic 1.
2. Explain why epic 4 comes last in two sentences.
3. Write a milestone for your own first epic and say whether it is ready for agents.
4. Draw your own roadmap grid and compare it to the one in your planning tool.

## Checklist

- [ ] Each of my epics crosses at least two parts.
- [ ] Each has one measure and a real out-of-scope.
- [ ] My order has a one-sentence reason for every epic.
- [ ] My first milestones have dates and "ready for agents" flags.
- [ ] My grid matches my planning tool.

## The 2030 Product Development Manager lens

- **You decide:** the epics, the order, the measure, and when a milestone is ready.
- **You delegate to agents:** issues for approved milestones, the work in those issues, and checks that issues match your done-when lines.
- **A sample brief:** "Compare the issue list for milestone E1-M1 with the milestone text. List any issue that adds scope. Do not delete anything."
- **You verify by:** reading each issue against the milestone and removing out-of-scope ones.
- **Disciplines involved:** strategy, product, marketing, engineering, operations, sales and finance.
- **On the agent ladder:** epics are **human only**. Milestones start the step to **delegate**.

## Further learning

Continue with [the decision record, catalogue entry and change record](/library/case-study-danhup-decision-catalogue-change). Read [Deck 7](/library/deck-07-writing-an-epic) and [Week 3](/library/week-3-problems-to-epics) to write your own.
