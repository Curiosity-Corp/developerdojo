import { expect, test } from '@playwright/test';

test('a learner can record repeated runs without inventing missing measurements', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(`${request.url()}\n${request.postData() ?? ''}`));
  await page.goto('/katas/arena-run-card/');
  await expect(page.getByText('Fictional arithmetic example, not an agent result:', { exact: false })).toBeVisible();
  await page.getByLabel('Task, input and rubric').fill('My fictional seed task');
  await page.getByLabel('Comparison type').selectOption({ label: 'Instructions' });
  await page.getByLabel('Runs for A').fill('4,5,,\nNA,NA,,');
  await page.getByLabel('Runs for B').fill('5,5,0,0');
  await page.getByRole('button', { name: 'Summarize my runs' }).click();
  const record = page.getByLabel('Your editable evidence record');
  await expect(record).toHaveValue(/4\/5 checks passed across 1 assessed run; 1 unassessed/);
  await expect(record).toHaveValue(/Cost: unknown for 2\/2 runs; no average calculated/);
  await expect(record).toHaveValue(/Cost: approximately 0 average per run/);
  await expect(record).toHaveValue(/Comparison type: Instructions/);
  expect(requests.join('\n')).not.toContain('My fictional seed task');
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))).not.toContain('My fictional seed task');

  await page.getByLabel('Runs for B').fill('5,6,,');
  await expect(record).toBeHidden();
  await page.getByRole('button', { name: 'Summarize my runs' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'same number of checks' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test('the worksheet and manual instructions work without JavaScript', async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/katas/arena-run-card/');
    await expect(page.getByText('JavaScript is needed for the on-page calculation.', { exact: false })).toBeVisible();
    await expect(page.getByLabel('Runs for A')).toBeHidden();
    const worksheet = await request.get('/examples/arena-run-worksheet.md');
    expect(worksheet.status()).toBe(200);
    expect(await worksheet.text()).toContain('Blank cost or timing is unknown, not zero.');
  } finally { await context.close(); }
});

test('the Arena links to repeated-run practice', async ({ page }) => {
  await page.goto('/arena/');
  await page.getByRole('link', { name: 'Make a run record' }).click();
  await expect(page).toHaveURL(/\/katas\/arena-run-card\/?$/);
});
