---
title: "Context and instructions"
description: "Decide what an agent can see, keep that context small and relevant, and write a project instruction file that every session starts from."
section: "Working with AI agents"
order: 3
track: "working-with-ai-agents"
level: "core"
duration: "75 min"
outcomes:
  - "Explain what context is and why more is not always better"
  - "Choose what to put in front of an agent for a given task"
  - "Write a short project instruction file and keep it in git"
  - "Recognise and fix context problems: drift, stale notes, overload"
prerequisites:
  - "the-way-five-rules"
resources:
  - "anthropic/effective-context-engineering"
  - "anthropic/claude-code-best-practices"
  - "anthropic/prompt-engineering-overview"
  - "anthropic/writing-tools-for-agents"
  - "youtube-andrej-karpathy/deep-dive-into-llms"
updated: 2026-11-03
---

Lesson 3 of the track. In lesson 2 you learned to write one good prompt. In this lesson you learn to manage everything the agent sees across a whole task and across many sessions. It supports Developer week 4 and the Master Developer module on orchestrating agents.

## 1. Why this matters

Most bad agent results are not caused by a weak model. They are caused by a poor picture. The agent did not know the project uses a certain test tool, so it chose another. It did not know a folder was off limits, so it edited it. It was shown ten thousand lines of old chat, so it lost the goal.

Anthropic's engineering team calls the practice of managing this **context engineering**. Their article [Effective context engineering for AI agents](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) describes it as finding the smallest set of information that gives the best chance of the result you want. That sentence is the whole lesson. You have a limited desk (lesson 1). Put the right papers on it.

For a developer who owns a product, this is good news. You know the product better than any agent. Context is where your knowledge goes in.

A manager of agents controls what the agents know. Context and standing instructions are how your product knowledge reaches every agent, every session.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What is true about the product and the house rules, and which files are off limits | Drafting summaries and a first version of the instruction file | Running every listed command once; reading the file as a new colleague would | Engineering (commands, structure), security (secrets, protected files), operations (release rules) |

## 2. Key ideas, explained

### Everything the agent sees is context

The context for one step includes:

| Source | Example |
|---|---|
| Your current message | "Fix the phone check." |
| The conversation so far | Earlier messages, plans, results |
| Files the agent opened | `signup.js`, test files |
| Tool results | Test output, search results |
| Standing instructions | A project instruction file loaded at the start |
| Notes the tool saved earlier | Memory from earlier sessions, where a tool supports it |

You control the first and the fifth directly. The rest you shape by how you work.

### More is not better

A bigger context window sounds like free power. It is not. As the desk fills, relevant details are harder to find. Old instructions fight new ones. Failed attempts stay visible and the model may repeat them. Text you pasted "just in case" competes with text that matters.

Good context is:

- **Relevant.** Only what this task needs.
- **Clear.** Plain statements, not hints.
- **Fresh.** Old assumptions removed or corrected.
- **Findable.** Facts have a place the agent can look, such as a file with a clear name.

### Two places to put knowledge

1. **In the conversation.** Good for the task at hand. It disappears when the session ends.
2. **In the repository.** Good for anything that stays true: how to run tests, naming rules, which folders not to touch, what the product is. Put it in a file in git.

The second is powerful. A file in git is shared by every agent and every teammate. It is versioned. It is reviewed in a merge request. And it is your **project instruction file**.

### The project instruction file

Many coding agents read a standard file at the start of a session. The name differs by tool, so read your tool's documentation. The [Claude Code best practices](https://code.claude.com/docs/en/best-practices) describe such a file and what it should contain. The ideas apply to any tool.

A good instruction file is:

- **Short.** A page or two. If it is long, the important lines get lost.
- **About the project, not the world.** Things the agent could not guess.
- **Specific.** "Run `npm test` before every commit," not "write good code".
- **Maintained.** When an agent repeats the same mistake, add one line. When a line is no longer true, delete it.

What belongs in it:

1. **What this repo is**, in two sentences.
2. **How to build, run and test it**, as exact commands.
3. **Rules of the house**: branch names, commit message style, folders not to touch.
4. **Where things are**: a small map of the important folders.
5. **Things to never do**: never commit secrets, never push to the default branch, never change the epic files.
6. **How to report**: "End with a list of files changed and what you did not check."

What does not belong: long essays, marketing text, secrets, or anything that will be wrong next week.

### Give the agent a way to check itself

The most helpful context is a way to verify. If the agent can run the tests, it can see for itself when it is wrong. If it cannot, you are the test. The Claude Code guide lists this among its first tips, and it applies to every tool. So your instruction file should say how to run the checks. Lesson 5 builds on this.

### Keep sessions short and focused

One session, one task. When you start a different task, start a new session. If a session has gone off track, do not argue with it for an hour. Write down what you learned in a few lines, start fresh, and paste in those lines. A clean desk beats a crowded one.

### Summaries and notes

For longer work, ask the agent to write a short summary of where things stand: goal, what is done, what is left, decisions made. Save it in a file, or paste it into a fresh session. This keeps useful information while discarding clutter. Read the summary yourself. Models can summarise wrongly, and a wrong summary then misleads every later step.

### Tools are context too

