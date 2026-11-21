import { kataDimensions } from '../data/kata-catalog';
import { fixtureDimensions, fixtureStackRecipes, newField } from '../data/kata-fixtures';
import { KataCatalogError, validateKataCatalog, type KataCatalogEntryInput, type KataReferences } from './kata-catalog';
import { kataRecipeSchema, type KataRecipe, type RecipeStatus } from './kata-recipe';

/**
 * Turns recipe records into pages with resolved relationships (#86). Pure: the Astro side
 * (src/lib/kata-recipe-content.ts) and the tests (tests/kata-recipes.test.ts) call the same function,
 * so a record that fails here fails both the build and CI.
 */

/** The published registries plus the fixture-only vocabulary from src/data/kata-fixtures.ts. */
export function withFixtureVocabulary(base: Pick<KataReferences, 'fields' | 'resources' | 'pathways'>): KataReferences {
  return {
    ...base,
    fields: [...base.fields, newField.id],
    outcomes: [...kataDimensions.outcomes, ...fixtureDimensions.outcomes],
    artifacts: [...kataDimensions.artifacts, ...fixtureDimensions.artifacts],
    capabilities: [...kataDimensions.capabilities, ...fixtureDimensions.capabilities],
    constraints: [...kataDimensions.constraints, ...fixtureDimensions.constraints],
    stackRecipes: [...kataDimensions.stackRecipes, ...fixtureStackRecipes.map((recipe) => recipe.id)],
  };
}

export interface RecipeRecord {
  /** File name without .yaml; the page is /katas/<slug>. */
  slug: string;
  data: unknown;
}

export interface RecipeContext {
  /** Published registries: field IDs, resource IDs and track slugs (pathways). */
  registries: Pick<KataReferences, 'fields' | 'resources' | 'pathways'>;
  /** The curated kata catalog (src/data/kata-catalog.ts), whose pages a recipe may name as foundations. */
  catalog: readonly KataCatalogEntryInput[];
  /** Slugs taken by hand-written pages under src/pages/katas. */
  reservedSlugs: readonly string[];
  /** Build date, YYYY-MM-DD, to tell when a review is due. */
  today: string;
}

export interface RecipeLink {
  id: string;
  title: string;
  href: string;
  /** Set when the target is a recipe page; a legacy kata page has no recipe status. */
  status?: RecipeStatus;
}

