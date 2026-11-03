---
title: "Weekly checklist: Track A, weeks 1 to 4"
description: "Every Track A item for weeks 1 to 4, each explained, with what to put in your git repository each week and what your coach checks."
section: "Assessment"
order: 4
level: foundation
duration: "10 to 12 hours per week"
outcomes:
  - "Know exactly what to finish in each of the four Track A weeks."
  - "Know which items your coach checks and which you check yourself."
  - "Keep your evidence in git, week by week."
resources:
  - gitlab/issues
  - gitlab/milestones
  - gitlab/epics
  - nngroup/journey-mapping-101
  - nngroup/personas-make-users-memorable
  - atlassian/product-roadmaps
  - git/pro-git
prerequisites:
  - rubric-track-a-self-assessment
  - week-1-see-the-whole-product
---

Tick each box when it is **really done**. Items marked **[M]** are checked by your coach. Track A is the planning half of the program and maps to Developer weeks 1 to 4 on this site, so each week below matches one weekly page.

| Track A week | Theme | Matching weekly page |
|---|---|---|
| 1 | See the whole product | [Week 1](/library/week-1-see-the-whole-product) |
| 2 | Know the people | [Week 2](/library/week-2-know-the-people) |
| 3 | From problems to epics | [Week 3](/library/week-3-problems-to-epics) |
| 4 | Defend the roadmap and hand off | [Week 4](/library/week-4-defend-the-roadmap) |

Make your own copy of this checklist before you start (for example `assessment/checklist.md` in your planning repo) so you can tick boxes without changing the original.

## How the checklist fits with git

Every week leaves **evidence in git**. At the end of each week your planning repository should contain the files named in the "What goes in git" table. Your coach opens the repository at the checkpoint, not a slide deck. Commit small and often, and use the weekly note template to say what you did.

## Week 1: See the whole product

**Goal:** no part of the product is a mystery to you.

### Items

- [ ] **Read the program guide and watch (or read) the deck "From Milestones to Epics".** The deck is on this site as a 16-lesson series, starting with [Deck 1](/library/deck-01-the-humans-job). Read lessons 1 to 5 this week.
- [ ] **Read the worked example product (remember: example only).** It shows the shape of a finished answer. Your product needs your own thinking.
- [ ] **List every repository of your product, with its URL or domain.** Every repo, domain and service, including the ones you do not control.
- [ ] **Mark each repo type.** Marketing site, app, squeeze page or tool, cloud microservice, integration, CRM, payments, ops.
- [ ] **Mark your access for each repo (write or none).** The proprietary app is often "none".
- [ ] **Complete the third-party integrations register and map each to a company function.** Who uses it, what data goes in and out, what breaks if it stops.
- [ ] **Draw your product on one page.** A drawing on paper or a simple diagram is enough.
- [ ] **Complete the Week 1 items in the learning path.**
- [ ] **[M] Walk your coach through the one-page map (10 minutes).** Practice out loud before the checkpoint.
- [ ] **Fill in the Week 1 column of the score sheet.**

### What goes in git

| File or folder | Content |
|---|---|
| `map/repository-map.md` | One row per repo, domain or service, from the [repository map template](/library/template-repository-map) |
| `map/integrations-register.md` | The [integrations register](/library/template-integrations-register) |
| `map/one-page.png` or `.md` | Your one-page drawing |
| `assessment/score-sheet.md` | Week 1 column filled in |
| `notes/week-1.md` | The [weekly note](/library/template-weekly-note) |

### Common problems

- Mapping only the repos you wrote. The CRM and payments count.
- No owner on an integration. That is a risk; write it down.
- A drawing with no arrows. The arrows are the "ties into" column.

## Week 2: Know the people

**Goal:** personas, touch points and journeys built from evidence.

### Items

- [ ] **Collect real evidence.** Interviews, support messages, analytics, sales notes. Keep the raw material in a private place, and put a clean summary in git.
- [ ] **Write 3 to 5 personas** with demographics, goals, fears, and how they find the product. Use the [personas template](/library/template-personas).
- [ ] **Separate the user and the customer** where they are different people.
- [ ] **List all touch points, before and after purchase.** Name an owner for each.
- [ ] **Draw the user journey with feelings and pain points.**
- [ ] **Draw the customer journey** (find, compare, buy, pay, renew).
- [ ] **Mark where each journey breaks today.**
- [ ] **Complete the Week 2 items in the learning path.**
- [ ] **[M] Present one persona and one journey.** Be ready to name the evidence behind each claim.
- [ ] **Fill in the Week 2 column of the score sheet.**

### What goes in git

| File or folder | Content |
|---|---|
| `people/personas.md` | Three to five personas, each with an evidence list |
| `people/evidence-summary.md` | A summary of interviews and messages, without personal data that should stay private |
| `people/touch-points.md` | All touch points with owners |
| `people/journeys.md` | User and customer journeys, from the [journeys template](/library/template-journeys) |
| `assessment/score-sheet.md` | Week 2 column filled in |
| `notes/week-2.md` | Weekly note |

