import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  answerId,
  cellId,
  cleanLead,
  emptyDraft,
  escapeCell,
  hasContent,
  parseDraft,
  parseTemplate,
  renderTemplateMarkdown,
  splitRow,
  tickId,
  type TableBlock,
} from '../src/lib/template-form';

const downloads = join('public', 'templates');
const downloadNames = readdirSync(downloads)
  .filter((name) => name.endsWith('.md'))
  .map((name) => name.replace(/\.md$/, ''));
const libraryDir = join('src', 'content', 'library');
const read = (name: string): string => readFileSync(join(downloads, `${name}.md`), 'utf8');

describe('reading a table line', () => {
  it('splits cells and keeps an escaped bar as text', () => {
    expect(splitRow('| a | b \\| c |  |')).toEqual(['a', 'b | c', '']);
    expect(splitRow('|  | Your answer |')).toEqual(['', 'Your answer']);
  });
  it('escapes bars and line breaks when writing a cell', () => {
    expect(escapeCell(' a | b\nc ')).toBe('a \\| b<br>c');
  });
  it('tidies a lead paragraph', () => {
    expect(cleanLead('Your Product | TOUCH POINTS | Week 2. List every moment. Delete this note when you start.')).toBe(
      'Week 2. List every moment.',
    );
  });
});

describe('the eight template downloads become forms', () => {
  it('has eight numbered downloads', () => {
    expect(downloadNames.filter((name) => /^template-\d-/.test(name))).toHaveLength(8);
  });

  for (const name of downloadNames.filter((n) => /^template-\d-/.test(n))) {
    it(`${name} has a title and at least one field`, () => {
      const model = parseTemplate(read(name));
      expect(model.title.length).toBeGreaterThan(0);
      expect(model.sections.length).toBeGreaterThan(0);
      const inputs = model.sections.flatMap((section) => section.blocks).filter((block) => block.kind !== 'note');
      expect(inputs.length).toBeGreaterThan(0);
    });
  }

  it('reads the change record: labelled tables and the after-merge ticks', () => {
    const model = parseTemplate(read('template-8-change-record'));
    expect(model.sections.map((section) => section.heading)).toEqual([
      'Summary',
      'Change record',
      'Risk assessment (normal and emergency)',
      'Recovery plan (fix forward)',
      'How it was checked',
      'After merge',
      'Emergency only: active harm',
      'Capstone sign-off (mentor as change advisory board)',
    ]);
    const record = model.sections[1]?.blocks[0] as TableBlock;
    expect(record.labelled).toBe(true);
    expect(record.inputCols).toEqual([1]);
    expect(record.rows).toHaveLength(5);
    const after = model.sections[5]?.blocks[0];
    expect(after?.kind).toBe('checklist');
    expect(after?.kind === 'checklist' && after.items).toHaveLength(4);
    // The "Summary" table has one column and blank rows: free rows.
    const summary = model.sections[0]?.blocks[0] as TableBlock;
    expect(summary.labelled).toBe(false);
  });

  it('keeps the escaped bars of the decision record and its pre-heading table', () => {
    const model = parseTemplate(read('template-6-oss-decision-record'));
    expect(model.sections[0]?.heading).toBe('Details');
    const head = model.sections[0]?.blocks[0] as TableBlock;
    expect(head.rows[1]?.[1]).toContain('Proposed | Accepted');
    expect(head.inputCols).toEqual([1]);
    expect(model.sections.map((section) => section.heading)).toContain('7. Exit plan');
  });

  it('leaves out the cover, the how-to text and the computed roadmap grid', () => {
    for (const name of ['template-3-product-repository-map', 'template-5-epic-roadmap', 'template-2-touch-points-and-journey-maps']) {
      const headings = parseTemplate(read(name)).sections.map((section) => section.heading.toLowerCase());
      expect(headings).not.toContain('cover');
      expect(headings).not.toContain('how to fill');
      expect(headings).not.toContain('roadmap grid');
    }
  });

  it('turns the epic quality check into tick boxes and the catalogue search answers into questions', () => {
    const roadmap = parseTemplate(read('template-5-epic-roadmap'));
    const quality = roadmap.sections.find((section) => section.heading === 'Epic quality check')?.blocks[0];
    expect(quality?.kind === 'questions' && quality.asChecks).toBe(true);
    expect(quality?.kind === 'questions' && quality.items).toHaveLength(7);
    const catalogue = parseTemplate(read('template-7-service-catalogue-entry'));
    const search = catalogue.sections.find((section) => section.heading === 'Search answers')?.blocks[0];
    expect(search?.kind === 'questions' && search.asChecks).toBe(false);
  });

  it('keeps the prefilled repository row as a starting row', () => {
    const model = parseTemplate(read('template-3-product-repository-map'));
    const table = model.sections[0]?.blocks[0] as TableBlock;
    expect(table.labelled).toBe(false);
    expect(table.startRows).toBe(1);
    expect(table.rows[0]?.[0]).toContain('product group');
  });

  it('treats extra catalogue columns as context, not as inputs', () => {
    const model = parseTemplate(read('template-7-service-catalogue-entry'));
    const table = model.sections[0]?.blocks[0] as TableBlock;
    expect(table.headers).toEqual(['Field', 'Your value', 'Catalogue schema today', 'Help']);
    expect(table.inputCols).toEqual([1]);
  });

  it('gives journeys one field per extra column', () => {
    const model = parseTemplate(read('template-2-touch-points-and-journey-maps'));
    const user = model.sections.find((section) => section.heading === 'User journey')?.blocks[0] as TableBlock;
    expect(user.labelled).toBe(true);
    expect(user.inputCols).toHaveLength(6);
  });
});

