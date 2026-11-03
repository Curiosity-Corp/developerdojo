---
title: "Agentic coding tools in practice"
description: "Run a coding agent safely on real work: one issue, one branch, plan first, small steps, tests as the judge, and permissions you control."
section: "Working with AI agents"
order: 5
track: "working-with-ai-agents"
level: "core"
duration: "90 min"
outcomes:
  - "Run a coding agent on one issue in its own branch"
  - "Ask for a plan and approve it before any code is written"
  - "Use tests as the judge of the agent's work"
  - "Set permissions and limits so a mistake is small and reversible"
prerequisites:
  - "the-way-five-rules"
  - "git-is-the-source-of-truth"
resources:
  - "anthropic/claude-code-overview"
  - "anthropic/claude-code-best-practices"
  - "github/copilot-documentation"
  - "anthropic/anthropic-courses"
  - "deeplearning-ai/ai-python-for-beginners"
  - "deeplearning-ai/ai-agentic-design-patterns-with-autogen"
updated: 2026-11-03
---

Lesson 5 of the track. It supports Developer week 4 ("AI agents in practice") and the Master Developer module on orchestrating agents. You should know a little git. If you do not, read the first lesson of the [Git and GitLab](/library/tracks/git-and-gitlab) track first.

## 1. Why this matters

