import type { CollectionEntry } from 'astro:content';

/** Order in which sections appear on /library. Unknown sections follow, sorted by name. */
export const SECTION_ORDER = [
  'Start here',
  'The Way',
  'Developer path',
  'Master Developer',
  'Standards',
  'Templates',
  'Learning path',
  'Glossary',
] as const;

export interface LibrarySection {
  name: string;
  entries: CollectionEntry<'library'>[];
}

function sectionRank(name: string): number {
  const index = (SECTION_ORDER as readonly string[]).indexOf(name);
  return index === -1 ? SECTION_ORDER.length : index;
}

/** Group entries by section (sections in SECTION_ORDER, entries by order then title). */
export function groupBySection(entries: CollectionEntry<'library'>[]): LibrarySection[] {
  const map = new Map<string, CollectionEntry<'library'>[]>();
  for (const entry of entries) {
    const list = map.get(entry.data.section) ?? [];
    list.push(entry);
    map.set(entry.data.section, list);
  }
  return [...map.entries()]
    .map(([name, list]) => ({
      name,
      entries: [...list].sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title)),
    }))
    .sort((a, b) => sectionRank(a.name) - sectionRank(b.name) || a.name.localeCompare(b.name));
}
