---
title: "Self-assessment rubric: Track A, whole-product planning"
description: "Six skills, four levels each, with what each level looks like, an example for every level, how to score yourself and the no-AI-epics honesty check."
section: "Assessment"
order: 1
level: core
tool: self-assessment-track-a
duration: "60 min to read, then 20 min every Friday"
outcomes:
  - "Score yourself honestly from 1 to 4 on the six Track A skills."
  - "Write one piece of evidence from your own work for every score."
  - "Compare your score with your coach's score and use the gap to plan what to learn next."
  - "Run the weekly no-AI-epics honesty check."
resources:
  - dora/dora-research-program
  - gov-uk/service-manual-agile-delivery
  - atlassian/what-is-agile
  - nngroup/ux-mapping-cheat-sheet
  - atlassian/product-roadmaps
  - gitlab/university
prerequisites:
  - master-developer-assessment
  - week-1-see-the-whole-product
---

Use this page every Friday. Be honest. Your coach scores the same six skills at the same time. Make your own copy of the score sheet before you start, so you can fill it in each week without changing the original.

Track A is the planning half of the program. On this site it maps to **Developer weeks 1 to 4**. If you have not read the weekly pages yet, start with [Week 1: See the whole product](/library/week-1-see-the-whole-product) and come back.

## Why a rubric

A rubric is a table that says, in plain words, what each level of a skill looks like. It has two jobs. For you, it replaces "am I good enough?" with a concrete question: "which sentence in this row is true about my work?" For your coach, it makes feedback fair, because both of you read the same words.

The rubric does not judge you as a person. It describes **work you can show**.

## How to use it

1. **Score each skill from 1 to 4** using the table below.
2. **Write one example from your own work** as evidence. Link it to a file or a merge request in your git repository. If you cannot point to evidence, score one level lower.
3. **Compare with your coach's score at the checkpoint.** A gap between the two scores is where you learn the most. Do not argue about the number. Ask: "What did you see that I missed, or what did I see that you missed?"
4. **Target: level 3 on all six skills by the end of Week 4. No skill below level 2.**
5. **Below the target is not a failure.** It means a coaching plan: a short list of actions, with dates, that you and your coach agree on.

The four levels have names:

| Level | Name | In one phrase |
|---|---|---|
| 1 | Beginning | I am starting; I need help with the basics |
| 2 | Developing | I can do part of it, with gaps |
| 3 | Competent | I can do it well on my own, with evidence |
| 4 | Strong | I can do it well, predict problems and help others |

## The six skills

For each skill you will find the four level descriptions exactly as the program defines them, followed by a TrailMug example for each level. TrailMug is a made-up product that lends reusable coffee cups. The people in the examples are placeholders.

### Skill A: Whole-product view

What this skill is: knowing every part of the product and how the parts connect. Week 1 trains it with the repository map and the integrations register.

| Level | What it looks like |
|---|---|
| **1 Beginning** | I know my own part only. |
| **2 Developing** | I know most parts but miss links between them. |
| **3 Competent** | My map shows every repo, domain, service and integration and how they connect. |
| **4 Strong** | I can predict how a change in one part hits the others, and show where. |

Examples for TrailMug:

- **Level 1.** The learner can describe the app. When asked what sends the return reminder emails, she says "I think someone else does that."
- **Level 2.** Her map lists the site, the app and the returns service, but not the CRM or the email service. She does not know that the app waits for the payment service.
- **Level 3.** Her map has 12 rows, each with a purpose, owner and "ties into" list. She can show that the returns service calls the email service and the payment service.
- **Level 4.** Asked what happens if the payment provider changes its deposit rules, she opens her map and points to four rows that would change, and names the owner of each.

### Skill B: Customers and personas

What this skill is: knowing who the product is for, with evidence. Week 2 trains it.

| Level | What it looks like |
|---|---|
| **1 Beginning** | I describe users in general words. |
| **2 Developing** | I have personas but they come from guesses. |
| **3 Competent** | Personas use real evidence and separate user from customer. |
| **4 Strong** | Personas change my priorities, and I can show the evidence trail. |

Examples for TrailMug:

- **Level 1.** "Our users are busy people who like coffee."
- **Level 2.** Three named personas with photos and quotes, written from memory, with no interviews behind them.
- **Level 3.** Two personas (Maya the commuter, Leo the café owner) each built from interviews and support messages, with a list of evidence next to each claim. The user and the customer are separated.
- **Level 4.** After three more interviews, the learner moves "deposit clarity" above "more cafés" on the roadmap and shows the interview notes that made her change it.

### Skill C: Journeys and touch points

What this skill is: seeing how people meet and move through the product. Week 2 trains it.

| Level | What it looks like |
|---|---|
| **1 Beginning** | I list screens or pages. |
| **2 Developing** | I map one journey with some touch points. |
| **3 Competent** | I map user and customer journeys, with the pain points and the owner of each touch point. |
| **4 Strong** | I find gaps nobody saw, and each gap links to a candidate epic. |

Examples for TrailMug:

- **Level 1.** A list: "Home page, sign-up page, map page, return page."
- **Level 2.** One journey for Maya, covering only the app, with feelings missing.
- **Level 3.** Maya's user journey and Leo's customer journey, each step with action, feeling, pain point and system, and an owner named for every touch point.
- **Level 4.** She notices that the deposit refund email has no owner and no one measures whether it is sent. She links the gap to the candidate epic "A commuter always knows the status of her deposit".

### Skill D: Writing epics

What this skill is: writing the whole-product outcome by hand. Week 3 trains it.

