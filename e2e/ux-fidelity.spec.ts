import { writeFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';
import { expectPublished } from './published-report';
import { STATES, stateById, type Element as FlowElement, type StateId } from '../src/data/pocket-invoice';

// The UX pathway's visual-fidelity check (#91): the working Pocket Invoice page against its own high-fidelity
// design. In every state of the flow, at the width of the browser project (390 px phone screens on mobile,
// 1440 px desktop screens on desktop), each element of the flow is found twice: as its group in the generated
// high-fidelity SVG (data-element = its index in the flow) and as the element the page renders for it. The
// test compares the properties both sides define from the token file (colour, type size and weight, border,
// fill and control height), the order of the elements, and records the geometry for the report.

type Side = Record<string, string>;
interface Row { state: StateId; element: string; component: string; property: string; design: string; build: string; pass: boolean }
interface Geometry { state: StateId; element: string; component: string; design: { left: number; width: number; height: number }; build: { left: number; width: number; height: number } }
interface DesignGroup { index: number | null; component: string; props: Side; box: { left: number; width: number; height: number } }

const SCREEN_ROOT = '/examples/ux-pathway/generated/screens/';

const hex = (value: string): string => {
  const rgb = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(value.trim());
  if (!rgb) return value.trim().toLowerCase();
  if (rgb[4] !== undefined && Number(rgb[4]) === 0) return 'transparent';
  return '#' + [rgb[1], rgb[2], rgb[3]].map((part) => Number(part).toString(16).padStart(2, '0')).join('');
};
const px = (value: string | null | undefined): string => (value === null || value === undefined || value === '' ? 'none' : String(Math.round(Number.parseFloat(value))));
const describe = (element: FlowElement): string => {
  switch (element.type) {
    case 'heading': case 'text': return element.type + ' “' + (element.text.length > 40 ? element.text.slice(0, 39) + '…' : element.text) + '”';
    case 'field': return 'field “' + element.label + '”' + (element.error ? ' with error' : '');
    case 'button': return element.variant + ' button “' + element.label + '”';
    default: return element.type;
  }
};

/**
 * Reads the design side of one screen: for each data-element group (and the app bar) its component name, the
 * token-defined properties the comparison uses and its box relative to the content column.
 */
async function readDesign(page: Page, svg: string): Promise<{ groups: DesignGroup[]; columnLeft: number; columnWidth: number }> {
  return page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, 'image/svg+xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) throw new Error('the design SVG does not parse: ' + parseError.textContent);
    const num = (el: Element | null, name: string): number => Number(el?.getAttribute(name) ?? 'NaN');
    const textProps = (el: Element | null, prefix: string): Record<string, string> => (el ? {
      [prefix + 'color']: el.getAttribute('fill') ?? 'none',
      [prefix + 'font-size']: el.getAttribute('font-size') ?? 'none',
      [prefix + 'font-weight']: el.getAttribute('font-weight') ?? '400',
    } : {});
    const rectProps = (el: Element | null, prefix: string): Record<string, string> => (el ? {
      [prefix + 'background']: el.getAttribute('fill') ?? 'none',
      [prefix + 'border-color']: el.getAttribute('stroke') ?? 'none',
      [prefix + 'border-width']: el.getAttribute('stroke-width') ?? 'none',
      [prefix + 'height']: el.getAttribute('height') ?? 'none',
    } : {});
    const boxOf = (group: Element): { x0: number; x1: number; y0: number; y1: number } => {
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const rect of group.querySelectorAll('rect')) {
        x0 = Math.min(x0, num(rect, 'x')); x1 = Math.max(x1, num(rect, 'x') + num(rect, 'width'));
        y0 = Math.min(y0, num(rect, 'y')); y1 = Math.max(y1, num(rect, 'y') + num(rect, 'height'));
      }
      for (const text of group.querySelectorAll('text')) {
        const fit = (text.getAttribute('data-fit') ?? '').split(' ').map(Number);
        const size = num(text, 'font-size');
        const [left, right] = fit.length === 2 && fit.every(Number.isFinite) ? fit as [number, number] : [num(text, 'x'), num(text, 'x')];
        x0 = Math.min(x0, left); x1 = Math.max(x1, right);
        y0 = Math.min(y0, num(text, 'y') - size); y1 = Math.max(y1, num(text, 'y') + size * 0.3);
      }
      return { x0, x1, y0, y1 };
    };
    const groups = [...doc.querySelectorAll('g[data-component]')].map((group) => {
      const component = group.getAttribute('data-component') ?? '';
      const texts = [...group.querySelectorAll('text')];
      const control = group.querySelector('rect[data-control]');
      let props: Record<string, string> = {};
      if (component === 'AppBar') {
        const [bar, line] = [...group.querySelectorAll(':scope > rect')];
        props = { background: bar?.getAttribute('fill') ?? 'none', height: bar?.getAttribute('height') ?? 'none', 'border-bottom-color': line?.getAttribute('fill') ?? 'none', ...textProps(texts[1] ?? null, 'wordmark ') };
      } else if (component.startsWith('Heading/') || component === 'Text/Body' || component === 'SummaryList' || component === 'Table') {
        props = textProps(texts[0] ?? null, '');
      } else if (component === 'Button/Link') {
        props = { ...textProps(texts[0] ?? null, ''), underline: texts[0]?.getAttribute('text-decoration') === 'underline' ? 'yes' : 'no' };
      } else if (component === 'Button/Primary' || component === 'Button/Secondary') {
        props = { ...rectProps(control, ''), ...textProps(texts[0] ?? null, 'label ') };
      } else if (component === 'Field/Default' || component === 'Field/Error') {
        props = { ...textProps(texts[0] ?? null, 'label '), ...rectProps(control, 'input ') };
        if (component === 'Field/Error') {
          const bar = group.querySelector(':scope > rect:not([data-control])');
          const message = texts.find((text) => (text.textContent ?? '').startsWith('Error:')) ?? null;
          props = { ...props, 'bar color': bar?.getAttribute('fill') ?? 'none', 'bar width': bar?.getAttribute('width') ?? 'none', ...textProps(message, 'error ') };
        }
      } else if (component === 'ErrorSummary') {
        const box = group.querySelector(':scope > rect');
        props = {
          background: box?.getAttribute('fill') ?? 'none', 'border-color': box?.getAttribute('stroke') ?? 'none', 'border-width': box?.getAttribute('stroke-width') ?? 'none',
          ...textProps(texts[0] ?? null, 'title '), ...textProps(texts[1] ?? null, 'item '),
          'item underline': texts[1]?.getAttribute('text-decoration') === 'underline' ? 'yes' : 'no',
        };
      }
      const box = boxOf(group);
      const index = group.getAttribute('data-element');
      return { index: index === null ? null : Number(index), component, props, box };
    });
    const content = groups.filter((group) => group.index !== null);
    const columnLeft = Math.min(...content.map((group) => group.box.x0));
    const columnRight = Math.max(...content.map((group) => group.box.x1));
    return {
      columnLeft,
      columnWidth: columnRight - columnLeft,
      groups: groups.map((group) => ({ index: group.index, component: group.component, props: group.props, box: { left: group.box.x0 - columnLeft, width: group.box.x1 - group.box.x0, height: group.box.y1 - group.box.y0 } })),
    };
  }, svg);
}

