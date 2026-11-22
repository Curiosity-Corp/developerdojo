/**
 * UX pathway (M9), high fidelity: the brand and style guide, the component sheet and the responsive high-fidelity
 * screens of Pocket Invoice, drawn as SVG from the UX-003 token file and inputs/brand.json, and the visual-fidelity
 * report that checks those drawings against the tokens. Node standard library only; called by ux_pathway.mjs.
 *
 * Every colour, font size, font weight, corner radius and border width in a drawing comes from the token file. The
 * fidelity report does not take that on trust: it reads each finished SVG back as text and checks every value against
 * the tokens, the contrast of every text against the shape that is actually under it, the height and boundary
 * contrast of every control, and that every element of the flow appears as a named component at both widths.
 */
import { contrast, floor2, isLargeText, resolvedTokens } from './design_tokens.mjs';

// ---------------------------------------------------------------- tokens as a theme

/** The token values the drawings use, by role. Throws when the token file lacks one, naming it. */
export function theme(tokenFile) {
  const tokens = resolvedTokens(tokenFile);
  const get = (name) => {
    const token = tokens.get(name);
    if (!token) throw new Error('the token file has no ' + name + ', which the high-fidelity drawings need');
    return token.resolved;
  };
  const num = (name) => {
    const value = Number(get(name));
    if (!Number.isFinite(value)) throw new Error('token ' + name + ' is not a number: ' + get(name));
    return value;
  };
  return {
    tokens,
    page: get('color.surface.page'), card: get('color.surface.card'),
    text: get('color.text.default'), muted: get('color.text.muted'), inverse: get('color.text.inverse'),
    link: get('color.text.link'), errorText: get('color.text.error'),
    input: get('color.border.input'), subtle: get('color.border.subtle'), errorBorder: get('color.border.error'),
    primary: get('color.action.primary'), focus: get('color.focus.ring'),
    scrim: get('color.text.muted'),
    family: get('font.family.base'),
    s: num('font.size.s'), m: num('font.size.m'), l: num('font.size.l'), xl: num('font.size.xl'),
    regular: num('font.weight.regular'), bold: num('font.weight.bold'),
    sp: (step) => num('spacing.' + step),
    pad: num('space.page'), inset: num('space.inset'),
    rControl: num('radius.control'), rCard: num('radius.card'),
    thin: num('border-width.thin'), thick: num('border-width.thick'), bar: num('border-width.bar'),
    control: num('size.control'),
  };
}

/** The named components. Each lists the tokens it is drawn with; the report checks that every one exists. */
export const COMPONENTS = [
  { name: 'AppBar', about: 'The bar at the top: the wordmark, and on a desktop the link to Invoices once signed in.', tokens: ['color.surface.card', 'color.border.subtle', 'border-width.thin', 'color.action.primary', 'color.text.inverse', 'color.text.default', 'color.text.link', 'radius.card', 'font.size.m', 'font.weight.bold'] },
  { name: 'Heading/Page', about: 'One per screen: font.size.xl on a desktop, font.size.l on a phone and in a dialog.', tokens: ['font.size.xl', 'font.size.l', 'font.weight.bold', 'color.text.default'] },
  { name: 'Heading/Section', about: 'A smaller heading inside a screen.', tokens: ['font.size.m', 'font.weight.bold', 'color.text.default'] },
  { name: 'Text/Body', about: 'Explanations under a heading, in the muted text colour.', tokens: ['font.size.s', 'color.text.muted'] },
  { name: 'Button/Primary', about: 'The one main action on a screen. Full width on a phone, as wide as its label on a desktop.', tokens: ['color.action.primary', 'color.text.inverse', 'radius.control', 'size.control', 'font.size.s', 'font.weight.bold'] },
  { name: 'Button/Secondary', about: 'Any other action, such as Change details or Discard.', tokens: ['color.surface.card', 'color.border.input', 'border-width.thick', 'color.text.default', 'radius.control', 'size.control', 'font.weight.bold'] },
  { name: 'Button/Link', about: 'A way to another part of the app that is not an action, such as I already have an account.', tokens: ['color.text.link', 'font.size.s'] },
  { name: 'Field/Default', about: 'A label, an optional hint and a text input at least size.control tall.', tokens: ['font.size.s', 'font.weight.bold', 'color.text.default', 'color.text.muted', 'color.surface.card', 'color.border.input', 'border-width.thick', 'radius.control', 'size.control'] },
  { name: 'Field/Error', about: 'The same field with a bar, the word Error and a message that names the fix: never colour alone.', tokens: ['color.border.error', 'border-width.bar', 'color.text.error', 'border-width.thick', 'size.control'] },
  { name: 'ErrorSummary', about: 'Above the heading after a failed submit: lists every problem, each linked to its field. Pattern credited to the GOV.UK Design System.', tokens: ['color.border.error', 'border-width.bar', 'color.surface.card', 'color.text.error', 'font.size.m', 'font.weight.bold'] },
  { name: 'SummaryList', about: 'Key and value rows to check before sending: two columns on a desktop, stacked on a phone.', tokens: ['font.size.s', 'font.weight.bold', 'color.text.default', 'color.border.subtle', 'border-width.thin'] },
  { name: 'Table', about: 'A table on a desktop. On a phone each row becomes a stacked block, so nothing scrolls sideways.', tokens: ['font.size.s', 'font.weight.bold', 'color.text.default', 'color.border.subtle', 'border-width.thin', 'border-width.thick'] },
  { name: 'Dialog', about: 'A question over the screen: an opaque scrim in the muted text colour, and a card with the question and two buttons.', tokens: ['color.text.muted', 'color.surface.card', 'radius.card'] },
];
const COMPONENT_NAMES = new Set(COMPONENTS.map((component) => component.name));

// ---------------------------------------------------------------- SVG helpers

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function unesc(value) {
  return String(value).replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
}

function attrs(map) {
  return Object.entries(map).filter(([, value]) => value !== undefined && value !== '' && value !== false)
    .map(([key, value]) => ' ' + key + '="' + esc(value) + '"').join('');
}

function text(x, y, value, o) {
  return '<text' + attrs({
    x, y, 'font-size': o.size, 'font-weight': o.weight, fill: o.fill, 'text-anchor': o.anchor,
    'text-decoration': o.underline ? 'underline' : undefined, 'data-fit': o.fit,
  }) + '>' + esc(value) + '</text>';
}

function rect(x, y, w, h, o = {}) {
  return '<rect' + attrs({
    x, y, width: w, height: h, rx: o.rx, fill: o.fill ?? 'none', stroke: o.stroke,
    'stroke-width': o.stroke ? o.sw : undefined, 'data-control': o.control,
  }) + '/>';
}

function group(map, parts) {
  return '<g' + attrs(map) + '>' + parts.join('') + '</g>';
}

