---
title: "A full catalogue for TrailMug"
description: "One complete, fictional product catalogue: the metadata header, the Master rows, ORBITAL, ANDROID and Tech filled in, with a governance note and a completed checklist."
section: "Catalogue framework"
order: 8
level: core
duration: "75 min"
outcomes:
  - "Read a complete four-layer catalogue for one product."
  - "See how names, owners and links stay consistent across the layers."
  - "See honest NOT FOUND, PLANNED and simulated entries."
  - "Use it as a shape to compare against your own, never as text to copy."
resources:
  - atlassian/service-catalog
  - backstage/software-catalog
  - c4model/c4
  - atlassian/smart-goals
  - google-sre/service-level-objectives
  - opengitops/principles
prerequisites:
  - catalogue-framework-overview
  - catalogue-metadata-and-fields
---

TrailMug is a fictional product: a deposit-based reusable cup scheme for cafés. All names, numbers and dates below are made up. The point is the **shape**. Your product needs your own evidence. If you copy this, you learn nothing and you get a catalogue you cannot defend.

The example is split into the four layers. Each part starts with its own metadata header, as the [metadata page](/library/catalogue-metadata-and-fields) teaches. The rules come from [governance and the checklist](/library/catalogue-governance-and-checklist).

## Part 1: Master catalogue

| Field | Value |
|---|---|
| Product or system | TrailMug |
| Catalogue type | Master |
| Document owner | Product manager (placeholder: Maya) |
| Version | 1.2 |
| Status | In review |
| Last updated | 2027-03-18 |
| Next review | 2027-06-18 |
| Related catalogues | ORBITAL, ANDROID and Tech (below) |

| Name | URL or domain | Type | Purpose | Ties into | Owner | Planning access | Status | Notes and findings |
|---|---|---|---|---|---|---|---|---|
| trailmug-planning | Group `trailmug` on the git host | Documentation | Epics, roadmap and these catalogues | All parts, through epics | Maya | Write | FOUND | Opened 2027-03-02 |
| trailmug-site | trailmug.example | Application | Public marketing site and leads form | Links to app sign-in; posts the leads form to the CRM | Marketing lead | Write | FOUND | Live. Opened 2027-03-02. |
| trailmug-app | app.trailmug.example | Application | Member app: find a café, scan a cup | Calls returns service and payments; signs in through the sign-in service | Maya | None (proprietary) | FOUND | In beta. Code not visible to planners. |
| trailmug-svc-returns | api.trailmug.example/returns | API | Records each cup return and starts the refund | Called by the café tablet page and the app; calls the email sender; writes to the CRM | Operations lead (Leo) | Write | FOUND | Running. No alert if a refund fails for more than a day. |
| trailmug-pay | Payments provider dashboard | Cloud service | Takes deposits and pays refunds | Called by the app and the returns service | Finance lead | None | FOUND | Running. Checked the provider dashboard 2027-03-02. |
| trailmug-int-email | Email sender dashboard | Integration | Sends refund and welcome emails | Called by the returns service | Leo | Not applicable | FOUND | Chosen in ADR-0001 |
| trailmug-crm | CRM dashboard | Cloud service | Holds café owners and leads | Fed by the site form and the returns service | Sales lead | Write | FOUND | Free tier |
| trailmug-ops | Group `trailmug`, repository `trailmug-ops` | Documentation | Terms, privacy, tracking rules, runbooks | All | Leo | Write | FOUND | Runbook for returns linked |
| trailmug-status | Not available | Application | Public status page | Would read health checks from the app | Not confirmed | Not applicable | NOT FOUND | Searched the group and the domain list on 2027-03-02. A planned epic. |
| trailmug-svc-reports | Not available | API | Weekly café reports | Would read returns data | Not confirmed | Not applicable | PLANNED | Proposed in the roadmap, epic 6. Not started. |

**Commentary.** Two rows are NOT FOUND or PLANNED, and say so. One owner is "Not confirmed". The app's planning access is "None" because the team does not touch its code. That is honest, not a defect.

## Part 2: ORBITAL catalogue

| Field | Value |
|---|---|
| Product or system | TrailMug |
| Catalogue type | ORBITAL |
| Document owner | Product manager (Maya) |
| Version | 1.0 |
| Status | In review |
| Last updated | 2027-03-18 |
| Next review | 2027-06-18 |
| Related catalogues | Master, ANDROID, Tech |

