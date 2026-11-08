import { expect, test } from '@playwright/test';

test('learners can explore the real prototype and its UX evidence', async ({ page }) => {
  await page.goto('/katas/ux-journey/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Design an app people can use');
  const demo = page.frameLocator('iframe[title="Try the working Pocket Garden prototype"]');
  await demo.getByRole('button', { name: 'Loves sun' }).click();
  await expect(demo.getByRole('heading', { name: 'Basil' })).toBeVisible();
  await expect(demo.getByRole('heading', { name: 'Mint' })).toBeHidden();
  await demo.locator('article').filter({ has: demo.getByRole('heading', { name: 'Basil' }) }).getByRole('button', { name: 'Mark as planted' }).click();
  await expect(demo.getByRole('button', { name: 'Planted ✓' })).toBeVisible();
  await expect(page.getByRole('img', { name: /Three Pocket Garden states/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download the editable SVG wireframe' })).toHaveAttribute('href', '/examples/pocket-garden-flow.svg');
  await page.getByText('Quick check: does a screenshot prove a prototype is accessible?').click();
  await expect(page.getByText('A screenshot cannot demonstrate keyboard operation', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the prompt, diagram and learning steps remain available', async ({ page }) => {
    await page.goto('/katas/ux-journey/');
    await expect(page.locator('#ux-prompt')).toContainText('Do not claim');
    await expect(page.getByRole('button', { name: 'Copy prompt' })).toBeHidden();
    await expect(page.getByRole('link', { name: 'Penpot: connect boards and prototype interactions' })).toBeVisible();
  });
});
