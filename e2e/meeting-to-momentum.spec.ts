import { expect, test } from '@playwright/test';

test('a learner can check a meeting board on a narrow phone without scripts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/meeting-to-momentum/');
    await page.getByRole('link', { name: 'Start with the notes' }).click();
    await expect(page.getByLabel('Complete prompt and fictional notes')).toContainText('No one agreed to own it or set a date');
    await page.getByText('Reveal the independent check').click();
    await expect(page.getByText('There are two explicit commitments:', { exact: false })).toBeVisible();
    await expect(page.getByText('The shared folder location is unknown.', { exact: false })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('a learner can copy the complete prompt and source notes', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => sessionStorage.setItem('meeting-prompt', text) } });
  });
  await page.goto('/katas/meeting-to-momentum/');
  await page.getByRole('button', { name: 'Copy prompt' }).click();
  await expect(page.locator('[data-status]')).toContainText('Copied.');
  const copied = await page.evaluate(() => sessionStorage.getItem('meeting-prompt'));
  expect(copied).toContain('not been approved');
  expect(copied).toContain('No one agreed to own it or set a date');
});
