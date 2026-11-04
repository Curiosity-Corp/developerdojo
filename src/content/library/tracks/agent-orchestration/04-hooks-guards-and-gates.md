---
title: "Hooks, guards and gates"
description: "Enforce policy at the moment of action with hooks and permission rules, and at the door to the default branch with protected branches, required pipelines and merge trains."
section: "Agent orchestration and policy administration"
order: 4
track: "agent-orchestration"
level: "advanced"
duration: "3 hours"
outcomes:
  - "Tell a suggestion from a guard, and a guard from a gate"
  - "Write a PreToolUse hook that denies a dangerous command and tells the agent what to do instead"
  - "Explain why a guard must fail closed, and configure it so"
  - "Set up the gates in front of the default branch on GitLab Free, and say what Premium adds"
  - "Apply fix forward and add the gate that would have caught the problem"
resources:
  - "anthropic/claude-code-hooks-guide"
  - "anthropic/claude-code-hooks-reference"
  - "anthropic/claude-code-permissions"
  - "anthropic/agent-sdk-hooks"
  - "openai/agents-guardrails"
  - "gitlab/protected-branches"
  - "gitlab/merge-trains"
  - "github/managing-a-merge-queue"
prerequisites:
  - "tracks/agent-orchestration/03-policy-as-data-and-decision-domains"
  - "fix-forward"
updated: 2026-11-03
---

**Supports:** Master Developer, module "AI-agent orchestration". **Time:** about three hours. **Needs:** your repository from lesson 3. Claude Code is needed for the hook steps, and a GitLab or GitHub project for the gate steps. Read every script before you run it.

## 1. Why this matters

Lesson 3 gave you rules in files. A rule in a file does nothing at the moment an agent types `git push --force`. For that you need **enforcement**, and it comes in two places.

A **guard** acts at the moment of the action: a hook or a permission rule that looks at what a session is about to do and says no. A **gate** acts at the door: a protected branch, a pipeline that must pass, a merge queue. The guard catches the mistake early and teaches the agent. The gate catches what the guard missed and cannot be talked around. You want both, because each has holes the other covers.

Here "policy is the off switch" becomes literal: the dangerous door is not watched, it is locked.

### What the PDM decides here

| You decide | You delegate to agents | You verify | Other disciplines involved |
|---|---|---|---|
| Which actions are denied, which need a gate, what the denial message says, what happens when a guard breaks | Writing the hook scripts, the tests for them, and the pipeline jobs | That each policy's check really fires, by trying to break it | Security (secrets, what to block), operations (the gates to production), engineering (pipeline design) |

## 2. Key ideas, explained

### Suggestion, guard, gate

| Kind | Where it lives | Can the agent skip it? | Example |
|---|---|---|---|
| **Suggestion** | Project instructions, a prompt | Yes: it is text the model may follow | "Please do not push to main." |
| **Guard** | A hook or permission rule in the agent tool | Not by asking: it runs outside the model | A hook that denies `git push --force` |
| **Gate** | The git host or pipeline | Not from a session at all | A protected branch that refuses direct pushes |

Instructions are the **first line, not the last**. A well-instructed agent rarely hits a guard, but anything you could not live with it ignoring needs a guard or a gate.

### How a Claude Code hook works

Claude Code can run your script at fixed moments. Two matter most here:

- **SessionStart** runs when a session begins. Your script can print context that is added to what the model sees, such as "your seat is cmd-app and these are the rules."
- **PreToolUse** runs before a tool call. Your script gets the call as JSON on standard input: the tool name and its input, such as the command about to run. It can allow it, ask, or **deny** it by printing JSON with `permissionDecision: "deny"` and a reason. Exit code 2 also blocks.

