/**
 * Which track lessons the learner marked done. Pure functions, no DOM.
 * Saved on this device only (see storage.ts), under the name "lessons".
 */

export const LESSON_PROGRESS_NAME = 'lessons';
export const LESSON_PROGRESS_VERSION = 1;

/** Lesson id (the library entry id) -> local calendar day (YYYY-MM-DD) it was marked done. */
export interface LessonProgress {
  done: Record<string, string>;
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const MAX_LESSONS = 2000;

export function emptyLessonProgress(): LessonProgress {
  return { done: {} };
}

/** Accepts anything; keeps only well formed entries. */
export function parseLessonProgress(data: unknown): LessonProgress {
  if (typeof data !== 'object' || data === null) return emptyLessonProgress();
  const source = (data as { done?: unknown }).done;
  if (typeof source !== 'object' || source === null || Array.isArray(source)) return emptyLessonProgress();
  const done: Record<string, string> = {};
  for (const [id, day] of Object.entries(source).slice(0, MAX_LESSONS)) {
    if (id.length > 0 && id.length <= 200 && typeof day === 'string' && DAY.test(day)) done[id] = day;
  }
  return { done };
}

export function localDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function toggleLesson(progress: LessonProgress, id: string, now: Date): LessonProgress {
  const done = { ...progress.done };
  if (done[id]) delete done[id];
  else done[id] = localDay(now);
  return { done };
}

/** How many of these lesson ids are marked done. Ids that are not in the list are ignored. */
export function countLessonsDone(progress: LessonProgress, ids: readonly string[]): number {
  return ids.filter((id) => Boolean(progress.done[id])).length;
}
