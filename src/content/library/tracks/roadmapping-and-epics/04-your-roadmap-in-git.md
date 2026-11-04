---
title: "Your roadmap in git"
description: "Run the whole roadmap on a free GitLab account with issues, milestones, labels and boards, keep a plain-text copy in the repo and know what the paid epics feature would add."
section: "Roadmapping and epics"
order: 4
track: "roadmapping-and-epics"
level: "core"
duration: "3 hours"
outcomes:
  - "Set up labels, milestones and an issue template that carry an epic on the free GitLab plan"
  - "Create one tracking issue per epic and link the work under it"
  - "Build a board that shows the roadmap at a glance"
  - "Keep a plain-text roadmap file in the repo and keep it in step with GitLab"
resources:
  - "gitlab/issues"
  - "gitlab/milestones"
  - "gitlab/labels"
  - "gitlab/issue-boards"
  - "gitlab/description-templates"
  - "gitlab/epics"
  - "gitlab/roadmap"
  - "youtube-gitlab-unfiltered/gitlab-project-management-issues-labels-boards"
prerequisites:
  - "week-3-problems-to-epics"
  - "roadmap-standard"
updated: 2026-11-03
---

**Supports:** Developer, week 3 (Problems to epics): "put the roadmap in git". **Time:** about three hours.

## 1. Why this matters

A plan that lives in a slide deck dies in a month. A plan that lives next to the code is read, changed and checked every day. The Dojo asks for the roadmap in git for three reasons. It is **versioned**: you can see what changed and why. It is **shared**: access comes from project membership, not from one person's account. And it is **readable by agents**: an agent working in a repo can read a file that says what the product is for and what comes next.

A Product Development Manager (PDM) cares about one more thing: the plan must survive without you. If you are away for a week, a colleague or an agent should be able to open the repo and see what is being built, why, and what is next.

You do not need a paid plan. GitLab's epics and roadmap views belong to paid tiers at the time of writing, so check the current GitLab documentation before relying on them. Issues, milestones, labels and boards are the tools you use here. The discipline is the same, and it transfers to any tool.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The labels, the names, what counts as an epic issue and when one is closed | Creating the labels, milestones and issues from your files; drafting the issue template for you to edit | The board matches your roadmap; nothing is open without an owner; the text file and GitLab agree | Engineering (who works in which repo), operations (who can see the project), security (who has access) |

## 2. Key ideas

### Four tools do the work of an epic

| Tool | Use it for |
|---|---|
| **Issue** | One **epic tracking issue** per epic, holding the epic text. Also every task below it. |
| **Label** | Marks the kind (`epic`, `milestone-work`, `decision`) and the status (`now`, `next`, `later`). |
| **Milestone** | A dated slice of work, one to four weeks. Groups issues and shows progress. |
| **Board** | Shows issues in columns by label, such as now, next and later. This is your roadmap picture. |

GitLab's documentation describes each of these. Issues track work, labels organise and filter it, milestones group issues with dates, and boards present issues in columns. The free plan gives you all four.

### One epic tracking issue per epic

Create an issue titled with the outcome, for example "Café owners can join, run returns and see results". Paste the epic text from lesson 2 into its description. Give it the label `epic`. This issue does not get built. It is the **home** of the epic: the problem, the measure, scope, dependencies and links to the milestones that deliver it.

Link the milestone issues to it by writing "Part of #12" in their descriptions. Plain text links are robust: they work on any plan, and they read well to humans and agents.

### Labels carry your status

Keep the label set small. A good first set:

- **Kind:** `epic`, `milestone-work`, `decision`, `risk`
- **Horizon:** `now`, `next`, `later`
- **Area:** one per part of your product (`web`, `returns`, `partners`, `legal`)

Do not invent a label for every thought. Every label is something you must keep true.

### Milestones are your delivery dates

A milestone has a title, a start and due date and a description. Put the **acceptance checks** in the description: the tests a person can run to say "this slice works". Issues attach to a milestone. GitLab shows how many are done. Milestones are where agents get their work, and lesson 5 shows how.

### A board is the roadmap you can see

Create a board with lists for `now`, `next` and `later` labels. Epic tracking issues sit in those columns. Make a second board for the current milestone, with columns such as to do, doing, review and done. GitLab's issue boards documentation explains how to add lists by label and how to drag issues between them.

