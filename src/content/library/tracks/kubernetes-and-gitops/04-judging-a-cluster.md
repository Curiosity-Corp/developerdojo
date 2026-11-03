---
title: "Judging a cluster"
description: "Troubleshoot at a manager's level, apply the security basics, read capacity and cost, and set the limits on what agents may touch in a cluster."
section: "Kubernetes and GitOps"
order: 4
track: "kubernetes-and-gitops"
level: "advanced"
duration: "90 min"
outcomes:
  - "Read the common failure states and ask an agent the right diagnostic questions"
  - "Apply a short security checklist to a cluster and its access rules"
  - "Connect requests, limits and node count to cost and reliability"
  - "Write and verify an access plan for agents working near a cluster"
prerequisites:
  - "the-way-five-rules"
resources:
  - "kubernetes/troubleshooting-applications"
  - "kubernetes/security-checklist"
  - "kubernetes/resource-management-for-pods-and-containers"
  - "kubernetes/ingress"
  - "owasp/cheat-sheet-series"
  - "finops/what-is-finops"
updated: 2026-11-03
---

Lesson 4 of the Kubernetes and GitOps track. It supports the Master Developer delivery spine, stages "governance" and "deployment". Lessons 1 to 3 should come first.

## 1. Why this matters

Clusters fail in a few repeated ways, and clusters are attacked in a few repeated ways. You will not fix them yourself. You will be in the room when someone says "the pods are crash-looping" or "we have a public dashboard", and you will need to ask the next good question, and to know who should answer.

This lesson gives you the common failure vocabulary, the short security checklist, the link between settings and cost, and the access rules for agents. It closes the track.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What is an incident, how much spare capacity to pay for, which access agents get, who is on call | Diagnosing a failing workload, drafting the fix as a merge request, checking a cluster against the checklist, summarising cost | Asking for evidence, not stories; reproducing the symptom; reading the access list; comparing cost to the estimate | Operations and on-call (running it), security (access and exposure), finance (cost), support (customer message), engineering (the fix) |

## 2. Key ideas, explained

### Failure states you will hear named

