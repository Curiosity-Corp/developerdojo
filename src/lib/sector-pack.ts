import { z } from 'zod';
import { BELT_STAGES, dimensionId, kataId } from './kata-schema';

/**
 * Sector packs (#93): the shape every non-software pathway follows, extracted from the UX (#91) and BIM (#92)
 * pathways. A pack ties together what a sector pathway is made of: one field, a pathway page, an ordered set of
 * draft recipes with a Randori, the shared foundations it builds on, real inputs with their terms, the checks CI
 * recomputes, the verified and not-verified lists, the professional-review limit, Armory records and gallery
 * entries. It adds no new content of its own: each piece still lives in its own registry, and the pack only
 * names them, so checkSectorPacks can prove they exist and agree.
 *
 * Records: src/data/sector-packs.ts. Guide and checklist: docs/sector-packs.md. The build runs the check in
 * src/lib/kata-recipe-content.ts; tests/sector-packs.test.ts runs it too, and also checks the CI jobs and the
 * input hashes, which the build cannot see.
 */

const text = z.string().trim().min(1);
const isoDate = z.iso.date();
const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.domain });
const sitePath = z.string().regex(/^\/[A-Za-z0-9/._-]+$/, 'use a site path such as /examples/my-pathway/file.csv');
const kataRoute = z.string().regex(/^\/katas\/[a-z0-9]+(?:-[a-z0-9]+)*$/, 'a pathway page is /katas/<slug>');
const examplesDir = z.string().regex(/^\/examples\/[a-z0-9]+(?:-[a-z0-9]+)*$/, 'examples live in /examples/<slug>');

/** An evidence line. {name} placeholders are filled from the facts the page computes from CI output. */
const evidenceItem = z.union([text, z.strictObject({ text, evidence: sitePath })]);
export type EvidenceItem = z.infer<typeof evidenceItem>;

/** Words that claim an approval no pack can give. A verified line states what a check did, never that work is approved. */
export const APPROVAL_CLAIM = /\b(complian|certif|approv|accredit|endorse|guarantee)/i;

/**
 * Where a qualified review stands, so "verified" names a review state and not only CI. none-available: no qualified
 * reviewer is available to the Dojo for this pack. requested: one has been asked and has not started. in-review: one
 * is reviewing. reviewed: one has finished, and the evidence path holds their written result.
 */
export const REVIEW_STATES = ['none-available', 'requested', 'in-review', 'reviewed'] as const;
export type ReviewState = (typeof REVIEW_STATES)[number];
export const REVIEW_STATE_LABELS: Record<ReviewState, string> = {
  'none-available': 'No qualified reviewer available yet',
  requested: 'Requested, not started',
  'in-review': 'In review',
  reviewed: 'Reviewed',
};

/** One kind of qualified reviewer a real use of the pack's work needs, what they would check, and where that stands. */
const reviewerSchema = z.strictObject({ role: text, scope: text, state: z.enum(REVIEW_STATES), evidence: sitePath.optional() });

