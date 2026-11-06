import { describe, expect, it } from 'vitest';
import { fields, fieldsSchema } from '../src/lib/fields';

describe('development field registry', () => {
  it('covers distinct fields without presenting them as completed katas', () => {
    expect(fields.map((field) => field.id)).toEqual(expect.arrayContaining(['ux', 'architecture-bim', 'manufacturing', 'health', 'science']));
    expect(new Set(fields.map((field) => field.id)).size).toBe(fields.length);
  });
  it('rejects duplicate or malformed field IDs', () => {
    expect(fieldsSchema.safeParse([fields[0], fields[0]]).success).toBe(false);
    expect(fieldsSchema.safeParse([{ id: 'Bad ID', name: 'Example', examples: 'Example' }]).success).toBe(false);
  });
});
