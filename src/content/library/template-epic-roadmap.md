---
title: "Template: Epic roadmap"
description: "The Weeks 3 and 4 workbook, field by field: epics, roadmap grid, milestones and the seven-question quality check, with a full TrailMug epic."
section: "Templates"
order: 6
fillable: "template-5-epic-roadmap"
level: core
duration: "3 to 4 hours for the first epic, 30 min for the quality check of each next one"
outcomes:
  - "Write an epic with problem, outcome, measure, scope, parts, dependencies and risks, in your own words."
  - "Order epics on a roadmap and give one sentence of reason for each position."
  - "Cut the first epic into 3 to 5 milestones that ship in one to four weeks each."
  - "Run the seven-question quality check before you create an epic in GitLab."
resources:
  - gitlab/epics
  - gitlab/manage-epics
  - gitlab/roadmap
  - gitlab/milestones
  - atlassian/product-roadmaps
  - atlassian/epics-stories-initiatives
  - svpg/alternative-to-roadmaps
prerequisites:
  - templates-overview
  - template-personas
  - template-journeys
  - template-repository-map
  - week-3-problems-to-epics
---

The epic roadmap is the main template of Weeks 3 and 4. Everything before it (map, people, journeys) feeds into it. Everything after it (milestones, issues, agents) is built from it. It has four sheets: **Epics**, **Roadmap grid**, **Milestones** and **Epic quality check**.

## Download the blank template

- Excel file (original format): [template-5-epic-roadmap.xlsx](/templates/template-5-epic-roadmap.xlsx)
- Markdown copy, to keep in git: [template-5-epic-roadmap.md](/templates/template-5-epic-roadmap.md)

Make your own copy first. In git, each epic is a file `epics/<name>.md`, and `ROADMAP.md` holds the ordered table. The workbook is for thinking. **GitLab is the plan.**

## Why it matters

An epic is the biggest piece of planning that you must write yourself. It is a customer or business outcome that crosses several parts of the product. An epic is not a bigger issue. If it lives in one repository, it is probably a milestone.

The template follows the program's main rule: **no AI writes your epics.** Writing forces you to decide what is in, what is out and what you will not do. If an agent writes it, you skip the learning, and you cannot defend it when someone asks a hard question. The workbook also makes your epics ready for GitLab: the columns marked "GitLab" copy straight into the epic form.

## Key ideas

- **Epic:** an outcome across parts of the product, one to three months.
- **Milestone:** a slice of the epic that ships, one to four weeks, with a date.
- **Issue:** a task, hours to days. Agents and developers own issues.
- **Roadmap:** the ordered list of epics with start and due dates.
- **Measure:** one number or fact that tells you the epic worked.
- **Out of scope:** something real that a reasonable person might expect, and that you will not do in this epic.

## How to fill it: steps

1. **Collect candidates.** Use your gap list and repository map. Every gap is a candidate.
2. **Pick four to eight.** Merge the small ones. Drop the ones that touch only one part of the product.
3. **Write each epic on the Epics sheet.** Fill every column in your own words.
4. **Run the Epic quality check.** Seven questions, below. Fix before you continue.
5. **Order the epics.** Write one sentence for why each comes before the next.
6. **Create the epics in GitLab.** Paste title, description, dates and labels. Use the parent field for hierarchy. On GitLab Free, which has no epics feature, use epic files and labels in the planning repository as in [Deck 8](/library/deck-08-epics-and-roadmap-in-gitlab). Epics are a paid feature of GitLab.
7. **Check the Roadmap grid.** It fills from the Epics sheet. It should match what GitLab's Roadmap view shows.
8. **In Week 4, cut the first epic into milestones.** Three to five, each with a date and one sentence of what ships.
9. **Defend aloud.** Explain each epic to your coach without notes.

## Every field explained

### Epics sheet

| Column | What to write | TrailMug example (fictional) |
|---|---|---|
| My epic no. | A number | E1 |
| Title (GitLab: Title) | The outcome as a short sentence | A commuter always knows the status of her deposit |
| Parent epic (GitLab: Parent) | A bigger epic, or none | none |
| Problem: what is wrong or missing, for whom? | The problem, with the persona | Maya returns a cup and hears nothing. Support gets 40 "where is my deposit" messages each week. |
| Outcome: what is true when finished? | The state of the world | Every returned cup shows a refund status in the app within one minute. |
| Measure: how do we know? | One measure | Deposit messages to support fall below 10 per week within two months of release |
| In scope | What is included | App status screen, status events in the returns service, refund email with a link |
| Out of scope | What you will not do | A new payment provider; refunds to other cards |
| Parts of the product touched (repo map names) | At least two names | trailmug-app, trailmug-svc-returns, trailmug-pay, trailmug-int-email |
| Dependencies | Other teams, products, dates | The payment provider's April rule change; support team availability |
| Risks | What could go wrong | Provider status API may be slow; mitigation: show "processing" honestly |
| Labels (GitLab: Labels) | The labels you use | outcome::trust, area::returns |
| Start date (GitLab: Start date) | A real date | 2027-01-11 |
| Due date (GitLab: Due date) | A real date | 2027-03-05 |
| State | Draft, ready, in progress, done | Ready |
| Why this order (one sentence) | The reason | First, because the provider's rule change takes effect in April and returns depend on it |
| GitLab epic URL (after creating) | A link | (added after creation) |
| Written by me, no AI (Y) | Y or N | Y |
| Defended aloud without notes (Y/N) | Y or N | Y after the Week 3 review |

