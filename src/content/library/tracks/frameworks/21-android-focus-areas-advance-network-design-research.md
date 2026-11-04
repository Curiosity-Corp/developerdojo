---
title: "ANDROID focus areas 1 to 4: Advance, Network, Design, Research"
description: "The first four ANDROID Ops focus areas in depth: what each one is for, the activities inside it, who does what, what the Product Development Manager does, and what agents can take."
section: "Frameworks"
order: 21
track: "frameworks"
level: "core"
duration: "60 min"
outcomes:
  - "Describe the objective, activities and evidence for Advance, Network, Design and Research"
  - "Say which part of each area you decide yourself and which part you can hand to an agent"
  - "Find the skill track that teaches each area in depth"
resources:
  - "atlassian/epics"
  - "gitlab/epics"
  - "gitlab/issue-boards"
  - "atlassian/what-is-agile"
  - "google/sre-book"
prerequisites:
  - "tracks/frameworks/20-why-a-new-operating-model"
updated: 2026-11-03
---

**Dojo programme link:** Research and Design are Developer weeks 1, 2 and 5. Advance is week 3 and week 4 (the roadmap and defending it). Network runs through all six weeks and is the heart of the Master Developer module on stakeholders and integrations.

## 1. Why this matters

In [lesson 20](/library/tracks/frameworks/20-why-a-new-operating-model/) you met the seven ANDROID Ops focus areas. This lesson and the next one take each area apart. For every area you will see the same five things:

1. **The objective**, the reason the area exists.
2. **The activities** inside it, taken from the framework text and written in plain words.
3. **Who does what** across roles.
4. **The PDM's part**, the decisions that stay with the Product Development Manager.
5. **The agent's part**, with a brief you can adapt, and how to check the result.

Each area also lists **evidence in git**: files you can show to a mentor, an auditor or a customer. If the evidence does not exist, the work did not happen.

A reminder about **agents**. In these lessons an "agent" is an AI system that you direct to carry out a task and that returns work for you to check. Agents are fast at drafting. They are not accountable. You are.

## 2. Key ideas, explained

### 2.1 Advance: look ahead and take routine work off people

**Objective.** Act as a futurist. Keep the roadmap current, test new ideas, and watch what is coming. The framework also uses "advancement" for a practical job: find routine tasks that software can do, and automate them so people spend time on creative and strategic work.

**Activities.**

- *Roadmap work.* Keep the list of epics (large pieces of work) current. Remove dead items. Add what the market shows.
- *Idea generation.* Short workshops that produce options, not decisions.
- *Trend watching.* Read what is changing in the industry, in your customers' world, and in AI tools.
- *Strategic planning.* A longer view of where the product should be in a year.
- *Automation of routine tasks.* In four steps from the framework text: identify tasks that are candidates, choose suitable tools, design the automated workflow, and test it until it is reliable.

**Who does what.**

| Role | Part in Advance |
|---|---|
| Founder or sponsor | Sets the direction and the limits (money, time, values) |
| Product | Owns the roadmap and the ranking of epics |
| Design and research | Bring evidence of what customers need next |
| Marketing | Brings what the market is saying |
| Finance | Says what the plan costs and what it must earn |
| Engineering | Says what is possible and what is risky |

**The PDM's part.** You write the epics and the roadmap. [People write epics](/library/people-write-epics). You decide what moves up, what waits and what is dropped. You decide which routine work is worth automating.

**The agent's part.** Agents can collect trends, summarise competitor releases, produce a first list of "tasks we repeat every week", and draft automation scripts. They must not write the epics or choose the order.

```text
Read the issues in this project closed in the last 60 days and the
merge requests behind them. List tasks that humans repeated three or more
times (for example: renaming files, writing release notes, copying data
between systems). For each, give: the task, how often it happened, the
issues that show it, and one risk of automating it. Do not recommend
roadmap items. Output a table.
```

**Check it.** Open two of the cited issues per row. If the repetition is not visible there, discard the row. Then you decide which to automate.

**Evidence in git.** `roadmap/epics.md` with dates (see the [Roadmap standard](/library/roadmap-standard) and the [Epic standard](/library/epic-standard)), a `docs/automation-candidates.md` file, and issues labelled for Advance.

**Skill tracks.** [Roadmapping and epics](/library/tracks/roadmapping-and-epics/) and [Working with AI agents](/library/tracks/working-with-ai-agents/).

### 2.2 Network: connect people, information and systems

**Objective.** Improve collaboration and communication across teams and departments, and make sure the right people can find the right information. In the framework text the word "network" covers both human networks and the technical network that carries data, so the area has a second job: connectivity and secure data exchange.

**Activities.**

- *Collaboration tools.* Choose where conversations, decisions and files live, and keep that list short.
- *Knowledge sharing.* Write down decisions and runbooks so knowledge does not live in one head.
- *Stakeholder engagement.* Talk to the people affected by the product on a schedule, and keep notes.
- *Resource mapping.* Draw maps, blueprints and architectures that show who and what depends on what.
- *Technical networking* (from the framework steps): review the current network, plan the design for secure sharing, put governance on data exchange, and monitor performance. A product team usually does this as part of the architecture and platform work.

