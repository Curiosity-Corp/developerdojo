# Kata metadata and starter catalog

`src/lib/kata-schema.ts` defines the editorial metadata contract. `src/data/kata-catalog.ts` now contains a small set of curated links to existing pages, not the full kata collection or a certification system. The fields page resolves those records during the build and suggests a related foundation. The existing field definitions and resource collection remain authoritative for their own IDs.

`validateKataCatalog` checks schema shape, duplicate kata IDs and routes, and references to the registered fields, resource IDs, foundations, outcomes, artifact types, capabilities and stack recipes. A foundation reference must name a foundation. Internal link checking validates rendered routes. Structural validation does not prove an outcome, external integration, exercise, permission, compliance or professional approval exists.

The current `PRACTICE-*` IDs identify these editorial links only. They do not assign or complete the separately planned `FND-*` or `UX-*` curriculum records; a short exercise can support a foundation without satisfying all of its acceptance criteria.

The outcome, artifact, capability and stack dimensions are small editorial vocabularies in `src/data/kata-catalog.ts`; fields live in `src/lib/fields.ts`, and resources in `src/content/resources`. Add new IDs to the appropriate data before referring to them. A new field or stack recipe can be added without changing the validation algorithm. `crossFieldTransfers` uses field IDs, while `externalResources` uses the existing `publisher/resource` IDs. Add records only for real existing pages; this starter set does not claim to list every kata or represent every sector.

The helper fills optional lists with empty lists to mean **not recorded**, never that a check passed or a requirement is irrelevant. Every entry explicitly decides `professionalReviewRequired` for its stated practice or subsequent real-world use. A true value identifies a review boundary, not proof that an approval took place; a false value does not waive any project-specific legal or professional requirement. Standards, when recorded, require version and scope. Evidence and belt criteria are descriptions for review, not awards.

Before publication, the full recipe still needs review for an authentic outcome and provenance, verified source and terms, reproducible stack and permissions, execution evidence, independent evaluation, adaptation, Randori, ownership and maintenance. Do not publish drafts merely because they pass this metadata schema.
