import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The finance pathway (#93). tools/finance_pathway.py computes everything under generated/, and the CI job
// finance_pathway recomputes it and fails on any difference. These tests pin what the page and recipes claim.

const EX = 'public/examples/finance-pathway';
const GEN = join(EX, 'generated');
const json = <T>(path: string): T => JSON.parse(readFileSync(join(GEN, path), 'utf8')) as T;
const REGULATION = 'inputs/ecfr-12-cfr-1026-22.xml';
const PINNED_REGULATION = 'ed61b93aa82d23aa6f02600936871b1e00432b34507fdd9c681fbbbaf2db0d7e';

interface Check { id: string; published: string; computed: string; status: string; note?: string }
interface Apr { t: number; f: string; apr_percent: string }
interface ToleranceRow { accurateDisclosures_percent: [string, string]; ignoringOddDaysDifference_percentagePoints: string; ignoringOddDaysWithinTolerance: boolean }
interface Card { apr_percent: string; change_percentagePoints: string; beyondTolerance: boolean }

describe('finance pathway files', () => {
  it('serves 12 CFR 1026.22 unchanged, at the hash the manifest records', () => {
    const bytes = readFileSync(join(EX, REGULATION));
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(PINNED_REGULATION);
    expect(json<{ inputs: Record<string, string> }>('manifest.json').inputs).toEqual({ [REGULATION]: PINNED_REGULATION });
    expect(bytes.toString('utf8')).toContain('<HEAD>§ 1026.22 Determination of annual percentage rate.</HEAD>');
  });

  it('lists every generated file in the manifest', () => {
    const manifest = json<{ outputs: string[]; python: string }>('manifest.json');
    expect(manifest.python).toBe('3.12');
    expect(manifest.outputs).toEqual(['apr.json', 'disclosure.json', 'manifest.json', 'randori/cards.json', 'reference-checks.json', 'schedule.csv', 'summary.md', 'tolerance.json']);
    for (const output of manifest.outputs) expect(() => readFileSync(join(GEN, output)), output).not.toThrow();
  });

  it('reproduces every Appendix J value it lists', () => {
    const result = json<{ passed: number; failed: number; checks: Check[] }>('reference-checks.json');
    expect([result.passed, result.failed, result.checks.length]).toEqual([20, 0, 20]);
    for (const check of result.checks) expect(check.status, check.id).toBe('pass');
    const byId = Object.fromEntries(result.checks.map((check) => [check.id, check]));
    expect(byId['b9-APR']?.computed).toBe('12.83');
    expect(byId['c1-ii-tf']?.computed).toBe('t = 1; f = 19/30');
    expect(byId['c1-iv-tf']?.computed).toBe('t = 1; f = 39/90');
    // Only the (b)(9) intermediate values, printed from a 10-digit calculator, are compared at fewer decimals.
    expect(result.checks.filter((check) => check.note !== undefined).map((check) => check.id)).toEqual(['b9-A1', 'b9-A2', 'b9-I1', 'b9-I2', 'b9-I3']);
  });

  it('matches the numbers the recipes quote', () => {
    const aprs = json<Record<string, Apr>>('apr.json');
    expect(Object.fromEntries(Object.entries(aprs).map(([id, row]) => [id, row.apr_percent]))).toEqual({ 'c1-i': '9.69', 'c1-ii': '11.82', 'c1-iii': '10.34', 'c1-iv': '8.97', 'c1-v': '14.96', 'c3-i': '10.50', 'c3-ii': '12.22' });
    expect(json<Record<string, string>>('disclosure.json')).toMatchObject({ amountFinanced: '5000.00', financeCharge: '520.00', totalOfPayments: '5520.00', annualPercentageRate: '9.69', balanceAfterLastPayment: '0.02' });
    const tolerance = json<{ regular: { percentagePoints: string; paragraph: string }; irregular: { percentagePoints: string }; examples: Record<string, ToleranceRow> }>('tolerance.json');
    expect([tolerance.regular.paragraph, tolerance.regular.percentagePoints, tolerance.irregular.percentagePoints]).toEqual(['1026.22(a)(2)', '0.125', '0.25']);
    expect(tolerance.examples['c1-i']?.accurateDisclosures_percent).toEqual(['9.57', '9.81']);
    expect(Object.entries(tolerance.examples).filter(([, row]) => !row.ignoringOddDaysWithinTolerance).map(([id]) => id)).toEqual(['c1-ii', 'c1-iii', 'c1-iv', 'c1-v', 'c3-ii']);
    expect(tolerance.examples['c1-v']?.ignoringOddDaysDifference_percentagePoints).toBe('3.51');
    const cards = json<Record<string, Card>>('randori/cards.json');
    expect(Object.fromEntries(Object.entries(cards).map(([id, card]) => [id, [card.apr_percent, card.change_percentagePoints, card.beyondTolerance]]))).toEqual({ A: ['8.95', '-0.74', true], B: ['10.69', '1.01', true], C: ['10.50', '0.81', true] });
    // Card C is Appendix J's own example (c)(3)(i).
    expect(cards.C?.apr_percent).toBe(aprs['c3-i']?.apr_percent);
  });

  it('has one schedule row for every payment, ending at the balance the disclosure reports', () => {
    const lines = readFileSync(join(GEN, 'schedule.csv'), 'utf8').trim().split('\n');
    expect(lines[0]).toBe('payment,date,payment_usd,interest_usd,principal_usd,balance_usd');
    expect(lines).toHaveLength(25);
    expect(lines[1]?.startsWith('1,1978-02-10,230.00,')).toBe(true);
    expect(lines[24]?.endsWith(',0.02')).toBe(true);
  });

  it('names no person and claims no compliance in what it publishes', () => {
    for (const path of ['README.md', 'tools/finance_pathway.py', 'tools/fetch_input.py', 'generated/summary.md', REGULATION]) {
      const text = readFileSync(join(EX, path), 'utf8');
      expect(text, path).not.toMatch(/@[a-z0-9-]+\.[a-z]/i);
    }
    for (const path of ['README.md', 'generated/summary.md']) expect(readFileSync(join(EX, path), 'utf8'), path).toMatch(/not a compliance review/i);
  });
});
