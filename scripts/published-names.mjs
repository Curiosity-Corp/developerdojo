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

/**
 * One case-insensitive pattern per name. Between its words any run of spaces, hyphens, underscores or dots
 * (or nothing) matches; before and after it there must be no letter or digit, so a name is not found
 * inside a longer word.
 */
export function compileDenylist(names) {
  return names.map((name) => ({
    name,
    pattern: new RegExp(`(?<![\\p{L}\\p{N}])${name.split(' ').join('[\\s._-]*')}(?![\\p{L}\\p{N}])`, 'iu'),
  }));
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

/** Every denylisted name in a text, each with the 1-based line of its first match. */
export function findNames(text, matchers) {
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

/**
 * Scan directories: every file path (relative to the directory, so a route slug counts) and the text of
 * every text file. Returns one finding per file, name and place.
 */
export async function scanDirectories(dirs, matchers) {
  const findings = [];
  let scanned = 0;
  for (const dir of dirs) {
    for (const file of await filesUnder(dir)) {
      scanned += 1;
      const shown = relative(process.cwd(), file).split(sep).join('/');
      const relativePath = relative(dir, file).split(sep).join('/');
      for (const { name } of findNames(relativePath, matchers)) findings.push({ file: shown, name, where: 'path' });
      const dot = file.lastIndexOf('.');
      if (dot === -1 || !TEXT_EXTENSIONS.has(file.slice(dot).toLowerCase())) continue;
      let text;
      try {
        text = await readFile(file, 'utf8');
      } catch (error) {
        throw new Error(`Cannot read ${file}: ${error.message}`);
      }
      for (const { name, line } of findNames(text, matchers)) findings.push({ file: shown, name, where: `line ${line}` });
    }
  }
  return { scanned, findings };
}
