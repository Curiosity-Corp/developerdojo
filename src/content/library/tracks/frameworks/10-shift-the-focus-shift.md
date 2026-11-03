---
title: "SHIFT: the focus shift"
description: "A focus shift is a protected four-hour block used to change a project's course. Learn when to call one, how to plan it with the seven ANDROID activities and how to judge whether the plan is good."
section: "Frameworks"
order: 10
track: "frameworks"
level: "core"
duration: "50 min"
outcomes:
  - "Explain what a focus shift is and the signals that tell you to call one"
  - "Plan a four-hour shift by choosing from the seven ANDROID activities"
  - "Judge a shift plan with four criteria: alignment, clarity, feasibility and impact"
  - "Record a shift and its result in git, including what agents did"
resources:
  - "scrum-org/scrum-guide"
  - "atlassian/agile-retrospectives"
  - "atlassian/definition-of-done"
  - "google/rework-set-goals-with-okrs"
  - "dora/dora-research-program"
prerequisites:
  - "08-star-describe-a-project"
  - "09-star-in-daily-work"
updated: 2026-11-03
---

This is lesson 10, the last of the STAR and SHIFT group. It supports **Developer week 4** (defend the roadmap and use AI agents in practice) and gives a Master Developer a simple tool for course correction.

## 1. Why this matters

Projects drift. A milestone slips twice. Three small requests pile up. The roadmap says one thing and the work says another. The usual reactions are bad ones: a long meeting about nothing, a heroic weekend, or ignoring the problem until it explodes.

A **focus shift** (SHIFT) is a better reaction. It is a *deliberate, short, protected block of time* aimed at one change of direction. The source defines it as a dedicated four-hour block where team members concentrate on specific activities to improve or realign a project's trajectory. The goal is *meaningful progress that keeps the project on track*.

Why four hours? It is long enough to finish something real and short enough to protect on a calendar. It is a time box, an idea you may know from agile working: you fix the time and let the scope adjust, rather than the other way round.

A Product Development Manager (PDM) calls shifts, plans them and judges them. And in 2030 a shift is also a good moment to run several AI agents in parallel on well-defined jobs, while the people use their four hours for the work only people can do.

## 2. Key ideas, explained

### What a shift is

A **focus shift** is:

