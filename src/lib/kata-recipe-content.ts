import { getCollection } from 'astro:content';
import { kataCatalog } from '../data/kata-catalog';
import { loadContent } from './content';
import { fields } from './fields';
import { resolveRecipes, type ResolvedRecipe } from './kata-recipes';
import { assertIdentifiers } from './taxonomy-identifiers';
import { identifierLedger, identifierLock, liveIdentifiers } from './taxonomy-sources';

// Hand-written kata pages own their slugs; a recipe file with the same name would be shadowed.
const handWritten = Object.keys(import.meta.glob('../pages/katas/*.astro'))
  .map((path) => path.slice(path.lastIndexOf('/') + 1, -'.astro'.length))
  .filter((slug) => !slug.startsWith('['));

let cached: Promise<ResolvedRecipe[]> | undefined;

/**
 * Loads and validates every recipe once per build. An invalid record or reference fails the build, and
 * so does a published taxonomy identifier that disappeared without a move or retirement (#82).
 */
export function loadKataRecipes(): Promise<ResolvedRecipe[]> {
  cached ??= (async () => {
    const [records, { resources, tracks }] = await Promise.all([getCollection('kataRecipes'), loadContent()]);
    const resolved = resolveRecipes(records.map((record) => ({ slug: record.id, data: record.data })), {
      registries: { fields: fields.map((field) => field.id), resources: resources.map((resource) => resource.id), pathways: tracks.map((track) => track.id) },
      catalog: kataCatalog,
      reservedSlugs: handWritten,
      today: new Date().toISOString().slice(0, 10),
    });
    const live = liveIdentifiers({ recipes: resolved.map((item) => ({ slug: item.slug, id: item.recipe.metadata.id })), handWrittenSlugs: handWritten });
    assertIdentifiers(live, identifierLock, identifierLedger);
    return resolved;
  })();
  return cached;
}
