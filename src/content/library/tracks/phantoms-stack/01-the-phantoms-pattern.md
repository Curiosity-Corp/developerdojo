---
title: "The PHANTOMS pattern"
description: "PHANTOMS is a family of starting points, not one fixed stack. Learn to choose each piece by the job it does, tell required from optional, and swap pieces as technology improves."
section: "The PHANTOMS stack"
order: 1
track: "phantoms-stack"
level: "core"
duration: "90 min"
outcomes:
  - "Name the job each PHANTOMS letter does and the default tool for it today"
  - "Separate the pieces a first product needs from the pieces it should wait for"
  - "Choose or swap a piece by job-to-be-done, cost and risk"
  - "Explain why a repository instruction file (AGENTS.md) is part of the stack"
prerequisites:
  - "the-way-five-rules"
resources:
  - "curiosity-corp/phantoms-starter"
  - "agents-md/agents-md"
  - "twelve-factor/the-twelve-factor-app"
  - "anthropic/building-effective-agents"
  - "owasp/top-10-for-llm-applications"
updated: 2026-11-03
---

This is lesson 1 of the PHANTOMS track. It supports the Master Developer modules on platform and AI-agent orchestration, and it helps in Developer week 4, when you defend a roadmap and must say what a technical choice costs. It gives you the map. The next eleven lessons walk the territory.

## 1. Why this matters

Every new software product starts with the same quiet meeting. Where does the data live? How does the web page talk to the server? Which tool runs the tests? Which model do we call? Teams spend days on these questions and often decide badly, because the decision is made under pressure and written nowhere.

Now add AI agents. An agent that starts a project with no rules will make all of these choices for you, in seconds, and each time it will choose differently. One day it uses one database library. The next day, in the same repository, it adds a second one. The result looks fine in a demo and is a burden to run.

PHANTOMS is our answer. It is a **pattern**: a short list of the jobs every product needs done, with one reasonable default tool for each job, written down in a repository that both people and agents can read. The name is an acronym, one letter per job.

The 2030 Product Development Manager does not type the code. They decide **which jobs the product needs, what each job may cost, and what risk each tool adds**. They write the rules. They direct agents to build inside the rules. They verify the result. PHANTOMS gives you the vocabulary and a real repository to practise all of that.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Which jobs the product needs now, which can wait, what the budget and risk limits are | Scaffolding the project, wiring the pieces together, writing boilerplate, tests and docs inside the rules | Reading the diff and the pipeline, running the checks, comparing the result to the written rules | Operations (who runs and recovers it), security (what is exposed), finance (what it costs each month), product (what promise it supports) |

## 2. Key ideas, explained

### The pattern: one letter, one job

Here is the stack as the public starter describes it, with the job each letter does.

| Letter | Default today | The job it does | In the starter today? |
|---|---|---|---|
| **P** | PostgreSQL | Keep important records safe and correct | Yes, core |
| **H** | Hono | Serve a small, typed web API | Yes, core |
| **A** | AI | Reach language models through a replaceable adapter | Yes, core (an adapter package; no live call on startup) |
| **N** | Next.js | Show the web application to people | Yes, core |
| **T** | Turborepo | Run the repository's tasks in order and skip repeated work | Yes, core |
| **O** | OpenClaw | Run agents that use a small set of tools | Optional, not installed |
| **M** | Milvus | Search by meaning (vector search) | Optional, not installed |
| **S** | SeaweedFS | Store files and other large objects | Optional, not installed |

One more piece sits under all of them: **Bun**, the runtime (the program that runs your code) and the package manager (the tool that installs the libraries your code uses). It has no letter, but it is required. Lesson 3 covers it.

Two things to notice. First, the **letters name jobs**, and the tools are today's defaults. When a better tool for a job appears, you swap the tool and keep the job. Second, the three pieces at the end are **optional**. A first product usually needs none of them. The acronym lists them so that you know where they would plug in, not to say you must use them.

### The A is the most important letter to get right

**A** stands for **AI**, and it is never a single company. It means: models and agents sit **behind a replaceable adapter**. An **adapter** is a small piece of your own code that hides which model you call. The rest of the product talks to the adapter. If you change the model, the provider or the hosting, only the adapter changes.

Why does this matter to a manager and not just an engineer? Because models change quickly in price, quality, rules and availability. A product welded to one vendor is a product whose cost and risk the vendor controls. Lesson 6 goes deep on this.

### Required versus optional

A useful rule: **add a piece when a measured need appears, not when the acronym lists it.** Every stateful service (one that stores data) adds work: security hardening, backups, restore tests, upgrades, monitoring and money. The starter's own architecture guide says: "Do not adopt every optional service just because it appears in the acronym."

