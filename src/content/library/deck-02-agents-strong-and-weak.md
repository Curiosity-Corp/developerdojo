---
title: "Deck 2: Where agents are strong and weak"
description: "A plain comparison of what AI agents do well and badly, and why an agent fails at the whole-product epic."
section: "Teaching deck"
order: 2
level: foundation
duration: "60 min"
outcomes:
  - "List five things agents do well and five things they do badly."
  - "Explain in your own words why an agent writes a smooth roadmap for a bad idea."
  - "Decide, for a given task, whether it is agent work or human work."
resources:
  - anthropic/building-effective-agents
  - anthropic/claude-code-overview
  - anthropic/prompt-engineering-overview
  - atlassian/user-stories
  - deeplearning-ai/courses
prerequisites:
  - deck-01-the-humans-job
  - people-write-epics
---

This lesson covers slides 4 and 7 of the deck: the two-column comparison of agent strengths and weaknesses, and the five reasons an agent fails at an epic. Slide 4 gives the idea in ten short lines. Slide 7 explains why. Together they answer the question every new Master Developer asks: "If the agent is so good, why can't it write the roadmap?"

## Why it matters

If you do not know where an agent is strong, you will either waste its time on work you should do yourself, or you will hand it work it cannot do and trust the result. Both mistakes cost time. The second one also costs trust, because the output looks fine.

## Key ideas

### Where agents are strong

The deck lists five strengths. Each one has a pattern: **clear input and a clear finish line**.

| Strength | What it looks like |
|---|---|
| Turn a clear milestone into issues | You write the milestone. The agent proposes a list of small tasks for it. |
| Write and test code | You give a precise issue. The agent writes the change and the tests. |
| Search a repo for facts | "Where is the deposit amount set?" The agent finds the file and line. |
| Follow a template exactly | You give the epic template or the issue template. The agent fills the same fields every time. |
| Work fast and never tire | Ten small issues at once, at night, without complaint. |

The speaker note says it well: strong means a clear input and a clear finish line.

### Where agents are weak

The five weaknesses have a different pattern: they **need outside facts and judgment**.

| Weakness | Why it happens |
|---|---|
| Knowing what the customer said last week | The conversation is not in the repo or in the prompt. |
| Saying "this idea is wrong" | Agents tend to agree with the person asking. |
| Seeing 6 systems and 4 teams at once | An agent works best inside one repo or one task. |
| Choosing what **not** to build | Choosing needs priorities, and priorities are human. |
| Owning a decision and defending it | An agent cannot be asked "why?" three months later and answer from experience. |

### Why agents fail at epics: five reasons

Slide 7 gives five reasons. They are worth learning as a list, because you will use them to explain the rule to others.

1. **Epics need facts that are not in any prompt.** Customers, sales promises, money, other teams. A prompt can only hold what you type into it.
2. **Agents agree too easily.** They write a smooth roadmap for a bad idea. The smoothness is the danger. A weak idea with a polished plan looks like a strong idea.
3. **An epic crosses repos, domains and teams.** Agents work best inside one.
4. **An epic is a choice.** A choice needs an owner who can be asked "why?".
5. **If the epic is weak, every milestone and issue below it is weak.** The agents will build the wrong thing, quickly and well.

The fifth reason is the most expensive. The levels of work depend on each other. A mistake at the top is copied into every level below, and agents are fast, so the copy is fast.

## A worked example: TrailMug

TrailMug is the fictional cup-lending product used on this site. The owner wants a new feature: "Let cafés print their own QR code for cup returns."

**Task A.** "Write a function that checks whether a cup id is valid."
- Clear input: a cup id format. Clear finish line: tests pass.
- Verdict: **agent work.**

**Task B.** "Decide whether TrailMug should let cafés print their own QR codes."
- Needs facts: Leo, who owns a partner café, said he would not use the feature if staff had to scan. The payment provider requires the deposit to be tied to a registered café. The monthly fee promise to partners did not mention printing.
- None of those facts is in any repo.
- Verdict: **human work.**

**Task C.** "Break the milestone 'Café QR codes, tested, by 14 December' into issues."
- The human wrote the milestone and the date. The agent works from that.
- Verdict: **agent work, after a human decision.**

Notice that tasks A and C are agent work **only because** task B was done first, by a person.

## Working with AI agents

A practical habit: before you hand any task to an agent, say out loud: "What is the input, and what is the finish line?" If you cannot answer both, the task is not ready for an agent. Write the missing part yourself first.

Another habit: when an agent agrees with you, ask it for the three strongest reasons the idea might be wrong. This is not a replacement for human judgment, and the agent's list will be generic. It still reminds you to look for the other side. The decision stays yours.

Never treat a confident agent answer as a fact about your customers. It is a guess in good grammar.

## The 2030 Product Development Manager lens

This program trains the **Product Development Manager of 2030**: a person who blends strategy, product, design, brand and marketing, finance, operations, security and engineering, and who treats AI agents as the workforce for lower-level work. The bar is high, and the method is plain. In this lesson:

- **You decide:** whether each task is agent work, human work or agent work after a human decision, and which facts an agent lacks.
- **You delegate to agents:** clear tasks with a clear input and finish line: issue lists, code and tests, repo searches, template filling.
- **The brief you would write:** "Search this repository and tell me every place the deposit amount is set. Give file names and line numbers. Do not change anything."
- **You verify by:** opening the files the agent named, checking at least two of its claims yourself, and asking the agent for the strongest reason the idea might be wrong, then deciding yourself.
- **Disciplines involved:** product and customer research (the facts), engineering (agent output), finance and legal (promises and contracts).

## Common mistakes

1. **Handing over a vague goal.** "Improve onboarding" has no finish line. The agent will invent one.
2. **Thinking a long, detailed roadmap is a good roadmap.** Length is not evidence.
3. **Using the agent as a second opinion on strategy.** It will mirror your view. Ask real people instead.
4. **Assuming "the agent said it works" means "it is the right thing".** Working and right are different questions.
5. **Blaming the agent when the epic was weak.** The epic was yours.

## Practice

1. Take the two columns on slide 4. For each of the ten lines, write one example from a product you know.
2. Take the story in the speaker note: an agent writes a nice roadmap with no mention of the payment provider contract. In pairs, list five other things such a roadmap might miss. Examples: a data protection promise, a partner's contract, a team on holiday, a competitor, a rule at the bank.
3. Pick three tasks from your own work this week. Mark each as agent work, human work, or agent work after a human decision. Explain your choice in one sentence.

## Checklist

- [ ] I can list five agent strengths and five weaknesses without looking.
- [ ] I can give the five reasons an agent fails at epics.
- [ ] I can sort a task into agent work, human work or agent work after a human decision.
- [ ] I know that a smooth plan is not the same as a good plan.

## For facilitators (speaker notes)

- **Slide 4.** Walk across the two columns. Strong equals clear input and clear finish line. Weak equals needs outside facts and judgment.
- **Slide 7.** Give a real story: an agent produces a nice roadmap with no mention of the payment provider contract. Ask the group what is missing. Let them name at least five gaps before you give your own.

## Where to go next

Continue with [Deck 3: The four levels of work](/library/deck-03-four-levels-of-work). To revisit the rule behind this lesson, read [People write epics](/library/people-write-epics).
