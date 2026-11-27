import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The health pathway (#93). tools/health_pathway.py computes everything under generated/, and the CI job
// health_pathway recomputes it and fails on any difference. These tests pin what the page and recipes claim.

const EX = 'public/examples/health-pathway';
const GEN = join(EX, 'generated');
const json = <T>(path: string): T => JSON.parse(readFileSync(join(GEN, path), 'utf8')) as T;
const sha256 = (path: string) => createHash('sha256').update(readFileSync(join(EX, path))).digest('hex');
const PINNED = {
  'inputs/bmi-age-2022.csv': '7f416a213157a5209bb6cbfd1b19292510248f3f31fe43c9ff63f6d8e39f7890',
  'inputs/bmiagerev.csv': 'cbeea0e8d500ee15c652f3fdc45bcd02cb9c15d4d1e86f4d8048bbfea8d166e5',
  'scenario/children.csv': '7334f9cb83b752fb3f85a781f3fcc8a330f7e363d11975754e1f74fa37e1381d',
};

interface Check { id: string; source: string; quantity: string; published: string; computed: string; status: string }
interface Child { child: string; bmi: string; method: string | null; z: string | null; percentile: string | null; percentOfP95: string | null; category: string | null; lmsZ?: string; zCeiling?: string; completedMonths: number; row?: { agemos: string } }
interface Card { child: string; before: { percentile: string; category: string }; after: { percentile: string | null; category: string; zCeiling?: string; agemos?: string; sex?: string }; percentileChange?: string; categoryChanged: boolean }

describe('health pathway files', () => {
  it('serves both CDC tables and the fictional children unchanged, at the hashes the manifest records', () => {
    const inputs = json<{ inputs: Record<string, string> }>('manifest.json').inputs;
    expect(inputs).toEqual(PINNED);
    for (const [path, hash] of Object.entries(PINNED)) expect(sha256(path), path).toBe(hash);
    expect(readFileSync(join(EX, 'inputs/bmiagerev.csv')).length).toBe(72022);
    expect(readFileSync(join(EX, 'inputs/bmi-age-2022.csv')).length).toBe(124895);
    // CDC's files keep their CRLF line endings (.gitattributes marks them -text).
    expect(readFileSync(join(EX, 'inputs/bmi-age-2022.csv'), 'latin1').startsWith('sex,agemos,L,M,S,sigma,')).toBe(true);
    expect(readFileSync(join(EX, 'inputs/bmiagerev.csv'), 'latin1')).toContain('\r\n');
  });

  it('lists every generated file in the manifest', () => {
    const manifest = json<{ outputs: string[]; python: string }>('manifest.json');
    expect(manifest.python).toBe('3.12');
    expect(manifest.outputs).toEqual(['children.csv', 'inspection.json', 'manifest.json', 'randori/cards.json', 'reference-checks.json', 'scores.json', 'summary.md']);
    for (const output of manifest.outputs) expect(() => readFileSync(join(GEN, output)), output).not.toThrow();
  });

  it('reproduces every value CDC prints in its worked examples and recomputes every printed column of both tables', () => {
    const result = json<{ passed: number; failed: number; checks: Check[]; tables: { table2022: { values: number; withinOneUnit: number; matchWhenRounded: number }; table2000: { values: number; tolerance: string }; sameAs2000: { identicalLMS: number } } }>('reference-checks.json');
    expect([result.passed, result.failed, result.checks.length]).toEqual([24, 0, 24]);
    for (const check of result.checks) {
      expect(check.status, check.id).toBe('pass');
      expect(check.computed, check.id).toBe(check.published);
    }
    const value = (id: string) => result.checks.find((check) => check.id === id)?.published;
    expect([value('ex1-z'), value('ex1-percentile'), value('ex2-percentile'), value('ex2-z'), value('ex3-bmi'), value('ex4-bmi')]).toEqual(['1.4215', '92.2', '99.7683', '2.83', '27.2', '24.1']);
    expect([value('categories-bmi'), value('categories-percentile'), value('categories-category')]).toEqual(['26.6', '96', 'obesity']);
    expect([result.tables.table2022.values, result.tables.table2022.withinOneUnit, result.tables.table2022.matchWhenRounded]).toEqual([12702, 12702, 12654]);
    expect([result.tables.table2000.values, result.tables.table2000.tolerance]).toEqual([4380, '1e-06']);
    expect(result.tables.sameAs2000.identicalLMS).toBe(1314);
  });

  it('reports the table structure HLT-001 asks the learner to find', () => {
    const inspection = json<{ rowsPerSex: Record<string, number>; rowsOffTheRule: number[]; negativeL: number; medianEqualsP50: number; files: Record<string, { repeatedHeaderLines: number[]; lineEndings: string }> }>('inspection.json');
    expect(inspection.rowsPerSex).toEqual({ male: 219, female: 219 });
    expect(inspection.rowsOffTheRule).toEqual([24, 240]);
    expect([inspection.negativeL, inspection.medianEqualsP50]).toEqual([438, 438]);
    expect(inspection.files['inputs/bmiagerev.csv']?.repeatedHeaderLines).toEqual([221]);
    expect(inspection.files['inputs/bmi-age-2022.csv']?.repeatedHeaderLines).toEqual([]);
  });

  it('scores the fictional children as the page and recipes quote, with no score outside ages 2 to 19', () => {
    const children = json<{ children: Child[] }>('scores.json').children;
    expect(children.map((child) => [child.child, child.bmi, child.method, child.percentile, child.category])).toEqual([
      ['A', '15.50', 'LMS', '29.18', 'healthy weight'],
      ['B', '13.76', 'LMS', '2.67', 'underweight'],
      ['C', '25.78', 'LMS', '90.24', 'overweight'],
      ['D', '21.76', 'extended', '97.00', 'obesity'],
      ['E', '35.56', 'extended', '99.84', 'severe obesity'],
      ['F', '16.22', null, null, null],
    ]);
    const byId = Object.fromEntries(children.map((child) => [child.child, child]));
    expect([byId.D?.percentOfP95, byId.E?.percentOfP95]).toEqual(['110.2', '146.7']);
    expect([byId.E?.z, byId.E?.lmsZ, byId.E?.zCeiling]).toEqual(['2.939', '2.537', '3.110']);
    expect(byId.F?.completedMonths).toBe(23);
    // Completed months plus 0.5 selects the row.
    for (const child of children.filter((candidate) => candidate.method)) expect(child.row?.agemos, child.child).toBe(String(child.completedMonths + 0.5));
  });

  it('recomputes the four Randori cards', () => {
    const cards = json<Record<string, Card>>('randori/cards.json');
    expect(Object.fromEntries(Object.entries(cards).map(([id, card]) => [id, [card.child, card.before.percentile, card.after.percentile, card.after.category, card.categoryChanged]]))).toEqual({
      A: ['E', '99.84', '99.44', 'severe obesity', false],
      B: ['C', '90.24', '90.84', 'overweight', false],
      C: ['C', '90.24', '92.49', 'overweight', false],
      D: ['D', '97.00', null, 'healthy weight', true],
    });
    expect(cards.A?.after.zCeiling).toBe('3.110');
    expect(cards.B?.after.agemos).toBe('180.5');
  });

  it('says it is not a clinical assessment, and carries no email address', () => {
    for (const path of ['README.md', 'tools/health_pathway.py', 'tools/fetch_input.py', 'generated/summary.md', 'scenario/children.csv']) {
      expect(readFileSync(join(EX, path), 'utf8'), path).not.toMatch(/@[a-z0-9-]+\.[a-z]/i);
    }
    for (const path of ['README.md', 'generated/summary.md']) expect(readFileSync(join(EX, path), 'utf8'), path).toMatch(/not\s+a\s+clinical\s+assessment/i);
    expect(readFileSync(join(EX, 'README.md'), 'utf8')).toMatch(/fictional/);
  });
});
