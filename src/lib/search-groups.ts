/** How search results are grouped. Derived from the page URL, so no extra metadata is needed. */
export type SearchGroup = 'lessons' | 'tracks' | 'resources' | 'pages';

export const SEARCH_GROUP_ORDER: readonly SearchGroup[] = ['lessons', 'tracks', 'resources', 'pages'];

export const SEARCH_GROUP_LABELS: Record<SearchGroup, string> = {
  lessons: 'Lessons and guides',
  tracks: 'Tracks',
  resources: 'Learning resources',
  pages: 'Other pages',
};

export function classifyUrl(url: string): SearchGroup {
  const [path = '', hash = ''] = url.split('#');
  const segments = path.split('/').filter((segment) => segment.length > 0);
  if (segments[0] !== 'library') return 'pages';
  if (segments[1] === 'resources') return hash ? 'resources' : 'pages';
  if (segments[1] === 'tracks') {
    if (segments.length === 1 || segments.length === 2) return 'pages';
    return segments.length === 3 ? 'tracks' : 'lessons';
  }
  return segments.length >= 2 ? 'lessons' : 'pages';
}
