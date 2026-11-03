---
title: "Agent orchestration and policy administration"
description: "Advanced track: run many AI agent sessions as a command chain, bound them with written policy, hooks and gates, and keep the decisions only a person should make."
group: "ai"
order: 2
icon: "network"
level: "advanced"
skills: [ai-agents, security, ci-cd]
outcomes:
  - "Place any piece of agent work on the ladder: use, delegate, orchestrate, govern"
  - "Design a command chain of sessions, Commanders, a Chief of Command and an Admiral, with spans, coverage and budgets that tighten downward"
  - "Write standing policies and decision domains as data, and test them in a pipeline"
  - "Enforce policy with hooks, guards and gates that an agent cannot talk its way around"
  - "Write delegation briefs and run parallel sessions without collisions"
  - "Run a fleet from a short briefing, an honest scorecard and a decision queue for the human"
  - "Build the pipeline gates from commit to customer for software that agents write"
---

One person can no longer type all the work. One AI agent cannot hold a whole product in its head. The people who lead product development in 2030 will run many agent sessions at once, the way a ship's captain runs a fleet: they set the outcomes, write the rules, put gates on what can ship, and keep the decisions that cannot be undone.

This track teaches that job. It is the top of the ladder of agent skill, and it is the Master Developer module on **AI-agent orchestration**.

## Who this track is for

This track is for you if you already **use** an agent well and **delegate** whole tasks with a brief. If not, start with the [working with AI agents track](/library/tracks/working-with-ai-agents/), and in particular its lesson on orchestrating multiple agents. That track gives you the first two rungs. This one gives you the other two.

You do not need to be a hands-on engineer. You do need to read a small script, read a pipeline file and tell a safe command from a dangerous one. Every lab uses open tools you can install yourself.

## What we teach, and what we do not

We run our own operation this way: a small chain of command made of AI agent sessions, held inside written policy, hooks and gates, with people keeping the irreversible decisions. We teach you **the shape of it and the reasons behind it**. We do not publish our own machines, tools' settings, policy files or anything about credentials. You do not need them. The ideas are the valuable part, and you will build a working version of your own in the labs, with public tools:

- **Claude Code**: hooks, subagents, settings and permission rules, and project instructions.
- **Claude Agent SDK** and **OpenAI Agents SDK**: the same ideas in code.
- **GitLab CI**, protected branches, merge requests and (where your plan allows) merge trains, with **GitHub Actions** equivalents shown too.
- **Open Policy Agent** and **Conftest**: policy as data, tested like code.

A note on cost and access. Running a model needs an account with a provider (a Claude plan or API key, or an OpenAI API key). Several labs need no model at all: the policy, the pipeline and the scorecard run for free. Each lab says which kind it is.

## The ladder this track climbs

| Rung | What you do | What you write | Where you learn it |
|---|---|---|---|
| **Use** | Work with one agent, step by step | Good prompts | Working with AI agents |
| **Delegate** | Hand a whole task to one agent | A spec and a brief | Working with AI agents |
| **Orchestrate** | Run many sessions in a command chain | An org map, briefs, a merge order | This track, lessons 1 to 3 and 5 |
| **Govern** | Bound them with policy, hooks and gates | Policies, guards, pipelines | This track, lessons 3, 4, 6 and 7 |

## What you will be able to do

After the eight lessons you will be able to:

- Explain why orchestration is the future, and when it is the wrong tool.
- Draw a command chain for a real product with an owner for every part and no part left over.
- Write a standing policy that is observable, testable and has an exception path, and keep it in git.
- Install hooks that stop a risky command at the moment it is tried, and tell the difference between a guard and a suggestion.
- Write a delegation brief that gives an agent an outcome, limits and a way to prove it is done.
- Read a one-page briefing that ranks products worst first and shows what was not measured.
- Operate a pipeline in which every change must prove itself before it reaches a customer.

## How the lessons build

1. **Why orchestration is the future.** The ladder, the philosophy, and what a person keeps.
2. **The command chain.** Sessions, Commanders, a Chief of Command and an Admiral, with spans, coverage and a reserve.
3. **Policy as data and decision domains.** Rules with reasons, tested in a pipeline, and one owner per area of design.
4. **Hooks, guards and gates.** Enforcing policy at the moment of action, and at the door to the default branch.
5. **Delegation briefs, long-horizon work and the autonomy ladder.** How to hand work down and what an agent does before it hands back.
6. **Running the fleet.** Briefings, scorecards, escalations, budgets and the human decision queue.
7. **Launch Sequence for agent-built software.** The gates from commit to customer, operated for many products.
8. **Capstone: run a small agent command chain for TrailMug.** Everything together, with a retrospective.

Every lesson uses the same fictional product, **TrailMug**, reusable cups for cafés. In this track TrailMug has an Admiral, one Chief of Command and three Commanders: one for the app, one for the website and one for operations. You will build their command centre as one git repository, a piece at a time, and it becomes your capstone.

Each lesson has the shape you know from the rest of the Dojo: why it matters, key ideas, steps, the TrailMug example, working with agents, common mistakes, a practice with a deliverable, a checklist and free reading.

## The 2030 Product Development Manager at work

At this level the manager is a designer of systems of work. You decide what the product is for, which decisions are yours alone and which can be made by anyone inside a rule. You write the rules. You read the evidence that the rules held. You do not read every line of code. You read the briefing, the scorecard and the few decisions that were put in front of you.

Many disciplines meet here. **Finance** sets the budgets that tighten downward. **Security and privacy** write the guards and decide what a model may see. **Operations** owns the gates to production. **Design and brand** own areas that agents may not change on their own. **Engineering** supplies the depth to judge what the agents built. Your job is to bring them into one set of written rules that agents can follow and that people can audit.

## How it maps to the Dojo

- **Master Developer, AI-agent orchestration module.** All eight lessons. The Master Developer review asks you to explain your command chain, your policies and your gates out loud, and to show the evidence from the capstone.
- **Developer, weeks 4 and 6.** Lessons 5 and 6 deepen what you did when you first directed agents and when you ran your demo.
- **The Way.** "Fix forward", "git is the source of truth" and "disclose AI use" are the rules these lessons turn into mechanisms.

## Time needed

Plan about three hours per lesson, with the capstone taking a weekend. Spread the track across three or four weeks. The labs build on each other, so keep your `trailmug-command` repository from lesson to lesson.

## What you will keep

A repository that holds an org map, standing policies, a decision-domain rule, hooks that enforce them, delegation briefs, a pipeline, a briefing, a decision queue and a retrospective. It is the strongest evidence you can bring to a coach, a panel or an employer that you can run agents as a system, not just use them.
