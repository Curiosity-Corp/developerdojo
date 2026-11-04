---
title: "Capstone: TrailMug's order tracker on PHANTOMS"
description: "Orchestrate several AI agent sessions to scaffold TrailMug's order tracker on the PHANTOMS core starter, under a written AGENTS.md policy, hooks and a CI gate. Your spec, briefs, policy and review notes are the deliverable."
section: "The PHANTOMS stack"
order: 12
track: "phantoms-stack"
level: "advanced"
duration: "8 hours"
outcomes:
  - "Write a one-page product spec and acceptance criteria for a small system of record"
  - "Orchestrate parallel agent sessions under a written policy, a hook and a CI gate"
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
  - "anthropic/building-effective-agents"
updated: 2026-11-03
---

This is lesson 12, the capstone of the PHANTOMS track. It supports the Master Developer modules on platform, production launch and AI-agent orchestration. In the other lessons you learned to choose, direct and judge one piece at a time. Here you do it for a whole small product, with several agents, from a fresh clone of the public starter.

## 1. Why this matters

Reading about a stack is not the same as running it. Someone who has never cloned, started, broken and fixed a real repository will believe an agent's report too easily. The capstone makes you do the whole loop once: **decide, specify, brief, build, verify, report**.

The point is not the code. Agents write the code. The point is the **quality of your decisions and your verification**. Your spec, briefs, policy and review notes, in git, are the deliverable.

It also puts you on the next rung of a ladder. **Use** one agent. **Delegate** a whole task with a brief. **Orchestrate** several sessions at once, each with its own job. **Govern** them with written policy, hooks and gates, so that safety does not depend on your attention. In this capstone you orchestrate three agent sessions and govern them. The [Agent orchestration track](/library/tracks/agent-orchestration/) goes further.

The 2030 Product Development Manager owns the outcome even when every line was typed by an agent. If the order tracker loses an order, "the agent wrote it" is not an answer. This capstone trains the habits that make it a rare event.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| The problem, the scope, the acceptance criteria, the rules, what is demo and what is real | Scaffolding data, API and page in parallel sessions; tests; documentation; CI fixes | Running from a fresh clone, hand-testing refusals, reading the diff, the pipeline and the security checklist | Product (the promise), design (the page), security (the checklist), operations (CI and recovery), finance (the cost of what you added) |

## 2. What you will build

**TrailMug's order tracker**, version 0.1. TrailMug lends reusable cups to cafés. A café orders a batch of cups. The tracker lets a café owner see where each order is, and lets warehouse staff move an order forward.

