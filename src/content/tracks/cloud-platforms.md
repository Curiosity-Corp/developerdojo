---
title: "Cloud platforms"
description: "AWS, Azure and Google Cloud explained without vendor loyalty: the building blocks, identity, cost and reliability, so you can direct agents that build there and judge what they build."
group: "engineering"
order: 3
icon: "cloud"
level: "foundation"
skills: [cloud-platforms, security]
outcomes:
  - "Explain cloud computing, the service models and the shared responsibility model in plain words"
  - "Name the building blocks (compute, storage, network, identity) and their equivalents on AWS, Azure and Google Cloud"
  - "Ask the right access, cost and reliability questions of any cloud design an agent proposes"
  - "Choose a region and a provider for a product with reasons you can defend"
---

Almost every product you will direct runs on someone else's computers. Those computers belong to a **cloud platform**, and three companies run most of them: Amazon Web Services (AWS), Microsoft Azure and Google Cloud. They sell hundreds of services under hundreds of names. An agent can use any of them in seconds, which is exactly why you need a map.

This track gives you the map. It does not train you to be a cloud engineer. It gives you **enough depth to direct and judge**: to read a proposed design, notice that the database is open to the whole internet, ask what it will cost at ten times the traffic, and know which question to put to which colleague.

## Who this is for

Product managers, founders and developers who will ask agents to build and run things in the cloud. You do not need any cloud experience. Lessons on Git, GitLab and CI/CD help but are not required; the track [Git and GitLab](/library/tracks/git-and-gitlab) is the best companion.

## What you will be able to do

- Define cloud computing the way NIST does, and explain infrastructure, platform and software as a service with an example of each.
- Explain regions and availability zones, and say why where your data lives is a business and legal decision.
- Explain the shared responsibility model: what the provider secures, what you must still secure.
- Match the common building blocks across the three providers, so a name on one platform is not a mystery.
- Explain identity and access management, least privilege and why an agent should never hold a powerful long-lived key.
- Read a cost model, name what drives a bill, and use the idea of FinOps without becoming an accountant.
- Compare providers and weigh lock-in without taking a side.

## The four lessons

| # | Lesson | What you learn |
|---|---|---|
| 1 | What the cloud is | Service models, regions, zones, shared responsibility |
| 2 | Compute, storage and networking | The building blocks and how the three providers name them |
| 3 | Identity and access | Who can do what, least privilege, and what an agent may hold |
| 4 | Cost, reliability and choosing a provider | Bills, well-architected thinking, lock-in, and a decision record |

## How it maps to the program

The Master Developer program asks you to keep infrastructure in git and to treat production as something changed only through reviewed merge requests. See [Everything as code, GitOps and drift](/library/iac-gitops-and-drift). This track teaches what that infrastructure is made of. The Infrastructure as code track shows how to write it down, and Security fundamentals goes deeper on defence.

## Vendor neutral

Each lesson uses the same ideas across AWS, Azure and Google Cloud, and links to each provider's own free learning. Names differ, concepts are the same. When a feature differs in a way that matters, the lesson says so. Free tiers and prices change often, so lessons tell you where to look and never quote a price.

## The running example

TrailMug, the fictional reusable-cup product, needs a small website, a sign-up service and a place to keep customer records. Maya decides where it runs and what each choice costs, and directs agents to build it. Ravi, an invented colleague, reviews. All people and numbers are invented.

## Time needed

About 75 to 90 minutes per lesson, so six hours for the track. Each exercise ends with your spec, your agent brief and your review notes in git. Use free tiers or free accounts for any hands-on work, set a budget alert first, and never enter real customer data.

## A word on honesty

Cloud providers want you to use more of their services. Their training is good, and it is also marketing. We link to it because it is free and accurate about how their products work, and we teach you to ask the questions the sales page leaves out.

## Pair it with

[CI/CD](/library/tracks/ci-cd) so that changes arrive through a pipeline, Infrastructure as code to write the design down, and Observability and service management to know it is working.