| Element | Entry |
|---|---|
| **O** Objective | A commuter always knows the status of her deposit. Scope: Dublin cafés, mobile app, refunds only. |
| **R** Resources | One product manager, two part-time engineers, trailmug-pay, trailmug-svc-returns, trailmug-int-email (all in Master) |
| **B** Budget | 18,000 euro over six months from the pilot grant. Assumes 2,000 active cups. Owner: finance lead. |
| **I** Indicators | 90 percent of cups show refund status by 2027-06-30. Baseline: 0. Measured each Monday from the returns database. Also: 80 percent of returns confirmed within one hour. |
| **T** Transport | Cups move café to wash site by weekly pickup. Return data moves tablet to returns API in real time. |
| **A** Activities | Epic 1 returns status (Leo): milestone 1.1 status field live 2027-04-15; milestone 1.2 app screen 2027-05-13. Depends on payments approval. |
| **L** Logistics | Tablets bought for 12 cafés. Weekly café check-in call. Read access to the payments dashboard for finance. |

For the same product taught element by element, see [ORBITAL in full for TrailMug](/library/tracks/frameworks/15-orbital-trailmug-in-full).

**Commentary.** Resources use names from the Master layer. Every indicator has a number, a date, a baseline and a source. The budget has its assumption beside it.

## Part 3: ANDROID catalogue

| Field | Value |
|---|---|
| Product or system | TrailMug |
| Catalogue type | ANDROID |
| Document owner | Operations lead (Leo) |
| Version | 1.0 |
| Status | In review |
| Last updated | 2027-03-18 |
| Next review | 2027-06-18 |
| Related catalogues | Master, ORBITAL, Tech |

| Element | Entry |
|---|---|
| **A** Advancement | Beta now. Release 0.4 adds refund status. Next stage: public pilot in 12 cafés. |
| **N** Networking | App to payments (take deposit, outbound). Returns service to email sender (send notice, outbound). Café tablet to returns API (record return, inbound). Site form to CRM (add lead, outbound). |
| **D** Design | Journey map v2, wireframes for the status screen, decision: status in words as well as colour. Design ideas from an AI assistant are marked and were reviewed by Maya. |
| **R** Research | Ten café interviews (notes linked). Scan of three email senders in ADR-0001. |
| **O** Optimisation | An agent proposes test improvements as merge requests. A person reviews each one. No agent merges. |
| **I** Implementation | Two engineers build features. An agent drafts tests and docs. A person approves each merge request. |
| **D** Deployment | Deployment record below |

| Deployment record | Entry |
|---|---|
| Target environment | Production, one region |
| Deployed components | trailmug-svc-returns v0.4.1 |
| Responsible | Operations lead. A deployment agent applies the change after approval. |
| Configuration and secrets | Settings in the settings service. Secret name `EMAIL_API_KEY`, held in the secret store. |
| Release version | v0.4.1 |
| Validation | Returned a test cup and saw the status change in the app |
| Fix-forward approach | Switch off the new field with the flag; ship a corrected release within four hours |
| Evidence | Pipeline link and a screenshot in the merge request |

**Commentary.** Agents have written scope and a human gate. The record shows secret names, not values. The recovery plan goes forward.

## Part 4: Tech catalogue

| Field | Value |
|---|---|
| Product or system | TrailMug |
| Catalogue type | Tech |
| Document owner | Lead engineer |
| Version | 1.0 |
| Status | Draft |
| Last updated | 2027-03-18 |
| Next review | 2027-06-18 |
| Related catalogues | Master, ORBITAL, ANDROID |

| Part | Entry |
|---|---|
| Foundation | The shared foundation stack. Link to the standard. No changes for this product. |
| Flavour | Mobile web app, returns API, refund job, one relational database, an email sender, a payments provider |
| Rationale | Email sender: ADR-0001, chosen after scanning three. Payments provider: ADR-0002. |
| Lifecycle | Email sender 2.4, owner Leo, upgrade each quarter, risk: one local plugin of 120 lines |

