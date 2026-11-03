---
title: "Deck 3: The four levels of work"
description: "Vision, epic, milestone and issue: one idea followed through all four levels, and who owns each level."
section: "Teaching deck"
order: 3
level: foundation
duration: "75 min"
outcomes:
  - "Name the four levels of work and say who owns each one."
  - "Take one idea and write it as a vision, an epic, a milestone and an issue."
  - "Explain why the epic is the hinge between the human levels and the agent levels."
  - "Use GitLab Free issues, milestones and labels to hold the lower levels, and know where epics fit."
resources:
  - atlassian/epics
  - atlassian/user-stories
  - gitlab/milestones
  - gitlab/issues
  - gitlab/labels
  - gitlab/epics
prerequisites:
  - deck-02-agents-strong-and-weak
  - issues-milestones-labels
---

This lesson covers slides 5 and 6. Slide 5 shows the four levels as a table. Slide 6 follows one idea through all four. This is the most reused picture in the whole program: you will see the four levels again in the epic standard, in the roadmap, in the weekly checklist and in the capstone.

## Why it matters

People waste a great deal of time arguing at the wrong level. A team debates the colour of a button (an issue) when nobody agreed what the product is for (the vision). Or a manager writes "launch in Europe" (an epic-sized sentence) as if it were a task and wonders why nothing happens. Naming the level of a piece of work tells you who should decide it, how long it takes and how detailed it should be.

## Key ideas

### The four levels

| Level | What it is | Time frame | Who owns it |
|---|---|---|---|
| **Vision** | Why this product exists | Years | Product lead and CEO |
| **Epic** | A big outcome across many parts | 1 to 3 months | **You, by hand** |
| **Milestone** | A slice that ships, with a date | 1 to 4 weeks | You define it, agents detail it |
| **Issue** | One task | Hours to days | Agents and developers |

The levels go from **why** (vision), to **what** (epic), to **when** (milestone), to **how** (issue). Humans own the top two. The epic is the hinge: above it, the work is about purpose and choice. Below it, the work is about instructions and delivery.

Two notes on the table:

- The deck gives time frames for each level. Treat them as a guide. A small product may have a two-week epic. A large one may have a four-month epic.
- "Agents detail it" for milestones means: you decide the slice and its date, and an agent may propose the list of issues inside it. You still review the list.

### One idea at four levels (DanHup, as a shape)

Slide 6 follows one idea through the levels, using a product called DanHup. The slide is labelled "example only". Its job is to show the **shape** of each level. Your own epics need your own thinking. Here are the four lines from the slide, in the same order:

- **Vision:** every person who needs the product finds it, joins it and gets value without friction.
- **Epic (an imagined one):** "A hiring manager can go from the website to a posted job in one session." It touches the site, the app, the CRM and email.
- **Milestone:** "The website's 'Create Job Posting' button opens the app sign-up, tested, by 14 November."
- **Issue:** "Pass the campaign tag from the website link into the sign-up form."

Notice what only the epic needs: **a human who sees the whole company**. The vision is general. The milestone is one slice. The issue is one small change. The epic is where site, app, CRM and email meet. The program also has a full DanHup worked example, which you will meet later.

## A worked example: TrailMug

Here is the same idea at four levels for TrailMug, the cup-lending product.

- **Vision:** "No one in our city throws away a coffee cup they could have returned."
- **Epic:** "A commuter can borrow a cup at one café and return it at another café, on the same day, without asking anyone for help." It touches the app, the café partner tools, the returns service, the payment deposit and the notification emails.
- **Milestone:** "Returns at a second café: the app shows the nearest partner cafés and a returned cup is marked as returned, tested with three pilot cafés, by 20 March."
- **Issue:** "Show the café name in the return confirmation message."

Now test your understanding. Is "Add a map to the app" a vision, epic, milestone or issue? Answer: it depends on the sentence around it. As a bare task it is an issue. If it says "so commuters can find a café near their route in one tap, measured by 70 percent of first returns happening within two days", it is moving toward an epic or milestone. The level depends on **how far it reaches and how it is measured**, not on its length.

## Using GitLab Free for the four levels

The program teaches the free version of GitLab first. That is on purpose: everyone can follow it without paying.

