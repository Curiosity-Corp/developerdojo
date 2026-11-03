export type RankId = 'developer' | 'master-developer' | 'sensei';
export type Tone = 'olive' | 'gold' | 'rust' | 'neutral';

export interface Rank {
  id: RankId;
  name: string;
  icon: string;
  tone: Tone;
  description: string;
  href: string;
}

/** The ladder: Developer -> Master Developer -> Sensei. */
export const RANKS: readonly Rank[] = [
  {
    id: 'developer',
    name: 'Developer',
    icon: 'sprout',
    tone: 'olive',
    description: 'Build real products, learn product basics, roadmapping, agile, stakeholder meetings, and delivery.',
    href: '/train#developer',
  },
  {
    id: 'master-developer',
    name: 'Master Developer',
    icon: 'mountain',
    tone: 'gold',
    description: 'Own one product end to end, steer AI agents, run platform and launch work.',
    href: '/train#master-developer',
  },
  {
    id: 'sensei',
    name: 'Sensei',
    icon: 'torii-gate',
    tone: 'rust',
    description: 'Coach other developers, host live builds, review work, and help juniors grow.',
    href: '/sensei',
  },
];
