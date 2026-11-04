---
title: "Frame the problem"
description: "Turn a vague worry into one decision with an owner and a deadline, and write a problem statement that says who has the problem, what it is, why it matters and how you will know it is solved."
section: "Decision-making"
order: 1
track: "decision-making"
level: "core"
duration: "2 hours"
outcomes:
  - "Tell a symptom, a problem and a solution apart, and rewrite a solution as a problem"
  - "Write a problem statement with who, what, why it matters and where it happens"
  - "Write a test for solved: a sign you can see and a date you will look"
  - "Frame one decision with an owner, a deadline and a note on how hard it is to undo"
  - "Brief an agent to review your framing without letting it decide"
resources:
  - "atlassian/problem-framing"
  - "gov-uk/start-by-learning-user-needs"
  - "farnam-street/first-principles"
  - "anthropic/define-success-criteria"
  - "svpg/alternative-to-roadmaps"
  - "google/ml-problem-framing"
prerequisites:
  - "week-1-see-the-whole-product"
  - "tracks/product-discovery/01-frame-the-problem-and-the-idea"
updated: 2026-11-03
---

**Supports:** Developer, week 3 (Problems to epics) and the decision record in Master Developer Track B. **Time:** about 2 hours of reading and writing.

## 1. Why this matters

Most bad decisions are not bad because someone chose the wrong option. They are bad because the group never agreed what the problem was. One person thinks the problem is cost. Another thinks it is speed. A third thinks it is trust. They compare options for an hour, and each option wins on a different measure. Nobody is wrong, and nobody can decide.

This gets worse when agents do the building. An agent takes a vague request and produces something polished that solves a problem you never had. The first job of a Product Development Manager (PDM) is to make the problem small, clear and written down, so people and agents work on the same thing.

The [product discovery track](/library/tracks/product-discovery/) taught you to frame a whole product idea: a user, a problem, a measure and a date. This lesson works one level down. Inside every epic there are choices to make: how to charge, which partner to approach first, whether to build or to rent, what to leave out. Each one needs its own short framing. It takes about an hour and it saves the long argument.

### The four questions for this lesson

1. **What do I decide here?** What the problem is, who has it, what "solved" looks like, who owns the decision and when it is due.
2. **What do I delegate to agents, and with what exact brief?** A sceptical reading of your draft (section 5).
3. **How do I verify what comes back?** I check every flagged item against my notes and the people I spoke to.
4. **Which other disciplines are involved?** Finance, operations, legal, design and support each see the problem from a different side.

**Rung on the agent ladder:** **use**. You work with one agent, one step at a time, and you read every answer. Framing is yours. The agent only checks your writing.

## 2. Key ideas

### A decision is a choice with an owner and a deadline

A **decision** is a choice between two or more options, made by a named person, by a date, that changes what the team does next. If any of those parts is missing, you do not have a decision yet. You have a topic.

"We should think about payments" is a topic. "Who pays the partner cafés, and how, before we start the two-café trial on the first of next month?" is a decision. The second one has options, a date and an end.

Write down four small facts about every decision:

| Fact | Question to answer |
| --- | --- |
| Owner | Which one person decides? |
| Deadline | By what date, and what happens if it slips? |
| Cost of waiting | What do we lose each week without an answer? |
| How hard to undo | Can we change our mind next month, or are we stuck? |

The last fact matters most. A choice that is easy to undo should be made fast, with little study. A choice that is hard to undo deserves more questions, more people and a longer record. You will use this idea in every lesson of the track.

### Symptom, problem and solution

People often start a decision from the wrong place. There are three levels, and you need to know which one you are standing on.

- A **symptom** is what you see. "Two cafés asked what is in it for them."
- A **problem** is what is wrong underneath, in the words of the people affected. "Cafés carry the cost and the work of washing cups, and TrailMug has not said what they get back."
- A **solution** is a thing you could do. "Pay each café a monthly fee."

Beginners jump from the symptom straight to a solution, and the solution hides the other options. If your first sentence is "pay cafés a monthly fee", you will argue about the size of the fee and never ask whether cafés want money at all. Use the **swap test** from the discovery track: if you can replace your sentence with a different thing to build or do and it still makes sense, you wrote a problem. If swapping the thing breaks the sentence, you wrote a solution in disguise.

To move from a symptom to a problem, ask "why?" three or four times. Stop when the answer is something you could change.

### The four parts of a problem statement

A **problem statement** is a short paragraph that everyone can read and either agree with or disagree with. It has four parts. The same four questions appear in a free team exercise from Atlassian, listed in further learning:

1. **Who** has the problem? One kind of person or group, specific enough that you could meet them this week.
2. **What** is the problem? What they struggle with, with the signs that you have seen. Say what you saw, not what you assume.
3. **Why** does it matter? What happens to them, and to the product, if nobody solves it?
4. **Where** and when does it happen? In which situations does it appear, and in which does it not?

