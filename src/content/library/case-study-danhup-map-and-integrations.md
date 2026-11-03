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

### Site repository

- **Location:** Company git host; public domain set by a CNAME file
- **Type:** Marketing site
- **Purpose:** Public landing page "Candidate Placement". Email capture. Built from a bought coming-soon template with leftover placeholder text.
- **Ties into:** Email-capture service (notify-me form); link to the app (planned)
- **Owner:** Not named
- **Your access:** write
- **Findings:** Hosting on a static page host is likely but not proven. No pricing page, calculators or briefs found.

### App repository

- **Location:** Company git host; private app address
- **Type:** App
- **Purpose:** Private multi-user candidate-placement portal: interest arrives, approved outreach goes out, applications are tracked, with safety rails.
- **Ties into:** Sign-in service, private network layer, gateway, mail and chat platform, AI assistant, approval cards, model provider, workflow fleet, CRM mirror
- **Owner:** Engineering
- **Your access:** none
- **Findings:** Proprietary. People who plan the product see issues, boards and milestones but no code. Several local folders are only checkouts of this one repository.

### Planning group

- **Location:** Product group in GitLab
- **Type:** Planning
- **Purpose:** Epics and roadmap live here, with starter repositories for ops, website and repo map.
- **Ties into:** The app (each epic links to the issues the agents file there)
- **Owner:** Product manager
- **Your access:** write
- **Findings:** One epic exists today. Everything else is still to be planned. That is the Master Developer's job.

### Mail-triage workflow fleet

- **Location:** A cloud resource group; code in an infrastructure repository
- **Type:** Cloud microservice (workflow apps)
- **Purpose:** Classify and flag recruiter mail, draft replies, call the app's controller routes.
- **Ties into:** The app, the mail platform, the chat platform
- **Owner:** Infrastructure
- **Your access:** none
- **Findings:** No front door service and no cloud functions found. These are workflow apps only. Do not claim more than the evidence shows.

### Identity

- **Location:** A sign-in service shared with other products
- **Type:** Integration
- **Purpose:** Sign-in for every user of the app.
- **Ties into:** The app, the gateway
- **Owner:** Platform
- **Your access:** none
- **Findings:** Shared with other products.

### Network access

- **Location:** Private names for the app and its API
- **Type:** Integration
- **Purpose:** Keeps the app off the public internet. Only members reach it.
- **Ties into:** The app, the sign-in service
- **Owner:** Platform
- **Your access:** none
- **Findings:** Design choice: the app has no public DNS.

### CRM mirror

- **Location:** A schema inside the app's code and scripts
- **Type:** CRM
- **Purpose:** Mirror of cases and contacts for the sales view.
- **Ties into:** The app
- **Owner:** Engineering
- **Your access:** none
- **Findings:** Switched **OFF** by default. The secret is not ready yet. A planned epic could finish it.

### Payment gateway

- **Location:** **NOT FOUND**
- **Type:** Payments
- **Purpose:** None today. No pricing or tiers exist either.
- **Ties into:** Would tie into app sign-up, CRM and finance
- **Owner:** Nobody
- **Your access:** none
- **Findings:** **FINDING:** a product that sells needs a way to be paid. Is this a gap for an epic, or a decision to stay unpaid for now? Someone must decide.

### Ops repository

- **Location:** **NOT FOUND** (no dedicated repository)
- **Type:** Ops
- **Purpose:** Nearest things: the app's ops dashboard page, failure-modes page and cost-gate route; the workflow infrastructure repository.
- **Ties into:** The app, the workflow infrastructure
- **Owner:** Nobody
- **Your access:** none
- **Findings:** **FINDING:** operations knowledge is spread across places. Candidate epic: one clear ops home.

### Squeeze pages, technical briefs, interactive tools

- **Location:** **NOT FOUND** (only the notify-me form)
- **Type:** Squeeze page or interactive tool
- **Purpose:** None beyond the email capture.
- **Ties into:** The site, the email-capture service
- **Owner:** Nobody
- **Your access:** write
- **Findings:** **FINDING:** the brief expected these. They do not exist yet. Epics must start from what is real.


### Commentary on the map

