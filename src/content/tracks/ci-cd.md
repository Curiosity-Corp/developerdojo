---
title: "CI/CD"
description: "Read a pipeline, judge what it proves, and direct agents to build and fix pipelines: tests, images, quality gates, delivery and pipeline security."
group: "engineering"
order: 2
icon: "workflow"
level: "core"
skills: [ci-cd, git-gitlab]
outcomes:
  - "Read a pipeline file and say what each stage proves"
  - "Direct an agent to add a test or build stage, and verify the result"
  - "Design quality gates and a promotion path that ships the same artifact everywhere"
  - "Ask the right security questions about a pipeline, its secrets and its supply chain"
---

**CI/CD** stands for continuous integration and continuous delivery. Every time someone proposes a change, a machine builds the software, runs the tests and checks the rules. If the checks pass, the change can ship. If they fail, it cannot. For a person who directs AI agents, the pipeline is the most important machine in the building. It is the impartial judge that does not care how confident the agent sounded.

This track does not make you a pipeline author who types YAML all day. Agents will write most of it. It gives you **enough depth to direct and judge**: to read a pipeline file, to see what it proves and what it does not, and to ask the questions that find weak spots.

## Who this is for

Product people and developers who ship software with agents. You should be comfortable with merge requests (see [Git and GitLab](/library/tracks/git-and-gitlab)). You do not need to know any pipeline language beforehand.

## What you will be able to do

- Explain pipelines, stages, jobs, runners, artifacts and environments in plain words.
- Read a short pipeline file and spot a missing test stage, a risky deploy or a secret in the wrong place.
- Write a spec and a brief for an agent that adds a check, then verify the pipeline really fails when it should.
- Design a delivery path where the same tested artifact moves from test to production.
- Use the delivery metrics from DORA research with care, and without turning them into scores for people.
- Ask security questions: where do secrets live, what can a job reach, how do we know what we shipped?

## The four lessons

| # | Lesson | What you learn |
|---|---|---|
| 1 | Pipelines from first principles | What CI and CD are, and how to read a pipeline file |
| 2 | Build, test and containers | Tests as the judge, images, caches and artifacts |
| 3 | Quality gates and delivery | Environments, promotion, review apps, merge trains, delivery metrics |
| 4 | Securing the pipeline | Secrets, scanning, supply chain, and what agents may touch |

## How it maps to the program

The Developer six weeks name pipelines in week 4, when agents build and merge requests carry the proof. The Master Developer program describes a delivery spine of source checks, supply chain, artifact security, deployment and governance, and promoting the same image digest through each environment. See [Everything as code, GitOps and drift](/library/iac-gitops-and-drift). This track teaches the ideas behind each stage, using GitLab CI/CD as the example, and notes the same concepts in GitHub Actions and other tools.

## Tool neutral, GitLab first

The examples use GitLab CI/CD because the Dojo's repositories live on GitLab. The ideas are the same everywhere: a file in the repository describes the pipeline, a runner executes it, and the result gates the merge. Where a GitLab feature needs a paid plan, the lesson says so.

## The running example

TrailMug, the fictional reusable-cup product, supplies the pipeline: lint, test, build the site, deploy a preview. Maya directs agents to add and fix stages. The people and data are invented.

## Time needed

About 75 to 90 minutes per lesson. The whole track takes six to eight hours. Each exercise ends with your spec, your agent brief and your review notes in git, so you can show how you directed and judged the work.

## Pair it with

[Git and GitLab](/library/tracks/git-and-gitlab) before it, and [Security fundamentals](/library/tracks/security-fundamentals) and [Kubernetes and GitOps](/library/tracks/kubernetes-and-gitops) after it.
