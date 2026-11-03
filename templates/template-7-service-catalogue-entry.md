# Service Catalog Entry

## Cover

Developer Dojo: Master Developer Training Program

Service Catalog Entry

MAKE YOUR OWN COPY FIRST. Do not type in this original. Choose Copy to (or Download) and save it in your own folder with your name in the file name.

This is a BLANK template from the Developer Dojo: Master Developer Training Program, the next tier after Curiosity PILOT™.

Fill it in YOUR OWN words from what you really see. Do not ask an AI agent to fill it in.

Chapter 13, section 2. Sheets: Catalog entry, Entities, Relationships, Search answers.

SOURCE OF TRUTH: git, not this file

The Developer Dojo site and its git repository are the source of truth for this program.

Read the matching template page in the Library on the Developer Dojo site.

This file is a copy for you to fill in. Do not treat it as the master and do not edit it to change the program.

To suggest a change to the program, open a merge request in the program's git repository.

## Catalog entry

SERVICE CATALOG ENTRY | Chapter 13, section 2. In git this is catalog/<service-id>.yaml in your ops repo (starter: training/capstone/catalog-entry.yaml). Fields marked 'extension' are NOT in the catalogue schema yet (Planned): fill them here, and use the interim carriers (tags and labelled links) in the entity. Write the value 'simulated' for anything you did not measure.

| Field | Your value | Catalogue schema today | Help |
|---|---|---|---|
| id |  | catalogue | Kebab-case, equals the slug, never renamed |
| name |  | catalogue | Plain name of the service |
| kind |  | catalogue | product or service |
| owner |  | catalogue | ONE accountable human or role slug. Not a team of ten |
| tier |  | extension | 1 to 4 (chapter 13, section 6.2). Interim: a tag tier-N |
| lifecycle |  | extension | incubating, active, dormant or archived |
| description |  | catalogue | One or two plain sentences |
| repos |  | catalogue | GitLab group/repo, one per line |
| dependencies |  | catalogue edges | Service ids it depends on (each becomes a depends-on edge). Example: keycloak, harbor, the database |
| slt.availability |  | extension | A target, for example 99.5 percent. Full numbers go in the SLT sheet. Write 'simulated' if not measured |
| slt.latency_p95_ms |  | extension | A number in milliseconds |
| slt.support_response |  | extension | A target, for example first reply in 1 working day |
| support.contact |  | extension | A role or queue name. No personal secrets |
| support.issue_tracker |  | extension | GitLab group/repo |
| runbook |  | extension | Path, for example docs/runbooks/<id>.md |
| data_classification |  | extension | public, internal, confidential or restricted. Interim: a tag data-<class> |
| adrs |  | extension | Paths to your ADRs |
| licences |  | extension | Paths to your licence-check records |
| links |  | catalogue | Label and URL pairs: service, support, runbook, ADR, SLT sheet |
| tags |  | catalogue | tier-N, data-<class>, component name, patch-fork |

## Entities

ENTITIES for the catalogue | Use ONLY fields the real entity schema allows (additionalProperties is false, extra fields fail validation). A new service starts as incubating and becomes active after the production change is verified. Owner is the slug of an org, not a person role.

| Entity id (slug) | Name | Kind (product, service, repo, pipeline) | Status (active, incubating) | Owner (org slug) | Parent | Description (one or two sentences) | Tags | Links (label: url) | Source (connector_id, method, observed_at) |
|---|---|---|---|---|---|---|---|---|---|

manual, manual, YYYY-MM-DDTHH:MM:SSZ

## Relationships

RELATIONSHIPS | Direction is 'from type to'. This kit uses: repo implements service, service implements product. An edge to an entity that does not exist is a validation error: create the target first.

| From (slug) | To (slug) | Type (implements, depends-on, deployed-in, linked-to) | Description | Target exists? (Y/N) |
|---|---|---|---|---|

## Search answers

Write your own answers, then test them with your catalogue search. Say what is found today and what needs a Planned connector.

1. Catalogue search "<capability words>": which hit should come first?

2. Catalogue entity lookup "<service id>": slug, owner, status, tags, links and edges. What do you expect to see?

3. What can the map NOT hold yet (tier, lifecycle, SLT, support contact)? List it and write the platform request.
