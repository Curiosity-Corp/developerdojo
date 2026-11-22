import { z } from 'zod';
import { UNPUBLISHABLE } from './mission-playbook';

/**
 * The public log of Sensei contributions (developerdojo#94): kata improvements and benchmark corrections taken
 * through the contribution templates, with provenance and rights, executable-skill security, reproduction,
 * independent review and change history recorded. The data is src/data/sensei-contributions.ts; the editor's guide
 * is docs/sensei-contributions.md.
 *
 * Roles are the certificate procedure's (docs/certificates.md section 3), not a new authority: a reviewer who is not
 * the author reviews, and the Maintainer decides and merges. A contribution is "accepted" only once a named
 * independent reviewer has recorded it; until then the review is { unavailable: "<why>" } and the page says so.
 *
 * Mentoring feedback is private by rule and never enters this log: it lives in a confidential issue or with the
 * learner (template Mentoring_feedback).
 */

/** What the public log may hold. */
export const PUBLIC_KINDS = ['kata-improvement', 'benchmark-correction'] as const;
/** Every kind the templates cover. Only PUBLIC_KINDS may be logged. */
export const CONTRIBUTION_KINDS = [...PUBLIC_KINDS, 'mentoring-feedback'] as const;
export type ContributionKind = (typeof CONTRIBUTION_KINDS)[number];

/**
 * proposed: sent in, not yet decided. changes-requested: the reviewer asked for changes.
 * applied: the Maintainer merged the change, and no independent review has been recorded yet.
 * accepted: a named reviewer who is not the author recorded acceptance. declined: decided against, with the reason.
 */
export const OUTCOMES = ['proposed', 'changes-requested', 'applied', 'accepted', 'declined'] as const;
export type Outcome = (typeof OUTCOMES)[number];

/** The mission playbook status that matches each outcome, for a contribution routed from a retrospective. */
export const ROUTE_STATUS_FOR: Record<Outcome, 'routed' | 'applied' | 'accepted' | 'declined'> = {
  proposed: 'routed',
  'changes-requested': 'routed',
  applied: 'applied',
  accepted: 'accepted',
  declined: 'declined',
};

const text = z.string().trim().min(12);
const label = z.string().trim().min(3);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'a lower-case slug');
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'a date written YYYY-MM-DD');
const unavailable = z.strictObject({ unavailable: text });
const orUnavailable = <T extends z.ZodType>(schema: T) => z.union([unavailable, schema]);

/** What the contribution changes: a review gate in a kata recipe, or an Arena evidence record. */
const target = z.discriminatedUnion('part', [
  z.strictObject({ part: z.literal('review-gate'), recipe: slug, role: label }),
  z.strictObject({ part: z.literal('arena-record'), record: z.string().regex(/^ARN-\d{3}$/, 'an Arena record ID such as ARN-001') }),
]);

export const contributionSchema = z.strictObject({
  id: slug,
  kind: z.enum(CONTRIBUTION_KINDS),
  title: label,
  /** Where the contribution came from (a retrospective, a learner's run, a reviewer's note), in public words. */
  origin: text,
  target,
  provenance: z.strictObject({
    /** The source of the observation and of any material reused. */
    source: text,
    /** Licence and permission for the proposed use. Unknown rights stay unknown. */
    rights: text,
    /** What private learner or customer material is involved and how it was kept out. */
    confidentiality: text,
  }),
  security: z.strictObject({
    /** Does the change add or alter anything that runs: code, a skill, a tool, an integration, a permission? */
    executable: z.boolean(),
    review: orUnavailable(text),
  }),
  reproduction: z.strictObject({
    steps: z.array(text).min(1),
    observed: text,
    checkedOn: date,
  }),
  change: z.strictObject({ before: text, after: text }),
  review: z.strictObject({
    /** The author's role, never a person's name in this public log. */
    author: label,
    /** The independent reviewer's role and decision, or why there is none yet. */
    independent: orUnavailable(text),
    outcome: z.enum(OUTCOMES),
    /** What the Maintainer decided, or why nothing is decided yet. */
    decision: text,
    /** Failures found during review and how each was corrected. */
    corrections: z.array(z.strictObject({ observed: text, correction: text })).default(() => []),
  }),
  /** The date of the target's change-history entry. Required once the change is applied or accepted. */
  history: z.strictObject({ changedOn: date }).optional(),
  /** AI assistance used to prepare the contribution. */
  aiUse: text,
});
export const contributionLogSchema = z.array(contributionSchema);
export type Contribution = z.infer<typeof contributionSchema>;

/** What the log points at, gathered by the caller (the page from the build, the test from the files). */
export interface ContributionReferences {
  recipes: readonly {
    slug: string;
    id: string;
    roles: readonly { role: string; reviewGate: string }[];
    changes: readonly { date: string; review: string | { unavailable: string } }[];
  }[];
  arenaRecordIds: readonly string[];
  /** Improvements routed from the mission playbook's worked retrospective. */
  routed: readonly { recipe: string; role: string; status: string }[];
}

