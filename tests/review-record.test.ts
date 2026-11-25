import { describe, expect, it } from 'vitest';
import { assessmentMap } from '../src/data/assessment-map';
import { sectorPacks } from '../src/data/sector-packs';
import { loadAssessmentMap } from '../src/lib/assessment-map';
import { fields } from '../src/lib/fields';
import { RANKS } from '../src/lib/ranks';
import {
  MAX_CORRECTIONS,
  addCorrection,
  applyDraft,
  emptyRecord,
  finishRecord,
  parseRecord,
  parseSubjects,
  recordProblems,
  renderReviewLog,
  reviewSubjects,
  specialistBelts,
  type ReviewRecord,
  type ReviewSubject,
} from '../src/lib/review-record';

// The independent review record (#90): who it can review, what it refuses to finish, and how it is corrected.
const map = loadAssessmentMap(assessmentMap);
const fieldName = (id: string) => fields.find((field) => field.id === id)?.name;
const randori = (kataId: string) => ({ title: `Randori ${kataId}`, href: `/katas/${kataId.toLowerCase()}` });
const belts = specialistBelts(sectorPacks, fieldName, randori);
const subjects = reviewSubjects(map, belts, (id) => RANKS.find((rank) => rank.id === id)?.name ?? id);
const ids = subjects.map((subject) => subject.id);
const subject = (id: string): ReviewSubject => {
  const found = subjects.find((item) => item.id === id);
  if (!found) throw new Error(`no subject ${id}`);
  return found;
};

/** A record with everything filled in for the subject, so each test can take one thing away. */
function complete(of: ReviewSubject): ReviewRecord {
  const entries = Object.fromEntries(of.criteria.map((criterion) => [criterion.id, { observation: 'Observed' as const, reference: `checks/${criterion.id}.log line 4` }]));
  return {
    ...emptyRecord(of.id),
    consent: true,
    independent: true,
    unseenTask: 'The reviewer withdrew the plotting library ten minutes in.',
    entries,
    failures: 'The first rerun failed on a missing unit; fixed and rechecked.',
    strength: 'Every check was rerun after the change (log line 12).',
    gap: 'The limit of the trend was not stated until asked.',
    minutes: '45',
  };
}

describe('the subjects a reviewer can record', () => {
  it('covers the three ranks with their rubric criteria', () => {
    for (const rank of map.ranks) {
      const found = subject(`rank:${rank.rank}`);
      expect(found.criteria.map((criterion) => criterion.id)).toEqual(rank.rubric.criteria.map((criterion) => criterion.id));
      expect(found.professionalReview).toBeUndefined();
    }
  });

  it('has one specialist belt per sector pack, at each reviewed stage, with the field limit from the pack', () => {
    expect(belts.map((belt) => belt.packId)).toEqual(sectorPacks.map((pack) => pack.id));
    for (const pack of sectorPacks) {
      for (const stage of map.specialistBelts.reviewedStages) {
        const found = subject(`belt:${pack.id}:${stage}`);
        expect(found.professionalReview).toEqual({ required: pack.professionalReview.required, limit: pack.professionalReview.limit });
        expect(found.criteria.map((criterion) => criterion.id)).toEqual([...map.specialistBelts.criteria.map((criterion) => criterion.id), `BELT-${stage.toUpperCase()}`]);
      }
    }
    expect(belts.find((belt) => belt.packId === 'science')?.checks).toEqual(sectorPacks.find((pack) => pack.id === 'science')?.checks.map((check) => check.name));
  });

  it('offers no review for the practice stages before Brown', () => {
    expect(ids.some((id) => /:(white|yellow|green)$/.test(id))).toBe(false);
  });

  it('fails the build when a pack names a Randori without a recipe or a field without a name', () => {
    expect(() => specialistBelts(sectorPacks, fieldName, () => undefined)).toThrow(/has no recipe/);
    expect(() => specialistBelts(sectorPacks, () => undefined, randori)).toThrow(/has no name/);
  });

  it('round-trips through the JSON the page embeds, and drops malformed entries', () => {
    expect(parseSubjects(JSON.parse(JSON.stringify(subjects)))).toEqual(subjects);
    expect(parseSubjects([{ id: 'x', group: 'other', label: 'x', question: 'x', criteria: [] }, 'nonsense'])).toEqual([]);
    expect(parseSubjects('not a list')).toEqual([]);
  });
});

