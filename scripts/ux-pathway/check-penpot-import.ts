/**
 * Imports public/examples/ux-pathway/pocket-invoice.penpot into a running Penpot and records what came back.
 *
 *   PENPOT_URL=http://127.0.0.1:9001 PENPOT_EMAIL=you@example.com PENPOT_PASSWORD_FILE=/path/to/file \
 *     node scripts/ux-pathway/check-penpot-import.ts
 *
 * Use a throwaway account on a local Penpot (help.penpot.app/technical-guide/getting-started/docker/
 * starts one on localhost:9001). The password is read from the file and sent only to that Penpot; it is
 * never printed. Each run imports a new copy of the file, so it is safe to repeat.
 *
 * It checks, against the flow in src/data/pocket-invoice.ts:
 *   1. the import succeeds, and the file has the five pages, a board for every state on the low- and
 *      high-fidelity pages, an interaction for every transition, both flows, a 1280 px board for every
 *      screen state, the one-canvas journey with every state and a numbered arrow per transition, the
 *      eight main components, the library colours and type styles, and both token sets with the Light theme;
 *   2. every page opens in the workspace, which lays out the text and saves it (Penpot needs this
 *      before View mode can draw generated text);
 *   3. in View mode, clicking through the prototype reaches every transition's destination;
 *   4. Penpot exports the imported file again as .penpot (export-binfile), and the copy has the same
 *      pages, boards, interactions, components and tokens: the round trip a learner makes when they
 *      download their own edited file.
 * It writes the result to public/examples/ux-pathway/penpot-import-check.json, the Armory smoke-test
 * evidence to public/examples/armory/penpot.json (set PENPOT_IMAGES to the image references with their
 * digests, comma-separated, to record them) and screenshots of a few boards in View mode to
 * public/examples/ux-pathway/screens/. It exits 1 if any check fails. After a run, update the Penpot
 * entry in src/data/armory.ts (version, dates, observed); tests/armory.test.ts checks the two agree.
 *
 * It needs Chromium for Playwright (npx playwright install chromium). It is a maintainer's check,
 * not part of CI: CI has no Penpot server. The tests check the file's structure without one.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium, type APIRequestContext, type Page } from '@playwright/test';
import { STATES, TRANSITIONS, START_STATE, type StateId } from '../../src/data/pocket-invoice.ts';

const ROOT = new URL('../../', import.meta.url);
const OUT_DIR = fileURLToPath(new URL('public/examples/ux-pathway/', ROOT));
const FILE = OUT_DIR + 'pocket-invoice.penpot';
const BASE = (process.env['PENPOT_URL'] ?? 'http://127.0.0.1:9001').replace(/\/$/, '');
const EMAIL = process.env['PENPOT_EMAIL'];
const PASSWORD_FILE = process.env['PENPOT_PASSWORD_FILE'];
if (!EMAIL || !PASSWORD_FILE) throw new Error('Set PENPOT_EMAIL and PENPOT_PASSWORD_FILE (a file holding the password of a throwaway local account).');

type Json = Record<string, any>;
interface Check { name: string; pass: boolean; detail: string }
const checks: Check[] = [];
const check = (name: string, pass: boolean, detail: string) => { checks.push({ name, pass, detail }); console.log((pass ? 'PASS ' : 'FAIL ') + name + ': ' + detail); };

async function rpc(request: APIRequestContext, method: string, data: Json): Promise<Json> {
  const response = await request.post(BASE + '/api/main/methods/' + method, { data, headers: { accept: 'application/json' } });
  const body = await response.text();
  if (!response.ok()) throw new Error('Penpot ' + method + ' failed with HTTP ' + response.status() + ': ' + body.slice(0, 300));
  try { return JSON.parse(body) as Json; } catch { throw new Error('Penpot ' + method + ' returned something that is not JSON: ' + body.slice(0, 200)); }
}

async function importBytes(request: APIRequestContext, projectId: string, name: string, buffer: Buffer): Promise<string> {
  const response = await request.post(BASE + '/api/main/methods/import-binfile', {
    headers: { accept: 'text/event-stream' },
    multipart: { name, 'project-id': projectId, file: { name: 'pocket-invoice.penpot', mimeType: 'application/zip', buffer } },
  });
  const body = await response.text();
  if (!response.ok()) throw new Error('Penpot import failed with HTTP ' + response.status() + ': ' + body.slice(0, 300));
  // Penpot 2.18 ends with data: ["~u<id>"]; 2.19 with data: {"~:file-ids":["~u<id>"],"~:resolution":{}}.
  const end = /event: end\s*\ndata: (?:\[|\{"~:file-ids":\[)"~u([0-9a-f-]{36})"/.exec(body);
  if (!end?.[1]) throw new Error('Penpot import did not end with a file id: ' + body.slice(-400));
  return end[1];
}

const pageNamed = (data: Json, prefix: string): Json => {
  const page = Object.values(data['pagesIndex'] as Json).find((item: Json) => String(item['name']).startsWith(prefix));
  if (!page) throw new Error('No page starting ' + prefix);
  return page as Json;
};
const ROOT_ID = '00000000-0000-0000-0000-000000000000';
const rootBoards = (page: Json): Json[] => Object.values(page['objects'] as Json).filter((o: Json) => o['type'] === 'frame' && o['parentId'] === ROOT_ID && o['id'] !== ROOT_ID) as Json[];
const boardForState = (page: Json, state: StateId): Json | undefined => rootBoards(page).find((board) => String(board['name']).startsWith(state + ': '));

function structure(data: Json): void {
  const pages = (data['pages'] as string[]).map((id) => String((data['pagesIndex'] as Json)[id]['name']));
  check('pages', pages.length === 5, pages.join(' | '));
  const high = pageNamed(data, '04');
  const desktop = rootBoards(high).filter((board) => String(board['name']).startsWith('Desktop: '));
  const screenStates = STATES.filter((state) => state.kind !== 'overlay');
  const noDesktop = screenStates.filter((state) => !desktop.some((board) => String(board['name']).includes('(' + state.id + ', 1280 px)') && board['width'] === 1280)).map((state) => state.id);
  check('desktop-04', noDesktop.length === 0, noDesktop.length ? 'no 1280 px board for ' + noDesktop.join(', ') : desktop.length + ' boards at 1280 px, one per screen state');
  const journey = pageNamed(data, '05');
  const journeyObjects = Object.values(journey['objects'] as Json) as Json[];
  const canvas = rootBoards(journey);
  const screens = journeyObjects.filter((o) => o['type'] === 'frame' && o['parentId'] === canvas[0]?.['id']);
  const arrows = journeyObjects.filter((o) => o['type'] === 'path' && String(o['name']).startsWith('Transition '));
  const missingScreens = STATES.filter((state) => !screens.some((board) => String(board['name']).startsWith(state.id + ': '))).map((state) => state.id);
  const missingArrows = TRANSITIONS.filter((tr, i) => !arrows.some((arrow) => String(arrow['name']).startsWith('Transition ' + (i + 1) + ': ' + tr.from + ' to ' + tr.to + ' '))).map((tr) => tr.from + ' to ' + tr.to);
  check('journey-05', canvas.length === 1 && missingScreens.length === 0 && missingArrows.length === 0,
    canvas.length !== 1 ? canvas.length + ' root boards' : missingScreens.length || missingArrows.length ? 'missing ' + [...missingScreens, ...missingArrows].join(', ') : 'one canvas with ' + screens.length + ' screens and ' + arrows.length + ' numbered arrows');
  for (const prefix of ['02', '04']) {
    const page = pageNamed(data, prefix);
    const objects = page['objects'] as Json;
    const missing = STATES.filter((state) => !boardForState(page, state.id)).map((state) => state.id);
    check('boards-' + prefix, missing.length === 0, missing.length ? 'missing ' + missing.join(', ') : STATES.length + ' state boards');
    const found: string[] = [];
    for (const o of Object.values(objects) as Json[]) {
      for (const interaction of (o['interactions'] ?? []) as Json[]) {
        let parent = o; while (parent['parentId'] !== ROOT_ID) parent = objects[parent['parentId']];
        const from = String(parent['name']).split(':')[0];
        const to = String(objects[interaction['destination']]?.['name'] ?? '').split(':')[0];
        found.push(from + '>' + to + '>' + interaction['actionType']);
      }
    }
    // A dialog closes itself: Penpot's close-overlay names the overlay, and the screen under it shows again.
    const expectedKey = (tr: (typeof TRANSITIONS)[number]) => (tr.kind === 'overlay-close' ? tr.from + '>' + tr.from + '>close-overlay' : tr.from + '>' + tr.to + '>');
    const absent = TRANSITIONS.filter((tr) => !found.some((item) => item.startsWith(expectedKey(tr)))).map((tr) => tr.from + ' to ' + tr.to);
    check('interactions-' + prefix, absent.length === 0, absent.length ? 'no interaction for ' + absent.join(', ') : found.length + ' interactions cover all ' + TRANSITIONS.length + ' transitions');
    const flows = Object.values((page['flows'] ?? {}) as Json) as Json[];
    const start = boardForState(page, START_STATE);
    check('flow-' + prefix, flows.length === 1 && flows[0]?.['startingFrame'] === start?.['id'], flows.map((flow) => flow['name'] + ' starts at ' + String(objects[flow['startingFrame']]?.['name'])).join('; ') || 'no flow');
  }
  const components = Object.values((data['components'] ?? {}) as Json).map((c: Json) => c['path'] + ' / ' + c['name']).sort();
  check('components', components.length === 8, components.join(', '));
  check('library-colours', Object.keys(data['colors'] ?? {}).length === 16, Object.keys(data['colors'] ?? {}).length + ' colours');
  check('library-typographies', Object.keys(data['typographies'] ?? {}).length === 5, Object.keys(data['typographies'] ?? {}).length + ' type styles');
  const tokens = (data['tokensLib'] ?? {}) as Json;
  const count = (node: Json): number => Object.entries(node).reduce((sum, [key, value]) => sum + (key.startsWith('$') ? 0 : value && typeof value === 'object' && '$value' in value ? 1 : value && typeof value === 'object' ? count(value as Json) : 0), 0);
  const sets = Object.keys(tokens).filter((key) => !key.startsWith('$'));
  const themes = ((tokens['$themes'] ?? []) as Json[]).map((theme) => theme['group'] + '/' + theme['name']);
  const expected = JSON.parse(readFileSync(OUT_DIR + 'pocket-invoice-tokens.json', 'utf8')) as Json;
  const expectedCount = Object.entries(expected).filter(([key]) => !key.startsWith('$')).reduce((sum, [, value]) => sum + count(value as Json), 0);
  const actualCount = sets.reduce((sum, set) => sum + count(tokens[set] as Json), 0);
  check('tokens', sets.join(',') === 'core,semantic' && actualCount === expectedCount && themes.join() === 'Mode/Light', 'sets ' + sets.join(', ') + '; ' + actualCount + ' of ' + expectedCount + ' tokens; themes ' + themes.join(', '));
}

/** Exports the imported file from Penpot as .penpot and imports that copy again, so the result can be read back. */
async function roundTrip(request: APIRequestContext, projectId: string, fileId: string, before: Json): Promise<void> {
  const exported = await request.post(BASE + '/api/main/methods/export-binfile', { data: { fileId, includeLibraries: false, embedAssets: false }, headers: { accept: 'text/event-stream' } });
  const body = await exported.text();
  if (!exported.ok()) throw new Error('Penpot export failed with HTTP ' + exported.status() + ': ' + body.slice(0, 300));
  // The end event carries the download link as a Transit URI: data: {"~#uri":"<link>"}.
  const href = /event: end\s*\ndata: \{"~#uri":"([^"]+)"\}/.exec(body)?.[1];
  if (!href) throw new Error('Penpot export did not end with a download link: ' + body.slice(-400));
  const download = await request.get(href.startsWith('http') ? href : BASE + href);
  if (!download.ok()) throw new Error('Penpot export download failed with HTTP ' + download.status());
  const bytes = await download.body();
  const copyId = await importBytes(request, projectId, 'Pocket Invoice (round trip)', bytes);
  const after = (await rpc(request, 'get-file', { id: copyId }))['data'] as Json;
  const summary = (data: Json) => {
    const pages = (data['pages'] as string[]).map((id) => (data['pagesIndex'] as Json)[id] as Json);
    const objects = pages.flatMap((page) => Object.values(page['objects'] as Json) as Json[]);
    return [
      pages.map((page) => String(page['name'])).join(' | '),
      objects.filter((o) => o['type'] === 'frame').length + ' boards',
      objects.reduce((sum, o) => sum + ((o['interactions'] ?? []) as Json[]).length, 0) + ' interactions',
      Object.keys(data['components'] ?? {}).length + ' components',
      Object.keys((data['tokensLib'] ?? {}) as Json).filter((key) => !key.startsWith('$')).join(',') + ' token sets',
    ];
  };
  const a = summary(before); const b = summary(after);
  check('export-round-trip', a.join() === b.join(), 'exported ' + bytes.length + ' bytes as .penpot and imported the copy: ' + (a.join() === b.join() ? b.slice(1).join(', ') : 'before ' + a.join('; ') + ' / after ' + b.join('; ')));
}

