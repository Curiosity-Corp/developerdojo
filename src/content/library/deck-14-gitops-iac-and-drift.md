---
title: "Deck 14: The GitOps loop and finding drift"
description: "Infrastructure as code and GitOps in one loop, the rules that never bend, and four layers for finding drift and fixing it forward."
section: "Teaching deck"
order: 14
level: advanced
duration: "120 min"
outcomes:
  - "Describe the GitOps and infrastructure-as-code loop and the tool for each step."
  - "State the rules that never bend."
  - "Explain the four layers for finding drift and how often each runs."
  - "Handle a drift in the right order: read the diff, decide, fix forward, add a gate."
resources:
  - opengitops/principles
  - argo-cd/docs
  - argo-cd/automated-sync
  - hashicorp/terraform-intro
  - opentofu/docs
  - kustomize/docs
  - sops/docs
  - external-secrets/docs
prerequisites:
  - deck-13-patch-fork-loop
  - iac-gitops-and-drift
---

This lesson covers slides 29 and 30, which are Track B chapter 12. Slide 29 shows the **GitOps and infrastructure-as-code loop**. Slide 30 shows the **four layers for finding drift**. It is the most technical lesson of the deck, and the aim is the same as always: enough depth that you can direct an agent and judge its result.

## Why it matters

When someone changes a live system by hand, nobody else knows. A week later the system behaves differently from what the code says, and no one can explain why. GitOps and infrastructure as code remove that problem by making git the only way to change things. A Product Development Manager who insists on this rule gets two gifts: every change has a reason and a reviewer, and the system can be rebuilt from git.

## Key ideas

### Words to know

- **Infrastructure as code (IaC):** describing cloud resources (servers, networks, databases) in files that can be reviewed.
- **GitOps:** keeping the desired state of a system in git and letting a controller make the live system match it.
- **Desired state:** what git says should exist.
- **Actual state:** what really exists now.
- **Drift:** any difference between desired and actual state.
- **Kubernetes:** a system that runs and manages containers.
- **Overlay:** a small set of changes on top of a shared base, for example one for staging and one for production.

### The loop (slide 29)

| Step | Tool kind | What it does |
|---|---|---|
| 1 | Terraform or OpenTofu | Cloud resources as code. The **plan** appears in the merge request. |
| 2 | Kustomize base and overlays | Kubernetes configuration for staging and production |
| 3 | ExternalSecret and SOPS | Secret **names** in git, never values |
| 4 | Merge request | Review, pipeline gates, plan output. **Apply after merge.** |
| 5 | A GitOps controller (for example Argo CD) | Pulls from git. Prune and self-heal keep the cluster equal to git. |
| 6 | Live cloud and cluster | The actual state |

**Prune** means removing things in the cluster that are no longer in git. **Self-heal** means the controller undoes a manual change by putting back what git says.

### Rules that never bend

The slide ends with seven rules:

1. **No plaintext secrets.** Values live in a vault. Git holds only names, or encrypted files.
2. **No `kubectl apply`, `patch` or `create`.** Changes go through git.
3. **No clickops.** Clicking in a cloud portal to change resources is not allowed.
4. **One digest from staging to production.** The exact image that passed staging is the one that runs in production.
5. **No `:latest`.** A tag that moves is a change nobody reviewed.
6. **No local builds.** Builds happen in the pipeline.
7. **Fix forward.** Drift is closed by a new merge request, never by hand.

### Finding drift: four layers (slide 30)

You cannot prevent every drift. You find it fast and close it through git.

| Layer | What is compared | How often | Tool |
|---|---|---|---|
| 1. GitOps controller | Kubernetes objects against git | Continuous | Out-of-sync status, diff, self-heal, alerts |
| 2. Scheduled plan | Cloud resources against Terraform | Daily to weekly | `terraform plan` |
| 3. Cloud posture | Cloud settings against policy | Continuous | Posture scans |
| 4. Map and discovery | What is recorded against what is real | On demand today | Discovery and ingest |

### The four steps when drift is found

1. **Read the diff. Change nothing yet.**
2. **Decide which side is right.** Sometimes git is wrong and the hand change was a good fix.
3. **Fix by a forward merge request.**
4. **Add the gate that catches it next time.**

A note on `ignoreDifferences`: some fields are changed by the system itself, so you may tell the controller to ignore them. **Every entry needs a comment that says why.**

