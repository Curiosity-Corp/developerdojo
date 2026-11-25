import { expect, test } from '@playwright/test';

// The sector pack field template and the sector plan (#93, docs/sector-packs.md).
test('every sector pathway shows its field template and where qualified review stands', async ({ page }) => {
  for (const [route, id, term, standard] of [
    ['/katas/ux-pathway/', 'ux', 'Design token', 'WCAG'],
    ['/katas/bim-pathway/', 'bim', 'Property set', 'IFC'],
    ['/katas/agriculture-pathway/', 'agriculture', 'Crop coefficient (Kc)', 'FAO Irrigation and Drainage Paper 56'],
    ['/katas/science-pathway/', 'science', 'Type A evaluation', 'JCGM 100:2008'],
    ['/katas/finance-pathway/', 'finance', 'Amount financed', '12 CFR part 1026'],
    ['/katas/manufacturing-pathway/', 'manufacturing', 'Subgroup', 'NIST/SEMATECH e-Handbook'],
    ['/katas/media-pathway/', 'media', 'K-weighting', 'ITU-R BS.1770'],
    ['/katas/education-pathway/', 'education', 'Outcome mapping', 'WCAG 2.2'],
  ] as const) {
    await page.goto(route);
    const template = page.locator(`[data-sector-template="${id}"]`);
    await expect(template.getByRole('heading', { level: 2 })).toHaveText('What this field adds to the shared foundations');
    await expect(template.locator('[data-template="ontology"]')).toContainText(term);
    await expect(template.locator('[data-template="procedures"] li').first()).toBeVisible();
    await expect(template.locator('[data-template="standards"]')).toContainText(standard);
    await expect(template.locator('[data-template="belts"]')).toContainText('demonstrate criterion');
    const reviewers = template.locator('[data-template="review"] tbody tr');
    expect(await reviewers.count()).toBeGreaterThan(0);
    await expect(template.locator('[data-review-state]:not([data-review-state="none-available"])')).toHaveCount(0);
    await expect(reviewers.first()).toContainText('No qualified reviewer available yet');
    for (const href of await template.locator('[data-template="procedures"] a').evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''))) {
      expect(href).toMatch(/^\/katas\/[a-z0-9-]+$/);
    }
  }
});

test('the fields page keeps the sector plan apart from what is delivered', async ({ page }) => {
  await page.goto('/fields/');
  const plan = page.locator('[data-sector-plan]');
  await expect(plan.locator('tbody tr')).toHaveCount(10);
  await expect(plan.locator('[data-coverage="sector-pathway"]')).toHaveCount(8);
  await expect(plan.locator('[data-group="business-public-service"]').getByRole('link', { name: /Finance: from a loan’s terms/ })).toHaveAttribute('href', '/katas/finance-pathway');
  await expect(plan.locator('[data-group="business-public-service"]')).not.toContainText('In the plan only, no course yet');
  await expect(plan.locator('[data-group="science-engineering"]').getByRole('link', { name: /Science and research: from a published record/ })).toHaveAttribute('href', '/katas/science-pathway');
  await expect(plan.locator('[data-group="energy-agriculture"]').getByRole('link', { name: /Agriculture: from a weather record/ })).toHaveAttribute('href', '/katas/agriculture-pathway');
  await expect(plan.locator('[data-group="industrial-hardware"]').getByRole('link', { name: /Manufacturing: from a process record/ })).toHaveAttribute('href', '/katas/manufacturing-pathway');
  await expect(plan.locator('[data-group="industrial-hardware"]')).not.toContainText('In the plan only, no course yet');
  await expect(plan.locator('[data-group="spatial-media"]').getByRole('link', { name: /Media: from a recording/ })).toHaveAttribute('href', '/katas/media-pathway');
  await expect(plan.locator('[data-group="spatial-media"]')).not.toContainText('In the plan only, no course yet');
  await expect(plan.locator('[data-group="learning-communications"]').getByRole('link', { name: /Education: from a learning page/ })).toHaveAttribute('href', '/katas/education-pathway');
  await expect(plan.locator('[data-group="learning-communications"]')).not.toContainText('In the plan only, no course yet');
  await expect(plan.locator('[data-coverage="planned"]')).toHaveCount(0);
  await expect(plan.locator('[data-group="robotics"]')).toContainText('Related track only, no sector pathway yet');
});

test('the sector plan reflows at 320 px without page scroll', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 720 } });
  try {
    const page = await context.newPage();
    await page.goto('/fields/#sector-plan');
    await expect(page.locator('[data-sector-plan]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  } finally { await context.close(); }
});