export const sectorPackSchema = z.strictObject({
  id: dimensionId,
  title: text,
  /** The pathway's own field first, then any field the same practice transfers to. */
  fieldIds: z.array(dimensionId).min(1),
  /** The hand-written pathway page that shows the worked example and the CI results. */
  pathway: kataRoute,
  /** The practice katas in the order a learner does them. Each has a recipe in src/content/kata-recipes. */
  kataIds: z.array(kataId).min(1),
  /** The Randori recipe: an unseen change after the learner starts. */
  randoriKataId: kataId,
  /** Further Randori recipes for specialists, each an unseen change to a requirement, format or tool. Optional. */
  specialistRandoriKataIds: z.array(kataId).default([]),
  /** Shared foundations every kata in the pack builds on. Reused, never copied into the pack. */
  foundationKataIds: z.array(kataId).min(1),
  /** Where the files a learner downloads live, and the README that gives their licences and how to rerun the checks. */
  examples: z.strictObject({ dir: examplesDir, readme: sitePath }),
  /**
   * Real, openly licensed inputs, unchanged; sha256 pins the exact bytes (checked by tests/sector-packs.test.ts).
   * { none } only when every file is the Dojo's own invented practice material, with the reason. A non-software
   * pack is expected to start from real inputs.
   */
  inputs: z.union([
    z.array(z.strictObject({ name: text, path: sitePath, source: httpsUrl, terms: text, sha256: z.string().regex(/^[0-9a-f]{64}$/) })).min(1),
    z.strictObject({ none: text }),
  ]),
  /** What CI recomputes, the job that does it, and the published files that job must reproduce. */
  checks: z.array(z.strictObject({ name: text, ciJob: z.string().regex(/^[a-z0-9_:-]+$/), runs: text, outputs: z.array(sitePath).min(1) })).min(1),
  verified: z.array(evidenceItem).min(1),
  notVerified: z.array(evidenceItem).min(1),
  /**
   * The field's ontology: the terms a learner must use correctly, each in plain words. Recipes and pages use these
   * terms; the pack is where they are defined once.
   */
  ontology: z.array(z.strictObject({ term: text, meaning: text })).min(3),
  /** The field's own procedures the pack practises, each with the pack katas that practise it, in order. */
  procedures: z.array(z.strictObject({ name: text, kataIds: z.array(kataId).min(1) })).min(1),
  /**
   * required mirrors professionalReviewRequired on every kata. limit says, in plain words, what no one has approved.
   * reviewers names each kind of qualified review a real use needs and its state; a pack that needs none still names
   * the review a real product would get.
   */
  professionalReview: z.strictObject({ required: z.boolean(), limit: text, reviewers: z.array(reviewerSchema).min(1) }),
  armory: z.strictObject({ stackRecipeIds: z.array(dimensionId).min(1), entryIds: z.array(dimensionId) }),
  galleryEntryIds: z.array(dimensionId).min(1),
  /** The date every source the pack cites was last opened. Never backdated. */
  sourcesCheckedOn: isoDate,
  /** For maintainers; never shown on the public site. */
  trackingIssue: z.number().int().positive(),
}).superRefine((pack, ctx) => {
  if (!/-R\d{2}$/.test(pack.randoriKataId)) ctx.addIssue({ code: 'custom', path: ['randoriKataId'], message: 'a Randori kata ID ends in -R01, -R02 and so on' });
  pack.kataIds.forEach((id, index) => {
    if (/-R\d{2}$/.test(id)) ctx.addIssue({ code: 'custom', path: ['kataIds', index], message: 'list the Randori in randoriKataId, not with the practice katas' });
  });
  pack.specialistRandoriKataIds.forEach((id, index) => {
    if (!/-R\d{2}$/.test(id)) ctx.addIssue({ code: 'custom', path: ['specialistRandoriKataIds', index], message: 'a Randori kata ID ends in -R01, -R02 and so on' });
    if (id === pack.randoriKataId) ctx.addIssue({ code: 'custom', path: ['specialistRandoriKataIds', index], message: 'the main Randori is already randoriKataId' });
  });
  const packKatas = new Set([...pack.kataIds, pack.randoriKataId, ...pack.specialistRandoriKataIds]);
  pack.procedures.forEach((procedure, index) => {
    procedure.kataIds.forEach((id, kataIndex) => {
      if (!packKatas.has(id)) ctx.addIssue({ code: 'custom', path: ['procedures', index, 'kataIds', kataIndex], message: id + ' is not a kata of this pack' });
    });
  });
  const terms = new Set<string>();
  pack.ontology.forEach((entry, index) => {
    const key = entry.term.toLowerCase();
    if (terms.has(key)) ctx.addIssue({ code: 'custom', path: ['ontology', index, 'term'], message: 'the term ' + entry.term + ' is defined twice' });
    terms.add(key);
  });
  pack.professionalReview.reviewers.forEach((reviewer, index) => {
    if (reviewer.state === 'reviewed' && !reviewer.evidence) ctx.addIssue({ code: 'custom', path: ['professionalReview', 'reviewers', index, 'evidence'], message: 'a reviewed state needs the evidence path of the written review' });
    if (reviewer.state !== 'reviewed' && reviewer.evidence) ctx.addIssue({ code: 'custom', path: ['professionalReview', 'reviewers', index, 'evidence'], message: 'only a reviewed state carries review evidence' });
  });
  pack.verified.forEach((item, index) => {
    const line = typeof item === 'string' ? item : item.text;
    if (APPROVAL_CLAIM.test(line)) ctx.addIssue({ code: 'custom', path: ['verified', index], message: 'a verified line says what a check did; it never claims compliance, certification or approval' });
  });
});

export type SectorPackInput = z.input<typeof sectorPackSchema>;
export type SectorPack = z.output<typeof sectorPackSchema>;

/** A recipe as the pack check and the field template see it. */
export interface PackRecipeReference {
  id: string;
  slug: string;
  title: string;
  layer: string;
  status: string;
  domainIds: readonly string[];
  foundationKataIds: readonly string[];
  stackRecipeIds: readonly string[];
  professionalReviewRequired: boolean;
  artifactTypes: readonly string[];
  standards: readonly { name: string; version: string }[];
  beltStages: readonly string[];
}

