---
title: "Deck 10: The internal developer platform"
description: "The platform map in three groups, and one change followed from idea to a running, mapped service, with honest status labels."
section: "Teaching deck"
order: 10
level: core
duration: "90 min"
outcomes:
  - "Describe an internal developer platform and the job of each part, in three groups: know, plan-build-prove, store-scan-deliver."
  - "Follow one change through the platform from epic to a mapped, running service."
  - "Name the two human steps in the path and the machine steps."
  - "Use status labels (Built, Partial, Planned) honestly when you plan work."
resources:
  - gitlab/ci-cd
  - gitlab/merge-requests
  - renovate/docs
  - goharbor/docs
  - defectdojo/docs
  - argo-cd/docs
  - dora/dora
  - cncf/landscape
prerequisites:
  - deck-09-track-a-assessment-and-eight-week-map
  - internal-developer-platform
---

This lesson opens Track B. It covers slides 21 and 22: the **platform map** and the **golden path** of one change. The existing page [The developer platform](/library/internal-developer-platform) explains the idea by category. This lesson follows the deck and adds the status labels and the walk-through.

## Why it matters

A Product Development Manager does not build the platform. A Product Development Manager must know it well enough to ask the right question when something is slow, unsafe or missing. If you do not know where a change goes after the merge, you cannot tell a customer when it will be live, or why it is not.

## Key ideas

### What an internal developer platform is

An **internal developer platform** is the shared ground every product stands on: the set of tools and rules that every team uses to plan, build, test, ship and run software. A good platform has a **golden path**, the easy, safe, standard way from idea to production. The deck's tools are examples. Your company may use different tools for the same jobs.

### The platform map (slide 21)

The slide groups the platform into three parts, from left to right, plus a base under everything.

| Group | Part | Its job |
|---|---|---|
| **KNOW** | A map of everything | A map of entities, owners and links, kept in git |
| **KNOW** | A search tool | Deterministic search over code, documents and the map |
| **PLAN, BUILD, PROVE** | A git host with planning (for example GitLab) | Plan, source and CI: epics, merge requests, pipelines |
| **PLAN, BUILD, PROVE** | An update bot (for example Renovate) | Opens merge requests for dependency and upstream updates |
| **PLAN, BUILD, PROVE** | A standard pipeline | The pipeline that tests, scans, signs and proves it |
| **STORE, SCAN, DELIVER** | A container registry (for example Harbor) | Stores signed images, pulled by digest |
| **STORE, SCAN, DELIVER** | A findings tracker (for example DefectDojo) | Security findings from every scanner in one place |
| **STORE, SCAN, DELIVER** | A GitOps controller (for example Argo CD) | Delivers from git to the cluster and shows drift |
| **Under everything** | Identity, private network, data | Who you are (single sign-on), a private network layer, and where data lives (database operator and storage) |

A **digest** is the unique fingerprint of an image. "Pulled by digest" means the system runs exactly the image that was tested, not "whatever is called latest".

A **cluster** is a group of computers that run the containers for the product. A **container image** is a packaged program with everything it needs to run.

### One change, followed through (slide 22)

The golden path, as the slide draws it:

1. **You** write the epic and create the repos.
2. **Agents** open a merge request (MR) for each issue.
3. **The pipeline** tests, scans and checks policy on the MR.
4. **You merge.** The pipeline builds, signs and pushes the image to the registry.
5. **The GitOps controller** sees the new tag in git and syncs the cluster.
6. **The map** shows the new entity and its links.

The slide adds four lessons:

- **Humans decide in the gold boxes.** Everything else is declared in git and proven by the pipeline. There are two humans in the path: you, writing the epic and reviewing the merge.
- The findings tracker receives the scan results. The update bot keeps dependencies fresh.
- **Be honest** about the last step: in the reference platform, putting the service on the map after deploy is a manual snapshot today.
- **Every chapter labels each step Built, Partial or Planned.** Planned means: **do not plan work that depends on it.**

### Status labels

| Label | Meaning | What you do |
|---|---|---|
| **Built** | It exists and works | Plan work that depends on it |
| **Partial** | Some of it exists | Plan around the missing part, with a manual step written down |
| **Planned** | It is only an intention | Do not plan work that depends on it |

