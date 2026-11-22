import type { AssessmentMap } from '../lib/assessment-map';

/**
 * The assessment map (developerdojo#90): what each rank assesses, kept apart from the field belts, the
 * proposed advanced rubrics and the independent-review pilot. src/lib/assessment-map.ts holds the schema
 * and the rules; the build fails on a map that breaks them. Every rubric and belt stage here is a
 * proposal: approving it, or changing an existing rank requirement, waits for the program policy review
 * (#80). The written procedure is docs/independent-review-pilot.md. Published text: no names, no issue
 * references, no repository paths.
 */
export const assessmentMap = {
  ranks: [
    {
      rank: 'developer',
      question: 'Can this person develop one outcome from start to finish and show evidence that it works?',
      assesses: [
        'Owning one outcome: the audience, the result and the checks that show success.',
        'Directing AI agents and tools, with the stack and permissions recorded so another person can repeat the run.',
        'Checking the result honestly, including the failures and the parts that were not tested.',
      ],
      notAssessed: [
        'Which field the work is in. Ability in a field is what a belt shows.',
        'Speed, volume of output or the number of tools used.',
      ],
      currentProcedure: {
        label: 'Product Package rubric',
        href: '/library/product-package-rubric',
        summary: 'The Developer certificate does not change: a Sensei reviews a Product Package against the six-skill rubric, and a separate Maintainer decides.',
      },
      rubric: {
        tier: 'foundation',
        status: 'proposed',
        criteria: [
          {
            id: 'DEV-1',
            title: 'Outcome and checks',
            observable: 'The learner states the audience, the intended result and the checks before building, and the artifact passes those checks when the reviewer runs them.',
            notYet: 'The checks are written after the result, are missing, or only the learner has run them.',
            demands: ['independent-judgment'],
            evidence: ['artifacts', 'tests'],
          },
          {
            id: 'DEV-2',
            title: 'Reproducible stack',
            observable: 'The learner records the harness, model, instructions, tools, versions and permissions actually used, and the reviewer can repeat the main run from that record.',
            notYet: 'The stack is described in general terms, or the reviewer cannot repeat the run from the record.',
            demands: ['independent-judgment'],
            evidence: ['configuration', 'artifacts'],
          },
          {
            id: 'DEV-3',
            title: 'Failures on the record',
            observable: 'At least one real failure or wrong turn is recorded with what caused it, what changed and which check confirmed the repair.',
            notYet: 'The record shows only successes, or a failure is mentioned without the check that closed it.',
            demands: ['changed-tool-or-failure'],
            evidence: ['failures', 'tests', 'review-log'],
          },
        ],
      },
    },
    {
      rank: 'master-developer',
      question: 'Can this person carry their judgment to a tool family or field they did not practice in?',
      assesses: [
        'Transfer: solving an unseen brief in a different tool family or field, with checks the reviewer chose.',
        'Recovery: diagnosing a changed tool or an injected failure without a recipe, and repeating the same checks.',
        'Judgment: defending trade-offs and naming what remains unverified, in a live review without notes.',
      ],
      notAssessed: [
        'Repeating a kata the learner already practiced, however well it is done.',
        'Depth in one field alone. A belt shows field depth.',
      ],
      currentProcedure: {
        label: 'Master Developer assessment',
        href: '/library/master-developer-assessment',
        summary: 'The Master Developer certificate does not change: four gates, a final exam and an oral review observed by a Sensei or mentor, and a separate Maintainer decides.',
      },
      rubric: {
        tier: 'advanced',
        status: 'proposed',
        criteria: [
          {
            id: 'MD-1',
            title: 'Transfer to an unseen tool family or field',
            observable: 'Given a brief the learner has not seen, in a tool family or field other than the one practiced, the learner chooses and adapts a stack, and the result passes checks the reviewer chose.',
            notYet: 'The learner repeats a practiced recipe, stays in the practiced tool family, or only the learner checks the result.',
            demands: ['unseen-constraint', 'changed-tool-or-failure', 'independent-judgment', 'transfer'],
            evidence: ['artifacts', 'configuration', 'tests', 'decisions'],
          },
          {
            id: 'MD-2',
            title: 'Recovery from a changed tool or failure',
            observable: 'When the reviewer withdraws a tool or injects a failure during the task, the learner diagnoses it, changes the approach, repeats the same checks and records what changed.',
            notYet: 'The learner restarts from scratch without a diagnosis, drops a check to get a pass, or hides the failure.',
            demands: ['unseen-constraint', 'changed-tool-or-failure', 'independent-judgment'],
            evidence: ['failures', 'tests', 'review-log'],
          },
          {
            id: 'MD-3',
            title: 'Decisions defended without notes',
            observable: 'In the review the learner explains each main decision, the alternative they rejected, which check proves what, and what is still unverified, and adapts the plan when the reviewer adds a constraint.',
            notYet: 'Decisions are explained only as what an agent suggested, or the learner cannot say what remains unverified.',
            demands: ['unseen-constraint', 'changed-tool-or-failure', 'independent-judgment', 'transfer'],
            evidence: ['decisions', 'review-log'],
          },
        ],
      },
    },
    {
      rank: 'sensei',
      question: 'Can this person teach and review a technique that works in many fields, and show how it adapts in each?',
      assesses: [
        'Teaching: another learner reproduces a generalizable technique and checks it on their own.',
        'Adaptation: naming what changes when the technique moves to another field, including the checks and qualified review that field adds.',
        'Reviewing: judging another person\'s evidence independently, fairly and privately.',
      ],
      notAssessed: [
        'Seniority, popularity or contribution points on their own.',
        'Professional approval in any regulated field.',
      ],
      currentProcedure: {
        label: 'Sensei role and limits',
        href: '/library/sensei-role-and-limits',
        summary: 'Sensei stays by application or invitation. The Sensei handbook sets how a Sensei reviews, and the certificate process sets who decides.',
      },
      rubric: {
        tier: 'advanced',
        status: 'proposed',
        criteria: [
          {
            id: 'SEN-1',
            title: 'Teach a generalizable technique',
            observable: 'Another learner reproduces the technique from the Sensei\'s explanation, then meets an unseen constraint the reviewer chose, and the Sensei coaches without doing the work for them.',
            notYet: 'The other learner can only follow the exact steps, or the Sensei takes over when the constraint changes.',
            demands: ['unseen-constraint', 'changed-tool-or-failure', 'independent-judgment', 'teaching'],
            evidence: ['artifacts', 'review-log', 'decisions'],
          },
          {
            id: 'SEN-2',
            title: 'Domain adaptations',
            observable: 'The Sensei shows how the technique changes in a second field the reviewer names: the different inputs, tools, checks and the qualified review that field requires.',
            notYet: 'The technique is presented as identical in every field, or the field\'s own checks and approvals are missing.',
            demands: ['unseen-constraint', 'changed-tool-or-failure', 'independent-judgment', 'transfer', 'domain-adaptation'],
            evidence: ['decisions', 'configuration', 'tests'],
          },
          {
            id: 'SEN-3',
            title: 'Independent review of another person\'s work',
            observable: 'Given a packet they did not prepare, with a known defect added by the pilot coordinator, the Sensei records each criterion as observed, not yet observed or unclear, with evidence references, and finds the defect or says what stopped them.',
            notYet: 'The review repeats the learner\'s own claims, gives a score without evidence references, or shares material without consent.',
            demands: ['unseen-constraint', 'changed-tool-or-failure', 'independent-judgment', 'teaching'],
            evidence: ['review-log', 'failures', 'decisions'],
          },
        ],
      },
    },
  ],
  belts: {
    question: 'Can this person show ability in one field, using the checks and standards of that field?',
    assesses: [
      'A field artifact checked against the standards of that field, not only against the learner\'s own checks.',
      'Adapting inside the field when a Randori exercise changes a requirement, a tool or a source.',
      'Knowing where the field needs independent or qualified professional review.',
    ],
    stages: [
      { id: 'white', name: 'White', title: 'See and explain', proof: 'Identify the outcome, its audience and a check for success. Explain what the harness, model and instructions each do.', status: 'proposed' },
      { id: 'yellow', name: 'Yellow', title: 'Follow a kata', proof: 'Reproduce a documented result, record your stack and show that you checked it against the recipe.', status: 'proposed' },
      { id: 'green', name: 'Green', title: 'Adapt the technique', proof: 'Change a requirement or tool, explain your decision and compare the result against the same checks.', status: 'proposed' },
      { id: 'brown', name: 'Brown', title: 'Solve an unfamiliar challenge', proof: 'Choose your own stack, respond to a failure or new constraint, and defend the evidence in a Randori exercise.', status: 'proposed' },
      { id: 'black', name: 'Black', title: 'Improve and teach', proof: 'Combine or invent a repeatable technique, explain its limits, and help another learner reproduce and evaluate it.', status: 'proposed' },
    ],
  },
  pilot: {
    status: 'not-run',
    evidence: [
      { kind: 'artifacts', title: 'The actual artifacts', description: 'The original work the learner made: files, a running prototype, a model, a report. Not screenshots or a summary of it.' },
      { kind: 'configuration', title: 'Reproducible configuration', description: 'The harness, models, instructions, tools, versions and permissions used, enough for the reviewer to repeat the main run.' },
      { kind: 'tests', title: 'Tests and checks', description: 'The checks the learner ran and their real results, plus the checks the reviewer chose and runs independently.' },
      { kind: 'review-log', title: 'Review log', description: 'What the reviewer opened, ran and observed, criterion by criterion, with evidence references and open questions.' },
      { kind: 'failures', title: 'Failures', description: 'What went wrong during the work and during the unseen task, what caused it, and which check confirmed each repair.' },
      { kind: 'decisions', title: 'Decision evidence', description: 'The main decisions, the alternatives rejected and why, and what is still unverified at the end.' },
    ],
    steps: [
      { title: 'Agree scope, access and consent', description: 'The learner and reviewer agree in writing what the reviewer may open, keep and share. Learner work stays private by default and is never given to an AI service without permission.', reuses: { label: 'Sensei privacy and conduct', href: '/library/sensei-privacy-and-conduct' } },
      { title: 'Choose an independent reviewer', description: 'The reviewer has relevant expertise and no conflict of interest, and is a different person from whoever coordinates the pilot. Nobody reviews their own work.', reuses: { label: 'Certificate process: who decides', href: '/certificates' } },
      { title: 'Send the evidence packet', description: 'The learner prepares the six kinds of evidence above in their own repository or files and gives the reviewer read access. The Dojo website receives nothing.', reuses: { label: 'Review packet', href: '/belt-review' } },
      { title: 'Set the unseen task', description: 'The reviewer, not the learner, chooses the unseen constraint, the changed tool or the injected failure, and reveals it only when the task starts. The learner works with it while the reviewer observes.' },
      { title: 'Record each criterion', description: 'The reviewer records every criterion as observed, not yet observed or unclear, with an evidence reference, then gives one strength and one gap. There is no score and no pass mark.', reuses: { label: 'Run a 30 minute review', href: '/library/sensei-run-a-30-minute-review' } },
      { title: 'Keep the decision separate', description: 'The pilot issues no belt and no rank. A rank certificate still follows the existing issue, correct and revoke steps, with a separate Maintainer deciding.', reuses: { label: 'Certificates', href: '/certificates' } },
      { title: 'Report what the pilot learned', description: 'The coordinator writes a short report: what worked, what was unclear, how long it took and which rubric changes to propose to the program policy review. Nothing identifies the learner without their consent.' },
    ],
    measures: [
      { name: 'Pilot reviews completed', value: null, why: 'No pilot review has run yet, so there is nothing to count.' },
      { name: 'Agreement between two reviewers', value: null, why: 'Needs two independent reviews of the same packet; none has run.' },
      { name: 'Time one review takes', value: null, why: 'Will be measured during the first pilot review.' },
    ],
  },
  boundaries: [
    'A checklist, attendance or time spent does not award a belt or a rank. Only reviewed evidence can inform a decision, and no belt is issued today.',
    'Dojo assessment is not professional licensure or accreditation, and it is not permission to do regulated work.',
    'The static site takes no authenticated submissions: it does not receive, store or send learner work, packets or review notes.',
    'Regulated or safety-critical work still needs approval from a qualified professional, separate from any Dojo review.',
    'Learner work and review notes stay private unless the learner gives written consent to share them.',
    'The rubrics and belt names on this page are proposed. They change no existing rank requirement until the program policy review approves them.',
  ],
} satisfies AssessmentMap;
