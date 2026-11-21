import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { kataCatalog } from '../src/data/kata-catalog';
import { KATA_DIRECTORY } from '../src/data/kata-directory';
import { checklistName } from '../src/lib/checklist';
import { fields } from '../src/lib/fields';
import { LESSON_PROGRESS_NAME, LESSON_PROGRESS_VERSION, parseLessonProgress } from '../src/lib/lesson-progress';
import { ALL_MODULES, PROGRESS_STORAGE_KEY, parseState } from '../src/lib/progress';
import { ASSESSMENT_NAME, ASSESSMENT_VERSION, parseAssessment } from '../src/lib/self-assessment';
import { CHECKLIST_VERSION, parseChecklist } from '../src/lib/checklist';
import { LEGACY_KEYS, NAMESPACE, createStore, describeKey, storageKey, type StorageLike } from '../src/lib/storage';
import { resolveIdentifier, routeRedirects } from '../src/lib/taxonomy-identifiers';
import { identifierLedger, liveIdentifiers } from '../src/lib/taxonomy-sources';
import { FOUNDATION_FIXTURE_SLUGS, allFixtures } from './fixtures/kata-sectors';

// docs/kata-taxonomy.md, "Migration from the existing collections" (#82): the taxonomy is
// layered on top of existing routes and saved progress. These checks use real repository data
// and representative saved values, and fail if the taxonomy work renames a route or a key.

const root = join(__dirname, '..');
const kataPage = (href: string) => join(root, 'src/pages', `${href}.astro`);
const libraryFile = (id: string) => join(root, 'src/content/library', `${id}.md`);
const trackFile = (href: string) => join(root, 'src/content/tracks', `${href.replace('/library/tracks/', '')}.md`);

describe('legacy routes stay where the taxonomy points', () => {
  it('every taxonomy record links an existing kata page', () => {
    for (const entry of kataCatalog) expect(existsSync(kataPage(entry.href)), entry.href).toBe(true);
  });

  it('every kata in the discovery directory still has its page', () => {
    for (const entry of KATA_DIRECTORY) expect(existsSync(kataPage(entry.href)), entry.href).toBe(true);
  });

  it('every field with a track points at an existing track file', () => {
    for (const field of fields) if (field.trackHref) expect(existsSync(trackFile(field.trackHref)), field.id).toBe(true);
  });

  // Resource, track and field references in kataCatalog are validated against the real registries
  // in tests/kata-catalog.test.ts, so they are not repeated here.
});

describe('saved progress keeps its meaning', () => {
  it('the storage names the taxonomy must not change are unchanged', () => {
    expect(PROGRESS_STORAGE_KEY).toBe('dojo-progress-v1');
    expect(LEGACY_KEYS).toContain('dojo-progress-v1');
    expect(NAMESPACE).toBe('dojo:');
    expect(storageKey(LESSON_PROGRESS_NAME)).toBe('dojo:lessons');
    expect(LESSON_PROGRESS_VERSION).toBe(1);
    expect(checklistName('week-1-see-the-whole-product')).toBe('checklist:week-1-see-the-whole-product');
    expect(describeKey('dojo-progress-v1')).toBe('Module progress on the Train page');
  });

  it('a representative Train page record still loads, module by module', () => {
    const saved = JSON.stringify({ completed: { 'developer-week-1': '2026-10-02', 'developer-week-2': '2026-10-09' } });
    expect(parseState(saved).completed).toEqual({ 'developer-week-1': '2026-10-02', 'developer-week-2': '2026-10-09' });
    expect(ALL_MODULES.map((module) => module.id)).toEqual(expect.arrayContaining(['developer-week-1', 'developer-week-2']));
  });

  it('a representative lesson record still names existing lessons', () => {
    const ids = ['week-1-see-the-whole-product', 'tracks/robot-software/01-linux-and-python-for-robots'];
    const saved = { done: Object.fromEntries(ids.map((id) => [id, '2026-11-01'])) };
    expect(Object.keys(parseLessonProgress(saved).done)).toEqual(ids);
    for (const id of ids) expect(existsSync(libraryFile(id)), id).toBe(true);
  });

  it('each Train module still points at an existing lesson', () => {
    for (const module of ALL_MODULES) {
      const page = module.href.replace('/library/', '').split('#')[0] ?? '';
      expect(existsSync(libraryFile(page)), module.id).toBe(true);
    }
  });
});

