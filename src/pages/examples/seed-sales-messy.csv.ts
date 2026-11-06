import type { APIRoute } from 'astro';
import { seedSalesCsv } from '../../data/seed-sales';

export const GET: APIRoute = () => new Response(seedSalesCsv, {
  headers: { 'Content-Type': 'text/csv; charset=utf-8' },
});
