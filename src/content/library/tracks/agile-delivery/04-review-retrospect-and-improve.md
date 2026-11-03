---
title: "Review, retrospect and improve"
description: "Hold a review that tests the real product, run a retrospective that ends in one decided change, read a few honest measures and include agents' work in what you learn."
section: "Agile delivery"
order: 4
track: "agile-delivery"
level: "core"
duration: "2.5 hours"
outcomes:
  - "Run a review where the real product is used against the acceptance checks"
  - "Run a retrospective that ends in one or two changes with an owner"
  - "Pick a few measures that tell the truth and ignore the ones that flatter"
  - "Feed what you learn back into the backlog, the roadmap and the briefs"
resources:
  - "atlassian/sprint-reviews"
  - "atlassian/agile-retrospectives"
  - "atlassian/agile-standups"
  - "gov-uk/service-manual-agile-delivery"
  - "gitlab/what-is-agile-delivery"
  - "atlassian/ai-agents-in-project-management"
prerequisites:
  - "week-4-defend-the-roadmap"
  - "weekly-cadence-and-common-mistakes"
updated: 2026-11-03
---

**Supports:** Developer, weeks 4 to 6: closing each cycle. **Time:** about two and a half hours, after you have run a real cycle.

## 1. Why this matters

Planning and building are half of delivery. The other half is looking at what happened and changing what you do. Teams that skip it repeat the same mistakes with more speed. Agents make this worse and better. Worse, because they produce more output to look at, and some of it only looks done. Better, because they can read all of it and report patterns, if you ask well.

For a Product Development Manager (PDM) the review and the retrospective are the places where management actually happens. In the review, you judge the product. In the retrospective, you judge the way of working, including how you briefed and reviewed the agents. Both end in decisions that are written down.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What was accepted, what changes next cycle, what measures you trust | Collecting the facts: merge requests, test results, cycle times; drafting notes; spotting patterns for you to judge | The product, run by a person against the checks; the facts match the notes; each change has an owner and a date | Design (what people saw), support (what customers said), engineering (quality), finance (cost), sales (what to tell customers) |

## 2. Key ideas

### The review is about the product

Atlassian's page on sprint reviews describes a meeting where the team shows what was built and gets feedback. The Scrum Guide describes the sprint review as an inspection of the outcome of the sprint and a time to adapt the backlog. Three rules keep it honest:

1. **Show the real thing, running.** Not slides, not screenshots, not an agent's summary.
2. **Use the acceptance checks.** Run each one in front of someone who is not the builder.
3. **Invite a person who will tell you the truth.** A café owner, a customer, a colleague from another discipline.

Possible outcomes for each item: accepted, sent back with a precise change, or dropped. "Almost" is sent back.

### The retrospective is about the way of working

The Scrum Guide describes the sprint retrospective as a time to plan ways to increase quality and effectiveness. Atlassian's page on retrospectives describes common formats. The simplest is three questions:

- What went well, and should we keep doing it?
- What did not go well?
- What will we change next cycle?

The rule is one or two changes, each with an **owner** and a **date**. Ten changes means none. Review last cycle's changes at the start: did they happen, did they help?

### Include the agents in what you learn

Retrospect on the **briefs** as well as the people. For each piece of work that failed a check, ask: was the brief unclear, was the limit missing, was the check weak or did the agent simply get it wrong? Most failures trace to the brief. When you find a pattern, change the template, not just the single brief.

Useful questions about agent work:

- Which briefs produced a result that passed on the first review?
- Where did an agent go outside scope, and which limit would have prevented it?
- What did review cost you, in time?
- What did we ship that was not checked by a person?

### Measures that tell the truth

Choose few measures, and prefer ones that are hard to flatter.

| Measure | What it tells you | Beware |
|---|---|---|
| Items accepted per cycle (not started) | Whether you finish things | Can be gamed by tiny items |
| Items sent back on review | Quality of briefs and checks | Zero may mean weak review |
| Time from start to accepted | How long value takes to reach a person | Averages hide the long tail |
| Defects found after release | What review missed | Needs honest recording |
| Review time per item | The real cost of agent work | Do not cut it to look fast |