- **one project** (one droid, in the framework's words),
- **one aim**: a change of direction you can describe in a sentence,
- **four hours**, blocked on the calendar,
- **one to three activities** chosen from the seven ANDROID activities,
- **one result** you can check at the end.

A focus shift is *not* a meeting, a sprint or a general working day. It is a surgical block.

### The seven activities

The source says a shift uses one or more of the ANDROID activities. Here they are in plain words, with an example of each for a software product.

| Activity | Meaning | Example in a shift |
|---|---|---|
| **Advancing** | Innovate and update the roadmap | Re-order the next three milestones after what you learned. (A person writes the roadmap.) |
| **Networking** | Improve collaboration and communication | Agree the interface with a partner; fix how two teams hand work over. |
| **Designing** | Create better working systems | Redesign the sign-up flow; design the data table for returns. |
| **Researching** | Do careful research and analysis | Interview five customers; read three competitor products; compare two tools. |
| **Optimizing** | Refine processes to be more efficient | Cut the release from an hour to ten minutes; remove a manual step. |
| **Implementing** | Execute the improved process | Build the agreed change; deploy it. |
| **Delivering** | Make sure customers receive the value | Fix what blocks a customer today; ship the release; write the release note. |

You can combine them. A common pair is *Researching then Designing*, or *Optimizing then Implementing*. Avoid more than three, or the shift scatters.

### When to call a shift

Look for signals:

- A milestone has slipped **twice**.
- The roadmap and the real work disagree.
- Your project STAR's **Track** and **Reach** no longer match.
- A new super nova (a law, a platform change) changes the plan.
- Too many tasks are "in progress" and none is done.
- A customer problem is urgent and everyone is busy with other things.
- A comet: a project with no owner or objective.

If none of these is true, do not call a shift. Do the normal work.

### How to judge a shift plan

Before a shift, a reviewer reads the plan and asks four questions. The source lists these as the evaluation criteria.

| Criterion | The question | Weak sign | Strong sign |
|---|---|---|---|
| **Alignment** | Does it serve the project's current objective? | "Tidy up the backlog" | "Re-plan milestone 2 after the café feedback" |
| **Clarity** | Are the activities clear and easy to understand? | "Work on stuff" | "Research 5 cafés; write 1 page of findings" |
| **Feasibility** | Is it realistic for four hours? | Rebuilding the product | One change that fits in the time |
| **Impact** | Will it improve or realign the project in a visible way? | Nice but invisible | A measurable change on Track or Reach |

Score each criterion Low, Medium or High. A plan with any Low should be rewritten before the shift. The reviewer's job is to *help refine the plan*, not to approve it for show.

## 3. Step by step: plan, run and close a shift

**Plan (before)**

1. **State the aim** in one sentence: "At the end, X is true."
2. **Choose one to three activities** from the table.
3. **List the tasks** inside each activity. Write them as SMART tasks (lesson 9).
4. **Name the owner** and the people or agents who take part.
5. **Define the result**: a file, a decision, a merged change or a customer reply. Write the "done when".
6. **Ask a reviewer** to score the four criteria. Rewrite until none is Low.
7. **Block four hours** on the calendar. Tell people you will not answer messages.

**Run (during)**

A simple timeline for four hours:

| Time | What happens |
|---|---|
| 0:00 to 0:15 | Set-up. Read the plan aloud. Start any agent jobs. |
| 0:15 to 3:00 | The work. No meetings. Check agent output once per hour. |
| 3:00 to 3:45 | Review: read diffs, test results, notes. Reject or accept. |
| 3:45 to 4:00 | Close: write the record, update the roadmap, tell the people who need to know. |

**Close (after)**

8. **Write the shift record** in `frameworks/shifts/YYYY-MM-DD-title.md`: aim, activities, result, what changed on Track or Reach, what agents did, what you rejected, what you learned.
9. **Update the files** the shift changed: roadmap, STAR, register, indicators.
10. **Decide the next move:** another shift, back to normal work, or stop.

## 4. Worked example: a TrailMug shift

Maya notices that the milestone "Cafés see their returns" has slipped twice. At the same time, two cafés have said that they do not understand how a return is recorded. Her project STAR says Track is "returns page in four weeks", but the Reach she promised depends on cafés recording returns *correctly*.

She calls a shift. Her plan:

> **Aim:** At the end of the shift, I know why cafés mis-record returns and have decided the smallest change to fix it.
> **Activities:** Researching, then Designing.
> **Tasks:** (R) Phone four pilot cafés and watch two of them record a return (90 minutes). (R) Ask an agent to cluster my interview notes into the five biggest confusions, with quotes (agent, 20 minutes, I check it). (D) Sketch the recording flow on paper, with the fewest steps (60 minutes). (D) Write a one-page spec for the change (45 minutes).
> **Result:** `planning/returns-flow-spec.md`, and a decision on whether to delay the returns page.
> **Reviewer:** a designer friend.

The reviewer scores: *Alignment High* (it serves the pilot objective), *Clarity Medium* ("sketch the flow" is vague: Maya adds "three boxes at most, one page"), *Feasibility Medium* (four phone calls plus the watching is tight: she reduces it to three cafés), *Impact High* (it removes the cause of the delay). Maya fixes the two Mediums and runs the shift on Tuesday morning.

Result: the confusion is the *return code*, which is too long to type on a tablet. Maya's decision: shorten the code and add a scanner button; the returns page waits one week. She updates the roadmap herself, writes the shift record, and sends five lines to the cafés. An agent later turns the one-page spec into issues, and she reviews them.

Four hours changed the direction of a six-week plan, and every step is in git.

## 5. Working with AI agents on this

A shift is a great time to use agents because the aim is narrow and the time is fixed.

| | For a shift |
|---|---|
| **What the PDM decides** | The aim, the activities, the result, whether to keep or reject what comes back, the next move. |
| **What agents do** | Cluster research notes, draft the spec from your sketch, scaffold the code for the agreed change, run the tests, draft the shift record from your notes. |
| **How the PDM verifies** | Read every diff in the review hour. Check quotes against the original notes. Run the product. |
| **Who else is involved** | The reviewer of the plan; the people interviewed; the owner of the file the shift changes. |

```text
Shift aim: <sentence>.
Your job in this shift: <one task, SMART>.
Inputs: <files>. Outputs: <files in one folder only>.
Stop after <minutes> minutes and list what is finished and what is not.
Do not edit roadmap files. Do not decide priorities. If you find a
decision that someone must make, write it under DECISIONS NEEDED and stop.
```

The line "do not edit roadmap files" is the Way in practice: **people write epics and roadmaps; AI never does.** In the *Advancing* activity, the human re-orders the roadmap. An agent may *prepare the facts* for that decision. It does not make the decision.

Disclose the AI use in the shift record: which jobs, which tool, what you changed.

## 6. Common mistakes and how to avoid them

- **No aim.** "Focus time" without an aim becomes catch-up time. Write the sentence.
- **Too many activities.** Choose one to three.
- **A plan that is not feasible.** A shift cannot rebuild a product. Shrink the aim.
- **Meetings inside the shift.** A shift is for doing. Do the talking before and after.
- **No record.** Without the shift record, the next person (or agent) cannot learn from it.
- **Shifts as a habit.** If you need one every week, the plan itself is broken. Fix the roadmap.
- **Letting agents run unreviewed.** Keep the review hour. Never skip it.

## 7. Practice

**Goal:** plan, review and run a four-hour shift on your own project.

1. Pick a real signal from the "When to call a shift" list. If you have none, use TrailMug's slipped milestone.
2. Write the plan in `frameworks/shifts/YYYY-MM-DD-title.md`: aim, one to three activities, SMART tasks, owner, result, "done when".
3. Ask a reviewer to score alignment, clarity, feasibility and impact. Fix every Low and Medium you can.
4. Block four hours. Run the shift. Use at least one agent job with the brief above.
5. In the review hour, read every diff and note anything you rejected and why.
6. Complete the record: result, what changed on Track or Reach, AI use, what you learned.
7. Update the files the shift changed. Open a merge request.

**Deliverable:** one shift record in git with the reviewer's scores, the result, the AI use and the updated files.

## 8. Checklist

- [ ] The shift had one aim, written as "At the end, X is true".
- [ ] I used one to three ANDROID activities.
- [ ] A reviewer scored alignment, clarity, feasibility and impact, and I fixed the weak points.
- [ ] The time was blocked and protected.
- [ ] I reviewed every agent output before accepting it.
- [ ] The record, the roadmap and the STAR are updated in git.
- [ ] I decided the next move.
