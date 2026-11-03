---
title: "Deck 1: The human's job"
description: "Opening lesson of the teaching deck From Milestones to Epics: what a Master Developer is, and why the human owns the picture while agents build."
section: "Teaching deck"
order: 1
level: foundation
duration: "60 min"
outcomes:
  - "Explain in two sentences what a Master Developer does and what AI agents do."
  - "Say why the whole-product roadmap is a human job and agents are used for milestones and issues."
  - "Describe how this deck fits between Curiosity PILOT and the Track A and Track B weeks."
resources:
  - atlassian/epics
  - anthropic/building-effective-agents
  - gitlab/handbook-product-principles
  - atlassian/product-roadmaps
  - svpg/alternative-to-roadmaps
prerequisites:
  - developer-path-overview
  - the-way-five-rules
---

This is the first lesson in the teaching deck **From Milestones to Epics**. The deck is a 35-slide talk. On this site it is split into 16 lessons so you can read it at your own pace, and every slide and every speaker note is included. The deck has one idea, and every lesson comes back to it:

> The human owns the idea and the big picture. AI agents build.

This lesson covers slides 1, 2, 3 and 35 of the deck: the welcome, the definition of a Master Developer, the thesis, and the closing message. Read it first, because the other 15 lessons are the proof of this one.

## Why it matters

Many strong builders can already make AI agents write code. The gap is not intelligence. The gap is the big picture. Someone has to know what the customer said last week, what the company promised, which team owns which system, and what the product should **not** do. An agent that works in one repository at a time cannot hold all of that.

If nobody owns the picture, the agents will still produce work. It will look tidy. It will pass its tests. It may also be the wrong work. This program trains the person who stops that from happening.

## Key ideas

### What a Master Developer is

A **Master Developer** orchestrates across many repositories. A repository (repo) is a folder of files with a full change history. A product is never one repo. It is a website, an app, small services, a customer database, email, payments and an operations repo, all working together.

A Master Developer does four things:

1. Steers AI agents to build interdisciplinary products that make customers happy.
2. Owns the idea and the **epic roadmap**. The agents build the repos.
3. Knows the ground the repos stand on: the company platform, open source first, everything as code in git, and IT service management done in git.
4. Can defend each decision out loud, with no notes.

### The thesis in five lines

The deck puts the thesis on one slide. It is short on purpose:

- The human owns the idea and the big picture.
- AI agents build.
- Agents are excellent at milestones and issues.
- Agents fail at the whole-product epic roadmap.
- So the roadmap is a human job. It is **your** job.

The thesis comes from the program owner. Facilitators are told to say it plainly at the start and repeat it at the end. You will see it again in the closing section of this lesson.

### How this fits with what you already learned

The Master Developer program is the next tier after **Curiosity PILOT**. PILOT is a program of 10 courses in five pillars, about 200 hours. PILOT teaches the tools. The Master Developer program uses those tools on a whole product. PILOT is the older program; its details are not repeated on this site, and pages here never promise a result from taking it.

On this site the path is shown as Developer weeks 1 to 6, then the Master Developer program. In the source material the work is shown as Track A (4 weeks), Track B (4 weeks) and a 5-day capstone. The mapping is simple:

| Source name | What you learn | Where on this site |
|---|---|---|
| Track A, chapters 1 to 8 | See the whole product, know the people, write epics, defend the roadmap | Developer weeks 1 to 4 |
| Track B, chapters 9 to 13 | Platform, open source first, patch-forks, GitOps, ITIL in git | Master Developer program |
| Capstone, chapter 14 | One product, five skills, five days | Master Developer program |
| Gates and exams, chapters 15 and 16 | Four gates, an exam, an oral review | Master Developer program |

Lessons 2 to 9 of this deck cover the Track A ideas. Lessons 10 to 16 cover Track B, the capstone and the gates.

## A worked example: TrailMug

Throughout these lessons we use **TrailMug**, a made-up product. TrailMug lends reusable coffee cups to commuters. A commuter pays a small deposit, picks up a cup, and returns it to any partner café. The people in the story are placeholders, not real: Maya is a commuter, and Leo owns a café that accepts returned cups.

Imagine the TrailMug owner asks three people for help.

- A **developer** says: "Tell me the task and I will build it."
- An **AI agent** says: "Give me an issue and I will open a merge request."
- A **Master Developer** says: "Before we build, I need to know which customer problem we are solving, which parts of TrailMug it touches, what we will not do, and who decides."

