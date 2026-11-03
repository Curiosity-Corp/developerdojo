import { expect, test } from '@playwright/test';

test('library groups pages by section and filters client-side', async ({ page }) => {
  await page.goto('/library');
  const headings = await page.locator('[data-section] h2').allInnerTexts();
  expect(headings.slice(0, 3)).toEqual(['The Way', 'Developer path', 'Master Developer']);

  const filter = page.locator('#library-filter');
  await filter.fill('licence');
  await expect(page.getByRole('link', { name: 'Open source licences in plain English' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Week 1: See the whole product' })).toBeHidden();

  await filter.fill('zzzz-no-match');
  await expect(page.locator('#library-empty')).toBeVisible();

  await filter.fill('');
  await expect(page.getByRole('link', { name: 'Week 1: See the whole product' })).toBeVisible();
});

test('a library page renders and links onward', async ({ page }) => {
  await page.goto('/library/people-write-epics');
  await expect(page.locator('h1')).toHaveText('People write epics');
  await page.getByRole('link', { name: /Next:/ }).click();
  await expect(page).toHaveURL(/\/library\/git-is-the-source-of-truth/);
});

test('the library links to the tracks and resources hubs', async ({ page }) => {
  await page.goto('/library');
  await expect(page.getByRole('link', { name: 'Learning tracks' })).toHaveAttribute('href', '/library/tracks');
  await expect(page.getByRole('link', { name: 'Learning resources' })).toHaveAttribute('href', '/library/resources');
});

test('the tracks page lists every track and each track page lists its lessons in order', async ({ page }) => {
  await page.goto('/library/tracks');
  await expect(page.locator('h1')).toHaveText('Learning tracks');
  const hrefs = await page
    .locator('main a[href^="/library/tracks/"]')
    .evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
  for (const href of hrefs) {
    await page.goto(href);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Lessons in order' })).toBeVisible();
  }
});

test('resources list works without JavaScript and filters with it', async ({ browser }) => {
  const plain = await browser.newContext({ javaScriptEnabled: false });
  const noJs = await plain.newPage();
  await noJs.goto('/library/resources');
  const total = await noJs.locator('[data-resource]').count();
  expect(total).toBeGreaterThan(0);
  await expect(noJs.locator('[data-resource]').first()).toBeVisible();
  await expect(noJs.locator('#resource-filters')).toBeHidden();
  await plain.close();

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('/library/resources');
  const form = page.locator('#resource-filters');
  await expect(form).toBeVisible();
  await expect(page.locator('#resource-status')).toHaveText(`${total} resources`);

  // Pick the first provider, check only its cards stay.
  const provider = await page.locator('[data-resource]').first().getAttribute('data-provider');
  await form.getByLabel('Provider').selectOption(provider ?? '');
  const visible = page.locator('[data-resource]:not([hidden])');
  expect(await visible.count()).toBeGreaterThan(0);
  for (const card of await visible.all()) {
    await expect(card).toHaveAttribute('data-provider', provider ?? '');
  }
  await expect(page).toHaveURL(/provider=/);

  // An impossible combination shows the empty message; clearing restores everything.
  await form.getByLabel('Cost').selectOption('paid');
  await form.getByLabel('Format').selectOption('podcast');
  if ((await visible.count()) === 0) await expect(page.locator('#resource-empty')).toBeVisible();
  await form.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('#resource-status')).toHaveText(`${total} resources`);
  await context.close();
});

test('resource cards link out safely', async ({ page }) => {
  await page.goto('/library/resources');
  const links = page.locator('[data-resource] h3 a');
  expect(await links.count()).toBeGreaterThan(0);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('href', /^https:\/\//);
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});
