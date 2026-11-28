/**
 * Proves, or disproves, a native write to a Penpot file through Penpot's official Plugin API, and records the result.
 *
 *   PENPOT_URL=http://127.0.0.1:9001 PENPOT_EMAIL=you@example.com PENPOT_PASSWORD_FILE=/path/to/file \
 *     node scripts/ux-pathway/check-penpot-plugin-write.ts
 *
 * Use a throwaway account on a local, self-hosted Penpot (help.penpot.app/technical-guide/getting-started/docker/).
 * The password is read from the file and sent only to that Penpot; it is never printed.
 *
 * What it does, as a person would in Penpot:
 *   1. serves the plugin in scripts/ux-pathway/plugin-write-check/ (manifest.json, plugin.js, ui.html) on
 *      127.0.0.1 (PLUGIN_PORT, default 4455), with the cross-origin headers Penpot's docs ask for;
 *   2. imports public/examples/ux-pathway/pocket-invoice.penpot as a new file and opens its first page in the
 *      workspace;
 *   3. opens the Plugin Manager (Ctrl + Alt + P), installs the plugin from its manifest URL, records the
 *      permissions Penpot's dialog shows and allows them, then opens the plugin from the manager;
 *   4. the plugin writes a board, a rectangle and a text on the page with penpot.createBoard(),
 *      penpot.createRectangle() and penpot.createText(), and reports what it wrote to its UI frame;
 *   5. in a fresh API session (a new login, no browser state) it reads the file back from the backend with
 *      get-file and checks the three shapes, their names, sizes, colours, text and nesting; then it exports
 *      the file with export-binfile and checks the shapes are in the exported .penpot.
 * It writes public/examples/ux-pathway/penpot-plugin-write-check.json and exits 1 if any check fails.
 * A step that cannot be done is recorded as a failed check with the exact error, never skipped.
 *
 * It needs Chromium for Playwright (npx playwright install chromium). A maintainer's check, not CI.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, request as playwrightRequest, type APIRequestContext, type Frame, type Page } from '@playwright/test';
import { readZip } from './zip.ts';

const ROOT = new URL('../../', import.meta.url);
const OUT_DIR = fileURLToPath(new URL('public/examples/ux-pathway/', ROOT));
const FILE = OUT_DIR + 'pocket-invoice.penpot';
const PLUGIN_DIR = fileURLToPath(new URL('plugin-write-check/', import.meta.url));
const BASE = (process.env['PENPOT_URL'] ?? 'http://127.0.0.1:9001').replace(/\/$/, '');
const PLUGIN_PORT = Number(process.env['PLUGIN_PORT'] ?? 4455);
const PLUGIN_BASE = 'http://127.0.0.1:' + PLUGIN_PORT + '/';
const MANIFEST_URL = PLUGIN_BASE + 'manifest.json';
const EMAIL = process.env['PENPOT_EMAIL'];
const PASSWORD_FILE = process.env['PENPOT_PASSWORD_FILE'];
if (!EMAIL || !PASSWORD_FILE) throw new Error('Set PENPOT_EMAIL and PENPOT_PASSWORD_FILE (a file holding the password of a throwaway local account).');
const PASSWORD = readFileSync(PASSWORD_FILE, 'utf8').trim();

/** What plugin.js writes. Keep in step with WRITE in plugin-write-check/plugin.js. */
const WRITE = {
  board: { name: 'Plugin write check: board', width: 360, height: 200, fill: '#F4F1EA' },
  rectangle: { name: 'Plugin write check: rectangle', width: 140, height: 48, fill: '#1F6FEB', radius: 8 },
  text: { name: 'Plugin write check: text', characters: 'Written by a Penpot plugin', fill: '#1B1B1F' },
} as const;

