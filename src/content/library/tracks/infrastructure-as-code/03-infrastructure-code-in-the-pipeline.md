---
title: "Infrastructure code in the pipeline"
description: "Plan on every merge request, apply only after approval, in a pipeline with protected branches and narrow credentials: how infrastructure changes safely, with or without agents."
section: "Infrastructure as code"
order: 3
track: "infrastructure-as-code"
level: "core"
duration: "80 min"
outcomes:
  - "Describe a safe pipeline for infrastructure: validate, plan on the merge request, apply after merge and approval"
  - "Explain why apply credentials belong to the pipeline and not to people or agents"
  - "Explain where protected branches, approvals and gates bound agent work"
  - "Direct an agent to build the pipeline and verify that it cannot apply early"
prerequisites:
  - "the-way-five-rules"
resources:
  - "gitlab/iac-with-opentofu-and-gitlab"
  - "gitlab/gitlab-managed-terraform-state"
  - "hashicorp/terraform-plan-command"
  - "opengitops/principles"
  - "hashicorp/terraform-tutorials"
  - "gitlab/merge-requests"
updated: 2026-11-03
---

Lesson 3 of the Infrastructure as code track. It joins this track to CI/CD lessons 3 and 4, and to the governance stage of the Master Developer delivery spine.

## 1. Why this matters

Lesson 1 said: apply only in the pipeline. This lesson shows what that pipeline looks like and why it is the single most effective safety measure for infrastructure. A laptop with cloud credentials can change production in seconds, from anyone's hands, with no review. A pipeline with narrow credentials, a protected branch and a required approval makes the same change visible, reviewed and recorded.

For a product manager directing agents, the pipeline is where your decisions become enforced. "No agent applies to production" is a wish in a document and a rule in a pipeline.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Who approves each environment, what counts as a safe change, which changes need a second person | Writing the pipeline file, writing plan summaries, proposing checks, diagnosing failed jobs | Trying to break the rules: can a branch apply, can an agent approve its own change, does the plan on the merge request match what was applied | Security (credentials, approvals), platform engineering (runners, state), operations (production change windows), governance (change records) |

## 2. Key ideas, explained

### Plan on the merge request, apply after merge

The shape that works for almost everyone:

| Stage | When | What it does | Who or what runs it |
|---|---|---|---|
| **Validate** | Every push | Format check, validate, static checks | Pipeline, read-only credentials |
| **Plan** | Every merge request | Shows what would change; the output is attached to the request | Pipeline, read-only credentials |
| **Approve** | Before merge | A human reads the plan and approves | A person with the right role |
| **Apply** | After merge to the main branch | Makes the change, using the reviewed plan | Pipeline, write credentials, protected branch only |

The key property is that **what a person approved is what gets applied**. Plans can go stale if the real world changes between planning and applying, so a careful pipeline saves the plan as a file and applies that exact file, or plans again and stops if the result differs. GitLab's [infrastructure as code guide](https://docs.gitlab.com/user/infrastructure/iac/) shows a ready-made OpenTofu setup using its managed state; check what your plan includes.

### Two sets of credentials

| Credential | Can do | Used by |
|---|---|---|
| **Read-only** | Read state and the real cloud, to plan | Merge request pipelines, including branches from forks or agents |
| **Write** | Change real resources | Only the apply job on the protected main branch |

This is the principle of least privilege (Cloud platforms lesson 3) applied to a pipeline. A branch pipeline that can only plan cannot hurt anything, even if its code is malicious or mistaken. The write credentials are available only to jobs on the protected branch, and ideally are short-lived identities rather than stored keys (CI/CD lesson 4).

### Protected branches and approvals

Three platform settings do most of the work. Each can be set on the free GitLab plan unless noted, but check your own plan for approval rule features.

| Setting | Effect |
|---|---|
| **Protected main branch** | No direct pushes. Everything arrives by merge request. |
| **Required approval** | At least one other person approves. For production folders, a named owner. Some approval features differ by plan; check yours. |
| **Protected environment** | Only certain people or roles can run jobs that deploy to production. |

These are the places where **gates and hooks bound agent work**. An agent can open a merge request. It cannot merge, approve its own work, or reach the write credentials, because the platform refuses. When you want to give agents more reach, you widen what the gate allows, deliberately, and write it down. The Agent orchestration track (`/library/tracks/agent-orchestration`) treats this as policy as data. For now, remember the order: **set the gate first, then give the agent a task.**

### Drift detection

