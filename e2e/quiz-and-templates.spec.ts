import { expect, test, type Page } from '@playwright/test';

// Knowledge checks at the end of three lessons, and the form version of the eight templates.
// Nothing is saved except the template draft, and that stays in this browser.

const QUIZ_PAGES = [
  '/library/tracks/product-discovery/02-talk-to-customers',
  '/library/tracks/git-and-gitlab/02-branches-and-merge-requests',
  '/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output',
];
const TALK = QUIZ_PAGES[0] ?? '';

const TEMPLATES = [
  { path: '/library/template-personas', draft: 'template-personas', title: '# Personas and Demographics' },
  { path: '/library/template-journeys', draft: 'template-journeys', title: '# Touch Points and Journey Maps' },
  { path: '/library/template-repository-map', draft: 'template-repository-map', title: '# Product Repository Map' },
  { path: '/library/template-integrations-register', draft: 'template-integrations-register', title: '# Integrations Register' },
  { path: '/library/template-epic-roadmap', draft: 'template-epic-roadmap', title: '# Epic Roadmap' },
  { path: '/library/template-decision-record', draft: 'template-decision-record', title: '# OSS Decision Record (ADR)' },
  { path: '/library/template-catalogue-entry', draft: 'template-catalogue-entry', title: '# Service Catalog Entry' },
  { path: '/library/template-change-record', draft: 'template-change-record', title: '# Change Record' },
];
const CHANGE = '/library/template-change-record';
const PERSONAS = '/library/template-personas';

async function noHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0);
}

const markdown = (page: Page) => page.getByLabel('Your filled-in template as Markdown');

/** Open a template page and wait until the form script has wired every control. */
async function openForm(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page.locator('#fill-in[data-ready="true"]')).toBeAttached();
}

test.describe('knowledge check', () => {
  test('is closed at first, opens, and checks each answer with the reason', async ({ page }) => {
    await page.goto(TALK);
    const quiz = page.locator('[data-quiz]');
    await expect(quiz.locator('summary').first()).toHaveText('Check what you learned (4 questions)');
    await expect(quiz.locator('fieldset').first()).toBeHidden();
    await quiz.locator('summary').first().click();
    await expect(quiz).toContainText('not a grade and not a certificate');
    await expect(quiz).toContainText('Nothing is saved and nothing leaves your device');

    const first = quiz.locator('fieldset').nth(0);
    await first.getByRole('radio', { name: 'Would you pay for this?' }).check();
    await expect(quiz.locator('[data-quiz-status]').nth(0)).toContainText('Not quite. The answer is: Tell me about the last time you bought coffee on your way to work.');
    await expect(quiz.locator('[data-quiz-reveal]').nth(0)).toHaveJSProperty('open', true);
    await first.getByRole('radio', { name: /^Tell me about the last time/ }).check();
    await expect(quiz.locator('[data-quiz-status]').nth(0)).toContainText('Correct. People are poor at predicting');
    await quiz.locator('fieldset').nth(1).getByRole('radio', { name: 'Five' }).check();
    await expect(quiz.locator('[data-quiz-score]')).toHaveText('2 of 2 answered correctly. 2 questions are still open.');

    await quiz.getByRole('button', { name: 'Clear my answers' }).click();
    await expect(quiz.locator('[data-quiz-score]')).toHaveText('');
    await expect(first.getByRole('radio', { name: 'Would you pay for this?' })).not.toBeChecked();
    await expect(quiz.locator('[data-quiz-reveal]').nth(0)).toHaveJSProperty('open', false);
    // Nothing about the quiz is stored.
    expect(await page.evaluate(() => Object.keys(window.localStorage).filter((key) => key.includes('quiz')))).toEqual([]);
  });

  test('can be done with the keyboard only', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the keyboard path is the desktop one');
    await page.goto(TALK);
    const summary = page.locator('[data-quiz] > summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-quiz]')).toHaveJSProperty('open', true);
    // Tab goes to the first radio group; the arrow keys move and choose.
    await page.keyboard.press('Tab');
    const group = page.locator('[data-quiz] [data-quiz-q]').nth(0);
    await expect(group.getByRole('radio').first()).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(group.getByRole('radio').nth(2)).toBeChecked();
    await expect(group.locator('[data-quiz-status]')).toContainText('Correct.');
    // The answer panel is a summary: reachable by Tab and opened with Enter or Space.
    const reveal = group.locator('[data-quiz-reveal] > summary');
    await reveal.focus();
    await page.keyboard.press('Enter');
    await expect(group.locator('[data-quiz-reveal]')).toHaveJSProperty('open', false);
    await page.keyboard.press('Space');
    await expect(group.locator('[data-quiz-reveal]')).toHaveJSProperty('open', true);
  });

  test('works without JavaScript: open it, read the answers', async ({ browser, isMobile }) => {
    test.skip(isMobile, 'same on every screen size, so it runs once');
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(TALK);
    const quiz = page.locator('[data-quiz]');
    await quiz.locator('summary').first().click();
    await expect(quiz.locator('fieldset')).toHaveCount(4);
    await expect(quiz.getByRole('radio')).toHaveCount(16);
    const answer = quiz.locator('[data-quiz-reveal]').nth(1);
    await answer.locator('summary').click();
    await expect(answer).toContainText('Answer: Five');
    await expect(answer).toContainText('Why: Fewer than five gives you stories');
    // The checking script is not running, so its status line and buttons stay hidden.
    await expect(quiz.getByRole('button', { name: 'Clear my answers' })).toBeHidden();
    await context.close();
  });

  test('fits a 320px phone with a question answered', async ({ page, isMobile }) => {
    test.skip(isMobile, 'same on every screen size, so it runs once');
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(TALK);
    await page.locator('[data-quiz] > summary').click();
    await page.locator('[data-quiz-q]').nth(3).getByRole('radio').first().check();
    await expect(page.locator('[data-quiz-status]').nth(3)).not.toHaveText('');
    await noHorizontalScroll(page);
  });

  test('three lessons have the check after the lesson text, and other lessons have none', async ({ page, isMobile }) => {
    test.skip(isMobile, 'same on every screen size, so it runs once');
    for (const path of QUIZ_PAGES) {
      await page.goto(path);
      await expect(page.locator('[data-quiz]')).toHaveCount(1);
      const afterProse = await page.evaluate(() => {
        const prose = document.querySelector('.prose');
        const quiz = document.querySelector('[data-quiz]');
        return Boolean(prose && quiz && prose.compareDocumentPosition(quiz) & Node.DOCUMENT_POSITION_FOLLOWING);
      });
      expect(afterProse, path).toBe(true);
    }
    await page.goto('/library/tracks/product-discovery/01-frame-the-problem-and-the-idea');
    await expect(page.locator('[data-quiz]')).toHaveCount(0);
  });
});

