---
title: "Master Developer: the second rank"
description: "What a Master Developer knows beyond the Developer path: the platform, production launch and AI-agent orchestration."
section: "Master Developer"
order: 1
level: advanced
duration: "30 min"
outcomes:
  - "Say what changes between a Developer and a Master Developer."
  - "Name the six ideas of the platform level."
  - "Know the four gates, the capstone and the badge."
  - "Know what you leave with."
resources:
  - opengitops/principles
  - backstage/what-is-backstage
  - spdx/license-list
  - atlassian/itsm
  - google-sre/service-level-objectives
  - adr/architectural-decision-records
prerequisites:
  - developer-path-overview
  - program-two-levels-and-capstone
---

## In short

A Developer owns one product. A Master Developer owns the ground that products stand on. You learn the platform that every product shares. You choose open source tools with evidence and check their licences. You run systems from git, and you close drift with a change. You handle changes, incidents and service levels in git. Then a five-day capstone takes one product and one component to production. Gates, an exam, a project and an oral review lead to the badge.

AI agents build manifests, scripts and drafts after you decide. You still write your epics yourself. On the agent ladder, this rank adds orchestrate: several agents across repos.

### Key words

- **GitOps:** A controller makes a system match what is in git, continuously.
- **Drift:** Any difference between desired state and actual state.
- **Change record:** The record of a change: reason, risk, review, checks. In git, the merge request.
- **Incident:** An unplanned break or drop in quality of a service.
- **Service level (SLI, SLO, SLA):** An indicator you measure, an objective you aim for, and an agreement you promise.

A **Developer** owns one product end to end. A **Master Developer** owns the ground that products stand on, and can launch a product into production with AI agents doing much of the building.

## What changes

| Developer | Master Developer |
|---|---|
| Plans one product | Plans across products and shared parts |
| Uses tools others chose | Chooses tools with evidence and records why |
| Ships to a test site | Launches to production safely |
| Steers an agent on one milestone | Orchestrates several agents across repos |

## The six ideas

1. **The platform.** The shared ground every product stands on. [Read](/library/internal-developer-platform).
2. **The open-source-first ladder.** How to choose between search, use, patch and build. [Read](/library/oss-first-ladder).
3. **Licences.** How to check them and avoid traps. [Read](/library/open-source-licences).
4. **Patch sets and forks.** How to adopt a tool and keep your changes small. [Read](/library/patch-sets-and-forks).
5. **Everything as code, GitOps and drift.** How to run systems from git. [Read](/library/iac-gitops-and-drift).
6. **Service management in git.** Change records, incidents and service levels. [Read](/library/itil-in-git).

## Two tracks, then a capstone

Learn to run a whole product and the platform it stands on, not just one repository.

| Part | Length | What it covers |
|---|---|---|
| Developer level (plan the whole product) | Four core weeks, six on this site | Repository map, personas, journeys and your own epic roadmap in git. See [the Developer path](/library/developer-path-overview). |
| Master Developer level (platform and GitOps) | Four weeks | The internal developer platform, the open-source-first ladder with licence rules and the decision record, patch-forks, infrastructure as code, GitOps and drift, and service management in git where the merge request is the change record |
| Capstone | Five days | One product and one component from need to production, with a catalogue entry, a change record and an incident rehearsal |
| Gates and badge | After the capstone | Tests, practicals, a final exam and an oral review lead to the Master Developer badge |

### The platform weeks

| Week | Theme | Page |
|---|---|---|
| 1 | The company platform | [Internal developer platform](/library/internal-developer-platform) |
| 2 | The OSS-first ladder and licences | [OSS-first ladder](/library/oss-first-ladder), [Open source licences](/library/open-source-licences) |
| 3 | Patch-forks, infrastructure as code, GitOps and drift | [Patch sets and forks](/library/patch-sets-and-forks), [IaC, GitOps and drift](/library/iac-gitops-and-drift) |
| 4 | Service management in git and capstone preparation | [ITIL in git](/library/itil-in-git) |

The reading for these weeks is in [the platform learning track](/library/learning-path-platform-track) and [the learning path, week by week](/library/learning-path-week-by-week). The matching skill tracks are [Pipelines](/library/tracks/ci-cd/01-pipelines-from-first-principles), [Describing infrastructure](/library/tracks/infrastructure-as-code/01-describing-infrastructure), [GitOps in practice](/library/tracks/kubernetes-and-gitops/03-gitops-in-practice) and [Secrets and identity](/library/tracks/security-fundamentals/02-secrets-and-identity).

## What you leave with

- A roadmap in git that you wrote and can defend out loud, with a product map, personas and journey maps.
- A decision record, a patch set, infrastructure and delivery manifests, a catalogue entry and a change record, all in git, for a component that runs.
- A free-first learning path with every link checked.

## How a Sensei works with you

At the Master Developer level your Sensei reads your git history, asks you to explain each choice without notes, and reviews the capstone and the oral review with you. See [how your Sensei works with you](/library/program-how-sensei-work) and [how you are assessed](/library/program-assessment-and-pass-level).

## The rules do not change

You still write your epics yourself. AI may build manifests, scripts and drafts after you decide. You disclose AI use. Every decision and risk carries a human name.

## What you can do at the end

- Name the parts of a delivery platform and say what each one is for.
- Pick a tool with a scorecard, a fit score and a licence check, and write the decision down.
- Explain what drift is and close it with a change in git.
- Write a change record and an incident review.
- Run a small production launch where every step is in git.

## How you are assessed

Four gates, a final exam, a practical project and an oral review. See [Master Developer assessment](/library/master-developer-assessment).

## Note on honesty

Every claim about a system must be marked **built**, **partial** or **planned**. Nothing planned may be called running. A gap you can name is a gap you can plan.

## Working with AI agents

- **May:** read licence files and quote them, draft manifests from a design you chose, check a change record for missing fields.
- **May not:** choose the licence, change a cluster directly, hold secrets, or write your epics.
- **A safe brief:** "Open the LICENSE file of this repository at this tag. Quote the first ten lines and the path. Do not summarise."

## The 2030 Product Development Manager lens

- **You decide:** which tools the product accepts, what is risky and when to launch.
- **You delegate to agents:** manifests, scans, change-record drafts and release notes, each within a written scope.
- **A sample brief:** "Draft the change record for this merge request from its description. Leave the risk decision empty. Do not approve."
- **You verify by:** reading the evidence and signing the risk decision yourself.
- **Disciplines involved:** platform, security, legal awareness, operations and finance.
- **On the agent ladder:** this level adds **orchestrate** and **govern**. See [the catalogue framework](/library/catalogue-framework-overview) for the shared memory that makes this safe.
