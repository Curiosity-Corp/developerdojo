import { readFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { STATES, TRANSITIONS, stateById, type StateId } from '../src/data/pocket-invoice';
import { resolveTokens, type TokenFile } from '../src/lib/design-tokens';

// The UX pathway (#91): drive the working Pocket Invoice example through every state in the flow, and
// in each one run axe (WCAG A and AA, light and dark), a reflow check at 320 px and the focus rule for
// that state. The results are written as a Markdown QA report, kept with the CI job's test results.

const label = (from: StateId, to: StateId): string => {
  const button = stateById(from).elements.find((element) => element.type === 'button' && element.to === to);
  if (!button || button.type !== 'button') throw new Error('no button from ' + from + ' to ' + to);
  return button.label;
};
const heading = (id: StateId): string => {
  const found = stateById(id).elements.find((element) => element.type === 'heading');
  if (!found || found.type !== 'heading') throw new Error('no heading in ' + id);
  return found.text;
};

interface Row { state: StateId; light: string; dark: string; reflow: string; focus: string }

async function serious(page: Page): Promise<string[]> {
  const results = await new AxeBuilder({ page }).include('[data-pocket-invoice]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  return results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id + ' (' + v.impact + ')');
}

async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
}

/** Checks the current state and records the row; fails the test on any finding. */
async function checkState(page: Page, rows: Row[], state: StateId, focus: string): Promise<void> {
  const app = page.locator('[data-pocket-invoice]');
  await expect(app).toHaveAttribute('data-current-state', state);
  const viewport = page.viewportSize() ?? { width: 1440, height: 900 };
  await setTheme(page, 'light');
  const light = await serious(page);
  await setTheme(page, 'dark');
  const dark = await serious(page);
  await setTheme(page, 'light');
  await page.setViewportSize({ width: 320, height: viewport.height });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.setViewportSize(viewport);
  rows.push({ state, light: light.join(', ') || 'none', dark: dark.join(', ') || 'none', reflow: overflow <= 0 ? 'no sideways scroll' : overflow + ' px sideways scroll', focus });
  expect(light, state + ' light').toEqual([]);
  expect(dark, state + ' dark').toEqual([]);
  expect(overflow, state + ' reflow at 320 px').toBeLessThanOrEqual(0);
}

async function writeReport(rows: Row[], testInfo: TestInfo): Promise<void> {
  const lines = [
    '# Pocket Invoice: accessibility and responsive QA report',
    '',
    'Produced by the site’s browser tests (Playwright with axe-core) on the ' + testInfo.project.name + ' project. Each state of the flow is reached by using the page, then checked.',
    '',
    '- axe: rules tagged WCAG 2.0, 2.1 and 2.2 A and AA; serious and critical results count as failures.',
    '- Reflow: the viewport is narrowed to 320 px and the page must not scroll sideways.',
    '- Focus: where keyboard focus is after the state change.',
    '',
    'Not covered: screen reader output, zoom to 400 %, and use by people. A passing report is not a WCAG conformance claim.',
    '',
    '| State | axe, light | axe, dark | Reflow at 320 px | Focus after the change |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map((row) => '| ' + stateById(row.state).title + ' (' + row.state + ') | ' + row.light + ' | ' + row.dark + ' | ' + row.reflow + ' | ' + row.focus + ' |'),
    '',
    'States checked: ' + new Set(rows.map((row) => row.state)).size + ' of ' + STATES.length + '. Transitions in the flow: ' + TRANSITIONS.length + '.',
    '',
  ];
  const path = testInfo.outputPath('qa-report.md');
  const { writeFile } = await import('node:fs/promises');
  await writeFile(path, lines.join('\n'));
  await testInfo.attach('qa-report.md', { path, contentType: 'text/markdown' });
}

test('every Pocket Invoice state works, by keyboard, with no serious axe finding', async ({ page }, testInfo) => {
  // Twelve states, each with an axe scan in both themes: 37 s alone on mobile in CI, and past the 60 s default on the
  // desktop project when the runner's CPU is shared with the rest of the suite. Every state is still checked.
  test.slow();
  const rows: Row[] = [];
  const app = page.locator('[data-pocket-invoice]');
  const focused = (name: string | RegExp) => expect(page.locator(':focus')).toHaveAccessibleName(name);
  await page.goto('/examples/pocket-invoice/');
  await expect(page.getByRole('heading', { level: 2, name: heading('signup') })).toBeVisible();
  await checkState(page, rows, 'signup', 'page load: browser default');

  await app.getByRole('button', { name: label('signup', 'sign-in') }).click();
  await expect(page.locator(':focus')).toHaveText(heading('sign-in'));
  await checkState(page, rows, 'sign-in', 'the state heading');
  await app.getByRole('button', { name: label('sign-in', 'signup') }).click();

  await app.getByLabel('Email address').fill('not-an-email');
  await app.getByLabel('Email address').press('Enter');
  await expect(page.locator(':focus')).toHaveAttribute('data-error-summary', '');
  await expect(page).toHaveTitle(/^Error: /);
  await expect(app.getByLabel('Email address')).toHaveAttribute('aria-invalid', 'true');
  await checkState(page, rows, 'signup-error', 'the error summary');
  await app.getByRole('link', { name: /Enter a workspace name/ }).click();
  await expect(app.getByLabel('Workspace name')).toBeFocused();

  await app.getByLabel('Email address').fill('sam@studio.example');
  await app.getByLabel('Workspace name').fill('Sam’s studio');
  await app.getByRole('button', { name: label('signup', 'invoices-empty') }).click();
  await expect(page).not.toHaveTitle(/^Error: /);
  await checkState(page, rows, 'invoices-empty', 'the state heading');

  await app.getByRole('button', { name: label('invoices-empty', 'invoice-new') }).click();
  await checkState(page, rows, 'invoice-new', 'the state heading');
  const cancel = app.getByRole('button', { name: label('invoice-new', 'discard-dialog') });
  await cancel.click();
  const dialog = page.getByRole('dialog', { name: heading('discard-dialog') });
  await expect(dialog).toBeVisible();
  await focused(label('discard-dialog', 'invoice-new'));
  await checkState(page, rows, 'discard-dialog', 'Keep editing, inside the dialog');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(cancel).toBeFocused();
  await expect(app).toHaveAttribute('data-current-state', 'invoice-new');

  await app.getByRole('button', { name: label('invoice-new', 'invoice-review') }).click();
  await expect(page.locator(':focus')).toHaveAttribute('data-error-summary', '');
  await expect(page).toHaveTitle(/^Error: /);
  await checkState(page, rows, 'invoice-new-error', 'the error summary');

  await app.getByLabel('Client name').fill('Harbour Bakery');
  await app.getByLabel('Client email').fill('accounts@harbour-bakery.invalid');
  await app.getByLabel('What the work was').fill('Menu redesign');
  await app.getByLabel(/Amount in US dollars/).fill('480.00');
  await app.getByRole('button', { name: label('invoice-new', 'invoice-review') }).click();
  await expect(app.locator('[data-summary-value="Amount"]')).toHaveText('$480.00');
  await checkState(page, rows, 'invoice-review', 'the state heading');

  await app.getByRole('button', { name: label('invoice-review', 'invoice-sent') }).click();
  await expect(page).toHaveTitle(/^Error: /);
  await checkState(page, rows, 'send-error', 'the state heading');
  await app.getByRole('button', { name: label('send-error', 'invoice-new') }).click();
  await expect(app.getByLabel('Client email')).toBeFocused();
  await expect(app.getByLabel('Client name')).toHaveValue('Harbour Bakery');

  await app.getByLabel('Client email').fill('accounts@harbour-bakery.example');
  await app.getByRole('button', { name: label('invoice-new', 'invoice-review') }).click();
  await app.getByRole('button', { name: label('invoice-review', 'invoice-sent') }).click();
  await expect(app.getByRole('heading', { name: 'Invoice INV-0001 sent' })).toBeFocused();
  await checkState(page, rows, 'invoice-sent', 'the state heading');

  await app.getByRole('button', { name: label('invoice-sent', 'invoices-list') }).click();
  await expect(app.getByRole('row', { name: /INV-0001 Harbour Bakery \$480\.00 Sent/ })).toBeVisible();
  await checkState(page, rows, 'invoices-list', 'the state heading');

  await app.getByRole('button', { name: label('invoices-list', 'invoice-new') }).click();
  await expect(app.getByLabel('Client name')).toHaveValue('');
  await app.getByRole('button', { name: label('invoice-new', 'discard-dialog') }).click();
  await dialog.getByRole('button', { name: label('discard-dialog', 'invoices-empty') }).click();
  await expect(app).toHaveAttribute('data-current-state', 'invoices-list');

  expect(new Set(rows.map((row) => row.state)).size).toBe(STATES.length);
  await writeReport(rows, testInfo);
});

test('the UX pathway page links every step and serves real files', async ({ page, request }) => {
  await page.goto('/katas/ux-pathway/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From sitemap to a tested screen');
  for (const slug of ['ux-001-sitemap', 'ux-002-low-fidelity', 'ux-003-tokens', 'ux-004-components', 'ux-005-implement-and-qa', 'ux-r01-randori']) {
    await expect(page.locator('a[href="/katas/' + slug + '"]').first()).toBeVisible();
    expect((await request.get('/katas/' + slug + '/')).status(), slug).toBe(200);
  }
  await expect(page.getByRole('table', { name: 'Every transition in the flow' }).getByRole('row')).toHaveCount(TRANSITIONS.length + 1);
  const penpot = await request.get('/examples/ux-pathway/pocket-invoice.penpot');
  expect(penpot.status()).toBe(200);
  expect((await penpot.body()).subarray(0, 2).toString('latin1')).toBe('PK');
  const tokens = await (await request.get('/examples/ux-pathway/pocket-invoice-tokens.json')).json() as { $themes: unknown[] };
  expect(tokens.$themes).toHaveLength(1);
  const check = await (await request.get('/examples/ux-pathway/penpot-import-check.json')).json() as { checks: { pass: boolean }[] };
  expect(check.checks.every((item) => item.pass)).toBe(true);
});

const tokenValue = (name: string): string => {
  const token = resolveTokens(JSON.parse(readFileSync('src/data/pocket-invoice-tokens.json', 'utf8')) as TokenFile).get(name);
  if (!token) throw new Error('the token file has no ' + name);
  return token.resolved;
};
const rgb = (hex: string): string => 'rgb(' + [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16)).join(', ') + ')';

