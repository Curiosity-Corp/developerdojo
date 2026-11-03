---
title: "Find the breaks and hand over to the roadmap"
description: "Read your journeys against your product map, find where people struggle or are not served, rank the breaks and write them as epic candidates for week 3."
section: "Personas and journeys"
order: 4
track: "personas-and-journeys"
level: "core"
duration: "2 hours"
outcomes:
  - "List the breaks in a journey and classify each by type"
  - "Rank breaks by who is hurt, how often and how badly"
  - "Tell an epic candidate from a milestone or an issue"
  - "Present one persona and one journey, and say where it breaks today"
resources:
  - "atlassian/story-mapping"
  - "atlassian/user-stories"
  - "nngroup/service-blueprints"
  - "nngroup/prioritization-methods"
  - "gov-uk/service-standard"
prerequisites:
  - "week-2-know-the-people"
  - "week-3-problems-to-epics"
updated: 2026-11-03
---

**Supports:** Developer, week 2 (the coach checkpoint question "where does the journey break today?") and the start of week 3 (Problems to epics). **Time:** about two hours.

## 1. Why this matters

You now hold personas, touch points and two journeys. They look useful, and they are, but only if they change what you do next. This lesson is the hand-over: you read the journeys with a critical eye, find the **breaks**, and decide which ones are big enough to become epics.

A **break** is a step where the person struggles, gives up, or is not served at all. Breaks are where the product loses customers and where the next work should go. They are also the honest answer to the coach's question: where does the journey break today?

For a Product Development Manager (PDM), this is the moment where discovery becomes planning. Agents can build almost anything you ask. The risk is that you ask for the interesting things (a new feature, a smart chatbot) instead of the important things (a price page, a way to get help). Breaks keep you honest. If you can point at a step and say "Maya left here, and nothing serves this step," the roadmap writes itself in outline, though you still write every epic yourself.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which breaks are real, which matter most, and which become epic candidates | Cross-checking tables for gaps; sorting a list; asking questions about your reasoning | Each break traces to evidence; the ranking is yours, with reasons | Design (is it a screen problem?), engineering (what would it take?), support (how often does it hurt?), finance (what is it worth?) |

## 2. Key ideas

### Types of break

Not all breaks are the same. Naming the type tells you what kind of work will fix it.

| Type | What it looks like | Example |
|---|---|---|
| **Missing part** | A step is served by nothing | No help page when a cup goes missing |
| **Broken step** | The part exists but fails the person | The café map is slow and times out |
| **Wrong person** | The product speaks to someone else | The partner page only talks to drinkers |
| **Invisible** | The person cannot see or find it | Price is not shown before sign-up |
| **Risky** | It may harm or break a rule | No privacy notice, yet email addresses are collected |
| **Unclear** | You do not know yet | Does Maya pay? Only hints so far |

Unclear is a legitimate type. It means "more discovery needed", and it does not become an epic. It becomes an interview or a test.

### Rank by hurt, not by interest

You cannot fix everything. Rank each break on three simple scales, 1 to 5:

- **Reach:** how many of your main people hit this break?
- **Hurt:** how badly does it damage trust, money or safety?
- **Evidence:** how sure are you? (5 = seen repeatedly in behaviour; 1 = guess)

Multiply the three. The result is a rough guide, not a law. Use it to start a conversation with yourself and your coach. Later, in the roadmapping track, you will learn more formal methods such as RICE, and NN/g and Atlassian describe several. At this stage a simple score is enough to see what stands out.

### Epic candidate, milestone or issue?

A break becomes a candidate for an **epic** only if fixing it crosses several parts of the product. The Dojo's rule of thumb:

| If the fix lives in… | It is probably a… |
|---|---|
| One part of one repo (a button, a typo, a slow query) | **Issue** |
| One repo, several steps, a few weeks | **Milestone** |
| Several parts: site, app, a service, a rented system and a policy | **Epic** |

Example. "The café map is slow" lives in one service: an issue or small milestone. "Café owners cannot join, learn how to run returns or see their results" touches the partner page, the help centre, the terms, the returns service and the monthly report. That is an epic. See the [epic standard](/library/epic-standard).

### Problem statements, not solutions

Describe each epic candidate as the **outcome for a person**, not as a thing to build. Weak: "Build a partner portal." Better: "A café owner can join, run returns and see what TrailMug brought her, without calling us." The first names a solution. The second names a result you can test, and leaves the how to a later stage.

