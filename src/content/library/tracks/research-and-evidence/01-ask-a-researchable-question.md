---
title: "Ask a researchable question"
description: "Turn a loose topic into a question that a decision depends on, that evidence can answer, and that has a clear stop rule. Write it on a question card in git before any agent starts searching."
section: "Research and evidence"
order: 1
track: "research-and-evidence"
level: "foundation"
duration: "2 hours"
outcomes:
  - "Tell a topic, a claim and a research question apart"
  - "Write a question that is clear, focused, open and answerable with evidence you can reach"
  - "Say which decision the answer will change and what a good enough answer looks like"
  - "Write a question card in git and brief an agent to critique it"
resources:
  - "university-of-illinois-library/find-and-develop-a-research-question"
  - "mit-ocw/crafting-research-questions"
  - "gov-uk/how-the-discovery-phase-works"
  - "gov-uk/start-by-learning-user-needs"
  - "nngroup/ux-research-cheat-sheet"
  - "product-talk/product-discovery-basics"
prerequisites:
  - "week-1-see-the-whole-product"
  - "disclose-ai-use"
updated: 2026-11-03
---

**Supports:** Developer, week 1 (the assumptions in your product brief) and week 3 (every epic needs a reason). In the Master Developer program it supports the evidence behind your decision records. **Time:** about two hours.

## 1. Why this matters

You can ask an AI agent almost anything and get an answer in seconds. That is the problem. A vague question gets a fluent, vague answer, and fluent answers feel true. If you ask "Is the reusable cup market good?", an agent will write you three confident paragraphs. You will not know what "good" means, for whom, or where it looked.

The question is the cheapest part of research and the part that decides everything after it. A good question tells you where to look, what to ignore and when to stop. A bad one lets you read for a week and end with a pile of facts that decide nothing.

For a Product Development Manager (PDM) this is a decision skill, not a school skill. Time and money go where your questions point. Agents are a fast workforce for searching and reading. They cannot tell you which question is worth the spend. They will happily research the wrong one, very fast.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which decision needs evidence, the exact question, what a good enough answer is, and when to stop | Critiquing your question, listing what is unclear, suggesting kinds of source and sub-questions | Every suggestion links back to your decision; no "facts" from the agent enter the card | Finance (what is it worth to know?), legal and privacy (may we collect this?), design (do we need people, not documents?) |

## 2. Key ideas

### A topic, a claim and a question are different things

- A **topic** is an area: "reusable cups".
- A **claim** is a statement that may be true or false: "Reusable cups reduce waste." You do not research a claim by looking for support. You turn it into a question and look at both sides.
- A **research question** asks something specific that evidence can answer: "In which ways do cafés in our pilot area handle returned cups today, and what does each way cost them?"

Many university library guides teach the same step. A topic is a broad area; a research question is a focused version of it. If the question is too broad, you drown. If it is too narrow, you find nothing and have to widen it. Aim for the middle: focused enough to answer, open enough that the answer is not already in the question.

### A question needs a decision

Ask first: **what will I do differently depending on the answer?** If nothing changes, it is curiosity, not research. Curiosity is fine, but it is not a project. Write the decision beside the question. For example: "The answer decides whether we start the pilot in offices or in student areas."

### Four kinds of question

| Kind | Looks like | Example |
|---|---|---|
| Describe | What is it like now? | How do cafés handle returned cups today? |
| Compare | Which is better, for whom? | Do deposits or subscriptions suit small cafés better? |
| Explain | Why does it happen? | Why do people stop using a reusable cup? |
| Predict | What will happen if we act? | Would this café use a returns box? |

The kind tells you the evidence you need. Describing needs records and observation. Comparing needs the same measure on both sides. Explaining is hard from documents alone, so ask yourself if you also need people. Predicting is the weakest: documents show what happened elsewhere, not what will happen to you. Run a small test (see [Make sense of the evidence and decide](/library/tracks/product-discovery/04-make-sense-of-evidence-and-decide)).

### Scope: who, where, when

The quickest way to narrow a question is to limit it by **who** (which people or businesses), **where** (which place) and **when** (which period). "Cafés" becomes "independent cafés in our pilot district". "Ever" becomes "in the last three years". Say the limits out loud on the card, so that a reader knows what you did not look at.

### Researchable means reachable

A question is researchable only if you can reach evidence for it with the time, money and permission you have. Some questions are good but out of reach. "How much waste does each cup create in a year across the country?" may need data you cannot get. When that happens, shrink the question or change it into one you can reach.

