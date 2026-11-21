#!/usr/bin/env node
// Wait until the live site serves a given build (developerdojo#128).
//
//   node scripts/wait-for-live-build.mjs https://developerdojo.org/build.json \
//     --commit "$CI_COMMIT_SHA" --pipeline "$CI_PIPELINE_ID" [--timeout-seconds 1200] [--interval-seconds 15]
//
// The release job pushes dist/ to GitHub gh-pages; a GitHub Actions workflow there deploys it to Pages.
// A push that succeeds says nothing about the deploy: on 2026-11-21 the deploy of 2555466 failed and the
// site kept serving the build from the day before while every GitLab job was green. This script makes
// the release job wait for what a customer gets: /build.json (src/pages/build.json.ts) must report this
// commit and pipeline. It polls with a cache-busting query, logs each new state once, and exits
// 0 when the build is live, 1 on timeout (with the last state seen), 2 on bad arguments.

import { pathToFileURL } from 'node:url';

/** Does a fetched marker body report the expected build? */
export function matchBuild(body, expected) {
  let marker;
  try {
    marker = JSON.parse(body);
  } catch (error) {
    return { ok: false, state: `body is not JSON (${error.message}): ${String(body).slice(0, 120)}` };
  }
  if (marker === null || typeof marker !== 'object' || typeof marker.commit !== 'string' || typeof marker.pipeline !== 'string') {
    return { ok: false, state: `body is not a build marker: ${String(body).slice(0, 120)}` };
  }
  const state = `live build is commit ${marker.commit}, pipeline ${marker.pipeline}`;
  return { ok: marker.commit === expected.commit && marker.pipeline === expected.pipeline, state };
}

/**
 * Poll url until it serves the expected marker or timeoutMs passes.
 * fetchImpl, sleep, now and log are injectable for tests.
 */
export async function waitForLiveBuild({
  url,
  expected,
  timeoutMs,
  intervalMs,
  fetchImpl = fetch,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  now = () => Date.now(),
  log = (line) => console.log(line),
}) {
  const deadline = now() + timeoutMs;
  let lastState = 'no response yet';
  for (let attempt = 1; ; attempt += 1) {
    const probe = new URL(url);
    probe.searchParams.set('release-check', `${expected.pipeline}-${attempt}`);
    let state;
    try {
      const response = await fetchImpl(probe, { headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(20_000) });
      const body = await response.text();
      if (response.ok) {
        const result = matchBuild(body, expected);
        if (result.ok) {
          log(`wait-for-live-build: ${url} serves commit ${expected.commit}, pipeline ${expected.pipeline} (attempt ${attempt})`);
          return { ok: true, attempts: attempt, state: result.state };
        }
        state = result.state;
      } else {
        state = `HTTP ${response.status}`;
      }
    } catch (error) {
      state = `request failed: ${error.cause?.code ?? error.name}: ${error.message}`;
    }
    if (state !== lastState) log(`wait-for-live-build: ${state}; waiting for commit ${expected.commit}, pipeline ${expected.pipeline}`);
    lastState = state;
    if (now() + intervalMs > deadline) return { ok: false, attempts: attempt, state: lastState };
    await sleep(intervalMs);
  }
}

export function parseArgs(argv) {
  const options = { timeoutSeconds: 1200, intervalSeconds: 15 };
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const value = () => {
      const next = argv[i + 1];
      if (next === undefined) throw new Error(`${arg} needs a value`);
      i += 1;
      return next;
    };
    if (arg === '--commit') options.commit = value();
    else if (arg === '--pipeline') options.pipeline = value();
    else if (arg === '--timeout-seconds') options.timeoutSeconds = Number(value());
    else if (arg === '--interval-seconds') options.intervalSeconds = Number(value());
    else if (arg.startsWith('--')) throw new Error(`unknown option ${arg}`);
    else positional.push(arg);
  }
  if (positional.length !== 1) throw new Error('give exactly one URL (the live /build.json)');
  options.url = new URL(positional[0]).href;
  if (!options.commit || !options.pipeline) throw new Error('--commit and --pipeline are required');
  if (!Number.isFinite(options.timeoutSeconds) || options.timeoutSeconds <= 0) throw new Error('--timeout-seconds must be a positive number');
  if (!Number.isFinite(options.intervalSeconds) || options.intervalSeconds <= 0) throw new Error('--interval-seconds must be a positive number');
  return options;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`wait-for-live-build: ${error.message}`);
    process.exit(2);
  }
  const result = await waitForLiveBuild({
    url: options.url,
    expected: { commit: options.commit, pipeline: options.pipeline },
    timeoutMs: options.timeoutSeconds * 1000,
    intervalMs: options.intervalSeconds * 1000,
  });
  if (!result.ok) {
    console.error(`wait-for-live-build: ${options.url} did not serve commit ${options.commit}, pipeline ${options.pipeline} within ${options.timeoutSeconds}s. Last state: ${result.state}.`);
    process.exit(1);
  }
}
