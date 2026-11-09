import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const source = resolve('public/examples/oss-patch-lab');
const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('downloadable patch lab', () => {
  it('applies an independent patch, then refuses an incompatible upstream change', () => {
    const directory = mkdtempSync(join(tmpdir(), 'dojo-patch-'));
    temporaryDirectories.push(directory);
    const app = readFileSync(join(source, 'app.mjs'));
    const patch = readFileSync(join(source, 'feature.patch'));
    writeFileSync(join(directory, 'app.mjs'), app);
    writeFileSync(join(directory, 'feature.patch'), patch);
    const run = (program: string, args: string[]) => execFileSync(program, args, { cwd: directory, encoding: 'utf8' });
    expect(run('node', ['app.mjs']).trim()).toBe('Hello from upstream');
    run('git', ['apply', '--check', 'feature.patch']);
    run('git', ['apply', 'feature.patch']);
    expect(run('node', ['app.mjs']).trim()).toBe('Hello from upstream + locally owned feature');
    writeFileSync(join(directory, 'app.mjs'), app.toString().replace("const message = 'Hello from upstream';", "const message = 'Changed upstream';"));
    expect(spawnSync('git', ['apply', '--check', 'feature.patch'], { cwd: directory }).status).not.toBe(0);
    expect(readFileSync(join(directory, 'app.mjs'), 'utf8')).toContain('Changed upstream');
  });
});
