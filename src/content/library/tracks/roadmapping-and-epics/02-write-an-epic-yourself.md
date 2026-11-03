---
title: "Write an epic yourself"
description: "Write a complete epic by hand, line by line: the person, the problem, a measurable outcome, scope in and out, the parts touched, dependencies, risks and an owner."
section: "Roadmapping and epics"
order: 2
track: "roadmapping-and-epics"
level: "core"
duration: "3 hours"
outcomes:
  - "Write an epic that follows the Dojo template, in your own words"
  - "Write a measure with a starting point, a target and a date"
  - "Write an out-of-scope line that protects the epic from drift"
  - "Review your own epic against a quality bar, and defend it aloud without notes"
resources:
  - "atlassian/user-stories"
  - "atlassian/definition-of-done"
  - "atlassian/project-poster"
  - "gitlab/issues"
  - "gitlab/description-templates"
prerequisites:
  - "epic-standard"
  - "template-epic-roadmap"
  - "people-write-epics"
updated: 2026-11-03
---

**Supports:** Developer, week 3 (Problems to epics): "write each epic in the template". **Time:** about three hours for two epics, spread over two sittings.

## 1. Why this matters

Writing an epic is the most important thing you do in the Dojo. It looks like paperwork. It is actually thinking made visible. To fill in each line you must decide who the epic is for, what will be different afterwards, how you will know, what you will not do and what could go wrong. Skipping any of those decisions does not make them go away. It leaves them for an agent to guess, or for a customer to discover.

The Dojo rule is that **you write every epic yourself**. Here is the full reasoning, because you will be tempted to break it:

- **An agent sees only what you show it.** An epic depends on the phone call you had last week, the promise sales made and the money left in the budget. No prompt holds that.
- **An agent agrees too easily.** It will produce a confident epic for any idea, good or bad. It will not tell you the epic is the wrong one.
- **You learn by writing.** The act of choosing words forces the decisions. If an agent chooses them, you cannot defend them when someone asks a hard question.
- **The epic is what you hand to the agents.** Good milestones and issues come from a clear epic. If the epic was generated, the whole chain sits on sand.

For a Product Development Manager (PDM) the payoff is concrete. A sharp epic lets several agents work in parallel without a meeting. A vague epic produces a polished mistake that nobody owns.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Every line of the epic: who, what, why, measure, scope, risks | Spelling and grammar after you finish; asking you hard questions; finding vague words | The epic is understandable by a stranger and defensible by you without notes | Finance (cost and benefit), operations (who runs it), security and privacy (data touched), design (what people will see), sales and support |

## 2. Key ideas

### The epic template

The Dojo's [epic standard](/library/epic-standard) and [roadmap template](/library/template-epic-roadmap) use these fields. Here is what each one is for.

| Field | What it holds | The question it forces |
|---|---|---|
| **Title** | The outcome, for a person | What changes for whom? |
| **Who** | The persona and the journey step | Who exactly, and where in their story? |
| **Problem** | What is wrong today, in the person's words | Is this real, and how do I know? |
| **Goal / outcome** | What will be true when the epic is done | What does success look like? |
| **Measure** | A number, with a start, a target and a date | How will I know? |
| **Parts touched** | Repos, systems, policies | Does this cross parts? Which? |
| **In scope** | What the epic will do | What is included? |
| **Out of scope** | What it will not do | What am I refusing, for now? |
| **Interfaces** | Names of events, fields, addresses (names only, never secret values) | How do the parts connect? |
| **Acceptance** | Checks a person can test | When is it truly done? |
| **Dependencies** | What must come first | What is blocking? |
| **Risks** | What could go wrong, and who accepts each | What am I betting on? |
| **Owner** | One named human | Who answers questions? |

### A good title

The title is an outcome for a person. Compare:

| Weak | Strong |
|---|---|
| Landing pages | Visitors can request a welcome cup |
| Payment system | Members can pay and cancel without calling us |
| CRM integration | Sales sees the same member cases as the app |

A strong title can be tested by a person. A weak title is the name of a thing to build.

### A good measure

A measure is how the epic **proves itself**. It needs four things:

1. **What you count** (a number, a rate, a time).
2. **The starting point** (today it is X, or "not measured yet").
3. **The target** (we want Y).
4. **The date** (by when).

"Increase sign-ups" is not a measure. "Raise the share of visitors who reach sign-up from 4 percent (baseline from the last four weeks) to 8 percent by 31 January" is. If you do not have a starting point, the first job of the epic is to measure it, and you should say so.

Prefer measures that reflect **what people do** over measures of how much you built. "20 pages published" tells you about your effort. "Sixty percent of new members receive a welcome message within five minutes" tells you about the customer.

