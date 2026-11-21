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
 *   1. the import succeeds, and the file has the four pages, a board for every state on the low- and
 *      high-fidelity pages, an interaction for every transition, both flows, the eight main components,
 *      the library colours and type styles, and both token sets with the Light theme;
 *   2. every page opens in the workspace, which lays out the text and saves it (Penpot needs this
 *      before View mode can draw generated text);
 *   3. in View mode, clicking through the prototype reaches every transition's destination.
 * It writes the result to public/examples/ux-pathway/penpot-import-check.json and screenshots of a
 * few boards in View mode to public/examples/ux-pathway/screens/. It exits 1 if any check fails.
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

async function importFile(request: APIRequestContext, projectId: string): Promise<string> {
  const response = await request.post(BASE + '/api/main/methods/import-binfile', {
    headers: { accept: 'text/event-stream' },
    multipart: { name: 'Pocket Invoice (import check)', 'project-id': projectId, file: { name: 'pocket-invoice.penpot', mimeType: 'application/zip', buffer: readFileSync(FILE) } },
  });
  const body = await response.text();
  if (!response.ok()) throw new Error('Penpot import failed with HTTP ' + response.status() + ': ' + body.slice(0, 300));
  const end = /event: end\s*\ndata: \["~u([0-9a-f-]{36})"\]/.exec(body);
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
  check('pages', pages.length === 4, pages.join(' | '));
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

async function layOutText(page: Page, request: APIRequestContext, teamId: string, fileId: string, pageIds: string[]): Promise<void> {
  for (const pageId of pageIds) {
    await page.goto(BASE + '/#/workspace?team-id=' + teamId + '&file-id=' + fileId + '&page-id=' + pageId);
    await page.waitForTimeout(15000);
  }
  await page.goto('about:blank');
  await page.waitForTimeout(2000);
  const data = (await rpc(request, 'get-file', { id: fileId }))['data'] as Json;
  for (const prefix of ['02', '04']) {
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
  const fileId = await importFile(request, String(profile['defaultProjectId']));
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
      'Writing to Penpot through a plugin or the MCP server: the file is generated offline with @penpot/library and imported.',
      'Penpot cloud (design.penpot.app): only a self-hosted instance was used.',
      'Editing by a person: the check opens, lays out and clicks the file; it does not edit it.',
      'Export to other formats (SVG, PDF, PNG) from Penpot.',
    ],
    checks,
  };
  writeFileSync(OUT_DIR + 'penpot-import-check.json', JSON.stringify(record, null, 2) + '\n');
  console.log('Wrote ' + OUT_DIR + 'penpot-import-check.json');
  if (checks.some((item) => !item.pass)) process.exitCode = 1;
} finally {
  await browser.close();
}
