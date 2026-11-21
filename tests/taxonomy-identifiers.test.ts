import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import astroConfig from '../astro.config.mjs';
import {
  checkIdentifiers, extendLock, identifierLedgerSchema, resolveIdentifier, routeRedirects,
  type IdentifierLedger, type IdentifierSet,
} from '../src/lib/taxonomy-identifiers';
import { identifierLedger, identifierLock, liveIdentifiers } from '../src/lib/taxonomy-sources';

// Stable taxonomy identifiers (#82, docs/kata-taxonomy.md "Identifiers"). The build runs the same
// check (src/lib/kata-recipe-content.ts). `npm run taxonomy:lock` runs this file with
// TAXONOMY_LOCK_WRITE=1 to add new identifiers to the lock; it never removes one.

const LOCK = 'src/data/taxonomy-lock.json';
const RECIPES = 'src/content/kata-recipes';
const recipes = readdirSync(RECIPES).filter((file) => file.endsWith('.yaml')).map((file) => {
  const data = parseYaml(readFileSync(join(RECIPES, file), 'utf8')) as { metadata?: { id?: unknown } };
  return { slug: file.slice(0, -5), id: String(data.metadata?.id) };
});
const handWrittenSlugs = readdirSync('src/pages/katas').filter((file) => file.endsWith('.astro') && !file.startsWith('[')).map((file) => file.slice(0, -6));
const live = liveIdentifiers({ recipes, handWrittenSlugs });

if (process.env['TAXONOMY_LOCK_WRITE'] === '1') {
  writeFileSync(join(__dirname, '..', LOCK), `${JSON.stringify(extendLock(identifierLock, live), null, 2)}\n`);
}

describe('the repository keeps every published identifier', () => {
  it('every locked identifier is in use, moved or retired, and every live one is locked', () => {
    const lock = process.env['TAXONOMY_LOCK_WRITE'] === '1' ? extendLock(identifierLock, live) : identifierLock;
    expect(checkIdentifiers(live, lock, identifierLedger)).toEqual([]);
  });

  it('the lock lists every kind and is sorted, so a diff shows exactly what was added', () => {
    for (const [kind, ids] of Object.entries(identifierLock)) expect([...ids].sort(), kind).toEqual(ids);
  });

  it('the site serves a redirect for every moved kata route, straight to the page in use now', () => {
    expect(astroConfig.redirects).toEqual(routeRedirects(identifierLedger));
    for (const [from, to] of Object.entries(routeRedirects(identifierLedger))) {
      expect(live['kata-route'], from).not.toContain(from);
      expect(live['kata-route'], from).toContain(to);
    }
  });
});

// Synthetic cases: each fails for the reason it names, against a tiny lock.
const none: IdentifierSet = { 'kata-id': [], 'kata-route': [], field: [], outcome: [], artifact: [], capability: [], constraint: [], 'stack-recipe': [] };
const set = (values: Partial<IdentifierSet>): IdentifierSet => ({ ...none, ...values });
const lock = set({ 'kata-id': ['UX-001', 'UX-002'], 'kata-route': ['/katas/old-journey'], field: ['bim', 'ux'], outcome: ['usable-flow'] });
const today = set({ 'kata-id': ['UX-001', 'UX-002'], 'kata-route': ['/katas/old-journey'], field: ['ux', 'bim'], outcome: ['usable-flow'] });
const ledger = (value: Partial<IdentifierLedger>): IdentifierLedger => ({ moves: [], retired: [], ...value });
const decided = { issue: 82, date: '2026-11-21', reason: 'test' };

