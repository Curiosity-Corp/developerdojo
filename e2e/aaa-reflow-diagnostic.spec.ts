import { expect, test } from '@playwright/test';

test('training page reflows at 195 pixels', async ({ page, isMobile }) => {
  test.skip(isMobile, 'viewport is set explicitly');
  await page.setViewportSize({ width: 195, height: 800 });
  await page.goto('/train');
  const result = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const overflow = document.documentElement.scrollWidth - width;
    const elements = [...document.querySelectorAll('body *')].map((el) => ({
      tag: el.tagName, cls: el.getAttribute('class'),
      right: Math.round(el.getBoundingClientRect().right),
      text: (el.textContent ?? '').trim().slice(0, 70),
    })).filter((el) => el.right > width).slice(0, 15);
    return { overflow, elements };
  });
  if (result.overflow > 0) console.log('REFLOW_DIAGNOSTIC', JSON.stringify(result));
  expect(result.overflow).toBeLessThanOrEqual(0);
});
