---
title: "Case study: DanHup repository map and integrations register"
description: "Templates 3 and 4 filled in for DanHup, row by row, with commentary on the findings: NOT FOUND parts, unowned parts and a switched-off CRM."
section: "Case study"
order: 2
level: core
duration: "60 min"
outcomes:
  - "Read a filled repository map and say what each finding means."
  - "Read a filled integrations register and see which functions are thin or unowned."
  - "Write NOT FOUND rows honestly in your own map."
  - "Use the function map to find gaps in a company."
resources:
  - c4model/c4
  - atlassian/service-catalog
  - atlassian/project-dependencies
  - owasp/secrets-management-cheat-sheet
  - backstage/software-catalog
  - google-sre/embracing-risk
prerequisites:
  - case-study-danhup-the-product-on-one-page
  - template-repository-map
  - template-integrations-register
---

This is page 2 of the DanHup case study. It shows templates 3 ([repository map](/library/template-repository-map)) and 4 ([integrations register](/library/template-integrations-register)) filled in. **EXAMPLE ONLY: your product needs your own thinking. Do not copy this.** The map was built from files seen on 28 October 2026. For this public version, internal host names, private tool names and people have been removed or described by their job.

## Why it matters

The map and the register are the two Week 1 tools. They turn "I know the app" into "I know the product". In DanHup, the most useful rows are not the ones that describe something that works. They are the rows that say NOT FOUND, NOBODY or OFF. Each one is an honest sentence that a team can act on.

## Key ideas

- **Rows marked NOT FOUND are findings.** They are things the brief expected, but the evidence does not show.
- **Do not claim more than the evidence shows.** "Logic apps only" is a true sentence. "Cloud functions behind a front door" would be an expectation written as a fact.
- **Ties are the point.** The "what it ties into" column is where epics come from.
- **Your access column** says what you can change: write or none. A proprietary app is often "none".

## Step 1: The repository map

| Name | Location | Type | Purpose | Ties into | Owner | Your access | Findings |
|---|---|---|---|---|---|---|---|
| Site repository | Company git host; public domain set by a CNAME file | Marketing site | Public landing page "Candidate Placement". Email capture. Built from a bought coming-soon template with leftover placeholder text. | Email-capture service (notify-me form); link to the app (planned) | Not named | write | Hosting on a static page host is likely but not proven. No pricing page, calculators or briefs found. |
| App repository | Company git host; private app address | App | Private multi-user candidate-placement portal: interest arrives, approved outreach goes out, applications are tracked, with safety rails. | Sign-in service, private network layer, gateway, mail and chat platform, AI assistant, approval cards, model provider, workflow fleet, CRM mirror | Engineering | none | Proprietary. People who plan the product see issues, boards and milestones but no code. Several local folders are only checkouts of this one repository. |
| Planning group | Product group in GitLab | Planning | Epics and roadmap live here, with starter repositories for ops, website and repo map. | The app (each epic links to the issues the agents file there) | Product manager | write | One epic exists today. Everything else is still to be planned. That is the Master Developer's job. |
| Mail-triage workflow fleet | A cloud resource group; code in an infrastructure repository | Cloud microservice (workflow apps) | Classify and flag recruiter mail, draft replies, call the app's controller routes. | The app, the mail platform, the chat platform | Infrastructure | none | No front door service and no cloud functions found. These are workflow apps only. Do not claim more than the evidence shows. |
| Identity | A sign-in service shared with other products | Integration | Sign-in for every user of the app. | The app, the gateway | Platform | none | Shared with other products. |
| Network access | Private names for the app and its API | Integration | Keeps the app off the public internet. Only members reach it. | The app, the sign-in service | Platform | none | Design choice: the app has no public DNS. |
| CRM mirror | A schema inside the app's code and scripts | CRM | Mirror of cases and contacts for the sales view. | The app | Engineering | none | Switched **OFF** by default. The secret is not ready yet. A planned epic could finish it. |
| Payment gateway | **NOT FOUND** | Payments | None today. No pricing or tiers exist either. | Would tie into app sign-up, CRM and finance | Nobody | none | **FINDING:** a product that sells needs a way to be paid. Is this a gap for an epic, or a decision to stay unpaid for now? Someone must decide. |
| Ops repository | **NOT FOUND** (no dedicated repository) | Ops | Nearest things: the app's ops dashboard page, failure-modes page and cost-gate route; the workflow infrastructure repository. | The app, the workflow infrastructure | Nobody | none | **FINDING:** operations knowledge is spread across places. Candidate epic: one clear ops home. |
| Squeeze pages, technical briefs, interactive tools | **NOT FOUND** (only the notify-me form) | Squeeze page or interactive tool | None beyond the email capture. | The site, the email-capture service | Nobody | write | **FINDING:** the brief expected these. They do not exist yet. Epics must start from what is real. |

### Commentary on the map

1. **Row 2 shows the hardest honest column.** "Your access: none" does not mean "not my problem". The app is the heart of the product. The planner reads its issues and boards, and writes epics that touch it.
2. **Three NOT FOUND rows are worth more than seven working rows.** Payments, operations and squeeze pages are each a gap between the picture a team has in its head and the files on disk.
3. **Two rows have owner "Nobody".** In Week 3 these are candidate epics.
4. **The CRM row says OFF.** A feature that exists in code but is switched off is not a feature. It is a risk and an opportunity.
5. **Ties.** The app ties into nine other rows. A change in the app can break many things, and an epic touching the app almost always crosses several parts.

