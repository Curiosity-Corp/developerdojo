import { OBSERVATIONS, type AssessmentMap, type Criterion, type EvidenceKind } from './assessment-map';
import type { SectorPack } from './sector-pack';

/**
 * The independent review record (developerdojo#90): what a reviewer fills in during a pilot review, kept on the
 * reviewer's own device and copied out as a Markdown review log. No DOM here; the form is
 * src/components/ReviewRecord.astro and the procedure is docs/independent-review-pilot.md, section 4.
 *
 * A record reviews one subject: a rank rubric from the assessment map, or a specialist belt stage in one field.
 * A specialist belt takes its shared criteria from the assessment map and everything field-specific (checks,
 * Randori, the professional-review limit) from that field's sector pack, so nothing is written twice.
 *
 * Rules the record keeps, from the pilot procedure and the certificate process:
 * - every criterion needs an observation AND an evidence reference: absence of evidence is not a pass;
 * - scope, access and consent are agreed, and the reviewer is independent, before a record can be finished;
 * - a finished record is never edited: a mistake is fixed by a dated correction added below it;
 * - the record awards nothing, and the website never receives it.
 */

export const REVIEW_RECORD_NAME = 'review-record';
export const REVIEW_RECORD_VERSION = 1;
export const MAX_TEXT = 1200;
export const MAX_REFERENCE = 300;
export const MAX_CORRECTION = 600;
export const MAX_CORRECTIONS = 20;
export const MAX_MINUTES = 600;

export type Observation = (typeof OBSERVATIONS)[number];

export interface RecordCriterion {
  id: string;
  title: string;
  observable: string;
  notYet: string;
  /** Titles of the kinds of evidence the reviewer looks at for this criterion. */
  evidence: string[];
}

export interface ProfessionalReview {
  required: boolean;
  limit: string;
}

export interface ReviewSubject {
  /** rank:<rank id> or belt:<sector pack id>:<stage id> */
  id: string;
  group: 'rank' | 'belt';
  label: string;
  question: string;
  criteria: RecordCriterion[];
  /** Specialist belts only: the field's own limit, from its sector pack. */
  professionalReview?: ProfessionalReview;
}

/** One field's specialist belt, assembled from its sector pack. */
export interface SpecialistBelt {
  packId: string;
  field: string;
  pathway: string;
  randori: { title: string; href: string };
  /** What the field pathway checks; the reviewer reruns these on the learner's own artifact (SPB-1). */
  checks: string[];
  professionalReview: ProfessionalReview;
}

export type RandoriLookup = (kataId: string) => { title: string; href: string } | undefined;

/** One specialist belt per sector pack. Throws, and so fails the build, when a pack names a field or Randori that does not exist. */
export function specialistBelts(packs: readonly SectorPack[], fieldName: (id: string) => string | undefined, randori: RandoriLookup): SpecialistBelt[] {
  return packs.map((pack) => {
    const fieldId = pack.fieldIds[0];
    const field = fieldId === undefined ? undefined : fieldName(fieldId);
    if (!field) throw new Error(`Sector pack ${pack.id}: its first field ${fieldId ?? '(none)'} has no name in src/lib/fields.ts`);
    const card = randori(pack.randoriKataId);
    if (!card) throw new Error(`Sector pack ${pack.id}: its Randori ${pack.randoriKataId} has no recipe in src/content/kata-recipes`);
    return {
      packId: pack.id,
      field,
      pathway: pack.pathway,
      randori: card,
      checks: pack.checks.map((check) => check.name),
      professionalReview: { required: pack.professionalReview.required, limit: pack.professionalReview.limit },
    };
  });
}

const STAGE_NOT_YET = 'The stage is shown only in the worked example or a practiced kata, or only the learner has checked it.';

