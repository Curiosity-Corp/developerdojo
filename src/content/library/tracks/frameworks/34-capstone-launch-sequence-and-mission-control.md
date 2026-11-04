---
title: "Capstone: launch through six stages and run Mission Control"
description: "Take the TrailMug epic through the six Launch Sequence stages with a human decision at each gate, set up a Mission Control board with service levels, and run a first incident drill, as a PDM supervising people and agent sessions."
section: "Frameworks"
order: 34
track: "frameworks"
level: "advanced"
duration: "90 min"
outcomes:
  - "Run an epic through the six Launch Sequence stages and record what each stage proved"
  - "Set up a four-layer Mission Control board with service levels, an error budget and incident roles"
  - "Run a short incident drill with agent sessions inside policy and write a blameless review"
resources:
  - "google-sre/service-level-objectives"
  - "google-sre/managing-incidents"
  - "google-sre/postmortem-culture"
  - "dora/software-delivery-performance-metrics"
  - "opengitops/principles"
  - "gitlab/docs-protected-environments"
  - "sigstore/sigstore-overview"
prerequisites:
  - "tracks/frameworks/33-capstone-android-ops-build-on-phantoms"
updated: 2026-11-03
---

**Dojo programme link:** this lesson continues Developer weeks 5 and 6 into operations. It is capstone steps 9 and 10 of [the overview](/library/tracks/frameworks/30-capstone-overview-and-dream-discovery/). Lesson 35 covers step 11, GROWTH.

## 1. Why this matters

Code that merged is not a product that works. Between a green merge request and a customer using the feature there are checks to pass, a release to choose, and a way to watch and undo it. When sessions of agents build quickly, these steps carry more weight, not less. Speed without gates is how a small mistake reaches every customer in an hour.

Think of two crews. **Launch Sequence** is the pre-flight and launch crew: it decides whether the thing may go. **Mission Control** is the crew that watches flight and answers when something goes wrong. As the PDM you do not run all the checks by hand. You **set the gates, read the evidence, and decide**.

## 2. Key ideas, explained

### 2.1 The six stages and what each one proves

You studied these in lessons 25 to 27. The capstone use is below. The list is about **what each stage proves**, because the decision you make is "do I believe this proof?".

| # | Stage | What it proves | Your decision |
|---|---|---|---|
| 1 | Source assurance | The code is what the team wrote, is reviewed, and holds no secrets | Is the review real? |
| 2 | Supply chain | We know what is inside it (parts list, locked versions, known flaws) | Which risks do we accept? |
| 3 | Artifact security | The thing we ship is the thing we built (signed, scanned, traceable) | Is the origin trustworthy? |
| 4 | Deployment | It can be released in small steps and undone | What is the rollout and who holds the switch? |
| 5 | Governance | The change is recorded, approved and auditable | Who must approve this change? |
| 6 | Go-to-market | People who need to know are told, supported and measured | Are we ready for the questions? |

Each gate is **blocking** (the release stops) or **warning** (it is recorded and discussed). New projects start by observing, then warning, then blocking, so gates arrive without freezing work. The stages are explained in [lesson 25](/library/tracks/frameworks/25-launch-sequence-six-stages/), supply chain in [lesson 26](/library/tracks/frameworks/26-supply-chain-and-artifact-security/), and deployment, governance and go-to-market in [lesson 27](/library/tracks/frameworks/27-deployment-governance-and-go-to-market/). The track [Agent orchestration](/library/tracks/agent-orchestration/) covers running these gates for a whole fleet of agent-built software.

