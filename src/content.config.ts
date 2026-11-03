import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { librarySchema } from './lib/schemas';

const library = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/library' }),
  schema: librarySchema,
});

export const collections = { library };
