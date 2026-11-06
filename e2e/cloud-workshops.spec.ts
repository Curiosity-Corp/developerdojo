import { expect, test } from '@playwright/test';

test('cloud workshops point to real provider material and offer follow-up checks', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore cloud workshops' }).click();
  await expect(page).toHaveURL(/\/katas\/cloud-workshops/);
  for (const id of ['azure', 'aws', 'oracle', 'google']) {
    const card = page.locator(`#${id}`);
    await expect(card.getByRole('link', { name: 'Explore official training' })).toHaveAttribute('href', /^https:\/\//);
    await expect(card.getByRole('link', { name: 'Open the official exercise' })).toHaveAttribute('href', /^https:\/\//);
    await card.locator('summary').click();
    await expect(card.locator('details')).toHaveAttribute('open', '');
  }
  await expect(page.getByText('A budget alert alone does not stop spending.')).toBeVisible();
});
