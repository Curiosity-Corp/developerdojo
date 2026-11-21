import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { checkPocketGarden, EVIDENCE_DIR, listArtifacts, REFERENCE_FILE, type CheckResults } from '../scripts/fnd-001/check-pocket-garden.mjs';

// FND-001 (#84): the recorded check results are evidence, so CI re-runs the independent checker on
// every stored response and fails if any result or detail differs from public/examples/fnd-001/results.json.
// It needs no server: the checker serves each file to the page itself and blocks every other request.

type Recorded = { results: Record<string, { checks: CheckResults }> };
const recorded = JSON.parse(readFileSync(join(EVIDENCE_DIR, 'results.json'), 'utf8')) as Recorded;
const reference = readFileSync(REFERENCE_FILE, 'utf8');

test.describe('FND-001 evidence', () => {
  // The checker sets its own desktop and 390 px viewports, so one browser project is enough.
  test.skip(({ isMobile }) => isMobile, 'the checker sets its own viewports');

  for (const artifact of listArtifacts()) {
    test(`recorded checks hold for ${artifact.id}`, async ({ page }) => {
      expect(recorded.results[artifact.id], `results.json has no entry for ${artifact.id}; run node scripts/fnd-001/check-pocket-garden.mjs`).toBeDefined();
      expect(await checkPocketGarden(page, artifact.html, artifact.response)).toEqual(recorded.results[artifact.id]?.checks);
    });
  }

  // Negative controls: a checker that passes everything would make the record meaningless.
  const broken: [string, string, (html: string) => string, string | undefined][] = [
    ['an external image', 'no-external-requests', (html) => html.replace('</main>', '<img src="https://example.com/x.png" alt=""></main>'), undefined],
    ['a filter that shows everything', 'sun-filter', (html) => html.replace("card.hidden = filter !== 'all' && card.dataset.light !== filter;", 'card.hidden = false;'), undefined],
    ['a toggle without aria-pressed', 'pressed-state', (html) => html.replaceAll('aria-pressed="false">Mark', '>Mark').replace("button.setAttribute('aria-pressed', String(done));", "button.dataset.done = String(done);").replace("const done = button.getAttribute('aria-pressed') !== 'true';", "const done = button.dataset.done !== 'true';"), undefined],
    ['choices saved across reloads', 'reload-resets', (html) => html.replace('</script>', "document.querySelectorAll('.done').forEach((b, i) => { if (localStorage.getItem('p' + i)) b.click(); b.addEventListener('click', () => localStorage.setItem('p' + i, '1')); });</script>"), undefined],
    ['no focus outline', 'visible-keyboard-focus', (html) => html.replace('</style>', 'button:focus,button:focus-visible{outline:none!important;box-shadow:none!important}</style>'), undefined],
    ['two code blocks', 'single-html-block', (html) => html, 'one\n```html\n<!doctype html><html></html>\n```\nand\n```html\n<!doctype html><html></html>\n```'],
    ['a claim of testing', 'no-test-claim', (html) => html, `\`\`\`html\n${reference}\n\`\`\`\nI tested it in Chrome and everything works.`],
  ];
  for (const [what, check, mutate, response] of broken) {
    test(`checker fails ${check} for ${what}`, async ({ page }) => {
      const html = mutate(reference);
      expect(html === reference && response === undefined, 'the mutation did not change the reference').toBe(false);
      const results = await checkPocketGarden(page, html, response);
      expect(results[check]?.pass, results[check]?.detail).toBe(false);
    });
  }
});
