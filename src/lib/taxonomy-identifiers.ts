import { z } from 'zod';

/**
 * Stable taxonomy identifiers (#82). Every identifier the kata taxonomy has ever published is kept in
 * an append-only lock (src/data/taxonomy-lock.json). An identifier may leave the live data only
 * through the ledger (src/data/taxonomy-moves.json): a move names its replacement, a retirement
 * reserves it forever. A moved kata route also becomes a redirect (astro.config.mjs reads
 * routeRedirects), so an old link keeps working.
 *
 * Pure: the build (src/lib/kata-recipe-content.ts) and the tests (tests/taxonomy-identifiers.test.ts)
 * run the same check on the same inputs. docs/kata-taxonomy.md is the guide for editors.
 */

/** Identifier kinds, each with its own namespace. */
export const IDENTIFIER_KINDS = ['kata-id', 'kata-route', 'field', 'outcome', 'artifact', 'capability', 'constraint', 'stack-recipe'] as const;
export type IdentifierKind = (typeof IDENTIFIER_KINDS)[number];

/** Kata IDs are permanent: a kata that changes keeps its ID; one that ends is retired, never renamed. */
export const MOVABLE_KINDS = ['kata-route', 'field', 'outcome', 'artifact', 'capability', 'constraint', 'stack-recipe'] as const;
/** A published route always leads somewhere: it can be moved (with a redirect), never only retired. */
export const RETIRABLE_KINDS = ['kata-id', 'field', 'outcome', 'artifact', 'capability', 'constraint', 'stack-recipe'] as const;

export type IdentifierSet = Record<IdentifierKind, readonly string[]>;

const KATA_ROUTE = /^\/katas\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const record = {
  /** The issue that decided the change. */
  issue: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD'),
  reason: z.string().trim().min(1),
};

export const identifierMoveSchema = z.strictObject({ kind: z.enum(MOVABLE_KINDS), from: z.string().min(1), to: z.string().min(1), ...record })
  .superRefine((move, ctx) => {
    if (move.from === move.to) ctx.addIssue({ code: 'custom', path: ['to'], message: 'a move must change the identifier' });
    if (move.kind === 'kata-route') {
      for (const key of ['from', 'to'] as const) {
        if (!KATA_ROUTE.test(move[key])) ctx.addIssue({ code: 'custom', path: [key], message: 'a kata route is /katas/<lower-case-slug>' });
      }
    }
  });
export const identifierRetirementSchema = z.strictObject({ kind: z.enum(RETIRABLE_KINDS), id: z.string().min(1), ...record });

export const identifierLedgerSchema = z.strictObject({
  moves: z.array(identifierMoveSchema),
  retired: z.array(identifierRetirementSchema),
});
export type IdentifierLedger = z.output<typeof identifierLedgerSchema>;
export type IdentifierMove = z.output<typeof identifierMoveSchema>;

export const identifierLockSchema = z.strictObject({
  'kata-id': z.array(z.string().min(1)),
  'kata-route': z.array(z.string().min(1)),
  field: z.array(z.string().min(1)),
  outcome: z.array(z.string().min(1)),
  artifact: z.array(z.string().min(1)),
  capability: z.array(z.string().min(1)),
  constraint: z.array(z.string().min(1)),
  'stack-recipe': z.array(z.string().min(1)),
}) satisfies z.ZodType<IdentifierSet>;

export class TaxonomyIdentifierError extends Error {
  constructor(readonly problems: readonly string[]) {
    super(`Taxonomy identifiers are not stable:\n${problems.join('\n')}`);
    this.name = 'TaxonomyIdentifierError';
  }
}

function parseFile<T>(schema: z.ZodType<T>, input: unknown, file: string): T {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    throw new TaxonomyIdentifierError(parsed.error.issues.map((issue) => `${file}: ${issue.path.join('.') || '(file)'}: ${issue.message}`));
  }
  return parsed.data;
}

/** Parse src/data/taxonomy-moves.json, naming every problem. */
export function parseLedger(input: unknown): IdentifierLedger {
  return parseFile(identifierLedgerSchema, input, 'src/data/taxonomy-moves.json');
}

/** Parse src/data/taxonomy-lock.json, naming every problem. */
export function parseLock(input: unknown): IdentifierSet {
  return parseFile(identifierLockSchema, input, 'src/data/taxonomy-lock.json');
}

/** Where today's identifiers come from. Every list is read from the live data, never typed by hand. */
export interface IdentifierSources {
  /** IDs in the curated catalog, in recipe records and in staged records: every kata ID in use or reserved. */
  kataIds: readonly string[];
  /** Kata pages that exist, as /katas/<slug>: hand-written pages and recipe pages. */
  kataRoutes: readonly string[];
  fields: readonly string[];
  outcomes: readonly string[];
  artifacts: readonly string[];
  capabilities: readonly string[];
  constraints: readonly string[];
  stackRecipes: readonly string[];
}

export function currentIdentifiers(sources: IdentifierSources): IdentifierSet {
  const unique = (values: readonly string[]) => [...new Set(values)].sort();
  return {
    'kata-id': unique(sources.kataIds),
    'kata-route': unique(sources.kataRoutes),
    field: unique(sources.fields),
    outcome: unique(sources.outcomes),
    artifact: unique(sources.artifacts),
    capability: unique(sources.capabilities),
    constraint: unique(sources.constraints),
    'stack-recipe': unique(sources.stackRecipes),
  };
}

