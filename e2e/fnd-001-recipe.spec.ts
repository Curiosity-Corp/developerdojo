import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// FND-001 (#84): the first operational harness-stack kata, a draft recipe page. Its measured comparisons come
// from the Arena records; proposed ones say they were not run. Runs in both projects (desktop and Pixel 7).

const RECIPE = '/katas/fnd-001-stack-comparison/';
const section = (page: Page, name: string) => page.locator('section').filter({ has: page.getByRole('heading', { level: 2, name, exact: true }) });

async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
}

test('the FND-001 recipe is a labelled draft that starts with the outcome', async ({ page }) => {
  await page.goto(RECIPE);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Build a working prototype, then change one stack variable');
  await expect(page.locator('[data-kata-recipe="FND-001"]')).toHaveAttribute('data-recipe-status', 'draft');
  await expect(page.locator('[data-status-banner]')).toContainText('Comparisons marked proposed were designed but not run');
  await expect(page.locator('article h2').first()).toHaveText('The outcome');
  await expect(section(page, 'Showcase and provenance').getByRole('link', { name: 'See the showcase' })).toHaveAttribute('href', '/examples/pocket-garden.html');
});

test('measured comparisons show their numbers and evidence; proposed ones show none', async ({ page }) => {
  await page.goto(RECIPE);
  const comparisons = section(page, 'Controlled comparisons');
  const rows = comparisons.locator('[data-comparison-variable]');
  await expect(rows).toHaveCount(6);
  expect(await rows.evaluateAll((items) => items.map((item) => `${item.getAttribute('data-comparison-variable')}:${item.getAttribute('data-comparison-status')}`))).toEqual([
    'harness:measured', 'model:measured', 'instructions:measured', 'skill:proposed', 'tool:proposed', 'delegation:proposed',
  ]);
  for (const row of await comparisons.locator('[data-comparison-status="measured"]').all()) {
    await expect(row.locator('table')).toContainText('95% interval');
    await expect(row.getByRole('link', { name: /^Evidence record ARN-00\d$/ })).toBeVisible();
  }
  for (const row of await comparisons.locator('[data-comparison-status="proposed"]').all()) {
    await expect(row.locator('table')).toHaveCount(0);
    await expect(row.locator('[data-proposed]')).toContainText('Proposed, not run. No results.');
  }
  await comparisons.locator('[data-comparison-variable="harness"]').getByRole('link', { name: 'Evidence record ARN-003' }).click();
  await expect(page).toHaveURL(/\/arena\/evidence\/fnd-001-harness\/?$/);
  await expect(page.locator('[data-kata-link]').getByRole('link')).toHaveAttribute('href', /\/katas\/fnd-001-stack-comparison\/?$/);
});

test('the rubric, failures, transfer challenge and prompts are on the page', async ({ page }) => {
  await page.goto(RECIPE);
  const checks = section(page, 'Tests, failures and corrections');
  await expect(checks.locator('[data-check-result="passed"]')).toHaveCount(14);
  await expect(checks).toContainText('instructions-r3');
  await expect(checks).toContainText('qwen-code-r3');
  await expect(section(page, 'Unseen Randori')).toContainText('Tool Library');
  await expect(section(page, 'Unseen Randori')).toContainText('Not run by the Dojo');
  await expect(section(page, 'Prompts')).toContainText('Prompt A, the task brief (baseline)');
  await expect(section(page, 'Practice exercise').getByRole('link', { name: 'Open the exercise' })).toHaveAttribute('href', '/katas/first-prototype');
});

test('the check sheet and the blank record download as Markdown', async ({ page, request }) => {
  await page.goto(RECIPE);
  const downloads = section(page, 'Downloads');
  for (const [name, expected] of [['fnd-001-check-sheet.md', 'pressed-state'], ['comparison-record.md', '"not shown", never 0']] as const) {
    const href = await downloads.getByRole('link', { name }).getAttribute('href');
    expect(href).toBe(`/katas/fnd-001-stack-comparison/${name}`);
    const response = await request.get(href ?? '');
    expect(response.status(), name).toBe(200);
    expect(response.headers()['content-type'], name).toMatch(/^text\/markdown/);
    expect(await response.text(), name).toContain(expected);
  }
});

for (const theme of ['light', 'dark'] as const) {
  test(`the FND-001 recipe has no serious accessibility violations in ${theme} mode and no sideways scroll`, async ({ page }) => {
    await page.goto(RECIPE);
    await setTheme(page, theme);
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const bad = report.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`);
    expect(bad).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  });
}
