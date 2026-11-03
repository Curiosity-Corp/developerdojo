---
title: "N is for Next.js"
description: "The web application layer: what Next.js and the App Router do, why the starter builds static files, what that choice gives up, and how to judge an agent-built page for users, accessibility and security."
section: "The PHANTOMS stack"
order: 7
track: "phantoms-stack"
level: "core"
duration: "100 min"
outcomes:
  - "Explain what the web layer does and how it talks to the API"
  - "Describe static export and the features it gives up in exchange for a simpler runtime"
  - "Review an agent-built page for accessibility, secrets and unneeded complexity"
  - "Know why framework agent notes must be read before an agent writes code"
prerequisites:
  - "the-way-five-rules"
resources:
  - "nextjs/learn-nextjs"
  - "nextjs/app-router-getting-started"
  - "nextjs/static-exports"
  - "tailwind/tailwind-css-installation"
  - "shadcn/shadcn-ui-introduction"
  - "owasp/top-ten"
updated: 2026-11-03
---

This is lesson 7 of the PHANTOMS track. It supports Developer week 5 (brand, website, mockups) and the Master Developer production-launch module. N is the part of the product your customers actually see, so it is where product, design, accessibility and brand meet the code.

## 1. Why this matters

Customers never see your database or your API. They see a page. If the page is slow, confusing or broken on a phone, the rest does not matter.

**Next.js** is a framework built on **React**, a library for building interfaces from small reusable pieces. Next.js adds routing (which URL shows which page), a way to build the site and many options for where code runs. PHANTOMS uses its **App Router**, the current way of organising pages as folders and files.

Next.js is powerful, and power has a price. It offers many ways to run code: in the browser, on a server at request time, or at build time. Each way has different hosting, security and cost. The starter makes a deliberate, conservative choice about this. Understanding the choice helps you decide when to change it.

For the 2030 Product Development Manager the web layer is where **brand, accessibility, speed and trust** are decided. Agents can build pages quickly. They will not know your brand, your users' devices or the legal rule about accessible websites unless you tell them.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What each page must do for which user, the brand look, the accessibility bar, the performance budget | Building pages and components, wiring them to the API, writing browser tests | Opening the page on a phone, keyboard-only and screen-reader checks, reading what the page sends and stores | Design (brand, layout), accessibility, marketing (page speed, search), security (secrets, cookies), operations (where it is hosted) |

## 2. Key ideas, explained

### Where code runs

| Where | What it means | Typical use |
|---|---|---|
| **In the browser** | Code runs on the visitor's device | Buttons, forms, showing fetched data |
| **At build time** | Code runs once when you build the site, producing plain files | Pages whose content does not change per visitor |
| **On a server, per request** | Code runs each time someone asks | Pages built from live data, logins, actions on the server |

The third option needs a server that runs the framework. That is another program to host, patch and pay for, and it must be proven to work in your chosen runtime.

### Static export: the starter's choice

The starter's web package builds a **static export**: ordinary HTML, CSS and JavaScript files, with no framework server. The configuration is two lines (`output: 'export'` and `trailingSlash: true`). The files can be served by any web host, a reverse proxy, or by the Hono API in the same container.

Why? The decision log (decision 004) explains. The current Next.js system requirements document a Node.js server target, and the starter must keep Bun as its only runtime. Static output keeps the boundary clear: **Bun builds the pages, Hono serves the data, and no extra server runtime enters production.**

### What static export gives up

The Next.js guide on static exports lists the features that do not work in this mode. The starter's own log names the important ones: server components that need request-time work, and server actions. In practice this means:

- The page itself cannot read the database. It fetches from the API after loading, in the browser.
- You cannot have pages that are produced differently for each visitor on the server.
- Some Next.js features that depend on a server are not available.

This is a **trade-off, not a flaw.** You gain a simple runtime, cheap hosting, a smaller attack surface and an easy container. You lose some framework features. If a product genuinely needs the lost features, the log says what to do: validate the chosen Next.js release and hosting adapter under Bun before adopting that path. Until then, do not let an agent quietly switch the app to server rendering because it is "more standard".

