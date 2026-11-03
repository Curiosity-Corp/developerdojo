import { describe, expect, it } from 'vitest';
import { certificatesSchema, type Certificate } from '../src/lib/schemas';
import { lookupCertificate, normaliseCode, normaliseName } from '../src/lib/certificates';
import { getCertificates } from '../src/lib/data';

// Test-only fixture. It is never read by the site build.
const FIXTURE: Certificate[] = certificatesSchema.parse([
  { code: 'DD-TEST-0001', holder: 'Test Holder One', level: 'developer', issuedOn: '2027-01-15' },
  { code: 'DD-TEST-0002', holder: 'Zoë Example', level: 'master-developer', issuedOn: '2027-02-01' },
]);

describe('lookupCertificate', () => {
  it('finds by code, ignoring case and spaces', () => {
    const result = lookupCertificate(FIXTURE, ' dd-test-0001 ');
    expect(result.kind).toBe('found');
    expect(result.matches[0]?.holder).toBe('Test Holder One');
  });
  it('finds by name, ignoring case and accents', () => {
    expect(lookupCertificate(FIXTURE, 'zoe example').matches).toHaveLength(1);
  });
  it('reports not found, too short and empty', () => {
    expect(lookupCertificate(FIXTURE, 'DD-NOPE-9999').kind).toBe('not-found');
    expect(lookupCertificate(FIXTURE, 'ab').kind).toBe('too-short');
    expect(lookupCertificate(FIXTURE, '   ').kind).toBe('empty-query');
  });
  it('never matches anything in an empty registry', () => {
    expect(lookupCertificate([], 'DD-TEST-0001').kind).toBe('not-found');
  });
  it('normalises', () => {
    expect(normaliseCode('dd- 1')).toBe('DD-1');
    expect(normaliseName('  Zoë   X ')).toBe('zoe x');
  });
});

describe('shipped registry', () => {
  it('is valid and holds no test fixture entries', () => {
    const shipped = getCertificates();
    expect(shipped.some((entry) => entry.code.startsWith('DD-TEST'))).toBe(false);
  });
});
