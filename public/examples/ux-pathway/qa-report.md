# Pocket Invoice: accessibility and responsive QA report

Copied unedited from the site's continuous integration run of 20 November 2026, which checked this page in two browser projects: desktop (1440 by 900 px) and mobile (Pixel 7, 390 by 844 px). The same tests run on every change to the site; this file is the record of one run.

## Desktop project

Produced by the site’s browser tests (Playwright with axe-core) on the desktop project. Each state of the flow is reached by using the page, then checked.

- axe: rules tagged WCAG 2.0, 2.1 and 2.2 A and AA; serious and critical results count as failures.
- Reflow: the viewport is narrowed to 320 px and the page must not scroll sideways.
- Focus: where keyboard focus is after the state change.

Not covered: screen reader output, zoom to 400 %, and use by people. A passing report is not a WCAG conformance claim.

| State | axe, light | axe, dark | Reflow at 320 px | Focus after the change |
| --- | --- | --- | --- | --- |
| Create your workspace (signup) | none | none | no sideways scroll | page load: browser default |
| Sign in (sign-in) | none | none | no sideways scroll | the state heading |
| Create your workspace: fix two problems (signup-error) | none | none | no sideways scroll | the error summary |
| Invoices: none yet (invoices-empty) | none | none | no sideways scroll | the state heading |
| New invoice (invoice-new) | none | none | no sideways scroll | the state heading |
| Discard this invoice? (discard-dialog) | none | none | no sideways scroll | Keep editing, inside the dialog |
| New invoice: fix two problems (invoice-new-error) | none | none | no sideways scroll | the error summary |
| Check the invoice (invoice-review) | none | none | no sideways scroll | the state heading |
| The invoice was not sent (send-error) | none | none | no sideways scroll | the state heading |
| Invoice INV-0001 sent (invoice-sent) | none | none | no sideways scroll | the state heading |
| Invoices: one sent (invoices-list) | none | none | no sideways scroll | the state heading |

States checked: 11 of 11. Transitions in the flow: 19.

## Mobile project

Produced by the site’s browser tests (Playwright with axe-core) on the mobile project. Each state of the flow is reached by using the page, then checked.

- axe: rules tagged WCAG 2.0, 2.1 and 2.2 A and AA; serious and critical results count as failures.
- Reflow: the viewport is narrowed to 320 px and the page must not scroll sideways.
- Focus: where keyboard focus is after the state change.

Not covered: screen reader output, zoom to 400 %, and use by people. A passing report is not a WCAG conformance claim.

| State | axe, light | axe, dark | Reflow at 320 px | Focus after the change |
| --- | --- | --- | --- | --- |
| Create your workspace (signup) | none | none | no sideways scroll | page load: browser default |
| Sign in (sign-in) | none | none | no sideways scroll | the state heading |
| Create your workspace: fix two problems (signup-error) | none | none | no sideways scroll | the error summary |
| Invoices: none yet (invoices-empty) | none | none | no sideways scroll | the state heading |
| New invoice (invoice-new) | none | none | no sideways scroll | the state heading |
| Discard this invoice? (discard-dialog) | none | none | no sideways scroll | Keep editing, inside the dialog |
| New invoice: fix two problems (invoice-new-error) | none | none | no sideways scroll | the error summary |
| Check the invoice (invoice-review) | none | none | no sideways scroll | the state heading |
| The invoice was not sent (send-error) | none | none | no sideways scroll | the state heading |
| Invoice INV-0001 sent (invoice-sent) | none | none | no sideways scroll | the state heading |
| Invoices: one sent (invoices-list) | none | none | no sideways scroll | the state heading |

States checked: 11 of 11. Transitions in the flow: 19.
