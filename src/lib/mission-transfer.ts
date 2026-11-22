import { z } from 'zod';
import { humanize } from './kata-recipes';
import { adaptationSchema, UNPUBLISHABLE, type MissionPlaybook, type MissionReferences, type MissionTemplate } from './mission-playbook';
import type { AssessmentMap } from './assessment-map';
import type { SectorPack } from './sector-pack';

/**
 * Transfer practice (developerdojo#95): a learner carries the worked mission's foundation technique into one field
 * of their choosing. Each field gets a practice sheet, a mission brief, transfer record and retrospective already
 * filled in from that field's pathway: its reference, review gate, first kata, unseen Randori, inputs and terms,
 * checks, capabilities, standards and professional-review limit. The data is src/data/mission-transfer.ts.
 *
 * Nothing is typed twice. The fields are the worked mission's adaptations plus `additionalFields` for pathways the
 * worked mission does not read, and every sector pack built on the foundation katas must be covered, so a new
 * pathway fails the build until it has a practice. The rubric is the assessment map's (via the playbook's
 * transfer criteria); a sheet always records the result as Unavailable, because only an independent reviewer
 * records one.
 */

/** The practice steps, in order. */
export const PRACTICE_STEPS = ['foundation', 'first-kata', 'gate', 'randori', 'evidence', 'review'] as const;

const text = z.string().trim().min(12);
const label = z.string().trim().min(3);

export const transferPracticeSchema = z.strictObject({
  title: label,
  notice: text,
  steps: z.array(z.strictObject({ id: z.enum(PRACTICE_STEPS), label, text })).length(PRACTICE_STEPS.length),
  /** Pathways the worked mission does not adapt to; the same shape and rules as its adaptations. */
  additionalFields: z.array(adaptationSchema),
  /** The learner's own checks before asking for review. They are not a rubric result. */
  selfCheck: z.array(text).min(3),
});
export type TransferPractice = z.infer<typeof transferPracticeSchema>;
export type Adaptation = z.infer<typeof adaptationSchema>;

const strings = (value: unknown): string[] => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];

/** Every field a learner can practise: the worked mission's adaptations first, then the additional ones. */
export function practiceAdaptations(practice: TransferPractice, playbook: MissionPlaybook): Adaptation[] {
  return [...playbook.workedMission.adaptations, ...practice.additionalFields];
}

/** Rules the schema cannot express. One readable message per problem; empty means the practice holds. */
export function checkTransferPractice(input: unknown, playbook: MissionPlaybook, refs: MissionReferences): string[] {
  const parsed = transferPracticeSchema.safeParse(input);
  if (!parsed.success) return parsed.error.issues.map((issue) => `transfer practice ${issue.path.join('.') || ''}: ${issue.message}`);
  const practice = parsed.data;
  const problems: string[] = [];
  if (practice.steps.map((step) => step.id).join() !== PRACTICE_STEPS.join()) problems.push(`practice steps must be ${PRACTICE_STEPS.join(', ')} in that order`);

  const foundation = playbook.workedMission.foundation.kataIds;
  const covered = practiceAdaptations(practice, playbook).map((item) => item.packId);
  for (const id of new Set(covered)) if (covered.filter((item) => item === id).length > 1) problems.push(`sector pack ${id} has more than one transfer practice: the worked mission already adapts it`);

  for (const adaptation of practice.additionalFields) {
    const pack = refs.packs.find((item) => item.id === adaptation.packId);
    if (!pack) { problems.push(`sector pack ${adaptation.packId} does not exist`); continue; }
    for (const id of foundation) if (!pack.foundationKataIds.includes(id)) problems.push(`sector pack ${pack.id} does not build on ${id}, so the technique cannot be practised there`);
    const recipe = refs.recipes.find((item) => item.slug === adaptation.gate.recipe);
    if (!recipe) { problems.push(`recipe ${adaptation.gate.recipe} does not exist`); continue; }
    if (![...pack.kataIds, pack.randoriKataId].includes(recipe.id)) problems.push(`recipe ${recipe.slug} (${recipe.id}) is not a kata of sector pack ${pack.id}`);
    if (!recipe.roles.some((role) => role.role === adaptation.gate.role)) problems.push(`recipe ${recipe.slug} has no agent role "${adaptation.gate.role}"`);
  }

  // A pathway built on the same foundations must offer the practice, or the learner cannot choose it.
  for (const pack of refs.packs) {
    if (foundation.every((id) => pack.foundationKataIds.includes(id)) && !covered.includes(pack.id)) {
      problems.push(`sector pack ${pack.id} builds on ${foundation.join(' and ')} but has no transfer practice: add it to additionalFields`);
    }
  }

  for (const line of strings(practice)) {
    const hit = UNPUBLISHABLE.find((pattern) => pattern.test(line));
    if (hit) problems.push(`published text must not match ${hit}: "${line.slice(0, 80)}"`);
  }
  return problems;
}

