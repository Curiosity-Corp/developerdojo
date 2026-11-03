---
title: "ANDROID focus areas 5 to 7: Optimize, Implement, Deliver"
description: "The last three ANDROID Ops focus areas in depth: measure and improve, build and test with agents under your direction, and release and support with proof."
section: "Frameworks"
order: 22
track: "frameworks"
level: "core"
duration: "60 min"
outcomes:
  - "Describe the objective, activities and evidence for Optimize, Implement and Deliver"
  - "Write a measure for a feature before it is built, and an acceptance test an agent can build to"
  - "Explain what a human must review before an agent's change is released"
resources:
  - "dora/software-delivery-performance-metrics"
  - "martinfowler/continuous-delivery"
  - "atlassian/continuous-delivery"
  - "google/sre-service-level-objectives"
  - "microsoft/mlops-model-management"
  - "gitlab/docs-merge-request-pipelines"
prerequisites:
  - "21-android-focus-areas-advance-network-design-research"
updated: 2026-11-03
---

**Dojo programme link:** Implement and Deliver support the Master Developer modules on platform and production launch, and the demo in Developer week 6. Optimize is the thread that connects the roadmap of week 3 to the evidence of epic management in the Product Package.

## 1. Why this matters

The first four areas decide what is worth building. The last three make it real and keep it good. This is where AI agents give a Product Development Manager (PDM) the largest lift: they write code, tests, documents and release notes at speed. It is also where careless work causes real harm: a broken sign-up, a leaked key, a cup scan that charges the wrong café.

So the question for these three areas is not "how do I build faster?" It is "how do I build quickly **and** know it is right?" The answer is the same in all three: **decide the measure first, write the check before the work, and review what comes back**.

## 2. Key ideas, explained

### 2.1 Optimize: measure, then improve

**Objective.** Continuously evaluate and refine how the product and the work run, to raise efficiency, productivity and quality.

**Activities.**

- *Performance measures.* Choose a few **key performance indicators (KPIs)**: numbers that tell you whether the product is doing its job. Fewer is better.
- *Algorithm tweaks.* If your product uses rules or models (for example ranking, matching, a language model prompt), tune them using test data and compare results before and after.
- *Process automation.* Replace repeated manual work with automation. This is where lesson 21's list of routine tasks gets acted on.
- *Continuous improvement.* Regular review of results and feedback, with changes planned as small items.

**Who does what.**

| Role | Part in Optimize |
|---|---|
| Product | Chooses the measure, decides what to improve next |
| Data or finance | Builds the numbers, checks they are honest |
| Operations | Provides process and service numbers |
| Engineering | Tunes performance, reliability and cost |
| Design and marketing | Test variations (words, layouts, offers) |

**Which numbers.** Start with three kinds:

