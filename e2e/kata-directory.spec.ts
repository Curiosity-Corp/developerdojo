import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { KATA_DIRECTORY } from '../src/data/kata-directory';

const kataCount = KATA_DIRECTORY.length;

test('learners can find katas by a mistyped topic and filter by interest', async ({ page }) => {
  await page.goto('/katas/');
  const search = page.getByRole('search', { name: 'Find a kata' });
  const input = search.getByLabel('Find by outcome or topic');
  const status = page.locator('#kata-filter-status');
  await expect(search).toBeVisible();
  await expect(page.locator('[data-kata]')).toHaveCount(kataCount);
  await expect(status).toHaveText(`${kataCount} of ${kataCount} katas shown`);
  await input.fill('archtecture');
  await expect(page.getByRole('link', { name: 'Start the BIM kata' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Trace the quantity' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start the data kata' })).toBeHidden();
  await search.getByLabel('Choose an interest').selectOption('build');
  await expect(page.getByRole('link', { name: 'Start the BIM kata' })).toBeVisible();
  await input.fill('no-such-kata-9537');
  await expect(status).toHaveText(`0 of ${kataCount} katas shown`);
  await expect(page.getByText('No matching kata yet.', { exact: false })).toBeVisible();
  await search.getByRole('button', { name: 'Clear' }).click();
  await expect(status).toHaveText(`${kataCount} of ${kataCount} katas shown`);
  await expect(page.getByRole('link', { name: 'Start the data kata' })).toBeVisible();
});

test('every kata remains available without JavaScript on a narrow phone', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/');
    await expect(page.getByRole('search', { name: 'Find a kata' })).toHaveCount(0);
    await expect(page.locator('[data-kata]')).toHaveCount(kataCount);
    await expect(page.getByRole('link', { name: 'Trace the quantity' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('finder controls and results have no serious accessibility violations', async ({ page }) => {
  await page.goto('/katas/');
  await page.getByLabel('Find by outcome or topic').fill('design');
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
});
