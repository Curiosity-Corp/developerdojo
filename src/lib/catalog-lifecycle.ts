import { z } from 'zod';

/**
 * Catalog lifecycle (#96): who owns each kind of catalog claim, how often it is re-checked, and the state a
 * learner sees on each entry. The ownership matrix below is the single source for cadences and owners;
 * docs/catalog-lifecycle.md explains it for maintainers and tests/catalog-lifecycle.test.ts keeps the two in
 * step.
 *
 * A maintainer records only `verified` or `unavailable`. `stale` is always computed: an entry is stale
 * when it was never verified, when a change was reported after its last check, or when its area's cadence
 * (or its own next review date, whichever is earlier) has passed. The nightly rebuild recomputes it, so an
 * entry goes stale on the site without anyone editing it, and the weekly link check lists it for its owner.
 */

const text = z.string().trim().min(1);
const isoDate = z.iso.date();

/** Maintainer roles, never people. Whoever performs a check records their name in the issue or MR, not here. */
export const MAINTAINER_ROLES = [
  'catalog-maintainer', 'kata-maintainer', 'benchmark-maintainer', 'domain-maintainer', 'security-reviewer', 'qualified-reviewer',
] as const;
export type MaintainerRole = (typeof MAINTAINER_ROLES)[number];
export const ROLE_LABELS: Record<MaintainerRole, string> = {
  'catalog-maintainer': 'Catalog maintainer',
  'kata-maintainer': 'Kata maintainer',
  'benchmark-maintainer': 'Benchmark maintainer',
  'domain-maintainer': 'Domain maintainer',
  'security-reviewer': 'Security reviewer',
  'qualified-reviewer': 'Qualified reviewer',
};

export const LIFECYCLE_AREAS = [
  'sources-and-links', 'harness-model-pricing', 'benchmarks', 'skill-provenance', 'integration-compatibility',
  'artifact-validity', 'domain-standards', 'qualified-review',
] as const;
export type LifecycleArea = (typeof LIFECYCLE_AREAS)[number];

export interface AreaPolicy {
  label: string;
  /** Accountable for the next check and for the entry's state. */
  owner: MaintainerRole;
  /** Consulted when the change needs them; their absence keeps the claim unverified, never approved. */
  consulted: readonly MaintainerRole[];
  /** Longest time a verification stays current. */
  cadenceDays: number;
  /** Events that make an entry due at once, whatever its date. */
  triggers: readonly string[];
  /** What a check records as evidence. */
  evidence: string;
}

/** The ownership matrix. Fast-moving claims (versions, prices, benchmarks) get the shortest cadence. */
export const OWNERSHIP_MATRIX: Record<LifecycleArea, AreaPolicy> = {
  'sources-and-links': {
    label: 'Sources and links', owner: 'catalog-maintainer', consulted: [], cadenceDays: 90,
    triggers: ['the weekly external link check reports a broken or unverified link', 'a publisher moves, retitles, withdraws or starts charging for a page', 'a learner reports a problem'],
    evidence: 'URL, date opened, title, access and cost, and the source of any replacement',
  },
  'harness-model-pricing': {
    label: 'Harness and model versions and pricing', owner: 'catalog-maintainer', consulted: ['benchmark-maintainer'], cadenceDays: 30,
    triggers: ['a new harness release or model version', 'a deprecation or retirement notice', 'a price, plan or rate-limit change'],
    evidence: 'version or model ID and how it was read, the pricing page and its date, and a smoke test on the version shown',
  },
  benchmarks: {
    label: 'Benchmark and comparison results', owner: 'benchmark-maintainer', consulted: [], cadenceDays: 30,
    triggers: ['a compared harness, model or price changes', 'the method or task set changes'],
    evidence: 'dated configuration, method, limitations and reproducible results; older results keep their dates',
  },
  'skill-provenance': {
    label: 'Skill provenance and security', owner: 'catalog-maintainer', consulted: ['security-reviewer'], cadenceDays: 90,
    triggers: ['a new skill version or commit', 'a change to bundled scripts or referenced code', 'a security advisory'],
    evidence: 'publisher, version or commit, instructions and scripts read, provenance attestation, and what was not checked',
  },
  'integration-compatibility': {
    label: 'Integration read/write compatibility', owner: 'catalog-maintainer', consulted: ['security-reviewer'], cadenceDays: 90,
    triggers: ['a new release of the integration', 'a permission, scope or authentication change', 'an API or protocol version change'],
    evidence: 'version, read, write, execute and network scope, and a smoke-test transcript',
  },
  'artifact-validity': {
    label: 'Kata artifacts and exercises', owner: 'kata-maintainer', consulted: [], cadenceDays: 90,
    triggers: ['a source, stack or expected output changes', 'a learner run fails or disagrees with the page'],
    evidence: 'the steps and environment actually checked, artifact provenance, and the steps not tested',
  },
  'domain-standards': {
    label: 'Domain standards', owner: 'domain-maintainer', consulted: ['qualified-reviewer'], cadenceDays: 365,
    triggers: ['a new edition, amendment or withdrawal of a standard', 'a change of jurisdiction or intended use'],
    evidence: 'standard, edition, jurisdiction and the scope the claim covers',
  },
  'qualified-review': {
    label: 'Qualified review requirements', owner: 'domain-maintainer', consulted: ['qualified-reviewer'], cadenceDays: 365,
    triggers: ['a regulation or licensing change', 'the intended use moves from practice towards real work'],
    evidence: 'the reviewer role, the decision and its scope, or a record that no qualified review is available',
  },
};

