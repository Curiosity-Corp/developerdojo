---
title: "Prompting that works"
description: "Write clear tasks for an AI model: goal, context, constraints, examples and output format, and a loop for improving a prompt one change at a time."
section: "Working with AI agents"
order: 2
track: "working-with-ai-agents"
level: "foundation"
duration: "75 min"
outcomes:
  - "Write a prompt with a goal, context, constraints and an output format"
  - "Use examples and structure to make output predictable"
  - "Improve a prompt by changing one thing at a time and comparing results"
  - "Keep a prompt library in git"
prerequisites:
  - "the-way-five-rules"
resources:
  - "anthropic/prompt-engineering-interactive-tutorial"
  - "anthropic/prompt-engineering-overview"
  - "openai/prompt-engineering-guide"
  - "google/gemini-prompt-design-strategies"
  - "deeplearning-ai/chatgpt-prompt-engineering-for-developers"
updated: 2026-11-03
---

Lesson 2 of the track. It supports Developer week 4 (AI agents in practice) and gives you the first of the two core skills of working with agents. The second is context, in lesson 3.

## 1. Why this matters

A **prompt** is the text you give a model to tell it what to do. Beginners treat a prompt like a search query: a few words, hope for the best. Experienced people treat it like a brief to a smart new colleague who has never seen your project, who works very fast, and who will not ask questions unless you invite them to.

Imagine you hired that colleague for one day. You would not say "make the form better". You would say what the form is for, who uses it, what "better" means, what not to touch, and what you want back at the end of the day. A good prompt does exactly that. It is not a trick or a magic spell. It is clear writing.

If you own a product and steer agents, your prompts are part of your work product. A prompt that produced good test cases is worth keeping, like a script. That is why this lesson ends with a prompt library in git.

A prompt is a brief to a very fast colleague. The manager's skill is clear writing: say what you want, why, and what good looks like.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| The goal, the constraints, the examples that define good, and when the answer is good enough | Turning clear instructions into drafts, tests, summaries and translations | Comparing the output with your constraints, one by one | Communication and writing (clarity), design and brand (tone), customer insight (examples) |

## 2. Key ideas, explained

### The five parts of a good prompt

| Part | Question it answers | Example |
|---|---|---|
| **Goal** | What do I want done? | "Write test cases for the sign-up form." |
| **Context** | What does the model need to know? | "The form has name, email and phone. Customers are cafés in several countries." |
| **Constraints** | What must or must not happen? | "Do not change the code. Maximum ten cases." |
| **Examples** | What does good look like? | One sample test case in the format you want. |
| **Output format** | How do I want the answer shaped? | "A table with columns: input, expected result, why." |

You do not need all five every time. A one-line question needs only a goal. A task you will repeat or hand to an agent needs most of them.

### Be clear and direct