The UK government's service manual page on agile delivery stresses frequent delivery and learning from users. GitLab's explainer on agile delivery ties planning to shipping. Neither asks for a heap of numbers. Count what changes a decision.

### Fix forward

When review finds a problem in something already released, fix forward: write the fix, ship it and add the check that would have caught it. Do not hide it and do not roll back shipped work to make the problem disappear. The retrospective then asks which gate was missing.

### Learning flows back up

What you learn goes back into three places: the **backlog** (new stories, removed stories), the **roadmap** (an epic changes order or scope, with a decision-log line) and the **briefs and definition of done** (better limits and checks). A retrospective that changes none of them did not happen.

## 3. Step by step

### Step 1: Gather the facts

List what was planned and what was accepted. Count items sent back. Note review time. Collect any customer or user feedback from the cycle.

### Step 2: Hold the review

Run each acceptance check on the real running product, with another person present. Record accepted, sent back or dropped, with a line of evidence for each.

### Step 3: Update the backlog

Move sent-back and dropped items. Add new stories from what you learned. Reorder.

### Step 4: Hold the retrospective

Ask the three questions. Include a question about briefs and agents. Write the answers.

### Step 5: Choose one or two changes

Each has an owner (a name) and a date. Write what you will look at next time to know it worked.

### Step 6: Look at measures

Choose three from the table. Write the numbers in a file. Write one line on what they mean and one on what they do not.

### Step 7: Update the roadmap and the log

If something changes the order or scope of an epic, edit the roadmap and write a decision-log line.

### Step 8: Share a short note

Write five lines for the people who rely on you: what shipped, what did not, what you learned, what is next. Keep it plain.

## 4. Worked example: TrailMug

TrailMug is fictional. End of the first cycle.

**Review.** The founder runs the six checks on the sign-up page with Leo's real counterpart, a café owner who agreed to help.

| Check | Result |
|---|---|
| Find the link in under 30 seconds | Passed |
| Finish the form in under ten minutes | Passed in six minutes |
| Founder receives details within a minute | Passed |
| Confirmation says what happens next | **Sent back:** it says "soon", the check says "when" |
| Works on a phone | **Sent back:** postcode field cut off |
| Privacy notice linked | Blocked: notice not live |

The café owner also said: "I didn't know whether to put the owner's name or the café's name." The founder added a story for clearer field labels.

**Retrospective.**

- *Went well:* the written checks made the review fast and fair.
- *Went badly:* an agent added an unrequested library; the phone check failed because nobody tested on a small screen before review.
- *Briefs:* three of four briefs had no stop rule about missing decisions; one agent guessed the café payment rule.
- *Changes:*
  1. Add "test at 375 px width" to the definition of done. Owner: founder. From next cycle.
  2. Add a stop rule about missing decisions to the brief template. Owner: founder. By Monday.

**Measures:** accepted 2 of 3; sent back 2 checks; review took about 90 minutes. She wrote: "Review time is the real cost. I will plan for it explicitly."

**Roadmap.** The privacy notice blocked a check, so she moved the notice epic's next milestone earlier and wrote a decision-log line.

**Note to the part-time designer:** five lines: what shipped, the field-label issue, the phone problem, next goal, what she needs from her on Tuesday.

## 5. Working with AI agents on this

**Delegate:**

- **Fact gathering.** "List every merge request merged this week with its stories, the files changed and the time between opening and merging."
- **Pattern spotting.** "Here are the notes from the last three retrospectives. List changes we agreed that do not appear to have happened. Do not suggest new ones."
- **Brief audit.** "For each brief this cycle, list whether it had a goal, context, checks, scope, limits, output and a stop rule. Mark missing parts."
- **Drafting the note.** From your five facts, a first draft for you to rewrite.
- **Measures.** Compute the numbers from the repo's history. You check three by hand.

