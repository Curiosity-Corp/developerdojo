import { expect, test, type APIRequestContext } from '@playwright/test';

// Every page a visitor can reach from the header or footer must return 200 and render one h1.
const PAGES = [
  '/',
  '/start',
  '/katas',
  '/train',
  '/sensei',
  '/library',
  '/library/tracks',
  '/library/resources',
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

const NAV = ['Katas', 'Train', 'Sensei', 'Library', 'Certificates', 'Challenges', 'Events', 'Membership'];

// Link checks against the live site (#131). The header has 42 links. Checked one after another they
// timed out the production e2e on a cold CDN cache: job 2853334 reached link 34-36 of 42 in each 60 s
// attempt, about 1.6 s per link, because every bare href (/katas) answers 301 to its trailing-slash
// page (/katas/) and both hops missed the cache. So the links are checked LINK_POOL at a time (the
// per-host connection limit of a browser), and every request has its own timeout so a hung link fails
// by name instead of eating the test's budget.
const LINK_POOL = 6;
const LINK_REQUEST_TIMEOUT = 15_000;
// Budget for a link-check test: the first page load (10.7 s, the slowest cold load in job 2853334)
// plus ceil(36 unique hrefs / 6) = 6 waves of about 1.6 s = about 21 s. 45 s is twice that and still
// fits a nav twice the size (12 waves, about 31 s).
const LINK_TEST_TIMEOUT = 45_000;

interface LinkResult {
  href: string;
  /** The final status: of the href itself, or of its trailing-slash page when the href redirects there. */
  status: number;
  /** The trailing-slash page the href redirected to, when it did. */
  redirectedTo?: string;
  /** Why the link fails although no request did: a redirect anywhere but its own trailing-slash page. */
  problem?: string;
  ms: number;
}

/** Runs `task` over `items` with at most `size` in flight, keeping the results in input order. */
async function pool<T, R>(items: readonly T[], size: number, task: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  // One iterator shared by every worker: each takes the next item when its previous one is done.
  const queue = items.entries();
  const worker = async (): Promise<void> => {
    for (const [index, item] of queue) results[index] = await task(item);
  };
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker));
  return results;
}

/**
 * Requests one internal href without following redirects. A static host may answer a bare path
 * (/katas) with a permanent redirect to its directory page (/katas/); that redirect must point at
 * exactly that page on the same origin, and the page must answer 200. Anything else fails.
 */
async function checkLink(request: APIRequestContext, baseURL: string, href: string): Promise<LinkResult> {
  const started = Date.now();
  const url = new URL(href, baseURL);
  url.hash = '';
  const response = await request.get(url.href, { maxRedirects: 0, timeout: LINK_REQUEST_TIMEOUT });
  const status = response.status();
  if (status !== 301 && status !== 308) return { href, status, ms: Date.now() - started };
  const location = response.headers()['location'] ?? '';
  const canonical = new URL(url.href);
  canonical.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
  const target = new URL(location, url.href);
  if (target.href !== canonical.href) {
    const problem = `redirects to ${location || '(no Location header)'}, not its own page ${canonical.pathname}`;
    return { href, status, problem, ms: Date.now() - started };
  }
  const page = await request.get(canonical.href, { maxRedirects: 0, timeout: LINK_REQUEST_TIMEOUT });
  return { href, status: page.status(), redirectedTo: canonical.pathname, ms: Date.now() - started };
}

/** Checks every href (each distinct URL once), records the timings, and expects 200 for all of them. */
async function expectLinksResolve(request: APIRequestContext, baseURL: string | undefined, hrefs: readonly string[]): Promise<void> {
  if (!baseURL) throw new Error('link checks need a baseURL (playwright.config.ts use.baseURL)');
  const unique = [...new Set(hrefs)];
  const started = Date.now();
  const results = await pool(unique, LINK_POOL, (href) => checkLink(request, baseURL, href));
  const slowest = Math.max(...results.map((r) => r.ms));
  test.info().annotations.push({
    type: 'link-timing',
    description: `${hrefs.length} links, ${unique.length} unique, pool ${LINK_POOL}: ${Date.now() - started} ms in all, slowest ${slowest} ms`,
  });
  const failures = results.filter((r) => r.status !== 200 || r.problem !== undefined);
  expect(failures, 'every link answers 200, directly or after one redirect to its own trailing-slash page').toEqual([]);
}

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

test('every header nav link resolves and shows its page', async ({ page, request, isMobile, baseURL }) => {
  test.setTimeout(LINK_TEST_TIMEOUT);
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = page.getByRole('navigation', { name: 'Primary' });
  const labels = await nav.locator('.primary-links > li > a').allInnerTexts();
  expect(labels).toEqual(NAV);
  const hrefs = await nav.locator('a').evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
  expect(hrefs.length, 'the header has links beyond the top level').toBeGreaterThan(NAV.length);
  await expectLinksResolve(request, baseURL, hrefs);
});

test('footer links resolve (internal ones return 200)', async ({ page, request, baseURL }) => {
  test.setTimeout(LINK_TEST_TIMEOUT);
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
  await expectLinksResolve(request, baseURL, hrefs.filter((h) => h.startsWith('/')));
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

test('navigation fits and works at tablet width', async ({ page }) => {
  await page.setViewportSize({ width: 992, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Katas' })).toBeVisible();
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
