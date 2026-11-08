import { expect, test } from '@playwright/test';

test('historical comparison keeps cost definitions and the source visible', async ({ page }) => {
  await page.goto('/katas/budget-boss');
  await expect(page.getByRole('heading', { name: 'A real comparison · historical snapshot' })).toBeVisible();
  const comparison = page.getByLabel('Published SWE-bench Lite results');
  await expect(comparison).toContainText('11%');
  await expect(comparison).toContainText('$1.46');
  await expect(comparison).toContainText('18%');
  await expect(comparison).toContainText('$1.67');
  await expect(page.getByText(/excludes failed instances from that average/)).toBeVisible();
  await expect(page.getByText(/do not enter them as cost per run/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'their paper’s methods and Table 1' })).toHaveAttribute('href', 'https://arxiv.org/html/2405.15793v3#S4');
});
