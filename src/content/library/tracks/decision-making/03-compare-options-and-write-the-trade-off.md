---
title: "Compare options and write the trade-off down"
description: "Write your criteria before you look at the options, compare at least three choices including doing nothing, name the trade-off you accept and keep it all in a short decision record in git."
section: "Decision-making"
order: 3
track: "decision-making"
level: "core"
duration: "3 hours"
outcomes:
  - "Write criteria, with must-haves and nice-to-haves, before looking at the options"
  - "List at least three options, including doing nothing, and compare them with evidence"
  - "Think one step further: what each option sets in motion, and how easy it is to undo"
  - "Write the trade-off as one sentence: we choose X, so we accept Y"
  - "Write a decision record in git that a stranger can read in five minutes"
resources:
  - "adr/architectural-decision-records"
  - "cognitect/documenting-architecture-decisions"
  - "google-cloud/architecture-decision-records"
  - "atlassian/daci"
  - "atlassian/prioritization-frameworks"
  - "farnam-street/second-order-thinking"
  - "donella-meadows-project/leverage-points"
prerequisites:
  - "tracks/decision-making/02-ask-better-questions"
  - "template-decision-record"
updated: 2026-11-03
---

**Supports:** Developer, week 3 (Problems to epics), week 4 (Defend the roadmap) and the decision record in Master Developer Track B. **Time:** about 3 hours of reading and writing.

## 1. Why this matters

You know the problem and you have asked your questions. Now you must choose. Many people jump to their favourite option and then collect reasons for it. The record reads like a defence speech. It does not help the next person, or you when the choice turns out wrong.

A better habit is to separate three things that usually blur: what you need (criteria), what you could do (options) and how each option scores (the comparison). Write them in that order. Then write the part most people skip: the **trade-off**. Every real choice gives something up. A record that does not say what you gave up hides the cost.

You write it in git for a plain reason. Months from now someone asks "why did we do it this way?" It may be a new colleague, an agent starting a task or you. If the reason is in a file next to the work, the answer takes a minute. If it was in a meeting, it takes a week and may be wrong. Read [Git is the source of truth](/library/git-is-the-source-of-truth).

### The four questions for this lesson

1. **What do I decide here?** The criteria, which option wins, what I accept giving up, who signs and when I look again.
2. **What do I delegate to agents, and with what exact brief?** Checking my comparison for gaps, listing what each option sets in motion and summarising the record (section 5).
3. **How do I verify what comes back?** I compare every item to my evidence and criteria, and check the summary says only what the record says.
4. **Which other disciplines are involved?** Finance checks costs, operations checks who runs each option, legal and security check rules and data, support checks what customers will be told.

**Rung on the agent ladder:** from **use** to **delegate**. You hand an agent bounded tasks with a written brief, and you do the choosing.

## 2. Key ideas

### Criteria come first

**Criteria** are the tests an option must pass. Write them before you list the options, or you will bend them to fit your favourite. Take them from your problem statement and the test for solved you wrote in lesson 1.

Split them in two:

- **Must-haves** are gates. An option that fails a must-have is out, however good it is elsewhere. Example: "it must be allowed by the food-safety rules."
- **Nice-to-haves** are differences. They help you choose between options that pass the gates. Example: "it encourages quiet-hour visits."

Keep it short: three to five must-haves. A long list means you have not decided what matters.

### Options: at least three, and one is "do nothing"

A comparison of two options is usually your idea against a straw man. Look for at least three, and include these two:

- **Do nothing.** What happens if you take no action? This shows whether the problem is worth solving at all.
- **A small test.** A cheap version for a few weeks, then decide. It often wins when the choice is hard to undo.

Describe each option in one or two plain sentences.

### Compare with evidence, not with numbers that look exact

Make a table: options in rows, criteria in columns. In each cell write one of three marks, **meets**, **partly** or **fails**, and a short note on the evidence. Evidence can be a conversation, a rule, a price you checked or "not known yet".

Avoid decimals and weighted totals unless you can defend every number. A total of 7.4 against 7.1 looks scientific and hides guesses. To weigh criteria, say it in words: "Cost matters more than speed, because the budget is fixed." Guides such as RICE or value against effort, in the further learning list, help order long lists. For one decision with three or four options, a plain table is clearer.

### Look one step further

Every option changes how people behave, and their behaviour changes the result. This is called **second-order thinking**: ask not only "what happens?" but "and then what?" A simple way to write it is one line per option: "If we do this, people will probably..., which leads to...".

Some chains loop back on themselves. A reward paid for every swap may make cafés promote swaps, which means more swaps, more pay and more work at the busy hour. When an effect feeds back into its own cause, you have a **feedback loop**. Spotting loops is the start of systems thinking. The essay on leverage points in the list is a classic on where small changes in a system have large effects. It is dense; read it slowly after the lesson.

### How easy is it to undo?

You wrote this fact in lesson 1. For each option write "to undo this I must...". A choice you can reverse in a week needs less proof than one that locks in a contract or a public promise. If two options are close, prefer the one you can undo.

