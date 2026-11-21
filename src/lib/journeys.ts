import { z } from 'zod';
import { kataId } from './kata-schema';
import { resolveIdentifier, type IdentifierKind, type IdentifierLedger, type IdentifierSet } from './taxonomy-identifiers';

/**
 * Optional journeys from an Ignite Curiosity program to Developer Dojo practice (#83).
 *
 * A journey maps the five SPARK steps of one Ignite Curiosity program (Seek, Play, Apply, Research, Know) to
 * Dojo tracks and katas. Every Dojo reference is a stable identifier: a kata ID or kata route from the
 * taxonomy lock (#82, src/data/taxonomy-lock.json), a field ID from the same lock, or a track slug (tracks
 * never move: docs/track-urls.md). The build resolves every reference here and fails, naming each problem,
 * when one is missing from the lock, no longer live, moved, or has no page. Ignite Curiosity owns its own
 * pages: a journey keeps only a versioned reference to them (URL and the day it was checked).
 *
 * Pure: the build (src/lib/journey-content.ts) and tests/journeys.test.ts run the same check.
 * The editor's guide and the ownership and privacy record are docs/journeys.md.
 */

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use a lower-case slug');
const isoDay = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD');
const text = z.string().trim().min(1);

export const SPARK_STEPS = ['seek', 'play', 'apply', 'research', 'know'] as const;
export type SparkStep = (typeof SPARK_STEPS)[number];
export const SPARK_LABELS: Record<SparkStep, string> = { seek: 'Seek', play: 'Play', apply: 'Apply', research: 'Research', know: 'Know' };

/** A Dojo destination, named only by stable identifiers. */
export const journeyRefSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('track'), slug }),
  z.strictObject({ kind: z.literal('kata'), id: kataId }),
  z.strictObject({
    kind: z.literal('kata-route'),
    route: z.string().regex(/^\/katas\/[a-z0-9]+(?:-[a-z0-9]+)*$/, 'a kata route is /katas/<lower-case-slug>'),
    /** An id on that page; scripts/check-links.mjs fails the build when the built page has no such id. */
    anchor: slug.optional(),
  }),
]);
export type JourneyRef = z.infer<typeof journeyRefSchema>;

const stepSchema = z.strictObject({
  spark: z.enum(SPARK_STEPS),
  /** What the Ignite Curiosity step asks, in our words, from the program page it names. */
  ignite: text,
  /** What the Dojo practice adds at this step. */
  dojo: text,
  refs: z.array(journeyRefSchema).min(1),
});

export const journeySchema = z.strictObject({
  /** Public URL /journeys/<id>/. Never rename one: Ignite Curiosity may link to it. */
  id: slug,
  title: text,
  summary: text,
  /** Taxonomy fields (locked identifiers) this journey belongs to. */
  fieldIds: z.array(slug).min(1),
  ignite: z.strictObject({
    /** The program's name as Ignite Curiosity shows it. */
    program: text,
    /** Ignite Curiosity's own page: the source of truth for the program. */
    url: z.url({ protocol: /^https$/, hostname: /^ignitecuriosity\.org$/ }).refine((url) => !url.includes('?') && !url.includes('#'), 'link the page itself: no query or fragment, so nothing identifies the visitor or this site'),
    /** How Ignite Curiosity describes the program's status on that page, quoted in plain words. */
    status: text,
    /** The day the page and its links were last read. */
    checkedOn: isoDay,
    /** Dojo track slugs the Ignite page links to on checkedOn: the journey in the other direction. */
    linksToTracks: z.array(slug),
  }),
  steps: z.array(stepSchema).length(SPARK_STEPS.length),
  /** Foundation katas that apply at every step, whatever the field. */
  foundations: z.array(journeyRefSchema).min(1),
}).superRefine((journey, ctx) => {
  journey.steps.forEach((step, index) => {
    if (step.spark !== SPARK_STEPS[index]) ctx.addIssue({ code: 'custom', path: ['steps', index, 'spark'], message: `step ${index + 1} must be ${SPARK_STEPS[index]}: the SPARK order is Seek, Play, Apply, Research, Know` });
  });
});
export type Journey = z.infer<typeof journeySchema>;
export type JourneyInput = z.input<typeof journeySchema>;

/** Everything a reference can resolve against. Built from live data, never typed by hand. */
export interface JourneyRegistries {
  lock: IdentifierSet;
  live: IdentifierSet;
  ledger: IdentifierLedger;
  /** Track slug -> title, from src/content/tracks. */
  tracks: ReadonlyMap<string, string>;
  /** Kata ID -> its page, from the curated catalog and the recipe records. */
  kataPages: ReadonlyMap<string, { href: string; title: string }>;
  /** Kata route -> title, from the kata directory and the recipe records. */
  routeTitles: ReadonlyMap<string, string>;
}

