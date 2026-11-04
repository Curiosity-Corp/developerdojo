---
title: "Plan the cycle and define done"
description: "Plan one cycle around a goal, estimate honestly when agents do the building, set limits on work in progress and write a definition of done that every piece of work must meet."
section: "Agile delivery"
order: 3
track: "agile-delivery"
level: "core"
duration: "3 hours"
outcomes:
  - "Plan a cycle around one goal and a realistic amount of work"
  - "Estimate with humility, and say what estimates mean when agents build"
  - "Write a definition of done and apply it to every item"
  - "Track a cycle in GitLab with a milestone and a board"
resources:
  - "atlassian/sprint-planning"
  - "atlassian/story-points-estimation"
  - "atlassian/definition-of-done"
  - "scrum-org/scrum-guide"
  - "gitlab/milestones"
  - "atlassian/agile-standups"
prerequisites:
  - "week-4-defend-the-roadmap"
  - "weekly-cadence-and-common-mistakes"
updated: 2026-11-03
---

**Supports:** Developer, weeks 4 to 6: the cycle that produces your work. **Time:** about three hours, plus the cycle itself.

## 1. Why this matters

Planning a cycle is a promise to yourself and to the people who rely on you: "By Friday, this will work for a person." A good plan makes the promise small enough to keep and clear enough to test. A bad plan is a list of hopes.

The definition of done is the other half. Without it, "done" means whatever the person who did the work felt like. With agents, that is dangerous. One agent says done when the tests pass. Another says done when the page loads. A third forgets to update the documentation. A Product Development Manager (PDM) writes the standard once, in plain words, and applies it to every item, human or agent.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| The cycle goal, the amount of work, the limits and the definition of done | Splitting stories into tasks; building; running tests; reporting progress; drafting the plan text | You run every acceptance check; the done list is ticked by a person; the board matches reality | Engineering (capacity, review), finance (agent and tool cost), operations (release), security (data and secrets), support (what changes for customers) |

## 2. Key ideas

### Plan around a goal

The Scrum Guide describes sprint planning as answering three questions: why is this sprint valuable (the **sprint goal**), what can be done in this sprint, and how will the chosen work get done. Atlassian's page on sprint planning describes the same event for a practical audience.

The goal comes first, in one sentence a person would understand: "A café owner can join TrailMug without a phone call." Choose the work that serves it. If some work does not serve the goal, it waits, even if it is easy.

### How much work fits

Do not fill the cycle. Plan for **less than you think** and leave room for review and surprises. Use what you actually finished in recent cycles as your guide, not what you hoped to finish. In a first cycle you have no history, so plan small, and look at what happened.

### Estimating, honestly

Atlassian's page on story points describes a relative way of sizing stories, with a scale such as 1, 2, 3, 5, 8, so that teams compare items instead of guessing hours. It is a useful idea for human teams who have worked together for a while.

Be careful when agents do the building:

- Points were designed to express **human effort and uncertainty**. An agent can build in minutes what a human would take a day for, and fail at something that looks trivial.
- The cost that remains stable is **review**: reading, running checks and deciding. A good estimate for agent work is "how long will it take me to specify and verify this?".
- **Size** still matters. A small, clear story is more likely to be right the first time.

A practical approach for a small team with agents: size each story as **small, medium or too big**. Small means one sitting to check. Medium means a few sittings. Too big means cut it. Count the stories that fit, not points.

Never turn an estimate into a promise to a customer. Say "we plan to" and give a range.

### Limit work in progress

The more things you start, the fewer you finish. Set a limit: at most two items in progress at once for a solo manager with agents, and more only if you have people to review. Kanban teaches this idea of limiting work in progress, and it works in sprints as well. Several agents can run in parallel only as fast as you can review their results.

### The definition of done

The Scrum Guide calls the definition of done a formal description of the state of the increment when it meets the quality measures. Atlassian's page explains it as a checklist that applies to every item. In practice it is a short list. A good first version:

- All acceptance checks were run by a person and passed.
- Automated tests pass in the pipeline.
- No secrets or personal data in the repo.
- The change is documented where a person would look for it.
- The change went through a merge request that a person read.
- AI use is disclosed in the merge request.
- The decision log is updated if a decision was made.
- The board and the backlog are up to date.

The Dojo adds one rule: **an item is not done until a person has run its checks**. An agent saying "done" is a claim, not a fact.

### The daily check

A daily check is a short moment to see progress toward the goal and find blockers. Atlassian's page on stand-ups describes a brief meeting. For a solo manager with agents it can be a written note and a five-minute look at the open merge requests. Its job is to catch work going in the wrong direction early.

### Track the cycle in GitLab

Create a milestone for the cycle with the goal in its description and the start and due dates. Attach the stories as issues. Use a board for the cycle: to do, doing, review and done. GitLab's milestone documentation shows progress and burndown views for the milestone. Check the current docs for what your plan includes.

## 3. Step by step

### Step 1: Look back

If you have run cycles, list what you planned and what you finished. If not, skip this and plan small.

### Step 2: Write the goal

One sentence, a person, a result. Share it with whoever depends on you.

### Step 3: Choose the work

From the top of the backlog, pick the stories that serve the goal and meet the definition of ready. Do not pick more than you can review.

### Step 4: Size and limit

Mark each story small, medium or too big. Cut the big ones. Set the work-in-progress limit.

### Step 5: Write the definition of done

Write or update `delivery/definition-of-done.md`. Keep it to five to ten lines, each one checkable.

### Step 6: Set up the cycle in GitLab

Create the milestone, attach the issues and set up the board.

### Step 7: Brief the agents

For each story, write the brief with goal, scope, limits, output and stop rule, as in the roadmapping track. Give the definition of done to every agent.

