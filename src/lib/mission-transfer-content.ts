import { assessmentMap } from '../data/assessment-map';
import { kataCatalog } from '../data/kata-catalog';
import { missionPlaybook } from '../data/mission-playbook';
import { transferPractice } from '../data/mission-transfer';
import { sectorPacks } from '../data/sector-packs';
import { loadAssessmentMap } from './assessment-map';
import { loadKataRecipes } from './kata-recipe-content';
import { loadMissionPlaybook } from './mission-playbook';
import { assemblePractice, loadTransferPractice, type AssembledPractice, type RecipeFacts, type TransferPractice } from './mission-transfer';

export interface TransferPracticeContent extends AssembledPractice {
  practice: TransferPractice;
}

let cached: Promise<TransferPracticeContent> | undefined;

/**
 * Loads the transfer practice once per build, for the mission playbook page and the practice-sheet downloads
 * (#95). Bad data throws a readable error, so it fails the build.
 */
export function loadTransferPracticeContent(): Promise<TransferPracticeContent> {
  cached ??= (async () => {
    const assessment = loadAssessmentMap(assessmentMap);
    const resolved = await loadKataRecipes();
    const recipes: RecipeFacts[] = resolved.map(({ slug, href, recipe }) => ({
      slug,
      href,
      id: recipe.metadata.id,
      title: recipe.metadata.title,
      roles: 'unavailable' in recipe.agents ? [] : recipe.agents.roles,
      capabilityIds: recipe.metadata.capabilityIds,
      standards: recipe.metadata.standards,
      constraintIds: recipe.metadata.constraintIds,
    }));
    const refs = {
      assessment,
      recipes: resolved.map(({ slug, recipe }) => ({ slug, id: recipe.metadata.id, roles: 'unavailable' in recipe.agents ? [] : recipe.agents.roles, foundationKataIds: recipe.metadata.foundationKataIds })),
      packs: sectorPacks,
      catalogIds: kataCatalog.map((entry) => entry.metadata.id),
    };
    const playbook = loadMissionPlaybook(missionPlaybook, refs);
    const practice = loadTransferPractice(transferPractice, playbook, refs);
    return { practice, ...assemblePractice({ practice, playbook, assessment, recipes, packs: sectorPacks, catalog: kataCatalog }) };
  })();
  return cached;
}
