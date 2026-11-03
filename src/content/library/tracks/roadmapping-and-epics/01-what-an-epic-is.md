---
title: "What an epic is, and what it is not"
description: "Learn the four levels of planning, why an epic is not just a big issue, and three size tests that tell an epic from a milestone or an issue."
section: "Roadmapping and epics"
order: 1
track: "roadmapping-and-epics"
level: "core"
duration: "2 hours"
outcomes:
  - "Name the four levels of planning and say who owns each"
  - "Explain why an epic crosses several parts of the product"
  - "Apply three size tests to sort work into epic, milestone or issue"
  - "Compare the Dojo's meaning of epic with other tools and say how they differ"
resources:
  - "atlassian/epics"
  - "atlassian/epics-stories-initiatives"
  - "gitlab/epics"
  - "gitlab/milestones"
  - "microsoft/azure-boards-portfolio-backlogs"
  - "atlassian/product-roadmaps"
prerequisites:
  - "epic-standard"
  - "week-3-problems-to-epics"
  - "people-write-epics"
updated: 2026-11-03
---

**Supports:** Developer, week 3 (Problems to epics). **Time:** about two hours.

## 1. Why this matters

Plans fail at the seams between levels. A vision is too big to build. An issue is too small to steer by. Between them sits the unit that makes whole-product planning possible: the **epic**. If you cannot say what an epic is, you will either plan at the level of tasks (and drown in detail) or at the level of slogans (and build nothing).

This matters even more when AI agents do the building. An agent is excellent at a small, clear, checkable task in one repo. It is poor at holding the whole product in its head. Somebody has to cover the gap between "make customers happy" and "add a field to this form". In the Dojo, that somebody is you, and the tool for it is the epic.

For a Product Development Manager (PDM), knowing the levels is also a time-management skill. You own the top two levels and you define the third. Agents own the fourth, with your review. If you find yourself writing issues by hand all day, you are working at the wrong level. If you find yourself only writing slogans, you are not giving the agents enough to build.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which outcomes become epics, how big each is, and where the edges lie | Explaining terms; checking an item against the size tests when you ask; later, splitting your milestones into issues | The classification matches the size tests; the epic crosses real parts of the product | Product, engineering, design, operations and finance all appear in the "parts touched" line |

## 2. Key ideas

### The four levels

The Dojo plans work at four levels. Learn them well, because the whole program is about moving between them.

| Level | Question it answers | Typical size | Who owns it |
|---|---|---|---|
| **Vision / product** | Why does this product exist, and for whom? | Years | The product lead and the sponsor |
| **Epic** | Which big customer or business outcome do we deliver, across all parts of the product? | 1 to 3 months, many parts | **You**, written by hand |
| **Milestone** | What slice of that epic ships next, with a date? | 1 to 4 weeks | You define it. Agents may help detail it. |
| **Issue** | Which exact task builds it? | Hours to days | AI agents and developers, reviewed by you |

Read the table slowly. The word "ship" in the milestone row matters: a milestone ends with something that works for a person, even if small.

### An epic is not a bigger issue

The most common mistake is to think an epic is an issue with a long title. It is not. An epic is a **different kind of thing**, because it crosses parts of the product. For TrailMug, the epic "Café owners can join, run returns and see what TrailMug brought them" touches the partner page, the returns service, the help centre, the partner terms and the monthly report. No single repo contains it.

> If an epic lives in only one repository, it is probably a milestone.

This is the first and best size test.

### Three size tests

Apply these in order:

1. **The parts test.** List the parts of your product (repos, systems, policies, people) the work touches. One part: issue. One repo with several steps: milestone. Three or more parts: epic.
2. **The outcome test.** Can you state a result a person would notice, in a sentence, with a number? "Visitors can request a welcome cup and get a reply in five minutes." If you can only state an activity ("improve the website"), it is not yet an epic.
3. **The calendar test.** Would it take one to three months to deliver, as a whole? A few days: issue. A few weeks in one place: milestone. A quarter or more: it is probably two epics, or a vision.

When the tests disagree, trust the parts test most.

### Why "across all parts" matters

