import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Pocket Garden reference handoff', () => {
  it('keeps the downloadable values traceable to the working example', () => {
    const html = readFileSync(new URL('../public/examples/pocket-garden.html', import.meta.url), 'utf8');
    const tokens = JSON.parse(readFileSync(new URL('../public/examples/pocket-garden-tokens.json', import.meta.url), 'utf8'));
    expect(tokens.source).toBe('pocket-garden.html');
    for (const section of ['colors', 'typography', 'spacing', 'corners']) {
      for (const value of Object.values(tokens[section]) as string[]) {
        expect(html).toContain(value);
      }
    }
  });
});
