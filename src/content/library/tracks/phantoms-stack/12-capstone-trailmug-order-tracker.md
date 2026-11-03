---
title: "Capstone: TrailMug's order tracker on PHANTOMS"
description: "Direct AI agents to scaffold TrailMug's order tracker on the PHANTOMS core starter, then review and verify it against the starter's own guides. Your spec, your agent briefs and your review notes are the deliverable."
section: "The PHANTOMS stack"
order: 12
track: "phantoms-stack"
level: "advanced"
duration: "8 hours"
outcomes:
  - "Write a one-page product spec and acceptance criteria for a small system of record"
  - "Extend a repository instruction file and write scoped agent briefs for parallel work"
  - "Run the starter from a fresh clone and verify an agent-built feature with evidence"
  - "Review the CI pipeline and security posture and write an honest readiness report"
prerequisites:
  - "the-way-five-rules"
  - "people-write-epics"
  - "disclose-ai-use"
resources:
  - "curiosity-corp/phantoms-starter"
  - "agents-md/agents-md"
  - "gitlab/create-your-first-ci-cd-pipeline"
  - "docker/compose-quickstart"
  - "owasp/rest-security-cheat-sheet"
  - "anthropic/building-effective-ai-agents"
updated: 2026-11-03
---

This is lesson 12, the capstone of the PHANTOMS track. It supports the Master Developer modules on platform, production launch and AI-agent orchestration. In the other lessons you learned to choose, direct and judge one piece at a time. Here you do it for a whole small product, with several agents, from a fresh clone of the public starter.

## 1. Why this matters

Reading about a stack is not the same as running it. A person who has never cloned, started, broken and fixed a real repository will believe an agent's report too easily. The capstone makes you do the whole loop once: **decide, specify, brief, build, verify, report**.

The point is not the code. Agents write the code. The point is the **quality of your decisions and your verification**. A strong capstone has a sharp spec, tight agent briefs and honest review notes that would let a colleague repeat your checks. Those three documents, in git, are the deliverable.

The 2030 Product Development Manager owns the outcome even when every line was typed by an agent. If the order tracker loses an order, "the agent wrote it" is not an answer. This capstone trains the habits that make it a rare event.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| The problem, the scope, the acceptance criteria, the rules, what is demo and what is real | Scaffolding data, API and page; tests; documentation; CI fixes | Running from a fresh clone, hand-testing refusals, reading the diff, the pipeline and the security checklist | Product (the promise), design (the page), security (the checklist), operations (CI and recovery), finance (the cost of what you added) |

## 2. What you will build

**TrailMug's order tracker**, version 0.1. TrailMug lends reusable cups to cafés. A café orders a batch of cups. The tracker lets a café owner see where each order is, and lets warehouse staff move an order forward.

Use **PHANTOMS core**, the public starter at [github.com/Curiosity-Corp/phantoms](https://github.com/Curiosity-Corp/phantoms). You will use these pieces: Bun, PostgreSQL, Hono, Next.js (static) and Turborepo. You will **not** add A, O, M or S. Writing down why not is part of the work.

The sample app in the starter manages "tasks". Your agents will turn it into "orders". The starter's guides are your rulebook: `README.md`, `AGENTS.md`, `docs/getting-started.md`, `docs/security.md`, `docs/ci-cd.md` and `docs/version-policy.md`. Read them first. They are short.

## 3. Key ideas for this lesson

### The starter is a rulebook as much as a codebase

`AGENTS.md` tells every agent: read the README and architecture first; use Bun only; keep A provider-neutral; keep O, M and S optional; validate at API boundaries; keep database access in `packages/db`; use reviewed migrations; never commit secrets; make small changes; keep docs accurate; run the verification commands before handoff; and never claim production readiness from a successful build alone. Your job is to **extend** these rules with the rules of your product, not to replace them.

### Parallel agents need boundaries

You will run more than one agent. They must not step on each other. The starter's folders give you natural fences:

| Agent | Owns | Must not touch |
|---|---|---|
| Data agent | `packages/db` | `apps/*` |
| API agent | `apps/api` | `packages/db` internals, `apps/web` |
| Web agent | `apps/web` | `apps/api`, `packages/db` |
| Pipeline agent | CI file and docs | Application code |

Work in separate branches. Merge in dependency order: data, then API, then web. Each agent gets its own **brief**.

### A brief is a contract

A good brief has: goal, context to read, rules, files it may change, acceptance criteria, how to prove it, and what to report. You will write four.

### Evidence beats claims

Your review notes must say what you **saw**, not what the agent said. "The agent reported that tests pass" is not evidence. "I ran `bun test` on a clean clone and 14 tests passed" is.

## 4. Step by step

### Step 0: Set up your own repository

You cannot push to the public starter. Create your own **private** repository on GitLab (the free plan is enough: it has issues, milestones and labels, but not epics), then:

1. Clone the public starter: `git clone https://github.com/Curiosity-Corp/phantoms.git trailmug-orders`
2. Point it to your repository and push the first commit.
3. Install what the guide requires: Bun at the version in `docs/version-policy.md`, Docker Compose and Git. Check with `bun --version`.
4. Read the version policy and note the date it was reviewed. Newer versions may exist. Record that you chose to follow the policy as written.

### Step 1: Run the starter before you change anything

Follow `docs/getting-started.md` exactly:

```sh
bun install --frozen-lockfile
cp .env.example .env
docker compose up -d postgres
bun run db:migrate
bun run dev
```

Then, in another terminal, try the sample API with the `curl` commands from the guide. Run the checks (`bun run lint`, `bun run typecheck`, `bun test`, `bun run build`). Write down what you saw. **If something fails, that is a finding.** Use the guide's troubleshooting section, and note whether the docs were enough. (If you find a mistake in the starter's docs, report it to the Dojo through an issue. Do not hide it.)

