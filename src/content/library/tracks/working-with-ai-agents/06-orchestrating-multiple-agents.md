---
title: "Orchestrating multiple agents"
description: "Run several agents at once on separate issues without losing control: split work, isolate branches, define roles, sequence reviews and keep one human accountable."
section: "Working with AI agents"
order: 6
track: "working-with-ai-agents"
level: "advanced"
duration: "90 min"
outcomes:
  - "Split a milestone you wrote into independent, agent-sized issues"
  - "Assign roles to agents (builder, reviewer, tester, researcher) and give each a brief"
  - "Isolate work with branches, ownership of files and a merge order"
  - "Keep control with checkpoints, a status board and one accountable human"
prerequisites:
  - "the-way-five-rules"
  - "people-write-epics"
resources:
  - "anthropic/building-effective-agents"
  - "openai/practical-guide-to-building-agents"
  - "deeplearning-ai/ai-agentic-design-patterns-with-autogen"
  - "microsoft/ai-agents-for-beginners"
  - "anthropic/claude-code-best-practices"
  - "gitlab/merge-trains"
updated: 2026-11-03
---

Lesson 6 of the track. It is the core of the Master Developer module on AI-agent orchestration and supports the Developer week 4 practice, where you first direct more than one agent. It assumes you can write a spec (lesson 4) and run one coding agent safely (lesson 5).

## 1. Why this matters

One agent is a helper. Several agents are a **workforce**. The 2030 Product Development Manager does not type the code, the tests, the docs and the research notes. They direct a set of agents that do, in parallel, and they stay accountable for the whole.

The gain is large: a day's work can be split into six independent pieces that run at the same time. The danger is also large. Six agents can create six sets of changes that overlap, contradict each other or drift from the plan. The scarce skill is orchestration: splitting the work well, giving each agent a clear brief, keeping their work apart, and combining the results safely.

You already know the parts. Specs (lesson 4) make each piece clear. Branches and merge requests (lesson 5) keep pieces apart. Review (lesson 7) and evals (lesson 8) check them. This lesson teaches how to run them together.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| The milestone and its order, what can run in parallel, who reviews, when to stop | Building each issue, drafting tests, researching options, reviewing for problems | Per-issue criteria, integrated checks on the combined result, a human read of the key diffs | Engineering for dependencies and architecture, security for access, operations for release timing, finance for agent cost |

## 2. Key ideas, explained

### Workflows and agents, and teams of both

