import { expect, test } from '@playwright/test';

test('refresh keeps the prior copy on failure and does not remove unrelated data', async ({ page }) => {
  await page.goto('/katas/pocket-dojo');
  const save = page.getByRole('button', { name: 'Save offline pack' });
  await save.click();
  await expect(page.getByRole('status')).toContainText('Offline pack saved', { timeout: 45000 });
  await page.evaluate(async () => {
    localStorage.setItem('dojo-pocket-progress-v1', JSON.stringify({ notes: 'Keep my progress', outcome: true }));
    const cache = await caches.open('dojo-pocket-v1');
    await cache.put('/offline/pocket.html', new Response('Earlier pack copy', { headers: { 'content-type': 'text/html' } }));
    const unrelated = await caches.open('another-application-cache');
    await unrelated.put('/unrelated', new Response('keep'));
  });

  await page.route('**/offline/pocket.html', route => route.abort());
  await save.click();
  await expect(page.getByRole('status')).toContainText('Could not save or refresh');
  expect(await page.evaluate(async () => (await (await caches.open('dojo-pocket-v1')).match('/offline/pocket.html'))?.text())).toBe('Earlier pack copy');

  await page.unroute('**/offline/pocket.html');
  await save.click();
  await expect(page.getByRole('status')).toContainText('Offline pack saved', { timeout: 45000 });
  expect(await page.evaluate(async () => (await (await caches.open('dojo-pocket-v1')).match('/offline/pocket.html'))?.text())).toContain('Practice anywhere.');
  await page.getByRole('button', { name: 'Remove offline pack' }).click();
  await expect(page.getByRole('status')).toContainText('Offline pack removed');
  expect(await page.evaluate(() => localStorage.getItem('dojo-pocket-progress-v1'))).toContain('Keep my progress');
  expect(await page.evaluate(() => caches.has('another-application-cache'))).toBe(true);
});

test('blocked storage leaves practice and export usable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
  });
  await page.goto('/offline/pocket.html');
  await expect(page.getByRole('status')).toContainText('Browser storage is unavailable');
  const outcome = page.getByLabel('I framed an outcome');
  await outcome.focus();
  await page.keyboard.press('Space');
  await expect(outcome).toBeChecked();
  await page.getByLabel('Notes to yourself').fill('Keep a copy');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my notes' }).click();
  expect((await download).suggestedFilename()).toBe('pocket-dojo-progress.json');
});

test('unreadable progress is preserved until the learner clears it', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dojo-pocket-progress-v1', '{broken'));
  await page.goto('/offline/pocket.html');
  await expect(page.getByRole('status')).toContainText('Saved progress could not be read');
  await page.getByLabel('Notes to yourself').fill('New practice');
  expect(await page.evaluate(() => localStorage.getItem('dojo-pocket-progress-v1'))).toBe('{broken');
  await page.getByRole('button', { name: 'Clear this pack’s progress' }).click();
  expect(await page.evaluate(() => localStorage.getItem('dojo-pocket-progress-v1'))).toBeNull();
  await page.getByLabel('Notes to yourself').fill('Fresh practice');
  expect(await page.evaluate(() => localStorage.getItem('dojo-pocket-progress-v1'))).toContain('Fresh practice');
});

test('existing notes, checkboxes and other saved fields survive an edit', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dojo-pocket-progress-v1', JSON.stringify({
    notes: 'Earlier note', outcome: true, futureField: 'Keep me',
  })));
  await page.goto('/offline/pocket.html');
  await expect(page.getByLabel('I framed an outcome')).toBeChecked();
  await expect(page.getByLabel('Notes to yourself')).toHaveValue('Earlier note');
  await page.getByLabel('Notes to yourself').fill('Updated note');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('dojo-pocket-progress-v1') ?? '{}'));
  expect(saved).toMatchObject({ notes: 'Updated note', outcome: true, futureField: 'Keep me' });
});

test('without JavaScript the pack explains its limits and hides inactive buttons', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/katas/pocket-dojo');
    await expect(page.getByText('JavaScript is needed to save the pack for offline use.', { exact: false })).toBeVisible();
    await page.getByRole('link', { name: 'Open Pocket Dojo' }).click();
    await expect(page.getByRole('status')).toContainText('when JavaScript and browser storage are available');
    await expect(page.getByRole('button', { name: 'Download my notes' })).toHaveCount(0);
  } finally {
    await context.close();
  }
});
