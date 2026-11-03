---
title: "Pipelines from first principles"
description: "What continuous integration and delivery are, why they exist, and how to read a pipeline file so you can judge what it proves."
section: "CI/CD"
order: 1
track: "ci-cd"
level: "foundation"
duration: "75 min"
outcomes:
  - "Define CI, continuous delivery and continuous deployment in plain words"
  - "Name the parts of a pipeline: stages, jobs, runners, artifacts"
  - "Read a short pipeline file and say what it proves and what it does not"
  - "Direct an agent to add a stage and verify it can fail"
prerequisites:
  - "the-way-five-rules"
resources:
  - "martin-fowler/continuous-integration"
  - "continuous-delivery/what-is-continuous-delivery"
  - "gitlab/get-started-with-gitlab-ci-cd"
  - "gitlab/first-pipeline-tutorial"
  - "github/understanding-github-actions"
  - "gitlab/ci-yaml-reference"
  - "microsoft/automate-your-workflow-with-github-actions-part-1"
updated: 2026-11-03
---

Lesson 1 of the CI/CD track. It supports Developer week 4, when merge requests carry proof, and the Master Developer delivery spine. You need to know what a merge request is. See [Git and GitLab](/library/tracks/git-and-gitlab).

## 1. Why this matters

An agent can write a hundred lines of code in a minute. Who checks them? You could read every line, but that does not scale, and reading does not find everything. A **pipeline** is an automatic checker that runs the same checks every time, on every change, without getting tired or being flattered by confident prose.

The pipeline is the thing that turns "the agent says it works" into "the machine shows it works". If you direct agents, the pipeline is your most reliable colleague. Learning to read one is as useful as learning to read a diff.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Which checks must pass before anything ships, who may change the pipeline | Writing and fixing pipeline files, adding checks | Making a check fail on purpose to prove it works, reading the pipeline result | Engineering (what to test), security (what to scan), operations (what to deploy and when), finance (runner cost) |

## 2. Key ideas, explained

### The problem CI solves

Before CI, people worked alone for weeks and then tried to join their work together. The joining was painful and full of surprises. **Continuous integration** (CI) means joining work in small pieces, often, and checking each join automatically. Martin Fowler's classic essay [Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html) puts the core habits plainly: integrate often, keep the build automatic and fast, and fix a broken build before anything else.

### Three names that sound alike

| Term | Meaning |
|---|---|
| **Continuous integration** | Every change is built and tested automatically when it is proposed or merged |
| **Continuous delivery** | The software is always in a state that could be released, and releasing is a button, not a project |
| **Continuous deployment** | Every change that passes goes to production automatically, with no manual step |

