---
title: "Touch points and journey maps"
description: "List every place a person meets your product, then draw a user journey and a customer journey that show what people do, think and feel at each step."
section: "Personas and journeys"
order: 3
track: "personas-and-journeys"
level: "core"
duration: "2.5 hours"
outcomes:
  - "List the touch points of a product across the whole customer story, including payments, help and policy"
  - "Draw a user journey and a customer journey with doing, thinking, feeling and pain at each step"
  - "Tell a journey map from a user flow"
  - "Link each step to the part of the product that serves it"
resources:
  - "nngroup/journey-mapping-101"
  - "youtube-nngroup/customer-journey-mapping-101"
  - "youtube-nngroup/five-steps-to-customer-journey-mapping"
  - "youtube-nngroup/user-journeys-vs-user-flows"
  - "nngroup/service-blueprints"
  - "atlassian/story-mapping"
prerequisites:
  - "week-2-know-the-people"
  - "template-journeys"
updated: 2026-11-03
---

**Supports:** Developer, week 2 (Know the people): the touch-point list and the user and customer journeys. **Time:** about two and a half hours.

## 1. Why this matters

Your product is not a single screen or a single moment. It is a story that starts before a person has heard of you and continues after she has stopped using you. In the middle are dozens of small moments: a search result, a poster, an email, a sign-up form, a payment page, a help article, a receipt. Each one is a **touch point**, and each one either builds trust or breaks it.

Most teams design the main screen carefully and forget everything around it. Then they wonder why people sign up and never come back. A journey map is the cure. It makes you walk the whole story in the order the person lives it, so that you can see the weak steps.

For a Product Development Manager (PDM), journeys are also the bridge between **people** and **parts of the product**. Each step of a journey needs something to exist: a page, a service, a policy, a person. When you link steps to the parts of your product, you can see which parts are missing, and those missing parts become the epics in week 3. Agents work best on a small, clear part of a product. Journeys show you which parts exist and which still need briefing.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which steps matter, what people feel at each, and where the journey breaks | Turning your tables into clean diagrams; checking your pages and emails against your journey; formatting | Every step has a source (an interview, data or observation); every feeling is from evidence or marked G | Design (screens), marketing (reach), sales (buying), support (help), operations (delivery), legal (terms) |

## 2. Key ideas

### Touch points

A **touch point** is any moment when a person meets your product or your company. They come in many kinds:

- **Before:** a search result, a poster, a friend's recommendation, an advert.
- **During:** the website, the sign-up, the app, an email, a message, a payment.
- **After:** a receipt, a renewal notice, a help article, a cancellation page, a survey.
- **Always there:** the privacy policy, the status page, the way people can contact you.

Include **non-digital** touch points: a cup handed over a counter, a phone call, a printed card. And include **negative** touch points: an error message, a failed payment, a long wait.

### A journey map

A **journey map** is a picture of one person's path through the story. Across the top, put the **stages**. Down the side, put the **layers**:

| Layer | Question |
|---|---|
| Action | What does the person do? |
| Thinking | What is she asking herself? |
| Feeling | How does she feel? (a word, or a simple high-low line) |
| Pain | What goes wrong or gets in the way? |
| Opportunity | What could we do better? |
| Served by | Which part of the product (repo, system, person) makes this step work? |

NN/g's journey mapping introduction explains the parts of a map and why they help. Two points matter most: a journey map is built from **research**, not imagination, and it is made **from one person's point of view**.

### User journey and customer journey

The Dojo asks for two maps because two people are involved:

| | User journey | Customer journey |
|---|---|---|
| **About** | The person who uses the product | The person who pays |
| **Typical stages** | Find, learn, set up, use, get help, stop or stay | Aware, consider, buy, onboard, renew, refer |
| **Key question** | Does it help me get my job done? | Is it worth paying for, and is it safe to say yes? |

They are the same person in some products and different people in others. TrailMug has both: Maya is user and customer, while Leo the café owner has a separate customer journey.

### Journey versus flow

A **user flow** shows the **screens and decisions** inside your product to complete one task: "Open the app, tap Return, scan the cup, see the confirmation." A **journey** is wider and about the **person**: what she does before, during and after, including offline moments, thoughts and feelings. NN/g has a clear short video on the difference. Draw the journey first. Draw flows later, for the steps where you need to design the screens.

### Where the journey meets the repo map

Every step needs something behind it. If you wrote "she reads an email within five minutes," then there must be a workflow, an email provider, a template and a sender address. Writing the "Served by" row forces you to ask whether these exist. It turns a map about people into a plan for parts. The NN/g service blueprint article extends the same idea with a "back stage" lane.

