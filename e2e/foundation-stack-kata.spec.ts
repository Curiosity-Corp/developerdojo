import { expect, test } from '@playwright/test';

test('learners can compare two instructions using the same real practice input', async ({ page, request }) => {
  await page.goto('/katas/compare-instructions/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Change the instructions');
  await expect(page.getByText('A checked report from messy data')).toBeVisible();
  const dataset = await request.get('/examples/seed-sales-messy.csv');
  expect(dataset.status()).toBe(200);
  const csv = await dataset.text();
  const promptA = await page.getByLabel('Complete prompt and input').nth(0).inputValue();
  const promptB = await page.getByLabel('Complete prompt and input').nth(1).inputValue();
  expect(promptA).toContain(csv.trim());
  expect(promptB).toContain(csv.trim());
  expect(promptB).toContain('Do not guess missing quantities');
  expect(promptA).not.toContain('Do not guess missing quantities');
  await expect(page.getByText('not a claim about an AI model’s performance')).toBeVisible();
  await page.getByLabel('Complete unique sales').fill('4');
  await page.getByLabel('Rows needing review').fill('2');
  await page.getByLabel('Complete sales total in dollars').fill('22');
  await page.getByRole('button', { name: 'Check my numbers' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'These three numbers match' })).toBeVisible();
  await page.getByRole('button', { name: 'Check my numbers' }).scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test('a learner can copy the instructions and record', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => sessionStorage.setItem('copied', text) },
    });
  });
  await page.goto('/katas/compare-instructions/');
  await page.getByRole('button', { name: 'Copy Prompt B' }).click();
  expect(await page.evaluate(() => sessionStorage.getItem('copied'))).toContain('Do not guess missing quantities');
  await page.getByLabel('Your experiment record').fill('My observation: run B named both exceptions.');
  await page.getByRole('button', { name: 'Copy my record' }).click();
  expect(await page.evaluate(() => sessionStorage.getItem('copied'))).toBe('My observation: run B named both exceptions.');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the prompts, record and transfer check remain usable', async ({ page }) => {
    await page.goto('/katas/compare-instructions/');
    await expect(page.getByLabel('Complete prompt and input').nth(0)).toBeVisible();
    await expect(page.getByLabel('Your experiment record')).toBeVisible();
    await page.getByText('Reveal the independent check').click();
    await expect(page.getByText('The complete sales total is', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy Prompt A' })).toHaveCount(0);
  });
});
