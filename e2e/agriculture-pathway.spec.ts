import { expect, test } from '@playwright/test';

// The agriculture pathway hub (#93): its numbers come from the CI-computed files, and every file it offers is served.
test('the agriculture pathway shows its reference checks, estimate and limits, and serves its files', async ({ page, request }) => {
  await page.goto('/katas/agriculture-pathway/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From a weather record to a checked estimate');
  await expect(page.locator('[data-reference-check]')).toHaveCount(13);
  await expect(page.locator('[data-reference-check="EX18-ET0"]')).toHaveText('Pass');
  await expect(page.locator('[data-season-need]')).toHaveText('726.8');
  await expect(page.locator('[data-randori-card="C"]')).toHaveText('-2.4');
  const evidence = page.locator('[data-sector-pack="agriculture"]');
  await expect(evidence.locator('[data-evidence="verified"]')).toContainText('abde49906522…');
  await expect(evidence.locator('[data-evidence="verified"]')).toContainText('365 days, 0 missing temperature or rain values and 0 quality flags');
  await expect(evidence.locator('[data-professional-review="required"]')).toContainText('Nothing here is an irrigation recommendation');
  for (const id of ['agr-001-inspect-weather-record', 'agr-002-reference-et', 'agr-003-irrigation-need', 'agr-r01-randori']) {
    await expect(page.locator(`a[href="/katas/${id}"]`).first()).toBeVisible();
  }
  const files = await page.locator('a[href^="/examples/agriculture-pathway/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href') ?? ''))]);
  expect(files.length).toBeGreaterThanOrEqual(9);
  for (const href of files) expect((await request.get(href)).status(), href).toBe(200);
});

test('the UX and BIM pathways show their limits from the same sector pack section', async ({ page }) => {
  for (const [route, id, review] of [['/katas/ux-pathway/', 'ux', 'not-required'], ['/katas/bim-pathway/', 'bim', 'required']] as const) {
    await page.goto(route);
    const section = page.locator(`[data-sector-pack="${id}"]`);
    await expect(section.getByRole('heading', { level: 2, name: 'Verified, and not verified' })).toBeVisible();
    await expect(section.locator(`[data-professional-review="${review}"]`)).toBeVisible();
    await expect(section.locator('[data-evidence="verified"]')).not.toContainText('{');
  }
});

test('an agriculture recipe page links back to the pathway and its evidence', async ({ page }) => {
  await page.goto('/katas/agr-002-reference-et/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('reference evapotranspiration');
  await expect(page.locator('a[href="/katas/agriculture-pathway"]').first()).toBeVisible();
});
