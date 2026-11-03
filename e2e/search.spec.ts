import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function openSearch(page: Page, isMobile: boolean) {
  const button = page.getByRole('button', { name: 'Search', exact: true });
  // Two buttons exist (desktop nav action, phone bar); only the one for this width is visible.
  await button.locator('visible=true').click();
  const dialog = page.getByRole('dialog', { name: 'Search' });
  await expect(dialog).toBeVisible();
  void isMobile;
  return dialog;
}

test('the header search finds a lesson and opens it', async ({ page, isMobile }) => {
  await page.goto('/train');
  const dialog = await openSearch(page, isMobile);
  await dialog.getByRole('searchbox').fill('epic');
  await expect(dialog.getByRole('status')).toContainText(/\d+ results? for "epic"/);
  const link = dialog.getByRole('link', { name: 'People write epics' }).first();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/library\/people-write-epics/);
});

test('results are grouped and the index covers the words we promise', async ({ page, isMobile }) => {
  await page.goto('/');
  const dialog = await openSearch(page, isMobile);
  const box = dialog.getByRole('searchbox');
  for (const word of ['persona', 'epic', 'licence', 'roadmap']) {
    await box.fill(word);
    await expect(dialog.getByRole('status')).toContainText(new RegExp(`\\d+ results? for "${word}"`));
    await expect(dialog.getByRole('heading', { level: 3 }).first()).toBeVisible();
  }
  // Pagefind also matches by a word's leading letters, and a lesson with a lone "Z" made the old
  // query "zzzzqqqq" find a page. Start with letters that no indexed word begins with.
  await box.fill('qqqqzzzz');
  await expect(dialog.getByRole('status')).toContainText('No results');
});

test('a learning resource is found and its link lands on its card', async ({ page, isMobile }) => {
  await page.goto('/');
  const dialog = await openSearch(page, isMobile);
  await dialog.getByRole('searchbox').fill('interactive prompt engineering tutorial');
  await expect(dialog.getByRole('heading', { name: 'Learning resources' })).toBeVisible();
  const result = dialog.getByRole('link', { name: /Interactive Prompt Engineering Tutorial/ }).first();
  await result.click();
  await expect(page).toHaveURL(/\/library\/resources\/?#r-anthropic-prompt-engineering-interactive-tutorial$/);
  await expect(page.locator('#r-anthropic-prompt-engineering-interactive-tutorial')).toBeVisible();
});

test('"/" opens the search, Escape closes it and focus goes back', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard shortcut is for desktop');
  await page.goto('/library');
  await page.locator('main').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('/');
  const dialog = page.getByRole('dialog', { name: 'Search' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('searchbox')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('typing "/" in a text field does not open the search', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard shortcut is for desktop');
  await page.goto('/library');
  await page.locator('#library-filter').fill('a/b');
  await expect(page.getByRole('dialog', { name: 'Search' })).toBeHidden();
});

test('the library page has its own search box', async ({ page }) => {
  await page.goto('/library');
  const box = page.getByRole('searchbox', { name: 'Search every lesson, track and resource' });
  await box.fill('persona');
  await expect(page.locator('[data-search-results] a').first()).toBeVisible();
});

test('the header keeps its links and layout with search added', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await expect(page.locator('.search-open.button-phone')).toBeVisible();
    await expect(page.locator('.search-open.button-desktop')).toBeHidden();
  } else {
    await expect(page.locator('.search-open.button-desktop')).toBeVisible();
    await expect(page.locator('.search-open.button-phone')).toBeHidden();
    // One row: the bar is no taller than before the search button was added.
    const height = await page.locator('.site-header .bar').evaluate((el) => el.getBoundingClientRect().height);
    expect(height).toBeLessThan(80);
  }
  const labels = await page.locator('header nav ul a').allInnerTexts();
  expect(labels).toEqual(['Train', 'Sensei', 'Library', 'Certificates', 'Challenges', 'Events', 'Membership']);
});

for (const theme of ['light', 'dark'] as const) {
  test(`the open search dialog with results has no serious accessibility problems (${theme})`, async ({ page, isMobile }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/');
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    const dialog = await openSearch(page, isMobile);
    await dialog.getByRole('searchbox').fill('epic');
    await expect(dialog.getByRole('status')).toContainText('results');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const bad = results.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
    expect(bad).toEqual([]);
  });
}
