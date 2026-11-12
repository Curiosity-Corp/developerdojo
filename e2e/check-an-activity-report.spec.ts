import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('the fictional report can be reconciled without JavaScript on a phone', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/check-an-activity-report/');
    await page.getByRole('link', { name: 'Inspect the evidence' }).click();
    await expect(page.getByRole('heading', { name: 'What the records say' })).toBeVisible();
    await expect(page.getByText(/account has not yet been checked/)).toBeVisible();
    await expect(page.getByText(/does not measure attendance or hours/)).toBeVisible();
    await expect(page.getByText(/note conflicts with the missed-meeting claim/)).toBeVisible();
    const prompt = page.getByLabel('Complete prompt and fictional records');
    await expect(prompt).toHaveValue(/A2: The export does not include external email/);
    await expect(prompt).toHaveValue(/B1: The organizer recorded/);
    await expect(prompt).toHaveValue(/C1: They say they assisted a client by phone/);
    await page.getByText('Quick check: does the export prove a teammate worked zero hours?').click();
    await expect(page.getByText('No. The export does not measure hours and excludes some work. Ask for context and check appropriate records.')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('the prompt copies all records and prohibits automated personnel decisions', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value: string) => sessionStorage.setItem('copied-activity', value) } });
  });
  await page.goto('/katas/check-an-activity-report/');
  await page.getByRole('button', { name: 'Copy the complete prompt' }).click();
  await expect(page.locator('#activity-copy-status')).toHaveText('Copied. Paste it into your assistant.');
  const copied = await page.evaluate(() => sessionStorage.getItem('copied-activity'));
  expect(copied).toContain('SOURCE A — an incomplete workspace export');
  expect(copied).toContain('SOURCE B — an organizer');
  expect(copied).toContain('SOURCE C — the fictional teammate');
  expect(copied).toContain('Do not infer hours, motive, location, another job, or overall performance');
  expect(copied).toContain('Do not rank the person, recommend discipline, or automate a personnel decision.');
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
});
