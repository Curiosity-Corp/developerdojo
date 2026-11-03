---
title: "Deck 6: Personas, touch points and journeys"
description: "Know the people: evidence-based personas, every touch point with an owner, and separate user and customer journeys that reveal candidate epics."
section: "Teaching deck"
order: 6
level: core
duration: "120 min"
outcomes:
  - "Write a persona that is a real group of people, with evidence for each claim."
  - "Separate the user from the customer and describe both."
  - "List touch points before, during and after purchase, each with an owner."
  - "Map a user journey and a customer journey, and mark gaps and pain points as candidate epics."
resources:
  - nngroup/personas
  - nngroup/journey-mapping-101
  - nngroup/customer-journey-mapping
  - nngroup/journeys-vs-flows
  - nngroup/user-interviews
  - gov-uk/service-manual-user-research
  - ixdf/personas
prerequisites:
  - deck-05-six-layers-of-a-product
  - template-personas
  - template-journeys
---

This lesson covers slides 13, 14 and 15. Slide 13 teaches personas. Slide 14 teaches touch points. Slide 15 teaches journey maps. These three tools are the **Week 2** tools of Track A: after you see the whole product (lesson 5), you learn who it is for and how those people meet it.

## Why it matters

An epic is a change for a person. If you do not know the person, the epic is a guess. Personas, touch points and journeys are three ways to turn "customers" from an idea into something specific enough to design for. They also feed the rule from lesson 4: because personas, journey steps and quotes must come from evidence, **you** have to go and get that evidence.

## Key ideas

### Personas: who is it for?

A **persona** is a real group of people, described with evidence. Slide 13 gives the list of what to include:

- Demographics.
- Goals.
- Fears.
- Tools they use.
- How they find you.

And the list of evidence to build it from:

- Interviews.
- Support messages.
- Analytics.
- Sales calls.

Three rules follow:

1. **Separate the user from the customer.** The **user** uses the product. The **customer** pays. They can be the same person or different people. A school app may have a child as the user and a parent as the customer.
2. **Never let AI invent a persona.** The slide says: "Invented people give invented epics."
3. **Test each persona with one question:** can you point to a real conversation behind it?

A persona is not one person with a stock photo and a first name. It is a pattern across several real people. The name is a handle; the evidence is the content.

### Touch points: where people meet us

A **touch point** is any moment a person meets the product. Slide 14 groups them into three phases.

| Phase | Examples |
|---|---|
| **Before purchase** | Ad, search, website, squeeze page, brief, tool, sales call |
| **During** | Sign-up, payment, onboarding, the app, email |
| **After** | Invoice, support, renewal, referral |

Then add one more thing: **mark who in the company owns each touch point.** The speaker note gives the key question: which touch point has no owner? That is a likely epic.

### User journey and customer journey

Slide 15 separates two journeys:

- **User journey:** how the person who **uses** the product moves through it.
- **Customer journey:** how the person who **pays** decides, buys and renews.

They are often different people with different worries. For each step in a journey, write four things:

1. The **action**: what the person does.
2. The **feeling**: what they feel at that moment.
3. The **pain point**: what is hard or annoying.
4. The **system involved**: which part of the product (from your repository map) is in play.

Then comes the rule that turns the map into planning: **gaps and pain points are candidate epics.**

The learning-path source points to Nielsen Norman Group for the method; the resources below link to their journey-mapping articles. Their summary distinction matters: a journey follows a person across all touch points, while a flow follows steps inside one product.

## A worked example: TrailMug

**Persona 1: Maya, the commuter.** Maya pays for her own cup deposit, so she is both the user and the customer. Evidence: five interviews with commuters at two train stations (invented here for the example; yours must be real), and a count of support messages about late returns. Goals: a coffee on the go without waste. Fears: losing the deposit. Tools: phone, a transit app. Finds TrailMug: sees a cup in her usual café.

**Persona 2: Leo, the café owner.** Leo is a partner, not a commuter. He accepts returned cups and gets a monthly fee. He is the **customer** of the partner service and the **user** of the café tools. Goals: more morning customers, little extra work. Fears: staff time, smell, space. Evidence: three conversations with café owners.

Two personas, two different journeys, so TrailMug maps both.

**Maya's user journey (excerpt):**