### How the page talks to the API

The browser loads the static page, then calls the Hono API. Two ways to arrange this:

- **Same origin.** A reverse proxy (or the container itself) serves both the pages and `/api`, so the browser sees one site. This is the safest and simplest, and the starter's single-container image does it.
- **Separate origin.** The page and API have different addresses. The API then needs a narrow **CORS allowlist** (a list of web origins allowed to call it), which the starter sets from `WEB_ORIGIN`.

### Public variables are public

Anything prefixed `NEXT_PUBLIC_` is baked into the page and sent to every visitor. The rule from the starter: model credentials and other secrets never go there. When an agent tells you "I put the key in an environment variable", ask which one.

### Read the framework's agent notes

The web app contains its own `AGENTS.md`, written by the framework's development command. It says, in effect: this is not the version you learned from; read the guides that ship inside the package before writing code. This is a small, important idea for anyone directing agents: **agents are trained on older text, and fast-moving frameworks change.** Tell your agents to read the version-matched docs, and tell them in `AGENTS.md` that the web folder has its own rules.

### Styling: plain in core, a design system in the web variant

The core starter uses plain CSS so the first build is easy to inspect. The PHANTOMS+ web variant adds a design system. Whichever you use, write one rule in `AGENTS.md` about styling, and keep to one system.

### Versions and security notices

