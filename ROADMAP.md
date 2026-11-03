# Roadmap

What developerdojo.org is becoming, what is done, what is next, and how to propose new work.

**This file is a snapshot dated 2026-11-03.** The live truth is in GitLab: the epics in the group
**Curiosity-Corp** (group page > Plan > Epics) and the board **Website** in the project (Plan > Issue boards).
Update this file in the monthly review ([docs/handbook.md](docs/handbook.md#7-the-monthly-review)).

## The goal

The whole Developer Dojo Master Developer program, and everything a developer needs for the new age of
development, on one free site, in plain words, each topic pointing to the best free training online.

We train the **2030 Product Development Manager**: someone who decides what to build and why, owns the epics
and roadmap, and gets the work done through AI agents at four levels: **use** one agent, **delegate** whole
tasks with a brief, **orchestrate** many sessions, and **govern** them with written policy and gates.

Success looks like:

- [ ] Every program document is on the site, fully written out.
- [ ] 14+ skill tracks plus the Frameworks track, each lesson 1,500 to 3,000 words with 3 to 8 verified free resources.
- [ ] 150+ verified free resources and a weekly dead-link check.
- [ ] Search, lesson navigation and the interactive tools are live.
- [ ] The maintainer has published a change end to end alone (issue #37).

## State of the epics (2026-11-03)

Parent epic **&1** "developerdojo.org v2". Milestone due dates are in each epic.

| Epic | Milestone due | What it delivers | State |
| --- | --- | --- | --- |
| **&2** Full Master Developer program on the site | 2026-11-24 | Program guide, learning path, teaching deck as lessons, rubric and weekly checklist, catalogue framework, worked example (DanHup), eight templates | Deck and rubric lessons done. Program guide, catalogue framework and worked example in progress. Templates in review |
| **&3** Learning platform foundation | 2026-11-24 | Tracks, resources, richer lesson pages, site search, editor guide, site-wide positioning | Content model, lesson pages, search and the editor guide done. Positioning copy in review |
| **&4** Skill tracks: product craft | 2026-11-24 | Six product tracks with long lessons and resources | Delivered |
| **&5** Skill tracks: AI agents, engineering and platform | 2026-11-24 | Working with AI agents and seven engineering tracks | In progress |
| **&6** Free learning resource hub | 2026-11-24 | 150+ verified free resources, weekly link check | Weekly link check delivered; resource catalogue in progress |
| **&7** Interactive learning tools | 2026-11-24 | Self-assessment, weekly checklist, knowledge checks, progress, fillable templates (all in the browser, nothing stored on a server) | Ready to start |
| **&8** Frameworks: UBF, STAR, ORBITAL, ANDROID/DROID Ops, PHANTOMS | 2026-11-24 | All frameworks as one connected system, plus a capstone across roles | Hub, UBF, STAR and PHANTOMS done. ORBITAL in review. ANDROID/DROID Ops, Launch Sequence and Mission Control, and the capstone in progress |
| **&9** Handover: the maintainer runs developerdojo.org | 2026-12-01 | Templates, board, this roadmap, the handbook, a ready backlog, a completed walkthrough | Templates, roadmap, handbook and backlog delivered. The walkthrough (#37) is the maintainer's own task and stays open until the maintainer has done it |
| **&10** Agent orchestration and policy administration | 2026-12-01 | The advanced track: command chain, policy as data, hooks and gates, delegation briefs, fleet running, Launch Sequence for agent-built software, capstone | In review and in progress |
| **&11** Backlog after v2 | none | Fifteen ready-to-pick issues (below) | Ready |

## What is next

In this order:

1. **Finish v2.** Merge what is in review, close each epic when every issue is closed and live.
2. **The handover walkthrough (#37).** The maintainer follows [CONTRIBUTING.md](CONTRIBUTING.md): fix a word,
   add a resource, merge, see it live, move an issue across the board. Every confusing point is fixed in
   the guides.
3. **Pick from the Backlog epic (&11).** The milestone is called **Backlog**. Suggested first picks, small
   and safe:
   - Agile terms for the glossary (`good-first-edit`)
   - Simple English summary boxes (`good-first-edit`)
   - Source map of the Curiosity learning-guide repositories (`good-first-edit`)
4. **New tracks from Curiosity material and free outside sources:** decision-making, leadership, research and
   evidence, thought leadership.
5. **Learner support:** short video walk-throughs per track, Simple English summaries, a second worked example,
   the Sensei mentor handbook.
6. **Community and trust:** cohort event pages (only real dates), the certificate procedure, accessibility pass.
7. **Routines that keep it alive:** weekly link check, monthly review, quarterly resource refresh
   ([handbook](docs/handbook.md#6-the-weekly-link-check)).

### The Backlog epic in one list

| Issue | Area | Idea |
| --- | --- | --- |
| #47 | tracks | Decision-making track (from the Think Dojo stage) |
| #48 | program | Map the Dojo Readiness rubric to the self-assessment |
| #49 | tracks | Leadership track: leading people and agents |
| #50 | tracks | Thought leadership: write to be heard |
| #51 | tracks | Research and evidence track |
| #52 | program | Agile terms for the glossary |
| #53 | tracks | Video walk-through per track (pilot with transcript) |
| #54 | program | Simple English summary box and key words |
| #55 | program | A second running example (fictional service business) |
| #56 | program | Sensei mentor handbook |
| #57 | platform | Cohort 1 event pages and procedure |
| #58 | resources | Quarterly resource refresh and stale list |
| #59 | handover | Source map of the Curiosity learning material |
| #60 | program | Certificate issuing and verification procedure |
| #61 | platform | Accessibility pass with real tools |

## How to propose new work

1. **Look first.** Search the issues and the Backlog epic: the idea may already be there.
2. **Open an issue** from a template (Plan > Issues > New issue > Choose a template): New lesson, New track,
   New resource, Content fix, Bug or Link rot. Fill in every square bracket: why it matters, what to do,
   sources, acceptance criteria, how to check it.
3. **Label it** (the template does): one `type::`, one `area::`, `status::ready`. Add `good-first-edit` if it is
   small and safe.
4. **Attach it** to the milestone **Backlog** (or the current milestone) and to an epic.
5. **People write epics and roadmaps.** If your idea is a whole new theme, write the epic yourself; an agent may
   draft the issues under it, but you decide the order and read them.
6. **It enters this file** at the next monthly review.

## What does not change

No made-up people, numbers, events or courses. No money promises. No internal server names or private client
details. Every outside link is opened when it is added. People write epics and roadmaps; AI use is disclosed.
All pipeline stages are green before merge. We fix forward and never undo shipped work to hide a problem.