Both Anthropic's [prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) and OpenAI's [prompt engineering guide](https://developers.openai.com/api/docs/guides/prompt-engineering) give the same first advice. Say what you want in plain words. Do not hint. If you want three options, say three. If you want it short, say how short. A useful test is to show the prompt to a person who has not seen your project. If they would have questions, so will the model.

Compare:

- Weak: "Improve this email."
- Strong: "Rewrite this email to a café owner. Keep my meaning. Make it friendly and under 120 words. Keep the date and price exactly as they are."

### Give the reason

Models do better when they know why. "Keep it under 120 words because it will be read on a phone" lets the model make sensible choices you did not think of. A reason turns a rule into a purpose.

### Show examples

An **example** is often worth more than a paragraph of description. If you want output in a certain style, show one or two samples. This is called **few-shot prompting** ("shot" means example). Put the examples in a clear block, and say they are examples. Make them varied, because the model copies what it sees. If all three of your examples start with "Check that", every answer will too.

### Use structure to separate parts

A long prompt mixes instructions, data and examples. The model can confuse them. Use clear labels or tags so each part is easy to find:

```text
<task>
Summarise the customer notes below in five bullet points for a product owner.
</task>

<notes>
...pasted text...
</notes>

<rules>
- Use the customer's words where possible.
- Do not guess. If something is unclear, say "unclear".
</rules>
```

This also helps with safety. Text between the notes tags is data. If the notes contain a sentence such as "ignore your instructions", it is still just data. Lesson 9 returns to this.

### Let the model think, then answer

For hard questions, ask the model to work step by step before giving a final answer, or ask for a plan first. For example: "First list the facts you are using. Then give your answer." You can read the reasoning and find where it went wrong. Some tools can do deeper "thinking" on their own. Read your tool's documentation, because settings and names differ and change often.

### Ask for what you can check

Ask for output in a form that is easy to review: a table, a numbered list, a diff. Ask the model to quote the line it used or name the source. Ask it to say what it is unsure about. This does not remove errors, but it makes errors easier to see.

### Prompts are tested, not guessed

The best prompt writers do not get it right the first time. They try, look at the result, change one thing, and try again. This is the loop in the next section.

## 3. Step by step: build a prompt and improve it

1. **Write the goal in one sentence.** "Draft test cases for the phone-number check on the sign-up form."
2. **Write down what you would tell a new colleague.** Where the code is, what the check does today, which formats should work, what you do not want changed.
3. **Add constraints.** Length, tone, things to avoid, format.
4. **Add one or two examples** if the format matters.
5. **Label the parts** with simple tags or headings.
6. **Run it.** Read the whole answer.
7. **Name what is wrong.** Too long? Invented a format? Missed a case? Write the problem in a sentence.
8. **Change one thing** to fix that problem. Add a constraint, add an example, or add context.
9. **Run it again** and compare with the previous result. Keep the better one.
10. **Save the final prompt** and one good result in your repo.

Changing one thing at a time matters. If you change five things and the result improves, you do not know which change helped. Next time you will guess again.

The [Anthropic interactive tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial) is built around this loop, with exercises you run yourself. The short DeepLearning.AI course [ChatGPT Prompt Engineering for Developers](https://www.deeplearning.ai/courses/chatgpt-prompt-eng) teaches the same habit with code. Google's [prompt design strategies](https://aistudio.google.com/docs/prompting-strategies) show that the advice is the same across vendors.

## 4. Worked example: TrailMug

Maya wants test cases for the phone check on the TrailMug sign-up form. Her first prompt:

> Write tests for the phone number.

The answer is a long list of mixed cases, some for countries TrailMug does not serve, in a style that does not match the repo. Maya follows the loop.

**Problem 1: no context.** She adds: "TrailMug sells to cafés in the UK, Ireland and Canada. The form is `src/forms/signup.js`. The check is `isValidPhone`. We use Vitest."

**Problem 2: wrong format.** She adds an example of one test written the way her repo writes tests, and says: "Write each case in this same style."

**Problem 3: too many cases.** She adds a constraint: "At most eight cases. Include spaces, brackets, a leading plus sign and a leading zero. Include two that must be rejected."

**Problem 4: it invents.** She adds: "Do not change `isValidPhone`. If a case would fail with the current code, mark it with a comment `// currently fails` instead of changing the code."

Her final prompt:

```text
<task>
Draft Vitest test cases for isValidPhone in src/forms/signup.js.
</task>

<context>
TrailMug sells to cafés in the UK, Ireland and Canada.
Customers type phone numbers in local formats, for example "07700 900123".
</context>

<rules>
- At most eight cases. Include spaces, brackets, a leading + and a leading 0.
- Include two cases that must be rejected.
- Do not change isValidPhone. Mark cases that fail today with // currently fails.
- Use the style of the example below.
</rules>

<example>
it('accepts a UK number with spaces', () => {
  expect(isValidPhone('07700 900123')).toBe(true);
});
</example>
```

The result is usable. Maya runs it. Three cases fail, which is the bug she knew about. She saves the prompt in `prompts/signup-phone-tests.md` in the repo. Next time a form changes, she reuses it.

All the decisions in this prompt were Maya's. Which countries matter, what must be rejected, and that the code must not change before the tests exist. The agent supplied words and syntax.

## 5. Working with AI agents on this

**Delegate:** turning your clear instructions into drafts, tests, summaries, translations and reformatting.

**Keep:** the goal, the constraints, the examples (choose them carefully), and the decision about whether the output is good. If you cannot write the prompt clearly, you do not yet know what you want. That is a sign to think first, and perhaps to talk to a customer or a colleague.

**A meta-prompt you can adapt.** You may ask an assistant to help you improve your own prompt:

```text
Here is a prompt I wrote and the answer I got.
Prompt: <paste>
Answer: <paste>
What I wanted: <one sentence>
Do not rewrite the prompt. List up to three questions a new colleague would ask
after reading it, and which missing detail would most improve the answer.
```

Asking for questions, not a rewrite, keeps the thinking yours.

**Never use a prompt to do your deciding.** "Write the epic for a cup subscription" is not a prompt problem. It breaks Rule 1 of The Way. See [People write epics](/library/people-write-epics). The allowed version is "Here are my notes, list any gaps in them".

**How to check the output:** compare with your constraints one by one. Did it stay under eight cases? Did it keep the format? Run what can be run. Read what cannot be run.

**Disclose:** when a prompt-made draft goes into a merge request, say which parts were drafted by an agent and what you changed. Saving the prompt in git is a good way to show your work.

## 6. Common mistakes and how to avoid them

- **Vague asks.** "Make it better." Fix: define "better" in a sentence.
- **Too much at once.** Ten tasks in one prompt. Fix: split. One task, one prompt.
- **No context.** The model guesses your project. Fix: paste or point to the facts it needs.
- **Telling it only what not to do.** "Don't be boring" is weak. Fix: say what to do instead.
- **Changing many things between tries.** Fix: change one thing and compare.
- **Examples that are all alike.** The output copies them. Fix: vary them.
- **Treating the first answer as final.** Fix: plan for two or three rounds.
- **Secrets and real customer data in prompts.** Fix: use fake or redacted data.

## 7. Practice

**Deliverable:** a folder `prompts/` in your own git repository with two prompts and their results.

1. Pick a real small task from your own product or from the TrailMug example. For example: draft five interview questions for a café owner, or summarise a short customer note.
2. Write a first prompt in one sentence. Run it and save the answer as `v1`.
3. Improve it three times using the loop. After each round, write one line: what was wrong and what you changed. Save each version and result.
4. Save the final prompt as `prompts/<task-name>.md` with a short header: purpose, tool, date, what to check in the result.
5. Repeat with a second, different task (for example a summary instead of a draft).
6. Write five lines on what the two prompts have in common.
7. Commit and open a merge request with a disclosure block from [Disclose AI use](/library/disclose-ai-use).

## 8. Checklist

- [ ] My prompt states a goal, context, constraints and an output format.
- [ ] I labelled instructions and data separately.
- [ ] I used at least one example where the format mattered.
- [ ] I changed one thing at a time and kept notes.
- [ ] I checked the output against my constraints.
- [ ] No secrets or real customer data are in my prompts.
- [ ] The final prompts are saved and committed.

## 9. Further learning

Do the Anthropic interactive tutorial for hands-on practice, then read the two vendor guides side by side and notice what they share. The DeepLearning.AI course is short and shows prompting in code. After that, the best teacher is your own prompt library: reread old prompts when a new task comes along.