Each of these is a status shown for a pod. The official [Troubleshooting Applications](https://kubernetes.io/docs/tasks/debug/debug-application/) guide covers them in depth. In plain words:

| Status | What it usually means | First question |
|---|---|---|
| **Pending** | No node can take the pod yet | Is there enough capacity? Are requests too large? |
| **ImagePullBackOff** | The image cannot be fetched | Wrong name or digest? No permission to the registry? |
| **CrashLoopBackOff** | The container starts and keeps crashing | What do the logs say? Is a setting or secret missing? |
| **Running but not Ready** | The process is up but the readiness check fails | What does the readiness probe test, and is it right? |
| **OOMKilled** | The container used more memory than its limit | Is the limit too low, or is there a leak? |
| **Evicted** | The node ran short of resources and removed the pod | Are requests set honestly? Is the node undersized? |

When an agent proposes a fix, ask it to show the **evidence**: the status, the log lines, the event message. "I think it is a memory problem" is a guess. "The container was OOMKilled, exit code 137, memory limit 128 Mi, peak usage 190 Mi" is evidence.

### A calm diagnosis order

1. **What changed?** Look at the merge request history. GitOps makes this answerable: the last change to the repository before the symptom.
2. **What is the state?** Pods, events, readiness.
3. **What do the logs say?**
4. **Is it the app, the configuration, or the platform?**
5. **Fix forward** with a reviewed change, adding a check that would have caught it.
6. **If customers are hurt now,** stop the harm first with the smallest safe change: scale down, switch a feature off.

### Security: the short list

The Kubernetes [security checklist](https://kubernetes.io/docs/concepts/security/security-checklist/) is long. The first ten items to check, in order of usual damage:

| Check | Question |
|---|---|
| **API access** | Who can talk to the cluster's control interface, from where, and is it open to the whole internet? |
| **Human access** | Is each person on a named account with multi-factor sign-in, and a role that grants only what they need? |
| **Workload access** | Does each service have its own identity with narrow permissions, rather than a shared powerful one? |
| **Secrets** | Are they encrypted at rest, restricted by role, and kept out of git in clear form? |
| **Images** | Pinned by digest, from a trusted registry, scanned in the pipeline? |
| **Containers** | Non-root, no privilege escalation, no host access? |
| **Network** | Do services only reach what they need? Is there a default deny rule between namespaces? |
| **Exposure** | Which services and dashboards face the internet, and why? |
| **Updates** | Is the cluster version supported and patched? |
| **Audit** | Are access and changes logged and reviewed? |

Kubernetes access control uses roles. A **role** lists allowed actions on kinds of objects, and a **role binding** gives that role to a person or service. The same least-privilege idea from Cloud platforms lesson 3 applies. A wildcard role, or giving someone "cluster admin" for convenience, is the equivalent of the owner account.

A commonly found risk: an unprotected management dashboard or API exposed to the internet. Ask directly: **is any management interface reachable from the public internet?** The [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) includes a Kubernetes security sheet and others to hand to a specialist.

### Network rules

By default, in many clusters every pod can talk to every other pod. A **network policy** limits that. A good default is to deny all traffic between namespaces and allow only what each service needs. Ask: **if one service is compromised, what else can it reach?** This question tells you whether a breach stays small.

### Capacity and cost

Lesson 2 introduced requests and limits. Here is how they connect to money and reliability.

- The scheduler places pods by **requests**. The sum of requests decides how many nodes you need, so inflated requests mean idle money.
- **Limits** protect neighbours. A memory limit that is too low gets pods killed. One that is too high lets a leak hurt others.
- **Replicas across zones** give resilience, and cost more.
- **Autoscaling** adds and removes pods or nodes as load changes. It saves money and can surprise you with a large bill if it has no ceiling. Always set a maximum.
- **Idle environments** such as forgotten test clusters are the largest waste in practice. Tag everything with owner and issue, as in Cloud platforms lesson 4, and review the cost by tag weekly. The FinOps introduction at [finops.org](https://www.finops.org/introduction/what-is-finops/) is a good primer.

The question to ask: **what is the cheapest setup that meets the uptime we agreed?** Then check the measured use against the requests, not the guess against the guess.

### Upgrades and the platform

Kubernetes releases often, and old versions stop receiving fixes. A managed service handles the control plane, and you must plan the upgrade of your workloads and nodes. Ask: **what is our version, when does support end, and who owns the upgrade?** An upgrade is a change like any other: a merge request, a test environment first, a change record.

### What agents may touch

Write an access plan like the one in Cloud platforms lesson 3, specialised for a cluster.

| Allowed | Needs a human | Not allowed |
|---|---|---|
| Edit manifests on a branch | Approve and merge to the configuration repository | Apply anything directly to a cluster |
| Open merge requests | Change roles, network policy, sync policy | Hold production credentials or cluster admin |
| Read live state and logs, read-only, in test | Read live state in production | Read secret values |
| Propose a fix and a test | Accept a risk or an exception | Disable a check or an admission rule |

Enforce with roles and with the GitOps tool's own permissions, not just with instructions. Add an **admission rule**, a cluster check that refuses unsafe objects (for example, containers running as root) no matter who submits them. Admission rules, branch protection and pipeline gates are the "govern" rung of the ladder from the AI track. How to write them as policy for a whole fleet is the subject of Agent orchestration.

### Practising safely

Practise on a throwaway cluster you can destroy, with no real data and no real credentials. A local single-machine cluster is enough for every exercise in this track. Never practise on a cluster that anyone else relies on.

## 3. Step by step: review a cluster

1. **List what faces the internet** and justify each.
2. **List who has access** to the cluster and at what role. Remove what is not needed.
3. **List each service's identity** and permissions.
4. **Check secrets:** where stored, who can read.
5. **Check images and containers** against the lesson 2 checklist for a sample of services.
6. **Check network rules:** what can a compromised service reach?
7. **Check requests against measured use,** and any autoscaling ceiling.
8. **Check version and support date.**
9. **Check logs and audit** are on.
10. **Write findings** by risk, with an owner and date for each.
11. **Turn the top three into specs,** and direct agents to propose merge requests.
12. **Re-check** after the changes land.

## 4. Worked example: TrailMug

For the partner project's practice cluster, Maya runs the review with an agent drafting and herself judging.

The agent's first list of exposed items includes the application ingress and a management dashboard that she did not know was installed. She asks: "Reachable from where?" The answer, from the cluster's own settings: from anywhere. She asks the platform engineer, a colleague, who agrees it should not be, and the agent drafts a merge request to remove the public route and restrict the dashboard to the internal network. Ravi approves.

Access review: eight people hold cluster admin. Maya asks why. Six do not need it. She writes a spec to reduce them to read-only roles, with two named administrators and an emergency account with a recorded procedure. The agent drafts the role change as code. Maya reads the generated roles for wildcards, and asks for two of them to be narrowed.

Cost: requests for the sign-up service reserve four times what monitoring shows it uses. She does not trust the agent's reading of the chart. She looks at the chart herself, sees peak use well under the request, and writes a spec to halve the requests, with a rollback by forward fix if the readiness check starts failing. Three nodes become two. She notes the saving as a percentage of the cluster's compute, not a currency amount, since the cluster is a practice one.

Last, version: the cluster is two minor versions behind. She schedules the upgrade for test first, with a change record. The three findings become three merge requests, each reviewed, each with a gate: an admission rule refusing containers that run as root, a quarterly access review in the calendar, and an alert when requests exceed use by a large margin for a week.

## 5. Working with AI agents on this

**What the PDM decides:** the severity of a finding, the access plan, the spare capacity, the upgrade schedule, what is an incident.

**Delegate:** diagnosing from logs and events with evidence, drafting fixes as merge requests, running the checklist, summarising cost, drafting the quarterly access review.

**Verify:** you ask for the evidence; you reproduce the symptom or see the event; you read generated roles for wildcards; you check cost against the measured chart.

**Never delegate:** accepting a security risk, giving an agent production credentials, deciding that something is not an incident.

**Prompt for a diagnosis with evidence:**

```text
The signup deployment in the test namespace has pods in CrashLoopBackOff. Using
read-only access, report: the pod status and restart count, the last 30 log lines of
the failing container, the recent events, and the most recent change to the
configuration repository. Then propose the smallest fix as a merge request,
and say how I can confirm it worked. Mark each claim as evidence or guess.
Do not change the cluster.
```

**Prompt for a cluster review:**

```text
Review this cluster export against this checklist: management interfaces exposed to the
internet, human access and roles, service identities, secrets handling, image sources
and pinning, container security settings, network policies, requests versus measured
use, cluster version and support date, audit logging. Output a table: check, finding,
evidence, risk, smallest fix. Do not change anything. Mark what you cannot tell.
```

**Disclose** AI help on findings and fixes in the merge requests.

## 6. Common mistakes and how to avoid them

- **Accepting a diagnosis without evidence.** Fix: status, logs, events.
- **A management dashboard on the internet.** Fix: ask about exposure first.
- **Cluster admin for everyone.** Fix: roles, named admins, an emergency path.
- **Reading generated roles without checking for wildcards.** Fix: look for stars.
- **Inflated requests.** Fix: compare with measured use.
- **Autoscaling with no ceiling.** Fix: a maximum, and a budget alert.
- **Forgotten idle clusters.** Fix: tags, weekly review, removal through git.
- **Skipping upgrades.** Fix: an owner and a date.
- **Practising on a shared cluster.** Fix: throwaway only.

## 7. Practice

**Deliverable in git:** `specs/k8s-04.md`, `briefs/k8s-04.md`, `reviews/k8s-04.md`, `docs/cluster-access-plan.md`.

1. Take a throwaway or sample cluster description, or use the TrailMug example export from your instructor or an agent-written fake.
2. In `docs/cluster-access-plan.md`, fill the allowed, needs-a-human and not-allowed table for agents.
3. Write a spec for a cluster review with at least six acceptance criteria, one per checklist area, each requiring evidence.
4. Brief an agent to run the review read-only. Plan first.
5. Judge the findings: which are real, which are guesses. Record in `reviews/k8s-04.md`.
6. Turn the top three into specs and direct an agent to draft merge requests. Review for wildcards and scope.
7. Record one place the agent was too confident. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] I asked for evidence for every diagnosis.
- [ ] I know what faces the internet and why.
- [ ] Access is by named roles; no shared admin accounts.
- [ ] Secrets are protected and not in git in clear form.
- [ ] Requests are checked against measured use, and autoscaling has a ceiling.
- [ ] The cluster version and upgrade owner are known.
- [ ] Agents cannot apply to a cluster or read secret values.
- [ ] Findings have owners and dates.

## 9. Further learning

Keep the troubleshooting guide for the day something breaks, and the security checklist for your next review. The OWASP cheat sheets give specialist depth. The FinOps introduction helps with the cost conversation. Then continue to the Infrastructure as code and Security fundamentals tracks, which cover what builds the cluster and how to defend it.
