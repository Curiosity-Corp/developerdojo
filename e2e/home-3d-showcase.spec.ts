import { expect, test } from '@playwright/test';

test('the 3D showcase leads directly to the kata on a narrow phone without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/');
    const showcase = page.locator('article').filter({ has: page.getByRole('heading', { name: 'Explore a room in 3D' }) });
    await expect(showcase.getByRole('link', { name: 'Open the finished room' })).toHaveAttribute('href', 'https://wesbos.github.io/3d-model-anything/');
    await expect(showcase.getByRole('link', { name: 'Watch Wes Bos explain 3D Model Anything on YouTube' })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=JGQCcCzuS88');
    await expect(showcase.getByRole('link', { name: '3D Model Anything', exact: true })).toHaveAttribute('href', 'https://github.com/wesbos/3d-model-anything');
    await expect(showcase.locator('img')).toHaveAttribute('loading', 'lazy');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await showcase.getByRole('link', { name: 'Start the 3D kata' }).click();
    await expect(page).toHaveURL(/\/katas\/scan-a-room\/?$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Turn a room into a world');
  } finally { await context.close(); }
});
