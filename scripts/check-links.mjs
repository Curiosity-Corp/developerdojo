// Link check over the BUILT site: every internal href/src/srcset in dist/**/*.html must resolve to a
// file in dist (and, when it has a #fragment, to an id in the target page). External links are listed
// but never fetched (the site makes no outside calls and CI must not depend on other hosts).
// Usage: node scripts/check-links.mjs [dist]
import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist');
const ORIGIN = 'https://developerdojo.org';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

/** Map a URL path to the file GitHub Pages would serve for it, or undefined. */
async function resolveTarget(pathname) {
  const decoded = decodeURIComponent(pathname);
  const base = join(root, decoded);
  if (base !== root && !base.startsWith(root + sep)) return undefined;
  for (const candidate of [base, join(base, 'index.html')]) {
    if (await exists(candidate)) return candidate;
  }
  return undefined;
}

const idCache = new Map();
async function idsOf(file) {
  const cached = idCache.get(file);
  if (cached) return cached;
  const html = await readFile(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid=["']([^"']+)["']/g)].map((m) => m[1]));
  idCache.set(file, ids);
  return ids;
}

function refsIn(html) {
  const refs = [];
  for (const m of html.matchAll(/\s(?:href|src|poster)=["']([^"']*)["']/g)) refs.push(m[1]);
  for (const m of html.matchAll(/\ssrcset=["']([^"']*)["']/g)) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url) refs.push(url);
    }
  }
  return refs;
}

const files = (await walk(root)).filter((f) => extname(f) === '.html');
const problems = [];
let checked = 0;
const external = new Set();

for (const file of files) {
  const page = '/' + file.slice(root.length + 1).replace(/index\.html$/, '').replace(/\\/g, '/');
  const html = await readFile(file, 'utf8');
  for (const ref of refsIn(html)) {
    if (!ref || /^(mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
    let url;
    try {
      url = new URL(ref, ORIGIN + page);
    } catch {
      problems.push(`${page}: unparsable link "${ref}"`);
      continue;
    }
    if (url.origin !== ORIGIN) {
      external.add(url.href);
      continue;
    }
    checked += 1;
    const target = await resolveTarget(url.pathname);
    if (!target) {
      problems.push(`${page}: broken link "${ref}"`);
      continue;
    }
    if (url.hash.length > 1 && extname(target) === '.html') {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!(await idsOf(target)).has(id)) problems.push(`${page}: missing anchor "${ref}"`);
    }
  }
}

console.log(`Checked ${checked} internal references across ${files.length} pages; ${external.size} distinct external links not fetched.`);
if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of [...new Set(problems)]) console.error(`  ${p}`);
  process.exit(1);
}
console.log('All internal links resolve.');
