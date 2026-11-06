import { expect, test } from '@playwright/test';

test('a learner can inspect the evidence and reveal the corrections', async ({ page }) => {
  await page.goto('/katas/error-clinic');
  await expect(page.getByRole('heading', { name: 'Spot the AI mistakes' })).toBeVisible();
  await expect(page.getByText('120 visits · 12 sign-ups')).toBeVisible();
  const answers = page.locator('details').filter({ has: page.getByText('Reveal the checks') });
  await answers.locator('summary').click();
  await expect(answers.getByText(/about 16\.7%/)).toBeVisible();
  await expect(answers.getByText(/15 ÷ 100 = 15%/)).toBeVisible();
  await expect(page.getByLabel('Your complete prompt')).toHaveValue(/no customer feedback/);
});
