import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { armoryEntries, armoryStackRecipes } from '../data/armory';
import { galleryEntries } from '../data/gallery';
import { kataCatalog } from '../data/kata-catalog';
import { fields } from './fields';
import type { SectorPackReferences } from './sector-pack';

/** A recipe as a sector pack sees it. The build passes the recipes it loaded; the tests read the same YAML files. */
export interface PackRecipe {
  slug: string;
  status: string;
  metadata: {
    id: string;
    title: string;
    layer: string;
    domainIds?: readonly string[];
    foundationKataIds?: readonly string[];
    stackRecipeIds?: readonly string[];
    professionalReviewRequired: boolean;
    artifactTypes: readonly string[];
    standards?: readonly { name: string; version: string }[];
    beltCriteria?: readonly { stage: string }[];
  };
}

/** Today's references for checkSectorPacks (#93), from the same registries the site renders. */
export function sectorPackReferences(recipes: readonly PackRecipe[], handWrittenSlugs: readonly string[], root = process.cwd()): SectorPackReferences {
  return {
    fieldIds: fields.map((field) => field.id),
    recipes: recipes.map(({ slug, status, metadata }) => ({
      id: metadata.id, slug, title: metadata.title, status, layer: metadata.layer, domainIds: metadata.domainIds ?? [], foundationKataIds: metadata.foundationKataIds ?? [],
      stackRecipeIds: metadata.stackRecipeIds ?? [], professionalReviewRequired: metadata.professionalReviewRequired, artifactTypes: metadata.artifactTypes,
      standards: (metadata.standards ?? []).map(({ name, version }) => ({ name, version })),
      beltStages: [...new Set((metadata.beltCriteria ?? []).map((criterion) => criterion.stage))],
    })),
    foundationKataIds: [
      ...kataCatalog.filter((entry) => entry.metadata.layer === 'foundation').map((entry) => entry.metadata.id),
      ...recipes.filter((recipe) => recipe.metadata.layer === 'foundation').map((recipe) => recipe.metadata.id),
    ],
    pageRoutes: handWrittenSlugs.map((slug) => '/katas/' + slug),
    galleryEntries: galleryEntries.map((entry) => ({ id: entry.id, kataId: entry.kataId, fieldIds: entry.fieldIds })),
    armoryStackRecipeIds: armoryStackRecipes.map((recipe) => recipe.id),
    armoryEntryIds: armoryEntries.map((entry) => entry.id),
    fileExists: (sitePath) => {
      const path = join(root, 'public', sitePath);
      return existsSync(path) && statSync(path).isFile();
    },
  };
}
