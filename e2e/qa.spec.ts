import { readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { recordCatalogMetric } from './catalog-metrics';

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
const NAV = ['/katas', '/train', '/sensei', '/library', '/certificates', '/challenges', '/events', '/membership'];
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
    test.describe(() => {
      // Decide before Playwright creates a browser page for a skipped mobile case.
      test.skip(({ isMobile }) => isMobile && !DEEP_SCAN.includes(route), 'lesson pages: the phone pass runs on the sample');
      test(`${route} loads with one h1, a title, no console errors, no horizontal scroll`, async ({ page }) => {
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
        // Every image on the page decoded (no broken art). A jump to the bottom only starts the lazy images near
        // the bottom: a lazy image in the middle of a long page stays unrequested, so img.complete never turns true
        // and the wait below hung once the home page grew taller on a phone (#79). Ask every rendered lazy image
        // to load now, so the check covers all of them.
        await page.evaluate(async () => {
          for (const img of document.images) {
            if (img.loading === 'lazy' && img.getClientRects().length > 0) img.loading = 'eager';
          }
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise((r) => setTimeout(r, 150));
        });
        // Wait until each rendered image has finished (loaded or broken). An image inside a hidden element (the
        // other theme's logo) never loads, so skip those.
        await page.waitForFunction(() =>
          [...document.images].filter((img) => img.getClientRects().length > 0).every((img) => img.complete),
        );
        const broken = await page.evaluate(() =>
          [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.currentSrc || img.src),
        );
        expect(broken).toEqual([]);
      });
    });
  }

  test('unknown paths return the 404 page', async ({ page }) => {
    const response = await page.goto('/no-such-page');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('Page not found');
  });
});

// Reflow (WCAG 1.4.10): a phone at 200 percent zoom is about 195 CSS pixels wide, and 320 is the width the
// standard names. No page may scroll sideways at either (#68). These are the pages that once did, plus
// lessons whose tables must scroll inside their own box instead of widening the page.
const REFLOW_ROUTES = [
  '/',
  '/train/',
  '/sensei/',
  '/certificates/',
  '/events/',
  '/library/',
  '/library/tracks/',
  '/library/tracks/git-and-gitlab/',
  '/library/tracks/robot-software/',
  '/library/tracks/robot-learning/',
  '/library/tracks/bioinformatics/',
  '/library/tracks/lab-automation-in-code/',
  '/library/template-personas/',
  '/library/resources/',
  '/library/tracks/frameworks/24-running-android-ops-in-gitlab/',
  '/library/case-study-epics-and-roadmap/',
  '/library/catalogue-trailmug-full-example/',
  '/challenges/build-a-real-mvp/',
  // Kata recipe template (long resource IDs once overflowed it at 195 px), the UX pathway and its working example (#91).
  '/katas/fixture-fixux-001/',
  '/katas/ux-pathway/',
  '/examples/pocket-invoice/',
  '/examples/pocket-invoice-prototype/',
  // The BIM pathway and its longest recipe page (#92).
  '/katas/bim-pathway/',
  '/katas/bim-003-ids-check/',
  '/katas/bim-006-quantity-trace/',
  // The agriculture pathway and its widest recipe page (#93).
  '/katas/agriculture-pathway/',
  '/katas/agr-003-irrigation-need/',
  // The science pathway and its widest recipe page (#93).
  '/katas/science-pathway/',
  '/katas/sci-002-uncertainty-budget/',
  // The finance pathway and its widest recipe page (#93).
  '/katas/finance-pathway/',
  '/katas/fin-003-apr-tolerance/',
  // The manufacturing pathway and its widest recipe page (#93).
  '/katas/manufacturing-pathway/',
  '/katas/mfg-002-control-limits/',
  // The media pathway and its widest recipe page (#93).
  '/katas/media-pathway/',
  '/katas/med-002-measure-loudness/',
  // The education pathway and its widest recipe page (#93).
  '/katas/education-pathway/',
  '/katas/edu-002-run-act-rules/',
  // The health pathway and its widest recipe page (#93).
  '/katas/health-pathway/',
  '/katas/hlt-002-bmi-for-age-percentile/',
  // Optional Ignite Curiosity journeys (#83).
  '/journeys/',
  '/journeys/robotics/',
  '/journeys/biotechnology/',
];

