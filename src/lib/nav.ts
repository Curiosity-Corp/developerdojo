export interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation, exact order from the brief. "Start free" is the header call to action. */
export const NAV: readonly NavItem[] = [
  { label: 'Train', href: '/train' },
  { label: 'Sensei', href: '/sensei' },
  { label: 'Library', href: '/library' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Challenges', href: '/challenges' },
  { label: 'Events', href: '/events' },
  { label: 'Membership', href: '/membership' },
];

export const START_FREE: NavItem = { label: 'Start free', href: '/membership' };

export const GITHUB_URL = 'https://github.com/Curiosity-Corp/developerdojo';

export const FOOTER_LINKS: readonly NavItem[] = [
  { label: 'About CRC', href: '/about' },
  { label: 'Sponsors (Reveltek)', href: '/sponsors' },
  { label: 'Become a sponsor', href: '/sponsors#become-a-sponsor' },
  { label: 'Contact', href: '/contact' },
  { label: 'Code of conduct', href: '/code-of-conduct' },
  { label: 'GitHub', href: GITHUB_URL },
];

/** True when `pathname` is the nav item's page or below it. */
export function isActive(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === href || path.startsWith(`${href}/`);
}
