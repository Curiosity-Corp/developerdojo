# Content model

The technical contract for lessons, tracks and resources. The step by step editing guide is in
[CONTRIBUTING.md](../CONTRIBUTING.md); the writing rules are in [style-guide.md](style-guide.md).

The schemas live in `src/lib/schemas.ts` and the collections in `src/content.config.ts`.
Tests (`npm test`) and the build both check every file, and say which file is wrong.

## Lessons

Files: any `.md` file under `src/content/library`.

```yaml
title: "..."               # required
description: "one or two sentences"   # required
section: "..."             # required, the group on /library
order: 3                   # required, whole number, ascending inside a section
track: "product-discovery" # optional, a track slug (a file in src/content/tracks)
level: "foundation"        # optional: foundation | core | advanced
duration: "45 min"         # optional, honest estimate of reading plus exercise time
outcomes:                  # optional, what the learner can do afterwards
  - "..."
resources:                 # optional, resource ids, shown as "Further learning"
  - "anthropic/prompt-engineering-interactive-tutorial"
prerequisites:             # optional, library page ids (the file path without .md)
  - "week-1-see-the-whole-product"
updated: 2026-11-03        # optional
tool: "checklist"          # optional: self-assessment-track-a | checklist (see "Interactive tools" below)
quiz:                      # optional: 3 to 5 multiple-choice questions, shown at the end of the lesson
  - question: "..."
    options: ["...", "...", "..."]   # 2 to 5, all different
    answer: "..."          # copied exactly from options
    why: "one line, from the lesson's own text"
fillable: "template-8-change-record"   # optional, template pages only: the download in public/templates (no .md)
```

Track lessons live in `src/content/library/tracks/<track-slug>/<NN>-<lesson-slug>.md`.
The URL is `/library/tracks/<track-slug>/<NN>-<lesson-slug>/`. `section` is the track title and
`track` is the track slug. A lesson in a track folder with the wrong `track` fails the build.

## Interactive tools

The tools run in the browser only. They save on the learner's own device (`localStorage`, keys start with
`dojo:`), send nothing anywhere, and every page reads correctly with JavaScript off. The shared helper is
`src/lib/storage.ts` (versioned values, export, clear, and a memory fallback when storage is blocked).

| Tool | Where it shows | What the author does |
| --- | --- | --- |
| Tickable checklists | Every lesson that has a Markdown task list (`- [ ] item`) | Nothing. Ticks are saved per item. Keep an item's text stable: the saved tick is tied to the heading and the text |
| Checklist progress panel | Pages with `tool: checklist` | Add the line to the frontmatter (the two weekly checklists have it) |
| Track A self-assessment | The page with `tool: self-assessment-track-a` | The level sentences live in `src/lib/self-assessment.ts` as well as on the page. `npm test` fails if they differ, so change both |
| Lesson done toggle | Every lesson in a track | Nothing. The track overview shows "n of m lessons done" |
| Knowledge check | Lessons with `quiz` | Write 3 to 5 questions strictly from the lesson's own text (the correct answer must be in the lesson, with a one-line reason). It is a `<details>` block, so it works without JavaScript. Nothing about it is saved. Only three lessons have one for now |
| Fillable template | Template pages with `fillable` | Name the download in `public/templates`. The form is built from that Markdown file (tables, ticks, numbered questions), so edit the download and the form follows. The draft is saved on the device as `draft:<page id>` |

Every tool says in the page that it is self-assessment, not a grade or a certificate, and that nothing leaves the device.

How the form is built from a download (`src/lib/template-form.ts`): a table whose first column has a label in every row
becomes one field per row; a table with empty first cells becomes free rows (the learner can add rows); a "Your answer"
or "My answer" column, or a column that is empty in every row, is where the learner writes; other columns stay as hints.
`☐` lines become tick boxes and numbered lists become questions. The "Cover" and "How to fill" sections and the computed
"Roadmap grid" are left out of the form. A missing download fails the build.

## Tracks

Files: `src/content/tracks/<slug>.md`.

```yaml
title: "Product discovery"
description: "..."
group: "product"           # product | ai | engineering | frameworks
order: 1
icon: "search"             # a lucide icon name (https://lucide.dev/icons)
level: "foundation"        # foundation | core | advanced
skills: [product-discovery]
outcomes: ["...", "..."]
```

The body is the track overview. The page is `/library/tracks/<slug>/` and lists the track's lessons in `order`.

## Resources

Files: `src/content/resources/<publisher>/<resource>.yaml`. The id is the path without `.yaml`: `anthropic/prompt-engineering-interactive-tutorial`.

```yaml
title: "Exact title as the publisher shows it"
provider: "Anthropic"
url: "https://..."         # https only
cost: "free"               # free | free-audit | free-tier | paid
format: "course"           # course | video | docs | tutorial | interactive | book | article | certification | podcast
level: "beginner"          # beginner | intermediate | advanced
duration: "about 2 hours"  # optional, only if the publisher states it
skills: [prompt-engineering, ai-agents]
summary: "2 to 4 sentences: what it covers and why a Dojo learner should take it."
verifiedOn: 2026-11-03     # the day someone opened the link and it worked
```

Allowed `skills` values: product-discovery, personas-journeys, roadmapping-epics, agile-delivery,
stakeholder-communication, brand-web-design, ai-agents, prompt-engineering, ai-evaluation, git-gitlab,
ci-cd, cloud-platforms, kubernetes-gitops, infrastructure-as-code, security, observability-reliability,
itsm-service-management, open-source, data-analytics, communication-writing, career-portfolio.

## What fails the build

| Problem | Message starts with |
| --- | --- |
| A lesson names a `track` with no file in `src/content/tracks` | `track "x" does not exist` |
| A lesson lists a resource id with no yaml file | `resource "x/y" does not exist` |
| A lesson in `tracks/<slug>/` has a different or missing `track` | `this lesson is in the folder tracks/<slug>/` |
| A lesson's `fillable` names a download that does not exist | `fillable "x" does not exist` |
| A `quiz` answer that is not one of its options, repeated options, fewer than 3 or more than 5 questions | the schema error names the file and field |
| Two resource files point at the same URL | `same URL as ...` |
| A value outside the allowed lists (cost, format, level, skills, group) | the schema error names the file and field |

A prerequisite that is not a page yet is a warning in the build log, not a failure; the link is left out until the page exists.
