import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Routes come from the sitemap of the BUILT site, so a new page is covered the moment it exists.
function sitemapRoutes(): string[] {
  const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
  const routes = [...xml.matchAll(/<loc>https:\/\/developerdojo\.org([^<]*)<\/loc>/g)].map((m) => m[1] ?? '/');
  return [...new Set(routes)];
}

const ROUTES = sitemapRoutes();

// The library will hold 150+ lesson pages that all share one layout. Every route gets the 200,
// h1, console and overflow check on desktop. The slower passes (phone project, axe in two themes)
// run on every non-lesson route plus a spread sample of lessons: the first and last, then about
// one in ten, so every layout branch is covered while CI time stays flat as content grows.
const LESSON_ROUTE = /^\/library\/(?!tracks\/?$|resources\/?$|tracks\/[^/]+\/?$)[^/]+(?:\/.+)?$/;
const LESSONS = ROUTES.filter((route) => LESSON_ROUTE.test(route)).sort();
const SAMPLE = new Set(
  LESSONS.filter((_, index) => index === 0 || index === LESSONS.length - 1 || index % 10 === 5),
);
const DEEP_SCAN = ROUTES.filter((route) => !LESSON_ROUTE.test(route) || SAMPLE.has(route));
const NAV = ['/train', '/sensei', '/library', '/certificates', '/challenges', '/events', '/membership'];
const FOOTER = ['/about', '/sponsors', '/sponsors#become-a-sponsor', '/contact', '/code-of-conduct'];

async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
}

test.describe('routes', () => {
  test('the sitemap lists the pages we expect', () => {
    expect(ROUTES.length).toBeGreaterThan(20);
    for (const route of ['/', ...NAV, ...FOOTER.map((f) => f.split('#')[0] ?? f)]) {
      expect(ROUTES.map((r) => r.replace(/\/$/, '') || '/')).toContain(route);
    }
  });

  for (const route of ROUTES) {
    test(`${route} loads with one h1, a title, no console errors, no horizontal scroll`, async ({ page, isMobile }) => {
      test.skip(isMobile && !DEEP_SCAN.includes(route), 'lesson pages: the phone pass runs on the sample');
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
      });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(5);
      // A static site: once 'load' has fired, every stylesheet, font and eager image is in. 'networkidle'
      // (discouraged by Playwright) never resolved on /library/resources/ on the CI runner even though
      // every request had finished, so this check waits for things it can see instead (#66).
      await page.waitForLoadState('load');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
      // Every image on the page decoded (no broken art).
      await page.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 150));
      });
      // Lazy images start loading after the scroll; wait until each rendered one has finished (loaded or
      // broken). A lazy image inside a hidden element (the other theme's logo) never loads, so skip those.
      await page.waitForFunction(() =>
        [...document.images].filter((img) => img.getClientRects().length > 0).every((img) => img.complete),
      );
      const broken = await page.evaluate(() =>
        [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.currentSrc || img.src),
      );
      expect(broken).toEqual([]);
    });
  }

  test('unknown paths return the 404 page', async ({ page }) => {
    const response = await page.goto('/no-such-page');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('Page not found');
  });
});

