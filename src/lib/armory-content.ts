import { armoryEntries, armoryStackRecipes } from '../data/armory';
import { kataCatalog, kataDimensions } from '../data/kata-catalog';
import { armoryUsage, validateArmory, type KataUsage, type ResolvedArmory } from './armory';
import { loadContent, type Resource } from './content';
import { fields } from './fields';
import { validateKataCatalog } from './kata-catalog';

export interface LoadedArmory {
  armory: ResolvedArmory;
  resources: Map<string, Resource>;
  usage: { recipes: Map<string, KataUsage[]>; entries: Map<string, KataUsage[]> };
  today: string;
}

let cached: Promise<LoadedArmory> | undefined;

/**
 * Loads and validates the Armory registry once per build against the resources collection and the
 * published kata catalogue. An invalid record or reference fails the build.
 */
export function loadArmory(): Promise<LoadedArmory> {
  cached ??= (async () => {
    const { resources, tracks } = await loadContent();
    const today = new Date().toISOString().slice(0, 10);
    const resourceIds = resources.map((resource) => resource.id);
    const armory = validateArmory({ entries: armoryEntries, recipes: armoryStackRecipes }, { resources: resourceIds, kataStackRecipes: kataDimensions.stackRecipes, today });
    const katas = validateKataCatalog(kataCatalog, { fields: fields.map((field) => field.id), resources: resourceIds, pathways: tracks.map((track) => track.id), ...kataDimensions });
    const usage = armoryUsage(armory, katas.map(({ metadata, href }) => ({ id: metadata.id, title: metadata.title, href, stackRecipeIds: metadata.stackRecipeIds, externalResources: metadata.externalResources })));
    return { armory, resources: new Map(resources.map((resource) => [resource.id, resource])), usage, today };
  })();
  return cached;
}
