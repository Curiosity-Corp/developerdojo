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

## Open the file in Penpot

1. Sign in to Penpot (penpot.app, or your own self-hosted instance).
2. In Projects, choose Import .penpot and pick pocket-invoice.penpot.
3. Open each of the four pages once in the workspace before you use View mode. The file is generated
   outside Penpot, and Penpot lays out and saves its text the first time a page is opened. Until then,
   View mode shows boards without text.
4. To try the prototype, open page 02 or 04 and press Play. Each page has one flow, starting at sign-up.

The token file is already inside the .penpot file. Import pocket-invoice-tokens.json on its own only into a
file of your own: importing tokens replaces that file's global token set.

## How the files are made

The .penpot file is generated from the same flow and tokens as the working example
(/examples/pocket-invoice/), with Penpot's official library, @penpot/library. The site's tests rebuild it on
every pipeline and fail if the published copy differs.

## Licences and credits

- Pocket Invoice, its flow, tokens, Penpot file and screenshots: Developer Dojo, MIT licence.
- @penpot/library, used to write the file: Mozilla Public License 2.0 (Kaleidos). Penpot itself is MPL-2.0.
- The error summary follows the GOV.UK Design System error summary pattern
  (design-system.service.gov.uk/components/error-summary/), published under the Open Government Licence v3.0.
  The pattern is credited; no GOV.UK text, code or font is copied.
