import { expect, test } from '@playwright/test';

// Curiosity-Corp/developerdojo#128. Every embedded Pocket Garden example renders from srcdoc, so the
// sandboxed (opaque-origin) frame never fetches an HTML page that the Cloudflare edge could inject its
// RUM beacon into. Production showed the beacon failing CORS in the frame on every page with the example.
const pages = [
  { path: '/', title: 'Pocket Garden working prototype example' },
  { path: '/katas', title: 'Pocket Garden working prototype example' },
  { path: '/katas/first-prototype', title: 'Working Pocket Garden example' },
  { path: '/katas/ux-journey', title: 'Try the working Pocket Garden prototype' },
  { path: '/katas/stack-workbench', title: 'Pocket Garden reference' },
  { path: '/katas/decision-replay', title: 'Pocket Garden working example' },
];

for (const { path, title } of pages) {
  test(`the Pocket Garden example renders inline and offline on ${path}`, async ({ page }) => {
    const fetched: string[] = [];
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/examples/pocket-garden')) fetched.push(request.url());
    });
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.goto(path);
    const element = page.locator(`iframe[title="${title}"]`);
    await element.scrollIntoViewIfNeeded();
    await expect(element).toHaveAttribute('sandbox', 'allow-scripts');
    await expect(element).not.toHaveAttribute('src', /.+/);
    expect(await element.getAttribute('srcdoc')).toContain("connect-src 'none'");

    const frame = page.frameLocator(`iframe[title="${title}"]`);
    await expect(frame.getByRole('heading', { name: 'Grow something good.' })).toBeVisible();
    await frame.getByRole('button', { name: 'Likes shade' }).click();
    await expect(frame.getByRole('heading', { name: 'Mint' })).toBeVisible();
    await expect(frame.getByRole('heading', { name: 'Basil' })).toBeHidden();

    expect(fetched, 'the embedded example must not be fetched over the network').toEqual([]);
    expect(errors, 'console errors').toEqual([]);
  });
}

test('the full-screen Pocket Garden page is still served', async ({ request }) => {
  const response = await request.get('/examples/pocket-garden.html');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/html');
  expect(await response.text()).toContain('<h1>Grow something<br>good.</h1>');
});
