---
title: "Sensei handbook 1: the role and its limits"
description: "What a Sensei does, what a Sensei never does, and what to look for when you coach a future Product Development Manager."
section: "Sensei handbook"
order: 1
level: core
duration: "20 min"
outcomes:
  - "Say in two sentences what a Sensei does for a learner."
  - "List what a Sensei never does, and what to say when a learner asks for it anyway."
  - "Use the four questions to look at a learner's work as a coach."
resources:
  - google/rework-coach-using-the-grow-model
  - gitlab/handbook-building-trust
prerequisites:
  - the-2030-product-development-manager
  - product-package-rubric
updated: 2026-11-03
---

## Why this matters

A Sensei is a coach. You help a builder see their own work more clearly and decide what to do next. You do not do the work for them, and you do not decide their future.

This handbook is for a new Sensei. It is seven short pages. If you read them in order, you can run your first review with nothing else. The [Sensei page](/sensei) explains how Senseis earn points and how to apply. This handbook explains the craft.

| Page | Use it when |
| --- | --- |
| 1. Role and limits (this page) | You are starting, or a learner asks for something you should not give |
| 2. [Run a 30 minute review](/library/sensei-run-a-30-minute-review) | You have a review booked |
| 3. [Feedback sentences that work](/library/sensei-feedback-sentences) | You are about to say something hard |
| 4. [Run a live build safely](/library/sensei-run-a-live-build-safely) | You host a live session |
| 5. [Privacy and the code of conduct](/library/sensei-privacy-and-conduct) | You hold a learner's work or a learner's trust |
| 6. [When to ask the Maintainer](/library/sensei-when-to-ask-the-maintainer) | You are unsure, or something went wrong |
| 7. [Review sheet](/library/sensei-review-sheet) | You want one page to print and write on |

## Key ideas

### What a Sensei does

- **Coaches builders.** You ask questions, point at evidence and help the learner choose the next step.
- **Reviews work.** You read what the learner made and compare it with the written rubric. You say what you see.
- **Hosts live builds.** You build in the open and explain your choices out loud. Page 4 covers this.
- **Keeps the standard.** The same rubric is used for everyone. That is what makes the review fair.

### What a Sensei never does

| Never | Say this instead |
| --- | --- |
| **Grade beyond the rubric.** No private pass marks, no extra criteria, no half levels. | "The rubric asks for X. Here is where I saw it, and here is where I did not." |
| **Promise a job, a salary or a client.** | "I can tell you what I saw in your work. I cannot tell you what an employer will do." |
| **Promise a certificate.** A Sensei gives a review. The Dojo team decides about certificates. | "My review is one input. I cannot promise the result." |
| **Promise or discuss rewards.** Rewards for tiers are being finalised. Nothing is promised until they are announced. | "The Sensei page shows points and tiers. Rewards are not decided yet." |
| **Write the learner's epics or roadmap.** People write epics and roadmaps ([Rule 1](/library/people-write-epics)). | "Tell me the problem in your own words, and I will tell you where it is unclear." |
| **Do the learner's work with an agent and hand it back.** | "Show me your brief. What did the agent do, and how did you check it?" |
| **Say the Dojo is accredited.** It is not. CRC's 501(c)(3) application is pending. | "The Dojo is a free training academy. It has no outside accreditation." |
| **Share a learner's work, scores or story** without the learner's clear yes. | See [page 5](/library/sensei-privacy-and-conduct). |
| **Give visa, work permit or immigration advice.** | "I cannot advise on that. Please ask a qualified professional." |

If a learner pushes, stay kind and stay firm. Then tell the Maintainer if it keeps happening ([page 6](/library/sensei-when-to-ask-the-maintainer)).

### What you are coaching towards

The Dojo does not train people to type code. It trains the **2030 Product Development Manager**: a person who decides what to build, directs AI agents that do the lower-level work, checks the result and answers for it. Read [who that person is](/library/the-2030-product-development-manager) before your first review.

Every review you run is really testing one thing: **is this learner becoming that person?**

## The 2030 Product Development Manager lens

Use these four questions when you look at any piece of a learner's work. They are the same questions the whole site uses.

1. **What did the learner decide?** What to build, for whom, why, and what "good enough" means. If you cannot find a decision, the learner may have followed an agent's suggestion.
2. **What did they delegate, and with what brief?** From the Developer path week 4 on, learners hand tasks to agents. Ask to see the written brief. A good brief names the goal, the limits, the acceptance criteria and what the agent must not do.
3. **How did they verify what came back?** Look for evidence: a diff they read, a test they ran, a person they talked to. "It looked fine" is not verification.
4. **Which other disciplines did they bring in?** Design, brand, money, operations, security, engineering. A plan with only one discipline has gaps.

### Where the learner is on the ladder

Skill with agents has four rungs: **use** one agent step by step, **delegate** a whole task with a written brief, **orchestrate** several agent sessions at once, and **govern** the work with written policy and gates so it stays safe without watching every step. Most Developer path learners work at **use** and early **delegate**. Do not push someone up a rung before they can verify at the rung they are on.

## A first-week routine

1. Read pages 1 to 6 and print page 7.
2. Read the [Product Package standard](/library/product-package-standard) and the [Product Package rubric](/library/product-package-rubric).
3. Read the [weekly checklist for Track A](/library/weekly-checklist-track-a), the one your learners follow.
4. Read the [code of conduct](/code-of-conduct) and the page on [disclosing AI use](/library/disclose-ai-use).
5. Do one practice review on a made-up example before you meet a real learner (see the practice below).

## Common mistakes

- **Fixing instead of coaching.** If you write the sentence, it is your sentence. Ask a question instead.
- **Being the judge of everything.** You judge against the rubric only. Opinions go in a different box: label them as opinions.
- **Promising to be kind by promising results.** Kindness is clear, specific feedback. It is not a good score.
- **Speaking fast or with idioms.** Many learners read and listen in a second language. Short sentences, plain words, a written summary afterwards.
- **Keeping a worry to yourself.** If something feels wrong, ask. Page 6 lists when.

## Practice

Take the TrailMug example (reusable cups for cafes; an example product, not a real one). Open the [TrailMug catalogue example](/library/catalogue-trailmug-full-example) and pretend it is part of a learner's repository. Write down, in your own words, one answer to each of the four questions. Keep the notes for yourself. They are your warm-up for the first real review.

## Checklist

- [ ] I can say what a Sensei does and never does.
- [ ] I know the CRC and accreditation wording: the Dojo is not accredited, and CRC's 501(c)(3) application is pending.
- [ ] I will not promise jobs, pay, certificates or rewards.
- [ ] I read the Product Package rubric and the weekly checklist.
- [ ] I know the four questions and the four rungs of the ladder.
