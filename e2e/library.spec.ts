import { expect, test } from '@playwright/test';

test('library groups pages by section and filters client-side', async ({ page }) => {
  await page.goto('/library');
  const headings = await page.locator('[data-section] h2').allInnerTexts();
  expect(headings.slice(0, 3)).toEqual(['The Way', 'Developer path', 'Master Developer']);

  const filter = page.locator('#library-filter');
  await filter.fill('licence');
  await expect(page.getByRole('link', { name: 'Open source licences in plain English' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Week 1: See the whole product' })).toBeHidden();

  await filter.fill('zzzz-no-match');
  await expect(page.locator('#library-empty')).toBeVisible();

  await filter.fill('');
  await expect(page.getByRole('link', { name: 'Week 1: See the whole product' })).toBeVisible();
});

test('a library page renders and links onward', async ({ page }) => {
  await page.goto('/library/people-write-epics');
  await expect(page.locator('h1')).toHaveText('People write epics');
  await page.getByRole('link', { name: /Next:/ }).click();
  await expect(page).toHaveURL(/\/library\/git-is-the-source-of-truth/);
});