/** What a pack is checked against: today's recipes, pages, gallery, Armory and files. */
export interface SectorPackReferences {
  fieldIds: readonly string[];
  recipes: readonly PackRecipeReference[];
  /** IDs of every foundation kata, from the catalog and the recipes. */
  foundationKataIds: readonly string[];
  /** Routes of the hand-written pages in src/pages/katas. */
  pageRoutes: readonly string[];
  galleryEntries: readonly { id: string; kataId: string; fieldIds: readonly string[] }[];
  armoryStackRecipeIds: readonly string[];
  armoryEntryIds: readonly string[];
  /** True when the site path is a file under public/. */
  fileExists: (sitePath: string) => boolean;
}

export class SectorPackError extends Error {
  constructor(readonly problems: readonly string[]) {
    super('Sector pack check failed (docs/sector-packs.md):\n' + problems.map((problem) => ' - ' + problem).join('\n'));
    this.name = 'SectorPackError';
  }
}

/** Every problem with the packs, each naming the pack and what to fix. Empty when all packs are whole. */
export function checkSectorPacks(input: unknown, refs: SectorPackReferences): string[] {
  const parsed = z.array(sectorPackSchema).safeParse(input);
  if (!parsed.success) return parsed.error.issues.map((issue) => 'src/data/sector-packs.ts ' + issue.path.join('.') + ': ' + issue.message);
  const problems: string[] = [];
  const seen = new Map<string, string>();
  const claim = (kind: string, value: string, pack: string) => {
    const owner = seen.get(kind + ' ' + value);
    if (owner) problems.push(pack + ': ' + kind + ' ' + value + ' already belongs to the ' + owner + ' pack');
    seen.set(kind + ' ' + value, pack);
  };
  const recipes = new Map(refs.recipes.map((recipe) => [recipe.id, recipe]));
  const gallery = new Map(refs.galleryEntries.map((entry) => [entry.id, entry]));
  for (const pack of parsed.data) {
    const p = pack.id;
    const field = pack.fieldIds[0] ?? '';
    claim('pack', p, p);
    claim('pathway', pack.pathway, p);
    for (const id of pack.fieldIds) if (!refs.fieldIds.includes(id)) problems.push(p + ': field ' + id + ' is not in src/lib/fields.ts');
    if (!refs.pageRoutes.includes(pack.pathway)) problems.push(p + ': pathway page ' + pack.pathway + ' does not exist; add src/pages' + pack.pathway + '.astro');
    for (const id of pack.foundationKataIds) if (!refs.foundationKataIds.includes(id)) problems.push(p + ': ' + id + ' is not a foundation kata');
    for (const id of [...pack.kataIds, pack.randoriKataId, ...pack.specialistRandoriKataIds]) {
      claim('kata', id, p);
      const recipe = recipes.get(id);
      if (!recipe) { problems.push(p + ': ' + id + ' has no recipe in src/content/kata-recipes'); continue; }
      if (recipe.layer !== 'specialization') problems.push(p + ': ' + id + ' is a ' + recipe.layer + '; a pack teaches specializations and reuses foundations');
      if (!recipe.domainIds.includes(field)) problems.push(p + ': ' + id + ' does not list the pack field ' + field + ' in domainIds');
      if (recipe.professionalReviewRequired !== pack.professionalReview.required) problems.push(p + ': ' + id + ' has professionalReviewRequired ' + recipe.professionalReviewRequired + ' but the pack says ' + pack.professionalReview.required);
      if (!pack.foundationKataIds.some((foundation) => recipe.foundationKataIds.includes(foundation))) problems.push(p + ': ' + id + ' builds on none of the pack foundations (' + pack.foundationKataIds.join(', ') + ')');
      if (!pack.armory.stackRecipeIds.some((stack) => recipe.stackRecipeIds.includes(stack))) problems.push(p + ': ' + id + ' uses none of the pack stack recipes (' + pack.armory.stackRecipeIds.join(', ') + ')');
      if (recipe.status === 'fixture') problems.push(p + ': ' + id + ' is a fixture; a pack is made of real recipes');
      if (recipe.beltStages.length === 0) problems.push(p + ': ' + id + ' has no belt criteria; add beltCriteria to its recipe');
    }
    for (const id of pack.kataIds) if (!pack.procedures.some((procedure) => procedure.kataIds.includes(id))) problems.push(p + ': ' + id + ' practises none of the pack procedures; add it to one');
    const template = packTemplate(pack, refs.recipes);
    if (template.standards.length === 0) problems.push(p + ': no pack kata names a versioned standard; add one to a recipe\'s standards, with its version');
    for (const stage of BELT_STAGES) if (!template.beltStages.includes(stage)) problems.push(p + ': no pack kata has a ' + stage + ' belt criterion');
    for (const reviewer of pack.professionalReview.reviewers) {
      if (reviewer.evidence && !refs.fileExists(reviewer.evidence)) problems.push(p + ': review evidence ' + reviewer.evidence + ' does not exist');
    }
    for (const id of pack.armory.stackRecipeIds) if (!refs.armoryStackRecipeIds.includes(id)) problems.push(p + ': stack recipe ' + id + ' is not in the Armory (src/data/armory.ts)');
    for (const id of pack.armory.entryIds) if (!refs.armoryEntryIds.includes(id)) problems.push(p + ': Armory entry ' + id + ' does not exist (src/data/armory.ts)');
    for (const id of pack.galleryEntryIds) {
      const entry = gallery.get(id);
      if (!entry) { problems.push(p + ': gallery entry ' + id + ' does not exist (src/data/gallery.ts)'); continue; }
      if (![...pack.kataIds, pack.randoriKataId, ...pack.specialistRandoriKataIds].includes(entry.kataId)) problems.push(p + ': gallery entry ' + id + ' is taught by ' + entry.kataId + ', which is not in the pack');
      if (!entry.fieldIds.includes(field)) problems.push(p + ': gallery entry ' + id + ' is not listed under the pack field ' + field);
    }
    const files = [pack.examples.readme, ...(Array.isArray(pack.inputs) ? pack.inputs.map((input) => input.path) : []), ...pack.checks.flatMap((check) => check.outputs)];
    for (const path of files) {
      if (!path.startsWith(pack.examples.dir + '/')) problems.push(p + ': ' + path + ' is outside ' + pack.examples.dir);
      if (!refs.fileExists(path)) problems.push(p + ': ' + path + ' does not exist under public/');
    }
    for (const item of [...pack.verified, ...pack.notVerified]) {
      if (typeof item !== 'string' && !refs.fileExists(item.evidence) && !refs.pageRoutes.includes(item.evidence)) problems.push(p + ': evidence ' + item.evidence + ' does not exist');
    }
  }
  return problems;
}