Two to four sentences is enough. A short statement makes disagreement visible, which is the point.

### A test for "solved"

A problem statement is not finished until it says how you will know it is solved. This is the cousin of acceptance criteria. Write one sign you can **see**, and a date you will **look**.

Good signs are observable. "Both trial cafés are still running swaps after six weeks, and each owner says in a short written check-in that the effort is worth it" is observable. "Cafés feel valued" is not, because two people can disagree about whether it happened.

Be careful with numbers. Use one only if you can collect it by the date. Otherwise write a plain sign. A made-up target gives false comfort.

## 3. Step by step

### Step 1: Name the decision

Open a new file `decisions/0001-<short-title>/problem.md`. On the first line write the decision as a question with a date: "Who pays the partner cafés, and how, before the trial starts?"

If you cannot write it as a question, keep asking "what exactly must we choose?".

### Step 2: Write the four facts

Under the question, write the owner (one name), the deadline, the cost of waiting and how hard the decision is to undo. Say "I do not know yet" where that is true. It becomes a question for lesson 2.

### Step 3: Collect the symptoms

List what you have actually seen or heard. One line each. Mark the source: "heard from a café owner", "saw in the trial notes", "my guess". A guess is allowed, but say it is a guess.

### Step 4: Ask why until you can act

Pick the symptom that worries you most. Ask "why does this happen?" and write the answer. Ask again about the answer. Stop when you reach something you could change or test. Keep the chain in the file.

### Step 5: Write the problem statement

Write two to four sentences with who, what, why and where. Read it aloud. If it contains a thing you could build or buy, it is a solution. Rewrite it around the struggle.

### Step 6: Write the test for solved

Add one line: "We will know this is solved when [sign you can see] by [date]." Then add one line for what would show you were wrong about the problem itself.

### Step 7: Say what is out of scope

Write two or three things this decision will **not** settle. Scope keeps a decision small enough to make. "This decision does not set the member price" is a useful line.

### Step 8: Read it to one person

Ask one colleague or mentor to read the file and write down every question. Do not defend. Write the questions down. They feed lesson 2.

## 4. Worked example: TrailMug

TrailMug is fictional. Every number below is invented for the example.

The founder has a roadmap with a café partner epic. In the order-of-epics work, that epic depends on a "decision on café payment". She has been saying "we need to sort out café payments" for three weeks. Nothing has moved.

**The topic, as she first wrote it:** "Sort out café payments."

**Step 1, the decision as a question:** "How do partner cafés get rewarded for washing and handing out TrailMug cups, in time to start the two-café trial?"

**Step 2, the four facts:**

| Fact | Answer |
| --- | --- |
| Owner | The founder |
| Deadline | The first of next month, when the trial starts |
| Cost of waiting | The trial cannot start, and the two cafés may lose interest |
| How hard to undo | Fairly easy during the trial, harder after other cafés sign the same terms |

**Step 3, the symptoms:**

- Two cafés asked "what is in it for us?" (heard in conversations).
- One owner said washing cups at lunchtime is "a lot to ask" (heard).
- The founder fears cafés will drop out after a week (guess).

**Step 4, why chain:**

- Why did the cafés ask what is in it for them? Because TrailMug asks them to wash and store cups, and gives nothing back yet.
- Why does that matter? Washing is work at the busiest hour, so each café pays in time and in counter space.
- Why is it unsolved? Because nobody has written what TrailMug offers a café in return.

She stops here. "What TrailMug offers a café" is something she can change.

**Step 5, the problem statement:**

> Owners of small cafés near offices, who would host TrailMug cups, carry the time and counter space that washing and handing out cups costs. Two owners have asked what they get in return, and one called the lunchtime work "a lot to ask". If TrailMug does not say what a café gets back, cafés will not join, and members will have nowhere to swap. This matters most at lunchtime, when counters are busiest. It does not matter much at quiet hours.

Notice what she did not write. She did not write "pay cafés a monthly fee". That is one possible answer. The statement leaves room for several: money, more customers, less work, or something else.

**Step 6, the test for solved:**

> We will know this is solved when both trial cafés are still running swaps six weeks after the start, and each owner says in a short written check-in that the effort is worth it. We would know we framed the problem wrongly if a café leaves for a reason other than cost or effort, for example hygiene rules.

**Step 7, out of scope:** the member price, the cup design and any plan beyond the two trial cafés.

**Step 8, the reader:** a friend who runs a restaurant says: "You wrote 'what they get back'. Back from whom, and when? Some owners want money each month; some want a sign in the window. Did you ask?" The founder realises she has not. That question goes onto her list for lesson 2.

She now has a decision a person can make and a problem the team can read in under a minute.

## 5. Working with AI agents on this

