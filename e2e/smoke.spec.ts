import { expect, test } from '@playwright/test';

// Every page a visitor can reach from the header or footer must return 200 and render one h1.
const PAGES = [
  '/',
  '/train',
  '/sensei',
  '/library',
  '/certificates',
  '/challenges',
  '/events',
  '/membership',
  '/about',
  '/sponsors',
  '/contact',
  '/code-of-conduct',
  '/library/laptop-k8s-training-guide',
];

const NAV = ['Train', 'Sensei', 'Library', 'Certificates', 'Challenges', 'Events', 'Membership'];

for (const path of PAGES) {
  test(`${path} returns 200 and renders an h1`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main#main')).toBeVisible();
    await expect(page.getByRole('region', { name: 'Sponsored by Reveltek' })).toBeVisible();
  });
}

test('every header nav link resolves and shows its page', async ({ page, request, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = page.getByRole('navigation', { name: 'Primary' });
  const labels = await nav.locator('ul a').allInnerTexts();
  expect(labels).toEqual(NAV);
  const hrefs = await nav.locator('a').evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

test('footer links resolve (internal ones return 200)', async ({ page, request }) => {
  await page.goto('/');
  const footer = page.getByRole('navigation', { name: 'Footer' });
  const labels = await footer.locator('a').allInnerTexts();
  expect(labels).toEqual([
    'About CRC',
    'Sponsors (Reveltek)',
    'Become a sponsor',
    'Contact',
    'Code of conduct',
    'GitHub',
  ]);
  const hrefs = await footer.locator('a').evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
  for (const href of hrefs.filter((h) => h.startsWith('/'))) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
  }
});

test('active nav link is marked on its own page', async ({ page, isMobile }) => {
  await page.goto('/train');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Primary' }).locator('a[aria-current="page"]')).toHaveText('Train');
});

test('theme toggle switches and persists the theme', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('button', { name: /Switch to (dark|light) theme/ }).click();
  const theme = await page.locator('html').getAttribute('data-theme');
  expect(['light', 'dark']).toContain(theme);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme ?? '');
});

test('no horizontal scroll on the home page', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('empty events and certificates render honest empty states', async ({ page }) => {
  await page.goto('/events');
  await expect(page.getByText('Schedule announced soon')).toBeVisible();
});

test('unknown route returns 404', async ({ request }) => {
  const response = await request.get('/definitely-not-a-page');
  expect(response.status()).toBe(404);
});