// Worked migration (#82, docs/kata-taxonomy.md "Worked example"): the FIXFND fixture family's routes
// were renamed from /katas/fixture-fixfnd-00N to descriptive slugs. These checks prove the rename end to
// end: the kata IDs stayed, every old route redirects to the page in use now, every link follows, and
// saved progress from before the rename still loads with the same keys. e2e/taxonomy-redirects.spec.ts
// follows the redirects in a browser against the built site.
describe('worked migration: the FIXFND fixture family takes new routes', () => {
  const RECIPES = join(root, 'src/content/kata-recipes');
  const recipeFiles = readdirSync(RECIPES).filter((file) => file.endsWith('.yaml'));
  const recipes = recipeFiles.map((file) => ({
    slug: file.slice(0, -5),
    id: String((parseYaml(readFileSync(join(RECIPES, file), 'utf8')) as { metadata: { id: string } }).metadata.id),
  }));
  const handWrittenSlugs = readdirSync(join(root, 'src/pages/katas')).filter((file) => file.endsWith('.astro') && !file.startsWith('[')).map((file) => file.slice(0, -6));
  const live = liveIdentifiers({ recipes, handWrittenSlugs });
  const family = identifierLedger.moves.filter((move) => move.kind === 'kata-route' && move.from.startsWith('/katas/fixture-fixfnd-'));
  const before = { '/katas/fixture-fixfnd-001': 'FIXFND-001', '/katas/fixture-fixfnd-002': 'FIXFND-002' };

  it('records one move per published route of the family, each decided on #82', () => {
    expect(family.map((move) => move.from).sort()).toEqual(Object.keys(before));
    for (const move of family) expect(move.issue).toBe(82);
  });

  it('keeps every kata ID: the renamed records carry the same IDs, under their new slugs', () => {
    for (const [route, id] of Object.entries(before)) {
      const target = routeRedirects(identifierLedger)[route];
      expect(target, route).toBe(`/katas/fixture-${FOUNDATION_FIXTURE_SLUGS[id]}`);
      expect(recipes.find((recipe) => `/katas/${recipe.slug}` === target)?.id, route).toBe(id);
      expect(live['kata-id']).toContain(id);
    }
  });

  it('leaves no page at an old route and redirects it to a page that exists', () => {
    for (const route of Object.keys(before)) {
      const slug = route.replace('/katas/', '');
      expect(existsSync(join(RECIPES, `${slug}.yaml`)), route).toBe(false);
      expect(existsSync(kataPage(route)), route).toBe(false);
      const now = resolveIdentifier('kata-route', route, live, identifierLedger);
      expect(now, route).toBeDefined();
      expect(live['kata-route']).toContain(now);
    }
  });

  it('updates every link: the fixture records point at the new routes and none at an old one', () => {
    for (const [id, slug] of Object.entries(FOUNDATION_FIXTURE_SLUGS)) {
      expect(allFixtures.find((entry) => entry.metadata.id === id)?.href, id).toBe(`/katas/fixture-${slug}`);
    }
    const linked = [...allFixtures.map((entry) => entry.href), ...kataCatalog.map((entry) => entry.href), ...KATA_DIRECTORY.map((entry) => entry.href)];
    for (const route of Object.keys(before)) expect(linked, route).not.toContain(route);
  });

  // A representative device, saved before the rename: every key the Dojo writes, with real values.
  const savedBefore: Record<string, string> = {
    'dojo-progress-v1': JSON.stringify({ completed: { 'developer-week-1': '2026-10-02' } }),
    'dojo:lessons': JSON.stringify({ v: LESSON_PROGRESS_VERSION, savedAt: '2026-11-01T09:00:00.000Z', data: { done: { 'week-1-see-the-whole-product': '2026-11-01' } } }),
    'dojo:checklist:week-1-see-the-whole-product': JSON.stringify({ v: CHECKLIST_VERSION, savedAt: '2026-11-01T09:00:00.000Z', data: { ticked: ['0a1b2c3d'] } }),
    'dojo:self-assessment:track-a': JSON.stringify({ v: ASSESSMENT_VERSION, savedAt: '2026-11-01T09:00:00.000Z', data: {} }),
    'dojo:belt-evidence': JSON.stringify({ v: 1, savedAt: '2026-11-01T09:00:00.000Z', data: { bim: { stage: 'yellow', checks: ['goal'], notes: 'IFC takeoff practice' } } }),
  };
  const device = (values: Record<string, string>): StorageLike => {
    const map = new Map(Object.entries(values));
    return {
      get length() { return map.size; },
      key: (index) => [...map.keys()][index] ?? null,
      getItem: (key) => map.get(key) ?? null,
      setItem: (key, value) => { map.set(key, value); },
      removeItem: (key) => { map.delete(key); },
    };
  };

  it('saved progress keeps its keys and values: nothing saved names a kata route or slug', () => {
    const store = createStore(() => device(savedBefore));
    expect(Object.keys(store.exportAll()).sort()).toEqual(Object.keys(savedBefore).sort());
    const everything = JSON.stringify(store.exportAll());
    for (const move of family) {
      expect(everything, move.from).not.toContain(move.from.replace('/katas/', ''));
      expect(everything, move.to).not.toContain(move.to.replace('/katas/', ''));
    }
    expect(parseState(savedBefore['dojo-progress-v1'] ?? null).completed).toEqual({ 'developer-week-1': '2026-10-02' });
    expect(store.load(LESSON_PROGRESS_NAME, { version: LESSON_PROGRESS_VERSION, validate: parseLessonProgress })?.done).toEqual({ 'week-1-see-the-whole-product': '2026-11-01' });
    expect(store.load('checklist:week-1-see-the-whole-product', { version: CHECKLIST_VERSION, validate: parseChecklist })?.ticked).toEqual(['0a1b2c3d']);
    expect(store.load(ASSESSMENT_NAME, { version: ASSESSMENT_VERSION, validate: parseAssessment })).toBeDefined();
    expect(existsSync(libraryFile('week-1-see-the-whole-product'))).toBe(true);
  });
});

