import { z } from 'zod';
import { RANKS, type RankId } from './ranks';

/**
 * The assessment map (developerdojo#90): what each universal rank assesses, kept apart from the
 * field belts, with advanced rubrics as data and an independent-review pilot. Everything here is a
 * proposal until the program policy review approves it; the page says so and the check below
 * refuses data that claims otherwise. The procedure behind it is docs/independent-review-pilot.md.
 */

/** What a criterion asks of the learner. The first three are the advanced-rubric minimum. */
export const DEMANDS = ['unseen-constraint', 'changed-tool-or-failure', 'independent-judgment', 'transfer', 'teaching', 'domain-adaptation'] as const;
export type Demand = (typeof DEMANDS)[number];
export const DEMAND_LABELS: Record<Demand, string> = {
  'unseen-constraint': 'Unseen constraint',
  'changed-tool-or-failure': 'Changed tool or failure',
  'independent-judgment': 'Independent judgment',
  transfer: 'Transfer to another tool family or field',
  teaching: 'Teaching or reviewing a technique',
  'domain-adaptation': 'Domain adaptations',
};
export const ADVANCED_MINIMUM: readonly Demand[] = ['unseen-constraint', 'changed-tool-or-failure', 'independent-judgment'];

/** The six kinds of evidence a pilot reviewer receives. */
export const EVIDENCE_KINDS = ['artifacts', 'configuration', 'tests', 'review-log', 'failures', 'decisions'] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

/** How a reviewer records one criterion. There is no numeric score and no pass mark here. */
export const OBSERVATIONS = ['Observed', 'Not yet observed', 'Unclear'] as const;

