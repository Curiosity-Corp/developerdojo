// TEMPORARY (developerdojo#129 follow-up): measures where the published-sources scan spends its time on the
// CI runner. Removed once the timeout in published-names.test.ts is sized from its output.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findNames, loadDenylist, scanDirectories } from '../scripts/published-names.mjs';

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

describe('published-names timing', () => {
  it('reports phase timings', async () => {
    const root = join(__dirname, '..');
    const matchers = await loadDenylist();
    const bodies = matchers.map(({ name }) => name.split(' ').join('[\\s._-]*')).join('|');
    let start = performance.now();
    const files = [...(await walk(join(root, 'src'))), ...(await walk(join(root, 'public')))];
    const walkMs = performance.now() - start;
    start = performance.now();
    const texts: string[] = [];
    for (const file of files) texts.push(await readFile(file, 'utf8'));
    const sequentialReadMs = performance.now() - start;
    start = performance.now();
    let oldHits = 0;
    for (const text of texts) {
      const lines = text.split(/\r?\n/);
      for (const { pattern } of matchers) if (lines.some((line) => pattern.test(line))) oldHits += 1;
    }
    const oldMatchMs = performance.now() - start;
    start = performance.now();
    let newHits = 0;
    for (const text of texts) newHits += findNames(text, matchers).length;
    const newMatchMs = performance.now() - start;
    const variants: Record<string, RegExp> = {
      shared: new RegExp(`(?<![\\p{L}\\p{N}])(?:${bodies})(?![\\p{L}\\p{N}])`, 'iu'),
      afterOnly: new RegExp(`(?:${bodies})(?![\\p{L}\\p{N}])`, 'iu'),
      bare: new RegExp(`(?:${bodies})`, 'iu'),
      bareNoU: new RegExp(`(?:${bodies})`, 'i'),
    };
    const variantStats: Record<string, { ms: number; hits: number }> = {};
    for (const [key, pattern] of Object.entries(variants)) {
      start = performance.now();
      let hits = 0;
      for (const text of texts) if (pattern.test(text)) hits += 1;
      variantStats[key] = { ms: Math.round(performance.now() - start), hits };
    }
    console.log('PUBLISHED_NAMES_VARIANTS ' + JSON.stringify(variantStats));
    start = performance.now();
    const { scanned, findings } = await scanDirectories([join(root, 'src'), join(root, 'public')], matchers);
    const fullScanMs = performance.now() - start;
    const bytes = texts.reduce((sum, text) => sum + text.length, 0);
    console.log('PUBLISHED_NAMES_TIMING ' + JSON.stringify({
      files: files.length, bytes, names: matchers.length, walkMs: Math.round(walkMs),
      sequentialReadMs: Math.round(sequentialReadMs), oldMatchMs: Math.round(oldMatchMs),
      newMatchMs: Math.round(newMatchMs), fullScanMs: Math.round(fullScanMs), scanned, findings: findings.length,
    }));
    expect(newHits).toBe(oldHits);
  }, 120_000);
});
