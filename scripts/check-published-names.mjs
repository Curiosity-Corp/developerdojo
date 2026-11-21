// Fails when a name from scripts/published-names-denylist.txt appears in a published file's path or text
// (developerdojo#129). CI runs it on the built site: node scripts/check-published-names.mjs dist
// Usage: node scripts/check-published-names.mjs <dir> [<dir> ...]
import { loadDenylist, scanDirectories } from './published-names.mjs';

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error('Usage: node scripts/check-published-names.mjs <dir> [<dir> ...]');
  process.exit(2);
}

try {
  const matchers = await loadDenylist();
  const { scanned, findings } = await scanDirectories(dirs, matchers);
  if (findings.length > 0) {
    console.error(`Published-name check failed: ${findings.length} finding(s) in ${dirs.join(', ')}.`);
    for (const { file, name, where } of findings) console.error(`  ${file} (${where}): "${name}"`);
    console.error('Remove the name from the page (see docs/handbook.md, section 11). Never take it off the denylist.');
    process.exit(1);
  }
  console.log(`Published-name check passed: ${scanned} files in ${dirs.join(', ')}, ${matchers.length} denylisted names.`);
} catch (error) {
  console.error(`Published-name check could not run: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(2);
}