/** Reads the same properties from the page's computed styles, for the element the page renders for one flow element. */
async function readBuild(target: Locator, component: string): Promise<Side> {
  return target.evaluate((el, name) => {
    const css = (node: Element | null): CSSStyleDeclaration | null => (node ? getComputedStyle(node) : null);
    const text = (node: Element | null, prefix: string): Record<string, string> => {
      const style = css(node);
      return style ? { [prefix + 'color']: style.color, [prefix + 'font-size']: style.fontSize, [prefix + 'font-weight']: style.fontWeight } : { [prefix + 'color']: 'missing' };
    };
    const box = (node: Element | null, prefix: string): Record<string, string> => {
      const style = css(node);
      if (!node || !style) return { [prefix + 'background']: 'missing' };
      // A border in the fill's own colour looks like no border, as the design draws it; it stays in the page so the
      // button keeps its edge in forced-colours mode.
      const drawn = Number.parseFloat(style.borderTopWidth) > 0 && style.borderTopStyle !== 'none' && style.borderTopColor !== style.backgroundColor;
      return {
        [prefix + 'background']: style.backgroundColor,
        [prefix + 'border-color']: drawn ? style.borderTopColor : 'none',
        [prefix + 'border-width']: drawn ? style.borderTopWidth : 'none',
        [prefix + 'height']: String(node.getBoundingClientRect().height),
      };
    };
    if (name === 'AppBar') {
      const style = getComputedStyle(el);
      return { background: style.backgroundColor, height: String(el.getBoundingClientRect().height), 'border-bottom-color': style.borderBottomColor, ...text(el.querySelector('[data-wordmark]'), 'wordmark ') };
    }
    if (name.startsWith('Heading/') || name === 'Text/Body') return text(el, '');
    if (name === 'SummaryList') return text(el.querySelector('dt'), '');
    if (name === 'Table') return text(el.querySelector('th'), '');
    if (name === 'Button/Link') return { ...text(el, ''), underline: getComputedStyle(el).textDecorationLine.includes('underline') ? 'yes' : 'no' };
    if (name === 'Button/Primary' || name === 'Button/Secondary') return { ...box(el, ''), ...text(el, 'label ') };
    if (name === 'Field/Default' || name === 'Field/Error') {
      const base = { ...text(el.querySelector('label'), 'label '), ...box(el.querySelector('input'), 'input ') };
      if (name === 'Field/Default') return base;
      const style = getComputedStyle(el);
      return { ...base, 'bar color': style.borderLeftColor, 'bar width': style.borderLeftWidth, ...text(el.querySelector('.pi-error:not([hidden])'), 'error ') };
    }
    if (name === 'ErrorSummary') {
      const style = getComputedStyle(el);
      const link = el.querySelector('a');
      return {
        background: style.backgroundColor, 'border-color': style.borderTopColor, 'border-width': style.borderTopWidth,
        ...text(el.querySelector('.pi-error-title'), 'title '), ...text(link, 'item '),
        'item underline': link && getComputedStyle(link).textDecorationLine.includes('underline') ? 'yes' : 'no',
      };
    }
    return {};
  }, component);
}

