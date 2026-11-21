import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

/**
 * The GitHub Actions workflow that serves developerdojo.org from gh-pages (copied there by
 * .gitlab/ci/publish-github-pages.sh). On 2026-11-21 a publish was green in GitLab but never went live:
 * deploy-pages saw no artifact right after the upload, and a re-run then saw two with the same name.
 * These checks keep the two guards against that in place.
 */

interface Step {
  id?: string;
  name?: string;
  uses?: string;
  if?: string;
  'continue-on-error'?: boolean;
  with?: Record<string, string>;
}
interface Workflow {
  jobs: { deploy: { environment: { url: string }; steps: Step[] } };
}

const file = join(import.meta.dirname, '..', '.gitlab', 'ci', 'gh-pages-workflow.yml');
const workflow = parse(readFileSync(file, 'utf8')) as Workflow;
const steps = workflow.jobs.deploy.steps;
const upload = steps.find((step) => step.uses?.startsWith('actions/upload-pages-artifact@'));
const deploys = steps.filter((step) => step.uses?.startsWith('actions/deploy-pages@'));

describe('GitHub Pages deploy workflow', () => {
  it('uploads under a name unique to the run attempt, so a re-run never finds two artifacts', () => {
    expect(upload?.with?.name).toMatch(/\$\{\{\s*github\.run_attempt\s*\}\}/);
  });

  it('deploys exactly the artifact it uploaded, in both tries', () => {
    expect(deploys).toHaveLength(2);
    for (const deploy of deploys) expect(deploy.with?.artifact_name).toBe(upload?.with?.name);
  });

  it('retries the deploy once, only when the first try failed', () => {
    const [first, retry] = deploys;
    expect(first?.['continue-on-error']).toBe(true);
    expect(retry?.if).toBe(`steps.${first?.id}.outcome == 'failure'`);
  });

  it('reports the page URL from whichever try succeeded', () => {
    const url = workflow.jobs.deploy.environment.url;
    for (const deploy of deploys) expect(url).toContain(`steps.${deploy.id}.outputs.page_url`);
  });
});
