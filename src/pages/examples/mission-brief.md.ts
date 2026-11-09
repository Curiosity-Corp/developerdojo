import type { APIRoute } from 'astro';
import { missionBrief } from '../../data/mission-brief';

export const GET: APIRoute = () => new Response(missionBrief, {
  headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
});
