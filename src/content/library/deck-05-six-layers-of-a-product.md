---
title: "Deck 5: Six layers of a product"
description: "See the whole product as six layers, build the repository map in Week 1, and learn why every integration belongs to a company function."
section: "Teaching deck"
order: 5
level: foundation
duration: "90 min"
outcomes:
  - "Describe the six layers of a product: Reach, Use, Run, Connect, Money and sales, Operate."
  - "Build a product repository map with every column filled."
  - "For each integration, name who uses it, what data goes in and out and what breaks if it stops."
  - "Find a risk by spotting an integration that has no owner."
resources:
  - c4model/c4
  - microsoft/azure-architecture-center
  - microsoft/azure-functions-overview
  - microsoft/logic-apps-overview
  - microsoft/front-door-overview
  - 12factor/twelve-factor-app
prerequisites:
  - deck-04-no-ai-epics-rule
  - repository-map-standard
---

This lesson covers slides 10, 11 and 12. Slide 10 shows a product as six layers. Slide 11 introduces the Week 1 tool, the product repository map. Slide 12 explains why every integration belongs to a part of the company. Together they teach you to **see the whole product** before you write a single epic.

## Why it matters

Epics come from the places where parts of the product meet. If you cannot list the parts, you cannot find the joins. A product map is also an honest check of your own knowledge: the first time you try to fill it in, you will find rows you cannot complete. Those gaps are the first things to learn, and often the first epics.

## Key ideas

### The six layers

The deck uses a hiring-website product from the program's worked example as the picture, marked "example only". Every product has these layers, even if some are small.

| Layer | What is in it | In the worked-example picture |
|---|---|---|
| **Reach** | How people find you | Marketing site (hosted as static pages), squeeze pages, technical briefs |
| **Use** | What people use | The app (proprietary), interactive tools |
| **Run** | What runs behind the scenes | Cloud microservices, workflow services and functions, a front door if used |
| **Connect** | How the product talks to other tools | Integrations; email, chat and identity |
| **Money and sales** | How money and customers are handled | A customer relationship manager (CRM); a payment gateway, noted as **none yet = a gap** |
| **Operate** | How the product is kept running | The operations repo: monitoring, deploy, secrets |

Two points to notice. First, a **gap is information, not an insult**. "Payment gateway: none yet" is a useful line. Second, the layers cross repositories. The product is not a single code base.

A short note on words in the table: a **squeeze page** is a simple web page with one goal, such as collecting an email address. A **CRM** is a system that stores customers and sales contacts. A **gateway** here means the service that takes card payments. A **microservice** is a small program that does one job and is called by others.

### Week 1 tool: the product repository map

The map has **one row per repo, domain or service**. The columns are:

| Column | What to write |
|---|---|
| Name | The short, consistent name of the repo, domain or service |
| URL or domain | Where it lives |
| Type | Marketing site, app, squeeze page or tool, cloud microservice, integration, CRM, payments, ops |
| Purpose | One sentence: what it is for |
| Ties into | Which other rows it depends on or feeds |
| Owner | A named person or team |
| Your access | `write` or `none`: can you change this part? The proprietary app is often `none`. |

The goal is that **no part of the product is a mystery to you**. The speaker note adds a key point: the **ties into** column is the most important one. It is where epics come from.

### Integrations belong to company functions

Slide 12 moves from code to company. Every third-party tool serves part of the company: sales, marketing, finance, support, operations, identity.

For each tool, ask three questions:

1. **Who uses it?**
2. **What data goes in and out?**
3. **What breaks if it stops?**

Examples from the slide: the CRM serves sales. The payment gateway serves finance and the customer. Identity (sign-in) serves everyone.

> When you cannot name the owner of an integration, you have found a risk.

This is where trainees see the company, not only the code.

## A worked example: TrailMug

Here are the first rows of a repository map for TrailMug. Names follow the site's naming rule: product prefix, then a short type word, all lowercase.

