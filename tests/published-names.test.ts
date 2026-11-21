import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  compileDenylist,
  findNames,
  loadDenylist,
  parseDenylist,
  scanDirectories,
} from '../scripts/published-names.mjs';

// Fictional names only: the real denylist is read from its file and never repeated here.
const matchers = compileDenylist(['acme widget', 'zorblax', 'brightpath']);
const names = (text: string): string[] => findNames(text, matchers).map((finding) => finding.name);

describe('published-name matcher', () => {
  it('finds a spaced name in every spacing and letter case', () => {
    for (const text of ['AcmeWidget', 'Acme Widget', 'acme-widget', 'ACME_WIDGET', 'acme.widget', 'see acme  widget.']) {
      expect(names(text), text).toEqual(['acme widget']);
    }
  });

  it('finds a name in a route slug and in markdown link targets', () => {
    expect(names('/library/case-study-zorblax-epics/')).toEqual(['zorblax']);
    expect(names('[page](/library/zorblax_map)')).toEqual(['zorblax']);
  });

  it('matches a one-word name only in its joined spelling', () => {
    expect(names('BrightPath')).toEqual(['brightpath']);
    expect(names('a bright path ahead')).toEqual([]);
  });

  it('does not match inside a longer word', () => {
    expect(names('zorblaxian acmewidgetry preacme widget')).toEqual([]);
  });

  it('finds every name when names overlap in the text', () => {
    const overlapping = compileDenylist(['acme', 'acme widget', 'widget co']);
    expect(findNames('Acme Widget Co', overlapping).map((f) => f.name)).toEqual(['acme', 'acme widget', 'widget co']);
  });

  it('finds a name the filter reaches only through Unicode case folding', () => {
    // U+017F (long s) folds to "s" under the 'iu' flags the per-name patterns use; the filter must agree.
    expect(findNames('Mi\u017Fter', compileDenylist(['mister']))).toEqual([{ name: 'mister', line: 1 }]);
  });

  it('does not join a name across a line break', () => {
    expect(names('acme\nwidget')).toEqual([]);
    expect(names('acme\nacme widget')).toEqual(['acme widget']);
  });

  it('finds nothing with an empty matcher list', () => {
    expect(findNames('zorblax', [])).toEqual([]);
  });

  it('reports the line of the first match', () => {
    expect(findNames('one\ntwo\nZorblax three\nzorblax', matchers)).toEqual([{ name: 'zorblax', line: 3 }]);
  });
});

describe('denylist parsing', () => {
  it('reads names and skips comments and blank lines', () => {
    expect(parseDenylist('# comment\n\nacme  widget\nzorblax\n')).toEqual(['acme widget', 'zorblax']);
  });

  it('rejects upper case, punctuation, short names and duplicates', () => {
    expect(() => parseDenylist('Acme')).toThrow(/line 1/);
    expect(() => parseDenylist('acme-widget')).toThrow(/line 1/);
    expect(() => parseDenylist('abc')).toThrow(/at least 4/);
    expect(() => parseDenylist('acme widget\nacmewidget')).toThrow(/duplicate/);
  });

  it('loads the real denylist, which is not empty', async () => {
    expect((await loadDenylist()).length).toBeGreaterThan(0);
  });
});

describe('directory scan', () => {
  let dir = '';
  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), 'published-names-'));
    await mkdir(join(dir, 'library', 'case-study-zorblax-map'), { recursive: true });
    await writeFile(join(dir, 'library', 'case-study-zorblax-map', 'index.html'), '<p>A neutral page.</p>');
    await writeFile(join(dir, 'clean.html'), '<p>Nothing to see.</p>');
    await writeFile(join(dir, 'named.md'), 'line one\nAcme Widget appears here\n');
    await writeFile(join(dir, 'acme-widget.png'), 'not text');
  });
  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('finds names in file paths and in text, and not in clean files', async () => {
    const { scanned, findings } = await scanDirectories([dir], matchers);
    expect(scanned).toBe(4);
    const summary = findings.map((f) => `${relative(dir, resolve(f.file)).split('\\').join('/')} ${f.where} ${f.name}`).sort();
    expect(summary).toEqual([
      'acme-widget.png path acme widget',
      'library/case-study-zorblax-map/index.html path zorblax',
      'named.md line 2 acme widget',
    ]);
  });
});

// Timeout, sized from measurement (developerdojo#129). On the CI runner this scan of 1771 files took about
// 0.8 s (pipelines 159610 and 159616). A busy runner stretched the earlier scan about 3x (about 1.6 s of
// file walk, reads and matching measured in pipeline 159610, against 5.03 s in job 2839429). 8 s covers that
// slowdown with room for the published sources to double. If this gets close to the limit, make the scan
// faster; do not raise the number.
const PUBLISHED_SOURCES_TIMEOUT_MS = 8_000;

describe('published sources', () => {
  it(
    'name nothing on the denylist',
    async () => {
      const root = join(__dirname, '..');
      const { findings } = await scanDirectories([join(root, 'src'), join(root, 'public')], await loadDenylist());
      expect(findings.map((f) => `${f.file} (${f.where})`)).toEqual([]);
    },
    PUBLISHED_SOURCES_TIMEOUT_MS,
  );
});
