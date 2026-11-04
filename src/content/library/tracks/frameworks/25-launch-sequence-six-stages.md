---
title: "Launch Sequence: six stages from commit to production"
description: "How a product goes from a change in git to running in production with proof at every step: source assurance, supply chain, artifact security, deployment, governance and go-to-market."
section: "Frameworks"
order: 25
track: "frameworks"
level: "core"
duration: "60 min"
outcomes:
  - "Name the six Launch Sequence stages and say what each one proves"
  - "Read a pipeline and tell which stage each job belongs to, and which stage is missing"
  - "Decide which checks block a release and which only warn, and write that decision down"
resources:
  - "martinfowler/continuous-delivery"
  - "atlassian/continuous-delivery"
  - "gitlab/docs-ci-pipelines"
  - "gitlab/create-your-first-ci-cd-pipeline"
  - "google/sre-launch-coordination-checklist"
  - "dora/dora-research-program"
  - "nist/secure-software-development-framework"
prerequisites:
  - "tracks/frameworks/24-running-android-ops-in-gitlab"
updated: 2026-11-03
---

**Dojo programme link:** this is the first Master Developer lesson on production launch. It supports the demo in Developer week 6 and the platform module. It builds directly on [lesson 24](/library/tracks/frameworks/24-running-android-ops-in-gitlab/) and the Implement and Deliver areas of [lesson 22](/library/tracks/frameworks/22-android-focus-areas-optimize-implement-deliver/).

## 1. Why this matters

Shipping is a discipline of its own. You can have a good idea, a strong design and working code, and still fail at the moment of release: a key leaks, a bad dependency slips in, a deployment cannot be undone, support does not know the feature exists, or nobody can show later who approved what.

**Launch Sequence** is the Dojo name for the way a product travels from a commit (a saved change in git) to production (the live place where customers use it), with **proof at each step**. It works the same way for a small site and a large service. Only the number of checks changes.

This lesson teaches the ideas, not any one company's setup. You can build a basic version yourself with public tools. In the 2030 PDM role you will rarely write pipeline files by hand. You will ask agents to write them. Your job is to know what the pipeline must prove, to decide what blocks a release, and to read the results.

## 2. Key ideas, explained

### 2.1 Three words: pipeline, gate, evidence

