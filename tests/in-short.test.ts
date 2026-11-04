import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Plain-English summary box (issue #54). Every track overview that has an `## In short` section must keep it:
 *   - at the top of the page body, before every other `##` heading;
 *   - 100 to 150 words of summary text (the key word list is not counted);
 *   - sentences under 15 words, in the summary and in the key word meanings;
 *   - at most six key words, each written exactly as in the glossary.
 * A track without the section is skipped, so the box can be added one group of tracks at a time.
 */

const root = join(import.meta.dirname, '..');
const trackDir = join(root, 'src', 'content', 'tracks');
const glossaryFile = join(root, 'src', 'content', 'library', 'glossary.md');

const MIN_WORDS = 100;
const MAX_WORDS = 150;
const MAX_SENTENCE_WORDS = 14;
const MAX_KEY_WORDS = 6;

/** Words as a reader counts them: link text counts, link addresses and emphasis marks do not. */
function words(text: string): string[] {
  const plain = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*`_]/g, '');
  return plain.match(/\S+/g) ?? [];
}

function sentences(text: string): string[] {
  return text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.length > 0);
}

function body(file: string): string {
  const text = readFileSync(file, 'utf8');
  const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(text);
  return match ? text.slice(match[0].length) : text;
}

/** Glossary entries look like `**Term.** Meaning.` Returns term to meaning. */
function glossary(): Map<string, string> {
  const entries = new Map<string, string>();
  for (const line of readFileSync(glossaryFile, 'utf8').split(/\r?\n/)) {
    const match = /^\*\*(.+?)\.\*\* (.+)$/.exec(line);
    if (match?.[1] && match[2]) entries.set(match[1], match[2].trim());
  }
  return entries;
}

const glossaryEntries = glossary();

const libraryDir = join(root, 'src', 'content', 'library');

/** Program pages outside the tracks folder that also carry the box (issue #75). */
const PROGRAM_PAGES = ['the-way-five-rules'];

const tracks = [
  ...readdirSync(trackDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => ({ slug: f.replace(/\.md$/, ''), text: body(join(trackDir, f)) })),
  ...PROGRAM_PAGES.map((slug) => ({ slug, text: body(join(libraryDir, `${slug}.md`)) })),
];

interface Summary {
  prose: string;
  keyWords: { term: string; meaning: string }[];
  keyWordsHeading: boolean;
}

/** Splits the `## In short` section into the summary text and the key word list. */
function summaryOf(text: string): Summary | undefined {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === '## In short');
  if (start === -1) return undefined;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^## /.test(line));
  const section = end === -1 ? rest : rest.slice(0, end);
  const keyStart = section.findIndex((line) => line.trim() === '### Key words');
  const proseLines = keyStart === -1 ? section : section.slice(0, keyStart);
  const keyLines = keyStart === -1 ? [] : section.slice(keyStart + 1);
  const keyWords = keyLines
    .filter((line) => line.startsWith('- '))
    .map((line) => {
      const match = /^- \*\*(.+?):\*\* (.+)$/.exec(line);
      return { term: match?.[1] ?? line, meaning: match?.[2]?.trim() ?? '' };
    });
  return { prose: proseLines.join('\n').trim(), keyWords, keyWordsHeading: keyStart !== -1 };
}

const withSummary = tracks.filter((track) => /^## In short\s*$/m.test(track.text));

describe('In short boxes on track overviews', () => {
  it('exist on at least one track, so these checks are not empty', () => {
    expect(withSummary.length).toBeGreaterThan(0);
  });

  it('exist on every listed program page', () => {
    const missing = PROGRAM_PAGES.filter((slug) => !withSummary.some((track) => track.slug === slug));
    expect(missing).toEqual([]);
  });

  for (const track of withSummary) {
    describe(track.slug, () => {
      const summary = summaryOf(track.text);

      it('is the first section, with one h2 of this name and no h1 in the body', () => {
        const headings = track.text.split(/\r?\n/).filter((line) => /^#{1,6} /.test(line));
        expect(headings[0]).toBe('## In short');
        expect(headings.filter((h) => h === '## In short')).toHaveLength(1);
        expect(headings.filter((h) => /^# /.test(h))).toHaveLength(0);
        // The key words are an h3 inside the box, so no heading level is skipped.
        expect(headings[1]).toBe('### Key words');
        expect(track.text.trimStart().startsWith('## In short')).toBe(true);
      });

      it(`has ${MIN_WORDS} to ${MAX_WORDS} words of summary`, () => {
        const count = words(summary?.prose ?? '').length;
        expect(count, `${track.slug} has ${count} words`).toBeGreaterThanOrEqual(MIN_WORDS);
        expect(count, `${track.slug} has ${count} words`).toBeLessThanOrEqual(MAX_WORDS);
      });

      it(`keeps every sentence under ${MAX_SENTENCE_WORDS + 1} words`, () => {
        const texts = [summary?.prose ?? '', ...(summary?.keyWords.map((k) => k.meaning) ?? [])];
        for (const sentence of texts.flatMap(sentences)) {
          expect(words(sentence).length, `"${sentence}"`).toBeLessThanOrEqual(MAX_SENTENCE_WORDS);
        }
      });

      it(`lists 1 to ${MAX_KEY_WORDS} key words under a Key words heading`, () => {
        expect(summary?.keyWordsHeading).toBe(true);
        expect(summary?.keyWords.length).toBeGreaterThanOrEqual(1);
        expect(summary?.keyWords.length).toBeLessThanOrEqual(MAX_KEY_WORDS);
      });

      it('writes each key word exactly as the glossary does', () => {
        for (const { term, meaning } of summary?.keyWords ?? []) {
          const entry = glossaryEntries.get(term);
          expect(entry, `"${term}" is not in the glossary`).toBeDefined();
          const first = entry ? (sentences(entry)[0] ?? entry) : '';
          const ok = meaning === entry || meaning === first;
          expect(ok, `"${term}" meaning differs from the glossary`).toBe(true);
        }
      });
    });
  }
});
