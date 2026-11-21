import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { kataCatalog, kataDimensions } from '../src/data/kata-catalog';
import { fnd001Dimensions, fnd001Metadata, fnd001Recipe } from '../src/data/kata-recipes/fnd-001';
import { fields } from '../src/lib/fields';
import { KataCatalogError, validateKataCatalog, type KataReferences } from '../src/lib/kata-catalog';
import { CHECKS, extractHtmlBlocks } from '../scripts/fnd-001/check-pocket-garden.mjs';

// FND-001 (#84): the record may state only what its evidence files show. These tests recompute every
// number in the record from public/examples/fnd-001 and check that the metadata satisfies the #81 contract.
// e2e/fnd-001-evidence.spec.ts re-runs the browser checks themselves.

const evidence = 'public/examples/fnd-001';
type Run = {
  cell: string; repetition?: number; correctionOf?: string; harness: string; requestedModel: string; modelsUsed: string[];
  effort: string; prompt: string; flags: string; isError: boolean; durationMs: number; costUsd: number; costBasis: string; outputTokens: number; response: string;
};
type Results = { checks: string[]; results: Record<string, { source: string; checks: Record<string, { pass: boolean; detail: string }> }> };

const runIds = readdirSync(join(evidence, 'runs')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
const runs = new Map(runIds.map((id) => [id, JSON.parse(readFileSync(join(evidence, 'runs', `${id}.json`), 'utf8')) as Run]));
const results = JSON.parse(readFileSync(join(evidence, 'results.json'), 'utf8')) as Results;
const run = (id: string): Run => {
  const found = runs.get(id);
  if (!found) throw new Error(`run ${id} is not in ${evidence}/runs`);
  return found;
};
const passed = (id: string): number => Object.values(results.results[id]?.checks ?? {}).filter((c) => c.pass).length;
const round = (value: number, places: number): number => Number(value.toFixed(places));

const resourceIds = (dir = 'src/content/resources'): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? readdirSync(join(dir, entry.name)).filter((file) => file.endsWith('.yaml')).map((file) => `${entry.name}/${file.slice(0, -5)}`)
    : []);
const refs: KataReferences = {
  fields: fields.map((field) => field.id),
  resources: resourceIds(),
  pathways: readdirSync('src/content/tracks').filter((file) => file.endsWith('.md')).map((file) => file.slice(0, -3)),
  outcomes: [...kataDimensions.outcomes, ...fnd001Dimensions.outcomes],
  artifacts: [...kataDimensions.artifacts],
  capabilities: [...kataDimensions.capabilities, ...fnd001Dimensions.capabilities],
  constraints: [...kataDimensions.constraints],
  stackRecipes: [...kataDimensions.stackRecipes, ...fnd001Dimensions.stackRecipes],
};

describe('FND-001 metadata (#81 contract)', () => {
  it('validates with the published catalog against the real registries plus its own vocabulary', () => {
    const entry = { href: '/katas/fnd-001', linkLabel: fnd001Metadata.title, metadata: fnd001Metadata };
    let problems: readonly string[] = [];
    try { validateKataCatalog([...kataCatalog, entry], refs); } catch (error) {
      if (!(error instanceof KataCatalogError)) throw error;
      problems = error.problems;
    }
    expect(problems).toEqual([]);
  });

  it('adds only vocabulary the editorial registries do not have yet', () => {
    expect(fnd001Dimensions.outcomes.filter((id) => (kataDimensions.outcomes as readonly string[]).includes(id))).toEqual([]);
    expect(fnd001Dimensions.capabilities.filter((id) => (kataDimensions.capabilities as readonly string[]).includes(id))).toEqual([]);
    expect(fnd001Dimensions.stackRecipes.filter((id) => (kataDimensions.stackRecipes as readonly string[]).includes(id))).toEqual([]);
  });

  it('is not in the published catalog until its page exists (#86)', () => {
    expect(kataCatalog.some((entry) => entry.metadata.id === 'FND-001')).toBe(false);
  });
});

