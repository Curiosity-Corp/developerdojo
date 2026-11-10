import type { KataCatalogEntry, KataReferences } from '../lib/kata-catalog';

// These are composable editorial dimensions, not claims of integrations or certification.
export const kataDimensions: Omit<KataReferences, 'fields' | 'resources'> = {
  outcomes: ['compare-instructions', 'inspect-source', 'design-journey', 'read-model', 'estimate-energy', 'customize-software', 'clean-data', 'inspect-3d'],
  artifacts: ['comparison-record', 'source-review', 'prototype', 'model-evidence', 'energy-estimate', 'patch-and-catalog', 'data-report', 'spatial-observation'],
  capabilities: ['verify-evidence', 'manage-context', 'design-interaction', 'inspect-model', 'calculate', 'maintain-source', 'analyze-data', 'inspect-spatial'],
  stackRecipes: ['assistant-and-browser', 'git-and-node'],
};
const draft = (metadata: Partial<KataCatalogEntry['metadata']> & Pick<KataCatalogEntry['metadata'], 'id' | 'title' | 'layer' | 'outcomeIds' | 'artifactTypes' | 'capabilityIds' | 'professionalReviewRequired'>, href: string, linkLabel: string): KataCatalogEntry => ({
  href, linkLabel,
  metadata: {
    domainIds: [], foundationKataIds: [], stackRecipeIds: [], externalResources: [], constraints: [], standards: [],
    verificationEvidence: [], beltCriteria: [], crossFieldTransfers: [], ...metadata,
  },
});

// Curated links to existing pages. Empty metadata means unrecorded, not verified or unnecessary.
export const kataCatalog: KataCatalogEntry[] = [
  draft({ id: 'FND-001', title: 'Change the instructions', layer: 'foundation', professionalReviewRequired: false, outcomeIds: ['compare-instructions'], artifactTypes: ['comparison-record'], capabilityIds: ['verify-evidence'], stackRecipeIds: ['assistant-and-browser'] }, '/katas/compare-instructions', 'Compare AI instructions'),
  draft({ id: 'FND-002', title: 'Can a document steer your agent?', layer: 'foundation', professionalReviewRequired: false, outcomeIds: ['inspect-source'], artifactTypes: ['source-review'], capabilityIds: ['manage-context'], stackRecipeIds: ['assistant-and-browser'] }, '/katas/context-trap', 'Check context and trust'),
  draft({ id: 'UX-001', title: 'Design a user journey', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['design-journey'], artifactTypes: ['prototype'], domainIds: ['ux'], capabilityIds: ['design-interaction'], foundationKataIds: ['FND-001'], stackRecipeIds: ['assistant-and-browser'] }, '/katas/ux-journey', 'Design a user journey'),
  draft({ id: 'BIM-001', title: 'Inspect an IFC model', layer: 'specialization', professionalReviewRequired: true, outcomeIds: ['read-model'], artifactTypes: ['model-evidence'], domainIds: ['architecture-bim'], capabilityIds: ['inspect-model'], foundationKataIds: ['FND-002'], stackRecipeIds: ['assistant-and-browser'] }, '/katas/inspect-ifc', 'Investigate a real IFC model'),
  draft({ id: 'ENERGY-001', title: 'Compare lighting energy', layer: 'specialization', professionalReviewRequired: true, outcomeIds: ['estimate-energy'], artifactTypes: ['energy-estimate'], domainIds: ['energy'], capabilityIds: ['calculate'], foundationKataIds: ['FND-001'], stackRecipeIds: ['assistant-and-browser'] }, '/katas/lighting-energy', 'Compare a room’s lighting energy'),
  draft({ id: 'OSS-001', title: 'Open-source patch lab', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['customize-software'], artifactTypes: ['patch-and-catalog'], domainIds: ['software'], capabilityIds: ['maintain-source'], foundationKataIds: ['FND-002'], stackRecipeIds: ['assistant-and-browser', 'git-and-node'], externalResources: ['renovate/docs', 'reuse/reuse-software'] }, '/katas/open-source-patch-lab', 'Customize open source'),
  draft({ id: 'DATA-001', title: 'Rescue messy data', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['clean-data'], artifactTypes: ['data-report'], domainIds: ['data'], capabilityIds: ['analyze-data'], foundationKataIds: ['FND-001'], stackRecipeIds: ['assistant-and-browser'] }, '/katas/data-rescue', 'Rescue messy data'),
  draft({ id: 'SPATIAL-001', title: 'Explore a 3D room', layer: 'specialization', professionalReviewRequired: false, outcomeIds: ['inspect-3d'], artifactTypes: ['spatial-observation'], domainIds: ['3d'], capabilityIds: ['inspect-spatial'], foundationKataIds: ['FND-002'], stackRecipeIds: ['assistant-and-browser'] }, '/katas/scan-a-room', 'Explore a real 3D room'),
];
