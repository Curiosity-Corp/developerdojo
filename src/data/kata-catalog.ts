import type { LifecycleRecordInput } from '../lib/catalog-lifecycle';
import type { CuratedKataEntryInput, KataReferences } from '../lib/kata-catalog';

/**
 * Editorial vocabularies for the composable kata dimensions. They are reference data, not claims of
 * integrations or certification. Fields come from src/lib/fields.ts, resources and pathways (track
 * slugs) from the content collections. Add an ID here before a kata refers to it.
 */
export const kataDimensions: Omit<KataReferences, 'fields' | 'resources' | 'pathways'> = {
  outcomes: ['compare-instructions', 'inspect-source', 'design-journey', 'read-model', 'estimate-energy', 'customize-software', 'clean-data', 'inspect-3d', 'map-user-flow', 'connect-wireframes', 'define-design-tokens', 'build-components', 'implement-and-qa-screens', 'read-property-sets', 'check-information-requirements', 'revise-and-revalidate-model', 'inspect-weather-record', 'estimate-reference-et', 'estimate-irrigation-need', 'inspect-research-record', 'evaluate-measurement-uncertainty', 'fit-line-with-uncertainty', 'export-and-check-mesh', 'trace-quantities', 'coordinate-and-raise-issues', 'map-model-to-schedule', 'stack-comparison'],
  artifacts: ['comparison-record', 'source-review', 'prototype', 'model-evidence', 'energy-estimate', 'patch-and-catalog', 'data-report', 'spatial-observation', 'sitemap', 'wireframe-set', 'token-file', 'component-library', 'qa-report', 'property-table', 'ids-report', 'edited-model', 'weather-inspection', 'et-series', 'irrigation-estimate', 'record-inspection', 'uncertainty-budget', 'fit-report', 'mesh-file', 'quantity-table', 'issue-register', 'schedule-mapping'],
  capabilities: ['verify-evidence', 'manage-context', 'design-interaction', 'inspect-model', 'calculate', 'maintain-source', 'analyze-data', 'inspect-spatial', 'map-flows', 'design-systems', 'test-accessibility', 'validate-information', 'edit-model', 'process-geometry', 'take-off-quantities', 'coordinate-disciplines', 'plan-sequence', 'compare-stacks'],
  constraints: ['fictional-data', 'no-personal-data', 'no-paid-tools', 'offline-capable', 'licensed-sample-only'],
  stackRecipes: ['assistant-and-browser', 'git-and-node', 'penpot-and-browser', 'ifcopenshell-and-python', 'python-standard-library', 'claude-code-print-no-tools'],
};

/**
 * Lifecycle of a curated kata page (#96). The check behind these dates is the page's own automated browser
 * checks in the site pipeline; nobody has recorded a learner run or an independent review. Move verifiedOn
 * only after running the check again (docs/catalog-lifecycle.md).
 */
const pageCheck = (provenance: string[]): LifecycleRecordInput => ({
  area: 'artifact-validity',
  maintainerRole: 'kata-maintainer',
  verifiedOn: '2026-11-22',
  checked: 'The page and its exercise passed the automated browser checks in the site pipeline. No learner run or independent review is recorded.',
  provenance,
  state: 'verified',
});

/**
 * Curated links to existing pages. Omitted lists take the defaults in KATA_DEFAULTS
 * (src/lib/kata-schema.ts): empty means not recorded, never verified or unnecessary.
 * Every entry carries its lifecycle record; validateCuratedLifecycle fails on a missing field.
 */
