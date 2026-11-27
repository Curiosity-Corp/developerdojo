import { expect, test } from '@playwright/test';

// The health pathway hub (#93): its results come from the CI-computed files, and every file it offers is served.
test('the health pathway shows its reference checks, scores, categories and Randori, and serves its files', async ({ page, request }) => {
  await page.goto('/katas/health-pathway/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From a growth reference table to a checked BMI-for-age percentile');
  await expect(page.locator('[data-health-notice]')).toContainText('Not medical advice');
  await expect(page.locator('[data-reference-check]')).toHaveCount(24);
  await expect(page.locator('[data-reference-check="ex2-percentile"]')).toHaveText('Pass');
  await expect(page.locator('[data-table-check="2022"]')).toHaveText('12702 of 12702');
  await expect(page.locator('[data-repeated-header]')).toHaveText('221');
  await expect(page.locator('[data-child-category="E"]')).toHaveText('severe obesity');
  await expect(page.locator('[data-child-category="F"]')).toContainText('Unavailable');
  await expect(page.locator('[data-extended-e]')).toContainText('99.84');
  await expect(page.locator('[data-randori-card="D"]')).toHaveText('obesity to healthy weight');
  const evidence = page.locator('[data-sector-pack="health"]');
  await expect(evidence.locator('[data-evidence="verified"]')).toContainText('cbeea0e8d500…');
  await expect(evidence.locator('[data-evidence="verified"]')).not.toContainText('{');
  for (const id of ['hlt-001-inspect-growth-reference', 'hlt-002-bmi-for-age-percentile', 'hlt-003-bmi-category-report', 'hlt-r01-randori']) {
    await expect(page.locator(`a[href="/katas/${id}"]`).first()).toBeVisible();
  }
  const files = await page.locator('a[href^="/examples/health-pathway/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href') ?? ''))]);
  expect(files.length).toBeGreaterThanOrEqual(12);
  for (const href of files) expect((await request.get(href)).status(), href).toBe(200);
});

test('a health recipe page links back to the pathway and its evidence', async ({ page }) => {
  await page.goto('/katas/hlt-002-bmi-for-age-percentile/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('BMI-for-age');
  await expect(page.locator('a[href="/katas/health-pathway"]').first()).toBeVisible();
});
