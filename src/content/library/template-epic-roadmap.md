---
title: "Template: Epic and roadmap"
description: "Write one epic by hand and lay your epics out as a roadmap."
section: "Templates"
order: 6
---

> Rule: you write every line yourself. An AI may check spelling and format after you decide. It may not decide.

## Epic

```text
Date written: <YYYY-MM-DD>   Author (human): <your name>

Title (the outcome, in six words):

Product:

Customer problem, in my own words (3 to 5 sentences):

Who is the user? Which journey step does this help?

Why now? What happens if we do nothing?

Repos I expect (count them):
- <repo>  (kind)  planned | exists

Definition of done (testable, three to five lines):
1.
2.
3.

Out of scope (so the agents do not guess):
-

Risks I accept (with my name):
- <risk>   accepted by <name>
```

## Roadmap

| # | Epic | Owner | Start | Due | Depends on | Status | Why this place in the order |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |
| 2 | | | | | | | |

Add a short list: **What I chose not to build, and why.**

## Milestones for the first epic (3 to 5)

| # | Milestone | Repo | Due | Done when |
|---|---|---|---|---|
| 1 | | | | |

## After you decide

You may now ask an AI agent to turn your milestones into issues. The agent builds. You review every merge request. You accept or reject.

## Example (TrailMug, fictional)

```text
Title: Visitors can request a welcome cup
Problem: People like the idea of a reusable cup but have no easy first
  step. They leave the site without a clear next action.
Who: Maya, at the "find" step.
Repos: trailmug-site (exists), trailmug-svc-leads (planned),
  trailmug-crm (planned)
Done:
  1. A visitor submits an email on the page
  2. The lead is in the customer list within 1 minute
  3. A welcome message arrives within 5 minutes
Out of scope: payments, sign-in
Risk: the email provider may delay messages. Accepted by Maya.
```
