---
title: "Deck 8: Epics and the roadmap in GitLab"
description: "Where epics and the roadmap live: GitLab epics on paid plans, and the same method on GitLab Free with issues, milestones and labels."
section: "Teaching deck"
order: 8
level: core
duration: "90 min"
outcomes:
  - "Explain why epics live in your GitLab group, not in a document."
  - "Map each column of the epic roadmap workbook to a GitLab field."
  - "Set up the same structure on GitLab Free with milestones, labels and a planning file."
  - "Read a roadmap view and check that it tells your story."
resources:
  - gitlab/epics
  - gitlab/manage-epics
  - gitlab/roadmap
  - gitlab/milestones
  - gitlab/labels
  - gitlab/issue-boards
  - gitlab/university
prerequisites:
  - deck-07-writing-an-epic
  - issues-milestones-labels
---

This lesson covers slide 18. It is short on the slide and long in practice, because it connects everything you wrote in lessons 5 to 7 to a real tool. It also answers a question the program always gets: "What do I do if my GitLab plan does not have epics?"

## Why it matters

A document on a laptop does not survive a team. Epics must be where agents, mentors and teammates can see them, link to them and change them through review. If an epic lives only in a file you emailed, it will disagree with the work within a week.

## Key ideas

### What slide 18 says

- Your epics live in your **GitLab product group** (your GitLab organisation), **not in a document**.
- Each epic has a **title, a description, dates and labels**, and can have **child epics**.
- **Link** issues and milestones to the epic so the roadmap view shows progress.
- The **roadmap view** draws your epics as a timeline. Check that it tells your story.
- The **epic roadmap workbook** maps column by column to GitLab fields.

### The workbook to GitLab mapping

The epic roadmap workbook is the paper version of what GitLab holds. Use this table to see how they match.

| Workbook idea | GitLab field |
|---|---|
| Epic name | Epic title |
| Problem, outcome, measure, scope, risks | Epic description (use the epic template headings) |
| Start and end | Epic start date and due date |
| Type or theme | Labels |
| Parent epic | Parent epic field |
| Linked work | Issues and milestones attached to the epic |
| Order on the roadmap | The timeline in the roadmap view, set by dates |

Open the [epic roadmap template](/library/template-epic-roadmap) to see the columns.

### Two ways to do it

**Way 1: GitLab epics (paid plans).** Epics are a feature of the paid Premium and Ultimate plans at the time of writing; always check the current plan comparison page. The advantages: a real epic object, child epics, a drawn roadmap, and progress shown from linked issues.

**Way 2: GitLab Free.** There is no epic object, but you can keep the same method. The program teaches this first, so every learner can follow without a paid plan.

| Need | What you use on GitLab Free |
|---|---|
| The epic text | A Markdown file in the planning repo, one file per epic, using the epic template |
| The epic label | A scoped label such as `epic::returns` on every related issue and milestone |
| Dates | Milestones with start and due dates |
| Child epics | A heading inside the file, or one file per child with a `parent:` line |
| Progress | An issue board filtered by the epic label |
| The roadmap view | A table in `ROADMAP.md` that you keep in sync, ordered by date |

On a company-owned GitLab, ask your admin which plan applies. If epics are available there, use them, and keep the Markdown file as a mirror so the text is still reviewed through merge requests.

### Check that the roadmap tells your story

Open the roadmap view (or your `ROADMAP.md`). Read it from left to right, as a stranger. Ask:

1. Can I tell what the product is trying to change?
2. Is the order believable? Does a later epic depend on an earlier one?
3. Are there gaps or overlaps in time?
4. Is any epic missing a measure or owner?

If the picture does not tell your story, the fix is in your epics, not in the picture.

## A worked example: TrailMug

TrailMug has a planning repo called `trailmug-planning`. On GitLab Free it contains:

```text
trailmug-planning/
  VISION.md
  ROADMAP.md
  epics/
    returns-any-cafe.md
    deposit-clarity.md
    cafe-onboarding.md
```

The file `epics/returns-any-cafe.md` holds the epic from lesson 7. At the top it carries a small table:

