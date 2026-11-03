---
title: "STAR in daily work"
description: "Use SMART and STAR together for daily stand-ups and task reports, and see how STAR feeds the roadmap, the integrations register, the galaxy page and the ORBITAL indicators."
section: "Frameworks"
order: 9
track: "frameworks"
level: "core"
duration: "55 min"
outcomes:
  - "Write a four-line STAR task report that passes the SMART test"
  - "Put the STAR task block into an issue template so every task carries it"
  - "Trace each STAR part to the file it feeds: galaxy, roadmap, integrations register, ORBITAL"
  - "Turn a week of task reports into one summary that a manager or investor can read in two minutes"
resources:
  - "atlassian/agile-standups"
  - "atlassian/smart-goals"
  - "gitlab/issues"
  - "gitlab/description-templates"
  - "gitlab/milestones"
  - "atlassian/definition-of-done"
prerequisites:
  - "08-star-describe-a-project"
updated: 2026-11-03
---

This is lesson 9. It supports **Developer week 4** (defend the roadmap, stakeholders and AI agents in practice) and the weekly cadence in [Weekly cadence and common mistakes](/library/weekly-cadence-and-common-mistakes).

## 1. Why this matters

In the last lesson you used STAR on a whole project. The source material also uses STAR for something much smaller: **a single task**, and the short report that goes with it. The source calls this the *S.M.A.R.T. S.T.A.R. guide*. It is meant for daily stand-ups, short task summaries and a clean report from every team member to their manager.

Why bother? Because daily work drifts. Without a habit, tasks grow, change shape and lose their link to the goal. A person says "I worked on the API" and nobody, including that person, can say whether it moved the product forward.

A four-line STAR report fixes that. It forces each task to say *where it sits*, *where it is on the path*, *what is being done today* and *what it will achieve*. A Product Development Manager (PDM) who asks for these reports from both people and AI agents can steer many tasks at once without reading every line of code.

## 2. Key ideas, explained

### SMART: is the task well formed?

**SMART** is a test for a good task. It has five letters:

| Letter | Question | Bad example | Good example |
|---|---|---|---|
| **S**pecific | Is it clear and unambiguous? | "Improve returns" | "Reject a return that has no café id" |
| **M**easurable | How will we know it is done? | "Make it faster" | "The returns call answers in under one second for 95 of 100 test calls" |
| **A**chievable | Is it realistic with our time, tools and skills? | "Rebuild the whole app today" | "Add one validation rule and a test" |
| **R**elevant | Does it connect to a goal that matters? | "Redesign the logo" (during a returns sprint) | "Add the check because lost returns hurt the main objective" |
| **T**imed | Does it have a deadline or time box? | "Someday" | "By Thursday noon" |

If a task fails one letter, fix the task before you start.

### STAR: does the task know its place?

The same four STAR parts now apply at *task size*:

| Part | Task-sized question |
|---|---|
| **Space** | Where does this task sit? Which project and epic? Who else is affected, or doing similar work? |
| **Track** | Where is it on the path? What was done before, what is the status, what happens after? |
| **Assist** | What exactly will be done *today*? Which API, tool or system is involved? What help is needed from others? Why this choice? |
| **Reach** | What will be true when it is done? What new ability appears? What number should change? |

Notice that **Assist at task size is the most concrete part**: today's actions. The source describes it as "the specific, tangible changes and actions made immediately": the API endpoint you update, the tests you run, the review you request.

### The task card

Put them together in a short card that can live in an issue:

```markdown
**Task:** <one line, SMART>
**Space:** <project / epic / who is affected>
**Track:** <before / now / next>
**Assist:** <what I do today, with which systems, who I need, why>
**Reach:** <what will be true; what number changes; how I will check>
**Done when:** <testable line(s)>  **Due:** <date>
```

### Where each part flows

The point of STAR is that the answers do not die in a chat window. Each one *feeds* a document that people use.

| STAR part | Feeds | In git |
|---|---|---|
| Space | The galaxy and the project STAR (risks, competitors, rules) | `frameworks/galaxy.md`, `frameworks/star.md` |
| Track | The roadmap and milestones (progress and next steps) | [Epic and roadmap template](/library/template-epic-roadmap), milestones in your tracker |
| Assist | The **Integrations register** and the API contracts | [Integrations register template](/library/template-integrations-register) |
| Reach | The ORBITAL Indicators and the weekly note | `frameworks/orbital.md`, [Weekly note template](/library/template-weekly-note) |

**The loop:** daily task reports reveal facts. Facts update the register, the roadmap and the indicators. These update the project STAR, and the project STAR shapes tomorrow's tasks.

## 3. Step by step: run STAR in a normal week

1. **Add the task card to your issue template.** In GitLab, an *issue description template* is a markdown file in `.gitlab/issue_templates/`. Add `star-task.md` with the card above. Every new issue starts with it.
2. **At planning,** each person (or agent) writes the card for the tasks of the day or week. Apply the SMART test. Rewrite any task that fails it.
3. **At the daily stand-up,** each person reads *only* Track (now and next) and Assist (today). Blocked? Say it. The stand-up should take minutes. (If you want a short guide to good stand-ups, see the Atlassian link below.)
4. **During the work,** update the Assist line if the plan changes.
5. **At the end of the task,** write the actual result under Reach: **Measured**. Compare it with the expectation. If it differs, write one sentence about why.
6. **Weekly,** collect the cards that were done. Update the integrations register for any new or changed interface. Update the roadmap. Update ORBITAL indicators with measured numbers.
7. **Report upward** with a summary of five lines: what moved on Track, what Assist now exists, what Reach we measured, what is blocked, what we need.
8. **Review the pattern monthly.** Which tasks failed SMART? Which Reach claims were wrong? Fix your estimating habits.

