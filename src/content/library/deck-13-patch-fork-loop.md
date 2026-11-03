---
title: "Deck 13: The patch-fork loop"
description: "How to carry a small set of patches on top of an upstream project, with an update bot, a pipeline that re-applies patches and a human who merges."
section: "Teaching deck"
order: 13
level: advanced
duration: "90 min"
outcomes:
  - "Describe the seven steps of the patch-fork loop."
  - "Explain what happens when a patch no longer applies, and who acts."
  - "Write a patch ledger entry with an owner and a removal condition."
  - "Say why the production roll-out is a separate merge request."
resources:
  - renovate/docs
  - goharbor/docs
  - trivy/docs
  - opensource-guide/how-to-contribute
  - git/pro-git
  - gitlab/merge-requests
  - reuse/reuse-software
prerequisites:
  - deck-12-oss-first-ladder-and-licences
  - patch-sets-and-forks
---

This lesson covers slide 28. It is the picture of **rung (c)** from lesson 12 in motion: what you do after you have adopted a project that is about 80 percent right and carried a small patch set. The loop is one slide, and every box on it is a decision about who does what.

## Why it matters

Small patches on top of someone else's project are a common way to get exactly what you need. They are also a common way to end up stuck on an old version, because nobody wants to redo the patches when the project moves on. The patch-fork loop is the discipline that prevents that. It makes upgrading a routine, reviewed, mostly automatic job rather than a yearly crisis.

## Key ideas

### Words to know

- **Upstream:** the original project you adopted.
- **Patch:** a small recorded change you apply on top of upstream.
- **Patch set:** all the patches you carry.
- **Fork:** your own copy of the project. A **patch-fork** is a fork where you keep your changes as a short list of patches, not as a long, mixed history.
- **SBOM:** a software bill of materials, a list of everything inside an image.
- **Digest:** the unique fingerprint of an image.

### The loop (slide 28)

| Step | What happens | Who or what |
|---|---|---|
| 1. Upstream release | A new tag appears upstream | Upstream project |
| 2. Update bot | Opens a merge request that bumps **upstream** (tag and commit id) | Update bot |
| 3. CI re-applies patches | A refresh script clones the pinned version and applies each patch | Pipeline |
| 4. Green: a human merges | Tests pass, the bump is reviewed | Human |
| 5. Build, scan, sign | SBOM, vulnerability scan, signature, push to the registry by digest | Pipeline |
| 6. Roll to production | A **separate** merge request; the GitOps controller syncs | Human and controller |

### If a patch does not apply

The merge request stays **red**. A human then:

1. Runs the refresh script with the keep option, so the work area is kept.
2. Fixes the patch.
3. Pushes the regenerated patches.
4. Lets the pipeline run again.

If the script exits with code 3, a patch is already upstream. **Delete it.** That is a success, because you carry one patch less.

### The patch ledger

Every patch is in a file called `PATCHES.md` with:

- **An owner.** A named person.
- **A removal condition.** When can we drop this patch? For example, "when upstream releases version 2.4, which includes the fix".

Keep the upstream licence and notice. If the upstream licence is AGPL, you need a source offer.

### Why production is a separate merge request

The speaker note explains: the production move is a separate merge request **on purpose**, because database migrations are one way. Merging an upgrade into staging proves the build works. Rolling to production is a different risk decision, so it needs its own review.

### Status labels

As in lesson 10, each step is labelled Built, Partial or Planned in the chapter. Read the labels before you plan work that depends on a step.

## A worked example: TrailMug

TrailMug adopted an open source email sender at rung (c) in lesson 12. It carries two patches:

| Patch | Why | Owner | Removal condition |
|---|---|---|---|
| `0001-add-delivery-report.patch` | Adds a delivery report TrailMug needs | Engineering lead (placeholder) | Drop when upstream releases the report feature (issue linked in the ledger) |
| `0002-allow-custom-sender-name.patch` | Lets cafés set their own sender name | Product owner (placeholder) | Drop if cafés agree to a single sender name |

