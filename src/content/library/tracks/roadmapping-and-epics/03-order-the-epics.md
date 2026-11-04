---
title: "Order the epics and defend the order"
description: "Order your epics by value, risk and dependency, write one sentence of reasoning for each position, choose a prioritisation method on purpose and say what you chose not to do."
section: "Roadmapping and epics"
order: 3
track: "roadmapping-and-epics"
level: "core"
duration: "2.5 hours"
outcomes:
  - "Map the dependencies between epics and find the ones that must come first"
  - "Choose a prioritisation method and say why it fits your product"
  - "Write one sentence of reasoning for each epic's position on the roadmap"
  - "Write a not-doing list and show a now, next, later roadmap"
resources:
  - "atlassian/prioritization-frameworks"
  - "nngroup/prioritization-methods"
  - "youtube-nngroup/ux-design-prioritization-methods"
  - "atlassian/project-dependencies"
  - "atlassian/product-roadmaps"
  - "youtube-nngroup/ux-roadmaps-101"
prerequisites:
  - "week-3-problems-to-epics"
  - "roadmap-standard"
updated: 2026-11-03
---

**Supports:** Developer, week 3 (Problems to epics): "order the epics; write one sentence for why each comes before the next". **Time:** about two and a half hours.

## 1. Why this matters

You have four to eight epics. You cannot start them all at once. The order is the strategy. Two teams with the same epics in a different order can end up with very different products, because the first epic builds the base that the others stand on, and the first results change what you learn.

Order is also where wrong ideas get stopped. A roadmap that lists good epics in a careless order wastes weeks. A roadmap that starts with the epic nobody pays for, or with one that depends on a decision nobody has made, wastes quarters.

For a Product Development Manager (PDM) this is a core skill. Agents can build any epic in the list. They have no opinion about which should come first, and if you ask them, they will give you a smooth and confident answer based on generic patterns, not on your money, your customers or your risks. Order is the clearest case of the rule that **people write epics and roadmaps; AI never does**. The reasons for each position must be yours, because you will have to defend them to a panel, a sponsor or a sceptical partner.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The method, the scores, the order and the reason for each position | Arithmetic checks; drawing the dependency graph from your table; asking you tough questions | Scores trace to evidence; every dependency is real; the order survives a challenge | Finance (cost and cash), operations (capacity), sales and support (promises made), legal (deadlines), engineering (feasibility) |

## 2. Key ideas

### Three forces: value, risk and dependency

Every ordering decision balances three forces.

| Force | Question | Pushes an epic… |
|---|---|---|
| **Value** | How much does it matter to customers and the business, and how soon? | earlier |
| **Risk** | How uncertain is it, and what do we learn by doing it? | earlier (to learn sooner) or later (to avoid wasting money) |
| **Dependency** | What cannot start until this is done? | earlier, if many things depend on it |

A fourth force is **cost and capacity**: how much effort it takes and how much you have. Be aware of it, but do not let it drive the order alone. Cheap things are not always good things.

### Dependencies decide more than you think

Some orders are not a matter of opinion. A welcome email needs a customer list. A customer list needs a sign-up form. A payment needs a privacy notice. Atlassian's page on project dependencies lists common kinds, such as one task needing another to finish first. Draw them. Write each as "A needs B because…". A dependency you forget will show up later as a blocked agent and a late delivery.

Also look for **decisions** that are dependencies. "We cannot design the café payment until we decide how cafés are paid" is a dependency on a decision, with a person who must make it and a date.

### Prioritisation methods

There are many ways to score work. Atlassian's guide to prioritisation frameworks covers several well-known ones, including RICE, MoSCoW, Kano and value versus effort. NN/g also describes several methods for UX roadmapping, and a short video explains why prioritisation matters: a product with everything in it is a worse product. A quick map:

| Method | What it does | Fits when |
|---|---|---|
| **Value versus effort** | Plots items on a two-by-two grid | You want a quick view |
| **RICE** | Scores Reach, Impact, Confidence and Effort, then calculates a number | You have data and many items |
| **MoSCoW** | Sorts into must, should, could and won't | You have a fixed deadline |
| **Kano** | Separates basics, performance and delighters | You are choosing between features customers see |
| **Dependency-first** | Orders by what blocks what | The plan has hard chains |

Choose a method **on purpose** and say why. Many first roadmaps are best served by a simple combination: order by dependency first, then by value and risk inside each wave.

A warning: scores look objective, but they hide guesses. RICE multiplies numbers that you made up. If your "reach" is a guess and your "impact" is a guess, the product is a guess with decimals. Use the number to start a discussion, not to end one. Always ask: "Would I be surprised by this order? Why?"

