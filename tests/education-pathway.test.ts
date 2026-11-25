import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The education pathway (#93). tools/education_pathway.py computes everything under generated/, and the CI job
// education_pathway recomputes it and fails on any difference. These tests pin what the page and recipes claim.

const EX = 'public/examples/education-pathway';
const GEN = join(EX, 'generated');
const json = <T>(path: string): T => JSON.parse(readFileSync(join(GEN, path), 'utf8')) as T;
const sha256 = (path: string) => createHash('sha256').update(readFileSync(join(EX, path))).digest('hex');
const PAGE = 'inputs/matrices.html';
const PINNED = {
  [PAGE]: 'c42e87b501ee9cb8ee7e8a6d9ac4d60ca496a909f4ad5c52f47b0599d1dcd099',
  'inputs/language-subtag-registry.txt': '8ac4e58567593c96e9e6d66e2017dbb8d3953dbcb42fe32ecd3b3fccdfdaba7b',
  'inputs/act-rules/testcases.json': '49051da603afa6d28b94ef3e758146dafcbe72bade7202a24636bab3ea4c0036',
};

interface Check { id: string; rule: string; case: string; file: string; expected: string; computed: string; status: string }
interface Rule { name: string; outcome: string; targets: { target: string; outcome: string }[] }
interface Card { title: string; rulesChanged: Record<string, string>; criteriaChanged: Record<string, string> }

describe('education pathway files', () => {
  it('serves the Wikibooks page, the registry and the W3C index unchanged, at the hashes the manifest records', () => {
    const inputs = json<{ inputs: Record<string, string> }>('manifest.json').inputs;
    for (const [path, hash] of Object.entries(PINNED)) {
      expect(sha256(path), path).toBe(hash);
      expect(inputs[path], path).toBe(hash);
    }
    const page = readFileSync(join(EX, PAGE));
    expect(page.length).toBe(177873);
    expect(page.toString('utf8')).toContain('"wgRevisionId":266672');
    expect(readFileSync(join(EX, 'inputs/language-subtag-registry.txt'), 'utf8').startsWith('File-Date: 2026-11-18\n')).toBe(true);
  });

  it('pins every W3C test case it uses in the manifest, and only the approved cases of the four rules', () => {
    const inputs = json<{ inputs: Record<string, string> }>('manifest.json').inputs;
    const cases = Object.keys(inputs).filter((path) => path.startsWith('inputs/act-rules/testcases/'));
    expect(cases).toHaveLength(36);
    expect(Object.keys(inputs)).toHaveLength(39);
    for (const path of cases) expect(sha256(path), path).toBe(inputs[path]);
    const index = JSON.parse(readFileSync(join(EX, 'inputs/act-rules/testcases.json'), 'utf8')) as { testcases: { ruleId: string; approved: boolean; relativePath: string }[] };
    const approved = index.testcases.filter((testcase) => ['2779a5', 'b5c3f8', 'bf051a', 'b4f0c3'].includes(testcase.ruleId) && testcase.approved === true);
    expect(approved.map((testcase) => `inputs/act-rules/${testcase.relativePath}`).sort()).toEqual([...cases].sort());
    expect(readFileSync(join(EX, 'inputs/act-rules/NOTICE.md'), 'utf8')).toMatch(/W3C Software and Document/);
  });

  it('lists every generated file in the manifest', () => {
    const manifest = json<{ outputs: string[]; python: string }>('manifest.json');
    expect(manifest.python).toBe('3.12');
    expect(manifest.outputs).toEqual(['inspection.json', 'manifest.json', 'randori/cards.json', 'reference-checks.json', 'report.json', 'rules.json', 'summary.md']);
    for (const output of manifest.outputs) expect(() => readFileSync(join(GEN, output)), output).not.toThrow();
  });

  it('gives every approved W3C test case of the four rules its published outcome', () => {
    const result = json<{ passed: number; failed: number; checks: Check[]; languageSubtagRegistry: string }>('reference-checks.json');
    expect([result.passed, result.failed, result.checks.length]).toEqual([36, 0, 36]);
    for (const check of result.checks) {
      expect(check.status, check.id).toBe('pass');
      expect(check.computed, check.id).toBe(check.expected);
    }
    const perRule = Object.fromEntries(['2779a5', 'b5c3f8', 'bf051a', 'b4f0c3'].map((rule) => [rule, result.checks.filter((check) => check.rule === rule).length]));
    expect(perRule).toEqual({ '2779a5': 11, b5c3f8: 7, bf051a: 7, b4f0c3: 11 });
    expect(new Set(result.checks.map((check) => check.expected))).toEqual(new Set(['passed', 'failed', 'inapplicable']));
    expect(result.languageSubtagRegistry).toBe('2026-11-18');
  });

  it('matches the numbers the page and recipes quote', () => {
    const inspection = json<{ revision: number; bytes: number; title: string; htmlLang: string; htmlDir: string; viewport: string[]; headings: { count: number; byLevel: Record<string, number>; skippedLevels: unknown[] }; images: Record<string, number>; links: number; tables: Record<string, number> }>('inspection.json');
    expect([inspection.revision, inspection.bytes, inspection.title, inspection.htmlLang, inspection.htmlDir, inspection.viewport]).toEqual([266672, 177873, 'High School Mathematics Extensions/Matrices - Wikibooks, open books for an open world', 'en', 'ltr', ['width=1120']]);
    expect([inspection.headings.count, inspection.headings.byLevel, inspection.headings.skippedLevels]).toEqual([16, { h1: 1, h2: 6, h3: 8, h4: 1, h5: 0, h6: 0 }, []]);
    expect(inspection.images).toEqual({ count: 26, withAltText: 24, withEmptyAlt: 2, withoutAlt: 0 });
    expect([inspection.links, inspection.tables]).toEqual([155, { count: 2, captions: 0 }]);
    const rules = json<Record<string, Rule>>('rules.json');
    expect(Object.fromEntries(Object.entries(rules).map(([id, rule]) => [id, rule.outcome]))).toEqual({ '2779a5': 'passed', b5c3f8: 'passed', bf051a: 'passed', b4f0c3: 'inapplicable' });
    const report = json<{ criteria: { successCriterion: string; level: string; conclusion: string }[]; failedCriteria: string[]; page: string }>('report.json');
    expect(report.criteria.map((criterion) => [criterion.successCriterion, criterion.level, criterion.conclusion])).toEqual([['1.4.4', 'AA', 'further testing needed'], ['2.4.2', 'A', 'further testing needed'], ['3.1.1', 'A', 'further testing needed']]);
    expect(report.failedCriteria).toEqual([]);
    expect(report.page).toContain('High School Mathematics Extensions/Matrices, revision 266672');
    const cards = json<Record<string, Card>>('randori/cards.json');
    expect(Object.fromEntries(Object.entries(cards).map(([id, card]) => [id, [card.rulesChanged, card.criteriaChanged]]))).toEqual({
      A: [{ b5c3f8: 'passed -> failed', bf051a: 'passed -> inapplicable' }, { '3.1.1': 'further testing needed -> not satisfied' }],
      B: [{ bf051a: 'passed -> failed' }, { '3.1.1': 'further testing needed -> not satisfied' }],
      C: [{ b4f0c3: 'inapplicable -> failed' }, { '1.4.4': 'further testing needed -> not satisfied' }],
      D: [{ '2779a5': 'passed -> failed' }, { '2.4.2': 'further testing needed -> not satisfied' }],
    });
  });

  it('carries no email address and claims no conformance or compliance in what it publishes', () => {
    for (const path of ['README.md', 'tools/education_pathway.py', 'tools/fetch_input.py', 'generated/summary.md']) {
      const text = readFileSync(join(EX, path), 'utf8');
      expect(text, path).not.toMatch(/@[a-z0-9-]+\.[a-z]/i);
    }
    for (const path of ['README.md', 'generated/summary.md']) expect(readFileSync(join(EX, path), 'utf8'), path).toMatch(/not an accessibility\s+conformance\s+claim\s+or\s+a\s+legal\s+compliance\s+check/i);
  });
});