describe('a published identifier cannot silently disappear', () => {
  it('accepts an unchanged taxonomy, so the cases below fail for their own reason', () => {
    expect(checkIdentifiers(today, lock, ledger({}))).toEqual([]);
  });

  it('rejects a renamed field until the rename is recorded, then accepts it', () => {
    const renamed = { ...today, field: ['ux', 'architecture-bim'] };
    expect(checkIdentifiers(renamed, extendLock(lock, renamed), ledger({}))).toEqual([
      'field bim was published and is gone: add a move to its new ID, or retire it, in src/data/taxonomy-moves.json',
    ]);
    const moved = ledger({ moves: [{ kind: 'field', from: 'bim', to: 'architecture-bim', ...decided }] });
    expect(checkIdentifiers(renamed, extendLock(lock, renamed), moved)).toEqual([]);
    expect(resolveIdentifier('field', 'bim', renamed, moved)).toBe('architecture-bim');
  });

  it('requires a redirect for a kata page that moved', () => {
    const moved = { ...today, 'kata-route': ['/katas/design-a-journey'] };
    expect(checkIdentifiers(moved, extendLock(lock, moved), ledger({}))).toEqual([
      'kata-route /katas/old-journey was published and its page is gone: add a move to src/data/taxonomy-moves.json so it redirects',
    ]);
    const withMove = ledger({ moves: [{ kind: 'kata-route', from: '/katas/old-journey', to: '/katas/design-a-journey', ...decided }] });
    expect(checkIdentifiers(moved, extendLock(lock, moved), withMove)).toEqual([]);
    expect(routeRedirects(withMove)).toEqual({ '/katas/old-journey': '/katas/design-a-journey' });
  });

  it('never lets a kata ID move, and never lets a route be retired without a destination', () => {
    expect(identifierLedgerSchema.safeParse({ moves: [{ kind: 'kata-id', from: 'UX-001', to: 'UX-101', ...decided }], retired: [] }).success).toBe(false);
    expect(identifierLedgerSchema.safeParse({ moves: [], retired: [{ kind: 'kata-route', id: '/katas/old-journey', ...decided }] }).success).toBe(false);
    const gone = { ...today, 'kata-id': ['UX-001'] };
    expect(checkIdentifiers(gone, lock, ledger({}))).toEqual([
      'kata-id UX-002 was published and is gone: kata IDs never move, so restore it or retire it in src/data/taxonomy-moves.json',
    ]);
    expect(checkIdentifiers(gone, lock, ledger({ retired: [{ kind: 'kata-id', id: 'UX-002', ...decided }] }))).toEqual([]);
  });

  it('never reuses a retired identifier', () => {
    const retired = ledger({ retired: [{ kind: 'outcome', id: 'usable-flow', ...decided }] });
    expect(checkIdentifiers(today, lock, retired)).toEqual(['outcome usable-flow is retired and may never be used again: choose a new identifier']);
  });

  it('rejects a move to an identifier that does not exist, and a cycle', () => {
    const missing = ledger({ moves: [{ kind: 'kata-route', from: '/katas/old-journey', to: '/katas/nowhere', ...decided }] });
    const noPage = { ...today, 'kata-route': [] };
    expect(checkIdentifiers(noPage, lock, missing)).toEqual([
      'kata-route /katas/old-journey moves to /katas/nowhere, which does not exist (the redirect would lead to a missing page)',
    ]);
    const cycleLock = set({ field: ['a', 'b'] });
    const cycle = ledger({ moves: [{ kind: 'field', from: 'a', to: 'b', ...decided }, { kind: 'field', from: 'b', to: 'a', ...decided }] });
    expect(checkIdentifiers(none, cycleLock, cycle)).toEqual(['field a is part of a cycle of moves', 'field b is part of a cycle of moves']);
  });

  it('flattens a chain of moves into one redirect per old route', () => {
    const chainLock = set({ 'kata-route': ['/katas/a', '/katas/b', '/katas/c'] });
    const chain = ledger({ moves: [{ kind: 'kata-route', from: '/katas/a', to: '/katas/b', ...decided }, { kind: 'kata-route', from: '/katas/b', to: '/katas/c', ...decided }] });
    expect(checkIdentifiers(set({ 'kata-route': ['/katas/c'] }), chainLock, chain)).toEqual([]);
    expect(routeRedirects(chain)).toEqual({ '/katas/a': '/katas/c', '/katas/b': '/katas/c' });
  });

  it('asks for the lock when an identifier is new, and the lock only ever grows', () => {
    const added = { ...today, outcome: ['usable-flow', 'quantity-takeoff'] };
    expect(checkIdentifiers(added, lock, ledger({}))).toEqual([
      'outcome quantity-takeoff is new and not in the lock: run npm run taxonomy:lock and commit src/data/taxonomy-lock.json',
    ]);
    expect(extendLock(lock, none)).toEqual(lock);
    expect(extendLock(lock, added).outcome).toEqual(['quantity-takeoff', 'usable-flow']);
  });

  it('rejects ledger entries that change nothing', () => {
    const stale = ledger({ moves: [{ kind: 'field', from: 'never-published', to: 'ux', ...decided }], retired: [{ kind: 'field', id: 'ux', ...decided }] });
    expect(checkIdentifiers(today, lock, stale)).toEqual([
      'field never-published was never published, so it needs no move: delete the entry',
      'field ux is retired and may never be used again: choose a new identifier',
    ]);
  });
});
