/**
 * Builds the editable Penpot design file for the Pocket Invoice UX pathway (UX-001 to UX-005).
 *
 *   node scripts/ux-pathway/build-penpot-file.ts
 *
 * Reads the flow (src/data/pocket-invoice.ts) and the design tokens (src/data/pocket-invoice-tokens.json)
 * and writes, under public/examples/ux-pathway/:
 *   - pocket-invoice.penpot: a Penpot v3 file (ZIP of JSON) with five pages: the sitemap, low-fidelity
 *     boards for every state, the token sheet and main components, high-fidelity boards for every state
 *     at 390 px and at 1280 px, and the high-fidelity journey: every phone screen on one canvas, joined by
 *     the numbered transitions. Every transition in the flow is a prototype interaction on pages 02 and 04.
 *   - pocket-invoice-tokens.json: a copy of the tokens, for import into Penpot or any DTCG tool.
 *
 * @penpot/library 1.3.0 has no call for prototype flows, so postProcess() writes them into the page JSON
 * afterwards, in the shape Penpot exports (`flows: { <id>: { id, name, startingFrame } }`). An import into
 * Penpot 2.18.7 kept them (public/examples/ux-pathway/penpot-import-check.json).
 *
 * The file is built with @penpot/library (MPL-2.0, Kaleidos), Penpot's own library for writing .penpot
 * files. Shape ids come from a hash of a stable key, so the same input gives the same ids. Run it again
 * after changing the flow or the tokens; tests/pocket-invoice.test.ts fails if the outputs are stale.
 * scripts/ux-pathway/check-penpot-import.sh imports the result into a real Penpot and records what came back.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as penpot from '@penpot/library';
import { SCREENS, START_STATE, STATES, TRANSITIONS, type Element, type FlowState, type StateId, type Transition } from '../../src/data/pocket-invoice.ts';
import { resolveTokens, tokenValue, type TokenFile } from '../../src/lib/design-tokens.ts';
import { readZip, writeZip } from './zip.ts';

const ROOT = new URL('../../', import.meta.url);
const OUT_DIR = fileURLToPath(new URL('public/examples/ux-pathway/', ROOT));
const TOKENS_SOURCE = fileURLToPath(new URL('src/data/pocket-invoice-tokens.json', ROOT));
const tokenText = readFileSync(TOKENS_SOURCE, 'utf8');
const tokenFile = JSON.parse(tokenText) as TokenFile;
const tokens = resolveTokens(tokenFile);
const t = (name: string): string => tokenValue(tokens, name);
const n = (name: string): number => Number(t(name));

/** A UUID derived from a stable key (version and variant bits set as for UUIDv8). */
function id(key: string): string {
  const hex = createHash('sha256').update('pocket-invoice/' + key).digest('hex').slice(0, 32).split('');
  hex[12] = '8';
  hex[16] = ((Number.parseInt(hex[16] ?? '0', 16) & 0x3) | 0x8).toString(16);
  const h = hex.join('');
  return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
}

type Fill = { fillColor: string; fillOpacity: number };
const fill = (color: string): Fill[] => [{ fillColor: color, fillOpacity: 1 }];
const stroke = (color: string, width: number, style = 'solid') => [{ strokeColor: color, strokeOpacity: 1, strokeWidth: width, strokeAlignment: 'inner', strokeStyle: style }];

interface TextStyle { size: number; weight: 400 | 700; color: string; underline?: boolean; lineHeight?: number }

function textContent(text: string, style: TextStyle) {
  return {
    type: 'root',
    children: [{
      type: 'paragraph-set',
      children: [{
        type: 'paragraph',
        lineHeight: String(style.lineHeight ?? 1.3),
        children: [{
          text, fontFamily: 'sourcesanspro', fontId: 'sourcesanspro', fontVariantId: style.weight === 700 ? 'bold' : 'regular',
          fontSize: String(style.size), fontWeight: String(style.weight), fontStyle: 'normal', lineHeight: String(style.lineHeight ?? 1.3),
          textDecoration: style.underline ? 'underline' : 'none', fills: fill(style.color),
        }],
      }],
    }],
  };
}

/**
 * Height of wrapped text, estimated from an average glyph width of 0.52 em (a word longer than a line
 * breaks across lines). Penpot lays the text out again when a page is first opened in the workspace;
 * the estimate only has to leave enough room.
 */
function textHeight(text: string, style: TextStyle, width: number): number {
  const perLine = Math.max(1, Math.floor(width / (style.size * 0.52)));
  let lines = 0;
  let current = 0;
  for (const word of text.split(/\s+/)) {
    if (word.length > perLine) { lines += (current ? 1 : 0) + Math.floor(word.length / perLine); current = word.length % perLine; continue; }
    if (current && current + 1 + word.length <= perLine) current += 1 + word.length;
    else { if (current) lines += 1; current = word.length; }
  }
  if (current) lines += 1;
  return Math.ceil(Math.max(1, lines) * style.size * (style.lineHeight ?? 1.3));
}

type Ctx = ReturnType<typeof penpot.createBuildContext>;

