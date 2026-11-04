---
title: "Capstone: build the first epics with ANDROID Ops on PHANTOMS"
description: "Run the build as a Product Development Manager who orchestrates a command chain of agent sessions bounded by written policy and gates, using ANDROID Ops focus areas and a PHANTOMS family stack, with a human decision at every gate."
section: "Frameworks"
order: 33
track: "frameworks"
level: "advanced"
duration: "90 min"
outcomes:
  - "Turn the first epics into hand-off issues and run them through the seven ANDROID Ops focus areas"
  - "Set up a small command chain of agent sessions with written policy, gates and a manifest, and say what stays a human decision"
  - "Choose a PHANTOMS family starting point, describe it in AGENTS.md and keep one merge request per issue"
resources:
  - "anthropic/building-effective-agents"
  - "anthropic/claude-code-best-practices"
  - "agents-md/agents-md"
  - "gitlab/docs-merge-request-pipelines"
  - "gitlab/merge-request-approvals"
  - "twelve-factor/the-twelve-factor-app"
prerequisites:
  - "tracks/frameworks/32-capstone-catalogue-personas-and-roadmap"
updated: 2026-11-03
---

**Dojo programme link:** this lesson is Developer weeks 4 to 5 ([Defend the roadmap](/library/week-4-defend-the-roadmap) onward, and week 5) pulled into one exercise. It is capstone step 8 of [the overview](/library/tracks/frameworks/30-capstone-overview-and-dream-discovery/).

## 1. Why this matters

Until now you produced documents. Now you produce software, and the question changes. It is no longer "did I write it well?" but "how do I keep many fast workers inside the lines?"

In 2030 a Product Development Manager (PDM) will not write most of the code. They will run a **command chain** of agent sessions, the way a small studio runs its crew. The skill is not "type a prompt". It is a ladder:

1. **Use** one agent for one job.
2. **Delegate** a whole task with a written brief.
3. **Orchestrate** several sessions in a chain of command.
4. **Govern** them with written policy, hooks and gates.

This lesson puts you on rungs three and four with a small, safe project. The advanced track [Agent orchestration](/library/tracks/agent-orchestration/) goes deeper into the command chain and into policy as data. Here you learn the shape and run it once.

## 2. Key ideas, explained

### 2.1 The command chain, in plain words

The Dojo uses four names for levels of command. You will use the first two in the capstone and know the other two exist.

| Level | What it is | In the capstone |
|---|---|---|
| **Session** | One agent working on one task in one branch | An agent that builds one issue |
| **Commander** | A person or lead agent who runs one product's sessions and keeps its board | You, for TrailMug |
| **Chief of Command** | Runs several Commanders | A programme lead, for a company with several products |
| **Admiral** | Oversees everything inside written policy and delegates outcomes, not tasks | The top of a larger operation |

Notice what is **not** in the chain: a place where an agent decides alone about money, customers, security exceptions or production. Those stay with people. Each level sits **inside policy**: written rules that say what a session may do on its own, what needs a check, and what needs a person.

### 2.2 Policy, hooks and gates

- **Policy** is a short file in git that states the rules. Example: "A session may open a merge request. It may not merge to the main branch. It may not change pipeline files, secrets or production settings."
- **Hooks** run automatically at defined moments, for example before a commit or after a tool call, to stop a rule being broken (a secret scan before commit).
- **Gates** are checks the pipeline enforces, which no session can skip: tests, linting, a [Launch Sequence](/library/tracks/frameworks/25-launch-sequence-six-stages/) stage, a required human approval on a protected branch. See GitLab's pages on [merge request pipelines](https://docs.gitlab.com/ci/pipelines/merge_request_pipelines/) and [merge request approvals](https://docs.gitlab.com/user/project/merge_requests/approvals/).

The idea: **do not rely on the agent being careful. Rely on the system making the wrong thing impossible.** Agents are fast, so the walls must be strong.

### 2.3 ANDROID Ops in this build

ANDROID Ops (Advance, Network, Design, Research, Optimize, Implement, Deliver) are **focus areas**, not phases (see [lesson 20](/library/tracks/frameworks/20-why-a-new-operating-model/)). For each epic in your roadmap you move through them in short loops, with the Focus Shift in mind: about four hours on one area, then change.

A practical way to run it in GitLab (see [lesson 24](/library/tracks/frameworks/24-running-android-ops-in-gitlab/)):

- one **milestone** per epic,
- one **issue** per hand-off, each carrying a focus-area label,
- a **board** with columns that show the state of the work,
- one **merge request** per issue, with the pipeline as the gate,
- a **change record** (merge request template) for anything that reaches production.