A new upstream tag, v3.8.0, appears on Tuesday. The update bot opens a merge request on Wednesday. The pipeline clones v3.8.0, applies patch 0001 (ok) and patch 0002 (fails). The merge request stays red.

The engineering lead runs the refresh script with the keep option, sees that upstream renamed a function, fixes patch 0002, regenerates both patches, and pushes. The pipeline goes green. The product owner reviews the bump, reads the upstream change notes, sees a security fix, and merges. The pipeline builds, scans, signs and pushes the image.

Production is a separate merge request on Thursday, after staging has run for a day. In that merge request the owner writes: "Upstream v3.8.0, security fix, no database migration." The reviewer approves and the controller syncs.

Next month, upstream releases the delivery report feature. The refresh script exits with code 3 for patch 0001. The team deletes it, updates the ledger and rejoices.

## The 2030 Product Development Manager lens

- **You decide:** whether a project is worth patching, which patches are allowed, when to retire a patch, and when a bump goes to production.
- **You delegate to agents:** fixing a patch that no longer applies, writing the ledger entry, drafting the upstream pull request that would make a patch unnecessary, and reading upstream change notes.
- **The brief you would write:** "Patch 0002 fails against v3.8.0. Show me the failing hunk and what changed upstream. Propose a minimal fix. Do not change any other patch. After the fix, regenerate the patches and show the diff of each."
- **You verify by:** reading the regenerated patches line by line, confirming that the licence and notice files are unchanged, and checking the change notes for migrations before approving production.
- **Disciplines involved:** engineering (the patches), security (scan results and signing), operations (production roll-out), open source community (upstream relationship), legal (licence duties), product (why each patch exists).

## Working with AI agents

- **Agents are well suited** to the red merge request: reading a failing patch and proposing a fix is a clear task with a clear finish line.
- **A human merges.** The agent never merges its own regenerated patches.
- **Send changes upstream.** Ask an agent to prepare a pull request to upstream for each patch that is generally useful. Read it before it is sent. Each accepted patch is one you stop carrying.
- **Read the release notes yourself.** An agent can summarise them, but a migration warning is the kind of fact you must see with your own eyes.

## Common mistakes

1. **Patching without a ledger.** Nobody remembers why a patch exists.
2. **Patches with no owner or removal condition.** They become permanent.
3. **Letting the fork fall behind.** The longer you wait, the harder the next bump.
4. **Merging a red bump "just this once".** It teaches everyone the gate is optional.
5. **Rolling to production in the same merge request.** Migrations are one way.
6. **Forgetting the licence notice.** Keep the upstream licence and notice.
7. **Ignoring upstream.** Always try to send a patch back first.

## Practice

1. Find an open source project you might patch. Write one patch idea and a removal condition.
2. Write a `PATCHES.md` with two entries, each with an owner and a removal condition.
3. Draw the loop from memory, with the six steps and the red-bump path.
4. Read the documentation of an update bot and find how to ask for a merge request when a tag changes.
5. Write the merge request description for a production roll-out of an upgrade, with the migration line.

## Checklist

- [ ] I can name the six steps of the loop.
- [ ] I know what happens when a patch does not apply, and who acts.
- [ ] Every patch is in the ledger with an owner and a removal condition.
- [ ] I know why production is a separate merge request.
- [ ] I know that exit code 3 means a patch is already upstream and should be deleted.
- [ ] I keep the upstream licence and notice.

## For facilitators (speaker notes)

- **Slide 28.** Upstream publishes, the update bot opens the bump, CI re-applies our patches, a human merges, the pipeline builds and pushes to the registry, and production moves in a separate merge request on purpose, because database migrations are one way. Exit code 3 from the refresh script means a patch is already upstream: delete it. Status labels in the chapter say which steps are Built and which are Planned.

## Where to go next

Continue with [Deck 14: The GitOps loop and finding drift](/library/deck-14-gitops-iac-and-drift). The longer page is [Patch sets and forks](/library/patch-sets-and-forks).
