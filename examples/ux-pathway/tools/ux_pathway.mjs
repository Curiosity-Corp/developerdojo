#!/usr/bin/env node
/**
 * UX pathway (M9): rebuilds the open, editable artifacts of the Pocket Invoice example, and the checks on them, from
 * the published inputs: the low-fidelity drawings here, and the brand and style guide, components, responsive
 * high-fidelity screens and visual-fidelity report in ux_hifi.mjs. No dependencies: the Node standard library only.
 *
 *   node tools/ux_pathway.mjs <pack dir> <out dir>
 *
 * Reads   <pack>/inputs/pocket-invoice-flow.json   the flow: screens, states and transitions
 *         <pack>/inputs/contrast-pairs.json        the token colour pairs and the contrast each must meet
 *         <pack>/pocket-invoice-tokens.json        the design tokens (W3C DTCG draft format, as Penpot imports it)
 *         <pack>/inputs/brand.json                 the brand: name, wordmark, voice, rules and the two layout widths
 * Writes  <out>/sitemap.svg                         every state and numbered transition, grouped by screen
 *         <out>/journey.svg                         every low-fidelity screen on one canvas, connected
 *         <out>/wireframes/<state>.svg              one greyscale 390 px screen per state
 *         <out>/flow-checks.json, <out>/summary.md  what was checked and the result
 *         <out>/manifest.json                       the SHA-256 of each input and the list of outputs
 *         <out>/style-guide.svg, style-guide.md     the brand and style guide, from the tokens and the brand file
 *         <out>/components.svg                      every component, drawn only with token values
 *         <out>/screens/phone|desktop/<state>.svg   each state in high fidelity at 390 px and at 1440 px
 *         <out>/journey-high.svg                    every high-fidelity phone screen on one canvas, connected
 *         <out>/fidelity-report.json, .md           the visual-fidelity check of those drawings against the tokens
 *
 * Every file is written even when a check fails, so you can see what failed; the exit code is then 1.
 * The site's CI reruns this script on every pipeline and fails if its output differs from generated/.
 * Change the flow file, rerun, and the drawings and checks follow: that is the point of the kata.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contrast, flattenTokens, resolveToken } from './design_tokens.mjs';
import { renderHifi } from './ux_hifi.mjs';

export { contrast };

export const INPUTS = {
  flow: 'inputs/pocket-invoice-flow.json',
  pairs: 'inputs/contrast-pairs.json',
  tokens: 'pocket-invoice-tokens.json',
  brand: 'inputs/brand.json',
};

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const INK = '#212121';
const INK2 = '#424242';
const MUTED = '#616161';
const LINE = '#9e9e9e';
const FILL = '#e0e0e0';
const PAPER = '#ffffff';

const KIND_LABEL = { screen: 'Screen', error: 'Error', empty: 'Empty state', overlay: 'Dialog', success: 'Success', boundary: 'Outside this flow' };
const EDGE = {
  forward: { label: 'Forward', stroke: INK, width: 2, dash: '' },
  branch: { label: 'Branch', stroke: MUTED, width: 2, dash: '' },
  error: { label: 'Error', stroke: INK, width: 2, dash: '7 4' },
  recover: { label: 'Recover', stroke: INK, width: 2, dash: '2 3' },
  back: { label: 'Back', stroke: INK2, width: 2, dash: '10 4 2 4' },
  'overlay-open': { label: 'Open dialog', stroke: MUTED, width: 3, dash: '' },
  'overlay-close': { label: 'Close dialog', stroke: MUTED, width: 3, dash: '4 4' },
};

// ---------------------------------------------------------------- small SVG helpers

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function attrs(map) {
  return Object.entries(map).filter(([, value]) => value !== undefined && value !== '' && value !== false)
    .map(([key, value]) => ' ' + key + '="' + esc(value) + '"').join('');
}

function text(x, y, value, o = {}) {
  return '<text' + attrs({
    x, y, 'font-size': o.size ?? 16, 'font-weight': o.bold ? 700 : undefined, fill: o.fill ?? INK,
    'text-anchor': o.anchor, 'text-decoration': o.underline ? 'underline' : undefined,
    'font-family': o.mono ? 'ui-monospace, Menlo, Consolas, monospace' : undefined,
  }) + '>' + esc(value) + '</text>';
}

function rect(x, y, w, h, o = {}) {
  return '<rect' + attrs({
    x, y, width: w, height: h, rx: o.rx, fill: o.fill ?? 'none', stroke: o.stroke,
    'stroke-width': o.stroke ? (o.sw ?? 1) : undefined, 'stroke-dasharray': o.dash,
  }) + '/>';
}

function line(x1, y1, x2, y2, stroke, width) {
  return '<line' + attrs({ x1, y1, x2, y2, stroke, 'stroke-width': width }) + '/>';
}

/** Splits text into lines of at most max characters, at spaces. A longer word gets a line of its own. */
export function wrap(value, max) {
  const lines = [];
  let current = '';
  for (const word of String(value).split(/\s+/).filter(Boolean)) {
    if (!current) current = word;
    else if ((current + ' ' + word).length <= max) current += ' ' + word;
    else { lines.push(current); current = word; }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

function badge(cx, cy, n) {
  return '<circle' + attrs({ cx, cy, r: 11, fill: PAPER, stroke: INK, 'stroke-width': 1.5 }) + '/>' +
    text(cx, cy + 4, n, { size: 12, bold: true, anchor: 'middle' });
}

// ---------------------------------------------------------------- the flow

function transitionNumbers(flow) {
  return flow.transitions.map((transition, index) => ({ ...transition, n: index + 1 }));
}

/** Transitions out of a state that no button on it causes: the prototype reaches them through a marked link. */
function prototypeOnly(flow, state) {
  const buttons = state.elements.filter((element) => element.type === 'button').map((element) => element.to);
  return transitionNumbers(flow).filter((t) => t.from === state.id && !buttons.includes(t.to));
}

// ---------------------------------------------------------------- one low-fidelity screen

/** Draws elements in a column; returns the SVG parts, the next y and where each transition's hotspot sits. */
function blocks(flow, state, elements, x, w, y0) {
  const parts = [];
  const hot = {};
  const numbered = transitionNumbers(flow);
  let y = y0;
  for (const element of elements) {
    if (element.type === 'heading') {
      for (const row of wrap(element.text, Math.floor(w / 14))) { parts.push(text(x, y + 23, row, { size: 24, bold: true })); y += 32; }
      y += 12;
    } else if (element.type === 'text') {
      for (const row of wrap(element.text, Math.floor(w / 8))) { parts.push(text(x, y + 17, row, { fill: INK2 })); y += 24; }
      y += 16;
    } else if (element.type === 'error-summary') {
      const inner = [];
      let iy = y + 20;
      inner.push(text(x + 20, iy + 18, 'There is a problem', { size: 19, bold: true }));
      iy += 32;
      for (const item of element.items) {
        for (const row of wrap(item, Math.floor((w - 40) / 8))) { inner.push(text(x + 20, iy + 17, row, { underline: true })); iy += 24; }
        iy += 4;
      }
      iy += 12;
      parts.push(rect(x + 2, y + 2, w - 4, iy - y - 4, { fill: PAPER, stroke: INK, sw: 4 }), ...inner);
      y = iy + 24;
    } else if (element.type === 'field') {
      const top = y;
      const fx = element.error ? x + 16 : x;
      const fw = element.error ? w - 16 : w;
      for (const row of wrap(element.label, Math.floor(fw / 8))) { parts.push(text(fx, y + 17, row, { bold: true })); y += 24; }
      y += 4;
      if (element.hint) {
        for (const row of wrap(element.hint, Math.floor(fw / 7))) { parts.push(text(fx, y + 15, row, { size: 14, fill: MUTED })); y += 20; }
        y += 4;
      }
      if (element.error) {
        for (const row of wrap('Error: ' + element.error, Math.floor(fw / 8))) { parts.push(text(fx, y + 17, row, { bold: true })); y += 24; }
        y += 4;
      }
      parts.push(rect(fx, y, fw, 48, { fill: PAPER, stroke: element.error ? INK : MUTED, sw: element.error ? 4 : 2 }));
      if (element.value) parts.push(text(fx + 12, y + 30, element.value.length > Math.floor((fw - 24) / 8) ? element.value.slice(0, Math.floor((fw - 24) / 8) - 1) + '…' : element.value, { fill: INK2 }));
      y += 48;
      if (element.error) parts.push(rect(x, top, 4, y - top, { fill: INK }));
      y += 24;
    } else if (element.type === 'summary') {
      for (const [key, value] of element.rows) {
        const keys = wrap(key, 14);
        const values = wrap(value, Math.floor((w - 128) / 8));
        keys.forEach((row, i) => parts.push(text(x, y + 25 + i * 24, row, { bold: true })));
        values.forEach((row, i) => parts.push(text(x + 128, y + 25 + i * 24, row, { fill: INK2 })));
        y += Math.max(keys.length, values.length) * 24 + 16;
        parts.push(line(x, y, x + w, y, LINE, 1));
      }
      y += 24;
    } else if (element.type === 'table') {
      const cw = Math.floor(w / element.columns.length);
      element.columns.forEach((column, i) => parts.push(text(x + i * cw, y + 20, column, { size: 14, bold: true })));
      y += 32;
      parts.push(line(x, y, x + w, y, INK, 2));
      for (const row of element.rows) {
        row.forEach((cell, i) => parts.push(text(x + i * cw, y + 24, cell, { size: 14, fill: INK2 })));
        y += 36;
        parts.push(line(x, y, x + w, y, LINE, 1));
      }
      y += 24;
    } else if (element.type === 'button') {
      const transition = numbered.find((t) => t.from === state.id && t.to === element.to);
      const n = transition ? transition.n : '?';
      const group = [];
      if (element.variant === 'link') {
        const width = element.label.length * 8;
        group.push(text(x, y + 17, element.label, { underline: true }), badge(x + width + 20, y + 12, n));
        if (transition) hot[n] = y + 12;
        y += 40;
      } else {
        const bw = Math.min(w - 36, element.label.length * 9 + 48);
        const primary = element.variant === 'primary';
        group.push(
          rect(x, y, bw, 48, { rx: 4, fill: primary ? INK2 : FILL, stroke: primary ? undefined : MUTED, sw: 2 }),
          text(x + Math.floor(bw / 2), y + 30, element.label, { anchor: 'middle', bold: true, fill: primary ? PAPER : INK }),
          badge(x + bw + 20, y + 24, n),
        );
        if (transition) hot[n] = y + 24;
        y += 64;
      }
      parts.push('<g' + attrs({ 'data-to': element.to, 'data-transition': n }) + '>' + group.join('') + '</g>');
    }
  }
  const extra = prototypeOnly(flow, state);
  if (extra.length) {
    const inner = [text(x + 16, y + 26, 'Prototype only: no button causes these', { size: 14, bold: true })];
    let iy = y + 40;
    for (const t of extra) {
      const rows = wrap(t.trigger, Math.floor((w - 64) / 7));
      inner.push(badge(x + 28, iy + 12, t.n));
      rows.forEach((row, i) => inner.push(text(x + 48, iy + 17 + i * 20, row, { size: 14, fill: INK2 })));
      hot[t.n] = iy + 12;
      iy += Math.max(rows.length * 20, 24) + 12;
    }
    parts.push(rect(x, y, w, iy - y + 4, { stroke: MUTED, sw: 2, dash: '6 4' }), ...inner);
    y = iy + 28;
  }
  return { parts, y, hot };
}

const FRAME_W = 390;
const FRAME_MIN_H = 844;

/** One state as a low-fidelity board: the SVG body, its height and the y of each transition's hotspot. */
export function wireframe(flow, state) {
  const top = [
    rect(0, 0, FRAME_W, 56, { fill: FILL }),
    text(24, 35, flow.product.name, { bold: true }),
    text(FRAME_W - 24, 35, KIND_LABEL[state.kind] ?? state.kind, { size: 14, fill: INK2, anchor: 'end' }),
  ];
  if (state.kind === 'overlay') {
    const cardTop = 168;
    const content = blocks(flow, state, state.elements, 48, FRAME_W - 96, cardTop + 24);
    const height = Math.max(FRAME_MIN_H, content.y + 24);
    const parts = [
      rect(0, 56, FRAME_W, height - 56, { fill: '#bdbdbd' }),
      text(24, 96, 'The screen underneath stays in place', { size: 14, fill: INK }),
      rect(24, cardTop, FRAME_W - 48, content.y - cardTop, { rx: 8, fill: PAPER, stroke: INK, sw: 2 }),
    ];
    return { body: [...parts, ...top, ...content.parts].join('\n'), height, hot: content.hot };
  }
  const content = blocks(flow, state, state.elements, 24, FRAME_W - 48, 88);
  const height = Math.max(FRAME_MIN_H, content.y + 24);
  return { body: [...top, ...content.parts].join('\n'), height, hot: content.hot };
}

function wireframeSvg(flow, state) {
  const board = wireframe(flow, state);
  return '<svg' + attrs({ xmlns: 'http://www.w3.org/2000/svg', width: FRAME_W, height: board.height, viewBox: '0 0 ' + FRAME_W + ' ' + board.height, role: 'img', 'aria-labelledby': 'title desc', 'font-family': FONT }) + '>\n' +
    '<title id="title">' + esc(state.title + ' (' + state.id + '), low fidelity, 390 px') + '</title>\n' +
    '<desc id="desc">' + esc(state.purpose + ' Numbered circles are the transition numbers on the sitemap.') + '</desc>\n' +
    rect(0, 0, FRAME_W, board.height, { fill: PAPER }) + '\n' + board.body + '\n' +
    rect(1, 1, FRAME_W - 2, board.height - 2, { stroke: LINE, sw: 2 }) + '\n</svg>\n';
}

// ---------------------------------------------------------------- diagrams: sitemap and journey

/**
 * Lays states out in one column per screen and routes every transition with right angles through the gaps between
 * columns, so no line crosses a box. Neighbouring columns are joined straight; longer rightward transitions run in
 * lanes above the grid and leftward ones below it; a transition within one screen loops through the gap on its right.
 */
function diagram(flow, o) {
  const numbered = transitionNumbers(flow);
  const screens = flow.screens.map((screen) => screen.id);
  const col = {};
  const row = {};
  const perScreen = {};
  for (const state of flow.states) {
    col[state.id] = screens.indexOf(state.screen);
    row[state.id] = perScreen[state.screen] ?? 0;
    perScreen[state.screen] = row[state.id] + 1;
  }
  const rows = Math.max(...Object.values(perScreen));
  const size = Object.fromEntries(flow.states.map((state) => [state.id, o.size(state)]));
  const colW = Math.max(...Object.values(size).map((s) => s.w));
  const rowH = Array.from({ length: rows }, (_, r) => Math.max(...flow.states.filter((s) => row[s.id] === r).map((s) => size[s.id].h)));
  const LANE = 26;
  const G = o.gap;
  const routes = numbered.map((t) => {
    const dc = col[t.to] - col[t.from];
    if (dc === 0) return { t, type: 'same', src: 'R', tgt: 'R' };
    if (Math.abs(dc) === 1) return { t, type: 'adj', src: dc > 0 ? 'R' : 'L', tgt: dc > 0 ? 'L' : 'R' };
    return { t, type: 'long', dir: dc > 0 ? 'right' : 'left', src: dc > 0 ? 'R' : 'L', tgt: dc > 0 ? 'L' : 'R' };
  });
  let above = 0;
  let below = 0;
  for (const route of routes) if (route.type === 'long') route.lane = route.dir === 'right' ? above++ : below++;
  const M = G;
  const headerY = 36;
  const gridTop = 64 + above * LANE + (above ? 24 : 0);
  const rowY = [];
  let cursor = gridTop;
  for (let r = 0; r < rows; r++) { rowY.push(cursor); cursor += rowH[r] + o.rowGap; }
  const gridBottom = cursor - o.rowGap;
  const width = M * 2 + screens.length * colW + (screens.length - 1) * G;
  const box = {};
  for (const state of flow.states) box[state.id] = { x: M + col[state.id] * (colW + G), y: rowY[row[state.id]], w: size[state.id].w, h: size[state.id].h };

  // Ports: where each transition leaves and enters a box side, spread evenly and ordered by the other end.
  const ports = {};
  routes.forEach((route) => {
    for (const end of ['src', 'tgt']) {
      const id = end === 'src' ? route.t.from : route.t.to;
      const other = end === 'src' ? route.t.to : route.t.from;
      const key = id + '|' + route[end];
      (ports[key] ??= []).push({ route, end, other });
    }
  });
  for (const [key, list] of Object.entries(ports)) {
    const id = key.split('|')[0];
    const b = box[id];
    list.sort((a, c) => row[a.other] - row[c.other] || col[a.other] - col[c.other] || a.route.t.n - c.route.t.n);
    const free = list.filter((p) => !(p.end === 'src' && o.sourcePort && o.sourcePort(p.route.t, b) !== undefined));
    free.forEach((p, i) => { p.route[p.end + 'Y'] = Math.round(b.y + (b.h * (i + 1)) / (free.length + 1)); });
    for (const p of list) if (!free.includes(p)) p.route.srcY = Math.round(o.sourcePort(p.route.t, b));
  }
  const gapUse = {};
  const gapX = (g) => {
    const k = gapUse[g] = (gapUse[g] ?? -1) + 1;
    const left = g < 0 ? M - G : M + g * (colW + G) + colW;
    return left + 14 + 12 * k;
  };
  const sideX = (id, side) => (side === 'R' ? box[id].x + box[id].w : box[id].x);
  const edges = [];
  for (const route of routes) {
    const { t } = route;
    const sx = sideX(t.from, route.src);
    const tx = sideX(t.to, route.tgt);
    const sy = route.srcY;
    const ty = route.tgtY;
    let d;
    let lx;
    let ly;
    if (route.type === 'same') {
      const gx = gapX(col[t.from]);
      d = 'M' + sx + ' ' + sy + ' H' + gx + ' V' + ty + ' H' + tx;
      lx = gx; ly = Math.round((sy + ty) / 2);
    } else if (route.type === 'adj') {
      d = 'M' + sx + ' ' + sy + ' L' + tx + ' ' + ty;
      lx = Math.round((sx + tx) / 2); ly = Math.round((sy + ty) / 2);
    } else {
      const right = route.dir === 'right';
      const gx1 = gapX(right ? col[t.from] : col[t.from] - 1);
      const gx2 = gapX(right ? col[t.to] - 1 : col[t.to]);
      const laneY = right ? gridTop - 24 - route.lane * LANE : gridBottom + 24 + route.lane * LANE;
      d = 'M' + sx + ' ' + sy + ' H' + gx1 + ' V' + laneY + ' H' + gx2 + ' V' + ty + ' H' + tx;
      lx = Math.round((gx1 + gx2) / 2); ly = laneY;
    }
    const style = EDGE[t.kind] ?? EDGE.forward;
    edges.push('<path' + attrs({ d, fill: 'none', stroke: style.stroke, 'stroke-width': style.width, 'stroke-dasharray': style.dash, 'marker-end': 'url(#arrow-' + (style.stroke === INK ? 'ink' : 'grey') + ')', 'data-transition': t.n }) + '><title>' + esc(t.n + '. ' + t.from + ' to ' + t.to + ': ' + t.trigger) + '</title></path>');
    edges.push(badge(lx, ly, t.n));
  }
  const legendTop = gridBottom + (below ? 24 + below * LANE : 0) + 40;
  const legend = [];
  let lx = M - G + 24;
  let ly = legendTop;
  for (const [kind, style] of Object.entries(EDGE)) {
    const itemW = 64 + style.label.length * 8 + 24;
    if (lx + itemW > width - 24) { lx = M - G + 24; ly += 28; }
    legend.push('<path' + attrs({ d: 'M' + lx + ' ' + ly + ' H' + (lx + 48), fill: 'none', stroke: style.stroke, 'stroke-width': style.width, 'stroke-dasharray': style.dash, 'marker-end': 'url(#arrow-' + (style.stroke === INK ? 'ink' : 'grey') + ')', 'data-kind': kind }) + '/>');
    legend.push(text(lx + 60, ly + 5, style.label, { size: 14 }));
    lx += itemW;
  }
  ly += 32;
  if (o.legendNote) { legend.push(text(M - G + 24, ly, o.legendNote, { size: 14, fill: INK2 })); ly += 24; }
  const height = ly + 16;
  const headers = flow.screens.map((screen, c) => text(M + c * (colW + G) + Math.floor(colW / 2), headerY, screen.name, { size: 14, bold: true, anchor: 'middle' }));
  const boxes = flow.states.map((state) => o.draw(state, box[state.id]));
  const defs = '<defs>' + ['ink', 'grey'].map((name) => '<marker' + attrs({ id: 'arrow-' + name, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse' }) + '><path' + attrs({ d: 'M0 0 L10 5 L0 10 z', fill: name === 'ink' ? INK : MUTED }) + '/></marker>').join('') + '</defs>';
  return '<svg' + attrs({ xmlns: 'http://www.w3.org/2000/svg', width, height, viewBox: '0 0 ' + width + ' ' + height, role: 'img', 'aria-labelledby': 'title desc', 'font-family': FONT }) + '>\n' +
    '<title id="title">' + esc(o.title) + '</title>\n<desc id="desc">' + esc(o.desc) + '</desc>\n' + defs + '\n' +
    rect(0, 0, width, height, { fill: PAPER }) + '\n' + headers.join('\n') + '\n' + boxes.join('\n') + '\n' + edges.join('\n') + '\n' + legend.join('\n') + '\n</svg>\n';
}

function sitemapSvg(flow) {
  return diagram(flow, {
    gap: 112,
    rowGap: 48,
    size: () => ({ w: 184, h: 104 }),
    title: flow.product.name + ' sitemap: ' + flow.states.length + ' states and ' + flow.transitions.length + ' transitions',
    desc: 'One column per screen. Each box is a state; each numbered line is a transition, listed with its cause in the transition table. Lines are styled by kind: see the legend.',
    legendNote: 'Box borders: solid for a screen, thick for success, dashed for an error, dotted for a branch outside this flow, grey for a dialog or an empty state.',
    draw: (state, b) => {
      const style = {
        screen: { stroke: INK, sw: 2 }, success: { stroke: INK, sw: 4 }, error: { stroke: INK, sw: 3, dash: '7 4' },
        boundary: { stroke: INK, sw: 2, dash: '2 3' }, overlay: { stroke: MUTED, sw: 3, fill: '#f5f5f5' }, empty: { stroke: MUTED, sw: 2 },
      }[state.kind] ?? { stroke: INK, sw: 2 };
      const titles = wrap(state.title, 22).slice(0, 3);
      const parts = [rect(b.x, b.y, b.w, b.h, { rx: 6, fill: style.fill ?? PAPER, stroke: style.stroke, sw: style.sw, dash: style.dash })];
      titles.forEach((row, i) => parts.push(text(b.x + 12, b.y + 22 + i * 18, row, { size: 14, bold: true })));
      const kindY = b.y + 22 + titles.length * 18 + 4;
      parts.push(text(b.x + 12, kindY, KIND_LABEL[state.kind] ?? state.kind, { size: 12, fill: INK2 }));
      parts.push(text(b.x + 12, kindY + 16, state.id, { size: 11, fill: MUTED, mono: true }));
      return '<g' + attrs({ 'data-state': state.id }) + '>' + parts.join('') + '</g>';
    },
  });
}

const JOURNEY_SCALE = 0.5;
const JOURNEY_LABEL = 32;

function journeySvg(flow) {
  const boards = Object.fromEntries(flow.states.map((state) => [state.id, wireframe(flow, state)]));
  return diagram(flow, {
    gap: 136,
    rowGap: 56,
    size: (state) => ({ w: FRAME_W * JOURNEY_SCALE, h: JOURNEY_LABEL + Math.ceil(boards[state.id].height * JOURNEY_SCALE) }),
    sourcePort: (t, b) => {
      const y = boards[t.from].hot[t.n];
      return y === undefined ? undefined : b.y + JOURNEY_LABEL + y * JOURNEY_SCALE;
    },
    title: flow.product.name + ' journey: every low-fidelity screen on one canvas, connected by its ' + flow.transitions.length + ' transitions',
    desc: 'The ' + flow.states.length + ' low-fidelity screens, one column per screen of the sitemap. Each line starts at the button or prototype-only link that causes it and carries the same number as on the sitemap.',
    legendNote: 'Each line leaves from the control that causes it. The same screens, one per file, are in wireframes/.',
    draw: (state, b) => {
      const board = boards[state.id];
      return '<g' + attrs({ 'data-state': state.id }) + '>' +
        text(b.x, b.y + 20, state.title, { size: 14, bold: true }) +
        '<g' + attrs({ transform: 'translate(' + b.x + ' ' + (b.y + JOURNEY_LABEL) + ') scale(' + JOURNEY_SCALE + ')' }) + '>' +
        rect(0, 0, FRAME_W, board.height, { fill: PAPER }) + board.body + rect(1, 1, FRAME_W - 2, board.height - 2, { stroke: LINE, sw: 2 }) +
        '</g></g>';
    },
  });
}

/** The high-fidelity phone screens on one canvas, laid out and connected exactly like the low-fidelity journey. */
function hifiJourneySvg(flow, boards, background) {
  return diagram(flow, {
    gap: 136,
    rowGap: 56,
    size: (state) => ({ w: FRAME_W * JOURNEY_SCALE, h: JOURNEY_LABEL + Math.ceil(boards[state.id].height * JOURNEY_SCALE) }),
    sourcePort: (t, b) => {
      const y = boards[t.from].hot[t.n];
      return y === undefined ? undefined : b.y + JOURNEY_LABEL + y * JOURNEY_SCALE;
    },
    title: flow.product.name + ' journey in high fidelity: every phone screen on one canvas, connected by its ' + flow.transitions.length + ' transitions',
    desc: 'The ' + flow.states.length + ' high-fidelity phone screens, placed as on the low-fidelity journey. Each line starts at the control that causes it, or at the side of the screen when no control does, and carries the same number as on the sitemap.',
    legendNote: 'The screens are the files in screens/phone/ at half size. Lines that start at the side of a screen have no button: see the prototype-only links.',
    draw: (state, b) => {
      const board = boards[state.id];
      return '<g' + attrs({ 'data-state': state.id }) + '>' +
        text(b.x, b.y + 20, state.title, { size: 14, bold: true }) +
        '<g' + attrs({ transform: 'translate(' + b.x + ' ' + (b.y + JOURNEY_LABEL) + ') scale(' + JOURNEY_SCALE + ')' }) + '>' +
        board.body + rect(1, 1, FRAME_W - 2, board.height - 2, { stroke: background, sw: 2 }) +
        '</g></g>';
    },
  });
}

// ---------------------------------------------------------------- checks

function check(id, description, failures, detail) {
  return { id, description, pass: failures.length === 0, failures, ...(detail ? { detail } : {}) };
}

export function checkFlow(flow, tokenFile, pairs) {
  const ids = flow.states.map((state) => state.id);
  const kind = Object.fromEntries(flow.states.map((state) => [state.id, state.kind]));
  const out = (id) => flow.transitions.filter((t) => t.from === id);
  const numbered = transitionNumbers(flow);
  const checks = [];
  checks.push(check('unique-states', 'Every state has its own id.', ids.filter((id, i) => ids.indexOf(id) !== i)));
  checks.push(check('screens-known', 'Every state belongs to a screen in the screen list.', flow.states.filter((s) => !flow.screens.some((screen) => screen.id === s.screen)).map((s) => s.id)));
  checks.push(check('transitions-name-states', 'Every transition starts and ends at a state that exists.', numbered.filter((t) => !ids.includes(t.from) || !ids.includes(t.to)).map((t) => 'transition ' + t.n)));
  const seen = new Set([flow.start]);
  const queue = [flow.start];
  while (queue.length) { const next = queue.shift(); for (const t of out(next)) if (!seen.has(t.to)) { seen.add(t.to); queue.push(t.to); } }
  checks.push(check('reachable', 'Every state can be reached from the start state.', ids.filter((id) => !seen.has(id))));
  checks.push(check('no-dead-ends', 'Every state has at least one way out.', ids.filter((id) => out(id).length === 0)));
  checks.push(check('errors-recover', 'Every error state has a way out to a state that is not an error.', ids.filter((id) => kind[id] === 'error' && !out(id).some((t) => kind[t.to] && kind[t.to] !== 'error'))));
  checks.push(check('dialogs-close', 'Every dialog has a close transition back to the screen underneath.', ids.filter((id) => kind[id] === 'overlay' && !out(id).some((t) => t.kind === 'overlay-close'))));
  const unwired = [];
  for (const state of flow.states) for (const element of state.elements) {
    if (element.type === 'button' && !flow.transitions.some((t) => t.from === state.id && t.to === element.to)) unwired.push(state.id + ': ' + element.label);
  }
  checks.push(check('buttons-wired', 'Every button starts a transition in the flow.', unwired));
  const pairKeys = numbered.map((t) => t.from + '>' + t.to);
  checks.push(check('one-transition-per-pair', 'No two transitions join the same two states in the same direction.', numbered.filter((t, i) => pairKeys.indexOf(t.from + '>' + t.to) !== i).map((t) => 'transition ' + t.n)));
  const prototype = flow.states.flatMap((state) => prototypeOnly(flow, state).map((t) => t.n));
  checks.push(check('prototype-only-marked', 'Every transition that no button causes is drawn as a prototype-only link on its screen.', [], { transitions: prototype }));
  const tokens = flattenTokens(tokenFile);
  const results = [];
  const contrastFailures = [];
  for (const group of pairs.groups) {
    for (const [fg, bg] of group.pairs) {
      let ratio = null;
      let problem;
      try { ratio = contrast(resolveToken(tokens, fg), resolveToken(tokens, bg)); } catch (error) { problem = error.message; }
      const pass = ratio !== null && ratio >= group.minimum;
      results.push({ group: group.name, foreground: fg, background: bg, foregroundValue: problem ? null : resolveToken(tokens, fg), backgroundValue: problem ? null : resolveToken(tokens, bg), ratio: ratio === null ? null : Math.floor(ratio * 100) / 100, minimum: group.minimum, pass, ...(problem ? { problem } : {}) });
      if (!pass) contrastFailures.push(fg + ' on ' + bg + (problem ? ' (' + problem + ')' : ''));
    }
  }
  checks.push(check('token-contrast', 'Every token colour pair meets its minimum WCAG 2 contrast ratio.', contrastFailures));
  return { product: flow.product.name, start: flow.start, states: ids.length, transitions: flow.transitions.length, pass: checks.every((c) => c.pass), checks, contrast: results };
}

// ---------------------------------------------------------------- summary and manifest

function summary(result, outputs) {
  const failed = result.checks.filter((c) => !c.pass);
  const lines = [
    '# ' + result.product + ': low-fidelity artifacts and flow checks',
    '',
    'Generated by tools/ux_pathway.mjs from ' + INPUTS.flow + ', ' + INPUTS.pairs + ', ' + INPUTS.tokens + ' and ' + INPUTS.brand + '. Do not edit: change an input and rerun the script.',
    '',
    'States: ' + result.states + '. Transitions: ' + result.transitions + '. Start: ' + result.start + '.',
    '',
    failed.length ? 'Result: ' + failed.length + ' of ' + result.checks.length + ' checks failed.' : 'Result: all ' + result.checks.length + ' checks passed.',
    '',
    '| Check | Result | Problems |',
    '| --- | --- | --- |',
    ...result.checks.map((c) => '| ' + c.description + ' | ' + (c.pass ? 'passed' : 'failed') + ' | ' + (c.failures.length ? c.failures.join('; ') : 'none') + ' |'),
    '',
    '## Token contrast',
    '',
    '| Group | Foreground | Background | Ratio | Minimum | Result |',
    '| --- | --- | --- | --- | --- | --- |',
    ...result.contrast.map((p) => '| ' + p.group + ' | ' + p.foreground + ' (' + (p.foregroundValue ?? 'unavailable') + ') | ' + p.background + ' (' + (p.backgroundValue ?? 'unavailable') + ') | ' + (p.ratio === null ? 'unavailable' : p.ratio.toFixed(2) + ':1') + ' | ' + p.minimum + ':1 | ' + (p.pass ? 'passed' : 'failed') + ' |'),
    '',
    'Ratios are rounded down to two decimals, so a ratio shown never overstates the real one.',
    '',
    '## Files',
    '',
    ...outputs.map((name) => '- ' + name),
    '',
    '## High fidelity',
    '',
    'The brand and style guide, the components, the high-fidelity screens and their visual-fidelity check are in style-guide.md and fidelity-report.md.',
    '',
    '## Not checked here',
    '',
    '- Whether the screens are clear or pleasant to a person. That needs the peer review in the kata.',
    '- Opening these SVG files in Penpot, Figma or another editor. Both vendors document SVG as a way to move designs between tools, but the Dojo has not tried it with these files.',
    '- Colours other than the token pairs listed above, and anything about the working example page (the browser tests cover that).',
    '',
  ];
  return lines.join('\n');
}

/** Builds every output file from parsed inputs. Pure: no file system access. */
export function render({ flow, tokens, pairs, brand, hashes }) {
  const files = [];
  for (const state of flow.states) files.push(['wireframes/' + state.id + '.svg', wireframeSvg(flow, state)]);
  files.push(['sitemap.svg', sitemapSvg(flow)]);
  files.push(['journey.svg', journeySvg(flow)]);
  const result = checkFlow(flow, tokens, pairs);
  files.push(['flow-checks.json', JSON.stringify(result, null, 2) + '\n']);
  const hifi = renderHifi({ flow, tokenFile: tokens, pairs, brand });
  files.push(...hifi.files);
  files.push(['journey-high.svg', hifiJourneySvg(flow, hifi.phoneBoards, hifi.frameStroke)]);
  const outputs = [...files.map(([name]) => name), 'manifest.json', 'summary.md'].sort();
  const drawings = {};
  for (const [name, content] of files) {
    const size = /^<svg[^>]* width="(\d+)" height="(\d+)"/.exec(content);
    if (size) drawings[name] = { width: Number(size[1]), height: Number(size[2]) };
  }
  files.push(['manifest.json', JSON.stringify({ generator: 'tools/ux_pathway.mjs', inputs: hashes, outputs, drawings }, null, 2) + '\n']);
  files.push(['summary.md', summary(result, outputs)]);
  files.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return { files, failures: [...result.checks.filter((c) => !c.pass).map((c) => c.id + ': ' + c.failures.join(', ')), ...hifi.failures] };
}

// ---------------------------------------------------------------- command line

function readInput(packDir, name) {
  const path = join(packDir, name);
  let raw;
  try { raw = readFileSync(path); } catch (error) { throw new Error('cannot read ' + path + ': ' + error.message); }
  try { return { raw, data: JSON.parse(raw.toString('utf8')) }; } catch (error) { throw new Error(path + ' is not valid JSON: ' + error.message); }
}

function main(argv) {
  const [packDir, outDir] = argv;
  if (!packDir || !outDir) { console.error('usage: node ux_pathway.mjs <pack dir> <out dir>'); return 2; }
  const loaded = {};
  const hashes = {};
  for (const [key, name] of Object.entries(INPUTS)) {
    const input = readInput(packDir, name);
    loaded[key] = input.data;
    hashes[name] = createHash('sha256').update(input.raw).digest('hex');
  }
  const { files, failures } = render({ flow: loaded.flow, tokens: loaded.tokens, pairs: loaded.pairs, brand: loaded.brand, hashes });
  for (const [name, content] of files) {
    const path = join(outDir, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  if (failures.length) { console.error('ux_pathway: ' + failures.length + ' check(s) failed: ' + failures.join('; ')); return 1; }
  console.log('ux_pathway: wrote ' + files.length + ' files to ' + outDir + '; every check passed.');
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = main(process.argv.slice(2)); } catch (error) { console.error('ux_pathway: ' + error.message); process.exitCode = 2; }
}
