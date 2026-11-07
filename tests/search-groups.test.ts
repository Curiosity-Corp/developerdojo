import { describe, expect, it } from 'vitest';
import { classifyUrl } from '../src/lib/search-groups';

describe('classifyUrl', () => {
  it('sorts library URLs into lessons, tracks and resources', () => {
    expect(classifyUrl('/katas/data-rescue/')).toBe('katas');
    expect(classifyUrl('/library/people-write-epics/')).toBe('lessons');
    expect(classifyUrl('/library/tracks/product-discovery/01-talk/')).toBe('lessons');
    expect(classifyUrl('/library/tracks/product-discovery/')).toBe('tracks');
    expect(classifyUrl('/library/resources/#r-anthropic-guide')).toBe('resources');
  });

  it('keeps hub and site pages in "pages"', () => {
    expect(classifyUrl('/katas/')).toBe('pages');
    expect(classifyUrl('/library/')).toBe('pages');
    expect(classifyUrl('/library/tracks/')).toBe('pages');
    expect(classifyUrl('/library/resources/')).toBe('pages');
    expect(classifyUrl('/train/')).toBe('pages');
    expect(classifyUrl('/')).toBe('pages');
  });
});
