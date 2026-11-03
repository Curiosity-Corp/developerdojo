---
title: "People write epics"
description: "Why a human, not an AI, must write the epics and the roadmap, and what AI may still do."
section: "The Way"
order: 2
---

**Rule 1: people write epics and roadmaps. AI never does.**

## Words to know

- **Epic.** A big outcome for a whole product. It touches several parts of the product and takes weeks or months.
- **Roadmap.** The epics laid out in order over time.
- **Milestone.** A smaller slice of work with a date, usually inside one repository.
- **Issue.** One task. One agent can finish it in one change.
- **Repository (repo).** A folder of files with a full change history.

## The four levels

| Level | Size | Who owns it |
|---|---|---|
| Vision | Why the product exists | The human product owner |
| Epic | A whole-product outcome, weeks to months | The human epic manager |
| Milestone | A slice with a date, days to three weeks | A human sets the goal and date |
| Issue | One task, hours | An AI agent drafts and builds. A human approves. |

Higher levels need knowledge that is not in the code. Lower levels need clear instructions. AI is best at clear instructions.

## Why AI must not write your epic

1. **It has not met your customer.** It does not know what she said on the phone last week.
2. **It does not feel the market.** It does not know a competitor launched yesterday.
3. **It sees one repo at a time.** An epic crosses many.
4. **It never says "we should not build this".** It agrees too easily.
5. **It writes plausible, empty epics.** "Improve engagement across the platform" sounds fine. Nobody can measure it.
6. **It forgets.** Sessions end. You must be able to explain, three months later, why you chose this.

> If the work needs knowledge that is not in the repo, a human must own it. Customers, markets, risk and priorities are never in the repo.

## What AI may do

| AI may | AI may not |
|---|---|
| Explain a word you do not know | Decide who the customer is |
| Fix your spelling and grammar | Write the epic goal or the success measure |
| Check your epic for gaps and ask questions | Decide the order of the roadmap |
| Translate your text | Decide what the product is or is not |
| Summarise a long document | Invent personas, quotes or journey steps |
| Break a milestone that you wrote into issues | Approve its own work |
| Build the issues | Change the epic scope without you |

## The test before you use AI

Ask: **"Did I already decide this?"** If yes, AI may format it, check it or translate it. If no, decide first. Think, then use the AI.

## The five-question test

Ask these about any task. If you say yes to any one, a human owns the task.

1. Does it need knowledge of a customer, a market or a competitor?
2. Does it span more than one repo?
3. Does it decide what to build, or what not to build?
4. Does it set a priority that affects money or time?
5. Will someone need to explain "why" in three months?

## Allowed and not allowed

**Allowed.** You write notes in your own words. You ask: "Turn my notes into the epic template and list any gaps." The AI asks, "Who pays, the cup owner or the café?" You answer.

**Not allowed.** You type: "Write the epic for a cup subscription." You paste the smooth result into your project. Now nobody owns it.

## How we check

Your epics live in git with full history. You explain each one out loud, without notes, to a coach. If you cannot explain it, it is not yet your epic.

## Key points

- Humans write epics and roadmaps. AI builds issues.
- AI may draft, format, check, translate and ask questions. It may not decide.
- If you cannot explain it without notes, you do not own it yet.
