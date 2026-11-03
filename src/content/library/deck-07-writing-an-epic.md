---
title: "Deck 7: Writing an epic"
description: "The epic template, the difference between a good and a weak epic, three tests, and how to write one by hand."
section: "Teaching deck"
order: 7
level: core
duration: "120 min"
outcomes:
  - "Write an epic with problem, outcome, measure, scope, parts touched, dependencies and risks."
  - "Tell a good epic from a weak one using the three tests."
  - "Defend an epic out loud in two minutes without notes."
  - "Critique another person's epic with specific, kind questions."
resources:
  - atlassian/epics
  - atlassian/product-roadmaps
  - svpg/product-roadmaps
  - svpg/alternative-to-roadmaps
  - gov-uk/service-manual-agile-delivery
  - digital-gov/plain-language
  - google/technical-writing
prerequisites:
  - deck-06-personas-touch-points-journeys
  - epic-standard
---

This lesson covers slides 16 and 17. Slide 16 gives the epic template. Slide 17 shows a weak and a better epic and gives three tests. This is the centre of the program. Everything before it prepares you. Everything after it uses it.

## Why it matters

The epic is the hinge between the human levels and the agent levels. A good epic gives the agents a clear target and tells them what not to touch. A weak epic is a list of tasks in disguise, and it leads to work that looks finished but changes nothing for the customer.

## Key ideas

### The epic template

Slide 16 gives six lines. Write them in this order.

| Part | The question it answers |
|---|---|
| **Problem** | What is wrong or missing, and for whom? |
| **Outcome** | What will be true when we finish? |
| **Measure** | How will we know? One number or one observable fact. |
| **In scope / Out of scope** | The things we will and will not do. |
| **Parts touched** | Which repos, services, integrations and teams? |
| **Dependencies and risks** | What must happen first? What could go wrong? |

The scope line has two halves, in scope and out of scope, and you always write both.

Tips for each part:

- **Problem:** name the person, using your persona. "Commuters" is weaker than "commuters who return a cup at a second café".
- **Outcome:** describe a changed situation, in the present tense, as if it were already true.
- **Measure:** one number or one observable fact. "Ninety percent of returns are accepted at the first café asked" is a number. "A café owner can show the return flow to a new employee in five minutes" is an observable fact.
- **In scope and out of scope:** the out-of-scope list is where you show your judgment. It is the list of things you chose **not** to build.
- **Parts touched:** use the names from your repository map.
- **Dependencies and risks:** include other teams, other epics and external contracts.

### Good epic and weak epic

Slide 17 gives a contrast:

- **Weak:** "Improve onboarding." No who, no measure, no limits.
- **Better:** "New visitors from squeeze pages reach a working account in under 10 minutes."

Weak epics are lists of tasks. Good epics describe a changed situation.

### The three tests

1. **Does it touch more than one part of the product?** If it touches one part, it is probably a milestone.
2. **Can you say what it will NOT do?** If you cannot, the scope is open and will grow.
3. **Can you defend it without notes?** If not, you do not own it yet.

### How to write one live

The speaker note says: write one live on the whiteboard, in the room, by hand. This is on purpose. The epic is meant to cost you effort. When you write one in front of people, the missing facts show.

## A worked example: TrailMug

Here is a full TrailMug epic, written to the template.

**Epic: A commuter can return a cup at any partner café.**

**Problem.** Commuters who borrow a cup at one café cannot reliably return it at another. They keep the cup for days, or they lose the deposit. Evidence: support messages in the last month about late returns; interview notes from five commuters.

**Outcome.** A commuter borrows at any partner café and returns at any other partner café on the same day, with no help from staff.

**Measure.** Ninety percent of cups are returned within two days of borrowing. (The number is the target the owner chose; the team must measure the current figure before the work starts.)

**In scope.** Return flow in the app. Return confirmation in the café tool. Deposit status notification.

**Out of scope.** Cups from other brands. Return by post. Cafés outside the pilot city.

