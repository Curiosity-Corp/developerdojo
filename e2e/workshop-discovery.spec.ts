import { expect, test } from '@playwright/test';

test('a learner finds and opens a specific workshop exercise by a mistyped topic', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/katas/');
  const search = page.getByRole('search', { name: 'Find a kata' });
  await search.getByLabel('Find by outcome or topic').fill('agricuture');
  const results = page.locator('#workshop-results');
  const link = results.getByRole('link', { name: 'Investigate a vegetation signal' });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/katas/industry-workshops#vegetation');
  await expect(page.locator('#kata-filter-status')).toContainText('1 matching workshop exercise');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  await search.getByLabel('Choose an interest').selectOption('think');
  await expect(results).toBeHidden();
  await search.getByLabel('Choose an interest').selectOption('real');
  await link.click();
  await expect(page.locator('#vegetation blockquote')).toBeVisible();
  await expect(page.locator('#vegetation blockquote')).toContainText('fictional surface reflectance');
});

test('without JavaScript the workshop directory still leads to every exercise', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/katas/');
    await expect(page.locator('#workshop-results')).toBeHidden();
    await page.getByRole('link', { name: 'Explore industry workshops' }).click();
    const card = page.locator('#vegetation');
    await card.getByText('Open the Dojo exercise').click();
    await expect(card.locator('blockquote')).toContainText('fictional surface reflectance');
  } finally { await context.close(); }
});
