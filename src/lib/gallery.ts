import { z } from 'zod';
import type { KataCatalogEntry } from './kata-catalog';
import { dimensionId, kataId, type KataMetadata } from './kata-schema';
import type { RecipeStatus } from './kata-recipe';
import type { ResolvedRecipe } from './kata-recipes';

/**
 * The outcome and field gallery (#87). An entry is a finished artifact that actually exists, with its
 * provenance, rights and a dated check, linked to the kata that teaches it. There is no "unverified"
 * entry: an example that has not been checked is left out, and the gallery shows an honest empty or
 * planned state for its outcome and field instead.
 *
 * Records live in src/data/gallery.ts; the page is src/pages/gallery.astro; the editing guide is
 * docs/gallery.md. resolveGallery is pure, so the build (src/lib/gallery-content.ts) and the tests
 * (tests/gallery.test.ts) run the same validation.
 */

const text = z.string().trim().min(1);
const isoDate = z.iso.date();
const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.domain });
const localPath = z.string().regex(/^\/[A-Za-z0-9/._-]*$/, 'use a site path such as /examples/file.csv');
const link = z.union([httpsUrl, localPath]);

/**
 * - native: the actual file the work produced, served by the Dojo, that a learner can open, inspect and edit.
 * - preview: the artifact lives with its creator; the gallery links to their rendered version.
 * A planned outcome has no entry at all; the page derives it from the outcome vocabulary.
 */
export const ARTIFACT_FORMS = ['native', 'preview'] as const;
export type ArtifactForm = (typeof ARTIFACT_FORMS)[number];

/**
 * - automated-check: CI re-checks the artifact itself on every pipeline (evidenceHref says how).
 * - source-check: a maintainer opened the creator's artifact and its terms on the date. Nothing was reproduced.
 */
export const GALLERY_CHECK_METHODS = ['automated-check', 'source-check'] as const;
export type GalleryCheckMethod = (typeof GALLERY_CHECK_METHODS)[number];

export const galleryEntrySchema = z.strictObject({
  id: dimensionId,
  title: text,
  summary: text,
  form: z.enum(ARTIFACT_FORMS),
  artifact: z.strictObject({
    /** What the file is, in plain words: "Single-file HTML", "CSV evidence table". */
    format: text,
    files: z.array(z.strictObject({ label: text, href: link })).min(1),
  }),
  provenance: z.strictObject({
    creator: text,
    /** How it was made, including AI assistance and what was not recorded. */
    madeWith: text,
    /** Where the artifact and its inputs come from. */
    source: text,
    /** The licence or terms, in plain words. Recording them is not legal advice. */
    rights: text,
    rightsHref: link.optional(),
    /** When the artifact was made or first published. */
    created: isoDate,
  }),
  verification: z.strictObject({
    method: z.enum(GALLERY_CHECK_METHODS),
    /** The date the check was actually done. Never backdated. */
    date: isoDate,
    checked: text,
    /** What the check does not show. Required: every check has limits. */
    notChecked: text,
    evidenceHref: link.optional(),
    nextCheck: isoDate,
  }),
  /** At least one outcome, each one an outcome of the linked kata. */
  outcomeIds: z.array(dimensionId).min(1),
  /** Every field the artifact genuinely belongs to. One artifact may sit in several. */
  fieldIds: z.array(dimensionId).min(1),
  /** The kata that teaches the outcome: its recipe, QA evidence, foundations and belt criteria come from it. */
  kataId,
  /** Required exactly when the kata has no page yet; says why and where to practise meanwhile. */
  recipeUnavailable: z.strictObject({ reason: text, instead: z.strictObject({ label: text, href: localPath }) }).optional(),
  /** The exercise a learner works to make their own version. */
  exercise: z.strictObject({ title: text, href: link }),
}).superRefine((entry, ctx) => {
  const local = (href: string) => href.startsWith('/');
  if (entry.form === 'native') {
    entry.artifact.files.forEach((file, index) => {
      if (!local(file.href)) ctx.addIssue({ code: 'custom', path: ['artifact', 'files', index, 'href'], message: 'a native artifact is served by the Dojo; use a site path' });
    });
    if (entry.verification.method !== 'automated-check') ctx.addIssue({ code: 'custom', path: ['verification', 'method'], message: 'a native artifact is re-checked in CI (automated-check)' });
    if (!entry.verification.evidenceHref) ctx.addIssue({ code: 'custom', path: ['verification', 'evidenceHref'], message: 'an automated check links to its evidence' });
  } else {
    entry.artifact.files.forEach((file, index) => {
      if (local(file.href)) ctx.addIssue({ code: 'custom', path: ['artifact', 'files', index, 'href'], message: 'a preview links to the creator\'s own copy (https)' });
    });
    if (entry.verification.method !== 'source-check') ctx.addIssue({ code: 'custom', path: ['verification', 'method'], message: 'a preview the Dojo does not hold can only be source-checked' });
  }
  if (entry.verification.nextCheck <= entry.verification.date) ctx.addIssue({ code: 'custom', path: ['verification', 'nextCheck'], message: 'nextCheck must be after the check date' });
  for (const key of ['outcomeIds', 'fieldIds'] as const) {
    const seen = new Set<string>();
    entry[key].forEach((id, index) => {
      if (seen.has(id)) ctx.addIssue({ code: 'custom', path: [key, index], message: `${id} is listed twice` });
      seen.add(id);
    });
  }
});