| # | Name | Type | Purpose | Ties into | Owner | Your access |
|---|---|---|---|---|---|---|
| 1 | trailmug-planning | planning | Vision, epics, roadmap, templates | all | Product owner (placeholder) | write |
| 2 | trailmug-site | marketing site | Tells commuters and cafés what TrailMug is | trailmug-app, trailmug-lp-cafes | Marketing lead (placeholder) | write |
| 3 | trailmug-app | app | Borrow and return cups | trailmug-svc-returns, trailmug-pay | Engineering lead (placeholder) | none |
| 4 | trailmug-lp-cafes | squeeze page | Collects café sign-ups | trailmug-crm | Marketing lead | write |
| 5 | trailmug-svc-returns | microservice | Records cup returns | trailmug-app, trailmug-int-email | Engineering lead | write |
| 6 | trailmug-crm | CRM | Stores café partners and leads | trailmug-lp-cafes | Operations lead (placeholder) | none |
| 7 | trailmug-pay | payments | Takes and returns deposits | trailmug-app | Finance lead (placeholder) | none |
| 8 | trailmug-ops | ops | Monitoring, deploy, secrets | all | Engineering lead | write |

Reading the **Ties into** column, you can already see candidate epics. The app depends on payments, and the payments row has no `write` access for you. A commuter journey that includes a deposit refund crosses four rows. That crossing is an epic.

For integrations, TrailMug's email service serves **support** and **marketing**. Ask: who uses it? Support sends return reminders. What data goes in? Commuter email and cup id. What breaks if it stops? Reminders stop and cups are not returned on time. Who owns it? If the table says nobody, you have found a risk worth an issue.

## Working with AI agents

- **Allowed:** an agent can read a repository and answer a fact question: "What does this service call?" Use this to fill the **ties into** column faster, then check the answer yourself.
- **Allowed:** an agent can check that your map has no blank cells, or that names follow the naming rule, after you wrote it.
- **Not allowed:** do not ask an agent to "draw the product map" from the repos and then accept it. You must write the **purpose** and **owner** columns yourself. An agent cannot know that a repo is dead, or that the person named as owner left last month.
- **Careful:** when you give an agent access, record that in the **your access** column. The map tells everyone what an agent may change.

## The 2030 Product Development Manager lens

This program trains the **Product Development Manager of 2030**: a person who blends strategy, product, design, brand and marketing, finance, operations, security and engineering, and who treats AI agents as the workforce for lower-level work. The bar is high, and the method is plain. In this lesson:

- **You decide:** the purpose and owner of each row, which joins matter, and which risks become issues.
- **You delegate to agents:** fact-finding in repositories to fill the ties-into column, and checks that names and cells follow the standard.
- **The brief you would write:** "Read the repository trailmug-svc-returns. List every other service, API and database it calls. Output a table: target, kind of call, file where it is called. Do not guess; write 'not found' when unsure."
- **You verify by:** opening the code that the agent cites, confirming each tie, and phoning the person named as owner.
- **Disciplines involved:** operations (hosting and monitoring), sales and finance (CRM and payments), marketing (reach), security (who can access what), engineering (the services).
- **On the agent ladder:** **use**: an agent answers fact questions about code to fill your map. The map also becomes what a command chain needs: which repos exist, who owns them and what an agent may change (the access column).

## Common mistakes

1. **Mapping only the code you wrote.** The CRM and the payment gateway count.
2. **A vague purpose.** "Helps users" tells nobody anything. Say what it does.
3. **No owner.** An unowned row is a risk, not a detail.
4. **Skipping the "ties into" column.** It is the most useful column.
5. **Treating a proprietary part as invisible.** If the app is closed to you, mark access `none`, but still map it and name who can answer questions.
6. **Names that break the pattern.** Mixed capitals, version numbers and dates in names make the map hard to search.

## Practice

1. Fill in a repository map for a product you know, with at least eight rows. Do not use AI to write it.
2. For each row, check the **ties into** column. Draw lines between the rows on paper. Circle any join that crosses three or more rows.
3. List five integrations of your product. For each, answer the three questions: who uses it, what data goes in and out, what breaks if it stops.
4. Mark each integration with an owner. If you cannot, write "risk" in red and add it to a list of issues.

## Checklist

- [ ] I can name the six layers and give an example of each.
- [ ] My map has one row per repo, domain or service.
- [ ] Every row has a purpose, a ties-into list, an owner and an access value.
- [ ] I asked the three questions for every integration.
- [ ] I found and recorded at least one risk or gap.

## For facilitators (speaker notes)

- **Slide 10.** Use the example product as the picture. Every product has these layers, even if some are small.
- **Slide 11.** Show the spreadsheet. The ties-into column is the most important one. It is where epics come from.
- **Slide 12.** This is where trainees see the company, not only the code.

## Where to go next

Continue with [Deck 6: Personas, touch points and journeys](/library/deck-06-personas-touch-points-journeys). The map is described as a standard in [Repository map standard](/library/repository-map-standard), and the blank form is the [repository map template](/library/template-repository-map).
