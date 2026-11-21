import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { galleryEntries, galleryOutcomeIds, galleryOutcomeLabels } from '../src/data/gallery';
import { kataCatalog, kataDimensions } from '../src/data/kata-catalog';
import { fields } from '../src/lib/fields';
import { GalleryError, galleryKatas, resolveGallery, type GalleryContext, type GalleryEntryInput } from '../src/lib/gallery';
import { validateKataCatalog } from '../src/lib/kata-catalog';
import { resolveRecipes } from '../src/lib/kata-recipes';
import { kataMetadataSchema } from '../src/lib/kata-schema';

// The gallery (#87). The build runs the same resolveGallery over the same records (src/lib/gallery-content.ts),
// so an entry that fails here also fails `astro build`.

const resourceIds = (dir = 'src/content/resources'): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? readdirSync(join(dir, entry.name)).filter((file) => file.endsWith('.yaml')).map((file) => `${entry.name}/${file.slice(0, -5)}`)
    : []);
const pathways = readdirSync('src/content/tracks').filter((file) => file.endsWith('.md')).map((file) => file.slice(0, -3));
const resources = resourceIds();
const fieldIds = fields.map((field) => field.id);
const handWritten = readdirSync('src/pages/katas').filter((file) => file.endsWith('.astro') && !file.startsWith('[')).map((file) => file.slice(0, -6));
const recipeFiles = readdirSync('src/content/kata-recipes').filter((file) => file.endsWith('.yaml'));
const recipes = resolveRecipes(
  recipeFiles.map((file) => ({ slug: file.slice(0, -5), data: parseYaml(readFileSync(join('src/content/kata-recipes', file), 'utf8')) as unknown })),
  { registries: { fields: fieldIds, resources, pathways }, catalog: kataCatalog, reservedSlugs: handWritten, today: '2026-11-21' },
);
const catalog = validateKataCatalog(kataCatalog, { fields: fieldIds, resources, pathways, ...kataDimensions });

const context: GalleryContext = {
  katas: galleryKatas(catalog, recipes, []),
  fields,
  outcomes: Object.entries(galleryOutcomeLabels).map(([id, label]) => ({ id, label })),
  today: '2026-11-21',
};

const clone = (): GalleryEntryInput[] => structuredClone(galleryEntries);
const byId = (entries: GalleryEntryInput[], id: string): GalleryEntryInput => {
  const found = entries.find((entry) => entry.id === id);
  if (!found) throw new Error(`no gallery entry ${id}`);
  return found;
};
const problems = (entries: readonly unknown[], ctx: GalleryContext = context): readonly string[] => {
  try {
    resolveGallery(entries, ctx);
    return [];
  } catch (error) {
    if (error instanceof GalleryError) return error.problems;
    throw error;
  }
};

/** A site path resolves to a file under public/, a page or endpoint under src/pages, or a kata recipe. */
function sitePathExists(href: string): boolean {
  const path = href.split('#')[0]?.replace(/\/$/, '') ?? '';
  if (existsSync(join('public', path))) return true;
  if (['.astro', '.ts'].some((ext) => existsSync(join('src/pages', `${path}${ext}`))) || existsSync(join('src/pages', path, 'index.astro'))) return true;
  const recipe = /^\/katas\/([a-z0-9-]+)$/.exec(path);
  return recipe !== null && recipeFiles.includes(`${recipe[1]}.yaml`);
}

