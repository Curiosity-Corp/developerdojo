/**
 * UX pathway (M9): reads a design token file in the W3C Design Tokens Community Group draft format, in the multi-set
 * form Penpot imports and exports (top-level keys are token sets, plus $themes and $metadata), and computes WCAG 2
 * contrast. Node standard library only; shared by ux_pathway.mjs and ux_hifi.mjs.
 */

/** Every token as name -> { value, type, set, description }, in the set order the file declares. */
export function flattenTokens(file) {
  const out = new Map();
  const order = (file.$metadata && file.$metadata.tokenSetOrder) || Object.keys(file).filter((key) => !key.startsWith('$'));
  const walk = (node, path, set) => {
    if (node && typeof node === 'object' && '$value' in node) {
      const name = path.join('.');
      if (out.has(name)) throw new Error('token ' + name + ' is defined twice');
      out.set(name, { value: String(node.$value), type: String(node.$type ?? ''), set, ...(node.$description ? { description: String(node.$description) } : {}) });
      return;
    }
    for (const [key, child] of Object.entries(node ?? {})) if (!key.startsWith('$')) walk(child, [...path, key], set);
  };
  for (const set of order) walk(file[set], [], set);
  return out;
}

/** The final value of a token, following {alias} references. Throws on an unknown or circular reference. */
export function resolveToken(tokens, name, trail = []) {
  if (!tokens.has(name)) throw new Error('unknown token ' + name + (trail.length ? ' (from ' + trail.join(' -> ') + ')' : ''));
  if (trail.includes(name)) throw new Error('circular token reference ' + [...trail, name].join(' -> '));
  const value = tokens.get(name).value;
  const alias = /^\{([^{}]+)\}$/.exec(value);
  return alias ? resolveToken(tokens, alias[1], [...trail, name]) : value;
}

/** Every token with its resolved value added: name -> { value, type, set, description, resolved }. */
export function resolvedTokens(file) {
  const flat = flattenTokens(file);
  return new Map([...flat].map(([name, token]) => [name, { ...token, resolved: resolveToken(flat, name) }]));
}

function luminance(hex) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(hex + ' is not a #rrggbb colour');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio, from 1 to 21. */
export function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Rounds a ratio down to two decimals, so a ratio shown never overstates the real one. */
export function floor2(ratio) {
  return Math.floor(ratio * 100) / 100;
}

/** WCAG 2 large text: at least 18 pt (24 px), or 14 pt (about 18.66 px) and bold. Large text needs 3:1, other text 4.5:1. */
export function isLargeText(sizePx, weight) {
  return sizePx >= 24 || (sizePx >= 18.66 && weight >= 700);
}