**Who does what.**

| Role | Part in Network |
|---|---|
| Operations | Tools, access, runbooks, who is on call |
| Security | Rules for what data may move where |
| Marketing and partnerships | Relationships with customers, cafés, press |
| Product | Stakeholder map, communication plan |
| Engineering | Integrations between systems, architecture maps |
| Finance | Contracts and payment connections |

**The PDM's part.** You own the **stakeholder map** and the **map of systems**. You decide who must be told, when, and in what form. You decide which integrations are worth their risk. The [Repository map standard](/library/repository-map-standard) and the [Integrations register template](/library/template-integrations-register) are the files that show this in git.

**The agent's part.** Agents can keep documents tidy, turn meeting notes into a decision list, draft status updates for review, and draw a first dependency map from the code and the configuration. Never let an agent send a message to a stakeholder without your review. Never give an agent more access than the task needs.

```text
Scan this repository and its CI configuration. Produce a table of every
external system it talks to (APIs, payment, email, analytics). For each:
the file where it appears, what data goes there, and whether a secret is
involved (name only, never print the value). Mark anything you are not
sure about as UNSURE. Do not change any files.
```

**Check it.** Pick one row and find it yourself. Ask an engineer to confirm the UNSURE rows. Confirm that no secret value appears in the output.

**Evidence in git.** `docs/stakeholders.md`, `docs/integrations.md`, `docs/architecture-map.md`, and a `docs/decisions/` folder of short decision records ([template](/library/template-decision-record)).

**Skill tracks.** [Stakeholder communication](/library/tracks/stakeholder-communication/), [Git and GitLab](/library/tracks/git-and-gitlab/), and [Cloud platforms](/library/tracks/cloud-platforms/).

### 2.3 Design: shape the experience, the process and the brand

**Objective.** Create systems, processes and experiences that fit the goals of the organisation, the needs of customers, and sustainability. In the framework text, design includes process design, user experience, branding, and building sustainability into the work.

The training-programme version of the area (used in the DROID loop) gives a clear sequence, and it works for products too: define the goals, identify the audience and their needs, develop the content and structure, create the visual design and interface, then test and refine.

**Activities.**

- *Process design.* Draw how work flows, and remove steps that do not help the customer.
- *User experience.* Screens, words, flows that people can use without help.
- *Brand.* Name, voice, look, and the promises the brand makes.
- *Sustainability.* Consider the environmental and social cost of the thing you design. For a reusable cup service this is the product's point; for others it may be hosting choices or data stored.

**Who does what.**

| Role | Part in Design |
|---|---|
| Designer | Flows, screens, visual system, usability tests |
| Marketing | Brand voice, naming, landing pages |
| Product | Goals, constraints, acceptance of designs |
| Engineering | What the design costs to build and run, accessibility |
| Operations | The real-world process the design must fit |

**The PDM's part.** You set the design goals and judge whether the result meets them. You do not need to draw well. You do need to test a design with real people and to reject a beautiful design that fails the test. You also decide what "accessible enough" means, and you hold the line on it.

**The agent's part.** Agents can generate screen variants, write interface text options, produce a first style guide from existing pages, and build a clickable prototype. They can check contrast and flag missing labels. They cannot tell you whether people like it.

```text
Using the personas and journeys in docs/personas.md and docs/journeys.md,
produce three alternative wireframes (as simple HTML) for the "return a
cup" screen. Each must work one-handed on a 390 px wide phone. Add a
short note on which journey step each design helps. Do not invent user
quotes or statistics.
```

**Check it.** Show the three designs to three people from the audience. Ask them to complete the task. Count the time and the mistakes. Keep notes.

**Evidence in git.** `design/` with wireframes, a style guide, usability test notes, and the accessibility check results. Link to the [brand, website and mock-ups week](/library/week-5-brand-website-mockups).

**Skill tracks.** [Brand, website and mock-ups](/library/tracks/brand-website-and-mockups/) and [Personas and journeys](/library/tracks/personas-and-journeys/).

### 2.4 Research: find out what is true

**Objective.** Do enough research and analysis to know where improvement is possible, what is changing, and what practices work. Research is where claims meet evidence.

**Activities.**

- *Needs analysis.* Find the gap between what people need and what exists.
- *Market research.* Understand customers' preferences and behaviour.
- *Competitive analysis.* Who else solves this, how, and where are they weak.
- *Data analysis.* Use the numbers you have: usage, support requests, sales.
- *Innovation research.* Look at new technology and methods.
- *Objectives and measures.* From the training version of this area: write the learning or success objectives, and the way you will judge them, before you build.
- *Evaluate effectiveness.* Check, after the work, whether it did what you said it would.

**Who does what.**

| Role | Part in Research |
|---|---|
| Researcher or product | Interviews, surveys, observation |
| Data and finance | Numbers, cost and revenue models |
| Marketing | Market and competitor reviews |
| Engineering | Technical feasibility, proofs of concept |
| Security | Threat and risk review |

