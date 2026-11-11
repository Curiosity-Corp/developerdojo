import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('a learner can start the review on a phone without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/');
    await page.getByRole('link', { name: 'Start the delegation kata' }).click();
    await page.getByRole('link', { name: 'Review a draft now' }).click();
    const prompt = page.getByLabel('Reviewer prompt and source data · editable');
    await expect(prompt).toContainText('DRAFT START');
    await expect(prompt).toContainText('S104');
    await expect(prompt).toContainText('No duplicates were removed');
    await page.getByText('Reveal the independent check').click();
    await expect(page.getByText(/Four complete unique sales contain seven units/)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('the reviewer prompt can be edited and copied without losing its source', async ({ page }) => {
  await page.goto('/katas/delegate-and-review/');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text; } } });
  });
  const prompt = page.getByLabel('Reviewer prompt and source data · editable');
  await prompt.fill((await prompt.inputValue()).replace('Seven rows came in. No duplicates were removed. Five complete sales brought in $26 from eight units. There were no exceptions.', 'My builder report'));
  await page.getByRole('button', { name: 'Copy reviewer prompt' }).click();
  const copied = await page.evaluate(() => (window as Window & { copied?: string }).copied);
  expect(copied).toContain('My builder report');
  expect(copied).toContain('S104');
  await expect(page.getByText('Copied. Paste it into a fresh conversation.')).toBeVisible();
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
});
