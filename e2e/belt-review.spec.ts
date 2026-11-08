import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('a learner can find a review packet with evidence and honest boundaries', async ({ page, request }) => {
  await page.goto('/belts/');
  await page.getByRole('link', { name: 'Prepare a practice review packet' }).click();
  await expect(page).toHaveURL(/\/belt-review\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Show the work');
  await expect(page.getByText(/does not assign a reviewer, score an assessment, issue a belt/)).toBeVisible();
  await expect(page.getByText(/a separate Maintainer decides/)).toBeVisible();
  const response = await request.get('/examples/belt-review-packet.md');
  expect(response.status()).toBe(200);
  const packet = await response.text();
  for (const term of ['Not yet observed', 'Randori', 'permissions', 'qualified professional review', 'not a belt']) {
    expect(packet.toLowerCase()).toContain(term.toLowerCase());
  }
  expect(packet).toContain('| Adaptation under a new constraint |');
  expect(packet).not.toContain('https://');
});

test('the review example and packet work without JavaScript on a narrow screen', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/belt-review/');
    const example = page.getByText('See a fictional review example');
    await example.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText(/2 × \$4 \+ 3 × \$5/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download the blank review packet' })).toHaveAttribute('href', '/examples/belt-review-packet.md');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally {
    await context.close();
  }
});

test('the review page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/belt-review/');
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
});