export const LIFECYCLE_STATES = ['verified', 'stale', 'unavailable'] as const;
export type LifecycleState = (typeof LIFECYCLE_STATES)[number];
export const STATE_LABELS: Record<LifecycleState, string> = { verified: 'Verified', stale: 'Review due', unavailable: 'Unavailable' };

/** What a learner is told when an entry is not verified. Shown with the reason, never instead of it. */
export const FALLBACK_TEXT: Record<Exclude<LifecycleState, 'verified'>, string> = {
  stale: 'Treat versions, prices, steps and permissions here as possibly out of date. Check the linked source before you rely on it, and practise with test data.',
  unavailable: 'Do not follow this entry as written. It stays here so links and your saved progress keep working.',
};

/** A reported change, recorded the day it is noticed. It makes the entry due until someone checks it again. */
export const changeReportSchema = z.strictObject({ date: isoDate, change: text });
export type ChangeReport = z.output<typeof changeReportSchema>;

/**
 * The minimum lifecycle fields on a catalog entry that has no richer review record of its own (the curated
 * kata catalog). Kata recipes and Armory entries carry the same facts in their own schemas; see
 * recipeLifecycle and armoryLifecycle.
 */
export const lifecycleRecordSchema = z.strictObject({
  area: z.enum(LIFECYCLE_AREAS),
  maintainerRole: z.enum(MAINTAINER_ROLES),
  /** Date the check was actually performed. Never backdated; never moved without a check. */
  verifiedOn: isoDate,
  /** What that check covered and what it did not. */
  checked: text,
  /** Where the entry's content and data come from. */
  provenance: z.array(text).min(1),
  /** What the maintainer recorded. Stale is computed, so it is not a value here. */
  state: z.enum(['verified', 'unavailable']),
  /** Required when unavailable: why, in words a learner understands. */
  reason: text.optional(),
  /** A replacement a learner can use instead, when one has been checked. */
  alternative: z.strictObject({ label: text, href: z.string().regex(/^\/[a-z0-9/#._-]*$/) }).optional(),
  changeReported: changeReportSchema.optional(),
}).superRefine((record, ctx) => {
  if (record.state === 'unavailable' && !record.reason) {
    ctx.addIssue({ code: 'custom', path: ['reason'], message: 'an unavailable entry says why in reason' });
  }
  if (record.changeReported && record.changeReported.date < record.verifiedOn) {
    ctx.addIssue({ code: 'custom', path: ['changeReported', 'date'], message: 'a change report cannot be older than the last check' });
  }
});
export type LifecycleRecordInput = z.input<typeof lifecycleRecordSchema>;
export type LifecycleRecord = z.output<typeof lifecycleRecordSchema>;

/** What every catalog surface renders and what the scheduled report lists. Plain data, JSON-safe. */
export interface LifecycleView {
  state: LifecycleState;
  area: LifecycleArea;
  /** The owning role as a learner reads it. */
  maintainerRole: string;
  /** Missing when the entry was never verified. */
  verifiedOn?: string;
  /** Day after which the entry is stale without a new check. */
  dueOn?: string;
  checked?: string;
  provenance: string[];
  /** Why the entry is stale or unavailable. */
  reason?: string;
  alternative?: { label: string; href: string };
}

/** YYYY-MM-DD plus whole days, in UTC. */
export function addDays(iso: string, days: number): string {
  const time = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(time)) throw new Error(`not a YYYY-MM-DD date: ${iso}`);
  return new Date(time + days * 86_400_000).toISOString().slice(0, 10);
}

export interface LifecycleFacts {
  area: LifecycleArea;
  maintainerRole: string;
  recorded: 'verified' | 'unavailable';
  verifiedOn?: string;
  /** An entry's own next review date; the earlier of it and the area cadence applies. */
  nextReview?: string;
  checked?: string;
  provenance: readonly string[];
  reason?: string;
  alternative?: { label: string; href: string };
  changeReported?: ChangeReport;
}

/** Turn recorded facts into the state a learner sees on `today` (YYYY-MM-DD, the build date). */
export function resolveLifecycle(facts: LifecycleFacts, today: string): LifecycleView {
  const base = {
    area: facts.area, maintainerRole: facts.maintainerRole, provenance: [...facts.provenance],
    ...(facts.checked ? { checked: facts.checked } : {}),
    ...(facts.alternative ? { alternative: facts.alternative } : {}),
  };
  if (facts.recorded === 'unavailable') {
    return { ...base, state: 'unavailable', ...(facts.verifiedOn ? { verifiedOn: facts.verifiedOn } : {}), reason: facts.reason ?? 'The maintainer withdrew this entry.' };
  }
  if (!facts.verifiedOn) return { ...base, state: 'stale', reason: facts.reason ?? 'This entry has not been verified yet.' };
  const byCadence = addDays(facts.verifiedOn, OWNERSHIP_MATRIX[facts.area].cadenceDays);
  const dueOn = facts.nextReview && facts.nextReview < byCadence ? facts.nextReview : byCadence;
  const dated = { ...base, verifiedOn: facts.verifiedOn, dueOn };
  if (facts.changeReported && facts.changeReported.date >= facts.verifiedOn) {
    return { ...dated, state: 'stale', reason: `A change was reported on ${facts.changeReported.date}: ${facts.changeReported.change}` };
  }
  if (today > dueOn) return { ...dated, state: 'stale', reason: 'Its review date has passed.' };
  return { ...dated, state: 'verified' };
}

/** The view of a curated catalog entry's lifecycle record. */
export function recordLifecycle(record: LifecycleRecord, today: string): LifecycleView {
  return resolveLifecycle({
    area: record.area, maintainerRole: ROLE_LABELS[record.maintainerRole], recorded: record.state, verifiedOn: record.verifiedOn,
    checked: record.checked, provenance: record.provenance,
    ...(record.reason ? { reason: record.reason } : {}),
    ...(record.alternative ? { alternative: record.alternative } : {}),
    ...(record.changeReported ? { changeReported: record.changeReported } : {}),
  }, today);
}

/** One row of the published lifecycle ledger (/catalog-lifecycle.json) and of the scheduled report. */
export interface LifecycleLedgerEntry extends LifecycleView {
  id: string;
  surface: 'kata' | 'recipe' | 'armory';
  title: string;
  href: string;
}

export interface LifecycleLedger {
  generatedOn: string;
  matrix: { area: LifecycleArea; label: string; owner: string; cadenceDays: number }[];
  entries: LifecycleLedgerEntry[];
}

export function lifecycleLedger(entries: readonly LifecycleLedgerEntry[], today: string): LifecycleLedger {
  return {
    generatedOn: today,
    matrix: LIFECYCLE_AREAS.map((area) => ({ area, label: OWNERSHIP_MATRIX[area].label, owner: ROLE_LABELS[OWNERSHIP_MATRIX[area].owner], cadenceDays: OWNERSHIP_MATRIX[area].cadenceDays })),
    entries: [...entries],
  };
}
