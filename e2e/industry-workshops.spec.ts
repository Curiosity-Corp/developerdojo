import { expect, test } from '@playwright/test';

test('the homepage takes learners straight to industry workshops', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore industry workshops' }).click();
  await expect(page).toHaveURL(/\/katas\/industry-workshops\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Build across industries');
});

test('industry workshops offer official lessons and reusable agent exercises', async ({ page }) => {
  await page.goto('/katas/industry-workshops/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Build across industries');

  const workshops = [
    ['product-design', 'www.autodesk.com'],
    ['customer-operations', 'trailhead.salesforce.com'],
    ['education', 'www.canva.com'],
    ['audio', 'elevenlabs.io'],
    ['finance', 'github.com'],
    ['agent-systems', 'developers.cloudflare.com'],
    ['robotics', 'docs.isaacsim.omniverse.nvidia.com'],
    ['career-skills', 'skillsbuild.org'],
  ];
  for (const [id, domain] of workshops) {
    const card = page.locator(`#${id}`);
    await expect(card.getByRole('heading', { level: 2 })).toBeVisible();
    const url = await card.getByRole('link', { name: /Start with/ }).getAttribute('href');
    expect(new URL(url ?? '').hostname).toBe(domain);
    await card.getByText('Open the Dojo exercise').click();
    await expect(card.locator('blockquote')).not.toBeEmpty();
    await expect(card.getByRole('heading', { name: '3. Verify' })).toBeVisible();
  }
  await expect(page.getByText('A simulation is not proof of physical safety', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the exercise and answer are available on the page', async ({ page }) => {
    await page.goto('/katas/industry-workshops/');
    const card = page.locator('#customer-operations');
    await card.getByText('Open the Dojo exercise').click();
    await expect(card.locator('blockquote')).toContainText('fictional case');
    await card.getByText('Quick check: Why use fictional data?').click();
    await expect(card.getByText('It lets you practice without sharing private customer information with a tool.')).toBeVisible();
  });
});
