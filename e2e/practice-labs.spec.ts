import { expect, test } from '@playwright/test';

test('decision replay shows the real example and staged feedback', async ({ page }) => {
  await page.goto('/katas/decision-replay');
  await expect(page.getByText(/fictional learning scenario/)).toBeVisible();
  await expect(page.frameLocator('iframe[title="Pocket Garden working example"]').getByRole('heading', { name: 'Basil' })).toBeVisible();
  const first = page.locator('.decisions details').first();
  await first.locator('summary').click();
  await expect(first.getByText(/Agree on the desired result/)).toBeVisible();
});

test('decision replay accepts predictions and reveals limits without scripts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/katas/decision-replay');
    await expect(page.getByText(/complete text version/)).toBeVisible();
    await expect(page.getByText(/not evidence of the original build decisions/)).toBeVisible();
    const firstChoice = page.getByRole('radio', { name: 'Agree on the audience, controls and success checks' });
    await firstChoice.focus();
    await page.keyboard.press('Space');
    await expect(firstChoice).toBeChecked();
    await page.getByRole('radio', { name: 'Try the controls and compare their results' }).check();
    const explanations = page.locator('.decisions details');
    await explanations.nth(0).locator('summary').click();
    await expect(explanations.nth(0)).toContainText('a polished page can solve the wrong problem');
    await explanations.nth(1).locator('summary').click();
    await expect(explanations.nth(1)).toContainText('does not prove the result works everywhere');
  } finally {
    await context.close();
  }
});

test('a learner can pick an unfamiliar constraint', async ({ page }) => {
  await page.goto('/katas/constraint-roulette');
  await page.getByRole('button', { name: 'Pick a constraint' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Your constraint:' })).toBeVisible();
  await expect(page.getByLabel('Brief to copy into your assistant')).toHaveValue(/Constraint:/);
  await expect(page.getByText('This is practice, not an automatically graded belt.', { exact: false })).toBeVisible();
});

test('stack comparison rejects invalid data and compares supplied results', async ({ page }) => {
  await page.goto('/katas/budget-boss');
  await page.getByRole('button', { name: 'Compare my results' }).click();
  await expect(page.getByRole('status')).toContainText('Enter a date');
  for (const name of ['A', 'B']) {
    await page.getByLabel(`Date of stack ${name} result`).fill('2026-11-06');
    await page.getByLabel(`Stack ${name} cost per run`).fill(name === 'A' ? '0.05' : '0.02');
    await page.getByLabel(`Stack ${name} time in seconds`).fill(name === 'A' ? '10' : '5');
    await page.getByLabel(`Stack ${name} checks passed`).fill(name === 'A' ? '4' : '3');
    await page.getByLabel(`Stack ${name} checks attempted`).fill('5');
  }
  await page.getByRole('button', { name: 'Compare my results' }).click();
  await expect(page.getByRole('status')).toContainText('4/5 checks passed (80%)');
  await expect(page.getByRole('status')).toContainText('3/5 checks passed (60%)');
});

test('portfolio generator escapes content and rejects unsafe links', async ({ page }) => {
  await page.goto('/katas/portfolio');
  await page.getByLabel('Project title').fill('<script>alert(1)</script>');
  await page.getByLabel('What did you make?').fill('A small prototype');
  await page.getByLabel('How did you check it?').fill('Tested each control');
  await page.getByLabel('What did you learn?').fill('Check the result');
  await page.getByLabel('Public evidence link, if you have one').fill('javascript:alert(1)');
  await page.getByRole('button', { name: 'Prepare my page' }).click();
  await expect(page.getByRole('status')).toContainText('Use a complete HTTPS evidence link');
  await page.getByLabel('Public evidence link, if you have one').fill('https://example.org/evidence');
  await page.getByRole('button', { name: 'Prepare my page' }).click();
  await expect(page.getByLabel('Your page HTML')).toHaveValue(/&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  await expect(page.getByRole('link', { name: 'Download index.html' })).toHaveAttribute('download', 'index.html');
});

test('a learner can save the pocket pack and resume it offline', async ({ page, context }) => {
  await page.goto('/katas/pocket-dojo');
  await page.getByRole('button', { name: 'Save offline pack' }).click();
  await expect(page.getByRole('status')).toContainText('Offline pack saved', { timeout: 45000 });
  await context.setOffline(true);
  try {
    await page.goto('/offline/pocket.html');
    await page.getByLabel('I framed an outcome').check();
    await page.getByLabel('Notes to yourself').fill('Practice note');
    await page.reload();
    await expect(page.getByLabel('I framed an outcome')).toBeChecked();
    await expect(page.getByLabel('Notes to yourself')).toHaveValue('Practice note');
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download my notes' }).click();
    expect((await download).suggestedFilename()).toBe('pocket-dojo-progress.json');
    await page.getByRole('button', { name: 'Clear this pack’s progress' }).click();
    await expect(page.getByLabel('I framed an outcome')).not.toBeChecked();
    await expect(page.getByLabel('Notes to yourself')).toHaveValue('');
  } finally {
    await context.setOffline(false);
  }
});
