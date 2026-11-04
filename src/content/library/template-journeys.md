---
title: "Template: Touch points and journey maps"
description: "The four-sheet workbook for Week 2, field by field: touch points, user journey, customer journey and gap list, with a filled TrailMug example."
section: "Templates"
order: 3
fillable: "template-2-touch-points-and-journey-maps"
level: core
duration: "2 to 3 hours for the first full pass"
outcomes:
  - "List every touch point with a stage, a system and an owner."
  - "Map a user journey and a customer journey as two different stories."
  - "Mark pain points and turn the real gaps into candidate epics."
  - "Link each touch point to the repositories that serve it."
resources:
  - nngroup/journey-mapping-101
  - nngroup/customer-journey-mapping
  - nngroup/journeys-vs-flows
  - nngroup/ux-mapping-cheat-sheet
  - nngroup/service-blueprints
  - gov-uk/service-manual-user-research
prerequisites:
  - templates-overview
  - template-personas
  - week-2-know-the-people
---

This workbook has four sheets: **Touch points**, **User journey**, **Customer journey** and **Gap list**. You fill it in Week 2, after you write your personas. Its job is to show where people meet your product, how they feel there, and where the product lets them down.

## Download the blank template

- Excel file (original format): [template-2-touch-points-and-journey-maps.xlsx](/templates/template-2-touch-points-and-journey-maps.xlsx)
- Markdown copy, to keep in git: [template-2-touch-points-and-journey-maps.md](/templates/template-2-touch-points-and-journey-maps.md)

Make your own copy first. Do not type in the original. A good place for your copy is `people/journeys.md` in your planning repository.

## Why it matters

Most product plans start from features. A journey map starts from a person. It shows that the real product is the whole path: finding it, trying it, paying, getting value, and what happens when something goes wrong. Many of the worst problems live between two parts of the product, where no team looks. A touch point nobody owns is a gap. A gap that hurts a real persona is an epic candidate.

The template also teaches a rule that surprises many learners: **the user and the customer are different stories.** The commuter who uses the cup and the café owner who pays for the service travel on different paths and feel different things. Two sheets, two stories.

## Key ideas

- **Touch point:** any moment a person meets the product. An ad, a search result, the website, an email, the app, an invoice, a support reply, a renewal notice.
- **Stage:** before, during or after purchase.
- **User journey:** the path of the person who uses the product.
- **Customer journey:** the path of the person or company that pays.
- **Pain point:** a place in the journey where the person is stuck, annoyed or leaves.
- **Gap:** something missing between two parts, or missing from a part. A gap may become an epic.
- **Journey versus flow:** a journey includes feelings and thoughts. A flow is only clicks. This template is about journeys.

## How to fill it: steps

1. Open your persona file. Pick **one** persona for the user journey. Write the name at the top of that sheet.
2. On the **Touch points** sheet, list every moment a person meets the product. Do it by walking through your repositories, systems and inboxes, not from memory.
3. Give each touch point an ID, for example T1, T2. Name the system behind it and a human owner.
4. On the **User journey** sheet, fill the six stages: Discover, Try, Start using, Get value, Hit a problem, Come back or leave. Use the touch-point IDs.
5. On the **Customer journey** sheet, fill six stages: Awareness, Consideration, Purchase, Onboarding, Renewal, Referral.
6. Score every feeling from 1 (bad) to 5 (good). Do not leave feelings blank. A journey without feelings is a flow.
7. On the **Gap list**, copy each pain point and each missing owner. Write who it hurts, and whether it becomes an epic (Y or N, and why).

## Every field explained

### Sheet 1: Touch points

| Column | What to write | TrailMug example (fictional) |
|---|---|---|
| ID | A short code you can refer to | T4 |
| Touch point (where a person meets us) | The moment, in plain words | Returning a cup at a partner café |
| Stage | Before, during or after purchase | During |
| Channel | The medium | A café till, a phone camera |
| System or repo behind it | Which repository or tool makes it work | trailmug-app, trailmug-svc-returns |
| Company owner | One person or team | Operations lead |
| Persona | Whose touch point it is | Maya, Leo |
| Pain or opportunity I see | One honest sentence | The deposit refund email has no owner |

### Sheet 2: User journey

| Column | What to write | TrailMug example |
|---|---|---|
| Stage | One of the six stages | Hit a problem |
| What the user does | The action | Opens the app to find why the refund is late |
| What they think | Their words | "Did the café scan my cup?" |
| Feeling (1 bad to 5 good) | A number | 2 |
| Pain point | What blocks or annoys | No status for the refund |
| System or touch point (ID) | The ID from sheet 1 | T7 |
| Candidate epic? (idea, in my words) | A plain idea, not a task | "A commuter always knows the status of her deposit" |