### A good enough answer and a stop rule

Before you search, write two lines:

1. **Good enough answer:** what would let me make the decision? ("Two or more independent sources that agree on how the returns process works, and one that gives a cost.")
2. **Stop rule:** when do I stop? ("After two hours of searching, or when new sources only repeat what I have.")

Without these, research has no end. You also protect yourself from a quiet bias: if you decide what counts as an answer *after* you see the results, you will pick the one you like.

### Primary and secondary evidence

A **primary source** is a first-hand record: a law, a price list, a data table, an interview, your own test. A **secondary source** is someone's report about primary material: a news story, a blog, a review article. Both are useful, and you must know which one you hold. Lesson 2 covers this in detail. On the question card, write which kind you expect to need.

## 3. Step by step

### Step 1: Name the decision

Write one sentence: "I need to decide ___." Keep it about an action, such as "where to run the first pilot" or "whether to claim X on the website".

### Step 2: Write the topic and your first guess

Write the topic in a few words. Then write what you *think* the answer is. This is useful: it shows your bias, and you can check at the end whether the evidence moved you.

### Step 3: Narrow by who, where and when

Add limits until the question could be answered in a few hours of work. If you cannot say what you would read first, it is still too broad.

### Step 4: Write it as a question

Use a question word: what, how, which, why. Avoid yes or no questions ("Is it good?"), which hide the details. Avoid questions with the answer inside ("Why is the pilot a great idea?").

### Step 5: Test the question

Check five things. Is it **clear** (could two people read it the same way)? **Focused** (one thing, not three)? **Open** (can the answer surprise you)? **Answerable** (is there evidence in the world)? **Reachable** (can you get it, legally, in your time)? If one answer is no, rewrite.

### Step 6: Write the good enough answer and the stop rule

Use the two lines above.

### Step 7: List where you will look and what you expect to find

Name two or three kinds of source: public statistics, official guidance, scholarly articles, reports from organisations, the websites of competitors, your own notes. Say if you also need people. If so, plan interviews with the [Talk to customers](/library/tracks/product-discovery/02-talk-to-customers) method.

### Step 8: Save the question card in git

Create `research/questions/Q01-<short-name>.md` and commit it **before** the research starts. A dated commit proves what you asked and when. The commit message should say what the card is for.

```markdown
# Q01: Returned cups in the pilot district

Decision this feeds: Where to run the first TrailMug pilot.
Question: How do independent cafés in the pilot district handle returned
cups today, and what does each way cost them in staff time?
Kind: describe
Limits: independent cafés only; district X; current practice
My first guess: most cafés have no process and would need one.
Good enough answer: three or more cafés described, one cost figure with a
source, and one rule or guideline about handling returned cups.
Stop rule: two hours of searching, or when sources repeat.
Expected evidence: local rules, café websites, trade guidance, interviews.
Created: 2026-11-03
AI use: none yet
```

## 4. Worked example: TrailMug

TrailMug is fictional; every number here is an invention for teaching.

The founder starts with a topic and a hunch: "Reusable cups are the future. Let me research the market." She asks an agent: "Tell me about the reusable cup market." She gets a long, polished answer. It has market growth words, a few company names and no sense of her decision. She cannot use it.

She tries the steps instead.

- **Decision:** where to run the first pilot: office areas or student areas.
- **Topic:** reusable cups in cafés.
- **First guess:** offices, because workers visit the same café every day.
- **Narrowed:** independent cafés, one district, current practice.
- **First question draft:** "Why is the office area a good place for a pilot?" This has the answer inside it. She rewrites.
- **Question:** "How do independent cafés in the two candidate districts handle returned or personal cups today, and what stops them from accepting a shared cup?"
- **Kind:** describe, with a little explain.
- **Test:** clear yes; focused no, there are two parts. She splits them into Q01 (current practice) and Q02 (barriers). Open yes. Answerable yes. Reachable yes, because food-safety guidance is public and she can visit cafés.
- **Good enough answer:** three cafés per district described, the main hygiene rule found in an official source, and one source for what the work costs the staff.
- **Stop rule:** a week at one hour per day, or when the cafés start to repeat each other.

Look at what changed. The question names a place, a kind of business and a decision. It tells the founder to look for an official rule and a cost. It would also let a stranger say, afterwards, "You did not find the cost, so the pilot choice is still unproven." That is exactly what an honest question card should allow.

## 5. Working with AI agents on this

**What the PDM decides.** The decision, the question, the good enough answer and the stop rule. These are yours. If an agent writes them for you, you do not own the research.