describe('finishing a record', () => {
  const md = subject('rank:master-developer');

  it('finishes a complete record on the given date', () => {
    const result = finishRecord(complete(md), md, '2026-11-22');
    expect(result.problems).toEqual([]);
    expect(result.record.finishedOn).toBe('2026-11-22');
  });

  it('refuses to finish without consent or independence', () => {
    const problems = recordProblems({ ...complete(md), consent: false, independent: false }, md).join('\n');
    expect(problems).toMatch(/consent/);
    expect(problems).toMatch(/independent/);
  });

  it('refuses to finish without the unseen task, a strength or a gap', () => {
    const problems = recordProblems({ ...complete(md), unseenTask: ' ', strength: '', gap: '' }, md).join('\n');
    expect(problems).toMatch(/unseen task/);
    expect(problems).toMatch(/strength/);
    expect(problems).toMatch(/gap/);
  });

  it('refuses a criterion with no observation, and an observation without an evidence reference', () => {
    const record = complete(md);
    delete record.entries['MD-1'];
    record.entries['MD-2'] = { observation: 'Observed', reference: '' };
    record.entries['MD-3'] = { observation: 'Unclear', reference: '  ' };
    const problems = recordProblems(record, md);
    expect(problems).toContain('MD-1 has no observation yet.');
    expect(problems).toContain('MD-2 is marked Observed without an evidence reference. Absence of evidence is not a pass.');
    expect(problems).toContain('MD-3 needs an evidence reference or the question that stayed open.');
    expect(finishRecord(record, md, '2026-11-22').record.finishedOn).toBeNull();
  });

  it('accepts Not yet observed with a reference: a criterion is recorded, not passed', () => {
    const record = complete(md);
    record.entries['MD-1'] = { observation: 'Not yet observed', reference: 'No transfer brief was attempted in the session.' };
    expect(recordProblems(record, md)).toEqual([]);
  });

  it('refuses a time that is not a whole number of minutes, and accepts a blank one', () => {
    expect(recordProblems({ ...complete(md), minutes: 'abc' }, md).join()).toMatch(/whole number of minutes/);
    expect(recordProblems({ ...complete(md), minutes: '0' }, md).join()).toMatch(/whole number of minutes/);
    expect(recordProblems({ ...complete(md), minutes: '' }, md)).toEqual([]);
  });

  it('only counts the criteria of the chosen subject', () => {
    const belt = subject('belt:ux:brown');
    const record = { ...complete(belt), entries: { ...complete(belt).entries, 'MD-1': { observation: '' as const, reference: '' } } };
    expect(recordProblems(record, belt)).toEqual([]);
  });
});

