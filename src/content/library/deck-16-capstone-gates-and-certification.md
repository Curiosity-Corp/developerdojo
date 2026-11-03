---
title: "Deck 16: The capstone, the gates and certification"
description: "The five-day capstone, how it is graded, the four gates, the exam and oral review, the critical behaviours and the badge that is renewed every 12 months."
section: "Teaching deck"
order: 16
level: advanced
duration: "90 min"
outcomes:
  - "Describe the five capstone days and what each day ends with."
  - "State the grading weights, the pass mark and the mandatory-items rule."
  - "Name the four gates, the exam, the oral review and the badge, and the pass marks."
  - "List the five critical behaviours and say what happens if you fail one."
resources:
  - dora/dora
  - gitlab/merge-requests
  - google-sre/postmortem-culture
  - adr/adr-github-io
  - opengitops/principles
  - atlassian/change-management
prerequisites:
  - deck-15-itil-in-git-change-and-incident
  - master-developer-assessment
---

This lesson covers slides 33 and 34, which are Track B chapters 14, 15 and 16. Slide 33 shows the **capstone**: one product, five skills, five days. Slide 34 shows the **assessment gates and certification**. The lesson is also the end of the teaching deck, so it closes with a short summary of the whole series.

## Why it matters

The capstone is where the pieces become one piece of work. It is the evidence that you can do the whole job in a short time with the rules intact. The gates make sure you learned in the right order: people first, then the platform, then the practices that keep a product honest.

## Key ideas

### The capstone (slide 33)

The capstone is **one product, five skills, five days**. Plan **6 focused hours a day, 30 in total.**

| Day | Work | Ends with |
|---|---|---|
| **Day 1** | Epic by hand, open source selection | An ADR numbered 0001 |
| **Day 2** | Patch-fork with an update bot and a registry | A green pipeline |
| **Day 3** | Kustomize, GitOps controller, Terraform, a drift plan | The service **Synced and Healthy** |
| **Day 4** | Catalogue entries, a change record, a service level sheet | Entries that validate |
| **Day 5** | Incident rehearsal, review, self-grade | A grade |

Rules of the capstone:

- **Starter kit:** the program provides a starter kit in its git project. Copy it into your own **private** capstone repository.
- **Grading:** open source selection 20, patch-fork 20, infrastructure as code and GitOps 20, catalogue 15, ITIL 15, epic by hand 10. That adds to 100 points.
- **Pass:** 70 of 100 points **and** all ten mandatory items. Less means "not yet": fix forward and ask for a second review.
- **A mentor acts as the change advisory board** and signs five checkpoints.
- **Default product:** a labelled generic example, as in every chapter. You may choose your own.
- **Planned features** are simulated in the template and marked "simulated", never claimed as running.

### Assessment gates and certification (slide 34)

You pass the gates **in order**. A gate needs **both** the written test and the observed practical.

| Step | Topic | Practical task |
|---|---|---|
| **Gate 1** | Platform literacy (chapter 9) | Task 1: trace a change |
| **Gate 2** | Open source first and licences (chapters 10 and 11) | Task 2: licence and ADR |
| **Gate 3** | GitOps, IaC and drift (chapter 12) | Task 3: close a drift |
| **Gate 4** | ITIL and the catalogue (chapter 13) | Task 4: change and incident |
| **Final exam** | 40 questions | Pass at 34 |
| **Oral review** | 12 questions | Pass at 18 of 24 |
| **Capstone** | 70 points and all 10 mandatory items | |
| **Master Developer** | The badge | Renew every 12 months |

More pass marks from the slide: the **written** gate test needs 20 of 25. The **practical** needs 80 percent of the rubric **and no critical failure**.

### The five critical behaviours

A zero on any critical behaviour **fails the practical at once**:

1. **No plaintext secrets.**
2. **No `kubectl apply`.** (Changes go through git.)
3. **Fix forward.**
4. **Licence checked first.**
5. **The merge request is the change record.**

These match the rules that never bend in lesson 14 and the practice in lessons 12 and 15.

### Honesty and AI in the assessments

- **No AI may take a written test** or write your epics.
- **AI in a practical** only where the task marks it.
- Results are records in a **private** git repository.
- The files in git win over any slide. If a slide is out of date, open a merge request.
- This site does not claim any outside accreditation for the program, and the badge is the program's own.

## A worked example: TrailMug

A learner chooses TrailMug as the capstone product. Here are her five days.

**Day 1.** She writes one epic by hand ("A commuter can return a cup at any partner café"). She searches for an email sender, scores three candidates by hand (lesson 12), and ends with `docs/adr/0001-email-sender.md`, a decision with her name on it.

**Day 2.** She sets up the patch-fork with two patches and a ledger. The update bot opens a merge request. The pipeline is green. She merges it herself, because a human merges.

