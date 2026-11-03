// Scheduled external link check. Reads every `url:` in src/content/resources/**/*.yaml and every
// external http(s) link in the markdown under src/content/library and src/content/tracks, fetches each
// one politely (per-host spacing, bounded concurrency, retries, browser User-Agent), and writes a
// markdown report. YouTube links are checked through oEmbed because youtube.com pages answer bots
// with consent walls. Hosts in BOT_BLOCKERS are known to refuse automated requests: a 401/403/429/999
// there is reported as "unverified" and does not fail the run.
// Exit codes: 0 no hard failures, 1 at least one hard failure, 2 the script itself could not run.
// Usage: node scripts/check-external-links.mjs [--report link-check-report.md] [--concurrency 6]
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const REPORT = option('report', 'link-check-report.md');
const CONCURRENCY = Number(option('concurrency', '6'));
const PER_HOST_GAP_MS = Number(option('host-gap-ms', '400'));
const TIMEOUT_MS = 25_000;
const RETRIES = 2;
const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

/** Hosts that block scripted requests. Blocked statuses here are "unverified", not failures. */
const BOT_BLOCKERS = new Set([
  'linkedin.com',
  'www.linkedin.com',
  'www.coursera.org',
  'coursera.org',
  'www.credly.com',
  'www.udemy.com',
  'twitter.com',
  'x.com',
  'www.facebook.com',
  'www.instagram.com',
  'medium.com',
  'www.nngroup.com',
  'www.khanacademy.org',
  'www.edx.org',
  'ixdf.org',
  'www.interaction-design.org',
  'www.scrum.org',
  'www.pmi.org',
  'www.atlassian.com',
  'help.figma.com',
  'www.w3.org',
  'www.peoplecert.org',
]);
const BLOCKED_STATUSES = new Set([401, 403, 429, 999]);
const IGNORED_HOSTS = new Set(['developerdojo.org', 'www.developerdojo.org', 'localhost', 'example.com', 'www.example.com']);

