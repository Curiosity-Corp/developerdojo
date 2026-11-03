---
title: "Case study: DanHup people, touch points and journeys"
description: "Templates 1 and 2 filled in for DanHup with honesty about what the evidence supports: roles, a persona in progress, eight touch points and two journeys."
section: "Case study"
order: 3
level: core
duration: "60 min"
outcomes:
  - "See how to fill a persona table when the evidence is thin, without inventing anything."
  - "Read eight touch points with owners and pain points."
  - "Compare a user journey with a customer journey for the same product."
  - "Turn a broken hand-off into a candidate epic."
resources:
  - nngroup/personas-make-users-memorable
  - nngroup/journey-mapping-101
  - nngroup/customer-journey-mapping
  - nngroup/journeys-vs-flows
  - gov-uk/service-manual-user-research
  - ixdf/personas
prerequisites:
  - case-study-danhup-the-product-on-one-page
  - template-personas
  - template-journeys
---

This is page 3 of the DanHup case study. It shows template 1 ([personas and demographics](/library/template-personas)) and template 2 ([touch points and journey maps](/library/template-journeys)). **EXAMPLE ONLY. Your product needs your own thinking.**

A warning first. The source evidence for DanHup names roles but does not include interviews, quotes or demographics. The case study does not invent them. That is the right behaviour, and this page shows what an honest, thin persona file looks like. The touch points come from real files. The journeys below are built from the app's own documented stages, and the parts that are inferred are marked **(inferred)**.

## Why it matters

A learner who has no evidence faces a temptation: write a smooth persona anyway. This page shows the alternative: write what you know, mark the guesses, and turn the missing evidence into a task. That is what a coach respects. A persona with invented quotes is the first thing a hard question will break.

## Key ideas

- **Role is not persona.** A role says what a person does in the product. A persona adds goals, fears, quotes and evidence.
- **Inferred means guessed from a clue.** Mark it, and plan to replace it with evidence.
- **Two journeys.** The user journey and the customer journey are two stories. In DanHup the candidate is both a user and a beneficiary, and the employer is a customer (inferred).
- **A broken hand-off is a candidate epic.**

## Step 1: Template 1 filled, the demographics summary

| Question | My answer | Evidence |
|---|---|---|
| Who pays (customer)? | Not known. No pricing exists. The employer is the likely payer (inferred). | The landing page copy "Create Job Posting"; no payment gateway found |
| Who uses (user)? | Candidates, their helpers and approvers | The app's journey pages |
| Typical age range | **No evidence yet** | None collected |
| Countries and cities | **No evidence yet** | None collected |
| Languages | English (the product copy is in English) | The landing page |
| Job roles | Candidates seeking jobs, recruiters writing to them, hiring managers | The app's journey pages |
| Company size or household type | **No evidence yet** | None collected |
| Budget range | **No evidence yet; no pricing** | None collected |
| Device and internet quality | **No evidence yet** | None collected |

**Commentary.** Five of nine rows say "no evidence yet". That is not a failure. It is an accurate map of what is known. Each row becomes a task: ask the first ten users about their devices, their cities and their budgets.

## Step 2: Template 1 filled, one persona in progress

