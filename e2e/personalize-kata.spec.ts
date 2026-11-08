import { expect, test } from '@playwright/test';

test('a learner can tailor and edit a kata prompt without losing the original', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('clipboard unavailable'); } } });
  });
  await page.goto('/katas/spark-ideas');
  const original = await page.getByLabel('Your complete prompt').inputValue();
  await page.getByText('Make this prompt about your idea').click();
  await page.getByLabel('What do you want to make?').fill('A reading club');
  await page.getByLabel('How much time do you have?').fill('20 minutes');
  await page.getByRole('button', { name: 'Create my prompt' }).click();
  await expect(page.getByLabel('Your editable prompt')).toHaveValue(/My goal: A reading club/);
  await expect(page.getByLabel('Your editable prompt')).toHaveValue(/Time available: 20 minutes/);
  await expect(page.getByLabel('Your complete prompt')).toHaveValue(original);
  await page.getByLabel('Your editable prompt').fill('My edited prompt');
  await expect(page.getByLabel('Your editable prompt')).toHaveValue('My edited prompt');
  await page.getByRole('button', { name: 'Copy my prompt' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Text selected.' })).toBeVisible();
});

test('a learner can choose their setup and copy the edited prompt without sending it', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', (request) => sent.push(`${request.url()}\n${request.postData() ?? ''}`));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => { document.documentElement.dataset.copiedPrompt = text; } },
    });
  });
  await page.goto('/katas/spark-ideas');
  const summary = page.getByText('Make this prompt about your idea');
  await summary.focus();
  await page.keyboard.press('Enter');
  const goal = page.getByLabel('What do you want to make?');
  await expect(goal).toBeVisible();
  await expect(page.locator('#personal-goal-options option')).toHaveCount(3);
  await goal.fill('A reading club for my local library');
  await page.getByLabel('How much time do you have?').fill('30 minutes');
  await page.getByLabel('What tools can you use?').fill('A phone and a chat app');
  await page.getByLabel('What else should it know?').fill('Use a small budget');
  await page.getByRole('button', { name: 'Create my prompt' }).click();
  const prompt = page.getByLabel('Your editable prompt');
  await expect(prompt).toHaveValue(/one-page project brief/);
  await expect(prompt).toHaveValue(/My goal: A reading club for my local library/);
  await expect(prompt).toHaveValue(/Time available: 30 minutes/);
  await expect(prompt).toHaveValue(/Tools available: A phone and a chat app/);
  await expect(prompt).toHaveValue(/Other requirements: Use a small budget/);
  await prompt.fill('My edited private practice prompt');
  await page.getByRole('button', { name: 'Copy my prompt' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Copied.' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-copied-prompt', 'My edited private practice prompt');
  expect(sent.join('\n')).not.toContain('A reading club for my local library');
  expect(sent.join('\n')).not.toContain('My edited private practice prompt');
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }));
  expect(stored).not.toContain('A reading club for my local library');
  expect(stored).not.toContain('My edited private practice prompt');
});

test('original kata prompt and guidance remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/katas/spark-ideas');
  await expect(page.getByLabel('Your complete prompt')).toHaveValue(/one-page project brief/);
  await page.getByText('Make this prompt about your idea').click();
  await expect(page.getByText('JavaScript is needed to assemble a personalized prompt here.', { exact: false })).toBeVisible();
  await expect(page.getByLabel('What do you want to make?')).toBeHidden();
  await context.close();
});
