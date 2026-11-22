import { EVIDENCE_KINDS, type AssessmentMap, type EvidenceKind } from './assessment-map';
import { SUBJECT_GROUPS, type ProfessionalReview, type ReviewSubject, type SpecialistBelt, type SubjectGroup } from './review-record';

/**
 * The independent review request (developerdojo#90): the learner's half of a pilot review, steps 2 to 4 of
 * docs/independent-review-pilot.md, section 4. The reviewer's half is the review record (src/lib/review-record.ts).
 *
 * The learner chooses what to be reviewed against (a rank rubric, a specialist belt stage or a cross-field transfer
 * into one field, the same subjects the review record offers), says where each kind of evidence is, agrees the scope of access and consent, and copies a
 * Markdown request to hand privately to the pilot coordinator. It is kept on the learner's own device and the
 * website never receives it. No DOM here; the form is src/components/ReviewRequest.astro.
 *
 * Rules the request keeps:
 * - the learner brings five of the six kinds of pilot evidence; the review log is written by the reviewer during the
 *   session, so the request never asks the learner for it;
 * - a request is "ready" only when every learner evidence kind has a location, the scope of access is written, an AI
 *   choice is made and the learner confirms the request holds no names, secrets or private material;
 * - the learner sees the kind of unseen task the reviewer will set, never the task;
 * - the request awards nothing and is not an application for a certificate.
 */

export const REVIEW_REQUEST_NAME = 'review-request';
export const REVIEW_REQUEST_VERSION = 1;
export const MAX_LOCATION = 300;
export const MAX_SCOPE = 600;

export type LearnerEvidenceKind = Exclude<EvidenceKind, 'review-log'>;
/** What the learner brings. The review log is the reviewer's own record of the session. */
export const LEARNER_EVIDENCE: readonly LearnerEvidenceKind[] = EVIDENCE_KINDS.filter((kind): kind is LearnerEvidenceKind => kind !== 'review-log');

export const AI_USE = ['none', 'ask-first', 'agreed'] as const;
export type AiUse = (typeof AI_USE)[number];
export const AI_USE_LABELS: Record<AiUse, string> = {
  none: 'No AI service may read my material.',
  'ask-first': 'The reviewer asks me before any AI service reads my material.',
  agreed: 'I agreed in writing which AI service may read which of my material.',
};

export const SCOPE_FIELDS = ['open', 'keep', 'share', 'until'] as const;
export type ScopeField = (typeof SCOPE_FIELDS)[number];
export const SCOPE_LABELS: Record<ScopeField, string> = {
  open: 'The reviewer may open',
  keep: 'The reviewer may keep a copy of',
  share: 'The reviewer may share, and with whom',
  until: 'Access ends, and copies are deleted, on or by',
};

export interface RequestCriterion {
  id: string;
  title: string;
  observable: string;
  evidence: EvidenceKind[];
}

export interface RequestSubject {
  /** The same id as the review record: rank:<rank id>, belt:<sector pack id>:<stage id> or transfer:<sector pack id>. */
  id: string;
  group: SubjectGroup;
  label: string;
  question: string;
  /** The kind of unseen task the reviewer sets, from the assessment map. */
  unseenTask: string;
  criteria: RequestCriterion[];
  /** Specialist belts and transfers: the field Randori whose kind of change the reviewer draws on. */
  randori?: { title: string; href: string };
  professionalReview?: ProfessionalReview;
}

export interface EvidenceGuide {
  kind: EvidenceKind;
  title: string;
  description: string;
}

/** Everything the page embeds for the form. */
export interface RequestPage {
  subjects: RequestSubject[];
  evidence: EvidenceGuide[];
  /** The titles of the pilot steps, in order, for the "what happens next" list. */
  steps: string[];
}

const isSubjectGroup = (value: unknown): value is SubjectGroup => typeof value === 'string' && (SUBJECT_GROUPS as readonly string[]).includes(value);

