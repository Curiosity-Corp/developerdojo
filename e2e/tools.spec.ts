import { expect, test, type Page } from '@playwright/test';

// The interactive learning tools: self-assessment, weekly checklists, lesson progress and the
// "saved on this device" panel. Everything is saved in the browser; nothing is sent anywhere.

const RUBRIC = '/library/rubric-track-a-self-assessment';
const CHECKLIST = '/library/weekly-checklist-track-a';

async function noHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0);
}

test.describe('self-assessment', () => {
  test('fill it in, reload, and every answer is still there', async ({ page }) => {
    await page.goto(RUBRIC);
    const tool = page.locator('#score-tool');
    await expect(tool.getByRole('heading', { name: 'Score yourself here' })).toBeVisible();
    await expect(tool).toContainText('not a grade and not a certificate');
    await expect(tool).toContainText('only in this browser');

    await tool.getByLabel('Week you are scoring').selectOption('2');
    const skillA = page.locator('[data-skill="A"]');
    await skillA.getByRole('radio', { name: /^3 Competent\./ }).check();
    await skillA.getByLabel(/Evidence for skill A/).fill('map/repository-map.md has 12 rows');
    await skillA.getByLabel(/Coach score for skill A/).selectOption('2');
    await expect(skillA).toContainText('you are 1 level higher');
    const skillC = page.locator('[data-skill="C"]');
    await skillC.getByRole('radio', { name: /^1 Beginning\./ }).check();
    await tool.getByRole('radio', { name: 'Yes' }).first().check();
    await tool.getByLabel(/If any answer is no/).fill('Practise the out-loud answer.');
    await expect(tool.locator('[data-saved]')).toHaveText('Saved on this device.');

    const sheet = tool.getByLabel('Score sheet as Markdown');
    await expect(sheet).toHaveValue(/\| A\. Whole-product view \|  \| 3 \|  \|  \| 2 \| map\/repository-map\.md has 12 rows \|/);
    await expect(sheet).toHaveValue(/\| C\. Journeys and touch points \|  \| 1 \|/);
    await expect(sheet).toHaveValue(/not a grade and not a certificate/);

    await page.reload();
    // A returning learner lands on the week they last used.
    await expect(page.getByLabel('Week you are scoring')).toHaveValue('2');
    await expect(page.locator('[data-skill="A"]').getByRole('radio', { name: /^3 Competent\./ })).toBeChecked();
    await expect(page.locator('[data-skill="A"]').getByLabel(/Evidence for skill A/)).toHaveValue('map/repository-map.md has 12 rows');
    await expect(page.locator('[data-skill="A"]').getByLabel(/Coach score for skill A/)).toHaveValue('2');
    await expect(page.locator('[data-skill="C"]').getByRole('radio', { name: /^1 Beginning\./ })).toBeChecked();
    await expect(page.getByLabel(/If any answer is no/)).toHaveValue('Practise the out-loud answer.');
    await expect(page.getByLabel('Score sheet as Markdown')).toHaveValue(/\| A\. Whole-product view \|  \| 3 \|/);

    // Week 1 is a separate column and starts empty.
    await page.getByLabel('Week you are scoring').selectOption('1');
    await expect(page.locator('[data-skill="A"]').getByRole('radio', { name: 'Not scored yet' })).toBeChecked();
    await expect(page.locator('[data-skill="A"]').getByLabel(/Evidence for skill A/)).toHaveValue('');

    const stored = await page.evaluate(() => window.localStorage.getItem('dojo:self-assessment:track-a'));
    expect(JSON.parse(stored ?? '{}')).toMatchObject({ v: 1 });
  });

  test('copy puts the Markdown on the clipboard, and the text stays visible to copy by hand', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(RUBRIC);
    await page.locator('[data-skill="B"]').getByRole('radio', { name: /^2 Developing\./ }).check();
    await page.getByRole('button', { name: 'Copy score sheet' }).click();
    await expect(page.locator('#score-tool [data-export-status]')).toContainText(/Copied|did not allow copying/);
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('# Track A score sheet');
    expect(clipboard).toContain('| B. Customers and personas |');
    await expect(page.getByLabel('Score sheet as Markdown')).toBeVisible();
  });

  test('clearing needs a second click and empties the sheet', async ({ page }) => {
    await page.goto(RUBRIC);
    await page.locator('[data-skill="D"]').getByRole('radio', { name: /^4 Strong\./ }).check();
    const clear = page.getByRole('button', { name: 'Clear my score sheet' });
    await clear.click();
    await expect(page.locator('[data-skill="D"]').getByRole('radio', { name: /^4 Strong\./ })).toBeChecked();
    await page.getByRole('button', { name: 'Click again to clear everything' }).click();
    await expect(page.locator('[data-skill="D"]').getByRole('radio', { name: 'Not scored yet' })).toBeChecked();
    expect(await page.evaluate(() => window.localStorage.getItem('dojo:self-assessment:track-a'))).toBeNull();
  });

  test('can be completed with the keyboard only', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the keyboard path is the desktop one');
    await page.goto(RUBRIC);
    const week = page.getByLabel('Week you are scoring');
    await week.focus();
    // Tab goes to the first radio group (the checked radio, "Not scored yet"); arrows move up to level 3.
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-skill="A"]').getByRole('radio', { name: 'Not scored yet' })).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    const level3 = page.locator('[data-skill="A"]').getByRole('radio', { name: /^3 Competent\./ });
    await expect(level3).toBeFocused();
    await expect(level3).toBeChecked();
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/Evidence for skill A/)).toBeFocused();
    await page.keyboard.type('keyboard evidence');
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/Coach score for skill A/)).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByLabel(/Coach score for skill A/)).toHaveValue('1');
    await expect(page.getByLabel('Score sheet as Markdown')).toHaveValue(/\| A\. Whole-product view \| 3 \|  \|  \|  \| 1 \| keyboard evidence \|/);
    // The copy button is reachable by keyboard and can be pressed with Enter.
    const copy = page.getByRole('button', { name: 'Copy score sheet' });
    await copy.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#score-tool [data-export-status]')).not.toHaveText('');
  });

  test('works when the browser blocks storage: answers stay on the page and the learner is told', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('blocked', 'SecurityError');
        },
      });
    });
    await page.goto(RUBRIC);
    await expect(page.locator('#score-tool [data-save-note]')).toContainText('blocking saving');
    await page.locator('[data-skill="E"]').getByRole('radio', { name: /^2 Developing\./ }).check();
    await expect(page.locator('#score-tool [data-saved]')).toContainText('Not saved');
    await expect(page.getByLabel('Score sheet as Markdown')).toHaveValue(/\| E\. Roadmap and priorities \| 2 \|/);
  });

  test('ignores damaged saved data', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('dojo:self-assessment:track-a', '{"v":1,"savedAt":"x","data":{"weeks":7,"coach":"no"}}'));
    await page.goto(RUBRIC);
    await expect(page.locator('[data-skill="A"]').getByRole('radio', { name: 'Not scored yet' })).toBeChecked();
  });

  test('without JavaScript the rubric and the blank score sheet read as plain text', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(RUBRIC);
    await expect(page.getByRole('heading', { name: 'The score sheet' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Skill A: Whole-product view' })).toBeVisible();
    await expect(page.locator('#score-tool')).toBeHidden();
    await expect(page.getByText('Go to the score sheet')).toBeHidden();
    await context.close();
  });

  test('fits a 320px phone with the tool open', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(RUBRIC);
    await page.locator('#score-tool').scrollIntoViewIfNeeded();
    await page.locator('[data-skill="F"]').getByRole('radio', { name: /^3 Competent\./ }).check();
    await noHorizontalScroll(page);
  });
});