function svgDocument(width, height, family, title, desc, body) {
  return '<svg' + attrs({ xmlns: 'http://www.w3.org/2000/svg', width, height, viewBox: '0 0 ' + width + ' ' + height, role: 'img', 'aria-labelledby': 'title desc', 'font-family': family + ', sans-serif' }) + '>\n' +
    '<title id="title">' + esc(title) + '</title>\n<desc id="desc">' + esc(desc) + '</desc>\n' + body + '\n</svg>\n';
}

// ---------------------------------------------------------------- text layout

// The token file has no line-height or letter-width tokens. Line height is 1.35 times the size, rounded up to the 4 px
// grid of spacing.1; text width is estimated from the character count, generously, so the wrap holds in wider fallback
// fonts too. The site's browser tests measure the real width of every text at both sizes.
const lineHeight = (size) => 4 * Math.ceil((size * 1.35) / 4);
const baseline = (top, size) => top + Math.round((lineHeight(size) + size * 0.7) / 2);
const charWidth = (size, bold) => size * (bold ? 0.62 : 0.56);
const textWidth = (value, size, bold) => Math.ceil(String(value).length * charWidth(size, bold));

/** Splits text into lines that fit width at size, at spaces. A longer word gets a line of its own. */
export function wrapToWidth(value, width, size, bold) {
  const max = Math.max(1, Math.floor(width / charWidth(size, bold)));
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

function para(ctx, x, y, w, value, o = {}) {
  const size = o.size ?? ctx.s;
  const bold = Boolean(o.bold);
  const parts = [];
  for (const row of wrapToWidth(value, w, size, bold)) {
    parts.push(text(x, baseline(y, size), row, { size, weight: bold ? ctx.bold : undefined, fill: o.fill ?? ctx.text, underline: o.underline, fit: x + ' ' + (x + w) }));
    y += lineHeight(size);
  }
  return { parts, y };
}

// ---------------------------------------------------------------- components

function button(ctx, x, y, w, element, index) {
  const primary = element.variant === 'primary';
  const top = y + (ctx.control - lineHeight(ctx.s)) / 2;
  return group({ 'data-component': primary ? 'Button/Primary' : 'Button/Secondary', 'data-element': index, 'data-to': element.to }, [
    rect(x, y, w, ctx.control, { rx: ctx.rControl, fill: primary ? ctx.primary : ctx.card, stroke: primary ? undefined : ctx.input, sw: ctx.thick, control: 'button' }),
    text(x + w / 2, baseline(top, ctx.s), element.label, { size: ctx.s, weight: ctx.bold, fill: primary ? ctx.inverse : ctx.text, anchor: 'middle', fit: x + ' ' + (x + w) }),
  ]);
}

function appBar(ctx, brand, x0, y0, width, height, wide, signedIn) {
  const x = x0 + (wide ? ctx.sp(8) : ctx.pad);
  const mark = ctx.sp(8);
  const markTop = y0 + (height - mark) / 2;
  const parts = [
    rect(x0, y0, width, height, { fill: ctx.card }),
    rect(x0, y0 + height - ctx.thin, width, ctx.thin, { fill: ctx.subtle }),
    rect(x, markTop, mark, mark, { rx: ctx.rCard, fill: ctx.primary }),
    text(x + mark / 2, baseline(markTop + (mark - lineHeight(ctx.m)) / 2, ctx.m), brand.wordmark.mark, { size: ctx.m, weight: ctx.bold, fill: ctx.inverse, anchor: 'middle', fit: x + ' ' + (x + mark) }),
    text(x + mark + ctx.sp(3), baseline(y0 + (height - lineHeight(ctx.m)) / 2, ctx.m), brand.name, { size: ctx.m, weight: ctx.bold, fill: ctx.text, fit: (x + mark + ctx.sp(3)) + ' ' + (x0 + width - ctx.pad) }),
  ];
  if (wide && signedIn) {
    const right = x0 + width - ctx.sp(8);
    parts.push(text(right, baseline(y0 + (height - lineHeight(ctx.s)) / 2, ctx.s), brand.nav.label, { size: ctx.s, fill: ctx.link, underline: true, anchor: 'end', fit: (right - textWidth(brand.nav.label, ctx.s, false) - ctx.sp(4)) + ' ' + right }));
  }
  return group({ 'data-component': 'AppBar' }, parts);
}

/**
 * Lays out the elements of a state in a column of width w at x, from y0. Wide is the desktop layout. Returns the SVG
 * parts, the y after the last element, the gap after the last element (so a card can close without it) and the y
 * of the control that causes each transition, for the journey canvas.
 */
function blocks(ctx, flow, state, x, w, y0, wide) {
  const numbered = flow.transitions.map((transition, index) => ({ ...transition, n: index + 1 }));
  const headingIndex = state.elements.findIndex((element) => element.type === 'heading');
  const parts = [];
  const hot = {};
  let y = y0;
  let gap = 0;
  const after = (space) => { y += space; gap = space; };
  const hotspot = (to, cy) => {
    const transition = numbered.find((t) => t.from === state.id && t.to === to);
    if (transition) hot[transition.n] = cy;
  };
  const elements = state.elements;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.type === 'button' && element.variant !== 'link') {
      // A run of buttons: stacked at full width on a phone, side by side on a desktop.
      const run = [];
      while (i < elements.length && elements[i].type === 'button' && elements[i].variant !== 'link') { run.push([i, elements[i]]); i++; }
      i--;
      let bx = x;
      for (const [index, item] of run) {
        const bw = wide ? Math.min(w, textWidth(item.label, ctx.s, true) + 2 * ctx.sp(6)) : w;
        if (wide && bx > x && bx + bw > x + w) { bx = x; y += ctx.control + ctx.sp(4); }
        parts.push(button(ctx, bx, y, bw, item, index));
        hotspot(item.to, y + ctx.control / 2);
        if (wide) bx += bw + ctx.sp(4);
        else y += ctx.control + ctx.sp(4);
      }
      // Each button already left sp(4) below it; add sp(2) more, and count both as the gap after the run.
      if (wide) y += ctx.control + ctx.sp(4);
      y += ctx.sp(2);
      gap = ctx.sp(4) + ctx.sp(2);
      continue;
    }
    if (element.type === 'heading') {
      const page = i === headingIndex;
      const size = page ? (wide && state.kind !== 'overlay' ? ctx.xl : ctx.l) : ctx.m;
      const r = para(ctx, x, y, w, element.text, { size, bold: true });
      parts.push(group({ 'data-component': page ? 'Heading/Page' : 'Heading/Section', 'data-element': i }, r.parts));
      y = r.y;
      after(page ? ctx.sp(4) : ctx.sp(2));
    } else if (element.type === 'text') {
      const r = para(ctx, x, y, w, element.text, { fill: ctx.muted });
      parts.push(group({ 'data-component': 'Text/Body', 'data-element': i }, r.parts));
      y = r.y;
      after(ctx.sp(6));
    } else if (element.type === 'error-summary') {
      const inner = x + ctx.bar + ctx.inset;
      const iw = w - 2 * (ctx.bar + ctx.inset);
      const title = para(ctx, inner, y + ctx.bar + ctx.inset, iw, 'There is a problem', { size: ctx.m, bold: true });
      let iy = title.y + ctx.sp(2);
      const items = [];
      for (const item of element.items) {
        const r = para(ctx, inner, iy, iw, item, { bold: true, fill: ctx.errorText, underline: true });
        items.push(...r.parts);
        iy = r.y + ctx.sp(2);
      }
      const h = iy - ctx.sp(2) + ctx.inset + ctx.bar - y;
      parts.push(group({ 'data-component': 'ErrorSummary', 'data-element': i }, [
        rect(x + ctx.bar / 2, y + ctx.bar / 2, w - ctx.bar, h - ctx.bar, { fill: ctx.card, stroke: ctx.errorBorder, sw: ctx.bar }),
        ...title.parts, ...items,
      ]));
      y += h;
      after(ctx.sp(6));
    } else if (element.type === 'field') {
      const error = Boolean(element.error);
      const fx = error ? x + ctx.bar + ctx.sp(3) : x;
      const fw = w - (fx - x);
      const top = y;
      const p = [];
      let r = para(ctx, fx, y, fw, element.label, { bold: true });
      p.push(...r.parts);
      y = r.y;
      if (element.hint) { r = para(ctx, fx, y, fw, element.hint, { fill: ctx.muted }); p.push(...r.parts); y = r.y; }
      if (error) { r = para(ctx, fx, y, fw, 'Error: ' + element.error, { bold: true, fill: ctx.errorText }); p.push(...r.parts); y = r.y; }
      y += ctx.sp(1);
      p.push(rect(fx, y, fw, ctx.control, { rx: ctx.rControl, fill: ctx.card, stroke: error ? ctx.errorBorder : ctx.input, sw: ctx.thick, control: 'input' }));
      if (element.value) {
        const room = fw - 2 * ctx.sp(3);
        const max = Math.floor(room / charWidth(ctx.s, false));
        const value = element.value.length > max ? element.value.slice(0, max - 1) + '…' : element.value;
        p.push(text(fx + ctx.sp(3), baseline(y + (ctx.control - lineHeight(ctx.s)) / 2, ctx.s), value, { size: ctx.s, fill: ctx.text, fit: (fx + ctx.sp(3)) + ' ' + (fx + fw - ctx.sp(3)) }));
      }
      y += ctx.control;
      if (error) p.unshift(rect(x, top, ctx.bar, y - top, { fill: ctx.errorBorder }));
      parts.push(group({ 'data-component': error ? 'Field/Error' : 'Field/Default', 'data-element': i }, p));
      after(ctx.sp(6));
    } else if (element.type === 'summary') {
      const p = [];
      const keyWidth = Math.round(w * 0.35);
      for (const [key, value] of element.rows) {
        if (wide) {
          const a = para(ctx, x, y + ctx.sp(3), keyWidth - ctx.sp(4), key, { bold: true });
          const b = para(ctx, x + keyWidth, y + ctx.sp(3), w - keyWidth, value);
          p.push(...a.parts, ...b.parts);
          y = Math.max(a.y, b.y) + ctx.sp(3);
        } else {
          const a = para(ctx, x, y + ctx.sp(3), w, key, { bold: true });
          const b = para(ctx, x, a.y, w, value);
          p.push(...a.parts, ...b.parts);
          y = b.y + ctx.sp(3);
        }
        p.push(rect(x, y, w, ctx.thin, { fill: ctx.subtle }));
        y += ctx.thin;
      }
      parts.push(group({ 'data-component': 'SummaryList', 'data-element': i, 'data-variant': wide ? 'columns' : 'stacked' }, p));
      after(ctx.sp(6));
    } else if (element.type === 'table') {
      const p = [];
      if (wide) {
        const cw = Math.floor(w / element.columns.length);
        element.columns.forEach((column, k) => p.push(...para(ctx, x + k * cw, y + ctx.sp(2), cw - ctx.sp(2), column, { bold: true }).parts));
        y += ctx.sp(2) + lineHeight(ctx.s) + ctx.sp(2);
        p.push(rect(x, y, w, ctx.thick, { fill: ctx.text }));
        y += ctx.thick;
        for (const row of element.rows) {
          let next = y;
          row.forEach((cell, k) => { const r = para(ctx, x + k * cw, y + ctx.sp(3), cw - ctx.sp(2), cell); p.push(...r.parts); next = Math.max(next, r.y); });
          y = next + ctx.sp(3);
          p.push(rect(x, y, w, ctx.thin, { fill: ctx.subtle }));
          y += ctx.thin;
        }
      } else {
        const keyWidth = Math.min(ctx.sp(12) * 2 + ctx.sp(8), Math.round(w * 0.4));
        p.push(rect(x, y, w, ctx.thick, { fill: ctx.text }));
        y += ctx.thick;
        for (const row of element.rows) {
          y += ctx.sp(3);
          row.forEach((cell, k) => {
            const a = para(ctx, x, y, keyWidth - ctx.sp(2), element.columns[k] ?? '', { bold: true });
            const b = para(ctx, x + keyWidth, y, w - keyWidth, cell);
            p.push(...a.parts, ...b.parts);
            y = Math.max(a.y, b.y) + ctx.sp(1);
          });
          y += ctx.sp(2);
          p.push(rect(x, y, w, ctx.thin, { fill: ctx.subtle }));
          y += ctx.thin;
        }
      }
      parts.push(group({ 'data-component': 'Table', 'data-element': i, 'data-variant': wide ? 'table' : 'stacked' }, p));
      after(ctx.sp(6));
    } else if (element.type === 'button') {
      const r = para(ctx, x, y, w, element.label, { fill: ctx.link, underline: true });
      parts.push(group({ 'data-component': 'Button/Link', 'data-element': i, 'data-to': element.to }, r.parts));
      hotspot(element.to, y + lineHeight(ctx.s) / 2);
      y = r.y;
      after(ctx.sp(4));
    } else {
      throw new Error('state ' + state.id + ': no high-fidelity component for element type ' + element.type);
    }
  }
  return { parts, y, gap, hot };
}

