import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import { kataCatalog } from '../src/data/kata-catalog';
import { fields } from '../src/lib/fields';
import { isUnavailable, type KataRecipe } from '../src/lib/kata-recipe';
import { resolveRecipes } from '../src/lib/kata-recipes';
import { CHECKS, extractHtmlBlocks } from '../scripts/fnd-001/check-pocket-garden.mjs';

// FND-001 (#84): the recipe (src/content/kata-recipes/fnd-001-stack-comparison.yaml) may state only what its
// evidence shows. Its measured comparisons are not typed in the recipe: the page computes them from the Arena
// records (tests/kata-comparisons.test.ts). These tests tie the recipe's prompts, checks and failures to the run
// files in public/examples/fnd-001 and public/examples/fnd-001-harness. e2e/fnd-001-evidence.spec.ts re-runs the
// browser checks themselves.

const evidence = 'public/examples/fnd-001';
const harnessEvidence = 'public/examples/fnd-001-harness';
type Run = {
  cell: string; repetition?: number; correctionOf?: string; harness: string; requestedModel: string; modelsUsed: string[];
  effort: string; prompt: string; flags: string; isError: boolean; durationMs: number; costUsd: number; costBasis: string; outputTokens: number; response: string;
};
type Results = { checks: string[]; results: Record<string, { source: string; checks: Record<string, { pass: boolean; detail: string }> }> };

const runsIn = (dir: string) => readdirSync(join(dir, 'runs')).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
const runIds = runsIn(evidence);
const runs = new Map(runIds.map((id) => [id, JSON.parse(readFileSync(join(evidence, 'runs', `${id}.json`), 'utf8')) as Run]));
const readResults = (dir: string) => JSON.parse(readFileSync(join(dir, 'results.json'), 'utf8')) as Results;
const results = readResults(evidence);
const passedIn = (set: Results, id: string): number => Object.values(set.results[id]?.checks ?? {}).filter((c) => c.pass).length;
const passed = (id: string): number => passedIn(results, id);

const SLUG = 'fnd-001-stack-comparison';
const resourceIds = (dir = 'src/content/resources'): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => entry.isDirectory()
    ? readdirSync(join(dir, entry.name)).filter((file) => file.endsWith('.yaml')).map((file) => `${entry.name}/${file.slice(0, -5)}`)
    : []);
const recipeFiles = readdirSync('src/content/kata-recipes').filter((file) => file.endsWith('.yaml'));
const handWritten = readdirSync('src/pages/katas').filter((file) => file.endsWith('.astro') && !file.startsWith('[')).map((file) => file.slice(0, -6));
const resolved = resolveRecipes(
  recipeFiles.map((file) => ({ slug: file.slice(0, -5), data: parseYaml(readFileSync(join('src/content/kata-recipes', file), 'utf8')) as unknown })),
  {
    registries: { fields: fields.map((field) => field.id), resources: resourceIds(), pathways: readdirSync('src/content/tracks').filter((file) => file.endsWith('.md')).map((file) => file.slice(0, -3)) },
    catalog: kataCatalog, reservedSlugs: handWritten, today: '2026-11-21',
  },
);
const found = resolved.find((item) => item.slug === SLUG);
if (!found) throw new Error(`no recipe ${SLUG}`);
const recipe: KataRecipe = found.recipe;
const section = <T extends object>(value: T | { unavailable: string }, name: string): T => {
  if (isUnavailable(value)) throw new Error(`FND-001 ${name} is unavailable`);
  return value;
};
const verification = section(recipe.verification, 'verification');
/** Everything the page renders. trackingIssue is for maintainers and is not shown. */
const publicText = JSON.stringify({ ...recipe, trackingIssue: undefined });