describe('FND-001 evidence files', () => {
  it('uses the same prompts as the stack workbench page', () => {
    const page = readFileSync('src/pages/katas/stack-workbench.astro', 'utf8');
    const a = readFileSync(join(evidence, 'prompts/A.txt'), 'utf8');
    const b = readFileSync(join(evidence, 'prompts/B.txt'), 'utf8');
    expect(page).toContain(`const task = \`${a}\`;`);
    expect(b.startsWith(a + '\n\n')).toBe(true);
    expect(page).toContain(b.slice(a.length + 2));
  });

  it('links only to files that exist', () => {
    const hrefs = [fnd001Recipe.outcome.finishedArtifact.href, ...fnd001Recipe.prompts.map((p) => p.href)];
    // A path is served either as a static file from public/ or by an endpoint route under src/pages
    // (/examples/pocket-garden.html is rendered from src/data/pocket-garden.html, #128).
    const served = (href: string) => existsSync(join('public', href)) || existsSync(join('src/pages', `${href}.ts`));
    for (const href of hrefs) expect(served(href), href).toBe(true);
    expect(existsSync(join('src/pages', `${fnd001Recipe.sourceExercise.href}.astro`))).toBe(true);
    for (const script of [fnd001Recipe.execution.runner, 'scripts/fnd-001/check-pocket-garden.mjs']) expect(existsSync(script), script).toBe(true);
  });

  it('records every run as a clean run of the pinned stack', () => {
    expect(runIds.length).toBeGreaterThan(0);
    for (const [id, r] of runs) {
      expect(r.isError, id).toBe(false);
      expect(r.modelsUsed, id).toEqual([r.requestedModel]);
      expect(r.harness, id).toMatch(/^Claude Code 2\.1\.329\b/);
      expect(r.effort, id).toBe('high');
      expect(r.flags, id).toContain('--tools ""');
      expect(r.costBasis, id).toBe('list');
      expect(existsSync(join(evidence, r.prompt)), `${id}: ${r.prompt}`).toBe(true);
    }
  });

  it('keeps the extracted HTML identical to the response it came from', () => {
    for (const [id, r] of runs) {
      const html = readFileSync(join(evidence, 'runs', `${id}.html`), 'utf8');
      expect(html.trimEnd(), id).toBe((extractHtmlBlocks(r.response)[0] ?? '').trimEnd());
    }
  });

  it('has a checked result for the reference and every run, on every check', () => {
    expect(results.checks).toEqual([...CHECKS]);
    expect(Object.keys(results.results).sort()).toEqual(['reference', ...runIds].sort());
    for (const [id, entry] of Object.entries(results.results)) expect(Object.keys(entry.checks), id).toEqual([...CHECKS]);
    expect(passed('reference')).toBe(CHECKS.length);
  });

  it('contains no e-mail address or credential-looking value', () => {
    const files = readdirSync(join(evidence, 'runs')).map((f) => join(evidence, 'runs', f));
    for (const path of [...files, join(evidence, 'results.json')]) {
      const text = readFileSync(path, 'utf8');
      expect(text, path).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.-]+/);
      expect(text, path).not.toMatch(/sk-ant-|session_id|credential/i);
    }
  });
});

