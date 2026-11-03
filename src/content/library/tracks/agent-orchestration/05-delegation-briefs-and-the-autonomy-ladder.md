---
title: "Delegation briefs and the autonomy ladder"
description: "Write a brief that gives a session an outcome, limits and a way to prove it is done, run several sessions in parallel worktrees without collisions, and extend autonomy by evidence."
section: "Agent orchestration and policy administration"
order: 5
track: "agent-orchestration"
level: "advanced"
duration: "3 hours"
outcomes:
  - "Write a delegation brief with an outcome, a why, a scope, a done-when, evidence and a stop-and-ask rule"
  - "Run several sessions in parallel, each in its own worktree and branch, without collisions"
  - "Launch a headless session with a seat, a scope and a budget"
  - "Describe the autonomy ladder and decide when a seat may climb it"
  - "Keep long-horizon work safe with checkpoints and a merge order"
resources:
  - "anthropic/claude-code-in-action"
  - "anthropic/claude-code-worktrees"
  - "anthropic/claude-code-headless"
  - "anthropic/claude-code-best-practices"
  - "anthropic/effective-context-engineering"
  - "deeplearning-ai/claude-code-a-highly-agentic-coding-assistant"
  - "wikipedia/mission-command"
prerequisites:
  - "tracks/agent-orchestration/04-hooks-guards-and-gates"
  - "tracks/working-with-ai-agents/04-specs-and-acceptance-criteria"
updated: 2026-11-03
---

**Supports:** Master Developer, module "AI-agent orchestration". **Time:** about three hours. **Needs:** your repository from lesson 4 and Claude Code with a plan or key that allows headless runs. Set a small money limit before you begin.

## 1. Why this matters

You have a chain, rules and guards. Now someone has to hand work down. The most common failure is not a wrong answer. It is a **vague instruction**: a session told to "improve the sign-up page" will improve something, for a long time, in a direction you did not choose, and report success.

Long-horizon work makes this worse. A session that runs for an hour or a day cannot ask you each time it is unsure, and it will fill each gap with its own guess. So the handover must carry everything the session needs: what outcome, why it matters, what it may touch, how it proves it is done, what it must do if it is stuck. We call it a **brief**.

The second half of the lesson is about **autonomy**: how much room a seat gets, and how it earns more. If you grant everything on day one you are trusting a guess. If you grant nothing you are the bottleneck. The ladder gives a way to move up on evidence.

### What the PDM decides here

| You decide | You delegate to agents | You verify | Other disciplines involved |
|---|---|---|---|
| The outcome and why, the scope, the budget, how autonomy grows | Writing the first draft of briefs, running the sessions, reporting evidence | That the evidence matches the done-when, and that the diff stays in scope | Finance (budget per session), design and brand (domains), engineering (the done-when must be testable) |

## 2. Key ideas, explained

### An outcome, not a task list

