// Published-name gate (developerdojo#129): no denylisted name may appear in what the site publishes.
// The denylist is scripts/published-names-denylist.txt (outside every published directory). The CLI is
// scripts/check-published-names.mjs; tests/published-names.test.ts covers the matcher and scans the sources.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const DENYLIST_PATH = fileURLToPath(new URL('./published-names-denylist.txt', import.meta.url));

/** Files whose text is read. Every other file (images, fonts, archives) is checked by its path only. */
const TEXT_EXTENSIONS = new Set([
  '.astro', '.css', '.csv', '.htm', '.html', '.js', '.json', '.md', '.mdx', '.mjs', '.mts', '.svg', '.ts',
  '.tsx', '.txt', '.webmanifest', '.xml', '.yaml', '.yml',
]);
const SKIPPED_DIRECTORIES = new Set(['node_modules', '.git']);
const WORD = /^[a-z0-9]+$/;
const MIN_NAME_LENGTH = 4;

/**
 * Parse the denylist text: one name per line, words separated by spaces, "#" starts a comment line.
 * Throws on a line that is not lower-case words, on a name shorter than four letters and on a duplicate,
 * so a mistake in the list fails loudly instead of silently matching nothing (or everything).
 */
export function parseDenylist(text) {
  const names = [];
  const seen = new Set();
  text.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) return;
    const words = line.split(/\s+/);
    if (!words.every((word) => WORD.test(word))) {
      throw new Error(`Denylist line ${index + 1}: use lower-case letters and digits separated by spaces.`);
    }
    const key = words.join('');
    if (key.length < MIN_NAME_LENGTH) {
      throw new Error(`Denylist line ${index + 1}: a name needs at least ${MIN_NAME_LENGTH} letters.`);
    }
    if (seen.has(key)) throw new Error(`Denylist line ${index + 1}: duplicate name.`);
    seen.add(key);
    names.push(words.join(' '));
  });
  return names;
}

/** Files are read this many at a time; the order of findings does not depend on it. */
const READ_CONCURRENCY = 16;
/** Before and after a name there must be no letter or digit, so a name is not found inside a longer word. */
const NOT_AFTER_WORD = '(?<![\\p{L}\\p{N}])';
const NOT_BEFORE_WORD = '(?![\\p{L}\\p{N}])';

/** A name's body: between its words any run of spaces, hyphens, underscores or dots (or nothing) matches. */
function nameBody(name) {
  return name.split(' ').join('[\\s._-]*');
}

/**
 * One case-insensitive pattern per name, used to say which name matched and on which line.
 * Names are lower-case letters, digits and single spaces (parseDenylist), so they need no escaping.
 */
export function compileDenylist(names) {
  return names.map((name) => ({
    name,
    pattern: new RegExp(`${NOT_AFTER_WORD}${nameBody(name)}${NOT_BEFORE_WORD}`, 'iu'),
  }));
}

/**
 * A filter that matches every text in which any per-name pattern matches, and possibly a few more:
 * - the name bodies are alternatives, and the engine backtracks into every alternative before it gives up
 *   at a position, so the alternation matches wherever one of the bodies does;
 * - it keeps the trailing boundary but drops the leading one, which only widens what it matches;
 * - it runs over the whole text, where \s also crosses line breaks, which again only widens it.
 * So a text it does not match holds no name. It keeps the same 'iu' flags as the per-name patterns: without
 * 'u', case folding differs (for example the long s and the Kelvin sign) and the filter could miss a name.
 * Dropping the leading lookbehind halved the filter's time on the CI runner (417 ms to 201 ms over the
 * published sources, pipeline 159616). Built from the names, as compileDenylist builds each per-name
 * pattern, once per matcher list.
 */
const anyNamePatterns = new WeakMap();
function anyNamePattern(matchers) {
  let pattern = anyNamePatterns.get(matchers);
  if (pattern === undefined) {
    const bodies = matchers.map(({ name }) => nameBody(name)).join('|');
    pattern = new RegExp(`(?:${bodies})${NOT_BEFORE_WORD}`, 'iu');
    anyNamePatterns.set(matchers, pattern);
  }
  return pattern;
}

export async function loadDenylist(path = DENYLIST_PATH) {
  let text;
  try {
    text = await readFile(path, 'utf8');
  } catch (error) {
    throw new Error(`Cannot read the published-name denylist at ${path}: ${error.message}`);
  }
  const names = parseDenylist(text);
  if (names.length === 0) throw new Error(`The published-name denylist at ${path} has no names.`);
  return compileDenylist(names);
}

/**
 * Every denylisted name in a text, each with the 1-based line of its first match. One pass of the combined
 * pattern clears a clean text (nearly every file); only a text it matches gets the exact per-name, per-line
 * search, so the result is the same as searching every name on every line.
 */
export function findNames(text, matchers) {
  if (matchers.length === 0 || !anyNamePattern(matchers).test(text)) return [];
  const found = [];
  const lines = text.split(/\r?\n/);
  for (const { name, pattern } of matchers) {
    const line = lines.findIndex((candidate) => pattern.test(candidate));
    if (line !== -1) found.push({ name, line: line + 1 });
  }
  return found;
}

async function filesUnder(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    throw new Error(`Cannot read directory ${dir}: ${error.message}`);
  }
  const out = [];
  for (const entry of entries) {
    if (SKIPPED_DIRECTORIES.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await filesUnder(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** The findings for one file: its path relative to the scanned directory, then its text if it is a text file. */
async function scanFile(dir, file, matchers) {
  const findings = [];
  const shown = relative(process.cwd(), file).split(sep).join('/');
  const relativePath = relative(dir, file).split(sep).join('/');
  for (const { name } of findNames(relativePath, matchers)) findings.push({ file: shown, name, where: 'path' });
  const dot = file.lastIndexOf('.');
  if (dot === -1 || !TEXT_EXTENSIONS.has(file.slice(dot).toLowerCase())) return findings;
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch (error) {
    throw new Error(`Cannot read ${file}: ${error.message}`);
  }
  for (const { name, line } of findNames(text, matchers)) findings.push({ file: shown, name, where: `line ${line}` });
  return findings;
}

/**
 * Scan directories: every file path (relative to the directory, so a route slug counts) and the text of
 * every text file. Returns one finding per file, name and place, in directory-walk order.
 */
export async function scanDirectories(dirs, matchers) {
  const jobs = [];
  for (const dir of dirs) {
    for (const file of await filesUnder(dir)) jobs.push({ dir, file });
  }
  const perFile = new Array(jobs.length);
  let next = 0;
  async function worker() {
    while (next < jobs.length) {
      const index = next;
      next += 1;
      perFile[index] = await scanFile(jobs[index].dir, jobs[index].file, matchers);
    }
  }
  await Promise.all(Array.from({ length: Math.min(READ_CONCURRENCY, jobs.length) }, worker));
  return { scanned: jobs.length, findings: perFile.flat() };
}