## 3. Step by step

### Step 1: List the touch points

Begin from your interview notes and your product map. Walk through the story of a person from "has not heard of us" to "has left or renewed". Write every touch point you can find, in the order they happen. Aim for twenty or more. Then check that you have covered payments, help, status, policies and analytics. These five are the most often forgotten.

### Step 2: Choose the journeys

Pick one **user journey** for your main user and one **customer journey** for your main customer. If they are the same person, still draw two, because the questions differ (use, versus pay). Choose the stages. Six or seven stages is enough.

### Step 3: Fill each stage from evidence

For each stage, write action, thinking, feeling and pain from your interviews. Use exact words where you can. Where you have no evidence, write the line and mark it **G**, as with personas. A journey map with all lines marked G is a to-do list for more interviews.

### Step 4: Mark the emotion line

Add a simple line for how she feels at each stage: high, medium or low. Look at the low points. These are where people leave.

### Step 5: Link each step to a part of the product

In the "Served by" row, write the name of the repo, system or person that makes the step work, and mark it exists, planned or not found, as you did in the whole-product map. Where nothing serves a step, write "nothing" in capitals. This is the most useful word on the page.

### Step 6: Add opportunities, but do not design yet

Write one opportunity per pain. Keep them short and about the **outcome**: "She can find the nearest café in two taps." Do not draw screens yet, and do not pick tools.

### Step 7: Walk it with someone

Read the map aloud to a person who knows the customers, or to the customer herself if you can. Ask: "Does this sound like your day? What is wrong?" Fix it. Add a date.

## 4. Worked example: TrailMug

TrailMug is fictional. The steps are illustrative, though they follow the Dojo's template.

**Touch points (extract):**

| Stage | Touch point | Channel | Served by |
|---|---|---|---|
| Aware | A poster with a QR code in a café | Café | trailmug-lp-cafes (planned) |
| Aware | Search for "reusable cup subscription" | Web search | trailmug-site (exists) |
| Consider | The price and how-it-works page | Web | trailmug-site (exists, no price yet) |
| Buy | Sign-up and payment | App | trailmug-app (exists), trailmug-pay (NOT FOUND) |
| Onboard | Welcome email within five minutes | Email | trailmug-flow-welcome (planned) |
| Use | Swapping a cup at the counter | Café | trailmug-svc-returns (planned) |
| Help | "My cup is missing" | Help centre | trailmug-docs (NOT FOUND) |
| Always | Privacy notice, terms | Web | trailmug-ops (NOT FOUND) |
| Always | "Is the service down?" | Status page | trailmug-status (NOT FOUND) |

**User journey: Maya (extract)**

| Stage | Action | Thinking | Feeling | Pain | Served by |
|---|---|---|---|---|---|
| Find | Sees a café poster | "Could this work for me?" | Curious | Poster shows no price [K: C1] | trailmug-lp-cafes (planned) |
| Sign up | Opens the app, enters email | "How much is it?" | Cautious | Price is not shown before sign-up [G] | trailmug-app (exists) |
| First swap | Brings a used cup to a café | "Which café is closest?" | Hopeful | Café map is slow [G] | trailmug-svc-returns (planned) |
| Use daily | Swaps at the counter | "This is quick" | Pleased, if fast | Queue at lunchtime [K: P1, P3] | trailmug-svc-returns (planned) |
| Problem | Cup is missing | "Who do I tell?" | Annoyed | NOTHING: no help page or contact form | trailmug-docs (NOT FOUND) |
| Stop or stay | Reviews the monthly fee | "Is it worth it?" | Unsure | No usage summary [G] | trailmug-analytics (planned) |

**Customer journey: Leo, the café owner (extract)**

| Stage | Goal | Action | Question | Risk | Served by |
|---|---|---|---|---|---|
| Aware | Attract customers | Hears about TrailMug from another owner | "Is this for cafés?" | Page speaks only to drinkers [K: P1] | trailmug-lp-cafes (planned) |
| Consider | Compare | Asks for a call | "How much work is it?" | No setup guide [K: P2] | trailmug-docs (NOT FOUND) |
| Buy | Join | Signs partner terms | "Are the terms fair?" | Terms do not exist yet | trailmug-ops (NOT FOUND) |
| Onboard | Start returns | Receives a kit | "How do I scan a cup?" | Setup too slow [G] | trailmug-docs (NOT FOUND) |
| Renew | Keep the deal | Reads a monthly report | "Did it bring customers?" | No proof of value | trailmug-analytics (planned) |

