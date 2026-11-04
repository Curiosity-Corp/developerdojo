---
title: "Capstone: one product through every framework (overview and DREAM discovery)"
description: "The capstone follows the fictional TrailMug from a first idea to a growing product, showing at each step the artefact, the roles, what the Product Development Manager does and what agents do. This first lesson gives the map and runs the DREAM discovery."
section: "Frameworks"
order: 30
track: "frameworks"
level: "advanced"
duration: "70 min"
outcomes:
  - "Describe the eleven capstone steps, the artefact each one produces and who is involved"
  - "Run a DREAM discovery (Discover, Relate, Empower, Advise, Motivate) and turn it into a written, evidenced brief"
  - "Explain how a mixed group of developers and non-developers can work through the capstone together"
resources:
  - "yc/startup-library"
  - "sba/plan-your-business"
  - "mit-ocw/new-enterprises"
  - "atlassian/raci-chart"
  - "anthropic/building-effective-agents"
prerequisites:
  - "week-1-see-the-whole-product"
updated: 2026-11-03
---

**Dojo programme link:** the capstone covers the whole Developer path in one story. This lesson matches Developer week 1 ([See the whole product](/library/week-1-see-the-whole-product)). Later lessons match weeks 2 to 6 and the Master Developer modules. Every week page and track overview links back here.

## 1. Why this matters

The individual lessons in the [Frameworks track](/library/tracks/frameworks/) each teach one tool: UBF to see the landscape, STAR to run daily work, ORBITAL to plan, ANDROID Ops to build, Launch Sequence to ship, Mission Control to watch, GROWTH to fund the next step. Each is useful alone. The skill that makes you a **2030 Product Development Manager (PDM)** is joining them, so that one person, with a small group of people and a set of AI agents, can take an idea to a running and growing product.

The capstone is that joining, told as one story. It uses TrailMug, the fictional reusable-cup service for cafés that appears across the Dojo. At every step it shows:

1. **The artefact:** the file that exists in git when the step is done. If the file is not there, the step did not happen.
2. **The roles:** who is involved. The cast is the founder, product, design, marketing, finance, operations, the PDM (the developer role in its 2030 form) and AI agents.
3. **The PDM's job:** the decisions that cannot be handed away.
4. **The agent's job:** the routine work an agent can do under direction, with a brief you can reuse.
5. **A review checklist:** how you check the step before moving on.

All numbers, names and events in the capstone are **fictional**. They stand in for your own.

## 2. Key ideas, explained

### 2.1 The eleven steps

| # | Step | Framework | Lesson | Main artefact in git |
|---|---|---|---|---|
| 1 | Discovery | DREAM Playbook | this lesson | `docs/dream.md`, `product-brief.md` |
| 2 | See the landscape | UBF (the galaxy view) | [31](/library/tracks/frameworks/31-capstone-ubf-star-orbital/) | `docs/ubf-map.md` |
| 3 | Run daily work | STAR and SHIFT | [31](/library/tracks/frameworks/31-capstone-ubf-star-orbital/) | `star/` notes |
| 4 | Plan the whole product | ORBITAL | [31](/library/tracks/frameworks/31-capstone-ubf-star-orbital/) | `docs/orbital.md` |
| 5 | List what exists and what will | Product catalogue | [32](/library/tracks/frameworks/32-capstone-catalogue-personas-and-roadmap/) | `catalogue/*.yaml` |
| 6 | Know the people | Personas and journeys | [32](/library/tracks/frameworks/32-capstone-catalogue-personas-and-roadmap/) | `docs/personas.md`, `docs/journeys.md` |
| 7 | Decide what to build | Epic roadmap | [32](/library/tracks/frameworks/32-capstone-catalogue-personas-and-roadmap/) | `roadmap/epics.md` |
| 8 | Build | ANDROID Ops on PHANTOMS | [33](/library/tracks/frameworks/33-capstone-android-ops-build-on-phantoms/) | code, tests, merge requests |
| 9 | Ship | Launch Sequence | [34](/library/tracks/frameworks/34-capstone-launch-sequence-and-mission-control/) | `launch/`, `release/` |
| 10 | Watch and steer | Mission Control | [34](/library/tracks/frameworks/34-capstone-launch-sequence-and-mission-control/) | `mission-control/` |
| 11 | Fund and grow | GROWTH and Event Horizon | [35](/library/tracks/frameworks/35-capstone-growth-and-the-whole-product/) | `growth/`, `docs/review.md` |

