# Developer Dojo

_Last verified: 2026-11-13._

Source of [developerdojo.org](https://developerdojo.org): a free training academy for the new kind of
developer, run by Curiosity Research Corporation and sponsored by Reveltek. A developer no longer mostly
types code; a developer owns a whole product and steers AI agents that do the building.

This repository is the source of truth (GitLab `Curiosity-Corp/developerdojo`, default branch `master`).
The GitHub copy only ever receives the **built** site on its `gh-pages` branch.

Running the site: [CONTRIBUTING.md](CONTRIBUTING.md) (how to change a page), [docs/handbook.md](docs/handbook.md) (maintainer handbook), [ROADMAP.md](ROADMAP.md) (what is next).

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

CI (`.gitlab-ci.yml`) is the gate of record. Pipelines run for merge requests and for `master`, including the
nightly schedule (02:00 UTC), which re-runs `master` so that date-filtered event lists stay current.

- **Blocking:** `check`, `test` and `build`, then `links` and `e2e`. `build` checks `CNAME` and `.nojekyll`, and it
  fingerprints the Pagefind entry so later jobs can tell whether the index survived artifact transfer. `e2e` covers
  the routes, the nav, the 390 px reflow and axe WCAG 2.1 AA (zero serious/critical) in light and dark.
- **`master` only:** `pages` (the internal GitLab Pages preview) and `publish_github_pages` (the production release).
- **Optional:**
  - `external_links`: weekly on a schedule with `LINK_CHECK=true`, and manual on MRs.
  - `stale_resources`: manual on `master`, for the quarterly refresh list.
  - `catalog_a11y_profile`: a manual diagnostic for #113; it never replaces `e2e`.

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
  data/          events.json, challenges.json, certificates.json, plus typed kata/workshop data (*.ts)
  lib/           nav, ranks, schemas, data loaders, image lookup, custom icons, kata catalog
  styles/        tokens.css (light + dark design tokens), global.css
public/          CNAME, .nojekyll, favicon, images/ (art goes here), offline/, examples/, templates/
scripts/         build-search, link checkers, stale-resource list, serve-dist, catalog a11y profile
e2e/             Playwright tests      tests/   Vitest tests
docs/            handbook, style guide, content model, accessibility review, catalog lifecycle, ...
tools/imagery/   art generation scripts      templates/   learner-portfolio template
.gitlab/ci/      publish script and the GitHub Pages workflow template
```

## Components

`src/lib/images.ts` `findImage()` resolves art by base name from `public/images/<name>.(avif|webp|jpg|jpeg|png|svg)`
at build time, so components show a CSS/SVG placeholder until the art exists. The slots in use are `hero-dojo` (with a
`-mobile` crop), `mountains-band` / `mountains-band-dark` and `og`. The Reveltek logo is referenced directly as
`reveltek-logo.svg` / `reveltek-logo-white.svg`.

`src/components/` holds about 45 components, for example `PageHero`, `SectionHeader`, `RankPath`, `IconCard`,
`FeatureGrid`, `EventList`, `ChallengeList`, `KataPreview`, `LessonQuiz`, `SearchDialog`, `ThemeToggle` and `Icon`.
Props are documented at the top of each file.

## Content rules

No invented events, people, numbers or testimonials; empty data files render an honest empty state.
No internal hostnames or infrastructure details on public pages. Reward amounts are not published.

## Publishing

`master` pipelines build the site, publish an internal GitLab Pages preview, and push `dist/` (with
`CNAME` and `.nojekyll`) plus `.github/workflows/pages.yml` to the GitHub `gh-pages` branch, which GitHub
Pages serves at https://developerdojo.org. Protected CI variables: `GITHUB_APP_ID`,
`GITHUB_APP_INSTALLATION_ID`, `GITHUB_APP_PRIVATE_KEY_B64`.

## License

See [LICENSE](LICENSE).
