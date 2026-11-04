---
title: "Observability and service management"
description: "See what your product is doing, promise a level of service you can keep, respond well when it breaks, learn from it, and change it safely, with agents doing the legwork."
group: "engineering"
order: 7
icon: "activity"
level: "core"
skills: [observability-reliability, itsm-service-management]
outcomes:
  - "Explain logs, metrics and traces, and ask what a team can and cannot see in production"
  - "Set a service level objective, read an error budget and decide what it means for the roadmap"
  - "Run the first hour of an incident with clear roles, and direct agents to gather evidence without letting them act unsupervised"
  - "Write a blameless review that ends in a gate, and record changes and services so that anyone can find the owner and the rules"
---

## In short

This track is for people who are responsible for something that real people use. Software needs care after it ships. Observability means you can see what a running system is doing. You will learn what logs, metrics and traces show. You will turn a customer promise into a service level objective. You will read the error budget and decide what it means for your roadmap.

You will run the first hour of an incident with clear roles. You will write a blameless review. It ends in a gate, a test or a rule. You will keep a record of each service, its owner and its changes. Agents can gather evidence for you. They must not act alone. A person decides.

### Key words

- **Observability:** Being able to see from the outside what a running system is doing.
- **Service level (SLI, SLO, SLA):** An indicator you measure, an objective you aim for, and an agreement you promise.
- **Error budget:** The amount of failure a service-level target allows.
- **Incident:** An unplanned break or drop in quality of a service.
- **Blameless review:** A review after an incident that asks what failed, not who failed. It ends in a gate, a test, a check or a rule.

Software is not finished when it ships. It runs, it breaks, people depend on it, and someone has to notice, respond, learn and change it again. **Observability** is the ability to see from the outside what a running system is doing. **Service management** is the set of habits that decide who owns a service, what is promised, how requests and changes are handled, and what happens when things go wrong.

For a product manager directing AI agents this is where the rest of the engineering tracks come together. Agents can ship changes quickly. Whether that is a good thing depends on whether you can see the effect, whether you have promised a level of service you can keep, and whether a bad change can be found and fixed forward fast.

This track gives you **enough depth to direct and judge**. You will not run a monitoring stack. You will learn what to ask for, how to read what comes back, and how to keep people and agents inside clear limits when something is on fire.

## Who this is for

Product managers, founders and developers who are responsible for something that real people use. You should know what a pipeline and a deployment are. If not, start with [CI/CD](/library/tracks/ci-cd) and [Kubernetes and GitOps](/library/tracks/kubernetes-and-gitops).

## What you will be able to do

- Say what logs, metrics and traces each show, and spot a blind spot in what your team can see.
- Turn a customer promise into a **service level objective**, work out the error budget and use it to choose between new features and reliability work.
- Write an alert that is worth waking someone for, and one that is not.
- Run the first hour of an incident: roles, communication, stopping the harm, and recording what happened.
- Write a blameless review that produces a gate, a test, a check or a rule, not just a lesson.
- Keep a catalogue entry and a change record that make ownership, promises and changes visible.
- Direct an agent to gather evidence, summarise a timeline or draft a review, and verify what it reports.

## The five lessons

1. **Logs, metrics and traces.** What each signal shows, what to ask for, and the questions that find blind spots. You learn what an agent can read safely and what it should not.
2. **Service levels and error budgets.** Turning "it should be fast and available" into numbers you can keep, and using the budget to make decisions. This lesson ties directly to the service levels in the Catalogue Entry template (`/library/template-catalogue-entry`).
3. **Alerting and incident response.** How to wake the right person for the right reason, and how to run the first hour. Agents help gather evidence, under limits.
4. **Blameless reviews and learning.** Writing the review so that it changes something, and measuring whether it did.
5. **Service management and change.** Services, owners, requests, changes and risk, as a lightweight practice. This lesson ties to the Change Record template (`/library/template-change-record`) and shows how pipeline, plan and approval together form the record.

Each lesson has a table for the product development manager: what you decide, delegate, verify and which other disciplines own the detail. Each ends with an exercise in which you direct an agent and then verify its work, with your spec, brief and review notes in git.

## Why this matters now

When agents write and change code faster, the volume of change goes up, and the cost of not seeing the effect goes up with it. Three habits keep that safe. See the effect quickly, with signals tied to what customers experience. Decide in advance how much unreliability you will accept, so that a rush of change slows down when the budget is spent. And respond to trouble by fixing forward, with a clear owner and a record, not by guessing.

Agents can help in every step. They can read logs and summarise a timeline in seconds, draft an alert rule, assemble a review from the record. The risks are the ones from the Security fundamentals track. Logs are untrusted text, an agent given operational permissions can do harm quickly, and its confident summary of an incident may be wrong. The remedy is the same: limits enforced by the platform, evidence you can check, and a person who decides.

## How this fits the program

The Master Developer program asks every service to have an owner, a runbook, stated service levels and a change record, and every incident to end with a review and a gate. This track teaches the reasoning behind each of those, and gives the vocabulary to ask for them. Advanced readers who want to coordinate many agents across operations, with decision rights written as data, continue to `/library/tracks/agent-orchestration`.

## Staying within bounds

The lessons draw on free public sources: the Google Site Reliability Engineering books, the OpenTelemetry and Prometheus projects, the DORA research, and the incident and service management guides from several vendors. They teach general practice. They do not promise any outcome, and they do not claim that following them makes a service meet any legal or contractual obligation. Where those matter, involve the people who own them.

## Time and order

Plan about eight hours. Lessons 1 and 2 come first. Lessons 3 and 4 follow in order. Lesson 5 can be read at any time after lesson 2.
