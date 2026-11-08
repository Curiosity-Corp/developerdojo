import { expect, test } from '@playwright/test';

test('belt practice explains the stages, domain evidence and review limits', async ({ page }) => {
  await page.goto('/belts');
  for (const title of ['White: See and explain', 'Yellow: Follow a kata', 'Green: Adapt the technique', 'Brown: Solve an unfamiliar challenge', 'Black: Improve and teach']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }
  for (const title of ['Software and prototypes', 'SaaS UX and visual design', '3D, BIM and construction', 'Business and data']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }
  await expect(page.getByText('not a grade, belt or certificate', { exact: false })).toBeVisible();
  await expect(page.getByText('not professional approval', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try a Randori-style challenge' })).toHaveAttribute('href', '/katas/constraint-roulette');
});

test('self-assessment remains separate by field, survives reload and can be cleared', async ({ page }) => {
  await page.goto('/belts');
  await page.getByLabel('Field', { exact: true }).selectOption('ux');
  await page.getByLabel('Stage I am practicing').selectOption('green');
  await page.getByLabel('I stated the outcome, audience and success checks.').check();
  await page.getByLabel('Evidence notes (optional)').fill('A fictional prototype; keyboard check recorded.');
  await page.getByRole('button', { name: 'Save this field on this device' }).click();
  await expect(page.locator('[data-belt-status]')).toContainText('not a belt or certificate');
  await page.getByLabel('Field', { exact: true }).selectOption('bim');
  await page.getByLabel('Evidence notes (optional)').fill('Practice model, units reviewed.');
  await page.getByRole('button', { name: 'Save this field on this device' }).click();
  await page.reload();
  await page.getByLabel('Field', { exact: true }).selectOption('ux');
  await expect(page.getByLabel('Stage I am practicing')).toHaveValue('green');
  await expect(page.getByLabel('I stated the outcome, audience and success checks.')).toBeChecked();
  await expect(page.getByLabel('Evidence notes (optional)')).toHaveValue('A fictional prototype; keyboard check recorded.');
  await page.getByRole('button', { name: 'Clear this field' }).click();
  await expect(page.getByLabel('Evidence notes (optional)')).toHaveValue('');
  await page.getByLabel('Field', { exact: true }).selectOption('bim');
  await expect(page.getByLabel('Evidence notes (optional)')).toHaveValue('Practice model, units reviewed.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test('unsaved field drafts remain available while switching fields', async ({ page }) => {
  await page.goto('/belts');
  await page.getByLabel('Evidence notes (optional)').fill('Keep this draft in the open page.');
  await page.getByLabel('Field', { exact: true }).selectOption('ux');
  await page.getByLabel('Field', { exact: true }).selectOption('software');
  await expect(page.getByLabel('Evidence notes (optional)')).toHaveValue('Keep this draft in the open page.');
  await expect(page.locator('[data-belt-status]')).toContainText('unsaved');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the belt guidance and review process remain readable', async ({ page }) => {
    await page.goto('/belts');
    await expect(page.getByRole('heading', { name: 'Five stages of practice' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Prepare an evidence review' })).toBeVisible();
    await expect(page.locator('[data-belt-journal]')).toBeHidden();
    await expect(page.getByText('The optional on-device checklist needs JavaScript.')).toBeVisible();
  });
});