- A **pipeline** is a series of automatic steps that run when a change is proposed or merged. See GitLab's [pipeline documentation](https://docs.gitlab.com/ci/pipelines/) and Atlassian's [continuous delivery guide](https://www.atlassian.com/continuous-delivery).
- A **gate** is a check that can stop the release. A **blocking** gate stops the line when it fails. A **warning** gate reports but does not stop.
- **Evidence** is a saved record that a step ran and what it found: a test report, a list of parts, a signature, an approval. Evidence is what lets you answer, months later, "How did we know this was safe?"

Martin Fowler's definition of [continuous delivery](https://martinfowler.com/bliki/ContinuousDelivery.html) gives a good test: **can you release at any moment, safely, with a button?** Launch Sequence is how you earn a yes.

### 2.2 The six stages

| # | Stage | The question it answers | What it proves |
|---|---|---|---|
| 1 | **Source assurance** | Can we trust the change itself? | Code was reviewed, tests pass, no secrets or obvious flaws in the source |
| 2 | **Supply chain** | Can we trust the parts we use? | Dependencies, base images and licences are known and acceptable |
| 3 | **Artifact security** | Can we trust the thing we built? | The built package or image is clean, listed and signed, and came from this source |
| 4 | **Deployment** | Can it go live safely and be undone? | Policies pass, the right people approved, it rolled out in a controlled way, and the live product works |
| 5 | **Governance** | Can we show who did what, and why? | There is a change record, an audit trail and saved evidence |
| 6 | **Go-to-market (GTM)** | Can the world understand and use it? | Release notes, guides, website text and announcements match what shipped |

You can read the stages like a chain. Each stage uses what the one before it proved. A signed artifact (stage 3) means little if the source was never checked (stage 1). Deployment (stage 4) must refuse an artifact that is not signed.

Mature pipelines contain many small jobs, grouped under these headings. A small product might have two or three jobs per stage.

### 2.3 What belongs in each stage

**1. Source assurance.** Checks on the code and configuration before anything is built.

- Formatting and style checks (lint).
- Automated tests: unit tests for small pieces, integration tests for pieces together.
- Secret scanning: a tool that looks for passwords and keys in the code and history, for example [Gitleaks](https://github.com/gitleaks/gitleaks).
- Static analysis (SAST): a tool that reads the source for risky patterns. [Semgrep](https://semgrep.dev/docs/) is one example.
- Scans of infrastructure files for risky settings.
- A short **threat model**: what could go wrong, who might attack, what we do about it. Agents can draft one. A person approves it.
- Human review of the merge request.

**2. Supply chain.** Checks on everything the product depends on. [Lesson 26](/library/tracks/frameworks/26-supply-chain-and-artifact-security/) goes deep. In short: pinned versions (a lockfile), a scan for known vulnerabilities, licence checks, a check of how healthy each dependency project is (the [OpenSSF Scorecard](https://scorecard.dev/) does this), and a check of the base image your container starts from.

**3. Artifact security.** After the build, you have an **artifact**: the package, container image or site bundle that will be deployed. Check the actual thing, not just the source.

- Scan the image for known vulnerabilities, for example with [Trivy](https://trivy.dev/latest/docs/).
- Scan the image for secrets and personal data.
- Create a list of its parts (an SBOM).
- **Sign** it, so that anyone can later check it is the one you built.
- Record **provenance**: where and how it was built.

**4. Deployment.** Putting the artifact live, in a controlled way. [Lesson 27](/library/tracks/frameworks/27-deployment-governance-and-go-to-market/) goes deep.

- Verify the signature **before** deploying.
- Check policy (for example: only signed images, no unreviewed changes).
- Ask for approval for production.
- Deploy through git, so the live state is described in a file you can read.
- Roll out to a small group first.
- Test the live product after deployment: simple "does it respond" checks, then the main journeys, then reliability targets.
- Keep a **rollback or forward-fix plan** ready and tested.

**5. Governance.** The part that makes the rest provable.

- A **change record** for each release (the merge request, per lesson 24).
- An **audit trail**: who changed what, when.
- An **evidence bundle**: the test report, the scan results, the SBOM, the signature, and the approval, saved together and linked from the release.
- Rules for who may approve.

**6. Go-to-market.** The part engineers forget. A feature nobody knows about has not shipped.

- Release notes for customers.
- Updated website and help pages.
- Screenshots or a short demo.
- A one-page summary for sales, partners and support.
- An announcement plan.

In the Dojo model GTM is **part of done**. If the documentation and announcement are not ready, the release is not ready.

### 2.4 A people-side plan: the LAUNCH checklist

The SuperNova strategy text (World Enterprise's incubation story, which comes after ANDROID Ops in its sequence) pairs the technical pipeline with a planning checklist for the people side of a launch. Its letters are **L**ogistics, **A**pplication, **U**sers, **N**avigation, **C**hannel and **H**ive. In plain words:

| Letter | Question | Typical answers |
|---|---|---|
| Logistics | How will the launch run? | Plan, security checks, a rehearsal, an overall approach |
| Application | What exactly is being launched, and what are its limits? | The product, its boundaries, what is in and out of the first version |
| Users | Who will use it, and who is involved in the launch? | Customer groups, internal people, partners |
| Navigation | What is the path and the pace? | Timeline, phases, how much effort and money it takes |
| Channel | How will people hear about it? | Marketing, sales, partners, B2B and B2C routes |
| Hive | Who is on the team during and after launch? | People, groups, communication lines |

Use it as a one-page plan next to the pipeline. The pipeline proves the product is safe. The checklist proves the **organisation** is ready.

### 2.5 Hand-offs

Work is passed between teams, and between people and agents. Each hand-off is a place where information gets lost. Good hand-offs are **written and structured**.

A useful pattern: when the build team finishes, it opens a **hand-off issue** in the launch project with a fixed title format, required labels, a short list of facts (which product, which version, link to the merge request), and acceptance criteria. The launch side has an equal duty: when it finishes the go-to-market work, it opens a structured issue for whoever plans growth, with the release summary and materials. This avoids "I thought you knew" and gives you an audit trail.

### 2.6 Blocking and warning

Do not turn every check on as blocking on day one. A new check usually finds old problems. If you block on all of them, the team will switch the check off.

A sensible path:

1. **Observe.** Run the check and report. Do not block.
2. **Warn.** Show it on the merge request. Fix new problems as they appear.
3. **Enforce.** Block, once the old problems are cleared or consciously accepted.

Write the decision for each check in a file, for example `launch/gates.md`, with the stage, the tool, the threshold, who owns it, and whether it is observe, warn or enforce.

## 3. Step by step: build a basic Launch Sequence

1. **Create `launch/gates.md`.** Write the six stage names. Under each, list the checks you want and mark each observe, warn or enforce.
2. **Start with what you have.** You likely have tests and lint. Put them under stage 1.
3. **Add secret scanning** to stage 1 and mark it enforce. A leaked secret is the one failure you cannot fix by moving forward alone: you must also replace the secret.
4. **Add a dependency scan** to stage 2 as warn.
5. **Build the artifact in the pipeline,** not on a laptop.
6. **Scan, list and sign the artifact** (stage 3). Even a first version of the SBOM is useful.
7. **Deploy from git** to a staging place, run smoke tests, then to production behind an approval (stage 4).
8. **Save the evidence** with the release (stage 5): link the pipeline, the scan result and the approval from the release notes.
9. **Write the GTM pack** as part of the release issue (stage 6): notes, guide, announcement.
10. **Test the gates.** Open a merge request that deliberately fails each check (a fake secret, a test that fails). Watch the pipeline stop it. A gate you never saw fail is a gate you cannot trust.

A skeleton to give to an agent as a starting point:

```yaml
stages: [source, supply-chain, artifact, deploy, governance, gtm]

source-lint-test:    {stage: source}
source-secrets:      {stage: source}
supply-deps:         {stage: supply-chain}
artifact-build-scan: {stage: artifact}
artifact-sign:       {stage: artifact}
deploy-staging:      {stage: deploy}
deploy-smoke:        {stage: deploy}
deploy-production:   {stage: deploy, when: manual}
governance-evidence: {stage: governance}
gtm-pack-check:      {stage: gtm}
```

This is a map, not a working file: each job needs its own `script`. Your agent fills them in, and you review each one.

## 4. Worked example: TrailMug release 0.4

TrailMug's cup return scan (epic 4) is ready to ship. Maya walks the stages. The pipeline results are fictional.

| Stage | What ran | What Maya read |
|---|---|---|
| Source | Lint, 63 unit tests, secret scan, human review of three merge requests | The secret scan found a test key left in an example file. She had the agent remove it and rotate the key. |
| Supply chain | Dependency scan, licence check, Scorecard on the new QR library | One dependency had a known problem in a part TrailMug does not use. She accepted the risk in writing and set a date to update. |
| Artifact | Image built in the pipeline, scanned, SBOM created, signed | The scan was clean. The SBOM lists the QR library. |
| Deployment | Signature checked, staging deploy, smoke tests, manual approval, rollout to Leo's café only | She approved. The rollback is "switch the counter page to the manual form". |
| Governance | Release record with links to pipeline, scan, SBOM, approval | One page, saved with the release. |
| GTM | Release notes, a barista card, a note for Leo | The agent drafted them. She checked them against the merge requests. |

She also fills in the LAUNCH checklist: Leo's café first (Users), the counter page and nothing else (Application), a card on the counter and a note to the partner cafés (Channel), Maya and the support person on call that week (Hive).

## 5. Working with AI agents on this

**What the PDM decides.** What each stage must prove for **this** product. Which checks block. Who may approve production. What risk you accept and for how long.

**What agents do well here.**

- Write and fix pipeline configuration.
- Triage scanner findings: group them, explain each in plain words, suggest the smallest fix.
- Draft the threat model, the evidence summary and the GTM pack.
- Run the checks, open issues for failures, and update the release record.

**What agents must not do.** Approve production, accept a risk, turn off a gate, or read a secret value. Make these rules technical, not just written: protected branches, protected environments for production, least-privilege tokens.

**A brief you can adapt:**

```text
Read launch/gates.md. For each gate marked enforce, show me the pipeline
job that implements it (file and job name). If a gate has no job, say
MISSING. Then list every job in the pipeline that is not in gates.md.
Do not change any file. Output two lists.
```

**How to check.** Pick one enforced gate. Break it on purpose in a throwaway branch. Confirm the pipeline fails. This takes five minutes and tells you more than any report.

**Agent provenance.** For market-facing material and releases, keep a record of which agent and model produced what, from which commit. A simple file saved next to the output, with the commit id, is enough. It proves the agent saw the current version of the product and not an old one. This is also what [Disclose AI use](/library/disclose-ai-use) asks you to do.

**Other disciplines.** Security helps choose the gates. Operations owns the live checks. Marketing and support own the GTM pack. A designer checks the live product against the design.

**From delegating to orchestrating.** A gate that checks every merge request is policy made enforceable. When many sessions produce changes, the six stages are the walls that keep them safe whether or not anyone is watching. The fleet side (operating these gates for agent-built software) is in the [Agent orchestration](/library/tracks/agent-orchestration/) track.

## 6. Common mistakes and how to avoid them

- **Pipeline theatre.** Many green checks that check nothing important. Break each one on purpose to see.
- **Everything blocks on day one.** The team disables the pipeline. Roll out gates in three steps.
- **Forgetting GTM.** Engineers ship, nobody tells customers. Make GTM a stage with an owner.
- **Building on a laptop.** If it is not built by the pipeline, you cannot prove where it came from.
- **Secrets in the repository.** Remove and replace them. Never just delete the line.
- **No rollback plan.** Write it before the release, and test it once.
- **Evidence nobody can find.** Link it from the release record.

## 7. Practice

**Deliverable in git:**

1. `launch/gates.md`: the six stages, each with at least two checks, tool names, thresholds, owners and observe, warn or enforce.
2. A pipeline file (written by an agent, reviewed by you) with at least one job in each of the first four stages.
3. A throwaway branch and merge request that **fails** two gates on purpose. Include the pipeline link in the description and a line saying what you learned.
4. `launch/launch-checklist.md`: the six LAUNCH questions answered for one real or fictional release.
5. A note on which agent helped and what you checked.

## 8. Checklist

- [ ] I can name the six stages and what each proves.
- [ ] Every check in my pipeline has a stage, an owner and a mode (observe, warn, enforce).
- [ ] I have seen at least two gates fail on purpose.
- [ ] No secret is in the repository or the logs.
- [ ] Production needs a human approval that an agent cannot give.
- [ ] A rollback or forward-fix plan exists and was tested once.
- [ ] Evidence is saved and linked from the release.
- [ ] GTM material is part of the definition of done.

**Next:** [lesson 26](/library/tracks/frameworks/26-supply-chain-and-artifact-security/) goes deep on stages 2 and 3.
