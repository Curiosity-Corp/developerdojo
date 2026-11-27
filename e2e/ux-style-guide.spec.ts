import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { resolveTokens, type TokenFile } from '../src/lib/design-tokens';

// UX-004 and UX-007 (#91): the HTML style guide (/examples/pocket-invoice-style-guide/). Each component on the
// generated component sheet has a specimen; each specimen's computed style is the UX-003 token value; every token is
// listed; and the page passes axe (WCAG A and AA) in light and dark and reflows at 320 px.

const tokens = resolveTokens(JSON.parse(readFileSync('src/data/pocket-invoice-tokens.json', 'utf8')) as TokenFile);
const token = (name: string): string => {
  const found = tokens.get(name);
  if (!found) throw new Error('the token file has no ' + name);
  return found.resolved;
};
const rgb = (hex: string): string => 'rgb(' + [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16)).join(', ') + ')';
const px = (name: string): string => token(name) + 'px';

const URL = '/examples/pocket-invoice-style-guide/';

async function serious(page: Page): Promise<string[]> {
  const results = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  return results.violations.map((v) => v.id + ' (' + v.impact + ')');
}

test('the style guide has a specimen for every component on the component sheet and lists every token', async ({ page, request }) => {
  const report = await (await request.get('/examples/ux-pathway/generated/fidelity-report.json')).json() as { files: { file: string; components?: string[] }[] };
  const components = report.files.find((entry) => entry.file === 'components.svg')?.components ?? [];
  expect(components.length).toBeGreaterThan(0);
  await page.goto(URL);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  for (const name of components) await expect(page.locator('[data-specimen="' + name + '"]'), name).toHaveCount(1);
  const listed = await page.locator('[data-style-guide]').innerText();
  for (const t of tokens.values()) {
    if (t.type === 'color') expect(listed, t.name).toContain(t.name);
  }
});

test('each specimen is styled with the token values', async ({ page }) => {
  await page.goto(URL);
  const spec = (name: string) => page.locator('[data-specimen="' + name + '"]');
  const primary = spec('Button/Primary').locator('.btn');
  await expect(primary).toHaveCSS('background-color', rgb(token('color.action.primary')));
  await expect(primary).toHaveCSS('color', rgb(token('color.text.inverse')));
  await expect(primary).toHaveCSS('min-height', px('size.control'));
  await expect(primary).toHaveCSS('border-top-left-radius', px('radius.control'));
  await expect(primary).toHaveCSS('font-size', px('font.size.m'));
  await expect(primary).toHaveCSS('font-weight', token('font.weight.bold'));
  const secondary = spec('Button/Secondary').locator('.btn');
  await expect(secondary).toHaveCSS('background-color', rgb(token('color.surface.card')));
  await expect(secondary).toHaveCSS('border-top-color', rgb(token('color.border.input')));
  await expect(secondary).toHaveCSS('border-top-width', px('border-width.thick'));
  await expect(spec('Button/Link').locator('.btn')).toHaveCSS('color', rgb(token('color.text.link')));
  const input = spec('Field/Default').locator('input');
  await expect(input).toHaveCSS('border-top-color', rgb(token('color.border.input')));
  await expect(input).toHaveCSS('min-height', px('size.control'));
  const error = spec('Field/Error');
  await expect(error.locator('.has-error')).toHaveCSS('border-left-color', rgb(token('color.border.error')));
  await expect(error.locator('.has-error')).toHaveCSS('border-left-width', px('border-width.bar'));
  await expect(error.locator('.error')).toHaveCSS('color', rgb(token('color.text.error')));
  await expect(error.locator('input')).toHaveAttribute('aria-invalid', 'true');
  await expect(spec('ErrorSummary').locator('.summary-box')).toHaveCSS('border-top-color', rgb(token('color.border.error')));
  await expect(spec('ErrorSummary').locator('a')).toHaveCSS('color', rgb(token('color.text.error')));
  await expect(spec('Heading/Page').locator('p')).toHaveCSS('font-size', px('font.size.l'));
  await expect(spec('Heading/Section').locator('p')).toHaveCSS('font-size', px('font.size.m'));
  await expect(spec('Text/Body').locator('.canvas')).toHaveCSS('background-color', rgb(token('color.surface.page')));
  await expect(spec('Text/Body').locator('p')).toHaveCSS('color', rgb(token('color.text.muted')));
  await expect(spec('AppBar').locator('.appbar')).toHaveCSS('background-color', rgb(token('color.surface.card')));
});

test('the style guide passes axe in light and dark and reflows at 320 px', async ({ page }) => {
  await page.goto(URL);
  const problems: string[] = [];
  for (const theme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    problems.push(...(await serious(page)).map((v) => theme + ': ' + v));
  }
  const viewport = page.viewportSize() ?? { width: 1440, height: 900 };
  await page.setViewportSize({ width: 320, height: viewport.height });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 0) problems.push('320 px: scrolls sideways by ' + overflow + ' px');
  expect(problems).toEqual([]);
});