A **coding agent** is an AI agent (lesson 1) that works in your code. It can read files, edit them, run commands such as the test suite, and try again. Examples include the tool described in the [Claude Code overview](https://code.claude.com/docs/en/overview) and the agent features described in the [GitHub Copilot documentation](https://docs.github.com/en/copilot). Features and names change quickly, so use the current documentation of whichever tool you are allowed to use.

These tools are the biggest change in how software is built. A person with a clear issue and good tests can get a working change in minutes. They are also the tools that can do the most damage if used carelessly: deleting files, changing the wrong code, or confidently shipping something broken.

The Way says git is the source of truth and we fix forward. Both rules shape how you use coding agents. Your safety net is git, not the agent's promises.

You will rarely type the code. You will direct an agent to build one issue and then verify it. This lesson teaches the direct-then-verify loop with enough technical depth to judge a plan and a diff.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| The issue, the definition of done, approval of the plan, the merge | Exploring code, writing the change and tests, running checks, drafting the merge request text | Running tests yourself, reading the diff, trying the feature in a running environment | Engineering (is the plan sound?), design (does it look and behave right?), security (does it touch data?) |

## 2. Key ideas, explained

### One issue, one branch, one agent

The unit of work for an agent is an **issue**: one task that one agent can finish in one change. A **branch** is a separate line of history in git where the work happens, so your main code is untouched. A **merge request** is the proposal to bring the branch into the main code, with review.

The rule is simple. Never let an agent work directly on your default branch. Create a branch for the issue, let the agent work there, review the merge request, and only then merge. If the agent makes a mess, you throw away the branch. The main code was never at risk.

### Plan first, code second

Coding agents work better when they think before they type. Both the Claude Code best practices and general experience point to the same pattern: explore, plan, then implement.

1. **Explore.** The agent reads the relevant files and tells you what it found. No changes.
2. **Plan.** The agent lists the steps it will take, the files it will change and how it will test. You read the plan.
3. **Implement.** Only after you approve the plan does the agent edit files.
4. **Verify.** The agent runs the checks and reports.

Reading a plan takes two minutes. Reading a wrong 400-line change takes thirty. The plan is the cheapest place to catch a misunderstanding.

### Tests are the judge

How does anyone know the change works? Not because the agent says so. Because a test says so. A **test** is code that checks that other code behaves as expected. If the agent can run tests, it can find its own mistakes. If the tests are weak, a broken change can still pass.

So the best order is often:

1. Write (or have the agent draft) a test that fails because of the bug or missing feature. You review that test. It is your specification.
2. Ask the agent to make the test pass without changing the test.
3. Run all the tests, not only the new one.

This is sometimes called test-first work. You do not need to follow it strictly every time, but you need some automatic check that you trust. Lessons 7 and 8 show how to review and measure.

### Small steps

Large tasks fail more often. An agent asked to "rebuild the checkout" will make many decisions you did not approve. An agent asked to "add a country-code dropdown to the phone field" will make few. If a task is large, split it into issues first. That is your job, and it is good practice for the epic work in the program: epics are written by people, and milestones and issues come from them.

### Permissions: the leash

Most coding tools ask your permission before they run a command or edit a file, and let you allow some actions in advance. Read how your tool does this. A good starting rule:

| Action | Suggested default |
|---|---|
| Read files | Allow |
| Edit files in the branch | Allow after the plan is approved |
| Run tests and linters | Allow |
| Install new packages | Ask every time |
| Delete files, run scripts from the internet | Ask every time, read carefully |
| Anything touching secrets, production, or the network | Deny |
| Push to the default branch | Deny. It should also be blocked by the git host. |

Resist the temptation to turn all permissions off to go faster. The few seconds you save are not worth one deleted folder. If your tool offers a "run anything without asking" mode, use it only inside a disposable environment that holds nothing of value and no secrets. Lesson 9 covers this.

### Watch and steer

An agent is not a rocket you launch and forget. In the first minutes, watch what it reads and what it plans. If it goes the wrong way, interrupt and correct it. Early correction is cheap. Late correction is expensive.

### The agent's report

Ask the agent to end each task with a short report: what it changed, what it tested, what it did not check, and any decisions it made. Those lines are the start of your merge request description and your disclosure.

## 3. Step by step: one issue with a coding agent

1. **Write the issue and its spec yourself** (lesson 4). Title, the problem in plain words, acceptance criteria, and any limits. See the [issues and milestones guide](/library/issues-milestones-labels).
2. **Create a branch** named after the issue, for example `issue-14-phone-check`.
3. **Start a fresh agent session** in the repository. Check that your instruction file (lesson 3) is loaded.
4. **Ask for exploration only.** "Read the code related to this issue. Summarise how it works. Do not change any files."
5. **Ask for a plan.** "List the steps, the files you will change, and the tests you will add. Wait for my approval."
6. **Read and edit the plan.** Remove anything out of scope. Add anything missing.
7. **Approve and let it implement** in small steps. Watch the first steps.
8. **Run the checks yourself.** Do not rely on the agent's statement. Run the tests and linter.
9. **Read the whole diff** (lesson 7). Reject what you cannot explain.
10. **Commit in small pieces** with clear messages. Push the branch and open a merge request.
11. **Write the description** with a disclosure block: what the agent did, what you decided, what you checked.
12. **Merge only after the pipeline is green** and a human has approved.

If anything fails after merge, **fix forward**: a new issue, a new branch, a new fix. See [Fix forward](/library/fix-forward).

## 4. Worked example: TrailMug

Maya has issue 14 in `trailmug-site`: "The phone check rejects local formats with spaces." She wrote it herself. It says what happens, gives three failing numbers and says "done means these three work, and the existing tests still pass". She creates the branch `issue-14-phone-check` and starts her coding agent.

**Explore.** Her message: "Read src/forms/signup.js and its tests. Explain how isValidPhone works. Do not change any file." The agent explains the check is a single pattern that requires a leading plus and digits only.

**Plan.** "Propose a plan to fix issue 14. List files, tests, and risks. Wait for me." The agent proposes: change the pattern to strip spaces, brackets and dashes before checking; add six tests; no other files. Maya notices a risk: the plan removes the plus sign test. She replies: "Keep rejecting numbers with letters. Do not remove any existing test." She approves.

**Implement.** The agent adds the tests first and shows two failing. It changes the function. All tests pass. It reports: "Changed signup.js and signup.test.js. Ran npm test and npm run lint. I did not test in a browser."

**Verify.** Maya runs `npm test` herself. She reads the diff: 14 lines in the function, 40 lines of tests. One test name is unclear, and she renames it. She opens the form on the preview site and types the three numbers. They work.

**Merge request.** Description:

```text
Closes #14

What changed: phone check now accepts spaces, brackets and dashes.
AI use: coding agent drafted the fix and six tests on branch issue-14-phone-check.
I decided: which formats are valid and that letters stay rejected.
I checked: ran npm test and lint, read every line, tried three numbers in the preview.
```

The pipeline is green. A teammate approves. Maya merges. Total time: about 25 minutes, most of it reading, which is how it should be.

## 5. Working with AI agents on this

**Delegate:** exploring code, drafting a plan, writing the change and tests for a clear issue, running the checks, drafting the merge request text.

**Keep:** the issue (what and why), the definition of done, approval of the plan, the review of the diff, the merge decision, and everything above issue level. Epics and the roadmap are not agent work. A good agent can break a milestone that you wrote into issues, and you review them. It cannot decide the milestone.

**Prompts you can adapt:**

```text
Explore only. Read <files>. Explain how <feature> works and list anything
confusing. Do not edit any file.
```

```text
Plan only. For issue <number> (text below), list: steps, files to change, tests
to add, risks, and what you will NOT change. Wait for my approval.
```

```text
Implement the approved plan in small commits. After each step run <test command>.
Stop and ask if you need to change anything outside the plan.
End with: files changed, tests run, what you did not check.
```

**How to check:** the tests, the diff, and the running feature. Three separate checks, because each catches different mistakes.

**Disclose:** use the block in [Disclose AI use](/library/disclose-ai-use) in every merge request.

## 6. Common mistakes and how to avoid them

- **Working on the default branch.** Fix: always a branch. Protect the default branch in your git host.
- **Skipping the plan.** The agent solves the wrong problem at speed. Fix: plan first.
- **Huge tasks.** Fix: split into issues.
- **Trusting "all tests pass".** The agent may have changed a test to make it pass. Fix: read test changes first.
- **Allowing every action.** Fix: keep prompts for installs, deletes and the network.
- **Merging without reading the diff.** Fix: if you cannot explain it, do not merge it.
- **A long session that drifts.** Fix: finish the issue, start fresh.
- **Fixing by reverting.** Fix forward with a new change and a test.

## 7. Practice

**Deliverable in git:** `specs/<issue>.md` (your spec), `briefs/<issue>.md` (your agent brief), `reviews/<issue>.md` (your review notes), plus a merge request with the agent's change.

1. Pick or create a repo with at least one test. If you have none, make a tiny repo with one function and two tests.
2. Write the spec by hand: a small bug or feature, with at least five acceptance criteria (lesson 4).
3. Write the brief: explore first, plan and wait, tests before code, report per criterion, what not to touch.
4. Direct the agent through explore, plan, implement, verify on a branch. Edit its plan at least once.
5. Verify the result yourself. In `reviews/<issue>.md` mark each criterion pass or fail with evidence, note one thing the agent got wrong or missed, and say what you would change in the brief next time.
6. Open a merge request with a disclosure block. Ask a classmate or mentor to review it.
7. Do not merge until the checks pass and someone else has approved.

## 8. Checklist

- [ ] The task was one issue, written by me.
- [ ] The agent worked on a branch, not on the default branch.
- [ ] I asked for exploration and a plan before any edit.
- [ ] I edited the plan.
- [ ] Tests exist and I ran them myself.
- [ ] I read the whole diff and the test changes.
- [ ] I kept permissions tight for installs, deletes and secrets.
- [ ] The merge request has a disclosure block.

## 9. Further learning

The tool documentation is the best reference, because features change often: start with the Claude Code overview and best practices, or with the Copilot documentation if that is your tool. The Anthropic courses site and the DeepLearning.AI courses give structured practice. For beginners, the AI Python course is a gentle way to build the code-reading skill you need to review an agent's work.
