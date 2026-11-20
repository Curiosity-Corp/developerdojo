import { z } from 'zod';
import { arenaRecordSchema, type ArenaArm, type ArenaComparison, type ArenaRecord, type ComparisonKind } from './arena-record';

/**
 * Turns Arena records into pages (#89). Pure: the build (src/lib/arena-content.ts) and the tests
 * (tests/arena-records.test.ts) call the same function with the same files, so a record that fails
 * here fails both.
 *
 * For a Dojo experiment every number on the page is computed here from the published run files.
 * The checks below make sure the record describes those runs truthfully: the run files exist and are
 * clean, each arm ran one fixed configuration, the declared stack matches what the runs recorded, and
 * a measured comparison changed only the variable it names.
 */

/** One run file (<evidence.dir>/runs/<id>.json), the Arena run format v1. Extra fields are kept. */
export const runFileSchema = z.looseObject({
  repetition: z.number().int().positive().optional(),
  correctionOf: z.string().optional(),
  harness: z.string().min(1),
  requestedModel: z.string().min(1),
  modelsUsed: z.array(z.string()),
  effort: z.string().min(1),
  prompt: z.string().min(1),
  flags: z.string(),
  isError: z.boolean(),
  durationMs: z.number().nonnegative().nullable(),
  /** Null when the harness did not report a cost. Never written as 0 for "unknown". */
  costUsd: z.number().nonnegative().nullable(),
  costBasis: z.string().nullable(),
});
export type RunFile = z.output<typeof runFileSchema>;

/** The checker's output (<evidence.dir>/results.json). */
export const resultsFileSchema = z.looseObject({
  checks: z.array(z.string()).min(1),
  results: z.record(z.string(), z.looseObject({ checks: z.record(z.string(), z.looseObject({ pass: z.boolean(), detail: z.string() })) })),
});
export type ResultsFile = z.output<typeof resultsFileSchema>;

export interface ArenaContext {
  /** Field IDs (src/lib/fields.ts). */
  fields: readonly string[];
  /** Reads a JSON file at a site path (/examples/...), or undefined when it does not exist. */
  readJson: (sitePath: string) => unknown;
  /** True when a site path is served: a file under public/ or a page. */
  exists: (sitePath: string) => boolean;
  /** Build date, YYYY-MM-DD, to tell when a record is stale. */
  today: string;
}

export interface ArenaRecordFile {
  /** File name without .yaml; the page is /arena/evidence/<slug>. */
  slug: string;
  data: unknown;
}

/** A proportion with its 95% Wilson score interval, as fractions from 0 to 1. */
export interface Proportion { count: number; of: number; low: number; high: number }

export interface CheckTally { id: string; passed: number; of: number }

export interface ArmMeasurement {
  kind: 'measured';
  runs: number;
  /** Shared system metrics. */
  completed: Proportion;
  fullyChecked: Proportion;
  passingAll: Proportion;
  checksPassed: number;
  checksAttempted: number;
  meanSeconds: number | null;
  totalCostUsd: number | null;
  costBasis: string | null;
  /** One correction round for each run that failed a check. */
  corrections: { needed: number; made: number; passingAll: number; totalCostUsd: number | null };
  /** Domain metric: how many runs passed each rubric check. */
  perCheck: CheckTally[];
  /** What the run files say was used. */
  observed: { harness: string; model: string; effort: string; prompt: string; flags: string };
}

export interface ArmReported {
  kind: 'reported';
  metric: string;
  outcome: Proportion;
  source: string;
}

export interface ResolvedArenaRecord {
  slug: string;
  href: string;
  record: ArenaRecord;
  /** Past review.staleAfter at build time. */
  stale: boolean;
  /** The record that replaces this one, if any. */
  supersededBy?: { id: string; slug: string; href: string };
  arms: Record<string, ArmMeasurement | ArmReported>;
}

export class ArenaRecordError extends Error {
  readonly problems: readonly string[];
  constructor(problems: readonly string[]) {
    super(`Arena records are invalid:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`);
    this.name = 'ArenaRecordError';
    this.problems = problems;
  }
}

const Z = 1.959964;
/** 95% Wilson score interval: honest about small samples, and never outside 0 to 1. */
export function proportion(count: number, of: number): Proportion {
  if (!Number.isInteger(count) || !Number.isInteger(of) || of < 1 || count < 0 || count > of) throw new RangeError(`invalid proportion ${count}/${of}`);
  const p = count / of;
  const denominator = 1 + (Z * Z) / of;
  const centre = (p + (Z * Z) / (2 * of)) / denominator;
  const half = (Z * Math.sqrt((p * (1 - p)) / of + (Z * Z) / (4 * of * of))) / denominator;
  return { count, of, low: Math.max(0, centre - half), high: Math.min(1, centre + half) };
}