type Json = Record<string, any>;
interface Check { name: string; pass: boolean; detail: string }
const checks: Check[] = [];
/** Never lets the password reach the record or the console, whatever an error message carries. */
const redact = (text: string) => (PASSWORD ? text.split(PASSWORD).join('***') : text);
/** The published record names the local servers by role, not by address: the site carries no addresses. */
const publishable = (text: string) => redact(text).split(PLUGIN_BASE).join('<plugin server>/').split(BASE).join('<penpot>');
const check = (name: string, pass: boolean, detail: string) => { const clean = publishable(detail); checks.push({ name, pass, detail: clean }); console.log((pass ? 'PASS ' : 'FAIL ') + name + ': ' + clean); };
const message = (error: unknown) => redact(error instanceof Error ? error.message : String(error)).slice(0, 600);

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
  const end = /event: end\s*\ndata: (?:\[|\{"~:file-ids":\[)"~u([0-9a-f-]{36})"/.exec(body);
  if (!end?.[1]) throw new Error('Penpot import did not end with a file id: ' + body.slice(-400));
  return end[1];
}

async function exportBytes(request: APIRequestContext, fileId: string): Promise<Buffer> {
  const exported = await request.post(BASE + '/api/main/methods/export-binfile', { data: { fileId, includeLibraries: false, embedAssets: false }, headers: { accept: 'text/event-stream' } });
  const body = await exported.text();
  if (!exported.ok()) throw new Error('Penpot export failed with HTTP ' + exported.status() + ': ' + body.slice(0, 300));
  const href = /event: end\s*\ndata: \{"~#uri":"([^"]+)"\}/.exec(body)?.[1];
  if (!href) throw new Error('Penpot export did not end with a download link: ' + body.slice(-400));
  const download = await request.get(href.startsWith('http') ? href : BASE + href);
  if (!download.ok()) throw new Error('Penpot export download failed with HTTP ' + download.status());
  return download.body();
}

/** Serves the plugin folder with the cross-origin headers Penpot needs to fetch it, and logs each request. */
function servePlugin(served: string[]): Promise<Server> {
  const types: Record<string, string> = { '.json': 'application/json', '.js': 'text/javascript', '.html': 'text/html; charset=utf-8' };
  const files = new Set(['manifest.json', 'plugin.js', 'ui.html']);
  const server = createServer((req, res) => {
    const path = new URL(req.url ?? '/', PLUGIN_BASE).pathname.replace(/^\//, '');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
    if (!files.has(path)) { res.writeHead(404); res.end('not found'); return; }
    served.push(path);
    try {
      const body = readFileSync(PLUGIN_DIR + path);
      res.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' });
      res.end(body);
    } catch (error) {
      res.writeHead(500); res.end('cannot read ' + path + ': ' + message(error));
    }
  });
  return new Promise((resolve, reject) => {
    server.once('error', (error) => reject(new Error('Cannot serve the plugin on ' + PLUGIN_BASE + ': ' + message(error))));
    server.listen(PLUGIN_PORT, '127.0.0.1', () => resolve(server));
  });
}

/** Collects every text run under a Penpot text shape's content tree. */
const textOf = (node: Json | undefined): string => (!node ? '' : (typeof node['text'] === 'string' ? node['text'] : '') + ((node['children'] ?? []) as Json[]).map(textOf).join(''));
const fillOf = (shape: Json | undefined): string => String(((shape?.['fills'] ?? []) as Json[])[0]?.['fillColor'] ?? '').toUpperCase();
/** Text fills live on the text runs, not on the shape. */
const textFills = (node: Json | undefined): string[] => (!node ? [] : [...((node['fills'] ?? []) as Json[]).map((fill) => String(fill['fillColor']).toUpperCase()), ...((node['children'] ?? []) as Json[]).flatMap(textFills)]);

interface Written { board: Json | undefined; rectangle: Json | undefined; text: Json | undefined; page: Json | undefined }
function findWritten(data: Json): Written {
  for (const pageId of data['pages'] as string[]) {
    const page = (data['pagesIndex'] as Json)[pageId] as Json;
    const objects = Object.values(page['objects'] as Json) as Json[];
    const board = objects.find((o) => o['name'] === WRITE.board.name);
    if (board) return { page, board, rectangle: objects.find((o) => o['name'] === WRITE.rectangle.name), text: objects.find((o) => o['name'] === WRITE.text.name) };
  }
  return { page: undefined, board: undefined, rectangle: undefined, text: undefined };
}

/** Checks the three shapes as stored by Penpot, against what plugin.js writes and the ids the plugin reported. */
function checkWritten(prefix: string, found: Written, reported: Json | undefined): void {
  const { board, rectangle, text } = found;
  check(prefix + '-board', Boolean(board) && board?.['type'] === 'frame' && board?.['width'] === WRITE.board.width && board?.['height'] === WRITE.board.height && fillOf(board) === WRITE.board.fill,
    board ? 'board "' + board['name'] + '" (' + board['type'] + ', ' + board['width'] + ' x ' + board['height'] + ', fill ' + fillOf(board) + ')' + (found.page ? ' on page "' + found.page['name'] + '"' : '') : 'no shape named "' + WRITE.board.name + '"');
  check(prefix + '-rectangle', Boolean(rectangle) && rectangle?.['type'] === 'rect' && rectangle?.['parentId'] === board?.['id'] && rectangle?.['width'] === WRITE.rectangle.width && rectangle?.['height'] === WRITE.rectangle.height && fillOf(rectangle) === WRITE.rectangle.fill && rectangle?.['r1'] === WRITE.rectangle.radius,
    rectangle ? 'rectangle "' + rectangle['name'] + '" (' + rectangle['type'] + ', ' + rectangle['width'] + ' x ' + rectangle['height'] + ', fill ' + fillOf(rectangle) + ', radius ' + rectangle['r1'] + ')' + (rectangle['parentId'] === board?.['id'] ? ' inside the board' : ' NOT inside the board') : 'no shape named "' + WRITE.rectangle.name + '"');
  const characters = textOf(text?.['content'] as Json | undefined);
  const colours = textFills(text?.['content'] as Json | undefined);
  check(prefix + '-text', Boolean(text) && text?.['type'] === 'text' && text?.['parentId'] === board?.['id'] && characters === WRITE.text.characters && colours.includes(WRITE.text.fill),
    text ? 'text "' + text['name'] + '" reads "' + characters + '" in ' + ([...new Set(colours)].join(', ') || 'no fill') + (text['parentId'] === board?.['id'] ? ', inside the board' : ', NOT inside the board') : 'no shape named "' + WRITE.text.name + '"');
  if (reported) {
    const same = board?.['id'] === reported['board']?.['id'] && rectangle?.['id'] === reported['rectangle']?.['id'] && text?.['id'] === reported['text']?.['id'];
    check(prefix + '-ids-match-plugin', same, same ? 'the ids Penpot stored are the ids the plugin reported for its board, rectangle and text' : 'stored ' + [board?.['id'], rectangle?.['id'], text?.['id']].join(', ') + ' / reported ' + [reported['board']?.['id'], reported['rectangle']?.['id'], reported['text']?.['id']].join(', '));
  }
}

async function freshSession(): Promise<APIRequestContext> {
  const request = await playwrightRequest.newContext();
  await rpc(request, 'login-with-password', { email: EMAIL, password: PASSWORD });
  return request;
}

/** Opens the Plugin Manager the documented way (Ctrl + Alt + P), falling back to the main menu. */
async function openPluginManager(page: Page): Promise<string> {
  const input = page.getByPlaceholder('Write a plugin URL');
  await page.locator('body').click({ position: { x: 600, y: 400 } }).catch(() => undefined);
  await page.keyboard.press('Control+Alt+KeyP');
  if (await input.isVisible({ timeout: 5000 }).catch(() => false)) return 'shortcut Ctrl + Alt + P';
  await page.keyboard.press('Escape');
  await page.locator('[class*="main-menu"], [data-testid="main-menu"], button[aria-label="Main menu"]').first().click({ timeout: 5000 });
  await page.getByText('Plugins', { exact: true }).first().hover();
  await page.getByText('Plugins manager', { exact: false }).first().click({ timeout: 5000 });
  await input.waitFor({ state: 'visible', timeout: 10000 });
  return 'main menu > Plugins > Plugins manager';
}

async function waitForReport(page: Page, timeoutMs: number): Promise<{ frame: Frame | undefined; report: Json | undefined }> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const frame = page.frames().find((item) => item.url().startsWith(PLUGIN_BASE + 'ui.html'));
    if (frame) {
      const text = await frame.locator('#report').textContent().catch(() => '');
      if (text) return { frame, report: JSON.parse(text) as Json };
    }
    await page.waitForTimeout(500);
  }
  return { frame: undefined, report: undefined };
}