Framing is **your** thinking. An agent cannot know what you heard in a café or what you are willing to give up, and it tends to agree with a confident paragraph. If you ask it to frame the problem, you get something that sounds right and belongs to nobody. It is useful as a sceptical reader after you have written your own draft.

**What I decide:** the decision, its owner and deadline, the problem statement, the test for solved, what is out of scope.

**What I delegate, with an exact brief.** Paste your finished `problem.md` after this text:

```text
You are a sceptical reviewer. Below is a problem statement and a decision
frame that I wrote myself. Do not rewrite them. Do not suggest solutions.
Do not tell me what to decide.
1. List every word or phrase that two people could read differently.
2. Say which sentences describe a solution instead of a problem.
3. List facts I state that I may not have evidence for, and what evidence
   would show each one is false.
4. Say whether the "solved" test is something a person could observe and
   date, and where it is not.
5. List up to five questions a person affected by this problem would ask me.
Answer as a numbered list under these five headings. If you are not sure,
say "not sure". Do not invent facts about my product.
```

**How I verify what comes back.** I go through each item against my own notes. I cross out anything generic that could be said about any problem. I check every claim of fact against its source, because a model can state a wrong fact in a confident voice. I take the list of questions to a real affected person and see whether they ask the same things. The agent's list is a prompt, not a result.

**Which disciplines are involved.** Finance asks about the cost of waiting. Operations asks who feels the problem on a busy day. Legal and security ask whether rules apply. Design and support ask how it feels from outside. I ask each: "What do you see in this problem that I did not write?" An agent cannot answer that for me.

**Disclose.** Put a line at the bottom of the file: "AI use: sceptical review of the framing on 3 November 2026, using the brief in this file. I wrote the framing and chose which comments to keep." Read [Disclose AI use](/library/disclose-ai-use) for the wording.

**Where this sits on the ladder.** This lesson is on the **use** rung: one agent, one step, and you read every answer. Do not delegate the framing itself. When you later frame many decisions in parallel with several agent sessions, you are orchestrating, and you will need one shared file of definitions so that every session uses the same words. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the upper rungs.

## 6. Common mistakes

- **Writing a solution and calling it a problem.** "Pay a monthly fee" is an answer. Use the swap test.
- **Framing the decision with no owner.** "We will decide" means nobody will. Write one name.
- **No date.** A decision with no date drifts. Write the deadline and what you lose by waiting.
- **A problem about "everyone".** Name a person you could meet this week.
- **Stating guesses as facts.** If you cannot say how you know, mark it as a guess.
- **A "solved" test nobody could check.** "People are happier" cannot be seen. Pick a sign and a date.
- **Making up a target number.** If you cannot collect the number by the date, do not write it.
- **Framing too wide.** "Fix the café relationship" is a year of work. Cut it until one person can decide in a few weeks.
- **Letting an agent frame it.** The result will be fluent and generic. You will not be able to defend it.

## 7. Practice: frame one real decision

**Deliverable:** one file in your product's git repository: `decisions/0001-<short-title>/problem.md`.

Choose a real decision that your own product faces. If you do not have a product yet, use the TrailMug café reward decision, but write your own version with different details, not a copy of the example above.

The file must contain:

1. The decision as a question, with owner, deadline, cost of waiting and how hard it is to undo.
2. Your list of symptoms, each with its source marked.
3. Your why chain, from a symptom to something you could change.
4. The problem statement (two to four sentences: who, what, why, where).
5. The test for solved, and one line on what would show you framed the problem wrongly.
6. Two or three things that are out of scope.
7. An AI-use line at the bottom, even if it says "none".

Commit with a clear message, for example `Add problem statement for decision 0001`.

**Stretch:** run the sceptical review brief from section 5. Save the answer in `decisions/0001-<short-title>/review-notes-framing.md`, and add two short sections: "What I changed and why" and "What I ignored and why". Then ask one person from another discipline, such as finance or operations, to read the statement and add the questions they would ask.

## 8. Checklist

- [ ] My decision is written as a question with one owner and a date.
- [ ] I wrote the cost of waiting and how hard the decision is to undo.
- [ ] I listed symptoms and marked which are heard, seen or guessed.
- [ ] My why chain ends at something I could change.
- [ ] My problem statement has who, what, why and where, in plain words.
- [ ] The statement contains no solution in disguise (I used the swap test).
- [ ] The test for solved is a sign a person can see, with a date.
- [ ] I wrote what is out of scope.
- [ ] One other person read it and I kept their questions.
- [ ] I recorded any AI use in the file.

## 9. Further learning

If you have time for two resources, run the Atlassian problem framing exercise with a colleague on your own statement, then read the GOV.UK page on starting from user needs to practise describing the need in the words of the person who has it. The next lesson takes the questions you collected in step 8 and turns them into a plan for learning what you still do not know.
