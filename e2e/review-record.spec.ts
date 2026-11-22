import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Specialist belts and the independent review record (#90).
const panel = (page: Page) => page.locator('[data-subject-panel]:visible');

/** Fills every criterion of the subject on screen, plus the rest of the record, so it can be finished. */
async function fillRecord(page: Page): Promise<void> {
  await page.getByLabel('The learner and I agreed in writing', { exact: false }).check();
  await page.getByLabel('I did not prepare this work', { exact: false }).check();
  await page.getByLabel('The unseen task you set').fill('Ten minutes in, the reviewer withdrew the charting library.');
  const criteria = panel(page).locator('fieldset[data-criterion]');
  const count = await criteria.count();
  expect(count).toBeGreaterThan(1);
  for (let index = 0; index < count; index++) {
    const criterion = criteria.nth(index);
    await criterion.getByLabel('Observed', { exact: true }).check();
    await criterion.getByRole('textbox').fill(`checks/run-${index + 1}.log, line 4`);
  }
  await page.getByLabel('One strength, tied to evidence').fill('Every check was rerun after the change.');
  await page.getByLabel('One gap, tied to evidence').fill('The limits were stated only when asked.');
  await page.getByLabel('Time taken in minutes (optional)').fill('45');
}

test('the assessment map shows a specialist belt for each field pathway, with its checks, Randori and limits', async ({ page }) => {
  await page.goto('/assessment-map');
  const section = page.locator('#specialist-belts');
  await expect(section.getByRole('heading', { name: 'Specialist belts', level: 2 })).toBeVisible();
  for (const field of ['UX and product design', 'Architecture and BIM', 'Agriculture and natural resources', 'Science and research']) {
    await expect(section.getByRole('heading', { name: field, level: 4 })).toBeVisible();
  }
  await expect(section.getByRole('heading', { name: /SPB-2 The field Randori, unseen/ })).toBeVisible();
  const science = section.locator('#belt-science');
  await expect(science.getByText('Checks the reviewer reruns')).toBeVisible();
  await expect(science.getByText(/No metrologist, statistician or climate scientist/)).toBeVisible();
  await expect(science.getByRole('link', { name: /Randori/ })).toHaveAttribute('href', /^\/katas\//);
  await science.getByRole('link', { name: 'Brown stage, Science and research' }).click();
  await expect(page).toHaveURL(/\/review-record\?subject=belt:science:brown$/);
  await expect(page.getByLabel('What is being reviewed')).toHaveValue('belt:science:brown');
  await expect(panel(page).getByRole('heading', { name: 'Science and research specialist belt, Brown stage' })).toBeVisible();
  await expect(panel(page).getByText(/Qualified review in this field/)).toBeVisible();
  await expect(panel(page).getByRole('group', { name: /BELT-BROWN Brown stage: Solve an unfamiliar challenge/ })).toBeVisible();
});

test('a reviewer cannot finish without consent, independence and an evidence reference for every criterion', async ({ page }) => {
  await page.goto('/review-record');
  await page.getByLabel('What is being reviewed').selectOption('rank:master-developer');
  const problems = page.locator('[data-problems]');
  await expect(problems).toContainText('consent');
  await expect(problems).toContainText('MD-1 has no observation yet.');
  await fillRecord(page);
  await panel(page).locator('fieldset[data-criterion="MD-2"]').getByRole('textbox').fill('');
  await page.getByRole('button', { name: 'Finish the record' }).click();
  await expect(page.locator('[data-finish-status]')).toContainText('Not finished');
  await expect(problems).toContainText('MD-2 is marked Observed without an evidence reference. Absence of evidence is not a pass.');
  await expect(page.getByLabel('The unseen task you set')).toBeEditable();
});

test('a finished record is locked, survives a reload, takes dated corrections and copies as a review log', async ({ page }) => {
  await page.goto('/review-record');
  await page.getByLabel('What is being reviewed').selectOption('rank:sensei');
  await fillRecord(page);
  await expect(page.locator('[data-problems]')).toContainText('Nothing is missing');
  await page.getByRole('button', { name: 'Finish the record' }).click();
  await expect(page.locator('[data-finish-status]')).toContainText('Finished');
  await expect(page.getByLabel('One strength, tied to evidence')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Finish the record' })).toBeHidden();

  const log = page.getByLabel('Review log as Markdown');
  await expect(log).toHaveValue(/# Independent review record/);
  await expect(log).toHaveValue(/Reviewed against: Sensei rank \(proposed rubric\)/);
  await expect(log).toHaveValue(/\| SEN-1 Teach a generalizable technique \| Observed \| checks\/run-1\.log, line 4 \|/);
  await expect(log).toHaveValue(/awards no belt and no rank/);

  await page.reload();
  await expect(page.getByLabel('What is being reviewed')).toHaveValue('rank:sensei');
  await expect(page.getByLabel('One strength, tied to evidence')).toBeDisabled();
  await expect(page.getByLabel('One strength, tied to evidence')).toHaveValue('Every check was rerun after the change.');

  await page.getByLabel('Correction', { exact: true }).fill('SEN-3 reference should be checks/run-3.log, line 9.');
  await page.getByRole('button', { name: 'Add the correction' }).click();
  await expect(log).toHaveValue(/## Corrections[\s\S]*SEN-3 reference should be checks\/run-3\.log, line 9\./);
  await expect(log).toHaveValue(/\| SEN-3 [^|]+\| Observed \| checks\/run-3\.log, line 4 \|/);

  await page.goto('/train');
  await expect(page.locator('[data-dd-list]')).toContainText('Independent review record');

  await page.goto('/review-record');
  const start = page.getByRole('button', { name: 'Start a new record' });
  await start.click();
  await page.getByRole('button', { name: 'Click again to start a new record' }).click();
  await expect(page.getByLabel('One strength, tied to evidence')).toBeEditable();
  await expect(page.getByLabel('One strength, tied to evidence')).toHaveValue('');
  await expect(log).toHaveValue(/Status: draft, not finished/);
});

test('the review record fits a narrow phone screen', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/review-record?subject=belt:agriculture:black');
    await expect(panel(page).getByRole('heading', { name: 'Agriculture and natural resources specialist belt, Black stage' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally {
    await context.close();
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the page explains the review and how to write the log by hand', async ({ page }) => {
    await page.goto('/review-record');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Record an independent review');
    await expect(page.locator('[data-record-boundary]')).toContainText('issues no belt and no rank');
    await expect(page.locator('[data-review-record]')).toBeHidden();
    await expect(page.getByText('The review record needs JavaScript.', { exact: false })).toBeVisible();
  });
});

for (const theme of ['light', 'dark'] as const) {
  test(`the review record has no serious accessibility violations (${theme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/review-record?subject=belt:ux:brown');
    await expect(panel(page)).toBeVisible();
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(report.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
  });
}
