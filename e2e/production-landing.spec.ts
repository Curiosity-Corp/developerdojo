import { expect, test } from '@playwright/test';

// Production only (E2E_BASE_URL set, e2e:production job): the landing page as a customer sees it.
// The full-page screenshot is saved before any assertion, so a red run still shows the page;
// scripts/production-e2e.mjs posts the desktop one on Curiosity-Corp/overview#6.
test('the landing page loads cleanly for a customer', async ({ page }, testInfo) => {
  test.skip(!process.env['E2E_BASE_URL'], 'production check: runs against the deployed site');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(`uncaught: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()} (${message.location().url})`);
  });

  const response = await page.goto('/', { waitUntil: 'load' });
  // Walk down the page so lazy images load, then wait until every image has settled.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => Array.from(document.images).every((img) => img.complete), undefined, { timeout: 15_000 }).catch(() => undefined);
  await page.screenshot({ path: `production-e2e/landing-${testInfo.project.name}.png`, fullPage: true });

  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toBeVisible();
  const broken = await page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => img.currentSrc !== '' && (!img.complete || img.naturalWidth === 0))
      .map((img) => img.currentSrc),
  );
  expect(broken, 'images that did not load').toEqual([]);
  expect(errors, 'console errors and uncaught exceptions').toEqual([]);
});
