---
title: "Case study: DanHup, the product on one page"
description: "A worked example of Week 1 to Week 4 thinking on a real product, DanHup: the one-page map, the people, the gaps and the epics that come from the gaps, with commentary."
section: "Case study"
order: 1
level: core
duration: "60 min to read, then 30 min to compare with your own product"
outcomes:
  - "See what good whole-product work looks like on a real product."
  - "Read a one-page product map and spot findings: things missing, unowned or switched off."
  - "Follow the line from evidence to gaps to epics to an ordered roadmap."
  - "Know what an example cannot do for you."
resources:
  - atlassian/product-roadmaps
  - atlassian/epics-stories-initiatives
  - gitlab/epics
  - gov-uk/how-the-discovery-phase-works
  - c4model/c4
  - nngroup/journey-mapping-101
prerequisites:
  - templates-overview
  - week-1-see-the-whole-product
---

This case study is part of a set of five pages. Together they show the program's eight templates filled in for one real product, **DanHup**. This first page is the guide: the product on one page, the people, the gaps and the first epics. The other four pages show the filled templates in detail:

1. This page: the product on one page.
2. [The repository map and the integrations register](/library/case-study-danhup-map-and-integrations)
3. [People, touch points and journeys](/library/case-study-danhup-people-and-journeys)
4. [Epics, roadmap and milestones](/library/case-study-danhup-epics-and-roadmap)
5. [Decision record, catalogue entry and change record](/library/case-study-danhup-decision-catalogue-change)

## EXAMPLE ONLY

This is the DanHup product. **Your own product needs your own thinking. Do not copy it.** Use it to see the shape of good work. If you copy a case study, you learn nothing, and you get a weak roadmap that you cannot defend.

## How the case study was made, and what was removed

DanHup is an AI-driven candidate placement product. We mapped it as the first example for this program. We checked the real files on 28 October 2026. For this public version we removed everything that is not needed to learn from it: internal host names, the names of private tools and networks, client contacts, prices, and the names of real people. Where a real internal tool did a job, we describe the job ("a sign-in service", "a private network layer"). Findings are kept, because finding what is missing is part of the job.

The first two pages (this one and the map and integrations page) use real findings. The people and journeys page uses the roles and touch points found in the evidence, and marks the rest as inferred. The epics page and the last page are **illustrations** of the format, drafted from the evidence. Where the evidence stops, the page says so. We never write that something exists because we expect it.

## Why it matters

Most people learn what good looks like from a finished example. But a finished example hides the rough edges. This case study keeps them. You will see a product with many tasks and one epic, parts nobody owns, a switch that is off, a payment system that does not exist, and a landing page that still has leftover template text. Real products look like this. The Master Developer's job begins there.

## Key ideas

- **A map of parts, not a feature list.** The product is made of a public site, a private app, cloud services, integrations, a CRM, payments, operations and a plan.
- **Evidence beside every claim.** Each row of the map says where the fact came from.
- **Findings.** A part that is missing, unowned, off or unclear is a finding. Findings are where epics come from.
- **Target versus today.** A playbook may teach a planned map of 25 repositories. The case study shows what exists today. The distance between the two is exactly where epics come from.
- **Order with reasons.** A defended roadmap gives a reason for every position.

## Step 1: The product on one page

DanHup has two sides. **Employers** want to post jobs. **Candidates** want help finding and winning jobs. The public website attracts people. The private app does the work. Cloud services handle email. Other systems provide sign-in, network access, AI and CRM.

| Layer | What exists today | Evidence |
|---|---|---|
| Reach: the public website | One landing page, built from a bought template, with an email "notify me" form. The domain is set by a CNAME file. A static page host is likely but not proven. | The site repository: an index page, a CNAME file, a small script folder |
| Use: the private app | A private, multi-user portal. It is reached only through a private network layer, checked by a gateway and a sign-in service. People who plan the product can see issues and boards, not code. | The app's README and deployment files |
| Run: cloud services | A fleet of workflow apps in one cloud resource group classify and flag recruiter mail and call the app. No front door service and no function apps were found. | The infrastructure runbook |
| Connect: integrations | Mail, calendar and chat platform, an internal AI assistant, a model provider, a LinkedIn link, an email-capture service, a sign-in service, a secrets vault. | The identity and integrations document |
| Sell: CRM | A customer-record mirror exists in code but is **switched off**. | The CRM activation document |
| Money: payments | **NOT FOUND.** No pricing or tiers exist. | Searched all repositories |
| Operate: operations | No dedicated repository. Pieces exist: an ops dashboard page, a failure-modes page and the workflow infrastructure repository. | The app's journey folder and the infrastructure repository |
| Plan: GitLab | The product group has **one** epic, called "DanHup-App". The app project has a large number of open issues and many milestones. | GitLab |

**Commentary.** Look at the last row. The project has many milestones and issues, and agents are good at those. But there is one epic. Nobody has yet drawn the whole-product roadmap. That is the Master Developer's job. Also look at the evidence column. Each row names a real file or place. Learners often write rows from memory. A row with no evidence is a guess.

## Step 2: The people

The app documents roles in its own journey pages. Real personas would add demographics and quotes from conversations. We do not invent them here.

