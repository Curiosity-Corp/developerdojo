---
title: "The SuperNova path"
description: "The eight stages an idea passes through from first dream to a product that has taken off, rewritten in plain words, with what each stage produces and what a developer does in it."
section: "Frameworks"
order: 2
track: "frameworks"
level: "foundation"
duration: "60 min"
outcomes:
  - "Name the eight stages of the SuperNova path in order and say what each one produces"
  - "Say which stages are about people and money, and which are about code"
  - "Describe the Focus Out and Focus In habit and use it to balance a team's week"
  - "Write a one-page path plan for a product, with an owner and a proof for each stage"
resources:
  - "gov-uk/how-the-discovery-phase-works"
  - "gov-uk/how-the-alpha-phase-works"
  - "gov-uk/how-the-beta-phase-works"
  - "gov-uk/how-the-live-phase-works"
  - "y-combinator/startup-school"
  - "atlassian/minimum-viable-product"
prerequisites:
  - "01-the-frameworks-map"
updated: 2026-11-03
---

The previous lesson drew the map. This lesson walks the **path**. A path is the journey one idea takes through the map, one stage after another. It supports the whole Developer programme: weeks 1 to 2 are mostly *DREAM*, weeks 3 to 4 mostly *ORBITAL*, and weeks 5 to 6 pull the first stages together into the Product Package. The Master Developer modules go deeper into the later stages.

## 1. Why this matters

Most products fail slowly and quietly. Somebody starts building before anyone has talked to a customer. Somebody launches before anyone knows what "working" means. Somebody celebrates a launch and forgets that the real work of running the product has only begun. A path is a defence against that. It says: *these things come before those things, and each stage ends with proof.*

For a Product Development Manager the path is also a **communication tool**. When the founder says "are we ready to launch?", you can answer with the stage, the proof you have and the proof you still need. When an agent asks "what should I build next?", you know the answer depends on the stage.

A word of honesty before we start. The SuperNova path is the way World Enterprise Group describes how it incubates new companies. The source material uses big promises such as "exponential growth" and "unprecedented success". We do not repeat those. No framework can promise success. What a path can do is make the order of work clear and the evidence visible. Treat it as a checklist for good habits, not as a guarantee.

## 2. Key ideas, explained

The path has **eight stages**.

> **DREAM** then **ORBITAL** then **STARTUP** then **ANDROID Ops** then **LAUNCH Sequence** then **GROWTH Accelerator** then **Mission Control** then **Event Horizon**.

The name comes from a *supernova*, a star that suddenly shines far brighter than before. In the framework a **super nova** is a moment when a project's energy comes together and it takes off. The path is how you try to arrange for that moment: you line up the plan, the people and the product so that when the moment comes, you are ready.

Here are the stages in plain words.

### Stage 1: DREAM (discover)

**Question:** Is this idea worth my time, and who else cares about it?

DREAM is the discovery stage. The five letters are steps:

| Letter | Step | In plain words |
|---|---|---|
| **D** | Discover | Explore the idea from many sides. Research, experiment, and talk to people. |
| **R** | Relate | Give the idea a name and a place to talk about it. Find the people who care. |
| **E** | Empower | Gather the tools, books, communities and skills you need. |
| **A** | Advise | Ask outside experts. Combine their view with data. |
| **M** | Motivate | Invite others in. Share what you are learning. |

Developer week 1 (see the whole product and customer discovery) is this stage. Your product is not decided yet. You are learning. **Output:** a short discovery note in git with what you heard, from whom, and what surprised you.

*A caution.* The original text says that talking to an idea often "makes success inevitable". That is not true, and we do not teach it. Talking to people does not guarantee success. It does improve your chances of finding out early that you are wrong. That is its real value.

### Stage 2: ORBITAL (plan)

**Question:** What exactly do we want, what do we need, how will we know, and how does everything move?

ORBITAL is the product plan: Objective, Resources, Budget, Indicators, Transport, Activities, Logistics. It has four full lessons in this track, starting with Objective, Resources and Budget. **Output:** one ORBITAL file per product.

### Stage 3: STARTUP (lay the foundations)

**Question:** What must exist so that this can operate as a real organisation?

STARTUP lists six foundations:

| Part | In plain words |
|---|---|
| **Structure** | Legal form, registrations, the industry codes, a bank account, insurance. |
| **Think Tank** | A short ORBITAL (a "mini ORBITAL") for the venture itself: goal, scope, aims. |
| **Analysis** | A SWOT (strengths, weaknesses, opportunities, threats), market fit, training and sustainability planning. |
| **Relations** | Partners, affiliations and people you can call. |
| **UX/UI** | The look, the feel, the fit for the customer, and the product roadmap. |
| **Publications** | All the documents in one place: contracts, policies, procedures, vesting schedules (who earns which share over time). |

