---
title: "The backlog, stories and acceptance checks"
description: "Keep one ordered backlog, refine it on a schedule, write user stories with acceptance checks and set a definition of ready so that no agent starts from a guess."
section: "Agile delivery"
order: 2
track: "agile-delivery"
level: "core"
duration: "3 hours"
outcomes:
  - "Keep a product backlog that is ordered, visible and owned by one person"
  - "Write a user story with acceptance checks that a person can test"
  - "Run a refinement session and cut a story that is too big"
  - "Write a definition of ready that stops guesswork before it starts"
resources:
  - "atlassian/product-backlog"
  - "atlassian/backlog-refinement"
  - "atlassian/user-stories"
  - "atlassian/definition-of-ready"
  - "atlassian/story-mapping"
  - "gitlab/issues"
prerequisites:
  - "week-4-defend-the-roadmap"
  - "issues-milestones-labels"
updated: 2026-11-03
---

**Supports:** Developer, week 4 (Defend the roadmap): the backlog behind the weekly rhythm. **Time:** about three hours.

## 1. Why this matters

A milestone says what slice ships. The backlog says what work is waiting, in what order. If it is a pile, every cycle starts with an argument. If it is an ordered, honest list, every cycle starts with the top of the list.

Agents raise the stakes. A human developer who gets a vague ticket asks a colleague, guesses well from experience or walks to your desk. An agent works from what you wrote. A vague story gives you a confident, finished, wrong result. For a Product Development Manager (PDM), writing the story is the act of specifying the product. The better the story, the less the review costs.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The order of the backlog, what a story must prove, when a story is ready and what is cut | Drafting stories from your milestone for you to edit; finding duplicates; listing unclear words | Each story names a person and has checks a person can run; the top of the backlog is ready; the order reflects the roadmap | Design (what the person sees), engineering (what is possible), support (real complaints), legal (obligations) |

## 2. Key ideas

### The product backlog

Atlassian describes the product backlog as the prioritised list of work for the product. The Scrum Guide says the Product Owner is accountable for it, and that it is the single source of work. Three habits make it useful:

1. **One list, one owner.** Several lists mean several truths. One person has the last word on order.
2. **Ordered, not just listed.** The top is the most important and the most detailed. The bottom is rough.
3. **Alive.** Items are added, changed and removed every week. A backlog nobody prunes becomes a graveyard.

On the free GitLab plan, the backlog is the set of open issues with a label such as `backlog`, ordered on a board. GitLab's issues documentation describes the issue as the unit of work.

### Backlog refinement

Refinement is the regular work of making upcoming items clear enough to start. Atlassian's page on backlog refinement describes adding detail, estimates and order. It is not a meeting you attend to be told things. It is the time in which you ask: is this still needed, is it small enough, do we know what done looks like?

A simple rule: **detail the top, not the bottom.** Refine only about one or two cycles ahead. Detail written months in advance is usually wasted.

### User stories

A user story describes a piece of value from a person's point of view. Atlassian's page shows the common form: "As a (person), I want (something) so that (reason)." The form is a prompt, not a rule. The point is that every story has a **person**, a **need** and a **reason**.

A strong story has more than the sentence:

- **Context:** what the person is trying to do, with a link to the persona and the journey step.
- **Acceptance checks:** statements a person can test.
- **Out of scope:** what this story will not do.
- **Notes:** constraints, links, open questions.

### Acceptance checks that work

A check is good if a person with no technical knowledge can run it and agree on the result. "Works well" is not a check. "A café owner can find the sign-up page from the home page and finish it in under ten minutes without help" is.

Write checks in the language of the person using the product. Three to six per story is usual. If you need twelve, the story is too big.

### Cut big stories

A story that cannot be done within a few days of effort, or cannot be checked in one sitting, should be split. Cut by **what the person can do**, not by layer. Atlassian's page on story mapping shows how to lay a journey out as a map of steps and cut thin slices across it. Good ways to cut: by step in the journey, by type of person, by simple version first and variations later, or by the happy path first and the exceptions later.

### Definition of ready

Atlassian's page on the definition of ready describes a shared checklist for when a story can enter a cycle. Where the definition of done says when work is finished, the definition of ready says when work may start. For work given to agents, this is your main protection against guesses. A story is ready when:

- It names a person and a reason.
- It has three to six acceptance checks that a person can run.
- Its scope and out of scope are written.
- Dependencies are named and either met or planned.
- It is small enough to finish and check in one cycle.
- Open questions are answered or listed with an owner.

## 3. Step by step

### Step 1: Gather the work

Take the first milestone from your roadmap and its acceptance checks. List every piece of work needed to meet them. Add known bugs and requests. Put all of it in one list.

### Step 2: Remove, merge and name

Delete what is no longer needed. Merge duplicates. Write each item as an outcome for a person, not a technical task.

### Step 3: Order

Order by what the milestone needs first, then by risk, then by value. The top ten items should be clearly ordered. The rest can be rough.

### Step 4: Write stories for the top items

For each of the top five to ten items, write the story with the person, need and reason, context links, three to six checks and the out-of-scope line.

### Step 5: Cut what is big

For each story, ask: "Can I check this in one sitting? Can it be done in a few days?" If not, cut it by journey step or by simple version first.

### Step 6: Apply the definition of ready

Go through each top story with the checklist. Mark what is ready and what is not. Fix or defer the rest.

### Step 7: Put it in git

Create the issues from the template, with labels and the milestone. Write `delivery/backlog.md` as a snapshot with the top ten in order and a line on why that order.

### Step 8: Set the refinement time

Put a regular slot in your week to refine the next cycle's work. Keep it short.