const strings = (value: unknown): string[] => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
const isUnavailable = (value: unknown): value is { unavailable: string } => typeof value === 'object' && value !== null && 'unavailable' in value;

/** Rules the schema cannot express. One readable message per problem; empty means the log holds. */
export function checkContributions(input: unknown, refs: ContributionReferences): string[] {
  const parsed = contributionLogSchema.safeParse(input);
  if (!parsed.success) return parsed.error.issues.map((issue) => `${issue.path.join('.') || 'log'}: ${issue.message}`);
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const item of parsed.data) {
    const at = `contribution ${item.id}`;
    if (ids.has(item.id)) problems.push(`${at} is listed twice`);
    ids.add(item.id);
    if (!(PUBLIC_KINDS as readonly string[]).includes(item.kind)) {
      problems.push(`${at}: mentoring feedback is private; keep it in a confidential issue or with the learner, never in the public log`);
    }
    if (item.kind === 'kata-improvement' && item.target.part !== 'review-gate') problems.push(`${at}: a kata improvement targets a kata recipe`);
    if (item.kind === 'benchmark-correction' && item.target.part !== 'arena-record') problems.push(`${at}: a benchmark correction targets an Arena record`);
    if (item.change.before === item.change.after) problems.push(`${at}: before and after are the same, so nothing changes`);
    if (item.security.executable && isUnavailable(item.security.review)) problems.push(`${at}: a change to something that runs needs a recorded security review before it is logged`);

    const { outcome } = item.review;
    if (outcome === 'accepted' && isUnavailable(item.review.independent)) problems.push(`${at}: "accepted" needs a recorded independent review; with none it can only be "applied"`);
    if (outcome === 'applied' && !isUnavailable(item.review.independent)) problems.push(`${at}: an independent review is recorded, so the outcome is "accepted", "changes-requested" or "declined", not "applied"`);
    const landed = outcome === 'applied' || outcome === 'accepted';
    if (landed && !item.history) problems.push(`${at}: an ${outcome} change needs history.changedOn, the date of the target's change-history entry`);
    if (item.history && item.history.changedOn < item.reproduction.checkedOn) problems.push(`${at}: the change is dated before the observation it rests on`);

    if (item.target.part === 'arena-record') {
      if (!refs.arenaRecordIds.includes(item.target.record)) problems.push(`${at}: Arena record ${item.target.record} does not exist`);
      continue;
    }
    const { recipe: recipeSlug, role: roleName } = item.target;
    const recipe = refs.recipes.find((candidate) => candidate.slug === recipeSlug);
    if (!recipe) { problems.push(`${at}: recipe ${recipeSlug} does not exist`); continue; }
    const role = recipe.roles.find((candidate) => candidate.role === roleName);
    if (!role) { problems.push(`${at}: recipe ${recipeSlug} has no agent role "${roleName}"`); continue; }
    // The recipe must read the way the outcome says: changed once it landed, unchanged before.
    if (landed && role.reviewGate !== item.change.after) problems.push(`${at}: the review gate of "${roleName}" in ${recipeSlug} does not read as the "after" text`);
    if (!landed && role.reviewGate !== item.change.before) problems.push(`${at}: the change is ${outcome}, so the review gate of "${roleName}" in ${recipeSlug} should still read as the "before" text`);
    if (item.history) {
      const entry = recipe.changes.find((candidate) => candidate.date === item.history?.changedOn);
      if (!entry) problems.push(`${at}: recipe ${recipeSlug} has no change-history entry dated ${item.history.changedOn}`);
      else if (isUnavailable(entry.review) !== isUnavailable(item.review.independent)) problems.push(`${at}: the recipe's change-history entry and this record disagree on whether an independent review happened`);
    }
    const routed = refs.routed.find((candidate) => candidate.recipe === recipeSlug && candidate.role === roleName);
    if (routed && routed.status !== ROUTE_STATUS_FOR[outcome]) problems.push(`${at}: the mission playbook marks it "${routed.status}", but the outcome ${outcome} means "${ROUTE_STATUS_FOR[outcome]}"`);
  }
  for (const line of strings(parsed.data)) {
    const hit = UNPUBLISHABLE.find((pattern) => pattern.test(line));
    if (hit) problems.push(`published text must not match ${hit}: "${line.slice(0, 80)}"`);
  }
  return problems;
}

/** Parses the log, or throws one message listing every problem, so bad data fails the build. */
export function loadContributions(input: unknown, refs: ContributionReferences): Contribution[] {
  const problems = checkContributions(input, refs);
  if (problems.length) throw new Error(`The Sensei contribution log is invalid (src/data/sensei-contributions.ts):\n- ${problems.join('\n- ')}`);
  return contributionLogSchema.parse(input);
}
