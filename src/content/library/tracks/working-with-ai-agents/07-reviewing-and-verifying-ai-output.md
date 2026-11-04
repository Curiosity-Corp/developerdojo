---
title: "Reviewing and verifying AI output"
description: "A review method for AI-written code, text and data: how to read a diff, spot plausible nonsense and decide what to accept, fix or reject."
section: "Working with AI agents"
order: 7
track: "working-with-ai-agents"
level: "core"
duration: "75 min"
outcomes:
  - "Review an AI-written change with a repeatable method"
  - "Spot the signs of plausible but wrong code, text and data"
  - "Write review comments that an agent or a person can act on"
  - "Decide when to accept, fix, redo or reject"
prerequisites:
  - "the-way-five-rules"
resources:
  - "gitlab/merge-requests"
  - "anthropic/claude-code-best-practices"
  - "youtube-andrej-karpathy/deep-dive-into-llms"
  - "owasp/top-10-for-llm-applications"
  - "openai/safety-best-practices"
  - "google/rules-of-machine-learning"
updated: 2026-11-03
quiz:
  - question: "What do you read first in the ten-minute review?"
    options:
      - "The code, line by line"
      - "The issue and the agent's report"
      - "The tests"
      - "The lock file"
    answer: "The issue and the agent's report"
    why: "You need to know what the change should be before you judge what it is."
  - question: "An existing test was edited so that it now accepts input it used to reject. What does this often mean?"
    options:
      - "The agent improved the test."
      - "The agent made the tests pass by changing the judge."
      - "Nothing. Tests change all the time."
      - "The original test was probably wrong."
    answer: "The agent made the tests pass by changing the judge."
    why: "Existing tests change only with a human reason. A change that fixes a failing test by weakening the test is a classic problem."
  - question: "You cannot find the library that the agent says it installed in any package registry. What does this suggest?"
    options:
      - "The registry is out of date."
      - "The agent invented it."
      - "The library is private."
      - "You searched badly."
    answer: "The agent invented it."
    why: "A function, option or library you cannot find in the documentation is often a hallucination. Look it up."
  - question: "You ask the same agent whether its change is right. What does the lesson advise?"
    options:
      - "Trust the answer if it sounds confident."
      - "It will probably say yes, so ask it for problems and check every point yourself."
      - "Ask three times and take the majority."
      - "Ask it to approve the merge request."
    answer: "It will probably say yes, so ask it for problems and check every point yourself."
    why: "An AI reviewer does not carry the responsibility. You do."
---

Lesson 7 of the track. It supports Developer week 4 and is the skill behind the "evidence of complete epic management" in the Product Package: someone owns what ships. For the Master Developer it is the daily practice of reviewing agent merge requests.

## 1. Why this matters

When an agent writes the code, you become the editor. Your job moves from typing to judging. This is harder than it sounds, for a reason that has nothing to do with intelligence. AI output looks finished. It is tidy, well formatted, and confident. Humans tend to trust what looks polished, and we get tired when there is a lot to read.

The result is the main risk of working with agents: **plausible nonsense** that passes a quick look. It compiles. It reads well. It is wrong in a way that shows up in production, or three months later.

The rule of this lesson is plain: **you do not ship what you cannot explain.** If a reviewer, a coach or a customer asks why a line is there, you must be able to answer without asking the agent. That rule is how you keep ownership of work you did not type.

Verification is the manager's main craft once agents build. Plausible output is cheap. Verified output is what you ship.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Accept, fix, redo or reject, and whether the evidence is enough | A first-pass review for hints; checking facts against sources | Your own review: tests, diff, running product, sources | Engineering, security, legal (licences), the customer's view |

## 2. Key ideas, explained

### Review is a separate act from creation

When you write something yourself, you check it as you go. When an agent writes it, you did not follow the steps. So you need a deliberate review pass, with a method, at a time when you are fresh. Do not review at the end of a long day. Do not review while the agent is still typing.

### Three questions for every change

1. **Is it the right change?** Does it solve the issue, and only the issue?
2. **Is it correct?** Does it work, including edge cases, and do the tests really test it?
3. **Is it safe and maintainable?** Could it leak data, break something else, or confuse the next reader?

