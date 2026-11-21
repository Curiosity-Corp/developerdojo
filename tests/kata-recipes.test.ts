import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { kataCatalog } from '../src/data/kata-catalog';
import { fields } from '../src/lib/fields';
import { KataCatalogError } from '../src/lib/kata-catalog';
import { kataMetadataSchema } from '../src/lib/kata-schema';
import { resolveRecipes, type RecipeContext, type RecipeRecord, type ResolvedRecipe } from '../src/lib/kata-recipes';
import { allFixtures } from './fixtures/kata-sectors';

// Kata recipe records (#86). The build runs the same resolveRecipes over the same files
// (src/lib/kata-recipe-content.ts), so a record that fails here also fails `astro build`.

const RECIPES = 'src/content/kata-recipes';
const resourceIds = (dir = 'src/content/resources'): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? readdirSync(join(dir, entry.name)).filter((file) => file.endsWith('.yaml')).map((file) => `${entry.name}/${file.slice(0, -5)}`)
    : []);
const pathwayIds = readdirSync('src/content/tracks').filter((file) => file.endsWith('.md')).map((file) => file.slice(0, -3));
const handWritten = readdirSync('src/pages/katas').filter((file) => file.endsWith('.astro') && !file.startsWith('[')).map((file) => file.slice(0, -6));

const context: RecipeContext = {
  registries: { fields: fields.map((field) => field.id), resources: resourceIds(), pathways: pathwayIds },
  catalog: kataCatalog,
  reservedSlugs: handWritten,
  today: '2026-11-20',
};
const records: RecipeRecord[] = readdirSync(RECIPES).filter((file) => file.endsWith('.yaml'))
  .map((file) => ({ slug: file.slice(0, -5), data: parseYaml(readFileSync(join(RECIPES, file), 'utf8')) as unknown }));
const byId = (resolved: readonly ResolvedRecipe[], id: string) => resolved.find((item) => item.recipe.metadata.id === id);

type Item = Record<string, unknown>;
/** A record as loose data, so a test can break one field at a time. */
type Data = Item & {
  metadata: Item; setup: { smokeTest: Item }; verification: { checks: Item[] }; agents: { roles: Item[] }; prompts: unknown[]; downloads: Item[];
};
const recordOf = (slug: string): Data => structuredClone(records.find((record) => record.slug === slug)?.data) as Data;
const realFoundation = kataCatalog.find((entry) => entry.metadata.layer === 'foundation')?.metadata.id ?? 'missing';
/** A minimal valid draft, built from the UX fixture with the fixture-only vocabulary removed. */
function draft(): Data {
  const data = recordOf('fixture-fixux-001');
  data['status'] = 'draft';
  delete data['notice'];
  data.metadata = {
    ...data.metadata, id: 'UX-901', foundationKataIds: [realFoundation], stackRecipeIds: ['assistant-and-browser'],
    outcomeIds: [kataCatalog[0]?.metadata.outcomeIds[0]], artifactTypes: [kataCatalog[0]?.metadata.artifactTypes[0]],
    capabilityIds: [kataCatalog[0]?.metadata.capabilityIds[0]], constraintIds: ['fictional-data'],
  };
  return data;
}
const problems = (input: readonly RecipeRecord[], ctx: RecipeContext = context): readonly string[] => {
  try { resolveRecipes(input, ctx); return []; }
  catch (error) { if (error instanceof KataCatalogError) return error.problems; throw error; }
};
const withRecord = (slug: string, data: unknown) => [...records, { slug, data }];

