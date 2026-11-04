---
title: "Sensei handbook 3: feedback sentences that work"
description: "A simple shape for feedback, sentences you can adapt, and phrases to avoid. Written for coaches and for learners who read English as a second language."
section: "Sensei handbook"
order: 3
level: core
duration: "25 min"
outcomes:
  - "Give feedback in three parts: what you saw, why it matters, and a question or choice."
  - "Adapt ready-made sentences for strong work, unclear work and missing evidence."
  - "Label how important each comment is, so the learner knows what must change."
resources:
  - gitlab/handbook-guidance-on-feedback
  - google/engineering-practices
  - google/rework-coach-using-the-grow-model
  - gitlab/handbook-building-trust
prerequisites:
  - sensei-run-a-30-minute-review
updated: 2026-11-03
---

## Why this matters

Feedback is where a review helps or hurts. The same fact can lift a learner or end their week. Many learners read and listen in a second language. Idioms, jokes and long sentences make it worse. Clear and kind are the same skill.

You give feedback about **the work**, never about the person. Say "the epic has no measure", not "you are careless".

## Key ideas

### The shape: see, matter, ask

Use three short parts. Each part is one sentence.

1. **See.** Say what you saw, with the place. "In `epics/returns.md`, the outcome says 'improve the experience'."
2. **Matter.** Say why it matters, in the rubric's terms. "Without a measure, an agent and a reviewer cannot tell when the epic is done."
3. **Ask or offer.** Ask a question or give a choice. "What would a café owner notice after this epic ships?"

This is the same idea as the Situation, Behavior, Impact method in [GitLab's feedback guidance](https://handbook.gitlab.com/handbook/people-group/guidance-on-feedback/) and the advice to comment on the code and not the developer in Google's [how to write review comments](https://google.github.io/eng-practices/review/reviewer/comments.html). Read both once. They are short.

### Label each comment

Tell the learner how much each comment matters. Use three labels, always at the start of the sentence.

| Label | Meaning | Example |
| --- | --- | --- |
| **Must fix** | The rubric needs this before level 3 | "Must fix: epic 3 has no scope-out list." |
| **Consider** | A good idea, not required | "Consider: add a date to each milestone." |
| **FYI** | Something for later, no action now | "FYI: later you may want one agent per milestone." |

### Praise with evidence

"Good job" teaches nothing. Name what was good and where. "Your persona for the café owner uses three real interview notes. That is why I believe it." The learner then repeats it next week.

### One priority at a time

Give two strengths and **one or two** priorities. A learner who hears eight problems fixes none of them. Keep the other six in your notes for the next review.

## Step by step

1. **Find the evidence** in the files. Write the file name.
2. **Choose the label** (Must fix, Consider, FYI).
3. **Write the three parts** in short sentences. Cut every word you do not need.
4. **Say it aloud** in a calm voice. Then stop talking and let the learner answer.
5. **Ask the learner to say the next step back** in their own words. If they cannot, say it more simply.

## Sentences you can adapt

TrailMug is the Dojo's example product: reusable cups for cafés. It is invented. Replace it with the learner's product.

### When the work is strong

- "Your repository map shows every integration, with an owner for each. That is level 3 evidence for skill A. Which one worries you most?"
- "I like that your roadmap says what you chose not to do. It shows you can defend the order."
- "You explained the epic without notes. I could follow it the first time."

### When the work is unclear

- "I cannot tell who the user is in this epic. Who is the first person who notices the change?"
- "Must fix: the measure says 'more returns'. How many, by when, counted how?"
- "I read this as a task list. What problem does the user have that these tasks solve?"

### When evidence is missing

- "I could not find the evidence summary. Is it in a different place, or not written yet?"
- "The score sheet has no example next to skill C. Which file shows it?"
- "I looked for the AI-use note in the weekly note and did not find it. Where did you write it?"

### When the learner used an agent

- "Show me the brief you gave the agent. What would it do if it misunderstood one line?"
- "What did you check when the result came back? Show me the diff or the test you read."
- "Using AI is fine. I need to see what the agent did and what you decided. Can you add that to the note?"

### When the learner is stuck

- "What have you tried? What happened?"
- "Which part is clear, and which part is a fog?"
- "What is the smallest step you could finish this week?"

### When the learner is defensive

- "I am looking at the work, not at you. I am on your side."
- "You may be right. Show me the evidence, and I will change my note."
- "Let us write down our two views and look again next week."

### Closing the review

- "Two strengths: ... One priority: ... What will you do next, and by when?"
- "I will send a short written summary today. Please tell me if anything is wrong."

## Phrases to avoid

| Do not say | Why | Say instead |
| --- | --- | --- |
| "This is easy." | It makes the learner feel slow | "This step is small." |
| "Obviously" or "just" | It hides the hard part | Say the step |
| "You always" or "you never" | It is about the person | "In this file ..." |
| "You will pass" or "you will get hired" | A promise you cannot keep | "Here is what I saw in the work." |
| "A real developer would ..." | It insults | "In this case, one option is ..." |
| "Let us touch base" or other idioms | They do not translate | "Let us talk again on Friday." |

## The 2030 Product Development Manager lens

- **You decide:** which one or two priorities matter most for this learner this week.
- **You delegate:** you may ask an agent to turn your rough notes into a clean written summary. Brief: "Rewrite these notes as short, plain sentences. Keep the labels. Do not add new points or any praise I did not write."
- **You verify:** read every sentence of the summary before it goes out. Check that it says only what you saw, and that it makes no promise.
- **Other disciplines:** feedback on a brand sheet or a mockup is design feedback. If you are not sure, say so, and ask another Sensei with that skill. Money, operations and security comments need the same evidence rule.
- **Ladder:** a learner at the **delegate** rung needs feedback on their briefs: goal, limits, acceptance criteria, checks. Give the same feedback on a brief as on an epic.

## Common mistakes

- **Sandwiching.** Praise, a hidden problem, praise. Learners learn to distrust praise. Say the priority clearly.
- **Too many labels.** If everything is **Must fix**, nothing is.
- **Feedback with no next step.** End every piece with a question or an action.
- **Cultural guesses.** Some learners do not like being praised in public. Some do not question a coach. Ask: "How do you like to get feedback?"
- **Rewriting for them.** Offer a question, not your own sentence.

## Practice

Take this made-up epic outcome: "Make TrailMug better for cafés." Write three pieces of feedback using see, matter, ask: one **Must fix**, one **Consider**, and one strength with evidence. Keep each to three short sentences. Read them aloud. Ask a friend who reads English as a second language if they understood on the first hearing.

## Checklist

- [ ] Each comment says what I saw, why it matters, and a question or choice.
- [ ] Each comment has a label.
- [ ] I gave two strengths with evidence, and no more than two priorities.
- [ ] I talked about the work, not the person.
- [ ] I made no promise about jobs, pay, certificates or rewards.
- [ ] The learner said the next step back to me.