export interface ResolvedRecipe {
  slug: string;
  href: string;
  recipe: KataRecipe;
  /** Published and past its next review date at build time. */
  reviewDue: boolean;
  foundations: RecipeLink[];
  /** Recipes and catalog katas that name this kata as a foundation. */
  usedBy: RecipeLink[];
  /** Evidence that someone other than the learner checks (the QA review path on /belt-review). */
  reviewedEvidence: boolean;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Static routes beside /katas/<slug> that a recipe may never take. */
const RESERVED = ['recipes'];
const REVIEW_METHODS = new Set(['peer-review', 'sensei-review', 'professional-review']);

function fixtureOnly(references: KataReferences, recipe: KataRecipe): string[] {
  const published = {
    outcomes: new Set(kataDimensions.outcomes), artifacts: new Set(kataDimensions.artifacts), capabilities: new Set(kataDimensions.capabilities),
    constraints: new Set(kataDimensions.constraints), stackRecipes: new Set(kataDimensions.stackRecipes),
    fields: new Set(references.fields.filter((id) => id !== newField.id)),
  };
  const { metadata } = recipe;
  const uses: [readonly string[], keyof typeof published, string][] = [
    [metadata.outcomeIds, 'outcomes', 'outcome'], [metadata.artifactTypes, 'artifacts', 'artifact'],
    [metadata.capabilityIds, 'capabilities', 'capability'], [metadata.constraintIds, 'constraints', 'constraint'],
    [metadata.stackRecipeIds, 'stackRecipes', 'stack recipe'], [metadata.domainIds, 'fields', 'field'],
    [metadata.crossFieldTransfers, 'fields', 'transfer field'],
  ];
  return uses.flatMap(([values, registry, label]) => values.filter((value) => !published[registry].has(value)).map((value) => `${label} ${value} exists only in the fixture vocabulary`));
}

/**
 * Validate every recipe and resolve its relationships. Throws KataCatalogError listing every
 * problem, one per line and each naming the record, so an editor can fix them in one pass.
 */
export function resolveRecipes(records: readonly RecipeRecord[], context: RecipeContext): ResolvedRecipe[] {
  const problems: string[] = [];
  const parsed: { slug: string; recipe: KataRecipe }[] = [];
  const reserved = new Set([...RESERVED, ...context.reservedSlugs]);
  for (const record of records) {
    const result = kataRecipeSchema.safeParse(record.data);
    if (!result.success) {
      problems.push(...result.error.issues.map((issue) => `${record.slug}: ${issue.path.join('.') || '(record)'}: ${issue.message}`));
      continue;
    }
    const recipe = result.data;
    if (!SLUG.test(record.slug)) problems.push(`${record.slug}: the file name must be a lower-case slug`);
    if (reserved.has(record.slug)) problems.push(`${record.slug}: /katas/${record.slug} is already a page; choose another file name`);
    const fixture = recipe.status === 'fixture';
    if (fixture !== record.slug.startsWith('fixture-')) problems.push(`${record.slug}: fixture recipes, and only fixtures, use a fixture-* file name`);
    parsed.push({ slug: record.slug, recipe });
  }
  if (problems.length) throw new KataCatalogError(problems);

  const references = withFixtureVocabulary(context.registries);
  const entries: KataCatalogEntryInput[] = parsed.map(({ slug, recipe }) => ({ href: `/katas/${slug}`, linkLabel: recipe.metadata.title, metadata: recipe.metadata }));
  try {
    validateKataCatalog([...context.catalog, ...entries], references);
  } catch (error) {
    if (error instanceof KataCatalogError) problems.push(...error.problems);
    else throw error;
  }
  const resources = new Set(context.registries.resources);
  const statusById = new Map(parsed.map(({ recipe }) => [recipe.metadata.id, recipe.status]));
  for (const { slug, recipe } of parsed) {
    if (!('unavailable' in recipe.exercise) && recipe.exercise.resourceId && !resources.has(recipe.exercise.resourceId)) {
      problems.push(`${slug}: unknown exercise resource ${recipe.exercise.resourceId}`);
    }
    if (recipe.status !== 'fixture') {
      problems.push(...fixtureOnly(references, recipe).map((problem) => `${slug}: ${problem}`));
      for (const id of recipe.metadata.foundationKataIds) {
        if (statusById.get(id) === 'fixture') problems.push(`${slug}: foundation ${id} is a fixture`);
      }
    }
  }
  if (problems.length) throw new KataCatalogError(problems);

  const links = new Map<string, RecipeLink>();
  for (const entry of context.catalog) links.set(entry.metadata.id, { id: entry.metadata.id, title: entry.linkLabel, href: entry.href });
  for (const { slug, recipe } of parsed) links.set(recipe.metadata.id, { id: recipe.metadata.id, title: recipe.metadata.title, href: `/katas/${slug}`, status: recipe.status });
  const dependents = [...context.catalog.map((entry) => ({ id: entry.metadata.id, foundations: entry.metadata.foundationKataIds ?? [] })),
    ...parsed.map(({ recipe }) => ({ id: recipe.metadata.id, foundations: recipe.metadata.foundationKataIds }))];

  return parsed.map(({ slug, recipe }) => {
    const id = recipe.metadata.id;
    return {
      slug,
      href: `/katas/${slug}`,
      recipe,
      reviewDue: recipe.status === 'published' && !('unavailable' in recipe.review) && recipe.review.nextReview < context.today,
      foundations: recipe.metadata.foundationKataIds.flatMap((foundation) => links.get(foundation) ?? []),
      usedBy: dependents.filter((dependent) => dependent.foundations.includes(id)).flatMap((dependent) => links.get(dependent.id) ?? []),
      reviewedEvidence: recipe.metadata.verificationEvidence.some((evidence) => REVIEW_METHODS.has(evidence.method)),
    };
  });
}

export const STATUS_LABELS: Record<RecipeStatus, string> = {
  fixture: 'Fixture',
  draft: 'Draft',
  published: 'Published',
  withdrawn: 'Withdrawn',
};

/** Vocabulary IDs are slugs; this is how they read on a page. */
export function humanize(id: string): string {
  const words = id.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
