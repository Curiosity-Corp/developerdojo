import { parse } from 'parse5';

/** Extract outgoing anchors from built HTML. Paths and non-HTTP destinations are excluded. */
export function renderedExternalLinks(html, origin = 'https://developerdojo.org') {
  // Use an HTML5 parser so quoted > characters, unquoted attributes, entities,
  // comments, and raw script/style text have the same meaning as in a browser.
  const root = parse(html, { scriptingEnabled: false });
  const links = [];
  const visit = (node) => {
    if (node.tagName === 'a') {
      const href = node.attrs.find((attribute) => attribute.name === 'href')?.value ?? '';
      if (/^(?:https?:)?\/\//iu.test(href)) {
        try {
          const url = new URL(href, origin);
          if ((url.protocol === 'http:' || url.protocol === 'https:') && url.origin !== origin) links.push(url.href);
        } catch {
          // The built-site link checker reports malformed references separately.
        }
      }
    }
    for (const child of node.childNodes ?? []) visit(child);
  };
  visit(root);
  return links;
}
