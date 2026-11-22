import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PRODUCT, SCREENS, START_STATE, STATES, TRANSITIONS, stateById } from '../src/data/pocket-invoice';
import { audit, theme } from '../public/examples/ux-pathway/tools/ux_hifi.mjs';

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
    expect(Object.keys(manifest.inputs).sort()).toEqual(['inputs/brand.json', 'inputs/contrast-pairs.json', 'inputs/pocket-invoice-flow.json', 'pocket-invoice-tokens.json']);
    for (const [name, sha] of Object.entries(manifest.inputs)) expect(createHash('sha256').update(readFileSync(DIR + name)).digest('hex'), name).toBe(sha);
  });
});

interface FidelityReport {
  pass: boolean;
  componentTokens: { pass: boolean; missing: string[] };
  totals: { texts: number; controls: number; minTextContrast: number | null; minControlContrast: number | null };
  files: { file: string; pass: boolean; failures: string[]; components: string[] }[];
  notMeasured: { what: string; status: string; why: string }[];
}

describe('the generated high-fidelity files (UX-004, UX-005)', () => {
  const report = json('generated/fidelity-report.json') as FidelityReport;
  const manifest = json('generated/manifest.json') as Manifest;
  const ctx = theme(json('pocket-invoice-tokens.json'));

  it('pass the fidelity report, for every state at both widths', () => {
    expect(report.files.filter((entry) => !entry.pass)).toEqual([]);
    expect(report.componentTokens.pass).toBe(true);
    expect(report.pass).toBe(true);
    const files = report.files.map((entry) => entry.file);
    expect(files).toEqual(expect.arrayContaining(['components.svg', 'style-guide.svg']));
    for (const layout of ['phone', 'desktop']) for (const state of STATES) {
      const name = 'screens/' + layout + '/' + state.id + '.svg';
      expect(files, name).toContain(name);
      expect(manifest.outputs, name).toContain(name);
      expect(manifest.drawings[name]?.width, name).toBe(layout === 'phone' ? 390 : 1440);
    }
    expect(report.totals.minTextContrast).toBeGreaterThanOrEqual(4.5);
    expect(report.totals.minControlContrast).toBeGreaterThanOrEqual(3);
  });

  it('label what was not measured as unavailable or proposed, never as a number', () => {
    expect(report.notMeasured.length).toBeGreaterThan(0);
    for (const item of report.notMeasured) expect(item.status, item.what).not.toMatch(/^\s*[\d.]+\s*%?\s*$/);
    expect(report.notMeasured.map((item) => item.status).join(' ')).toMatch(/unavailable/);
  });

  it('re-check as passing here, and fail when a drawing leaves the tokens', () => {
    const name = 'screens/phone/invoice-new-error.svg';
    const svg = read('generated/' + name);
    const elements = stateById('invoice-new-error').elements.length;
    expect(audit(svg, ctx, elements).failures).toEqual([]);
    const primary = String(ctx.tokens.get('color.action.primary')?.resolved);
    const page = String(ctx.tokens.get('color.surface.page')?.resolved);
    expect(svg).toContain('fill="' + primary + '"');
    const offPalette = audit(svg.replace('fill="' + primary + '"', 'fill="#ff00ff"'), ctx, elements);
    expect(offPalette.failures.join('\n')).toContain('#ff00ff is not a token colour');
    const offScale = audit(svg.replace('font-size="16"', 'font-size="15"'), ctx, elements);
    expect(offScale.pass).toBe(false);
    const heading = 'font-size="24" font-weight="700" fill="' + String(ctx.tokens.get('color.text.default')?.resolved) + '"';
    expect(svg).toContain(heading);
    const faded = audit(svg.replace(heading, 'font-size="24" font-weight="700" fill="' + page + '"'), ctx, elements);
    expect(faded.failures.join('\n')).toContain('"New invoice" ' + page + ' on ' + page + ': 1.00:1');
    const translucent = audit(svg.replace('<rect ', '<rect opacity="0.5" '), ctx, elements);
    expect(translucent.failures.join('\n')).toContain('opacity');
  });
});