async function layOutText(page: Page, request: APIRequestContext, teamId: string, fileId: string, pageIds: string[]): Promise<void> {
  for (const pageId of pageIds) {
    await page.goto(BASE + '/#/workspace?team-id=' + teamId + '&file-id=' + fileId + '&page-id=' + pageId);
    await page.waitForTimeout(15000);
  }
  await page.goto('about:blank');
  await page.waitForTimeout(2000);
  const data = (await rpc(request, 'get-file', { id: fileId }))['data'] as Json;
  for (const prefix of ['02', '04', '05']) {
    const texts = (Object.values(pageNamed(data, prefix)['objects'] as Json) as Json[]).filter((o) => o['type'] === 'text');
    const laidOut = texts.filter((o) => Array.isArray(o['positionData']) && o['positionData'].length).length;
    check('text-layout-' + prefix, laidOut >= texts.length * 0.95, laidOut + ' of ' + texts.length + ' text layers laid out and saved after opening the page in the workspace');
  }
}

/** The path through the prototype: [shape to click, state expected after it]. Together the steps cover every transition. */
const WALK: [string, StateId][] = [
  ['Link: I already have an account', 'sign-in'], ['Button secondary: Back to create a workspace', 'signup'],
  ['Prototype link: signup-error', 'signup-error'], ['Button primary: Create workspace', 'invoices-empty'],
  ['Button primary: Create your first invoice', 'invoice-new'], ['Button secondary: Cancel', 'discard-dialog'],
  ['Button primary: Keep editing', 'invoice-new'], ['Button secondary: Cancel', 'discard-dialog'], ['Button secondary: Discard', 'invoices-empty'],
  ['Button primary: Create your first invoice', 'invoice-new'], ['Prototype link: invoice-new-error', 'invoice-new-error'],
  ['Button secondary: Cancel', 'discard-dialog'], ['Button primary: Keep editing', 'invoice-new-error'],
  ['Button primary: Check invoice', 'invoice-review'], ['Button secondary: Change details', 'invoice-new'],
  ['Button primary: Check invoice', 'invoice-review'], ['Prototype link: send-error', 'send-error'],
  ['Button primary: Change the email address', 'invoice-new'], ['Button primary: Check invoice', 'invoice-review'],
  ['Button primary: Send invoice', 'invoice-sent'], ['Button primary: Back to invoices', 'invoices-list'], ['Button primary: Create invoice', 'invoice-new'],
];

