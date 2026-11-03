---
title: "T is for Turborepo"
description: "How a repository with several packages runs its build and check tasks in the right order and skips work it has already done, and why that matters for speed, CI cost and safe agent changes."
section: "The PHANTOMS stack"
order: 8
track: "phantoms-stack"
level: "core"
duration: "80 min"
outcomes:
  - "Explain a monorepo, a task graph and a cache in plain words"
  - "Read the starter's turbo.json and say what each task does"
  - "Judge whether an agent wired a new package into the graph correctly"
  - "Weigh the speed and cost benefits of caching against its risks"
prerequisites:
  - "the-way-five-rules"
resources:
  - "turborepo/turborepo-introduction"
  - "turborepo/turborepo-running-tasks"
  - "turborepo/turborepo-caching"
  - "bun/bun-workspaces"
  - "gitlab/create-your-first-ci-cd-pipeline"
  - "twelve-factor/the-twelve-factor-app"
updated: 2026-11-03
---

This is lesson 8 of the PHANTOMS track. It supports the Master Developer modules on platform and production launch, and it connects to the CI/CD track. T is the quiet letter: you will rarely see it, but it decides how long every check takes, and so how much waiting and how much CI money your product burns.

## 1. Why this matters

When a product has several parts, the order of work matters. The web app needs the shared packages built first. The type check of the API needs the database types. If an agent changes only the documentation, you do not want to rebuild the whole product.

A repository that holds several apps and packages together is a **monorepo**. The PHANTOMS starter is one: two apps (`api` and `web`) and two packages (`db` and `ai`). A monorepo is convenient, because one change can touch several parts and be reviewed once. It also creates a problem: how do we run the right tasks, in the right order, without repeating work?

**Turborepo** solves this. It reads a small file that describes the **tasks** (build, type check, dev) and how they depend on each other, then runs them in the right order, in parallel when it can, and **remembers** the results. If nothing relevant changed, it replays the saved result instead of running the task again.

Why would a manager care? Three reasons.

- **Speed.** Shorter checks mean faster feedback for people and agents. Agents run the checks many times. A slow loop slows everything.
- **Cost.** CI (the automatic checks on every change) is billed by the minute or by the machine. Skipping repeated work lowers the bill.
- **Safety.** One command that runs the same tasks locally and in CI means "works on my machine" turns into "works the same everywhere".

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Whether the product is one app or a set of packages, the speed target for checks, whether to share a cache | Adding packages, wiring tasks, fixing graph errors, tuning outputs | Reading `turbo.json`, running the root commands from a clean clone, checking CI time before and after | Finance (CI cost), operations (pipeline reliability), security (what a cache stores and who can read it), engineering leads (developer wait time) |

## 2. Key ideas, explained

### The task graph

A **task graph** is a map of "this task must wait for that task". The starter's `turbo.json` is short enough to read in a minute. In plain words:

| Task | What it says |
|---|---|
| `build` | Before building a package, first build the packages it depends on (`^build`). Save the outputs from `.next`, `out` and `dist` folders, but not the framework's own cache folder. |
| `typecheck` | Before type checking a package, first type check what it depends on (`^typecheck`). |
| `dev` | Never cache it. It is a long-running process. |

The little `^` means "the same task, in my dependencies". So when `apps/api` depends on `packages/db`, building the API first builds the database package. Nobody writes that order by hand. The graph comes from each package's own dependency list plus the rules in `turbo.json`.

### Outputs and caching

For each task Turborepo computes a **fingerprint** from the task's inputs: the source files, the dependencies, some settings. If the fingerprint matches one it has seen, the task is a **cache hit**. It replays the saved log and restores the saved **outputs**. That is why `turbo.json` lists outputs: if a build produces files that are not listed, a cache hit would restore the log but not the files, and the next step could fail in a confusing way.

The key habit for review: **a cache is only as correct as the list of what goes in and what comes out.** If a task reads an environment variable that is not accounted for, a cache hit might replay a result built with different settings. Turborepo's caching documentation explains how to declare these.

### Local and remote caches

By default the cache is local to a machine. A **remote cache** shares it between people and CI machines, which makes a clean CI run fast. It is also a service that stores your build outputs. Treat it as you would any storage of company data: who can read it, who can write to it, what could be inside, and how long it is kept. The starter does not enable a remote cache. The guides ask you to keep production credentials out of merge request pipelines, and a shared cache is one more place where that rule applies.

### The commands people and agents run

The root `package.json` wires the graph to simple commands:

| Command | What it does | Uses Turborepo? |
|---|---|---|
| `bun run dev` | Starts the web app and API in parallel for development | Yes |
| `bun run build` | Builds every package in order | Yes |
| `bun run typecheck` | Type checks every package in order | Yes |
| `bun run lint` | Runs the formatter and linter once over the repo | No, runs directly |
| `bun test` | Runs every test with Bun's runner | No, runs directly |

Notice that not every task is in the graph. A tool that is quick and runs once over everything does not need to be. A good review question for any agent-added task: *does this belong in the graph, or is it a single fast command?*

### One command set for people and CI

The CI guide says: "CI owns the order and environment; the repository owns the commands." The same commands run on a laptop and in the pipeline. An agent that proposes a CI job with its own special commands is creating drift: what CI checks is no longer what a person checks. Keep CI thin and the commands in the repository.

### Pinned, not floating

