import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a beginner can inspect the two-column comparison without JavaScript on a phone', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/research-and-compare/');
    await page.getByRole('link', { name: 'Inspect the comparison' }).click();
    const comparison = page.locator('#comparison');
    await expect(comparison.locator('article')).toHaveCount(4);
    for (const card of await comparison.locator('article').all()) {
      await expect(card.locator('dt')).toHaveText(['Baseline', 'Proposed']);
    }
    await expect(comparison.getByRole('heading', { name: 'B · Changed' })).toBeVisible();
    await expect(comparison.getByText('Mentor removed · S1.3, D2')).toBeVisible();
    await expect(comparison.getByText(/S2.1 only suggests an optional future trial/)).toBeVisible();
    await expect(page.getByLabel('Complete prompt, sources and draft')).toHaveValue(/S1\.1 Phase 1/);
    await page.getByText('Quick check: what may phase 1 change?').click();
    await expect(page.getByText(/None of the approved A–C wording/)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('the complete prompt can be copied, retaining the baseline and unapproved proposal', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value: string) => sessionStorage.setItem('copied-research', value) } });
  });
  await page.goto('/katas/research-and-compare/');
  await page.getByRole('button', { name: 'Copy the complete prompt' }).click();
  await expect(page.locator('#copy-status')).toHaveText('Copied. Paste it into your assistant.');
  const copied = await page.evaluate(() => sessionStorage.getItem('copied-research'));
  expect(copied).toContain('S1.1 Phase 1: copy stages A–C unchanged');
  expect(copied).toContain('S2.2 There is no measured completion data and no approval');
  expect(copied).toContain('D4 D: Mandatory peer workshops for everyone.');
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
});
