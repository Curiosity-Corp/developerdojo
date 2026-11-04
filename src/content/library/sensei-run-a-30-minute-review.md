---
title: "Sensei handbook 2: run a 30 minute review"
description: "A minute-by-minute plan for one review of a learner's work, using the Product Package rubric and the weekly checklist."
section: "Sensei handbook"
order: 2
level: core
duration: "30 min"
outcomes:
  - "Prepare for a review in 15 minutes or less."
  - "Run a 30 minute review that ends with one next step chosen by the learner."
  - "Score the six rubric skills with one piece of evidence each, and no more than the rubric allows."
resources:
  - google/engineering-practices
  - gitlab/merge-request-reviews
  - google/rework-coach-using-the-grow-model
prerequisites:
  - sensei-role-and-limits
  - product-package-rubric
  - weekly-checklist-track-a
updated: 2026-11-03
---

## Why this matters

A review is the main thing a Sensei does. It is also easy to do badly: too long, too vague, or too much talking by the Sensei. A short, fixed shape keeps it fair. The learner leaves with one clear next step. You leave with notes you can trust.

A review checks **evidence**, not promises. The learner's work lives in git. You open the files and look.

## Key ideas

### Two documents run every review

- **The [Product Package rubric](/library/product-package-rubric).** Six skills (whole-product view, customers and personas, journeys and touch points, writing epics, roadmap and priorities, hand-off to agents). Each is scored from 1 to 4. The target is level 3 on all six, with none below level 2.
- **The [weekly checklist for Track A](/library/weekly-checklist-track-a).** For weeks 1 to 4 it lists what the learner must finish, and marks with **[M]** the items a coach checks. For weeks 5 and 6, use the [Product Package standard](/library/product-package-standard).

You do not add anything to them. If you think something is missing from the rubric, write it down as an idea for the Maintainer. Do not use it in the score.

### What you check each week

| Week | What the learner brings | What you check |
| --- | --- | --- |
| 1 | One-page map, repository map, integrations register | The learner walks you through the map in 10 minutes. Are all repos and integrations there, with an owner? |
| 2 | Personas, touch points, journeys, evidence summary | One persona and one journey, with the evidence behind each claim |
| 3 | 4 to 8 epics, roadmap order | Hard questions about an epic, answered without notes. Is each epic in the learner's own words? |
| 4 | Revised epics, milestones, 10 minute roadmap talk | The roadmap talk, including what the learner chose **not** to do |
| 5 | Brand, website, mockups ([week 5](/library/week-5-brand-website-mockups)) | Does each mockup link to an epic? Does the site say who the product is for? |
| 6 | Catalogue, demo, package ([week 6](/library/week-6-catalogue-demo-package)) | The eight package parts are present. Missing parts are gaps to fix. They are not a score. |

## Step by step

### Before the review (about 15 minutes)

1. **Ask for the link 24 hours ahead.** The learner sends the repository link and their ticked checklist. Check you have been given access. If not, ask. Do not use someone else's login.
2. **Open the checklist for that week.** Pick the **[M]** items.
3. **Open the files the checklist names** (for example the repository map or `epics/`). Note one thing that is strong and one that is unclear.
4. **Ask the learner to score themselves first.** The rubric has a score sheet. Score the six skills 1 to 4 on their own. Your own score comes after, so theirs is not changed by yours.
5. **Check the time zone** and agree the video tool. Send the plan below, so nothing is a surprise.

### During the review (30 minutes)

| Minutes | What happens | Who talks |
| --- | --- | --- |
| 0 to 3 | Welcome. Say the plan. Say: "This is a review of the work, not of you." | You |
| 3 to 8 | The learner shows the work and says what they decided and why | Learner |
| 8 to 18 | You open the evidence files. Check the **[M]** items. Ask the honesty questions below. | Both |
| 18 to 25 | Give feedback: two strengths with evidence, one or two priorities. Use [page 3](/library/sensei-feedback-sentences). | You, then learner |
| 25 to 29 | The learner chooses the next step and writes it down in their own words | Learner |
| 29 to 30 | Say when you will send the written summary. Close. | You |

### Three honesty questions (every review)

These come from the rubric. Ask them in a friendly voice.

