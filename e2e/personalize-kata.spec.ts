import { expect, test } from '@playwright/test';

test('a learner can tailor and edit a kata prompt without losing the original', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('clipboard unavailable'); } } });
  });
  await page.goto('/katas/spark-ideas');
  const original = await page.getByLabel('Your complete prompt').inputValue();
  await page.getByText('Make this prompt about your idea').click();
  await page.getByLabel('What do you want to make?').fill('A reading club');
  await page.getByLabel('How much time do you have?').fill('20 minutes');
  await page.getByRole('button', { name: 'Create my prompt' }).click();
  await expect(page.getByLabel('Your editable prompt')).toHaveValue(/My goal: A reading club/);
  await expect(page.getByLabel('Your editable prompt')).toHaveValue(/Time available: 20 minutes/);
  await expect(page.getByLabel('Your complete prompt')).toHaveValue(original);
  await page.getByLabel('Your editable prompt').fill('My edited prompt');
  await expect(page.getByLabel('Your editable prompt')).toHaveValue('My edited prompt');
  await page.getByRole('button', { name: 'Copy my prompt' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Text selected.' })).toBeVisible();
});

test('original kata prompt remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/katas/spark-ideas');
  await expect(page.getByLabel('Your complete prompt')).toBeVisible();
  await context.close();
});
