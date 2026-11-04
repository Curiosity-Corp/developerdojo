---
title: "Choose your rhythm: agile, Scrum and Kanban"
description: "Learn what agile, Scrum and Kanban actually say, choose a working rhythm on purpose for your product and write it down in one page that people and agents can follow."
section: "Agile delivery"
order: 1
track: "agile-delivery"
level: "core"
duration: "2.5 hours"
outcomes:
  - "Explain agile, Scrum and Kanban in plain words and say how they differ"
  - "Choose a rhythm for your product and give three reasons"
  - "Write a one-page working agreement that others, including agents, can follow"
  - "Name what you will not copy from a framework"
resources:
  - "atlassian/what-is-agile"
  - "atlassian/what-is-scrum"
  - "atlassian/what-is-kanban"
  - "scrum-org/scrum-guide"
  - "gov-uk/agile-methods-introduction"
  - "youtube-scrum-org/what-is-scrum-introduction"
  - "youtube-atlassian/what-is-agile-atlassian-answered"
prerequisites:
  - "week-4-defend-the-roadmap"
  - "weekly-cadence-and-common-mistakes"
updated: 2026-11-03
---

**Supports:** Developer, week 4 (Defend the roadmap): the weekly rhythm. **Time:** about two and a half hours.

## 1. Why this matters

Every team has a rhythm, even if nobody wrote it down. It is the answer to: when do we plan, when do we look at what we built, who decides what next, and how do we find out we are wrong? When the rhythm is accidental, the answers change with the mood of the week.

Agile is the common name for working in short cycles and learning from real use. It is also one of the most misused words in the industry. People say "we are agile" and mean "we have no plan", or "we hold a lot of meetings". A Product Development Manager (PDM) has to know what the words say, and has to pick a rhythm that fits the product, the people and the agents doing the building.

This lesson is deliberately about **choice**. You will read the source texts, compare the methods and write a one-page agreement. Nothing here is a rule from the Dojo except one: the rhythm must be written down and kept in git.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The rhythm, the cycle length, the review time, what you will not copy | Summaries of the sources; a first draft of the agreement for you to rewrite; reminders | The agreement matches how work really happens; every rule has a reason | Engineering (cycle length, review), operations (release), finance (cost of a cycle), sales and support (what they can promise) |

## 2. Key ideas

### Agile in plain words

Atlassian's introduction describes agile as an approach built on iterating: deliver in small pieces, get feedback and adjust. The core is not a meeting. It is a loop: **plan a small thing, build it, put it in front of a person, learn, change the plan.** The shorter the loop, the sooner you learn that you were wrong, and the cheaper the correction.

### Scrum

Scrum is a framework with a short official definition, the Scrum Guide, written by its creators. In the guide:

- Work happens in **sprints**: fixed-length cycles of one month or less.
- There are three accountabilities: the **Product Owner** (the value and the order of the backlog), the **Developers** (building a usable increment) and the **Scrum Master** (helping the team use Scrum well).
- There are five events: the sprint itself, sprint planning, the daily scrum, the sprint review and the sprint retrospective.
- There are artifacts, each with a commitment: the product backlog (product goal), the sprint backlog (sprint goal) and the increment (definition of done).

Atlassian's Scrum page and the Scrum.org video give shorter introductions. Read the guide itself once: it is short, and most second-hand descriptions add things it does not say.

### Kanban

Kanban is a method for **flow**. You visualise the work on a board, limit how much is in progress at once and manage the flow of items from start to finish. There are no fixed sprints. Work is pulled in when there is capacity. Atlassian's Kanban page describes the board, columns and work-in-progress limits.

### How the methods differ

| Question | Scrum | Kanban |
|---|---|---|
| Cycle | Fixed sprints | Continuous flow |
| Planning | At the start of each sprint | When capacity opens |
| Change during the cycle | Avoided inside a sprint | Allowed at any time, within limits |
| Key measure | What was finished per sprint | How long items take to flow through |
| Fits best | Product work with goals per cycle | Support, operations, steady streams |

The UK government's service manual page on agile methods gives a neutral comparison and notes that teams often mix them. Many do: a sprint rhythm for product work and a flow board for incoming requests.

### What changes with agents

Agents do not need meetings, but you do. The rhythm exists for **people**: to decide, to review and to learn. An agent can work at any hour, which tempts managers to drop the rhythm. Do not. The rhythm is where decisions are made, and where somebody reads what the agents produced.

Two practical effects:

- **Short cycles pay off more.** An agent can build a slice in a day. If you wait a month to look, you may review a month of wrong work.
- **Review time is the scarce resource.** Choose a cycle length that leaves a person enough time to review properly.

### A rhythm is a written agreement

A rhythm is only useful if people, and agents reading your repo, can know it. A one-page agreement says: the cycle length, the days for planning, review and retrospective, who decides the order of the backlog, what "done" means, how urgent changes are handled and what is never done in the middle of a cycle.

## 3. Step by step

### Step 1: Read the sources

Read the Scrum Guide and the Atlassian pages on agile, Scrum and Kanban. Watch the two videos if you prefer to start there. Make a short note of anything that surprised you, or that differs between sources.

### Step 2: Describe how your work arrives

List the kinds of work that reach you: planned milestone work, urgent bugs, requests from customers, admin. Estimate roughly how much of each. This decides your rhythm more than any book.

### Step 3: Choose

Use this guide.

- Mostly planned product work, a small team, a clear milestone: **Scrum-style sprints**, one or two weeks.
- Mostly incoming requests and fixes: **Kanban**.
- Both: sprints for milestone work, a small flow lane for urgent items with a limit.

### Step 4: Pick the cycle length

Choose between one and four weeks. Shorter is usually better when you are learning, as long as a person can review properly in the time. Write the reason.

