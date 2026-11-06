import { expect, test } from '@playwright/test';

test('the stack worksheet accepts a comparison without requiring an account', async ({ page }) => {
  await page.goto('/stack-lab');
  await page.getByLabel('Goal and acceptance criteria').fill('Produce a useful summary and check its sources.');
  await page.getByLabel('First configuration').fill('Record the baseline stack and versions.');
  await page.getByLabel('Second configuration and what changed').fill('Change the task instructions.');
  await page.getByLabel('Results and verification').fill('Compare the outputs against the same criteria.');
  await expect(page.getByLabel('Goal and acceptance criteria')).toHaveValue('Produce a useful summary and check its sources.');
  await expect(page.getByText(/not submitted or saved by the Dojo/)).toBeVisible();
});
