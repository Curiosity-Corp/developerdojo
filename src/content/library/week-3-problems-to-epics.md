---
title: "Week 3: From problems to epics"
description: "Turn the gaps in your journeys into a roadmap of 4 to 8 epics that you write yourself."
section: "Developer path"
order: 3
level: core
duration: "8 to 10 hours"
outcomes:
  - "List the gaps in your journeys and repository map."
  - "Write four to eight epics yourself in the template."
  - "Order the epics with one sentence of reason each."
  - "Put the plan in git with dates and labels."
resources:
  - gitlab/epics
  - gitlab/manage-epics
  - atlassian/epics-stories-initiatives
  - atlassian/prioritization-frameworks
  - svpg/alternative-to-roadmaps
  - gitlab/university
prerequisites:
  - week-2-know-the-people
  - people-write-epics
---

**Outcome:** you have a first roadmap of 4 to 8 epics, written by you, with dates, in git.

## Step 1: List the gaps

Look at your journeys and your repository map. Every pain point and every missing repo is a gap. Each gap is a candidate for an epic.

TrailMug gaps: "A partner café cannot tell if a returned cup is clean." "A new member gets no welcome message." "Nobody can see if the service is down."

## Step 2: Write each epic in the template

An epic needs: problem, who, outcome, measure, in scope, out of scope, parts of the product touched, dependencies, risks and an owner. Use the [epic standard](/library/epic-standard) and [epic roadmap template](/library/template-epic-roadmap).

Good title: "Visitors can request a welcome cup". Weak title: "Landing pages".

Write in your own words. This is the heart of the rule [people write epics](/library/people-write-epics).

## Step 3: Order the epics

Order by value, risk and dependency. Write one sentence for why each epic comes before the next. Say what you chose **not** to do.

## Step 4: Put the plan in git

Use your git host's issue tools. Read [Issues, milestones and labels](/library/issues-milestones-labels) for the plan that works on free accounts.

## Step 5: Cut the first epic into milestones

A **milestone** is a time-boxed slice with a goal and a date. A good epic has 3 to 5. Once you wrote the milestones, an AI agent may help break them into issues. You approve every acceptance line.

## What about GitLab epics?

GitLab's built-in **epics** feature is on paid tiers (Premium and above) at the time of writing. Check the current GitLab documentation before you rely on it. On a free account you teach yourself the same discipline with **issues, milestones and labels**:

- Make one issue per epic. Give it the label `epic`.
- Link task issues to it in the description.
- Use milestones for the dates.
- Use a checklist in the epic issue to show progress.

The skill is the same: a human-owned, written, dated plan.

## Exercises

1. List ten gaps. Keep four to eight.
2. Write each epic by hand.
3. Order them and write the reason for each position.
4. Add start and due dates.
5. Cut the first epic into 3 to 5 milestones.

## Coach checkpoint

Epic review. Your coach asks hard questions. You answer **without notes**.

## Self-check

- [ ] Every epic names a user and a number.
- [ ] Every epic has an out-of-scope line.
- [ ] Order and reasons are written.
- [ ] Dates are real.
- [ ] I wrote every epic sentence myself.

## How the program supports this week

### How your Sensei works this week

This is the epic review. Your Sensei asks hard questions and you answer without notes: "Why is this an epic and not a milestone?", "What is out of scope?", "Why this order?" If you cannot explain an epic aloud, it is not yet your epic. Read [how your Sensei works with you](/library/program-how-sensei-work) to prepare.

### Show your work in git

`epics/01-...md` to `epics/08-...md`, one file per epic, and `roadmap.md` with a one-sentence reason for each position. Create the epics in your planning space with start and due dates and labels. The history is the proof that you wrote them. See [your files and git](/library/program-your-work-in-git).

### AI use this week

**May:** ask you questions about an epic you wrote, check spelling after you finish. **May not:** write, rewrite, improve or reorder the epics. This is the week where the rule matters most. See [People write epics](/library/people-write-epics).

### Skill tracks that match

[What an epic is](/library/tracks/roadmapping-and-epics/01-what-an-epic-is), [Write an epic yourself](/library/tracks/roadmapping-and-epics/02-write-an-epic-yourself) and [Order the epics](/library/tracks/roadmapping-and-epics/03-order-the-epics). For a worked example see the [epics and roadmap case study](/library/case-study-danhup-epics-and-roadmap).

### The 2030 Product Development Manager lens

You decide the epics, their order and the measures. You delegate nothing about the epics themselves. You may delegate a check that every epic names at least two parts of the product. You verify by reading each epic aloud. On the agent ladder epics are **human only**.

### Reading for this week

Week 3 of Track A in [the learning path week by week](/library/learning-path-week-by-week): 8 items, about 78.5 hours, most of them optional long courses.
