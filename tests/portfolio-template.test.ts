import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const template = new URL('../templates/learner-portfolio/', import.meta.url);
const file = (name: string) => readFileSync(new URL(name, template), 'utf8');

describe('learner portfolio template', () => {
  it('ships a self-contained website with usable in-page links', () => {
    const html = file('index.html');
    expect(html).toMatch(/<html\s+lang="en"/i);
    expect(html).toMatch(/<main>/i);
    expect(html).toMatch(/<h1[\s>]/i);
    // The initial page must not depend on a remote script, asset or service.
    expect(html).not.toMatch(/<(?:script|iframe)\b|@import\b|url\(\s*["']?https?:/i);
    expect(html).not.toMatch(/<(?:img|link)\b[^>]*(?:src|href)\s*=\s*["']https?:/i);
    expect(html).not.toMatch(/\baction\s*=\s*["']https?:/i);
    const links = [...html.matchAll(/href="#([^"]+)"/g)];
    expect(links.length).toBeGreaterThan(0);
    for (const match of links) {
      expect(html).toContain(`id="${match[1]}"`);
    }
  });

  it('marks the starter as incomplete and keeps the template license', () => {
    expect(file('README.md')).toContain('not evidence of completed work');
    expect(file('index.html')).toContain('not claims of completed work');
    expect(file('docs/getting-started.md')).toContain('The starter contains no completed project');
    expect(file('LICENSE')).toBe(readFileSync(new URL('../LICENSE', import.meta.url), 'utf8'));
  });
});
