---
title: "ORBITAL: activities and logistics"
description: "The last two letters of ORBITAL. Break the plan into tasks and milestones in time order, then add the glue that keeps it running: coordination, communication, risks and a plan for learning. Decide, delegate and verify with agents."
section: "Frameworks"
order: 14
track: "frameworks"
level: "core"
duration: "70 min"
outcomes:
  - "Break an objective into milestones and tasks that are small enough to finish, with dependencies and owners"
  - "Estimate and order work honestly, and show the path that decides the end date"
  - "Write a logistics section: who talks to whom and when, a risk register and a monitoring, evaluation and learning (MEL) plan"
  - "Brief an agent to draft a task breakdown and risk list, and check it for gaps and invention"
resources:
  - "atlassian/epics"
  - "atlassian/story-points-estimation"
  - "atlassian/project-dependencies"
  - "gitlab/milestones"
  - "gitlab/labels"
  - "atlassian/agile-retrospectives"
prerequisites:
  - "11-orbital-objective-resources-budget"
  - "12-orbital-indicators-kpis-and-sdgs"
  - "13-orbital-transport-for-software"
updated: 2026-11-03
---

This is lesson 14, the fourth of six about ORBITAL. It supports **Developer weeks 3 and 4** (plan, estimate and defend the roadmap) and the Master Developer module on delivery and risk.

## 1. Why this matters

By now you know what you want (Objective), what you need (Resources), what it costs (Budget), how you will know (Indicators) and what moves (Transport). Two letters remain: **Activities** and **Logistics**.

**Activities** are the work, in time order. **Logistics** is the glue: how people coordinate, how they talk, what could go wrong and how the team learns. In the source material, Activities cover tasks, events and actions organised by timelines and deadlines, and Logistics covers coordination, communication, risk management and a plan for monitoring, evaluation and learning.

Many plans fail here, and for ordinary reasons: a task that nobody owns, two tasks that wait for each other, a risk that everybody saw and nobody wrote down, a weekly meeting that has no purpose.

For the 2030 Product Development Manager (PDM) these two letters are where plan becomes work that agents and people can pick up. Written well, the Activities become the milestones and issues that agents implement. Written badly, the agents produce a lot of motion in the wrong direction.

One rule frames the lesson. **People write epics and roadmaps; AI never does.** In ORBITAL, the Activities section is the roadmap, in outline. You write it. An agent may help you *check* it.

## 2. Key ideas, explained

### Activities: the work, in order

The source asks for four things: a task breakdown, a timeline, milestones and coordination. Here they are in plain words.

| Word | Meaning | Example |
|---|---|---|
| **Activity** | A group of work toward one result. | "Café can record a return" |
| **Task** | One piece of work that one person (or agent) can finish. | "Reject a return with no café id" |
| **Milestone** | A point in time that proves something is true. | "Three cafés record real returns" |
| **Dependency** | A task that cannot start until another finishes. | "The page waits for the contract" |
| **Epic** | A big outcome that spans many tasks. | "Customers can join, get a cup and return it at any partner café" |

A **milestone** is a *proof*, not a date. "Week 6" is a date. "Three cafés record real returns" is a milestone. Write the proof, then add the date.

### Break it down until it is finishable

A task is small enough when:

- one owner can finish it,
- it fits in days, not weeks,
- the result can be checked (a "done when" line),
- and the next person knows what to do with the result.

Break down from the top: the objective gives two to four **activities**, each activity gives two to four **milestones**, and each milestone gives a handful of **tasks**. Stop when a task passes the four checks above. This is the same structure that you will use in GitLab (lesson 16).

### Estimates are guesses with a range

An **estimate** is a prediction of effort or time. Treat it as a range, not a point: "three to five days". Teams often use **story points**, a relative size (small, medium, large) so that they compare tasks without arguing about hours. Whichever you choose, record the *actual* effort afterwards so that your estimates improve. Agents can speed up some tasks a great deal, and may not help with others. Do not guess how much; measure it on your own work and record it.

### Dependencies and the critical path

A **dependency** means one task waits for another. Draw them. The longest chain of dependent tasks decides the earliest end date: this is the **critical path**. A delay on the critical path delays the whole plan. A delay elsewhere may not. This is the most useful fact in planning: **know which tasks are on the critical path, and protect them.**

Typical hidden dependencies: a decision that someone must make, a partner's answer, a purchase with a long delivery time, a legal check, an approval. Put them on the list as tasks with an owner and a date.

### Logistics: coordination

**Logistics** has four parts.

**1. Coordination.** Who works with whom, and how do they hand over work? A simple answer is one table of **roles and decisions**: who decides, who does, who must be consulted and who must only be told. (A well-known version is called RACI: responsible, accountable, consulted, informed.) Keep it short. If a decision has no named person, it will not be made.

**2. Communication.** For each audience, say what they get, how often and from whom. Examples: a weekly five-line note to the sponsor, a monthly report with the indicators to the partners, a daily stand-up for the team. Reuse the weekly note and STAR task cards from lesson 9.

**3. Risks.** A **risk** is something that might happen and would hurt the plan. Write a **risk register**, a table with the columns below.

