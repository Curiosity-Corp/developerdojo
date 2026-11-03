---
title: "UBF, consulting levels and decisions"
description: "Five altitudes of advice, from the whole industry down to hands-on building, and a simple portfolio method that uses UBF to decide what to start, grow, watch or stop across many projects."
section: "Frameworks"
order: 7
track: "frameworks"
level: "core"
duration: "60 min"
outcomes:
  - "Describe the five consulting levels and say which one a question belongs to"
  - "Sort a list of projects into stars, moons, super stars and comets and justify each place"
  - "Make a start, grow, watch or stop decision with a written reason and a review date"
  - "Write a super-nova response plan: signal, owner and first action"
resources:
  - "adr/architectural-decision-records"
  - "atlassian/prioritization-frameworks"
  - "gov-uk/futures-toolkit"
  - "donella-meadows-project/leverage-points"
  - "mit-ocw/introduction-to-system-dynamics"
  - "youtube-ted/why-the-secret-to-success-is-setting-the-right-goals"
prerequisites:
  - "05-ubf-the-business-galaxy"
  - "06-naics-sic-and-your-galaxy"
updated: 2026-11-03
---

This is lesson 7, the last about UBF. It supports **Developer week 4** (defend the roadmap and stakeholders) and the **Master Developer** work of choosing between several projects and tools.

## 1. Why this matters

Once you own a product you quickly own *more than one thing*: the main product, a side idea, a tool you built for yourself, a partnership, an old experiment. Time and money are limited. Every week you silently decide which of these gets attention. A Product Development Manager (PDM) who decides silently usually decides badly: the loudest request wins.

UBF gives you a calm, written way to decide. It tells you what kind of object each project is (star, moon, super star, comet), how it relates to the industry around it, and what kind of advice you need. In this lesson you learn two things: the **five consulting levels**, which describe the altitude at which a question is asked, and a **portfolio review**, which uses UBF to make start, grow, watch and stop decisions across many projects.

## 2. Key ideas, explained

### The five consulting levels

The source material lists five levels of consulting. The names are space-flavoured, but the idea is practical: *advice comes at different altitudes, and a good adviser knows which altitude a question is at.* Here they are in plain words, from highest to lowest.

| Level | Plain meaning | Typical questions | What the developer does |
|---|---|---|---|
| **1. DreamVerse** | The widest view: what future do we want, and what could the world look like? It covers dreams, the past, present and future, and maps of the whole universe of options. It also includes a habit of thinking in long time spans. | "What do we want to be true in ten years?" | Reads the dream and asks what it means for the next quarter. Keeps the dream written in one place. |
| **2. Galaxy consulting** | Advice about a whole industry: its structure, the large companies, mergers and acquisitions, investment. | "Which industry should we enter? Is it consolidating?" | Supplies facts and technology risk. Reads the UBF galaxy page. |
| **3. World consulting** | Advice about one organisation or group: how its parts connect, how a new project is planned (ORBITAL), business advice, buying. | "How should this company organise its new products? How do we buy this system?" | Writes the ORBITAL, the catalogue and the decision records. |
| **4. ANDROID consulting** | Advice about building products and technology: technology firms, product development. | "How do we build it, with which stack, in what order?" | Does most of the work here. Leads with the operating model and PHANTOMS-style choices. |
| **5. Ignite Curiosity** | Teaching and literacy: helping people learn the ideas, so they can run these frameworks themselves. | "How do we teach the team to plan and work this way?" | Writes guides, runs sessions, reviews learners' work. |

The levels nest. A level 1 dream shapes level 2 choices, which shape level 3 plans, which shape level 4 builds. And level 5 spreads the habits across the whole organisation.

*The source lists some further learning topics under these levels. We include only those we can explain plainly and back with evidence. Developer Dojo itself works mainly at levels 4 and 5, and Master Developers move up to levels 3 and 2.*

