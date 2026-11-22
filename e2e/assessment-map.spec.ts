import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// The assessment map (#90): ranks apart from belts, proposed rubrics, the review pilot and its boundaries.
test('a learner can reach the assessment map from the belts page and see each rank apart from the belts', async ({ page }) => {
  await page.goto('/belts');
  await page.getByRole('link', { name: 'assessment map' }).click();
  await expect(page).toHaveURL(/\/assessment-map\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('What each rank assesses');
  for (const name of ['Developer', 'Master Developer', 'Sensei']) {
    await expect(page.locator('#ranks').getByRole('heading', { level: 3, name, exact: true })).toBeVisible();
  }
  await expect(page.getByRole('heading', { name: 'Belts answer a different question' })).toBeVisible();
  await expect(page.locator('[data-map-status]')).toContainText('Proposed, not approved');
  await expect(page.getByRole('heading', { name: /Master Developer: Advanced rubric/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /MD-1 Transfer to an unseen tool family or field/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /SEN-2 Domain adaptations/ })).toBeVisible();
  await expect(page.getByText('White: See and explain')).toBeVisible();
});

test('the review pilot lists its evidence, is honest about measures and states the boundaries', async ({ page }) => {
  await page.goto('/assessment-map');
  await expect(page.getByText('Status: Not run yet.')).toBeVisible();
  for (const title of ['The actual artifacts.', 'Reproducible configuration.', 'Tests and checks.', 'Review log.', 'Failures.', 'Decision evidence.']) {
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }
  const values = page.locator('[data-measure-value]');
  await expect(values).toHaveCount(3);
  for (const value of await values.allInnerTexts()) expect(value.trim()).toBe('Unavailable');
  await expect(page.getByText(/does not award a belt or a rank/)).toBeVisible();
  await expect(page.getByText(/not professional licensure or accreditation/)).toBeVisible();
  await expect(page.getByText(/takes no authenticated submissions/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Run a 30 minute review' })).toHaveAttribute('href', '/library/sensei-run-a-30-minute-review');
});

test('the certificates and review pages link to the assessment map', async ({ page }) => {
  await page.goto('/certificates');
  await expect(page.getByRole('link', { name: 'See what each rank assesses apart from the belts' })).toHaveAttribute('href', '/assessment-map');
  await page.goto('/belt-review');
  await expect(page.getByRole('link', { name: 'assessment map' })).toHaveAttribute('href', '/assessment-map');
});

test('the map reads without JavaScript on a narrow screen', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/assessment-map');
    await expect(page.getByRole('heading', { name: 'Independent review pilot' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Boundaries' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally {
    await context.close();
  }
});

for (const theme of ['light', 'dark'] as const) {
  test(`the map has no serious accessibility violations (${theme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/assessment-map');
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(report.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
  });
}
