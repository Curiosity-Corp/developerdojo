// Extract actual outgoing anchor destinations from rendered pages, not URLs in scripts or prose.
const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };

function decodeHtmlAttribute(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/giu, (match, name) => {
    if (name[0] !== '#') return entities[name.toLowerCase()] ?? match;
    const hex = name[1]?.toLowerCase() === 'x';
    const number = Number.parseInt(name.slice(hex ? 2 : 1), hex ? 16 : 10);
    return Number.isInteger(number) && number > 0 && number <= 0x10ffff && !(number >= 0xd800 && number <= 0xdfff)
      ? String.fromCodePoint(number) : match;
  });
}

/** Extract outgoing hrefs from an Astro-built HTML page. Internal and non-HTTP URLs are excluded. */
export function renderedExternalLinks(html, origin = 'https://developerdojo.org') {
  // Script/style bodies and comments can contain HTML-shaped text which is not a link on the page.
  const document = html.replace(/<!--[\s\S]*?-->|<(script|style|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>/giu, '');
  const links = [];
  for (const anchor of document.matchAll(/<a\b[^>]*\shref\s*=\s*(["'])(.*?)\1[^>]*>/giu)) {
    const href = decodeHtmlAttribute(anchor[2]);
    if (!/^(?:https?:)?\/\//iu.test(href)) continue;
    try {
      const url = new URL(href, origin);
      if ((url.protocol === 'http:' || url.protocol === 'https:') && url.origin !== origin) links.push(url.href);
    } catch {
      // The separate built-site link checker reports malformed references.
    }
  }
  return links;
}