/**
 * The subjects a learner can ask to be reviewed against: exactly the review record's subjects (pass the same list the
 * record uses, src/lib/review-subjects-content.ts), with each criterion's evidence as kinds and the kind of unseen
 * task added. Throws, and so fails the build, when the data disagrees.
 */
export function requestSubjects(map: AssessmentMap, subjects: readonly ReviewSubject[], belts: readonly SpecialistBelt[]): RequestSubject[] {
  const kindOf = new Map(map.pilot.evidence.map((item) => [item.title, item.kind]));
  return subjects.map((subject): RequestSubject => {
    const criteria = subject.criteria.map((criterion): RequestCriterion => ({
      id: criterion.id,
      title: criterion.title,
      observable: criterion.observable,
      evidence: criterion.evidence.map((title) => {
        const kind = kindOf.get(title);
        if (!kind) throw new Error(`Review subject ${subject.id}: criterion ${criterion.id} names evidence "${title}", which is not a pilot evidence kind in src/data/assessment-map.ts`);
        return kind;
      }),
    }));
    const base = { id: subject.id, group: subject.group, label: subject.label, question: subject.question, criteria };
    switch (subject.group) {
      case 'rank': {
        const rank = map.ranks.find((item) => `rank:${item.rank}` === subject.id);
        if (!rank) throw new Error(`Review subject ${subject.id} has no rank in src/data/assessment-map.ts`);
        return { ...base, unseenTask: rank.unseenTask };
      }
      case 'belt': {
        const belt = belts.find((item) => subject.id.startsWith(`belt:${item.packId}:`));
        if (!belt) throw new Error(`Review subject ${subject.id} has no specialist belt`);
        return { ...base, unseenTask: map.specialistBelts.unseenTask, randori: belt.randori, professionalReview: subject.professionalReview ?? belt.professionalReview };
      }
      case 'transfer': {
        // A transfer's unseen change is the field Randori's kind, as for a specialist belt: the reviewer picks one the
        // learner has not practised (the review record says the same to the reviewer).
        const facts = subject.transfer;
        if (!facts) throw new Error(`Review subject ${subject.id} is a transfer with no field facts`);
        if (!subject.professionalReview) throw new Error(`Review subject ${subject.id} is a transfer with no qualified-review limit`);
        const randori = { title: `${facts.randori.id} ${facts.randori.title}`, href: facts.randori.href };
        return { ...base, unseenTask: map.specialistBelts.unseenTask, randori, professionalReview: subject.professionalReview };
      }
      default: {
        const unhandled: never = subject.group;
        throw new Error(`Review subject ${subject.id} has an unknown group ${String(unhandled)}`);
      }
    }
  });
}

export interface ReviewRequest {
  subjectId: string;
  /** Where each kind of evidence is: a repository, folder, file or link the reviewer will be given access to. */
  locations: Partial<Record<LearnerEvidenceKind, string>>;
  scope: Record<ScopeField, string>;
  aiUse: AiUse | '';
  /** The learner confirms the request names no person and holds no secret or private material. */
  noPrivateDetails: boolean;
}

