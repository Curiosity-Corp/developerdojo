# Arena evidence records: format and editing guide

An Arena record (#89) publishes one dated comparison of stacks on one task with one rubric: the question,
the task and inputs, every arm's stack with versions, the method and how to reproduce it, each comparison
with its confounders, the measured or reported results, limitations, scope and sources.

| Piece | File |
| --- | --- |
| Records | `src/content/arena/<slug>.yaml`, one experiment per file |
| Schema and record rules | `src/lib/arena-record.ts` |
| Evidence checks and measurements (pure) | `src/lib/arena-records.ts` |
| Build-time loader | `src/lib/arena-content.ts` |
| Pages | `/arena/evidence` (index), `/arena/evidence/<slug>`, `/arena/evidence/<slug>.json` |
| Tests | `tests/arena-records.test.ts`, `e2e/arena-records.spec.ts` |

## Two kinds, never mixed

- **`dojo-experiment`**: run by the Dojo. Its run files and check results are published under
  `public/examples/<experiment>/`. The record lists run IDs and **never types a measured number**: runs,
  reliability, checks, time and cost are computed from the files at build time, so the page cannot drift
  from the evidence.
- **`external-benchmark`**: someone else's published result. Each arm states what the source reported
  (`value` of `of`) with the link it was read from, and that link must be in `sources`. The page labels
  it "Published by others; not run by Developer Dojo" and "Historical snapshot".

A comparison that was designed but not run is `status: proposed` with a `whyNotRun` starting "Not run".
It has no variant arm and no results.

## Comparisons are separated by what they change

`variable` is one of `model`, `harness`, `instructions`, `skill`, `tool`, `delegation` or `full-stack`.
The build compares the two arms' declared stacks (part name and version) and rejects:

- a single-variable comparison whose stacks differ in any other part (`tool` may change `tool` or
  `integration`; `delegation` changes `agents`);
- a `full-stack` comparison that changed only one part (name that part instead).

For a Dojo experiment it also checks the run files: each arm ran one fixed configuration (harness, model,
effort, prompt, flags); the declared model, harness version and prompt file match what the runs recorded;
the two arms differ only in the run fields the variable allows; paired runs are the same repetition; and a
correction (`<run>-fix`) is never listed as a first attempt.

## Measures

The record page shows two separate tables per comparison:

- **System metrics**, the same in every field: runs, reliability (completed without a harness error),
  verification completed (every check has a result), repeatability (runs passing every check on the first
  attempt), passing after one correction round, mean time, cost with its basis, and permissions.
- **Domain outcome**, scored by the field's own rubric (`domain.fieldId`, `domain.measure`). Scores from
  different fields are not on one scale and are never combined.

Proportions carry a 95% Wilson score interval. A cost, time, version or permission that was not reported
is `{ unavailable: "<why>" }` and renders "Not available", never zero.

## Freshness and history

- `review.lastChecked` is the date someone actually checked the record against its evidence and sources;
  `review.staleAfter` is when it must be re-checked. After that date the site (rebuilt nightly) labels it
  **Stale**.
- Records are not edited to new results. A re-run is a new record with a new `ARN-` ID and
  `supersedes: <old ID>`; the old page stays, labelled **Superseded**, as a historical snapshot.

## No general ranking

There is no score field, no combined table and no sort by result. Titles, questions, readings and scope
may not use ranking words (best, winner, leaderboard, outperforms and similar; `RANKING_WORDS`). Say what
happened on this task, with this rubric and these versions, and what it does not show.

## Run file format (Arena run format v1)

`<evidence.dir>/runs/<run>.json`, as written by the FND-001 runner: `harness`, `requestedModel`,
`modelsUsed`, `effort`, `prompt` (relative to the evidence folder), `flags`, `isError`, `durationMs`,
`costUsd` (null when not reported), `costBasis`, optional `repetition` and `correctionOf`; extra fields
are kept. `<evidence.dir>/results.json` is the checker output: `checks` (ordered IDs, which must equal the
record's `rubric.checks`) and `results.<run>.checks.<check>.pass`.

Runners: `scripts/fnd-001/run-comparison.sh` (instructions and model comparisons, `public/examples/fnd-001`)
and `scripts/fnd-001/run-harness-comparison.sh` (harness comparison ARN-003, `public/examples/fnd-001-harness`).
The harness runner sends both harnesses through `scripts/fnd-001/relay.mjs`, a local recording relay that
holds the API key and pins the serving provider; `scripts/fnd-001/harness-run-file.mjs` turns the harness
output and the relay log into a run file with the extra fields `requests[]` (what each request sent, as
sizes and SHA-256 hashes, never text, and the served model, token usage and billed cost),
`harnessReportedDurationMs`, `harnessReportedCostUsd` and `endpoint`. Check an evidence set with
`node scripts/fnd-001/check-pocket-garden.mjs <set>` (`fnd-001` or `fnd-001-harness`).

A source or input link may point to another record's page (`/arena/evidence/<slug>`); it is accepted only
when that record exists.

## Public-page rules

Records render on the public site. Do not put internal hostnames, repository paths, issue links, client or
person names in a record. `method.reproduce` uses only public tools and the files published with the
record.

## Checklist: add a record

1. Publish the run files and checker results under `public/examples/<experiment>/` (Dojo experiments).
2. Create `src/content/arena/<slug>.yaml` with the next free `ARN-` ID. Copy an existing record's shape.
3. Mark every value you do not have as unavailable, with the reason. Mark every comparison you did not run
   as proposed.
4. Run `npx vitest run tests/arena-records.test.ts` and `npm run check`. CI builds the pages and runs
   `e2e/arena-records.spec.ts` plus the site-wide route and accessibility checks.

Passing these checks proves the record matches its evidence and is well formed. It does not prove that a
result generalizes beyond its task, rubric, versions and date.
