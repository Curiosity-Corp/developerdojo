---
title: "Frame the problem and the idea"
description: "Turn a loose idea into a short written brief with a user, a problem, a measure and a date, and list the assumptions that must be true before you spend months building."
section: "Product discovery"
order: 1
track: "product-discovery"
level: "foundation"
duration: "90 min"
outcomes:
  - "Write a one-paragraph product idea that names a user, a problem, one number and a date"
  - "Tell a problem from a solution, and rewrite a solution as a problem"
  - "List your assumptions and rank them by risk"
  - "Write a brief an AI agent can research from, without letting it decide for you"
resources:
  - "atlassian/product-discovery"
  - "atlassian/product-brief"
  - "gov-uk/how-the-discovery-phase-works"
  - "youtube-nngroup/are-you-doing-real-discoveries"
  - "nngroup/design-thinking-101"
  - "atlassian/minimum-viable-product"
prerequisites:
  - "developer-path-overview"
  - "week-1-see-the-whole-product"
updated: 2026-11-03
---

**Supports:** Developer, week 1 (See the whole product). **Time:** about 90 minutes of reading and writing.

## 1. Why this matters

A product starts as a sentence in someone's head. "People need an app for X." "Cafés should offer Y." The sentence feels clear because you know what you mean. Other people hear something different, and an AI agent will happily build whichever version it guesses.

That is the central risk of the new way of working. Agents build fast. If the idea is vague, they build the wrong thing fast, and you pay for it in rework, in wasted weeks and in a product nobody wants. **Speed multiplies whatever direction you point it in.** So the first job of a Product Development Manager (PDM) is to make the direction clear and honest.

Framing is the act of writing the idea down so precisely that someone else can disagree with it. You do it before you build, and you redo it whenever you learn something new. It takes an hour, and it saves months.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which user, which problem, which number, which date | Drafting questions, finding public facts, listing similar products | Every fact has a source; every guess is marked as a guess | Finance (can the number work?), operations (can we deliver?), legal and privacy (may we do this?) |

## 2. Key ideas

### A product idea has four parts

Write the idea as one paragraph that holds four things:

1. **A user.** One kind of person, described so you could recognise her on the street.
2. **A problem.** Something that person struggles with today, in her words, not yours.
3. **A measure.** One number that tells you the idea is working.
4. **A date.** When you will check that number.

If any part is missing, the idea is a wish. "We help people live better" has no user, no problem, no number and no date. Nobody can disagree with it, which means nobody can learn from it.

### Problem versus solution

A **solution** is a thing you could build: an app, a website, a subscription, a chatbot. A **problem** is something a person struggles with. Beginners write solutions and call them problems.

| Sounds like a problem, is a solution | Real problem |
|---|---|
| "People need a loyalty app." | "Regular customers feel unnoticed, so they drift to the shop next door." |
| "Cafés need a dashboard." | "Café owners cannot tell which promotions bring people back." |
| "We need an AI chatbot." | "New members wait two days for an answer to a simple question." |

Test: if you can replace your sentence with a different thing to build and it still makes sense, you wrote a problem. If swapping the thing breaks the sentence, you wrote a solution in disguise.

### Assumptions are your real risk

Every idea hides **assumptions**: things you believe but have not checked. "Commuters will pay a monthly fee." "Cafés will accept returned cups." "Customers will remember to bring a cup back." Some assumptions are safe. A few are deadly. If one of the deadly ones is false, the whole product fails.

The aim of discovery is not to prove you are right. It is to find the deadly assumptions early and test them cheaply. People who treat discovery as a way to collect applause do "fake discovery": they ask friends, hear yes, and feel safe. Real discovery looks for the evidence that could prove you wrong. The NN/g video in the further learning list names five common ways teams get this wrong.

### Discovery is a phase and a habit

At the start of a product, discovery is a focused phase: you learn enough to decide whether to build, and what to build first. The UK government's service manual describes this well: a discovery is short, it is about people and their needs, and it ends with a decision and a plan. After launch, discovery becomes a habit. You keep talking to customers every week, because the product, the market and the people all keep changing.

## 3. Step by step

### Step 1: Write the idea in one paragraph

Open an empty file called `product-brief.md`. Write, in your own words and without looking anything up:

> *[Product name]* helps *[one kind of person]* who struggle with *[problem in their words]*. We will know it works when *[one measure]* by *[date]*.

Then add three short lines: **how it works in one sentence**, **why now**, and **who will not be served**. The last one matters: saying no to a group is what keeps the product sharp. The Dojo [product brief template](/library/template-product-brief) has the full layout.

### Step 2: Turn solutions into problems

Reread what you wrote. Underline every thing you could build. For each one ask: "What does the person struggle with that this would fix?" Rewrite the sentence around the struggle. Keep the solution only in the "how it works" line.

### Step 3: List every assumption

Write every belief the idea needs, one per line, under four headings:

- **Customer:** who has the problem, and how much do they care?
- **Value:** will they pay, switch, or change a habit for this?
- **Delivery:** can we actually do it (money, skills, partners, rules)?
- **Growth:** how will people find out about it?

Aim for ten to twenty lines. Most beginners find five. If you only have five, ask "what else must be true?" three more times.

### Step 4: Rank by risk

For each assumption give two scores from 1 to 5: **how bad if false** and **how little we know**. Multiply them. The top three or four are your **riskiest assumptions**. Everything else can wait. Write the top ones at the top of the file.

### Step 5: Decide what you will learn first

For each risky assumption, write the cheapest way to learn the truth. Usually this is a conversation, a look at real data, or a tiny test. Do not write "build it and see". A small prototype is a test, not a first release. The MVP guide from Atlassian shows how to think about the smallest version that teaches you something real.

