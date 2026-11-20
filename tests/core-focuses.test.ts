import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { coreFocusTrackSlugs, coreFocuses, sharedFocusTrack } from '../src/lib/core-focuses';
import { trackSchema } from '../src/lib/schemas';

/**
 * The core-focus tracks have stable public URLs that other sites link to (docs/track-urls.md, issue #125).
 * These checks keep src/lib/core-focuses.ts and the track files in step, and keep each track's capstone in place.
 */
const root = join(import.meta.dirname, '..');
const trackDir = join(root, 'src', 'content', 'tracks');
const lessonDir = join(root, 'src', 'content', 'library', 'tracks');

/** The URLs published to other sites. Changing this list means breaking their links: read docs/track-urls.md first. */
const PUBLISHED = ['robot-software', 'robot-learning', 'bioinformatics', 'lab-automation-in-code', 'safety-reports-and-review'];

function frontmatter(file: string): Record<string, unknown> {
  const text = readFileSync(file, 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match?.[1]) throw new Error(`${file} has no frontmatter`);
  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = /^([a-z]+):\s*"?(.*?)"?\s*$/.exec(line);
    if (field?.[1]) data[field[1]] = field[2];
  }
  return data;
}

describe('core focuses', () => {
  it('lists exactly the published track URLs, shared modules last', () => {
    expect(coreFocusTrackSlugs).toEqual(PUBLISHED);
    expect(coreFocusTrackSlugs.at(-1)).toBe(sharedFocusTrack.slug);
  });

  for (const slug of PUBLISHED) {
    describe(slug, () => {
      const file = join(trackDir, `${slug}.md`);

      it('has a track file', () => {
        expect(existsSync(file), `${file} is missing`).toBe(true);
      });

      it('sits in a core-focus group', () => {
        expect(['robotics', 'biotechnology', 'frontier']).toContain(frontmatter(file).group);
      });

      it('has at least three lessons', () => {
        const lessons = existsSync(join(lessonDir, slug)) ? readdirSync(join(lessonDir, slug)).filter((f) => f.endsWith('.md')) : [];
        expect(lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  }

  for (const focus of coreFocuses) {
    for (const track of focus.tracks) {
      it(`${track.slug} ends in a capstone lesson`, () => {
        const lessons = readdirSync(join(lessonDir, track.slug)).filter((f) => f.endsWith('.md')).sort();
        expect(lessons.at(-1) ?? '', `${track.slug} last lesson`).toMatch(/^\d{2}-capstone-/);
      });

      it(`${track.slug} title on the home page matches the track file`, () => {
        expect(frontmatter(join(trackDir, `${track.slug}.md`)).title).toBe(track.title);
      });
    }
  }

  it('every track in a core-focus group is listed, so none is left off the home page', () => {
    const inCoreGroups = readdirSync(trackDir)
      .filter((f) => f.endsWith('.md'))
      .filter((f) => ['robotics', 'biotechnology', 'frontier'].includes(String(frontmatter(join(trackDir, f)).group)))
      .map((f) => f.replace(/\.md$/, ''))
      .sort();
    expect(inCoreGroups).toEqual([...PUBLISHED].sort());
  });

  it('the track schema accepts the core-focus groups', () => {
    const base = { title: 'T', description: 'D', order: 1, icon: 'bot', level: 'core', skills: ['robot-software'], outcomes: ['o'] };
    for (const group of ['robotics', 'biotechnology', 'frontier']) {
      expect(trackSchema.safeParse({ ...base, group }).success, group).toBe(true);
    }
  });
});
