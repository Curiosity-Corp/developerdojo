---
title: "Role lens: product management"
description: "How a product manager uses UBF, personas and journeys, epics, roadmaps and ANDROID Ops to decide what to build and in what order, how agent sessions help with research and checks, and how to verify their work."
section: "Frameworks"
order: 42
track: "frameworks"
level: "core"
duration: "45 min"
outcomes:
  - "Describe the product seat in terms of the shared frameworks"
  - "Write an epic yourself and use agent sessions to check, never to author, it"
  - "Run a weekly product loop with a board, acceptance criteria and a decision queue"
resources:
  - "atlassian/product-owner"
  - "atlassian/epics"
  - "atlassian/agile-roadmaps"
  - "scrumguides/scrum-guide"
  - "gitlab/docs-issue-boards"
  - "gitlab/docs-milestones"
prerequisites:
  - "tracks/frameworks/40-role-lens-one-shared-language"
updated: 2026-11-03
---

**Dojo programme link:** this lens supports Developer weeks 2 to 4 (people, problems to epics, defend the roadmap).

## 1. Why this matters

Product management is the discipline of deciding what to build, for whom, and in what order, and then making sure the thing built solves the problem. It sits between the people who have the problem and the people (and agent sessions) who build the solution.

The seat is hard because it has authority only through clarity. A product manager rarely commands anyone. They write clearly, keep promises, and make trade-offs visible. Agent sessions make this sharper: a session builds exactly what the issue says, quickly. If the issue is wrong, you get the wrong thing quickly.

## 2. Key ideas, explained

### 2.1 What the seat owns

| Responsibility | Framework or artefact | File in git |
|---|---|---|
| Know the problem and the people | UBF, DREAM Relate, personas and journeys | `docs/personas.md`, `docs/journeys.md` |
| Choose outcomes | Epics (written by a person) | `roadmap/epics.md` |
| Order and date | Roadmap | `roadmap/roadmap.md` |
| Say what "done" means | Acceptance criteria | In each issue |
| Keep the work visible | Board, milestones, labels | GitLab board |
| Keep a record of choices | Decision records | `docs/decisions/` |

### 2.2 Epics and issues

An **epic** is an outcome for a person that crosses several repositories and takes weeks. An **issue** is a hand-off small enough for one session or one person to finish in one merge request. The epic template ([epic standard](/library/epic-standard)) has Who, Goal, Measure, Repositories, Interfaces, Acceptance, Order and Out of scope.

A good test: can you finish the sentence "When this is done, [person] can [do something they could not do before], and we will see it in [measure]"? If not, it is a feature name, not an epic.

