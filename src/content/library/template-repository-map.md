---
title: "Template: Product repository map"
description: "The Week 1 sheet that lists every repository, domain, service and tool of your product, field by field, with a TrailMug example and the how-to-fill rules."
section: "Templates"
order: 4
fillable: "template-3-product-repository-map"
level: foundation
duration: "2 to 3 hours for a first pass"
outcomes:
  - "List every repository, domain and service of a product, with one purpose each."
  - "Fill the type, owner, access and ties-into columns correctly."
  - "Find gaps: parts with no owner, parts that are missing, links nobody knows."
  - "Finish with a one-page picture of the whole product."
resources:
  - c4model/c4
  - gitlab/epics
  - atlassian/project-dependencies
  - atlassian/service-catalog
  - backstage/software-catalog
  - gov-uk/service-standard-simple
prerequisites:
  - templates-overview
  - week-1-see-the-whole-product
---

The repository map is the first template of the program. It sits in **Week 1: See the whole product**. You use it to answer a hard question that many builders cannot answer: what exactly is my product made of?

## Download the blank template

- Excel file (original format): [template-3-product-repository-map.xlsx](/templates/template-3-product-repository-map.xlsx)
- Markdown copy, to keep in git: [template-3-product-repository-map.md](/templates/template-3-product-repository-map.md)

Make your own copy first. In git, keep it as `map/repository-map.md`. The workbook has three sheets: Cover, Repository map and How to fill.

## Why it matters

A product is more than the app. A real product has a website, a lead page, an app, small cloud services, a payment service, a customer database, tools for operations and glue to other vendors. Different people own different parts, and many parts are in different places. When something breaks, or when you want to add an outcome, you must know which parts it touches.

The map also supports the rule at the heart of the program: **an epic crosses parts of the product.** If you do not know the parts, you cannot write an epic. The most valuable column of the sheet is "What it ties into", because your epics come from those links.

## Key ideas

- **Row:** one repository, domain, service or tool. Not one team, not one feature.
- **Type:** a fixed list, so maps from different products can be compared.
- **Ties into:** which other rows this one talks to. Use the names from column A.
- **Owner:** a real person or team. If nobody owns a part, write NOBODY.
- **Access:** your own access to the part, **write** or **none**. The proprietary app is often "none", because you do not touch its code. Your access column is honest about what you can change.
- **Finding:** a missing or unowned part is a finding, not a failure.

## How to fill it: steps

1. **Start from the places.** Open your product's GitLab groups and list every repository. Then list the domains you can open in a browser. Then list the tools that sit behind them.
2. **Add one row each.** Name, URL or domain, type, one-sentence purpose.
3. **Choose the type from the list.** Marketing site is the public website. App is the product people log in to. Squeeze page or interactive tool is a lead page, a brief or a calculator. Cloud microservice is a small hosted service such as a function or workflow. Integration is glue to another vendor. CRM, Payments and Ops are their own types. Planning is where your epics live.
4. **Write the ties.** For each row write which other rows it calls or is called by.
5. **Name the owner.** A person or team. If you do not know, write NOBODY and look at it again in Week 3.
6. **Mark your access.** Write or none.
7. **Add rows for parts you expect but cannot find.** For example, if there is no payment gateway, add the row and write NOT FOUND in Notes.
8. **Draw the picture.** One page, boxes and arrows. The arrows are the ties.

## Every field explained

| Column | What to write | TrailMug example (fictional) |
|---|---|---|
| Repo or service name | A short name, the same everywhere | trailmug-svc-returns |
| URL or domain | Where it lives | your GitLab host/trailmug/trailmug-svc-returns |
| Type | From the list | Cloud microservice |
| Purpose (one sentence) | What it does, in plain words | Records each cup return and starts the deposit refund |
| What it ties into | Names of other rows | trailmug-app, trailmug-pay, trailmug-int-email |
| Owner | A person or team, or NOBODY | Operations lead |
| Your access | write or none | write |
| Notes / gaps I found | Anything odd | No alert if a refund fails for more than a day |