| Area | Entry |
|---|---|
| Application | Web app, returns API, refund job |
| Data | One relational database. Refund rows kept seven years. Nightly backup. Restore tested quarterly. |
| Infrastructure | Staging and production, defined in code, one region |
| Integrations | Sign-in service, payments provider API, email sender API |
| Delivery | Git host; pipeline builds, tests, scans; promotion by merge |
| Security | Roles member, café, admin. Secrets in a store. Encryption at rest. Weekly dependency scan. |
| Reliability | Alert if the refund job fails twice. Availability target 99.5 percent (**simulated** until measured). |
| Developer experience | One command starts the local setup. Style guide. Two reviewers per merge request. |

**Commentary.** The Tech status is Draft, honest because the availability target is simulated and the second ADR is still being reviewed.

## Part 5: The small catalogue entry for one service

The [catalogue entry template](/library/template-catalogue-entry) gives each service its own small file. Here is the entry for the returns service.

| Field | Value |
|---|---|
| id | trailmug-svc-returns |
| name | TrailMug returns service |
| kind | service |
| owner | operations-lead |
| tier | 2 (tag tier-2) |
| lifecycle | active |
| description | Records each cup return and starts the deposit refund. |
| repos | trailmug/trailmug-svc-returns |
| dependencies | trailmug-pay, trailmug-int-email |
| slt.availability | 99.5 percent (simulated) |
| slt.latency_p95_ms | 800 (simulated) |
| slt.support_response | First reply in one working day |
| support.contact | returns-support queue |
| runbook | docs/runbooks/trailmug-svc-returns.md |
| data_classification | confidential (tag data-confidential) |
| adrs | docs/adr/0001-email-sender.md |
| tags | tier-2, data-confidential, returns |

## Part 6: Governance note and checklist

**Change note (2027-03-18).** Returns service moved from PLANNED to FOUND. Decision owner: Maya. Reason: it answered a test request in production. Affected: Master row 4, ANDROID deployment record, Tech reliability.

| Checklist item | Done? | Evidence |
|---|---|---|
| Master inventories all fields | Yes | Part 1 |
| FOUND, NOT FOUND, PLANNED with evidence | Yes | Part 1 notes |
| ORBITAL has all seven elements | Yes | Part 2 |
| ANDROID has all seven stages | Yes | Part 3 |
| Tech has foundation and flavour | Yes | Part 4 |
| Cross-linked, versioned, owned, reviewed | Yes | Metadata headers |
| Proposals separate from fact | Yes | Row trailmug-svc-reports is PLANNED |
| No secrets | Yes | Secret names only |

## Working with AI agents

- **May:** compare the four parts for naming mismatches, list owners across the layers, check that every dependency in Part 1 appears in Part 3.
- **May not:** invent a row, a number, an owner or a date. Every cell above came from a person.
- **A safe brief:** "Read the four tables. List every service name that appears in one table but not in the others. Do not edit."

## Common mistakes

1. **Copying TrailMug.** Use it as a shape, not as content.
2. **Perfect-looking catalogues with no NOT FOUND row.** That is suspicious.
3. **Different names for the same service in different layers.**
4. **Targets without sources.**
5. **No next review date.**
6. **An ANDROID page that gives an agent undefined power.**

## Practice

1. Find three places where the four layers link to each other. Draw them.
2. Find the one row that is PLANNED and say what evidence moves it to FOUND.
3. Pick one TrailMug indicator and say how you would measure it.
4. Write the first three rows of the Master layer for your own product.

## Checklist

- [ ] I read all four parts and the small entry.
- [ ] I can point to an honest NOT FOUND, a PLANNED and a simulated value.
- [ ] I know which names recur in every layer.
- [ ] I will write my own catalogue from my own evidence.

## The 2030 Product Development Manager lens

- **You decide:** every owner, number, status and review date.
- **You delegate to agents:** the cross-layer checks, the name matching, the first draft of rows from your repositories.
- **A sample brief:** "For each dependency listed in the Master layer, say whether it appears in the ANDROID networking table. Report differences only."
- **You verify by:** testing two rows against the real systems.
- **Disciplines involved:** product, finance, engineering, operations, design, research and security.
- **On the agent ladder:** you can **use** the catalogue to brief agents, **delegate** checks against it, **orchestrate** several agents by giving each the same catalogue, and **govern** it with one named owner.

## Further learning

Read the [Product Catalogue standard](/library/product-catalogue-standard) for the short version, and the [overview of this framework](/library/catalogue-framework-overview) to start again.
