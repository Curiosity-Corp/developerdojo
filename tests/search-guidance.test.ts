import { describe, expect, it } from 'vitest';
import { correctSearch, isOneEditAway, relatedSearches } from '../src/lib/search-guidance';

describe('search suggestions', () => {
  it('offers related searches without inventing results', () => {
    expect(relatedSearches('Canva design')).toContain('UX');
    expect(relatedSearches('3D BIM')).toContain('construction');
    expect(relatedSearches('elevenlabs')).toContain('voice');
    expect(relatedSearches('totally unrelated')).toEqual([]);
  });

  it('detects one insertion, deletion, substitution or adjacent transposition', () => {
    expect(isOneEditAway('kubernetez', 'kubernetes')).toBe(true);
    expect(isOneEditAway('kubernets', 'kubernetes')).toBe(true);
    expect(isOneEditAway('kubernetees', 'kubernetes')).toBe(true);
    expect(isOneEditAway('kubernetse', 'kubernetes')).toBe(true);
    expect(isOneEditAway('kubernetes', 'kubernetes')).toBe(false);
    expect(isOneEditAway('kubernzzz', 'kubernetes')).toBe(false);
  });

  it('corrects long unknown words only against the actual vocabulary', () => {
    const vocabulary = ['kubernetes', 'construction', 'voice'];
    expect(correctSearch('kubernetez', vocabulary)).toBe('kubernetes');
    expect(correctSearch('learn construcion', vocabulary)).toBe('learn construction');
    expect(correctSearch('kubernetes', vocabulary)).toBeNull();
    expect(correctSearch('cli 3D', vocabulary)).toBeNull();
    expect(correctSearch('zzzzzzzzz7', vocabulary)).toBeNull();
  });
});
