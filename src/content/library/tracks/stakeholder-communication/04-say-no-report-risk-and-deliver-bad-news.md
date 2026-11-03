---
title: "Say no, report risk and deliver bad news"
description: "Handle requests that do not fit, turn risks into written statements with owners, deliver bad news early and plainly, and tell people honestly where AI agents were used."
section: "Stakeholder communication"
order: 4
track: "stakeholder-communication"
level: "core"
duration: "2.5 hours"
outcomes:
  - "Say no, or not now, in writing, with a reason and an alternative"
  - "Write risk statements with likelihood, cost, response and owner"
  - "Deliver bad news early, plainly and with a plan"
  - "Write a short, honest statement of how you use AI agents"
resources:
  - "youtube-nngroup/ux-risk-statements"
  - "youtube-nngroup/collaborating-with-stakeholders"
  - "github/open-source-guides-best-practices"
  - "gitlab/handbook-communication"
  - "atlassian/project-dependencies"
prerequisites:
  - "week-4-defend-the-roadmap"
  - "disclose-ai-use"
  - "fix-forward"
updated: 2026-11-03
---

**Supports:** Developer, weeks 4 to 6, and the Master Developer review. **Time:** about two and a half hours.

## 1. Why this matters

Sooner or later you will have to tell someone no, or that a date has slipped, or that something broke. How you do it decides whether they trust you the next time. People do not expect a perfect product. They expect to hear the truth early, with a plan.

This is also where AI use meets honesty. Customers, partners and regulators ask whether AI was involved in building a product, and what a person checked. The answer is better when it is already written, plain and true.

A Product Development Manager (PDM) carries these conversations because nobody else can. An agent can draft a polite refusal. It cannot know whether the relationship can bear it. A person has to decide what to say, and own it.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Whether to say no or not now, which risks matter, what to tell whom and when, what to say about AI | Drafting wording from your facts; checking tone; listing risks you may have missed; keeping the risk list tidy | The message is true, complete and kind; it names an owner and a date; it matches the decision log | Legal and privacy (what must be disclosed), finance (cost of a change), sales and support (what customers will hear), engineering (what is feasible) |

## 2. Key ideas

### A good no has four parts

1. **The decision**, in the first sentence: "We will not build X in this cycle."
2. **The reason**, in plain words and tied to the roadmap: "Because it does not serve the goal of letting cafés join alone, and nobody we interviewed asked for it."
3. **What you will do instead**, or when you will look again: "I added it to the later list and will review it after the trial."
4. **What would change your mind**: "If three cafés ask for it, I will move it up."

A no with an alternative and a way back is often accepted. A no with no reason is not. Write it down, and file it in the not-doing list and the decision log. GitHub's guide for maintainers talks about setting expectations and saying no kindly, and the same habit applies to a product.

### Trade-offs are visible

When someone asks for a new thing, show the trade-off: "I can add this, and then X moves one cycle later." People often withdraw a request when they see the price. When they do not, you have a decision to make together.

### Risk statements

NN/g's video on risk statements describes stating a risk so that business people can weigh it. In the Dojo, a risk statement has:

- **What could happen**, in one sentence.
- **Likelihood**: low, medium or high, with the reason.
- **Cost**: what it would mean in money, time or trust.
- **Response**: what you will do to reduce it or handle it.
- **Owner and date.**

Atlassian's page on project dependencies helps you find risks that are really dependencies: another team's delivery, a legal review, a supplier. Keep a risk list in `roadmap/risks.md`. Review it weekly. Close a risk when it is gone or when it has happened and become a decision.

### Bad news

The rules are few.

- **Early.** The day you know, not the day it is due.
- **Plain.** The first sentence says what happened. "The sign-up page will not be ready on Friday."
- **Specific.** What, how much, how long, who is affected.
- **Owned.** "I underestimated the review time." Not "there were delays".
- **With a plan.** What you will do, by when, and what you need.
- **In writing.** And, for important people, in person first.

Never hide a problem in a long report. Never blame a person or an agent. If an agent's mistake caused it, say that your review should have caught it, and what you changed so it will.

