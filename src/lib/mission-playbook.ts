import { z } from 'zod';
import { EVIDENCE_KINDS, OBSERVATIONS, type AssessmentMap } from './assessment-map';

/**
 * The mission playbook (developerdojo#95): a mission brief template, a transfer record that reuses the
 * assessment map's rubric (#90), a sanitized retrospective template, and one worked cross-field mission.
 * The data is src/data/mission-playbook.ts; docs/mission-playbook.md is the editor's guide.
 *
 * The transfer record never has its own scale. It names criterion IDs from the assessment map and records
 * each one with the map's own observations (Observed, Not yet observed, Unclear), or null when no
 * independent reviewer has looked. While the review pilot has not run, every observation must be null:
 * the page shows it as Unavailable, never as a result.
 */

/** The brief fields #95 requires. Every one must appear in the template, in this order. */
export const BRIEF_FIELDS = ['goal', 'authorized-inputs', 'constraints', 'stack', 'dependencies', 'acceptance', 'approvals', 'katas'] as const;
/** The transfer fields #95 requires. */
export const TRANSFER_FIELDS = ['foundation-technique', 'what-changes', 'rubric-result'] as const;
/** The retrospective fields. 'route' says where a verified improvement or correction goes. */
export const RETROSPECTIVE_FIELDS = ['what-happened', 'evidence', 'failures', 'uncertain', 'improvement', 'route', 'sharing'] as const;
/** What a retrospective may route to the Sensei contribution process. */
export const ROUTE_KINDS = ['technique-improvement', 'benchmark-correction'] as const;
export type RouteKind = (typeof ROUTE_KINDS)[number];

const text = z.string().trim().min(12);
const label = z.string().trim().min(3);
const siteLink = z.string().regex(/^\/[a-z0-9/#.-]*$/, 'a site-relative link');
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'a date written YYYY-MM-DD');
const kataId = z.string().regex(/^[A-Z]+-(\d{3}|R\d{2})$/, 'a kata ID such as UX-001');

const field = <T extends readonly [string, ...string[]]>(ids: T) => z.strictObject({ id: z.enum(ids), label, prompt: text });

export const templateSchema = z.strictObject({
  title: label,
  notice: text,
  brief: z.array(field(BRIEF_FIELDS)).length(BRIEF_FIELDS.length),
  transfer: z.array(field(TRANSFER_FIELDS)).length(TRANSFER_FIELDS.length),
  retrospective: z.array(field(RETROSPECTIVE_FIELDS)).length(RETROSPECTIVE_FIELDS.length),
  closing: text,
});
export type MissionTemplate = z.infer<typeof templateSchema>;

export const routeSchema = z.strictObject({
  kind: z.enum(ROUTE_KINDS),
  label,
  when: text,
  worksheet: siteLink,
  guide: siteLink,
});

/** One field's version of the technique: the recipe role whose review gate shows it, and the field's own reference. */
export const adaptationSchema = z.strictObject({
  packId: z.string().min(2),
  /** The independent reference this field checks against, in plain words. */
  reference: text,
  /** A recipe (src/content/kata-recipes/<slug>.yaml) and an agent role in it whose reviewGate is quoted on the page. */
  gate: z.strictObject({ recipe: z.string().regex(/^[a-z0-9-]+$/), role: label }),
});

export const rubricResultSchema = z.strictObject({
  /** The assessment map's pilot must have run before a reviewer can be named. */
  reviewer: z.null(),
  why: text,
  criteria: z.array(z.strictObject({
    id: z.string().regex(/^(DEV|MD|SEN)-\d$/),
    observation: z.enum(OBSERVATIONS).nullable(),
    /** Evidence kinds this mission can already hand a reviewer for the criterion. */
    offered: z.array(z.enum(EVIDENCE_KINDS)).min(1),
    /** Evidence kinds the criterion asks for that do not exist yet. */
    missing: z.array(z.enum(EVIDENCE_KINDS)),
    note: text,
  })).min(1),
});

export const workedMissionSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: label,
  provenance: text,
  goal: text,
  audience: text,
  foundation: z.strictObject({ technique: text, kataIds: z.array(kataId).min(1) }),
  adaptations: z.array(adaptationSchema).min(2),
  sharedConstraints: z.array(text).min(1),
  rubricResult: rubricResultSchema,
  retrospective: z.strictObject({
    checkedOn: date,
    whatHappened: text,
    uncertain: text,
    improvements: z.array(z.strictObject({
      kind: z.enum(ROUTE_KINDS),
      title: label,
      observed: text,
      proposal: text,
      evidence: z.strictObject({ recipe: z.string().regex(/^[a-z0-9-]+$/), role: label }),
      status: z.enum(['routed', 'accepted', 'declined']),
    })),
    sharing: text,
  }),
});

