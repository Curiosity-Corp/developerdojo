import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dir = join(__dirname, '..', 'src', 'content', 'library');
// Every markdown file at any depth, as a path relative to src/content/library (track lessons are nested).
const files = (readdirSync(dir, { recursive: true, encoding: 'utf8' }) as string[])
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.split('\\').join('/'))
  .sort();
const trackDir = join(__dirname, '..', 'src', 'content', 'tracks');
const trackSlugs = readdirSync(trackDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));
// Pages a lesson may link to: other lessons, the two hubs and the track pages.
const slugs = new Set([
  ...files.map((f) => f.replace(/\.md$/, '')),
  'resources',
  'tracks',
  ...trackSlugs.map((slug) => `tracks/${slug}`),
]);

/** Public-site scrub gate: nothing internal may reach the Library. */
const BANNED: RegExp[] = [
  /focuscell/i,
  /pages\.developerdojo/i,
  /git\.developerdojo/i,
  /svc\.cluster\.local/i,
  /\bziti\b/i,
  /openziti/i,
  /hypermap/i,
  /hyperindex/i,
  /defectdojo\.focuscell/i,
  /harbor\.focuscell/i,
  /\bdanhup\b/i,
  /om-labs/i,
  /focusapiary/i,
  /service account/i,
  /chatgpt/i,
  /planner access/i,
];

/**
 * Narrow allowlist: the worked-example case study is about a real product and may name it.
 * Every other pattern still applies to these files, and every other file is fully gated.
 */
const ALLOWED: Array<{ file: RegExp; pattern: RegExp }> = [{ file: /^case-study-danhup-[a-z0-9-]+\.md$/, pattern: /\bdanhup\b/i }];
const isAllowed = (file: string, pattern: RegExp): boolean =>
  ALLOWED.some((rule) => rule.file.test(file) && rule.pattern.source === pattern.source);

describe('library content scrub', () => {
  for (const file of files) {
    if (file === 'laptop-k8s-training-guide.md') continue; // contributed guide, outside this gate
    const body = readFileSync(join(dir, file), 'utf8');
    it(`${file} has no internal references`, () => {
      for (const pattern of BANNED) {
        if (isAllowed(file, pattern)) continue;
        expect(pattern.test(body), `${file} matches ${pattern}`).toBe(false);
      }
    });
    it(`${file} only links to library pages that exist`, () => {
      const links = [...body.matchAll(/\]\(\/library\/([a-z0-9][a-z0-9/-]*?)\/?(?:#[^)]*)?\)/g)].map((m) => m[1] ?? '');
      for (const slug of links) {
        expect(slugs.has(slug), `${file} links to missing /library/${slug}`).toBe(true);
      }
    });
  }
});
