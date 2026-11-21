import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { STATES, STATE_IDS, START_STATE, TRANSITIONS, VALIDATION, stateById, type StateId } from '../src/data/pocket-invoice';
import tokenSource from '../src/data/pocket-invoice-tokens.json';
import { contrastRatio, flattenTokens, resolveTokens, tokenValue } from '../src/lib/design-tokens';
import { readZip } from '../scripts/ux-pathway/zip';
import { build } from '../scripts/ux-pathway/build-penpot-file';

// The UX pathway example (#91): one flow (src/data/pocket-invoice.ts) and one token file drive the
// Penpot file, the working page and the hub page. These tests keep the three from drifting apart.

const PUBLIC = 'public/examples/ux-pathway/';
const published = new Uint8Array(readFileSync(PUBLIC + 'pocket-invoice.penpot'));
const decode = (data: Uint8Array): unknown => JSON.parse(new TextDecoder().decode(data));
type Shape = { id: string; name: string; type: string; parentId?: string; interactions?: { actionType: string; destination?: string }[] };

describe('the Pocket Invoice flow', () => {
  const ways = (id: StateId) => ({ in: TRANSITIONS.filter((t) => t.to === id), out: TRANSITIONS.filter((t) => t.from === id) });

  it('has unique states, and every transition names real states', () => {
    expect(new Set(STATES.map((state) => state.id)).size).toBe(STATES.length);
    expect(STATES.map((state) => state.id).sort()).toEqual([...STATE_IDS].sort());
    for (const transition of TRANSITIONS) {
      expect(STATE_IDS, transition.trigger).toContain(transition.from);
      expect(STATE_IDS, transition.trigger).toContain(transition.to);
    }
  });

  it('reaches every state from the start, and every state can be left', () => {
    const seen = new Set<StateId>([START_STATE]);
    const queue: StateId[] = [START_STATE];
    for (let next = queue.shift(); next; next = queue.shift()) {
      for (const transition of ways(next).out) if (!seen.has(transition.to)) { seen.add(transition.to); queue.push(transition.to); }
    }
    expect([...seen].sort()).toEqual([...STATE_IDS].sort());
    for (const id of STATE_IDS) expect(ways(id).out.length, id + ' is a dead end').toBeGreaterThan(0);
  });

  it('gives every error state a way back to a state the user can complete', () => {
    for (const state of STATES.filter((item) => item.kind === 'error')) {
      expect(ways(state.id).out.some((transition) => stateById(transition.to).kind !== 'error'), state.id).toBe(true);
    }
  });

  it('puts every button on its screen exactly where a transition starts', () => {
    for (const state of STATES) {
      for (const element of state.elements) {
        if (element.type !== 'button') continue;
        expect(TRANSITIONS.some((t) => t.from === state.id && t.to === element.to), state.id + ': ' + element.label).toBe(true);
      }
    }
  });

  it('validates the way the working example and the error states say it does', () => {
    expect(VALIDATION.email('name@example.com')).toBeUndefined();
    expect(VALIDATION.email('not-an-email')).toMatch(/correct format/);
    expect(VALIDATION.workspace('  ')).toBe('Enter a workspace name');
    expect(VALIDATION.amount('0')).toBe('Enter an amount greater than 0');
    expect(VALIDATION.amount('480.00')).toBeUndefined();
    expect(VALIDATION.deliverable('accounts@harbour-bakery.example')).toBe(true);
    expect(VALIDATION.deliverable('accounts@harbour-bakery.invalid')).toBe(false);
  });
});

describe('the Pocket Invoice design tokens', () => {
  const tokens = resolveTokens(tokenSource);
  const value = (name: string) => tokenValue(tokens, name);

  it('resolves every alias and keeps semantic tokens as aliases only', () => {
    expect(flattenTokens(tokenSource)).toHaveLength(54);
    for (const [name, token] of tokens) {
      expect(token.resolved, name).not.toMatch(/[{}]/);
      if (name.startsWith('color.') && !/^color\.(neutral|blue|red|green)\./.test(name)) expect(token.value, name).toMatch(/^\{.+\}$/);
    }
  });

  it('meets 4.5:1 for text and 3:1 for borders and focus on the surfaces they sit on', () => {
    const text: [string, string][] = [
      ['color.text.default', 'color.surface.page'], ['color.text.default', 'color.surface.card'], ['color.text.muted', 'color.surface.page'],
      ['color.text.link', 'color.surface.card'], ['color.text.link', 'color.surface.page'], ['color.text.error', 'color.surface.error'],
      ['color.text.error', 'color.surface.card'], ['color.text.success', 'color.surface.success'], ['color.text.inverse', 'color.action.primary'],
      ['color.text.inverse', 'color.action.primary-hover'], ['color.text.default', 'color.surface.error'], ['color.text.default', 'color.surface.success'],
    ];
    for (const [fg, bg] of text) expect(contrastRatio(value(fg), value(bg)), fg + ' on ' + bg).toBeGreaterThanOrEqual(4.5);
    const ui: [string, string][] = [
      ['color.border.input', 'color.surface.page'], ['color.border.input', 'color.surface.card'], ['color.border.error', 'color.surface.card'],
      ['color.focus.ring', 'color.surface.page'], ['color.focus.ring', 'color.surface.card'], ['color.action.primary', 'color.surface.card'],
    ];
    for (const [fg, bg] of ui) expect(contrastRatio(value(fg), value(bg)), fg + ' on ' + bg).toBeGreaterThanOrEqual(3);
  });

  it('publishes an exact copy of the token source', () => {
    expect(JSON.parse(readFileSync(PUBLIC + 'pocket-invoice-tokens.json', 'utf8'))).toEqual(tokenSource);
  });
});

