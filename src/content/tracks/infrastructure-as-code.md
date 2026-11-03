---
title: "Infrastructure as code"
description: "Describe cloud infrastructure in files, review the plan before anything changes, and judge what agents write with Terraform and OpenTofu."
group: "engineering"
order: 5
icon: "blocks"
level: "core"
skills: [infrastructure-as-code, cloud-platforms, git-gitlab]
outcomes:
  - "Explain infrastructure as code, declarative description and the plan-then-apply cycle"
  - "Read a Terraform or OpenTofu file and a plan, and say what will be created, changed or destroyed"
  - "Explain state, modules and environments, and where the risks are"
  - "Direct an agent to write infrastructure code through a merge request, and verify the plan before anything is applied"
---

**Infrastructure as code** (IaC) means that the servers, networks, databases and permissions your product runs on are described in text files, kept in git, and created by a tool reading those files. Instead of clicking through a cloud console, you write what you want. The tool compares it with what exists, shows you the difference, and, once you approve, makes the change.

For someone directing AI agents this is the safest way to let them near infrastructure. An agent can write a file, and a person can read the file and the plan before anything real changes. The alternative, an agent clicking or typing live commands, leaves no record and no review.

This track gives you **enough depth to direct and judge**: to read a file, read a plan, notice that something will be destroyed, and ask whether the change is safe.

## Who this is for

Product managers, founders and developers who will ask agents to create or change cloud resources. You should know the basic cloud parts from [Cloud platforms](/library/tracks/cloud-platforms) and how a merge request works from [Git and GitLab](/library/tracks/git-and-gitlab). You do not need to write code.

## What you will be able to do

- Explain declarative description: you state the end result, the tool works out the steps.
- Read a short Terraform or OpenTofu file: providers, resources, variables, outputs.
- Read a plan and pick out the lines that matter: what is added, changed, and above all **destroyed or replaced**.
- Explain **state**: the tool's memory of what it has built, why it must be protected, and why it must be shared.
- Explain **modules** as reusable packages, and **environments** as separate copies.
- Run the loop in a pipeline: plan in the merge request, apply after approval, detect drift.
- Ask security and cost questions about infrastructure code, and set what agents may do.

## The four lessons

| # | Lesson | What you learn |
|---|---|---|
| 1 | Describing infrastructure | Declarative files, resources, and the plan and apply cycle |
| 2 | State, modules and environments | The tool's memory, reuse, and separate copies |
| 3 | Infrastructure code in the pipeline | Plan in the merge request, apply after approval, drift |
| 4 | Judging and securing infrastructure code | Reading a risky plan, secrets, scanning, blast radius |

## How it maps to the program

The Master Developer program says everything is code, production changes only through reviewed merge requests, and drift is a defect. See [Everything as code, GitOps and drift](/library/iac-gitops-and-drift). This track is how that rule is applied to cloud resources; the [Kubernetes and GitOps](/library/tracks/kubernetes-and-gitops) track applies it to what runs on a cluster.

## Terraform and OpenTofu

Terraform is the best-known tool, made by HashiCorp. OpenTofu is an open source, community-governed fork that uses the same language and ideas. The Way prefers open source first, so the examples work with either, and the lessons say "the tool". Check the current licence terms of any tool before you build a business on it; see [Open source licences](/library/open-source-licences). Pulumi, the cloud providers' own template languages and others exist, and the ideas carry over.

## The running example

TrailMug, the fictional reusable-cup product, needs a bucket for its site, a small database and a few permissions. Maya directs agents to write the code, and reads every plan. People and numbers are invented.

## Time needed

About 75 to 90 minutes per lesson, so six hours for the track. Hands-on work needs a free or throwaway cloud account with a budget alert, or the tool's local practice mode; never your production account. Each exercise ends with your spec, your agent brief and your review notes in git.

## Pair it with

[Cloud platforms](/library/tracks/cloud-platforms) before it, and [CI/CD](/library/tracks/ci-cd) alongside it. [Security fundamentals](/library/tracks/security-fundamentals) after it for the defensive view.
