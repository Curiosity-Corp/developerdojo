---
title: "Planning in GitLab: issues, milestones and labels"
description: "Run a product plan on the GitLab free plan: write issues an agent can build, group them in milestones, classify with labels, and see where epics fit."
section: "Git and GitLab"
order: 3
track: "git-and-gitlab"
level: "core"
duration: "75 min"
outcomes:
  - "Write an issue that doubles as an agent brief"
  - "Group issues in a milestone that a person wrote, with a goal and a date"
  - "Design a small label set and a board that shows the real state of work"
  - "Explain what epics add on a paid plan, and how to work without them"
prerequisites:
  - "issues-milestones-labels"
  - "people-write-epics"
resources:
  - "gitlab/issues"
  - "gitlab/labels"
  - "gitlab/milestones"
  - "gitlab/learn-gitlab-with-tutorials"
  - "atlassian/itsm"
updated: 2026-11-03
---

Lesson 3 of the Git and GitLab track. It supports Developer weeks 3 and 4 (problems to epics, defending the roadmap) and the Master Developer work of keeping every plan in git. It builds on the program page [Issues, milestones and labels](/library/issues-milestones-labels) and the rule [People write epics](/library/people-write-epics).

## 1. Why this matters

If git holds the work, GitLab's planning tools hold the intent: what we are trying to do, in what order, and who is doing it. When agents build, the issue is the contract. A vague issue gives you a vague result, produced quickly. A clear issue gives you something you can verify.

This is also where the most important rule of the Way meets daily life. People write epics and roadmaps. AI never does. In GitLab's free plan there are no epics as a feature, so you will write the epic as a document in git and use a **milestone** to hold its issues. The principle is the same: a human wrote the goal.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| The epic, the milestone goal and date, the label meanings, what is "ready" and "done" | Drafting issue text from your spec, proposing a breakdown, applying labels, summarising board status | Reading each issue as if you were the builder, checking the milestone against the epic | Product and strategy (why), design (what it looks like), finance (what it costs), operations (when it can ship) |

## 2. Key ideas, explained

### The levels of work

From the program: **vision**, **epic**, **milestone**, **issue**. Higher levels need knowledge that is not in the code, so people own them. Lower levels need clear instructions, so agents are good at them.

| Level | Where it lives on the free plan | Who owns it |
|---|---|---|
| Vision | A file in the planning repo | A person |
| Epic | A file in the planning repo (`epics/E-03-returns.md`), linked from every milestone and issue | A person |
| Milestone | GitLab milestone, with description, start and due date | A person sets goal and date |
| Issue | GitLab issue | A person approves; an agent may draft and build |

### Issues

