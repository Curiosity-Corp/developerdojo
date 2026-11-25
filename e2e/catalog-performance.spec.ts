// Measures the resource catalogue as a learner meets it (#113): page load, render work and filter response, at
// full CPU speed and at 4x CPU throttling (a slow phone or old laptop). The numbers go to catalog-metrics/ (see
// catalog-metrics.ts); the accessibility-scan time is recorded per scan part by qa.spec.ts. Nothing here asserts a
// time: timings on a shared runner vary with load, so the test records them and checks only that the page works.
import { expect, test } from '@playwright/test';
import { recordCatalogMetric } from './catalog-metrics';

const ROUTE = '/library/resources';
const ROUNDS = 3;

type CdpMetric = { name: string; value: number };
const pick = (metrics: CdpMetric[], ...names: string[]) =>
  Object.fromEntries(names.map((name) => [name, metrics.find((m) => m.name === name)?.value ?? null]));
const secondsToMs = (value: unknown) => (typeof value === 'number' ? Math.round(value * 1000) : null);

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

    await page.goto(ROUTE);
    await page.waitForLoadState('load');
    await expect(page.locator('#resource-filters')).toBeVisible();
    // Two frames after load: the first paint of the list has happened.
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

    const load = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null;
      const w = window as unknown as { __catalog: { longTasks: number[]; lcp: number } };
      const ms = (value: number | null) => (value === null ? null : Math.round(value));
      return {
        resources: document.querySelectorAll('[data-resource]').length,
        domElements: document.querySelectorAll('*').length,
        htmlTransferBytes: nav.transferSize,
        htmlEncodedBytes: nav.encodedBodySize,
        htmlDecodedBytes: nav.decodedBodySize,
        responseEndMs: ms(nav.responseEnd),
        domInteractiveMs: ms(nav.domInteractive),
        domContentLoadedMs: ms(nav.domContentLoadedEventEnd),
        loadEventMs: ms(nav.loadEventEnd),
        firstContentfulPaintMs: ms(fcp),
        largestContentfulPaintMs: ms(w.__catalog.lcp || null),
        longTasks: w.__catalog.longTasks.length,
        longTaskTotalMs: ms(w.__catalog.longTasks.reduce((sum, d) => sum + d, 0)),
        longestTaskMs: ms(Math.max(0, ...w.__catalog.longTasks)),
        viewport: { width: innerWidth, height: innerHeight },
      };
    });
    const afterLoad = (await cdp.send('Performance.getMetrics')).metrics as CdpMetric[];
    const work = pick(afterLoad, 'TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration', 'Nodes', 'JSHeapUsedSize');
    expect(load.resources).toBeGreaterThan(0);
    recordCatalogMetric('load', testInfo, {
      route: ROUTE,
      cpuThrottle,
      ...load,
      mainThreadMs: {
        task: secondsToMs(work['TaskDuration']),
        script: secondsToMs(work['ScriptDuration']),
        layout: secondsToMs(work['LayoutDuration']),
        styleRecalc: secondsToMs(work['RecalcStyleDuration']),
      },
      domNodes: work['Nodes'],
      jsHeapUsedMiB: typeof work['JSHeapUsedSize'] === 'number' ? Math.round((work['JSHeapUsedSize'] / 2 ** 20) * 10) / 10 : null,
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
