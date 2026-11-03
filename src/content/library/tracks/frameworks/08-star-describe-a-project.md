---
title: "STAR: describe a project"
description: "Space, Track, Assist and Reach: four questions that let anyone see where a project sits, where it is going, how others plug into it and what it will achieve."
section: "Frameworks"
order: 8
track: "frameworks"
level: "foundation"
duration: "60 min"
outcomes:
  - "Answer the four STAR questions for a project in a one-page file"
  - "Say what good looks like for Space, Track, Assist and Reach, and spot the usual mistakes"
  - "Explain why Assist is where developers do their most visible work"
  - "Write a STAR for a made-up project using only this page"
resources:
  - "atlassian/product-roadmaps"
  - "atlassian/project-dependencies"
  - "openapi-initiative/learn-openapi"
  - "google-cloud/api-design-guide"
  - "twelve-factor-app/the-twelve-factor-app"
  - "strategyzer/business-model-canvas"
prerequisites:
  - "01-the-frameworks-map"
  - "05-ubf-the-business-galaxy"
updated: 2026-11-03
---

This is lesson 8 of the Frameworks track and the first of two about STAR. It supports **Developer weeks 1 to 3**: it gives you a one-page summary of a project that you can show to a founder, a designer or an investor before the detailed roadmap exists.

## 1. Why this matters

Imagine someone asks you: "Tell me about your project." Most people answer with what it does. A better answer says *where it sits* (the market around it), *where it is heading* (the path), *how other things connect to it* (the interfaces) and *what it will change* (the result). That is STAR.

**STAR** stands for **Space, Track, Assist, Reach**. It is the framework for a **star**, which in UBF is a small company or a project. If UBF is the map of the industry, STAR is the description of one dot on it.

STAR is also where developers earn their place at the table with other disciplines. Three of the four parts are about people and plans (the market, the schedule, the impact), and one part, **Assist**, is about technology: the APIs, automation and integration that let others plug into your project. A Product Development Manager (PDM) has to write all four parts, so the PDM talks to strategy, product, finance, marketing and operations in one document.

## 2. Key ideas, explained

The short source definition is: *Space* defines where the project sits in the business system. *Track* shows its past, present and future path. *Assist* identifies or builds the module that lets others integrate. *Reach* summarises where it is going and its impact. Here is each part in depth.

### Space: where does it sit?

**Space** is the context. It places the project among competitors, partners, rules and shared resources. It answers: *What is around us, and how does that affect us?*

Questions to answer:

- Which galaxy are we in (the industry code from lesson 6)? Which solar system or black hole is closest?
- Who else does this job? Name direct competitors and *also the alternatives people use today*, including "do nothing" and "a spreadsheet".
- Who are our partners and suppliers? Which of them could we not replace quickly?
- What rules apply (laws, standards, platform terms)?
- What do we share with other projects (people, tools, data, budget)?
- What outside factors could change the picture (the super novas)?

**What good looks like:** specific names, with links; a "do nothing" alternative; at least one honest sentence about a risk from a larger company.

**Typical mistakes:** "no competitors" (there are always alternatives); a list of features instead of a map of surroundings.

### Track: where has it been, where is it, where is it going?

**Track** is the project's path through time: past, present and future. It gives a *predictable schedule*. It answers: *What have we done, what are we doing, and what comes next?*

Questions to answer:

- **Past:** what was tried before, with what result? (Link the evidence.)
- **Present:** what is the status today, in one honest paragraph? What is blocked?
- **Future:** what are the next three milestones, with a date or a range and an owner for each?
- Which tool shows the path (a timeline, a roadmap, a customer journey)?

Track is a *summary* of the roadmap. The roadmap itself, the detailed list of epics in order, is written by people, in git. See the [Roadmap standard](/library/roadmap-standard) and the [Epic and roadmap template](/library/template-epic-roadmap). STAR's Track part links to it. It does not replace it.

**What good looks like:** dates have owners; the future part says what you chose *not* to do; the present part admits what is late.

**Typical mistakes:** only the future, with no past (you cannot learn from nothing); exact dates for work you have not scoped; an optimistic present.

### Assist: how do others plug in?

**Assist** is what you build or choose so that *other people, systems and agents can work with your project*. The source describes it as "the module that allows for integration with the project, including capabilities, methodologies and operations such as APIs, DevOps and MLOps".

In plain words:

- an **API** (application programming interface) is a defined way for one program to ask another to do something. It is a contract: "send me this, I will send you that".
- **DevOps** is the practice of building and running software together: automatic tests, automatic releases, shared responsibility.
- **MLOps** is the same discipline for machine-learning models: training, testing, releasing and monitoring them.

