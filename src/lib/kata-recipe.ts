import { z } from 'zod';
import { kataMetadataSchema } from './kata-schema';
import { resourceId } from './schemas';

/**
 * The operational kata recipe (#86): everything a learner needs to reproduce, check and adapt a kata,
 * around the #81 metadata (`metadata`, validated by kataMetadataSchema and validateKataCatalog).
 *
 * Any section that depends on something actually happening (a showcase, a run, a review) can be
 * `{ unavailable: "<why>" }`. The page then says it is unavailable and why. It never renders a missing
 * section as checked. The status rules at the bottom stop a fixture or draft from claiming a pass.
 *
 * Records live in src/content/kata-recipes/<slug>.yaml and render at /katas/<slug>.
 * The editing guide is docs/kata-recipes.md.
 */

const text = z.string().trim().min(1);
const isoDate = z.iso.date();
const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.domain });

/** Why a section or value is not available. Rendered as "Not available", never as a pass. */
export const unavailableSchema = z.strictObject({ unavailable: text });
export type Unavailable = z.output<typeof unavailableSchema>;
const orUnavailable = <T extends z.ZodType>(schema: T) => z.union([unavailableSchema, schema]);
/** A single value that may be unknown: a version, a cost, a permission. */
const fact = orUnavailable(text);

export const RECIPE_STATUSES = ['fixture', 'draft', 'published', 'withdrawn'] as const;
export type RecipeStatus = (typeof RECIPE_STATUSES)[number];
export const STACK_PARTS = ['harness', 'model', 'instructions', 'context', 'skill', 'tool', 'integration', 'runtime', 'data'] as const;
export const CHECK_RESULTS = ['passed', 'failed', 'not-run'] as const;

const review = z.strictObject({
  /** Date a check was actually performed. Never backdated. */
  lastVerified: isoDate,
  /** What that check covered and what it did not. */
  checked: text,
  nextReview: isoDate,
});

const showcase = z.strictObject({
  summary: text,
  href: z.union([httpsUrl, z.string().regex(/^\/[a-z0-9/._-]*$/)]).optional(),
  provenance: z.strictObject({ creator: text, source: text, license: text, date: isoDate }),
});

const brief = z.strictObject({
  goal: text,
  audience: text,
  inputs: z.array(z.strictObject({ name: text, source: text, terms: text })).min(1),
  doneWhen: z.array(text).min(1),
});

const stack = z.strictObject({
  components: z.array(z.strictObject({
    part: z.enum(STACK_PARTS),
    name: text,
    version: fact,
    permissions: fact,
    cost: fact,
  })).min(1),
  rationale: text,
  alternatives: z.array(z.strictObject({ name: text, tradeoff: text, tested: z.boolean() })).default(() => []),
});

const agents = z.strictObject({
  roles: z.array(z.strictObject({
    role: text,
    responsibility: text,
    dependsOn: z.array(text).default(() => []),
    reviewGate: text,
  })).min(1),
}).superRefine((value, ctx) => {
  const names = new Set(value.roles.map((role) => role.role));
  value.roles.forEach((role, index) => role.dependsOn.forEach((dependency, dependencyIndex) => {
    if (!names.has(dependency)) ctx.addIssue({ code: 'custom', path: ['roles', index, 'dependsOn', dependencyIndex], message: `${dependency} is not a role in this recipe` });
  }));
});

const checkResult = z.strictObject({
  action: text,
  expected: text,
  result: z.enum(CHECK_RESULTS),
  /** Required for passed or failed: where the observed result can be inspected. */
  evidence: text.optional(),
  /** Required for passed or failed: when it was observed. */
  date: isoDate.optional(),
});

const setup = z.strictObject({
  steps: z.array(text).min(1),
  auth: text,
  smokeTest: checkResult,
});

const prompt = z.strictObject({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: text,
  purpose: text,
  text,
});

const exercise = z.strictObject({
  title: text,
  resourceId: resourceId.optional(),
  /** An external exercise (https) or a page on this site (/katas/...). */
  href: z.union([httpsUrl, z.string().regex(/^\/[a-z0-9/._-]*$/)]).optional(),
  terms: text,
}).refine((value) => value.resourceId !== undefined || value.href !== undefined, { message: 'an exercise needs a resourceId or an href' });

const execution = z.strictObject({
  steps: z.array(z.strictObject({ actor: text, action: text, handoff: text.optional() })).min(1),
});

const verification = z.strictObject({
  checks: z.array(checkResult).min(1),
  failures: z.array(z.strictObject({ observed: text, correction: text })).default(() => []),
});

const adaptation = z.strictObject({ variations: z.array(z.strictObject({ change: text, effect: text })).min(1) });

const randori = z.strictObject({ challenge: text, constraints: z.array(text).min(1), evaluation: text });