const round = (value: number, places: number) => Number(value.toFixed(places));
const sumOrNull = (values: (number | null)[]) => (values.some((value) => value === null) ? null : values.reduce<number>((sum, value) => sum + (value ?? 0), 0));

/** Which run-file fields a comparison may change. Anything else that differs is an uncontrolled variable. */
const RUN_FIELDS_ALLOWED: Record<ComparisonKind, readonly (keyof ArmMeasurement['observed'])[]> = {
  model: ['model'],
  instructions: ['prompt'],
  harness: ['harness', 'flags'],
  skill: ['flags'],
  tool: ['flags'],
  delegation: ['flags', 'prompt'],
  'full-stack': ['harness', 'model', 'effort', 'prompt', 'flags'],
};
const OBSERVED_KEYS = ['harness', 'model', 'effort', 'prompt', 'flags'] as const;

const formatZod = (error: z.ZodError) => error.issues.map((issue) => `${issue.path.join('.') || '(record)'}: ${issue.message}`);

type RunRead = { ok: true; run: RunFile } | { ok: false; error: string };
function readRun(context: ArenaContext, dir: string, id: string): RunRead {
  const raw = context.readJson(`${dir}/runs/${id}.json`);
  if (raw === undefined) return { ok: false, error: `run file ${dir}/runs/${id}.json does not exist` };
  const parsed = runFileSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: `run file ${id}.json is not in the Arena run format: ${formatZod(parsed.error).join('; ')}` };
  return { ok: true, run: parsed.data };
}

function measureArm(context: ArenaContext, arm: ArenaArm, dir: string, results: ResultsFile, problems: string[], where: string): ArmMeasurement | undefined {
  const runs: [string, RunFile][] = [];
  for (const id of arm.runs ?? []) {
    const raw = readRun(context, dir, id);
    if (!raw.ok) { problems.push(`${where}: ${raw.error}`); continue; }
    runs.push([id, raw.run]);
  }
  if (runs.length !== (arm.runs ?? []).length) return undefined;
  const checks = results.checks;
  const passedChecks = (id: string) => checks.filter((check) => results.results[id]?.checks[check]?.pass === true).length;
  const assessed = (id: string) => checks.every((check) => results.results[id]?.checks[check] !== undefined);

  const observedOf = (run: RunFile) => ({ harness: run.harness, model: run.requestedModel, effort: run.effort, prompt: `${dir}/${run.prompt}`, flags: run.flags });
  const first = runs[0];
  if (!first) { problems.push(`${where}: no runs`); return undefined; }
  const observed = observedOf(first[1]);
  for (const [id, run] of runs) {
    const mine = observedOf(run);
    for (const key of OBSERVED_KEYS) if (mine[key] !== observed[key]) problems.push(`${where}: run ${id} has ${key} "${mine[key]}", other runs in the arm have "${observed[key]}"`);
    if (run.modelsUsed.length !== 1 || run.modelsUsed[0] !== run.requestedModel) problems.push(`${where}: run ${id} used ${run.modelsUsed.join(', ') || 'no model'}, not only ${run.requestedModel}`);
    if (run.correctionOf) problems.push(`${where}: run ${id} is a correction of ${run.correctionOf}; list first attempts only`);
    if (!assessed(id)) problems.push(`${where}: results.json has no result for every check of run ${id}`);
  }
  for (const part of arm.stack) {
    if (typeof part.version !== 'string') continue;
    if (part.part === 'model' && part.version !== observed.model) problems.push(`${where}: model version "${part.version}" but the runs used "${observed.model}"`);
    if (part.part === 'harness' && !observed.harness.includes(part.version)) problems.push(`${where}: harness version "${part.version}" but the runs recorded "${observed.harness}"`);
    if (part.part === 'instructions' && part.version !== observed.prompt) problems.push(`${where}: instructions version "${part.version}" but the runs used "${observed.prompt}"`);
  }
  if (!arm.stack.some((part) => part.part === 'model')) problems.push(`${where}: a Dojo arm names its model`);

  const failed = runs.filter(([id]) => passedChecks(id) < checks.length);
  const fixes: [string, RunFile][] = [];
  for (const [id, run] of failed) {
    const fix = readRun(context, dir, `${id}-fix`);
    if (!fix.ok) continue; // no correction round recorded for this run
    if (fix.run.correctionOf !== id) problems.push(`${where}: ${id}-fix does not say it corrects ${id}`);
    if (fix.run.requestedModel !== run.requestedModel) problems.push(`${where}: ${id}-fix used another model`);
    if (!assessed(`${id}-fix`)) problems.push(`${where}: results.json has no result for every check of ${id}-fix`);
    fixes.push([`${id}-fix`, fix.run]);
  }

  const durations = runs.map(([, run]) => run.durationMs);
  const knownDurations = durations.every((value) => value !== null);
  const costs = runs.map(([, run]) => run.costUsd);
  const totalCost = sumOrNull(costs);
  const fixCost = sumOrNull(fixes.map(([, run]) => run.costUsd));
  const bases = [...new Set(runs.map(([, run]) => run.costBasis ?? 'unknown'))];
  return {
    kind: 'measured',
    runs: runs.length,
    completed: proportion(runs.filter(([, run]) => !run.isError).length, runs.length),
    fullyChecked: proportion(runs.filter(([id]) => assessed(id)).length, runs.length),
    passingAll: proportion(runs.length - failed.length, runs.length),
    checksPassed: runs.reduce((sum, [id]) => sum + passedChecks(id), 0),
    checksAttempted: runs.length * checks.length,
    meanSeconds: knownDurations ? round(durations.reduce<number>((sum, value) => sum + (value ?? 0), 0) / runs.length / 1000, 1) : null,
    totalCostUsd: totalCost === null ? null : round(totalCost, 4),
    costBasis: totalCost === null ? null : bases.join(', '),
    corrections: {
      needed: failed.length,
      made: fixes.length,
      passingAll: fixes.filter(([id]) => passedChecks(id) === checks.length).length,
      totalCostUsd: fixes.length === 0 ? 0 : fixCost === null ? null : round(fixCost, 4),
    },
    perCheck: checks.map((check) => ({ id: check, passed: runs.filter(([id]) => results.results[id]?.checks[check]?.pass === true).length, of: runs.length })),
    observed,
  };

}

