import { z } from 'zod';
import { STACK_PARTS, unavailableSchema } from './kata-recipe';

/**
 * Arena evidence records (#89): one dated experiment per file in src/content/arena/<slug>.yaml.
 *
 * A record states the question, the task and rubric, every arm's stack with versions, the method, the
 * comparisons it supports, confounders, limitations and sources. It never states a measured number for
 * a Dojo experiment: those are computed at build time from the stored run files (src/lib/arena-records.ts),
 * so the page cannot drift from the evidence. An external benchmark states the numbers its source
 * published, each with the link it came from.
 *
 * Kinds are kept apart on purpose:
 *   - dojo-experiment: run by the Dojo, with every run file and check result published under /examples/;
 *   - external-benchmark: an attributed result published by someone else; a historical snapshot, never
 *     presented as a Dojo measurement.
 * A comparison that was designed but not run is `status: proposed` and can carry no result.
 *
 * The editing guide is docs/arena-evidence.md.
 */

const text = z.string().trim().min(1);
const isoDate = z.iso.date();
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.domain });
/** A path on this site: a page or a file under public/. */
const sitePath = z.string().regex(/^\/[A-Za-z0-9/._#-]*$/, 'use a site path such as /examples/fnd-001/results.json');
const link = z.union([httpsUrl, sitePath]);
const orUnavailable = <T extends z.ZodType>(schema: T) => z.union([unavailableSchema, schema]);
const fact = orUnavailable(text);

export const ARENA_KINDS = ['dojo-experiment', 'external-benchmark'] as const;
export type ArenaKind = (typeof ARENA_KINDS)[number];

/** A stack part, as in the kata recipe (#86), plus the agent arrangement for delegation comparisons. */
export const ARENA_PARTS = [...STACK_PARTS, 'agents'] as const;
export type ArenaPart = (typeof ARENA_PARTS)[number];

/**
 * What a comparison varies. A single-variable comparison may change only the parts listed here; a
 * full-stack comparison changes two or more parts and is never read as the effect of one of them.
 */
export const COMPARISON_PARTS = {
  model: ['model'],
  harness: ['harness'],
  instructions: ['instructions'],
  skill: ['skill'],
  tool: ['tool', 'integration'],
  delegation: ['agents'],
  'full-stack': [],
} as const satisfies Record<string, readonly ArenaPart[]>;
export type ComparisonKind = keyof typeof COMPARISON_PARTS;
export const COMPARISON_KINDS = Object.keys(COMPARISON_PARTS) as [ComparisonKind, ...ComparisonKind[]];

export const SOURCE_KINDS = ['primary-publication', 'dataset', 'evidence-file', 'documentation', 'exercise'] as const;

const stackPart = z.strictObject({
  part: z.enum(ARENA_PARTS),
  name: text,
  version: fact,
});

/** A result a source published for one arm: value out of total (both counts), with where it was read. */
const reportedOutcome = z.strictObject({
  metric: text,
  value: z.number().int().nonnegative(),
  of: z.number().int().positive(),
  source: httpsUrl,
}).refine((outcome) => outcome.value <= outcome.of, { message: 'value cannot exceed of' });

const arm = z.strictObject({
  id: slug,
  label: text,
  stack: z.array(stackPart).min(1),
  /** What the builder may read, write or execute. Unavailable when the source does not say. */
  permissions: fact,
  /** dojo-experiment: run IDs, file names under <evidence.dir>/runs/ without .json. */
  runs: z.array(slug).optional(),
  /** external-benchmark: what the source reported for this arm. */
  reported: z.strictObject({
    outcome: reportedOutcome,
    /** Cost and time as published, or unavailable. A missing cost is never zero. */
    cost: fact,
    time: fact,
  }).optional(),
});

const comparison = z.discriminatedUnion('status', [
  z.strictObject({
    status: z.literal('measured'),
    variable: z.enum(COMPARISON_KINDS),
    control: slug,
    variant: slug,
    change: text,
    heldConstant: z.array(text).min(1),
    confounders: z.array(text).min(1),
    /** What the result shows on this task, and what it does not. */
    reading: text,
  }),
  z.strictObject({
    status: z.literal('proposed'),
    variable: z.enum(COMPARISON_KINDS),
    control: slug,
    change: text,
    heldConstant: z.array(text).min(1),
    confounders: z.array(text).min(1),
    /** Why it has not been run. Starts with "Not run". */
    whyNotRun: z.string().regex(/^Not run\b/, 'start with "Not run"'),
  }),
]);

const source = z.strictObject({ title: text, href: link, kind: z.enum(SOURCE_KINDS) });

/**
 * Words that turn one dated comparison into a general ranking. The Arena publishes what happened on
 * one task with one rubric; a record that needs one of these words is making a claim it cannot support.
 */
export const RANKING_WORDS = /\b(?:best|worst|winner|wins|leaderboard|top[- ]ranked|number one|superior|outperforms?|beats?)\b/i;

export const arenaRecordSchema = z.strictObject({
  /** ARN-<three digits>, unique and never reused; a re-run is a new record that supersedes the old one. */
  id: z.string().regex(/^ARN-\d{3}$/),
  title: text,
  question: text,
  kind: z.enum(ARENA_KINDS),
  /** Dojo experiment: the run date. External benchmark: the date of the publication version cited. */
  date: isoDate,
  /** The kata this experiment belongs to, if any. */
  kataId: z.string().regex(/^[A-Z]{2,5}-\d{3}$/).optional(),
  /** The field whose outcome the rubric measures. Domain scores from different fields never share a scale. */
  domain: z.strictObject({ fieldId: slug, outcome: text, measure: text }),
  review: z.strictObject({
    /** When someone last checked that the record still matches its evidence and sources. */
    lastChecked: isoDate,
    /** After this date the page says the result is stale and must be re-run or re-checked. */
    staleAfter: isoDate,
  }),
  /** The record this one replaces. The older record stays published as a historical snapshot. */
  supersedes: z.string().regex(/^ARN-\d{3}$/).optional(),
  task: z.strictObject({
    summary: text,
    inputs: z.array(z.strictObject({ name: text, href: link.optional() })).min(1),
  }),
  rubric: z.strictObject({
    name: text,
    /** Dojo experiments: one entry per checker check, in the order of results.json. */
    checks: z.array(z.strictObject({ id: slug, checks: text })).default(() => []),
  }),
  method: z.strictObject({
    design: text,
    /** Runs per arm. Unavailable when an external source does not say. */
    repetitions: z.union([unavailableSchema, z.number().int().positive()]),
    /** How to reproduce it, step by step. Commands use only published files. */
    reproduce: z.array(text).min(1),
  }),
  /** dojo-experiment only: where its run files are published. */
  evidence: z.strictObject({ dir: z.string().regex(/^\/examples\/[a-z0-9-]+$/) }).optional(),
  arms: z.array(arm).min(2),
  comparisons: z.array(comparison).min(1),
  limitations: z.array(text).min(1),
  /** What the result may be generalized to, and what not. */
  scope: text,
  sources: z.array(source).min(1),
}).superRefine((record, ctx) => {
  const issue = (path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', path, message });
  const arms = new Map(record.arms.map((item) => [item.id, item]));
  if (arms.size !== record.arms.length) issue(['arms'], 'arm IDs must be unique');
  if (record.review.staleAfter <= record.review.lastChecked) issue(['review', 'staleAfter'], 'staleAfter must be after lastChecked');
  if (record.review.lastChecked < record.date) issue(['review', 'lastChecked'], 'lastChecked cannot be before the experiment date');
  if (record.supersedes === record.id) issue(['supersedes'], 'a record cannot supersede itself');

  const dojo = record.kind === 'dojo-experiment';
  if (dojo && !record.evidence) issue(['evidence'], 'a Dojo experiment publishes its run files; set evidence.dir');
  if (!dojo && record.evidence) issue(['evidence'], 'an external benchmark has no Dojo run files');
  if (dojo && record.rubric.checks.length === 0) issue(['rubric', 'checks'], 'a Dojo experiment lists its checks');
  if (dojo && typeof record.method.repetitions !== 'number') issue(['method', 'repetitions'], 'a Dojo experiment knows how many runs it made');
  record.arms.forEach((item, index) => {
    if (dojo && (!item.runs || item.runs.length === 0)) issue(['arms', index, 'runs'], 'a Dojo arm lists its run IDs');
    if (dojo && item.reported) issue(['arms', index, 'reported'], 'a Dojo arm is measured from its runs, never typed in');
    if (!dojo && item.runs) issue(['arms', index, 'runs'], 'an external arm has no Dojo runs');
    if (!dojo && !item.reported) issue(['arms', index, 'reported'], 'an external arm states what its source reported');
    if (dojo && item.runs && typeof record.method.repetitions === 'number' && item.runs.length !== record.method.repetitions) {
      issue(['arms', index, 'runs'], `${item.runs.length} runs listed, method says ${record.method.repetitions}`);
    }
    const parts = item.stack.map((part) => part.part);
    if (new Set(parts).size !== parts.length) issue(['arms', index, 'stack'], 'each part appears once per arm');
  });
  const checkIds = record.rubric.checks.map((check) => check.id);
  if (new Set(checkIds).size !== checkIds.length) issue(['rubric', 'checks'], 'check IDs must be unique');

  const used = new Set<string>();
  record.comparisons.forEach((item, index) => {
    const path = ['comparisons', index];
    const control = arms.get(item.control);
    if (!control) issue([...path, 'control'], `${item.control} is not an arm`);
    if (item.status === 'proposed') return;
    const variant = arms.get(item.variant);
    if (!variant) issue([...path, 'variant'], `${item.variant} is not an arm`);
    if (item.control === item.variant) issue([...path, 'variant'], 'control and variant must differ');
    const key = `${item.control}>${item.variant}`;
    if (used.has(key)) issue(path, 'this pair is compared twice');
    used.add(key);
    if (!control || !variant) return;
    const changed = changedParts(control.stack, variant.stack);
    const allowed: readonly ArenaPart[] = COMPARISON_PARTS[item.variable];
    if (item.variable === 'full-stack') {
      if (changed.length < 2) issue([...path, 'variable'], `only ${changed.join(', ') || 'nothing'} changed; name that single variable instead of full-stack`);
    } else if (changed.length === 0 || changed.some((part) => !allowed.includes(part))) {
      issue([...path, 'variable'], `a ${item.variable} comparison may change only ${allowed.join(' or ')}; the stacks differ in ${changed.join(', ') || 'nothing'}`);
    }
  });

  const prose: [string, (string | number)[]][] = [[record.title, ['title']], [record.question, ['question']], [record.scope, ['scope']]];
  record.comparisons.forEach((item, index) => { if (item.status === 'measured') prose.push([item.reading, ['comparisons', index, 'reading']]); });
  for (const [value, path] of prose) {
    const match = RANKING_WORDS.exec(value);
    if (match) issue(path, `"${match[0]}" reads as a general ranking; state what happened on this task instead`);
  }
});

export type ArenaRecordInput = z.input<typeof arenaRecordSchema>;
export type ArenaRecord = z.output<typeof arenaRecordSchema>;
export type ArenaArm = ArenaRecord['arms'][number];
export type ArenaComparison = ArenaRecord['comparisons'][number];
export type StackPart = z.output<typeof stackPart>;

/** Two unknown versions of the same name count as the same part: nothing shows that they differ. */
const versionKey = (part: StackPart) => `${part.name}\u0000${typeof part.version === 'string' ? part.version : '?'}`;

/** The parts whose name or version differ between two stacks; a part present in only one stack counts. */
export function changedParts(a: readonly StackPart[], b: readonly StackPart[]): ArenaPart[] {
  const left = new Map(a.map((part) => [part.part, versionKey(part)]));
  const right = new Map(b.map((part) => [part.part, versionKey(part)]));
  return ARENA_PARTS.filter((part) => left.get(part) !== right.get(part));
}
