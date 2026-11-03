---
title: "Policy as data and decision domains"
description: "Write standing policies as files with a reason, a check and an exception path, test them like code, and give every area of design exactly one owner."
section: "Agent orchestration and policy administration"
order: 3
track: "agent-orchestration"
level: "advanced"
duration: "3 hours"
outcomes:
  - "Write a standing policy that is observable, testable and has an exception path"
  - "Keep policy as data in git and test its format with a policy engine"
  - "Define decision domains with one owner each, and write them so a machine can read them"
  - "Record why a rule exists with a decision record"
  - "Explain the difference between a policy, a guard and a gate"
resources:
  - "open-policy-agent/opa-policy-language"
  - "open-policy-agent/opa-policy-testing"
  - "open-policy-agent/conftest"
  - "adr/architectural-decision-records"
  - "anthropic/claude-code-settings"
  - "anthropic/claude-code-managed-settings"
  - "nist/ai-risk-management-framework"
prerequisites:
  - "tracks/agent-orchestration/02-the-command-chain"
  - "the-way-five-rules"
updated: 2026-11-03
---

**Supports:** Master Developer, module "AI-agent orchestration". **Time:** about three hours. **Needs:** the repository from lessons 1 and 2, and Conftest. The lab needs no model until the last step.

## 1. Why this matters

A rule in someone's head is not a rule. It cannot be read by a new agent, checked by a pipeline, audited by a customer or questioned by a colleague. When you run many sessions, every session starts with no memory. What it knows is what you put in front of it. So the rules must live in **files**, in a form a person can read and a machine can check.

There is a second problem. Rules without reasons go stale. Someone forgets why "no direct pushes" exists, a deadline arrives, and the rule is dropped. A rule with a **reason** and an **exception path** survives: people can see what it protects, and they know the legitimate way around it.

This lesson teaches two things. First, **standing policies**: short rules, each with a why, a check and an exception, stored as data. Second, **decision domains**: areas of design that have exactly one owner, so agents ask the owner instead of changing things alone.

### What the PDM decides here

| You decide | You delegate to agents | You verify | Other disciplines involved |
|---|---|---|---|
| Which rules exist, why, who owns each domain, what the exceptions are | Drafting policy text, writing the format tests, applying a policy in a pipeline | That each policy has a working check, and that domains match the org map | Legal and privacy (data rules), brand (public face), security (secrets), finance (spending) |

## 2. Key ideas, explained

### What a standing policy is

A **standing policy** is a rule that holds until someone changes it through a recorded decision. It is not a task, a wish or a preference. Each one has six parts:

| Part | Question it answers |
|---|---|
| **id** | How do we refer to it? |
| **rule** | What is always or never done? One sentence. |
| **why** | What does it protect? |
| **check** | How is it observed or enforced? |
| **exception** | What is the legitimate way around it, if any? |
| **owner** | Who may change it? |

A good rule is **observable** (you can tell whether it held), **testable** (a machine can try to break it), and has an **exception path** (a stated route for the real emergency, so people do not invent one). "Be careful with customer data" fails all three. "No session may run a command that deletes customer records" passes the first two, and gets its exception: "ask the data owner."

### Policy is data

Write policies in a plain data format such as YAML, not in a prose document and not buried in code. Three reasons:

1. **Agents can read it.** A session start can load the file, and a hook can read the same file.
2. **Machines can test it.** A pipeline can refuse a policy file with a missing reason.
3. **Changes are reviewable.** A change to a policy is a diff in a merge request, with a date and an author.

This is the same idea as infrastructure as code, applied to rules. It is also why the rules and the enforcement should point at each other: the policy says what check enforces it, and the check reads the policy.

### Policy, guard, gate

Three words, three jobs. A **policy** is the written rule. A **guard** is a mechanism that stops an action at the moment a session tries it (a hook, a permission rule). A **gate** is a mechanism that stops a change from moving forward (a pipeline stage, a protected branch). Lesson 4 builds guards and gates. This lesson builds the policy they enforce, and the test that the policy file is well formed.