const text = z.string().trim().min(12);
const link = z.string().regex(/^\/[a-z0-9/#-]*$/, 'a site-relative link');

export const criterionSchema = z.strictObject({
  id: z.string().regex(/^(DEV|MD|SEN)-\d$/),
  title: z.string().trim().min(4),
  observable: text,
  notYet: text,
  demands: z.array(z.enum(DEMANDS)).min(1),
  evidence: z.array(z.enum(EVIDENCE_KINDS)).min(1),
});
export type Criterion = z.infer<typeof criterionSchema>;

export const rankAssessmentSchema = z.strictObject({
  rank: z.enum(RANKS.map((rank) => rank.id) as [RankId, ...RankId[]]),
  question: text,
  assesses: z.array(text).min(2),
  notAssessed: z.array(text).min(1),
  currentProcedure: z.strictObject({ label: z.string().min(4), href: link, summary: text }),
  rubric: z.strictObject({
    tier: z.enum(['foundation', 'advanced']),
    status: z.literal('proposed'),
    criteria: z.array(criterionSchema).min(2),
  }),
});
export type RankAssessment = z.infer<typeof rankAssessmentSchema>;

export const beltStageSchema = z.strictObject({
  id: z.enum(['white', 'yellow', 'green', 'brown', 'black']),
  name: z.string().min(4),
  title: z.string().min(4),
  proof: text,
  status: z.literal('proposed'),
});
export type BeltStage = z.infer<typeof beltStageSchema>;

export const evidenceItemSchema = z.strictObject({ kind: z.enum(EVIDENCE_KINDS), title: z.string().min(4), description: text });
export const pilotStepSchema = z.strictObject({ title: z.string().min(4), description: text, reuses: z.strictObject({ label: z.string().min(4), href: link }).optional() });
/** A pilot measure is null until a pilot has run. Null renders as "Unavailable", never as zero. */
export const pilotMeasureSchema = z.strictObject({ name: z.string().min(4), value: z.string().min(1).nullable(), why: text });

export const assessmentMapSchema = z.strictObject({
  ranks: z.array(rankAssessmentSchema).length(RANKS.length),
  belts: z.strictObject({ question: text, assesses: z.array(text).min(2), stages: z.array(beltStageSchema).length(5) }),
  pilot: z.strictObject({
    status: z.enum(['not-run', 'running', 'reported']),
    evidence: z.array(evidenceItemSchema).length(EVIDENCE_KINDS.length),
    steps: z.array(pilotStepSchema).min(5),
    measures: z.array(pilotMeasureSchema).min(1),
  }),
  boundaries: z.array(text).min(4),
});
export type AssessmentMap = z.infer<typeof assessmentMapSchema>;

/** The boundary statements the map must make, as patterns over its boundary list. */
export const REQUIRED_BOUNDARIES: readonly { name: string; pattern: RegExp }[] = [
  { name: 'a checklist or attendance does not award a belt', pattern: /checklist.*attendance.*(does not|never) award a belt/i },
  { name: 'not professional licensure or accreditation', pattern: /not professional licensure or accreditation/i },
  { name: 'the static site takes no authenticated submissions', pattern: /takes no authenticated submissions/i },
  { name: 'qualified professional approval stays separate', pattern: /qualified professional/i },
  { name: 'consent before sharing', pattern: /consent/i },
];

/** Rules the schema cannot express. Returns one readable message per problem; empty means the map holds. */
export function checkAssessmentMap(input: unknown): string[] {
  const parsed = assessmentMapSchema.safeParse(input);
  if (!parsed.success) return parsed.error.issues.map((issue) => `${issue.path.join('.') || 'map'}: ${issue.message}`);
  const map = parsed.data;
  const problems: string[] = [];
  const order = RANKS.map((rank) => rank.id);
  if (map.ranks.map((rank) => rank.rank).join() !== order.join()) problems.push(`ranks must be listed once each, in the order ${order.join(', ')}`);
  const ids = map.ranks.flatMap((rank) => rank.rubric.criteria.map((criterion) => criterion.id));
  for (const id of new Set(ids)) if (ids.filter((other) => other === id).length > 1) problems.push(`criterion ${id} is listed twice`);
  for (const rank of map.ranks) {
    const prefix = { developer: 'DEV', 'master-developer': 'MD', sensei: 'SEN' }[rank.rank];
    for (const criterion of rank.rubric.criteria) if (!criterion.id.startsWith(`${prefix}-`)) problems.push(`${criterion.id} belongs to ${rank.rank} and must start with ${prefix}-`);
    const expectedTier = rank.rank === 'developer' ? 'foundation' : 'advanced';
    if (rank.rubric.tier !== expectedTier) problems.push(`${rank.rank} rubric must be ${expectedTier}`);
    if (rank.rubric.tier === 'advanced') {
      for (const criterion of rank.rubric.criteria) {
        const missing = ADVANCED_MINIMUM.filter((demand) => !criterion.demands.includes(demand));
        if (missing.length) problems.push(`${criterion.id} is advanced and must require ${missing.join(', ')}`);
      }
    }
    const demands = new Set(rank.rubric.criteria.flatMap((criterion) => criterion.demands));
    if (rank.rank === 'master-developer' && !demands.has('transfer')) problems.push('Master Developer must assess transfer across a tool family or field');
    if (rank.rank === 'sensei') {
      if (!demands.has('teaching')) problems.push('Sensei must assess teaching or reviewing a generalizable technique');
      if (!demands.has('domain-adaptation')) problems.push('Sensei must assess the domain adaptations of the technique');
    }
  }
  const stageOrder = ['white', 'yellow', 'green', 'brown', 'black'];
  if (map.belts.stages.map((stage) => stage.id).join() !== stageOrder.join()) problems.push(`belt stages must be ${stageOrder.join(', ')} in order`);
  const kinds = map.pilot.evidence.map((item) => item.kind);
  for (const kind of EVIDENCE_KINDS) if (!kinds.includes(kind)) problems.push(`pilot evidence must include ${kind}`);
  if (map.pilot.status === 'not-run') {
    for (const measure of map.pilot.measures) if (measure.value !== null) problems.push(`pilot measure "${measure.name}" has a value, but no pilot has run`);
  }
  for (const { name, pattern } of REQUIRED_BOUNDARIES) if (!map.boundaries.some((line) => pattern.test(line))) problems.push(`boundaries must state: ${name}`);
  return problems;
}

/** Parses the map, or throws one message listing every problem, so a bad data file fails the build. */
export function loadAssessmentMap(input: unknown): AssessmentMap {
  const problems = checkAssessmentMap(input);
  if (problems.length) throw new Error(`The assessment map is invalid (src/data/assessment-map.ts):\n- ${problems.join('\n- ')}`);
  return assessmentMapSchema.parse(input);
}