Be honest about numbers you do not know. A target without a baseline is a guess. Mark it as one.

### Scope in and out

The **in scope** line states what the epic delivers. The **out of scope** line is more important: it names things that people will reasonably ask for and that this epic will not do. Without it, an epic grows. With it, you can say "yes, later" with a written reason. When an agent later proposes a clever extra, the out-of-scope line is your answer.

### Parts touched and interfaces

Naming parts keeps you honest about the size. Mark each as **exists** or **planned**, as on your product map. If you find yourself listing only one part, the work is a milestone, not an epic. In the interfaces line, write the names of the connections: the event "member.created" with fields email, name and city; the secret **named** `trailmug-mail-api-key`; the environments dev, staging and prod. Names only. Never secret values.

### Acceptance

Acceptance lines are checkboxes that a person can test without special knowledge. They describe visible results. Atlassian's definition of done is a useful companion: a shared statement of when work is truly finished.

### Risks you accept

Write the top risks and the name of the person who accepts each. A risk without an owner is a worry. A risk with an owner is a decision.

### Owner

One named human. Not a team, and never an AI. The owner answers questions and records decisions in the epic's comments.

## 3. Step by step

### Step 1: Pick one candidate from your sorted list

Choose an epic from the previous lesson. Start with the one you understand best, because your first epic will teach you how to write the rest.

### Step 2: Write the title and the person

Write the title as an outcome. Write the persona's name and the journey step. If you cannot name the step, go back to your journey.

### Step 3: Write the problem from evidence

Two to four sentences, using what people said and did. Include a source code or a link to your notes. If a sentence is a guess, mark it.

### Step 4: Write the outcome and the measure

First the outcome in a sentence. Then the measure: what you count, the starting point, the target, the date. If you have no baseline, write "baseline: not measured; first task is to measure it".

### Step 5: Write in scope and out of scope

Write three to six items in scope and **at least three** out of scope. For each out-of-scope item, add a few words of reason.

### Step 6: List the parts and interfaces

List each repo, system or policy, mark it exists or planned, and say what it does for this epic. Then list interfaces by name.

### Step 7: Write acceptance, dependencies, risks and owner

Acceptance: three to six checks a person can run. Dependencies: what must come first, and why. Risks: three, each with an acceptor. Owner: one name.

### Step 8: Review as a stranger

Leave the epic for a day. Then read it as someone who knows nothing about the product. Underline anything you could not explain. Fix it. Then try this test: **explain the epic aloud for two minutes without notes.** If you stumble, you have found the line you did not truly decide.

### Step 9: Save it in git

Save the epic as a file. The next lessons show how to put it into GitLab. Keep the file as the first version, with a date.

## 4. Worked example: TrailMug

TrailMug is fictional. This epic was written by the founder, by hand, from the break list. The numbers are illustrative.

```text
Title: Café owners can join, run returns and see what TrailMug brought them
Who: Leo, café owner, at the Aware, Buy and Onboard stages [P1, P2, P3].

Problem: Leo wants to try TrailMug but cannot. There is no page for café
  owners, no terms to read and no guide to running a return. Two owners
  said, "I would try it, but I need to know what it involves" [P2, P3].
  Today the founder explains everything by phone, which does not scale.

Outcome: A café owner can read what is involved, sign the partner terms,
  run a return in under 30 seconds and see a monthly report of the members
  TrailMug brought, without phoning us.

Measure: Partner cafés that complete setup without a phone call.
  Baseline: 0 of 3. Target: 10 of 12 new cafés by 30 April.
  Second measure: share of cafés still active after 60 days (baseline unknown;
  first measure in month 2).

Parts touched:
  - trailmug-lp-cafes (planned): partner page and sign-up
  - trailmug-ops (planned): partner terms, privacy notice for café data
  - trailmug-docs (planned): setup guide, "how to run a return"
  - trailmug-svc-returns (planned): records swaps per café
  - trailmug-analytics (planned): monthly report
  - Email provider (rented): welcome and monthly emails

In scope: partner page; partner terms; setup guide; swap recording;
  monthly report by email.
Out of scope: payment of fees to cafés (decision first: see risk 2);
  an app for baristas; any café outside our delivery area;
  loyalty points (no evidence).

Interfaces: event "swap.recorded" with fields cafe_id, cup_id, time.
  Secret name: trailmug-mail-api-key. Environments: dev, staging, prod.

Acceptance:
  - [ ] A café owner reads the terms and signs them on the page
  - [ ] A barista can record a swap in under 30 seconds in a test at a café
  - [ ] The owner receives the first monthly report within a day of month end
  - [ ] No personal data of members appears in the café report

Dependencies: a decision on how cafés are paid (before the report is built);
  privacy notice approved by an adviser before any café data is collected.

Risks I accept:
  1. Lunchtime queues make swaps too slow. Accepted by the founder.
  2. Fee rules for cafés are unclear. Accepted by the founder; decision due 15 Feb.
  3. Only a few cafés join. Accepted by the founder.

Owner: the founder. Decisions are logged in the comments.
```

