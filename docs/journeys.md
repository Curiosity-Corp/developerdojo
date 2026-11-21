# Ignite Curiosity journeys

Optional journeys between Ignite Curiosity programs and Developer Dojo practice (#83). A journey takes one Ignite
Curiosity program and pairs each of its SPARK steps (Seek, Play, Apply, Research, Know) with Dojo tracks and katas.
It is published at `/journeys/<id>/`, with an index at `/journeys/`.

## Discovery and development: who owns what

| | Ignite Curiosity | Developer Dojo |
| --- | --- | --- |
| Purpose | Discovery: the SPARK Learning System (Seek, Play, Apply, Research, Know), clubs, challenges, coaches and mentors | Development: outcome-led tracks, katas, belts and mastery |
| Source of truth | The `gh-pages` branch of Curiosity-Corp/ignite-curiosity, served at ignitecuriosity.org | `master` of Curiosity-Corp/developerdojo, built by CI and published to developerdojo.org |
| Release owner | That repo's own MR, pipeline and ship window | This repo's MR, pipeline and ship window |
| Program identifiers | Its page URLs (`spark/robotics.html`, `spark/biotechnology.html`) | Kata IDs, kata routes and fields in the taxonomy lock (`src/data/taxonomy-lock.json`, #82), and track slugs (stable by [track-urls.md](track-urls.md)) |
| Personal data | Its own forms (contact, mentor sign-up through `contact.html?topic=...`) and its own privacy practices | None collected. Progress lives in the learner's browser ([storage](../src/lib/storage.ts)) |

There is **no shared catalog, feed, account system or database**. Each site keeps its own content. A journey stores
only a *versioned reference* to the Ignite side: the page URL and the day it was read (`ignite.checkedOn`). The
Dojo side is named only by stable identifiers, so a journey can never point at a renamed or retired page without
the build failing.

## How the build checks a journey

`src/data/ignite-journeys.ts` holds the journeys. `src/lib/journeys.ts` validates and resolves them;
`src/lib/journey-content.ts` runs that check during the build, after the taxonomy stability check.

| Rule | Enforced by | Tested in |
| --- | --- | --- |
| A kata ID or kata route is in the taxonomy lock, still live, and has a page | `checkJourneys` | `tests/journeys.test.ts` |
| A moved identifier is reported with its new value; a retired one is rejected | `checkJourneys` with the moves ledger | `tests/journeys.test.ts` |
| Each field ID is locked and live | `checkJourneys` | `tests/journeys.test.ts` |
| A track slug has a track file | `checkJourneys` | `tests/journeys.test.ts` |
| An anchor (`/katas/industry-workshops#robotics`) exists on the built page | `scripts/check-links.mjs` | the `links` CI job |
| The steps follow the SPARK order | `journeySchema` | `tests/journeys.test.ts` |
| The Ignite link is an `https://ignitecuriosity.org/` page with no query or fragment | `journeySchema` | `tests/journeys.test.ts`, `e2e/journeys.spec.ts` |
| Each core focus has a journey whose links back match the core-focus tracks | `tests/journeys.test.ts` | same |
| The journey pages save nothing, set no cookie and call no other host | the page code; no writer exists | `tests/journeys.test.ts`, `e2e/journeys.spec.ts` |

## Privacy and youth

Ignite Curiosity describes itself as a learning community for students of all ages, so a learner arriving from it
may be young. The journey pages therefore:

- need no account, sign-up, name, age or email, and require nothing to be finished on the other site;
- read on-device lesson progress (`dojo:lessons`) and never write: following a journey changes nothing on the device;
- link to Ignite Curiosity with `rel="noopener noreferrer"` and `referrerpolicy="no-referrer"`, and with no query
  string, so nothing identifies the visitor or where they came from;
- make no outside request (checked in the browser by `e2e/journeys.spec.ts`).

**Referral measurement: unavailable.** The Dojo has no analytics and counts no visits to or from Ignite Curiosity.
Adding any referral count is a separate design with its own consent and privacy review; it must not share identity
or progress.

Ignite Curiosity's own pages, forms and any measurement on them are its responsibility. On 2026-11-21 its robotics
and biotechnology pages loaded a Google Analytics tag; that is recorded for Ignite's own review, not changed here.

## The journeys and their verification

| Journey | Ignite program page | Dojo to Ignite | Ignite to Dojo (read 2026-11-21) |
| --- | --- | --- | --- |
| `/journeys/robotics/` | `spark/robotics.html`, robotics club path | the journey's source link | the page links `/library/tracks/robot-software/` and `/library/tracks/robot-learning/` |
| `/journeys/biotechnology/` | `spark/biotechnology.html`, biodesign challenge path | the journey's source link | the page links `/library/tracks/bioinformatics/` and `/library/tracks/lab-automation-in-code/` |

Both Ignite pages say the path is an offering being prepared; the journey pages say so too. Direct entry works in
both directions: every Dojo track and kata opens on its own, and the Ignite pages need nothing from the Dojo.

The Ignite pages do not yet link to the journey pages themselves. That reciprocal change belongs to Ignite
Curiosity and its own review; the exact proposal is on ignite-curiosity#23. A Dojo link alone does not complete the
journey in that direction.

## PILOT audit (no bridge assigned)

Ignite Curiosity's PILOT agentic product-management track (`pilot/`, 11 pages: an index and 10 courses in five
pillars: product sense, iteration, launch experience, orchestration, tooling) was read on 2026-11-21. It links to no
Dojo page. Its topics overlap the Dojo's product-discovery, agile-delivery, roadmapping-and-epics,
personas-and-journeys, git-and-gitlab and working-with-ai-agents tracks. PILOT is owned by Ignite Curiosity. No
bridge ownership is assigned here: a PILOT journey would follow this contract and needs Ignite's review first.

## Adding or changing a journey

1. Read the Ignite program page on the day. Paraphrase each SPARK step; do not copy claims the page does not make.
2. Add the journey to `src/data/ignite-journeys.ts`, naming Dojo pages only by kata ID, kata route, field ID or
   track slug. Set `ignite.checkedOn` and `ignite.linksToTracks` from what the page shows.
3. Add the new ID to `PUBLISHED` in `tests/journeys.test.ts`. A journey ID is a public URL: never rename one.
4. Propose the Ignite-side link on that site's own issue, with the exact change, instead of editing its repo.