function addText(ctx: Ctx, key: string, name: string, text: string, style: TextStyle, x: number, y: number, width: number): number {
  const height = textHeight(text, style, width);
  ctx.addText({ id: id(key), name, x, y, width, height, growType: 'auto-height', content: textContent(text, style) });
  return height;
}

/** The look of one fidelity. Low fidelity is greyscale on purpose: it tests structure, not colour. */
interface Look {
  name: 'low' | 'high';
  page: string; card: string; text: string; muted: string; link: string; error: string; errorSurface: string;
  border: string; primary: string; onPrimary: string; radius: number; inputBorder: number; bar: number;
  heading: number; body: number; small: number; label: number; gap: number; tight: number; pad: number; control: number;
}

const LOW: Look = {
  name: 'low', page: '#ffffff', card: '#ffffff', text: '#1a1a1a', muted: '#505050', link: '#1a1a1a', error: '#1a1a1a', errorSurface: '#ffffff',
  border: '#6b6b6b', primary: '#3d3d3d', onPrimary: '#ffffff', radius: 0, inputBorder: 2, bar: 5,
  heading: 28, body: 18, small: 16, label: 18, gap: 24, tight: 8, pad: 24, control: 48,
};

const HIGH: Look = {
  name: 'high', page: t('color.surface.page'), card: t('color.surface.card'), text: t('color.text.default'), muted: t('color.text.muted'),
  link: t('color.text.link'), error: t('color.text.error'), errorSurface: t('color.surface.error'), border: t('color.border.input'),
  primary: t('color.action.primary'), onPrimary: t('color.text.inverse'), radius: n('radius.control'), inputBorder: n('border-width.thick'),
  bar: n('border-width.bar'), heading: n('font.size.xl'), body: n('font.size.m'), small: n('font.size.s'), label: n('font.size.m'),
  gap: n('space.stack'), tight: n('space.stack-tight'), pad: n('space.page'), control: n('size.control'),
};

const transitionsFrom = (state: StateId): Transition[] => TRANSITIONS.filter((item) => item.from === state);

function interactionFor(transition: Transition, boards: Map<StateId, string>) {
  const destination = boards.get(transition.to);
  if (!destination) throw new Error('No board for ' + transition.to);
  if (transition.kind === 'overlay-open') {
    return { eventType: 'click', actionType: 'open-overlay', destination, overlayPosType: 'center', closeClickOutside: false, backgroundOverlay: true, preserveScroll: false };
  }
  // Penpot's close-overlay names the overlay to close (the dialog itself); the screen under it shows again.
  if (transition.kind === 'overlay-close') return { eventType: 'click', actionType: 'close-overlay', destination: boards.get(transition.from) };
  return { eventType: 'click', actionType: 'navigate', destination, preserveScroll: false };
}

/**
 * Draws one state's elements as a column inside the current board. Every button carries the
 * interaction for its transition, and every error transition (which no button causes on its own)
 * gets a labelled prototype-only link at the foot of the board. With no boards (a main component),
 * nothing is linked: a component is a building block, not a step in the flow. Boards nested inside a
 * screen (buttons, inputs) are hidden in View mode, as Penpot does for boards drawn inside boards.
 */
