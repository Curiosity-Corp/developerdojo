---
title: "Make sense of the evidence and decide"
description: "Cluster what you learned, grade the strength of your evidence, test your riskiest assumption cheaply and write a decision record that says what you will build, what you will not and what would change your mind."
section: "Product discovery"
order: 4
track: "product-discovery"
level: "core"
duration: "2 hours"
outcomes:
  - "Group interview notes into themes and write insights that cite evidence"
  - "Grade evidence as strong, medium or weak, and say why"
  - "Design a cheap, honest test for your riskiest assumption"
  - "Write a decision record with a clear call, a reason and a stop condition"
resources:
  - "nngroup/ux-research-cheat-sheet"
  - "nngroup/empathy-mapping"
  - "atlassian/minimum-viable-product"
  - "atlassian/prioritization-frameworks"
  - "gov-uk/how-the-alpha-phase-works"
  - "gov-uk/moderated-usability-testing"
  - "gitlab/handbook-product-principles"
prerequisites:
  - "week-1-see-the-whole-product"
  - "week-2-know-the-people"
updated: 2026-11-03
---

**Supports:** Developer, weeks 1 and 2 (turning discovery into personas, journeys and the first epics) and the Master Developer roadmap. **Time:** about two hours, plus the time to run one small test.

## 1. Why this matters

You now have a pile of material: a brief, a ranked list of assumptions, five sets of interview notes, a whole-product map and a list of alternatives. A pile is not a decision. Many teams stop here and "go with their gut", which means whichever note they read last wins.

This lesson is the step where discovery turns into action. You sort the evidence, judge how much you can trust it, run one cheap test where the risk is highest, and then **decide in writing**. The decision is the real product of discovery. Everything after it (epics, roadmap, issues, agent work) hangs from it.

For a Product Development Manager (PDM), this is where judgment shows. Agents can cluster text in seconds. They cannot tell you whether three enthusiastic commuters are enough to bet a quarter on, or whether the café owner who said no was the one who was right. That call is yours, and so is the responsibility for it.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What the evidence means, which risk to test, and whether to build, change, test more or stop | Clustering your own notes, drafting a test page for your review, summarising long public documents | Each insight cites real quotes; the test is honest; the decision matches the evidence, not your hopes | Finance (does the number work?), operations (can we deliver?), legal and privacy (may we?), design (does the test look trustworthy?) |

## 2. Key ideas

### From notes to themes to insights

Raw notes are specific: "C3 said the cup leaks in her bag." A **theme** groups similar notes: "Carrying a used cup is unpleasant." An **insight** says something you can act on and can be wrong about: "Commuters stop using reusable cups mainly because of what to do with the cup after the coffee, not because of the cost of buying one." An insight always names the evidence behind it.

A useful insight has three parts:

1. **Who:** the kind of person.
2. **What:** the behaviour or need you saw.
3. **Why we believe it:** the evidence, with person codes (C1, C3, C4).

If you cannot point to quotes, it is a guess, not an insight.

### Empathy maps help you sort

An **empathy map** is a simple four-box picture: what a person **says**, **thinks**, **does** and **feels**. NN/g describes it as an early step in design thinking. It is a quick way to organise one person's notes and to notice when what they said does not match what they did. Draw one per interview, then compare.

### Not all evidence is equal

Grade each insight honestly:

| Grade | What it looks like | How to act |
|---|---|---|
| **Strong** | Many people, different sources, backed by behaviour (what they did, paid, or tried) | Safe to build on |
| **Medium** | Several people agree, but mainly in words | Worth a cheap test |
| **Weak** | One or two voices, or only your guess | Treat as a question, not an answer |

Add a separate note for **contrary evidence**: everything that disagrees with your favourite idea. If you cannot list at least one, you were not looking.

### Cheap tests

Before you build, you can test the riskiest assumption with something smaller than the product. A few common patterns:

- **A landing page test.** A simple page that describes the offer and asks people to leave an email address or join a waiting list. Be honest: say it is not available yet. Never take money for something that does not exist.
- **A concierge test.** You deliver the service by hand to a few people. It does not scale, but it teaches you what customers truly value.
- **A paper or clickable prototype.** You show drawings and watch someone try to use them. The UK government service manual describes how a team uses prototypes and moderated sessions in its alpha phase.
- **A cost check.** You find out what the hard part really costs by asking a supplier or running a small trial.
- **A look at existing data.** Sales figures, search volumes or support messages that already exist.

A good test has four parts, written **before** you run it: the assumption, the test, what result would **support** the idea and what result would **stop** it. If you only decide what the result means afterwards, you will always read it your way.

### The smallest useful version

