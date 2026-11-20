import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TERMS } from '../src/lib/terms';

// The terminology guide on /start and the library glossary must say the same thing (#79).
const glossary = readFileSync(new URL('../src/content/library/glossary.md', import.meta.url), 'utf8');

describe('terminology guide', () => {
  it('covers the words the site uses for its practice model and path', () => {
    const names = TERMS.map((t) => t.term);
    for (const required of ['Developer', 'Master Developer', 'Sensei', 'Kata', 'Belt', 'Randori', 'Mission', 'Universal foundation', 'Field expertise']) {
      expect(names).toContain(required);
    }
    expect(new Set(names).size).toBe(names.length);
  });

  it('gives each term the same definition as the glossary', () => {
    for (const { term, definition } of TERMS) {
      expect(glossary, term).toContain(`**${term}.** ${definition}`);
    }
  });

  it('links each term to a site route', () => {
    for (const { term, href } of TERMS) {
      expect(href, term).toMatch(/^\/[a-z0-9/#-]*$/);
    }
  });

  it('says the orchestrator is the developer, and does not claim belts are issued', () => {
    const orchestrator = TERMS.find((t) => t.term === 'Orchestrator');
    expect(orchestrator?.definition).toContain('The orchestrator is the developer.');
    expect(TERMS.find((t) => t.term === 'Belt')?.definition).toContain('not issued yet');
  });
});