function drawState(ctx: Ctx, keyPrefix: string, state: FlowState, look: Look, boards: Map<StateId, string> | null, x0: number, y0: number, width: number): number {
  const inner = width - look.pad * 2;
  const x = x0 + look.pad;
  let y = y0 + look.pad;
  const key = (suffix: string) => keyPrefix + '/' + state.id + '/' + suffix;
  const used = new Set<StateId>();

  state.elements.forEach((element: Element, index) => {
    const k = (suffix: string) => key(index + '-' + suffix);
    switch (element.type) {
      case 'heading':
        y += addText(ctx, k('h'), 'Heading', element.text, { size: look.heading, weight: 700, color: look.text, lineHeight: 1.2 }, x, y, inner) + look.gap;
        break;
      case 'text':
        y += addText(ctx, k('t'), 'Text', element.text, { size: look.body, weight: 400, color: look.text, lineHeight: 1.5 }, x, y, inner) + look.gap;
        break;
      case 'error-summary': {
        const title = { size: look.label + 3, weight: 700 as const, color: look.text };
        const item = { size: look.body, weight: 700 as const, color: look.error, underline: true };
        const boxInner = inner - 2 * 16 - look.bar;
        const height = 16 + textHeight('There is a problem', title, boxInner) + look.tight + element.items.reduce((sum, text) => sum + textHeight(text, item, boxInner) + look.tight, 0) + 8;
        ctx.addBoard({ hideInViewer: true, id: id(k('box')), name: 'Error summary', x, y, width: inner, height, fills: fill(look.errorSurface), strokes: stroke(look.error, look.bar) });
        let iy = y + 16;
        iy += addText(ctx, k('title'), 'Title', 'There is a problem', title, x + 16 + look.bar, iy, boxInner) + look.tight;
        element.items.forEach((text, i) => { iy += addText(ctx, k('item' + i), 'Error link', text, item, x + 16 + look.bar, iy, boxInner) + look.tight; });
        ctx.closeBoard();
        y += height + look.gap;
        break;
      }
      case 'field': {
        const errorBar = element.error ? look.bar + 12 : 0;
        const fx = x + errorBar;
        const fw = inner - errorBar;
        const top = y;
        y += addText(ctx, k('label'), 'Label', element.label, { size: look.label, weight: 700, color: look.text }, fx, y, fw) + 4;
        if (element.hint) y += addText(ctx, k('hint'), 'Hint', element.hint, { size: look.small, weight: 400, color: look.muted }, fx, y, fw) + 4;
        if (element.error) y += addText(ctx, k('error'), 'Error message', 'Error: ' + element.error, { size: look.body, weight: 700, color: look.error }, fx, y, fw) + 4;
        ctx.addBoard({ hideInViewer: true, id: id(k('input')), name: 'Input', x: fx, y, width: fw, height: look.control, fills: fill(look.card), strokes: stroke(element.error ? look.error : look.border, element.error ? look.inputBorder + 1 : look.inputBorder), r1: look.radius, r2: look.radius, r3: look.radius, r4: look.radius });
        addText(ctx, k('value'), 'Value', element.value, { size: look.body, weight: 400, color: look.text }, fx + 12, y + (look.control - look.body * 1.3) / 2, fw - 24);
        ctx.closeBoard();
        y += look.control;
        if (element.error) ctx.addRect({ id: id(k('bar')), name: 'Error bar', x, y: top, width: look.bar, height: y - top, fills: fill(look.error) });
        y += look.gap;
        break;
      }
      case 'summary':
        element.rows.forEach(([label, value], i) => {
          const left = Math.floor(inner * 0.32);
          const h = Math.max(textHeight(label, { size: look.body, weight: 700, color: look.text }, left - 8), textHeight(value, { size: look.body, weight: 400, color: look.text }, inner - left));
          addText(ctx, k('row' + i + 'k'), 'Key', label, { size: look.body, weight: 700, color: look.text }, x, y + 12, left - 8);
          addText(ctx, k('row' + i + 'v'), 'Value', value, { size: look.body, weight: 400, color: look.text }, x + left, y + 12, inner - left);
          y += h + 24;
          ctx.addRect({ id: id(k('row' + i + 'line')), name: 'Divider', x, y, width: inner, height: 1, fills: fill(look.border) });
        });
        y += look.gap;
        break;
      case 'table': {
        const col = inner / element.columns.length;
        element.columns.forEach((name, i) => addText(ctx, k('th' + i), 'Column heading', name, { size: look.small, weight: 700, color: look.text }, x + i * col, y, col - 6));
        y += look.small * 1.3 + 10;
        ctx.addRect({ id: id(k('thline')), name: 'Divider', x, y, width: inner, height: 2, fills: fill(look.text) });
        y += 10;
        element.rows.forEach((row, r) => {
          const cellStyle = { size: look.small, weight: 400 as const, color: look.text };
          const rowHeight = Math.max(...row.map((cell) => textHeight(cell, cellStyle, col - 6)));
          row.forEach((cell, i) => addText(ctx, k('td' + r + '-' + i), 'Cell', cell, cellStyle, x + i * col, y, col - 6));
          y += rowHeight + 10;
          ctx.addRect({ id: id(k('tdline' + r)), name: 'Divider', x, y, width: inner, height: 1, fills: fill(look.border) });
          y += 10;
        });
        y += look.gap;
        break;
      }
      case 'button': {
        let interactions: ReturnType<typeof interactionFor>[] = [];
        if (boards) {
          const transition = TRANSITIONS.find((item) => item.from === state.id && item.to === element.to);
          if (!transition) throw new Error(state.id + ': button "' + element.label + '" goes to ' + element.to + ' but the flow has no such transition');
          used.add(element.to);
          interactions = [interactionFor(transition, boards)];
        }
        if (element.variant === 'link') {
          const style = { size: look.body, weight: 400 as const, color: look.link, underline: true };
          const h = textHeight(element.label, style, inner);
          ctx.addBoard({ hideInViewer: true, id: id(k('btn')), name: 'Link: ' + element.label, x, y, width: inner, height: Math.max(h, 24), fills: [], interactions });
          addText(ctx, k('btnlabel'), 'Label', element.label, style, x, y, inner);
          ctx.closeBoard();
          y += Math.max(h, 24) + look.gap;
          break;
        }
        const primary = element.variant === 'primary';
        const width = inner;
        ctx.addBoard({
          hideInViewer: true, id: id(k('btn')), name: (primary ? 'Button primary: ' : 'Button secondary: ') + element.label, x, y, width, height: look.control,
          fills: fill(primary ? look.primary : look.card), strokes: primary ? [] : stroke(look.name === 'high' ? look.primary : look.text, 2),
          r1: look.radius, r2: look.radius, r3: look.radius, r4: look.radius, interactions,
        });
        const style = { size: look.body, weight: 700 as const, color: primary ? look.onPrimary : (look.name === 'high' ? look.primary : look.text) };
        addText(ctx, k('btnlabel'), 'Label', element.label, style, x + 16, y + (look.control - look.body * 1.3) / 2, width - 32);
        ctx.closeBoard();
        y += look.control + 16;
        break;
      }
    }
  });

  for (const transition of boards ? transitionsFrom(state.id).filter((item) => !used.has(item.to)) : []) {
    if (transition.kind !== 'error') throw new Error(state.id + ' -> ' + transition.to + ' (' + transition.kind + ') has no button; only error transitions may use a prototype link');
    y += 8;
    const label = 'Prototype only: ' + transition.trigger.charAt(0).toLowerCase() + transition.trigger.slice(1);
    const style = { size: 14, weight: 400 as const, color: look.muted, underline: true };
    const h = textHeight(label, style, inner - 16) + 16;
    ctx.addBoard({ hideInViewer: true, id: id(key('proto-' + transition.to)), name: 'Prototype link: ' + transition.to, x, y, width: inner, height: h, fills: fill(look.card), strokes: stroke(look.muted, 1, 'dashed'), interactions: [interactionFor(transition, boards)] });
    addText(ctx, key('proto-' + transition.to + '-label'), 'Label', label, style, x + 8, y + 8, inner - 16);
    ctx.closeBoard();
    y += h + 12;
  }
  return y + look.pad - y0;
}

