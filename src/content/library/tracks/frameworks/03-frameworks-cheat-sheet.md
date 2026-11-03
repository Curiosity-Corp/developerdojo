---
title: "Frameworks cheat sheet"
description: "Every framework and acronym in the track, spelled out with one line each, the question it answers and the artefact it produces. Keep it open while you work."
section: "Frameworks"
order: 3
track: "frameworks"
level: "foundation"
duration: "30 min"
outcomes:
  - "Spell out every acronym in the Frameworks track from memory, or find it here in seconds"
  - "Pick the right framework for a question in under a minute"
  - "Name the file each framework should leave in your git repository"
resources:
  - "us-census-bureau/naics"
  - "united-nations/sustainable-development-goals"
  - "atlassian/product-roadmaps"
  - "gitlab/milestones"
  - "atlassian/what-is-agile"
prerequisites:
  - "01-the-frameworks-map"
updated: 2026-11-03
---

This page is a reference, not a story. Read lessons 1 and 2 first. Then come back here when you meet a word you do not remember. It supports every Developer week, because the same words appear in all of them.

## 1. Why this matters

A Product Development Manager talks to many disciplines in one day. A finance colleague, a designer and a founder will use your words only if the words are short and clear. Every acronym in these frameworks is a small memory aid. If you forget what one letter means, the aid has failed. This sheet is the backup. It also shows the **question** each framework answers. When you are stuck, ask the question first, then look for the framework.

## 2. Pick a framework by question

| If you are asking... | Use | Lesson |
|---|---|---|
| "What industry is this? Who are the big players? What could shake it?" | UBF | [UBF: the business galaxy](/library/tracks/frameworks/05-ubf-the-business-galaxy/) |
| "Which official code describes our industry?" | NAICS or SIC, inside UBF | [NAICS, SIC and your galaxy](/library/tracks/frameworks/06-naics-sic-and-your-galaxy/) |
| "Where does this project sit, where is it going, how does it connect, what will it reach?" | STAR | [STAR](/library/tracks/frameworks/08-star-describe-a-project/) |
| "Should we change focus for a few hours?" | SHIFT | [SHIFT](/library/tracks/frameworks/10-shift-the-focus-shift/) |
| "What is the plan, the budget and the measure of success?" | ORBITAL | ORBITAL: Objective, Resources, Budget |
| "How does work flow from idea to delivery?" | ANDROID Ops | Why a new operating model |
| "Which technology do we start with?" | PHANTOMS | PHANTOMS track |
| "Where are we on the journey?" | SuperNova path | [The SuperNova path](/library/tracks/frameworks/02-the-supernova-path/) |

## 3. Every acronym spelled out

### The path (SuperNova)

| Stage | Meaning | One line |
|---|---|---|
| **DREAM** | Discover, Relate, Empower, Advise, Motivate | Discovery before you build. |
| **ORBITAL** | Objective, Resources, Budget, Indicators, Transport, Activities, Logistics | The product plan. |
| **STARTUP** | Structure, Think Tank, Analysis, Relations, UX/UI, Publications | The foundations of a real organisation. |
| **ANDROID Ops** | Advance, Network, Design, Research, Optimize, Implement, Deliver | The operating model for building and improving. |
| **LAUNCH** | Logistics, Application, Users, Navigation, Channel, Hive | Planning the launch as a business event. |
| **GROWTH** | Gauge, Research, Organize, Work, Target, Health | Finding funding and growth routes, with rules. |
| **Mission Control** | (a name, not an acronym) | Watching and steering a launched product. |
| **Event Horizon** | (a name, not an acronym) | The tipping point of real traction. |

### Industry (UBF)