/**
 * The parts of the field template a pack takes from its recipes rather than repeating them: the standards the katas
 * are read against (name and version, each once), the native artifacts they produce and the belt stages they cover.
 */
export interface PackTemplate {
  katas: readonly PackRecipeReference[];
  standards: readonly { name: string; version: string; kataIds: readonly string[] }[];
  artifactTypes: readonly string[];
  beltStages: readonly string[];
}

export function packTemplate(pack: Pick<SectorPack, 'kataIds' | 'randoriKataId' | 'specialistRandoriKataIds'>, recipes: readonly PackRecipeReference[]): PackTemplate {
  const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const katas = [...pack.kataIds, pack.randoriKataId, ...pack.specialistRandoriKataIds].flatMap((id) => byId.get(id) ?? []);
  const standards = new Map<string, { name: string; version: string; kataIds: string[] }>();
  for (const kata of katas) {
    for (const standard of kata.standards) {
      const key = standard.name + '\u0000' + standard.version;
      const entry = standards.get(key) ?? { name: standard.name, version: standard.version, kataIds: [] };
      entry.kataIds.push(kata.id);
      standards.set(key, entry);
    }
  }
  return {
    katas,
    standards: [...standards.values()],
    artifactTypes: [...new Set(katas.flatMap((kata) => kata.artifactTypes))],
    beltStages: BELT_STAGES.filter((stage) => katas.some((kata) => kata.beltStages.includes(stage))),
  };
}

export function assertSectorPacks(input: unknown, refs: SectorPackReferences): void {
  const problems = checkSectorPacks(input, refs);
  if (problems.length > 0) throw new SectorPackError(problems);
}

/** Fills {name} placeholders from facts the page computed. A placeholder without a fact fails the build. */
export function fillEvidence(line: string, facts: Readonly<Record<string, string | number>>, pack: string): string {
  return line.replace(/\{([a-zA-Z0-9]+)\}/g, (_, name: string) => {
    const value = facts[name];
    if (value === undefined) throw new SectorPackError([pack + ': evidence line needs the fact {' + name + '}, which the page did not pass']);
    return String(value);
  });
}