/** A configuration file served next to the page. Static text only; nothing is executed. */
export const DOWNLOAD_TYPES = { md: 'text/markdown', json: 'application/json', yaml: 'text/yaml', toml: 'text/plain', txt: 'text/plain' } as const;
const download = z.strictObject({
  filename: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:md|json|yaml|toml|txt)$/, 'use a lower-case file name ending in .md, .json, .yaml, .toml or .txt'),
  description: text,
  content: text,
});

type Check = z.output<typeof checkResult>;
const checkNeedsEvidence = (check: Check) => check.result === 'not-run' || (check.evidence !== undefined && check.date !== undefined);

export const kataRecipeSchema = z.strictObject({
  status: z.enum(RECIPE_STATUSES),
  /** Shown at the top of the page. Required for withdrawn recipes. */
  notice: text.optional(),
  maintainer: z.strictObject({ role: text, person: text.optional() }),
  /** For maintainers: the issue with the decision trail. Not shown on the page (the tracker is private). */
  trackingIssue: httpsUrl.optional(),
  review: orUnavailable(review),
  metadata: kataMetadataSchema,
  summary: text,
  showcase: orUnavailable(showcase),
  brief,
  stack: orUnavailable(stack),
  agents: orUnavailable(agents),
  setup: orUnavailable(setup),
  prompts: z.array(prompt).default(() => []),
  exercise: orUnavailable(exercise),
  execution: orUnavailable(execution),
  verification: orUnavailable(verification),
  adaptation: orUnavailable(adaptation),
  randori: orUnavailable(randori),
  maintenance: z.strictObject({ cadence: text, caveats: z.array(text).min(1) }),
  downloads: z.array(download).default(() => []),
}).superRefine((recipe, ctx) => {
  const isFixtureId = recipe.metadata.id.startsWith('FIX');
  if ((recipe.status === 'fixture') !== isFixtureId) {
    ctx.addIssue({ code: 'custom', path: ['status'], message: 'status fixture is for FIX* IDs only, and every FIX* ID is a fixture' });
  }
  if (recipe.status === 'withdrawn' && !recipe.notice) {
    ctx.addIssue({ code: 'custom', path: ['notice'], message: 'a withdrawn recipe explains why in notice' });
  }
  const checks: [Check, (string | number)[]][] = [];
  if (!('unavailable' in recipe.setup)) checks.push([recipe.setup.smokeTest, ['setup', 'smokeTest']]);
  if (!('unavailable' in recipe.verification)) recipe.verification.checks.forEach((check, index) => checks.push([check, ['verification', 'checks', index]]));
  for (const [check, path] of checks) {
    if (!checkNeedsEvidence(check)) ctx.addIssue({ code: 'custom', path, message: `a ${check.result} result needs evidence and a date` });
    if (recipe.status === 'fixture' && check.result !== 'not-run') {
      ctx.addIssue({ code: 'custom', path: [...path, 'result'], message: 'a fixture has never been run; use not-run' });
    }
  }
  if (recipe.status === 'fixture') {
    for (const key of ['review', 'showcase'] as const) {
      if (!('unavailable' in recipe[key])) ctx.addIssue({ code: 'custom', path: [key], message: `a fixture has no ${key}; mark it unavailable` });
    }
  }
  if (recipe.status === 'published') {
    for (const key of ['review', 'showcase', 'stack', 'setup', 'verification'] as const) {
      if ('unavailable' in recipe[key]) ctx.addIssue({ code: 'custom', path: [key], message: `a published recipe needs ${key}` });
    }
    if (recipe.metadata.verificationEvidence.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['metadata', 'verificationEvidence'], message: 'a published recipe needs verification evidence' });
    }
    if (!recipe.maintainer.person) ctx.addIssue({ code: 'custom', path: ['maintainer', 'person'], message: 'a published recipe names who maintains it' });
  }
  if (!('unavailable' in recipe.review) && recipe.review.nextReview <= recipe.review.lastVerified) {
    ctx.addIssue({ code: 'custom', path: ['review', 'nextReview'], message: 'nextReview must be after lastVerified' });
  }
  const seen = new Set<string>();
  recipe.prompts.forEach((item, index) => {
    if (seen.has(item.id)) ctx.addIssue({ code: 'custom', path: ['prompts', index, 'id'], message: `prompt ${item.id} is listed twice` });
    seen.add(item.id);
  });
  const files = new Set<string>();
  recipe.downloads.forEach((item, index) => {
    if (files.has(item.filename)) ctx.addIssue({ code: 'custom', path: ['downloads', index, 'filename'], message: `${item.filename} is listed twice` });
    files.add(item.filename);
  });
});

export type KataRecipeInput = z.input<typeof kataRecipeSchema>;
export type KataRecipe = z.output<typeof kataRecipeSchema>;

export function isUnavailable(value: unknown): value is Unavailable {
  return typeof value === 'object' && value !== null && 'unavailable' in value;
}

export function downloadType(filename: string): string {
  const extension = filename.slice(filename.lastIndexOf('.') + 1) as keyof typeof DOWNLOAD_TYPES;
  return DOWNLOAD_TYPES[extension];
}
