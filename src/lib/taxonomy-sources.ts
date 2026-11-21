import { kataCatalog, kataDimensions } from '../data/kata-catalog';
import { foundationDimensions, stagedFoundationKatas } from '../data/foundation-katas';
import { fnd001Dimensions, fnd001Metadata } from '../data/kata-recipes/fnd-001';
import ledgerFile from '../data/taxonomy-moves.json';
import lockFile from '../data/taxonomy-lock.json';
import { fields } from './fields';
import { currentIdentifiers, parseLedger, parseLock, type IdentifierLedger, type IdentifierSet } from './taxonomy-identifiers';

/**
 * Today's taxonomy identifiers, read from the live data (#82). The build passes the recipe records it
 * loaded and the hand-written kata pages it found; the tests read the same files from disk.
 * Every registry an editor extends is listed: kataDimensions, plus the vocabulary that the staged
 * foundation family (#85) and FND-001 (#84) reserve. Fixture-only vocabulary (src/data/kata-fixtures.ts)
 * is not listed: it never appears in a real kata.
 */
export interface LiveKataPages {
  /** Recipe records: file name (the page slug) and metadata.id. */
  recipes: readonly { slug: string; id: string }[];
  /** File names of src/pages/katas/*.astro without the extension, dynamic routes excluded. */
  handWrittenSlugs: readonly string[];
}

const registries = [kataDimensions, foundationDimensions, { outcomes: fnd001Dimensions.outcomes, artifacts: [], capabilities: fnd001Dimensions.capabilities, constraints: [], stackRecipes: fnd001Dimensions.stackRecipes }];
const vocabulary = (key: keyof typeof kataDimensions): string[] => registries.flatMap((registry) => [...registry[key]]);

export function liveIdentifiers(pages: LiveKataPages): IdentifierSet {
  return currentIdentifiers({
    kataIds: [
      ...kataCatalog.map((entry) => entry.metadata.id), ...pages.recipes.map((recipe) => recipe.id),
      ...stagedFoundationKatas.map((kata) => kata.metadata.id), fnd001Metadata.id,
    ],
    kataRoutes: [...pages.handWrittenSlugs, ...pages.recipes.map((recipe) => recipe.slug)].map((slug) => `/katas/${slug}`),
    fields: fields.map((field) => field.id),
    outcomes: vocabulary('outcomes'),
    artifacts: vocabulary('artifacts'),
    capabilities: vocabulary('capabilities'),
    constraints: vocabulary('constraints'),
    stackRecipes: vocabulary('stackRecipes'),
  });
}

/** src/data/taxonomy-moves.json, validated. */
export const identifierLedger: IdentifierLedger = parseLedger(ledgerFile);
/** src/data/taxonomy-lock.json, validated. */
export const identifierLock: IdentifierSet = parseLock(lockFile);
