import { describe, expect, it } from 'vitest';
import {
  ALL_MODULES,
  computeStreak,
  countDone,
  DEVELOPER_MODULES,
  parseState,
  percent,
  toggleModule,
} from '../src/lib/progress';

const noon = (y: number, m: number, d: number): Date => new Date(y, m - 1, d, 12);

describe('progress', () => {
  it('toggles a module on and off', () => {
    const on = toggleModule({ completed: {} }, 'developer-week-1', noon(2026, 3, 5));
    expect(on.completed['developer-week-1']).toBe('2026-03-05');
    expect(toggleModule(on, 'developer-week-1', noon(2026, 3, 5)).completed).toEqual({});
  });

  it('parses stored state defensively', () => {
    expect(parseState(null).completed).toEqual({});
    expect(parseState('not json').completed).toEqual({});
    expect(parseState('{"completed":5}').completed).toEqual({});
    const state = parseState(
      JSON.stringify({ completed: { 'developer-week-1': '2026-03-05', bogus: '2026-03-05', 'developer-week-2': 'x' } }),
    );
    expect(state.completed).toEqual({ 'developer-week-1': '2026-03-05' });
  });

  it('counts a streak of consecutive days, from today or yesterday', () => {
    const state = {
      completed: { 'developer-week-1': '2026-03-03', 'developer-week-2': '2026-03-04', 'developer-week-3': '2026-03-05' },
    };
    expect(computeStreak(state, noon(2026, 3, 5))).toBe(3);
    expect(computeStreak(state, noon(2026, 3, 6))).toBe(3);
    expect(computeStreak(state, noon(2026, 3, 7))).toBe(0);
    expect(computeStreak({ completed: {} }, noon(2026, 3, 7))).toBe(0);
  });

  it('computes percentages and module counts', () => {
    expect(ALL_MODULES).toHaveLength(10);
    expect(countDone({ completed: { 'developer-week-1': '2026-03-05' } }, DEVELOPER_MODULES)).toBe(1);
    expect(percent(3, 6)).toBe(50);
    expect(percent(0, 0)).toBe(0);
  });
});