const served: string[] = [];
const server = await servePlugin(served);
const browser = await chromium.launch();
let version = 'unknown';
let permissionsGranted: string[] = [];
let permissionDialogTitle = '';
let openedBy = '';
let report: Json | undefined;
const browserErrors: string[] = [];
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const request = context.request;
  version = (await (await request.get(BASE + '/version.txt')).text()).trim();
  await rpc(request, 'login-with-password', { email: EMAIL, password: PASSWORD });
  const profile = await rpc(request, 'get-profile', {});
  const fileId = await importBytes(request, String(profile['defaultProjectId']), 'Pocket Invoice (plugin write check)', readFileSync(FILE));
  const before = (await rpc(request, 'get-file', { id: fileId }))['data'] as Json;
  const pageIds = before['pages'] as string[];
  const before0 = Object.keys(((before['pagesIndex'] as Json)[pageIds[0] as string] as Json)['objects'] as Json).length;
  check('import', !findWritten(before).board, 'imported pocket-invoice.penpot as a new file with ' + pageIds.length + ' pages' + (findWritten(before).board ? '; it ALREADY holds "' + WRITE.board.name + '", so the check proves nothing' : ', none of the shapes the plugin writes'));

  const page = await context.newPage();
  page.on('pageerror', (error) => browserErrors.push('pageerror: ' + String(error).slice(0, 300)));
  page.on('console', (msg) => { if (msg.type() === 'error') browserErrors.push('console: ' + msg.text().slice(0, 300)); });
  await page.goto(BASE + '/#/workspace?team-id=' + profile['defaultTeamId'] + '&file-id=' + fileId + '&page-id=' + pageIds[0]);
  await page.waitForTimeout(15000);

  try {
    openedBy = await openPluginManager(page);
    await page.getByPlaceholder('Write a plugin URL').fill(MANIFEST_URL);
    await page.getByRole('button', { name: 'Install', exact: true }).click();
    const dialog = page.locator('[class*="plugin-permissions"]').first();
    await dialog.waitFor({ state: 'visible', timeout: 15000 });
    permissionDialogTitle = (await dialog.locator('[class*="modal-title"]').innerText()).trim();
    permissionsGranted = (await dialog.locator('[class*="permissions-list-text"]').allInnerTexts()).map((item) => item.trim());
    await dialog.locator('input[type="button"][value="Allow"]').click();
    check('install-from-manifest-url', true, 'Plugin Manager opened by ' + openedBy + '; installed from ' + MANIFEST_URL + '; the permissions dialog "' + permissionDialogTitle + '" listed: ' + permissionsGranted.join(' | ') + '; allowed');
  } catch (error) {
    check('install-from-manifest-url', false, 'could not install the plugin through the Plugin Manager: ' + message(error));
    throw error;
  }

  try {
    const entry = page.locator('[class*="plugins-list-element"]').filter({ hasText: 'Developer Dojo write check' }).first();
    await entry.waitFor({ state: 'visible', timeout: 10000 });
    await entry.getByRole('button', { name: 'Open' }).click();
    const result = await waitForReport(page, 30000);
    report = result.report;
    if (!report) throw new Error('the plugin UI (' + PLUGIN_BASE + 'ui.html) showed no report within 30 s; files served to the browser: ' + (served.join(', ') || 'none'));
    check('plugin-ran', report['ok'] === true, report['ok'] === true
      ? 'the plugin ran from the manager and reported, through the Plugin API, board ' + report['board']?.['name'] + ' with children [' + ((report['board']?.['children'] ?? []) as string[]).join(', ') + '] on page "' + report['pageName'] + '" of file ' + report['fileId']
      : 'the plugin reported an error: ' + String(report['error']));
  } catch (error) {
    check('plugin-ran', false, message(error));
    throw error;
  }
  check('plugin-files-served', ['manifest.json', 'plugin.js', 'ui.html'].every((file) => served.includes(file)), 'Penpot fetched from the plugin server: ' + served.join(', '));

  // Leave the workspace so nothing in the browser can answer for the backend, then read it back in a new session.
  await page.waitForTimeout(5000);
  await page.goto('about:blank');
  const fresh = await freshSession();
  try {
    let after: Json = {};
    let found: Written = { page: undefined, board: undefined, rectangle: undefined, text: undefined };
    for (let attempt = 0; attempt < 15 && !found.board; attempt += 1) {
      after = (await rpc(fresh, 'get-file', { id: fileId }))['data'] as Json;
      found = findWritten(after);
      if (!found.board) await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    check('backend-file', Boolean(found.board) && found.page?.['id'] === pageIds[0], found.board ? 'get-file in a new session (fresh login, no browser) returns the plugin\'s shapes on page "' + found.page?.['name'] + '", the page that was open' : 'get-file in a new session does not contain "' + WRITE.board.name + '" 30 s after the plugin ran');
    checkWritten('backend', found, report);
    const after0 = Object.keys(((after['pagesIndex'] as Json)[pageIds[0] as string] as Json)['objects'] as Json).length;
    check('backend-existing-content-kept', (after['pages'] as string[]).length === pageIds.length && after0 === before0 + 3, 'pages ' + pageIds.length + ' before, ' + (after['pages'] as string[]).length + ' after; shapes on page 1: ' + before0 + ' before, ' + after0 + ' after (the plugin adds 3)');

    const bytes = await exportBytes(fresh, fileId);
    const shapes = readZip(new Uint8Array(bytes)).filter((entry) => /\/pages\/[0-9a-f-]+\/[0-9a-f-]+\.json$/.test(entry.name)).map((entry) => JSON.parse(new TextDecoder().decode(entry.data)) as Json);
    const byName = (name: string) => shapes.find((shape) => shape['name'] === name);
    const exportedBoard = byName(WRITE.board.name);
    check('export-binfile', Boolean(exportedBoard), 'export-binfile gave ' + bytes.length + ' bytes, ' + shapes.length + ' shape entries; ' + (exportedBoard ? 'the plugin\'s board is among them' : 'the plugin\'s board is not among them'));
    checkWritten('export', { page: undefined, board: exportedBoard, rectangle: byName(WRITE.rectangle.name), text: byName(WRITE.text.name) }, report);
  } finally {
    await fresh.dispose();
  }
} catch (error) {
  if (!checks.some((item) => !item.pass)) check('run', false, message(error));
} finally {
  await browser.close();
  server.close();
}

