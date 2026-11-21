import type { APIRoute, GetStaticPaths } from 'astro';
import { loadKataRecipes } from '../../../lib/kata-recipe-content';
import { downloadType } from '../../../lib/kata-recipe';

// Configuration files a recipe offers for download (#86), served as static text at
// /katas/<slug>/<filename>. The schema allows only .md, .json, .yaml, .toml and .txt names.
export const getStaticPaths = (async () => {
  const recipes = await loadKataRecipes();
  return recipes.flatMap((resolved) => resolved.recipe.downloads.map((file) => ({
    params: { recipe: resolved.slug, file: file.filename },
    props: { content: file.content, filename: file.filename },
  })));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { content, filename } = props as { content: string; filename: string };
  return new Response(`${content}\n`, {
    headers: { 'Content-Type': `${downloadType(filename)}; charset=utf-8` },
  });
};