| Role | User or customer | What they need | Evidence |
|---|---|---|---|
| Candidate (the client) | Both: uses the app and benefits from results | Interest turned into approved outreach, with safety | Journey pages, app overview |
| Helper or team admin | User | Manage several candidates | Team delegation document |
| Approver (in the chat platform) | User | Decide on each draft quickly | Approval cards document |
| Employer or hiring manager | Customer (**inferred** from the website copy "Create Job Posting") | Fill a job with good candidates | The landing page |
| Product manager | Internal | Plan the whole product | The GitLab product group |

**Commentary.** The word **inferred** matters. The employer role is guessed from one line of website copy. A learner who marks the guess keeps the right to correct it after the first interview.

## Step 3: The journey and the touch points

The app documents its own flow in ten stages: 0 intake, 1 classify, 2 flag, 3 discovery, 4 assistant, 5 draft, 6 card, 7 approve, 8 send, 9 reconcile. The touch-points sheet lists eight touch points from first visit to reconcile. Where a journey breaks is a candidate epic. Two examples: T3, the "Create Job Posting" button, where nobody has checked where it leads, and T8, reconcile and track, where the CRM is switched off so sales has no view. The next pages show them in full.

## Step 4: Gaps that become epics

| Gap found | Epic idea (shape only) |
|---|---|
| Landing page still has template text; no clear path to the app | A website visitor becomes a registered user |
| Operations knowledge is spread across places | Safe, visible operations |
| CRM mirror is off; sales cannot see cases | Sales sees the same cases as the app |
| No payment gateway, no pricing | Paid customers (decision first) |

**Commentary on the order.** Reach comes first, because nobody pays if nobody arrives. Operations comes early because it lowers the risk of everything else. The CRM needs operations visibility first, so its failures can be seen. Payments come last, and they begin with a **decision**, not with code. Each position has a reason you can say in one sentence. That is what a defended roadmap looks like.

## Step 5: One epic in the template

| Field | Epic 1 |
|---|---|
| Title | Website visitor becomes a registered user |
| Problem | Visitors cannot see what DanHup does for them or how to start. The page still has template text. |
| Outcome | A hiring manager can read the offer, start, and reach the app sign-up in one session. |
| Measure | Share of visitors who reach sign-up |
| In scope | Website copy, a clear call to action, the hand-off link to the app |
| Out of scope | Pricing and payment |
| Parts touched | The site, the app, the email-capture service |
| Dependencies | A decision on who may sign up, because the app is private |
| Risks | The page may promise what the app does not do yet |

**Commentary.** Count the parts touched: three. That is why it is an epic and not a milestone. Notice "Out of scope: pricing and payment". It is a real thing a reader might expect, and it protects the epic from growing. Notice the dependency: a **decision**, not a task. Decisions block work more than tasks do. The measure is one number.

## Step 6: What this example does not do for you

- It does not know your customers.
- It does not know your repositories or your integrations.
- It does not replace talking to people.
- Your epics will be different, and they must be written by you.

## Working with AI agents

- **May:** explain a word from this page. Summarise this page. Check your spelling after you write your own map.
- **May not:** write your map, personas or epics from this example. An agent that copies the shape will give you smooth, believable and empty rows.
- **Disclose:** one line in your weekly note if you used an agent to read this page.

## Common mistakes

1. **Copying the example.** The shape is for you. The content is not.
2. **Hiding the findings.** A NOT FOUND row is worth more than a nice row.
3. **Believing the target is today.** A planned map is not an existing map.
4. **Skipping the evidence column.** Every claim needs a source.
5. **Ordering by taste.** Give each epic a reason you can say in one sentence.
6. **Treating one epic as a roadmap.** A roadmap is four to eight epics, ordered.

## Practice

1. Read Step 1. Pick one row and say how you would check it yourself.
2. List three findings in the table and say what could go wrong with each.
3. Choose one gap from Step 4. Write your own epic idea for it without looking at the one shown.
4. Compare your own product's one-page map to this one. Which layer do you know least?

## Checklist

- [ ] I read all five case-study pages.
- [ ] I can name three findings and why they matter.
- [ ] I can explain the order of the four epics in one sentence each.
- [ ] I know the difference between a real finding and an illustration.
- [ ] I will write my own work from my own evidence.

## The 2030 Product Development Manager lens

- **You decide:** which findings matter, which epics exist and in what order.
- **You delegate to agents:** collecting evidence, checking that cited files exist, listing parts of the product from repositories.
- **A sample brief:** "Read the repositories of this product. For each layer in my table, list the files that show it exists. Where you find none, write NOT FOUND. Do not guess."
- **You verify by:** opening two of the cited files and checking them.
- **Disciplines involved:** product, engineering, operations, sales, finance and marketing.
- **On the agent ladder:** the map supports **use** and **delegate**. It tells you which work agents can safely do and which needs a human decision first.

## Further learning

Continue with [the repository map and the integrations register](/library/case-study-danhup-map-and-integrations). Read [Week 1](/library/week-1-see-the-whole-product) for how to make your own, and the [templates overview](/library/templates-overview) for all eight blank templates.
