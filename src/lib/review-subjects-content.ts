import { assessmentMap } from '../data/assessment-map';
import { loadAssessmentMap, type AssessmentMap } from './assessment-map';
import { sheetPath } from './mission-transfer';
import { loadTransferPracticeContent } from './mission-transfer-content';
import { RANKS } from './ranks';
import { reviewSubjects, transferSubjects, type ReviewSubject, type SpecialistBelt } from './review-record';
import { loadSpecialistBelts } from './specialist-belts-content';

export interface ReviewSubjectsContent {
  map: AssessmentMap;
  belts: SpecialistBelt[];
  /** Ranks, then specialist belts, then cross-field transfers: every subject a review can be asked for and recorded on. */
  subjects: ReviewSubject[];
}

let cached: Promise<ReviewSubjectsContent> | undefined;

/**
 * Every independent-review subject at build time, once per build (#90, #95). The ranks and the shared specialist
 * criteria come from the assessment map, each field's belt from its sector pack, and each transfer from the mission
 * playbook's transfer practice. /review-record and /review-request both read this, so the learner's request and the
 * reviewer's record always offer the same subjects. Bad data throws, and so fails the build.
 */
export function loadReviewSubjects(): Promise<ReviewSubjectsContent> {
  cached ??= (async () => {
    const map = loadAssessmentMap(assessmentMap);
    const belts = await loadSpecialistBelts();
    const transfer = await loadTransferPracticeContent();
    const rankName = (id: string): string => RANKS.find((rank) => rank.id === id)?.name ?? id;
    const subjects = [
      ...reviewSubjects(map, belts, rankName),
      ...transferSubjects(map, transfer.criteria.map((criterion) => criterion.id), transfer.fields.map((field) => ({ ...field, sheet: sheetPath(field.packId) }))),
    ];
    return { map, belts, subjects };
  })();
  return cached;
}
