# Source map

Where the Curiosity learning material really lives, what is in it today, what the Dojo may reuse, and what must
never be published. Written for the maintainer who has to plan work from these repositories.

**Checked on 2026-11-03.** On that day the file list of every repository below was read through the GitLab
project pages (read only), on each repository's default branch. All of them are in the GitLab group
**Curiosity-Corp**, except one frameworks repository that sits in the group **WorldEnterpriseGroup**. We write
group and repository names only, never server addresses.

## How to use this page

1. Find the repository in the tables below. Read **Inside today** first: the name of a repository says little.
2. If **Reuse** names an issue, that issue is the brief. Read it, not the repository.
3. Read **Never publish** before you open any file from that repository.
4. Rewrite in your own words. Do not copy sentences. The rules are in the [style guide](style-guide.md) and in
   [handbook section 11](handbook.md#11-what-never-to-publish).
5. If you change a row, change its **Checked** date too.

The main finding: the index at `Curiosity-Corp/overview`, file `REPOSITORY-INDEX.md` (refreshed on 2026-10-01),
lists many learning guides. Most of them hold only a title. Real material sits in a few places:
`quest`, `curiosity-coaches`, `thought-leadership-guide`, the frameworks repository, `phantoms`, and the program
SharePoint folder (see the end of this page).

## What must never be published (all repositories)

These apply everywhere. The details are in [handbook section 11](handbook.md#11-what-never-to-publish).

- Visa, work-permit and immigration forms or guidance, and work-eligibility procedures.
- Real people: names, contact lists, directories, photos, learner records.
- Server names, addresses, accounts, tokens, cluster or network details, and settings files of our own tools.
- Agent instruction files (`AGENTS.md`, `CLAUDE.md`) and tool configuration files: they describe how we run our
  own agents. Teach the shape of the idea, not the file.
- Client details, cloud accounts, cost figures and organisation charts of any real company.
- Any claim that CRC or a program is accredited, approved or tax-exempt. All such work is pending.

## Repositories with real material

| Repository | Inside today | Reuse | Never publish | Checked |
| --- | --- | --- | --- | --- |
| `Curiosity-Corp/quest` | 38 files. `docs/`: the Dream Quest framework, eight stage pages (`docs/stages/`), assessment, governance and ingestion notes. `rubrics/`: five rubrics, including `dojo-readiness.md`. `templates/`: learner intake, learner plan, curriculum map. `adapters/`: four folders of forms for named student programs | Stage 5 (Think Dojo) and the readiness rubric feed issue #47 (decision-making track) and issue #48 (readiness rubric mapped to the self-assessment). Stages 6 and 7 are background for the Developer and agent pages | Everything under `adapters/` (visa and work-permit forms, checklists and field maps). The intake and learner-plan templates once they hold a real learner's data. The HTML application template | 2026-11-03 |
| `Curiosity-Corp/curiosity-coaches` | 5 files: `Agile Concepts.md` (a term list of 36 agile words), a government-contracting training manual, a folder `board-candidate-analysis/` (a notebook and a directory of professionals), and a one-line README | The term list gave the words for issue #52 (agile glossary entries). Use the term names only | The whole `board-candidate-analysis/` folder (real people and contact details). Do not copy the sentences of the term list or the manual. The manual is outside the Dojo's scope | 2026-11-03 |
| `Curiosity-Corp/thought-leadership-guide` | 6 files: a README with a list of thought-leadership attributes, a table of contents (an outline), two small diagrams (`Agile Team.md`, `Mind Map.md`), one short placeholder enterprise plan | Attributes and outline are ideas for issue #50 (thought-leadership lessons). The numbers need a source check first | The two diagrams name commercial tools: use them as ideas only, never as pictures. | 2026-11-03 |
| `WorldEnterpriseGroup/dot-github` (branch `gh-pages`) | 38 files. `Frameworks/` has six main texts (UBF, ORBITAL, STAR, SHIFT, ANDROID, ANDROID Ops), four short versions and three more-info files. `research/` has eight working papers. Also `supernova.md`, `training.md`, `plan.md`, `Itinerary.md` | Already used for the frameworks track (issues #26 to #33: hub, UBF, STAR, ORBITAL, ANDROID and DROID Ops, Launch Sequence, Mission Control, capstone). Business-strategy writing: rewrite in plain words for developers | `training.md`. `research/Mission Control Training Program Itinerary.md`. The root files `plan.md` and `Itinerary.md` were not reviewed for the Dojo: keep them out until a person has read and cleared them | 2026-11-03 |
| `Curiosity-Corp/phantoms` | 54 files. A runnable starter: `apps/` (an API and a web app), `packages/` (database and AI), eight pages in `docs/`, container and pipeline files | The PHANTOMS track (issue #31 done, issue #64 keeps it current). Teach the pattern: PHANTOMS is a family, not one fixed stack | Real values for settings (only an example file exists: keep it so). Agent instruction files. Internal variants of the stack: describe them, do not link them | 2026-11-03 |
| `Curiosity-Corp/androidops` | 112 files. `README.md` on the ANDROID Ops model (seven pillars), about 50 HTML slide pages and their images, a tool settings file | The README is background for the ANDROID and DROID Ops lessons (issue #30). Slide titles on backlog grooming, daily stand-up and sprint retrospective can inspire agile examples: rewrite from the idea | The slides about cloud accounts, cost breakdowns, repository overviews, access groups and the organisation chart (a real company's setup). The tool settings file. Client names | 2026-11-03 |
| `Curiosity-Corp/dot-github` | 6 files: the organisation profile README (pedagogy, programs and spaces), licence, two agent instruction files | Background reading on the programs. Nothing to copy | The agent instruction files | 2026-11-03 |
| `Curiosity-Corp/overview` | 14 files: `REPOSITORY-INDEX.md`, `repositories.json`, `SPO-ACADEMY-INDEX.md` (an inventory of sites and drives, marked unverified), operations and security notes, two scripts | The index is the starting point for this map. Do not trust its descriptions without opening the repository | The drive and folder inventory. The local workspace path in the index. Agent instruction files | 2026-11-03 |

## Repositories that hold only a title

Each of these has a licence file and a README with a one-line title (for `leadership-guide` also a domain
file). Nothing can be reused. Do not plan lessons "from" them; write the lesson from outside sources instead.

| Repository | Inside today | Reuse | Never publish | Checked |
| --- | --- | --- | --- | --- |
| `Curiosity-Corp/dev-guide` | Licence, title-only README | Nothing. The Dojo's own tracks cover development | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/design-guide` | Licence, title-only README | Nothing. See the Dojo track on brand, website and mockups | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/research-guide` | Licence, title-only README | Nothing to copy. Issue #51 builds the research track from outside sources | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/leadership-guide` | Licence, a domain file, title-only README | Nothing to copy. Issue #49 builds the leadership track from outside sources | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/behavioral-guide` | Licence, title-only README | Nothing | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/development-guide-rm` | Licence, README with a title and the words "technical expertise" | Nothing | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/experience-guide-rm` | Licence, README with a title and the words "internships and SMILE Spaces" | Nothing | Anything about real internships or placements | 2026-11-03 |
| `Curiosity-Corp/thought-leadership-guide-rm` | Licence, title-only README | Nothing. The material is in `thought-leadership-guide` above | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/performance-guide` | Licence, title-only README | Nothing | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/social-guide` | Licence, title-only README | Nothing | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/humanities-guide` | Licence, title-only README | Nothing | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/fitness-guide` | Licence, title-only README | Nothing | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/lifestyle-guide-rm` | Licence, title-only README | Nothing | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/world-guide` | Licence, title-only README | Nothing | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/curiosity-guide` | Licence, title-only README, `notes/research.md` (1 byte: empty) | Nothing | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/curiositycamp` | Licence, README with a title only | Nothing | Dates, prices or places for camps that CRC has not confirmed | 2026-11-03 |
| `Curiosity-Corp/curiosity-corp` | Licence, README with a title and the words "main website". The site is built elsewhere | Nothing | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/smilemethod` | Licence, README with a title only | Nothing | Nothing to hold back | 2026-11-03 |

## Repositories with a little, off-topic or sensitive material

| Repository | Inside today | Reuse | Never publish | Checked |
| --- | --- | --- | --- | --- |
| `Curiosity-Corp/steam-guide` | Licence, a README of about 1 KB: what STEAM means and a three-step outline (identify, produce, create) | Idea only. No Dojo issue uses it | Nothing to hold back, but there is little to use | 2026-11-03 |
| `Curiosity-Corp/lifestyle-guide` | Licence, a README of about 2 KB introducing a life guide, with a famous quotation | Nothing: outside the Dojo's topic | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/timmsi-guide` | Licence, a README and one instruction file about a learning platform that has its own site | Nothing: link to the platform's own site only if a lesson needs it, after opening it | Account or sign-in details | 2026-11-03 |
| `Curiosity-Corp/timmsi` | 7 files: notes on building a chat bot with a workflow tool, a note on a chat assistant, a lean-agile note, a note on the SMILE method, a note on work-eligibility checks | The lean-agile note is an idea source for the agile track. No issue uses it yet | The work-eligibility note (immigration and employment process). Any step that needs a sign-in | 2026-11-03 |
| `Curiosity-Corp/grading-system` | 3 files: a talent grading system with five assessments, and a long list of personal questions for those assessments | Nothing now. Not the same thing as the Dojo's rubrics | The personal question lists, which ask about people's lives | 2026-11-03 |
| `Curiosity-Corp/ignite-curiosity` | 17 files: a README on named learning methods, a 2025 internship announcement, a list of cybersecurity certifications and training sources, and `logic-apps/` (a registration flow and an SMS checking script with its settings) | The certification list may suggest resources for the security track: open every link on the day, and add only what is free and still online | `logic-apps/` (internal automation and settings). The internship announcement (an event with dates we cannot confirm) | 2026-11-03 |
| `Curiosity-Corp/curiosityhive` | 3 files: a one-page landing page and a domain file | Nothing | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/dreamtrack` | 18 files: "Dream Star", a small static web app with a worksheet, coach and profile pages | Nothing now. Do not present it as a Dojo tool | Any real learner data. The sample worksheet | 2026-11-03 |
| `Curiosity-Corp/emerging-tech` | 351 files. A degree program outline: six levels (from 8 weeks to a doctorate), each with about 50 subject pages, a catalogue, a career map, an evidence crosswalk and `adapters/` for partner universities | Possible outline ideas for later lessons. No issue uses it yet | `adapters/` (partner and client names, assessment mappings). Any wording that suggests the degree is accredited or approved: the readiness work is in progress | 2026-11-03 |
| `Curiosity-Corp/astral` | 66 files. A century-long lifelong-learning program: six pillars, five life-stage tracks, design notes and an archive of 37 files | Background only. No issue uses it | Transfer-credit or accreditation claims | 2026-11-03 |
| `Curiosity-Corp/welcome` | 11 files: a course template with "TBD" placeholders, in the style of a hands-on course, and its automation files | Nothing: the template was never finished | Nothing to hold back | 2026-11-03 |
| `Curiosity-Corp/infotech` | 3 files: a design for school automation, an identity and tools blueprint | Nothing. It describes our own systems | All of it. It describes the layout of internal systems: describe the idea in a lesson if needed, never the setup | 2026-11-03 |
| `Curiosity-Corp/catalog` | 1131 files. An open-source Ansible role and collection for workstations, with documentation | Not about product management. At most an example of an open-source project with a changelog, a security policy and a roadmap | Nothing special, but do not copy test machine names or screenshots | 2026-11-03 |
| `Curiosity-Corp/catalog-internal` | 186 files. A private staff deployment of the workstation role | Nothing | All of it. Private operations | 2026-11-03 |
| `Curiosity-Corp/streamstack` | 849 files. A Linux tool for camera, light and voice in calls, with decision records and test evidence | At most an example of decision records (the `docs/adr/` folder) in a real project | The test evidence (machine names, screenshots, logs) | 2026-11-03 |

## Not in GitLab: the program SharePoint folder

The Master Developer program files (program guide, teaching deck with speaker notes, rubric and weekly
checklist, learning path, worked example, catalogue guide, eight workbooks) live in the program SharePoint
folder named in [handbook section 3](handbook.md#3-where-the-source-material-lives). It is not a git
repository, so it was **not** re-checked for this map. Two one-page overviews there are marked "internal draft":
do not publish them as they are.

## How to re-check a row

1. Open the repository page in GitLab. Check the branch name at the top left.
2. Open **Code > Repository** (the file tree). Count the files and compare with **Inside today**.
3. Open one or two files and read the first screen. Does the row still describe them?
4. If anything changed, edit the row and write the new date in **Checked**.
5. Do this each quarter, and before you plan any lesson from a repository on this page.
