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
    ['vegetation', 'www.usgs.gov'],
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

test('a workshop prompt can be copied into an assistant', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => sessionStorage.setItem('test-copied-prompt', text) },
    });
  });
  await page.goto('/katas/industry-workshops/');
  const card = page.locator('#finance');
  await card.getByText('Open the Dojo exercise').click();
  await card.getByRole('button', { name: 'Copy prompt' }).click();
  await expect(card.locator('[data-copy-status]')).toHaveText('Copied. Paste it into your assistant.');
  const copied = await page.evaluate(() => sessionStorage.getItem('test-copied-prompt'));
  expect(copied).toContain('Summarize this fictional invoice');
  expect(copied).not.toContain('fictional case');
});

test('a blocked clipboard leaves the prompt available to select', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => { throw new Error('clipboard denied'); } },
    });
  });
  await page.goto('/katas/industry-workshops/');
  const card = page.locator('#finance');
  await card.getByText('Open the Dojo exercise').click();
  await card.getByRole('button', { name: 'Copy prompt' }).click();
  await expect(card.locator('[data-copy-status]')).toContainText('copy command');
  expect(await page.evaluate(() => window.getSelection()?.toString())).toContain('Summarize this fictional invoice');
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


test('science and agriculture lead to the same reusable, verifiable practice', async ({ page }) => {
  await page.goto('/fields/');
  for (const field of ['science', 'agriculture']) {
    await expect(page.locator(`#${field}`).getByRole('link', { name: 'Investigate a vegetation signal' }))
      .toHaveAttribute('href', '/katas/industry-workshops#vegetation');
  }
  await page.locator('#agriculture').getByRole('link', { name: 'Investigate a vegetation signal' }).click();
  const card = page.locator('#vegetation');
  await expect(card.locator('blockquote')).toBeVisible();
  await expect(card.locator('blockquote')).toContainText('fictional surface reflectance');
  await expect(card.getByText('a zero denominator is undefined', { exact: false })).toBeVisible();
  await expect(card.getByText('0.5', { exact: false })).toBeVisible();
});
