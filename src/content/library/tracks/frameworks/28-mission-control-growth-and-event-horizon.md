---
title: "Mission Control, GROWTH and Event Horizon"
description: "How launched products are watched and steered: dashboards, service level objectives, incidents and reviews, plus the GROWTH Accelerator and the Event Horizon idea from SuperNova."
section: "Frameworks"
order: 28
track: "frameworks"
level: "advanced"
duration: "65 min"
outcomes:
  - "Design a Mission Control board with a few measures, objectives and alerts that fit one product"
  - "Run an incident with clear roles and write a blameless review"
  - "Explain the six GROWTH steps and set honest, measurable signs for an Event Horizon"
resources:
  - "google-sre/service-level-objectives"
  - "google/sre-monitoring-distributed-systems"
  - "google-sre/managing-incidents"
  - "google-sre/postmortem-culture"
  - "dora/software-delivery-performance-metrics"
  - "gitlab/incident-management"
  - "finops-foundation/framework"
  - "grants-gov/learn-grants"
prerequisites:
  - "tracks/frameworks/27-deployment-governance-and-go-to-market"
updated: 2026-11-03
---

**Dojo programme link:** this lesson closes the Master Developer path on production launch and operations. It supports the Product Package evidence for "next steps and measures" in week 6, and it is the base for the observability and service management track. Mission Control follows [Launch Sequence](/library/tracks/frameworks/27-deployment-governance-and-go-to-market/), and its measures feed back to the Optimize area of [ANDROID Ops](/library/tracks/frameworks/22-android-focus-areas-optimize-implement-deliver/).

## 1. Why this matters

A release is the start of the product's life, not the end. Customers use it at times you did not expect, services fail at 3 a.m., a partner changes their system, and costs creep up. Someone must watch, decide and respond. In the 2030 team that someone is a Product Development Manager (PDM) with a set of dashboards, a few agents that watch and summarise, and a small group of people who can act.

This lesson covers three ideas from the Dojo's framework family:

- **Mission Control:** how launched products are watched and steered.
- **GROWTH Accelerator:** how to find and win funding or partnerships that fuel the next stage.
- **Event Horizon:** the point where the effort starts to pay back, and how to recognise it without hype.

## 2. Key ideas, explained

### 2.1 Mission Control: what the source says

The framework texts describe Mission Control in two places.

In the ANDROID Ops notes, the Implementation phase is called "Mission Control". **Command Engineers** (CEs) sit in a command centre, oversee quality control and integration, and make sure the applications are ready. They run quality assurance (QA) and user acceptance testing (UAT), find and reduce obstacles, and use diagnostic tools and live data to confirm each application meets its standards. When the application is ready, the CEs hand control to a **Deployment Team** that does the actual launch to production.

In the SuperNova strategy text, Mission Control is the "nerve center" that oversees every part of the plan with three ingredients: project management tools to track progress and challenges; continuous analysis of key performance indicators (KPIs); and expert teams that keep the plan aligned with objectives.

The Dojo joins these in a single idea. **Mission Control is the function that watches a product from "ready to ship" to "running for customers" and steers it with evidence.** Before launch it checks readiness (what the CEs do). After launch it watches the product live. In both cases it has one purpose: so that a person can answer, at any time, "Is the product healthy, and what should we do next?"

### 2.2 The four layers of a Mission Control board

A good board has four layers. Keep each short.

| Layer | Question | Example measures |
|---|---|---|
| **Customer outcome** | Are people getting what they came for? | Task success, time to complete, support requests per week |
| **Service health** | Is the product up and fast? | Availability, response time, error rate |
| **Delivery health** | Are we shipping safely and quickly? | The DORA measures: change lead time, deployment frequency, change fail rate, failed deployment recovery time, rework rate |
| **Cost and risk** | What does it cost and what could hurt us? | Cloud spend, open critical findings, expiring certificates, accepted risks past their review date |

**Why only a few.** More measures mean less attention for each. Three to five per layer at the start is plenty. Each measure needs an owner, a definition, a source and a target.

### 2.3 What to watch: the four signals

