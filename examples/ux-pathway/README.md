# Pocket Invoice: UX pathway example files

These files belong to the Developer Dojo UX pathway (/katas/ux-pathway). Pocket Invoice is an invented
invoicing app for practice: no real company, person or customer.

| File | What it is |
| --- | --- |
| pocket-invoice.penpot | Editable Penpot file (format v3, a ZIP of JSON). Four pages: sitemap and flow, low fidelity, tokens and components, high fidelity. |
| pocket-invoice-tokens.json | Design tokens in the W3C Design Tokens Community Group draft format, as Penpot imports them: sets core and semantic, theme Mode / Light. |
| penpot-import-check.json | What was checked when the file was imported into Penpot, the result of each check, and what was not checked. |
| qa-report.md | The accessibility and responsive QA report for every state of the working page, copied from one run of the site's browser tests. |
| screens/ | Screenshots from Penpot View mode, taken by that check. |
| inputs/pocket-invoice-flow.json | The flow as plain JSON: screens, the 11 states with their elements, and the 19 numbered transitions. Edit this to change the drawings. |
| inputs/contrast-pairs.json | The text and control colour pairs the flow script checks against the token file, with their minimum ratios. |
| tools/ux_pathway.mjs | The flow script: JavaScript for Node.js, no packages to install. It reads the inputs and the token file, draws the SVG files and checks the flow. |
| generated/sitemap.svg | The sitemap: states grouped by screen, numbered arrows, error and recovery arrows dashed. |
| generated/journey.svg | Every low-fidelity screen on one canvas, each arrow starting at the button that causes it. |
| generated/wireframes/ | One greyscale 390 px low-fidelity screen per state, as SVG. |
| generated/flow-checks.json, generated/summary.md | The result of every flow and contrast check, as JSON and as a table. |
| generated/manifest.json | The generated files, the size of each drawing and the SHA-256 of each input. |

## Open the file in Penpot

1. Sign in to Penpot (penpot.app, or your own self-hosted instance).
2. In Projects, choose Import .penpot and pick pocket-invoice.penpot.
3. Open each of the four pages once in the workspace before you use View mode. The file is generated
   outside Penpot, and Penpot lays out and saves its text the first time a page is opened. Until then,
   View mode shows boards without text.
4. To try the prototype, open page 02 or 04 and press Play. Each page has one flow, starting at sign-up.

The token file is already inside the .penpot file. Import pocket-invoice-tokens.json on its own only into a
file of your own: importing tokens replaces that file's global token set.

## Redraw the SVG files from your own flow

1. Copy this folder, with inputs/, tools/ and pocket-invoice-tokens.json.
2. Edit inputs/pocket-invoice-flow.json (and the token file or the colour pairs, if you like).
3. Run `node tools/ux_pathway.mjs . out` in the copy, with Node.js.
4. Open out/summary.md. The script exits with 1 when a check fails, and still writes every file so you can see why.

Every drawing is plain SVG text, so you can open it in a browser, edit it in a text editor or a vector tool, and
compare versions in git. Penpot and Figma both document SVG as a way to bring drawings in from other tools; nobody
has tried that with these files yet.

The clickable version of the same screens is at /examples/pocket-invoice-prototype/.

## How the files are made

The .penpot file is generated from the same flow and tokens as the working example
(/examples/pocket-invoice/), with Penpot's official library, @penpot/library. The site's tests rebuild it on
every pipeline and fail if the published copy differs. CI also reruns the flow script on every pipeline and fails if
any file it writes differs from generated/.

## Licences and credits

- Pocket Invoice, its flow, tokens, Penpot file, screenshots, SVG drawings and flow script: Developer Dojo, MIT licence.
- @penpot/library, used to write the file: Mozilla Public License 2.0 (Kaleidos). Penpot itself is MPL-2.0.
- The error summary follows the GOV.UK Design System error summary pattern
  (design-system.service.gov.uk/components/error-summary/), published under the Open Government Licence v3.0.
  The pattern is credited; no GOV.UK text, code or font is copied.
