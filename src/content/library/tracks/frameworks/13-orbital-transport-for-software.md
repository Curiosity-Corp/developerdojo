---
title: "ORBITAL: transport for software"
description: "Transport is how goods, data, energy and value move from A to B. For a software product that means interfaces, data flows, files, releases and, often, physical things too. Learn to map them, choose a mode and judge what an agent proposes."
section: "Frameworks"
order: 13
track: "frameworks"
level: "core"
duration: "65 min"
outcomes:
  - "Explain the Transport element of ORBITAL and give examples for software and for physical goods"
  - "Draw a transport map of a product: what moves, from where to where, by which mode, how often and with what risk"
  - "Choose a mode of transport (for data: a request, an event, a file or a batch) and write the reason in a decision record"
  - "Write an interface contract and brief an agent to implement it, then check the result"
resources:
  - "twelve-factor/the-twelve-factor-app"
  - "google-cloud/api-design-guide"
  - "microsoft/rest-api-guidelines"
  - "openapi-initiative/learn-openapi"
  - "adr/architectural-decision-records"
  - "green-software-foundation/learn-green-software"
prerequisites:
  - "11-orbital-objective-resources-budget"
  - "09-star-in-daily-work"
updated: 2026-11-03
---

This is lesson 13, the third of six about ORBITAL. It supports **Developer weeks 2 to 4** (interfaces, delivery, architecture decisions) and links to the technology lessons in the PHANTOMS family of stacks.

## 1. Why this matters

Most plans describe *what* will be made and forget *how things get from one place to another*. A cup has to travel from a washing site to a café. An order has to travel from a phone to a database. A new version of the app has to travel from a laptop to the customers. When these journeys are not planned, things get lost, arrive late or cost more than expected.

In ORBITAL the **T** is for **Transport**. The source material defines it as the system or mode used to transfer **energy, goods or information** from one place to another in an efficient and organised manner. It lists four ideas: logistical planning, choosing the mode, optimising efficiency and managing risk.

The word is borrowed from physical industries, and that is a strength. A Product Development Manager (PDM) works with founders, operations and finance people who think in terms of flows: what moves, how much, how often, how safely, at what cost. Software has flows too, and drawing them on one map lets all those people see the same product.

A PDM does not need to write transport code by hand. They need to know what moves, choose the mode, set the limits and verify what the agents build.

## 2. Key ideas, explained

### What can move

Four things move in a product. Name them separately, because each has its own risks.

| Moves | Examples | Typical risk |
|---|---|---|
| **Goods** | Reusable cups, devices, printed signs | Loss, damage, delay, cost |
| **Information** | Orders, returns, messages, reports | Errors, delay, privacy |
| **Money** | Deposits, fees, payouts | Fraud, mistakes, rules |
| **Energy and compute** | Electricity for servers and washers, cloud hours | Cost, carbon, outage |
| **Code and settings** | A release from a developer to production | Bugs, downtime, security |

The last row is special. **A release is transport.** Moving a new version into a live system is a journey with a start, an end, a mode and a risk. The [Launch Sequence lessons](/library/tracks/frameworks/25-launch-sequence-six-stages/) return to this.

### The transport map

A **transport map** is a table or diagram that shows each flow in the product on one page. For each flow, answer six questions.

| Question | Meaning |
|---|---|
| **What moves?** | The cargo: a return record, a cup, a payment. |
| **From where, to where?** | The two ends. Name the systems or places, and the people responsible. |
| **By which mode?** | The way it moves (see below). |
| **How often and how much?** | Rate and size: ten a day, a batch each night, a peak at 8 am. |
| **What if it fails?** | The failure and the fallback. |
| **What does it cost?** | Money, time or energy. A rough figure is enough. |

### Modes for information

In software the most common transport modes are these. You do not need to build them yourself, but you need to know the difference, so that you can judge a proposal.

| Mode | How it works | Good for | Watch out for |
|---|---|---|---|
| **Request and response** (an API call) | One program asks another and waits for an answer. | Fast answers: "is this café id valid?" | If the other side is down, the caller fails. |
| **Event** | A program announces "a cup was returned", and other programs react later. | Many readers, loose coupling | Harder to follow; events can arrive twice or out of order. |
| **File or batch** | A file is produced and picked up on a schedule. | Large data, partners with old systems | Delay; broken files. |
| **Stream** | A steady flow of small messages. | Live dashboards | Complexity and cost. |
| **Manual step** | A person moves it (a spreadsheet by email). | Early pilots | Mistakes and no record. A pilot may use it, with a plan to replace it. |

