---
title: "From ORBITAL to milestones and issues"
description: "Turn a finished ORBITAL plan into GitLab milestones, issues and labels that people and agents can work from. The plan stays yours, and the issues carry its limits, its proofs and its owners."
section: "Frameworks"
order: 16
track: "frameworks"
level: "core"
duration: "70 min"
outcomes:
  - "Trace each ORBITAL letter to the place in GitLab where it lives: milestone, issue, label, template or board"
  - "Write an issue that an agent can implement and a person can review: context, limits, done-when, owner and proof"
  - "Create a milestone and an issue set from a plan, using the command line, and check the result against the plan"
  - "Operate within GitLab Free, which has no epics and no scoped labels, by using milestones, labels and one tracking issue"
resources:
  - "gitlab/milestones"
  - "gitlab/issues"
  - "gitlab/issue-boards"
  - "gitlab/labels"
  - "gitlab/description-templates"
  - "atlassian/epics"
  - "atlassian/user-stories"
  - "anthropic/claude-code-best-practices"
prerequisites:
  - "14-orbital-activities-and-logistics"
  - "15-orbital-trailmug-in-full"
updated: 2026-11-03
---

This is lesson 16, the last about ORBITAL. It supports **Developer weeks 3 and 4** (plan into issues, run the board) and the Master Developer work of connecting a plan to daily delivery. It ends the ORBITAL group and leads into ANDROID Ops, where the issues are worked.

## 1. Why this matters

A plan in a document does not get done. A plan in an issue tracker, with owners, proofs and dates, does. The step between them is where good plans often die: someone copies half the tasks, loses the reason behind them, and the team works from the tracker while the plan sits unread.

The aim of this lesson is a **traceable path**: from one line of the objective, to a milestone, to an issue, to a merge request, to a check that the proof is true. Anyone, including an agent that joins on day ten, can follow it in either direction.

The 2030 Product Development Manager (PDM) writes the plan, the epic and the milestones. The agents then work on issues that carry all the context they need. An issue written well is a **brief** for an agent. An issue written badly is a small disaster that looks like progress.

A note on tools. The Dojo uses GitLab. On the Free tier of GitLab.com there are **no epics** and **no scoped labels** (labels with a double-colon such as `status::ready`). You can still do everything in this lesson with milestones, ordinary labels, issue boards and one *tracking issue* that stands in for the epic. If your plan has paid features, use them, but keep the same logic. (Check your own GitLab version: features move between tiers.)

## 2. Key ideas, explained

### The mapping

Each ORBITAL letter has a natural home in the tracker.

| ORBITAL | Lives in | How |
|---|---|---|
| **Objective** | The tracking issue and the milestone description | One sentence, the number and the date. |
| **Resources** | Issue assignees and a `resources.md` file | The owner of each issue is a named resource. |
| **Budget** | A budget file in git and a label for spend-related issues | Issues that cost money carry a label, such as `budget`, and a line in the file. |
| **Indicators** | Issues that build the measurements, and the milestone's "done when" | A milestone closes only when its proof, in numbers, is true. |
| **Transport** | Contract issues and decision records | The contract is written first; implementation issues link to it. |
| **Activities** | Milestones and issues | One milestone per proof, one issue per task. |
| **Logistics** | Risk issues, a board and the weekly note | Each risk is an issue with an owner and an early signal. |

### Milestone, issue, tracking issue

- A **milestone** is a group of issues with a title, a date and a description. In ORBITAL terms: *one milestone per proof*. The description holds the proof, in words that can be checked.
- An **issue** is one task. In ORBITAL terms: *one task with one owner*.
- A **tracking issue** is a single issue that holds the objective, the list of milestones and a link to the plan. It plays the role of the epic where epics are not available. Name it clearly, such as "EPIC: Customers can join, get a cup and return it at any partner café".

**People write epics and roadmaps; AI never does.** You write the tracking issue and the milestone descriptions. You may let an agent draft *task* issues from a finished milestone, and you review each one before it is created.

### Labels, simply

Labels are tags. Without scoped labels, keep a small, flat set and agree on it in writing.

| Kind | Examples (names are your choice) |
|---|---|
| **Status** | `status-ready`, `status-in-progress`, `status-needs-review`, `status-blocked` |
| **Type** | `type-task`, `type-risk`, `type-decision`, `type-contract` |
| **Area** | `area-returns`, `area-cafes`, `area-payments` |
| **Who** | `agent-ok` (an agent may do this), `human-only` (a person must) |

The last pair is important. `human-only` marks tasks that include a decision, a legal step, a payment or a conversation with a customer. `agent-ok` marks tasks with a clear brief and a check. It is a simple form of **policy**: a written rule about what may be delegated.

### An issue as a brief

A good issue has these parts. You met the task card in lesson 9; this is the same card at tracker size.

