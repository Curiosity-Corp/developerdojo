import { describe, expect, it } from 'vitest';
import { countWords, neighbours, readingMinutes, sectionAnchor, tocHeadings } from '../src/lib/lesson';

describe('countWords', () => {
  it('ignores frontmatter, code blocks, html and link targets', () => {
    const md = '---\ntitle: x\n---\n# Hello world\n\n```ts\nconst a = 1;\n```\n\nSee [the guide](https://example.org/a/very/long/url) now <br> ok';
    // Hello world / See the guide now / ok
    expect(countWords(md)).toBe(7);
  });

  it('does not count markdown symbols as words', () => {
    expect(countWords('- item one\n- item two\n\n| a | b |\n| - | - |')).toBe(6);
  });
});

describe('readingMinutes', () => {
  it('is at least one minute', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes('short')).toBe(1);
  });

  it('rounds up at 180 words a minute', () => {
    expect(readingMinutes('word '.repeat(180))).toBe(1);
    expect(readingMinutes('word '.repeat(181))).toBe(2);
    expect(readingMinutes('word '.repeat(2700))).toBe(15);
  });
});

describe('tocHeadings', () => {
  it('keeps h2 and h3 only', () => {
    const headings = [1, 2, 3, 4].map((depth) => ({ depth, slug: `h${depth}`, text: `H${depth}` }));
    expect(tocHeadings(headings).map((h) => h.depth)).toEqual([2, 3]);
  });
});

describe('sectionAnchor', () => {
  it('matches the anchors on the library index', () => {
    expect(sectionAnchor('Developer path')).toBe('section-developer-path');
    expect(sectionAnchor('Working with AI agents')).toBe('section-working-with-ai-agents');
  });
});

describe('neighbours', () => {
  const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const label = (entry: { id: string }) => ({ id: entry.id, title: entry.id.toUpperCase() });

  it('finds both neighbours in the middle', () => {
    expect(neighbours(list, 'b', label)).toEqual({ previous: { id: 'a', title: 'A' }, next: { id: 'c', title: 'C' } });
  });
  it('has no previous at the start and no next at the end', () => {
    expect(neighbours(list, 'a', label)).toEqual({ next: { id: 'b', title: 'B' } });
    expect(neighbours(list, 'c', label)).toEqual({ previous: { id: 'b', title: 'B' } });
  });
  it('returns nothing for an unknown id', () => {
    expect(neighbours(list, 'z', label)).toEqual({});
  });
});