/** Measures a state's height by drawing it into a throwaway context. */
function measure(state: FlowState, look: Look, width: number, boards: Map<StateId, string> | null): number {
  const scratch = penpot.createBuildContext();
  scratch.addFile({ name: 'measure' });
  scratch.addPage({ name: 'measure' });
  scratch.addBoard({ name: 'measure', x: 0, y: 0, width, height: 100 });
  const height = drawState(scratch, 'measure', state, look, boards, 0, 0, width);
  scratch.closeBoard();
  scratch.closePage();
  scratch.closeFile();
  return height;
}

function drawFlowPage(ctx: Ctx, pageKey: string, look: Look, width: number, minHeight: number, states: readonly FlowState[], y0: number, label: string): Map<StateId, string> {
  const boards = new Map<StateId, string>(states.map((state) => [state.id, id(pageKey + '/board/' + state.id)]));
  addText(ctx, pageKey + '/title', 'Page title', label, { size: 32, weight: 700, color: '#1a1a1a' }, 0, y0 - 160, 2400);
  let x = 0;
  for (const state of states) {
    const overlay = state.kind === 'overlay';
    const w = overlay ? Math.min(width - 48, 560) : width;
    const height = Math.max(overlay ? 0 : minHeight, measure(state, look, w, boards));
    ctx.addBoard({ id: boards.get(state.id), name: state.id + ': ' + state.title, x, y: y0, width: w, height, fills: fill(overlay ? look.card : look.page), strokes: overlay ? stroke(look.text, 2) : [], r1: overlay ? 8 : 0, r2: overlay ? 8 : 0, r3: overlay ? 8 : 0, r4: overlay ? 8 : 0 });
    drawState(ctx, pageKey, state, look, boards, x, y0, w);
    ctx.closeBoard();
    x += w + 120;
  }
  return boards;
}

const KIND_SHADES: Record<string, string> = { screen: '#ffffff', error: '#ececec', empty: '#f6f6f6', overlay: '#ffffff', success: '#ffffff', boundary: '#f6f6f6' };