| Level | Where it lives on GitLab Free | Notes |
|---|---|---|
| Vision | A short text in your planning repo, for example `VISION.md` | Not a GitLab object. It changes rarely. |
| Epic | A file in your planning repo, plus a label such as `epic::returns` on issues | The paid **epic** object is not on the free tier. The file and label do the same job by hand. |
| Milestone | A **milestone** with a start date, a due date and a description | Free on GitLab. |
| Issue | An **issue** with a label, an assignee and a milestone | Free on GitLab. |

**Where epics fit.** GitLab has a built-in epic object with dates, child epics and a roadmap view. It is a paid-plan feature (Premium and above at the time of writing; check the plan page before you rely on it). If your company's own GitLab has it, use it: lesson 8 shows how. If you are on the free tier, you can still do everything in this program. Keep the epic as a Markdown file in the planning repo and tag the issues with a scoped label. You lose the timeline drawing, not the thinking.

## Working with AI agents

- **Vision and epic:** write these yourself. An agent may check your spelling or ask you questions about gaps. It must not write the text, order the epics or decide the scope. The next lesson explains why.
- **Milestone:** you write the goal and the date. An agent may propose the list of issues. You review it, remove what does not belong and add what is missing.
- **Issue:** the agent drafts the text if you give it the milestone. A human approves the issue before work starts. The agent builds the change and opens a merge request. A human reviews and merges.

A useful prompt for the milestone step: "Here is my milestone and its date. List the issues you think are needed. For each issue, give a title, one sentence of description and a done-when line. Do not add anything outside the milestone." The last sentence stops the agent from sneaking in scope.

## The 2030 Product Development Manager lens

This program trains the **Product Development Manager of 2030**: a person who blends strategy, product, design, brand and marketing, finance, operations, security and engineering, and who treats AI agents as the workforce for lower-level work. The bar is high, and the method is plain. In this lesson:

- **You decide:** the vision sentence, the epic outcome and measure, and each milestone's goal and date.
- **You delegate to agents:** the issue list inside a milestone, issue wording, the changes themselves and their tests.
- **The brief you would write:** "Milestone: Returns at a second cafe, tested with three pilot cafes, by 20 March. List issues. For each give title, description, done-when. Flag anything you think is outside the milestone instead of adding it."
- **You verify by:** checking the issue list against the milestone date and scope, then reviewing each merge request against its done-when line.
- **Disciplines involved:** strategy (vision), product and design (epic), delivery and engineering (milestones and issues), finance (dates and budget).
- **On the agent ladder:** **delegate**: a milestone with a date becomes a brief an agent can take whole. When one milestone is split across several agents working at once, you have moved to **orchestrate**.

## Common mistakes

1. **Writing an epic as a list of tasks.** "Add map, add filter, add pin" is three issues.
2. **Writing a milestone without a date.** A milestone without a date is a wish.
3. **Writing an issue that is secretly an epic.** "Make returns work everywhere" has no finish line. Split it.
4. **Mixing levels in one document.** Put each level in its own place so you can change one without breaking another.
5. **Letting the agent move up a level.** An agent that "helpfully" adds a new epic to the roadmap is making the choices you are meant to make.

## Practice

1. Pick a product you know. Write one vision sentence, one epic sentence, one milestone sentence (with a date) and one issue sentence. Keep the same idea in all four.
2. Test your epic with the one-line check: does it touch **more than one** part of the product?
3. Create a free-tier GitLab (or any git host) test project. Make one milestone with a due date. Make three issues with a label. Attach the issues to the milestone.
4. Swap with a partner. For each sentence your partner wrote, say which level you think it is. If you disagree, discuss why.

## Checklist

- [ ] I can name the four levels and give a time frame and an owner for each.
- [ ] I can follow one idea through all four levels.
- [ ] I know the epic is the hinge, and the epic is mine.
- [ ] I know where each level lives on GitLab Free, and where epics fit on paid plans.

## For facilitators (speaker notes)

- **Slide 5.** Show that the levels go from why, to what, to how. Humans own the top two. The epic is the hinge.
- **Slide 6.** Make clear the DanHup text is an example of the shape. Their own epics need their own thinking.

## Where to go next

Continue with [Deck 4: The no-AI-epics rule](/library/deck-04-no-ai-epics-rule). For the written standard, read the [epic standard](/library/epic-standard) and the [roadmap standard](/library/roadmap-standard).