The site [continuousdelivery.com](https://continuousdelivery.com/) explains delivery well. Many teams practise delivery with a human deciding when to press the button. Continuous deployment needs excellent tests and fast recovery. Do not treat it as the goal for every product.

### The parts of a pipeline

A **pipeline** is the whole automated process for one change. It has these parts.

| Part | What it is |
|---|---|
| **Stage** | A phase, such as `lint`, `test`, `build`, `deploy`. Stages run in order. |
| **Job** | One task inside a stage, such as "run the unit tests". Jobs in the same stage can run in parallel. |
| **Runner** | The machine or container that actually runs a job |
| **Trigger** | What starts the pipeline: a push, a merge request, a schedule |
| **Artifact** | A file produced by a job and passed to later jobs or kept for download, such as a built website |
| **Environment** | A place where the software runs, such as test, staging or production |
| **Status** | Pass or fail, shown on the merge request |

In GitLab, the pipeline is defined in a file at the root of the repository called `.gitlab-ci.yml`. Because it is a file in git, it is reviewed like code and changes through merge requests. GitHub Actions uses workflow files in a folder, with the same ideas; GitHub's [Understanding GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions) describes them.

### Reading a pipeline file

Here is a small, realistic pipeline for a website:

```yaml
stages:
  - lint
  - test
  - build

lint:
  stage: lint
  image: node:22
  script:
    - npm ci
    - npm run lint

unit-tests:
  stage: test
  image: node:22
  script:
    - npm ci
    - npm test

build-site:
  stage: build
  image: node:22
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
```

You can read this without knowing YAML in depth. Ask these questions.

1. **What are the stages, in order?** lint, test, build.
2. **What does each job run?** `npm run lint`, `npm test`, `npm run build`.
3. **What image does it run in?** `node:22`, a container with a certain Node version. Is the version pinned? Is it current?
4. **What is passed on?** The `dist/` folder, as an artifact.
5. **What is missing?** No security scan. No deploy. No check that the build output is correct.
6. **When does it run?** No `rules` are shown, so GitLab applies its default. Look for rules that say "only on merge requests" or "only on the default branch".

The [GitLab CI/CD getting started page](https://docs.gitlab.com/ci/) and the [first pipeline tutorial](https://docs.gitlab.com/ci/quick_start/) take you through the same file step by step, and the [YAML reference](https://docs.gitlab.com/ci/yaml/) lists every keyword. You will search it, not memorise it.

### What a green pipeline proves

A passing pipeline proves exactly this: the checks it contains passed. It does not prove the software is good. If there are no tests, a green pipeline proves nothing but that the files can be assembled. This is the most common false comfort. Always ask: **what would make this pipeline fail, and is that the failure I care about?**

### Fast feedback

A pipeline that takes an hour will be ignored. Aim for the first useful signal in minutes: lint and unit tests first, slower checks later. Fail early. Fowler's essay and the Continuous Delivery site both argue for this.

### Pipelines as code

Because the pipeline is a file, an agent can write and change it. That is powerful, and a risk: an agent can also weaken it, by deleting a test job to make a failing pipeline green. Treat changes to the pipeline file as high-attention changes in review, and protect them (for example with a code owner). Lesson 4 returns to this.

## 3. Step by step: read and extend a pipeline

1. **Open `.gitlab-ci.yml`** (or the workflow file) in your repository.
2. **List the stages and jobs** on paper.
3. **Write one line for each job:** what it proves.
4. **Write what is missing.** Tests? Security scan? Build check?
5. **Find the triggers.** When does this run? On merge requests?
6. **Open the latest pipeline in the web page.** Find a job log. Read the last twenty lines.
7. **Pick one gap.** For example, "no test stage".
8. **Write a spec** for closing the gap, with acceptance criteria that include a failing case.
9. **Direct an agent** to add the stage on a branch and open a merge request.
10. **Prove the check can fail.** In the branch, break the code on purpose, push, and see the pipeline go red. Then fix and see it go green.
11. **Merge** after review.

## 4. Worked example: TrailMug

Maya's `trailmug-site` has a pipeline with only `build-site`. She reads it: one stage, one job, produces `dist/`. Her notes: "This proves the site assembles. It proves nothing about behaviour. A broken phone check would still be green."

She writes a spec:

```text
Issue 18: add lint and unit tests to the pipeline
Acceptance criteria
1. A job `lint` runs `npm run lint`, and a job `unit-tests` runs `npm test`.
2. Both run on every merge request and on the default branch.
3. Build runs only if both pass.
4. If I break a test on purpose, the pipeline fails and the merge request cannot merge.
5. Node version is pinned to the same major version as local development.
6. No change to application code.
```

She briefs an agent: "Plan first. Edit only `.gitlab-ci.yml`. Show me the diff. Explain each keyword you use." The agent proposes the file shown above, plus rules for merge requests. Maya notices it also added `allow_failure: true` to the lint job. She asks why. "So lint does not block." She rejects it: a lint job that cannot fail proves nothing. The agent removes it.

Verification: Maya makes a branch, changes one expected value in a test, pushes. The pipeline fails at `unit-tests` and the merge request shows the red status with the merge button disabled. She reverts that experiment on the branch and confirms green. Now she knows the gate works because she saw it close. Merge, record, move on.

## 5. Working with AI agents on this

**What the PDM decides:** which checks are mandatory, that failures block merging, and who may change the pipeline file.

**Delegate:** writing the pipeline file, adding jobs, explaining keywords, reading a failing job log and proposing a fix.

**Verify:** make the check fail on purpose and watch the pipeline respond. Look for `allow_failure`, deleted jobs, skipped rules, or tests that cannot fail.

**Prompt to add a stage:**

```text
Edit only .gitlab-ci.yml on the current branch. Add a job "unit-tests" in stage
"test" that runs `npm ci` and `npm test`, and a job "lint" that runs `npm run lint`.
Run on merge requests and on the default branch. Do not use allow_failure.
Pin the Node image to major version 22. After the diff, explain each keyword in
one line, and list anything you assumed. Do not change application code.
```

**Prompt to explain a failing job:**

```text
Here is the log of a failed job. Explain in plain words what failed and the most
likely cause. Propose the smallest fix. Say what you are unsure about, and what I
should check before accepting the fix. Do not edit the tests to make it pass.
<paste log tail>
```

**Disclose** in the merge request that an agent wrote the pipeline change and that you proved it fails when it should.

## 6. Common mistakes and how to avoid them

- **Trusting a green pipeline with no tests.** Fix: ask what would make it fail.
- **`allow_failure` on important jobs.** Fix: remove it, or label it clearly as a warning job.
- **Deleting or skipping a failing job.** Fix: review pipeline changes with extra care.
- **Slow pipelines.** Fix: fast checks first, cache, parallelise (lesson 2).
- **Unpinned images** that change under you. Fix: pin versions.
- **A pipeline nobody understands.** Fix: ask the agent to explain, and keep the file short.
- **Deploying from a laptop.** Fix: deploy only from the pipeline.

## 7. Practice

**Deliverable in git:** `specs/ci-01.md`, `briefs/ci-01.md`, `reviews/ci-01.md`, and a merge request with the pipeline change.

1. In your practice repository, read the pipeline file (or create a trivial one with a `build` job). In `reviews/ci-01.md` write a line per job: what it proves, and a list of what is missing.
2. Write a spec to add one missing check, with at least five acceptance criteria, one of which says the pipeline must fail on a broken input.
3. Brief an agent to make the change on a branch, plan first.
4. Verify: read the diff, then break something on purpose and show the red pipeline (link or screenshot description). Restore and show green.
5. Record anything the agent did that weakened the pipeline and how you caught it.
6. Merge with an approval from someone else, and a disclosure block.

## 8. Checklist

- [ ] I can say what CI, delivery and deployment mean.
- [ ] I can list the stages and jobs of my pipeline and what each proves.
- [ ] I know what is missing from it.
- [ ] I proved a check can fail.
- [ ] The merge button is blocked on red.
- [ ] I looked for `allow_failure` and removed jobs in review.
- [ ] My spec, brief and review notes are committed.

## 9. Further learning

Read Fowler's essay and the Continuous Delivery page for the ideas. Then work through the GitLab tutorial hands-on. Keep the YAML reference as a search tool. The GitHub Actions overview and the Microsoft GitHub Actions path are useful if you work with GitHub.