| Term | Plain meaning |
|---|---|
| **UBF** | Universal Business Framework: a way to picture an industry like a galaxy. |
| **Galaxy** | A whole industry, matched to an industry code. |
| **Black hole** | The largest, most powerful company at the centre of a galaxy. Everything around it feels its pull. |
| **Super nova** | A big event felt across the industry, such as a new law or a technology jump. |
| **Solar system** | A group of companies under one holding company (a company that owns other companies). |
| **Sun** | The largest visible company in a solar system, or an organisation's headquarters. |
| **Super star** | A flagship company or fast-growing project that might become a sun. |
| **Star** | A small company or project, described with STAR. |
| **Moon** | A side project, startup, subsidiary or department, planned with ORBITAL. |
| **Comet, asteroid** | An unstable project that needs better planning, or avoiding. |
| **Droid** | One focused unit of work with one purpose. It may be a person's task or an AI agent's job. |
| **NAICS** | North American Industry Classification System. |
| **SIC** | Standard Industrial Classification. An older code system still used in many records. |

### Project (STAR and SMART)

| Term | Plain meaning |
|---|---|
| **STAR** | **S**pace, **T**rack, **A**ssist, **R**each. |
| **Space** | Where the project sits among competitors, partners and rules. |
| **Track** | Its past, present and future path. The roadmap lives here. |
| **Assist** | What you build or choose so others can plug in: APIs, DevOps, MLOps. The integrations live here. |
| **Reach** | Where it is going: the result, new abilities and measurable impact. |
| **SMART** | Specific, Measurable, Achievable, Relevant, Timed. A test for a clear task. |
| **SHIFT** | A four-hour focus block to change a project's course using ANDROID activities. |

### Plan (ORBITAL)

| Letter | Element | One line |
|---|---|---|
| **O** | Objective | The one outcome you want, in measurable words. |
| **R** | Resources | People, tools, data, equipment, partners. |
| **B** | Budget | What it costs, when, and who pays. |
| **I** | Indicators | How you will know: KPIs (key performance indicators) or SDGs (Sustainable Development Goals). |
| **T** | Transport | How goods, data, energy and value move from A to B. |
| **A** | Activities | The tasks, events and milestones, in time order. |
| **L** | Logistics | Coordination, communication, risks and learning (MEL: monitoring, evaluation and learning). |

### Operating model (ANDROID Ops and DROID Ops)

| Letter | ANDROID Ops | DROID Ops |
|---|---|---|
| **A** | Advance: improve the roadmap, automate | (not used) |
| **N** | Network: connections, communication, architecture | (not used) |
| **D** | Design: shape the look, flow and system | Design |
| **R** | Research: find facts and options | Research |
| **O** | Optimize: make the process better | Optimize |
| **I** | Implement: build and integrate | Integrate |
| **D** | Deliver: give value to the customer | Deliver |

*A note on names:* the [Product Catalogue standard](/library/product-catalogue-standard) uses the noun forms (Advancement, Networking, Optimisation, Implementation, Deployment). They mean the same seven areas.

### Technology (PHANTOMS family)

PHANTOMS is a **family** of agent-ready starting stacks. You choose each piece by the job it does, and you swap pieces as technology improves.

| Letter | Piece (in the core starter) | Job |
|---|---|---|
| **P** | PostgreSQL | Durable data you can trust. |
| **H** | Hono | A small web API. |
| **A** | **AI** | Models and agents behind a replaceable adapter. It is provider-neutral: never tied to one vendor. |
| **N** | Next.js | The web application. |
| **T** | Turborepo | Runs tasks across a multi-package project and caches the results. |
| **O** | OpenClaw | An optional agent runtime for tools with limits. |
| **M** | Milvus | Optional search by meaning (vectors). |
| **S** | SeaweedFS | Optional file and object storage. |

Variants today: **PHANTOMS core** (the learning starter), **PHANTOMS+ web** (adds a modern styling and component layer such as Tailwind CSS and shadcn/ui), and **PHANTOMS TUI** (terminal apps written in Go with the Charm libraries). More will follow. Read the PHANTOMS track.

### Agents and the command chain