export const missionPlaybookSchema = z.strictObject({
  template: templateSchema,
  routes: z.array(routeSchema).length(ROUTE_KINDS.length),
  rubricCriterionIds: z.array(z.string().regex(/^(DEV|MD|SEN)-\d$/)).min(1),
  workedMission: workedMissionSchema,
  boundaries: z.array(text).min(3),
});
export type MissionPlaybook = z.infer<typeof missionPlaybookSchema>;
export type WorkedMission = z.infer<typeof workedMissionSchema>;

/** What the playbook points at, gathered by the caller (the page from the build, the test from the files). */
export interface MissionReferences {
  assessment: AssessmentMap;
  /** Kata recipes by slug: ID, agent roles and foundations. */
  recipes: readonly { slug: string; id: string; roles: readonly { role: string; reviewGate: string }[]; foundationKataIds: readonly string[] }[];
  /** Sector packs: kata IDs and the foundations they build on. */
  packs: readonly { id: string; kataIds: readonly string[]; randoriKataId: string; specialistRandoriKataIds?: readonly string[]; foundationKataIds: readonly string[] }[];
  /** IDs in the kata catalog (src/data/kata-catalog.ts). */
  catalogIds: readonly string[];
  /** Site paths that exist (pages and public files). The test supplies them; the build relies on the link check. */
  sitePaths?: readonly string[];
}