Why this step? You need a known-good baseline. Every later bug is then yours or the agent's, not the starter's.

### Step 2: Write the epic and the spec yourself

People write epics. AI never does. Write the epic in one sentence: "A café owner can order cups and always see where the order is." Then write the **spec**, one page:

- **Problem and users:** café owners and warehouse staff.
- **Scope:** place an order, list my orders, move an order forward, health and readiness (already present).
- **Out of scope:** real user login, payments, AI features, search by meaning, file uploads, notifications. (Say which of A, O, M and S you defer and the trigger for each.)
- **Data promises:** from lesson 4. A cup count above zero. Status from a fixed list. Forward-only changes.
- **Routes:** a table as in lesson 5, with who may call, and what happens in each refusal.
- **Page:** "My orders" with the empty, loading and error texts written out.
- **Acceptance criteria:** at least ten, each testable by a person or a program.
- **Known gaps:** write the honest list. The starter has one shared bearer token, not real per-user identity or per-café authorization. State that this is a **demo** until that is fixed.

Save it as `docs/spec/order-tracker.md`.

### Step 3: Extend the rules

Add a short section to `AGENTS.md`: your product's vocabulary (order, café, status), the forward-only status rule, the demo-only warning, the rule that no new dependencies are added without a decision record, and the agent boundaries from the table above. Commit it. Now every agent will read your rules first.

### Step 4: Write four briefs

Create `docs/briefs/01-data.md` to `04-pipeline.md`. Use this shape:

```
Goal: <one sentence>
Read first: README.md, AGENTS.md, docs/spec/order-tracker.md, <relevant guide>
Rules: <the rules that matter for this agent>
You may change: <folders>
You must not change: <folders>
Acceptance criteria: <the criteria from the spec that this brief covers>
Prove it: <commands to run and tests that must exist>
Report: what changed, what you ran and the output, what you could not verify
Stop and ask if: <a rule blocks you>
```

Brief 1 (data): turn `tasks` into `orders` with a migration, constraints and tests. Brief 2 (API): the order routes from your table with validation and refusal tests. Brief 3 (web): the "My orders" page with all four states and a browser test. Brief 4 (pipeline): review and complete the CI file from the public baseline in `docs/ci-cd.md`, and list what the baseline does not cover.

### Step 5: Run the agents, one branch each

For each brief: create a branch, give the agent the brief, let it work, and **review before merge**. Use the review lists from lessons 3 to 8: the data review (lesson 4, eight steps), the endpoint review (lesson 5, nine steps), the page review (lesson 7, ten steps), the dependency review (lesson 3, seven steps), and the graph review if any package was added (lesson 8).

Write a review note for each agent in `docs/reviews/`, using this shape:

```
Agent and brief:
What I asked:
What I received (files changed, dependencies added):
What I ran myself, and the output:
What I hand-tested (include the bad inputs):
Defects found:
What I sent back, and the result:
Decision: merge / merge with follow-up issues / reject
Follow-up issues filed:
AI use to disclose in the merge request:
```

Merge in the order data, API, web. After each merge, run the whole checks from a clean clone.

### Step 6: Review the pipeline and the security posture

Read `docs/ci-cd.md` and `docs/security.md` as a reviewer.

For CI: confirm that merge request jobs run no production credentials, that installs are frozen, that dependency audit, source scan and secret scan run and are blocking, and that nothing is hidden behind "allow failure". The public baseline includes a container smoke job that needs a protected runner with Docker-in-Docker. If you do not have such a runner, leave that job out and **write that decision down**, with what it leaves unchecked. Note the guide's own reminder: the pipeline builds and tests the image but does not deploy it, and a real deployment would need signing, scanning, provenance and rollback checks.

For security, answer in writing, using the lesson 5 and lesson 7 lists: who can call each route, how is it checked, what is public, what is logged, where are the secrets, and what happens when the database is down. Use the [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) as a second opinion.

### Step 7: Write the readiness report

One page, `docs/readiness-report.md`, honest and plain. Use these headings:

- **What works** (with evidence).
- **What I verified myself** (commands and hand tests, with dates).
- **What I did not verify**.
- **Known gaps**: real login and per-café authorization, backups and a restore test, rate limits, monitoring, anything else you found.
- **Decisions**: what I deferred (A, O, M, S) and the trigger for each.
- **Cost and operations**: what it would cost to run for a month, and who would be woken when it breaks. Estimates must be labelled as estimates.
- **Verdict**: demo only, or ready for a pilot with named customers and conditions. The starter's guidance: never claim production readiness from a successful build alone.