An **API** (application programming interface) is a defined way for one program to talk to another. A good API has a written **contract**: what you can ask, what you will get back and which errors may occur. A common format for this contract is **OpenAPI**, a standard file that describes an API so that people and tools can both read it.

### Contracts and decisions

Once you have chosen a mode, write the **interface contract** and a **decision record** (a short file with the context, options, choice and reason, in the style of an architecture decision record). Contracts let different people, or different agents, build the two sides without talking all day. A decision record stops you from re-arguing the same choice in six months.

### Rules of thumb for good transport

Several widely used guides collect lessons about software that travels well. We list three, with links in the resources.

- **The Twelve-Factor App**: twelve rules for apps that are easy to deploy and run in different places. For example, keep settings outside the code, and treat the services you depend on as replaceable.
- **API design guides** from large companies (Google Cloud and Microsoft each publish one): clear names, consistent errors, careful versioning.
- **Green software practice**: moving less data, less often, uses less energy and costs less.

These are guides from specific organisations. Take their ideas, and test them against your product. Do not copy them without thinking.

### Efficiency, risk and cost

The source asks you to optimise and to manage risk. Two plain habits help.

1. **Move less.** Send only what is needed. Do not copy a whole table when one field will do. This also helps privacy: data that does not move cannot leak on the way.
2. **Plan for failure.** For each flow, say what happens when it breaks: retry, queue, alert a person or stop. A flow with no failure plan will fail at the worst moment.

## 3. Step by step: map the transport of a product

1. **List what moves.** Start from the objective and the Activities. For each user journey ask: what travels?
2. **Write one row per flow** in a transport table: cargo, from, to, mode, rate, failure, cost.
3. **Name an owner** for each end of each flow.
4. **Mark the personal data.** Which flows carry data about people? Plan the legal and security checks with a specialist.
5. **Choose the mode** for each flow. Prefer the simplest that works: an API call or a manual step before events and streams.
6. **Write the failure plan** for each flow: retry, queue, alert, stop.
7. **Write the contract** for each interface that crosses a team or system boundary. Use a standard format such as OpenAPI.
8. **Write one decision record** for the most important or least reversible choice.
9. **Add the release path.** How does a change travel from a merge request to real users? Who approves it? What stops a bad release?
10. **Update the other letters.** New equipment goes to Resources and Budget. Failure risks go to Logistics (lesson 14). Contract tasks go to Activities.
11. **Commit** the table to `frameworks/orbital.md` and the contracts to `docs/api/`. Open a merge request.

## 4. Worked example: TrailMug

**Any numbers are invented.**

TrailMug's pilot has physical flows (cups) and information flows (returns, payments), plus the release path of its own app. Maya draws the transport map.

| Flow | Cargo | From to | Mode | Rate | If it fails | Cost note |
|---|---|---|---|---|---|---|
| T1 | Clean cups | Washing partner to café | Van, twice a week (a partner) | 100 cups per drop (planned) | Café keeps a small reserve; Maya phones the partner | The largest running cost |
| T2 | Dirty cups | Café to washing partner | Same van, return leg | Same | Cups wait one more day | Included in T1 |
| T3 | Return record | Café tablet page to the returns service | API request: "record this return" | About 40 a day at peak | The page stores the return and retries; a staff member sees a banner | Free tier at pilot size |
| T4 | Return status | Returns service to the café's page | API request, polled each minute | One read per café per minute | Page shows "last updated at ..." | Low |
| T5 | Deposit refund | Payment provider to customer | The provider's own service, behind an adapter | A few per day | Provider status page; a manual refund by Maya | Provider fees |
| T6 | Weekly summary | Returns table to a report file | Nightly batch | One file per night | An alert to Maya | Negligible |
| T7 | New app version | Maya's merge request to the live site | Pipeline, reviewed merge | A few per week | A failed gate stops the release; a bad release is fixed forward | Pipeline minutes |

Notice three things. T1 and T2 are physical and they are the biggest cost and risk, though the software gets all the attention. T3 has a clear failure plan. T7 is on the map, because a bad release is also a failed delivery.

**One interface contract.** For T3 Maya writes the contract first, in a file `docs/api/returns.yaml`, in the OpenAPI format. Its main points, in plain words: *Send a return with a café id and a cup id. If the café id is missing, you get a clear error that says so. If the same return arrives twice, the second is ignored and you get the same answer.* The last rule matters, because a tablet with a weak connection may send a return twice.

