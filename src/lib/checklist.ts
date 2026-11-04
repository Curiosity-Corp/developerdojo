/**
 * Saved ticks for the checklists in lessons and weekly pages. Pure functions, no DOM.
 * An item is identified by a short hash of its heading and text, not by its position, so a small
 * edit elsewhere on the page does not move the learner's ticks onto other items.
 */

export const CHECKLIST_VERSION = 1;

export function checklistName(pageId: string): string {
  return `checklist:${pageId}`;
}

/** FNV-1a, 32 bit, as 8 hex characters. Not a security feature, only a stable short id. */
export function itemKey(heading: string, text: string): string {
  const tidy = (value: string): string => value.replace(/\s+/g, ' ').trim().toLowerCase();
  const clean = `${tidy(heading)}|${tidy(text)}`;
  let hash = 0x811c9dc5;
  for (let index = 0; index < clean.length; index += 1) {
    hash ^= clean.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

export interface ChecklistState {
  ticked: string[];
}

const KEY = /^[0-9a-f]{8}$/;
const MAX_ITEMS = 1000;

export function parseChecklist(data: unknown): ChecklistState {
  if (typeof data !== 'object' || data === null) return { ticked: [] };
  const source = (data as { ticked?: unknown }).ticked;
  if (!Array.isArray(source)) return { ticked: [] };
  const ticked = [...new Set(source.filter((entry): entry is string => typeof entry === 'string' && KEY.test(entry)))];
  return { ticked: ticked.slice(0, MAX_ITEMS) };
}

export function setTicked(state: ChecklistState, key: string, on: boolean): ChecklistState {
  const without = state.ticked.filter((entry) => entry !== key);
  return { ticked: on ? [...without, key] : without };
}

export interface ChecklistItem {
  key: string;
  text: string;
}

export interface ChecklistGroup {
  heading: string;
  items: ChecklistItem[];
}

export function countTicked(state: ChecklistState, keys: readonly string[]): number {
  const ticked = new Set(state.ticked);
  return keys.filter((key) => ticked.has(key)).length;
}

/** A Markdown copy of the checklist, with the learner's ticks, to paste into their own repository. */
export function renderChecklistMarkdown(title: string, groups: readonly ChecklistGroup[], state: ChecklistState, today: string): string {
  const ticked = new Set(state.ticked);
  const lines = [`# ${title}`, '', `My copy of this checklist from developerdojo.org, saved on ${today}.`, ''];
  for (const group of groups) {
    if (group.items.length === 0) continue;
    const done = group.items.filter((item) => ticked.has(item.key)).length;
    lines.push(`## ${group.heading}`, '', `${done} of ${group.items.length} done.`, '');
    for (const item of group.items) {
      lines.push(`- [${ticked.has(item.key) ? 'x' : ' '}] ${item.text}`);
    }
    lines.push('');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}
