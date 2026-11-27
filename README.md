# Developer Dojo

_Last verified: 2026-11-22._

Source of [developerdojo.org](https://developerdojo.org): a free training academy for the new kind of
developer, run by Curiosity Research Corporation and sponsored by Reveltek. A developer no longer mostly
types code; a developer owns a whole product and steers AI agents that do the building.

This repository is the source of truth (GitLab `Curiosity-Corp/developerdojo`, default branch `master`).
The GitHub copy only ever receives the **built** site on its `gh-pages` branch.

Running the site: [CONTRIBUTING.md](CONTRIBUTING.md) (how to change a page), [docs/handbook.md](docs/handbook.md) (maintainer handbook), [ROADMAP.md](ROADMAP.md) (what is next).

Core focuses: robotics and biotechnology. Their four tracks and the shared modules have stable URLs that other sites
link to: [docs/track-urls.md](docs/track-urls.md).

## Stack

Astro (static output), TypeScript strict, content collections validated with zod, self-hosted fonts
(`@fontsource`), lucide icons inlined at build time. No backend, no trackers, no CDN, no runtime calls to
other hosts.

## Commands

| Command | What it does |
| --- | --- |
| `npm ci` | Install dependencies |
| `npm run dev` | Dev server on http://localhost:4321 |
| `npm run check` | `astro check` (types and templates) |
| `npm test` | Vitest: data and frontmatter schemas |
| `npm run build` | Static build into `dist/`, then the Pagefind search index (`scripts/build-search.mjs`) |
| `npm run preview` | Serve `dist/` on http://127.0.0.1:4321 |
| `npm run test:e2e` | Playwright e2e + axe-core accessibility scan against the built site (run `build` first) |
| `npm run check:links` | Every internal link, image and anchor in `dist/` must resolve (run `build` first) |
| `npm run check:external-links` | Polite check of outbound links in resource YAML, lessons and rendered pages |
| `npm run stale-resources` | Lists resources whose `verifiedOn` is older than 90 days |
| `npm run taxonomy:lock` | Adds new kata identifiers to `src/data/taxonomy-lock.json` (append-only; [docs/kata-taxonomy.md](docs/kata-taxonomy.md)) |

CI (`.gitlab-ci.yml`) is the gate of record. Pipelines run for merge requests and for `master`, including the
nightly schedule (02:00 UTC), which re-runs `master` so that date-filtered event lists stay current.

- **Blocking:** `check`, `test` and `build`, then `links` and `e2e`. `build` checks `CNAME` and `.nojekyll`, runs the
  published-name gate (`scripts/check-published-names.mjs`, #129), and fingerprints the Pagefind entry so later jobs
  can tell whether the index survived artifact transfer. `e2e` covers
  the routes, the nav, the 390 px reflow and axe WCAG 2.1 AA (zero serious/critical) in light and dark.
- **Blocking pathway jobs:** `bim_pathway`, `ux_pathway`, `agriculture_pathway`, `science_pathway`, `finance_pathway`, `manufacturing_pathway`, `media_pathway`, `education_pathway` and `health_pathway` rerun each
  pathway's script under `public/examples/<pathway>/tools/` and fail if any output differs from its committed
  `generated/` folder, so the results the kata pages show are what CI computed.
- **`catalog_lifecycle`** (MRs, `master` and the weekly link-check schedule): writes the catalog refresh list from
  `dist/catalog-lifecycle.json` ([docs/catalog-lifecycle.md](docs/catalog-lifecycle.md)); it fails only on a missing
  or malformed ledger.
- **`master` only:** `publish_github_pages` (the production release).
- **`demo` and `dev` only, once protected:** `pages` (demo.developerdojo.org) and `dev_pages`
  (dev.developerdojo.org, through the pages-only project `Curiosity-Corp/developerdojo-dev`). Both hosts are
  private. See [docs/preview-branches.md](docs/preview-branches.md) and
  [decision 0002](docs/decisions/0002-demo-and-dev-preview-branches.md).
- **Optional:**
  - `external_links`: weekly on a schedule with `LINK_CHECK=true`, and manual on MRs.
  - `stale_resources`: manual on `master`, for the quarterly refresh list.
  - `catalog_a11y_profile`: a manual diagnostic for #113; it never replaces `e2e`.
  - `event_initialization_profile`: a manual diagnostic on MRs and `master`
    ([docs/ci-event-initialization.md](docs/ci-event-initialization.md)).
- **Production e2e:** `e2e:production` runs alone when `PRODUCTION_E2E=true` (see below).

## Layout

```
src/
  components/    shared components (see below)
  layouts/BaseLayout.astro
  pages/         one file per route; library/[...slug].astro renders library entries
  content/       collections (src/content.config.ts, schemas in src/lib/schemas.ts):
    library/       lessons and program pages (*.md; track lessons in library/tracks/<track>/)
                   frontmatter: title, description, section, order, plus optional track, level, duration, ...
    tracks/        track overviews (<slug>.md)
    resources/     external learning resources (<publisher>/<resource>.yaml)
    arena/         Arena evidence records (<slug>.yaml; docs/arena-evidence.md)
    kata-recipes/  operational kata recipes (<slug>.yaml, rendered at /katas/<slug>; docs/kata-recipes.md)
  data/          events.json, challenges.json, certificates.json, taxonomy lock and moves, plus typed kata,
                 workshop, mission, sector-pack and assessment data (*.ts)
  lib/           nav, ranks, schemas, data loaders, image lookup, custom icons, kata catalog, taxonomy identifiers
  types/         ambient type declarations
  styles/        tokens.css (light + dark design tokens), global.css
public/          CNAME, .nojekyll, favicon, images/ (art goes here), offline/, templates/,
                 examples/ (downloads, and the BIM, UX, agriculture, science, finance, manufacturing, media and education pathways with their tools)
scripts/         build-search, link checkers, published-name gate, stale-resource list, serve-dist,
                 production e2e, wait-for-live-build, CI diagnostics
e2e/             Playwright tests      tests/   Vitest tests
docs/            handbook, style guide, content model, accessibility review, catalog lifecycle, ...
tools/imagery/   art generation scripts      templates/   learner-portfolio template
.gitlab/ci/      publish script and the GitHub Pages workflow template
.gitlab/         issue and merge request templates (including the Sensei contribution templates)
```

## Components

`src/lib/images.ts` `findImage()` resolves art by base name from `public/images/<name>.(avif|webp|jpg|jpeg|png|svg)`
at build time, so components show a CSS/SVG placeholder until the art exists. The slots in use are `hero-dojo` (with a
`-mobile` crop), `mountains-band` / `mountains-band-dark` and `og`. The Reveltek logo is referenced directly as
`reveltek-logo.svg` / `reveltek-logo-white.svg`.

`src/components/` holds about 55 components, for example `PageHero`, `SectionHeader`, `RankPath`, `IconCard`,
`FeatureGrid`, `EventList`, `ChallengeList`, `KataPreview`, `LessonQuiz`, `SearchDialog`, `ThemeToggle` and `Icon`.
Props are documented at the top of each file.

## Content rules

No invented events, people, numbers or testimonials; empty data files render an honest empty state.
No internal hostnames or infrastructure details on public pages. Reward amounts are not published.

## Publishing

`master` pipelines build the site and push `dist/` (with
`CNAME` and `.nojekyll`) plus `.github/workflows/pages.yml` to the GitHub `gh-pages` branch, which GitHub
Pages serves at https://developerdojo.org. Protected CI variables: `GITHUB_APP_ID`,
`GITHUB_APP_INSTALLATION_ID`, `GITHUB_APP_PRIVATE_KEY_B64`.

A green `publish_github_pages` job means the build is live, not only pushed: the job waits until
https://developerdojo.org/build.json reports its commit and pipeline (`scripts/wait-for-live-build.mjs`,
up to 20 minutes). When it times out, open the "Deploy static site to GitHub Pages" run for that
`gh-pages` commit on GitHub, use **Re-run failed jobs** (it re-runs only the `deploy` job, on the
artifact the `upload` job made), then retry the GitLab job. `curl https://developerdojo.org/build.json`
shows which build is live at any time.

### Checking the live site

Public traffic goes Cloudflare (proxied, edge certificate `CN=developerdojo.org`) to GitHub Pages. Two
things mislead a check from a fleet machine:

- **Ziti-enrolled hosts may not see the public site.** Their resolver sends all of `developerdojo.org` to
  the Ziti overlay (GitLab, Coder and other tools live under it). If the apex resolves to a `100.64.x.x`
  address you are looking at the internal ingress (`harbor-ca` certificate, 404), not the site. Check the
  public path explicitly:

  ```sh
  ip=$(dig +short @1.1.1.1 developerdojo.org | head -1)
  curl -sv --resolve "developerdojo.org:443:$ip" -o /dev/null -w '%{http_code}\n' \
    https://developerdojo.org/library/tracks/robot-software/ 2>&1 | grep -E 'subject:|issuer:|^[0-9]{3}$'
  ```

- **GitHub's Pages settings say `source: master`; that is expected.** The repository uses
  `build_type: workflow`, so the branch setting is ignored and `pages.yml` on `gh-pages` deploys. The
  real health signals are `/build.json` on the live site, the latest `publish_github_pages` job on
  GitLab and the "Deploy static site to GitHub Pages" run on GitHub
  (`gh api repos/Curiosity-Corp/developerdojo/actions/runs`).

### Production e2e

Job `e2e:production` (hypervoid/admiral#123) runs the read-only production subset of the Playwright suite against https://developerdojo.org at desktop and mobile width. The subset is `PRODUCTION_SPECS` in `playwright.config.ts`: routes, navigation, menus, and the landing page with its images and console. Setting `E2E_BASE_URL` points the suite at that URL and turns off the local server.

- Three pipeline schedules on master set `PRODUCTION_E2E=true` at 08:10, 14:10 and 20:10 UTC, after the 07:00, 13:00 and 19:00 ship windows. `bash scripts/ensure-production-e2e-schedules.sh` creates or updates them, and is safe to re-run. A production e2e pipeline runs that job and nothing else: no build, no publish. For a hand run, use **Run pipeline** on any branch with `PRODUCTION_E2E=true`.
- `scripts/production-e2e.mjs` first checks that the pod resolves the site to a public address, not the Ziti ingress described above. It then runs the suite and writes `production-e2e/note.md` with pass or fail and the full-page landing screenshot. When the masked CI variable `CURIOSITY_OVERVIEW_NOTE_TOKEN` is set (Azure Key Vault `omlab-secrets`: `curiosity-overview-note-token`), it also posts that note on Curiosity-Corp/overview#6. A red result is the unit's first job.

## License

See [LICENSE](LICENSE).
