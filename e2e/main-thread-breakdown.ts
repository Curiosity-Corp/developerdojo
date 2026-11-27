// Where a page load spends the renderer's main thread, from a Chrome trace (#113). The Performance-domain counters
// (ScriptDuration, LayoutDuration, ...) leave out HTML parsing and paint and add up across navigations, so they
// cannot say whether a slow load is parsing, style, layout, paint, script or a thread that sits idle. This reads
// the trace events of one navigation instead and splits the main thread's time between navigation start and the
// end of the load event into those buckets. Each event counts only its own (self) time, so nested work, such as
// a style recalculation forced while the parser runs, is counted once, in its own bucket.

export type TraceEvent = {
  name: string;
  ph: string;
  ts: number;
  dur?: number;
  pid: number;
  tid: number;
  args?: Record<string, unknown>;
};

export type MainThreadBreakdown = {
  windowMs: number;
  busyMs: number;
  idleMs: number;
  parseHtmlMs: number;
  styleMs: number;
  layoutMs: number;
  paintMs: number;
  scriptMs: number;
  gcMs: number;
  otherMs: number;
};

const BUCKETS: Record<string, keyof MainThreadBreakdown> = {
  ParseHTML: 'parseHtmlMs',
  // Decoding the response's bytes into text for the parser.
  'DecodedDataDocumentParser::AppendBytes': 'parseHtmlMs',
  UpdateLayoutTree: 'styleMs',
  RecalculateStyles: 'styleMs',
  ParseAuthorStyleSheet: 'styleMs',
  Layout: 'layoutMs',
  PrePaint: 'paintMs',
  Paint: 'paintMs',
  PaintImage: 'paintMs',
  Layerize: 'paintMs',
  UpdateLayer: 'paintMs',
  UpdateLayerTree: 'paintMs',
  CompositeLayers: 'paintMs',
  Commit: 'paintMs',
  EvaluateScript: 'scriptMs',
  FunctionCall: 'scriptMs',
  EventDispatch: 'scriptMs',
  TimerFire: 'scriptMs',
  FireAnimationFrame: 'scriptMs',
  RunMicrotasks: 'scriptMs',
  CompileScript: 'scriptMs',
  'v8.compile': 'scriptMs',
  'v8.compileModule': 'scriptMs',
  'v8.evaluateModule': 'scriptMs',
  'v8.run': 'scriptMs',
  MinorGC: 'gcMs',
  MajorGC: 'gcMs',
  BlinkGC: 'gcMs',
};

type Interval = { name: string; start: number; end: number };

// Complete ('X') events carry their duration; begin/end ('B'/'E') pairs are matched per thread, last opened first.
function intervals(events: TraceEvent[]): Interval[] {
  const out: Interval[] = [];
  const open: TraceEvent[] = [];
  for (const event of [...events].sort((a, b) => a.ts - b.ts)) {
    if (event.ph === 'X' && typeof event.dur === 'number') out.push({ name: event.name, start: event.ts, end: event.ts + event.dur });
    else if (event.ph === 'B') open.push(event);
    else if (event.ph === 'E') {
      const index = open.map((e) => e.name).lastIndexOf(event.name);
      const begin = index >= 0 ? open.splice(index, 1)[0] : undefined;
      if (begin) out.push({ name: begin.name, start: begin.ts, end: event.ts });
    }
  }
  return out;
}

/**
 * Splits the main thread of the page that navigated to `url`, from its `navigationStart` to its own frame's
 * `loadEventEnd`. Other frames' marks are ignored. Time inside an event this file does not name (Chrome nests many
 * internal events, such as HTMLDocumentParser::PumpTokenizer under ParseHTML) counts toward its nearest named
 * ancestor, so it is not lost to "other". Throws when the trace does not hold that navigation, so a broken
 * measurement fails loudly instead of reporting 0.
 */
export function mainThreadBreakdown(events: TraceEvent[], url: string): MainThreadBreakdown {
  const data = (event: TraceEvent) => (event.args?.['data'] ?? {}) as Record<string, unknown>;
  const navigation = events.find((e) => e.name === 'navigationStart' && data(e)['documentLoaderURL'] === url);
  if (!navigation) throw new Error(`the trace has no navigationStart for ${url}`);
  const frame = navigation.args?.['frame'];
  const loaded = events
    .filter((e) => e.name === 'loadEventEnd' && e.args?.['frame'] === frame && e.ts >= navigation.ts)
    .sort((a, b) => a.ts - b.ts)[0];
  if (!loaded) throw new Error(`the trace has no loadEventEnd for the frame that loaded ${url}`);
  const start = navigation.ts;
  const end = loaded.ts;
  const thread = events.filter((e) => e.pid === navigation.pid && e.tid === navigation.tid);

  // Events that start inside the window; nesting is resolved per event, so each microsecond is counted once.
  const inWindow = intervals(thread)
    .filter((i) => i.start >= start && i.start < end && i.end > i.start)
    .sort((a, b) => a.start - b.start || b.end - a.end);
  const totals: MainThreadBreakdown = {
    windowMs: 0, busyMs: 0, idleMs: 0, parseHtmlMs: 0, styleMs: 0, layoutMs: 0, paintMs: 0, scriptMs: 0, gcMs: 0, otherMs: 0,
  };
  type Frame = { interval: Interval; childTime: number; bucket: keyof MainThreadBreakdown };
  const stack: Frame[] = [];
  const closeUntil = (time: number) => {
    for (let top = stack.at(-1); top && top.interval.end <= time; top = stack.at(-1)) {
      stack.pop();
      totals[top.bucket] += Math.max(0, top.interval.end - top.interval.start - top.childTime);
    }
  };
  for (const interval of inWindow) {
    closeUntil(interval.start);
    const parent = stack.at(-1);
    if (parent) parent.childTime += interval.end - interval.start;
    // Busy time is clipped to the window: a task still running at the load event counts only up to it.
    else totals.busyMs += Math.min(interval.end, end) - interval.start;
    stack.push({ interval, childTime: 0, bucket: BUCKETS[interval.name] ?? parent?.bucket ?? 'otherMs' });
  }
  closeUntil(Number.POSITIVE_INFINITY);

  totals.windowMs = end - start;
  totals.idleMs = Math.max(0, totals.windowMs - totals.busyMs);
  // Trace times are microseconds: report whole milliseconds.
  for (const key of Object.keys(totals) as (keyof MainThreadBreakdown)[]) totals[key] = Math.round(totals[key] / 1000);
  return totals;
}
