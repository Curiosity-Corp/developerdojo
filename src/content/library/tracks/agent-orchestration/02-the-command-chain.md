---
title: "The command chain"
description: "Sessions, Commanders, a Chief of Command and an Admiral: how to draw a chain of command for agents with spans, coverage, a reserve and budgets that tighten downward."
section: "Agent orchestration and policy administration"
order: 2
track: "agent-orchestration"
level: "advanced"
duration: "3 hours"
outcomes:
  - "Describe the four tiers (Session, Commander, Chief of Command, Admiral) and what each decides"
  - "Draw an org map in which every product has exactly one owner or a named gap"
  - "Set spans, a reserve seat and budgets that tighten downward"
  - "Check the org map with a policy test instead of by eye"
  - "Explain why tiers may be skipped but never inverted"
resources:
  - "wikipedia/span-of-control"
  - "wikipedia/mission-command"
  - "openai/agents-orchestration"
  - "anthropic/claude-code-sub-agents"
  - "anthropic/claude-code-agent-teams"
  - "anthropic/claude-code-agent-view"
  - "open-policy-agent/conftest"
prerequisites:
  - "tracks/agent-orchestration/01-why-orchestration-is-the-future"
  - "tracks/working-with-ai-agents/06-orchestrating-multiple-agents"
updated: 2026-11-03
---

**Supports:** Master Developer, module "AI-agent orchestration". **Time:** about three hours. **Needs:** the repository from lesson 1. The lab runs without a model: it uses a free policy tool.

## 1. Why this matters

In lesson 1 you saw that one person cannot steer a hundred sessions. This lesson draws the answer. It is a **chain of command**: a few levels, each with a small span, each knowing what it owns and what it must hand upward.

Without a chain, three things go wrong, and they go wrong quietly. Two sessions work on the same file and one erases the other. A whole area has no owner, so nobody notices when it breaks. And spending grows with the number of sessions, because nobody was given a limit to hold. A chain of command fixes all three with one rule: **every outcome has exactly one owner, every owner has a limit, and every limit sits inside the limit above it.**

### What the PDM decides here

| You decide | You delegate to agents | You verify | Other disciplines involved |
|---|---|---|---|
| The tiers you need, which unit belongs to whom, the budgets and span limits | Drafting the map, running the check, running the sessions inside their seat | That the map passes its checks and that gaps are listed, not hidden | Finance (budgets), operations (who is on call for what), security (who may touch what) |

## 2. Key ideas, explained

### The four tiers

We use four names. They are plain, and they match what each level actually does.

| Tier | What it is | What it decides | What it never does |
|---|---|---|---|
| **Session** | One agent working on one task in one workspace | How to do the task it was handed | Chooses its own task, or touches files outside its brief |
| **Commander** | A long-lived agent that owns one area (a product, a service) | Which tasks to run, in what order, with which sessions | Reaches into another Commander's area |
| **Chief of Command** | An agent that coordinates several Commanders | Which Commander gets the outcome, the merge order, how to resolve overlaps | Does the building work itself |
| **Admiral** | The top seat, working with the person | What the outcomes are, the rules, the budgets, which decisions go to the human | Writes code or runs sessions directly |

The names come from naval and military command because that tradition has already solved the problem: how do a few leaders direct many, with small spans and clear limits? You do not need to love the words. You need the structure behind them.

Notice what each tier **produces**. A Session produces a change and evidence. A Commander produces a finished outcome for its area and a short report. A Chief produces a coordinated result across areas and one briefing. The Admiral produces rules, budgets and a short list of questions for the person. Each level turns a lot of detail into less, so the level above can handle it. This is how span of control stays small.

### Tiers may be skipped, never inverted

A small product does not need all four tiers. A solo founder with two products might have an Admiral and two Commanders, with no Chief. That is **skipping**, and it is fine. A tier you do not need is a tier whose job you do yourself or do not have.

What is never allowed is **inversion**: a Session giving orders to a Commander, a Commander changing the Admiral's rules, or a Chief approving its own budget. If authority flows upward, the limits above no longer limit anything. The org-map check below enforces this: a Commander that reports to a Chief must report to one that exists.