const repoRoot = resolve(import.meta.dirname, '..');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** Map of url -> sorted list of repo-relative files that mention it. */
async function collectUrls() {
  const found = new Map();
  const add = (url, file) => {
    const clean = url.replace(/[).,;:!?'"\]>]+$/u, '');
    let parsed;
    try {
      parsed = new URL(clean);
    } catch {
      return;
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return;
    if (IGNORED_HOSTS.has(parsed.hostname)) return;
    const files = found.get(clean) ?? new Set();
    files.add(relative(repoRoot, file));
    found.set(clean, files);
  };

  const resourceFiles = (await walk(join(repoRoot, 'src/content/resources'))).filter((f) => f.endsWith('.yaml'));
  for (const file of resourceFiles) {
    const text = await readFile(file, 'utf8');
    const match = /^url:\s*"?([^"\s]+)"?\s*$/mu.exec(text);
    if (!match) throw new Error(`No url: field in ${relative(repoRoot, file)}`);
    add(match[1], file);
  }
  for (const dir of ['src/content/library', 'src/content/tracks']) {
    let files;
    try {
      files = (await walk(join(repoRoot, dir))).filter((f) => /\.mdx?$/u.test(f));
    } catch (error) {
      if (error && error.code === 'ENOENT') continue;
      throw error;
    }
    for (const file of files) {
      const text = await readFile(file, 'utf8');
      for (const match of text.matchAll(/https?:\/\/[^\s<>"'`]+/gu)) add(match[0], file);
    }
  }
  return found;
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const hostNextSlot = new Map();
/** Reserve the next request slot for a host so one host never sees a burst. */
async function waitForHost(host) {
  const now = Date.now();
  const slot = Math.max(now, hostNextSlot.get(host) ?? 0);
  hostNextSlot.set(host, slot + PER_HOST_GAP_MS);
  if (slot > now) await sleep(slot - now);
}

async function request(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml,*/*;q=0.8', 'accept-language': 'en-US,en;q=0.9' },
    });
    await response.body?.cancel();
    return { status: response.status, finalUrl: response.url };
  } finally {
    clearTimeout(timer);
  }
}

/** One attempt: HEAD first, GET when HEAD is refused or errors. Returns { status } or { error }. */
async function attempt(url) {
  try {
    const head = await request(url, 'HEAD');
    if (head.status < 400) return head;
    if ([404, 410].includes(head.status)) {
      // Some servers answer HEAD 404 but GET 200; confirm before calling it dead.
      const get = await request(url, 'GET');
      return get;
    }
    return await request(url, 'GET');
  } catch (headError) {
    try {
      return await request(url, 'GET');
    } catch (getError) {
      const cause = getError?.cause?.code ?? getError?.name ?? 'error';
      return { error: `${cause}: ${getError?.message ?? headError?.message ?? 'request failed'}` };
    }
  }
}

async function checkYouTube(url) {
  const oembed = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`;
  for (let tryNumber = 0; tryNumber <= RETRIES; tryNumber += 1) {
    await waitForHost('www.youtube.com');
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const response = await fetch(oembed, { signal: controller.signal, headers: { 'user-agent': USER_AGENT } });
        if (response.status === 200) {
          const body = await response.json();
          return { verdict: 'ok', detail: `oEmbed: ${body.title} (${body.author_name})` };
        }
        if ([401, 403, 404].includes(response.status)) {
          return { verdict: 'broken', detail: `oEmbed HTTP ${response.status} (removed, private or embedding disabled)` };
        }
        if (tryNumber === RETRIES) return { verdict: 'broken', detail: `oEmbed HTTP ${response.status}` };
      } finally {
        clearTimeout(timer);
      }
    } catch (error) {
      if (tryNumber === RETRIES) return { verdict: 'broken', detail: `oEmbed ${error?.name ?? 'error'}: ${error?.message ?? ''}` };
    }
    await sleep(1500 * (tryNumber + 1));
  }
  return { verdict: 'broken', detail: 'oEmbed failed' };
}

async function checkUrl(url) {
  const parsed = new URL(url);
  const host = parsed.hostname;
  if (/(^|\.)youtube\.com$/u.test(host) && /^\/(watch|embed|shorts)/u.test(parsed.pathname)) return checkYouTube(url);
  if (host === 'youtu.be') return checkYouTube(url);

  let last = { error: 'not attempted' };
  for (let tryNumber = 0; tryNumber <= RETRIES; tryNumber += 1) {
    await waitForHost(host);
    last = await attempt(url);
    if (last.status !== undefined && last.status < 400) {
      const moved = last.finalUrl && last.finalUrl.replace(/\/$/u, '') !== url.replace(/\/$/u, '');
      return { verdict: 'ok', detail: moved ? `HTTP ${last.status}, redirected to ${last.finalUrl}` : `HTTP ${last.status}` };
    }
    if (last.status !== undefined && [404, 410].includes(last.status)) break;
    if (last.status !== undefined && BLOCKED_STATUSES.has(last.status) && BOT_BLOCKERS.has(host)) break;
    await sleep(1500 * (tryNumber + 1));
  }
  if (last.status !== undefined && BLOCKED_STATUSES.has(last.status) && BOT_BLOCKERS.has(host)) {
    return { verdict: 'unverified', detail: `HTTP ${last.status} from a known bot-blocking host` };
  }
  if (last.status !== undefined) return { verdict: 'broken', detail: `HTTP ${last.status}` };
  // Bot-blocking hosts also drop the connection or the HTTP/2 session instead of answering.
  if (BOT_BLOCKERS.has(host)) return { verdict: 'unverified', detail: `${last.error} (known bot-blocking host)` };
  return { verdict: 'broken', detail: last.error };
}

async function main() {
  const found = await collectUrls();
  const urls = [...found.keys()].sort();
  if (urls.length === 0) throw new Error('No external links found; the content paths are probably wrong.');
  console.log(`Checking ${urls.length} external links (concurrency ${CONCURRENCY}, ${PER_HOST_GAP_MS} ms per host).`);

  const results = new Array(urls.length);
  let next = 0;
  const worker = async () => {
    while (next < urls.length) {
      const index = next;
      next += 1;
      const url = urls[index];
      try {
        results[index] = { url, ...(await checkUrl(url)) };
      } catch (error) {
        results[index] = { url, verdict: 'broken', detail: `checker error: ${error?.message ?? error}` };
      }
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, CONCURRENCY) }, worker));

  const by = (verdict) => results.filter((r) => r.verdict === verdict);
  const broken = by('broken');
  const unverified = by('unverified');
  const redirected = by('ok').filter((r) => r.detail.includes('redirected to'));
  const lines = [
    '# External link check',
    '',
    `Run: ${new Date().toISOString()}`,
    '',
    `Checked ${results.length} links: ${by('ok').length} ok, ${broken.length} broken, ${unverified.length} unverified (bot-blocking hosts), ${redirected.length} redirected.`,
    '',
  ];
  const section = (title, rows, withFiles) => {
    if (rows.length === 0) return;
    lines.push(`## ${title}`, '', '| URL | Result | Used in |', '| --- | --- | --- |');
    for (const row of rows) {
      const files = [...(found.get(row.url) ?? [])].sort().map((f) => `\`${f}\``).join('<br>');
      lines.push(`| ${row.url} | ${row.detail.replaceAll('|', '/')} | ${withFiles ? files : ''} |`);
    }
    lines.push('');
  };
  section('Broken links (fix or replace)', broken, true);
  section('Unverified (host blocks automated requests; spot-check by hand)', unverified, true);
  section('Redirected (update to the final URL when convenient)', redirected, true);
  if (broken.length === 0) lines.push('No broken links.', '');
  const report = lines.join('\n');
  await writeFile(REPORT, report, 'utf8');
  console.log(report);
  process.exit(broken.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(`check-external-links failed to run: ${error?.stack ?? error}`);
  process.exit(2);
});
