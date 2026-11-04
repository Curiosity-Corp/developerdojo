/**
 * Fillable templates. The form on each template page is built from the same Markdown file that the
 * page offers as the blank download (public/templates/template-N-*.md), so the form and the download
 * cannot drift apart. This module is pure (no DOM): it reads that Markdown into a small model, keeps
 * the learner's draft in a safe shape, and writes the filled-in template back out as Markdown.
 *
 * Shapes it understands:
 * - a table with fixed row labels ("Question | Your answer"): one field per row (or per extra column),
 * - a table of free rows (an evidence log): the learner adds rows,
 * - a list of "☐ item" lines: tick boxes,
 * - a numbered list: one answer box per item (or tick boxes, for the epic quality check).
 * Sections that carry no input (cover text, "How to fill") are left out. The page itself explains them.
 */

export const DRAFT_VERSION = 1;
export const MAX_FIELD_LENGTH = 4000;
export const MAX_ROWS = 40;
const MAX_KEYS = 3000;

/** Headings that carry guidance or computed sheets, not answers. */
const SKIP_HEADING = /^(cover|how to fill|roadmap grid)/i;
/** Numbered lists under these headings are yes/no checks, not questions with written answers. */
const CHECK_HEADING = /quality check/i;
/** Header names that mark a column where the learner writes. */
const INPUT_HEADER = /^(your|my)\b/i;

export interface TableBlock {
  kind: 'table';
  /** Short text above the table, if the template has one. */
  lead: string;
  headers: string[];
  /** The rows of the blank template. Empty cells are empty strings. */
  rows: string[][];
  /** Rows have a fixed label in column 0 (the learner cannot add or remove rows). */
  labelled: boolean;
  /** Columns the learner fills in. */
  inputCols: number[];
  /** Rows to show at first (free rows only). */
  startRows: number;
}
export interface ChecklistBlock {
  kind: 'checklist';
  lead: string;
  items: string[];
}
export interface QuestionBlock {
  kind: 'questions';
  lead: string;
  items: string[];
  /** Tick boxes instead of written answers. */
  asChecks: boolean;
}
export interface NoteBlock {
  kind: 'note';
  lead: string;
}
export type Block = TableBlock | ChecklistBlock | QuestionBlock | NoteBlock;

export interface FormSection {
  heading: string;
  blocks: Block[];
}
export interface TemplateModel {
  title: string;
  sections: FormSection[];
}

export interface TemplateDraft {
  /** Field id to the text the learner typed. */
  values: Record<string, string>;
  /** Block key to the number of free rows shown. */
  rows: Record<string, number>;
  /** Tick-box id to checked. */
  ticks: Record<string, boolean>;
}

export function emptyDraft(): TemplateDraft {
  return { values: {}, rows: {}, ticks: {} };
}

/* ---------- ids ---------- */

export const blockKey = (section: number, block: number): string => `${section}-${block}`;
export const cellId = (section: number, block: number, row: number | string, col: number): string => `t${section}-${block}-${row}-${col}`;
export const answerId = (section: number, block: number, item: number): string => `q${section}-${block}-${item}`;
export const tickId = (section: number, block: number, item: number): string => `k${section}-${block}-${item}`;

/* ---------- reading the Markdown ---------- */

/** Split one table line into cells. `\|` is a literal bar inside a cell. */
export function splitRow(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index] ?? '';
    if (char === '\\' && line[index + 1] === '|') {
      current += '|';
      index += 1;
    } else if (char === '|') {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  // A line that starts and ends with a bar gives an empty first and last piece.
  if (line.trimStart().startsWith('|')) cells.shift();
  if (line.trimEnd().endsWith('|') && !line.trimEnd().endsWith('\\|')) cells.pop();
  return cells.map((cell) => cell.trim());
}

const isSeparator = (line: string): boolean => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line.trim());

/** Tidy a lead paragraph: drop the "Your Product | TOUCH POINTS |" prefix and the "delete this note" line. */
export function cleanLead(text: string): string {
  const parts = text.split(' | ');
  let out = (parts.length > 1 ? (parts[parts.length - 1] ?? '') : text).trim();
  out = out.replace(/\s*Delete this note when you start\.?/i, '');
  return out.replace(/\s+/g, ' ').trim();
}

interface RawSection {
  heading: string;
  lines: string[];
}

