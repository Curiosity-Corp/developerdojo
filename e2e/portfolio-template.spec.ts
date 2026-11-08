import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const html = readFileSync(new URL('../templates/learner-portfolio/index.html', import.meta.url), 'utf8');

test('the standalone starter reflows and remains accessible', async ({ page, isMobile }) => {
  if (isMobile) await page.setViewportSize({ width: 320, height: 720 });
  await page.setContent(html);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('What will you develop?');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  const link = page.getByRole('link', { name: 'Explore my work' });
  await link.focus();
  await expect(link).toBeFocused();
  await link.press('Enter');
  await expect(page.locator('#work')).toBeInViewport();
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')).toEqual([]);
});