Two notes. First, the legal and financial parts need a qualified professional in your country. Developer Dojo teaches the *idea* of these foundations. It does not give legal or tax advice. Second, notice the last item. *Publications* is the same idea as The Way: keep every decision in one reviewed place. For us, that place is git.

### Stage 4: ANDROID Ops (build)

**Question:** How does work move from idea to a delivered, improving product?

ANDROID Ops is our operating model, with seven focus areas: Advance, Network, Design, Research, Optimize, Implement, Deliver. It joins agile working, DevOps (the practice of building and running software together) and MLOps (the same for machine-learning systems). It has its own set of lessons, starting with Why a new operating model. **Output:** a working increment of the product and the records of how it was made.

### Stage 5: LAUNCH Sequence (release)

**Question:** Are we ready to put this in front of real users?

In the SuperNova path, LAUNCH has its own six letters:

| Letter | Part | In plain words |
|---|---|---|
| **L** | Logistics | Plan the launch. Run security checks and rehearsals. |
| **A** | Application | Prepare what you are shipping and set its boundaries. |
| **U** | Users | Name the first users, customers and staff involved. |
| **N** | Navigation | Set the path, the pace and what the launch will spend. |
| **C** | Channel | Choose the routes to customers: marketing, business-to-business, business-to-consumer. |
| **H** | Hive | Name the team and groups who will launch and support it. |

There is a second meaning of "Launch Sequence" that you will meet in the engineering lessons: a *delivery pipeline* with proof at each step (source checks, supply-chain checks, security scans, deployment, governance). The two fit together. The six letters plan the *launch as a business event*. The pipeline proves the *software is safe to ship*. A launch needs both. **Output:** a launch plan and a release with its evidence.

### Stage 6: GROWTH Accelerator (fund and grow)

**Question:** How do we pay for the next stage, and how do we reach more people?

The source describes this as a way to win new funding from procurement notices, requests for proposals (RFPs, public documents where a buyer asks suppliers to bid), partnerships and grants. The six steps:

| Step | In plain words |
|---|---|
| **G** Gauge | Are we eligible, and do we have the capability? |
| **R** Research | Study the call. Understand what the funder wants. |
| **O** Organize | Collect the paperwork and requirements. Make checklists. |
| **W** Work | Write the proposal and the statement of work to match what the funder asked for. |
| **T** Target | Write the budget story, the indicators and the objectives and key results (OKRs). Check compliance. |
| **H** Health | Keep checking the application, and keep up with the field. |

For a developer, the point is simple: *growth costs money and trust, and money usually comes with rules.* You will write parts of such proposals. A grant application, for example, wants a clear budget and measurable indicators. If you wrote an ORBITAL, you already have most of the material. **No framework guarantees funding.** Write only claims you can back up.

### Stage 7: Mission Control (operate)

**Question:** Is the product healthy right now, and who acts when it is not?

Mission Control is the operations centre for launched products. In the source it is a team that watches progress, keeps track of risks and uses data to decide. In practice it means dashboards, alerts, agreed targets for service quality, an incident process and regular reviews. It has its own lessons in the Frameworks track.

### Stage 8: Event Horizon (take off)

**Question:** Has the product reached a point where it keeps growing on its own strength?

In physics, an event horizon is a boundary you cannot come back across. In the framework it stands for a tipping point: real **market traction** (customers coming and staying, revenue, efficient operation) and **synergy** (the parts reinforcing each other). It is a *goal*, not a date, and not every product reaches it. Decide in advance what traction means for your product, in numbers, in your ORBITAL indicators. Then you will know it when you see it, and you will not fool yourself earlier.

## 3. Focus Out and Focus In

Alongside the path, the source describes two habits for a team:

- **Focus Out (macrocosm):** work that reaches *outward*: partnerships, sharing what you know, showing your results.
- **Focus In (microcosm):** work that builds the team *inward*: training, documentation, mentoring.

Healthy teams balance both. A team that only faces out burns out and loses its knowledge. A team that only faces in builds a beautiful product nobody hears about. The source also uses a few names for how teams organise: a **focus cell** (a small team on one project), a **focus jam** (a working session to solve a problem together) and a **focus hive** (a network of focus cells with a shared goal). You can use these words or your own. The ideas matter more than the names.

## 4. Step by step: write a path plan

