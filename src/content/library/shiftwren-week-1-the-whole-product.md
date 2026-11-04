---
title: "Shiftwren example, week 1: the whole product"
description: "Week 1 filled in for a fictional volunteer-shift service: the product brief, the repository map and the integrations register."
section: "Shiftwren example"
order: 1
level: foundation
duration: "45 min to read, then fill your own blank"
outcomes:
  - "See a product brief, a repository map and an integrations register filled in for a service, not a physical product."
  - "See how findings (NOT FOUND, NOBODY) appear in a Week 1 map."
  - "Fill the three Week 1 blank templates for your own product from your own evidence."
prerequisites:
  - shiftwren-example
  - week-1-see-the-whole-product
---

**Fictional example.** Shiftwren, its people, numbers and dates are made up for teaching. No real company, person or customer is described. Numbers marked "example" are round and invented. Your product needs your own evidence. Do not copy this page.

**Example only.** An AI agent drafted this page from the Week 1 brief to show the shape of the work. In the story, the fictional learner **Noor** wrote everything below herself. You write your own.

Compare the same week elsewhere: [Week 1](/library/week-1-see-the-whole-product), the [TrailMug brief](/library/template-product-brief), the [TrailMug repository map](/library/template-repository-map) and the real-product [map and integrations case study](/library/case-study-danhup-map-and-integrations).

## Step 1: The product brief (Noor's work)

Template: [Product brief](/library/template-product-brief).

```text
PRODUCT BRIEF
Product name: Shiftwren
Tagline: Fill every volunteer shift without the group-chat chase.
Owner (epic manager): Noor (fictional learner)
Sponsor or mentor: a placeholder mentor
Date / version: example, week 1, version 1

1. WHY THIS PRODUCT EXISTS
   Problem: Volunteer-run food pantries need people for every weekly
   shift. When someone cancels, the coordinator chases replacements in
   a group chat, often late at night.
   Today: group chats, shared spreadsheets, phone calls.

2. WHO IT IS FOR
   Main user: the volunteer. Main customer: the pantry (the
   coordinator chooses the tool, the treasurer approves the cost).
   Same person? No.
   Other users: coordinators, who also use the app daily.
   We will NOT serve: paid staff rotas, large charities with
   their own scheduling software.

3. WHAT SUCCESS LOOKS LIKE
   Goal: pantries fill their weekly shifts with less chasing.
   Measures (example numbers, all invented):
     1. 10 pantries using it every week, 6 months after the pilot starts.
     2. 7 in 10 cancelled shifts refilled within 24 hours.
     3. Coordinator time on cover under 15 minutes a week.

4. WHAT WE OFFER
   Promise: Shiftwren asks the next person for you.
   Three features: post shifts; confirm with one tap; ask the
   next person on the back-up list.
   How we make money: free pilot. Price after the pilot: not decided.

5. LIMITS
   Small budget. Phone numbers are personal data, so privacy rules
   apply from day one. Text messages cost money per message.

6. RISKS AND UNKNOWNS
   Will volunteers answer texts? Who pays? Will coordinators trust
   it? What does a text cost at scale? What do we owe a volunteer
   who asks us to delete their data?

7. SIGN-OFF
   Written by (human): Noor. Approved by: placeholder mentor.
```

## Step 2: The repository map

Template: [Repository map](/library/template-repository-map). A **repository** is one folder of work under version control. See the [glossary](/library/glossary). Noor opened each place and wrote what she saw. All names use the reserved `.example` domain.

