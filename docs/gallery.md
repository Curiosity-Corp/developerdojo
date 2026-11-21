# The Gallery: record format and editing guide

`/gallery` (#87) shows finished artifacts that exist, each with its provenance, rights and a dated check,
and leads from the artifact to the kata that teaches it. Learners browse by outcome or by field.

| Piece | File |
| --- | --- |
| Records and outcome labels | `src/data/gallery.ts` |
| Schema, validation and browse groups (pure) | `src/lib/gallery.ts`, tested in `tests/gallery.test.ts` |
| Build-time loader | `src/lib/gallery-content.ts` |
| Page and card | `src/pages/gallery.astro`, `src/components/GalleryCard.astro` |
| Browser tests | `e2e/gallery.spec.ts` |

## What may appear

Only an artifact that exists and has been checked. There is no "unverified" or "coming soon" entry: the
schema has no such status and rejects unknown keys. An outcome or field without a verified example is not
hidden; the page lists it as **Planned**, with any practice that already teaches it.

Each entry is one of two forms:

- `native`: the actual file, served by the Dojo (a site path under `public/` or a page endpoint). It must be
  re-checked in CI (`verification.method: automated-check`) and link to the evidence (`evidenceHref`).
- `preview`: the artifact lives with its creator (an `https` link). The Dojo holds no copy, so it can only
  be `source-check`ed: a maintainer opened the artifact and its terms on the date. Say what was not rebuilt.

## The record

```ts
{
  id: 'pocket-garden-prototype',            // lower-case slug; the card's anchor on /gallery
  title: '...', summary: '...',
  form: 'native',                            // native | preview
  artifact: { format: 'Single-file HTML', files: [{ label: 'Open the prototype', href: '/examples/pocket-garden.html' }] },
  provenance: {
    creator: '...', madeWith: 'How it was made, including AI assistance and what was not recorded',
    source: 'Where it and its inputs come from', rights: 'Licence or terms in plain words',
    rightsHref: '/examples/pocket-garden-license.txt', created: '2026-11-06',
  },
  verification: {
    method: 'automated-check',               // automated-check | source-check
    date: '2026-11-20',                      // the day the check was actually done; never backdated
    checked: 'What the check covers', notChecked: 'What it does not show',
    evidenceHref: '/examples/fnd-001/results.json', nextCheck: '2027-02-20',
  },
  outcomeIds: ['design-journey'],            // each must be an outcome of the kata below
  fieldIds: ['ux', 'software'],              // every field it genuinely belongs to
  kataId: 'PRACTICE-003',                    // catalog kata, #86 recipe or a validated record without a page
  recipeUnavailable: { reason: '...', instead: { label: '...', href: '/katas/...' } },   // only when the kata has no page
  exercise: { title: '...', href: '/katas/first-prototype' },
}
```

The recipe link, QA evidence, belt criteria and foundations are not repeated in the entry. They come from
the linked kata's #81 metadata, so the gallery cannot drift from the kata. An empty list renders as "Not
recorded", never as passed.

## Rules the build enforces

`astro build` and `npx vitest run` both reject, listing every problem by entry:

- unknown keys, empty text, a missing check, or a `nextCheck` on or before the check date;
- a native artifact with an outside link or without CI evidence, or a preview that claims a CI check;
- unknown fields, outcomes or katas, an outcome the kata does not teach, or a fixture or withdrawn kata;
- `recipeUnavailable` on a kata that has a page, or missing on one that has none;
- a check dated after the build or before the artifact was created, a duplicate ID or a repeated field.

The test also checks that every site link resolves, that every outcome in the vocabulary has a label, and
that no internal host, issue link or source path reaches the page. A passed check is evidence only of what
`checked` says; `notChecked` is required so the limit is always on the page.

## Filters

The two browse lists are static HTML and work without JavaScript. The filter form appears only with
JavaScript. Outcome and field filters combine (both must match), and the field filter never hides an entry
whose kata is a foundation: a foundation serves every field. The shared foundations stay listed above the
artifacts whatever the filters. `/gallery?outcome=<id>&field=<id>` opens with those filters set.

## Checklist: add an entry

1. Confirm the artifact exists and you may show or link it. Record the creator, how it was made, the
   source and the terms.
2. Do the check, today, and write down what it covered and what it did not. For a native artifact, make
   sure a test re-checks it in CI.
3. Add the record to `galleryEntries`. Use an outcome of the linked kata, and every field it belongs to.
4. Run `npx vitest run tests/gallery.test.ts`. CI builds the site and runs `e2e/gallery.spec.ts`.
5. Re-check by `nextCheck`. A past date shows **Re-check overdue** on the card; re-check or remove it.
