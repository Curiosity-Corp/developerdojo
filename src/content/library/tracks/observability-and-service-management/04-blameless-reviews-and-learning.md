---
title: "Blameless reviews and learning"
description: "How to write an incident review that changes something: facts before opinions, causes before culprits, and every review ending in a gate, a test, a check or a rule that stops the next one."
section: "Observability and service management"
order: 4
track: "observability-and-service-management"
level: "core"
duration: "80 min"
outcomes:
  - "Explain why blameless reviews find more causes than blaming people"
  - "Write a review with a timeline, causes, what went well and actions with owners"
  - "Turn every review into a gate that prevents the same class of failure"
  - "Direct an agent to draft a review from the record and verify it against the facts"
prerequisites:
  - "the-way-five-rules"
resources:
  - "google-sre/postmortem-culture"
  - "atlassian/blameless-postmortem"
  - "atlassian/incident-management"
  - "gitlab/incident-management"
  - "dora/software-delivery-performance-metrics"
updated: 2026-11-03
---

Lesson 4 of the Observability and service management track. It follows the incident in lesson 3, and it uses the Incident review section at the end of the Change Record template (`/library/template-change-record`).

## 1. Why this matters

An incident is expensive. The only way to get value back is to learn from it, and the way a team treats the people involved decides whether it learns or hides. If the review asks "who broke it?", people stop reporting problems, remove evidence of their own mistakes and become careful in the wrong ways. If it asks "how did our system let this happen?", people tell the whole truth, and you find causes that no single person could have seen.

A good review also ends in something concrete. A lesson that lives only in someone's memory is lost with the person. A **gate**, such as a test, a check, a rule or a permission, protects the next person, and the next agent, without anyone needing to remember.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Which incidents get a review, the tone and ground rules, which actions are done and by when, what is shared with customers | Drafting the timeline and review from the record, finding similar past incidents, drafting action items, tracking overdue actions | Checking the timeline against the tools and the channel, reading each cause for hidden blame, checking each action has an owner and a date, checking the gate exists after the due date | Engineering (causes and fixes), support (customer view), leadership (resources for actions), legal and communications (anything shared outside) |

## 2. Key ideas, explained

### Blameless does not mean consequence-free

