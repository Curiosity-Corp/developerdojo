import { expect, test } from '@playwright/test';

const katas = [
  'research-and-compare',
  'meeting-to-momentum',
  'opportunity-follow-through',
  'check-an-activity-report',
  'lead-a-learning-session',
  'plan-your-skill-growth',
];

test.describe('device options without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  for (const kata of katas) {
    test(`${kata} offers usable phone and desktop paths`, async ({ page }) => {
      await page.goto(`/katas/${kata}/`);
      const guide = page.locator('[data-kata-device-options]');
      await guide.getByText('Choose your setup · phone, computer or paper').click();
      for (const name of ['Phone · ChatGPT app', 'Phone · Claude app', 'Windows', 'macOS', 'Linux']) {
        await expect(guide.getByText(name, { exact: true })).toBeVisible();
      }
      await guide.getByText('Phone · ChatGPT app', { exact: true }).click();
      await expect(guide.getByText('Open the app, start a chat', { exact: false }).first()).toBeVisible();
      const linux = guide.locator('details').filter({ has: page.getByText('Linux', { exact: true }) });
      await linux.getByText('Linux', { exact: true }).click();
      await expect(linux.locator('p')).toContainText('a terminal');
      await expect(guide.getByRole('link', { name: 'expanded setup guide' })).toHaveAttribute('href', '/katas/spark-ideas#device-options');
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    });
  }
});
