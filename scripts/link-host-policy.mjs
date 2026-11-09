/** RFC-reserved domains used for examples, including their subdomains. */
export function isReservedExampleHost(host) {
  const normalized = host.toLowerCase().replace(/\.$/u, '');
  return ['example.com', 'example.org', 'example.net'].some(
    (domain) => normalized === domain || normalized.endsWith(`.${domain}`),
  );
}
