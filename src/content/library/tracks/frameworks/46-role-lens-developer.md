---
title: "Role lens: the developer as Product Development Manager"
description: "How the developer's role changes when agent sessions write much of the code: the PDM directs a command chain bounded by policy and gates, specifies, reviews and verifies, and still owns quality, security and release."
section: "Frameworks"
order: 46
track: "frameworks"
level: "advanced"
duration: "60 min"
outcomes:
  - "Describe the developer role as direction, specification, review and release rather than typing code"
  - "Write a hand-off specification and a review routine that catch what agent sessions get wrong"
  - "Set policy, hooks and gates so that more sessions means more output without less safety"
resources:
  - "anthropic/building-effective-agents"
  - "anthropic/claude-code-best-practices"
  - "agents-md/agents-md"
  - "nist/secure-software-development-framework"
  - "owasp/ci-cd-security-cheat-sheet"
  - "dora/software-delivery-performance-metrics"
  - "gitlab/docs-merge-request-approvals"
prerequisites:
  - "tracks/frameworks/40-role-lens-one-shared-language"
updated: 2026-11-03
---

**Dojo programme link:** this lens is the heart of the Master Developer path. It continues lesson 33 and explains the developer seat of the whole capstone.

## 1. Why this matters

The title "developer" will mean something different in 2030. Agent sessions will write much of the routine code, faster and at lower cost than people. The value of the human developer moves to what sessions cannot be accountable for: choosing what to build, specifying it so clearly that it can be built, judging whether the result is right, keeping the system safe, and answering for it when it runs in front of customers.

This is the **Product Development Manager (PDM)** version of the developer: a person who understands code and systems deeply enough to judge them, who also understands the other six seats well enough to direct work across them, and who runs a command chain of sessions inside written policy. You may still write code, and you should, because you cannot review what you cannot do. But your leverage comes from direction, review and governance.

## 2. Key ideas, explained

### 2.1 What the seat owns

| Responsibility | Framework or artefact | File in git |
|---|---|---|
| Specify | Hand-off issue as contract (lesson 21 and 33) | issue and `docs/specs/` |
| Direct | Command chain: sessions, Commander | `policy/agents.md`, board |
| Review | Merge request review against acceptance and manifest | MR comments |
| Guard | Policy, hooks, gates, protected branches | `policy/`, pipeline config |
| Release | Launch Sequence stages 1 to 5, change records | `docs/launch/` |
| Learn | Reviews, DORA measures, GROWTH Health | `mission-control/` |

### 2.2 The ladder, from the developer's seat

1. **Use** one agent for small jobs: explain this, write a test, rename these files.
2. **Delegate** a whole task with a brief: build this endpoint to this specification.
3. **Orchestrate** several sessions: three issues in parallel on different files, each with its own branch and merge request, you as Commander.
4. **Govern**: write the policy, hooks and gates so that the sessions can work without you watching every step.

Climb one rung at a time. Each rung adds output and adds risk, and the next rung is the control for it. Do not run several sessions without gates. The track [Agent orchestration](/library/tracks/agent-orchestration/) covers the upper rungs in depth, including the Session, Commander, Chief of Command and Admiral levels.

### 2.3 Specification is the new craft

A session does what the issue says, not what you meant. Good specifications have: the outcome in one sentence; inputs and the files in scope; what is out of scope; acceptance as pass or fail checks; the gates to pass; and a stop rule. Compare with the guidance in Anthropic's [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) and [best practices for Claude Code](https://docs.anthropic.com/en/docs/claude-code/best-practices): simple structures, clear tool boundaries, and checks the agent can run itself.

