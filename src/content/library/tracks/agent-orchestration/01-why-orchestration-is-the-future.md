---
title: "Why orchestration is the future"
description: "The four rungs of agent skill, why one decider cannot steer a hundred sessions, why policy is the off switch, and which decisions a person must always keep."
section: "Agent orchestration and policy administration"
order: 1
track: "agent-orchestration"
level: "advanced"
duration: "3 hours"
outcomes:
  - "Place any piece of agent work on the ladder: use, delegate, orchestrate, govern"
  - "Explain span of control, and why a chain of command beats one person watching every session"
  - "Say why policy, not permission prompts, is how agents should be governed"
  - "List the decisions a person must keep, and the ones that should never wait for a person"
  - "Treat earlier agent-made decisions as hypotheses to test"
resources:
  - "anthropic/building-effective-agents"
  - "anthropic/multi-agent-research-system"
  - "anthropic/measuring-agent-autonomy"
  - "anthropic/framework-safe-trustworthy-agents"
  - "wikipedia/mission-command"
  - "youtube-ai-engineer/how-we-build-effective-agents-barry-zhang-anthropic"
  - "anthropic/claude-code-in-action"
prerequisites:
  - "tracks/working-with-ai-agents/06-orchestrating-multiple-agents"
  - "the-way-five-rules"
updated: 2026-11-03
---

**Supports:** Master Developer, module "AI-agent orchestration", the opening lesson. **Time:** about three hours. **Needs:** the [working with AI agents track](/library/tracks/working-with-ai-agents/), especially its lesson on orchestrating multiple agents.

## 1. Why this matters

Think about the biggest product you could build alone. Now think about how many hours of typing it needs. Agents have changed that sum. A single agent can write code, tests, documents and research drafts faster than you can read them. A hundred sessions can do a hundred times more.

That creates a new problem, and it is not typing. It is **steering**. One person cannot read the work of a hundred sessions. One agent cannot hold a whole product in its head: its context fills up, it forgets what was decided last week, and it cannot see the other ninety-nine. If you try to steer every session yourself, you become the bottleneck. If you stop steering, you ship things nobody checked.

The answer is the same one people found when companies, armies and ships grew too big for one leader. You build a **structure**: a few levels, each with a small span, each with clear limits, all inside written rules. This track teaches you to build that structure for agents. It is the skill that separates a person who uses AI from a Product Development Manager who runs an AI workforce.

### What the PDM decides here

| You decide | You delegate to agents | You verify | Other disciplines involved |
|---|---|---|---|
| What the product is for, which decisions are yours alone, the rules every session lives under, the budgets | Almost all building, testing, research drafts and routine operations, inside those rules | Evidence that the rules held: gates passed, briefings honest, decisions logged | Finance (budgets), security and privacy (what a model may see), operations (gates to production), engineering (depth to judge the work) |

## 2. Key ideas, explained

### The ladder of agent skill

Your skill with agents climbs four rungs. Each rung solves a problem the one below cannot.

| Rung | What you do | The problem it solves | What can go wrong |
|---|---|---|---|
| **1. Use** | Work with one agent, step by step, and read every answer | Getting good output from one agent | You become the typist who reads |
| **2. Delegate** | Hand a whole task to one agent with a brief and checks | Your time: you stop doing the task | The agent works for hours in the wrong direction |
| **3. Orchestrate** | Run many sessions at once in a command chain | Throughput: many tasks at the same time | Sessions collide, duplicate work or leave gaps |
| **4. Govern** | Bound all sessions with written policy, hooks and gates | Safety at scale: no person can watch every session | Rules that nobody enforces become suggestions |

The first two rungs are in the [working with AI agents track](/library/tracks/working-with-ai-agents/). This track teaches rungs three and four. They are different skills, and they are connected: orchestration without governance is fast and dangerous, and governance without orchestration is safe and slow.

### Span of control

