# Pocket Invoice: UX pathway example files

These files belong to the Developer Dojo UX pathway (/katas/ux-pathway). Pocket Invoice is an invented
invoicing app for practice: no real company, person or customer.

| File | What it is |
| --- | --- |
| pocket-invoice.penpot | Editable Penpot file (format v3, a ZIP of JSON). Five pages: 01 sitemap and flow, with branches and errors; 02 low fidelity, every state at 390 px, clickable; 03 tokens and main components; 04 high fidelity, every state at 390 px (clickable, with the discard dialog as an overlay and every back path) and every screen at 1280 px; 05 the whole high-fidelity journey on one canvas, joined by numbered arrows. |
| pocket-invoice-tokens.json | Design tokens in the W3C Design Tokens Community Group draft format, as Penpot imports them: sets core and semantic, theme Mode / Light. |
| penpot-import-check.json | What was checked when the file was imported into Penpot, exported from it and imported again, the result of each check, and what was not checked. |
| qa-report.md | The accessibility and responsive QA report for every state of the working page, copied from one run of the site's browser tests. |
| screens/ | Screenshots from Penpot View mode, taken by that check; journey.png is page 05. |
| inputs/pocket-invoice-flow.json | The flow as plain JSON: screens, the 11 states with their elements, and the 19 numbered transitions. Edit this to change the drawings. |
| inputs/contrast-pairs.json | The text and control colour pairs the flow script checks against the token file, with their minimum ratios. |
| inputs/brand.json | The brand: name, wordmark, voice, rules, the screens that show the signed-in navigation, and the phone and desktop layout widths. |
| tools/ux_pathway.mjs | The flow script: JavaScript for Node.js, no packages to install. It reads the inputs and the token file, draws the SVG files and checks the flow. |
| tools/ux_hifi.mjs | The high-fidelity part of the script, called by ux_pathway.mjs: the style guide, the components, the screens at two widths, and the fidelity audit. (ux_hifi.d.mts gives its types to the site's tests.) |
| tools/ux_randori.mjs | The Randori part of the script, called by ux_pathway.mjs: checks each worked round's first and adapted flow, including one check per hidden constraint, and records what the constraint changed. (ux_randori.d.mts and ux_pathway.d.mts give types to the site's tests.) |
| inputs/randori-rounds.json | Four worked UX Randori rounds: one per partner card whose constraint a flow can show, and one that plays the two screen cards (focus order, one action per screen). Each has the first sitemap and the adapted one, in the same format as the flow file; place on an element gives its row and column on the screen. Written by the maintainers, who also wrote the cards. |
| tools/ux_usability.mjs | The usability part of the script, called by ux_pathway.mjs: walks each task's shortest path through the flow and checks the step budget, that every step is a visible button, and that every error on the way leads back to the goal. (ux_usability.d.mts gives its types to the site's tests.) |
| inputs/usability-tasks.json | Seven usability tasks for Pocket Invoice, each a scenario read to a participant with its start, goal, step budget and what to watch for, plus one finding recorded with its decision. Written by the maintainers; no participant has done them. |
| tools/design_tokens.mjs | Reads the token file, resolves aliases and computes WCAG 2 contrast; shared by both scripts. |
| generated/sitemap.svg | The sitemap: states grouped by screen, numbered arrows, error and recovery arrows dashed. |
| generated/journey.svg | Every low-fidelity screen on one canvas, each arrow starting at the button that causes it. |
| generated/wireframes/ | One greyscale 390 px low-fidelity screen per state, as SVG. |
| generated/style-guide.svg, generated/style-guide.md | The style guide drawn from the tokens and the brand file, and the same guide as text. |
| generated/components.svg | The component sheet: 13 named components drawn only with tokens, and a focus ring sample. |
| generated/screens/phone/, generated/screens/desktop/ | One high-fidelity screen per state at 390 px and at 1440 px, built from the components. |
| generated/journey-high.svg | Every high-fidelity phone screen on one canvas, with the same numbered arrows as journey.svg. |
| generated/fidelity-report.json, generated/fidelity-report.md | The audit of every high-fidelity drawing (token use, text and boundary contrast, control size, components) and what it does not measure. |
| generated/randori/ | Each round's first and adapted sitemap and adapted screens (SVG), rounds.json and randori.md: what the checks found before and after the constraint. For the screen round, one HTML page per state of each version (D-first/, D-adapted/), which the site's browser test walks with the Tab key. |
| generated/usability/ | tasks.json and walkthrough.md: each task's shortest path, checks, recoveries and findings; session-sheet.md: a blank sheet for one moderated session. The site's browser tests click each path in the clickable prototype. |
| generated/flow-checks.json, generated/summary.md | The result of every flow and contrast check, as JSON and as a table. |
| generated/manifest.json | The generated files, the size of each drawing and the SHA-256 of each input. |

