import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('a learner can trace the assumptions and evidence to a real IFC sample', async ({ page, request }) => {
  await page.goto('/katas/inspect-ifc');
  await page.getByRole('link', { name: 'Trace a wall quantity to this model' }).click();
  await expect(page).toHaveURL(/\/katas\/ifc-quantity-trace\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Can you trace the quantity?');
  await expect(page.getByRole('img', { name: 'One wall face and one opening' })).toBeVisible();
  await expect(page.getByText('not a stored IFC quantity', { exact: false })).toBeVisible();
  await expect(page.getByLabel('Your complete prompt')).toHaveValue(/Relationship #85 links the wall and opening/);
  await page.getByText('Check the arithmetic').click();
  const checks = page.locator('details').filter({ has: page.getByText('Check the arithmetic') });
  await expect(checks).toContainText('6 − 1 = 5 m²');
  await expect(checks).toContainText('The thickness is not another face-area multiplier');
  const csv = await request.get('/examples/ifc-quantity-evidence.csv');
  expect(csv.status()).toBe(200);
  expect(await csv.text()).toContain('Estimated remaining face,#45 #80 #85,6 m² − 1 m²,5 m²');
});

test('the result, evidence and Randori remain available without JavaScript on a phone', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/ifc-quantity-trace');
    await expect(page.getByLabel('Your complete prompt')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy the prompt' })).toHaveCount(0);
    const answer = page.getByText('Reveal one check');
    await answer.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Two identical broad faces give', { exact: false })).toContainText('10 m²');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('the quantity kata has no serious accessibility violations', async ({ page }) => {
  await page.goto('/katas/ifc-quantity-trace');
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')).toEqual([]);
});