Turborepo is a development dependency pinned at 2.11.6 in the version policy, not a global tool installed by whoever remembers. The starter's reason: a floating CLI makes builds differ between machines.

## 3. Step by step: how to review a graph change

When an agent adds a package or a task, work through these steps.

1. **Draw the dependency.** Write "A depends on B" for each new link. Does it make sense? Does the web app depend on the API's code? It should not.
2. **Read `turbo.json`.** For a new task, are `dependsOn`, `outputs` and caching settings stated?
3. **Check outputs.** Do the listed output folders match what the task really writes? An unlisted output is a cache bug waiting to happen.
4. **Check long-running tasks.** A development server must be non-cached and persistent.
5. **Run from clean.** Clone fresh, install with the frozen lockfile, run `bun run build` and `bun run typecheck` twice. The second run should be much faster, and the output should show cache hits.
6. **Check CI.** CI should call the same root commands. Compare the pipeline time before and after, and write both numbers down.
7. **Check secrets.** A shared cache or a build step must not receive production credentials in a merge request pipeline.
8. **Record the decision** if you add a remote cache or a significant new package.

## 4. Worked example: TrailMug

The order tracker is growing. Maya's agent proposes a new shared package, `packages/orders`, holding the order types and the status rules, so both the API and the web page can use them.

Maya reads the proposal as a dependency drawing:

```
packages/orders  <-  apps/api
packages/orders  <-  apps/web
packages/db      <-  apps/api
```

It is sensible: the rules live in one place, and neither app depends on the other. She asks one question: "Could the order rules ever need the database?" The agent says no, they are pure rules. Good. Packages with no dependencies on stateful things are easy to test and cache.

The agent updates the workspace and adds a `typecheck` and `build` for the new package. Maya runs from a clean clone. The first `bun run build` takes a while. She runs it again straight away and sees the cache hits on every package. She then edits only a comment in the web page and runs it a third time. Only the web app rebuilds. That is the benefit, shown with her own eyes.

Sam, the operations lead, looks at the CI timings in the merge request: the pipeline took longer on this branch, because the first run has no cache. He asks the right question: "Does CI share a cache between runs?" Today it does not, and Maya records "revisit a shared cache when pipeline time passes our target" in the roadmap. She does not enable a remote cache yet, because that would be another store holding build outputs that needs an access and retention decision.

## 5. Working with AI agents on this

**What to delegate.** Creating a package, wiring the graph, declaring outputs, fixing "task not found" and circular dependency errors, measuring time before and after.

**What you must do yourself.** Decide the shape of the product (which parts exist and what may depend on what). Set the speed and cost targets. Decide whether to use a remote cache and who may read it.

**A prompt you can adapt:**

> Work in the PHANTOMS starter. Read AGENTS.md and turbo.json first. Task: create a new workspace package packages/orders that exports the order status type and a function that says whether a status change is allowed (forward only: placed, packed, shipped, delivered). Rules: the package must not depend on packages/db or on any app; wire build and typecheck into the existing task graph with correct outputs; use Bun only; keep the root commands unchanged. Add tests for every allowed and every refused change. Then run bun run build and bun run typecheck twice from a clean install and paste both runs' summary lines, so I can see cache hits. Do not enable remote caching. Report what you could not verify.

**How to check the output.** Draw the dependency arrows yourself. Confirm that the second run shows cache hits. Check that CI still calls the same root commands.

**Disclose.** Say in the merge request that an agent created and wired the package, and include your measurements. See [disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Circular dependencies.** If A depends on B and B on A, the graph cannot run. Keep rules in a package that depends on nothing.
- **Unlisted outputs.** A cache hit then restores less than the next step needs. Declare outputs.
- **Caching a dev server.** It never finishes. Mark it as not cached and persistent.
- **CI with private commands.** Then CI checks something different from what people check. Use the root commands.
- **Enabling a remote cache casually.** It is a store of build outputs. Decide who can read and write it.
- **Putting everything in the graph.** Quick one-shot tools may run directly.
- **Believing a fast build means a good product.** Speed only shortens feedback.

## 7. Practice

**Exercise: "Draw it, then prove the cache."**

1. In a clone of the public starter, draw the dependency graph of the four workspaces on paper. Photograph it.
2. Run `bun run build` twice. Save the summary line of each run. Change only a comment in `apps/web` and run once more. Save that too.
3. Write three sentences: what ran, what was skipped, how you know.
4. Brief an agent to add one small package with the prompt above. Review it with the eight steps.
5. Write the target you would set for your product's pipeline time and what you would do if you missed it.

**Deliverable in git:** `docs/reviews/task-graph-001.md` with your drawing, the three run summaries, your review notes, and a merge request describing what the agent did.

## 8. Checklist

- [ ] I can draw the starter's package dependencies.
- [ ] I know what `^build` means and why outputs are listed.
- [ ] I saw cache hits with my own eyes.
- [ ] CI calls the same root commands as people do.
- [ ] I know why a remote cache needs an access decision.
- [ ] I measured pipeline time before and after a change.

## 9. Further learning

The Turborepo introduction and "Running tasks" pages explain the graph, and the "Caching" page explains fingerprints, outputs and why caches can be wrong. Bun's workspaces page covers the layer underneath. Take the GitLab first-pipeline tutorial to see how CI runs the same commands, and read the Twelve-Factor App's notes on keeping development and production alike.

**Next:** [O is for OpenClaw](/library/tracks/phantoms-stack/09-o-openclaw/).
