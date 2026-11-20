---
title: "Safety, reports and review"
description: "Shared modules for the robotics and biotechnology tracks. Learn when not to trust a model, write a technical report that states its limits, and run a human review with a sign-off."
group: "frontier"
order: 1
icon: "shield-check"
level: "foundation"
skills: [ai-evaluation, communication-writing, security]
outcomes:
  - "Name the ways a learned robot policy or a biological prediction tool can be wrong while looking sure"
  - "Write a short safety case with a claim, an argument and evidence, and set stop conditions"
  - "Write a technical report that states its method, its failures and how to repeat it"
  - "Run a merge request review in which a named person signs off on anything safety-relevant"
---

## In short

Robots act in the real world. Biology tools guide real experiments. Both can be wrong while sounding sure. This track teaches you to catch that. You will learn when not to trust a model. You will write a safety case, which is a claim, an argument and evidence. You will write a technical report that states its limits. You will run a review where a named person signs off. You need a laptop, git and a text editor. Nothing here needs a real robot or a real lab. AI agents draft code, tables and text. People own the safety claim and the sign-off. The four robotics and biotechnology tracks use these lessons in their capstones.

### Key words

- **Safety case:** A written argument, with evidence, that a system is safe enough to use.
- **Distribution shift:** The real world drifts away from the data a model learned from.
- **Hazard analysis:** A structured search for what could go wrong and who could be hurt.
- **Model card:** A short note on what a model is for and where it fails.
- **Blameless review:** A review after an incident that asks what failed, not who failed.
- **AI disclosure:** A plain line that says where AI helped with a piece of work.

A robot that fetches a cup and a program that predicts a protein shape look very different. They share one risk. A trained model gives an answer with the same calm tone when it is right and when it is far outside what it ever saw. In a robot the cost can be a broken arm or a hurt person. In biology the cost can be months spent on a structure that was never real.

This track is the shared layer under four others: [Robot software](/library/tracks/robot-software), [Robot learning](/library/tracks/robot-learning), [Bioinformatics](/library/tracks/bioinformatics) and [Lab automation in code](/library/tracks/lab-automation-in-code). Each of their capstones asks you to use all three lessons here. It stands on its own as well. If you build or direct work that uses models, you need these habits.

## Who this track is for

This track is for anyone who will direct people and AI agents on work that touches robots, lab equipment or biological data. You may be a junior developer, a career changer, a product manager or an experienced engineer who now directs agents. You do not need a robotics or biology degree. You need to be able to read a short Python function and a Markdown file, and to use git.

## What you will be able to do

By the end of the track you will be able to:

- Explain distribution shift, confidence and calibration in plain words, with one robot example and one biology example.
- Do a small hazard analysis and turn it into stop conditions that a program and a person can both check.
- Write a safety case: a claim, an argument and evidence, with the limits stated.
- Write a technical report with a question, a method, results, limitations and a reproducibility statement.
- Write a model card and a dataset datasheet.
- Run a merge request review with a checklist, a two-person rule and a decision record.
- Say what an AI agent drafted and what a person decided.

## How the three lessons build

1. **[When not to trust a model](/library/tracks/safety-reports-and-review/01-when-not-to-trust-a-model).** You learn how models fail, how to read confidence, and how to write a small safety case with stop conditions. You also name the real standards and frameworks, and say which ones are paid.
2. **[Write a technical report](/library/tracks/safety-reports-and-review/02-write-a-technical-report).** You turn your evidence into a report that a stranger can check. You write a model card, a datasheet and a reproducibility statement.
3. **[Team work with human review](/library/tracks/safety-reports-and-review/03-team-work-with-human-review).** You set up the review process: merge request template, checklist, code owners, the two-person rule, decision records and blameless reviews. You decide where agents fit.

Each lesson has the same shape: why it matters, key ideas, step by step, a worked example, how to work with AI agents, common mistakes, a practice exercise that ends in a file in git, and a checklist. The worked examples use two fictional projects: the TrailMug cup-collection robot from the robotics tracks, and a colour-mixing self-driving lab in simulation from the lab automation track. Both are invented for teaching. Every number in them is an example, not a measurement.

## What you need

- A laptop with a text editor, git and Python 3. Any ordinary laptop works. The code in the lessons uses only the Python standard library.
- A free account on a git host such as GitLab, to keep your files and open merge requests.
- No robot, no lab and no GPU. Simulation and public data only.

Real robot work needs a trained supervisor and a risk assessment for your site. Real lab work needs a trained supervisor and your institution's approval. This track teaches the thinking. It does not replace either of those.

## Time needed

Plan about two to three hours per lesson, so six to nine hours in all. The practice in lesson 1 takes the longest, because a good hazard list needs thought.

## What the 2030 Product Development Manager does here

Four jobs stay with you:

- **Decide what is safe enough.** You set the acceptable risk, the stop conditions and who may override them.
- **Decide what counts as evidence.** You say which tests and records would convince a sceptical reviewer.
- **Verify what comes back.** An agent can draft a hazard list or a report. You check it against the real system.
- **Own the sign-off.** A name is on every safety-relevant change.

Other disciplines are in the room. Safety engineers and lab supervisors set the rules that bind you. Legal and compliance ask which standards apply. Operations asks what happens at 2 in the morning when the robot stops. Design asks how a person is told that the system is unsure.

## How it maps to the Dojo

- **Robot software and Robot learning.** Lesson 1 gives you the failure modes of learned policies. Lesson 3 gives you the review gate before anything moves hardware.
- **Bioinformatics.** Lesson 1 covers low-confidence predictions. Lesson 2 gives you the report format for your capstone.
- **Lab automation in code.** The two-person rule and the decision record in lesson 3 are how you keep a closed loop supervised.
- **[Research and evidence](/library/tracks/research-and-evidence).** Its evidence log is the proof behind a safety case.
- **[Security fundamentals](/library/tracks/security-fundamentals).** Safety and security meet at the same questions: who may change this, and who checked it?
- **[Working with AI agents](/library/tracks/working-with-ai-agents).** The briefs here follow the same rules, with a safety focus.

## Before you begin

Create an empty git repository. Make folders called `safety/`, `reports/` and `reviews/`. Each lesson saves files there. Read [Disclose AI use](/library/disclose-ai-use) first: every file you make with an agent's help carries a short note saying so.
