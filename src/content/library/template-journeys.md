---
title: "Template: Touch points and journeys"
description: "Three tables: touch-point inventory, user journey and customer journey, with a bridge to your repositories."
section: "Templates"
order: 3
---

## 1. Touch-point inventory

List every place a person meets your product. The last column feeds your [repository map](/library/template-repository-map).

```text
| Stage | Touch point | Channel | Owner | Repo needed |
|---|---|---|---|---|
|  |  |  |  |  |
```

**Example (TrailMug, fictional):**

| Stage | Touch point | Channel | Owner | Repo needed |
|---|---|---|---|---|
| Aware | Search for "reusable cup subscription" | Web search | Marketing | trailmug-site |
| Aware | A café poster with a QR code | Café | Partnerships | trailmug-lp-cafes |
| Consider | Free "waste calculator" | Web | Marketing | trailmug-tool-waste-calc |
| Buy | Sign-up and payment | App, email | Finance | trailmug-app, trailmug-pay |
| Onboard | Welcome email series | Email | Marketing | trailmug-flow-welcome, trailmug-int-email |
| Always | Privacy policy, tracking rules | Web | Operations | trailmug-ops, trailmug-analytics |

## 2. User journey map

One map per persona. Walk the steps in the order the user lives them.

```text
| Stage | User action | Thinking | Feeling | Pain | Opportunity | Repo that serves it |
|---|---|---|---|---|---|---|
```

**Example: Maya**

| Stage | Action | Thinking | Feeling | Pain | Opportunity | Repo |
|---|---|---|---|---|---|---|
| Find | Sees a poster at a café | "Could this work for me?" | Curious | Poster has no price | Show price and a QR link | trailmug-lp-cafes |
| Use | Returns a cup | "Which café is closest?" | Hopeful | Map is slow | Fast café finder | trailmug-app |
| Pay | Starts a paid plan | "Is it worth it?" | Nervous | Card fails | Clear price, simple retry | trailmug-pay |

## 3. Customer journey map

For the person who pays. Use six stages: aware, consider, buy, onboard, renew, refer.

```text
| Stage | Goal | Action | Our touch point | Question in their mind | Risk of losing them | Repo |
|---|---|---|---|---|---|---|
```

**Example: Leo, the café owner**

| Stage | Goal | Action | Touch point | Question | Risk | Repo |
|---|---|---|---|---|---|---|
| Aware | Attract customers | Hears of TrailMug from another owner | Partner page | "Is this for cafés?" | Page speaks only to drinkers | trailmug-lp-cafes |
| Consider | Compare | Asks for a call | Site, email | "How much work is it?" | No café steps shown | trailmug-site |
| Buy | Join | Signs the partner terms | Form | "Are the terms fair?" | Terms are unclear | trailmug-ops |
| Onboard | Start returns | Gets a kit | Welcome flow | "How do I scan a cup?" | Setup too slow | trailmug-docs |
| Renew | Keep the deal | Reviews monthly report | Report email | "Did it bring customers?" | No proof of value | trailmug-analytics |
| Refer | Tell other owners | Shares a link | Referral message | "Is it easy to share?" | No referral path | trailmug-site |

## 4. The bridge: journey to repo

Take every touch point. Decide which repos serve it. One touch point can need several repos. One repo can serve many.

```text
| Touch point | Journey stage | What must exist | Repo(s) | Kind | Exists or new |
|---|---|---|---|---|---|
```

Example: "Free waste calculator" needs a page, a small service and a customer list. Without this table you would plan only the page, and the lead would go nowhere.

Count the unique repos. A serious product reaches a dozen or more. If you count three, look for missed touch points.
