---
title: "History, worktrees and fixing forward"
description: "Run several agents without collisions using worktrees, recover from mistakes, handle a leaked secret, and fix forward instead of rewriting shared history."
section: "Git and GitLab"
order: 4
track: "git-and-gitlab"
level: "advanced"
duration: "90 min"
outcomes:
  - "Give each agent its own worktree and branch, and clean up afterwards"
  - "Recover work that seems lost using the reflog and the history"
  - "Explain why shared history is not rewritten, and what to do instead"
  - "Respond to a leaked secret: rotate first, then fix forward"
prerequisites:
  - "fix-forward"
  - "git-is-the-source-of-truth"
resources:
  - "git-scm/pro-git"
  - "gitlab/signed-commits"
  - "gitlab/secret-detection"
  - "mit-ocw/missing-semester-version-control"
  - "gitlab/protected-branches"
updated: 2026-11-03
---

Lesson 4 of the Git and GitLab track. It supports the Master Developer work on running several agents at once and on the rule [Fix forward](/library/fix-forward). It assumes you can read a diff (lesson 1) and run a merge request (lesson 2).

## 1. Why this matters

Things go wrong. An agent deletes a file. Two agents edit the same folder. Someone commits a key. A change ships and breaks sign-up. What matters is what you do next. Panic leads to rewriting history, force pushing and making a small problem into a large one.

Git is built to keep history. Used well, it gives you a calm way through almost every mistake. The Way's rule is to **fix forward**: repair with a new, reviewed change instead of erasing what happened. This lesson shows how, and gives you the one habit that makes parallel agents safe, the worktree.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| How many agents run at once, where each works, what counts as an emergency, when to stop the harm | Creating worktrees, finding a lost commit, drafting the forward fix and the new test | Reading the history after the fix, confirming the old secret is revoked, checking that a test now guards the failure | Security (rotation, incident), operations (impact on users), communication (telling affected people), legal (data exposure) |

## 2. Key ideas, explained

### Worktrees: one repository, many working copies

Normally a repository has one working tree, the folder where files sit. If you change branches, all your files change. That is a problem when two agents need to work at once: they would overwrite each other's files.

A **worktree** is an extra working folder linked to the same repository, with its own branch checked out. Create one with:

```text
git worktree add ../trailmug-issue-14 -b issue-14-phone-check
```

Each agent gets its own worktree and branch. They share one history but not one set of files. When the branch has merged, remove the worktree:

```text
git worktree remove ../trailmug-issue-14
```

Rules that keep it tidy: one worktree per branch, named after the issue; created in a known place, not scattered; removed when the branch is merged. This is how the Dojo's own repositories are managed: no ad-hoc extra clones, and worktrees go away after merge. The Git manual page for [git worktree](https://git-scm.com/docs/git-worktree) explains every option.

### The history is a record, not a draft

On your own private branch, you may tidy history freely. On a **shared** branch, history is a record that others rely on. **Rewriting** it (with commands like `git rebase` on pushed work, `git reset --hard` followed by a force push, or `git commit --amend` after pushing) makes other people's copies disagree with yours.

