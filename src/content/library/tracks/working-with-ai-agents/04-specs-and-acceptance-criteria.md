---
title: "Specs and acceptance criteria"
description: "Turn a decision into a specification an agent can build and you can verify: problem, scope, acceptance criteria, limits and examples."
section: "Working with AI agents"
order: 4
track: "working-with-ai-agents"
level: "core"
duration: "90 min"
outcomes:
  - "Write a one-page specification from a decision you made yourself"
  - "Write acceptance criteria that are testable by a person or a program"
  - "Separate the what and why (yours) from the how (the agent's)"
  - "Hand a spec to an agent as a brief and check the result against it"
prerequisites:
  - "the-way-five-rules"
  - "people-write-epics"
resources:
  - "anthropic/claude-code-best-practices"
  - "anthropic/prompt-engineering-overview"
  - "openai/practical-guide-to-building-agents"
  - "gitlab/issues"
  - "atlassian/itsm"
updated: 2026-11-03
---

Lesson 4 of the track. It supports Developer weeks 3 and 4, where problems become epics and epics become work you can hand over, and it is the central skill of the Master Developer who orchestrates agents. Everything before it taught you to talk to an agent. This lesson teaches you to tell an agent what to build.

## 1. Why this matters

When agents do the building, the scarce skill is no longer typing. It is **knowing exactly what you want and being able to say it so clearly that anyone, human or machine, could build it and you could tell whether they did**. That is a specification.

The 2030 Product Development Manager does not write the code. They decide what to build and why, frame the problem, write the spec and the acceptance criteria, and verify what comes back. A weak spec costs a lot. An agent will fill every gap with a guess, quickly, and the guess will look good. You will find out in review, or worse, from a customer.

A strong spec has a second benefit. It makes you think. Many "ideas" fall apart when you try to write down how you would know they worked. Better to find that out on a page than in a sprint.

This lesson is where the Way's first rule meets the daily work. People write the epics and the roadmap. From a milestone that a person wrote, an agent may help break out the issues. But the spec of each piece, the acceptance criteria that define done, is human judgment. You can use agents to draft and to find gaps. You cannot give them the decision.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What problem, for whom, what "done" means, what is out of scope | Drafting the spec text from your notes, finding gaps, listing edge cases, writing the first test cases | Reading the spec aloud to a customer or colleague, checking that each criterion can fail | Customer research (discovery), design (what it looks like), security (what must be protected), finance (what it may cost) |

## 2. Key ideas, explained

### What a spec is, and is not

A **specification** (spec) is a short written description of one piece of work: the problem, the scope, what done looks like and the limits. It is not a 40-page requirements book. For agent work, one page per issue is usually right.

A spec answers: **what and why** (yours) and leaves **how** to the builder, unless the how is a hard constraint, such as "use the existing sign-up form, do not add a library".

### The anatomy of a one-page spec

| Section | Question | Example (TrailMug) |
|---|---|---|
| **Problem** | What is wrong or missing, for whom? | Café owners in Canada cannot sign up because the form rejects local phone formats. |
| **Goal** | What will be true afterwards? | Owners can sign up with any common local phone format. |
| **Out of scope** | What must not be done in this piece? | No change to the email check. No new libraries. |
| **Acceptance criteria** | How will we know it works? | A list of testable statements, see below. |
| **Constraints** | Rules and limits | Keep existing tests. Do not touch the legal folder. |
| **Examples** | Concrete inputs and outputs | "07700 900123" accepted; "07700 abc" rejected. |
| **Risks and checks** | What could go wrong, who must look? | Phone numbers are personal data. Do not log them. |
| **Owner** | Who approves? | Maya, product owner. |

### Acceptance criteria

**Acceptance criteria** are the testable statements that must all be true for the work to count as done. They are the contract between you and the agent, and the checklist for your review.

Good criteria are:

- **Specific.** "Accepts numbers with spaces," not "handles phone numbers well".
- **Testable.** A person or a program can say pass or fail. If you cannot imagine it failing, it is not a criterion.
- **Independent of the how.** They describe behaviour, not code.
- **Complete enough.** Include the unhappy paths: bad input, empty input, too much input.
- **Few.** Five to ten for one issue. If you need thirty, the issue is too big.

A useful format is **given, when, then**:

```text
Given the sign-up form is open
When I enter the phone number "07700 900123" and submit
Then the form is accepted and the number is stored as 07700900123
```

Another is a plain checklist of observable facts. Pick one format and use it every time.

### Examples beat adjectives