Look at the **Served by** column. Several steps say NOT FOUND or NOTHING. The two journeys already tell the founder what the product is missing: a price page, partner terms, a help centre, a status page and a way to show Leo his results. None of these are features of an app. They are parts of a whole product, and they are the raw material for week 3.

## 5. Working with AI agents on this

A journey map is a **summary of research**. Agents can help you present and test it. They cannot supply the content.

**Delegate:**

- **Clean diagrams and tables.** "Turn this table into a Mermaid journey diagram. Do not change any text." Or a plain-text diagram you can paste in the repo.
- **Cross-checking.** "Here are my touch-point list and my product map. List every touch point whose 'Served by' item is not in the map, and every map item that serves no touch point."
- **A fresh-eyes walkthrough of a page.** Give an agent the text of your landing page and ask it to read it as a first-time visitor and list every question it still has. This is a cheap heuristic check. Treat the output as hypotheses to test with a real person.
- **Drafting emails or help pages** that fill a gap, for you to edit. You own the promises in them.

**Do yourself:**

- Choose the stages and fill them from evidence.
- Judge how people feel, from what they said and did.
- Decide which breaks matter.

**A brief you can adapt:**

```text
Below are two tables I wrote from customer interviews: a touch-point list
and a product map (repos and systems, each marked exists, planned or not
found).
1. List touch points whose "served by" part is missing from the map.
2. List parts in the map that serve no touch point.
3. List steps where the journey says "nothing" or "not found".
Do not invent touch points or parts. Output three short lists.
```

**How to check the output.** Verify each claim against the tables. Add the real findings to your gap list. If the agent invents a touch point that is not in your data, delete it. If it suggests a plausible one, add it as a question for the next round of interviews, not as a fact.

**Do not** ask an agent to "write the customer journey for a reusable cup subscription". You would get a clean, average journey that fits every similar product and none of your customers.

**Disclose.** In the map's footer: "AI use: diagram formatting and cross-check; steps and feelings come from my interviews."

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **delegate**. Drawing a map from your table is a whole task. If several agents work on different journeys at once, you are orchestrating, and they must share the same names for stages and touch points. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the two upper rungs.

## 6. Common mistakes

- **Drawing the happy path only.** Include errors, waiting, failed payments and help.
- **Mixing user and customer.** Two people, two maps.
- **Feelings with no source.** Mark guessed feelings G.
- **A map made from imagination.** Every row should come from a person, a number or an observation.
- **Forgetting offline steps.** The counter, the phone call and the printed card are touch points too.
- **No "served by" row.** Without it, the map is a picture that never turns into work.
- **Designing screens too early.** Journeys come first. Flows and screens follow for the steps that need them.
- **Too many stages.** Over about eight, nobody can remember the map.

## 7. Practice: touch points and two journeys

**Deliverable:** three files in your git repo under `people/`.

1. `touch-points.md`: at least 20 touch points in story order, each with channel and a "served by" part marked exists, planned or not found. Show that you covered payments, help, status, policies and analytics.
2. `journey-user.md`: your main user's journey with stages, action, thinking, feeling, pain, opportunity and served by. Every line marked with a source code or G.
3. `journey-customer.md`: your main customer's journey with six stages (aware, consider, buy, onboard, renew, refer) and the same layers. If the user is the customer, still write it from the point of view of paying and deciding.

Start from the [journeys template](/library/template-journeys). Commit with a message like `Add touch points and two journeys`. Add an AI-use line to each file.

**Check:** count the cells that say NOTHING or NOT FOUND. If there are none, you probably missed something. Ask someone to find a step you skipped.

**Stretch:** test the map with one real person. Read it to her and ask her to correct it. Record the corrections in a `Changes` section with the date.

## 8. Checklist

- [ ] I listed at least 20 touch points, in story order.
- [ ] I covered payments, help, status, policies and analytics.
- [ ] I drew both a user journey and a customer journey.
- [ ] Every step has action, thinking, feeling, pain and "served by".
- [ ] Every line cites a source or is marked G.
- [ ] I marked where nothing serves a step.
- [ ] Someone who knows the customers read the map.
- [ ] I wrote down my AI use and none of the steps were invented by an AI.

## 9. Further learning

NN/g's "Journey Mapping 101" is the best free starting point, and its two short videos on the five components and the five steps of journey mapping make it quick to absorb. The NN/g video on user journeys versus user flows will keep you from mixing them. The NN/g service blueprint article shows how to add the behind-the-scenes lane, and Atlassian's story mapping guide shows how the step from journey to backlog works. In the next lesson you find where your journeys break and rank the breaks as epic candidates.
