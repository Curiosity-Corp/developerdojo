---
title: "Bun: the runtime and package manager"
description: "The toolchain under every PHANTOMS app: what a runtime and a package manager are, why one toolchain helps, how the lockfile protects you, and what to ask when an agent adds a dependency."
section: "The PHANTOMS stack"
order: 3
track: "phantoms-stack"
level: "core"
duration: "90 min"
outcomes:
  - "Explain what a runtime, a package manager and a lockfile are in plain words"
  - "Say why PHANTOMS requires one toolchain and what that trade-off costs"
  - "Read the key commands an agent runs and know what each one proves"
  - "Review a dependency change for cost, licence and supply-chain risk"
prerequisites:
  - "the-way-five-rules"
resources:
  - "bun/bun-docs"
  - "bun/bun-guides"
  - "bun/bun-workspaces"
  - "bun/bun-test-runner"
  - "twelve-factor/the-twelve-factor-app"
  - "owasp/top-ten"
updated: 2026-11-03
---

This is lesson 3 of the PHANTOMS track. It supports the Master Developer platform module. Bun has no letter in the acronym, but it sits under every letter. If you understand it, you understand what every agent command in the starter does.

## 1. Why this matters

When you ask an agent to "get the project running", it types a handful of commands. If you cannot read them, you cannot tell whether it did the right thing, or quietly added something you did not choose. Three words cover most of what you need: **runtime**, **package manager** and **lockfile**.

A **runtime** is the program that runs your code. Browsers run JavaScript on web pages. A server needs a runtime too, to run the same language outside the browser. A **package manager** is the tool that downloads the libraries ("packages") your code depends on, and keeps them tidy. A **lockfile** is the file that records the exact version of every package, so every person and every machine gets the same thing.

Why does a product manager care? Because these three things decide **how repeatable your build is, how many tools your team must understand, how quickly checks run (and so what CI costs), and how exposed you are to supply-chain attacks.** A supply-chain attack is when a bad actor slips harmful code into a package your product uses.

PHANTOMS makes one decision here: **Bun is the required runtime and package manager.** The starter's `AGENTS.md` says: "Do not add a second JavaScript runtime or package manager to the development, CI, or deployment path." This lesson explains the reasons and the price.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Whether the team standardises on one toolchain, and the policy for adding dependencies | Installing, running scripts, adding or updating a package, fixing install errors | Reading the lockfile diff, running `bun audit`, checking licences and the reason for each new package | Security (supply chain), finance (CI minutes, build time), operations (images and runtime), legal (licences) |

## 2. Key ideas, explained

### One toolchain, not four

In many JavaScript projects there are several tools: one program to run code, another to install packages, another to run tests, another to turn TypeScript into JavaScript. Each has its own settings and its own way to break. Bun puts these in one program. In the PHANTOMS starter Bun is used for:

| Job | Command you will see |
|---|---|
| Install the exact dependencies | `bun install --frozen-lockfile` |
| Run a script from `package.json` | `bun run lint`, `bun run build` |
| Run a one-off program | `bunx <tool>` |
| Run the tests | `bun test` |
| Start the API | `bun run --watch src/server.ts` (via the workspace script) |
| Check dependencies for known problems | `bun audit --audit-level high` |

Fewer tools means fewer things to teach, patch and debug, and a smaller container image. The Dockerfile for the starter uses a Bun base image for both the build step and the final image.

### The lockfile is a safety document

The starter commits a text lockfile called `bun.lock`. It lists every package and its exact version, including packages your packages need (called **transitive** dependencies). The important command is:

`bun install --frozen-lockfile`

"Frozen" means: install exactly what the lockfile says, and **fail** if `package.json` and the lockfile disagree. CI uses this command in every job. The troubleshooting note in the guide says: do not regenerate the lockfile as an automatic fix. A failing frozen install is a signal. Someone changed a dependency without recording it. Find out who and why.

### The package pin

The root `package.json` contains a field called `packageManager` set to `bun@1.4.2`, and an `engines` rule. This **pins** the toolchain version. Everyone who runs the project, human or agent, uses the same Bun. As reviewed on 2026-10-01, the starter's version policy lists Bun 1.4.2.

### Workspaces

The starter is a **monorepo**: one repository holding several packages. Bun's **workspaces** feature handles it. The root `package.json` says the workspaces are `apps/*` and `packages/*`. The apps are the programs people use (the API and the web page). The packages are shared parts (the database code and the AI adapter). One install at the root sets up everything. Lesson 8 shows how Turborepo runs tasks across the workspace.

### The built-in test runner

`bun test` finds and runs the tests, with no extra framework. The starter keeps this on purpose "to keep the default toolchain small". For browser journeys, the guides point to Playwright, run in a CI job that has a browser.

### The trade-off, stated plainly

Choosing Bun is a decision with a cost, and the starter's decision log (`docs/decisions.md`, entry 001) says so. Some libraries document another runtime as their officially supported server environment. Before you adopt a library, verify it works under the pinned Bun. The starter handles one such case by building the Next.js site as **static files** and using Bun only to build it, rather than running the framework's own server in production. Lesson 7 returns to this.

A second note: one package, `@types/node`, is in the web app, but only because the TypeScript checker needs its type descriptions. It is not an executable dependency. If you see it and worry about a second runtime, the decision log explains why it is there.

## 3. Step by step: how to review any dependency change

When an agent adds or upgrades a package, run through this list. It takes ten minutes and prevents most trouble.

