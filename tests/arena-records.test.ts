import { describe, expect, it } from 'vitest';
import { fnd001Recipe } from '../src/data/kata-recipes/fnd-001';
import { arenaRecordSchema, changedParts, type ArenaRecordInput } from '../src/lib/arena-record';
import { arenaFileContext, arenaRecordFiles } from '../src/lib/arena-content';
import { ArenaRecordError, exportArenaRecord, proportion, resolveArenaRecords, type ArenaContext, type ArenaRecordFile, type ArmMeasurement } from '../src/lib/arena-records';

// Arena evidence records (#89). The build resolves the same files with the same function
// (src/lib/arena-content.ts), so a record that fails here also fails `astro build`.

const context: ArenaContext = arenaFileContext(process.cwd(), '2026-11-20');
const files = arenaRecordFiles();
const resolved = resolveArenaRecords(files, context);
const byId = (id: string) => {
  const found = resolved.find((item) => item.record.id === id);
  if (!found) throw new Error(`no record ${id}`);
  return found;
};
const measured = (id: string, arm: string): ArmMeasurement => {
  const value = byId(id).arms[arm];
  if (value?.kind !== 'measured') throw new Error(`${id} ${arm} is not measured`);
  return value;
};
type Loose = Record<string, unknown> & { arms: (Record<string, unknown> & { stack: Record<string, unknown>[]; runs?: string[] })[]; comparisons: Record<string, unknown>[] };
const dataOf = (slug: string): Loose => structuredClone(files.find((file) => file.slug === slug)?.data) as Loose;
const problemsOf = (records: ArenaRecordFile[], ctx: ArenaContext = context): readonly string[] => {
  try { resolveArenaRecords(records, ctx); return []; } catch (error) {
    if (error instanceof ArenaRecordError) return error.problems;
    throw error;
  }
};
const DOJO = 'fnd-001-pocket-garden';
const EXTERNAL = 'swe-agent-interface-2024';
const one = (data: unknown, slug = DOJO) => problemsOf([{ slug, data }]);

describe('published Arena records', () => {
  it('all validate against their evidence', () => {
    expect(resolved.map((item) => item.record.id).sort()).toEqual(['ARN-001', 'ARN-002']);
  });

  it('keep a Dojo experiment and an attributed external result apart', () => {
    expect(byId('ARN-001').record.kind).toBe('dojo-experiment');
    expect(byId('ARN-002').record.kind).toBe('external-benchmark');
    expect(Object.values(byId('ARN-002').arms).every((arm) => arm.kind === 'reported')).toBe(true);
    expect(Object.values(byId('ARN-001').arms).every((arm) => arm.kind === 'measured')).toBe(true);
  });

  it('compute the FND-001 numbers the kata record states (#84), from the run files', () => {
    for (const row of fnd001Recipe.comparisonMatrix) {
      if (row.status !== 'verified') continue;
      for (const side of ['control', 'variant'] as const) {
        const arm = byId('ARN-001').record.arms.find((item) => JSON.stringify(item.runs) === JSON.stringify(row.runs[side]));
        expect(arm, `${row.variable} ${side}`).toBeDefined();
        const value = measured('ARN-001', arm?.id ?? '');
        const claimed = row.result[side];
        expect([value.passingAll.count, value.runs, value.checksPassed, value.checksAttempted, value.meanSeconds, value.totalCostUsd])
          .toEqual([claimed.runsPassingAll, claimed.runs, claimed.checksPassed, claimed.checksAttempted, claimed.meanSeconds, claimed.costUsd]);
      }
    }
  });

  it('report the correction round and the one failing check', () => {
    expect(measured('ARN-001', 'baseline').corrections).toMatchObject({ needed: 1, made: 1, passingAll: 1 });
    expect(measured('ARN-001', 'instructions').corrections).toMatchObject({ needed: 2, made: 2, passingAll: 2 });
    expect(measured('ARN-001', 'model').corrections).toEqual({ needed: 0, made: 0, passingAll: 0, totalCostUsd: 0 });
    const failing = (arm: string) => measured('ARN-001', arm).perCheck.filter((check) => check.passed < check.of).map((check) => check.id);
    expect([...failing('baseline'), ...failing('instructions'), ...failing('model')]).toEqual(['pressed-state', 'pressed-state']);
  });

  it('keep every proposed comparison free of results, and cover the #84 variables', () => {
    const variables = byId('ARN-001').record.comparisons.map((item) => `${item.status}:${item.variable}`);
    expect(variables).toEqual(['measured:instructions', 'measured:model', 'proposed:harness', 'proposed:skill', 'proposed:tool', 'proposed:delegation']);
    for (const item of byId('ARN-001').record.comparisons) if (item.status === 'proposed') expect('variant' in item).toBe(false);
  });

  it('classify the SWE-agent comparison as full-stack: harness, tools and prompts all changed', () => {
    const [shell, swe] = byId('ARN-002').record.arms;
    expect(changedParts(shell?.stack ?? [], swe?.stack ?? [])).toEqual(['harness', 'instructions', 'tool']);
    expect(byId('ARN-002').arms['swe-agent']).toMatchObject({ kind: 'reported', outcome: { count: 54, of: 300 } });
  });

  it('export a machine-readable copy that labels where the numbers came from', () => {
    const dojo = exportArenaRecord(byId('ARN-001'), '2026-11-20');
    expect(dojo.format).toBe('developerdojo-arena-record/1');
    expect(dojo.note).toContain('computed from the published run files');
    expect(exportArenaRecord(byId('ARN-002'), '2026-11-20').note).toContain('not measured by Developer Dojo');
  });
});

