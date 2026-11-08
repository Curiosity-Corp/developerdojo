import { describe, expect, it } from 'vitest';
import { checkContrast, normalizeHex } from '../src/lib/contrast';

describe('WCAG text colour contrast', () => {
  it('normalizes supported opaque hex colours and rejects other formats', () => {
    expect(normalizeHex(' #AbC ')).toBe('#aabbcc');
    expect(normalizeHex('#ABCDEF')).toBe('#abcdef');
    for (const bad of ['', 'fff', '#12', '#1234', '#12345678', 'red', '#ggg']) expect(normalizeHex(bad)).toBeNull();
  });

  it('calculates known ratios and is symmetric', () => {
    expect(checkContrast('#000', '#fff')?.ratio).toBe(21);
    expect(checkContrast('#fff', '#fff')?.ratio).toBe(1);
    expect(checkContrast('#123456', '#ffffff')?.ratio).toBeCloseTo(checkContrast('#ffffff', '#123456')?.ratio ?? 0, 12);
  });

  it('uses unrounded thresholds for text size', () => {
    const almost = checkContrast('#777', '#fff');
    expect(almost?.ratio).toBeCloseTo(4.478, 3);
    expect(almost?.normalTextPasses).toBe(false);
    expect(almost?.largeTextPasses).toBe(true);
    expect(checkContrast('#767676', '#fff')?.normalTextPasses).toBe(true);
    expect(checkContrast('#aaa', '#fff')?.largeTextPasses).toBe(false);
    expect(checkContrast('#oops', '#fff')).toBeNull();
  });
});