export function emptyRequest(subjectId: string): ReviewRequest {
  return { subjectId, locations: {}, scope: { open: '', keep: '', share: '', until: '' }, aiUse: '', noPrivateDetails: false };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function capped(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function isAiUse(value: unknown): value is AiUse {
  return typeof value === 'string' && (AI_USE as readonly string[]).includes(value);
}

/** Accepts anything (storage, the form); keeps only known fields, capped, for a subject that still exists. */
export function parseRequest(data: unknown, subjectIds: readonly string[]): ReviewRequest | undefined {
  if (!isObject(data)) return undefined;
  const subjectId = data['subjectId'];
  if (typeof subjectId !== 'string' || !subjectIds.includes(subjectId)) return undefined;
  const locations: Partial<Record<LearnerEvidenceKind, string>> = {};
  const rawLocations = data['locations'];
  if (isObject(rawLocations)) {
    for (const kind of LEARNER_EVIDENCE) {
      const value = capped(rawLocations[kind], MAX_LOCATION);
      if (value) locations[kind] = value;
    }
  }
  const rawScope: Record<string, unknown> = isObject(data['scope']) ? data['scope'] : {};
  const scope = { open: '', keep: '', share: '', until: '' };
  for (const field of SCOPE_FIELDS) scope[field] = capped(rawScope[field], MAX_SCOPE);
  const aiUse = data['aiUse'];
  return { subjectId, locations, scope, aiUse: isAiUse(aiUse) ? aiUse : '', noPrivateDetails: data['noPrivateDetails'] === true };
}

/** Text that looks like a credential: a key=value secret, a private key block or a URL with a password in it. */
const SECRET_PATTERNS: readonly RegExp[] = [
  /\b(password|passwd|pwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key)\b\s*[:=]/i,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /[a-z][a-z0-9+.-]*:\/\/[^\s/:@]+:[^\s/@]+@/i,
];

export function looksLikeSecret(value: string): boolean {
  return SECRET_PATTERNS.some((pattern) => pattern.test(value));
}

export interface CriterionReadiness {
  id: string;
  title: string;
  /** Learner evidence kinds the criterion needs that have no location yet. */
  missing: LearnerEvidenceKind[];
  /** True when the criterion also uses the review log, which the reviewer writes in the session. */
  reviewerWrites: boolean;
}

/** For each criterion: which of the evidence it needs the learner has not located yet. */
export function criterionReadiness(request: ReviewRequest, subject: RequestSubject): CriterionReadiness[] {
  return subject.criteria.map((criterion) => ({
    id: criterion.id,
    title: criterion.title,
    missing: criterion.evidence.filter((kind): kind is LearnerEvidenceKind => kind !== 'review-log' && !request.locations[kind]?.trim()),
    reviewerWrites: criterion.evidence.includes('review-log'),
  }));
}

/** What still stops the request being ready to send, one plain sentence each. Empty means it is ready. */
export function requestProblems(request: ReviewRequest, subject: RequestSubject, evidence: readonly EvidenceGuide[]): string[] {
  const title = (kind: EvidenceKind): string => evidence.find((item) => item.kind === kind)?.title ?? kind;
  const problems: string[] = [];
  if (request.subjectId !== subject.id) problems.push('The request is for a different subject than the one shown.');
  for (const kind of LEARNER_EVIDENCE) {
    if (!request.locations[kind]?.trim()) problems.push(`Say where the reviewer will find: ${title(kind)}.`);
  }
  for (const field of SCOPE_FIELDS) {
    if (!request.scope[field].trim()) problems.push(`Write the scope: ${SCOPE_LABELS[field].toLowerCase()}.`);
  }
  if (!request.aiUse) problems.push('Choose whether an AI service may read your material.');
  const texts = [...Object.values(request.locations), ...Object.values(request.scope)];
  if (texts.some((text) => text !== undefined && looksLikeSecret(text))) {
    problems.push('Something you typed looks like a password, key or token. Remove it: give the reviewer access instead.');
  }
  if (!request.noPrivateDetails) problems.push('Confirm the request names no person and holds no secret or private material.');
  return problems;
}

function cell(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
}

function line(value: string | undefined): string {
  const clean = (value ?? '').replace(/\s+/g, ' ').trim();
  return clean || '_Not given yet._';
}

/** The request as Markdown, for the learner to hand privately to the pilot coordinator. */
export function renderRequest(request: ReviewRequest, subject: RequestSubject, page: Pick<RequestPage, 'evidence' | 'steps'>): string {
  const title = (kind: EvidenceKind): string => page.evidence.find((item) => item.kind === kind)?.title ?? kind;
  const problems = requestProblems(request, subject, page.evidence);
  const status = problems.length === 0 ? 'ready to send' : `draft, ${problems.length} ${problems.length === 1 ? 'thing' : 'things'} still missing`;
  const lines = [
    '# Independent review request',
    '',
    `- Review against: ${subject.label} (proposed rubric)`,
    `- Status: ${status}`,
    '',
    '## What the reviewer will look for',
    '',
    subject.question,
    '',
    '| Criterion | Evidence I bring |',
    '| --- | --- |',
    ...subject.criteria.map((criterion) => {
      const brought = criterion.evidence.map((kind) => kind === 'review-log'
        ? `${title(kind)}: written by the reviewer in the session`
        : `${title(kind)}: ${request.locations[kind]?.trim() || 'not given yet'}`);
      return `| ${cell(`${criterion.id} ${criterion.title}`)} | ${cell(brought.join('; '))} |`;
    }),
    '',
    '## Where my evidence is',
    '',
    ...LEARNER_EVIDENCE.map((kind) => `- ${title(kind)}: ${line(request.locations[kind])}`),
    '',
    '## Scope, access and consent',
    '',
    ...SCOPE_FIELDS.map((field) => `- ${SCOPE_LABELS[field]}: ${line(request.scope[field])}`),
    `- AI services: ${request.aiUse ? AI_USE_LABELS[request.aiUse] : '_Not chosen yet._'}`,
    '',
    '## The unseen task',
    '',
    `I have not been told the task. The reviewer sets it and reveals it when the work starts. Its kind: ${subject.unseenTask}`,
  ];
  if (subject.randori) lines.push('', `Field Randori it draws on: ${subject.randori.title}`);
  lines.push('');
  if (subject.professionalReview) lines.push('## Qualified review in this field', '', subject.professionalReview.limit, '');
  lines.push(
    '## What happens next',
    '',
    ...page.steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    '---',
    '',
    'This request awards nothing and is not an application for a certificate. The rubric it names is proposed, not approved. Dojo assessment is not professional licensure or accreditation. The request was made on my own device; the Dojo website did not receive it. Give it privately to the pilot coordinator only.',
    '',
  );
  return lines.join('\n');
}

/** Reads what the page embedded as JSON. Anything malformed is dropped, so a stale page cannot break the form. */
export function parseRequestPage(value: unknown): RequestPage {
  const page: RequestPage = { subjects: [], evidence: [], steps: [] };
  if (!isObject(value)) return page;
  const kinds: readonly string[] = EVIDENCE_KINDS;
  const isKind = (kind: unknown): kind is EvidenceKind => typeof kind === 'string' && kinds.includes(kind);
  if (Array.isArray(value['evidence'])) {
    for (const raw of value['evidence']) {
      if (isObject(raw) && isKind(raw['kind']) && typeof raw['title'] === 'string' && typeof raw['description'] === 'string') {
        page.evidence.push({ kind: raw['kind'], title: raw['title'], description: raw['description'] });
      }
    }
  }
  if (Array.isArray(value['steps'])) page.steps = value['steps'].filter((step): step is string => typeof step === 'string');
  if (Array.isArray(value['subjects'])) {
    for (const raw of value['subjects']) {
      if (!isObject(raw)) continue;
      const { id, group, label, question, unseenTask, criteria, randori, professionalReview } = raw;
      if (typeof id !== 'string' || !isSubjectGroup(group) || typeof label !== 'string' || typeof question !== 'string' || typeof unseenTask !== 'string' || !Array.isArray(criteria)) continue;
      const list: RequestCriterion[] = [];
      for (const item of criteria) {
        if (!isObject(item)) continue;
        const { id: criterionId, title, observable, evidence } = item;
        if (typeof criterionId !== 'string' || typeof title !== 'string' || typeof observable !== 'string' || !Array.isArray(evidence)) continue;
        list.push({ id: criterionId, title, observable, evidence: evidence.filter(isKind) });
      }
      if (!list.length) continue;
      const subject: RequestSubject = { id, group, label, question, unseenTask, criteria: list };
      if (isObject(randori) && typeof randori['title'] === 'string' && typeof randori['href'] === 'string') subject.randori = { title: randori['title'], href: randori['href'] };
      if (isObject(professionalReview) && typeof professionalReview['required'] === 'boolean' && typeof professionalReview['limit'] === 'string') {
        subject.professionalReview = { required: professionalReview['required'], limit: professionalReview['limit'] };
      }
      page.subjects.push(subject);
    }
  }
  return page;
}
