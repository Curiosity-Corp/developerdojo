import { z } from 'zod';
import { kataMetadataSchema, type KataMetadata } from './kata-schema';

const entrySchema = z.strictObject({
  metadata: kataMetadataSchema,
  href: z.string().regex(/^\/katas\/[a-z0-9]+(?:-[a-z0-9]+)*$/),
  linkLabel: z.string().trim().min(1),
});
export type KataCatalogEntry = { metadata: KataMetadata; href: string; linkLabel: string };
export type KataReferences = {
  fields: readonly string[];
  resources: readonly string[];
  outcomes: readonly string[];
  artifacts: readonly string[];
  capabilities: readonly string[];
  stackRecipes: readonly string[];
};

/** Validate editorial links, not the truth or readiness of an educational outcome. */
export function validateKataCatalog(input: unknown, references: KataReferences): KataCatalogEntry[] {
  const entries = z.array(entrySchema).parse(input);
  const errors: string[] = [];
  const byId = new Map<string, KataCatalogEntry>();
  const hrefs = new Set<string>();
  const allowed = Object.fromEntries(Object.entries(references).map(([key, values]) => [key, new Set(values)])) as Record<keyof KataReferences, Set<string>>;
  for (const entry of entries) {
    const id = entry.metadata.id;
    if (byId.has(id)) errors.push(`duplicate kata ID: ${id}`);
    else byId.set(id, entry);
    if (hrefs.has(entry.href)) errors.push(`duplicate kata route: ${entry.href}`);
    hrefs.add(entry.href);
    const checks: [readonly string[], keyof KataReferences, string][] = [
      [entry.metadata.domainIds, 'fields', 'field'],
      [entry.metadata.crossFieldTransfers, 'fields', 'transfer field'],
      [entry.metadata.externalResources, 'resources', 'resource'],
      [entry.metadata.outcomeIds, 'outcomes', 'outcome'],
      [entry.metadata.artifactTypes, 'artifacts', 'artifact'],
      [entry.metadata.capabilityIds, 'capabilities', 'capability'],
      [entry.metadata.stackRecipeIds, 'stackRecipes', 'stack recipe'],
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
  if (errors.length) throw new Error(`Invalid kata catalog:\n${errors.join('\n')}`);
  return entries;
}
