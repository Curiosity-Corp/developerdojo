---
title: "Template: Integrations register"
description: "A table of every outside tool your product uses, who it serves and what data moves."
section: "Templates"
order: 5
---

An **integration** is a tool from another company that your product uses. Every tool needs an owner and one place where its settings live. Do not add a tool by "just signing up".

```text
| Integration | Serves (department) | Config location | Owner | Data that flows | Data that must NOT flow | Cost | Status |
|---|---|---|---|---|---|---|---|
```

## Example (TrailMug, fictional)

| Integration | Serves | Config location | Owner | Data that flows | Must NOT flow | Status |
|---|---|---|---|---|---|---|
| Email and mailing list | Marketing | trailmug-int-email | Maya | Contact, consent, campaign tag | Payment details | planned |
| Customer list (CRM) | Sales | trailmug-crm | Maya | Leads, partners, subscriptions | Passwords, card numbers | planned |
| Payment provider | Finance | trailmug-pay | Maya | Prices, tax, invoices | Card numbers (never touch our systems) | planned |
| Support desk | Support | trailmug-support | Maya | Tickets and replies | Anything not needed to help | planned |
| Analytics | Marketing and product | trailmug-analytics | Maya | Events and campaign tags | Names and emails | planned |

## Rules

- A tool has one owner and one config location.
- Record which data flows and which must not.
- Secrets are never in the register. Write their **names** only.
- Check the licence and the terms before adoption. See [Open source licences](/library/open-source-licences).
- A payment provider sends signed messages (webhooks) when something happens. Always check the signature.