// ---------------------------------------------------------------- screens

/** One state at one layout (phone or desktop): the SVG body, its size and where each transition's control sits. */
export function screen(ctx, brand, flow, state, layout) {
  const L = brand.layouts[layout];
  if (!L) throw new Error('inputs/brand.json has no layout ' + layout);
  const W = L.width;
  const wide = layout === 'desktop';
  if (state.kind === 'overlay') {
    const cw = wide ? L.dialogWidth : W - 2 * ctx.pad;
    const cx = Math.round((W - cw) / 2);
    const inner = wide ? ctx.sp(8) : ctx.pad;
    const content = blocks(ctx, flow, state, cx + inner, cw - 2 * inner, L.dialogTop + inner, wide);
    const ch = content.y - content.gap + inner - L.dialogTop;
    const height = Math.max(L.minHeight, L.dialogTop + ch + ctx.sp(12));
    const body = [
      rect(0, 0, W, height, { fill: ctx.scrim }),
      group({ 'data-component': 'Dialog' }, [rect(cx, L.dialogTop, cw, ch, { rx: ctx.rCard, fill: ctx.card }), ...content.parts]),
    ];
    return { body: body.join('\n'), width: W, height, hot: content.hot };
  }
  const signedIn = brand.signedInScreens.includes(state.screen);
  const bar = appBar(ctx, brand, 0, 0, W, L.appBarHeight, wide, signedIn);
  if (wide) {
    const cw = L.contentWidth;
    const cx = Math.round((W - cw) / 2);
    const top = L.appBarHeight + ctx.sp(12);
    const inner = ctx.sp(8);
    const content = blocks(ctx, flow, state, cx + inner, cw - 2 * inner, top + inner, true);
    const ch = content.y - content.gap + inner - top;
    const height = Math.max(L.minHeight, top + ch + ctx.sp(12));
    const body = [rect(0, 0, W, height, { fill: ctx.page }), bar, rect(cx, top, cw, ch, { rx: ctx.rCard, fill: ctx.card, stroke: ctx.subtle, sw: ctx.thin }), ...content.parts];
    return { body: body.join('\n'), width: W, height, hot: content.hot };
  }
  const content = blocks(ctx, flow, state, ctx.pad, W - 2 * ctx.pad, L.appBarHeight + ctx.sp(8), false);
  const height = Math.max(L.minHeight, content.y - content.gap + ctx.sp(12));
  const body = [rect(0, 0, W, height, { fill: ctx.page }), bar, ...content.parts];
  return { body: body.join('\n'), width: W, height, hot: content.hot };
}