function drawSitemap(ctx: Ctx): void {
  const BOX_W = 240; const BOX_H = 104; const COL = 360; const ROW = 200; const top = 160;
  // One root board holds the whole map, so Penpot's View mode and image export can show it.
  ctx.addBoard({ id: id('sitemap/board'), name: 'Sitemap and flow', x: -40, y: -40, width: 2140, height: 1320, fills: fill('#ffffff') });
  addText(ctx, 'sitemap/title', 'Page title', 'Pocket Invoice: sitemap and user flow, with branches and error states', { size: 32, weight: 700, color: '#1a1a1a' }, 0, 0, 1800);
  addText(ctx, 'sitemap/intro', 'Intro', 'Columns are screens; boxes are the states of a screen. Each numbered arrow is a transition listed below. Dashed boxes are error, empty or boundary states; the outlined box with a double border is a dialog over its screen.', { size: 18, weight: 400, color: '#1a1a1a', lineHeight: 1.5 }, 0, 52, 1800);
  const pos = new Map<StateId, { x: number; y: number }>();
  SCREENS.forEach((screen, c) => {
    addText(ctx, 'sitemap/screen/' + screen.id, 'Screen', screen.name, { size: 20, weight: 700, color: '#1a1a1a' }, c * COL, top, BOX_W);
    STATES.filter((state) => state.screen === screen.id).forEach((state, r) => {
      const x = c * COL; const y = top + 48 + r * ROW;
      pos.set(state.id, { x, y });
      const dashed = state.kind === 'error' || state.kind === 'empty' || state.kind === 'boundary';
      ctx.addGroup({ id: id('sitemap/group/' + state.id), name: 'State: ' + state.id });
      ctx.addRect({ id: id('sitemap/box/' + state.id), name: 'Box', x, y, width: BOX_W, height: BOX_H, fills: fill(KIND_SHADES[state.kind] ?? '#ffffff'), strokes: stroke('#1a1a1a', state.kind === 'overlay' ? 4 : 2, dashed ? 'dashed' : 'solid') });
      addText(ctx, 'sitemap/box/' + state.id + '/kind', 'Kind', state.kind.toUpperCase() + (state.id === START_STATE ? ' (START)' : ''), { size: 13, weight: 700, color: '#505050' }, x + 12, y + 10, BOX_W - 24);
      addText(ctx, 'sitemap/box/' + state.id + '/title', 'Title', state.title, { size: 17, weight: 700, color: '#1a1a1a' }, x + 12, y + 30, BOX_W - 24);
      ctx.closeGroup();
    });
  });
  const legendTop = top + 48 + 3 * ROW + 40;
  TRANSITIONS.forEach((tr, i) => {
    const a = pos.get(tr.from); const b = pos.get(tr.to);
    if (!a || !b) throw new Error('Sitemap: no box for ' + tr.from + ' or ' + tr.to);
    const forwardish = b.x > a.x || (b.x === a.x && b.y > a.y);
    const start = b.x === a.x ? { x: a.x + BOX_W / 2 + (forwardish ? -30 : 30), y: forwardish ? a.y + BOX_H : a.y } : { x: b.x > a.x ? a.x + BOX_W : a.x, y: a.y + BOX_H / 2 + (forwardish ? -14 : 14) };
    const end = b.x === a.x ? { x: b.x + BOX_W / 2 + (forwardish ? -30 : 30), y: forwardish ? b.y : b.y + BOX_H } : { x: b.x > a.x ? b.x : b.x + BOX_W, y: b.y + BOX_H / 2 + (forwardish ? -14 : 14) };
    const dashed = tr.kind === 'error' || tr.kind === 'back' || tr.kind === 'overlay-close';
    ctx.addPath({
      id: id('sitemap/arrow/' + i), name: 'Transition ' + (i + 1) + ': ' + tr.from + ' to ' + tr.to + ' (' + tr.kind + ')',
      content: [{ command: 'move-to', params: start }, { command: 'line-to', params: end }],
      fills: [], strokes: [{ strokeColor: '#1a1a1a', strokeOpacity: 1, strokeWidth: 2, strokeAlignment: 'center', strokeStyle: dashed ? 'dashed' : 'solid', strokeCapEnd: 'triangle-arrow' }],
    });
    const mid = { x: (start.x + end.x) / 2 + (i % 2 ? 6 : -26), y: (start.y + end.y) / 2 - 22 };
    ctx.addGroup({ id: id('sitemap/badge-group/' + i), name: 'Label ' + (i + 1) });
    ctx.addRect({ id: id('sitemap/badge/' + i), name: 'Badge', x: mid.x, y: mid.y, width: 26, height: 22, fills: fill('#1a1a1a'), r1: 11, r2: 11, r3: 11, r4: 11 });
    addText(ctx, 'sitemap/badge/' + i + '/n', 'Number', String(i + 1), { size: 13, weight: 700, color: '#ffffff' }, mid.x + 4, mid.y + 3, 18);
    ctx.closeGroup();
    addText(ctx, 'sitemap/legend/' + i, 'Transition ' + (i + 1), (i + 1) + '. ' + tr.from + ' to ' + tr.to + ' (' + tr.kind + '): ' + tr.trigger, { size: 16, weight: 400, color: '#1a1a1a' }, i < 10 ? 0 : 1040, legendTop + (i % 10) * 30, 1020);
  });
  ctx.closeBoard();
}

