---
title: "The frameworks map"
description: "One picture of how UBF, STAR, ORBITAL, ANDROID Ops, DROID Ops, PHANTOMS and Launch Sequence fit together, from the whole industry down to one line of code."
section: "Frameworks"
order: 1
track: "frameworks"
level: "foundation"
duration: "55 min"
outcomes:
  - "Name the seven scales a Product Development Manager works at, and the framework for each"
  - "Say which question each framework answers and who on a team normally uses it"
  - "Place any decision or task on the map and choose the right framework to think with"
  - "Explain the map to a founder, a designer or a finance person in five minutes"
resources:
  - "strategyzer/business-model-canvas"
  - "learn-wardley-mapping/learn-wardley-mapping"
  - "mit-ocw/new-enterprises"
  - "svpg/articles"
  - "youtube-atlassian/what-do-product-managers-do"
  - "anthropic/building-effective-agents"
prerequisites:
  - "the-way-five-rules"
  - "week-1-see-the-whole-product"
updated: 2026-11-03
---

This is lesson 1 of the Frameworks track. It supports **Developer week 1** (see the whole product) and the **Master Developer** work on the product catalogue. You need no technical background. You need one product idea, real or the fictional TrailMug that these pages use.

## 1. Why this matters

Think about the job you are training for. We call it the **Product Development Manager** (PDM). A PDM owns a product from the first idea to the people who use it every day. In the next few years, AI agents will write most of the routine code, tests, documents and research notes. What stays with you is the work that agents cannot own: deciding what to build and why, framing the problem, writing the plan, judging the result, managing risk, and talking to every other discipline.

That second part is hard. In one day you might:

- explain to a founder why a market is risky (strategy),
- agree with a designer which user problem comes first (design),
- show a finance colleague what the next three months cost (finance),
- tell a marketer which date is safe to announce (marketing),
- ask an operations lead what happens when the system fails at night (operations),
- and read a diff that an AI agent opened this morning (engineering).

Each of these people has their own words. If you have no shared language, you spend your days translating, and things get lost. The frameworks in this track are a **shared language**. They were written to be understood by founders, designers, marketers, finance people, operators and developers alike. They give the whole team the same picture, so the PDM can decide quickly and direct agents with clear briefs.

Be honest about what these frameworks are. They were created by World Enterprise Group, a business incubator that helps start new companies. They are **not** official industry standards, and nobody should tell you they are. Think of them as a toolbox and a vocabulary that has worked for one community. Like any tool, you test each one against reality, keep what helps, and drop what does not. We point to well-known outside ideas next to each framework so you can compare.

## 2. Key ideas, explained

### The idea of scale

A map of your city and a map of your street show different things. Neither is wrong. You need both. Product work is the same. You zoom out to ask "is this market worth entering?" and you zoom in to ask "what does this one button do?" Most mistakes come from using the wrong scale: arguing about button colour when the real problem is the market, or chasing the market when the sign-up page is broken.

The frameworks give each scale a name and a method. Read the table from top to bottom: each row is closer to the work.

### The map

| Scale | Framework | The question it answers | Who normally leads | What the developer contributes |
|---|---|---|---|---|
| **Industry** | **UBF** (Universal Business Framework) | What world are we in? Who are the big players, and what events could change everything? | Founder, strategy, investors | Reads platform and technology risk. Chooses integrations with the market in mind. |
| **Company or project** | **STAR** (Space, Track, Assist, Reach) | Where does this project sit, where is it going, how do others plug into it, and what will it reach? | Founder, product, project lead | Owns *Assist*: the APIs, automation and integrations. Keeps *Track* honest with real delivery data. |
| **Product plan** | **ORBITAL** (Objective, Resources, Budget, Indicators, Transport, Activities, Logistics) | What do we want, what do we need, how will we know, and how does it all move? | Product, finance, operations | Turns the plan into milestones and issues. Sets up the measurements. |
| **Build and run** | **ANDROID Ops** (Advance, Network, Design, Research, Optimize, Implement, Deliver) and the lighter **DROID Ops** (Design, Research, Optimize, Integrate, Deliver) | How does work move from idea to a delivered, improving product? | Whole team, led by the PDM | Runs the loop in git. Directs agents. Reviews results. |
| **Technology** | **PHANTOMS** (a family of agent-ready starting stacks) | Which technology choices do we start with so we do not re-decide everything? | Developer, architect | Chooses each piece by its job. Lets agents scaffold. Verifies. |
| **Shipping** | **Launch Sequence** | What proof do we need before this goes to real users? | Developer, security, operations, marketing | Owns the pipeline and the evidence. |
| **Operating and growing** | **Mission Control**, **GROWTH Accelerator**, **Event Horizon** | Is it healthy? How do we fund and grow it? When has it taken off? | Operations, finance, marketing, founder | Builds the dashboards, the alerts and the habit of reviewing them. |

