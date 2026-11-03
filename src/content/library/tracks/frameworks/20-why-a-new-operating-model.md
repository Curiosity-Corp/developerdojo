---
title: "Why a new operating model"
description: "Waterfall, Agile, DevOps and MLOps each solved one problem. ANDROID Ops joins them into one loop that a Product Development Manager can run with people and AI agents."
section: "Frameworks"
order: 20
track: "frameworks"
level: "core"
duration: "50 min"
outcomes:
  - "Explain in plain words what waterfall, Agile, DevOps and MLOps each fix, and what each leaves open"
  - "Name the seven ANDROID Ops focus areas and say what job each one does"
  - "Place any piece of work you own on the seven focus areas and see which area is missing"
resources:
  - "atlassian/what-is-agile"
  - "atlassian/what-is-devops"
  - "microsoft/what-is-devops"
  - "aws/what-is-mlops"
  - "agile-manifesto/agile-manifesto"
  - "dora/dora-research-program"
prerequisites:
  - "developer-path-overview"
updated: 2026-11-03
---

**Dojo programme link:** this lesson supports Developer weeks 1 and 3 (see the whole product, turn problems into epics) and opens the Master Developer modules on platform and launch. It is the first of five lessons on ANDROID Ops. Back to the [Frameworks track](/library/tracks/frameworks/).

## 1. Why this matters

In these lessons we talk about the **2030 Product Development Manager**, or **PDM**. A PDM is the person who owns a product from the first idea to the last customer. A PDM is not mainly a person who types code. A PDM decides what to build and why, writes the specification, sets the acceptance tests, directs several AI agents and people at once, checks what comes back, and answers for the result. In the Dojo, a Developer grows into this role.

A PDM needs a way of working that covers the whole job. Not only the coding part. Not only the planning part. The customer research, the design, the build, the release, the running of the product and the learning afterwards all belong to one person's attention, even when many hands do the work.

An **operating model** is the answer to a simple question: "How do we turn an idea into something customers use, and keep it working?" It names the steps, who does them, how work moves from one step to the next, and how we know it is good. Every team has an operating model. Many have never written it down.

Older operating models were built for a world where people did every step by hand and each step belonged to a different department. Today an AI agent can draft code, tests, documents and research in minutes. That changes the bottleneck. The slow parts become deciding, specifying, reviewing and releasing safely. A good operating model puts your attention there.

**ANDROID Ops** is the operating model of the Dojo. This lesson shows what it replaces, what it keeps, and why. The next lessons go deep on each part.

## 2. Key ideas, explained

### 2.1 The old software development life cycle (SDLC)

The **software development life cycle** is the oldest model. It says: gather requirements, design, build, test, release, maintain, in that order. When the steps are strictly one after another and each is "finished" before the next begins, people call it **waterfall**, because work flows down and does not go back.

What it fixed: chaos. Before it, teams started coding with no plan. A written sequence made big projects possible to manage and pay for.

What it leaves open:

- Customers see nothing until the end. If the first idea was wrong, you learn it after the money is spent.
- Changes are expensive, because each step is "done".
- Operations (running the product) is somebody else's problem.

### 2.2 Agile