### Learn early, spend later

Risky epics deserve an early **learning step**, not an early full build. If a payment system is risky because you do not know if people will pay, the first work in that epic is the test, not the integration. The order of epics may stay the same while the first milestone of an epic is a cheap test.

### Now, next, later

Roadmaps often group items by time horizon: **now** (being worked on), **next** (ready to start soon) and **later** (a direction, not a promise). This avoids false precision. Dates far away are guesses. Use real dates only for the near term and for hard external deadlines. Atlassian's roadmap guide and the NN/g video on UX roadmaps describe this style of plan.

### The "not doing" list

An honest roadmap names what is left out. For each item you cut or postpone, write why. It protects you from surprise requests and shows reviewers that you made choices, not that you missed things.

## 3. Step by step

### Step 1: Gather your epics

Take your four to eight epics from the previous lessons. Put the titles in a table with columns for the persona served, the measure and the parts touched.

### Step 2: Map dependencies

For each pair of epics, ask: "Does A need something B delivers?" Write each as "A needs B because…". Include dependencies on **decisions** and on **other people** (a legal review, a partner). Draw the result as arrows. Look for epics with many arrows pointing at them. They tend to come early.

### Step 3: Score value and risk

For each epic, give a 1 to 5 score for **value** (how much it matters to customers and the business) and **risk** (how uncertain it is). Write one line of evidence for each score: a quote, a number, a source. If there is no evidence, write "guess".

### Step 4: Pick a method and write why

Choose one method from the table, or a combination. Write two sentences: which method and why it fits **your** product now.

### Step 5: Propose an order

Sort by the method and then adjust for dependencies. Do not let the maths override a hard dependency, and do not let a single big score override common sense.

### Step 6: Write one sentence per position

For each epic, write one sentence beginning "This comes **before** the next because…". The sentences should use value, risk or dependency. "Because it is easy" is a weak reason. "Because nobody pays until it exists" is a strong one.

### Step 7: Write the not-doing list

List what you chose not to do, and why. Include any epic you dropped.

### Step 8: Test the order

Do a challenge round. Ask: "If I had to drop the last epic, would I still ship something useful?" "If the top epic fails, what changes?" "Which epic would I swap if my main customer changed her mind tomorrow?" Adjust if you find weak reasons.

### Step 9: Draw the now, next, later view

Put the epics into columns. Add real dates only for the near term. Save it in your repo.

## 4. Worked example: TrailMug

TrailMug is fictional. The founder has five epics.

| # | Epic | Value | Risk | Evidence | Main dependency |
|---|---|---|---|---|---|
| A | Café owners can join, run returns and see results | 5 | 4 | 3 cafés said "I need to know what it involves" | Decision on café payment |
| B | Visitors can see the price, sign up and pay | 5 | 5 | Unclear whether commuters pay; guess | Privacy notice; test of willingness to pay |
| C | New members get a welcome email in 5 minutes | 3 | 2 | 2 of 5 said they felt lost after sign-up | Customer list, sign-up |
| D | Anyone can tell if the service is up | 2 | 1 | Nobody asked; founder fears silent outages | None |
| E | The service is lawful and honest (privacy notice, terms) | 4 | 2 | Rules require it before collecting emails | None |

**Method:** dependency first, then value and risk. The founder writes: "I chose dependency-first because two of my epics are blocked by a legal basis and a decision. I used value and risk only inside each wave."

**Dependencies:** B needs E (no payment without privacy notice). A needs E (café data). C needs B (members must exist). D needs nothing.

**Order and reasons:**

1. **E, lawful and honest.** It comes first because I cannot collect emails or payments without it, and it blocks A and B.
2. **A, café partners.** It comes second because without cafés there is nothing for members to use, and it has the highest risk to learn about.
3. **B, price, sign-up and pay.** It comes third because nobody pays until cafés exist, and I need the willingness-to-pay test before I build payment.
4. **C, welcome email.** It comes fourth because it only matters when members exist.
5. **D, status page.** It comes last because the product has too few users for an outage to hurt yet.

**Not doing:** loyalty points (no evidence); event caterers (outside our focus); a barista app (until swaps are proven).

**Challenge round:** "If I drop D, do I still ship something useful? Yes." "If A fails, what changes? Most of the roadmap; so A's first milestone is a two-café trial before building anything big."

**Now, next, later:**

| Now (this quarter) | Next | Later |
|---|---|---|
| E (lawful and honest) | B (price, sign-up and pay) | D (status page) |
| A (café partners): trial first | C (welcome email) | Loyalty ideas (parked) |