/** Every subject a reviewer can record: the three rank rubrics, then each specialist belt at each reviewed stage. */
export function reviewSubjects(map: AssessmentMap, belts: readonly SpecialistBelt[], rankName: (id: string) => string): ReviewSubject[] {
  const evidenceTitle = (kind: EvidenceKind): string => map.pilot.evidence.find((item) => item.kind === kind)?.title ?? kind;
  const toCriterion = (criterion: Criterion): RecordCriterion => ({
    id: criterion.id,
    title: criterion.title,
    observable: criterion.observable,
    notYet: criterion.notYet,
    evidence: criterion.evidence.map(evidenceTitle),
  });
  const ranks = map.ranks.map((rank): ReviewSubject => ({
    id: `rank:${rank.rank}`,
    group: 'rank',
    label: `${rankName(rank.rank)} rank`,
    question: rank.question,
    criteria: rank.rubric.criteria.map(toCriterion),
  }));
  const stages = map.belts.stages.filter((stage) => map.specialistBelts.reviewedStages.includes(stage.id));
  const specialist = belts.flatMap((belt) =>
    stages.map((stage): ReviewSubject => ({
      id: `belt:${belt.packId}:${stage.id}`,
      group: 'belt',
      label: `${belt.field} specialist belt, ${stage.name} stage`,
      question: map.specialistBelts.question,
      criteria: [
        ...map.specialistBelts.criteria.map(toCriterion),
        {
          id: `BELT-${stage.id.toUpperCase()}`,
          title: `${stage.name} stage: ${stage.title}`,
          observable: stage.proof,
          notYet: STAGE_NOT_YET,
          evidence: [evidenceTitle('artifacts'), evidenceTitle('decisions')],
        },
      ],
      professionalReview: belt.professionalReview,
    })),
  );
  return [...ranks, ...specialist];
}

export interface CriterionEntry {
  observation: Observation | '';
  reference: string;
}

export interface Correction {
  date: string;
  text: string;
}

export interface ReviewRecord {
  subjectId: string;
  /** Scope, access and consent agreed in writing with the learner. */
  consent: boolean;
  /** The reviewer did not prepare the work, has no conflict and is not the pilot coordinator. */
  independent: boolean;
  unseenTask: string;
  /** Keyed by criterion id. Entries for criteria outside the current subject are kept but not reported. */
  entries: Record<string, CriterionEntry>;
  failures: string;
  strength: string;
  gap: string;
  /** Minutes the review took, as typed; empty when not recorded. */
  minutes: string;
  /** The date the reviewer finished the record. After this, only corrections are added. */
  finishedOn: string | null;
  corrections: Correction[];
}

/** The editable part of a record: what the form holds. */
export type RecordDraft = Omit<ReviewRecord, 'finishedOn' | 'corrections'>;

