import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { KATA_DIRECTORY } from '../src/data/kata-directory';

describe('kata directory', () => {
  it('lists every existing kata route once so practice is not stranded', () => {
    const routes = readdirSync('src/pages/katas')
      .filter((file) => file.endsWith('.astro'))
      .map((file) => `/katas/${file.slice(0, -'.astro'.length)}`)
      .sort();
    const listed = KATA_DIRECTORY.map((kata) => kata.href).sort();
    expect(new Set(listed).size).toBe(listed.length);
    expect(listed).toEqual(routes);
    for (const kata of KATA_DIRECTORY) {
      expect(kata.title.trim()).not.toBe('');
      expect(kata.description.trim()).not.toBe('');
      expect(kata.keywords.trim()).not.toBe('');
    }
  });
});
