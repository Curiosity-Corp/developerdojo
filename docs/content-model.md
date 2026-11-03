# Content model

The technical contract for lessons, tracks and resources. The step by step editing guide is in
[CONTRIBUTING.md](../CONTRIBUTING.md); the writing rules are in [style-guide.md](style-guide.md).

The schemas live in `src/lib/schemas.ts` and the collections in `src/content.config.ts`.
Tests (`npm test`) and the build both check every file, and say which file is wrong.

## Lessons: `src/content/library/**/*.md`

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
```

Track lessons live in `src/content/library/tracks/<track-slug>/<NN>-<lesson-slug>.md`.
The URL is `/library/tracks/<track-slug>/<NN>-<lesson-slug>/`. `section` is the track title and
`track` is the track slug. A lesson in a track folder with the wrong `track` fails the build.

## Tracks: `src/content/tracks/<slug>.md`

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

## Resources: `src/content/resources/<publisher>/<resource>.yaml`

The id is the path without `.yaml`: `anthropic/prompt-engineering-interactive-tutorial`.

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
| Two resource files point at the same URL | `same URL as ...` |
| A value outside the allowed lists (cost, format, level, skills, group) | the schema error names the file and field |

A prerequisite that is not a page yet is a warning in the build log, not a failure; the link is left out until the page exists.
