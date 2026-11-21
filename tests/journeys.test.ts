import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { igniteJourneys } from '../src/data/ignite-journeys';
import { coreFocuses } from '../src/lib/core-focuses';
import { journeyRegistries } from '../src/lib/journey-registries';
import { checkJourneys, type JourneyInput, type JourneyRegistries } from '../src/lib/journeys';
import type { IdentifierSet } from '../src/lib/taxonomy-identifiers';

// Optional Ignite Curiosity journeys (#83, docs/journeys.md). The build runs the same check
// (src/lib/journey-content.ts); these tests run it on the files on disk, then show that each kind of bad
// reference fails for its own reason.

const root = join(import.meta.dirname, '..');
const RECIPES = join(root, 'src/content/kata-recipes');
const TRACKS = join(root, 'src/content/tracks');

const recipes = readdirSync(RECIPES).filter((file) => file.endsWith('.yaml')).map((file) => {
  const data = parseYaml(readFileSync(join(RECIPES, file), 'utf8')) as { metadata: { id: string; title: string } };
  return { slug: file.slice(0, -5), id: String(data.metadata.id), title: String(data.metadata.title) };
});
const handWrittenSlugs = readdirSync(join(root, 'src/pages/katas')).filter((file) => file.endsWith('.astro') && !file.startsWith('[')).map((file) => file.slice(0, -6));
const tracks = readdirSync(TRACKS).filter((file) => file.endsWith('.md')).map((file) => {
  const title = /^title:\s*"?(.*?)"?\s*$/m.exec(readFileSync(join(TRACKS, file), 'utf8'))?.[1];
  if (!title) throw new Error(`${file} has no title`);
  return { slug: file.slice(0, -3), title };
});
const registries = journeyRegistries({ recipes, handWrittenSlugs, tracks });

/** Public URLs /journeys/<id>/. Ignite Curiosity may link to them, so they never change (docs/journeys.md). */
const PUBLISHED = ['robotics', 'biotechnology'];

