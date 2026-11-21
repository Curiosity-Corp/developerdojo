import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PRODUCT, SCREENS, START_STATE, STATES, TRANSITIONS } from '../src/data/pocket-invoice';

// The UX pathway's open files (#91). The flow file learners download and edit is the flow in src/data, unchanged, so
// there is still one source; and the files the ux_pathway CI job regenerates from it say every check passed for
// this exact flow. The job itself reruns the script and diffs its output; these tests pin what the page quotes.

const DIR = 'public/examples/ux-pathway/';
const read = (path: string): string => readFileSync(DIR + path, 'utf8');
const json = (path: string): unknown => JSON.parse(read(path));

interface FlowChecks { product: string; start: string; states: number; transitions: number; pass: boolean; checks: { id: string; pass: boolean; failures: string[] }[]; contrast: { foreground: string; background: string; ratio: number | null; minimum: number; pass: boolean }[] }
interface Manifest { generator: string; inputs: Record<string, string>; outputs: string[]; drawings: Record<string, { width: number; height: number }> }
interface PairFile { groups: { name: string; minimum: number; pairs: [string, string][] }[] }

describe('the published Pocket Invoice flow file', () => {
  it('is the flow in src/data/pocket-invoice.ts', () => {
    const expected: unknown = JSON.parse(JSON.stringify({ product: PRODUCT, screens: SCREENS, start: START_STATE, states: STATES, transitions: TRANSITIONS }));
    expect(json('inputs/pocket-invoice-flow.json')).toEqual(expected);
  });
});

describe('the generated low-fidelity files', () => {
  const checks = json('generated/flow-checks.json') as FlowChecks;
  const manifest = json('generated/manifest.json') as Manifest;
  const pairs = json('inputs/contrast-pairs.json') as PairFile;

  it('pass every check, for this flow', () => {
    expect(checks.states).toBe(STATES.length);
    expect(checks.transitions).toBe(TRANSITIONS.length);
    expect(checks.start).toBe(START_STATE);
    expect(checks.checks.filter((check) => !check.pass)).toEqual([]);
    expect(checks.pass).toBe(true);
    expect(checks.checks.map((check) => check.id)).toEqual(expect.arrayContaining(['reachable', 'no-dead-ends', 'errors-recover', 'dialogs-close', 'buttons-wired', 'token-contrast']));
    expect(checks.contrast).toHaveLength(pairs.groups.reduce((total, group) => total + group.pairs.length, 0));
    for (const pair of checks.contrast) expect(pair.ratio, pair.foreground + ' on ' + pair.background).toBeGreaterThanOrEqual(pair.minimum);
  });

  it('draw one screen per state, a sitemap and a journey with every transition', () => {
    for (const state of STATES) {
      const name = 'wireframes/' + state.id + '.svg';
      expect(manifest.outputs).toContain(name);
      expect(read('generated/' + name)).toContain('<title id="title">' + state.title.replace(/&/g, '&amp;'));
      expect(manifest.drawings[name]?.width).toBe(390);
    }
    for (const name of ['sitemap.svg', 'journey.svg']) {
      const svg = read('generated/' + name);
      for (let n = 1; n <= TRANSITIONS.length; n++) expect(svg, name + ' transition ' + n).toContain('data-transition="' + n + '"');
      for (const state of STATES) expect(svg, name + ' ' + state.id).toContain('data-state="' + state.id + '"');
      expect(manifest.drawings[name]?.width).toBeGreaterThan(0);
    }
  });

  it('were made from the inputs published beside them', () => {
    expect(Object.keys(manifest.inputs).sort()).toEqual(['inputs/contrast-pairs.json', 'inputs/pocket-invoice-flow.json', 'pocket-invoice-tokens.json']);
    for (const [name, sha] of Object.entries(manifest.inputs)) expect(createHash('sha256').update(readFileSync(DIR + name)).digest('hex'), name).toBe(sha);
  });
});
