---
title: "Write the one-pager and the weekly note"
description: "Write a one-page brief that states the goal, people and risks, and a short weekly note that reports what shipped, what did not, what you learned and what you need, in words busy people read."
section: "Stakeholder communication"
order: 2
track: "stakeholder-communication"
level: "core"
duration: "2.5 hours"
outcomes:
  - "Write a one-page brief that gives everyone the same picture"
  - "Write a weekly note of under 200 words that reports honestly"
  - "Work in writing by default and keep one source of truth"
  - "Review an agent's draft message for truth, tone and completeness before it is sent"
resources:
  - "atlassian/project-poster"
  - "atlassian/product-brief"
  - "gitlab/handbook-communication"
  - "gitlab/operating-principles"
  - "github/open-source-guides-best-practices"
prerequisites:
  - "week-4-defend-the-roadmap"
  - "git-is-the-source-of-truth"
updated: 2026-11-03
---

**Supports:** Developer, weeks 4 to 6: the weekly note and the clear one-page summary. **Time:** about two and a half hours.

## 1. Why this matters

Busy people read short things. A sponsor with ten projects will not read your twelve pages, but she will read half a page every Friday. The one-pager and the weekly note give you a reputation for clarity, and they build the trust you need when the news is bad.

Writing is also thinking. If you cannot state your goal in two sentences, you do not yet have one. If you cannot say what shipped this week without using the word "progress", maybe nothing did.

A Product Development Manager (PDM) writes for many readers at once: sponsors, partners, builders and agents. The same page may brief a mentor and an agent. Plain, specific, honest words work for both.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What the goal, risks and asks are; what is said, to whom, and what is left out | Turning your facts into a first draft; shortening; checking that the numbers in the note match the repo | Every statement is true and sourced; nothing promised that you cannot deliver; the tone is right for the reader | Legal and privacy (what may be said), sales and support (what they will repeat), finance (cost and runway) |

## 2. Key ideas

### The one-pager

Atlassian's project poster and product brief pages both show a one-page way to state what the work is and who is involved. The Dojo's version has these parts:

1. **Goal:** one or two sentences. What changes for whom.
2. **People:** who it is for, who is involved, who decides.
3. **Scope:** what is in and what is out.
4. **Plan:** the next milestone and its date.
5. **Risks:** the top three, each with an owner.
6. **Measures:** how we will know it worked.
7. **Asks:** what you need from the reader, by when.

Keep it to one page, in a file in git. Update it when the facts change, and keep the old versions in the history.

### The weekly note

A short regular message, under 200 words. A shape that works:

- **Shipped:** what a person can now do that they could not last week.
- **Did not ship:** what you planned and did not finish, and why, in one line.
- **Learned:** one thing you now know.
- **Next:** the goal for next week, in one sentence.
- **Need:** what you need from the reader, with a date, or "nothing".

Send it on the same day each week, whether the week was good or not. Regularity builds trust, and the bad weeks are the ones that matter.

### Write things down, work in the open

GitLab's public handbook describes writing things down, working in public by default and keeping a single source of truth. You do not need a company's size to use the habits. A product team of one benefits from them, because a month later you will not remember why you decided something. Put the notes in the repo so that everyone, including agents, reads the same version.

### One source of truth

When facts live in many places, they drift. Decide where each fact lives: the roadmap in `roadmap/`, decisions in `roadmap/decisions.md`, the stakeholder table in `stakeholders/`, notes in `stakeholders/notes/`. In a message, link to the source instead of copying it. If you must copy, say the date.

### Plain words

Prefer short sentences and common words. Say "we will finish the sign-up page on Friday" instead of "we are targeting a Friday delivery for the onboarding capability". Replace "fast", "soon" and "robust" with numbers and dates. Open-source projects have practice here: GitHub's guide to best practices for maintainers covers writing things down, setting expectations and saying no kindly, habits that carry into any product.

### Honest about the bad weeks

Say what happened, what you will do and what you need. Do not hide a slip in good news. Do not pad with detail to look busy. Do not blame a person or an agent. You are accountable.

### Agents writing messages

An agent can draft a message from your facts. It will usually produce confident, smooth text that includes claims you did not make. It may promise dates, invent numbers or soften bad news until it is false. The rule in the Dojo: **nothing external is sent until a person has read it, word by word.**

## 3. Step by step

### Step 1: Write the goal

Two sentences. If you cannot, go back to your epic.

### Step 2: Draft the one-pager

Fill the seven parts from your roadmap and stakeholder table. Cut anything that does not fit on one page.

### Step 3: Test it on a reader

Give it to one person from your table. Ask: "In your words, what are we doing, and what do you need to do?" Fix what she got wrong.

### Step 4: Choose the reader and the day

Pick who gets the weekly note and the day it goes. Put the day in your calendar.

### Step 5: Write the first note from facts

Open the board and the decision log. Write the five parts, under 200 words. Use dates and numbers.

### Step 6: Cut

Remove any sentence that does not help the reader decide or act. Replace any vague word.

### Step 7: Check every claim

For each statement, find where you know it from. If you cannot, remove it.

### Step 8: Send and file

Send the note. Save a copy in `stakeholders/notes/YYYY-MM-DD.md`.

### Step 9: Ask for feedback

After four weeks, ask your readers: "What would you cut? What is missing?"

## 4. Worked example: TrailMug

TrailMug is fictional. The founder writes a one-pager for her mentor and the privacy adviser.

