---
title: "Kubernetes and GitOps"
description: "Understand how Kubernetes runs software and how GitOps keeps it honest, so you can direct agents that change a cluster and judge what they propose."
group: "engineering"
order: 4
icon: "container"
level: "core"
skills: [kubernetes-gitops, cloud-platforms]
outcomes:
  - "Explain pods, deployments, services and the control loop that keeps a cluster in its desired state"
  - "Read a Kubernetes manifest and spot missing limits, probes, secrets in plain text and risky settings"
  - "Explain GitOps: git as the source of truth, automatic sync, drift and promotion"
  - "Direct an agent to change a cluster only through a merge request, and verify the result"
---

**Kubernetes** is software that runs other software. You tell it what you want, for example "three copies of the sign-up service, each with this much memory", and it works to make that true and keep it true, restarting what crashes and spreading copies across machines. It is the most widely used way to run containers at scale, and every large cloud sells it as a managed service.

**GitOps** is the habit that makes Kubernetes safe to share with agents: the git repository describes what should run, and an automatic process makes the cluster match it. Nobody types commands into production. They propose a change in git, and a person reviews it.

This track gives you **enough depth to direct and judge**. You will not memorise commands. You will learn to read the description of a system, notice what is missing, and ask the questions that find weak spots.

## Who this is for

Product managers, founders and developers who will ask agents to deploy and change software running on Kubernetes. You should know what a container and a pipeline are. See [CI/CD](/library/tracks/ci-cd) and [Cloud platforms](/library/tracks/cloud-platforms). You need no Kubernetes experience.

## What you will be able to do

- Explain the pieces: cluster, node, pod, deployment, service, namespace, and what each is for.
- Describe the control loop: you declare, Kubernetes compares and corrects.
- Read a manifest and answer: what runs, how many, with what limits, how it is checked for health, and who can reach it.
- Explain GitOps in four sentences, and what **drift** means and why it is dangerous.
- Direct an agent to write a change, open a merge request and wait for the sync, and then check the real state.
- Ask the right security, reliability and cost questions about a cluster.

## The four lessons

| # | Lesson | What you learn |
|---|---|---|
| 1 | From containers to clusters | What Kubernetes is, its parts and the control loop |
| 2 | Reading manifests | Deployments, services, limits, probes, config and secrets |
| 3 | GitOps in practice | Git as the source of truth, sync, drift, promotion |
| 4 | Judging a cluster | Troubleshooting, security basics, cost, and what agents may touch |

## How it maps to the program

The Master Developer program expects infrastructure and deployment to live in git and to change only through reviewed merge requests, with automatic sync and drift treated as a defect. See [Everything as code, GitOps and drift](/library/iac-gitops-and-drift). This track is the technical background for that rule, and lesson 3 is the rule itself in practice.

## Tool neutral, concept first

Examples use plain Kubernetes manifests and refer to the two best-known GitOps tools, Argo CD and Flux. Both are open source. Everything in the track works the same if you choose another tool. Where a managed cloud service differs, the lesson says so.

## The running example

TrailMug, the fictional reusable-cup product, runs its sign-up service on a small cluster. Maya directs agents to deploy and change it, and reviews every change in a merge request. People and numbers are invented.

## Time needed

About 75 to 90 minutes per lesson, so six hours for the track. Hands-on work needs a throwaway local cluster or a free practice environment, never a shared or production cluster. Each exercise ends with your spec, your agent brief and your review notes in git.

## Pair it with

[CI/CD](/library/tracks/ci-cd) before it. [Infrastructure as code](/library/tracks/infrastructure-as-code) and [Security fundamentals](/library/tracks/security-fundamentals) alongside it. [Observability and service management](/library/tracks/observability-and-service-management) after it, to know whether what runs is healthy.
