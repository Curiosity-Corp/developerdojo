# Kata metadata contract

The kata contract (#81) lives in `src/lib/kata-schema.ts`; catalog validation lives in `src/lib/kata-catalog.ts`. `src/data/kata-catalog.ts` holds the editorial vocabularies and a small set of curated links to existing pages. It is not the full kata collection or a certification system. The fields page resolves those records during the build and suggests a related foundation. The field definitions (`src/lib/fields.ts`), the resource collection and the track collection remain authoritative for their own IDs.

## Composable dimensions

A kata relates independent dimensions by ID. Each dimension is reference data, so adding a field, recipe, pathway, constraint or outcome means extending a list. It never means changing the schema or the validator.

| Dimension | Kata field | Registry (`KataReferences` key) | Source of IDs |
| --- | --- | --- | --- |
| Outcomes | `outcomeIds` (1 or more) | `outcomes` | `kataDimensions` in `src/data/kata-catalog.ts` |
| Artifact types | `artifactTypes` (1 or more) | `artifacts` | `kataDimensions` |
| Task capabilities | `capabilityIds` (1 or more) | `capabilities` | `kataDimensions` |
| Constraints | `constraintIds` | `constraints` | `kataDimensions` |
| Stack and agent configuration | `stackRecipeIds` | `stackRecipes` | `kataDimensions` |
| Fields (domains) | `domainIds`, `crossFieldTransfers` | `fields` | `src/lib/fields.ts` |
| Learning pathways | `pathwayIds` | `pathways` | track slugs, `src/content/tracks` |
| External resources | `externalResources`, `standards[].sourceResourceId` | `resources` | `src/content/resources` (`publisher/resource`) |
| Shared foundations | `foundationKataIds` | the catalog itself | kata IDs with `layer: foundation` |

`constraintIds` is the documented equivalent of the earlier free-text `constraints`. A constraint is now a shared, reusable ID instead of prose repeated in each kata.

## Fields and defaults

Required on every kata: `id` (`PREFIX-001`, or `PREFIX-R01` for a Randori variant), `title`, `layer` (`foundation` or `specialization`), `outcomeIds`, `artifactTypes`, `capabilityIds` and `professionalReviewRequired`.

`professionalReviewRequired` has no default; every kata decides it. `true` marks a professional review boundary for the practice or its real-world use. It is not proof that a review took place. `false` waives no project-specific legal or professional requirement.

Every other field is optional. An omitted field takes the default in `KATA_DEFAULTS` (`src/lib/kata-schema.ts`), which records the reason next to each value, and a test fails if the schema and that table drift apart. An empty list always means **not recorded**. It never means checked, passed or not needed.

| Field | Default | Why |
| --- | --- | --- |
| `domainIds` | `[]` | A foundation serves every field. A specialization must name at least one field. |
| `foundationKataIds` | `[]` | A foundation may stand alone. A specialization must reference at least one foundation. |
| `stackRecipeIds` | `[]` | Not recorded yet. Learners may choose their own stack. |
| `pathwayIds` | `[]` | Not placed in a track yet. |
| `constraintIds` | `[]` | No constraint recorded. That does not mean the kata is unconstrained. |
| `externalResources` | `[]` | None recorded. A listed resource is not evidence that an integration works. |
| `standards` | `[]` | None recorded. That does not mean none applies to real-world use. |
| `verificationEvidence` | `[]` | Evidence not specified yet. Without it the kata is a draft. |
| `beltCriteria` | `[]` | Not mapped to belt stages yet. |
| `crossFieldTransfers` | `[]` | No transfer recorded. |

## Standards, evidence and belts

- **Standards** are `{ name, version, applicability, reviewScope, sourceResourceId? }`. A standard cannot be cited without its edition, where it applies, and what a reviewer checks. There is deliberately no compliance flag: listing a standard is a reference, never a compliance claim.
- **Verification evidence** is `{ description, method, standards? }`. `method` is one of `automated-check`, `self-check`, `peer-review`, `sensei-review` or `professional-review`. Evidence may cite standards by name, and only standards listed on the same kata. Evidence with `professional-review` requires `professionalReviewRequired: true`. Evidence describes what must be produced and checked; it is not a record that the check happened.
- **Belt criteria** are `{ stage, criterion }`. `stage` is one of the three practice stages published on `/belts` (`practice`, `adapt`, `demonstrate`). Belts are proposed practice stages; they are not issued, and a criterion awards nothing.

## What validation rejects

`kataMetadataSchema` rejects, on a single kata:
- missing or empty required fields, unknown keys (a misspelt field is not silently dropped), and malformed IDs;
- a specialization without a field or without a foundation, and a kata that requires itself;
- an ID repeated within one list, and a transfer to a field the kata already covers;
- a standard listed twice, evidence citing a standard that is not on the kata, and professional-review evidence without a review boundary.

`validateKataCatalog(entries, references)` additionally rejects:
- duplicate kata IDs or routes;
- any reference to an ID missing from its registry;
- a foundation reference that is missing or is not a foundation;
- foundation cycles.

It reports every problem in one `KataCatalogError` (`.problems`, one line per problem, each naming the kata). Internal link checking validates rendered routes.

Structural validation does not prove that an outcome, external integration, exercise, permission, compliance or professional approval exists. Fixtures used to exercise the contract are labelled as fixtures.

## Starter catalog

The current `PRACTICE-*` IDs identify editorial links only. They do not assign or complete the separately planned `FND-*` or `UX-*` curriculum records. A short exercise can support a foundation without satisfying all of its acceptance criteria. Add records only for real existing pages; this starter set does not claim to list every kata or represent every sector.

Before publication, the full recipe still needs review for an authentic outcome and provenance, verified source and terms, reproducible stack and permissions, execution evidence, independent evaluation, adaptation, Randori, ownership and maintenance. Do not publish drafts merely because they pass this metadata schema.
