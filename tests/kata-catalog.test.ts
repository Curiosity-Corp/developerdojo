import { describe, expect, it } from 'vitest';
import { kataCatalog, kataDimensions } from '../src/data/kata-catalog';
import { fields } from '../src/lib/fields';
import { validateKataCatalog, type KataReferences } from '../src/lib/kata-catalog';

const refs: KataReferences = {
  fields: fields.map((field) => field.id),
  resources: ['renovate/docs', 'reuse/reuse-software'],
  ...kataDimensions,
};

describe('kata catalog reference integrity', () => {
  it('links existing field examples to reusable foundations and more than one stack recipe', () => {
    const entries = validateKataCatalog(kataCatalog, refs);
    const specializations = entries.filter((entry) => entry.metadata.layer === 'specialization');
    expect(new Set(specializations.flatMap((entry) => entry.metadata.domainIds)).size).toBeGreaterThanOrEqual(5);
    expect(specializations.filter((entry) => entry.metadata.foundationKataIds.includes('FND-001')).length).toBeGreaterThanOrEqual(2);
    expect(specializations.find((entry) => entry.metadata.id === 'OSS-001')?.metadata.stackRecipeIds).toEqual(['assistant-and-browser', 'git-and-node']);
    expect(specializations.find((entry) => entry.metadata.id === 'BIM-001')?.metadata.professionalReviewRequired).toBe(true);
  });

  it('rejects unknown fields, resources, dimensions and missing or non-foundation references', () => {
    const original = kataCatalog.find((entry) => entry.metadata.id === 'OSS-001');
    expect(original).toBeDefined();
    if (!original) throw new Error('test fixture missing');
    const changed = { ...original, metadata: { ...original.metadata, domainIds: ['unknown-field'], externalResources: ['unknown/item'], outcomeIds: ['unknown-outcome'], foundationKataIds: ['MISSING-001', 'UX-001'] } };
    expect(() => validateKataCatalog(kataCatalog.map((entry) => entry === original ? changed : entry), refs)).toThrow(/unknown field unknown-field/);
    try { validateKataCatalog(kataCatalog.map((entry) => entry === original ? changed : entry), refs); }
    catch (error) {
      expect(String(error)).toContain('unknown resource unknown/item');
      expect(String(error)).toContain('unknown outcome unknown-outcome');
      expect(String(error)).toContain('unknown foundation MISSING-001');
      expect(String(error)).toContain('UX-001 is not a foundation');
    }
  });

  it('rejects duplicate IDs and routes', () => {
    const first = kataCatalog[0];
    expect(first).toBeDefined();
    if (!first) throw new Error('test fixture missing');
    expect(() => validateKataCatalog([...kataCatalog, first], refs)).toThrow(/duplicate kata ID/);
    const renamed = { ...first, metadata: { ...first.metadata, id: 'FND-099' } };
    expect(() => validateKataCatalog([...kataCatalog, renamed], refs)).toThrow(/duplicate kata route/);
  });

  it('accepts a new field as reference data without a schema change', () => {
    const original = kataCatalog.find((entry) => entry.metadata.id === 'DATA-001');
    expect(original).toBeDefined();
    if (!original) throw new Error('test fixture missing');
    const example = { ...original, href: '/katas/example-new-field', metadata: { ...original.metadata, id: 'NEW-001', domainIds: ['new-field'], foundationKataIds: ['FND-001'] } };
    expect(validateKataCatalog([...kataCatalog, example], { ...refs, fields: [...refs.fields, 'new-field'] })).toHaveLength(kataCatalog.length + 1);
  });
});
