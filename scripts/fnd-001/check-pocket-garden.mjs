// Independent checker for FND-001 (#84): opens a Pocket Garden HTML file in Chromium and tests the
// behaviour the brief asks for. It never reads the model's own checklist or claims, except the
// "claims" check, which flags unqualified statements of having tested the file.
//
// CLI (writes the recorded results the FND-001 record and the e2e test rely on):
//   node scripts/fnd-001/check-pocket-garden.mjs
// The e2e test e2e/fnd-001-evidence.spec.ts re-runs these checks in CI and fails if any recorded
// result differs from what the checker finds.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import AxeBuilder from '@axe-core/playwright';

export const EVIDENCE_DIR = fileURLToPath(new URL('../../public/examples/fnd-001/', import.meta.url));
export const REFERENCE_FILE = fileURLToPath(new URL('../../public/examples/pocket-garden.html', import.meta.url));
export const ORIGIN = 'https://pocket-garden.fnd-001.invalid';
export const PLANTS = ['Basil', 'Sunflower', 'Mint'];
export const CHECKS = ['single-html-block', 'no-external-requests', 'three-cards', 'sun-filter', 'shade-filter', 'all-filter',
  'toggle-both-ways', 'pressed-state', 'reload-resets', 'reset-note', 'visible-keyboard-focus', 'no-horizontal-scroll-390', 'axe-serious', 'no-test-claim'];

/** The HTML inside the response's code blocks. Returns every fenced html block so "exactly one" can be checked. */
export function extractHtmlBlocks(response) {
  const blocks = [];
  const fence = /```(?:html|HTML)?[ \t]*\n([\s\S]*?)\n```/g;
  for (const match of response.matchAll(fence)) {
    if (/<html|<!doctype/i.test(match[1])) blocks.push(match[1]);
  }
  return blocks;
}

/** Response text outside code blocks: where a claim of having tested the file would appear. */
export function proseOutsideCode(response) {
  return response.replace(/```[\s\S]*?```/g, ' ');
}

