---
title: "The Tech layer: foundation and product flavour"
description: "How to write the Tech Catalogue: the shared foundation stack, the product-specific flavour, the reason for each choice, lifecycle, and the eight-area technical inventory."
section: "Catalogue framework"
order: 5
level: core
duration: "60 min"
outcomes:
  - "Separate the shared foundation from the product-specific choices."
  - "Write the reason, alternatives and lifecycle of each important technology."
  - "Fill the eight-area technical inventory."
  - "Link decisions instead of repeating them."
resources:
  - twelve-factor/the-twelve-factor-app
  - c4model/c4
  - adr/architectural-decision-records
  - openssf/scorecard
  - owasp/top-ten
  - dora/dora-research-program
prerequisites:
  - catalogue-android-layer
---

The Tech Catalogue is layer 4 of the [catalogue framework](/library/catalogue-framework-overview). It documents the technical foundation and the technology choices of one product. Its base is a shared foundation stack. The particular flavour changes with the needs of each product.

## Why it matters

Technology choices are decisions that last for years. Without a record, the next person asks "why did we pick this?" and nobody remembers. With a record, they read the reason, the alternatives and the review date, and they decide whether to keep the choice.

## Key ideas

- **Foundation and flavour.** The foundation is shared across products. The flavour is chosen for this one.
- **Do not guess the foundation.** The detailed definition of the shared stack lives in one authoritative standard. The Tech page links to it. It does not retell it from memory. The [PHANTOMS stack track](/library/tracks/phantoms-stack/01-the-phantoms-pattern) teaches it.
- **Every important choice has a reason.** Constraints and alternatives included.
- **Lifecycle.** Versions, owners, support status, upgrade approach, risks.
- **Link to decision records.** See [template: decision record](/library/template-decision-record).

## The four parts

| Part | What to write | TrailMug example (fictional) |
|---|---|---|
| Foundation | Which shared stack and standards apply. Link to the authoritative standard. | Shared foundation stack, link to the standard page; no changes |
| Flavour | The technologies, frameworks, services and settings chosen for this product | A mobile web app, a small returns service, a managed database, an email sender |
| Rationale | Why each important technology was chosen, with constraints and alternatives | Email sender chosen after scanning three; see ADR-0001 |
| Lifecycle | Versions, owners, support status, upgrade approach, risks | Email sender 2.4, owner operations lead, upgrade each quarter, risk: one local plugin |

## The eight-area technical inventory

| Area | Include | TrailMug example (fictional) |
|---|---|---|
| Application | Front end, back end, APIs, services, main modules | Web app, returns API, refund job |
| Data | Databases, storage, schemas, data flows, retention, backups | One relational database; refund rows kept seven years; nightly backup, restore tested quarterly |
| Infrastructure | Hosting, compute, networking, environments, infrastructure as code | Two environments (staging, production), defined in code, one region |
| Integrations | Sign-in, outside APIs, event flows, service dependencies | Sign-in service, payments provider API, email sender API |
| Delivery | Source control, build, test, release and deploy tools | Git host, pipeline that builds, tests and scans, promotion by merge |
| Security | Identity, roles, secrets, encryption, audit, vulnerability handling | Roles: member, café, admin. Secrets in a store. Encryption at rest. Weekly dependency scan. |
| Reliability | Monitoring, logs, alerts, recovery, performance, availability targets | Alert if refund job fails twice. Target 99.5 percent (simulated until measured). |
| Developer experience | Local setup, tools, coding standards, how to contribute | `make dev` starts everything; style guide; two reviewers per merge request |

## Steps

1. Link your foundation standard at the top.
2. List flavour choices from your repositories and from the [integrations register](/library/template-integrations-register).
3. For each important choice, link a decision record. Write one line of reason.
4. Fill the eight areas. Write "None yet" where it is true.
5. Add lifecycle data: version, owner, support end date if known.
6. Mark simulated targets as simulated.
7. Set an owner and a review date in the metadata.

## Working with AI agents

- **May:** read package files and list versions, list known vulnerabilities from a scanner you ran, check which areas are empty, draft a first inventory from the repository.
- **May not:** choose a technology, rewrite the foundation standard, or claim a target is measured.
- **A safe brief:** "Read the package files in this repository. List each dependency with its version and licence field. Do not judge them."

## Common mistakes

1. **Rewriting the foundation inside every product page.**
2. **No reason for a choice.**
3. **Versions never updated.**
4. **A target presented as measured.** Say simulated.
5. **An empty area left out of the table.** Write "None yet".
6. **Treating the Tech page as the spec.** Link specs.

## Practice

1. Split your product's technology list into foundation and flavour.
2. Pick one important choice. Write the reason and one alternative.
3. Fill two areas of the inventory for your product.
4. List which area has the most risk and why.

## Checklist

- [ ] Foundation links to its authoritative standard.
- [ ] Each important choice has a reason and a link to a decision record.
- [ ] All eight areas are written, even if "None yet".
- [ ] Versions, owners and support status are recorded.
- [ ] Targets are marked simulated until measured.

## The 2030 Product Development Manager lens

- **You decide:** which technologies the product accepts, which risks are acceptable and when to review.
- **You delegate to agents:** listing versions and licences, drafting inventory tables from repositories, checking scanner output.
- **A sample brief:** "List dependencies with their licence fields from the package files. Flag any with no licence field. Do not suggest replacements."
- **You verify by:** reading one licence file and one version tag yourself.
- **Disciplines involved:** engineering, security, operations, legal and finance.
- **On the agent ladder:** **delegate** the inventory, **govern** the rules about what may enter the stack.

## Further learning

Next: [governance and the completion checklist](/library/catalogue-governance-and-checklist). Read the [PHANTOMS pattern](/library/tracks/phantoms-stack/01-the-phantoms-pattern) for the foundation, and the [internal developer platform](/library/internal-developer-platform) page for how catalogues are kept in git.
