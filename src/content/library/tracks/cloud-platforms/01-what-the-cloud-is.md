---
title: "What the cloud is"
description: "Cloud computing in plain words: the service models, regions and zones, the shared responsibility model, and the first questions to ask of any cloud design."
section: "Cloud platforms"
order: 1
track: "cloud-platforms"
level: "foundation"
duration: "75 min"
outcomes:
  - "Define cloud computing and its five defining traits"
  - "Tell infrastructure, platform and software as a service apart, with examples"
  - "Explain regions and availability zones and why location is a business decision"
  - "State who secures what under the shared responsibility model"
prerequisites:
  - "the-way-five-rules"
resources:
  - "nist/the-nist-definition-of-cloud-computing"
  - "google-cloud/what-is-cloud-computing"
  - "aws/overview-of-amazon-web-services"
  - "microsoft/describe-cloud-concepts"
  - "aws/shared-responsibility-model"
  - "microsoft/shared-responsibility-in-the-cloud"
  - "google-cloud/geography-and-regions"
updated: 2026-11-03
---

Lesson 1 of the Cloud platforms track. It supports the Master Developer module on infrastructure and the delivery spine stage "deployment". No earlier cloud knowledge is needed.

## 1. Why this matters

When an agent says "I will deploy this to the cloud", it is making a dozen choices for you: where in the world, which service, who can reach it, who can change it, and what it costs each month. Most of those choices are invisible unless you know what to ask. A product manager who cannot read a cloud design is trusting the agent, and the agent is trusting its guess about what you wanted.

You do not need to learn every service. You need the few ideas that every cloud shares, so that you can read any proposal and ask the questions that matter.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Where customer data may live, what level of service is needed, which provider and region, what risk is acceptable | Drafting a design, listing the services needed, comparing options, writing the first infrastructure code | Reading the design against a short question list, checking the region and the access, asking a specialist to review anything with customer data | Security (who can reach what), legal (data location, contracts), finance (what it costs), operations (who runs it), customer success (what outages feel like) |

## 2. Key ideas, explained

### What "cloud" means

