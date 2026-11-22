import { expect, test } from '@playwright/test';

// The science pathway hub (#93): its numbers come from the CI-computed files, and every file it offers is served.
test('the science pathway shows its reference checks, budget, trend and limits, and serves its files', async ({ page, request }) => {
  await page.goto('/katas/science-pathway/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From a published record to a result with its uncertainty');
  await expect(page.locator('[data-reference-check]')).toHaveCount(__NCHECKS__);
  await expect(page.locator('[data-reference-check="H3-uc-Z"]')).toHaveText('Pass');
  await expect(page.locator('[data-reference-check="H3-u-b30"]')).toHaveText('Pass');
  await expect(page.locator('[data-budget-uc="X"]')).toHaveText('0.295');
  await expect(page.locator('[data-trend-slope]')).toHaveText('__SLOPE__');
  await expect(page.locator('[data-trend-u-slope]')).toHaveText('__USLOPE__');
  await expect(page.locator('[data-randori-card="B"]')).toHaveText('__CARDB__');
  const evidence = page.locator('[data-sector-pack="science"]');
  await expect(evidence.locator('[data-evidence="verified"]')).toContainText('__SHA12__…');
  await expect(evidence.locator('[data-evidence="verified"]')).not.toContainText('{');
  await expect(evidence.locator('[data-professional-review="required"]')).toContainText('No metrologist, statistician or climate scientist');
  for (const id of ['sci-001-inspect-research-record', 'sci-002-uncertainty-budget', 'sci-003-least-squares-line', 'sci-r01-randori']) {
    await expect(page.locator(`a[href="/katas/${id}"]`).first()).toBeVisible();
  }
  const files = await page.locator('a[href^="/examples/science-pathway/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href') ?? ''))]);
  expect(files.length).toBeGreaterThanOrEqual(10);
  for (const href of files) expect((await request.get(href)).status(), href).toBe(200);
});

test('a science recipe page links back to the pathway and its evidence', async ({ page }) => {
  await page.goto('/katas/sci-002-uncertainty-budget/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('uncertainty');
  await expect(page.locator('a[href="/katas/science-pathway"]').first()).toBeVisible();
});
