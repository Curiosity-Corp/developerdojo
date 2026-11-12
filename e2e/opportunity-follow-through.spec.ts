import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('a beginner can check the fictional opportunity on a phone without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/opportunity-follow-through/');
    await page.getByRole('link', { name: 'Start with the example' }).click();
    await expect(page.getByLabel('Complete prompt and fictional records')).toHaveValue(/Do not invent a person, price, sale, revenue/);
    await page.getByText('Reveal the independent check').click();
    await expect(page.getByText('Mira drafts a response for internal review by 12 May', { exact: false })).toBeVisible();
    await expect(page.getByText('the budget, purchase date and revenue are unknown', { exact: false })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('the complete practice prompt can be copied and the source is official', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => sessionStorage.setItem('opportunity-prompt-copy', text) },
    });
  });
  await page.goto('/katas/opportunity-follow-through/');
  await page.getByRole('button', { name: 'Copy practice prompt' }).click();
  const copied = await page.evaluate(() => sessionStorage.getItem('opportunity-prompt-copy'));
  expect(copied).toContain('FICTIONAL PRACTICE RECORDS');
  expect(copied).toContain('No message has been sent');
  await expect(page.getByText('Copied. Paste it into your assistant.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'HubSpot Academy’s Inbound Sales course' })).toHaveAttribute('href', 'https://academy.hubspot.com/courses/inbound-sales');
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
});