**Parts touched.** trailmug-app, trailmug-svc-returns, trailmug-pay, trailmug-int-email, trailmug-crm.

**Dependencies and risks.** The payment provider's rules for deposit refunds. Partner cafés must agree to the new flow. Risk: staff turnover in cafés means the flow is forgotten.

Now apply the three tests. It touches five parts. The out-of-scope list is clear. The owner can defend it: the problem, the measure, the choice not to handle post returns. The epic passes.

**A weak version:** "Improve cup returns." Run the tests: touches how many parts? Unknown. What will it not do? Unknown. Who is the person? Unknown. The epic fails all three.

## Working with AI agents

The no-AI-epics rule applies fully here. The sequence is:

1. You write the epic by hand.
2. You may ask an agent to **check spelling** and to **list words that a reader might not understand**.
3. You may ask the agent to **ask you questions** about gaps in the epic: "Read this epic and list the questions you would ask the author. Do not answer them." Treat the questions as a prompt for your own thinking. The agent does not decide what to add.
4. You then write the milestones yourself. An agent may break each milestone into issues.

A very good use of an agent is **adversarial reading**: "Act as a partner café owner. List five reasons you would not use this return flow." This does not write the epic. It produces objections you check against real conversations.

## The 2030 Product Development Manager lens

This program trains the **Product Development Manager of 2030**: a person who blends strategy, product, design, brand and marketing, finance, operations, security and engineering, and who treats AI agents as the workforce for lower-level work. The bar is high, and the method is plain. In this lesson:

- **You decide:** the problem, the outcome, the measure, what is out of scope and the order of epics. All by hand.
- **You delegate to agents:** reading your finished epic as an adversary, listing unclear words, and later breaking your milestones into issues.
- **The brief you would write:** "Here is my epic. Act as a partner cafe owner. List five reasons you would not use this flow. Do not rewrite the epic."
- **You verify by:** checking each objection against real conversations, then deciding what, if anything, to change in your own words.
- **Disciplines involved:** strategy (why), product and design (the person), finance (the measure and the risk), engineering (parts touched), operations (dependencies).

## Common mistakes

1. **A task list called an epic.** If the measure is "all tasks done", it is not an epic.
2. **No measure.** Without a number or observable fact, you cannot say you finished.
3. **No out-of-scope list.** The scope grows without limit.
4. **A solution disguised as a problem.** "Build a map" is a solution. "Commuters cannot find a nearby café" is a problem.
5. **A vague person.** "Users" tells you nothing.
6. **An epic that only touches one part.** That is a milestone or an issue.
7. **Writing for the agents, not for the people.** The epic must make sense to a partner and a manager too.

## Practice

1. Take one candidate epic from lesson 6. Write it by hand with all six lines.
2. Run the three tests. Fix the epic until it passes all three.
3. Read your epic to a partner. Ask them to list two questions. Answer without notes.
4. The speaker note asks groups to critique three sample epics in pairs. Write your own sample: one weak epic and one good epic about a product you know. Swap and critique.
5. Rewrite one task list from a past project as an epic. Notice what you had to find out to do it.

## Checklist

- [ ] My epic has problem, outcome, measure, in scope, out of scope, parts touched, and dependencies and risks.
- [ ] The measure is one number or one observable fact.
- [ ] The epic touches more than one part of the product.
- [ ] I can say what it will not do.
- [ ] I can defend it without notes.
- [ ] No AI wrote any word of the epic.

## For facilitators (speaker notes)

- **Slide 16.** Write one live on the whiteboard, in the room, by hand.
- **Slide 17.** Let them critique three sample epics in pairs.

## Where to go next

Continue with [Deck 8: Epics and the roadmap in GitLab](/library/deck-08-epics-and-roadmap-in-gitlab). The written standards are the [epic standard](/library/epic-standard) and the [epic roadmap template](/library/template-epic-roadmap).