**Agile** is a family of ways of working that start from the [Agile Manifesto](https://agilemanifesto.org/): work in small steps, show working results often, talk to the customer, and respond to change. Scrum and Kanban are two popular forms. See [What is Agile?](https://www.atlassian.com/agile) for a neutral introduction.

What it fixed: the long wait for feedback. Teams ship something small, learn, and adjust.

What it leaves open: Agile is mostly about how a team plans and builds. It says little about how code reaches production safely, or how the product is watched once customers use it. Teams could be agile in planning and still release by hand once a quarter.

### 2.3 DevOps

**DevOps** joins **dev**elopment and **op**erations. The idea is that the people who build a product also help run it, and that the path from a code change to production is automated and repeatable. Common habits are continuous integration (merge small changes often and test each one automatically), continuous delivery (always keep the product ready to release), infrastructure as code, and monitoring with a feedback loop. Read [What is DevOps?](https://www.atlassian.com/devops) and Microsoft's [What is DevOps?](https://learn.microsoft.com/en-us/devops/what-is-devops) and note what they agree on.

What it fixed: the wall between "we built it" and "someone else runs it". It also gave the industry measurable delivery habits. The research programme [DORA](https://dora.dev/) studies how often teams ship, how long a change takes, and how well they recover.

What it leaves open: DevOps does not tell you what to build. It starts when the plan exists. It also has little to say about brand, money, partners or people outside engineering.

### 2.4 MLOps

**MLOps** applies the same ideas to **machine learning**: software that learns from data. A model is not like normal code. It changes when the data changes, it can get worse silently, and it must be tested with data, not only with unit tests. MLOps adds data versioning, repeatable training, a registry of models, and monitoring of model quality in production. See AWS's [What is MLOps?](https://aws.amazon.com/what-is/mlops/).

Why a PDM cares even if you never train a model: your product will use AI. A feature that calls a language model behaves like a model feature. It can drift, it can be wrong in new ways after a provider update, and you need checks for it. The AI agents you direct are also "models in production". You must evaluate them like any other part.

What it leaves open: MLOps focuses on the model. It does not cover the rest of the product.

### 2.5 What ANDROID Ops joins

ANDROID Ops takes one idea from each and adds a wider frame.

| From | What ANDROID Ops keeps | What it adds |
|---|---|---|
| SDLC | Written steps, plans and records | Steps are focus areas, not a strict line |
| Agile | Small steps, feedback, change is welcome | A place for roadmap thinking and research before the sprint |
| DevOps | Automated, repeatable delivery and operations | Brand, design, partners and money count as part of "operations" |
| MLOps | Test data and models, watch quality after release | AI agents and AI features are first-class parts of the product |

The source text for the framework says it joins "the best practices from traditional SDLC, Agile, DevOps, and MLOps" for software, systems, brands and other operating domains. That is a design goal, not a measured result. You will not find a study proving ANDROID Ops beats the others, and we do not claim one. We ask you to use it because it covers the whole PDM job on one page, and to judge it by what happens in your own product.

### 2.6 The seven focus areas

ANDROID is a word whose letters are the seven focus areas:

| Letter | Focus area | The job in one line |
|---|---|---|
| A | **Advance** | Look ahead: update the roadmap, test new ideas, watch trends |
| N | **Network** | Connect people and information: communication, documents, maps of what depends on what |
| D | **Design** | Shape the experience, the process and the brand |
| R | **Research** | Find out what is true: customers, market, data, competitors |
| O | **Optimize** | Measure and improve what already exists |
| I | **Implement** | Build, test and integrate the work |
| D | **Deliver** | Release, support and collect feedback |

**Where to learn each area.** Every focus area has skill tracks in the Dojo library. Use this map to plan your study.

| Focus area | Skill tracks | Deep-dive lesson |
|---|---|---|
| Advance | [Roadmapping and epics](/library/tracks/roadmapping-and-epics/), [Working with AI agents](/library/tracks/working-with-ai-agents/) | [Lesson 21](/library/tracks/frameworks/21-android-focus-areas-advance-network-design-research/) |
| Network | [Stakeholder communication](/library/tracks/stakeholder-communication/), [Git and GitLab](/library/tracks/git-and-gitlab/), [Cloud platforms](/library/tracks/cloud-platforms/) | [Lesson 21](/library/tracks/frameworks/21-android-focus-areas-advance-network-design-research/) |
| Design | [Brand, website and mock-ups](/library/tracks/brand-website-and-mockups/), [Personas and journeys](/library/tracks/personas-and-journeys/) | [Lesson 21](/library/tracks/frameworks/21-android-focus-areas-advance-network-design-research/) |
| Research | [Product discovery](/library/tracks/product-discovery/), [Personas and journeys](/library/tracks/personas-and-journeys/) | [Lesson 21](/library/tracks/frameworks/21-android-focus-areas-advance-network-design-research/) |
| Optimize | Observability and service management, [Agile delivery](/library/tracks/agile-delivery/) | [Lesson 22](/library/tracks/frameworks/22-android-focus-areas-optimize-implement-deliver/) |
| Implement | [CI/CD](/library/tracks/ci-cd/), Security fundamentals, Infrastructure as code, [PHANTOMS stack](/library/tracks/phantoms-stack/) | [Lesson 22](/library/tracks/frameworks/22-android-focus-areas-optimize-implement-deliver/) |
| Deliver | [CI/CD](/library/tracks/ci-cd/), Kubernetes and GitOps, Observability and service management | [Lesson 22](/library/tracks/frameworks/22-android-focus-areas-optimize-implement-deliver/) |

One note on names. One older version of the source text spells the sixth word "Integrate". The longer framework text and the Dojo use **Implement**, and so do we. In the last lesson of this series you will see that some of the same words appear in the lighter DROID Ops loop.

Two ideas make this different from a phase list.

**Focus areas, not stages.** In waterfall you are in exactly one stage. In ANDROID Ops several areas are active every week. While one agent implements an epic, you research the next one and design a screen for it. The source text describes a **Focus Shift**: a protected block of four hours where a person works on one or more of the areas to move a product forward. Think of it as a calendar habit. "Tuesday morning is my Research shift."

**The loop never ends.** Deliver feeds Research. What customers say after release is the best research you will ever get. The arrow from Deliver back to Advance and Research is the most important arrow in the model.

## 3. Step by step: find your place in the model

Use this method whenever you start a new product or inherit one.

1. **Write the product in one sentence.** Who is it for and what does it do?
2. **List the seven areas as headings** in a file in your repository.
3. **Under each heading, write what already exists.** One or two lines, with a link: the roadmap, the research notes, the mock-ups, the metrics dashboard, the repository, the release notes.
4. **Mark each area as strong, thin or missing.** Be honest. Missing is useful information.
5. **Pick the thinnest area that blocks the next customer-visible result.** That is where your next Focus Shift goes.
6. **Add one issue per gap** in your tracker, labelled with the area. [Lesson 24](/library/tracks/frameworks/24-running-android-ops-in-gitlab/) shows exactly how.

## 4. Worked example: TrailMug

TrailMug is the fictional reusable-cup service for cafés used across the Dojo. Maya is the founder. She wants to add "scan a cup when you return it" at the café counter.

How each model would treat it:

- **Waterfall:** write a long requirements document for the scanner, design everything, build for four months, release. If cafés dislike the scan flow, she learns it at the end.
- **Agile:** build a thin scan page in a two-week sprint, show it to Leo, a café owner, and adjust. Good. But nobody asked who pays for scanner tablets, nobody planned how the release is checked, and nobody watches whether scans fail.
- **DevOps:** the scan page is deployed automatically with tests and a rollback, and an alert fires if scans fail. Good. But it may be the wrong feature.
- **MLOps:** later TrailMug adds a photo check that recognises the cup type. Now it also needs test images, a quality score and a plan for when accuracy falls.

ANDROID Ops view of the same feature, as a PDM would write it down:

| Area | What Maya (the PDM) does for the scan feature |
|---|---|
| Advance | Puts "cup return scan" on the roadmap as one epic with a date. Notes that a rival café app is trying QR codes. |
| Network | Writes who must know: Leo and two other café owners, the payments contact, the support person. Updates the map of systems the scan touches. |
| Design | Sketches the three-step scan screen. Checks it works one-handed on a busy counter. |
| Research | Watches two café staff try a paper prototype. Counts how many seconds a return takes today. |
| Optimize | Sets the target: a return takes under ten seconds. Picks the number to watch after release. |
| Implement | Writes the specification and tests. Directs agents to build the page and API, then reviews the changes. |
| Deliver | Releases to one café first. Collects feedback. Decides to widen or fix. |

Notice there is no single "owner" per row in the table. The PDM is accountable for all seven, and people and agents do the work inside each row.

## 5. Working with AI agents on this

**What the PDM decides.** Which model of work to use, which areas are thin, and what the product should do. A model is a decision about how you spend attention. No agent decides that for you.

**What you can delegate.** Reading and summarising neutral sources. Drafting the first table of "what exists" from your repository. Listing open issues by area. Checking whether each area has evidence.

**A brief you can adapt:**

```text
You are helping me review a product repository.
Goal: fill in a table with seven rows (Advance, Network, Design, Research,
Optimize, Implement, Deliver). For each row, list files, issues or
documents in this repository that are evidence for that area, with paths.
If there is no evidence, write MISSING. Do not invent evidence.
Do not suggest new roadmap items. Output only the table.
```

**How to check the output.** Open three links from each row. If a link does not exist or does not show what the row says, the agent made it up. Then mark each row strong, thin or missing yourself. The judgement is yours.

**Disclose AI use.** If an agent helped make the table, say so in the file header, following [Disclose AI use](/library/disclose-ai-use). Remember [The Way](/library/the-way-five-rules): people write the epics and the roadmap. An agent may list what exists. It does not decide what comes next.

**Other disciplines.** Ask an engineer to confirm the Implement row, a designer for Design, and someone who talks to customers for Research. A PDM learns to read each discipline's evidence even without being an expert.

**From delegating to orchestrating.** Handing one task to one agent is delegation. When you run several sessions at once on one product, you are orchestrating, and you need written policy and pipeline gates so that speed does not outrun safety. The Agent orchestration track teaches the command chain (Session, Commander, Chief of Command, Admiral) and how policy is written down.

## 6. Common mistakes and how to avoid them

- **Treating the seven areas as seven phases.** If you wait to "finish Research" before Design, you rebuilt waterfall. Keep several areas active.
- **Skipping Network.** Teams rarely skip building, but often skip telling people. Many launches fail because the café owner, the support person or the finance contact heard late.
- **Letting Optimize mean "later".** Optimize starts with one measure you chose before release. No measure, no Optimize.
- **Believing a new name fixes the old habit.** If your team does not talk to customers today, a framework will not start it. Add one customer conversation to this week.
- **Claiming results the framework has not earned.** Use words such as "we use ANDROID Ops to organise our work". Do not write "ANDROID Ops makes teams faster" unless you have your own numbers.
- **Using agents to fill in the table without checking.** An invented "evidence" row is worse than an honest MISSING.

## 7. Practice

**Deliverable, in your own git repository:** a file `docs/operating-model.md`.

1. Choose one product you own or the fictional TrailMug.
2. Write the one-sentence product description.
3. Make seven headings, one per focus area. Under each, list what exists with links. Rate strong, thin or missing.
4. Add a short section "Where I will spend my next four-hour Focus Shift, and why".
5. Add one sentence at the end saying whether an agent helped.
6. Open an issue for each thin or missing area. Link them from the file.
7. Commit on a branch, open a merge request, and ask a friend or mentor to review the ratings.

## 8. Checklist

- [ ] I can explain waterfall, Agile, DevOps and MLOps in one sentence each.
- [ ] I can name the seven focus areas and what each does.
- [ ] I know that the areas run at the same time and that Deliver feeds Research.
- [ ] My `docs/operating-model.md` has evidence links, not opinions.
- [ ] I rated each area honestly, including MISSING.
- [ ] I opened issues for the gaps.
- [ ] I said whether an agent helped.

**Next:** [lesson 21](/library/tracks/frameworks/21-android-focus-areas-advance-network-design-research/) goes deep on the first four focus areas.
