import { expect, test } from '@playwright/test';

test('a beginner can inspect and interact with the real example', async ({ page }) => {
  await page.goto('/katas/first-prototype');
  await expect(page.getByRole('heading', { name: 'Make a clickable prototype' })).toBeVisible();
  const example = page.frameLocator('iframe[title="Working Pocket Garden example"]');
  await expect(example.getByRole('heading', { name: 'Basil' })).toBeVisible();
  await example.getByRole('button', { name: 'Likes shade' }).click();
  await expect(example.getByRole('heading', { name: 'Basil' })).toBeHidden();
  await expect(example.getByRole('heading', { name: 'Mint' })).toBeVisible();
  await example.getByRole('button', { name: 'Mark as planted' }).click();
  await expect(example.getByRole('button', { name: 'Planted ✓' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByLabel('Your complete prompt')).toHaveValue(/Pocket Garden/);
});

test('a beginner can paste and preview HTML on the kata page', async ({ page }) => {
  await page.goto('/katas/first-prototype');
  await page.getByLabel('Your HTML').fill('<html><body><h1>My new creation</h1></body></html>');
  await page.getByRole('button', { name: 'Preview my creation' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Preview ready below.' })).toBeVisible();
  await expect(page.frameLocator('#kata-preview-frame').getByRole('heading', { name: 'My new creation' })).toBeVisible();
});

test('the idea kata shows a complete brief, prompt and device options', async ({ page }) => {
  await page.goto('/katas/spark-ideas');
  await expect(page.getByRole('heading', { name: 'Neighborhood seed swap' })).toBeVisible();
  await expect(page.getByLabel('Your complete prompt')).toHaveValue(/one-page project brief/);
  await page.getByText('Phone · ChatGPT app', { exact: true }).click();
  await expect(page.getByText('Plugins are optional here.', { exact: false })).toBeVisible();
  await page.getByText('Windows', { exact: true }).click();
  await expect(page.getByText('powershell -ExecutionPolicy ByPass', { exact: false })).toBeVisible();
});
