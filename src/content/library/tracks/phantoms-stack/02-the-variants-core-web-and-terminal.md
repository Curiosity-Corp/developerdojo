---
title: "The variants: core, web and terminal"
description: "PHANTOMS is a family. Compare the public core starter, the richer PHANTOMS+ web variant and the PHANTOMS TUI variant for terminal apps, and learn how to choose one for a product."
section: "The PHANTOMS stack"
order: 2
track: "phantoms-stack"
level: "core"
duration: "80 min"
outcomes:
  - "Describe what the core, web (PHANTOMS+) and terminal (PHANTOMS TUI) variants are for"
  - "Choose a variant from the user, the channel and the team, not from taste"
  - "Explain what stays the same in every variant and what changes"
  - "Brief an agent to scaffold on a chosen variant without drifting from its rules"
prerequisites:
  - "the-way-five-rules"
resources:
  - "curiosity-corp/phantoms-starter"
  - "tailwind/tailwind-css-installation"
  - "shadcn/shadcn-ui-introduction"
  - "go/tour-of-go"
  - "go/get-started-with-go"
  - "charm/bubble-tea-basics-tutorial"
  - "charm/lip-gloss-repository"
  - "charm/huh-repository"
updated: 2026-11-03
---

This is lesson 2 of the PHANTOMS track. It supports the Master Developer platform module and Developer week 5, where you choose how a product shows itself to people. In lesson 1 you learned the pattern. Here you meet the family of starting points that apply it.

## 1. Why this matters

A starting point is a bet about your user. A product for café owners who sit at a desk wants a web page. A tool for engineers who live in a terminal wants a terminal app. A first prototype for an investor demo wants the smallest thing that runs and is honest about what is missing.

If the wrong starting point is chosen, every later decision fights it. The cost shows up as slow screens, awkward installs or a design system that nobody asked for.

The 2030 Product Development Manager chooses the starting point from the **user, the channel and the team**, writes that choice down, and lets agents scaffold from it. They do not choose by what is fashionable.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Who the user is, where they work, what the first version must prove | Scaffolding the chosen variant, adapting the sample app to the product, writing tests and docs | Running the scaffold from a clean clone, reading the diff, checking the variant's rules still hold | Design (look and feel), marketing (how users find and install it), operations (how it is run), security (what it exposes) |

## 2. Key ideas, explained

### What stays the same in every variant

Whatever the variant, the pattern from lesson 1 holds:

- **Jobs have names.** Data, API, AI, interface, tasks, agents, retrieval, files.
- **Defaults are replaceable.** Each variant picks tools, and each pick can change.
- **A is provider-neutral.** Models sit behind an adapter. Credentials stay on the server side.
- **The repository teaches.** An `AGENTS.md`, guides and decision records tell agents the rules.
- **Optional pieces stay optional.** Retrieval, agents and object storage wait for a measured need.
- **CI is part of the product.** Checks run on every change. Secrets never sit in git.

### The three variants today

