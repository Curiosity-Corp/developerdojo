# Armory registry

The Armory registry (`/armory/registry`) is a typed list of the tools a learner can put in an agent stack:
harnesses, models, instruction formats, skills, MCP servers, CLIs, APIs, plugins, libraries and applications.

- Schema, listing rules and validation: `src/lib/armory.ts`
- Records: `src/data/armory.ts` (entries and stack recipes)
- Build-time loading: `src/lib/armory-content.ts`
- Page: `src/pages/armory/registry.astro`
- Tests: `tests/armory.test.ts`, `e2e/armory-registry.spec.ts`
- Evidence: `public/examples/armory/*.json` and the FND-001 run files

## Listing is computed

Nobody sets "listed". `listingGaps()` lists what is missing; an entry is listed only when the list is empty:
version checked, licence, platforms, cost/plan and sign-in confirmed, at least one supported
harness/platform/model combination, all five permission fields (read, write, execute, network, least
access), at least one operation, setup steps, a passed smoke test, and, for executable code, a provenance
or source review. Anything unknown is written `{ unavailable: 'why' }`, never guessed. Unlisted entries
appear under "Not listed yet" with their gaps and without setup steps.

Further rules the schema enforces:

- A `community` maintainer needs a `note` (for example "not affiliated with ...").
- At least one source is documentation or a repository. A source is a URL or a `resourceId` from the
  resources collection (#23); validation fails on an unknown resource.
- An operation or compatibility row marked `smoke-test` needs a passed smoke test on the entry.
- Smoke-test evidence paths must be under `/examples/armory/` or `/examples/fnd-001/runs/`.
- Smoke-test and security-review dates are on or before `review.lastVerified`; `nextReview` is after it.
  The page shows "review due" after `nextReview` (build date and visitor clock).
- `withdrawn` keeps a stale entry with its reason and an optional `replacedBy`; a withdrawn entry is
  never listed.

## Stack recipes and katas

Katas reference stack recipes in `metadata.stackRecipeIds` (#81). The extension path stays the one in
`docs/kata-metadata.md`: add the ID to `kataDimensions.stackRecipes` in `src/data/kata-catalog.ts`.
Validation requires both directions: every ID there has an Armory recipe, and every Armory recipe is
there. A recipe component is a registry entry (`entryId`) or an honest learner choice. Katas that cite a
resource in `externalResources` are linked to any entry whose source uses that resource.

## Adding or re-checking an entry

1. Read the official source; record the exact version and how you checked it.
2. Run a smoke test in a disposable folder with a clean environment. Save a sanitized transcript (no home
   or temp paths, no account names, no secrets) under `public/examples/armory/<entry>.json`.
3. Fill in every field from what you saw. Mark operations you did not run as `documented`.
4. Add a check to `tests/armory.test.ts` that reads the evidence file and matches the record.
5. Set `review.lastVerified` to the check date and `nextReview` about a quarter later.

Smoke test helpers (run them with a clean environment, for example `env -i HOME=<empty dir> PATH=...`):

- `node scripts/armory/mcp-smoke.mjs <command> [args] -- '<JSON calls>'` starts an MCP server over stdio,
  lists its tools and runs the calls in order.
- `python -I scripts/armory/ifc-smoke.py <file.ifc>` reads an IFC model and prints counts.

A smoke test shows one task worked once on one setup. It is not a security audit.

## Not covered here

PHANTOMS and OpenClaw facts belong to their own work (#64, &12); add entries only from their records.
