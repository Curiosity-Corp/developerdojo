import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// The Gallery (#87). Runs in both Playwright projects: desktop (1440 px) and mobile (Pixel 7, 390 px).

const GALLERY = '/gallery';
const ENTRIES = ['fnd-001-stack-comparison', 'pocket-garden-prototype', 'ifc-wall-quantity-trace', 'bim-pathway-edited-model', 'reconstructed-3d-office', 'pocket-invoice-penpot-file', 'agriculture-irrigation-estimate', 'science-trend-with-uncertainty'];

async function setTheme(page: Page, theme: 'light' | 'dark'): Promise<void> {
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
}
const card = (page: Page, id: string) => page.locator(`article#${id}`);
const visibleIds = async (page: Page): Promise<string[]> =>
  page.locator('[data-gallery-entry]:visible').evaluateAll((cards) => cards.map((element) => element.id));

test('every entry shows the artifact, provenance, rights and a dated check', async ({ page }) => {
  await page.goto(GALLERY);
  await expect(page.getByRole('heading', { level: 1, name: 'The Gallery' })).toBeVisible();
  expect(await visibleIds(page)).toEqual(ENTRIES);
  for (const id of ENTRIES) {
    const entry = card(page, id);
    for (const term of ['Artifact', 'Made by', 'Source', 'Rights', 'Checked', 'Not checked', 'Outcome', 'Fields']) {
      await expect(entry.getByRole('term').filter({ hasText: new RegExp(`^${term}$`) }), `${id}: ${term}`).toHaveCount(1);
    }
    await expect(entry.locator('[data-check]')).toContainText(/Verified: .+, [A-Z][a-z]+ \d{1,2}, 20\d\d/);
    for (const step of ['recipe', 'exercise', 'qa', 'belt', 'foundations']) await expect(entry.locator(`[data-step="${step}"]`), `${id}: ${step}`).toHaveCount(1);
  }
});

test('native artifacts, rendered previews and planned outcomes are told apart', async ({ page }) => {
  await page.goto(GALLERY);
  await expect(card(page, 'pocket-garden-prototype').locator('[data-form="native"]')).toHaveText('Native artifact');
  await expect(card(page, 'reconstructed-3d-office').locator('[data-form="preview"]')).toHaveText('Rendered preview');
  await expect(card(page, 'reconstructed-3d-office').locator('[data-check="source-check"]')).toContainText('Source and terms checked');
  await expect(card(page, 'reconstructed-3d-office')).toContainText('The Dojo did not rebuild the scene.');
  const planned = page.locator('[data-field-group="robotics"]');
  await expect(planned).toHaveAttribute('data-planned', 'true');
  await expect(planned).toContainText('No verified example in this field yet.');
  await expect(page.locator('[data-outcome-group="compare-instructions"]')).toContainText('No verified example yet.');
  await expect(page.locator('[data-outcome-group="compare-instructions"]').getByRole('link', { name: 'Compare AI instructions' })).toHaveAttribute('href', '/katas/compare-instructions');
});

test('the FND-001 entry links its real evidence and its draft recipe page', async ({ page, request }) => {
  await page.goto(GALLERY);
  const fnd = card(page, 'fnd-001-stack-comparison');
  await expect(fnd.locator('.badge.foundation')).toBeVisible();
  for (const name of ['Read the evidence notes', 'Every check result (JSON)', 'Open one checked run']) {
    const href = await fnd.getByRole('link', { name, exact: true }).getAttribute('href');
    expect(href).toBeTruthy();
    expect((await request.get(href ?? '')).status(), name).toBe(200);
  }
  await expect(fnd.locator('[data-step="recipe"] [data-unavailable]')).toHaveCount(0);
  await expect(fnd.locator('[data-step="recipe"]').getByRole('link')).toHaveAttribute('href', /\/katas\/fnd-001-stack-comparison\/?$/);
  await expect(fnd.locator('[data-step="belt"]')).toContainText('Demonstrate:');
});

test('a learner moves from a finished artifact to its recipe page', async ({ page }) => {
  await page.goto(GALLERY);
  const ifc = card(page, 'ifc-wall-quantity-trace');
  await expect(ifc.locator('[data-step="qa"]')).toContainText('qualified professional');
  await ifc.locator('[data-step="recipe"]').getByRole('link').click();
  await expect(page).toHaveURL(/\/katas\/inspect-ifc\/?$/);
});