| Term | Plain meaning |
|---|---|
| **Use, delegate, orchestrate, govern** | The four rungs of agent skill: work with one agent; give it a whole task with a brief; run many sessions in a chain; control them with written policy and gates. |
| **Session** | One agent working on one task. |
| **Commander** | Runs one product's command centre and its sessions. |
| **Chief of Command** | Runs several Commanders (a "master commander"). |
| **Admiral** | Oversees everything inside written policy, and delegates outcomes. |
| **Policy** | Rules written down as files that people and agents can read. |
| **Hook** | A check that runs automatically at a set moment, for example before a change is saved. |
| **Gate** | A condition that must be true before work moves on, such as a green pipeline or a required review. |

Read more in the agent orchestration track.

### Other short words you will meet

| Word | Meaning |
|---|---|
| **KPI** | Key performance indicator: a number that shows progress. |
| **OKR** | Objectives and key results: a goal plus the numbers that prove it. |
| **SDG** | One of the 17 United Nations Sustainable Development Goals. |
| **MVP** | Minimum viable product: the smallest version that teaches you something real. |
| **SWOT** | Strengths, weaknesses, opportunities, threats. |
| **RFP** | Request for proposals: a buyer asks suppliers to bid. |
| **API** | Application programming interface: a defined way for one program to talk to another. |
| **CI/CD** | Continuous integration and delivery: automatic tests and releases. |
| **PDM** | Product Development Manager: you. |

## 4. Where each framework leaves a file in git

| Framework | File in your planning repository |
|---|---|
| Map and path | `frameworks/map.md`, `frameworks/path.md` |
| UBF | `frameworks/galaxy.md` |
| STAR | `frameworks/star.md` (plus links to the roadmap and the integrations register) |
| SHIFT | `frameworks/shifts/YYYY-MM-DD-title.md` |
| ORBITAL | `frameworks/orbital.md` |
| ANDROID Ops | issues, milestones, labels and merge requests |
| Catalogue | `catalogue/` ([Product Catalogue standard](/library/product-catalogue-standard)) |

## 5. Working with AI agents on this

Give an agent this sheet as **context** (see the agents track on writing context files) and it will use your words correctly. Without it, an agent will invent its own meanings.

| | With the cheat sheet |
|---|---|
| **What the PDM decides** | Which framework to apply, and what the product's own answers are. |
| **What agents do** | Check your documents for missing letters. Convert between a long document and a one-page summary. Keep terminology consistent. |
| **How the PDM verifies** | Compare the agent's output with this sheet. If it adds or renames a letter, reject it. |

A brief you can adapt:

```text
Context: the file frameworks/cheat-sheet.md defines our terms.
Task: read planning/orbital.md and list every ORBITAL element that is
missing, empty or only a guess. Do not fill anything in.
```

## 6. Common mistakes and how to avoid them

- **Mixing up the two Ds.** ANDROID has two D's: Design and Deliver. Learn the seven in order: *Advance, Network, Design, Research, Optimize, Implement, Deliver.*
- **Using STAR for the industry.** STAR describes one project. UBF describes the industry.
- **Using the same letters from different frameworks.** "Logistics" appears in ORBITAL and LAUNCH, with related meanings. Say which one you mean.
- **Believing PHANTOMS is one fixed stack.** It is a family, and the letters are jobs.

## 7. Practice

1. Copy the cheat sheet into your repo as `frameworks/cheat-sheet.md`.
2. Add a column **My product** to the *Pick a framework by question* table. Write one real question from your own project in each row.
3. Close the page. On paper, write the seven ORBITAL letters, the four STAR parts and the seven ANDROID areas from memory. Check yourself and mark what you missed.
4. Commit the file with a message like `Add framework cheat sheet with my product's questions`.

**Deliverable:** `frameworks/cheat-sheet.md` in git with the extra column filled for at least five rows.

## 8. Checklist

- [ ] I can spell out ORBITAL, STAR and ANDROID Ops without looking.
- [ ] I know the difference between the SuperNova LAUNCH letters and a delivery pipeline.
- [ ] I know PHANTOMS is a family and A means AI, never one vendor.
- [ ] I know which file each framework leaves in git.
- [ ] My cheat-sheet copy has my own questions in it.