A product is a web of parts. The pain a customer feels rarely lives in one part. A late welcome email might need a change in the sign-up app, the customer list, the email provider and the website copy. If you plan by repo, each team or agent fixes its own part, the interfaces drift, and the customer still gets a late email. If you plan by **outcome**, one epic owner keeps all the pieces pointed at the same result.

### How other tools use the word

Words differ between tools, and a good manager can translate. Atlassian describes an epic as a large body of work that can be broken down into smaller stories, and shows how initiatives, epics and stories nest. Microsoft's Azure Boards uses epics, features and user stories as backlog levels. GitLab's epics group related issues across projects. In all of these, an epic is a **container** for smaller work. The Dojo adds a firm rule about the **size and nature** of the container: it crosses parts of the product and expresses a customer or business outcome. When you read other material, keep asking: "Is their epic my epic, or is it a milestone?"

### Free plan versus paid plan

GitLab's built-in epics feature, and its roadmap view, belong to paid tiers at the time of writing. Check the current GitLab documentation before you rely on them. On a free account you create the **same discipline** with labelled issues, milestones and boards. The lesson on your roadmap in git shows how. The skill transfers: a human-owned, written, dated plan.

## 3. Step by step

### Step 1: List your candidates

Take the break list from your journeys (see the [personas and journeys track](/library/tracks/personas-and-journeys/)) and your product map. Write every outcome you could imagine delivering, one line each. Aim for 12 to 20. Include small things on purpose, because the tests will sort them.

### Step 2: Write each as an outcome for a person

Rewrite each line as a result for a person. "Partner portal" becomes "A café owner can join and see her results without calling us." If you cannot name the person, you do not yet understand the item.

### Step 3: Apply the parts test

For each outcome, list the parts of the product it touches, using the names from your product map. Count them.

### Step 4: Apply the outcome test

Can you attach a number or a clear visible change? If not, write "needs a measure" and keep it on the list for now.

### Step 5: Apply the calendar test

Estimate roughly: days, weeks or months. Be honest, and remember that waiting for other people (a decision, a partner, a legal check) is part of the calendar.

### Step 6: Sort

Put each item in one of three piles: **epic** (passes all three, or passes the parts test strongly), **milestone** (one repo, several steps, weeks), **issue** (small). Items that pass no test are probably not yet ideas. Park them on a "later or never" list with a reason.

### Step 7: Look at the epic pile

You will usually have six to ten candidates. The Dojo asks for four to eight epics in your first roadmap. Merge related ones. If two items share a person and a goal, they are probably one epic. Cut anything that does not serve your main user or customer. Write down what you cut.

## 4. Worked example: TrailMug

TrailMug is fictional. Here are some candidates sorted by the tests.

| Candidate outcome | Parts touched | Calendar | Verdict |
|---|---|---|---|
| A café owner can join, run returns and see what TrailMug brought her | Partner page, terms, help centre, returns service, monthly report (5) | 2 to 3 months | **Epic** |
| A visitor can see the price, sign up and pay | Site, app, payment, privacy notice (4) | 6 to 10 weeks | **Epic** |
| A new member gets a welcome email within 5 minutes | App, workflow, customer list, email provider (4) | 4 to 6 weeks | **Epic** (or part of onboarding) |
| Anyone can tell whether the service is up | Status page, monitoring, alerting (3) | 3 to 4 weeks | **Epic** (small) |
| Café finder map loads in under 2 seconds | Returns service only (1) | 3 days | **Issue** |
| Rewrite the home page headline | Site (1) | 1 day | **Issue** |
| Partner onboarding emails for cafés | Workflow, email provider (2) | 2 weeks | **Milestone** inside the café epic |
| Loyalty points | Several | Unknown | **Later or never:** not serving this yet; no evidence |

**What the sorting showed:** four epics came out strongly. The map speed and the headline are issues for the backlog. The partner emails became a milestone inside the café epic. Loyalty points went to "later or never", with the reason "no evidence from interviews". The founder wrote one more line: "I cut loyalty points because no interviewee asked for them."

Compare the first epic with how Atlassian might describe it: a big story broken into smaller ones. The Dojo's version stresses that it **crosses** the partner page, the terms and the returns service. That crossing is what makes someone need to own the whole.

