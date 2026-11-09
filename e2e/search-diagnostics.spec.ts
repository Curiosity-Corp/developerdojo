import { performance } from 'node:perf_hooks';
import { expect, test, type Request } from '@playwright/test';

type RequestObservation = { kind: string; startedMs: number; durationMs: number | null; httpStatus: number | null; outcome: string };

test('records isolated-context cold and warm search timing', async ({ page, isMobile }, testInfo) => {
  const origin = performance.now();
  const requests: RequestObservation[] = [];
  const observed = new Map<Request, RequestObservation>();
  const elapsed = () => Math.round(performance.now() - origin);
  const kind = (path: string) => {
    if (path.endsWith('/pagefind.js')) return 'module';
    if (path.endsWith('/pagefind-entry.json')) return 'metadata';
    if (path.includes('/fragment/')) return 'result fragment';
    if (path.includes('/index/')) return 'index';
    if (path.endsWith('.wasm')) return 'wasm';
    return 'other Pagefind asset';
  };
  page.on('request', (request) => {
    const path = new URL(request.url()).pathname;
    if (!path.startsWith('/pagefind/') || requests.length >= 100) return;
    const item = { kind: kind(path), startedMs: elapsed(), durationMs: null, httpStatus: null, outcome: 'pending' } satisfies RequestObservation;
    requests.push(item);
    observed.set(request, item);
  });
  const finish = (request: Request, outcome: string) => {
    const item = observed.get(request);
    if (item) { item.durationMs = elapsed() - item.startedMs; item.outcome = outcome; }
  };
  page.on('response', (response) => {
    const item = observed.get(response.request());
    if (item) item.httpStatus = response.status();
  });
  page.on('requestfinished', (request) => finish(request, 'finished'));
  page.on('requestfailed', (request) => finish(request, 'failed'));

  const samples: Record<string, number | null> = {
    openStartedMs: null, openToDialogMs: null, coldQueryStartedMs: null,
    coldQueryToCountMs: null, coldQueryToFirstPreviewMs: null, warmQueryStartedMs: null,
    warmQueryToCountMs: null, warmQueryToFirstPreviewMs: null,
  };
  let stage = 'page load';
  try {
    await page.goto('/');
    const openAt = performance.now();
    samples.openStartedMs = elapsed();
    stage = 'open search';
    await page.getByRole('button', { name: 'Search', exact: true }).locator('visible=true').click();
    const dialog = page.getByRole('dialog', { name: 'Search' });
    await expect(dialog).toBeVisible();
    samples.openToDialogMs = Math.round(performance.now() - openAt);
    const box = dialog.getByRole('searchbox');
    const status = dialog.getByRole('status');
    const first = dialog.locator('[data-search-results] a').first();
    for (const temperature of ['cold', 'warm'] as const) {
      if (temperature === 'warm') { await box.fill(''); await expect(status).toHaveText(''); }
      stage = `${temperature} query`;
      const queryAt = performance.now();
      samples[`${temperature}QueryStartedMs`] = elapsed();
      await box.fill('orbital');
      await expect(status).toContainText(/\d+ results? for "orbital"/, { timeout: 20_000 });
      samples[`${temperature}QueryToCountMs`] = Math.round(performance.now() - queryAt);
      await expect(first).toBeVisible({ timeout: 20_000 });
      samples[`${temperature}QueryToFirstPreviewMs`] = Math.round(performance.now() - queryAt);
      await expect(dialog.getByRole('link', { name: /ORBITAL: objective, resources and budget/ }).first()).toBeVisible({ timeout: 20_000 });
    }
    stage = 'complete';
  } finally {
    const report = {
      description: 'Runner-observed wall time in an isolated browser context; mobile is emulated, not a real device. Cold means a fresh context, not an uncached operating system.',
      project: testInfo.project.name, emulatedMobile: isMobile, retry: testInfo.retry,
      stage, elapsedMs: elapsed(), samples, observedPagefindRequests: requests,
    };
    const body = JSON.stringify(report, null, 2);
    console.info(`[search-diagnostics] ${body}`);
    await testInfo.attach('search-timing.json', { body, contentType: 'application/json' });
  }
});
