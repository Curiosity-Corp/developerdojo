---
title: "Template: Service catalogue entry"
description: "The Master Developer catalogue-entry workbook, field by field: entry, entities, relationships and search answers, with a filled TrailMug returns-service entry."
section: "Templates"
order: 8
fillable: "template-7-service-catalogue-entry"
level: advanced
duration: "2 hours for the first entry"
outcomes:
  - "Fill every field of a catalogue entry and say where the value comes from."
  - "Use interim carriers (tags and labelled links) for fields the catalogue does not hold yet."
  - "Write entities and relationships whose links all resolve."
  - "Write search answers and say what the catalogue cannot hold yet."
resources:
  - backstage/software-catalog
  - backstage/what-is-backstage
  - atlassian/service-catalog
  - axelos/itil
  - google-sre/service-level-objectives
  - c4model/c4
prerequisites:
  - templates-overview
  - product-catalogue-standard
  - deck-11-backstage-and-itsm-role-map
---

The catalogue entry is a Master Developer template. It belongs to **Track B, week 4** (ITIL on your stack) and to capstone day 4. It describes one product or service in a small file, so that a person or an agent can find out who owns it, what it needs and how it should behave.

## Download the blank template

- Excel file (original format): [template-7-service-catalogue-entry.xlsx](/templates/template-7-service-catalogue-entry.xlsx)
- Markdown copy, to keep in git: [template-7-service-catalogue-entry.md](/templates/template-7-service-catalogue-entry.md)

Make your own copy first. In git, an entry is `catalog/<service-id>.yaml` in your ops repository. The workbook has five sheets: Cover, Catalog entry, Entities, Relationships and Search answers. For the wider standard, read the [Product Catalogue standard](/library/product-catalogue-standard).

## Why it matters

A service nobody has described is a service nobody can safely change. When something fails at night, someone has to know who owns the service, what depends on it, where the runbook is, and what the promised service level is. A catalogue entry answers those questions in advance.

The entry is also what agents read. If an agent must change the returns service, it should be able to find the owner, the repositories, the dependencies and the rules. A good entry makes delegation safer.

## Key ideas

- **Entry:** the description of one service, product, repository or pipeline.
- **Schema today:** the fields the catalogue already holds. Fields marked **extension** are not supported yet. Use interim carriers for them.
- **Interim carrier:** a documented stand-in, such as a tag `tier-2` or a labelled link `runbook`.
- **Edge:** a link between two entries, for example a repository implements a service, and a service depends on another service.
- **Resolve:** an edge resolves when the target entry exists. An edge to a missing entry is an error. Create the target first.
- **Tier:** how critical the service is, from 1 to 4.
- **Lifecycle:** incubating, active, dormant or archived. A new service starts incubating and becomes active after the production change is verified.
- **SLT:** service level target, for example availability or response time. Write **simulated** for anything you did not measure.

## How to fill it: steps

1. **Pick one service.** Use the one your capstone or your product depends on most.
2. **Fill the Catalog entry sheet.** Fill every row. Use "simulated" where you have no measurement.
3. **Create the entities.** Product, service, repository and pipeline. Use only the fields the real schema allows. Extra fields fail validation.
4. **Write the relationships.** Repository implements service. Service implements product. Service depends on other services.
5. **Check that every target exists.** If not, create the target entity first.
6. **Answer the three search questions** on the last sheet, then test them with your catalogue search.
7. **Link to the entry from your change record and ADR.** The three documents should agree.

## Every field explained

| Field | Where it lives | What to write | TrailMug example (fictional) |
|---|---|---|---|
| id | schema | Lowercase with hyphens, same as the slug, never renamed | trailmug-svc-returns |
| name | schema | The plain name | TrailMug returns service |
| kind | schema | product or service | service |
| owner | schema | One accountable human or role slug. Not a team of ten | operations-lead |
| tier | extension | 1 to 4. Interim: a tag `tier-N` | 2 (tag tier-2) |
| lifecycle | extension | incubating, active, dormant or archived | active |
| description | schema | One or two plain sentences | Records each cup return and starts the deposit refund. |
| repos | schema | group/repo, one per line | trailmug/trailmug-svc-returns |
| dependencies | schema edges | Service ids it depends on | trailmug-pay, trailmug-int-email |
| slt.availability | extension | A target, or "simulated" | 99.5 percent (simulated) |
| slt.latency_p95_ms | extension | A number in milliseconds | 800 (simulated) |
| slt.support_response | extension | A target | First reply in 1 working day |
| support.contact | extension | A role or queue. No personal secrets | returns-support queue |
| support.issue_tracker | extension | group/repo | trailmug/trailmug-ops |
| runbook | extension | A path | docs/runbooks/trailmug-svc-returns.md |
| data_classification | extension | public, internal, confidential or restricted. Interim: tag `data-<class>` | confidential (tag data-confidential) |
| adrs | extension | Paths to your ADRs | docs/adr/0001-email-sender.md |
| licences | extension | Paths to licence-check records | docs/licence-checks/email-sender.md |
| links | schema | Label and URL pairs | service, support, runbook, ADR, SLT sheet |
| tags | schema | tier, data class, component name, patch-fork | tier-2, data-confidential, returns |

