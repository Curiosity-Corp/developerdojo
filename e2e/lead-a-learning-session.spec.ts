import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('a learner can prepare and check the peer session on a phone without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/lead-a-learning-session/');
    await page.getByRole('link', { name: 'Plan the session' }).click();
    await expect(page.getByLabel('Session-planning prompt and fictional note')).toHaveValue(/Do not invent an attendee/);
    await page.getByText('Reveal the independent check').click();
    await expect(page.getByText('It does not say how many passed', { exact: false })).toBeVisible();
    await expect(page.getByText('not yet run', { exact: false })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('the complete session prompt can be copied and the page has no serious axe violations', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => sessionStorage.setItem('session-prompt-copy', text) },
    });
  });
  await page.goto('/katas/lead-a-learning-session/');
  await page.getByRole('button', { name: 'Copy session prompt' }).click();
  const copied = await page.evaluate(() => sessionStorage.getItem('session-prompt-copy'));
  expect(copied).toContain('FICTIONAL PRACTICE NOTE');
  expect(copied).toContain('Do not send invitations');
  await expect(page.getByText('Copied. Paste it into your assistant.')).toBeVisible();
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
});