**The practical lesson:** most project arguments are people talking at different levels. A founder says "we need to be in the cloud" (level 2 or 3 talk), a developer answers with a database name (level 4). Neither is wrong; they are not talking about the same thing. Ask: *at which level are we?* Then answer at that level.

### A portfolio

A **portfolio** is the full list of things you own or are responsible for. UBF gives each item a type.

| Type | In a portfolio |
|---|---|
| **Super star** | A flagship with high potential, needing real resources. Few at a time. |
| **Star** | A healthy small project. Needs steady care. |
| **Moon** | A supporting project, a side project or a department. Needs a clear link to a star. |
| **Comet / asteroid** | Unstable or unclear. Needs a decision now. |
| **Black hole (dependency)** | A giant you depend on. Needs a watch and an exit plan. |

### Four decisions

For every item you can make one of four decisions. Write the decision and a reason.

1. **Start.** Begin, with an objective and a review date.
2. **Grow.** Give more resources, because evidence shows it is working.
3. **Watch.** Keep as is. Set a signal that would change your mind.
4. **Stop.** End it cleanly, and write what you learned.

A comet that nobody can explain is nearly always a **stop** or a **fix now**. A project that is stopped is not a failure. The failure is a project that quietly sits half-alive and takes attention.

### Decisions need records

A decision that lives in a chat message disappears. Write it down in a **decision record**: a short file with the context, the options, the choice, the reason and when to revisit it. The Dojo has a [decision record template](/library/template-decision-record). This is the same rule as The Way: git is the source of truth.

### Super-nova planning

In lesson 5 you listed super novas. A good plan for each one has three parts:

- a **signal**: the first thing you would see (a published draft law, a notice from a platform, a competitor announcement),
- an **owner**: one named person who watches the signal,
- a **first action**: the first thing you do within a week of the signal.

Do not write a huge plan for events you cannot predict. Write a *small, ready first move*. That is the part that saves days when the event comes.

## 3. Step by step: run a portfolio review

1. **List everything** you own or depend on: products, side projects, partnerships, tools, experiments. Use one line each.
2. **Give each item a UBF type** (super star, star, moon, comet, dependency).
3. **Score each item on three questions** from 1 (low) to 5 (high): *Impact* (how much does it matter if it works?), *Confidence* (how sure are you, on evidence?) and *Effort* (how much time and money does the next step take?). This is a simplified form of a well-known method called RICE (Reach, Impact, Confidence, Effort). Do not trust the numbers as exact. Use them to start a conversation.
4. **Check the evidence** behind every Confidence score. If it is a feeling, score it low.
5. **Decide**: start, grow, watch or stop. Write one reason in a single sentence.
6. **Name an owner and a review date** for each item. No owner means comet.
7. **Add a super-nova line** for the top two risks: signal, owner, first action.
8. **Write the decision record** and open a merge request, so others can challenge it.
9. **Review again** at the end of every milestone, or every quarter.

## 4. Worked example: Maya's portfolio

TrailMug is the fictional reusable-cup service. After the pilot starts, Maya has five things asking for attention.

| Item | UBF type | Impact | Confidence | Effort | Decision | Reason |
|---|---|---|---|---|---|---|
| TrailMug core: members, cups, returns | Super star (for her) | 5 | 3 | 4 | **Grow** | It is the reason the company exists, and early café feedback is positive (ten interview notes). |
| Eight-café partnership | Moon of the core product | 4 | 4 | 2 | **Grow** | Cheap, fast, and the cafés asked for it. |
| Cup-washing as a service for other cafés | Possible moon | 3 | 1 | 5 | **Watch** | No evidence yet. Revisit after 3 months of return data. |
| Café tablet app | Comet | 2 | 1 | 4 | **Stop** | Nobody owns it. A simple web page does the job. |
| Dependence on one payment provider | Black hole (dependency) | 4 | 3 | 2 | **Watch, with an exit plan** | Keep the provider behind an adapter. Alert if fees change. |

