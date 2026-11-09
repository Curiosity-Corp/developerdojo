import { expect, test } from '@playwright/test';

test('fields connect existing specialist katas to shared foundations', async ({ page }) => {
  await page.goto('/fields/');
  const ux = page.locator('#ux');
  await expect(ux.getByRole('link', { name: 'Design a user journey' })).toHaveAttribute('href', '/katas/ux-journey');
  await expect(ux.getByRole('link', { name: 'Compare AI instructions' })).toHaveAttribute('href', '/katas/compare-instructions');
  const bim = page.locator('#architecture-bim');
  await expect(bim.getByRole('link', { name: 'Investigate a real IFC model' })).toHaveAttribute('href', '/katas/inspect-ifc');
  await expect(bim.getByRole('link', { name: 'Check context and trust' })).toHaveAttribute('href', '/katas/context-trap');
  await expect(page.locator('#software').getByRole('link', { name: 'Customize open source' })).toHaveAttribute('href', '/katas/open-source-patch-lab');
  await expect(page.locator('#finance').getByRole('link', { name: 'Try the fictional invoice exercise' })).toBeVisible();
});

test('the field-to-kata links work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/fields/');
    await expect(page.locator('#energy').getByRole('link', { name: 'Compare a room’s lighting energy' })).toBeVisible();
    await expect(page.locator('#energy').getByRole('link', { name: 'Compare AI instructions' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});