## 4. Worked example: TrailMug

TrailMug is fictional. The milestone is "Café sign-up page". Raw list:

- Sign-up form
- Confirmation message
- Privacy link
- "Why join" page
- Café map improvements
- Loyalty points (from a customer request)
- Mobile layout
- Email to founder on new sign-up

**After refining:** loyalty points are removed (no evidence; recorded in the not-doing list). The map improvement belongs to another milestone. "Why join" page is merged into the sign-up page as a short introduction.

**One story, written in full:**

> **Story:** As Leo, a café owner, I want to join TrailMug on my own, without a phone call, so that I can start taking returns this week.
>
> **Context:** persona Leo; journey step "Decide to join"; milestone "Café sign-up page".
>
> **Acceptance checks:**
> 1. From the home page, Leo finds the sign-up link in under 30 seconds.
> 2. Leo finishes the form in under ten minutes without help.
> 3. After he submits, the founder gets his café name, address and contact within one minute.
> 4. Leo sees a confirmation that says what happens next and when.
> 5. The form works on a phone.
> 6. The page says what data is kept and links to the privacy notice.
>
> **Out of scope:** payment, a café dashboard, uploading a logo.
>
> **Dependencies:** privacy notice live. Decision on how cafés are paid (due 2026-12-10).

**Definition of ready check:** person named, six checks, scope written, dependencies named. One question remained: "Do we need a business registration number?" The founder asked a café owner, wrote the answer into the story and then marked it ready.

**Too big:** a story "Café dashboard" failed the size test (it could not be checked in one sitting). It was cut by journey step into "See this month's returns" (first), "See what TrailMug brought me" (second) and "Download a report" (later).

## 5. Working with AI agents on this

Stories are where agents save the most reading time, and where bad delegation does the most harm.

**Delegate:**

- **First drafts of stories** from your milestone and checks. You edit them.
- **Finding vague words.** "List every word in these stories that two people could read differently, such as 'fast', 'easy' or 'simple'."
- **Duplicate and conflict search.** "Find stories that overlap or contradict each other. Do not merge them."
- **Checking against the definition of ready.** "For each story, say which ready-item is missing. Do not fix them."
- **Creating issues** from your final file with the GitLab command line tool.

**Do yourself:**

- Order the backlog.
- Decide what a story must prove, and write the checks.
- Decide what is out of scope.
- Decide when a story is ready.

**A brief you can adapt:**

```text
Below are my milestone, its acceptance checks and a list of work items.
Draft one user story per item in this form: story sentence, context,
three to six acceptance checks a non-technical person can run, out of
scope, dependencies.
Do not invent requirements that are not in my notes. When something is
missing, write "QUESTION:" and what you need to know.
Do not set the order and do not estimate.
```

**How to check the output.** Read each check and ask whether a person with no technical knowledge could run it. Strike any check that an agent invented without a basis. Every "QUESTION" must be answered or turned into an out-of-scope line.

**Agents drafting checks for their own work.** If an agent writes both the story and the code, it can write checks that its code already passes. You write the checks, or you review them before the build starts.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson sits on **delegate**. A story with checks is the unit of delegation. When many agents pull stories from one backlog, you are orchestrating, and the definition of ready becomes a gate: no story enters the cycle, and no agent starts, until the checklist is met. The [agent orchestration track](/library/tracks/agent-orchestration/) covers the upper rungs.

**Disclose.** In the backlog file: "AI use: first drafts of stories and a vagueness check. The order, checks and scope are mine."

## 6. Common mistakes

- **Several backlogs.** One list, one owner.
- **Detail everywhere.** Refine one or two cycles ahead.
- **Stories without a person.** "Add a database field" is a task, not a story.
- **Checks nobody can run.** "Good performance" is not a check.
- **Giant stories.** If you cannot check it in one sitting, cut it.
- **Cutting by layer.** Cut by what a person can do.
- **No out-of-scope line.** The agent will do extra things that look helpful.
- **Letting the agent write the checks for its own code.** It will pass them.
- **A backlog that only grows.** Prune every week.

## 7. Practice: write the backlog

**Deliverable:** in your git repo:

1. `delivery/backlog.md` with the top ten items in order, a line of reasoning for the order and a list of what you removed.
2. Five stories in full, in `delivery/stories/`, each with story sentence, context, three to six checks, out of scope and dependencies.
3. `delivery/definition-of-ready.md`: a checklist of five to eight items.
4. A table showing each of the five stories against the checklist.
5. One story you cut, with before and after.
6. Your AI-use line.

Commit with a message such as `Add backlog, five stories and definition of ready`.

**Check:** hand one story to someone with no technical knowledge and ask her to say how she would test each check. Rewrite any check she cannot test.

**Stretch:** lay your journey out as a story map. Draw the steps across the top and the stories below. Mark the first thin slice across the whole journey.

## 8. Checklist

- [ ] There is one backlog and one owner.
- [ ] The top ten items are ordered, with a reason.
- [ ] Each top story names a person, a need and a reason.
- [ ] Each story has three to six checks a person can run.
- [ ] Scope and out of scope are written.
- [ ] Big stories are cut by what a person can do.
- [ ] The definition of ready is written and applied.
- [ ] I wrote or reviewed the checks before the build.
- [ ] I recorded my AI use.

## 9. Further learning

Atlassian's pages on the product backlog, backlog refinement, user stories and the definition of ready are short and practical. Its story mapping guide shows how to cut a journey into thin slices. GitLab's documentation on issues shows how a story becomes a tracked item. The next lesson turns the top of this backlog into a planned cycle.
