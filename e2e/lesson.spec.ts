import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';

/** Built lesson pages (any index.html under dist/library) whose HTML contains `needle`, as URL paths. */
function builtLessonsContaining(needle: string): string[] {
  const root = join('dist', 'library');
  const files = (readdirSync(root, { recursive: true, encoding: 'utf8' }) as string[]).filter((f) =>
    f.endsWith('index.html'),
  );
  return files
    .filter((f) => !/^(index\.html|resources[\\/]|tracks[\\/]index\.html|tracks[\\/][^\\/]+[\\/]index\.html)/.test(f))
    .filter((f) => readFileSync(join(root, f), 'utf8').includes(needle))
    .map((f) => `/library/${f.replace(/index\.html$/, '').split('\\').join('/')}`)
    .sort();
}

test('a program page has breadcrumbs, facts, a table of contents and previous/next', async ({ page, isMobile }) => {
  await page.goto('/library/week-1-see-the-whole-product');
  const title = (await page.locator('h1').innerText()).trim();

  const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(crumbs.getByRole('link', { name: 'Library' })).toHaveAttribute('href', '/library');
  await expect(crumbs.locator('[aria-current="page"]')).toHaveText(title);

  await expect(page.getByRole('list', { name: 'About this lesson' })).toContainText(/\d+ min read/);

  // Wide screens show the sticky side list, phones a collapsed "On this page" disclosure.
  let tocLink;
  if (isMobile) {
    const toc = page.getByRole('navigation', { name: 'On this page' });
    await toc.getByText('On this page').click();
    tocLink = toc.getByRole('link').first();
  } else {
    const toc = page.getByRole('navigation', { name: 'Table of contents' });
    await expect(toc).toBeVisible();
    tocLink = toc.getByRole('link').first();
  }
  const target = (await tocLink.getAttribute('href')) ?? '';
  expect(target).toMatch(/^#.+/);
  await tocLink.click();
  await expect(page).toHaveURL(new RegExp(`${target}$`));
  await expect(page.locator(target)).toBeVisible();

  const pager = page.getByRole('navigation', { name: /^More in / });
  await expect(pager.getByRole('link')).not.toHaveCount(0);
});

test('the table of contents can be used with the keyboard only', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard path is the desktop one');
  await page.goto('/library/week-1-see-the-whole-product');
  const first = page.getByRole('navigation', { name: 'Table of contents' }).getByRole('link').first();
  await first.focus();
  await expect(first).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#.+/);
});

test('previous and next walk through a section in order', async ({ page }) => {
  await page.goto('/library/people-write-epics');
  const next = page.getByRole('navigation', { name: /^More in / }).locator('a.next');
  const nextTitle = ((await next.innerText()).replace(/^Next\s*/i, '')).trim();
  await next.click();
  await expect(page.locator('h1')).toHaveText(nextTitle);
  await expect(page.getByRole('navigation', { name: /^More in / }).locator('a.prev')).toContainText('People write epics');
});

test('track lessons show the track in the breadcrumb, header and pager', async ({ page }) => {
  const lessons = builtLessonsContaining('Track · ');
  test.skip(lessons.length === 0, 'no track lessons are published yet');
  const path = lessons[0] ?? '';
  await page.goto(path);
  const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(crumbs.getByRole('link', { name: 'Tracks' })).toHaveAttribute('href', '/library/tracks');
  await expect(crumbs.getByRole('link').nth(2)).toHaveAttribute('href', /^\/library\/tracks\/[a-z0-9-]+$/);
  await expect(page.getByRole('navigation', { name: /lesson \d+ of \d+/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Back to the track: / })).toBeVisible();
});

test('Further learning shows a resource card with provider, chips, summary and an outside link', async ({ page }) => {
  const lessons = builtLessonsContaining('aria-label="Further learning"');
  test.skip(lessons.length === 0, 'no lesson lists resources yet');
  await page.goto(lessons[0] ?? '');
  const section = page.getByRole('region', { name: 'Further learning' });
  await expect(section).toBeVisible();
  const card = section.locator('article.resource').first();
  await expect(card.locator('.provider')).not.toBeEmpty();
  await expect(card.getByRole('list', { name: 'About this resource' })).toBeVisible();
  await expect(card.locator('.summary')).not.toBeEmpty();
  const link = card.getByRole('link').first();
  await expect(link).toHaveAttribute('href', /^https:\/\//);
  await expect(link).toHaveAttribute('rel', /noopener/);
});

test('lessons with outcomes show the outcomes box', async ({ page }) => {
  const lessons = builtLessonsContaining('After this lesson you can');
  test.skip(lessons.length === 0, 'no lesson lists outcomes yet');
  await page.goto(lessons[0] ?? '');
  await expect(page.getByRole('heading', { name: 'After this lesson you can' })).toBeVisible();
});

test('the Train page links to the tracks and resources', async ({ page }) => {
  await page.goto('/train');
  await expect(page.getByRole('link', { name: /Browse the learning tracks/ })).toHaveAttribute('href', '/library/tracks');
  await expect(page.getByRole('link', { name: /Free courses and videos/ })).toHaveAttribute('href', '/library/resources');
});
