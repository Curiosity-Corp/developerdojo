# Kata taxonomy: editing and migration

This guide is for editors who add fields, foundations and specializations to the kata taxonomy (#82). The contract itself, with every field, its default and what validation rejects, is in [kata-metadata.md](kata-metadata.md). This guide does not repeat that reference. It covers how to use the contract, how a record moves from idea to published kata, and how the taxonomy sits on top of the routes, lessons, resources and saved progress that already exist.

It changes no program rule. The decision record for the kata and belt program is tracked in #80, and nothing here replaces it.

## The pieces and where they live

| Piece | File | Owned by |
| --- | --- | --- |
| Kata contract (schema, defaults) | `src/lib/kata-schema.ts` | contract maintainers (#81) |
| Catalog validation | `src/lib/kata-catalog.ts` | contract maintainers (#81) |
| Vocabularies: outcomes, artifacts, capabilities, constraints, stack recipes | `kataDimensions` in `src/data/kata-catalog.ts` | editors |
| Catalog records that link real pages | `kataCatalog` in `src/data/kata-catalog.ts` | editors |
| Fields (domains) | `src/lib/fields.ts` | editors |
| Learning pathways | track slugs, `src/content/tracks/<slug>.md` | track editors ([content-model.md](content-model.md#tracks)) |
| External resources | `src/content/resources/<publisher>/<resource>.yaml` | catalog maintainers (#23, [content-model.md](content-model.md#resources)) |
| Kata pages | `src/pages/katas/<slug>.astro`, listed in `src/data/kata-directory.ts` | kata maintainers |
| Worked examples across six sectors | `tests/fixtures/kata-sectors.ts` | fixtures only, see below |

Everything an editor adds is data. A new field, outcome, recipe, constraint or pathway never needs a change to the schema or the validator. `tests/kata-catalog.test.ts` and `tests/kata-sector-fixtures.test.ts` show this with a `maritime` field.

## Field dictionary

For each field: what it is for, an example from the sector fixtures, and what an empty value means. "Required" is enforced by the schema. "Not recorded" is the meaning of every empty list. "Inapplicable" is explained below the table.

| Field | Required? | Meaning | Example (fixture) |
| --- | --- | --- | --- |
| `id` | yes | Stable kata ID, `PREFIX-001`; a Randori variant is `PREFIX-R01`. Never reused or renamed. | `FIXBE-001` |
| `title` | yes | What the learner does, in plain words. | "Take off wall quantities from an IFC model" |
| `layer` | yes | `foundation` (serves every field) or `specialization` (one field's version of a practice). | `specialization` |
| `outcomeIds` | yes, 1+ | The finished result the learner can show. One outcome may belong to several fields. | `traceable-batch-record` (biotechnology and manufacturing) |
| `artifactTypes` | yes, 1+ | What the learner hands over. | `quantity-schedule` |
| `capabilityIds` | yes, 1+ | The task skills practised. | `inspect-model`, `calculate` |
| `professionalReviewRequired` | yes, no default | `true` marks a professional review boundary before real-world use. It does not mean a review happened. | `true` for the IFC takeoff |
| `domainIds` | specialization: 1+ | Fields from `src/lib/fields.ts`. | `architecture-bim`, `construction` |
| `foundationKataIds` | specialization: 1+ | Foundations practised first. Must be `layer: foundation`, no cycles. | `FIXFND-001`, `FIXFND-003` |
| `stackRecipeIds` | no | Tool and agent setups that reproduce the kata. Several per field are expected. | `ifcopenshell-python`, `speckle-candidate` |
| `pathwayIds` | no | Tracks the kata belongs to. | `lab-automation-in-code` |
| `constraintIds` | no | Shared limits on the practice. | `simulation-only`, `fictional-data` |
| `externalResources` | no | Resources from the catalogue. A listed resource is not proof that an integration works. | `buildingsmart/ifc-wall-example` |
| `standards` | no | `{ name, version, applicability, reviewScope, sourceResourceId? }`. A reference, never a compliance claim. | IFC 4.3 (ISO 16739-1:2024), for reading wall quantities only |
| `verificationEvidence` | no | `{ description, method, standards? }`: what is produced and how it is checked. | "Each quantity traced to the entity and property", `self-check` |
| `beltCriteria` | no | `{ stage, criterion }` on the proposed stages `practice`, `adapt`, `demonstrate`. Awards nothing. | `demonstrate`: "Fixes one finding and shows the before and after" |
| `crossFieldTransfers` | no | Other fields where the same practice applies. | `manufacturing` |

### Not recorded versus inapplicable

The contract stores lists, and an empty list always means **not recorded**. It never means "checked and not needed". The schema has no "not applicable" value, on purpose: a missing standard or review boundary must stay visibly unanswered rather than look settled.

Only two cases are inapplicable by structure, and the schema enforces both:

- A foundation has no `domainIds` and needs no `foundationKataIds`, because it serves every field.
- A specialization never lists one of its own fields in `crossFieldTransfers`.

If an editor decides that something else does not apply, for example that no standard is relevant to a purely fictional exercise, they write the decision and the reason in the kata's tracking issue or MR. The list stays empty. `professionalReviewRequired` is the exception: it has no default, so every kata states it, and `false` waives no legal or professional duty.

## Status, maintainers and dates

The contract validates structure only. A kata's editorial status, its maintainer and its verification dates are kept where [catalog-lifecycle.md](catalog-lifecycle.md) already keeps them for every catalog item: in the kata's tracking issue and MR. They are not schema fields, so a record cannot claim a check in a value that nobody had to perform.

| Status | Meaning | Where it shows | Move on when |
| --- | --- | --- | --- |
| **Fixture** | A synthetic record that tests the taxonomy. It has a `FIX*` ID and a `/katas/fixture-*` route that does not exist. | `tests/fixtures/` only | never published; a real kata is written from scratch, with its own ID |
| **Draft** | A real record whose page, evidence or review is incomplete. It may be in `kataCatalog` only if its page exists. | tracking issue labelled draft | the publication checks below pass and a maintainer is assigned |
| **Published** | The page is live, linked from `kataCatalog` and listed in `KATA_DIRECTORY`. | the site | its review cadence passes, or a source, stack or standard changes |
| **Review due** | The last check is older than the cadence, or a change was reported. The page stays, with its last real check date. | issue, plus a notice on the page if learners are affected | the check is repeated (back to Published) or the kata is withdrawn |
| **Withdrawn** | The kata is unsafe or no longer works. Its instructions are removed or disabled, and its route keeps an honest notice or points to an alternative. | the page notice and the issue | a fixed version is reviewed (back to Published) |

Allowed moves: Fixture is a dead end. Draft goes to Published. Published goes to Review due. Review due goes back to Published, or to Withdrawn. Withdrawn goes back to Published. Never delete an ID or a route on withdrawal: saved progress and outside links point at them.

For every Draft, Published or Review due kata, the tracking issue records:

- **Maintainer role**, and the person who actually took the work, once someone has. An unassigned review stays unassigned.
- **Last verified**: the date of a check that was actually done, what was checked (steps, environment, versions) and what was not. Never backdated, and never moved by a partial review.
- **Next review**: the cadence from [catalog-lifecycle.md](catalog-lifecycle.md#what-to-review). The default is quarterly. Anything that cites a standard is also reviewed when that standard is revised.
- **Professional reviewer and decision**, only when such a review took place.

## Checklist: add a field

1. Add `{ id, name, examples }` to `src/lib/fields.ts`, using a lower-case slug. Add `trackHref` only when a track exists.
2. Write no code. The validator reads fields from that list, and the fixture test shows a new field (`maritime`) validating with no code change.
3. Connect existing content: put the new field ID in the `domainIds` or `crossFieldTransfers` of katas that already fit, and in the `track` of any lessons that belong to it.
4. Add at least one specialization (next checklist) before the field is promoted on the home page or the field page.
5. Run `npx vitest run` and `npm run check`. Unknown IDs fail with a message naming the kata.

## Checklist: add a specialization

A specialization is one field's version of a shared practice. It extends a foundation and does not copy it.

1. **Outcome first.** Name the finished artifact and who uses it. Reuse an outcome ID if another field already has the same result. That is the point of shared outcomes.
2. **Pick foundations.** Reference at least one existing `layer: foundation` kata. If no foundation fits, propose one separately; do not bury foundation content in the specialization.
3. **Add vocabulary.** Put any new outcome, artifact, capability, constraint or recipe ID in `kataDimensions` first. Use existing IDs where they fit.
4. **Record recipes honestly.** List at least one recipe a learner can run today. Describe any integration that has not been run for the Dojo as a candidate in the MR and on the page.
5. **Standards.** Give the edition, the applicability and what a reviewer checks. Set `professionalReviewRequired: true` for regulated, safety-critical or licensed work. Never write "compliant".
6. **Evidence and belts.** Describe the evidence and its check method. Map it to belt stages only when the criterion is real.
7. **Page and directory.** Create `src/pages/katas/<slug>.astro`, add it to `KATA_DIRECTORY`, then add the `kataCatalog` record with `href: '/katas/<slug>'`. A record never points at a page that does not exist.
8. **Tracking issue.** Record its status (Draft), maintainer role, sources opened with dates, what was run and what was not, and the next review.
9. **Validate.** Run `npx vitest run`, `npm run check` and `npm run build`. Passing proves only that the structure is valid. Publication still needs the review listed under "Starter catalog" in [kata-metadata.md](kata-metadata.md#starter-catalog).

Adding a recipe, constraint or pathway follows step 3 alone: add the ID to its registry, then use it.

## Worked examples: the sector fixtures

`tests/fixtures/kata-sectors.ts` holds synthetic records for six sectors and one new field:

| Sector | Fields | What it shows |
| --- | --- | --- |
| SaaS and UX | `ux`, `software` | the same outcome (`usable-onboarding`) reused by public service; three recipes for `ux` |
| Built environment | `architecture-bim`, `construction`, `energy` | IFC 4.3 cited with scope and no compliance claim; professional review boundary |
| Life sciences | `biotechnology`, `health`, `science` | simulation-only constraint; 21 CFR Part 11 used as vocabulary, not as a validation claim |
| Manufacturing and robotics | `robotics`, `manufacturing` | `traceable-batch-record` shared with biotechnology; ISO 10218-1 as background only |
| Agriculture and natural resources | `agriculture`, `data` | the published `clean-data` outcome reused in a new field |
| Public service and finance | `public-service`, `ux`, `finance` | legal and accounting review boundaries |
| New field | `maritime` | added as reference data, reusing the shared foundations |

They are **fixtures**. None has a page, a run, a reviewer or a working integration, and integrations named with `-candidate` have not been run for the Dojo. Use them as examples of shape, not as content to publish.

## Migration from the existing collections

The taxonomy is added on top of what exists. Nothing is renamed or moved, so no data migration is needed.

| Existing item | Identifier | Where it joins the taxonomy | Change |
| --- | --- | --- | --- |
| Kata pages | route `/katas/<slug>` | `href` of a `kataCatalog` record | none; routes stay |
| Kata discovery directory | `KATA_DIRECTORY` (`src/data/kata-directory.ts`) | the discovery list of kata pages; an entry needs no taxonomy record | none; every listed route keeps its page |
| Starter taxonomy records | `PRACTICE-001` to `PRACTICE-008` | `kataCatalog` | IDs kept; they never take planned `FND-*` or `UX-*` IDs |
| Tracks | slug in `src/content/tracks`, URL `/library/tracks/<slug>/` | `pathwayIds`; `fields[].trackHref` | none; URLs stay ([track-urls.md](track-urls.md)) |
| Lessons | library path without `.md`, URL `/library/<path>/` | through their track (`pathwayIds`) | none |
| Resources | `publisher/resource` (#23) | `externalResources`, `standards[].sourceResourceId` | none; one catalogue, no copies |
| Search groups | derived from the URL (`src/lib/search-groups.ts`) | katas group by their `/katas/` route | none; search needs no taxonomy metadata |
| Train page progress | `dojo-progress-v1`, `{ completed: { moduleId: date } }` | not keyed by kata ID | none |
| Lesson progress | `dojo:lessons`, version 1, keyed by lesson path | not keyed by kata ID | none |
| Checklists and drafts | `dojo:checklist:<pageId>`, `dojo:draft:<pageId>` | page IDs, not kata IDs | none |
| Belt evidence and self-assessment | `dojo:belt-evidence`, `dojo:self-assessment:track-a` | belt stages match `BELT_STAGES` | none |

The one deliberate contract change is in #81: free-text `constraints` became registry-checked `constraintIds`. No published record used `constraints`, so no record needed rewriting.

`tests/kata-taxonomy-migration.test.ts` checks this with real repository data and representative saved values:

- every `kataCatalog` and `KATA_DIRECTORY` route has its page, and every field's track exists;
- the storage keys above are unchanged;
- a saved Train record (`developer-week-1`, `developer-week-2`) still loads;
- a saved lesson record (a week lesson and a robotics track lesson) still names existing lessons;
- every Train module still points at an existing lesson.

If a route or key ever has to change, follow [track-urls.md](track-urls.md#if-a-track-really-must-change). Add a redirect and a reviewed migration of the saved value in the same MR, and extend the migration test with the old value.
