---
title: "Shiftwren example, week 6: catalogue and demo"
description: "Week 6 filled in for a fictional volunteer-shift service: the Master Catalogue header, a full catalogue entry with entities and relationships, a five-minute demo and the epic-management evidence."
section: "Shiftwren example"
order: 6
level: core
duration: "55 min to read, then write your own entry"
outcomes:
  - "See a catalogue entry in which every field is filled or honestly marked."
  - "See entities and relationships whose links resolve, and one that does not yet."
  - "See a five-minute demo plan and the evidence of epic management."
prerequisites:
  - shiftwren-week-5-brand-website-and-mockups
  - week-6-catalogue-demo-package
  - product-catalogue-standard
---

**Fictional example.** Shiftwren, its people, numbers and dates are made up. Targets marked "simulated" were never measured. Do not copy this page.

**Example only.** An AI agent drafted this page to show the shape of the work. In the story, the fictional learner **Noor** wrote every value herself. An agent only cross-checked names between the catalogue and the roadmap.

Compare: [Week 6](/library/week-6-catalogue-demo-package), the [full TrailMug catalogue](/library/catalogue-trailmug-full-example), the [TrailMug catalogue entry template page](/library/template-catalogue-entry) and the real-product [decision, catalogue and change case study](/library/case-study-danhup-decision-catalogue-change).

## Step 1: The Master Catalogue

The Master layer is the [Week 1 map](/library/shiftwren-week-1-the-whole-product) with a header from the [metadata page](/library/catalogue-metadata-and-fields), plus fresh statuses. Of 12 rows: 8 FOUND (the ops row is a draft), 2 PLANNED, 2 NOT FOUND.

| Field | Value |
|---|---|
| Product | Shiftwren |
| Catalogue type | Master |
| Owner | Noor (fictional) |
| Version, status | 0.1, Draft |
| Last updated, next review | 2027-02-17, 2027-05-17 |
| Related catalogues | ORBITAL, ANDROID, Tech (short versions below) |

**Change note, 2027-02-17.** Milestone 1.1 shipped to the dev environment. `shiftwren-app` can post and accept a shift. `shiftwren-svc-cover` stays PLANNED.

| Layer | Short version |
|---|---|
| ORBITAL | Objective: 10 pantries using it weekly (example). Indicator: cancelled shifts refilled in 24 hours |
| ANDROID | Agents build issues from approved milestones. A person reviews and merges. Delivery is the roadmap |
| Tech | A small web app, a message workflow and a static site, hosted from git. Choices are not recorded yet |

## Step 2: The catalogue entry

Template: [Service catalogue entry](/library/template-catalogue-entry). Noor wrote an entry for the app.

| Field | Value |
|---|---|
| id | shiftwren-app |
| name | Shiftwren app |
| kind | service |
| owner | lead-builder (Priya, placeholder) |
| tier | 2 (tag tier-2) |
| lifecycle | incubating |
| description | Coordinators post shifts. Volunteers accept them from a link. |
| repos | shiftwren/shiftwren-app |
| dependencies | shiftwren-int-email |
| slt.availability | 99 percent (simulated) |
| slt.latency_p95_ms | 1000 (simulated) |
| slt.support_response | First reply in 2 working days |
| support.contact | The product manager's queue |
| support.issue_tracker | shiftwren/shiftwren-app |
| runbook | NOT FOUND. Planned: docs/runbooks/shiftwren-app.md |
| data_classification | confidential (tag data-confidential), because of phone numbers |
| adrs | None yet |
| licences | None yet |
| links | service: app.shiftwren.example; support: the issue tracker |
| tags | tier-2, data-confidential, volunteers |

**Entities.** Owner is an organisation slug. Source is `manual, manual, 2027-02-17T10:00:00Z` for every row.

| Slug | Name | Kind | Status | Owner | Parent | Description | Tags |
|---|---|---|---|---|---|---|---|
| shiftwren | Shiftwren | product | incubating | shiftwren-team | none | Volunteer shift cover for pantries | tier-2 |
| shiftwren-app | Shiftwren app | service | incubating | shiftwren-team | shiftwren | Post and accept shifts | tier-2, data-confidential |
| shiftwren-app-repo | Shiftwren app repository | repo | active | shiftwren-team | shiftwren-app | Source of the app | volunteers |
| shiftwren-int-email | Email sender | service | active | shiftwren-team | shiftwren | Sends sign-in links | tier-3 |

Links: the product and app rows link to app.shiftwren.example. The repository row links to shiftwren/shiftwren-app. The email row has none, because it is a vendor dashboard with no public address. A new service starts as incubating and becomes active after a verified production change.

**Relationships.**

| From | To | Type | Description | Target exists? |
|---|---|---|---|---|
| shiftwren-app-repo | shiftwren-app | implements | The repository is the app's source | Y |
| shiftwren-app | shiftwren | implements | The app is part of the product | Y |
| shiftwren-app | shiftwren-int-email | depends-on | Sign-in links need email | Y |
| shiftwren-app | shiftwren-svc-cover | depends-on | Later: ask-next needs it | N. It is PLANNED. Add the edge after the entity exists |

**Search answers.** (1) A search for "volunteer shift app" should return `shiftwren-app` first. (2) A lookup of `shiftwren-app` shows owner, incubating status, tags and three edges. (3) The map cannot hold tier, lifecycle, service levels or support contact yet. Noor wrote the platform request: add those fields.

**What to notice.** The entry hides nothing. The runbook is NOT FOUND, the service levels are simulated, and one relationship waits for a target that does not exist. A catalogue with no such gaps would be suspicious. Each gap is a task for the next review.

## Step 3: The five-minute demo

1. Say who: Ines, a pantry coordinator, and her problem: chasing cover.
2. Show the journey with fake data: post "Thursday sorting", open the link on a phone as a test volunteer, accept, and see the name on the coordinator page.
3. Show what is not finished: asking the next person is not built. Say so, and show the mockup.
4. End with the next epic and why: epic 1 continues, then privacy.

## Step 4: Evidence of epic management

- Four epic files with their history in git.
- A moved date with its reason: epic 2 due 2027-05-14 became 2027-05-28 (the adviser needs more time).
- The decision log entry of 2027-02-03.
- Weekly notes, six so far.
- Milestone 1.1 closed, with a link to the merged work.
- Three AI-use lines from weeks 2, 4 and 5.

## Fill your own blank from this page

The catalogue entry template: **Catalog entry** is Step 2's first table; **Entities**, **Relationships** and **Search answers** follow it. Step 1 gives the Master header. Steps 3 and 4 map to Product Package parts 6 and 8.

## Working with AI agents

An agent compared the catalogue and the roadmap. Brief: "List any service named in one and missing in the other. Do not edit." It found `shiftwren-svc-cover` in the roadmap only, which was correct: it is PLANNED. An agent **may not** mark a row FOUND without evidence.

## The 2030 Product Development Manager lens

- **You decide:** what the package claims and which evidence backs it.
- **You delegate:** cross-checks of names and links, with the brief above.
- **You verify by:** opening three cited items yourself.
- **Disciplines involved:** product, operations, engineering, security, support and finance.
- **On the agent ladder:** **delegate** and **govern**: one owner and a review date keep the catalogue honest.

Back to the [Shiftwren example index](/library/shiftwren-example).
