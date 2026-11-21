import { describe, expect, it } from 'vitest';
import { BELT_STAGES, KATA_DEFAULTS, kataMetadataSchema } from '../src/lib/kata-schema';

// Synthetic contract fixtures: they exercise the schema; they are not published katas or evidence.
const minimal = {
  id: 'FND-001', title: 'Example foundation', layer: 'foundation',
  outcomeIds: ['example-outcome'], artifactTypes: ['example-artifact'], capabilityIds: ['compare-stacks'],
  professionalReviewRequired: false,
} as const;
const specialization = { ...minimal, id: 'EX-001', layer: 'specialization', domainIds: ['ux'], foundationKataIds: ['FND-001'] } as const;
const standard = { name: 'Example Standard', version: '2024', applicability: 'Example projects only', reviewScope: 'Naming only; not structural adequacy' };
const messages = (input: unknown): string[] => {
  const result = kataMetadataSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
};

describe('kata contract', () => {
  it('fills every optional list with its documented default, and nothing else', () => {
    const parsed = kataMetadataSchema.parse(minimal);
    for (const [key, { value, why }] of Object.entries(KATA_DEFAULTS)) {
      expect(parsed[key as keyof typeof parsed], key).toEqual(value);
      expect(why.length, key).toBeGreaterThan(20);
    }
    const required = ['id', 'title', 'layer', 'outcomeIds', 'artifactTypes', 'capabilityIds', 'professionalReviewRequired'];
    expect(Object.keys(parsed).sort()).toEqual([...required, ...Object.keys(KATA_DEFAULTS)].sort());
  });

  it('gives each parse its own default lists', () => {
    const first = kataMetadataSchema.parse(minimal);
    first.domainIds.push('mutated');
    expect(kataMetadataSchema.parse(minimal).domainIds).toEqual([]);
  });

  it('requires an explicit professional-review decision and at least one outcome, artifact and capability', () => {
    expect(messages({ ...minimal, professionalReviewRequired: undefined })).not.toEqual([]);
    for (const key of ['outcomeIds', 'artifactTypes', 'capabilityIds']) {
      expect(messages({ ...minimal, [key]: [] }), key).not.toEqual([]);
    }
  });

  it('requires a specialization to name a field and a shared foundation', () => {
    expect(messages(specialization)).toEqual([]);
    expect(messages({ ...specialization, domainIds: [] })).toContain('domainIds: a specialization needs at least one field');
    expect(messages({ ...specialization, foundationKataIds: [] })).toContain('foundationKataIds: a specialization must reference a shared foundation');
    expect(messages({ ...minimal, foundationKataIds: ['FND-001'] })).toContain('foundationKataIds: a kata cannot require itself');
    expect(messages({ ...minimal, id: 'BIM-R01' })).toEqual([]);
    expect(messages({ ...minimal, id: 'fnd-1' })).not.toEqual([]);
  });

  it('requires standards to carry version, applicability and review scope, with no compliance flag', () => {
    expect(messages({ ...minimal, standards: [standard] })).toEqual([]);
    for (const key of ['version', 'applicability', 'reviewScope'] as const) {
      const { [key]: _omitted, ...partial } = standard;
      expect(messages({ ...minimal, standards: [partial] }), key).not.toEqual([]);
    }
    expect(messages({ ...minimal, standards: [{ ...standard, compliant: true }] })).not.toEqual([]);
    expect(messages({ ...minimal, standards: [{ name: 'Old shape', version: '1', scope: 'x' }] })).not.toEqual([]);
    expect(messages({ ...minimal, standards: [standard, standard] })).toContain('standards.1.name: standard Example Standard is listed twice');
  });

  it('keeps evidence separate from standards and ties professional evidence to a review boundary', () => {
    const evidence = { description: 'Reviewer compares names to the standard', method: 'peer-review', standards: ['Example Standard'] };
    expect(messages({ ...minimal, standards: [standard], verificationEvidence: [evidence] })).toEqual([]);
    expect(messages({ ...minimal, verificationEvidence: [evidence] })).toContain("verificationEvidence.0.standards.0: standard Example Standard is not in this kata's standards");
    expect(messages({ ...minimal, verificationEvidence: [{ description: 'Signed off', method: 'professional-review' }] }))
      .toContain('verificationEvidence.0.method: professional-review evidence needs professionalReviewRequired: true');
    expect(messages({ ...minimal, professionalReviewRequired: true, verificationEvidence: [{ description: 'Signed off', method: 'professional-review' }] })).toEqual([]);
    expect(messages({ ...minimal, verificationEvidence: [{ description: 'x', method: 'certified' }] })).not.toEqual([]);
    expect(messages({ ...minimal, verificationEvidence: ['free text evidence'] })).not.toEqual([]);
  });

  it('maps belt criteria to the published practice stages only', () => {
    expect(BELT_STAGES).toEqual(['practice', 'adapt', 'demonstrate']);
    expect(messages({ ...minimal, beltCriteria: BELT_STAGES.map((stage) => ({ stage, criterion: `Shows ${stage}` })) })).toEqual([]);
    expect(messages({ ...minimal, beltCriteria: [{ stage: 'black', criterion: 'x' }] })).not.toEqual([]);
    expect(messages({ ...minimal, beltCriteria: ['free text'] })).not.toEqual([]);
  });

  it('rejects repeated references and a transfer to a field the kata already covers', () => {
    expect(messages({ ...specialization, outcomeIds: ['a', 'a'] })).toContain('outcomeIds: a is listed twice');
    expect(messages({ ...specialization, crossFieldTransfers: ['ux'] })).toContain('crossFieldTransfers.0: ux is already a field of this kata; a transfer names a different field');
    expect(messages({ ...specialization, crossFieldTransfers: ['data', 'energy'] })).toEqual([]);
  });

  it('rejects unknown keys so a misspelt field is not silently dropped', () => {
    expect(messages({ ...minimal, domainIDs: ['ux'] })).not.toEqual([]);
    expect(messages({ ...minimal, constraints: ['free text'] })).not.toEqual([]);
  });
});