### 2.4 The hand-off issue is a contract

When a person hands work to a session, the issue is the contract. It has: the outcome, the files in scope and out of scope, the acceptance checks, the gates it must pass, the policy it works inside, and what to do when stuck ("stop and write a note, do not guess"). Lesson 21 gives the template. A good issue lets a session work for an hour with no questions.

### 2.5 PHANTOMS is a family

PHANTOMS is the Dojo's name for a family of AI-first starting stacks, not one product. The letters name the parts: **P**ostgres, **H**ono, **A** for the AI adapter (any provider, agentic by design), **N**ext.js, **T**urborepo, and the optional parts **O**penClaw, **M**ilvus and **S**eaweedFS. It runs on the Bun runtime. There are variants: a core backend, a web variant (PHANTOMS+), a terminal variant (PHANTOMS TUI), and more to come.

You choose the member of the family that matches your catalogue and your first epics. The [PHANTOMS track](/library/tracks/phantoms-stack/) teaches each part. For TrailMug the core backend plus the web variant fits. The **A** matters for a PDM: the AI adapter keeps the product **provider-neutral**, so you can change which model does the work without rewriting the product.

The Dojo's own starter template is internal. This lesson describes the idea (a working skeleton with an `AGENTS.md`, tests and a pipeline), but you will make your own from the PHANTOMS track.

### 2.6 AGENTS.md: the house rules for sessions

