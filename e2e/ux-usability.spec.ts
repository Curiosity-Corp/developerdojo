import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// UX-006 and UX-008 (#91): replay each usability task in the clickable prototype. tools/ux_usability.mjs finds the
// shortest path for each task in the flow file and writes it to generated/usability/tasks.json; here a browser clicks
// that path, link by link, in high fidelity, at the project's width (1440 px or 390 px) and again at 320 px, and
// checks that it ends on the goal screen with no sideways scroll, that every button on the way is at least 24 by 24
// CSS pixels (WCAG 2.2 target size), and that the goal screen passes axe. It shows what the design allows, not what
// people do: no participant is involved.

interface Step { n: number; from: string; to: string; control: string | null; variant: string | null }
interface Task { id: string; start: string; goal: string; steps: Step[]; stepCount: number; maxSteps: number; findings: { item: string }[]; pass: boolean }
interface Walkthrough { pass: boolean; tasks: Task[] }

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function sidewaysScroll(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

/** Clicks the task's path from its start screen and returns what broke on the way; fails on a wrong screen. */
async function replay(page: Page, task: Task, where: string): Promise<string[]> {
  const proto = page.locator('[data-prototype]');
  const problems: string[] = [];
  await page.goto('/examples/pocket-invoice-prototype/?fidelity=high#proto-' + task.start);
  await expect(proto, task.id + ' ' + where + ' start').toHaveAttribute('data-current-state', task.start);
  for (const step of task.steps) {
    const link = page.locator('[data-prototype-state="' + step.from + '"] a[data-transition="' + step.n + '"]').first();
    await expect(link, task.id + ' ' + where + ' transition ' + step.n).toBeVisible();
    if (step.control) await expect(link, task.id + ' ' + where + ' transition ' + step.n).toContainText(step.control);
    if (step.variant !== 'link') {
      const box = await link.boundingBox();
      if (!box || box.width < 24 || box.height < 24) problems.push(where + ' transition ' + step.n + ' target ' + (box ? Math.round(box.width) + 'x' + Math.round(box.height) : 'not rendered'));
    }
    await link.click();
    await expect(proto, task.id + ' ' + where + ' after ' + step.n).toHaveAttribute('data-current-state', step.to);
    const overflow = await sidewaysScroll(page);
    if (overflow > 0) problems.push(where + ' ' + step.to + ' scrolls sideways by ' + overflow + ' px');
  }
  return problems;
}

test('every usability task can be done in the clickable prototype by the path the walkthrough found', async ({ page, request }, testInfo) => {
  const walkthrough = await (await request.get('/examples/ux-pathway/generated/usability/tasks.json')).json() as Walkthrough;
  expect(walkthrough.pass).toBe(true);
  expect(walkthrough.tasks.length).toBeGreaterThan(0);
  const viewport = page.viewportSize() ?? { width: 1440, height: 900 };
  const problems: string[] = [];
  const rows: string[] = [];
  for (const task of walkthrough.tasks) {
    expect(task.steps.length, task.id).toBe(task.stepCount);
    expect(task.stepCount, task.id).toBeLessThanOrEqual(task.maxSteps);
    for (const width of [viewport.width, 320]) {
      await page.setViewportSize({ width, height: viewport.height });
      problems.push(...(await replay(page, task, width + ' px')).map((problem) => task.id + ' ' + problem));
    }
    await page.setViewportSize(viewport);
    const axe = await new AxeBuilder({ page }).include('[data-prototype]').withTags(AXE_TAGS).analyze();
    const violations = axe.violations.map((v) => v.id + ' (' + v.impact + ')');
    problems.push(...violations.map((v) => task.id + ' ' + task.goal + ' axe ' + v));
    rows.push('| ' + [task.id, task.start, task.goal, task.steps.map((s) => s.n).join(' → ') || 'none', viewport.width + ' px, 320 px', violations.join(', ') || 'none'].join(' | ') + ' |');
  }
  await testInfo.attach('usability-replay.md', {
    body: ['# Usability replay (' + testInfo.project.name + ')', '', '| Task | Start | Goal | Transitions clicked | Widths | axe on the goal |', '| --- | --- | --- | --- | --- | --- |', ...rows, '', problems.length ? 'Problems:\n' + problems.map((p) => '- ' + p).join('\n') : 'No problems.', ''].join('\n'),
    contentType: 'text/markdown',
  });
  expect(problems).toEqual([]);
});

test('the recorded usability finding still happens in the prototype: the sign-up error has no way to sign in', async ({ page, request }) => {
  // T7's accepted finding (inputs/usability-tasks.json): if the prototype gains a sign-in link on the sign-up error,
  // the walkthrough reports the finding as stale and this test fails with it, so the record cannot go out of date.
  const walkthrough = await (await request.get('/examples/ux-pathway/generated/usability/tasks.json')).json() as Walkthrough;
  const findings = walkthrough.tasks.flatMap((task) => task.findings.map((finding) => task.id + ' ' + finding.item));
  expect(findings).toEqual(['T7 signup-error (transition 2)']);
  await page.goto('/examples/pocket-invoice-prototype/#proto-signup');
  await page.locator('[data-prototype-state="signup"] a[data-transition="2"]').first().click();
  await expect(page.locator('[data-prototype]')).toHaveAttribute('data-current-state', 'signup-error');
  const targets = await page.locator('[data-prototype-state="signup-error"] a[data-transition]').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(targets.length).toBeGreaterThan(0);
  expect(targets).not.toContain('#proto-sign-in');
});

test('the UX pathway page shows each usability task and links the walkthrough and the session sheet', async ({ page, request }) => {
  const walkthrough = await (await request.get('/examples/ux-pathway/generated/usability/tasks.json')).json() as Walkthrough;
  await page.goto('/katas/ux-pathway/');
  for (const task of walkthrough.tasks) await expect(page.locator('tr[data-usability-task="' + task.id + '"]')).toContainText(task.stepCount + ' (' + task.maxSteps + ')');
  await expect(page.locator('[data-usability-findings]')).toContainText('signup-error');
  for (const href of ['/examples/ux-pathway/generated/usability/walkthrough.md', '/examples/ux-pathway/generated/usability/session-sheet.md', '/examples/ux-pathway/inputs/usability-tasks.json', '/examples/pocket-invoice-style-guide/']) {
    await expect(page.locator('a[href="' + href + '"]').first()).toBeVisible();
    expect((await request.get(href)).status(), href).toBe(200);
  }
  const walk = page.locator('[data-ux-walk] > li');
  // The walk: flow, wireframes, tokens and components, the build, QA, and the Randori (#91 added the build).
  await expect(walk).toHaveCount(6);
  await expect(walk.filter({ hasText: 'The build.' })).toHaveCount(1);
});
