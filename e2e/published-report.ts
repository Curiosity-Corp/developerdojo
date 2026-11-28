import { readFileSync } from 'node:fs';
import { expect, type TestInfo } from '@playwright/test';

/**
 * Keeps a report the site publishes equal to what the browser tests measure (#91). The test builds the report from
 * this run; the published copy in public/ must hold the same text, so the page never shows a report that an older
 * run produced. When they differ, the measured text is attached as `<name>` to the run: copy it into the file.
 *
 * `section` names a `## <section>` heading when one file holds the reports of several browser projects; the text under
 * that heading, up to the next `## ` heading at the same level that starts a project section, is compared.
 */
export async function expectPublished(testInfo: TestInfo, file: string, measured: string, name: string, section?: string): Promise<void> {
  let published: string;
  try {
    published = readFileSync(file, 'utf8');
  } catch (error) {
    await testInfo.attach(name, { body: measured, contentType: 'text/markdown' });
    throw new Error('cannot read the published report ' + file + ' (' + (error as Error).message + '); the measured text is attached as ' + name);
  }
  if (section) {
    const start = published.indexOf('\n## ' + section + '\n');
    if (start < 0) throw new Error(file + ' has no "## ' + section + '" section');
    const body = published.slice(start + section.length + 5);
    const end = body.search(/\n## [A-Z][a-z]+ project\n/);
    published = end < 0 ? body : body.slice(0, end + 1);
  }
  const normalise = (text: string): string => text.replace(/\r\n/g, '\n').trim();
  if (normalise(published) !== normalise(measured)) {
    await testInfo.attach(name, { body: measured, contentType: 'text/markdown' });
  }
  expect(normalise(published), file + (section ? ' (' + section + ')' : '') + ' must be what this run measured; the measured text is attached as ' + name).toBe(normalise(measured));
}