### Step 6: Share it and invite disagreement

Ask one person you trust to read the file and write down every question. The questions you cannot answer are the start of your interview list in the next lesson.

## 4. Worked example: TrailMug

TrailMug is a fictional product used across the Dojo. All names and numbers below are illustrative.

**First draft (a wish):** "TrailMug is an app that makes coffee greener."

**Why it fails:** there is no user, no problem and no number. The word "app" is a solution.

**After framing:**

> TrailMug helps commuters who buy coffee every day and feel bad about the throw-away cups, but who forget or hate carrying a reusable cup. We will know it works when 500 people are paying members six months after launch. Customers pay a small monthly fee, get a reusable cup and swap it for a clean one at any partner café. We will not serve event caterers.

**Assumptions (extract):**

| Assumption | Bad if false (1-5) | Little known (1-5) | Risk |
|---|---|---|---|
| Commuters will pay a monthly fee to avoid carrying a dirty cup | 5 | 5 | 25 |
| Cafés will accept returned cups and keep them clean | 5 | 4 | 20 |
| A swap takes less than 30 seconds at the counter | 4 | 4 | 16 |
| Commuters find partner cafés near their route | 3 | 3 | 9 |
| Cups can be washed at a cost that leaves margin | 5 | 3 | 15 |

The top two are about **willingness to pay** and **café cooperation**. If either fails, nothing else matters. So the first learning plan is two groups of conversations: commuters and café owners. A third plan is a cost check with a café that already washes dishes.

Notice what the founder did not do. She did not start building an app. She did not design a logo. She used an hour to find the two beliefs that could sink the idea, and she planned how to test them. That is the whole skill.

## 5. Working with AI agents on this

Framing is **your** thinking. You write the brief. An agent cannot know what you have heard, what excites you or what you will refuse to do, and it will agree with almost any idea. That is why the Dojo rule is that people write the idea, the epics and the roadmap, and AI does not.

Agents are strong at the surrounding work.

**Delegate:**

- Finding public facts: market size claims, similar products, rules that may apply. You ask for sources.
- Listing counter-arguments. Ask: "Argue against this idea. List the five strongest reasons it could fail." Use the list as a prompt for your own thinking.
- Spotting vague words in your draft. Ask it to underline any word two people could read differently.
- Spelling and grammar, after you have finished writing.

**Do yourself:**

- Choose the user, the problem and the measure.
- Mark each assumption and rank its risk.
- Decide what you will not serve.
- Decide what to learn first.

**A brief you can adapt** (paste your own finished `product-brief.md` after it):

```text
You are a sceptical reviewer. Below is a product brief I wrote myself.
Do not rewrite it and do not suggest new features.
1. Underline every word or phrase two people could read differently.
2. List assumptions the brief depends on that I did not write.
3. For each, say what evidence would show it is false.
4. Name any claim of fact and say whether it needs a source.
Answer as a numbered list. If you are not sure of a fact, say so.
```

**How to check the output.** Read every item against your own notes. Throw away anything generic. Check every fact the agent gives against its source, because models can state wrong facts in a confident voice. Never copy a number into your brief unless you opened the source yourself.

**Disclose.** Add a line at the bottom of the file: "AI use: sceptical review of the brief on 2026-11-03; I wrote the brief and chose what to keep." Disclosure is a Dojo rule and a professional habit. Hiding AI use is a bigger problem than the use.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. Here you work on the **use** rung. One agent, one question at a time, and you read every answer. Do not delegate framing: it is the part that is yours. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the two upper rungs.

## 6. Common mistakes

- **Writing a solution and calling it a problem.** Fix: use the swap test in section 2.
- **Describing "everyone".** "Anyone who drinks coffee" is not a user. Pick one kind of person you could interview this week.
- **Having no number.** Without a measure you cannot tell success from hope. Pick one number, even a rough one, and a date.
- **Collecting only friendly opinions.** Friends and family say yes to be kind. Look for the person who might say no.
- **Treating assumptions as facts.** If you cannot say how you know, it is a guess. Mark it.
- **Starting to build to "see what happens".** Build only what teaches you something specific.
- **Letting an AI write the brief.** It will sound confident and be generic. You will not be able to defend it when someone asks a hard question.

## 7. Practice: your product brief and assumption list

**Deliverable:** two files committed in your product's git repo.

1. `discovery/product-brief.md` containing the one-paragraph idea, how it works in one sentence, why now and the "we will not serve" line. Use your own product, or TrailMug if you do not have one yet (then change the details so it is your version, not a copy).
2. `discovery/assumptions.md` with a table of at least ten assumptions, scored for risk, with the top three marked and a "how we will learn this" line for each.

Commit with a clear message, for example `Add product brief and assumption list`. Include the AI-use line even if the answer is "none".

**Stretch:** ask an agent to act as the sceptical reviewer with the brief above. Save its answer in `discovery/review-notes.md`, and add a short section called "What I changed and why", and "What I ignored and why".

## 8. Checklist

- [ ] My idea has a user, a problem, a measure and a date.
- [ ] I wrote it myself, without an AI drafting it.
- [ ] No sentence in the problem is really a solution.
- [ ] I listed at least ten assumptions and scored them.
- [ ] The top three assumptions have a cheap way to test them.
- [ ] I wrote who I will not serve.
- [ ] I recorded any AI use in the file.
- [ ] Someone else read it and asked questions.

## 9. Further learning

The resources listed below this lesson give you the theory behind the method. If you only have time for two, read the Atlassian product discovery page and the GOV.UK discovery phase page. Then watch the NN/g video on real discovery and compare it with your own plan. The next lesson turns your list of unknowns into customer interviews.
