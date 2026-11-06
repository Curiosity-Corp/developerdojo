import { expect, test } from '@playwright/test';

test('a learner can inspect and copy the practice dataset', async ({ page, request }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Start the data kata' }).click();
  await expect(page).toHaveURL(/\/katas\/data-rescue/);
  await expect(page.getByRole('heading', { name: 'Rescue messy data' })).toBeVisible();
  await expect(page.locator('.report').getByText('complete sales total')).toBeVisible();
  await expect(page.getByLabel('Your complete prompt')).toHaveValue(/S104,2026-04-02,Mint,,4\.00/);
  const csv = await request.get('/examples/seed-sales-messy.csv');
  expect(csv.status()).toBe(200);
  expect(await csv.text()).toContain('S105,2026-04-03,Basil,2,unknown');
});

test('the data check gives specific formative feedback', async ({ page }) => {
  await page.goto('/katas/data-rescue');
  await page.getByLabel('Complete unique sales').fill('5');
  await page.getByLabel('Rows needing review').fill('2');
  await page.getByLabel('Complete sales total in dollars').fill('22');
  await page.getByRole('button', { name: 'Check my numbers' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'At least one number does not match' })).toBeVisible();
  await page.getByLabel('Complete unique sales').fill('4');
  await page.getByRole('button', { name: 'Check my numbers' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'These three numbers match' })).toBeVisible();
});
