---
title: "Compute, storage and networking"
description: "The building blocks every cloud offers, what each is for, how AWS, Azure and Google Cloud name them, and the questions that expose a weak design."
section: "Cloud platforms"
order: 2
track: "cloud-platforms"
level: "foundation"
duration: "90 min"
outcomes:
  - "Describe compute, storage, databases and networking and choose among the options"
  - "Match the common services across AWS, Azure and Google Cloud"
  - "Read a network picture and spot an exposed database"
  - "Direct an agent to draft a design and verify its choices"
prerequisites:
  - "the-way-five-rules"
resources:
  - "aws/getting-started"
  - "microsoft/describe-azure-architecture-and-services"
  - "google-cloud/training-resources"
  - "youtube-freecodecamp/aws-certified-cloud-practitioner-clf-c02"
  - "twelve-factor/the-twelve-factor-app"
updated: 2026-11-03
---

Lesson 2 of the Cloud platforms track. It supports the Master Developer module on infrastructure. Lesson 1 should come first.

## 1. Why this matters

Cloud catalogues are huge, but the problems are few. Your product needs somewhere to run code, somewhere to keep files, somewhere to keep structured records, and a way for people and parts to reach each other. Every provider sells those four things under different names.

If you learn the four, you can read an agent's proposal on any platform, and notice when it picked an expensive, risky or needlessly complicated option. This lesson is a map, not a manual.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| How much control versus effort is right, what must be backed up, what may touch the internet | Choosing and configuring services, drafting diagrams, writing setup code | Reading the design with the four-block lens, checking exposure, asking for a failure story | Security (exposure), operations (running it), data (what is stored), finance (what each block costs), architecture (fit with the rest) |

## 2. Key ideas, explained

### Block one: compute

**Compute** is where your code runs. The options form a ladder from more control to less work.

| Option | What it is | You manage | Good when |
|---|---|---|---|
| **Virtual machine** | A whole rented computer | OS, patches, scaling, software | You need full control, or legacy software |
| **Containers** | Your app packed as an image (see CI/CD lesson 2), run by a service | The image, the settings | Most modern services |
| **Container orchestration** | A system, usually Kubernetes, that runs many containers | A lot, unless fully managed | Large or complex systems |
| **Serverless functions** | Small pieces of code run only when called | Just the code | Event-driven or spiky workloads |
| **Platform services** | You hand over code, the platform runs it | Code and settings | Small web apps and APIs |