| Variant | For | Interface | Where to find it |
|---|---|---|---|
| **PHANTOMS core** | Learning, prototypes, API-first products | A small static web page plus a JSON API | Public: [github.com/Curiosity-Corp/phantoms](https://github.com/Curiosity-Corp/phantoms) |
| **PHANTOMS+ web** | Products with a polished, branded web interface | Web app with a design system | Internal starter, described below. Not public. |
| **PHANTOMS TUI** | Tools used in a terminal | Text user interface | A pattern in this lesson; more to come |

The family will grow. New variants appear when a new kind of product needs a different interface or runtime. Learn to read variants, not to memorise them.

### PHANTOMS core

This is the public starter and the one you will use in the capstone. It is deliberately small. It contains a Bun workspace with a Hono API, a static Next.js web page, a database package (PostgreSQL through a SQL-first library), an AI adapter package with no live model call, a Dockerfile, a CI pipeline and a set of guides. It is a learning surface, not a finished product.

Its **honest limits** matter as much as its contents. It has no user login, no per-user permissions, no deployed agent, no retrieval and no object storage. The guides say so. Treat each missing item as a line in your product plan, not as something you may forget.

### PHANTOMS+ web

PHANTOMS+ is the **web variant**: the same pattern, built for a product whose interface must look finished. The core starter intentionally uses plain CSS "to keep its first build easy to inspect". A branded product needs more. The recommended-tooling guide in the public starter lists the usual additions, and PHANTOMS+ is built around that menu:

- **Tailwind CSS 4** for utility-based styling, so a design system can live in the code.
- **shadcn/ui** for accessible interface components whose source is copied into your repository, so you own and can change them.
- Companions such as an icon set, motion for transitions (while respecting people who ask for less motion) and theme switching.
- Validation with a schema library, a typed SQL layer and one formatter-linter, as in core.

We keep the PHANTOMS+ starter repository internal, so this lesson describes it and does not link it. What matters for you is the lesson it teaches: **a design system is a decision with a cost.** It improves consistency and accessibility, and it adds dependencies, upgrade work and a styling vocabulary that every agent must follow. The guide's own warning applies: "do not mix multiple styling systems without a reason." Write the styling rule in `AGENTS.md`.

If you work from a public repository and want PHANTOMS+ behaviour, start from the core and add the design pieces yourself, one at a time, with decision records. The official docs for [Tailwind CSS](https://tailwindcss.com/docs/installation) and [shadcn/ui](https://ui.shadcn.com/docs) are free.

### PHANTOMS TUI

Some products belong in a terminal: tools for engineers, operators, support staff, or anyone who works faster with a keyboard than a mouse. A **TUI** (text user interface) is a program that draws an interactive screen made of text. The PHANTOMS TUI variant applies the pattern to such tools, using **Go** and the **Charm** family of open source libraries:

| Library | Job it does | Think of it as |
|---|---|---|
| **Bubble Tea** | The framework: keeps state, reacts to keys, redraws the screen | The engine |
| **Lip Gloss** | Styling: colours, borders, spacing and layout | The brand and the stylesheet |
| **Bubbles** | Ready-made components: lists, tables, text inputs, spinners | The component library |
| **Huh** | Forms and prompts: selects, confirms, text input, validation | The form builder |

Bubble Tea is built around three ideas, easy to read even if you do not write Go: a **model** (everything the screen needs to know), an **update** step (what changes when a key is pressed or data arrives) and a **view** (how the model looks as text). When an agent writes a terminal app, you review these three parts. Does the model hold only what it needs? Does every key do what the screen says? Does the view stay readable on a small terminal?

How do the letters map? This is a design pattern, so treat the next table as a way of thinking rather than a published specification.

| Letter | In a TUI product |
|---|---|
| P | Still PostgreSQL when data must be durable and shared. A small local file may do for a personal tool. |
| H | Optional. A TUI may talk to an existing API, or contain its own small server. |
| A | The same adapter idea: models behind an interface, credentials from configuration. |
| N | Replaced by the terminal interface. |
| T | The task runner for build, test and release, in whatever form the language uses. |
| O, M, S | Optional, with the same rules as before. |
| Bun | Replaced by the Go toolchain for the TUI itself. Bun may remain for any web or API part. |

The lesson for a manager: the pattern survives a change of language and interface. The **rules** (boundaries, AI adapter, optional services, CI gates, secrets) matter more than the particular tool. Before you accept agent-written TUI code, check the current names and import paths in each project's README, because open source libraries reorganise. The official [Bubble Tea tutorial](https://github.com/charmbracelet/bubbletea/tree/main/tutorials/basics) takes about half an hour and is worth doing once, and [A Tour of Go](https://go.dev/tour/) gives enough reading ability.

## 3. Step by step: how to choose a variant

1. **Name the user and the channel.** "Café owners, at a desk, in a browser." Or "Our support team, in a terminal, on a server."
2. **Name what the first version must prove.** A customer will pay? A workflow saves time? Keep it to one sentence.
3. **List the interface needs.** Branding and accessibility? Keyboard speed? Offline use? Install friction?
4. **Name the team.** Who will maintain it? Do they read TypeScript, Go, or neither? Remember that agents write most of the code, but a person must still be able to read it.
5. **Pick the smallest variant that fits.** Prefer core when unsure, and add design pieces later with decision records.
6. **Write the choice in git** as a decision record, with the trigger that would change it.
7. **Brief an agent to scaffold** from the chosen variant, and no other.
8. **Run it from a clean clone** and verify against the variant's own guide.

## 4. Worked example: TrailMug

Maya needs an order tracker for café owners. She runs the steps.

- **User and channel:** café owners at a counter or a desk, on a laptop or a tablet browser.
- **First version proves:** a café owner can see where their cup order is without calling anyone.
- **Interface needs:** a clear list with statuses, readable by someone in a hurry. Branding can wait; accessibility cannot.
- **Team:** Maya, plus agents. A contractor will review the code once a month.
- **Choice:** PHANTOMS core. The plain page is enough to test the idea. She records a trigger: "move to the web variant when five cafés ask for TrailMug branding or when we show the page to investors".

Later, TrailMug's operations lead, Sam, asks for a command-line tool to mark orders as packed at the warehouse, where staff use a shared terminal. Maya writes a second decision record. For this tool she picks the TUI pattern, because the users work in a terminal and speed matters more than looks. It reuses the same database and the same rules. The two interfaces share one source of truth.

Notice what Maya did **not** do. She did not pick the richest variant "to be ready". She did not let an agent choose. She wrote down triggers.

## 5. Working with AI agents on this

**What to delegate.** Cloning and running the chosen starter, adapting the sample feature to your product, adding a page or a command, writing tests, drafting documentation.

**What you must do yourself.** Choose the variant. Decide the user and the first promise. Approve every added design dependency. Write the epic and the roadmap yourself.

**A prompt you can adapt:**

> Work in a clean clone of the PHANTOMS core starter. Read README.md, AGENTS.md and docs/getting-started.md first. Goal: rename the sample "task" feature to "order" with fields id, café name, cup count and status (placed, packed, shipped, delivered). Keep all existing rules: Bun only, validation at the API boundary, database code only in packages/db, no new dependencies. Run the verification commands from AGENTS.md and paste their output. Do not add styling libraries. If a rule blocks you, stop and tell me which one.

**How to check the output.** Run the starter's own verification from a clean clone. Read the diff for any dependency you did not approve. Compare the final file list with what you expected. A rename that touches fifty files is a warning sign.

**Disclose.** State in the merge request which parts an agent wrote. See [disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Picking the heaviest variant "to be safe".** Heavy starts cost upgrades and attention from day one. Start small and add by trigger.
- **Mixing two styling systems.** Agents love to add one more. Write the rule in `AGENTS.md`.
- **Assuming a variant fixes security.** No variant brings login, permissions or backups for free. Plan them.
- **Building a TUI because it looks clever.** Choose it because the users live in a terminal.
- **Ignoring who reads the code.** If nobody on the team can read the language, review becomes a ritual. Choose a language someone can judge.
- **Copying code between variants without checking the rules.** A rule in one variant may not hold in another.

## 7. Practice

**Exercise: "Pick the variant and defend it."**

1. Choose two real products you know, or use TrailMug's order tracker and TrailMug's warehouse tool.
2. For each, fill in the eight-step choice above, one line per step.
3. Write a one-page decision record per product, in your own words. Include the trigger that would make you change variant.
4. Ask an agent to challenge each record. Prompt: "List three reasons this choice could be wrong and one cheap test for each." Do not let it rewrite the record.
5. Write what you changed after reading its challenge, or why you kept the record as it was.

**Deliverable in git:** two files under `docs/decisions/` and a merge request note naming the agent you used.

## 8. Checklist

- [ ] I can say what core, web and TUI variants are for.
- [ ] I chose by user, channel and team, not by taste.
- [ ] I know what is common to every variant.
- [ ] I recorded a trigger that would change my choice.
- [ ] I know the starter's honest limits and put each one on my roadmap.

## 9. Further learning

The resources below include the public starter, the official Tailwind CSS and shadcn/ui docs for the web variant, and the Go and Charm material for the terminal variant. If you do only one hands-on item, do the Bubble Tea basics tutorial. It shows how a small interactive program keeps state, and that idea helps when you review any agent-built interface.

**Next:** [Bun, the runtime and package manager](/library/tracks/phantoms-stack/03-bun/).
