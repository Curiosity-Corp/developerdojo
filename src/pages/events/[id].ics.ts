import type { APIRoute, GetStaticPaths } from 'astro';
import { getEvents } from '../../lib/data';
import { buildIcs } from '../../lib/events';
import type { DojoEvent } from '../../lib/schemas';

/** One .ics calendar file per scheduled event, generated at build time. No events means no files. */
export const getStaticPaths = (() =>
  getEvents()
    .filter((event) => event.status !== 'cancelled')
    .map((event) => ({ params: { id: event.id }, props: { event } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { event } = props as { event: DojoEvent };
  return new Response(buildIcs(event), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