test.describe('weekly checklist', () => {
  test('tick items, reload, the ticks and the counts are still there', async ({ page }) => {
    await page.goto(CHECKLIST);
    const panel = page.locator('[data-checklist-panel]');
    await expect(panel).toContainText('not a grade and not a certificate');
    await expect(panel.locator('[data-ck-summary]')).toHaveText(/^0 of \d+ items ticked\.$/);
    const first = page.locator('.prose').getByRole('checkbox').nth(0);
    const second = page.locator('.prose').getByRole('checkbox').nth(1);
    await expect(first).toBeEnabled();
    await first.check();
    await second.check();
    await expect(panel.locator('[data-ck-summary]')).toHaveText(/^2 of \d+ items ticked\.$/);
    await expect(page.locator('.tick-count').first()).toHaveText(/^2 of 10 ticked$/);

    await page.reload();
    await expect(page.locator('.prose').getByRole('checkbox').nth(0)).toBeChecked();
    await expect(page.locator('.prose').getByRole('checkbox').nth(1)).toBeChecked();
    await expect(page.locator('.prose').getByRole('checkbox').nth(2)).not.toBeChecked();
    await expect(page.locator('[data-ck-summary]')).toHaveText(/^2 of \d+ items ticked\.$/);

    // The Markdown copy shows the ticks, grouped by week.
    await page.getByText('Copy my checklist as Markdown').click();
    const text = page.getByLabel('Checklist as Markdown');
    await expect(text).toHaveValue(/## Week 1: See the whole product\n\n2 of 10 done\.\n\n- \[x\] Read the program guide/);
    await expect(text).toHaveValue(/- \[ \] /);

    await page.getByRole('button', { name: 'Clear my ticks on this page' }).click();
    await page.getByRole('button', { name: 'Click again to clear all ticks' }).click();
    await expect(page.locator('.prose').getByRole('checkbox').nth(0)).not.toBeChecked();
    await expect(page.locator('[data-ck-summary]')).toHaveText(/^0 of \d+ items ticked\.$/);
  });

  test('a box can be ticked with the keyboard', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the keyboard path is the desktop one');
    await page.goto(CHECKLIST);
    const box = page.locator('.prose').getByRole('checkbox').nth(3);
    await box.focus();
    await page.keyboard.press('Space');
    await expect(box).toBeChecked();
    await expect(page.locator('[data-ck-summary]')).toHaveText(/^1 of \d+ items ticked\.$/);
  });

  test('ordinary lessons get tickable checklists too', async ({ page }) => {
    await page.goto(RUBRIC);
    const box = page.locator('.prose').getByRole('checkbox', { name: /I copied the score sheet/ });
    await box.check();
    await page.reload();
    await expect(page.locator('.prose').getByRole('checkbox', { name: /I copied the score sheet/ })).toBeChecked();
    await expect(page.locator('.tick-count').last()).toHaveText('1 of 5 ticked');
  });

  test('without JavaScript the list stays plain: boxes shown, nothing pretends to save', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(CHECKLIST);
    await expect(page.locator('.prose input[type="checkbox"]').first()).toBeDisabled();
    await expect(page.locator('[data-checklist-panel]')).toBeHidden();
    await expect(page.getByText('Make your own copy of this checklist')).toBeVisible();
    await context.close();
  });

  test('fits a 320px phone', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(CHECKLIST);
    await page.getByText('Copy my checklist as Markdown').click();
    await noHorizontalScroll(page);
  });
});

