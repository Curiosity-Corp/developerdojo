---
title: "The two levels, the weeks and the capstone"
description: "How the program is built: the Developer level (plan the whole product), the Master Developer level (platform and GitOps), the weekly goals and outputs, the capstone and the badge."
section: "Program guide"
order: 2
level: foundation
duration: "40 min"
outcomes:
  - "Describe the two levels and what each one finishes with."
  - "Say the goal and the output of every week."
  - "Explain how the capstone and the four gates lead to the badge."
  - "Know what you take away when you finish."
resources:
  - atlassian/product-roadmaps
  - gitlab/epics
  - gitlab/roadmap
  - gitlab/milestones
  - opengitops/principles
  - atlassian/itsm
prerequisites:
  - program-why-and-who
---

The program has **two levels** and a **capstone**. The first level teaches you to plan a whole product. The second teaches you the platform it stands on and how to ship it through git. Each week has one goal and one output you can show.

## Why it matters

People who do not know the shape of a program drift. They do week 2 work in week 1, or skip the exercise and read more. Knowing the shape tells you what "done" means this week.

## The two levels

| | Developer level | Master Developer level |
|---|---|---|
| In the original program | Track A: plan the product | Track B: platform and GitOps |
| Question | What is the whole product and what are its epics? | What does the product run on and how do we ship it safely? |
| You finish with | An epic roadmap you wrote and can defend, with a product map, personas and journey maps | A decision record, a patch set, infrastructure and delivery manifests, a catalogue entry and a change record for a component that runs |
| Pages | [Developer path](/library/developer-path-overview) | [Master Developer](/library/master-developer-overview) |
| Reading list | [Plan the product](/library/learning-path-plan-the-product) | [Platform track](/library/learning-path-platform-track) |

The Developer level on this site has six weeks. Weeks 1 to 4 are the core planning weeks of the original program. Weeks 5 and 6 add the brand and website, then the catalogue, the demo and the final Product Package.

## The weeks: goal and output

| Week | Goal | Output you can show | Sensei checkpoint |
|---|---|---|---|
| [1: See the whole product](/library/week-1-see-the-whole-product) | Draw your product on one page and name every part that matters | Repository map, integrations register, one-page picture | Walk through the map in 10 minutes |
| [2: Know the people](/library/week-2-know-the-people) | Name your customers and users and how they find, buy and use the product | Three to five personas, touch points, user and customer journeys | Present one persona and one journey; say where it breaks |
| [3: From problems to epics](/library/week-3-problems-to-epics) | A first roadmap of 4 to 8 epics, written by you | Epics in your planning space with dates, labels and a reason for the order | Epic review. Answer hard questions without notes. |
| [4: Defend the roadmap](/library/week-4-defend-the-roadmap) | Survive a review and cut the first epic into milestones agents can build | Reviewed roadmap, 3 to 5 milestones with dates, a ten-minute presentation | Final roadmap review with a panel |
| [5: Brand, website and mockups](/library/week-5-brand-website-mockups) | Give the product a name, a simple website and next-version mockups | Brand sheet, published page, mockups linked to epics | Show the page and say what each mockup links to |
| [6: Catalogue, demo and package](/library/week-6-catalogue-demo-package) | Put the product into one catalogue and show it working | Catalogue, demo, Product Package | Present the package |

Master Developer weeks, in short: the company platform; the open-source-first ladder and licences; patch-forks, infrastructure as code, GitOps and drift; then service management in git and capstone preparation. See [the Master Developer overview](/library/master-developer-overview).

## The capstone and the badge

The capstone is **one product and one component taken from "we need it" to "it runs and we can explain it"**, in five focused days, with a catalogue entry, a change record and an incident rehearsal. Then four gates, a final exam and an oral review lead to the Master Developer badge. The details and the pass rules are in [the Master Developer assessment](/library/master-developer-assessment) and [Deck 16](/library/deck-16-capstone-gates-and-certification).

## What you leave with

- A roadmap in git that you wrote and can defend out loud, with a product map, personas and journey maps.
- For a component that runs: a decision record, a patch set, infrastructure and delivery manifests, a catalogue entry and a change record, all in git.
- A free-first learning path with every link checked.

## Rules that never change

- **People write epics.** AI agents never write your epics or your roadmap.
- **Open source first,** and check the licence before you adopt.
- **Everything is declared in git.** Changes go through a merge request.
- **We fix forward** and never revert.

## Working with AI agents

- **May:** explain a term, check your spelling, break a milestone you wrote into issues, build those issues.
- **May not:** fill your workbooks, write the epics, or decide the order.
- **A safe brief:** "Here is my milestone with a done-when line. Break it into issues of at most two days each. List your questions. Do not change the scope."

## Common mistakes

1. **Racing ahead.** Each week's output feeds the next.
2. **Treating weeks 5 and 6 as extras.** They produce evidence for the final package.
3. **Skipping the checkpoint prep.** The checkpoint is where learning is checked.
4. **Thinking the badge replaces the roadmap.** The roadmap is the proof.

## Practice

1. Draw the eight weeks as a line. Mark the output of each.
2. For this week, write the one output you must have by Friday.
3. Say which level you are on and what its question is.

## Checklist

- [ ] I know the goal and the output of each week.
- [ ] I know what the capstone is and what the badge needs.
- [ ] I know the four unchanging rules.

## The 2030 Product Development Manager lens

- **You decide:** what the output of each week looks like for your product.
- **You delegate to agents:** the lists, drafts and checks that feed each output, and the building of issues from approved milestones.
- **A sample brief:** "Compare this week's output list with my files in git. List any output that is missing. Do not create files."
- **You verify by:** opening each output and checking it against the goal.
- **Disciplines involved:** product, design, engineering, platform, operations and security.
- **On the agent ladder:** the Developer level trains **use** and **delegate**. The Master Developer level adds **orchestrate** and **govern**.

## Further learning

Next: [how Sensei work with you](/library/program-how-sensei-work). See the [weekly checklist for the planning level](/library/weekly-checklist-track-a) and [for the platform level](/library/weekly-checklist-track-b-and-capstone).