## 5. Working with AI agents on this

Understanding the levels is the one place where an agent works well as a **tutor and a checker**. It is a poor author.

**Delegate:**

- **Explaining words.** "Explain the difference between an epic, a milestone and an issue to a new product manager. Give three examples from a cup-subscription product." Then write your own explanation.
- **A size-test check.** Give the agent your list with parts and calendar estimates, and ask it to say which items look mis-sorted and why. You decide.
- **Comparing tools.** "Explain how epics work in Jira, Azure Boards and GitLab. List differences. Give links to the official documentation." Open the links.
- **Finding vague words.** "Underline any outcome in this list that has no clear person or measure."

**Do yourself:**

- Write each candidate outcome.
- Choose the parts, the calendar estimate and the verdict.
- Decide what to cut.

**A brief you can adapt:**

```text
I am sorting product work into three levels:
- Epic: crosses three or more parts of the product, expresses an outcome
  for a person, takes 1 to 3 months.
- Milestone: one repo or area, several steps, 1 to 4 weeks.
- Issue: a task of hours to days.
Below is my list. Each line has the outcome, the parts it touches and my
time estimate. For each line, say whether you agree with my verdict and
give one sentence of reasoning. Do not add or remove items. Do not
rewrite my wording. If a line has no person or no measurable result, say so.
```

**How to check the output.** The agent will usually agree with you. That is the danger. Pick two items where it agreed and argue the opposite case yourself. If you can, mark them again. Count parts yourself: agents often miscount, or include parts you do not have.

**Disclose.** In `roadmap/levels-sorting.md`: "AI use: explained terms and checked my sorting. The outcomes, parts and verdicts are mine."

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. You are on the **use** rung here. An agent is a tutor and a checker. The levels you learn are what let you climb: you cannot orchestrate work you cannot size. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the two upper rungs.

## 6. Common mistakes

- **Treating an epic as a big issue.** If it lives in one repo, it is a milestone.
- **Naming epics after features.** "Landing pages" is a feature. "Visitors can request a welcome cup" is an outcome.
- **Writing epics as activities.** "Improve onboarding" has no end. Add a person and a number.
- **Too many epics.** More than eight in a first roadmap usually means some are milestones.
- **Too big.** An epic that takes a year is a vision, and should be cut into two or three.
- **Planning by team or repo.** Plan by outcome, then see which repos it needs.
- **Copying another tool's meaning of epic.** Check whether it matches the Dojo rule.
- **Letting an AI name and size your epics.** You will not be able to defend them.

## 7. Practice: sort twenty items

**Deliverable:** `roadmap/levels-sorting.md` in your git repo.

1. A table of at least 15 candidate outcomes for your product, each written as a result for a person.
2. For each: the parts it touches (named from your product map), the rough calendar, the result of each size test and your verdict: epic, milestone, issue or later/never.
3. A short list of items you cut and why.
4. A paragraph, in your own words, that explains the difference between an epic and a milestone to someone who has never heard the words.
5. Your AI-use line.

Use your own product. If you work with TrailMug, add at least five new candidates that are your own idea.

Commit with a message such as `Sort candidate outcomes into epics, milestones and issues`.

**Check:** read your explanation to a friend. If she cannot say back the difference in her own words, rewrite it.

**Stretch:** compare the Atlassian and GitLab epic pages. Write five lines on where their meaning differs from the Dojo's.

## 8. Checklist

- [ ] I can name the four levels and who owns each.
- [ ] Each candidate is written as an outcome for a person.
- [ ] I counted the parts each one touches.
- [ ] I applied the parts, outcome and calendar tests.
- [ ] Epics cross parts of the product; single-repo work is a milestone or issue.
- [ ] I wrote what I cut and why.
- [ ] I wrote my own explanation of an epic.
- [ ] I recorded my AI use.

## 9. Further learning

Atlassian's pages on epics and on epics, stories and initiatives show the common vocabulary. Microsoft's guide to product and portfolio backlogs shows the same ideas in Azure Boards, and the GitLab pages on epics and milestones show how a Git-based tool models them. Atlassian's roadmap guide gives the wider picture of what epics feed. In the next lesson you will write an epic yourself, line by line.
