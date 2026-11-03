---
title: "Service management and change"
description: "Services, owners, requests and changes as a lightweight practice: the catalogue entry, the change record, and how pipeline, plan and approval together give you the evidence."
section: "Observability and service management"
order: 5
track: "observability-and-service-management"
level: "advanced"
duration: "90 min"
outcomes:
  - "Explain service management in plain words and what a catalogue entry and a change record are for"
  - "Classify a change as standard, normal or emergency and choose the right path"
  - "Show how the pipeline, plan and approval produce the change record"
  - "Direct an agent to draft a catalogue entry and a change record and verify them against the facts"
prerequisites:
  - "template-catalogue-entry"
  - "template-change-record"
resources:
  - "atlassian/itsm"
  - "atlassian/it-change-management"
  - "gitlab/service-desk"
  - "google/sre-book"
  - "dora/dora-home"
updated: 2026-11-03
---

Lesson 5 of the Observability and service management track. It closes the track, and it uses the Catalogue Entry template (`/library/template-catalogue-entry`) and the Change Record template (`/library/template-change-record`).

## 1. Why this matters

Everything in this track so far assumes that someone knows what the services are, who owns them, what they promise and how they change. In a young organisation that lives in people's heads. As the number of services grows, and as agents propose more changes, the heads stop being enough. Someone asks "who owns the payment service?" at 02:00 and nobody knows. A change goes out that nobody outside the team knew about, and breaks a dependency. A customer request disappears into a chat thread.

**Service management** is the lightweight practice that answers these questions in writing: what services exist, who owns each, what each promises, how requests are handled, and how changes are recorded and approved. It has a bad reputation for forms and delay. Done lightly, with files in git and the pipeline doing the evidence collection, it is the opposite: it is what lets many agents and people move fast without losing track.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Which services exist and who owns them, the change types and who approves each, what a request process promises | Drafting catalogue entries from repositories, drafting change records from merge requests, finding services without owners, summarising open requests | Checking each entry against the repository, the owner and the monitoring; checking the change record's claims against the pipeline and plan; checking approvals were by people with the right role | Operations (running the service), security and compliance (control evidence), support (request handling), legal (obligations), finance (cost allocation) |

## 2. Key ideas, explained

### What service management is