**Do yourself:**

- Run the review on the real product.
- Decide accepted, sent back or dropped.
- Lead the retrospective, or at least decide the changes.
- Choose and interpret the measures.
- Decide what changes in the roadmap.

**A brief you can adapt:**

```text
Read the merge requests merged in this project between <start> and <end>,
and the files in delivery/cycle-01/.
For each merge request, report: the stories it addressed, whether its
description lists the checks run by a person, any file touched outside
the paths in its brief, and the days from opening to merge.
Then list every brief in delivery/cycle-01/briefs/ that lacks any of:
goal, context, checks, scope, limits, output, stop rule.
Report facts only. Do not judge quality and do not suggest changes.
```

**How to check the output.** Verify three numbers by hand against the repo. Check that "no files outside scope" is true for one merge request by reading the diff.

**An honest warning.** Atlassian's overview of agents in project management lists many uses. Read it with the Dojo rule in mind: agents can gather and draft, but judging the product and choosing changes stay with you. Be especially careful with a request such as "tell me how the sprint went": the answer will be fluent and general. Ask for facts, then judge them yourself.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson is mostly about **govern**, at small scale. The retrospective is where policy changes: a new line in the definition of done, a new limit in the brief template, a new check in the pipeline. Each change is a rule that works whether or not you are watching. The agent orchestration track (`/library/tracks/agent-orchestration/`) shows how this is done for many sessions at once.

**Disclose.** In the cycle note: "AI use: fact gathering and a first draft. The review, the changes and the roadmap decisions are mine."

## 6. Common mistakes

- **Reviewing slides.** Run the real product.
- **Reviewing with only the builder.** Bring someone who can say no.
- **"Almost done".** Send it back with a precise change.
- **Ten changes from one retrospective.** Choose one or two.
- **Changes without an owner and a date.** They will not happen.
- **Blaming people when the brief was the problem.** Look at the brief first.
- **Measures that flatter.** Prefer accepted over started, and count sent-back items.
- **Cutting review time to look fast.** It is the cost of agent work.
- **Rolling back to hide a problem.** Fix forward and add the gate.
- **No changes to the backlog or roadmap.** Then nothing was learned.

## 7. Practice: review and retrospect

**Deliverable:** in your git repo, after a real cycle:

1. `delivery/cycle-01/review.md`: each acceptance check with accepted, sent back or dropped, with evidence and the name of the person who watched.
2. `delivery/cycle-01/retro.md`: the three answers, one question on briefs, and one or two changes each with an owner and a date.
3. `delivery/cycle-01/measures.md`: three measures with the numbers, one line on what they mean and one on what they do not.
4. An updated backlog and, if needed, roadmap and decision log.
5. A five-line note for the people who rely on you.
6. Your AI-use line.

Commit with a message such as `Review and retrospective for cycle 01`.

**Check:** at the next cycle's retrospective, open the changes from this one first. For each, write whether it happened and whether it helped.

**Stretch:** pick the brief that failed worst. Rewrite the template so that class of failure cannot happen again, and write which gate would have caught it.

## 8. Checklist

- [ ] The review used the real product and the written checks.
- [ ] Someone other than the builder watched.
- [ ] Each item was accepted, sent back or dropped.
- [ ] The retrospective asked about briefs and agents.
- [ ] One or two changes, each with an owner and a date.
- [ ] I chose measures that are hard to flatter.
- [ ] The backlog was updated, and the roadmap if needed.
- [ ] The decision log has the changes.
- [ ] I recorded my AI use.

## 9. Further learning

Atlassian's pages on sprint reviews, retrospectives and stand-ups give formats and examples. The Scrum Guide describes the same events in its own words. The UK government's service manual and GitLab's agile delivery explainer show how teams tie delivery to learning from users. Atlassian's overview of agents in project management is worth reading critically. Next in the product group, you learn to explain what you built and why to the people who pay for it.
