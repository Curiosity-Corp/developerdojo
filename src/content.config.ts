import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { librarySchema, resourceSchema, trackSchema } from './lib/schemas';
import { kataRecipeSchema } from './lib/kata-recipe';

// Lessons and program pages. Track lessons live in src/content/library/tracks/<track-slug>/.
const library = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/library' }),
  schema: librarySchema,
});

// Track overviews: src/content/tracks/<slug>.md, id = slug.
const tracks = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/tracks' }),
  schema: trackSchema,
});

// External learning resources: src/content/resources/<publisher>/<resource>.yaml,
// id = "<publisher>/<resource>".
const resources = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/resources' }),
  schema: resourceSchema,
});

// Operational kata recipes (#86): src/content/kata-recipes/<slug>.yaml, rendered at /katas/<slug>.
// Relationships are checked by src/lib/kata-recipes.ts; see docs/kata-recipes.md.
const kataRecipes = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/kata-recipes' }),
  schema: kataRecipeSchema,
});

export const collections = { library, tracks, resources, kataRecipes };