The steps are in this order for teaching. In real work they overlap and loop. Research continues during the build, and what you learn in Mission Control changes the roadmap.

### 2.2 The cast

| Role | In one line | Where they matter most |
|---|---|---|
| **Founder** | Owns the purpose, the money at risk and the final choices | Steps 1, 4, 7, 11 |
| **Product** | Owns the customer problem, the roadmap and the priorities | Steps 1, 5 to 7, 10 |
| **Design** | Owns how it looks, feels and works for people | Steps 6, 7, 8 |
| **Marketing** | Owns how people hear about it and what the brand promises | Steps 1, 2, 9, 11 |
| **Finance** | Owns the budget, pricing, cost and funding | Steps 4, 7, 9, 10, 11 |
| **Operations** | Owns how the work and the service run day to day | Steps 4, 9, 10 |
| **PDM (developer role)** | Connects all of them, writes the specification, directs agents, verifies, ships | Every step |
| **AI agents** | Do routine drafting, building, checking and watching under direction | Every step, never as decider |

In a small team one person plays several of these roles. In TrailMug, Maya is the founder and also the PDM. Leo, a café owner, is a customer and a partner. The roles still exist, so the capstone names who is doing what.

### 2.3 Rules that hold in every step

These are the Dojo's rules ([The Way](/library/the-way-five-rules)) applied to the capstone:

- **People write the epics and the roadmap.** An AI never does.
- **Git is the source of truth.** Every artefact is a file you can review.
- **Open source first.** Prefer open tools unless there is a reason.
- **Fix forward.** Repair with a new change, and keep the record.
- **Disclose AI use.** Every agent-drafted file says so.

### 2.4 How agents are used throughout

The agent pattern is the same in all eleven steps:

1. **Brief.** You write the task, the sources it may use, the output format and the limits.
2. **Branch.** The agent works on its own branch and changes only what the brief allows.
3. **Draft.** The agent returns a draft with its sources and its doubts marked.
4. **Review.** You (or a named colleague) check against evidence. You reject or edit.
5. **Record.** The merge request records what was asked, what was checked and what was removed.

