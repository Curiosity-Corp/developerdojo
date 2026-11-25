// Measures site search start-up as a learner meets it (#112): from opening the header search to the first result,
// at full CPU speed and at 4x CPU throttling (a slow phone or old laptop), on the desktop and mobile projects.
// The search code marks each start-up stage (search:* User Timing marks in SearchPanel.astro), so a slow cold
// search can be split into module load, index init, the query itself and the first result preview. Records go to
// catalog-metrics/ (see catalog-metrics.ts) and the e2e:report table. Timings on a shared runner vary with load,
// so nothing here asserts a time; the test asserts the real search result, as search.spec.ts does.
import { expect, test } from '@playwright/test';
import { recordCatalogMetric } from './catalog-metrics';

type CdpMetric = { name: string; value: number };
const scriptSeconds = (metrics: CdpMetric[]) => metrics.find((m) => m.name === 'ScriptDuration')?.value ?? 0;

// Read in the page: the stage marks after `since`, the Pagefind requests and the long tasks in that window.
function stagesSince(since: number) {
  const first = (name: string) => performance.getEntriesByName(`search:${name}`).find((e) => e.startTime >= since)?.startTime ?? null;
  const all = (name: string) => performance.getEntriesByName(`search:${name}`);
  const loadStart = all('load-start')[0]?.startTime ?? null;
  const moduleReady = all('module-ready')[0]?.startTime ?? null;
  const initReady = all('init-ready')[0]?.startTime ?? null;
  const queryStart = first('query-start');
  const apiReady = first('query-api-ready');
  const searched = first('query-searched');
  const result = first('query-result');
  const gap = (a: number | null, b: number | null) => (a === null || b === null ? null : Math.round(b - a));
  const end = result ?? performance.now();
  const kinds = new Map<string, { requests: number; transferBytes: number; decodedBytes: number; slowestMs: number }>();
  for (const entry of performance.getEntriesByType('resource') as PerformanceResourceTiming[]) {
    const path = new URL(entry.name).pathname;
    if (!path.startsWith('/pagefind/') || entry.startTime < (loadStart ?? since)) continue;
    const kind = path.endsWith('.js') ? 'module' : path.endsWith('pagefind-entry.json') ? 'entry'
      : path.includes('/fragment/') ? 'fragment' : path.includes('/index/') ? 'index'
      : path.includes('wasm') ? 'wasm' : path.endsWith('.pf_meta') ? 'meta' : 'other';
    const item = kinds.get(kind) ?? { requests: 0, transferBytes: 0, decodedBytes: 0, slowestMs: 0 };
    item.requests += 1;
    item.transferBytes += entry.transferSize;
    item.decodedBytes += entry.decodedBodySize;
    item.slowestMs = Math.max(item.slowestMs, Math.round(entry.duration));
    kinds.set(kind, item);
  }
  const w = window as unknown as { __search: { longTasks: { start: number; duration: number }[] } };
  const windowStart = Math.min(loadStart ?? since, since);
  const tasks = w.__search.longTasks.filter((t) => t.start >= windowStart && t.start <= end);
  return {
    stagesMs: {
      openToLoadStart: gap(since, loadStart),
      moduleImport: gap(loadStart, moduleReady),
      indexInit: gap(moduleReady, initReady),
      queryToApiReady: gap(queryStart, apiReady),
      queryToSearched: gap(queryStart, searched),
      queryToFirstResult: gap(queryStart, result),
    },
    pagefindRequests: Object.fromEntries(kinds),
    longTasks: tasks.length,
    longTaskTotalMs: Math.round(tasks.reduce((sum, t) => sum + t.duration, 0)),
    longestTaskMs: Math.round(Math.max(0, ...tasks.map((t) => t.duration))),
  };
}

// Slow 4G as Chrome DevTools defines it: 150 ms latency, 1.6 Mbit/s down, 750 kbit/s up. A cold search is a chain
// of dependent requests (module, entry, WASM and metadata, index chunk, fragments), so latency adds up per link.
const SLOW_4G = { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 };
const RUNS = [
  { cpuThrottle: 1, network: 'unthrottled' },
  { cpuThrottle: 4, network: 'unthrottled' },
  { cpuThrottle: 4, network: 'slow 4G' },
] as const;

for (const { cpuThrottle, network } of RUNS) {
  const title = network === 'unthrottled' ? `CPU ${cpuThrottle}x` : `CPU ${cpuThrottle}x, ${network}`;
  test(`header search starts and shows a result (${title})`, async ({ page, browserName, isMobile }, testInfo) => {
    test.skip(browserName !== 'chromium', 'CPU throttling needs the Chrome DevTools Protocol');
    test.slow();
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpuThrottle });
    await cdp.send('Performance.enable');
    if (network === 'slow 4G') {
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', SLOW_4G);
    }
    await page.addInitScript(() => {
      // The home page loads more than the default 250 resources; keep room for every Pagefind request.
      performance.setResourceTimingBufferSize(2000);
      const w = window as unknown as { __search: { longTasks: { start: number; duration: number }[] } };
      w.__search = { longTasks: [] };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) w.__search.longTasks.push({ start: entry.startTime, duration: entry.duration });
      }).observe({ type: 'longtask', buffered: true });
    });

    await page.goto('/');
    await page.waitForLoadState('load');
    const pageLoad = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return { domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd), loadEventMs: Math.round(nav.loadEventEnd) };
    });

    // Cold: a fresh browser context, so nothing from Pagefind is cached or initialised yet.
    const panel = page.getByRole('dialog', { name: 'Search' });
    const box = panel.getByRole('searchbox');
    const status = panel.getByRole('status');
    const opened = await page.evaluate(() => performance.now());
    await page.getByRole('button', { name: 'Search', exact: true }).locator('visible=true').click();
    await expect(panel).toBeVisible();
    const scriptBefore = scriptSeconds((await cdp.send('Performance.getMetrics')).metrics as CdpMetric[]);
    const coldAt = Date.now();
    await box.fill('orbital');
    await expect(status).toContainText(/\d+ results? for "orbital"/, { timeout: 30_000 });
    await expect(panel.getByRole('link', { name: /ORBITAL: objective, resources and budget/ }).first()).toBeVisible({ timeout: 30_000 });
    const coldWallMs = Date.now() - coldAt;
    const scriptAfter = scriptSeconds((await cdp.send('Performance.getMetrics')).metrics as CdpMetric[]);
    const cold = await page.evaluate(stagesSince, opened);

    // Warm: the same page, a new term; the module and index are already loaded.
    await box.fill('');
    await expect(status).toHaveText('');
    const warmFrom = await page.evaluate(() => performance.now());
    const warmAt = Date.now();
    await box.fill('persona');
    await expect(panel.locator('[data-search-results] a').first()).toBeVisible({ timeout: 30_000 });
    const warmWallMs = Date.now() - warmAt;
    const warm = await page.evaluate(stagesSince, warmFrom);

    recordCatalogMetric('search', testInfo, {
      route: '/',
      cpuThrottle,
      network,
      emulatedMobile: isMobile,
      pageLoad,
      cold: { query: 'orbital', wallToResultMs: coldWallMs, scriptMs: Math.round((scriptAfter - scriptBefore) * 1000), ...cold },
      warm: { query: 'persona', wallToResultMs: warmWallMs, ...warm },
    });
  });
}
