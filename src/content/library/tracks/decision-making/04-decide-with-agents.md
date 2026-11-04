---
title: "Decide with agents"
description: "Brief an agent to prepare options and a comparison from evidence you supply, test what it returns with a written review, and make the decision yourself. The agent never decides."
section: "Decision-making"
order: 4
track: "decision-making"
level: "core"
duration: "3 hours"
outcomes:
  - "Write your own view before you ask an agent, so its answer cannot anchor you"
  - "Write a decision-support brief with evidence, criteria, limits and a ban on recommending"
  - "Triage every item the agent returns as kept, rejected or to check, with a reason"
  - "Attack your own lead option and test the agent's claims against sources"
  - "Update a decision record, name what changed and record the AI use honestly"
resources:
  - "anthropic/prompting-best-practices"
  - "anthropic/reduce-hallucinations"
  - "anthropic/define-success-criteria"
  - "anthropic/building-effective-agents"
  - "anthropic/ai-fluency-framework-foundations"
  - "atlassian/pre-mortem"
  - "farnam-street/circle-of-competence"
prerequisites:
  - "tracks/decision-making/03-compare-options-and-write-the-trade-off"
  - "disclose-ai-use"
updated: 2026-11-03
---

**Supports:** Developer, weeks 3 and 4, and the Master Developer review, where you defend your choices. **Time:** about 3 hours of reading and writing.

## 1. Why this matters

An agent can list ten options for a choice in under a minute, build a comparison table and argue both sides. That is a real gain. It also creates a new danger: because the output arrives fast and sounds sure, it is easy to accept it. A person who lets the agent choose has stopped being a manager. They have become a messenger.

The Dojo rule is simple. **The agent never decides.** It prepares, widens and attacks. You judge and you decide. A decision needs someone who is accountable, who knows things no prompt contains (what the owner said, what the budget really is) and who will live with the result. A model has none of those.

This lesson shows how to use the agent well for the preparation, and how to check its work so that the decision is still yours. It builds on the files you wrote in lessons 1 to 3: the problem statement, the question file and the decision record.

### The four questions for this lesson

1. **What do I decide here?** My own view, what evidence the agent may use, which criteria apply, which items I keep, and the decision itself.
2. **What do I delegate to agents, and with what exact brief?** Finding options I missed, building a first comparison from my evidence, arguing against my lead option and arguing for the others (section 5).
3. **How do I verify what comes back?** I label every item, check every fact against a source I open, and test whether the agent changes its answer when I ask differently.
4. **Which other disciplines are involved?** Finance checks numbers, legal and security check rules, operations checks feasibility, support checks what customers will hear.

**Rung on the agent ladder:** **delegate**. You hand a whole preparation task to an agent with a written brief, you keep the decision, and you check the result. Where it becomes orchestration and governance is in section 5.

## 2. Key ideas

### What agents are good at, and where they mislead

| Good at | Misleads by |
| --- | --- |
| Widening the option list | Offering generic options that fit any product |
| Arguing a case you did not think of | Agreeing with whichever option you seem to prefer |
| Doing sums from numbers you gave | Stating facts, rules and prices that it does not know |
| Finding gaps in a table | Sounding equally sure when it is guessing |
| Writing a clear first draft | Leaving out the cost of its own suggestion |

None of this is a reason to avoid agents. It is a reason to keep the criteria and the facts in your hands and use the agent for tasks where you can check the result.

### Write your own view first

If you read the agent's answer before you form a view, its answer becomes your starting point. This is called **anchoring**, and it is strong. So write your own view first: your options, which one you lean toward and why, in a short file, before you open the agent. Commit it. Now the agent's work is a test of your thinking, and the git history proves which came first.

### The brief supplies the evidence

An agent with no evidence fills the gaps from general knowledge. That is where invented facts come from. So give it a small **evidence pack**: your problem statement, your criteria, what you learned in your conversations with the dates, and the limits you work under. Tell it to use only that, and to mark anything else as an outside claim. The Anthropic pages on prompting and on reducing hallucinations, in the further learning list, describe the same moves: be clear and direct, give the material to work from, allow the model to say "I do not know", and ask it to point to the text behind a claim.

### Ban the recommendation

Tell the agent not to recommend an option. This is not a courtesy. If the output ends in "I recommend option D", you will read everything above it as leading to that. Ask for options, evidence and attacks. Keep the choice.

### Ask for the strongest case against, and for the others

Agents drift toward agreement. So ask for the opposite on purpose.

- **Against your lead option:** "Write the strongest honest case that this option fails."
- **For each rejected option:** "Write the strongest honest case that this option is best." This is called a steelman.

If your option survives both, you can trust it more. If a rejected option now looks good, find out why before you decide.

### Label every claim

Each item the agent returns belongs to one of four kinds. Make it label them, and check the labels.

| Label | Meaning | Your check |
| --- | --- | --- |
| From my pack | It comes from your evidence | Find the line |
| Public source | It cites a source | Open the source and read it |
| General knowledge | It is the model's own memory | Treat as a guess until checked |
| Guess | It says it is unsure | Use only to prompt a question |

