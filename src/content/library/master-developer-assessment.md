---
title: "Master Developer assessment"
description: "Gates, practical tasks and the oral review used to certify a Master Developer."
section: "Master Developer"
order: 8
---

You are assessed on evidence in git, not on memory alone.

## The four gates

Pass the gates in order. A gate needs both a written test and an observed practical.

| Gate | Checks | Practical |
|---|---|---|
| 1. Platform literacy | The platform page and the rules of The Way | Trace a change from issue to running system. 40 minutes. No AI. |
| 2. OSS-first and licences | The ladder, licences and patch sets | Check a licence and write a decision record. 60 minutes. |
| 3. GitOps, IaC and drift | Everything as code | Close a drift by a change in git. 45 minutes. |
| 4. Service management | Catalogue, change, incident | Write a change and handle an incident. 60 minutes. |

Then a final mixed exam and an oral review.

## Critical behaviours

A failure on any one fails the practical at once.

1. No plain secrets in git. Names only.
2. No direct changes to a cluster. Only read-only commands and git.
3. Fix forward, not revert.
4. Check the licence before you adopt.
5. The merge request is the change record.

## Practical capstone

Take one product and one component from "we need it" to "it runs and we can explain it". Five steps:

1. Write the epic and roadmap by hand. Choose an open source tool with a scorecard, a licence check and a decision record.
2. Patch set with an update bot, or an alternative deliverable.
3. Declarative infrastructure and delivery from git, with a drift test.
4. Catalogue entries.
5. A change record and an incident rehearsal.

## Grading

Six skills with weights that total 100: OSS selection, patch set, infrastructure as code and GitOps, catalogue, change and incident, and the human-owned plan. Pass mark: 70 points **and** all mandatory items. Levels: Missing (0%), Developing (50%), Proficient (80%), Master (100%).

## Oral review

Questions test judgement:

- Why do humans write the epics?
- Why do we look for open source first?
- Why do we fix forward?
- Why never change a cluster by hand?
- Explain the AGPL trap for a service business.
- Patch set or hard fork: when, and how do you exit?
- What is drift and what do you do when you find it?
- When is a change an emergency?
- How do you steer AI agents safely?

## Integrity

You work alone unless a task says otherwise. You disclose all AI use. Evidence stays in a private repo. Renewal is by review every 12 months.
