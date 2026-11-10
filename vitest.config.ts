import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    // Shared CI runners can expose far more CPUs than the job can actually use.
    // Bound worker concurrency without changing test coverage or local defaults.
    maxWorkers: process.env['CI'] ? 3 : undefined,
  },
});