| Step | Action | Feeling | Pain point | System |
|---|---|---|---|---|
| 1 | Sees the cup in a café | Curious | Does not know how it works | trailmug-site |
| 2 | Scans a code to borrow | Hopeful | Sign-up asks too many questions | trailmug-app |
| 3 | Pays the deposit | Cautious | Unsure when she gets it back | trailmug-pay |
| 4 | Returns the cup at another café | Relieved or annoyed | Café does not know the return flow | trailmug-svc-returns |

The pain points in steps 3 and 4 are candidate epics: "A commuter always knows the status of her deposit" and "A returned cup is accepted at any partner café without questions."

**Touch point owners.** TrailMug lists the invoice email as a touch point. Who owns it? If the answer is "nobody", write that down. It goes on the risk list and may become part of an epic.

## Working with AI agents

- **Agents cannot give you evidence.** They can only help you with the work around it.
- **Allowed:** use an agent to transcribe an interview recording you made, or to summarise a long document you collected (for example, a support log). Read the summary against the source before using it.
- **Allowed:** after you write a persona, ask the agent to check that every claim has an evidence line next to it. This is a checking job.
- **Not allowed:** asking an agent to write a persona, a quote or a journey step. A good test: if you cannot name the person you heard it from, it does not go in.
- **Useful:** use an agent to count and group support tickets by theme, as a first pass. Check two groups by hand.

## The 2030 Product Development Manager lens

This program trains the **Product Development Manager of 2030**: a person who blends strategy, product, design, brand and marketing, finance, operations, security and engineering, and who treats AI agents as the workforce for lower-level work. The bar is high, and the method is plain. In this lesson:

- **You decide:** who the persona is, which pain points matter most, and which touch points need an owner.
- **You delegate to agents:** transcribing interviews you recorded, grouping support tickets by theme, and checking that each persona claim has an evidence line.
- **The brief you would write:** "Here are 40 support messages. Group them by theme. For each theme give a count and two verbatim examples. Do not summarise beyond the text."
- **You verify by:** reading a sample of each group in the original messages, and speaking to at least three real people before a persona is accepted.
- **Disciplines involved:** user research and design (evidence and journeys), marketing (reach touch points), sales and support (owners), data (counts).
- **On the agent ladder:** **use**: transcription and grouping of evidence you collected. Evidence stays human; the rung is about speed on routine work.

## Common mistakes

1. **A persona with no evidence.** It is a character, not a persona.
2. **Confusing user and customer.** The two have different worries.
3. **One journey for everyone.** Separate user and customer journeys, and, when it matters, separate persona journeys.
4. **A journey that only covers the app.** The journey starts before purchase and continues after.
5. **No owner for a touch point.** An unowned touch point is the first place a customer is lost.
6. **Writing a long journey map and not marking the pain points.** The pain points are the point.
7. **Making up quotes to "bring the persona to life".** Real quotes only, with the source noted privately.

## Practice

1. Interview three real people who use or could use your product. Use the interview guidance in the resources. Write down exact words you heard.
2. Write one persona from those notes. Next to each claim, write the evidence (for example "I3, quote about deposit").
3. List at least ten touch points for your product, spread over before, during and after. Name an owner for each.
4. Make a user journey with at least five steps, with action, feeling, pain point and system. Make a second journey for the customer if they are a different person.
5. Mark two pain points as candidate epics. Do not write the epics yet; lesson 7 does that.

## Checklist

- [ ] Each persona has evidence next to every claim.
- [ ] I separated user and customer.
- [ ] Touch points cover before, during and after, and each has an owner.
- [ ] I have a user journey and, where needed, a customer journey.
- [ ] Gaps and pain points are marked as candidate epics.
- [ ] No AI wrote any persona, quote or journey step.

## For facilitators (speaker notes)

- **Slide 13.** A good test: can you point to a real conversation behind each persona?
- **Slide 14.** Ask: which touch point has no owner? That is a likely epic.
- **Slide 15.** Show one filled journey map from the worked example.

## Where to go next

Continue with [Deck 7: Writing an epic](/library/deck-07-writing-an-epic). The blank forms for this lesson are [Personas and demographics](/library/template-personas) and [Journeys and touch points](/library/template-journeys).
