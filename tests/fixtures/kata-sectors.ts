/**
 * FIXTURES, NOT PUBLISHED KATAS (#81). These synthetic records exercise the kata contract across
 * six substantially different sectors and one new field. None of them has a page, an exercise, an
 * executed run, a reviewer or a verified integration. Passing schema and reference validation shows
 * only that the records are well formed and point at IDs that exist in this repository. It is not
 * evidence that an outcome is taught, that an integration works, that a standard is met or that a
 * professional review took place.
 *
 * IDs use FIX* prefixes so they never take the planned FND-*, UX-* or other curriculum IDs, and every
 * href is /katas/fixture-*, a route that does not exist (tests/kata-sector-fixtures.test.ts checks).
 * docs/kata-taxonomy.md explains how to turn a record like these into a real kata.
 */
import type { KataCatalogEntryInput, KataReferences } from '../../src/lib/kata-catalog';
import { kataDimensions } from '../../src/data/kata-catalog';
import { fields } from '../../src/lib/fields';

type Metadata = KataCatalogEntryInput['metadata'];

function fixture(metadata: Metadata): KataCatalogEntryInput {
  return { href: `/katas/fixture-${metadata.id.toLowerCase()}`, linkLabel: `${metadata.title} (fixture)`, metadata };
}

/**
 * Stack recipes the fixtures name. `candidate` marks an integration nobody has run for the Dojo: it
 * names a documented product interface and nothing more. `practice` marks a local or simulated setup
 * that existing Dojo material already teaches. Neither status is checked by the validator; the
 * fixture test only checks that every candidate is labelled as one.
 */
export const fixtureStackRecipes = [
  { id: 'browser-prototype', status: 'practice', note: 'HTML prototype in a browser' },
  { id: 'penpot-design-file', status: 'practice', note: 'Penpot prototype file (penpot/prototyping)' },
  { id: 'figma-mcp-candidate', status: 'candidate', note: 'Figma design context through an MCP server; not run for the Dojo' },
  { id: 'ifcopenshell-python', status: 'practice', note: 'Python reading an IFC file, as /katas/inspect-ifc' },
  { id: 'speckle-candidate', status: 'candidate', note: 'Speckle model exchange; not run for the Dojo' },
  { id: 'opentrons-simulate', status: 'practice', note: 'opentrons_simulate on a protocol, as the lab-automation-in-code track' },
  { id: 'elabftw-candidate', status: 'candidate', note: 'eLabFTW API for an electronic lab notebook; not run for the Dojo' },
  { id: 'nextflow-local', status: 'practice', note: 'Nextflow pipeline on a laptop, as the bioinformatics track' },
  { id: 'galaxy-candidate', status: 'candidate', note: 'Galaxy workflow on a public server; not run for the Dojo' },
  { id: 'ros2-gazebo-sim', status: 'practice', note: 'ROS 2 with Gazebo in simulation, as the robot-software track' },
  { id: 'moveit-sim', status: 'practice', note: 'MoveIt Task Constructor in simulation, as the robot-software track' },
  { id: 'spreadsheet-and-assistant', status: 'practice', note: 'Spreadsheet plus an AI assistant, as /katas/data-rescue' },
  { id: 'python-pandas', status: 'practice', note: 'Python and pandas in a notebook' },
  { id: 'quickbooks-sandbox-candidate', status: 'candidate', note: 'QuickBooks Online sandbox through its OAuth API; not run for the Dojo' },
] as const;

/** A field added as reference data only: nothing in src/ changes for it. */
export const newField = { id: 'maritime', name: 'Maritime and ports', examples: 'Vessel schedules, port calls, cargo records and berth planning.' };

/** Fixture vocabulary, added the same way an editor extends kataDimensions in src/data/kata-catalog.ts. */
export const fixtureDimensions = {
  outcomes: ['acceptance-brief', 'stack-comparison', 'source-clearance', 'usable-onboarding', 'usability-evidence', 'quantity-takeoff',
    'traceable-batch-record', 'variant-report', 'cell-cycle-evidence', 'field-data-report', 'reconciled-ledger', 'port-call-check'],
  artifacts: ['acceptance-brief', 'comparison-matrix', 'provenance-record', 'interactive-prototype', 'usability-findings', 'quantity-schedule',
    'batch-record', 'pipeline-report', 'simulation-log', 'cleaned-dataset', 'reconciliation-report', 'schedule-check'],
  capabilities: ['define-acceptance', 'compare-stacks', 'check-provenance', 'test-usability', 'automate-protocol', 'build-pipeline',
    'simulate-robot', 'reconcile-records'],
  constraints: ['simulation-only', 'public-reference-data-only', 'keyboard-only'],
} as const;

/**
 * Reference data for validating the fixtures: the real registries the build uses, plus the new field
 * and the fixture vocabulary. Resource and pathway IDs come from the caller, read from the collections.
 */
