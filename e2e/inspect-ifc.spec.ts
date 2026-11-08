import { expect, test } from '@playwright/test';

test('a learner can trace a real IFC sample into an evidence report', async ({ page, request }) => {
  await page.goto('/katas/inspect-ifc/');
  await expect(page.getByRole('heading', { name: "What's inside a building model?" })).toBeVisible();
  const source = page.getByRole('link', { name: 'Open the real IFC sample' });
  await expect(source).toHaveAttribute('href', /buildingSMART\/Certification-datasets\/blob\/80d976a9b193a26a8e928c3e79bff67af1de68a8/);
  await expect(page.getByRole('img', { name: /wall number 45 has opening number 80/ })).toBeVisible();
  const prompt = page.getByLabel('Your complete prompt');
  await expect(prompt).toHaveValue(/Do not infer code compliance/);
  await page.getByText('Reveal the source checks').click();
  const checks = page.locator('details').filter({ has: page.getByText('Reveal the source checks') });
  await expect(checks).toContainText('#85');
  await expect(checks).toContainText('#112');
  await expect(checks).toContainText('empty label');
  await expect(page.getByText(/not an automated validation report/)).toBeVisible();
  const table = await request.get('/examples/ifc-evidence-example.csv');
  expect(table.status()).toBe(200);
  expect(await table.text()).toContain('Wall fire rating,#52,Empty label,No rating can be concluded');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test('the sample, prompt and checks work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/katas/inspect-ifc/');
    await expect(page.getByLabel('Your complete prompt')).toBeVisible();
    await page.getByText('Reveal the source checks').click();
    await expect(page.getByText(/does not.*prove a fire rating/i)).toBeVisible();
    await page.getByText('Windows PowerShell').click();
    await expect(page.getByText('py -m venv .venv', { exact: false })).toBeVisible();
  } finally {
    await context.close();
  }
});

test('the BIM field and 3D kata lead into information-model practice', async ({ page }) => {
  await page.goto('/fields/');
  await expect(page.getByRole('link', { name: 'Investigate a real IFC model' })).toHaveAttribute('href', '/katas/inspect-ifc');
  await page.goto('/katas/scan-a-room/');
  await expect(page.getByRole('link', { name: 'Inspect a real BIM information model' })).toHaveAttribute('href', '/katas/inspect-ifc');
});