**Day 3.** She builds Kustomize overlays for staging and production, writes a small Terraform plan for a storage bucket, and sees the service **Synced and Healthy** in the controller. She also writes a drift plan: which of the four layers would find a hand change, and who reads the result.

**Day 4.** She writes a catalogue entry for the returns service, a change record for the deposit change, and a service level sheet with one SLI and one SLO, marked "proposal". The entries validate.

**Day 5.** She rehearses an incident with a mentor, writes a blameless review with five whys, and grades herself against the rubric. She finds a mandatory item she skipped on Day 3 (an owner on the catalogue entry) and fixes it forward, then asks for a second review.

The mentor signs the five checkpoints. The total score is 76, and all ten mandatory items are met. Pass.

## The 2030 Product Development Manager lens

- **You decide:** the epic and its scope; which open source option; which risks you accept; how you grade yourself honestly; when you ask for a second review.
- **You delegate to agents** (only where each task allows): building the pieces, drafting records, running checks, formatting documents after you wrote the decisions.
- **The brief you would write:** "Here is the capstone rubric and my repository. Check every mandatory item: for each, say 'met' or 'not met', and cite the file and line. Do not fix anything. Do not score."
- **You verify by:** opening each cited file yourself, then writing your own grade first.
- **Disciplines involved:** all of them: strategy (epic), engineering (build), security (secrets and licences), operations (GitOps and drift), service management (change and incident), finance (the debt statement), communication (the review and the oral).

## Working with AI agents

- **Allowed by task:** the starter kit marks where agents may help. Follow it.
- **Never:** AI writing your epic, answering a written test, or answering the oral review.
- **A strong habit:** keep a one-line AI-use note per task, as in lesson 4.
- **Evidence:** keep your merge requests, ADRs and reviews in git. They are the record of your work.

## Common mistakes

1. **Starting the capstone before the gates.** The order exists for a reason.
2. **Reaching for a revert when something breaks.** The behaviour that fails the practical is not fixing forward.
3. **Claiming a Planned feature as running.** Mark it simulated.
4. **Missing a mandatory item and scoring on points alone.** You need all ten.
5. **Grading yourself on effort.** The rubric scores evidence.
6. **A plaintext secret in your capstone repository.** An instant critical failure.
7. **Treating "not yet" as failure.** Fix forward and ask for a second review.

## Practice

1. Write your own five-day capstone plan for a product you know, with the end-of-day product for each day.
2. Write the five critical behaviours on a card and keep it by your keyboard.
3. Take a past project. Which of the five critical behaviours would it have failed? What would you change?
4. Do the grading arithmetic: if you scored 18, 16, 14, 12, 10 and 8 on the six capstone areas, what is your total, and does it pass on points?
5. Practise the oral review: ask a partner to pick any slide of the deck and ask you a question. Answer without notes.

(Answer to practice 4: the weights are 20, 20, 20, 15, 15 and 10. The six scores given are example marks out of those maxima in order. 18 + 16 + 14 + 12 + 10 + 8 = 78, which is above 70. You still need all ten mandatory items.)

## Checklist

- [ ] I can say what each capstone day ends with.
- [ ] I know the weights, the pass mark and the mandatory-items rule.
- [ ] I can name the four gates, the exam, the oral review and the badge, with their pass marks.
- [ ] I know the five critical behaviours.
- [ ] I know no AI takes a written test or writes my epics.
- [ ] I know the badge is renewed every 12 months.

## For facilitators (speaker notes)

- **Slide 33.** Plan 6 focused hours a day, 30 in total. The default product is a labelled generic example, as in every chapter. You may choose your own. Planned features are simulated in the template and marked "simulated", never claimed as running.
- **Slide 34.** Pass the gates in order. A gate needs both the written test and the observed practical. Five behaviours are critical and a zero on any fails the practical at once. No AI may take a written test or write your epics. AI in a practical only where the task marks it. Results are records in a private git repository.

## The whole series in one page

| Lesson | Idea |
|---|---|
| 1 | The human owns the picture; agents build |
| 2 | Agents are strong at clear tasks and weak at judgment |
| 3 | Vision, epic, milestone, issue |
| 4 | No AI epics; what AI may do |
| 5 | Six layers and the repository map |
| 6 | Personas, touch points, journeys |
| 7 | Write an epic and test it |
| 8 | Epics and the roadmap in GitLab |
| 9 | Track A assessment and the path |
| 10 | The platform and the golden path |
| 11 | Build-or-adopt and the ITSM role map |
| 12 | The OSS ladder, licences, ADR |
| 13 | The patch-fork loop |
| 14 | GitOps, IaC, drift |
| 15 | ITIL in git, change, incident |
| 16 | Capstone, gates, badge |

The thesis again, as the deck ends: **the human owns the idea and the big picture. Agents build.**

## Where to go next

Return to [Deck 1](/library/deck-01-the-humans-job) for a second pass, or read the [Master Developer assessment](/library/master-developer-assessment) for the written design of the gates.
