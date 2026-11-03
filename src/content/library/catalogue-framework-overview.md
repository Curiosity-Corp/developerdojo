---
title: "The catalogue framework: four layers, one line of sight"
description: "The four-layer catalogue (Master, ORBITAL, ANDROID, Tech) in plain language: what each layer asks, how they link, and where to start."
section: "Catalogue framework"
order: 1
level: foundation
duration: "45 min"
outcomes:
  - "Name the four layers and the one question each layer answers."
  - "Explain why the Master layer comes first and why the layers must stay linked."
  - "Say which later page teaches each layer, and which template feeds it."
  - "Start your own catalogue in the right order."
resources:
  - atlassian/service-catalog
  - backstage/software-catalog
  - c4model/c4
  - gov-uk/service-standard-simple
  - atlassian/project-dependencies
prerequisites:
  - product-catalogue-standard
---

A product is more than its code. It has parts, owners, money, goals, designs, tools and a technology base. If these live in different heads, nobody sees the whole. The **catalogue framework** is a set of four short documents that put the whole product on paper, in a fixed order, with links between them.

This page is the map. The next seven pages go deep, one topic each. If you want the short standard first, read the [Product Catalogue standard](/library/product-catalogue-standard).

## Why it matters

Picture a new colleague on TrailMug, our fictional reusable-cup product. She asks: "What exists? What are we trying to reach? How do we deliver? What is it built on?" Without a catalogue she must ask four different people and she will get four different answers. With a catalogue she opens four linked pages and reads for an hour.

A catalogue also protects you. When an agent or a supplier says "this service exists", you can check the Master page and see whether anyone ever verified it.

## The four layers

| Layer | The question it answers | One-line job | Page |
|---|---|---|---|
| 1. Master | What exists in the product ecosystem? | A verified inventory of repositories, services, integrations, owners, dependencies, access and findings | [Master layer](/library/catalogue-master-layer) |
| 2. ORBITAL | What is needed to reach the objective? | Objective, resources, budget, indicators, transport, activities, logistics | [ORBITAL layer](/library/catalogue-orbital-layer) |
| 3. ANDROID | How will the product advance and be delivered? | Advancement, networking, design, research, optimisation, implementation, deployment | [ANDROID layer](/library/catalogue-android-layer) |
| 4. Tech | What technology makes it work? | The shared foundation stack plus this product's choices | [Tech layer](/library/catalogue-tech-layer) |

**The hierarchy rule.** The Master layer is the widest view. ORBITAL, ANDROID and Tech each add more detail about work or technology. Never let a lower layer contradict the Master.

## Key ideas

- **Order matters.** You cannot plan objectives for a product you have not inventoried. Start with Master.
- **Evidence before opinion.** The Master layer records what is shown to exist, not what is hoped for.
- **Four documents, not one.** Each has one purpose. Keep them short and link between them.
- **Stable names.** Use the same id for a service in all four layers, so a search finds every mention.
- **One owner each.** Every catalogue has an accountable person and a review date.

## How the layers feed each other

1. **Master** tells ORBITAL which resources and systems exist.
2. **ORBITAL** tells ANDROID which objectives and activities need delivering.
3. **ANDROID** tells Tech which connections, environments and agents must be supported.
4. **Tech** feeds back to Master when a technology choice adds or removes a part.

A change in one layer may need an update in another. Say so in the change record, and list the affected sections.

## Where the templates fit

| Template | Feeds which layer |
|---|---|
| [Repository map](/library/template-repository-map) | Master |
| [Integrations register](/library/template-integrations-register) | Master and ANDROID (networking) |
| [Personas](/library/template-personas) and [journeys](/library/template-journeys) | ORBITAL (objective, indicators) and ANDROID (design) |
| [Epic roadmap](/library/template-epic-roadmap) | ORBITAL (activities) |
| [Decision record](/library/template-decision-record) | Tech (rationale) |
| [Catalogue entry](/library/template-catalogue-entry) | Master (one small entry per service) |
| [Change record](/library/template-change-record) | Governance (material changes) |

## Steps to start your own

1. Open the [repository map](/library/template-repository-map) and finish it. This is your Master draft.
2. Add the [metadata header](/library/catalogue-metadata-and-fields) to the top of it. Name an owner.
3. Write the ORBITAL page with seven short sections. Use real numbers or write "to be measured".
4. Write the ANDROID page: connections, design, research, agents and deployments.
5. Write the Tech page: foundation, your choices and the reason for each.
6. Cross-link all four. Check each link opens.
7. Apply the [governance rules and checklist](/library/catalogue-governance-and-checklist).
8. Compare with the [full TrailMug example](/library/catalogue-trailmug-full-example).

## Working with AI agents

- **May:** list repositories and services from your group, read configuration files, compare two catalogue pages for contradictions. You check each answer.
- **May not:** decide what exists, choose owners, set budgets or indicators, or mark something FOUND without evidence you can open.
- **Disclose:** one line in the catalogue's change note, for example "An agent listed repositories. I verified two by opening them."
- **A safe brief:** "List every repository in this group with its description and last activity date. Do not guess owners or purposes."

## Common mistakes

1. **Writing ORBITAL before Master.** You plan resources for things you have not counted.
2. **One giant document.** Nobody reads it, and nobody owns it.
3. **Four documents that disagree.** Name services identically and review together.
4. **Treating a plan as a fact.** Planned things are labelled PLANNED.
5. **No owner or no review date.** An unowned catalogue goes stale in a month.
6. **Secrets in the catalogue.** Never. Put names only.

## Practice

1. Write the four questions on a card. Answer each for a product you know in one sentence.
2. Find one place in your own work where two documents already disagree.
3. Draw the loop in "How the layers feed each other" for your product.
4. List which of the four documents you already have, even in rough form.

## Checklist

- [ ] I can say the four questions without looking.
- [ ] I know the Master layer is written first.
- [ ] I know which template feeds which layer.
- [ ] I have a plan for the four documents, an owner and a review date.

## The 2030 Product Development Manager lens

- **You decide:** what belongs in the catalogue, what counts as evidence, who owns each layer, and when a layer is approved.
- **You delegate to agents:** gathering lists, checking links, comparing layers for contradictions, drafting a first version for your review.
- **A sample brief:** "Compare the ORBITAL and Master pages. List every system named in ORBITAL that is missing from Master. Do not edit either page."
- **You verify by:** opening three cited items and checking them against reality.
- **Disciplines involved:** product, finance, engineering, operations, design, research and security.
- **On the agent ladder:** the catalogue is the shared memory for **use**, the boundary for **delegate**, and the rulebook for **govern**. It is what you hand an agent so it does not guess.

## Further learning

Continue with the [Master layer](/library/catalogue-master-layer). See the same four layers in the [Product Catalogue standard](/library/product-catalogue-standard).