Rule of thumb for a young product: start as far down the table as the product allows, because everything you manage you must secure and patch. Move up only for a reason you can write down. The Twelve-Factor App ([12factor.net](https://12factor.net/)) lists habits that make an app easy to run in any of these: configuration in the environment, logs to standard output, disposable processes.

### Block two: storage

There are three shapes of storage, and picking the wrong one is a common agent mistake.

| Shape | Holds | Behaves like | Typical use |
|---|---|---|---|
| **Object storage** | Files of any size, such as images, backups, site files | A huge filing cabinet with web addresses | Website assets, uploads, backups |
| **Block storage** | A disk attached to a machine | A hard drive | A virtual machine's disk |
| **File storage** | A shared folder many machines can open | A network drive | Shared files for several servers |

Object storage is the one most products use first. It is also where the famous breaches happen: a bucket set to "public" that held private files. Always ask: **is this storage private, and who can read it?**

### Block three: databases

A **database** holds structured records and lets you search them. Two families.

| Family | How it thinks | Good for |
|---|---|---|
| **Relational (SQL)** | Tables with rows and columns, linked by keys, strict structure | Orders, accounts, money, anything where consistency matters |
| **Non-relational (NoSQL)** | Flexible documents, key-value pairs, or other shapes | Very high scale, flexible data, caches |

Most products start with a relational database. Providers sell **managed** databases: they handle backups, patching and failover. A managed database is nearly always better than one an agent installs on a virtual machine, because the work you avoid is the work that gets forgotten. Ask three things of any database: **who can connect, how is it backed up, and has anyone ever tested restoring it?** A backup that was never restored is a hope.

### Block four: networking

A **network** decides who can talk to whom. Key parts:

- **Virtual network** (a VPC on AWS and Google Cloud, a virtual network on Azure): your own private space in the cloud. Parts inside can talk freely; the outside cannot, unless you say so.
- **Subnet**: a section of the network. A common split is **public** subnets (reachable from the internet, for load balancers) and **private** subnets (not reachable, for databases and internal services).
- **Firewall rules / security groups**: lists of what traffic is allowed in and out. "Allow from anywhere" is written as `0.0.0.0/0`. Seeing that on a database port is a red flag.
- **Load balancer**: spreads incoming requests across copies of a service, and checks that each is healthy.
- **DNS**: turns names like `trailmug.example` into addresses.
- **CDN** (content delivery network): keeps copies of static files near users for speed.
- **Gateway / private connection**: how your private network reaches the internet or your office, and how you reach provider services without crossing the public internet.

The mental picture: **the internet touches as little as possible.** The load balancer and the CDN face outward. Everything else sits behind them. The most useful question you can ask is "what is directly reachable from the internet, and why?"

### Names across the three providers

These are the closest equivalents. They are not identical. Treat the table as a translation aid, then read the provider's page.

| Building block | AWS | Azure | Google Cloud |
|---|---|---|---|
| Virtual machine | EC2 | Virtual Machines | Compute Engine |
| Serverless function | Lambda | Functions | Cloud Run functions |
| Run a container | ECS, Fargate | Container Apps | Cloud Run |
| Managed Kubernetes | EKS | AKS | GKE |
| Object storage | S3 | Blob Storage | Cloud Storage |
| Managed relational database | RDS | Azure SQL Database, Database for PostgreSQL | Cloud SQL |
| Virtual network | VPC | Virtual Network | VPC |
| Load balancer | Elastic Load Balancing | Load Balancer, Application Gateway | Cloud Load Balancing |
| DNS | Route 53 | Azure DNS | Cloud DNS |
| CDN | CloudFront | Front Door / CDN | Cloud CDN |

Product names change often, so check the provider's own pages before you rely on one. Each provider has free beginner material: AWS [Getting started](https://aws.amazon.com/getting-started/), Microsoft's learning path [Describe Azure architecture and services](https://learn.microsoft.com/en-us/training/paths/azure-fundamentals-describe-azure-architecture-services/), and the Google Cloud [training resources](https://cloud.google.com/learn/training). If you like to learn from video, the long freeCodeCamp course [AWS Certified Cloud Practitioner](https://www.youtube.com/watch?v=NhDYbskXRgc) is a thorough, free walk through the AWS version of everything above. You do not need to sit the exam.

### A failure story for each block

Ask the agent to tell you a failure story for each block in your design: "If this fails, what happens to the customer, and how do we recover?" If it cannot tell a clear story, the design is not ready.

| Block | Failure story to ask for |
|---|---|
| Compute | One copy crashes. Does a second take over? |
| Storage | A file is deleted by mistake. Can we get it back? |
| Database | The zone fails. Is there a copy elsewhere, and how fast? |
| Network | A firewall rule is wrong. Who is exposed? |

## 3. Step by step: review a four-block design

1. **Get a design** from an agent, with each of the four blocks named.
2. **Compute:** which option, and why is it as managed as it can be?
3. **Storage:** which shape, and is each store private? Who can read, who can write?
4. **Database:** managed? Who can connect? Backups, and a restore test?
5. **Network:** draw what faces the internet. Everything else should be private.
6. **Firewall rules:** look for `0.0.0.0/0` on anything other than the load balancer or CDN.
7. **Ask the failure stories.**
8. **Check the equivalents:** ask how the same design looks on one other provider. Differences reveal assumptions.
9. **Record decisions** in git.

## 4. Worked example: TrailMug

Maya asks for a design for the sign-up service. The agent's second draft: static site files in object storage behind a CDN; a serverless function for the sign-up form; a managed PostgreSQL database in a private subnet; a firewall that allows the function to connect to the database and nothing else.

She goes through the steps. **Compute** is serverless: she likes it, as it means no machine to patch. **Storage:** the site bucket is public for reading, which is correct for a public website, but the same bucket also holds a folder `exports/` for customer lists. She rejects that: one private bucket for exports, separate from the site files. **Database:** managed, with daily backups, and the agent had not mentioned restores. She adds a requirement: "Restore the latest backup into a scratch database once before launch, and note the time it took." **Network:** the database is private. The firewall allows only the function's network on the database port. She checks the rule text herself and finds no `0.0.0.0/0` except the CDN.

For the failure stories, the agent says the function platform restarts failed calls automatically; the database has a standby only if she buys it, and she decides not to before launch. She writes that in the decision record with a date to revisit.

Finally she asks: "How would this look on Azure?" The agent names the equivalents and notes that one serverless limit differs. Maya now knows which parts are portable (the code, the SQL) and which are tied to the platform (the function wrapper and the CDN rules). That goes into Lesson 4's lock-in note.

## 5. Working with AI agents on this

**What the PDM decides:** how much to manage yourself, what must be private, how much downtime and data loss is acceptable, which restore times you need.

**Delegate:** choosing among services, drawing the picture as text, translating names between providers, writing the setup as code (see the Infrastructure as code track), explaining a firewall rule.

**Verify:** run the six-line review in section 3 yourself. Ask for the failure stories. Check every rule that says "allow from anywhere". Ask for a restore test for any data you cannot recreate.

**Prompt for a four-block review:**

```text
Review this design. For each of compute, storage, database and network, state:
what option was chosen, the more-managed alternative, who can reach it from the
internet, and what the failure story is. List every firewall rule that allows
traffic from anywhere. List anything that is public. Do not change the design;
only report, and mark what you are unsure about.
<paste design>
```

**Prompt for a cross-provider translation:**

```text
Translate each component of this design to its closest equivalent on <provider>.
Note where behaviour, limits or pricing models differ in ways that affect the
design. Say where you are not sure. Do not create any resources.
```

**Disclose** the agent's role in the design and which checks you ran yourself.

## 6. Common mistakes and how to avoid them

- **A database reachable from the internet.** Fix: private subnet, narrow rule.
- **Public storage holding private files.** Fix: separate stores, private by default.
- **Running your own database on a virtual machine.** Fix: managed service.
- **Backups never restored.** Fix: a restore test, timed.
- **One giant machine instead of small parts.** Fix: ask for the failure story.
- **Choosing a service because the agent knows it best.** Fix: ask for alternatives and reasons.
- **No design in git.** Fix: the design is a file in the repository.

## 7. Practice

**Deliverable in git:** `specs/cloud-02.md`, `briefs/cloud-02.md`, `reviews/cloud-02.md`.

1. Take the design from Lesson 1, or a new one.
2. Write a spec for a four-block design with at least six acceptance criteria: each block named, private by default, no rule allowing traffic from anywhere except the load balancer or CDN, backups with a restore test, a failure story per block.
3. Brief an agent to produce the design and the translation to one other provider. Plan first, and do not create resources.
4. Verify with the section 3 steps. Record each finding.
5. Record one thing you rejected and why.
6. Write the decision record, including what you would revisit before launch.
7. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] I can name the four blocks and the options in each.
- [ ] Every store and database is private unless there is a reason.
- [ ] No rule allows traffic from anywhere except the front door.
- [ ] Backups exist and a restore has been tested.
- [ ] I read a failure story for each block.
- [ ] I know which parts of the design are portable.
- [ ] The design is in git.

## 9. Further learning

Pick the provider that fits your situation and work through its beginner path, using the others' names as a translation aid. The Twelve-Factor App is short and worth reading to understand what makes an app easy to run in any of these. The freeCodeCamp video is good if you prefer a long guided tour.