function drawTokensAndComponents(ctx: Ctx): void {
  addText(ctx, 'tokens/title', 'Page title', 'Pocket Invoice: tokens and components', { size: 32, weight: 700, color: '#1a1a1a' }, 0, 0, 1600);
  addText(ctx, 'tokens/intro', 'Intro', 'The token sets core and semantic are in this file (Tokens panel) and in pocket-invoice-tokens.json. Colours and type styles are also in the shared library. The boards below are main components.', { size: 18, weight: 400, color: '#1a1a1a', lineHeight: 1.5 }, 0, 52, 1600);
  const colours = [...tokens.values()].filter((token) => token.type === 'color' && token.set === 'semantic');
  colours.forEach((token, i) => {
    const x = (i % 6) * 260; const y = 160 + Math.floor(i / 6) * 120;
    ctx.addRect({ id: id('tokens/swatch/' + token.name), name: token.name, x, y, width: 64, height: 64, fills: fill(token.resolved), strokes: stroke('#6b6b6b', 1), r1: 8, r2: 8, r3: 8, r4: 8 });
    addText(ctx, 'tokens/swatch/' + token.name + '/label', 'Label', token.name + '\n' + token.resolved, { size: 14, weight: 400, color: '#1a1a1a' }, x + 76, y + 4, 170);
    ctx.addLibraryColor({ id: id('library/colour/' + token.name), name: token.name.split('.').slice(-1)[0] ?? token.name, path: token.name.split('.').slice(0, -1).join(' / '), color: token.resolved, opacity: 1 });
  });
  const typeTop = 160 + Math.ceil(colours.length / 6) * 120 + 40;
  const styles = [['Heading', 'font.size.xl', 700], ['Subheading', 'font.size.l', 700], ['Body', 'font.size.m', 400], ['Label', 'font.size.m', 700], ['Hint', 'font.size.s', 400]] as const;
  let ty = typeTop;
  for (const [name, size, weight] of styles) {
    ctx.addLibraryTypography({ id: id('library/type/' + name), name, path: 'Pocket Invoice', fontId: 'sourcesanspro', fontFamily: 'sourcesanspro', fontVariantId: weight === 700 ? 'bold' : 'regular', fontSize: t(size), fontWeight: String(weight), fontStyle: 'normal', lineHeight: '1.3', letterSpacing: '0', textTransform: 'none' });
    ty += addText(ctx, 'tokens/type/' + name, name, name + ': ' + t(size) + ' px, weight ' + weight, { size: Number(t(size)), weight, color: t('color.text.default') }, 0, ty, 900) + 16;
  }
  const componentsTop = ty + 60;
  addText(ctx, 'components/title', 'Section title', 'Main components', { size: 24, weight: 700, color: '#1a1a1a' }, 0, componentsTop, 800);
  const look = HIGH;
  const definitions: { name: string; path: string; elements: Element[]; width?: number }[] = [
    { name: 'Primary', path: 'Button', elements: [{ type: 'button', label: 'Button', variant: 'primary', to: START_STATE }] },
    { name: 'Secondary', path: 'Button', elements: [{ type: 'button', label: 'Button', variant: 'secondary', to: START_STATE }] },
    { name: 'Link', path: 'Button', elements: [{ type: 'button', label: 'Link text', variant: 'link', to: START_STATE }] },
    { name: 'Default', path: 'Field', elements: [{ type: 'field', label: 'Label', hint: 'Hint text', value: 'Value' }] },
    { name: 'Error', path: 'Field', elements: [{ type: 'field', label: 'Label', value: 'Value', error: 'Say what went wrong and how to fix it' }] },
    { name: 'Error summary', path: 'Feedback', elements: [{ type: 'error-summary', items: ['First problem, linked to its field', 'Second problem'] }] },
    { name: 'Summary list', path: 'Content', elements: [{ type: 'summary', rows: [['Key', 'Value'], ['Key', 'Value']] }] },
    { name: 'Dialog', path: 'Feedback', width: 400, elements: [{ type: 'heading', text: 'Question as a heading' }, { type: 'text', text: 'What happens next.' }, { type: 'button', label: 'Safe choice', variant: 'primary', to: START_STATE }, { type: 'button', label: 'Destructive choice', variant: 'secondary', to: START_STATE }] },
  ];
  let cx = 0; let cy = componentsTop + 90; let rowHeight = 0;
  for (const def of definitions) {
    const width = def.width ?? 342;
    const sample: FlowState = { id: START_STATE, screen: 'start', kind: 'screen', title: def.name, purpose: 'Main component', elements: def.elements };
    const height = measure(sample, look, width, null);
    if (cx + width > 1600) { cx = 0; cy += rowHeight + 90; rowHeight = 0; }
    const key = 'components/' + def.path + '/' + def.name;
    ctx.addBoard({ id: id(key), name: def.name, x: cx, y: cy, width, height, fills: fill(look.card) });
    drawState(ctx, key, sample, look, null, cx, cy, width);
    ctx.closeBoard();
    ctx.addComponent({ componentId: id('component/' + def.path + '/' + def.name), name: def.name, path: def.path, frameId: id(key) });
    cx += width + 80; rowHeight = Math.max(rowHeight, height);
  }
}

/** Prototype flows to add to the exported pages: page id, flow name, starting board. */
const FLOWS = [
  { page: id('page/low'), id: id('flow/low'), name: 'Low fidelity: send the first invoice', start: id('low/board/' + START_STATE) },
  { page: id('page/high'), id: id('flow/high'), name: 'High fidelity: send the first invoice', start: id('high/board/' + START_STATE) },
];

/**
 * The export stamps components with the build time; a fixed stamp makes the file reproducible, so a
 * rebuild with unchanged input changes no bytes and the staleness test can compare files exactly.
 */
const FIXED_TIMESTAMP = '2026-11-21T00:00:00Z';
const TIMESTAMP_KEYS = new Set(['modifiedAt', 'createdAt']);

