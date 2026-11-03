---
title: "Deck 11: Why not Backstage, and the ITSM role map"
description: "A fair build-or-adopt decision for a developer portal, and a table showing which part of the platform plays each classic IT service management role, with honest gaps."
section: "Teaching deck"
order: 11
level: advanced
duration: "90 min"
outcomes:
  - "Explain, fairly, why the reference platform does not adopt a developer portal product."
  - "Spot the second-catalogue problem and say why two catalogues drift apart."
  - "Read the ITSM, ITIL and ERP role map and name the honest gap in each row."
  - "Add one row of your own to the role map."
resources:
  - backstage/what-is-backstage
  - backstage/software-catalog
  - atlassian/service-catalog
  - atlassian/change-management
  - atlassian/problem-management
  - axelos/itil
  - microsoft/well-architected
prerequisites:
  - deck-10-internal-developer-platform
---

This lesson covers slides 23 and 24. Slide 23 explains a decision the reference platform made: **not** to adopt Backstage, a popular open source developer portal. Slide 24 maps classic IT service management (ITSM) roles, ITIL practices and ERP to the parts of the platform that fill those roles, and shows the honest gap in each. Both slides teach a method you will reuse: say no fairly, and name your gaps.

## Why it matters

Product managers are often asked, "Why don't we just buy X?" A good answer is fair to X, names the cost of saying yes, and shows what you will do about what you give up. This lesson gives you a worked answer. The second slide teaches a related skill: translating between the language of big companies (ServiceNow, ITIL, ERP) and the way a smaller, git-centred platform does the same jobs.

## Key ideas

### Why we do not adopt Backstage (slide 23)

The speaker note starts with a rule of fairness: **say it fairly.** Backstage is a good product and many strong companies use it. The decision is a choice for the size and way of working of the reference platform, not a verdict on Backstage.

**Why we say no:**

- One more product to run and upgrade, for ever.
- Plugins and React mean a maintenance bill.
- It would be a **second catalogue** next to the existing map.
- The existing map is already checked in git, with a source and a time on every fact.
- The extension points the platform needs already exist: connectors for the search tool, and ingest for the map.

**What we give up, and how we cover it:**

| What we give up | How we cover it |
|---|---|
| One polished front door | The map's own interface is the door for what exists |
| A one-click scaffolder | Starter repos and guided agent flows |
| The plugin market | We add the connectors we need |
| Reading a Backstage catalogue | The search tool can read one, and it is switched off for us |

The last line on the slide is the rule: **no "pilot just for docs".** That is how a second catalogue is born. The speaker note gives the key argument: **two catalogues drift apart and people trust neither.** Never agree to a pilot just for docs.

Use this as a pattern when you say no to any product:

1. Be fair about its strengths.
2. Give the cost of yes (run, upgrade, maintain).
3. Name the duplicate it would create.
4. List what you give up.
5. Say how you cover each loss.

### ITSM, ITIL and ERP: the role map (slide 24)

Big companies buy one product per category. The reference platform covers the same jobs with the parts of the platform. The **Gap** column is the honest part. A gap you can name is a gap you can plan.

| Classic tool role | What plays this role in the reference platform | Honest gap |
|---|---|---|
| Configuration database (CMDB) | The map: entities and links, checked in git | Partial: no tier, lifecycle or criticality fields yet |
| Service catalogue | A catalogue repository and the map | Partial: no request forms |
| Change management | The merge request, with the pipeline as evidence | Partial: the change record is not stored anywhere yet, and there is no calendar |
| Incident management | Issues, chat, runbooks in git | Not built as one tool: no paging, no SLA timers |
| Vulnerability response | The findings tracker plus update-bot merge requests | Partial: the path from finding to issue is not verified |
| ERP (money, people, buying) | An open source ERP next to the platform | Built as a platform; no link from ERP to the map |
| Developer portal | The map, a per-service metadata file, and the search tool | Partial: no single front door |

Words: **CMDB** stands for configuration management database, the record of what you run and how it connects. **ITIL** is a framework of IT service management practices. **ERP** is enterprise resource planning: software for money, people and buying. **SLA** is a service level agreement, a promise about service levels.