describe('every fillable library page points at a real download', () => {
  const pages = readdirSync(libraryDir).filter((name) => name.startsWith('template-') && name.endsWith('.md'));
  const fillable = pages.flatMap((name) => {
    const text = readFileSync(join(libraryDir, name), 'utf8');
    const match = /^fillable:\s*"?([a-z0-9-]+)"?\s*$/m.exec(text);
    return match ? [{ page: name, download: match[1] ?? '' }] : [];
  });

  it('has a form on exactly the eight pages that offer one of the eight downloads', () => {
    expect(fillable).toHaveLength(8);
    expect(new Set(fillable.map((item) => item.download)).size).toBe(8);
  });

  for (const item of fillable) {
    it(`${item.page} uses ${item.download}`, () => {
      expect(downloadNames).toContain(item.download);
      const text = readFileSync(join(libraryDir, item.page), 'utf8');
      expect(text).toContain(`/templates/${item.download}.md`);
    });
  }
});

describe('writing the filled-in template', () => {
  const model = parseTemplate(read('template-8-change-record'));

  it('writes the blank template back as Markdown with the same headings', () => {
    const md = renderTemplateMarkdown(model, emptyDraft(), '2026-11-04');
    expect(md.startsWith('# Change Record\n')).toBe(true);
    expect(md).toContain('Filled in on 2026-11-04');
    expect(md).toContain('## Recovery plan (fix forward)');
    expect(md).toContain('- [ ] Tracker issue closed');
  });

  it('puts typed answers in the right cell and escapes bars and line breaks', () => {
    const draft = emptyDraft();
    draft.values[cellId(1, 0, 0, 1)] = 'normal | label change::normal';
    draft.values[cellId(1, 0, 3, 1)] = 'Maya\nthe product owner';
    draft.ticks[tickId(5, 0, 3)] = true;
    const md = renderTemplateMarkdown(model, draft, '2026-11-04');
    expect(md).toContain('| normal \\| label change::normal |');
    expect(md).toContain('Maya<br>the product owner');
    expect(md).toContain('- [x] Tracker issue closed');
    expect(md).toContain('- [ ] GitOps controller synced and healthy');
  });

  it('writes only the free rows that have something in them', () => {
    const personas = parseTemplate(read('template-1-personas-and-demographics'));
    const index = personas.sections.findIndex((section) => section.heading === 'Evidence log');
    const draft = emptyDraft();
    draft.rows[`${index}-0`] = 4;
    draft.values[cellId(index, 0, 0, 0)] = '2026-03-02';
    draft.values[cellId(index, 0, 0, 2)] = 'Reaching a cup is slow';
    draft.values[cellId(index, 0, 2, 1)] = 'Interview C3';
    const md = renderTemplateMarkdown(personas, draft, '2026-11-04');
    const rows = md.split('\n').filter((line) => line.startsWith('| 2026') || line.includes('Interview C3'));
    expect(rows).toHaveLength(2);
    expect(md).toContain('| 2026-03-02 |  | Reaching a cup is slow |  |');
  });

  it('keeps one empty row when a free table has no answers', () => {
    const personas = parseTemplate(read('template-1-personas-and-demographics'));
    const md = renderTemplateMarkdown(personas, emptyDraft(), '2026-11-04');
    const evidence = md.slice(md.indexOf('## Evidence log'));
    expect(evidence.split('\n').filter((line) => line.startsWith('|'))).toHaveLength(3);
  });

  it('writes written questions and tick-box checks', () => {
    const catalogue = parseTemplate(read('template-7-service-catalogue-entry'));
    const index = catalogue.sections.findIndex((section) => section.heading === 'Search answers');
    const draft = emptyDraft();
    draft.values[answerId(index, 0, 1)] = 'The slug and the owner.';
    const md = renderTemplateMarkdown(catalogue, draft, '2026-11-04');
    expect(md).toContain('**2. ');
    expect(md).toContain('The slug and the owner.');
    expect(md).toContain('(no answer yet)');

    const roadmap = parseTemplate(read('template-5-epic-roadmap'));
    const q = roadmap.sections.findIndex((section) => section.heading === 'Epic quality check');
    const ticked = emptyDraft();
    ticked.ticks[tickId(q, 0, 0)] = true;
    const text = renderTemplateMarkdown(roadmap, ticked, '2026-11-04');
    expect(text).toMatch(/- \[x\] Does it touch more than one part/);
    expect(text).toMatch(/- \[ \] Does it name the person/);
  });
});