1. **Row 2 shows the hardest honest column.** "Your access: none" does not mean "not my problem". The app is the heart of the product. The planner reads its issues and boards, and writes epics that touch it.
2. **Three NOT FOUND rows are worth more than seven working rows.** Payments, operations and squeeze pages are each a gap between the picture a team has in its head and the files on disk.
3. **Two rows have owner "Nobody".** In Week 3 these are candidate epics.
4. **The CRM row says OFF.** A feature that exists in code but is switched off is not a feature. It is a risk and an opportunity.
5. **Ties.** The app ties into nine other rows. A change in the app can break many things, and an epic touching the app almost always crosses several parts.

## Step 2: The integrations register

### Sign-in service (open-source identity server)

- **What it does for us:** Sign-in for all users
- **Function:** Identity and security
- **Parts:** App
- **Data in and out:** Login tokens in; user id and email claims out
- **Owner:** Platform
- **Cost:** Self-hosted
- **Login method:** Standard OIDC
- **If it stops:** Nobody can log in
- **Status:** Live

### Private network layer and gateway (open source)

- **What it does for us:** Private network path to the app
- **Function:** Identity and security
- **Parts:** App
- **Data in and out:** Requests in; checked claims out
- **Owner:** Platform
- **Cost:** Self-hosted
- **Login method:** A network identity
- **If it stops:** App unreachable
- **Status:** Live

### Mail, calendar and chat platform

- **What it does for us:** Reads and sends mail and calendar for outreach
- **Function:** Sales
- **Parts:** App, workflow fleet
- **Data in and out:** Mail and calendar data
- **Owner:** Engineering
- **Cost:** Platform licence
- **Login method:** Delegated OAuth
- **If it stops:** No outreach, no mail triage
- **Status:** Live

### Chat approval cards

- **What it does for us:** A human approves each reply before it is sent
- **Function:** Operations
- **Parts:** App
- **Data in and out:** Draft in; approval out
- **Owner:** Engineering
- **Cost:** Included
- **Login method:** Chat app
- **If it stops:** Replies wait or are unsafe
- **Status:** Live

### Internal AI assistant

- **What it does for us:** Drafts outreach and replies
- **Function:** Support
- **Parts:** App
- **Data in and out:** Drafts
- **Owner:** Engineering
- **Cost:** Internal
- **Login method:** Gateway token
- **If it stops:** No drafts
- **Status:** Live

### Model provider

- **What it does for us:** AI features with the candidate's own key
- **Function:** Product and data
- **Parts:** App
- **Data in and out:** Prompts in; text out
- **Owner:** Candidate
- **Cost:** Candidate pays
- **Login method:** The candidate's key, stored encrypted
- **If it stops:** AI features stop
- **Status:** Live

### Customer-record service (CRM)

- **What it does for us:** CRM mirror of cases and contacts
- **Function:** Sales
- **Parts:** App
- **Data in and out:** Cases and contacts
- **Owner:** Engineering
- **Cost:** Platform licence
- **Login method:** App registration
- **If it stops:** Sales has no CRM view
- **Status:** **Off**

### Email-capture service

- **What it does for us:** Email capture on the website
- **Function:** Marketing
- **Parts:** Site
- **Data in and out:** Email addresses in
- **Owner:** **Nobody**
- **Cost:** Free or paid tier unknown
- **Login method:** API key
- **If it stops:** No new leads captured
- **Status:** Live

### LinkedIn sign-in link

- **What it does for us:** Optional profile link
- **Function:** Marketing
- **Parts:** App
- **Data in and out:** Profile link
- **Owner:** Engineering
- **Cost:** Free
- **Login method:** OIDC
- **If it stops:** Optional link stops
- **Status:** Live

### Secrets vault with external secrets

- **What it does for us:** Holds secrets for the app
- **Function:** Identity and security
- **Parts:** App
- **Data in and out:** Secrets (never shown)
- **Owner:** Platform
- **Cost:** Cloud
- **Login method:** Managed identity
- **If it stops:** App cannot start
- **Status:** Live

### Payment gateway

- **What it does for us:** Taking money from customers
- **Function:** Finance
- **Parts:** (none yet)
- **Data in and out:** None
- **Owner:** Nobody
- **Cost:** **NOT FOUND**
- **Login method:** **NOT FOUND**
- **If it stops:** Cannot charge anyone
- **Status:** **NOT FOUND**


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