**Agent-built changes add two questions.** Who made this change (the manifest ties it to the commit), and did a person review it? The [Sigstore](https://docs.sigstore.dev/) overview shows how signing ties an artifact to the pipeline that made it.

### 2.2 Releasing safely

- **Small steps.** Release to a few users first (a canary), then more. Or put the feature behind a switch (a flag) and turn it on gradually.
- **Declared state.** [OpenGitOps](https://opengitops.dev/) states four ideas: the desired state is declared, versioned and immutable, pulled automatically, and continuously reconciled. In plain words: what should be running is written in git, and the system keeps itself matching it.
- **Protected environments.** Only named people can release to production. See GitLab's [protected environments](https://docs.gitlab.com/ci/environments/protected_environments/).
- **Fix forward, with a switch.** If something breaks, we ship a forward fix. The fast safety valve is to turn the feature off with the switch while the fix is built.
- **Change record.** A merge request with the template filled in: what, why, risk, test evidence, rollout, how to turn off, who approved. See [change record template](/library/template-change-record).

### 2.3 Mission Control as operations

Mission Control is where you watch what is running. Lesson 28 describes four layers. For the capstone you build a simple board with them:

1. **Customer outcome:** did people succeed? (cup returns completed)
2. **Service health:** is it working? Four signals: latency, traffic, errors, saturation.
3. **Delivery health:** how well do we ship? The [DORA measures](https://dora.dev/guides/dora-metrics-four-keys/): change lead time, deployment frequency, failed deployment recovery time, change fail rate, rework rate.
4. **Cost and risk:** what does it cost, and what could hurt us?

A **service level objective (SLO)** is a promise you make to yourself about a service, for example "99 percent of café searches answer in under one second over 28 days". The **error budget** is the allowed failure (here, 1 percent). If the budget is used up, you slow new releases and fix reliability first. The Google SRE chapter on [service level objectives](https://sre.google/sre-book/service-level-objectives/) explains the idea in depth. Start with one or two SLOs. Too many dashboards make nobody look at any of them.

### 2.4 Incidents, with people and agents

An **incident** is an event that hurts users and needs a coordinated response. Keep the roles small and clear (see [Managing incidents](https://sre.google/sre-book/managing-incidents/)):

- **Incident commander:** coordinates and decides. In the capstone this is you.
- **Operations lead:** the person (or a session within policy) who makes the fix.
- **Communications lead:** tells users and the team what is happening.

Agent sessions help by gathering logs, summarising the timeline, drafting the status message and proposing a fix in a branch. **They do not decide to roll out, spend, or tell customers.** After the incident, write a **blameless review** ([postmortem culture](https://sre.google/sre-book/postmortem-culture/)): what happened, how we found it, what helped, what we will change, one gate or habit to add. A review that blames a person teaches people to hide problems.

## 3. Step by step

### 3.1 Step 9: launch epic 1

1. **Open a launch issue** for the epic with the six stages as a checklist.
2. **Stage 1:** confirm review rules on the main branch, run the secret scan, and record the result.
3. **Stage 2:** produce the parts list (SBOM) and the dependency scan; list accepted risks with a reason and a date.
4. **Stage 3:** build in the pipeline, sign the digest, record where the artifact came from.
5. **Stage 4:** write the rollout plan: who gets it first, what is measured, the switch name, the turn-off step. Rehearse the turn-off in a test environment.
6. **Stage 5:** complete the change record. A human approves from the protected list.
7. **Stage 6:** brief support, write a short note to partner cafés, and agree the first measures.
8. **Release** to the first small group. Watch the board for an agreed time.
9. **Widen** only when the measures hold.

### 3.2 Step 10: Mission Control

1. **Make the board** (`mission-control/board.md` or a dashboard tool): four layers, one to three measures each.
2. **Write two SLOs** and the error budget policy ("if the budget is gone, we freeze features").
3. **List the alerts** and who answers each. An alert with no owner is noise.
4. **Name the incident roles** and write a one-page runbook for the likeliest failure.
5. **Run a drill:** the coordinator (or a mentor) breaks something in a test environment. Practise the response.
6. **Write the review**, blameless, within two days.

## 4. Worked example: TrailMug

### 4.1 Launch (extract)

Maya's launch checklist for the café finder:

| Stage | Evidence | Maya's decision |
|---|---|---|
| Source assurance | Protected main, one approval each, secret scan clean | Pass |
| Supply chain | Parts list produced; two medium findings in a test-only tool | Accept, review in 30 days (warning gate) |
| Artifact security | Signed image; manifest ties each merge to its session | Pass |
| Deployment | Finder behind a switch; 5 percent of users first; turn-off tested | Pass |
| Governance | Change record approved by the second approver | Pass |
| Go-to-market | Note sent to partner cafés; help page written | Pass |

She released to 5 percent for a day, watched the board, then went to 25 percent.

### 4.2 Mission Control board (extract)

| Layer | Measure | Target |
|---|---|---|
| Customer outcome | Café found and opened within 15 seconds | 90 percent |
| Service health | Search answers in under one second | 99 percent over 28 days |
| Delivery health | Change lead time; change fail rate | Trend down; under 15 percent |
| Cost and risk | Agent run cost and map provider cost per 1,000 searches | Under the ORBITAL line |

### 4.3 Drill

The mentor changed the seed data so every café showed as "closed". Maya was incident commander. A session gathered the logs and found the change; another drafted the status note. Maya decided to turn the finder off with the switch, told partner cafés through the note, and approved a forward fix. The review found that no alert watched "zero cafés open", and added one.

## 5. Working with AI agents on this

**What the PDM decides.** Whether each gate's evidence is believable; the rollout plan; the error budget policy; who approves; when to widen; when to turn off.

**What is delegated, with the exact brief.**

```text
Read the pipeline output and the artifacts for merge request !N.
Fill in the Launch Sequence checklist in docs/launch/epic-1.md: for each
of the six stages write PASS, WARN or FAIL, the file or job that is your
evidence, and any accepted risk. If you cannot find evidence, write NONE.
Do not mark anything PASS without evidence. Do not change the pipeline.
```

```text
Incident in progress. Read the last 60 minutes of logs in incident/logs/.
Produce: a timeline (time, event, source line), the first sign of the
problem, and three possible causes ranked by evidence. Do not change
anything and do not propose a rollout. Write only to incident/notes.md.
```

**How to verify.** Open the evidence for every PASS. Rerun one check by hand. Compare the timeline with the raw logs, line by line. Confirm that the session wrote only to its allowed file.

**Disciplines involved.** Engineering (pipeline and release), security (stages 1 to 3), operations (board and incident), product (outcome measures), marketing and support (stage 6), finance (cost layer).

**Where it becomes orchestration.** In a drill you may run three sessions at once (logs, status note, fix branch). That is rung three of the ladder from lesson 33. Policy keeps it safe: the sessions read, draft and propose; only you rollout or spend. The [Agent orchestration](/library/tracks/agent-orchestration/) track covers how this scales across a fleet.

## 6. Common mistakes and how to avoid them

- **Treating the stages as paperwork.** Each stage must prove something you can check.
- **Starting with every gate blocking.** Observe, warn, then enforce.
- **Believing "PASS" with no evidence.** Ask for the file.
- **No way back.** Test the turn-off before release.
- **Too many dashboards.** Four layers, a few measures.
- **Alerts with no owner.** Name the owner or delete the alert.
- **Blame in the review.** Ask what in the system allowed this.
- **Agents deciding in an incident.** They gather and draft; you decide.
- **Skipping the drill.** The first real incident is a bad time to learn the roles.

## 7. Practice

**Deliverable in git:** on a branch `launch-and-watch`:

1. `docs/launch/epic-1.md`: the six-stage checklist with evidence and your decision for each.
2. `docs/launch/rollout-plan.md`: first group, measures, switch, turn-off, approver.
3. A change record merge request for the release.
4. `mission-control/board.md`: four layers, at least six measures, two SLOs, the error budget policy.
5. `mission-control/runbook.md`: one page for the likeliest failure, with the roles.
6. `mission-control/drill-review.md`: a blameless review of a drill, with one new gate or alert.
7. A merge request description listing every agent brief and what you checked.

## 8. Review checklist

- [ ] Every stage has evidence I opened myself.
- [ ] Gates are marked blocking or warning, and I know the rollout path to enforce.
- [ ] The turn-off has been rehearsed.
- [ ] A human approver is named in the change record.
- [ ] The board has four layers and at least two SLOs with an error budget policy.
- [ ] Alerts each have an owner.
- [ ] The review is blameless and adds at least one gate or alert.
- [ ] Agents only gathered, drafted or proposed; I decided.

**Next:** [lesson 35](/library/tracks/frameworks/35-capstone-growth-and-the-whole-product/) closes the loop with GROWTH and looks back across the whole capstone.
