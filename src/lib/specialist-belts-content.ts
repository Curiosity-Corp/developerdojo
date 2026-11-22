import { sectorPacks } from '../data/sector-packs';
import { fields } from './fields';
import { loadKataRecipes } from './kata-recipe-content';
import { specialistBelts, type SpecialistBelt } from './review-record';

/**
 * The specialist belts at build time (#90): one per sector pack, with the field name from src/lib/fields.ts and the
 * Randori recipe's title and page. Used by /assessment-map and /review-record, so both show the same belts.
 */
export async function loadSpecialistBelts(): Promise<SpecialistBelt[]> {
  const recipes = await loadKataRecipes();
  return specialistBelts(
    sectorPacks,
    (id) => fields.find((field) => field.id === id)?.name,
    (kataId) => {
      const found = recipes.find((item) => item.recipe.metadata.id === kataId);
      return found ? { title: found.recipe.metadata.title, href: found.href } : undefined;
    },
  );
}
