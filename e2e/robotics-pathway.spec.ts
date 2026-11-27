import { expect, test } from '@playwright/test';

// The robotics pathway hub (#93): its results come from the CI-computed files, and every file it offers is served.
test('the robotics pathway shows its reference checks, model, poses, joint solutions and Randori, and serves its files', async ({ page, request }) => {
  await page.goto('/katas/robotics-pathway/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('From an open robot model to a checked pose and joint solution');
  await expect(page.locator('[data-robotics-notice]')).toContainText('Simulation only');
  await expect(page.locator('[data-reference-total]')).toHaveText('188 of 188');
  await expect(page.locator('[data-dh-equal]')).toHaveText('6 of 6');
  await expect(page.locator('[data-dh-check="d5"]')).toHaveText('Equal');
  await expect(page.locator('[data-pose="reach"]')).toHaveText('-0.496712, -0.328511, 0.303252');
  await expect(page.locator('[data-det="wrist-straight"]')).toHaveText('0.000000');
  await expect(page.locator('[data-ik="beyond-reach-near"]')).toHaveText('No solution');
  await expect(page.locator('[data-ik="pick-near"]')).toContainText('0.399987');
  await expect(page.locator('[data-randori-card="C"]')).toContainText('189.30 mm');
  const evidence = page.locator('[data-sector-pack="robotics"]');
  await expect(evidence.locator('[data-evidence="verified"]')).toContainText('4559bd027c93…');
  await expect(evidence.locator('[data-evidence="verified"]')).not.toContainText('{');
  for (const id of ['rob-001-inspect-robot-model', 'rob-002-forward-kinematics', 'rob-003-inverse-kinematics', 'rob-r01-randori']) {
    await expect(page.locator(`a[href="/katas/${id}"]`).first()).toBeVisible();
  }
  const files = await page.locator('a[href^="/examples/robotics-pathway/"]').evaluateAll((links) => [...new Set(links.map((link) => link.getAttribute('href') ?? ''))]);
  expect(files.length).toBeGreaterThanOrEqual(12);
  for (const href of files) expect((await request.get(href)).status(), href).toBe(200);
});

test('a robotics recipe page links back to the pathway and its evidence', async ({ page }) => {
  await page.goto('/katas/rob-002-forward-kinematics/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('forward kinematics');
  await expect(page.locator('a[href="/katas/robotics-pathway"]').first()).toBeVisible();
});
