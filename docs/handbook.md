# Maintainer handbook

How to run developerdojo.org from day to day. Written for the person who looks after the site, who is not
expected to be a developer. Every recurring job has numbered steps.

Five other documents work together with this one:

| Document | Use it for |
| --- | --- |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | The step by step guide to changing a page, adding a lesson, a resource or a track in the Web IDE |
| [docs/style-guide.md](style-guide.md) | How to write: plain words, honesty rules, how to check a link |
| [docs/content-model.md](content-model.md) | The exact fields of lessons, tracks and resources |
| [ROADMAP.md](../ROADMAP.md) | What is done, what is next, how to propose new work |
| [docs/source-map.md](source-map.md) | Where the Curiosity learning material really lives, what is reusable and what must never be published |

Contents: [1 What the site is](#1-what-the-site-is) · [2 How it is built and published](#2-how-the-site-is-built-and-published)
· [3 Where the source material lives](#3-where-the-source-material-lives) · [4 The positioning](#4-the-positioning-what-every-page-must-serve)
· [5 Labels, board and epics](#5-labels-board-and-epics) · [6 Weekly link check](#6-the-weekly-link-check)
· [7 Monthly review](#7-the-monthly-review) · [8 Quarterly and half-yearly jobs](#8-quarterly-and-half-yearly-jobs)
· [9 A red pipeline](#9-what-to-do-when-a-pipeline-is-red) · [10 Hand a content issue to an AI agent](#10-hand-a-content-issue-to-an-ai-agent-safely)
· [11 What never to publish](#11-what-never-to-publish) · [12 Who to ask](#12-who-to-ask-and-when)
· [13 Add, change or remove an event](#13-add-change-or-remove-an-event)

## 1. What the site is

developerdojo.org is a **free** training academy run by Curiosity Research Corporation (CRC) and sponsored by
Reveltek. It trains a new kind of developer: someone who owns a whole product and steers AI agents that do
the building. It is a *static* site: pages are made once, when the site is built, and then served as plain
files. There is no database, no login, no server code. That is why it is cheap, fast and safe, and why every
change goes through a merge request.

Facts that must stay true in every sentence we publish:

- CRC's 501(c)(3) application is **pending**. Never write "approved", "tax-exempt" or "accredited".
- No made-up people, events, dates, numbers, testimonials or courses.
- No money promises. Sensei rewards show points and tiers only; "rewards are being finalised".

## 2. How the site is built and published

The source of truth is the GitLab project **Curiosity-Corp/developerdojo**, branch `master`. Everything goes
from there to the public in this order:

1. **You change files** on a branch in GitLab (usually in the Web IDE) and open a **merge request** (MR).
2. **GitLab CI runs the pipeline** on the MR: `check`, `test`, `build`, `links`, `e2e` (see
   [CONTRIBUTING.md](../CONTRIBUTING.md#reading-the-pipeline)). Green means the site builds, the links inside
   it work and it passes the accessibility scan. The pipeline is the gate: nothing is merged on red.
3. **You press Merge** (the button may say **Add to merge train**). The project uses **merged results
   pipelines** and a **merge train** (Settings > Merge requests, both on since 2026-11-04, #65): every
   MR pipeline tests the MR merged with the current `master`, and MRs that are ready at the same time
   are tested in a line, each on top of the ones before it. An MR merges only if that combined result is
   green, so two MRs that pass alone but clash together cannot break `master`. "Skip the train" is
   switched off. The MR then goes into `master` and a new pipeline starts on `master`.
4. **The `master` pipeline builds the site again** and runs the same checks, then two deploy jobs run:
   `pages` (an internal preview) and `publish_github_pages`.
5. **`publish_github_pages` copies the BUILT site only** (never the source files) to the `gh-pages` branch of
   the GitHub repository `Curiosity-Corp/developerdojo`. Nobody pushes source code to GitHub.
6. **GitHub Pages serves that branch** at the custom domain **developerdojo.org**, and **Cloudflare** sits in
   front of it for the domain name and traffic. Day to day you never touch Cloudflare or GitHub.
7. **A nightly pipeline** runs on `master` at about 02:00 UTC, so lists that depend on today's date (events)
   stay current without anyone changing a file.

Time from Merge to live: usually 10 to 15 minutes. If the page still shows old text, do a hard refresh
(`Ctrl+Shift+R`, on a Mac `Cmd+Shift+R`) and wait five more minutes before worrying.

What you will see in GitLab:

| Where | What it is |
| --- | --- |
| **Code > Merge requests** | Open changes waiting for review or a green pipeline |
| **Build > Pipelines** | Every pipeline. The label "Scheduled" marks the nightly and weekly ones |
| **Build > Pipeline schedules** | The two timers: nightly rebuild, weekly link check |
| **Plan > Issue boards > Website** | The board (see section 5) |
| **Manage > Members** | Who can do what in the project |

The publishing needs secret keys that live in protected CI settings. **Never copy, paste or print them**
anywhere (an issue, a chat, a lesson, an AI prompt). If one is ever exposed, tell a project Owner
immediately (section 12).

Roles that matter: **Developer** can open MRs, **Maintainer** can also merge to `master`, change settings and
schedules, **Owner** can do everything including members. `master` is protected: only Maintainers can merge.
That is on purpose, and it is also what keeps an AI agent working at Developer level from merging by itself.

## 3. Where the source material lives

Do not copy text from these places without checking the rules in section 11.

| Material | Where | Notes |
| --- | --- | --- |
| The Master Developer program: program guide, teaching deck with speaker notes, rubric and weekly checklist, learning path, worked example (DanHup), catalogue guide, eight blank workbooks | The program SharePoint folder: **NinjaHive > Shared Documents > General > Developer Dojo - Master Developer Program** | Two one-page overviews there are marked "internal draft": do not publish them as they are |
| Frameworks: UBF, STAR, SHIFT, ORBITAL, ANDROID Ops, DROID Ops, Launch Sequence, Mission Control | GitLab / GitHub project **WorldEnterpriseGroup/dot-github**, branch `gh-pages`: `Frameworks/`, `Frameworks/Short/`, `Frameworks/More Info/`, `supernova.md`, `research/` | The texts are business-strategy writing. We rewrite them in plain words for developers. Two files are never public (section 11) |
| PHANTOMS, the family of starting stacks | **Curiosity-Corp/phantoms** (public mirror on GitHub) | PHANTOMS is a family, not one fixed stack; teach the pattern. Internal variants are described, not linked |
| Curiosity learning guides and coaching material | **Curiosity-Corp** group; index in Curiosity-Corp/overview `REPOSITORY-INDEX.md` | On 2026-11-03 several guide repositories held only a title. Read the [source map](source-map.md) before planning work from them |
| This site's own content | This repository: `src/content/library`, `src/content/tracks`, `src/content/resources`, `src/data` | Folder map in [CONTRIBUTING.md](../CONTRIBUTING.md#where-things-live) |

## 4. The positioning: what every page must serve

Developer Dojo trains **the 2030 Product Development Manager**: not a person who types most of the code, but
a person who blends strategy, product, design, brand and marketing, finance, operations, security and
engineering, and who uses AI agents as the workforce for lower-level work (code, tests, docs, research drafts,
routine operations). The human decides what to build and why, writes the specification and acceptance
criteria, owns the epics and roadmap, judges the agents' work, manages risk and ships to real users.

Skill with agents is a ladder. Every lesson should say where it sits:

1. **Use** one agent for a task.
2. **Delegate** whole tasks with a written brief.
3. **Orchestrate** many agent sessions in a command chain.
4. **Govern** them with written policy, hooks and gates (pipelines, merge trains, protected branches).

When you review any lesson, ask the four questions. If a lesson does not answer them, send it back:

1. What does the Product Development Manager **decide** here?
2. What do they **delegate** to agents (the exact brief)?
3. How do they **verify** the result?
4. Which **other disciplines** are involved?

The Dojo rules also never change: people write epics and roadmaps (AI never does); git is the source of
truth; open source first; fix forward; disclose AI use.

## 5. Labels, board and epics

### Labels

Every issue carries one label from each of three families, plus an optional extra.

| Family | Words | Meaning |
| --- | --- | --- |
| `type::` | `content`, `docs`, `feature`, `bug`, `maintenance` | What kind of work |
| `area::` | `program`, `tracks`, `resources`, `frameworks`, `orchestration`, `platform`, `interactive`, `handover` | Which part of the site |
| `status::` | `ready`, `in-progress`, `needs-review`, `blocked` | Where it is right now |
| extra | `good-first-edit` | Small and safe for a first change |
| extra | `link-rot` | A dead outside link |

An issue has exactly one `status::` label at a time. The issue templates add the right labels for you.

### The board "Website"

Open **Plan > Issue boards** and pick **Website**. The columns are the four `status::` labels, left to right:
`status::ready` (can be picked up), `status::in-progress` (someone is on it), `status::needs-review` (an MR is
open and waits for a person to read it), `status::blocked` (waiting for a decision or something else).
Issues with no status label show in the **Open** column: give them one. Closed issues show in **Closed**.

**Move an issue:** drag the card to the next column. GitLab swaps the `status::` label for you.

### The working routine for one issue

1. Open **Plan > Issues** (or the board) and choose an issue in `status::ready`. Read all of it.
2. Assign it to yourself. Drag it to `status::in-progress`.
3. Do the work following [CONTRIBUTING.md](../CONTRIBUTING.md). Put `Closes #<number>` in the MR description.
   The MR template fills in the checklist.
4. When the MR is open, drag the issue to `status::needs-review`.
5. When the pipeline is green and a person has read the change, press **Merge** (or **Add to merge
   train**). If the MR drops out of the train, its combined result with `master` failed: read the red
   job and fix forward on the branch. Never turn the merge train or merged results pipelines off to
   get one MR through.
6. After the `publish_github_pages` job is green, open the page on developerdojo.org. The `Closes` line
   closes the issue. If it did not, close it.
7. File every idea that came up as a new issue (use a template) with `status::ready`.

To start a new issue: **Plan > Issues > New issue**, then pick a template in the **Choose a template** list:
New lesson, New track, New resource, Content fix, Bug, Link rot. Fill in the square brackets.

### Epics and milestones

- A **milestone** is a delivery date and a bucket of issues (project: **Plan > Milestones**).
- An **epic** is a big theme that groups issues. Epics live in the group **Curiosity-Corp** (group page >
  **Plan > Epics**). The parent epic **&1** holds the whole v2 plan; each child epic (&2 and up) has one milestone
  and a list of its issues. The epic **Backlog after v2** holds the issues that are ready to pick.
- People write epics: if you add a new theme, write the epic yourself, add its issues, and add it under &1.
- To add an issue to an epic: open the issue, in the right side bar find **Epic**, choose it.
- Keep [ROADMAP.md](../ROADMAP.md) up to date once a month (section 7).

## 6. The weekly link check

Free courses move and disappear. A robot checks every outside link every week.

- **What runs:** a scheduled pipeline, **Weekly external link check**, on Mondays at about 03:00 UTC. Its job
  `external_links` runs `scripts/check-external-links.mjs`: it opens every `url` in `src/content/resources` and
  every outside link in lessons and tracks. YouTube links are checked through YouTube's own lookup service.
- **Unverified is not broken.** Some sites (for example Coursera, LinkedIn, Credly, edX) refuse robots. They are
  listed as *unverified* and do not fail the run. Open those by hand when you do the quarterly refresh.
- **The report** is a file `link-check-report.md` attached to the job for 90 days. If a link is broken the job
  turns red. If everything is fine the job is green and you do nothing.

Steps, every Monday morning (five minutes):

1. Open **Build > Pipelines**. Find the newest pipeline with the label **Scheduled** whose name mentions the
   external link check (or open **Build > Pipeline schedules** and click the last pipeline of **Weekly external
   link check**).
2. Green job `external_links`? Done.
3. Red job? Open it, click **Browse** on the right (the artifacts), open `link-check-report.md`.
4. Create one issue **Plan > Issues > New issue > Link rot** and paste the broken links into its table.
5. For each broken link, open it yourself in a private browser window.
   - It opens and is the right thing: the robot was wrong; note "works" and move on.
   - It moved: find the new address on the publisher's own site, change `url` and `verifiedOn` in the resource
     file (Web IDE, see [CONTRIBUTING.md](../CONTRIBUTING.md#add-a-free-resource)).
   - It is gone: find a replacement from the same publisher or an equal one; add it as a new resource and
     swap the id in the lessons. No replacement: delete the resource file and remove its id from every
     lesson that lists it (the `test` job tells you where it is still used).
6. One MR for all fixes, `Closes` the link-rot issue.
7. To check again straight away: **Build > Pipeline schedules > Weekly external link check > Play**.

If the schedule shows as inactive, or its owner left the project, open it and press **Take ownership**
(a Maintainer can). A schedule runs as its owner; without an owner it stops.

## 7. The monthly review

First Monday of the month, about one hour. Put it in your calendar.

1. **Schedules are alive.** In **Build > Pipeline schedules** confirm the nightly rebuild and the weekly link
   check both ran in the last week and are green.
2. **Board is true.** Open the board. Nothing sits in `status::in-progress` that nobody is working on; an
   issue waiting for a decision moves to `status::blocked` with a comment saying what it waits for.
3. **Resources.** Open the Web IDE and use search (`Ctrl+Shift+F`). Search for the text `verifiedOn: ` followed
   by the oldest year and month you can find (for example `verifiedOn: 2026-11`, then earlier months if they
   exist). Take ten files with the oldest dates. For each: open the link, check the title, cost and level are
   still true, then set `verifiedOn` to today. Retire anything dead.
4. **Events and challenges.** Open `/events/` and `/challenges/` on the live site. Past events must not show as
   upcoming. Never add an event without a confirmed date from CRC (steps in [section 13](#13-add-change-or-remove-an-event)).
5. **Read three pages** from different tracks as a visitor, on a phone. Anything confusing: a `Content fix`
   issue.
6. **Update [ROADMAP.md](../ROADMAP.md).** Move finished items to Done, set the status of each epic, add
   what is next. Edit it in the Web IDE like any page.
7. **Fill the queue.** The board should always have at least five issues in `status::ready`. If it has fewer,
   pick ideas from the Backlog epic or write new issues from the templates.
8. **Look at the AI log.** Every merged MR from the month says whether AI helped. If one does not say, ask.

## 8. Quarterly and half-yearly jobs

- **Quarterly resource refresh.** Open every resource whose `verifiedOn` is older than 90 days: confirm the link,
  title, cost, level and summary; look at the publisher's learning page for a newer official course on the same
  topic; retire what is outdated. Also open the *unverified* sites from section 6 by hand. (There is a backlog
  issue to add a script that lists stale resources.)
- **Half-yearly accessibility pass.** Test ten pages with keyboard only, a screen reader and a phone at 200 percent
  zoom (backlog issue).
- **Yearly:** re-read the honesty rules (section 1 and 11) against the whole site, and check that CRC's status
  wording is still correct.

## 9. What to do when a pipeline is red

A red pipeline is information, not a disaster. Rules: **read the log, fix forward, never revert.** If a merged
change turned `master` red, write a new small MR that fixes it. Do not undo the earlier change.

Steps:

1. Open the pipeline (MR page, **Pipeline** box, or **Build > Pipelines**). Find the red job.
2. Open the red job and scroll to the bottom of the log. Look for the first line with `Error`,
   `Content check failed`, `broken link` or the name of your file.
3. **Look it up** in the table [When the pipeline is red](../CONTRIBUTING.md#when-the-pipeline-is-red) in
   CONTRIBUTING.md. It covers the common messages with the exact fix.
4. Fix it in the same branch (Web IDE, branch picker top left). The pipeline starts again by itself.
5. **Is it a temporary server problem?** Signs: the log says `500 Internal Server Error` or "could not
   resolve host" while fetching, uploading or downloading, or a test run says all tests passed but the job still
   failed on uploading its files. This is a temporary problem with the git server, not with your change.
   **Press Retry on the job.** If it fails the same way after two retries, wait ten minutes and retry once more.
   Still failing: ask (section 12) with the job link.
6. **Red only on `publish_github_pages`** (the build and tests are green): press Retry. If it fails again
   the problem is the publishing credentials or GitHub, not the content. Do not change files. Ask a project
   Owner with the job link. The site stays up: visitors see the last published version.
7. **Red on a scheduled pipeline** is the weekly link check (section 6). It is not a broken site.
8. **Two jobs red at once, and fixing one breaks the other:** do not undo anything. Ask a developer to ship
   one combined fix in one MR.
9. Once green, merge. After a `master` pipeline, confirm the page is live.

Never "fix" a red job by deleting a test, loosening a check, or merging while it is red.

## 10. Hand a content issue to an AI agent safely

AI agents are good at the first draft of a lesson, a list of resources or a table. They invent things
(links, course names, numbers, quotes) and do not know what is private. So **the issue is the brief, a person
reads every changed file, and nothing merges without that review.**

Before you hand it over:

1. **Pick a well-written issue.** It must have Why, What to do, Source material, Acceptance criteria and How
   to check it. A vague issue gives a vague result. If it is vague, fix the issue first.
2. **Check the sources are safe.** Everything the agent may read must be allowed (section 11). Remove or
   mark anything that is internal.
3. **Give the agent its own limited access.** Not your own login. A GitLab account (or token) with the
   **Developer** role on this project only. Developers cannot merge to `master`; only you can.

The hand-over, step by step:

4. Set the issue to `status::in-progress` and assign it.
5. Give the agent the brief. You can paste this and add the issue text under it:

   > You are working on one GitLab issue for developerdojo.org. The issue below is your whole brief.
   > Read `CONTRIBUTING.md`, `docs/style-guide.md` and `docs/content-model.md` first.
   > Work on a new branch. Never push to `master`. Only change files that the issue names or implies.
   > Write plain words for readers who may read English as a second language. Do not invent facts, names,
   > numbers, quotes, events, courses or links: open every link and use titles exactly as the publisher shows
   > them. Do not publish anything marked internal. Open the result as a **Draft** merge request with the
   > `Agent_draft` template, quote each acceptance criterion with the file that meets it, list what you could
   > not verify, and say that AI was used. Then stop. Do not mark it ready and do not merge.
   >
   > [paste the whole issue here]

6. The agent opens a **Draft** MR. Move the issue to `status::needs-review`.

Review, every time, before you press **Mark as ready**:

7. **Read every changed file** (MR **Changes** tab), not only the agent's summary.
8. **Facts:** are the names, numbers and dates real? Can you open the source? Delete anything you cannot verify.
9. **Links:** open every outside link. The title and publisher must match.
10. **Privacy check:** go through section 11 line by line against the changed files. Search the changed files for
    `.svc`, `.local`, `10.`, `192.168`, `password`, `token`, `key`, internal hostnames and the names of real staff.
11. **People write epics and roadmaps.** If the agent wrote an epic or a roadmap and presents it as a
    learner's work, remove it.
12. **Pipeline fully green**, then tick the **Human review** boxes in the MR description yourself.
13. **Mark as ready**, then **Merge**. Check the live page after publishing.
14. If the draft is poor, write what is wrong as comments on the MR, and give it back to the agent. After two
    rounds, rewrite the issue instead.

AI use is always disclosed: in the MR description, and wherever a lesson says an agent drafted something.

## 11. What never to publish

Not on the site, not in an issue that could be copied to the site, not in a lesson, not in an example.

- Passwords, keys, tokens, anything from the protected CI settings, anything that grants access.
- Internal server names, addresses, cluster or network details, internal repository paths and URLs,
  service accounts, the layout of our own servers. Describe the idea instead.
- Real staff, learners, mentors, partners or customers: names, photos, emails, phone numbers, locations,
  stories. Use clearly fictional people (TrailMug and similar).
- Visa, work-permit or immigration guidance, and anything from the Quest adapters folder
  (`Curiosity-Corp/quest`, `adapters/**`). In the frameworks source (`WorldEnterpriseGroup/dot-github`) never
  publish `training.md` and never publish `research/Mission Control Training Program Itinerary.md`.
- The internal draft overviews in the program folder, until they are rewritten and approved.
- The verbatim internal policy files, tool configurations or settings of our own agent operation. The
  orchestration lessons teach the **shape and philosophy**, not the internals.
- Money: no dollar amounts or cash promises for Sensei rewards; no promise of jobs, pay or certificates.
- Claims about CRC: never "approved", "tax-exempt" or "accredited" (the 501(c)(3) application is pending).
- Made-up things: events, dates, viewer counts, testimonials, statistics, courses, course durations, prices.
  If you cannot open it, do not write it.
- Pictures, text or video you do not have the right to use.

When unsure: leave it out and ask (section 12). A missing paragraph costs nothing; a leaked one cannot be
taken back.

## 12. Who to ask and when

| Situation | Who | What to send |
| --- | --- | --- |
| A pipeline stays red after the steps in section 9 | A project Owner (**Manage > Members**, role Owner) | The MR link and the red job link |
| `publish_github_pages` fails twice, or the live site looks wrong while GitLab is green | A project Owner | The job link; what you see on the live page |
| A secret, password or private document was committed or published | A project Owner, **right away**, by phone if possible | What it was and where; do not delete it quietly, do not paste it again |
| A fact, a program rule or a program document is unclear | The program owner at CRC | The page link and the question |
| A rule from this handbook seems wrong | Open an issue (`type::docs`) with the page and your question; fix the handbook in the same MR once decided | |

Anything confusing in this handbook or in [CONTRIBUTING.md](../CONTRIBUTING.md) is a bug in the guide, not in
you. Open a `Content fix` issue, or fix the guide in your next MR.

## 13. Add, change or remove an event

Events live in one file: `src/data/events.json`. It is a list, and **it is empty on purpose**: the Events page
says "Schedule announced soon" until a real session exists. The site builds the list, the calendar view, a
calendar file (`.ics`) for each session and, if you ask for one, a detail page. You never write HTML.

**The rule:** add an event only when CRC has confirmed the date, the time and the timezone, in writing. Never add
a placeholder, a "maybe" date, a practice event or a copy of the example below. If any part is unknown, leave the
event out. The checks in the pipeline cannot tell a real event from an invented one, so this is your job.

### The fields

An event is one `{ ... }` block in the list. Every name is written exactly as shown, in lower case and
camel case, in double quotes. A misspelled name makes the pipeline fail on purpose.

| Field | Required | What to write |
| --- | --- | --- |
| `id` | Yes | A short name for the web address: lowercase words joined by hyphens. It becomes `/events/<id>/` and `<id>.ics`. Never change it after publishing, because links use it. Each `id` is used once. |
| `title` | Yes | The name people see, in plain words. |
| `description` | Yes | One or two sentences: what happens and who it is for. |
| `start` | Yes | Date and time with the offset from UTC, as `2027-02-07T15:00:00+08:00` (year-month-day, `T`, hours:minutes:seconds, offset). The offset must be right for that day. |
| `timezone` | Yes | The timezone name used to show the time, for example `Asia/Manila` or `UTC`. It must be a real name from the [IANA list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). A time is never shown without its timezone. |
| `end` | No | Same format as `start`, and later than `start`. Leave it out if you do not know it (the calendar file then uses one hour, and the page shows only the start). |
| `timezoneLabel` | No | A short label shown after the time, for example `PHT`. Leave it out to use the timezone's own short name. |
| `format` | No | One short phrase such as `Online` or `Video call`. Only what is true. |
| `type` | No | One of `live-build`, `demo-day`, `workshop`, `office-hours`. |
| `status` | No | `scheduled` (the default), `live`, `replay` or `cancelled`. |
| `registerUrl` | No | The link to register or join. Must start with `https://`. Open it first. Without it the page says "Registration link coming". |
| `replayUrl` | No | The link to the recording, when `status` is `replay`. Must start with `https://`. |
| `detail` | No | Asks for a detail page at `/events/<id>/`. See the next table. Leave it out and the event has no detail page. |

### The detail part (optional)

If you add `detail`, **all five parts are required**, so a page never goes live half empty. If you do not know all
five yet, leave `detail` out and add it in a later change.

| Part | What to write |
| --- | --- |
| `bring` | A list of what people should bring or have ready. If nothing is needed, write `"Nothing special."` |
| `agenda` | A list, one line per part of the session, in order. |
| `howToJoin` | A list of steps, one per line, in plain words. |
| `accessibility` | One text: what is available (for example captions) and what is not yet. Say plainly if something is not available. Do not promise what CRC has not confirmed. |
| `language` | One text: the language of the session and any help in other languages. Only what CRC has confirmed. |

Write for someone reading in their second language: short sentences, no jargon.

### A format-only example

This shows the format only. **It is not an event. Do not copy it into the data file as it is.** The title, the
dates and the texts below are made up to show the shape, so none of them may ever appear on the site.

```json
{
  "id": "format-only-example",
  "title": "Replace with the real title",
  "description": "Replace with what really happens and who it is for.",
  "start": "2099-01-01T10:00:00+00:00",
  "end": "2099-01-01T11:00:00+00:00",
  "timezone": "UTC",
  "timezoneLabel": "UTC",
  "format": "Replace or remove",
  "type": "workshop",
  "status": "scheduled",
  "registerUrl": "https://example.org/replace-with-the-real-link",
  "detail": {
    "bring": ["Replace with what people should bring."],
    "agenda": ["Replace with the first part", "Replace with the second part"],
    "howToJoin": ["Replace with the first step", "Replace with the second step"],
    "accessibility": "Replace with the confirmed accessibility notes.",
    "language": "Replace with the confirmed language notes."
  }
}
```

In the file, events go inside the list `[ ... ]` and are separated by commas, with no comma after the last one.
The first event goes between the two square brackets that are in the empty file now.

### Add an event

1. Get CRC's written confirmation of the date, time, timezone and, if you will add a detail page, the five
   detail parts. Without it, stop here.
2. Open the project in GitLab, make a branch, and open `src/data/events.json` in the Web IDE.
3. Add one block in the format above, with only fields you know. Check the commas and the double quotes.
4. If you use `registerUrl` or `replayUrl`, open the link in a private window and confirm it works.
5. Open a merge request. Say in the description where the confirmation came from (for example "CRC email of
   the date"), without pasting private details.
6. Wait for the pipeline. If a job is red, the log names the event and the field (for example
   `events.0.timezone`). Fix it in the same branch (section 9).
7. Look at the build before you merge: open the `build` job's output or the preview, open `/events/` and, if
   you added `detail`, `/events/<id>/`. Check the date, the time and the timezone against CRC's confirmation.
8. Merge. After the `master` pipeline, open the live `/events/` page and check it again.

### Change an event

1. Open `src/data/events.json` on a branch and find the event by its `id`.
2. Change only what changed. Do not change the `id`.
3. Moved to another date or time: change `start` (and `end`), and say "moved" in the merge request. If people may
   have saved the old time, tell CRC so they can inform registered people.
4. Cancelled: set `"status": "cancelled"` and keep the event. The page shows it as cancelled and gives no
   calendar file, so nobody is left waiting for a session that is not happening.
5. Held and recorded: set `"status": "replay"` and add `replayUrl`, only after you opened the recording.
6. Merge request, pipeline and live check as in "Add an event".

### Remove an event

Remove an event only if it should never have been listed (for example a wrong entry). Delete its whole block,
and the comma next to it, then check the live page. A session that was held or cancelled is **not** removed:
past sessions stay in the Past list, and cancelled ones are marked cancelled.

When the last event is removed, the list is `[]` and the Events page goes back to "Schedule announced soon"
by itself. No other file changes.

### What the pipeline checks

The `test` job fails when an event is missing `id`, `title`, `description`, `start` or `timezone`, when a field
name is misspelled, when a date or timezone is not valid, when `end` is not after `start`, when two events share
an `id`, when a link does not start with `https://`, or when a `detail` part is missing or empty. It cannot check
that an event is real. That is why step 1 of "Add an event" comes first.