The **minimum viable product** (MVP) is the smallest thing that lets you learn from real customers. Atlassian's guide to MVPs explains the idea well. "Minimum" does not mean low quality. It means you leave out everything that does not help answer your biggest question yet.

### Decide in writing

A **decision record** is a short document with five lines:

1. **Decision:** what you will do.
2. **Reason:** the evidence behind it, with its grade.
3. **Not doing:** what you chose not to do, and why.
4. **Risks you accept:** and who accepted them.
5. **Stop or change if:** the result that would make you revisit this.

The fifth line is the one most people skip. It protects you from clinging to an idea after it has stopped working.

## 3. Step by step

### Step 1: Put every note in one place

Create `discovery/synthesis.md`. Copy the strongest quotes from each interview into a table with the person code beside each one. This is for your own use in git, so keep codes only, no names.

### Step 2: Cluster into themes

Read the quotes and group those that are about the same thing. Give each group a name that is a short sentence, such as "Used cups are unpleasant to carry." Five to eight themes is normal. Note how many people each theme comes from.

### Step 3: Write insights

For each of the three or four strongest themes, write an insight in the Who / What / Evidence form. Add a **contrary evidence** line. Then grade it: strong, medium or weak.

### Step 4: Revisit the assumptions

Open your ranked assumptions. For each, write what the evidence now says: **supported**, **contradicted**, **unclear**. Move the unclear and contradicted ones to the top. These are what you still need to learn.

### Step 5: Pick one riskiest assumption and design a cheap test

Choose the assumption that is both unclear and most damaging if wrong. Write the test card:

```text
Assumption: ...
Test: ... (what we will do, with how many people, over how long)
Support if: ...
Stop or change if: ...
Cost: ... (time and money)
Ethics check: ... (what we tell people; no payment for things that do not exist)
```

### Step 6: Run it and record the result

Run the test. Write exactly what happened, even if it is disappointing, and compare with the "support if" and "stop if" lines you wrote before. Do not move the goalposts.

### Step 7: Write the decision record

Using the five lines above, write the decision. Choose one of four outcomes: **build** (with a first slice), **change** (the idea, the user or the price), **test more** (with a named next test) or **stop**. Stopping a bad idea after two weeks is a success, not a failure. The Dojo [fix forward](/library/fix-forward) rule applies to products too: when evidence shows you were wrong, you steer forward with new facts instead of defending old plans.

### Step 8: Link the decision to your plan

Say which parts of your product map the decision touches. The gaps and unknowns you list here will feed the epics you write in the [roadmapping and epics track](/library/tracks/roadmapping-and-epics/).

## 4. Worked example: TrailMug

TrailMug is fictional; the numbers are illustrative.

**Synthesis (extract):**

| Theme | Who said it | Evidence type |
|---|---|---|
| Used cups are unpleasant to carry | C1, C3, C4, C5 | Behaviour: three stopped using their cup within a month |
| Commuters will not pay much extra | C2, C4 | Words |
| Café owners worry about hygiene rules | P1, P2 | Words, and a rule one of them quoted |
| Lunchtime counters are too busy for extra steps | P1, P3 | Words and observation |

**Insight 1 (strong):** "Commuters who own a reusable cup stop using it mainly because of the dirty cup afterwards. Evidence: C1, C3, C4 stopped within a month and named the same reason. Contrary: C2 never stopped, because she works next door to her café."

**Insight 2 (medium):** "Cafés will accept returned cups only if hygiene rules allow it and the swap is fast. Evidence: P1, P2, P3. Contrary: P3 said she would try it for a month."

**Assumption update:** "Commuters will pay a monthly fee" is **unclear** (only words). "Cafés will accept returned cups" is **contradicted** in two of three cases.

**The test card:**

```text
Assumption: Cafés will accept returned cups if the swap takes under 30 seconds
  and hygiene rules are met.
Test: A concierge test. The founder brings 20 clean cups to the one café
  that said yes, for two weeks, and counts swaps and staff comments.
Support if: at least 15 swaps and staff say the step is easy.
Stop or change if: fewer than 8 swaps or staff say it slows the line.
Cost: 20 cups, two weeks, no payment taken.
Ethics check: the café owner agreed in writing; customers are told it is a trial.
```

**Result (illustrative):** 11 swaps in two weeks, staff said peak hours were hard. That is below "support" and above "stop".

**Decision record:**

```text
Decision: Change the idea. Start with offices and a few quiet cafés near
  them, not busy city-centre counters. First slice: partner page and a
  simple returns process for two cafés.
Reason: the dirty-cup insight is strong; the delivery assumption is partly
  contradicted (grade: medium).
Not doing: any payment system or app features until the two-café trial works.
Risks accepted: the pool of cafés is smaller than hoped (accepted by founder).
Stop or change if: under 40 swaps a week across both cafés after six weeks.
```

