---
title: "The learning path, week by week"
description: "How the two learning tracks fit the program: items, hours and focus for each of the eight weeks, the honest notes about long courses and certificates, and the skill tracks that match each week."
section: "Learning path"
order: 4
level: foundation
duration: "30 min"
outcomes:
  - "Say what each week of the learning path is for and how long it takes."
  - "Tell which items are core reading and which are long, optional courses."
  - "Use the three-lines rule after every item."
  - "Find the skill track that matches your week."
resources:
  - atlassian/product-roadmaps
  - gitlab/epics
  - gitlab/roadmap
  - gitlab/milestones
  - opengitops/principles
  - google-sre/service-level-objectives
  - spdx/license-list
  - scrum-org/scrum-guide
prerequisites:
  - learning-path-how-to-use
---

The learning path is a **free-first** list of reading, documentation, videos and courses. It has **two tracks**. Track A (plan the whole product) matches the four planning weeks of the Developer level. Track B (platform and GitOps) matches the four weeks of the Master Developer level. This page is the map. The lists themselves are on [Plan the product](/library/learning-path-plan-the-product), the [Platform track](/library/learning-path-platform-track) and [Optional paid courses](/library/learning-path-optional-paid).

## Why it matters

A list of 66 links is not a plan. A week-by-week map tells you what to read first, how long it takes, and what to skip. It also protects you from the most common mistake: spending a month on a certificate and not building anything.

## The rules of the path

1. **Do the items of each week in order.**
2. **After each item, write three lines in your own words** about how it changes your product. Reading and watching are not enough.
3. **Free first.** Almost everything is free reading or documentation. Where there is a cost, the list says so.
4. **Certificates are optional.** A certificate shows you know the words. Your roadmap and your capstone show you can do the job.
5. **Every link was checked.** Each address was opened with an automated check and kept only if it answered successfully. Sites that block automated tools are not listed, and we never bypass a wall.
6. **Prices change.** Always confirm on the provider's site before you pay.
7. **Skip duplicates.** If you already finished a foundation course on the same topic, for example agile or GitLab project management, skip the repeat.

## Track A: plan the product

| Week | Focus | Items and hours (about) | What dominates the time |
|---|---|---|---|
| [1: See the whole product](/library/week-1-see-the-whole-product) | Roadmaps, epics, personas, journeys, GitLab epics | 8 items, 3.4 hours | Short articles and documentation |
| [2: Know the people](/library/week-2-know-the-people) | Roadmaps as problems to solve, journeys versus flows, personas, GitLab roadmap and milestones, the Scrum Guide | 7 items, 3.5 hours | Short articles and documentation |
| [3: From problems to epics](/library/week-3-problems-to-epics) | User research, GitLab training, agile course, cloud basics | 8 items, 78.5 hours | A few long optional courses. The core reading is only a few hours. |
| [4: Defend the roadmap](/library/week-4-defend-the-roadmap) | Certificates, architecture guides, multi-customer products, microservices | 9 items, 259 hours | Optional long certificates. The architecture reading is about 5 hours. |

Week 3 and week 4 totals look large because they include long optional courses and certificates. **You do not need to finish them.** Pick the short items first and add a long course only when you want it.

## Track B: platform and GitOps

| Week | Focus | Items and hours (about) |
|---|---|---|
| 1: The company platform | Portal tools, the cloud-native landscape, GitOps principles, a GitOps delivery tool, a registry, security findings, update bots | 7 items, 4.5 hours |
| 2: The OSS-first ladder and licences | Licence summaries, approved lists, short licence ids, contribution guides, a licence-per-file convention, software bills of materials, project health checks, a scanner | 8 items, 5 hours |
| 3: Patch-forks, infrastructure as code, GitOps and drift | Sync policies, getting started with a delivery tool, declarative infrastructure, overlays, packages, secrets in git without exposing values | 10 items, 15 hours |
| 4: Service management on our stack and capstone preparation | Service management frameworks, merge trains, code owners, service levels, error budgets, blameless reviews, how to send a patch upstream, a database operator | 9 items, 25.5 hours |

The Master Developer weeks are mostly documentation and are much shorter. Read the documents. Then do the exercise in git. See [Deck 10](/library/deck-10-internal-developer-platform) to [Deck 16](/library/deck-16-capstone-gates-and-certification).

## Long courses and the honest notes

- **Long courses.** A full project-management certificate from a large course provider takes about six months. In Track A week 3 only its agile course fits.
- **Courses with fees.** A research-methods course, a GitLab exam and cloud exams may have fees. Check the provider.
- **Project-management and Scrum bodies block automated tools.** For those we list official handbooks only. They may be dated, so confirm current rules and fees on the provider's own site.
- **One certificate is deliberately not listed:** a professional Scrum certificate, because its pages could not be verified.
- **Do not copy answers.** Reading is not the exercise.

