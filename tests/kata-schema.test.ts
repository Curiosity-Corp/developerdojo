import { describe, expect, it } from 'vitest';
import { kataMetadataSchema } from '../src/lib/kata-schema';

// Synthetic editorial fixtures exercise the model; they are not published katas or evidence.
const base = {
  id: 'FND-001', title: 'Example foundation', layer: 'foundation',
  outcomeIds: ['example-outcome'], artifactTypes: ['example-artifact'], domainIds: [],
  capabilityIds: ['compare-stacks'], foundationKataIds: [], stackRecipeIds: [],
  externalResources: [], constraints: [], standards: [], professionalReviewRequired: false,
  verificationEvidence: [], beltCriteria: [], crossFieldTransfers: [],
};

describe('kata metadata', () => {
  it('supports shared foundations and five different field fixtures without changing the schema', () => {
    expect(kataMetadataSchema.safeParse(base).success).toBe(true);
    for (const domain of ['saas-ux', 'bim', 'robotics', 'agriculture', 'health-science']) {
      const result = kataMetadataSchema.safeParse({
        ...base, id: 'EX-001', layer: 'specialization', domainIds: [domain],
        foundationKataIds: ['FND-001'], professionalReviewRequired: domain === 'health-science',
      });
      expect(result.success, domain).toBe(true);
    }
  });

  it('requires specializations to identify a field and shared foundation', () => {
    expect(kataMetadataSchema.safeParse({ ...base, layer: 'specialization' }).success).toBe(false);
    expect(kataMetadataSchema.safeParse({ ...base, foundationKataIds: ['FND-001'] }).success).toBe(false);
    expect(kataMetadataSchema.safeParse({ ...base, id: 'BIM-R01' }).success).toBe(true);
  });

  it('requires scoped, versioned standards and an explicit professional-review decision', () => {
    expect(kataMetadataSchema.safeParse({ ...base, standards: [{ name: 'Example' }] }).success).toBe(false);
    expect(kataMetadataSchema.safeParse({ ...base, professionalReviewRequired: undefined }).success).toBe(false);
  });
});
