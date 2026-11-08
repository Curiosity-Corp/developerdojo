import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('outcome shortcuts lead directly to a kata', async ({ page }) => {
  await page.goto('/');
  const shortcuts = page.getByRole('region', { name: 'Start with an outcome' });
  await expect(shortcuts.getByRole('link', { name: 'Explore a 3D scan' })).toHaveAttribute('href', '/katas/scan-a-room');
  await expect(shortcuts.getByRole('link', { name: 'Compare AI instructions' })).toHaveAttribute('href', '/katas/compare-instructions');
  await shortcuts.getByRole('link', { name: 'Explore a 3D scan' }).click();
  await expect(page).toHaveURL(/\/katas\/scan-a-room\/?$/);
});

test('menu options work with keyboard and Escape restores focus', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = page.getByRole('navigation', { name: 'Primary' });
  const trigger = nav.getByLabel('Explore Katas options');
  await trigger.focus();
  await page.keyboard.press('Enter');
  const menu = trigger.locator('..');
  await expect(menu).toHaveAttribute('open', '');
  await expect(menu.getByRole('link', { name: /Scan a room in 3D/ })).toBeVisible();
  await expect(menu.getByRole('link', { name: /Industry workshops/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(trigger).toBeFocused();
});

test('phone and desktop menus reveal paths and navigate directly', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await nav.getByLabel('Explore Train options').click();
  await expect(nav.getByRole('link', { name: /Compare instructions/ })).toBeVisible();
  await nav.getByLabel('Explore Katas options').click();
  await expect(nav.getByLabel('Explore Train options').locator('..')).not.toHaveAttribute('open', '');
  await nav.getByRole('link', { name: /Industry workshops/ }).click();
  await expect(page).toHaveURL(/\/katas\/industry-workshops\/?$/);
});

test('open menu has no serious accessibility violations', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByLabel('Explore Katas options').click();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')).toEqual([]);
});

test('the desktop header fits at its compact breakpoint', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop breakpoint');
  for (const width of [1200, 1280, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    const dimensions = await page.locator('.site-header .bar').evaluate((bar) => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      height: bar.getBoundingClientRect().height,
    }));
    expect(dimensions.overflow, `at ${width}px`).toBeLessThanOrEqual(0);
    expect(dimensions.height, `at ${width}px`).toBeLessThan(80);
  }
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('navigation and outcome menus stay usable', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'Katas', exact: true })).toBeVisible();
    await nav.getByLabel('Explore Katas options').click();
    await expect(nav.getByRole('link', { name: /Industry workshops/ })).toBeVisible();
  });
});
