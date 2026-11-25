import { expect, test } from '@playwright/test';

// The manufacturing pathway hub (#93): its numbers come from the CI-computed files, and every file it offers is served.
test('the manufacturing pathway shows its reference checks, limits, variance components and Randori, and serves its files', async ({ page, request }) => {
  await page.goto('/katas/manufacturing-pathway/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From a process record to control limits and the sources of variation');
  await expect(page.locator('[data-reference-check]')).toHaveCount(60);
  await expect(page.locator('[data-reference-check="litho-mean"]')).toHaveText('Pass');
  await expect(page.locator('[data-reference-check="D4-5"]')).toHaveText('Pass');
  await expect(page.locator('[data-reference-note] li')).toHaveCount(2);
  await expect(page.locator('[data-lowest-site]')).toHaveText('center');
  await expect(page.locator('[data-limits="xbar-s"]')).toHaveText('27 of 90');
  await expect(page.locator('[data-limits="lot-means"]')).toHaveText('1 of 30 (cassette 27)');
  await expect(page.locator('[data-share="cassette"]')).toHaveText('54.0 %');
  await expect(page.locator('[data-overstatement]')).toHaveText('1.61');
  await expect(page.locator('[data-randori-card="B"]')).toHaveText('-13');
  const evidence = page.locator('[data-sector-pack="manufacturing"]');
  await expect(evidence.locator('[data-evidence="verified"]')).toContainText('d7c27b047ed0…');
  await expect(evidence.locator('[data-evidence="verified"]')).not.toContainText('{');
  for (const id of ['mfg-001-inspect-process-record', 'mfg-002-control-limits', 'mfg-003-sources-of-variation', 'mfg-r01-randori']) {
    await expect(page.locator(`a[href="/katas/${id}"]`).first()).toBeVisible();
  }
  const files = await page.locator('a[href^="/examples/manufacturing-pathway/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href') ?? ''))]);
  expect(files.length).toBeGreaterThanOrEqual(10);
  for (const href of files) expect((await request.get(href)).status(), href).toBe(200);
});

test('a manufacturing recipe page links back to the pathway and its evidence', async ({ page }) => {
  await page.goto('/katas/mfg-002-control-limits/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('control limits');
  await expect(page.locator('a[href="/katas/manufacturing-pathway"]').first()).toBeVisible();
});