In GitLab, the description holds Problem, Outcome, Measure, In scope, Out of scope, Parts, Dependencies and Risks, in that order.

### Roadmap grid sheet

Type the first month in the date cell. The grid shows a block for every month an epic is active. It is a picture to check against GitLab's Roadmap view. If the two pictures differ, one of them is wrong.

### Milestones sheet

| Column | What to write | TrailMug example |
|---|---|---|
| Milestone title | A short name | E1-M1 Status events recorded |
| Epic no. it belongs to | The epic number | E1 |
| Start | A date | 2027-01-11 |
| Due | A date | 2027-01-29 |
| What ships (one clear sentence) | A sentence that a tester can check | The returns service stores a status for every return and exposes it to the app |
| Ready for agents to break into issues? (Y/N) | Y only if clear | Y |

### Epic quality check

Run every epic through these seven questions before you create it in GitLab:

1. Does it touch more than one part of the product? If not, it is probably a milestone.
2. Does it name the person it helps and the journey step it fixes?
3. Is there one measure that tells us it worked?
4. Does "Out of scope" say something real that people might expect?
5. Are the dependencies written, including other products and other teams?
6. Did I write it myself, with no AI, and can I explain it out loud?
7. Does the order on the roadmap have a reason I can say in one sentence?

## Working with AI agents

- **May:** explain a term. Check spelling and grammar after you finish writing. **Break a milestone that you wrote into issues**, and build those issues. Summarise a long document so you read the original faster. Search code and docs to answer a fact question.
- **May not:** write or rewrite an epic title, description, scope, measure or roadmap. May not decide the order of epics. May not fill in the workbook.
- **Disclose:** write an honest AI-use note in your weekly note.
- **A safe brief, after you wrote a milestone:** "Here is my milestone with its done-when line. Break it into issues of at most two days each, with acceptance checks. List the questions you have. Do not change the milestone text."

## Common mistakes

1. **An epic that is a task list.** Write the outcome, not the tasks.
2. **No measure.** "Better experience" is not a measure.
3. **Out of scope left empty or generic.** Say something real.
4. **One part of the product.** That is a milestone.
5. **Using AI to polish an epic.** It breaks the rule and you lose the learning.
6. **Dates that nobody can defend.** Start and due dates need a reason.
7. **Milestones without dates.** Agents cannot plan from "soon".
8. **Too many epics.** Four to eight. More than that means you have not chosen.

## Practice

1. Write one epic from your gap list. Fill every column. Do not use AI at all.
2. Run the seven questions. Fix the weakest answer.
3. Explain the epic aloud for two minutes without notes. Ask a classmate to ask one hard question.
4. Cut the epic into three milestones with dates. Check each one ships something a tester can see.

## Checklist

- [ ] Four to eight epics, each on a row with every column filled.
- [ ] Each epic has a measure, a real out-of-scope and named dependencies.
- [ ] Each epic touches at least two parts of the product.
- [ ] I wrote all of it myself and can explain it aloud.
- [ ] The order has one sentence of reason for each position.
- [ ] The Roadmap grid matches GitLab's Roadmap view.
- [ ] The first epic has three to five dated milestones.

## The 2030 Product Development Manager lens

- **You decide:** the outcome, the measure, what is out, the order and the risks you accept.
- **You delegate to agents:** turning your milestones into issues, building them, checking that the issue list matches your done-when lines.
- **A sample brief:** "Break the milestone E1-M1 into issues of at most two days. Each issue has a title, a short description and a check. Flag any issue that needs a decision from me. Do not add scope."
- **You verify by:** reading every issue against your milestone text, and removing anything out of scope.
- **Disciplines involved:** strategy, product, finance, engineering, operations and communication.
- **On the agent ladder:** epics are **human only**. Milestones start the step from **use** to **delegate**: a clear milestone goes to an agent with a brief.

## Further learning

[Week 3](/library/week-3-problems-to-epics) and [Week 4](/library/week-4-defend-the-roadmap) give the weekly plans. [Deck 7](/library/deck-07-writing-an-epic) teaches how to write an epic, and [Deck 8](/library/deck-08-epics-and-roadmap-in-gitlab) shows how to place epics and the roadmap in GitLab. See the [rubric](/library/rubric-track-a-self-assessment) for how epics and roadmaps are scored.
