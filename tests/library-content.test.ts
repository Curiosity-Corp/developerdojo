import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dir = join(__dirname, '..', 'src', 'content', 'library');
const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
const slugs = new Set(files.map((f) => f.replace(/\.md$/, '')));

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

describe('library content scrub', () => {
  for (const file of files) {
    if (file === 'laptop-k8s-training-guide.md') continue; // contributed guide, outside this gate
    const body = readFileSync(join(dir, file), 'utf8');
    it(`${file} has no internal references`, () => {
      for (const pattern of BANNED) {
        expect(pattern.test(body), `${file} matches ${pattern}`).toBe(false);
      }
    });
    it(`${file} only links to library pages that exist`, () => {
      const links = [...body.matchAll(/\]\(\/library\/([a-z0-9-]+)\)/g)].map((m) => m[1] ?? '');
      for (const slug of links) {
        expect(slugs.has(slug), `${file} links to missing /library/${slug}`).toBe(true);
      }
    });
  }
});
