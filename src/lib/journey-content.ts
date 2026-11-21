import { igniteJourneys } from '../data/ignite-journeys';
import { loadContent } from './content';
import { journeyRegistries } from './journey-registries';
import { handWrittenKataSlugs, loadKataRecipes } from './kata-recipe-content';
import { resolveJourneys, type ResolvedJourney } from './journeys';

let cached: Promise<ResolvedJourney[]> | undefined;

/**
 * Resolves every journey once per build (#83). A reference that is not in the taxonomy lock, no longer
 * live, moved, or without a page fails the build with a message naming the journey, the step and the fix.
 * loadKataRecipes runs the taxonomy stability check (#82) first, so the lock itself is sound.
 */
export function loadJourneys(): Promise<ResolvedJourney[]> {
  cached ??= (async () => {
    const [recipes, { tracks }] = await Promise.all([loadKataRecipes(), loadContent()]);
    return resolveJourneys(igniteJourneys, journeyRegistries({
      recipes: recipes.map((item) => ({ slug: item.slug, id: item.recipe.metadata.id, title: item.recipe.metadata.title })),
      handWrittenSlugs: handWrittenKataSlugs,
      tracks: tracks.map((track) => ({ slug: track.id, title: track.data.title })),
    }));
  })();
  return cached;
}
