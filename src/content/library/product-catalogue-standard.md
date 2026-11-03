---
title: "Product Catalogue standard"
description: "A four-layer way to describe a product: Master, ORBITAL, ANDROID and Tech, plus a catalogue entry for each service."
section: "Standards"
order: 1
---

The **Product Catalogue** is the main way to describe a product and the work needed to run it. It has four connected layers. Each layer answers one question and gives context to the next.

> **MASTER, then ORBITAL, then ANDROID, then TECH.**

This is a general standard. It works for any product.

## The four layers

| Layer | Core question | Role |
|---|---|---|
| **1. Master** | What exists in the product ecosystem? | A verified inventory of repositories, services, integrations, owners, dependencies, access and findings. |
| **2. ORBITAL** | What is needed to reach the objective? | Objectives, resources, budget, indicators, transport, activities and logistics. |
| **3. ANDROID** | How will the product advance and be delivered? | Advancement, networking, design, research, optimisation, implementation and deployment. |
| **4. Tech** | What technology makes it work? | The shared foundation stack, plus the technology choices of this product. |

**Hierarchy rule.** The Master Catalogue is the widest view. ORBITAL, ANDROID and Tech add more detail about work and technology.

## 1. Master Catalogue

The Master Catalogue is the most zoomed-out, evidence-based inventory. It records what exists, where it is, what it does, what it connects to, who owns it, and what was found or is still unknown.

### Required fields

| Field | What to write |
|---|---|
| Repo or service name | The exact name of the repository, service, system or integration |
| URL or domain | The real address. Write "Not available" if there is none. |
| Type | Repository, application, API, database, cloud service, integration, infrastructure, agent or documentation |
| Purpose | One sentence: why it exists |
| What it ties into | What it depends on and what depends on it. Include direction and purpose. |
| Owner | One accountable person or team. "Not confirmed" if unknown. |
| GitLab access | Which project, board or group holds the work, and who can see it. "Not confirmed" or "Not applicable" where right. (Use the name of your own git host if you do not use GitLab.) |
| Notes and findings | Verified observations, gaps, risks, open questions, links |

### Status values

| Status | Meaning |
|---|---|
| **FOUND** | Verified to exist. State the evidence. Say if it is running. |
| **NOT FOUND** | Checked and not located. Say where you looked. |
| **PLANNED** | Proposed. Not verified as built or running. |

### Rules

- Verify names, addresses, owners and links before you write them as facts.
- A repository is not a running service. A repo existing does not prove it is deployed.
- Record dependencies with direction and purpose.
- Do not invent addresses, owners, access or deployment status. Write "Not confirmed".
- For NOT FOUND, write what you checked. Do not imply you searched everywhere.
- Label every proposal PLANNED. Never show a proposal as done.
- Link detailed runbooks and specs. Do not copy them.

> **Core principle.** The Master Catalogue documents the ecosystem as the evidence shows it, not as you imagine or hope it is.

### TrailMug example (extract)

| Name | Type | Purpose | Ties into | Owner | Status | Notes |
|---|---|---|---|---|---|---|
| trailmug-site | Repository, website | Public marketing site | Links to the app sign-in. Sends form posts to the leads service. | Maya | FOUND | Live. Checked 2026-03-02. |
| trailmug-app | Application | Where members manage their cup | Uses the payments provider and the CRM | Maya | FOUND | In beta. |
| trailmug-svc-returns | API | Records cup returns at cafés | Called by the café tablet page. Writes to the CRM. | Not confirmed | PLANNED | Epic 4. |
| trailmug-status | Website | Public status page | Reads health checks from the app | Not confirmed | NOT FOUND | Searched the project and the domain list on 2026-03-02. |

## 2. ORBITAL Catalogue

ORBITAL turns the product concept into a clear objective and a resource plan. The letters are the elements.

| Element | What to document |
|---|---|
| **O** Objective | The outcome, scope and intended result |
| **R** Resources | People, skills, tools, systems, data, vendors |
| **B** Budget | Costs, funding sources, assumptions, timing, who owns the budget |
| **I** Indicators | Measurable targets, baselines, how you measure, how often you report |
| **T** Transport | How people, equipment, information and deliverables move between places or systems |
| **A** Activities | Workstreams, milestones, dependencies, owners |
| **L** Logistics | Practical arrangements: access, scheduling, buying, facilities, coordination |

**Output.** One plan that links objectives to resources and budget, shows how success is measured, and lists the activities and logistics needed.

**Measurement principle.** Indicators should be observable and time-bound. Prefer evidence of finished outputs over statements of intent.

## 3. ANDROID Catalogue

ANDROID describes the advancement and delivery life of the product.