The Atlassian pages on [epics](https://www.atlassian.com/agile/project-management/epics), [roadmaps](https://www.atlassian.com/agile/product-management/roadmaps) and the [product owner role](https://www.atlassian.com/agile/product-management/product-owner) are readable references. The [Scrum Guide](https://scrumguides.org/scrum-guide.html) defines the accountability of the product owner, including the product backlog.

### 2.3 Writing acceptance criteria that sessions can use

An acceptance criterion is a check that can pass or fail. "Fast" is not one. "The search answers in under one second for 95 percent of requests in the test set" is. Write criteria in the form: **Given** a situation, **when** something happens, **then** an observable result. Sessions and testers can then build and check against them.

### 2.4 The weekly loop

A simple rhythm, on a board with columns such as Backlog, Ready, In progress, In review, Done (see GitLab's [issue boards](https://docs.gitlab.com/user/project/issue_board/) and [milestones](https://docs.gitlab.com/user/project/milestones/)):

1. **Monday:** review the board, choose what is Ready. An issue is Ready only when it has outcome, scope, acceptance and a stop rule.
2. **Midweek:** review merge requests against acceptance. Answer questions in the issue, not in side chats.
3. **Friday:** demo what is Done, update the roadmap if reality changed, write the decision records.

### 2.5 The free-plan note

Epics and scoped labels are paid features on GitLab's free plan. Keep the epic list in `roadmap/epics.md`, use a milestone per epic and plain labels for focus areas (see [lesson 24](/library/tracks/frameworks/24-running-android-ops-in-gitlab/)).

### 2.6 The decision queue

When sessions and people work in parallel, questions pile up: a session stops with a BLOCKED note, a designer asks which option, a partner wants a date. Keep one **decision queue**, a plain list in `docs/decisions/queue.md` or a label on the board. Each entry has the question, who must answer, the date it blocks work, and the options you already know. Answer the oldest blocking item first. A session that stops costs nothing while it waits, but a person who waits a week loses momentum. Review the queue at the start of every weekly loop, and turn each answer into a decision record so that the next session starts from it.

Three kinds of question belong only to the product seat: **scope** (do we add this or leave it out), **priority** (does this come before that) and **trade-off** (do we accept a slower search to ship a week sooner). If a session asks one of these, do not let it guess. Answer it, record it, and, if the same question comes up twice, add the answer to the issue template or `AGENTS.md`.

### 2.7 Measuring the product seat

Judge your own work by outcomes: how many of your epics met their measure by the date you set, how often you changed the order and why, and how many issues came back from review because the acceptance was unclear. The last number tells you how good your specifications are. If it is high, your briefs are the problem, not the sessions.

## 3. Step by step

1. **Read the evidence** (interviews, support notes, the board).
2. **List problems** and group them by person and journey step.
3. **Write epics** yourself, four to eight.
4. **Order them** with a reason for each; write the out-of-scope list.
5. **Split the first epic into issues**, each with acceptance and a stop rule.
6. **Set the board** and the milestone.
7. **Run the weekly loop**; keep a log of decisions.
8. **Review** with the founder monthly (the GROWTH review).

## 4. Worked example: TrailMug

Maya wears the product hat when she writes epic 2, "A café can start in one visit."

- **Who:** Leo, café owner, Onboard stage.
- **Goal:** a new café is live, scanning cups, within one visit of under 30 minutes.
- **Measure:** setup time on the first three cafés.
- **Repositories:** the web app, the admin tool, the printed guide.
- **Acceptance:** Given a new café account, when the owner follows the guide, then the first scan works and the café appears in the finder.
- **Out of scope:** payment setup, loyalty.

She splits it into five issues. One reads, "Admin page: add a café with name, address and opening hours. Done when a new café appears in the finder within a minute and the page passes the accessibility checklist. If an address cannot be located, show a clear error and stop; do not guess." She ran the weekly loop with Friday demos for Leo and two baristas. After the second demo she moved the printed guide earlier because Leo said the scan step was where he got stuck.

## 5. Working with AI agents on this

**What the PM decides.** Which problems matter, the epics and their order, acceptance, what is dropped, when work is done.

**What is delegated, with the exact brief.**

```text
Read roadmap/epics.md (written by me). For each epic, check that it has
Who, Goal, Measure, Repositories, Interfaces, Acceptance, Order and Out of
scope. List missing fields and any acceptance statement that cannot be
tested (explain why). Do not rewrite the epics.
```

```text
Read research/interviews/ and support/notes/. Group every pain point by
journey stage (Aware, Consider, Buy, Onboard, Use, Support, Return).
Quote the exact words and give the file. Do not propose features.
```

```text
Read issue #N and its linked merge request. List each acceptance criterion
and say PASS or FAIL with the line or test that shows it. If you cannot
tell, write UNKNOWN. Do not approve the merge request.
```

**How to verify.** Read the epic yourself; sample three quotes; run the acceptance check on a real build.

**Disciplines involved.** Founder (the why), design (the how it feels), engineering (the how), marketing (the message), finance (the cost), operations (the run).

**Where orchestration begins.** When you have several Ready issues across different files, you can run several sessions at once. The PM's job then includes **splitting well** (no two sessions in one file), and keeping a short queue of decisions for sessions that stop with BLOCKED notes. The [Agent orchestration](/library/tracks/agent-orchestration/) track covers queues and briefings.

**Hard rule.** People write epics and roadmaps ([People write epics](/library/people-write-epics)). Agents may check and draw.

## 6. Common mistakes and how to avoid them

- **Feature lists as epics.** Write outcomes for people.
- **Acceptance you cannot test.** Make it pass or fail.
- **Too many epics.** Four to eight.
- **No out-of-scope list.** It protects the plan.
- **Agent-written roadmap.** Write it yourself.
- **Issues that need a meeting to understand.** Put the context in the issue.
- **Moving cards by promise.** Move by evidence.
- **Ignoring the support queue.** It is your best research.

## 7. Practice

**Deliverable in git:** a branch `product-lens`:

1. Two epics written by you in `roadmap/epics.md`, all fields.
2. Five issues split from one epic, each with acceptance and a stop rule.
3. A board and milestone described in `docs/board.md`.
4. A weekly log `docs/weekly/` with two entries.
5. Two decision records.
6. An agent check output (brief and result) saved in `docs/checks/` with your notes on what it missed.

## 8. Review checklist

- [ ] Each epic names a person, a goal and a measure.
- [ ] Each issue is Ready: outcome, scope, acceptance, stop rule.
- [ ] Out of scope is written.
- [ ] I wrote the epics myself.
- [ ] The board matches reality.
- [ ] Decisions are recorded.
- [ ] I read at least one agent check against the source.

**Next:** the [design lens](/library/tracks/frameworks/43-role-lens-design/) shows how the same epics become screens and experiences people can use.