The founder has made the order visible, written a reason for each step, and said what would change it.

## 5. Working with AI agents on this

The Dojo rule applies strongly here: **you never ask an AI to decide the order of your epics.** Order is strategy, built on information the agent does not have.

**Delegate:**

- **Arithmetic.** "Recalculate these RICE scores from the numbers in my table. Flag any row where I made an arithmetic error. Do not change inputs."
- **Dependency graph.** "Turn my 'A needs B because…' lines into a Mermaid diagram. Do not add or remove arrows."
- **A challenge session.** "Play a sceptical investor. Ask me one hard question about my order at a time and wait for my answer."
- **A hidden-dependency hunt.** "From these epics, list any dependency that is not written down (for example, a legal review or a rented system that must exist first). Present each as a question, not as a fact."
- **Method explanation.** "Explain RICE and MoSCoW to me with an example, and link to sources."

**Do yourself:**

- Score value and risk, with evidence.
- Choose the method and the order.
- Write every "because" sentence.
- Decide what is not being done.

**A brief you can adapt:**

```text
I am ordering product epics. Below is my table with scores and evidence,
my list of dependencies and my proposed order with reasons.
Do not propose a different order and do not rewrite my reasons.
1. Check my arithmetic.
2. List hidden dependencies as questions.
3. For each position, name the weakest part of my reasoning.
4. Ask me the five hardest questions a sceptical sponsor would ask.
Output four short lists.
```

**How to check the output.** For each weak point the agent names, decide whether you agree. If you do, change your reasoning in your own words. If you do not, write one line why. Check any arithmetic it flags.

**Warning about confident answers.** If you ask an agent to rank epics, it tends to put whatever sounds most important or most commonly discussed first, based on common patterns online. It does not know that your café partner is your riskiest bet. Keep ownership of the order.

**Disclose.** At the end of `order.md`: "AI use: arithmetic check and a practice challenge session. The scores, method, order and reasons are mine."

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **use**, on purpose. Order is strategy and stays with you. What you may orchestrate later is the work that follows from the order, not the order itself. The [agent orchestration track](/library/tracks/agent-orchestration/) covers the two upper rungs.

## 6. Common mistakes

- **Ordering by excitement.** Use value, risk and dependency.
- **Ignoring dependencies.** A blocked agent costs more than a late epic.
- **False precision.** Scores with decimals hide guesses. Mark guesses.
- **Weak reasons.** "It is easy" is not a reason. "It blocks three others" is.
- **No learning step for risky epics.** Start with a cheap test, not a full build.
- **A roadmap with exact dates two years out.** Use now, next, later, with real dates only for the near term.
- **Omitting the not-doing list.** The omissions are part of your strategy.
- **Letting an AI choose.** You cannot defend an order you did not reason out.

## 7. Practice: order and defend

**Deliverable:** `roadmap/order.md` in your git repo, containing:

1. A table of your epics with persona, value (1 to 5), risk (1 to 5) and a line of evidence for each score, with guesses marked.
2. A dependency list written as "A needs B because…", including decisions and other people.
3. The method you chose and two sentences on why.
4. The final order with one "comes before the next because…" sentence per epic.
5. A not-doing list with reasons.
6. A now, next, later table.
7. Your AI-use line.

Commit with a message such as `Order epics with reasons and not-doing list`.

**Check:** defend the order aloud for three minutes, without notes, to a person. Ask her to challenge the weakest position. Record what you changed in a `Changes` section.

**Stretch:** pick a second method (for example RICE if you used dependency-first) and score the epics again. Write three lines on where it gave a different order and what you learned.

## 8. Checklist

- [ ] Every dependency is written as "A needs B because…".
- [ ] Decisions and other people are included as dependencies.
- [ ] Scores have evidence or are marked as guesses.
- [ ] I chose a method on purpose and wrote why.
- [ ] Each epic has one reason for its position.
- [ ] Risky epics start with a cheap learning step.
- [ ] The not-doing list exists, with reasons.
- [ ] Real dates are used only for the near term.
- [ ] I defended the order aloud without notes.
- [ ] I recorded my AI use, and no AI chose the order.

## 9. Further learning

Atlassian's guide to prioritisation frameworks, NN/g's article on prioritisation methods in UX roadmapping and the NN/g video on the same topic give you the vocabulary and the trade-offs. Atlassian's pages on dependencies and product roadmaps show common formats. The NN/g video on UX roadmaps is a short introduction to the now, next, later idea. In the next lesson you put the roadmap in your git repo, using a free GitLab account.