| Part | Content |
|---|---|
| **Title** | A verb and an object: "Reject a return with no café id". |
| **Why** | One sentence, and a link to the milestone and the plan section. |
| **Context** | Links to the contract, the decision record and the files involved. |
| **Do** | The steps or the result wanted. |
| **Do not** | The limits: files not to touch, data not to use, decisions not to make. |
| **Done when** | Testable lines. |
| **Proof** | The evidence that goes in the merge request: test output, a screenshot, a number. |
| **Owner and review** | Who does it, and who reviews it. |

You can store this as a **description template**, a markdown file in `.gitlab/issue_templates/` that appears when someone creates an issue. You made one in lesson 9. Use the same one here.

### Do not repeat the catalogue

Your product also needs a **catalogue page**: a standard page that lists its repositories, interfaces, owners and status. Do not copy that information into every issue. Link to it, and keep it in one place. The [Product Catalogue standard](/library/product-catalogue-standard) explains what goes in it.

### Check that the tracker matches the plan

After you create the issues, **compare** them with the plan. Every task in the plan should map to an issue, and every issue should trace to a task. An issue with no home in the plan is scope creep. A task with no issue will be forgotten. The check takes a few minutes and finds most planning errors.

## 3. Step by step: from plan to tracker

1. **Freeze a version of the plan.** Tag or note the commit of `frameworks/orbital.md` that you are converting. The issues refer to it.
2. **Create the tracking issue.** Title it as the epic. In the description: the objective, the milestone list, the plan link, the owner and the review rhythm.
3. **Create one milestone per proof.** Title: the proof in a short phrase. Description: the proof in full, the date and a link to the tracking issue.
4. **Agree the labels** and create them once. Keep the set small.
5. **Write the issue template** if you do not have one (lesson 9).
6. **Write the task issues** for the first milestone only. Use the plan's task table: owner, estimate, dependencies and "done when". Create issues for later milestones when you reach them, because plans change.
7. **Mark each issue** `agent-ok` or `human-only`. If you are unsure, it is `human-only`.
8. **Link dependencies.** In GitLab you can write "Blocked by #12" in the description, or use issue links. Dependencies should be visible on the board.
9. **Create risk and decision issues** for the top risks and the open questions in the plan. Each has an owner and a date.
10. **Create a board** with columns for ready, in progress, needs review and done, based on your labels.
11. **Run the match check:** list plan tasks beside issues. Fix gaps in either direction.
12. **Review with a colleague** from another discipline. Ask: "Could you start tomorrow from this issue alone?"
13. **Record the mapping** in `frameworks/orbital.md` (a short table of milestone names and links). Open a merge request.

## 4. Worked example: TrailMug

**Invented example.** The repository names and ids are made up.

Maya has the plan from lesson 15. Her tracking issue, milestones and first task issues follow.

**The tracking issue** (`trailmug-planning`, issue 1):

```markdown
# EPIC: Customers can join, get a cup and return it at any partner café

Objective: By 31 March, eight partner cafés in one city lend and take
back TrailMug cups, and at least 70 of every 100 cups lent are returned
within seven days. Owner: Maya.
Plan: frameworks/orbital.md at commit abc1234 (v0.3).
Milestones:
- A Eight cafés signed (14 Feb)
- B Cup loop working (28 Feb)
- C Three cafés record real returns (14 Mar)
- D First return rate reported and decision made (31 Mar)
Review: every Friday in the five-line note.
```

**A milestone description** (milestone C):

```markdown
Proof: three cafés have each recorded at least five real returns on
the café page, and each record carries a valid café id.
Date: 14 March.
Depends on: milestone B.
Tracking issue: #1. Plan section: Activities, C.
Closes when: the three cafés' returns are visible in the returns table,
and Maya has watched one café record a return in person.
```

**A task issue** (in `trailmug-svc-returns`):

```markdown
Title: Reject a return with no café id

Why: Lost returns hurt the main objective (milestone C, plan: Activities).
Context: docs/api/returns.yaml (the contract; do not change);
decisions/0003-poll-not-events.md.
Do: Add a check in the returns service so that a request without a
café id gets the error defined in the contract. Add four tests (missing
id, wrong id, right id, wrong type).
Do not: change the contract; log personal data; add dependencies; touch
files outside services/returns/ and its tests.
Done when: the four tests pass in the pipeline; the error matches the
contract; Maya has read the diff.
Proof: test output pasted in the merge request.
Owner: agent session, reviewed by Maya.   Labels: type-task,
area-returns, agent-ok, status-ready.   Estimate: 0.5 day (BELIEVED)
```

**The command line.** With the GitLab command-line tool `glab`, she can create the milestone and the issue without leaving her terminal. The exact commands depend on your version, so check `glab milestone --help` and `glab issue create --help`. The shape is:

```text
glab milestone create --title "C: Three cafés record real returns" \
  --due-date 2027-03-14 --description "Proof: ..."
glab issue create --title "Reject a return with no café id" \
  --label "type-task,area-returns,agent-ok,status-ready" \
  --milestone "C: Three cafés record real returns" \
  --description "$(cat issues/reject-return-no-cafe-id.md)"
```

