import { expect, test, type Page } from '@playwright/test';

async function openSearch(page: Page) {
  await page.getByRole('button', { name: 'Search', exact: true }).locator('visible=true').click();
  const dialog = page.getByRole('dialog', { name: 'Search' });
  await expect(dialog).toBeVisible();
  return dialog;
}

test('a slow search offers a way to browse and accepts its eventual result', async ({ page }) => {
  await page.clock.install();
  await page.route('**/pagefind/pagefind.js', (route) => route.fulfill({
    contentType: 'text/javascript',
    body: `
      export async function init() {}
      export function debouncedSearch(term) {
        return new Promise(resolve => { globalThis.__finishSearch = () => resolve({ results: [
          { data: async () => ({ url: '/library/', excerpt: term, meta: { title: 'Recovered result' } }) }
        ] }); });
      }
      export function search(term) { return debouncedSearch(term); }
    `,
  }));
  await page.goto('/');
  const dialog = await openSearch(page);
  await dialog.getByRole('searchbox').fill('example');
  await expect.poll(() => page.evaluate(() => typeof (window as Window & { __finishSearch?: unknown }).__finishSearch)).toBe('function');
  await page.clock.fastForward(8_001);
  await expect(dialog.getByRole('status')).toContainText('taking longer than expected');
  const browse = dialog.getByRole('link', { name: 'browse the library' });
  await expect(browse).toHaveAttribute('href', '/library/');
  await browse.focus();
  await page.evaluate(() => (window as unknown as Window & { __finishSearch: () => void }).__finishSearch());
  await expect(dialog.getByRole('link', { name: 'Recovered result' })).toBeVisible();
  await expect(browse).toBeFocused();
  await expect(browse).toBeVisible();
});

test('a stalled preview keeps available results and clears the hint when complete', async ({ page }) => {
  await page.clock.install();
  await page.route('**/pagefind/pagefind.js', (route) => route.fulfill({
    contentType: 'text/javascript',
    body: `
      export async function init() {}
      function data(title) { return { url: '/library/', excerpt: title, meta: { title } }; }
      export async function debouncedSearch() { return { results: [
        { data: async () => data('Ready result') },
        { data: () => new Promise(resolve => { globalThis.__finishPreview = () => resolve(data('Later result')); }) },
      ] }; }
      export function search(term) { return debouncedSearch(term); }
    `,
  }));
  await page.goto('/');
  const dialog = await openSearch(page);
  await dialog.getByRole('searchbox').fill('example');
  const first = dialog.getByRole('link', { name: 'Ready result' });
  await expect(first).toBeVisible();
  await expect.poll(() => page.evaluate(() => typeof (window as Window & { __finishPreview?: unknown }).__finishPreview)).toBe('function');
  await first.focus();
  await page.clock.fastForward(8_001);
  await expect(dialog.getByRole('status')).toContainText('taking longer than expected');
  await expect(dialog.getByRole('link', { name: 'browse the library' })).toBeVisible();
  await expect(first).toBeFocused();
  await page.evaluate(() => (window as unknown as Window & { __finishPreview: () => void }).__finishPreview());
  await expect(dialog.getByRole('link', { name: 'Later result' })).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'browse the library' })).toBeHidden();
  await expect(first).toBeFocused();
});

test('a failed index reports the failure and offers browsing', async ({ page }) => {
  await page.route('**/pagefind/pagefind.js', (route) => route.fulfill({
    contentType: 'text/javascript',
    body: `export async function init() { throw new Error('test index failure'); }`,
  }));
  await page.goto('/');
  const dialog = await openSearch(page);
  await dialog.getByRole('searchbox').fill('example');
  await expect(dialog.getByRole('status')).toHaveText('Search could not load. Try again or browse the library.');
  await expect(dialog.getByRole('link', { name: 'browse the library' })).toBeVisible();
});

test('a superseded slow query cannot show a stale hint over a newer result', async ({ page }) => {
  await page.clock.install();
  await page.route('**/pagefind/pagefind.js', (route) => route.fulfill({
    contentType: 'text/javascript',
    body: `
      export async function init() {}
      function result(title) { return { results: [{ data: async () => ({ url: '/library/', excerpt: title, meta: { title } }) }] }; }
      export function debouncedSearch(term) {
        if (term === 'old') return new Promise(resolve => { globalThis.__finishOldSearch = () => resolve(result('Old result')); });
        return Promise.resolve(result('New result'));
      }
      export function search(term) { return debouncedSearch(term); }
    `,
  }));
  await page.goto('/');
  const dialog = await openSearch(page);
  const input = dialog.getByRole('searchbox');
  await input.fill('old');
  await expect.poll(() => page.evaluate(() => typeof (window as Window & { __finishOldSearch?: unknown }).__finishOldSearch)).toBe('function');
  await input.fill('new');
  await expect(dialog.getByRole('link', { name: 'New result' })).toBeVisible();
  await page.clock.fastForward(8_001);
  await page.evaluate(() => (window as unknown as Window & { __finishOldSearch: () => void }).__finishOldSearch());
  await expect(dialog.getByRole('status')).toHaveText('1 result for "new"');
  await expect(dialog.getByRole('link', { name: 'browse the library' })).toBeHidden();
  await expect(dialog.getByRole('link', { name: 'Old result' })).toHaveCount(0);
});

test('a slow inline panel does not put its hint into the header panel', async ({ page }) => {
  await page.clock.install();
  await page.route('**/pagefind/pagefind.js', (route) => route.fulfill({
    contentType: 'text/javascript',
    body: `
      export async function init() {}
      function result(title) { return { results: [{ data: async () => ({ url: '/library/', excerpt: title, meta: { title } }) }] }; }
      export function debouncedSearch(term) {
        if (term === 'slow') return new Promise(resolve => { globalThis.__finishInline = () => resolve(result('Inline result')); });
        return Promise.resolve(result('Header result'));
      }
      export function search(term) { return debouncedSearch(term); }
    `,
  }));
  await page.goto('/library/');
  const inline = page.locator('[data-search]').filter({ has: page.getByRole('searchbox', { name: 'Search every lesson, track and resource' }) });
  await inline.getByRole('searchbox').fill('slow');
  await expect.poll(() => page.evaluate(() => typeof (window as Window & { __finishInline?: unknown }).__finishInline)).toBe('function');
  const dialog = await openSearch(page);
  await dialog.getByRole('searchbox').fill('quick');
  await expect(dialog.getByRole('link', { name: 'Header result' })).toBeVisible();
  await page.clock.fastForward(8_001);
  await expect(inline.locator('[data-search-status]')).toContainText('taking longer than expected');
  await expect(inline.locator('[data-search-help]')).not.toHaveAttribute('hidden', '');
  await expect(dialog.getByRole('link', { name: 'browse the library' })).toBeHidden();
  await expect(dialog.getByRole('status')).toHaveText('1 result for "quick"');
  await page.evaluate(() => (window as unknown as Window & { __finishInline: () => void }).__finishInline());
  await expect(inline.locator('[data-search-results] a')).toHaveText('Inline result');
  await expect(inline.locator('[data-search-help]')).toBeHidden();
});
