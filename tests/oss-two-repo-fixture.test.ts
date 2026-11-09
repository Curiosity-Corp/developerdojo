import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('composes the downloadable fixture from two disposable pinned repositories', () => {
  const folder = resolve('public/examples/oss-patch-lab');
  const output = execFileSync('sh', ['two-repo-lab.sh'], { cwd: folder, encoding: 'utf8' });
  expect(output).toContain('Before:\nHello from upstream');
  expect(output).toContain('After:\nHello from upstream + locally owned feature');
  expect(output).toContain('Practice repositories are removed');
}, 15_000);
