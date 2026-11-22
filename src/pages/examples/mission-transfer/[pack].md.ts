import type { APIRoute, GetStaticPaths } from 'astro';
import { loadTransferPracticeContent } from '../../../lib/mission-transfer-content';

/** /examples/mission-transfer/<pack>.md: one field's transfer practice sheet, generated from the pathway (#95). */
export const getStaticPaths: GetStaticPaths = async () => {
  const { fields, sheets } = await loadTransferPracticeContent();
  return fields.map((field) => ({ params: { pack: field.packId }, props: { sheet: sheets.get(field.packId) ?? '' } }));
};

export const GET: APIRoute = ({ props }) => {
  const { sheet } = props as { sheet: string };
  if (!sheet) return new Response('No practice sheet for this field.', { status: 404 });
  return new Response(sheet, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