Use **PHANTOMS core**, the public starter at [github.com/Curiosity-Corp/phantoms](https://github.com/Curiosity-Corp/phantoms). You will use these pieces: Bun, PostgreSQL, Hono, Next.js (static) and Turborepo. You will **not** add A, O, M or S. Writing down why not is part of the work.

The sample app manages "tasks". Your agents will turn it into "orders". The starter's guides are your rulebook: `README.md`, `AGENTS.md`, `docs/getting-started.md`, `docs/security.md`, `docs/ci-cd.md` and `docs/version-policy.md`. Read them first.

## 3. Key ideas for this lesson

### The starter is a rulebook as much as a codebase

`AGENTS.md` tells every agent: read the README and architecture first; use Bun only; keep A provider-neutral; keep O, M and S optional; validate at API boundaries; keep database access in `packages/db`; use reviewed migrations; never commit secrets; run the verification commands before handoff; and never claim production readiness from a successful build alone. **Extend** these rules with your product's rules. Do not replace them.

### Orchestration: one Commander, several sessions

A **session** is one agent working on one task. When you run several at once, you are the **Commander**: you give each a brief, keep a log of who does what, receive their questions, and decide. Fences keep sessions apart. The starter's folders are natural fences:

| Session | Owns | Must not touch |
|---|---|---|
| Data | `packages/db` | `apps/*` |
| API | `apps/api` | `packages/db` internals, `apps/web` |
| Web | `apps/web` | `apps/api`, `packages/db` |
| Pipeline | CI file and docs | Application code |

Each works on its own branch. You merge in dependency order: data, API, web.

### Governance: policy, a hook and a gate

Orchestration works only if safety does not rest on your attention. Three layers do that, and each can be tested:

- **Policy** is written in `AGENTS.md`: what agents may do, what is denied, what needs your approval, and when to stop and ask. It is what an agent reads.
- A **hook** is an automatic check that runs at a moment you choose, for example before a commit. It blocks bad actions even if an agent ignored the policy. A secret scanner before commit is the classic case.
- A **gate** is a check the pipeline enforces before anything merges: protected main branch, pipeline must pass, and a fence check that fails if a branch changes folders outside its brief.

Policy asks. Hooks and gates enforce. A rule that is only written down is a hope.

### A brief is a contract

A good brief has: goal, context to read, rules, files it may change, acceptance criteria, how to prove it, and what to report. You will write four.

### Evidence beats claims

Review notes say what you **saw**, not what the agent said. "I ran `bun test` on a clean clone and it passed" is evidence. "The agent reported success" is not.

## 4. Step by step

### Step 0: Set up your own repository

You cannot push to the public starter. Create your own **private** repository on GitLab (the free plan is enough: it has issues, milestones and labels, but not epics), then:

1. Clone the public starter: `git clone https://github.com/Curiosity-Corp/phantoms.git trailmug-orders`
2. Point it to your repository and push the first commit.
3. Install what the guide requires: Bun at the version in `docs/version-policy.md`, Docker Compose and Git. Check with `bun --version`.
4. Read the version policy and note its review date. Record that you follow it as written.

### Step 1: Run the starter before you change anything

Follow `docs/getting-started.md` exactly:

```sh
bun install --frozen-lockfile
cp .env.example .env
docker compose up -d postgres
bun run db:migrate
bun run dev
```

Then, in another terminal, try the sample API with the `curl` commands from the guide. Run the checks (`bun run lint`, `bun run typecheck`, `bun test`, `bun run build`). Write down what you saw. **If something fails, that is a finding.** Use the guide's troubleshooting section and note whether the docs were enough. Report any doc mistake you find as an issue.

This gives you a known-good baseline. Every later bug is then yours or an agent's.

### Step 2: Write the epic and the spec yourself

People write epics. AI never does. Write the epic in one sentence: "A café owner can order cups and always see where the order is." Then write the **spec**, one page:

- **Scope:** place an order, list my orders, move an order forward, health and readiness (already present), for café owners and warehouse staff.
- **Out of scope:** real user login, payments, AI features, search by meaning, file uploads, notifications. (Say which of A, O, M and S you defer and the trigger for each.)
- **Data promises:** from lesson 4. A cup count above zero. Status from a fixed list. Forward-only changes.
- **Routes:** a table as in lesson 5, with who may call, and what happens in each refusal.
- **Page:** "My orders" with the empty, loading and error texts written out.
- **Acceptance criteria:** at least ten, each testable by a person or a program.
- **Known gaps:** write the honest list. The starter has one shared bearer token, not real per-user identity or per-café authorization. State that this is a **demo** until that is fixed.

Save it as `docs/spec/order-tracker.md`.

### Step 3: Write the policy, the hook and the gate

Add a short section to `AGENTS.md`: your product's vocabulary (order, café, status), the forward-only status rule, the demo-only warning, the session fences from the table above, the rule that no new dependency is added without a decision record, and a **stop rule**: "if a rule blocks you, stop and write the question in `docs/orchestration/questions.md`". Then add the two enforcers:

1. **Hook:** a pre-commit check that runs the repository's lint and a secret scan. Ask the pipeline session to write it, and read it yourself.
2. **Gate:** protect `main`, require the pipeline to pass before merge, and add a small **fence check** job. It compares the files a branch changed with the folders its brief allows, and fails on any other. (Some GitLab approval features need a paid plan. The free plan has protected branches and a required passing pipeline.)

**Prove they work.** On a throwaway branch, make a session edit a forbidden folder and add a fake secret. Show the hook and the gate stopping each. Save the evidence. A control you have not seen block something is not a control.

### Step 4: Write four briefs, one per session

Create `docs/briefs/01-data.md` to `04-pipeline.md`, one per session, and an empty `docs/orchestration/log.md` and `questions.md`. Use this shape:

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

### Step 5: Run the sessions in parallel

Start the data, API and web sessions together, each on its own branch with its own brief. Keep a **log** in `docs/orchestration/log.md`: time, session, what it was told, what it handed back, and any conflict. Answer questions in `questions.md` the moment you can: this is your **decision queue**, and a stuck session is waiting for you. When the API session needs a field the data session has not made yet, you decide the order and write it down. That is commanding, not coding.

Review each branch before merge with the earlier checklists: lessons 3, 4, 5, 7 and, if a package was added, 8.

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

Merge in the order data, API, web, through the gate. After each merge, run all checks from a clean clone.

### Step 6: Review the pipeline and the security posture

Read `docs/ci-cd.md` and `docs/security.md` as a reviewer.

For CI: confirm that merge request jobs hold no production credentials, installs are frozen, dependency audit, source scan and secret scan are blocking, and nothing hides behind "allow failure". The public baseline's container smoke job needs a protected Docker-in-Docker runner. If you lack one, leave that job out and **write that decision down**, with what it leaves unchecked. The pipeline builds and tests the image but does not deploy it.

For security, answer in writing, using the lesson 5 and lesson 7 lists: who can call each route, how is it checked, what is public, what is logged, where are the secrets, and what happens when the database is down. Use the [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) as a second opinion.

### Step 7: Write the readiness report

One page, `docs/readiness-report.md`, honest and plain. Use these headings:

- **What works** (with evidence).
- **What I verified myself** (commands and hand tests, with dates).
- **What I did not verify**.
- **Known gaps**: real login and per-café authorization, backups and a restore test, rate limits, monitoring, anything else you found.
- **Decisions**: what I deferred (A, O, M, S) and each trigger.
- **Governance**: the policy, hook and gate, and the evidence that each blocked a violation.
- **Cost and operations**: estimated monthly cost and who is woken when it breaks.
- **Verdict**: demo only, or ready for a pilot with named customers and conditions. The starter's guidance: never claim production readiness from a successful build alone.

## 5. Working with AI agents on this

You are using them throughout. Keep these habits.

**What to delegate.** Implementation inside your fences, tests, documentation drafts, CI wiring, and a first pass at your review lists.

**What you must do yourself.** The epic and the spec. The policy in `AGENTS.md` and the decision to protect `main`. The acceptance criteria. The decision queue. Every merge decision. The hand tests. The readiness verdict. People write epics and roadmaps. AI never does.

**A prompt for a second-opinion reviewer.** Use a fresh session:

> You are a skeptical reviewer. Read AGENTS.md, docs/spec/order-tracker.md and docs/security.md. Review the diff of branch <name> against main. Do not edit anything. List: (1) every acceptance criterion in the spec and whether the diff and tests prove it, with file and line; (2) any route or function that skips validation or authorization; (3) any dependency, secret, public variable or log line that violates AGENTS.md; (4) any test that would still pass if the feature were broken. Mark anything undetermined as UNKNOWN.

Treat its findings as leads and open each one yourself. The [Agent orchestration track](/library/tracks/agent-orchestration/) teaches the next rung: many Commanders under a higher-level policy.

**Disclose.** Every merge request states which agent did what, which parts you wrote, and what you checked by hand. See [disclose AI use](/library/disclose-ai-use). If a defect reaches your demo, [fix forward](/library/fix-forward): make a new change that repairs it, and note it in the report.

## 6. Where the starter is behind

This starter is a learning core, reviewed on 2026-10-01. A product built today would want more, and the capstone is the right place to record it. Dojo opinion, to be tested by you, not promises by the starter:

- **Real identity and per-record authorization** instead of a shared token (the starter says so itself).
- **An API contract**, a machine-readable description of the routes, so partners and agents share one truth.
- **Browser end-to-end tests** in CI, once a journey exists.
- **Rate limits, telemetry and alerts** tied to a service target.
- **A tested backup and restore**, and an **evaluation set** for any AI feature you add later.
- **A version policy that lists every dependency** the code uses.

List which of these you would add first for TrailMug, and why, as the last section of your report.

## 7. Common mistakes and how to avoid them

- **Letting one session do everything on one branch.** You lose the fences and the review. Split the work.
- **Policy without enforcement.** A rule no hook or gate can block is a hope. Test each control.
- **Briefs without acceptance criteria, or a spec written after the build.** The agent then decides what done means.
- **Accepting reports instead of running things.** Run the commands yourself.
- **Testing only success.** Test bad input, missing token, wrong status change and API down.
- **Hiding gaps.** An honest "demo only" beats a shaky "ready".
- **Forgetting to disclose AI use.**
- **Leaving sessions waiting.** An unanswered question stalls a session. Keep the queue short.

## 8. Practice and deliverable

This whole lesson is the practice. When you finish, your repository contains:

- `docs/spec/order-tracker.md`: your epic and spec.
- `AGENTS.md` with your policy, fences and stop rule.
- The pre-commit hook, the protected `main`, the fence-check job, and `docs/reviews/governance-evidence.md` showing each blocking a deliberate violation.
- `docs/orchestration/log.md` and `questions.md`: your command log and decision queue.
- `docs/briefs/01-data.md` to `04-pipeline.md`: your four briefs.
- `docs/reviews/`: one review note per agent, plus the pipeline and security review.
- `docs/decisions/`: at least one decision record per deferred piece (A, O, M, S) and one for the variant you chose.
- `docs/readiness-report.md`: your verdict and gaps.
- The working code, merged through merge requests that disclose AI use.

**How a mentor will assess it.** The mentor reads your spec, picks two acceptance criteria and checks your evidence for them, then asks you to break one rule on purpose and show the test or gate catching it. The strongest work has not the most features, but claims that can all be checked.

## 9. Checklist

- [ ] I ran the starter from a fresh clone and recorded the baseline.
- [ ] I wrote the epic and the spec myself, with at least ten testable criteria.
- [ ] I wrote a policy in `AGENTS.md`, fenced each session's folders, and set a stop rule.
- [ ] I added a hook and a gate, and saw each block a deliberate violation.
- [ ] I ran three sessions in parallel and kept a log and a decision queue.
- [ ] I wrote four briefs, each with acceptance criteria and a stop rule.
- [ ] I reviewed each agent's work with the lesson checklists and wrote review notes.
- [ ] I tried bad input, missing token, a backwards status change and an API outage by hand.
- [ ] I reviewed CI and security against the starter's guides and wrote down what I did not check.
- [ ] My readiness report states the demo-only gaps plainly.
- [ ] Every merge request discloses AI use.

## 10. Further learning

Re-read the public starter's guides now that you have used them. The AGENTS.md convention page and Anthropic's article on building effective agents will tighten your briefs. The GitLab pipeline tutorial and Docker Compose quickstart explain the tools under your build. Next steps: the [Working with AI agents](/library/tracks/working-with-ai-agents/) track for deeper briefing and review habits, and the Master Developer assessment, where a product like this one can become part of your Product Package.
