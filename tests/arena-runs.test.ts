import { describe, expect, it } from 'vitest';
import { parseArenaRuns, sameRubricSize, summarizeArenaRuns } from '../src/lib/arena-runs';

describe('Arena run records', () => {
  it('distinguishes unknown cost and unassessed checks from measured zero', () => {
    const parsed = parseArenaRuns('4,5,,\nNA,NA,,\n0,5,0,0');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.runs[0]).toEqual({ passed: 4, attempted: 5, cost: null, seconds: null });
    expect(parsed.runs[1]).toEqual({ passed: null, attempted: null, cost: null, seconds: null });
    expect(parsed.runs[2]).toEqual({ passed: 0, attempted: 5, cost: 0, seconds: 0 });
    expect(summarizeArenaRuns('A', parsed.runs)).toContain('4/10 checks passed across 2 assessed runs; 1 unassessed');
    expect(summarizeArenaRuns('A', parsed.runs)).toContain('Cost: unknown for 2/3 runs; no average calculated');
  });

  it('averages only complete measurements and keeps small nonzero costs visible', () => {
    const parsed = parseArenaRuns('5,5,0.0000001,0\n4,5,0.0000003,10');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const result = summarizeArenaRuns('B', parsed.runs);
    expect(result).toContain('9/10 checks passed across 2 assessed runs');
    expect(result).toContain('Cost: approximately 2e-7 average per run');
    expect(result).toContain('Seconds: approximately 5 average per run');
  });

  it('rejects malformed, negative, impossible and mixed NA rows', () => {
    for (const value of ['', '1,2,3', '1,NA,,', '-1,5,,', '6,5,,', '0,0,,', '1,2,-1,', '1,2,Infinity,', '1,2,,1e2']) {
      expect(parseArenaRuns(value).ok, value).toBe(false);
    }
    expect(parseArenaRuns('1,2,,\n\nwrong')).toEqual({ ok: false, error: 'Line 3: use four comma-separated fields.' });
    expect(parseArenaRuns(Array(101).fill('NA,NA,,').join('\n')).ok).toBe(false);
  });

  it('does not pool scores with different check counts', () => {
    const a = parseArenaRuns('4,5,,'); const b = parseArenaRuns('4,6,,');
    expect(a.ok && b.ok && sameRubricSize(a.runs, b.runs)).toBe(false);
  });

  it('does not manufacture a score when nothing was assessed', () => {
    const parsed = parseArenaRuns('NA,NA,,');
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(summarizeArenaRuns('A', parsed.runs)).toContain('No checks assessed; 1 unassessed');
  });
});