| Element | What to document |
|---|---|
| **A** Advancement | How the product grows: maturity, releases, improvement priorities, next stage |
| **N** Networking | Other services, platforms, APIs, vendors and data sources it connects to. Purpose and direction of each. |
| **D** Design | Ideas and design: AI-assisted ideation, user flows, wireframes, mockups, interface decisions |
| **R** Research | Discovery, market and technical research, feasibility, alternatives, evidence |
| **O** Optimisation | AI-agent-supported improvement of workflows, code, quality and efficiency. Record the agent's scope and human review points. |
| **I** Implementation | Build and integration work. Say which people and which agents do which part. |
| **D** Deployment | Release and rollout across the platforms and environments you use |

### Deployment record

For each deployment write: the target environment, the components deployed, who or what is responsible (person or agent), how configuration and secrets are handled (names only), the release version, how you validated it, how you would fix forward, and the evidence.

Do not assume every product uses every environment or component.

> **Control point.** AI agents may do defined optimisation, build and deployment tasks. Access, permissions, approval gates, testing and human accountability must be written down for any important change.

## 4. Tech Catalogue

The Tech Catalogue documents the technical foundation and the technology choices of this product.

- **Shared foundation stack.** The common stack, services, standards and reusable patterns that apply across your products. Keep its detail in one authoritative technical standard. Do not guess or expand it inside the catalogue.
- **Product-specific flavour.** The frameworks, services and settings chosen for this product.
- **Rationale.** Why you chose each important technology: constraints and alternatives. Link the [decision record](/library/template-decision-record).
- **Lifecycle.** Versions, owners, support status, upgrade approach, known risks.

### Recommended technical inventory

| Area | Include |
|---|---|
| Application | Front end, back end, APIs, services, main modules |
| Data | Databases, storage, schemas, data flows, retention, backups |
| Infrastructure | Hosting, compute, networking, environments, infrastructure as code |
| Integrations | Sign-in, outside APIs, event flows, service dependencies |
| Delivery | Source control, build, test, release and deploy tools |
| Security | Identity, roles, secrets handling, encryption, audit, vulnerability handling |
| Reliability | Monitoring, logs, alerts, recovery, performance and availability targets |
| Developer experience | Local setup, required tools, coding standards, how to contribute |

## 5. Catalogue entries for services (the service catalogue)

Management practices such as ITIL keep a **service catalogue**: a list of what a team offers, with an owner and a promise for each. Do the same here. Give every product and service one small **catalogue entry**, a file in git, reviewed like code.

An entry has at least: an id, a name, a kind (product or service), an owner, a tier (how important it is), a lifecycle state, repos, dependencies, service levels, a support contact, a runbook link and a data class. An entry with no owner is not an entry. It is a rumour.

The entry is the small version. The Master Catalogue is the big picture. Link them both ways. Copy the [catalogue entry template](/library/template-catalogue-entry).

## 6. How the layers work together

1. Start with the Master Catalogue to see what really exists.
2. Use ORBITAL to turn the product into objectives, resources and indicators.
3. Use ANDROID to plan advancement, design, delivery and the use of agents.
4. Use Tech to record the foundation and the choices of this product.
5. Cross-link with stable ids, links, version labels and named owners.

## 7. Governance

- Every product has one current Master Catalogue.
- Each lower catalogue names its product and links to the Master.
- Give each catalogue an owner and a review rhythm. Record last-reviewed date and version.
- Separate confirmed facts, approved decisions, proposals and items to verify.
- Do not call a planned integration or deployment operational until it is verified.
- Record material changes with date, decision owner, reason and affected sections.
- Keep high-level catalogues short. Put detailed procedures in controlled places.
- **Never store passwords, keys or other secrets in a catalogue.**

## 8. Metadata header

Start each catalogue with this table.

| Field | Value |
|---|---|
| Product or system | [name] |
| Catalogue type | [Master / ORBITAL / ANDROID / Tech] |
| Owner | [role or person] |
| Version | [major.minor] |
| Status | [Draft / In review / Approved / Archived] |
| Last updated | [YYYY-MM-DD] |
| Next review | [YYYY-MM-DD] |
| Related catalogues | [links] |

## 9. Completion checklist

- [ ] Master lists repos, services, addresses, types, purposes, dependencies, owners, GitLab access and findings.
- [ ] Every entry is FOUND, NOT FOUND or PLANNED, with evidence or search scope.
- [ ] ORBITAL covers all seven elements and links objectives to indicators.
- [ ] ANDROID covers all seven stages and names integrations, agents and deployment environments.
- [ ] Tech records the shared foundation and the product-specific choices.
- [ ] All catalogues are cross-linked, versioned, owned and reviewed.
- [ ] Proposals are clearly separate from verified facts.
- [ ] Secrets are stored only in an approved secret store.
- [ ] Each product and service has a catalogue entry with an owner.

**Operating principle.** The four catalogues give you a continuous line of sight: see the ecosystem, organise the objective, coordinate the life of the product, and document the technology.
