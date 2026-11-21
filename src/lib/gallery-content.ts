import { galleryEntries, galleryOutcomeLabels } from '../data/gallery';
import { kataCatalog, kataDimensions } from '../data/kata-catalog';
import { fnd001Metadata } from '../data/kata-recipes/fnd-001';
import { loadContent } from './content';
import { fields } from './fields';
import { galleryKatas, resolveGallery, type ResolvedGallery } from './gallery';
import { loadKataRecipes } from './kata-recipe-content';
import { validateKataCatalog } from './kata-catalog';
import { kataMetadataSchema } from './kata-schema';

let cached: Promise<ResolvedGallery> | undefined;

/** Loads and validates the gallery once per build. An invalid entry or reference fails the build. */
export function loadGallery(): Promise<ResolvedGallery> {
  cached ??= (async () => {
    const [recipes, { resources, tracks }] = await Promise.all([loadKataRecipes(), loadContent()]);
    const catalog = validateKataCatalog(kataCatalog, {
      fields: fields.map((field) => field.id), resources: resources.map((resource) => resource.id),
      pathways: tracks.map((track) => track.id), ...kataDimensions,
    });
    return resolveGallery(galleryEntries, {
      // FND-001 (#84) is a validated record without a page yet (tests/fnd-001-record.test.ts).
      katas: galleryKatas(catalog, recipes, [kataMetadataSchema.parse(fnd001Metadata)]),
      fields,
      // tests/gallery.test.ts checks these labels cover exactly the outcome vocabulary (galleryOutcomeIds).
      outcomes: Object.entries(galleryOutcomeLabels).map(([id, label]) => ({ id, label })),
      today: new Date().toISOString().slice(0, 10),
    });
  })();
  return cached;
}
