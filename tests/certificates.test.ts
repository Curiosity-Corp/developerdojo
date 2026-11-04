import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { certificateSchema, certificatesSchema, type Certificate } from '../src/lib/schemas';
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

// A complete, made-up entry used only to prove that the schema rejects broken ones. Never shipped.
const COMPLETE = { code: 'DD-2099-0001', holder: 'Example Holder', level: 'developer', issuedOn: '2099-01-31' };
const root = join(import.meta.dirname, '..');

describe('registry entry rules (docs/certificates.md sections 6 and 7)', () => {
  it('accepts a complete entry, with or without a public https link', () => {
    expect(certificateSchema.safeParse(COMPLETE).success).toBe(true);
    expect(certificateSchema.safeParse({ ...COMPLETE, evidenceUrl: 'https://example.org/work' }).success).toBe(true);
  });

  for (const field of ['code', 'holder', 'level', 'issuedOn'] as const) {
    it(`rejects an entry with no ${field}`, () => {
      const incomplete: Record<string, unknown> = { ...COMPLETE };
      delete incomplete[field];
      expect(certificateSchema.safeParse(incomplete).success).toBe(false);
      expect(certificatesSchema.safeParse([incomplete]).success).toBe(false);
    });
  }

  it('rejects empty, malformed or unknown values', () => {
    const bad: Array<Record<string, unknown>> = [
      { ...COMPLETE, holder: '' },
      { ...COMPLETE, code: 'dd-2099-0001' },
      { ...COMPLETE, code: 'DD-1' },
      { ...COMPLETE, level: 'wizard' },
      { ...COMPLETE, issuedOn: 'yesterday' },
      { ...COMPLETE, issuedOn: '2099-02-31' },
      { ...COMPLETE, evidenceUrl: 'http://example.org/work' },
      { ...COMPLETE, evidenceUrl: 'javascript:alert(1)' },
    ];
    for (const entry of bad) {
      expect(certificateSchema.safeParse(entry).success, JSON.stringify(entry)).toBe(false);
    }
  });

  it('rejects personal data beyond the agreed fields', () => {
    for (const extra of ['email', 'phone', 'country', 'score', 'photo']) {
      expect(certificateSchema.safeParse({ ...COMPLETE, [extra]: 'x' }).success, extra).toBe(false);
    }
  });

  it('rejects a duplicate code', () => {
    expect(certificatesSchema.safeParse([COMPLETE, { ...COMPLETE, holder: 'Other Holder' }]).success).toBe(false);
  });
});

describe('shipped registry follows the procedure', () => {
  it('uses the DD-<year>-<number> format and the year of the issue date', () => {
    for (const entry of getCertificates()) {
      expect(entry.code, entry.code).toMatch(/^DD-\d{4}-\d{4}$/);
      expect(entry.code.slice(3, 7), entry.code).toBe(entry.issuedOn.slice(0, 4));
    }
  });
});

describe('Certificates page wording (docs/certificates.md section 2)', () => {
  const page = readFileSync(join(root, 'src', 'pages', 'certificates.astro'), 'utf8');
  const NEVER: Array<[string, RegExp]> = [
    ['accreditation', /accredit/i],
    ['tax status', /tax[- ]?(exempt|deductible)|501\(c\)/i],
    ['a guarantee', /guarantee|you will pass|assured/i],
    ['a job, pay or hiring promise', /\b(jobs?|salary|salaries|hired|hiring|employers?|careers?)\b/i],
    ['an outside authority', /\b(licensed|diploma|degree|qualification|official)\b/i],
  ];
  for (const [name, pattern] of NEVER) {
    it(`does not mention ${name}`, () => {
      expect(pattern.test(page), `certificates.astro matches ${pattern}`).toBe(false);
    });
  }
});

describe('the written procedure', () => {
  const doc = readFileSync(join(root, 'docs', 'certificates.md'), 'utf8');
  it('has numbered steps to issue, correct and revoke', () => {
    for (const heading of ['## 8. Issue a certificate', '## 9. Correct an entry', '## 10. Revoke or renew an entry']) {
      const start = doc.indexOf(heading);
      expect(start, heading).toBeGreaterThan(-1);
      expect(doc.slice(start, start + 1500), heading).toMatch(/\n1\. \*\*/);
    }
  });
  it('is linked from the maintainer handbook', () => {
    expect(readFileSync(join(root, 'docs', 'handbook.md'), 'utf8')).toContain('certificates.md');
  });
});