Read it as a stranger. Who, what, how measured, what is not included, which parts, what is blocking and who owns it are all visible in about 40 lines. An agent, or a new teammate, can work from it without a meeting.

## 5. Working with AI agents on this

This is where the Dojo rule bites: **an agent does not write, rewrite or "improve" your epic.** That includes asking it to "tidy up" a draft, because a tidy draft by an agent smooths away the thinking.

What an agent may do is act as a **critic after you finish**.

**Delegate:**

- **Spelling and grammar** only after the epic is complete and saved.
- **Hard questions.** "Ask me the ten hardest questions a sceptical finance director would ask about this epic. One at a time." You answer aloud.
- **Vague-word detection.** "List every word or phrase in this epic that two people could read differently."
- **A consistency check against your map.** "List every part named in the epic that is not in my product map, and every outcome line that is not covered by an acceptance check."

**Do yourself:**

- Every sentence of the epic.
- The decision on every question the critic raises.

**A brief you can adapt:**

```text
Below is an epic I wrote myself. Do not rewrite it and do not suggest
new text. Act as a sceptical reviewer.
1. List words or phrases that are vague or could be read two ways.
2. List any outcome that has no acceptance check.
3. List any part of the product mentioned that has no stated role.
4. List any risk that has no named person.
5. Ask me the five hardest questions about the measure.
Answer as five numbered lists.
```

**How to check the output.** For each point, decide yourself whether the epic should change. Do not accept a suggestion because it sounds good. Fix the epic in your own words. Then check that your fix actually answers the point.

**Where agents mislead.** An agent may praise a weak measure ("clear and measurable") if it contains numbers. Check that the number is something you can count and that it has a baseline and a date.

**Disclose.** At the bottom of each epic file: "AI use: spelling check and reviewer questions on [date]. I wrote and decided every line."

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **use**. You write the epic. An agent may question it. The epic template is the first piece of written policy: it says what every epic must contain before any agent reads it. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the two upper rungs.

## 6. Common mistakes

- **Writing the epic as a solution.** "Build a partner portal" says how, not what changes.
- **A measure with no baseline or date.** It cannot show success or failure.
- **A measure of effort.** Count what people do, not how much you built.
- **No out of scope.** The epic will grow until it is late.
- **Only one part touched.** It is a milestone. Check the size tests.
- **Secrets in the interfaces line.** Write their names only.
- **Risks with no owner.** Name who accepts each.
- **Asking an agent to write or improve the epic.** You skip the learning and cannot defend it.
- **Not testing it aloud.** If you cannot explain it for two minutes without notes, it is not yet your epic.

## 7. Practice: write two epics by hand

**Deliverable:** two files in your git repo, `roadmap/epics/epic-01-<slug>.md` and `epic-02-<slug>.md`.

1. Each follows the template: title, who, problem, outcome, measure (with baseline, target and date), parts touched, in scope, out of scope (at least three items), interfaces (names only), acceptance (three to six checkboxes), dependencies, risks (three, each with an owner) and owner.
2. Each ends with your AI-use line.
3. A short `roadmap/epics/README.md` listing the two epics and the date you wrote them.

Write by hand: do not paste text from an agent. Commit with a message like `Add first two epics`.

**Check:** two days later, explain each epic aloud for two minutes without notes, ideally to another person. Write down every place you stumbled. Fix those lines.

**Stretch:** run the reviewer brief with an agent. Save the answer in `roadmap/epics/review-notes.md` with two columns: "What I changed" and "What I rejected and why".

## 8. Checklist

- [ ] The title is an outcome for a person.
- [ ] The problem uses evidence, with a source or a G mark.
- [ ] The measure has what I count, a baseline, a target and a date.
- [ ] At least three things are out of scope, with reasons.
- [ ] Parts touched are named and marked exists or planned; there are several.
- [ ] Interfaces are names only, with no secret values.
- [ ] Acceptance lines can be tested by a person.
- [ ] Every risk has a named person.
- [ ] One human owns it.
- [ ] I wrote every sentence myself, and can explain it for two minutes without notes.
- [ ] I recorded my AI use.

## 9. Further learning

Atlassian's pages on user stories and the definition of done give you vocabulary for acceptance. The Atlassian Team Playbook project poster is a useful one-page format to compare with your epic. GitLab's docs on issues and description templates show how to store your epic template in your repository so each new epic starts with the right headings. In the next lesson you will put your epics in order, and write the reason for each position.