describe('gallery records', () => {
  const gallery = resolveGallery(galleryEntries, context);

  it('resolve against the real katas, fields and outcomes', () => {
    expect(gallery.entries.map(({ entry }) => entry.id)).toEqual(galleryEntries.map((entry) => entry.id));
  });

  it('label exactly the outcome vocabulary, once each', () => {
    expect(Object.keys(galleryOutcomeLabels).sort()).toEqual([...galleryOutcomeIds].sort());
    expect(new Set(galleryOutcomeIds).size).toBe(galleryOutcomeIds.length);
  });

  it('link the operational FND-001 example and its real evidence files', () => {
    const fnd = gallery.entries.find(({ kata }) => kata.id === 'FND-001');
    expect(fnd).toBeDefined();
    expect(fnd?.isFoundation).toBe(true);
    // FND-001's recipe page (#84) is a draft, so the gallery links it by name and the page says it is a draft.
    expect(fnd?.recipe).toEqual({ kind: 'recipe', href: '/katas/fnd-001-stack-comparison', title: 'Build a working prototype, then change one stack variable' });
    expect(fnd?.entry.artifact.files.map((file) => file.href)).toContain('/examples/fnd-001/results.json');
    // The title counts the stored runs; keep it true to the evidence folder.
    const runs = readdirSync('public/examples/fnd-001/runs').filter((file) => file.endsWith('.json'));
    expect(runs).toHaveLength(12);
    expect(fnd?.entry.title).toContain('twelve checked runs');
  });

  it('point every site link at a file or page that exists', () => {
    const hrefs = galleryEntries.flatMap((entry) => [
      ...entry.artifact.files.map((file) => file.href), entry.exercise.href, entry.provenance.rightsHref, entry.verification.evidenceHref,
      entry.recipeUnavailable?.instead.href,
    ]).filter((href): href is string => typeof href === 'string' && href.startsWith('/'));
    for (const href of hrefs) expect(sitePathExists(href), href).toBe(true);
    for (const item of gallery.entries) if (item.recipe.kind !== 'unavailable') expect(sitePathExists(item.recipe.href), item.recipe.href).toBe(true);
  });

  it('keep internal hosts, issue links and source paths off the public page', () => {
    const text = JSON.stringify(galleryEntries);
    expect(text).not.toMatch(/developerdojo\.org\/|\/-\/(issues|merge_requests)|\bsrc\/|\bscripts\/|\.ts\b/);
  });

  it('list every outcome and every field, with planned states where nothing is verified', () => {
    expect(gallery.byOutcome.map((group) => group.id).sort()).toEqual([...galleryOutcomeIds].sort());
    expect(gallery.byField.map((group) => group.id)).toEqual(fieldIds);
    expect(gallery.byField.filter((group) => group.entryIds.length === 0).length).toBeGreaterThan(0);
    expect(gallery.byOutcome.find((group) => group.id === 'compare-instructions')?.entryIds).toEqual([]);
    expect(gallery.byOutcome.find((group) => group.id === 'compare-instructions')?.practice.map((kata) => kata.id)).toContain('PRACTICE-001');
  });

  it('show one artifact under each field it belongs to', () => {
    const pocket = byId(clone(), 'pocket-garden-prototype');
    expect(pocket.fieldIds.length).toBeGreaterThan(1);
    for (const field of pocket.fieldIds) expect(gallery.byField.find((group) => group.id === field)?.entryIds).toContain(pocket.id);
  });

  it('collect the shared foundations behind the entries', () => {
    expect(gallery.sharedFoundations.map((foundation) => foundation.id)).toEqual(expect.arrayContaining(['FND-001', 'PRACTICE-001', 'PRACTICE-002']));
  });

  it('derive each recipe link from the kata', () => {
    const ifc = gallery.entries.find(({ entry }) => entry.id === 'ifc-wall-quantity-trace');
    expect(ifc?.recipe).toEqual({ kind: 'kata-page', href: '/katas/inspect-ifc', title: 'Investigate a real IFC model' });
    expect(ifc?.kata.metadata.professionalReviewRequired).toBe(true);
  });
});

