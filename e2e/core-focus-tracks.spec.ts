import { readdirSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { coreFocuses, sharedFocusTrack } from '../src/lib/core-focuses';

// Robotics and biotechnology are the core focuses (#125). Their track URLs are linked from other sites
// (docs/track-urls.md), so the home page and the track index must link every one, and each track must show its
// capstone. qa.spec.ts scans every track page with axe; here the capstone lessons get the same scan in both
// themes, because the lesson sample there may not include them.
const TRACKS = [...coreFocuses.flatMap((focus) => focus.tracks.map((track) => track.slug)), sharedFocusTrack.slug];

function capstoneOf(slug: string): string {
  const file = readdirSync(`src/content/library/tracks/${slug}`)
    .filter((name) => /^\d{2}-capstone-.+\.md$/.test(name))
    .sort()
    .at(-1);
  if (!file) throw new Error(`${slug} has no capstone lesson`);
  return `/library/tracks/${slug}/${file.replace(/\.md$/, '')}`;
}

async function seriousViolations(page: Page): Promise<string[]> {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 4).join(' | ')}`);
}

test.describe('core focuses on the home page', () => {
  test('names robotics and biotechnology and links every track', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('section.core-focus');
    await expect(section.getByRole('heading', { level: 2, name: 'Robotics and biotechnology.' })).toBeVisible();
    for (const focus of coreFocuses) {
      await expect(section.getByRole('heading', { level: 3, name: focus.title, exact: true })).toBeVisible();
      for (const track of focus.tracks) {
        await expect(section.locator(`a[href="/library/tracks/${track.slug}"]`)).toBeVisible();
        await expect(section.getByText(`Capstone: ${track.capstone}`)).toBeVisible();
      }
    }
    await expect(section.locator(`a[href="/library/tracks/${sharedFocusTrack.slug}"]`)).toBeVisible();
  });

  test('every core-focus link resolves', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page
      .locator('section.core-focus a[href^="/"]')
      .evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute('href') ?? ''))]);
    expect(hrefs.length).toBeGreaterThanOrEqual(TRACKS.length);
    for (const href of hrefs) {
      const response = await page.request.get(href);
      expect(response.status(), href).toBe(200);
    }
  });
});

test.describe('core focuses on the track index', () => {
  test('lead the page, robotics then biotechnology then the shared modules', async ({ page }) => {
    await page.goto('/library/tracks');
    const core = page.locator('section.core');
    await expect(core.getByRole('heading', { level: 2, name: 'Core focuses: robotics and biotechnology' })).toBeVisible();
    const groups = await page.locator('[data-track-group]').evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-track-group')));
    expect(groups.slice(0, 3)).toEqual(['robotics', 'biotechnology', 'frontier']);
    for (const slug of TRACKS) {
      await expect(core.locator(`a[href="/library/tracks/${slug}"]`)).toHaveCount(1);
    }
  });
});

for (const slug of TRACKS) {
  test.describe(`track ${slug}`, () => {
    test('is at its stable URL and lists its lessons, ending in the capstone', async ({ page }) => {
      const response = await page.goto(`/library/tracks/${slug}/`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      const lessons = page.locator('.lesson-list > li > a');
      expect(await lessons.count()).toBeGreaterThanOrEqual(3);
      if (slug !== sharedFocusTrack.slug) {
        await expect(lessons.last()).toHaveAttribute('href', capstoneOf(slug));
      }
    });
  });
}

test.describe('capstone lessons pass axe in both themes', () => {
  test.skip(({ isMobile }) => isMobile, 'the desktop project runs the scan once');
  for (const focus of coreFocuses) {
    for (const track of focus.tracks) {
      for (const theme of ['light', 'dark'] as const) {
        test(`${track.slug} capstone, ${theme}`, async ({ page }) => {
          await page.emulateMedia({ colorScheme: theme });
          await page.goto(capstoneOf(track.slug));
          await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
          await expect(page.locator('h1')).toHaveCount(1);
          expect(await seriousViolations(page)).toEqual([]);
        });
      }
    }
  }
});