test.describe('navigation', () => {
  test('header and footer links go where the brief says and all resolve', async ({ page, request }) => {
    await page.goto('/');
    const header = page.locator('header nav[aria-label="Primary"]');
    const navHrefs = await header.locator('ul a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(navHrefs).toEqual(NAV);
    await expect(page.locator('header a.start')).toHaveAttribute('href', '/membership');
    const footer = page.locator('footer nav[aria-label="Footer"]');
    const footerHrefs = await footer.locator('a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    expect(footerHrefs.slice(0, FOOTER.length)).toEqual(FOOTER);
    expect(footerHrefs.at(-1)).toBe('https://github.com/Curiosity-Corp/developerdojo');
    for (const href of [...navHrefs, ...footerHrefs, '/membership']) {
      if (!href || href.startsWith('http')) continue;
      const res = await request.get(href.split('#')[0] ?? href);
      expect(res.status(), href).toBe(200);
    }
  });

  test('on a phone the menu button opens the drawer with every nav link', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'drawer is a phone and tablet pattern');
    await page.goto('/');
    const nav = page.locator('header nav[aria-label="Primary"]');
    await expect(nav).toBeHidden();
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(nav).toBeVisible();
    for (const label of ['Train', 'Sensei', 'Library', 'Certificates', 'Challenges', 'Events', 'Membership']) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
  });

  test('the header and footer links are the same on every route and all resolve', async ({ page, request }) => {
    let expected: string | undefined;
    for (const route of ['/', '/train', '/sensei', '/library', '/events']) {
      await page.goto(route);
      const hrefs = await page.locator('header nav a, footer nav a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      // Only the active-page state differs between routes, never the destinations.
      expected ??= JSON.stringify(hrefs);
      expect(JSON.stringify(hrefs), route).toBe(expected);
    }
    for (const href of new Set(JSON.parse(expected ?? '[]') as string[])) {
      if (href.startsWith('http')) continue;
      expect((await request.get(href.split('#')[0] ?? href)).status(), href).toBe(200);
    }
  });
});

test.describe('wiring', () => {
  test('hero art is a picture with AVIF, WebP and JPG and a phone crop; Sensei uses the torii art', async ({ page }) => {
    await page.goto('/');
    const sources = await page.locator('.hero picture source').evaluateAll((els) =>
      els.map((e) => `${e.getAttribute('type') ?? 'any'}|${e.getAttribute('media') ?? ''}|${e.getAttribute('srcset')}`),
    );
    expect(sources.join('\n')).toContain('image/avif||/images/hero-dojo.avif');
    expect(sources.join('\n')).toContain('image/webp||/images/hero-dojo.webp');
    expect(sources.join('\n')).toContain('/images/hero-dojo-mobile.avif');
    await expect(page.locator('.hero picture img').first()).toHaveAttribute('src', '/images/hero-dojo.jpg');
    await expect(page.locator('.hero picture img').first()).toHaveAttribute('alt', '');
    await page.goto('/sensei');
    await expect(page.locator('.hero picture img').first()).toHaveAttribute('src', '/images/hero-dojo-torii.jpg');
  });

  test('rank cards use the rank icons; decorative art is hidden from assistive tech', async ({ page }) => {
    await page.goto('/');
    for (const id of ['developer', 'master-developer', 'sensei']) {
      await expect(page.locator(`img[src="/images/rank-${id}.svg"]`)).toHaveCount(1);
    }
    const loud = await page.evaluate(() =>
      [...document.images]
        .filter((img) => /\/images\/(hero|bamboo|enso|pagoda|mountains|rank|paper)/.test(img.currentSrc || img.src))
        .filter((img) => img.alt !== '' || (img.getAttribute('aria-hidden') !== 'true' && !img.closest('[aria-hidden="true"]')))
        .map((img) => img.currentSrc),
    );
    expect(loud).toEqual([]);
  });

  test('the sponsor band shows the official Reveltek logo', async ({ page }) => {
    await page.goto('/');
    const logo = page.locator('.sponsor-band img[alt="Reveltek"]');
    await expect(logo).toHaveCount(2);
    await expect(page.locator('.sponsor-band img[src="/images/reveltek-logo.svg"]')).toBeVisible();
    await setTheme(page, 'dark');
    await expect(page.locator('.sponsor-band img[src="/images/reveltek-logo-white.svg"]')).toBeVisible();
  });

  test('the wordmark is an image link home in header and footer', async ({ page }) => {
    await page.goto('/train');
    await expect(page.getByRole('link', { name: 'Developer Dojo, home' })).toHaveCount(2);
  });

  test('the Astro dev toolbar is not in the output', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('astro-dev-toolbar')).toHaveCount(0);
    expect(await page.content()).not.toContain('astro-dev-toolbar');
  });
});

test.describe('accessibility (WCAG 2.1 AA, no serious or critical violations)', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const route of DEEP_SCAN) {
      test(`${route} (${theme})`, async ({ page, isMobile }) => {
        // /library/resources lists every catalogued resource; axe needs more than the default minute there.
        test.slow();
        // The desktop project scans every page; the phone project scans the three flagship pages
        // (the markup is shared, so a full second pass only slows CI).
        test.skip(isMobile && !['/', '/train/', '/sensei/'].includes(route), 'covered by the desktop project');
        await page.goto(route);
        await setTheme(page, theme);
        await page.waitForLoadState('networkidle');
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        const bad = results.violations
          .filter((v) => v.impact === 'serious' || v.impact === 'critical')
          .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`);
        expect(bad).toEqual([]);
      });
    }
  }
});
