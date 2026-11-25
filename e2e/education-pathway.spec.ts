import { expect, test } from '@playwright/test';

// The education pathway hub (#93): its results come from the CI-computed files, and every file it offers is served.
test('the education pathway shows its reference checks, rule outcomes, report and Randori, and serves its files', async ({ page, request }) => {
  await page.goto('/katas/education-pathway/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From a learning page to a checked accessibility report');
  await expect(page.locator('[data-reference-check]')).toHaveCount(36);
  await expect(page.locator('[data-reference-check="bf051a-passed-1"]')).toHaveText('Pass');
  await expect(page.locator('[data-inspection="lang"]')).toHaveText('en');
  await expect(page.locator('[data-rule="2779a5"]')).toHaveText('Passed');
  await expect(page.locator('[data-rule="b4f0c3"]')).toHaveText('Inapplicable');
  await expect(page.locator('[data-criterion="3.1.1"]')).toHaveText('further testing needed');
  await expect(page.locator('[data-randori-card="C"]')).toContainText('1.4.4');
  const evidence = page.locator('[data-sector-pack="education"]');
  await expect(evidence.locator('[data-evidence="verified"]')).toContainText('c42e87b501ee…');
  await expect(evidence.locator('[data-evidence="verified"]')).not.toContainText('{');
  for (const id of ['edu-001-inspect-learning-page', 'edu-002-run-act-rules', 'edu-003-report-accessibility', 'edu-r01-randori']) {
    await expect(page.locator(`a[href="/katas/${id}"]`).first()).toBeVisible();
  }
  const files = await page.locator('a[href^="/examples/education-pathway/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href') ?? ''))]);
  expect(files.length).toBeGreaterThanOrEqual(12);
  for (const href of files) expect((await request.get(href)).status(), href).toBe(200);
});

test('an education recipe page links back to the pathway and its evidence', async ({ page }) => {
  await page.goto('/katas/edu-002-run-act-rules/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('accessibility');
  await expect(page.locator('a[href="/katas/education-pathway"]').first()).toBeVisible();
});