**What you delegate, and the exact brief.** Hand the agent one bounded task: *criticise* your question. Do not ask it to answer it yet.

```text
You are helping me sharpen a research question. Do not answer it.
Here is my card (pasted below).
Task 1: list every word in the question that two people could read
differently.
Task 2: say whether the question is too broad, too narrow, or about right,
and why, in two sentences.
Task 3: list up to five sub-questions that would help answer it. For each,
say what kind of source would answer it (law, statistics, article, interview,
company page).
Task 4: list up to three ways I might be biased by my first guess.
Rules: do not state any fact about the real world. Do not name any source,
author, statistic or link. If you are unsure, say so.
Output: four short numbered lists.
```

The last rule matters. You are using the agent as a critic of your *thinking*, so it should not bring facts into the card. The moment an agent offers "a study shows...", you have left the safe zone, and everything it says must be checked as in lesson 2.

**How you verify.** Read each point and ask: does it connect to my decision? Accept what makes the question sharper and reject the rest. Check the sub-questions one by one: is each one answerable, reachable and useful? Check that no names, numbers or links slipped in. If they did, delete them or put them on a "to verify" list. Write down what you accepted and what you rejected in a few lines under the card. That note is part of your review record.

**Which disciplines are involved.** Finance tells you how much a good answer is worth. Legal and privacy tell you if you may collect the data, and what you may paste into an agent: never paste private customer details or non-public contracts. Design or user research says whether documents are enough or whether you need to watch people.

**Where this sits on the ladder.** You **use** an agent here: one agent, one step, your hands on the question. The next rung is **delegate**: in lesson 2 you hand the agent a whole research task with a written brief, and your checks become the acceptance criteria. When you give separate questions to several agents at once, you are **orchestrating**, and then each agent needs its own question card, so that two agents do not answer slightly different questions. A written rule like "no agent starts without a card in git" is a first piece of **governing**.

**Disclose.** If an agent helped, add one line to the card: "AI use: critique of the question by an agent; I decided the question, the answer standard and the stop rule." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Starting with the answer.** "Why is X great?" is a sales line, not a question. Ask what is true, not what supports you.
- **Too broad.** If you cannot say what you would read first, narrow it by who, where or when.
- **Two questions in one.** Split them. One card per question keeps the evidence tidy.
- **No decision.** Research with no decision attached never ends and never helps.
- **Moving the finish line.** Write the good enough answer before you search, not after.
- **Asking an agent to "research it".** An open request makes the agent choose the question, the sources and the stop point for you.
- **Letting the agent add facts to the card.** Use it as a critic, not as a source.
- **Treating a topic you like as a researchable question.** Check that the evidence exists and you may reach it.

## 7. Practice: one question card and a critique

**Deliverable:** two files in `research/questions/` in your git repository.

1. `Q01-<short-name>.md`: your question card, using the template above, with the decision, the question, the kind, the limits, your first guess, the good enough answer and the stop rule. Commit it before you do any searching.
2. `Q01-review.md`: the brief you gave an agent, a short list of what you **accepted** and what you **rejected** from its critique, with a reason for each, and the rewritten question if you changed it. End with the AI-use line.

Use your own product, or TrailMug if you do not have one yet. Make a second commit after the review.

**Check:** give the card to a friend. Ask them to say the decision, the question and the stop rule in their own words. If they cannot, the card is not clear yet.

## 8. Checklist

- [ ] The card names a decision that the answer will change.
- [ ] The question is clear, focused, open, answerable and reachable.
- [ ] It says who, where and when, so a reader knows what is left out.
- [ ] I wrote my first guess, so I can see my own bias later.
- [ ] I wrote a good enough answer and a stop rule before searching.
- [ ] I committed the card before the research began.
- [ ] The agent criticised the question and did not bring in facts or sources.
- [ ] I recorded what I accepted and rejected, and my AI use.

## 9. Further learning

A university library guide from Illinois shows how to move from a topic to a question and how to fix one that is too broad or too narrow. The MIT OpenCourseWare seminar on crafting research questions is written for doctoral students, so skim its syllabus to see the kind of questions researchers ask of their own questions. The UK government's service manual describes a discovery phase and how to start from user needs, which shows a public team deciding what to learn first. The NN/g cheat sheet helps you choose a method once you know the kind of question you have. Next, in [Find and judge sources](/library/tracks/research-and-evidence/02-find-and-judge-sources), you go looking and learn what to trust.
