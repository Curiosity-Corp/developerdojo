---
title: "Shiftwren example, week 3: from problems to epics"
description: "Week 3 filled in for a fictional volunteer-shift service: four ordered epics in the epic template, the seven-question check and the plan in git."
section: "Shiftwren example"
order: 3
level: core
duration: "50 min to read, then write your own epics"
outcomes:
  - "See four complete epics, each touching more than one part of the product."
  - "See the order of the epics defended with one sentence each."
  - "See what was parked, and why."
prerequisites:
  - shiftwren-week-2-the-people
  - week-3-problems-to-epics
  - people-write-epics
---

**Fictional example.** Shiftwren, its people, numbers and dates are made up. Numbers marked "example" are invented targets. Do not copy this page.

**Who wrote these epics.** In the story, the fictional learner **Noor** wrote every epic below by hand. This is her work, and a person must write yours: [people write epics](/library/people-write-epics). **Example only.** The page itself was drafted with an AI agent to illustrate the shape. Your epics are different: you write them, and an agent never does.

Compare: [Week 3](/library/week-3-problems-to-epics), the [TrailMug epic template page](/library/template-epic-roadmap) and the real-product [epics and roadmap case study](/library/case-study-danhup-epics-and-roadmap).

## Step 1: Start from the gaps

Noor starts from the [Week 2 gap list](/library/shiftwren-week-2-the-people). Five gaps became epic candidates. One became a Week 5 page fix.

## Step 2: The epics

Template: [Epic roadmap](/library/template-epic-roadmap). The dates are examples.

| Field | Epic 1 | Epic 2 |
|---|---|---|
| Title | Cancelled shifts get filled without chasing | Volunteers' contact details are protected and can be deleted |
| Parent epic | None | None |
| Problem | When someone cancels, Ines chases cover by hand at night | Phone numbers are stored and texted. No deletion route. Privacy notice is a draft |
| Outcome | A cancelled shift is offered to the next person on the back-up list. Ines sees who accepted | A volunteer can ask to be removed and is. The notice is public and linked in messages |
| Measure | Share of cancelled shifts refilled in 24 hours. Target 7 in 10 (example) | Deletion requests done within 7 days. Target: all |
| In scope | Cancel button, back-up list, ask-next by text and email, coordinator view | Privacy notice, deletion route, opt-out reply, retention rule |
| Out of scope | Paid cover, voice calls, swaps between volunteers | Audits and certificates. Legal advice |
| Parts touched | app; svc-cover; flow-messages; int-sms; int-email | app; ops; crm; flow-messages |
| Dependencies | Choose the SMS provider and a price cap per message | A privacy adviser reads the notice. Epic 1 sets what is sent |
| Risks | Texts cost more than planned. People ignore texts | Adviser is slow. Copies survive at providers |
| Labels | epic, cover | epic, privacy |
| Start | 2027-02-01 | 2027-03-15 |
| Due | 2027-04-16 | 2027-05-14 |
| State | Draft | Draft |
| Why this order | Every interview named it, and the others need it | Epic 1 starts texting real numbers, and one leak ends trust |
| GitLab epic URL | Not created: no real project | Not created |
| Written by me, no AI | Y | Y |
| Defended aloud | N, at review | N, at review |

| Field | Epic 3 | Epic 4 |
|---|---|---|
| Title | A new volunteer confirms a first shift in one phone session | The board sees what Shiftwren did, then a price is decided |
| Parent epic | None | None |
| Problem | Sign-in links expire, dates confuse, typing numbers is slow (Ravi, Mei) | The treasurer (G) sees no value. No price. No payment tool |
| Outcome | A new volunteer opens a link, picks a shift and confirms. No password | Each pantry gets a one-page monthly summary. A written price decision exists |
| Measure | Invited volunteers who confirm a shift in 2 days. Target 6 in 10 (example) | Pilot pantries that choose a paid plan. Target 5 of 10 (example) |
| In scope | Link sign-in, plain dates, short messages, importing a list of numbers | Monthly summary, price decision record, choose a payment tool |
| Out of scope | Other languages (open question), calendar sync | Taking payments in the app. Invoices |
| Parts touched | site; app; int-email; flow-messages | app; crm; site; pay (planned) |
| Dependencies | Epic 1 sends the messages. Epic 2 rules cover stored numbers | Usage data from epics 1 and 3. Decision on price first |
| Risks | Link forwarded to the wrong person | Wrong price. Usage too small to show value |
| Labels | epic, onboarding | epic, money |
| Start | 2027-05-17 | 2027-06-14 |
| Due | 2027-07-02 | 2027-07-30 |
| State | Draft | Draft |
| Why this order | Growth comes after the service works and is safe | Last: it needs real use data and starts with a decision |
| GitLab epic URL | Not created | Not created |
| Written by me, no AI | Y | Y |
| Defended aloud | N, at review | N, at review |

**Parked.** A public status page is parked: with ten pilot pantries, a message to coordinators is enough. Noor reviews it after epic 2.

## Step 3: The seven-question check (epic 1)

1. Parts: five, so it is an epic and not a milestone.
2. Persona and step: Ines and Mei, "Hit a problem".
3. One measure: refilled within 24 hours.
4. Out of scope says something real: paid cover.
5. Dependencies written: the SMS decision.
6. Written by Noor. She must still explain it aloud without notes.
7. Order reason: one sentence.

## Step 4: Put the plan in git

On a free plan, make one issue per epic with the label `epic`, link task issues in its description, set dates with milestones and tick a checklist for progress. See [issues, milestones and labels](/library/issues-milestones-labels).

## Fill your own blank from this page

Every column of the epic template is filled for four epics. The quality check is Step 3. Parked ideas show how to say what you chose not to do.

## Working with AI agents

An agent **may** ask you questions about an epic you wrote, and check that every epic names two parts. It **may not** write, improve or reorder epics. Brief: "For each file in epics/, list the parts it names from the repository map. Flag any epic with fewer than two. Do not edit."

## The 2030 Product Development Manager lens

- **You decide:** the epics, their order, the measures and what is parked.
- **You delegate:** only the check above. Never the epics.
- **You verify by:** reading each epic aloud, and opening one flagged epic.
- **Disciplines involved:** product, engineering, privacy, finance, operations and design.
- **On the agent ladder:** epics are **human only**.

Next: [Shiftwren week 4, defend the roadmap](/library/shiftwren-week-4-defend-the-roadmap).
