import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('a beginner can inspect a fictional energy outcome and adapt the schedule', async ({ page }) => {
  await page.goto('/katas/lighting-energy');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Find the energy in a room');
  await expect(page.getByText('79.2 kWh less')).toBeVisible();
  await expect(page.getByText(/not a measured result/)).toBeVisible();
  await expect(page.getByLabel('Your complete prompt')).toHaveValue(/Do not claim actual measured savings/);
  await page.getByLabel('Hours per day').fill('3');
  await page.getByLabel('Number of days').fill('30');
  await page.getByRole('button', { name: 'Calculate the estimate' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Existing:' })).toContainText('Existing: 54.00 kWh. Proposed: 6.48 kWh. Difference: 47.52 kWh.');
  await page.getByLabel('Hours per day').fill('25');
  await page.getByRole('button', { name: 'Calculate the estimate' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Enter 0–24 hours' })).toBeVisible();
  await page.getByLabel('Hours per day').fill('3');
  await page.getByLabel('Number of days').fill('1.5');
  await page.getByRole('button', { name: 'Calculate the estimate' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'whole number of days' })).toBeVisible();
});

test('the calculation and official lesson are available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/lighting-energy');
    await expect(page.getByText(/6 × 100 W × 5 hours × 30 days/)).toBeVisible();
    await expect(page.getByRole('link', { name: /Energy Information Administration's electricity lesson/ })).toHaveAttribute('href', 'https://www.eia.gov/kids/energy-sources/electricity/science-of-electricity.php');
    await expect(page.getByLabel('Your complete prompt')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate the estimate' })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('the energy field leads to accessible practice', async ({ page }) => {
  await page.goto('/fields');
  await page.getByRole('link', { name: 'Compare a room’s lighting energy' }).click();
  await expect(page).toHaveURL(/\/katas\/lighting-energy\/?$/);
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
});
