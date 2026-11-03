---
title: "The PHANTOMS stack"
description: "A family of agent-ready starting points for building real products. Learn the pattern, choose and swap each piece by the job it does, and direct AI agents to scaffold TrailMug's order tracker, then verify what they built."
group: "frameworks"
order: 20
icon: "layers"
level: "core"
skills: [ai-agents, cloud-platforms, security, ci-cd, data-analytics]
outcomes:
  - "Explain the PHANTOMS pattern and choose each piece by the job it must do, not by fashion"
  - "Tell the required pieces from the optional ones, and say when an optional piece earns its cost"
  - "Compare the PHANTOMS variants (core, web, terminal) and pick one for a product"
  - "Read an API route, a database schema, a task graph and a pipeline well enough to judge an agent's work"
  - "Write a repository instruction file (AGENTS.md) and agent briefs that keep a build inside your rules"
  - "Direct agents to scaffold a small product, then review and verify the result with evidence"
---

PHANTOMS is not one fixed stack. It is a way to make the same decisions once, write them down, and then let AI agents build on top of them. Each letter names a job that almost every software product needs done: store the data, serve an API, call a model, show a web page, run the tasks, run agents, search by meaning, keep files. For each job there is a default tool today. In two years some defaults will be different. The pattern stays. The Dojo teaches the pattern, and uses today's defaults so you can touch real things.

The free public starter at [github.com/Curiosity-Corp/phantoms](https://github.com/Curiosity-Corp/phantoms) is the learning core. It is a small repository you can clone, run and break. It also holds a file called `AGENTS.md` that tells an AI coding agent how to work inside it. That file is the heart of this track.

## Who this track is for

- **Product managers and founders** who will steer agents that write the code and need to choose, direct and judge without typing it themselves.
- **Career changers and juniors** who want one coherent, modern set of tools instead of a hundred tutorials that do not fit together.
- **Developers moving to agent work** who want a repeatable way to brief agents, set limits and verify results.

You do not need to be a strong coder. You need to read code slowly, run commands in a terminal, and ask "why?" until the answer is plain.

## What you will be able to do

When you finish you can take a product idea, choose the pieces it needs and leave out the ones it does not, write the repository rules and the briefs, and let agents scaffold the first version. Then you read what they made. You check the data model against what your customer needs. You check the API against the rules of the product. You check the pipeline for the gates that protect you. You ask the security questions. You write down what you verified and what you did not. That written evidence is the deliverable of the capstone.

You will also be able to explain each choice to people in other roles, because every lesson shows why a piece matters to **product** (what it lets you promise customers), **operations** (what it costs to run and recover), **security** (what it exposes) and **cost** (money, and also attention).

## How the lessons build

| # | Lesson | What you learn |
|---|---|---|
| 1 | The PHANTOMS pattern | The idea: jobs, defaults, required versus optional, how to swap pieces |
| 2 | The variants | Core, web (PHANTOMS+) and terminal (PHANTOMS TUI), and how to pick |
| 3 | Bun | The runtime and package manager under everything |
| 4 | P: PostgreSQL | Durable data, constraints, migrations, backups |
| 5 | H: Hono | The small typed API and its boundary rules |
| 6 | A: AI | Model access behind a replaceable adapter |
| 7 | N: Next.js | The web application and the static-export trade-off |
| 8 | T: Turborepo | The task graph, caching and the CI bill |
| 9 | O: OpenClaw | Optional agent runtime, and why it is deny-by-default |
| 10 | M: Milvus | Optional search by meaning, and when not to add it |
| 11 | S: SeaweedFS | Optional object storage for files |
| 12 | Capstone | Direct agents to scaffold TrailMug's order tracker and verify it |

Lessons 1 to 3 give you the map and the ground. Lessons 4 to 8 cover the **core** pieces that run in the starter today. Lessons 9 to 11 cover the **optional** pieces, where the main skill is knowing when to say no. Lesson 12 pulls everything together.

## How it maps to the Dojo ladder

This track mostly supports the **Master Developer** modules on platform, production launch and AI-agent orchestration. It also helps in Developer weeks 4 and 6: when you defend a roadmap you need to know what a technical choice costs, and when you present a demo you need a working product behind it. It builds on [the Way](/library/the-way-five-rules): people write the epics and the roadmap, git is the source of truth, open source comes first, you fix forward, and you disclose AI use. 

Pair it with the [Working with AI agents](/library/tracks/working-with-ai-agents/) track. That track teaches how to brief and review agents in general. This one gives you a concrete repository to practise on.

## Time needed

Plan about 25 to 30 hours in total: roughly one to two hours of reading per lesson, plus the practice. The capstone takes a full day if you follow the starter's guides step by step and write good review notes.

## The honest limits

PHANTOMS is a learning starter, not a finished product and not proof that one stack fits every product. The public repository says so itself. The sample app has no real user login, no production backup service and no deployed agent. Part of what you learn here is what is missing, and who must supply it before real customers touch the product. Versions in these lessons follow the starter's version policy as reviewed on 2026-10-01. Always check the repository for newer ones.