| Level | What it looks like |
|---|---|
| **1 Beginning** | My epics are big tasks. |
| **2 Developing** | Epics have a goal but no measure or scope limit. |
| **3 Competent** | Each epic has problem, outcome, measure, scope in and out, dependencies and risks, in my own words. |
| **4 Strong** | My epics make other people say "now I understand what we are doing and why". |

Examples for TrailMug:

- **Level 1.** "Build the returns map, add a filter, add pins."
- **Level 2.** "Make returns easier for commuters." No number, no list of what is out.
- **Level 3.** The full epic from the deck lessons: problem, outcome, measure (90 percent of cups returned within 2 days), in scope, out of scope, parts touched, dependencies and risks, all in her own words.
- **Level 4.** A café owner reads the epic and says, "So that is why you want us to scan the cup at the door. I get it now." The finance lead asks no questions about the numbers.

### Skill E: Roadmap and priorities

What this skill is: ordering epics with reasons, and defending the order. Weeks 3 and 4 train it.

| Level | What it looks like |
|---|---|
| **1 Beginning** | A list with no order. |
| **2 Developing** | An order with no reasons. |
| **3 Competent** | Ordered by value, risk and dependency, with a reason for each position. |
| **4 Strong** | I defend the order, say what I chose NOT to do, and adjust when facts change. |

Examples for TrailMug:

- **Level 1.** Four epics in the order they were thought of.
- **Level 2.** Four epics numbered 1 to 4, with no sentence explaining why.
- **Level 3.** Each epic has a sentence: "First, because the payment provider's rule change takes effect in April and returns depend on it. Second, because ..."
- **Level 4.** In the review she says, "I chose not to build the rewards epic this year because only one of the five commuters I interviewed mentioned it." A month later a partner changes terms, and she moves one epic earlier and explains why.

### Skill F: Hand-off to agents and GitLab

What this skill is: turning epics and milestones into something agents can build from, and keeping GitLab (or your git host) correct. Week 4 trains it.

| Level | What it looks like |
|---|---|
| **1 Beginning** | Agents often ask what I mean. |
| **2 Developing** | Milestones are clear but epics in GitLab are incomplete. |
| **3 Competent** | Epics, dates and labels are correct in GitLab. Milestones are clear enough for agents. |
| **4 Strong** | Agents produce the right issues first time, and I review them fast and well. |

Examples for TrailMug:

- **Level 1.** The agent returns to ask "Which café? What is a return?" three times in one session.
- **Level 2.** The milestone text is clear, but two of the three epics exist only in a file.
- **Level 3.** All three epics are in the planning repo or the GitLab group with dates and the right labels. A milestone with a due date and a done-when line produces a sensible issue list.
- **Level 4.** She gives an agent a milestone and gets ten issues. Nine are right. She spots the tenth is out of scope in two minutes, removes it and approves the rest.

## The score sheet

Copy this into your own file in your planning repo, for example `assessment/score-sheet.md`, and fill in one column each Friday.

| Skill | Week 1 | Week 2 | Week 3 | Week 4 | Coach score (Week 4) | Evidence (one example) |
|---|---|---|---|---|---|---|
| A. Whole-product view | | | | | | |
| B. Customers and personas | | | | | | |
| C. Journeys and touch points | | | | | | |
| D. Writing epics | | | | | | |
| E. Roadmap and priorities | | | | | | |
| F. Hand-off to agents and GitLab | | | | | | |

How to fill it in:

1. At the end of the week, read the skill row. Pick the level where **every word is true** for your work.
2. If the row says "I know most parts" and you know seven of twelve, you are level 2.
3. Write the evidence: a link to a file, a merge request or a page.
4. At the checkpoint, put the coach's score next to yours. Write one sentence about the gap.

## The no-AI-epics honesty check (every week)

Answer these three questions every week and write yes or no in your own file.

| Question | Yes / No |
|---|---|
| Did I write every epic and roadmap sentence myself? | |
| Did I use AI only for the allowed list (explain, spell-check, search facts, break **my** milestones into issues)? | |
| Can I explain each epic out loud without notes? | |

If any answer is no, write what happened and what you will do about it. Honesty here is worth more than a perfect record. See the rule in [People write epics](/library/people-write-epics) and the disclosure format in [Disclose AI use](/library/disclose-ai-use).

## Working with AI agents

- **You score yourself.** An agent may not score you. It will flatter you.
- **An agent may collect evidence:** "List the files I changed this week and their commit messages." You still choose which evidence supports which score.
- **An agent may check your score sheet for blanks.** It may not fill them in.
- **If you are below the target,** an agent may turn your coaching plan into dated issues after you and your coach agreed the plan.

## Common mistakes

1. **Scoring from effort.** The rubric scores what you can show.
2. **All 4s.** It hides what you need to learn and surprises you in the final review.
3. **All 2s "to be safe".** It hides what you have learned.
4. **No evidence.** A score with no example is a feeling.
5. **Waiting for the coach to find the gap.** Find it first.
6. **Treating a low score as a verdict.** It is a plan.

## Practice

1. Score yourself on the six skills today. Write one sentence of evidence for each.
2. For the lowest score, write one action you can finish this week.
3. Do the honesty check for this week, and write one honest sentence under each answer.
4. At your next checkpoint, put your coach's score beside yours. Write what the gap taught you.

## Checklist

- [ ] I copied the score sheet before filling it in.
- [ ] Every score has one piece of evidence.
- [ ] I did the honesty check.
- [ ] I know the target: 3 or higher everywhere, none below 2.
- [ ] I know that below the target means a coaching plan.

## Where to go next

Read the [weekly checklist for Track A](/library/weekly-checklist-track-a) for what to finish each week, and the [gates and critical behaviours](/library/rubric-track-b-gates) for the Track B half of the assessment. To see how the six skills line up with the six Dojo Readiness areas, read the [readiness map](/library/rubric-readiness-map).
