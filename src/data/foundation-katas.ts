import type { KataReferences } from '../lib/kata-catalog';
import type { KataMetadataInput } from '../lib/kata-schema';

/**
 * STAGED, NOT PUBLISHED (#85). The remaining universal foundation katas, FND-002 to FND-010, as
 * records on the #81 kata contract. Each one is built from practice pages the Dojo already publishes
 * and names a real external exercise, but none is a finished kata: none has its own page, a Dojo
 * execution record, an assigned maintainer or an independent review. The gaps that keep each one
 * staged are listed on the record (openGaps). docs/foundation-katas.md explains how a record leaves
 * this file.
 *
 * Nothing here is rendered, linked from kataCatalog or listed in KATA_DIRECTORY, and
 * tests/foundation-katas.test.ts keeps it that way. Passing the schema is structural validation only.
 * It does not show that an outcome is taught, an exercise works, a licence permits reuse or a review
 * happened.
 */

/** Every family member depends on the shared harness-stack foundation, FND-001, whose record is #84's. */
export const SHARED_FOUNDATION_ID = 'FND-001';

/** The areas #85 asks the family to cover. Each record names one. */
export const FOUNDATION_AREAS = ['harness', 'models', 'instructions', 'context', 'skills-and-tools', 'orchestration', 'verification', 'governance', 'unseen-mission'] as const;
export type FoundationArea = (typeof FOUNDATION_AREAS)[number];

/**
 * How far a named external exercise has been checked.
 * - linked: the URL answered on checkedOn and the page matches the resource record. Nothing was run.
 * - planned: the exercise is designed but its material does not exist yet.
 * - unverified: named, but not opened for this record.
 * - unavailable: the source is gone or access changed.
 */
export type ExerciseState = 'linked' | 'planned' | 'unverified' | 'unavailable';

/**
 * What the rights check found. Recording a licence is not legal advice, and none of these permits
 * copying by itself: every record links to its source rather than copying it.
 * - licence-recorded: the repository declares the licence named in note (read from its metadata on checkedOn).
 * - no-licence-detected: the repository declares no licence; link only, never copy.
 * - publisher-terms: an article or documentation page under the publisher's site terms; link only.
 * - dojo-content: Dojo material under this repository's MIT licence (LICENSE).
 * - not-checked: no check was made.
 */
export type RightsState = 'licence-recorded' | 'no-licence-detected' | 'publisher-terms' | 'dojo-content' | 'not-checked';

/** A published Dojo page the record reuses, and what it does and does not supply. */
export interface ReusedPractice {
  href: `/katas/${string}`;
  /** The starter catalog record for the page, when it has one (src/data/kata-catalog.ts). */
  practiceId?: string;
  supplies: string;
  doesNotShow: string;
}

export interface CandidateExercise {
  /** A resource in src/content/resources (publisher/resource). */
  resourceId: string;
  /** What the learner would do with it. */
  exercise: string;
  state: ExerciseState;
  /** The date the URL and its terms were last looked at for this record. Absent means never. */
  checkedOn?: string;
  rights: { state: RightsState; note: string };
}

/** A measurable assessment. Every check is pass or fail, so two reviewers can compare results. */
export interface FoundationAssessment {
  /** Pass or fail checks a reviewer applies to the artifact. */
  rubric: readonly string[];
  /** How many rubric checks must pass. */
  passThreshold: string;
  /** A two-minute check that the exercise still works before anyone is asked to practise it. */
  smokeTest: string;
  /** How a reviewer sees that the practice moved to a different field. */
  transferCheck: string;
}

/** FND-010 only: an unseen mission sets the goal, constraints and rubric and nothing about how. */
export interface UnseenMission {
  goal: string;
  input: string;
  constraints: readonly string[];
  /** Left to the learner on purpose. */
  notPrescribed: readonly ['model', 'harness', 'tools', 'hierarchy'];
  /** The figures a reviewer checks the learner's answer against. */
  answerKey: { scheduleALitres: number; scheduleBLitres: number; differenceLitres: number };
}

export interface StagedFoundationKata {
  status: 'staged';
  area: FoundationArea;
  /** The curriculum name used on #85. */
  curriculumName: string;
  /** The finished, checkable result a learner can show. */
  outcome: string;
  /** Planned route. No page exists there yet (checked). */
  plannedHref: `/katas/${string}`;
  /** Responsible role, per docs/catalog-lifecycle.md. */
  maintainerRole: string;
  /** Nobody has taken the work yet. It stays unassigned until someone does, on #85 or a successor issue. */
  maintainer: 'unassigned';
  reusedPractice: readonly ReusedPractice[];
  candidateExercise: CandidateExercise;
  assessment: FoundationAssessment;
  /** What the existing material does and does not show, read from the pages and records named above. */
  evidenceAssessment: string;
  /** Why the record is staged. Publication needs every gap closed. */
  openGaps: readonly string[];
  mission?: UnseenMission;
  metadata: KataMetadataInput;
}