/** Normalises one property so the SVG attribute and the computed style compare as the same kind of value. */
function normalise(property: string, value: string): string {
  if (value === 'missing' || value === 'none') return value;
  if (property.endsWith('color') || property.endsWith('background')) return hex(value);
  if (property === 'underline' || property.endsWith(' underline')) return value;
  return px(value);
}

/** The page's element for one flow element, inside the visible screen or the open dialog. */
function buildTarget(page: Page, state: StateId, index: number): Locator {
  const app = page.locator('[data-pocket-invoice]');
  const scope = state === 'discard-dialog' ? page.locator('dialog[open]') : app.locator('[data-screen]:not([hidden])');
  const elements = stateById(state).elements;
  const element = elements[index];
  if (!element) throw new Error(state + ' has no element ' + index);
  switch (element.type) {
    case 'heading': return scope.locator('h2');
    case 'text': {
      const position = elements.slice(0, index).filter((item) => item.type === 'text').length;
      return scope.locator('p:visible:not(.pi-hint):not(.pi-error):not(:has(button))').nth(position);
    }
    case 'error-summary': return scope.locator('.pi-error-summary:visible');
    case 'field': return scope.locator('.pi-field').filter({ has: page.getByText(element.label, { exact: true }) });
    case 'summary': return scope.locator('.pi-summary');
    case 'table': return scope.locator('.pi-table');
    case 'button': return scope.getByRole('button', { name: element.label, exact: true });
  }
}

