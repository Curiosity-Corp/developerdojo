---
title: "Track B gates, exams and critical behaviours"
description: "The four gates, the final exam, the oral review, pass marks and the five critical behaviours, explained with examples."
section: "Assessment"
order: 2
level: advanced
duration: "60 min"
outcomes:
  - "State what each of the four gates checks, its practical task, its length and its pass mark."
  - "Explain the rule that a gate needs both a written test and an observed practical."
  - "Recite the five critical behaviours and say what a zero on any one means."
  - "Plan your gate dates in order."
resources:
  - dora/dora
  - google-sre/postmortem-culture
  - opengitops/principles
  - adr/adr-github-io
  - atlassian/change-management
  - owasp/secrets-management
prerequisites:
  - rubric-track-a-self-assessment
  - master-developer-assessment
---

Track B is the platform half of the Master Developer program. It ends in four gates, a final mixed exam, an oral review and the capstone. This page explains how the gates work, what each one checks, and the five behaviours that can fail a practical at once.

The same rule holds for the whole program: **people write epics; AI never does.** No AI may take a written test. In a practical, AI may be used only where the task says so.

## Why it matters

The gates make sure you learn in the right order: you understand the platform before you choose tools, you choose tools before you run them, and you run them before you manage change and incidents. They also give you and your mentor clear evidence, kept as records in a private git repository.

## How a gate works

> Pass the gates in order. A gate is passed only when the written test **and** the observed practical are both passed.

| Part | Pass mark |
|---|---|
| Written test | 20 of 25 |
| Practical | 80 percent of the rubric, and no critical failure |

If you pass the written test and fail the practical, the gate is not passed. If you pass the practical and fail the written test, the gate is not passed. You retake only the part you failed, after a short coaching plan.

## The gates

| Gate | What it checks | Written | Practical | Length |
|---|---|---|---|---|
| **1 Platform literacy** | Chapter 9, and the line between human and AI work from chapter 1 | 20 of 25 | **Task 1:** trace a change, no AI | 40 min |
| **2 OSS-first and licences** | Chapters 10 and 11 | 20 of 25 | **Task 2:** licence check and ADR | 60 min |
| **3 GitOps, IaC and drift** | Chapter 12 | 20 of 25 | **Task 3:** close a drift | 45 min |
| **4 ITIL and catalogue** | Chapter 13, and the role map of chapter 9 | 20 of 25 | **Task 4:** a change and an incident | 60 min |
| **Final mixed exam** | Chapters 1 to 13 | pass 34 of 40 | none | |
| **Oral review** | Doctrine and judgment | pass 18 of 24, with at least 2 on each doctrine question | none | |

An **ADR** is an architecture decision record. **Doctrine** here means the rules of the program: people write epics, git is the source of truth, open source first, fix forward.

### What each practical looks like

**Gate 1, Task 1: trace a change (40 minutes, no AI).** You are given a small change and asked to follow it through the platform from the merge request to the running, mapped service. You name each step, say which are done by people and which by machines, and mark each Built, Partial or Planned. TrailMug example: "A change to the deposit amount. Show where it is reviewed, which checks run, how the image reaches production and where the catalogue shows it."

**Gate 2, Task 2: licence check and ADR (60 minutes).** You are given two or three candidate tools and asked to read the licence files, compute fit, choose a rung and write a short ADR with the licence-check record. TrailMug example: three email senders, one with a network copyleft licence. The right answer notices the licence trap even if that tool scores highest on fit.

**Gate 3, Task 3: close a drift (45 minutes).** You are shown a difference between git and a live system. You must **read the diff first and change nothing**, decide which side is right, write the forward fix, and add a gate that catches it next time.

**Gate 4, Task 4: a change and an incident (60 minutes).** You write a complete change record with a human risk decision, then handle a rehearsal incident with a named commander: stop the harm with a flag, land a forward fix, and outline a blameless review with five whys.

### Timing

The weekly checklist gives the order for a full-time pace:

