import type { APIRoute, GetStaticPaths } from 'astro';
import { loadArenaRecords } from '../../../lib/arena-content';
import { exportArenaRecord, type ResolvedArenaRecord } from '../../../lib/arena-records';

/** /arena/evidence/<slug>.json: the record plus the measurements computed from its evidence (#89). */
export const getStaticPaths: GetStaticPaths = () => loadArenaRecords().map((item) => ({ params: { record: item.slug }, props: { item } }));

export const GET: APIRoute = ({ props }) => {
  const { item } = props as { item: ResolvedArenaRecord };
  return new Response(`${JSON.stringify(exportArenaRecord(item, new Date().toISOString().slice(0, 10)), null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