test('a draft recipe artifact links its recipe page and its import evidence', async ({ page, request }) => {
  await page.goto(GALLERY);
  const penpot = card(page, 'pocket-invoice-penpot-file');
  await expect(penpot.locator('[data-step="recipe"]').getByRole('link')).toHaveAttribute('href', /\/katas\/ux-002-low-fidelity\/?$/);
  for (const name of ['Download the Penpot file', 'Download the design tokens (JSON)', 'Use the working page']) {
    const href = await penpot.getByRole('link', { name, exact: true }).getAttribute('href');
    expect((await request.get(href ?? '')).status(), name).toBe(200);
  }
});

test('the BIM pathway entry leads to its recipe and its CI-computed files', async ({ page, request }) => {
  await page.goto(`${GALLERY}?outcome=revise-and-revalidate-model`);
  expect(await visibleIds(page)).toEqual(['bim-pathway-edited-model']);
  const bim = card(page, 'bim-pathway-edited-model');
  for (const link of await bim.locator('a[href^="/examples/bim-pathway/"]').all()) {
    const href = await link.getAttribute('href');
    expect((await request.get(href ?? '')).status(), href ?? '').toBe(200);
  }
  await expect(bim.locator('[data-step="recipe"]').getByRole('link')).toHaveAttribute('href', '/katas/bim-004-change-and-revalidate');
});

test('outcome and field filters compose and never hide the shared foundation', async ({ page }) => {
  await page.goto(GALLERY);
  const outcome = page.getByLabel('Outcome', { exact: true });
  const field = page.getByLabel('Field', { exact: true });
  const status = page.locator('[data-gallery-status]');
  const empty = page.locator('[data-gallery-empty]');

  await field.selectOption('architecture-bim');
  expect(await visibleIds(page)).toEqual(['fnd-001-stack-comparison', 'ifc-wall-quantity-trace', 'bim-pathway-edited-model']);
  await expect(status).toHaveText('Showing 3 of 8 artifacts.');
  await expect(empty).toBeHidden();
  await expect(page).toHaveURL(/field=architecture-bim/);

  await outcome.selectOption('read-model');
  expect(await visibleIds(page)).toEqual(['ifc-wall-quantity-trace']);

  // One artifact, two fields.
  await outcome.selectOption('design-journey');
  await field.selectOption('ux');
  expect(await visibleIds(page)).toEqual(['pocket-garden-prototype']);
  await field.selectOption('software');
  expect(await visibleIds(page)).toEqual(['pocket-garden-prototype']);

  // A field with no verified example: an honest empty state, the foundation still shown.
  await outcome.selectOption('');
  await field.selectOption('robotics');
  expect(await visibleIds(page)).toEqual(['fnd-001-stack-comparison']);
  await expect(empty).toBeVisible();
  await expect(empty).toContainText('No verified example in Robotics and autonomy yet. The shared foundation still applies.');
  await expect(page.locator('[data-shared-foundations]')).toBeVisible();

  await page.getByRole('button', { name: 'Show everything' }).click();
  await expect(status).toHaveText('Showing all 8 artifacts.');
  expect(await visibleIds(page)).toEqual(ENTRIES);
});

test('a filtered link restores its filters', async ({ page }) => {
  await page.goto(`${GALLERY}?outcome=inspect-3d&field=3d`);
  await expect(page.getByLabel('Outcome', { exact: true })).toHaveValue('inspect-3d');
  await expect(page.getByLabel('Field', { exact: true })).toHaveValue('3d');
  expect(await visibleIds(page)).toEqual(['reconstructed-3d-office']);
});

test('without JavaScript every entry and both browse paths work on a small phone', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto(GALLERY);
    await expect(page.locator('[data-gallery-filters]')).toBeHidden();
    expect(await page.locator('[data-gallery-entry]:visible').count()).toBe(ENTRIES.length);
    await page.locator('[data-field-group="construction"]').getByRole('link', { name: 'A wall area traced to a real IFC model' }).click();
    await expect(page).toHaveURL(/#ifc-wall-quantity-trace$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally {
    await context.close();
  }
});

for (const theme of ['light', 'dark'] as const) {
  test(`the gallery has no serious accessibility violations (${theme})`, async ({ page }) => {
    await page.goto(GALLERY);
    await setTheme(page, theme);
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(report.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical').map((violation) => violation.id)).toEqual([]);
  });
}