test.describe('reflow: no sideways scroll on a narrow phone', () => {
  test.skip(({ isMobile }) => isMobile, 'the viewport is set here; the desktop project runs it once');
  for (const width of [195, 320]) {
    for (const route of REFLOW_ROUTES) {
      test(`${route} fits ${width} px wide`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(route);
        await page.waitForLoadState('load');
        const result = await page.evaluate(() => {
          const viewport = document.documentElement.clientWidth;
          const overflow = document.documentElement.scrollWidth - viewport;
          const offenders = overflow > 0
            ? Array.from(document.querySelectorAll('body *'))
                .map((element) => ({
                  tag: element.tagName.toLowerCase(),
                  className: element.getAttribute('class'),
                  right: Math.round(element.getBoundingClientRect().right),
                  text: (element.textContent ?? '').trim().slice(0, 80),
                }))
                .filter((element) => element.right > viewport)
                .sort((a, b) => b.right - a.right)
                .slice(0, 10)
            : [];
          return { overflow, offenders };
        });
        expect(result.overflow, `horizontal overflow in px at ${width} px: ${JSON.stringify(result.offenders)}`).toBeLessThanOrEqual(0);
      });
    }
  }

  test('a wide table in a lesson scrolls inside its own box, not the page', async ({ page }) => {
    await page.setViewportSize({ width: 195, height: 800 });
    await page.goto('/library/catalogue-trailmug-full-example/');
    const tables = await page.locator('.prose table').evaluateAll((els) =>
      els.map((el) => ({ overflowX: getComputedStyle(el).overflowX, scrolls: el.scrollWidth > el.clientWidth })),
    );
    expect(tables.length).toBeGreaterThan(0);
    for (const t of tables) expect(t.overflowX).toBe('auto');
    expect(tables.some((t) => t.scrolls)).toBe(true);
    // The table is still a table to assistive technology.
    expect(await page.getByRole('table').count()).toBeGreaterThan(0);
  });
});

