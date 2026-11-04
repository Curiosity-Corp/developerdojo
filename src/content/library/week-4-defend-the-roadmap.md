---
title: "Week 4: Defend the roadmap"
description: "Check dependencies, map stakeholders, defend your choices, and learn to steer AI agents with agent-ready epics."
section: "Developer path"
order: 4
level: core
duration: "8 to 10 hours"
outcomes:
  - "Fix your epics after the review and check dependencies."
  - "Cut the first epic into three to five dated milestones."
  - "Prepare and give a ten-minute roadmap presentation."
  - "Pass level 3 on all six skills with none below 2."
resources:
  - gitlab/roadmap
  - atlassian/tips-presenting-product-roadmaps
  - atlassian/definition-of-done
  - atlassian/project-dependencies
  - microsoft/azure-architecture-center
  - anthropic/building-effective-agents
prerequisites:
  - week-3-problems-to-epics
  - disclose-ai-use
---

**Outcome:** your roadmap survives a review, and your first epic is ready for AI agents to build.

## Part 1: Fix and defend

After the Week 3 review, fix your epics. Then check:

- **Dependencies.** Which epic must finish before another can start? Mark it.
- **Risks.** List the top five and give each an owner.
- **Out of scope.** Is every "no" written down?

Prepare a **10-minute roadmap presentation**: the picture, the order, the risks, and what you chose not to build.

## Part 2: Stakeholders

A **stakeholder** is a person or group affected by your product or able to affect it.

| Stakeholder | What they want | How you keep them informed |
|---|---|---|
| Customers | The product works and is fair | Interviews, support, release notes |
| Partners (for example cafés) | Easy operation, fair terms | Monthly call, shared status page |
| Sponsor or mentor | Honest progress | Weekly note |
| Legal or privacy adviser | Rules are followed | Policy pages, review before launch |
| Builders (people and agents) | Clear work | Agent-ready epics |

Write your own table for your product. Add the main worry of each group.

## Part 3: AI agents in practice

An **AI agent** here is an AI coding assistant that reads your project and builds issues. Agents are strong at tasks that are:

1. **Scoped.** Clear start and end.
2. **Verifiable.** A test or a screen shows if it is done.
3. **In one repo.**
4. **Short.** One session, one merge request.

### The agent loop

1. Read the plan.
2. Pick the next issue that is ready and not blocked.
3. Read the repo's instruction file.
4. Build on a branch and commit often.
5. Open a merge request that says `Closes #N`.
6. Watch the pipeline. If red, fix forward.
7. A human reviews and merges.
8. Update the issue and the epic.

### Agent-ready epics

An epic is **agent-ready** when an agent can work from it without guessing. It states:

1. **Goal.** The result in one or two sentences.
2. **Repos.** Every repo involved, marked exists or planned.
3. **Interfaces.** Names of URLs, fields, environments and secrets. Names only. Never secret values.
4. **Acceptance.** Checkboxes a person can test.
5. **Order.** What comes first.
6. **Owner.** The human who answers questions.

**Vague:**

```text
Title: Welcome emails
We need a good welcome flow. Make it nice and secure.
```

**Agent-ready:**

```text
Title: New members get a welcome email within 5 minutes
Goal: After sign-up a member receives a welcome email with
  how to find a partner cafe. The member appears in the CRM.
Repos: trailmug-app (exists), trailmug-flow-welcome (planned),
  trailmug-crm (planned)
Interfaces: event "member.created" with fields email, name, city.
  Secret names: trailmug-mail-api-key. Environments: dev, staging, prod.
Acceptance:
  - [ ] Email arrives within 5 minutes of sign-up
  - [ ] Member appears in the CRM within 1 minute
  - [ ] Unsubscribe link works
Order: CRM table, then workflow, then the app event
Out of scope: loyalty points, push notifications
Owner: Maya (human). Decisions are logged in the epic comments.
```

### The decision log

When an agent asks a question, answer it in the epic comments. Write the date, the question, the answer and your name. Answer where the question was asked, never in a private chat. The next session cannot see private chats.

### What agents never do

Agents **never edit the goal of an epic**. They comment, propose a change with a reason, or flag the issue as blocked. You decide.

### Failure cases without a human owner

- **Drift.** An agent adds a chat widget and a blog. The page no longer matches the plan.
- **Duplicate repos.** Two agents create two repos for the same job.
- **Mismatched interfaces.** One side sends `mail`, the other expects `email`. Both pass their tests. Production fails.
- **Orphan work.** Issues in six repos and no epic. The roadmap shows nothing.
- **The empty epic.** An AI wrote it. It reads well. Nobody owns it. Agents build it faithfully. The result is a polished mistake.

## Part 4: A weekly rhythm

Use the [weekly cadence](/library/weekly-cadence-and-common-mistakes) from now on.

## Exercises

1. Fix your roadmap after review. Write what changed and why.
2. Write the stakeholder table.
3. Rewrite your first epic until it is agent-ready.
4. Give an agent one milestone you wrote. Review every line it produces. Write your disclosure note.
5. Present the roadmap in 10 minutes.

## Final review

Present to a panel or coach. They ask: is it your thinking, does it cover the whole product, can agents build from it?

## How the program supports this week

### How your Sensei works this week

This is the final review for the planning level. You present a ten-minute roadmap to a panel: the picture, the order, the risks and what you chose NOT to do. The panel checks three things: is it your thinking, does it cover the whole product, and can agents build from it? Read [how your Sensei works with you](/library/program-how-sensei-work) to prepare.

### Show your work in git

Corrected epics after the Week 3 review, `milestones/` with 3 to 5 dated milestones for the first epic, `stakeholders.md`, `decisions/` and your presentation notes. Show the changes in merge requests. See [your files and git](/library/program-your-work-in-git).

### AI use this week

**May:** break the milestones you wrote into issues and build them, draft a release note. **May not:** change scope, decide dependencies or approve their own issues. Write the disclosure line in every merge request.

### Skill tracks that match

[Your roadmap in git](/library/tracks/roadmapping-and-epics/04-your-roadmap-in-git), [Agent-ready milestones](/library/tracks/roadmapping-and-epics/05-agent-ready-milestones), [Map the stakeholders](/library/tracks/stakeholder-communication/01-map-the-stakeholders), [Present and defend the roadmap](/library/tracks/stakeholder-communication/03-present-and-defend-the-roadmap) and [Orchestrating multiple agents](/library/tracks/working-with-ai-agents/06-orchestrating-multiple-agents).

A second worked example, for a software service rather than a physical product, is [Shiftwren week 4: defend the roadmap](/library/shiftwren-week-4-defend-the-roadmap).

### The 2030 Product Development Manager lens

You decide scope, order, risks and what you will not do. You delegate issues for approved milestones. A sample brief: "Break milestone 1.1 into issues of at most two days, each with a done-when line. List your questions. Do not change scope." You verify by reading every issue against the milestone. On the agent ladder this week is **delegate**, with **orchestrate** coming next.

### Reading for this week

Week 4 of Track A in [the learning path week by week](/library/learning-path-week-by-week): 9 items, about 259 hours, mostly optional certificates. After the review, pass level is 3 on all six skills and none below 2: see [how you are assessed](/library/program-assessment-and-pass-level).
