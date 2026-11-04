---
title: "Deployment, governance and go-to-market"
description: "Release through git with GitOps, roll out in small steps, keep change records and audit evidence, and treat go-to-market material as part of done."
section: "Frameworks"
order: 27
track: "frameworks"
level: "advanced"
duration: "65 min"
outcomes:
  - "Explain GitOps in four principles and describe a safe rollout with a rollback or forward-fix plan"
  - "Write a change record and an evidence bundle that an auditor or customer can follow"
  - "Prepare a go-to-market pack with an agent and check it against what shipped"
resources:
  - "opengitops/principles"
  - "argo-cd/docs"
  - "cncf/flux"
  - "gitlab/environments"
  - "gitlab/docs-protected-environments"
  - "atlassian/change-management"
  - "gitlab/docs-audit-events"
  - "atlassian/product-launch"
prerequisites:
  - "tracks/frameworks/25-launch-sequence-six-stages"
  - "tracks/frameworks/26-supply-chain-and-artifact-security"
updated: 2026-11-03
---

**Dojo programme link:** this lesson supports the Master Developer modules on platform, service management and production launch, and the Developer week 6 demo. It builds on [Everything as code, GitOps and drift](/library/iac-gitops-and-drift) and [Service management in git](/library/itil-in-git).

## 1. Why this matters

Stages 4, 5 and 6 of [Launch Sequence](/library/tracks/frameworks/25-launch-sequence-six-stages/) are where the product meets reality: real servers, real customers, real rules, and real people who need to hear about it.

Three things go wrong most often here:

1. **A release that cannot be undone or inspected.** Someone ran commands by hand, and nobody can say what is live.
2. **A release nobody can account for.** A customer, a partner or an auditor asks "who approved this and what checks ran?" and the answer is a search through chat messages.
3. **A release nobody hears about.** The feature is live. Customers do not know. Support does not know. Sales promises the old behaviour.

A PDM owns all three. This lesson gives you the habits that prevent them.

## 2. Key ideas, explained

### 2.1 Deployment through git (GitOps)

