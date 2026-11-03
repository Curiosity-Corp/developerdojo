---
title: "Patch sets and maintained forks"
description: "How to adopt an open source project, keep your own changes small, and keep following upstream."
section: "Master Developer"
order: 5
---

Sometimes an open source tool fits about 80 percent of what you need. Do you build from zero, use it as it is, or change it and walk away? There is a fourth way.

## The idea

> Adopt the tool. Carry your own changes as a small, tracked **patch set** on top of a pinned upstream version. Follow upstream automatically.

**Upstream** is the original project. A **patch** is a small file that describes one change. A **fork** is a full copy of the code that you maintain.

Why this is the middle path:

- **Building from zero** costs months and nobody else tests your code.
- **Using it unchanged** is fast, but the missing 20 percent may block your customer.
- **Forking and walking away** is cheap on day one and dangerous on day 200, because you no longer get upstream security fixes.

The price of the middle path is a duty: **follow upstream, always.**

## The options ladder

Climb down one rung at a time. Stop at the first that solves the problem.

| Rung | What you do | Cost over a year | Use when |
|---|---|---|---|
| 1. Config | Change a setting | Near zero | A setting exists. Always try first. |
| 2. Extension point | Write a plugin, hook or theme | Low | The project has a stable extension API |
| 3. Upstream pull request | Send the change to the project | Medium once, then zero | It helps everyone and maintainers are active |
| 4. Patch set | Keep a few patches on a pinned upstream | Medium every release | The change is yours, or the upstream request is slow |
| 5. Hard fork | Take the code over for good | High, for ever | Upstream is dead or hostile, or you go in a new direction |

Two rules:

1. **Every patch is a candidate for rung 3.** A patch accepted upstream disappears from your list. Write each patch so it could be sent upstream.
2. **Rung 5 needs a decision, not a drift.** If a patch set grows past its limit, stop and decide on purpose.

## Anatomy of a patch-set repository

```text
UPSTREAM          the pin: upstream address, tag and commit
patches/          numbered patch files, one change each
PATCHES.md        the ledger: what, why, owner, removal condition
tests/            tests that prove the patches still work
Dockerfile        applies the patches and builds your image
renovate.json     lets an update bot propose new upstream versions
```

### The pin file

Pin an exact upstream tag **and** the commit id. Never track "latest".

### The patches

- Numbered, small, one change each.
- A message that says what and why.
- A line `Upstream-PR:` when you have offered it.

### The ledger

For each patch: why it exists, who owns it, and **when we can remove it**. A patch with no removal condition is a hard fork in disguise.

### The tests

Tests that fail loudly when a patch no longer applies or no longer works.

## The update loop

1. A bot opens a merge request that bumps the pin to the new upstream version.
2. The pipeline tries to apply every patch.
3. If all apply and tests pass, a human reviews and merges.
4. If a patch fails, a human fixes it.
5. If a patch is already upstream, **that is a gift**. Remove it from the list.

## Supply chain and licence duties

- Keep the upstream licence and notice files.
- Check whether the licence needs a source offer (network copyleft).
- Build your image in the pipeline. Scan it. Store it in a registry.
- Trademark: do not use the upstream's name or logo for your build unless allowed.

## Security: responding to a vulnerability

1. Watch upstream security notices and your scanner results.
2. Bump the pin to the fixed version.
3. Rebuild, scan, ship.
4. Record the change.

## Warning signs

- You say "we will rebase when we have time". You will not.
- The patch set grows every quarter.
- Patches change the data model or the permission system.
- Nobody owns the ledger.

A patch-fork without an automatic update loop is a hard fork that has not noticed yet.

## Key points

- Pin upstream. Keep patches small. Track them in a ledger with removal conditions.
- Automate the update loop. Test every patch.
- Send patches upstream whenever you can.
