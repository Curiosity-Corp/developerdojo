/** Reading speed used for the "min read" estimate: a careful pace for second-language readers. */
export const WORDS_PER_MINUTE = 180;

/** Words a reader will actually read: markdown with code blocks, html tags and link targets removed. */
export function countWords(markdown: string): number {
  const text = markdown
    .replace(/^---[\s\S]*?\n---/, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|~-]+/g, ' ');
  return text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

/** Whole minutes, never less than 1. */
export function readingMinutes(markdown: string): number {
  return Math.max(1, Math.ceil(countWords(markdown) / WORDS_PER_MINUTE));
}

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

/** Headings shown in the on-page table of contents: h2 and h3 only. */
export function tocHeadings(headings: readonly Heading[]): Heading[] {
  return headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
}

/** Anchor of a section on the library index, e.g. "Developer path" becomes "section-developer-path". */
export function sectionAnchor(section: string): string {
  return `section-${section.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export interface Neighbour {
  id: string;
  title: string;
}

/** Previous and next entry around `id` in an ordered list. */
export function neighbours<T extends { id: string }>(
  ordered: readonly T[],
  id: string,
  toNeighbour: (entry: T) => Neighbour,
): { previous?: Neighbour; next?: Neighbour } {
  const index = ordered.findIndex((entry) => entry.id === id);
  const result: { previous?: Neighbour; next?: Neighbour } = {};
  const before = index > 0 ? ordered[index - 1] : undefined;
  const after = index >= 0 ? ordered[index + 1] : undefined;
  if (before) result.previous = toNeighbour(before);
  if (after) result.next = toNeighbour(after);
  return result;
}