/** Adds the prototype flows and fixes the timestamps and theme ids in a library export. */
function postProcess(bytes: Uint8Array): Uint8Array {
  const entries = readZip(bytes);
  const patched = new Set<string>();
  const out = entries.map((entry) => {
    if (!entry.name.endsWith('.json')) return entry;
    const text = new TextDecoder().decode(entry.data);
    const json = JSON.parse(text, (key, value: unknown) => (TIMESTAMP_KEYS.has(key) && typeof value === 'string' ? FIXED_TIMESTAMP : value)) as Record<string, unknown>;
    // Penpot gives each theme a random id on export; derive it from the theme's name instead.
    if (entry.name.endsWith('/tokens.json') && Array.isArray(json['$themes'])) {
      for (const theme of json['$themes'] as Record<string, unknown>[]) theme['id'] = id('theme/' + String(theme['group']) + '/' + String(theme['name']));
    }
    const flow = FLOWS.find((item) => entry.name.endsWith('/pages/' + item.page + '.json'));
    if (flow) {
      json['flows'] = { [flow.id]: { id: flow.id, name: flow.name, startingFrame: flow.start } };
      patched.add(flow.page);
    }
    return { name: entry.name, data: new TextEncoder().encode(JSON.stringify(json)) };
  });
  const missing = FLOWS.filter((item) => !patched.has(item.page));
  if (missing.length) throw new Error('Penpot export has no page file for ' + missing.map((item) => item.name).join(', ') + '; did @penpot/library change its layout?');
  return writeZip(out);
}

/** The .penpot file as bytes. The same flow and tokens always give the same bytes. */
export async function build(): Promise<Uint8Array> {
  const ctx = penpot.createBuildContext();
  ctx.addFile({ id: id('file'), name: 'Pocket Invoice: UX pathway example' });

  ctx.addPage({ id: id('page/sitemap'), name: '01 Sitemap and flow' });
  drawSitemap(ctx);
  ctx.closePage();

  ctx.addPage({ id: id('page/low'), name: '02 Low fidelity (390 px)' });
  drawFlowPage(ctx, 'low', LOW, 390, 844, STATES, 160, 'Low fidelity: every state at 390 px, greyscale, linked as a prototype');
  ctx.closePage();

  ctx.addPage({ id: id('page/tokens'), name: '03 Tokens and components' });
  drawTokensAndComponents(ctx);
  ctx.closePage();

  ctx.addPage({ id: id('page/high'), name: '04 High fidelity (390 px and 1280 px)' });
  drawFlowPage(ctx, 'high', HIGH, 390, 844, STATES, 160, 'High fidelity: every state at 390 px, styled with the tokens, linked as a prototype');
  drawDesktop(ctx, STATES.filter((state) => state.kind !== 'overlay'));
  ctx.closePage();

  ctx.addPage({ id: id('page/journey'), name: '05 Journey on one canvas' });
  drawJourney(ctx);
  ctx.closePage();

  ctx.addTokensLib(tokenFile);
  ctx.closeFile();
  return postProcess(await penpot.exportAsBytes(ctx));
}

/**
 * Desktop boards: the same column, centred at 640 px wide inside a 1280 px board, the measure a reading
 * line needs. Every screen state gets one; the dialog is an overlay, so it has no desktop board of its own.
 * Two rows of five and five, so the page stays a size a person can pan around.
 */
function drawDesktop(ctx: Ctx, states: FlowState[]): void {
  const top = 1400;
  addText(ctx, 'desktop/title', 'Section title', 'High fidelity at 1280 px: the same content in a 640 px column (no prototype links; the 390 px boards carry the flow)', { size: 24, weight: 700, color: '#1a1a1a' }, 0, top - 100, 2400);
  const perRow = Math.ceil(states.length / 2);
  const rowHeight = Math.max(...states.map((state) => Math.max(800, measure(state, HIGH, 640, null) + 96))) + 160;
  states.forEach((state, i) => {
    const x = (i % perRow) * 1400;
    const y0 = top + Math.floor(i / perRow) * rowHeight;
    const height = Math.max(800, measure(state, HIGH, 640, null) + 96);
    ctx.addBoard({ id: id('desktop/' + state.id), name: 'Desktop: ' + state.title + ' (' + state.id + ', 1280 px)', x, y: y0, width: 1280, height, fills: fill(HIGH.page) });
    ctx.addRect({ id: id('desktop/' + state.id + '/bar'), name: 'Header', x, y: y0, width: 1280, height: 64, fills: fill(HIGH.text) });
    addText(ctx, 'desktop/' + state.id + '/brand', 'Product name', 'Pocket Invoice', { size: 20, weight: 700, color: HIGH.onPrimary }, x + 320, y0 + 18, 300);
    drawState(ctx, 'desktop', state, HIGH, null, x + 320, y0 + 64, 640);
    ctx.closeBoard();
  });
}

/**
 * Page 05: the single-canvas journey. One root board holds a copy of every high-fidelity phone screen in
 * flow order, left to right, and one numbered arrow per transition routed in its own lane above the
 * screens (solid: forward, branch, recover and overlay-open; dashed: error, back and overlay-close).
 * A legend under the screens gives each number its trigger. The copies carry no interactions: the
 * clickable flow is on page 04, and this page is for reading the whole journey at once.
 */