### Description templates

A **description template** is a file in the repo (under `.gitlab/issue_templates/`) that pre-fills the description of a new issue. Put the epic template there. Every new epic issue then starts with the same headings, and nobody forgets the "out of scope" line. GitLab's documentation on description templates shows the folder and file format.

### A text file stays the master copy

Add `roadmap/ROADMAP.md` to the repo, listing each epic, its order, its reason, its horizon and the issue number. When the file and GitLab disagree, you have a bug in your plan. An agent that has no GitLab access can still read the file. A reviewer can read the history of the file with `git log`.

### What the paid epics and roadmap would add

GitLab's epics feature groups issues across projects with parent and child relationships, and its roadmap view shows epics on a timeline. These are useful if you run many projects. Read the documentation pages to understand what you gain. Do not change your method because of them: an epic written well works in either tool.

## 3. Step by step

### Step 1: Create the project and invite people

Use one GitLab project for the product plan, or the main repo of your product. Add the people who need to see it as members with the lowest role that works. Never share the plan through a personal account.

### Step 2: Create the labels

Create the kind, horizon and area labels. Give each one a short description that says when to use it.

### Step 3: Add the epic template

Create `.gitlab/issue_templates/epic.md` with the headings from lesson 2. Commit it. When you create a new issue, choose the template.

### Step 4: Create one tracking issue per epic

For each epic, create an issue from the template, paste your epic text, add the `epic` label and a horizon label.

### Step 5: Create the milestones

For the first epic, create three to five milestones with start and due dates. Write acceptance checks in each. For other epics, create only the next milestone: far milestones are guesses.

### Step 6: Build the board

Create a board with `now`, `next` and `later` lists. Check that each epic tracking issue appears in the right column.

### Step 7: Write ROADMAP.md

Write the file by hand. For each epic: title, horizon, the one-sentence reason for its position, the issue link and the next milestone with its date.

### Step 8: Check them against each other

Open the board and the file side by side. Fix any difference. Decide which one wins in a conflict. We recommend the file, because it has history and review.

### Step 9: Set a rhythm

Pick a weekly time to look at the board, move cards, update the file and close finished milestones. A roadmap you do not touch weekly is already out of date.

## 4. Worked example: TrailMug

TrailMug is fictional. The founder keeps the plan in the `trailmug-product` repo.

**Labels:** `epic`, `milestone-work`, `decision`, `risk`; `now`, `next`, `later`; `web`, `returns`, `partners`, `legal`.

**Tracking issues:**

| Issue | Title | Labels |
|---|---|---|
| #1 | The service is lawful and honest | `epic`, `now`, `legal` |
| #2 | Café owners can join, run returns and see results | `epic`, `now`, `partners` |
| #3 | Visitors can see the price, sign up and pay | `epic`, `next`, `web` |
| #4 | New members get a welcome email in 5 minutes | `epic`, `next`, `web` |
| #5 | Anyone can tell whether the service is up | `epic`, `later` |

**Milestones for epic #2:** "Two-café trial" (two weeks), "Café sign-up page" (three weeks), "Returns scan and count" (three weeks), "Monthly café report" (two weeks). Each has acceptance checks, such as "A café owner can find the sign-up page from the home page and finish it in under ten minutes without help."

**ROADMAP.md excerpt:**

```markdown
## Now
1. **The service is lawful and honest** (#1). First, because nothing that
   collects emails or money can start without it. Next milestone: privacy
   notice live, 2026-12-01.
2. **Café owners can join, run returns and see results** (#2). Second,
   because members have nothing to use without cafés. Next milestone:
   two-café trial, 2026-12-15.

## Next
3. **Visitors can see the price, sign up and pay** (#3). After cafés exist.
4. **New members get a welcome email in 5 minutes** (#4). After members exist.

## Later
5. **Anyone can tell whether the service is up** (#5). Too few users yet.

## Not doing
Loyalty points: no evidence in interviews.
```

The board shows the same five cards. On Friday the founder moves a card, edits one line in the file and commits with the message "Move welcome email to next; trial dates set".

## 5. Working with AI agents on this

