import { KATA_DIRECTORY } from '../data/kata-directory';
import { kataCatalog } from '../data/kata-catalog';
import type { JourneyRegistries } from './journeys';
import { identifierLedger, identifierLock, liveIdentifiers } from './taxonomy-sources';

/** What the build (or a test) found on disk: recipe records, hand-written kata pages and track files. */
export interface JourneySourceData {
  recipes: readonly { slug: string; id: string; title: string }[];
  handWrittenSlugs: readonly string[];
  tracks: readonly { slug: string; title: string }[];
}

/**
 * The registries a journey reference resolves against (#83), built from live data with the same
 * identifier sources as the taxonomy stability check (#82), so a journey can name only what the lock holds.
 */
export function journeyRegistries(data: JourneySourceData): JourneyRegistries {
  const kataPages = new Map<string, { href: string; title: string }>();
  for (const entry of kataCatalog) kataPages.set(entry.metadata.id, { href: entry.href, title: entry.linkLabel });
  for (const recipe of data.recipes) kataPages.set(recipe.id, { href: `/katas/${recipe.slug}`, title: recipe.title });

  const routeTitles = new Map<string, string>();
  for (const entry of KATA_DIRECTORY) routeTitles.set(entry.href, entry.title);
  for (const recipe of data.recipes) routeTitles.set(`/katas/${recipe.slug}`, recipe.title);

  return {
    lock: identifierLock,
    live: liveIdentifiers({ recipes: data.recipes, handWrittenSlugs: data.handWrittenSlugs }),
    ledger: identifierLedger,
    tracks: new Map(data.tracks.map((track) => [track.slug, track.title])),
    kataPages,
    routeTitles,
  };
}