export type GalleryEntryInput = z.input<typeof galleryEntrySchema>;
export type GalleryEntry = z.output<typeof galleryEntrySchema>;

/** A kata as the gallery sees it: where it is taught and what a reviewer looks for. */
export interface GalleryKata {
  id: string;
  title: string;
  /** Absent when the kata has no page yet. */
  href?: string;
  /** Set when the page is a #86 recipe page; a hand-written kata page has none. */
  recipeStatus?: RecipeStatus;
  metadata: KataMetadata;
}

export interface GalleryContext {
  katas: readonly GalleryKata[];
  fields: readonly { id: string; name: string }[];
  /** The outcome vocabulary, in display order, with a reader-facing label for each. */
  outcomes: readonly { id: string; label: string }[];
  /** Build date, YYYY-MM-DD. */
  today: string;
}

export type RecipeLink =
  | { kind: 'recipe' | 'kata-page'; href: string; title: string }
  | { kind: 'unavailable'; reason: string; instead: { label: string; href: string } };

export interface KataLink { id: string; title: string; href?: string }

export interface ResolvedGalleryEntry {
  entry: GalleryEntry;
  kata: GalleryKata;
  recipe: RecipeLink;
  /** The shared foundations the linked kata builds on. */
  foundations: KataLink[];
  /** The linked kata is itself a foundation: it serves every field, so a field filter never hides it. */
  isFoundation: boolean;
  /** The next check date has passed at build time. */
  checkDue: boolean;
}

export interface GalleryGroup {
  id: string;
  label: string;
  /** Entry IDs, in gallery order. Empty means no verified example yet. */
  entryIds: string[];
  /** Kata pages that already teach this outcome, for the planned state. */
  practice: KataLink[];
}

export interface ResolvedGallery {
  entries: ResolvedGalleryEntry[];
  byOutcome: GalleryGroup[];
  byField: GalleryGroup[];
  /** Foundation katas behind the entries (and foundation entries' own katas), never hidden by a filter. */
  sharedFoundations: KataLink[];
}

export class GalleryError extends Error {
  constructor(readonly problems: readonly string[]) {
    super(`The gallery has ${problems.length} problem(s):\n${problems.map((problem) => `- ${problem}`).join('\n')}`);
    this.name = 'GalleryError';
  }
}

/**
 * The katas an entry may link to: the curated catalog, the #86 recipes (fixtures included, so a link to
 * one is rejected by name) and kata records that have no page yet. A recipe page wins over a record
 * with the same ID.
 */
export function galleryKatas(catalog: readonly KataCatalogEntry[], recipes: readonly ResolvedRecipe[], pageless: readonly KataMetadata[]): GalleryKata[] {
  const byId = new Map<string, GalleryKata>();
  for (const metadata of pageless) byId.set(metadata.id, { id: metadata.id, title: metadata.title, metadata });
  for (const entry of catalog) byId.set(entry.metadata.id, { id: entry.metadata.id, title: entry.linkLabel, href: entry.href, metadata: entry.metadata });
  for (const item of recipes) {
    const { metadata } = item.recipe;
    byId.set(metadata.id, { id: metadata.id, title: metadata.title, href: item.href, recipeStatus: item.recipe.status, metadata });
  }
  return [...byId.values()];
}

