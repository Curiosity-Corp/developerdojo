import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Independent review of a cross-field transfer (#95): a learner's practice card opens the review record on that
// field's transfer; the reviewer records the playbook's transfer criteria against the field's own checks, on their
// own device, and copies the review log. Nothing is sent. The learner asks for that review from the same card.
const FIELDS = [
  { id: 'ux', name: 'SaaS UX' },
  { id: 'bim', name: 'Architecture and BIM' },
  { id: 'agriculture', name: 'Agriculture' },
  { id: 'science', name: 'Science and research' },
  { id: 'finance', name: 'Finance' },
  { id: 'manufacturing', name: 'Manufacturing' },
  { id: 'media', name: 'Media' },
];
const panel = (page: Page) => page.locator('[data-subject-panel]:visible');
const UNSEEN = 'Fifteen minutes in, the reviewer swapped the model file for a later revision with two walls moved.';

test("a reviewer opens a learner's transfer from its practice card, records it against the field's checks and copies the log", async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(`${request.url()}\n${request.postData() ?? ''}`));
  await page.goto('/mission-playbook/#practice');
  await page.locator('#practice').getByRole('link', { name: 'Review a transfer into Architecture and BIM' }).click();
  await expect(page).toHaveURL(/\/review-record\?subject=transfer:bim$/);
  await expect(page.getByLabel('What is being reviewed')).toHaveValue('transfer:bim');

  const shown = panel(page);
  await expect(shown.getByRole('heading', { name: 'Transfer into Architecture and BIM' })).toBeVisible();
  const facts = shown.locator('[data-transfer-facts]');
  await expect(facts.getByText("The field's independent reference")).toBeVisible();
  await expect(facts.getByText("Checks you rerun on the learner's work")).toBeVisible();
  await expect(facts.getByRole('link', { name: /^BIM-R01 / })).toHaveAttribute('href', /^\/katas\//);
  await expect(facts.getByRole('link', { name: 'The Architecture and BIM practice sheet' })).toHaveAttribute('href', '/examples/mission-transfer/bim.md');
  await expect(shown.getByText(/Qualified review in this field/)).toBeVisible();

  // The transfer is assessed on the playbook's transfer criteria from the assessment map, nothing else.
  const criteria = shown.locator('fieldset[data-criterion]');
  await expect(criteria).toHaveCount(2);
  await expect(shown.getByRole('group', { name: /^MD-1 / })).toBeVisible();
  await expect(shown.getByRole('group', { name: /^SEN-2 / })).toBeVisible();

  await page.getByLabel('The learner and I agreed in writing', { exact: false }).check();
  await page.getByLabel('I did not prepare this work', { exact: false }).check();
  await page.getByLabel('The unseen task you set').fill(UNSEEN);
  await shown.getByRole('group', { name: /^MD-1 / }).getByLabel('Observed', { exact: true }).check();
  await shown.getByRole('group', { name: /^MD-1 / }).getByRole('textbox').fill('checks/clash-rerun.log, line 12');
  await shown.getByRole('group', { name: /^SEN-2 / }).getByLabel('Not yet observed', { exact: true }).check();
  await expect(page.locator('[data-problems]')).toContainText('SEN-2 needs an evidence reference or the question that stayed open.');
  await shown.getByRole('group', { name: /^SEN-2 / }).getByRole('textbox').fill('No second learner tried the technique from their notes.');
  await page.getByLabel('One strength, tied to evidence').fill('Every assistant change was checked against the coordination rules before it was kept.');
  await page.getByLabel('One gap, tied to evidence').fill('The qualified-review limit was missing from the brief.');
  await expect(page.locator('[data-problems]')).toContainText('Nothing is missing');
  await page.getByRole('button', { name: 'Finish the record' }).click();
  await expect(page.locator('[data-finish-status]')).toContainText('Finished');

  const log = page.getByLabel('Review log as Markdown');
  await expect(log).toHaveValue(/Reviewed against: Transfer into Architecture and BIM \(proposed rubric\)/);
  await expect(log).toHaveValue(/\| MD-1 [^|]+\| Observed \| checks\/clash-rerun\.log, line 12 \|/);
  await expect(log).toHaveValue(/\| SEN-2 [^|]+\| Not yet observed \| No second learner/);
  await expect(log).toHaveValue(/## The field the technique was carried into[\s\S]*Checks the reviewer reruns: [\s\S]*Unseen change of the kind in: BIM-R01/);
  await expect(log).toHaveValue(/## Qualified review in this field/);
  await expect(log).toHaveValue(/awards no belt and no rank/);

  await page.reload();
  await expect(page.getByLabel('What is being reviewed')).toHaveValue('transfer:bim');
  await expect(page.getByLabel('The unseen task you set')).toBeDisabled();
  expect(requests.join('\n')).not.toContain('swapped the model file');
});

test('every practice field links to its own transfer review and request, and both forms offer each one', async ({ page }) => {
  await page.goto('/mission-playbook/#practice');
  for (const field of FIELDS) {
    await expect(page.locator('#practice').getByRole('link', { name: `Review a transfer into ${field.name}` })).toHaveAttribute('href', `/review-record?subject=transfer:${field.id}`);
    await expect(page.locator('#practice').getByRole('link', { name: `Ask for an independent review of your transfer into ${field.name}` })).toHaveAttribute('href', `/review-request?subject=transfer:${field.id}`);
  }
  // The learner's request opens on the field from its card, with the transfer criteria and the field Randori.
  await page.locator('#practice').getByRole('link', { name: 'Ask for an independent review of your transfer into Agriculture' }).click();
  await expect(page).toHaveURL(/\/review-request\?subject=transfer:agriculture$/);
  await expect(page.getByLabel('What you want to be reviewed against')).toHaveValue('transfer:agriculture');
  const request = panel(page);
  await expect(request.getByRole('heading', { name: 'Transfer into Agriculture' })).toBeVisible();
  await expect(request.locator('[data-readiness-for="MD-1"]')).toBeVisible();
  await expect(request.locator('[data-readiness-for="SEN-2"]')).toBeVisible();
  await expect(request.getByText(/Qualified review in this field/)).toBeVisible();
  await expect(page.getByLabel('Review request as Markdown')).toHaveValue(/Review against: Transfer into Agriculture \(proposed rubric\)/);
  await expect(page.locator('optgroup[label="Cross-field transfers"] option')).toHaveCount(FIELDS.length);

  await page.goto('/review-record');
  const options = page.locator('optgroup[label="Cross-field transfers"] option');
  await expect(options).toHaveCount(FIELDS.length);
  for (const field of FIELDS) {
    await page.getByLabel('What is being reviewed').selectOption(`transfer:${field.id}`);
    await expect(panel(page).getByRole('heading', { name: `Transfer into ${field.name}` })).toBeVisible();
    await expect(panel(page).locator('[data-transfer-facts]')).toBeVisible();
  }
});

test('the practice sheet tells the learner where the reviewer records the result', async ({ request }) => {
  const sheet = await (await request.get('/examples/mission-transfer/science.md')).text();
  expect(sheet).toContain('/review-record?subject=transfer:science');
});

test('a transfer review fits a narrow phone screen', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/review-record?subject=transfer:science');
    await expect(panel(page).getByRole('heading', { name: 'Transfer into Science and research' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally {
    await context.close();
  }
});

for (const theme of ['light', 'dark'] as const) {
  test(`a transfer review has no serious accessibility violations (${theme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/review-record?subject=transfer:ux');
    await expect(panel(page).locator('[data-transfer-facts]')).toBeVisible();
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(report.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
  });
}