### Stories and story maps

A **user story** is a short statement of what a person wants and why. Atlassian's guide to user stories shows the common template. A **story map** lays your journey's steps across the top and the work under each step. It is one way to go from journey to backlog. For epic candidates, you do not need stories yet. But if you try a story map, you will see how the journey steps become the spine of the plan.

### The service standard test

The UK government's service standard gives a useful final check on your list: have you solved a **whole** problem for the person, not just one step? Is the service simple? Can everyone use it? These questions catch breaks that sit outside your usual view.

## 3. Step by step

### Step 1: Mark the breaks on your journeys

Open your two journey files. Go row by row. Mark every row where the pain column is serious, where the "served by" cell says NOTHING or NOT FOUND, or where the feeling is low. Number the marks B1, B2, B3, and so on.

### Step 2: Write each break as a sentence about a person

Use the form: "At the *[stage]* step, *[person]* cannot or struggles to *[do what]*, because *[reason]*." Add the evidence code. Example: "At the **Problem** step, Maya cannot report a missing cup, because there is no help page or contact form [observed in the map; K: C4 asked 'who do I tell?']."

### Step 3: Classify the type

Assign a type from the table above. If it is **Unclear**, move it to a "learn more" list and write the question.

### Step 4: Score and sort

Score reach, hurt and evidence from 1 to 5. Multiply. Sort. Then do a sanity check: read the top five aloud. Do they feel like the right top five? If not, work out why. Your scores may be off, or your gut may know something your scores do not. Adjust and write the reason.

### Step 5: Group breaks into epic candidates

Look for breaks that share a cause or a goal. "No help page", "no partner terms" and "no setup guide" all block café owners from joining. Group them under one outcome sentence. Write the parts each candidate would touch.

### Step 6: Apply the size test

For each candidate, list the parts of the product it touches. One part: issue. One repo: milestone. Several parts: epic. If a candidate is only an issue, keep it on a backlog, not on the roadmap.

### Step 7: Prepare the checkpoint

Prepare a short talk of about five minutes: one persona, one journey, the three biggest breaks and the evidence for each. End by saying what you still do not know. This is your coach checkpoint for week 2.

### Step 8: Hand over to week 3

Save the list as `people/breaks.md`. This is the **only** input you pass forward. In week 3 you will write each epic yourself, in your own words, in the template. Do not write the epics here. Resist the urge.

## 4. Worked example: TrailMug

TrailMug is fictional. Breaks come from the journeys in the previous lesson.

| # | Break | Type | Reach | Hurt | Evidence | Score |
|---|---|---|---|---|---|---|
| B1 | Café owners cannot join: no partner page for owners, no terms, no setup guide | Missing part, wrong person | 5 | 5 | 4 | 100 |
| B2 | Maya cannot see the price before she signs up | Invisible | 4 | 4 | 3 | 48 |
| B3 | No way to pay (no payment code found) | Missing part | 5 | 5 | 5 | 125 |
| B4 | No privacy notice, yet emails are collected | Risky | 5 | 4 | 5 | 100 |
| B5 | A missing cup has no help path | Missing part | 3 | 4 | 4 | 48 |
| B6 | Café map is slow | Broken step | 3 | 2 | 2 | 12 |
| B7 | Does Maya pay at all? | Unclear | n/a | n/a | n/a | learn more |