### Fix forward

If something went wrong in what you shipped, say so, and say you will fix forward: you will make the correction and add the check that catches that class of problem. Rolling back shipped work and hoping nobody noticed is not the Dojo way. The only reasons to take something out are active harm, such as a leaked secret, data loss in progress or an outage that affects customers. Even then the follow-up is the fix that puts it back.

### Be honest about AI

A short written statement on AI use answers most questions before they are asked. It says:

- Where AI agents are used in your work (drafting, building, checking).
- What a person always does (decides, reviews, approves, sends).
- What AI never does (writes the roadmap, sends external messages alone, handles secrets).
- How a person can ask a question or raise a concern.

Keep it short, true and up to date. Do not oversell ("fully autonomous") or undersell ("we do not use AI") either way. GitLab's public handbook shows how an organisation can write its habits down openly, and the same openness helps here.

## 3. Step by step

### Step 1: Collect the requests you have not answered

List every request, idea or complaint waiting for your answer. Include the ones you hoped would go away.

### Step 2: Decide each

For each: yes now, yes later or no. Use the roadmap and the not-doing list. Write the reason.

### Step 3: Write the answers

For each no or later, write the four parts. Show the trade-off where there is one.

### Step 4: Write the risk list

List the top five to eight risks with the five parts. Put owners and dates. Link them to epics.

### Step 5: Write one bad-news message

Pick a real or realistic slip. Write the message: what, how much, who, why, plan, need. Ask someone to read it.

### Step 6: Write the AI statement

Write the four parts, under 200 words. Put it in the repo and, if you have a site, on a page people can find.

### Step 7: Review weekly

Look at the risk list and the requests every week. Close, escalate or update.

## 4. Worked example: TrailMug

TrailMug is fictional.

**A no.** A café owner asks for loyalty points.

> Hello Leo. Thank you for the idea. We will not build loyalty points this quarter. Our first goal is that café owners can join on their own and that returns take under 10 seconds, and nobody we have spoken to has asked for points. I have put it on our "later" list. If three or more cafés ask for it, I will move it up and tell you. Maya, our first commuter, told us her main wish is speed, so that is where we are putting our time.

**A trade-off.** The mentor suggests adding event catering. The founder answers: "I can add it. It would push the café report back by about three weeks. Do you want that trade?" The mentor withdrew the request.

**A risk statement.**

> **Risk 3.** The cup supplier could delay by two or more weeks. Likelihood: medium, because the supplier missed one delivery last year. Cost: the two-café trial would start late. Response: ask two backup suppliers for quotes and lead times by 2026-11-20. Owner: founder. Review: weekly.

**Bad news.** The sign-up page will miss Friday.

> **Subject: Sign-up page will be ready on Wednesday, not Friday.**
> The café sign-up page will not be ready on Friday 13 November. It will be ready on Wednesday 18 November. The form works, but on a small phone screen the postcode field is cut off, and two testers could not finish. I underestimated the time to test on small screens. I have added that check to our definition of done. I need nothing from you. If anything else changes, I will write on the same day.

**What the review of an agent's draft found.** The agent's draft opened with "Unfortunately there have been some minor delays". The founder replaced the first line with the date and the cause, and removed "minor". She also removed "our team worked hard" because she was the only person and the sentence implied otherwise.

**AI statement (excerpt):**

> TrailMug is built by one person with help from AI coding assistants. The assistants write code and draft text under written instructions. A person writes the roadmap, decides what to build, runs every acceptance check on the real product and reads every message before it is sent. No AI sends messages to customers or cafés. If you have a question or concern, write to the contact on this page.

## 5. Working with AI agents on this

**Delegate:**

- **Wording from facts.** "Draft a reply that says no, with these four parts. Use only these facts."
- **Tone check.** "Read this message as a worried café owner. Which sentences might cause alarm? Do not rewrite."
- **Risk gap search.** "From this roadmap and dependency list, name risks that are not on my list. Give each as a question."
- **Keeping the list.** "Update the status column in `roadmap/risks.md` from the open issues. Do not change likelihood, cost or response."
- **Checking the AI statement** against what the repo shows. "List any claim in this statement that the repo does not support."

