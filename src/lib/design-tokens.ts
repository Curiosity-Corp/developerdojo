/**
 * Reads a W3C Design Tokens (DTCG draft) file in the multi-set form Penpot imports and exports:
 * top-level keys are token sets, plus `$themes` and `$metadata` (help.penpot.app/user-guide/design-tokens/).
 *
 * Used by the Pocket Invoice implementation (CSS custom properties), the Penpot file generator and the
 * contrast tests, so the three cannot drift apart. Plain, erasable TypeScript: the generator runs it
 * with Node's type stripping.
 */

export interface Token {
  name: string;
  type: string;
  value: string;
  description?: string;
  set: string;
}

export interface TokenFile {
  $metadata?: { tokenSetOrder?: string[] };
  [set: string]: unknown;
}

type TokenNode = { [key: string]: unknown };

function isTokenNode(value: unknown): value is TokenNode {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The token sets in the order the file declares them (`$metadata.tokenSetOrder`), or in key order. */
export function tokenSetNames(file: TokenFile): string[] {
  const sets = Object.keys(file).filter((key) => !key.startsWith('$'));
  const order = file.$metadata?.tokenSetOrder;
  if (!order) return sets;
  const missing = sets.filter((set) => !order.includes(set));
  if (missing.length) throw new Error(`Design tokens: sets ${missing.join(', ')} are not in $metadata.tokenSetOrder`);
  return order;
}

/** Every token, flattened to dotted names (`color.text.default`). Throws on a malformed token or a duplicate name. */
export function flattenTokens(file: TokenFile): Token[] {
  const tokens: Token[] = [];
  const seen = new Set<string>();
  const walk = (node: TokenNode, path: string[], set: string): void => {
    if ('$value' in node) {
      const name = path.join('.');
      const { $value, $type, $description } = node;
      if (typeof $value !== 'string' || typeof $type !== 'string') throw new Error(`Design tokens: ${set}/${name} needs a string $value and $type`);
      if (seen.has(name)) throw new Error(`Design tokens: ${name} is defined twice`);
      seen.add(name);
      tokens.push({ name, type: $type, value: $value, set, ...(typeof $description === 'string' ? { description: $description } : {}) });
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      if (!isTokenNode(child)) throw new Error(`Design tokens: ${set}/${[...path, key].join('.')} is not a token or a group`);
      walk(child, [...path, key], set);
    }
  };
  for (const set of tokenSetNames(file)) {
    const node = file[set];
    if (!isTokenNode(node)) throw new Error(`Design tokens: set ${set} is missing or not an object`);
    walk(node, [], set);
  }
  return tokens;
}

const REFERENCE = /^\{([^{}]+)\}$/;

/** Token name to final value, following `{alias}` references. Throws on an unknown or circular reference. */
export function resolveTokens(file: TokenFile): Map<string, Token & { resolved: string }> {
  const byName = new Map(flattenTokens(file).map((token) => [token.name, token]));
  const resolved = new Map<string, Token & { resolved: string }>();
  const resolve = (name: string, trail: string[]): string => {
    const token = byName.get(name);
    if (!token) throw new Error(`Design tokens: ${trail.at(-1) ?? name} refers to unknown token ${name}`);
    if (trail.includes(name)) throw new Error(`Design tokens: circular reference ${[...trail, name].join(' -> ')}`);
    const reference = REFERENCE.exec(token.value);
    return reference?.[1] ? resolve(reference[1], [...trail, name]) : token.value;
  };
  for (const token of byName.values()) resolved.set(token.name, { ...token, resolved: resolve(token.name, []) });
  return resolved;
}

/** The resolved value of one token; throws if it does not exist. */
export function tokenValue(tokens: Map<string, { resolved: string }>, name: string): string {
  const token = tokens.get(name);
  if (!token) throw new Error(`Design tokens: no token ${name}`);
  return token.resolved;
}

const UNITLESS = new Set(['fontWeights', 'number', 'opacity', 'fontFamilies', 'color']);

/** CSS custom properties for every token, e.g. `--pi-color-text-default: #101828`. Dimensions get px. */
export function cssCustomProperties(tokens: Map<string, Token & { resolved: string }>, prefix: string): string {
  return [...tokens.values()]
    .map((token) => {
      const value = UNITLESS.has(token.type) || !/^-?\d+(\.\d+)?$/.test(token.resolved) ? token.resolved : `${token.resolved}px`;
      return `--${prefix}-${token.name.replaceAll('.', '-')}: ${value};`;
    })
    .join(' ');
}

/** WCAG 2 relative luminance of a #rrggbb colour. */
export function relativeLuminance(hex: string): number {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match?.[1]) throw new Error(`Design tokens: ${hex} is not a #rrggbb colour`);
  const channels = [0, 2, 4].map((offset) => Number.parseInt(match[1]!.slice(offset, offset + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two #rrggbb colours, from 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}
