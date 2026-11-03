---
title: "Working with AI agents"
description: "The flagship track: direct AI agents as your workforce. Write specs and acceptance criteria, orchestrate several agents, verify their work, measure it with evals and manage the risk, while people own the epics and the roadmap."
group: "ai"
order: 1
icon: "bot"
level: "foundation"
skills: [ai-agents, prompt-engineering, ai-evaluation]
outcomes:
  - "Explain in plain words what a language model and an agent are, and where they fail"
  - "Write a specification with testable acceptance criteria from a decision you made yourself"
  - "Orchestrate several agents on separate issues, in separate branches, with one accountable human"
  - "Verify AI output against the spec: tests, diff, running product and sources"
  - "Build a small evaluation set so you can measure an AI workflow instead of guessing"
  - "Limit agent power, protect secrets, and disclose AI use honestly in every merge request"
---

Developer Dojo trains the **2030 Product Development Manager**: a person who blends strategy, product, design, brand, finance, operations, security and engineering, and who treats AI agents as the workforce for lower-level work. Agents write the code, the tests, the draft documents and the research notes. The human decides what to build and why, writes the specification, owns the epics and the roadmap, directs the agents, verifies what they return, manages the risk and ships to real users.

This track is where that job is taught. It is the flagship of the Library. The demand is high, and the tone is welcoming: every term is explained, and every lesson ends with something you can commit to git.

## Who this track is for

- Developers and product people who want a method for directing agents, not a collection of tricks.
- Career changers who want to start with strong habits.
- Mentors and coaches who need shared words for reviewing AI-assisted work.

You do not need to know machine learning. You need to read a little code, or be willing to learn. The agent builds quickly. You must be able to judge what it built.

## What you will be able to do

Take a problem you chose, write it as a one-page spec with acceptance criteria, brief an agent, or several agents, review the results, prove they meet the criteria, and ship with a record of what each agent did and what you decided. You will also know the limits: which jobs you hand over and which stay with you.

The jobs that stay are named in [People write epics](/library/people-write-epics): who the customer is, what the product is and is not, which problem comes first, and why. People write epics and roadmaps. AI never does.

## The ten lessons

| # | Lesson | What you learn |
|---|---|---|
| 1 | How AI agents work | Models, context, tools, loops, and why agents sound sure when wrong |
| 2 | Prompting that works | Briefing an agent: goal, context, constraints, examples, format |
| 3 | Context and instructions | What agents can see, and a project instruction file in git |
| 4 | Specs and acceptance criteria | Turn a decision into a testable one-page spec |
| 5 | Agentic coding tools in practice | One issue, one branch, plan first, tests as the judge |
| 6 | Orchestrating multiple agents | Split work, assign roles, isolate branches, checkpoints |
| 7 | Reviewing and verifying AI output | A review method, and the signs of plausible nonsense |
| 8 | Evals and testing AI work | Test sets, scoring, baselines, regressions |
| 9 | Safety, security and trust | Least privilege, prompt injection, sandboxes, approval points |
| 10 | Disclosure and ownership | Honest disclosure, licences, and decisions that stay human |

Lessons 1 to 3 give the mental model and the briefing skills. Lessons 4 to 6 teach you to specify, direct and orchestrate. Lessons 7 to 9 teach you to verify, measure and control risk. Lesson 10 closes with accountability.

## How it maps to the program

In the Developer six weeks, agents appear in practice in week 4. Lessons 1 to 5 prepare you for that week and support the evidence in the Product Package. For the Master Developer, lessons 6 to 9 are the AI-agent orchestration module: several agents, separate branches, and reviews through merge requests. Lesson 10 supports the "How I used AI" section of the Product Package.

## The running example

Every lesson uses TrailMug, the fictional reusable-cup product for cafés. Maya, the product owner, writes specs, briefs agents, reviews their work and keeps the decisions. TrailMug and its people are invented.

## Time and effort

Plan about 60 to 90 minutes per lesson, including the exercise. The track takes about 15 to 20 hours, and fits next to the program at one lesson a week or more. Most exercises ask for three files in your git repository: your spec, your agent brief and your review notes. Those files are real evidence of how you work.

Free courses and tools exist, and the lessons point to the best of them. Some tools have paid plans. Nothing here requires payment, and prices change, so check the provider's site first. Work in git from day one. If git is new to you, start the [Git and GitLab](/library/tracks/git-and-gitlab) track alongside this one. The five rules of [The Way](/library/the-way-five-rules) apply in every lesson.
