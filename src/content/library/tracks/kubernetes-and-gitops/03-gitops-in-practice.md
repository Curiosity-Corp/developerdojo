---
title: "GitOps in practice"
description: "Git as the source of truth for what runs: the four principles, automatic sync, drift, promotion between environments and how agents fit into the loop."
section: "Kubernetes and GitOps"
order: 3
track: "kubernetes-and-gitops"
level: "core"
duration: "90 min"
outcomes:
  - "State the four GitOps principles and apply them to a real change"
  - "Explain sync, drift and self-heal, and why manual changes are a defect"
  - "Design a repository layout and promotion path for test and production"
  - "Direct an agent to change a cluster only through a merge request, and verify the live result"
prerequisites:
  - "git-is-the-source-of-truth"
  - "iac-gitops-and-drift"
resources:
  - "cncf/opengitops"
  - "argo-project/argo-cd"
  - "argo-project/automated-sync-policy"
  - "flux-project/flux-documentation"
  - "gitlab/merge-requests"
  - "helm/using-helm"
updated: 2026-11-03
---

Lesson 3 of the Kubernetes and GitOps track. It is the technical side of the Master Developer rule in [Everything as code, GitOps and drift](/library/iac-gitops-and-drift) and the Way's rule [Git is the source of truth](/library/git-is-the-source-of-truth). Lessons 1 and 2 of this track should come first.

## 1. Why this matters

Without GitOps, a cluster is changed by people (and agents) typing commands. Each command is a change nobody reviewed, nobody recorded and nobody can undo cleanly. After a few months, no one knows exactly what is running or why. When something breaks, the first question is "what changed?" and the honest answer is "we do not know".

GitOps replaces that with one rule: **the repository says what should run, and an automatic process makes the cluster match.** Every change is a merge request. Review, history and rollback come for free. This is also the safest way to let agents work on infrastructure, because an agent can propose a change but cannot apply it.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Who may approve a change to each environment, how changes are promoted, whether production syncs automatically | Writing the manifest change, opening the merge request, explaining the diff, preparing the promotion change | Reading the merge request, watching the sync, comparing the live state to git, confirming no manual edits | Operations (running it), security (who can approve, which secrets), engineering (what the change does), release management (timing), support (who needs to know) |

## 2. Key ideas, explained

### The four principles

