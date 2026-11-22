import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// The independent review request (#90): the learner's half of a pilot review.
const panel = (page: Page) => page.locator('[data-subject-panel]:visible');
const markdown = (page: Page) => page.getByLabel('Review request as Markdown');

async function fillRequest(page: Page): Promise<void> {
  const locations: [string, string][] = [
    ['The actual artifacts', 'my-repo/prototype/'],
    ['Reproducible configuration', 'my-repo/STACK.md'],
    ['Tests and checks', 'my-repo/checks/'],
    ['Failures', 'my-repo/notes/failures.md'],
    ['Decision evidence', 'my-repo/notes/decisions.md'],
  ];
  for (const [label, value] of locations) await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByLabel('The reviewer may open', { exact: true }).fill('The repository and its run logs.');
  await page.getByLabel('The reviewer may keep a copy of', { exact: true }).fill('Nothing after the session.');
  await page.getByLabel('The reviewer may share, and with whom', { exact: true }).fill('Only the review log, with the coordinator.');
  await page.getByLabel('Access ends, and copies are deleted, on or by', { exact: true }).fill('Two weeks after the session.');
  await page.getByLabel('No AI service may read my material.').check();
  await page.getByLabel('This request names no person', { exact: false }).check();
}

test('a learner reaches a preselected request from a rank and from a specialist belt on the assessment map', async ({ page }) => {
  await page.goto('/assessment-map');
  const rank = page.locator('#rank-master-developer');
  await expect(rank.getByRole('heading', { name: 'Unseen task in a review' })).toBeVisible();
  await rank.getByRole('link', { name: 'Ask for a Master Developer review' }).click();
  await expect(page).toHaveURL(/\/review-request\?subject=rank:master-developer$/);
  await expect(page.getByLabel('What you want to be reviewed against')).toHaveValue('rank:master-developer');
  await expect(panel(page).getByRole('heading', { name: 'Master Developer rank' })).toBeVisible();
  await expect(panel(page).getByText(/You will not see it in advance/)).toContainText('a tool withdrawn or a failure injected');
  await expect(panel(page).locator('[data-readiness-for="MD-1"]')).toContainText('MD-1 Transfer to an unseen tool family or field');

  await page.goto('/assessment-map');
  await page.locator('#belt-science').getByRole('link', { name: 'Request a Brown stage review, Science and research' }).click();
  await expect(page).toHaveURL(/\/review-request\?subject=belt:science:brown$/);
  await expect(panel(page).getByRole('heading', { name: 'Science and research specialist belt, Brown stage' })).toBeVisible();
  await expect(panel(page).getByText('The field Randori it draws on:', { exact: false }).getByRole('link')).toHaveAttribute('href', /^\/katas\//);
  await expect(panel(page).getByText(/Qualified review in this field/)).toBeVisible();
});

test('the page explains the whole review, and where the request and the review record fit', async ({ page }) => {
  await page.goto('/review-request');
  const how = page.locator('#how');
  await expect(how.getByRole('heading', { name: 'How an independent review works, end to end' })).toBeVisible();
  await expect(how.getByText('You write the scope in your request on this page.')).toBeVisible();
  await expect(how.getByRole('link', { name: 'review record' })).toHaveAttribute('href', '/review-record');
  await expect(page.locator('[data-request-boundary]')).toContainText('awards nothing and is not an application for a certificate');
});

test('a request shows which criteria lack evidence, refuses a secret, and is ready only when complete', async ({ page }) => {
  await page.goto('/review-request');
  await page.getByLabel('What you want to be reviewed against').selectOption('rank:developer');
  const problems = page.locator('[data-problems]');
  await expect(problems).toContainText('Say where the reviewer will find: The actual artifacts.');
  await expect(panel(page).locator('[data-readiness-for="DEV-1"] [data-readiness]')).toHaveText('Not located yet: The actual artifacts, Tests and checks.');

  await page.getByLabel('The actual artifacts', { exact: true }).fill('my-repo/prototype/');
  await expect(panel(page).locator('[data-readiness-for="DEV-1"] [data-readiness]')).toHaveText('Not located yet: Tests and checks.');

  await fillRequest(page);
  await expect(panel(page).locator('[data-readiness-for="DEV-1"] [data-readiness]')).toHaveText('Evidence located.');
  await expect(panel(page).locator('[data-readiness-for="DEV-3"] [data-readiness]')).toHaveText('Evidence located; the reviewer adds the review log in the session.');
  await expect(problems).toContainText('Nothing is missing');
  await expect(page.locator('[data-ready-status]')).toHaveText('Ready to send.');

  await page.getByLabel('Reproducible configuration', { exact: true }).fill('STACK.md, api_key: abc123');
  await expect(problems).toContainText('looks like a password, key or token');
  await expect(page.locator('[data-ready-status]')).toHaveText('1 thing still missing.');
  await page.getByLabel('Reproducible configuration', { exact: true }).fill('my-repo/STACK.md');

  await expect(markdown(page)).toHaveValue(/# Independent review request/);
  await expect(markdown(page)).toHaveValue(/Review against: Developer rank \(proposed rubric\)/);
  await expect(markdown(page)).toHaveValue(/Status: ready to send/);
  await expect(markdown(page)).toHaveValue(/\| DEV-1 Outcome and checks \| The actual artifacts: my-repo\/prototype\/; Tests and checks: my-repo\/checks\/ \|/);
  await expect(markdown(page)).toHaveValue(/I have not been told the task/);
  await expect(markdown(page)).toHaveValue(/awards nothing and is not an application for a certificate/);
});

test('a request is kept on the device, listed in saved data, and can be started again', async ({ page }) => {
  await page.goto('/review-request?subject=rank:sensei');
  await fillRequest(page);
  await expect(page.locator('[data-saved]')).toHaveText('Saved on this device.');
  await page.reload();
  await expect(page.getByLabel('What you want to be reviewed against')).toHaveValue('rank:sensei');
  await expect(page.getByLabel('Decision evidence', { exact: true })).toHaveValue('my-repo/notes/decisions.md');
  await expect(page.getByLabel('No AI service may read my material.')).toBeChecked();

  await page.goto('/train');
  await expect(page.locator('[data-dd-list]')).toContainText('Independent review request');

  await page.goto('/review-request');
  const start = page.getByRole('button', { name: 'Start a new request' });
  await start.click();
  await page.getByRole('button', { name: 'Click again to start a new request' }).click();
  await expect(page.getByLabel('Decision evidence', { exact: true })).toHaveValue('');
  await expect(markdown(page)).toHaveValue(/Status: draft, \d+ things still missing/);
});

test('the review request fits a narrow phone screen', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/review-request?subject=belt:agriculture:black');
    await expect(panel(page).getByRole('heading', { name: 'Agriculture and natural resources specialist belt, Black stage' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally {
    await context.close();
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('the page explains the review and points to the review packet', async ({ page }) => {
    await page.goto('/review-request');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Ask for an independent review');
    await expect(page.locator('#how')).toBeVisible();
    await expect(page.locator('[data-review-request]')).toBeHidden();
    await expect(page.getByText('The request form needs JavaScript.', { exact: false })).toBeVisible();
  });
});

for (const theme of ['light', 'dark'] as const) {
  test(`the review request has no serious accessibility violations (${theme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto('/review-request?subject=belt:ux:brown');
    await expect(panel(page)).toBeVisible();
    const report = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(report.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
  });
}