The founder has changed her plan on evidence, written it down and said exactly what would change it again.

## 5. Working with AI agents on this

Synthesis is a task where agents help a lot, as long as you stay in charge of the meaning.

**Delegate:**

- **Clustering your own notes.** "Here are my interview notes with person codes. Group quotes into themes. For each theme list the person codes and the quotes you used. Do not paraphrase quotes."
- **Finding counter-evidence:** "From these notes, list every statement that contradicts the claim below, with the person code."
- **Drafting a test page** for a landing page test, which you then edit and which must tell the truth about what the product is and is not.
- **Summarising long public documents**, such as food-safety rules, so you can read the originals faster.

**Do yourself:**

- Write the insights and grade them.
- Choose the riskiest assumption and write the stop line.
- Decide the outcome and write the decision record.

**A brief you can adapt:**

```text
Below are my own interview notes. Each line starts with a person code.
Task 1: group lines into 5 to 8 themes. For each theme, list the person
codes and copy the supporting quotes word for word.
Task 2: for the claim "<my insight>", list every line that contradicts
or complicates it.
Do not add facts or quotes. Do not draw conclusions. If a line fits two
themes, show it in both. Output as two tables.
```

**How to check the output.** Spot-check at least five quotes against the original notes. Look for invented or "smoothed" quotes: models sometimes rewrite a quote into something neater. Check the person codes. Count how many people are really in each theme. If the agent grouped things differently from how you would, ask yourself why, and decide who is right.

**Where agents mislead.** They tend to overweight whatever appears most often in the text, even when one rare comment is the important one. They also state themes with more confidence than five interviews allow. Keep your own grade.

**Disclose.** Add to `synthesis.md`: "Clustering was done with an AI agent from my notes; I checked quotes and wrote the insights and grades myself."

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **delegate**, and shows the edge of it. Agents can sort and count evidence, but the decision stays yours. When several agents analyse different sources, you are orchestrating. A written rule such as "no finding without a quote" is the first piece of policy, and your check of it is a gate. The [agent orchestration track](/library/tracks/agent-orchestration/) covers the two upper rungs.

## 6. Common mistakes

- **Looking only for confirmation.** Always write the contrary-evidence line.
- **Counting enthusiasm as demand.** Behaviour (paid, tried, switched) is stronger than praise.
- **A test with no stop line.** If you did not decide what failure looks like, you will not see it.
- **Dishonest tests.** Never advertise a product that does not exist as if it did, and never take money for it.
- **Treating five interviews as a market study.** Say "pattern", not "percentage".
- **Burying the decision.** Write one page and put it at the top of the folder.
- **Deciding by whoever speaks loudest.** Weigh evidence, not volume.
- **Letting an agent write the insights.** It will give you fluent generalities that you cannot defend.

## 7. Practice: synthesis, one test and a decision record

**Deliverable:** three files in `discovery/` in your git repo.

1. `synthesis.md`: themes with person codes and quotes, three to four insights in the Who / What / Evidence form, each with a grade and a contrary-evidence line.
2. `test-card.md`: one test card for your riskiest assumption, written **before** you run the test, and a "Result" section added afterwards.
3. `decision-record.md`: the five-line decision, with the outcome (build, change, test more or stop).

If you cannot run the test yet, commit the card with the result marked "not run yet" and a date. Then run it and make a second commit.

**Check:** ask a friend to read your decision record and say what would make you change your mind. If they cannot tell, the stop line is too vague.

## 8. Checklist

- [ ] Every insight cites person codes and quotes.
- [ ] Every insight has a grade and a contrary-evidence line.
- [ ] I updated each assumption as supported, contradicted or unclear.
- [ ] My test card has a "support if" and a "stop if" line, written before the test.
- [ ] The test is honest and takes no money for things that do not exist.
- [ ] The decision record says what I will build, what I will not and what would change my mind.
- [ ] I checked an agent's clustering against my original notes.
- [ ] I recorded my AI use.

## 9. Further learning

The NN/g research cheat sheet helps you choose a method for your next question, and the NN/g empathy map article shows a simple way to organise notes. Atlassian's guides on MVPs and prioritisation frameworks give vocabulary for the "build the smallest useful thing" decision. The UK service manual pages on the alpha phase and moderated usability testing show how a government team tests ideas before committing. GitLab's public product principles are a real example of how one company writes down how it decides. Next, in the [personas and journeys track](/library/tracks/personas-and-journeys/), you turn your evidence into the people your product serves.
