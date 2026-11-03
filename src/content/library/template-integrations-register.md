---
title: "Template: Third-party integrations register"
description: "The Week 1 register of every outside tool your product depends on, field by field, with the function map and a filled TrailMug example."
section: "Templates"
order: 5
level: foundation
duration: "90 min for a first pass"
outcomes:
  - "List every outside tool or service the product depends on."
  - "Map each integration to the company function it serves."
  - "Say what breaks if each integration stops, and who owns it."
  - "Keep secrets out of the register: names and methods only."
resources:
  - atlassian/service-catalog
  - atlassian/project-dependencies
  - owasp/secrets-management-cheat-sheet
  - google-sre/embracing-risk
  - gov-uk/service-standard-simple
  - backstage/software-catalog
prerequisites:
  - templates-overview
  - template-repository-map
  - week-1-see-the-whole-product
---

The integrations register is the second Week 1 template. It lists every outside tool, vendor or service your product relies on, and shows which part of the company each one serves.

## Download the blank template

- Excel file (original format): [template-4-integrations-register.xlsx](/templates/template-4-integrations-register.xlsx)
- Markdown copy, to keep in git: [template-4-integrations-register.md](/templates/template-4-integrations-register.md)

Make your own copy first. In git, keep it as `map/integrations-register.md`. The workbook has three sheets: Cover, Integrations register and Function map.

## Why it matters

Modern products are built from other people's products. A payment provider, an email sender, an analytics tool, a login service, a customer database. Each one is a promise from someone else, and each one can change its price, its rules or its availability without asking you. If no one has written the list, then no one knows what your product depends on. The first time an integration fails, the whole team learns the list the hard way.

The register is also a map of the company. Every integration serves a function: sales, marketing, finance, support, operations, identity and security, product and data, legal, people. When one function has no integration, a manual spreadsheet is probably doing the work. When one function has ten, you may have overlap. When an integration has no owner, you have a risk.

## Key ideas

- **Integration:** a link between your product and an outside tool or service.
- **Function:** the part of the company the tool serves.
- **Data in and out:** what you send and what you receive. This is where privacy and security questions begin.
- **Owner:** a person responsible for the account, the cost and the relationship.
- **How we log in (method only):** for example "single sign-on", "shared team login in the password manager", "API key held in the secrets vault". Never the secret itself.
- **What breaks if it stops:** the sentence that shows how important the tool is.

## How to fill it: steps

1. Start from the repository map. Every row of type **Integration**, **Payments**, **CRM** and many of **Ops** hides an outside tool.
2. Look at invoices, the company card statement and the domains the product calls. Real bills and real network calls find tools nobody remembers.
3. Write one row per tool. Use the tool's name in the first column.
4. Fill the company function it serves. If it serves two, pick the main one and mention the other in the "what it does" cell.
5. In "Product parts it connects", use the names from your repository map. This links the two sheets.
6. Describe data in and out in plain words. "Email addresses go in; delivery reports come out."
7. Write the owner, the cost or contract, and how you log in (method only).
8. Write what breaks if it stops, and the status: live, trial, planned, being removed.
9. Fill the **Function map** sheet. Count integrations per function and write a short check: ok, none, too many, no owner.

## Every field explained

| Column | What to write | TrailMug example (fictional) |
|---|---|---|
| Integration / tool | The product's name | Payment provider (example) |
| Vendor | The company behind it | A well-known payment company |
| What it does for us | One plain sentence | Takes the deposit and pays refunds |
| Company function it serves | One of the functions in the list | Finance |
| Product parts it connects (repo map names) | Names from the repository map | trailmug-pay, trailmug-app |
| Data in and out | What goes in and out | Amounts and card tokens go in; payment status comes out. We never hold card numbers. |
| Owner | A person | Finance lead |
| Cost or contract | Price model and renewal date | Per-transaction fee; annual review in May |
| How we log in (method only, never secrets) | The method | Company single sign-on with two-step check |
| What breaks if it stops | The impact in one sentence | No new sign-ups; refunds stop |
| Status | Live, trial, planned, removing | Live |

The Function map sheet has one row for each function:

| Function | Count | Check |
|---|---|---|
| Sales | 1 | OK |
| Marketing | 2 | OK |
| Finance | 1 | One payment provider, no backup |
| Support | 1 | OK |
| Operations | 2 | OK |
| Identity and security | 1 | Owner unknown, look again |
| Product and data | 1 | OK |
| Legal and compliance | 0 | No tool found: terms live in a shared folder |
| HR and people | 0 | Not part of this product |

## A filled example in short

| Tool | Function | Connects | Breaks if it stops | Owner |
|---|---|---|---|---|
| Email sender | Marketing and support | trailmug-int-email, trailmug-svc-returns | No refund or welcome emails | Marketing lead |
| Analytics tool | Product and data | trailmug-site, trailmug-app | No funnel numbers; the roadmap review has no evidence | Product |
| CRM service | Sales | trailmug-crm, trailmug-site | Café leads are lost | Sales |
| Login service | Identity and security | trailmug-app | Nobody can log in | NOBODY |

The last row is the most useful. A login service with no owner is a risk written on paper, and a candidate for an epic.

## Working with AI agents

- **May:** search the repositories for the names of outside services, so you find tools you forgot. You check each result. Explain a vendor term.
- **May not:** decide what an integration is worth, write the "what breaks" sentence for you, or invent a vendor.
- **Never:** paste a password, key or token into an agent, a chat or the register.
- **Disclose:** one line in your weekly note.
- **A safe brief:** "Search these repositories for outbound web addresses and library names that look like outside services. List each with the file path. Do not open any secrets file."

## Common mistakes

1. **A secret in the register.** Names and methods only. If you pasted one, rotate it and tell your coach. Leaking a secret is serious, even in a practice repository.
2. **No owner.** Write NOBODY so that someone can act.
3. **Missing the free tools.** A free plan is still a dependency.
4. **"What breaks" left empty.** If you cannot say, you do not yet understand the dependency.
5. **Functions with zero count and no check.** A zero is a finding. Write it down.
6. **One row for a whole suite.** If a vendor gives you three products, write three rows.

## Practice

1. Check the last three months of invoices and list every vendor you find.
2. Fill the register for five tools. Ask a classmate to name one thing you missed.
3. Fill the function map. Pick one function with a zero and write what is doing that job today.
4. For one integration, write the "what breaks if it stops" sentence in front of someone who does not work in engineering. Ask if they understand.

## Checklist

- [ ] Every outside tool has a row.
- [ ] Every row names the function and the repository map parts it connects.
- [ ] Data in and out is written in plain words.
- [ ] Every owner is a person, or NOBODY.
- [ ] Login entries show the method only.
- [ ] The function map is complete with a check for every function.
- [ ] No secret appears anywhere.

## The 2030 Product Development Manager lens

- **You decide:** which dependencies are acceptable, which need a backup and which need an owner now.
- **You delegate to agents:** scanning repositories for outside service names, comparing the list with invoice lines you paste in, checking that every row is filled.
- **A sample brief:** "Read the register. For each row, tell me if any cell is empty. Do not fill the empty cells."
- **You verify by:** checking two vendors on the list against real invoices.
- **Disciplines involved:** finance, legal, security, operations, procurement and engineering.
- **On the agent ladder:** **use**. Later, when you **delegate** work to agents, the register tells you which outside systems they may and may not touch.

## Further learning

Continue with [Week 1](/library/week-1-see-the-whole-product) and [Deck 5](/library/deck-05-six-layers-of-a-product). The register links to the [repository map](/library/template-repository-map) through the "product parts it connects" column.
