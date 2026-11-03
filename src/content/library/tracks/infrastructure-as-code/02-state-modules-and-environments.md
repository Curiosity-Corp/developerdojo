---
title: "State, modules and environments"
description: "The tool's memory of what it built, how reuse works, and how to keep test and production separate and alike: the places where infrastructure code goes wrong quietly."
section: "Infrastructure as code"
order: 2
track: "infrastructure-as-code"
level: "core"
duration: "90 min"
outcomes:
  - "Explain what state is, why it is sensitive, and why it must be stored remotely and locked"
  - "Explain modules and judge when reuse helps and when it hides risk"
  - "Design separate environments that stay alike"
  - "Direct an agent to restructure code and verify that nothing real changes"
prerequisites:
  - "the-way-five-rules"
resources:
  - "hashicorp/terraform-state"
  - "hashicorp/terraform-modules"
  - "gitlab/gitlab-managed-terraform-state"
  - "opentofu/docs"
  - "hashicorp/terraform-tutorials"
updated: 2026-11-03
---

Lesson 2 of the Infrastructure as code track. It supports the Master Developer delivery spine, stage "governance". Lesson 1 should come first.

## 1. Why this matters

Reading a file and a plan is the easy part. The quiet failures happen elsewhere: the tool loses track of what it built, two people apply at once, a module change affects ten places, or test and production drift apart until a change that worked in test destroys something in production.

Three ideas prevent most of these: **state**, **modules** and **environments**. You do not need to manage them by hand. You need to know what each is, where it is risky, and what to ask.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Where state lives and who can read it, which environments exist, when reuse is worth its cost | Restructuring code into modules, writing environment variables, migrating state with a written plan | Running the plan after a refactor and confirming it is empty, reading who has access to state, comparing environments | Security (state holds secrets), platform engineering (shared modules), operations (production changes), finance (extra environments) |

## 2. Key ideas, explained

### State: the tool's memory

When the tool creates a bucket, it records the bucket's real identifier and settings in a file called **state**. On the next plan, it compares three things: your code, the state, and the real cloud. Without state, it would not know that the bucket in the cloud is the one in your code. The [state documentation](https://developer.hashicorp.com/terraform/language/state) explains it.

State matters to you for four reasons.

1. **State can contain secrets.** Database passwords and keys that the tool generates or handles may be stored in it in readable form. Treat state like a secret store.
2. **Losing state is serious.** If state is lost, the tool thinks nothing exists and may try to create everything again, or lose track of what it must clean up.
3. **Two people applying at once can corrupt it.** The tool must **lock** state while it works.
4. **Editing state by hand is dangerous.** There are commands for moving and removing entries. They should be rare, written up in advance and reviewed, never improvised by an agent.

### Where state lives

| Option | Verdict |
|---|---|
| A file on someone's laptop | Never for anything shared. It will be lost or diverge. |
| Committed to git | Never. It may hold secrets and cannot lock. |
| **A remote backend with locking and encryption** | The standard. Examples are a storage service with a lock, or the platform's own managed state. |