test.describe('fillable templates', () => {
  for (const template of TEMPLATES) {
    test(`${template.path} has a form that writes Markdown`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'same on every screen size, so it runs once');
      await page.goto(template.path);
      const form = page.locator('#fill-in');
      await expect(form.getByRole('heading', { name: 'Fill it in here', level: 2 })).toBeVisible();
      await expect(form).toContainText('not a grade and not a certificate');
      await expect(form).toContainText('only in this browser');
      await expect(markdown(page)).toBeVisible();
      await expect(markdown(page)).toHaveValue(new RegExp(`^${template.title.replace(/[()]/g, '\\$&')}\\n`));
      // At least one real field, and the plain download links are still on the page.
      expect(await form.locator('textarea[data-field], input[data-tick]').count()).toBeGreaterThan(3);
      await expect(page.locator('.prose').getByRole('link', { name: /\.md$/ })).toBeVisible();
    });
  }

  test('fill the change record, reload, and the draft and the Markdown are still there', async ({ page }) => {
    await openForm(page, CHANGE);
    await page.getByLabel('Change owner (human)', { exact: true }).fill('The operations lead');
    await page.getByLabel(/^Risk decision made by/).fill('The product owner | not an agent');
    await page.getByRole('group', { name: 'Summary: row 1' }).getByLabel('Summary').fill('Add a refund status.\nShow it in the app.');
    await page.getByLabel('Tracker issue closed').check();
    await expect(page.locator('#fill-in [data-tf-status]')).toContainText('Draft saved on this device');

    await expect(markdown(page)).toHaveValue(/\| Change owner \(human\) \| The operations lead \|/);
    await expect(markdown(page)).toHaveValue(/\| The product owner \\\| not an agent \|/);
    await expect(markdown(page)).toHaveValue(/\| Add a refund status\.<br>Show it in the app\. \|/);
    await expect(markdown(page)).toHaveValue(/- \[x\] Tracker issue closed/);
    await expect(markdown(page)).toHaveValue(/- \[ \] Monitoring and logs looked at for 15 minutes/);

    await page.reload();
    await expect(page.getByLabel('Change owner (human)', { exact: true })).toHaveValue('The operations lead');
    await expect(page.getByLabel('Tracker issue closed')).toBeChecked();
    await expect(page.locator('#fill-in [data-tf-status]')).toContainText('saved draft was put back');
    await expect(markdown(page)).toHaveValue(/\| Change owner \(human\) \| The operations lead \|/);

    const stored = await page.evaluate(() => window.localStorage.getItem('dojo:draft:template-change-record'));
    expect(JSON.parse(stored ?? '{}')).toMatchObject({ v: 1 });
  });

  test('the Markdown copy reaches the clipboard', async ({ page, context, isMobile }) => {
    test.skip(isMobile, 'same on every screen size, so it runs once');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openForm(page, CHANGE);
    await page.getByLabel('Change owner (human)', { exact: true }).fill('Leo');
    await page.getByRole('button', { name: 'Copy Markdown' }).click();
    await expect(page.locator('#fill-in [data-export-status]')).toContainText(/Copied|did not allow copying/);
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain('# Change Record');
    expect(clipboard).toContain('| Change owner (human) | Leo |');
  });

  test('clearing needs a second click and deletes the draft', async ({ page }) => {
    await openForm(page, CHANGE);
    await page.getByLabel('Change owner (human)', { exact: true }).fill('Leo');
    await page.getByLabel('Tracker issue closed').check();
    await page.getByRole('button', { name: 'Clear this form' }).click();
    await expect(page.getByLabel('Change owner (human)', { exact: true })).toHaveValue('Leo');
    await page.getByRole('button', { name: 'Click again to clear everything' }).click();
    await expect(page.getByLabel('Change owner (human)', { exact: true })).toHaveValue('');
    await expect(page.getByLabel('Tracker issue closed')).not.toBeChecked();
    await expect(markdown(page)).not.toHaveValue(/Leo/);
    expect(await page.evaluate(() => window.localStorage.getItem('dojo:draft:template-change-record'))).toBeNull();
  });

  test('free rows: add a row, fill it, reload, and only the rows with text are written', async ({ page }) => {
    await openForm(page, PERSONAS);
    const log = (n: number) => page.getByRole('group', { name: `Evidence log: row ${n}` });
    await expect(log(3)).toBeVisible();
    await expect(log(4)).toHaveCount(0);
    await page.getByRole('button', { name: 'Add a row' }).click();
    await expect(log(4)).toBeVisible();
    // The new row takes focus, and the id numbers are unique.
    await expect(log(4).getByLabel('Date')).toBeFocused();
    await page.keyboard.type('2026-03-02');
    await log(4).getByLabel('What I learned').fill('The café map is slow');
    await log(1).getByLabel('Source (person or system)').fill('Interview C1');

    await expect(markdown(page)).toHaveValue(/\|  \| Interview C1 \|  \|  \|/);
    await expect(markdown(page)).toHaveValue(/\| 2026-03-02 \|  \| The café map is slow \|  \|/);

    // A row that has text cannot be removed; an empty one can.
    const remove = page.getByRole('button', { name: 'Remove the last row' });
    await expect(remove).toBeDisabled();

    await page.reload();
    await expect(log(4)).toBeVisible();
    await expect(log(4).getByLabel('What I learned')).toHaveValue('The café map is slow');
    await expect(log(1).getByLabel('Source (person or system)')).toHaveValue('Interview C1');

    await log(4).getByLabel('Date').fill('');
    await log(4).getByLabel('What I learned').fill('');
    await expect(remove).toBeEnabled();
    await remove.click();
    await expect(log(4)).toHaveCount(0);
    await page.reload();
    await expect(log(4)).toHaveCount(0);
  });

  test('the epic quality check is a set of tick boxes', async ({ page, isMobile }) => {
    test.skip(isMobile, 'same on every screen size, so it runs once');
    await page.goto('/library/template-epic-roadmap');
    await page.getByLabel(/^Does it touch more than one part of the product/).check();
    await expect(markdown(page)).toHaveValue(/- \[x\] Does it touch more than one part of the product/);
    await expect(markdown(page)).toHaveValue(/- \[ \] Does it name the person it helps/);
  });

  test('the catalogue search answers are written as numbered questions', async ({ page, isMobile }) => {
    test.skip(isMobile, 'same on every screen size, so it runs once');
    await page.goto('/library/template-catalogue-entry');
    await page.getByLabel(/^2\. Catalogue entity lookup/).fill('Slug, owner, status and edges.');
    await expect(markdown(page)).toHaveValue(/\*\*2\. Catalogue entity lookup[^\n]*\*\*\n\nSlug, owner, status and edges\./);
    await expect(markdown(page)).toHaveValue(/\(no answer yet\)/);
  });

  test('can be filled with the keyboard only', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the keyboard path is the desktop one');
    await openForm(page, CHANGE);
    const owner = page.getByLabel('Change owner (human)', { exact: true });
    await owner.focus();
    await page.keyboard.type('Leo');
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/^Risk decision made by/)).toBeFocused();
    await page.keyboard.type('Maya');
    const tick = page.getByLabel('GitOps controller synced and healthy');
    await tick.focus();
    await page.keyboard.press('Space');
    await expect(tick).toBeChecked();
    await expect(markdown(page)).toHaveValue(/\| Change owner \(human\) \| Leo \|/);
    await expect(markdown(page)).toHaveValue(/- \[x\] GitOps controller synced and healthy/);
    const copy = page.getByRole('button', { name: 'Copy Markdown' });
    await copy.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#fill-in [data-export-status]')).not.toHaveText('');
  });

  test('works when the browser blocks storage: the form still writes Markdown and says it is not saved', async ({ page, isMobile }) => {
    test.skip(isMobile, 'same on every screen size, so it runs once');
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('blocked', 'SecurityError');
        },
      });
    });
    await openForm(page, CHANGE);
    await expect(page.locator('#fill-in [data-save-note]')).toContainText('blocks saving');
    await page.getByLabel('Change owner (human)', { exact: true }).fill('Leo');
    await expect(page.locator('#fill-in [data-tf-status]')).toContainText('Not saved');
    await expect(markdown(page)).toHaveValue(/\| Change owner \(human\) \| Leo \|/);
  });

  test('ignores a damaged draft', async ({ page, isMobile }) => {
    test.skip(isMobile, 'same on every screen size, so it runs once');
    await page.addInitScript(() =>
      window.localStorage.setItem('dojo:draft:template-change-record', '{"v":1,"savedAt":"x","data":{"values":{"t1-0-0-1":42,"nope":"x"},"rows":"many","ticks":7}}'),
    );
    await openForm(page, CHANGE);
    await expect(page.getByLabel('Change owner (human)', { exact: true })).toHaveValue('');
    await expect(markdown(page)).toHaveValue(/^# Change Record/);
  });

  test('the Train page lists a saved draft and can delete it', async ({ page, isMobile }) => {
    test.skip(isMobile, 'same on every screen size, so it runs once');
    await openForm(page, CHANGE);
    await page.getByLabel('Change owner (human)', { exact: true }).fill('Leo');
    await page.goto('/train');
    const panel = page.locator('[data-device-data]');
    await expect(panel).toContainText('Template draft: template-change-record');
    await panel.getByRole('button', { name: 'Delete everything saved on this device' }).click();
    await panel.getByRole('button', { name: 'Click again to delete everything' }).click();
    expect(await page.evaluate(() => window.localStorage.getItem('dojo:draft:template-change-record'))).toBeNull();
  });

  test('without JavaScript the page reads as before: the blank downloads, no form', async ({ browser, isMobile }) => {
    test.skip(isMobile, 'same on every screen size, so it runs once');
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(CHANGE);
    await expect(page.getByRole('heading', { name: 'Download the blank template' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'template-8-change-record.md' })).toBeVisible();
    await expect(page.locator('#fill-in')).toBeHidden();
    await expect(page.getByText('Go to the form')).toBeHidden();
    await context.close();
  });

  // The long change record and the widest table (the epic roadmap, 19 columns).
  for (const path of [CHANGE, '/library/template-epic-roadmap']) {
    test(`${path} fits a 320px phone`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'the width is set by the test, so it runs once');
      await page.setViewportSize({ width: 320, height: 700 });
      await page.goto(path);
      const form = page.locator('#fill-in');
      await form.scrollIntoViewIfNeeded();
      await form.locator('textarea[data-field]').first().fill('A long answer with a-very-long-unbroken-word-' + 'x'.repeat(80));
      await noHorizontalScroll(page);
    });
  }
});
