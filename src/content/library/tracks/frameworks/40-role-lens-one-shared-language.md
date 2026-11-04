---
title: "Role lenses: one shared language for every discipline"
description: "How founders, product managers, designers, marketers, finance and operations people and developers use the same frameworks, what changes in each seat, and how the Product Development Manager blends them while directing agent sessions."
section: "Frameworks"
order: 40
track: "frameworks"
level: "core"
duration: "45 min"
outcomes:
  - "Explain why one shared vocabulary lets seven disciplines work on one product"
  - "Say, for each discipline, which frameworks it leans on and what it hands to agent sessions"
  - "Choose which role lens page to read next, and write your own seat map"
resources:
  - "atlassian/raci-chart"
  - "atlassian/product-owner"
  - "atlassian/what-is-agile"
  - "atlassian/what-is-devops"
  - "anthropic/building-effective-agents"
  - "google-cloud/devops-capabilities"
prerequisites:
  - "tracks/frameworks/35-capstone-growth-and-the-whole-product"
updated: 2026-11-03
---

**Dojo programme link:** this page opens the role lens set. It supports every week of the Developer path, because the path teaches you to work with people whose training is different from yours.

## 1. Why this matters

A product is built by people who learned their craft in different places. A founder thinks in bets and cash. A designer thinks in people and screens. A finance lead thinks in budgets and risk. An operations person thinks in uptime and handovers. A developer thinks in systems and tests. When each uses a private vocabulary, meetings fill with translation and mistakes slip through the gaps.

The frameworks in this track give **one shared language**. UBF names the ideas, STAR gives goals, ORBITAL gives the plan, ANDROID Ops gives the focus areas, Launch Sequence gives the gates, Mission Control gives the watch, GROWTH gives the review. This page shows how each discipline uses them.

It also shows where the **Product Development Manager (PDM)** stands. The PDM is the person who blends the seats well enough to judge the work of each, and who runs agent sessions to do the lower-level work in all of them. You do not have to be an expert in every seat. You have to know what good looks like, ask the right question, and verify.

## 2. Key ideas, explained

### 2.1 Same frameworks, different seats

| Discipline | The question they own | Frameworks they lean on most | Typical output in git |
|---|---|---|---|
| Founder | Is this worth doing and can it survive? | DREAM, STAR, Event Horizon, GROWTH | `docs/dream.md`, hypotheses, decision records |
| Product | What should we build, for whom, in what order? | UBF, personas and journeys, epics, roadmap | `roadmap/epics.md`, acceptance criteria |
| Design | Will people understand and want to use it? | DREAM (Relate), journeys, ANDROID Design | mockups, accessibility notes, design tokens |
| Marketing | Will the right people hear about it and care? | DREAM (Advise, Motivate), Launch Sequence stage 6, GROWTH Research | positioning, launch notes, channel plan |
| Finance | Can we afford it and will it pay off? | ORBITAL Budget, FinOps, GROWTH Organize and Health | budget file, cost lines, funding plan |
| Operations | Will it keep working and can we run it? | Mission Control, ANDROID Deliver, Launch Sequence | runbooks, SLOs, incident reviews |
| Developer | Does it work, safely, and can we change it? | ANDROID Implement and Optimize, Launch Sequence stages 1 to 5 | code, tests, pipelines, change records |

Each lens page ([founder](/library/tracks/frameworks/41-role-lens-founder/), [product](/library/tracks/frameworks/42-role-lens-product/), [design](/library/tracks/frameworks/43-role-lens-design/), [marketing](/library/tracks/frameworks/44-role-lens-marketing/), [finance and operations](/library/tracks/frameworks/45-role-lens-finance-and-operations/), [developer](/library/tracks/frameworks/46-role-lens-developer/)) follows the same eight-part layout, and answers the PDM questions: what do you decide, what do you hand to an agent session and with which brief, how do you verify, which other disciplines are involved.

### 2.2 The seat is not the person

Small teams have one person in several seats. A solo founder may be founder, product, design and marketing on Monday and developer on Tuesday. The lens is a hat, not a job title. Learn the hats, and wear the right one deliberately.

### 2.3 Where agents fit in each seat

Agent sessions help in every seat, and the pattern is the same:

- They **gather** (read, search, summarise, count).
- They **draft** (a first version for a person to correct).
- They **check** (compare against a template, a rule or a number).
- They **do** routine work inside policy (build an issue, produce a report).

They do not **decide**, **commit** you to a customer, **spend** money, or **sign** anything. Those belong to a person who can be held to account. Use the ladder from [lesson 33](/library/tracks/frameworks/33-capstone-android-ops-build-on-phantoms/): use one agent, delegate with a brief, orchestrate several sessions, govern with policy and gates. The track [Agent orchestration](/library/tracks/agent-orchestration/) teaches the upper rungs.