| Field | Value |
|---|---|
| Label | `epic::returns` |
| Start | 2 February |
| Due | 30 April |
| Measure | 90 percent of cups returned within 2 days |
| Milestones | "Returns at a second café", "Return confirmation for cafés" |

`ROADMAP.md` is a table of the three epics, ordered by start date, with a link to each file and its label. The board **Returns** shows issues with the label `epic::returns` in three columns: Open, In progress and Done. A person reading the board sees progress without opening a single issue.

If TrailMug later moves to a paid plan, the three files become three epics. The text is copied into the description field, the label becomes a parent link, and the dates carry over. The thinking does not change.

## Working with AI agents

- **Allowed:** ask an agent to move your epic text into the GitLab fields after you decided it. This is a formatting job. Check that nothing changed.
- **Allowed:** ask an agent to create the labels, the milestones and the board from a list you give it. Keep the list in your planning repo so the setup can be repeated.
- **Allowed:** ask an agent to check that every milestone has a due date and every issue has a milestone and a label.
- **Not allowed:** letting an agent reorder the roadmap, edit epic dates "to fit", or add a child epic.

A good brief for the setup job: "Here is a YAML list of labels, milestones and their dates. Create them in the project through the API. Print what you created. Do not rename or reorder anything." The result is quick, checkable, and repeatable.

## The 2030 Product Development Manager lens

This program trains the **Product Development Manager of 2030**: a person who blends strategy, product, design, brand and marketing, finance, operations, security and engineering, and who treats AI agents as the workforce for lower-level work. The bar is high, and the method is plain. In this lesson:

- **You decide:** the epic text, its dates, its order on the roadmap, and whether the picture tells your story.
- **You delegate to agents:** setting up labels, milestones and boards from a list you wrote, moving finished text into the right fields, and checking that every issue has a milestone and label.
- **The brief you would write:** "Here is a YAML list of labels, milestones and dates. Create them in the project through the API. Print what you created. Do not rename, reorder or add anything."
- **You verify by:** opening the roadmap view as a stranger, and comparing each created item with your list.
- **Disciplines involved:** product and strategy (the story), delivery (dates and boards), finance (budget windows), engineering (the tool setup).
- **On the agent ladder:** **delegate**: setup of labels, milestones and boards from a list. Written lists in git are the first form of policy as data: the same setup can be repeated and checked.

## Common mistakes

1. **An epic in a document no one else sees.** It will be out of date by Friday.
2. **A roadmap that is a list of features.** It should show outcomes over time.
3. **No dates.** Without dates the roadmap view shows nothing.
4. **Linking everything to everything.** Link each issue to one epic.
5. **Treating the paid feature as the method.** The method is the same on GitLab Free.
6. **Letting the tool dictate the thinking.** If your epic does not fit the fields, change the epic, not the fields.

## Practice

1. Set up a free GitLab project for your product. Create a `VISION.md`, an `epics/` folder and a `ROADMAP.md`.
2. Move your epic from lesson 7 into a file in `epics/`.
3. Create the label `epic::<name>`, one milestone with a start and due date, and three issues that carry the label.
4. Create an issue board with a list for each state and filter it by the epic label.
5. Open `ROADMAP.md` as a stranger would. Does it tell your story? Write down one thing to change.
6. If you have access to a GitLab group with epics, create the same epic there and compare the two.

## Checklist

- [ ] My epics live in git or in a GitLab group, not in a private document.
- [ ] Each epic has a title, a description with the template headings, dates and a label.
- [ ] Issues and milestones link to their epic.
- [ ] I can map every column of the epic roadmap workbook to a GitLab field.
- [ ] I checked the roadmap view as a stranger.

## For facilitators (speaker notes)

- **Slide 18.** Show a live roadmap of a real product group if possible. The documentation links are in the learning path.

## Where to go next

Continue with [Deck 9: Track A assessment and the eight-week map](/library/deck-09-track-a-assessment-and-eight-week-map). The standards are [Issues, milestones and labels](/library/issues-milestones-labels) and the [roadmap standard](/library/roadmap-standard).
