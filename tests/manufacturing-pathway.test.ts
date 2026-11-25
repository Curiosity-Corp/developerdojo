import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The manufacturing pathway (#93). tools/manufacturing_pathway.py computes everything under generated/, and the CI
// job manufacturing_pathway recomputes it and fails on any difference. These tests pin what the page and recipes claim.

const EX = 'public/examples/manufacturing-pathway';
const GEN = join(EX, 'generated');
const json = <T>(path: string): T => JSON.parse(readFileSync(join(GEN, path), 'utf8')) as T;
const DATA = 'inputs/lithogra-data-rows.dat';
const PINNED_DATA = 'd7c27b047ed06606dbd3aaf8deead0a094a1a628cebf2ee2f002f7ed7e7c2204';

interface Check { id: string; published: string; computed: string; status: string; note?: string }
interface Limits { center: string; UCL: string; LCL: string; meansBeyondLimits: number }
interface Component { variance: string; share_percent: string }
interface Card { center: string; halfWidthChange_percent: string; meansBeyondLimits: number; changeInMeansBeyond: number; subgroups: number }

describe('manufacturing pathway files', () => {
  it('serves the 450 data rows of LITHOGRA.DAT unchanged, at the hash the manifest records', () => {
    const bytes = readFileSync(join(EX, DATA));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(PINNED_DATA);
    expect(bytes.length).toBe(24300);
    expect(json<{ inputs: Record<string, string> }>('manifest.json').inputs).toEqual({ [DATA]: PINNED_DATA });
    const rows = bytes.toString('latin1').split('\r\n').filter((line) => line.trim() !== '');
    expect(rows).toHaveLength(450);
  });

  it('lists every generated file in the manifest', () => {
    const manifest = json<{ outputs: string[]; python: string }>('manifest.json');
    expect(manifest.python).toBe('3.12');
    expect(manifest.outputs).toEqual(['control-limits.json', 'inspection.json', 'manifest.json', 'randori/cards.json', 'reference-checks.json', 'subgroups.csv', 'summary.md', 'variation.json']);
    for (const output of manifest.outputs) expect(() => readFileSync(join(GEN, output)), output).not.toThrow();
  });

  it('reproduces every handbook value it lists', () => {
    const result = json<{ passed: number; failed: number; checks: Check[] }>('reference-checks.json');
    expect([result.passed, result.failed, result.checks.length]).toEqual([60, 0, 60]);
    for (const check of result.checks) expect(check.status, check.id).toBe('pass');
    const byId = Object.fromEntries(result.checks.map((check) => [check.id, check]));
    expect(byId['litho-mean']?.computed).toBe('2.53228');
    expect(byId['anova-ms-cassette']?.computed).toBe('4.3932');
    expect(byId['A2-5']?.computed).toBe('0.577');
    expect(byId['c4-10']?.computed).toBe('0.9727');
    expect(byId['individuals-UCL']?.computed).toBe('55.8041');
    expect(byId['capability-Cpk']?.computed).toBe('0.6667');
    // Only two printed values are one unit off in their last digit, each with its reason.
    expect(result.checks.filter((check) => check.note !== undefined).map((check) => check.id)).toEqual(['D4-5', 'rejects-8']);
  });

  it('matches the numbers the page and recipes quote', () => {
    const inspection = json<{ structure: Record<string, number>; missing: number; lowestSite: string }>('inspection.json');
    expect(inspection.structure).toEqual({ cassettes: 30, wafersPerCassette: 3, sitesPerWafer: 5, rows: 450 });
    expect([inspection.missing, inspection.lowestSite]).toEqual([0, 'Center']);
    const control = json<{ xbarS: Limits & { sUCL: string; sigma: string }; xbarR: Limits & { rBar: string }; lotMeans: { UCL: string; LCL: string; beyondLimits: string[] } }>('control-limits.json');
    expect([control.xbarS.center, control.xbarS.LCL, control.xbarS.UCL, control.xbarS.sigma, control.xbarS.meansBeyondLimits]).toEqual(['2.5323', '1.9507', '3.1139', '0.4335', 27]);
    expect([control.xbarR.rBar, control.xbarR.LCL, control.xbarR.UCL, control.xbarR.meansBeyondLimits]).toEqual(['1.0499', '1.9267', '3.1379', 25]);
    expect([control.lotMeans.LCL, control.lotMeans.UCL, control.lotMeans.beyondLimits]).toEqual(['1.1417', '3.9229', ['cassette 27']]);
    const variation = json<{ components: Record<string, Component>; totalSd_um: string; overstatement: { ratio: string } }>('variation.json');
    expect(Object.fromEntries(Object.entries(variation.components).map(([id, row]) => [id, row.share_percent]))).toEqual({ cassette: '54.0', wafer: '10.2', site: '35.8' });
    expect([variation.totalSd_um, variation.overstatement.ratio]).toEqual(['0.7000', '1.61']);
    const cards = json<Record<string, Card>>('randori/cards.json');
    expect(Object.fromEntries(Object.entries(cards).map(([id, card]) => [id, [card.halfWidthChange_percent, card.meansBeyondLimits, card.changeInMeansBeyond]]))).toEqual({ A: ['0.3', 19, -8], B: ['-38.1', 14, -13], C: ['4.1', 25, -2] });
    // Every card is measured against the X-bar and s chart with the wafer as subgroup.
    for (const card of Object.values(cards)) expect(card.meansBeyondLimits - card.changeInMeansBeyond).toBe(control.xbarS.meansBeyondLimits);
  });

  it('has one subgroup row for every wafer, flagged as the limits say', () => {
    const lines = readFileSync(join(GEN, 'subgroups.csv'), 'utf8').trim().split('\n');
    expect(lines[0]).toBe('cassette,wafer,mean_um,sd_um,range_um,mean_beyond_xbar_s_limits');
    expect(lines).toHaveLength(91);
    expect(lines.filter((line) => line.endsWith(',yes'))).toHaveLength(27);
  });

  it('names no person and claims no engineering review in what it publishes', () => {
    for (const path of ['README.md', 'tools/manufacturing_pathway.py', 'tools/fetch_input.py', 'generated/summary.md', DATA]) {
      const text = readFileSync(join(EX, path), 'utf8');
      expect(text, path).not.toMatch(/@[a-z0-9-]+\.[a-z]/i);
    }
    for (const path of ['README.md', 'generated/summary.md']) expect(readFileSync(join(EX, path), 'utf8'), path).toMatch(/not an engineering review/i);
  });
});