describe('the published QA report', () => {
  it('covers every state in both browser projects, with no axe finding and no sideways scroll', () => {
    const report = readFileSync(PUBLIC + 'qa-report.md', 'utf8');
    for (const project of ['Desktop project', 'Mobile project']) expect(report).toContain('## ' + project);
    expect(report.match(new RegExp('States checked: ' + STATES.length + ' of ' + STATES.length, 'g'))).toHaveLength(2);
    for (const state of STATES) {
      const rows = report.split('\n').filter((line) => line.includes('(' + state.id + ') |'));
      expect(rows, state.id).toHaveLength(2);
      for (const row of rows) expect(row, state.id).toMatch(/\| none \| none \| no sideways scroll \|/);
    }
  });
});

describe('the published Penpot file', () => {
  const entries = readZip(published);
  const json = (pattern: RegExp) => entries.filter((entry) => pattern.test(entry.name)).map((entry) => decode(entry.data));
  const pages = json(/^files\/[^/]+\/pages\/[^/]+\.json$/) as { id: string; name: string; flows?: Record<string, { startingFrame: string }> }[];
  const shapes = json(/^files\/[^/]+\/pages\/[^/]+\/[^/]+\.json$/) as (Shape & { pageId: string })[];
  const byId = new Map(shapes.map((shape) => [shape.id, shape]));
  const ROOT = '00000000-0000-0000-0000-000000000000';
  /** The state a top-level board stands for, from its name "<state id>: <title>". */
  const stateOf = (shape: Shape | undefined): StateId | undefined => {
    const id = shape?.name.split(':')[0];
    return STATE_IDS.find((state) => state === id);
  };
  const stateBoardOf = (shape: Shape): Shape | undefined => {
    let current: Shape | undefined = shape;
    while (current && current.parentId !== ROOT) current = current.parentId ? byId.get(current.parentId) : undefined;
    return current;
  };

  it('is a Penpot export with the four pages in order', () => {
    expect((json(/^manifest\.json$/)[0] as { type: string }).type).toBe('penpot/export-files');
    expect(pages.map((page) => page.name).sort()).toEqual(['01 Sitemap and flow', '02 Low fidelity (390 px)', '03 Tokens and components', '04 High fidelity (390 px and 1280 px)']);
  });

  for (const pageName of ['02 Low fidelity (390 px)', '04 High fidelity (390 px and 1280 px)']) {
    describe(pageName, () => {
      const page = pages.find((item) => item.name === pageName);
      const onPage = shapes.filter((shape) => shape.pageId === page?.id);
      const boards = onPage.filter((shape) => shape.type === 'frame' && shape.parentId === ROOT && stateOf(shape));

      it('has one board per state and a flow that starts at sign-up', () => {
        expect(boards.map(stateOf).sort()).toEqual([...STATE_IDS].sort());
        const flows = Object.values(page?.flows ?? {});
        expect(flows).toHaveLength(1);
        expect(stateOf(byId.get(flows[0]?.startingFrame ?? ''))).toBe(START_STATE);
      });

      it('wires every transition as an interaction, and nothing else', () => {
        const wired = new Set<string>();
        for (const shape of onPage) {
          for (const interaction of shape.interactions ?? []) {
            const from = stateOf(stateBoardOf(shape));
            const to = interaction.actionType === 'close-overlay'
              ? TRANSITIONS.find((t) => t.from === from && t.kind === 'overlay-close')?.to
              : stateOf(byId.get(interaction.destination ?? ''));
            expect(TRANSITIONS.some((t) => t.from === from && t.to === to), shape.name + ': ' + from + ' > ' + to).toBe(true);
            wired.add(from + '>' + to);
          }
        }
        expect([...wired].sort()).toEqual(TRANSITIONS.map((t) => t.from + '>' + t.to).sort());
      });
    });
  }

  it('carries the 8 components, the library and the same tokens as the token file', () => {
    expect(json(/\/components\/[^/]+\.json$/)).toHaveLength(8);
    expect(json(/\/colors\/[^/]+\.json$/)).toHaveLength(16);
    expect(json(/\/typographies\/[^/]+\.json$/)).toHaveLength(5);
    const tokens = json(/\/tokens\.json$/)[0] as { sets?: unknown };
    expect(JSON.stringify(tokens)).toContain('"semantic"');
    for (const token of flattenTokens(tokenSource)) expect(JSON.stringify(tokens), token.name).toContain('"' + token.value.replace(/"/g, '\\"') + '"');
  });

  it('is exactly what the generator builds today', async () => {
    const built = await build();
    expect(createHash('sha256').update(built).digest('hex')).toBe(createHash('sha256').update(published).digest('hex'));
  }, 60_000);

  it('is the file the Penpot import check ran against, and that check passed', () => {
    const record = JSON.parse(readFileSync(PUBLIC + 'penpot-import-check.json', 'utf8')) as { fileSha256: string; checks: { name: string; pass: boolean }[] };
    expect(record.fileSha256).toBe(createHash('sha256').update(published).digest('hex'));
    expect(record.checks.length).toBeGreaterThan(10);
    expect(record.checks.filter((check) => !check.pass)).toEqual([]);
  });
});
