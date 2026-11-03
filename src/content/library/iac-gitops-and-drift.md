---
title: "Everything as code, GitOps and drift"
description: "Run infrastructure and applications from git, keep secrets out, and find and close drift."
section: "Master Developer"
order: 6
---

## Desired state and actual state

- **Desired state** is what git says should exist.
- **Actual state** is what is really running.
- **Drift** is any difference between them.

The aim of everything-as-code is to make the desired state live in git and to make the actual state follow it.

## Idempotency

An action is **idempotent** if running it twice gives the same result as running it once. Declarative tools are idempotent: you say what you want, not the steps to get there. This makes them safe to repeat.

## Infrastructure as code (IaC)

**IaC** means the setup of your cloud (networks, servers, databases, DNS) is written as files in git. Tools such as Terraform and OpenTofu read the files and create the resources.

Good habits:

- **State.** The tool keeps a record of what it created. Store that record in a shared, locked, backed-up place.
- **Plan in the merge request, apply after merge.** The plan shows exactly what will change. A person reads it.
- **Modules and environments.** Reuse the same code for test, staging and production, with different settings.
- **No clickops.** Never change a cloud setting by hand in a web console. A hand change is invisible and will be undone or forgotten.

## GitOps for Kubernetes

**GitOps** means a controller inside the cluster watches git and makes the cluster match it. Four principles (from the OpenGitOps project): the system is declarative, versioned in git, pulled automatically, and continuously reconciled.

Useful ideas:

- **App-of-apps and application sets.** One parent definition creates many applications, so adding an environment is a small change.
- **Sync policy.** *Prune* removes things that are no longer in git. *Self-heal* undoes manual changes. Together they make git the only way to change the cluster.
- **Sync waves.** Order matters. Create namespaces and databases before the apps that need them.

## Never change the cluster by hand

Do not run commands that create, patch or apply objects directly. Read-only commands (get, describe, logs, diff) are fine. All changes go through git.

## Secrets: never plaintext

A secret is a password, key or token. Rules:

1. Never commit a plain secret.
2. Store the value in a secret manager.
3. In git, keep only a reference (the secret's **name**). A tool such as an external-secrets operator fetches the value at runtime.
4. If a secret must be in git (rare), encrypt it first with a tool such as SOPS.
5. If a secret leaks, rotate it at once. That is a real emergency.

## The delivery spine

Every change passes the same stages:

1. **Source checks.** Lint, tests, secret scan, licence scan.
2. **Supply chain.** Build the image, make the SBOM, sign it.
3. **Artifact security.** Scan the image. Send findings to one tracker.
4. **Deployment.** Update git. The controller rolls it out.
5. **Governance.** Record the change and its evidence.

Promotion from test to staging to production uses the **same image digest**. You do not rebuild for production. What you tested is what you ship.

## Drift: find it and close it

Look for drift in four layers:

1. **Cloud.** Resources changed in the console.
2. **Cluster.** Objects changed by hand.
3. **Image.** A running image that is not the one git names.
4. **Secrets and settings.** Values changed outside the store.

### Closing drift

1. **Detect.** A plan that shows changes you did not make, or a controller that says out of sync.
2. **Decide.** Is the manual change right or wrong?
3. **If wrong:** let self-heal revert it, or re-apply from git.
4. **If right:** write it into git by merge request. Now git is true again.
5. **Prevent.** Remove the permission that allowed the manual change, or add an alert.

You close drift by a change in git. You do not close it by another manual change.

## Key points

- Git holds the desired state. Controllers make reality follow.
- No clickops. No manual cluster changes. No plain secrets.
- Promote the same digest. Fix drift through git.