### 2.4 A shared brief format

Briefs work across disciplines when they have the same five parts:

1. **Goal:** the result you want, in one sentence.
2. **Inputs:** the files or sources to use.
3. **Scope:** what is in and what is out.
4. **Done when:** checks you can verify.
5. **Stop rule:** what to do if blocked or unsure ("write BLOCKED.md and wait").

The lens pages give examples in each discipline's language. The structure stays the same, which makes briefs easy to review.

### 2.5 Decisions and accountability

Use a [RACI chart](https://www.atlassian.com/work-management/project-management/raci-chart) for each epic: Responsible (does it), Accountable (answers for it, exactly one person), Consulted and Informed. Agent sessions can be Responsible. **Accountable is always a person.** The Atlassian note on the [product owner](https://www.atlassian.com/agile/product-management/product-owner) is a good reference for the accountability that sits closest to a PDM.

## 3. Step by step: build your seat map

1. **List the seven seats** and write your own name or "nobody yet" beside each for your project.
2. **For each seat**, write the one question it owns (use the table).
3. **Note your strongest and weakest seat.** The weakest is where you most need a person or a careful agent brief and a strict check.
4. **For each seat, list two tasks** suitable for an agent session and one that must stay with a person.
5. **Draw the handoffs.** Where does product output become design input? Where does design become code? Where does code become operations? Mark each with the file that passes between them.
6. **Write a RACI** for one epic.
7. **Choose the lens page** for your weakest seat and read it next.

## 4. Worked example: TrailMug

Maya is the PDM and the only full-time person. Her seat map for epic 1 (the café finder):

| Seat | Who | Agent sessions help with | Stays with a person |
|---|---|---|---|
| Founder | Maya | Summarising partner interviews | The decision to focus on cafés |
| Product | Maya | Checking epics against the template | Epic order |
| Design | Part-time designer | Drafting alternatives, contrast checks | Final screen choice |
| Marketing | Maya, with a volunteer | Draft partner note | Tone and what is promised |
| Finance | A volunteer treasurer | Cost table from invoices | Spending approval |
| Operations | Maya | Log summaries, status draft | Incident decisions |
| Developer | Maya, with Sessions A to C | The API and screen builds | Merge approval |

Her weakest seat is finance, so she reads the finance lens page first and asks the treasurer to review her cost table before each cycle. Her RACI for epic 1 lists herself as Accountable for everything, the designer as Responsible for screens, Session A and B as Responsible for the API and screen code, and the treasurer as Consulted on cost.

## 5. Working with AI agents on this

**What the PDM decides.** Which seats to cover, who is accountable, which tasks sessions may do, and which gates apply.

**Brief to build a seat map from your project files:**

```text
Read docs/ and roadmap/ in this repository. For each of seven seats
(founder, product, design, marketing, finance, operations, developer)
list the files that the seat owns or produces, and the files it needs
from another seat. Output a table. Mark anything you are guessing as
GUESS. Do not edit any file.
```

**How to verify.** Open three of the listed files per seat. Check that the "needs from another seat" claims match real references. Remove each GUESS you cannot confirm.

**Disciplines involved.** All seven, by design.

**Mind the shape.** The more seats an agent can touch, the more you need policy. A session that can read finance files and send marketing emails is a risk. Give each session the smallest scope that does the job.

## 6. Common mistakes and how to avoid them

- **Treating one seat as "the real work".** Products fail from gaps between seats, not only inside one.
- **Private vocabulary.** Use the shared terms in issues and merge requests.
- **No single accountable person.** Name one.
- **Letting agents cross seats without policy.** Give each session one seat and one scope.
- **Believing a lens means a job title.** Lenses are hats; one person wears several.
- **Skipping the weakest seat.** Ask a person from that seat to review.
- **Overpromising in marketing or finance language that the product cannot back.** Facts first, claims second.

## 7. Practice

**Deliverable in git:** `docs/seat-map.md` containing:

1. The seven-seat table for your project, with a named person or "nobody yet" in each.
2. A RACI for one epic with exactly one Accountable.
3. Two agent tasks and one human-only task for each seat.
4. One handoff diagram or table showing the file that moves between seats.
5. A paragraph naming your weakest seat and who will review its work.
6. A merge request that lists the briefs you used and what you checked.

## 8. Review checklist

- [ ] All seven seats appear, even if "nobody yet".
- [ ] Each seat has its question and its outputs.
- [ ] One Accountable person per epic.
- [ ] Each agent task has a brief in the five-part format.
- [ ] At least one human-only task per seat.
- [ ] Handoffs are files, not conversations only.
- [ ] My weakest seat has a reviewer.

**Next:** read the lens for your weakest seat, starting with the [founder lens](/library/tracks/frameworks/41-role-lens-founder/) if you are unsure.