export const kataCatalog: CuratedKataEntryInput[] = [
  { href: '/katas/compare-instructions', linkLabel: 'Compare AI instructions', metadata: { id: 'PRACTICE-001', title: 'Change the instructions', layer: 'foundation', professionalReviewRequired: false, outcomeIds: ['compare-instructions'], artifactTypes: ['comparison-record'], capabilityIds: ['verify-evidence'], stackRecipeIds: ['assistant-and-browser'] }, lifecycle: pageCheck(['Example instructions and outputs written for this kata','Evaluation guidance from Anthropic and Google documentation']) },
  { href: '/katas/context-trap', linkLabel: 'Check context and trust', metadata: { id: 'PRACTICE-002', title: 'Can a document steer your agent?', layer: 'foundation', professionalReviewRequired: false, outcomeIds: ['inspect-source'], artifactTypes: ['source-review'], capabilityIds: ['manage-context'], stackRecipeIds: ['assistant-and-browser'] }, lifecycle: pageCheck(['Example document written for this kata','OWASP guidance on prompt injection','Anthropic guardrail documentation']) },
  { href: '/katas/ux-journey', linkLabel: 'Design a user journey', metadata: { id: 'PRACTICE-003', title: 'Design a user journey', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['design-journey'], artifactTypes: ['prototype'], domainIds: ['ux'], capabilityIds: ['design-interaction'], foundationKataIds: ['PRACTICE-001'], stackRecipeIds: ['assistant-and-browser'] }, lifecycle: pageCheck(['Journey exercise written for this kata','Figma and Penpot prototyping help pages']) },
  { href: '/katas/inspect-ifc', linkLabel: 'Investigate a real IFC model', metadata: { id: 'PRACTICE-004', title: 'Inspect an IFC model', layer: 'specialization', professionalReviewRequired: true, outcomeIds: ['read-model'], artifactTypes: ['model-evidence'], domainIds: ['architecture-bim'], capabilityIds: ['inspect-model'], foundationKataIds: ['PRACTICE-002'], stackRecipeIds: ['assistant-and-browser'] }, lifecycle: pageCheck(['buildingSMART certification dataset sample (wall with opening and window), pinned to a commit, with its licence','IfcOpenShell documentation']) },
  { href: '/katas/lighting-energy', linkLabel: 'Compare a room’s lighting energy', metadata: { id: 'PRACTICE-005', title: 'Compare lighting energy', layer: 'specialization', professionalReviewRequired: true, outcomeIds: ['estimate-energy'], artifactTypes: ['energy-estimate'], domainIds: ['energy'], capabilityIds: ['calculate'], foundationKataIds: ['PRACTICE-001'], stackRecipeIds: ['assistant-and-browser'] }, lifecycle: pageCheck(['Example room and bulb figures written for this kata','US Energy Information Administration and US Department of Energy guidance']) },
  { href: '/katas/open-source-patch-lab', linkLabel: 'Customize open source', metadata: { id: 'PRACTICE-006', title: 'Open-source patch lab', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['customize-software'], artifactTypes: ['patch-and-catalog'], domainIds: ['software'], capabilityIds: ['maintain-source'], foundationKataIds: ['PRACTICE-002'], stackRecipeIds: ['assistant-and-browser', 'git-and-node'], externalResources: ['renovate/docs', 'reuse/reuse-software'] }, lifecycle: pageCheck(['Mattermost and its welcome bot plugin, pinned to commits, with their licences','REUSE and SPDX documentation']) },
  { href: '/katas/data-rescue', linkLabel: 'Rescue messy data', metadata: { id: 'PRACTICE-007', title: 'Rescue messy data', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['clean-data'], artifactTypes: ['data-report'], domainIds: ['data'], capabilityIds: ['analyze-data'], foundationKataIds: ['PRACTICE-001'], stackRecipeIds: ['assistant-and-browser'], constraintIds: ['fictional-data'] }, lifecycle: pageCheck(['Fictional dataset written for this kata']) },
  { href: '/katas/scan-a-room', linkLabel: 'Explore a real 3D room', metadata: { id: 'PRACTICE-008', title: 'Explore a 3D room', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['inspect-3d'], artifactTypes: ['spatial-observation'], domainIds: ['3d'], capabilityIds: ['inspect-spatial'], foundationKataIds: ['PRACTICE-002'], stackRecipeIds: ['assistant-and-browser'] }, lifecycle: pageCheck(['Room capture and viewer from an open-source 3D capture project, pinned to a commit, with its asset licence']) },
];
