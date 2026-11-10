import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('a learner can find contribution worksheets and their review limits', async ({ page, request }) => {
  await page.goto('/sensei/');
  await page.getByRole('link', { name: 'prepare a kata contribution or review worksheet' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Make the next kata better');
  await expect(page.getByText('not a claim that a particular learner submitted', { exact: false })).toBeVisible();
  for (const file of ['kata-improvement.md', 'benchmark-correction.md', 'mentoring-feedback.md']) {
    const result = await request.get(`/examples/sensei/${file}`);
    expect(result.status(), file).toBe(200);
    expect((await result.text()).length, file).toBeGreaterThan(200);
  }
  await expect(page.getByText('This site does not save or submit them.', { exact: false })).toBeVisible();
});

test('worksheets remain available on a narrow phone without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/sensei/contribute/');
    await expect(page.getByRole('link', { name: 'Open and copy on a phone' })).toHaveCount(3);
    await expect(page.getByRole('heading', { name: 'Give private mentoring feedback' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('contribution page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/sensei/contribute/');
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')).toEqual([]);
});