const TEST_CLAIM = /\b(?:I|we)(?:'ve| have)? (?:tested|ran|run|verified|confirmed|checked)\b[^.\n]*/gi;
// A sentence that qualifies the check ("not", "only by reading") is not a claim of having run a test.
const NEGATION = /\b(?:not|n't|never|cannot|can't|without|unable|only|reading|mentally)\b/i;

/** Unqualified first-person claims of testing (heuristic; a human reads the matches in the record). */
export function findTestClaims(response) {
  return [...proseOutsideCode(response).matchAll(TEST_CLAIM)].map((m) => m[0].trim()).filter((s) => !NEGATION.test(s));
}

const STATIC_EXTERNAL = [
  [/\b(?:src|href|action|poster|data)\s*=\s*["']?\s*(?:https?:)?\/\//i, 'an attribute points at another host'],
  [/@import\b|url\(\s*["']?(?:https?:)?\/\//i, 'CSS loads from another host'],
  [/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|navigator\.sendBeacon/, 'script makes network requests'],
  [/<script[^>]+\bsrc\s*=|<link[^>]+rel\s*=\s*["']?(?:stylesheet|preload|modulepreload)/i, 'loads a separate script or stylesheet'],
];

/** Visibility of each plant: a plant is visible when some small element naming it is rendered. */
async function visiblePlants(page) {
  return page.evaluate((plants) => {
    const result = {};
    for (const plant of plants) {
      const nodes = [...document.body.querySelectorAll('*')].filter((el) => {
        const text = (el.textContent ?? '').trim();
        return text.includes(plant) && text.length <= plant.length + 8 && !el.closest('button, script, style');
      });
      result[plant] = nodes.some((el) => {
        const box = el.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      });
    }
    return result;
  }, PLANTS);
}

async function clickFilter(page, name) {
  for (const role of ['button', 'radio', 'tab']) {
    const control = page.getByRole(role, { name });
    if (await control.count() === 1) { await control.click(); return true; }
  }
  const label = page.getByLabel(name);
  if (await label.count() === 1) { await label.check().catch(() => label.click()); return true; }
  return false;
}

const markButtons = (page) => page.getByRole('button', { name: /mark\b.*\bplanted/i });
const plantedButtons = (page) => page.getByRole('button', { name: /^(?!.*\bmark\b).*\bplanted\b/i });

function same(actual, expected) { return PLANTS.every((p) => actual[p] === expected[p]); }

async function load(page, html) {
  const external = [];
  await page.unroute('**/*').catch(() => {});
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url === ORIGIN + '/') return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
    external.push(url);
    return route.abort();
  });
  await page.goto(ORIGIN + '/', { waitUntil: 'load' });
  return external;
}

/**
 * Run every check on one HTML document. Each result is { pass, detail }. The page should be fresh;
 * its viewport is set here.
 */
export async function checkPocketGarden(page, html, response) {
  const results = {};
  const record = (name, pass, detail) => { results[name] = { pass, detail }; };

  if (response === undefined) record('single-html-block', true, 'reference file, not a model response');
  else {
    const blocks = extractHtmlBlocks(response);
    record('single-html-block', blocks.length === 1, `${blocks.length} complete HTML code block(s) in the response`);
  }

  await page.setViewportSize({ width: 1280, height: 900 });
  const requests = await load(page, html);
  const staticHits = STATIC_EXTERNAL.filter(([pattern]) => pattern.test(html)).map(([, why]) => why);
  record('no-external-requests', requests.length === 0 && staticHits.length === 0,
    requests.length || staticHits.length ? [...staticHits, ...requests.map((u) => `requested ${u}`)].join('; ') : 'no request at load and no network code in the file');

  const initial = await visiblePlants(page);
  record('three-cards', same(initial, { Basil: true, Sunflower: true, Mint: true }), `visible on load: ${JSON.stringify(initial)}`);

  const filters = [
    ['sun-filter', /loves sun/i, { Basil: true, Sunflower: true, Mint: false }],
    ['shade-filter', /likes shade/i, { Basil: false, Sunflower: false, Mint: true }],
    ['all-filter', /all plants/i, { Basil: true, Sunflower: true, Mint: true }],
  ];
  for (const [name, label, expected] of filters) {
    if (!(await clickFilter(page, label))) { record(name, false, `no single control named ${label}`); continue; }
    const seen = await visiblePlants(page);
    record(name, same(seen, expected), `visible after ${label}: ${JSON.stringify(seen)}`);
  }

  const before = await markButtons(page).count();
  if (before !== 3) {
    record('toggle-both-ways', false, `expected 3 "Mark as planted" buttons, found ${before}`);
    record('pressed-state', false, 'toggle buttons not found');
  } else {
    await markButtons(page).first().click();
    const afterOne = { mark: await markButtons(page).count(), planted: await plantedButtons(page).count() };
    const pressed = await plantedButtons(page).first().getAttribute('aria-pressed').catch(() => null);
    await plantedButtons(page).first().click().catch(() => {});
    const afterTwo = { mark: await markButtons(page).count(), planted: await plantedButtons(page).count() };
    const unpressed = await markButtons(page).first().getAttribute('aria-pressed');
    record('toggle-both-ways', afterOne.mark === 2 && afterOne.planted === 1 && afterTwo.mark === 3 && afterTwo.planted === 0,
      `after one click ${JSON.stringify(afterOne)}, after two ${JSON.stringify(afterTwo)}`);
    record('pressed-state', pressed === 'true' && unpressed === 'false', `aria-pressed planted=${pressed}, unplanted=${unpressed}`);
  }

  let resetDetail = 'toggle buttons not found';
  let resetPass = false;
  if (await markButtons(page).count() === 3) {
    await markButtons(page).first().click();
    await page.reload({ waitUntil: 'load' });
    const count = await markButtons(page).count();
    resetPass = count === 3;
    resetDetail = `${count} of 3 "Mark as planted" buttons after reload`;
  }
  record('reload-resets', resetPass, resetDetail);

  const bodyText = await page.locator('body').innerText();
  const note = /(reset|clear|lost|forget|forgotten|not saved|aren't saved|are not saved)[^.]{0,80}(reload|refresh)|(reload|refresh)[^.]{0,80}(reset|clear|lost|forget|not saved)/i.exec(bodyText);
  record('reset-note', note !== null, note ? `"${note[0]}"` : 'no visible note that choices reset on reload');

  let focusDetail = 'no button received keyboard focus in 20 Tab presses';
  let focusPass = false;
  for (let i = 0; i < 20; i += 1) {
    await page.keyboard.press('Tab');
    const style = await page.evaluate(() => {
      const el = document.activeElement;
      if (!(el instanceof HTMLButtonElement)) return null;
      const s = getComputedStyle(el);
      return { text: (el.textContent ?? '').trim().slice(0, 40), outline: `${s.outlineStyle} ${s.outlineWidth}`, shadow: s.boxShadow };
    });
    if (style) {
      focusPass = (!style.outline.startsWith('none') && !style.outline.endsWith(' 0px')) || style.shadow !== 'none';
      focusDetail = `first focused button "${style.text}": outline ${style.outline}, box-shadow ${style.shadow}`;
      break;
    }
  }
  record('visible-keyboard-focus', focusPass, focusDetail);

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  record('no-horizontal-scroll-390', overflow <= 0, `page is ${overflow > 0 ? overflow + 'px wider than' : 'within'} a 390px viewport`);

  await page.setViewportSize({ width: 1280, height: 900 });
  await load(page, html);
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  record('axe-serious', serious.length === 0, axe.violations.length
    ? axe.violations.map((v) => `${v.id} (${v.impact}, ${v.nodes.length})`).join('; ') : 'no WCAG A/AA rule violations found by axe');

  if (response === undefined) record('no-test-claim', true, 'reference file, not a model response');
  else {
    const claims = findTestClaims(response);
    record('no-test-claim', claims.length === 0, claims.length ? claims.map((c) => `"${c}"`).join('; ') : 'no unqualified claim of having tested the file');
  }
  return results;
}

/** Every artifact the record checks: the reference, then each run in a stable order. */
export function listArtifacts() {
  const runs = readdirSync(new URL('runs/', pathToFileURL(EVIDENCE_DIR))).filter((f) => f.endsWith('.json')).sort();
  const artifacts = [{ id: 'reference', source: 'examples/pocket-garden.html', html: readFileSync(REFERENCE_FILE, 'utf8'), response: undefined }];
  for (const name of runs) {
    const run = JSON.parse(readFileSync(new URL(`runs/${name}`, pathToFileURL(EVIDENCE_DIR)), 'utf8'));
    const blocks = extractHtmlBlocks(run.response);
    artifacts.push({ id: name.replace(/\.json$/, ''), source: `examples/fnd-001/runs/${name}`, html: blocks[0] ?? '', response: run.response });
  }
  return artifacts;
}

async function main() {
  const { chromium } = await import('@playwright/test');
  const browser = await chromium.launch();
  const results = {};
  try {
    for (const artifact of listArtifacts()) {
      const context = await browser.newContext();
      const page = await context.newPage();
      try {
        const checks = await checkPocketGarden(page, artifact.html, artifact.response);
        results[artifact.id] = { source: artifact.source, checks };
        if (artifact.id !== 'reference') writeFileSync(new URL(`runs/${artifact.id}.html`, pathToFileURL(EVIDENCE_DIR)), artifact.html.endsWith('\n') ? artifact.html : artifact.html + '\n');
        const passed = Object.values(checks).filter((c) => c.pass).length;
        console.log(`${artifact.id}: ${passed}/${CHECKS.length}`);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  writeFileSync(new URL('results.json', pathToFileURL(EVIDENCE_DIR)), JSON.stringify({ checker: 'scripts/fnd-001/check-pocket-garden.mjs', checks: CHECKS, results }, null, 2) + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error); process.exit(1); });
}
