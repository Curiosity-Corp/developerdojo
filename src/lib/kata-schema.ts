import { z } from 'zod';
import { resourceId } from './schemas';

/**
 * The kata contract (#81). A kata relates independent, composable dimensions by ID: outcomes,
 * artifact types, task capabilities, constraints, stack/agent recipes, fields (domains), learning
 * pathways and shared foundations. Each dimension is reference data supplied to
 * validateKataCatalog (src/lib/kata-catalog.ts), so adding a field, recipe, pathway or constraint is a
 * data change, never a change to this file.
 *
 * Passing this schema is structural validation only. It is not evidence that an outcome is taught,
 * that an external integration works, that a standard is met, or that any review or approval took place.
 */

/** Lower-case slug used by every reference-data dimension (fields, outcomes, recipes, ...). */
export const dimensionId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use a lower-case slug, for example design-journey');
/** Kata IDs: PREFIX-001 for a kata, PREFIX-R01 for a Randori variant. */
export const kataId = z.string().regex(/^[A-Z][A-Z0-9]*-(?:[0-9]{3}|R[0-9]{2})$/, 'use PREFIX-001 or PREFIX-R01, for example FND-001');
const text = z.string().trim().min(1);
const ids = z.array(dimensionId);

/** The practice stages published on /belts (src/lib/dojo-sections.ts). Proposed stages, not issued credentials. */
export const BELT_STAGES = ['practice', 'adapt', 'demonstrate'] as const;

/** Who or what checks a piece of evidence. Recording a method does not mean the check happened. */
export const EVIDENCE_METHODS = ['automated-check', 'self-check', 'peer-review', 'sensei-review', 'professional-review'] as const;

/**
 * A standard the kata's work is read against. version, applicability and reviewScope are required so
 * a standard is never cited without saying which edition, where it applies and what a reviewer looks at.
 * There is deliberately no "compliant" flag: listing a standard is a reference, never a compliance claim.
 * What would show the work meets it belongs in verificationEvidence, citing the standard by name.
 */
export const kataStandardSchema = z.strictObject({
  name: text,
  version: text,
  /** Where and when the standard applies to this kata's outcome (jurisdiction, project type, phase). */
  applicability: text,
  /** What a reviewer checks against the standard here, and what is out of scope. */
  reviewScope: text,
  /** Optional source in the resources collection (publisher/resource). */
  sourceResourceId: resourceId.optional(),
});

/** A description of evidence a learner produces and how it is checked. It is a requirement, not a record that it was met. */
export const kataEvidenceSchema = z.strictObject({
  description: text,
  method: z.enum(EVIDENCE_METHODS),
  /** Names of standards (from this kata's standards list) that this evidence is read against. */
  standards: z.array(text).default(() => []),
});

/** A criterion for one proposed belt stage. Describes what to review; it does not award anything. */
export const kataBeltCriterionSchema = z.strictObject({
  stage: z.enum(BELT_STAGES),
  criterion: text,
});

/**
 * Optional fields and their defaults, in one visible place. An empty list always means "not recorded",
 * never "checked and not needed". professionalReviewRequired has no default: every kata decides it.
 */
export const KATA_DEFAULTS = {
  domainIds: { value: [], why: 'A foundation serves every field. A specialization must name at least one field (validated).' },
  foundationKataIds: { value: [], why: 'A foundation may stand alone. A specialization must reference at least one foundation (validated).' },
  stackRecipeIds: { value: [], why: 'Not recorded yet. Learners may choose their own stack; recording a recipe makes it reproducible.' },
  pathwayIds: { value: [], why: 'Not yet placed in a learning pathway (track). Placement is editorial and can follow later.' },
  constraintIds: { value: [], why: 'No constraint recorded. It does not mean the kata is unconstrained.' },
  externalResources: { value: [], why: 'No external resource recorded. Listing one is not evidence that an integration works.' },
  standards: { value: [], why: 'No standard recorded. It does not mean none applies to real-world use.' },
  verificationEvidence: { value: [], why: 'Evidence not specified yet. A kata without evidence is a draft, not a publishable kata.' },
  beltCriteria: { value: [], why: 'Not mapped to belt stages yet. Belts are proposed practice stages and are not issued.' },
  crossFieldTransfers: { value: [], why: 'No transfer recorded. Transfers name other fields where the same practice applies.' },
} as const;

