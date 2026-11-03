---
title: "How AI agents work"
description: "A plain-words model of what a language model is, what turns it into an agent, and why it can sound sure while being wrong."
section: "Working with AI agents"
order: 1
track: "working-with-ai-agents"
level: "foundation"
duration: "60 min"
outcomes:
  - "Explain what a language model, a token, a context window and a tool are"
  - "Describe the loop that turns a model into an agent"
  - "List four ways agents fail and one check for each"
  - "Decide which jobs to hand to an agent and which to keep"
prerequisites:
  - "the-way-five-rules"
resources:
  - "youtube-andrej-karpathy/intro-to-large-language-models"
  - "anthropic/building-effective-agents"
  - "openai/practical-guide-to-building-agents"
  - "anthropic/claude-code-overview"
  - "microsoft/ai-agents-for-beginners"
  - "google/machine-learning-crash-course"
updated: 2026-11-03
---

This is lesson 1 of the track. It supports Developer week 4, where you first work with AI agents in practice, and it prepares you for the Master Developer module on agent orchestration. You do not need to write code to follow it.

## 1. Why this matters

If you own a product, you will use AI agents. They will draft tests, write code, summarise customer notes and fix small bugs. The people who do well with agents are not the ones who trust them most. They are the ones who understand them well enough to know when to trust them.

You do not need a degree in machine learning. You need a correct mental picture, in plain words. With the right picture, three things become easy. You know why a good prompt helps. You know why an agent can be confidently wrong. And you know which jobs it should never own.

The rest of the track builds on this lesson. Prompting, context, review, evaluation and safety all follow from how these systems work.

The 2030 Product Development Manager is not a coder who happens to use AI. They decide what to build and why, and they treat agents as the workforce for lower-level work. This lesson gives you the model you need to direct that workforce well.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Which jobs go to agents and which stay with people; whether a result is trustworthy enough to act on | Explaining code, reading documents, drafting, trying variations | Checking one claim in every answer; running what can be run | Engineering (what is feasible), security (what is risky), operations (who runs it) |

## 2. Key ideas, explained

### A language model predicts text

A **language model** is a program that has learned patterns from a very large amount of text. Given some text, it predicts what text should come next. It does this one small piece at a time. Each piece is called a **token**. A token is roughly a short word or part of a word. The word "cup" is one token. A long word may be several.

That is the whole trick. When you ask a model a question, it does not look up a fact in a database. It writes the most likely continuation of your text, shaped by what it learned in training and by the way it was tuned afterwards to be helpful and safe.

This explains two things that surprise beginners.

1. **Models are fluent.** They write smooth sentences because smooth sentences are what they learned.
2. **Models can be wrong and sound sure.** A smooth, confident sentence is likely whether or not it is true. People call a false but fluent answer a **hallucination**. The model is not lying. It has no feeling of "I do not know" unless it learned to say so in that kind of situation.

