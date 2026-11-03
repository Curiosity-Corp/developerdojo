---
title: "The OSS-first ladder"
description: "A repeatable way to decide between using, patching and building: search, scorecard, fit score and decision record."
section: "Master Developer"
order: 3
---

This page is the method behind the rule [open source first](/library/open-source-first).

## The four rungs

You always start at the top. Go down only when the rung above fails, and write down why.

| Rung | When | What you do | Record |
|---|---|---|---|
| (a) Search | Always, first | Look for open source with an acceptable licence. Check what you already run. | Scorecard |
| (b) Use as is | Fit is 100% of must-have needs and the licence passes | Configure it. Do not change its code. | Short decision record |
| (c) Adopt and patch | About 80% fit and small gaps | Adopt it. Keep your changes as a tracked patch set. | Decision record, patch list, owner |
| (d) Build | Nothing fits | Build it. Accept the full tech debt. | Decision record with tech-debt statement |

## How to search

1. **Your own estate first.** Do you already run something that does this?
2. **Then the world.** Package registries, topic pages on code hosts, curated "awesome" lists, and landscape maps of open source tools.
3. **Shortlist 3 to 5 candidates.**

## The scorecard

Copy this for each candidate. An empty row is a hidden risk.

| # | Criterion | What to record | Red flag |
|---|---|---|---|
| 1 | Fit % | Score and list of unmet must needs | Any unmet must that cannot be closed |
| 2 | Licence | The SPDX id and the file you read | No licence. Source-available. Network copyleft for a customer service. |
| 3 | Last release | Date and version | No release for 12 months |
| 4 | Commit cadence | Commits in the last 90 days | Many open pull requests, no replies |
| 5 | Bus factor | How many people wrote most of the code | One person wrote more than 80% |
| 6 | Security record | Past fixes, speed, a security contact | Slow fixes. No way to report. |
| 7 | Community | Active maintainers and answers per week | One company controls it and can change the licence |
| 8 | Run cost | Needs a database, a queue, a cluster? Backup and upgrade? | Needs five new services |
| 9 | Data and telemetry | Does it call home by default? | Phone-home you cannot switch off |
| 10 | Fit with your stack | Sign-in, deployment, updates | No sign-in option and no way to add one |
| 11 | Exit cost | Can you export data in an open format? | Data locked in a private format |

**Bus factor** is the number of people who must leave before the project stalls.

A scorecard is evidence, not a vote. Put a link or a date in every row.

## Fit %: measure it honestly

1. Write the requirements **before** you look at candidates.
2. Label each **MUST** (cannot ship without it, or breaks a rule) or **SHOULD** (better with it, a workaround is fine).
3. Test each one with evidence: a doc line, a setting you tried, a test you ran. "I think so" counts as unmet.
4. Count. MUST counts double.

```text
fit % = (2 x MUST met + SHOULD met) / (2 x MUST total + SHOULD total) x 100
```

Also keep the **list of unmet MUST needs**. A tool with 95% fit and one unmet legal MUST is not a 95% tool.

Example: 10 MUST and 6 SHOULD. The tool meets 8 MUST and 4 SHOULD.

```text
(2 x 8 + 4) / (2 x 10 + 6) = 20 / 26 = 77%
```

### Honesty rules

- One person writes the MUST list. A different person tests.
- Do not split one need into five to raise the count.
- Count only what works in the version and licence you can use. Paid-only features do not count.
- Run it in a throw-away environment. Docs lie. Demos lie.
- Score the version you will deploy, not the roadmap.

| Fit | Meaning | Next step |
|---|---|---|
| 100% of MUST | Perfect | Rung (b) |
| About 80% to 99% | Close | Try config, extensions and upstream fixes. Then rung (c). |
| 50% to 79% | Large gap | Rung (c) only with a written reason |
| Below 50% | Wrong tool | Next candidate |

## When 80% is a trap

Take the first option that works:

1. **Configuration.** A setting, a variable or an admin screen.
2. **Extension points.** Plugins, webhooks, themes, an API.
3. **Upstream contribution.** Send your change to the project.
4. **Patch set.** A short list of patch files applied on each release.
5. **Maintained fork.** The most expensive form.

| Trap | Warning sign | What to do |
|---|---|---|
| Patch volume | Many files or hundreds of lines | Set a limit in the decision record |
| Core patches | You change the data model or permissions | Expect painful updates every release |
| Hostile upstream | Rejects contributions, holds features for a paid edition | Do not build on it |
| Licence split | A folder with a different licence | Never copy or re-create that code |
| Hidden 20% | The missing part is what customers use most | Weight by value, not count |
| Rebuild in disguise | After patching, the code is mostly yours | You are at rung (d). Say so. |

If an update takes more than half a day each month, or the patch set grows every quarter, review the decision.

## The decision record

Every choice gets a record in git. Use the [decision record template](/library/template-decision-record).

## Key points

- Search first, build last.
- Write needs before you look at tools.
- Fit % hides unmet MUST needs. List them.
- Record the decision and the exit plan.
