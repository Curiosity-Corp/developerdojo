import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { kataCatalog, kataDimensions } from '../src/data/kata-catalog';
import { KATA_DIRECTORY } from '../src/data/kata-directory';
import { fields } from '../src/lib/fields';
import { KataCatalogError, validateKataCatalog, type KataCatalogEntryInput, type KataReferences } from '../src/lib/kata-catalog';
import { PROGRESS_STORAGE_KEY } from '../src/lib/progress';

// The same registries the build passes in src/pages/fields.astro, read from the files.
const resourceIds = (dir = 'src/content/resources'): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? readdirSync(join(dir, entry.name)).filter((file) => file.endsWith('.yaml')).map((file) => `${entry.name}/${file.slice(0, -5)}`)
    : []);
const refs: KataReferences = {
  fields: fields.map((field) => field.id),
  resources: resourceIds(),
  pathways: readdirSync('src/content/tracks').filter((file) => file.endsWith('.md')).map((file) => file.slice(0, -3)),
  ...kataDimensions,
};

const problems = (input: unknown, references = refs): readonly string[] => {
  try { validateKataCatalog(input, references); return []; }
  catch (error) { if (error instanceof KataCatalogError) return error.problems; throw error; }
};
const byId = (id: string): KataCatalogEntryInput => {
  const entry = kataCatalog.find((candidate) => candidate.metadata.id === id);
  if (!entry) throw new Error(`catalog fixture ${id} missing`);
  return entry;
};
// Synthetic entries for composition checks; they are not published katas.
const synthetic = (id: string, href: string, metadata: Partial<KataCatalogEntryInput['metadata']>): KataCatalogEntryInput => ({
  href, linkLabel: `Synthetic ${id}`,
  metadata: { id, title: `Synthetic ${id}`, layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['clean-data'], artifactTypes: ['data-report'], capabilityIds: ['analyze-data'], domainIds: ['data'], foundationKataIds: ['PRACTICE-001'], ...metadata },
});

describe('kata catalog: existing content keeps working', () => {
  it('validates the published catalog against the real field, resource and track registries', () => {
    expect(problems(kataCatalog)).toEqual([]);
  });

  it('only points at existing kata routes that the directory still lists', () => {
    const listed = new Set(KATA_DIRECTORY.map((kata) => kata.href));
    for (const entry of kataCatalog) {
      expect(existsSync(`src/pages${entry.href}.astro`), entry.href).toBe(true);
      expect(listed.has(entry.href as `/katas/${string}`), entry.href).toBe(true);
    }
  });

  it('keeps PRACTICE IDs and the on-device progress key unchanged', () => {
    expect(kataCatalog.map((entry) => entry.metadata.id)).toEqual(Array.from({ length: 8 }, (_, index) => `PRACTICE-00${index + 1}`));
    expect(PROGRESS_STORAGE_KEY).toBe('dojo-progress-v1');
  });
});

describe('kata catalog: composable dimensions', () => {
  it('reuses shared foundations across specializations in different fields', () => {
    const entries = validateKataCatalog(kataCatalog, refs);
    const specializations = entries.filter((entry) => entry.metadata.layer === 'specialization');
    expect(new Set(specializations.flatMap((entry) => entry.metadata.domainIds)).size).toBeGreaterThanOrEqual(5);
    for (const foundation of ['PRACTICE-001', 'PRACTICE-002']) {
      const users = specializations.filter((entry) => entry.metadata.foundationKataIds.includes(foundation));
      expect(new Set(users.flatMap((entry) => entry.metadata.domainIds)).size, foundation).toBeGreaterThanOrEqual(2);
    }
  });

  it('allows one outcome in several fields, several recipes in one field, and every dimension on one kata', () => {
    const extra = [
      synthetic('MULTI-001', '/katas/example-multi', {
        domainIds: ['ux', 'data'], outcomeIds: ['design-journey', 'clean-data'], foundationKataIds: ['PRACTICE-001', 'PRACTICE-002'],
        stackRecipeIds: ['assistant-and-browser', 'git-and-node'], pathwayIds: ['personas-and-journeys', 'research-and-evidence'],
        constraintIds: ['fictional-data', 'no-personal-data'], crossFieldTransfers: ['energy'], externalResources: ['renovate/docs'],
        standards: [{ name: 'Example', version: '1', applicability: 'Synthetic only', reviewScope: 'Synthetic only', sourceResourceId: 'reuse/reuse-software' }],
        verificationEvidence: [{ description: 'Peer checks the report', method: 'peer-review', standards: ['Example'] }],
        beltCriteria: [{ stage: 'practice', criterion: 'Explains the goal, stack and checks' }],
      }),
      synthetic('MULTI-002', '/katas/example-same-outcome', { domainIds: ['finance'], stackRecipeIds: ['git-and-node'] }),
      synthetic('MULTI-003', '/katas/example-same-field', { domainIds: ['finance'], stackRecipeIds: ['assistant-and-browser'] }),
    ];
    const entries = validateKataCatalog([...kataCatalog, ...extra], refs);
    const withOutcome = entries.filter((entry) => entry.metadata.outcomeIds.includes('clean-data'));
    expect(new Set(withOutcome.flatMap((entry) => entry.metadata.domainIds)).size).toBeGreaterThanOrEqual(3);
    const finance = entries.filter((entry) => entry.metadata.domainIds.includes('finance'));
    expect(new Set(finance.flatMap((entry) => entry.metadata.stackRecipeIds)).size).toBe(2);
  });

  it('accepts a new field, recipe, pathway and constraint as reference data with no code change', () => {
    const entry = synthetic('NEW-001', '/katas/example-new-field', {
      domainIds: ['maritime'], stackRecipeIds: ['cad-and-agent'], pathwayIds: ['maritime-basics'], constraintIds: ['vessel-data-only'],
    });
    expect(problems([...kataCatalog, entry])).toEqual([
      'NEW-001: unknown field maritime', 'NEW-001: unknown pathway maritime-basics',
      'NEW-001: unknown constraint vessel-data-only', 'NEW-001: unknown stack recipe cad-and-agent',
    ]);
    const extended: KataReferences = {
      ...refs, fields: [...refs.fields, 'maritime'], stackRecipes: [...refs.stackRecipes, 'cad-and-agent'],
      pathways: [...refs.pathways, 'maritime-basics'], constraints: [...refs.constraints, 'vessel-data-only'],
    };
    expect(validateKataCatalog([...kataCatalog, entry], extended)).toHaveLength(kataCatalog.length + 1);
  });
});