### Sheet 3: Customer journey

| Column | What to write | TrailMug example |
|---|---|---|
| Stage | Awareness to Referral | Consideration |
| Who decides or pays (persona) | The persona who pays | Leo, the café owner |
| What they want to know | Their question | "How much work is it for my staff?" |
| What they do | The action | Asks for a call, reads the partner page |
| Feeling (1 bad to 5 good) | A number | 3 |
| Pain point | The blocker | No café steps shown on the site |
| System or touch point (ID) | The ID | T2 |
| Candidate epic? | An idea | "A café owner sees what the job takes before the call" |

### Sheet 4: Gap list

| Column | What to write | TrailMug example |
|---|---|---|
| Gap (from a journey or the repo map) | The gap in one sentence | The refund email has no owner and no sent-check |
| Where I saw it | The sheet and row | User journey, Hit a problem |
| Who it hurts | A persona | Maya |
| Becomes epic? (Y/N and why) | Yes or no with a reason | Yes. It touches the app, the payment service and email. One repository would not fix it. |

## A filled example in short

Maya's journey, three of six stages:

| Stage | Action | Thought | Feeling | Pain | Touch point |
|---|---|---|---|---|---|
| Discover | Sees a poster in a café | "Could this work for me?" | 4 | Poster shows no price | T1 |
| Get value | Returns a cup | "Which café is closest?" | 3 | The map is slow | T4 |
| Hit a problem | Waits for her deposit | "Did the café scan my cup?" | 2 | No status | T7 |

Leo's customer journey is different. At **Renewal** he asks, "Did TrailMug bring customers?" and the pain is that he sees no proof of value. That gap is on the customer sheet, not on Maya's.

## From the map to the repositories

For each touch point ask: which repositories must exist for it to work? One touch point can need several repositories. A free "waste calculator" needs a page, a small service and a customer list. If you plan only the page, the lead goes nowhere. Count the unique repositories: a real product reaches a dozen or more. If you count three, look for missed touch points. The [repository map](/library/template-repository-map) is the next template.

## Working with AI agents

- **May:** explain what a journey map is. Check spelling after you wrote. Search code and docs to answer a fact question such as "which repository sends the welcome email?" You check the answer.
- **May not:** invent steps, feelings, quotes or pain points. May not decide which gap becomes an epic.
- **Disclose:** one line in your weekly note.
- **A safe brief:** "List every email template in these repositories with the file path. Do not interpret or rank them."

## Common mistakes

1. **Only the app.** The invoice, the support reply and the poster are also touch points.
2. **No owner.** A touch point without an owner is the most valuable finding. Write "NOBODY".
3. **One journey for two people.** The user and the customer are separate sheets.
4. **A flow with no feelings.** If every feeling is blank, you drew a click path.
5. **Tasks in the epic column.** "Add a status page" is a task. "A commuter always knows the status of her deposit" is an outcome idea.
6. **Everything is a gap.** Pick the gaps that hurt a real persona and cross more than one part of the product.

## Practice

1. Walk your own product as a new user. Write down every moment you meet it.
2. Fill the user journey for one persona. Have a classmate check one feeling against the evidence.
3. Fill the customer journey. Find one stage that has no owner.
4. Write three gap-list rows. Mark which one is an epic, and say why the other two are not.

## Checklist

- [ ] My touch-point sheet has IDs, systems and owners for every row.
- [ ] I filled both journeys with feelings from 1 to 5.
- [ ] The user and the customer are different where they differ.
- [ ] Every pain point links to a touch-point ID.
- [ ] The gap list names who each gap hurts.
- [ ] I can say, for each epic candidate, why it is more than a task.

## The 2030 Product Development Manager lens

- **You decide:** which journey steps matter, how people feel there, and which gaps are worth a roadmap slot.
- **You delegate to agents:** collecting touch-point evidence from code and inboxes, listing templates and owners, checking that each touch point has a row.
- **A sample brief:** "Find every place in the repositories where an email, a notification or an invoice is sent. For each, give the file path and the trigger. Do not suggest improvements."
- **You verify by:** opening three of the listed files and checking them against the real inbox.
- **Disciplines involved:** research, design, marketing, support, finance, operations and engineering.
- **On the agent ladder:** **use**. Agents find facts. You read the journey.

## Further learning

[Deck 6](/library/deck-06-personas-touch-points-journeys) teaches personas, touch points and journeys step by step. [Week 2](/library/week-2-know-the-people) gives the plan. When your gap list is ready, move on to the [repository map](/library/template-repository-map) and then the [epic roadmap](/library/template-epic-roadmap).