**One decision record.** For T4 she chose polling (the café page asks every minute) over events. Her record says: *Context: eight cafés, so about eight requests a minute. Options: polling, events, live stream. Choice: polling, because it is the simplest to build and to test, and a one-minute delay is acceptable to cafés. Reason to revisit: more than fifty cafés, or a request from cafés for instant updates.* She also notes the energy and cost: eight requests a minute is small.

The transport map also changed Maya's budget. It showed that the washing partner is not a "nice to have". It is the largest flow. She added a second quote request to Activities.

## 5. Working with AI agents on this

| | For Transport |
|---|---|
| **What the PDM decides** | What flows exist. Which mode for each. The failure plan. What data may move and what may not. What is built now and what waits. |
| **What agents do** | Draft the transport table from your journey notes. Draft the OpenAPI file from your written rules. Write the code for both sides of the contract and the tests. Write the decision-record draft. Compare your API with a published design guide and list differences. |
| **How the PDM verifies** | Read the contract and check that every rule you wrote is in it. Run the contract tests. Try the failure cases on purpose (send the same request twice, send a bad id). Read the diff to see what data the code sends and stores. |
| **Who else is involved** | Operations (physical flows), security and privacy specialists, finance (cost), the owners of the systems at each end, partners who consume your API. |

A brief you can adapt:

```text
Context: docs/api/returns.yaml is the contract (mine, do not change it).
frameworks/orbital.md section Transport has the map.
Task: implement the returns endpoint in services/returns/ so that it
satisfies the contract exactly, and write tests for these cases:
valid return, missing café id, wrong café id, duplicate return,
malformed body.
Rules: do not add fields to the contract. Do not log personal data.
Do not add dependencies without listing them under NEW DEPENDENCIES
with a reason. Do not read real keys or settings; use the example file.
Run the tests and paste the output. Put every decision you made that
the contract does not cover under DECISIONS FOR REVIEW.
```

The agent builds. You check that it kept to the contract and did not widen it.

This is also where **orchestration** begins in practice: one session builds the endpoint, a second builds the café page against the same contract and a third writes the contract tests. They only stay compatible if the contract is the shared source of truth, and a **gate** (a pipeline step that fails when code and contract disagree) enforces it. The [agent orchestration track](/library/tracks/agent-orchestration/) shows how to set that up.

Remember: **people write epics and roadmaps; AI never does.** An agent may draft a contract from your rules. It does not decide which flows the product needs.

## 6. Common mistakes and how to avoid them

- **Forgetting physical transport.** If your product moves goods, put them on the map first.
- **Choosing a fashionable mode.** Events and streams are powerful, and also harder to test and to run. Use the simplest mode that fits.
- **No failure plan.** Ask "what happens when this breaks?" for every flow.
- **Contracts written after the code.** Write the contract first so that both sides can be built separately.
- **Moving personal data without a reason.** Send less. Ask a specialist about rules that apply to you.
- **No owner at an end of a flow.** Each end needs a named owner.
- **Skipping the release path.** A release is transport. It needs a gate.
- **Copying a design guide blindly.** Treat it as a source of ideas.

## 7. Practice

**Goal:** draw and defend the transport map of your product, or of TrailMug.

1. Add a **Transport** section to `frameworks/orbital.md`.
2. Write a table with at least five flows: cargo, from, to, mode, rate, failure plan, owner and cost note. Include at least one flow that is not software (a person, a delivery, a manual step) and the release path.
3. Mark which flows carry personal data.
4. Write one interface contract in OpenAPI format for the most important flow, in `docs/api/`.
5. Write one decision record for a mode choice, with options, reason and a condition to revisit.
6. Brief an agent to implement the contract with tests, using the brief above. Review the diff, and write in the merge request what you checked and what you changed.
7. Try two failure cases on purpose (for example a duplicate request and a bad id) and record what happened.
8. Open a merge request.

**Deliverable:** a transport table, one contract, one decision record, an agent-built implementation with your review notes and a failure test record, all in git.

## 8. Checklist

- [ ] My map includes goods, information, money, compute and releases where they apply.
- [ ] Each flow has an owner at both ends.
- [ ] Each flow has a mode, a rate and a failure plan.
- [ ] I marked flows that carry personal data.
- [ ] I wrote the contract before the code.
- [ ] I recorded one transport decision with a reason and a condition to revisit.
- [ ] I tested failure cases and I read the agent's diff.