**Do yourself:**

- Decide yes, later or no.
- Judge likelihood and cost.
- Choose when and how to deliver bad news, in person or in writing.
- Own the apology.
- Decide what the AI statement says, and keep it true.

**A brief you can adapt:**

```text
I have to tell a café owner "not now" to a feature request. Facts:
the goal this quarter, the reason, where it is recorded, what would
change my mind. Draft a reply of under 150 words with four parts:
decision first, reason, what happens instead, what would change my
mind. Use only these facts. No apologies beyond one sentence, no
adjectives like "unfortunately" or "exciting". Then list any sentence
that goes beyond my facts.
```

**How to check the output.** Read as the recipient. Is the decision in the first line? Is every statement true? Is there a promise you did not intend? Remove softeners that blur the message.

**Never delegate** the decision to apologise, to admit a failure or to promise a date. These are commitments, and they belong to a person.

**Where this sits on the ladder.** The agent skill of a manager climbs four rungs: **use** one agent, **delegate** whole tasks with a brief, **orchestrate** several sessions, and **govern** them with written policy, hooks and gates. This lesson is mostly about **govern**. The AI statement is a public policy, the risk list is a standing control and the rule "a person reads and sends every external message" is a gate you can enforce with tooling. When many agents work for you, these written rules are what keep them safe. The agent orchestration track (`/library/tracks/agent-orchestration/`) covers the upper rungs.

**Disclose.** At the foot of messages where an agent helped draft: "Drafted with AI help; facts checked by me." Keep the public AI statement current.

## 6. Common mistakes

- **A no without a reason or a way back.**
- **Saying yes to avoid conflict,** then missing the date.
- **Hiding trade-offs.** Show what moves.
- **Risk lists nobody reads.** Review weekly.
- **Bad news at the deadline.** Tell people the day you know.
- **Soft language** that hides the fact: "minor delays", "some challenges".
- **Blaming a person or an agent.** You are accountable.
- **Rolling back to hide a mistake.** Fix forward and add the gate.
- **Overselling or hiding AI use.** Be plain and accurate.
- **Letting an agent send the message.**

## 7. Practice: a no, a risk list, a slip and an AI statement

**Deliverable:** in your git repo:

1. `stakeholders/replies/`: at least two written answers (one no, one not-now) with the four parts, and a trade-off in one.
2. `roadmap/risks.md`: five to eight risks, each with what could happen, likelihood and reason, cost, response, owner and date.
3. `stakeholders/bad-news-example.md`: a message about a real or realistic slip, with what, how much, who, why, plan and need.
4. `ai-statement.md`: your statement on AI use, under 200 words.
5. A short note on what you changed after one person read your drafts.
6. Your AI-use line.

Commit with a message such as `Add replies, risk list, bad-news message and AI statement`.

**Check:** give the bad-news message to someone who would be affected. Ask her: "What do you think happened, what happens next and what do you need to do?" If she cannot say all three, rewrite.

**Stretch:** pick one risk from your list that has already happened or is about to. Write the fix-forward plan, and the gate that would have caught it.

## 8. Checklist

- [ ] Every no has a decision, a reason, an alternative and a way back.
- [ ] Trade-offs are shown when someone asks for more.
- [ ] Each risk has likelihood, cost, response, owner and date.
- [ ] The risk list is reviewed weekly.
- [ ] Bad news goes out the day I know, in plain words.
- [ ] I did not blame a person or an agent.
- [ ] Mistakes are fixed forward, with a new gate.
- [ ] The AI statement is true, short and public.
- [ ] No agent sent a message alone.
- [ ] I recorded my AI use.

## 9. Further learning

NN/g's videos on risk statements and on collaborating with stakeholders show how to frame risk and partnership for business readers. GitHub's guide to best practices for maintainers has advice on setting expectations and saying no kindly. GitLab's public handbook shows an open, written style of communication, and Atlassian's page on project dependencies helps you find the risks hidden in them. Next in the product group, the brand, website and mockups track turns what you have learned into what people will see.
