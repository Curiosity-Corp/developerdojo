import { expect, test } from '@playwright/test';

// The finance pathway hub (#93): its numbers come from the CI-computed files, and every file it offers is served.
test('the finance pathway shows its reference checks, rates, schedule, tolerance and limits, and serves its files', async ({ page, request }) => {
  await page.goto('/katas/finance-pathway/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From a loan’s terms to a checked annual percentage rate');
  await expect(page.locator('[data-reference-check]')).toHaveCount(20);
  await expect(page.locator('[data-reference-check="b9-APR"]')).toHaveText('Pass');
  await expect(page.locator('[data-reference-check="c1-iv-tf"]')).toHaveText('Pass');
  await expect(page.locator('[data-apr="c1-ii"]')).toHaveText('11.82 %');
  await expect(page.locator('[data-disclosure="finance-charge"]')).toHaveText('$520.00');
  await expect(page.locator('[data-schedule-balance]')).toHaveText('$0.02');
  await expect(page.locator('[data-odd-days="c1-v"]')).toHaveText('No');
  await expect(page.locator('[data-randori-card="B"]')).toHaveText('+1.01');
  const evidence = page.locator('[data-sector-pack="finance"]');
  await expect(evidence.locator('[data-evidence="verified"]')).toContainText('ed61b93aa82d…');
  await expect(evidence.locator('[data-evidence="verified"]')).not.toContainText('{');
  await expect(evidence.locator('[data-professional-review="required"]')).toContainText('No compliance specialist, lawyer or accountant');
  for (const id of ['fin-001-amortization-schedule', 'fin-002-annual-percentage-rate', 'fin-003-apr-tolerance', 'fin-r01-randori']) {
    await expect(page.locator(`a[href="/katas/${id}"]`).first()).toBeVisible();
  }
  const files = await page.locator('a[href^="/examples/finance-pathway/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href') ?? ''))]);
  expect(files.length).toBeGreaterThanOrEqual(10);
  for (const href of files) expect((await request.get(href)).status(), href).toBe(200);
});

test('a finance recipe page links back to the pathway and its evidence', async ({ page }) => {
  await page.goto('/katas/fin-002-annual-percentage-rate/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('annual percentage rate');
  await expect(page.locator('a[href="/katas/finance-pathway"]').first()).toBeVisible();
});
