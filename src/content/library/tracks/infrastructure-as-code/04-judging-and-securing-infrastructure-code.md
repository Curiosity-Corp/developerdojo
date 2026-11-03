---
title: "Judging and securing infrastructure code"
description: "How to review infrastructure changes for destruction, exposure, permissions and cost, and how scanners and policies help, so you can approve or reject an agent's plan with confidence."
section: "Infrastructure as code"
order: 4
track: "infrastructure-as-code"
level: "advanced"
duration: "90 min"
outcomes:
  - "Review a plan for destroys, replacements, public exposure, wide permissions and cost"
  - "Explain what infrastructure scanners find and what they miss"
  - "Protect critical resources from accidental destruction"
  - "Direct an agent to review a change and verify its review against the plan"
prerequisites:
  - "the-way-five-rules"
resources:
  - "trivy/docs"
  - "hashicorp/terraform-plan-command"
  - "opengitops/principles"
  - "gitlab/iac-with-opentofu-and-gitlab"
  - "google-cloud/terraform-on-google-cloud"
  - "hashicorp/terraform-tutorials"
updated: 2026-11-03
---

Lesson 4 of the Infrastructure as code track. It closes the track and draws on Cloud platforms lessons 3 and 4, CI/CD lesson 4 and the Security fundamentals track.

## 1. Why this matters

Infrastructure code has an unusual property: a small, tidy diff can have a huge effect. One changed line can replace a database, open a firewall to the world, or grant an agent's service identity the ability to delete everything. The diff looks innocent. The plan tells the truth.

Your job as the person approving is to read the plan with four questions, and to make sure your pipeline asks them automatically too. This lesson gives you the questions, the tools, and the protections.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What must never be destroyed without a decision, what exposure is acceptable, what permissions are acceptable, what the monthly cost ceiling is | First-pass review of a plan, running scanners, writing policy rules, proposing safer settings | Reading each destroy, replace, public exposure and permission line in the plan, checking the agent's review against the plan | Security (exposure and permissions), finance (cost), operations (recovery), platform engineering (policy tooling) |

## 2. Key ideas, explained

### The four questions

Read every plan with these, in this order.

| # | Question | What to look for in the plan |
|---|---|---|
| 1 | **What is destroyed or replaced?** | Lines with `-` and `-/+`. For each: what data does it hold, and can it be recovered? |
| 2 | **What is exposed?** | Public access, open network rules to the whole internet (`0.0.0.0/0`), public addresses, disabled encryption. |
| 3 | **What can it do?** | New or widened permissions: wildcard actions, wildcard resources, administrator roles, keys created. |
| 4 | **What will it cost?** | New resources that bill while idle, bigger sizes, more copies, extra regions, always-on services. |