for (const fidelity of ['low', 'high'] as const) test('the ' + fidelity + '-fidelity prototype reaches every state through all its transitions', async ({ page }, testInfo) => {
  // UX-002 (#91): one walk that uses every numbered transition at least once, by clicking the link that carries its
  // number, plus Escape for the dialog's close and the browser's Back button for a back path. UX-005 runs the same
  // walk in high fidelity, where every colour comes from the UX-003 tokens.
  const proto = page.locator('[data-prototype]');
  const walk: (number | 'back' | 'escape')[] = [1, 'back', 4, 5, 2, 3, 6, 10, 'escape', 8, 11, 13, 6, 8, 9, 14, 7, 16, 17, 7, 15, 18, 19];
  const axe = async (where: string): Promise<void> => {
    const results = await new AxeBuilder({ page }).include('[data-prototype]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations.map((v) => v.id + ' (' + v.impact + ')'), where).toEqual([]);
  };
  await page.goto('/examples/pocket-invoice-prototype/' + (fidelity === 'high' ? '?fidelity=high' : ''));
  await expect(proto).toHaveAttribute('data-current-state', 'signup');
  await expect(proto).toHaveAttribute('data-fidelity', fidelity);
  await expect(page.getByRole('radio', { name: new RegExp('^' + (fidelity === 'high' ? 'High' : 'Low')) })).toBeChecked();
  if (fidelity === 'high') {
    const primary = page.locator('[data-prototype-state="signup"] a.btn.primary').first();
    await expect(primary).toHaveCSS('background-color', rgb(tokenValue('color.action.primary')));
    await expect(primary).toHaveCSS('color', rgb(tokenValue('color.text.inverse')));
    await expect(page.locator('[data-prototype-state="signup"]')).toHaveCSS('background-color', rgb(tokenValue('color.surface.page')));
  }
  await axe('signup');
  let current: StateId = 'signup';
  for (const step of walk) {
    if (step === 'back') {
      await page.goBack();
      current = 'signup';
    } else if (step === 'escape') {
      await page.keyboard.press('Escape');
      current = 'invoice-new';
    } else {
      const transition = TRANSITIONS[step - 1];
      if (!transition) throw new Error('no transition ' + step);
      expect(transition.from, 'transition ' + step + ' starts where the walk is').toBe(current);
      await page.locator('[data-prototype-state="' + current + '"] a[data-transition="' + step + '"]').first().click();
      current = transition.to;
    }
    await expect(proto, 'after ' + step).toHaveAttribute('data-current-state', current);
    if (current === 'discard-dialog') {
      await expect(page.getByRole('dialog', { name: heading('discard-dialog') })).toBeVisible();
      if (step === 10) await axe('discard-dialog');
    } else {
      await expect(page.locator('[data-prototype-state="' + current + '"]')).toBeVisible();
      await expect(page.locator(':focus')).toHaveText(heading(current));
      if (current === 'invoice-new-error' && step === 8) {
        await axe('invoice-new-error');
        await testInfo.attach(fidelity + '-fidelity invoice-new-error', { body: await page.locator('[data-prototype-state="invoice-new-error"]').screenshot(), contentType: 'image/png' });
      }
    }
  }
  await expect(page.locator('[data-visited-count]')).toHaveText(String(TRANSITIONS.length));
});

test('the fidelity switch changes the prototype and keeps the choice in the URL', async ({ page }) => {
  const proto = page.locator('[data-prototype]');
  await page.goto('/examples/pocket-invoice-prototype/');
  await expect(proto).toHaveAttribute('data-fidelity', 'low');
  await page.getByRole('radio', { name: /^High/ }).check();
  await expect(proto).toHaveAttribute('data-fidelity', 'high');
  expect(new URL(page.url()).searchParams.get('fidelity')).toBe('high');
  await page.locator('[data-prototype-state="signup"] a[data-transition="1"]').click();
  await expect(proto).toHaveAttribute('data-current-state', 'invoices-empty');
  await page.reload();
  await expect(proto).toHaveAttribute('data-fidelity', 'high');
  await expect(proto).toHaveAttribute('data-current-state', 'invoices-empty');
  await page.getByRole('radio', { name: /^Low/ }).check();
  expect(new URL(page.url()).searchParams.has('fidelity')).toBe(false);
  await expect(proto).toHaveAttribute('data-fidelity', 'low');
});

test('every line of text in the high-fidelity screens fits the space it was laid out for', async ({ page, request }, testInfo) => {
  // UX-005 (#91): the generator wraps text with an estimated character width; here the browser measures each line
  // (getBBox) against the left and right edges the generator recorded in data-fit. The font is whatever the CI
  // browser substitutes for the token's family, which the attached measurements name.
  const manifest = await (await request.get('/examples/ux-pathway/generated/manifest.json')).json() as { outputs: string[] };
  const screens = manifest.outputs.filter((name) => name.startsWith('screens/'));
  expect(screens.length).toBe(STATES.length * 2);
  const measured: { screen: string; text: string; left: number; right: number; from: number; to: number }[] = [];
  let declaredFont = '';
  for (const screen of screens) {
    await page.goto('/examples/ux-pathway/generated/' + screen);
    const lines = await page.evaluate(() => [...document.querySelectorAll<SVGTextElement>('text[data-fit]')].map((element) => {
      const [left = 0, right = 0] = (element.getAttribute('data-fit') ?? '').split(' ').map(Number);
      const box = element.getBBox();
      return { text: element.textContent ?? '', left, right, from: box.x, to: box.x + box.width };
    }));
    declaredFont ||= await page.evaluate(() => { const first = document.querySelector('text'); return first ? getComputedStyle(first).fontFamily : ''; });
    expect(lines.length, screen).toBeGreaterThan(0);
    measured.push(...lines.map((line) => ({ screen, ...line })));
  }
  const overflow = measured.filter((line) => line.from < line.left - 2 || line.to > line.right + 2);
  await testInfo.attach('high-fidelity-text-fit.json', { body: JSON.stringify({ declaredFont, lines: measured.length, overflow }, null, 2), contentType: 'application/json' });
  expect(overflow.map((line) => line.screen + ': ' + line.text + ' ends at ' + line.to.toFixed(1) + ', room to ' + line.right)).toEqual([]);
});

test('the UX pathway serves the open files the flow script generated', async ({ page, request }) => {
  const base = '/examples/ux-pathway/';
  const manifest = await (await request.get(base + 'generated/manifest.json')).json() as { inputs: Record<string, string>; outputs: string[] };
  expect(manifest.outputs).toContain('sitemap.svg');
  for (const name of [...manifest.outputs.map((output) => 'generated/' + output), ...Object.keys(manifest.inputs), 'tools/ux_pathway.mjs', 'tools/ux_hifi.mjs', 'tools/design_tokens.mjs']) {
    const response = await request.get(base + name);
    expect(response.status(), name).toBe(200);
    if (name.endsWith('.svg')) expect(await response.text(), name).toContain('<svg');
  }
  const checks = await (await request.get(base + 'generated/flow-checks.json')).json() as { pass: boolean };
  expect(checks.pass).toBe(true);
  await page.goto('/katas/ux-pathway/');
  for (const name of ['sitemap.svg', 'journey.svg']) {
    const image = page.locator('img[src="' + base + 'generated/' + name + '"]');
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty('complete', true);
    expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth), name).toBeGreaterThan(0);
  }
  await expect(page.locator('a[href="/examples/pocket-invoice-prototype/"]')).toBeVisible();
});