describe('the recipe records in src/content/kata-recipes', () => {
  const resolved = resolveRecipes(records, context);

  it('all validate and resolve against the real registries', () => {
    expect(records.length).toBeGreaterThan(0);
    expect(resolved).toHaveLength(records.length);
  });

  it('render fixtures only from the !149 sector fixtures, with identical metadata', () => {
    for (const item of resolved.filter(({ recipe }) => recipe.status === 'fixture')) {
      const source = allFixtures.find((entry) => entry.metadata.id === item.recipe.metadata.id);
      expect(source, item.recipe.metadata.id).toBeDefined();
      expect(item.href).toBe(source?.href);
      expect(item.recipe.metadata).toEqual(kataMetadataSchema.parse(source?.metadata));
    }
  });

  it('never let a fixture claim a run, a review or a showcase', () => {
    for (const { recipe } of resolved.filter((item) => item.recipe.status === 'fixture')) {
      expect('unavailable' in recipe.review).toBe(true);
      expect('unavailable' in recipe.showcase).toBe(true);
      if (!('unavailable' in recipe.verification)) expect(recipe.verification.checks.every((check) => check.result === 'not-run')).toBe(true);
    }
  });

  it('link a specialization and its foundations both ways', () => {
    const ux = byId(resolved, 'FIXUX-001');
    expect(ux?.foundations.map((link) => link.href)).toEqual(['/katas/fixture-foundation-define-outcome', '/katas/fixture-foundation-compare-stack']);
    for (const id of ['FIXFND-001', 'FIXFND-002']) {
      expect(byId(resolved, id)?.usedBy.map((link) => link.href), id).toContain('/katas/fixture-fixux-001');
    }
  });

  it('mark peer-reviewed evidence for the review page and leave self-checked evidence off it', () => {
    expect(byId(resolved, 'FIXUX-001')?.reviewedEvidence).toBe(true);
    expect(byId(resolved, 'FIXFND-002')?.reviewedEvidence).toBe(false);
  });
});