The Google SRE book chapter [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) names four signals that cover most services:

- **Latency:** how long requests take.
- **Traffic:** how much demand there is.
- **Errors:** how often requests fail.
- **Saturation:** how full the system is (memory, disk, queue).

You can start with these four for any service, then add measures for your own customer outcome. Standards such as [OpenTelemetry](https://opentelemetry.io/docs/what-is-opentelemetry/) collect traces, metrics and logs in a common way, and tools such as [Prometheus](https://prometheus.io/docs/introduction/overview/) and [Grafana](https://grafana.com/docs/grafana/latest/dashboards/) store and draw them. You do not have to pick tools yourself. You do have to ask: **can I see these four signals for every service?**

### 2.4 Service level objectives (SLOs)

A **service level indicator (SLI)** is a measure of how well a service performs, for example "the percentage of cup scans that succeed". A **service level objective (SLO)** is a target for it, for example "99 percent of scans succeed over 30 days". The chapter on [service level objectives](https://sre.google/sre-book/service-level-objectives/) explains how to choose them, and [Implementing SLOs](https://sre.google/workbook/implementing-slos/) gives practice.

The remaining part, 1 percent in this example, is the **error budget**: how much failure you may spend before you must slow down and fix reliability. This gives a PDM a decision tool. If you have budget left, ship features. If it is used up, fix reliability first. It turns a vague argument ("is it stable enough?") into a number.

Pick SLOs that matter to **customers**, not just to servers. And remember that 100 percent is the wrong target. The SRE chapter [Embracing Risk](https://sre.google/sre-book/embracing-risk/) explains why.

### 2.5 Alerts: wake people only when it matters

An **alert** is a message that tells a person to act. Too many alerts make people ignore all of them. Rules of thumb from the SRE book:

- Alert on **symptoms people feel** (scans are failing), not on every internal event.
- Every alert should need a **human action**. If the action is "wait", it is not an alert; it is a graph.
- Link each alert to a **runbook**: a short page that says what it means and what to do first.

### 2.6 Incidents

An **incident** is an event that harms or threatens the service for customers. The first goal is to **restore service**; finding the root cause comes second.

The chapter on [Managing Incidents](https://sre.google/sre-book/managing-incidents/) and the workbook chapter on [Incident Response](https://sre.google/workbook/incident-response/) agree on a few simple ideas:

| Role | Job |
|---|---|
| **Incident commander** | Decides, keeps order, assigns work. Does not fix. |
| **Operations lead** | Does the technical work to restore service |
| **Communications lead** | Tells customers and staff what is known, on a schedule |
| **Scribe** | Keeps a timeline of what happened and what was tried |

For a very small team one person may hold several roles, but write them down so that roles are clear. In ANDROID Ops with agents, the agent can be the scribe and the first investigator. It collects logs, compares recent changes, and proposes causes. A human is the incident commander and approves any action that changes production.

GitLab can track incidents as issues with timelines; see its [incident management](https://docs.gitlab.com/operations/incident_management/) documentation (some features depend on your plan). An issue with the label `incident` in your own project works too.

### 2.7 Learning: the blameless review

After an incident, write a short review. The goal is to **learn**, not to blame. The [Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) chapter explains why blame hides information. Include:

1. What happened (timeline).
2. How customers were affected and for how long.
3. What helped and what did not.
4. The contributing causes (many; rarely one).
5. Actions, each with an owner and date.
6. The gate or check that would catch this class of problem next time.

That last item follows the Dojo's fix-forward rule: after a fix, **add the gate** that would have caught it.

### 2.8 Cost as a signal

Cloud spending grows quietly. [FinOps](https://www.finops.org/framework/) is the practice of engineering, finance and product teams managing it together. For the PDM, one chart of monthly cost per product, with a budget line and an owner, is a good start. Ask "what do we get for this?" every month.

### 2.9 The GROWTH Accelerator

The SuperNova text describes a **GROWTH Accelerator** as a way to secure new money through procurement sources, requests for proposals (RFPs), partnerships and grants. In plain words, it is a method for finding and winning **external funding or contracts** to feed the next stage of a product. Its six steps spell GROWTH:

| Letter | Step | What you do |
|---|---|---|
| **G** | Gauge | Check whether the opportunity fits: can you meet its needs and do you qualify? |
| **R** | Research | Study the call and the funder until you can state its goals and a clear plan to meet them |
| **O** | Organize | Collect every document, requirement and deadline; make checklists and a folder structure |
| **W** | Work | Write the narrative so it answers exactly what the funder asks, with a clear statement of work |
| **T** | Target | Build the budget narrative, the indicators and goals, and meet financial and statistical review rules |
| **H** | Health | Keep the submission current and strong: track the trends, make amendments |

For a developer-led product, this is a project like any other and can be run in git. It also depends on Mission Control, because your measures are the evidence funders ask for.

Be careful with it. Funding rules differ by country and programme. Some programmes are only open to certain kinds of organisation. Never promise a funder results you cannot measure. The [Grants Learning Center](https://www.grants.gov/learn-grants) (U.S.) and the [SBA grants page](https://www.sba.gov/funding-programs/grants) are neutral introductions; always read the funder's own rules.

### 2.10 Event Horizon

In astronomy an event horizon is a boundary beyond which things cannot return. The SuperNova text uses the name for a **tipping point**: the point where accumulated effort turns into strong growth. It names two signals: **market traction** (customer engagement, revenue growth and operational efficiency) and **synergy creation** (several elements reinforcing each other).

The metaphor is useful if you keep it honest. Treat Event Horizon as a **hypothesis with measurable signs**, not as a promise. Before launch, write down what you would count as "the product has traction", for example:

- A number of weekly active users that you chose in advance.
- A retention figure (how many come back after 30 days).
- A cost per customer that is below what a customer pays.
- Support load that does not grow as fast as customers do.

If you meet them, you have earned the word. If you do not, you have learned something. Nothing in these frameworks guarantees growth, and the Dojo does not claim that any method does.

## 3. Step by step: set up Mission Control for a small product

1. **List your services and owners** in `mission-control/services.md` (a table; link it to the [product catalogue](/library/product-catalogue-standard)).
2. **Choose three to five measures per layer.** Write each as name, definition, source, owner, target.
3. **Create the board.** A dashboard in any tool, or even a weekly generated markdown report in the repository.
4. **Set one or two SLOs** that reflect customer outcomes. Compute the error budget.
5. **Add alerts** for the symptoms behind your SLOs. Each links to a runbook.
6. **Write the incident roles** and a one-page incident checklist. Practise once with a pretend incident.
7. **Add the review template** for blameless reviews.
8. **Set the rhythm.** A ten-minute daily check, a weekly review of the board, a monthly look at cost and risk.
9. **Connect to Optimize.** Each review ends with one issue labelled `optimize` or `research`.
10. **If you plan funding,** run a GROWTH project in `growth/<opportunity>/` with the six steps as issues.

## 4. Worked example: TrailMug Mission Control

After release 0.4 Maya builds a small board.

| Layer | Measures (all fictional) |
|---|---|
| Customer outcome | Median seconds from scan to green screen (target under 10). Failed-scan support messages per week. |
| Service health | Scan success rate (SLO: 99 percent over 30 days). Page response time. |
| Delivery health | Change lead time. Change fail rate. |
| Cost and risk | Monthly hosting cost against budget. Accepted risks past review date: zero. |

Her SLO on scan success gives an error budget of one failed scan in a hundred. In week three the budget is nearly used up, because scratched cups fail. She pauses the loyalty feature and directs an agent to add a manual-entry fallback.

An incident: one Saturday the scan API returns errors. An alert fires (scan success under target for ten minutes). The agent, acting as scribe, posts a timeline and notes that a configuration change was merged the day before. Maya, the incident commander, approves the switch of the counter page to the manual form (her pre-agreed switch). Service is restored in minutes for customers. The cause is found on Monday. The review lists three actions, including a test for the configuration that failed.

For growth, a local sustainability programme runs a call for community projects. Maya runs a GROWTH project: Gauge (do cafés qualify? is TrailMug eligible as a business?), Research, Organize, Work, Target (her measures become the indicators), Health. She decides not to apply because the eligibility rules do not fit. That is a valid outcome of Gauge, and it cost her two hours, not two weeks.

## 5. Working with AI agents on this

**What the PDM decides.** Which measures matter. The SLO targets. When to pause feature work. Whether to chase funding. What to tell customers in an incident.

**What agents do well.**

- Collect data, build and update dashboards, and produce the weekly report.
- Watch for alerts and summarise them with the recent changes.
- Act as incident scribe and first investigator.
- Draft customer updates and the review.
- Prepare the funding documents: checklists, folders, a first draft of the narrative for your edit.

**What agents must not do.** Change production without approval during an incident. Decide the severity of an incident alone. Send a customer message without review. Invent figures in a funding application.

**A brief you can adapt:**

```text
You are the scribe for incident INC-12. Read the alert, the last ten
merged changes and the service logs for the last hour. Write a timeline
of facts only, each with its source (link or log line). List up to three
possible causes ranked by evidence, marked as HYPOTHESIS. Do not take any
action. Update the timeline every ten minutes until I say stop.
```

**How to check.** Every timeline line must have a source you can open. Treat "HYPOTHESIS" lines as ideas to test, not facts to report.

**Watching the agents themselves.** If your product contains an AI feature or agents act for you, add their quality to the board: a fixed test set run on a schedule, a score, and an alert if the score drops. This is the MLOps habit from [lesson 20](/library/tracks/frameworks/20-why-a-new-operating-model/).

**Other disciplines.** Operations and support know what customers feel. Finance owns the cost view and the funding budget. Marketing watches traction signs. A designer looks at where users struggle. Security reviews risk items.

**From delegating to orchestrating.** Gathering metrics, summarising incidents and drafting status notes can run as parallel sessions. Fleet-level views (briefings, scorecards and a decision queue that brings only the choices that need a person) are covered in [Agent orchestration](/library/tracks/agent-orchestration/).

## 6. Common mistakes and how to avoid them

- **Dashboards with forty charts.** Pick a few that drive decisions.
- **Alerting on everything.** Alert on customer symptoms only.
- **No owner for a measure.** A number without an owner is decoration.
- **Blame in reviews.** People hide facts if they fear blame.
- **Reviews with no actions.** Each review ends with owned, dated actions.
- **Chasing funding for its own sake.** Gauge first; walk away when it does not fit.
- **Calling a spike an Event Horizon.** Define the signs in advance and sustain them.
- **Skipping the loop.** Mission Control without a link to Optimize and Research is a monitor with no brain.

## 7. Practice

**Deliverable in git:** a folder `mission-control/` containing:

1. `services.md` and `measures.md` with at least eight measures across the four layers, each with owner and target.
2. `slo.md` with one SLO for a customer outcome and its error budget in plain words, plus what you will do when the budget is used up.
3. `incident-checklist.md` with the roles, the first five steps and the switch you pre-agreed.
4. `review-template.md` and one practice review of a pretend incident, including the gate you would add.
5. `event-horizon.md` listing the signs you will count as traction, with numbers you chose in advance.
6. Optional: `growth/<opportunity>/` with the six GROWTH steps as issues for a real or fictional call.
7. A note on how an agent helped.

## 8. Checklist

- [ ] My board covers customer outcome, service health, delivery health, cost and risk.
- [ ] Each measure has a definition, source, owner and target.
- [ ] At least one SLO reflects a customer outcome, and the error budget drives a decision.
- [ ] Alerts are tied to customer symptoms and to runbooks.
- [ ] Incident roles and a switch are written down.
- [ ] Reviews are blameless and produce owned actions and a new gate.
- [ ] Event Horizon signs are numbers I chose in advance.
- [ ] Funding work, if any, has a Gauge step and honest claims.

**Next:** [lesson 29](/library/tracks/frameworks/29-launch-specialist-and-mission-control-careers/) looks at the roles as career paths.
