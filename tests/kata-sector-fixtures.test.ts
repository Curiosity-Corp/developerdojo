import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { kataCatalog } from '../src/data/kata-catalog';
import { fields } from '../src/lib/fields';
import { KataCatalogError, validateKataCatalog, type KataCatalogEntry, type KataReferences } from '../src/lib/kata-catalog';
import {
  allFixtures, fixtureFoundations, fixtureReferences, fixtureStackRecipes, newField, newFieldFixture, sectorFixtures,
} from './fixtures/kata-sectors';

// Synthetic sector fixtures (#81). Passing here is structural validation of fixtures only: it is not
// evidence that any of these katas, integrations, standards or reviews exist or work.

const resourceIds = (dir = 'src/content/resources'): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? readdirSync(join(dir, entry.name)).filter((file) => file.endsWith('.yaml')).map((file) => `${entry.name}/${file.slice(0, -5)}`)
    : []);
const pathwayIds = readdirSync('src/content/tracks').filter((file) => file.endsWith('.md')).map((file) => file.slice(0, -3));
const refs: KataReferences = fixtureReferences(resourceIds(), pathwayIds);

const problems = (input: unknown, references = refs): readonly string[] => {
  try { validateKataCatalog(input, references); return []; }
  catch (error) { if (error instanceof KataCatalogError) return error.problems; throw error; }
};
const validated: KataCatalogEntry[] = validateKataCatalog([...kataCatalog, ...allFixtures], refs);
const fixtureIds = new Set(allFixtures.map((entry) => entry.metadata.id));
const fixturesOnly = validated.filter((entry) => fixtureIds.has(entry.metadata.id));
const specializations = fixturesOnly.filter((entry) => entry.metadata.layer === 'specialization');
const fieldsOf = (entries: readonly KataCatalogEntry[]) => new Set(entries.flatMap((entry) => entry.metadata.domainIds));

describe('sector fixtures are labelled and cannot be mistaken for published katas', () => {
  it('validate together with the real catalog, against the real registries plus fixture vocabulary', () => {
    expect(problems([...kataCatalog, ...allFixtures])).toEqual([]);
  });

  it('use FIX* IDs and /katas/fixture-* routes that have no page', () => {
    for (const entry of allFixtures) {
      expect(entry.metadata.id, entry.metadata.id).toMatch(/^FIX[A-Z]*-\d{3}$/);
      expect(entry.href).toMatch(/^\/katas\/fixture-/);
      expect(entry.linkLabel).toMatch(/\(fixture\)$/);
      expect(existsSync(`src/pages${entry.href}.astro`), entry.href).toBe(false);
    }
  });

  it('label every untested integration as a candidate', () => {
    for (const recipe of fixtureStackRecipes) {
      if (recipe.status === 'candidate') {
        expect(recipe.id, recipe.id).toMatch(/-candidate$/);
        expect(recipe.note, recipe.id).toMatch(/not run for the Dojo/);
      } else {
        expect(recipe.id, recipe.id).not.toMatch(/candidate/);
      }
    }
  });

  it('never claim compliance in a standard', () => {
    for (const entry of fixturesOnly) {
      for (const standard of entry.metadata.standards) {
        expect(`${standard.applicability} ${standard.reviewScope}`, standard.name).not.toMatch(/\b(?:compliant|certified|conforms)\b/i);
      }
    }
  });
});

describe('sector fixtures cover the taxonomy', () => {
  it('span at least five substantially different sectors, including SaaS/UX and the built environment', () => {
    expect(sectorFixtures.length).toBeGreaterThanOrEqual(5);
    const bySector = new Map(sectorFixtures.map((sector) => [sector.sector, fieldsOf(validateKataCatalog([...fixtureFoundations, ...sector.entries], refs))]));
    expect([...(bySector.get('SaaS and UX') ?? [])]).toContain('ux');
    expect([...(bySector.get('Built environment') ?? [])]).toEqual(expect.arrayContaining(['architecture-bim', 'construction']));
    // Substantially different: no two sectors share their whole field set.
    const signatures = [...bySector.values()].map((set) => [...set].sort().join(','));
    expect(new Set(signatures).size).toBe(sectorFixtures.length);
    expect(fieldsOf(specializations).size).toBeGreaterThanOrEqual(12);
  });

  it('show one outcome in several fields', () => {
    for (const outcome of ['traceable-batch-record', 'usable-onboarding', 'clean-data']) {
      const withOutcome = validated.filter((entry) => entry.metadata.outcomeIds.includes(outcome));
      expect(fieldsOf(withOutcome).size, outcome).toBeGreaterThanOrEqual(2);
    }
  });

  it('reuse each shared foundation across several sectors', () => {
    for (const foundation of fixtureFoundations) {
      const sectors = sectorFixtures.filter((sector) => sector.entries.some((entry) => entry.metadata.foundationKataIds?.includes(foundation.metadata.id)));
      expect(sectors.length, foundation.metadata.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('offer several recipes in one field', () => {
    for (const field of ['ux', 'construction', 'manufacturing', 'biotechnology']) {
      const inField = specializations.filter((entry) => entry.metadata.domainIds.includes(field));
      expect(new Set(inField.flatMap((entry) => entry.metadata.stackRecipeIds)).size, field).toBeGreaterThanOrEqual(2);
    }
  });

  it('mark a professional review boundary wherever a standard or regulated record is involved', () => {
    for (const entry of specializations) {
      const regulated = entry.metadata.domainIds.some((field) => ['health', 'biotechnology', 'robotics', 'architecture-bim', 'finance', 'public-service'].includes(field));
      if (regulated) expect(entry.metadata.professionalReviewRequired, entry.metadata.id).toBe(true);
    }
  });
});

describe('a new field is reference data only', () => {
  it('is not a field in src/lib/fields.ts', () => {
    expect(fields.map((field) => field.id)).not.toContain(newField.id);
  });

  it('is rejected until it is in the field registry, then accepted with no code change', () => {
    const withoutField: KataReferences = { ...refs, fields: refs.fields.filter((id) => id !== newField.id) };
    expect(problems([...kataCatalog, ...allFixtures], withoutField)).toEqual([`FIXMA-001: unknown field ${newField.id}`]);
    expect(problems([...kataCatalog, ...allFixtures])).toEqual([]);
  });

  it('reuses existing foundations and transfers to an existing field', () => {
    expect(newFieldFixture.metadata.foundationKataIds).toEqual(['FIXFND-001', 'FIXFND-003']);
    expect(fields.map((field) => field.id)).toEqual(expect.arrayContaining(newFieldFixture.metadata.crossFieldTransfers ?? []));
  });
});

describe('fixture vocabulary is required, not implied', () => {
  it('rejects fixtures validated against the published registries alone', () => {
    const published: KataReferences = { ...refs, ...{
      outcomes: refs.outcomes.filter((id) => kataCatalog.some((entry) => entry.metadata.outcomeIds.includes(id))),
    } };
    const found = problems([...kataCatalog, ...allFixtures], published);
    expect(found.length).toBeGreaterThan(0);
    expect(found.every((line) => line.startsWith('FIX'))).toBe(true);
  });
});