An item with no label is the dangerous one. Send the output back and ask for labels.

### Test stability

Ask the same question a second time in a fresh session, with different words. If the answer flips, it is not reliable. This costs two minutes and catches a lot.

### Know your circle of competence

When the agent writes about a rule, a tax or a technical design outside what you understand, you cannot judge it. Do not accept it. Ask a person who knows, and use the agent's text only as a question for them. The Farnam Street article from lesson 2 gives the idea.

## 3. Step by step

### Step 1: Write your own view

Create `decisions/0001-<short-title>/my-view.md`. Write your options, your lean and your reasons, in a page at most. Commit it with a message such as `Add my view before the agent review`.

### Step 2: Build the evidence pack

Create `evidence.md` with four parts: the problem statement, the criteria (gates and nice-to-haves), what you heard in your conversations with dates, and the limits (budget, time, rules). Remove names and private details. Never paste secrets, personal data or private client material into an agent.

### Step 3: Write the brief

Use the brief in section 5. Fill in the options and the number of items you want. Save it as `agent-brief.md`, so the exact words are in git.

### Step 4: Run it in a fresh session

Start a new session with no earlier chat. Paste the brief and the evidence pack. Save the answer unedited as `agent-output.md`. Do not tidy it. A reviewer may want to see what the agent really said.

### Step 5: Triage every item

Open `review-notes.md`. For each item write: kept, rejected or to check, with one reason. For each claim of fact, open the source or ask the person who knows. Mark what you could not verify, and do not use it.

### Step 6: Run the attack

Ask for the case against your lead option and the case for each rejected option, in separate sessions where you can. Read them. Run your own pre-mortem on the lead option as well, as in lesson 2.

### Step 7: Compare with your own view

Put `my-view.md` and the triaged output side by side. What did the agent find that you missed? What did it get wrong? What did you keep that it argued against, and why? Write three to five lines.

### Step 8: Decide, record and disclose

Update `record.md`: change what the evidence changed, keep what it did not, and state the final decision and trade-off in your own words. Add what the agent did, what you checked and what you discarded. Commit the brief, the raw output, the review notes and the record together, and sign.

## 4. Worked example: TrailMug

TrailMug is fictional. The agent output below is invented to show the method.

The founder's lead option from lesson 3 is D: a small flat fee, a window sign and a quiet-hour promotion for the two trial cafés.

**Step 1, her own view,** committed first: "Lean D. Reason: tests both things owners asked for. Worry: six weeks may be too short to see fatigue."

**Step 2 and 3.** She builds the evidence pack from her files and writes the brief (see section 5) with her five options.

**Step 4, the output (extract, invented):**

1. An option F: let members add a small tip for the café when they swap. *Label: general knowledge.*
2. "A tip paid through TrailMug counts as a sale and needs a receipt in most places." *Label: none.*
3. Missing criterion: "survives staff changes", since new counter staff may not know the process. *Label: from my pack (staff turnover mentioned by one owner).*
4. Strongest case against D: "a flat fee does not react if swaps surge, and six weeks is short for noticing fatigue." *Label: guess.*
5. Strongest case for C: "the fee may attract cafés that care about money, not about the product." *Label: guess.*

**Step 5, her triage:**

| Item | Verdict | Reason |
| --- | --- | --- |
| 1, option F | To check | Interesting, but it adds a payment flow she has no evidence for. Parked as a later idea |
| 2, tip is a sale | Rejected for now | No label and no source. Sounds like a rule. She asks the accountant and does not use it until answered |
| 3, staff changes | Kept | Traces to a line in her notes. She adds a must-have and a one-page counter card for new staff |
| 4, against D | Kept | Her own worry too. She adds a check-in at week 3 |
| 5, for C | Rejected | Plausible, but contradicts what both owners said |

**Step 6, the attack and a second run.** In a fresh session, with different words, the agent again lists staff changes. It does not repeat the "tip is a sale" claim and instead says "not sure". Her note: "the claim in item 2 is unstable, so it stays out."

**Step 7, compared with her view.** The agent found one real gap, the staff card. It raised one claim she could not verify. It did not change her lean.

**Step 8, decision.** She keeps D, adds the counter card and a week-3 check-in, and writes in the record: "AI use: an agent proposed options and attacked D from my evidence pack on 3 November 2026 (brief and output are in this folder). I kept two items, rejected two and parked one. The tip claim is unverified and not used. I made the decision."

The decision is hers, and the trail shows how she reached it.

## 5. Working with AI agents on this

**What I decide:** my own view, what goes in the evidence pack, the criteria, which items I keep and the decision.

**What I delegate, with an exact brief.** Paste the evidence pack after the brief:

```text
You are preparing a decision for me. I will decide, not you. Do NOT
recommend an option and do NOT say which is best.
Below is my evidence pack: a problem statement, my criteria, what I heard
in conversations, my limits, and my current options. Use it as your main
source.
Do these five tasks and label them 1 to 5:
1. NEW OPTIONS. Up to three options I did not list. For each: one sentence,
   and the criteria it would fail.
2. COMPARISON. A table of all options against my criteria. For every cell,
   say "meets", "partly", "fails" or "not known", and name the line in my
   pack that supports it.
3. AGAINST. The strongest honest case that option [LEAD] fails.
4. FOR. For each other option, the strongest honest case that it is best.
5. MISSING. Criteria, people or facts my pack does not cover.
Rules: tag every claim as FROM PACK, PUBLIC SOURCE (give the link and quote
the line), GENERAL KNOWLEDGE, or GUESS. If you are not sure, say "not sure".
Do not invent rules, laws, prices or numbers. If a fact would matter and
you cannot support it, say so instead of stating it. Answer in numbered
lists and one table.
```

**How I verify what comes back.** I follow Steps 5 to 7. I open every public source and read the quoted line. I take every general-knowledge claim to a person or an official source before it is used. I check that each "from pack" line exists. I check the table against my own table, cell by cell. I run the stability test. I read the "missing" list as a to-do list, not as truth.

**Which disciplines are involved.** Finance checks every number. Legal and security check every rule and every data claim, because those are the claims an agent states most confidently and gets wrong most expensively. Operations says whether an option can be run. Support says what customers will be told. I ask them. The agent does not stand in for them.

**Disclose.** Put the brief and the raw output in the decision folder, and one line in the record: what the agent did, what I checked and what I discarded. See [Disclose AI use](/library/disclose-ai-use).

**The line the agent must not cross.** It does not choose, it does not fill the "Decision", "Trade-off" or "Signed" parts of the record and it does not set the status to accepted.

**Where this sits on the ladder.** This lesson is on the **delegate** rung. You can see the next rungs from here.

- **Orchestrate.** You run several sessions at once, for example one that steelmans each option, in fresh sessions that cannot see one another, so their arguments stay independent. You then read all of them. They need one shared evidence file, or they will argue from different facts.
- **Govern.** You write the rules in the repository so the habit holds when you are not watching: a decision record may be merged only after a named person approves the merge request, the status "accepted" can only be set by a person, and a pipeline check fails a record with no signature or no AI-use line.

The agent orchestration track (`/library/tracks/agent-orchestration/`) covers these rungs in depth.

## 6. Common mistakes

- **Asking before forming a view.** The answer anchors you. Write first, commit, then ask.
- **No evidence pack.** The agent fills gaps from memory, and invents.
- **Letting it recommend.** Once you read "I recommend", you cannot unread it. Ban it in the brief.
- **Accepting unlabelled claims.** A rule, price or law with no source is a guess in a confident voice.
- **Only asking for support.** Ask for the case against your lead option.
- **Editing the raw output.** Save it as it came. Review notes go in a separate file.
- **Using one session for everything.** Earlier answers colour later ones. Use fresh sessions.
- **Skipping people.** The agent cannot tell you what the café owner meant.
- **Pasting private data.** Remove names, secrets and personal details before sending.
- **Hiding the use.** Not saying you used an agent is a bigger problem than using one.

## 7. Practice: decide with an agent, and keep the trail

**Deliverable:** five files and an updated record in your product's git repository, in `decisions/0001-<short-title>/`. Use the decision from lessons 1 to 3.

1. `my-view.md`, committed **before** you run the agent. The commit history is the proof.
2. `evidence.md`, the pack you gave the agent, with no secrets or personal data.
3. `agent-brief.md`, the exact words you used, adapted from section 5.
4. `agent-output.md`, the unedited answer.
5. `review-notes.md`, with a verdict (kept, rejected or to check) and a reason for every item, the sources you opened and the result of your stability test.
6. An updated `record.md`, with a short "What changed after the agent review" section, an AI-use line and your name.

Commit with a clear message, for example `Add agent review and update decision record 0001`.

**Stretch:** run the lead-option attack and the steelman in separate fresh sessions, and write two lines on whether any of them changed your mind. Then ask a person from another discipline to read your review notes and tell you one claim you accepted too quickly.

## 8. Checklist

- [ ] I wrote and committed my own view before running the agent.
- [ ] The evidence pack holds only what I want the agent to use, with no secrets or personal data.
- [ ] The brief bans recommendations and demands labels on every claim.
- [ ] I saved the raw output unedited.
- [ ] Every item has a verdict and a reason in my review notes.
- [ ] I opened every source and checked every fact that mattered.
- [ ] I asked for the case against my lead option and tested stability.
- [ ] I compared the result with my own view and wrote what changed.
- [ ] The decision, the trade-off and the signature are mine.
- [ ] The record says what the agent did and what I checked.

## 9. Further learning

The resources below this lesson explain how to write clear briefs, how to cut down confident wrong answers and how to define what "good" means before you ask. If you have time for two, read the Anthropic page on reducing hallucinations and check which of its methods you used in your brief, then take the free AI Fluency course for a wider frame on delegating to AI and judging its output. When you are ready for the upper rungs, the agent orchestration track covers running several sessions and writing the rules that keep them safe.