/**
 * Vocabulary the family adds. It extends kataDimensions (src/data/kata-catalog.ts) the same way an
 * editor would, and repeats none of its IDs (checked). Existing IDs are reused where they fit:
 * compare-instructions, inspect-source, verify-evidence, manage-context, fictional-data and others.
 */
export const foundationDimensions = {
  outcomes: ['select-harness', 'route-model', 'equip-capability', 'delegate-work', 'accept-work', 'govern-run', 'complete-unseen-mission'],
  artifacts: ['stack-record', 'routing-record', 'capability-plan', 'delegation-record', 'acceptance-record', 'run-budget-record', 'mission-record'],
  capabilities: ['select-harness', 'route-models', 'write-instructions', 'equip-capabilities', 'delegate-work', 'define-acceptance', 'govern-cost-risk', 'transfer-practice'],
  constraints: [],
  stackRecipes: ['cli-agent-harness'],
} satisfies Omit<KataReferences, 'fields' | 'resources' | 'pathways'>;

const CHECKED_ON = '2026-11-20';
const dojoLicence = { state: 'dojo-content', note: 'Dojo page, MIT licence (LICENSE).' } as const;

export const stagedFoundationKatas: readonly StagedFoundationKata[] = [
  {
    status: 'staged',
    area: 'harness',
    curriculumName: 'Harness Selection & Capability Limits',
    outcome: 'A stack record for one task that names the harness, its version, the permissions it was given and one thing it could not do, with the evidence for that limit.',
    plannedHref: '/katas/fnd-harness-selection',
    maintainerRole: 'Kata maintainer, with the catalog maintainer for Armory entries',
    maintainer: 'unassigned',
    reusedPractice: [
      { href: '/katas/stack-workbench', supplies: 'A fixed task (Pocket Garden), a chat path and a CLI path, and a stack record that asks for harness, model, inherited instructions, skills and permissions.', doesNotShow: 'It changes the instruction, not the harness, so it cannot show what a harness limit does to the result.' },
      { href: '/katas/arena-evidence', supplies: 'A published, dated comparison (SWE-agent, 2024) in which the agent interface changed and the model stayed fixed.', doesNotShow: 'It is the authors’ historical experiment, not a Dojo run, and it does not isolate one tool.' },
    ],
    candidateExercise: {
      resourceId: 'swe-agent/agent-computer-interfaces',
      exercise: 'Read the paper’s method and Table 1, then list which harness capabilities (file viewer, editor, linter feedback) the shell-only agent lacked, and predict one task a learner’s own harness could not finish.',
      state: 'linked',
      checkedOn: CHECKED_ON,
      rights: { state: 'licence-recorded', note: 'Paper on arXiv (link only). The SWE-agent code repository declares MIT.' },
    },
    assessment: {
      rubric: [
        'Names the harness and its version, or writes "not shown".',
        'Lists the permissions actually granted, and whether each was asked for or inherited.',
        'States one capability limit and quotes the output, error or documentation that shows it.',
        'Separates what was observed from what was assumed.',
        'Says what changing the harness would and would not prove.',
      ],
      passThreshold: '5 of 5',
      smokeTest: 'Open /katas/stack-workbench, copy prompt A into any assistant and confirm the stack record template downloads.',
      transferCheck: 'The learner repeats the record for a task from another field (for example the IFC or data-rescue kata) and names a limit that matters there.',
    },
    evidenceAssessment: 'The workbench and arena pages are published and give the record template and a dated outside comparison. No Dojo run that changes only the harness has been recorded, so the claim that harness choice changes outcomes rests on the SWE-agent paper alone.',
    openGaps: [
      'No Dojo execution of a harness-only comparison; the exercise above is unexecuted.',
      'No page at the planned route.',
      'No maintainer assigned.',
    ],
    metadata: {
      id: 'FND-002', title: 'Choose a harness and find its limits', layer: 'foundation', professionalReviewRequired: false,
      outcomeIds: ['select-harness'], artifactTypes: ['stack-record'], capabilityIds: ['select-harness', 'verify-evidence'],
      foundationKataIds: [SHARED_FOUNDATION_ID],
      stackRecipeIds: ['assistant-and-browser', 'cli-agent-harness'],
      constraintIds: ['fictional-data', 'no-personal-data'],
      externalResources: ['swe-agent/agent-computer-interfaces', 'anthropic/claude-code-permissions'],
      verificationEvidence: [
        { description: 'Stack record with the harness, version, granted permissions and one evidenced limit.', method: 'self-check' },
        { description: 'A second person reproduces the limit from the record alone.', method: 'peer-review' },
      ],
      beltCriteria: [
        { stage: 'practice', criterion: 'Completes the stack record for the workbench task with every field filled or marked "not shown".' },
        { stage: 'adapt', criterion: 'Chooses a different harness for a stated reason and records what changed.' },
      ],
      crossFieldTransfers: ['ux', 'software'],
    },
  },
  {
    status: 'staged',
    area: 'models',
    curriculumName: 'Model Routing & Escalation',
    outcome: 'A routing record for one task: which model handles the routine step, the observable signal that escalates to a stronger model or a person, and the measured or "unavailable" cost of each route.',
    plannedHref: '/katas/fnd-model-routing',
    maintainerRole: 'Kata maintainer, with the benchmark maintainer for any comparison',
    maintainer: 'unassigned',
    reusedPractice: [
      { href: '/katas/budget-boss', supplies: 'A cost comparison of two setups that uses only measurements the learner supplies, and a dated outside example with its cost metric explained.', doesNotShow: 'It compares whole stacks; it has no escalation rule.' },
      { href: '/katas/arena-run-card', supplies: 'A run record that counts failures and unassessed runs honestly, and an "unknown cost" rule.', doesNotShow: 'It does not ask when to switch models.' },
    ],
    candidateExercise: {
      resourceId: 'anthropic/building-effective-agents',
      exercise: 'Use the routing pattern described in the essay to write a rule that sends the seed-sales exceptions to a second route, then run both routes on the same input and record the result.',
      state: 'linked',
      checkedOn: CHECKED_ON,
      rights: { state: 'publisher-terms', note: 'Anthropic article; link only.' },
    },
    assessment: {
      rubric: [
        'States the routing rule as an observable condition, not a feeling ("the output fails check 3", not "it seems hard").',
        'Names an escalation route that ends with a person for anything the checks cannot settle.',
        'Records each route’s model and version, or "not shown".',
        'Reports time and cost per route as measured, or "unavailable".',
        'Shows both routes on the same input with the same checks.',
      ],
      passThreshold: '5 of 5',
      smokeTest: 'Open /katas/budget-boss and /katas/arena-run-card and confirm both record forms still accept input.',
      transferCheck: 'The learner applies the same rule shape to a task in another field and names that field’s escalation owner.',
    },
    evidenceAssessment: 'The cost and run-record pages are published and already refuse invented costs. There is no Dojo run comparing routes, and no measured routing cost; any cost in this kata stays "unavailable" until one is recorded.',
    openGaps: [
      'No Dojo routing run; the exercise above is unexecuted.',
      'No measured time or cost for any route.',
      'No page at the planned route. No maintainer assigned.',
    ],
    metadata: {
      id: 'FND-003', title: 'Route work between models and escalate', layer: 'foundation', professionalReviewRequired: false,
      outcomeIds: ['route-model'], artifactTypes: ['routing-record'], capabilityIds: ['route-models', 'verify-evidence'],
      foundationKataIds: [SHARED_FOUNDATION_ID, 'FND-002'],
      stackRecipeIds: ['assistant-and-browser'],
      constraintIds: ['fictional-data'],
      externalResources: ['anthropic/building-effective-agents', 'openai/practical-guide-to-building-agents'],
      verificationEvidence: [
        { description: 'Routing record with the rule, both routes’ outputs on one input, and measured or "unavailable" cost.', method: 'self-check' },
        { description: 'A reviewer applies the rule to three new inputs and gets the same routes.', method: 'peer-review' },
      ],
      beltCriteria: [
        { stage: 'practice', criterion: 'Writes one observable escalation rule for the seed-sales task.' },
        { stage: 'demonstrate', criterion: 'Shows a recorded case where the rule escalated and explains what the person decided.' },
      ],
      crossFieldTransfers: ['data', 'finance'],
    },
  },
  {
    status: 'staged',
    area: 'instructions',
    curriculumName: 'Instruction Engineering',
    outcome: 'Two runs of one task that differ only in the instruction, scored against the same independent checks, with a written conclusion that claims no more than the two runs show.',
    plannedHref: '/katas/fnd-instruction-engineering',
    maintainerRole: 'Kata maintainer',
    maintainer: 'unassigned',
    reusedPractice: [
      { href: '/katas/compare-instructions', practiceId: 'PRACTICE-001', supplies: 'A short prompt and a contract-style prompt on the fictional seed-sales CSV, an independent answer check and a two-run record.', doesNotShow: 'It holds one example; it does not teach writing a contract for a new task.' },
      { href: '/katas/stack-workbench', supplies: 'A second task (Pocket Garden) with a one-line instruction change and its own record.', doesNotShow: 'The reference build’s harness and model versions were not recorded.' },
    ],
    candidateExercise: {
      resourceId: 'anthropic/prompt-engineering-interactive-tutorial',
      exercise: 'Work one chapter’s exercises in the tutorial, then rewrite prompt A for a task from the learner’s own field using the same techniques, and score both on the same checks.',
      state: 'linked',
      checkedOn: CHECKED_ON,
      rights: { state: 'no-licence-detected', note: 'The GitHub repository declared no licence when checked. Link to it; do not copy its notebooks into the Dojo.' },
    },
    assessment: {
      rubric: [
        'Changes only the instruction between runs, and records anything else that could not be held fixed.',
        'Applies the same written checks to both outputs.',
        'Reports checks passed out of checks attempted for each run.',
        'The conclusion names the one change and stops at what two runs can show.',
        'The new instruction states the output format, the exceptions and what not to invent.',
      ],
      passThreshold: '5 of 5',
      smokeTest: 'Open /katas/compare-instructions and confirm the seed-sales answer check returns the published totals.',
      transferCheck: 'The learner writes a contract-style instruction for a task in another field and scores it with that field’s checks.',
    },
    evidenceAssessment: 'PRACTICE-001 is published with a working independent check, and three published specializations (ux-journey, lighting-energy, data-rescue) already build on it in the starter catalog. Learner A/B results are not collected, so the page teaches the method; it does not show that contract prompts win.',
    openGaps: [
      'The tutorial chapter exercise has not been worked for the Dojo.',
      'The tutorial repository has no detected licence; reuse beyond linking needs the publisher’s permission.',
      'No page at the planned route. No maintainer assigned.',
    ],
    metadata: {
      id: 'FND-004', title: 'Write an instruction you can test', layer: 'foundation', professionalReviewRequired: false,
      outcomeIds: ['compare-instructions'], artifactTypes: ['comparison-record'], capabilityIds: ['write-instructions', 'verify-evidence'],
      foundationKataIds: [SHARED_FOUNDATION_ID],
      stackRecipeIds: ['assistant-and-browser'],
      constraintIds: ['fictional-data', 'no-personal-data'],
      externalResources: ['anthropic/prompt-engineering-interactive-tutorial', 'anthropic/prompting-best-practices', 'agents-md/agents-md'],
      verificationEvidence: [
        { description: 'Two-run record with checks passed out of attempted for each run.', method: 'automated-check' },
        { description: 'The written conclusion is read for claims beyond the evidence.', method: 'sensei-review' },
      ],
      beltCriteria: [
        { stage: 'practice', criterion: 'Completes the seed-sales A/B record with both runs checked.' },
        { stage: 'adapt', criterion: 'Writes and tests a contract-style instruction for a new task.' },
      ],
      crossFieldTransfers: ['ux', 'energy', 'data'],
    },
  },
  {
    status: 'staged',
    area: 'context',
    curriculumName: 'Context & Knowledge',
    outcome: 'A source review that marks which supplied material is data and which would act as instructions, shows the answer with and without a trust boundary, and cites a source line for every claim.',
    plannedHref: '/katas/fnd-context-knowledge',
    maintainerRole: 'Kata maintainer, with a security specialist when real tools are connected',
    maintainer: 'unassigned',
    reusedPractice: [
      { href: '/katas/context-trap', practiceId: 'PRACTICE-002', supplies: 'A fictional note with an embedded instruction, two prompts (with and without a trust boundary) and a record that asks what happened.', doesNotShow: 'It uses one short note; it does not cover choosing what context to supply on a long task.' },
      { href: '/katas/research-and-compare', supplies: 'Line-cited fictional sources and a change review that keeps ideas apart from approvals.', doesNotShow: 'It is not about injected instructions.' },
    ],
    candidateExercise: {
      resourceId: 'owasp/top-10-for-llm-applications',
      exercise: 'Read the prompt-injection entry, then add one indirect-injection line to a source from the learner’s own field and record whether the trust boundary held.',
      state: 'linked',
      checkedOn: CHECKED_ON,
      rights: { state: 'not-checked', note: 'OWASP project page; its licence was not confirmed for this record. Link only.' },
    },
    assessment: {
      rubric: [
        'Marks every instruction-like line inside the source as data.',
        'The final answer contains no injected content.',
        'Every factual claim cites a source line.',
        'Records both runs, including a failure if one happened.',
        'Names one piece of context the learner chose to leave out, and why.',
      ],
      passThreshold: '5 of 5',
      smokeTest: 'Open /katas/context-trap and confirm both prompts still contain the identical fictional source.',
      transferCheck: 'The learner builds the same review for a source from another field (a model file, a dataset note or a contract clause).',
    },
    evidenceAssessment: 'PRACTICE-002 is published and three specializations (inspect-ifc, open-source-patch-lab, scan-a-room) build on it. Whether a given model follows the injected line varies by model and version and is not recorded by the Dojo, so the page must keep saying a run can go either way.',
    openGaps: [
      'The OWASP-based transfer exercise has not been run for the Dojo, and its licence is unconfirmed.',
      'No exercise yet on choosing and trimming context for a long task (the effective-context-engineering article is linked, not practised).',
      'No page at the planned route. No maintainer assigned.',
    ],
    metadata: {
      id: 'FND-005', title: 'Decide what the agent may trust', layer: 'foundation', professionalReviewRequired: false,
      outcomeIds: ['inspect-source'], artifactTypes: ['source-review'], capabilityIds: ['manage-context', 'verify-evidence'],
      foundationKataIds: [SHARED_FOUNDATION_ID],
      stackRecipeIds: ['assistant-and-browser'],
      constraintIds: ['fictional-data', 'no-personal-data'],
      externalResources: ['owasp/top-10-for-llm-applications', 'anthropic/effective-context-engineering', 'anthropic/prompt-injection-defenses', 'anthropic/context-windows'],
      verificationEvidence: [
        { description: 'Source review with each instruction-like line marked and every claim cited.', method: 'self-check' },
        { description: 'A reviewer checks the final answer for injected content against the source.', method: 'peer-review' },
      ],
      beltCriteria: [
        { stage: 'practice', criterion: 'Completes the context-trap record for both prompts.' },
        { stage: 'adapt', criterion: 'Builds a trust-boundary review for a source from another field.' },
      ],
      crossFieldTransfers: ['architecture-bim', 'software', '3d'],
    },
  },
  {
    status: 'staged',
    area: 'skills-and-tools',
    curriculumName: 'Agent Armory',
    outcome: 'A capability plan for one task: which skill, tool or integration to equip, when the agent should invoke it, the permissions it needs, and one case where equipping nothing is the better choice.',
    plannedHref: '/katas/fnd-agent-armory',
    maintainerRole: 'Catalog maintainer, with a security or technical specialist for executable skills',
    maintainer: 'unassigned',
    reusedPractice: [
      { href: '/katas/stack-workbench', supplies: 'A stack record that asks which skills, plugins and MCP servers were inherited, and a task that needs none.', doesNotShow: 'It never equips a capability, so it cannot show when one helps.' },
    ],
    candidateExercise: {
      resourceId: 'microsoft/mcp-for-beginners',
      exercise: 'Follow the curriculum’s first local server lesson in a disposable folder, connect it to one harness, and record the tool description, the permission prompt and one call the agent made or declined.',
      state: 'linked',
      checkedOn: CHECKED_ON,
      rights: { state: 'licence-recorded', note: 'The GitHub repository declares MIT.' },
    },
    assessment: {
      rubric: [
        'States when the capability should be invoked as a condition on the task, and when it should not.',
        'Lists the permissions the capability needs and who approved them.',
        'Records the tool or skill description the agent actually saw.',
        'Shows one run with the capability and one without, on the same task and checks.',
        'Removes or disables the capability afterwards, or says why it stays.',
      ],
      passThreshold: '5 of 5',
      smokeTest: 'Open /armory/registry and confirm the documentation review date and the Agent Skills entry are shown.',
      transferCheck: 'The learner writes the same plan for a capability from another field (for example an IFC reader or a spreadsheet tool).',
    },
    evidenceAssessment: 'The Armory registry is a documentation review dated 7 November 2026, not a runtime test, and the workbench equips nothing. No Dojo run of an equipped capability exists, so this kata has the least practice material of the family.',
    openGaps: [
      'No Dojo run with a capability equipped; the MCP lesson has not been worked for the Dojo.',
      'Executable skills and servers need a security review before a learner is told to run them.',
      'No page at the planned route. No maintainer assigned.',
    ],
    metadata: {
      id: 'FND-006', title: 'Equip a capability only when the task needs it', layer: 'foundation', professionalReviewRequired: false,
      outcomeIds: ['equip-capability'], artifactTypes: ['capability-plan'], capabilityIds: ['equip-capabilities', 'verify-evidence'],
      foundationKataIds: [SHARED_FOUNDATION_ID, 'FND-002'],
      stackRecipeIds: ['cli-agent-harness'],
      constraintIds: ['fictional-data', 'no-personal-data'],
      externalResources: ['microsoft/mcp-for-beginners', 'anthropic/agent-skills-overview', 'anthropic/equipping-agents-with-skills', 'anthropic/writing-tools-for-agents', 'anthropic/tool-use-overview'],
      verificationEvidence: [
        { description: 'Capability plan with the invoke condition, permissions and a with/without comparison.', method: 'self-check' },
        { description: 'A specialist reads any executable skill or server before it is recommended.', method: 'sensei-review' },
      ],
      beltCriteria: [
        { stage: 'practice', criterion: 'Records every inherited skill, plugin and server in a workbench run.' },
        { stage: 'adapt', criterion: 'Equips one capability for a stated reason and shows the with/without result.' },
      ],
      crossFieldTransfers: ['software', 'architecture-bim'],
    },
  },
  {
    status: 'staged',
    area: 'orchestration',
    curriculumName: 'Delegation & Agent Hierarchies',
    outcome: 'A delegation record: an outcome-first brief to a builder role, an independent reviewer role, and the learner’s own decision on each disagreement, checked against an answer the learner computed.',
    plannedHref: '/katas/fnd-delegation',
    maintainerRole: 'Kata maintainer',
    maintainer: 'unassigned',
    reusedPractice: [
      { href: '/katas/delegate-and-review', supplies: 'Complete builder and reviewer prompts on the fictional seed-sales data, a flawed draft and an independently checkable answer (four complete unique sales, $22). Published by !136.', doesNotShow: 'It has two roles; it does not show when a hierarchy is worth its cost.' },
      { href: '/katas/meeting-to-momentum', supplies: 'Turning notes into owned commitments and a handoff.', doesNotShow: 'Its roles are people, not agents.' },
    ],
    candidateExercise: {
      resourceId: 'anthropic/multi-agent-research-system',
      exercise: 'Read the account of a lead agent directing subagents, list the costs it reports, and decide for the learner’s own task whether one agent, a builder/reviewer pair or a lead with subagents fits, with the reason.',
      state: 'linked',
      checkedOn: CHECKED_ON,
      rights: { state: 'publisher-terms', note: 'Anthropic article; link only.' },
    },
    assessment: {
      rubric: [
        'The brief states the outcome and the checks before the method.',
        'The reviewer receives the source and rules, not only the draft.',
        'The learner’s own answer matches the independent figure ($22 from four complete unique sales).',
        'Every reviewer finding is accepted or rejected with a reason.',
        'The record says why this many roles, and what one fewer would lose.',
      ],
      passThreshold: '5 of 5',
      smokeTest: 'Open /katas/delegate-and-review and confirm both prompts include the full seed-sales CSV.',
      transferCheck: 'The learner delegates a task from another field with the same three roles and the same decision record.',
    },
    evidenceAssessment: 'delegate-and-review is published (MR !136, production pipeline 134221 passed and the page was checked on 11 November 2026) with a fixed answer a learner can verify. It covers a pair, not a hierarchy; nothing in the Dojo yet shows when more roles pay off.',
    openGaps: [
      'No exercise on deeper hierarchies or handoffs between agents.',
      'No Dojo record of the hierarchy decision in the candidate exercise.',
      'No page at the planned route. No maintainer assigned.',
    ],
    metadata: {
      id: 'FND-007', title: 'Delegate to agents and keep the decision', layer: 'foundation', professionalReviewRequired: false,
      outcomeIds: ['delegate-work'], artifactTypes: ['delegation-record'], capabilityIds: ['delegate-work', 'verify-evidence'],
      foundationKataIds: [SHARED_FOUNDATION_ID, 'FND-004', 'FND-008'],
      stackRecipeIds: ['assistant-and-browser'],
      constraintIds: ['fictional-data'],
      externalResources: ['anthropic/multi-agent-research-system', 'openai/agents-handoffs', 'anthropic/building-effective-agents'],
      verificationEvidence: [
        { description: 'Delegation record whose total matches the independent answer.', method: 'automated-check' },
        { description: 'A reviewer reads the accept/reject reasons for each finding.', method: 'peer-review' },
      ],
      beltCriteria: [
        { stage: 'practice', criterion: 'Completes the builder/reviewer kata and reaches the independent answer.' },
        { stage: 'demonstrate', criterion: 'Chooses a role structure for a new task and justifies it against one fewer role.' },
      ],
      crossFieldTransfers: ['data', 'finance'],
    },
  },
  {
    status: 'staged',
    area: 'verification',
    curriculumName: 'Evidence, QA & Acceptance',
    outcome: 'Acceptance criteria written before the work, and an acceptance record that applies them: each claim in an AI draft marked supported, wrong or unknown against the evidence, with the arithmetic shown.',
    plannedHref: '/katas/fnd-evidence-acceptance',
    maintainerRole: 'Kata maintainer',
    maintainer: 'unassigned',
    reusedPractice: [
      { href: '/katas/error-clinic', supplies: 'A fictional dataset and a draft with three known errors, with the corrected arithmetic (visits fell about 16.7%; sign-up rate rose from 10% to 15%).', doesNotShow: 'Criteria are given, not written by the learner.' },
      { href: '/katas/check-an-activity-report', supplies: 'Partial records, an unverified account and a flawed draft, separating confirmed records from claims.', doesNotShow: 'It has no numeric answer key.' },
      { href: '/katas/arena-run-card', supplies: 'Counting checks passed out of attempted and keeping unassessed runs out of the count.', doesNotShow: 'It does not write acceptance criteria.' },
    ],
    candidateExercise: {
      resourceId: 'anthropic/define-success-criteria',
      exercise: 'Write measurable success criteria for a task from the learner’s field using the guide, then turn two of them into test cases and run them on an AI draft.',
      state: 'linked',
      checkedOn: CHECKED_ON,
      rights: { state: 'publisher-terms', note: 'Anthropic documentation; link only.' },
    },
    assessment: {
      rubric: [
        'Acceptance criteria are written and dated before the draft is produced.',
        'Every claim in the draft is marked supported, wrong or unknown.',
        'Arithmetic is shown and matches the answer key where one exists.',
        'Unknowns are listed as unknowns, not filled in.',
        'The accept or reject decision follows from the criteria alone.',
      ],
      passThreshold: '5 of 5',
      smokeTest: 'Open /katas/error-clinic and confirm the revealed checks still show the three problems.',
      transferCheck: 'The learner writes criteria and an acceptance record for an artifact from another field.',
    },
    evidenceAssessment: 'Three published pages give answer-keyed or evidence-separated practice, and the error clinic’s figures can be recomputed from its inputs. Writing criteria before the work is described in the linked guide but is not yet a Dojo exercise.',
    openGaps: [
      'No Dojo exercise where the learner writes the acceptance criteria first.',
      'The candidate exercise has not been worked for the Dojo.',
      'No page at the planned route. No maintainer assigned.',
    ],
    metadata: {
      id: 'FND-008', title: 'Accept work on evidence, not appearance', layer: 'foundation', professionalReviewRequired: false,
      outcomeIds: ['accept-work'], artifactTypes: ['acceptance-record'], capabilityIds: ['define-acceptance', 'verify-evidence'],
      foundationKataIds: [SHARED_FOUNDATION_ID],
      stackRecipeIds: ['assistant-and-browser'],
      constraintIds: ['fictional-data', 'no-personal-data'],
      externalResources: ['anthropic/define-success-criteria', 'anthropic/demystifying-evals', 'openai/working-with-evals', 'deeplearning-ai/evaluating-ai-agents'],
      verificationEvidence: [
        { description: 'Acceptance record whose figures match the answer key.', method: 'automated-check' },
        { description: 'A reviewer checks that the decision follows from the pre-written criteria.', method: 'peer-review' },
      ],
      beltCriteria: [
        { stage: 'practice', criterion: 'Finds all three problems in the error clinic with the arithmetic shown.' },
        { stage: 'adapt', criterion: 'Writes criteria before the work for a new artifact and applies them.' },
      ],
      crossFieldTransfers: ['data', 'science'],
    },
  },
  {
    status: 'staged',
    area: 'governance',
    curriculumName: 'Cost, Reliability & Governance',
    outcome: 'A run budget set before the work (spend, time and the stop condition), the actual figures or "unavailable" after it, the failure rate across repeated runs, and the named owner of each risk.',
    plannedHref: '/katas/fnd-cost-reliability-governance',
    maintainerRole: 'Kata maintainer, with the benchmark maintainer for repeated-run figures',
    maintainer: 'unassigned',
    reusedPractice: [
      { href: '/katas/budget-boss', supplies: 'Explains a published cost metric, what it excludes, and why old prices are not current pricing.', doesNotShow: 'It sets no budget before a run.' },
      { href: '/katas/arena-run-card', supplies: 'Repeated runs, failures included, and the rule that one unknown cost makes the average unknown.', doesNotShow: 'It names no risk owner.' },
    ],
    candidateExercise: {
      resourceId: 'nist/ai-risk-management-framework',
      exercise: 'Map one learner task to the framework’s govern, map, measure and manage functions in one line each, naming an owner and a stop condition for every risk.',
      state: 'linked',
      checkedOn: CHECKED_ON,
      rights: { state: 'publisher-terms', note: 'NIST publication page; link only. US government works are generally not subject to US copyright, which was not separately confirmed for this page.' },
    },
    assessment: {
      rubric: [
        'The budget and stop condition are written before the first run.',
        'Actual spend and time are measured, or recorded as "unavailable", never estimated as fact.',
        'Reports the failure rate across at least three runs, failures and unassessed runs listed.',
        'Every named risk has an owner and a stop condition.',
        'Says what the figures cannot show (for example current pricing or another task).',
      ],
      passThreshold: '5 of 5',
      smokeTest: 'Open /katas/arena-run-card and confirm the blank worksheet downloads.',
      transferCheck: 'The learner sets a budget and risk owners for a task in another field.',
    },
    evidenceAssessment: 'The cost and run-record pages already teach honest figures. No Dojo run has a pre-set budget, and no measured Dojo cost exists, so every cost in this kata is "unavailable" until a run is recorded.',
    openGaps: [
      'No Dojo run with a pre-set budget; time and cost are unavailable.',
      'The NIST mapping exercise has not been worked for the Dojo.',
      'No page at the planned route. No maintainer assigned.',
    ],
    metadata: {
      id: 'FND-009', title: 'Set a budget and an owner before the run', layer: 'foundation', professionalReviewRequired: false,
      outcomeIds: ['govern-run'], artifactTypes: ['run-budget-record'], capabilityIds: ['govern-cost-risk', 'verify-evidence'],
      foundationKataIds: [SHARED_FOUNDATION_ID, 'FND-003', 'FND-008'],
      stackRecipeIds: ['assistant-and-browser'],
      constraintIds: ['fictional-data'],
      externalResources: ['nist/ai-risk-management-framework', 'anthropic/claude-code-costs', 'google-sre/service-level-objectives', 'microsoft/failure-modes-in-ai-agents'],
      verificationEvidence: [
        { description: 'Run budget record with pre-set limits and actual or "unavailable" figures over three or more runs.', method: 'self-check' },
        { description: 'A reviewer checks that every risk has an owner and a stop condition.', method: 'peer-review' },
      ],
      beltCriteria: [
        { stage: 'practice', criterion: 'Records three runs with failures and unknown costs reported honestly.' },
        { stage: 'demonstrate', criterion: 'Stops a run at its pre-set condition and records the decision.' },
      ],
      crossFieldTransfers: ['finance', 'software'],
    },
  },
  {
    status: 'staged',
    area: 'unseen-mission',
    curriculumName: 'Unseen Mission',
    outcome: 'A mission record for a task the learner has not seen: the stack, roles and checks the learner chose and why, the answer, and an independent check of it against the rubric.',
    plannedHref: '/katas/fnd-unseen-mission',
    maintainerRole: 'Kata maintainer, who also keeps the mission pool so missions stay unseen',
    maintainer: 'unassigned',
    reusedPractice: [
      { href: '/katas/randori-challenges', supplies: 'Missions with fictional input, rules, a changed constraint and an independent check, with the stack left to the learner. Published by !102.', doesNotShow: 'Its missions are public, so they are no longer unseen.' },
      { href: '/katas/constraint-roulette', supplies: 'A goal and a constraint with self-check questions and no prescribed method.', doesNotShow: 'It has no numeric answer key.' },
    ],
    candidateExercise: {
      resourceId: 'anthropic/building-effective-agents',
      exercise: 'None is required: the mission below is Dojo-authored and fictional. The essay is linked for a learner who wants to justify a simpler or more complex setup.',
      state: 'planned',
      rights: { state: 'dojo-content', note: 'Mission text is Dojo content, MIT licence (LICENSE). The linked essay stays under its publisher’s terms.' },
    },
    assessment: {
      rubric: [
        'Totals match the answer key: schedule A 18,000 L, schedule B 15,000 L, difference 3,000 L.',
        'Arithmetic is shown for both schedules.',
        'The note makes no claim about plant health; the input has no such evidence.',
        'Records the model, harness, tools and roles the learner chose, or "none", with a reason.',
        'An independent check (a person or a separate calculation) is recorded.',
      ],
      passThreshold: '5 of 5',
      smokeTest: 'Recompute the answer key from the mission input (tests/foundation-katas.test.ts does this).',
      transferCheck: 'The mission is outside software and outside the seed-sales data used by the other foundations.',
    },
    evidenceAssessment: 'Randori and constraint-roulette are published and already leave the stack open. This mission is new, Dojo-authored and fictional; nobody has attempted it, and once a page publishes it, it is no longer unseen, so a rotating pool is needed before publication.',
    openGaps: [
      'Nobody has attempted the mission; no attempt time or failure rate is known.',
      'Once published the mission is seen; a maintainer-held pool of missions is needed.',
      'No page at the planned route. No maintainer assigned.',
    ],
    mission: {
      goal: 'Write a one-page decision note for a fictional community garden comparing how much water two watering schedules use over 30 days, for the volunteers who decide.',
      input: 'Fictional data. Three zones; each sprinkler delivers 20 litres per minute. Schedule A: every zone 10 minutes every day. Schedule B: every zone 25 minutes every third day (days 1, 4, 7 and so on, 10 watering days in 30).',
      constraints: [
        'Use only the input above; mark anything else as an assumption.',
        'No personal data.',
        'Write down a spend and time limit before starting.',
        'Do not claim a test or check that was not actually done.',
      ],
      notPrescribed: ['model', 'harness', 'tools', 'hierarchy'],
      answerKey: { scheduleALitres: 18000, scheduleBLitres: 15000, differenceLitres: 3000 },
    },
    metadata: {
      id: 'FND-010', title: 'Complete an unseen mission', layer: 'foundation', professionalReviewRequired: false,
      outcomeIds: ['complete-unseen-mission'], artifactTypes: ['mission-record'], capabilityIds: ['transfer-practice', 'verify-evidence'],
      foundationKataIds: [SHARED_FOUNDATION_ID, 'FND-007', 'FND-009'],
      constraintIds: ['fictional-data', 'no-personal-data'],
      externalResources: ['anthropic/building-effective-agents'],
      verificationEvidence: [
        { description: 'Mission record whose totals match the answer key.', method: 'automated-check' },
        { description: 'A sensei reads the stack and role choices and their reasons.', method: 'sensei-review' },
      ],
      beltCriteria: [
        { stage: 'demonstrate', criterion: 'Completes an unseen mission at 5 of 5 with the stack chosen and justified by the learner.' },
      ],
      crossFieldTransfers: ['agriculture'],
    },
  },
];