1. **Customer outcome**: is the person getting what they came for? For TrailMug, time to return a cup.
2. **Delivery health**: how well the team ships. The research programme DORA names [software delivery measures](https://dora.dev/guides/dora-metrics-four-keys/): change lead time (commit to production), deployment frequency, failed deployment recovery time, change fail rate, and deployment rework rate. Use them for learning, not to rank people.
3. **Reliability**: is the product up and fast enough? The Google SRE book chapter on [service level objectives](https://sre.google/sre-book/service-level-objectives/) explains how to set a target such as "99.5 percent of cup scans succeed in a month".

**If your product uses AI.** Add a fourth: **quality of the AI part**. You need a fixed set of test cases with known good answers, a score, and a rule such as "no release if the score drops". This is the MLOps habit. Microsoft's [MLOps overview](https://learn.microsoft.com/en-us/azure/machine-learning/concept-model-management-and-deployment) explains it.

**The PDM's part.** You pick the measure **before** the build and write it into the epic. Otherwise people pick the number that makes the work look good. You decide what you will do if the measure is bad. You decide when "good enough" is reached and stop.

**The agent's part.** Agents can pull data from reports, write queries, draw charts, and propose experiments. They can run a test set against a prompt and compare scores. They should not decide which measure matters, and they should not be graded by a measure they can edit.

```text
Read docs/measures.md. For each measure, write the query or script that
computes it from the data in ./data/sample/. Put each script in
scripts/measures/. Add a test with a hand-computed expected value. Do
not change the measure definitions. If a definition is unclear, stop and
ask me.
```

**Check it.** Compute one measure by hand from five rows and compare. If the agent's script and your hand count differ, the script is wrong.

**Evidence in git.** `docs/measures.md` (name, definition, source, owner, target, review date), the scripts, and a `docs/reviews/` folder with dated notes of what was learned and what changed.

**Skill tracks.** [Observability and service management](/library/tracks/observability-and-service-management/), [Agile delivery](/library/tracks/agile-delivery/), and [Working with AI agents](/library/tracks/working-with-ai-agents/) for evaluating agent work.

### 2.2 Implement: build, test and integrate

**Objective.** Carry out the optimised plan with automation and digital tools, and prove the result works.

**Activities.**

- *Quality assurance (QA).* Test that the work does what it should: automated tests, review, checks.
- *User acceptance testing (UAT).* Real users try the work and confirm it fits their need.
- *Training and support.* People who will use or run the new thing learn how.
- *Integration.* New work joins existing systems without breaking them.

**Who does what.**

| Role | Part in Implement |
|---|---|
| PDM | Writes the specification and acceptance criteria; directs agents; reviews |
| Engineers and agents | Write and test the code and configuration |
| Designer | Checks the build matches the design and works for the audience |
| QA and users | Run UAT and report |
| Security | Reviews risks, scans, access |
| Operations | Prepares to run it |
| Marketing and support | Learn the change before customers do |

**The PDM's part.** This is the heart of the 2030 PDM role. You do five things:

1. **Specify.** What the change does, who it is for, what it must never do. In plain sentences.
2. **Write acceptance criteria.** Testable statements such as "Given a valid cup code, when the barista scans it, then the return is recorded and the screen shows green within two seconds."
3. **Break work into agent-sized tasks** that can be reviewed in one sitting, each in its own branch and merge request.
4. **Review.** Read the diff (the list of changes). You are not checking every line of syntax. You are checking: does it do what the specification says, does it touch only what it should, are there tests for the acceptance criteria, does it add a new dependency or a new place data goes, does it look like a pattern the team already uses?
5. **Decide to merge.** Only when the pipeline is green and the review is done.

**The agent's part.** Write code and tests to the specification, update documents, propose refactors, answer questions about the code, run the checks, and report what it did. The standard operating rule is that an agent works in a **branch**, changes **only what its task names**, and **explains its changes in the merge request**.

```text
Task: implement acceptance criteria AC-1 to AC-4 in issue #41
(cup return scan). Work on branch feat/return-scan.
Rules:
- Change only files under src/returns/ and tests/returns/.
- Write the failing tests first, then the code.
- Do not add dependencies. If you think one is needed, stop and say why.
- Never print or log cup codes or customer emails.
- When done, write the merge request description: what changed, how to
  test it by hand, what you were unsure about.
```

**Check it.** Open the diff. Check the file list matches the rule. Run the tests yourself or confirm the pipeline did. Ask the agent to explain the riskiest line in plain words. If it cannot, treat that as a warning.

**Evidence in git.** Merge requests with descriptions, test files, UAT notes in the issue, and pipeline results. The [change record template](/library/template-change-record) turns a merge request into the formal record.

**Skill tracks.** [CI/CD](/library/tracks/ci-cd/), [Git and GitLab](/library/tracks/git-and-gitlab/), [Security fundamentals](/library/tracks/security-fundamentals/), [Infrastructure as code](/library/tracks/infrastructure-as-code/), and the [PHANTOMS stack](/library/tracks/phantoms-stack/) for a ready starting point that agents can scaffold.

### 2.3 Deliver: release, support and learn

**Objective.** Deliver value to customers through efficient and effective operation.

**Activities.**

- *Release management.* Decide what goes out, when, to whom, and how to take it back.
- *Value delivery.* Check that what shipped meets expectations for quality, function and usability.
- *Customer feedback.* Listen after release, in a way you can act on.
- *Post-delivery support.* Fix problems, answer questions, keep it running.

**Who does what.**

| Role | Part in Deliver |
|---|---|
| PDM | Go or no-go decision; owns the release record |
| Engineering and agents | Run the release pipeline, prepare rollback |
| Operations | Watches the live product, handles incidents |
| Marketing | Announces and explains the release |
| Support | Hears customers and passes patterns back |
| Finance | Confirms pricing and billing are correct |

**The PDM's part.** You own the **go or no-go**. A small, frequent, reversible release is almost always better than a large one. You decide who sees it first (one café, ten percent of users, staff only). You write down how to undo it before you do it. You decide what feedback counts and who reads it. The [fix forward](/library/fix-forward) rule applies: when something is wrong, you repair it with a new change, and keep a clear record. You do not hide the old one.

**The agent's part.** Run the release steps, produce release notes from merged changes, draft customer announcements for your review, group support messages by theme, and draft fixes for reported bugs. Keep a human in the approval step for production, for money and for messages to customers.

```text
From the merge requests merged since tag v0.3.0, write release notes
for customers in plain words, grouped as New, Better, Fixed. Do not
mention internal tools or ticket numbers. Then list, separately, the
three changes with the highest risk and why. Output two sections.
```

**Check it.** Compare each line of the customer notes with its merge request. Any line you cannot match is deleted.

**Evidence in git.** Release records (tag, notes, who approved), a rollback note, feedback summaries, and a closed-loop issue for each bug. Lessons 25 to 28 of this track show how a full pipeline turns these into automatic gates: see [Launch Sequence](/library/tracks/frameworks/25-launch-sequence-six-stages/).

**Skill tracks.** [CI/CD](/library/tracks/ci-cd/), [Kubernetes and GitOps](/library/tracks/kubernetes-and-gitops/), [Cloud platforms](/library/tracks/cloud-platforms/) and [Observability and service management](/library/tracks/observability-and-service-management/).

## 3. Step by step: one change through areas 5 to 7

1. **Before building (Optimize).** Write the measure and target in the epic.
2. **Specify (Implement).** Write acceptance criteria as Given, When, Then statements.
3. **Split.** Make small issues, each with one branch and one merge request.
4. **Direct.** Give each agent a brief with files it may change, rules and the definition of done.
5. **Verify.** Pipeline green, you read the diff, a user or a teammate tries it (UAT).
6. **Release (Deliver).** Roll out to a small group. Keep a rollback note.
7. **Watch.** Look at the measure for a fixed period.
8. **Learn.** Write three lines in `docs/reviews/`: what we expected, what happened, what we change. Feed this to Research and Advance.

## 4. Worked example: TrailMug cup return scan, part two

Maya's epic from lesson 21 says: "Return a cup in under ten seconds at the counter."

- **Optimize.** She writes the measure in `docs/measures.md`: median time from scan to green screen, target under ten seconds in the café trial, and a reliability target of 99 percent of scans recorded. These numbers are fictional.
- **Implement.** She writes four acceptance criteria. She splits the work into three issues: the API that records a return, the counter page, and the log of failed scans. She gives each to an agent with a brief like the one above. She reviews three merge requests. In the second, the agent added a new library to read QR codes. Her rule says stop and ask, so she checks the library's licence and its OpenSSF Scorecard (see [lesson 26](/library/tracks/frameworks/26-supply-chain-and-artifact-security/)), and accepts it.
- **Deliver.** She releases to Leo's café only. She has a one-line rollback: switch the counter page back to the manual form. The next day Leo reports that scans fail on cups with scratched codes. She files an issue, directs an agent to add a manual entry fallback, reviews it and releases again.
- **Learn.** Her review note says: median time was above target on busy days; the cause was typing the café code. She adds a research question for the next cycle.

## 5. Working with AI agents on this

Three rules cover most of the risk:

1. **Small tasks, separate branches, human review.** The size of a task is the size you can review properly.
2. **Tests are your contract.** Ask the agent to write the failing test first. Read the tests before the code. If the tests are weak, the code is not proven.
3. **Agents cannot approve their own work.** Use the platform to enforce it. GitLab's [merge request approvals](https://docs.gitlab.com/user/project/merge_requests/approvals/) can require a human, and [merge request pipelines](https://docs.gitlab.com/ci/pipelines/merge_request_pipelines/) run checks before merging. Some features depend on your plan.

If your agents work in parallel, assign them non-overlapping files. When two touch the same file, merge one first and re-run the other on the new base.

Always [disclose AI use](/library/disclose-ai-use) in the merge request and in the release record.

**From delegating to orchestrating.** Optimize, Implement and Deliver are where many sessions can run in parallel. That is orchestration, and it needs a policy that says what a session may change, hooks that stop known mistakes, and gates for tests and release. The [Agent orchestration](/library/tracks/agent-orchestration/) track covers these.

## 6. Common mistakes and how to avoid them

- **Choosing the measure after the result.** Write it before.
- **Too many measures.** Three is enough to start.
- **Reading only the summary.** Open the diff.
- **Letting an agent expand its scope.** "While I was there I also changed..." is a stop sign.
- **A big-bang release.** Release small, to few people, with a rollback.
- **Ignoring feedback because it is messy.** Feedback is the input to the next Research.
- **No AI quality check for an AI feature.** Build the test set before the feature.

## 7. Practice

**Deliverable in git:** a branch `focus-areas-5-to-7` containing:

1. `docs/measures.md` with three measures for one feature (definition, source, target, how often reviewed).
2. `docs/acceptance/<feature>.md` with at least four Given, When, Then criteria that you wrote.
3. One merge request created by directing an agent from your brief, with its diff reviewed by you. In the merge request description add "Review notes": what you checked, what you changed, what you rejected.
4. `docs/releases/<version>.md` with the rollout plan, the rollback note and the go or no-go reasoning.
5. `docs/reviews/<date>.md` with three lines: expected, happened, change.

## 8. Checklist

- [ ] The measure is written before the build, and I can compute it by hand once.
- [ ] Acceptance criteria are testable and written by me.
- [ ] Each agent task has a branch, a scope, rules and a definition of done.
- [ ] I read the diff and the tests, not only the summary.
- [ ] A human approved the merge and the release.
- [ ] A rollback note exists.
- [ ] Feedback went back into Research and Advance.
- [ ] AI use is disclosed.

**Next:** [lesson 23](/library/tracks/frameworks/23-droid-ops-for-programs-and-content/) shows the lighter DROID Ops loop, using the Dojo itself as the example.
