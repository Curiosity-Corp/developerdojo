---
title: "Branches and merge requests"
description: "Run the review flow from branch to merge: the merge request as a change record, protected branches, approvals, code owners and a review you can defend."
section: "Git and GitLab"
order: 2
track: "git-and-gitlab"
level: "core"
duration: "75 min"
outcomes:
  - "Open a merge request that explains what, why, how it was checked and how AI was used"
  - "Review a merge request with a method and decide approve, ask for changes or reject"
  - "Protect the default branch and require approval"
  - "Choose a merge method and know why history stays clean"
prerequisites:
  - "git-is-the-source-of-truth"
resources:
  - "gitlab/merge-requests"
  - "gitlab/protected-branches"
  - "gitlab/merge-request-approvals"
  - "gitlab/codeowners"
  - "atlassian/git-tutorials"
  - "conventionalcommits/conventional-commits"
updated: 2026-11-03
quiz:
  - question: "What do you write in the merge request description so that the issue closes by itself when the merge request is merged?"
    options:
      - "Closes #14"
      - "See issue 14 later"
      - "issue-14-phone-check"
      - "Ready for review"
    answer: "Closes #14"
    why: "The link keeps the issue and the merge request joined. When the merge request is merged, the issue closes by itself."
  - question: "Why do you open a merge request as a draft while work is in progress?"
    options:
      - "A draft cannot be merged, and it tells reviewers not to look yet."
      - "A draft is approved automatically."
      - "A draft skips the pipeline."
      - "A draft hides the merge request from the author."
    answer: "A draft cannot be merged, and it tells reviewers not to look yet."
    why: "Mark it ready when the checks pass and you have read the diff yourself."
  - question: "Which rule matters most when an agent is the author of a change?"
    options:
      - "The agent's own approval is enough."
      - "The author of a change must not be its only approver."
      - "Small changes need no approval."
      - "Approval is only possible on a paid plan."
    answer: "The author of a change must not be its only approver."
    why: "When an agent is the author, the human approver is not a formality. They are the control."
  - question: "What does a protected default branch do?"
    options:
      - "Nobody can push to it directly or force-push, so changes arrive only by merge request."
      - "It stops commits on every branch."
      - "It stops the pipeline from running."
      - "It stops reviewers from commenting."
    answer: "Nobody can push to it directly or force-push, so changes arrive only by merge request."
    why: "Even a confused or tricked agent cannot write to the default branch."
---

Lesson 2 of the Git and GitLab track. It supports Developer week 4 (agents in practice) and the Master Developer module on running agents through merge requests, where the merge request is also the change record. See [Service management in git](/library/itil-in-git).

## 1. Why this matters

A **merge request** (MR) is a proposal to bring one branch into another, with a place to discuss, review and check it. On GitHub the same thing is called a pull request. In a team that works with agents, the merge request is where control happens. The agent proposes. People review. A pipeline checks. Only then does the change join the default branch.

If you skip the merge request, you lose the one moment where a human looks at what the agent did. If you do it well, you get review, a record, automatic checks and a place to disclose AI use, all in one page.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Who may merge, how many approvals, which checks are mandatory, what a good description contains | Opening the MR, drafting the description from the diff, first-pass review comments | Reading the description against the diff, checking the pipeline, applying the review method | Security (who can approve what), operations (release timing), design (visible changes), legal (licences) |

## 2. Key ideas, explained

### The flow

```text
issue -> branch -> commits -> push -> merge request -> pipeline + review
      -> approval -> merge -> (deploy) -> issue closes
```

One issue, one branch, one MR. The MR description says "Closes #14", and when the MR is merged, the issue closes by itself.

### What a good merge request contains

| Part | What it says |
|---|---|
| **Title** | What changes, in a short imperative sentence |
| **Link** | `Closes #14` so the issue and the MR stay joined |
| **What and why** | Two or three sentences for a human reader |
| **How it was checked** | Tests run, pipeline link, what you tried by hand |
| **AI use** | What the agent did, which tool, what you decided and checked |
| **Risk and recovery** | What could go wrong, and how you would fix forward |
| **Not checked** | Honest gaps |

In a team that follows the Dojo's rules, the MR also acts as the change record: it holds the reason, the diff, the review, the pipeline results and the merge time. See the [Change Record template](/library/template-change-record). A small template saves the description from being blank. GitLab lets you store MR description templates in the repository. Read the [merge requests documentation](https://docs.gitlab.com/user/project/merge_requests/) for how.