function screenSvg(ctx, board, state, layout) {
  return svgDocument(board.width, board.height, ctx.family,
    state.title + ' (' + state.id + '), high fidelity, ' + layout + ', ' + board.width + ' px',
    state.purpose + ' Drawn from the token file and the components; every colour, size, weight, radius and border is a token value.',
    board.body);
}

// ---------------------------------------------------------------- component sheet

function firstElement(flow, test) {
  for (const state of flow.states) for (const element of state.elements) if (test(element)) return element;
  return undefined;
}

function componentSheet(ctx, brand, flow) {
  const W = 1264;
  const colW = 560;
  const columns = [48, 656];
  const parts = [];
  const head = para(ctx, 48, 48, W - 96, brand.name + ': components', { size: ctx.xl, bold: true });
  const note = para(ctx, 48, head.y + ctx.sp(2), W - 96, 'Every component is drawn only with token values, by the same functions that draw the high-fidelity screens. Change a token or a component, rerun the script, and every screen follows.', { fill: ctx.muted });
  parts.push(...head.parts, ...note.parts);
  const tops = [note.y + ctx.sp(8), note.y + ctx.sp(8)];
  const sample = (elements, wide, width, x, y, kind = 'screen') => blocks(ctx, flow, { id: 'sample', kind, elements }, x, width, y, wide);
  const dialogState = flow.states.find((state) => state.kind === 'overlay');
  const samples = {
    'AppBar': (x, y) => ({ parts: [appBar(ctx, brand, x, y, colW, 64, true, true)], y: y + 64 }),
    'Heading/Page': (x, y) => sample([firstElement(flow, (e) => e.type === 'heading')], true, colW, x, y),
    'Heading/Section': (x, y) => {
      const r = para(ctx, x, y, colW, 'Invoice details', { size: ctx.m, bold: true });
      return { parts: [group({ 'data-component': 'Heading/Section' }, r.parts)], y: r.y };
    },
    'Text/Body': (x, y) => sample([firstElement(flow, (e) => e.type === 'text')], true, colW, x, y),
    'Button/Primary': (x, y) => {
      const element = firstElement(flow, (e) => e.type === 'button' && e.variant === 'primary');
      const plain = sample([element], true, colW, x, y);
      const fy = plain.y - plain.gap + ctx.sp(6);
      const bw = Math.min(colW, textWidth(element.label, ctx.s, true) + 2 * ctx.sp(6));
      const label = para(ctx, x, fy, colW, 'Focused: a ring in color.focus.ring, border-width.thick, outside the button', { fill: ctx.muted });
      const ry = label.y + ctx.sp(2) + ctx.sp(1);
      const bx = x + ctx.sp(1);
      const offset = ctx.sp(1) - ctx.thick / 2;
      const ring = rect(bx - offset, ry - offset, bw + 2 * offset, ctx.control + 2 * offset, { rx: ctx.rCard, stroke: ctx.focus, sw: ctx.thick });
      const focused = button(ctx, bx, ry, bw, element, 0).replace('<g data-component="Button/Primary"', '<g data-component="Button/Primary" data-state="focus"');
      return { parts: [...plain.parts, ...label.parts, ring, focused], y: ry + ctx.control + ctx.sp(1) };
    },
    'Button/Secondary': (x, y) => sample([firstElement(flow, (e) => e.type === 'button' && e.variant === 'secondary')], true, colW, x, y),
    'Button/Link': (x, y) => sample([firstElement(flow, (e) => e.type === 'button' && e.variant === 'link')], true, colW, x, y),
    'Field/Default': (x, y) => sample([firstElement(flow, (e) => e.type === 'field' && !e.error && e.hint)], true, colW, x, y),
    'Field/Error': (x, y) => sample([firstElement(flow, (e) => e.type === 'field' && e.error)], true, colW, x, y),
    'ErrorSummary': (x, y) => sample([firstElement(flow, (e) => e.type === 'error-summary')], true, colW, x, y),
    'SummaryList': (x, y) => {
      const element = firstElement(flow, (e) => e.type === 'summary');
      const short = { ...element, rows: element.rows.slice(0, 3) };
      const a = sample([short], true, colW, x, y);
      const label = para(ctx, x, a.y - a.gap + ctx.sp(4), colW, 'On a phone: stacked', { fill: ctx.muted });
      const b = sample([short], false, 342, x, label.y + ctx.sp(2));
      return { parts: [...a.parts, ...label.parts, ...b.parts], y: b.y - b.gap };
    },
    'Table': (x, y) => {
      const element = firstElement(flow, (e) => e.type === 'table');
      const a = sample([element], true, colW, x, y);
      const label = para(ctx, x, a.y - a.gap + ctx.sp(4), colW, 'On a phone: each row stacked', { fill: ctx.muted });
      const b = sample([element], false, 342, x, label.y + ctx.sp(2));
      return { parts: [...a.parts, ...label.parts, ...b.parts], y: b.y - b.gap };
    },
    'Dialog': (x, y) => {
      const inner = ctx.pad;
      const cw = colW - 2 * ctx.sp(8);
      const cx = x + ctx.sp(8);
      const content = blocks(ctx, flow, dialogState, cx + inner, cw - 2 * inner, y + ctx.sp(8) + inner, true);
      const ch = content.y - content.gap + inner - (y + ctx.sp(8));
      const h = ch + 2 * ctx.sp(8);
      return { parts: [rect(x, y, colW, h, { fill: ctx.scrim }), group({ 'data-component': 'Dialog' }, [rect(cx, y + ctx.sp(8), cw, ch, { rx: ctx.rCard, fill: ctx.card }), ...content.parts])], y: y + h };
    },
  };
  for (const component of COMPONENTS) {
    const draw = samples[component.name];
    if (!draw) throw new Error('component ' + component.name + ' has no sample on the component sheet');
    const c = tops[0] <= tops[1] ? 0 : 1;
    const x = columns[c];
    const name = para(ctx, x, tops[c], colW, component.name, { size: ctx.m, bold: true });
    const about = para(ctx, x, name.y, colW, component.about, { fill: ctx.muted });
    const drawn = draw(x, about.y + ctx.sp(4));
    parts.push(group({ 'data-sample': component.name }, [...name.parts, ...about.parts, ...drawn.parts]));
    tops[c] = drawn.y + ctx.sp(12);
  }
  const height = Math.max(...tops);
  return svgDocument(W, height, ctx.family, brand.name + ' components, drawn from the design tokens',
    'Every component of the high-fidelity screens with a sample: ' + COMPONENTS.map((component) => component.name).join(', ') + '.',
    [rect(0, 0, W, height, { fill: ctx.page }), ...parts].join('\n'));
}

