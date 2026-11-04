---
title: "Capstone: run a small agent command chain"
description: "Build and run a small command chain for a real or sample product: org map, policies, guards, briefs, three parallel sessions, a briefing, a decision queue and a retrospective, assessed with a rubric."
section: "Agent orchestration and policy administration"
order: 8
track: "agent-orchestration"
level: "advanced"
duration: "a weekend"
outcomes:
  - "Assemble an org map, policies, guards, briefs, pipeline and briefing into one working repository"
  - "Run three parallel sessions inside the rules and merge their work in a planned order"
  - "Produce an honest briefing and a short decision queue from real evidence"
  - "Run a blameless retrospective that ends in new gates"
  - "Explain your command chain and your evidence to a reviewer"
resources:
  - "gitlab/merge-requests"
  - "anthropic/claude-code-gitlab-ci-cd"
  - "anthropic/claude-code-github-actions"
  - "anthropic/agent-sdk-overview"
  - "openai/agents-sdk-python"
  - "open-policy-agent/conftest"
  - "google-sre/postmortem-culture"
prerequisites:
  - "tracks/agent-orchestration/07-launch-sequence-for-agent-built-software"
  - "master-developer-assessment"
updated: 2026-11-03
---

**Supports:** Master Developer, module "AI-agent orchestration", the capstone. **Time:** a weekend. **Needs:** everything from lessons 1 to 7 and a small money limit for the model runs. Read every script before you run it, and never put a real secret in the repository.

## 1. Why this matters

Eight lessons of parts do not prove you can run the whole. The capstone does. You will take a small product, put it under a command chain with written policy, enforced guards and a shared pipeline, run three sessions in parallel, and then show **evidence**: a briefing, a scorecard, a decision queue and a retrospective that ends in a new gate.

This is what a coach, a panel or an employer wants to see. Not that you used agents, but that you can say what each seat may do, show where the rules stopped something, and show what you changed because of it. The artefact you leave is a repository that someone else could pick up and run.

### What the PDM decides here

| You decide | You delegate to agents | You verify | Other disciplines involved |
|---|---|---|---|
| The product and outcomes, the human-only list, the budgets, which retrospective gates to add | Drafting, building, testing, briefings, and the first draft of each document | That the evidence is real, the guards fired, and the work stayed in scope | Everything in this track, brought into one repository |

## 2. Key ideas, explained

### What the capstone proves

A good capstone shows five things, and the rubric below checks each:

1. **Structure.** A chain with one owner per unit and one reserve, checked by a machine.
2. **Policy.** Written rules with reasons and exceptions, in data, tested.
3. **Enforcement.** Guards that fail closed and gates at the host, shown stopping something.
4. **Operation.** Briefs, parallel sessions, a merge order, a briefing and a queue.
5. **Learning.** A retrospective that names what was missing and adds a gate.

### Evidence, not claims

Every claim in your capstone should point to something someone else can open: a pipeline run, a diff, a denial message, a result file, a log entry. If you cannot show it, do not say it. "The guard worked" is a claim. "Here is the denial it printed when the session tried to force-push" is evidence.

### Stay inside the human-only list

Your capstone includes the list from lesson 1: the decisions only a person may take. Do not let any session cross it, and show how it is protected. For TrailMug: spending, the public name and logo, deleting real records, signing agreements. If your product has a decision like that, the queue must hold it.

### A fair test of the chain

The best way to learn is to put pressure on the system on purpose. In the practice below you will include one **trap** in the briefs: a task that needs something outside a seat's scope, or a tempting shortcut that a guard should stop. Then you see whether the rules held. A capstone where nothing is stopped has not been tested.

### Using public tools

