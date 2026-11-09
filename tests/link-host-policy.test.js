import { describe, expect, it } from 'vitest';
import { isReservedExampleHost } from '../scripts/link-host-policy.mjs';

describe('external-link example domains', () => {
  it('recognizes reserved domains and their subdomains', () => {
    for (const host of ['example.com', 'www.example.org', 'git.example.org', 'EXAMPLE.NET', 'example.org.']) {
      expect(isReservedExampleHost(host), host).toBe(true);
    }
  });

  it('does not ignore lookalike or unrelated real hosts', () => {
    for (const host of ['example.org.invalid', 'notexample.com', 'canva.com', 'www.canva.com']) {
      expect(isReservedExampleHost(host), host).toBe(false);
    }
  });
});