A scheduled pipeline can run plan every night on the main branch with read-only credentials and complain if it shows any change. Anything it finds is drift: a manual change, an expired value, an outside system touching the resource. This is the same idea as GitOps drift correction in the Kubernetes track, and the [OpenGitOps principles](https://opengitops.dev/) name it: software agents continuously observe and correct. For infrastructure many teams choose to **detect and alert** rather than auto-correct, because an automatic fix to a stale description can destroy something.

### Checks that belong in the pipeline

Before plan, cheap checks catch real mistakes: formatting, validation, a scan of the infrastructure code for risky settings (public buckets, open firewall rules, missing encryption), and a secret scan (CI/CD lesson 4). Lesson 4 covers the scanners. The point here is **where** they run: on every merge request, before a human spends time.

An additional check worth having is a **policy check on the plan itself**: a small automated rule that fails the pipeline if the plan contains a destroy of a protected resource type, or a public exposure, or a resource without owner tags. This turns the PDM's "never destroy the production database without a decision" into something enforced.

### Change records

Approving a production change is a governance act. The merge request, its plan, its approval and the pipeline log together form a change record. For regulated or customer-facing changes, link the merge request to the formal Change Record (`/library/template-change-record`). The pipeline gives you the evidence for free.

### Making a change safely, concretely

Normal change: branch, edit, merge request, plan visible, approval, merge, apply, verify with a second plan. **Emergency change:** the same path, faster, never around it. If the pipeline is the only way credentials work, there is no way around it, which is the point. If someone must break glass, that credential is separate, logged, and followed by a review.

## 3. Step by step: build a safe infrastructure pipeline

1. **Write the policy** in a short doc: who approves test, who approves production, and that agents never hold write credentials.
2. **Protect the main branch** and require merge requests.
3. **Set required approvals,** with a code owner for production folders.
4. **Create two identities:** read-only for planning, write for applying. Prefer short-lived identity to stored keys.
5. **Scope the write identity** to the protected branch and the protected environment only.
6. **Write the pipeline:** validate, scan, plan on merge requests, apply on main after approval.
7. **Attach the plan** to the merge request.
8. **Add a nightly drift plan** that alerts on any change.
9. **Test the rules:** try pushing to main, try applying from a branch, try approving your own request.
10. **Record** the rules and the test results.

## 4. Worked example: TrailMug

Maya's team now has test and production folders. She writes the policy in `docs/infra-policy.md`: test changes need one approval from any teammate. Production changes need Ravi as code owner. No agent holds write credentials. The apply job runs only from the protected main branch, in a protected environment.

She directs an agent: "Write the pipeline file for these rules. Plan on merge requests with read-only credentials. Apply only on main, only after the plan, with the write identity. Add a nightly drift plan." The agent writes it, and says "all rules enforced". Maya does not believe the sentence. She runs her checks:

- She opens a branch and tries to run the apply job. It does not appear, since it is limited to main. Good.
- She asks a teammate to push directly to main. Refused. Good.
- She creates a merge request that edits production and approves it as herself. The approval rule needs Ravi. It stays blocked. Good.
- She reads the pipeline file and finds the plan job uses the **write** identity, because the agent reused one variable for both. She flags it. The agent splits them. She re-tests with a deliberate attempt to change a resource from a plan job. It fails with a permission error. Good.

The nightly drift job finds a change two weeks later: someone added a tag in the console. It alerts. Maya's team decides to put the tag in the code, the console change is overwritten at the next apply, and the policy gets a line: "No console changes in production." The record is in git.

## 5. Working with AI agents on this

**What the PDM decides:** who approves what, who holds which credentials, what the pipeline may do automatically.

**Delegate:** writing and fixing the pipeline file, writing plan summaries for reviewers, drafting the drift alert, writing the policy check, explaining failed jobs.

**Verify:** the rules by trying to break them; which identity each job uses; that the applied plan equals the approved plan.

**Never delegate:** creating or widening write credentials, changing protected branch settings, approving production changes.

**Prompt to build the pipeline:**

```text
Write the pipeline file for infra/ following docs/infra-policy.md. Stages: format
check, validate, security scan, plan on merge requests with the read-only identity,
apply only on the protected main branch with the write identity and only after the
plan job succeeded, and a scheduled nightly plan that fails on any change. Do not
create or edit any credential or any branch protection. List each job and the
identity it uses. List what a person must configure in the platform settings that
you cannot.
```

**Prompt to review a plan on a merge request:**

```text
Read this plan and the merge request description. Does the plan do what the
description says and nothing else? List every destroy or replace, every permission
change, every public exposure and every cost driver. Say clearly "approve", or
"do not approve and why". A person decides, not you.
<paste plan and description>
```

**Disclose** AI help in the pipeline merge request, and note the approval it required.

## 6. Common mistakes and how to avoid them

- **Apply from laptops.** Fix: remove human write credentials from daily use.
- **One identity for plan and apply.** Fix: two identities, tested.
- **Apply before approval.** Fix: apply on main only, with protected environments.
- **Trusting "rules enforced".** Fix: try to break them.
- **Stale plans.** Fix: apply the saved plan, or plan again and compare.
- **No drift check.** Fix: nightly plan with alert.
- **Auto-correcting drift blindly.** Fix: detect and alert first.
- **Emergency path around the pipeline.** Fix: a logged break-glass identity, reviewed after.

## 7. Practice

**Deliverable in git:** `specs/iac-03.md`, `briefs/iac-03.md`, `reviews/iac-03.md`, `docs/infra-policy.md`.

1. Write `docs/infra-policy.md` with approvers, credential rules and the rule for agents.
2. Write a spec for the pipeline with at least six acceptance criteria, each testable by trying to break it.
3. Brief an agent to write the pipeline file. Forbid it from touching credentials or branch settings.
4. Review the file: which identity does each job use? Record in `reviews/iac-03.md`.
5. Configure the protections yourself or with the platform owner. Run the break-it tests and record the result of each.
6. Record one rule you found was not enforced, and how it was fixed. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] Main is protected and requires merge requests and approvals.
- [ ] Plan runs on every merge request with read-only credentials.
- [ ] Apply runs only on main, with write credentials, after approval.
- [ ] No agent holds write credentials or can approve production.
- [ ] A nightly drift plan alerts on changes.
- [ ] I tried to break each rule and recorded the results.
- [ ] The policy is written in git.

## 9. Further learning

GitLab's infrastructure as code guide shows a worked pipeline. OpenGitOps gives the principles behind plan, review, apply and drift. The merge request page covers approvals. Return to the CI/CD track, lessons 3 and 4, for the general gate and credential ideas, and follow the Agent orchestration track when you want to widen what agents may do under policy.
