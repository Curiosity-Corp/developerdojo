import { expect, test } from '@playwright/test';

test('a learner can inspect a dated published result and verify its arithmetic', async ({ page }) => {
  await page.goto('/katas/arena-evidence/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Same model. Different tools.');
  await expect(page.getByText('Historical snapshot:', { exact: false })).toContainText('11 November 2024');
  await expect(page.getByRole('link', { name: /published result list/ })).toHaveAttribute('href', /raw\.githubusercontent\.com\/SWE-bench\/experiments/);
  await page.getByLabel('What percentage is 54 out of 300?').fill('11');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByRole('status')).toContainText('Try dividing');
  await page.getByLabel('What percentage is 54 out of 300?').fill('18');
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByRole('status')).toContainText('Correct');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the verification explanation remains available', async ({ page }) => {
    await page.goto('/katas/arena-evidence/');
    await expect(page.getByRole('button', { name: 'Check answer' })).toBeHidden();
    await page.getByText('Reveal the arithmetic').click();
    await expect(page.getByText('54 ÷ 300 × 100 = 18%', { exact: false })).toBeVisible();
  });
});