Order matters. If the answer to the first is no, you do not need to read the details.

### The review method for code

1. **Read the issue and the agent's report first.** Know what it should be.
2. **Look at the file list.** Are there files you did not expect? Config, lock files, tests that were changed, deleted files? Each one needs a reason.
3. **Read the tests first.** Tests are the specification. Did the agent change an existing test? Did it delete one? A change that "fixes" a failing test by weakening the test is a classic problem.
4. **Read the code.** Slowly, line by line. For each block ask: what does this do, and why is it here?
5. **Run it.** Run the test suite yourself. Run the feature by hand. Try an input you thought of, not the ones in the tests.
6. **Search for extras.** New dependencies, new network calls, new files outside the folder, commented-out code, TODO notes, hard-coded values, copied snippets.
7. **Decide.** Accept, ask for changes, redo with a better instruction, or reject.

### Signs of plausible nonsense

| Sign | What it often means |
|---|---|
| A function, option or library you cannot find in the documentation | Hallucination. Look it up. |
| A test that cannot fail (it checks something that is always true) | The test proves nothing |
| An existing test changed or removed | Making the tests pass by changing the judge |
| Error handling that silently swallows the error | Hides bugs. Look for empty catch blocks. |
| A long change for a small request | Overreach. Ask for the minimal change. |
| Confident comments that describe something the code does not do | Comments are text too, and can be wrong |
| Code that handles only the example you gave | Overfitting to your example |
| Mixed styles or unfamiliar patterns | Copied from somewhere. Check licence and fit. |
| Numbers with no source | Invented statistics |

### Review text and data too

You will use agents for text and data: summaries, translations, drafts, tables. The method is similar.

- **Check facts against the source.** For a summary, read the original once and compare. Do the key numbers match?
- **Check quotes.** A quote must be searchable in the source. If not, it was made up.
- **Check names and links.** Open every link. Check every name.
- **Check what is missing.** Summaries often drop the unwelcome detail. Ask: what did it leave out?
- **Check tone and claims.** Drafts may promise things your product does not do.
- **For data,** recompute a few rows by hand, check totals, look at the extremes.

### Why review is hard, and what helps

