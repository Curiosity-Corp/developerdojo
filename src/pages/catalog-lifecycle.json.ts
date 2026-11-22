import type { APIRoute } from 'astro';
import { loadCatalogLifecycle } from '../lib/catalog-lifecycle-content';

// Rendered at build time (#96): every catalog entry's lifecycle state on the build date, with the ownership
// matrix. The weekly scheduled check turns it into the maintainers' refresh list.
export const GET: APIRoute = async () => {
  const { ledger } = await loadCatalogLifecycle();
  return new Response(`${JSON.stringify(ledger, null, 2)}\n`, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