"Friendly error message" means a hundred things. "When the phone number has letters, the message reads: 'Please use digits only.'" means one. Put real examples in your specs, and include the cases you worry about most. Examples also become test cases, which lesson 8 turns into an eval.

### Non-functional criteria

Many failures are not about features. Add criteria for the qualities that matter:

- **Performance:** "The page loads in under three seconds on a mid-range phone."
- **Accessibility:** "All fields have labels and can be used with a keyboard."
- **Security and privacy:** "No personal data in logs. No secrets in the repository."
- **Cost:** "No new paid service."
- **Maintainability:** "Tests exist for each criterion."

You do not need to be an expert in each field. You do need to ask. The other tracks in the Library (security, observability, cloud) help you ask the right questions.

### Out of scope is a gift

Agents tend to do more than you asked. A clear "out of scope" list protects you. Write what you do not want, especially the tempting neighbours: "Do not refactor the form. Do not rename files. Do not change the design."

### Spec first, then the agent

Never start an agent run without a spec. The order is:

1. **You decide** the problem and goal, using your knowledge of the customer.
2. **You write** a rough spec in your own words.
3. **An agent helps** by asking questions, finding gaps and drafting edge cases.
4. **You decide** what to take and finalise the spec.
5. **The spec becomes the brief** for the building agent and the checklist for review.

### The spec is not the epic

An epic is a whole-product outcome that crosses repositories and lasts weeks or months. A person writes it. A spec is one issue-sized piece of that outcome. The chain is: vision, epic, milestone, issue, spec. Specs live low in the chain, where agents are strong. If you find yourself asking an agent to decide which epic matters, stop. That is the decision you are paid to make. See [People write epics](/library/people-write-epics).

### The spec lives in git

