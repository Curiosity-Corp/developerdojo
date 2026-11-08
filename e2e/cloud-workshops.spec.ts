import { expect, test } from '@playwright/test';

test('cloud workshops point to real provider material and offer follow-up checks', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore cloud workshops' }).click();
  await expect(page).toHaveURL(/\/katas\/cloud-workshops/);
  for (const id of ['azure', 'aws', 'oracle', 'google']) {
    const card = page.locator(`#${id}`);
    await expect(card.getByRole('link', { name: 'Explore official training' })).toHaveAttribute('href', /^https:\/\//);
    await expect(card.getByRole('link', { name: 'Open the official exercise' })).toHaveAttribute('href', /^https:\/\//);
    await expect(card.getByRole('link', { name: 'Read the provider guidance' })).toHaveAttribute('href', /^https:\/\//);
    await expect(card.getByRole('link', { name: 'Read cleanup guidance' })).toHaveAttribute('href', /^https:\/\//);
    await card.locator('summary').click();
    await expect(card.locator('details')).toHaveAttribute('open', '');
  }
  await expect(page.getByText('A budget alert alone does not stop spending.')).toBeVisible();
});

test('cloud workshop access, cleanup and assistant review remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/katas/cloud-workshops/');
  await expect(page.locator('#google')).toContainText('allow public access');
  await expect(page.locator('#oracle')).toContainText('preserves its boot volume');
  await expect(page.locator('#aws')).toContainText('log group and execution role');
  await expect(page.locator('#azure')).toContainText('Deleting a resource group also deletes its other resources');
  const review = page.locator('.agent-practice');
  await review.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Assistant review prompt')).toHaveValue(/Do not connect to my account or execute changes/);
  await context.close();
});
