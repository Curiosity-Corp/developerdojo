---
title: "Directing agents across the frameworks"
description: "How a Product Development Manager hands the routine work at every scale to AI agents, keeps the decisions, and verifies what comes back, using droid cards and a shared context file."
section: "Frameworks"
order: 4
track: "frameworks"
level: "core"
duration: "60 min"
outcomes:
  - "Split the work at each framework scale into what you decide and what an agent drafts"
  - "Write a droid card: a one-page job description for an agent, with limits and a review point"
  - "Write a shared context file so every agent uses your words and your facts"
  - "Check an agent's market, plan or research output against sources, and record what you changed"
resources:
  - "anthropic/building-effective-agents"
  - "openai/practical-guide-to-building-agents"
  - "anthropic/effective-context-engineering"
  - "nist/ai-risk-management-framework"
  - "owasp/top-10-for-llm-applications"
  - "youtube-anthropic/tips-for-building-ai-agents"
prerequisites:
  - "01-the-frameworks-map"
  - "03-frameworks-cheat-sheet"
updated: 2026-11-03
---

This lesson ties the Frameworks track to the AI-agents track. It supports **Developer week 4** (defend the roadmap, stakeholders and AI agents in practice) and the **Master Developer** module on agent orchestration. You will not write code. You will write the *briefs* that make agents useful at every scale of the map.

## 1. Why this matters

In 2030 a Product Development Manager does not write every document, every test or every line of code. Agents do much of the routine work: they search, summarise, draft, compare, scaffold and check. This is only a gain if you stay in charge of three things: **what is worth doing, what is true, and what ships**.

Each framework in this track has a *thinking* part and a *drafting* part. The thinking part (choosing the objective, deciding what you will not build, judging the risk) is yours. The drafting part (collecting facts, formatting tables, writing a first version, checking for gaps) can go to an agent. A PDM who cannot tell the two apart will do one of two bad things: do everything by hand and move slowly, or hand everything over and ship plausible nonsense.

This lesson gives you a method to split the work cleanly and a set of habits to verify it.

## 2. Key ideas, explained

### The four verbs

Every piece of agent-assisted work has four verbs. Learn them in order.

1. **Frame.** You state the problem, the scope, the facts you already have, and what "good" looks like.
2. **Delegate.** You give an agent a defined job with limits.
3. **Verify.** You check the result against sources, against customers and against your own judgment.
4. **Decide.** You choose what goes into git, in your own words.

Agents can help with step 2 and parts of step 3. Steps 1 and 4 are never delegated. A short test: *if this paragraph is wrong, whose name is on the mistake?* It is yours. So you decide.

### Where you are on the ladder

The four verbs describe one task. Your skill across many tasks grows in four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** many sessions in a command chain, and **govern** them with written policy, hooks and gates. Lessons in this track mostly practise *delegate*. When you run several sessions at once, you are orchestrating, and you need a rule or a gate (a protected branch, a required review, a green pipeline) that keeps each session inside its limits. The agent orchestration track covers those two rungs.

### The droid card

Earlier we said a *droid* is one focused unit of work with one purpose. An AI agent doing a defined job is a droid. To keep it focused, write a **droid card**: one page that says exactly what the agent may and may not do.

```text
DROID CARD
Name:            market-scan-cafes
Purpose:         Collect public facts about the café and reusable-cup industry
Framework:       UBF (galaxy, black holes, super novas)
Owner (human):   Maya
Inputs:          frameworks/galaxy.md (my current draft), a list of five sources I trust
Outputs:         research/galaxy-facts.md : a table with claim, source link, date opened
Allowed:         read the inputs, browse public web pages, write only in research/
Not allowed:     change frameworks/galaxy.md, invent numbers, cite a page it has not opened,
                 use any customer personal data
Done when:       every row has a working source link and a confidence mark (HIGH / MEDIUM / LOW)
Review point:    Maya reads every LOW and MEDIUM row and opens at least five links
Disclosure:      added to the header of galaxy.md as "AI use: facts gathered by ..."
```

A droid card is short, and it does three jobs: it makes the agent's task clear, it limits the damage if the agent goes wrong, and it gives the reviewer a checklist. Keep droid cards in git under `droids/`.

### The shared context file

An agent starts every session knowing nothing about your product. If you do not tell it your words, it will invent them. Write one file, for example `frameworks/context.md`, that every agent reads first. It holds:

- one paragraph about the product and who it is for,
- the framework words with your definitions (copy from the [cheat sheet](/library/tracks/frameworks/03-frameworks-cheat-sheet/)),
- the current facts, each with a link,
- the rules: people write epics and roadmaps; mark guesses; cite sources; no personal data,
- what is out of scope.

Keep it short. A tight file works better than a long one, because the agent has limited space to hold everything at once (this limit is called its *context window*, explained in the AI agents track).

### The split, scale by scale

| Scale | You frame and decide | An agent can draft | The check |
|---|---|---|---|
| **UBF** | The galaxy's boundaries. Which events matter. Which risks you accept. | A market map from sources you name. A list of possible super novas with evidence. | Every fact has a link you opened. Names and dates match the source. |
| **STAR** | Where the project sits. Where it goes. What it reaches. | A first draft of the four parts from your notes. A table of integrations. | The draft matches your notes. Each integration exists and has an owner. |
| **ORBITAL** | The objective. The budget limits. The indicators and targets. | Tables, calculations, a list of resources, a first activity list. | Arithmetic recomputed by hand. Targets are yours. |
| **ANDROID Ops** | What is built next and why. Which agent does which job. | Code, tests, docs, issues from your milestones. | You read the diff. Tests pass. Acceptance criteria are met. |
| **PHANTOMS** | Which pieces you start with and why (record it). | Scaffolding, wiring, configuration, boilerplate. | It runs from a fresh clone. You can explain each piece. |
| **Launch Sequence** | Whether you are ready. What evidence you require. | Pipeline configuration, checks, release notes. | Evidence exists and is recent. A human approves the release. |
| **Mission Control** | Which targets matter. Who is called. | Dashboards, alert drafts, incident summaries. | You test the alert. You rehearse the incident. |

