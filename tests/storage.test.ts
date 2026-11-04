import { describe, expect, it } from 'vitest';
import { createStore, describeKey, storageKey, type StorageLike } from '../src/lib/storage';
import {
  countLessonsDone,
  emptyLessonProgress,
  parseLessonProgress,
  toggleLesson,
} from '../src/lib/lesson-progress';
import { itemKey, parseChecklist, renderChecklistMarkdown, setTicked, countTicked } from '../src/lib/checklist';

class FakeStorage implements StorageLike {
  private data = new Map<string, string>();
  get length(): number {
    return this.data.size;
  }
  key(index: number): string | null {
    return [...this.data.keys()][index] ?? null;
  }
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

/** Storage that throws on every call, like a browser with site data blocked or a full quota. */
class ThrowingStorage implements StorageLike {
  get length(): number {
    throw new Error('blocked');
  }
  key(): string | null {
    throw new Error('blocked');
  }
  getItem(): string | null {
    throw new Error('blocked');
  }
  setItem(): void {
    throw new Error('blocked');
  }
  removeItem(): void {
    throw new Error('blocked');
  }
}

const fixedNow = () => new Date('2026-11-04T10:00:00Z');
const accept = (data: unknown) => data as { n: number };

describe('createStore', () => {
  it('saves under a namespaced key with a versioned envelope', () => {
    const backing = new FakeStorage();
    const store = createStore(() => backing, fixedNow);
    expect(store.persistent).toBe(true);
    expect(store.save('demo', 1, { n: 5 })).toBe(true);
    const raw = JSON.parse(backing.getItem(storageKey('demo')) ?? 'null');
    expect(raw).toEqual({ v: 1, savedAt: '2026-11-04T10:00:00.000Z', data: { n: 5 } });
    expect(store.load('demo', { version: 1, validate: accept })).toEqual({ n: 5 });
  });

  it('ignores a value written by another version unless a migration is given', () => {
    const backing = new FakeStorage();
    const store = createStore(() => backing, fixedNow);
    store.save('demo', 1, { n: 5 });
    expect(store.load('demo', { version: 2, validate: accept })).toBeUndefined();
    const migrated = store.load('demo', {
      version: 2,
      validate: accept,
      migrate: (_from, data) => ({ n: (data as { n: number }).n * 2 }),
    });
    expect(migrated).toEqual({ n: 10 });
    // A newer version than this code knows is never read as if it were current.
    store.save('future', 9, { n: 1 });
    expect(store.load('future', { version: 2, validate: accept, migrate: () => ({ n: 0 }) })).toBeUndefined();
  });

  it('survives bad stored values', () => {
    const backing = new FakeStorage();
    const store = createStore(() => backing, fixedNow);
    backing.setItem(storageKey('a'), 'not json');
    backing.setItem(storageKey('b'), '{"v":"x","data":1}');
    backing.setItem(storageKey('c'), '{"v":1}');
    for (const name of ['a', 'b', 'c', 'missing']) {
      expect(store.load(name, { version: 1, validate: accept })).toBeUndefined();
    }
  });

  it('keeps working in memory when storage throws', () => {
    const store = createStore(() => new ThrowingStorage(), fixedNow);
    expect(store.persistent).toBe(false);
    expect(store.save('demo', 1, { n: 7 })).toBe(false);
    expect(store.load('demo', { version: 1, validate: accept })).toEqual({ n: 7 });
    expect(store.names()).toEqual(['demo']);
    expect(store.exportAll()).toHaveProperty([storageKey('demo')]);
    expect(store.clearAll()).toBe(1);
    expect(store.load('demo', { version: 1, validate: accept })).toBeUndefined();
  });

  it('copes when the storage object itself cannot be reached', () => {
    const store = createStore(() => {
      throw new Error('SecurityError');
    }, fixedNow);
    expect(store.persistent).toBe(false);
    expect(store.save('demo', 1, { n: 1 })).toBe(false);
    expect(store.remove('demo')).toBe(false);
  });

  it('exports and clears only Dojo keys, and includes the older progress key', () => {
    const backing = new FakeStorage();
    backing.setItem('dojo-theme', 'dark');
    backing.setItem('other-site-key', 'keep');
    backing.setItem('dojo-progress-v1', '{"completed":{"developer-week-1":"2026-11-01"}}');
    const store = createStore(() => backing, fixedNow);
    store.save('lessons', 1, { done: {} });
    expect(store.names()).toEqual(['lessons']);
    expect(Object.keys(store.exportAll()).sort()).toEqual(['dojo-progress-v1', 'dojo:lessons']);
    expect(store.clearAll()).toBe(2);
    expect(backing.getItem('dojo-theme')).toBe('dark');
    expect(backing.getItem('other-site-key')).toBe('keep');
    expect(backing.getItem('dojo-progress-v1')).toBeNull();
    expect(store.names()).toEqual([]);
  });

  it('removes one name', () => {
    const backing = new FakeStorage();
    const store = createStore(() => backing, fixedNow);
    store.save('a', 1, 1);
    store.save('b', 1, 2);
    store.remove('a');
    expect(store.names()).toEqual(['b']);
  });

  it('gives readable names for the export panel', () => {
    expect(describeKey('dojo:self-assessment:track-a')).toBe('Track A self-assessment');
    expect(describeKey('dojo:checklist:weekly-checklist-track-a')).toBe('Checklist ticks on weekly-checklist-track-a');
    expect(describeKey('dojo-progress-v1')).toBe('Module progress on the Train page');
  });
});

describe('lesson progress', () => {
  it('toggles and counts lessons of one track', () => {
    const noon = new Date(2026, 10, 4, 12);
    const on = toggleLesson(emptyLessonProgress(), 'tracks/x/01-a', noon);
    expect(on.done['tracks/x/01-a']).toBe('2026-11-04');
    expect(countLessonsDone(on, ['tracks/x/01-a', 'tracks/x/02-b'])).toBe(1);
    expect(countLessonsDone(on, ['tracks/y/01-a'])).toBe(0);
    expect(toggleLesson(on, 'tracks/x/01-a', noon).done).toEqual({});
  });

  it('parses defensively', () => {
    expect(parseLessonProgress(null).done).toEqual({});
    expect(parseLessonProgress({ done: [] }).done).toEqual({});
    expect(parseLessonProgress({ done: { ok: '2026-11-04', bad: 'yesterday', num: 5 } }).done).toEqual({ ok: '2026-11-04' });
  });
});

describe('checklist', () => {
  it('makes a stable key that ignores spacing and case, and differs by heading', () => {
    expect(itemKey('Week 1', 'Draw the map')).toBe(itemKey('Week 1', '  draw   the map '));
    expect(itemKey('Week 1', 'Draw the map')).not.toBe(itemKey('Week 2', 'Draw the map'));
    expect(itemKey('a', 'b')).toMatch(/^[0-9a-f]{8}$/);
  });

  it('ticks, unticks and counts', () => {
    const a = itemKey('h', 'one');
    const b = itemKey('h', 'two');
    let state = setTicked({ ticked: [] }, a, true);
    state = setTicked(state, a, true);
    expect(state.ticked).toEqual([a]);
    expect(countTicked(state, [a, b])).toBe(1);
    expect(setTicked(state, a, false).ticked).toEqual([]);
  });

  it('parses defensively', () => {
    expect(parseChecklist('x').ticked).toEqual([]);
    expect(parseChecklist({ ticked: ['abcdef01', 'abcdef01', 'zz', 5] }).ticked).toEqual(['abcdef01']);
  });

  it('renders a Markdown copy with ticks', () => {
    const a = itemKey('Week 1', 'Draw the map');
    const b = itemKey('Week 1', 'List the repos');
    const md = renderChecklistMarkdown(
      'Weekly checklist',
      [{ heading: 'Week 1', items: [{ key: a, text: 'Draw the map' }, { key: b, text: 'List the repos' }] }],
      { ticked: [a] },
      '2026-11-04',
    );
    expect(md).toContain('# Weekly checklist');
    expect(md).toContain('1 of 2 done.');
    expect(md).toContain('- [x] Draw the map');
    expect(md).toContain('- [ ] List the repos');
    expect(md.endsWith('\n')).toBe(true);
  });
});
