import { getCollection } from 'astro:content';
import { kataCatalog } from '../data/kata-catalog';
import { loadContent } from './content';
import { fields } from './fields';
import { resolveRecipes, type ResolvedRecipe } from './kata-recipes';

// Hand-written kata pages own their slugs; a recipe file with the same name would be shadowed.
const handWritten = Object.keys(import.meta.glob('../pages/katas/*.astro'))
  .map((path) => path.slice(path.lastIndexOf('/') + 1, -'.astro'.length))
  .filter((slug) => !slug.startsWith('['));

let cached: Promise<ResolvedRecipe[]> | undefined;

/** Loads and validates every recipe once per build. An invalid record or reference fails the build. */
export function loadKataRecipes(): Promise<ResolvedRecipe[]> {
  cached ??= (async () => {
    const [records, { resources, tracks }] = await Promise.all([getCollection('kataRecipes'), loadContent()]);
    return resolveRecipes(records.map((record) => ({ slug: record.id, data: record.data })), {
      registries: { fields: fields.map((field) => field.id), resources: resources.map((resource) => resource.id), pathways: tracks.map((track) => track.id) },
      catalog: kataCatalog,
      reservedSlugs: handWritten,
      today: new Date().toISOString().slice(0, 10),
    });
  })();
  return cached;
}
