---
title: "Issues, milestones and labels"
description: "How to run a whole-product plan with issues, milestones and labels, on a free git account or a paid one."
section: "Standards"
order: 5
---

This page shows how to keep your plan in a git host. Examples use GitLab words. GitHub and others have similar tools.

## Which features are free?

Plans change. Check the current documentation for your tier. At the time of writing, GitLab's documentation lists:

| Feature | Free | Paid |
|---|---|---|
| Issues | Yes | Yes |
| Milestones | Yes | Yes |
| Labels (plain) | Yes | Yes |
| Boards for issues | Yes | Yes |
| Scoped labels (`status::done`) | No | Premium and above |
| Epics | No | Premium and above |

So on a free account: use **issues, milestones and plain labels**. If you have epics, use them the same way.

## The levels in git

| Level | Free account | Paid account |
|---|---|---|
| Epic | An issue with the label `epic`. Links to task issues in its description. | An epic |
| Milestone | A milestone with a goal and a due date | Same |
| Issue | An issue | Same |

## Milestones

A milestone is a time-boxed slice of work. It has a goal and a date and lasts days to three weeks.

Name it with the repo first: `site v0.1 - Home page live`.

Use `v0.x` until the first public release. Close it when its issues are closed.

## Issues

One issue is one task that one agent or person finishes in one merge request.

```text
## Context
Why this issue exists. Link to the epic.

## Goal
One sentence.

## Acceptance criteria
- [ ] Something a person can test
- [ ] Another

## Out of scope
- Thing not to do

## Links
- Epic: #12
- Blocked by: #3
```

A human approves the acceptance criteria before work starts.

## Labels

On a free account, use plain labels with a clear prefix in the name. Use a dash, not a double colon.

| Group | Examples | Meaning |
|---|---|---|
| repo- | `repo-app`, `repo-site` | Which repo the work touches |
| kind- | `kind-epic`, `kind-bug`, `kind-docs`, `kind-integration` | Type of work |
| status- | `status-idea`, `status-ready`, `status-in-progress`, `status-blocked`, `status-review`, `status-done` | Where it is now |
| priority- | `priority-p0` to `priority-p3` | How urgent |
| journey- | `journey-discover`, `journey-join`, `journey-pay`, `journey-use`, `journey-support` | Which customer step |

Rules:

- One status label and one priority label per item. You must keep this by hand on a free account.
- A repo label on every issue.
- Never invent a new group without telling the team.

## Links

| Link | Meaning |
|---|---|
| related | Same topic |
| blocks | This must finish first |
| is blocked by | The reverse |

In text, refer to other work by its number: `#12` for an issue, `!7` for a merge request. For another repo write the full path.

Closing an issue from a merge request: write `Closes #12` in the description.

## Boards

A board shows issues as cards in columns. Make one column per `status-` label. Drag a card to change its status. Use the board in the weekly meeting.

## The three views

- Roadmap (table or timeline) for leaders.
- Board for the weekly meeting.
- Issue list for builders.

## Key points

- The discipline matters more than the feature: a human-owned, written, dated plan.
- Free tools are enough. Check current documentation before you rely on a paid feature.
