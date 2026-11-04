---
title: "Shiftwren example, week 4: defend the roadmap"
description: "Week 4 filled in for a fictional volunteer-shift service: review changes, a roadmap grid, dated milestones, stakeholders, risks, an agent-ready brief and the decision log."
section: "Shiftwren example"
order: 4
level: core
duration: "50 min to read, then defend your own roadmap"
outcomes:
  - "See what changes after an epic review, each change with a reason."
  - "See a roadmap grid and four dated milestones for the first epic."
  - "See a stakeholder table, top risks and an agent-ready brief."
prerequisites:
  - shiftwren-week-3-problems-to-epics
  - week-4-defend-the-roadmap
  - disclose-ai-use
---

**Fictional example.** Shiftwren, its people, numbers and dates are made up. Do not copy this page.

**Who wrote the roadmap.** In the story, the fictional learner **Noor** wrote the epics, the roadmap and the milestones below. A person writes yours. An agent only broke one approved milestone into issues, and that is disclosed in the last part. **Example only.** The page itself was drafted with an AI agent to illustrate the shape. You write your own roadmap.

Compare: [Week 4](/library/week-4-defend-the-roadmap), the [TrailMug epic template page](/library/template-epic-roadmap) and the real-product [epics, roadmap and milestones case study](/library/case-study-danhup-epics-and-roadmap).

## Step 1: What changed after the review

The coach asked hard questions. Noor changed three things and wrote why in the epic comments. Template: [Epic roadmap](/library/template-epic-roadmap).

| Change | Reason |
|---|---|
| Epic 2 due 2027-05-14 becomes 2027-05-28 | The privacy adviser needs two more weeks |
| Epic 3 starts 2027-05-31 and is due 2027-07-09 | It must wait for epic 2's rules on stored numbers |
| Epic 1 adds "ranking of who is asked first" to out of scope | It was growing. The list order is sign-up order |

"Defended aloud without notes" is now **Y** for all four epics.

## Step 2: Roadmap grid

First month: 2027-02-01. A filled square means the epic is active that month.

| Epic | Start | Due | Feb | Mar | Apr | May | Jun | Jul |
|---|---|---|---|---|---|---|---|---|
| 1 Cover | 2027-02-01 | 2027-04-16 | ■ | ■ | ■ | | | |
| 2 Data | 2027-03-15 | 2027-05-28 | | ■ | ■ | ■ | | |
| 3 First shift | 2027-05-31 | 2027-07-09 | | | | ■ | ■ | ■ |
| 4 Board | 2027-06-14 | 2027-07-30 | | | | | ■ | ■ |

## Step 3: Milestones for epic 1

A milestone is a slice that ships, 1 to 4 weeks long. All dates are examples.

| Milestone | Epic | Start | Due | What ships | Agent-ready? |
|---|---|---|---|---|---|
| 1.1 Post and accept | 1 | 02-01 | 02-12 | A coordinator posts a shift and a volunteer accepts it from a link | Y |
| 1.2 Cancel and back-up list | 1 | 02-15 | 03-05 | A volunteer can cancel. The coordinator keeps a back-up list | Y |
| 1.3 Ask the next person | 1 | 03-08 | 03-26 | A cancelled shift is offered to the next person by text or email | N: waits for the SMS decision |
| 1.4 Coordinator view and pilot | 1 | 03-29 | 04-16 | Ines sees refilled and unfilled shifts. One pantry tries it for two weeks | N |

## Step 4: Stakeholders and risks

| Stakeholder | Wants | Kept informed by | Main worry |
|---|---|---|---|
| Coordinators | Less chasing | Monthly call | Another tool to learn |
| Volunteers | Clear, short messages | The messages themselves | Spam |
| Treasurer (G) | Low, clear cost | Monthly summary | Surprise bills |
| Privacy adviser | Rules followed | Review before launch | Data kept too long |
| Sponsor or mentor | Honest progress | Weekly note | Hidden delays |
| Builders (Priya, agents) | Clear issues | Agent-ready epics | Changing scope |

Top five risks, each with an owner: text costs rise (Noor); volunteers ignore texts (Ines, as pilot coordinator); a data leak (Priya); an agent adds scope (Noor); the adviser is slow (Noor).

## Step 5: One agent-ready milestone

```text
Title: A volunteer accepts a posted shift from a link (milestone 1.1)
Goal: A coordinator posts a shift. A volunteer opens a link and
  accepts it. The coordinator sees the name.
Repos: shiftwren-app (exists), shiftwren-svc-cover (planned)
Interfaces: event "shift.accepted" with fields shiftId, volunteerId,
  acceptedAt. Secret name: shiftwren-email-key. Environments: dev, live.
Acceptance:
  - [ ] A posted shift appears on the coordinator page
  - [ ] The link works on a phone
  - [ ] Accepting twice does not double-book
Order: shift record, then link page, then coordinator page
Out of scope: text messages, back-up list
Owner: Noor (human). Decisions are logged in the epic comments.
```

## Step 6: The agent's part, and the decision log

Noor gave an agent milestone 1.1 with this brief: "Break this milestone into issues of at most two days, each with a done-when line. List your questions. Do not change scope." It returned four issues. Noor removed one, "repeating shift templates", because it added scope. Her disclosure line in the merge request: "Issues drafted by an agent from milestone 1.1. I reviewed each one and removed one."

Decision log entry: "2027-02-03. Question from the agent: what happens when a full shift is accepted? Answer: show 'This shift is full'. The back-up list is milestone 1.2. Noor."

Noor answered in the epic comments, not in a private chat, because the next agent session cannot see a private chat. An agent never edits the goal of an epic. It asks, proposes a change with a reason, or marks the issue blocked.

## The ten-minute talk

Four parts: the picture (grid), the order (one sentence each), the risks, and what Noor chose not to build: paid cover and the status page.

## Fill your own blank from this page

Epic roadmap template: review changes (Step 1), the **Roadmap grid** (Step 2) and **Milestones** (Step 3). Stakeholders, risks and the agent-ready shape are in Steps 4 and 5.

## Working with AI agents

An agent **may** break milestones you wrote into issues and build them. It **may not** change scope, decide dependencies or approve its own issues. Write the disclosure line in every merge request.

## The 2030 Product Development Manager lens

- **You decide:** scope, order, risks, and what you will not build.
- **You delegate:** issues for a milestone you approved, with the brief in Step 6.
- **You verify by:** reading every issue against the milestone.
- **Disciplines involved:** product, engineering, privacy, finance, operations and communication.
- **On the agent ladder:** **delegate**. Several agent sessions at once would be **orchestrate**.

Next: [Shiftwren week 5, brand, website and mockups](/library/shiftwren-week-5-brand-website-and-mockups).