describe('malformed records fail', () => {
  it('a valid draft is accepted, so the cases below fail for the reason they name', () => {
    expect(problems(withRecord('ux-901-onboarding', draft()))).toEqual([]);
  });

  it('links a real recipe to a curated catalog foundation both ways', () => {
    const resolved = resolveRecipes(withRecord('ux-901-onboarding', draft()), context);
    const foundation = kataCatalog.find((entry) => entry.metadata.id === realFoundation);
    expect(byId(resolved, 'UX-901')?.foundations.map((link) => link.href)).toEqual([foundation?.href]);
  });

  it('rejects an unknown or missing field, naming the file and path', () => {
    const extra = { ...draft(), surprise: true };
    expect(problems(withRecord('ux-901-onboarding', extra)).join('\n')).toMatch(/^ux-901-onboarding: \(record\): .*surprise/m);
    const missing = draft();
    delete missing['brief'];
    expect(problems(withRecord('ux-901-onboarding', missing))).toEqual(expect.arrayContaining([expect.stringMatching(/^ux-901-onboarding: brief:/)]));
  });

  it('rejects a pass without evidence, and a fixture that claims any result', () => {
    const passed = draft();
    passed.verification.checks[0] = { ...passed.verification.checks[0], result: 'passed' };
    expect(problems(withRecord('ux-901-onboarding', passed)).join('\n')).toMatch(/verification\.checks\.0: a passed result needs evidence and a date/);
    const fixture = recordOf('fixture-fixux-001');
    fixture.verification.checks[0] = { ...fixture.verification.checks[0], result: 'passed', evidence: 'CI job 1', date: '2026-11-01' };
    expect(problems([...records.filter((record) => record.slug !== 'fixture-fixux-001'), { slug: 'fixture-fixux-001', data: fixture }]).join('\n'))
      .toMatch(/a fixture has never been run/);
  });

  it('rejects a published recipe with unavailable evidence or no named maintainer', () => {
    const published = { ...draft(), status: 'published' };
    const found = problems(withRecord('ux-901-onboarding', published)).join('\n');
    for (const key of ['review', 'showcase']) expect(found).toMatch(new RegExp(`${key}: a published recipe needs ${key}`));
    expect(found).toMatch(/maintainer\.person: a published recipe names who maintains it/);
  });

  it('rejects a review date that goes backwards', () => {
    const data = { ...draft(), review: { lastVerified: '2026-11-01', checked: 'Ran every step', nextReview: '2026-10-01' } };
    expect(problems(withRecord('ux-901-onboarding', data)).join('\n')).toMatch(/review\.nextReview: nextReview must be after lastVerified/);
  });

  it('rejects an agent that depends on a role the recipe does not have', () => {
    const data = draft();
    data.agents.roles[1] = { ...data.agents.roles[1], dependsOn: ['Ghost'] };
    expect(problems(withRecord('ux-901-onboarding', data)).join('\n')).toMatch(/Ghost is not a role in this recipe/);
  });

  it('rejects unknown references: a field, a pathway, a resource and a foundation', () => {
    const data = draft();
    data.metadata = { ...data.metadata, domainIds: ['astrology'], pathwayIds: ['no-such-track'], foundationKataIds: ['FND-999'] };
    data['exercise'] = { title: 'Missing', resourceId: 'nobody/nothing', terms: 'None' };
    const found = problems(withRecord('ux-901-onboarding', data)).join('\n');
    for (const pattern of [/astrology/, /no-such-track/, /FND-999/, /unknown exercise resource nobody\/nothing/]) expect(found).toMatch(pattern);
  });

  it('rejects fixture vocabulary or a fixture foundation in a real recipe', () => {
    const data = draft();
    data.metadata = { ...data.metadata, constraintIds: ['keyboard-only'], foundationKataIds: ['FIXFND-001'] };
    const found = problems(withRecord('ux-901-onboarding', data)).join('\n');
    expect(found).toMatch(/constraint keyboard-only exists only in the fixture vocabulary/);
    expect(found).toMatch(/foundation FIXFND-001 is a fixture/);
  });

  it('rejects a file name that is taken, not a slug, or mislabels a fixture', () => {
    expect(problems(withRecord('ux-journey', draft())).join('\n')).toMatch(/\/katas\/ux-journey is already a page/);
    expect(problems(withRecord('recipes', draft())).join('\n')).toMatch(/\/katas\/recipes is already a page/);
    expect(problems(withRecord('UX_901', draft())).join('\n')).toMatch(/must be a lower-case slug/);
    expect(problems(withRecord('fixture-ux-901', draft())).join('\n')).toMatch(/fixture recipes, and only fixtures/);
    const fixtureId = { ...draft(), metadata: { ...draft().metadata, id: 'FIXUX-901' } };
    expect(problems(withRecord('ux-901-onboarding', fixtureId)).join('\n')).toMatch(/status fixture is for FIX\* IDs only/);
  });

  it('rejects a duplicate kata ID, prompt ID or download name', () => {
    const duplicateId = { ...draft(), metadata: { ...draft().metadata, id: 'FIXUX-001' }, status: 'fixture' };
    expect(problems(withRecord('fixture-copy', duplicateId))).not.toEqual([]);
    const data = draft();
    data.prompts.push(data.prompts[0]);
    data.downloads.push({ ...data.downloads[0] });
    const found = problems(withRecord('ux-901-onboarding', data)).join('\n');
    expect(found).toMatch(/prompt journey-draft is listed twice/);
    expect(found).toMatch(/agents\.md is listed twice/);
  });

  it('rejects a download that is not plain text', () => {
    const data = draft();
    data.downloads[0] = { ...data.downloads[0], filename: 'install.sh' };
    expect(problems(withRecord('ux-901-onboarding', data)).join('\n')).toMatch(/downloads\.0\.filename: use a lower-case file name/);
  });
});

describe('review dates', () => {
  it('flag a published recipe whose next review has passed', () => {
    const published = Object.assign(draft(), {
      status: 'published', maintainer: { role: 'UX maintainer', person: 'A. Maintainer' },
      review: { lastVerified: '2026-01-10', checked: 'Ran every step and check', nextReview: '2026-07-10' },
      showcase: { summary: 'A learner prototype', provenance: { creator: 'A learner', source: 'Dojo review', license: 'CC BY 4.0', date: '2026-01-10' } },
    });
    published.setup.smokeTest = { ...published.setup.smokeTest, result: 'passed', evidence: 'Screen recording in the review', date: '2026-01-10' };
    published.verification.checks = published.verification.checks.map((check) => ({ ...check, result: 'passed', evidence: 'Review notes', date: '2026-01-10' }));
    const resolved = resolveRecipes(withRecord('ux-901-onboarding', published), context);
    expect(byId(resolved, 'UX-901')?.reviewDue).toBe(true);
    expect(byId(resolveRecipes(withRecord('ux-901-onboarding', published), { ...context, today: '2026-07-01' }), 'UX-901')?.reviewDue).toBe(false);
  });
});
