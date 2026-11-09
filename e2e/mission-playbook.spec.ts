import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('a learner can prepare and download a private mission brief', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(`${request.url()}\n${request.postData() ?? ''}`));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => { document.documentElement.dataset.copiedMission = text; } },
    });
  });
  await page.goto('/missions/');
  await page.getByRole('link', { name: 'Build a mission brief' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Take a kata into the world');
  await expect(page.getByText('not a completed customer mission', { exact: false })).toBeVisible();
  const input = page.getByLabel('Your editable mission brief');
  await expect(input).toHaveValue(/Authorized inputs and permissions/);
  await input.fill('Fictional learner mission: verify the estimate.');
  await page.getByRole('button', { name: 'Copy my brief' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-copied-mission', 'Fictional learner mission: verify the estimate.');
  const pending = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download my brief' }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe('mission-brief.md');
  const path = await download.path();
  expect(path).not.toBeNull();
  if (path) expect(await readFile(path, 'utf8')).toBe('Fictional learner mission: verify the estimate.');
  expect(requests.join('\n')).not.toContain('Fictional learner mission');
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))).not.toContain('Fictional learner mission');
});

test('the blank template and learning steps work without JavaScript', async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/mission-playbook/');
    await expect(page.getByLabel('Your editable mission brief')).toHaveValue(/not proof that a mission or review happened/);
    await expect(page.getByRole('button', { name: 'Copy my brief' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Download my brief' })).toHaveCount(0);
    const template = await request.get('/examples/mission-brief.md');
    expect(template.status()).toBe(200);
    expect(await template.text()).toContain('Independent review and qualified professional approval');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});

test('the mission playbook has no serious accessibility violations', async ({ page }) => {
  await page.goto('/mission-playbook/');
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
});
