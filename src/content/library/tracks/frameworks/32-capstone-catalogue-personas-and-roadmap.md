---
title: "Capstone: catalogue, personas, journeys and the epic roadmap"
description: "Take stock of what exists with the product catalogue, learn who the product is for with personas and journeys, and turn the gaps into an epic roadmap that a person writes, with the roles and agent work at each step."
section: "Frameworks"
order: 32
track: "frameworks"
level: "advanced"
duration: "80 min"
outcomes:
  - "Build a verified master catalogue and say which entries are FOUND, NOT FOUND or PLANNED"
  - "Write two personas and a journey map from evidence and find the gaps in them"
  - "Write four to eight epics and a roadmap yourself, each linked to a persona, a measure and evidence"
resources:
  - "atlassian/epics"
  - "atlassian/agile-roadmaps"
  - "atlassian/product-owner"
  - "gitlab/docs-epics"
  - "gitlab/docs-milestones"
  - "w3c/web-accessibility-introduction"
prerequisites:
  - "tracks/frameworks/31-capstone-ubf-star-orbital"
updated: 2026-11-03
---

**Dojo programme link:** this lesson matches Developer weeks 2 and 3 ([Know the people](/library/week-2-know-the-people) and [From problems to epics](/library/week-3-problems-to-epics)) and the catalogue work of week 6 ([Catalogue, demo and package](/library/week-6-catalogue-demo-package)). It is capstone steps 5, 6 and 7 of [the overview](/library/tracks/frameworks/30-capstone-overview-and-dream-discovery/).

## 1. Why this matters

You have a dream, a landscape map and a plan. Before you build, three things must be true:

1. **You know what already exists.** Many products fail because the team did not know what they already had, or believed in things that were not there.
2. **You know the people.** A plan built for "users" in general serves nobody.
3. **You have chosen what to build, in order.** That choice is the roadmap, and it is the most important thing a PDM writes.

The rule for the third one is the strictest in the Dojo: **people write epics and roadmaps. AI never does.** This lesson shows why, and also how agents help with everything around it.

## 2. Key ideas, explained

### 2.1 The product catalogue

The [Product Catalogue standard](/library/product-catalogue-standard) has four layers, in this order: **Master, ORBITAL, ANDROID, Tech**.

| Layer | Question | Capstone file |
|---|---|---|
| Master | What exists? | `catalogue/master.md` and `catalogue/*.yaml` |
| ORBITAL | What do we need to reach the objective? | `docs/orbital.md` (lesson 31) |
| ANDROID | How will it advance and be delivered? | the seven focus areas (lessons 20 to 24) |
| Tech | What technology makes it work? | `docs/tech.md` and the PHANTOMS choices (lesson 33) |

In this lesson you build the **Master** layer. It is an inventory based on evidence. Each entry has a name, address, type, purpose, ties, owner, where the work lives, and notes. Each has a status:

- **FOUND:** verified to exist, with evidence.
- **NOT FOUND:** you looked and could not find it. Write where you looked.
- **PLANNED:** proposed, not built.

Two rules matter most. **A repository is not a running service.** And **never invent** an address, owner or status. Write "Not confirmed". The [catalogue entry template](/library/template-catalogue-entry) shows how to keep one entry per file in git, with a review like any other change.

### 2.2 Personas and journeys

A **persona** is a short description of a typical person who uses or pays for the product: who they are, what they want, what blocks them. It is based on conversations and data, not imagination. See the [personas template](/library/template-personas).

A **journey** is the path a persona takes from first hearing of the product to using it and coming back. Each step has the person's action, thought and feeling, the touch point (where they meet the product), the pain point (what goes wrong) and the opportunity. See the [journeys template](/library/template-journeys). Typical stages: Aware, Consider, Buy, Onboard, Use, Support, Return.

**Why both.** The journey exposes **gaps**. Each gap is a candidate epic. If no persona feels a gap, it is not worth an epic.

**Accessibility belongs here.** When you write personas, include people who use assistive tools, or who have limited time, language or connectivity. The W3C's [Introduction to Web Accessibility](https://www.w3.org/WAI/fundamentals/accessibility-intro/) explains the range of people. Add at least one accessibility need to a journey step.

### 2.3 From gaps to epics

An **epic** (see the [Epic standard](/library/epic-standard)) is a whole-product outcome that crosses several repositories and takes weeks to months. It has a **who** (a persona and a journey step), a **goal**, a **measure**, the **repositories** involved, **interfaces**, **acceptance** criteria, an **order** and what is **out of scope**.

