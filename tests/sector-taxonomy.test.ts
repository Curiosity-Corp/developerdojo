import { describe, expect, it } from 'vitest';
import { fields } from '../src/lib/fields';
import { sectorGroupInputs, sectorGroups } from '../src/data/sector-taxonomy';
import { sectorPacks } from '../src/data/sector-packs';
import { checkSectorTaxonomy, sectorCoverage } from '../src/lib/sector-taxonomy';

// The sector taxonomy plan (#93): ten groups holding every field once, with delivered coverage derived, never typed.

const fieldIds = fields.map((field) => field.id);

describe('sector taxonomy plan', () => {
  it('has the ten planned groups and puts every field in exactly one', () => {
    expect(sectorGroups.map((group) => group.id)).toEqual([
      'digital-ux', 'spatial-media', 'built-environment', 'industrial-hardware', 'robotics',
      'science-engineering', 'health-life-sciences', 'business-public-service', 'energy-agriculture', 'learning-communications',
    ]);
    expect(checkSectorTaxonomy(sectorGroupInputs, fieldIds)).toEqual([]);
    expect(sectorGroups.flatMap((group) => group.fieldIds).sort()).toEqual([...fieldIds].sort());
  });

  it('rejects a field in no group, a field in two groups and an unknown field', () => {
    const groups = structuredClone(sectorGroupInputs) as unknown as { id: string; name: string; fieldIds: string[]; nextPack: string }[];
    groups[0]!.fieldIds = ['software', 'ux', 'data', 'robotics', 'no-such-field'];
    const problems = checkSectorTaxonomy(groups, [...fieldIds, 'new-field']).join('\n');
    expect(problems).toMatch(/field robotics is already in the digital-ux group/);
    expect(problems).toMatch(/field no-such-field is not in src\/lib\/fields.ts/);
    expect(problems).toMatch(/field cybersecurity is in no sector group/);
    expect(problems).toMatch(/field new-field is in no sector group/);
  });

  it('derives what is delivered from the packs and tracks, apart from what the plan lists', () => {
    const coverage = new Map(sectorCoverage(sectorGroups, fields, sectorPacks).map((row) => [row.group.id, row]));
    expect(coverage.get('digital-ux')?.pathways.map((pathway) => pathway.packId)).toEqual(['ux']);
    expect(coverage.get('built-environment')?.pathways.map((pathway) => pathway.packId)).toEqual(['bim']);
    expect(coverage.get('energy-agriculture')?.pathways.map((pathway) => pathway.packId)).toEqual(['agriculture']);
    expect(coverage.get('science-engineering')?.pathways.map((pathway) => pathway.packId)).toEqual(['science']);
    expect(coverage.get('business-public-service')?.pathways.map((pathway) => pathway.packId)).toEqual(['finance']);
    expect(coverage.get('industrial-hardware')?.pathways.map((pathway) => pathway.packId)).toEqual(['manufacturing']);
    expect(coverage.get('spatial-media')?.pathways.map((pathway) => pathway.packId)).toEqual(['media']);
    expect(coverage.get('learning-communications')?.pathways.map((pathway) => pathway.packId)).toEqual(['education']);
    expect(coverage.get('health-life-sciences')?.pathways.map((pathway) => pathway.packId)).toEqual(['health']);
    expect(coverage.get('robotics')?.pathways.map((pathway) => pathway.packId)).toEqual(['robotics']);
    expect(coverage.get('robotics')?.coverage).toBe('sector-pathway');
    expect(coverage.get('health-life-sciences')?.coverage).toBe('sector-pathway');
    expect(coverage.get('spatial-media')?.coverage).toBe('sector-pathway');
    expect(coverage.get('learning-communications')?.coverage).toBe('sector-pathway');
    const delivered = [...coverage.values()].filter((row) => row.coverage === 'sector-pathway').length;
    expect(delivered).toBe(sectorPacks.length);
  });
});