### Who decides, and who is told

A decision record names one person who decides. Many teams use DACI: a **d**river who runs the process, one **a**pprover who decides, **c**ontributors who advise and people who are **i**nformed. You do not need the whole method. Take the part that matters: one named approver. "The team decided" is not a name.

### The decision record

A **decision record** is a short file that says what you decided, and why. In software, the same idea is called an architecture decision record, or **ADR**, and it is defined in the [glossary](/library/glossary). The Dojo's [decision record template](/library/template-decision-record) is a longer, field-by-field form made for choosing an open source tool, with licence checks and fit scores. It is part of the Master Developer program. For a product decision you use the same bones in a shorter form:

| Part | What it says |
| --- | --- |
| Status | Proposed, accepted or replaced by a later record |
| Context | The problem, with a link to your problem statement |
| Criteria | Must-haves and nice-to-haves |
| Options | Each one in a sentence, including do nothing |
| Comparison | The table, with evidence |
| Decision | "We will..." in one or two sentences |
| Trade-off | "We choose X, so we accept Y" |
| Then what | What the choice sets in motion, good and bad |
| Not known | What you still do not know |
| Look again | A date or a sign that reopens the decision |
| Signed | A human name and a date |
| AI use | One line |

A record is **append-only**. Do not rewrite an accepted record to hide a mistake. If the decision changes, write a new record that replaces it and link the two. This is the same idea as [fix forward](/library/fix-forward).

## 3. Step by step

### Step 1: Write the criteria

Open `decisions/0001-<short-title>/record.md`. At the top, link the problem statement. Write three to five must-haves and a few nice-to-haves, taken from your problem and your test for solved. Do this before any option.

### Step 2: List three or more options

Write each in one or two sentences. Include "do nothing". Check that no two options are the same thing in different words.

### Step 3: Fill the comparison table

Mark each cell meets, partly or fails, with a note and its source. Write "not known yet" where true.

### Step 4: Remove the options that fail a gate

Cross them out and say why. If everything fails, your criteria or options are wrong. Go back.

### Step 5: Write what each remaining option sets in motion

One or two lines each: "people will probably...". Look for loops. Write "to undo this I must..." for each.

### Step 6: Choose, and write the trade-off

Pick one option. Write the decision in one or two sentences. Then write the trade-off: "We choose X, so we accept Y, and we give up Z." If you cannot name what you give up, you have not looked hard enough.

### Step 7: Say what is not known and when you look again

List the open questions from lesson 2 that remain. Write a date or a sign that reopens the decision, such as "after six weeks of the trial" or "if more than one café leaves".

### Step 8: Sign and commit

Write your human name and the date. Set the status to accepted only when you mean it. Commit the file in the same merge request as the work it affects.

## 4. Worked example: TrailMug

TrailMug is fictional, and all details are invented for the example.

The decision: "How do partner cafés get rewarded for washing and handing out TrailMug cups, in time to start the two-café trial?"

**Step 1, criteria (written first):**

