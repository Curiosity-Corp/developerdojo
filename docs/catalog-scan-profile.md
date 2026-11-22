# Resource catalog accessibility-scan profiling

Issue #113 tracks the slow full-page accessibility scan. `catalog_a11y_profile` is an optional diagnostic; the existing `e2e` job still runs and blocks release. After the normal jobs finish, use **Build > Pipelines** on an MR or `master` pipeline and start the manual job. Wait for it to finish, then download `catalog-a11y-profile.json`. Running it while other browser jobs run adds contention and makes the observations less useful.

The job uses the built site and a single Chromium process on one CI runner, with the same WCAG tags as the release check, and keeps all catalog cards. It answers two questions.

1. **Does a violations-only scan find the same thing faster?** By default axe builds a selector and an HTML snippet for every node of every rule, including the thousands of passing nodes on the catalog. The release check reads only `violations`. `resultTypes: ['violations']` keeps every rule running on every node and every violation node in full. It stops that work only for passing and inapplicable nodes (one node is kept per rule) and for incomplete ones (one node per rule). The job runs four full scans per theme, baseline then violations-only and then the reverse, with the reverse order in dark. It records setup and scan times, resource and DOM counts, every violation with its nodes, and the rule list. **The job fails if the two treatments of a theme disagree on any violation node**, so the artifact either supports or rules out the change.
2. **Where does the scan spend its time?** For each theme, the job runs each rule of the full scan on its own on one loaded page and records its time and its pass, violation and incomplete node counts (`perRule`).

The first round of this experiment (job 2315492, 2026-11-11) compared the baseline with a temporary `content-visibility: visible` override. Baseline scans took 90.9 to 126.0 s and override scans 85.5 to 110.4 s. Those ranges overlap, so that round established no cause. It was replaced by the two questions above.

Read the samples per theme and treatment, including every violation and affected node. A difference between samples is evidence to inspect. One run cannot establish a reliable speedup: repeat on separate runs, and change the runner load. A failed job or a partial artifact may mean an interrupted scan or a setup failure. The job also fails if a scan finds a serious or critical violation. The normal blocking checks keep their own independent result.

## Results, 2026-11-22 (job 2887712, pipeline 162011)

One run on one shared runner, Chromium 156, 912-card catalog with 15,454 DOM elements, while the same pipeline's `e2e` job ran beside it.

| Theme | Baseline scans | Violations-only scans |
| --- | --- | --- |
| Light | 29.1 s, 47.9 s | 26.9 s, 24.8 s |
| Dark | 51.0 s, 38.2 s | 37.6 s, 24.9 s |

- **Same findings.** Every scan in both treatments found zero violations, and `agreement` is true in both themes. Every scan ran the same 90 rules; `color-contrast` was incomplete in all of them.
- **Faster, with overlap.** The violations-only scans averaged 28.6 s against 41.6 s for the baseline, but the slowest violations-only scan (37.6 s) is slower than the fastest baseline scan (29.1 s). Runner load explains part of the spread, so the size of the saving is not settled by this run.
- **Where the time goes.** On its own, `color-contrast` took 14.6 s (light) and 16.5 s (dark), with 7,549 incomplete nodes; this is the cost tracked in #120. `region`, which passes 13,128 nodes, took 11.6 s and 8.2 s. Every other rule took under 5 s. These are the two rules where node detail for non-violations costs the most, which is the work `resultTypes` removes.

**Decision.** The release check in `e2e/qa.spec.ts` now passes `resultTypes: ['violations']` for every page. It cannot reduce coverage: every rule still runs on every node, the assertion reads only `violations`, and every violation keeps all its nodes. The `[catalog-diagnostics]` lines in each `e2e` log give the before/after scan times on later pipelines. In the first round of the per-rule pass, `color-contrast` ran twice because it is listed both as passing and as incomplete; the rule list is now de-duplicated.

These measurements describe a shared CI runner. They do not measure real-device navigation, filtering, layout or paint, and they do not replace a person's accessibility review. If violations-only scans are consistently faster and find the same violation nodes, the release check in `e2e/qa.spec.ts` can adopt the same option. The rules and the nodes checked stay the same. Do not remove catalog entries, filters, no-JavaScript access, WCAG rules or browser checks to improve a measurement.
