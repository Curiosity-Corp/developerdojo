---
title: "Quality gates and delivery"
description: "Environments, promotion of one artifact, merge trains and delivery metrics: how a change travels from merge to customer, and how you decide it may."
section: "CI/CD"
order: 3
track: "ci-cd"
level: "core"
duration: "90 min"
outcomes:
  - "Describe the path of a change through test, staging and production environments"
  - "Explain promotion of one artifact, and why rebuilding for production is a risk"
  - "Set quality gates that block, and approvals that a person gives on purpose"
  - "Read the four delivery metrics and say what they tell you and what they do not"
prerequisites:
  - "the-way-five-rules"
resources:
  - "gitlab/environments"
  - "gitlab/merge-trains"
  - "dora/dora-home"
  - "dora/software-delivery-performance-metrics"
  - "continuous-delivery/what-is-continuous-delivery"
  - "gitlab/ci-components"
updated: 2026-11-03
---

Lesson 3 of the CI/CD track. It supports the Master Developer delivery spine, stages "deployment" and "governance", and the Change Record template. Lessons 1 and 2 should come first.

## 1. Why this matters

Passing tests is not the same as being safe to release. Between "the tests are green" and "customers use it" sit decisions: where does the change run first, who looks at it, what must be true before it moves on, and how do we know it worked? Those are product decisions as much as technical ones. They belong to you.

Agents can write the deployment steps. They cannot decide how much risk your customers and your company should accept. This lesson gives you the vocabulary and the questions to set those rules and to check that the pipeline obeys them.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Which gates block, who approves a production release, how fast to ship, what level of risk is acceptable | Writing deploy jobs, wiring environments, summarising what is in a release | Reading the pipeline for gates, watching a change move through each environment, reading the delivery metrics | Operations (can we run it), security (what is exposed), support (what will customers ask), finance (cost of environments), legal (customer commitments) |

## 2. Key ideas, explained

### Environments

An **environment** is a place where the software runs. A typical set:

| Environment | Who uses it | Purpose |
|---|---|---|
| **Review / preview** | The author and reviewers | A temporary copy for one merge request |
| **Test** | Automated checks | Run tests against a running system |
| **Staging** | The team | A near copy of production, for a last look |
| **Production** | Customers | The real thing |

