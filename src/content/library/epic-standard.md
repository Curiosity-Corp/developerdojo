---
title: "Epic standard"
description: "What a good epic contains, how big it should be, and how to write one."
section: "Standards"
order: 2
---

An **epic** is a whole-product outcome that crosses several repositories and takes weeks to months. A human writes it. See [People write epics](/library/people-write-epics).

## An epic is not

- A bigger issue.
- A list of tasks.
- A feature name such as "landing pages".

If an epic lives in only one repo, it is probably a milestone.

## The title

Write the result for a person. Good: "Visitors can request a welcome cup". Weak: "Landing pages".

## The template

```text
## Who
The person this helps (a persona name) and the journey step.

## Goal
One or two sentences. What changes for the customer or the business?

## Measure
The number that proves it, with a date.

## Repositories
- trailmug-site (exists): what it does for this epic
- trailmug-svc-leads (planned): what it does for this epic

## Interfaces
Which addresses, events, fields or settings connect the repos?
Names only. Never secrets.

## Acceptance (the epic is done when)
- [ ] A visible result a person can check
- [ ] Another visible result

## Order
What must be built first, and why.

## Out of scope
What this epic will NOT do.

## Risks I accept
- Risk, accepted by <name>

## Owner
<name>. Decisions go in the comments.
```

## Size rules

Split an epic when:

- it touches more than three repos;
- its parts have different dates or owners;
- you cannot describe the goal in two sentences.

Do not split for one issue. Make it an issue. Keep the tree flat: at most three levels.

## The five core lines

Always write these five yourself:

1. Who is the user?
2. What changes for the user?
3. What number proves it?
4. Which repos are involved?
5. In what order do they ship?

## Example

```text
Who: Maya, the commuter, at the "join" step.
Goal: A visitor leaves an email on the page and receives a welcome
  message. The lead appears in the customer list.
Measure: 200 sign-ups from the page in 8 weeks.
Repos: trailmug-site (exists), trailmug-svc-leads (planned),
  trailmug-crm (planned)
Acceptance:
  - [ ] Form posts and shows a thank-you page
  - [ ] Lead appears in the customer list within 1 minute
  - [ ] Welcome message arrives within 5 minutes
Order: customer list first, then service, then page.
Out of scope: payments, app sign-in.
Owner: Maya.
```

## Readiness for agents

An epic is agent-ready when it has goal, repos, interfaces, acceptance, order and owner. See [Week 4](/library/week-4-defend-the-roadmap).

## Agents and epics

Agents may read an epic, ask questions and comment. They never edit its goal, title or acceptance.

## Epic hygiene

- No epic without an owner, a goal and dates.
- Update dates the same day they change. Write one comment with the reason.
- Close epics when done.
