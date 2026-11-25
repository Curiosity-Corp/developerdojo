import { expect, test } from '@playwright/test';

// The media pathway hub (#93): its numbers come from the CI-computed files, and every file it offers is served.
test('the media pathway shows its reference checks, loudness, normalisation and Randori, and serves its files', async ({ page, request }) => {
  await page.goto('/katas/media-pathway/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From a recording to a measured, normalised programme loudness');
  await expect(page.locator('[data-reference-check]')).toHaveCount(59);
  await expect(page.locator('[data-reference-check="case1-I"]')).toHaveText('Pass');
  await expect(page.locator('[data-reference-check="case19-TP"]')).toHaveText('Pass');
  await expect(page.locator('[data-channels-identical]')).toHaveText('identical');
  await expect(page.locator('[data-loudness="integrated"]')).toHaveText('-27.92 LUFS');
  await expect(page.locator('[data-loudness="true-peak"]')).toHaveText('-10.98 dBTP');
  await expect(page.locator('[data-gain]')).toHaveText('+4.92 dB');
  await expect(page.locator('[data-randori-card="C"]')).toHaveText('-3.01 LU');
  const evidence = page.locator('[data-sector-pack="media"]');
  await expect(evidence.locator('[data-evidence="verified"]')).toContainText('18b1c6c1dae3…');
  await expect(evidence.locator('[data-evidence="verified"]')).not.toContainText('{');
  for (const id of ['med-001-inspect-recording', 'med-002-measure-loudness', 'med-003-normalise-loudness', 'med-r01-randori']) {
    await expect(page.locator(`a[href="/katas/${id}"]`).first()).toBeVisible();
  }
  const files = await page.locator('a[href^="/examples/media-pathway/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href') ?? ''))]);
  expect(files.length).toBeGreaterThanOrEqual(10);
  for (const href of files) expect((await request.get(href)).status(), href).toBe(200);
});

test('a media recipe page links back to the pathway and its evidence', async ({ page }) => {
  await page.goto('/katas/med-002-measure-loudness/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('loudness');
  await expect(page.locator('a[href="/katas/media-pathway"]').first()).toBeVisible();
});