[ITIL and IT service management](https://www.atlassian.com/itsm) are names for decades of practice about delivering technology as a service to people who depend on it. You do not need the formal frameworks. You need the core ideas, which map onto things you have already learned.

| Idea | Plain meaning | Where in this program |
|---|---|---|
| **Service catalogue** | A list of services with owners and promises. | The Catalogue Entry template. |
| **Service levels** | What is promised and measured. | Lesson 2. |
| **Incident management** | Restore service fast, then learn. | Lessons 3 and 4. |
| **Request management** | A way for people to ask for things and be answered. | Service desk, below. |
| **Change management** | Decide, record and review changes so they are safe. | The Change Record template. |
| **Problem management** | Find and fix the underlying causes of repeat incidents. | The review actions in lesson 4. |

### The catalogue entry

A **catalogue entry** is a small file in git that describes one service: owner, tier, repositories, dependencies, service levels, support contact, runbook and data classification. The template at `/library/template-catalogue-entry` shows the fields and the rule that matters most: **an entry without an owner is not an entry, it is a rumour.** Keep entries reviewed like code. Link each from the master catalogue, and link back from the repository and the runbook.

Why entries matter, with agents in mind: an agent proposing a change can read the entry to learn who owns the service, what depends on it and what it promises, and it can be required to do so. The entry gives a change its context, and the dependency list tells you who to warn.

Do not invent owners, addresses or numbers in an entry. Write "Not confirmed" where the fact is not yet known, and treat each such field as an open issue.

### Requests

A **request** is someone asking for something that is not a fault: access, information, a new service, a change to a setting. They need a place to arrive, an owner who responds, and a record. A **service desk** is the front door. GitLab's [Service Desk](https://docs.gitlab.com/user/project/service_desk/) turns emails into issues in a project, which is one lightweight way to do it with the tracker you already use. Check which features your plan includes. The principle is more important than the tool: **one place to ask, a visible owner, a promised response time from the catalogue entry, and a record that the request was closed.**

Agents can help triage: categorise a request, search for a known answer, draft a reply for a person to send. They should not reply to customers without a person approving, in the same way as incident updates (lesson 3).

### Change types

A **change** is anything that alters a service: code, configuration, infrastructure, access. Classify each by risk and choose the matching path. This is the idea in the Change Record template.

| Type | What it is | Path | Example |
|---|---|---|---|
| **Standard** | Low risk, well understood, repeatable, pre-agreed | Pipeline passes, a reviewer approves; no extra ceremony | Updating a dependency patch version, a text change |
| **Normal** | Anything with real risk or that touches important parts | Change record, risk assessment, review by a person not the author, deployed in a window | Changing the payment code, a database change |
| **Emergency** | Stopping or preventing active harm | Fast, same path, then a review within a short time, and a forward fix | A leaked secret, a customer-facing outage |

The mistake to avoid is making everything normal, which wastes time and teaches people to skip the process, or making everything standard, which removes the care. Review which changes are standard on a schedule, and promote one to standard only after it has gone well several times.

### The change record, assembled by the pipeline

A traditional change record is a form someone fills in. The better version is **assembled** from things that already exist in git and the pipeline.

| Part of the record | Where the evidence comes from |
|---|---|
| What is changing and why | The merge request description and its linked issue |
| Who owns it, who decided the risk | The author, and the approval by a named person |
| Which services | The catalogue entry ids |
| What was checked | The pipeline results: tests, scans, bill of materials |
| What will change in infrastructure | The plan output (Infrastructure as code lesson 3) |
| What the cluster will do | The GitOps sync preview (Kubernetes and GitOps lesson 3) |
| Recovery plan | Fix-forward steps and the switch to stop harm |
| Approval | Required approvals on the merge request, from a person who is not the author |
| After the change | Watch the signals from lesson 1 for a set time; update the catalogue entry |

The template at `/library/template-change-record` puts these into a short text block for the merge request. Notice the line "Risk decision made by (human)... an agent may not sign this line". That is the governance point: an agent may draft the record and gather evidence, but a human takes the decision, and it is recorded. The platform enforces it with required approvals and protected branches.

### Risk assessment

A short risk assessment asks the same questions every time: **impact** (who and what could be affected), **likelihood** (low, medium or high, and why), **blast radius** (one user, one service, many), **data touched**, **dependencies affected**, and the **window** (when, and why then). It does not need to be long. It needs to be honest, and it needs to be written before the change, so that the decision is informed.

### Recovery: fix forward, with a switch

Every normal change names how it will recover if it goes wrong. The Way says fix forward, so the plan is: **a forward fix** (who, how long) and **a switch to stop harm** (a feature flag, a traffic shift, a pause), not a plan to revert shipped work. Also name the gate you will add if it fails, which is the review habit from lesson 4.

### Measuring the practice

Do not measure forms completed. Measure outcomes: how often changes cause failures, how long recovery takes, how often changes ship, and how long a change takes from idea to production. The [DORA programme](https://dora.dev/) found that speed and stability go together in good teams, which supports a light, automated process over a slow, manual one. If your change process makes things safer **and** faster, it is working. If it only makes things slower, simplify it.

### Where the rules end

This lesson teaches a practical approach. It is not a compliance programme, and following it does not make an organisation compliant with any standard or law. If you have to meet a specific obligation, such as one set by a customer, regulator or contract, bring in the people responsible and use this practice as the working system that provides their evidence.

## 3. Step by step: put a light service management practice in place

1. **List your services** and create a catalogue entry file for each, starting with the most important.
2. **Fill the required fields.** Write "Not confirmed" for anything unknown, and open an issue for each.
3. **Assign one owner** per entry. An entry with no owner is the first thing to fix.
4. **Add service levels** from lesson 2 and the runbook link from lesson 3.
5. **Set up a request front door** with an owner and a response time.
6. **Define change types** and who approves each, in one page.
7. **Add the change record block** to the merge request template.
8. **Make the pipeline supply evidence:** tests, scans, plan output, bill of materials.
9. **Require approvals** from a person who is not the author for normal changes.
10. **Review monthly:** entries without owners, overdue requests, standard changes, and the delivery measures.

## 4. Worked example: TrailMug

TrailMug now has four services. Maya asks an agent to draft a catalogue entry for each from the repository maps and the pipeline files. The agent produces four files. She checks them against the facts.

- Two have the correct repositories and dependencies.
- One lists a dependency on a "legacy invoice service" that does not exist. The agent had inferred it from a variable name. She removes it.
- All four have an owner field filled with "maya", which is wrong for the payment service, where Ravi is the person who answers. The agent assumed. She corrects it, and writes "Not confirmed" for the support contact on two of them, because she does not yet have the real details. She opens an issue for each.
- The tier fields were guessed. She sets them herself: the checkout service is tier 1, the email service is tier 3.

Then she works on change. She sets three change types in `docs/changes.md`: standard (dependency patch updates, copy changes, with a passing pipeline and one approval), normal (anything touching payment, data or infrastructure), and emergency (stopping active harm, with a review in 48 hours).

For the tax rounding fix from the incident, she uses the change record block in the merge request. The agent drafts it from the diff, the pipeline run and the plan, and states the risk as "low". Maya does not sign that line. She reads the facts: it touches payment, so it is a normal change, the blast radius is every checkout, and the likelihood is not low, because the previous release of the same code caused an incident. She writes medium, and her reason, and names Ravi as the reviewer. The record shows tests for every region (the gate from lesson 4), the plan output (none, since there was no infrastructure change), a recovery plan with the switch, and 15 minutes of watching the checkout journey after release. After merge she updates the catalogue entry's last-reviewed date.

At the end of the month she looks at the delivery measures: deployments went up, the change failure rate went down, and recovery time halved. That is evidence the light practice helps. Her last action is to write what she would simplify next: the request front door still lacks a response-time promise.

## 5. Working with AI agents on this

**What the PDM decides:** the services, the owners, the change types, who approves, and the risk decisions.

**Delegate:** drafting catalogue entries from repositories, drafting change records from merge requests and pipeline output, finding services without owners, triaging requests, summarising delivery measures.

**Verify:** each entry against the repository and the owner; each claim in a change record against the pipeline, plan and diff; that approvals came from the right people; that no invented dependencies or owners appear.

**Never delegate:** signing the risk decision, approving a normal or emergency change, inventing an owner or contact.

**Prompt to draft a catalogue entry:**

```text
Draft a catalogue entry in the repository's template for the service in this
repository. Use only facts you can see in the repository files and pipeline: name,
repositories, dependencies visible in configuration, runbook path if one exists.
Where you cannot see a fact, write "Not confirmed" and list it at the end. Do not
invent owners, contacts, tiers, service levels or dependencies. Do not include any
secret.
```

**Prompt to draft a change record:**

```text
Draft the change record block for this merge request, using the template. Fill in only
what the diff, the pipeline results and the plan output show, and link each. For the
risk assessment, propose a draft and mark it as a proposal. Leave "Risk decision made
by" blank. List anything you could not verify.
<paste diff, pipeline link, plan>
```

**Disclose** AI drafting in the record's "AI use" lines, with what you checked yourself.

## 6. Common mistakes and how to avoid them

- **An entry with no owner.** Fix: one owner, or a visible open issue.
- **Invented facts in entries.** Fix: "Not confirmed", and verify against the repository.
- **Everything is a normal change.** Fix: standard path for low-risk, repeatable changes.
- **Everything is a standard change.** Fix: normal path for risk, with a person's decision.
- **An agent signs the risk line.** Fix: required human approval, enforced in the platform.
- **A record filled in after the fact.** Fix: assemble it from the pipeline before merge.
- **A plan to revert.** Fix: forward fix and a switch to stop harm.
- **Measuring forms.** Fix: measure failure rate, recovery time and lead time.

## 7. Practice

**Deliverable in git:** `specs/obs-05.md`, `briefs/obs-05.md`, `reviews/obs-05.md`, a catalogue entry file, `docs/changes.md`, and a filled change record in a merge request.

1. Choose a real or invented service with a repository.
2. Write a spec for an agent to draft a catalogue entry and a change record, with at least six acceptance criteria, including "no invented facts" and "the risk decision line is blank".
3. Brief an agent using the prompts in section 5.
4. Check every field against the repository and the pipeline. Record each wrong or invented item in `reviews/obs-05.md`.
5. Write the risk assessment yourself, and sign the decision line.
6. Write `docs/changes.md` with three change types, who approves each and one example of each.
7. Open a merge request containing the change record block and a disclosure block.

## 8. Checklist

- [ ] Every service has a catalogue entry with one owner.
- [ ] Unknown facts are marked "Not confirmed" and tracked as issues.
- [ ] There is a front door for requests with an owner and a promise.
- [ ] Change types and approvers are written down.
- [ ] Normal changes carry a change record assembled from the pipeline and plan.
- [ ] A human signed the risk decision, enforced by required approvals.
- [ ] Recovery is a forward fix plus a switch to stop harm.
- [ ] I measure failure rate and recovery time, not forms.

## 9. Further learning

Read the Atlassian guides to service management and change, and the SRE book's chapter on release engineering and the others you have not read. Look at your platform's service desk feature. You have now seen the whole spine: see, promise, respond, learn, change. To coordinate many agents across all five with decision rights written as data, continue to the Agent orchestration track (`/library/tracks/agent-orchestration`).