function checkComparison(context: ArenaContext, item: ArenaComparison, arms: Record<string, ArmMeasurement | ArmReported>, problems: string[], where: string, record: ArenaRecord): void {
  if (item.status !== 'measured') return;
  const control = arms[item.control];
  const variant = arms[item.variant];
  if (control?.kind !== 'measured' || variant?.kind !== 'measured') return;
  const differ = OBSERVED_KEYS.filter((key) => control.observed[key] !== variant.observed[key]);
  const allowed = RUN_FIELDS_ALLOWED[item.variable];
  const extra = differ.filter((key) => !allowed.includes(key));
  if (extra.length) problems.push(`${where}: a ${item.variable} comparison, but the runs also differ in ${extra.join(', ')}`);
  if (differ.length === 0 && (item.variable === 'model' || item.variable === 'instructions' || item.variable === 'harness')) {
    problems.push(`${where}: the runs of both arms recorded the same ${allowed.join(' and ')}; nothing was varied`);
  }
  if (control.perCheck.length !== variant.perCheck.length) problems.push(`${where}: the arms were checked against different rubrics`);
  const controlRuns = record.arms.find((arm) => arm.id === item.control)?.runs ?? [];
  const variantRuns = record.arms.find((arm) => arm.id === item.variant)?.runs ?? [];
  controlRuns.forEach((id, index) => {
    const other = variantRuns[index];
    const dir = record.evidence?.dir ?? '';
    const a = other === undefined ? undefined : readRun(context, dir, id);
    const b = other === undefined ? undefined : readRun(context, dir, other);
    if (a?.ok && b?.ok && a.run.repetition !== b.run.repetition) problems.push(`${where}: ${id} and ${other} are listed together but are different repetitions`);
  });
}

