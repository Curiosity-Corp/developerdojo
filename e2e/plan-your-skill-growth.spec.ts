import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('a learner can check the skill plan on a phone without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/plan-your-skill-growth/');
    await page.getByRole('link', { name: 'Build the plan' }).click();
    await expect(page.getByLabel('Complete planning prompt and fictional records')).toHaveValue(/no calendar booking, completed practice, feedback, certificate or outcome is documented/);
    await page.getByText('Reveal the independent check').click();
    await expect(page.getByText('approval is pending', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Practicing a skill is not the same as earning a certification.', { exact: false })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('the complete planning prompt can be copied and the provider guide is linked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => sessionStorage.setItem('growth-prompt-copy', text) },
    });
  });
  await page.goto('/katas/plan-your-skill-growth/');
  await page.getByRole('button', { name: 'Copy planning prompt' }).click();
  const copied = await page.evaluate(() => sessionStorage.getItem('growth-prompt-copy'));
  expect(copied).toContain('FICTIONAL PRACTICE RECORDS');
  expect(copied).toContain('No deadline for client approval is recorded');
  await expect(page.getByText('Copied. Paste it into your assistant.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'GitLab Handbook’s one-to-one guide' })).toHaveAttribute('href', 'https://handbook.gitlab.com/handbook/leadership/1-1/');
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual([]);
});
