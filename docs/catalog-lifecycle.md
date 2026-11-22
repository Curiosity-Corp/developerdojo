# Catalog lifecycle: ownership, cadence and refresh

The published catalog is a set of learning starting points, not a promise that a tool is safe, compatible or professionally approved. This workflow gives every catalog claim an owning role, a cadence and a visible state. Responsibilities belong to roles, not named people: whoever performs a check records their name in the issue or MR, never on the site, and an unassigned review stays unassigned. The [handbook](handbook.md#8-quarterly-and-half-yearly-jobs) explains the resource refresh job and the MR process.

The matrix below is kept as data in `src/lib/catalog-lifecycle.ts` (`OWNERSHIP_MATRIX`). That file is the single source for owners and cadences; `tests/catalog-lifecycle.test.ts` fails when this page stops naming an area or role it defines.

## What a learner sees

Every catalog entry shows a lifecycle line, rendered at build time so it works without JavaScript:

- curated kata pages on the Fields page, kata recipes (the index and each recipe page) and every Armory registry entry;
- the state (**Verified**, **Review due** or **Unavailable**), the date it was last verified and the maintainer role that owns it;
- when it is not verified, the reason and fallback advice, and a checked alternative when one exists;
- on a recipe page, what was checked and the entry's provenance.

The site is rebuilt every night, so an entry moves to Review due on the day its cadence passes without anyone editing it. The whole set is published as `/catalog-lifecycle.json` (state, owner role, dates, reason, provenance and the matrix; no person names and no tracker links).

## Ownership matrix and cadence

| Area | Owner role | Consulted when needed | Cadence | Triggers that make it due at once | Evidence a check records |
| --- | --- | --- | --- | --- | --- |
| Sources and links | Catalog maintainer | none | 90 days | the weekly external link check reports a broken or unverified link; a publisher moves, retitles, withdraws or starts charging for a page; a learner reports a problem | URL, date opened, title, access and cost, and the source of any replacement |
| Harness and model versions and pricing | Catalog maintainer | Benchmark maintainer | 30 days | a new harness release or model version; a deprecation or retirement notice; a price, plan or rate-limit change | version or model ID and how it was read, the pricing page and its date, and a smoke test on the version shown |
| Benchmark and comparison results | Benchmark maintainer | none | 30 days | a compared harness, model or price changes; the method or task set changes | dated configuration, method, limitations and reproducible results; older results keep their dates |
| Skill provenance and security | Catalog maintainer | Security reviewer | 90 days | a new skill version or commit; a change to bundled scripts or referenced code; a security advisory | publisher, version or commit, instructions and scripts read, provenance attestation, and what was not checked |
| Integration read/write compatibility | Catalog maintainer | Security reviewer | 90 days | a new release of the integration; a permission, scope or authentication change; an API or protocol version change | version, read, write, execute and network scope, and a smoke-test transcript |
| Kata artifacts and exercises | Kata maintainer | none | 90 days | a source, stack or expected output changes; a learner run fails or disagrees with the page | the steps and environment actually checked, artifact provenance, and the steps not tested |
| Domain standards | Domain maintainer | Qualified reviewer | 365 days | a new edition, amendment or withdrawal of a standard; a change of jurisdiction or intended use | standard, edition, jurisdiction and the scope the claim covers |
| Qualified review requirements | Domain maintainer | Qualified reviewer | 365 days | a regulation or licensing change; the intended use moves from practice towards real work | the reviewer role, the decision and its scope, or a record that no qualified review is available |

Benchmark dates: an Arena comparison is dated by its run, and a result is never redated. When a compared version or price changes, the old result stays with its date and the comparison is marked due until it is rerun.

If a consulted role is needed but nobody holds it, the claim stays unverified (Review due) and the issue is assigned or escalated. Never record an approval that did not happen.

Which area an entry belongs to:

- A curated kata names its area in its `lifecycle` record (`src/data/kata-catalog.ts`).
- Kata recipes are Kata artifacts and exercises.
- Armory harnesses and models belong to the harness and model area, instructions and skills to skill provenance, and everything else (MCP servers, CLIs, libraries, apps) to integration compatibility.

## States

A maintainer records only **verified** or **unavailable**. **Stale** (shown as Review due) is always computed. An entry is stale when any of these is true:

- it was never verified;
- a change was reported on or after its last check (`changeReported`);
- the build date is past its due date, which is the earlier of its last check plus the area's cadence and its own next review date.

What each state means:

- **Verified:** the check named in "What was checked" passed on that date, and its cadence has not run out. A working URL alone does not verify a product's permissions or safety. A smoke test shows one task worked once on one setup.
- **Review due:** keep the last actual check date. The learner is told why and is advised to check the linked source and practise with test data.
- **Unavailable:** a source is gone, access has materially changed or a significant unresolved concern makes the instructions unsuitable. The reason is required, and the learner is told not to follow the entry as written. The route stays, so links and saved on-device progress keep working. Offer a checked alternative when one exists. Never present an unverified substitute as equivalent.

## Minimum fields

| Surface | Where the fields live | Gate |
| --- | --- | --- |
| Curated katas | `lifecycle` on each entry in `src/data/kata-catalog.ts`: `area`, `maintainerRole`, `verifiedOn`, `checked`, `provenance` and `state`, plus `reason` (required when unavailable), `alternative` and `changeReported` | `validateCuratedLifecycle` fails the build and `npm test` on a missing or malformed field |
| Kata recipes | the recipe's `maintainer.role`, its `review` record (or the latest passed check date) and its brief inputs as provenance; `withdrawn` maps to unavailable | the recipe schema ([kata-recipes.md](kata-recipes.md)) |
| Armory entries | `review.lastVerified`, `review.nextReview`, `review.checked` and the optional `review.changeReported`; the maintainer and sources as provenance; `withdrawn` maps to unavailable with `replacedBy` as the alternative | the Armory schema ([armory-registry.md](armory-registry.md)) |

## Scheduled checks

Staleness reuses the scheduled pipelines that already exist:

- **Nightly rebuild.** It publishes the site, which recomputes every entry's state for that date.
- **Weekly link check** (the `LINK_CHECK` schedule). `external_links` checks the sources. `catalog_lifecycle` reads `dist/catalog-lifecycle.json` and writes `catalog-lifecycle-report.md`: every entry that is not verified, grouped by owning role, with the reason and the due date. The report is also produced on every MR, so a change report shows in that MR's artifacts. To run it locally: `node scripts/list-stale-resources.mjs --catalog dist/catalog-lifecycle.json`.
- **Quarterly `stale_resources`.** It still lists resource YAML files older than 90 days. Catalog entries come from the weekly report.

Open or update one issue per owning role from the weekly report. A stale entry never fails the pipeline. It is work for its owner.

## Upgrade, replace or withdraw

1. **Record the change the day it is noticed.** Open or update an issue with the affected entry, source, discovery date, impact, evidence and owning role. Never put credentials, private learner work or sensitive reports in it. On the entry itself, add `changeReported: { date, change }`, written in plain words for a learner. The next build shows Review due with that text, and the weekly report lists it.
2. **Compare.** Check the current publisher documentation, version, terms, cost, required permissions and read/write behaviour against what the page claims. Inspect executable skill instructions and scripts; a documentation check is not a security audit. For a blocked link, record that the source is unverified rather than calling it broken. Bring in the consulted role from the matrix when the area needs it.
3. **Decide on one outcome:**
   - **Upgrade:** rerun the smoke test or exercise on the new version, update the version, steps and evidence, move `lastVerified`/`verifiedOn` to the day of that check and remove `changeReported`.
   - **Replace:** check the replacement to the same standard, then link it as the alternative (`replacedBy` in the Armory, `alternative` on a curated kata) and withdraw the old entry.
   - **Withdraw:** set the entry unavailable (`withdrawn` in the Armory or a recipe, `state: 'unavailable'` with `reason` on a curated kata). Keep the route.
   - **Keep due:** if nobody can check it yet, leave `changeReported` in place. The learner keeps seeing the reason and the fallback.
4. **Keep the evidence.** Retain the old evidence in the issue, the MR description and history, and the dated benchmark or run record, including the former version and date. Pipeline artifacts expire after 90 days, so copy the report lines you relied on into the MR. Never backdate a verification or make a blanket claim for unreviewed entries.
5. **Ship and confirm.** Submit a branch and MR through the existing checks. After deployment, confirm the published state on the entry and in `/catalog-lifecycle.json`. Close the issue only for work actually completed.

## PHANTOMS

Changes that depend on PHANTOMS (its catalog, harness wiring or shared run records) are coordinated through the PHANTOMS integration issue (#64) before they ship. Record the PHANTOMS side's version and date in the same change record, and leave the entry at Review due until both sides are checked.

## Exercised change: Claude Code 2.1.330

This was the first real change taken through the workflow.

- **Observed, 2026-11-22.** The npm registry reported `@anthropic-ai/claude-code` 2.1.330 as the latest release.
- **Recorded before that.** The Armory entry `claude-code` was verified on 2026-11-20, and its smoke test and the recorded FND-001 runs used 2.1.329.
- **No change** on the same day for Playwright MCP 0.0.86, Gemini CLI 0.70.0, the MCP filesystem server 2.4.0 and Blender MCP 2.3.1.
- **Recorded change.** `review.changeReported` was added on 2026-11-22, and `lastVerified` was not moved. The entry now shows Review due with the reason and the fallback, and the weekly report lists it under Catalog maintainer.
- **Next step for the owner.** Rerun the smoke test on the current release, then upgrade the entry (step 3) or keep it due.