### Decision domains

Some choices should have one owner. The customer-data retention rule, the brand name and logo, the pricing, the security baseline. If any session may change them, the result is a design that no one chose. A **decision domain** is such an area: it has a name, an owner (a seat from your org map), a reason, and a list of what it covers.

The rule for everyone else is simple: **do not change it, ask the owner.** The owner decides, records the decision, and everyone else follows. Domains are not walls. Anyone can propose a change. They are a way to make sure that exactly one seat decides, and that the decision is on the record.

Write domains as data too, so a hook can enforce them. A domain lists the **paths** it covers and, when needed, the **commands** that change it.

### Decisions are written down, and tested later

A policy says what. A **decision record** says why this and not the alternative, on a date, by someone. The common form is the [architecture decision record](https://adr.github.io/): a short file with the context, the decision and its consequences. Together with lesson 1's idea that earlier decisions are hypotheses, records make it possible to change a rule honestly: you write a new record that supersedes the old one, and you can see what changed and what evidence changed it.

### Where policy stops

Be honest about what policy does. A policy file does nothing by itself. It becomes real only through a check. The risk framework from [NIST](https://www.nist.gov/itl/ai-risk-management-framework) puts it as govern, map, measure and manage: written governance has to connect to measurement. Every policy you write should name its check, and the check must be able to fail.

Claude Code itself shows the layering. [Settings](https://code.claude.com/docs/en/settings) can come from the user, the shared project, a local project file and from an organisation level; [managed settings](https://code.claude.com/docs/en/settings#settings-files) set by an organisation take precedence and cannot be overridden by a project. That is how an Admiral's rule can bind every Commander. You will use this in lesson 4.

## 3. Step by step: write a policy that works

### Step 1: Find a rule you keep repeating

Look at the last ten times you corrected an agent. Which correction was the same each time?

### Step 2: Write the one-sentence rule

One thing per rule. If it has "and", split it.

### Step 3: Write the why

What does it protect, in one sentence?

### Step 4: Write the check

How will anyone know it held? Name the mechanism: a setting, a hook, a pipeline job, a review step. If nothing can check it, it is a wish, not a policy.

### Step 5: Write the exception

The legitimate route, or "None."

### Step 6: Name the owner

A seat from the org map, or the human.

### Step 7: Test the file

A format test so a policy without a why cannot merge.

### Step 8: Record the decision

A dated decision record, saying what you chose and what you rejected.

## 4. Worked example: TrailMug

Maya writes five standing policies. Here are two; the other three (`P-003` fix forward, `P-004` secrets stay out of model-visible output, `P-005` a session edits only the files in its brief) follow the same shape.

```yaml
policies:
  - id: P-001
    rule: "No session pushes to the default branch. Work reaches it only through a merge request."
    why: "A reviewed, tested change is cheap to trust. A direct push is not."
    check: "Protected branch setting, plus a hook that denies the command."
    exception: "None. Emergencies use a merge request with the label urgent."
    owner: founder
  - id: P-002
    rule: "A merge request merges only when its pipeline is green."
    why: "The pipeline is the quality bar when agents write the code."
    check: "Project setting: pipelines must succeed."
    exception: "A pipeline that cannot run is fixed first. It is never skipped."
    owner: founder
```

Look at what each one names. The check is a **real mechanism**, which lesson 4 builds. The exception for P-001 is "None", which is a decision, not an omission.

Then the domains, in `policy/domains.json`:

```json
{
  "domains": [
    {
      "name": "customer-data",
      "owner": "cmd-ops",
      "why": "One place decides what customer data we store and for how long. Other seats ask; they do not change it.",
      "paths": ["*/data-retention/*", "*/privacy/*"],
      "commands": ["^[[:space:]]*(psql|sqlite3)[[:space:]].*(DROP|DELETE|TRUNCATE)"]
    },
    {
      "name": "brand",
      "owner": "cmd-site",
      "why": "The name, logo and voice are public and hard to undo. One owner keeps them consistent.",
      "paths": ["*/brand/*", "*/site/src/content/brand*"],
      "commands": []
    }
  ]
}
```

When `cmd-app` is asked by a café for a different logo, it does not edit the brand folder. It passes the request to the Chief, who passes it to `cmd-site`. The brand owner decides, records the decision, and the app follows. And because the logo is public, the **human** approves anything that changes the name itself, as lesson 1's list says.

One more thing from the worked example: the data domain is owned by `cmd-ops`, which is also the owner of the command repository. That is allowed, and it is a choice. Maya writes a decision record explaining why she accepted it for the pilot and what would make her split it.

## 5. Working with AI agents on this

What to delegate: drafting the first version of each policy from your corrections, writing the format test, finding rules that have no check, and proposing domains from your org map. What you must do yourself: decide which rules are really rules, decide the exceptions (especially "None"), and own the reasons.

A prompt you can adapt:

```text
Below are my last ten corrections to agents. Group them into candidate standing policies.
For each, write: rule (one sentence), why, check, exception, owner. If you cannot name a
real mechanism for the check, write "NO CHECK YET" instead of inventing one. Do not add
policies I did not imply.
```

Check: every "check" must name something that exists or that you will build. Reject any check that says "the agent will remember".

Disclose: "AI use: policy drafts from my list of corrections; I wrote all exceptions and the owners."

**Where this sits on the ladder.** Writing a policy is rung two. Putting it in a tested file is rung three. Making it enforce itself is rung four, which starts here and finishes next lesson.

## 6. Common mistakes and how to avoid them

- **Rules with no reason.** They are dropped at the first deadline.
- **Rules with no check.** Wishes. Name the mechanism or write "NO CHECK YET".
- **Rules that say two things.** Split them, so each has a clear pass or fail.
- **No exception path.** People invent one at the worst moment.
- **Too many policies.** Five you enforce beat fifty you do not. Add one only when you can enforce it.
- **Domains with two owners, or none.** The same rule as for the org map: exactly one.
- **Editing a policy quietly.** Supersede it with a dated decision record.

## 7. Practice: policies, domains and a test

**Deliverable:** `policy/standing-policies.yaml`, `policy/domains.json`, `policy/policy-format.rego` with a passing test, and one decision record. The first six steps need no model.

1. **Write three to five policies** in `policy/standing-policies.yaml`, with all six fields. Start with the five above, or write your own. Each check must name a real mechanism.
2. **Write the format rules** in `policy/policy-format.rego`:

```rego
package policyformat

import rego.v1

required := ["id", "rule", "why", "check", "exception", "owner"]

deny contains msg if {
	some p in input.policies
	some field in required
	not p[field]
	msg := sprintf("policy %v is missing %q", [object.get(p, "id", "(no id)"), field])
}

deny contains msg if {
	some p in input.policies
	count(p.rule) > 200
	msg := sprintf("policy %v is too long (over 200 characters): split it into rules that each say one thing", [p.id])
}

deny contains msg if {
	ids := [p.id | some p in input.policies]
	count(ids) != count({i | some i in ids})
	msg := "two policies share an id"
}
```

3. **Run it:** `conftest test policy/standing-policies.yaml -p policy --namespace policyformat`. It should pass. Delete one `why` line and run it again to see it fail. Restore the line.
4. **Test the test.** Write `policy/policy-format_test.rego` and run it with [OPA](https://www.openpolicyagent.org/docs/policy-testing) (`opa test policy/ -v`):

```rego
package policyformat_test

import rego.v1

import data.policyformat

good := {"policies": [{"id": "P-001", "rule": "No direct pushes.", "why": "Review is cheap.", "check": "Hook.", "exception": "None.", "owner": "founder"}]}

test_complete_policy_passes if {
	count(policyformat.deny) == 0 with input as good
}

test_missing_why_is_denied if {
	bad := {"policies": [{"id": "P-009", "rule": "x", "check": "y", "exception": "z", "owner": "o"}]}
	some msg in policyformat.deny with input as bad
	contains(msg, "missing \"why\"")
}
```

5. **Write the domains** in `policy/domains.json`, at least two, each with an owner who exists in your org map. Your org-map check from lesson 2 stays green.
6. **Write one decision record** in `decisions/0001-policies-and-domains.md`: context, decision, alternatives you rejected, consequences, and what evidence would make you change it. Date it.
7. **Make the domain enforceable** (needs Claude Code). Save this hook as `.claude/hooks/domain-guard.sh`, make it executable, and read it carefully before running anything. It reads the session's seat from an environment variable and denies edits and commands in domains the seat does not own:

```bash
#!/usr/bin/env bash
# PreToolUse guard: a session may not change a decision domain it does not own.
set -euo pipefail

input=$(cat)
tool=$(jq -r '.tool_name' <<<"$input")
seat="${TRAILMUG_SEAT:-unknown}"
domains="${CLAUDE_PROJECT_DIR:-.}/policy/domains.json"

deny() {
  jq -n --arg reason "$1" '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: $reason}}'
  exit 0
}

case "$tool" in
  Edit | Write | MultiEdit)
    target=$(jq -r '.tool_input.file_path // empty' <<<"$input")
    while IFS=$'\t' read -r name owner pattern; do
      if [[ "$target" == $pattern && "$seat" != "$owner" ]]; then
        deny "The $name domain belongs to $owner. Do not change it from $seat. Ask $owner through your Commander."
      fi
    done < <(jq -r '.domains[] | .name as $n | .owner as $o | .paths[] | [$n, $o, .] | @tsv' "$domains")
    ;;
  Bash)
    cmd=$(jq -r '.tool_input.command // empty' <<<"$input")
    while IFS=$'\t' read -r name owner pattern; do
      if [[ "$cmd" =~ $pattern && "$seat" != "$owner" ]]; then
        deny "The $name domain belongs to $owner. This command changes it, so $seat may not run it. Ask $owner through your Commander."
      fi
    done < <(jq -r '.domains[] | .name as $n | .owner as $o | .commands[] | [$n, $o, .] | @tsv' "$domains")
    ;;
esac
exit 0
```

   Register it in `.claude/settings.json` under `hooks.PreToolUse` with the matcher `Edit|Write|MultiEdit|Bash`, then start a session with `TRAILMUG_SEAT=cmd-app claude` and ask it to edit a file under `brand/`. It should be refused with the reason above. Start again with `TRAILMUG_SEAT=cmd-site` and the edit goes through. Lesson 4 explains the settings and why this hook must fail closed.

Commit with a message such as `Add standing policies, domains and format tests`.

**Check:** the failing run, the passing run, the OPA test result, and the refused edit, all pasted into your log.

**Stretch:** add a rule to `orgmap.rego` that every domain's owner is a real seat in the org map, and test it.

## 8. Checklist

- [ ] Every policy has an id, rule, why, check, exception and owner.
- [ ] Every check names a real mechanism, or says "NO CHECK YET".
- [ ] The format test passes, and fails when I remove a field.
- [ ] Every domain has exactly one owner from my org map.
- [ ] A decision record explains the choices and the alternatives.
- [ ] A non-owner session was refused when it tried to change a domain.
- [ ] I recorded my AI use.

## 9. Further learning

The Open Policy Agent documentation on the policy language and on testing is the core reading, and Conftest is the simplest way to run it over YAML and JSON files. The ADR site explains decision records. Anthropic's documentation on Claude Code settings and managed settings shows how layered configuration lets a higher level bind the lower ones. The NIST AI Risk Management Framework is the formal version of the govern, map, measure, manage cycle.

**Next:** hooks, guards and gates. The next lesson in this track (`/library/tracks/agent-orchestration/04-hooks-guards-and-gates/`) makes these policies stop actions at the moment they are tried.