/** Parses the practice, or throws one message listing every problem, so bad data fails the build. */
export function loadTransferPractice(input: unknown, playbook: MissionPlaybook, refs: MissionReferences): TransferPractice {
  const problems = checkTransferPractice(input, playbook, refs);
  if (problems.length) throw new Error(`The transfer practice is invalid (src/data/mission-transfer.ts):\n- ${problems.join('\n- ')}`);
  return transferPracticeSchema.parse(input);
}

export interface KataLink { id: string; title: string; href: string }

/** What the practice needs from one recipe. The page reads it from the build, the test from the YAML files. */
export interface RecipeFacts {
  slug: string;
  href: string;
  id: string;
  title: string;
  roles: readonly { role: string; reviewGate: string }[];
  capabilityIds: readonly string[];
  standards: readonly { name: string; version: string }[];
  constraintIds: readonly string[];
}

/** One field as a practice sheet shows it, read from its sector pack and recipes. */
export interface PracticeField {
  packId: string;
  name: string;
  title: string;
  pathway: string;
  reference: string;
  gate: { kata: KataLink; role: string; reviewGate: string };
  katas: KataLink[];
  randori: KataLink;
  inputs: { name: string; terms: string; href: string }[];
  checks: string[];
  /** Capabilities the field's katas add beyond the foundation katas. */
  capabilities: string[];
  standards: string[];
  constraints: string[];
  stack: string[];
  professionalReview: { required: boolean; limit: string };
}

const unique = <T,>(items: T[]): T[] => [...new Set(items)];
const link = (recipe: RecipeFacts): KataLink => ({ id: recipe.id, title: recipe.title, href: recipe.href });

/** The field's short name: the pack title before its colon. */
export const fieldName = (pack: Pick<SectorPack, 'title'>): string => pack.title.split(':')[0]?.trim() || pack.title;

/** Reads one field from its sector pack and recipes. Throws when the pack names a kata or role that does not exist. */
export function describeField(pack: SectorPack, adaptation: Adaptation, recipes: readonly RecipeFacts[], foundationCapabilities: ReadonlySet<string>): PracticeField {
  const byId = new Map(recipes.map((item) => [item.id, item] as const));
  const find = (id: string) => {
    const found = byId.get(id);
    if (!found) throw new Error(`transfer practice: sector pack ${pack.id} names ${id}, which has no recipe`);
    return found;
  };
  const katas = pack.kataIds.map(find);
  const randori = find(pack.randoriKataId);
  const gateRecipe = recipes.find((item) => item.slug === adaptation.gate.recipe);
  if (!gateRecipe) throw new Error(`transfer practice: no recipe ${adaptation.gate.recipe}`);
  const gateRole = gateRecipe.roles.find((item) => item.role === adaptation.gate.role);
  if (!gateRole) throw new Error(`transfer practice: recipe ${gateRecipe.slug} has no role ${adaptation.gate.role}`);
  const all = [...katas, randori];
  return {
    packId: pack.id,
    name: fieldName(pack),
    title: pack.title,
    pathway: pack.pathway,
    reference: adaptation.reference,
    gate: { kata: link(gateRecipe), role: gateRole.role, reviewGate: gateRole.reviewGate },
    katas: katas.map(link),
    randori: link(randori),
    inputs: Array.isArray(pack.inputs) ? pack.inputs.map((input) => ({ name: input.name, terms: input.terms, href: input.path })) : [{ name: 'Dojo practice material', terms: pack.inputs.none, href: pack.examples.readme }],
    checks: pack.checks.map((check) => check.name),
    capabilities: unique(all.flatMap((item) => [...item.capabilityIds])).filter((id) => !foundationCapabilities.has(id)).map(humanize),
    standards: unique(all.flatMap((item) => item.standards.map((standard) => `${standard.name} (${standard.version})`))),
    constraints: unique(all.flatMap((item) => [...item.constraintIds])).map(humanize),
    stack: pack.armory.stackRecipeIds.map(humanize),
    professionalReview: { required: pack.professionalReview.required, limit: pack.professionalReview.limit },
  };
}

