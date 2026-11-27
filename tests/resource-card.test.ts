import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import lucide from '@iconify-json/lucide/icons.json';

// The resource catalogue renders ResourceCard about a thousand times, and parsing that HTML was most of the page's
// load time on a slow device (#113). These checks keep the card's markup lean without changing what it says.
const card = readFileSync(new URL('../src/components/ResourceCard.astro', import.meta.url), 'utf8');
const page = readFileSync(new URL('../src/pages/library/resources.astro', import.meta.url), 'utf8');
const template = card.slice(card.indexOf('---', 3) + 3, card.indexOf('<style'));

describe('resource card markup', () => {
  it('draws the new-tab icon with CSS from the current lucide external-link path', () => {
    const body = (lucide.icons as Record<string, { body: string }>)['external-link']?.body ?? '';
    const path = /\bd="([^"]+)"/.exec(body)?.[1];
    expect(path).toBeTruthy();
    expect(card).toContain(`%3Cpath d='${path}'/%3E`);
    expect(template).not.toMatch(/<svg|<Icon\b/);
  });

  it('still tells every reader that the link opens a new tab', () => {
    expect(template).toContain(`<span class="visually-hidden"> (opens the publisher's site in a new tab)</span>`);
    expect(template).toMatch(/target="_blank"/);
    expect(template).toMatch(/rel="noopener noreferrer"/);
  });

  it('keeps forced-colours users able to see the icon', () => {
    expect(card).toMatch(/@media \(forced-colors: active\)[\s\S]*background-color: LinkText/);
  });

  it('styles the card and the catalogue under their own class, so Astro adds no scope attribute per element', () => {
    expect(card).toContain('<style is:global>');
    expect(page).toContain('<style is:global>');
    expect(page).toContain('<section class="section catalog">');
    for (const css of [card.slice(card.indexOf('<style')), page.slice(page.indexOf('<style'))]) {
      const selectors = css
        .split('\n')
        .filter((line) => /^ {2}[^\s/@}][^{]*[{,]$/.test(line))
        .map((line) => line.trim());
      expect(selectors.length).toBeGreaterThan(0);
      for (const selector of selectors) expect(selector).toMatch(/^\.(resource|catalog)\b/);
    }
  });
});
