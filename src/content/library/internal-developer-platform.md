---
title: "The developer platform"
description: "The shared ground under every product, explained by the job each part does."
section: "Master Developer"
order: 2
---

An **internal developer platform** is the shared set of tools and rules that every product team uses to plan, build, test, ship and run software. A good platform gives every team a **golden path**: the easy, safe, standard way to get from idea to production.

This page teaches the idea by category. Your own platform may use different tools for each job.

## The parts and their jobs

| Job | Question it answers | Typical kind of tool |
|---|---|---|
| **Map of everything** | What exists, who owns it, what depends on what? | A catalogue or configuration database |
| **Search** | Where is the code or document I need? | A code and document search tool |
| **Plan, source and build** | Where do plans, code and pipelines live? | A git host with issues and pipelines |
| **Update proposals** | Which dependencies are out of date? | A dependency-update bot |
| **Container registry** | Where do built images live, safely signed and scanned? | A container registry |
| **Security findings tracker** | Where do scanner results from many tools come together? | A findings management tool |
| **Delivery from git** | How does what is in git reach the running system? | A GitOps controller |
| **The pipeline that proves it** | Which checks must pass before anything ships? | A standard pipeline template |
| **Identity** | Who are you? | A single sign-on service |
| **Private access** | How do staff reach internal tools without opening them to the world? | A zero-trust network layer |
| **Data** | Where do databases live, with backups? | A database operator and storage layer |

## How the pieces connect

```text
idea -> issue -> branch -> merge request -> pipeline (tests, scans, licence check)
     -> merge -> image in registry -> GitOps controller deploys from git
     -> monitoring -> catalogue stays true
```

Everything is declared in git. The running system is a copy of what git says.

## One change, followed through

1. A person opens an issue in the planning repo.
2. An agent builds it on a branch and opens a merge request.
3. The pipeline runs tests and scans. A failed check blocks the merge.
4. A human approves. The merge happens.
5. The pipeline builds an image and stores it in the registry.
6. The GitOps controller sees the new version in git and rolls it out.
7. Someone checks that it works. The issue closes.

## Role map: classic enterprise tools

Large companies buy tools for broad jobs. Learn each job, then see how a small team can do it in git.

| Classic tool | Job | Git-based way |
|---|---|---|
| IT service management suite | Tickets, changes, catalogue | Issues, merge requests, catalogue files in git |
| ITIL practices | A common language for service management | See [Service management in git](/library/itil-in-git) |
| ERP | Finance, HR, procurement, inventory | A separate system. Not replaced by git. |
| Developer portal | One web page for all services | A catalogue file plus a generated page. Weigh the cost of running one more product. |

**Why not always adopt a portal?** A portal is one more product to run. It needs plugins, upgrades and a second copy of the catalogue. Choose it only when the benefit is clear. Use the OSS-first ladder to decide.

## Questions to ask about any platform part

- Who owns it?
- Is it built, partial or planned?
- What happens when it is down?
- How is it upgraded?
- Where is its configuration? (It should be in git.)

## Key points

- A platform is jobs, not brand names.
- A golden path makes the safe way the easy way.
- Everything is declared in git, and the running system follows it.