function splitSections(markdown: string): { title: string; sections: RawSection[] } {
  let title = '';
  const sections: RawSection[] = [{ heading: '', lines: [] }];
  for (const line of markdown.split(/\r?\n/)) {
    const h1 = /^#\s+(.*)$/.exec(line);
    const h2 = /^##\s+(.*)$/.exec(line);
    if (h1 && !title) {
      title = (h1[1] ?? '').trim();
    } else if (h2) {
      sections.push({ heading: (h2[1] ?? '').trim(), lines: [] });
    } else {
      sections[sections.length - 1]?.lines.push(line);
    }
  }
  return { title, sections };
}

function toTable(lead: string, tableLines: string[]): TableBlock | undefined {
  const [headerLine, ...rest] = tableLines;
  if (!headerLine) return undefined;
  const headers = splitRow(headerLine);
  const rows = rest.filter((line) => !isSeparator(line)).map(splitRow).map((cells) => headers.map((_, index) => cells[index] ?? ''));
  const labelled = rows.length >= 2 && rows.every((row) => (row[0] ?? '') !== '');
  let inputCols: number[];
  if (labelled) {
    inputCols = headers
      .map((_, index) => index)
      .filter((index) => index > 0 && (INPUT_HEADER.test(headers[index] ?? '') || rows.every((row) => (row[index] ?? '') === '')));
    if (inputCols.length === 0) inputCols = [headers.length - 1];
  } else {
    inputCols = headers.map((_, index) => index);
  }
  const blankRows = rows.filter((row) => row.every((cell) => cell === '')).length;
  const prefilled = rows.length - blankRows;
  const startRows = labelled ? rows.length : Math.max(prefilled, Math.min(Math.max(blankRows, 1), 3), 1);
  return { kind: 'table', lead: cleanLead(lead), headers, rows, labelled, inputCols, startRows };
}

function readBlocks(heading: string, lines: string[]): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let leadPending = '';
  const flushParagraph = (): void => {
    if (paragraph.length > 0) {
      leadPending = leadPending ? `${leadPending} ${paragraph.join(' ')}` : paragraph.join(' ');
      paragraph = [];
    }
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();
    if (trimmed === '') {
      flushParagraph();
    } else if (trimmed.startsWith('>')) {
      /* the "source of truth" notices: the page has them */
    } else if (trimmed.startsWith('|')) {
      flushParagraph();
      const tableLines: string[] = [];
      while (index < lines.length && (lines[index] ?? '').trim().startsWith('|')) {
        tableLines.push((lines[index] ?? '').trim());
        index += 1;
      }
      index -= 1;
      const table = toTable(leadPending, tableLines);
      leadPending = '';
      if (table) blocks.push(table);
    } else if (trimmed.startsWith('☐')) {
      flushParagraph();
      const items: string[] = [];
      while (index < lines.length) {
        const current = (lines[index] ?? '').trim();
        if (current.startsWith('☐')) items.push(current.replace(/^☐\s*/, ''));
        else if (current !== '') break;
        index += 1;
      }
      index -= 1;
      blocks.push({ kind: 'checklist', lead: cleanLead(leadPending), items });
      leadPending = '';
    } else if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      const items: string[] = [];
      while (index < lines.length) {
        const current = (lines[index] ?? '').trim();
        const match = /^\d+\.\s+(.*)$/.exec(current);
        if (match) items.push(match[1] ?? '');
        else if (current !== '') break;
        index += 1;
      }
      index -= 1;
      blocks.push({ kind: 'questions', lead: cleanLead(leadPending), items, asChecks: CHECK_HEADING.test(heading) });
      leadPending = '';
    } else {
      paragraph.push(trimmed);
    }
  }
  flushParagraph();
  // Text after the last block is guidance. Very short stray lines (an example value) say nothing alone, so they are dropped.
  const tail = cleanLead(leadPending);
  if (tail.length >= 60) blocks.push({ kind: 'note', lead: tail });
  return blocks;
}

/** Read a template download (Markdown) into the form model. */
export function parseTemplate(markdown: string): TemplateModel {
  const { title, sections: raw } = splitSections(markdown);
  const sections: FormSection[] = [];
  for (const [position, section] of raw.entries()) {
    const heading = position === 0 ? 'Details' : section.heading;
    if (SKIP_HEADING.test(heading)) continue;
    // Text before the first heading is the cover (title, notices). It is not a lead for the first table.
    const blocks = readBlocks(heading, section.lines).map((block) =>
      position === 0 && block.kind !== 'note' ? { ...block, lead: '' } : block,
    );
    // Guidance that has no input is left out of the form.
    if (!blocks.some((block) => block.kind !== 'note')) continue;
    sections.push({ heading, blocks });
  }
  return { title, sections };
}

/* ---------- the draft the learner saves ---------- */