| Column | Meaning |
|---|---|
| **Risk** | What might happen, in one sentence. |
| **Likelihood** | Low, medium or high. |
| **Impact** | Low, medium or high. |
| **Early signal** | What you would see first. |
| **Response** | What you will do (avoid, reduce, accept or hand to someone). |
| **Owner** | One person. |
| **Review date** | When you will look again. |

A risk is different from an **issue**. A risk may happen. An issue has happened and needs action now.

**4. Monitoring, evaluation and learning (MEL).** The source asks for a plan to learn from the work. In plain words:

- **Monitoring**: checking the indicators and the schedule regularly.
- **Evaluation**: stopping at planned points to ask "did it work, and why?"
- **Learning**: writing down what you would do differently and changing the plan.

A simple MEL plan: weekly, read the indicators; at each milestone, hold a short **retrospective** (a meeting to look back at what worked and what did not); at the end, write a one-page learning note and update the plan or the portfolio. The shift record in lesson 10 and the portfolio review in lesson 7 are both MEL tools.

## 3. Step by step: write Activities and Logistics

**Activities**

1. **Start from the objective** and the Transport map. List two to four activities that must be done to reach it.
2. **For each activity write the milestone** as a proof, then the date. Three to six milestones in total for a small plan.
3. **Break each milestone into tasks.** Use the four checks (one owner, days not weeks, a "done when", a next step).
4. **Write the dependencies.** For each task: what must be finished before it starts?
5. **Estimate as ranges.** Mark the confidence: KNOWN (we did it before), BELIEVED, GUESS.
6. **Mark the critical path.** Which chain decides the end date? Put your attention there.
7. **Add the hidden tasks:** decisions, approvals, purchases, legal checks.
8. **Compare with the Budget.** Do the tasks match the money and the hours in Resources? If not, cut scope.
9. **Write it as an epic** with milestones and an outline of tasks, in your own words (see the [epic standard](/library/epic-standard)).

**Logistics**

10. **Write the roles and decisions table.** For each important decision, one decider.
11. **Write the communication plan:** audience, content, rhythm, sender.
12. **Write the risk register** with at least eight risks, drawn from every letter. A good source of risks: every GUESS in your budget and every *to find* in your resources.
13. **Write the MEL plan:** what you check weekly, what you evaluate at each milestone, and what you do with what you learn.
14. **Commit** `frameworks/orbital.md` and open a merge request.

## 4. Worked example: TrailMug

**All numbers and dates are invented.**

Maya's epic is: *"Customers can join, get a cup and return it at any partner café."* The objective (lesson 11) is eight cafés and a seven-day return rate of at least 70% by 31 March. She writes the Activities.

| Activity | Milestone (proof) | Target date | Depends on |
|---|---|---|---|
| A. Sign the cafés | Eight cafés have signed a pilot letter | 14 Feb | A washing quote (for the price) |
| B. Make a cup loop | Washing partner confirmed; 250 cups delivered to cafés | 28 Feb | A (numbers), budget approval |
| C. Record lending and returns | Three cafés record real returns on the page | 14 Mar | Contract for the returns call; designer's page |
| D. Learn from the first weeks | First seven-day return rate reported; Maya decides keep, change or stop | 31 Mar | C and two weeks of data |

**Tasks under milestone C** (excerpt):

| Task | Owner | Estimate | Confidence | Depends on |
|---|---|---|---|---|
| Write returns contract (OpenAPI) | Maya | 1 day | KNOWN | none |
| Reject a return with no café id | Agent, reviewed by Maya | 0.5 day | BELIEVED | contract |
| Café page: list of today's returns | Designer plus agent | 3 to 5 days | GUESS | contract, designer's sketch |
| Train staff at three cafés | Maya | 3 half-days | BELIEVED | page live |
| Test with a real return at each café | Maya | 3 half-days | BELIEVED | training |

**Critical path.** The washing quote, then A, then B, then C, then D. The designer's page is *not* on the critical path unless it slips past 7 March. The washing quote is the most dangerous item, because it is a GUESS and sits at the front. So Maya moves the quote request to day one.

**Logistics: roles and decisions** (excerpt).

| Decision | Decides | Consulted | Told |
|---|---|---|---|
| Choose washing partner | Maya | Finance adviser, the cafés | All cafés |
| Deposit amount | Finance adviser (recommends); Maya decides | Two cafés | Customers |
| Release to the live site | Maya (after the pipeline passes) | The designer | Cafés (note) |

**Communication.** Weekly five-line note (lesson 9) to the finance adviser every Friday. Monthly indicator report to the eight cafés. A text group for urgent café problems.

**Risk register** (excerpt).

