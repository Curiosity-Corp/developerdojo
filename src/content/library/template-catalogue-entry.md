---
title: "Template: Catalogue entry"
description: "A small file that describes one product or service: owner, tier, repos, dependencies and service levels."
section: "Templates"
order: 8
---

One entry per product or service. Keep it as a file in git, for example `catalogue/trailmug-app.yaml`. It is reviewed like code. See the [Product Catalogue standard](/library/product-catalogue-standard).

```yaml
id: trailmug-app            # lowercase and hyphens, never renamed
name: TrailMug member app
kind: service               # product | service
owner: maya                 # one accountable human or role
tier: 2                     # 1 to 4: how important it is
lifecycle: active           # incubating | active | dormant | archived
description: >-
  Where a member manages her cup, finds a partner cafe and sees her plan.
repos:
  - trailmug/trailmug-app
dependencies:
  - trailmug-pay
  - trailmug-crm
service_levels:
  availability: "99.5% per month"
  latency_p95_ms: 800
  support_response: "next business day"
support:
  contact: support@example.org      # placeholder
  tracker: trailmug/trailmug-planning
runbook: docs/runbooks/trailmug-app.md
data_classification: confidential   # public | internal | confidential | restricted
decisions:
  - docs/decisions/0002-payments-provider.md
status: FOUND                       # FOUND | NOT FOUND | PLANNED
last_reviewed: 2026-03-02
```

## Required fields

`id`, `name`, `owner`, `tier`, `lifecycle`, `repos`, `dependencies`, `service_levels`, `support`, `runbook`. Add `data_classification` and links to decisions.

**An entry without an owner is not an entry. It is a rumour.**

## Tiers (example)

| Tier | Meaning | Example promise |
|---|---|---|
| 1 | Customers cannot work without it | 99.9% availability, response in 1 hour |
| 2 | Important, a short break is acceptable | 99.5%, next business day |
| 3 | Helpful | Best effort in business hours |
| 4 | Experiments | None |

## Rules

- Do not invent addresses or owners. Use "Not confirmed".
- Never put secrets in an entry.
- Link the entry from your Master Catalogue and back.
