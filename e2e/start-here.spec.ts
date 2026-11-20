import { expect, test } from '@playwright/test';

// #79: a visitor on a phone or a desktop (both Playwright projects) learns what a developer is, sees the two
// layers and the terms, and can still reach every existing training route with progress intact.

test('the home page states the definition and leads to Start here', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The orchestrator is the developer.' })).toBeVisible();
  await expect(page.locator('.layer-list')).toContainText('Universal foundation.');
  await expect(page.locator('.layer-list')).toContainText('Field expertise.');
  await page.getByRole('link', { name: 'Start here', exact: true }).click();
  await expect(page).toHaveURL(/\/start\/?$/);
  await expect(page.locator('main h1')).toContainText('The orchestrator is the developer');
});

test('Start here shows the two layers, the honest journey, the path and the terms', async ({ page }, testInfo) => {
  await page.goto('/start');
  // Validation evidence for the MR: a full-page capture per project (desktop 1440, phone 390) in the HTML report.
  await testInfo.attach('start-' + testInfo.project.name, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  await expect(page.getByRole('heading', { name: 'Universal foundation', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Field expertise', exact: true })).toBeVisible();
  const steps = page.locator('.journey > li');
  await expect(steps).toHaveCount(5);
  for (let i = 0; i < 5; i += 1) {
    await expect(steps.nth(i).locator('.status')).toContainText(/^(Available now|Partly available)\./);
  }
  await expect(page.locator('.journey')).toContainText('Belts are a practice checklist and are not issued yet.');
  for (const rank of ['Developer', 'Master Developer', 'Sensei']) {
    await expect(page.locator('.rank-path').getByText(rank, { exact: true })).toBeVisible();
  }
  for (const term of ['Kata', 'Belt', 'Randori', 'Mission', 'Sensei']) {
    await expect(page.locator('.terms dt', { hasText: new RegExp('^' + term + '$') })).toBeVisible();
  }
  await expect(page.locator('main')).not.toContainText(/supersed|replaces the (old|previous) rules/i);
});

test('every link on Start here resolves, including the existing training routes', async ({ page }) => {
  await page.goto('/start');
  const hrefs = await page.locator('main a[href^="/"]').evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute('href') ?? ''))]);
  for (const route of ['/train', '/library/developer-path-overview', '/library/master-developer-overview', '/library/tracks', '/library', '/certificates', '/library/glossary']) {
    expect(hrefs).toContain(route);
  }
  for (const href of hrefs) {
    const path = href.split('#')[0] ?? '';
    if (!path) continue;
    const response = await page.request.get(path);
    expect(response.status(), href).toBeLessThan(400);
  }
});

test('progress marked on Train survives a visit to Start here', async ({ page }) => {
  await page.goto('/train');
  await page.locator('[data-module="developer-week-1"]').click();
  await page.goto('/start');
  await page.getByRole('link', { name: /Training paths and your progress/ }).click();
  await expect(page).toHaveURL(/\/train\/?$/);
  await expect(page.locator('[data-module="developer-week-1"]')).toHaveAttribute('aria-pressed', 'true');
});

test('the Train menu offers Start here on phone and desktop', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await nav.getByLabel('Explore Train options').click();
  await nav.getByRole('link', { name: /Start here/ }).click();
  await expect(page).toHaveURL(/\/start\/?$/);
});