// ---------------------------------------------------------------- brand and style guide

function styleGuide(ctx, brand, pairs) {
  const W = 1264;
  const x = 48;
  const w = W - 96;
  const parts = [];
  let y = 48;
  const add = (r) => { parts.push(...r.parts); y = r.y; };
  const section = (title) => { y += ctx.sp(8); add(para(ctx, x, y, w, title, { size: ctx.l, bold: true })); y += ctx.sp(4); };
  add(para(ctx, x, y, w, brand.name + ': brand and style guide', { size: ctx.xl, bold: true }));
  y += ctx.sp(2);
  add(para(ctx, x, y, w, brand.tagline, { fill: ctx.muted }));
  add(para(ctx, x, y, w, 'Every value on this page is read from the token file, so the guide cannot drift from the screens.', { fill: ctx.muted }));

  section('Wordmark');
  parts.push(appBar(ctx, brand, x, y, 560, 64, false, false));
  y += 64 + ctx.sp(3);
  add(para(ctx, x, y, w, brand.wordmark.about, { fill: ctx.muted }));

  section('Voice');
  for (const line of brand.voice) { add(para(ctx, x, y, w, '• ' + line)); y += ctx.sp(1); }

  section('Rules');
  for (const line of brand.rules) { add(para(ctx, x, y, w, '• ' + line)); y += ctx.sp(1); }

  section('Colour');
  add(para(ctx, x, y, w, 'The semantic colours the screens use, each an alias of a core colour.', { fill: ctx.muted }));
  y += ctx.sp(4);
  const colours = [...ctx.tokens].filter(([, token]) => token.type === 'color' && token.set === 'semantic');
  const perRow = 4;
  const cell = Math.floor((w - (perRow - 1) * ctx.sp(6)) / perRow);
  for (let i = 0; i < colours.length; i += perRow) {
    let rowBottom = y;
    colours.slice(i, i + perRow).forEach(([name, token], k) => {
      const cx = x + k * (cell + ctx.sp(6));
      const swatch = rect(cx, y, cell, ctx.control + ctx.sp(4), { rx: ctx.rControl, fill: token.resolved, stroke: ctx.subtle, sw: ctx.thin });
      const a = para(ctx, cx, y + ctx.control + ctx.sp(4) + ctx.sp(2), cell, name, { bold: true });
      const b = para(ctx, cx, a.y, cell, token.resolved + (token.value !== token.resolved ? ' = ' + token.value.replace(/[{}]/g, '') : ''), { fill: ctx.muted });
      parts.push(group({ 'data-token': name }, [swatch, ...a.parts, ...b.parts]));
      rowBottom = Math.max(rowBottom, b.y);
    });
    y = rowBottom + ctx.sp(6);
  }

  section('Contrast');
  add(para(ctx, x, y, w, 'Each pair as it is used, with its WCAG 2 contrast ratio rounded down: 4.5:1 for text, 3:1 for borders, focus and controls.', { fill: ctx.muted }));
  y += ctx.sp(4);
  const all = pairs.groups.flatMap((g) => g.pairs.map(([fg, bg]) => ({ fg, bg, minimum: g.minimum })));
  const half = Math.ceil(all.length / 2);
  const colW = Math.floor((w - ctx.sp(8)) / 2);
  const startY = y;
  let bottom = y;
  all.forEach((pair, index) => {
    const column = index < half ? 0 : 1;
    if (index === half) y = startY;
    const cx = x + column * (colW + ctx.sp(8));
    const fg = ctx.tokens.get(pair.fg);
    const bg = ctx.tokens.get(pair.bg);
    if (!fg || !bg) throw new Error('contrast pair ' + pair.fg + ' on ' + pair.bg + ' names a token the file does not have');
    const ratio = floor2(contrast(fg.resolved, bg.resolved));
    const box = 120;
    const sampleTop = y + (ctx.control - lineHeight(ctx.l)) / 2;
    const a = para(ctx, cx + box + ctx.sp(4), y, colW - box - ctx.sp(4), pair.fg + ' on ' + pair.bg, { bold: true });
    const b = para(ctx, cx + box + ctx.sp(4), a.y, colW - box - ctx.sp(4), ratio.toFixed(2) + ':1, needs ' + pair.minimum + ':1', { fill: ctx.muted });
    parts.push(group({ 'data-pair': pair.fg + ' on ' + pair.bg }, [
      rect(cx, y, box, ctx.control, { rx: ctx.rControl, fill: bg.resolved, stroke: ctx.subtle, sw: ctx.thin }),
      text(cx + box / 2, baseline(sampleTop, ctx.l), 'Aa', { size: ctx.l, weight: ctx.bold, fill: fg.resolved, anchor: 'middle', fit: cx + ' ' + (cx + box) }),
      ...a.parts, ...b.parts,
    ]));
    y = Math.max(y + ctx.control, b.y) + ctx.sp(4);
    bottom = Math.max(bottom, y);
  });
  y = bottom;

  section('Type');
  const scale = [['xl', true], ['l', true], ['m', true], ['s', true], ['s', false]];
  for (const [step, bold] of scale) {
    const size = ctx[step];
    add(para(ctx, x, y, w, 'font.size.' + step + ' ' + size + ' px, font.weight.' + (bold ? 'bold ' + ctx.bold : 'regular ' + ctx.regular) + ', line height ' + lineHeight(size) + ' px', { fill: ctx.muted }));
    add(para(ctx, x, y, w, 'Check your invoice before you send it', { size, bold }));
    y += ctx.sp(4);
  }
  add(para(ctx, x, y, w, 'Family: font.family.base, ' + ctx.family + ', with the system sans-serif as a fallback. The font is not shipped with these files.', { fill: ctx.muted }));

  section('Spacing');
  const spacing = [...ctx.tokens].filter(([, token]) => token.type === 'spacing' && token.set === 'core');
  for (const [name, token] of spacing) {
    const value = Number(token.resolved);
    const label = para(ctx, x, y, 240, name + ' ' + value + ' px');
    parts.push(...label.parts, rect(x + 256, y + (lineHeight(ctx.s) - ctx.sp(4)) / 2, value, ctx.sp(4), { fill: ctx.primary }));
    y = label.y + ctx.sp(2);
  }

  section('Corners, borders and controls');
  const shapes = [
    ...[...ctx.tokens].filter(([, t]) => t.type === 'borderRadius' && t.set === 'core').map(([name, t]) => ({ label: name + ' ' + t.resolved + ' px', o: { rx: Number(t.resolved), fill: ctx.card, stroke: ctx.input, sw: ctx.thick } })),
    ...[...ctx.tokens].filter(([, t]) => t.type === 'borderWidth' && t.set === 'core').map(([name, t]) => ({ label: name + ' ' + t.resolved + ' px', o: { fill: ctx.card, stroke: ctx.input, sw: Number(t.resolved) } })),
    { label: 'size.control ' + ctx.control + ' px tall', o: { rx: ctx.rControl, fill: ctx.primary } },
  ];
  const sw = 160;
  const per = Math.floor((w + ctx.sp(6)) / (sw + ctx.sp(6)));
  for (let i = 0; i < shapes.length; i += per) {
    let rowBottom = y;
    shapes.slice(i, i + per).forEach((shape, k) => {
      const sx = x + k * (sw + ctx.sp(6));
      const label = para(ctx, sx, y + ctx.control + ctx.sp(2), sw, shape.label, { fill: ctx.muted });
      parts.push(rect(sx + 4, y + 4, sw - 8, ctx.control - 8 + (shape.label.startsWith('size.control') ? 8 : 0), shape.o), ...label.parts);
      rowBottom = Math.max(rowBottom, label.y);
    });
    y = rowBottom + ctx.sp(6);
  }

  const height = y + ctx.sp(8);
  return svgDocument(W, height, ctx.family, brand.name + ' brand and style guide, drawn from the design tokens',
    'Wordmark, voice, rules, every semantic colour with its value, the contrast pairs with their ratios, the type scale, spacing, corners, borders and the control size.',
    [rect(0, 0, W, height, { fill: ctx.page }), ...parts].join('\n'));
}

