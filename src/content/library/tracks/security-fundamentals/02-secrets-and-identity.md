---
title: "Secrets and identity"
description: "Where passwords, keys and tokens may live and where they may not, how they leak, how to find them, what to do in the first hour after a leak, and why narrow identities beat shared keys."
section: "Security fundamentals"
order: 2
track: "security-fundamentals"
level: "core"
duration: "75 min"
outcomes:
  - "Say where a secret may and may not live"
  - "Explain how secrets leak, including through agents, and how scanners find them"
  - "Respond correctly in the first hour after a leaked secret"
  - "Direct an agent to remove a secret from code and verify the old one is dead"
prerequisites:
  - "the-way-five-rules"
resources:
  - "owasp/secrets-management-cheat-sheet"
  - "gitlab/secret-detection"
  - "owasp/cheat-sheet-series"
  - "nist/secure-software-development-framework"
  - "kubernetes/secrets"
  - "gitlab/ci-variables"
updated: 2026-11-03
---

Lesson 2 of the Security fundamentals track. It draws on the credential ideas in CI/CD lesson 4 and Cloud platforms lesson 3.

## 1. Why this matters

A **secret** is anything that proves who you are or unlocks something: a password, an API key, a token, a private key, a database connection string. Attackers prize secrets because one valid key skips every other defence. They do not need to find a weakness in your code if your code contains the key.

Secrets leak in boring ways. Someone pastes a key into a test file and commits it. A configuration file with a password ends up in a public repository. A log line prints a token. A chat message carries a key. And now, an agent is handed a key to finish a task, puts it in a file, and commits.

The good news is that this is the most preventable class of incident. Rules are simple, tools find leaks automatically, and the response to a leak is a short, well-known drill.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Which secrets exist, who owns each, where they may live, how fast they must be rotated, what an agent may be handed | Writing scanner rules, moving secrets out of code, drafting the rotation steps, searching history for known patterns | Confirming the old secret no longer works, reading the scanner results, checking who and what can read each secret | Security engineering (vault and rotation), platform engineering (identity and runners), legal and privacy (what a leak triggers), operations (impact of rotation) |

## 2. Key ideas, explained

### Where a secret may live

| Place | Verdict |
|---|---|
| **In source code or git history** | Never. History keeps everything, forever, for everyone with access. |
| **In a chat, email or ticket** | Never. They are copied, searched and forwarded. |
| **In an agent's prompt or conversation** | Avoid. The text may be stored, logged and shown to tools. If you must, treat the secret as leaked after the task. |
| **In an environment variable on a machine** | Acceptable for short-lived use, but visible to anything running there. |
| **In a pipeline's protected variables** | Reasonable for pipeline use, scoped to protected branches and masked in logs. See the [CI/CD variables documentation](https://docs.gitlab.com/ci/variables/). |
| **In a dedicated secret store** | The standard. Access is controlled, audited and can be rotated. |
| **Not needed at all** | Best. Use an identity instead of a key where the platform offers it. |

The OWASP [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) goes into practical detail.

### Identity beats a shared key

Many platforms let a running program prove who it is by its **identity** rather than by a stored key: the cloud checks that this program, running here, is allowed to do that. There is nothing to leak because nothing is stored. Where it exists, prefer it. Where you must use keys, make each one belong to one purpose, with the narrowest permissions that work and a short life. A single powerful key shared by many jobs and people is the worst arrangement: one leak opens everything, and you cannot tell who used it.

### Least privilege

Give each person, job and agent only the permissions needed for the task at hand, and no more. If a key leaks, the damage is limited to what it could do. Ask for every secret: **what can this do if someone else holds it?** If the answer is "anything", it is too powerful.

### How secrets leak

| Route | Example |
|---|---|
| **Committed to git** | A key in a config file, a test, a notebook or a script. Deleting it in a later commit does not remove it from history. |
| **Logs and error messages** | A request with a token printed by a debug line. |
| **Build output** | A pipeline echoing variables. |
| **Copied into tickets and chats** | "Here is the key, can you try it?" |
| **Client-side code** | A key in a web page or mobile app is public by definition. |
| **Agents** | An agent given a key writes it to a file, prints it while debugging, or sends it to a tool or web service that logs inputs. |
| **Backups and state files** | A tool's state may hold generated passwords (Infrastructure as code lesson 2). |