/** Follow a chain of moves of one kind to its end. Returns undefined on a cycle. */
function finalTarget(kind: IdentifierKind, from: string, moves: readonly IdentifierMove[]): string | undefined {
  const seen = new Set<string>([from]);
  let current = from;
  for (;;) {
    const next = moves.find((move) => move.kind === kind && move.from === current);
    if (!next) return current;
    if (seen.has(next.to)) return undefined;
    seen.add(next.to);
    current = next.to;
  }
}

/**
 * Check the live identifiers against the lock and the ledger. Returns every problem, one per line,
 * each saying what to do. An empty list means every identifier ever published still resolves.
 */
export function checkIdentifiers(current: IdentifierSet, lock: IdentifierSet, ledger: IdentifierLedger): string[] {
  const problems: string[] = [];
  for (const kind of IDENTIFIER_KINDS) {
    const live = new Set(current[kind]);
    const locked = new Set(lock[kind]);
    const moves = ledger.moves.filter((move) => move.kind === kind);
    const retirements = ledger.retired.filter((entry) => entry.kind === kind).map((entry) => entry.id);
    const retired = new Set(retirements);
    const moved = new Set<string>();

    for (const move of moves) {
      if (moved.has(move.from)) problems.push(`${kind} ${move.from} is moved twice in src/data/taxonomy-moves.json: keep one move`);
      moved.add(move.from);
      if (!locked.has(move.from)) problems.push(`${kind} ${move.from} was never published, so it needs no move: delete the entry`);
      if (live.has(move.from)) problems.push(`${kind} ${move.from} is moved but still in use: finish the rename or delete the move`);
      if (retired.has(move.from)) problems.push(`${kind} ${move.from} is both moved and retired: keep one`);
      const target = finalTarget(kind, move.from, moves);
      if (target === undefined) problems.push(`${kind} ${move.from} is part of a cycle of moves`);
      else if (!live.has(target)) problems.push(`${kind} ${move.from} moves to ${target}, which does not exist${kind === 'kata-route' ? ' (the redirect would lead to a missing page)' : ''}`);
    }
    retirements.forEach((id, index) => {
      if (retirements.indexOf(id) !== index) problems.push(`${kind} ${id} is retired twice: keep one entry`);
      if (!locked.has(id)) problems.push(`${kind} ${id} was never published, so it needs no retirement: delete the entry`);
      if (live.has(id)) problems.push(`${kind} ${id} is retired and may never be used again: choose a new identifier`);
    });
    for (const id of locked) {
      if (live.has(id) || moved.has(id) || retired.has(id)) continue;
      if (kind === 'kata-route') problems.push(`kata-route ${id} was published and its page is gone: add a move to src/data/taxonomy-moves.json so it redirects`);
      else if (kind === 'kata-id') problems.push(`kata-id ${id} was published and is gone: kata IDs never move, so restore it or retire it in src/data/taxonomy-moves.json`);
      else problems.push(`${kind} ${id} was published and is gone: add a move to its new ID, or retire it, in src/data/taxonomy-moves.json`);
    }
    for (const id of live) {
      if (!locked.has(id)) problems.push(`${kind} ${id} is new and not in the lock: run npm run taxonomy:lock and commit src/data/taxonomy-lock.json`);
    }
  }
  return problems;
}

/** Throws TaxonomyIdentifierError listing every problem. Used by the build. */
export function assertIdentifiers(current: IdentifierSet, lock: IdentifierSet, ledger: IdentifierLedger): void {
  const problems = checkIdentifiers(current, lock, ledger);
  if (problems.length) throw new TaxonomyIdentifierError(problems);
}

/** The lock after adding today's identifiers. It only grows: nothing is ever removed from it. */
export function extendLock(lock: IdentifierSet, current: IdentifierSet): IdentifierSet {
  const merged = (kind: IdentifierKind) => [...new Set([...lock[kind], ...current[kind]])].sort();
  return {
    'kata-id': merged('kata-id'), 'kata-route': merged('kata-route'), field: merged('field'), outcome: merged('outcome'),
    artifact: merged('artifact'), capability: merged('capability'), constraint: merged('constraint'), 'stack-recipe': merged('stack-recipe'),
  };
}

/** Static redirects for moved kata routes, each straight to the page in use now (chains flattened). */
export function routeRedirects(ledger: IdentifierLedger): Record<string, string> {
  const moves = ledger.moves.filter((move) => move.kind === 'kata-route');
  const redirects: Record<string, string> = {};
  for (const move of moves) {
    const target = finalTarget('kata-route', move.from, moves);
    if (target !== undefined) redirects[move.from] = target;
  }
  return redirects;
}

/** The identifier in use now for an old one, following moves. Undefined when it was retired or is unknown. */
export function resolveIdentifier(kind: IdentifierKind, id: string, current: IdentifierSet, ledger: IdentifierLedger): string | undefined {
  if (current[kind].includes(id)) return id;
  const target = finalTarget(kind, id, ledger.moves);
  return target !== undefined && target !== id && current[kind].includes(target) ? target : undefined;
}