Think of it as working with a fast, tireless junior who never gets tired and sometimes invents things confidently. [Anthropic's essay on building effective agents](https://www.anthropic.com/engineering/building-effective-agents) is a good, neutral read on when to give agents more freedom and when to keep tasks simple.

### 2.5 For a mixed group: a developer and a non-developer

The capstone is designed so that two people with different skills can work through it together.

- **The non-developer** leads steps 1, 2, 5 (partly), 6, 7 (customer and business content), 9 (GTM pack) and 11 (funding).
- **The developer** leads steps 8, 9 (pipeline), 10 (dashboards) and supports all with git.
- **Both** review each other's files. The role lens pages, starting with [One shared language](/library/tracks/frameworks/40-role-lens-one-shared-language/), show how each role reads the same frameworks in its own words.

Use a simple shared agreement ([RACI](https://www.atlassian.com/work-management/project-management/raci-chart)): for each step, one person is **R**esponsible for doing, one **A**ccountable for the result, others **C**onsulted or **I**nformed. Write it at the top of each artefact.

## 3. Step 1: DREAM discovery

### 3.1 What DREAM is

The SuperNova text starts every venture with the **DREAM Playbook**, a discovery process. The aim is to understand the landscape you will work in, and to line up your hopes with market reality, your own abilities and the resources you can reach. Its five steps spell DREAM:

| Letter | Step | In plain words | What you produce |
|---|---|---|---|
| **D** | Discover | Explore the idea from many sides. Research, try small experiments, imagine yourself as a user and as an observer. Ask: does this excite me, and does it fit my long-term goals? | Notes, sources, a list of small experiments |
| **R** | Relate | Give the idea a name and a place where people can talk about it. Talk about it often. Find others who care. | A working name, a channel, a list of first conversations |
| **E** | Empower | Gather the tools, learning and communities you need. Invest in learning what you lack. | A skills and tools list, a learning plan |
| **A** | Advise | Ask outsiders and experts. Combine their views with data and what many people say. | Two or three advisor conversations and what you changed |
| **M** | Motivate | Bring others into the idea so it grows through them. Tell people what you are doing. | A first small audience and a clear one-paragraph message |

(The original text adds advice on social events and dressing the part, and says that frequent contact makes success "inevitable". We leave those out. No method makes success inevitable, and the Dojo will not claim it.)

### 3.2 How to run it

1. **Discover (two to five days).**
   - Write the problem in two sentences.
   - Find eight real sources. Open each one.
   - Do two experiments that cost less than a day each: for example a one-page sign-up test, or five short customer interviews.
   - Write what surprised you.
2. **Relate.**
   - Pick a working name and a one-sentence description.
   - Make one place where discussion happens (a repository with issues is enough).
   - Have five conversations with people from the audience. Take notes, with permission.
3. **Empower.**
   - List the skills the idea needs and which you lack.
   - Choose free learning (see the resources of each track).
   - List the tools you will use and why (open source first).
4. **Advise.**
   - Talk to two people who know the field. Ask what would make the idea fail.
   - Check your data against what they say.
   - Write down what you changed because of it.
5. **Motivate.**
   - Write the one-paragraph message.
   - Share it with the five people you spoke to, and ask them to share it if they like it.
   - Count honest signals (replies, sign-ups), not likes.
6. **Write `docs/dream.md`** (the artefact) and turn it into the [product brief](/library/template-product-brief).
7. **Decide.** Go, change or stop. A "stop" is a good result if the evidence says so.

### 3.3 Roles in discovery

| Role | Part in DREAM |
|---|---|
| Founder | Owns the dream and the decision to go or stop |
| Product | Frames the problem, runs interviews, writes the brief |
| Design | Observes people, sketches the first ideas |
| Marketing | Tests the message and the name |
| Finance | Estimates what the idea would cost and what it could earn, roughly |
| Operations | Notes what must happen in the real world for the idea to work |
| PDM | Runs the discovery log in git, builds small experiments (a test page), directs agents |
| Agents | Desk research, summaries, interview notes, test page code |

## 4. Worked example: TrailMug

**Discover.** Maya, a founder who has noticed how many disposable cups are thrown away in her neighbourhood, writes the problem in two sentences: "Cafés give out disposable cups all day. Customers would use a reusable cup, but returning and cleaning is awkward." She finds eight sources (an agent drafts the list, she opens each and removes two that do not say what the agent claimed). She runs two experiments: a one-page sign-up page with a plain description, and five conversations at a café counter. Surprise: customers care less about price and more about not having to carry a dirty cup.

**Relate.** Working name TrailMug. Channel: a public repository named `trailmug-planning` with issues. Five conversations: two customers, a barista, Leo (café owner) and a friend who runs a small food business.

**Empower.** She lacks skills in pricing and in operations. She picks free learning on each and adds a learning plan to the repository. Tools: git, a spreadsheet, an agent for drafts.

**Advise.** She speaks to a café supplier and to someone who ran a deposit scheme. They tell her returns at the counter are the make-or-break step, and that cleaning rules vary by area. She changes her plan: the first version will concentrate on the return step, not on cups sales.

**Motivate.** Her one-paragraph message: "TrailMug lets you borrow a reusable cup from a café and return it at any partner café. We are looking for three cafés for a first small trial." She shares it. Two cafés reply. She counts two, not "likes".

**Artefact.** `docs/dream.md` with five headings (D, R, E, A, M), evidence links and a **Decision** at the end: "Go, for a small trial focused on returns." The product brief is written from it.

## 5. Working with AI agents on this

**What the PDM decides.** What to explore, which sources count, what the evidence says, whether to go or stop. An agent will happily make any idea sound promising. Only you can say "this does not hold up".

**What agents can do.**

- Find and summarise sources, with links.
- Draft interview guides and tidy interview notes.
- Build the small test page or form for an experiment.
- Prepare a first competitor table.
- Turn your notes into the product brief draft.

**A brief you can adapt:**

```text
Problem statement (mine): "Cafés give out disposable cups all day..."
Find up to eight public sources that help me judge whether people would
use a reusable-cup loan scheme. For each: URL, date, one exact quote, and
how it supports or weakens the idea. Include at least two sources that
weaken it. If you find nothing for a point, write NO SOURCE. Do not write
statistics that are not in a source.
```

Asking for sources that weaken the idea is deliberate. It counters the agent's tendency to agree with you.

**How to check.** Open every link. Search for the quote. Delete anything you cannot confirm. Keep a list of what the agent got wrong, so you know how much to trust the next draft.

**Disclose.** At the top of `docs/dream.md` write which parts an agent drafted.

**The ladder across the capstone.** The PDM's agent skill has four rungs: **use** one agent, **delegate** a whole task with a brief, **orchestrate** several sessions in a command chain, and **govern** them with written policy, hooks and gates. Steps 1 to 7 stay on the first two rungs, because the work is thinking and writing. Step 8 (the build) moves to orchestration, and steps 9 and 10 rely on governance: the gates decide, not your attention. Each later lesson asks you to name the rung. The [Agent orchestration](/library/tracks/agent-orchestration/) track goes deeper into the command chain (Session, Commander, Chief of Command, Admiral).

## 6. Common mistakes and how to avoid them

- **Falling in love with the idea.** Ask advisors what would make it fail.
- **Counting likes as proof.** Count actions (sign-ups, replies, a trial agreement).
- **Skipping the decision.** Write Go, Change or Stop.
- **Letting an agent write the dream.** The first conversation with a customer must be yours.
- **Collecting real names in a public repository.** Keep interview notes anonymous, and get consent.
- **Treating the order as fixed.** Revisit DREAM when you learn something big.

## 7. Practice

**Deliverable in git:** a new repository (or a folder) `capstone/` with:

1. `docs/dream.md` with the five DREAM headings, evidence links and a Go, Change or Stop decision.
2. `product-brief.md` from the [template](/library/template-product-brief).
3. `docs/raci.md`: a table of the eleven steps with who is R and who is A (for a solo learner, name the role you play).
4. A discovery log: the sources you opened, the experiments you ran, and what you removed from the agent's output.
5. A merge request that says which parts an agent drafted.

Choose your own product idea (real or fictional) and use it for the whole capstone. If you work as a pair, split roles as in section 2.5.

## 8. Review checklist

- [ ] Every claim in `dream.md` has a source I opened or a conversation I had.
- [ ] I included at least two views that weaken the idea.
- [ ] Advisors changed something in my plan, and I wrote what.
- [ ] The decision is written and can be argued from the evidence.
- [ ] The product brief says who the customer is and what success looks like in numbers I chose.
- [ ] AI use is disclosed.
- [ ] No private or personal details are in a public file.

**Next:** [lesson 31](/library/tracks/frameworks/31-capstone-ubf-star-orbital/) places the product in its landscape (UBF), sets the daily rhythm (STAR) and writes the plan (ORBITAL).
