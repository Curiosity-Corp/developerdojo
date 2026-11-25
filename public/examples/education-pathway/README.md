# Education pathway files

The worked example for the education pathway (/katas/education-pathway): from a learning page to a checked
accessibility report. Everything under `generated/` is computed by `tools/education_pathway.py`. The site's CI reruns
the script on every pipeline (job `education_pathway`) and fails if any file differs from the published copy, so
these results are not typed by hand.

## Files

| File | What it is | Terms |
| --- | --- | --- |
| `inputs/matrices.html` | The Wikibooks page "High School Mathematics Extensions/Matrices" (revision 266672) as Wikibooks served it to a reader on 2026-11-25, byte for byte | CC BY-SA 4.0, Wikibooks contributors (see below) |
| `inputs/language-subtag-registry.txt` | The IANA Language Subtag Registry, File-Date 2026-11-18, byte for byte | IANA registry, published for anyone to use |
| `inputs/act-rules/testcases.json` and `inputs/act-rules/testcases/` | The W3C ACT Rules test case index and the 36 approved test cases of the four rules, byte for byte | W3C Software and Document License; notice in `inputs/act-rules/NOTICE.md` |
| `tools/education_pathway.py` | The script: the four rules, their checks against the W3C test cases, the page inspection, the rule outcomes, the WCAG report and the Randori cards. Python 3.12 standard library only | MIT, Developer Dojo |
| `tools/fetch_input.py` | Downloads the inputs for a maintainer, checks the page revision and prints each SHA-256. CI never runs it | MIT, Developer Dojo |
| `generated/reference-checks.json` | Each W3C test case, its expected outcome and the script's outcome | MIT, Developer Dojo |
| `generated/inspection.json` | The page's title, language, viewport, headings, images, links and tables, as served (EDU-001) | MIT, Developer Dojo; heading text quoted from the page (CC BY-SA 4.0) |
| `generated/rules.json` | The four rules' outcomes on the page, target by target (EDU-002) | MIT, Developer Dojo |
| `generated/report.json` | What the outcomes say about WCAG 2.2 success criteria 1.4.4, 2.4.2 and 3.1.1, and what they leave untested (EDU-003) | MIT, Developer Dojo |
| `generated/randori/cards.json` | The four Randori cards recomputed | MIT, Developer Dojo |
| `generated/manifest.json` | Python version, the method, the SHA-256 of every input and the list of outputs | MIT, Developer Dojo |
| `generated/summary.md` | The results in one page | MIT, Developer Dojo |

## Sources

- **WCAG 2.2**, Web Content Accessibility Guidelines 2.2, W3C Recommendation, 12 December 2024,
  `https://www.w3.org/TR/WCAG22/`, read on 2026-11-25. The report uses success criteria 1.4.4 Resize text
  (Level AA), 2.4.2 Page Titled (Level A) and 3.1.1 Language of Page (Level A).
- **W3C ACT Rules**, `https://www.w3.org/WAI/standards-guidelines/act/rules/`, read on 2026-11-25: 2779a5 HTML page
  has non-empty title (latest version 31 August 2023), b5c3f8 HTML page has lang attribute (31 August 2023), bf051a
  HTML page lang attribute has valid language tag (proposed version 21 June 2022) and b4f0c3 Meta viewport allows for
  zoom (25 October 2022). The script follows each rule's applicability, expectations and definitions, and the outcome
  mapping each rule page gives. The test cases come from
  `https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases.json`; only those marked approved are used.
- **IANA Language Subtag Registry**,
  `https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry`, File-Date 2026-11-18,
  downloaded on 2026-11-25. The script reads the subtags whose Type is language.
- **The learning page.** "High School Mathematics Extensions/Matrices", an open textbook chapter on Wikibooks,
  `https://en.wikibooks.org/wiki/High_School_Mathematics_Extensions/Matrices`, revision 266672 (history:
  `https://en.wikibooks.org/w/index.php?title=High_School_Mathematics_Extensions/Matrices&action=history`),
  downloaded on 2026-11-25 as a reader receives it: 177,873 bytes, SHA-256
  `c42e87b501ee9cb8ee7e8a6d9ac4d60ca496a909f4ad5c52f47b0599d1dcd099`. Its text is available under the Creative
  Commons Attribution-ShareAlike 4.0 licence (`https://creativecommons.org/licenses/by-sa/4.0/`); the authors are the
  Wikibooks contributors listed in the history. It is served here unchanged; the Randori copies are changed in memory
  only and never published.
- **Why it matters in education.** In the United States, 28 CFR 35.200 (eCFR text current to 2026-11-20, read on
  2026-11-25) requires state and local government entities, which include public schools and universities, to make
  the web content they provide comply with WCAG 2.1 Level A and AA, from 26 April 2027 or 26 April 2028 depending on
  their size. The three success criteria checked here are in WCAG 2.0, 2.1 and 2.2.

## Method

1. **Reference checks.** For every approved test case of the four rules, the script decides the content type from the
   file extension (`.html` is text/html; `.svg` and `.xml` are not), parses the HTML with Python's HTML parser, runs
   the rule and compares the outcome (passed, failed or inapplicable) with the one the W3C publishes. A rule with
   several targets fails if any target fails. If one outcome differs, the script stops and writes nothing.
2. **Inspection (EDU-001).** The same parser reads the page as served, before any of its scripts run: the first
   `title`, the `lang` and `dir` of the `html` element, the viewport, every heading in order, every image's `alt`
   attribute, links and tables. Elements inside `svg` and `math` are left out, as the rules require for HTML titles.
3. **Rules (EDU-002).** The four rules run on the page. A known primary language tag is one whose first
   hyphen-separated subtag is a language subtag in the registry, compared without regard to case (rule bf051a's
   definition). The viewport rule reads `user-scalable` and `maximum-scale` as rule b4f0c3 states them.
4. **Report (EDU-003).** Each rule page maps outcomes to WCAG: any failed outcome means the success criterion is not
   satisfied; passed and inapplicable outcomes mean further testing is needed, because a rule tests only part of a
   criterion.
5. **Randori.** Each card makes one change to an in-memory copy of the page and reruns the rules.

## Rerun the checks

Python 3.12 (the CI image is `python:3.12-slim`); nothing to install:

    python3.12 -I tools/education_pathway.py . my-output
    diff -r my-output generated

Run it from this folder; it takes a second or two. The script removes and recreates the output folder you name, so
give it a new one. `diff` prints nothing when your results match the published ones. Another Python version changes
only the `python` field in `manifest.json`.

## Limits

- This is practice on one openly licensed textbook page, not an accessibility conformance claim or a legal
  compliance check of any site. Passing four automated rules says nothing about the other WCAG success criteria, and
  no accessibility specialist, assistive technology user or legal reviewer has reviewed it.
- Four rules only. Alternative text (1.1.1), headings and tables (1.3.1), contrast (1.4.3), keyboard use and every
  other criterion are not checked; the inspection counts images and headings but does not judge them.
- The page is read as served, without running its scripts or rendering it. A browser, a screen reader or a zoomed
  view can show problems this cannot.
- Rules c4a8a4 (the title describes the page) and ucwvc8 (the language matches the text) need a person and are not
  run.
- No learner has run these katas yet, and no learner's data is used anywhere: the inputs are a public page, a
  public registry and the W3C's own test files.
