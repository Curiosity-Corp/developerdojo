---
title: "Service management in git"
description: "ITIL ideas (catalogue, change, incident, service levels) done with merge requests, issues and files."
section: "Master Developer"
order: 7
---

**ITIL** is a widely used set of practices for managing IT services. You do not need heavy tools to use its ideas. This page shows how to do the core ones in git.

## ITIL in one page

ITIL 4 describes how value flows from ideas to customers. Key practices for developers:

- **Service catalogue.** What you offer, with an owner and a promise for each.
- **Configuration management.** What parts exist and how they connect.
- **Change enablement.** How changes are made safe, visible and quick.
- **Incident management.** What you do when something is broken now.
- **Problem management.** Finding and fixing the cause behind repeated incidents.
- **Service levels.** What you promise about availability and speed.

Three rules run through it all:

1. The merge request is the change record.
2. Git is the source for the configuration view.
3. We fix forward.

## The catalogue

Give every product and service a **catalogue entry**: a small file in git. See [Catalogue entry](/library/template-catalogue-entry) and [Product Catalogue standard](/library/product-catalogue-standard).

## The configuration view

A **configuration item (CI)** is anything that must be managed to deliver a service: a repo, an app, a database, a domain. The catalogue and the repo map are your configuration view. Keep git as the source and generate any dashboards from it. If the view and reality disagree, that is drift. Fix it.

## Change enablement

A **change** is anything that adds, modifies or removes something that could affect a service. The aim is not to slow people down. The aim is to make every change safe, visible and quick.

**The merge request is the change record.** It holds the reason, the diff, the review, the pipeline results and the merge time. Add a small template so the human risk decision is written down.

### Three change types

| Type | Meaning | Example | Who decides |
|---|---|---|---|
| Standard | Low risk, repeated, approved once | A routine dependency patch update. A copy fix on a website. | The pattern was approved once. The owner reviews the diff. |
| Normal | Needs assessment | A new feature, a database change, a new integration | A human with the owner role |
| Emergency | Must happen now to stop active harm | Revoke a leaked secret. Stop a customer-facing outage. | The incident lead, with the owner told at once. Review follows. |

"The deadline is today" is not an emergency.

### The advisory board as a rule

A **change advisory board (CAB)** judges risky changes. You can express it in git: **code owners** (named people who must approve changes to certain files) plus approval rules. No meeting for ordinary work. The board is a rule.

### Risk lives in the template

The merge request template asks for impact, likelihood, blast radius, data touched, dependencies, the window, and a recovery plan.

### The pipeline is the evidence

Green checks are the approval evidence. Nobody merges on red.

### Rollback is fix forward

Recovery means a forward fix, perhaps with a feature switch to stop harm. Not a revert. See [Fix forward](/library/fix-forward).

### Merge trains

A **merge train** tests each merge request on top of the queue before it merges, so main stays green.

Copy the [change record template](/library/template-change-record).

## Incidents and problems

An **incident** is an unplanned break or drop in quality. Handle it like this:

1. **Declare.** Open an incident issue. Name an incident lead.
2. **Stop the harm.** A switch, a block, a fix. Not a hunt for blame.
3. **Communicate.** Tell affected people plainly. Update the status page.
4. **Fix forward.** A change record with the emergency label.
5. **Review.** Within a few days hold a **blameless review**: what happened, why, what we change. Blameless means we study the system, not the person.
6. **Add a gate.** A test, check or rule so it cannot recur.

A **problem** is the cause behind repeated incidents. Track it as an issue with a label.

## Service levels

- **SLI** (indicator): something you measure, such as the share of requests that succeed.
- **SLO** (objective): your target, such as 99.9% per month.
- **SLA** (agreement): a promise to a customer, often with a penalty.
- **Error budget:** the amount of failure the target allows. It turns "how reliable?" into a decision.

100 percent is the wrong target. It costs too much and stops you from changing anything.

Write service levels on a one-page **service level sheet** per service and link it from the catalogue entry.

## Key points

- The merge request is the change record.
- Code owners and approval rules play the role of a board.
- Incidents get a blameless review and a new gate.
- Service levels are small, honest and written down.
