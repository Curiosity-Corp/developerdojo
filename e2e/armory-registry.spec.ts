import { expect, test } from '@playwright/test';

test('the registry identifies sources and lets a learner compare permissions', async ({ page }) => {
  await page.goto('/armory/registry/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Choose your tools');
  await expect(page.locator('[data-registry-entry]')).toHaveCount(10);
  const filter = page.getByLabel('Show a type');
  await filter.selectOption('mcp');
  await expect(page.locator('[data-registry-status]')).toHaveText('4 entries shown.');
  const community = page.locator('#blender-mcp');
  await expect(community).toBeVisible();
  await expect(community).toContainText('community; not Blender Foundation');
  await community.getByText('Compatibility, access and verification').click();
  await expect(community).toContainText('arbitrary Python execution');
  await expect(community.getByRole('link', { name: /Open the source/ })).toHaveAttribute('href', 'https://github.com/ahujasid/mcp-for-blender');
  await expect(page.locator('#gemini-cli')).toBeHidden();
  await filter.selectOption('all');
  await expect(page.locator('#gemini-cli')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test('the registry marks its documentation review as due after 90 days', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-02-05T12:00:00Z'));
  await page.goto('/armory/registry/');
  const notice = page.locator('[data-registry-review-date]');
  await expect(notice).not.toContainText('due for a documentation refresh');
  await page.clock.setFixedTime(new Date('2027-02-06T12:00:00Z'));
  await page.reload();
  await expect(notice).toContainText('due for a documentation refresh');
  await expect(notice).toContainText('not a security or compatibility guarantee');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('all source entries and their details remain available', async ({ page }) => {
    await page.goto('/armory/registry/');
    await expect(page.getByLabel('Show a type')).toBeHidden();
    await expect(page.locator('[data-registry-review-date]')).toContainText('Check the current source and terms');
    await expect(page.locator('[data-registry-entry]')).toHaveCount(10);
    const card = page.locator('#scan-to-threejs');
    await card.getByText('Compatibility, access and verification').click();
    await expect(card).toContainText('private capture files');
  });
});