describe('the published journeys', () => {
  const { journeys, problems } = checkJourneys(igniteJourneys, registries);

  it('resolve every reference to a locked, live identifier with a page', () => {
    expect(problems).toEqual([]);
  });

  it('keep their public IDs', () => {
    expect(journeys.map((journey) => journey.id)).toEqual(PUBLISHED);
  });

  it('pair each core focus with its journey, linking back to exactly the tracks Ignite Curiosity links to', () => {
    for (const focus of coreFocuses) {
      const journey = journeys.find((candidate) => candidate.id === focus.id);
      expect(journey, focus.id).toBeDefined();
      expect(journey?.fieldIds, focus.id).toContain(focus.id);
      expect(journey?.ignite.linksToTracks, focus.id).toEqual(focus.tracks.map((track) => track.slug));
    }
  });

  it('name at least one kata by its permanent kata ID', () => {
    for (const journey of journeys) {
      expect([...journey.foundations, ...journey.steps.flatMap((step) => step.refs)].some((ref) => ref.kind === 'kata'), journey.id).toBe(true);
    }
  });

  it('publish no issue links, repository paths or hosts other than the two sites', () => {
    const published = JSON.stringify(igniteJourneys);
    expect(published).not.toMatch(/#\d+|git\.developerdojo|src\/|gitlab|github/i);
    for (const url of published.match(/https?:\/\/[^"'\s]+/g) ?? []) expect(new URL(url).hostname, url).toBe('ignitecuriosity.org');
  });

  it('keep nothing on the device: the journey pages and their progress component never write', () => {
    for (const path of ['src/components/JourneyProgress.astro', 'src/pages/journeys/[id].astro', 'src/pages/journeys/index.astro']) {
      expect(readFileSync(join(root, path), 'utf8'), path).not.toMatch(/store\.save\(|setItem\(|document\.cookie|fetch\(|sendBeacon/);
    }
  });
});

// Synthetic cases against a tiny registry: each fails for the reason it names.
const none: IdentifierSet = { 'kata-id': [], 'kata-route': [], field: [], outcome: [], artifact: [], capability: [], constraint: [], 'stack-recipe': [] };
const tiny: JourneyRegistries = {
  lock: { ...none, 'kata-id': ['UX-001', 'UX-002', 'UX-003'], 'kata-route': ['/katas/old', '/katas/new'], field: ['ux', 'gone'] },
  live: { ...none, 'kata-id': ['UX-001', 'UX-003'], 'kata-route': ['/katas/new'], field: ['ux'] },
  ledger: { moves: [{ kind: 'kata-route', from: '/katas/old', to: '/katas/new', issue: 83, date: '2026-11-21', reason: 'test' }], retired: [{ kind: 'kata-id', id: 'UX-002', issue: 83, date: '2026-11-21', reason: 'test' }, { kind: 'field', id: 'gone', issue: 83, date: '2026-11-21', reason: 'test' }] },
  tracks: new Map([['design', 'Design']]),
  kataPages: new Map([['UX-001', { href: '/katas/new', title: 'New' }]]),
  routeTitles: new Map([['/katas/new', 'New']]),
};
const step = (spark: string, refs: JourneyInput['steps'][number]['refs'] = [{ kind: 'track', slug: 'design' }]) => ({ spark, ignite: 'Ask.', dojo: 'Do.', refs }) as JourneyInput['steps'][number];
const good: JourneyInput = {
  id: 'design', title: 'T', summary: 'S', fieldIds: ['ux'],
  ignite: { program: 'P', url: 'https://ignitecuriosity.org/spark/ux.html', status: 'Being prepared.', checkedOn: '2026-11-21', linksToTracks: ['design'] },
  steps: ['seek', 'play', 'apply', 'research', 'know'].map((spark) => step(spark)),
  foundations: [{ kind: 'kata', id: 'UX-001' }],
};
const withRefs = (refs: JourneyInput['foundations']): JourneyInput => ({ ...good, foundations: refs });
const problemsOf = (journey: JourneyInput) => checkJourneys([journey], tiny).problems.join('\n');

describe('a journey reference that does not resolve fails the build', () => {
  it('accepts a sound journey, so the cases below fail for their own reason', () => {
    expect(checkJourneys([good], tiny).problems).toEqual([]);
  });

  it('rejects a kata ID that is not in the lock', () => {
    expect(problemsOf(withRefs([{ kind: 'kata', id: 'UX-009' }]))).toMatch(/kata-id UX-009 is not in src\/data\/taxonomy-lock\.json/);
  });

  it('rejects a retired kata ID', () => {
    expect(problemsOf(withRefs([{ kind: 'kata', id: 'UX-002' }]))).toMatch(/kata-id UX-002 was retired/);
  });

  it('rejects a locked, live kata ID without a page', () => {
    expect(problemsOf(withRefs([{ kind: 'kata', id: 'UX-003' }]))).toMatch(/kata-id UX-003 has no page yet/);
  });

  it('rejects a moved kata route and names where it went', () => {
    expect(problemsOf(withRefs([{ kind: 'kata-route', route: '/katas/old' }]))).toMatch(/kata-route \/katas\/old moved to \/katas\/new: update the journey/);
  });

  it('rejects a track with no file', () => {
    expect(problemsOf(withRefs([{ kind: 'track', slug: 'nowhere' }]))).toMatch(/track nowhere has no file/);
    expect(problemsOf({ ...good, ignite: { ...good.ignite, linksToTracks: ['nowhere'] } })).toMatch(/ignite\.linksToTracks: track nowhere/);
  });

  it('rejects a field that is retired or was never published', () => {
    expect(problemsOf({ ...good, fieldIds: ['gone'] })).toMatch(/field gone was retired/);
    expect(problemsOf({ ...good, fieldIds: ['maritime'] })).toMatch(/field maritime is not in src\/data\/taxonomy-lock\.json/);
  });

  it('rejects steps out of SPARK order', () => {
    expect(problemsOf({ ...good, steps: ['play', 'seek', 'apply', 'research', 'know'].map((spark) => step(spark)) })).toMatch(/step 1 must be seek/);
  });

  it('rejects an Ignite link that could identify the visitor or point elsewhere', () => {
    expect(problemsOf({ ...good, ignite: { ...good.ignite, url: 'https://ignitecuriosity.org/spark/ux.html?ref=dojo' } })).toMatch(/no query or fragment/);
    expect(problemsOf({ ...good, ignite: { ...good.ignite, url: 'https://example.org/spark/ux.html' } })).toMatch(/ignite\.url/);
  });

  it('rejects a journey listed twice', () => {
    expect(checkJourneys([good, good], tiny).problems.join('\n')).toMatch(/journey design is listed twice/);
  });
});
