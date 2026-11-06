import { z } from 'zod';
import { resourceId } from './schemas';

// Identifiers relate independent dimensions; adding a field does not require a code change.
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const kataId = z.string().regex(/^[A-Z][A-Z0-9]*-(?:[0-9]{3}|R[0-9]{2})$/);
const text = z.string().trim().min(1);
const ids = z.array(id);

/**
 * Metadata for an editorial kata draft. This is not a publication gate: the real
 * outcome, exercise, permissions, execution and independent review still need
 * to be verified before a kata is presented as operational.
 */
export const kataMetadataSchema = z.strictObject({
  id: kataId,
  title: text,
  layer: z.enum(['foundation', 'specialization']),
  outcomeIds: ids.min(1),
  artifactTypes: ids.min(1),
  domainIds: ids,
  capabilityIds: ids.min(1),
  foundationKataIds: z.array(kataId),
  stackRecipeIds: ids,
  externalResources: z.array(resourceId),
  constraints: z.array(text),
  standards: z.array(z.strictObject({ name: text, version: text, scope: text })),
  professionalReviewRequired: z.boolean(),
  verificationEvidence: z.array(text),
  beltCriteria: z.array(text),
  crossFieldTransfers: ids,
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
});

export type KataMetadata = z.infer<typeof kataMetadataSchema>;