/** Text the published playbook must not contain: issue or merge-request references and repository paths. */
export const UNPUBLISHABLE = [/(^|\s)[#!]\d+\b/, /git\.developerdojo\.org/i, /\bsrc\//, /\.gitlab/, /\bdocs\//];

const strings = (value: unknown): string[] => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];

/** Rules the schema cannot express. Returns one readable message per problem; empty means the playbook holds. */
export function checkMissionPlaybook(input: unknown, refs: MissionReferences): string[] {
  const parsed = missionPlaybookSchema.safeParse(input);
  if (!parsed.success) return parsed.error.issues.map((issue) => `${issue.path.join('.') || 'playbook'}: ${issue.message}`);
  const playbook = parsed.data;
  const problems: string[] = [];
  const order = (fields: readonly { id: string }[], ids: readonly string[], name: string) => {
    if (fields.map((item) => item.id).join() !== ids.join()) problems.push(`${name} fields must be ${ids.join(', ')} in that order`);
  };
  order(playbook.template.brief, BRIEF_FIELDS, 'brief');
  order(playbook.template.transfer, TRANSFER_FIELDS, 'transfer');
  order(playbook.template.retrospective, RETROSPECTIVE_FIELDS, 'retrospective');
  for (const kind of ROUTE_KINDS) if (!playbook.routes.some((route) => route.kind === kind)) problems.push(`routes must include ${kind}`);
  for (const route of playbook.routes) {
    for (const path of [route.worksheet, route.guide]) if (refs.sitePaths && !refs.sitePaths.includes(path.split('#')[0] ?? path)) problems.push(`route ${route.kind} links ${path}, which the site does not have`);
  }

  // The rubric is the assessment map's, not a second scale.
  const criteria = new Map(refs.assessment.ranks.flatMap((rank) => rank.rubric.criteria.map((criterion) => [criterion.id, criterion] as const)));
  for (const id of playbook.rubricCriterionIds) {
    const criterion = criteria.get(id);
    if (!criterion) problems.push(`rubric criterion ${id} is not in the assessment map`);
    else if (!criterion.demands.includes('transfer') && !criterion.demands.includes('domain-adaptation')) problems.push(`rubric criterion ${id} does not assess transfer or domain adaptation`);
  }
  const mission = playbook.workedMission;
  for (const result of mission.rubricResult.criteria) {
    const criterion = criteria.get(result.id);
    if (!playbook.rubricCriterionIds.includes(result.id)) problems.push(`the worked mission records ${result.id}, which is not one of the playbook's transfer criteria`);
    if (!criterion) continue;
    for (const kind of [...result.offered, ...result.missing]) if (!criterion.evidence.includes(kind)) problems.push(`${result.id} does not ask for ${kind} evidence`);
    const covered = new Set([...result.offered, ...result.missing]);
    for (const kind of criterion.evidence) if (!covered.has(kind)) problems.push(`${result.id} asks for ${kind} evidence: list it as offered or missing`);
    if (refs.assessment.pilot.status === 'not-run' && result.observation !== null) problems.push(`${result.id} records "${result.observation}", but no independent review has run: it must stay unavailable (null)`);
  }

  // Foundations: real catalog katas that every adapted pack builds on.
  for (const id of mission.foundation.kataIds) if (!refs.catalogIds.includes(id)) problems.push(`foundation kata ${id} is not in the kata catalog`);
  const packIds = mission.adaptations.map((item) => item.packId);
  if (new Set(packIds).size !== packIds.length) problems.push('each field may be adapted once');
  for (const adaptation of mission.adaptations) {
    const pack = refs.packs.find((item) => item.id === adaptation.packId);
    if (!pack) { problems.push(`sector pack ${adaptation.packId} does not exist`); continue; }
    for (const id of mission.foundation.kataIds) if (!pack.foundationKataIds.includes(id)) problems.push(`sector pack ${pack.id} does not build on ${id}, so the technique cannot be said to transfer to it`);
    const recipe = refs.recipes.find((item) => item.slug === adaptation.gate.recipe);
    if (!recipe) { problems.push(`recipe ${adaptation.gate.recipe} does not exist`); continue; }
    if (![...pack.kataIds, pack.randoriKataId, ...(pack.specialistRandoriKataIds ?? [])].includes(recipe.id)) problems.push(`recipe ${recipe.slug} (${recipe.id}) is not a kata of sector pack ${pack.id}`);
    if (!recipe.roles.some((role) => role.role === adaptation.gate.role)) problems.push(`recipe ${recipe.slug} has no agent role "${adaptation.gate.role}"`);
  }
  for (const improvement of mission.retrospective.improvements) {
    const recipe = refs.recipes.find((item) => item.slug === improvement.evidence.recipe);
    if (!recipe) problems.push(`retrospective evidence ${improvement.evidence.recipe} does not exist`);
    else if (!recipe.roles.some((role) => role.role === improvement.evidence.role)) problems.push(`recipe ${recipe.slug} has no agent role "${improvement.evidence.role}"`);
  }

  // Published text: no issue references, hostnames or repository paths.
  for (const line of strings(playbook)) {
    const hit = UNPUBLISHABLE.find((pattern) => pattern.test(line));
    if (hit) problems.push(`published text must not match ${hit}: "${line.slice(0, 80)}"`);
  }
  return problems;
}

/** Parses the playbook, or throws one message listing every problem, so bad data fails the build. */
export function loadMissionPlaybook(input: unknown, refs: MissionReferences): MissionPlaybook {
  const problems = checkMissionPlaybook(input, refs);
  if (problems.length) throw new Error(`The mission playbook is invalid (src/data/mission-playbook.ts):\n- ${problems.join('\n- ')}`);
  return missionPlaybookSchema.parse(input);
}

/** The editable brief and retrospective as Markdown, from the template. */
export function renderMissionBrief(template: MissionTemplate, routes: MissionPlaybook['routes']): string {
  const section = (heading: string, fields: readonly { label: string }[]) => [`## ${heading}`, ...fields.map((item) => `- ${item.label}:`), ''];
  const routeLines = routes.map((route) => `- ${route.label}: ${route.when} Worksheet: https://developerdojo.org${route.worksheet}`);
  return [
    `# ${template.title}`,
    '',
    template.notice,
    '',
    ...section('Mission brief', template.brief),
    ...section('Transfer record', template.transfer),
    ...section('Retrospective after the work', template.retrospective),
    '## Where a verified improvement goes',
    ...routeLines,
    '',
    template.closing,
    '',
  ].join('\n');
}
