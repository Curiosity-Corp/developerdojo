/** RFC-reserved domains used for examples, including their subdomains. */
export function isReservedExampleHost(host) {
  const normalized = host.toLowerCase().replace(/\.$/u, '');
  return ['example.com', 'example.org', 'example.net'].some(
    (domain) => normalized === domain || normalized.endsWith(`.${domain}`),
  );
}

/** A specific signup endpoint refuses CI traffic, although the page opens in a browser. */
export function isKnownBlockedEndpoint(url) {
  return url.protocol === 'https:' && url.hostname === 'github.com' && url.pathname.replace(/\/$/u, '') === '/signup';
}