| Field | Description |
|---|---|
| Name | "The candidate" (made-up name to be chosen after interviews) |
| User, customer, or both? | Both: uses the app and benefits from its results. Whether the candidate also pays is a decision nobody has made. |
| Role, age range, location, language | Job seeker. Age and location: no evidence yet. English. |
| Education and tech comfort | No evidence yet |
| Goal: what they want to get done | Turn interest from recruiters into approved outreach, safely (from the app's overview) |
| Fears and frustrations | Safety of automated outreach. The app has safety rails and human approval at every send, which hints at this fear (inferred). |
| How they find the product | Not known. The only public entry is a landing page with a "notify me" form. |
| What they pay or give | Their own model-provider key is stored encrypted. Money: nothing today. Data: mail and calendar access. |
| Tools they already use | Mail and calendar platform, a chat platform, LinkedIn |
| A real quote | **None collected yet.** Do not invent one. |
| Evidence | The app's journey pages and overview. No interviews yet. |
| Which journey step hurts them most | Not known. Step 7, approve, depends on one person being online (T6). |
| What this persona makes me want to change | Collect ten real conversations before writing anything else about this person |

**Commentary.** The last row is the most honest sentence of the table, and the one that changes the plan. Look at "A real quote": an empty cell protects the persona from fiction.

## Step 3: Template 1, the roles that are known

| Role | User or customer | What they need | Evidence |
|---|---|---|---|
| Candidate (the client) | Both | Interest turned into approved outreach, with safety | Journey pages |
| Helper or team admin | User | Manage several candidates | Team delegation document |
| Approver | User | Decide on each draft quickly | Approval cards document |
| Employer or hiring manager | Customer (inferred) | Fill a job with good candidates | Landing page copy |
| Product manager | Internal | Plan the whole product | GitLab product group |

## Step 4: Template 2 filled, the touch points

| ID | Touch point | Stage | Channel | System or repo | Owner | Persona | Pain or opportunity |
|---|---|---|---|---|---|---|---|
| T1 | Public landing page | Before | Web | The site repository | Marketing | Employer or hiring manager | Template text still on the page; no pricing |
| T2 | "Notify me" email capture | Before | Web form | The site's small script and the email-capture service | Marketing | Employer | Only one capture form; no follow-up journey found |
| T3 | "Create Job Posting" button | Before | Web | The site repository | Marketing | Employer | Where does it lead? Check it. A broken hand-off is an epic idea. |
| T4 | Sign-in to the private app | During | App | The app and the sign-in service | Engineering | Candidate | Private access only: how does a new person get in? |
| T5 | Recruiter email arrives and is triaged | During | Email | The workflow fleet | Operations | Candidate | Good automation; the human approval step is key |
| T6 | Approval card in chat | During | Chat | The app | Operations | Approver | Depends on one person being online |
| T7 | Outreach sent | During | Email | The app and the mail platform | Sales | Recruiter | Safety rails against speed |
| T8 | Reconcile and track | After | App | The app | Engineering | Candidate | The CRM mirror is off, so sales has no view |

**Commentary.** Two touch points (T3 and T8) are flagged as likely gaps. Touch points T1 to T3 are before purchase and all belong to marketing. Touch points T4 to T8 are the working product and none of them has an owner in the marketing function. The product has a gap between "the public page" and "the private app": T4 asks how a new person gets in, and nobody has answered it yet.

## Step 5: Template 2 filled, the user journey

Persona: the candidate. The stages follow the app's own flow (intake, classify, flag, discovery, assistant, draft, card, approve, send, reconcile) compressed into the six template stages. The feelings are **inferred** from the pain points, not measured. Replace them after interviews.

| Stage | What the user does | What they think (inferred) | Feeling | Pain point | Touch point | Candidate epic idea |
|---|---|---|---|---|---|---|
| Discover | Finds the landing page | "What does this do for me?" | 2 | Template text, no clear offer | T1 | A visitor becomes a registered user |
| Try | Signs in for the first time | "How do I get in?" | 2 | Private app: no obvious path for a new person | T4 | The same epic: the hand-off to sign-up |
| Start using | Recruiter mail is triaged | "Good, it sorts my mail." | 4 | None found | T5 | None |
| Get value | Reviews and approves a draft | "Is this safe to send?" | 3 | Needs one person online | T6, T7 | Operations: more than one approver |
| Hit a problem | Something fails | "Where do I look?" | 2 | No ops home | (none) | Safe, visible operations |
| Come back or leave | Tracks outcomes | "Did it work?" | 3 | CRM off; no shared view | T8 | Sales sees the same cases as the app |

## Step 6: Template 2 filled, the customer journey

Persona: the employer or hiring manager (**inferred** from one line of website copy). This is a hypothesis about the paying person. Most cells say "unknown" for a reason: nobody has talked to an employer yet.

| Stage | Who decides or pays | What they want to know | What they do | Feeling | Pain point | Touch point | Candidate epic idea |
|---|---|---|---|---|---|---|---|
| Awareness | Hiring manager (inferred) | "Can this fill my job?" | Reads the landing page | 2 | No offer in plain words | T1 | Visitor becomes a registered user |
| Consideration | Hiring manager | "What does it cost?" | Looks for pricing | 1 | No pricing exists | T1 | Paid customers (decision first) |
| Purchase | Unknown | Unknown | Nothing can be bought | 1 | No payment gateway | (none) | Paid customers |
| Onboarding | Unknown | "How do I start?" | Clicks "Create Job Posting" | 1 | Unknown where it leads | T3 | Fix the hand-off |
| Renewal | Unknown | Unknown | Not applicable yet | n/a | Not applicable | (none) | None yet |
| Referral | Unknown | Unknown | Not applicable yet | n/a | Not applicable | (none) | None yet |

**Commentary.** The customer journey stops early on purpose. At Purchase, nothing can be bought. A customer journey that ends in a dead end is a finding, not a mistake in the map.

## Step 7: The gap list

| Gap | Where seen | Who it hurts | Becomes epic? |
|---|---|---|---|
| Landing page has template text and no path to the app | User and customer journeys | Visitors, employers | Yes. It touches the site, the app and the email-capture service. |
| No home for operations | User journey, "hit a problem" | Candidates, engineers | Yes. It touches the app, the workflow fleet and the dashboards. |
| CRM off, so sales has no view | T8 | Sales | Yes. It touches the app and the CRM. |
| No payment gateway or pricing | Customer journey | Whoever must pay | Yes, but begins with a decision. |
| Approval waits for one person | T6 | Approver | Not yet. It is a milestone inside the operations epic. |

## Working with AI agents

- **May:** summarise interview notes once you have them. Search code for the destination of a button, so you can check what T3 really does.
- **May not:** write the persona, invent a quote or fill the feeling column. An agent will produce smooth personas that no one met.
- **A safe brief:** "Find the target of the 'Create Job Posting' button in the site repository. Quote the line and the file. Do not interpret."

## Common mistakes

1. **Inventing demographics.** Write "no evidence yet".
2. **A quote with no source.** Leave it empty.
3. **One journey for two people.** Keep two sheets.
4. **Feelings written as facts.** Mark them inferred until measured.
5. **Hiding a dead end.** Write it down.

## Practice

1. Fill your own demographics table. Count the "no evidence yet" rows. Plan five conversations.
2. Pick one touch point and find the repository behind it.
3. Write a customer journey for your product that ends honestly, even if it ends early.
4. Mark each cell of your journeys as known or inferred.

## Checklist

- [ ] Every claim in my persona has a source or is marked inferred.
- [ ] No invented quotes.
- [ ] My touch points have IDs, systems and owners.
- [ ] I have a user journey and a customer journey.
- [ ] My gap list says which gaps are epics and why.

## The 2030 Product Development Manager lens

- **You decide:** who you need to talk to next, and what the persona says.
- **You delegate to agents:** tracing a button to its destination, listing emails sent by the product, summarising the notes of the interviews you ran.
- **A sample brief:** "Find every place in the repositories where an email is sent. List each with file path and trigger. Do not suggest changes."
- **You verify by:** opening the files and clicking the button yourself.
- **Disciplines involved:** research, design, marketing, sales, support and engineering.
- **On the agent ladder:** **use**. Agents find facts. People write the persona.

## Further learning

Continue with [epics, roadmap and milestones](/library/case-study-danhup-epics-and-roadmap). Review [Deck 6](/library/deck-06-personas-touch-points-journeys) for the teaching behind these templates.