The first two are very useful once the work is clear. Only the third can tell you whether the work is clear. That is the job this program trains.

## Working with AI agents

Agents are a large part of this program, and the rule is not "avoid AI". The rule is to use AI for the right level of work.

- **Milestones and issues**: agents are very good. A clear milestone becomes issues. A clear issue becomes a change.
- **The whole-product epic roadmap**: agents are weak. They do not know last week's customer call, and they agree too easily with a weak idea.

A useful test: give an agent a roadmap request for TrailMug with only the repo contents. It will write a smooth roadmap. Read it and ask what is missing. It will have no mention of the deposit payment provider's rules, no mention of what Leo was promised about the monthly fee, and no mention of whether a café can say no. The roadmap looks complete because the agent filled every gap with confident, generic text.

You will practise this contrast in lesson 2.

## The 2030 Product Development Manager lens

This program trains the **Product Development Manager of 2030**: a person who blends strategy, product, design, brand and marketing, finance, operations, security and engineering, and who treats AI agents as the workforce for lower-level work. The bar is high, and the method is plain. In this lesson:

- **You decide:** what the product is for, which customer problem comes first, and what you will not build.
- **You delegate to agents:** drafting issues from a milestone you wrote, writing and testing code, searching repositories for facts, and routine documentation.
- **The brief you would write:** "Here is my milestone and its date. Propose the issues needed. For each, give a title, one sentence and a done-when line. Add nothing outside the milestone."
- **You verify by:** reading the proposed issues against your own epic and asking one question of every item: does this belong to the outcome I chose?
- **Disciplines involved:** strategy and product (owns the idea), engineering (agents build), operations and finance (the facts agents cannot see).

## Common mistakes

1. **Thinking the program is anti-AI.** It is not. It tells you where AI helps and where it harms.
2. **Treating the gap as intelligence.** The gap is the picture, not skill. Strong builders often skip the planning step because building feels productive.
3. **Starting at the issue level.** If you begin with tasks, you inherit someone else's unwritten epic.
4. **Treating the deck as the final word.** The source of truth is git. This deck and its slides are a generated copy. If a slide is out of date, the right action is to fix the text through a merge request, not to argue with the slide.
5. **Copying the example product.** The examples show the shape of a good answer. Your own product needs your own thinking.

## Practice

1. Write two sentences about what a Master Developer does, in your own words, without looking back.
2. Write two sentences about what an AI agent does in the same team.
3. Pick a product you know (yours, a friend's, or TrailMug). Write down three facts about it that are not in any of its repositories.
4. Say the thesis out loud. Then say it again without notes.

## Checklist

- [ ] I can say what a Master Developer does in one breath.
- [ ] I can say why the roadmap is a human job.
- [ ] I know the difference between a milestone, an issue and an epic (lesson 3 teaches this in full).
- [ ] I know that the source of truth is git, and that this site and the slides are copies.
- [ ] I know the eight-week structure and where the capstone and gates come in.

## The closing message (slide 35)

The deck ends with a short summary that is worth reading now, so you know where you are going:

- **Track A, weeks 1 to 4**: see the whole product, know the people, write epics, defend the roadmap.
- **Track B, weeks 1 to 4**: platform, the open-source-first ladder, patch-forks and GitOps, ITIL in git.
- Then the **capstone** (5 days), the **four gates**, the **exam** and the **oral review**.
- After Master Developer, the next roles in the program are Product Manager, then Product Lead. These are stages in the learning path, not job guarantees.
- Remember: the human owns the idea and the big picture. Agents build.

## For facilitators (speaker notes)

- **Slide 1, welcome.** Explain what an epic is, why people (not AI agents) must write epics, and what the group will do in four weeks.
- **Slide 2, what a Master Developer is.** Open warmly. Builders are strong. The gap is the big picture, not intelligence. Explain how PILOT leads here. The Track B slides from slide 20 on are the Master Developer extension.
- **Slide 3, our idea.** This is the owner's thesis. Say it plainly and repeat it at the end.
- **Slide 35, the closing.** Close with the thesis. Invite questions. Point to the help channel. Say clearly that the files in git win over the deck: if a slide is out of date, open a merge request.

## Where to go next

Continue with [Deck 2: Where agents are strong and weak](/library/deck-02-agents-strong-and-weak). For the program as a whole, see the [Master Developer overview](/library/master-developer-overview) and the [learning path](/library/learning-path-how-to-use).