### How leaks are found

A **secret scanner** looks for patterns that look like keys, and for names such as "password" next to long random strings. GitLab offers [secret detection](https://docs.gitlab.com/user/application_security/secret_detection/) as part of its security features; check which parts your plan includes. Open source scanners also exist. Scanners can run in two places.

- **Before commit:** on the developer's machine or in an agent's hook, so the secret never enters history. This is the best place.
- **On every merge request in the pipeline:** so that anything missed is caught before merge. This is the backstop.

Scanners produce false positives (random-looking test data) and false negatives (an unusual format). Treat a clean scan as "no known patterns found", not as proof that no secret exists.

### The first hour after a leak

When a secret is exposed, assume it is already compromised, even if the repository is private. Work through the same drill every time.

1. **Revoke or rotate it now.** Create a new one, switch consumers to it, and disable the old one. This is the step that matters. Cleaning the history comes later and does not make the old secret safe again.
2. **Find what the old secret could do,** and look in the provider's logs for any use you do not recognise in the exposure window.
3. **Remove it from the current code** and replace it with a reference to the secret store.
4. **Clean the history** if it is worthwhile, with care, as a coordinated change. Remember that copies may exist in clones, caches and forks.
5. **Tell the owner and, if customer data may be affected, the people responsible for deciding what must be reported.** Do not decide that alone.
6. **Record what happened** in a short, blameless note: how it leaked, how long it was exposed, what was done, and the gate that would have caught it.
7. **Add the gate:** a scanner rule, a hook, a protected variable, or an identity that removes the need for the key.

Notice that the correct response is to fix forward: new secret, new gate. Rewriting history without rotating first is a common and dangerous mistake.

### Handing secrets to agents

An agent that must call a service needs access to something. Better options, in order:

1. **Give it no secret.** Let a trusted tool or a pipeline hold the credential and expose only an action ("deploy to test"), not the key.
2. **Give it a short-lived, narrow token** that expires when the task ends.
3. **Give it a scoped key from a vault** for one task, with logging.
4. **Never paste a long-lived, powerful key** into a conversation.

Also give the agent a clear instruction about what to do when it finds a secret: stop, do not copy or print it, and report the file and line.

### Identity for people

The same ideas apply to human sign-in: unique accounts, multi-factor authentication, no shared logins, and removing access when someone leaves or changes role. A person's personal logins belong in a password manager the organisation controls, not in a shared document. Agents are not people, so give each its own identity so that its actions can be told apart in logs.

## 3. Step by step: find and remove a secret from a project

1. **Run a scanner** over the current code and the history.
2. **List every finding** with file, line and what the secret grants.
3. **Rotate each real secret first.** Do not wait for the clean-up.
4. **Check provider logs** for use during the exposure.
5. **Replace** each with a reference to the secret store or an identity.
6. **Add a pre-commit check** and a pipeline scan.
7. **Set the pipeline variables** to protected and masked.
8. **Decide on history clean-up** with the team, and coordinate it.
9. **Verify:** the old secret fails when used, the new one works, the scanner is clean.
10. **Write the blameless note** and add the gate that would have caught it.

## 4. Worked example: TrailMug

Maya's agent finishes a feature that sends order confirmation emails. In review she notices the diff includes a configuration file with a line `email_api_key = "..."`. The agent had been given the key in the task description so that it could test sending.

She follows the drill, in order, and writes each step in a note.

1. She asks the platform owner to **rotate the key** at the email provider. The new key goes into the pipeline's protected variables, masked. The old key is disabled. She does not wait for the code to be cleaned.
2. She asks the provider's logs for any sends in the window. There are only the agent's two test sends.
3. She directs the agent: "Remove the key from the file, read it from the environment variable named EMAIL_API_KEY, and add a test that fails if the variable is missing. Do not print or copy the key anywhere. Do not touch the history."
4. She asks the pipeline owner to add a secret scan to merge requests, and a pre-commit scan for the team's agents.
5. She verifies by trying the **old** key against the provider's test endpoint. It is refused. She runs the scanner on the branch. It is clean.
6. Her note records: how it leaked (secret pasted in the task description), the exposure (about two hours in a private branch), the action, and the gate (pre-commit scan, plus a brief rule: agents are never given long-lived keys; use the test mailbox tool instead).

A week later she replaces the key altogether. The email provider offers a short-lived token issued by the pipeline. The key no longer exists to leak.

## 5. Working with AI agents on this

**What the PDM decides:** which secrets exist, who owns them, what an agent may be handed, and the rotation schedule.

**Delegate:** scanning, moving secrets to references, drafting the rotation checklist, writing the blameless note, searching history for patterns.

**Verify:** the old secret fails; provider logs reviewed; the scanner is clean on the branch and on history; the agent did not copy the secret elsewhere.

**Never delegate:** deciding whether a leak must be reported to customers or authorities, or the act of generating long-lived production keys.

**Prompt to remove a secret:**

```text
This file contains a hard-coded credential. Replace it with a read from the
environment variable named in the spec. Add a startup check that fails with a clear
message if the variable is missing, without printing its value. Do not print, copy,
log or send the value anywhere, including in your summary. Do not rewrite git
history. Tell me the file and line of every other place you find a similar value.
```

**Prompt to write a leak note:**

```text
Write a blameless incident note from these facts: how the secret leaked, how long
it was exposed, what it could do, what was rotated and when, and what log review
showed. End with the one gate that would have prevented it. Do not include the
secret or any part of it. Mark anything you are unsure about.
<paste facts>
```

**Disclose** AI involvement in the clean-up, and record that the secret was rotated before any code change.

## 6. Common mistakes and how to avoid them

- **Cleaning history before rotating.** Fix: rotate first; the leak is already out.
- **"It is a private repository."** Fix: private repositories are cloned, forked and breached too.
- **Long-lived keys given to agents.** Fix: no secret, or short-lived and narrow.
- **One powerful shared key.** Fix: one purpose per key, narrow permissions.
- **Secrets in logs and build output.** Fix: mask variables, review output.
- **Trusting a clean scan.** Fix: it found nothing it knew; keep least privilege.
- **No gate after the fix.** Fix: every leak ends with a new check.
- **Keys in client-side code.** Fix: anything shipped to a browser or phone is public.

## 7. Practice

**Deliverable in git:** `specs/sec-02.md`, `briefs/sec-02.md`, `reviews/sec-02.md`, `docs/secret-rules.md`.

1. Write `docs/secret-rules.md`: where secrets may live, what an agent may be handed, and the first-hour drill in seven steps.
2. In a throwaway repository, plant a fake secret in a file (use an obviously invented value, never a real one) and commit it.
3. Write a spec to find and remove it, with acceptance criteria including "history is checked" and "nothing is printed".
4. Brief an agent to do the removal and add a scan. Forbid it from rewriting history.
5. Run the scanner yourself on the branch and on history. Record results in `reviews/sec-02.md`.
6. Simulate the drill: write what you would rotate, in what order, and what you would check in logs.
7. Open a merge request with a disclosure block and the gate you added.

## 8. Checklist

- [ ] I know where secrets may and may not live.
- [ ] Every secret has an owner and the narrowest workable permissions.
- [ ] A scanner runs before commit and on every merge request.
- [ ] Agents are not handed long-lived, powerful keys.
- [ ] I can recite the first-hour drill and rotate before cleaning.
- [ ] The old secret was tested and fails.
- [ ] Every leak ends with a blameless note and a new gate.

## 9. Further learning

Read the OWASP cheat sheet on secrets management, then look at your own pipeline's variable settings. If your platform offers identity-based access to your cloud, try it in a test project. The next lesson looks at the other side of trust: the code that other people wrote and that you run.