### Spans, coverage and the reserve

A **span** is how many seats report to one seat. In your org map, you write a limit: for example, a Chief has at most five Commanders, a Commander runs at most four sessions at once. These are not laws of nature. They are your choice, kept small enough that the seat above can read the reports. The numbers in this lesson are TrailMug's, for illustration. Choose yours by asking: how many things can this seat actually keep in mind, and how many one-page reports can the next seat read?

**Coverage** means every unit of work is owned. The unit can be a product, a repository, a service, or a process. The test is simple: list every unit, then for each find exactly one owner. Two owners is a collision. Zero owners is a gap. A gap is allowed only if it is **listed**, with a reason and a follow-up. An unlisted gap is a hole nobody knows about.

A **reserve seat** is a Commander with no area. It exists so that when something new appears (a new product, an incident, a Commander that fails), there is a seat to give it to, instead of piling it on someone already full. Keep exactly one.

### Budgets tighten downward

Every seat has a budget: how many sessions it may run, and how much it may spend per day. The rule is that **children never add up to more than their parent.** If a Chief may run nine sessions, its Commanders' limits add up to nine or fewer. If the Admiral may spend forty dollars a day, the Chiefs and direct Commanders together fit inside forty.

This does two jobs. It is a **cost control**: the worst day has a known ceiling. And it is a **safety control**: a runaway Commander cannot starve the others or exceed the Admiral's limit, because its own limit is smaller than its parent's. A budget that is not checked against its parent is a guess.

### Why each seat has a name and a file

Give every seat an identifier (`cmd-app`, `chief-cafes`) and write it down in one file. Agents do not remember yesterday. If the chain exists only in someone's head, or in a chat, it will drift. If it exists as a file in git, then every session can be told its seat at the start, hooks can read it, a pipeline can check it, and a change to the chain is a reviewed change with a date.

### Pushing the chain into the tools