function styleGuideMarkdown(ctx, brand, pairs, layouts) {
  const tokens = [...ctx.tokens];
  const rows = (filter) => tokens.filter(([, t]) => filter(t));
  const lines = [
    '# ' + brand.name + ': brand and style guide',
    '',
    'Generated by tools/ux_pathway.mjs (tools/ux_hifi.mjs) from pocket-invoice-tokens.json and inputs/brand.json. Do not edit: change an input and rerun the script. The same guide as a drawing is style-guide.svg.',
    '',
    brand.tagline,
    '',
    '## Wordmark',
    '',
    brand.wordmark.about,
    '',
    '## Voice',
    '',
    ...brand.voice.map((line) => '- ' + line),
    '',
    '## Rules',
    '',
    ...brand.rules.map((line) => '- ' + line),
    '',
    '## Colour',
    '',
    '| Token | Value | Alias of | Set |',
    '| --- | --- | --- | --- |',
    ...rows((t) => t.type === 'color').map(([name, t]) => '| ' + name + ' | ' + t.resolved + ' | ' + (t.value !== t.resolved ? t.value.replace(/[{}]/g, '') : '') + ' | ' + t.set + ' |'),
    '',
    '## Contrast',
    '',
    '| Foreground | Background | Ratio | Minimum | Result |',
    '| --- | --- | --- | --- | --- |',
    ...pairs.groups.flatMap((g) => g.pairs.map(([fg, bg]) => {
      const ratio = floor2(contrast(ctx.tokens.get(fg).resolved, ctx.tokens.get(bg).resolved));
      return '| ' + fg + ' | ' + bg + ' | ' + ratio.toFixed(2) + ':1 | ' + g.minimum + ':1 | ' + (ratio >= g.minimum ? 'passed' : 'failed') + ' |';
    })),
    '',
    'Ratios are rounded down to two decimals.',
    '',
    '## Type',
    '',
    '| Size token | Size | Line height | Used for |',
    '| --- | --- | --- | --- |',
    '| font.size.xl | ' + ctx.xl + ' px | ' + lineHeight(ctx.xl) + ' px | Page heading on a desktop |',
    '| font.size.l | ' + ctx.l + ' px | ' + lineHeight(ctx.l) + ' px | Page heading on a phone and in a dialog |',
    '| font.size.m | ' + ctx.m + ' px | ' + lineHeight(ctx.m) + ' px | Section heading, error summary title, wordmark |',
    '| font.size.s | ' + ctx.s + ' px | ' + lineHeight(ctx.s) + ' px | Body text, labels, buttons, tables |',
    '',
    'Weights: font.weight.regular ' + ctx.regular + ', font.weight.bold ' + ctx.bold + '. Family: font.family.base, ' + ctx.family + ', with the system sans-serif as a fallback; the font is not shipped with these files. The token file has no line-height tokens: line height is 1.35 times the size, rounded up to the 4 px grid.',
    '',
    '## Spacing, corners, borders and controls',
    '',
    '| Token | Value |',
    '| --- | --- |',
    ...rows((t) => ['spacing', 'borderRadius', 'borderWidth', 'sizing'].includes(t.type)).map(([name, t]) => '| ' + name + ' | ' + t.resolved + ' px' + (t.value !== t.resolved ? ' (' + t.value.replace(/[{}]/g, '') + ')' : '') + ' |'),
    '',
    '## Layouts',
    '',
    '| Layout | Width | Minimum height | Content |',
    '| --- | --- | --- | --- |',
    '| Phone | ' + layouts.phone.width + ' px | ' + layouts.phone.minHeight + ' px | Full width less space.page on each side; buttons full width; tables and summary lists stacked |',
    '| Desktop | ' + layouts.desktop.width + ' px | ' + layouts.desktop.minHeight + ' px | A ' + layouts.desktop.contentWidth + ' px card centred under the app bar; buttons side by side; a real table |',
    '',
    'Layout widths are in inputs/brand.json, not in the token file: they describe the frames, not the brand.',
    '',
    '## Components',
    '',
    '| Component | What it is for | Tokens |',
    '| --- | --- | --- |',
    ...COMPONENTS.map((component) => '| ' + component.name + ' | ' + component.about + ' | ' + component.tokens.join(', ') + ' |'),
    '',
  ];
  return lines.join('\n');
}