export interface ResolvedRef {
  kind: JourneyRef['kind'];
  /** The stable identifier, as written in the journey. */
  key: string;
  href: string;
  title: string;
  /** Track slug, for on-device lesson progress. */
  track?: string;
}

export interface ResolvedJourney extends Omit<Journey, 'steps' | 'foundations'> {
  steps: (Omit<Journey['steps'][number], 'refs'> & { refs: ResolvedRef[] })[];
  foundations: ResolvedRef[];
  linksBack: ResolvedRef[];
}

export class JourneyReferenceError extends Error {
  constructor(readonly problems: readonly string[]) {
    super(`Journeys name identifiers that do not resolve:\n${problems.join('\n')}`);
    this.name = 'JourneyReferenceError';
  }
}

/** Why a taxonomy identifier cannot be used, or undefined when it is locked and live. */
function lockProblem(kind: IdentifierKind, id: string, registries: JourneyRegistries): string | undefined {
  if (!registries.lock[kind].includes(id)) return `${kind} ${id} is not in src/data/taxonomy-lock.json: name a published identifier`;
  if (registries.live[kind].includes(id)) return undefined;
  const now = resolveIdentifier(kind, id, registries.live, registries.ledger);
  if (now !== undefined) return `${kind} ${id} moved to ${now}: update the journey`;
  return `${kind} ${id} was retired: choose another`;
}

function resolveRef(ref: JourneyRef, where: string, registries: JourneyRegistries, problems: string[]): ResolvedRef | undefined {
  const fail = (message: string) => { problems.push(`${where}: ${message}`); return undefined; };
  switch (ref.kind) {
    case 'track': {
      const title = registries.tracks.get(ref.slug);
      if (title === undefined) return fail(`track ${ref.slug} has no file in src/content/tracks`);
      return { kind: 'track', key: ref.slug, href: `/library/tracks/${ref.slug}`, title, track: ref.slug };
    }
    case 'kata': {
      const problem = lockProblem('kata-id', ref.id, registries);
      if (problem) return fail(problem);
      const page = registries.kataPages.get(ref.id);
      if (!page) return fail(`kata-id ${ref.id} has no page yet: link a kata a learner can open`);
      return { kind: 'kata', key: ref.id, href: page.href, title: page.title };
    }
    case 'kata-route': {
      const problem = lockProblem('kata-route', ref.route, registries);
      if (problem) return fail(problem);
      const title = registries.routeTitles.get(ref.route);
      if (title === undefined) return fail(`kata-route ${ref.route} is not in the kata directory or the recipes, so it has no title`);
      return { kind: 'kata-route', key: ref.anchor ? `${ref.route}#${ref.anchor}` : ref.route, href: ref.anchor ? `${ref.route}#${ref.anchor}` : ref.route, title };
    }
  }
}

/**
 * Check every journey against the live registries. Returns the resolved journeys and every problem, one per
 * line, each saying what to do. An empty problem list means every reference resolves to a page that exists.
 */
export function checkJourneys(inputs: readonly JourneyInput[], registries: JourneyRegistries): { journeys: ResolvedJourney[]; problems: string[] } {
  const problems: string[] = [];
  const journeys: ResolvedJourney[] = [];
  const seen = new Set<string>();
  inputs.forEach((input, index) => {
    const parsed = journeySchema.safeParse(input);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) problems.push(`journey ${index + 1}: ${issue.path.join('.') || '(journey)'}: ${issue.message}`);
      return;
    }
    const journey = parsed.data;
    if (seen.has(journey.id)) problems.push(`journey ${journey.id} is listed twice: keep one`);
    seen.add(journey.id);
    for (const field of journey.fieldIds) {
      const problem = lockProblem('field', field, registries);
      if (problem) problems.push(`journey ${journey.id}: ${problem}`);
    }
    const keep = (refs: (ResolvedRef | undefined)[]) => refs.filter((ref): ref is ResolvedRef => ref !== undefined);
    journeys.push({
      ...journey,
      steps: journey.steps.map((step) => ({
        ...step,
        refs: keep(step.refs.map((ref) => resolveRef(ref, `journey ${journey.id}, ${step.spark}`, registries, problems))),
      })),
      foundations: keep(journey.foundations.map((ref) => resolveRef(ref, `journey ${journey.id}, foundations`, registries, problems))),
      linksBack: keep(journey.ignite.linksToTracks.map((track) => resolveRef({ kind: 'track', slug: track }, `journey ${journey.id}, ignite.linksToTracks`, registries, problems))),
    });
  });
  return { journeys, problems };
}

/** Resolve every journey, or throw JourneyReferenceError listing every problem. Used by the build. */
export function resolveJourneys(inputs: readonly JourneyInput[], registries: JourneyRegistries): ResolvedJourney[] {
  const { journeys, problems } = checkJourneys(inputs, registries);
  if (problems.length) throw new JourneyReferenceError(problems);
  return journeys;
}