The speaker note adds a task: **ask the group to add one row of their own.**

## A worked example: TrailMug

TrailMug has only 12 repos. Someone proposes buying a developer portal. The Product Development Manager writes a half-page decision using the five-step pattern.

1. **Fair:** the portal is mature, with a software catalogue and templates.
2. **Cost of yes:** a service to run and upgrade; plugin maintenance; training for the team.
3. **Duplicate:** TrailMug already has a catalogue in git (`trailmug-planning/catalogue/`). A portal would hold a second list.
4. **What we give up:** a polished front door, a ready-made template gallery.
5. **How we cover it:** a single `CATALOGUE.md` index with links; a starter repo template; a monthly check that each entry names an owner.

TrailMug's role map has an extra row: **Customer support desk.** Who plays this role? A shared inbox and a label in the planning repo. The honest gap: no tracking of response time. TrailMug writes it in as a risk and adds an issue to pick a measure.

## The 2030 Product Development Manager lens

- **You decide:** build, adopt or buy, and what you give up; which gaps you accept for now; which gaps become epics.
- **You delegate to agents:** a fact-based comparison of candidate tools from public documentation, with sources; a draft of the role map from a list of tools you name.
- **The brief you would write:** "Compare these three developer portals using only their public documentation. Give a table: licence, how to host, what it needs to run, what it replaces. Cite the page for each cell. Mark 'not found' if you cannot cite."
- **You verify by:** opening three of the cited pages yourself, and checking the licence text, not the summary.
- **Disciplines involved:** strategy (build or buy), finance (cost of running), operations (upgrade burden), engineering (extension points), legal (licences), service management (the role map).

## Working with AI agents

- **Allowed:** agents may gather public facts for a comparison. Ask for citations and open some of them.
- **Not allowed:** do not let an agent make the "adopt or not" decision. The decision carries a human name.
- **Danger:** agents agree with the framing of the question. If you ask "why should we adopt X?", you will get reasons. Ask also: "What are the strongest reasons not to adopt X?"
- **Useful:** ask an agent to turn your hand-written role map into a clean table. Check that no gap text was softened.

## Common mistakes

1. **Being unfair to the product you reject.** A fair no is more persuasive.
2. **Saying no without saying what you give up.** The loss is real.
3. **Agreeing to a small pilot "just for docs".** It becomes a second catalogue.
4. **Hiding gaps in the role map.** The Gap column is the useful part.
5. **Translating ITIL words without understanding them.** Always ask: where does this live in git, and what evidence does it leave?

## Practice

1. Pick a tool your company or a company you know has adopted or rejected. Write a half-page decision with the five steps.
2. Add one row to the role map for your own context: a classic role, what plays it, the honest gap.
3. Find a duplicate in your own work: two lists that say the same thing (for example, a spreadsheet of services and a wiki page). Write which one is the source and what you will do about the other.
4. Ask an agent for the strongest reasons **not** to adopt a tool you like. Read them honestly. Does any change your mind?

## Checklist

- [ ] I can state the five reasons for not adopting a second catalogue product.
- [ ] I can name what we give up and how we cover each loss.
- [ ] I can read each row of the role map and name the gap.
- [ ] I added one row of my own.
- [ ] I know the rule: no pilot just for docs.

## For facilitators (speaker notes)

- **Slide 23.** Say it fairly: Backstage is a good product and many strong companies use it. This is a choice for our size and way of working. The key argument is the second catalogue: two catalogues drift apart and people trust neither. Never agree to a "pilot just for docs".
- **Slide 24.** Big companies buy a product per category. We cover the same jobs with the parts of the platform. The Gap column is the honest part. A gap you can name is a gap you can plan. Ask the group to add one row of their own.

## Where to go next

Continue with [Deck 12: The OSS-first ladder and licences](/library/deck-12-oss-first-ladder-and-licences). For the longer treatment of the service catalogue, see [ITIL in git](/library/itil-in-git).
