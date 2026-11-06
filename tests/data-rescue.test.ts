import { expect, test } from 'vitest';
import { seedSalesCsv } from '../src/data/seed-sales';

test('the fictional report matches unique valid sales and flags bad values', () => {
  const lines = seedSalesCsv.trim().split('\n').slice(1);
  const unique = [...new Set(lines)];
  const valid = unique.map((line) => line.split(','))
    .filter((row) => row[3] !== '' && row[3] !== undefined && row[4] !== undefined && Number.isFinite(Number(row[4])));
  expect(lines).toHaveLength(7);
  expect(unique).toHaveLength(6);
  expect(valid).toHaveLength(4);
  expect(valid.reduce((sum, row) => sum + Number(row[3]), 0)).toBe(7);
  expect(valid.reduce((sum, row) => sum + Number(row[3]) * Number(row[4]), 0)).toBe(22);
});