function drawJourney(ctx: Ctx): void {
  const SCREEN_W = 390; const GAP = 150; const LANE = 26;
  const lanesTop = 220; const screensTop = lanesTop + TRANSITIONS.length * LANE + 60;
  const xOf = new Map<StateId, number>(STATES.map((state, i) => [state.id, 80 + i * (SCREEN_W + GAP)]));
  const widthOf = (state: FlowState) => (state.kind === 'overlay' ? SCREEN_W - 48 : SCREEN_W);
  const heights = STATES.map((state) => Math.max(state.kind === 'overlay' ? 0 : 844, measure(state, HIGH, widthOf(state), null)));
  const legendTop = screensTop + Math.max(...heights) + 100;
  const canvasWidth = 80 + STATES.length * (SCREEN_W + GAP) - GAP + 80;
  const half = Math.ceil(TRANSITIONS.length / 2);
  const canvasHeight = legendTop + half * 30 + 80;
  ctx.addBoard({ id: id('journey/board'), name: 'Journey: every high-fidelity screen on one canvas', x: 0, y: 0, width: canvasWidth, height: canvasHeight, fills: fill('#ffffff') });
  addText(ctx, 'journey/title', 'Page title', 'Pocket Invoice: the whole high-fidelity journey on one canvas', { size: 32, weight: 700, color: '#1a1a1a' }, 80, 60, 2400);
  addText(ctx, 'journey/intro', 'Intro', 'Every phone screen in flow order. Each numbered arrow is one transition, listed under the screens. Solid arrows move forward, branch, recover or open the dialog; dashed arrows are errors, back paths and closing the dialog. Press Play on page 04 to click through the same flow.', { size: 18, weight: 400, color: '#1a1a1a', lineHeight: 1.5 }, 80, 112, 2400);
  STATES.forEach((state, i) => {
    const x = xOf.get(state.id) ?? 0; const w = widthOf(state); const h = heights[i] ?? 844;
    const overlay = state.kind === 'overlay';
    ctx.addBoard({ id: id('journey/screen/' + state.id), name: state.id + ': ' + state.title, hideInViewer: true, x, y: screensTop, width: w, height: h, fills: fill(overlay ? HIGH.card : HIGH.page), strokes: stroke(HIGH.text, overlay ? 2 : 1), r1: overlay ? 8 : 0, r2: overlay ? 8 : 0, r3: overlay ? 8 : 0, r4: overlay ? 8 : 0 });
    drawState(ctx, 'journey', state, HIGH, null, x, screensTop, w);
    ctx.closeBoard();
  });
  // Spread the arrow ends along each screen's top edge, so arrows that share a screen do not overlap.
  const ends = new Map<StateId, number>();
  const nextEnd = (state: StateId): number => {
    const k = ends.get(state) ?? 0; ends.set(state, k + 1);
    return (xOf.get(state) ?? 0) + 24 + k * 34;
  };
  TRANSITIONS.forEach((tr, i) => {
    const sx = nextEnd(tr.from); const dx = nextEnd(tr.to);
    const laneY = lanesTop + i * LANE;
    const dashed = tr.kind === 'error' || tr.kind === 'back' || tr.kind === 'overlay-close';
    ctx.addPath({
      id: id('journey/arrow/' + i), name: 'Transition ' + (i + 1) + ': ' + tr.from + ' to ' + tr.to + ' (' + tr.kind + ')',
      content: [{ command: 'move-to', params: { x: sx, y: screensTop } }, { command: 'line-to', params: { x: sx, y: laneY } }, { command: 'line-to', params: { x: dx, y: laneY } }, { command: 'line-to', params: { x: dx, y: screensTop } }],
      fills: [], strokes: [{ strokeColor: '#1a1a1a', strokeOpacity: 1, strokeWidth: 2, strokeAlignment: 'center', strokeStyle: dashed ? 'dashed' : 'solid', strokeCapEnd: 'triangle-arrow' }],
    });
    const bx = Math.min(sx, dx) + Math.abs(dx - sx) / 2 - 13;
    ctx.addGroup({ id: id('journey/badge-group/' + i), name: 'Label ' + (i + 1) });
    ctx.addRect({ id: id('journey/badge/' + i), name: 'Badge', x: bx, y: laneY - 11, width: 26, height: 22, fills: fill('#1a1a1a'), r1: 11, r2: 11, r3: 11, r4: 11 });
    addText(ctx, 'journey/badge/' + i + '/n', 'Number', String(i + 1), { size: 13, weight: 700, color: '#ffffff' }, bx + 4, laneY - 8, 18);
    ctx.closeGroup();
    addText(ctx, 'journey/legend/' + i, 'Transition ' + (i + 1), (i + 1) + '. ' + tr.from + ' to ' + tr.to + ' (' + tr.kind + '): ' + tr.trigger, { size: 16, weight: 400, color: '#1a1a1a' }, i < half ? 80 : 1600, legendTop + (i % half) * 30, 1480);
  });
  ctx.closeBoard();
}

export const OUTPUTS = { penpot: OUT_DIR + 'pocket-invoice.penpot', tokens: OUT_DIR + 'pocket-invoice-tokens.json', tokensSource: TOKENS_SOURCE };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  mkdirSync(OUT_DIR, { recursive: true });
  const bytes = await build();
  writeFileSync(OUTPUTS.penpot, bytes);
  writeFileSync(OUTPUTS.tokens, tokenText);
  console.log('Wrote pocket-invoice.penpot (' + bytes.length + ' bytes) and pocket-invoice-tokens.json to ' + OUT_DIR);
}
