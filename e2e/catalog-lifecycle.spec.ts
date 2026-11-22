import { expect, test } from '@playwright/test';

// Catalog lifecycle (#96): each catalog entry says when it was verified, by which maintainer role, and its
// state; an entry that is not verified says why and what to do instead. Rendered at build time.

test('a curated kata shows when and by which role it was verified', async ({ page }) => {
  await page.goto('/fields/');
  const notice = page.locator('#ux .practice [data-lifecycle]').first();
  await expect(notice).toHaveAttribute('data-lifecycle', 'verified');
  await expect(notice).toContainText('Verified.');
  await expect(notice).toContainText('by the kata maintainer');
  await expect(notice.locator('time').first()).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
});

test('the reported Claude Code change shows as review due with fallback advice', async ({ page }) => {
  await page.goto('/armory/registry/');
  const notice = page.locator('#claude-code [data-lifecycle]');
  await expect(notice).toHaveAttribute('data-lifecycle', 'stale');
  await expect(notice).toContainText('Review due.');
  await expect(notice).toContainText('by the catalog maintainer');
  await expect(notice.locator('[data-lifecycle-fallback]')).toContainText('2.1.330');
  await expect(notice.locator('[data-lifecycle-fallback]')).toContainText('Check the linked source before you rely on it');
  await expect(page.locator('[data-registry-entry] [data-lifecycle]')).toHaveCount(24);
});

test('every kata recipe shows its lifecycle, with provenance on the recipe page', async ({ page }) => {
  await page.goto('/katas/recipes/');
  const items = page.locator('ul.recipes > li');
  const count = await items.count();
  for (let index = 0; index < count; index += 1) await expect(items.nth(index).locator('[data-lifecycle]')).toHaveCount(1);
  const first = items.first().getByRole('link').first();
  const href = await first.getAttribute('href');
  expect(href).toBeTruthy();
  await page.goto(href ?? '/');
  await expect(page.locator('[data-lifecycle]')).toHaveCount(1);
  await expect(page.locator('[data-lifecycle-provenance]')).toContainText('Provenance:');
});

test('the lifecycle ledger lists every entry with an owning role and no person names', async ({ request }) => {
  const response = await request.get('/catalog-lifecycle.json');
  expect(response.ok()).toBe(true);
  const ledger = (await response.json()) as { matrix: unknown[]; entries: { id: string; state: string; maintainerRole: string; surface: string }[] };
  expect(ledger.matrix).toHaveLength(8);
  expect(ledger.entries.find((entry) => entry.id === 'claude-code')).toMatchObject({ state: 'stale', maintainerRole: 'Catalog maintainer', surface: 'armory' });
  expect(ledger.entries.filter((entry) => entry.surface === 'kata')).toHaveLength(8);
  for (const entry of ledger.entries) expect(entry.maintainerRole.length).toBeGreaterThan(0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the state and fallback are in the page', async ({ page }) => {
    await page.goto('/armory/registry/');
    await expect(page.locator('#claude-code [data-lifecycle-fallback]')).toBeVisible();
    await page.goto('/fields/');
    await expect(page.locator('.practice [data-lifecycle="verified"]').first()).toBeVisible();
  });
});