const pluginErrors = browserErrors.filter((line) => /plugin|ses|sandbox/i.test(line));
check('no-plugin-errors', pluginErrors.length === 0, pluginErrors.length ? pluginErrors.slice(0, 5).join(' | ') : 'no uncaught errors or console errors mentioning the plugin runtime (' + browserErrors.length + ' other console errors)');

const record = {
  checkedOn: '2026-11-28',
  penpotVersion: version,
  method: 'A local, self-hosted Penpot ' + version + ' from the official container images, reachable only from the same machine, with a throwaway account. pocket-invoice.penpot imported as a new file and opened in the workspace with Playwright (Chromium). The plugin in scripts/ux-pathway/plugin-write-check (manifest version 2, permissions content:read and content:write) served from the same machine, installed from its manifest URL in the Plugin Manager, its permissions allowed in Penpot\'s dialog, and opened from the manager. It writes a board, a rectangle and a text with penpot.createBoard(), penpot.createRectangle() and penpot.createText(). The file then read back with get-file in a new API session and exported with export-binfile.',
  pluginManifest: 'scripts/ux-pathway/plugin-write-check/manifest.json',
  permissionsRequested: (JSON.parse(readFileSync(PLUGIN_DIR + 'manifest.json', 'utf8')) as { permissions: string[] }).permissions,
  permissionsDialogTitle: permissionDialogTitle,
  permissionsGranted,
  pluginReport: report ?? null,
  /** Every uncaught error and console error in the Penpot tab during the run, for the record. */
  browserConsoleErrors: browserErrors.map(publishable),
  notChecked: [
    'The Penpot MCP server: only the Plugin API, through the Plugin Manager, was used.',
    'Penpot cloud (penpot.app, design.penpot.app): only a self-hosted instance was used.',
    'Figma: nothing here touches Figma or a Figma file.',
    'A person\'s own editing: the plugin was installed, allowed and opened by Playwright clicking the Plugin Manager as a person would, but no person edited the file.',
    'Other plugin permissions (library, comments, user, downloads) and plugins from the public plugin list.',
    'Penpot with its Content-Security-Policy enforced (PENPOT_CSP_MODE=enforce): 2.19.5 ships it report-only, and the browser logged that framing the plugin UI from another origin breaks frame-src \'self\' (see browserConsoleErrors); an enforcing deployment needs PENPOT_CSP_FRAME_SRC_EXTRA for the plugin origin.',
  ],
  checks,
};
writeFileSync(OUT_DIR + 'penpot-plugin-write-check.json', JSON.stringify(record, null, 2) + '\n');
console.log('Wrote ' + OUT_DIR + 'penpot-plugin-write-check.json');
if (checks.some((item) => !item.pass)) process.exitCode = 1;