// ---------------------------------------------------------------- the visual-fidelity check

const ELEMENT = /<(svg|g|rect|text|circle|line|path)\b([^>]*)>(?:([^<]*)<\/text>)?/g;
const ATTRIBUTE = /([\w:-]+)="([^"]*)"/g;

function parseAttributes(source) {
  const out = {};
  for (const match of source.matchAll(ATTRIBUTE)) out[match[1]] = unesc(match[2]);
  return out;
}

function backgroundAt(painted, px, py) {
  for (let i = painted.length - 1; i >= 0; i--) {
    const r = painted[i];
    if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) return r.fill;
  }
  return undefined;
}

/**
 * Checks one finished SVG against the tokens. Reads the file as text, in paint order, so it checks what was drawn,
 * not what the drawing code meant. expectElements: for a screen, how many flow elements must appear as components.
 */
export function audit(svg, ctx, expectElements) {
  const byType = (type) => new Set([...ctx.tokens.values()].filter((t) => t.type === type).map((t) => t.resolved.toLowerCase()));
  const colours = byType('color');
  const sizes = byType('fontSizes');
  const weights = byType('fontWeights');
  const radii = byType('borderRadius');
  const widths = byType('borderWidth');
  const failures = [];
  const counts = { colours: 0, fontSizes: 0, fontWeights: 0, radii: 0, borderWidths: 0, texts: 0, controls: 0 };
  const painted = [];
  const components = new Set();
  const elements = new Set();
  let minText = Infinity;
  let minControl = Infinity;
  let family;
  for (const match of svg.matchAll(ELEMENT)) {
    const tag = match[1];
    const a = parseAttributes(match[2]);
    if (tag === 'svg') {
      family = (a['font-family'] ?? '').split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      if (family !== ctx.family) failures.push('font family "' + family + '" is not font.family.base (' + ctx.family + ')');
      continue;
    }
    for (const key of ['fill', 'stroke']) {
      if (a[key] === undefined) continue;
      counts.colours++;
      if (a[key] !== 'none' && !colours.has(a[key].toLowerCase())) failures.push(tag + ' ' + key + ' ' + a[key] + ' is not a token colour');
    }
    for (const key of ['opacity', 'fill-opacity', 'stroke-opacity']) if (a[key] !== undefined) failures.push(tag + ' uses ' + key + ', which no token defines');
    if (a['stroke-width'] !== undefined) { counts.borderWidths++; if (!widths.has(String(Number(a['stroke-width'])))) failures.push(tag + ' stroke-width ' + a['stroke-width'] + ' is not a border-width token'); }
    if (a.rx !== undefined) { counts.radii++; if (!radii.has(String(Number(a.rx)))) failures.push(tag + ' rx ' + a.rx + ' is not a radius token'); }
    if (tag === 'g') {
      if (a['data-component'] !== undefined) {
        components.add(a['data-component']);
        if (!COMPONENT_NAMES.has(a['data-component'])) failures.push('component ' + a['data-component'] + ' is not on the component sheet');
      }
      if (a['data-element'] !== undefined) elements.add(Number(a['data-element']));
    } else if (tag === 'text') {
      counts.texts++;
      const content = unesc(match[3] ?? '');
      const size = Number(a['font-size']);
      const weight = a['font-weight'] === undefined ? ctx.regular : Number(a['font-weight']);
      counts.fontSizes++;
      if (!sizes.has(String(size))) failures.push('"' + content + '" font-size ' + a['font-size'] + ' is not a font.size token');
      counts.fontWeights++;
      if (!weights.has(String(weight))) failures.push('"' + content + '" font-weight ' + weight + ' is not a font.weight token');
      if (!a.fill) { failures.push('"' + content + '" has no fill'); continue; }
      const anchor = a['text-anchor'];
      const px = Number(a.x) + (anchor === 'middle' ? 0 : anchor === 'end' ? -2 : 2);
      const py = Number(a.y) - size * 0.3;
      const background = backgroundAt(painted, px, py);
      if (!background) { failures.push('"' + content + '" has no shape under it'); continue; }
      const ratio = contrast(a.fill, background);
      const needed = isLargeText(size, weight) ? 3 : 4.5;
      minText = Math.min(minText, ratio);
      if (ratio < needed) failures.push('"' + content + '" ' + a.fill + ' on ' + background + ': ' + floor2(ratio).toFixed(2) + ':1, needs ' + needed + ':1');
    } else if (tag === 'rect') {
      const r = { x: Number(a.x), y: Number(a.y), w: Number(a.width), h: Number(a.height), fill: a.fill };
      if (a['data-control'] !== undefined) {
        counts.controls++;
        const where = a['data-control'] + ' at ' + r.x + ',' + r.y;
        if (r.h < ctx.control) failures.push(where + ' is ' + r.h + ' px tall; size.control is ' + ctx.control + ' px');
        if (r.w < 24 || r.h < 24) failures.push(where + ' is smaller than the 24 px target in WCAG 2.2 (2.5.8)');
        const edge = a.stroke ?? a.fill;
        const outside = backgroundAt(painted, r.x - Number(a['stroke-width'] ?? 0) - 1, r.y + r.h / 2);
        if (!outside) failures.push(where + ' has no shape around it');
        else {
          const ratio = contrast(edge, outside);
          minControl = Math.min(minControl, ratio);
          if (ratio < 3) failures.push(where + ' boundary ' + edge + ' on ' + outside + ': ' + floor2(ratio).toFixed(2) + ':1, needs 3:1');
        }
      }
      if (a.fill && a.fill !== 'none') painted.push(r);
    }
  }
  if (family === undefined) failures.push('no svg element');
  if (expectElements !== undefined) {
    const missing = Array.from({ length: expectElements }, (_, i) => i).filter((i) => !elements.has(i));
    if (missing.length) failures.push('flow elements ' + missing.join(', ') + ' are not drawn as components');
  }
  return {
    pass: failures.length === 0,
    counts,
    minTextContrast: minText === Infinity ? null : floor2(minText),
    minControlContrast: minControl === Infinity ? null : floor2(minControl),
    components: [...components].sort(),
    failures,
  };
}

