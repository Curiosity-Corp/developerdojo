import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { parseLedger, routeRedirects } from '../src/lib/taxonomy-identifiers';

// Moved kata routes (#82): every move in src/data/taxonomy-moves.json is served as a static redirect,
// so an old link or bookmark lands on the page in use now. The worked example is the FIXFND fixture
// family (docs/kata-taxonomy.md "Worked example"). Runs against the built site in both projects.

const ledger: unknown = JSON.parse(readFileSync('src/data/taxonomy-moves.json', 'utf8'));
const redirects = Object.entries(routeRedirects(parseLedger(ledger)));

test('the ledger has redirects to follow', () => {
  expect(redirects.length).toBeGreaterThan(0);
});

for (const [from, to] of redirects) {
  test(`${from} redirects to ${to}`, async ({ page }) => {
    await page.goto(`${from}/`);
    await expect(page).toHaveURL(new RegExp(`${to.replace(/[/-]/g, '\\$&')}/?$`));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}

test('a redirect page is not indexed and names its destination', async ({ request }) => {
  const [from, to] = redirects[0] ?? ['', ''];
  const response = await request.get(`${from}/`);
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toMatch(new RegExp(`http-equiv="refresh" content="0;url=${to}`));
  expect(html).toContain('noindex');
});