**Grouping into candidates (the founder's own words):**

- **"Café owners can join, run returns and see results"** from B1 and part of B5. Touches: partner page, terms, help centre, returns service, monthly report. Several parts: epic candidate.
- **"People can see the price, sign up and pay"** from B2, B3 and part of B4. Touches: site, app, payment, privacy notice. Epic candidate. Note that B7 (does Maya pay?) must be answered first, so it begins with a decision, not code.
- **"The service is lawful and honest"** from B4. Touches: privacy notice, terms and cookie rules. May fold into the other two or stand alone.
- **B6, the slow map**, lives in one service. It is an issue, not an epic.

The founder also notes what she is **not** doing: no loyalty scheme, no event-caterer features.

**Coach checkpoint (five minutes):** "This is Maya. This is her journey. It breaks at three places: she cannot see a price, there is no way to pay, and if a cup goes missing she has nobody to ask. My evidence is five interviews; the price point is still a guess. The thing I am least sure about is whether she will pay at all, so I will test that before I commit to a payment system."

That is a strong checkpoint: specific, evidenced and honest about the unknown.

## 5. Working with AI agents on this

This lesson is the closest one to the boundary of the Dojo's most important rule: **people write epics and roadmaps. AI never does.** Candidates and breaks are your raw material. Agents may support the work around them but must not draft the epics or decide their order.

**Delegate:**

- **Gap-checking.** "Here are my journey tables and my product map. List every step marked NOTHING or NOT FOUND and every map part that serves no step." The agent finds things you overlooked.
- **Sorting and scoring checks.** "Here is my table of breaks with scores. Recalculate the products and flag arithmetic mistakes. Do not change the scores."
- **Questions.** "Ask me five hard questions about this ranking, one at a time." You answer in your own words.
- **A neutral rehearsal.** Play the coach: "Ask me the questions a coach would ask after this five-minute talk." You practise answering without notes.

**Do yourself:**

- Choose which breaks are real and score them.
- Group breaks and write each candidate sentence.
- Decide what you are not doing.

**A brief you can adapt:**

```text
You are a demanding coach. Here is my list of journey breaks with
evidence and scores. Do not rewrite anything and do not suggest epics.
Ask me the five hardest questions you can about the ranking and the
evidence, one at a time, and wait for my answer before asking the next.
After my fifth answer, tell me which of my answers was vaguest.
```

**How to check the output.** The value is in your answers, not in the agent's text. After the session, write down which questions you could not answer. These are the gaps to close before the real checkpoint.

**Never** paste your breaks and ask "write my epics" or "order these by priority". You would get a smooth roadmap you cannot defend, and the rule exists precisely because planning is where wrong ideas must be stopped. An agent agrees too easily.

**Disclose.** At the bottom of `breaks.md`: "AI use: gap check and a practice session of coach questions. All breaks, scores and groupings are mine."

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson is where **delegate** meets **orchestrate**. The hand-over is the written input that later sessions work from. The more sessions that read it, the more it matters that it is exact, and the more you need a gate that checks each epic against it. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the two upper rungs.

## 6. Common mistakes

- **Ranking by what is fun.** Rank by reach, hurt and evidence.
- **Writing solutions as breaks.** "Build a portal" is not a break. "Café owners cannot see their results" is.
- **Treating unclear as a problem to solve.** It is a question to answer. Test before you build.
- **Skipping the size test.** Putting single-repo tasks on the roadmap fills it with noise.
- **Writing the epics now.** Candidates are not epics. Write the epics in week 3, by hand.
- **Hiding the weak evidence.** If the evidence for a break is a guess, say so.
- **Letting an AI order the list.** The order is a human choice with written reasons.
- **Forgetting the unserved.** The people on your we-will-not-serve list should not appear as breaks. If they do, revisit the list.

## 7. Practice: the break list and the checkpoint

**Deliverable:** two files in your git repo under `people/`.

1. `breaks.md`: at least eight breaks, each written as a sentence about a person with its type, evidence code, scores and ranking. Include a "learn more" list for the unclear ones, and the epic candidates with the parts each would touch. Mark each candidate epic, milestone or issue.
2. `checkpoint-notes.md`: your five-minute talk in bullet points: one persona, one journey, three biggest breaks with evidence and one thing you do not yet know.

Do not write full epics. Stop at candidate sentences. Commit with a message like `Add journey breaks and checkpoint notes`.

**Check:** say your checkpoint talk aloud, without notes, to another person or to a mirror. Time it. If it is over six minutes, cut.

**Stretch:** run the coach-question brief with an agent and write down the three questions you answered worst. Add a section "Open questions" to `breaks.md`.

## 8. Checklist

- [ ] Each break is a sentence about a person, with a stage and evidence.
- [ ] Each break has a type; unclear ones went to a learn-more list.
- [ ] Reach, hurt and evidence are scored and I wrote down why the top five are the top five.
- [ ] Each epic candidate lists the parts it touches and passed the size test.
- [ ] I did not write the epics yet.
- [ ] My checkpoint talk is under five minutes and names an unknown.
- [ ] I recorded AI use.

## 9. Further learning

Atlassian's story mapping guide and its user stories article show how a journey becomes a backlog. NN/g's service blueprint article helps you spot front-stage and back-stage breaks. NN/g's prioritisation methods article and the UK government's service standard give you more formal ways to rank and sense-check. When you are ready, move to the [roadmapping and epics track](/library/tracks/roadmapping-and-epics/), where you will write your first epics by hand.