**The PDM's part.** You decide the question. A research question such as "Will cafés accept a ten-second return scan?" is much better than "Do people like TrailMug?" You decide how much evidence is enough for this decision. You listen to people yourself, because a summary loses tone and surprise.

**The agent's part.** Agents are excellent at desk research: find sources, summarise them, extract claims, and cluster interview notes. They are also good at drafting survey questions. They sometimes invent sources or statistics. Treat every number as unverified until you have opened the source.

```text
Research question: how do independent cafés in a mid-sized city handle
reusable cups today? Find up to eight public sources. For each source,
give the URL, the date, a one-sentence claim you can quote exactly, and
a confidence rating (high, medium, low) with the reason. If you cannot
find a source for a point, say NO SOURCE. Do not write numbers that are
not in a source.
```

**Check it.** Open every URL. Search for the quoted sentence on the page. Delete any claim that fails. Keep a note of what you removed; it teaches you how that agent fails.

**Evidence in git.** `research/` folder with interview notes (with consent, no real names in public repos), source list, a summary with the decision it informs, and a `research/questions.md` file listing open questions.

**Skill tracks.** [Product discovery](/library/tracks/product-discovery/) and [Personas and journeys](/library/tracks/personas-and-journeys/).

## 3. Step by step: using areas 1 to 4 on a new feature

1. **Research first, but small.** Write the question and the decision it supports. Spend a few hours, not weeks.
2. **Network at the same time.** List who is affected and tell two of them what you are exploring.
3. **Design a rough version.** A paper or HTML sketch is enough.
4. **Advance the roadmap.** Create or update the epic, with the evidence linked. A person writes it.
5. **Check the loop.** Does the research support the epic? If not, change the epic.
6. **Record the decision.** A short decision record in git.

## 4. Worked example: the TrailMug cup return scan

| Area | What happened | Evidence file |
|---|---|---|
| Research | Maya observed two café counters on a quiet and a busy day. A return took about the length of a short chat when staff had to find a name. She wrote down the question: "Can a scan cut the return to under ten seconds?" | `research/cup-return-observation.md` |
| Network | She listed Leo (café owner), a barista, the payments contact and the support person. She told Leo and the barista that a prototype would arrive next week. | `docs/stakeholders.md` |
| Design | She asked an agent for three one-handed layouts, picked one, and tested it on paper with the barista. | `design/return-scan/` |
| Advance | She wrote epic 4, "Return a cup in under ten seconds at the counter", with a date, a measure and the three research notes as links. She dropped a "loyalty points" epic because nobody mentioned it. | `roadmap/epics.md` |

All numbers in this example are fictional and stand in for your own.

## 5. Working with AI agents on this

A rule you can keep for all four areas: **agents gather and draft, people decide and sign**. The agent's output is a draft in a branch. The merge request is your review. Use the merge request description to record what you changed and what you rejected. See [Disclose AI use](/library/disclose-ai-use).

Run **two agents in parallel** when the tasks do not depend on each other, for example one for desk research and one for a dependency map. Give each its own branch. You review both before anything merges.

**From delegating to orchestrating.** A hand-off issue is the brief for one session. When several sessions work the same focus area at once, split the issues by file, keep the stop rule in every brief, and let the pipeline gates, not the agents, decide what may merge. See [Agent orchestration](/library/tracks/agent-orchestration/) for the command chain and policy as data.

## 6. Common mistakes and how to avoid them

- **Research without a decision.** Reports nobody reads. Write the decision the research serves first.
- **Network as chat.** Messages are not records. Write decisions in git.
- **Design by taste.** Opinions of the loudest voice. Test with three people from the audience.
- **Advance as wishlist.** A roadmap with twenty epics and no evidence. Keep four to eight and link evidence.
- **Trusting agent sources.** Open the links.
- **Asking an agent to write the roadmap.** It will write a fluent one. It will not own it. You must.

## 7. Practice

**Deliverable in git:** one branch, `focus-areas-1-to-4`, with:

1. `research/question.md` (the question, the decision it serves, three sources you opened yourself).
2. `docs/stakeholders.md` (at least five people or groups, what they need, when you will talk to them).
3. `design/sketch.md` or a small HTML sketch of one screen.
4. A one-epic update in `roadmap/epics.md` that you wrote yourself, linking the three files.
5. A section "Agent use" in the merge request listing each brief you gave, what you checked, and what you removed.

## 8. Checklist

- [ ] Each of the four areas has at least one file in git.
- [ ] Every claim has a source I opened.
- [ ] The epic is written by a person and links evidence.
- [ ] I tested the design with real people, or I recorded that I did not yet.
- [ ] No secret, personal data or internal host name appears in any file.
- [ ] I recorded which parts an agent drafted.

**Next:** [lesson 22](/library/tracks/frameworks/22-android-focus-areas-optimize-implement-deliver/) covers Optimize, Implement and Deliver.