**GitOps** means the **desired state** of your running system is described in files in git, and software compares the live system with those files and fixes differences. The [OpenGitOps](https://opengitops.dev/) project states four principles:

1. **Declarative.** You describe **what** you want, not the steps to get there.
2. **Versioned and immutable.** The description is stored in a way that keeps history and cannot be changed secretly.
3. **Pulled automatically.** An agent in the live environment pulls the description from git. People do not push changes by hand.
4. **Continuously reconciled.** Software keeps comparing live to desired, and corrects drift.

Tools that do this for Kubernetes include [Argo CD](https://argo-cd.readthedocs.io/en/stable/) and [Flux](https://fluxcd.io/flux/). You need not use either. The idea is more important than the tool.

Why a PDM likes GitOps:

- **Every change is a merge request.** The release record and the deployment are the same thing.
- **You can read what is live** by reading a file.
- **Rollback and forward-fix are normal changes.** The history shows what happened.
- **Drift is visible.** If someone changes the live system by hand, the tool shows the difference.

Read [Everything as code, GitOps and drift](/library/iac-gitops-and-drift) for the Dojo rules on secrets and drift.

### 2.2 Environments and approvals

An **environment** is a place where the product runs: for example `staging` (a copy for testing) and `production` (the real one). A pipeline should deploy to staging automatically and to production only after a check and a human approval.

GitLab tracks deployments to [environments](https://docs.gitlab.com/ci/environments/) and lets you restrict who may deploy to important ones with [protected environments](https://docs.gitlab.com/ci/environments/protected_environments/). Use them so that "an agent cannot deploy to production" is a platform rule.

A good production gate checks:

- The artifact is **signed** and the digest matches what was tested (lesson 26).
- Required checks passed.
- A named human approved.
- The change record exists.
- No incident is currently open for the service.
- The rollback or forward-fix plan is written.

### 2.3 Rolling out in small steps

The safest release is small and gradual.

| Method | How it works | Use when |
|---|---|---|
| **Staff first** | Only your own team sees the change | Always as the first step |
| **Pilot group** | One café, ten customers | New behaviour that may confuse people |
| **Canary** | A small percentage of traffic goes to the new version | Services with many users |
| **Feature flag** | The code is live but switched off; you turn it on for a group | Ending a release from a launch date |
| **Blue and green** | Two full copies; you switch traffic over | Need near-instant switch back |

After each step, **look at the live product** before you widen it:

1. **Smoke test:** does the front page load, does sign-in work, does the main action succeed?
2. **Journey test:** do the two or three main customer journeys work end to end? Browser tests (for example with Playwright) can do this automatically.
3. **Objectives:** are the reliability and speed targets still met? (See lesson 28.)

If something fails, you have two options. **Fix forward** means you make a new change that repairs the problem and ship that. **Roll back** means you go to the previous version. The Dojo's [fix forward](/library/fix-forward) rule says: repair with a new change and keep the record; only in active harm (a leaked secret, data loss in progress, a customer-facing outage) do you first stop the harm, and then you still deliver the forward fix. A **switch** (a feature flag or a setting) that stops the harm without reverting history is the best tool for that. Decide which switch you will use **before** the release.

**Databases are different.** Changing the shape of stored data (a migration) is harder to undo than changing code. Plan migrations in two steps: first add (new things), then later remove (old things) after everything uses the new ones. Ask an engineer or an agent to explain the migration in plain words and say what happens if it stops halfway.

### 2.4 Checking after the release

Deployment is not finished at "the pipeline is green". Finish means "the live product works for customers". Add checks that run **after** deployment:

- **Smoke and journey tests** against the live address.
- **Synthetic monitoring:** a scheduled script that acts like a customer every few minutes and alerts you if it fails.
- **Reliability gate:** if the main objective is already missed, do not roll out further.
- **Drift check:** the live system equals the git description.

### 2.5 Governance: being able to prove it

**Governance** is the set of rules, records and checks that let you show your product was built and changed responsibly. It is not paperwork for its own sake. It lets you answer questions quickly, and it protects you when something goes wrong.

Four parts:

1. **Change record.** For each change that reaches users: what, why, risk, recovery plan, checks, approval. In the Dojo the [merge request is the change record](/library/template-change-record). Atlassian's article on [IT change management](https://www.atlassian.com/itsm/change-management) explains the older idea (standard, normal and emergency changes) that the template follows.
2. **Audit trail.** A log of who did what and when. Your platform records some of this, for example GitLab [audit events](https://docs.gitlab.com/user/compliance/audit_events/) (available on certain plans). Git history also records every change.
3. **Evidence bundle.** The saved results of the checks for each release: test report, scan results, SBOM, signature, approval, deployment record. Store them together and link the bundle from the release.
4. **Separation of duties.** The person (or agent) who makes a change is not the only one who approves it.

**About compliance.** Some customers require that you follow a named standard or law. Governance evidence helps you show it. It does not make you compliant by itself, and a pipeline cannot give legal advice. Ask the right specialist, and never write "compliant with X" in public material unless you have been assessed against X.

### 2.6 Go-to-market is part of done

**Go-to-market (GTM)** means the plan and materials for getting a product to its users: what you say, to whom, through which channels, with what proof. In Launch Sequence, the GTM stage is the final one and it **blocks** the release if the materials are missing or do not match the release.

A GTM pack for a feature includes:

| Item | Reader | Checks before sending |
|---|---|---|
| Release notes | Customers | Every line matches a merged change |
| Help or guide page | Customers and support | A new person can follow it |
| Website or product page update | Prospects | Claims match the product; no promises about the future |
| Screenshots or a short demo | Everyone | Taken from the live product, no real personal data |
| One-page summary | Sales, partners, support | Plain words; limits stated |
| Announcement plan | Marketing | Channels, dates, owner |
| Internal note | Staff | What changed, what to say, who to ask |

The Dojo's honesty rules apply to GTM as to everything: **no invented numbers, testimonials or dates.** If a claim is not proven, remove it.

An important design choice: GTM material that agents generate should be **tied to the exact commit** they read. A small record next to the output lists the agent, the model, the commit identifier, what changed, and what it produced. A check then confirms that the record matches the release. This stops a common failure: an agent that writes announcement text from an old version of the product.

### 2.7 Hand-off to growth

After launch, structured information should flow to the people who plan growth: what shipped, which materials exist, what the measures are, what is known to be weak. Use a structured issue with fixed fields. [Lesson 28](/library/tracks/frameworks/28-mission-control-growth-and-event-horizon/) shows how this connects to the GROWTH accelerator.

## 3. Step by step: release a feature through stages 4 to 6

1. **Write the release issue** from a template: version, merge requests, risks, rollback or switch, owner, date.
2. **Confirm stage 1 to 3 evidence** is attached (tests, scans, SBOM, signature).
3. **Create or update the GTM pack** in a folder `release/<version>/gtm/`. Have an agent draft it, then check every line.
4. **Open the deployment merge request** that changes the desired state (for example the image digest in a deployment file).
5. **Review and approve it** as a named human. Ask: "Is the digest the one that passed the checks?"
6. **Deploy to staging,** run smoke and journey tests.
7. **Deploy to the first group** (staff, pilot, canary).
8. **Watch for a fixed time.** Write down what you watched and for how long.
9. **Widen the rollout** if all is well. If not, use your switch or fix forward.
10. **Save the evidence bundle** and link it from the release.
11. **Send the announcement** only after the live checks pass.
12. **Hand off to growth** with the structured summary.

## 4. Worked example: TrailMug release 0.4 goes live

Maya's release 0.4 (the cup return scan) has passed stages 1 to 3 (lesson 25).

- **Desired state.** A small file in the deployment repository names the signed image digest. An agent opens the merge request that changes it. Maya reviews the diff: one line changed. She checks that the digest equals the one in the signature record.
- **Approval.** She approves production in the protected environment. The agent cannot.
- **Rollout.** Staging first, then only Leo's café through a feature flag. Her switch: set the flag off and the counter page shows the manual form.
- **Live checks.** A browser test scans a test cup code and checks for a green screen. A scheduled check repeats it every five minutes.
- **Evidence.** The release page links the pipeline, the scan, the SBOM, the signature check and her approval.
- **GTM.** An agent drafts release notes (three lines), a barista card, a note for the partner cafés and a short post. Maya deletes one sentence that said "no more queues", because she has no evidence yet. She keeps "returns now take a few steps at the counter".
- **Hand-off.** She files the growth issue: what shipped, the card, the measure she will watch, and the café feedback she wants.

All details are fictional.

## 5. Working with AI agents on this

**What the PDM decides.** Whether the release goes. The rollout steps. The switch. Which claims are allowed in public. These are judgement calls with real consequences.

**What agents can do.**

- Draft deployment merge requests and review the diff for obvious problems.
- Write smoke and journey tests.
- Generate the change record from the merge requests and pipeline results, for your review.
- Collect the evidence bundle.
- Draft the GTM pack and check it line by line against the merged changes.
- Watch the live checks and open an issue when one fails.

**What agents must not do.** Approve production. Turn off a gate. Change the live system by hand outside git. Send external messages without human approval.

**A brief you can adapt:**

```text
Here are the merged changes for release 0.4 (links). Write customer
release notes, three bullets maximum, plain words, no internal names.
For every bullet give the merge request number it comes from. Then write
a list called UNPROVEN CLAIMS with any statement in the existing website
text that this release makes false or that we cannot prove. Do not edit
the website.
```

**How to check.** Match each bullet to its merge request. Click the live product yourself on a phone. Read the UNPROVEN CLAIMS list and decide.

**Other disciplines.** Operations owns the live checks and on-call. Marketing and support own the GTM pack. Finance confirms prices and billing. Security reviews the policy gates. Legal or a compliance partner reviews claims about standards and data.

**From delegating to orchestrating.** Preparing change records, checklists and release notes can be run as sessions inside policy, but approval, release and what you tell customers stay with people. Protected environments and required approvals are the gates that enforce this. See [Agent orchestration](/library/tracks/agent-orchestration/).

## 6. Common mistakes and how to avoid them

- **Hand-made production changes.** Anything not in git is invisible. Change through a merge request.
- **Approval by the author.** Separate who writes from who approves.
- **Big-bang releases.** Roll out to a small group first.
- **No switch.** Decide the harm-stopping switch before launch.
- **Announcing before the live check passes.** Wait.
- **Marketing text that promises more than the product does.** Check every claim.
- **Evidence scattered in chat.** Keep one bundle per release.
- **Claiming compliance.** Say what you do; do not claim a standard without an assessment.

## 7. Practice

**Deliverable in git:** one branch, `release-0-1`, containing:

1. A `release/0.1.md` release record with the rollout plan, the switch, the rollback or forward-fix plan, and the go or no-go reasoning you wrote.
2. The change record: a merge request using the [change record template](/library/template-change-record), with an approver who is not the author.
3. `release/0.1/evidence.md` linking the pipeline, scan, SBOM, signature and approval.
4. `release/0.1/gtm/` containing release notes, one guide page and a one-page summary, drafted with an agent and checked by you. Add a file `checks.md` listing each claim and the merge request that proves it.
5. A smoke test (or a manual script) for the live product and a note of when it ran.
6. A note on AI use.

## 8. Checklist

- [ ] Production changes arrive only through merge requests.
- [ ] Production needs a named human approval; an agent cannot approve.
- [ ] The rollout starts small and I wrote the switch down before release.
- [ ] Live checks ran after deployment.
- [ ] A change record and an evidence bundle exist and are linked.
- [ ] Every claim in the GTM pack is checked against a change.
- [ ] No unproven statistics, testimonials or compliance claims.
- [ ] A hand-off to growth was filed.

**Next:** [lesson 28](/library/tracks/frameworks/28-mission-control-growth-and-event-horizon/) covers Mission Control, the GROWTH accelerator and Event Horizon.