/** Validates every record against its evidence and resolves it for rendering. Throws ArenaRecordError listing every problem. */
export function resolveArenaRecords(files: readonly ArenaRecordFile[], context: ArenaContext): ResolvedArenaRecord[] {
  const problems: string[] = [];
  const parsed: { slug: string; record: ArenaRecord }[] = [];
  for (const file of files) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(file.slug)) problems.push(`${file.slug}.yaml: use a lower-case, hyphenated file name`);
    const result = arenaRecordSchema.safeParse(file.data);
    if (!result.success) { problems.push(...formatZod(result.error).map((line) => `${file.slug}.yaml: ${line}`)); continue; }
    parsed.push({ slug: file.slug, record: result.data });
  }
  const ids = new Map<string, string>();
  for (const { slug, record } of parsed) {
    const other = ids.get(record.id);
    if (other) problems.push(`${slug}.yaml: id ${record.id} is already used by ${other}.yaml`);
    ids.set(record.id, slug);
  }

  const resolved: ResolvedArenaRecord[] = [];
  for (const { slug, record } of parsed) {
    const where = `${slug}.yaml`;
    if (!context.fields.includes(record.domain.fieldId)) problems.push(`${where}: domain.fieldId ${record.domain.fieldId} is not a field`);
    const paths = [...record.sources.map((source) => source.href), ...record.task.inputs.flatMap((input) => input.href ?? [])].filter((href) => href.startsWith('/'));
    for (const path of paths) if (!context.exists(path)) problems.push(`${where}: ${path} is not served by the site`);
    if (record.supersedes) {
      const older = parsed.find((item) => item.record.id === record.supersedes);
      if (!older) problems.push(`${where}: supersedes ${record.supersedes}, which does not exist`);
      else if (older.record.date > record.date) problems.push(`${where}: supersedes a newer record`);
    }

    const arms: Record<string, ArmMeasurement | ArmReported> = {};
    if (record.kind === 'dojo-experiment' && record.evidence) {
      const dir = record.evidence.dir;
      const rawResults = context.readJson(`${dir}/results.json`);
      const results = rawResults === undefined ? undefined : resultsFileSchema.safeParse(rawResults);
      if (!results) { problems.push(`${where}: ${dir}/results.json does not exist`); continue; }
      if (!results.success) { problems.push(`${where}: ${dir}/results.json: ${formatZod(results.error).join('; ')}`); continue; }
      const rubric = record.rubric.checks.map((check) => check.id);
      if (rubric.join() !== results.data.checks.join()) problems.push(`${where}: rubric.checks must list the checker's checks in order: ${results.data.checks.join(', ')}`);
      for (const arm of record.arms) {
        const measured = measureArm(context, arm, dir, results.data, problems, `${where} arm ${arm.id}`);
        if (measured) arms[arm.id] = measured;
      }
      record.comparisons.forEach((item, index) => checkComparison(context, item, arms, problems, `${where} comparison ${index + 1} (${item.variable})`, record));
    } else {
      for (const arm of record.arms) {
        if (!arm.reported) continue;
        const { outcome } = arm.reported;
        arms[arm.id] = { kind: 'reported', metric: outcome.metric, outcome: proportion(outcome.value, outcome.of), source: outcome.source };
        if (!record.sources.some((source) => source.href === outcome.source)) problems.push(`${where} arm ${arm.id}: list ${outcome.source} in sources`);
      }
    }
    resolved.push({ slug, href: `/arena/evidence/${slug}`, record, stale: context.today > record.review.staleAfter, arms });
  }
  for (const item of resolved) {
    const newer = resolved.find((other) => other.record.supersedes === item.record.id);
    if (newer) item.supersededBy = { id: newer.record.id, slug: newer.slug, href: newer.href };
  }
  if (problems.length) throw new ArenaRecordError(problems);
  return resolved.sort((a, b) => b.record.date.localeCompare(a.record.date) || a.record.id.localeCompare(b.record.id));
}

export const KIND_LABELS = { 'dojo-experiment': 'Dojo experiment', 'external-benchmark': 'Published external result' } as const;
export const COMPARISON_LABELS: Record<ComparisonKind, string> = {
  model: 'Model', harness: 'Harness', instructions: 'Instructions', skill: 'Skill', tool: 'Tool or integration', delegation: 'Delegation', 'full-stack': 'Full stack',
};

/** The machine-readable copy served at /arena/evidence/<slug>.json. */
export function exportArenaRecord(item: ResolvedArenaRecord, builtOn: string) {
  return {
    format: 'developerdojo-arena-record/1',
    builtOn,
    status: { stale: item.stale, supersededBy: item.supersededBy?.id ?? null, kind: item.record.kind },
    record: item.record,
    measurements: item.arms,
    note: item.record.kind === 'dojo-experiment'
      ? 'Measurements are computed from the published run files at build time. Proportions carry 95% Wilson intervals. A null cost or time means it was not reported, never zero.'
      : 'Results are as reported by the cited source, not measured by Developer Dojo. Proportions carry 95% Wilson intervals over the reported tasks.',
  };
}

const percent = (value: number) => `${Math.round(value * 100)}%`;
/** "2 of 3 (67%; 95% interval 21% to 94%)". */
export function formatProportion(value: Proportion): string {
  return `${value.count} of ${value.of} (${percent(value.count / value.of)}; 95% interval ${percent(value.low)} to ${percent(value.high)})`;
}
export function formatUsd(value: number): string {
  return `$${value.toFixed(4)}`;
}