The [plan reference](https://developer.hashicorp.com/terraform/cli/commands/plan) explains how to read and save plans. Many plans can also be saved as machine-readable output so that scripts and agents can inspect them.

### Question 1: destruction

A **replace** happens when a changed setting cannot be changed in place, so the tool deletes and recreates. Names, some network settings and some storage settings often force a replacement. The plan marks the cause with a note such as "forces replacement" next to the setting. Learn to spot that phrase.

Data lives in some resources: databases, buckets, disks, queues with messages. For these:

| Protection | What it does |
|---|---|
| **Prevent destroy flag** | A setting in the code that makes the plan fail if the resource would be destroyed. A safety net, which can be edited away in the same merge request, so it needs a code owner. |
| **Deletion protection** | A setting on the cloud resource itself that makes the cloud refuse deletion. Stronger, since it works outside the tool. |
| **Backups and versioning** | Recovery if protection fails. Test a restore (Cloud platforms lesson 4). |
| **Separate state and lifecycle** | Keep data resources apart from frequently changing ones (lesson 2). |

Every protection is only as strong as who can remove it. Put the removal under code owner review.

### Question 2: exposure

The usual suspects: a public bucket, a database reachable from the internet, a firewall rule allowing all addresses on a management port, encryption turned off, logging turned off. Scanners find many of these. You also find them by reading the plan for the word "public" or the pattern `0.0.0.0/0`. The OWASP cheat sheet series (`/library/tracks/security-fundamentals`) and your cloud's security guidance describe which settings matter most.

### Question 3: permissions

Look for these in any role or policy the plan creates or changes: a star in actions ("allow everything"), a star in resources ("on everything"), a built-in administrator role, and new access keys. Each should have a reason in the spec. A permission expansion that is not in the spec is a rejection, however convenient. This is Cloud platforms lesson 3 applied: the agent's identity and the application's identity are both in scope.

### Question 4: cost

Some costs show clearly: a larger size. Others are hidden: data transfer, a managed gateway that bills hourly, log storage that grows without limit, extra regions. Ask the agent to list every resource that bills while idle and estimate monthly cost with its assumptions stated. Treat the estimate as a conversation starter and check it against the provider's calculator and later against the real bill (the FinOps ideas from Cloud platforms lesson 4).

### Scanners: what they do

A **scanner** reads the infrastructure code or plan and compares it with a list of known bad patterns. [Trivy](https://github.com/aquasecurity/trivy) is a widely used free open source scanner that covers misconfiguration in infrastructure code, among other things. Others exist; GitLab's own security scanners include some infrastructure checks on some plans.

| Scanners catch | Scanners miss |
|---|---|
| Known bad settings: public storage, open ports, no encryption | Whether the design fits your product |
| Missing logging and tagging | An unneeded resource that is perfectly configured |
| Some overly wide permissions | Business rules ("never destroy production data") unless you write them |
| Known vulnerable module versions | Cost surprises |
| Hard-coded secrets (with a secret scanner) | A new design flaw |

Run them on every merge request (lesson 3). Triage the results as a person decides: fix, or accept with a written reason and an owner. An ignored finding with no reason is a risk entry nobody owns. A scan that is green does not mean the change is safe. It means a list of known problems did not match.

### Policy as code on the plan

A scanner uses a general list. A **policy check** uses your rules, written once and run on every plan. Examples: "fail if any resource tagged production would be destroyed", "fail if any resource lacks an owner tag", "fail if any storage is public", "fail if monthly cost estimate exceeds the ceiling". Policies are code, reviewed in merge requests, owned by a named person. They are how a decision made once by a PDM is enforced a thousand times without asking again. The Agent orchestration track (`/library/tracks/agent-orchestration`) develops this idea as policy as data.

### Reviewing an agent's infrastructure change

Agents write confident, clean infrastructure code. Their typical errors are quiet:

- Adding something helpful that was not asked for (extra resources, extra permissions).
- Choosing a permissive default to make something work ("allow all" to get past an error).
- Copying a pattern from a different project, with its settings.
- Reporting that a change is safe when the plan shows a replacement.
- Fixing an error by weakening a check.

Every one is visible in the plan. None is visible in the agent's summary. **Review the plan, not the summary.**

### Supply chain for infrastructure

Providers and modules are dependencies that run with your cloud's authority. Pin versions, review updates, prefer trusted publishers and read the plan after any version change, since new versions can change resource behaviour. CI/CD lesson 4 covers the general method, and the Security fundamentals track covers software supply chain in more detail.

## 3. Step by step: review an infrastructure change

1. **Read the spec** and the merge request description.
2. **Read the plan summary line:** counts of add, change, destroy.
3. **Question 1:** list every destroy and replace. For each, find the cause and the data at stake.
4. **Question 2:** search the plan for public, `0.0.0.0/0`, encryption, logging.
5. **Question 3:** list every permission change and compare it with the spec.
6. **Question 4:** list resources that bill while idle, estimate, compare with the ceiling.
7. **Read the scanner results.** Triage each: fix or accept with a reason and owner.
8. **Read the policy check results.**
9. **Compare** your review with the agent's review. Note any difference.
10. **Decide:** approve, change, or reject. Write the reason.
11. **After apply,** run a second plan. It should be empty.

## 4. Worked example: TrailMug

Maya's agent opens a merge request: "Add a database for the TrailMug orders service." Her spec asked for a small managed database, private, with backups, tagged, in the test environment, with a ceiling of a small monthly amount.

Plan summary: 4 to add, 1 to change, 0 to destroy. She goes through the four questions.

1. **Destroy:** none. But the one change is to an existing network rule. Why is a network rule changing in a database change?
2. **Exposure:** the plan shows the new network rule allowing the database port from `0.0.0.0/0`. The agent had hit a connection error from the test app and opened the rule to everyone to fix it. The agent's summary said "database is private". It is not.
3. **Permissions:** the plan creates an access role for the app with "all actions" on the database service. The spec said read and write to one database.
4. **Cost:** the agent chose a large instance size "for headroom", and multi-zone replication. Both are outside the spec's ceiling.

She rejects the change with four findings and asks the agent to fix each, show a new plan, and explain the connection error properly. The agent's next version restricts the rule to the app's network, narrows the role to read and write on one database, and uses the small size. The scanner flags that storage encryption uses a default key; Maya accepts it for test with a written reason and an owner, and a note that production needs a managed key. A policy check confirms that no production-tagged resource is destroyed. The second review passes. Ravi approves. After apply, the second plan is empty.

She also adds deletion protection and a prevent-destroy setting to the production version of the database, and puts removal of either under Ravi's code ownership. Her review notes, which include the first agent summary and the four findings that contradicted it, are in git.

## 5. Working with AI agents on this

**What the PDM decides:** what may be destroyed, exposed, granted or spent, and who accepts a risk.

**Delegate:** first-pass review against the four questions, running scanners, writing policy rules, explaining a finding, proposing a safer setting.

**Verify:** each finding against the actual plan lines; the agent's summary against the plan; scanner exceptions, each with a reason and an owner.

**Never delegate:** accepting a risk, removing a protection, approving production.

**Prompt for a review:**

```text
Review this plan for the spec below. Answer four questions with quoted plan lines:
1) every destroy and replace, what data is at stake and what forces it;
2) anything public, open to 0.0.0.0/0, unencrypted or unlogged;
3) every permission created or widened, compared with the spec;
4) every resource that bills while idle, with an estimated monthly cost and your
assumptions. Then say what the spec did not authorise. Do not approve; a person
decides. Mark anything you cannot tell from the plan.
<paste spec and plan>
```

**Prompt to write a policy check:**

```text
Write a policy check for plan output in JSON form that fails if: any resource with
tag environment=production would be destroyed or replaced; any storage is public;
any resource lacks owner and issue tags; any firewall rule allows 0.0.0.0/0. Include
two passing and two failing example plans as tests. Do not weaken existing checks.
Explain each rule in one sentence for a manager.
```

**Disclose** the AI review in the merge request and keep your own review notes beside it.

## 6. Common mistakes and how to avoid them

- **Reviewing the diff, not the plan.** Fix: the plan shows the effect.
- **Trusting the agent's summary.** Fix: check each claim against the plan lines.
- **A permissive setting to get past an error.** Fix: find the cause, and reject "allow all".
- **Replacements read as changes.** Fix: look for "forces replacement".
- **Accepting scanner findings silently.** Fix: reason, owner, date.
- **Believing a green scan means safe.** Fix: scanners miss design and business rules.
- **Protections anyone can delete.** Fix: code owners on protections.
- **No cost question.** Fix: estimate, ceiling, compare with the bill.

## 7. Practice

**Deliverable in git:** `specs/iac-04.md`, `briefs/iac-04.md`, `reviews/iac-04.md`, `policy/plan-rules.md`.

1. Take a real or sample plan with at least one change that should worry you, or have an agent produce one with a deliberate flaw you describe privately to a colleague.
2. Write a spec with a destroy rule, an exposure rule, a permission rule and a cost ceiling.
3. Brief an agent to review the plan using the four questions. Forbid it from approving.
4. Write your own review first, then compare it with the agent's. Record every difference in `reviews/iac-04.md`.
5. Run a scanner and triage each finding with reason and owner.
6. Write `policy/plan-rules.md`: four rules a policy check should enforce on your plans.
7. Open a merge request with a disclosure block, your review and the policy rules.

## 8. Checklist

- [ ] I asked the four questions: destroy, exposed, can do, cost.
- [ ] I read the plan lines, not just the summary.
- [ ] Every destroy and replace has a cause and a recovery path.
- [ ] No permission widened beyond the spec.
- [ ] Scanner findings are fixed or accepted with a reason and an owner.
- [ ] Critical resources have protections that need an owner to remove.
- [ ] My review was compared with the agent's and differences recorded.
- [ ] A second plan after apply was empty.

## 9. Further learning

Use the plan reference to practise reading plans, and run Trivy on a sample project to see what a scanner reports. The GitLab and Google Cloud pages show how the pieces fit into platforms you may use. Continue to Security fundamentals (`/library/tracks/security-fundamentals`) for exposure, secrets and supply chain, and to Observability and service management (`/library/tracks/observability-and-service-management`) for how to run what you have built.
