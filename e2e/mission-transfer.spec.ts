import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

// Transfer practice on the mission playbook (#95): choose a field, get its practice sheet in the editable brief or as a
// download, with the rubric result left unavailable. Nothing is saved or sent.
const FIELDS = [
  { id: 'ux', name: 'SaaS UX', randori: 'UX-R01' },
  { id: 'bim', name: 'Architecture and BIM', randori: 'BIM-R01' },
  { id: 'agriculture', name: 'Agriculture', randori: 'AGR-R01' },
  { id: 'science', name: 'Science and research', randori: 'SCI-R01' },
  { id: 'finance', name: 'Finance', randori: 'FIN-R01' },
  { id: 'manufacturing', name: 'Manufacturing and product design', randori: 'MFG-R01' },
];

test('a learner chooses a field and gets its transfer practice sheet in the editable brief', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(`${request.url()}\n${request.postData() ?? ''}`));
  await page.goto('/mission-playbook/');
  await page.getByRole('link', { name: 'Practise a transfer' }).click();
  const practice = page.locator('#practice');
  await expect(practice.getByRole('heading', { level: 2, name: 'Carry the technique into a field yourself' })).toBeVisible();
  for (const field of FIELDS) await expect(practice.getByRole('heading', { level: 3, name: `Into ${field.name}` })).toBeVisible();

  await practice.getByRole('button', { name: 'Put the Science and research practice sheet in my brief' }).click();
  const brief = page.getByLabel('Your editable mission brief');
  await expect(brief).toBeFocused();
  await expect(brief).toHaveValue(/^# Transfer practice: Science and research/);
  await expect(brief).toHaveValue(/SCI-R01/);
  await expect(brief).toHaveValue(/GUM/);
  await expect(brief).toHaveValue(/- Independent rubric result: Unavailable until an independent reviewer records it\./);
  await expect(page.locator('#mission-status')).toHaveText(/Science and research practice sheet is in your brief/);

  // Switching fields replaces an untouched sheet without asking.
  await practice.getByRole('button', { name: 'Put the SaaS UX practice sheet in my brief' }).click();
  await expect(brief).toHaveValue(/^# Transfer practice: SaaS UX/);

  // An edited brief is replaced only when the learner agrees.
  await brief.fill(`${await brief.inputValue()}\nMy own note.`);
  page.once('dialog', (dialog) => void dialog.dismiss());
  await practice.getByRole('button', { name: 'Put the Agriculture practice sheet in my brief' }).click();
  await expect(brief).toHaveValue(/My own note\./);
  await expect(page.locator('#mission-status')).toHaveText('Your brief is unchanged.');
  page.once('dialog', (dialog) => void dialog.accept());
  await practice.getByRole('button', { name: 'Put the Agriculture practice sheet in my brief' }).click();
  await expect(brief).toHaveValue(/^# Transfer practice: Agriculture/);
  await expect(brief).not.toHaveValue(/My own note/);

  // The learner's download carries the sheet they loaded.
  const pending = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download my brief' }).click();
  const path = await (await pending).path();
  expect(path).not.toBeNull();
  if (path) expect(await readFile(path, 'utf8')).toMatch(/^# Transfer practice: Agriculture/);
  expect(requests.join('\n')).not.toContain('My own note');
});

test('each field has a downloadable practice sheet read from its pathway', async ({ page, request }) => {
  await page.goto('/mission-playbook/#practice');
  for (const field of FIELDS) {
    const link = page.getByRole('link', { name: `Download the ${field.name} practice sheet` });
    await expect(link).toHaveAttribute('href', `/examples/mission-transfer/${field.id}.md`);
    const response = await request.get(`/examples/mission-transfer/${field.id}.md`);
    expect(response.status(), field.id).toBe(200);
    const sheet = await response.text();
    expect(sheet).toContain(`# Transfer practice: ${field.name}`);
    expect(sheet).toContain(field.randori);
    for (const label of ['Authorized inputs and permissions', 'Independent review and qualified professional approval required', 'Foundation technique that transfers', 'A verified technique improvement or benchmark correction']) expect(sheet).toContain(`- ${label}:`);
    expect(sheet).toContain('SEN-2');
    expect(sheet).toContain('MD-1');
    expect(sheet).not.toMatch(/git\.developerdojo|(^|\s)#\d+\b/);
  }
});

test('without JavaScript the practice sheets are still downloads and the brief buttons stay hidden', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/mission-playbook/#practice');
    for (const field of FIELDS) {
      await expect(page.getByRole('link', { name: `Download the ${field.name} practice sheet` })).toBeVisible();
      await expect(page.getByRole('button', { name: `Put the ${field.name} practice sheet in my brief` })).toHaveCount(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});