/** A transfer criterion as the sheet lists it, with the evidence kinds the assessment map asks for. */
export interface PracticeCriterion { id: string; title: string; observable: string; evidence: { kind: string; title: string }[] }

export interface SheetContext {
  practice: TransferPractice;
  template: MissionTemplate;
  routes: MissionPlaybook['routes'];
  technique: string;
  foundations: KataLink[];
  criteria: PracticeCriterion[];
}

export const SITE = 'https://developerdojo.org';
const url = (path: string) => `${SITE}${path}`;
const kata = (item: KataLink) => `${item.id} ${item.title} (${url(item.href)})`;
const sentence = (items: readonly string[], none: string) => items.length ? `${items.join('; ')}.` : none;

/** The site path of a field's practice sheet. */
export const sheetPath = (packId: string) => `/examples/mission-transfer/${packId}.md`;

/**
 * One field's practice sheet as Markdown: the template's brief, transfer record and retrospective, with every line
 * the pathway can answer already filled in, and the rubric result left Unavailable.
 */
export function renderPracticeSheet(context: SheetContext, field: PracticeField): string {
  const { practice, template, routes, technique, foundations, criteria } = context;
  const steps: Record<(typeof PRACTICE_STEPS)[number], string> = {
    foundation: foundations.map(kata).join(' and '),
    'first-kata': kata(field.katas[0] ?? field.randori),
    gate: `"${field.gate.reviewGate}" (${field.gate.role}, ${kata(field.gate.kata)})`,
    randori: kata(field.randori),
    evidence: criteria.map((criterion) => `${criterion.id}: ${criterion.evidence.map((item) => item.title).join(', ')}`).join('; '),
    review: field.checks.length ? `The reviewer reruns: ${field.checks.join('; ')}.` : 'The reviewer chooses the checks.',
  };
  const brief: Record<string, string> = {
    goal: `Practice: carry the technique into ${field.title}. Replace this with your own goal and decision-maker if you take it into real work.`,
    'authorized-inputs': `${field.inputs.map((input) => `${input.name} (${url(input.href)}): ${input.terms}`).join(' ')} Add an input of your own only with permission.`,
    constraints: sentence(field.constraints, 'None recorded on these katas; add your own.'),
    stack: `${field.stack.join(', ')}, with an assistant of your choice. Record the versions and permissions you actually use.`,
    dependencies: `The foundation katas ${foundations.map((item) => item.id).join(' and ')}, and the files on the pathway page (${url(field.pathway)}).`,
    acceptance: `${sentence(field.checks, 'No CI check is recorded.')} A reviewer reruns them; your own run does not count as the independent check.`,
    approvals: `${field.professionalReview.required ? 'Qualified professional review is required for real use.' : 'Not required for this practice material.'} ${field.professionalReview.limit}`,
    katas: `${field.katas.map((item) => item.id).join(', ')} and the Randori ${field.randori.id}.`,
  };
  const transfer: Record<string, string> = {
    'foundation-technique': `${technique} (from ${foundations.map((item) => item.id).join(' and ')})`,
    'what-changes': `Reference: ${field.reference} Capabilities: ${sentence(field.capabilities, 'none beyond the foundation.')} Standards: ${sentence(field.standards, 'none recorded on these katas.')}`,
    'rubric-result': 'Unavailable until an independent reviewer records it.',
  };
  const filled = (items: readonly { id: string; label: string }[], values: Record<string, string>) => items.map((item) => values[item.id] ? `- ${item.label}: ${values[item.id]}` : `- ${item.label}:`);
  return [
    `# Transfer practice: ${field.name}`,
    '',
    practice.notice,
    '',
    `Pathway: ${field.title} (${url(field.pathway)})`,
    '',
    '## How to practise',
    ...practice.steps.map((step, index) => `${index + 1}. ${step.label}. ${step.text} ${steps[step.id]}`),
    '',
    '## Mission brief',
    ...filled(template.brief, brief),
    '',
    '## Transfer record',
    ...filled(template.transfer, transfer),
    ...criteria.flatMap((criterion) => [
      `  - ${criterion.id} ${criterion.title}: Unavailable. ${criterion.observable}`,
      ...criterion.evidence.map((item) => `    - [ ] ${item.title}:`),
    ]),
    '',
    '## Before you ask for review (a self-check, not a rubric result)',
    ...practice.selfCheck.map((line) => `- [ ] ${line}`),
    '',
    '## Retrospective after the work',
    ...template.retrospective.map((item) => `- ${item.label}:`),
    '',
    '## Where a verified improvement goes',
    ...routes.map((route) => `- ${route.label}: ${route.when} Worksheet: ${url(route.worksheet)}`),
    '',
    template.closing,
    '',
  ].join('\n');
}