test.describe('navigation', () => {
  test('header and footer links go where the brief says and all resolve', async ({ page, request }) => {
    await page.goto('/');
    const header = page.locator('header nav[aria-label="Primary"]');
    const navHrefs = await header.locator('.primary-links > li > a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
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

  test.describe(() => {
    test.skip(({ isMobile }) => !isMobile, 'drawer is a phone and tablet pattern');
    test('on a phone the menu button opens the drawer with every nav link', async ({ page }) => {
      await page.goto('/');
      const nav = page.locator('header nav[aria-label="Primary"]');
      await expect(nav).toBeHidden();
      await page.getByRole('button', { name: 'Open menu' }).click();
      await expect(nav).toBeVisible();
      for (const label of ['Katas', 'Train', 'Sensei', 'Library', 'Certificates', 'Challenges', 'Events', 'Membership']) {
        await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
      }
    });
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

// The resource catalogue is one page of ~15,000 elements. Scanned in one test, axe took 54 s on an idle runner and
// over 180 s (the slow-test limit) on a loaded one, so CI went red with no fault in the page (#113). It is scanned
// as the page without its cards (page-level rules see the whole document) plus every CATALOG_SLICES-th card from
// each offset: every rule still runs over every element, and each test does a fraction of the work.
const CATALOG_SLICES = 4;
const CARDS = '#resource-list > li';
type ScanPart = { label: string; include?: string; exclude?: string };
const scanParts = (route: string): ScanPart[] => route.replace(/\/$/, '') !== '/library/resources'
  ? [{ label: '' }]
  : [
      { label: 'page', exclude: CARDS },
      ...Array.from({ length: CATALOG_SLICES }, (_, k) => ({
        label: `cards ${k + 1}/${CATALOG_SLICES}`,
        include: `${CARDS}:nth-child(${CATALOG_SLICES}n+${k + 1})`,
      })),
    ];

test.describe('accessibility (WCAG 2.1 AA, no serious or critical violations)', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const route of DEEP_SCAN) {
      for (const part of scanParts(route)) test.describe(() => {
        // The desktop project scans every page; the phone project scans the three flagship pages
        // (the markup is shared, so a full second pass only slows CI). Decide before page setup.
        test.skip(({ isMobile }) => isMobile && !['/', '/train/', '/sensei/'].includes(route), 'covered by the desktop project');
        test(`${route} (${theme}${part.label ? `, ${part.label}` : ''})`, async ({ page, browser }, testInfo) => {
          // /library/resources lists every catalogued resource; axe needs more than the default minute there.
          test.slow();
          const catalog = route.replace(/\/$/, '') === '/library/resources';
          const started = performance.now();
          await page.goto(route);
          await setTheme(page, theme);
          // Match the route checks above: the static page is ready on load, while
          // networkidle can hang on the large resources catalogue in CI (#66).
          await page.waitForLoadState('load');
          const catalogMetrics = catalog ? {
            project: testInfo.project.name,
            browser: browser.version(),
            theme,
            part: part.label,
            retry: testInfo.retry,
            navigationAndThemeMs: Math.round(performance.now() - started),
            ...(await page.evaluate(() => ({
              resources: document.querySelectorAll('[data-resource]').length,
              domElements: document.querySelectorAll('*').length,
              hardwareConcurrency: navigator.hardwareConcurrency,
              viewport: { width: innerWidth, height: innerHeight },
            }))),
          } : null;
          // Off-screen cards skip rendering (content-visibility: auto) and keep a placeholder height, so axe saw their
          // text spill into the next card. Render every card as a reader sees it on screen, then measure (#120).
          if (catalog) await page.addStyleTag({ content: '#resource-list > li { content-visibility: visible; }' });
          if (catalogMetrics) console.info('[catalog-diagnostics] scan started', JSON.stringify(catalogMetrics));
          const scanStarted = performance.now();
          let results;
          try {
            // Only violations are asserted, so axe builds node details for violations alone (#113). Every rule
            // still runs and every violation keeps all its nodes; scans/catalog-a11y-profile measured identical findings.
            const builder = new AxeBuilder({ page });
            if (part.include) builder.include(part.include);
            if (part.exclude) builder.exclude(part.exclude);
            results = await builder
              .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
              .options({ resultTypes: ['violations'] })
              .analyze();
          } finally {
            if (catalogMetrics) recordCatalogMetric('scan', testInfo, {
              route, ...catalogMetrics, scanElapsedMs: Math.round(performance.now() - scanStarted), finished: results !== undefined,
            });
          }
          const bad = results.violations
            .filter((v) => v.impact === 'serious' || v.impact === 'critical')
            .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`);
          expect(bad).toEqual([]);
          if (catalog) {
            // Every catalog card and label must have a contrast axe can measure, not only no failures: a texture,
            // photo or gradient behind text leaves `color-contrast` incomplete, which verifies nothing (#120).
            const byReason = new Map<string, string[]>();
            for (const node of results.incomplete.filter((r) => r.id === 'color-contrast').flatMap((r) => r.nodes)) {
              const reason = node.any.map((c) => (c.data as { messageKey?: string } | null)?.messageKey ?? c.message).join(', ');
              // The related nodes name what axe found behind or over the text: the thing to fix.
              const related = node.any.flatMap((c) => c.relatedNodes ?? []).map((r) => r.target.join(' ')).slice(0, 2);
              const targets = byReason.get(reason) ?? [];
              targets.push(related.length ? `${node.target.join(' ')} (under/over: ${related.join(', ')})` : node.target.join(' '));
              byReason.set(reason, targets);
            }
            const unresolved = [...byReason].map(([reason, targets]) => `${reason} x${targets.length}, e.g. ${targets.slice(0, 3).join(' | ')}`);
            expect(unresolved, 'catalog text whose colour contrast axe could not determine').toEqual([]);
          }
        });
      });
    }
  }
});
