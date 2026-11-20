import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { kataCatalog } from '../src/data/kata-catalog';
import { KATA_DIRECTORY } from '../src/data/kata-directory';
import { checklistName } from '../src/lib/checklist';
import { fields } from '../src/lib/fields';
import { LESSON_PROGRESS_NAME, LESSON_PROGRESS_VERSION, parseLessonProgress } from '../src/lib/lesson-progress';
import { ALL_MODULES, PROGRESS_STORAGE_KEY, parseState } from '../src/lib/progress';
import { LEGACY_KEYS, NAMESPACE, describeKey, storageKey } from '../src/lib/storage';

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
