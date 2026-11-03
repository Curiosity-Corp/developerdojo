---
title: "Repository map standard"
description: "How to split a product into repositories, name them, and describe each one."
section: "Standards"
order: 4
---

The **repository map** lists every repository a product needs. An epic crosses several repos. If you do not know the repos, you do not know the epic.

## Why many repos

Split along four lines:

1. **Release speed.** The website changes daily. The app changes every two weeks.
2. **Access.** An editor may change a landing page but not the app code.
3. **Technology.** Static pages, services and workflows need different tools.
4. **Audience.** Public, customers or staff.

If two parts differ on even one line, they usually belong in different repos.

## Repo kinds

Each repo has one **kind**, a short word in its name.

| Kind | What it holds |
|---|---|
| planning | Product brief, journeys, decisions |
| site | The public marketing website |
| app | The software customers use |
| lp | A landing page that trades something useful for an email address |
| brief | A long guide shown after a form |
| tool | A small interactive tool, such as a calculator |
| svc | One small service doing one job over the web |
| flow | A workflow that calls other systems in order, kept as code |
| crm | Customer-list setup as code |
| pay | Payment provider setup. No secret keys. |
| int | One outside integration |
| ops | Policies, rules, runbooks, brand rules |
| docs | Public help centre and API docs |
| status | Public status page |
| analytics | Tracking plan and dashboards |
| support | Support desk macros and rules |
| infra | Infrastructure as code. Trusted people only. |

If a need fits no kind, do not invent one. Ask your coach.

## Naming

Pattern: `<product>-<kind>-<name>`. One repo of a kind: `<product>-<kind>`.

- Lowercase and hyphens only.
- No versions, no dates.
- The kind is one word from the table. The name is one to three plain words.
- Under 40 characters. Never a person's name.

| Bad | Problem | Better |
|---|---|---|
| `TrailMug_Website_v2` | Capitals, underscore, version | `trailmug-site` |
| `returns-api` | No product prefix | `trailmug-svc-returns` |
| `trailmug-lp-spring-promo-2026` | Date in name | `trailmug-lp-cafes` |

## Description template

Every README starts with:

```text
Purpose:        <one line: what this repo does>
Kind:           <planning | site | app | lp | ... >
Owner:          <one named human, not a team>
Audience:       <public | customers | staff | engineers>
Depends on:     <repos this one needs>
Depended on by: <repos that need this one>
Visibility:     <public | private>
Deploy path:    <for example: pipeline -> static host>
Planning epic:  <link>
```

One named human owns each repo. An AI agent never does.

## Worked map: TrailMug (first 12 of about 20)

| # | Repo | Kind | Status |
|---|---|---|---|
| 1 | trailmug-planning | planning | exists |
| 2 | trailmug-site | site | exists |
| 3 | trailmug-app | app | exists |
| 4 | trailmug-lp-cafes | lp | planned |
| 5 | trailmug-svc-returns | svc | planned |
| 6 | trailmug-flow-welcome | flow | planned |
| 7 | trailmug-crm | crm | planned |
| 8 | trailmug-pay | pay | planned |
| 9 | trailmug-int-email | int | planned |
| 10 | trailmug-ops | ops | planned |
| 11 | trailmug-docs | docs | planned |
| 12 | trailmug-status | status | planned |

Mark "exists" only when the repo is really there.

## Anything else a product needs

Give each a home: legal pages (ops), security contact (ops, site), list of software parts or SBOM (app, svc), backups and restore tests (infra), brand assets (ops), translations (docs, site), accessibility (site, app), changelog (docs), community (support).

## Checklist

- [ ] The product brief names the customer and promise.
- [ ] Every name follows the rule.
- [ ] Every repo has one human owner and a description.
- [ ] I marked which repos exist and which are planned.
- [ ] The map has a dozen repos or I wrote why not.
- [ ] I made the map myself. An AI helped me check it.

A short map is a warning sign.
