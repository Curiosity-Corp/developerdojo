// Measures the resource catalogue as a learner meets it (#113): page load, render work and filter response, at
// full CPU speed and at 4x CPU throttling (a slow phone or old laptop). The numbers go to catalog-metrics/ (see
// catalog-metrics.ts); the accessibility-scan time is recorded per scan part by qa.spec.ts. Nothing here asserts a
// time: timings on a shared runner vary with load, so the test records them and checks only that the page works.
import { expect, test } from '@playwright/test';
import { recordCatalogMetric } from './catalog-metrics';
import { mainThreadBreakdown, type MainThreadBreakdown, type TraceEvent } from './main-thread-breakdown';

const ROUTE = '/library/resources';
const ROUNDS = 3;
// Fresh loads per test: one sample on a shared runner is mostly noise, so the record keeps every sample and the median.
const LOAD_SAMPLES = 3;
const TRACE_CATEGORIES = ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'blink.user_timing', 'v8', 'blink'];

const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)] ?? 0;
const medianOf = <T extends Record<string, number | null>>(samples: T[]): T =>
  Object.fromEntries(
    Object.keys(samples[0] ?? {}).map((key) => {
      const values = samples.map((sample) => sample[key]).filter((v): v is number => typeof v === 'number');
      return [key, values.length === samples.length ? median(values) : null];
    }),
  ) as T;

type CdpMetric = { name: string; value: number };
const pick = (metrics: CdpMetric[], ...names: string[]) =>
  Object.fromEntries(names.map((name) => [name, metrics.find((m) => m.name === name)?.value ?? null]));

for (const cpuThrottle of [1, 4]) {
  test(`the resource catalogue loads and filters (CPU ${cpuThrottle}x)`, async ({ page, browserName }, testInfo) => {
    test.skip(browserName !== 'chromium', 'CPU throttling and render metrics need the Chrome DevTools Protocol');
    test.slow();
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpuThrottle });
    await cdp.send('Performance.enable');
    // Buffered observers record what happened before the test could ask: long tasks and the largest paint.
    await page.addInitScript(() => {
      const w = window as unknown as { __catalog: { longTasks: number[]; lcp: number } };
      w.__catalog = { longTasks: [], lcp: 0 };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) w.__catalog.longTasks.push(entry.duration);
      }).observe({ type: 'longtask', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) w.__catalog.lcp = entry.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });

    const browser = page.context().browser();
    if (!browser) throw new Error('the test needs a browser it can trace');
    type LoadSample = Record<string, number | null>;
    const samples: LoadSample[] = [];
    const breakdowns: MainThreadBreakdown[] = [];
    let page0: Record<string, unknown> = {};
    for (let sample = 0; sample < LOAD_SAMPLES; sample += 1) {
      await browser.startTracing(page, { categories: TRACE_CATEGORIES });
      await page.goto(ROUTE);
      await page.waitForLoadState('load');
      await expect(page.locator('#resource-filters')).toBeVisible();
      // Two frames after load: the first paint of the list has happened.
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const trace = JSON.parse((await browser.stopTracing()).toString('utf8')) as { traceEvents: TraceEvent[] };
      breakdowns.push(mainThreadBreakdown(trace.traceEvents, page.url()));

      const measured = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null;
        const w = window as unknown as { __catalog: { longTasks: number[]; lcp: number } };
        const ms = (value: number | null) => (value === null ? null : Math.round(value));
        return {
          page: {
            resources: document.querySelectorAll('[data-resource]').length,
            domElements: document.querySelectorAll('*').length,
            htmlTransferBytes: nav.transferSize,
            htmlEncodedBytes: nav.encodedBodySize,
            htmlDecodedBytes: nav.decodedBodySize,
            viewport: { width: innerWidth, height: innerHeight },
          },
          timing: {
            responseEndMs: ms(nav.responseEnd),
            domInteractiveMs: ms(nav.domInteractive),
            domContentLoadedMs: ms(nav.domContentLoadedEventEnd),
            loadEventMs: ms(nav.loadEventEnd),
            firstContentfulPaintMs: ms(fcp),
            largestContentfulPaintMs: ms(w.__catalog.lcp || null),
            longTasks: w.__catalog.longTasks.length,
            longTaskTotalMs: ms(w.__catalog.longTasks.reduce((sum, d) => sum + d, 0)),
            longestTaskMs: ms(Math.max(0, ...w.__catalog.longTasks)),
          },
        };
      });
      page0 = measured.page;
      samples.push(measured.timing);
    }
    const load = { ...page0, ...medianOf(samples) } as { resources: number } & LoadSample;
    const breakdown = medianOf(breakdowns as unknown as Record<string, number>[]) as unknown as MainThreadBreakdown;
    expect(load.resources).toBeGreaterThan(0);
    recordCatalogMetric('load', testInfo, {
      route: ROUTE,
      cpuThrottle,
      loadSamples: LOAD_SAMPLES,
      ...load,
      // Median self time per kind of work on the main thread, navigation start to load event end (main-thread-breakdown.ts).
      mainThreadMs: {
        task: breakdown.busyMs,
        idle: breakdown.idleMs,
        parseHtml: breakdown.parseHtmlMs,
        script: breakdown.scriptMs,
        layout: breakdown.layoutMs,
        styleRecalc: breakdown.styleMs,
        paint: breakdown.paintMs,
        gc: breakdown.gcMs,
        other: breakdown.otherMs,
      },
      samples: samples.map((timing, index) => ({ ...timing, mainThreadMs: breakdowns[index] })),
    });

    // Filter response, timed in the page from the change to the next painted frame, so test-runner round trips
    // do not count. Each round filters by one provider, then clears the filter.
    const before = pick((await cdp.send('Performance.getMetrics')).metrics as CdpMetric[], 'LayoutDuration', 'RecalcStyleDuration', 'ScriptDuration');
    const interaction = await page.evaluate(async (rounds) => {
      const select = document.querySelector<HTMLSelectElement>('#resource-filters select[name="provider"]');
      const status = document.getElementById('resource-status');
      if (!select || !status) throw new Error('the provider filter or the status line is missing');
      const nextPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
      const timeChange = async (value: string) => {
        const started = performance.now();
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        await nextPaint();
        return performance.now() - started;
      };
      const providers = Array.from(select.options).map((o) => o.value).filter((v) => v !== '');
      const filter: number[] = [];
      const clear: number[] = [];
      for (let i = 0; i < rounds; i += 1) {
        filter.push(await timeChange(providers[i % providers.length] ?? ''));
        clear.push(await timeChange(''));
      }
      const median = (values: number[]) => Math.round([...values].sort((a, b) => a - b)[Math.floor(values.length / 2)] ?? 0);
      return { rounds, filterToPaintMs: median(filter), clearToPaintMs: median(clear), status: status.textContent };
    }, ROUNDS);
    const after = pick((await cdp.send('Performance.getMetrics')).metrics as CdpMetric[], 'LayoutDuration', 'RecalcStyleDuration', 'ScriptDuration');
    const delta = (name: string) => {
      const a = after[name];
      const b = before[name];
      return typeof a === 'number' && typeof b === 'number' ? Math.round(((a - b) * 1000) / (2 * ROUNDS)) : null;
    };
    expect(interaction.status).toBe(`${load.resources} resources`);
    recordCatalogMetric('interaction', testInfo, {
      route: ROUTE,
      cpuThrottle,
      resources: load.resources,
      filter: 'provider',
      ...interaction,
      perChangeMainThreadMs: { script: delta('ScriptDuration'), layout: delta('LayoutDuration'), styleRecalc: delta('RecalcStyleDuration') },
    });
  });
}
