import { z } from 'zod';
import { unavailableSchema } from './kata-recipe';
import { resourceId } from './schemas';

/**
 * The Armory registry (#88): typed, source-backed records for the harnesses, models, instruction
 * methods, skills, MCP servers, CLIs, APIs, plugins, libraries and applications an agent stack can use,
 * and the stack recipes that combine them.
 *
 * Records live in src/data/armory.ts and render on /armory/registry. The editing guide is
 * docs/armory-registry.md.
 *
 * Listing is computed, never declared: an entry appears in the registry only when every listing
 * requirement below holds (listingGaps). Everything else is shown as an unlisted candidate with the
 * gaps named. Passing this schema proves a record is well formed, not that a tool is safe or works
 * beyond the recorded smoke test.
 */

const text = z.string().trim().min(1);
const isoDate = z.iso.date();
const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.domain });
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use a lower-case slug, for example playwright-mcp');
/** A value that may be unknown. Rendered as "Not available" with the reason, never as checked. */
const fact = z.union([unavailableSchema, text]);
const orUnavailable = <T extends z.ZodType>(schema: T) => z.union([unavailableSchema, schema]);

/** Kinds stay distinguishable: a skill is instructions, an MCP server or CLI provides actions. */
export const ARMORY_KINDS = ['harness', 'model', 'instructions', 'skill', 'mcp', 'cli', 'api', 'plugin', 'library', 'application'] as const;
export type ArmoryKind = (typeof ARMORY_KINDS)[number];
export const KIND_LABELS: Record<ArmoryKind, string> = {
  harness: 'Harness', model: 'Model', instructions: 'Instruction method', skill: 'Skill', mcp: 'MCP server', cli: 'CLI',
  api: 'API', plugin: 'Plugin', library: 'Library', application: 'Application',
};

/**
 * Who stands behind an entry.
 * - official: published by the organisation that owns the product or service;
 * - reference: the reference implementation published by the project that owns the protocol or standard;
 * - specification: an open format or convention, not software;
 * - community: anyone else. A community entry must say whom it is not affiliated with (note).
 */
export const MAINTAINER_STATUSES = ['official', 'reference', 'specification', 'community'] as const;
export const STATUS_LABELS: Record<(typeof MAINTAINER_STATUSES)[number], string> = {
  official: 'official', reference: 'reference implementation', specification: 'specification', community: 'community',
};

/** Specialist ecosystems the registry tracks candidates for. */
export const ECOSYSTEMS = ['cad-bim', 'gis', '3d', 'simulation', 'media', 'numerical', 'hardware'] as const;
export const ECOSYSTEM_LABELS: Record<(typeof ECOSYSTEMS)[number], string> = {
  'cad-bim': 'CAD and BIM', gis: 'GIS', '3d': '3D', simulation: 'Simulation', media: 'Media', numerical: 'Numerical computing', hardware: 'Hardware',
};

export const SOURCE_ROLES = ['documentation', 'repository', 'package', 'release', 'license', 'security', 'terms', 'pricing'] as const;
/** What an operation does. read/create/edit/delete act on data; execute runs code; network reaches other hosts. */
export const OPERATIONS = ['read', 'create', 'edit', 'delete', 'execute', 'navigate', 'generate', 'validate', 'network'] as const;
/** smoke-test: observed in this entry's recorded smoke test. documented: the publisher says so; not run by the Dojo. */
export const EVIDENCE_LEVELS = ['smoke-test', 'documented'] as const;

/** A source: a resource from the catalogue (#23, publisher/resource) or a direct https link. Exactly one. */
const sourceSchema = z.strictObject({
  label: text,
  role: z.enum(SOURCE_ROLES),
  url: httpsUrl.optional(),
  resourceId: resourceId.optional(),
}).refine((source) => (source.url === undefined) !== (source.resourceId === undefined), { message: 'give exactly one of url or resourceId' });

const versionSchema = z.strictObject({
  value: text,
  checkedOn: isoDate,
  /** How the version was read: a registry query, a release page, the installed binary. */
  how: text,
});

/** Least access an agent needs, per kind of access. Each may be unavailable, which keeps the entry unlisted. */
const permissionsSchema = z.strictObject({
  read: fact,
  write: fact,
  execute: fact,
  network: fact,
  /** How to run it with the least access, in one or two sentences. */
  minimal: fact,
});

const operationSchema = z.strictObject({
  action: z.enum(OPERATIONS),
  description: text,
  evidence: z.enum(EVIDENCE_LEVELS),
});

