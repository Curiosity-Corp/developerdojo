# Kata metadata: initial contract

`src/lib/kata-schema.ts` defines an initial metadata contract for editorial drafts. It is not yet an Astro content collection, a catalogue, or a publication gate. A valid record alone does not prove an outcome, tool, integration, exercise, assessment, or professional approval exists.

Dimensions are independent lists of stable lowercase hyphenated IDs: outcomes, artifact types, fields, capabilities and stack recipes. A kata can relate to several of each; a foundation can have no field and a specialization must name at least one field and a shared foundational kata. Kata identifiers use a prefix and three digits, for example `FND-001`; Randori identifiers may use an R and two digits, as in `BIM-R01`. `externalResources` uses the existing `publisher/resource` IDs. References are not yet resolved against a registry; that validation and an editor workflow are future work.

All lists are explicit. An empty list means no entries are recorded, not that a check passed or that a requirement is irrelevant. `professionalReviewRequired` requires an explicit decision for the scenario. Standards include their version and scope; the record does not assert compliance. Evidence and belt criteria are descriptions to be reviewed, not claims of certification.

Before publication, the full recipe must also be reviewed for an authentic outcome and provenance, verified source exercise and terms, reproducible stack and permissions, roles and prompts, execution evidence, independent evaluation, adaptation, Randori, ownership and maintenance. Do not publish drafts merely because they pass this metadata schema. Synthetic tests illustrate five fields; they are not real katas.