### Step 5: Decide the events

For each event you keep (planning, a daily check, review, retrospective), write when it happens, how long it takes, who is there and what it must produce. Drop any event that produces nothing.

### Step 6: Write what you will not copy

Write down parts of a framework you chose not to use and why. For example: "We skip the daily meeting and use a written update instead, because we work in different time zones."

### Step 7: Write the working agreement

One page, in the repo at `delivery/working-agreement.md`.

### Step 8: Try it for one cycle

Run it for a cycle. Do not change it midway unless something is clearly broken. Look again in lesson 4.

## 4. Worked example: TrailMug

TrailMug is fictional. The founder works alone with agents, two days a week with a part-time designer. Work arrives as: planned milestone work (about 70%), small fixes from café feedback (20%) and admin (10%).

**Choice:** sprints of **one week** for milestone work, plus a small **flow lane** for café fixes with a limit of two items in progress.

**Reasons:**

1. She is still learning what cafés need, so short loops matter.
2. The designer is available two days a week, so the cycle must be short enough to plan around her.
3. Café fixes cannot wait for a Monday, but they must not swallow the week.

**Working agreement (excerpt):**

```markdown
# TrailMug working agreement

Cycle: one week, Monday to Friday.
Monday 09:00 (45 min): planning. I pick the milestone slice and read the
acceptance checks aloud. Output: sprint goal in one sentence.
Wednesday: a written update, five lines, in delivery/updates/.
Friday 14:00 (60 min): review. I run every acceptance check myself on the
running product. Output: accepted, sent back, or dropped.
Friday 15:00 (30 min): retrospective. Output: one change for next week.

Urgent café fixes: flow lane, at most two in progress. If a third arrives,
one must finish or wait.

Not copied: daily meeting (I work mostly alone; the Wednesday note is
enough). Story points (they say little about agent work).

Done means: the definition in delivery/definition-of-done.md.
No new work enters a week after Monday except a flow-lane fix.
```

**What she learned:** by choosing, she found that Wednesday needed a check. After one cycle, an agent had worked two days in the wrong direction because nobody looked. She added a ten-minute look at the pull requests on Wednesday.

## 5. Working with AI agents on this

Choosing a rhythm is a management decision. Agents are useful for reading and for drafting.

**Delegate:**

- **Source summaries.** "Summarise the Scrum Guide in 300 words, then list five things that popular articles claim about Scrum that the guide does not say. Quote the guide for each." Check the quotes.
- **Comparison.** "Compare Scrum and Kanban for a one-person product with agent helpers. Give two risks for each."
- **A first draft** of the working agreement from your notes, which you then rewrite in your own words.
- **Reminders.** An agent can post a Monday message with the sprint goal and a Friday message listing what is waiting for review.

**Do yourself:**

- Choose the rhythm and the length.
- Decide what you will not copy.
- Decide who gets a say on the order of work.
- Run the review. An agent never judges its own output.

**A brief you can adapt:**

```text
I am writing a one-page working agreement for a small product team with
AI agents. Below are my notes: how work arrives, my cycle length, my
events and what I do not want to copy from Scrum.
Draft the agreement in plain words, one page. Do not add events or
rules I did not list. After the draft, list any rule that has no stated
reason, as a question for me.
```

**How to check the output.** Read every rule and ask: "Do I really do this?" Delete the rest. Compare any claim about Scrum with the Scrum Guide itself.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **use**, with a little **delegate**. The working agreement is the first written policy: it says when agents may be started, when work stops for review and what no one may change midweek. The [agent orchestration track](/library/tracks/agent-orchestration/) covers the upper rungs.

**Disclose.** At the end of the agreement: "AI use: source summaries and a first draft. The choices and reasons are mine."

## 6. Common mistakes

- **Agile theatre.** Holding every meeting and changing nothing.
- **Copying a framework whole.** Keep what produces decisions. Drop the rest.
- **Choosing by fashion.** Choose by how your work arrives.
- **A cycle longer than your review capacity.** Work piles up unreviewed.
- **No written agreement.** The rhythm then lives in someone's head.
- **Dropping the rhythm because agents work at night.** Agents do not need the rhythm. You do.
- **Changing the rules every week.** Run one full cycle before you judge it.
- **Quoting Scrum from memory.** Read the guide. It is short.

## 7. Practice: write your working agreement

**Deliverable:** `delivery/working-agreement.md` in your git repo, with:

1. How work arrives (the rough split) in three lines.
2. The rhythm you chose and the cycle length, with three reasons.
3. Each event you keep: when, how long, who, what it produces.
4. What you will not copy, and why.
5. How urgent changes are handled.
6. A link to your definition of done (you write it in lesson 3).
7. Your AI-use line.

Commit with a message such as `Add working agreement`.

**Check:** give the file to someone who has never seen your project. Ask her to say what happens on Monday and what happens on Friday. If she cannot, simplify.

**Stretch:** read the Scrum Guide and mark three sentences that surprised you. Write two lines on each: what you do differently because of it.

## 8. Checklist

- [ ] I read the Scrum Guide itself, not only summaries.
- [ ] I described how my work really arrives.
- [ ] I chose a rhythm and gave three reasons.
- [ ] Every event produces something, or I dropped it.
- [ ] I wrote what I will not copy.
- [ ] Review time is protected in the cycle.
- [ ] The agreement is in git.
- [ ] I recorded my AI use.

## 9. Further learning

The Scrum Guide is the primary source. Atlassian's pages on agile, Scrum and Kanban give friendly introductions with diagrams. The UK government's page on agile methods compares them neutrally, and the two videos give you a ten-minute start. In the next lesson you build the backlog that feeds the rhythm.
