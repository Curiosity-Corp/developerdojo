---
title: "AI use and disclosure in the program"
description: "The one rule about AI in the program, what AI may and may not do in each week, how we check that the work is yours, and what an honest disclosure line looks like."
section: "Program guide"
order: 5
level: foundation
duration: "40 min"
outcomes:
  - "State the no-AI-epics rule and the four reasons behind it."
  - "Say what AI may do and may not do, week by week."
  - "Write a disclosure line for each kind of AI help."
  - "Explain how a Sensei checks that the thinking is yours."
resources:
  - anthropic/building-effective-agents
  - anthropic/effective-context-engineering
  - nist/ai-risk-management-framework
  - owasp/top-10-for-llm-applications
  - openai/safety-best-practices
prerequisites:
  - program-your-work-in-git
---

AI agents are part of the program. You will use them every week. There is one rule that does not bend, and one habit that keeps you honest. This page puts both in one place.

## The rule

> **You never ask an AI agent to write, rewrite or "improve" your epics, your product roadmap, or your persona and journey conclusions. You write them yourself, in your own words and with your own thinking.**

The full rule, with examples, is in [People write epics](/library/people-write-epics). This page applies it to the weeks.

## Why the rule exists

1. **Agents see only what you show them.** A product epic depends on things no prompt contains: what a customer said last week, what sales promised, what money is available, what another team is planning.
2. **Agents agree too easily.** An agent will produce a smooth, confident roadmap for any idea, good or bad. It will not tell you the epic is the wrong one. Planning is where wrong ideas must be stopped.
3. **You learn by writing.** Writing an epic forces you to decide what is in, what is out and what you will not do. If an agent writes it, you skip the learning and you cannot defend it.
4. **The epic is what you hand to the agents.** Good milestones and issues come from a clear epic. If the epic is generated, the whole chain stands on sand.

## What AI may do, and may not

| AI may | AI may not |
|---|---|
| Explain a word or idea you do not know (then you write in your own words) | Write or rewrite an epic title, description, scope, success measure or roadmap |
| Check spelling and grammar after you finish writing | Invent personas, journey steps or customer quotes |
| Break a milestone that you wrote into issues, and build them | Decide the order of epics on the roadmap |
| Summarise a long document so you read the original faster | Fill in your workbooks for you |
| Search code and documents to answer a fact question, which you then check | Approve its own work |

## Week by week

| Week | A good use of AI | Never |
|---|---|---|
| 1 | List the repositories in a group; read READMEs | Decide what ties into what; name owners |
| 2 | Summarise interview notes you took | Write the personas or invent quotes |
| 3 | Ask you questions about an epic you wrote | Write or reorder the epics |
| 4 | Break approved milestones into issues; draft a release note | Decide scope; approve its own issues |
| 5 | Check contrast and spelling; draft alternative page text for you to choose from | Pick the name or write the brand promise for you |
| 6 | Check links and catalogue consistency | Mark a row FOUND without evidence |
| Platform weeks | Read licence files and quote them; draft manifests from a design you chose | Choose the licence; change a cluster directly; hold secrets |

## How we check

- **Your work is in git with full history.** See [your files and git](/library/program-your-work-in-git).
- **Every week you explain each epic aloud, without notes,** to your Sensei. If you cannot, it is not yet your epic.
- **You disclose.** Honest use of AI for the allowed list is fine. **Hiding AI use is a bigger problem than the use itself.**

## How to disclose

Write one to three lines in the merge request or in your weekly note.

| Kind of help | Example disclosure line |
|---|---|
| Explanation | "Asked an assistant to explain 'touch point'. Wrote my own definition." |
| Spelling | "Spell-checked the persona file with an assistant. No wording changed by it." |
| Summary | "An assistant summarised the support export. I read the original and chose the quotes." |
| Issues | "An assistant broke milestone 1.1 into six issues. I removed one that added scope." |
| Search | "An agent listed repositories. I checked three by opening them." |

The full template is on [Disclose AI use](/library/disclose-ai-use). For a deeper course see [Disclosure and ownership](/library/tracks/working-with-ai-agents/10-disclosure-and-ownership).

## Steps for every piece of work

1. Decide first. Write your own draft.
2. Use AI only for the allowed list.
3. Check what it produced against the evidence.
4. Write the disclosure line.
5. Commit with a message that says what you did.

## Common mistakes

1. **Asking for "just a first draft" of an epic.** That is the rule broken.
2. **A smooth text with no source.** Check the evidence.
3. **Not disclosing small help.** Say it anyway.
4. **Pasting a secret into a prompt.** Never.
5. **Believing an agent that agrees with you.** Ask it to find the weakest part.

## Practice

1. Take one sentence from your own work and write its disclosure line.
2. Rewrite two "never" items from the week table as questions you could ask an agent instead.
3. Explain to a friend why a generated roadmap is a risk, in 30 seconds.

## Checklist

- [ ] I know the rule and the four reasons.
- [ ] I can say what AI may do this week.
- [ ] My weekly note has a disclosure line.
- [ ] I can explain each of my epics without notes.

## The 2030 Product Development Manager lens

- **You decide:** what AI is used for, and what you check.
- **You delegate to agents:** the allowed list, with a brief that sets scope and a done-when line.
- **A sample brief:** "Here is my milestone. Break it into issues of at most two days. For each, write a done-when line. Do not add scope and do not change my wording of the goal."
- **You verify by:** reading each issue against the milestone and removing any that adds scope.
- **Disciplines involved:** product, security, ethics and engineering.
- **On the agent ladder:** the rule sits at **govern**. It draws the line between what you may **delegate** and what stays human.

## Further learning

Next: [assessment and the pass level](/library/program-assessment-and-pass-level). Read [AI agents, strong and weak](/library/deck-02-agents-strong-and-weak) and [the no-AI-epics rule](/library/deck-04-no-ai-epics-rule).
