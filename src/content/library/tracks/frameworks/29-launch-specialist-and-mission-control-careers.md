---
title: "Launch Specialist and Mission Control careers"
description: "What a Launch Specialist, a Command Engineer and a Deployment Team member do, which skills they use, how they work with AI agents, and how to build evidence of the skills in git."
section: "Frameworks"
order: 29
track: "frameworks"
level: "advanced"
duration: "50 min"
outcomes:
  - "Describe the Launch Specialist, Command Engineer and Deployment Team roles in plain words"
  - "Map each role to skills and Dojo tracks, and to common job titles in the wider industry"
  - "Run a client gap analysis and produce a launch plan that you can show in a portfolio"
resources:
  - "google/sre-book"
  - "google/sre-launch-coordination-checklist"
  - "atlassian/change-management"
  - "atlassian/incident-management"
  - "atlassian/product-owner"
  - "atlassian/raci-chart"
  - "dora/dora-research-program"
prerequisites:
  - "tracks/frameworks/28-mission-control-growth-and-event-horizon"
updated: 2026-11-03
---

**Dojo programme link:** this lesson supports the Master Developer path and the Sensei path (coaching others to launch). It supports the career side of Developer week 6, when you present the Product Package.

## 1. Why this matters

By now you have seen that a product needs three kinds of attention after it is built: getting it live safely, watching it, and helping a customer or team make use of it. In the framework texts these are done by named roles: the **Launch Specialist**, the **Command Engineer** in Mission Control, and the **Deployment Team**.

This lesson explains them in plain words and shows where they fit among job titles you may see in the wider world. It also gives you a practical way to build evidence of the skills. Where a person's value is proven by the work they can show, a public git repository with a launch plan, a Mission Control board and a review is a strong piece of evidence.

**Honesty note.** The Dojo does not promise a job, a salary or a title. The roles below come from the framework texts of World Enterprise, rewritten in plain words. Job titles at other companies differ. Use this lesson to understand skills and responsibilities, not as a guarantee.

## 2. Key ideas, explained

### 2.1 The Launch Specialist

The World Enterprise guide describes a Launch Specialist as someone who prepares and sends skilled people (the source calls them "droids") to help client companies grow. Reading it with plain eyes, the core process is a **client engagement** with five steps:

1. **Prepare the specialist.** Build and keep up the skills the work needs. Training programmes prepare people for changing business needs.
2. **Engage the client.** When a new client arrives, make a full assessment of their needs and requirements. If the client lacks resources, send suitable help.
3. **Build the company's foundation.** Work with the client to understand their goals and their budget limits. Help them hire the right people.
4. **Improve the environment.** Make sure the working environment supports growth, including the working atmosphere and the way the team collaborates.
5. **Expand to new clients and keep supporting.** For each new client, do a **gap analysis** (what exists compared with what is needed) and look at the surroundings (competitors, partners, standards) to choose the best approach. Keep supporting the client after the first results.

The source illustrates this with a story in which the client is a distant planet that lacks a good environment for growth. The story walks through assessment, budget planning, hiring, environment building and sustainable growth. You can swap the planet for a café chain, a school or a small start-up, and the five steps still work.

**In ANDROID Ops terms**, the Launch Specialist spends most time in Research (assessment, gap analysis), Network (people, partners, hiring help), Design (the environment), and Deliver (the launch and the support that follows).

**In plain words, a Launch Specialist is a person who gets a product or a team to a successful start, and does not leave until it is stable.** The 2030 version works with agents: an agent can read the client's documents and prepare the gap analysis draft, but a person talks to the client, understands what they really need and decides the plan.

### 2.2 The Command Engineer

In the ANDROID Ops notes the **Command Engineers (CEs)** are the tactical operators of Mission Control. They:

- Oversee quality control and integration.
- Run **quality assurance (QA)** and **user acceptance testing (UAT)**.
- Identify and reduce obstacles to a successful launch.
- Use diagnostic tools and live data to confirm each application meets performance and reliability standards.
- Declare an application **mission-ready** and hand control to the Deployment Team.

After launch, the same role keeps watching, as described in [lesson 28](/library/tracks/frameworks/28-mission-control-growth-and-event-horizon/): dashboards, service level objectives, alerts and incidents.

**Skills:** testing, reading logs and metrics, clear checklists, calm communication, knowing what "ready" means, and the discipline to say no.

### 2.3 The Deployment Team

The Deployment Team takes the ready application and does the **launch and production deployment**: release scheduling, rollout, and delivery of the product to its destination. In the SuperNova text, "deployment" is the last of the seven ANDROID steps and covers launch schedule and release management.

**Skills:** reading and writing pipeline configuration, infrastructure as code, GitOps, rollback and forward-fix, change records. These are the skills of [lesson 27](/library/tracks/frameworks/27-deployment-governance-and-go-to-market/).

### 2.4 The Product Development Manager across all three

The PDM from the first lesson is not one of these three roles. The PDM **employs the work of all three**, and in a small team is all three. This is the reason to learn them: you need to know what good Launch Specialist, Command Engineer and Deployment work looks like so you can judge it, whether people or agents do it.

| Role | Main question | Dojo lessons | Industry titles that overlap (not equal) |
|---|---|---|---|
| Launch Specialist | Is the client or customer set up to succeed? | 25, 27, 28, this lesson | Implementation consultant, customer success manager, technical program manager, product operations |
| Command Engineer | Is it ready and is it healthy? | 22, 28 | QA lead, release manager, site reliability engineer, operations analyst |
| Deployment Team | Can it go live safely and be undone? | 24, 26, 27 | DevOps engineer, platform engineer, release engineer |
| PDM | Should we build and ship this, and did it work? | all | Product manager, product owner, product operations lead, founder |

