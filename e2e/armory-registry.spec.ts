import { expect, test } from '@playwright/test';

test('the registry lists tested entries and keeps candidates apart', async ({ page }) => {
  await page.goto('/armory/registry/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Choose your tools');
  await expect(page.locator('[data-registry-entry][data-listed="true"]')).toHaveCount(7);
  await expect(page.locator('#candidates [data-registry-entry]')).toHaveCount(16);
  const filter = page.getByLabel('Show a type');
  await filter.selectOption('mcp');
  await expect(page.locator('[data-registry-status]')).toHaveText('2 listed and 2 not listed yet shown.');
  const listed = page.locator('#mcp-filesystem');
  await listed.getByText('Versions, permissions and evidence').click();
  await expect(listed.locator('[data-smoke-test]')).toContainText('Access denied');
  await expect(listed.getByRole('link', { name: 'mcp-filesystem.json' })).toHaveAttribute('href', '/examples/armory/mcp-filesystem.json');
  const community = page.locator('#blender-mcp');
  await expect(community).toBeVisible();
  await expect(community).toContainText('Not affiliated with the Blender Foundation');
  await community.getByText('What is known and what is missing').click();
  await expect(community.locator('[data-gaps]')).toContainText('no recorded smoke test');
  await expect(page.locator('#gemini-cli')).toBeHidden();
  await filter.selectOption('all');
  await expect(page.locator('#gemini-cli')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test('stack recipes link to their entries and the katas that use them', async ({ page }) => {
  await page.goto('/armory/registry/');
  const recipe = page.locator('[data-stack-recipe="git-and-node"]');
  await expect(recipe.getByRole('link', { name: 'Git' })).toHaveAttribute('href', '#git');
  await expect(recipe.getByRole('link', { name: 'Open-source patch lab' })).toHaveAttribute('href', '/katas/open-source-patch-lab');
});

test('an entry shows review due once its next review date has passed', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-02-20T12:00:00Z'));
  await page.goto('/armory/registry/');
  const due = page.locator('#git [data-review-due]');
  await expect(due).toBeHidden();
  await page.clock.setFixedTime(new Date('2027-02-21T12:00:00Z'));
  await page.reload();
  await expect(due).toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('every entry and its details remain available', async ({ page }) => {
    await page.goto('/armory/registry/');
    await expect(page.getByLabel('Show a type')).toBeHidden();
    await expect(page.locator('[data-registry-entry]')).toHaveCount(23);
    const card = page.locator('#scan-to-threejs');
    await card.getByText('What is known and what is missing').click();
    await expect(card.locator('[data-security-review]')).toContainText('api.polyhaven.com');
  });
});
