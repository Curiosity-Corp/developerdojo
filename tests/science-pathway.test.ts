import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The science pathway (#93). tools/science_pathway.py computes everything under generated/, and the CI job
// science_pathway recomputes it and fails on any difference. These tests pin what the page and recipes claim.

const EX = 'public/examples/science-pathway';
const GEN = join(EX, 'generated');
const json = <T>(path: string): T => JSON.parse(readFileSync(join(GEN, path), 'utf8')) as T;
const RECORD = 'inputs/gistemp-v4-global-land-ocean.csv';
const PINNED_RECORD = 'a7b1939db2e7e484c798e925e0f07f8184356c52ac0e7ce264adcd0f25e81253';

interface Check { id: string; published: number; computed: number; status: string; tolerance?: number; note?: string }
interface Output { estimate_ohm: number; combinedStandardUncertainty_ohm: number; ifInputsUncorrelated_ohm: number }
interface Trend { period: string; n: number; t0: number; slope_C_per_decade: number; u_slope_C_per_decade: number; residualLag1Autocorrelation: number; unavailable: string[] }
interface Card extends Trend { changeInSlope_C_per_decade: number; uncertaintyRatio: number }
interface Inspection {
  title: string; firstYear: number; lastYear: number; years: number; missingCells: number; missingByColumn: Record<string, number[]>;
  basePeriod: { years: string; meanOfAnnualValues: number; largestMonthMean: number };
  annualAgainstMonths: { yearsCompared: number; sameAtTwoDecimals: number; withinRounding: number };
}

describe('science pathway files', () => {
  it('serves the GISTEMP record unchanged, at the hash the manifest records', () => {
    const bytes = readFileSync(join(EX, RECORD));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(PINNED_RECORD);
    expect(json<{ inputs: Record<string, string> }>('manifest.json').inputs).toEqual({ [RECORD]: PINNED_RECORD });
    expect(bytes.toString('utf8').split('\n')[0]?.trim()).toBe('Land-Ocean: Global Means');
  });

  it('lists every generated file in the manifest', () => {
    const manifest = json<{ outputs: string[]; python: string }>('manifest.json');
    expect(manifest.python).toBe('3.12');
    expect(manifest.outputs).toEqual(expect.arrayContaining(['reference-checks.json', 'inspection.json', 'uncertainty-budget.csv', 'trend.json', 'randori/cards.json']));
    for (const output of manifest.outputs) expect(() => readFileSync(join(GEN, output)), output).not.toThrow();
  });

  it('reproduces every GUM reference value it lists', () => {
    const result = json<{ passed: number; failed: number; checks: Check[] }>('reference-checks.json');
    expect(result.failed).toBe(0);
    expect(result.passed).toBe(result.checks.length);
    expect(result.checks.map((check) => check.id)).toEqual(expect.arrayContaining(['H2-V-u', 'H3-uc-Z', 'H5-uc-R', 'H3-u-b30', 'H6-b-11']));
    for (const check of result.checks) {
      if (check.note === undefined) expect(check.computed, check.id).toBe(check.published);
      else expect(Math.abs(check.computed - check.published), check.id).toBeLessThanOrEqual((check.tolerance ?? 0) + 1e-12);
    }
    // Only one GUM value is printed a digit off from its own equations; it carries a note saying so.
    expect(result.checks.filter((check) => check.note !== undefined).map((check) => check.id)).toEqual(['H3-uc-X']);
  });

  it('keeps the GUM budget: correlated inputs give the published combined standard uncertainties', () => {
    const budget = json<{ outputs: Record<string, Output> }>('uncertainty-budget.json');
    expect(Object.fromEntries(Object.entries(budget.outputs).map(([k, o]) => [k, [o.estimate_ohm, o.combinedStandardUncertainty_ohm, o.ifInputsUncorrelated_ohm]])))
      .toEqual({ R: [127.732, 0.071, 0.195], X: [219.847, 0.296, 0.201], Z: [254.26, 0.236, 0.204] });
    const rows = readFileSync(join(GEN, 'uncertainty-budget.csv'), 'utf8').trim().split('\n');
    expect(rows[0]).toBe('output,input,sensitivity_coefficient,standard_uncertainty_si,contribution_ohm');
    expect(rows).toHaveLength(10);
  });

  it('reads asterisks as unavailable and the base period as an anomaly near zero', () => {
    const inspection = json<Inspection>('inspection.json');
    expect(inspection).toMatchObject({ title: 'Land-Ocean: Global Means', firstYear: 1880, basePeriod: { years: '1951-1980' } });
    expect(inspection.years).toBe(inspection.lastYear - inspection.firstYear + 1);
    expect(inspection.missingCells).toBe(Object.values(inspection.missingByColumn).reduce((total, years) => total + years.length, 0));
    expect(Math.abs(inspection.basePeriod.meanOfAnnualValues)).toBeLessThanOrEqual(0.01);
    expect(inspection.annualAgainstMonths.withinRounding).toBe(inspection.annualAgainstMonths.yearsCompared);
  });

  it('matches the numbers the recipes quote', () => {
    const inspection = json<Inspection>('inspection.json');
    expect([inspection.years, inspection.missingCells, inspection.annualAgainstMonths.sameAtTwoDecimals, inspection.annualAgainstMonths.yearsCompared]).toEqual([147, 7, 134, 146]);
    const trend = json<Trend>('trend.json');
    expect(trend).toMatchObject({ period: '1991-2020', n: 30, t0: 1991, unavailable: [] });
    expect([trend.slope_C_per_decade, trend.u_slope_C_per_decade, trend.residualLag1Autocorrelation]).toEqual([0.23, 0.0186, 0.19]);
    const cards = json<Record<string, Card>>('randori/cards.json');
    expect(Object.fromEntries(Object.entries(cards).map(([id, card]) => [id, [card.changeInSlope_C_per_decade, card.uncertaintyRatio]]))).toEqual({ A: [-0.054, 1.04], B: [-0.002, 0.46], C: [0, 1] });
  });

  it('has one residual row for every year of the fit', () => {
    const lines = readFileSync(join(GEN, 'trend-residuals.csv'), 'utf8').trim().split('\n');
    expect(lines[0]).toBe('year,anomaly_c,fitted_c,residual_c');
    expect(lines).toHaveLength(31);
    expect(lines[1]?.startsWith('1991,')).toBe(true);
  });

  it('names no person and claims no certificate in what it publishes', () => {
    for (const path of ['README.md', 'tools/science_pathway.py', 'tools/fetch_input.py', 'generated/summary.md', RECORD]) {
      const text = readFileSync(join(EX, path), 'utf8');
      expect(text, path).not.toMatch(/@[a-z0-9-]+\.[a-z]/i);
      expect(text, path).not.toMatch(/\b(Lenssen|Schmidt|Hansen|Ruedy|Persin|Taylor|Kuyatt)\b/);
    }
    for (const path of ['README.md', 'generated/summary.md']) expect(readFileSync(join(EX, path), 'utf8'), path).toMatch(/not a calibration certificate/i);
  });
});