Put the spec in the issue (GitLab issues work well, see the [issues documentation](https://docs.gitlab.com/user/project/issues/)) or in a file next to the code, for example `specs/issue-14.md`. It is reviewed, versioned and visible to the next agent and the next human. When the criteria change, change the file, in a merge request, so the history is clear.

## 3. Step by step: from a decision to a verified result

1. **Write the problem in your own words**, for one customer, in two or three sentences. Use something real: an interview note, a support message, an observation.
2. **State the goal as an outcome**, not a feature.
3. **List what is out of scope.**
4. **Write acceptance criteria**, five to ten, in one format. Include unhappy paths.
5. **Add examples** with real inputs and outputs.
6. **Add constraints and non-functional criteria.** Ask: security, privacy, accessibility, cost, performance.
7. **Test the spec on a human.** Read it aloud to a colleague. Ask: "What would you build? What would you ask me?" Fix the gaps.
8. **Ask an agent to find holes**, not to rewrite (prompt below).
9. **Finalise and commit** the spec.
10. **Turn it into the agent brief:** the spec, the files to look at, the tests to run, the report format.
11. **After the run, verify against each criterion** one by one. Mark pass or fail with evidence.
12. **Keep the spec and the evidence** in the merge request.

The [Claude Code best practices](https://code.claude.com/docs/en/best-practices) and OpenAI's [practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) both stress giving agents clear instructions and a way to verify. A good spec is the best instruction you can write. Anthropic's [prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) is a useful reference for the wording.

## 4. Worked example: TrailMug

Maya has talked to five café owners (invented for practice). Two in Canada said, "I tried to sign up on my phone and it would not accept my number." She writes the problem in her own words in `specs/issue-14-phone.md`:

```text
# Issue 14: phone numbers in local formats

## Problem
Two of five café owners I interviewed could not sign up because the form rejects
numbers typed with spaces or brackets. Sign-up is our main first step, so this
loses real customers.

## Goal
A café owner in the UK, Ireland or Canada can sign up with their phone number
typed the way they normally write it.

## Out of scope
- No change to the email or name checks.
- No new libraries. No redesign. No change to the legal folder.

## Acceptance criteria
1. Given "07700 900123", the form accepts it.
2. Given "(416) 555-0199", the form accepts it.
3. Given "+353 1 234 5678", the form accepts it.
4. Given "07700 abc123", the form rejects it with the message "Please use digits only."
5. Given an empty phone field, the form behaves as today.
6. Accepted numbers are stored with spaces and brackets removed.
7. All existing tests still pass, none are edited.
8. No phone numbers appear in logs or in test output.

## Constraints
Plain JavaScript as today. Tests in Vitest. Work on branch issue-14-phone-check.

## Risks
Phone numbers are personal data (criterion 8). Maya approves the merge.
```

She asks an agent to find holes:

> Read the spec below. Do not rewrite it. List up to six questions a builder would need answered, and any criterion that cannot be tested.

The agent asks: "What about numbers with a leading plus sign and no country code? What is the maximum length? Should extensions like 'ext 12' be accepted?" Maya answers two in the spec (a maximum of 20 characters after cleanup; extensions are out of scope). She notes the third as a future issue.

The spec became the brief. After the run she verifies each of the eight criteria by hand and with tests. Criterion 8 is checked by running the tests and reading the log. Criterion 7 is checked by looking at the diff for edited tests. She records pass or fail for each in the merge request. The agent wrote the code. Maya wrote everything that mattered.

## 5. Working with AI agents on this

**What the 2030 Product Development Manager decides:** the problem, the goal, the scope, the criteria, the risks. **Delegates:** finding gaps, drafting edge cases, drafting test code from criteria, formatting the spec in the template. **Verifies:** each criterion with evidence. **Other disciplines:** design for the look and wording of messages, security and legal for the data rules, finance when cost is a criterion, support when failures would reach customers.

**Prompt to find holes in your spec:**

```text
Read this spec. Do not rewrite it and do not add features.
1. List up to six questions a builder would need answered before starting.
2. Mark any acceptance criterion that could not be tested, and say why.
3. List missing unhappy paths and non-functional criteria (security, privacy,
   accessibility, performance, cost).
4. Say what you assumed anywhere you had to guess.
```

**Prompt to turn the final spec into a brief:**

```text
Build the work described in specs/issue-14-phone.md on the current branch.
Explore and plan first, and wait for my approval of the plan.
Do not do anything listed under "Out of scope".
Add tests for criteria 1 to 6 before changing the code.
When done, run <test command> and report, for each numbered criterion,
pass or fail and how you know. List what you did not check.
```

**Verification:** you check each criterion yourself. The agent's per-criterion report is a map for your review, not proof.

**What never goes to the agent:** the choice of which problem to solve first and the definition of success for the product. Those come from customers and strategy. See [People write epics](/library/people-write-epics).

**Disclose:** if an agent drafted parts of a spec, mark them in the merge request, and say what you changed.

## 6. Common mistakes and how to avoid them

- **Describing a solution instead of a problem.** "Add a regex" locks in a how. Fix: state the behaviour.
- **Criteria that cannot fail.** "Works well." Fix: add an example input and result.
- **No unhappy paths.** Fix: add bad input, empty input and too-large input.
- **No out of scope.** The agent adds extras. Fix: list the neighbours you do not want.
- **Letting the agent write the spec from a vague idea.** You get a smooth spec for a problem you never chose. Fix: write the problem yourself.
- **A 30-criterion spec.** Fix: split the issue.
- **Changing the spec silently during the run.** Fix: change it in git and rerun.
- **Skipping non-functional criteria.** Fix: ask the security, privacy, cost, accessibility questions every time.

## 7. Practice

**Deliverable in git:** `specs/<issue>.md` (your spec), `briefs/<issue>.md` (the agent brief), `reviews/<issue>.md` (your verification notes).

1. Choose a real, small problem from your own product, or use the TrailMug problem. Write the problem from one real observation, in your own words.
2. Write the one-page spec with all eight sections. At least eight acceptance criteria, at least two unhappy paths, and one non-functional criterion.
3. Read it aloud to a person. Write down their questions and fix the spec.
4. Ask an agent to find holes, using the prompt above. Record which of its points you accepted and which you rejected and why.
5. Write the brief and direct an agent to build it, in a branch, with a plan first.
6. Verify each criterion yourself. In `reviews/<issue>.md` write one line per criterion: pass or fail, the evidence, and anything the agent got wrong.
7. Commit all three files in a merge request with a disclosure block.

## 8. Checklist

- [ ] The problem is in my words and based on something real.
- [ ] The goal is an outcome, not a feature.
- [ ] Out of scope is written.
- [ ] Every acceptance criterion can pass or fail.
- [ ] Unhappy paths and non-functional criteria are included.
- [ ] A person read the spec and I fixed the gaps.
- [ ] The brief tells the agent to plan first and to report per criterion.
- [ ] I verified every criterion myself and kept notes.

## 9. Further learning

Read the Claude Code best practices and the OpenAI agent guide for how vendors tell builders to instruct agents. The GitLab issues documentation shows where specs can live. The Atlassian ITSM introduction shows the older world of requests and acceptance that your specs sit in. Then practise: the more specs you write and verify, the faster you can see which sentences fail.
