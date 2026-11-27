import { describe, expect, it } from 'vitest';
import { mainThreadBreakdown, type TraceEvent } from '../e2e/main-thread-breakdown';

const URL = 'http://site.example/library/resources/';
const main = { pid: 1, tid: 10 };
const ms = 1000;
const x = (name: string, startMs: number, durMs: number, where = main): TraceEvent => ({ name, ph: 'X', ts: startMs * ms, dur: durMs * ms, ...where });
const mark = (name: string, atMs: number): TraceEvent => ({ name, ph: 'R', ts: atMs * ms, pid: 1, tid: 10 });

describe('main-thread breakdown of a page load', () => {
  it('counts each event once, by its self time, between navigation start and the end of the load event', () => {
    const events: TraceEvent[] = [
      mark('navigationStart', 0),
      // A 100 ms task: 60 ms of parsing, with a 25 ms style recalculation and 5 ms of script nested inside it.
      x('RunTask', 10, 100),
      { name: 'ParseHTML', ph: 'B', ts: 12 * ms, pid: 1, tid: 10, args: { beginData: { url: URL } } },
      x('UpdateLayoutTree', 20, 25),
      x('EvaluateScript', 50, 5),
      { name: 'ParseHTML', ph: 'E', ts: 72 * ms, pid: 1, tid: 10 },
      x('RunTask', 150, 40),
      x('Layout', 151, 30),
      x('Paint', 182, 6),
      // Another thread's work and anything after the load event do not count.
      x('Layout', 150, 500, { pid: 1, tid: 99 }),
      mark('loadEventEnd', 200),
      x('RunTask', 210, 50),
    ];
    expect(mainThreadBreakdown(events, URL)).toEqual({
      windowMs: 200,
      busyMs: 140,
      idleMs: 60,
      parseHtmlMs: 30,
      styleMs: 25,
      layoutMs: 30,
      paintMs: 6,
      scriptMs: 5,
      gcMs: 0,
      // The tasks' own time outside any named event: 100 - 60 = 40 ms, and 40 - 36 = 4 ms.
      otherMs: 44,
    });
  });

  it('fails loudly when the trace does not hold the navigation', () => {
    expect(() => mainThreadBreakdown([mark('navigationStart', 0)], URL)).toThrow(/no ParseHTML/);
    const parseOnly: TraceEvent[] = [{ name: 'ParseHTML', ph: 'X', ts: 5, dur: 5, pid: 1, tid: 10, args: { beginData: { url: URL } } }];
    expect(() => mainThreadBreakdown(parseOnly, URL)).toThrow(/navigationStart or loadEventEnd/);
  });
});