### Common problems

- Personas made up from memory. Every persona needs a real conversation behind it.
- Putting real people's names or private details in git. Use a pseudonym or initials, and keep raw notes private.
- Touch points that only cover the app.

## Week 3: From problems to epics

**Goal:** epics written by hand, in a clear order, and visible in GitLab.

### Items

- [ ] **List the gaps from your journeys and your repository map.** These are candidate epics.
- [ ] **Write 4 to 8 epics in the template, in your own words (no AI).**
- [ ] **Each epic has:** problem, who, outcome, measure, in scope, out of scope, parts touched, dependencies, risks.
- [ ] **Order the epics and write one sentence of reason for each position.**
- [ ] **Create the epics in your GitLab product group with dates and labels.** On GitLab Free, use epic files and labels in the planning repo, as in [Deck 8](/library/deck-08-epics-and-roadmap-in-gitlab).
- [ ] **Check that the GitLab roadmap view shows your plan correctly.**
- [ ] **Complete the Week 3 items in the learning path.**
- [ ] **[M] Epic review: answer hard questions without notes.**
- [ ] **Fill in the Week 3 column of the score sheet.**

### What goes in git

| File or folder | Content |
|---|---|
| `epics/<name>.md` | One file per epic, using the [epic and roadmap template](/library/template-epic-roadmap) |
| `ROADMAP.md` | The ordered table of epics, with a reason for each position |
| `assessment/score-sheet.md` | Week 3 column filled in |
| `notes/week-3.md` | Weekly note, including your honest AI-use note |

### Common problems

- Epics that are task lists.
- No measure.
- Using AI to polish an epic. That breaks the rule.

## Week 4: Defend the roadmap and hand off

**Goal:** a roadmap you can defend, and a first milestone agents can start on.

### Items

- [ ] **Fix your epics after the review.**
- [ ] **Check dependencies between your epics and with other products.**
- [ ] **Cut the first epic into 3 to 5 milestones with dates.**
- [ ] **Prepare a 10-minute roadmap presentation, including what you chose NOT to do.**
- [ ] **Complete the Week 4 items in the learning path and choose your first certification.** The optional certification ideas are in the learning path pages.
- [ ] **[M] Present to the leadership panel.**
- [ ] **Complete the whole self-assessment and compare with your coach's scores.** Use the [Track A rubric](/library/rubric-track-a-self-assessment).
- [ ] **Write your next 30-day learning plan.**

### What goes in git

| File or folder | Content |
|---|---|
| `epics/` | Updated epics after review |
| `milestones/<epic>-m1.md` ... `m5.md` | 3 to 5 milestones with dates, goals and done-when lines |
| `presentation/roadmap-10min.md` | Your speaking outline and what you chose not to do |
| `assessment/score-sheet.md` | Week 4 column and your coach's score |
| `plan/next-30-days.md` | Your learning plan |
| `notes/week-4.md` | Weekly note |

### Common problems

- Milestones without dates.
- A presentation that is only features. Say what you chose not to do.
- A learning plan with no dates.

## The no-AI-epics honesty check

Every week, also answer the three questions from the [rubric page](/library/rubric-track-a-self-assessment): did I write every epic and roadmap sentence myself, did I use AI only for the allowed list, and can I explain each epic out loud without notes.

## The 2030 Product Development Manager lens

- **You decide:** what goes in the map, who the personas are, which epics exist and in what order, and what you will not do.
- **You delegate to agents:** collecting your week's changes, checking that files exist and names follow the standard, setting up labels and milestones from your written list, and (from Week 4) breaking your first milestones into issues.
- **The brief you would write:** "Check my planning repository against this week's checklist. For each item, say whether the evidence file exists, and quote its first line. Do not create or edit files."
- **You verify by:** opening each file the agent claims exists, and reading it as your coach would.
- **Disciplines involved:** product and strategy (epics and order), research and design (people and journeys), operations and finance (integrations), engineering (repos), communication (the presentation).
- **On the agent ladder:** weeks 1 and 2 are **use**, week 3 is human-only for epics, and week 4 starts **delegate**: a clear milestone given to an agent with a brief.

## Common mistakes

1. **Ticking before it is done.** A tick is a claim a coach will check.
2. **Leaving evidence in a private file.** Put it in git.
3. **Skipping the checkpoint prep.** Practise speaking aloud.
4. **Leaving the score sheet to the end.** Fill it in every Friday.
5. **Doing Week 4 before Week 3 is reviewed.** The review changes your epics.

## Practice

1. Copy the checklist into your repository. Add the dates for your four checkpoints.
2. This week, create the evidence folder structure from the table above.
3. At the end of the week, count how many items you ticked and how many have evidence.

## Where to go next

Continue to the [Track B weekly checklist and capstone plan](/library/weekly-checklist-track-b-and-capstone) when Track A is done, or review the [rubric](/library/rubric-track-a-self-assessment).