const SCREENSHOTS: Partial<Record<StateId, string>> = { signup: 'signup', 'invoice-new-error': 'invoice-new-error', 'invoice-review': 'invoice-review', 'discard-dialog': 'discard-dialog' };

async function walkPrototype(page: Page, data: Json, fileId: string, prefix: string, label: string): Promise<void> {
  const penpotPage = pageNamed(data, prefix);
  const objects = penpotPage['objects'] as Json;
  const flow = Object.values(penpotPage['flows'] as Json)[0] as Json;
  await page.goto(BASE + '/#/view?file-id=' + fileId + '&page-id=' + penpotPage['id'] + '&section=interactions&index=0');
  await page.waitForTimeout(6000);
  // Start where the flow starts: step through the boards until the breadcrumb names the starting board.
  const startName = String(objects[flow['startingFrame']]['name']);
  const boards = rootBoards(penpotPage).filter((board) => !board['hideInViewer']);
  for (let index = 0; index < boards.length; index += 1) {
    await page.goto(BASE + '/#/view?file-id=' + fileId + '&page-id=' + penpotPage['id'] + '&section=interactions&index=' + index);
    await page.waitForTimeout(1500);
    if ((await page.locator('header').innerText()).includes(startName.slice(0, 20))) break;
  }
  const visibleShape = async (name: string) => {
    const ids = (Object.values(objects) as Json[]).filter((o) => o['name'] === name).map((o) => String(o['id']));
    for (const id of ids) {
      for (const handle of await page.locator('g[id="shape-' + id + '"]').all()) {
        const box = await handle.boundingBox();
        if (box && box.width > 0 && box.height > 0) return box;
      }
    }
    return undefined;
  };
  const reached: string[] = [];
  const failures: string[] = [];
  const shot = async (state: StateId) => {
    const file = SCREENSHOTS[state];
    if (!file) return;
    const board = state === 'discard-dialog' ? undefined : await visibleShape(String(boardForState(penpotPage, state)?.['name']));
    await page.screenshot({ path: OUT_DIR + 'screens/' + label + '-' + file + '.png', ...(board ? { clip: board } : {}) });
  };
  await shot(START_STATE);
  for (const [shapeName, expected] of WALK) {
    const box = await visibleShape(shapeName);
    if (!box) { failures.push('no visible "' + shapeName + '" before ' + expected); break; }
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(1200);
    const header = await page.locator('header').innerText();
    const expectedBoard = String(boardForState(penpotPage, expected)?.['name']);
    const ok = expected === 'discard-dialog' ? Boolean(await visibleShape('Button secondary: Discard')) : header.includes(expectedBoard.slice(0, 20)) && !(await visibleShape('Button secondary: Discard'));
    reached.push(expected + (ok ? '' : ' (not reached)'));
    if (!ok) { failures.push(shapeName + ' did not lead to ' + expected); break; }
    if (!SCREENSHOTS[expected] || reached.filter((item) => item === expected).length === 1) await shot(expected);
  }
  check('prototype-walk-' + prefix, failures.length === 0, failures.length ? failures.join('; ') : WALK.length + ' clicks in View mode, every transition reached: ' + reached.join(' > '));
}