describe('stale and superseded results', () => {
  it('marks a record stale after its staleAfter date, and only then', () => {
    expect(byId('ARN-001').stale).toBe(false);
    const later = resolveArenaRecords(files, { ...context, today: '2027-02-21' });
    expect(later.find((item) => item.record.id === 'ARN-001')?.stale).toBe(true);
  });

  it('keeps a superseded record as a snapshot and links it to its successor', () => {
    const newer = { ...dataOf(EXTERNAL), id: 'ARN-099', date: '2025-01-01', supersedes: 'ARN-002' };
    const result = resolveArenaRecords([...files, { slug: 'newer', data: newer }], context);
    expect(result.find((item) => item.record.id === 'ARN-002')?.supersededBy).toEqual({ id: 'ARN-099', slug: 'newer', href: '/arena/evidence/newer' });
    expect(problemsOf([...files, { slug: 'newer', data: { ...newer, supersedes: 'ARN-404' } }])).toEqual(['newer.yaml: supersedes ARN-404, which does not exist']);
    expect(problemsOf([...files, { slug: 'newer', data: { ...newer, date: '2023-01-01', review: { lastChecked: '2026-11-20', staleAfter: '2027-01-01' } } }])).toEqual(['newer.yaml: supersedes a newer record']);
  });
});

