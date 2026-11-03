---
title: "Running ANDROID Ops in GitLab"
description: "Set up labels, milestones, issues, boards, pipelines and change records so the seven focus areas run in git, with people and AI agents sharing one visible plan."
section: "Frameworks"
order: 24
track: "frameworks"
level: "core"
duration: "70 min"
outcomes:
  - "Create a label scheme, board and milestone set that shows the seven focus areas"
  - "Write an agent task issue and a merge request template that works as a change record"
  - "Explain which of these features need a paid GitLab plan and what to use instead"
resources:
  - "gitlab/docs-labels"
  - "gitlab/docs-milestones"
  - "gitlab/docs-issue-boards"
  - "gitlab/docs-epics"
  - "gitlab/docs-description-templates"
  - "gitlab/docs-ci-pipelines"
  - "gitlab/docs-merge-requests"
  - "gitlab/docs-ci-quick-start"
prerequisites:
  - "20-why-a-new-operating-model"
  - "issues-milestones-labels"
updated: 2026-11-03
---

**Dojo programme link:** this is the hands-on lesson for the evidence of "complete epic management" in the Product Package (week 6) and the platform module of the Master Developer path. It builds on [Issues, milestones and labels](/library/issues-milestones-labels) and [Service management in git](/library/itil-in-git).

## 1. Why this matters

A framework that lives only in a slide deck does not run anything. The Dojo rule is that **git is the source of truth**. If it is not in git, it did not happen, and nobody else can find it, review it or build on it. See [Git is the source of truth](/library/git-is-the-source-of-truth).

For a Product Development Manager (PDM) this is also the control panel. When you direct several AI agents at once, you need one place where you can see: which tasks exist, who (or which agent) has each one, what is waiting for your review, what is blocked, and what has shipped. GitLab provides that with plain features: issues, labels, milestones, boards, merge requests, pipelines. This lesson shows how to wire them to the seven ANDROID focus areas.

## 2. Key ideas, explained

### 2.1 The vocabulary

| GitLab feature | In plain words | ANDROID Ops use |
|---|---|---|
| **Repository** | The folder of files with all history | Product code, docs, research, designs, plans |
| **Issue** | One task or question, with discussion | A unit of work in any focus area; also a hand-off to an agent |
| **Label** | A coloured tag on issues and merge requests | Focus area, type, status |
| **Milestone** | A goal with dates that groups issues | A release or a learning goal |
| **Epic** | A larger piece of work that groups issues across milestones | A roadmap item (written by a person) |
| **Board** | Columns of issue cards, driven by labels | The view of work by status or by focus area |
| **Merge request (MR)** | A proposed change to be reviewed and checked before it joins the main branch | The change record |
| **Pipeline** | Automatic checks and steps that run on a change | The proof for Implement and Deliver |
| **Release** | A named version with notes | The record of Deliver |

### 2.2 What is free and what is not

Plans and features change, so read the current documentation for your tier. As a working rule for the Dojo:

- On the free plan you have repositories, issues, labels, milestones, boards (a basic board), merge requests and pipelines. That is enough to run ANDROID Ops.
- [Epics](https://docs.gitlab.com/user/group/epics/) and scoped labels (labels that use a double colon, such as `status::in-progress`, where only one value can be set at a time) are paid features. The Dojo's own project uses them because its plan includes them.
- If you are on the free plan, use plain labels with a prefix and a dash, such as `focus-advance`, `status-ready`, and use a **roadmap file** in the repository for epics (see the [Epic roadmap template](/library/template-epic-roadmap)). You lose "only one status at a time" but you keep the idea.

Everything below works with either choice. Where it differs, it says so.

### 2.3 A label scheme that maps to the seven areas

Use three families of labels.

| Family | Values | Why |
|---|---|---|
| **focus** | `advance`, `network`, `design`, `research`, `optimize`, `implement`, `deliver` | Shows which area the work belongs to |
| **type** | `feature`, `bug`, `content`, `research`, `ops`, `agent-task` | Shows what kind of work it is |
| **status** | `ready`, `in-progress`, `needs-review`, `blocked` | Shows where it is in the flow |

On a paid plan write them as `focus::advance`, `type::feature`, `status::needs-review`. On a free plan write `focus-advance` and so on.

Create them from the command line with `glab`, so the setup is repeatable and reviewable:

```bash
for f in advance network design research optimize implement deliver; do
  glab label create --name "focus::$f" --color "#6B8E23" \
    --description "ANDROID Ops focus area: $f"
done
for s in ready in-progress needs-review blocked; do
  glab label create --name "status::$s" --color "#8B5A2B" \
    --description "Work status: $s"
done
```

Keep the label list short. Ten labels you use beat forty you ignore.

### 2.4 Milestones and epics

A **milestone** is a goal with a due date. Name it for the result, not the activity: "Counter returns in two cafés", not "Sprint 3".

An **epic** is a roadmap item. People write it. An epic needs: the problem it solves, the evidence (links to research), a measure, a date range, and a list of issues. Each issue in the epic belongs to one focus area. A healthy epic has issues in several areas: some research, some design, some implementation, some delivery, and one optimisation review.

### 2.5 Boards

Make two boards.

1. **Flow board.** Columns are the status labels: Ready, In progress, Needs review, Blocked, Done. This is what you open each morning. The column "Needs review" is **your** queue as PDM. If it is long, agents are waiting for you.
2. **Focus board.** Columns are the seven focus labels. This shows where attention is going. If Implement has twenty cards and Research has none, you are building without learning.

### 2.6 Pipelines as proof

A **pipeline** is a set of automatic jobs that run when someone proposes or merges a change. In ANDROID Ops the pipeline is the proof for the last two areas:

- For **Implement**, run checks on every merge request: format and lint, unit tests, a scan for secrets, a scan for known problems in dependencies.
- For **Deliver**, run the release steps from the main branch: build, test again, publish, deploy to a small group first, run smoke tests after deployment.

A minimal pipeline file, `.gitlab-ci.yml`:

```yaml
stages: [check, test, build, release]

lint:
  stage: check
  image: node:22
  script:
    - npm ci
    - npm run lint
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

unit-tests:
  stage: test
  image: node:22
  script:
    - npm ci
    - npm test
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
```

This is a teaching sketch. Your stack and runner decide the real commands. Read the [pipeline documentation](https://docs.gitlab.com/ci/pipelines/) and do the [first pipeline tutorial](https://docs.gitlab.com/ci/quick_start/) once by hand. You will not write most pipeline files from memory in 2030. You must be able to read one and say what it proves and what it does not. Lessons 25 to 28 build on this.

### 2.7 Merge requests as change records

A **change record** is a short written record of a change: what, why, how risky, how to undo it, who approved. Old IT service management kept these in separate tools. In ANDROID Ops the merge request **is** the record, because it already links to the issue, the diff, the review and the pipeline.

Use a **description template** so every merge request asks the same questions. Put it in `.gitlab/merge_request_templates/Change.md`. The [Change record template](/library/template-change-record) gives a full version with a risk assessment, a recovery plan in the fix-forward style, and an AI-use section. See also GitLab's [description templates](https://docs.gitlab.com/user/project/description_templates/).

Important rule: **an agent may fill in facts. A named person signs the risk decision and the approval.**

## 3. Step by step: set up a repository for ANDROID Ops

1. **Create the repository** and protect the main branch so changes arrive only by merge request.
2. **Add labels** (section 2.3). Use the loop above or the web page.
3. **Add issue templates** in `.gitlab/issue_templates/`: one for `Epic-item`, one for `Agent-task` (below), one for `Bug`.
4. **Add the merge request template** (Change record).
5. **Create the two boards** (flow and focus).
6. **Create the first milestone** with a due date and a result name.
7. **Write the first epic** yourself, in the roadmap file or in GitLab if you have epics. Link the evidence.
8. **Break the epic into issues**, one focus label each, with acceptance criteria in plain sentences.
9. **Add `.gitlab-ci.yml`** with at least lint and test jobs on merge requests.
10. **Set a weekly Focus Shift** (a four-hour block) in your calendar and a recurring issue "Weekly review" with a short checklist.
11. **Decide who may approve** and set the rule: the author of a change (human or agent) is never its only approver.

### The agent task issue template

```markdown
## Task
<One sentence. What must exist when this is done?>

## Focus area
<advance | network | design | research | optimize | implement | deliver>

## Context
- Epic / roadmap item: <link>
- Evidence: <links>

## Acceptance criteria
- [ ] Given ..., when ..., then ...
- [ ] ...

## Scope
- May change: <paths>
- Must not change: <paths>
- Dependencies: no new dependencies without asking
- Data: no personal data, no secrets in output

## Output
- Branch name: <name>
- Merge request description: what changed, how to test, what you are unsure about

## Human review
- Reviewer: <name>   (the agent may not approve)
```

An agent that works from an issue like this has everything it needs, and you have a record of what you asked for.

## 4. Worked example: TrailMug epic 4 in GitLab

Maya sets up the TrailMug planning project.

- **Milestone:** "Counter returns in two cafés", due in six weeks.
- **Epic 4:** "Return a cup in under ten seconds at the counter." Written by Maya. Evidence: her observation notes. Measure: median return time. If her plan has no epics feature, she writes this in `roadmap/epics.md` and uses a label `epic-4` on the issues.
- **Issues, with labels:**

| # | Issue | Focus | Type | Status |
|---|---|---|---|---|
| 38 | Observe two counters and time a return | research | research | done |
| 39 | Three layouts for the scan screen | design | agent-task | done |
| 40 | Stakeholder note to Leo and two cafés | network | content | in-progress |
| 41 | Record a return (API and tests) | implement | agent-task | needs-review |
| 42 | Counter page | implement | agent-task | in-progress |
| 43 | Log failed scans | implement | agent-task | ready |
| 44 | Release to Leo's café, with rollback | deliver | ops | ready |
| 45 | Measure after one week and write the review | optimize | ops | ready |

On the flow board she sees one card in Needs review (issue 41). That is her morning. She opens the merge request, reads the diff, checks the pipeline result, and signs the change record. On the focus board she sees that Advance has no open cards: she writes a recurring issue to review the roadmap every second Friday.

## 5. Working with AI agents on this

**What the PDM decides.** The label scheme, the board columns, the epic text, who may approve, and the agent scope in each issue.

**What agents can do in GitLab.** Open issues from your notes, write issue descriptions from a template, apply labels, draft merge request descriptions, summarise a board, and spot issues with no acceptance criteria. Many agents can use the `glab` command-line tool or the API under a limited token.

**Rules for agent access.**

- Give each agent its own account or token with the **least** access the task needs: write access to branches, not to settings, not to the main branch.
- Protect the main branch. Require merge requests and, where your plan allows it, [approvals](https://docs.gitlab.com/user/project/merge_requests/approvals/).
- Never place secrets in issues, merge requests or prompts.
- Keep a record of which agent did what, in the merge request.

**A brief you can adapt:**

```text
Read roadmap/epics.md, epic 4. For each acceptance criterion, draft one
GitLab issue using the Agent-task template. Do not create the issues;
output them as markdown so I can review. Do not change the epic. Mark
any criterion that is not testable as NOT TESTABLE and explain why.
```

**How to check.** Read each issue as if you were the agent: could you do the work with only this text? If a criterion cannot be tested, rewrite it yourself.

## 6. Common mistakes and how to avoid them

- **Too many labels.** If nobody remembers them, nobody uses them. Start with fifteen at most.
- **A status nobody updates.** Let the system help: use merge request links and automatic closing with "Closes #N".
- **Epics written by an agent.** They will read well and belong to nobody. Write them yourself.
- **Giving agents the keys.** An agent with admin access is one bad instruction from damage. Least access.
- **Changes without a record.** Every change that reaches users has a merge request, and every merge request has the template filled in.
- **Using the board as a to-do dump.** Review it weekly and close what is dead.

## 7. Practice

**Deliverable in git:** a repository (or a branch of your product repository) containing:

1. `docs/gitlab-setup.md`: your label list, board descriptions and the approval rule, with a screenshot or exported description of each board.
2. `.gitlab/issue_templates/Agent-task.md` and `.gitlab/merge_request_templates/Change.md`.
3. `roadmap/epics.md` with one epic you wrote, and at least six issues linked to it covering four or more focus areas.
4. A `.gitlab-ci.yml` with at least two checks that run on merge requests.
5. One merge request, opened from an issue, with the template filled in, your review notes, and a note about any agent help.

## 8. Checklist

- [ ] Labels exist for focus, type and status.
- [ ] I have a flow board and a focus board.
- [ ] A milestone has a result-style name and a date.
- [ ] The epic is written by a person and links evidence.
- [ ] Every issue has acceptance criteria and one focus label.
- [ ] The main branch is protected; the author is never the only approver.
- [ ] A pipeline runs checks on merge requests.
- [ ] The merge request template records risk, recovery, checks, AI use and approval.
- [ ] No secrets in any issue, merge request or prompt.

**Next:** the [Launch Sequence lessons](/library/tracks/frameworks/25-launch-sequence-six-stages/) show how the Implement and Deliver pipeline grows into a full proof of readiness.
