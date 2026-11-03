---
title: "Deck 15: ITIL practices in git, change types and incidents"
description: "How the merge request becomes the change record, the three change types, the incident loop with a named commander, and the blameless review."
section: "Teaching deck"
order: 15
level: advanced
duration: "120 min"
outcomes:
  - "Map six ITIL practices to what they look like in git and say which are Built, Partial or Planned."
  - "Classify a change as standard, normal or emergency and label it."
  - "Explain the rule: we fix forward and never revert, and the single exception."
  - "Run an incident with a named commander and write a blameless review with five whys."
resources:
  - atlassian/change-management
  - atlassian/incident-management
  - atlassian/blameless-postmortem
  - google-sre/embracing-risk
  - google-sre/service-level-objectives
  - google-sre/managing-incidents
  - google-sre/postmortem-culture
  - gitlab/codeowners
prerequisites:
  - deck-14-gitops-iac-and-drift
  - itil-in-git
  - fix-forward
---

This lesson covers slides 31 and 32, which are Track B chapter 13. Slide 31 maps ITIL practices to git. Slide 32 shows the three change types, the fix-forward rule and the incident loop. ITIL is a framework of IT service management practices. The program takes the ideas, **not the paperwork**.

## Why it matters

Large organisations need to show that changes were reviewed, that incidents were handled calmly, and that lessons were learned. They do this with forms, calendars and meetings. A small, fast team can leave better evidence with less effort if the evidence is made by the normal work: the merge request is the change record. This is the skill that lets a product team talk to a bank, a hospital or an auditor with confidence.

## Key ideas

### ITIL practices in git (slide 31)

For each practice, ask: **where does this live in git, and what evidence does it leave?**

| ITIL 4 practice | How we do it in git | Status |
|---|---|---|
| Change enablement | The merge request holds the reason, the diff, the review, the pipeline and the merge time. A change template adds the risk line. | Partial |
| Change advisory board | CODEOWNERS plus approval rules. No meeting for normal work. | Rules exist |
| Service catalogue and configuration | Catalogue files in git. The map is the view; git is the source. | Partial |
| Release | Pipeline, image digests, GitOps sync history. | Built for apps |
| Incident and problem | Issues with labels, a named commander, a blameless review. | Not one tool |
| Service levels | SLI, SLO and a service level target sheet, with an error budget. | Proposal (Planned) |

Words: an **SLI** (service level indicator) is a measured number, such as the share of requests that succeed. An **SLO** (service level objective) is the target for that number. An **error budget** is how much failure the SLO allows. A **CODEOWNERS** file names who must review changes to which files.

### Change types (slide 32)

| Type | Meaning | Example | Label | Review |
|---|---|---|---|---|
| **Standard** | Low risk, repeated, pre-approved | A patch-level dependency bump from the update bot | `change::standard` | Owner reviews the diff |
| **Normal** | Needs a human risk decision | A new feature or a database migration | `change::normal` | CODEOWNERS review |
| **Emergency** | **Only to stop active harm** | Leaked secret, data loss, outage | `change::emergency` | Review within 48 hours |

The facilitator note adds: "the deadline is today" is **not** an emergency. An emergency is only for active harm: a leaked secret, data loss in progress, or a customer-facing outage.

### We fix forward and never revert

The slide says it in four words: **we fix forward. We never revert.** In practice:

1. **Stop harm with a flag** (for example, switch a feature off).
2. **Land a forward fix** that puts the feature back, correctly.
3. **Run incidents with a named human commander.**
4. **Write a blameless review** with five whys, and **add the gate** that would have caught it.

The single exception, as in the standards: only active harm justifies taking something back out. Even then, the follow-up is the forward fix that puts the feature back.

### Blameless review and five whys

A **blameless review** looks at what happened and why the system allowed it. **Five whys** is a way to dig: ask why, five times. The chain must end at **a process or design cause, never a person.**

Example chain: the site went down. Why? A change broke the sign-in page. Why? The change was not tested with real data. Why? The test data is too small. Why? Nobody owns the test data. Why? The checklist has no line for it. The fix: add an owner and a checklist line, and a gate that fails when test data is below a size.

## A worked example: TrailMug

On a Monday, a TrailMug merge request changes the deposit amount from 3 to 5 in the returns service. It is a **normal** change: a human risk decision. The CODEOWNERS file names the finance lead (placeholder) for the deposit file. The finance lead reviews and approves. The merge request holds the reason, the diff, the pipeline result and the merge time. That is the change record.

