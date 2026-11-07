// Builds the static search index into dist/pagefind after `astro build`.
//   1. Every built page is indexed (only <main> counts: the layout marks it data-pagefind-body).
//   2. Each learning resource becomes its own search record that links to its card on
//      /library/resources, because resources have no page of their own.
// Usage: node scripts/build-search.mjs [dist]
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import * as pagefind from 'pagefind';
import { parse } from 'yaml';

const dist = resolve(process.argv[2] ?? 'dist');
const resourcesDir = resolve('src/content/resources');

async function resourceFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await resourceFiles(full)));
    else if (entry.name.endsWith('.yaml')) out.push(full);
  }
  return out;
}

/** Same anchor the resources page puts on each card: the id with "/" turned into "-". */
function resourceAnchor(id) {
  return `r-${id.replace(/[^a-z0-9]+/g, '-')}`;
}

const { index, errors: createErrors } = await pagefind.createIndex({ forceLanguage: 'en' });
if (!index) throw new Error(`Pagefind could not create an index: ${createErrors.join('; ')}`);

const added = await index.addDirectory({ path: dist });
if (added.errors.length > 0) throw new Error(`Pagefind could not index ${dist}: ${added.errors.join('; ')}`);

let resourceCount = 0;
const vocabulary = new Map();
function rememberWords(value) {
  for (const word of String(value ?? '').toLowerCase().match(/[a-z][a-z0-9]*/g) ?? []) {
    if (word.length >= 4 && word.length <= 24 && !/\d/.test(word)) {
      vocabulary.set(word, (vocabulary.get(word) ?? 0) + 1);
    }
  }
}

async function rememberPageTitles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await rememberPageTitles(full);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(full, 'utf8');
      const title = html.match(/<title(?:\s[^>]*)?>([^<]*)<\/title>/i)?.[1];
      if (title) rememberWords(title.replace(/&(?:[a-z]+|#\d+);/gi, ' '));
    }
  }
}

await rememberPageTitles(dist);
for (const file of await resourceFiles(resourcesDir)) {
  const id = file.slice(resourcesDir.length + 1).replace(/\\/g, '/').replace(/\.yaml$/, '');
  let data;
  try {
    data = parse(await readFile(file, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read resource ${id}: ${error instanceof Error ? error.message : String(error)}`);
  }
  const skills = Array.isArray(data.skills) ? data.skills.map((skill) => String(skill).replace(/-/g, ' ')) : [];
  rememberWords([data.title, data.provider, ...skills].join(' '));
  const record = await index.addCustomRecord({
    url: `/library/resources/#${resourceAnchor(id)}`,
    content: [data.title, data.provider, data.summary, skills.join(', '), data.format, data.cost].join('. '),
    language: 'en',
    meta: { title: String(data.title), group: `${data.provider} · learning resource` },
  });
  if (record.errors.length > 0) throw new Error(`Pagefind rejected resource ${id}: ${record.errors.join('; ')}`);
  resourceCount += 1;
}

const written = await index.writeFiles({ outputPath: join(dist, 'pagefind') });
if (written.errors.length > 0) throw new Error(`Pagefind could not write the index: ${written.errors.join('; ')}`);
await pagefind.close();
// Pagefind has occasionally returned success while leaving an empty metadata file in CI.
// Fail the build rather than publish a site whose search cannot initialise.
const entryPath = join(dist, 'pagefind', 'pagefind-entry.json');
let entry;
try {
  entry = JSON.parse(await readFile(entryPath, 'utf8'));
} catch (error) {
  throw new Error(`Pagefind wrote invalid search metadata at ${entryPath}`, { cause: error });
}
if (!entry.languages?.en?.hash || !(entry.languages.en.page_count > 0)) {
  throw new Error(`Pagefind wrote incomplete English search metadata at ${entryPath}`);
}
// The browser downloads this compact list only when an exact search has no results.
// Frequent words come first as a deterministic tie-breaker for equally close corrections.
const words = [...vocabulary].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([word]) => word);
await writeFile(join(dist, 'search-vocabulary.json'), JSON.stringify(words));
console.log(`[search] indexed ${added.page_count} pages and ${resourceCount} resources into ${join(dist, 'pagefind')}`);