| When | Gate |
|---|---|
| End of Track B week 1 | Gate 1 |
| Early in Track B week 3, after chapter 11 | Gate 2 |
| End of Track B week 3 | Gate 3 |
| End of Track B week 4 | Gate 4 |
| After the gates | Final mixed exam, oral review, capstone |

Gate 2 covers chapters 10 and 11, so you sit it **early in week 3**, after you have read chapter 11.

## The five critical behaviours

A zero on any one of these fails the practical **at once**, whatever the score elsewhere.

| Code | Behaviour | What it means in plain words |
|---|---|---|
| **B1** | No plaintext secrets: names only | A password, key or token never appears in git, in a message, in a screenshot. Only the name of the secret appears. |
| **B2** | No `kubectl apply`, `patch` or `create` | You may only look (`get`, `describe`, `logs`, `diff`). Changes go through a merge request. |
| **B3** | Fix forward, not revert | When something breaks, you fix it with a new change. You do not roll back shipped work. |
| **B4** | Licence checked before adoption | You read the licence file before you decide to use a tool. |
| **B5** | The merge request is the change record | The reason, diff, review and pipeline are in the merge request. You do not make a separate paper record that disagrees with it. |

Examples of a zero:

- **B1.** In Task 3 you paste a database password into the incident issue to "make it easier to reproduce". Zero on B1. The practical fails.
- **B2.** In Task 3 you run a command that changes a live setting directly. Zero on B2.
- **B3.** In Task 4 your first move in the incident is to revert the last merge. Zero on B3. The right move is a flag, then a forward fix.
- **B4.** In Task 2 you write the ADR before opening the licence file. Zero on B4.
- **B5.** In Task 4 you write the change record in a separate document and the merge request says only "fix". Zero on B5.

## Honesty and AI

- **Written tests:** no AI at all.
- **Practicals:** AI only where the task marks it. Task 1 says "no AI".
- **Epics:** by hand, always.
- **Records:** your results are stored as records in a private git repository. The program lead merges the result record.
- **Integrity:** an open integrity breach stops the certification until it is dealt with.

## The 2030 Product Development Manager lens

- **You decide:** when you are ready to sit a gate, which behaviours you must never break, and how you will show the evidence.
- **You delegate to agents** (outside the assessments): building study drills, quizzing you with questions drawn from the chapters, reviewing your practice ADRs for missing sections.
- **The brief you would write for study:** "Ask me one gate-style question at a time on chapter 12. Wait for my answer. Then tell me which part of the answer was wrong, citing the chapter section. Do not give the answer first."
- **You verify by:** checking every correction against the chapter text, not trusting the agent's memory.
- **Disciplines involved:** security (B1, B2), legal (B4), service management (B5), operations (B2, B3), leadership (the oral review).
- **On the agent ladder:** the gates test **govern**: the critical behaviours are written policy that no schedule excuses. Agents work inside that policy.

## Common mistakes

1. **Sitting a gate out of order.** The gates assume the earlier ones.
2. **Studying only the written test.** The practical needs hands-on practice.
3. **Treating the critical behaviours as tips.** A zero ends the practical.
4. **Using AI in Task 1.** It is marked no AI.
5. **Writing the ADR after the choice.** B4 and good practice both say read the licence first.
6. **Believing a high score cancels a critical failure.** It does not.

## Practice

1. Write the five critical behaviours from memory on a card, with one example of breaking each.
2. For each task, write the first three steps you would take in the first five minutes.
3. Plan your four gate dates in order, with a week of study before each.
4. Practise Task 3 on a small repository: change a live setting in a test environment by hand, then handle the drift without touching it again.

## Checklist

- [ ] I know both parts of a gate must be passed.
- [ ] I know the pass marks: 20 of 25 written, 80 percent practical, 34 of 40 exam, 18 of 24 oral.
- [ ] I know the five critical behaviours by heart.
- [ ] I know no AI takes a written test.
- [ ] I have my gate dates in order.

## Where to go next

Read the [capstone rubric and the ten mandatory items](/library/rubric-capstone), the [Track B weekly checklist](/library/weekly-checklist-track-b-and-capstone), and the [Master Developer assessment overview](/library/master-developer-assessment).