export function emptyRecord(subjectId: string): ReviewRecord {
  return { subjectId, consent: false, independent: false, unseenTask: '', entries: {}, failures: '', strength: '', gap: '', minutes: '', finishedOn: null, corrections: [] };
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CRITERION_ID = /^[A-Z]{2,5}-[A-Z0-9]{1,6}$/;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function capped(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

export function isObservation(value: unknown): value is Observation {
  return typeof value === 'string' && (OBSERVATIONS as readonly string[]).includes(value);
}

function cleanEntries(value: unknown): Record<string, CriterionEntry> {
  const entries: Record<string, CriterionEntry> = {};
  if (!isObject(value)) return entries;
  for (const [id, raw] of Object.entries(value)) {
    if (!CRITERION_ID.test(id) || !isObject(raw)) continue;
    const observation = raw['observation'];
    entries[id] = { observation: isObservation(observation) ? observation : '', reference: capped(raw['reference'], MAX_REFERENCE) };
  }
  return entries;
}

/** Accepts anything read from storage; keeps a record only for a subject that still exists, with capped text. */
export function parseRecord(data: unknown, subjectIds: readonly string[]): ReviewRecord | undefined {
  if (!isObject(data)) return undefined;
  const subjectId = data['subjectId'];
  if (typeof subjectId !== 'string' || !subjectIds.includes(subjectId)) return undefined;
  const finishedOn = data['finishedOn'];
  const corrections: Correction[] = [];
  const rawCorrections = data['corrections'];
  if (Array.isArray(rawCorrections)) {
    for (const item of rawCorrections.slice(0, MAX_CORRECTIONS)) {
      if (!isObject(item)) continue;
      const date = item['date'];
      const text = capped(item['text'], MAX_CORRECTION).trim();
      if (typeof date === 'string' && DATE.test(date) && text) corrections.push({ date, text });
    }
  }
  return {
    subjectId,
    consent: data['consent'] === true,
    independent: data['independent'] === true,
    unseenTask: capped(data['unseenTask'], MAX_TEXT),
    entries: cleanEntries(data['entries']),
    failures: capped(data['failures'], MAX_TEXT),
    strength: capped(data['strength'], MAX_TEXT),
    gap: capped(data['gap'], MAX_TEXT),
    minutes: capped(data['minutes'], 4),
    finishedOn: typeof finishedOn === 'string' && DATE.test(finishedOn) ? finishedOn : null,
    corrections: typeof finishedOn === 'string' && DATE.test(finishedOn) ? corrections : [],
  };
}

/** Takes what the form holds. A finished record is never changed this way: it comes back as it was. */
export function applyDraft(record: ReviewRecord, draft: RecordDraft): ReviewRecord {
  if (record.finishedOn) return record;
  return {
    subjectId: draft.subjectId,
    consent: draft.consent,
    independent: draft.independent,
    unseenTask: draft.unseenTask.slice(0, MAX_TEXT),
    entries: { ...record.entries, ...cleanEntries(draft.entries) },
    failures: draft.failures.slice(0, MAX_TEXT),
    strength: draft.strength.slice(0, MAX_TEXT),
    gap: draft.gap.slice(0, MAX_TEXT),
    minutes: draft.minutes.slice(0, 4),
    finishedOn: null,
    corrections: [],
  };
}

/** The minutes as a number, undefined when blank, or null when what was typed is not a usable number of minutes. */
export function minutesOf(record: ReviewRecord): number | undefined | null {
  const typed = record.minutes.trim();
  if (!typed) return undefined;
  if (!/^\d{1,3}$/.test(typed)) return null;
  const value = Number(typed);
  return value >= 1 && value <= MAX_MINUTES ? value : null;
}

/** What still stops the record being finished, one plain sentence each. Empty means it can be finished. */
export function recordProblems(record: ReviewRecord, subject: ReviewSubject): string[] {
  const problems: string[] = [];
  if (record.subjectId !== subject.id) problems.push('The record is for a different subject than the one shown.');
  if (!record.consent) problems.push('Agree the scope, access and consent with the learner in writing first.');
  if (!record.independent) problems.push('Confirm you are independent: not your own work, no conflict, and not the pilot coordinator.');
  if (!record.unseenTask.trim()) problems.push('Describe the unseen task you set: the constraint, changed tool or failure the learner had not seen.');
  for (const criterion of subject.criteria) {
    const entry = record.entries[criterion.id];
    if (!entry?.observation) problems.push(`${criterion.id} has no observation yet.`);
    else if (!entry.reference.trim()) {
      problems.push(entry.observation === 'Observed'
        ? `${criterion.id} is marked Observed without an evidence reference. Absence of evidence is not a pass.`
        : `${criterion.id} needs an evidence reference or the question that stayed open.`);
    }
  }
  if (!record.strength.trim()) problems.push('Give one strength tied to evidence.');
  if (!record.gap.trim()) problems.push('Give one gap tied to evidence.');
  if (minutesOf(record) === null) problems.push(`Time taken must be a whole number of minutes from 1 to ${MAX_MINUTES}, or left blank.`);
  return problems;
}

/** Finishes the record on the given date when nothing is missing; otherwise returns it unchanged with the problems. */
export function finishRecord(record: ReviewRecord, subject: ReviewSubject, today: string): { record: ReviewRecord; problems: string[] } {
  if (record.finishedOn) return { record, problems: ['This record is already finished. Add a correction instead.'] };
  const problems = recordProblems(record, subject);
  if (problems.length) return { record, problems };
  return { record: { ...record, finishedOn: today }, problems: [] };
}

/** Adds a dated correction to a finished record. The original entries stay exactly as they were. */
export function addCorrection(record: ReviewRecord, text: string, today: string): { record: ReviewRecord; problem?: string } {
  const clean = text.trim().slice(0, MAX_CORRECTION);
  if (!record.finishedOn) return { record, problem: 'A draft is edited directly. Corrections are for a finished record.' };
  if (!clean) return { record, problem: 'Write what was wrong and what is correct.' };
  if (record.corrections.length >= MAX_CORRECTIONS) return { record, problem: `A record holds at most ${MAX_CORRECTIONS} corrections. Start a new record instead.` };
  return { record: { ...record, corrections: [...record.corrections, { date: today, text: clean }] } };
}

function cell(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
}

function block(value: string): string {
  const clean = value.trim();
  return clean ? clean : '_Not recorded._';
}

/** The review log as Markdown, in the layout of the pilot procedure, section 4, step 9. */
export function renderReviewLog(record: ReviewRecord, subject: ReviewSubject): string {
  const minutes = minutesOf(record);
  const lines = [
    '# Independent review record',
    '',
    `- Reviewed against: ${subject.label} (proposed rubric)`,
    `- Status: ${record.finishedOn ? `finished on ${record.finishedOn}` : 'draft, not finished'}`,
    `- Scope, access and consent agreed in writing: ${record.consent ? 'yes' : 'no'}`,
    `- Reviewer independent (not their own work, no conflict, not the pilot coordinator): ${record.independent ? 'yes' : 'no'}`,
    `- Time taken: ${typeof minutes === 'number' ? `${minutes} minutes` : 'not recorded'}`,
    '',
    '## Unseen task',
    '',
    block(record.unseenTask),
    '',
    '## Criteria',
    '',
    '| Criterion | Observation | Evidence reference |',
    '| --- | --- | --- |',
    ...subject.criteria.map((criterion) => {
      const entry = record.entries[criterion.id];
      return `| ${cell(`${criterion.id} ${criterion.title}`)} | ${entry?.observation || 'Not recorded'} | ${cell(entry?.reference ?? '') || '-'} |`;
    }),
    '',
    '## Failures seen',
    '',
    block(record.failures),
    '',
    '## One strength',
    '',
    block(record.strength),
    '',
    '## One gap',
    '',
    block(record.gap),
    '',
  ];
  if (subject.professionalReview) {
    lines.push('## Qualified review in this field', '', subject.professionalReview.limit, '');
  }
  if (record.corrections.length) {
    lines.push('## Corrections', '', 'Added after the record was finished. The entries above are unchanged.', '');
    for (const correction of record.corrections) lines.push(`- ${correction.date}: ${correction.text.replace(/\s+/g, ' ')}`);
    lines.push('');
  }
  lines.push(
    '---',
    '',
    'This record awards no belt and no rank. A rank certificate follows the Dojo certificate process, with a separate Maintainer deciding. Dojo assessment is not professional licensure or accreditation. The record was made on the reviewer\'s own device; the Dojo website did not receive it. Share it only as the learner agreed.',
    '',
  );
  return lines.join('\n');
}

/** Reads the subjects the page embedded as JSON. Anything malformed is dropped, so a stale page cannot break the form. */
export function parseSubjects(value: unknown): ReviewSubject[] {
  if (!Array.isArray(value)) return [];
  const subjects: ReviewSubject[] = [];
  for (const raw of value) {
    if (!isObject(raw)) continue;
    const { id, group, label, question, criteria, professionalReview } = raw;
    if (typeof id !== 'string' || (group !== 'rank' && group !== 'belt') || typeof label !== 'string' || typeof question !== 'string' || !Array.isArray(criteria)) continue;
    const list: RecordCriterion[] = [];
    for (const item of criteria) {
      if (!isObject(item)) continue;
      const { id: criterionId, title, observable, notYet, evidence } = item;
      if (typeof criterionId !== 'string' || typeof title !== 'string' || typeof observable !== 'string' || typeof notYet !== 'string' || !Array.isArray(evidence)) continue;
      list.push({ id: criterionId, title, observable, notYet, evidence: evidence.filter((kind): kind is string => typeof kind === 'string') });
    }
    const subject: ReviewSubject = { id, group, label, question, criteria: list };
    if (isObject(professionalReview) && typeof professionalReview['required'] === 'boolean' && typeof professionalReview['limit'] === 'string') {
      subject.professionalReview = { required: professionalReview['required'], limit: professionalReview['limit'] };
    }
    if (list.length) subjects.push(subject);
  }
  return subjects;
}
