import type { APIRoute } from 'astro';
import { pocketGardenHtml } from '../../data/pocket-garden';

export const GET: APIRoute = () => new Response(pocketGardenHtml, {
  headers: { 'Content-Type': 'text/html; charset=utf-8' },
});
