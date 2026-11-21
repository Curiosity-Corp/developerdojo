import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
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
    expect(resolved.map((item) => item.record.id).sort()).toEqual(['ARN-001', 'ARN-002', 'ARN-003']);
  });

  it('keep a Dojo experiment and an attributed external result apart', () => {
    expect(byId('ARN-001').record.kind).toBe('dojo-experiment');
    expect(byId('ARN-002').record.kind).toBe('external-benchmark');
    expect(Object.values(byId('ARN-002').arms).every((arm) => arm.kind === 'reported')).toBe(true);
    expect(Object.values(byId('ARN-001').arms).every((arm) => arm.kind === 'measured')).toBe(true);
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

// ARN-003 (#89): the FND-001 harness comparison. The numbers on the page are computed by
// resolveArenaRecords; these tests compute them again, independently, straight from the run files and
// the checker results, and check every prose claim the record makes about what the harnesses sent.
describe('ARN-003 harness comparison', () => {
  const HARNESS = 'fnd-001-harness';
  const dir = join('public/examples', HARNESS);
  type Request = {
    provider: string | null;
    servedModel: string | null;
    sent: { model: string; tools: string[]; thinking: { type: string } | null; outputConfig: { effort: string } | null; systemChars: number; systemSha256: string | null; firstUserTextSha256: string | null };
    usage: { cacheReadInputTokens: number | null; costUsd: number | null } | null;
  };
  type Run = { harness: string; requestedModel: string; effort: string; flags: string; isError: boolean; durationMs: number; costUsd: number | null; repetition?: number; correctionOf?: string; modelsUsed: string[]; requests: Request[] };
  const run = (id: string) => JSON.parse(readFileSync(join(dir, 'runs', `${id}.json`), 'utf8')) as Run;
  const results = JSON.parse(readFileSync(join(dir, 'results.json'), 'utf8')) as { checks: string[]; results: Record<string, { checks: Record<string, { pass: boolean }> }> };
  const failing = (id: string) => results.checks.filter((check) => results.results[id]?.checks[check]?.pass !== true);
  const ids = (arm: string) => [1, 2, 3].map((rep) => `${arm}-r${rep}`);
  const arms = ['claude-code', 'qwen-code'] as const;
  const sha256 = (path: string) => createHash('sha256').update(readFileSync(path, 'utf8')).digest('hex');
  const promptA = sha256(join(dir, 'prompts/A.txt'));

  it('measures one harness comparison, Claude Code against Qwen Code', () => {
    const record = byId('ARN-003').record;
    expect(record.kind).toBe('dojo-experiment');
    expect(record.comparisons.map((item) => `${item.status}:${item.variable}`)).toEqual(['measured:harness']);
    expect(record.arms.map((arm) => arm.runs)).toEqual(arms.map(ids));
    const [control, variant] = record.arms;
    expect(changedParts(control?.stack ?? [], variant?.stack ?? [])).toEqual(['harness']);
  });

  it('computes the page numbers that the run files and checker results give', () => {
    for (const arm of arms) {
      const runs = ids(arm).map(run);
      const value = measured('ARN-003', arm);
      const passingAll = ids(arm).filter((id) => failing(id).length === 0).length;
      const checksPassed = ids(arm).reduce((sum, id) => sum + results.checks.length - failing(id).length, 0);
      const meanSeconds = Number((runs.reduce((sum, item) => sum + item.durationMs, 0) / runs.length / 1000).toFixed(1));
      const cost = Number(runs.reduce((sum, item) => sum + (item.costUsd ?? Number.NaN), 0).toFixed(4));
      const needed = ids(arm).filter((id) => failing(id).length > 0);
      const fixesPassing = needed.filter((id) => failing(`${id}-fix`).length === 0).length;
      const fixCost = Number(needed.reduce((sum, id) => sum + (run(`${id}-fix`).costUsd ?? Number.NaN), 0).toFixed(4));
      expect([value.runs, value.completed.count, value.fullyChecked.count, value.passingAll.count, value.checksPassed, value.checksAttempted, value.meanSeconds, value.totalCostUsd],
        arm).toEqual([3, runs.filter((item) => !item.isError).length, 3, passingAll, checksPassed, 3 * results.checks.length, meanSeconds, cost]);
      expect(value.corrections, arm).toEqual({ needed: needed.length, made: needed.length, passingAll: fixesPassing, totalCostUsd: fixCost });
      expect(value.costBasis).toBe('billed by the upstream (OpenRouter usage.cost)');
    }
  });

  it('supports the reading: the failures, the corrections and the paired cost', () => {
    expect(arms.map((arm) => measured('ARN-003', arm).passingAll.count)).toEqual([1, 2]);
    const failures = arms.flatMap((arm) => ids(arm).flatMap((id) => failing(id).map((check) => `${arm}:${check}`)));
    expect(failures.sort()).toEqual(['claude-code:axe-serious', 'claude-code:pressed-state', 'claude-code:pressed-state', 'qwen-code:pressed-state']);
    for (const arm of arms) expect(measured('ARN-003', arm).corrections.passingAll, arm).toBe(measured('ARN-003', arm).corrections.needed);
    for (const rep of [1, 2, 3]) {
      expect(run(`qwen-code-r${rep}`).costUsd ?? Infinity, `repetition ${rep}`).toBeLessThan(run(`claude-code-r${rep}`).costUsd ?? 0);
    }
  });

  it('held the model, effort, endpoint, prompt and tools constant on every request, first attempts and corrections', () => {
    expect(promptA).toBe(sha256('public/examples/fnd-001/prompts/A.txt'));
    for (const arm of arms) {
      for (const id of [...ids(arm), ...ids(arm).filter((item) => failing(item).length > 0).map((item) => `${item}-fix`)]) {
        const item = run(id);
        expect([item.requestedModel, item.effort, item.isError, item.modelsUsed], id).toEqual(['anthropic/claude-sonnet-5.5', 'high', false, ['anthropic/claude-sonnet-5.5']]);
        expect(item.requests.length, id).toBe(1);
        for (const request of item.requests) {
          expect([request.sent.model, request.sent.tools, request.sent.thinking?.type, request.sent.outputConfig?.effort, request.provider, request.servedModel], id)
            .toEqual(['anthropic/claude-sonnet-5.5', [], 'adaptive', 'high', 'amazon-bedrock', 'anthropic/claude-sonnet-5.5']);
          expect(typeof request.usage?.costUsd, id).toBe('number');
        }
      }
    }
    const observed = arms.map((arm) => measured('ARN-003', arm).observed);
    expect((['harness', 'model', 'effort', 'prompt', 'flags'] as const).filter((key) => observed[0]?.[key] !== observed[1]?.[key])).toEqual(['harness', 'flags']);
  });

  it('states the hidden differences between the harnesses as the run files record them', () => {
    const first = (id: string) => run(id).requests[0];
    const claude = ids('claude-code').map(first);
    const qwen = ids('qwen-code').map(first);
    // Claude Code sent prompt A unchanged; Qwen Code put its environment block in front of it.
    expect(claude.map((request) => request?.sent.firstUserTextSha256)).toEqual([promptA, promptA, promptA]);
    for (const request of qwen) expect(request?.sent.firstUserTextSha256).not.toBe(promptA);
    // Qwen Code's system prompt: the same in every run and more than twice as long; Claude Code's changed per run.
    expect(new Set(qwen.map((request) => request?.sent.systemSha256)).size).toBe(1);
    expect(new Set(claude.map((request) => request?.sent.systemSha256)).size).toBe(3);
    expect(Math.min(...qwen.map((request) => request?.sent.systemChars ?? 0))).toBeGreaterThan(2 * Math.max(...claude.map((request) => request?.sent.systemChars ?? Infinity)));
    // Prompt caching: Qwen Code read its system prompt from the cache on every run; Claude Code never did.
    for (const request of qwen) expect(request?.usage?.cacheReadInputTokens ?? 0).toBeGreaterThan(0);
    for (const request of claude) expect(request?.usage?.cacheReadInputTokens).toBe(0);
  });

  it('rejects a harness comparison where nothing was varied, and a link to a record that does not exist', () => {
    const data = dataOf(HARNESS);
    if (data.arms[1]) {
      data.arms[1].runs = ids('claude-code');
      data.arms[1].stack = data.arms[1].stack.map((part) => part['part'] === 'harness' ? { ...part, version: '2.1.330' } : part);
    }
    expect(one(data, HARNESS).join('\n')).toContain('the runs of both arms recorded the same harness and flags; nothing was varied');
    const link = dataOf(HARNESS);
    link['sources'] = [...(link['sources'] as unknown[]), { title: 'x', href: '/arena/evidence/no-such-record', kind: 'exercise' }];
    expect(problemsOf([...files.filter((file) => file.slug !== HARNESS), { slug: HARNESS, data: link }]).join()).toContain('/arena/evidence/no-such-record is not served by the site');
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
