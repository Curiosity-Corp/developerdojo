import { expect, test } from '@playwright/test';

test('a learner can explore a real room and understand its evidence', async ({ page }) => {
  await page.goto('/katas/scan-a-room/');
  await expect(page.getByRole('heading', { name: 'Turn a room into a world' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open the interactive room ↗' })).toHaveAttribute('href', 'https://wesbos.github.io/3d-model-anything/');
  await expect(page.getByText('The published office does not include its original scans', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Watch Wes Bos explain 3D Model Anything on YouTube' })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=JGQCcCzuS88');
  await expect(page.getByRole('link', { name: 'walkthrough', exact: true })).toHaveAttribute('href', 'https://wesbos.com/3d-model-anything');
  await expect(page.locator('#room-prompt')).toContainText('Do not invent measurements');
  await page.getByText('Does an attractive 3D room prove its measurements are correct?').click();
  await expect(page.getByText('No. Compare against the source measurements', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the prompt and verification remain usable', async ({ page }) => {
    await page.goto('/katas/scan-a-room/');
    await expect(page.locator('#room-prompt')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy prompt' })).toBeHidden();
    await page.getByText('Computer: inspect and run the public viewer').click();
    await expect(page.getByText('npm run dev', { exact: false })).toBeVisible();
  });
});