const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1000, height: 1400 } });
  const request = context.request;
  const version = (await (await request.get(BASE + '/version.txt')).text()).trim();
  await rpc(request, 'login-with-password', { email: EMAIL, password: readFileSync(PASSWORD_FILE, 'utf8').trim() });
  const profile = await rpc(request, 'get-profile', {});
  const fileId = await importBytes(request, String(profile['defaultProjectId']), 'Pocket Invoice (import check)', readFileSync(FILE));
  check('import', true, 'imported as a new file');
  structure((await rpc(request, 'get-file', { id: fileId }))['data'] as Json);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(String(error).slice(0, 200)));
  const pageIds = ((await rpc(request, 'get-file', { id: fileId }))['data'] as Json)['pages'] as string[];
  await layOutText(page, request, String(profile['defaultTeamId']), fileId, pageIds);
  mkdirSync(OUT_DIR + 'screens', { recursive: true });
  const data = (await rpc(request, 'get-file', { id: fileId }))['data'] as Json;
  await walkPrototype(page, data, fileId, '02', 'low');
  await walkPrototype(page, data, fileId, '04', 'high');
  // Page 05 in View mode: the whole journey board, scaled to fit, for the README and the pathway page.
  await page.setViewportSize({ width: 2000, height: 760 });
  await page.goto(BASE + '/#/view?file-id=' + fileId + '&page-id=' + pageNamed(data, '05')['id'] + '&section=interactions&index=0&zoom=fit');
  await page.waitForTimeout(6000);
  await page.screenshot({ path: OUT_DIR + 'screens/journey.png', clip: { x: 0, y: 48, width: 2000, height: 700 } });
  await roundTrip(request, String(profile['defaultProjectId']), fileId, data);
  check('no-page-errors', errors.length === 0, errors.length ? errors.join(' | ') : 'no uncaught errors in the Penpot UI');
  const record = {
    // The local calendar day, the same convention as every other date on the site (not the UTC day).
    checkedOn: new Date().toLocaleDateString('en-CA'),
    penpotVersion: version,
    file: 'pocket-invoice.penpot',
    /** Ties this record to one exact file; tests/pocket-invoice.test.ts compares it with the published copy. */
    fileSha256: createHash('sha256').update(readFileSync(FILE)).digest('hex'),
    method: 'Imported with the import-binfile API into a local, self-hosted Penpot; each page opened in the workspace; the prototypes clicked through in View mode with Playwright (Chromium).',
    notChecked: [
      'Writing to Penpot through a plugin or the MCP server: the file is generated offline with @penpot/library and imported. A plugin write was checked separately on 2026-11-28: penpot-plugin-write-check.json.',
      'Penpot cloud (design.penpot.app): only a self-hosted instance was used.',
      'Editing by a person: the check opens, lays out and clicks the file; it does not edit it.',
      'Export of boards to SVG, PDF or PNG: those need Penpot\'s exporter service, which this check does not run. Export as .penpot is checked (export-round-trip).',
    ],
    checks,
  };
  writeFileSync(OUT_DIR + 'penpot-import-check.json', JSON.stringify(record, null, 2) + '\n');
  const library = JSON.parse(readFileSync(fileURLToPath(new URL('node_modules/@penpot/library/package.json', ROOT)), 'utf8')) as { version: string };
  const armoryEvidence = {
    entry: 'penpot',
    date: record.checkedOn,
    penpotVersion: version,
    library: '@penpot/library@' + library.version,
    images: (process.env['PENPOT_IMAGES'] ?? '').split(',').map((item) => item.trim()).filter(Boolean),
    environment: 'Self-hosted Penpot from the official container images, reachable only from the same machine; a throwaway account; Chromium through Playwright.',
    file: { name: '/examples/ux-pathway/pocket-invoice.penpot', sha256: record.fileSha256, source: 'Developer Dojo, MIT licence, written with @penpot/library' },
    importCheck: '/examples/ux-pathway/penpot-import-check.json',
    steps: ['import-binfile as a new file', 'read the file back and check its structure against the flow', 'open every page in the workspace', 'click through both prototypes in View mode', 'export-binfile, then import the exported copy and compare'],
    checks: checks.map(({ name, pass }) => ({ name, pass })),
    notChecked: record.notChecked,
  };
  writeFileSync(fileURLToPath(new URL('public/examples/armory/penpot.json', ROOT)), JSON.stringify(armoryEvidence, null, 2) + '\n');
  console.log('Wrote ' + OUT_DIR + 'penpot-import-check.json');
  if (checks.some((item) => !item.pass)) process.exitCode = 1;
} finally {
  await browser.close();
}
