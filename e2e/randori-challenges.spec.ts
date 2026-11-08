import { expect, test } from '@playwright/test';

test('a learner can practice and check evidence in different fields', async ({ page }) => {
  await page.goto('/katas/randori-challenges/');
  for (const heading of ['Rescue a tiny invoice', 'Make booking understandable', 'Check a room brief', 'Build a resilient total']) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
  const data = page.locator('#data');
  await data.getByLabel('Your complete-line total (numbers only)').fill('22');
  await data.getByRole('button', { name: 'Check total' }).click();
  await expect(data.getByRole('status')).toContainText('Not quite');
  await data.getByLabel('Your complete-line total (numbers only)').fill('23');
  await data.getByRole('button', { name: 'Check total' }).click();
  await expect(data.getByRole('status')).toContainText('matches the independent check');
  const room = page.locator('#built-environment');
  await room.getByLabel('Your original wall area in m² (numbers only)').fill('');
  await room.getByRole('button', { name: 'Check area' }).click();
  await expect(room.getByRole('status')).toContainText('Enter a non-negative number');
  await room.getByLabel('Your original wall area in m² (numbers only)').fill('33');
  await room.getByRole('button', { name: 'Check area' }).click();
  await expect(room.getByRole('status')).toContainText('matches the independent check');
  await room.getByText('Reveal a new constraint').click();
  await expect(room.getByText('A 1 m × 1 m window is added.', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('challenges and independent checks remain available', async ({ page }) => {
    await page.goto('/katas/randori-challenges/');
    const data = page.locator('#data');
    await expect(data.getByRole('button', { name: 'Check total' })).toBeHidden();
    await data.getByText('Show the independent check').click();
    await expect(data.getByText('$23')).toBeVisible();
    const room = page.locator('#built-environment');
    await room.getByText('Show the independent check').click();
    await expect(room.getByText('33 m²')).toBeVisible();
  });
});