/** What assembling the practice needs; the build reads it from Astro, the test from the files. */
export interface PracticeSources {
  practice: TransferPractice;
  playbook: MissionPlaybook;
  assessment: AssessmentMap;
  recipes: readonly RecipeFacts[];
  packs: readonly SectorPack[];
  /** The kata catalog entries the foundations come from. */
  catalog: readonly { href: string; linkLabel: string; metadata: { id: string; capabilityIds: readonly string[] } }[];
}

export interface AssembledPractice {
  /** In sector pack order. */
  fields: PracticeField[];
  /** Markdown practice sheets by sector pack ID. */
  sheets: ReadonlyMap<string, string>;
  criteria: PracticeCriterion[];
}

/** Every field's practice and sheet. Throws when a foundation, criterion, kata or role is missing. */
export function assemblePractice({ practice, playbook, assessment, recipes, packs, catalog }: PracticeSources): AssembledPractice {
  const foundations = playbook.workedMission.foundation.kataIds.map((id) => {
    const entry = catalog.find((item) => item.metadata.id === id);
    if (!entry) throw new Error(`transfer practice: no catalog kata ${id}`);
    return entry;
  });
  const foundationCapabilities = new Set(foundations.flatMap((entry) => [...entry.metadata.capabilityIds]));
  const order = packs.map((pack) => pack.id);
  const fields = practiceAdaptations(practice, playbook)
    .map((adaptation) => {
      const pack = packs.find((item) => item.id === adaptation.packId);
      if (!pack) throw new Error(`transfer practice: no sector pack ${adaptation.packId}`);
      return describeField(pack, adaptation, recipes, foundationCapabilities);
    })
    .sort((a, b) => order.indexOf(a.packId) - order.indexOf(b.packId));
  const criteria: PracticeCriterion[] = playbook.rubricCriterionIds.map((id) => {
    const criterion = assessment.ranks.flatMap((rank) => rank.rubric.criteria).find((item) => item.id === id);
    if (!criterion) throw new Error(`transfer practice: no rubric criterion ${id}`);
    return {
      id,
      title: criterion.title,
      observable: criterion.observable,
      evidence: criterion.evidence.map((kind) => ({ kind, title: assessment.pilot.evidence.find((item) => item.kind === kind)?.title ?? kind })),
    };
  });
  const context: SheetContext = {
    practice,
    template: playbook.template,
    routes: playbook.routes,
    technique: playbook.workedMission.foundation.technique,
    foundations: foundations.map((entry) => ({ id: entry.metadata.id, title: entry.linkLabel, href: entry.href })),
    criteria,
  };
  return { fields, sheets: new Map(fields.map((field) => [field.packId, renderPracticeSheet(context, field)] as const)), criteria };
}