| Name and domain | Type | Purpose | Ties into | Owner | Access | Notes |
|---|---|---|---|---|---|---|
| shiftwren-planning, git group `shiftwren` | Planning | Epics, roadmap, briefs | All rows, through epics | Noor | write | FOUND |
| shiftwren-site, shiftwren.example | Marketing site | Public page, pilot request form | app sign-in link; shiftwren-crm | Noor | write | FOUND. One page, draft text |
| shiftwren-app, app.shiftwren.example | App | Coordinators post shifts, volunteers confirm | svc-cover; flow-messages; int-email | Priya | write | FOUND. Prototype. Holds phone numbers: personal data |
| shiftwren-svc-cover, api.shiftwren.example/cover | Service | Chooses the next volunteer to ask | app; flow-messages | Priya | write | PLANNED |
| shiftwren-flow-messages, workflow tool | Workflow | Sends reminders and "ask next" messages | svc-cover; int-sms; int-email | Priya | write | PLANNED |
| shiftwren-int-sms, provider dashboard | Integration | Sends text messages | flow-messages | Noor | write | FOUND. Test account only |
| shiftwren-int-email, provider dashboard | Integration | Sends email | flow-messages; app | Noor | write | FOUND |
| shiftwren-crm, list in a CRM tool | CRM | Pantry leads | site form | Noor | write | FOUND. Free tier |
| shiftwren-pay, not available | Payments | Would take the monthly fee | app | NOBODY | none | NOT FOUND. No price decided |
| shiftwren-ops, repository in the group | Ops | Privacy notice, terms, runbooks | All | NOBODY | write | Draft privacy notice only. No way yet to delete a volunteer's data |
| shiftwren-status, not available | Ops | Public status page | app | NOBODY | none | NOT FOUND |
| shiftwren-infra, repository in the group | Ops | Hosting and deploy settings | site; app; svc-cover | Priya | write | FOUND. Basic |

**Why 12 rows.** The week asks for about a dozen, or a reason why not. Noor first guessed four (site, app, payments, planning). Walking the journeys added the rest.

The one-page picture (template step 6):

```text
Volunteer / Coordinator --> app --> svc-cover --> flow-messages --> SMS or email
site --> crm                infra hosts site, app and svc-cover
```

## Step 3: The integrations register

Template: [Integrations register](/library/template-integrations-register). One column per tool. No secrets: methods and names only. Vendors are not named in this example.

| Field | SMS provider | Email sender | CRM tool | Git host and pages host |
|---|---|---|---|---|
| Vendor | A message provider | An email provider | A CRM provider | GitLab |
| What it does for us | Sends texts | Sends reminders and sign-in links | Stores pilot leads | Stores work, builds and publishes the site |
| Function served | Operations | Operations | Sales | Product and data |
| Parts connected | flow-messages | flow-messages; app | site; crm | All repositories |
| Data in and out | Phone number and text out; delivery status in | Email address and text out | Lead name and email in | Source files |
| Owner | Noor | Noor | Noor | Noor |
| Cost or contract | Test credit. Price per message not decided (example) | Free tier | Free tier | Free tier |
| How we log in | Password manager, two-step sign-in | Same | Same | Same |
| What breaks if it stops | No cover requests reach people | No sign-in links | New leads are lost | Cannot publish or deploy |
| Status | FOUND (test) | FOUND | FOUND | FOUND |

Function map: Sales 1. Operations 2. Product and data 1. Marketing, Finance, Support, Identity and security, Legal and compliance, HR and people: 0 each. **Check:** Support has no tool and Legal has none, but volunteers' phone numbers are personal data. Both become gaps for Week 2.

Noor also booked five interviews (fictional): two coordinators, a retired volunteer, a student volunteer and a pantry treasurer.

## Fill your own blank from this page

- Product brief: copy the shape of Step 1, with your own facts.
- Repository map: every column is filled in Step 2, including NOT FOUND and NOBODY rows.
- Integrations register: every field and the function map are in Step 3.

## Working with AI agents

- **May:** list repositories and the first README line of each; check your spelling. You check the answers.
- **May not:** decide what ties into what, name owners or fill your map.
- **Disclose:** one line in your weekly note.

## The 2030 Product Development Manager lens

- **You decide:** what counts as a part of the product, who owns it, and which missing parts are findings.
- **You delegate:** listing repositories and README lines. Brief: "List every repository in the group with its first README line. Say 'no README' where there is none. Do not guess owners."
- **You verify by:** opening two repositories and one dashboard yourself.
- **Disciplines involved:** product, engineering, operations, finance, privacy and sales.
- **On the agent ladder:** **use**.

Next: [Shiftwren week 2, the people](/library/shiftwren-week-2-the-people).