This habit is worth more than any single tool. Many plans fail because they quietly depend on something that does not exist yet.

## A worked example: TrailMug

TrailMug wants the returns service live before the March milestone. Follow the golden path.

1. The owner (you) writes the epic and creates `trailmug-svc-returns`.
2. An agent opens one MR per issue: "add the return endpoint", "add the café confirmation message".
3. The pipeline runs tests, a scan for known weaknesses in dependencies, and a licence check on the MR. One MR fails because a new library has no licence file. You see it in the pipeline, ask the agent for an alternative, and the check passes.
4. You merge. The pipeline builds an image, signs it, and pushes it to the registry.
5. The controller sees the new tag in git. The staging cluster updates.
6. Someone runs the snapshot that adds `trailmug-svc-returns` to the map.

In the status table for this platform, step 6 is **Partial** (manual). So the milestone plan includes a line: "Operations adds the service to the map within one working day of deploy." No work depends on the map updating itself.

## The 2030 Product Development Manager lens

- **You decide:** the epic, the merge decision, whether a failing gate is a real risk, and whether a **Planned** step is allowed into a plan.
- **You delegate to agents:** opening merge requests for issues, fixing a failing check, drafting the change description, and updating dependency versions.
- **The brief you would write:** "The licence check failed on this merge request. Find the dependency that has no licence. Propose two alternatives with licences, fit and last release date. Do not change the code until I choose."
- **You verify by:** reading the pipeline result yourself, reading the diff of any dependency change, and checking that the image deployed has the same digest that was tested.
- **Disciplines involved:** engineering and platform (the tools), security (scans and findings), operations (the map and the cluster), finance (what each tool costs to run), legal (licences).
- **On the agent ladder:** **delegate and orchestrate**: agents open one merge request per issue. When many issues run in parallel as several sessions, you are orchestrating, and the pipeline is the gate that governs them.

## Working with AI agents

- **Agents do the routine:** MRs, fixes after a red pipeline, dependency bumps.
- **Humans do the gates:** merge, licence sign-off, risk decisions.
- **Never let an agent merge its own work** on a protected branch. That would remove the second pair of eyes.
- **Ask agents to explain, not to guess:** "Explain what this pipeline job does in three sentences" is a good way to learn the platform quickly.

## Common mistakes

1. **Skipping the status labels.** A plan that depends on a Planned feature will fail late.
2. **Treating the pipeline as a formality.** It is the evidence of safety.
3. **Merging without reading the diff.** The pipeline cannot know your intent.
4. **Confusing the map with the truth.** The map is a view. Git and the running system are the facts.
5. **Letting the agent own the last step.** The merge is a human decision.
6. **Memorising tool names instead of jobs.** Tools change. Jobs stay.

## Practice

1. Draw the platform map from memory in three groups. Compare it with the table above.
2. For a product you know, list the platform tools it uses. For each tool, name its job and mark it Built, Partial or Planned.
3. Write the golden path for a small change in your product as six numbered steps. Mark each step as human or machine.
4. Find one step in your path that is manual. Write the plan line that covers it.
5. Ask an agent to explain one job in your pipeline in three sentences. Check its explanation against the pipeline file.

## Checklist

- [ ] I can describe the three groups of the platform and the base under it.
- [ ] I can walk one change from epic to a running, mapped service.
- [ ] I know the two human steps in the path.
- [ ] I label every step Built, Partial or Planned, and I plan around Partial and Planned.
- [ ] I know that the merge request is where the change is reviewed.

## For facilitators (speaker notes)

- **Slide 21.** An internal developer platform is the shared ground every product stands on. Walk left to right: know it, plan and build it, store, scan and deliver it. Every component carries a Built, Partial or Planned label in the chapter. The identity, network, database and storage parts sit under everything.
- **Slide 22.** The golden path from an idea to a running, mapped service. The two humans in the path are you, writing the epic, and you reviewing the merge. Be honest about the last step: today the map ingest is a snapshot that people run (Partial).

## Where to go next

Continue with [Deck 11: Why not Backstage, and the ITSM role map](/library/deck-11-backstage-and-itsm-role-map). For the written overview of the same platform, read [The developer platform](/library/internal-developer-platform).