The public tools give you pieces of this. Claude Code [subagents](https://code.claude.com/docs/en/sub-agents) are defined in markdown files with a name, a description, the tools allowed and a model, so a read-only reviewer is a file. Claude Code also has [agent teams](https://code.claude.com/docs/en/agent-teams) for several sessions that coordinate, and an [agent view](https://code.claude.com/docs/en/agent-view) to see the sessions you have running. In the OpenAI Agents SDK, [orchestration](https://openai.github.io/openai-agents-python/multi_agent/) lets one agent call others as tools, which is the "Chief calls Commanders" shape in code. None of them gives you the *rules* of the chain. That is your org map and your policy, which is what this track teaches.

## 3. Step by step: draw and check a chain

### Step 1: List the units

Write every product, service, repository and recurring process. Include the ones that are boring. Include your command repository itself.

### Step 2: Choose the tiers you need

Count the units. If one seat could keep them all in mind, you need an Admiral and Commanders. If a seat would hold more than your span limit, add a Chief.

### Step 3: Assign one owner per unit

Write the owner next to each unit. If two want it, split the unit or choose. If nobody wants it, list it as a gap with a reason and a follow-up.

### Step 4: Choose limits

Write the span limits, and give every seat a budget in sessions and in money per day. Make the sums tighten downward.

### Step 5: Add one reserve seat

A Commander with no owned units and a small budget.

### Step 6: Write it as data

One YAML file. Data can be checked by a machine. A diagram cannot.

### Step 7: Check it with a policy test

Write the rules above as policy and run them on every change. The next section shows how.

## 4. Worked example: TrailMug

Maya's four tiers:

- **Admiral:** works with Maya. Owns the rules, the budgets and the decision queue.
- **Chief of Command `chief-cafes`:** coordinates the three Commanders and writes the one daily briefing.
- **Commanders:** `cmd-app` owns the sign-up app, `cmd-site` owns the café-owner website, `cmd-ops` owns operations and the command repository itself. `cmd-reserve` has no area.
- **Sessions:** each Commander runs up to three at a time.

Here is the whole map as one file, `org/org-map.yaml`. The numbers are TrailMug's.

```yaml
version: 1
limits:
  max_commanders_per_chief: 5
  max_sessions_per_commander: 4
admiral:
  id: admiral
  budget: { max_sessions: 12, max_usd_per_day: 40 }
chiefs:
  - id: chief-cafes
    budget: { max_sessions: 9, max_usd_per_day: 30 }
commanders:
  - id: cmd-app
    chief: chief-cafes
    owns: [trailmug-app]
    budget: { max_sessions: 3, max_usd_per_day: 10 }
  - id: cmd-site
    chief: chief-cafes
    owns: [trailmug-site]
    budget: { max_sessions: 3, max_usd_per_day: 10 }
  - id: cmd-ops
    chief: chief-cafes
    owns: [trailmug-ops, trailmug-command]
    budget: { max_sessions: 3, max_usd_per_day: 10 }
  - id: cmd-reserve
    reserve: true
    owns: []
    budget: { max_sessions: 1, max_usd_per_day: 3 }
products:
  - trailmug-app
  - trailmug-site
  - trailmug-ops
  - trailmug-command
  - trailmug-pilot-data
gaps:
  - unit: trailmug-pilot-data
    reason: "no owner decided yet"
    follow_up: "issue 14"
```

Read it as a manager. The Chief has nine sessions, and its three Commanders hold three each, so the sums fit. The Admiral has twelve: the Chief's nine plus the reserve's one is ten, so there are two spare. The pilot data has no owner. Maya did not hide that. She listed it, with a reason and an issue number, and the check will keep reminding her.

The reserve Commander reports to nobody in particular: it is a direct report of the Admiral. That is a skipped tier, which is allowed.

## 5. Working with AI agents on this

What to delegate: drafting the first org map from your list of units, writing the policy rules from the plain-language rules above, and explaining a failing check. What you must do yourself: choose the span limits, set the budgets (money is a human decision), and decide who owns what when two areas overlap.

A prompt you can adapt:

```text
Here is my list of units and my span limits. Draft org/org-map.yaml with one owner per
unit and one reserve Commander. Do not invent units. If a unit has no obvious owner,
list it under gaps with a reason and leave the follow_up as "TBD". Then list every
assumption you made, one per line.
```

Check: count the units in your list and the units in the file. Are they the same? Are budgets summing downward? Run the policy check below rather than trusting your eye.

Disclose in the log: "AI use: org map drafted from my unit list; I set limits and budgets."

**Where this sits on the ladder.** Writing the map is rung two. Running the chain it describes is rung three. Making the map checked by machine and unbreakable is rung four.

## 6. Common mistakes and how to avoid them

- **Overlapping owners.** Two Commanders touching one repository. Give each unit exactly one owner.
- **Silent gaps.** Something nobody owns. List it, or give it to the reserve.
- **Unlimited spans.** A Chief with twenty Commanders is a person with a very full inbox. Split.
- **No reserve.** Then every surprise goes to a seat that is already busy.
- **Budgets that do not add up.** If every child has a bigger number than the parent allows, there is no limit.
- **A map nobody checks.** Drawn once, wrong in a week. Put it in the pipeline.
- **Treating the map as permanent.** Reorganise when work changes. A change to the map is a decision, so log it.

## 7. Practice: the org map and its check

**Deliverable:** `org/org-map.yaml` and `policy/orgmap.rego` in your `trailmug-command` repository, with a check that passes and a deliberate failure that is caught. This lab needs no model.

1. **Install the policy tool.** Install [Conftest](https://www.conftest.dev/install/) (it embeds Open Policy Agent). Confirm with `conftest --version`.
2. **Write your org map** in `org/org-map.yaml`, using the file above as a model. Use TrailMug or your own product.
3. **Write the rules.** Create `policy/orgmap.rego`:

```rego
package orgmap

import rego.v1

# 1. Every product has exactly one owner, or is a listed gap (never both).
owners(product) := {c.id | some c in input.commanders; product in c.owns}

gap_units := {g.unit | some g in input.gaps}

deny contains msg if {
	some p in input.products
	count(owners(p)) > 1
	msg := sprintf("product %s has more than one owner: %v", [p, owners(p)])
}

deny contains msg if {
	some p in input.products
	count(owners(p)) == 0
	not p in gap_units
	msg := sprintf("product %s has no owner and is not a listed gap", [p])
}

# 2. Exactly one reserve seat.
deny contains msg if {
	n := count([c | some c in input.commanders; c.reserve == true])
	n != 1
	msg := sprintf("expected exactly one reserve commander, found %d", [n])
}

# 3. Span: a seat over its span must be split.
deny contains msg if {
	some c in input.commanders
	c.budget.max_sessions > input.limits.max_sessions_per_commander
	msg := sprintf("%s runs %d sessions, over the span limit of %d",
		[c.id, c.budget.max_sessions, input.limits.max_sessions_per_commander])
}

# 4. Budgets only tighten downward.
deny contains msg if {
	some chief in input.chiefs
	total := sum([c.budget.max_sessions | some c in input.commanders; c.chief == chief.id])
	total > chief.budget.max_sessions
	msg := sprintf("%s: its commanders add up to %d sessions, more than its own budget of %d",
		[chief.id, total, chief.budget.max_sessions])
}

# 5. Tiers can be skipped but never inverted: a chief named by a commander must exist.
deny contains msg if {
	some c in input.commanders
	c.chief
	not c.chief in {ch.id | some ch in input.chiefs}
	msg := sprintf("%s reports to %s, which is not a chief in this map", [c.id, c.chief])
}
```

4. **Run the check.** From the repository root:

```bash
conftest test org/org-map.yaml -p policy --namespace orgmap
```

   It should say that all tests passed. Use `--namespace orgmap` so only these rules run on this file.
5. **Break it on purpose.** Add `trailmug-app` to the `owns` list of `cmd-site`. Run the check again. You should see the message "product trailmug-app has more than one owner". Then raise `cmd-app` to `max_sessions: 6` and see the span message. Undo both changes.
6. **Hand a gap to the reserve** or add an owner for `trailmug-pilot-data`, and confirm the gap list can shrink.
7. **Log the decision:** who owns what, and why, with the date.

Commit with a message such as `Add org map and ownership policy`.

**Check:** the passing run, and two captured failures with the exact messages, pasted into `decisions/log.md`.

**Stretch (needs an OpenAI key):** build the Chief and Commanders as agents in the OpenAI Agents SDK, with the Chief calling each Commander as a tool:

```python
from agents import Agent

app = Agent(name="app-commander", instructions="You run the TrailMug app.")
site = Agent(name="site-commander", instructions="You run the TrailMug website.")
ops = Agent(name="ops-commander", instructions="You run TrailMug operations.")

chief = Agent(
    name="chief",
    instructions="Split the outcome across your Commanders, call each once, then summarise with evidence.",
    tools=[
        app.as_tool(tool_name="app_commander", tool_description="Outcomes for the TrailMug app"),
        site.as_tool(tool_name="site_commander", tool_description="Outcomes for the TrailMug website"),
        ops.as_tool(tool_name="ops_commander", tool_description="Outcomes for TrailMug operations"),
    ],
)
```

Notice what this code does **not** give you: owners, budgets or a check. The chain in code is only the skeleton. The map and the policy are the governance.

## 8. Checklist

- [ ] I can name the four tiers and what each decides.
- [ ] Every unit has exactly one owner or is a listed gap.
- [ ] I have exactly one reserve seat.
- [ ] Budgets add up downward, and the check proves it.
- [ ] I broke the map on purpose and saw the failure message.
- [ ] I can explain skipping a tier and why inverting one is never allowed.
- [ ] I logged the ownership decision with a date.
- [ ] I recorded my AI use.

## 9. Further learning

The Wikipedia articles on span of control and mission command give the old, human version of this lesson. For code, the OpenAI Agents SDK page on orchestration shows one agent calling others, and Anthropic's pages on Claude Code subagents, agent teams and agent view show the same idea in an agent tool you may already use. The Conftest site has the install and examples for the policy check.

**Next:** policy as data. The next lesson in this track (`/library/tracks/agent-orchestration/03-policy-as-data-and-decision-domains/`) turns the rules you hold in your head into files that are tested like code.