The talk [Intro to Large Language Models](https://www.youtube.com/watch?v=zjkBMFhNj_g) by Andrej Karpathy explains this in about one hour. It is the best single video to watch before you go on.

### The context window is the model's desk

A model can only work with the text in front of it right now. That text is the **context**. It includes your message, the earlier messages in the chat, any files or notes you attached, and the instructions the tool added. The limit on how much fits is the **context window**. Think of it as a desk. Whatever is on the desk, the model can use. Whatever is not on the desk, it cannot see, even if you told it yesterday.

Three consequences follow:

- The model does not remember you between sessions unless the tool saves notes and puts them back on the desk.
- A longer desk is not always better. A desk piled with old, irrelevant papers makes the work worse.
- You are responsible for what is on the desk. Lesson 3 covers this in detail.

### A tool lets the model act

On its own, a model only produces text. A **tool** is a function the model can ask the system to run. Examples: read a file, run a command, search the web, call an API, edit a file. The model writes a request such as "read the file `signup.js`". The surrounding program runs it and puts the result back on the desk. The model then writes the next step.

Tools are what give a model hands. They are also where the risk is. A model that can only talk can only mislead you. A model that can run commands can delete files.

### An agent is a model in a loop

An **AI agent** is a model that uses tools in a loop to reach a goal. The loop looks like this:

```text
goal from a person
   |
   v
think: what is the next step?  --->  act: call a tool (read, edit, run, search)
   ^                                        |
   |                                        v
   +--------  look at the result  <---------+
   (repeat until done, stuck, or stopped by a person)
```

The engineering article [Building effective agents](https://www.anthropic.com/research/building-effective-agents) makes a helpful distinction. A **workflow** is a fixed path that you design, with the model filling in steps. An **agent** chooses its own path. Workflows are more predictable. Agents are more flexible. The article's advice is to use the simplest design that works. The same advice appears in OpenAI's [practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf).

A coding agent such as the one described in the [Claude Code overview](https://code.claude.com/docs/en/overview) is this loop pointed at a code repository. It reads files, plans, edits, runs the tests, reads the failures and tries again. You give the goal. It does the steps.

### What agents are good at, and what they are not

| Agents are good at | Agents are weak at |
|---|---|
| Clear, small, well-described tasks | Knowing your customer, market or business |
| Boilerplate, tests, small refactors | Deciding what should be built, or not built |
| Reading a lot of text quickly | Saying "I do not know" or "we should not do this" |
| Trying many variations fast | Remembering earlier sessions without help |
| Explaining code and concepts | Judging risk to people and money |

Notice the pattern. Agents are strong where the task is clear and the answer can be checked. They are weak where the answer depends on facts that are not in front of them.

### Four common failures

1. **Hallucination.** An invented fact, function name, library or quote. Check: run the code, open the link, find the source.
2. **Drift.** On a long task, the agent loses the goal and does something nearby. Check: keep tasks small, restate the goal, read the plan.
3. **Over-agreement.** The agent goes along with a bad idea, because agreeing is the likely continuation. Check: ask for the strongest argument against your idea.
4. **Overreach.** The agent changes more than you asked: extra files, extra features, "cleaned up" code that you did not want touched. Check: read the diff, and keep the change small.

## 3. Step by step: a first conversation with an agent

You can do this with any assistant you are allowed to use. Many have free tiers. Read the provider's terms and privacy notes first, and do not paste secrets or customer data.

1. **Pick a small, checkable task.** For example: "Explain what this function does."
2. **Say the goal and who you are.** "I am a junior developer. I want to understand this code. Explain it in plain words."
3. **Give the text it needs.** Paste the function. Do not rely on memory.
4. **Read the answer, then ask the model to show its evidence.** "Which line makes you say that?"
5. **Test one claim yourself.** Run the code or read the documentation for one function the model named.
6. **Note what you learned about the tool.** Where was it right? Where did it guess?

Doing this ten times teaches you more than reading about it. Keep a short log in your repo: task, tool, what worked, what failed.

## 4. Worked example: TrailMug

Maya owns TrailMug, the fictional reusable-cup subscription. Her sign-up form rejects some phone numbers. She is a product owner, not an expert programmer. She opens a coding agent in her `trailmug-site` repository and writes:

> The sign-up form rejects the phone number "07700 900123". I want to find out why. Do not change any files yet. Look at the phone check, tell me what it does, and list the formats it accepts.

Look at what she did.

- She gave a **goal** (find out why), not a command to fix.
- She added a **limit** (no file changes yet).
- She asked for **an explanation she can check**.

The agent reads two files and replies that the check accepts only numbers with no spaces and starting with a plus sign. Maya does not just trust it. She opens the file, finds the pattern, and sees it is true. Now she knows the problem, in her own words. She writes the issue herself: "Phone check rejects local formats with spaces." That sentence is hers. Only then does she ask an agent to fix it in a branch (lesson 5) with tests (lesson 8).

The agent was fast at reading code. Maya kept the judgment about what to do next.

## 5. Working with AI agents on this

This lesson is about agents, so this section is a short rule of thumb for later lessons.

**What to delegate:** reading and explaining code, drafting tests, formatting, small clearly specified changes, summarising long documents, translating your own text.

**What you must do yourself:** decide who the customer is, decide what the product is and is not, write the epic and the roadmap, set the priority, approve the merge. See [People write epics](/library/people-write-epics). The reason is simple. Those jobs need facts that are in people's heads, not in the repo.

**A prompt you can adapt** for understanding anything new:

```text
I am learning <topic>. Explain <concept> in plain words for a beginner.
Then give me one small example I can run or check myself.
Then tell me what you are least sure about.
```

The last line matters. Asking a model what it is unsure about does not make it perfect, but it often surfaces guesses.

**How to check the output:** run it, read the source, compare with two other sources. Treat every named function, library, link and quote as unproven until you have opened it.

**Disclose:** when you use an agent for work other people will rely on, say so in the merge request. See [Disclose AI use](/library/disclose-ai-use). Lesson 10 has the full habit.

## 6. Common mistakes and how to avoid them

- **Treating fluent as true.** Fix: check one claim in every answer.
- **Giving a huge, vague task.** "Build me the whole app" fails. Fix: one issue-sized task at a time.
- **Pasting secrets or customer data into a chat.** Fix: never. Use fake data. Lesson 9 covers this.
- **Believing the agent remembers.** Fix: restate what matters, or write it in a project file (lesson 3).
- **Asking AI to decide.** "What should my product do?" gets a plausible answer with no knowledge of your customer. Fix: decide first, then ask for help carrying it out.
- **Skipping the diff.** Fix: always read what changed.

## 7. Practice

**Deliverable:** a file `ai-log/01-first-sessions.md` in your own git repository.

1. Choose one assistant you may use. Note its name and plan in the file.
2. Run five small tasks: explain a function, explain an error message, explain a term you do not know, summarise a short article, translate a paragraph of your own writing.
3. For each task write four lines: the task, the tool, one claim you checked and how, and whether the claim was right.
4. At the end, write five sentences in your own words: "A language model is... An agent is... It fails when... I will keep for myself..."
5. Commit with a clear message and open a merge request. Add the disclosure block from [Disclose AI use](/library/disclose-ai-use).

## 8. Checklist

- [ ] I can say what a token, a context window and a tool are.
- [ ] I can draw the agent loop from memory.
- [ ] I can name four failure types and a check for each.
- [ ] I know which jobs I keep: customer, scope, priority, approval.
- [ ] I checked at least one claim from each answer.
- [ ] My practice file is committed with a disclosure block.

## 9. Further learning

The resources in the list below start with the Karpathy talk, then the two agent-design guides, then the tool overview. If you want a gentle, structured start, the Microsoft open-source lessons and Google's Machine Learning Crash Course give you more background on how models learn. Take only what you need. A weekend with one video and one guide beats a month of collecting links.