A **roadmap** (see the [Roadmap standard](/library/roadmap-standard)) lists epics in order with start and due dates, owners, status and dependencies.

**Why a person must write it.** A roadmap is a set of **commitments** and **trade-offs**. It says: we will do these things, in this order, and we will not do those. An agent can produce a fluent roadmap in seconds, but it cannot be accountable to customers, partners and a team, and it cannot feel the cost of a wrong choice. If you hand the writing away, you hand away the job. The [People write epics](/library/people-write-epics) page gives the rule in full.

**What an agent can still do:** list gaps from your journeys, check that each epic has the required fields, test your acceptance criteria for clarity, compare the roadmap with the budget, and draw the roadmap as a table or picture from what you wrote.

### 2.4 GitLab and the free plan

On GitLab's free plan you have issues, labels and milestones. [Epics](https://docs.gitlab.com/user/group/epics/) are a paid feature. On the free plan, keep epics in `roadmap/epics.md` and use [milestones](https://docs.gitlab.com/user/project/milestones/) to group the issues for each. Lesson 24 explains the setup. The Atlassian pages on [epics](https://www.atlassian.com/agile/project-management/epics) and [roadmaps](https://www.atlassian.com/agile/product-management/roadmaps) give neutral explanations, and the [product owner role](https://www.atlassian.com/agile/product-management/product-owner) shows a close cousin of the PDM.

## 3. Step by step

### 3.1 Step 5: build the Master catalogue

1. **List every repository, site, service and integration** you know of (code, website, email tool, payment provider, analytics, spreadsheet).
2. **Verify each one.** Open it. Note the evidence (date checked, what you saw).
3. **Mark FOUND, NOT FOUND or PLANNED.** Do not leave a guess as a fact.
4. **Write one entry per file** from the template. Link them from `catalogue/master.md`.
5. **Add owners.** "Not confirmed" is allowed. Blank is not.
6. **Review in a merge request** with someone who knows the systems.

### 3.2 Step 6: personas and journeys

1. **Choose two personas** from your conversations. One should be the person who pays, the other the person who uses (they can be the same).
2. **Write each in half a page**, with a quote from a real conversation (anonymised).
3. **Draw one journey per persona** in a table: stage, action, touch point, thought, feeling, pain, opportunity, which catalogue item it touches.
4. **List the pain points and gaps.** Number them.
5. **Test with the persona.** Ask one real person to read their persona and say what is wrong.

### 3.3 Step 7: write the epics and the roadmap

1. **Cluster the gaps** into outcomes.
2. **Choose four to eight epics.** Fewer is better. For each, write the template fields yourself.
3. **Order them** by value, risk and dependency. Write one sentence why for each.
4. **Add dates** you can defend, and the owner.
5. **Write what you will not do.**
6. **Link the evidence:** the persona, the journey step, the catalogue entries.
7. **Present it** in five minutes (see the roadmap standard).
8. **Defend it** to someone who will challenge you (Developer week 4).

## 4. Worked example: TrailMug

### 4.1 Catalogue (extract, fictional)

| Item | Type | Status | Evidence |
|---|---|---|---|
| `trailmug-site` | Website | FOUND | Live on the date checked; opened and read |
| `trailmug-app` | Application | FOUND | Beta; sign-in tested |
| `trailmug-svc-returns` | API | PLANNED | Epic 4 |
| `trailmug-pay` | Payment provider | FOUND | Test mode only |
| `trailmug-status` | Status page | NOT FOUND | Searched the project and the domain list on the date checked |

### 4.2 Personas and journey (extract)

- **Nina, a regular café customer.** Wants to avoid waste without carrying a dirty cup. Blocked when she does not know where to return it.
- **Leo, a café owner.** Wants less waste and happy customers. Blocked when returns slow the counter.

Nina's journey, one row: **Use** stage. She returns a cup. She thinks: "Which café is closest?" She feels hopeful. The map is slow (pain). Opportunity: a fast café finder. Touch point: the app (`trailmug-app`).

Leo's journey, one row: **Onboard** stage. He gets a kit. He thinks: "How do I scan a cup?" Pain: setup is too slow. Opportunity: a short guide and a stand.

### 4.3 Roadmap (extract, written by Maya)