### The other sheets

| Sheet | Columns | Notes |
|---|---|---|
| Entities | Entity id (slug), Name, Kind (product, service, repo, pipeline), Status (active, incubating), Owner (organisation slug), Parent, Description, Tags, Links, Source | Source says how the data got here: connector, method and observation time. For a hand-written entry write `manual` and the time. The owner here is the slug of an organisation, not a person role. |
| Relationships | From, To, Type (implements, depends-on, deployed-in, linked-to), Description, Target exists? (Y/N) | This kit uses: repo implements service, service implements product. |
| Search answers | Three questions | Write what you expect, then test with search. Say what is found today and what needs a connector that is planned. |

## A filled example in short

```yaml
id: trailmug-svc-returns
name: TrailMug returns service
kind: service
owner: operations-lead
tier: 2                      # extension; interim tag tier-2
lifecycle: active            # extension
description: Records each cup return and starts the deposit refund.
repos:
  - trailmug/trailmug-svc-returns
dependencies:
  - trailmug-pay
  - trailmug-int-email
slt:
  availability: "99.5 percent (simulated)"
  latency_p95_ms: "800 (simulated)"
  support_response: "first reply in 1 working day"
runbook: docs/runbooks/trailmug-svc-returns.md
data_classification: confidential
tags: [tier-2, data-confidential, returns]
```

Relationships for this entry:

| From | To | Type | Target exists? |
|---|---|---|---|
| trailmug-svc-returns (repo) | trailmug-svc-returns (service) | implements | Y |
| trailmug-svc-returns | trailmug-pay | depends-on | Y |
| trailmug-svc-returns | trailmug-int-email | depends-on | Y |
| trailmug-svc-returns (service) | trailmug-app (product) | implements | Y |

Search answers for the example:

1. Search "return a cup refund": the returns service should come first.
2. Entity lookup "trailmug-svc-returns": expect slug, owner, status, tags, links and two edges.
3. What the catalogue cannot hold yet: tier, lifecycle, SLT and support contact. Platform request: add them as fields.

## Working with AI agents

- **May:** draft entries from fields you chose, once you decided the owner, the tier and the dependencies. Check that every edge resolves. Run validation and report errors. Summarise a runbook.
- **May not:** decide the owner, the tier or the data class. May not invent a service level. May not mark "measured" something nobody measured.
- **Disclose:** one line in your repository.
- **A safe brief:** "Validate every file in catalog/ against the schema. For each edge, say whether the target file exists. Do not fix anything."

## Common mistakes

1. **A team as owner.** One accountable human or role.
2. **Inventing numbers.** If you did not measure it, write simulated.
3. **Dead edges.** An edge to a missing entry is a validation error.
4. **Extra fields in the entity.** The schema rejects them. Use tags and links as interim carriers.
5. **Renaming an id.** Ids never change.
6. **An entry that disagrees with the runbook or ADR.** Update all three together.
7. **A new service marked active before the production change is verified.** Start incubating.

## Practice

1. Choose one service. Fill every row of the entry sheet.
2. Create one product, one service and one repository entity. Write the three edges.
3. Answer the three search questions, then test them.
4. List what the catalogue cannot hold yet, and write one platform request.

## Checklist

- [ ] Every schema field has a value.
- [ ] Extension fields use interim carriers and say simulated where unmeasured.
- [ ] The owner is one accountable human or role.
- [ ] Every edge target exists.
- [ ] Runbook, ADR and licence paths are real files.
- [ ] A new service is marked incubating.
- [ ] Search answers are written and tested.

## The 2030 Product Development Manager lens

- **You decide:** the owner, the tier, the service level you promise and the data class.
- **You delegate to agents:** drafting entries from your decisions, validating edges, checking that the runbook path exists.
- **A sample brief:** "Read catalog/trailmug-svc-returns.yaml. Check that every path in it exists in the repository. List missing paths. Do not create files."
- **You verify by:** opening the runbook and ADR paths the agent said exist.
- **Disciplines involved:** service management, operations, security (data class), finance (tier and cost) and engineering.
- **On the agent ladder:** the catalogue supports **orchestrate** and **govern**: it tells agent sessions what each service is and who is accountable.

## Further learning

[Deck 11](/library/deck-11-backstage-and-itsm-role-map) compares catalogue tools with the roles of IT service management. [Deck 15](/library/deck-15-itil-in-git-change-and-incident) covers change and incident work. The [Product Catalogue standard](/library/product-catalogue-standard) explains the layers. Continue with the [change record template](/library/template-change-record).