async function compareState(page: Page, state: StateId, width: 'phone' | 'desktop', rows: Row[], geometry: Geometry[]): Promise<void> {
  await expect(page.locator('[data-pocket-invoice]')).toHaveAttribute('data-current-state', state);
  // A pointer left over a button would measure its hover colours, which the design does not draw.
  await page.mouse.move(0, 0);
  const response = await page.request.get(SCREEN_ROOT + width + '/' + state + '.svg');
  expect(response.ok(), 'design screen for ' + state).toBe(true);
  const design = await readDesign(page, await response.text());
  const elements = stateById(state).elements;
  const scope = state === 'discard-dialog' ? page.locator('dialog[open]') : page.locator('[data-pocket-invoice] [data-screen]:not([hidden])');
  const scopeBox = await scope.boundingBox();
  if (!scopeBox) throw new Error(state + ': the screen is not visible');
  const padding = await scope.evaluate((el) => Number.parseFloat(getComputedStyle(el).paddingLeft) + Number.parseFloat(getComputedStyle(el).paddingRight));
  const columnLeft = scopeBox.x + padding / 2;
  const columnWidth = scopeBox.width - padding;
  const tops: number[] = [];
  const targets: { name: string; component: string; locator: Locator; designGroup: DesignGroup }[] = [];
  if (state !== 'discard-dialog') {
    const bar = design.groups.find((group) => group.component === 'AppBar');
    if (bar) targets.push({ name: 'app bar', component: 'AppBar', locator: page.locator('[data-pocket-invoice] .pi-bar'), designGroup: bar });
  }
  elements.forEach((element, index) => {
    const group = design.groups.find((candidate) => candidate.index === index);
    if (!group) throw new Error(state + ': the design has no group for element ' + index + ' (' + describe(element) + ')');
    targets.push({ name: describe(element), component: group.component, locator: buildTarget(page, state, index), designGroup: group });
  });
  for (const target of targets) {
    await expect(target.locator, state + ': ' + target.name).toBeVisible();
    const build = await readBuild(target.locator, target.component);
    for (const [property, value] of Object.entries(target.designGroup.props)) {
      const designValue = normalise(property, value);
      const buildValue = normalise(property, build[property] ?? 'missing');
      rows.push({ state, element: target.name, component: target.component, property, design: designValue, build: buildValue, pass: designValue === buildValue });
    }
    const box = await target.locator.boundingBox();
    if (!box) throw new Error(state + ': ' + target.name + ' has no box');
    if (target.component !== 'AppBar') {
      tops.push(box.y);
      geometry.push({
        state, element: target.name, component: target.component,
        design: { left: Math.round(target.designGroup.box.left), width: Math.round((target.designGroup.box.width / design.columnWidth) * 100), height: Math.round(target.designGroup.box.height) },
        build: { left: Math.round(box.x - columnLeft), width: Math.round((box.width / columnWidth) * 100), height: Math.round(box.height) },
      });
    }
  }
  // Same order as the design: the flow is drawn top to bottom, and buttons in one row share a top.
  const inOrder = tops.every((top, index) => index === 0 || top >= (tops[index - 1] ?? 0) - 1);
  rows.push({ state, element: 'all ' + elements.length + ' elements', component: 'Screen', property: 'order, top to bottom', design: 'flow order', build: inOrder ? 'flow order' : 'different: ' + tops.map(Math.round).join(', '), pass: inOrder });
}

async function writeReport(rows: Row[], geometry: Geometry[], width: 'phone' | 'desktop', testInfo: TestInfo): Promise<void> {
  const failed = rows.filter((row) => !row.pass);
  const states = new Set(rows.map((row) => row.state));
  const lines = [
    '# Pocket Invoice: visual-fidelity report, design against build',
    '',
    'Produced by the site’s browser tests (Playwright) on the ' + testInfo.project.name + ' project, against the ' + width + ' high-fidelity screens. The working page is driven into each state of the flow; each element is then read twice, from its group in the generated SVG screen and from the page’s computed styles, and every property the design defines is compared.',
    '',
    '- Compared, must match exactly: text colour, size and weight; fill, border colour and width; control height; underlines; the order of the elements.',
    '- A border drawn in its fill’s own colour counts as no border: it looks the same, and it keeps the button’s edge in forced-colours mode.',
    '- Recorded, not compared: where each element starts in its column and how much of the column it fills. The design measures text with its own estimate, the page with the browser’s font, so these differ by a few pixels.',
    '',
    'Not covered: a pixel comparison of whole screens, the fills of containers around the elements (the page puts the sent message on a green panel the design does not draw), the brand font (the test browser has no copy of Source Sans Pro), hover and focus styles, and the dark theme. A matching report says the page follows its design; it does not say the design is usable.',
    '',
    '## Result',
    '',
    'States compared: ' + states.size + ' of ' + STATES.length + '. Properties compared: ' + rows.length + '. Matching: ' + (rows.length - failed.length) + '. Different: ' + failed.length + '.',
    '',
    ...(failed.length ? ['| State | Element | Property | Design | Build |', '| --- | --- | --- | --- | --- |', ...failed.map((row) => '| ' + row.state + ' | ' + row.element + ' | ' + row.property + ' | ' + row.design + ' | ' + row.build + ' |'), ''] : []),
    '## Every comparison',
    '',
    '| State | Element | Component | Property | Design | Build | Match |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => '| ' + row.state + ' | ' + row.element + ' | ' + row.component + ' | ' + row.property + ' | ' + row.design + ' | ' + row.build + ' | ' + (row.pass ? 'yes' : '**no**') + ' |'),
    '',
    '## Geometry, recorded',
    '',
    'Left: pixels from the left of the content column. Width: per cent of the column. Height: pixels.',
    '',
    '| State | Element | Left, design | Left, build | Width, design | Width, build | Height, design | Height, build |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...geometry.map((row) => '| ' + row.state + ' | ' + row.element + ' | ' + row.design.left + ' | ' + row.build.left + ' | ' + row.design.width + ' % | ' + row.build.width + ' % | ' + row.design.height + ' | ' + row.build.height + ' |'),
    '',
  ];
  const path = testInfo.outputPath('visual-fidelity-' + width + '.md');
  await writeFile(path, lines.join('\n'));
  await testInfo.attach('visual-fidelity-' + width + '.md', { path, contentType: 'text/markdown' });
  // The site publishes the report without the geometry, which depends on the CI browser's fonts: every other line is a
  // token value read from both sides, so the published copy changes only when the design or the build does.
  const published = lines.slice(0, lines.indexOf('## Geometry, recorded')).join('\n')
    + '\n\nThe geometry (where each element starts and how much of its column it fills) is recorded in the report attached to each test run, not here: it depends on the fonts of the browser that ran the test.\n';
  await expectPublished(testInfo, 'public/examples/ux-pathway/build-fidelity-' + width + '.md', published, 'build-fidelity-' + width + '.md');
}

