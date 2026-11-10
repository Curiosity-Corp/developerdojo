import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('learners can reach the kata and find the complete stack and evidence', async ({ page, request }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Customize open source' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Keep the upstream');
  await expect(page.getByText('Hello from upstream + locally owned feature', { exact: true })).toBeVisible();
  await page.getByText('All ingredients', { exact: true }).click();
  await expect(page.getByText('No skill, MCP server, plugin or external API is required.', { exact: false })).toBeVisible();
  await expect(page.getByText('Renovate does not automatically combine repositories or resolve conflicts.', { exact: false })).toBeVisible();
  await expect(page.getByText('The Dojo has not installed or tested this integration.', { exact: false })).toBeVisible();
  for (const file of ['app.mjs', 'feature.patch', 'two-repo-lab.sh', 'upgrade-loop.sh', 'product-catalog.csv', 'license-catalog.csv', 'LICENSE.txt']) {
    const response = await request.get(`/examples/oss-patch-lab/${file}`);
    expect(response.status(), file).toBe(200);
    expect((await response.text()).length, file).toBeGreaterThan(10);
  }
});

test('phone readers can inspect the exercise and prompt without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/open-source-patch-lab/');
    await page.getByText('Phone · ChatGPT, Claude or another assistant', { exact: true }).click();
    await expect(page.getByText('This is a reading exercise:', { exact: false })).toBeVisible();
    await page.getByText('Practice an upgrade and a blocked release', { exact: true }).click();
    await expect(page.getByText('this exercise does not install or run Renovate', { exact: false })).toBeVisible();
    await expect(page.getByLabel('Prompt for your assistant')).toHaveValue(/Do not copy restricted enterprise code/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('the kata and its expanded instructions have no serious accessibility violations', async ({ page }) => {
  await page.goto('/katas/open-source-patch-lab/');
  await page.locator('main details').evaluateAll((items) => {
    for (const item of items) if (item instanceof HTMLDetailsElement) item.open = true;
  });
  const commands = page.locator('main pre').nth(2);
  await commands.focus();
  await expect(commands).toBeFocused();
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(result.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
});