1. Create `frameworks/path.md` in your planning repository.
2. List the eight stages. For each, write: **Where I am** (not started, in progress, done), **Proof** (a link to a file, a record or a result), **Owner** (a person, by role if no name yet) and **Next step**.
3. Be strict about proof. "We talked to customers" is not proof. "Twelve interview notes in `discovery/`" is.
4. Mark the stages that are *people and money* (DREAM, STARTUP, GROWTH) and those that are *code and operations* (ANDROID Ops, LAUNCH, Mission Control). Check you are not ignoring one side.
5. Note one Focus Out and one Focus In task for this week.
6. Review the plan at the end of every milestone and update the status.

## 5. Worked example: TrailMug on the path

| Stage | Where TrailMug is | Proof | Owner |
|---|---|---|---|
| DREAM | Done for the first pass | `discovery/interviews/` with ten notes from café owners and cup users | Maya |
| ORBITAL | Draft | `planning/orbital.md` | Maya, with a finance adviser |
| STARTUP | In progress | A checklist of registrations, with the lawyer's name and the date asked | Maya |
| ANDROID Ops | Starting | First epic "Customers can join, get a cup and return it at any partner café" in the roadmap | Maya, with agents |
| LAUNCH Sequence | Not started | Launch plan planned for after the pilot build | Maya |
| GROWTH | Not started | A list of two possible local grants to check for eligibility | Maya |
| Mission Control | Not started | A draft list of three health checks | Maya |
| Event Horizon | Defined, not reached | "Cups in circulation and return rate stay above the target for three months" | Maya |

Notice three things. The proof column has real files. Event Horizon is defined in advance and in numbers. And the table is honest: most rows are not done, and that is fine. The value of the path is that Maya can see it.

**Focus Out this week:** show the prototype to two café owners. **Focus In this week:** write the setup guide so a new volunteer can run the project.

## 6. Working with AI agents on this

| | At the path level |
|---|---|
| **What the PDM decides** | The order of work. What counts as proof. When a stage is finished. Whether to move on. |
| **What agents do** | Summarise interview notes. Draft checklists for registrations in your country, for you to confirm with a professional. Draft a first SWOT from your notes. Search public funding calls and list what each one asks for. |
| **How the PDM verifies** | Open every link. Compare the summary with the original notes. Never accept a legal or tax statement from an agent without a professional's confirmation. |
| **Who else is involved** | Founder, lawyer, accountant, designer, marketer, operations lead. |

A brief you can adapt:

```text
Read the folder discovery/interviews/. Do not add outside knowledge.
1. List the five problems customers mention most, with a count and a
   quote for each.
2. List two things a customer said that surprised you.
3. List what is NOT answered by these notes and who we should ask.
Return markdown. Mark anything you inferred as INFERRED.
```

Agents are good at this kind of reading. They are not good at deciding that a stage is finished. That is your job. And remember: **people write epics and roadmaps; AI never does.** An agent may summarise what you heard. It does not choose what you build.

## 7. Common mistakes and how to avoid them

- **Skipping DREAM because you are excited to build.** Fix: write a discovery note first. If you cannot, you are not ready to plan.
- **Doing STARTUP in your head.** Registrations, insurance and contracts are boring and they matter. Put them on the list with dates.
- **Launching without a plan for the day after.** A launch is the start of Mission Control, not the end of the project.
- **Chasing funding before you have measures.** A funder will ask for indicators and a budget. Build the ORBITAL first.
- **Treating Event Horizon as a promise.** Define it in numbers and expect that you may not reach it.
- **Treating the path as a straight line.** You will go back. Learning in LAUNCH may send you back to DREAM. That is normal.

## 8. Practice

**Goal:** write the path plan for your product or for TrailMug.

1. Create `frameworks/path.md` with the eight-stage table above for *your* product.
2. For each stage, add one proof that exists today, or write `NO PROOF YET`.
3. Define your Event Horizon in numbers.
4. Choose one Focus Out task and one Focus In task for this week and add them at the bottom.
5. Ask an agent to read your table and list the three weakest proofs. Write which ones you agree with, and why. Add `AI use:` at the top.
6. Open a merge request and ask someone outside your discipline (a designer or a finance person) to read it.

**Deliverable:** `frameworks/path.md` merged, with at least four proofs linked and the Event Horizon in numbers.

## 9. Checklist

- [ ] I can name the eight stages in order.
- [ ] I know what each stage must produce.
- [ ] I know which stages need a professional (legal, tax) and I did not ask an agent to replace them.
- [ ] My Event Horizon is written in numbers.
- [ ] Every "done" stage has a link as proof.
- [ ] I chose one Focus Out and one Focus In task.
- [ ] My path plan is merged to git, with the AI use noted.