describe('a finished record is locked and corrected, never edited', () => {
  const sensei = subject('rank:sensei');
  const finished = finishRecord(complete(sensei), sensei, '2026-11-22').record;

  it('ignores edits once finished', () => {
    const draft = { ...finished, strength: 'Rewritten after the fact.' };
    expect(applyDraft(finished, draft)).toBe(finished);
    expect(finishRecord(finished, sensei, '2026-11-23').problems.join()).toMatch(/already finished/);
  });

  it('adds dated corrections below the unchanged entries', () => {
    const { record, problem } = addCorrection(finished, 'SEN-2 reference should be checks/SEN-2.log line 9.', '2026-11-23');
    expect(problem).toBeUndefined();
    expect(record.entries).toEqual(finished.entries);
    expect(record.corrections).toEqual([{ date: '2026-11-23', text: 'SEN-2 reference should be checks/SEN-2.log line 9.' }]);
    const log = renderReviewLog(record, sensei);
    expect(log).toContain('## Corrections');
    expect(log).toContain('- 2026-11-23: SEN-2 reference should be checks/SEN-2.log line 9.');
    expect(log.indexOf('## Criteria')).toBeLessThan(log.indexOf('## Corrections'));
  });

  it('refuses a correction on a draft, an empty one, and more than the limit', () => {
    expect(addCorrection(complete(sensei), 'x', '2026-11-23').problem).toMatch(/draft/);
    expect(addCorrection(finished, '   ', '2026-11-23').problem).toMatch(/what was wrong/);
    let record = finished;
    for (let index = 0; index < MAX_CORRECTIONS; index++) record = addCorrection(record, `Correction ${index}`, '2026-11-23').record;
    expect(addCorrection(record, 'One more', '2026-11-23').problem).toMatch(/at most/);
  });
});

describe('the review log', () => {
  it('lists every criterion with its observation and reference, and states the boundaries', () => {
    const belt = subject('belt:science:black');
    const record = complete(belt);
    record.entries['SPB-1'] = { observation: 'Unclear', reference: 'run | rerun\ndiffered' };
    const log = renderReviewLog(record, belt);
    expect(log).toContain('# Independent review record');
    expect(log).toContain(`- Reviewed against: ${belt.label} (proposed rubric)`);
    expect(log).toContain('- Status: draft, not finished');
    for (const criterion of belt.criteria) expect(log).toContain(`| ${criterion.id} ${criterion.title} |`);
    expect(log).toContain('| Unclear | run \\| rerun differed |');
    expect(log).toContain('## Qualified review in this field');
    expect(log).toContain('awards no belt and no rank');
    expect(log).toContain('not professional licensure or accreditation');
    expect(log).toContain('did not receive it');
    expect(log).toContain('- Time taken: 45 minutes');
  });

  it('shows what is missing as not recorded, never as a pass', () => {
    const developer = subject('rank:developer');
    const log = renderReviewLog(emptyRecord(developer.id), developer);
    expect(log).toContain('| DEV-1 Outcome and checks | Not recorded | - |');
    expect(log).toContain('_Not recorded._');
    expect(log).toContain('- Time taken: not recorded');
  });
});

describe('the saved record', () => {
  it('reads back what it saved', () => {
    const belt = subject('belt:bim:brown');
    const record = finishRecord(complete(belt), belt, '2026-11-22').record;
    const withCorrection = addCorrection(record, 'Fix one reference.', '2026-11-23').record;
    expect(parseRecord(JSON.parse(JSON.stringify(withCorrection)), ids)).toEqual(withCorrection);
  });

  it('drops a record for a subject that no longer exists, and cleans what it keeps', () => {
    expect(parseRecord({ ...emptyRecord('rank:grandmaster') }, ids)).toBeUndefined();
    expect(parseRecord('nonsense', ids)).toBeUndefined();
    const cleaned = parseRecord({
      subjectId: 'rank:developer',
      consent: 'yes',
      entries: { 'DEV-1': { observation: 'Passed', reference: 'x'.repeat(1000) }, '<script>': { observation: 'Observed', reference: 'y' } },
      finishedOn: 'yesterday',
      corrections: [{ date: '2026-11-23', text: 'kept only when finished' }],
    }, ids);
    expect(cleaned?.consent).toBe(false);
    expect(cleaned?.entries['DEV-1']).toEqual({ observation: '', reference: 'x'.repeat(300) });
    expect(Object.keys(cleaned?.entries ?? {})).toEqual(['DEV-1']);
    expect(cleaned?.finishedOn).toBeNull();
    expect(cleaned?.corrections).toEqual([]);
  });
});
