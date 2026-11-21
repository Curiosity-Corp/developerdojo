import type { KataCatalogEntryInput, KataReferences } from '../lib/kata-catalog';

/**
 * Editorial vocabularies for the composable kata dimensions. They are reference data, not claims of
 * integrations or certification. Fields come from src/lib/fields.ts, resources and pathways (track
 * slugs) from the content collections. Add an ID here before a kata refers to it.
 */
export const kataDimensions: Omit<KataReferences, 'fields' | 'resources' | 'pathways'> = {
  outcomes: ['compare-instructions', 'inspect-source', 'design-journey', 'read-model', 'estimate-energy', 'customize-software', 'clean-data', 'inspect-3d', 'read-property-sets', 'check-information-requirements', 'revise-and-revalidate-model'],
  artifacts: ['comparison-record', 'source-review', 'prototype', 'model-evidence', 'energy-estimate', 'patch-and-catalog', 'data-report', 'spatial-observation', 'property-table', 'ids-report', 'edited-model'],
  capabilities: ['verify-evidence', 'manage-context', 'design-interaction', 'inspect-model', 'calculate', 'maintain-source', 'analyze-data', 'inspect-spatial', 'validate-information', 'edit-model'],
  constraints: ['fictional-data', 'no-personal-data', 'no-paid-tools', 'offline-capable', 'licensed-sample-only'],
  stackRecipes: ['assistant-and-browser', 'git-and-node', 'ifcopenshell-and-python'],
};

/**
 * Curated links to existing pages. Omitted lists take the defaults in KATA_DEFAULTS
 * (src/lib/kata-schema.ts): empty means not recorded, never verified or unnecessary.
 */
export const kataCatalog: KataCatalogEntryInput[] = [
  { href: '/katas/compare-instructions', linkLabel: 'Compare AI instructions', metadata: { id: 'PRACTICE-001', title: 'Change the instructions', layer: 'foundation', professionalReviewRequired: false, outcomeIds: ['compare-instructions'], artifactTypes: ['comparison-record'], capabilityIds: ['verify-evidence'], stackRecipeIds: ['assistant-and-browser'] } },
  { href: '/katas/context-trap', linkLabel: 'Check context and trust', metadata: { id: 'PRACTICE-002', title: 'Can a document steer your agent?', layer: 'foundation', professionalReviewRequired: false, outcomeIds: ['inspect-source'], artifactTypes: ['source-review'], capabilityIds: ['manage-context'], stackRecipeIds: ['assistant-and-browser'] } },
  { href: '/katas/ux-journey', linkLabel: 'Design a user journey', metadata: { id: 'PRACTICE-003', title: 'Design a user journey', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['design-journey'], artifactTypes: ['prototype'], domainIds: ['ux'], capabilityIds: ['design-interaction'], foundationKataIds: ['PRACTICE-001'], stackRecipeIds: ['assistant-and-browser'] } },
  { href: '/katas/inspect-ifc', linkLabel: 'Investigate a real IFC model', metadata: { id: 'PRACTICE-004', title: 'Inspect an IFC model', layer: 'specialization', professionalReviewRequired: true, outcomeIds: ['read-model'], artifactTypes: ['model-evidence'], domainIds: ['architecture-bim'], capabilityIds: ['inspect-model'], foundationKataIds: ['PRACTICE-002'], stackRecipeIds: ['assistant-and-browser'] } },
  { href: '/katas/lighting-energy', linkLabel: 'Compare a room’s lighting energy', metadata: { id: 'PRACTICE-005', title: 'Compare lighting energy', layer: 'specialization', professionalReviewRequired: true, outcomeIds: ['estimate-energy'], artifactTypes: ['energy-estimate'], domainIds: ['energy'], capabilityIds: ['calculate'], foundationKataIds: ['PRACTICE-001'], stackRecipeIds: ['assistant-and-browser'] } },
  { href: '/katas/open-source-patch-lab', linkLabel: 'Customize open source', metadata: { id: 'PRACTICE-006', title: 'Open-source patch lab', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['customize-software'], artifactTypes: ['patch-and-catalog'], domainIds: ['software'], capabilityIds: ['maintain-source'], foundationKataIds: ['PRACTICE-002'], stackRecipeIds: ['assistant-and-browser', 'git-and-node'], externalResources: ['renovate/docs', 'reuse/reuse-software'] } },
  { href: '/katas/data-rescue', linkLabel: 'Rescue messy data', metadata: { id: 'PRACTICE-007', title: 'Rescue messy data', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['clean-data'], artifactTypes: ['data-report'], domainIds: ['data'], capabilityIds: ['analyze-data'], foundationKataIds: ['PRACTICE-001'], stackRecipeIds: ['assistant-and-browser'], constraintIds: ['fictional-data'] } },
  { href: '/katas/scan-a-room', linkLabel: 'Explore a real 3D room', metadata: { id: 'PRACTICE-008', title: 'Explore a 3D room', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['inspect-3d'], artifactTypes: ['spatial-observation'], domainIds: ['3d'], capabilityIds: ['inspect-spatial'], foundationKataIds: ['PRACTICE-002'], stackRecipeIds: ['assistant-and-browser'] } },
];
