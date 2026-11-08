import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const addition = '\n\nBefore answering, compare the requested filters, toggle and reload behavior against your draft. Identify any uncertainty in the checklist; do not present a mental review as an observed test.';

test('a learner can inspect the result and run a controlled experiment', async ({ page, request }) => {
  await page.goto('/katas/stack-workbench/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('One outcome. Your stack.');
  await expect(page.getByText('the original harness and model versions were not recorded', { exact: false })).toBeVisible();
  const reference = page.frameLocator('iframe[title="Pocket Garden reference"]');
  await reference.getByRole('button', { name: 'Loves sun' }).click();
  await expect(reference.getByRole('heading', { name: 'Basil' })).toBeVisible();
  await expect(reference.getByRole('heading', { name: 'Mint' })).toBeHidden();
  const a = await page.getByLabel('Complete prompt A').inputValue();
  const b = await page.getByLabel('Complete prompt B').inputValue();
  expect(b).toBe(a + addition);
  expect(a).toContain('Do not read or change files or run commands');
  const sample = await request.get('/examples/pocket-garden.html');
  expect(sample.status()).toBe(200);
  const license = await request.get('/examples/pocket-garden-license.txt');
  expect(await license.text()).toContain('MIT License');
  await page.getByLabel('Your HTML').fill(await sample.text());
  await page.getByRole('button', { name: 'Preview my creation' }).click();
  const preview = page.frameLocator('iframe[title="Your prototype preview"]');
  await preview.getByRole('button', { name: 'Likes shade' }).click();
  await expect(preview.getByRole('heading', { name: 'Mint' })).toBeVisible();
  await expect(preview.getByRole('heading', { name: 'Basil' })).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test('the phone path, CLI setup and record work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/katas/stack-workbench/');
    await expect(page.getByLabel('Complete prompt A')).toBeVisible();
    await expect(page.getByLabel('Your stack record')).toBeVisible();
    const cli = page.getByText('Computer · Claude Code CLI');
    await cli.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('claude --version', { exact: false })).toBeVisible();
    await page.getByText('Windows PowerShell').click();
    await expect(page.getByText('irm https://claude.ai/install.ps1 | iex')).toBeVisible();
    await expect(page.getByText('Turn on JavaScript to preview here.', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Preview my creation' })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally {
    await context.close();
  }
});

test('learners can copy a complete prompt and their edited record', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => { document.documentElement.dataset.copied = text; } },
    });
  });
  await page.goto('/katas/stack-workbench/');
  await page.getByRole('button', { name: 'Copy prompt B' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-copied', /Before answering, compare/);
  await page.getByLabel('Your stack record').fill('My observation: shade showed Mint.');
  await page.getByRole('button', { name: 'Copy my record' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-copied', 'My observation: shade showed Mint.');
});

test('Stack Lab links to the workbench', async ({ page }) => {
  await page.goto('/stack-lab/');
  await page.getByRole('link', { name: 'Start the stack workbench' }).click();
  await expect(page).toHaveURL(/\/katas\/stack-workbench\/?$/);
});

test('the workbench has no serious accessibility violations', async ({ page }) => {
  await page.goto('/katas/stack-workbench/');
  const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(report.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')).toEqual([]);
});
