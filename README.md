# Developer Dojo

Source of [developerdojo.org](https://developerdojo.org): a free training academy for the new kind of
developer, run by Curiosity Research Corporation and sponsored by Reveltek. A developer no longer mostly
types code; a developer owns a whole product and steers AI agents that do the building.

This repository is the source of truth (GitLab `Curiosity-Corp/developerdojo`, default branch `master`).
The GitHub copy only ever receives the **built** site on its `gh-pages` branch.

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
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve `dist/` on http://127.0.0.1:4321 |
| `npm run test:e2e` | Playwright smoke tests against the built site (run `build` first) |

CI is the gate of record: merge requests run check, test, build and e2e; `master` also publishes.

## Layout

```
src/
  components/    shared components (see below)
  layouts/BaseLayout.astro
  pages/         one file per route; library/[...slug].astro renders library entries
  content/library/*.md   frontmatter: title, description, section, order
  data/          events.json, challenges.json, certificates.json (typed in src/lib/schemas.ts)
  lib/           nav, ranks, schemas, data loaders, image lookup, custom icons
  styles/        tokens.css (light + dark design tokens), global.css
public/          CNAME, .nojekyll, favicon, images/ (art goes here)
e2e/             Playwright tests      tests/   Vitest tests
.gitlab/ci/      publish script and the GitHub Pages workflow template
```

## Components

Art slots resolve `public/images/<name>.(avif|webp|jpg|png|svg)` automatically:
`hero-dojo`, `mountains-band`, `reveltek-logo`, `og`. Until a file exists a CSS/SVG placeholder shows.
Every component also takes an explicit image prop.

`PageHero`, `SectionHeader`, `RankPath`, `IconCard`, `FeatureGrid`, `EventList`, `ChallengeList`,
`DarkPanel`, `NoteCard`, `Button`, `Icon`. Props are documented at the top of each file.

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