describe('FND-001 recipe (#84, #86 contract)', () => {
  it('is a validated draft recipe at /katas/fnd-001-stack-comparison with no named maintainer', () => {
    expect(found.href).toBe('/katas/fnd-001-stack-comparison');
    expect(recipe.metadata.id).toBe('FND-001');
    expect(recipe.metadata.layer).toBe('foundation');
    // Published needs a named maintainer and a review nobody has done yet.
    expect(recipe.status).toBe('draft');
    expect(recipe.maintainer.person).toBeUndefined();
    expect(kataCatalog.some((entry) => entry.metadata.id === 'FND-001')).toBe(false);
  });

  it('gives the prompts exactly as they were sent', () => {
    const text = (id: string) => recipe.prompts.find((prompt) => prompt.id === id)?.text;
    expect(text('brief-a')).toBe(readFileSync(join(evidence, 'prompts/A.txt'), 'utf8').trimEnd());
    expect(text('brief-b')).toBe(readFileSync(join(evidence, 'prompts/B.txt'), 'utf8').trimEnd());
    expect(text('correction')).toMatch(/^Here is a Pocket Garden HTML file you made earlier\. An independent browser check found these problems:/);
  });

  it('lists one check per checker check, in order, each passed on the reference in the results file', () => {
    expect(verification.checks).toHaveLength(CHECKS.length);
    verification.checks.forEach((check, index) => {
      const id = CHECKS[index] ?? '';
      expect(check.evidence, id).toContain(`check ${id}, in /examples/fnd-001/results.json`);
      expect(check.result, id).toBe('passed');
      expect(results.results.reference?.checks[id]?.pass, id).toBe(true);
    });
    const smoke = section(recipe.setup, 'setup').smokeTest;
    expect(smoke.result).toBe('passed');
    expect(passed('reference')).toBe(CHECKS.length);
  });

  it('offers a check sheet with every check, in order, and a record that never turns unknown into zero', () => {
    const sheet = recipe.downloads.find((file) => file.filename === 'fnd-001-check-sheet.md')?.content ?? '';
    const rows = sheet.split('\n').filter((line) => /^\| \d+ \|/.test(line)).map((line) => line.split('|')[2]?.trim());
    expect(rows).toEqual([...CHECKS]);
    const record = recipe.downloads.find((file) => file.filename === 'comparison-record.md')?.content ?? '';
    expect(record).toMatch(/"not shown", never 0/);
  });

  it('names every failed first run in both evidence sets, and what failed', () => {
    const failures = verification.failures.map((item) => `${item.observed} ${item.correction}`).join(' ');
    for (const dir of [evidence, harnessEvidence]) {
      const set = readResults(dir);
      const first = runsIn(dir).filter((id) => !id.endsWith('-fix'));
      const failed = first.filter((id) => passedIn(set, id) < set.checks.length);
      expect(failed.length, dir).toBeGreaterThan(0);
      for (const id of failed) {
        expect(failures, `${dir} ${id}`).toContain(id);
        expect(passedIn(set, `${id}-fix`), `${dir} ${id}-fix`).toBe(set.checks.length);
        for (const [check, value] of Object.entries(set.results[id]?.checks ?? {})) if (!value.pass) expect(failures, `${id} ${check}`).toContain(check);
      }
    }
  });

  it('states the harness versions the runs recorded', () => {
    const harness = section(recipe.stack, 'stack').components.find((part) => part.part === 'harness');
    const versions = new Set([...runs.values(), ...runsIn(harnessEvidence).map((id) => JSON.parse(readFileSync(join(harnessEvidence, 'runs', `${id}.json`), 'utf8')) as Run)]
      .map((r) => /^Claude Code (\S+)/.exec(r.harness)?.[1]).filter((v): v is string => v !== undefined));
    expect([...versions].sort()).toEqual(['2.1.329', '2.1.330']);
    for (const version of versions) expect(harness?.version, version).toContain(version);
  });

  it('links only to pages and files that exist', () => {
    const exercise = section(recipe.exercise, 'exercise');
    const showcase = section(recipe.showcase, 'showcase');
    const paths = [exercise.href, showcase.href, ...recipe.brief.inputs.map((input) => input.source.split(/[ ,]/)[0])]
      .filter((href): href is string => typeof href === 'string' && href.startsWith('/'));
    expect(paths.length).toBeGreaterThan(3);
    // A path is a file in public/, a page, or an endpoint route (/examples/pocket-garden.html is rendered, #128).
    const served = (href: string) => existsSync(join('public', href)) || ['.astro', '.ts'].some((ext) => existsSync(join('src/pages', `${href}${ext}`)));
    for (const href of paths) expect(served(href), href).toBe(true);
  });

  it('labels what the Dojo did not run, and claims no run it did not make', () => {
    const variations = section(recipe.adaptation, 'adaptation').variations;
    expect(variations.filter((item) => !item.change.includes('(proposed, not run by the Dojo)')).map((item) => item.change)).toEqual(['Software (run by the Dojo, this recipe).']);
    expect(section(recipe.randori, 'randori').constraints).toContain('Not run by the Dojo, so there is no reference answer. Your checks are the rubric.');
    expect(section(recipe.stack, 'stack').alternatives.filter((item) => item.tested).map((item) => item.name)).toEqual([expect.stringMatching(/^Qwen Code 0\.28\.0/)]);
  });

  it('keeps repository paths, internal hosts and issue links off the page', () => {
    expect(publicText).not.toMatch(/(?<![/\w])(?:src|scripts|tests|e2e|docs)\/|developerdojo\.org|\/-\/(?:issues|merge_requests)|#\d{2,}\b/);
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