const NOT_MEASURED = [
  { what: 'Pixel comparison of these drawings with the high-fidelity page of the Penpot file', status: 'unavailable', why: 'No Penpot renderer runs in the pipeline. The Penpot file has its own import check.' },
  { what: 'Comparison with the working example page as a browser draws it', status: 'unavailable', why: 'Not run in this slice. The working page has its own accessibility and reflow report.' },
  { what: 'Text width with real fonts', status: 'not measured by this script', why: 'This script estimates width from the number of characters. The site’s browser tests measure every text in every screen against its column on each pipeline.' },
  { what: 'Colour vision deficiency simulation', status: 'unavailable', why: 'Not run. The rules forbid colour alone: errors also have a bar, the word Error and a message.' },
  { what: 'Review by a designer, and use by real people', status: 'unavailable', why: 'Nobody outside the maintainers has reviewed these screens, and no usability session has been run.' },
  { what: 'Opening these SVG files in Penpot or Figma', status: 'proposed, not run', why: 'Both vendors document SVG as a way to bring drawings in from other tools; nobody has tried it with these files.' },
];

function fidelityMarkdown(report) {
  const rows = report.files.map((f) => '| ' + f.file + ' | ' + (f.counts.colours + f.counts.fontSizes + f.counts.fontWeights + f.counts.radii + f.counts.borderWidths) + ' | ' + f.counts.texts + ' | ' + (f.minTextContrast === null ? 'no text' : f.minTextContrast.toFixed(2) + ':1') + ' | ' + f.counts.controls + ' | ' + (f.minControlContrast === null ? 'no controls' : f.minControlContrast.toFixed(2) + ':1') + ' | ' + f.components.length + ' | ' + (f.pass ? 'passed' : 'failed: ' + f.failures.join('; ')) + ' |');
  return [
    '# ' + report.product + ': visual-fidelity report',
    '',
    'Generated by tools/ux_pathway.mjs (tools/ux_hifi.mjs). Each drawing is read back as SVG text, in paint order, and checked against pocket-invoice-tokens.json. Do not edit: change an input and rerun the script.',
    '',
    report.pass ? 'Result: all ' + report.files.length + ' drawings passed every check.' : 'Result: ' + report.files.filter((f) => !f.pass).length + ' of ' + report.files.length + ' drawings failed.',
    '',
    '## What is checked',
    '',
    ...report.method.map((line) => '- ' + line),
    '',
    '## Results',
    '',
    'Values checked: ' + report.totals.values + ' (colours, font sizes, weights, radii and border widths). Texts checked for contrast: ' + report.totals.texts + '. Controls checked: ' + report.totals.controls + '. Lowest text contrast: ' + (report.totals.minTextContrast === null ? 'no text' : report.totals.minTextContrast.toFixed(2) + ':1') + '. Lowest control boundary contrast: ' + (report.totals.minControlContrast === null ? 'no controls' : report.totals.minControlContrast.toFixed(2) + ':1') + '.',
    '',
    '| Drawing | Token values | Texts | Lowest text contrast | Controls | Lowest boundary contrast | Components | Result |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows,
    '',
    'Ratios are rounded down to two decimals, so a ratio shown never overstates the real one.',
    '',
    '## Not measured',
    '',
    '| What | Status | Why |',
    '| --- | --- | --- |',
    ...report.notMeasured.map((n) => '| ' + n.what + ' | ' + n.status + ' | ' + n.why + ' |'),
    '',
  ].join('\n');
}

// ---------------------------------------------------------------- everything

/**
 * Draws every high-fidelity file and checks it. Pure: no file system access. Returns the files, the phone boards for
 * the journey canvas and the failures (empty when every check passed).
 */
export function renderHifi({ flow, tokenFile, pairs, brand }) {
  const ctx = theme(tokenFile);
  const files = [];
  const phoneBoards = {};
  const audited = [];
  const missingTokens = COMPONENTS.flatMap((component) => component.tokens.filter((name) => !ctx.tokens.has(name)).map((name) => component.name + ': ' + name));
  for (const layout of ['phone', 'desktop']) {
    for (const state of flow.states) {
      const board = screen(ctx, brand, flow, state, layout);
      if (layout === 'phone') phoneBoards[state.id] = board;
      const name = 'screens/' + layout + '/' + state.id + '.svg';
      const svg = screenSvg(ctx, board, state, layout);
      files.push([name, svg]);
      audited.push([name, svg, state.elements.length]);
    }
  }
  const sheet = componentSheet(ctx, brand, flow);
  const guide = styleGuide(ctx, brand, pairs);
  files.push(['components.svg', sheet], ['style-guide.svg', guide], ['style-guide.md', styleGuideMarkdown(ctx, brand, pairs, brand.layouts)]);
  audited.push(['components.svg', sheet, undefined], ['style-guide.svg', guide, undefined]);
  const results = audited.map(([file, svg, expected]) => ({ file, ...audit(svg, ctx, expected) })).sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));
  const texts = results.map((r) => r.minTextContrast).filter((v) => v !== null);
  const controls = results.map((r) => r.minControlContrast).filter((v) => v !== null);
  const report = {
    product: flow.product.name,
    generator: 'tools/ux_hifi.mjs',
    tokens: 'pocket-invoice-tokens.json',
    method: [
      'Token use: every fill and stroke is a colour token, every font-size a font.size token, every font-weight a font.weight token, every corner radius a radius token and every stroke width a border-width token. Any opacity fails, because no token defines one.',
      'Font family: the drawing names font.family.base first.',
      'Text contrast (WCAG 2.2, 1.4.3): for each text, the shape painted under it is found from the geometry, and the ratio must be at least 4.5:1, or 3:1 for large text (at least 24 px, or 18.66 px bold).',
      'Control boundaries (1.4.11): each button and input outline, or its fill when it has no outline, against the shape around it, at least 3:1.',
      'Control size: each button and input at least size.control (' + ctx.control + ' px) tall, and never under the 24 px target in WCAG 2.2 (2.5.8).',
      'Components: every component named in a drawing is on the component sheet, every token a component lists exists, and on each screen every element of the flow is drawn as a component.',
    ],
    componentTokens: { pass: missingTokens.length === 0, missing: missingTokens },
    totals: {
      values: results.reduce((n, r) => n + r.counts.colours + r.counts.fontSizes + r.counts.fontWeights + r.counts.radii + r.counts.borderWidths, 0),
      texts: results.reduce((n, r) => n + r.counts.texts, 0),
      controls: results.reduce((n, r) => n + r.counts.controls, 0),
      minTextContrast: texts.length ? Math.min(...texts) : null,
      minControlContrast: controls.length ? Math.min(...controls) : null,
    },
    pass: missingTokens.length === 0 && results.every((r) => r.pass),
    files: results,
    notMeasured: NOT_MEASURED,
  };
  files.push(['fidelity-report.json', JSON.stringify(report, null, 2) + '\n'], ['fidelity-report.md', fidelityMarkdown(report)]);
  const failures = [
    ...missingTokens.map((m) => 'component-tokens: ' + m),
    ...results.filter((r) => !r.pass).map((r) => 'fidelity ' + r.file + ': ' + r.failures.join('; ')),
  ];
  return { files, phoneBoards, frameStroke: ctx.subtle, failures };
}