Anthropic's article [Building effective agents](https://www.anthropic.com/research/building-effective-agents) describes simple patterns that combine models: **prompt chaining** (one step feeds the next), **routing** (send each input to the right specialist), **parallelisation** (run independent pieces at once, or run the same task several times and compare), **orchestrator and workers** (one agent splits a task and hands pieces to others) and **evaluator and optimiser** (one agent produces, another critiques). OpenAI's [practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) discusses similar manager-style and hand-off designs. The DeepLearning.AI course [AI Agentic Design Patterns with AutoGen](https://www.deeplearning.ai/courses/ai-agentic-design-patterns-with-autogen) and Microsoft's open lessons [AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners) walk through them in code.

You do not need to build such systems. As a manager of agents, you need the picture. Both articles give the same advice: **start with the simplest design that works** and add agents only when the task needs it. A human acting as the orchestrator, with a plan on paper, beats a clever automated crowd that nobody understands.

### You are the orchestrator

In the simplest and safest design, you are the orchestrator. You hold the plan. You hand each issue to an agent. You collect and review the results. Automation can come later, once you know where the work goes wrong.

### Splitting work well

Good splits have these properties:

| Property | Meaning | Test |
|---|---|---|
| **Independent** | Two pieces can be built without waiting for each other | Could they be done in either order? |
| **Small** | One agent, one change, reviewable in an hour | Can you read the diff in ten minutes? |
| **Clear** | Each has its own spec and criteria | Could another agent build it from the page alone? |
| **Separate files** | Pieces touch different files, where possible | Do their file lists overlap? |
| **Checkable** | Each has its own test or check | Can you say pass or fail? |

When two pieces must touch the same file, they are not independent. Run them one after the other, or merge them into one issue.

### Dependencies and order

Write the dependencies down. "Issue 14 (phone check) and issue 15 (welcome email) are independent. Issue 16 (store the number) needs 14." A small table or list is enough. The order of merging is part of the plan: merge small, safe, independent pieces first, and rebase the rest on top.

### Isolation: one branch per agent

Each agent works on its own branch, ideally in its own **worktree** (a separate working copy of the repository, so agents do not step on each other's files). Never let two agents edit the same working copy at the same time. Never let any agent work on the default branch. Name branches after issues so the link is obvious.

Ownership rules help: "Agent A may change `src/forms/`. Agent B may change `docs/`. Nobody changes `legal/`." Write them in the brief and in the instruction file (lesson 3).

### Roles

Agents work best with a narrow role:

| Role | Job | Reads | Writes |
|---|---|---|---|
| **Builder** | Implements one issue | Spec, code | Code and tests on its branch |
| **Tester** | Writes tests and edge cases from the spec | Spec | Test files only |
| **Reviewer** | Looks for problems in a diff | Diff, spec | Comments only, no edits |
| **Researcher** | Gathers options and sources | Documents | A summary file with sources |
| **Doc writer** | Updates user docs | Final diff | Docs only |

A reviewer agent that cannot edit is safer than one that can. Separate roles also reduce a common failure: an agent grading its own work too kindly. Two agents can share blind spots, so a reviewer agent informs your review but does not replace it.

### Checkpoints

Do not send six agents away for the afternoon. Use checkpoints:

1. **After the plan.** Each agent posts its plan. You read all six in ten minutes and fix misunderstandings.
2. **Midway.** One quick look at progress and the files touched. Catch overlap early.
3. **At completion.** Review the diffs and check the criteria, one issue at a time.
4. **After integration.** Merge in order, then run the full test suite on the combined result.

### Integration is its own task

Six branches that each pass their tests can still fail together: a changed function name, two edits to a shared config, an order dependency. Treat integration as a step you check. Merge one, rebase the next, run the checks. Git hosts offer help: for example [merge trains](https://docs.gitlab.com/ci/pipelines/merge_trains/) test each change against the ones queued before it, so the default branch stays green. Some features depend on your plan, so check what you have.

### Keep a status board

A simple board in the planning repository is enough. Columns: Ready, Agent working, Needs review, Merged, Blocked. Each card is an issue with its branch, agent role, and owner. Use issues, labels and milestones for this, which work on the free plan. Move cards yourself. The board is your control panel and your record.

### Cost and limits

Agent runs use paid compute or plan limits. Decide a budget before you start many agents: a number of runs, a time limit, a stop rule ("if an agent fails twice, I take over"). Keep a log. Do not turn on automatic loops with no ceiling.

### One accountable human

However many agents run, one named person owns the outcome. In a team, say who. Their name goes in the merge request approvals. "The agents did it" is never an answer to a customer or a coach.

## 3. Step by step: orchestrate a small milestone

1. **Start from a milestone you wrote.** It has a goal, a date and a reason. See [People write epics](/library/people-write-epics).
2. **List the issues.** You may ask an agent to propose a breakdown. You decide which are real and which are missing.
3. **Check each issue** for independence, size, clarity, file overlap and checkability.
4. **Write the specs** (lesson 4) and put them in the issues.
5. **Draw the dependency list and the merge order.**
6. **Assign roles** and write each brief. Include branch name, files the agent may change, files it may not, tests to run, report format.
7. **Set the budget and stop rule.**
8. **Start the agents** on separate branches. Ask for plans first.
9. **Checkpoint 1:** read every plan. Correct.
10. **Let them build.** Watch the board.
11. **Checkpoint 2:** a short look for overlap and drift.
12. **Review each result** (lesson 7). Use a reviewer agent for hints if you like.
13. **Merge in order.** Rebase, test, merge, repeat.
14. **Run the whole test suite and try the product by hand.**
15. **Write the summary:** what shipped, what failed, what you learned. Add the AI-use disclosure.

## 4. Worked example: TrailMug

Maya wrote a milestone for TrailMug: "Spring launch of café sign-up in three countries, due 15 April". Four issues result:

| # | Issue | Role | Files it may change | Depends on |
|---|---|---|---|---|
| 14 | Phone check accepts local formats | Builder | `src/forms/` | none |
| 15 | Welcome email text in three languages | Builder, then human translator check | `content/email/` | none |
| 16 | Store sign-ups in the CRM (invented) | Builder | `src/api/` | 14 |
| 17 | Update the sign-up help page | Doc writer | `docs/` | 14, 15 |

Plus a **researcher** task: "List three open-source options for sending email, with licences and how active each project is. Write sources. Do not choose." And a **reviewer** role for each merge request.

She starts issues 14, 15 and the researcher at once. Plans arrive. The plan for issue 15 proposes to edit `src/forms/` to add a language switch. That is not in scope. Maya corrects it: "Only `content/email/`." The agent revises.

Midway, she checks the board. The researcher returned a summary with five sources. She opens each. One link is dead. Another project has no commit in three years. She marks both. She makes the choice herself: the email tool is a product and cost decision.

Issues 14 and 15 finish. She reviews them one by one, each with its criteria. A reviewer agent flags a possible problem in 14 that she verifies and confirms. She asks for a fix. Then she merges 14, rebases 16, and starts 16 and 17 on top.

At the end she runs the full tests and tries the sign-up on a phone, in each language. A heading on the help page still has the old phone example. She opens a new issue and fixes forward. The milestone ships on time. The summary lists what shipped, what the agents got wrong (a dead link, an out-of-scope file edit, a weak test), and the disclosure: agents built issues 14 to 17 and researched email options; Maya wrote the milestone and specs, reviewed every diff, chose the tool and verified the result.

## 5. Working with AI agents on this

**Delegate:** proposing a breakdown, building, testing, researching, reviewing for hints, documenting, summarising progress from branch history.

**Keep:** the milestone, the order, the specs, the role boundaries, the budget, the checkpoints, the merge decisions, the choice among researched options, and accountability. Do not ask an agent to decide which milestone matters, or what the customer needs.

**Prompt to propose a breakdown (you decide what to keep):**

```text
Here is a milestone I wrote: <paste>. Propose a breakdown into issues that
one agent could each finish in one change. For each: a one-line goal, the files
likely touched, dependencies on other issues, and how to check it. Flag any pair of
issues that would edit the same files. Do not add scope. Do not reorder the milestone.
```

**Brief for one builder in a multi-agent run:**

```text
You are the builder for issue <n>. Spec: specs/issue-<n>.md.
Branch: issue-<n>-<name>. You may change only: <paths>. Never change: <paths>.
Plan first and wait for approval. Add tests before code. Run <command>.
Do not install packages without asking. Other agents are working on other issues;
do not touch their files. Report per acceptance criterion: pass or fail and why.
```

**Brief for a reviewer:** use the hint-only prompt from lesson 7, and add "You may not edit any file."

**How to check the whole:** per-issue criteria, then integration tests, then trying the real product.

**Disclose** the use of each agent and role in the milestone summary. See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Starting too many agents at once.** Fix: begin with two or three until you can review quickly.
- **Overlapping files.** Fix: ownership rules and sequential runs for shared files.
- **No plan checkpoint.** Fix: read every plan before building.
- **Letting agents review themselves.** Fix: separate roles, and your own check.
- **Skipping integration tests.** Fix: test the combined result after each merge.
- **Unbounded loops and cost.** Fix: budget, stop rule, log.
- **Automating before understanding.** Fix: run it by hand first.
- **No accountable name.** Fix: one human owns the outcome.
- **Delegating the milestone.** Fix: write it yourself.

## 7. Practice

**Deliverable in git:** `orchestration/<milestone>/` containing `milestone.md` (yours), `board.md` (issue table with roles, branches, dependencies, merge order), one `brief-<n>.md` per issue, and `review-notes.md` (your verification and what went wrong).

1. Write a milestone in your own words with a goal, a date and a reason, for your own product or for TrailMug.
2. Break it into three or four issues. Check independence, size and file overlap. Write specs (lesson 4).
3. Write the board, the dependencies and the merge order.
4. Write the briefs. Include a researcher or reviewer role.
5. Run at least two agents in parallel on separate branches, plans first.
6. Hold the checkpoints. Record one thing you corrected in a plan.
7. Review, merge in order, run the full checks.
8. In `review-notes.md` list each issue's criteria with pass or fail, plus three things the agents got wrong and what you will change next time.
9. Commit in a merge request with a disclosure block.

## 8. Checklist

- [ ] The milestone is mine, in my words.
- [ ] Each issue is independent, small, clear, and checkable.
- [ ] File ownership and branch names are written in each brief.
- [ ] Plans were read before building.
- [ ] Roles are separate, and reviewers cannot edit.
- [ ] I merged in order and tested the combined result.
- [ ] I set a budget and a stop rule.
- [ ] One named human is accountable, and the disclosure is written.

## 9. Further learning

Read the Anthropic and OpenAI design guides together and notice their shared advice: keep it simple. Then try the AutoGen course or the Microsoft lessons to see multi-agent patterns in code, so you understand what you are directing. Return to the Claude Code best practices for habits that scale across sessions. Practise on small milestones until your review speed matches your agents' speed.