export function parseDraft(data: unknown): TemplateDraft {
  const draft = emptyDraft();
  if (typeof data !== 'object' || data === null) return draft;
  const record = data as Record<string, unknown>;
  let keys = 0;
  const values = record['values'];
  if (typeof values === 'object' && values !== null) {
    for (const [key, value] of Object.entries(values)) {
      if (keys >= MAX_KEYS) break;
      if (/^[tq]\d+-\d+-[\d]+(-\d+)?$/.test(key) && typeof value === 'string') {
        draft.values[key] = value.slice(0, MAX_FIELD_LENGTH);
        keys += 1;
      }
    }
  }
  const rows = record['rows'];
  if (typeof rows === 'object' && rows !== null) {
    for (const [key, value] of Object.entries(rows)) {
      if (/^\d+-\d+$/.test(key) && typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= MAX_ROWS) {
        draft.rows[key] = value;
      }
    }
  }
  const ticks = record['ticks'];
  if (typeof ticks === 'object' && ticks !== null) {
    for (const [key, value] of Object.entries(ticks)) {
      if (/^k\d+-\d+-\d+$/.test(key) && typeof value === 'boolean') draft.ticks[key] = value;
    }
  }
  return draft;
}

/* ---------- writing the Markdown ---------- */

export function escapeCell(text: string): string {
  return text.trim().replace(/\r?\n/g, '<br>').replace(/\|/g, '\\|');
}

const tableLine = (cells: string[]): string => `| ${cells.map(escapeCell).join(' | ')} |`;

/** The value shown for a cell: what the learner typed, else what the blank template had there. */
function valueOf(draft: TemplateDraft, id: string, fallback: string): string {
  const typed = draft.values[id];
  return typed === undefined ? fallback : typed;
}

export function rowsShown(block: TableBlock, draft: TemplateDraft, key: string): number {
  if (block.labelled) return block.rows.length;
  return Math.min(MAX_ROWS, Math.max(1, draft.rows[key] ?? block.startRows));
}

function renderTable(block: TableBlock, draft: TemplateDraft, section: number, index: number): string[] {
  const lines = [tableLine(block.headers), tableLine(block.headers.map(() => '---'))];
  if (block.labelled) {
    block.rows.forEach((row, rowIndex) => {
      lines.push(
        tableLine(
          row.map((cell, col) => (block.inputCols.includes(col) ? valueOf(draft, cellId(section, index, rowIndex, col), '') : cell)),
        ),
      );
    });
    return lines;
  }
  const count = rowsShown(block, draft, blockKey(section, index));
  const body: string[] = [];
  for (let rowIndex = 0; rowIndex < count; rowIndex += 1) {
    const cells = block.headers.map((_, col) => valueOf(draft, cellId(section, index, rowIndex, col), block.rows[rowIndex]?.[col] ?? ''));
    if (cells.some((cell) => cell.trim() !== '')) body.push(tableLine(cells));
  }
  // A table with no rows is not a table, so keep one empty row.
  lines.push(...(body.length > 0 ? body : [tableLine(block.headers.map(() => ''))]));
  return lines;
}

/** The filled-in template as Markdown, in the shape of the blank download. */
export function renderTemplateMarkdown(model: TemplateModel, draft: TemplateDraft, today: string): string {
  const out: string[] = [`# ${model.title}`, '', `Filled in on ${today} with the form on the Developer Dojo template page.`];
  model.sections.forEach((section, s) => {
    out.push('', `## ${section.heading}`);
    section.blocks.forEach((block, b) => {
      if (block.kind === 'note') return;
      out.push('');
      if (block.kind === 'table') {
        out.push(...renderTable(block, draft, s, b));
      } else if (block.kind === 'checklist') {
        block.items.forEach((item, i) => out.push(`- [${draft.ticks[tickId(s, b, i)] ? 'x' : ' '}] ${item}`));
      } else if (block.asChecks) {
        block.items.forEach((item, i) => out.push(`- [${draft.ticks[tickId(s, b, i)] ? 'x' : ' '}] ${item}`));
      } else {
        block.items.forEach((item, i) => {
          if (i > 0) out.push('');
          out.push(`**${i + 1}. ${item}**`, '', (draft.values[answerId(s, b, i)] ?? '').trim() || '(no answer yet)');
        });
      }
    });
  });
  return `${out.join('\n')}\n`;
}

/** True when the draft holds anything the learner typed or ticked. */
export function hasContent(draft: TemplateDraft): boolean {
  return Object.values(draft.values).some((value) => value.trim() !== '') || Object.values(draft.ticks).some(Boolean);
}