export function fixtureReferences(resources: readonly string[], pathways: readonly string[]): KataReferences {
  return {
    fields: [...fields.map((field) => field.id), newField.id],
    resources,
    pathways,
    outcomes: [...kataDimensions.outcomes, ...fixtureDimensions.outcomes],
    artifacts: [...kataDimensions.artifacts, ...fixtureDimensions.artifacts],
    capabilities: [...kataDimensions.capabilities, ...fixtureDimensions.capabilities],
    constraints: [...kataDimensions.constraints, ...fixtureDimensions.constraints],
    stackRecipes: [...kataDimensions.stackRecipes, ...fixtureStackRecipes.map((recipe) => recipe.id)],
  };
}

const WCAG_22 = {
  name: 'Web Content Accessibility Guidelines (WCAG)', version: '2.2',
  applicability: 'Web content and prototypes a learner builds in practice',
  reviewScope: 'Level A and AA success criteria on the practice prototype only; no conformance claim for any product',
  sourceResourceId: 'w3c/wcag-quickref',
};

/** Shared foundations. Every sector below reuses at least one; FIXFND-001 is used by all of them. */
export const fixtureFoundations: KataCatalogEntryInput[] = [
  fixture({
    id: 'FIXFND-001', title: 'Define the finished outcome and how it will be checked', layer: 'foundation',
    outcomeIds: ['acceptance-brief'], artifactTypes: ['acceptance-brief'], capabilityIds: ['define-acceptance'],
    stackRecipeIds: ['assistant-and-browser'], professionalReviewRequired: false,
    verificationEvidence: [{ description: 'A brief naming the finished artifact, who uses it and the checks that decide it is done', method: 'peer-review' }],
    beltCriteria: [{ stage: 'practice', criterion: 'States acceptance checks before any build step' }],
  }),
  fixture({
    id: 'FIXFND-002', title: 'Change one part of the stack and compare', layer: 'foundation',
    outcomeIds: ['stack-comparison'], artifactTypes: ['comparison-matrix'], capabilityIds: ['compare-stacks'],
    stackRecipeIds: ['assistant-and-browser', 'git-and-node'], professionalReviewRequired: false,
    verificationEvidence: [{ description: 'Two runs that differ in one recorded variable, with outputs kept side by side', method: 'self-check' }],
    beltCriteria: [{ stage: 'adapt', criterion: 'Names the changed variable and at least one confounder' }],
  }),
  fixture({
    id: 'FIXFND-003', title: 'Check sources, rights and provenance before use', layer: 'foundation',
    outcomeIds: ['source-clearance'], artifactTypes: ['provenance-record'], capabilityIds: ['check-provenance'],
    stackRecipeIds: ['assistant-and-browser'], professionalReviewRequired: false,
    externalResources: ['reuse/reuse-software', 'go-fair/fair-principles'],
    verificationEvidence: [{ description: 'Each input listed with source, date opened, licence or terms, and what was not checked', method: 'peer-review' }],
  }),
];

export interface SectorFixture {
  sector: string;
  why: string;
  entries: KataCatalogEntryInput[];
}

