import { getCollection, type CollectionEntry } from 'astro:content';
import { assertContent } from './content-integrity';

export type Lesson = CollectionEntry<'library'>;
export type Track = CollectionEntry<'tracks'>;
export type Resource = CollectionEntry<'resources'>;

export interface Content {
  lessons: Lesson[];
  tracks: Track[];
  resources: Resource[];
}

let cached: Promise<Content> | undefined;

/** Loads the three collections once per build and fails the build when a reference does not resolve. */
export function loadContent(): Promise<Content> {
  cached ??= (async () => {
    const [lessons, tracks, resources] = await Promise.all([
      getCollection('library'),
      getCollection('tracks'),
      getCollection('resources'),
    ]);
    assertContent({
      lessons: lessons.map((entry) => ({
        id: entry.id,
        track: entry.data.track,
        resources: entry.data.resources,
        prerequisites: entry.data.prerequisites,
      })),
      trackIds: tracks.map((entry) => entry.id),
      resources: resources.map((entry) => ({ id: entry.id, url: entry.data.url })),
    });
    return { lessons, tracks, resources };
  })();
  return cached;
}

/** Lessons of one track in reading order. */
export function lessonsOfTrack(lessons: readonly Lesson[], trackId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.data.track === trackId)
    .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}
