---
title: "The ANDROID layer: advancing and delivering the product"
description: "The seven ANDROID elements (Advancement, Networking, Design, Research, Optimisation, Implementation, Deployment), the deployment record and the control point for agents."
section: "Catalogue framework"
order: 4
level: core
duration: "60 min"
outcomes:
  - "Write all seven ANDROID elements for a product."
  - "Record each connection with purpose and direction."
  - "Write a deployment record that includes a fix-forward plan."
  - "State what an agent may do, and where a human must approve."
resources:
  - opengitops/principles
  - gitlab/ci-cd
  - gitlab/merge-requests
  - nist/ai-risk-management-framework
  - owasp/secrets-management-cheat-sheet
  - google-sre/managing-incidents
prerequisites:
  - catalogue-orbital-layer
---

ANDROID is layer 3 of the [catalogue framework](/library/catalogue-framework-overview). It describes how the product advances and is delivered, from connections and design, through research and AI-assisted optimisation, to implementation and deployment. ORBITAL says what you want and what you need. ANDROID says how the work moves.

## Why it matters

Delivery goes wrong in boring ways: nobody knew which service called which, nobody wrote down who approves a release, an agent changed something nobody reviewed, and a rollout had no plan for failure. ANDROID makes those things visible before they hurt.

## Key ideas

- **Seven stages.** A, N, D, R, O, I, D. Fill all seven.
- **Networking is a record of connections.** Every outside system, with purpose and direction.
- **Agents have scope.** Write what an agent may do and where a human reviews.
- **Deployment is evidence.** Write what was released, where, by whom, and how it was checked.
- **Do not assume.** Not every product uses every environment or tool.

## The seven elements, explained

| Element | What to document | TrailMug example (fictional) |
|---|---|---|
| **A** Advancement | Maturity, releases, priorities, next stage | Beta now. Release 0.4 adds refund status. Next stage: public pilot in 12 cafés. |
| **N** Networking | Other services, platforms, APIs, vendors, data sources, with purpose and direction | The app calls the payments provider (take deposit; outbound). The returns service calls the email sender (send refund notice; outbound). The tablet page calls the returns API (record return; inbound). |
| **D** Design | Ideas, user flows, wireframes, mockups, interface decisions | Journey map v2; wireframes for the status screen; decision: show status in words, not colours alone. Ideas drafted with an AI assistant are marked and reviewed. |
| **R** Research | Discovery, market and technical research, feasibility, alternatives, evidence | Ten café interviews; scan of three email senders recorded in ADR-0001 |
| **O** Optimisation | Agent-supported improvement of workflows, code, quality, efficiency. Record agent scope and human review points. | An agent proposes test improvements in merge requests. A person reviews every one. No agent merges. |
| **I** Implementation | Build and integration work. Which people and which agents do which part. | Two engineers build features. An agent drafts tests and documentation. A person approves each merge request. |
| **D** Deployment | Release and rollout across the platforms and environments in use | See the deployment record below |

### Where design ideas come from

You may use an AI assistant to produce design ideas. Mark them as ideas. A person chooses, and the decision is written in the design notes. An idea is not a decision.

## The deployment record

For each deployment write:

| Item | What to write | TrailMug example |
|---|---|---|
| Target environment | Where it goes | Production, one region |
| Deployed components | What was released | trailmug-svc-returns 0.4.1 |
| Responsible person or agent | Who runs it | Operations lead. A deployment agent applies the change after approval. |
| Configuration and secrets handling | Names only, never values | Settings in the settings service; secret names `EMAIL_API_KEY` (held in the secret store) |
| Release version | Tag or number | v0.4.1 |
| Validation steps | How it was checked | Returned a test cup; saw the status change in the app |
| Fix-forward approach | What you do if it fails | Switch off the new field with the flag, ship a corrected release within four hours |
| Evidence | Where the proof is | Pipeline link and a screenshot in the merge request |

Do not assume every product uses every platform. Examples of what a deployment may involve: an edge network such as Cloudflare, a workflow service such as Azure Logic Apps, a build agent, a deployment agent, a shared lab environment for trials. Write only the ones your product really uses.

## The control point

> AI agents may perform defined optimisation, implementation or deployment tasks. Access, permissions, approval gates, testing and human accountability must be written down for any consequential change.

For each agent task write four things: what it may touch, what it may not touch, who approves, and how you will see what it did.

## Steps

1. Start from the Master layer and list every connection in Networking.
2. Write the next release and the stage after it in Advancement.
3. Link your design notes and journeys in Design.
4. Link research notes and decision records in Research.
5. Write the agent scope table in Optimisation and Implementation.
6. Fill one deployment record for the last release, then for the next.
7. Check that secrets appear as names only.

## Working with AI agents

- **May:** list outbound calls found in code, draft the deployment record from a pipeline log, compare the Networking table with the Master layer.
- **May not:** approve a release, decide the scope of another agent, or hold unreviewed access to production.
- **A safe brief:** "List every outbound web address found in this repository with the file path and line. Do not open any secrets file. Do not call any of them."

## Common mistakes

1. **Connections with no direction or purpose.**
2. **Agents with no written scope.**
3. **A deployment record with no fix-forward plan.**
4. **Secret values in the record.** Names only.
5. **Listing every possible environment.** Write the real ones.
6. **Design ideas treated as decisions.**

## Practice

1. List five connections of a product you know, with direction and purpose.
2. Write the agent scope table for one agent task.
3. Fill a deployment record for the last release you did.
4. Find one design idea that was never written down as a decision.

## Checklist

- [ ] All seven stages are filled.
- [ ] Every connection has purpose and direction.
- [ ] Agent scope and review points are written.
- [ ] Every deployment record has validation and a fix-forward plan.
- [ ] Secrets appear as names only.

## The 2030 Product Development Manager lens

- **You decide:** what an agent may touch, who approves, and when a release goes.
- **You delegate to agents:** drafting records, listing connections, preparing release notes, running the deployment you approved.
- **A sample brief:** "Prepare release notes for v0.4.1 from the merged merge requests. List each change with its link. Do not publish."
- **You verify by:** checking the deployed version and reading the validation evidence.
- **Disciplines involved:** design, research, engineering, operations, security and legal.
- **On the agent ladder:** this layer is where you **delegate** and **orchestrate**: several agents, each with a scope, and one person accountable. It is also where **govern** becomes concrete.

## Further learning

Next: the [Tech layer](/library/catalogue-tech-layer). Read about [GitOps and drift](/library/deck-14-gitops-iac-and-drift) and the [change record](/library/template-change-record).
