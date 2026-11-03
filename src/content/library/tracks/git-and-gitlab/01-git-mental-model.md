---
title: "Git: the mental model"
description: "Snapshots, commits, branches and remotes in plain words, and how to read a diff so you can judge what an agent changed."
section: "Git and GitLab"
order: 1
track: "git-and-gitlab"
level: "foundation"
duration: "75 min"
outcomes:
  - "Explain a commit, a branch, a merge and a remote in your own words"
  - "Read a diff and say whether the change is small, in scope and safe"
  - "Use five basic commands to look around a repository"
  - "Direct an agent to make a change and verify it from the history"
prerequisites:
  - "git-is-the-source-of-truth"
resources:
  - "git/pro-git"
  - "mit-ocw/missing-semester-version-control"
  - "git-scm/learn-git-branching"
  - "youtube-freecodecamp/git-and-github-for-beginners-crash-course"
  - "gitlab/common-git-commands"
updated: 2026-11-03
---

Lesson 1 of the Git and GitLab track. It supports Developer week 1, when you first meet your product repository, and the rule in [The Way](/library/the-way-five-rules) that git is the source of truth.

## 1. Why this matters

Every agent you direct will change files. Git is how you see exactly what changed, who or what changed it, when, and why. You cannot judge an agent's work without being able to read that record. You also cannot undo mistakes calmly without knowing how the record works.

The 2030 Product Development Manager does not need to memorise commands. They need a correct picture, and enough fluency to read a diff the way an editor reads a marked-up page.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What goes in the repository, who may change which files, what counts as a clean history | Running git commands, writing commit messages, creating branches | Reading the diff and the history, checking that only intended files changed | Security (no secrets in history), legal (licences of added files), operations (what deploys from which branch) |

## 2. Key ideas, explained

### A repository is a folder with a memory

A **repository** (repo) is a folder of files plus a complete record of every earlier version. The record lives in a hidden folder called `.git`. Because it keeps every version, you can compare any two points in time and go back to either.

### A commit is a labelled snapshot

A **commit** is a snapshot of all the files at one moment, with a message, an author and a date. Commits form a chain. Each commit points to the one before it. The chain is the **history**.

```text
A --- B --- C --- D      (each letter is a commit; D is the newest)
```

Each commit has a long ID, a hash such as `3f9c2ab...`. Usually the first seven characters are enough to name it.

A good commit is small, has one purpose, and has a message that says what and why: "Fix phone check to accept spaces". Small commits make review easy and mistakes easy to find.

### The three places a change lives

Git has three stages, and beginners often miss the middle one.

| Place | Name | Meaning |
|---|---|---|
| Your files | **Working tree** | What you see and edit now |
| The waiting room | **Staging area** (index) | What will go into the next commit |
| The record | **Repository** | Commits already saved |

You edit files, then **stage** the ones you want (`git add`), then **commit** (`git commit`). Staging lets you choose which edits belong together.

### A branch is a movable label

A **branch** is a name that points to a commit. When you commit on a branch, the name moves forward. The default branch is usually called `main` or `master`. It should always hold work that is good enough to ship.

```text
A --- B --- C            master
             \
              D --- E    issue-14-phone-check
```

Branches are cheap. You create one for each task. Work on it freely. If it goes wrong, throw the branch away. The default branch was never touched. That is why every agent works on a branch.

### A merge brings branches together

A **merge** combines the work of one branch into another. If the two branches changed different parts, git joins them automatically. If both changed the same lines, there is a **conflict**, and a person (or an agent that you then review) must decide which version to keep.

### A remote is a shared copy

A **remote** is a copy of the repository on a server, such as GitLab. The usual name is `origin`. You **push** your commits to share them, and **pull** or **fetch** to get others' commits. A **clone** is your first full copy.

The remote is where review, pipelines and sign-off happen. Your laptop is a working copy. The remote is the place of record.

### How to read a diff

A **diff** shows the difference between two versions. This is the most useful reading skill you will learn in this track. A diff looks like this:

```diff
diff --git a/src/forms/signup.js b/src/forms/signup.js
--- a/src/forms/signup.js
+++ b/src/forms/signup.js
@@ -12,6 +12,8 @@ export function isValidPhone(value) {
-  return /^\+[0-9]{8,15}$/.test(value);
+  const cleaned = value.replace(/[\s()\-]/g, '');
+  if (cleaned.length > 20) return false;
+  return /^\+?[0-9]{8,15}$/.test(cleaned);
 }
```

How to read it:

- The file name is at the top. Check that the file is one you expected.
- Lines starting with `-` (red) were removed. Lines starting with `+` (green) were added. Lines with no sign are context.
- `@@ -12,6 +12,8 @@` says where in the file: old lines 12 to 17, new lines 12 to 19.
- Read the removed lines first ("what was there"), then the added lines ("what is there now").

You do not need to know every language. Ask of each block: what does this do, is it in scope, could it be dangerous? Questions about data, money, permissions, secrets and deletions deserve extra attention. When you cannot answer, ask the agent to explain, then check the explanation.

### Five commands to look around

| Command | What it shows |
|---|---|
| `git status` | Which files changed, which are staged, which branch you are on |
| `git log --oneline` | The history, one line per commit |
| `git diff` | Changes not yet staged. `git diff --staged` shows staged changes. |
| `git show <commit>` | One commit's message and diff |
| `git branch` | The branches and which one you are on |