## Open the file in Penpot

1. Sign in to Penpot (penpot.app, or your own self-hosted instance).
2. In Projects, choose Import .penpot and pick pocket-invoice.penpot.
3. Open each of the five pages once in the workspace before you use View mode. The file is generated
   outside Penpot, and Penpot lays out and saves its text the first time a page is opened. Until then,
   View mode shows boards without text.
4. To try the prototype, open page 02 or 04 and press Play. Each page has one flow, starting at sign-up. Cancel on
   the new invoice screen opens the discard dialog as an overlay; Keep editing closes it, and every screen has its
   way back.
5. To read the whole journey at once, open page 05 and press Play, or stay in the workspace and zoom to fit.
6. To keep your own edited copy, use the file menu's export as .penpot. The check below exported this file from
   Penpot and imported the copy again with the same pages, boards, interactions, components and tokens.

Penpot is open source under the Mozilla Public License 2.0. You can run it yourself, or use penpot.app, whose
Professional plan is $0 (up to 8 team members, 10 GB, 7 days of version history; checked on 2026-11-27 on
penpot.app/pricing). The Armory record (/armory/registry#penpot) lists the version tested, the plans, what an agent
can write through the MCP server or a plugin, and what was not checked.

The token file is already inside the .penpot file. Import pocket-invoice-tokens.json on its own only into a
file of your own: importing tokens replaces that file's global token set.

## Redraw the SVG files from your own flow

1. Copy this folder, with inputs/, tools/ and pocket-invoice-tokens.json.
2. Edit inputs/pocket-invoice-flow.json (and the token file, the colour pairs or the brand file, if you like).
3. Run `node tools/ux_pathway.mjs . out` in the copy, with Node.js.
4. Open out/summary.md and out/fidelity-report.md. The script exits with 1 when a check fails, and still writes every file so you can see why.

Every drawing is plain SVG text, so you can open it in a browser, edit it in a text editor or a vector tool, and
compare versions in git. Penpot and Figma both document SVG as a way to bring drawings in from other tools; nobody
has tried that with these files yet.

The clickable version of the same screens is at /examples/pocket-invoice-prototype/; add ?fidelity=high, or use its
switch, to see it drawn with the tokens.
The style guide is also a web page, /examples/pocket-invoice-style-guide/, where every specimen is styled only with the
tokens, so a browser's inspector shows the token behind each value.

## How the files are made

The .penpot file is generated from the same flow and tokens as the working example
(/examples/pocket-invoice/), with Penpot's official library, @penpot/library. The site's tests rebuild it on
every pipeline and fail if the published copy differs. A maintainer's check imports it into a self-hosted Penpot
(last run on Penpot 2.19.5), and the tests fail if the published file is not the one that check passed. CI also reruns the flow script on every pipeline and fails if
any file it writes differs from generated/.

## Licences and credits

- Pocket Invoice, its flow, tokens, brand file, Penpot file, screenshots, SVG drawings and scripts: Developer Dojo, MIT licence.
- @penpot/library, used to write the file: Mozilla Public License 2.0 (Kaleidos). Penpot itself is MPL-2.0.
- The error summary follows the GOV.UK Design System error summary pattern
  (design-system.service.gov.uk/components/error-summary/), published under the Open Government Licence v3.0.
  The pattern is credited; no GOV.UK text, code or font is copied.