**Super-nova line:** If the city announces a ban on single-use cups, the signal is a draft notice on the city website, the owner is Maya, and the first action is to open the waiting list and email the eight cafés within a week.

Notice that Maya did not make the decisions by asking "which one do I like?" She wrote them, with reasons, and she can change them with evidence. A finance colleague can read the table. A designer can see why the tablet app was stopped. An agent can later be briefed with the decisions without guessing.

**A useful tool for systems thinking** is to ask where a small push moves the whole system. Donella Meadows, a respected systems scientist, wrote a famous essay about "leverage points". We link it in the further-learning list. In Maya's case, the leverage point is the *returns rate*: if cups come back, everything else works. So she puts her best effort there.

## 5. Working with AI agents on this

| | For portfolio decisions |
|---|---|
| **What the PDM decides** | The type of each item. The scores. The decision. The owner. The review date. |
| **What agents do** | Summarise status from issues and merge requests. Draft the table from your notes. Draft three alternative scenarios for a super nova. Argue against your decision. |
| **How the PDM verifies** | Check every status line against the real issue. Recompute scores. Ask: "what evidence would change this decision?" |
| **Who else is involved** | Founder (strategy), finance (money), the owners of each item. |

Agents are very good at *summarising a messy backlog* and *playing devil's advocate*. They are not able to know what matters to your customers. Keep the scoring human.

```text
Context: frameworks/portfolio.md lists my projects and my decisions.
Task: act as a sceptical investor. For each row marked GROW, give the
strongest reason the decision might be wrong, using only the evidence
in the table plus clearly marked general knowledge. For each row
marked STOP, give the strongest reason to keep it. Do not change the
table. Do not give new scores.
```

Then you answer each objection in writing, in the decision record. If you cannot answer an objection, that row needs more evidence.

Remember: *people write epics and roadmaps; AI never does.* A portfolio decision such as "Grow" is the start of a roadmap. You write the epics that follow. An agent may later turn your milestones into issues.

## 6. Common mistakes and how to avoid them

- **Deciding by volume.** The loudest stakeholder is not the most important. Use the table.
- **Never stopping anything.** A portfolio with no "stop" is a portfolio with hidden comets.
- **Scores as truth.** Scores start a discussion. They are not facts.
- **Confidence from hope.** Score confidence on evidence you could show to a stranger.
- **Skipping the super-nova line.** A plan with no response to the top risks is a plan for good weather.
- **Mixing levels.** Do not argue about the stack when the question is which industry to enter.
- **No review date.** A decision with no review date will never be reviewed.

## 7. Practice

**Goal:** write a portfolio review with real decisions.

1. Create `frameworks/portfolio.md`.
2. List at least five items you own or depend on. Use TrailMug's list if you do not have your own.
3. For each: UBF type, Impact, Confidence, Effort (1 to 5), decision (start, grow, watch, stop), a one-sentence reason, an owner and a review date.
4. Add a **Levels** column: at which consulting level (1 to 5) is each item's main question?
5. Write two super-nova lines (signal, owner, first action).
6. Run the sceptical-investor brief with an agent. Add its objections and your written answers to the file. Add `AI use:` to the header.
7. Commit a decision record for the biggest decision, using the [template](/library/template-decision-record).
8. Open a merge request and ask a person from finance or operations to challenge one decision.

**Deliverable:** `frameworks/portfolio.md` and one decision record, merged, with every item having a decision, an owner and a review date.

## 8. Checklist

- [ ] I can describe the five consulting levels and tell which one a question is at.
- [ ] Every item in my portfolio has a UBF type.
- [ ] Every Confidence score has evidence behind it.
- [ ] Every item has a decision, an owner and a review date.
- [ ] At least one item is marked stop, or I explained why none should be.
- [ ] I wrote two super-nova lines with a signal, an owner and a first action.
- [ ] I answered the agent's objections in writing.
