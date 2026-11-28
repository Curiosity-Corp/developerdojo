# UX QA checklist: accessibility, usability and responsive

For your own screens and build, in UX-005 to UX-008 and the Randori. Each item says what to check, how to check it
without paid tools, and when it passes. The last column says how the Pocket Invoice example was checked, and where to
read the result, so you can compare your report with a real one.

Mark each item pass, not yet (with the one change that would make it pass) or not checked (with why). A checklist
with every item passed is not a WCAG conformance claim and not a usability study; it is the minimum a reviewer will
look for.

## Accessibility

| Item | How to check it | Passes when | Pocket Invoice |
| --- | --- | --- | --- |
| A1. Every field has a visible label | Look at each field; in the browser, inspect it and find its label element. | Each field's label is on screen and tied to it (label for, or aria-labelledby). | The browser tests find every field by its label in all 11 states: /examples/ux-pathway/qa-report.md |
| A2. One heading names each screen | Read each screen's first heading. | Each screen and dialog has one heading that says what it is for. | Checked in every state; focus moves to the heading after each change: /examples/ux-pathway/qa-report.md |
| A3. Focus follows reading order | Press Tab through each screen. | Focus reaches the controls top to bottom, then left to right, and is always visible. | Where focus lands after each change is in the QA report (/examples/ux-pathway/qa-report.md); Randori round D's screens are walked with the Tab key on every pipeline: /examples/ux-pathway/generated/randori/randori.md |
| A4. Errors are announced and linked | Submit each form with a mistake. | An error summary takes focus, names each problem and links to its field; the field says the same. | The two error states are driven by the tests: /examples/ux-pathway/qa-report.md |
| A5. Dialogs keep and return focus | Open and close each dialog with the keyboard; press Escape. | Focus moves into the dialog, stays there, and returns to the control that opened it. | The discard dialog: /examples/ux-pathway/qa-report.md |
| A6. Text and controls have enough contrast | Use the Dojo contrast checker (/katas/contrast-check) on each colour pair. | Text at least 4.5:1 (3:1 for large text); control edges and focus rings at least 3:1. | Every token pair and every drawn text, computed on each pipeline: /examples/ux-pathway/generated/fidelity-report.md |
| A7. No automated finding | Run axe (the free browser extension or @axe-core/playwright) in every state, in light and dark. | No serious or critical result in any state. | 11 of 11 states, both themes, two browser widths: /examples/ux-pathway/qa-report.md |

## Responsive

| Item | How to check it | Passes when | Pocket Invoice |
| --- | --- | --- | --- |
| R1. No sideways scroll at 320 px | Narrow the browser window, or use the device toolbar, to 320 px wide. | Nothing scrolls sideways, and nothing is cut off. | Every state at 320 px: /examples/ux-pathway/qa-report.md |
| R2. Targets are big enough | Measure each button and link in the inspector. | Every control is at least 24 by 24 px (WCAG 2.5.8), or has that much space around it. | The browser tests replay every usability task in the clickable prototype at 1440, 390 and 320 px and measure each control on the way; the tasks: /examples/ux-pathway/generated/usability/walkthrough.md |
| R3. The build matches the design at each width | Compare your page with your design at phone and desktop width, value by value. | Colour, type size and weight, fills, borders, control height and order match the design. | Every element in every state, at 390 px and 1440 px: /examples/ux-pathway/build-fidelity-phone.md and /examples/ux-pathway/build-fidelity-desktop.md |
| R4. Text fits | Read every line at both widths, with the longest real content. | No text overflows its box or overlaps another element. | Every line of the high-fidelity screens, measured in the browser: /examples/ux-pathway/generated/fidelity-report.md |

## Usability

| Item | How to check it | Passes when | Pocket Invoice |
| --- | --- | --- | --- |
| U1. Each task can be done in a few steps | Write each task as a scenario with a start and a goal; count the steps of its shortest path. | Every goal is reachable within the step budget you set before you counted. | 7 tasks walked through the flow and clicked in the prototype: /examples/ux-pathway/generated/usability/walkthrough.md |
| U2. Every error leads back to the goal | From each error state, follow the way out. | Every error has a way back that keeps what the user typed and still reaches the goal. | Checked for every error on every task path: /examples/ux-pathway/generated/usability/walkthrough.md |
| U3. Words say what happened and what to do | Read each error and confirmation aloud. | Each names the problem or the result and the next step, with no code, jargon or blame. | Error texts follow the GOV.UK error summary pattern: /examples/ux-pathway/README.md |
| U4. Someone else can do it without help | Run a moderated session with the blank sheet: read the task, watch, do not help, write where they stop. | They reach each goal; every stop is written down with what you changed or why not. | Not checked: no session with a participant has been run. The blank sheet: /examples/ux-pathway/generated/usability/session-sheet.md |

## What this checklist does not cover

- Screen reader output and zoom to 400 %: check them with a screen reader and the browser's zoom if you can.
- Use by real users, including people who use assistive technology: only sessions with them can show that.