Look at what this gives her. An agent can read the issue and know its limits. Maya can review the merge request against the "done when" line. Months from now, someone can follow the path from a merge request to the issue, the milestone, the epic, the objective and the plan.

**The match check.** Maya lists the 12 tasks in the plan for milestones A to C and finds 11 issues. The missing one is "ask the washing partner for a quote". It was the most dangerous task on the critical path. Writing issues exposed what reading the plan had not. She creates it as `human-only`, due on day one.

**Two human-only issues** she marked: "Choose the washing partner" (a decision with money) and "Phone the three cafés about training" (a conversation).

## 5. Working with AI agents on this

| | For the plan-to-tracker step |
|---|---|
| **What the PDM decides** | The epic, the milestones and their proofs. Which tasks are `agent-ok`. The order of work. What each issue may not do. |
| **What agents do** | Draft task issues from a finished milestone. Check that each issue has the eight parts. Run the match check between plan and tracker. Draft the board columns. Create the issues after your review, if you allow it. |
| **How the PDM verifies** | Read every issue before it is created. Check that "Do not" lines are present. Run the match check yourself on at least one milestone. Ask a colleague to start from one issue alone. |
| **Who else is involved** | The owners of the tasks, a reviewer for each merge request, and the colleagues in finance and operations who read the board. |

A brief you can adapt:

```text
Context: frameworks/orbital.md (read only), milestone C description
(below) and the issue template .gitlab/issue_templates/star-task.md.
Task: draft task issues for milestone C only, one markdown file per
issue in issues/draft/. Use the template. For each issue:
- take the task from the Activities table; do not invent new tasks;
- write the Do not line (files, data, decisions);
- write a done-when that a test or a person can check;
- label it agent-ok only if it has no decision, payment, legal step or
  customer conversation; otherwise human-only;
- copy the estimate and its confidence mark from the plan.
Then compare the drafts with the plan: list plan tasks with no issue,
and issues with no plan task. Do not create issues in GitLab. Do not
change the plan, the milestones or the epic.
```

You review the drafts, then create the issues yourself (or let the agent do that in a second step, when you have read every file).

This is a natural place to move from **delegating** to **orchestrating**. Once there are ten issues marked `agent-ok`, you may run several sessions at once, each on its own branch. What keeps this safe is **policy and gates**: the written rule of what an agent may do (the `agent-ok` label and the "Do not" lines), a protected main branch, required review and a pipeline that must be green before a merge. The [agent orchestration track](/library/tracks/agent-orchestration/) is about exactly this. The best practices from the agent vendors are a useful companion; one is in the resources.

## 6. Common mistakes and how to avoid them

- **Copying the plan into issues without the reason.** Add the "why" and link the plan section.
- **One giant issue.** A task is finishable in days.
- **A milestone that is a date.** A milestone is a proof.
- **Creating all issues at once.** Plans change. Create issues for the next milestone.
- **No "Do not" line.** Agents (and people) fill silence with guesses.
- **Marking everything `agent-ok`.** Decisions, payments, legal steps and customer conversations are `human-only`.
- **Hidden dependencies.** Write "Blocked by".
- **Letting the tracker drift from the plan.** Run the match check at each milestone.
- **Copying the catalogue into issues.** Link to it instead.
- **Letting an agent write the epic.** You write it.

## 7. Practice

**Goal:** convert your ORBITAL plan, or the TrailMug plan, into a real tracker and check it.

1. Use a test project in GitLab that you own. Do not use a real customer project for the exercise.
2. Create the tracking issue with the objective, the milestones and the link to the plan.
3. Create the milestones, one per proof, with dated proofs in the description.
4. Create the labels and the issue template.
5. Write at least six task issues for the first milestone, with all eight parts. Mark each `agent-ok` or `human-only` and explain any `human-only` choice in a line.
6. Use the agent brief above to draft the issues, then review each draft and note what you changed.
7. Run the match check, writing the gaps found.
8. Take one `agent-ok` issue, give it to an agent on a branch, and review the merge request against the "done when" line.
9. Record the mapping table in `frameworks/orbital.md`. Open a merge request.

**Deliverable:** a tracker (or exported list) with one tracking issue, milestones with proofs, six task issues, a match-check note, one agent-built merge request with your review, and the mapping table in git. Include an `AI use:` line.

## 8. Checklist

- [ ] I wrote the tracking issue and the milestone proofs myself.
- [ ] Each milestone is a proof with a date.
- [ ] Each task issue has a why, context, do, do not, done-when, proof and owner.
- [ ] Decisions, payments, legal steps and customer conversations are `human-only`.
- [ ] Dependencies are written down and visible on the board.
- [ ] I ran the match check between plan and tracker.
- [ ] I reviewed every agent-drafted issue before it was created.
- [ ] I linked the catalogue page instead of copying it.