## Step 2: The integrations register

| Tool | What it does for us | Function | Parts | Data in and out | Owner | Cost | Login method | If it stops | Status |
|---|---|---|---|---|---|---|---|---|---|
| Sign-in service (open-source identity server) | Sign-in for all users | Identity and security | App | Login tokens in; user id and email claims out | Platform | Self-hosted | Standard OIDC | Nobody can log in | Live |
| Private network layer and gateway (open source) | Private network path to the app | Identity and security | App | Requests in; checked claims out | Platform | Self-hosted | A network identity | App unreachable | Live |
| Mail, calendar and chat platform | Reads and sends mail and calendar for outreach | Sales | App, workflow fleet | Mail and calendar data | Engineering | Platform licence | Delegated OAuth | No outreach, no mail triage | Live |
| Chat approval cards | A human approves each reply before it is sent | Operations | App | Draft in; approval out | Engineering | Included | Chat app | Replies wait or are unsafe | Live |
| Internal AI assistant | Drafts outreach and replies | Support | App | Drafts | Engineering | Internal | Gateway token | No drafts | Live |
| Model provider | AI features with the candidate's own key | Product and data | App | Prompts in; text out | Candidate | Candidate pays | The candidate's key, stored encrypted | AI features stop | Live |
| Customer-record service (CRM) | CRM mirror of cases and contacts | Sales | App | Cases and contacts | Engineering | Platform licence | App registration | Sales has no CRM view | **Off** |
| Email-capture service | Email capture on the website | Marketing | Site | Email addresses in | **Nobody** | Free or paid tier unknown | API key | No new leads captured | Live |
| LinkedIn sign-in link | Optional profile link | Marketing | App | Profile link | Engineering | Free | OIDC | Optional link stops | Live |
| Secrets vault with external secrets | Holds secrets for the app | Identity and security | App | Secrets (never shown) | Platform | Cloud | Managed identity | App cannot start | Live |
| Payment gateway | Taking money from customers | Finance | (none yet) | None | Nobody | **NOT FOUND** | **NOT FOUND** | Cannot charge anyone | **NOT FOUND** |

Note what the register does **not** contain: any secret. The login column shows the method only: "standard OIDC", "API key", "managed identity". Never the key itself.

### The function map

| Function | Reading |
|---|---|
| Sales | Mail platform and CRM; the CRM is off, so sales is thin |
| Marketing | Email capture and a LinkedIn link, and the email-capture service has no owner |
| Finance | **Empty.** The payment gateway row is NOT FOUND |
| Support | One assistant; no ticket tool found |
| Operations | Approval cards only; no ops home |
| Identity and security | Four rows, all owned by the platform team: strong |
| Product and data | The model provider, paid by the candidate |

**Commentary.** Identity and security has four owned rows. Finance has none. A company that is strong in identity and has no way to take money has a hidden gap between its engineering strength and its business model. That gap is the origin of epic 4, "Paid customers", which begins with a decision.

## Working with AI agents

- **May:** list repository names, read READMEs, search for outbound web addresses and library names. You check the results.
- **May not:** decide what a part ties into, write the owner column, or make up a NOT FOUND into a found row.
- **Never:** paste a secret into an agent or into the register.
- **A safe brief:** "For each layer in this table (site, app, services, CRM, payments, ops) list the files in the repositories that prove it exists. Where none, write NOT FOUND. Do not guess."

## Common mistakes

1. **Writing the expected part as found.** If you cannot show a file, it is NOT FOUND.
2. **Leaving the owner blank.** Write Nobody.
3. **Describing the app only.** The CRM, payments and ops are rows too.
4. **Putting a secret in the register.** Method only.
5. **Treating "off" as "done".** An off switch is a different state from live.
6. **Ignoring the function map.** An empty function is a finding.

## Practice

1. Pick three rows of the map. For each, write one question you would ask its owner.
2. Count how many ties the app has in the map. What does that say about the risk of changing it?
3. In the register, find the row with owner Nobody and say what could go wrong.
4. Make a function map for your own product and find your empty function.

## Checklist

- [ ] My map has NOT FOUND rows where my expectations were wrong.
- [ ] Every row names a type and a purpose.
- [ ] Every owner is a person, a team or Nobody.
- [ ] My register shows login methods only.
- [ ] My function map has a reading for every function.

## The 2030 Product Development Manager lens

- **You decide:** which findings become epics, and which become decisions.
- **You delegate to agents:** finding files that prove a part exists, listing outside services from code, comparing the register to invoices you paste in.
- **A sample brief:** "List every outbound service name found in these repositories with the file path. Do not open any secrets file."
- **You verify by:** checking two rows against the real file or invoice.
- **Disciplines involved:** architecture, engineering, security, finance and sales.
- **On the agent ladder:** the map and the register are the **use** step, and they set the boundary for what you can **delegate**.

## Further learning

Continue with [people, touch points and journeys](/library/case-study-danhup-people-and-journeys). For the full four-layer catalogue of a fictional product, see the [catalogue framework](/library/catalogue-framework-overview) and the [full TrailMug example](/library/catalogue-trailmug-full-example). Go back to [page 1](/library/case-study-danhup-the-product-on-one-page) for the product on one page.