### Draft first

Open the MR as a **draft** while work is in progress. A draft cannot be merged, and tells reviewers not to look yet. Mark it ready when the checks pass and you have read the diff yourself.

### Protected branches

A **protected branch** is a branch with rules that stop risky actions. For the default branch, protect it so that:

- Nobody can push directly. Changes arrive only by merge request.
- Nobody can force-push. A **force push** rewrites shared history and can destroy other people's work.
- Only chosen roles can merge.

The [protected branches documentation](https://docs.gitlab.com/user/project/repository/branches/protected/) shows the settings. This is the single most useful guardrail when agents have access to a repository: even a confused or tricked agent cannot write to the default branch.

### Why this is the bound on agent work

Protected branches, required approvals and required pipelines are the **gates** that limit what any agent can do, whatever it was told. One agent working on one issue is delegation. Several agents working at once is orchestration, and then these gates carry the load, because you cannot watch every session. Writing the gates down as policy and running them for a whole fleet is taught in the advanced track Agent orchestration.

### Approvals and code owners

An **approval** is a person's recorded yes. You can require a number of approvals before merging. Some approval features, such as required approval rules, depend on the plan, so read the [approvals documentation](https://docs.gitlab.com/user/project/merge_requests/approvals/) for what your plan offers. Even if the tool cannot enforce it, you can enforce it by rule: nobody merges their own work.

A **CODEOWNERS** file names the people or roles who own parts of the repository, for example "the legal folder belongs to the legal lead". See [Code Owners](https://docs.gitlab.com/user/project/codeowners/). On some plans it can force a review by an owner. On any plan it documents who should look.

The rule that matters in an agent world: **the author of a change must not be its only approver**. When an agent is the author, the human approver is not a formality. They are the control.

### Review is a method

Use the method from the AI track lesson on [reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output): right change, correct, safe. Read the file list. Read the tests. Read the code. Run it. Then decide.

Write review comments as specific, checkable requests. "Line 42 swallows the error. Throw it, and add a test for the failure" beats "this is wrong". Use the threads: each comment can be resolved when addressed.

### Merge methods and clean history

When a branch is merged, GitLab can do it in different ways: a merge commit that records the join, a fast-forward that keeps a straight line, or a **squash** that combines all the branch's commits into one. Atlassian's [Git tutorials](https://www.atlassian.com/git/tutorials) compare these. A simple rule: squash small agent branches so history has one clean commit per issue, unless the individual commits tell a story worth keeping. Pick one rule for the repo and write it down.

### Commit message conventions

A shared style makes history readable by people and tools. The [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification is a popular one: `fix: accept spaces in phone numbers`. You may use it or a simpler rule. What matters is that the rule is written in the instruction file and checked in review.

### Keep merge requests small

A small MR gets a careful review. A large MR gets a skim. The best protection against bad agent work is to keep each change small enough to read in ten minutes. If an agent produces a huge change, send it back and ask for smaller pieces.

### Conflicts

If two branches changed the same lines, the second MR has a **conflict** and cannot merge until it is resolved. You can ask an agent to resolve it, but then you must review the resolution carefully, because the agent is choosing between two people's work. A calm way to avoid conflicts is to merge small changes often, and to give each agent separate files (see the AI track lesson on [orchestrating multiple agents](/library/tracks/working-with-ai-agents/06-orchestrating-multiple-agents)).

## 3. Step by step: from branch to merge

1. **Start from an issue** with a spec.
2. **Create a branch** `issue-<n>-<name>` from the up-to-date default branch.
3. **Make small commits** with clear messages.
4. **Push** the branch and **open a draft MR**.
5. **Write the description** with the parts above, including AI use. Add `Closes #<n>`.
6. **Let the pipeline run.** Fix failures on the same branch.
7. **Read your own diff** in the MR page before asking anyone else.
8. **Mark ready** and request a review.
9. **Reviewer:** apply the method. Comment. Approve or request changes.
10. **Address comments** with new commits, and resolve threads.
11. **Merge** only when the pipeline is green and an approver other than the author has approved.
12. **Check the result:** the issue closed, the deployment (if any) is healthy.
13. **Delete the branch** and any extra worktree.

If something is wrong after merge, do not erase it. Open a new issue and fix forward ([Fix forward](/library/fix-forward)).

## 4. Worked example: TrailMug

In the TrailMug repository, Maya has protected `master`: no direct pushes, no force pushes, merge only through an MR. She wrote `CONTRIBUTING.md` and an MR template.

Her coding agent finished issue 14 on `issue-14-phone-check`. The agent opened a draft MR with this description, which Maya then edited:

```text
Closes #14

What and why
The phone check rejected numbers typed with spaces or brackets, which blocked two
of five café owners I interviewed. It now cleans spaces, brackets and dashes first.

How checked
Pipeline green (link). npm test: 14 pass. Tried three numbers in the preview site.

AI use
Coding agent drafted the change and six tests. I wrote the spec and decided which
formats are valid. I read every line and rejected a first attempt that added a
dependency.

Risk and recovery
Low. If numbers are wrongly rejected, fix forward with a new test and change.

Not checked
Numbers with extensions ("ext 12"), out of scope for this issue.
```

A teammate, Ravi (an invented colleague), reviews it. He reads the file list (two files), the tests, then the code. He asks one question in a thread: "What happens with a number of 25 digits?" The agent's test covers it. He tries it in the preview. He approves.

The pipeline is green. Maya cannot merge her own MR alone because the protected branch requires an approval from someone else, and she has no way around it. After Ravi approves, she squashes and merges. Issue 14 closes by itself. She deletes the branch. The whole record, spec, diff, review, checks and AI disclosure, sits on one page.

## 5. Working with AI agents on this

**What the PDM decides:** the rules of the repository (protected branch, approvals, merge method), the content of the MR template, who approves, and when a change is ready.

**Delegate:** opening a draft MR, drafting the description from the diff and the spec, running the pipeline, a hint-only first review, resolving simple conflicts.

**Verify:** you rewrite or confirm the "what and why", "AI use" and "not checked" lines. The agent does not know what you decided or checked, so it must not write those lines from its own guess.

**Prompt to draft an MR description:**

```text
Draft a merge request description from this diff and spec, using the headings:
What and why, How checked, AI use, Risk and recovery, Not checked.
Use only facts in the diff, the test output and the spec. For AI use, write only
"<fill in by owner>". Do not claim anything was tested unless the output below shows it.
```

**Prompt for a hint-only first review** (you still review):

```text
Review this diff against the spec. List up to eight possible problems by risk:
wrong behaviour, missing edge cases, weakened or removed tests, new dependencies,
silent error handling, secrets, changes outside the spec. Name file and line.
You may not edit anything.
```

**Disclose** in the MR as shown. See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Merging without a second human.** Fix: protect the branch and require approval.
- **A blank description.** Fix: a template with the headings.
- **Huge merge requests.** Fix: small, one issue each.
- **Letting an agent write "I checked" for you.** Fix: you write what you checked.
- **Force pushing a shared branch.** Fix: do not, and block it.
- **Resolving conflicts blindly.** Fix: review the resolution.
- **Leaving branches and drafts around.** Fix: delete after merge.
- **Reverting to hide a bug.** Fix: fix forward, add a test.

## 7. Practice

**Deliverable in git:** `specs/mr-02.md`, `briefs/mr-02.md`, `reviews/mr-02.md`, and a protected, reviewed merge request.

1. In your practice repository, protect the default branch (no direct push, no force push). Add an MR description template with the seven headings. Note any setting your plan does not offer.
2. Write a spec for a small change with five acceptance criteria.
3. Direct an agent to implement it on a branch and open a draft MR.
4. Fill the description yourself. Verify each criterion and write notes in `reviews/mr-02.md`.
5. Ask a partner to review with the method. Record their comments and how you answered.
6. Merge only after a different person has approved and the pipeline is green. Delete the branch.
7. In the notes, add one rule you will change in your template.

## 8. Checklist

- [ ] The default branch is protected.
- [ ] My MR has title, issue link, what and why, how checked, AI use, risk and recovery, not checked.
- [ ] I read my own diff before requesting review.
- [ ] Someone other than the author approved.
- [ ] The pipeline was green before merging.
- [ ] I chose a merge method and wrote it down.
- [ ] I deleted the branch.
- [ ] If anything failed later, I fixed forward.

## 9. Further learning

The GitLab documentation for merge requests, protected branches, approvals and code owners is the reference. Atlassian's tutorials explain merge strategies with pictures, and Conventional Commits gives you a message style. Practise by reviewing small merge requests often.
