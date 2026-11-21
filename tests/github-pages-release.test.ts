import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { buildMarker } from '../src/data/build-marker';
import { matchBuild, parseArgs, waitForLiveBuild, type FetchResponse } from '../scripts/wait-for-live-build.mjs';

// developerdojo#128: the GitHub Pages deploy of 2555466 failed, so production kept the previous build
// (the example frames still loaded /examples/pocket-garden.html, where the edge injects its RUM beacon),
// while every GitLab job was green. These tests hold the two fixes: the GitHub workflow uploads and
// deploys in separate jobs, and the release job waits until the live site serves its build.

const expected = { commit: 'abc123', pipeline: '157250' };

describe('gh-pages workflow', () => {
  type Step = { uses?: string; with?: Record<string, unknown> };
  type Job = { needs?: string | string[]; steps?: Step[]; permissions?: Record<string, string> };
  const workflow = parse(readFileSync('.gitlab/ci/gh-pages-workflow.yml', 'utf8')) as {
    concurrency: { 'cancel-in-progress': boolean };
    jobs: Record<string, Job>;
  };
  const jobUsing = (action: string): [string, Job] => {
    const found = Object.entries(workflow.jobs).filter(([, job]) => (job.steps ?? []).some((step) => step.uses?.startsWith(`${action}@`)));
    expect(found, `exactly one job uses ${action}`).toHaveLength(1);
    return found[0]!;
  };

  it('uploads the artifact in one job and deploys it in a later job', () => {
    const [uploadName, upload] = jobUsing('actions/upload-pages-artifact');
    const [deployName, deploy] = jobUsing('actions/deploy-pages');
    expect(deployName).not.toBe(uploadName);
    expect([deploy.needs].flat()).toContain(uploadName);
    expect(upload.steps?.find((step) => step.uses?.startsWith('actions/upload-pages-artifact@'))?.with?.['path']).toBe('.');
    expect(deploy.permissions).toMatchObject({ pages: 'write', 'id-token': 'write' });
  });

  it('never cancels a deployment in progress', () => {
    expect(workflow.concurrency['cancel-in-progress']).toBe(false);
  });
});

describe('release script', () => {
  const script = readFileSync('.gitlab/ci/publish-github-pages.sh', 'utf8');

  it('waits for the live build after pushing, also when there was nothing to push', () => {
    const wait = script.indexOf('node "$CI_PROJECT_DIR/scripts/wait-for-live-build.mjs"');
    expect(wait, 'the release script runs wait-for-live-build').toBeGreaterThan(-1);
    expect(wait).toBeGreaterThan(script.indexOf('git -C "$work" push origin'));
    expect(wait).toBeGreaterThan(script.indexOf('nothing to push'));
    expect(script).not.toMatch(/nothing to push\."\s*\n\s*exit 0/);
  });
});

describe('build marker', () => {
  it('names the commit and pipeline that built the site', () => {
    expect(buildMarker({ CI_COMMIT_SHA: 'abc123', CI_PIPELINE_ID: '157250' })).toEqual(expected);
    expect(buildMarker({})).toEqual({ commit: 'local', pipeline: 'local' });
  });

  it('is what the release script expects in dist/build.json', () => {
    const body = JSON.stringify(buildMarker({ CI_COMMIT_SHA: 'abc123', CI_PIPELINE_ID: '157250' }));
    expect(body).toBe('{"commit":"abc123","pipeline":"157250"}');
    expect(matchBuild(body, expected).ok).toBe(true);
  });
});

describe('matchBuild', () => {
  it('needs both the commit and the pipeline', () => {
    expect(matchBuild('{"commit":"abc123","pipeline":"156403"}', expected)).toEqual({ ok: false, state: 'live build is commit abc123, pipeline 156403' });
    expect(matchBuild('{"commit":"d42392a","pipeline":"157250"}', expected).ok).toBe(false);
  });

  it('reports a body that is not a marker', () => {
    expect(matchBuild('<!doctype html>', expected).state).toMatch(/^body is not JSON/);
    expect(matchBuild('{"commit":1}', expected).state).toMatch(/^body is not a build marker/);
  });
});

describe('waitForLiveBuild', () => {
  const response = (status: number, body: string): FetchResponse => ({ ok: status >= 200 && status < 300, status, text: async () => body });

  function harness(responses: Array<FetchResponse | Error>) {
    let clock = 0;
    const urls: string[] = [];
    const lines: string[] = [];
    return {
      urls,
      lines,
      options: {
        url: 'https://developerdojo.org/build.json',
        expected,
        timeoutMs: 60_000,
        intervalMs: 15_000,
        fetchImpl: async (url: URL) => {
          urls.push(url.href);
          const next = responses.shift() ?? response(200, '{"commit":"old","pipeline":"1"}');
          if (next instanceof Error) throw next;
          return next;
        },
        sleep: async (ms: number) => {
          clock += ms;
        },
        now: () => clock,
        log: (line: string) => lines.push(line),
      },
    };
  }

  it('returns once the live site serves the expected build', async () => {
    const h = harness([
      response(200, '{"commit":"old","pipeline":"1"}'),
      new TypeError('fetch failed'),
      response(404, 'Not Found'),
      response(200, JSON.stringify(expected)),
    ]);
    const result = await waitForLiveBuild(h.options);
    expect(result).toMatchObject({ ok: true, attempts: 4 });
    expect(new Set(h.urls).size).toBe(4);
    expect(h.urls[0]).toBe('https://developerdojo.org/build.json?release-check=157250-1');
  });

  it('fails with the last state when the deploy never lands (the 2026-11-21 incident)', async () => {
    const h = harness([]);
    const result = await waitForLiveBuild(h.options);
    expect(result.ok).toBe(false);
    expect(result.state).toBe('live build is commit old, pipeline 1');
    expect(result.attempts).toBe(5);
    expect(h.lines).toHaveLength(1);
  });
});

describe('parseArgs', () => {
  it('reads the URL, build and timing', () => {
    expect(parseArgs(['https://developerdojo.org/build.json', '--commit', 'abc123', '--pipeline', '157250', '--timeout-seconds', '60'])).toEqual({
      url: 'https://developerdojo.org/build.json',
      ...expected,
      timeoutSeconds: 60,
      intervalSeconds: 15,
    });
  });

  it('refuses missing or bad arguments', () => {
    expect(() => parseArgs(['https://developerdojo.org/build.json', '--commit', 'abc123'])).toThrow(/--pipeline are required/);
    expect(() => parseArgs(['--commit', 'a', '--pipeline', 'b'])).toThrow(/exactly one URL/);
    expect(() => parseArgs(['https://x.test/', '--commit', 'a', '--pipeline', 'b', '--interval-seconds', '0'])).toThrow(/positive/);
    expect(() => parseArgs(['https://x.test/', '--bogus'])).toThrow(/unknown option/);
  });
});