describe('gallery validation rejects', () => {
  it('an entry without a dated check', () => {
    const entries = clone();
    delete (byId(entries, 'pocket-garden-prototype') as Partial<GalleryEntryInput>).verification;
    expect(problems(entries).join('\n')).toMatch(/pocket-garden-prototype: verification/);
  });

  it('an unverified status, since the gallery has none', () => {
    const entries = clone();
    Object.assign(byId(entries, 'pocket-garden-prototype'), { status: 'unverified' });
    expect(problems(entries).join('\n')).toMatch(/Unrecognized key/);
  });

  it('a native artifact served from elsewhere, or without CI evidence', () => {
    const entries = clone();
    const entry = byId(entries, 'pocket-garden-prototype');
    entry.artifact.files = [{ label: 'Elsewhere', href: 'https://example.com/garden.html' }];
    entry.verification = { ...entry.verification, method: 'source-check' };
    const found = problems(entries).join('\n');
    expect(found).toMatch(/a native artifact is served by the Dojo/);
    expect(found).toMatch(/re-checked in CI/);
  });

  it('a preview that claims a CI check of a file the Dojo does not hold', () => {
    const entries = clone();
    const entry = byId(entries, 'reconstructed-3d-office');
    entry.verification = { ...entry.verification, method: 'automated-check' };
    expect(problems(entries).join('\n')).toMatch(/can only be source-checked/);
  });

  it('unknown fields, outcomes and katas', () => {
    const entries = clone();
    const entry = byId(entries, 'reconstructed-3d-office');
    entry.fieldIds = ['3d', 'underwater-basket-weaving'];
    entry.outcomeIds = ['inspect-3d', 'not-an-outcome'];
    const other = byId(entries, 'pocket-garden-prototype');
    other.kataId = 'NOPE-001';
    const found = problems(entries).join('\n');
    expect(found).toMatch(/unknown field underwater-basket-weaving/);
    expect(found).toMatch(/unknown outcome not-an-outcome/);
    expect(found).toMatch(/unknown kata NOPE-001/);
  });

  it('an outcome the linked kata does not teach', () => {
    const entries = clone();
    byId(entries, 'reconstructed-3d-office').outcomeIds = ['read-model'];
    expect(problems(entries).join('\n')).toMatch(/outcome read-model is not an outcome of PRACTICE-008/);
  });

  it('a link to a fixture recipe', () => {
    const fixture = recipes.find(({ recipe }) => recipe.status === 'fixture');
    expect(fixture).toBeDefined();
    const entries = clone();
    const entry = byId(entries, 'reconstructed-3d-office');
    entry.kataId = fixture?.recipe.metadata.id ?? '';
    entry.outcomeIds = [...(fixture?.recipe.metadata.outcomeIds ?? [])];
    const ctx = { ...context, outcomes: [...context.outcomes, ...entry.outcomeIds.map((id) => ({ id, label: id }))] };
    expect(problems(entries, ctx).join('\n')).toMatch(/is a fixture/);
  });

  it('a missing or needless recipe notice', () => {
    // A kata without a page: FND-001 as a bare record, as it was before its recipe existed.
    const fnd = recipes.find(({ recipe }) => recipe.metadata.id === 'FND-001');
    if (!fnd) throw new Error('no FND-001 recipe');
    const pageless = { ...context, katas: galleryKatas(catalog, recipes.filter((item) => item !== fnd), [kataMetadataSchema.parse(fnd.recipe.metadata)]) };
    const entries = clone();
    byId(entries, 'pocket-garden-prototype').recipeUnavailable = { reason: 'x', instead: { label: 'y', href: '/katas' } };
    const found = problems(entries, pageless).join('\n');
    expect(found).toMatch(/FND-001 has no page yet/);
    expect(found).toMatch(/PRACTICE-003 has a page/);
  });

  it('a check in the future, before creation or with no next check after it', () => {
    const entries = clone();
    const entry = byId(entries, 'ifc-wall-quantity-trace');
    entry.verification = { ...entry.verification, date: '2026-12-01', nextCheck: '2026-12-01' };
    const other = byId(entries, 'pocket-garden-prototype');
    other.provenance = { ...other.provenance, created: '2026-11-25' };
    other.verification = { ...other.verification, date: '2026-11-19' };
    const found = problems(entries).join('\n');
    expect(found).toMatch(/nextCheck must be after the check date/);
    entry.verification.nextCheck = '2027-01-01';
    const again = problems(entries).join('\n');
    expect(again).toMatch(/ifc-wall-quantity-trace: the check date 2026-12-01 is in the future/);
    expect(again).toMatch(/pocket-garden-prototype: the artifact was checked before it was created/);
  });

  it('a duplicate ID and a repeated field', () => {
    const entries = clone();
    entries.push(structuredClone(byId(entries, 'reconstructed-3d-office')));
    expect(problems(entries).join('\n')).toMatch(/the ID is used twice/);
    const repeated = clone();
    byId(repeated, 'pocket-garden-prototype').fieldIds = ['ux', 'ux'];
    expect(problems(repeated).join('\n')).toMatch(/ux is listed twice/);
  });

  it('flags an overdue re-check without dropping the entry', () => {
    const later = resolveGallery(galleryEntries, { ...context, today: '2027-06-01' });
    expect(later.entries.every((item) => item.checkDue)).toBe(true);
  });
});