Titles vary by company and country. Read job descriptions for the actual tasks, not just the name. The Atlassian article on the [product owner role](https://www.atlassian.com/agile/product-management/product-owner) is a good comparison for the PDM; Google's [Site Reliability Engineering book](https://sre.google/sre-book/table-of-contents/) is the best free window into the Command Engineer and operations mindset.

### 2.5 Working with agents in each role

| Role | Agents do | The person does |
|---|---|---|
| Launch Specialist | Read client documents, draft a gap analysis, prepare checklists and a first plan, track actions | Meet the client, ask the real question, judge risk, agree the plan, build trust |
| Command Engineer | Run tests, collect metrics, summarise logs, keep the timeline | Declare ready or not, run the incident, decide to pause |
| Deployment Team | Write pipeline and deployment files, prepare change records, watch rollouts | Approve production, own the switch, sign the risk |

Notice the pattern: **agents prepare and observe; people decide and answer.** The more routine work agents take, the more your value lies in judgement, communication and trust.

## 3. Step by step: run a client engagement as a Launch Specialist

Use this for a real volunteer client (a local club, a friend's small business) or the fictional TrailMug café partner.

1. **Agree the scope.** One page: who the client is, what they want, what you will and will not do, and for how long.
2. **Do the gap analysis.** Make a table of "what exists" and "what is needed" for each of the seven ANDROID areas. Collect evidence, not opinions.
3. **Look at the surroundings.** Note competitors, partners, rules and standards that affect the plan. Keep it short.
4. **Check budget and resources.** What can they spend in money and time? Which people do they have? Which are missing?
5. **Write the launch plan.** Use ORBITAL to organise it (objective, resources, budget, indicators, transport, activities, logistics); see the [Frameworks track](/library/tracks/frameworks/). Use the [LAUNCH checklist](/library/tracks/frameworks/25-launch-sequence-six-stages/) for the people side.
6. **Agree the first measure** and the date you will review it.
7. **Do the launch** with a small first step.
8. **Support and review.** Visit the board weekly, run a short review at the agreed date, and write what changed.
9. **Hand over.** Write a one-page "how to run this without me".

## 4. Worked example: a café partner for TrailMug

Leo owns one of the partner cafés. TrailMug's Launch Specialist (Maya, in this example) helps him start using cup returns.

- **Scope:** one café, four weeks, goal: staff process returns with the scan page without help.
- **Gap analysis (extract):**

| Area | What exists | What is needed |
|---|---|---|
| Network | Leo has a phone and a counter tablet; no shared contact for problems | A named person to call and a one-page "what to do if the scan fails" |
| Design | Counter is crowded; the tablet is on a shelf | A stand near the till |
| Research | No record of how long returns take today | A simple count for one week |
| Deliver | No one on staff has used the scan page | A ten-minute guide and a first-week check-in |

- **Plan:** a short ORBITAL page: objective, who helps, the small budget for a stand, the indicator (median return time), the schedule for four weeks, and the logistics (who answers calls).
- **Review:** at the end of week four they review the numbers and decide whether to widen.

The deliverable is a small folder in git that Leo could read. Agents drafted the guide and the checklist. Maya talked to Leo and the baristas herself.

## 5. Working with AI agents on this

**What you decide.** What the client really needs, what risk they can take, whether to proceed.

**What you delegate.** Reading material, drafting tables and checklists, tracking actions, producing the weekly summary, preparing a handover guide.

**A brief you can adapt:**

```text
Read the documents in client/leo-cafe/ (notes, photos described in text,
website text). For each of the seven ANDROID Ops areas, fill in a table
row: what exists (with the file where you found it), what appears to be
missing, and one question I should ask the client. Mark anything you are
guessing as GUESS. Do not write recommendations yet.
```

**How to check.** Ask the questions. Compare the "what exists" column with what you see on site. Remove each GUESS you cannot confirm.

**Privacy.** Client information belongs to the client. Do not put real names, photos or private details in public repositories without permission. Keep client files in a private repository, and share only what the client agrees to.

**From delegating to orchestrating.** The three roles here map onto a command chain. A Command Engineer or Deployment Team member may direct several sessions that read, test and draft, while a person declares ready, approves production and answers customers. The Agent orchestration track teaches this structure.

## 6. Common mistakes and how to avoid them

- **Starting with a solution.** Do the gap analysis first.
- **Promising results.** Promise a process and a review date.
- **Doing everything yourself.** Plan the handover from day one.
- **Letting an agent talk to the client.** Agents prepare; you meet.
- **No measure.** Agree one before you start.
- **Public repository with a client's private details.** Ask first; use a private repository.
- **Believing a title is the skill.** Show what you can do; titles vary.

## 7. Practice

**Deliverable in git:** a private or fictional-client folder `portfolio/launch-engagement/` with:

1. `scope.md` (one page).
2. `gap-analysis.md` (seven areas, evidence, questions).
3. `launch-plan.md` (ORBITAL page and LAUNCH checklist).
4. `board.md` (three to five measures and the review date).
5. `review.md` (what happened, what changed, one gate or habit to add).
6. `handover.md` (how to run it without you).
7. `README.md` explaining, in five sentences, what you did and what an agent did.

If the client is real, share only what they agree to. If you use a fictional client, say so at the top.

## 8. Checklist

- [ ] I can explain the Launch Specialist, Command Engineer and Deployment Team roles.
- [ ] I did a gap analysis based on evidence.
- [ ] My plan has one measure and a review date.
- [ ] A person met the client; agents only prepared.
- [ ] A handover guide exists.
- [ ] No private data is in a public repository.
- [ ] I described my own role honestly in the README.

**Next:** the capstone starts with DREAM discovery and takes TrailMug through all of it.
