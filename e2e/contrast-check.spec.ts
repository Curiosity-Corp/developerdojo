import { expect, test } from '@playwright/test';

test('checks a real design colour pair and explains limits', async ({ page }) => {
  await page.goto('/katas/contrast-check/');
  const tool = page.locator('[data-contrast-check]');
  await tool.getByLabel('Text colour').fill('#777');
  await tool.getByLabel('Background colour').fill('#fff');
  await tool.getByRole('button', { name: 'Check contrast' }).click();
  await expect(tool.getByRole('status')).toContainText('Normal text: does not meet 4.5:1');
  await expect(tool.getByRole('status')).toContainText('Large text: meets 3:1');
  await tool.getByLabel('Text colour').fill('#000');
  await tool.getByRole('button', { name: 'Check contrast' }).click();
  await expect(tool.getByRole('status')).toContainText('21.00:1');
  await expect(tool.getByRole('status')).toContainText('Normal text: meets 4.5:1');
  await tool.getByLabel('Text colour').fill('red');
  await tool.getByRole('button', { name: 'Check contrast' }).click();
  await expect(tool.getByRole('status')).toContainText('Enter both colours as opaque hex');
  await expect(tool.locator('[data-contrast-preview]')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test('the prototype kata includes the same local check', async ({ page }) => {
  await page.goto('/katas/first-prototype/');
  await expect(page.getByRole('heading', { name: 'Check your colours' })).toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('keeps an accessible explanation and source', async ({ page }) => {
    await page.goto('/katas/contrast-check/');
    await expect(page.getByText('JavaScript is needed to calculate a ratio here.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'W3C contrast guidance' })).toBeVisible();
  });
});
