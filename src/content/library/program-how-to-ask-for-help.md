---
title: "How to ask for help"
description: "Where to ask, how to write a good question, and why asking early is a strength, with before and after examples and a short template."
section: "Program guide"
order: 8
level: foundation
duration: "20 min"
outcomes:
  - "Write a question that names the product, the file and what you already tried."
  - "Choose between the community chat and your weekly checkpoint."
  - "Turn a vague question into a good one."
  - "Use an agent to help you ask, without letting it answer for you."
resources:
  - gitlab/handbook-communication
  - digital-gov/plain-language
  - google/technical-writing
  - opensource-guide/how-to-contribute
prerequisites:
  - program-how-sensei-work
---

Everyone gets stuck. The people who finish the program are the ones who ask early, and ask well.

## Why it matters

A stuck builder who waits a week loses a week. A stuck builder who asks a clear question on day one often gets an answer in an hour. Asking early is a strength, not a weakness. It also helps others: your question is probably theirs too.

## Where to ask

| Where | Best for | Speed |
|---|---|---|
| The Developer Dojo community chat | Quick questions, tool problems, where to find something | Usually hours |
| Your weekly checkpoint with your Sensei | Thinking questions: scope, order, evidence, a stuck epic | Weekly |
| An issue or merge request in your planning repository | Questions tied to a file, with the history attached | When your Sensei reviews |
| The lesson's resources | Facts and how-tos | At once |

If it blocks you today, use the chat. If it is about your thinking, save it for the checkpoint, and write it down now.

## A good question has four parts

1. **The product.** Which product and which part.
2. **The file.** The exact file, page or link.
3. **What you tried.** Two or three things, briefly.
4. **What you expected, and what happened.** One line each.

## Before and after

| Before | After |
|---|---|
| "My map does not work. Help." | "Product TrailMug, file `map/repository-map.md`. I tried to list the repositories in the group, but the page shows only five. I expected twelve. I checked the group visibility and the search filter. Which setting am I missing?" |
| "Is my epic good?" | "Epic 2 'Safe, visible operations', file `epics/02-ops.md`. I am unsure about the measure: 'time to find a failure'. Is it one number a stranger could check? I considered 'number of alerts' and dropped it because it can grow with noise." |
| "The agent did something wrong." | "In merge request 14 an agent changed the file `roadmap.md`, which I told it not to touch. I have the prompt. Where should I record this, and how do I make the instruction stronger?" |

## A short template

```text
Product and part:
File or link:
What I wanted:
What happened:
What I tried (two or three things):
My own guess:
```

The last line, **my own guess,** matters. It shows your thinking and it helps the helper.

## Steps

1. Write the question in the template before you send it.
2. Read it aloud. Would a stranger understand it?
3. Remove anything private: names of customers, keys, personal details.
4. Send it to the right place.
5. Say thank you, and report what worked. The next person will find your answer.

## Working with AI agents

- **May:** help you shorten and clarify your question; explain an error message; suggest what extra detail a helper might need.
- **May not:** answer a thinking question about your epics or your roadmap. That is for your Sensei, and then for you.
- **A safe brief:** "Here is my draft question. Check it has the product, the file, what I tried and what I expected. List what is missing. Do not answer it."

## Common mistakes

1. **A question with no product or file.**
2. **No evidence of what you tried.**
3. **Asking too late.**
4. **Posting a secret or a customer's private data.**
5. **Never reporting the answer back.**

## Practice

1. Rewrite your last vague question with the template.
2. Ask one question in the community chat today.
3. Keep a list of "ask at checkpoint" questions. Add three.

## Checklist

- [ ] My question names the product, the file and what I tried.
- [ ] It contains no secrets or private data.
- [ ] I picked the right place to ask.
- [ ] I reported the answer back.

## The 2030 Product Development Manager lens

- **You decide:** what to ask and who to ask.
- **You delegate to agents:** tidying the question, finding the error text, checking the template is complete.
- **A sample brief:** "Rewrite this error message in plain words and list three things a helper would want to know. Do not guess the cause."
- **You verify by:** reading the helper's answer against your own file before you act.
- **Disciplines involved:** communication, support and community.
- **On the agent ladder:** asking well is the skill that lets you **delegate** well: a clear brief is a clear question.

## Further learning

Next: the [learning path week by week](/library/learning-path-week-by-week). Read [Say no, report risk and deliver bad news](/library/tracks/stakeholder-communication/04-say-no-report-risk-and-deliver-bad-news).
