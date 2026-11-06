import { expect, test } from '@playwright/test';

test('the homepage introduces the Dojo spaces and leads with outcomes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'From an outcome to the skills to develop it.' })).toBeVisible();
  for (const [label, href] of [
    ['Visit the Gallery', '/gallery'],
    ['Study the approach', '/katas'],
    ['Explore the stack', '/stack-lab'],
    ['Explore fields', '/fields'],
    ['Visit the Armory', '/armory'],
    ['Visit the Arena', '/arena'],
    ['Explore belts', '/belts'],
    ['Explore Randori', '/randori'],
    ['Explore missions', '/missions'],
  ]) {
    await expect(page.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
  }
  await page.getByRole('link', { name: 'Explore outcomes', exact: true }).click();
  await expect(page).toHaveURL(/\/gallery\/?$/);
  await expect(page.locator('main h1')).toBeVisible();
});

test('the kata hub connects shared foundations and field-specific practice', async ({ page }) => {
  await page.goto('/katas');
  await expect(page.getByText('The orchestrator is the developer.', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Enter the Stack Lab' })).toHaveAttribute('href', '/stack-lab');
  await expect(page.getByRole('link', { name: 'Explore fields' })).toHaveAttribute('href', '/fields');
  await expect(page.getByRole('link', { name: 'Explore Randori' })).toHaveAttribute('href', '/randori');
  await expect(page.getByText('The exercise and its verified recipe are still being prepared.', { exact: false })).toBeVisible();
});