const defaulted = <T extends z.ZodType>(schema: z.ZodArray<T>) => schema.default(() => []);

export const kataMetadataSchema = z.strictObject({
  id: kataId,
  title: text,
  layer: z.enum(['foundation', 'specialization']),
  outcomeIds: ids.min(1),
  artifactTypes: ids.min(1),
  capabilityIds: ids.min(1),
  /** Required and explicit. true marks a professional review boundary; false waives no legal or professional duty. */
  professionalReviewRequired: z.boolean(),
  domainIds: defaulted(ids),
  foundationKataIds: defaulted(z.array(kataId)),
  stackRecipeIds: defaulted(ids),
  pathwayIds: defaulted(ids),
  constraintIds: defaulted(ids),
  externalResources: defaulted(z.array(resourceId)),
  standards: defaulted(z.array(kataStandardSchema)),
  verificationEvidence: defaulted(z.array(kataEvidenceSchema)),
  beltCriteria: defaulted(z.array(kataBeltCriterionSchema)),
  crossFieldTransfers: defaulted(ids),
}).superRefine((kata, ctx) => {
  if (kata.layer === 'specialization' && kata.domainIds.length === 0) {
    ctx.addIssue({ code: 'custom', path: ['domainIds'], message: 'a specialization needs at least one field' });
  }
  if (kata.layer === 'specialization' && kata.foundationKataIds.length === 0) {
    ctx.addIssue({ code: 'custom', path: ['foundationKataIds'], message: 'a specialization must reference a shared foundation' });
  }
  if (kata.foundationKataIds.includes(kata.id)) {
    ctx.addIssue({ code: 'custom', path: ['foundationKataIds'], message: 'a kata cannot require itself' });
  }
  const listDimensions = ['outcomeIds', 'artifactTypes', 'capabilityIds', 'domainIds', 'foundationKataIds', 'stackRecipeIds', 'pathwayIds', 'constraintIds', 'externalResources', 'crossFieldTransfers'] as const;
  for (const key of listDimensions) {
    const values: readonly string[] = kata[key];
    const repeated = values.find((value, index) => values.indexOf(value) !== index);
    if (repeated) ctx.addIssue({ code: 'custom', path: [key], message: `${repeated} is listed twice` });
  }
  kata.crossFieldTransfers.forEach((field, index) => {
    if (kata.domainIds.includes(field)) {
      ctx.addIssue({ code: 'custom', path: ['crossFieldTransfers', index], message: `${field} is already a field of this kata; a transfer names a different field` });
    }
  });
  const standardNames = new Set<string>();
  kata.standards.forEach((standard, index) => {
    if (standardNames.has(standard.name)) ctx.addIssue({ code: 'custom', path: ['standards', index, 'name'], message: `standard ${standard.name} is listed twice` });
    standardNames.add(standard.name);
  });
  kata.verificationEvidence.forEach((evidence, index) => {
    evidence.standards.forEach((name, standardIndex) => {
      if (!standardNames.has(name)) {
        ctx.addIssue({ code: 'custom', path: ['verificationEvidence', index, 'standards', standardIndex], message: `standard ${name} is not in this kata's standards` });
      }
    });
    if (evidence.method === 'professional-review' && !kata.professionalReviewRequired) {
      ctx.addIssue({ code: 'custom', path: ['verificationEvidence', index, 'method'], message: 'professional-review evidence needs professionalReviewRequired: true' });
    }
  });
});

/** What an author writes: optional lists may be omitted (see KATA_DEFAULTS). */
export type KataMetadataInput = z.input<typeof kataMetadataSchema>;
/** What validation returns: every list present. */
export type KataMetadata = z.output<typeof kataMetadataSchema>;