On Thursday, a **standard** change arrives: the update bot proposes a patch-level bump of a library. The owner reads the diff and approves in two minutes. It carries the label `change::standard`.

On Friday at 17:00 the notification email starts sending the same message to every commuter, in a loop. This is customer-facing harm: an **emergency**.

1. **Commander.** The engineering lead (placeholder) says in the incident issue: "I am the commander." A named human is in charge.
2. **Stop harm.** The commander turns off the notification feature with a flag. This takes one minute and uses an emergency merge request labelled `change::emergency`.
3. **Forward fix.** An agent drafts a fix. A human reviews it. After merge, the flag is turned on again. Nothing is reverted.
4. **Review.** Within 48 hours, the commander writes a blameless review with five whys. Cause: the loop guard was missing. Why missing? The template for new notifications has no guard. Fix: add the guard to the template, and a test that fails when a message could be sent twice to the same person in an hour.
5. **Emergency review.** Another human reviews the emergency merge request within 48 hours.

## The 2030 Product Development Manager lens

- **You decide:** the change type, whether something is an emergency, who is commander, whether to stop harm with a flag, and which gate to add after.
- **You delegate to agents:** drafting merge request text, classifying a dependency bump as standard from its diff, preparing the forward fix, collecting the timeline from logs and messages for the review.
- **The brief you would write:** "Here are the incident messages and the deploy log. Build a timeline: time, event, source. Do not assign blame or give causes. List what is unknown."
- **You verify by:** reading the timeline against your own memory, challenging each "why" in the five-whys chain, and checking that the added gate really would have failed on the original change.
- **Disciplines involved:** service management (change and incident), engineering (flags and fixes), operations (monitoring), legal and compliance (evidence for auditors), communication (telling customers honestly), leadership (commander role).
- **On the agent ladder:** **govern**: CODEOWNERS, approval rules and change labels are policy and gates. In an incident, a named human commander directs the sessions. An agent is never the commander.

## Working with AI agents

- **Allowed:** an agent can label changes that clearly fit the standard rules, draft change descriptions with the risk line, gather timelines, and propose forward fixes.
- **Not allowed:** an agent does not decide that something is an emergency, does not approve a change, and is never the incident commander.
- **For the blameless review:** an agent may format the review. The causes and the gate come from people.
- **Honesty:** if an agent caused the incident, say so plainly. Blameless does not mean cause-free. It means the chain ends in how the system let it happen.

## Common mistakes

1. **Calling a deadline an emergency.** It is not active harm.
2. **Reverting to make it go away.** We fix forward.
3. **No named commander.** Everyone assumes someone else is in charge.
4. **A review that ends in a person's name.** Keep asking why until you reach a process or design cause.
5. **No gate after the review.** The same incident returns.
6. **Meetings instead of rules.** CODEOWNERS plus approval rules replace the meeting for normal work.
7. **Treating Planned as Built.** Service level targets are a proposal today.

## Practice

1. Pick three changes from a project you know. Classify each as standard, normal or emergency. Write the reason.
2. Draft a `CODEOWNERS` file for a small repository: three paths, three owners (placeholders).
3. Write a one-page incident rehearsal: a failure, a commander, a stop-harm step, a forward fix, a review with five whys, and a gate.
4. For each ITIL practice on slide 31, write the file or setting that would be the evidence.
5. Read one chapter of the SRE material in the resources and write three sentences about error budgets.

## Checklist

- [ ] I can map each ITIL practice to a place in git and its status.
- [ ] I can classify a change and apply the right label.
- [ ] I know that only active harm is an emergency.
- [ ] I fix forward and never revert.
- [ ] My incident has a named commander and a blameless review with five whys that ends at a process cause.
- [ ] I added the gate that would have caught it.

## For facilitators (speaker notes)

- **Slide 31.** ITIL is a framework of practices. We take the ideas, not the paperwork. For each one we ask: where does this live in git, and what evidence does it leave? The change advisory board is CODEOWNERS plus approval rules. Service level targets are a proposal today (Planned).
- **Slide 32.** Standard, normal and emergency map to labels and to the change template. An emergency is only to stop active harm: leaked secret, data loss in progress, customer-facing outage. "The deadline is today" is not an emergency. We fix forward and never revert. Blameless review: five whys end at a process or design cause, never a person.

## Where to go next

Continue with [Deck 16: The capstone, the gates and certification](/library/deck-16-capstone-gates-and-certification). The longer page is [ITIL in git](/library/itil-in-git), and the form for this lesson is the [change record template](/library/template-change-record).