The denial reason goes back to the agent, so write it as an instruction: say what is not allowed and what to do instead. An agent that is told "do not push to the default branch; push your branch and open a merge request" will do exactly that. The [hooks guide](https://code.claude.com/docs/en/hooks-guide) and [reference](https://code.claude.com/docs/en/hooks) give the full list of events and fields.

Two details that trip people up:

1. **No output is not approval.** A hook that prints nothing and exits 0 means "no decision." Other permission rules still apply. A hook is a filter that says no, not a pass that says yes.
2. **A broken guard fails open by default.** If your script crashes, or `jq` is missing, or it exits with a code other than 0 or 2, Claude Code treats it as a non-blocking failure and the tool call proceeds. A guard that silently stops guarding is worse than none, because you think you are protected. For a guard, set `"onFailure": "block"` (available from Claude Code v2.1.295) so that a broken hook blocks the call. Test that it does.

### Permission rules, and their limit

Claude Code also has [permission rules](https://code.claude.com/docs/en/permissions): lists of allow, ask and deny patterns in settings. They are checked in the order deny, then ask, then allow. A `Read(./.env)` deny rule is a good first line: the file tools can no longer open the file.

But notice what it covers: the **Read tool**. It does not cover a shell command such as `cat .env`, which goes through the Bash tool. This is the reason for guards. A rule on one tool does not cover every other way to do the same thing, so you add a hook on Bash that denies the shell routes too. Think in **routes**: for each forbidden thing, list every way it could be done.

### Settings levels: who can change the guard?

Hooks and rules can be set at several levels: the user, the shared project, a local project file, and an organisation-managed level that outranks them. For a command chain this matters. If a session can edit `.claude/settings.json`, it can switch off its own guard. So: the project guard files are changed **only through a reviewed merge request**, a hook denies edits to `.claude/` from inside a session, and where your plan allows it, an organisation-level setting that allows only managed hooks makes the guard impossible to remove from the project. Whoever can change the rules must not be the one the rules bind.

### Gates at the door

Guards live where the session runs. Gates live at the shared host, out of a session's reach. On **GitLab**, from the free tier:

- **Protected branches**: you choose who may push or merge to the default branch. Set pushes to "no one", merges to maintainers. A [protected branch](https://docs.gitlab.com/user/project/repository/branches/protected/) refuses a direct push no matter what the session thinks.
- **Pipelines must succeed**: a merge request setting that blocks the merge button until the pipeline is green. This is on the free tier too.
- **Draft merge requests**: a draft cannot merge until it is marked ready. Sessions open drafts; a Commander marks them ready.

On Premium and Ultimate, GitLab adds [merge trains](https://docs.gitlab.com/ci/pipelines/merge_trains/) (merge requests queue, and each is tested on top of the ones ahead of it, so two changes that pass alone cannot break each other once combined), required approvals and Code Owners. On **GitHub**, branch protection and rulesets give the equivalent of protected branches and required status checks, and a [merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue) is the merge train; its availability depends on your plan and repository type, so check your plan before you rely on it.

On the free tiers, you get the same effect by hand: the Chief of Command merges one merge request at a time, rebasing each onto the latest default branch and waiting for green. A queue by discipline is slower than one by machine, but it works.

### The Agent SDKs

The same guard idea exists in code. In the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/hooks) you pass hook functions in the options, and in the [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/guardrails/) you attach guardrails to a tool or an agent. The shape is the same: a function sees the action first and can reject it with a message.

### Fix forward, and add the gate

When a bad change gets through, you do not revert it and you do not force-push it away. You **fix forward**, as [the Way](/library/fix-forward) says: land a new change that repairs the problem. Then you ask the question that makes the system stronger: **what gate would have caught this?** And you add it. Each incident becomes a permanent check, so nobody is hurt the same way twice.

## 3. Step by step: lock one door properly

1. **Pick one policy** from lesson 3, such as `P-001` or `P-003`.
2. **List the routes**: every command, tool and way to the same effect.
3. **Choose guard, gate or both.** A guard teaches early; a gate holds absolutely. For anything serious, both.
4. **Write the denial message:** what is blocked, which policy says so, and the legal alternative.
5. **Make it fail closed**, then break the script on purpose and confirm the action is blocked.
6. **Try to break it:** ask an agent to do the forbidden thing in plain words and in sneaky ones.
7. **Put the gate at the host:** protected branch, green pipeline required, draft first.
8. **Record the check:** update the policy's `check` field with the real mechanism and the test that proves it.

## 4. Worked example: TrailMug

Maya's Chief of Command wants three things locked: no direct pushes to the default branch (P-001), nothing merges on red (P-002), and no force pushes (P-003). She writes `.claude/hooks/guard-bash.sh`:

```bash
#!/usr/bin/env bash
# PreToolUse guard for Bash. A denial tells the agent what to do instead.
set -euo pipefail

input=$(cat)
cmd=$(jq -r '.tool_input.command // empty' <<<"$input")

deny() {
  jq -n --arg reason "$1" '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: $reason}}'
  exit 0
}

# Look at each part of a compound command on its own, anchored at the start,
# so a commit message that mentions "git push --force" does not trip the guard.
while IFS= read -r seg; do
  if [[ "$seg" =~ ^[[:space:]]*git[[:space:]]+push([[:space:]].*)?[[:space:]](-f|--force|--force-with-lease)([[:space:]=]|$) ]]; then
    deny "Force pushes are not allowed (policy P-003: fix forward). Push a new commit that repairs the problem."
  fi
  if [[ "$seg" =~ ^[[:space:]]*git[[:space:]]+push[[:space:]].*[[:space:]:](main|master)([[:space:]]|$) ]]; then
    deny "Do not push to the default branch (policy P-001). Push your branch and open a merge request."
  fi
  if [[ "$seg" =~ --no-verify ]]; then
    deny "Hooks and checks may not be skipped (--no-verify). Fix what the check found."
  fi
  if [[ "$seg" =~ ^[[:space:]]*(cat|less|more|head|tail|grep|source|\.)[[:space:]].*\.env([[:space:]]|$) ]] \
    || [[ "$seg" =~ ^[[:space:]]*(printenv|env)([[:space:]]|$) ]]; then
    deny "Secrets must never reach model-visible output (policy P-004). Ask your Commander for the value to be supplied outside the session."
  fi
  if [[ "$seg" =~ (sed[[:space:]]+-i|rm|mv|cp|tee|>)[^\|]*\.claude/ ]]; then
    deny "The guards under .claude/ are changed only through a reviewed merge request, never from inside a session."
  fi
done < <(tr ';|&' '\n' <<<"$cmd")
exit 0
```

The command is split into parts, so a commit message that merely mentions a force push does not trip the guard. The "push to main" pattern needs a space or colon before `main`, so `feature/main` is not caught by accident. A real guard also checks the merge: before allowing `glab mr merge 42` it asks the host for that merge request's pipeline status and denies unless it is `success`, and it denies a merge command with no number, so it cannot be skipped by omission.

She registers it, with the other guards, in `.claude/settings.json`:

```json
{
  "permissions": {
    "deny": ["Read(./.env)", "Read(./.env.*)", "Read(./secrets/**)"]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/guard-bash.sh", "args": [], "onFailure": "block" }
        ]
      }
    ]
  }
}
```

At the host she sets the default branch to **no direct pushes**, turns on **pipelines must succeed**, and tells every session to open **draft** merge requests. The Chief marks one ready, and merges one at a time.

A week later a session broke the build, and a second session merged on top of it. Maya's rule was fix forward: nobody reverted, and a new commit repaired the build. Then the Chief asked the retrospective question and found the gap: the second merge request's pipeline had not run on the *combined* result. The gate she added: the pipeline must run on merged results (Premium), or, on the free tier, the Chief rebases each merge request on the latest default branch and waits for green before it merges. She wrote the new rule into `P-002`'s check field, with the date.

## 5. Working with AI agents on this

What to delegate: writing the hook scripts, writing tests that feed them sample JSON, listing routes for a forbidden action, and drafting the pipeline job. What you must do yourself: decide what is forbidden, decide the denial wording and exceptions, choose fail closed, and approve every change to a guard.

A prompt you can adapt:

```text
Here is policy P-001 and my guard-bash.sh. List every way a shell command could push to
the default branch that this script would NOT catch. For each, give the exact command.
Do not fix the script yet. Do not run any of the commands.
```

Check: run each suggested command through the hook with sample JSON, as in the lab, and see which pass through. Anything that passes is a hole to close, or a case to cover with the gate at the host.

Disclose: "AI use: hook draft and route list; I reviewed every pattern and tested every denial."

**Where this sits on the ladder.** This is rung four. It is the first lesson where a session simply cannot do the thing, whatever it thinks.

## 6. Common mistakes and how to avoid them

- **Relying on instructions alone.** They are advice. Add a guard.
- **A guard that fails open.** A crash or a missing tool lets everything through. Set fail closed and test it.
- **Guarding one route.** Denying the Read tool but not `cat`. List the routes.
- **Letting a session edit its own guard.** Deny edits to guard files.
- **A denial with no alternative.** "No" teaches nothing. Say what to do instead.
- **Regexes that are too wide.** Test them with harmless cases.
- **Fixing forward but adding no gate.** The point is that it does not happen twice.

## 7. Practice: the guard and the gate

**Deliverable:** `.claude/hooks/guard-bash.sh`, `.claude/settings.json`, a test script with sample JSON, and the host settings, with a short log of what you tried to break.

1. **Install `jq`**, which the hook uses to read the JSON.
2. **Write the guard** from the worked example, trimmed to your own policies. Make it executable with `chmod +x`.
3. **Test it without a model.** Feed it sample JSON, and look at the output:

```bash
echo '{"tool_name":"Bash","tool_input":{"command":"git push --force origin feature/x"}}' \
  | .claude/hooks/guard-bash.sh
echo '{"tool_name":"Bash","tool_input":{"command":"git commit -m \"explain why force push is banned\""}}' \
  | .claude/hooks/guard-bash.sh; echo "exit: $?"
```

   The first prints a denial. The second prints nothing and exits 0, because the words appear only inside a commit message.
4. **Register it** in `.claude/settings.json` as above, with `"onFailure": "block"`.
5. **Try it for real** (needs Claude Code). Start a session and ask it to push straight to the default branch, then to force-push. Read what it says. It should switch to a branch and a merge request. Note whether it tried a workaround.
6. **Test fail closed.** Temporarily add `exit 1` as the first line of the script, ask the session to run any shell command, and see the call blocked. Remove the line. Then try the same with `"onFailure"` removed and see the difference for yourself.
7. **Close the `cat` gap from lesson 1.** Ask a session to run `cat .env` (with your fake file in place). Confirm the hook denies it.
8. **Set the gates at the host.** On GitLab: protect the default branch with pushes set to no one; in merge request settings turn on "Pipelines must succeed". On GitHub: add a branch protection rule or ruleset that requires a pull request and passing status checks. Then try a direct push from your terminal and read the refusal.
9. **Update the `check` fields** of `P-001` to `P-003` so each names the guard file and the host setting.
10. **Run a mini retrospective.** Which of your attempts got through? What gate would catch it? Add it.

Commit with a message such as `Add guard-bash hook and host gates`.

**Check:** pasted outputs of the denials, the fail-closed test, the refused push, and the retrospective.

**Stretch:** write the same force-push guard as a hook function in the Claude Agent SDK or a tool guardrail in the OpenAI Agents SDK.

## 8. Checklist

- [ ] I can say the difference between a suggestion, a guard and a gate.
- [ ] My hook denies with a reason that tells the agent what to do instead.
- [ ] I proved my guard fails closed.
- [ ] I listed the routes for each forbidden action, not just one.
- [ ] A session cannot edit its own guard.
- [ ] The default branch refuses direct pushes at the host.
- [ ] Pipelines must succeed before a merge.
- [ ] I ran a retrospective and added at least one gate.
- [ ] I recorded my AI use.

## 9. Further learning

Anthropic's documentation on Claude Code hooks and permissions is the primary reading, and the Agent SDK page shows hooks in code. The OpenAI Agents SDK page on guardrails shows the same idea. GitLab's pages on protected branches and merge trains, and GitHub's page on merge queues, describe the gates at the host. Read the plan notes before you rely on a feature.

**Next:** delegation briefs and long-horizon work. The next lesson in this track (`/library/tracks/agent-orchestration/05-delegation-briefs-and-the-autonomy-ladder/`) shows how to hand work down so a session can run for hours inside these guards.