### The operating layer: how agents run all of it

The seven scales say *what* you work on. A second question is *who does the work, and what keeps it safe*. Your skill with agents grows in four steps, a ladder:

| Rung | What you do | Example |
|---|---|---|
| **Use** | Work with one agent, and read every answer. | Ask an agent to explain a draft law. |
| **Delegate** | Give one agent a whole task, with a written brief and limits. | A droid card for a market-facts page (lesson 4). |
| **Orchestrate** | Run many agent sessions at once, in a command chain. | One session per interface, with a lead that collects results. |
| **Govern** | Set written rules, hooks and gates, so many sessions stay inside limits without you reading every line. | Protected branches, a merge train, a pipeline that must be green. |

A **command chain** is a simple idea with four named roles. A **Session** is one agent doing one task. A **Commander** runs one product's command centre and its sessions. A **Chief of Command** runs several Commanders. An **Admiral** oversees the whole operation inside written policy and hands out *outcomes*, not instructions. People hold the accountable roles at the top; policy and gates keep the lower ones in bounds. This is the operating layer that sits under every scale on the map. The advanced [agent orchestration track](/library/tracks/agent-orchestration/) teaches its shape and thinking, and this track tells you where to apply it.

Two helpers sit next to the map:

- **SHIFT** (focus shift) is a protected block of four hours in which a team works on one kind of activity to change a project's course. See [SHIFT](/library/tracks/frameworks/10-shift-the-focus-shift/).
- **DREAM** is the discovery stage at the very start: Discover, Relate, Empower, Advise, Motivate. It feeds everything else. See [The SuperNova path](/library/tracks/frameworks/02-the-supernova-path/).

### The path through the map

The same frameworks also form a **path**, a journey that one idea takes, from first dream to a growing product. The source material calls it the **SuperNova** path:

> DREAM, then ORBITAL, then STARTUP, then ANDROID Ops, then LAUNCH Sequence, then GROWTH, then Mission Control, then Event Horizon.

UBF and STAR sit around this path. UBF is the wide view of the industry the path happens in. STAR is how you describe the project that travels along it. Lesson 2 walks the whole path and says honestly what each stage is for.

### The word "droid"

You will see the word **droid** often. In these frameworks a droid is *one focused unit of work with one purpose*, often a project or an automated helper. An ANDROID is a droid built on the seven ANDROID Ops focus areas. It is a space-flavoured name for something very ordinary: a small, well-defined piece of work with an owner. In 2030 a droid will often be an AI agent doing a defined job, with a person accountable for it.

### Scale, language and evidence

The astronomy words (galaxy, star, moon, orbit) are a **metaphor**. They help people remember relationships: a moon circles a planet, a star sits in a galaxy. The metaphor can mislead if you take it literally. A "black hole" company does not really swallow its competitors, and a "super nova" is not always good news. Whenever the metaphor and the facts disagree, trust the facts and write them in git.

## 3. Step by step: using the map on a real problem

1. **Write the problem in one sentence.** For example: "Cafés do not know how many cups come back."
2. **Find the scale.** Is it about the market (UBF), the project's place and path (STAR), the plan and its measures (ORBITAL), how work flows (ANDROID Ops), a technology choice (PHANTOMS), release safety (Launch Sequence), or running and growing (Mission Control)? Often the problem touches two scales. Start at the wider one.
3. **Open the framework page** and answer its questions in writing. Each question is a prompt for a conversation with the right person, not a form to fill in alone.
4. **Name the people.** Use the table. Who normally leads this scale? Invite them. You are the connector, not the only voice.
5. **Save the answers in git** as a short markdown file in the product's planning repository. Rule 2 of [The Way](/library/the-way-five-rules): if it is not in git, it is not decided.
6. **Zoom one level in or out.** Does the answer still make sense one scale up and one scale down? If the ORBITAL objective contradicts the STAR reach, fix one of them now, not after launch.

## 4. Worked example: TrailMug on the map

**TrailMug** is our fictional product: a reusable-cup service for cafés. Members get a cup, use it, and return it at any partner café. Maya is the founder and the PDM. (Everything about TrailMug is invented for teaching. The numbers are examples, not facts about any real market.)

| Scale | TrailMug's answer (short) |
|---|---|
| **UBF** | Industry: cafés and coffee shops, plus the packaging and delivery services around them. Big players: the largest café chains and the largest disposable-cup suppliers. A possible super nova: a new rule on single-use cups in a city. |
| **STAR** | *Space*: a small service between cafés and their customers. *Track*: pilot with five cafés, then twenty. *Assist*: a returns API that the café's tablet page calls, and a link to the payment provider. *Reach*: fewer disposable cups used in the partner cafés, measured by returns. |
| **ORBITAL** | *Objective*: 1,000 cups in circulation in the first year. *Resources*: Maya, one designer on contract, AI agents for routine code. *Budget*: a small monthly amount for cups, hosting and payments. *Indicators*: return rate, cups in circulation, café sign-ups. *Transport*: how cups, returns data and money move. *Activities*: the epics on the roadmap. *Logistics*: cup cleaning and collection, support, risks. |
| **ANDROID Ops** | The first feature, "Customers can join, get a cup and return it at any partner café", goes through all seven focus areas. |
| **PHANTOMS** | The order and return tracker starts from a PHANTOMS starting stack. |
| **Launch Sequence** | Before the pilot opens, every release shows its proof: tests passed, packages scanned, deployment recorded. |
| **Mission Control** | A simple dashboard of returns and errors, and a plan for what to do when the returns service is down. |

