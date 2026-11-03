---
title: "Deck 9: Track A assessment and the eight-week map"
description: "How Track A is assessed, and the first view of the Master Developer shape: Track A, Track B, capstone, gates and exams, and the badge."
section: "Teaching deck"
order: 9
level: foundation
duration: "60 min"
outcomes:
  - "Explain how Track A is assessed: weekly checkpoints, six skills scored 1 to 4, and a final roadmap review."
  - "State the goal for the skill scores and what happens when you are below it."
  - "Describe the five stages of the Master Developer path and what comes after."
  - "List the six themes of Track B and the one rule that does not change."
resources:
  - dora/dora
  - gov-uk/service-manual-agile-delivery
  - atlassian/what-is-agile
  - gitlab/university
  - anthropic/building-effective-agents
prerequisites:
  - deck-08-epics-and-roadmap-in-gitlab
  - master-developer-assessment
---

This lesson covers slides 19 and 20. Slide 19 explains how Track A is assessed. Slide 20 gives the shape of the whole Master Developer path and the six themes of Track B. It is the hinge in the deck: everything before it is Track A (planning the whole product), and everything after it is Track B (the ground the product stands on).

## Why it matters

People learn faster when they know how they will be judged and when they know where the path goes. This lesson sets expectations honestly: the checkpoints are coaching, not traps, and a score below the goal means a plan, not a failure.

## Key ideas

### Track A: how you will be assessed

Slide 19 gives five lines:

- A **weekly 30-minute checkpoint** with your coach.
- **Six skills**, scored **1 to 4** by you and by your coach.
- A **final roadmap review in Week 4**: present and defend.
- The goal: **level 3 or higher on all six skills, none below 2**.
- Below the goal means **a coaching plan, not a failure**.

The speaker notes add two points: show the rubric document, and say clearly that **honesty beats perfection**. You score yourself, your coach scores you, and the difference between the two scores is a conversation. A learner who always gives 4 out of 4 is less useful to the coach than a learner who gives an honest 2 and says why.

The six skills and their levels are on the site in the self-assessment rubric pages. Use them every week. The [Master Developer assessment overview](/library/master-developer-assessment) shows how the pieces fit together.

### Track B and the shape of the path

Slide 20 shows five boxes, from left to right:

| Stage | Content | Time |
|---|---|---|
| **Track A** | Plan the whole product. Chapters 1 to 8 | 4 weeks |
| **Track B** | Platform and GitOps. Chapters 9 to 13 | 4 weeks |
| **Capstone** | One product, five skills. Chapter 14 | 5 days |
| **Gates and exams** | 4 gates, exam, oral. Chapters 15 and 16 | per schedule |
| **Master Developer** | The badge, valid 12 months | renewed |

The deck uses the word "Master Developer" for the final badge and for the whole program. On this site the first six weeks are the Developer path, and Track A maps to Developer weeks 1 to 4. See lesson 1 for the mapping.

### The six themes of Track B

Slide 20 lists them. Each is the subject of later lessons:

1. **Platform.** The shared tools every product stands on. Lessons 10 and 11.
2. **OSS-first ladder.** Search, use as is, patch, or build. Licences and the decision record. Lesson 12.
3. **Patch-forks.** Carry a few patches on top of upstream, and let an update bot follow upstream. Lesson 13.
4. **IaC, GitOps and drift.** Git is the only way to change things. Find drift and fix forward. Lesson 14.
5. **ITIL in git.** The merge request is the change record. Lesson 15.
6. **Unchanged: you write the epics by hand.** Agents build after you decide.

The sixth item is the most important one. Track B teaches a lot of technical material. The rule from lesson 4 does not change just because the subject is technical.

The speaker notes add a planning note: plan about **10 to 12 hours a week for Track B**.

## A worked example: TrailMug

Here is how a TrailMug learner might see the path in a calendar.