const compatibilitySchema = z.strictObject({
  harness: text,
  model: text.optional(),
  platform: text,
  evidence: z.enum(EVIDENCE_LEVELS),
});

/** Evidence files live in public/examples/armory/ and are served at /examples/armory/<file>.json. */
export const EVIDENCE_PATH = /^\/examples\/(?:armory\/[a-z0-9-]+|fnd-001\/runs\/[a-z0-9-]+)\.json$/;

const smokeTestSchema = z.strictObject({
  date: isoDate,
  environment: text,
  action: text,
  expected: text,
  observed: text,
  result: z.enum(['passed', 'failed']),
  evidence: z.array(z.string().regex(EVIDENCE_PATH, 'use /examples/armory/<file>.json or an FND-001 run file')).min(1),
});

/**
 * A provenance or security review. scope says how deep it went: provenance (publisher, package,
 * signatures, licence) or provenance-and-source (also the code or instructions that run). It is never
 * a full audit; notChecked says what was left out.
 */
const securityReviewSchema = z.strictObject({
  date: isoDate,
  scope: z.enum(['provenance', 'provenance-and-source']),
  checked: text,
  findings: z.array(text).min(1),
  notChecked: text,
});

const reviewSchema = z.strictObject({
  lastVerified: isoDate,
  checked: text,
  nextReview: isoDate,
}).refine((review) => review.nextReview > review.lastVerified, { path: ['nextReview'], message: 'nextReview must be after lastVerified' });

export const armoryEntrySchema = z.strictObject({
  id: slug,
  name: text,
  kind: z.enum(ARMORY_KINDS),
  summary: text,
  maintainer: z.strictObject({ name: text, status: z.enum(MAINTAINER_STATUSES), note: text.optional() }),
  /** Code that runs on the learner's device or acts for them. Executable entries need a security review to be listed. */
  executable: z.boolean(),
  ecosystems: z.array(z.enum(ECOSYSTEMS)).default(() => []),
  sources: z.array(sourceSchema).min(1),
  version: orUnavailable(versionSchema),
  license: fact,
  platforms: fact,
  cost: fact,
  auth: fact,
  compatibility: z.array(compatibilitySchema).default(() => []),
  permissions: permissionsSchema,
  operations: z.array(operationSchema).default(() => []),
  setup: orUnavailable(z.array(text).min(1)),
  smokeTest: orUnavailable(smokeTestSchema),
  securityReview: orUnavailable(securityReviewSchema),
  limitations: z.array(text).min(1),
  review: reviewSchema,
  /** Withdrawn entries stay on the page (stable anchors) but are never listed. */
  withdrawn: z.strictObject({ reason: text, replacedBy: slug.optional() }).optional(),
}).superRefine((entry, ctx) => {
  if (entry.maintainer.status === 'community' && !entry.maintainer.note) {
    ctx.addIssue({ code: 'custom', path: ['maintainer', 'note'], message: 'a community entry must say whom it is not affiliated with' });
  }
  if (!entry.sources.some((source) => source.role === 'documentation' || source.role === 'repository')) {
    ctx.addIssue({ code: 'custom', path: ['sources'], message: 'cite at least one documentation or repository source' });
  }
  const passed = !('unavailable' in entry.smokeTest) && entry.smokeTest.result === 'passed';
  entry.operations.forEach((operation, index) => {
    if (operation.evidence === 'smoke-test' && !passed) {
      ctx.addIssue({ code: 'custom', path: ['operations', index, 'evidence'], message: 'smoke-test evidence needs a passed smoke test on this entry' });
    }
  });
  entry.compatibility.forEach((combination, index) => {
    if (combination.evidence === 'smoke-test' && !passed) {
      ctx.addIssue({ code: 'custom', path: ['compatibility', index, 'evidence'], message: 'smoke-test evidence needs a passed smoke test on this entry' });
    }
  });
  if (!('unavailable' in entry.smokeTest) && entry.smokeTest.date > entry.review.lastVerified) {
    ctx.addIssue({ code: 'custom', path: ['smokeTest', 'date'], message: 'the smoke test cannot be later than review.lastVerified' });
  }
  if (!('unavailable' in entry.securityReview) && entry.securityReview.date > entry.review.lastVerified) {
    ctx.addIssue({ code: 'custom', path: ['securityReview', 'date'], message: 'the security review cannot be later than review.lastVerified' });
  }
  if (entry.withdrawn?.replacedBy === entry.id) {
    ctx.addIssue({ code: 'custom', path: ['withdrawn', 'replacedBy'], message: 'an entry cannot replace itself' });
  }
});
export type ArmoryEntryInput = z.input<typeof armoryEntrySchema>;
export type ArmoryEntry = z.output<typeof armoryEntrySchema>;