The starter's version policy lists Next.js as the "active LTS patch line" as of 2026-10-01 and links the framework's [September 2026 security release](https://nextjs.org/blog/september-2026-security-release). At the time of writing, the version in the lockfile is slightly newer than the one in the policy page. Moral for a manager: **framework security notices are part of your operating routine.** Someone must read them weekly, and the starter's cadence says so.

## 3. Step by step: how to review a page an agent built

1. **Open it on a phone-sized window.** Does it work at 390 pixels wide? Is text readable without zooming?
2. **Use only the keyboard.** Press Tab. Can you reach every control? Is the focus visible? Can you operate it with Enter and Space?
3. **Check headings and labels.** One main heading, a sensible order, a label for every input, and text alternatives for meaningful images.
4. **Check contrast and motion.** Text is readable against its background. Anything that animates respects the reduced-motion setting.
5. **Check the empty, loading and error states.** What does the page show with no orders, while loading, and when the API fails? Agents often build only the happy state.
6. **Check what the page stores and sends.** Open the browser's developer tools, look at the network tab and storage. No secrets, no unnecessary personal data.
7. **Check variables.** Search the code for `NEXT_PUBLIC_`. Each one must be safe for the whole world to read.
8. **Check the rendering mode.** The page still builds as a static export. No server-only feature crept in.
9. **Check the tests.** Is there a browser test for the main journey, run against the built app? The starter's guidance: for browser-facing journeys, add deterministic Playwright coverage.
10. **Read the diff for new dependencies.** A page rarely needs a new package. Ask why.

## 4. Worked example: TrailMug

Maya's café owners need one page: "My orders". She writes the page's job in a few lines and draws a rough layout on paper, then briefs an agent.

Her notes include user needs, not code. "A café owner opens this on a tablet at the counter. They want to see, at a glance, each order, its cup count and its status. Delivered orders look calm. Late orders look urgent but not scary. If the list is empty, say 'No orders yet' and show the button to place one."

The agent builds the page as a static Next.js page that fetches `/api/orders` in the browser. Maya reviews with the ten steps.

On the phone-sized window, the status column overflows. She sends it back. With the keyboard, the "Place order" button works but the focus ring is invisible. Back again. In the error test she stops the API: the page shows a blank white screen. She writes an acceptance line: "If the API fails, show 'We cannot load orders right now. Try again in a minute.'" The agent adds it, and a browser test that stops the API and checks for the message.

In the network tab she sees the page sends the bearer token in every request from a variable named `NEXT_PUBLIC_API_TOKEN`. That is a real finding. The starter's shared token is meant for a demo gate, and a public variable would publish it. She does not accept "it is only a demo". She writes the real fix into the roadmap (per-user login, handled on the server side) and, for the demo, runs the page behind the same-origin container so no token is needed in the browser. This is the kind of catch only a human with the security question in mind will make.

Notice the pattern: she did not read React. She used the browser as an instrument.

## 5. Working with AI agents on this

**What to delegate.** Building pages and components from your layout and states, wiring them to the API, writing the browser test, fixing accessibility issues you list, building the static export.

**What you must do yourself.** Decide the user journey and the brand. Set the accessibility bar. Decide whether the product ever needs server rendering. Approve any design system or new dependency. Write the epic.

**A prompt you can adapt:**

> Work in apps/web of the PHANTOMS starter. Read AGENTS.md, apps/web/AGENTS.md and docs/architecture.md first, and read the version-matched Next.js docs that ship in the installed package before writing code. Task: build a "My orders" page at /orders that fetches GET /api/orders in the browser and shows each order's café, cup count and status. Rules: keep the static export (no server components that need request time, no server actions); no secrets or tokens in NEXT_PUBLIC variables; plain CSS only, no new styling library; mobile first, readable at 390 pixels; keyboard operable with visible focus; show empty, loading and error states with the exact texts in my spec; add a Playwright test for the main journey and for the API-down state. Run the checks from AGENTS.md and report what you could not verify. <paste your spec and layout notes>

**How to check the output.** Open it yourself at phone width, with the keyboard, with the API stopped, and with an empty list. Check the network tab. Run the build and confirm the output is still a static export.

**Disclose.** Say in the merge request what the agent built and what you tested by hand. See [disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Switching to server rendering because it seems more normal.** That changes hosting, runtime and risk. It needs a decision record.
- **Secrets in public variables.** Anything `NEXT_PUBLIC_` is published.
- **Only the happy path.** Always specify empty, loading and error states.
- **Forgetting the keyboard and the phone.** Most agent-built pages need accessibility fixes. Test them yourself.
- **Adding a design system "to make it nicer".** One more dependency and one more rule. Decide it, don't drift into it.
- **Trusting old training knowledge.** Frameworks change. Make the agent read the version-matched docs.
- **No browser test.** A built page that no test opens is a page nobody has proved works.

## 7. Practice

**Exercise: "Brief a page, then use it like a customer."**

1. Write the spec for one page of your product: who uses it, on what device, what they must see, and the exact texts for empty, loading and error states. No agent writes the spec.
2. Brief an agent in a clone of the public starter to build it, using the prompt above.
3. Run the ten-step review. Take screenshots of the phone-width view and the error state.
4. List every defect you found. Send the agent back until all are fixed or consciously accepted.
5. Record any decision about server features in a short decision record: "static export stays, because..."

**Deliverable in git:** `docs/page-spec-orders.md` (your spec), `docs/reviews/web-review-001.md` (ten steps and the defect list), the screenshots in `docs/reviews/img/` and the merge request with your notes.

## 8. Checklist

- [ ] I wrote the page spec, including empty, loading and error texts.
- [ ] The page works at 390 pixels and with the keyboard only.
- [ ] No secret is in a `NEXT_PUBLIC_` variable.
- [ ] The app still builds as a static export.
- [ ] A browser test covers the main journey and the API-down state.
- [ ] I know what static export gives up and recorded my decision about it.
- [ ] The agent read the web folder's own `AGENTS.md`.

## 9. Further learning

The official Learn Next.js course is free and hands-on, and the App Router getting-started guide matches the folder layout in `apps/web`. Read the static export guide next to the starter's decision 004 to see both sides of the trade-off. The Tailwind CSS and shadcn/ui pages describe the design system used in the web variant, and the OWASP Top 10 is the questions list for any page that handles people's data.

**Next:** [T is for Turborepo](/library/tracks/phantoms-stack/08-t-turborepo/).