| Piece | Required for a first product? | Add it when |
|---|---|---|
| Bun | Yes | Always, it is the toolchain |
| P PostgreSQL | Almost always | The product keeps records people depend on |
| H Hono | Usually | Something other than your own web page must talk to your data |
| A AI | No | A real feature needs a model, and you can say how you will judge its answers |
| N Next.js | If there is a web page | People use the product in a browser |
| T Turborepo | When you have several packages | Builds and checks start to feel slow, or the repository grows past one app |
| O OpenClaw | No | A bounded job benefits from an agent that uses tools, and you can fence it in |
| M Milvus | No | Search by meaning measurably beats the simpler search you already have |
| S SeaweedFS | No | You must keep many or large files and a managed store does not fit |

### Choose by job-to-be-done, not by fashion

When you consider a piece, ask five questions in this order.

1. **What job must it do?** Write it as a sentence a customer would understand. "Keep every order, even after a crash."
2. **What is the simplest thing that does the job?** Often this is a table in the database you already run.
3. **What does it cost?** Money each month, but also attention: who patches it, who restores it, who is woken at night?
4. **What does it expose?** Every new service is a new door. Who can reach it? What data does it hold?
5. **How hard is it to leave?** If the tool disappears or doubles its price, how many files change?

A tool that is exciting but fails questions 2 to 5 is a bad choice at that moment. It might be the right choice later.

### The repository is part of the stack

In a PHANTOMS project the rules are not in someone's head. They are files in git: a `README.md`, an `AGENTS.md`, guides under `docs/` and a small decision log. The `AGENTS.md` file is read by coding agents before they touch anything. It says things like: use Bun and nothing else, keep the AI layer provider-neutral, keep the database code in one package, never commit secrets, and run these commands before you say you are done. That is how a manager's decisions reach agents that never attended a meeting. Lesson 12 shows you how to write one.

This follows [the Way](/library/the-way-five-rules): git is the source of truth. If a rule is not in the repository, an agent cannot follow it.

### Versions are a decision too

The starter keeps a **version policy**. It lists the exact versions it was reviewed with and how often to refresh them. As reviewed on 2026-10-01:

| Piece | Version in the policy |
|---|---|
| Bun | 1.4.2 |
| Turborepo | 2.11.6 |
| Next.js | 16.3.8 |
| React and React DOM | 19.3.0 |
| Hono | 4.13.12 |
| AI SDK (the library inside the A adapter) | 7.0.126 |
| PostgreSQL (local container) | 18.6 |
| OpenClaw (reference, optional) | v2026.9.7 |
| Milvus (reference, optional) | v3.0.2 |
| SeaweedFS (reference, optional) | 4.48 |

The exact versions that actually run are in `package.json` and `bun.lock`, and they can move ahead of the policy page. At the time of writing, the lockfile resolves a slightly newer Next.js patch than the policy lists. That is why the rule is: **read the lockfile for what runs; read the policy for what was reviewed.** The optional pins are "learning references", not tested combinations. Always check the repository for current numbers before you build.

## 3. Step by step: how to choose and swap a piece

Use this procedure whenever a product needs a new capability or an agent suggests a new tool.

1. **Write the job in one sentence.** "Customers can attach a photo to a damaged-cup report."
2. **List the data and the risk.** What data does it touch? Is it personal? Could loss or leaks harm a customer?
3. **Try the simplest option first.** Can the database you already run do it? Can a managed service do it?
4. **Compare two or three candidates on the five questions** above. A small table in a decision record is enough.
5. **Write a decision record.** A short file in git: the decision, the options, the reason, the trade-off, and how to leave. The starter keeps these in `docs/decisions.md`. See the [decision record template](/library/template-decision-record).
6. **Update the instruction file.** Tell agents what they may and may not add.
7. **Brief an agent to make the change** on a branch, with tests and a pipeline run.
8. **Review and verify.** Read the diff. Check the new door is closed or guarded. Check the new cost is known.

To swap a piece, repeat the same steps, and add one more: **find every place the old piece is mentioned.** That is easy when the product kept its boundaries (one package owns the database, one adapter owns the model) and painful when it did not. A good swap touches one package, not twenty files.

## 4. Worked example: TrailMug

Maya is building TrailMug, a service that lends reusable cups to cafés and customers. After talking to café owners, she writes this epic herself: "A café owner can order a batch of cups and always see where the order is." She needs an **order tracker**.

She runs the five questions on each letter.

