import { expect, test } from '@playwright/test';

const noOverflow = async (page: import('@playwright/test').Page): Promise<void> => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
};

test.describe('challenges', () => {
  test('lists the two open briefs in the Open tab and switches tabs', async ({ page }) => {
    await page.goto('/challenges');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Challenges/);
    await expect(page.getByText('The new kind of hackathon.')).toBeVisible();
    const openPanel = page.getByRole('tabpanel', { name: /Open/ });
    await expect(openPanel.getByRole('link', { name: /Build a Real MVP/ })).toBeVisible();
    await expect(openPanel.getByRole('link', { name: /AI Agent Workflow Challenge/ })).toBeVisible();

    await page.getByRole('tab', { name: /Upcoming/ }).click();
    await expect(page.getByRole('tabpanel', { name: /Upcoming/ })).toBeVisible();
    await expect(page.getByText('No upcoming briefs are announced yet.')).toBeVisible();
    await expect(openPanel).toBeHidden();

    await page.getByRole('tab', { name: /Past/ }).click();
    await expect(page.getByText('No challenges have closed yet.')).toBeVisible();
    await noOverflow(page);
  });

  for (const [slug, title] of [
    ['build-a-real-mvp', 'Build a Real MVP'],
    ['ai-agent-workflow-challenge', 'AI Agent Workflow Challenge'],
  ] as const) {
    test(`detail page ${slug} has the full brief`, async ({ page }) => {
      const response = await page.goto(`/challenges/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toContainText(title);
      for (const heading of ['What you are asked to do', 'Is this challenge for you?', 'Your deliverables', 'The rules of this sprint', 'Judged on the Product Package', 'Six steps. No form on this site.']) {
        await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      }
      await expect(page.locator('main').getByRole('link', { name: 'Product Package rubric' }).first()).toHaveAttribute('href', '/library/product-package-rubric');
      await expect(page.getByText('People write the epics and the roadmap')).toBeVisible();
      await expect(page.getByText('Disclose all AI use')).toBeVisible();
      await expect(page.locator('pre.file')).toContainText('# Submission:');
      await expect(page.locator('main form')).toHaveCount(0);
      await noOverflow(page);
    });
  }

  test('the library pages linked from a brief exist', async ({ page, request }) => {
    await page.goto('/challenges/build-a-real-mvp');
    const hrefs = await page
      .locator('main a[href^="/library/"]')
      .evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute('href') ?? ''))]);
    expect(hrefs.length).toBeGreaterThan(3);
    for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
  });
});

test.describe('events', () => {
  test('empty data shows a strong empty state with how to hear about it', async ({ page }) => {
    await page.goto('/events');
    await expect(page.getByRole('heading', { name: 'Schedule announced soon' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Three ways to know first' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ask to be told' }).first()).toHaveAttribute('href', '/contact');
    // The four session types are always explained.
    for (const type of ['Live Build', 'Demo Day', 'Workshop', 'Office Hours']) {
      await expect(page.getByRole('heading', { name: type })).toBeVisible();
    }
    // No invented events and no calendar toggle while there is nothing scheduled.
    await expect(page.getByRole('button', { name: 'Calendar' })).toHaveCount(0);
    await noOverflow(page);
  });

  test('every Details link on the events page opens a real detail page (none while the list is empty)', async ({ page, request }) => {
    await page.goto('/events');
    const hrefs = await page
      .locator('main a[href^="/events/"]:not([href$=".ics"])')
      .evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute('href') ?? ''))]);
    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
      expect(await response.text(), href).toContain('How to join');
    }
    // With no events there are no detail pages in the sitemap either.
    const sitemap = await (await request.get('/sitemap-0.xml')).text();
    const detailPages = [...sitemap.matchAll(/<loc>[^<]*\/events\/[^<]+<\/loc>/g)].length;
    expect(detailPages).toBe(hrefs.length);
  });
});

test.describe('membership', () => {
  test('is free, explains the four steps and links the code of conduct', async ({ page }) => {
    await page.goto('/membership');
    await expect(page.locator('h1')).toContainText('Membership is free');
    await expect(page.getByRole('heading', { name: 'What members get' }).or(page.getByText('What members get'))).toBeVisible();
    const steps = page.locator('#how-to-join ol > li');
    await expect(steps).toHaveCount(4);
    await expect(steps.nth(0)).toContainText('GitLab.com or GitHub');
    await expect(steps.nth(1)).toContainText('learner templates');
    await expect(steps.nth(2)).toContainText('first issue');
    await expect(steps.nth(3)).toContainText('community');
    await expect(page.getByText('opening soon').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Read the code of conduct' })).toHaveAttribute('href', '/code-of-conduct');
    await expect(page.locator('main form')).toHaveCount(0);
    await expect(page.locator('main input')).toHaveCount(0);
    await noOverflow(page);
  });

  test('FAQ answers open and close', async ({ page }) => {
    await page.goto('/membership');
    const first = page.locator('details').first();
    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open', '');
    await expect(first).toContainText('no fee');
  });
});

test.describe('footer pages', () => {
  test('about states the nonprofit status honestly', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toContainText('About CRC');
    await expect(page.getByText('education nonprofit').first()).toBeVisible();
    await expect(page.getByText('That application is pending.')).toBeVisible();
    await expect(page.locator('main')).not.toContainText('foundation stub');
    await noOverflow(page);
  });

  test('sponsors names Reveltek and has a become-a-sponsor section', async ({ page }) => {
    await page.goto('/sponsors#become-a-sponsor');
    await expect(page.getByRole('heading', { name: 'Reveltek sponsors Developer Dojo' })).toBeVisible();
    await expect(page.locator('#become-a-sponsor')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Help free training reach more people' })).toBeVisible();
    await expect(page.locator('main')).not.toContainText('foundation stub');
    await noOverflow(page);
  });

  test('contact shows only the details CRC already publishes', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText('200 Henrietta St')).toBeVisible();
    await expect(page.getByText('+1 929-229-2917')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open the CRC contact form' })).toHaveAttribute(
      'href',
      'https://curiositycorp.org/get-involved/contact.html',
    );
    await expect(page.getByText('Contact coming soon.')).toBeVisible();
    await expect(page.locator('main form')).toHaveCount(0);
    await noOverflow(page);
  });

  test('code of conduct has the sections and the attribution', async ({ page }) => {
    await page.goto('/code-of-conduct');
    for (const heading of ['Our pledge', 'Our standards', 'Scope', 'Reporting a problem', 'Enforcement guidelines', 'Attribution']) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
    await expect(page.getByRole('link', { name: /Contributor Covenant, version 2\.1/ })).toHaveAttribute(
      'href',
      'https://www.contributor-covenant.org/version/2/1/code_of_conduct/',
    );
    await noOverflow(page);
  });
});

test('no stub text is left on any of these pages', async ({ page }) => {
  for (const path of ['/challenges', '/events', '/membership', '/about', '/sponsors', '/contact', '/code-of-conduct']) {
    await page.goto(path);
    await expect(page.locator('main'), path).not.toContainText('foundation stub');
    await expect(page.locator('main'), path).not.toContainText('will describe');
  }
});
