import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { igniteJourneys } from '../src/data/ignite-journeys';

// Optional Ignite Curiosity journeys (#83, docs/journeys.md). Each journey is entered directly, in a fresh
// browser with nothing saved: no account, no cookie, no outside request, no referrer to Ignite Curiosity,
// and progress read only from this device. External sites are never fetched here (CI must not depend on
// other hosts); the Ignite side of each journey is recorded in docs/journeys.md.

const SPARK = ['Seek', 'Play', 'Apply', 'Research', 'Know'];

test.describe('journeys index', () => {
  test('lists every journey and links to it', async ({ page }) => {
    const response = await page.goto('/journeys/');
    expect(response?.status()).toBe(200);
    for (const journey of igniteJourneys) {
      await expect(page.locator(`main a[href="/journeys/${journey.id}"]`)).toHaveText(journey.title);
    }
  });

  test('is linked from the track library', async ({ page }) => {
    await page.goto('/library/tracks/');
    await expect(page.locator('section.core a[href="/journeys"]')).toHaveCount(1);
  });
});

for (const journey of igniteJourneys) {
  test.describe(`journey ${journey.id}`, () => {
    test('opens directly with nothing saved, sets no cookie, calls no other host and saves nothing', async ({ page, context, baseURL }) => {
      const outside: string[] = [];
      page.on('request', (request) => {
        const url = new URL(request.url());
        if (!['http:', 'https:'].includes(url.protocol)) return;
        if (url.origin !== new URL(baseURL ?? '').origin) outside.push(request.url());
      });
      const response = await page.goto(`/journeys/${journey.id}/`);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState('load');
      await expect(page.locator('h1')).toHaveText(journey.title);
      await expect(page.locator('.spark-step h3')).toHaveText(SPARK);
      expect(outside).toEqual([]);
      expect(await context.cookies()).toEqual([]);
      expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
    });

    test('links Ignite Curiosity without a referrer or tracking code', async ({ page }) => {
      await page.goto(`/journeys/${journey.id}/`);
      const link = page.locator(`main a[href="${journey.ignite.url}"]`);
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('rel', /noreferrer/);
      await expect(link).toHaveAttribute('referrerpolicy', 'no-referrer');
      const external = await page.locator('main a[href^="http"]').evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
      for (const href of external) {
        expect(new URL(href).search, href).toBe('');
        expect(new URL(href).hostname, href).toBe('ignitecuriosity.org');
      }
    });

    test('every Dojo link opens', async ({ page }) => {
      await page.goto(`/journeys/${journey.id}/`);
      const hrefs = await page.locator('main a[href^="/"]').evaluateAll((links) => [...new Set(links.map((a) => (a.getAttribute('href') ?? '').split('#')[0] ?? ''))]);
      expect(hrefs.length).toBeGreaterThan(5);
      for (const href of hrefs) {
        expect((await page.request.get(href)).status(), href).toBe(200);
      }
    });

    test('shows lesson progress saved on this device, and changes nothing', async ({ page }) => {
      const firstTrack = journey.steps.flatMap((step) => step.refs).find((ref) => ref.kind === 'track');
      if (!firstTrack || firstTrack.kind !== 'track') throw new Error(`${journey.id} names no track`);
      await page.goto(`/library/tracks/${firstTrack.slug}/`);
      const firstLesson = await page.locator('.lesson-list > li > a').first().getAttribute('href');
      const lessonId = (firstLesson ?? '').replace(/^\/library\//, '').replace(/\/$/, '');
      expect(lessonId).toMatch(/^tracks\//);
      const saved = JSON.stringify({ v: 1, savedAt: '2026-11-21T09:00:00.000Z', data: { done: { [lessonId]: '2026-11-21' } } });
      await page.evaluate((value) => localStorage.setItem('dojo:lessons', value), saved);
      await page.goto(`/journeys/${journey.id}/`);
      await expect(page.locator(`[data-journey-progress][data-lesson-ids*="${lessonId}"]`).first()).toHaveText(/^1 of \d+ lessons done on this device$/);
      expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(['dojo:lessons']);
      expect(await page.evaluate(() => localStorage.getItem('dojo:lessons'))).toBe(saved);
    });

    test('passes axe in both themes', async ({ page, isMobile }) => {
      test.skip(isMobile, 'the desktop project runs the scan once');
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme });
        await page.goto(`/journeys/${journey.id}/`);
        await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`);
        expect(serious, theme).toEqual([]);
      }
    });
  });
}