GitLab tracks environments and what is deployed to each; see the [environments documentation](https://docs.gitlab.com/ci/environments/). Not every product needs all four. A static website might need only preview and production. Choose the smallest set that gives you real confidence, because each environment costs money and attention.

### Promotion: one artifact, many places

Lesson 2 introduced the rule: build once, then **promote** the same artifact (identified by its digest) from one environment to the next. What changes between environments is only the **configuration**, such as addresses and keys, never the code.

Why: if you rebuild for production, you are shipping something that nobody tested. Even with the same source, a different day can mean different dependencies. Promotion makes "what we tested" and "what we shipped" the same thing, provably.

### Gates

A **gate** is a condition that must be true before a change moves on. Examples.

| Gate | What it checks | Who or what decides |
|---|---|---|
| Tests green | The checks you wrote | The pipeline |
| Review approved | A second human read it | A person |
| Security scan clean | No known serious problems | The pipeline, with a person for exceptions |
| Staging check | The change works in a near-real place | A person or automated check |
| Production approval | The release is wanted now | A named person |
| Change record complete | The reason and risk are written down | A person |

Gates that cannot block are decoration. Test them by trying to pass a bad change and watching it stop. Write down who may approve each gate and who may bypass it. The answer to "who may bypass" should be "nobody, except through a recorded emergency path".

### Manual versus automatic

**Continuous delivery** keeps software always releasable, with a person pressing the button. **Continuous deployment** removes the button. For a small, low-risk product with excellent tests, automatic is fine. For anything with money, personal data or health in it, keep a human approval for production, at least at first. Read the Continuous Delivery site for the reasoning on both.

### Merge trains and keeping the default branch green

When many changes arrive at once, each can pass on its own and still break when combined. A **merge train** (a GitLab feature, check your plan) tests each change as if it had already been merged with the ones ahead of it in the queue, and only merges if that combined result passes. See the [merge trains documentation](https://docs.gitlab.com/ci/pipelines/merge_trains/). With many agents producing changes, this matters. The idea works even without the feature: after any merge, run the pipeline on the default branch, and treat a red default branch as the team's first priority.

### Release strategies, in plain words

| Strategy | What happens | When to prefer |
|---|---|---|
| **All at once** | New version replaces old | Small products, low risk |
| **Rolling** | Replace a few copies at a time | Most services |
| **Canary** | Send a small share of users to the new version first | Higher risk, you can measure the result |
| **Feature flag** | The new code ships switched off, and you switch it on later | Separate shipping from launching |
| **Blue-green** | Two full copies, switch traffic from old to new | Fast rollback matters |

Each one answers a PDM question: how much of my audience do I expose before I know it works, and how fast can I stop?

### Fix forward, and the fast way back

The Way says **fix forward**: repair with a new reviewed change, never revert shipped work to hide a problem. That works only if you can ship a fix quickly, which is what a healthy pipeline gives you. If the harm is active, for example customers cannot sign up, stop the harm first with a switch, such as turning off a feature flag, and then ship the forward fix. Do not wait for a perfect fix while customers are hurt. See [Fix forward](/library/fix-forward).

### Measuring delivery: the four numbers

The research programme known as DORA identified four measures of software delivery. See the [DORA site](https://dora.dev/) and its [guide to the metrics](https://dora.dev/guides/dora-metrics/).

| Metric | Question it answers |
|---|---|
| **Deployment frequency** | How often do we ship? |
| **Lead time for changes** | How long from commit to running in production? |
| **Change failure rate** | What share of releases cause a problem needing a fix? |
| **Time to restore service** | How long to recover when something breaks? |

Two measure speed, two measure stability. The research argues that they move together in good teams: speed and stability are not a trade. Use them to ask questions, not to rank people. Measure your own team over time, and be careful of "gaming": if a number becomes a target, people can improve the number without improving the work. Compare against your own past, not against other companies. Metrics need real data from real use. A practice project will have few releases and a very small sample, so the numbers show habits more than truth.

### Reusable pipeline parts

Teams do not write each pipeline from scratch. They share **components** or templates, so that the standard gates are the same everywhere and are fixed in one place. GitLab calls these [CI/CD components](https://docs.gitlab.com/ci/components/). For a PDM, the point is governance: put the mandatory gates into shared parts that individual projects include, and protect those shared parts with code owners, so that no single agent can weaken them.

## 3. Step by step: design the path to production

1. **Draw the path** on paper: commit, merge request, pipeline, environments, production. Mark each gate.
2. **For each gate**, write who or what decides, and what failing looks like.
3. **Choose environments.** Keep only what you need.
4. **Decide the release style** for this product and write the reason.
5. **Decide the approval** for production: automatic, or by a named person, and why.
6. **Write the spec** with acceptance criteria that include a failing case at each gate.
7. **Direct an agent** to implement it, plan first, on a branch.
8. **Verify the gates.** Push a change that should be stopped (a failing test, a missing approval). See it stop.
9. **Verify promotion.** Check that the digest in production equals the digest tested.
10. **Write the rollback or switch-off step** and try it once on a harmless change.
11. **Choose which of the four metrics** you will watch, and how you will read them.
12. **Merge** with a change record in the merge request.

## 4. Worked example: TrailMug

TrailMug's site has a preview per merge request and a production site. Maya decides: no staging yet, because the site is small and previews give her what she needs. Production is deployed automatically from the default branch after the pipeline passes, because the site holds no payments and a bad release costs a bad afternoon, not a lost customer. The subscription service, when it exists, will get a human approval, because it will hold payments.

She writes the spec:

```text
Issue 31: previews and production deploy
Acceptance criteria
1. Each merge request gets a preview address, removed when the MR closes.
2. Production deploys only from the default branch, only after lint, unit tests and build pass.
3. The deployed image digest is printed in the job log and equals the digest of the build job.
4. A broken test blocks deploy. I will prove this with a branch.
5. A switch-off step is documented: how to take the site to the maintenance page in under five minutes.
6. No secrets in the pipeline file or the image.
```

She briefs an agent, plan first. The agent's plan includes rebuilding the image in the deploy job "for simplicity". Maya rejects it: criterion 3 requires the same digest. The agent revises the plan to pull the built image by digest. In review she reads the pipeline: one job has `when: manual` missing where she wanted a human gate for the maintenance switch. She asks for it.

Verification: a branch with a broken test; the pipeline stops before deploy. A clean branch; preview appears; merge; production updates; the digests match. She rehearses the maintenance switch once at a quiet hour and times it: three minutes. She writes the notes and attaches them to the MR as the change record.

After a month she looks at her own numbers: eleven releases, median lead time about two hours, two releases needed a quick fix, restore time under an hour both times. She knows eleven is a tiny sample. She writes what she will watch next: lead time, and how long the maintenance switch takes.

## 5. Working with AI agents on this

**What the PDM decides:** the gates, the approvers, the environments, the release style, the rollback rule.

**Delegate:** writing deploy jobs and environment config, drafting release notes from merged issues, summarising pipeline history, proposing which gates are missing.

**Verify:** you push a bad change and watch the gate stop it; you compare digests; you rehearse the switch-off; you read the pipeline for `when: manual`, `allow_failure`, and skipped rules.

**Prompt for a deploy design review:**

```text
Read .gitlab-ci.yml and describe, in a table, every gate before production: the
job, what it checks, whether it can be bypassed, and who decides. List anything
that deploys without passing tests, any job with allow_failure, and any step that
rebuilds an artifact after the test stage. Do not edit the file.
```

**Prompt for release notes:**

```text
From these merged merge requests, write release notes for customers in plain
words: what changed, what to do if anything. Use only the titles and
descriptions below. Do not promise anything that is not stated. Mark any change
that you cannot describe from the text.
```

**Disclose** AI-written deploy steps and release notes in the merge request.

## 6. Common mistakes and how to avoid them

- **Rebuilding for production.** Fix: promote the tested digest.
- **Gates that cannot block.** Fix: prove each one stops a bad change.
- **Approving your own production release.** Fix: a named approver other than the author.
- **Too many environments.** Fix: keep only what gives real confidence.
- **No way to stop the harm.** Fix: write and rehearse the switch.
- **Reading the metrics as a scoreboard.** Fix: use them as questions, compare to your own past.
- **Letting an agent change the shared pipeline parts.** Fix: code owners on them.
- **A red default branch that people ignore.** Fix: fixing it comes first.

## 7. Practice

**Deliverable in git:** `specs/ci-03.md`, `briefs/ci-03.md`, `reviews/ci-03.md`, `docs/release-path.md` and a merge request with the deploy configuration.

1. In `docs/release-path.md`, draw the path to production with every gate, who decides, and the release style, with reasons.
2. Write a spec with at least six acceptance criteria including one failing case for each gate.
3. Brief an agent to implement it. Plan first, and reject any step that rebuilds the artifact.
4. Verify: push a change that should be stopped and record the red result. Compare the digests. Rehearse the switch-off and time it.
5. Record at least one place where the agent's plan was wrong and what you changed.
6. Write which DORA measure you will watch and how you will avoid gaming it.
7. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] The path to production is written down, with each gate and its decider.
- [ ] I proved that a bad change is stopped.
- [ ] The artifact in production is the one that was tested.
- [ ] Production approval is given by a named person other than the author, or I wrote why it is automatic.
- [ ] A switch-off step exists and I rehearsed it.
- [ ] I know what each delivery metric does and does not tell me.
- [ ] The default branch is green.

## 9. Further learning

The environments and merge train pages are the practical references. DORA gives you the research on delivery performance, and the Continuous Delivery site gives the ideas behind it. The components page is for when you have several projects and want the same gates everywhere.