| Weeks | What the learner does | Evidence in git |
|---|---|---|
| Track A, week 1 | Fills in the repository map and integrations register | `trailmug-planning/map/` |
| Track A, week 2 | Interviews people, writes personas and journeys | `trailmug-planning/people/` |
| Track A, week 3 | Writes three epics by hand | `trailmug-planning/epics/` |
| Track A, week 4 | Presents and defends the roadmap | `ROADMAP.md`, review notes |
| Track B, weeks 1 to 4 | Learns the platform, the OSS ladder, patches, GitOps and ITIL in git | decision records, change records |
| Capstone | Five days of hands-on work on one product | capstone repository |

At the weekly checkpoint in Track A week 3, the coach asks the learner to score each of the six skills. The learner gives herself a 3 for "writes an epic" and a 2 for "defends without notes". The coach agrees on the first and gives a 3 on the second because the learner answered four questions well. They talk about the difference and agree on one thing to practise. No one is surprised on the day of the final review.

## The 2030 Product Development Manager lens

The deck calls the learner a Master Developer. Under the program's current positioning, think of the same person as the **Product Development Manager of 2030**: someone who blends all disciplines and directs agents for lower-level work. Here is the lens for this lesson.

- **You decide:** your honest self-score, which skill to work on first, and how to spend your weekly hours.
- **You delegate to agents:** collecting your evidence, such as listing the files in your repo that show each skill, and drafting your weekly note from your commit history.
- **The brief you would write:** "List every file I changed this week in the planning repo with its commit message. Do not interpret. I will write the weekly note myself."
- **You verify by:** checking the list against your own memory, and writing the self-score before you look at any agent-made summary.
- **Disciplines involved:** coaching and leadership (feedback), product and strategy (the roadmap review), delivery (weekly rhythm).
- **On the agent ladder:** your honest self-score is the evidence for which rung you have reached. Master Developer asks for orchestrate and govern, not only use and delegate.

## Working with AI agents

- **Written tests and the final review:** no AI.
- **Weekly note:** an agent may list your commits. You write the note.
- **Rubric scores:** you score yourself. Do not ask an agent to score you. An agent will give a flattering average.
- **Coaching plan:** if you are below the goal, the plan is written by you and your coach. An agent may help you turn it into dated issues in your planning repo.

## Common mistakes

1. **Scoring yourself all 4s.** It hides what you need to learn.
2. **Scoring yourself all 2s to be safe.** It hides what you have learned.
3. **Skipping the checkpoint because you have nothing new.** The checkpoint is where you find out what is missing.
4. **Reading "coaching plan" as "you failed".** It means you get more help.
5. **Treating Track B as separate from Track A.** The epics you wrote in Track A are the starting point of the capstone.
6. **Underestimating Track B hours.** Ten to twelve hours a week is a real commitment.

## Practice

1. Open the rubric pages and score yourself on the six skills as they stand today. Write one sentence of evidence per score.
2. Write the three things you would show a coach to prove your level 3 on "writes an epic".
3. Draw the five stages of the path on one page. Mark where you are today.
4. Plan your next four weeks of time. Include your checkpoints and a fixed weekly time block.

## Checklist

- [ ] I know the five parts of Track A assessment.
- [ ] I know the goal: 3 or higher on all six skills, none below 2.
- [ ] I know that below the goal means a coaching plan.
- [ ] I can name the five stages of the path and the six themes of Track B.
- [ ] I know the rule that does not change: epics are written by hand.

## For facilitators (speaker notes)

- **Slide 19.** Show the rubric document. Say clearly that honesty beats perfection.
- **Slide 20.** Track A taught the epic manager's job (chapters 1 to 8). Track B (chapters 9 to 13) teaches the ground a whole company stands on. Then the capstone (chapter 14), the gates and exams (chapters 15 and 16), then the badge. Say again: the no-AI-epics rule does not change. Plan about 10 to 12 hours a week for Track B.

## Where to go next

Continue with [Deck 10: The internal developer platform](/library/deck-10-internal-developer-platform). For the full assessment design, read [Master Developer assessment](/library/master-developer-assessment).