- **P:** Orders are records people depend on. A café must never lose one. Yes, PostgreSQL.
- **H:** A café's own tablet or a delivery partner's tool will later need the same data, so a small API makes sense. Yes, Hono.
- **N:** Café owners use a browser. Yes, a Next.js page.
- **T:** One app and two packages today. The task graph is small, but the starter already uses it, so keep it.
- **A:** Maya likes the idea of a model that drafts "your order is delayed" messages. But she cannot yet say how she would judge a bad draft. She **defers** it and writes the idea in the roadmap as a later epic.
- **O:** No bounded agent job exists. **Defer.**
- **M:** The order list has maybe a few hundred rows. Plain SQL search is enough. **Defer.**
- **S:** Maya has no files to store yet. **Defer.** Later, delivery photos may change this.

She writes a decision record that lists the five pieces she uses, the three she defers, and the trigger for each deferred one ("add M when search by plain text fails in a customer test"). That one page is the real output. It prevents an agent from "helpfully" adding a vector database on day one.

## 5. Working with AI agents on this

**What to delegate.** Scaffolding the project from the starter, wiring a new package into the task graph, writing the first tests, producing a comparison table for two candidate tools from their official docs, and drafting the decision record text from your notes.

**What you must do yourself.** Decide which jobs the product needs. Set the cost and risk limits. Write the epic and the roadmap: people write epics and roadmaps, AI never does. Approve every new stateful service. Own the decision record.

**A prompt you can adapt:**

> You are working in the PHANTOMS starter repository. Read README.md, AGENTS.md and docs/architecture.md first. Task: compare two options for the job "<job in one sentence>". For each option, list from the official documentation: what it does, what it needs to run, what data it holds, how it is secured, how it is backed up, and how it is licensed. Do not add any dependency to the repository. Do not recommend; present a neutral table and list what you could not verify. Cite the official page for every claim.

**How to check the output.** Open every page the agent cites. Check that each claim is on the page. Look for what it left out: licence, backup and exit are the usual gaps. If a number has no source, remove it.

**Where this sits on the agent ladder.** One comparison for one agent is *delegating*. When several sessions each own a part of the build, you are *orchestrating*, and written policy, hooks and pipeline gates must keep them safe. Lesson 12 practises this, and the [Agent orchestration track](/library/tracks/agent-orchestration/) teaches it in depth.

**Disclose.** Note in the merge request that an agent produced the comparison and that you checked each source. See [disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Adopting every letter on day one.** The acronym is a map, not a shopping list. Defer what you cannot justify with a measured need.
- **Choosing by buzz.** "Everyone uses vector databases" is not a job. Write the job first.
- **Letting an agent pick tools silently.** Put the allowed tools in `AGENTS.md`, and make "add a new dependency" something an agent must ask about.
- **Welding the product to one model vendor.** Keep a thin adapter, keep credentials on the server, and keep the model name in configuration.
- **Trusting the version page without the lockfile.** Policy shows what was reviewed. The lockfile shows what runs.
- **Treating a green build as "production ready".** The starter says it plainly: never claim production readiness from a successful build alone.

## 7. Practice

**Exercise: "Choose the pieces for your product."**

1. Take your own product, or TrailMug if you have none. Write the epic in your own words. No agent writes it.
2. For each of the eight letters plus Bun, answer in one line: needed now, needed later, or never. Give the trigger for "later".
3. For each piece you keep, run the five questions and write one sentence of answer.
4. Write the whole thing as a decision record in your repository at `docs/decisions/001-phantoms-pieces.md`, using the Dojo decision record template.
5. Ask an agent to review your record against the starter's `docs/architecture.md` and list anything inconsistent. Do not let it edit your decisions. Write down which of its remarks you accepted and why.

**Deliverable in git:** `docs/decisions/001-phantoms-pieces.md` plus a merge request description that names the agent you used and what you accepted or rejected.

## 8. Checklist

- [ ] I can say the job of each PHANTOMS letter in one sentence.
- [ ] I know the three optional pieces and the trigger that would add each.
- [ ] I know that A means provider-neutral AI behind an adapter, never one vendor.
- [ ] I wrote a decision record and an agent did not write my decisions.
- [ ] I read the version policy and the lockfile and I know the difference.
- [ ] I can explain one choice to a finance person and one to a security person.

## 9. Further learning

The resources listed below this lesson start with the public starter itself. Read its README and `AGENTS.md` next to this lesson. Then read the AGENTS.md convention page, the Twelve-Factor App (an older text that still explains well why configuration and services should be swappable), Anthropic's article on building effective agents, and the OWASP list of risks for model-based applications. The last two will make more sense once you have done lessons 6 and 9.

**Next:** [the variants: core, web and terminal](/library/tracks/phantoms-stack/02-the-variants-core-web-and-terminal/).
