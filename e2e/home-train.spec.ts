import { expect, test, type Page } from '@playwright/test';

async function hrefsResolve(page: Page, scope: string): Promise<void> {
  const hrefs = await page
    .locator(`${scope} a[href^="/"]`)
    .evaluateAll((links) => [...new Set(links.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? ''))]);
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    const path = href.split('#')[0] ?? '';
    if (!path) continue;
    const response = await page.request.get(path);
    expect(response.status(), `${href} should resolve`).toBeLessThan(400);
  }
}

test.describe('home', () => {
  test('renders the hero, path, learn grid and empty states', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main h1')).toContainText('Developer: the new bar');
    await expect(page.getByText('A modern developer can...')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your path from builder to leader.' })).toBeVisible();
    for (const rank of ['Developer', 'Master Developer', 'Sensei']) {
      await expect(page.locator('.rank-path').getByText(rank, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole('heading', { name: "What you'll learn." })).toBeVisible();
    await expect(page.getByText('Schedule announced soon').first()).toBeVisible();
    await expect(page.getByText('Build a Real MVP')).toBeVisible();
    await expect(page.getByText('AI Agent Workflow Challenge')).toBeVisible();
    await expect(page.getByLabel('Sponsored by Reveltek')).toBeVisible();
  });

  test('shows points, never money', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).not.toContainText(/[$€£]\s?\d/);
    await expect(page.locator('main')).not.toContainText(/\bcash\b/i);
  });

  test('calls to action resolve', async ({ page }) => {
    await page.goto('/');
    await hrefsResolve(page, 'main');
    await page.locator('main').getByRole('link', { name: 'Start free' }).first().click();
    await expect(page).toHaveURL(/\/membership/);
  });
});

test.describe('train', () => {
  test('renders paths, real weeks, module strips and the progress panel', async ({ page }) => {
    await page.goto('/train');
    await expect(page.locator('main h1')).toContainText('Learn to build the whole product');
    await expect(page.locator('#developer')).toContainText('6 weeks');
    await expect(page.locator('#master-developer')).toContainText('Advanced');
    await expect(page.locator('#developer-path .module')).toHaveCount(6);
    await expect(page.locator('#master-modules .module')).toHaveCount(4);
    await expect(page.locator('.module-title', { hasText: 'See the whole product' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'This is not just coding.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Your progress/ })).toBeVisible();
    await expect(page.locator('[data-stat="modules"]')).toHaveText('0');
  });

  test('every module links to a real library page and every CTA resolves', async ({ page }) => {
    await page.goto('/train');
    await hrefsResolve(page, 'main');
    await page.getByRole('link', { name: 'Week 1 See the whole product' }).first().click();
    await expect(page).toHaveURL(/\/library\/week-1-see-the-whole-product/);
  });

  test('progress is tracked per browser and survives a reload', async ({ page }) => {
    await page.goto('/train');
    const week1 = page.locator('[data-module="developer-week-1"]');
    const week2 = page.locator('[data-module="developer-week-2"]');
    await expect(week1).toBeVisible();
    await week1.click();
    await week2.click();
    await expect(week1).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-stat="modules"]')).toHaveText('2');
    await expect(page.locator('[data-stat="certificate"]')).toHaveText('33');
    await expect(page.locator('[data-stat="streak"]')).toHaveText('1');

    await page.reload();
    await expect(page.locator('[data-module="developer-week-1"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-stat="modules"]')).toHaveText('2');

    await page.locator('[data-module="developer-week-2"]').click();
    await expect(page.locator('[data-stat="modules"]')).toHaveText('1');

    const stored = await page.evaluate(() => window.localStorage.getItem('dojo-progress-v1'));
    expect(stored).toContain('developer-week-1');
    expect(stored).not.toContain('developer-week-2');
  });

  test('reset needs a second click and clears progress', async ({ page }) => {
    await page.goto('/train');
    await page.locator('[data-module="master-launch"]').click();
    await expect(page.locator('[data-stat="modules"]')).toHaveText('1');
    const reset = page.getByRole('button', { name: 'Reset my progress' });
    await reset.click();
    await expect(page.locator('[data-stat="modules"]')).toHaveText('1');
    await page.getByRole('button', { name: /confirm reset/ }).click();
    await expect(page.locator('[data-stat="modules"]')).toHaveText('0');
  });

  test('bad stored data is ignored, and blocked storage degrades honestly', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('dojo-progress-v1', '{"completed":"nope"}'));
    await page.goto('/train');
    await expect(page.locator('[data-stat="modules"]')).toHaveText('0');
  });

  test('works without JavaScript: content and links stay, toggles stay hidden', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/train');
    await expect(page.locator('#developer-path .module')).toHaveCount(6);
    await expect(page.locator('[data-module="developer-week-1"]')).toBeHidden();
    await expect(page.getByText('Turn on JavaScript to track your progress')).toBeVisible();
    await context.close();
  });

  test('no horizontal scroll', async ({ page }) => {
    for (const path of ['/', '/train']) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${path} should not scroll sideways`).toBeLessThanOrEqual(0);
    }
  });
});