## 4. Worked example: TrailMug

Here are two task cards from TrailMug's pilot (fictional).

**Card 1: a task for Maya**

```markdown
**Task:** Reject a return that has no café id, and tell the tablet page why.
**Space:** trailmug-svc-returns, epic "Customers can join, get a cup and
return it at any partner café". Affects the eight pilot cafés' tablet page.
**Track:** Before: the returns call accepts any body. Now: validation is
missing. Next: the café sees a clear message; then returns appear on the
café's page.
**Assist:** Today I add a check in the returns service and four tests
(missing id, wrong id, right id, wrong type). I update docs/api/returns.yaml
so the error is part of the contract. I need nothing from other people.
Why: a bad return today silently loses a cup.
**Reach:** Every bad request gets a clear 4xx reply; no cup is lost without
a record. Measured by the four tests and by the count of rejected calls in
the pilot week.
**Done when:** four tests pass; the API file shows the error; Maya has read
the diff. **Due:** Thursday noon
```

**Card 2: a task for an AI agent**

```markdown
**Task:** (agent) Add the payment provider to the integrations register.
**Space:** trailmug-planning, integrations register. Affects finance.
**Track:** Before: the provider is not listed. Now: we use its test mode.
Next: Maya reviews the register before the pilot opens.
**Assist:** Today the agent adds one row: name, serves (finance), config
location, owner (Maya), data that flows (prices, invoices), data that must
not flow (card numbers), status (planned). The agent must not touch any
secret and must not read any real keys.
**Reach:** The register lists every tool in use. Measured by a diff that
adds one row and no other file.
**Done when:** the merge request changes only the register; Maya has
approved it. **Due:** Friday
```

Maya's weekly summary (five lines) to the finance adviser:

> *Track:* returns validation done; returns page started. *Assist:* one new interface contract (errors in the returns API); payment provider added to the register. *Reach:* pilot week had a small number of rejected calls (counted in the table); no lost cups recorded. *Blocked:* the washing partner has not given a price. *Need:* a decision on the deposit amount from finance.

Look at what happened. Two very different tasks, one done by a person and one by an agent, use the same four lines. Maya can read both in a minute and see that each one links to the larger plan.

## 5. Working with AI agents on this

| | For STAR task cards |
|---|---|
| **What the PDM decides** | Which tasks exist, in what order, and what "done" means. |
| **What agents do** | Draft task cards from your issue list. Run the SMART test on your tasks and suggest rewrites. Write the end-of-task report from the merge request. Write the weekly summary from the done cards. Update the integrations register. |
| **How the PDM verifies** | Compare the report with the actual diff and test results. Check every number against its source. Make sure the "Measured" lines are really measured. |
| **Who else is involved** | The person who benefits from the task (product, finance, operations); the reviewer. |

**An agent's task card is the best protection you have.** The card tells the agent its limits: which files, which systems, what not to touch. It tells the reviewer what to check. And it tells the next agent what happened.

```text
Task: read the merged merge requests of this week (list below) and write
one STAR card per merge request, using .gitlab/issue_templates/star-task.md.
Rules: Reach must say MEASURED only if a test, a count or a log shows it;
otherwise write EXPECTED. Do not round or invent numbers.
Then write the five-line weekly summary for the finance adviser.
List anything you could not fill in as OPEN.
```

An agent may write the *report*. It may not decide the *plan*. *People write epics and roadmaps; AI never does.* The Track part describes where the roadmap stands. It does not change the roadmap.

## 6. Common mistakes and how to avoid them

- **Cards that restate the title.** If Assist says "work on the API", it is empty. Name the endpoint, the test, the system.
- **Invented Reach numbers.** The source's own example mentions a ten-percent gain. In your work, a number must come from a baseline and a reason. Otherwise write "expected, no baseline yet".
- **Mixing expected and measured.** A report that says "increased" with no measurement is a promise.
- **Tasks that fail SMART.** Fix the task first. A vague task produces a vague report.
- **Reports no one reads.** Keep the weekly summary to five lines and send it to a person who will answer.
- **Not updating the register.** An integration that exists but is not listed is a risk waiting.
- **Over-formal stand-ups.** Two minutes per person. The card is for the record, not for reading aloud.

## 7. Practice

**Goal:** run STAR on a week of real tasks, with at least one done by an agent.

1. In your repo create `.gitlab/issue_templates/star-task.md` containing the task card.
2. Create five issues for your product (or TrailMug) with the template. Apply the SMART test; rewrite any that fail.
3. Give one task to an AI agent on a branch, with the card as its brief.
4. Do the work. Update the Assist lines if they change.
5. At the end, fill Reach: **Measured**, and write one sentence on any difference from the expectation.
6. Update the integrations register and the roadmap from what you learned.
7. Write the five-line weekly summary in `reports/week-1.md`. Record any AI use in the header.
8. Open a merge request with the template, the cards, the register change and the summary.

**Deliverable:** the issue template, five completed task cards, the updated register and a five-line weekly summary, merged to git.

## 8. Checklist

- [ ] Every task passes the SMART test before work starts.
- [ ] Every card has Space, Track, Assist and Reach, and a "done when".
- [ ] Assist names the specific action and the system.
- [ ] Reach separates EXPECTED from MEASURED.
- [ ] The integrations register is up to date.
- [ ] The weekly summary is five lines and has a reader.
- [ ] Agent-written reports were checked against the diff and tests.