GitLab offers [GitLab-managed Terraform and OpenTofu state](https://docs.gitlab.com/user/infrastructure/iac/terraform_state/), stored and locked per project, with access following project roles; check which parts your plan includes. Whatever you use, answer: **who can read the state, who can write it, is it backed up, is it encrypted, and is it locked during changes?**

### One state per blast radius

The **blast radius** is how much can go wrong if one change goes wrong. A single huge state for the whole company means a mistake can affect everything. Many tiny states mean lots of coordination. A good rule: **separate states for separate lifecycles and separate risks.** Network foundations change rarely and hurt a lot. A test website changes often and hurts little. Keep them apart. Production and test always have separate states.

### Modules: reusable packages

A **module** is a folder of infrastructure code that you call with inputs, like a function. A module called `static-site` might create a bucket, a CDN and the right permissions, and take a name and a region. The [modules overview](https://developer.hashicorp.com/terraform/language/modules) explains the idea.

```hcl
module "site_test" {
  source = "./modules/static-site"
  name   = "trailmug-test"
  region = "eu-west-2"
}
```

Modules help because they remove copy and paste, and because a good module bakes in safe choices: private by default, tagged, encrypted. They also carry risks you must ask about.

| Risk | Question |
|---|---|
| **Hidden resources** | What does this module create beyond what I asked? Read its plan, not just its name. |
| **Wide effect** | Where else is this module used? A change to it changes every user. |
| **Unpinned source** | Is the module version pinned? A moving version changes things without a merge request. |
| **Untrusted source** | Who wrote it? A public module is someone else's code with access to your cloud. Review it like a dependency (CI/CD lesson 4). |
| **Over-abstraction** | Is the module hiding something simple behind many options? Prefer plain code until you have three real uses. |

For an agent, the safest rule: **the agent may call approved modules, and may not write or change a shared module without a human owner's review.** Put shared modules under code owners.

### Environments: separate, and alike

An **environment** is one complete copy of your infrastructure for a purpose: test, staging, production. They should be **separate** (different state, ideally different accounts, different credentials) and **alike** (built from the same code with different inputs). When they differ in structure, a successful change in test tells you nothing about production.

Two common layouts:

```text
infra/
  modules/
    static-site/
  environments/
    test/       # calls modules with test inputs, own state
    production/ # calls modules with production inputs, own state
```

or one set of code with separate variable files per environment. The first is easier to read and to protect: code owners can require a senior approval for anything under `production/`.

Keep the **differences** small and visible: names, sizes, counts, addresses. If production has a resource test lacks, or the reverse, write down why.

### Variables and secrets

Inputs come from variables. Values that differ by environment go in a per-environment file or are supplied by the pipeline. **Secrets never go in these files in git.** Pass them from the platform's secret store at run time, or avoid them by using identity-based access (Cloud platforms lesson 3). Mark sensitive variables as sensitive so that the tool hides them in output. That hiding does not stop them being written to state, which is why state is protected.

### Refactoring safely

Moving code into a module changes how the tool names things, and it may think the old resource must be destroyed and a new one created. Tools have a way to declare "this resource moved from here to there", so that the plan shows no destroy. The test for any refactor is the same: **after the change, the plan must show no changes to real resources.** If it shows destroys, stop. That check is easy for you to demand and easy for an agent to skip.

### Importing what already exists

Resources created by hand can be brought under code by **importing** them. It is a delicate job: write the code, import the resource, and run plan until it shows no changes. Do this in small steps, with a human reading each plan. It is a good job for a patient agent plus a careful reviewer.

## 3. Step by step: move to a module and two environments

1. **Choose the state home** and write who can read and write it.
2. **Check the state is locked, encrypted, backed up.**
3. **Write a spec** for the restructure: the module, the two environment folders, and "the plan after the change shows no changes".
4. **Direct an agent** to restructure on a branch, with plan first. Forbid state commands unless approved.
5. **Review the module** for hidden resources and the source version.
6. **Review each environment's inputs.** Are the differences small and explained?
7. **Run plan for each environment** and confirm zero changes to real resources.
8. **Set code owners** on production and on shared modules.
9. **Merge** with a second person's approval.
10. **Record the layout** in `docs/infra-layout.md`.

## 4. Worked example: TrailMug

Maya has one folder with a test bucket from lesson 1, and now wants a production bucket too. She decides: shared module `static-site`, two environment folders, separate state per folder in the platform's managed state, and the production folder owned by Ravi as code owner.

Her spec includes: "After the restructure, running plan in `environments/test` shows no changes. The production plan shows exactly the new bucket and nothing else. The module is called by relative path (no external module). No state commands are used. Tags owner and issue are produced by the module."

She briefs an agent, plan first. The plan says it will "run a state move for the bucket". She stops it: the spec forbids state commands. She asks for a `moved` declaration instead, which the tool handles inside the plan. The agent revises.

In review she reads the module and finds it also creates a CDN distribution, because the agent copied its pattern from a different project. The module's name did not say so. She asks for it to be removed. Her test environment plan shows the CDN would be destroyed in test, since it had been created in a trial earlier. She did not know that. She decides the CDN should exist, but in its own issue, and asks the agent to move it into a clearly named module.

The final plans: test shows no changes; production shows one bucket to add. She approves; Ravi approves production. In the layout doc she writes the state locations, who may read them, and the rule for any state command: written plan, human approval, never by an agent.

## 5. Working with AI agents on this

**What the PDM decides:** where state lives and who may touch it, the environments, which modules are approved, who owns shared code.

**Delegate:** restructuring code, writing environment inputs, writing `moved` declarations, drafting the layout doc, explaining a module.

**Verify:** the plan after a refactor shows no real changes; module contents; state access list; environment differences.

**Never delegate:** running state commands, editing state, changing who can read state, changing a shared module without the owner.

**Prompt for a refactor:**

```text
Restructure infra/ into modules/static-site and environments/test and
environments/production, each with its own state key. Do not run any state command
and do not run apply. Use moved declarations if a resource changes address. After
the change, run plan in each environment and paste the output: test must show no
changes. List every resource the module creates. List every difference between
the two environments' inputs and why it exists.
```

**Prompt to audit a module:**

```text
Read this module. List every resource it can create, every input, every default, and
anything created beyond the inputs. Flag public exposure, permissions, anything
that costs money while idle, and anything that would destroy data if an input
changed. Do not edit. Mark what you cannot tell.
<paste module>
```

**Disclose** AI help on structural changes in the merge request.

## 6. Common mistakes and how to avoid them

- **State on a laptop or in git.** Fix: remote, locked, encrypted.
- **State readable by everyone.** Fix: restrict like a secret store.
- **Improvised state commands.** Fix: written plan, approval, no agents.
- **One state for everything.** Fix: separate by lifecycle and risk.
- **Unreviewed public modules.** Fix: pin, read, own.
- **A refactor that shows destroys.** Fix: stop and use `moved`.
- **Test and production that differ in structure.** Fix: same code, different inputs.
- **Hidden extra resources in a module.** Fix: read the plan, not the name.

## 7. Practice

**Deliverable in git:** `specs/iac-02.md`, `briefs/iac-02.md`, `reviews/iac-02.md`, `docs/infra-layout.md`.

1. Start from your lesson 1 code, or a small sample.
2. In `docs/infra-layout.md`, write where state will live, who may read and write it, and the rule for state commands.
3. Write a spec for a module plus two environments with at least six acceptance criteria, including "plan shows no changes for test" and "no state commands".
4. Brief an agent. Plan first. Forbid apply.
5. Review the module and the environment differences. Record findings in `reviews/iac-02.md`.
6. Run both plans, in a throwaway account if you have one, and record the counts.
7. Record one hidden thing you found. Open a merge request with a disclosure block.

## 8. Checklist

- [ ] State is remote, locked, encrypted and backed up, and I know who can read it.
- [ ] No state commands were run by an agent.
- [ ] I read what the module creates, not just its name.
- [ ] Modules are pinned and owned.
- [ ] Test and production are separate and alike, with explained differences.
- [ ] The plan after a refactor showed no real changes.
- [ ] The layout is written down.

## 9. Further learning

Read the state page before you store state anywhere. Read the modules overview, then open one module you plan to use and read its resources. The GitLab managed state page shows a ready-made backend. Tutorials from HashiCorp cover remote state step by step.