Assist is also the *support you need from others*: other teams, partners and tools. This is where a developer is most visible, because a good Assist makes the project easy to join and hard to break.

Questions to answer:

- Who or what plugs into us today? Who should plug in next (partners, other teams, customers' systems, AI agents)?
- Through which interface (an API, a file, a form, an email address)? Is it written down? Is it versioned, so that changes do not break users?
- What do we offer (capabilities) and what do we need from others (support)?
- What happens today to make this happen (immediate actions: a test, a release, an integration)?
- How is it protected (who may call it, how are secrets kept)?
- Who owns each interface?

Assist feeds the **Integrations register** (the table of every outside tool and who owns it). See the [Integrations register template](/library/template-integrations-register).

**What good looks like:** every interface has an owner and a written contract; every outside tool is on the register; there is an answer to "what happens when it is down?".

**Typical mistakes:** "we will build an API later" (the interface is the product for partners); undocumented integrations; adding a tool by "just signing up".

### Reach: what will it achieve?

**Reach** is the projected result and the end goal: the outcomes, the new capabilities and the impact on the surroundings (the galaxy), with facts and figures where you can. It answers: *If this works, what changes, for whom, and how will we know?*

Questions to answer:

- What outcome do we expect, for which people? Say it in numbers when possible.
- What new thing will the project be able to do?
- What impact will it have on the surrounding industry or community?
- What is *expected* and what is *measured*? Never mix them.

**What good looks like:** two lists, **Expected** (with a reason) and **Measured** (with a date and a source); a link to the ORBITAL objective and indicators that measure it.

**Typical mistakes:** invented percentages (the source's example uses "a 10% increase"; that is only an example, and in real work it must come from a baseline and a reason); impact claims that no number can check.

### SMART tasks inside a STAR

The source joins STAR with **SMART**, a test for a clear task: **S**pecific, **M**easurable, **A**chievable, **R**elevant, **T**imed. The next lesson uses SMART and STAR together for daily reports. For now, remember: *STAR describes the project, SMART checks each task inside it.*

## 3. Step by step: write a STAR file

1. **Create `frameworks/star.md`** and give it four headings: Space, Track, Assist, Reach.
2. **Start with Space.** Use your galaxy page. Write competitors, alternatives, partners, rules, shared things. Link your sources.
3. **Write Track.** Past (what you know, with links), present (one honest paragraph), future (next three milestones with owner and date range). Link the roadmap.
4. **Write Assist.** List interfaces (in and out), tools, owners and today's actions. Link the integrations register.
5. **Write Reach.** Expected and measured, with a link to ORBITAL indicators.
6. **Check consistency.** Does Reach match the objective? Does Track include the work that Assist needs? Does Space mention the risks that Reach ignores?
7. **Mark evidence.** KNOWN, BELIEVED or GUESS on every claim, as in the galaxy page.
8. **Open a merge request.** Ask for review from someone outside engineering.
9. **Review at every milestone.**

A short template:

```markdown
# STAR: <project name>
Owner: <name>   Last reviewed: <date>   Galaxy: <code and title>

## Space
- Competitors and alternatives: ...
- Partners and suppliers: ...
- Rules and platform terms: ...
- Shared with other projects: ...
- Outside events (super novas): ...

## Track
- Past: ...
- Present (honest): ...
- Next three milestones: (owner, date range, link to roadmap)

## Assist
- Interfaces in / out: (owner, contract link, version)
- Outside tools: (link to integrations register)
- Today's actions: ...

## Reach
- Expected (with reason): ...
- Measured (with date and source): ...
- Linked ORBITAL objective and indicators: ...
```

## 4. Worked example: TrailMug STAR

TrailMug is our fictional reusable-cup service for cafés. This STAR is a teaching example. Names and numbers are invented.

**Space**

- *Galaxy:* NAICS 532289, All Other Consumer Goods Rental. Adjacent: 722515 (cafés, customers) and 326199 (cup makers, suppliers).
- *Competitors and alternatives:* disposable cups; cafés running their own deposit-cup scheme; a larger chain's possible reuse programme ("BigBean Cafés", fictional). The cheapest alternative is *do nothing*.
- *Partners and suppliers:* eight pilot cafés; a cup supplier; a payment provider; a washing partner.
- *Rules:* local food-safety rules for cleaning; platform terms of the payment provider.
- *Shared:* Maya's time. One designer on contract.
- *Super nova:* a city rule on single-use cups (response plan in the galaxy file).

**Track**

- *Past:* ten interview notes (`discovery/interviews/`). One café trial with 20 cups for two weeks. (Invented.)
- *Present:* the sign-up page works. The returns recording is manual. Blocked: the washing partner has not confirmed a price.
- *Next:* (1) "Customers can join, get a cup and return it at any partner café" (Maya, six weeks); (2) cafés see their returns on a simple page (Maya with an agent, four weeks); (3) a payment deposit (Maya, after the washing price is known).
- *Link:* `planning/roadmap.md`.

**Assist**

| Interface | Direction | Contract | Owner |
|---|---|---|---|
| Returns API (`POST /returns`) | A café tablet page calls it | `docs/api/returns.yaml`, v1 | Maya |
| Payment provider | We call it, it sends signed messages back | Provider docs, our adapter | Maya |
| Customer list (CRM) | The returns service writes to it | `docs/integrations/crm.md` | Maya |
| An AI agent | Opens merge requests for small tasks | `AGENTS.md` in the repo and the droid cards | Maya |

*Today's actions:* add a test that rejects a return with a missing café id; add the payment provider to the integrations register with its owner.

**Reach**

- *Expected:* the pilot cafés record most cups coming back. (Target to be set in ORBITAL Indicators; guess until the baseline exists.)
- *Measured:* nothing yet. First measurement after four weeks of pilot, from the returns table.
- *New capability:* any partner café can take a cup back, wherever the customer got it.
- *Impact:* fewer disposable cups used in the partner cafés. Measured by count of cups per week, compared with the baseline before the pilot.

Read it as a stranger would. In one page you know where TrailMug sits, where it is going, how others connect and what it will change. And every row can be checked.

## 5. Working with AI agents on this

| | For STAR |
|---|---|
| **What the PDM decides** | The competitors that matter. The next three milestones. Which interfaces exist and who owns them. What Reach is expected, and the targets. |
| **What agents do** | Draft the Space section from public sources you name. Turn your roadmap into the short Track summary. Draft the interface table from the code and the API spec. Check that every interface in the code appears in the STAR (and the other way round). |
| **How the PDM verifies** | Compare the interface table with the real API spec and the real integrations. Open every link. Check that Track dates match the roadmap. |
| **Who else is involved** | Product (Track), marketing and strategy (Space), finance and operations (Reach), the partners (Assist). |

Agents are strong at *consistency checking*, a job people do badly and skip. For example:

```text
Context: frameworks/star.md, docs/api/returns.yaml, the folder src/.
Task: compare the Assist section with the API spec and the code.
List (1) interfaces in the code that are not in Assist, (2) interfaces in
Assist that do not exist in the code, (3) interfaces without an owner.
Do not edit any file. Output a markdown table.
```

The Track part is a summary of the roadmap, and *the roadmap is written by people*. An agent may *summarise* your written roadmap into the Track paragraph. It must never choose the milestones. Disclose any AI help in the file header.

## 6. Common mistakes and how to avoid them

- **Using STAR for the whole company.** One STAR per project. A company with many projects has many STARs, and UBF to connect them.
- **Describing features instead of the surroundings.** Space is about the world around, not your feature list.
- **Track with no past.** Add what you learned and what failed.
- **Assist as an afterthought.** Decide the interfaces early; they are hard to change later.
- **Reach without numbers or without honesty.** Separate expected from measured.
- **Letting the file rot.** Put a review date at the top and check it at each milestone.

## 7. Practice

**Goal:** write a STAR for a made-up project using only this page.

1. Invent a small project, or use TrailMug's second product idea (for example, "a café dashboard of returns").
2. Create `frameworks/star.md` from the template.
3. Fill all four parts. Name at least three alternatives in Space (one is "do nothing"). Give each of the next three milestones an owner and a date range. List at least two interfaces in Assist with owners. Write Expected and Measured separately in Reach.
4. Mark KNOWN, BELIEVED or GUESS on every claim.
5. If you use an agent, give it the consistency-check brief and record its findings.
6. Open a merge request. Ask someone from another discipline: "What would you ask next?" Write their question at the bottom as an open item.

**Deliverable:** `frameworks/star.md` merged, with all four parts, evidence marks and one open question from a reviewer.

## 8. Checklist

- [ ] Space names competitors, alternatives, partners and rules, with links.
- [ ] Track has a past, an honest present and three future milestones with owners.
- [ ] Assist lists each interface with an owner and a contract.
- [ ] Reach separates expected from measured.
- [ ] Every claim is marked KNOWN, BELIEVED or GUESS.
- [ ] The roadmap is linked, and it is written by a person.
- [ ] A reviewer from another discipline read it.
