// The build marker served at /build.json (src/pages/build.json.ts).
//
// The release job (.gitlab/ci/publish-github-pages.sh) pushes dist/ to GitHub gh-pages and then waits,
// with scripts/wait-for-live-build.mjs, until https://developerdojo.org/build.json reports the commit and
// pipeline that built it. Only then is the release done: a GitHub Pages deploy that fails or never runs
// turns the master pipeline red instead of leaving the previous build live unnoticed (developerdojo#128).
//
// The pipeline id is part of the marker because the nightly schedule rebuilds the same commit.
// Public content: a commit hash and a pipeline number, no hostnames.

export interface BuildMarker {
  commit: string;
  pipeline: string;
}

/** Outside CI (a local build) both fields are "local"; the release job refuses to publish such a build. */
export function buildMarker(env: Readonly<Record<string, string | undefined>>): BuildMarker {
  return {
    commit: env['CI_COMMIT_SHA'] || 'local',
    pipeline: env['CI_PIPELINE_ID'] || 'local',
  };
}