1. "Did you write every epic and roadmap sentence yourself?"
2. "Where did you use AI, and did you say so?" Check the AI-use note in the weekly note or the package. See [Disclose AI use](/library/disclose-ai-use).
3. "Can you explain this epic out loud, without notes?" Then stay quiet and wait. Silence is not a problem.

If the answer to question 1 is no, do not accuse and do not guess. Write what you saw and ask the Maintainer ([page 6](/library/sensei-when-to-ask-the-maintainer)). Using AI is fine. Hiding it is the problem.

### Scoring

1. For each of the six skills, choose the level that matches **one piece of evidence you opened**. Write the evidence next to the score ("Epic 2 has a measure and a scope-out list").
2. If you cannot find evidence, score what you can see, and say "no evidence found" in the note. Do not give the benefit of the doubt, and do not punish what is missing from a week that has not happened yet.
3. Compare with the learner's own scores. Talk about the **gaps**. That is where people learn most.
4. Read the result with the rubric's words: level 3 or above on all skills is a pass of the rubric. Any skill at 2 means a plan to lift it. Any skill at 1 means repair that skill first.

You score the rubric. You do not decide certificates. State that once, plainly, at the start.

### After the review (10 minutes)

1. Send the learner a short written summary the same day: strengths, priorities, the next step they chose, the scores with evidence.
2. Put your score in the coach column if the learner gave you that access. Do not copy the learner's work anywhere else.
3. Fill in the [review sheet](/library/sensei-review-sheet) for your own record, and keep it private ([page 5](/library/sensei-privacy-and-conduct)).
4. If something needs the Maintainer, send it now.

## The 2030 Product Development Manager lens

- **The learner decides:** what the product is for, which epics exist, in what order, and what they will not do. You check that these are decisions and not copied suggestions.
- **The learner delegates:** from week 4, whole milestones go to an agent with a written brief. Ask to see one brief. Does it have the goal, the limits and the acceptance criteria?
- **A brief you can ask for:** "Show me the brief you gave the agent. Show me the acceptance criteria. What did you check when it came back?"
- **How you verify:** open the files and the history in git. Read what the learner claims. Do not rely on a summary the learner (or an agent) wrote about itself.
- **Other disciplines:** ask where design, money, operations and security show up in the plan. If one is missing, say which and ask a question.
- **Ladder:** weeks 1 and 2 are **use**. Week 3 is human only for epics. Week 4 begins **delegate**. A learner who talks about running several agents at once has moved to **orchestrate**. Ask how they would keep it safe, which is the **govern** question.

## Working with AI agents on this

You may use an agent to save time **before** the review, for example to list which checklist items have an evidence file. A brief you could adapt:

> Here is the weekly checklist and a list of file names from the learner's repository. For each checklist item, say whether a matching file exists, and quote its first line. Do not score. Do not rewrite anything.

Rules: only with the learner's yes, only file names and short quotes, no secrets, no personal details. You open every file yourself before you say anything about it. You still write the score and the feedback. Tell the learner you used the agent. See [page 5](/library/sensei-privacy-and-conduct).

## Common mistakes

- **Talking for 20 minutes.** The learner should talk more than you.
- **Reviewing the whole repository.** Pick the **[M]** items and two skills. Say what you did not look at.
- **A score with no evidence.** If you cannot point at it, do not score it.
- **Surprise scores.** Share the plan first, and ask for the learner's own scores before you give yours.
- **Ending without a next step.** The last question is always: "What will you do next, and by when?"
- **Making it personal.** Talk about the work: "the epic", not "you".

## Practice

Run a mock review with a friend or another new Sensei. Use only this page and the rubric. Give the learner one week's items from the table. Time it. Then answer: Did it end in 30 minutes? Did the learner choose the next step? Which question did you have to ask that this page did not answer? Send that question to the Maintainer as an idea to improve this handbook.

## Checklist

- [ ] I have the repository link and access, and the learner's own scores.
- [ ] I opened the **[M]** files before the session.
- [ ] I said the plan and that I score the rubric only.
- [ ] I asked the three honesty questions.
- [ ] I have one evidence line for each score.
- [ ] The learner chose a next step in their own words.
- [ ] I sent the written summary the same day.