The US standards body NIST wrote the definition most people use, in its publication [The NIST Definition of Cloud Computing](https://csrc.nist.gov/pubs/sp/800/145/final). It lists five traits:

| Trait | Plain words |
|---|---|
| **On-demand self-service** | You get what you need yourself, without phoning anyone |
| **Broad network access** | You reach it over the internet from anywhere |
| **Resource pooling** | Many customers share a large pool of machines, kept apart from each other |
| **Rapid elasticity** | You can grow and shrink quickly |
| **Measured service** | You pay for what you use, and it is metered |

Google Cloud's page [What is cloud computing?](https://cloud.google.com/learn/what-is-cloud-computing) says the same thing in friendlier words. The key shift: instead of buying machines, you **rent capacity by the hour or by the request**. That is why a mistake can cost money by the hour, too.

### Three service models

| Model | You manage | The provider manages | Everyday example |
|---|---|---|---|
| **IaaS**, infrastructure as a service | The operating system, the software, the data | The building, the hardware, the network, the virtualisation | Renting a virtual machine |
| **PaaS**, platform as a service | Your code and your data | Everything under it, including the operating system and scaling | A service that runs your web app from code, or a managed database |
| **SaaS**, software as a service | Your settings and your data | The whole application | Email, a project tracker, a design tool |

More managed means less work for you and less control. A good default for a small product is the most managed option that meets your needs, because every layer you manage is a layer you must patch and secure. A related idea is **serverless**: you give the provider a function or a container and it runs it only when needed. There are still servers; you just do not look after them.

### Deployment models

A **public cloud** shares provider infrastructure among many customers (AWS, Azure, Google Cloud). A **private cloud** runs on infrastructure for one organisation. A **hybrid** setup mixes them. A **multi-cloud** setup uses more than one provider. For a young product, one public cloud is almost always right. Multi-cloud adds cost and complexity, and Lesson 4 returns to why.

### Regions and availability zones

A **region** is a geographic area where a provider runs data centres, such as "Ireland" or "Iowa". Each region has several **availability zones**: separate groups of data centres with their own power and cooling, close enough to work together. Spreading a service across zones keeps it running if one zone fails. The providers explain this in their own words: Google's [Geography and regions](https://docs.cloud.google.com/docs/geography-and-regions) and, for Azure, [What are availability zones?](https://learn.microsoft.com/en-us/azure/reliability/availability-zones-overview).

Why it is a business decision, not a detail:

- **Law and contracts.** Some customers and some laws require data to stay in a country or region. Choose with your legal lead, not by default.
- **Speed.** A region near your users gives a faster product.
- **Reliability.** More zones means better protection against local failure, at some cost.
- **Cost.** Prices differ by region, and not every service exists in every region.
- **Carbon.** Providers publish information about the energy mix of regions; if this matters to your customers, ask.

An agent that does not know your rules will pick the default region, often one in the United States. Tell it the region and the reason in the brief.

### The shared responsibility model

This is the most important idea in the lesson. The provider secures **the cloud**: the buildings, the hardware, the core network. You secure **what you put in the cloud**: your data, your settings, who can log in, your code. The line moves with the service model. In IaaS you also patch the operating system. In SaaS you mostly manage access and data. Read each provider's explanation: [AWS shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/) and Microsoft's [Shared responsibility in the cloud](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility).

Almost all real cloud breaches come from the customer's side of the line: a storage bucket left public, a password on an account with no second factor, a key committed to code. The provider's data centre did not fail. A setting did. This is why the questions you learn here matter.

### The three providers, in one paragraph each

You do not need a favourite. Each has free introductory training.

- **AWS** (Amazon Web Services) is the oldest and largest. Its [Overview of Amazon Web Services](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html) is a plain map of its services.
- **Microsoft Azure** integrates closely with Microsoft's business tools and identity system. Its learning path [Describe cloud concepts](https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/) is free.
- **Google Cloud** is strong in data and AI tools and in containers. It shares learning at its [training page](https://cloud.google.com/learn/training).

### The questions that work on any design

Keep this list. You will use it for every lesson in this track.

| Question | Why |
|---|---|
| Which region, and who decided? | Law, speed, cost |
| Which service model is each part? | Tells you what you must patch |
| Who can reach it from the internet? | The main security question |
| Who can change it, and with what credentials? | Lesson 3 |
| What happens if one zone fails? | Reliability |
| What will it cost at 1x and at 10x? | Lesson 4 |
| Where is it written down in git? | The Way: git is the source of truth |

## 3. Step by step: read a cloud design

1. **Ask an agent for a design** of a small product, in plain words, with a diagram in text.
2. **List every component** and mark it IaaS, PaaS, SaaS or serverless.
3. **Mark the region** of each. If none is stated, that is your first question.
4. **Mark anything reachable from the internet.** For each, ask why.
5. **Mark where customer data lives.** Is it encrypted, backed up, and in an allowed region?
6. **Mark who can change it.**
7. **Apply the question list.** Write answers or "unknown".
8. **Ask for a revision** that fixes the unknowns.
9. **Ask one specialist** (security or operations) to review anything with customer data.
10. **Write the decisions** in a decision record in git.

## 4. Worked example: TrailMug

Maya wants TrailMug's sign-up service online. She briefs an agent: "Propose a small, cheap design for a static website plus a sign-up service that stores café owner contact details. Use plain words, mark each part as IaaS, PaaS, SaaS or serverless, and name a region. Do not write any code yet."

The agent proposes: a static site on a storage-and-delivery service, a small serverless function for sign-up, a managed database, all in one US region. Maya applies the questions.

- **Region.** She has interviewed café owners in the UK, Ireland and Canada. Their contact details are personal data. She asks her legal contact, who advises keeping UK and EU data in a UK or EU region unless a contract says otherwise. She tells the agent: "UK or Ireland region. Reason: personal data of UK and Irish customers."
- **Internet reach.** The site and the sign-up function are public, by design. The database is not, and the agent had set it to accept connections from anywhere "for easy testing". She rejects that.
- **Zones.** The database was in one zone. For a pre-launch product she accepts that, writing "single zone for now, revisit before launch" in the decision record.
- **Change access.** The agent assumed it would use her administrator login. Lesson 3 covers why that is wrong.

She records four decisions in `decisions/D-04-cloud-design.md` using the [decision record template](/library/template-decision-record), including what she knew and did not know. The revised design goes into a merge request, with the AI use disclosed.

## 5. Working with AI agents on this

**What the PDM decides:** region and the reason, the level of service, how much downtime is acceptable, which provider.

**Delegate:** drafting designs, listing services, explaining unfamiliar service names, comparing the same building block across providers, drafting the decision record from your notes.

**Verify:** run the question list yourself. Ask the agent for **what it does not know** and **what it assumed**. Ask a security reviewer to check anything that holds customer data.

**Prompt for a design draft:**

```text
Propose a minimal cloud design for <product> on <provider>. Use plain words.
For each component say: what it does, the service model (IaaS, PaaS, SaaS or
serverless), the region, whether it is reachable from the internet, and where
customer data is stored. State every assumption. Do not write code and do not
create any resources. Region rule: <your rule and reason>.
```

**Prompt to explain a service name:**

```text
Explain the cloud service "<name>" to a product manager in five lines: what it
is for, the nearest equivalents on the other two big providers, what can go wrong
when it is set up badly, and what drives its cost. Say if you are unsure.
```

**Disclose** AI help in the merge request that holds the design, and write which parts you checked yourself.

## 6. Common mistakes and how to avoid them

- **Accepting the default region.** Fix: choose and record a region with its reason.
- **Assuming the provider secures everything.** Fix: learn your side of the line.
- **Public by default.** Fix: ask who can reach each part, and why.
- **Running servers you did not need to run.** Fix: prefer the most managed option that fits.
- **Going multi-cloud early.** Fix: one provider until a real reason appears.
- **Trusting a diagram nobody wrote in git.** Fix: designs live in the repository.
- **Letting an agent create resources while you are only "discussing".** Fix: say "do not create resources" and enforce it with access (Lesson 3).

## 7. Practice

**Deliverable in git:** `specs/cloud-01.md`, `briefs/cloud-01.md`, `reviews/cloud-01.md` and a decision record `decisions/D-cloud-design.md`.

1. Choose a small product idea of your own, or use TrailMug.
2. Write a spec for a design proposal with at least five acceptance criteria: every component labelled with its service model, a named region with a reason, internet reach marked, data location marked, assumptions listed.
3. Brief an agent to produce the design without creating anything. Plan first.
4. Verify with the question list. Record each answer, or "unknown", in `reviews/cloud-01.md`.
5. Ask for a revision that resolves the unknowns. Record what you changed and why.
6. Write the decision record, including what would make you revisit it.
7. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] I can define cloud computing and name the three service models.
- [ ] I know what region and availability zone mean and chose a region on purpose.
- [ ] I can say which side of the shared responsibility line each component sits on.
- [ ] Each internet-facing part has a reason.
- [ ] My assumptions and unknowns are listed.
- [ ] The decision record is in git.

## 9. Further learning

Start with the NIST definition, which is short, then read one provider's plain-language overview. If you want structure, take the free Azure fundamentals path on cloud concepts, whichever provider you end up using; the ideas carry over. The two shared responsibility pages are worth reading in full. The Google Cloud geography page is a good short read on regions.