The OpenGitOps project, part of the Cloud Native Computing Foundation, states four principles at [opengitops.dev](https://opengitops.dev/). In plain words:

| Principle | Meaning |
|---|---|
| **Declarative** | The system is described by what you want, not by steps |
| **Versioned and immutable** | The description lives in git, with history, and past versions are kept |
| **Pulled automatically** | Software in the cluster fetches the description and applies it |
| **Continuously reconciled** | That software keeps checking, and corrects any difference |

The word that matters is **pulled**. In older practice, a pipeline pushed changes into the cluster, so the pipeline held the cluster's keys. In GitOps, an agent inside the cluster pulls from git. The cluster's keys stay in the cluster, and the repository only needs to be readable. That is a security gain.

### The tools: Argo CD and Flux

Two open source tools do the pulling and reconciling. [Argo CD](https://argo-cd.readthedocs.io/en/stable/) shows the state of each application in a web view and compares git with the live cluster. [Flux](https://fluxcd.io/flux/) is a set of controllers driven by files in git. Both are mature, widely used, and both have the same core idea. Choose one with your platform people. You do not need to learn both.

### Sync, self-heal and prune

Argo CD's vocabulary is a good way to learn the ideas. See its page on [automated sync policy](https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/).

| Term | Meaning | Risk to think about |
|---|---|---|
| **Sync** | Apply what git says to the cluster | A bad change in git is applied quickly |
| **Automated sync** | Sync happens by itself when git changes | You need good review and gates before merge |
| **Self-heal** | If someone changes the live system by hand, it is reverted to match git | Protects against drift, can surprise people debugging |
| **Prune** | Objects removed from git are removed from the cluster | A wrongly deleted file deletes a real thing |

For each environment you decide the settings. A test environment can sync, self-heal and prune automatically. Production may sync only after an approval, and prune with care. Write the choice down.

### Drift

**Drift** is any difference between what git says and what is running. It arises when someone edits a live object by hand "just for a minute", when an emergency fix is never written back, or when a tool changes something outside the description. Drift is dangerous because the repository stops being true. Your review of the repository then proves nothing about reality.

Treat drift as a **defect**: find it, fix it forward through git, and ask what allowed it. The usual cause is that people have write access to the live cluster. The cure is to remove that access for humans and agents alike, except through a recorded emergency path.

### The pipeline and GitOps together

Lessons in CI/CD described a pipeline that builds and tests the image once. GitOps adds the second half. The usual split:

1. **Application repository.** Code and tests. The pipeline builds the image and records its digest.
2. **Configuration repository** (or a separate folder). The manifests, including which image digest each environment runs.
3. **The pipeline's last step** opens a merge request to the configuration repository that bumps the digest in the test environment.
4. **A person reviews and merges.** The GitOps tool syncs. Test runs the new image.
5. **Promotion to production** is another merge request that changes the same digest in the production files. The same digest, tested, moves forward. Nothing is rebuilt.

Separating code from configuration keeps the cluster's history clean: every line of its history is a deployment decision.

### Repository layout

A simple layout that reads well:

```text
config-repo/
  apps/
    signup/
      base/            # manifests common to all environments
      overlays/
        test/          # test-only differences (replicas, digest)
        production/    # production differences
  clusters/
    test/              # which apps this cluster runs
    production/
  CODEOWNERS           # who must approve changes under production/
```

The differences between environments should be small, visible and reviewed. A large difference between test and production means test is not telling you what production will do.

### Promotion rules

Write down, for each environment, the rule for a change to arrive.

| Environment | Who approves | How it syncs | Gate |
|---|---|---|---|
| Test | One reviewer | Automatic | Pipeline green |
| Staging (if any) | One reviewer | Automatic | Test checks pass |
| Production | A named approver who is not the author | After approval | Staging healthy, change record complete |

The Change Record template ([template-change-record](/library/template-change-record)) fits here: the merge request carries the reason, risk and rollback.

### Secrets in GitOps

Git must never hold a real secret in clear form, yet the cluster needs secrets. The options, from weaker to stronger: encrypt the secret in git so only the cluster can decrypt it; or keep secrets in an external manager and have a controller fetch them, so git holds only a reference. See the Secrets page linked in lesson 2 and the Security fundamentals track. Whichever you choose, an agent must never be given the decryption key.

### Rollback means fix forward

To undo a bad change you could revert the merge request. The Way says **fix forward**: ship a new, reviewed change that corrects the problem, with a test or check that would have caught it. Reverting is permitted only when active harm requires stopping now, and even then it is followed by the forward fix. See [Fix forward](/library/fix-forward). In GitOps, "stopping the harm" is usually a small merge request that scales a service down or turns a feature off, which the tool applies in minutes.

### Where agents fit

GitOps is a very good home for agents because the interface is a merge request. The agent edits files and opens a request. A human reviews. The pipeline and the tool apply. At no point does the agent hold cluster credentials. In practice:

- **Allowed:** edit manifests on a branch, open a merge request, read the live state **read-only**, explain diffs.
- **Needs a human:** approve and merge, change who may approve, change sync policy.
- **Not allowed:** apply anything directly to the cluster, hold production credentials, edit the GitOps tool's own settings.

When several agents propose changes at once, that is orchestration, and the approval rules, code owners and gates are what keep it safe. The advanced track Agent orchestration covers running and governing a fleet this way.

## 3. Step by step: ship one change through GitOps

1. **Write the spec** with acceptance criteria, including the failing case and how you will check live state.
2. **Branch** in the configuration repository.
3. **Direct an agent** to make the manifest change and open a merge request. Plan first.
4. **Review the diff** with the lesson 2 checklist.
5. **Let the pipeline run** its checks.
6. **Merge** with an approval from someone other than the author.
7. **Watch the sync** in the tool's view. It should go from out-of-sync to synced and healthy.
8. **Verify the live result** read-only: right image digest, right number of ready pods, product works.
9. **Check for drift:** the tool shows git and live agree.
10. **Promote:** repeat for the next environment with the same digest.
11. **Record** the change in the merge request.

## 4. Worked example: TrailMug

For the partner project, Maya wants to change sign-up from version 1.4 to 1.5 in test, then production. The configuration repository has a test and a production overlay. Test syncs automatically. Production syncs after a merge approved by a code owner, who is Ravi.

Her spec says: "Test runs digest `sha256:cd34...` with two ready pods within five minutes of merge. Production is untouched until I approve. If the readiness check fails, the sync reports unhealthy and I scale the new version down with a merge request." She briefs an agent: "Edit only the test overlay. Change only the image digest. Open a merge request. Plan first."

The agent's plan includes a second edit: raising replicas from two to three "for safety". Maya rejects it: out of spec. She also spots in the diff that the agent used the tag `1.5` instead of the digest, and sends it back. She merges after Ravi approves. The tool syncs. She opens the tool's view: synced, healthy, two ready pods, digest matches. She opens the product's test address and tries sign-up. It works.

Then a drill: she asks a colleague to scale the test deployment to five pods by hand, to see what happens. Self-heal reverts it to two within a minute. She writes in the review: "Self-heal works in test. Production self-heal is also on, so a manual change there will be reverted. Emergency path: a merge request, reviewed by a code owner within the hour." The next day she promotes the same digest to production with a second merge request and a short change record.

## 5. Working with AI agents on this

**What the PDM decides:** the promotion rules, which environments sync automatically, who approves production, the emergency path.

**Delegate:** writing the manifest change, opening the merge request, writing the promotion request, explaining what the tool shows, drafting the change record from the diff.

**Verify:** the diff against the spec; the live state read-only; that git and live agree; that no human or agent applied anything by hand.

**Prompt for a GitOps change:**

```text
In the configuration repository, on a new branch, change only the image digest of
the signup deployment in overlays/test to <digest>. Do not change replicas,
resources or any other file. Open a merge request with: what and why, how it will be
checked (ready pods, digest), and rollback by a forward-fix merge request. Do not
apply anything to the cluster and do not hold cluster credentials. Show the diff first.
```

**Prompt for read-only verification:**

```text
Using read-only access only, report for the signup deployment in the test
namespace: the image digest running, desired and ready replica counts, the last
sync status from the GitOps tool, and whether any live setting differs from git.
Do not change anything. If you cannot tell, say so.
```

**Disclose** the agent's role in the merge request.

## 6. Common mistakes and how to avoid them

- **Fixing production by hand.** Fix: a merge request, even in an emergency, reviewed within an agreed time.
- **Agents with write access to the cluster.** Fix: git only; read-only for the live view.
- **Rebuilding for each environment.** Fix: promote the same digest.
- **Auto-prune in production without care.** Fix: decide and document.
- **Secrets in git in clear.** Fix: encrypted or external, and never give an agent the key.
- **Large differences between test and production.** Fix: keep overlays small.
- **Approving your own production change.** Fix: code owners.
- **Reverting to hide a problem.** Fix: forward fix, add the gate.

## 7. Practice

**Deliverable in git:** `specs/gitops-03.md`, `briefs/gitops-03.md`, `reviews/gitops-03.md`, `docs/promotion-rules.md`.

1. In `docs/promotion-rules.md`, write the rule for each environment: who approves, how it syncs, the gate.
2. Write a spec for one change with at least six acceptance criteria: only the named files change, digest not tag, ready pods count, live check, drift check, rollback by forward fix.
3. Brief an agent for the change, plan first, with no cluster credentials.
4. Review the diff; merge with a second person's approval.
5. If you have a throwaway cluster and a GitOps tool, watch the sync and run a drift drill; otherwise walk the steps on paper with a partner and record what you expect to see.
6. Record anything the agent did outside the spec.
7. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] The repository describes what should run, and I can point to the file.
- [ ] No human or agent applies changes by hand.
- [ ] Production changes need a named approver other than the author.
- [ ] The same digest is promoted through environments.
- [ ] I checked live state against git after the sync.
- [ ] No clear secrets in git.
- [ ] I know the emergency path and who approves it.

## 9. Further learning

Read the OpenGitOps principles first; they are short. Then read the documentation of one tool, Argo CD or Flux, enough to know its words. The automated sync page is the one to read before you turn on automatic production sync. The merge request documentation and Helm page support the rest.