describe('rejected records', () => {
  it('a cost or result typed into a Dojo arm', () => {
    const data = dataOf(DOJO);
    data.arms[0] = { ...data.arms[0], reported: { outcome: { metric: 'x', value: 1, of: 1, source: 'https://example.org' }, cost: '0', time: '0' } } as Loose['arms'][number];
    expect(one(data).join()).toContain('a Dojo arm is measured from its runs, never typed in');
  });

  it('an external arm without its source in the sources list, or with Dojo runs', () => {
    const data = dataOf(EXTERNAL);
    data['sources'] = (data['sources'] as { kind: string }[]).filter((source) => source.kind !== 'primary-publication');
    data['sources'] = [...(data['sources'] as unknown[]), { title: 'x', href: 'https://example.org/x', kind: 'dataset' }];
    expect(one(data, EXTERNAL).join()).toContain('list https://arxiv.org/html/2405.15793v3#S4 in sources');
    const withRuns = dataOf(EXTERNAL);
    withRuns.arms[0] = { ...withRuns.arms[0], runs: ['baseline-r1'] } as Loose['arms'][number];
    expect(one(withRuns, EXTERNAL).join()).toContain('an external arm has no Dojo runs');
  });

  it('a single-variable comparison whose stacks differ in something else', () => {
    const data = dataOf(DOJO);
    data.comparisons[1] = { ...data.comparisons[1], variable: 'instructions' };
    expect(one(data).join()).toContain('a instructions comparison may change only instructions; the stacks differ in model');
  });

  it('a full-stack label on a comparison that changed one part', () => {
    const data = dataOf(DOJO);
    data.comparisons[1] = { ...data.comparisons[1], variable: 'full-stack' };
    expect(one(data).join()).toContain('only model changed; name that single variable instead of full-stack');
  });

  it('a declared version the run files contradict', () => {
    const data = dataOf(DOJO);
    const stack = data.arms[2]?.stack ?? [];
    const model = stack.find((part) => part['part'] === 'model');
    if (model) model['version'] = 'claude-opus-5-5';
    const problems = one(data).join('\n');
    expect(problems).toContain('arm model: model version "claude-opus-5-5" but the runs used "claude-haiku-5-5"');
  });

  it('runs from another arm swapped in, which changes an undeclared variable', () => {
    const data = dataOf(DOJO);
    if (data.arms[1]) data.arms[1].runs = ['model-r1', 'model-r2', 'model-r3'];
    const problems = one(data).join('\n');
    expect(problems).toContain('arm instructions: model version "claude-sonnet-5-5" but the runs used "claude-haiku-5-5"');
    expect(problems).toContain('a instructions comparison, but the runs also differ in model');
  });

  it('missing run files, a run count that disagrees with the method, and corrections listed as first attempts', () => {
    const missing = dataOf(DOJO);
    if (missing.arms[0]) missing.arms[0].runs = ['baseline-r1', 'baseline-r2', 'baseline-r9'];
    expect(one(missing).join()).toContain('run file /examples/fnd-001/runs/baseline-r9.json does not exist');
    const count = dataOf(DOJO);
    if (count.arms[0]) count.arms[0].runs = ['baseline-r1', 'baseline-r2'];
    expect(one(count).join()).toContain('2 runs listed, method says 3');
    const fix = dataOf(DOJO);
    if (fix.arms[0]) fix.arms[0].runs = ['baseline-r1', 'baseline-r2-fix', 'baseline-r3'];
    expect(one(fix).join()).toContain('run baseline-r2-fix is a correction of baseline-r2; list first attempts only');
  });

  it('a rubric that does not match the checker', () => {
    const data = dataOf(DOJO);
    const rubric = data['rubric'] as { checks: unknown[] };
    rubric.checks = rubric.checks.slice(1);
    expect(one(data).join()).toContain("rubric.checks must list the checker's checks in order");
  });

  it('a proposed comparison that carries a result, or a reason that does not say it was not run', () => {
    const data = dataOf(DOJO);
    data.comparisons[2] = { ...data.comparisons[2], variant: 'model' };
    expect(one(data).length).toBeGreaterThan(0);
    const reason = dataOf(DOJO);
    reason.comparisons[2] = { ...reason.comparisons[2], whyNotRun: 'Planned.' };
    expect(one(reason).join()).toContain('start with "Not run"');
  });

  it('ranking language in a reading, title or scope', () => {
    for (const phrase of ['Haiku is the best model.', 'The winner is Haiku.', 'Haiku outperforms Sonnet.', 'See the leaderboard.']) {
      const data = dataOf(DOJO);
      data.comparisons[1] = { ...data.comparisons[1], reading: phrase };
      expect(one(data).join(), phrase).toContain('reads as a general ranking');
    }
  });

  it('unknown fields, a broken site link, an unknown field ID and a reused ID', () => {
    const data = dataOf(DOJO);
    data['domain'] = { ...(data['domain'] as object), fieldId: 'astrology' };
    data['sources'] = [...(data['sources'] as unknown[]), { title: 'x', href: '/examples/nope.json', kind: 'evidence-file' }];
    const problems = one(data).join('\n');
    expect(problems).toContain('domain.fieldId astrology is not a field');
    expect(problems).toContain('/examples/nope.json is not served by the site');
    expect(one({ ...dataOf(DOJO), score: 10 }).join()).toContain('score');
    expect(problemsOf([...files, { slug: 'copy', data: dataOf(DOJO) }]).join()).toContain('id ARN-001 is already used');
  });

  it('dates that run backwards', () => {
    const data = dataOf(DOJO);
    data['review'] = { lastChecked: '2026-11-19', staleAfter: '2026-11-19' };
    const problems = one(data).join('\n');
    expect(problems).toContain('staleAfter must be after lastChecked');
    expect(problems).toContain('lastChecked cannot be before the experiment date');
  });
});

describe('schema and arithmetic', () => {
  it('distinguishes an unavailable value from zero', () => {
    const base = dataOf(EXTERNAL) as unknown as ArenaRecordInput;
    const parsed = arenaRecordSchema.parse(base);
    expect(parsed.arms[0]?.reported?.cost).toEqual({ unavailable: expect.any(String) });
    expect(arenaRecordSchema.safeParse({ ...base, method: { ...base.method, repetitions: 0 } }).success).toBe(false);
  });

  it('computes 95% Wilson intervals that stay inside 0 to 1', () => {
    const all = proportion(3, 3);
    expect(all.high).toBe(1);
    expect(all.low).toBeCloseTo(0.4385, 3);
    const swe = proportion(54, 300);
    expect(swe.low).toBeCloseTo(0.1407, 3);
    expect(swe.high).toBeCloseTo(0.2274, 3);
    expect(() => proportion(4, 3)).toThrow(RangeError);
    expect(() => proportion(0, 0)).toThrow(RangeError);
  });
});