## 5. Working with AI agents on this

You are using them throughout. Keep these habits.

**What to delegate.** Implementation inside your fences, tests, documentation drafts, CI wiring, summarising a diff, and a first pass at your review lists ("list every place this code skips validation").

**What you must do yourself.** The epic and the spec. The rules in `AGENTS.md`. The acceptance criteria. Every merge decision. The hand tests. The readiness verdict. People write epics and roadmaps. AI never does.

**A prompt for a second-opinion reviewer.** Use a fresh agent session, so it does not share the builder's assumptions:

> You are a skeptical reviewer. Read AGENTS.md, docs/spec/order-tracker.md and docs/security.md. Review the diff of branch <name> against main. Do not edit anything. List: (1) every acceptance criterion in the spec and whether the diff and tests prove it, with file and line; (2) any route or function that skips validation or authorization; (3) any dependency, secret, public variable or log line that violates AGENTS.md; (4) any test that would still pass if the feature were broken. Mark anything you cannot determine as UNKNOWN. Do not suggest new features.

Treat its findings as leads. Open each one yourself.

**Disclose.** Every merge request states which agent did what, which parts you wrote, and what you checked by hand. See [disclose AI use](/library/disclose-ai-use). If a defect reaches your demo, [fix forward](/library/fix-forward): make a new change that repairs it, and note it in the report.

## 6. Where the starter is behind

This starter is a learning core, reviewed on 2026-10-01. A product built today would want more, and the capstone is the right place to record it. Dojo opinion, to be tested by you, not promises by the starter:

- **Real identity and per-record authorization** instead of a shared token (the starter says so itself).
- **An API contract** (a machine-readable description of the routes) so partners and agents share one source of truth. The CI guide hints at this with an API linter.
- **Browser end-to-end tests** for the main journeys, run in CI. The guides recommend Playwright once a journey exists.
- **Rate limits and abuse controls** at the API or ingress.
- **Telemetry**: structured logs with request ids, metrics, traces and alerts tied to a service target.
- **A tested backup and restore** for the database, and for files if you add S.
- **An evaluation set** for any AI feature you add later.
- **A version policy that lists every dependency** the code uses, not only the headline ones.

List which of these you would add first for TrailMug, and why, as the last section of your report.

## 7. Common mistakes and how to avoid them

- **Letting one agent do everything on one branch.** You lose the fences and the review. Split the work.
- **Skipping Step 1.** Without a known-good baseline you cannot tell whose bug it is.
- **Briefs without acceptance criteria.** The agent will decide when it is done.
- **Writing the spec after the build.** Then the spec describes what the agent did, not what you wanted.
- **Accepting reports instead of running things.** Run the commands yourself.
- **Testing only success.** Test bad input, missing token, wrong status change and API down.
- **Hiding gaps.** An honest "demo only" is worth more than a shaky "ready".
- **Forgetting to disclose AI use.**

## 8. Practice and deliverable

This whole lesson is the practice. When you finish, your repository contains:

- `docs/spec/order-tracker.md`: your epic and spec.
- `AGENTS.md` with your added rules.
- `docs/briefs/01-data.md` to `04-pipeline.md`: your four briefs.
- `docs/reviews/`: one review note per agent, plus the pipeline and security review.
- `docs/decisions/`: at least one decision record per deferred piece (A, O, M, S) and one for the variant you chose.
- `docs/readiness-report.md`: your verdict and gaps.
- The working code, merged through merge requests that disclose AI use.

**How a mentor will assess it.** A mentor reads your spec first, then picks two acceptance criteria and checks that your evidence proves them. The mentor then asks you to show one refusal test failing when you break the rule on purpose. The strongest submissions are not the ones with the most features. They are the ones where every claim in the report can be checked.

## 9. Checklist

- [ ] I ran the starter from a fresh clone and recorded the baseline.
- [ ] I wrote the epic and the spec myself, with at least ten testable criteria.
- [ ] I extended `AGENTS.md` and fenced each agent's folders.
- [ ] I wrote four briefs, each with acceptance criteria and a stop rule.
- [ ] I reviewed each agent's work with the lesson checklists and wrote review notes.
- [ ] I tried bad input, missing token, a backwards status change and an API outage by hand.
- [ ] I reviewed CI and security against the starter's guides and wrote down what I did not check.
- [ ] My readiness report states the demo-only gaps plainly.
- [ ] Every merge request discloses AI use.

## 10. Further learning

Re-read the public starter's guides now that you have used them. The AGENTS.md convention page and Anthropic's article on building effective agents will help you tighten your briefs. The GitLab first-pipeline tutorial and the Docker Compose quickstart explain the two tools that sat quietly under your build, and the OWASP REST Security Cheat Sheet is a good second checklist for the review of your API. From here, the next steps are the [Working with AI agents](/library/tracks/working-with-ai-agents/) track for deeper briefing and review habits, and the Master Developer assessment, where a product like this one can become part of your Product Package.