**Span of control** is the number of people (or sessions) one manager can direct well. [The general idea](https://en.wikipedia.org/wiki/Span_of_control) is old: a wide span is fast but thin, a narrow span is careful but needs many managers. Agents change the numbers, not the shape. A person who must approve every action of every session has a span of about one. A person who reads one briefing per day has a very wide span, but only if something below them does the watching.

So orchestration is not "more agents". It is **a structure that keeps every decider's span small**: each level looks after a few things below it and reports upward in short form. The next lesson draws that structure.

### Speed with safety: policy is the off switch

The usual way to make an agent safe is to ask a person each time: "May I run this command?" That does not scale, and it fails in a quiet way. After the fiftieth question, people click yes without reading. The questions train people to stop paying attention.

The better way is to decide **once, in writing**, what is always allowed, what is never allowed and what needs a person. Then you enforce it by machine. We call this **policy is the off switch**: you do not supervise each action, you set the rule, and the rule turns the dangerous action off before it happens. An agent that tries a forbidden command is stopped, told why, and told what to do instead.

This has three effects. Agents move fast inside the rules, because they are not waiting for you. You sleep, because the dangerous door is locked, not watched. And you can audit: the rules are a file in git, with a reason beside each one.

### Evidence over trust

An agent will report that its work is done and correct, whether it is or not. This is not lying in the human sense. It is how the tools are built: they sound sure. So in a governed system, a claim of "done" never counts. **Evidence** counts: a green pipeline, a test that ran, a diff inside the allowed files, a screenshot of the running page. Every outcome you hand down says what evidence must come back.

This is also why the pipeline is the quality bar when agents write most of the code. You cannot read everything. You can require that everything proves itself.

### What a person must keep

Governance is not "agents do everything". There are decisions where a mistake cannot be undone, and a person must keep them. A good test: **can we reverse it cheaply, and does it touch the world outside our files?** If it cannot be reversed and it reaches outside, it is a human decision.

Typical examples:

- **Money:** buying, subscribing, raising a spending limit, signing a contract.
- **Public face:** a brand name, a public statement, anything customers will read as the company speaking.
- **Real data deletion:** removing customer records or backups that cannot be recovered.
- **Legal and compliance filings:** anything signed on behalf of the organisation.
- **Physical steps:** switching hardware, meeting someone, anything that needs a body.

Everything else should **not wait for a person**. This is the other half of the rule, and it matters as much. A fleet that asks you about every technical choice is not governed. It is slow. Naming the small list that is yours, and releasing the rest, is the discipline. Anthropic's [framework for safe and trustworthy agents](https://www.anthropic.com/news/our-framework-for-developing-safe-and-trustworthy-agents) makes a related point: people keep control, especially over high-stakes actions, while agents get room to work.

### Outcomes, not instructions

How do you direct a hundred sessions without writing a hundred scripts? You give them **outcomes**. The idea is old too. Military writers call it [mission command](https://en.wikipedia.org/wiki/Mission_command): tell subordinates what must be achieved and why, set the limits, and let them choose the method. An outcome has a **done-when** (how we will know) and **evidence to report** (what you will show). The method is theirs. You will learn to write these in lesson 5.

### Earlier decisions are hypotheses

Agents make decisions all day: they choose a library, shape a folder, write a rule. After a while, nobody remembers which choices were people's and which were agents'. A common mistake is to treat all of it as settled: "the document says so, so it must be right."

A governed system treats **earlier agent-made decisions as hypotheses**. Each one was a reasonable guess at the time. When new evidence arrives (a failing test, a customer complaint, a cost report), the decision is re-tested, and if it is wrong, it is replaced through a new recorded decision, not quietly edited. You keep the lessons from real incidents. You do not defend a rule only because it is written down. We will build the habit with decision records in lesson 3 and the retrospective in lesson 8.

### When not to orchestrate

Orchestration has a cost, and this track would be dishonest without saying so. In its write-up of [a multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system), Anthropic reports that in its data agents use about four times the tokens of a chat, and multi-agent systems about fifteen times, so the task must be valuable enough to pay for it. It also notes that many coding tasks have fewer parts that can truly run in parallel than research does. Its guide to [building effective agents](https://www.anthropic.com/engineering/building-effective-agents) gives the same advice: use the simplest design that works.

So the rule of thumb is: **do not orchestrate a task one agent can do well.** Orchestrate when the work is large, has independent parts, and the value pays for the cost.

## 3. Step by step: climb the ladder on purpose

### Step 1: Name the work

Pick one real piece of work, for example "the café sign-up page".

### Step 2: Place it on the ladder

Ask: Am I reading every answer (use)? Did I hand it over with a brief (delegate)? Are several sessions on it at once (orchestrate)? Are there written rules that stop them if they go wrong (govern)? Write your honest answer. Most people are on the first two rungs.

### Step 3: Find the bottleneck

Where do you wait, or where do you worry? Waiting on you means your span is too narrow. Worry means the rules are not enforced.

### Step 4: List what only a person may decide

Write the short list of irreversible, outside-the-files decisions for your product.

### Step 5: Write one rule and enforce it

Pick one thing no session should do. Write it as a rule with a reason. Make a machine stop it.

### Step 6: Record what you decided

One dated line in a decision log. Future you needs to know that this was a choice.

## 4. Worked example: TrailMug

TrailMug is fictional: reusable cups for cafés. Maya, the founder, has four open pieces of work: the café sign-up app, a new website for café owners, a return-tracking process, and a data-retention plan for the pilot.

Maya places each on the ladder.

| Work | Today | Problem | Next rung |
|---|---|---|---|
| Sign-up app | One agent, Maya reads every step (use) | She is the typist who reads | Delegate with a brief |
| Website | Two agents, no shared rules (accidental orchestrate) | They both changed the logo file | Orchestrate with owners and limits |
| Return tracking | One agent with a brief (delegate) | It once ran a command that deleted test data | Govern: a guard on deletion commands |
| Data retention | A person (Maya) | Fine: this is a human decision | Keep it human |

Her list of what only a person decides: spending anything, the TrailMug name and logo (public), deleting café records, and signing the data-processing agreement with her first café partner. Everything else is released to agents inside rules.

Her first rule: "No session pushes to the default branch. Work reaches it only through a merge request." The reason: "A reviewed, tested change is cheap to trust. A direct push is not." She enforces it in two places so that neither is a suggestion: a protected-branch setting on the host, and a hook in the agent tool (lesson 4). She records the decision in her log with the date.

She also notices she has been treating the earlier website agent's folder layout as final, because it "was in the repo". She writes it down as a hypothesis: "Layout chosen by an agent on 12 October. Test: does a new page take less than ten minutes to add?" It does not, so she changes it with a new recorded decision.

## 5. Working with AI agents on this

What to delegate: drafting the ladder table from your notes, finding where rules are missing, writing a first version of a rule in a format you specify, and checking your rules for vague words. What you must do yourself: decide the short list of human-only decisions, decide the reason behind each rule, and decide the budget.

A prompt you can adapt:

```text
Here is my list of current agent work (below). For each item, tell me which rung of
this ladder it is on: use, delegate, orchestrate, govern. Quote the line that shows it.
If you cannot tell, say "unclear" and ask one question. Do not suggest improvements yet.
```

How to check the output: compare each answer with the line it quotes. If the agent says an item is "governed", ask where the rule is written and what stops a session from breaking it. An answer without a file name is not evidence.

Disclose: add a line to your log such as "AI use: ladder table drafted from my notes; I decided the human-only list."

**Where this sits on the ladder.** This lesson is about rungs three and four, but its practice is rung two done well: you will hand a drafting task to one agent and verify it.

## 6. Common mistakes and how to avoid them

- **Orchestrating too early.** Running five sessions when one would do. Start with one, and add more when the work has independent parts.
- **Asking a person for every step.** This creates a narrow span and trains people to click yes. Replace the question with a rule.
- **Writing rules with no enforcement.** A rule in a document that nothing checks is a wish. Pair every rule with a mechanism.
- **A long list of human decisions.** If you keep forty decisions, you are the bottleneck again. Keep the irreversible few.
- **Trusting "done".** Ask for evidence every time.
- **Defending old decisions because they are written down.** Test them against what you now know.

## 7. Practice: start your command repository

**Deliverable:** a git repository `trailmug-command` (or a name for your own product) with a `README.md`, a `decisions/` folder and `.claude/settings.json`.

1. **Create the repository.** Run `git init trailmug-command`, create a `decisions/log.md` file.
2. **Place four pieces of work on the ladder.** Use a table like the one above in `README.md`. Be honest. You may use your own product instead of TrailMug.
3. **Write your human-only list.** Four to six items, each with one line saying why it cannot be undone cheaply.
4. **Write your first rule** in `README.md`, with a reason and the mechanism that enforces it.
5. **Prove one rule is a switch, not a suggestion** (needs a Claude Code account). Create a file `.env` containing the fake text `TRAILMUG_DEMO_KEY=not-a-real-secret`. Create `.claude/settings.json`:

```json
{
  "permissions": {
    "deny": ["Read(./.env)", "Read(./.env.*)", "Read(./secrets/**)"]
  }
}
```

   Start Claude Code in the folder and ask it to read `.env`. It cannot: the permission rule removes that action. Write in the log what happened. Never put a real secret in this file, then or later.
6. **Note the limit.** The rule above covers Claude's file tools, not every command that could print the file. Write one sentence on what else you would have to block. Lesson 4 closes this gap.
7. **Log one decision** with the date and your name.

Commit with a message such as `Start command repository: ladder, human-only list, first rule`.

**Check:** hand the README to a friend. Can she tell, for each piece of work, who or what is allowed to decide? If not, rewrite.

**Stretch:** find one earlier decision in a project of yours that nobody has tested, and write it as a hypothesis with the test that would confirm or replace it.

## 8. Checklist

- [ ] I can place any piece of agent work on the four rungs.
- [ ] I can explain span of control in one sentence.
- [ ] I can say why policy is better than asking each time.
- [ ] My human-only list is short and each item has a reason.
- [ ] My first rule has a reason and an enforcing mechanism.
- [ ] I proved a rule works by trying to break it.
- [ ] I logged at least one decision with a date.
- [ ] I recorded my AI use.

## 9. Further learning

Start with Anthropic's guide to building effective agents and its account of the multi-agent research system for the builder's view, and watch the talk from an Anthropic engineer for a one-hour summary. Anthropic's research on measuring agent autonomy shows how people actually extend trust over time, which is a good model for the evidence-first habit. The Wikipedia article on mission command gives the human background to writing outcomes, and Anthropic Academy's free Claude Code in Action course is a hands-on companion to the labs.

**Next:** the command chain. The next lesson in this track draws the structure that keeps every decider's span small (`/library/tracks/agent-orchestration/02-the-command-chain/`).