The sheet also starts with one example row: your product's planning group, type **Planning**, with the purpose "Where my epics and roadmap live. This is my own plan." Keep it. It is the home of your roadmap.

## A filled example in short

| Name | Type | Purpose | Ties into | Owner | Access |
|---|---|---|---|---|---|
| trailmug-planning | Planning | Epics and roadmap for TrailMug | All parts, through epics | Me | write |
| trailmug-site | Marketing site | Public website | trailmug-app, trailmug-crm | Marketing | write |
| trailmug-app | App | Member app: find a café, scan a cup | trailmug-svc-returns, trailmug-pay | Product | none |
| trailmug-svc-returns | Cloud microservice | Records returns and starts refunds | trailmug-app, trailmug-pay, trailmug-int-email | Operations | write |
| trailmug-pay | Payments | Takes deposits and pays refunds | trailmug-app, finance tools | Finance | none |
| trailmug-crm | CRM | Holds café owners and leads | trailmug-site | Sales | write |
| trailmug-ops | Ops | Terms, privacy, tracking rules | all | Operations | write |

Look at the ties column. The returns service touches the app, the payment service and the email service. That is the shape of an epic: "A commuter always knows the status of her deposit" crosses exactly those three parts.

## What a good map looks like

A good map passes three tests. The **stranger test**: a new colleague can read it in ten minutes and say what the product is made of. The **owner test**: every row has a person or the word NOBODY, so you know where to ask. The **change test**: pick any outcome, for example "show the deposit status", and you can point to every row that must change. If you fail the change test, the ties column is incomplete.

Keep the map alive. When a repository is added, renamed or retired, change the row in the same merge request. A map that is a month old is a story, not a map. Your coach will open the repository at the checkpoint, so the history of the file also shows how your understanding grew.

## Working with AI agents

- **May:** search code and docs to answer a fact question such as "which repository holds the payment code?" You check the answer. Explain a type name you do not know.
- **May not:** decide what ties into what, name owners, or fill your sheet for you. An agent sees only what you show it.
- **Disclose:** one line in your weekly note, for example "Used an agent to list repository names in the group. I added the ties by hand."
- **A safe brief:** "List every repository in this GitLab group with its description and last commit date. Do not guess the owner."

## Common mistakes

1. **Mapping only the repositories you wrote.** The CRM, payments and the app you cannot edit still count.
2. **Empty ties column.** Without ties you have a list, not a map.
3. **No owner.** Write NOBODY. It is a finding.
4. **Skipping parts you cannot find.** Add the row and write NOT FOUND.
5. **A picture with no arrows.** The arrows are the point.
6. **One row for a whole group.** One row per repository or service.

## Practice

1. List all repositories and domains of your product. Count them.
2. Fill the ties column for three rows without looking at any code. Then check with a search and correct yourself.
3. Find one NOBODY row. Write what could go wrong.
4. Draw the one-page picture and explain it in ten minutes to a classmate.

## Checklist

- [ ] Every repository, domain and service has a row.
- [ ] Every row has a type from the list and one purpose sentence.
- [ ] The ties column names real rows.
- [ ] Every owner is a person or team, or NOBODY.
- [ ] My access column says write or none for every row.
- [ ] Missing parts have a NOT FOUND row.
- [ ] I drew the one-page picture.

## The 2030 Product Development Manager lens

- **You decide:** what counts as part of the product, who owns it and which parts matter for the next outcome.
- **You delegate to agents:** listing repositories, reading README files, finding where a given feature is implemented.
- **A sample brief:** "For each repository in the TrailMug group, read the README and give the first line plus the language. Report 'no README' where there is none. Do not infer purpose."
- **You verify by:** opening two repositories yourself and checking the agent's line against the real purpose.
- **Disciplines involved:** architecture, engineering, operations, security, finance and sales.
- **On the agent ladder:** **use**. The map is your picture of the whole. It later guides what you **delegate**.

## Further learning

[Week 1: See the whole product](/library/week-1-see-the-whole-product) gives the weekly plan. [Deck 5](/library/deck-05-six-layers-of-a-product) shows the six layers of a product. Next, fill the [integrations register](/library/template-integrations-register) for the outside tools your map shows.
