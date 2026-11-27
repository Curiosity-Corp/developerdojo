import { describe, expect, it } from 'vitest';
import { mainThreadBreakdown, type TraceEvent } from '../e2e/main-thread-breakdown';

const URL = 'http://site.example/library/resources/';
const main = { pid: 1, tid: 10 };
const ms = 1000;
const x = (name: string, startMs: number, durMs: number, where = main): TraceEvent => ({ name, ph: 'X', ts: startMs * ms, dur: durMs * ms, ...where });
const navigationStart = (atMs: number, url: string, frame: string): TraceEvent => ({
  name: 'navigationStart', ph: 'R', ts: atMs * ms, ...main, args: { frame, data: { documentLoaderURL: url, isLoadingMainFrame: true } },
});
const loadEventEnd = (atMs: number, frame: string): TraceEvent => ({ name: 'loadEventEnd', ph: 'R', ts: atMs * ms, ...main, args: { frame } });

describe('main-thread breakdown of a page load', () => {
  it('counts each event once, by its self time, between the page navigation and its own load event', () => {
    const events: TraceEvent[] = [
      navigationStart(0, URL, 'MAIN'),
      // Another frame (an iframe, or about:blank) has its own marks, which must not end the window.
      navigationStart(5, '', 'OTHER'),
      loadEventEnd(90, 'OTHER'),
      // A 100 ms task: 60 ms of parsing, with a 25 ms style recalculation and 5 ms of script nested inside it.
      x('RunTask', 10, 100),
      { name: 'ParseHTML', ph: 'B', ts: 12 * ms, ...main, args: { beginData: { url: '' } } },
      // Chrome's unnamed internal events inside ParseHTML count as parsing.
      x('HTMLDocumentParser::PumpTokenizer', 13, 40),
      x('UpdateLayoutTree', 20, 25),
      x('EvaluateScript', 50, 5),
      { name: 'ParseHTML', ph: 'E', ts: 72 * ms, ...main },
      x('RunTask', 150, 40),
      x('Layout', 151, 30),
      x('LocalFrameView::performLayout', 152, 28),
      x('Paint', 182, 6),
      // Another thread's work and anything after the load event do not count.
      x('Layout', 150, 500, { pid: 1, tid: 99 }),
      loadEventEnd(200, 'MAIN'),
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
    expect(() => mainThreadBreakdown([navigationStart(0, 'http://other.example/', 'MAIN')], URL)).toThrow(/no navigationStart/);
    expect(() => mainThreadBreakdown([navigationStart(0, URL, 'MAIN'), loadEventEnd(9, 'OTHER')], URL)).toThrow(/no loadEventEnd/);
  });
});
