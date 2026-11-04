---
title: "Git and GitLab"
description: "Enough depth in git and GitLab to direct agents and judge their work: read a diff, run a review, plan on the free plan, and fix forward."
group: "engineering"
order: 1
icon: "git-branch"
level: "foundation"
skills: [git-gitlab, open-source]
outcomes:
  - "Explain commits, branches and merges well enough to read what an agent changed"
  - "Run a merge request from issue to merge with review and protected branches"
  - "Plan work with issues, milestones and labels on the GitLab free plan"
  - "Isolate several agents with branches and worktrees, and fix forward when something breaks"
---

## In short

This track is for product people and developers in a team that uses git. You need no earlier experience. Git records every change. You can then compare, reject or fix what an agent did. You will learn to read a diff. You will say if it is small and safe. You will run a merge request from issue to merge, with review. You will plan work on the free GitLab plan.

You will give each agent its own branch and working copy. When something breaks, you fix forward. You make a new change. You do not erase history. On the agent ladder, protected branches and approvals are the gates for many agents.

### Key words

- **Git:** A tool that records every change to files.
- **Commit:** One saved step in git, with a message.
- **Branch:** A separate line of changes in git.
- **Merge request (MR):** A proposal to add a change to the main branch. Also called a pull request.
- **Diff:** A view of what changed between two versions of a file.
- **Fix forward:** Fix problems with a new change. Do not revert shipped work.

Git is the source of truth for everything you build at Developer Dojo. Plans, code, specs, prompts, evaluations and disclosures all live in it. If you direct AI agents, git is also your safety net: it records every change an agent makes, and lets you compare, reject or fix it.

This track does not try to turn you into a person who types git commands all day. The agents will type most of them. The goal is **enough depth to direct and judge agents**. You will be able to read a diff, understand a branch, run a proper review, plan work in GitLab, and keep control when several agents work at once.

## Who this is for

Product people and developers who need to work in a git-based team. Career changers who have never used git. Experienced developers who want a clear method for agent work. No earlier experience is required. A terminal helps, but the lessons also explain what each action means, so you can follow a diff in a web page.

## What you will be able to do

- Say what a commit, a branch, a merge and a remote are, in your own words.
- Read a diff and tell whether it is small, in scope and safe.
- Open, review, approve and merge a merge request, with a pipeline and a disclosure of AI use.
- Break a milestone into issues with labels, and track them on the free GitLab plan.
- Give each agent its own branch and working copy, and keep their work apart.
- Fix forward: repair a mistake with a new change, not by erasing history, and recover work that seems lost.

## The four lessons

| # | Lesson | What you learn |
|---|---|---|
| 1 | Git: the mental model | Snapshots, commits, branches, remotes, and how to read a diff |
| 2 | Branches and merge requests | The review flow, protected branches, approvals, code owners |
| 3 | Planning in GitLab | Issues, milestones and labels on the free plan, and where epics fit |
| 4 | History, worktrees and fixing forward | Parallel agents, recovery, signed commits, and the fix-forward rule |

## How it maps to the program

Lesson 1 supports Developer week 1, where you meet your product repository. Lesson 3 supports weeks 3 and 4, when problems become epics, milestones and issues. Lessons 2 and 4 support the Master Developer work on running agents through merge requests and keeping the platform in git. The track matches the rule "git is the source of truth" in [The Way](/library/the-way-five-rules), and [Fix forward](/library/fix-forward) is the subject of lesson 4.

## Free plan first

GitLab.com Free has issues, milestones, labels, boards and merge requests. It does not include epics or scoped labels, which are paid features. We teach the free plan first and say where a paid feature would help. Do not buy anything because of this track. Check each documentation page for the plan a feature needs.

## The running example

TrailMug, the fictional reusable-cup product for cafés, supplies the examples. Maya, the product owner, directs agents on issues in `trailmug-site`. All people and data are invented.

## Time needed

About 60 to 90 minutes a lesson, plus the exercises. The whole track takes about six to eight hours. Each lesson ends with a spec, an agent brief and review notes that you commit to your own repository.

## Pair it with

Take it next to [Working with AI agents](/library/tracks/working-with-ai-agents). Then continue to [CI/CD](/library/tracks/ci-cd), where a merge request starts a pipeline that proves the change. When you run several agents at once, protected branches and approvals become the gates that bound them; the advanced track Agent orchestration shows how.