1. **Look at `package.json` and `bun.lock` in the diff.** Is the change what you asked for? A one-package request that adds forty lockfile entries is normal (transitive packages). A request that adds a second runtime or a second package manager is not.
2. **Ask why.** "What does this package do that the platform or an existing package does not?" The starter's rule is: "Do not add a dependency for behavior the platform already provides."
3. **Check the maintainer and age.** Open the package page. Is it maintained? Does it have a history? Beware of look-alike names that differ by one letter, a known attack.
4. **Check the licence.** Is it compatible with your product? See [open source licences](/library/open-source-licences).
5. **Run the audit.** `bun audit --audit-level high` checks the locked graph against known vulnerabilities. A red result blocks the merge.
6. **Check the install is frozen.** CI should run `bun install --frozen-lockfile`. If the agent changed CI to drop `--frozen-lockfile`, reject that.
7. **Record the decision** if the package is significant: a short entry in `docs/decisions.md`.

### Reading the verification commands

The starter's `AGENTS.md` lists the commands an agent must run before handing work over. Know what each proves.

| Command | What a pass proves | What it does not prove |
|---|---|---|
| `bun install --frozen-lockfile` | Dependencies match the lockfile | That the dependencies are safe or wise |
| `bun run lint` | Code follows the formatting and static rules | That the code is correct |
| `bun run typecheck` | Types agree across packages | That the logic is right |
| `bun audit --audit-level high` | No known high-severity issues in the locked graph | That no unknown problem exists |
| `bun test` | The written tests pass | That the tests cover what matters |
| `bun run build` | The app builds | That it is ready for production |

A pass on all of them is the floor, not the ceiling. The starter's own guidance: never claim production readiness from a successful build alone.

## 4. Worked example: TrailMug

Maya's agent finishes the first order tracker and, in its report, says "added a date library for formatting delivery dates". Maya opens the merge request.

She sees `package.json` gained one line, and `bun.lock` gained several. She asks the agent: "Why is a library needed? Does the platform's own date formatting do the job?" The agent admits the built-in formatter is enough for the two formats TrailMug needs. Maya asks it to remove the library. The diff shrinks. One fewer package to patch for the life of the product.

Later, an advisory appears for a package deep in the tree. The weekly audit catches it. Because the lockfile pins everything, the fix is a small, reviewable change: update one version, run the checks, merge. This is the "fix forward" habit from [the Way](/library/fix-forward), made easy by a lockfile.

Sam, the operations lead, notices the CI bill dropping after the team moves to one toolchain and a faster install. He has no numbers yet, so he measures: he writes down the pipeline time before and after, in the merge request. Honest evidence beats a feeling.

## 5. Working with AI agents on this

**What to delegate.** Installing, running scripts, adding a package you approved, updating versions in the monthly refresh, fixing install errors, and writing the dependency change summary.

**What you must do yourself.** Set the policy: one runtime, frozen installs, audit gate. Approve each significant new dependency. Decide when to refresh versions. Own the licence decision.

**A prompt you can adapt:**

> Work in this Bun workspace. Read AGENTS.md first. Task: update the dependencies listed in docs/version-policy.md to the newest stable patch versions only (no major version changes). Use bun and nothing else. Do not regenerate the lockfile blindly; show the lockfile diff summary. Run bun install --frozen-lockfile, lint, typecheck, bun audit --audit-level high, bun test and bun run build, and paste the results. For each updated package, link its release notes and list any breaking change or security note. If any check fails, stop and report; do not weaken a check.

**How to check the output.** Open two or three of the release notes. Confirm there are no major version jumps. Check that no check was disabled or loosened. Confirm the version policy page was updated with the same numbers as the lockfile.

**Disclose.** Say in the merge request that an agent did the update and that you reviewed the release notes. See [disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Letting an agent run `npm install` out of habit.** It creates a second lockfile and a second source of truth. Put the rule in `AGENTS.md`, and let CI fail on a stray `package-lock.json`.
- **Deleting the lockfile to fix a problem.** This hides the cause and changes every version. Fix the real mismatch.
- **Dropping `--frozen-lockfile` in CI.** Then CI no longer proves the build is repeatable.
- **Accepting a new package because it "works".** Ask why it is needed, who maintains it and what its licence is.
- **Updating everything at once.** Refresh in a controlled monthly pass, with release notes, and run all checks.
- **Assuming the runtime is the only risk.** Packages and base images are the usual route in for attackers.

## 7. Practice

**Exercise: "Review a dependency change."**

1. In a clone of the public PHANTOMS starter, create a branch. Ask an agent to add one small utility package of your choice to the API and use it for something trivial. Do not run the agent's work unreviewed.
2. Read the diff of `package.json` and `bun.lock`. Count the lockfile entries added.
3. Run the seven-step review above and write one sentence per step.
4. Decide: keep, replace with platform code, or remove. Ask the agent to do what you decided.
5. Run `bun audit --audit-level high` and `bun test` and note the results.

**Deliverable in git:** a file `docs/reviews/dependency-review-001.md` with your seven answers and your decision, committed on the branch, and a merge request that says what the agent did and what you decided.

## 8. Checklist

- [ ] I can explain runtime, package manager and lockfile in one sentence each.
- [ ] I know why CI uses `--frozen-lockfile`.
- [ ] I know the trade-off of one toolchain, from the decision log.
- [ ] I reviewed a dependency change using the seven steps.
- [ ] I know what each verification command proves and does not prove.
- [ ] My `AGENTS.md` forbids a second runtime or package manager.

## 9. Further learning

The Bun docs and guides cover everything the starter uses: installing, workspaces and testing. Read the workspaces page next to the root `package.json`. The Twelve-Factor App explains why dependencies should be declared and pinned, and the OWASP Top 10 includes vulnerable and outdated components as a standing risk. Both help you ask better questions of an agent.

**Next:** [P is for PostgreSQL](/library/tracks/phantoms-stack/04-p-postgresql/).
