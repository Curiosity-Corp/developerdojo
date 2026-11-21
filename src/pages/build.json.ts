import type { APIRoute } from 'astro';
import { buildMarker } from '../data/build-marker';

// Rendered once at build time: which commit and pipeline produced this copy of the site.
export const GET: APIRoute = () => new Response(`${JSON.stringify(buildMarker(process.env))}\n`, {
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});
