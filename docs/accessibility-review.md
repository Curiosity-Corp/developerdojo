# Accessibility review

A person-style test of ten pages, done three ways, with the method and the results written down. The pipeline's
automatic scan (`e2e/qa.spec.ts`) runs on every merge request and catches only part of the problems; this review
covers what a scan cannot see. The routine for repeating it is in [handbook section 8](handbook.md#8-quarterly-and-half-yearly-jobs).

Each pass is added to this file with its date. Do not edit an old pass. Add a new one above it.

## Pass 1: 2026-11-04

**Date.** The results are dated 2026-11-04, which is the UTC date. The machine's own clock (US Eastern time) read
2026-11-03, between about 22:30 and 23:30, while the tests ran.

**Who and what.** The tests were run by an AI agent (Claude Code) working for Suzanne Conejos, driving the tools
listed below. No person listened to the screen reader, looked at a phone or sat at a keyboard. Issue #61 asks for the
pass; this file is the record.

**What was tested.** The site built from `master` (commit `d9721f5`), then again after the fixes listed below.
Everything ran on one Linux machine against a local copy of the built site, not the live site.

| Short name | Page |
| --- | --- |
| home | `/` |
| train | `/train/` |
| lesson | `/library/tracks/frameworks/24-running-android-ops-in-gitlab/` (a long lesson with tables) |
| track | `/library/tracks/git-and-gitlab/` |
| resources | `/library/resources/` |
| search | `/library/` (the page with the search box) and the search dialog opened with `/` |
| template | `/library/template-personas/` |
| events | `/events/` |
| sensei | `/sensei/` |
| certificates | `/certificates/` |

### What was a real test and what was not

| Method | Tool used | Real or substituted |
| --- | --- | --- |
| Keyboard only | Playwright 1.64.1 with Chromium 156 (desktop, 1280 by 800), real key presses (`page.keyboard`) | Real keyboard events in a real browser. Not tested in Firefox or Safari. |
| Screen reader | Orca 50.3 on Linux with Chromium 156 | A real screen reader, but only partly useful (see below). Speech came from a silent speech engine and was read from Orca's debug log. Nobody listened. Not NVDA, JAWS or VoiceOver. |
| Screen reader, extra | Accessibility-tree inspection (Playwright `ariaSnapshot` and the browser's accessibility tree) | **Accessibility-tree inspection, not a screen reader.** It shows names, roles and heading levels as the browser exposes them. It does not show how a screen reader speaks them. |
| Phone at 200 percent zoom | Playwright with Chromium, viewport 195 CSS pixels wide at device scale 4 (the same layout as a 390 pixel phone at 200 percent), also 320 and 640 pixels wide | **Emulated.** No real phone and no browser zoom setting was used. Only Chromium. |

- [ ] **A person still needs to repeat the screen reader pass with NVDA (Windows) or VoiceOver (Mac or iPhone),
  or with Orca and the speech turned on, on the ten pages, and record the result here.** Until that is ticked, this
  review does not claim a complete screen reader test.
- [ ] A person should repeat the phone zoom pass on a real phone (iPhone Safari and an Android phone).
- [ ] A person should repeat the keyboard pass in Safari and Firefox.

### 1. Keyboard only

**Method.** For each page: load it, press Tab from the top and record every stop (name, position, whether a focus ring
was drawn and its colour, whether something covered the focused element) until focus left the page. Then use the
main controls with the keyboard: the skip link, the header menu, the theme toggle, the search dialog (open with `/`,
type, Tab through results, close with Escape), the resource filters and the certificate verify form.

**Results.**

- Every visible link and button on the nine pages other than the resource hub was reached with Tab. (The probe also
  found one link inside a closed `details` block on the certificates page; it becomes reachable after the block is
  opened.)
- A focus ring was drawn on every stop (1,495 stops over the ten pages, none covered by another element). It was blue
  (`rgb(29, 95, 214)`, 3 px wide) on 1,488 of them and gold (`rgb(217, 164, 65)`, 3 px wide) on the other 7: the four
  dropdowns and the "Clear filters" button on the resource hub, and the two search boxes (the library page box and
  the search panel box). The gold ring is faint on the light background; fixed in this pass, see below.
- The skip link ("Skip to content") is the first stop on every page and moves focus to the main content.
- The search dialog keeps focus inside while it is open, Tab moves through the results, Escape closes it and focus
  returns to where it was.
- The resource filters, the library search box and the certificate verify form can be used with the keyboard alone.
- Problems found: a faint focus ring on text inputs (fixed in this pass, see below) and the very long tab order on
  the resource hub (filed, #69).

Tab stops counted per page (the count includes the few presses where focus passed through the browser itself):

| Page | Tab stops |
| --- | --- |
| home | 32 |
| train | 56 |
| lesson | 69 |
| track | 31 |
| resources | 888 |
| search (`/library/`) | 273 |
| template | 57 |
| events | 25 |
| sensei | 33 |
| certificates | 41 |

### 2. Screen reader

**Method.** Orca 50.3 was run on a private virtual display with its own accessibility bus, with a silent speech
engine, so that everything Orca "said" was written to its debug log. Chromium was started with accessibility turned
on. The keys were sent as real keyboard events (Tab, Down, H for the next heading, B for the next button, F for the
next form field, M for the next landmark, `/` for search). The log lines were matched to the key that caused them by
time stamp. This was done twice, because the first run had passes where the page did not have focus and Orca was
still starting.

**What counts and what does not.**

- Run 1: the heading, button, form field and landmark key passes gave real speech on home, train, lesson, search,
  template, events, sensei and certificates. Its Down arrow and Tab passes were invalid (focus was in the browser's
  own toolbar) and are not used. Its heading pass on the track page and the resource hub also gave nothing useful.
- Run 2: after fixing the driver, most of the Tab and Down passes still gave no speech from the page and are not
  used. What did work is listed below.
- So: Orca confirmed the heading structure and the names of controls on eight pages, and the reading order of one
  (the resource hub). The track page and the resource hub's headings were **not** checked with Orca; they were
  checked only in the accessibility tree.

**What was observed (and only this).**

- Headings on home, train, lesson, search, template, events, sensei and certificates were read in order with
  sensible levels and names. The lesson headings ran 1, 2, 3 with numbered sections as written.
- The header was read as "banner, navigation, Primary", with seven links and "(Current page)" on the current
  one. The search button was read with its shortcut ("Search, button, / Ctrl+K Meta+K"). The theme button was read
  as "Switch to dark theme, button".
- On `/train/` each week is a toggle button: "Mark complete: Week 1, See the whole product, toggle button not pressed".
  After pressing Space Orca said "pressed" and then a progress bar value ("Progress bar 1, 10 percent"); after the
  second press "not pressed" and "0 percent". The name of the bar was not spoken in that announcement.
- The search dialog opened with `/` and was read as "Search the whole site, search, entry". After typing "epic" Orca
  said "201 results for epic". Tab then moved into a list of results and read each link's name.
- Reading with the Down arrow on the resource hub gave a sensible order: banner, navigation, main content, the
  heading level 1, the intro paragraph, the "Back to the library" link.
- Orca also showed three problems. The `/train/` path headings were read run together as "Developer6 weeks"
  (filed, #70). The empty-schedule block on `/events/` was announced as "status bar" (filed, #71; seen once). The
  certificate verify form was read as a plain "search" landmark with no name, next to the site search (fixed, below).
  A fourth problem, the resource hub jumping from heading level 1 to level 3, was found in the accessibility tree,
  not in Orca (fixed, below).

**Not observed.** Orca's reading of the track page, the template page's tables, the verify form's result message and
the filter results on the resource hub. No test of NVDA, JAWS or VoiceOver. No listening.

### 3. Phone at 200 percent zoom

**Method.** Chromium at a 195 CSS pixel wide viewport, device scale 4, touch on, which has the same layout as a 390
pixel wide phone at 200 percent. For each page the viewport was narrowed in 5 pixel steps from 320 pixels and the
narrowest width with no sideways scroll of the whole page was recorded. Screenshots were looked at. A tap test
checked what element sits at the centre of the rank cards.

**Results.**

- At 320 CSS pixels (the width that WCAG 1.4.10 Reflow uses) and at 640 pixels, no page scrolled sideways.
- At 195 pixels, nine of ten pages still scroll sideways after the fixes in this pass. Narrowest width with no
  sideways scroll, after the fixes:

| Page | Narrowest width that fits (CSS px) |
| --- | --- |
| home | 215 |
| train | 235 |
| lesson | 200 |
| track | 230 |
| resources | fits down to 150 |
| search | 285 |
| template | 210 |
| events | 210 |
| sensei | 285 |
| certificates | 285 |

  Before the fixes the header alone needed 295 pixels, so every page scrolled sideways and the menu and search
  buttons were pushed off the screen. The remaining cases are filed as one issue (#68).
- 195 pixels is stricter than the WCAG reference width. These results are about a phone with large zoom; they are not
  a failure of the 320 pixel rule.

## Findings

### Fixed in this merge request

| What was wrong | How it was found | Fix |
| --- | --- | --- |
| The header was about 295 px wide. At a phone with 200 percent zoom every page scrolled sideways and the menu and search buttons were off the screen. | Zoom test, 195 px | Below 296 px wide the logo shows only the gold brackets (`src/components/Logo.astro`). |
| The sponsor logo plate was about 195 px wide and did not shrink, which set the minimum page width at 211 px on several pages. | Zoom test, 195 px | The plate may shrink on narrow screens (`src/components/SponsorBand.astro`). |
| On the train page, the Developer and Master Developer cards had a dead strip down the middle on a phone: the rotated arrow box sat on top of the links and caught taps. | Zoom test, element at the centre of the card | `pointer-events: none` on the arrow (`src/components/RankPath.astro`). After the fix the tap test finds the list, not the arrow. Not tested by touching a real phone. |
| The focus ring on the library search box, the search panel input and the resource filters (7 controls) was gold on a light background (contrast 2.08 to 1 on the light input, worked out from the colour values; WCAG 1.4.11 asks for 3 to 1). | Keyboard test, computed colours | They now use the site's blue focus colour (`src/pages/library/index.astro`, `src/components/SearchPanel.astro`, `src/pages/library/resources.astro`). |
| The certificate verify form was a `search` landmark with no name, so Orca read it as "search", the same as the site search. | Orca | `aria-label="Verify a certificate"` (`src/pages/certificates.astro`). |
| The resource hub jumped from heading level 1 to level 3. | Accessibility tree, then Orca on the other pages' headings | A hidden "All resources" level 2 heading before the list (`src/pages/library/resources.astro`). |

### Filed as issues

| Issue | Finding |
| --- | --- |
| [#68](https://git.developerdojo.org/Curiosity-Corp/developerdojo/-/work_items/68) | Nine pages still scroll sideways at 195 px wide (a phone at 200 percent zoom). |
| [#69](https://git.developerdojo.org/Curiosity-Corp/developerdojo/-/work_items/69) | The resource hub needs 888 Tab presses to pass, with no way to skip past the list. |
| [#70](https://git.developerdojo.org/Curiosity-Corp/developerdojo/-/work_items/70) | Orca reads the `/train/` path headings run together ("Developer6 weeks"). |
| [#71](https://git.developerdojo.org/Curiosity-Corp/developerdojo/-/work_items/71) | Static "nothing here yet" blocks carry `role="status"` and are announced as a status bar. |

### Fixed after this pass

The four issues above were fixed in later merge requests, on 4 November 2026. These were checked with the same emulated tools, not by a person.

| Issue | Merge request | Result |
| --- | --- | --- |
| #69 | !73 | A "Skip past the list of resources" link before the list. |
| #70 | !73 | A hidden comma between the path name and its chip, so it is read as "Developer, 6 weeks". |
| #71 | !73 | `role="status"` removed from static empty states. |
| #68 | !76 | At 195 px, 75 of 263 pages scrolled sideways before the fix and 0 after. At 320, 640 and 1280 px, 0 pages scroll sideways after the fix. The e2e checks now cover 14 pages at 195 and 320 px. |

The person-led repeat of this pass is #72.

### Not looked at

- Colour contrast of body text and the dark theme (the pipeline's automatic scan already checks contrast).
- Video, audio and downloads (the site has none that were tested).
- Right-to-left text and languages other than English.
- Firefox, Safari, Edge, real phones and tablets, and the live site.

## How to repeat this

Follow the numbered steps in [handbook section 8](handbook.md#8-quarterly-and-half-yearly-jobs). Add a new pass above
this one, dated, and keep the same three headings so passes can be compared.