Look at how Maya uses this. When a café owner says "I worry about hygiene", Maya knows it is an ORBITAL logistics question (cleaning). When an investor asks "what if a big chain launches its own cup?", she knows it is a UBF question (a black hole in the galaxy). When her agent proposes a new database, she knows it is a PHANTOMS question. The map tells her which conversation to have and with whom.

## 5. Working with AI agents on this

The map is a **decision tool**. Agents help with the drafting and the digging. You do the framing and the deciding.

| | At the map level |
|---|---|
| **What the PDM decides** | Which scale a problem belongs to. Which framework to use. What is in scope. What the product is and is not. |
| **What agents do** | Draft a first market map. Collect public facts about an industry with sources. Turn your notes into a first draft of a STAR or an ORBITAL for you to rewrite. Check your documents for gaps against the framework questions. |
| **How the PDM verifies** | Every fact needs a source you opened. Every number needs an owner. Compare the draft with what customers told you. Look for answers that sound right but say nothing. |
| **Who else is involved** | Founder, designer, marketer, finance, operations. The map exists so they can all take part. |

The Way still applies. **People write epics and roadmaps; AI never does.** An agent may draft a *market map* or a *first-pass ORBITAL* that you then challenge, rewrite and own. It never decides the objective, never chooses the epics and never fills in the roadmap. And you [disclose AI use](/library/disclose-ai-use): write in the file header what the agent drafted and what you changed.

A brief you can adapt:

```text
You are helping me place a product on the Developer Dojo frameworks map.
Product: <one paragraph>.
Task: for each scale (UBF, STAR, ORBITAL, ANDROID Ops, PHANTOMS,
Launch Sequence, Mission Control) list the three questions that matter
most for this product, and what evidence I would need to answer each.
Rules: do not answer the questions. Do not invent facts. If you cite
anything public, give the link. Mark guesses as GUESS.
Output: a markdown table.
```

The agent returns questions, not answers. That keeps the thinking with you. When you do want a draft answer, say so, ask for sources, and rewrite it in your own words before it goes into git.

## 6. Common mistakes and how to avoid them

- **Treating the frameworks as paperwork.** If you fill them in to please someone, they rot. Fill in only what helps a real decision, and update it when the decision changes.
- **Believing the metaphor.** A galaxy map is not a prediction. Check every claim against a source.
- **Working at one scale only.** A developer who only reads code misses the market. A strategist who never reads the pipeline misses the risk. Move.
- **Using the words with outsiders without explaining them.** A finance colleague does not know what a "moon" is. Say "side project or subsidiary" first. Use the framework word second.
- **Letting an agent fill in everything.** A complete-looking table of guesses is worse than a half-empty table of facts.
- **Calling a plan done.** Mark each item as *known*, *guess* or *to check*.

## 7. Practice

**Goal:** place your product, or TrailMug, on the map, with evidence.

1. In your planning repository, create `frameworks/map.md`.
2. Copy the seven-scale table, and write one or two sentences per row for *your* product. Where you do not know the answer yet, write `TO CHECK` and who could answer.
3. Add a column **Who I would ask** with a real discipline (founder, designer, finance, and so on).
4. Add a section **Zoom check**: one place where two scales disagree, and what you would do about it.
5. Use an agent with the brief above to generate questions. Add a header line: `AI use: questions drafted by <tool>; answers written by me`.
6. Open a merge request. Ask a person from another discipline to read it and tell you which word they did not understand. Fix that word.

**Deliverable:** `frameworks/map.md` merged to your repo, with at least five rows answered and every unknown marked.

## 8. Checklist

- [ ] I can name the seven scales and a framework for each.
- [ ] I can say who normally leads each scale.
- [ ] I know the frameworks are Dojo tools, not industry standards.
- [ ] I placed a real problem on the map and chose the right framework.
- [ ] My `frameworks/map.md` is in git, with unknowns marked.
- [ ] I wrote down what an agent drafted and what I decided.
- [ ] A person from another discipline read it and understood it.

## What comes next

Read [the SuperNova path](/library/tracks/frameworks/02-the-supernova-path/) to see the journey end to end, then keep [the cheat sheet](/library/tracks/frameworks/03-frameworks-cheat-sheet/) open while you work.
