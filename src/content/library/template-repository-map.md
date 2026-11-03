---
title: "Template: Repository map"
description: "One table that lists every repository your product needs, with owner, kind and status."
section: "Templates"
order: 4
---

Copy this table into a `repo-map` file in your planning repo. One row per repo. Read the [Repository map standard](/library/repository-map-standard) first.

```text
| # | Repo | Kind | Owner (human) | Audience | Visibility | Depends on | Status | Epic link |
|---|---|---|---|---|---|---|---|---|
| 1 | <product>-planning | planning | | staff | private | | | |
| 2 | <product>-site | site | | public | | | | |
| 3 | <product>-app | app | | customers | private | | | |
| 4 | | | | | | | | |
```

## Example rows (TrailMug, fictional)

| # | Repo | Kind | Owner | Audience | Visibility | Depends on | Status | Epic |
|---|---|---|---|---|---|---|---|---|
| 1 | trailmug-planning | planning | Maya | staff | private | none | exists | #1 |
| 2 | trailmug-site | site | Maya | public | public output | analytics | exists | #3 |
| 3 | trailmug-app | app | Maya | customers | private | pay, crm | exists | #6 |
| 4 | trailmug-svc-returns | svc | Maya | engineers | private | crm | planned | #4 |
| 5 | trailmug-flow-welcome | flow | Maya | staff | private | int-email, crm | planned | #5 |

## Description line for each repo

```text
<Purpose>. Kind: <kind>. Owner: <name>. Audience: <audience>. <public|private>. Epic: <link>.
```

## Checklist

- [ ] Every name is `<product>-<kind>-<name>`.
- [ ] Every repo has one human owner.
- [ ] Status is exists or planned, never guessed.
- [ ] I added policy, help, status, analytics, support and infrastructure.
- [ ] I counted the rows: ___