| Risk | L | I | Early signal | Response | Owner |
|---|---|---|---|---|---|
| Washing partner's price is much higher than the guess | M | H | No quote by 7 Feb | Ask two other partners; reduce cup count | Maya |
| Cafés do not record returns correctly | H | H | Under 90% recorded correctly in week 1 | Call a focus shift on the flow (lesson 10) | Maya |
| The payment provider changes fees | L | M | Notice from the provider | Adapter lets us replace it | Maya |
| The city announces a ban on single-use cups | L | H | Draft notice on the city website | Open the waiting list; email the cafés (portfolio line, lesson 7) | Maya |
| Designer is unavailable | M | M | Missed sketch deadline | Use a simple template page | Maya |
| An agent changes a file it should not | M | M | A diff outside its folder | The pipeline gate rejects it; Maya reviews every diff | Maya |

**MEL plan.** Weekly: read the five indicators and the five-line note. At each milestone: a 30-minute retrospective with the notes in `retros/`. At 31 March: a one-page learning note and an updated portfolio decision (grow, watch or stop).

Notice that the register contains risks from each ORBITAL letter: Budget (price), Indicators (recording quality), Transport (provider), Objective (the city rule), Resources (designer) and the agents themselves.

## 5. Working with AI agents on this

| | For Activities and Logistics |
|---|---|
| **What the PDM decides** | The activities and milestones, the order, the scope cuts, who owns what, which risks matter and the responses. The epic and the roadmap. |
| **What agents do** | Suggest a first task breakdown from your milestones. Find missing dependencies. Look for tasks that are too big. Draft the risk register from the other sections. Turn finished milestones into issue drafts for you to review (lesson 16). Draft the weekly note. Play "pre-mortem": imagine the plan failed and list reasons. |
| **How the PDM verifies** | Walk through the critical path by hand. Check that every task has an owner, a "done when" and a dependency. Check that each risk has an early signal that someone can actually see. Remove any task that does not trace to a milestone. |
| **Who else is involved** | Everyone named as an owner. Operations (logistics), finance (budget limits), legal (contracts and risks) and the sponsor. |

A brief you can adapt:

```text
Context: frameworks/orbital.md (read only): Objective, Resources,
Budget, Indicators, Transport and my Activities outline.
Task: act as a sceptical planner.
1. List tasks that are missing: decisions, approvals, purchases,
   legal checks, partner answers. Say which milestone each belongs to.
2. List tasks that are too big (longer than one week or with no
   "done when").
3. List dependencies that I did not write.
4. Write a pre-mortem: ten reasons the plan could fail by 31 March,
   each with an early signal that a person could see.
Rules: do not rewrite my milestones or change dates. Do not create
or re-order epics. Mark everything you inferred as INFERRED. Return
markdown with the four lists. Questions go under OPEN QUESTIONS.
```

The agent lists, you decide. Notice that the brief forbids re-writing milestones and changing epics. That is the rule at work.

When you run several agents on this (one reading budget, one reading transport, one writing the pre-mortem), you are **orchestrating**. Give each session only the files it needs, collect the results in one file and review them yourself. A written **policy** (for instance, "agents may propose changes to Activities in a branch but only the PDM merges them") is what keeps a larger set of sessions safe. See the agent orchestration track.

## 6. Common mistakes and how to avoid them

- **Tasks with no owner.** Everyone's task is nobody's task.
- **Milestones as dates only.** Write the proof first.
- **Ignoring the critical path.** Know which chain decides the end date.
- **Hidden dependencies.** Decisions, approvals and partner answers are tasks too.
- **Point estimates.** Use ranges, and record the actuals.
- **A risk list copied from the internet.** Draw risks from your own plan, starting with every GUESS and every *to find*.
- **Risks with no early signal.** If nobody can see it coming, the register will not help.
- **Meetings with no purpose.** Each communication line needs an audience, a content and a rhythm.
- **No learning step.** Without MEL, you repeat the same mistake.
- **Letting an agent write the roadmap.** An agent can check the plan. You write it.

## 7. Practice

**Goal:** write the Activities and Logistics sections for your product, or for TrailMug.

1. In `frameworks/orbital.md` add **Activities** and **Logistics** sections.
2. Write two to four activities, each with a milestone written as a proof and a date.
3. Break at least two milestones into tasks with owner, estimate range, confidence mark, "done when" and dependencies.
4. Mark the critical path and name the riskiest task on it.
5. Write the roles and decisions table (at least three decisions), a communication plan and a risk register with at least eight risks that cover every ORBITAL letter.
6. Write the MEL plan: weekly, at each milestone and at the end.
7. Run the sceptical-planner brief with an agent. List what you accepted and what you rejected, with reasons, in an `AI use:` note.
8. Ask a person from operations or project management to find the task you missed. Record it.
9. Open a merge request.

**Deliverable:** Activities and Logistics sections in git, with a critical path, a risk register, a MEL plan, an `AI use:` note and one human review comment.

## 8. Checklist

- [ ] Every milestone is a proof, with a date.
- [ ] Every task has one owner, a range estimate, a "done when" and listed dependencies.
- [ ] I marked the critical path.
- [ ] I included the hidden tasks: decisions, approvals, purchases and checks.
- [ ] The risk register has early signals, responses and owners, and covers all seven letters.
- [ ] Roles and decisions are written down.
- [ ] The MEL plan says what I check weekly, at milestones and at the end.
- [ ] I wrote the epic and the milestones myself, and I used an agent only to check them.
