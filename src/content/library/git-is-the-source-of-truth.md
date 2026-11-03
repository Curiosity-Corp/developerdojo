---
title: "Git is the source of truth"
description: "Why plans, decisions, content and settings live in git, and what that means every day."
section: "The Way"
order: 3
---

**Rule 2: git is the source of truth.**

**Git** is a tool that records every change to a set of files: who changed what, when and why. A **repository** (repo) is a folder tracked by git. A hosting service such as GitLab or GitHub keeps a shared copy so a team can work together.

## What the rule means

If it is not in git, it is not decided, not planned and not done.

- Plans, epics, roadmaps and decisions are in git (or in the issue tracker of your git host).
- Code, content, designs and documents are files in a repo.
- Settings that describe how a system runs are files too. We call this *everything as code*.
- Secrets are the one exception. A secret is a password or key. It never goes in git. Only its *name* goes in git. The value lives in a secret store.

## Why git

1. **History.** You can see who changed what and why.
2. **Review.** A change is proposed first. Another person reads it before it merges.
3. **Sharing.** Access comes from project membership, not from one person's account.
4. **Trust.** A file in git cannot be quietly changed. A chat message can be forgotten.
5. **Agents can read it.** AI agents work from the files you give them. If the plan is in someone's head, the agent guesses.

## The everyday flow

1. Open an **issue** that says what you want and why.
2. Create a **branch**, a separate line of changes.
3. Make the change and commit it. A **commit** is one saved step with a message.
4. Open a **merge request** (MR, also called a pull request). It proposes the change and holds the review.
5. A **pipeline** runs: automatic tests and checks.
6. When the pipeline is green and a person approves, you merge.
7. The merge request stays as the record of the change.

## What not to do

- Do not keep the real plan in a chat thread or a private document. Put it in the repo.
- Do not change a live system by hand and forget to update git. The next person will not know.
- Do not paste passwords, keys or customer data into git, issues or screenshots.
- Do not edit one shared copy of a document that nobody can review. Use a branch.

## Key points

- Git holds the truth. Chat and memory do not.
- Every change is proposed, reviewed and recorded.
- Secrets stay out. Names only.
