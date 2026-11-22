# Kata recipes: record format and editing guide

A kata recipe is the operational page for one kata (#86): what the learner makes, the stack, the agents,
setup, prompts, the exercise, how it was run and checked, how to adapt it, and the evidence a belt
reviewer looks for. The metadata inside each recipe is the #81 contract ([kata-taxonomy.md](kata-taxonomy.md)).

| Piece | File |
| --- | --- |
| Recipe records | `src/content/kata-recipes/<slug>.yaml`, one file per kata |
| Record schema and status rules | `src/lib/kata-recipe.ts` |
| Relationship checks and links | `src/lib/kata-recipes.ts` (pure, tested in `tests/kata-recipes.test.ts`) |
| Build-time loader | `src/lib/kata-recipe-content.ts` |
| Page, index and downloads | `src/pages/katas/[recipe].astro`, `src/pages/katas/recipes.astro`, `src/pages/katas/[recipe]/[file].ts` |
| Components | `CopyPrompt`, `RecipeUnavailable`, `KataRecipeLinks` in `src/components/` |

Content workers add or edit **YAML records only**. The page template, components and validators are
renderer code (#86); a gap in what the record can say goes as a note on #81, not as a template edit.

## Where a recipe appears

- `/katas/<slug>`: the recipe page. The file name is the slug, so `fnd-001-define-outcome.yaml` renders at
  `/katas/fnd-001-define-outcome`. A slug that a hand-written page under `src/pages/katas/` already uses is
  rejected, and so is `recipes`.
- `/katas/recipes`: the index, linked from `/katas`.
- `/katas/<slug>/<filename>`: each entry in `downloads`, served as plain text.
- Back-links, generated from the metadata:
  - `/fields#<field>` lists every recipe whose `domainIds` or `crossFieldTransfers` name the field;
  - `/belts` lists recipes with `beltCriteria`;
  - `/belt-review` lists recipes whose `verificationEvidence` includes a peer, Sensei or professional review;
  - each foundation recipe lists the recipes and catalog katas that name it in `foundationKataIds` ("Used by");
  - each Arena record whose `kataId` is the recipe's `metadata.id` links back to the recipe page.
- "Controlled comparisons" on the recipe page: every comparison in the Arena records (`src/content/arena/`)
  with the recipe's `metadata.id` as `kataId`, built by `kataComparisons` in `src/lib/kata-comparisons.ts`.
  Measured rows show the measures the Arena resolver computes from the run files; a proposed row shows only
  while no record has measured that variable for the kata; a superseded record is left out. Never type a
  measured number into a recipe: add or supersede an Arena record instead ([arena-evidence.md](arena-evidence.md)).
  The section is absent when no record names the kata.

## The record

Every section that depends on something actually happening can be replaced by
`{ unavailable: "<why>" }`. The page then says **Not available** and the reason. It never shows a missing
section as checked. Use it rather than inventing a value.

```yaml
status: draft                 # fixture | draft | published | withdrawn
notice: Optional text shown at the top; required when withdrawn.
maintainer:
  role: Foundation kata maintainer
  person: A name, only once someone has actually taken the work   # required when published
trackingIssue: https://git.developerdojo.org/Curiosity-Corp/developerdojo/-/issues/84   # for maintainers; not shown on the page
review:                       # or { unavailable: ... }; required when published
  lastVerified: 2026-11-20    # the date a check was actually done; never backdated
  checked: What that check covered, and what it did not
  nextReview: 2027-02-20      # after lastVerified; the page shows "Review overdue" once it passes
summary: One sentence, shown under the title and on the index.
metadata:                     # the #81 kata contract, exactly as kataMetadataSchema defines it
  id: FND-001
  title: ...
  layer: foundation
  # outcomeIds, artifactTypes, capabilityIds, professionalReviewRequired, and the optional lists
showcase:                     # or { unavailable: ... }; required when published
  summary: What the authentic example shows
  href: https://... or /path   # optional
  provenance: { creator: ..., source: ..., license: ..., date: 2026-11-20 }
brief:
  goal: The finished outcome, stated first on the page
  audience: Who it is for
  inputs: [{ name: ..., source: ..., terms: ... }]   # at least one
  doneWhen: [ ... ]                                   # at least one
stack:                        # or { unavailable: ... }; required when published
  components:
    - part: harness           # harness | model | instructions | context | skill | tool | integration | runtime | data
      name: ...
      version: ...            # each of version, permissions and cost may be { unavailable: ... }
      permissions: ...
      cost: ...
  rationale: Why this stack
  alternatives: [{ name: ..., tradeoff: ..., tested: false }]
agents:                       # or { unavailable: ... }
  roles:
    - { role: Builder, responsibility: ..., reviewGate: ... }
    - { role: Reviewer, responsibility: ..., dependsOn: [Builder], reviewGate: ... }   # dependsOn names a role above
setup:                        # or { unavailable: ... }; required when published
  steps: [ ... ]
  auth: What to sign in to and what access it needs. Never a secret or a token.
  smokeTest: { action: ..., expected: ..., result: not-run }
prompts:                      # each one gets its own copy button
  - { id: draft-brief, title: ..., purpose: ..., text: ... }
exercise:                     # or { unavailable: ... }
  title: ...
  resourceId: publisher/resource   # or href: https://... or a page on this site (/katas/...); one of the two
  terms: The licence or terms of use, in plain words
execution:                    # or { unavailable: ... }
  steps: [{ actor: ..., action: ..., handoff: ... }]
verification:                 # or { unavailable: ... }; required when published
  checks: [{ action: ..., expected: ..., result: not-run }]
  failures: [{ observed: ..., correction: ... }]
adaptation:                   # or { unavailable: ... }
  variations: [{ change: ..., effect: ... }]
randori:                      # or { unavailable: ... }
  challenge: ...
  constraints: [ ... ]
  evaluation: ...
maintenance:
  cadence: Quarterly, and when a cited standard is revised
  caveats: [ ... ]            # at least one
downloads:                    # optional; plain text only
  - { filename: agents.md, description: ..., content: ... }   # .md .json .yaml .toml or .txt
changes:                      # optional; oldest first; shown as "Change history" on the page (#94)
  - date: "2026-11-21"
    change: What changed, in plain words
    reason: Why: the observation or evidence behind it
    review: The independent reviewer's role and decision   # or { unavailable: ... } until a second person reviews it
```

## Rules the build enforces

`astro build` and `npx vitest run` both reject a record that breaks any of these, listing every problem
with the file name and the path inside the record:

- Unknown or misspelled keys, missing required sections, empty text.
- An unquoted date. Write `date: "2026-11-20"`: Astro's loader reads an unquoted date as a timestamp and
  rejects the record (`tests/kata-recipes.test.ts` reads the files the same way).
- A check (`smokeTest` or `verification.checks`) marked `passed` or `failed` without `evidence` and `date`.
- Status rules:
  - `fixture` is for `FIX*` IDs and `fixture-*` file names only, and every one of those is a fixture;
  - a fixture has every check `not-run`, and its `review` and `showcase` are unavailable;
  - `published` needs `review`, `showcase`, `stack`, `setup`, `verification`, at least one
    `metadata.verificationEvidence` entry and `maintainer.person`;
  - `withdrawn` needs a `notice`.
- `review.nextReview` on or before `lastVerified`.
- `changes` out of date order. A change made through the Sensei contribution process also needs its entry in
  `src/data/sensei-contributions.ts`, and the two must agree ([sensei-contributions.md](sensei-contributions.md)).
- Every metadata reference must exist: fields, pathways, resources, outcomes, artifacts, capabilities,
  constraints, stack recipes and foundations (from `kataCatalog` or another recipe). The exercise
  `resourceId` must exist too.
- A real recipe may not use fixture-only vocabulary from `src/data/kata-fixtures.ts`, or name a fixture as
  a foundation. Add a real ID to `kataDimensions` in `src/data/kata-catalog.ts` first.
- Kata IDs are unique across `kataCatalog` and all recipes. Prompt IDs and download file names are unique
  in a recipe.

Passing these checks proves the record is well formed. It does not prove that anything in it was run,
reviewed or works.

## Fixtures

`fixture-fixux-001.yaml`, `fixture-foundation-define-outcome.yaml` and `fixture-foundation-compare-stack.yaml` render three of the #81
sector fixtures, so the template can be seen and tested. Their metadata must equal the matching entries
in `tests/fixtures/kata-sectors.ts`, which a test checks. Fixture pages carry a visible fixture notice, are
`noindex` and are left out of site search. Do not copy their content into a real kata.

## Checklist: add a recipe

1. Pick the kata ID and check it is not in `kataCatalog` or another recipe.
2. Create `src/content/kata-recipes/<slug>.yaml`. Use a slug that is not a hand-written page.
3. Write `metadata` first, then the brief. Mark every section you cannot yet support as unavailable, with
   the reason.
4. Use `draft` until the publication rules above pass and someone has actually run the checks.
5. Run `npx vitest run` and `npm run check`. CI builds the site and runs the page tests.
