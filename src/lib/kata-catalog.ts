import { z } from 'zod';
import { kataMetadataSchema, type KataMetadata, type KataMetadataInput } from './kata-schema';

const entrySchema = z.strictObject({
  metadata: kataMetadataSchema,
  href: z.string().regex(/^\/katas\/[a-z0-9]+(?:-[a-z0-9]+)*$/),
  linkLabel: z.string().trim().min(1),
});

/** A catalog entry as authored: optional metadata lists may be omitted. */
export type KataCatalogEntryInput = { metadata: KataMetadataInput; href: string; linkLabel: string };
/** A validated catalog entry: defaults applied, every reference checked. */
export type KataCatalogEntry = { metadata: KataMetadata; href: string; linkLabel: string };

/**
 * The reference data each dimension is checked against. Every registry is plain data, so a new
 * field, recipe, pathway, constraint or outcome is added by extending a list, not by changing code.
 */
export type KataReferences = {
  /** Field (domain) IDs, from src/lib/fields.ts. */
  fields: readonly string[];
  /** Resource IDs (publisher/resource), from the resources collection. */
  resources: readonly string[];
  /** Learning pathway IDs: track slugs from the tracks collection. */
  pathways: readonly string[];
  outcomes: readonly string[];
  artifacts: readonly string[];
  capabilities: readonly string[];
  constraints: readonly string[];
  stackRecipes: readonly string[];
};

/** Validation failure listing every problem found, one per line, so an author can fix them in one pass. */
export class KataCatalogError extends Error {
  constructor(readonly problems: readonly string[]) {
    super(`Invalid kata catalog:\n${problems.join('\n')}`);
    this.name = 'KataCatalogError';
  }
}

function formatSchemaIssues(error: z.ZodError, input: unknown): string[] {
  return error.issues.map((issue) => {
    const [index] = issue.path;
    const entry = Array.isArray(input) && typeof index === 'number' ? input[index] : undefined;
    const id = typeof entry === 'object' && entry !== null && 'metadata' in entry
      && typeof entry.metadata === 'object' && entry.metadata !== null && 'id' in entry.metadata ? String(entry.metadata.id) : `entry ${String(index)}`;
    return `${id}: ${issue.path.slice(1).join('.') || '(entry)'}: ${issue.message}`;
  });
}

/** Foundation chains must end: a cycle would make "start with this foundation" unanswerable. */
function findFoundationCycles(byId: ReadonlyMap<string, KataCatalogEntry>): string[] {
  const errors: string[] = [];
  const state = new Map<string, 'visiting' | 'done'>();
  const visit = (id: string, trail: string[]): void => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'visiting') {
      errors.push(`foundation cycle: ${[...trail.slice(trail.indexOf(id)), id].join(' -> ')}`);
      return;
    }
    state.set(id, 'visiting');
    for (const next of byId.get(id)?.metadata.foundationKataIds ?? []) if (byId.has(next)) visit(next, [...trail, id]);
    state.set(id, 'done');
  };
  for (const id of byId.keys()) visit(id, []);
  return errors;
}

/**
 * Validate a kata catalog: schema shape and defaults, duplicate IDs and routes, every dimension
 * reference against its registry, foundation references (exist, are foundations, no cycles).
 * It validates editorial links, not the truth or readiness of an educational outcome.
 */
export function validateKataCatalog(input: unknown, references: KataReferences): KataCatalogEntry[] {
  const parsed = z.array(entrySchema).safeParse(input);
  if (!parsed.success) throw new KataCatalogError(formatSchemaIssues(parsed.error, input));
  const entries: KataCatalogEntry[] = parsed.data;
  const errors: string[] = [];
  const byId = new Map<string, KataCatalogEntry>();
  const hrefs = new Set<string>();
  const allowed = {
    fields: new Set(references.fields),
    resources: new Set(references.resources),
    pathways: new Set(references.pathways),
    outcomes: new Set(references.outcomes),
    artifacts: new Set(references.artifacts),
    capabilities: new Set(references.capabilities),
    constraints: new Set(references.constraints),
    stackRecipes: new Set(references.stackRecipes),
  } satisfies Record<keyof KataReferences, Set<string>>;
  for (const entry of entries) {
    const { metadata } = entry;
    const id = metadata.id;
    if (byId.has(id)) errors.push(`duplicate kata ID: ${id}`);
    else byId.set(id, entry);
    if (hrefs.has(entry.href)) errors.push(`duplicate kata route: ${entry.href}`);
    hrefs.add(entry.href);
    const checks: [readonly string[], keyof KataReferences, string][] = [
      [metadata.domainIds, 'fields', 'field'],
      [metadata.crossFieldTransfers, 'fields', 'transfer field'],
      [metadata.externalResources, 'resources', 'resource'],
      [metadata.standards.flatMap((standard) => standard.sourceResourceId ?? []), 'resources', 'standard source'],
      [metadata.pathwayIds, 'pathways', 'pathway'],
      [metadata.outcomeIds, 'outcomes', 'outcome'],
      [metadata.artifactTypes, 'artifacts', 'artifact'],
      [metadata.capabilityIds, 'capabilities', 'capability'],
      [metadata.constraintIds, 'constraints', 'constraint'],
      [metadata.stackRecipeIds, 'stackRecipes', 'stack recipe'],
    ];
    for (const [values, registry, label] of checks) {
      for (const value of values) if (!allowed[registry].has(value)) errors.push(`${id}: unknown ${label} ${value}`);
    }
  }
  for (const entry of entries) {
    for (const id of entry.metadata.foundationKataIds) {
      const target = byId.get(id);
      if (!target) errors.push(`${entry.metadata.id}: unknown foundation ${id}`);
      else if (target.metadata.layer !== 'foundation') errors.push(`${entry.metadata.id}: ${id} is not a foundation`);
    }
  }
  errors.push(...findFoundationCycles(byId));
  if (errors.length) throw new KataCatalogError(errors);
  return entries;
}
