---
title: "Identity and access in the cloud"
description: "Who can do what in a cloud account: identities, roles, least privilege, short-lived credentials, and the access rules that keep agents inside safe limits."
section: "Cloud platforms"
order: 3
track: "cloud-platforms"
level: "core"
duration: "90 min"
outcomes:
  - "Explain identities, roles and policies using the same words on all three providers"
  - "Apply least privilege and separate duties between people, agents and pipelines"
  - "Explain why long-lived keys and the root account are dangerous"
  - "Write and verify an access plan for an agent working in a cloud account"
prerequisites:
  - "the-way-five-rules"
resources:
  - "aws/security-best-practices-in-iam"
  - "microsoft/what-is-azure-rbac"
  - "google-cloud/iam-overview"
  - "aws/shared-responsibility-model"
  - "owasp/secrets-management-cheat-sheet"
  - "nist/ai-risk-management-framework"
updated: 2026-11-03
---

Lesson 3 of the Cloud platforms track. It supports the Master Developer delivery spine, stages "governance" and "artifact security". It builds on Lessons 1 and 2, and on lesson 4 of the CI/CD track.

## 1. Why this matters

In the cloud, access is power. Whoever can log in as an administrator can read every customer record, delete every backup and run up a bill overnight. Nearly every serious cloud incident involves access: a stolen key, a login without a second factor, a person or program given far more permission than it needed.

Agents change the picture. An agent working for you acts through whatever credentials you hand it. If you give it your own administrator login "to save time", every mistake it makes, and every instruction hidden in a web page it reads, happens with full power. The fix is not to avoid agents. It is to give each one a small, separate identity with just enough permission, and to check that this is so.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Who and what may do which actions, which actions always need a person, how much power an agent gets | Drafting access policies, listing who has what, proposing tighter rules, writing the setup as code | Trying an action that should be refused, reading the actual permissions, reviewing the access list on a schedule | Security (policy), legal (who may see personal data), operations (emergency access), finance (who can spend), HR (people joining and leaving) |

## 2. Key ideas, explained

### The four words

Every provider uses different names, but the ideas are the same. Learn these four.

| Word | Meaning | Examples |
|---|---|---|
| **Identity** (principal) | Someone or something that can act: a person, a program, a pipeline, an agent | A user, a machine identity, a managed identity |
| **Authentication** | Proving the identity is who it claims | Password plus a second factor, or a short-lived token |
| **Permission** | One allowed action on one kind of thing | "Read objects in this bucket" |
| **Role / policy** | A bundle of permissions you assign to an identity at a chosen scope | "Reader", "Storage object viewer" |

**Authorization** is the decision, made on every request: may this identity do this action on this resource? The default is no. You grant yes, in small pieces.

Each provider has a plain overview: AWS's [Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html), Azure's [What is Azure role-based access control](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview) and Google Cloud's [IAM overview](https://docs.cloud.google.com/iam/docs/overview). The vocabulary differs; the shape does not.

### Scope

Roles are given at a **scope**: the whole account or organisation, a group of resources (a project, a resource group), or a single resource. Narrow scope limits damage. "Editor on everything" is a very different gift from "reader on one storage bucket". Always ask: **what is the narrowest scope this needs?**

### Least privilege

**Least privilege** means giving an identity exactly the permissions it needs for its task, and no more. It is the most important idea in this lesson. Start with nothing and add what is needed, rather than starting with everything and removing. When an agent proposes a policy with a star (`*`) meaning "all actions" or "all resources", that is a flag to question, not a shortcut to accept.

### The root or owner account

When you create an account with a provider, it comes with a first, all-powerful identity (called the root user on AWS, and the owner or global administrator elsewhere). Treat it as an emergency tool. Protect it with a strong unique password and a second factor, do not use it for daily work, and do not create access keys for it. Store its login as the Dojo rules say for personal and human logins: in a password manager, never in git or in a chat with an agent.

### Credentials: short-lived beats long-lived

A **long-lived credential** is an access key or password that works until someone changes it. If it leaks, it is useful to an attacker for a long time. A **short-lived credential** is a token that expires in minutes or hours. Modern clouds let pipelines and programs get short-lived tokens by proving who they are, rather than storing a key. The principle:

1. **People:** sign in through a central identity system with multi-factor authentication.
2. **Pipelines and programs:** use the platform's own identity (a machine identity, managed identity or role) and short-lived tokens where possible.
3. **Long-lived keys:** avoid. If unavoidable, store them in a secret manager, scope them narrowly, rotate them on a schedule and on any suspicion. See the OWASP [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

The rule in the Dojo is that secrets never live in git (see the CI/CD track, lesson 4). Here you learn why the alternative exists: an identity that does not need a stored secret at all.

### Separate identities for separate jobs

Different actors get different identities.

| Actor | Identity | Typical access |
|---|---|---|
| A human operator | Their own named account with multi-factor sign-in | What their role needs, with approval for risky actions |
| The pipeline that deploys | A dedicated deploy identity | Update the specific app, nothing else |
| An agent that drafts infrastructure code | An identity with **read-only** access, or none at all | Read the design and plan; cannot change the live account |
| An agent that runs in a throwaway test account | A separate test-account identity | Create and delete in the test account only |
| Emergency access | A sealed "break glass" account, used rarely and logged | Everything, but loudly watched |

Do not share one login among several actors. Shared logins make it impossible to know who did what, and impossible to remove one actor without disturbing the rest.

### Separate accounts for separate risks

Providers let you create several accounts, subscriptions or projects. Keep **production** separate from **test** so that a mistake in an experiment cannot touch customers. A test account can be generous with permissions; production cannot. Billing and security alerts can then be set per account.

### Logs: who did what

Providers record every action in an **audit log**. Make sure it is on, that it goes somewhere an attacker with ordinary access cannot erase, and that someone reads it or watches for odd events: a login from an unusual country, a new administrator, a deleted backup. Observability and service management (a later track) covers how to look.

### The human side

Access is not only technical. People join, move roles and leave. Review who has access on a regular schedule, for example each quarter, and remove what is no longer needed. Check that every person with powerful access still needs it. Record the review in git.

## 3. Step by step: make an access plan

1. **List the actors:** people, pipelines, agents.
2. **For each actor, write the tasks** it must do, in plain words.
3. **Write the minimum permissions** for those tasks, at the narrowest scope.
4. **Decide which actions need a person.** Deleting data, changing access, spending money above a limit, touching production.
5. **Decide the credential type** for each actor. Prefer short-lived.
6. **Separate production from test** in different accounts or projects.
7. **Turn on multi-factor** for every human, and protect the root or owner account.
8. **Turn on audit logs** and a budget alert.
9. **Write the plan** as a spec with acceptance criteria that include refusals.
10. **Direct an agent** to write the policies as code, plan first.
11. **Verify refusals:** from each identity, try an action that should be refused.
12. **Review and merge,** then calendar the next access review.

## 4. Worked example: TrailMug

Maya has three actors: herself, the deploy pipeline and a coding agent that drafts the infrastructure code. She writes the access plan:

```text
Issue 41: access plan for TrailMug cloud accounts
Actors and rules
1. Maya: named account, multi-factor on, no daily use of the owner account.
2. Deploy pipeline: its own identity, may update the sign-up function and the site bucket only; short-lived credentials.
3. Coding agent: read-only identity on a test account; no identity at all on production.
4. Production and test live in separate accounts.
5. Actions that always need Maya: deleting a database or backup, changing access rules, any spending above the monthly budget.
Acceptance criteria
a. From the agent's identity, creating a database in production is refused. I will try it.
b. From the pipeline identity, reading the customer exports bucket is refused.
c. The owner account has multi-factor, and no access keys exist for it.
d. An audit log is on in both accounts and a budget alert is set.
e. No secret appears in the repository.
```

She briefs an agent to write the policies as code. The first draft gives the pipeline an "Editor on the whole account" role "to be safe". Maya rejects it: criterion 2 names the exact resources. The agent narrows it. The draft also lists a long-lived access key for the pipeline. Maya asks for the platform's short-lived token mechanism instead, and the agent revises.

Verification: she signs in as the agent's read-only identity in the test account and tries to create a database: refused. She tries the same for the pipeline against the exports bucket: refused. She checks that the owner account shows a second factor and no keys. She finds the audit log and sets a calendar reminder for a quarterly access review.

One thing she cannot check herself: whether the policy text covers every edge. She asks her mentor, who is a security engineer, to review the policies before the first real customer record goes in. That is the right use of other disciplines: not checking everything, but knowing which review to ask for.

## 5. Working with AI agents on this

**What the PDM decides:** the actors, the access each one gets, what always needs a person, what never goes to an agent.

**Delegate:** drafting policies as code, explaining a policy line by line, listing who currently has what, proposing tighter versions, drafting the quarterly review report.

**Verify:** you try actions that should be refused. You read the actual permissions in the console or in the code. You look for stars (`*`), "owner", "administrator" and "editor" roles, and for access keys.

**Never delegate:** accepting a risk, giving production access to an agent, changing who is the owner of the account.

**Prompt to draft access:**

```text
Write the access policies as code for the plan below, for <provider>. Use the
least privilege that lets each actor do only the listed tasks, at the narrowest
scope. Do not use wildcard actions or wildcard resources. Do not create long-lived
access keys; use the platform's short-lived mechanism and tell me which one. After
the code, list each permission and the task it supports, and mark any you are unsure about.
Do not apply anything.
<paste plan>
```

**Prompt to audit current access:**

```text
Here is the list of identities and their roles exported from the account. Flag:
administrator or owner roles, roles at account scope, identities with no recent
use, long-lived keys, shared identities, and anything an agent holds that could
change production. Output a table with identity, risk, and the smallest fix.
Do not change anything.
```

**Never paste real keys** or passwords into an agent session. If you do by accident, treat them as leaked and rotate them.

**Disclose** AI help on the policy changes in the merge request.

## 6. Common mistakes and how to avoid them

- **Giving an agent your own login.** Fix: separate, limited identity.
- **"Administrator" as a shortcut.** Fix: start from nothing and add.
- **Wildcards in policies.** Fix: name actions and resources.
- **Long-lived keys in files and pipelines.** Fix: short-lived tokens or a secret manager.
- **Daily use of the owner account.** Fix: protect it and use named accounts.
- **Production and test in one account.** Fix: separate them.
- **No second factor.** Fix: required for every human.
- **Never reviewing access.** Fix: a quarterly review in git.
- **Audit logs off.** Fix: turn them on, and watch for odd events.

## 7. Practice

**Deliverable in git:** `specs/cloud-03.md`, `briefs/cloud-03.md`, `reviews/cloud-03.md`, `docs/access-plan.md`.

1. In `docs/access-plan.md`, list your actors, the tasks each does, and the access each gets, in plain words.
2. Write a spec with at least six acceptance criteria, at least two of which are refusals you will test.
3. Brief an agent to draft the policies as code. Plan first. Do not apply anything to a real account unless it is a free test account with a budget alert.
4. Verify by reading the permissions and, if you have a free test account, by trying the refusals. If you do not, review the policy text with a partner and record the refusals you expect.
5. Record what you rejected: a wildcard, an administrator role or a long-lived key.
6. Set a date for the first access review.
7. Open a merge request with a disclosure block. Include no real keys or personal data.

## 8. Checklist

- [ ] Each actor has its own identity.
- [ ] No agent holds production access, or I wrote why it does and who approves.
- [ ] No wildcard permissions, or each one has a recorded reason.
- [ ] Credentials are short-lived where the platform allows.
- [ ] Every human has multi-factor, and the owner account is protected and unused day to day.
- [ ] Production and test are separate.
- [ ] Audit logs and a budget alert are on.
- [ ] The review date is set.

## 9. Further learning

Read the identity page of the provider you use, then skim the other two to see the same ideas in different words. The OWASP secrets cheat sheet gives practical rules for keys. The NIST AI Risk Management Framework helps when you decide how much trust an agent deserves, which is a risk question as well as a technical one. The Security fundamentals track continues this thread.