### Step 8: Run the daily check

Look at the board and the open merge requests every day. Move cards. Ask: "Are we closer to the goal?" If an agent is going the wrong way, stop it and rewrite the brief.

### Step 9: Close the cycle

At the end, apply the definition of done to each item. Move the unfinished items back to the backlog without shame. Move to the review in lesson 4.

## 4. Worked example: TrailMug

TrailMug is fictional. One-week cycle, solo founder with agents.

**Looking back:** the previous week, she planned five stories and finished two. The other three needed review she had not scheduled.

**Goal:** "A café owner can join TrailMug without a phone call."

**Work chosen (3 stories):**

| Story | Size | Why |
|---|---|---|
| Sign-up form and submission | Medium | Core of the goal |
| Confirmation and founder notification | Small | Completes the loop |
| Mobile layout of the form | Small | Check 5 of the story |

She left out the privacy notice link story because the notice was not live, and the "Why join" page because it did not serve the goal.

**Work-in-progress limit:** two stories at once.

**Definition of done (excerpt):**

```markdown
# TrailMug definition of done
1. Every acceptance check was run by me on the running site and passed.
2. Pipeline tests pass.
3. No secrets or personal data in the repo.
4. The merge request says what changed and how to check it.
5. AI use is noted in the merge request.
6. The decision log has a line if I decided something.
7. The board and the backlog are current.
```

**Daily check on Wednesday:** one agent had added a form library nobody asked for. She stopped it, rewrote the limit "add no new dependencies without asking" in the brief and restarted. She noted in the log: "Wednesday: removed an unrequested dependency; brief updated."

**Result on Friday:** two stories passed all checks. The third failed check 5 on her phone. She moved it back to the backlog with a note, and did not change the definition of done to let it pass.

## 5. Working with AI agents on this

**Delegate:**

- **Splitting stories into tasks.** "Split this story into tasks of under two hours each, with the files each will touch. Do not change the acceptance checks."
- **Building the tasks** under your brief and limits.
- **Running tests** and reporting results.
- **A progress note.** "Summarise open merge requests: what changed, which checks are claimed as passed, what is waiting for me."
- **A done-list pre-check.** "For each merge request, list which items of the definition of done have evidence in the diff and which have none."

**Do yourself:**

- Write the goal and choose the work.
- Set the limits.
- Write the definition of done.
- Run the acceptance checks.
- Decide whether an item is done.

**A brief you can adapt (progress note):**

```text
Read the open merge requests in this project. For each, give one line:
title, the stories it addresses, what changed, which acceptance checks it
claims to pass and which items of delivery/definition-of-done.md have
evidence in the diff. Do not approve, merge or comment. Flag any
merge request that touches files outside the paths listed in its brief.
```

**How to check the output.** Pick two merge requests at random and compare the note with the actual diff. If the note says "tests added", find the tests. If it says "no new dependencies", check the lock file.

**Several agents in parallel.** Limit them to what you can review. Give each a separate set of paths. Write shared names in one file. If two agents touch the same file, one should wait.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson spans **delegate** and **orchestrate**. Running two or three agents in a cycle is orchestration. The definition of done is policy, the pipeline tests are an automatic gate and your reading of the merge request is the human gate. The [agent orchestration track](/library/tracks/agent-orchestration/) shows how that grows to a fleet.

**Disclose.** In each merge request and in the cycle note: which parts the agents built and which checks you ran.

## 6. Common mistakes

- **Planning to capacity.** Plan for less. Leave room for review.
- **A goal that is a list.** One sentence, one person, one result.
- **Points as promises.** Estimates are guesses, not commitments.
- **Using human estimates for agent work.** Estimate the cost to specify and verify.
- **No work-in-progress limit.** Everything is started and nothing is finished.
- **Changing the definition of done to pass an item.** Move the item back instead.
- **Accepting an agent's "done".** Run the checks.
- **Adding work midweek.** New work waits, except urgent fixes in the flow lane.
- **Hiding unfinished work.** Move it back to the backlog and learn from it.

## 7. Practice: plan and run one cycle

**Deliverable:** in your git repo:

1. `delivery/cycle-01/plan.md`: the goal, the stories chosen with size, what was left out and why, and the work-in-progress limit.
2. `delivery/definition-of-done.md`: five to ten checkable lines.
3. A GitLab milestone and board for the cycle (a screenshot saved as `delivery/cycle-01/board.png`).
4. At least two daily notes in `delivery/cycle-01/notes.md`.
5. `delivery/cycle-01/result.md`: for each story, done or not, with the evidence that you ran the checks.
6. Your AI-use line.

Commit with a message such as `Plan and close cycle 01`.

**Check:** for each story marked done, a person other than you should be able to find the evidence that its checks were run. If it is missing, the story is not done.

**Stretch:** compare what you planned with what you finished. Write three lines on why. Plan the next cycle from that, not from hope.

## 8. Checklist

- [ ] The cycle has a one-sentence goal.
- [ ] I chose less work than I thought I could do.
- [ ] Stories are marked small, medium or cut.
- [ ] There is a work-in-progress limit.
- [ ] The definition of done is written, short and checkable.
- [ ] Every agent has the brief and the definition of done.
- [ ] I ran the checks before calling anything done.
- [ ] Unfinished items went back to the backlog.
- [ ] I recorded my AI use.

## 9. Further learning

The Scrum Guide describes sprint planning and the definition of done in its own words. Atlassian's pages on sprint planning, story points, the definition of done and stand-ups give practical detail. GitLab's documentation on milestones shows how to track a cycle. In the next lesson you hold the review and the retrospective, and decide what to change.
