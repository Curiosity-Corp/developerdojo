import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('retains the last successful artifact when an upstream update conflicts', () => {
  const folder = resolve('public/examples/oss-patch-lab');
  const output = execFileSync('sh', ['upgrade-loop.sh'], { cwd: folder, encoding: 'utf8' });
  expect(output).toContain('v1 ready: Hello from upstream + locally owned feature');
  expect(output).toContain('v2 ready: Hello from upstream + locally owned feature');
  expect(output).toContain('v2 includes the new upstream note.');
  expect(output).toContain('v3 blocked: the patch no longer applies; do not publish.');
  expect(output).toContain('Previous good artifact: Hello from upstream + locally owned feature');
  expect(output).toContain('Temporary practice repositories and artifacts are removed on exit.');
}, 20_000);