An **issue** is one piece of work, small enough for one agent to finish in one change. Read the [issues documentation](https://docs.gitlab.com/user/project/issues/) for the fields GitLab offers: title, description, assignee, milestone, labels, due date, linked issues. A well-formed issue is also a **spec** (see the AI track lesson on [specs and acceptance criteria](/library/tracks/working-with-ai-agents/04-specs-and-acceptance-criteria)):

```text
Title: Phone check accepts local formats (UK, IE, CA)

Problem: <for whom, what goes wrong, with evidence>
Goal: <what will be true>
Out of scope: <what not to do>
Acceptance criteria:
  1. ...
Links: epic E-02, interview notes discovery/2026-03-09.md
Owner: <human>
```

Give each issue one owner, a human. Agents can be assigned work in practice, but accountability has a human name.

### Milestones

A **milestone** groups issues toward a goal and a date. GitLab shows progress as issues close. See the [milestones documentation](https://docs.gitlab.com/user/project/milestones/). Use a milestone for a slice of an epic: "E-02 Sign-up works for all three countries, due 15 April". The description states the goal in a sentence, and links to the epic file.

Rules of thumb:

- A milestone has one clear goal. If you cannot state it in a sentence, split it.
- Its length is days to a few weeks.
- Every issue in it serves the goal. If not, move it.
- Close it with a short note: what shipped, what did not, what you learned.

### Labels

**Labels** classify issues and merge requests. See the [labels documentation](https://docs.gitlab.com/user/project/labels/). On the free plan labels are flat: GitLab does not enforce that you pick only one from a group. Scoped labels (such as `status::doing`, where only one can apply) are a paid feature. Without them, you keep order by convention: a short naming style such as `status-ready`, `status-doing`, `status-review`, `status-blocked`, and a rule in your contributing file that an issue has exactly one status label.

A small, useful set:

| Group | Labels |
|---|---|
| Status | `status-ready`, `status-doing`, `status-review`, `status-blocked` |
| Type | `type-bug`, `type-feature`, `type-docs`, `type-research` |
| Who | `agent-builder`, `agent-reviewer`, `human-only` |
| Change | `change-standard`, `change-normal`, `change-emergency` (see the Change Record template) |

Keep under twenty labels. Delete the unused ones.

### Boards

A **board** shows issues in columns by label, for example status. Drag a card to change its label. A board is your control panel when several agents work at once. Keep it honest: if an agent is working on an issue, the card says so.

### Epics: what the paid feature adds

Epics are a GitLab feature for grouping issues across projects under a theme, with a roadmap view. On GitLab.com they require a paid plan. If you have it, the [epics documentation](https://docs.gitlab.com/user/group/epics/) shows how. If you do not, use the epic file and milestone method. Either way, the epic text is written by a person. Do not buy a plan to follow this track.

### Linking and closing

Mention `Closes #14` in an MR so that merging closes the issue. Use `Related to #16` for connections. Link the issue to the epic file and the interview notes that support it. Later, anyone can follow the chain from decision to evidence to change.

### Definition of ready and done

Write two short lists in your contributing file.

- **Ready:** the issue has a problem, a goal, out-of-scope, acceptance criteria, a human owner and a milestone.
- **Done:** criteria verified, merge request approved by someone else, pipeline green, AI use disclosed, issue closed.

An agent should only be given issues that are ready.

### Service management in plain issues

The IT service management tradition keeps requests, incidents, problems and changes as tickets with types and states. An overview is in Atlassian's [ITSM introduction](https://www.atlassian.com/itsm). You can do the same with labels and templates in GitLab. The Dojo's [Service management in git](/library/itil-in-git) page shows how.

## 3. Step by step: plan a milestone

1. **Write the epic** as a file in the planning repo, in your own words. State the customer, the problem, the outcome and how you will measure it.
2. **Pick one slice** that delivers a visible part of the outcome in two to three weeks.
3. **Create the milestone.** Title with the epic id, a one-sentence goal, a start and a due date, and a link to the epic file.
4. **Draft the issues.** You may ask an agent to propose a breakdown from your milestone text. Keep what is real, drop what is not, add what is missing.
5. **Make each issue ready** using the definition of ready.
6. **Create your labels** and a board with status columns.
7. **Assign issues** to a human owner, and mark which are for agents.
8. **Start work in order,** moving cards as states change.
9. **Review the board every day or two.** Look for stuck cards.
10. **Close the milestone** with a note.
11. **Update the epic file** if what you learned changes the plan. A person decides.

## 4. Worked example: TrailMug

Maya wrote `epics/E-02-signup.md` herself after five interviews: "Café owners in three countries can create an account without help. Measure: sign-up completion on the test site from our own tests; later, a real conversion rate from real users once there are any." She does not invent numbers. The file lists the evidence in `discovery/`.

She creates milestone **"E-02 Sign-up works (UK, IE, CA)"**, due 15 April, goal: "Any café owner can finish sign-up with a local phone format and see the form in their language."

She asks an agent: "Here is my milestone text. Propose issues of agent size. Flag file overlaps. Do not add scope." It proposes six. Maya keeps four, drops two (a rewrite of the form and a new analytics tool, both outside the goal), and adds one the agent missed: "Update the help page". Each issue gets a spec section and a human owner.

Her labels follow the table. The board has four columns. She puts three issues in `status-ready` for agents and keeps one `human-only`: "Choose the email provider". It is a product and cost decision.

During the week the board shows issue 14 in review, issue 15 doing, issue 16 blocked on 14. At the end of the milestone she writes a closing note: shipped 14, 15, 17; 16 slipped; one dead link and one out-of-scope edit were caught in review. The epic file is updated by Maya after reading the note. The agents did not touch it.

## 5. Working with AI agents on this

**What the PDM decides:** the epic, the milestone goal and date, the order, the label meanings, what is ready.

**Delegate:** drafting issue text from your spec, proposing a breakdown, checking that issues have all sections, applying labels, summarising the board, drafting the closing note from merge history.

**Verify:** you read every issue as the builder would, and ask "could I build this from the page alone?". You compare the milestone with the epic to see that nothing has drifted.

**Never delegate:** the epic and the roadmap. See [People write epics](/library/people-write-epics). The allowed use is checking and questions.

**Prompt to check issue quality:**

```text
For each issue below, check it against this list: problem, goal, out of scope,
acceptance criteria (each testable), owner, milestone. Output a table: issue,
missing items, untestable criteria. Do not rewrite the issues and do not add scope.
<paste issues>
```

**Prompt to summarise status for your own read:**

```text
From this list of issues and merge requests with their labels, write five lines:
what is done, what is in review, what is blocked and why, what looks late, and
what you cannot tell from the data.
```

**Disclose:** note in the milestone's closing note which parts agents drafted.

## 6. Common mistakes and how to avoid them

- **Issues that are really epics.** "Improve onboarding." Fix: split to agent size.
- **No acceptance criteria.** Fix: add them before handing to an agent.
- **Too many labels.** Fix: under twenty.
- **Treating the board as decoration.** Fix: update it as work moves.
- **Letting an agent write the epic.** Fix: you write it.
- **Milestones with no goal.** Fix: one sentence.
- **Buying a plan because the track mentions epics.** Fix: do not. Use the file and milestone method.
- **Leaving issues open after merge.** Fix: `Closes #n` in the MR.

## 7. Practice

**Deliverable in git:** `epics/<epic>.md` (yours), `specs/<issue>.md` for three issues, `briefs/` and `reviews/` notes, and a milestone with issues in GitLab.

1. Write a short epic file for a product idea you care about, in your own words, with customer, problem, outcome, measure and evidence links.
2. Create a milestone with a one-sentence goal and a date.
3. Ask an agent for a breakdown. Record what you kept, dropped and added, and why.
4. Write three ready issues with acceptance criteria.
5. Create the label set and a status board.
6. Direct an agent to implement one issue. Verify it against its criteria in `reviews/<issue>.md`.
7. Close the milestone with a closing note listing what shipped and what you learned.
8. Commit the files in a merge request with a disclosure block.

## 8. Checklist

- [ ] The epic is written by me and lives in git.
- [ ] The milestone has a goal, a date and a link to the epic.
- [ ] Each issue is ready: problem, goal, out of scope, criteria, owner.
- [ ] Labels are few and meaningful, with one status per issue.
- [ ] The board matches reality.
- [ ] I verified the work against the criteria.
- [ ] I closed the milestone with a note.

## 9. Further learning

The GitLab documentation pages on issues, labels and milestones are short and worth reading in full. The GitLab tutorials index has guided lessons on boards and project management. Atlassian's ITSM introduction shows how the same ideas appear in enterprise tools.