The speaker note says task 3 of Gate 3 tests this: read the diff first and change nothing, decide which side is right, fix forward, then add a gate.

## A worked example: TrailMug

TrailMug has a staging and a production cluster, both described in `trailmug-ops`.

**Normal change.** The returns service needs more memory. An agent edits the production overlay and opens a merge request. The pipeline shows a diff of the rendered configuration: only one number changed. A reviewer approves. After merge, the controller syncs, and the cluster has the new number.

**Drift.** On Friday evening, someone raises the memory by hand to stop a crash. On Monday the controller shows the service as out of sync. Self-heal puts the old number back. The crash returns.

The Product Development Manager asks four questions:

1. Read the diff. The live value was 512 MiB higher than git. Nothing changed yet.
2. Which side is right? The live value. The crash showed git was too low.
3. Fix forward: a merge request that sets the new value in git, with a link to the incident issue.
4. Gate: an alert that fires when memory use is above 80 percent for ten minutes, so the next person sees the problem before it crashes.

No one used `kubectl` to fix drift. The system is back to "git equals live", and the reason for the number is recorded.

## The 2030 Product Development Manager lens

- **You decide:** which side is right in a drift; whether a change is safe to apply; whether an exception (an ignored difference) is acceptable.
- **You delegate to agents:** writing the overlay change, running the plan, reading the diff and summarising it, drafting the gate (an alert or a policy check).
- **The brief you would write:** "Here is the plan output for the cloud change. List every resource that will be created, changed or destroyed. Flag any destroy. Do not apply. Do not edit any file."
- **You verify by:** reading the plan yourself, looking for destroys and for secret values in the diff, and checking that the digest in production equals the one that passed staging.
- **Disciplines involved:** operations and platform (the loop), security (secrets and posture), finance (cloud cost shown in plans), engineering (overlays), risk and compliance (the evidence trail).
- **On the agent ladder:** **govern**: the rules that never bend are written policy. A gate in the pipeline and a self-heal setting in the controller enforce them without asking anyone. Agents may not hold production secrets.

## Working with AI agents

- **Agents may write** Terraform, overlay changes and gates. Their work enters through a merge request like everyone else's.
- **Agents may read** the plan or the diff and summarise it. You must still read the plan.
- **Agents must not** run `apply`, `kubectl apply` or any hand change against a live system.
- **Agents may not hold production secrets.** Give them names, not values.
- **A good habit:** ask an agent "What could go wrong with this change?" Take the answer as a list of things to check, not as a guarantee.

## Common mistakes

1. **Fixing drift by hand.** It makes more drift.
2. **Using `latest` for convenience.** It hides what runs.
3. **A secret value in a merge request.** Rotate it at once, then fix the process.
4. **Ignoring differences without a comment.** The next person will not know why.
5. **Applying before the review.** The apply comes after the merge.
6. **No gate after the fix.** The same drift returns.
7. **Treating plan output as noise.** The plan is the evidence.

## Practice

1. Draw the loop from memory. Write a rule next to each box.
2. Take any small infrastructure change from your work. Write what the merge request description would say, and what the plan would show.
3. Find a place in your life or work where a live system and its description may differ (a shared spreadsheet and the real stock, for example). Write which side is the source of truth.
4. Walk through the four steps of drift handling for a made-up example. Write the gate.
5. Ask an agent to read a plan file you give it and list destroys. Compare with your own reading.

## Checklist

- [ ] I can describe the six steps of the loop.
- [ ] I know the seven rules that never bend.
- [ ] I can name the four drift layers and how often each runs.
- [ ] I handle drift in order: read, decide, fix forward, add a gate.
- [ ] No secret value is in git, and no one changes live systems by hand.

## For facilitators (speaker notes)

- **Slide 29.** Desired state lives in git. Terraform or OpenTofu for the cloud, with the plan in the merge request and the apply after merge. Kustomize base and overlays for Kubernetes. The GitOps controller pulls and reconciles with prune and self-heal. Secrets are names only: ExternalSecret, a vault, SOPS. Promote the same digest from staging to production.
- **Slide 30.** Drift is any difference between desired state in git and the actual state. You cannot prevent every drift. You find it fast and close it by git. Task 3 of Gate 3 tests this.

## Where to go next

Continue with [Deck 15: ITIL practices in git](/library/deck-15-itil-in-git-change-and-incident). The longer page is [IaC, GitOps and drift](/library/iac-gitops-and-drift).
