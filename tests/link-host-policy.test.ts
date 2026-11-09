import { describe, expect, it } from 'vitest';
import { isKnownBlockedEndpoint, isReservedExampleHost } from '../scripts/link-host-policy.mjs';

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

describe('known endpoint blocks', () => {
  it('recognizes only the verified GitHub signup endpoint, not all GitHub links', () => {
    expect(isKnownBlockedEndpoint(new URL('https://github.com/signup'))).toBe(true);
    expect(isKnownBlockedEndpoint(new URL('https://github.com/signup?source=dojo'))).toBe(true);
    for (const url of ['https://github.com/Curiosity-Corp/developerdojo', 'https://github.com/signup/other', 'https://github.com.evil.example/signup', 'http://github.com/signup']) {
      expect(isKnownBlockedEndpoint(new URL(url)), url).toBe(false);
    }
  });
});