/** Validate every entry against the katas, fields and outcomes, then build both browse paths. Throws GalleryError listing every problem. */
export function resolveGallery(input: readonly unknown[], context: GalleryContext): ResolvedGallery {
  const problems: string[] = [];
  const parsed: GalleryEntry[] = [];
  input.forEach((data, index) => {
    const result = galleryEntrySchema.safeParse(data);
    const name = typeof data === 'object' && data !== null && 'id' in data && typeof data.id === 'string' ? data.id : `entry ${index}`;
    if (result.success) parsed.push(result.data);
    else problems.push(...result.error.issues.map((issue) => `${name}: ${issue.path.join('.') || '(entry)'}: ${issue.message}`));
  });
  if (problems.length) throw new GalleryError(problems);

  const katas = new Map(context.katas.map((kata) => [kata.id, kata]));
  const fieldIds = new Set(context.fields.map((field) => field.id));
  const outcomeIds = new Set(context.outcomes.map((outcome) => outcome.id));
  const seen = new Set<string>();
  for (const entry of parsed) {
    const at = (problem: string) => problems.push(`${entry.id}: ${problem}`);
    if (seen.has(entry.id)) at('the ID is used twice');
    seen.add(entry.id);
    entry.fieldIds.filter((id) => !fieldIds.has(id)).forEach((id) => at(`unknown field ${id}`));
    entry.outcomeIds.filter((id) => !outcomeIds.has(id)).forEach((id) => at(`unknown outcome ${id}`));
    if (entry.verification.date > context.today) at(`the check date ${entry.verification.date} is in the future`);
    if (entry.provenance.created > entry.verification.date) at('the artifact was checked before it was created');
    const kata = katas.get(entry.kataId);
    if (!kata) { at(`unknown kata ${entry.kataId}`); continue; }
    if (kata.recipeStatus === 'fixture') at(`kata ${entry.kataId} is a fixture; a fixture teaches nothing`);
    if (kata.recipeStatus === 'withdrawn') at(`kata ${entry.kataId} is withdrawn`);
    entry.outcomeIds.filter((id) => !kata.metadata.outcomeIds.includes(id)).forEach((id) => at(`outcome ${id} is not an outcome of ${kata.id}`));
    if (kata.href && entry.recipeUnavailable) at(`${kata.id} has a page; remove recipeUnavailable`);
    if (!kata.href && !entry.recipeUnavailable) at(`${kata.id} has no page yet; say so in recipeUnavailable`);
  }
  if (problems.length) throw new GalleryError(problems);

  const linkTo = (id: string): KataLink => {
    const kata = katas.get(id);
    return kata ? { id, title: kata.title, ...(kata.href ? { href: kata.href } : {}) } : { id, title: id };
  };
  const entries = parsed.map((entry): ResolvedGalleryEntry => {
    const kata = katas.get(entry.kataId) as GalleryKata;
    const recipe: RecipeLink = kata.href
      ? { kind: kata.recipeStatus ? 'recipe' : 'kata-page', href: kata.href, title: kata.title }
      : { kind: 'unavailable', ...(entry.recipeUnavailable as NonNullable<GalleryEntry['recipeUnavailable']>) };
    return {
      entry, kata, recipe,
      foundations: kata.metadata.foundationKataIds.map(linkTo),
      isFoundation: kata.metadata.layer === 'foundation',
      checkDue: entry.verification.nextCheck < context.today,
    };
  });

  const practiceFor = (outcome: string) => context.katas
    .filter((kata) => kata.href && kata.recipeStatus !== 'fixture' && kata.metadata.outcomeIds.includes(outcome))
    .map((kata) => linkTo(kata.id));
  const byOutcome = context.outcomes.map((outcome) => ({
    id: outcome.id, label: outcome.label,
    entryIds: entries.filter(({ entry }) => entry.outcomeIds.includes(outcome.id)).map(({ entry }) => entry.id),
    practice: practiceFor(outcome.id),
  }));
  const byField = context.fields.map((field) => ({
    id: field.id, label: field.name,
    entryIds: entries.filter(({ entry }) => entry.fieldIds.includes(field.id)).map(({ entry }) => entry.id),
    practice: context.katas.filter((kata) => kata.href && kata.recipeStatus !== 'fixture' && kata.metadata.domainIds.includes(field.id)).map((kata) => linkTo(kata.id)),
  }));
  const foundationIds = [...new Set(entries.flatMap((item) => [...(item.isFoundation ? [item.kata.id] : []), ...item.foundations.map((foundation) => foundation.id)]))];
  return { entries, byOutcome, byField, sharedFoundations: foundationIds.map(linkTo) };
}

/** A check date as the page shows it, for example "November 20, 2026". */
export function formatCheckDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T00:00:00Z`));
}

/** Labels for the two check methods, as the page and its legend show them. */
export const CHECK_LABELS: Record<GalleryCheckMethod, string> = {
  'automated-check': 'Re-checked in CI',
  'source-check': 'Source and terms checked',
};
export const FORM_LABELS: Record<ArtifactForm, string> = {
  native: 'Native artifact',
  preview: 'Rendered preview',
};