An [`AGENTS.md`](https://agents.md) file at the top of the repository tells any agent how the project works: how to run tests, naming rules, what not to touch, how to write commit messages, where the policy file is. It is plain text, and it is read at the start of every session. Anthropic's [guide to building effective agents](https://www.anthropic.com/engineering/building-effective-agents) and its [best practices for Claude Code](https://docs.anthropic.com/en/docs/claude-code/best-practices) both stress simple, composable setups with clear instructions. The rules in `AGENTS.md` are **advice** the agent reads. The gates in the pipeline are **walls** the agent cannot pass. You need both.

### 2.7 Provenance: who made this change?

When agents write code, each change should say so. A **manifest** (a small file kept with the change) records which session, which brief, which model family and which checks ran, tied to the commit. Reviewers use it to know what to look at hardest. The [twelve-factor](https://12factor.net/) habits (config in the environment, one codebase, explicit dependencies) also make agent-built apps easier to check, because the rules are written down.

## 3. Step by step

1. **Choose the first epic** (TrailMug: "Customers can find the nearest partner café", epic 1 of lesson 32).
2. **Write the policy file** (`policy/agents.md`, one page): what sessions may do alone, what needs a gate, what needs you. Include "never touch secrets, pipeline files or production".
3. **Create the repository** from a PHANTOMS family starting point; write `AGENTS.md` in it (how to run, test, name, commit).
4. **Create the milestone and labels** for the epic in GitLab.
5. **Split the epic** into three to six hand-off issues, each small enough for one session and one merge request. Use the Design, Research, Implement and Deliver areas where they apply.
6. **Protect the main branch.** Require a green pipeline and one human approval.
7. **Start sessions.** One session per issue, each on its own branch. For the first run, run them one at a time, so you can see how they behave.
8. **Review each merge request** against the issue's acceptance checks, the gates and the manifest. Reject what is out of scope. Ask for rework in the same merge request.
9. **Advance the board.** Move issues by evidence, not by promise.
10. **Run the Focus Shift.** After about four hours on a focus area, stop and change areas on purpose. Write a three-line note: done, learned, next.
11. **Hand to Launch Sequence** when the epic's issues are merged and green (lessons 25 to 27).

When you are comfortable, run **two** sessions at once on issues that touch different files. This is the first step from delegation to orchestration. If two sessions need the same file, that is a sign that the issues were not split well. Fix the split, not the sessions.

## 4. Worked example: TrailMug, epic 1

Maya (the TrailMug PDM) is the Commander. She runs three sessions for one epic.

**Policy extract (`policy/agents.md`):**

```text
Sessions may: read the repository, create a branch, change files in the
issue's scope, run tests, open a merge request.
Sessions may not: merge, change .gitlab-ci.yml, edit anything under
policy/, read or write secrets, change production settings.
If blocked: stop, write BLOCKED.md with what you tried, and wait.
```

**Issues for the epic (each with milestone "Find the nearest café"):**

| Issue | Area label | Who | Gate |
|---|---|---|---|
| Research: how do customers look for a café today | Research | Maya, with an agent to summarise notes | Notes cite sources |
| Design: the café finder screen and empty states | Design | Designer; agent drafts alternatives | Accessibility checklist |
| Implement: API that returns cafés by distance | Implement | Session A | Tests, lint |
| Implement: the finder screen using that API | Implement | Session B (after A merges) | Tests, lint, accessibility check |
| Deliver: release behind a switch, record the change | Deliver | Maya with Session C drafting the change record | Launch Sequence stages, human approval |

**One hand-off brief (Session A):**

```text
Goal: GET /cafes?lat=..&lng=.. returns up to 10 partner cafés ordered by
distance, with name, address and open-now flag.
In scope: the cafes route, its tests, the seed data file.
Out of scope: the app screens, the pipeline, anything under policy/.
Done when: tests in cafes.test pass, the lint step is clean, the OpenAPI
file is updated, and the merge request lists the commands you ran.
Rules: follow AGENTS.md and policy/agents.md. If a decision is needed,
stop and write BLOCKED.md. Add a manifest entry for this change.
```

**What Maya checked.** She read the diff of the route and tests herself, ran the endpoint against the seed data, checked the distance order with two known points, confirmed that no file outside the scope changed, and read the manifest. She rejected the first merge request because it also edited the seed data of another feature, and asked for a rework in the same merge request.

**What stayed with Maya.** Choosing the first epic; setting the policy; approving each merge; deciding to release behind a switch; deciding that a slow finder was acceptable for week one.

## 5. Working with AI agents on this

**Place yourself on the ladder.** Be honest about which rung each task is on. One agent to rename files is rung one. A whole API with a brief is rung two. Three sessions in parallel under a policy file is rung three and four. Do not run rung three without the walls of rung four.

**What the PDM decides.** The policy; which epics are worth building; what each session may touch; whether a change is good enough; when to release.

**What is delegated, with the exact brief.** The issue is the brief (see section 4). Add a standing instruction to every brief: "stop and write BLOCKED.md instead of guessing".

**How to verify.** Read the diff. Run the checks yourself once. Look at what changed outside the scope. Read the manifest. For the first three merge requests, open every changed file.

**Disciplines involved.** Product (epic and measure), design (screens and accessibility), engineering (API and tests), security (policy and gates), operations (release and switch), finance (cost of agent runs against the ORBITAL budget).

**Cost.** Agent runs cost money. Note the spend per epic beside the ORBITAL budget.

For the fleet side (many Commanders, an Admiral, autonomy levels, briefings), continue with the [Agent orchestration](/library/tracks/agent-orchestration/) track.

## 6. Common mistakes and how to avoid them

- **"Hand it to AI" with no policy.** Write the policy first.
- **Rules only in AGENTS.md.** Add pipeline gates; text can be ignored, gates cannot.
- **Issues too big.** If a session needs more than one merge request, split the issue.
- **Two sessions in one file.** Split by file or run them in order.
- **Merging because the pipeline is green.** Green means the checks passed, not that the change is right. Read it.
- **Agents changing the pipeline or the policy.** Make both off limits and enforced by protected paths.
- **Hiding that agents wrote it.** Keep manifests and disclose it (see [Disclose AI use](/library/disclose-ai-use)).
- **No stop condition.** Always give "stop and write it down".
- **Provider lock-in.** Keep the AI adapter behind an interface (the A in PHANTOMS).

## 7. Practice

**Deliverable in git:** on a branch `build-epic-1`, in your capstone repository:

1. `policy/agents.md` (one page) and `AGENTS.md`.
2. The milestone, labels and board described in `docs/gitlab-setup.md`, with a screenshot or a text export.
3. Three to six hand-off issues linked from `docs/epic-1-issues.md`.
4. At least three merged merge requests by sessions, each with a manifest entry and your review comments.
5. `docs/focus-shift-log.md` with your three-line notes.
6. `docs/ladder.md`: which rung each task was on, and one task where you decided **not** to use an agent, with the reason.
7. A merge request description listing the briefs, the gates and what you checked.

## 8. Review checklist

- [ ] A policy file exists and the main branch is protected.
- [ ] `AGENTS.md` exists and matches how the project really works.
- [ ] Each issue is a contract: outcome, scope, out of scope, checks, stop rule.
- [ ] Each merge request has a manifest entry and a human review.
- [ ] No session changed the pipeline, policy or secrets.
- [ ] The PHANTOMS choice is stated, with the reason.
- [ ] The AI adapter is behind an interface.
- [ ] Agent spend is recorded.
- [ ] I know which rung I was on for each task.

**Next:** [lesson 34](/library/tracks/frameworks/34-capstone-launch-sequence-and-mission-control/) launches the epic through the six stages and watches it in Mission Control.