Setting up the tools is **mechanical**, so it is a good job for an agent. The content stays yours.

**Delegate:**

- **Setup from a file.** Give an agent your label list, milestones and epic text and ask it to create them with the GitLab command line tool (`glab`) or the API, then list what it created.
- **Template drafting.** "Draft an issue template with these headings. I will edit it."
- **Consistency check.** "Compare `roadmap/ROADMAP.md` with the open issues labelled `epic`. List any difference in title, horizon or milestone date. Do not change anything."
- **Weekly report.** "List milestones due in the next 14 days with the count of open issues in each."

**Do yourself:**

- Decide labels, names and horizons.
- Decide who has access and at what level.
- Write the roadmap file's reasons and update them.
- Close epics. An agent never closes an epic.

**A brief you can adapt:**

```text
Use the GitLab command line (glab) for the project <group>/<project>.
1. Create these labels exactly: <list with colours and descriptions>.
2. Create one issue per row of roadmap/ROADMAP.md, using the epic text in
   roadmap/epics/<n>.md as the description and the labels in the table.
3. Create the milestones in roadmap/milestones.md with their dates and
   acceptance checks.
Do not edit any text I wrote. Do not close or delete anything. When you
finish, print a table of every issue and milestone you created with its
number and link. If a command fails, stop and tell me.
```

**How to check the output.** Open the board yourself. Open three issues at random and compare the description with your file, word for word. Check that dates match. Check that the agent used the access you intended and no more: do not give an agent a token that can delete the project. Use a token limited to what the task needs, and keep it out of the repo.

**Disclose.** In `roadmap/README.md`: "AI use: set-up automation and a consistency check. The epics, order, reasons and labels are mine."

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **delegate**, and starts **govern**. Creating labels and issues from your files is a whole task you hand over. Labels, templates, protected branches and who may close an epic are the first rules and gates of a governed plan. The [agent orchestration track](/library/tracks/agent-orchestration/) covers the two upper rungs.

## 6. Common mistakes

- **Treating the tracking issue as work.** It is a home for the epic. Build from milestone issues.
- **Too many labels.** Each one is a promise to keep it true.
- **Dates for every milestone in every epic.** Date the next one. The rest are guesses.
- **A text file and a board that disagree.** Pick a winner and check weekly.
- **Planning in a personal account.** Use project membership, so others can edit.
- **Putting secrets in issues or files.** Never paste tokens, passwords or customer data.
- **Relying on paid features without checking.** Read the current plan documentation first.
- **Letting an agent close epics.** Only a person judges whether the outcome was reached.

## 7. Practice: put the roadmap in git

**Deliverable:** your roadmap live in GitLab and in the repo.

1. Labels, one epic template, one tracking issue per epic and milestones for the first epic, created in a GitLab project.
2. A board with now, next and later lists.
3. `roadmap/ROADMAP.md` with each epic, its horizon, the reason for its position, the issue link and the next milestone with its date.
4. A short `roadmap/README.md` that says who updates what, when, and your AI-use line.
5. A screenshot of the board saved as `roadmap/board.png` (no personal data in it).

Commit with a message such as `Add roadmap file and epic template`.

**Check:** ask a colleague who has not seen the project to open the repo and tell you, in two minutes, what is being built first and why. If she cannot, improve the file.

**Stretch:** read the GitLab documentation on epics and the roadmap. Write ten lines on what you would gain from them, and what you would have to change in your method.

## 8. Checklist

- [ ] The plan lives in a project people can join, not in a personal account.
- [ ] Labels are few, described and used.
- [ ] Each epic has one tracking issue from the template.
- [ ] The first epic has three to five dated milestones with acceptance checks.
- [ ] The board shows now, next and later.
- [ ] `ROADMAP.md` and the board agree.
- [ ] No secrets or personal data are in issues or files.
- [ ] A weekly time is set to update the plan.
- [ ] I recorded my AI use.

## 9. Further learning

GitLab's documentation on issues, labels, milestones and issue boards is the best reference for each tool, and its page on description templates shows the file format. The GitLab Unfiltered video on issues, labels and boards walks through the screens. The pages on epics and the roadmap show what the paid tiers add. In the next lesson you cut the first epic into milestones that agents can build from.