These are all read-only. They cannot hurt anything. Use them freely. The [Common Git commands](https://docs.gitlab.com/topics/git/commands/) page in the GitLab docs lists more.

### What git is not

Git is not a backup of things you never committed. Uncommitted work lives only in your working tree. It is not good for large binary files. And it is not private by default: anything you push, including a secret, is in the history for everyone with access. Lesson 4 covers what to do if that happens.

## 3. Step by step: look inside a repository

1. **Clone** a repository (your practice repo): `git clone <address>`. Move into the folder.
2. Run `git status`. Which branch are you on? Is anything changed?
3. Run `git log --oneline`. Read the last ten messages. Do they tell a story?
4. Pick one commit. Run `git show <id>`. Read the diff using the steps above.
5. Create a branch: `git switch -c practice-1`.
6. Edit one file. Run `git status` and `git diff`.
7. Stage and commit: `git add <file>` then `git commit -m "Describe what and why"`.
8. Run `git log --oneline` again. Your commit is on the new branch.
9. Run `git switch master` (or `main`). Your change is not there. Switch back. It is.
10. Push the branch: `git push -u origin practice-1`. Open the project in GitLab and find it.

The interactive game [Learn Git Branching](https://learngitbranching.js.org/) shows these ideas on a diagram. The lecture [Version Control (Git)](https://missing.csail.mit.edu/2020/version-control/) from MIT's Missing Semester explains why git works this way, and the free book [Pro Git](https://git-scm.com/book/en/v2) is the reference you will return to.

## 4. Worked example: TrailMug

Maya has cloned `trailmug-site`. Before she lets an agent change anything, she looks around. `git log --oneline` shows twenty commits. The messages range from "Fix phone check" to "stuff". She notes that "stuff" tells her nothing, and she makes a rule for the repo's instruction file: one-line messages in the imperative, saying what and why.

She directs an agent: "Create a branch `issue-14-phone-check`. Make the change from specs/issue-14.md. Commit in small steps with clear messages." Afterwards she runs three commands.

```text
git log --oneline master..issue-14-phone-check
git diff --stat master...issue-14-phone-check
git diff master...issue-14-phone-check
```

The first lists only the new commits: three, with clear messages. The second lists files changed: `signup.js`, `signup.test.js`. Two files, as expected. The third shows the diff. She reads the removed lines (the old single pattern), then the added lines. She checks the new test file first, as lesson 7 of the AI track teaches.

Everything is as the spec said. If `package-lock.json` had appeared in the list, she would have stopped and asked why.

## 5. Working with AI agents on this

**What the PDM decides:** the repository layout, the branch rule (never the default branch), the commit message style, what must never be committed.

**Delegate:** running git commands, creating branches, writing commit messages, summarising a long history, explaining a diff.

**Verify:** read the list of changed files and the diff yourself. The agent's summary is a guide, not proof.

**Prompt to direct an agent safely:**

```text
Work on a new branch named issue-<n>-<short-name>, created from the current
default branch. Never commit to the default branch. Make small commits, each with
a one-line imperative message that says what and why. Do not use force push.
Do not change files outside <paths>. When finished, run: git log --oneline and
git diff --stat against the default branch, and show me the output.
```

**Prompt to understand a diff you do not follow:**

```text
Explain this diff line by line for a non-programmer. For each hunk say what
changed, why it might have been done, and what could go wrong. Say what you
are unsure about.
<paste diff>
```

Check its claims against the diff. An explanation can be fluent and wrong.

**Disclose:** in the merge request, say that an agent made the commits, and what you checked. See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Working on the default branch.** Fix: a branch per task.
- **Giant commits with vague messages.** Fix: small commits, clear messages.
- **Committing everything with `git add .` without looking.** You may add secrets or build files. Fix: check `git status` and `git diff --staged` first.
- **Not reading the file list of a change.** Fix: always start from the list.
- **Confusing local and remote.** A local commit is not shared until you push. Fix: check `git status` for "ahead of origin".
- **Force pushing over shared history.** Fix: do not. Lesson 4 explains why.
- **Committing secrets.** Fix: keep them out; see the security track.

## 7. Practice

**Deliverable in git:** `specs/git-01.md`, `briefs/git-01.md`, `reviews/git-01.md` and a merge request.

1. In your practice repository, write a spec by hand for a tiny change: add a `CONTRIBUTING.md` that states your branch and commit message rules. Give it three acceptance criteria.
2. Write a brief for an agent: branch name, files it may touch, commit style, what it must report.
3. Direct the agent to do it on a branch.
4. Verify: run `git log --oneline`, `git diff --stat` and `git diff` against the default branch. In `reviews/git-01.md` answer: which files changed, are they the expected ones, are the messages clear, anything surprising.
5. Open a merge request. In the description add a disclosure block.
6. Explain the diff to a partner without notes.

## 8. Checklist

- [ ] I can explain commit, branch, merge, remote and diff in my own words.
- [ ] I can read a diff and find removed and added lines.
- [ ] I check the file list before reading any code.
- [ ] Agents work on a branch, never on the default branch.
- [ ] My commit messages say what and why.
- [ ] I did not commit any secret or build output.
- [ ] My practice files are committed with a disclosure block.

## 9. Further learning

Do the Learn Git Branching levels first. Then read the first three chapters of Pro Git, and watch the freeCodeCamp crash course if you prefer video. The ideas are the same on GitLab and GitHub. Keep the Common Git commands page open in the first month, and expect to need it less each week.