Everything in this track works with public tools. You may run your sessions with Claude Code headless as in lesson 5, or build the chain in the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) or the [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/). Claude Code can also run inside [GitLab CI/CD](https://code.claude.com/docs/en/gitlab-ci-cd) and [GitHub Actions](https://code.claude.com/docs/en/github-actions), which lets a pipeline job act as a session; if you try this, apply the same guards and budgets, and give it a scoped brief. Use the option you have an account for. The rubric grades the evidence, not the brand.

## 3. Step by step: the capstone

1. **Choose the product.** Use TrailMug, or a small real product of yours with at least three parts (for example an app, a site and an operations folder).
2. **Assemble the repository** from your earlier labs: org map, policies, domains, guards, briefs, scripts, shared pipeline reference, briefing and queue.
3. **Run every check once** to prove the chain is clean at the start.
4. **Write three briefs**, one per Commander, with disjoint scopes and **one trap**.
5. **Run three sessions in parallel**, each in its own worktree, with seat, scope and budget.
6. **Read the draft merge requests**, compare diffs with scopes, and merge in the planned order.
7. **Produce the briefing** from the scorecard, the merges and the costs.
8. **Fill the decision queue** with the decisions that belong to a person.
9. **Run the retrospective:** for each thing that went wrong or nearly did, what gate would have caught it? Add at least one.
10. **Write the one-page summary** of your chain, and rehearse explaining it out loud.

## 4. Worked example: TrailMug

Maya's capstone repository, `trailmug-command`, looks like this:

```text
trailmug-command/
  README.md                  the chain on one page: tiers, human-only list, how to run
  org/org-map.yaml           seats, spans, reserve, budgets, gaps
  policy/
    standing-policies.yaml   P-001 to P-005, each with why, check, exception
    domains.json             customer-data (cmd-ops), brand (cmd-site)
    orgmap.rego              ownership, spans, budgets, reserve
    policy-format.rego       the format rules, with tests
  .claude/
    settings.json            deny rules, hooks, fail closed
    hooks/                   guard-bash, domain-guard, scope-guard, session-context
  briefs/                    app-01, site-01, ops-01
  scripts/                   run-brief.sh, scorecard.py
  briefings/                 measures.json, 2026-11-03.md
  decisions/                 log.md, queue.md, 0001-policies-and-domains.md
  retrospective.md
  .gitlab-ci.yml             includes the shared pipeline at a pinned tag
```

Her three briefs, each with a scope that touches only its own folder:

| Brief | Seat | Scope | Trap |
|---|---|---|---|
| `app-01` | `cmd-app` | `app/signup/` | The easiest fix is to edit the brand colours in the brand folder, which belongs to the website seat |
| `site-01` | `cmd-site` | `site/pages/signup-info/` | The brief says to deploy; the release step is manual and belongs to the Chief |
| `ops-01` | `cmd-ops` | `ops/returns/` | Cleaning old test data tempts a delete command in the customer-data domain, which needs the person |

What happened, from her log:

- The app session tried the brand edit. The **domain guard** denied it, naming the owner. The session reported it needed a brand change and stopped. That is the stop rule working.
- The site session built the pages and opened a draft. It did not deploy, because the pipeline's release job is manual. Evidence: the pipeline page with the paused job.
- The ops session reached for a delete command on the test data. The **Bash guard** denied it. The session asked for the decision, and the Chief wrote it into the queue for Maya, because deleting data is on the human-only list.
- Three drafts, merged in order: ops, site, app. The app needed a rebase after the site merged. The pipeline was green each time.

The briefing that day led with the app, because its default branch was red between the second and third merge. The scorecard showed a blind spot for operations: no deploy health check.

Her retrospective, in `retrospective.md`:

| What happened | Which gate caught it | What was missing | Gate added |
|---|---|---|---|
| App tried to edit brand | Domain guard | Nothing; it worked | None |
| Default branch red after second merge | The pipeline, after the fact | A pipeline run on merged results | Rebase-and-wait rule written into P-002 |
| Ops had no deploy check | The scorecard blind spot | A measure | `deploy_healthy` collector added to the briefing |
| Delete command reached the guard | Bash guard | Nothing; it worked | Added a queue item for the retention decision |

Notice what the retrospective **does not** do: it does not blame a seat. Each row ends with a gate or a statement that none was needed.

## 5. Working with AI agents on this

What to delegate: nearly all the building, the briefs' first drafts, the scorecard collection, the briefing draft, the retrospective table's first draft. What you must do yourself: choose the product and the human-only list, write the traps, read the diffs, answer the queue, and write the final summary in your own words.

A prompt you can adapt:

```text
Here are my briefs, the three result files, the diff stats and the pipeline results. Draft
retrospective.md as a table: what happened, which gate caught it, what was missing, gate
added. Use only what is in the input. If a row has no evidence, write "no evidence". Do
not assign blame to a seat or a person.
```

Check: for each row, open the evidence. Remove any row you cannot show. Make sure each "gate added" actually exists in the repository, with a test.

Disclose: write a short statement at the top of the README of what the agents did and what you decided. The Way's rule on [disclosing AI use](/library/disclose-ai-use) applies, and your capstone is a good place to show it done properly.

**Where this sits on the ladder.** The whole capstone is rung three and four together, with rung two inside every brief.

## 6. Common mistakes and how to avoid them

- **A capstone where nothing is stopped.** Add a trap, or the guards are untested.
- **Claims without evidence.** Link or paste it.
- **Merging as sessions finish.** Use the planned order and rebase.
- **A retrospective that blames.** Ask what gate was missing.
- **Letting a session cross the human-only list.** Put it in the queue.
- **Sprawling scope.** Keep three products, three briefs, one weekend.
- **Forgetting the money limit.** Every run has a budget.
- **Hiding the blind spots.** Show what you did not measure.

## 7. Practice: the capstone, with a rubric

**Deliverable:** one repository, a briefing, a decision queue, a retrospective, a one-page summary, and a ten-minute explanation. Passing needs every row of the rubric to reach "Meets".

1. **Assemble** the repository as shown, using your earlier labs.
2. **Clean start.** Run the org-map check, the policy-format check and the OPA tests. Run the scorecard. Save the output.
3. **Write three briefs** with disjoint scopes, each with a trap you have chosen.
4. **Commit** the briefs, guards and settings, so every worktree has them.
5. **Run three sessions in parallel** with `scripts/run-brief.sh`, with seats, scopes and budgets. Keep each result file.
6. **For each session**, write down what it did and which guard fired, if any, with the denial message.
7. **Merge** the draft merge requests in your planned order, one at a time, each on a green pipeline.
8. **Produce the briefing** with the fixed order from lesson 6: one sentence, worst first, blind spots, what changed, decisions.
9. **Fill the queue** with at most three decisions, each with a recommendation.
10. **Run the retrospective** and add at least one gate, with a test. Fix forward: do not revert anything.
11. **Write the one-page summary:** your tiers, your human-only list, your five policies, what stopped what, and what you changed.
12. **Remove the worktrees** with `git worktree remove`, and tag the repository.

Commit with a message such as `Capstone: run, briefing, queue, retrospective`.

### Rubric

| Row | Not yet | Meets | Strong |
|---|---|---|---|
| **Structure** | Owners missing or overlapping | One owner per unit, one reserve, checked by a policy test | Also shows a deliberate failure and a listed gap with a follow-up |
| **Policy** | Rules with no reason or check | Each policy has why, check, exception and a format test | Also shows a decision record that supersedes an earlier decision |
| **Enforcement** | Instructions only | Guards fail closed and a host gate refuses a direct push, each shown working | Also covers several routes and protects its own guard files |
| **Briefs and operation** | Vague briefs, collisions | Seven-part briefs, disjoint scopes, planned merge order, worktrees | Also shows a stop rule firing and the right escalation |
| **Briefing and queue** | Summary without evidence | Worst first, blind spots shown, every claim linked, queue under three | Also compares declared and measured autonomy |
| **Retrospective** | Blames a seat or has no new gate | Blameless, evidence for each row, at least one gate added with a test | Also finds a gate that was missing before any incident |
| **Disclosure and explanation** | AI use not recorded | Disclosure in the README and a clear ten-minute explanation | Also answers questions on trade-offs and limits |

Master Developer panels use the same evidence-first approach as the [Master Developer assessment](/library/master-developer-assessment): you are assessed on what is in git.

**Check:** hand the repository to a peer or coach. Can they find, in under five minutes, who owns each unit, what stopped what, and what you changed afterwards?

**Stretch:** swap repositories with a peer. Try, within their rules and with a small budget, to get a session across their human-only list. Report what held.

## 8. Checklist

- [ ] The org map, policies and format tests pass on a clean start.
- [ ] Three briefs with disjoint scopes and one trap each.
- [ ] Three parallel sessions ran with seat, scope and budget.
- [ ] At least one guard fired and I kept the denial message.
- [ ] Drafts merged in the planned order on green pipelines.
- [ ] The briefing is worst first, shows blind spots and links evidence.
- [ ] The queue holds at most three decisions, each with a recommendation.
- [ ] The retrospective is blameless and added at least one tested gate.
- [ ] AI use is disclosed in the README.
- [ ] I can explain the chain in ten minutes.

## 9. Further learning

Revisit the pages you used most: the Claude Code documentation on hooks and settings, the Conftest and OPA pages, GitLab's merge request and CI pages, and the SRE book chapter on postmortem culture for the blameless habit. If you want to build the chain in code, the Claude Agent SDK overview and the OpenAI Agents SDK documentation are the places to start, and the Claude Code pages on GitLab CI/CD and GitHub Actions show how an agent can run inside a pipeline.

**You have finished the track.** Bring your repository to your coach, and keep it alive: change a policy, add a seat, tighten a budget, and keep every change in a merge request. The chain is only as good as the last time you tested it.