// Why a kata route or taxonomy ID can move without touching progress: no on-device key is derived
// from one. This inventory fails the day a new component saves state, so its key gets the same review.
describe('on-device keys never depend on a kata route or taxonomy ID', () => {
  const sources = (dir: string): string[] => readdirSync(join(root, dir), { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && /\.(astro|ts)$/.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name).slice(root.length + 1));
  const writers = sources('src').filter((path) => /store\.save\(|localStorage\.setItem\(/.test(readFileSync(join(root, path), 'utf8')));
  // What each writer keys its value by. None is a kata route, recipe slug or taxonomy ID.
  const KEYED_BY: Record<string, string> = {
    'src/components/ProgressPanel.astro': 'dojo-progress-v1, by Train module ID (src/lib/progress.ts)',
    'src/components/LessonDone.astro': 'dojo:lessons, by library lesson path',
    'src/components/ChecklistTool.astro': 'dojo:checklist:<library page id>',
    'src/components/TemplateForm.astro': 'dojo:draft:<library page id>',
    'src/components/SelfAssessment.astro': 'dojo:self-assessment:track-a',
    'src/components/BeltJourney.astro': 'dojo:belt-evidence, by the belt journal\'s own field list',
    'src/components/ThemeToggle.astro': 'dojo-theme (a display preference, not progress)',
  };

  it('every component that saves on the device is in the reviewed inventory', () => {
    expect(writers.sort()).toEqual(Object.keys(KEYED_BY).sort());
  });

  it('no kata page or recipe template uses a component that saves on the device', () => {
    const savers = Object.keys(KEYED_BY).map((path) => path.slice(path.lastIndexOf('/') + 1, -'.astro'.length));
    for (const path of sources('src/pages/katas')) {
      const text = readFileSync(join(root, path), 'utf8');
      for (const name of savers) expect(text, `${path} imports ${name}`).not.toMatch(new RegExp(`import ${name} from`));
    }
  });

  it('the belt journal keeps its own saved field keys, independent of taxonomy field IDs', () => {
    const journal = readFileSync(join(root, 'src/components/BeltJourney.astro'), 'utf8');
    expect(/const FIELDS = (\[[^\]]*\])/.exec(journal)?.[1]).toBe("['software', 'ux', 'bim', 'business', 'robotics', 'research', 'media', 'education', 'other']");
  });
});
