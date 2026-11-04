// Quarterly resource refresh helper. Lists every resource in src/content/resources/**/*.yaml whose
// `verifiedOn` date is older than N days (default 90), grouped by provider, as a markdown checklist.
// It only reads files; it never fetches a link or changes a file. Always exits 0 when it could run,
// because a stale resource is a job for a person, not a broken build.
// Exit codes: 0 the list was printed (it may be empty), 2 the script itself could not run.
// Usage: node scripts/list-stale-resources.mjs [--days 90] [--today 2027-02-01] [--dir src/content/resources]
//        [--report stale-resources.md]
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const DAYS = Number(option('days', '90'));
const TODAY = option('today', new Date().toISOString().slice(0, 10));
const DIR = option('dir', 'src/content/resources');
const REPORT = option('report', '');
const DAY_MS = 24 * 60 * 60 * 1000;

async function yamlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await yamlFiles(path)));
    else if (/\.ya?ml$/.test(entry.name)) out.push(path);
  }
  return out;
}

/** Reads one top-level `key: value` line; strips matching quotes. Enough for these flat files. */
function field(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
  if (!match) return '';
  const value = match[1];
  return /^(["']).*\1$/.test(value) ? value.slice(1, -1) : value;
}

async function main() {
  if (!Number.isFinite(DAYS) || DAYS < 0) throw new Error(`--days must be a number, got ${DAYS}`);
  const today = Date.parse(`${TODAY}T00:00:00Z`);
  if (Number.isNaN(today)) throw new Error(`--today must be YYYY-MM-DD, got ${TODAY}`);

  const files = (await yamlFiles(DIR)).sort();
  const stale = [];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const verifiedOn = field(text, 'verifiedOn');
    const verified = Date.parse(`${verifiedOn}T00:00:00Z`);
    const age = Number.isNaN(verified) ? Infinity : Math.floor((today - verified) / DAY_MS);
    if (age > DAYS) {
      stale.push({
        file: relative(process.cwd(), file),
        provider: field(text, 'provider') || '(no provider)',
        title: field(text, 'title') || '(no title)',
        url: field(text, 'url'),
        verifiedOn: verifiedOn || 'missing',
        age,
      });
    }
  }

  const byProvider = new Map();
  for (const item of stale) {
    if (!byProvider.has(item.provider)) byProvider.set(item.provider, []);
    byProvider.get(item.provider).push(item);
  }

  const lines = [
    `# Stale resources (verifiedOn older than ${DAYS} days, as of ${TODAY})`,
    '',
    `${stale.length} of ${files.length} resources need a fresh check.`,
  ];
  if (stale.length === 0) lines.push('', 'Nothing to do this quarter.');
  for (const provider of [...byProvider.keys()].sort((a, b) => a.localeCompare(b))) {
    lines.push('', `## ${provider}`, '');
    for (const item of byProvider.get(provider)) {
      const age = Number.isFinite(item.age) ? `${item.age} days` : 'date missing';
      lines.push(`- [ ] [${item.title}](${item.url}) · verified ${item.verifiedOn} (${age}) · \`${item.file}\``);
    }
  }
  const report = `${lines.join('\n')}\n`;
  process.stdout.write(report);
  if (REPORT) await writeFile(REPORT, report);
}

main().catch((error) => {
  console.error(`list-stale-resources: ${error.message}`);
  process.exit(2);
});