/** One part of a stack recipe: a registry entry, or a part the learner chooses for themselves. */
const recipeComponentSchema = z.union([
  z.strictObject({ entryId: slug, role: text }),
  z.strictObject({ learnerChoice: text, kind: z.enum(ARMORY_KINDS), role: text }),
]);

/**
 * A stack recipe: the setup a kata names in stackRecipeIds (#81). Its ID must also be in
 * kataDimensions.stackRecipes (src/data/kata-catalog.ts), the #81 extension path, and every recipe ID
 * there must have a record here.
 */
export const armoryStackRecipeSchema = z.strictObject({
  id: slug,
  title: text,
  summary: text,
  components: z.array(recipeComponentSchema).min(1),
});
export type ArmoryStackRecipeInput = z.input<typeof armoryStackRecipeSchema>;
export type ArmoryStackRecipe = z.output<typeof armoryStackRecipeSchema>;

/**
 * Why an entry is not listed. Empty means listed. Each gap is a requirement of #88: a trusted source
 * and maintainer (schema), version, licence, platform, cost and auth, a supported combination, a complete
 * permission scope, documented operations, setup, a passed smoke test, and for executable entries a
 * security review.
 */
export function listingGaps(entry: ArmoryEntry): string[] {
  const gaps: string[] = [];
  const missing = (value: unknown): boolean => typeof value === 'object' && value !== null && 'unavailable' in value;
  if (entry.withdrawn) gaps.push('withdrawn');
  if (missing(entry.version)) gaps.push('version not checked');
  if (missing(entry.license)) gaps.push('licence not confirmed');
  if (missing(entry.platforms)) gaps.push('platforms not confirmed');
  if (missing(entry.cost) || missing(entry.auth)) gaps.push('cost, plan or sign-in not confirmed');
  if (!entry.compatibility.length) gaps.push('no supported harness, platform or model combination recorded');
  if (Object.values(entry.permissions).some(missing)) gaps.push('permission scope incomplete');
  if (!entry.operations.length) gaps.push('operations not documented');
  if (missing(entry.setup)) gaps.push('setup not written');
  if (missing(entry.smokeTest)) gaps.push('no recorded smoke test');
  else if (!missing(entry.smokeTest) && 'result' in entry.smokeTest && entry.smokeTest.result !== 'passed') gaps.push('smoke test failed');
  if (entry.executable && missing(entry.securityReview)) gaps.push('no security or provenance review');
  return gaps;
}

export interface ArmoryReferences {
  /** Resource IDs (publisher/resource) from the resources collection. */
  resources: readonly string[];
  /** kataDimensions.stackRecipes: the stack recipe IDs katas may reference. */
  kataStackRecipes: readonly string[];
  /** Build date, YYYY-MM-DD, to tell when a review is due. */
  today: string;
}

export interface ResolvedArmoryEntry {
  entry: ArmoryEntry;
  listed: boolean;
  gaps: string[];
  reviewDue: boolean;
}

export interface ResolvedStackRecipe {
  recipe: ArmoryStackRecipe;
  /** Listed when every registry component is listed. Learner-choice parts do not block it. */
  listed: boolean;
  /** Registry components that are not listed. */
  unlistedComponents: string[];
}

export interface ResolvedArmory {
  entries: ResolvedArmoryEntry[];
  recipes: ResolvedStackRecipe[];
}

/** Validation failure listing every problem, one per line, each naming the record. */
export class ArmoryError extends Error {
  constructor(readonly problems: readonly string[]) {
    super(`Invalid Armory registry:\n${problems.join('\n')}`);
    this.name = 'ArmoryError';
  }
}

const recordId = (input: unknown, index: PropertyKey | undefined): string => {
  const record = Array.isArray(input) && typeof index === 'number' ? input[index] : undefined;
  return typeof record === 'object' && record !== null && 'id' in record ? String(record.id) : `record ${String(index)}`;
};

/**
 * Validate the registry: record shapes, unique IDs, resource references, replacement links, recipe
 * components and the two-way match with kataDimensions.stackRecipes. Returns entries with their
 * computed listing state. Throws ArmoryError listing every problem.
 */