describe('FND-001 record states only what the evidence shows', () => {
  it('has one rubric entry per checker check, in order', () => {
    expect(fnd001Recipe.rubric.map((check) => check.id)).toEqual([...CHECKS]);
  });

  it('reports each verified comparison exactly as recomputed from its runs', () => {
    const verified = fnd001Recipe.comparisonMatrix.filter((row) => row.status === 'verified');
    expect(verified.length).toBeGreaterThan(0);
    for (const row of verified) {
      for (const arm of ['control', 'variant'] as const) {
        const ids = row.runs[arm];
        const claimed = row.result[arm];
        expect(claimed.runs, row.variable).toBe(ids.length);
        expect(claimed.runsPassingAll, row.variable).toBe(ids.filter((id) => passed(id) === CHECKS.length).length);
        expect(claimed.checksPassed, row.variable).toBe(ids.reduce((sum, id) => sum + passed(id), 0));
        expect(claimed.checksAttempted, row.variable).toBe(ids.length * CHECKS.length);
        expect(claimed.meanSeconds, row.variable).toBe(round(ids.reduce((sum, id) => sum + run(id).durationMs, 0) / ids.length / 1000, 1));
        expect(claimed.costUsd, row.variable).toBe(round(ids.reduce((sum, id) => sum + run(id).costUsd, 0), 4));
      }
    }
  });

  it('changes exactly one variable in each verified comparison', () => {
    const stack = (id: string) => ({ prompt: run(id).prompt, model: run(id).requestedModel, harness: run(id).harness, effort: run(id).effort, flags: run(id).flags });
    const expected: Record<string, 'prompt' | 'model'> = { Instructions: 'prompt', Model: 'model' };
    for (const row of fnd001Recipe.comparisonMatrix) {
      if (row.status !== 'verified') continue;
      const changed = expected[row.variable];
      expect(changed, `no rule for verified variable ${row.variable}`).toBeDefined();
      const control = row.runs.control.map(stack);
      const variant = row.runs.variant.map(stack);
      for (const key of ['prompt', 'model', 'harness', 'effort', 'flags'] as const) {
        const a = new Set(control.map((s) => s[key]));
        const b = new Set(variant.map((s) => s[key]));
        expect(a.size, `${row.variable}: control ${key} varies`).toBe(1);
        expect(b.size, `${row.variable}: variant ${key} varies`).toBe(1);
        expect([...a][0] !== [...b][0], `${row.variable}: ${key}`).toBe(key === changed);
      }
      // Repetition r of control and variant started together.
      row.runs.control.forEach((id, index) => {
        const other = row.runs.variant[index];
        expect(other && run(other).repetition).toBe(run(id).repetition);
      });
    }
  });

  it('runs no comparison it labels proposed, and covers every variable #84 asks for', () => {
    const variables = fnd001Recipe.comparisonMatrix.map((row) => row.variable);
    expect(variables).toEqual(['Instructions', 'Model', 'Harness', 'A reviewed skill', 'An authorized tool (MCP server, CLI, API or plugin)', 'Single agent against specialist delegation']);
    for (const row of fnd001Recipe.comparisonMatrix) {
      if (row.status === 'proposed') {
        expect('runs' in row, row.variable).toBe(false);
        expect(row.whyNotRun.startsWith('Not run'), row.variable).toBe(true);
      }
      expect(row.confounders.length, row.variable).toBeGreaterThan(0);
    }
  });

  it('records a correction for every failed run, checked again', () => {
    const firstRuns = runIds.filter((id) => !id.endsWith('-fix'));
    const failed = firstRuns.filter((id) => passed(id) < CHECKS.length);
    expect(failed).toEqual(['baseline-r2', 'instructions-r1', 'instructions-r3']);
    for (const id of failed) {
      expect(run(`${id}-fix`).correctionOf).toBe(id);
      expect(run(`${id}-fix`).requestedModel).toBe(run(id).requestedModel);
      expect(passed(`${id}-fix`), `${id}-fix`).toBe(CHECKS.length);
      expect(fnd001Recipe.failuresAndCorrections.failures).toContain(id);
    }
    const failedChecks = new Set(failed.flatMap((id) => Object.entries(results.results[id]?.checks ?? {}).filter(([, c]) => !c.pass).map(([name]) => name)));
    expect([...failedChecks]).toEqual(['pressed-state']);
    const fixCost = round(failed.reduce((sum, id) => sum + run(`${id}-fix`).costUsd, 0), 4);
    expect(fnd001Recipe.failuresAndCorrections.corrections).toContain(`$${fixCost}`);
  });

  it('states the measured totals and ranges', () => {
    const total = round([...runs.values()].reduce((sum, r) => sum + r.costUsd, 0), 4);
    expect(fnd001Recipe.measurements.cost).toContain(`All ${runs.size} runs together: $${total}`);
    const seconds = (ids: string[]) => ids.map((id) => run(id).durationMs / 1000);
    const first = seconds(runIds.filter((id) => !id.endsWith('-fix')));
    const fixes = seconds(runIds.filter((id) => id.endsWith('-fix')));
    const range = (values: number[]) => `${Math.min(...values).toFixed(1)} s to ${Math.max(...values).toFixed(1)} s`;
    expect(fnd001Recipe.measurements.time).toContain(`${range(first)} per first run`);
    expect(fnd001Recipe.measurements.time).toContain(`${range(fixes)} per correction`);
  });

  it('labels the transfer challenge and untried domains as proposed', () => {
    expect(fnd001Recipe.transferChallenge.status).toBe('proposed');
    const verified = fnd001Recipe.crossDomainIllustrations.filter((item) => item.status === 'verified');
    expect(verified.map((item) => item.context)).toEqual(['Software']);
  });
});