- Must: allowed by the food-safety rules (the office replied in writing; invented answer: the café's normal dish-washing process is enough).
- Must: fits the founder's trial budget, which is fixed.
- Must: a counter worker can explain it in one minute.
- Nice: encourages quiet-hour visits.
- Nice: easy to change after the trial.

**Step 2, options:**

- **A. Flat monthly fee.** Each trial café gets the same fixed amount each month.
- **B. Payment per swap.** Each café gets a small amount for every cup swapped.
- **C. No payment, visibility only.** A window sign and a place on the TrailMug map.
- **D. Small flat fee plus visibility for the trial.** A low fixed amount, the sign and a quiet-hour promotion. The model is chosen after the trial.
- **E. Do nothing.** Ask cafés to join as volunteers.

**Step 3 and 4, the table (short notes):**

| Option | Gates | Quiet hours | Easy to change |
| --- | --- | --- | --- |
| A | meets all | partly | meets |
| B | budget: partly | fails | partly |
| C | meets all | meets | meets |
| D | meets all | meets | meets |
| E | meets all | fails | meets |

Her notes from lesson 2: one owner wants a fixed monthly amount; the other wants more quiet-hour customers. The accountant warned that a per-swap payment may push swaps into the lunchtime rush, and its cost grows with swaps. So B goes. E fails the quiet-hour test and ignores both owners, so it goes. C is attractive, but one owner asked for money, and she cannot learn whether money matters if she offers none.

**Step 5, what each option sets in motion:**

- A: cafés know what they get. If swaps surge, cafés may feel under-paid. To undo: change the fee for the next month.
- C: cheap. It may lose the owner who wants a fixed amount. To undo: add a fee later.
- D: tests both wants at once. It costs a little more. To undo: end the fee after the trial.

**Step 6, decision and trade-off:**

> We will run the two-café trial with option D: a small flat monthly fee, a window sign and a quiet-hour promotion.
>
> **Trade-off:** we choose a flat fee, so we accept that we pay cafés even if few swaps happen, and we give up learning how a per-swap payment behaves.

**Step 7, not known and look again:** how often swaps really happen; whether the food-safety answer holds for other cafés. Look again after six weeks of the trial, or at once if a café leaves.

**Step 8, signed:** the founder, with the date and a line, "AI use: an agent checked my table for blank cells and drafted the second-order list; I chose the option and wrote the trade-off."

A stranger can read this in five minutes.

## 5. Working with AI agents on this

The agent is useful once you have written the criteria and the first table. It is poor at the choice: it hears no owner's voice, faces no consequence for being wrong and tends to agree with the option you seem to prefer.

**What I decide:** the criteria and which are gates, the marks in the table, the option, the trade-off, who signs.

**What I delegate, with an exact brief.** Paste your `record.md` after this text:

```text
Below is a decision record that I wrote myself, in draft. I am the only
person who decides. Do not choose an option. Do not rewrite my text.
Do not add options, criteria or facts I did not write.
1. GAPS. Find blank cells, claims in the table without evidence, and any
   criterion that no option is compared against.
2. CONSISTENCY. Say where my "meets/partly/fails" marks disagree with my
   own notes, and quote both.
3. THEN WHAT. For each option still in the running, write three short
   "if we do this, people will probably..., which leads to..." lines. Mark
   each as "likely" or "possible". Say what evidence would show it is wrong.
4. UNDO. For each option, say what I would have to do to reverse it, using
   only what is in my text.
5. SUMMARY. Write five sentences for people who must be informed but did
   not read the record: what we decided, why, what we give up, what we do
   not know, when we look again. Use only what the record says.
If something is unclear, write "not sure". Answer under the five headings.
```

**How I verify what comes back.** I open the file and confirm each gap is real. If the agent is right about a mark, I fix it myself. The "then what" lines are model guesses; I test each against my conversations and keep those I can support. I read the summary next to the record: a summary can drift, add a reason I did not give or leave out the trade-off.

**Which disciplines are involved.** Finance checks the cost notes, operations says who runs each option on a busy day, legal and security check rule and data claims, support says what customers will ask. An agent does not speak for them.

**The line the agent must not cross.** It does not fill "Decision", "Trade-off" or "Signed", and only a person sets the status to accepted. A name on a record means someone is accountable. A model cannot be.

**Disclose.** Add one line to the record about what the agent did and what you checked. See [Disclose AI use](/library/disclose-ai-use).

**Where this sits on the ladder.** This is the **delegate** rung: whole tasks, a written brief, a result you check. When several agent sessions work on several decisions at once, you are orchestrating, and one shared file of criteria keeps them aligned. A rule in your repository, "a decision file may be merged only if a named person approves the merge request", is a first piece of governance. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the upper rungs.

## 6. Common mistakes

- **Writing criteria after seeing the options.** You bend them to fit the favourite. Write them first.
- **Two options only.** The second is a straw man. Find a third, and include do nothing.
- **Exact-looking scores.** Decimals hide guesses. Use meets, partly, fails, and evidence.
- **No trade-off.** If you cannot say what you give up, the record is a sales pitch.
- **Forgetting "and then what".** The first effect is rarely the last.
- **A committee as the decider.** Write one name.
- **Writing it after the work is done.** It becomes a story, not a decision.

## 7. Practice: a decision record

**Deliverable:** one file in your product's git repository: `decisions/0001-<short-title>/record.md`. Use the decision you framed in lesson 1 and questioned in lesson 2.

The file must contain:

1. A link to your problem statement and the date.
2. Criteria, with must-haves and nice-to-haves, written first.
3. At least three options, including do nothing, each in one or two sentences.
4. A comparison table with meets, partly or fails, and evidence in each cell.
5. Notes on what each remaining option sets in motion, and how to undo it.
6. The decision in one or two sentences, and the trade-off as "we choose X, so we accept Y".
7. What is not known, and the date or sign when you look again.
8. Your name, the date and a status.
9. An AI-use line.

Commit with a clear message, for example `Add decision record 0001`.

**Stretch:** run the agent brief in section 5. Save its answer as `decisions/0001-<short-title>/review-notes-record.md`, marking each item "kept", "rejected" or "checked", with a reason. Then ask someone from another discipline, such as finance, to find one thing missing from the record.

## 8. Checklist

- [ ] I wrote my criteria before I listed the options.
- [ ] Some criteria are must-haves (gates) and some are nice-to-haves.
- [ ] I have at least three options, including do nothing.
- [ ] Every cell in my table has a mark and evidence, or says "not known yet".
- [ ] I wrote what each remaining option sets in motion and how to undo it.
- [ ] The trade-off is written as "we choose X, so we accept Y".
- [ ] One named person decides and signs.
- [ ] I listed what is not known and when I will look again.
- [ ] The record is in git, linked to the problem statement.
- [ ] I recorded any AI use and checked every agent item.

## 9. Further learning

If you have time for two resources, read the short original post on decision records, then the Atlassian page on DACI and compare it with how you named the decider. The last lesson of the track shows how to brief an agent to prepare the options and the comparison, and how to judge what it gives you.