When an agent can call tools, the tool descriptions are on the desk as well. Vague tool names and descriptions confuse the agent. The article [Writing effective tools for AI agents](https://www.anthropic.com/research/writing-tools-for-agents) covers this. You will meet it when you connect agents to your own systems. For now, remember that every tool you add makes the desk a little more crowded, so add only what the task needs.

## 3. Step by step: prepare context for a task

1. **Write the goal in one or two sentences.** What will be true when this is done?
2. **List what the agent must know that it cannot guess.** Commands, rules, formats, limits.
3. **Check whether it is already in the instruction file.** If yes, do not repeat it. If it should be, add it there.
4. **Point to the files that matter.** Name two or three files, not the whole repository.
5. **State the check.** "Done means `npm test` passes and the form accepts these five numbers."
6. **State the limits.** What must not change.
7. **Run the task.** Watch the early steps. If the agent reads the wrong files, correct it now.
8. **After the task, update the instruction file** if you learned something worth keeping.

## 4. Worked example: TrailMug

Maya's `trailmug-site` repo has no instruction file. Each session starts from nothing and she repeats herself. After a third time telling an agent to use Vitest and not to touch the `legal/` folder, she writes `AGENTS.md` in the repo (the name depends on your tool). Here is the whole file:

```text
# trailmug-site

TrailMug is a fictional reusable-cup subscription for cafés.
This repo is the public website and sign-up form. Plain JavaScript, built with Astro.

## Commands
- Install: npm ci
- Test: npm test   (Vitest)
- Lint: npm run lint
Always run test and lint before you say a task is done.

## House rules
- Work on a branch named issue-<number>-<short-name>. Never push to master.
- Commit messages: one short line, imperative ("Fix phone check").
- Do not edit anything under legal/ or content/epics/. People own those files.
- Never commit secrets or real customer data. Use the fake data in test/fixtures/.

## Map
- src/forms/   sign-up form and checks
- src/pages/   website pages
- test/        tests and fixtures

## When you finish
List the files you changed, what you tested, and anything you did not check.
```

It is 20 lines. It took ten minutes. In the next session, Maya says only: "Fix issue 14, the phone check rejects local formats." The agent finds the commands, avoids the protected folders and reports in the format she wants.

A week later the agent edits a file under `content/` that is not `content/epics/` but is still a customer-facing page. Maya adds one line: "Ask before editing anything under content/." The file is a living document. She changes it in a merge request, so the change is visible and reviewed.

Notice what she did not put in the file: the epic, the roadmap, the reasons behind her priorities. Those stay with her.

## 5. Working with AI agents on this

**Delegate:** drafting a first version of the instruction file from your repo (an agent can read the folders and package scripts and propose commands), drafting summaries, finding which files are relevant.

**Keep:** the rules of the house, the list of protected files, the definition of done, and the decision of what goes in the file. Review every line the agent proposes. An agent may invent a command that does not exist. Run each command once.

**Prompt you can adapt** to draft an instruction file:

```text
Read this repository. Draft a short instruction file (max 40 lines) for coding agents.
Include: what the repo is, exact commands to install, test and lint (check each in
package scripts or the README, do not invent), the folder map, and a section
"Questions for the owner" listing anything you could not determine.
Do not include secrets. Do not make up rules.
```

The "Questions for the owner" section is the gift. It shows you where your project is unclear.

**How to check:** run every command it lists. Compare the folder map with `ls`. Delete any line you cannot justify.

**Disclose:** the instruction file is part of the repo. If an agent drafted it, say so in the merge request, and say that you ran each command.

**One firm boundary.** Never put your epics or roadmap in the instruction file for the purpose of letting an agent change them. Protect them. See [People write epics](/library/people-write-epics).

## 6. Common mistakes and how to avoid them

- **Pasting the whole repo.** Fix: point at two or three files.
- **A very long instruction file.** The important rules get lost. Fix: keep it to a page or two and prune it.
- **Rules that are not true.** The agent follows them. Fix: review the file when commands change.
- **Instructions in a chat only.** They vanish. Fix: stable rules go in git.
- **Arguing with a lost session.** Fix: summarise, start fresh.
- **Not saying how to check.** The agent says "done" when it is not. Fix: state the command.
- **Secrets in the file.** Fix: never. Name where a secret lives, not its value.

## 7. Practice

**Deliverable:** an instruction file in a repository you own, plus a short evidence note.

1. Choose a small repo of yours. If you have none, create `trailmug-practice` with a README and one small script.
2. Write the instruction file by hand first. Follow the six headings in this lesson. Keep it under 40 lines.
3. Ask an agent to review it and to list questions. Do not let it rewrite the file. Decide what to take.
4. Run one small task twice: once with no instruction file, once with it. Write five lines on the difference.
5. Add `ai-log/03-context-notes.md` with the comparison.
6. Commit the instruction file and the note in a merge request. Add a disclosure block.

## 8. Checklist

- [ ] I can say what is on the agent's desk for a given task.
- [ ] I kept context relevant, and did not paste the whole repo.
- [ ] My instruction file is short, specific and true.
- [ ] It states how to build, test and lint, and I ran each command.
- [ ] It lists the files and folders agents must not change.
- [ ] It contains no secrets and no epics.
- [ ] I started a fresh session for a new task.

## 9. Further learning

Start with the context engineering article, then the Claude Code best practices. The long Karpathy talk helps you see why a model can only use what it can see. If you want to go deeper, the article on writing tools for agents shows how tool design shapes the desk. Practise by trimming your own instruction file once a month.