const button = (from: StateId, to: StateId): string => {
  const found = stateById(from).elements.find((element) => element.type === 'button' && element.to === to);
  if (!found || found.type !== 'button') throw new Error('no button from ' + from + ' to ' + to);
  return found.label;
};

test('the working page matches its high-fidelity design in every state', async ({ page }, testInfo) => {
  // Eleven states, each read twice; the walk is the same as the QA test's, without the axe scans.
  test.slow();
  const width = (page.viewportSize()?.width ?? 1440) < 768 ? 'phone' : 'desktop';
  const rows: Row[] = [];
  const geometry: Geometry[] = [];
  const app = page.locator('[data-pocket-invoice]');
  const go = async (from: StateId, to: StateId): Promise<void> => { await app.getByRole('button', { name: button(from, to), exact: true }).click(); };
  await page.goto('/examples/pocket-invoice/');
  await compareState(page, 'signup', width, rows, geometry);
  await go('signup', 'sign-in');
  await compareState(page, 'sign-in', width, rows, geometry);
  await go('sign-in', 'signup');
  await app.getByLabel('Email address').fill('not-an-email');
  await go('signup', 'invoices-empty');
  await compareState(page, 'signup-error', width, rows, geometry);
  await app.getByLabel('Email address').fill('sam@studio.example');
  await app.getByLabel('Workspace name').fill('Sam Rivera Design');
  await go('signup', 'invoices-empty');
  await compareState(page, 'invoices-empty', width, rows, geometry);
  await go('invoices-empty', 'invoice-new');
  await compareState(page, 'invoice-new', width, rows, geometry);
  await go('invoice-new', 'discard-dialog');
  await compareState(page, 'discard-dialog', width, rows, geometry);
  await page.keyboard.press('Escape');
  // The design's invoice-new-error state: the client name left empty and an amount of 0, the other two fields filled.
  await app.getByLabel('Client email').fill('accounts@harbour-bakery.example');
  await app.getByLabel('What the work was').fill('Menu redesign, two rounds of changes');
  await app.getByLabel(/Amount in US dollars/).fill('0');
  await go('invoice-new', 'invoice-review');
  await compareState(page, 'invoice-new-error', width, rows, geometry);
  await app.getByLabel('Client name').fill('Harbour Bakery');
  await app.getByLabel('Client email').fill('accounts@harbour-bakery.invalid');
  await app.getByLabel('What the work was').fill('Menu redesign, two rounds of changes');
  await app.getByLabel(/Amount in US dollars/).fill('480.00');
  await go('invoice-new', 'invoice-review');
  await compareState(page, 'invoice-review', width, rows, geometry);
  await go('invoice-review', 'invoice-sent');
  await compareState(page, 'send-error', width, rows, geometry);
  await go('send-error', 'invoice-new');
  await app.getByLabel('Client email').fill('accounts@harbour-bakery.example');
  await go('invoice-new', 'invoice-review');
  await go('invoice-review', 'invoice-sent');
  await compareState(page, 'invoice-sent', width, rows, geometry);
  await go('invoice-sent', 'invoices-list');
  await compareState(page, 'invoices-list', width, rows, geometry);

  await writeReport(rows, geometry, width, testInfo);
  expect(new Set(rows.map((row) => row.state)).size).toBe(STATES.length);
  expect(rows.filter((row) => !row.pass).map((row) => row.state + ' · ' + row.element + ' · ' + row.property + ': design ' + row.design + ', build ' + row.build)).toEqual([]);
});
