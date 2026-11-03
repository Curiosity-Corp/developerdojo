/**
 * Cross-file content checks. Pure functions so the build (Astro collections) and the unit tests
 * (files read from disk) run exactly the same rules.
 */

export interface LessonRef {
  /** Collection id, e.g. "tracks/product-discovery/01-talk-to-customers" or "people-write-epics". */
  id: string;
  track?: string | undefined;
  resources?: readonly string[] | undefined;
  prerequisites?: readonly string[] | undefined;
}

export interface ResourceRef {
  /** "<publisher>/<resource>" */
  id: string;
  url: string;
}

export interface ContentSnapshot {
  lessons: readonly LessonRef[];
  trackIds: readonly string[];
  resources: readonly ResourceRef[];
}

export interface IntegrityReport {
  /** Problems that must fail the build. */
  errors: string[];
  /** Problems worth a console warning that do not break learners (a prerequisite not written yet). */
  warnings: string[];
}

const TRACK_DIR = /^tracks\/([^/]+)\//;

function lessonFile(id: string): string {
  return `src/content/library/${id}.md`;
}

function normaliseUrl(url: string): string {
  return url.replace(/#.*$/, '').replace(/\/+$/, '').toLowerCase();
}

export function checkContent(snapshot: ContentSnapshot): IntegrityReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const tracks = new Set(snapshot.trackIds);
  const resources = new Set(snapshot.resources.map((resource) => resource.id));
  const lessons = new Set(snapshot.lessons.map((lesson) => lesson.id));

  for (const lesson of snapshot.lessons) {
    const file = lessonFile(lesson.id);
    if (lesson.track !== undefined && !tracks.has(lesson.track)) {
      errors.push(
        `${file}: track "${lesson.track}" does not exist. Add src/content/tracks/${lesson.track}.md or fix the track name. Known tracks: ${[...tracks].sort().join(', ') || '(none yet)'}.`,
      );
    }
    const dirTrack = TRACK_DIR.exec(lesson.id)?.[1];
    if (dirTrack !== undefined && lesson.track !== dirTrack) {
      errors.push(
        `${file}: this lesson is in the folder tracks/${dirTrack}/ so its frontmatter needs  track: "${dirTrack}"  (found ${lesson.track === undefined ? 'no track' : `"${lesson.track}"`}).`,
      );
    }
    for (const id of lesson.resources ?? []) {
      if (!resources.has(id)) {
        errors.push(
          `${file}: resource "${id}" does not exist. Add src/content/resources/${id}.yaml or fix the id (it is "<publisher>/<resource>", the file path without .yaml).`,
        );
      }
    }
    for (const slug of lesson.prerequisites ?? []) {
      if (!lessons.has(slug)) {
        warnings.push(`${file}: prerequisite "${slug}" is not a library page (yet). It is left out of the page until it exists.`);
      }
    }
  }

  const byUrl = new Map<string, string>();
  for (const resource of snapshot.resources) {
    const key = normaliseUrl(resource.url);
    const first = byUrl.get(key);
    if (first !== undefined) {
      errors.push(
        `src/content/resources/${resource.id}.yaml: same URL as ${first}. Keep one file per URL and merge the skills lists.`,
      );
    } else {
      byUrl.set(key, `src/content/resources/${resource.id}.yaml`);
    }
  }

  return { errors, warnings };
}

/** Throws one error listing every problem, or logs warnings and returns. */
export function assertContent(snapshot: ContentSnapshot): void {
  const { errors, warnings } = checkContent(snapshot);
  for (const warning of warnings) console.warn(`[content] ${warning}`);
  if (errors.length > 0) {
    throw new Error(
      `Content check failed with ${errors.length} problem${errors.length === 1 ? '' : 's'}:\n` +
        errors.map((message) => `  - ${message}`).join('\n'),
    );
  }
}