## Which skill track matches your week

Use the [skill tracks](/library/tracks/product-discovery/01-frame-the-problem-and-the-idea) for depth. Only tracks that exist are linked.

| Week | Matching skill tracks |
|---|---|
| 1 | [Map the whole product](/library/tracks/product-discovery/03-map-the-whole-product), [Git: the mental model](/library/tracks/git-and-gitlab/01-git-mental-model) |
| 2 | [Talk to customers](/library/tracks/product-discovery/02-talk-to-customers), [Write personas from evidence](/library/tracks/personas-and-journeys/02-write-personas-from-evidence), [Touch points and journey maps](/library/tracks/personas-and-journeys/03-touch-points-and-journey-maps) |
| 3 | [What an epic is](/library/tracks/roadmapping-and-epics/01-what-an-epic-is), [Write an epic yourself](/library/tracks/roadmapping-and-epics/02-write-an-epic-yourself), [Order the epics](/library/tracks/roadmapping-and-epics/03-order-the-epics) |
| 4 | [Your roadmap in git](/library/tracks/roadmapping-and-epics/04-your-roadmap-in-git), [Agent-ready milestones](/library/tracks/roadmapping-and-epics/05-agent-ready-milestones), [Present and defend the roadmap](/library/tracks/stakeholder-communication/03-present-and-defend-the-roadmap) |
| 5 | [Name and promise](/library/tracks/brand-website-and-mockups/01-name-and-promise), [Mockups that link to epics](/library/tracks/brand-website-and-mockups/03-mockups-that-link-to-epics), [Build and publish the website](/library/tracks/brand-website-and-mockups/04-build-and-publish-the-website) |
| 6 | [Planning in GitLab](/library/tracks/git-and-gitlab/03-planning-in-gitlab), [Reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output) |
| Platform | [Pipelines](/library/tracks/ci-cd/01-pipelines-from-first-principles), [Infrastructure code](/library/tracks/infrastructure-as-code/01-describing-infrastructure), [GitOps in practice](/library/tracks/kubernetes-and-gitops/03-gitops-in-practice), [Secrets and identity](/library/tracks/security-fundamentals/02-secrets-and-identity) |

## Topics the lists cover

Agile and product certifications; cloud fundamentals and architecture; GitLab epics and roadmaps; GitOps; service management; infrastructure as code; open source and licences; patch-forks; the platform (portal and catalogue); the platform (registry and security); product management and roadmapping; reliability and service levels; software-as-a-service architecture; user and customer journey mapping and personas.

## Steps for each week

1. Open the week's list and pick the shortest three items.
2. Read or watch one item. Write three lines in your own words.
3. Do the week's exercise in your own repository.
4. Add a long item only if you have time and want it.
5. Write the weekly note, including your AI use line.

## Working with AI agents

- **May:** explain a word from a reading, summarise a long page so you can read the original faster.
- **May not:** write your three lines, or answer the exercise. The point is that you change your own product.
- **A safe brief:** "Explain what a 'service level objective' is in four sentences. Give one example. Do not apply it to my product."

## Common mistakes

1. **Reading everything.** Pick three.
2. **Starting with the longest course.**
3. **Reading without writing the three lines.**
4. **Paying before reading the provider's current page.**
5. **Using a certificate as proof of the work.**

## Practice

1. Choose three items for this week. Write the hours.
2. Read one and write three lines about how it changes your product.
3. Find the skill track for your week and read its first lesson.

## Checklist

- [ ] I chose items for this week and know the hours.
- [ ] I wrote three lines after each item.
- [ ] I checked any price on the provider's site.
- [ ] I did the exercise in git.

## The 2030 Product Development Manager lens

- **You decide:** which items you read and what changes in your product.
- **You delegate to agents:** summaries of long pages so you can read the original faster, checking that links still open.
- **A sample brief:** "Open each link in this list and report the HTTP status and title. Do not summarise the pages."
- **You verify by:** reading one source page yourself before relying on a summary.
- **Disciplines involved:** product, engineering, platform, finance and operations.
- **On the agent ladder:** the path trains **use** first, then the platform weeks train **delegate**, **orchestrate** and **govern**.

## Further learning

Start with [how to use the learning path](/library/learning-path-how-to-use). Then go to [Plan the product](/library/learning-path-plan-the-product) or the [Platform track](/library/learning-path-platform-track).