**Blameless** means that the review looks for causes in the system, the process and the information people had, not in the character of individuals. It starts from a belief that people act reasonably given what they know, and that if a person could make this mistake, so could the next. Google's chapter on [postmortem culture](https://sre.google/sre-book/postmortem-culture/) explains why this is more effective than punishment, and Atlassian's [guide to blameless postmortems](https://www.atlassian.com/incident-management/postmortem/blameless) gives a practical format.

It does not mean that no one is accountable. It means accountability is for **learning and for fixing**: an owner for each action, a date, and follow-through. Genuinely reckless or malicious behaviour is a separate matter for a separate process, not the review.

### When to hold one

Hold a review for every severity 1 incident, any incident with customer data involved, any near miss that could have been serious, and anything surprising. Keep it short for small incidents. Hold it within a few days, while memory is fresh, but after the incident is resolved and people have slept.

### The shape of a review

Use a consistent, short template. Here is a sound one, which matches the incident review in the Change Record template:

| Section | What it holds |
|---|---|
| **Summary** | Two sentences: what happened and the impact. |
| **Impact** | Who, how many, how long, in numbers where possible, and how much error budget was spent. |
| **Timeline** | Time-ordered facts: what was seen, decided and done, with sources. |
| **Causes** | The chain of conditions that made it possible, not one root. |
| **What went well** | Things that worked: the alert, the runbook, the switch. Keep doing them. |
| **What went badly or was lucky** | Gaps and near-misses. |
| **Actions** | Each with an owner, a date, a type, and a link to an issue. |
| **The gate** | The one check, test or rule that would have caught this, and when it will exist. |

### Facts before opinions: the timeline

Build the timeline first, from sources: the deployment history, the alert times, the channel, the logs. Mark each entry with its source. **Do not interpret yet.** An agent can assemble a first draft in minutes from the incident channel and tool exports. A person checks each line, because a smooth, plausible timeline with one wrong time can lead to the wrong cause.

### Causes, not a culprit

Incidents rarely have one cause. They have a **chain**: several conditions that all had to be true. A common technique is to ask "why?" repeatedly, but resist stopping at "human error". Human error is where analysis should start. Ask:

- Why did it make sense to the person at the time?
- What information were they missing, and why?
- What would have made the right action obvious or the wrong one hard?
- Why did the system allow this change without a check?

Example: "Ravi deployed untested code" is blame. "The pipeline allowed a payment change to reach production without a test for rounding in non-default tax regions, and the reviewer was not shown the affected regions" is a cause you can fix.

### Types of action

Not all actions are equal. Prefer the strong ones.

| Strength | Type | Example |
|---|---|---|
| **Strong** | Remove the possibility or make the system enforce it | A pipeline gate that fails if tests for every supported tax region are not present. |
| **Medium** | Detect it faster or limit its effect | A burn rate alert, a feature switch, a smaller release. |
| **Weak** | Rely on people remembering | "Be more careful", a reminder email, extra training. |

A review that produces only weak actions has not finished. Ask of each: **if a new person, or an agent, joined tomorrow, would this still protect us?** If not, find a stronger version.

### The gate

Every review ends with one **gate**: the specific, enforced thing that would have caught or contained this incident. Write it as an acceptance criterion with a due date: "A merge request that changes the payment service fails if the tax test matrix does not cover every region in the catalogue. Done by 14 November. Owner: Ravi." Then verify, after the date, that the gate exists and that it fails when it should, by trying it. The same rule applies to the checks in the earlier tracks: a limit you did not test is an assumption.

### Following up

Reviews fail at the last step. Actions sit in a document and nobody looks again. Put each action in the tracker as an issue with an owner and date, in the same place as normal work. Review the open actions weekly. Report the share completed on time, and count the repeat incidents: a second incident of the same class is a signal that an action was weak or not done. DORA's measure of how long it takes to recover and how often changes fail ([software delivery performance metrics](https://dora.dev/guides/dora-metrics/)) shows whether you are improving over months. Use it to learn, not to rank teams.

### Sharing what you learned

Share reviews inside the organisation so that other teams can learn. For customers, share a short, factual, plain note where appropriate: what happened, what it meant for them, what you changed. Check anything external with communications and legal. Remove names and personal data from the shared version, and never include secrets.

### Using agents for reviews

Agents are very good at the mechanical parts: assembling a timeline from exports, drafting the first version of each section, finding similar incidents, checking that every action has an owner and date. They are weak at judgement: what really mattered, which cause is deeper, and what a gentle but honest tone is. They also tend to produce an elegant narrative that fits the evidence a little too neatly, and they pick up blame language from the record. Use them for the draft, and do the judgement yourself with the people involved.

## 3. Step by step: run a review

1. **Schedule** within a few days of resolution, and invite the people involved.
2. **State the ground rules** at the start: blameless, facts first, every action gets an owner.
3. **Collect sources:** the incident record, channel, deployment history, alerts, logs, customer reports.
4. **Draft the timeline** (an agent can), then check each line against its source.
5. **Walk the timeline together** and add what people knew and thought at each point.
6. **Identify the chain of causes** and ask why each condition was possible.
7. **Record what went well** and what was lucky.
8. **Write actions,** preferring strong ones, each with an owner and date, as tracker issues.
9. **Write the gate** and its due date.
10. **Share** the review, and check after the due date that the gate works.

## 4. Worked example: TrailMug

Maya runs the review for the Friday checkout incident. She asks an agent to draft the timeline from the incident channel export, the deployment history and the alert times, listing a source for each line, and not to interpret.

The draft looks tidy. She checks each line against its source and finds one error: it says "switch turned off at 19:02" but the tool shows 18:59; 19:02 was when the journey check passed again. The three-minute difference changes the story: the switch worked quickly, and the delay was the check's own interval. She corrects it and notes the discrepancy.

The agent's first draft of causes read: "Cause: developer error in tax rounding code." She stops at those words and asks the group the four questions. The chain they write:

1. A change to tax rounding was released.
2. Tests covered the default region only, so the failing region was not tried.
3. The reviewer was shown the diff but not the list of regions affected.
4. The change was released behind a switch (good), but the switch was not tied to an alert, so a person had to notice.
5. The journey check ran every five minutes (a detail from lesson 1), so it took until 18:51 to fail.

What went well: the objective-tied alert fired, the switch existed, the roles were clear, and the update went out within twenty minutes. They record that they got lucky: it happened outside the busiest hour.

Actions:

- **Strong:** a pipeline gate that fails any payment merge request unless tests cover every region in the catalogue. Owner Ravi. Due 14 November.
- **Medium:** the journey check runs every minute for checkout. Owner: platform. Due next week.
- **Medium:** the switch gets a burn rate alert that prompts turning it off. Owner Maya's team.
- **Weak, not enough alone:** "remind reviewers to ask which regions are affected". They turn it into a template field in the merge request, which makes it a medium action.

After the due date Maya asks an agent to check the gate, then tries it herself: she opens a test merge request that changes the payment code without a region test. The pipeline fails as intended. She records the date and her name next to the gate. She also adds the review to the incident record and shares a short customer note, approved by support.

## 5. Working with AI agents on this

**What the PDM decides:** which incidents get reviews, the ground rules, the actions, and what is shared externally.

**Delegate:** assembling the timeline from exports with sources, drafting sections, searching similar incidents, checking actions for owners and dates, tracking overdue actions.

**Verify:** each timeline line against its source; each cause for hidden blame; that each action is strong enough; that the gate exists and fails when it should, after the due date.

**Never delegate:** deciding what mattered most, the tone of a conversation with the people involved, what is told to customers.

**Prompt to draft a timeline:**

```text
From these exports (channel, deployment history, alert log), draft a timeline of the
incident. One line per event: time with time zone, what happened, and the source
file and line. Do not interpret causes and do not use words that assign blame. Mark
any time that differs between sources. List what you could not establish.
<attach exports>
```

**Prompt to check a draft review:**

```text
Review this incident review. Point out: any sentence that assigns blame to a person,
any cause that stops at "human error", any action without an owner and date, any
action that relies on people remembering, and whether a gate is named with a due
date. Do not rewrite the review. Quote the sentences.
<paste review>
```

**Disclose** AI drafting in the review, and note which parts a person checked.

## 6. Common mistakes and how to avoid them

- **Asking who, not how.** Fix: four questions about information and system.
- **Stopping at "human error".** Fix: that is where analysis starts.
- **A single root cause.** Fix: a chain of conditions.
- **Only weak actions.** Fix: ask if a new person or an agent would still be protected.
- **No gate.** Fix: one named gate with a due date.
- **Believing a smooth timeline.** Fix: check each line against its source.
- **No follow-up.** Fix: tracker issues, a weekly look, and test the gate.
- **Blame language copied from the record.** Fix: edit it out and check with a reading.

## 7. Practice

**Deliverable in git:** `specs/obs-04.md`, `briefs/obs-04.md`, `reviews/obs-04.md`, and `docs/incident-review-template.md`.

1. Use your invented incident from lesson 3, or a real, past one.
2. Write `docs/incident-review-template.md` with the sections in this lesson.
3. Write a spec for an agent to draft the timeline, with at least six acceptance criteria, including "each line cites a source" and "no blame language".
4. Brief an agent using the first prompt in section 5, and check the timeline line by line against the sources. Record each correction in `reviews/obs-04.md`.
5. Write the causes yourself as a chain. Compare with an agent's version.
6. Write three actions of different strengths and the gate with an owner and date.
7. Open a merge request with the review, a disclosure block and the tracker issues for the actions.

## 8. Checklist

- [ ] The review is blameless and still names owners for actions.
- [ ] The timeline lines each cite a source and were checked.
- [ ] Causes are a chain, not "human error".
- [ ] What went well is recorded.
- [ ] At least one action is strong, and a gate has an owner and due date.
- [ ] Actions are tracker issues I look at weekly.
- [ ] I tried the gate after the due date and it works.
- [ ] Shared versions contain no personal data or secrets.

## 9. Further learning

Read the Google chapter on postmortem culture, then use the Atlassian guide's example as a template for your own. Look at the incident features in your platform. Lesson 5 puts services, requests and changes in one lightweight practice.
