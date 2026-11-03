---
title: "Deck 4: The no-AI-epics rule"
description: "The rule that people write epics and roadmaps, the three reasons behind it, and the list of what AI may and may not do."
section: "Teaching deck"
order: 4
level: foundation
duration: "60 min"
outcomes:
  - "State the no-AI-epics rule exactly, including the part about personas, journey steps and quotes."
  - "Give the three reasons for the rule."
  - "Sort ten example tasks into AI may and AI may not."
  - "Write an honest AI-use note for your own work."
resources:
  - anthropic/prompt-engineering-overview
  - anthropic/building-effective-agents
  - atlassian/epics
  - digital-gov/plain-language
  - google/technical-writing
prerequisites:
  - deck-03-four-levels-of-work
  - disclose-ai-use
---

This lesson covers slides 8 and 9. Slide 8 states the rule and its three reasons. Slide 9 shows what AI may and may not do. The rule is firm, and it is the one rule of the program that does not bend. It is also easy to misunderstand, so this lesson is careful about what it says and what it does not say.

## Why it matters

An epic is the document you hand to the agents. If the epic is wrong, the agents build the wrong thing with great speed. The rule exists so that the person who owns the epic really understands it, and so that the epic carries a human decision that can be defended.

The rule is also about learning. In this program you grow by writing the epic, struggling with the gaps, going back to customers and fixing the text. If an agent writes it for you, you skip that learning and you also skip the thinking that finds the mistakes.

## Key ideas

### The rule

Slide 8 says it in four lines:

- You **never** ask an AI agent to write, rewrite or "improve" your epics or roadmap.
- You also never let AI invent personas, journey steps or customer quotes.
- Reason 1: you learn the whole product only by writing it yourself.
- Reason 2: you must defend the epic out loud, without notes.
- Reason 3: the epic is what you hand to the agents. It must be right.

The word "improve" matters. People often think the rule only bans AI writing from nothing. It also bans "polish this epic for me", "make this roadmap better" and "reorder my epics". Each of those hands the decision to a system that has not met your customer.

### The three reasons, explained

**Reason 1: you learn the product by writing it.** Writing forces you to choose words. When you cannot decide whether the "customer" is the person who pays or the person who uses the product, the blank page tells you. A pasted paragraph hides the question.

**Reason 2: you must defend the epic out loud.** In the Week 4 review and in the oral review you present and answer questions with no notes. If you did not write it, you will freeze at the first "why?".

**Reason 3: the epic is the input to everything below it.** Every milestone and every issue grows from it. A small error in the epic becomes a hundred wrong tasks.

### The tone of the rule

The facilitator's note says: be firm but kind. Honest AI use for the allowed list is fine. **Hidden use is the problem.** The program does not punish asking an AI to explain a word. It does ask you to say that you did, in a short disclosure note. The page on [disclosing AI use](/library/disclose-ai-use) shows the format.

### What AI may and may not do

| AI may | AI may not |
|---|---|
| Explain a word or concept | Write epic text or roadmap |
| Check spelling after you write | Invent personas or quotes |
| Break **your** milestone into issues | Order your epics |
| Summarise a long document | Fill in your workbooks |
| Answer a fact question about code | Decide what is in or out of scope |

Read the table as pairs. The left column helps you do your own work faster. The right column does your work for you.

A quick way to remember: **AI may help you understand and check. AI may not decide or invent.**

## A worked example: TrailMug

Maya is a TrailMug user. You are writing the persona for her.

**Wrong use of AI:** "Write a persona for a commuter who uses reusable cups. Include a quote." The result sounds real. It is invented. If it goes into your epic, you have built a feature for a person nobody ever met.

**Right use of AI, step 1:** You interview five commuters. You write notes. You write the persona yourself from those notes, with the evidence listed next to each claim.

**Right use of AI, step 2:** After you wrote it, you ask the AI: "Check this persona text for spelling mistakes. Do not change meaning." You read the suggested changes and accept the ones that are correct.

**Right use of AI, step 3 (milestone):** You wrote the milestone "Returns at a second café, by 20 March". You ask the AI to list the issues it thinks are needed. You remove two that do not belong and add one it missed.

The difference is who decided. In each right use, a human decided and the AI helped with an editing or breaking-down job.

## Working with AI agents

- **Always say before you ask:** "Did I already decide this?" If yes, AI may format, check or translate it. If no, decide first.
- **Give it your text, not a request to invent.** "Here is my epic. List any words that are unclear" is allowed. "Write an epic about returns" is not.
- **Keep a short disclosure note.** One sentence per use: what you asked, which tool, what you changed.
- **Written tests and oral reviews:** no AI at all. In a practical task, AI only where the task says so.

Facilitators often get one new question: "What if the agent finds a mistake I did not see?" That is allowed. Treat the finding as a question. Check it against real evidence. Then you decide what to change.

## The 2030 Product Development Manager lens

This program trains the **Product Development Manager of 2030**: a person who blends strategy, product, design, brand and marketing, finance, operations, security and engineering, and who treats AI agents as the workforce for lower-level work. The bar is high, and the method is plain. In this lesson:

- **You decide:** every epic, every roadmap order, every persona and every scope line. These stay human, always.
- **You delegate to agents:** editing and checking jobs after you decided: spelling, plain-language review, summaries of long documents, fact questions about code, and the issue list for your milestone.
- **The brief you would write:** "Here is my persona text, written from five interviews. Check spelling and grammar only. Do not change meaning or add detail. Show each change."
- **You verify by:** reading every change the agent suggests, rejecting any that add a fact, and writing a one-line AI-use note.
- **Disciplines involved:** research and design (evidence for personas), communication (plain writing), leadership (owning and defending a decision).
- **On the agent ladder:** **govern** starts here in its simplest form. The no-AI-epics rule is a written policy about who decides, and the disclosure note is its evidence. Later rungs add hooks and gates that enforce policy automatically.

## Common mistakes

1. **Asking for "just a first draft".** The first draft is where the thinking happens. It is the part you must do.
2. **Using AI to make a persona "more realistic".** It adds invented detail that sounds like evidence.
3. **Hiding AI use because it is allowed.** Allowed use should be disclosed. Hiding it is the failure.
4. **Letting AI reorder the roadmap "just to see".** The order is a choice about priorities. Seeing its order will bias yours.
5. **Using AI to fill in a workbook.** The workbooks are your evidence of learning.

## Practice

1. Slide 9 asks each learner to add one new example to each column. Write your own: one example of what AI may do, and one that it may not.
2. Write a three-line disclosure note for something you did with AI this week.
3. Take a short paragraph you wrote. Use an AI only to check spelling. Compare the result with your original line by line. Which changes did you accept, and why?
4. In pairs, role-play a coach asking: "Why did you put this epic before that one?" Answer without notes.

## Checklist

- [ ] I can state the rule, including personas, journey steps and quotes.
- [ ] I can give the three reasons.
- [ ] I can sort ten tasks into AI may and AI may not.
- [ ] I know that hidden use is the problem, not honest use.
- [ ] I know that written tests and oral reviews allow no AI.

## For facilitators (speaker notes)

- **Slide 8.** Be firm but kind. Honest AI use for the allowed list is fine. Hidden use is the problem.
- **Slide 9.** Ask the group to give one new example for each column.

## Where to go next

Continue with [Deck 5: Six layers of a product](/library/deck-05-six-layers-of-a-product). The rule is also written as [People write epics](/library/people-write-epics) in the standards.