Notice the rule that comes from The Way: **people write epics and roadmaps; AI never does.** In the table, "ORBITAL activities" and "ANDROID Ops milestones" are where roadmaps come from. An agent can *organise your* activities into a table. It does not decide which epics exist or in which order. You write that, in your own words.

## 3. Step by step: set up agent work for a framework task

1. **Write the task in one sentence** and name the framework scale.
2. **Choose the human decision** inside it. Write it down: "I decide X."
3. **Write the droid card** for the drafting part.
4. **Update the context file** with any new facts or terms.
5. **Run the agent** on a branch (a separate line of changes), so its work never lands on the main line by accident.
6. **Review in a merge request.** Read it like a colleague's work. Look at the diff, open the links, recompute the numbers.
7. **Write the decision** in your own words as a separate commit, referencing the draft. This makes the change history show *who decided what*.
8. **Record the AI use** in the file header and in the merge request.

## 4. Worked example: TrailMug

Maya wants a first look at the café and reusable-cup industry before she writes her UBF galaxy page. She writes this decision at the top of a new issue:

> *I decide: TrailMug's galaxy is "cafés and the packaging around them", not "all food service". I will decide which super novas matter after I have read the facts.*

She writes the droid card from the example above and asks the agent to gather facts. The agent returns a table of 14 rows. Maya reviews:

- She opens the links. Three of them do not exist. She deletes those rows. (This is the most common failure: a citation that looks real and is not.)
- Two rows say "market grew by a large percentage". There is no number and no date. She marks them LOW and removes them.
- One row quotes a rule about single-use cups from a city website, which she opens and reads. It is real, but it is about a different city than her pilot. She keeps it, adds the city name and a note.
- She keeps eight rows.

Then, in a separate commit, she writes her own paragraph: *"The one rule change that could matter for us is a local ban on single-use cups. If it comes, demand for reusable cups rises. If it is delayed, we still have the cost advantage for cafés that pay for disposable cups."* This is her decision text. The agent's table is the evidence. The issue comment explains which rows she dropped and why.

Total agent time: minutes. Maya's review: about an hour. And the result is something she can defend in front of an investor or a café owner, because every fact has a source and every judgment has her name.

## 5. Working with AI agents on this

The whole lesson is about this, so here are three more habits.

**Ask for questions before answers.** An agent that proposes questions first is cheaper to correct than an agent that writes a whole document on a wrong assumption.

```text
Before you draft anything, list the five questions whose answers would
change your draft most. For each, say what source could answer it.
I will answer or reject them. Do not start the draft until I reply.
```

**Ask for disagreement.** After you decide, ask an agent to argue against you.

```text
Here is my decision and my evidence. Give the three strongest reasons
I might be wrong, using only the evidence below plus clearly marked
general knowledge. Do not soften. Do not agree.
```

You still decide. But you have faced the objections early and cheaply.

**Limit the power.** Give agents the least access that lets them do the job. A research agent needs to read the web and write one folder. It does not need your payment account, your customer list or the right to merge. If an agent can read untrusted web pages and also act on your systems, a hostile page could try to give it instructions. This is called *prompt injection*, and it is a real risk. Free references from NIST and OWASP are in the further-learning list below.

Disclose in the file and in the merge request: which agent, what job, what you changed. Rule 5 of The Way.

## 6. Common mistakes and how to avoid them

- **Skipping the card.** "Research the market" is not a job. It is a wish. Write the card.
- **Trusting a citation you did not open.** Open at least a sample, and every link behind a number you will repeat to someone else.
- **Letting the agent write the decision.** If the "why" is in the agent's words, you do not own it. Rewrite it.
- **Too much context.** A 30-page context file hides the important rules. Keep it to what changes the answer.
- **Giving broad access to save time.** The time you save is less than the cost of one leak.
- **Not recording what you rejected.** A rejected row is evidence about the agent's reliability. Note it. Over weeks, you learn which jobs to delegate.

## 7. Practice

**Goal:** direct an agent on one framework task, verify it and record the decision.

1. Choose a framework task from the table (for example, "collect public facts about my industry for UBF").
2. In your repo, create `droids/<name>.md` with a droid card.
3. Create `frameworks/context.md` with your product paragraph, your cheat-sheet definitions, known facts with links and the rules.
4. Run an agent on a branch with the card and the context. Keep its output in `research/`.
5. Review: open every link, recompute any number, and list the rows you dropped and why in `research/review-notes.md`.
6. In a separate commit, write your own decision paragraph in the framework file.
7. Open a merge request. In the description list: agent and tool used, what it did, what you changed, and which facts you verified.

**Deliverable:** a merge request that contains the droid card, the context file, the agent output, your review notes and your decision, with the AI use stated.

## 8. Checklist

- [ ] I can say, for each framework, which part I decide and which part an agent may draft.
- [ ] I wrote a droid card with allowed and not-allowed lists and a review point.
- [ ] I wrote a short shared context file with sources.
- [ ] I opened the links behind every claim I kept.
- [ ] My decision is written in my own words, in a separate commit.
- [ ] The merge request states the AI use.
- [ ] The agent had the least access it needed.
