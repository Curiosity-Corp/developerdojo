import { expect, test } from '@playwright/test';

// Arena evidence records (#89). The numbers are computed at build time from the published run files;
// tests/arena-records.test.ts checks the arithmetic, this spec checks what a reader sees.

test('the index keeps Dojo experiments and external results apart, with honest status labels', async ({ page }) => {
  await page.goto('/arena/evidence/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Arena evidence records');
  const dojo = page.locator('section', { has: page.getByRole('heading', { name: 'Dojo experiments' }) });
  const external = page.locator('section', { has: page.getByRole('heading', { name: 'Published external results' }) });
  await expect(dojo.locator('[data-arena-record="ARN-001"]')).toContainText('4 proposed, not run');
  await expect(external.locator('[data-arena-record="ARN-002"]')).toContainText('Historical snapshot');
  await expect(dojo.locator('[data-arena-record="ARN-002"]')).toHaveCount(0);
});

test('a Dojo experiment shows versions, separate system and domain metrics, and proposals without results', async ({ page }) => {
  await page.goto('/arena/evidence/fnd-001-pocket-garden/');
  await expect(page.locator('[data-provenance]')).toContainText('Run by Developer Dojo');
  await expect(page.locator('[data-review]')).toContainText('Last checked 20 Nov 2026');
  await expect(page.getByRole('table', { name: /Each arm's stack/ })).toContainText('claude-haiku-5-5');
  const model = page.locator('[data-comparison="model"]');
  await expect(model.locator('[data-system-metrics]')).toContainText('2 of 3 (67%; 95% interval');
  await expect(model.locator('[data-system-metrics]')).toContainText('list price, not an invoice');
  await expect(model.locator('[data-domain-metrics]').getByRole('row', { name: /pressed-state/ })).toContainText('2 of 3');
  const proposed = page.locator('[data-comparison-status="proposed"]');
  await expect(proposed).toHaveCount(4);
  for (const section of await proposed.all()) {
    await expect(section).toContainText('Proposed, not run. No results.');
    await expect(section.locator('table')).toHaveCount(0);
  }
  await expect(page.getByRole('link', { name: 'Checker results for the reference and every run' })).toHaveAttribute('href', '/examples/fnd-001/results.json');
});

test('an external result is attributed, linked to its source and shows unreported cost as not available', async ({ page }) => {
  await page.goto('/arena/evidence/swe-agent-interface-2024/');
  await expect(page.locator('[data-provenance]')).toContainText('not run by Developer Dojo');
  const domain = page.locator('[data-domain-metrics]');
  await expect(domain).toContainText('54 of 300 (18%');
  await expect(domain).toContainText('33 of 300 (11%');
  await expect(page.locator('[data-system-metrics] [data-unavailable]').first()).toContainText('Not available.');
});

test('each record has a machine-readable copy with its computed measurements', async ({ request }) => {
  const response = await request.get('/arena/evidence/fnd-001-pocket-garden.json');
  expect(response.ok()).toBe(true);
  const body = await response.json() as { format: string; record: { id: string }; measurements: Record<string, { passingAll: { count: number } }> };
  expect(body.format).toBe('developerdojo-arena-record/1');
  expect(body.record.id).toBe('ARN-001');
  expect(body.measurements['model']?.passingAll.count).toBe(3);
});

test('the Arena links to the evidence records', async ({ page }) => {
  await page.goto('/arena/');
  await page.getByRole('link', { name: 'Open the evidence records' }).click();
  await expect(page).toHaveURL(/\/arena\/evidence\/?$/);
});