```markdown
# TrailMug: one page (2026-11-10)

**Goal.** Commuters like Maya can swap a used cup for a clean one at
partner cafés in under a minute. Cafés like Leo's lose no time at the
counter.

**People.** Users: commuters, café owners and staff. Back: mentor.
Control: privacy adviser (approval before launch). Build: founder, part-time
designer, AI agents with human review.

**Scope.** In: café sign-up, returns, monthly café report. Out: loyalty
points, event catering, a barista app.

**Plan.** Next milestone: two-café trial, ends 2026-12-15.

**Risks.** (1) Privacy notice not live before sign-up: owner founder, due
2026-12-01. (2) Cafés slower at the counter: owner founder, tested in the
trial. (3) Cup supplier delay: owner founder, backup supplier call by
2026-11-20.

**Measures.** A returned cup logged in under 10 seconds; at least 2
cafés in the trial; 0 complaints about counter time.

**Asks.** Mentor: read this and tell me what is missing by Friday.
Privacy adviser: confirm a review slot in the week of 2026-11-23.
```

**A weekly note:**

> **TrailMug, week of 2 Nov.**
> **Shipped:** a café owner can now fill in the sign-up form and I get the details within a minute. Two owners tested it.
> **Did not ship:** the phone layout. The postcode field is cut off on a small screen. Fix planned for Monday.
> **Learned:** owners were unsure whether to enter the owner's or the café's name. I will change the labels.
> **Next:** a café owner can finish sign-up on a phone.
> **Need:** privacy adviser: please confirm a review slot by Friday 13 Nov.

**What the review of an agent's draft found.** An agent's draft of the same note said "all systems are running smoothly and we are on track for launch". The founder struck it: there was no system to be "running smoothly", and the phone problem meant they were not on track for anything. She replaced it with the facts. The agent had turned "two owners tested it" into "extensive user testing". She restored the number.

## 5. Working with AI agents on this

**Delegate:**

- **A first draft of the weekly note** from a list of facts you give. "Use only these facts. Do not add numbers, dates or adjectives that are not here."
- **Shortening.** "Cut this to under 150 words. Keep every number and date unchanged."
- **A claim check.** "List each factual claim in this note and where in the attached files it is supported. Mark any without support."
- **A plain-words pass.** "List words in this text that two readers could understand differently."
- **A formatting pass** for the one-pager.

**Do yourself:**

- Decide what to report and what to leave out.
- Decide the asks.
- Write the first sentence of any bad news.
- Read the final text, word by word, before it is sent.

**A brief you can adapt:**

```text
Draft this week's note for my mentor from the facts below. Use only
these facts. Do not add numbers, dates, adjectives such as "great" or
"significant", or promises. Structure: Shipped, Did not ship, Learned,
Next, Need. Under 180 words.
After the draft, list every sentence that goes beyond the facts I
gave, so I can delete it.

FACTS:
- ...
```

**How to check the output.** Compare the draft with your facts line by line. Look for adjectives, intensifiers and "on track". Check that bad news is still visible and the ask is still clear.

**A rule for sending.** Agents prepare. A person sends. Never let an agent send external messages without a person reading them first. If you build tooling around this, make the person's approval a hard gate.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **delegate**, and it is where **govern** first becomes concrete. "Agents draft; people send" is a written rule. If you later automate notes, a gate that blocks sending until a named person approves is how you keep the rule true. The [agent orchestration track](/library/tracks/agent-orchestration/) covers the upper rungs.

**Disclose.** At the foot of each note: "Drafted with AI help; facts checked by me." Keep it plain.

## 6. Common mistakes

- **Writing to look busy.** Cut every sentence that does not help the reader.
- **Hiding bad news** in the middle of good news.
- **Vague words.** "Soon", "robust", "great progress". Use numbers and dates.
- **Skipping a week** when it was a bad week.
- **Copying facts into many places.** Link to the source.
- **Letting an agent add claims.** Give it facts and forbid extras.
- **Promising dates you do not control.**
- **Naming and blaming** a person or an agent.
- **Sending an unread draft.**

## 7. Practice: one page and four notes

**Deliverable:** in your git repo:

1. `stakeholders/one-pager.md`: the seven parts, one page.
2. `stakeholders/notes/`: four weekly notes, each under 200 words, one per week for four weeks (write the first now, and the rest as the weeks pass).
3. A `stakeholders/README.md` that says who gets the notes, which day, and where each fact lives.
4. A reader's comment from one real person on the one-pager, with what you changed.
5. Your AI-use line.

Commit with a message such as `Add one-pager and first weekly note`.

**Check:** read the note aloud. If you run out of breath or lose the point, cut.

**Stretch:** take one past note and rewrite it with every vague word replaced by a number or a date. Write two lines on what the exercise showed.

## 8. Checklist

- [ ] The one-pager has goal, people, scope, plan, risks, measures and asks.
- [ ] It fits on one page.
- [ ] A reader described it back correctly.
- [ ] The weekly note is under 200 words and has five parts.
- [ ] Every claim in the note is traceable.
- [ ] Bad news is visible, not buried.
- [ ] An agent never sent anything.
- [ ] Notes are filed in the repo.
- [ ] I recorded my AI use.

## 9. Further learning

Atlassian's project poster and product brief pages show one-page formats. GitLab's public handbook shows how a large team writes things down and keeps one source of truth, and its operating principles show the same habits in values form. GitHub's guide to best practices for maintainers has advice on writing things down and setting expectations. In the next lesson you use these skills to defend your roadmap in ten minutes.
