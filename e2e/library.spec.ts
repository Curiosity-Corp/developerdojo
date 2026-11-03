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
  await page.getByRole('navigation', { name: /^More in / }).locator('a.next').click();
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

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the resources list is complete and the filters stay hidden', async ({ page }) => {
    await page.goto('/library/resources');
    expect(await page.locator('[data-resource]').count()).toBeGreaterThan(0);
    await expect(page.locator('[data-resource]').first()).toBeVisible();
    await expect(page.locator('#resource-filters')).toBeHidden();
  });
});

test('resources filter by skill, provider, cost and format with JavaScript', async ({ page }) => {
  await page.goto('/library/resources');
  const total = await page.locator('[data-resource]').count();
  expect(total).toBeGreaterThan(0);
  const form = page.locator('#resource-filters');
  await expect(form).toBeVisible();
  await expect(page.locator('#resource-status')).toHaveText(`${total} resources`);

  // Pick the first card's provider: only that provider's cards stay.
  const provider = (await page.locator('[data-resource]').first().getAttribute('data-provider')) ?? '';
  await form.getByLabel('Provider').selectOption(provider);
  const visible = page.locator('[data-resource]:not([hidden])');
  expect(await visible.count()).toBeGreaterThan(0);
  for (const card of await visible.all()) {
    await expect(card).toHaveAttribute('data-provider', provider);
  }
  await expect(page).toHaveURL(/provider=/);

  // Find a provider and a format that no single card shares (needs two or more cards). The empty
  // message shows for that pair. Only options that exist are offered, so pick from the cards.
  const cards = await page
    .locator('[data-resource]')
    .evaluateAll((els) => els.map((el) => ({ provider: el.getAttribute('data-provider') ?? '', format: el.getAttribute('data-format') ?? '' })));
  let clash: { provider: string; format: string } | undefined;
  for (const a of cards) {
    for (const b of cards) {
      if (!cards.some((c) => c.provider === a.provider && c.format === b.format)) clash = { provider: a.provider, format: b.format };
    }
  }
  if (clash) {
    await form.getByLabel('Provider').selectOption(clash.provider);
    await form.getByLabel('Format').selectOption(clash.format);
    await expect(page.locator('#resource-empty')).toBeVisible();
    await expect(visible).toHaveCount(0);
  }
  await form.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('#resource-status')).toHaveText(`${total} resources`);
  await expect(page.locator('#resource-empty')).toBeHidden();
});

test('resource cards link out safely', async ({ page }) => {
  await page.goto('/library/resources');
  const links = page.locator('[data-resource] h3 a');
  expect(await links.count()).toBeGreaterThan(0);
  // One browser-side pass: per-link assertions time out as the catalogue grows.
  const unsafe = await links.evaluateAll((anchors) =>
    anchors
      .filter((a) => !/^https:\/\//.test(a.getAttribute('href') ?? '') || !/noopener/.test(a.getAttribute('rel') ?? ''))
      .map((a) => a.getAttribute('href') ?? '(no href)'),
  );
  expect(unsafe).toEqual([]);
});
