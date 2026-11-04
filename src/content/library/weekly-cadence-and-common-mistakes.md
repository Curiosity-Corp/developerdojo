---
title: "Weekly cadence and common mistakes"
description: "A simple weekly rhythm for an epic manager, and the mistakes to avoid."
section: "Developer path"
order: 9
level: foundation
duration: "30 min"
outcomes:
  - "Run a three-to-four-hour weekly cadence."
  - "Run the 20-minute weekly sweep."
  - "Spot the twelve common mistakes."
  - "Recognise an AI-written epic."
resources:
  - atlassian/agile-standups
  - atlassian/agile-retrospectives
  - atlassian/backlog-refinement
  - atlassian/definition-of-done
  - gitlab/issue-boards
prerequisites:
  - week-3-problems-to-epics
---

## The weekly cadence

Each day has one job. The total is about three to four hours.

| Day | Job | Time | Output |
|---|---|---|---|
| Monday | Read the roadmap and the blocked list. Set three goals for the week. | 45 min | Three goals, written as outcomes |
| Tuesday | Unblock builders. Answer open questions. | 60 min | Every question has an answer or an owner |
| Wednesday | Review milestone progress and links between parts. | 45 min | Broken links fixed, late work flagged |
| Thursday | Talk to one user, or read your numbers. | 30 to 60 min | One new fact about the user |
| Friday | Update the roadmap and risks. Write the [weekly note](/library/template-weekly-note). | 45 min | Weekly note sent |

- Tuesday: write big decisions in the decision log (date, question, answer, reason).
- Friday: move dates if the truth changed. Do not hide delay.

## Weekly sweep (20 minutes)

1. Check every item marked in progress. Is there recent activity?
2. Find **stale epics**: no change in 14 days. Continue, pause or close.
3. Find **orphan issues**: no epic. Attach or close.
4. Fix any bar whose due date has passed.
5. Check every blocked item. Who must act?
6. Add a short comment to the top epic: done, next, risk.

Rules: no issue without an epic. No epic without an owner, a goal and dates. Close epics when done.

## Monthly review (60 to 90 minutes)

Read the top epic again from the start. Is the user still right? Do the numbers still make sense? Which epic slipped and why? What should we stop building?

## Common mistakes

| # | Mistake | Symptom | Fix |
|---|---|---|---|
| 1 | "My AI wrote my epic" | Looks professional. Nobody can say why it exists. | Write the five core lines yourself: user, outcome, number, repos, order. |
| 2 | Epic too big | One epic runs for a year | Split into epics that end in 2 to 6 weeks |
| 3 | Epic is a to-do list | "Build the form, set up the API" | Write what the user can do after it ships. Tasks go in issues. |
| 4 | Missing parts | At launch: "We forgot the privacy policy" | Walk every journey step. Always add policy, help, status, analytics, support. |
| 5 | No owner for operations | Policies are old. Nobody answers when it fails. | Name a human owner |
| 6 | Epics never updated | Roadmap is green and the team knows it is late | Update on Friday. A true red bar is useful. |
| 7 | Issue dumping | 200 issues with no epic | Every issue links to an epic or is closed |
| 8 | No acceptance criteria | Agent says done. You say "not what I meant". | Write testable lines with numbers. Approve before work starts. |
| 9 | Scope creep through AI suggestions | The release grows by a week | Keep an out-of-scope line. Ask: which user needs this? |
| 10 | Wrong level | An epic says "fix the button colour" | Issue: one task. Milestone: one slice. Epic: a whole-product outcome. |
| 11 | No user in the epic | "Improve reliability", for whom? | Start with "Who:" and use a persona name |
| 12 | Ignored blocked links | Payments waits for login for two weeks | Set blocks links. Review blocked items twice a week. |

### How to spot an AI-written epic

- It is generic. Swap the product name and it still reads true.
- It has no numbers.
- It says "users" or "stakeholders", not a person.
- It lists no repos and no order.
- Nobody can explain it.

## Key points

- Same week, every week: read, unblock, review, talk to a user, update, write.
- Most mistakes come from no user, no number, no order or no owner.
- Score yourself honestly each month.

## How the cadence meets your Sensei

Your weekly checkpoint with your Sensei is the Friday review made spoken. Bring the weekly note and the score sheet. A good checkpoint answers three questions: what changed, what is blocked, and what do you not yet understand. See [how your Sensei works with you](/library/program-how-sensei-work) and [how you are assessed](/library/program-assessment-and-pass-level).

## Show it in git

The cadence leaves marks in git: a weekly note on Friday, a changed roadmap when the truth changed, a comment on the top epic, and issues attached to epics. If the history is empty from Monday to Thursday, the cadence did not happen. See [your files and git](/library/program-your-work-in-git).

## Working with AI agents

- **May:** find stale epics and orphan issues in a list you export, draft a comment from facts you give it, check dates.
- **May not:** decide to close an epic, change a due date, or write the weekly note for you.
- **A safe brief:** "List every issue in this export with no epic. Give the title and link. Do not close anything."

## The 2030 Product Development Manager lens

- **You decide:** what to continue, pause or close.
- **You delegate to agents:** the weekly sweep lists and date checks.
- **A sample brief:** "List epics with no change in 14 days. Report title, owner and last change date only."
- **You verify by:** opening two flagged epics and checking them yourself.
- **Disciplines involved:** product, operations, delivery and communication.
- **On the agent ladder:** the cadence is **use** and **delegate** every week, and **govern** on Friday.