Tell a session **what must be true when it is done**, not each step. This is the old military idea of [mission command](https://en.wikipedia.org/wiki/Mission_command): state the intent and the limits, and trust the capable person to choose the method. A step list is brittle: one wrong assumption early on and every later step is wrong. An outcome with a way to check it lets the session adapt.

### The anatomy of a brief

| Part | Question it answers | Weak example | Strong example |
|---|---|---|---|
| **Outcome** | What is true when this is done? | "Improve sign-up" | "A café owner can sign up with an email and see a confirmation page" |
| **Why** | Why does it matter, so the session can make sensible trade-offs? | (missing) | "The first pilot café starts on Monday and sign-up is the only blocker" |
| **Scope** | Which files may change? | "The app" | "Only `app/signup/` and `app/tests/signup/`" |
| **Done when** | What check proves it? | "It works" | "`npm test` passes and the new test `signup.spec` exists" |
| **Evidence** | What do you hand back? | "A summary" | "Test output, the diff stat, and a screenshot of the confirmation page" |
| **Limits** | Budget, turns, rules that still apply | (missing) | "Two dollars, thirty turns; policies P-001 to P-005 apply" |
| **Stop and ask** | When must it stop instead of guess? | (missing) | "If a change is needed outside the scope, stop and say which file and why" |

The last row is the one that makes long runs safe. A session without a stop rule guesses. A session with one reports, and costs you a minute of reading instead of an afternoon of cleanup. Context matters too: put the brief where the session will read it, and keep it focused. Anthropic's writing on [context engineering](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) explains why the smallest set of high-signal information beats a large pile.

### Parallel sessions need separate rooms

Two sessions editing the same working folder will overwrite each other, and no policy can prevent a silent clash. The fix is the **git worktree**: a second checkout of the same repository in another folder, on its own branch. Each session gets its own worktree and its own branch, works in isolation, and reaches the default branch only through its own draft merge request. Claude Code can create one for a session with its [worktree flag](https://code.claude.com/docs/en/worktrees), and plain git does the same with `git worktree add`.

Isolation solves the files. The **scope** in each brief solves the design: two sessions whose scopes do not overlap cannot touch the same files, so their merge requests rarely conflict. Where scopes must overlap, the Chief decides the **merge order** up front.

### Headless runs

A session you launch from a script, with no one at the keyboard, is a **headless** run: `claude -p "prompt"`. It prints its result and exits. You can ask for JSON output, which includes the cost and the number of turns, and you can set limits: a turn limit and a money limit. See the [headless documentation](https://code.claude.com/docs/en/headless). This is how a Commander starts three sessions at once, and why every session needs its seat, its scope and its budget given on the command line, so the guards from lesson 4 know who it is.

### The autonomy ladder

Autonomy is not a switch. It is a ladder, and a seat climbs it by showing evidence.

| Level | What the seat may do | Typical evidence to climb |
|---|---|---|
| **0. Ask first** | Propose only; a person or a Commander does the action | A few good proposals |
| **1. Do, then report** | Act inside the scope, report every action | Reports match the diffs and the guards never fired |
| **2. Do, and merge its own low-risk changes** | Merge a draft merge request that has a green pipeline, in its own domain | A run of clean merges, no incident, a retrospective with no new gate |
| **3. Decide inside a domain** | Make and record decisions in its own domain | Decisions that held up when tested |

Three rules go with the ladder. **Autonomy is per seat and per domain, not global**: a Commander can be at level 2 for the website and level 0 for customer data. **Evidence climbs, incidents descend**: a serious miss moves the seat back a level until it is understood. And **declared is not measured**: write down what each seat is allowed, and measure what it actually did (lesson 6 shows how). Anthropic's research on [measuring agent autonomy](https://www.anthropic.com/research/measuring-agent-autonomy) shows that people in practice grant trust gradually and by experience.

The human-only list from lesson 1 sits **above** the ladder. No seat climbs to a human-only decision. Money, public brand, real data deletion and the rest stay with a person, however good the evidence.

### Long-horizon work: checkpoints

A long run needs **checkpoints**, because the cost of a wrong turn grows with time. Ask the session to commit small, open a **draft** merge request early, and write a short progress note in the draft's description. The Commander can read the note and the diff, and stop the session if it drifts. Prior decisions in the brief are **hypotheses**: if the session finds that the design in the brief does not work, its stop rule says to report, not to quietly redesign.

## 3. Step by step: hand work down

1. **State the outcome** as something a person could check from outside.
2. **Write the why**, in one or two sentences.
3. **Set the scope**: the folders the session may change, nothing more.
4. **Write the done-when** as a command that passes, or a page that shows something.
5. **List the evidence** you expect back.
6. **Set limits**: budget, turns, and which policies apply.
7. **Write the stop-and-ask rule.**
8. **Commit the brief** to the repository, so it is a record and every worktree has it.
9. **Launch** with a seat, a scope and a budget.
10. **Read the draft merge request**, not the chat. Compare the diff with the scope and the evidence with the done-when.

## 4. Worked example: TrailMug

Maya has three outcomes for the week, one per Commander. Here is the app brief, `briefs/app-01.md`:

```markdown
# Brief app-01: café sign-up

**Seat:** cmd-app   **Scope:** app/signup/, app/tests/signup/   **Budget:** 2 USD, 30 turns

## Outcome
A café owner can sign up with an email address and see a confirmation page.

## Why
The first pilot café starts on Monday. Sign-up is the only blocker.

## Done when
- `npm test` passes, including a new test `signup.spec`.
- The diff touches only the scope above.

## Evidence to hand back
Test output, `git diff --stat`, and a screenshot of the confirmation page.

## Rules
Policies P-001 to P-005 apply. Open a draft merge request. Do not push to the default branch.

## Stop and ask
If a change is needed outside the scope, stop and report which file and why. Do not make it.
Treat the layout in the design doc as a hypothesis: if it does not work, report that.
```

The website brief and the operations brief look the same, with their own scopes: `site/pages/signup-info/`, and `ops/returns/`. The three scopes do not overlap, so the three sessions can run at once. The Chief decides the merge order: operations first (a small change), then the site, then the app, since the app is the most likely to need a rebase.

Maya's launcher is a short script that makes a worktree and starts a headless session:

```bash
#!/usr/bin/env bash
# Run one brief as one headless session in its own worktree.
# Usage: scripts/run-brief.sh <seat> <brief-file> <scope-prefixes> <max-usd>
set -euo pipefail

seat="$1"; brief="$2"; scope="$3"; budget="$4"
name="$(basename "$brief" .md)"
tree="../wt-$name"

git worktree add "$tree" -b "brief/$name"
cd "$tree"

TRAILMUG_SEAT="$seat" TRAILMUG_SCOPE="$scope" \
  "${CLAUDE_BIN:-claude}" -p "Read $brief and do exactly what it says. Report evidence as the brief asks." \
    --permission-mode acceptEdits \
    --max-turns 30 \
    --max-budget-usd "$budget" \
    --output-format json > "../$name.result.json"
```

Because the guards are committed under `.claude/`, every new worktree carries them. The seat and scope reach the hooks through the environment, and a small scope guard (in the practice below) denies edits outside the scope, so the website session cannot edit the app, whatever the model decides. When the three sessions finish, the Chief opens each draft, checks diffs against scopes, and merges them in order, one at a time.

One outcome was wrong: the ops session stopped and reported that it needed a file in the customer-data domain. That was the stop rule working. The Chief did not widen the brief. It asked `cmd-ops`, the domain owner, who made and logged a decision.

## 5. Working with AI agents on this

What to delegate: drafting briefs from your outcome list, checking a brief for missing parts, drafting the launcher, reviewing a draft merge request against its brief. What you must do yourself: choose the outcome, set the scope and budget, decide when autonomy rises, and read the evidence.

A prompt you can adapt:

```text
Here is my brief. Act as a strict reviewer. For each of the seven parts (outcome, why,
scope, done-when, evidence, limits, stop-and-ask) say PRESENT, WEAK or MISSING, and quote
the words that decided it. Then list every place where a session would have to guess.
Do not rewrite the brief.
```

Check: every "guess" it lists should be a gap you can close or a stop rule you can add. Ask a second agent to *only* follow the brief on a trivial task and see where it asks or guesses.

Disclose: "AI use: brief drafts and review; I set outcomes, scopes and budgets."

**Where this sits on the ladder.** Writing a brief is rung two. Running many at once is rung three. Doing it inside enforced scope and budget is rung four.

## 6. Common mistakes and how to avoid them

- **Vague outcomes.** If you cannot check it from outside, it is not an outcome.
- **No stop rule.** The session guesses, and you find out later.
- **Scopes that overlap.** Collisions and conflicts. Split, or fix the merge order.
- **One working folder for many sessions.** Use worktrees.
- **No money limit on headless runs.** Set a turn limit and a budget every time.
- **Granting autonomy globally.** It is per seat and per domain.
- **Reading the chat, not the diff.** The diff and the pipeline are evidence.

## 7. Practice: three briefs, run in parallel

**Deliverable:** `briefs/` with three briefs, `scripts/run-brief.sh`, three draft merge requests (or branches), and a short note on what the stop rule caught. A small sample project is fine. Set a budget you can afford.

1. **Make a tiny sample** inside your repository: `app/`, `site/` and `ops/` folders, each with a small file and a test, or one real project of yours.
2. **Write three briefs** in `briefs/`, using the template above, with scopes that do not overlap. Make one brief **deliberately need** a file outside its scope.
3. **Commit the briefs and the guards.** The worktrees are copies of a commit, so anything uncommitted will not reach them.
4. **Add the scope guard.** Save this as `.claude/hooks/scope-guard.sh` (`chmod +x`) and register it in `.claude/settings.json` as a `PreToolUse` hook with matcher `Edit|Write|MultiEdit` and `"onFailure": "block"`, as in lesson 4. It enforces policy `P-005`:

```bash
#!/usr/bin/env bash
# PreToolUse guard: a session edits only the paths named in its brief (policy P-005).
# TRAILMUG_SCOPE is a space-separated list of path prefixes, set when the session is launched.
set -euo pipefail

input=$(cat)
target=$(jq -r '.tool_input.file_path // empty' <<<"$input")
[[ -z "$target" ]] && exit 0
scope="${TRAILMUG_SCOPE:-}"
[[ -z "$scope" ]] && exit 0   # not a briefed session

root="${CLAUDE_PROJECT_DIR:-$PWD}"
rel="${target#"$root"/}"
for prefix in $scope; do
  [[ "$rel" == "$prefix"* ]] && exit 0
done

jq -n --arg reason "Your brief allows changes only under: $scope. $rel is outside it (policy P-005). Stop and ask your Commander for a wider brief." \
  '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: $reason}}'
```

   Save the launcher above as `scripts/run-brief.sh` too, `chmod +x`, and read it. Test it first with a stub: a fake `claude` script that prints its environment, with `CLAUDE_BIN` pointed at it, so you can see the seat and scope arrive.
5. **Run the three briefs**, each with its seat, scope and a budget of one or two dollars. Run them in separate terminals or in the background.
6. **Read the results.** Open each result JSON for cost and turns. For each worktree run `git diff --stat main` and compare it with the scope.
7. **Check the stop rule.** Did the session with the out-of-scope need stop and report, or was it blocked by the scope guard? Write down which and why.
8. **Merge in the Chief's order**, one at a time, each through its own draft merge request, rebasing as needed.
9. **Place each seat on the autonomy ladder** and write what evidence would move it up. Log it.
10. **Remove the worktrees** with `git worktree remove`.

Commit with a message such as `Add three briefs, launcher and autonomy levels`.

**Check:** the three briefs, the three diff stats beside their scopes, and the written autonomy levels.

**Stretch:** have a read-only reviewer subagent (tools: Read, Grep, Glob) check a draft merge request against its brief.

## 8. Checklist

- [ ] Each brief has all seven parts.
- [ ] Scopes do not overlap, and the merge order is written down.
- [ ] Each session ran in its own worktree and branch.
- [ ] Every headless run had a seat, a scope, a turn limit and a money limit.
- [ ] I read diffs and evidence, not just the chat.
- [ ] The stop rule fired when it should, or I fixed the brief.
- [ ] Each seat has an autonomy level and a written reason.
- [ ] The human-only list still sits above the ladder.
- [ ] I recorded my AI use.

## 9. Further learning

Anthropic Academy's free Claude Code in Action course, and the DeepLearning.AI course on Claude Code, give hands-on practice with agentic coding. The Claude Code documentation on worktrees and headless mode covers the mechanics used here, and the best-practices page covers instructions and verification. Anthropic's writing on context engineering explains what to put in a brief.

**Next:** running the fleet. The next lesson in this track (`/library/tracks/agent-orchestration/06-running-the-fleet/`) shows how to read what many sessions did from one page, and how to decide what reaches you.
