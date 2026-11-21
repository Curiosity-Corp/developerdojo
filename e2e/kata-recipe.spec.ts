import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Kata recipe pages (#86), shown with the labelled fixture recipes built from the #81 sector fixtures.
// Runs in both Playwright projects: desktop (1440 px) and mobile (Pixel 7, 390 px).

const UX = '/katas/fixture-fixux-001/';
const FOUNDATION = '/katas/fixture-fixfnd-001/';
const SECTIONS = [
  'The outcome', 'Showcase and provenance', 'Brief, inputs and constraints', 'Stack, permissions and cost', 'Why this stack',
  'Agents and review gates', 'Setup and smoke test', 'Prompts', 'Practice exercise', 'Execution and handoffs',
  'Tests, failures and corrections', 'Adapt it', 'Unseen Randori', 'Belt evidence', 'Connections', 'Downloads', 'Maintenance and caveats',
];

async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
}

const section = (page: Page, name: string) => page.locator('section').filter({ has: page.getByRole('heading', { level: 2, name, exact: true }) });

test('a fixture recipe renders every contract section, labelled as a fixture and kept out of search', async ({ page }) => {
  await page.goto(UX);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Design an accessible onboarding journey \(fixture\)/);
  await expect(page.locator('[data-status-banner]')).toContainText('Fixture. This is a fixture.');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('main')).toHaveAttribute('data-pagefind-ignore', /.*/);
  for (const name of SECTIONS) await expect(page.getByRole('heading', { level: 2, name, exact: true }), name).toHaveCount(1);
  const about = page.getByRole('definition').filter({ hasText: 'Kata template maintainer' });
  await expect(about).toBeVisible();
  // Outcome first: the first section after the identity block is the outcome.
  await expect(page.locator('article h2').first()).toHaveText('The outcome');
});

test('unavailable evidence reads as unavailable, never as verified', async ({ page }) => {
  await page.goto(UX);
  await expect(page.getByRole('term').filter({ hasText: 'Last verified' }).locator('xpath=following-sibling::dd[1]')).toContainText('Not available.');
  await expect(section(page, 'Showcase and provenance').locator('[data-unavailable]')).toContainText('Not available.');
  const checks = section(page, 'Tests, failures and corrections');
  await expect(checks.locator('[data-check-result="not-run"]')).toHaveCount(2);
  await expect(checks.locator('[data-check-result="passed"]')).toHaveCount(0);
  await expect(checks).toContainText('This is not a pass.');
  await expect(checks).not.toContainText('Passed');
  await expect(section(page, 'Setup and smoke test')).toContainText('Not run');
  await expect(section(page, 'Stack, permissions and cost').locator('[data-unavailable]').first()).toContainText('Not available.');

  await page.goto(FOUNDATION);
  for (const name of ['Showcase and provenance', 'Stack, permissions and cost', 'Agents and review gates', 'Setup and smoke test', 'Tests, failures and corrections', 'Unseen Randori']) {
    await expect(section(page, name).locator('[data-unavailable]'), name).toContainText('Not available.');
  }
});

test('prompts can be copied, one at a time', async ({ page }) => {
  await page.goto(UX);
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { (window as Window & { copied?: string }).copied = text; } } });
  });
  const block = page.locator('[data-copy-prompt-block]').filter({ hasText: 'Turn session notes into findings' });
  await block.getByRole('button', { name: 'Copy prompt: Turn session notes into findings' }).click();
  const copied = await page.evaluate(() => (window as Window & { copied?: string }).copied);
  expect(copied).toBe(await block.getByRole('textbox').inputValue());
  expect(copied).toContain('Do not add anything that is not in my notes.');
  await expect(block.getByText('Copied. Paste it into your assistant.')).toBeVisible();
  await expect(page.locator('[data-copy-prompt-block]').filter({ hasText: 'Draft the journey' }).getByText('You can also select and copy the text.')).toBeVisible();
});

test('prompts stay readable and the page fits without JavaScript at 320 px', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto(UX);
    await expect(page.getByRole('textbox', { name: 'Prompt text: Draft the journey' })).toHaveValue(/fictional invoicing app/);
    await expect(page.getByRole('button', { name: /Copy prompt/ })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally {
    await context.close();
  }
});

test('configuration downloads are served as plain text', async ({ page, request }) => {
  await page.goto(UX);
  const link = section(page, 'Downloads').getByRole('link', { name: 'agents.md' });
  await expect(link).toHaveAttribute('href', '/katas/fixture-fixux-001/agents.md');
  const response = await request.get('/katas/fixture-fixux-001/agents.md');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^text\/markdown/);
  const body = await response.text();
  expect(body).toContain('# Onboarding journey: agent roles (fixture)');
  expect(body).toContain('Nobody has run it.');
});

test('foundation, field, belt and review links go both ways', async ({ page }) => {
  await page.goto(UX);
  const connections = section(page, 'Connections');
  await connections.getByRole('link', { name: 'Define the finished outcome and how it will be checked' }).click();
  await expect(page).toHaveURL(/\/katas\/fixture-fixfnd-001\/?$/);
  await expect(section(page, 'Connections').getByRole('link', { name: 'Design an accessible onboarding journey' })).toHaveAttribute('href', '/katas/fixture-fixux-001');

  await page.goto(UX);
  await expect(section(page, 'Connections').getByRole('link', { name: 'UX and product design' })).toHaveAttribute('href', '/fields#ux');
  await page.goto('/fields/');
  await expect(page.locator('#ux').getByRole('link', { name: 'Design an accessible onboarding journey (fixture)' })).toHaveAttribute('href', '/katas/fixture-fixux-001');

  await page.goto(UX);
  const belt = section(page, 'Belt evidence');
  await expect(belt.getByRole('link', { name: 'See the belt stages' })).toHaveAttribute('href', '/belts');
  await expect(belt.getByRole('link', { name: 'Prepare a practice review' })).toHaveAttribute('href', '/belt-review');
  await page.goto('/belts/');
  await expect(page.locator('[data-recipe-links]').getByRole('link', { name: 'Design an accessible onboarding journey (fixture)' })).toBeVisible();
  await page.goto('/belt-review/');
  const reviewed = page.locator('[data-recipe-links]');
  await expect(reviewed.getByRole('link', { name: 'Design an accessible onboarding journey (fixture)' })).toBeVisible();
  // FIXFND-002 is self-checked only, so it has no QA review link.
  await expect(reviewed.getByRole('link', { name: /Change one part of the stack/ })).toHaveCount(0);
});

test('the recipe index is reachable from /katas and labels fixtures', async ({ page }) => {
  await page.goto('/katas/');
  await page.getByRole('link', { name: 'Browse kata recipes' }).click();
  await expect(page).toHaveURL(/\/katas\/recipes\/?$/);
  await expect(page.getByRole('heading', { level: 2, name: 'Template examples (fixtures)' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Design an accessible onboarding journey (fixture)' })).toBeVisible();
});

for (const theme of ['light', 'dark'] as const) {
  test(`recipe pages have no serious accessibility violations in ${theme} mode`, async ({ page }) => {
    for (const route of [UX, FOUNDATION, '/katas/recipes/']) {
      await page.goto(route);
      await setTheme(page, theme);
      const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const bad = report.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${route} ${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`);
      expect(bad).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), route).toBeLessThanOrEqual(0);
    }
  });
}