test.describe('lesson progress', () => {
  test('mark a lesson done, the track shows n of m, and it survives a reload', async ({ page }) => {
    await page.goto('/library/tracks/product-discovery');
    const progress = page.locator('[data-track-progress]');
    await expect(progress.locator('[data-tp-text]')).toHaveText(/^0 of \d+ lessons done\.$/);
    const total = Number(/of (\d+)/.exec((await progress.locator('[data-tp-text]').textContent()) ?? '')?.[1]);
    expect(total).toBeGreaterThan(1);

    const firstLesson = page.locator('.lesson-list li a').first();
    const lessonTitle = (await firstLesson.textContent()) ?? '';
    await firstLesson.click();
    await expect(page.locator('h1')).toHaveText(lessonTitle);
    const done = page.getByRole('button', { name: 'I finished this lesson' });
    await expect(done).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('[data-done-status]')).toHaveText(new RegExp(`^0 of ${total} lessons done in `));
    await done.click();
    await expect(done).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-done-status]')).toHaveText(new RegExp(`^1 of ${total} lessons done in `));
    await expect(page.getByText('You marked this lesson done')).toBeVisible();

    await page.reload();
    await expect(page.getByRole('button', { name: 'I finished this lesson' })).toHaveAttribute('aria-pressed', 'true');

    await page.goto('/library/tracks/product-discovery');
    await expect(page.locator('[data-tp-text]')).toHaveText(`1 of ${total} lessons done.`);
    await expect(page.locator('.lesson-list .done-badge:visible')).toHaveCount(1);
    await expect(page.locator('[data-tp-bar]')).toHaveJSProperty('value', 1);
  });

  test('the lesson button works with the keyboard', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the keyboard path is the desktop one');
    await page.goto('/library/tracks/product-discovery');
    await page.locator('.lesson-list li a').first().click();
    const done = page.getByRole('button', { name: 'I finished this lesson' });
    await done.focus();
    await page.keyboard.press('Enter');
    await expect(done).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Space');
    await expect(done).toHaveAttribute('aria-pressed', 'false');
  });

  test('without JavaScript the track page and lesson read as before', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/library/tracks/product-discovery');
    await expect(page.locator('.lesson-list li').first()).toBeVisible();
    await expect(page.locator('[data-track-progress]')).toBeHidden();
    await page.locator('.lesson-list li a').first().click();
    await expect(page.getByRole('button', { name: 'I finished this lesson' })).toBeHidden();
    await context.close();
  });
});

test.describe('saved on this device', () => {
  test('lists what is saved, shows it as text, and deletes it all', async ({ page }) => {
    await page.goto(CHECKLIST);
    await page.locator('.prose').getByRole('checkbox').first().check();
    await page.goto('/train');
    const panel = page.locator('[data-device-data]');
    await expect(panel).toContainText('Checklist ticks on weekly-checklist-track-a');
    await panel.getByText('Copy everything as text (JSON)').click();
    await expect(panel.getByLabel('All saved data as JSON')).toHaveValue(/"dojo:checklist:weekly-checklist-track-a"/);
    await panel.getByRole('button', { name: 'Delete everything saved on this device' }).click();
    await panel.getByRole('button', { name: 'Click again to delete everything' }).click();
    await expect(page.locator('[data-device-data] [data-dd-list]')).toHaveText('Nothing is saved on this device right now.');
    expect(await page.evaluate(() => window.localStorage.getItem('dojo:checklist:weekly-checklist-track-a'))).toBeNull();
  });
});
