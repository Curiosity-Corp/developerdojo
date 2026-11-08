import { expect, test } from '@playwright/test';

test('builds local evidence files with decisions, limits and credits', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(`${request.url()}\n${request.postData() ?? ''}`));
  await page.goto('/katas/portfolio');
  await expect(page.getByRole('link', { name: 'Use the GitHub portfolio template' })).toHaveAttribute('href', 'https://github.com/Curiosity-Corp/dojo-portfolio-template');
  await expect(page.getByRole('link', { name: 'Preview the blank starter' })).toHaveAttribute('href', 'https://curiosity-corp.github.io/dojo-portfolio-template/');
  await page.getByText('Use the GitHub CLI on a computer').click();
  await expect(page.getByText('gh repo create my-portfolio', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  await page.getByLabel('Project title').fill('Garden <script>alert(1)</script>');
  await page.getByLabel('What did you make?').fill('A fictional garden prototype');
  await page.getByLabel('Which tools, versions and agent roles did you actually use?').fill('Browser assistant; sketch tool v2');
  await page.getByLabel('What did you decide, change or delegate?').fill('I chose the layout and checked the agent draft.');
  await page.getByLabel('How did you check it?').fill('I tested three controls.');
  await page.getByLabel('What failed, remains untested or needs independent review?').fill('Screen reader behavior not yet tested.');
  await page.getByLabel('What did you learn?').fill('Check the actual result.');
  await page.getByLabel('Whose work or sources did you use, and how may they be shared?').fill('Fictional practice; no external assets.');
  await page.getByLabel('Public evidence link, if you have one').fill('https://example.org/evidence');
  await page.getByRole('button', { name: 'Prepare my page' }).click();
  const html = page.getByLabel('Your page HTML');
  await expect(html).toHaveValue(/&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  await expect(html).toHaveValue(/Screen reader behavior not yet tested/);
  const readme = page.getByLabel('Your repository README');
  await expect(readme).toHaveValue(/## Tools and agent roles/);
  await expect(readme).toHaveValue(/## Decisions and delegation/);
  await expect(readme).toHaveValue(/## Limitations and review/);
  await expect(readme).toHaveValue(/## Sources and permissions/);
  await expect(readme).toHaveValue(/\\<script\\>/);
  const readmeLink = page.getByRole('link', { name: 'Download README.md' });
  await expect(readmeLink).toHaveAttribute('download', 'README.md');
  const href = await readmeLink.getAttribute('href');
  expect(href).toMatch(/^blob:/);
  const contents = await page.evaluate(async (url) => (await fetch(url)).text(), href!);
  expect(contents).toContain('Screen reader behavior not yet tested');
  expect(contents).toContain('<https://example.org/evidence>');
  await page.getByLabel('What did you learn?').fill('Revise the evidence after changes.');
  await expect(readmeLink).toBeHidden();
  await expect(page.locator('#portfolio-status')).toContainText('Prepare your page again');
  await page.getByRole('button', { name: 'Prepare my page' }).click();
  await expect(readme).toHaveValue(/Revise the evidence after changes/);
  expect(requests.join('\n')).not.toContain('A fictional garden prototype');
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))).not.toContain('A fictional garden prototype');
});

test('works without scripts and exposes the blank practice template', async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('/katas/portfolio');
    await expect(page.getByText('JavaScript is needed to generate files here.', { exact: false })).toBeVisible();
    await expect(page.getByLabel('Project title')).toBeHidden();
    await expect(page.getByRole('link', { name: 'Download the blank evidence template' })).toHaveAttribute('href', '/examples/portfolio-template.md');
    await expect(page.getByText('Settings → Pages', { exact: false })).toBeVisible();
    const template = await request.get('/examples/portfolio-template.md');
    expect(template.status()).toBe(200);
    expect(await template.text()).toContain('not evidence that any work was completed');
  } finally {
    await context.close();
  }
});