describe('the saved draft', () => {
  it('keeps good values and drops everything else', () => {
    const draft = parseDraft({
      values: { 't1-0-0-1': 'ok', 'bad key': 'x', 't1-0-1-1': 5, 'q2-0-0': 'answer' },
      rows: { '1-0': 5, '2-0': 0, '3-0': 'many', '4-0': 999 },
      ticks: { 'k1-0-0': true, 'k1-0-1': 'yes' },
    });
    expect(draft.values).toEqual({ 't1-0-0-1': 'ok', 'q2-0-0': 'answer' });
    expect(draft.rows).toEqual({ '1-0': 5 });
    expect(draft.ticks).toEqual({ 'k1-0-0': true });
  });
  it('gives an empty draft for damaged data', () => {
    for (const bad of [null, undefined, 3, 'text', [], { values: 5 }]) expect(hasContent(parseDraft(bad))).toBe(false);
  });
  it('cuts very long text', () => {
    const draft = parseDraft({ values: { 't1-0-0-1': 'x'.repeat(10_000) } });
    expect(draft.values['t1-0-0-1']).toHaveLength(4000);
  });
  it('knows whether anything was typed', () => {
    expect(hasContent(parseDraft({ values: { 't1-0-0-1': '  ' } }))).toBe(false);
    expect(hasContent(parseDraft({ values: { 't1-0-0-1': 'a' } }))).toBe(true);
    expect(hasContent(parseDraft({ ticks: { 'k1-0-0': true } }))).toBe(true);
  });
});
