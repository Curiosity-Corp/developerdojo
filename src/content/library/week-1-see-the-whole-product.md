---
title: "Week 1: See the whole product"
description: "Draw your product on one page, list every part, and start talking to customers."
section: "Developer path"
order: 1
level: foundation
duration: "8 to 10 hours"
outcomes:
  - "Draw your product on one page and name every part that matters."
  - "List every repository, domain and service with one purpose each."
  - "Register each integration and the part of the company it serves."
  - "Book five customer interviews."
resources:
  - atlassian/product-roadmaps
  - atlassian/epics
  - svpg/product-roadmaps
  - nngroup/customer-journey-mapping
  - nngroup/personas-make-users-memorable
  - gitlab/epics
  - gitlab/manage-epics
prerequisites:
  - program-two-levels-and-capstone
  - the-way-five-rules
---

**Outcome:** you can draw your product on one page and name every part that matters. You have started customer discovery.

## Why start here

Beginners think: "One product, one repo." That works for a weekend project. A serious product needs a **dozen repos or more**. An AI agent sees one repo at a time. Only a human sees the whole map. That human is you.

## Step 1: Write the idea in one paragraph

Write it yourself. Name the user, the problem, one success number and a date.

> TrailMug helps coffee drinkers stop using throw-away cups. A customer pays a small monthly fee, gets a reusable cup, and swaps it for a clean one at any partner café. She never carries a dirty cup. We aim for 500 active members in six months.

Use the [product brief template](/library/template-product-brief).

## Step 2: Count the repos

A **repository** (repo) is one folder of code or content under version control. List every repo your product needs. Think about:

- Planning: product brief, journeys, decisions.
- The public website and landing pages.
- The app customers use.
- Small services that do one job each.
- Workflows that call other systems in order.
- Systems you rent: payments, email, a customer list (CRM), a support desk.
- Operations: policies, help pages, a status page, analytics.
- Infrastructure: how everything is hosted and deployed.

Most beginners list three or four. After the prompts, the list grows. A serious product reaches **12 to 25**.

TrailMug first guess: planning, website, app, payments. After walking the journeys: add a partner-café sign-up page, a cup-return tracking service, a welcome-email workflow, a CRM, a help centre, a status page, analytics, a privacy policy repo and an infrastructure repo.

Use the [repository map template](/library/template-repository-map) and read [Repository map standard](/library/repository-map-standard).

## Step 3: Register your integrations

An **integration** is a tool from another company that your product uses. Each one serves a part of the business. Write down who owns it and what data flows. Use the [integrations register](/library/template-integrations-register).

## Step 4: Start discovery

Run a 60-minute workshop with 4 to 6 people. Then interview five real users. Questions and the script are in [Week 2](/library/week-2-know-the-people). Book the interviews this week.

## Exercises

1. Write your one-paragraph idea.
2. Draw the product on one page: who uses it, which parts exist, how they connect.
3. Fill the repository map. Count the rows.
4. Fill the integrations register.
5. Book five interviews.

## Coach checkpoint

Walk your coach through the one-page map in 10 minutes. Say what you are unsure about.

## Self-check

- [ ] I wrote the idea myself.
- [ ] My map has a dozen repos or I wrote down why not.
- [ ] Every repo has one named human owner.
- [ ] Every integration has a purpose and an owner.
- [ ] Five interviews are booked.

## Suggested reading

Items for Week 1 in the [Plan the product track](/library/learning-path-plan-the-product).

## How the program supports this week

### How your Sensei works this week

At the checkpoint you walk your Sensei through the one-page map in 10 minutes. Expect questions such as: "Which part has no owner?" and "Which part did you expect and could not find?" Say what you are unsure about. Honest and improving beats perfect. Read [how your Sensei works with you](/library/program-how-sensei-work) to prepare.

### Show your work in git

`README.md` (your idea paragraph), `map/repository-map.md`, `map/integrations-register.md` and a picture of the one-page map. Commit after each row so the history shows how your picture grew. See [your files and git](/library/program-your-work-in-git).

### AI use this week

**May:** list the repositories of a group, read READMEs, find where a feature lives. You check the answers. **May not:** decide what ties into what, name owners or fill your map. See [AI use in the program](/library/program-ai-use-and-disclosure).

### Skill tracks that match

[Frame the problem and the idea](/library/tracks/product-discovery/01-frame-the-problem-and-the-idea), [Map the whole product](/library/tracks/product-discovery/03-map-the-whole-product) and [Git: the mental model](/library/tracks/git-and-gitlab/01-git-mental-model).

### The 2030 Product Development Manager lens

You decide what counts as a part of the product and who owns it. You delegate the listing of repositories and READMEs, with a brief such as "List every repository with its first README line. Do not guess owners." You verify by opening two repositories yourself. On the agent ladder this week is **use**.

### Reading for this week

Week 1 of Track A in [the learning path week by week](/library/learning-path-week-by-week): 8 items, about 3.4 hours.