export const sectorFixtures: SectorFixture[] = [
  {
    sector: 'SaaS and UX',
    why: 'Digital products: journeys, prototypes and usability evidence.',
    entries: [
      fixture({
        id: 'FIXUX-001', title: 'Design an accessible onboarding journey', layer: 'specialization',
        outcomeIds: ['usable-onboarding'], artifactTypes: ['interactive-prototype', 'usability-findings'],
        domainIds: ['ux', 'software'], capabilityIds: ['design-interaction', 'test-usability'],
        foundationKataIds: ['FIXFND-001', 'FIXFND-002'], stackRecipeIds: ['browser-prototype', 'penpot-design-file'],
        pathwayIds: ['personas-and-journeys', 'product-discovery'], constraintIds: ['keyboard-only', 'fictional-data'],
        externalResources: ['penpot/prototyping', 'nngroup/customer-journey-mapping'],
        standards: [WCAG_22], professionalReviewRequired: false,
        verificationEvidence: [
          { description: 'Findings from three moderated sessions, with what each participant tried', method: 'peer-review' },
          { description: 'Keyboard and contrast checks on every onboarding step', method: 'automated-check', standards: [WCAG_22.name] },
        ],
        beltCriteria: [{ stage: 'demonstrate', criterion: 'Fixes one finding and shows the before and after' }],
        crossFieldTransfers: ['health', 'public-service'],
      }),
      fixture({
        id: 'FIXUX-002', title: 'Test a SaaS billing settings page', layer: 'specialization',
        outcomeIds: ['usability-evidence'], artifactTypes: ['usability-findings'],
        domainIds: ['ux'], capabilityIds: ['test-usability'],
        foundationKataIds: ['FIXFND-001'], stackRecipeIds: ['figma-mcp-candidate', 'browser-prototype'],
        pathwayIds: ['research-and-evidence'], externalResources: ['gov-uk/moderated-usability-testing'],
        professionalReviewRequired: false,
      }),
    ],
  },
  {
    sector: 'Built environment',
    why: 'Buildings and infrastructure: models, quantities and energy, where professional sign-off matters.',
    entries: [
      fixture({
        id: 'FIXBE-001', title: 'Take off wall quantities from an IFC model', layer: 'specialization',
        outcomeIds: ['quantity-takeoff'], artifactTypes: ['quantity-schedule'],
        domainIds: ['architecture-bim', 'construction'], capabilityIds: ['inspect-model', 'calculate'],
        foundationKataIds: ['FIXFND-001', 'FIXFND-003'], stackRecipeIds: ['ifcopenshell-python', 'speckle-candidate'],
        constraintIds: ['licensed-sample-only'], externalResources: ['buildingsmart/ifc-wall-example'],
        standards: [{
          name: 'Industry Foundation Classes (ISO 16739-1)', version: 'IFC 4.3 (ISO 16739-1:2024)',
          applicability: 'Reading wall and opening entities and their quantity sets from the sample model',
          reviewScope: 'Whether each quantity is traced to its entity and property; not model checking, exchange requirements or a tender quantity',
        }],
        professionalReviewRequired: true,
        verificationEvidence: [
          { description: 'Each quantity traced to the entity and property it came from', method: 'self-check', standards: ['Industry Foundation Classes (ISO 16739-1)'] },
          { description: 'A quantity surveyor reviews the method before any real use', method: 'professional-review' },
        ],
        crossFieldTransfers: ['manufacturing'],
      }),
      fixture({
        id: 'FIXBE-002', title: 'Estimate a lighting retrofit for one floor', layer: 'specialization',
        outcomeIds: ['estimate-energy'], artifactTypes: ['energy-estimate'],
        domainIds: ['energy', 'construction'], capabilityIds: ['calculate'],
        foundationKataIds: ['FIXFND-001'], stackRecipeIds: ['spreadsheet-and-assistant', 'python-pandas'],
        externalResources: ['eia/science-of-electricity'], professionalReviewRequired: true,
      }),
    ],
  },
  {
    sector: 'Life sciences',
    why: 'Wet-lab automation and genomics: regulated records, simulation first.',
    entries: [
      fixture({
        id: 'FIXLS-001', title: 'Simulate a liquid-handling protocol with an audit trail', layer: 'specialization',
        outcomeIds: ['traceable-batch-record'], artifactTypes: ['batch-record', 'simulation-log'],
        domainIds: ['biotechnology'], capabilityIds: ['automate-protocol'],
        foundationKataIds: ['FIXFND-001', 'FIXFND-003'], stackRecipeIds: ['opentrons-simulate', 'elabftw-candidate'],
        pathwayIds: ['lab-automation-in-code'], constraintIds: ['simulation-only'],
        externalResources: ['opentrons/python-api-executing-and-simulating', 'elabftw/elabftw-documentation', 'who/guideline-on-data-integrity'],
        standards: [{
          name: '21 CFR Part 11', version: 'eCFR text as read on the review date',
          applicability: 'United States electronic records and signatures; used here only for audit-trail vocabulary',
          reviewScope: 'Whether the simulated run log names who, what and when; no system validation or compliance claim',
          sourceResourceId: 'legal-information-institute/21-cfr-part-11',
        }],
        professionalReviewRequired: true,
        verificationEvidence: [{ description: 'Simulator log and the protocol file with its hash', method: 'automated-check', standards: ['21 CFR Part 11'] }],
      }),
      fixture({
        id: 'FIXLS-002', title: 'Build a reproducible variant-calling report', layer: 'specialization',
        outcomeIds: ['variant-report'], artifactTypes: ['pipeline-report'],
        domainIds: ['health', 'science'], capabilityIds: ['build-pipeline', 'analyze-data'],
        foundationKataIds: ['FIXFND-002', 'FIXFND-003'], stackRecipeIds: ['nextflow-local', 'galaxy-candidate'],
        pathwayIds: ['bioinformatics'], constraintIds: ['public-reference-data-only', 'no-personal-data'],
        externalResources: ['nextflow/training', 'data-carpentry/wrangling-genomics', 'nist/genome-in-a-bottle'],
        professionalReviewRequired: true,
      }),
    ],
  },
  {
    sector: 'Manufacturing and robotics',
    why: 'Physical production: robot cells and quality records, safety-critical when real.',
    entries: [
      fixture({
        id: 'FIXMR-001', title: 'Simulate a pick-and-place cell', layer: 'specialization',
        outcomeIds: ['cell-cycle-evidence'], artifactTypes: ['simulation-log'],
        domainIds: ['robotics', 'manufacturing'], capabilityIds: ['simulate-robot'],
        foundationKataIds: ['FIXFND-001', 'FIXFND-002'], stackRecipeIds: ['ros2-gazebo-sim', 'moveit-sim'],
        pathwayIds: ['robot-software'], constraintIds: ['simulation-only'],
        externalResources: ['moveit/pick-and-place-with-moveit-task-constructor', 'gazebo/getting-started-with-gazebo'],
        standards: [{
          name: 'ISO 10218-1 (robotics safety requirements)', version: 'ISO 10218-1:2025',
          applicability: 'Industrial robot cells; background reading for what a physical cell would need',
          reviewScope: 'Nothing here assesses a physical cell; a qualified safety reviewer decides any real deployment',
        }],
        professionalReviewRequired: true,
      }),
      fixture({
        id: 'FIXMR-002', title: 'Keep a batch quality record for an assembly', layer: 'specialization',
        outcomeIds: ['traceable-batch-record'], artifactTypes: ['batch-record'],
        domainIds: ['manufacturing'], capabilityIds: ['analyze-data'],
        foundationKataIds: ['FIXFND-003'], stackRecipeIds: ['spreadsheet-and-assistant', 'python-pandas'],
        constraintIds: ['fictional-data'], professionalReviewRequired: false,
        crossFieldTransfers: ['biotechnology'],
      }),
    ],
  },
  {
    sector: 'Agriculture and natural resources',
    why: 'Field trials and resource data: messy observations, seasons and FAIR data.',
    entries: [
      fixture({
        id: 'FIXAG-001', title: 'Clean field-trial data and summarise yield', layer: 'specialization',
        outcomeIds: ['field-data-report', 'clean-data'], artifactTypes: ['cleaned-dataset', 'data-report'],
        domainIds: ['agriculture', 'data'], capabilityIds: ['analyze-data'],
        foundationKataIds: ['FIXFND-001', 'FIXFND-003'], stackRecipeIds: ['spreadsheet-and-assistant', 'python-pandas'],
        pathwayIds: ['research-and-evidence'], externalResources: ['kaggle/data-cleaning', 'go-fair/fair-principles'],
        professionalReviewRequired: false, crossFieldTransfers: ['science'],
      }),
    ],
  },
  {
    sector: 'Public service and finance',
    why: 'Services people rely on and money records: plain language, legal and accounting review.',
    entries: [
      fixture({
        id: 'FIXPS-001', title: 'Rewrite a benefit eligibility page in plain language', layer: 'specialization',
        outcomeIds: ['usable-onboarding'], artifactTypes: ['interactive-prototype', 'usability-findings'],
        domainIds: ['public-service', 'ux'], capabilityIds: ['design-interaction', 'test-usability'],
        foundationKataIds: ['FIXFND-001'], stackRecipeIds: ['browser-prototype'],
        constraintIds: ['fictional-data'], externalResources: ['digital-gov/plain-language', 'gov-uk/service-standard'],
        standards: [WCAG_22], professionalReviewRequired: true,
        verificationEvidence: [{ description: 'Real eligibility rules are checked by a legal reviewer before any use', method: 'professional-review' }],
      }),
      fixture({
        id: 'FIXFI-001', title: 'Reconcile invoices against a ledger', layer: 'specialization',
        outcomeIds: ['reconciled-ledger'], artifactTypes: ['reconciliation-report'],
        domainIds: ['finance'], capabilityIds: ['reconcile-records'],
        foundationKataIds: ['FIXFND-001', 'FIXFND-002'], stackRecipeIds: ['quickbooks-sandbox-candidate', 'spreadsheet-and-assistant'],
        constraintIds: ['fictional-data'], externalResources: ['intuit/oauth-quickbooks'], professionalReviewRequired: true,
      }),
    ],
  },
];

/** A kata in the new field: it reuses the shared foundations and needs no change in src/. */
export const newFieldFixture: KataCatalogEntryInput = fixture({
  id: 'FIXMA-001', title: 'Check a vessel arrival schedule', layer: 'specialization',
  outcomeIds: ['port-call-check'], artifactTypes: ['schedule-check'],
  domainIds: [newField.id], capabilityIds: ['analyze-data'],
  foundationKataIds: ['FIXFND-001', 'FIXFND-003'], stackRecipeIds: ['spreadsheet-and-assistant'],
  constraintIds: ['fictional-data'], professionalReviewRequired: false,
  crossFieldTransfers: ['construction'],
});

export const allFixtures: KataCatalogEntryInput[] = [
  ...fixtureFoundations,
  ...sectorFixtures.flatMap((sector) => sector.entries),
  newFieldFixture,
];
