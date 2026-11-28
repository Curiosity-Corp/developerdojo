# Pocket Invoice: visual-fidelity report, design against build

Produced by the site’s browser tests (Playwright) on the mobile project, against the phone high-fidelity screens. The working page is driven into each state of the flow; each element is then read twice, from its group in the generated SVG screen and from the page’s computed styles, and every property the design defines is compared.

- Compared, must match exactly: text colour, size and weight; fill, border colour and width; control height; underlines; the order of the elements.
- A border drawn in its fill’s own colour counts as no border: it looks the same, and it keeps the button’s edge in forced-colours mode.
- Recorded, not compared: where each element starts in its column and how much of the column it fills. The design measures text with its own estimate, the page with the browser’s font, so these differ by a few pixels.

Not covered: a pixel comparison of whole screens, the fills of containers around the elements (the page puts the sent message on a green panel the design does not draw), the brand font (the test browser has no copy of Source Sans Pro), hover and focus styles, and the dark theme. A matching report says the page follows its design; it does not say the design is usable.

## Result

States compared: 11 of 11. Properties compared: 368. Matching: 368. Different: 0.

## Every comparison

| State | Element | Component | Property | Design | Build | Match |
| --- | --- | --- | --- | --- | --- | --- |
| signup | app bar | AppBar | background | #ffffff | #ffffff | yes |
| signup | app bar | AppBar | height | 64 | 64 | yes |
| signup | app bar | AppBar | border-bottom-color | #d0d5dd | #d0d5dd | yes |
| signup | app bar | AppBar | wordmark color | #101828 | #101828 | yes |
| signup | app bar | AppBar | wordmark font-size | 19 | 19 | yes |
| signup | app bar | AppBar | wordmark font-weight | 700 | 700 | yes |
| signup | heading “Create your workspace” | Heading/Page | color | #101828 | #101828 | yes |
| signup | heading “Create your workspace” | Heading/Page | font-size | 24 | 24 | yes |
| signup | heading “Create your workspace” | Heading/Page | font-weight | 700 | 700 | yes |
| signup | field “Email address” | Field/Default | label color | #101828 | #101828 | yes |
| signup | field “Email address” | Field/Default | label font-size | 16 | 16 | yes |
| signup | field “Email address” | Field/Default | label font-weight | 700 | 700 | yes |
| signup | field “Email address” | Field/Default | input background | #ffffff | #ffffff | yes |
| signup | field “Email address” | Field/Default | input border-color | #667085 | #667085 | yes |
| signup | field “Email address” | Field/Default | input border-width | 2 | 2 | yes |
| signup | field “Email address” | Field/Default | input height | 48 | 48 | yes |
| signup | field “Workspace name” | Field/Default | label color | #101828 | #101828 | yes |
| signup | field “Workspace name” | Field/Default | label font-size | 16 | 16 | yes |
| signup | field “Workspace name” | Field/Default | label font-weight | 700 | 700 | yes |
| signup | field “Workspace name” | Field/Default | input background | #ffffff | #ffffff | yes |
| signup | field “Workspace name” | Field/Default | input border-color | #667085 | #667085 | yes |
| signup | field “Workspace name” | Field/Default | input border-width | 2 | 2 | yes |
| signup | field “Workspace name” | Field/Default | input height | 48 | 48 | yes |
| signup | primary button “Create workspace” | Button/Primary | background | #175cd3 | #175cd3 | yes |
| signup | primary button “Create workspace” | Button/Primary | border-color | none | none | yes |
| signup | primary button “Create workspace” | Button/Primary | border-width | none | none | yes |
| signup | primary button “Create workspace” | Button/Primary | height | 48 | 48 | yes |
| signup | primary button “Create workspace” | Button/Primary | label color | #ffffff | #ffffff | yes |
| signup | primary button “Create workspace” | Button/Primary | label font-size | 16 | 16 | yes |
| signup | primary button “Create workspace” | Button/Primary | label font-weight | 700 | 700 | yes |
| signup | link button “I already have an account” | Button/Link | color | #175cd3 | #175cd3 | yes |
| signup | link button “I already have an account” | Button/Link | font-size | 16 | 16 | yes |
| signup | link button “I already have an account” | Button/Link | font-weight | 400 | 400 | yes |
| signup | link button “I already have an account” | Button/Link | underline | yes | yes | yes |
| signup | all 5 elements | Screen | order, top to bottom | flow order | flow order | yes |
| sign-in | app bar | AppBar | background | #ffffff | #ffffff | yes |
| sign-in | app bar | AppBar | height | 64 | 64 | yes |
| sign-in | app bar | AppBar | border-bottom-color | #d0d5dd | #d0d5dd | yes |
| sign-in | app bar | AppBar | wordmark color | #101828 | #101828 | yes |
| sign-in | app bar | AppBar | wordmark font-size | 19 | 19 | yes |
| sign-in | app bar | AppBar | wordmark font-weight | 700 | 700 | yes |
| sign-in | heading “Sign in” | Heading/Page | color | #101828 | #101828 | yes |
| sign-in | heading “Sign in” | Heading/Page | font-size | 24 | 24 | yes |
| sign-in | heading “Sign in” | Heading/Page | font-weight | 700 | 700 | yes |
| sign-in | text “Signing in is not part of this practice…” | Text/Body | color | #344054 | #344054 | yes |
| sign-in | text “Signing in is not part of this practice…” | Text/Body | font-size | 16 | 16 | yes |
| sign-in | text “Signing in is not part of this practice…” | Text/Body | font-weight | 400 | 400 | yes |
| sign-in | secondary button “Back to create a workspace” | Button/Secondary | background | #ffffff | #ffffff | yes |
| sign-in | secondary button “Back to create a workspace” | Button/Secondary | border-color | #667085 | #667085 | yes |
| sign-in | secondary button “Back to create a workspace” | Button/Secondary | border-width | 2 | 2 | yes |
| sign-in | secondary button “Back to create a workspace” | Button/Secondary | height | 48 | 48 | yes |
| sign-in | secondary button “Back to create a workspace” | Button/Secondary | label color | #101828 | #101828 | yes |
| sign-in | secondary button “Back to create a workspace” | Button/Secondary | label font-size | 16 | 16 | yes |
| sign-in | secondary button “Back to create a workspace” | Button/Secondary | label font-weight | 700 | 700 | yes |
| sign-in | all 3 elements | Screen | order, top to bottom | flow order | flow order | yes |
| signup-error | app bar | AppBar | background | #ffffff | #ffffff | yes |
| signup-error | app bar | AppBar | height | 64 | 64 | yes |
| signup-error | app bar | AppBar | border-bottom-color | #d0d5dd | #d0d5dd | yes |
| signup-error | app bar | AppBar | wordmark color | #101828 | #101828 | yes |
| signup-error | app bar | AppBar | wordmark font-size | 19 | 19 | yes |
| signup-error | app bar | AppBar | wordmark font-weight | 700 | 700 | yes |
| signup-error | error-summary | ErrorSummary | background | #ffffff | #ffffff | yes |
| signup-error | error-summary | ErrorSummary | border-color | #b42318 | #b42318 | yes |
| signup-error | error-summary | ErrorSummary | border-width | 5 | 5 | yes |
| signup-error | error-summary | ErrorSummary | title color | #101828 | #101828 | yes |
| signup-error | error-summary | ErrorSummary | title font-size | 19 | 19 | yes |
| signup-error | error-summary | ErrorSummary | title font-weight | 700 | 700 | yes |
| signup-error | error-summary | ErrorSummary | item color | #b42318 | #b42318 | yes |
| signup-error | error-summary | ErrorSummary | item font-size | 16 | 16 | yes |
| signup-error | error-summary | ErrorSummary | item font-weight | 700 | 700 | yes |
| signup-error | error-summary | ErrorSummary | item underline | yes | yes | yes |
| signup-error | heading “Create your workspace” | Heading/Page | color | #101828 | #101828 | yes |
| signup-error | heading “Create your workspace” | Heading/Page | font-size | 24 | 24 | yes |
| signup-error | heading “Create your workspace” | Heading/Page | font-weight | 700 | 700 | yes |
| signup-error | field “Email address” with error | Field/Error | label color | #101828 | #101828 | yes |
| signup-error | field “Email address” with error | Field/Error | label font-size | 16 | 16 | yes |
| signup-error | field “Email address” with error | Field/Error | label font-weight | 700 | 700 | yes |
| signup-error | field “Email address” with error | Field/Error | input background | #ffffff | #ffffff | yes |
| signup-error | field “Email address” with error | Field/Error | input border-color | #b42318 | #b42318 | yes |
| signup-error | field “Email address” with error | Field/Error | input border-width | 2 | 2 | yes |
| signup-error | field “Email address” with error | Field/Error | input height | 48 | 48 | yes |
| signup-error | field “Email address” with error | Field/Error | bar color | #b42318 | #b42318 | yes |
| signup-error | field “Email address” with error | Field/Error | bar width | 5 | 5 | yes |
| signup-error | field “Email address” with error | Field/Error | error color | #b42318 | #b42318 | yes |
| signup-error | field “Email address” with error | Field/Error | error font-size | 16 | 16 | yes |
| signup-error | field “Email address” with error | Field/Error | error font-weight | 700 | 700 | yes |
| signup-error | field “Workspace name” with error | Field/Error | label color | #101828 | #101828 | yes |
| signup-error | field “Workspace name” with error | Field/Error | label font-size | 16 | 16 | yes |
| signup-error | field “Workspace name” with error | Field/Error | label font-weight | 700 | 700 | yes |
| signup-error | field “Workspace name” with error | Field/Error | input background | #ffffff | #ffffff | yes |
| signup-error | field “Workspace name” with error | Field/Error | input border-color | #b42318 | #b42318 | yes |
| signup-error | field “Workspace name” with error | Field/Error | input border-width | 2 | 2 | yes |
| signup-error | field “Workspace name” with error | Field/Error | input height | 48 | 48 | yes |
| signup-error | field “Workspace name” with error | Field/Error | bar color | #b42318 | #b42318 | yes |
| signup-error | field “Workspace name” with error | Field/Error | bar width | 5 | 5 | yes |
| signup-error | field “Workspace name” with error | Field/Error | error color | #b42318 | #b42318 | yes |
| signup-error | field “Workspace name” with error | Field/Error | error font-size | 16 | 16 | yes |
| signup-error | field “Workspace name” with error | Field/Error | error font-weight | 700 | 700 | yes |
| signup-error | primary button “Create workspace” | Button/Primary | background | #175cd3 | #175cd3 | yes |
| signup-error | primary button “Create workspace” | Button/Primary | border-color | none | none | yes |
| signup-error | primary button “Create workspace” | Button/Primary | border-width | none | none | yes |
| signup-error | primary button “Create workspace” | Button/Primary | height | 48 | 48 | yes |
| signup-error | primary button “Create workspace” | Button/Primary | label color | #ffffff | #ffffff | yes |
| signup-error | primary button “Create workspace” | Button/Primary | label font-size | 16 | 16 | yes |
| signup-error | primary button “Create workspace” | Button/Primary | label font-weight | 700 | 700 | yes |
| signup-error | all 5 elements | Screen | order, top to bottom | flow order | flow order | yes |
| invoices-empty | app bar | AppBar | background | #ffffff | #ffffff | yes |
| invoices-empty | app bar | AppBar | height | 64 | 64 | yes |
| invoices-empty | app bar | AppBar | border-bottom-color | #d0d5dd | #d0d5dd | yes |
| invoices-empty | app bar | AppBar | wordmark color | #101828 | #101828 | yes |
| invoices-empty | app bar | AppBar | wordmark font-size | 19 | 19 | yes |
| invoices-empty | app bar | AppBar | wordmark font-weight | 700 | 700 | yes |
| invoices-empty | heading “Invoices” | Heading/Page | color | #101828 | #101828 | yes |
| invoices-empty | heading “Invoices” | Heading/Page | font-size | 24 | 24 | yes |
| invoices-empty | heading “Invoices” | Heading/Page | font-weight | 700 | 700 | yes |
| invoices-empty | text “You have not sent an invoice yet. Your …” | Text/Body | color | #344054 | #344054 | yes |
| invoices-empty | text “You have not sent an invoice yet. Your …” | Text/Body | font-size | 16 | 16 | yes |
| invoices-empty | text “You have not sent an invoice yet. Your …” | Text/Body | font-weight | 400 | 400 | yes |
| invoices-empty | primary button “Create your first invoice” | Button/Primary | background | #175cd3 | #175cd3 | yes |
| invoices-empty | primary button “Create your first invoice” | Button/Primary | border-color | none | none | yes |
| invoices-empty | primary button “Create your first invoice” | Button/Primary | border-width | none | none | yes |
| invoices-empty | primary button “Create your first invoice” | Button/Primary | height | 48 | 48 | yes |
| invoices-empty | primary button “Create your first invoice” | Button/Primary | label color | #ffffff | #ffffff | yes |
| invoices-empty | primary button “Create your first invoice” | Button/Primary | label font-size | 16 | 16 | yes |
| invoices-empty | primary button “Create your first invoice” | Button/Primary | label font-weight | 700 | 700 | yes |
| invoices-empty | all 3 elements | Screen | order, top to bottom | flow order | flow order | yes |
| invoice-new | app bar | AppBar | background | #ffffff | #ffffff | yes |
| invoice-new | app bar | AppBar | height | 64 | 64 | yes |
| invoice-new | app bar | AppBar | border-bottom-color | #d0d5dd | #d0d5dd | yes |
| invoice-new | app bar | AppBar | wordmark color | #101828 | #101828 | yes |
| invoice-new | app bar | AppBar | wordmark font-size | 19 | 19 | yes |
| invoice-new | app bar | AppBar | wordmark font-weight | 700 | 700 | yes |
| invoice-new | heading “New invoice” | Heading/Page | color | #101828 | #101828 | yes |
| invoice-new | heading “New invoice” | Heading/Page | font-size | 24 | 24 | yes |
| invoice-new | heading “New invoice” | Heading/Page | font-weight | 700 | 700 | yes |
| invoice-new | field “Client name” | Field/Default | label color | #101828 | #101828 | yes |
| invoice-new | field “Client name” | Field/Default | label font-size | 16 | 16 | yes |
| invoice-new | field “Client name” | Field/Default | label font-weight | 700 | 700 | yes |
| invoice-new | field “Client name” | Field/Default | input background | #ffffff | #ffffff | yes |
| invoice-new | field “Client name” | Field/Default | input border-color | #667085 | #667085 | yes |
| invoice-new | field “Client name” | Field/Default | input border-width | 2 | 2 | yes |
| invoice-new | field “Client name” | Field/Default | input height | 48 | 48 | yes |
| invoice-new | field “Client email” | Field/Default | label color | #101828 | #101828 | yes |
| invoice-new | field “Client email” | Field/Default | label font-size | 16 | 16 | yes |
| invoice-new | field “Client email” | Field/Default | label font-weight | 700 | 700 | yes |
| invoice-new | field “Client email” | Field/Default | input background | #ffffff | #ffffff | yes |
| invoice-new | field “Client email” | Field/Default | input border-color | #667085 | #667085 | yes |
| invoice-new | field “Client email” | Field/Default | input border-width | 2 | 2 | yes |
| invoice-new | field “Client email” | Field/Default | input height | 48 | 48 | yes |
| invoice-new | field “What the work was” | Field/Default | label color | #101828 | #101828 | yes |
| invoice-new | field “What the work was” | Field/Default | label font-size | 16 | 16 | yes |
| invoice-new | field “What the work was” | Field/Default | label font-weight | 700 | 700 | yes |
| invoice-new | field “What the work was” | Field/Default | input background | #ffffff | #ffffff | yes |
| invoice-new | field “What the work was” | Field/Default | input border-color | #667085 | #667085 | yes |
| invoice-new | field “What the work was” | Field/Default | input border-width | 2 | 2 | yes |
| invoice-new | field “What the work was” | Field/Default | input height | 48 | 48 | yes |
| invoice-new | field “Amount in US dollars” | Field/Default | label color | #101828 | #101828 | yes |
| invoice-new | field “Amount in US dollars” | Field/Default | label font-size | 16 | 16 | yes |
| invoice-new | field “Amount in US dollars” | Field/Default | label font-weight | 700 | 700 | yes |
| invoice-new | field “Amount in US dollars” | Field/Default | input background | #ffffff | #ffffff | yes |
| invoice-new | field “Amount in US dollars” | Field/Default | input border-color | #667085 | #667085 | yes |
| invoice-new | field “Amount in US dollars” | Field/Default | input border-width | 2 | 2 | yes |
| invoice-new | field “Amount in US dollars” | Field/Default | input height | 48 | 48 | yes |
| invoice-new | primary button “Check invoice” | Button/Primary | background | #175cd3 | #175cd3 | yes |
| invoice-new | primary button “Check invoice” | Button/Primary | border-color | none | none | yes |
| invoice-new | primary button “Check invoice” | Button/Primary | border-width | none | none | yes |
| invoice-new | primary button “Check invoice” | Button/Primary | height | 48 | 48 | yes |
| invoice-new | primary button “Check invoice” | Button/Primary | label color | #ffffff | #ffffff | yes |
| invoice-new | primary button “Check invoice” | Button/Primary | label font-size | 16 | 16 | yes |
| invoice-new | primary button “Check invoice” | Button/Primary | label font-weight | 700 | 700 | yes |
| invoice-new | secondary button “Cancel” | Button/Secondary | background | #ffffff | #ffffff | yes |
| invoice-new | secondary button “Cancel” | Button/Secondary | border-color | #667085 | #667085 | yes |
| invoice-new | secondary button “Cancel” | Button/Secondary | border-width | 2 | 2 | yes |
| invoice-new | secondary button “Cancel” | Button/Secondary | height | 48 | 48 | yes |
| invoice-new | secondary button “Cancel” | Button/Secondary | label color | #101828 | #101828 | yes |
| invoice-new | secondary button “Cancel” | Button/Secondary | label font-size | 16 | 16 | yes |
| invoice-new | secondary button “Cancel” | Button/Secondary | label font-weight | 700 | 700 | yes |
| invoice-new | all 7 elements | Screen | order, top to bottom | flow order | flow order | yes |
| discard-dialog | heading “Discard this invoice?” | Heading/Page | color | #101828 | #101828 | yes |
| discard-dialog | heading “Discard this invoice?” | Heading/Page | font-size | 24 | 24 | yes |
| discard-dialog | heading “Discard this invoice?” | Heading/Page | font-weight | 700 | 700 | yes |
| discard-dialog | text “What you entered will be lost.” | Text/Body | color | #344054 | #344054 | yes |
| discard-dialog | text “What you entered will be lost.” | Text/Body | font-size | 16 | 16 | yes |
| discard-dialog | text “What you entered will be lost.” | Text/Body | font-weight | 400 | 400 | yes |
| discard-dialog | primary button “Keep editing” | Button/Primary | background | #175cd3 | #175cd3 | yes |
| discard-dialog | primary button “Keep editing” | Button/Primary | border-color | none | none | yes |
| discard-dialog | primary button “Keep editing” | Button/Primary | border-width | none | none | yes |
| discard-dialog | primary button “Keep editing” | Button/Primary | height | 48 | 48 | yes |
| discard-dialog | primary button “Keep editing” | Button/Primary | label color | #ffffff | #ffffff | yes |
| discard-dialog | primary button “Keep editing” | Button/Primary | label font-size | 16 | 16 | yes |
| discard-dialog | primary button “Keep editing” | Button/Primary | label font-weight | 700 | 700 | yes |
| discard-dialog | secondary button “Discard” | Button/Secondary | background | #ffffff | #ffffff | yes |
| discard-dialog | secondary button “Discard” | Button/Secondary | border-color | #667085 | #667085 | yes |
| discard-dialog | secondary button “Discard” | Button/Secondary | border-width | 2 | 2 | yes |
| discard-dialog | secondary button “Discard” | Button/Secondary | height | 48 | 48 | yes |
| discard-dialog | secondary button “Discard” | Button/Secondary | label color | #101828 | #101828 | yes |
| discard-dialog | secondary button “Discard” | Button/Secondary | label font-size | 16 | 16 | yes |
| discard-dialog | secondary button “Discard” | Button/Secondary | label font-weight | 700 | 700 | yes |
| discard-dialog | all 4 elements | Screen | order, top to bottom | flow order | flow order | yes |
| invoice-new-error | app bar | AppBar | background | #ffffff | #ffffff | yes |
| invoice-new-error | app bar | AppBar | height | 64 | 64 | yes |
| invoice-new-error | app bar | AppBar | border-bottom-color | #d0d5dd | #d0d5dd | yes |
| invoice-new-error | app bar | AppBar | wordmark color | #101828 | #101828 | yes |
| invoice-new-error | app bar | AppBar | wordmark font-size | 19 | 19 | yes |
| invoice-new-error | app bar | AppBar | wordmark font-weight | 700 | 700 | yes |
| invoice-new-error | error-summary | ErrorSummary | background | #ffffff | #ffffff | yes |
| invoice-new-error | error-summary | ErrorSummary | border-color | #b42318 | #b42318 | yes |
| invoice-new-error | error-summary | ErrorSummary | border-width | 5 | 5 | yes |
| invoice-new-error | error-summary | ErrorSummary | title color | #101828 | #101828 | yes |
| invoice-new-error | error-summary | ErrorSummary | title font-size | 19 | 19 | yes |
| invoice-new-error | error-summary | ErrorSummary | title font-weight | 700 | 700 | yes |
| invoice-new-error | error-summary | ErrorSummary | item color | #b42318 | #b42318 | yes |
| invoice-new-error | error-summary | ErrorSummary | item font-size | 16 | 16 | yes |
| invoice-new-error | error-summary | ErrorSummary | item font-weight | 700 | 700 | yes |
| invoice-new-error | error-summary | ErrorSummary | item underline | yes | yes | yes |
| invoice-new-error | heading “New invoice” | Heading/Page | color | #101828 | #101828 | yes |
| invoice-new-error | heading “New invoice” | Heading/Page | font-size | 24 | 24 | yes |
| invoice-new-error | heading “New invoice” | Heading/Page | font-weight | 700 | 700 | yes |
| invoice-new-error | field “Client name” with error | Field/Error | label color | #101828 | #101828 | yes |
| invoice-new-error | field “Client name” with error | Field/Error | label font-size | 16 | 16 | yes |
| invoice-new-error | field “Client name” with error | Field/Error | label font-weight | 700 | 700 | yes |
| invoice-new-error | field “Client name” with error | Field/Error | input background | #ffffff | #ffffff | yes |
| invoice-new-error | field “Client name” with error | Field/Error | input border-color | #b42318 | #b42318 | yes |
| invoice-new-error | field “Client name” with error | Field/Error | input border-width | 2 | 2 | yes |
| invoice-new-error | field “Client name” with error | Field/Error | input height | 48 | 48 | yes |
| invoice-new-error | field “Client name” with error | Field/Error | bar color | #b42318 | #b42318 | yes |
| invoice-new-error | field “Client name” with error | Field/Error | bar width | 5 | 5 | yes |
| invoice-new-error | field “Client name” with error | Field/Error | error color | #b42318 | #b42318 | yes |
| invoice-new-error | field “Client name” with error | Field/Error | error font-size | 16 | 16 | yes |
| invoice-new-error | field “Client name” with error | Field/Error | error font-weight | 700 | 700 | yes |
| invoice-new-error | field “Client email” | Field/Default | label color | #101828 | #101828 | yes |
| invoice-new-error | field “Client email” | Field/Default | label font-size | 16 | 16 | yes |
| invoice-new-error | field “Client email” | Field/Default | label font-weight | 700 | 700 | yes |
| invoice-new-error | field “Client email” | Field/Default | input background | #ffffff | #ffffff | yes |
| invoice-new-error | field “Client email” | Field/Default | input border-color | #667085 | #667085 | yes |
| invoice-new-error | field “Client email” | Field/Default | input border-width | 2 | 2 | yes |
| invoice-new-error | field “Client email” | Field/Default | input height | 48 | 48 | yes |
| invoice-new-error | field “What the work was” | Field/Default | label color | #101828 | #101828 | yes |
| invoice-new-error | field “What the work was” | Field/Default | label font-size | 16 | 16 | yes |
| invoice-new-error | field “What the work was” | Field/Default | label font-weight | 700 | 700 | yes |
| invoice-new-error | field “What the work was” | Field/Default | input background | #ffffff | #ffffff | yes |
| invoice-new-error | field “What the work was” | Field/Default | input border-color | #667085 | #667085 | yes |
| invoice-new-error | field “What the work was” | Field/Default | input border-width | 2 | 2 | yes |
| invoice-new-error | field “What the work was” | Field/Default | input height | 48 | 48 | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | label color | #101828 | #101828 | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | label font-size | 16 | 16 | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | label font-weight | 700 | 700 | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | input background | #ffffff | #ffffff | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | input border-color | #b42318 | #b42318 | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | input border-width | 2 | 2 | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | input height | 48 | 48 | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | bar color | #b42318 | #b42318 | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | bar width | 5 | 5 | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | error color | #b42318 | #b42318 | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | error font-size | 16 | 16 | yes |
| invoice-new-error | field “Amount in US dollars” with error | Field/Error | error font-weight | 700 | 700 | yes |
| invoice-new-error | primary button “Check invoice” | Button/Primary | background | #175cd3 | #175cd3 | yes |
| invoice-new-error | primary button “Check invoice” | Button/Primary | border-color | none | none | yes |
| invoice-new-error | primary button “Check invoice” | Button/Primary | border-width | none | none | yes |
| invoice-new-error | primary button “Check invoice” | Button/Primary | height | 48 | 48 | yes |
| invoice-new-error | primary button “Check invoice” | Button/Primary | label color | #ffffff | #ffffff | yes |
| invoice-new-error | primary button “Check invoice” | Button/Primary | label font-size | 16 | 16 | yes |
| invoice-new-error | primary button “Check invoice” | Button/Primary | label font-weight | 700 | 700 | yes |
| invoice-new-error | secondary button “Cancel” | Button/Secondary | background | #ffffff | #ffffff | yes |
| invoice-new-error | secondary button “Cancel” | Button/Secondary | border-color | #667085 | #667085 | yes |
| invoice-new-error | secondary button “Cancel” | Button/Secondary | border-width | 2 | 2 | yes |
| invoice-new-error | secondary button “Cancel” | Button/Secondary | height | 48 | 48 | yes |
| invoice-new-error | secondary button “Cancel” | Button/Secondary | label color | #101828 | #101828 | yes |
| invoice-new-error | secondary button “Cancel” | Button/Secondary | label font-size | 16 | 16 | yes |
| invoice-new-error | secondary button “Cancel” | Button/Secondary | label font-weight | 700 | 700 | yes |
| invoice-new-error | all 8 elements | Screen | order, top to bottom | flow order | flow order | yes |
| invoice-review | app bar | AppBar | background | #ffffff | #ffffff | yes |
| invoice-review | app bar | AppBar | height | 64 | 64 | yes |
| invoice-review | app bar | AppBar | border-bottom-color | #d0d5dd | #d0d5dd | yes |
| invoice-review | app bar | AppBar | wordmark color | #101828 | #101828 | yes |
| invoice-review | app bar | AppBar | wordmark font-size | 19 | 19 | yes |
| invoice-review | app bar | AppBar | wordmark font-weight | 700 | 700 | yes |
| invoice-review | heading “Check the invoice” | Heading/Page | color | #101828 | #101828 | yes |
| invoice-review | heading “Check the invoice” | Heading/Page | font-size | 24 | 24 | yes |
| invoice-review | heading “Check the invoice” | Heading/Page | font-weight | 700 | 700 | yes |
| invoice-review | summary | SummaryList | color | #101828 | #101828 | yes |
| invoice-review | summary | SummaryList | font-size | 16 | 16 | yes |
| invoice-review | summary | SummaryList | font-weight | 700 | 700 | yes |
| invoice-review | primary button “Send invoice” | Button/Primary | background | #175cd3 | #175cd3 | yes |
| invoice-review | primary button “Send invoice” | Button/Primary | border-color | none | none | yes |
| invoice-review | primary button “Send invoice” | Button/Primary | border-width | none | none | yes |
| invoice-review | primary button “Send invoice” | Button/Primary | height | 48 | 48 | yes |
| invoice-review | primary button “Send invoice” | Button/Primary | label color | #ffffff | #ffffff | yes |
| invoice-review | primary button “Send invoice” | Button/Primary | label font-size | 16 | 16 | yes |
| invoice-review | primary button “Send invoice” | Button/Primary | label font-weight | 700 | 700 | yes |
| invoice-review | secondary button “Change details” | Button/Secondary | background | #ffffff | #ffffff | yes |
| invoice-review | secondary button “Change details” | Button/Secondary | border-color | #667085 | #667085 | yes |
| invoice-review | secondary button “Change details” | Button/Secondary | border-width | 2 | 2 | yes |
| invoice-review | secondary button “Change details” | Button/Secondary | height | 48 | 48 | yes |
| invoice-review | secondary button “Change details” | Button/Secondary | label color | #101828 | #101828 | yes |
| invoice-review | secondary button “Change details” | Button/Secondary | label font-size | 16 | 16 | yes |
| invoice-review | secondary button “Change details” | Button/Secondary | label font-weight | 700 | 700 | yes |
| invoice-review | all 4 elements | Screen | order, top to bottom | flow order | flow order | yes |
| send-error | app bar | AppBar | background | #ffffff | #ffffff | yes |
| send-error | app bar | AppBar | height | 64 | 64 | yes |
| send-error | app bar | AppBar | border-bottom-color | #d0d5dd | #d0d5dd | yes |
| send-error | app bar | AppBar | wordmark color | #101828 | #101828 | yes |
| send-error | app bar | AppBar | wordmark font-size | 19 | 19 | yes |
| send-error | app bar | AppBar | wordmark font-weight | 700 | 700 | yes |
| send-error | heading “The invoice was not sent” | Heading/Page | color | #101828 | #101828 | yes |
| send-error | heading “The invoice was not sent” | Heading/Page | font-size | 24 | 24 | yes |
| send-error | heading “The invoice was not sent” | Heading/Page | font-weight | 700 | 700 | yes |
| send-error | error-summary | ErrorSummary | background | #ffffff | #ffffff | yes |
| send-error | error-summary | ErrorSummary | border-color | #b42318 | #b42318 | yes |
| send-error | error-summary | ErrorSummary | border-width | 5 | 5 | yes |
| send-error | error-summary | ErrorSummary | title color | #101828 | #101828 | yes |
| send-error | error-summary | ErrorSummary | title font-size | 19 | 19 | yes |
| send-error | error-summary | ErrorSummary | title font-weight | 700 | 700 | yes |
| send-error | error-summary | ErrorSummary | item color | #b42318 | #b42318 | yes |
| send-error | error-summary | ErrorSummary | item font-size | 16 | 16 | yes |
| send-error | error-summary | ErrorSummary | item font-weight | 700 | 700 | yes |
| send-error | error-summary | ErrorSummary | item underline | yes | yes | yes |
| send-error | text “Nothing was sent. Your invoice is saved…” | Text/Body | color | #344054 | #344054 | yes |
| send-error | text “Nothing was sent. Your invoice is saved…” | Text/Body | font-size | 16 | 16 | yes |
| send-error | text “Nothing was sent. Your invoice is saved…” | Text/Body | font-weight | 400 | 400 | yes |
| send-error | primary button “Change the email address” | Button/Primary | background | #175cd3 | #175cd3 | yes |
| send-error | primary button “Change the email address” | Button/Primary | border-color | none | none | yes |
| send-error | primary button “Change the email address” | Button/Primary | border-width | none | none | yes |
| send-error | primary button “Change the email address” | Button/Primary | height | 48 | 48 | yes |
| send-error | primary button “Change the email address” | Button/Primary | label color | #ffffff | #ffffff | yes |
| send-error | primary button “Change the email address” | Button/Primary | label font-size | 16 | 16 | yes |
| send-error | primary button “Change the email address” | Button/Primary | label font-weight | 700 | 700 | yes |
| send-error | all 4 elements | Screen | order, top to bottom | flow order | flow order | yes |
| invoice-sent | app bar | AppBar | background | #ffffff | #ffffff | yes |
| invoice-sent | app bar | AppBar | height | 64 | 64 | yes |
| invoice-sent | app bar | AppBar | border-bottom-color | #d0d5dd | #d0d5dd | yes |
| invoice-sent | app bar | AppBar | wordmark color | #101828 | #101828 | yes |
| invoice-sent | app bar | AppBar | wordmark font-size | 19 | 19 | yes |
| invoice-sent | app bar | AppBar | wordmark font-weight | 700 | 700 | yes |
| invoice-sent | heading “Invoice INV-0001 sent” | Heading/Page | color | #101828 | #101828 | yes |
| invoice-sent | heading “Invoice INV-0001 sent” | Heading/Page | font-size | 24 | 24 | yes |
| invoice-sent | heading “Invoice INV-0001 sent” | Heading/Page | font-weight | 700 | 700 | yes |
| invoice-sent | text “Harbour Bakery will get it at accounts@…” | Text/Body | color | #344054 | #344054 | yes |
| invoice-sent | text “Harbour Bakery will get it at accounts@…” | Text/Body | font-size | 16 | 16 | yes |
| invoice-sent | text “Harbour Bakery will get it at accounts@…” | Text/Body | font-weight | 400 | 400 | yes |
| invoice-sent | primary button “Back to invoices” | Button/Primary | background | #175cd3 | #175cd3 | yes |
| invoice-sent | primary button “Back to invoices” | Button/Primary | border-color | none | none | yes |
| invoice-sent | primary button “Back to invoices” | Button/Primary | border-width | none | none | yes |
| invoice-sent | primary button “Back to invoices” | Button/Primary | height | 48 | 48 | yes |
| invoice-sent | primary button “Back to invoices” | Button/Primary | label color | #ffffff | #ffffff | yes |
| invoice-sent | primary button “Back to invoices” | Button/Primary | label font-size | 16 | 16 | yes |
| invoice-sent | primary button “Back to invoices” | Button/Primary | label font-weight | 700 | 700 | yes |
| invoice-sent | all 3 elements | Screen | order, top to bottom | flow order | flow order | yes |
| invoices-list | app bar | AppBar | background | #ffffff | #ffffff | yes |
| invoices-list | app bar | AppBar | height | 64 | 64 | yes |
| invoices-list | app bar | AppBar | border-bottom-color | #d0d5dd | #d0d5dd | yes |
| invoices-list | app bar | AppBar | wordmark color | #101828 | #101828 | yes |
| invoices-list | app bar | AppBar | wordmark font-size | 19 | 19 | yes |
| invoices-list | app bar | AppBar | wordmark font-weight | 700 | 700 | yes |
| invoices-list | heading “Invoices” | Heading/Page | color | #101828 | #101828 | yes |
| invoices-list | heading “Invoices” | Heading/Page | font-size | 24 | 24 | yes |
| invoices-list | heading “Invoices” | Heading/Page | font-weight | 700 | 700 | yes |
| invoices-list | table | Table | color | #101828 | #101828 | yes |
| invoices-list | table | Table | font-size | 16 | 16 | yes |
| invoices-list | table | Table | font-weight | 700 | 700 | yes |
| invoices-list | primary button “Create invoice” | Button/Primary | background | #175cd3 | #175cd3 | yes |
| invoices-list | primary button “Create invoice” | Button/Primary | border-color | none | none | yes |
| invoices-list | primary button “Create invoice” | Button/Primary | border-width | none | none | yes |
| invoices-list | primary button “Create invoice” | Button/Primary | height | 48 | 48 | yes |
| invoices-list | primary button “Create invoice” | Button/Primary | label color | #ffffff | #ffffff | yes |
| invoices-list | primary button “Create invoice” | Button/Primary | label font-size | 16 | 16 | yes |
| invoices-list | primary button “Create invoice” | Button/Primary | label font-weight | 700 | 700 | yes |
| invoices-list | all 3 elements | Screen | order, top to bottom | flow order | flow order | yes |


The geometry (where each element starts and how much of its column it fills) is recorded in the report attached to each test run, not here: it depends on the fonts of the browser that ran the test.
