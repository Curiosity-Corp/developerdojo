---
title: "Capstone: GROWTH and the whole product"
description: "Close the capstone loop with the GROWTH Accelerator, turn the Event Horizon into a measurable hypothesis, and review who did what across all eleven steps, people and agent sessions, as the Product Development Manager who owns the whole."
section: "Frameworks"
order: 35
track: "frameworks"
level: "advanced"
duration: "75 min"
outcomes:
  - "Run a GROWTH review (Gauge, Research, Organize, Work, Target, Health) on a launched product"
  - "Write an Event Horizon as a hypothesis with a measure, a date and a way to be wrong"
  - "Show, across the eleven capstone steps, what each discipline and each agent session did and where you decided"
resources:
  - "atlassian/product-launch"
  - "y-combinator/library"
  - "mit-ocw/new-enterprises"
  - "finops/what-is-finops"
  - "dora/dora-research-program"
  - "atlassian/raci-chart"
prerequisites:
  - "tracks/frameworks/34-capstone-launch-sequence-and-mission-control"
updated: 2026-11-03
---

**Dojo programme link:** this lesson is the final presentation of the Developer path (week 6 and the Product Package). It is capstone step 11, and it ties together steps 1 to 10.

## 1. Why this matters

A launch is a beginning. A product that is live and watched still has to **grow**: more people succeed with it, it costs less to run, and the team gets better at making it. Growth is not hope. It is a repeating review with measures.

The last lesson is also where you look at the whole. A 2030 Product Development Manager (PDM) blends founder, product, design, marketing, finance, operations and engineering, and runs agent sessions for much of the lower-level work. The proof of that skill is not any one artefact. It is that the whole chain from dream to growth holds together, and that you can say, for each step, who or what did the work and where you decided.

## 2. Key ideas, explained

### 2.1 The GROWTH Accelerator

GROWTH is a six-part review you repeat on a schedule (monthly is a good start). It is described in [lesson 28](/library/tracks/frameworks/28-mission-control-growth-and-event-horizon/). In plain words:

| Letter | Part | The question | Typical evidence |
|---|---|---|---|
| G | Gauge | Where are we now, measured? | The Mission Control board |
| R | Research | What do people and the market tell us? | Interviews, support notes, competitor facts |
| O | Organize | Do we have the right people, tools and agents for the next step? | Roles, budget, policy, backlog |
| W | Work | What will we do this cycle? | Epics and issues, in order |
| T | Target | What exact result do we aim for? | One to three measures with dates |
| H | Health | Is the team, the system and the budget in good shape? | Incident count, review notes, cost, workload |

Notice that Health is last for a reason: growth that burns the team or the budget is not growth.

### 2.2 The Event Horizon as a hypothesis

Many frameworks describe a big future goal. The World Enterprise texts call it the **Event Horizon**: the point toward which the work is heading. Use it, but write it as a **hypothesis you can fail**:

> **If** we do X for group Y, **then** we expect measure Z to reach N by date D. **We will know we are wrong if** it has not moved by date E.

This keeps ambition honest. A vision that cannot be wrong cannot guide a choice. It also protects you from the pull of hype: do not state that success is certain. Say what you will measure.

### 2.3 Measures that matter

Use three kinds, so no single number runs the product:

- **Outcome:** did people get what they came for? (cups returned per café per week)
- **Business:** is it sustainable? (cost to serve, revenue or funding per active café)
- **Delivery:** can we keep improving? The [DORA research](https://dora.dev/) links delivery measures with team and organisation results.

For cost, [FinOps](https://www.finops.org/introduction/what-is-finops/) is the habit of making cost visible to the people who cause it. For agent runs, give every epic a cost line and review it in Health.

The Atlassian guide on [product launch](https://www.atlassian.com/agile/product-management/product-launch) and the [YC Startup Library](https://www.ycombinator.com/library) offer views on launching and early growth. The MIT OpenCourseWare course [New Enterprises](https://ocw.mit.edu/courses/15-390-new-enterprises-spring-2013/) is a free, rigorous account of building a company around a product. Read them critically. They describe patterns that worked for some, not guarantees.

### 2.4 Who did what: the whole-capstone map

The capstone has eleven steps. For each step, five questions give the PDM's accountability:

1. Which **disciplines** were involved?
2. What did the **people** do?
3. What did **agent sessions** do, inside which policy?
4. What did **you** decide?
5. What **evidence** is in git?

A [RACI chart](https://www.atlassian.com/work-management/project-management/raci-chart) (who is Responsible, Accountable, Consulted, Informed) is a tidy way to write it down. For agents, "Responsible" can be a session, but **Accountable is always a person**.

## 3. Step by step

### 3.1 Run the first GROWTH review

1. **Gauge.** Pull the board numbers for the period. Write them down, even the bad ones.
2. **Research.** Talk to at least three real users or partners. Add one fact from outside (a competitor, a rule, a price).
3. **Organize.** List who and what is available next cycle: people, budget, agent capacity, policy changes needed.
4. **Work.** Choose the next epics from the roadmap. Say what you are dropping.
5. **Target.** Write one to three measures with dates.
6. **Health.** Check incidents, review notes, cost, workload. Name one thing to improve.
7. **Write the Event Horizon hypothesis** and the date you will check it.

### 3.2 Build the whole-capstone map

Make a table with eleven rows (DREAM, UBF, STAR, ORBITAL, catalogue, personas and journeys, roadmap, ANDROID Ops build, Launch Sequence, Mission Control, GROWTH). Fill the five columns above. Link each row to files in git. Mark one row you would do differently.

### 3.3 Present

Give a ten-minute walk-through. Show the map first, then take two steps in depth. Take questions. The most useful questions are "how do you know?" and "what did the agents get wrong?".

## 4. Worked example: TrailMug

### 4.1 GROWTH review, month one (fictional numbers, to show format)

| Part | Entry |
|---|---|
| Gauge | 4 cafés live; median return time 18 seconds; finder success 86 percent; two incidents in the drill and one real |
| Research | Three barista chats: scanning at rush hour is slow; one competitor charges deposit by card only |
| Organize | One part-time designer; one more café partner; a second agent session class for tests |
| Work | Epic 2 (a café can start in one visit) and the return-speed work in epic 4 |
| Target | Median return time under 10 seconds by week 10; setup under 30 minutes at the next café |
| Health | Review found no alert for "zero cafés open", now added; agent cost under the line; Maya working weekends, so next cycle limits parallel sessions to two |

**Event Horizon hypothesis.** "If every partner café can start in one visit and return a cup in under ten seconds, then weekly returns per café will double in the first quarter. We will know we are wrong if returns are not up by half by week 8."

### 4.2 Whole-capstone map (extract)

| Step | Disciplines | People | Agent sessions (inside policy) | Maya decided | Evidence |
|---|---|---|---|---|---|
| 1 DREAM | Founder, marketing | Interviews with cafés | Cluster notes, draft summary | The dream statement | `docs/dream.md` |
| 5 Catalogue | Ops, engineering | Verified items | Scan repos for draft entries | What is FOUND | `catalogue/` |
| 7 Roadmap | Product, finance | Challenge session | Check epics against template | Epic order and dates | `roadmap/epics.md` |
| 8 Build | Engineering, design | Reviews | Build issues, one merge request each | Policy; merge | merged MRs and manifests |
| 9 Launch | Security, ops, support | Approver | Fill stage checklist, change record draft | Release and turn-off | `docs/launch/` |
| 10 Mission Control | Ops, product | Drill | Logs, status note | Incident decisions | `mission-control/` |
| 11 GROWTH | Founder, finance | Partner talks | Summarise board data | Next epics | `docs/growth/` |

The full eleven-row table is in the capstone repository. She marked step 3 (STAR) as the one she would redo: the first Reach goal was too vague.

## 5. Working with AI agents on this

**Where you are on the ladder.** Across the capstone you used, delegated, orchestrated and governed. Write which rung each step used, and be honest where a step stayed at rung one by choice.

**What the PDM decides.** The Target, the Event Horizon, what to drop, what to spend, whether the team is healthy.

**What is delegated, with the exact brief.**

```text
Read mission-control/board.md and the last four weeks of exports in
data/board/. Produce a one-page Gauge summary: each measure, its value
each week, and the change. Quote the file and row for every number. Do not
interpret causes and do not recommend actions.
```

```text
Read research/interviews/ and support/notes/. List every request or
complaint with the count of people who raised it and a verbatim quote.
Mark anything you infer as INFERRED. Do not rank by importance.
```

**How to verify.** Recompute two numbers from the data. Check every quote. Look for any claim that has no source row.

**Disciplines involved.** Founder (the Event Horizon), product (Work and Target), marketing (Research and partner stories), finance (Organize and Health), operations (Gauge and Health), engineering (what the data says about delivery).

**Governance of the loop.** The review itself can be scheduled work for sessions inside the same policy: gather, summarise, draft. The decision stays with people. The [Agent orchestration](/library/tracks/agent-orchestration/) track shows how a larger operation structures this with briefings and a decision queue.

## 6. Common mistakes and how to avoid them

- **Vanity measures.** Pick measures that change decisions.
- **An Event Horizon that cannot fail.** Add the "we will know we are wrong if" clause.
- **Skipping Health.** The cost of growth lands on people and budget.
- **Treating outside advice as fact.** Check it against your own data.
- **A map with no evidence links.** Every row points to git.
- **Claiming agents did nothing wrong.** Record what they got wrong and the gate you added.
- **Overclaiming.** Do not promise results, approvals or accreditation you do not have.
- **Fabricated numbers.** If you use example numbers in a case study, label them as examples.

## 7. Practice

**Deliverable in git:** on a branch `grow-and-present`:

1. `docs/growth/review-1.md`: the six-part GROWTH review with evidence.
2. `docs/growth/event-horizon.md`: the hypothesis, the measure, the check date and the failure condition.
3. `docs/capstone-map.md`: the eleven-row whole-capstone map with links to evidence, a rung of the ladder for each step, and one step you would redo.
4. `docs/presentation.md`: the ten-minute outline and the questions you were asked.
5. A merge request that closes the capstone milestone, with a statement of what agents did and what you decided.

## 8. Review checklist

- [ ] Every GROWTH part has evidence.
- [ ] The Event Horizon is a hypothesis with a failure condition.
- [ ] Measures include outcome, business and delivery.
- [ ] Cost is visible, including agent cost.
- [ ] The map covers all eleven steps with links.
- [ ] Accountable is a person on every row.
- [ ] I named one step I would redo and why.
- [ ] No claim overstates what the product has achieved.

**Next:** the [role lens pages](/library/tracks/frameworks/40-role-lens-one-shared-language/) show the same capstone from the seat of each discipline.