| # | Epic | Who | Measure | Dates | Why this order |
|---|---|---|---|---|---|
| 1 | Customers can find the nearest partner café | Nina, Use | Time to find a café under 15 seconds | Weeks 1 to 3 | Cheapest fix to the biggest pain |
| 2 | A café can start in one visit | Leo, Onboard | Setup under 30 minutes | Weeks 2 to 4 | Unblocks cafés joining |
| 3 | Customers pay a small deposit safely | Nina, Buy | 95 percent of attempts complete | Weeks 4 to 6 | Needs epic 1 for trust |
| 4 | Return a cup in under ten seconds | Leo and Nina, Use | Median return time | Weeks 3 to 6 | Core promise |

**Not doing in this version:** loyalty points, a cup photo check, a second city. Reason written beside each.

Maya wrote each epic in her own words after an agent had listed the gaps. She changed the order twice after talking to Leo.

## 5. Working with AI agents on this

**What the PDM decides.** What exists (you verify), who the product is for, what the gaps mean, which epics, in what order, with what dates. **You write the epics and the roadmap.**

**What agents can do.**

- Scan repositories, configuration and the website to draft catalogue entries with evidence paths.
- Cluster interview notes into themes, with quotes and their source.
- Draft personas from notes for you to correct (never from imagination).
- Draw the journey table from your notes.
- List the gaps from the journey.
- Check each epic against the template and flag missing fields.
- Cross-check the roadmap against the ORBITAL budget and dates.

**What agents must not do.** Write the epics or the roadmap. Invent quotes. State that something exists without evidence.

**Briefs you can adapt:**

```text
Scan this repository and its deployment files. Draft one catalogue entry
per service or integration in the format of catalogue/_template.yaml.
For each, give the file that is your evidence. If you cannot confirm that
something is running, set status to UNKNOWN, not FOUND. Do not guess
owners. Output files only, no commentary.
```

```text
Read research/interviews/ (anonymised). List every pain point as: id,
quote (exact), interview id, persona it belongs to. Do not propose
solutions. Do not merge pain points that differ in meaning.
```

```text
Read roadmap/epics.md (written by me). For each epic check the fields in
the Epic standard. Output a table: epic, missing field, unclear wording,
acceptance criterion that cannot be tested. Do not rewrite anything.
```

**How to check.** For catalogue entries, open the evidence paths and the live address. For quotes, find them in the notes. For epic checks, read each flagged item yourself.

**Disclose.** The catalogue and persona files say which agent drafted them and what you changed. The epics say "written by" and your name.

## 6. Common mistakes and how to avoid them

- **FOUND without evidence.** Write the evidence or mark UNKNOWN.
- **Treating a repo as a running service.** Check it runs.
- **Personas from imagination.** Base them on conversations, and say how many.
- **Twenty epics.** Pick four to eight.
- **Epics that are feature names.** "Landing pages" is not an outcome. Write the result for a person.
- **Hiding what you will not do.** Out of scope is part of the roadmap.
- **Letting an agent write the roadmap "just as a draft".** The draft becomes the plan. Write it yourself, from a blank page.
- **Dates with no basis.** Show why you believe each one.

## 7. Practice

**Deliverable in git:** on a branch `know-and-choose`:

1. `catalogue/master.md` and at least six entries, each FOUND, NOT FOUND or PLANNED with evidence.
2. `docs/personas.md` (two personas) and `docs/journeys.md` (one journey each), with at least one accessibility need.
3. `docs/gaps.md`: numbered gaps from the journeys.
4. `roadmap/epics.md`: four to eight epics written by you, with all fields, order reasons, dates, and an "Out of scope" section.
5. `docs/roadmap-review.md`: notes from a five-minute presentation and a challenge session (a mentor or colleague). What did they push back on, and what did you change?
6. A merge request listing every agent brief, what you checked, and a statement that the epics and roadmap were written by you.

## 8. Review checklist

- [ ] Every catalogue entry has a status and evidence.
- [ ] Owners are named or marked "Not confirmed".
- [ ] Personas come from real conversations and say how many.
- [ ] Journeys have pain points and at least one accessibility need.
- [ ] Each epic names a persona, a journey step, a measure and acceptance criteria.
- [ ] The roadmap order has a written reason and the out-of-scope list exists.
- [ ] The roadmap matches the ORBITAL plan (budget and dates).
- [ ] A person other than me challenged it.
- [ ] I wrote the epics and the roadmap myself.

**Next:** [lesson 33](/library/tracks/frameworks/33-capstone-android-ops-build-on-phantoms/) builds the first epics with ANDROID Ops, on a PHANTOMS starting point, directing a team of agents.