describe('kata catalog: invalid references are rejected', () => {
  it('reports every unknown reference in one pass, naming the kata', () => {
    const changed = synthetic('BAD-001', '/katas/example-bad', {
      domainIds: ['unknown-field'], crossFieldTransfers: ['unknown-transfer'], externalResources: ['unknown/item'],
      outcomeIds: ['unknown-outcome'], artifactTypes: ['unknown-artifact'], capabilityIds: ['unknown-capability'],
      constraintIds: ['unknown-constraint'], stackRecipeIds: ['unknown-recipe'], pathwayIds: ['unknown-pathway'],
      standards: [{ name: 'S', version: '1', applicability: 'a', reviewScope: 'r', sourceResourceId: 'unknown/source' }],
      foundationKataIds: ['MISSING-001', 'PRACTICE-003'],
    });
    expect(problems([...kataCatalog, changed])).toEqual([
      'BAD-001: unknown field unknown-field', 'BAD-001: unknown transfer field unknown-transfer',
      'BAD-001: unknown resource unknown/item', 'BAD-001: unknown standard source unknown/source',
      'BAD-001: unknown pathway unknown-pathway', 'BAD-001: unknown outcome unknown-outcome',
      'BAD-001: unknown artifact unknown-artifact', 'BAD-001: unknown capability unknown-capability',
      'BAD-001: unknown constraint unknown-constraint', 'BAD-001: unknown stack recipe unknown-recipe',
      'BAD-001: unknown foundation MISSING-001', 'BAD-001: PRACTICE-003 is not a foundation',
    ]);
  });

  it('rejects duplicate IDs and routes', () => {
    const first = byId('PRACTICE-001');
    expect(problems([...kataCatalog, first])).toEqual(['duplicate kata ID: PRACTICE-001', 'duplicate kata route: /katas/compare-instructions']);
    expect(problems([...kataCatalog, { ...first, metadata: { ...first.metadata, id: 'FND-099' } }])).toEqual(['duplicate kata route: /katas/compare-instructions']);
  });

  it('rejects foundation cycles', () => {
    const a = synthetic('CYC-001', '/katas/example-cycle-a', { layer: 'foundation', domainIds: [], foundationKataIds: ['CYC-002'] });
    const b = synthetic('CYC-002', '/katas/example-cycle-b', { layer: 'foundation', domainIds: [], foundationKataIds: ['CYC-001'] });
    expect(problems([...kataCatalog, a, b])).toEqual(['foundation cycle: CYC-001 -> CYC-002 -> CYC-001']);
    expect(problems([...kataCatalog, { ...a, metadata: { ...a.metadata, foundationKataIds: ['PRACTICE-001'] } }, b])).toEqual([]);
  });

  it('reports schema errors with the kata ID and field path', () => {
    const broken = synthetic('SHAPE-001', '/katas/example-shape', { standards: [{ name: 'S', version: '1', applicability: 'a', reviewScope: '' }] });
    const found = problems([...kataCatalog, broken]);
    expect(found).toHaveLength(1);
    expect(found[0]).toMatch(/^SHAPE-001: metadata\.standards\.0\.reviewScope: /);
    expect(problems([{ href: '/not-a-kata', linkLabel: 'x', metadata: byId('PRACTICE-001').metadata }])[0]).toMatch(/^PRACTICE-001: href: /);
  });
});