Keep an [`AGENTS.md`](https://agents.md) at the root of each repository: how to build, test and run; the style; the files not to touch; the location of the policy. It is read at the start of each session and saves repeating yourself. Remember: it is advice. The pipeline is the wall.

### 2.4 Review is the new bottleneck

If sessions produce many merge requests, your review capacity limits you. Habits that scale:

- **Small merge requests**, one issue each.
- **Tests first.** Ask for the failing test, then the fix.
- **Read the diff for scope.** Anything outside the issue's files is a flag.
- **Check the manifest**: which session, which brief, which checks ran.
- **Read the risky parts yourself**: authentication, data access, money, deletion, anything touching secrets.
- **Run it.** A green pipeline shows what was tested, not what was missed.
- **Sample.** Review everything at first; later sample by risk, while gates stay on for all.

### 2.5 Security and supply chain

Agents add code and dependencies quickly, so supply chain checks matter more. The NIST [Secure Software Development Framework](https://csrc.nist.gov/projects/ssdf) and the OWASP [CI/CD security cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html) describe practices that fit: protect the pipeline, review changes, scan dependencies, never expose secrets to builds that do not need them. Launch Sequence stages 1 to 3 (lessons 25 and 26) turn these into gates. Never give a session credentials it does not need, and never let one change the pipeline or the policy.

### 2.6 Measures for the developer seat

The [DORA measures](https://dora.dev/guides/dora-metrics-four-keys/) for software delivery (change lead time, deployment frequency, failed deployment recovery time, change fail rate, rework rate) tell you whether more agent output is really a gain. If lead time falls and change fail rate rises, you moved risk, not value. Add a quality measure of your own: defects found after merge per 10 merge requests.

## 3. Step by step

1. **Write `AGENTS.md`** and `policy/agents.md`.
2. **Protect the branch**: green pipeline, one human approval, protected pipeline and policy paths.
3. **Turn on the gates** at observe or warn level (secret scan, tests, lint, dependency scan).
4. **Write an issue as a contract** for one small task.
5. **Run one session**; review closely.
6. **Record what it got wrong** and fix the brief, the `AGENTS.md` or the gate. Never just fix the output.
7. **Run two sessions** on different files; compare review time.
8. **Move gates to enforce** as you trust the signal.
9. **Measure** with DORA and a defect rate; review monthly.

## 4. Worked example: TrailMug

Maya wears the developer hat for epic 1. She wrote `AGENTS.md` (how to run tests, naming, the rule "never edit `.gitlab-ci.yml` or `policy/`") and a policy file. The main branch is protected with required approval, and edits to the pipeline and policy paths need a second approver.

Session A built the cafés API. In review she found three issues: it also edited a shared seed file (scope), the distance test used a single point (weak test), and it added a new dependency for a distance calculation that a standard library function already covered (supply chain). She commented on all three in the merge request, and the session fixed them. She then added three things so the problem would not recur: a line in `AGENTS.md` ("do not add a dependency without a note in the issue"), a CI check that fails on a new dependency without an approved label (warning at first), and a standard test template for distance queries.

Over four weeks her change lead time dropped and change fail rate stayed under 15 percent. When two merge requests in a row had defects after merge, she paused parallel sessions, tightened the tests, and resumed.

What she did **not** hand off: the choice of the map provider (cost and privacy), the release decision, the review of the authentication change, and any change to the policy.

## 5. Working with AI agents on this

**What the PDM decides.** What gets built; the specification; policy; gate levels; what to merge; what to release; when to slow down.

**What is delegated, with the exact brief.**

```text
Goal: add input validation to POST /cafes/:id/reports so that reports
longer than 500 characters are rejected with a clear 400 message.
In scope: src/routes/reports.ts, its tests. Out of scope: everything else,
especially .gitlab-ci.yml, policy/, secrets and the database schema.
Done when: new tests cover empty, 500 and 501 character cases; lint and
the full test suite pass; the merge request lists the commands you ran.
Rules: follow AGENTS.md. Add no new dependencies. If a decision is
needed, stop and write BLOCKED.md. Add a manifest entry.
```

```text
Review merge request !N against issue #M. List every changed file and say
IN SCOPE or OUT OF SCOPE. List each acceptance criterion with PASS, FAIL
or UNKNOWN and the evidence. List new dependencies and their licences. Do
not approve, merge or change anything.
```

```text
Read the last 20 merged merge requests and their manifests. For each,
say which gate (if any) caught a problem and which problems were found
after merge. Output a table. Do not suggest fixes.
```

**How to verify.** Read the diff yourself for the first several merges. Run the new tests and one manual check. Open the manifest. Compare the review summary with the real diff. Sample the post-merge table against the incident and bug records.

**Disciplines involved.** All of them: product (the specification), design (acceptance), security (gates), operations (release and runbooks), finance (cost per session), marketing (what you may promise), founder (risk appetite).

**Where it stops being "hand it to AI".** Orchestration begins when several sessions run at once, with a Commander (you) holding the board. Governance begins when the policy, the hooks and the gates, not your attention, keep them safe. This is the shift from doing the work, to directing the work, to designing the system that directs the work.

## 6. Common mistakes and how to avoid them

- **Vague issues.** Write contracts.
- **Fixing output, not the system.** Fix the brief, `AGENTS.md` or the gate.
- **Trusting green.** Read the diff and run it.
- **Running many sessions with no gates.** Climb one rung at a time.
- **Letting sessions change the pipeline or policy.** Protect those paths.
- **Unreviewed dependencies.** Gate them.
- **Unreviewed security code.** Read authentication and data access yourself.
- **Measuring only speed.** Watch the change fail rate and rework.
- **Letting skills fade.** Write some code yourself; you cannot judge what you cannot do.

## 7. Practice

**Deliverable in git:** a branch `developer-lens`:

1. `AGENTS.md` and `policy/agents.md`, with protected paths described in `docs/protection.md`.
2. Three issues written as contracts, each with a stop rule.
3. Three merge requests from sessions with your review comments and the manifest entries.
4. `docs/what-sessions-got-wrong.md`: at least five problems, and the change (brief, `AGENTS.md` or gate) that now prevents each.
5. `docs/measures.md`: lead time, change fail rate and defects after merge for the month.
6. A merge request listing every brief and a note on what you wrote yourself and why.

## 8. Review checklist

- [ ] `AGENTS.md` and the policy exist and match reality.
- [ ] Branch protection and protected paths are on.
- [ ] Every issue is a contract with scope and a stop rule.
- [ ] Every merge request had a human review and a manifest.
- [ ] New dependencies were checked.
- [ ] Each problem found changed a brief, `AGENTS.md` or a gate.
- [ ] I wrote or hand-checked the security-sensitive code.
- [ ] Measures include quality, not only speed.

**Next:** return to the [capstone overview](/library/tracks/frameworks/30-capstone-overview-and-dream-discovery/) and run the whole chain on a product of your own.
