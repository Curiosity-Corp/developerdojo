import { expect, test, type Page } from '@playwright/test';

// Test-only fixture, injected into the page in the browser. It is never part of src/data.
const FIXTURE = [
  { code: 'DD-TEST-0001', holder: 'Test Holder One', level: 'developer', issuedOn: '2027-01-15' },
  { code: 'DD-TEST-0002', holder: 'Zoe Example', level: 'master-developer', issuedOn: '2027-02-01' },
];

async function useRegistry(page: Page, registry: unknown): Promise<void> {
  await page.evaluate((json) => {
    const el = document.getElementById('cert-registry');
    if (el) el.textContent = json;
  }, JSON.stringify(registry));
}

async function check(page: Page, query: string): Promise<void> {
  await page.getByLabel('Certificate ID or name').fill(query);
  await page.getByRole('button', { name: 'Check certificate' }).click();
}

test.describe('Sensei', () => {
  test('renders the program: points, tiers with no money, honest apply path', async ({ page }) => {
    await page.goto('/sensei');
    await expect(page.locator('h1')).toHaveText('Become a Sensei.');
    await expect(page.getByText('The Sensei Program', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'How Sensei earn' })).toBeVisible();
    await expect(page.getByRole('cell', { name: /100 pts/ })).toBeVisible();
    await expect(page.getByRole('cell', { name: /\+500 pts/ })).toBeVisible();
    await expect(page.getByText('10,000', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('50,000', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Rewards for each tier are being finalised')).toBeVisible();
    for (const heading of ['How you contribute', 'How you level up', 'Contribution is measured by']) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
    // Empty live schedule renders the honest empty state.
    await expect(page.getByText('Schedule announced soon')).toBeVisible();
    // No money anywhere on the page.
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/\$\s?\d/);
    expect(text.toLowerCase()).not.toContain('cash');
    expect(text.toLowerCase()).not.toContain('payout');
  });

  test('apply leads to a real section that links to contact and shows no email', async ({ page }) => {
    await page.goto('/sensei');
    await page.getByRole('link', { name: 'Apply to become a Sensei' }).first().click();
    await expect(page).toHaveURL(/#apply$/);
    const apply = page.locator('#apply');
    await expect(apply.getByText('Applications open soon.')).toBeVisible();
    await expect(apply.getByRole('link', { name: 'contact page' })).toHaveAttribute('href', '/contact');
    expect(await apply.innerText()).not.toMatch(/\S+@\S+/);
    // Apply and coaching requests go to the real CRC contact form, worded as requests, not bookings.
    const crc = 'https://curiositycorp.org/get-involved/contact.html';
    await expect(apply.getByRole('link', { name: 'Tell CRC you want to apply' })).toHaveAttribute('href', crc);
    await expect(apply.getByRole('link', { name: 'Ask about a coaching session' })).toHaveAttribute('href', crc);
    await expect(apply.getByText('this is a request, not a booking')).toBeVisible();
    expect(await apply.getByRole('link', { name: 'Book a coaching session' }).count()).toBe(0);
  });
});

test.describe('Certificates', () => {
  test('renders ranks, assessment, validity and links to the library', async ({ page }) => {
    await page.goto('/certificates');
    await expect(page.locator('h1')).toHaveText('Certificates.');
    for (const name of ['Developer', 'Master Developer', 'Sensei']) {
      await expect(page.locator('#ranks').getByRole('heading', { name, exact: true })).toBeVisible();
    }
    await expect(page.getByRole('heading', { name: 'How assessment works' })).toBeVisible();
    await expect(page.getByText('The belt system is still being developed', { exact: false })).toBeVisible();
    await expect(page.getByText('Neither a Dojo certificate nor a future belt is a professional license', { exact: false })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Integrity and AI policy' })).toBeVisible();
    await expect(page.getByText('renewed every year')).toBeVisible();
    await expect(page.locator('#ranks').getByRole('link', { name: 'Product Package standard' })).toHaveAttribute(
      'href',
      '/library/product-package-standard',
    );
    await expect(page.locator('#ranks').getByRole('link', { name: 'Master Developer assessment' })).toHaveAttribute(
      'href',
      '/library/master-developer-assessment',
    );
  });

  test('empty registry: static list says so, lookup explains not found', async ({ page }) => {
    await page.goto('/certificates');
    await expect(page.getByText('No certificates have been issued yet.').first()).toBeVisible();
    await check(page, 'DD-2027-0001');
    const result = page.locator('#verify-result');
    await expect(result).toContainText('Not found.');
    await expect(result).toContainText('no certificates have been issued yet');
    await expect(result.getByRole('link', { name: 'contact us' })).toHaveAttribute('href', '/contact');
  });

  test('found path with a test fixture, by code and by name', async ({ page }) => {
    await page.goto('/certificates');
    await useRegistry(page, FIXTURE);
    await check(page, ' dd-test-0001 ');
    const result = page.locator('#verify-result');
    await expect(result).toContainText('Verified.');
    await expect(result).toContainText('Test Holder One, Developer');
    await check(page, 'zoe exam');
    await expect(result).toContainText('Zoe Example, Master Developer');
    await check(page, 'nobody here');
    await expect(result).toContainText('Not found.');
    await expect(result).toContainText('Check the spelling');
  });

  test('a malformed registry is rejected by the schema, never trusted', async ({ page }) => {
    await page.goto('/certificates');
    await useRegistry(page, [{ code: 'x', holder: '', level: 'wizard', issuedOn: 'yesterday' }]);
    await check(page, 'x');
    await expect(page.locator('#verify-result')).toContainText('not in the expected format');
  });

  test('works without JavaScript: static list is present and the form stays hidden', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    await page.goto('/certificates');
    await expect(page.getByRole('heading', { name: 'All issued certificates' })).toBeVisible();
    await expect(page.getByText('Search needs JavaScript')).toBeVisible();
    await expect(page.locator('#verify-form')).toBeHidden();
    await context.close();
  });
});

test.describe('layout', () => {
  for (const path of ['/sensei', '/certificates']) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
