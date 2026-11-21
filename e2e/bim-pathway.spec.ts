import { expect, test } from '@playwright/test';

// The BIM pathway hub (#92): its numbers come from the CI-computed files, and every file it offers is served.
test('the BIM pathway shows the three outcomes separately and serves its files', async ({ page, request }) => {
  await page.goto('/katas/bim-pathway/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From an IFC file to checked information');
  await expect(page.locator('[data-ids-original="REQ-03"]')).toHaveText('Fail');
  await expect(page.locator('[data-ids-edited="REQ-03"]')).toHaveText('Pass');
  await expect(page.locator('[data-ids-original]')).toHaveCount(6);
  await expect(page.getByRole('heading', { name: 'Schema' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Geometry' })).toBeVisible();
  await expect(page.locator('[data-change]')).toContainText('24 of 24 GlobalIds kept, 0 added');
  await expect(page.locator('[data-mesh]')).toHaveCount(2);
  await expect(page.locator('[data-quantity]')).toHaveCount(11);
  await expect(page.locator('[data-quantity="Q-09"]')).toContainText('5 m²');
  await expect(page.locator('[data-cross-check]')).toHaveCount(4);
  await expect(page.locator('[data-staged]').first()).toContainText('Proposed');
  for (const id of ['bim-001-inspect-model', 'bim-002-property-sets', 'bim-003-ids-check', 'bim-004-change-and-revalidate', 'bim-005-mesh-geometry', 'bim-006-quantity-trace', 'bim-r01-randori']) {
    await expect(page.locator(`a[href="/katas/${id}"]`).first()).toBeVisible();
  }
  const files = await page.locator('a[href^="/examples/bim-pathway/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href') ?? ''))]);
  expect(files.length).toBeGreaterThanOrEqual(12);
  for (const href of files) expect((await request.get(href)).status(), href).toBe(200);
});

test('a BIM recipe page links back to the pathway and its evidence', async ({ page }) => {
  await page.goto('/katas/bim-003-ids-check/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('IDS');
  await expect(page.locator('a[href="/katas/bim-pathway"]').first()).toBeVisible();
});
