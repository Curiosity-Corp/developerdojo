import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { STATES, TRANSITIONS, stateById, type StateId } from '../src/data/pocket-invoice';

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