The rule: **never rewrite shared history, and never force push to a protected branch.** Protect the default branch so that this cannot happen (lesson 2, and the [protected branches documentation](https://docs.gitlab.com/user/project/repository/branches/protected/)).

### Fix forward

To **fix forward** means to correct a problem by adding a new change on top, with its own issue, branch, merge request, review and test. You do not revert the shipped work to hide the problem. Reasons:

- The history shows what really happened, which is how teams learn.
- A revert is itself a change and can break other things built on top.
- The real cause stays unfixed, and the same bug returns.
- A new test added with the fix stops the class of mistake from coming back.

After each fix, ask: what gate would have caught this? Add that gate: a test, a pipeline check, a review rule. See [Fix forward](/library/fix-forward).

The only exception is **active harm**: a leaked secret, data loss in progress or a customer-facing outage. Even then, stop the harm first (for example, switch off a feature or revoke a key), and then fix forward so the feature returns.

### Undo choices, from safe to risky

| Situation | Safe move |
|---|---|
| Edited a file, want the old version, not committed | `git restore <file>` |
| Staged the wrong file | `git restore --staged <file>` |
| Local commit not pushed, want to change it | Amend or reset on your private branch |
| Bad change already merged | A new fix branch and MR (fix forward) |
| Branch got messy and was never shared | Delete it and start again from the spec |
| Pushed a secret | Revoke the secret first, then clean up (below) |

The Missing Semester lecture on [Version Control (Git)](https://missing.csail.mit.edu/2020/version-control/) is a good short companion for the commands.

### The reflog: your safety net

Git keeps a private log of where your branch tips have been, called the **reflog**. Even if you think you lost a commit, `git reflog` often lists it, and you can create a branch at that commit to get it back. Think of it as an undo history that lives on your machine for a while. It is local, so it does not help for work that was never on your machine.

### A leaked secret

If a password, token or key is committed, it is in the history, and if pushed, copies may exist. Deleting the file in a later commit does not remove it. The response, in order:

1. **Revoke or rotate the secret now.** Replace it with a new value and disable the old. This is the real fix, and it comes first.
2. **Check for misuse.** Look at the service's logs for use of the old secret.
3. **Tell the owner,** and your mentor or the responsible person.
4. **Fix forward:** remove the secret from the code, read it from a secret manager at run time, and add a pipeline check. GitLab's [secret detection](https://docs.gitlab.com/user/application_security/secret_detection/) can scan for committed secrets; check which parts your plan includes.
5. **History cleanup** (rare, and done by someone experienced, with the team's agreement) only after rotation. Cleaning history does not make a leaked secret safe again.
6. **Write a short note:** what happened, what was affected, what gate you added.

### Signed commits

A **signed commit** carries a cryptographic signature that proves it came from the holder of a key. GitLab can show a "Verified" badge. See the [signed commits documentation](https://docs.gitlab.com/user/project/repository/signed_commits/). Signing helps answer "did this really come from this person?" It does not prove the content is good. Agents that commit on your behalf need clear rules about whose key signs what. Decide this with your mentor or security lead before you rely on it.

### Tags and releases

A **tag** is a permanent name for a commit, such as `v1.2.0`. Releases and deployments often point at tags so that everyone agrees which version is live. Create tags through the same reviewed process as code.

### Cleaning up

Merged branches and worktrees pile up. Delete them after merge. A clean list of branches is easier to understand, and stale branches confuse agents that read the repo.

## 3. Step by step: run two agents in parallel

1. **Prepare two ready issues** that touch different files (see the AI track lesson on orchestrating agents).
2. **Create a worktree and branch for each** in a known folder. Name them after the issues.
3. **Open an agent session in each worktree.** Check that each loads the instruction file.
4. **Ask each for a plan first.** Read both. Fix overlaps.
5. **Let them build.** Look at `git status` and `git log` in each worktree during the work.
6. **Review each branch** through its merge request.
7. **Merge one, update the other:** fetch the default branch, merge or rebase on your *private* branch, and re-run the checks.
8. **Merge the second.**
9. **Remove both worktrees and delete the branches.**
10. **Check the default branch:** tests pass, nothing unexpected.

## 4. Worked example: TrailMug

Maya runs two agents: issue 14 (phone check) and issue 15 (welcome email text). She creates worktrees `../tm-14` and `../tm-15`. In each, an agent builds. Issue 15's plan proposes editing `src/forms/`, which belongs to issue 14. She corrects it before any code is written.

Both merge. A week later a customer test reveals that numbers with a leading zero and a plus sign confuse the check. Maya does not revert issue 14. She opens issue 22, writes a spec with the failing example, directs an agent on a new branch to add a failing test and then the fix, reviews and merges. The gate she adds: the phone test file now has a table of formats, and the contribution rule says "every phone bug adds a row".

Then a worse day: an agent commits a file `.env.local` containing a test API key for a third-party service (invented for this lesson). The pipeline's secret scan flags it. Maya follows the steps. She revokes the key in the service and creates a new one stored in the secret manager. She checks the service log: no use of the old key outside the pipeline. She tells her mentor. She opens a forward-fix issue: remove the file, add `.env*` to `.gitignore`, add a line to the instruction file, "never create or read .env files", and keep the secret scan as a required pipeline check. Only then does her mentor decide whether history cleanup is worth it. Maya does not try to rewrite the shared history alone.

The harm was small because the response had a known order: stop the harm, then fix forward, then add a gate.

## 5. Working with AI agents on this

**What the PDM decides:** how many agents run at once, the rule for worktrees, what is an emergency, what counts as shared history, who owns each incident.

**Delegate:** creating and removing worktrees, finding commits in the reflog, drafting the issue and test for a forward fix, drafting the incident note from facts you give.

**Verify:** you read what is in the history after the fix, you confirm the old secret is revoked (not only removed from code), and you check that a new test fails before the fix and passes after.

**Prompt to give an agent safe git rules:**

```text
Git rules for this session. Work only in this worktree and branch. Never run
git push --force, git reset --hard, git rebase on pushed commits, or git clean -fd.
Never commit to the default branch. Never create or read .env files or any file
that may contain secrets. If you think history needs rewriting, stop and ask me.
If something goes wrong, do not try to hide it with a revert; tell me, and
propose a forward fix with a test.
```

**Prompt for a forward-fix issue draft (you review it):**

```text
Here is a bug report and the commit that introduced it. Draft an issue with:
the failing example, expected behaviour, acceptance criteria, a failing test to
write first, and one gate (test or check) that would prevent this class of bug.
Do not propose reverting. Use only facts below.
```

**Disclose** in the forward-fix MR which parts the agent drafted.

## 6. Common mistakes and how to avoid them

- **Two agents in one working folder.** Fix: a worktree each.
- **Force pushing to "clean up".** Fix: never on shared branches; protect the branch.
- **Deleting the secret file and calling it done.** Fix: rotate first.
- **Reverting a bug to look tidy.** Fix: fix forward with a test.
- **Leaving worktrees and branches behind.** Fix: remove after merge.
- **Believing the agent when it says "I fixed history".** Fix: look at the log yourself.
- **No gate after a failure.** Fix: ask what would have caught it, and add it.

## 7. Practice

**Deliverable in git:** `specs/hist-04.md`, `briefs/hist-04.md`, `reviews/hist-04.md`, and a note `docs/incident-drill.md`.

1. Create two small, independent issues in your practice repository, with specs.
2. Create two worktrees and branches. Direct two agents in parallel, plans first, using the git rules prompt.
3. Review and merge both in order. Remove the worktrees and delete the branches.
4. Hold a drill with fake data only: add a file containing the text `FAKE-KEY-123` on a branch. Write `docs/incident-drill.md` answering: what would you rotate, in what order, who do you tell, what gate would you add. Do not use any real key, and do not push it to a shared repository.
5. Introduce a small bug on purpose in a second branch, merge it, and fix forward with a new test and a recorded gate.
6. In `reviews/hist-04.md`, record what each agent did, what you corrected, and what the gate is.
7. Commit in a merge request with a disclosure block.

## 8. Checklist

- [ ] Each parallel agent had its own worktree and branch.
- [ ] I removed worktrees and branches after merge.
- [ ] Nobody force pushed shared history.
- [ ] My secret response starts with rotation.
- [ ] I fixed forward with a test and a recorded gate.
- [ ] I know what the reflog is for.
- [ ] My drill note is committed, and used no real secrets.

## 9. Further learning

Read the Pro Git chapters on branching and on undoing things, then the Missing Semester lecture for a second explanation. The GitLab pages on signed commits and secret detection show the tools that support safe history. Your best practice is the drill: do it once on purpose, so the first real time is calm.