export function validateArmory(input: { entries: unknown; recipes: unknown }, references: ArmoryReferences): ResolvedArmory {
  const problems: string[] = [];
  const entriesParsed = z.array(armoryEntrySchema).safeParse(input.entries);
  const recipesParsed = z.array(armoryStackRecipeSchema).safeParse(input.recipes);
  if (!entriesParsed.success) {
    problems.push(...entriesParsed.error.issues.map((issue) => `${recordId(input.entries, issue.path[0])}: ${issue.path.slice(1).join('.') || '(entry)'}: ${issue.message}`));
  }
  if (!recipesParsed.success) {
    problems.push(...recipesParsed.error.issues.map((issue) => `recipe ${recordId(input.recipes, issue.path[0])}: ${issue.path.slice(1).join('.') || '(recipe)'}: ${issue.message}`));
  }
  if (!entriesParsed.success || !recipesParsed.success) throw new ArmoryError(problems);
  const entries = entriesParsed.data;
  const recipes = recipesParsed.data;

  const byId = new Map<string, ArmoryEntry>();
  const resources = new Set(references.resources);
  for (const entry of entries) {
    if (byId.has(entry.id)) problems.push(`duplicate entry ID: ${entry.id}`);
    byId.set(entry.id, entry);
    for (const source of entry.sources) {
      if (source.resourceId && !resources.has(source.resourceId)) problems.push(`${entry.id}: unknown resource ${source.resourceId}`);
    }
  }
  for (const entry of entries) {
    const replacement = entry.withdrawn?.replacedBy;
    if (replacement && !byId.has(replacement)) problems.push(`${entry.id}: unknown replacement ${replacement}`);
  }
  const recipeIds = new Set<string>();
  for (const recipe of recipes) {
    if (recipeIds.has(recipe.id)) problems.push(`duplicate recipe ID: ${recipe.id}`);
    recipeIds.add(recipe.id);
    for (const component of recipe.components) {
      if ('entryId' in component && !byId.has(component.entryId)) problems.push(`recipe ${recipe.id}: unknown entry ${component.entryId}`);
    }
  }
  const kataRecipes = new Set(references.kataStackRecipes);
  for (const id of kataRecipes) if (!recipeIds.has(id)) problems.push(`kataDimensions.stackRecipes names ${id}, which has no Armory recipe`);
  for (const id of recipeIds) if (!kataRecipes.has(id)) problems.push(`recipe ${id}: add it to kataDimensions.stackRecipes so katas can reference it`);
  if (problems.length) throw new ArmoryError(problems);

  const resolvedEntries = entries.map((entry) => {
    const gaps = listingGaps(entry);
    return { entry, gaps, listed: gaps.length === 0, reviewDue: entry.review.nextReview < references.today };
  });
  const listed = new Set(resolvedEntries.filter((resolved) => resolved.listed).map((resolved) => resolved.entry.id));
  return {
    entries: resolvedEntries,
    recipes: recipes.map((recipe) => {
      const unlistedComponents = recipe.components.flatMap((component) => 'entryId' in component && !listed.has(component.entryId) ? [component.entryId] : []);
      return { recipe, listed: unlistedComponents.length === 0, unlistedComponents };
    }),
  };
}

export interface KataUsageSource {
  id: string;
  title: string;
  href: string;
  stackRecipeIds: readonly string[];
  externalResources: readonly string[];
}

export interface KataUsage {
  id: string;
  title: string;
  href: string;
}

/**
 * Which katas use each recipe (stackRecipeIds) and each entry (through a recipe, or by citing one of
 * the entry's catalogue sources in externalResources). Keys are recipe IDs and entry IDs.
 */
export function armoryUsage(armory: ResolvedArmory, katas: readonly KataUsageSource[]): { recipes: Map<string, KataUsage[]>; entries: Map<string, KataUsage[]> } {
  const recipes = new Map<string, KataUsage[]>();
  const entries = new Map<string, KataUsage[]>();
  const add = (map: Map<string, KataUsage[]>, key: string, kata: KataUsageSource): void => {
    const list = map.get(key) ?? [];
    if (!list.some((item) => item.id === kata.id)) list.push({ id: kata.id, title: kata.title, href: kata.href });
    map.set(key, list);
  };
  for (const kata of katas) {
    for (const recipeId of kata.stackRecipeIds) {
      add(recipes, recipeId, kata);
      const recipe = armory.recipes.find((candidate) => candidate.recipe.id === recipeId);
      for (const component of recipe?.recipe.components ?? []) if ('entryId' in component) add(entries, component.entryId, kata);
    }
    for (const { entry } of armory.entries) {
      if (entry.sources.some((source) => source.resourceId && kata.externalResources.includes(source.resourceId))) add(entries, entry.id, kata);
    }
  }
  return { recipes, entries };
}
