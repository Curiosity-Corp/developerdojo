---
title: "The Master layer: what exists, verified"
description: "How to write the Master Catalogue: the inventory fields, the FOUND, NOT FOUND and PLANNED statuses, and the rules for verifying before you write."
section: "Catalogue framework"
order: 2
level: foundation
duration: "60 min"
outcomes:
  - "Write a Master Catalogue row with evidence for every claim."
  - "Use FOUND, NOT FOUND and PLANNED correctly."
  - "Tell a repository apart from a running service."
  - "Record what you searched when something is NOT FOUND."
resources:
  - c4model/c4
  - atlassian/service-catalog
  - backstage/software-catalog
  - atlassian/project-dependencies
  - owasp/secrets-management-cheat-sheet
  - gov-uk/service-standard-simple
prerequisites:
  - catalogue-framework-overview
---

The Master Catalogue is layer 1 of the [catalogue framework](/library/catalogue-framework-overview). It follows the same method as the [repository map](/library/template-repository-map) and is the most zoomed-out inventory of your product. It records what exists, where it is, what it does, what it connects to, who owns it, and what you found or could not find.

## Why it matters

Every other layer depends on this one. A budget for a service that does not exist, a plan that assumes a payment gateway nobody built, an agent told to deploy to an environment that was retired: all of these come from a Master layer that was imagined instead of checked.

The core principle: **the Master Catalogue documents the ecosystem as the evidence shows it, not as you imagine or intend it to be.**

## Key ideas

- **One row per thing.** A repository, application, API, database, cloud service, integration, piece of infrastructure, agent or document.
- **Evidence in the notes.** Write what you opened and when.
- **Three statuses.** FOUND, NOT FOUND, PLANNED.
- **A repository is not a service.** A repository proves code exists. It does not prove anything runs.
- **Not confirmed is a valid answer.** It is better than a guess.

## The three statuses

| Status | Meaning | What you must write |
|---|---|---|
| FOUND | Verified to exist | The evidence, and whether it is running |
| NOT FOUND | Checked, not located | Where you looked, and the limits of the search |
| PLANNED | Proposed, not verified as built | Who proposed it and where the plan lives |

A sentence like "Searched the group trailmug and the domain list on 2027-03-02; no status page found" is a good NOT FOUND. It does not claim that nothing exists anywhere.

## Steps to write it

1. **List the places.** Git groups, domains, cloud accounts, tool lists.
2. **Open each one.** Do not copy names from memory or from a slide.
3. **Write one row per item.** Use the eight fields from [metadata and fields](/library/catalogue-metadata-and-fields).
4. **Set the status.** If you cannot show evidence, it is not FOUND.
5. **Write the ties.** Direction and purpose: "Reads health checks from the app."
6. **Add NOT FOUND rows** for parts you expected.
7. **Mark PLANNED rows** clearly. Never mix them with FOUND.
8. **Link instead of copying.** Runbooks, specs and task records are linked, not pasted.

## The verification rules

- Verify names, groups, addresses, infrastructure, integrations and owners before they become facts.
- Separate a repository from a deployed application or a running service.
- Record dependencies explicitly, with purpose and direction.
- Never invent addresses, owners, access, deployment state or behaviour. Write "Not confirmed".
- For NOT FOUND, write what you checked. Do not imply you searched everywhere.
- Show proposals only as PLANNED.
- Never store secrets here. Names only.

## A short TrailMug extract

| Name | Type | Purpose | Ties into | Owner | Status | Notes |
|---|---|---|---|---|---|---|
| trailmug-site | Repository, website | Public marketing site | Links to the app sign-in; posts the leads form | Maya | FOUND | Live. Opened 2027-03-02. |
| trailmug-svc-returns | API | Records cup returns | Called by the café tablet page; writes to the CRM | Not confirmed | PLANNED | Epic 4 |
| trailmug-status | Website | Public status page | Would read health checks from the app | Not confirmed | NOT FOUND | Searched the group and the domain list on 2027-03-02 |
| trailmug-pay | Cloud service | Takes deposits | The app; finance tools | Finance lead | FOUND | Running. Checked the provider dashboard. |

See the complete example in the [TrailMug full catalogue](/library/catalogue-trailmug-full-example).

## What the expected outcome looks like

A developer or technical lead who reads your Master Catalogue can: understand the real repository and service landscape, find a component, see how parts connect, see who owns and can access each, and spot verified gaps and planned work. If a stranger cannot do these in ten minutes, the catalogue needs work.

## Working with AI agents

- **May:** list repositories, read README files, search configuration for outbound addresses, check that a URL answers.
- **May not:** mark a row FOUND without a quoted file or screen you can open, name an owner, or write a dependency it did not see.
- **Disclose:** note in the metadata which rows an agent gathered.
- **A safe brief:** "For each service name in this list, search these repositories for its name and report the file path of each mention. Where none, write NOT FOUND and list what you searched."

## Common mistakes

1. **A repository counted as a running service.**
2. **NOT FOUND with no search scope.**
3. **A planned part written as FOUND.**
4. **Owner left blank.** Write "Not confirmed".
5. **Ties without direction.** Say who calls whom.
6. **Copying a runbook into the row.** Link it.

## Practice

1. Take five rows of your own map. Mark each FOUND, NOT FOUND or PLANNED, with the evidence.
2. Write a good NOT FOUND note for one part you expected.
3. Find one repository that is not deployed. Write the row honestly.
4. Rewrite one tie so it has a direction and a purpose.

## Checklist

- [ ] Every row has a type, a one-sentence purpose and ties with direction.
- [ ] Every row is FOUND, NOT FOUND or PLANNED, with evidence or search scope.
- [ ] Owners are people, teams or "Not confirmed".
- [ ] No secrets and no invented addresses.
- [ ] Links point to runbooks and specs instead of copying them.

## The 2030 Product Development Manager lens

- **You decide:** what counts as evidence, which gaps matter and who must be asked.
- **You delegate to agents:** the search, the listing, and the first draft of each row.
- **A sample brief:** "Open each URL in this list and report the HTTP status and page title. Do not interpret."
- **You verify by:** opening three FOUND rows and one NOT FOUND scope yourself.
- **Disciplines involved:** architecture, engineering, operations, security and finance.
- **On the agent ladder:** **use** for gathering, **delegate** for checks, and **govern** for the rule that nothing is FOUND without evidence.

## Further learning

Next: the [ORBITAL layer](/library/catalogue-orbital-layer). The fields are explained one by one in [metadata and fields](/library/catalogue-metadata-and-fields). Read [Repository map standard](/library/repository-map-standard) for the Week 1 method.