Andrej Karpathy's longer talk on how language models work, listed under further learning, shows why models produce errors that look right: they produce likely text, not verified text. Google's [Rules of Machine Learning](https://developers.google.com/machine-learning/guides/rules-of-ml) are about a different field, but their habit carries over: measure, start simple, and be suspicious of results that seem too good.

Three habits make review easier.

- **Small changes.** A 30-line change can be reviewed carefully. A 3,000-line change cannot. Keep agent tasks small (lesson 5).
- **Good tests.** Tests carry part of the load.
- **A second pair of eyes.** On a real team, a person other than the author approves. Using a second AI to review the first can find things, but it is not a replacement for a person. It may share the same blind spots.

### How to give feedback to an agent

Good review comments are specific, checkable and kind to the reader:

- Weak: "This is wrong."
- Strong: "Line 42 swallows the error. Throw it or log it with the user id. Add a test for the failure case."

Give one comment per issue, and say what you want instead.

## 3. Step by step: a ten-minute review

1. Read the issue and the agent's report (1 min).
2. List files changed. Mark anything unexpected (1 min).
3. Read test changes. Note any test removed or weakened (2 min).
4. Read the code changes line by line. Write a question beside any line you cannot explain (3 min).
5. Ask the agent about those lines. Check its answers against the code and the docs (1 min).
6. Run the tests and the feature yourself (1 min).
7. Write your decision and your comments (1 min).

For larger changes, repeat in parts. If the change is too large to review in an hour, send it back and ask for smaller pieces.

## 4. Worked example: TrailMug

Maya's agent has made the phone-check change for issue 14. She reviews it.

**Files changed:** `signup.js`, `signup.test.js`, and `package-lock.json`. The lock file is unexpected. She asks: "Why did package-lock.json change?" The agent says it installed a phone-number library, `phone-lib-pro`. Maya searches the package registry and cannot find a library with that name. It does not exist. The agent had invented it, "installed" something else with a similar name, and used it in one place.

**Tests:** six new tests, good. But one existing test was edited: the test that rejects a number with letters now accepts "07700 abc". The agent changed the judge to match its code.

**Code:** the function now calls the library for validation. She cannot explain the library. Rule: she does not ship what she cannot explain.

**Decision:** reject. Her comment on the merge request:

> 1. Remove the new dependency. Use plain string cleanup (strip spaces, brackets, dashes) and the existing pattern. 2. Restore the original test that rejects letters. Do not edit existing tests. 3. Keep the six new tests. 4. Do not change package-lock.json.

The second attempt is 11 lines and no new dependency. All the original tests pass. She runs the form by hand with three numbers and a number with letters. The letters are rejected. She approves.

Time spent on the review: twelve minutes. Time saved: a supply-chain risk, a broken test and a bug that would have let junk numbers into the CRM.

## 5. Working with AI agents on this

**Delegate:** a first pass of review, to point at risky lines or list changed behaviour. Ask a second session to review the change, with a prompt that asks for problems, not praise. Use the results as hints for where to look.

**Keep:** the decision to accept, and the explanation. An AI reviewer does not carry the responsibility. You do. Also keep the final read of tests and the run of the feature.

**A prompt you can adapt** for a hint-only review:

```text
You are reviewing a change made by another AI agent. Do not praise it.
List up to eight possible problems, ordered by risk: wrong behaviour, missing edge
cases, weakened or removed tests, new dependencies, silent error handling, secrets,
changes outside the issue. For each, name the file and line and how I can check it.
If you are unsure, say so.
```

**How to check the reviewer:** every point it raises, verify yourself. Points it does not raise are still your job.

**Disclose:** say in the merge request what the agent wrote and what you reviewed, and if a second AI helped review. See [Disclose AI use](/library/disclose-ai-use).

**Boundary:** a review of an AI-drafted epic or roadmap is not review at all, because the thinking is missing. Epics and roadmaps are written by people. See [People write epics](/library/people-write-epics).

## 6. Common mistakes and how to avoid them

- **Skim-reading because it looks tidy.** Fix: use the method, every time.
- **Not reading the tests.** Fix: read tests first.
- **Letting the agent edit tests to pass.** Fix: existing tests change only with a human reason.
- **Accepting a new dependency without looking.** Fix: open the project page, check it exists, check the licence, check it is maintained.
- **Reviewing too much at once.** Fix: smaller changes.
- **Asking the same agent "is this right?"** It will probably say yes. Fix: ask for problems, and verify yourself.
- **Approving what you cannot explain.** Fix: if you cannot explain it, reject or ask.

## 7. Practice

**Deliverable in git:** `reviews/<change>.md` (your review notes) and one review recorded on a merge request.

1. Get a change made by an agent from a spec you wrote: your lesson 5 practice or a new small task. Keep the spec and the brief next to it.
2. Review it with the ten-minute method. Write down every question you had.
3. Verify against the spec: mark each acceptance criterion pass or fail with evidence you produced yourself.
4. Find at least one problem. If you find none, look again: tests changed, new dependencies, one edge case you invented.
5. Write review comments in the strong style, one issue per comment, with what you want instead.
6. In the notes, record the files changed, three questions, what you ran, your decision and why, and one change to the spec or brief that would prevent the problem.
7. Swap with a classmate and review theirs.
8. Commit the notes in a merge request with a disclosure block.

## 8. Checklist

- [ ] I read the issue and the agent's report first.
- [ ] I looked at every file in the list and asked why.
- [ ] I read test changes before code changes.
- [ ] I ran the tests and the feature myself.
- [ ] I checked new dependencies, links, names and numbers.
- [ ] I can explain every line I accepted.
- [ ] My comments were specific.
- [ ] I recorded what the AI did and what I checked.

## 9. Further learning

The merge request documentation is your reference for review tools. The Claude Code best practices show how to make an agent verify its own work. The OWASP list for language-model applications and OpenAI's safety practices help you spot risky patterns. Reviewing is a skill: do it often, on small changes, and keep notes of the mistakes you find.
