---
title: "H is for Hono"
description: "The small, typed API that stands between your web page and your data. Learn what an API boundary is, what the starter's Hono code already protects, and what an agent-built route must never skip."
section: "The PHANTOMS stack"
order: 5
track: "phantoms-stack"
level: "core"
duration: "100 min"
outcomes:
  - "Explain what an API is and why one boundary should check everything"
  - "Read a Hono route and name the protections around it"
  - "Review an agent-written endpoint with a security checklist"
  - "Tell health from readiness, and authentication from authorization"
prerequisites:
  - "the-way-five-rules"
resources:
  - "hono/hono-docs"
  - "hono/hono-motivation"
  - "hono/hono-bun"
  - "hono/hono-validation"
  - "hono/hono-testing"
  - "hono/hono-secure-headers"
  - "zod/zod-intro"
  - "owasp/rest-security-cheat-sheet"
updated: 2026-11-03
---

This is lesson 5 of the PHANTOMS track. It supports the Master Developer platform and production-launch modules, and Developer week 6, where a demo needs a working back end. H is where your product's rules become code that the outside world can call.

## 1. Why this matters

Your web page, a café's tablet and a partner's tool all need the same orders. They should not each reach into the database. Instead there is one program that answers requests: the **API** (application programming interface). A caller sends a request such as "list the orders", and the API sends back an answer, usually in a text format called **JSON**.

That one program is the **boundary** of your product. Everything outside it is untrusted: users make typos, scripts send rubbish, attackers send worse. Everything inside it can rely on the data being checked. Put the checks in one place and you can review them in one place.

**Hono** is a small, fast web framework written in TypeScript and built on web standards. In PHANTOMS it runs on Bun. "Small" is a feature: less code to read, less to patch, less for an agent to misuse.

For a product manager, the API is where your promises become **rules that run**: who may see an order, what a valid order is, how big a request may be, what happens when something fails. Agents write routes well and quickly. They are less reliable at the boundary rules that nobody asked for out loud. That is your job.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What the API must offer, who may call it, what is valid, what errors users see | Writing routes, validation, tests, API documentation, client code | Reading the route list, testing refusals as well as successes, applying a security checklist | Security (authentication, limits, headers), design (error messages users see), operations (health checks), partners (the contract they depend on) |

## 2. Key ideas, explained

### Routes, requests, responses

A **route** connects a method and a path to a piece of code. `GET /api/tasks` means "list tasks"; `POST /api/tasks` means "create one". A **handler** is the code that runs. The starter's API is created by one function in `apps/api/src/app.ts`, which makes it easy to test: tests call the app directly, without starting a server. The Hono testing guide describes this pattern.

### Middleware: protections that wrap every route

**Middleware** is code that runs before (or after) a handler, for many routes at once. This is how the boundary rules are applied everywhere without repeating them. The starter's API sets up these, in plain words:

| Protection | What it does | Why a manager cares |
|---|---|---|
| **Secure headers** | Adds safe HTTP response headers | Reduces common browser attacks for almost no effort |
| **CORS allowlist** | Only the configured web origin may call the API from a browser | Stops other websites using your API from a visitor's browser |
| **Body limit** (32 KB on the API paths) | Rejects huge requests | Protects against memory exhaustion and cost |
| **Bearer token** (when configured) | Requires `Authorization: Bearer <token>` | A minimal gate while there is no real login |
| **Validation** (Zod) | Checks that input has the right shape | Keeps bad data out of the database |
| **Generic errors** | Returns "The request could not be completed" and logs only the error name and path | Does not leak internals to attackers |

### Validation at the edge

**Validation** means checking that incoming data is what you expect before you use it. The starter uses **Zod**, a library that describes the shape of data and checks it at run time. The task title must be a trimmed string of 1 to 200 characters. If it is not, the API answers `400` with a plain message. The rule in `AGENTS.md` is: "Validate request data at API boundaries." Types alone do not protect you, because types disappear at run time and the internet does not respect your types.

### Health versus readiness

The API has two small routes that operations teams love:

- `/healthz` answers "is the process alive?"
- `/readyz` answers "can it do its job right now?" It checks the database connection and answers `503` if it cannot.

The difference matters. A service that is alive but cannot reach its database should be taken out of rotation, not restarted forever. Ask any agent-built service for both.

### Authentication is not authorization

**Authentication** answers "who are you?" **Authorization** answers "what may you do?" The starter's bearer token is a single shared secret. It says "you know the secret", not "you are Maya, and Maya owns these orders". The security guide is explicit: this gate is "not a replacement for OIDC, per-user identity, or per-record authorization." Its rule for real products: "Authorize every record lookup and mutation by tenant and user. Authentication alone does not establish access to a record."

This is the largest gap between the starter and a real product, and the most important question you will ask: *for each route, who may call it, and how does the code check?*

### Safe by default on the network

The server listens only on `127.0.0.1` (the local machine) unless told otherwise. If you set the host to anything else and have not set a bearer token, the server refuses to start. That is a small, strong guardrail: a developer cannot accidentally expose an open API. Inside the container the host is set to listen on all addresses, and a token is required.

## 3. Step by step: how to review an endpoint

Use this list when an agent adds or changes a route.

1. **State the route in a sentence.** "A café can list its own orders." If you cannot say who may call it, stop.
2. **Check the method.** Reads use `GET`. Creating uses `POST`. A `GET` that changes data is a bug.
3. **Check validation.** Every field from the outside is checked: type, length, allowed values. Unknown fields are not blindly trusted.
4. **Check authorization.** The code checks that this caller may access this record. Not just "is logged in".
5. **Check limits.** Body size, number of results returned, and (for a real product) rate limits.
6. **Check errors.** Failures return a safe message and the right status code (`400` bad input, `401` not authenticated, `403` not allowed, `404` not found, `500` our fault). No stack traces, no database messages.
7. **Check what is logged.** Names and paths, not secrets, tokens or personal data.
8. **Check tests.** There are tests for success **and** for refusals: bad input, missing token, wrong owner.
9. **Check the contract.** Is the route documented in a way partners can read? The CI guide suggests pinning an API linter for this.

## 4. Worked example: TrailMug

Maya's epic says: "A café owner can order cups and always see where the order is." She writes the routes she needs, in a small table, before any agent starts.

| Route | Who may call | Rule |
|---|---|---|
| `GET /api/orders` | An authenticated café user | Returns only that café's orders, newest first, at most 100 |
| `POST /api/orders` | An authenticated café user | Café name from the user's account; cup count a whole number from 1 to 5000; status starts as "placed" |
| `PATCH /api/orders/:id/status` | TrailMug warehouse staff only | Moves forward only: placed, packed, shipped, delivered |
| `GET /healthz`, `GET /readyz` | Anyone | No data returned |

The starter only has a shared bearer token. Maya writes the honest line in her README: "Demo: one shared token. Before any real café uses it, we need per-user login and checks that each café sees only its own orders." She files that as an epic for later. She does not let the demo pretend.

When the agent returns, she does not read every line. She reads the **route list**, then the **tests**. Does a test exist that calls `POST /api/orders` with a cup count of zero and expects `400`? Does one call `PATCH` with the status "placed" on a delivered order and expect a refusal? She finds the second missing. She sends the agent back: "Add the forward-only status rule and a test that proves a delivered order cannot go back." That is verification: not trusting a green check, but looking for the tests that should exist.

## 5. Working with AI agents on this

**What to delegate.** Writing routes and Zod schemas from your route table, adding middleware the starter already uses, writing API tests, generating documentation, building a small client.

**What you must do yourself.** Decide who may call what. Define "valid". Decide the limits and the error messages customers see. Decide when the shared token is no longer acceptable. Write the epic.

**A prompt you can adapt:**

> Work in the PHANTOMS starter. Read AGENTS.md, docs/security.md and apps/api/src/app.ts first. Task: add the routes in the table below to apps/api. Rules: validate every input with Zod at the boundary; keep persistence in packages/db and call it through the existing store pattern; keep the existing middleware (secure headers, CORS allowlist, body limit, bearer auth); return safe generic errors; never log tokens or personal data. For each route, write tests for success and for each refusal in the table. Do not add a dependency. Run the checks from AGENTS.md and paste the results. At the end list every route you added and every rule you could not enforce, and say why. <paste route table>

**How to check the output.** Compare the route list to your table. Look for a missing refusal test. Try the API with `curl`, using bad input and no token. Check the response bodies for leaks. Ask: "what happens if I send a ten-megabyte body, an empty body, or a cup count of minus one?"

**Disclose.** Say in the merge request that an agent wrote the routes and that you reviewed the refusal tests. See [disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Trusting the front end to validate.** Anyone can call the API directly. Validate at the API.
- **Treating the shared token as login.** It is a placeholder. Plan real identity before real users.
- **Returning internal errors.** Raw database messages help attackers. Return a safe message and log the detail safely.
- **Wildcard CORS.** Use an explicit list of origins, especially when credentials are involved.
- **No limits.** Unlimited request sizes and result sizes become outages and bills.
- **Business logic in route handlers.** As the app grows, move it out, as the architecture guide advises, so routes stay thin and testable.
- **Testing only the happy path.** The refusals are the product's promises. Test them.

## 7. Practice

**Exercise: "Write the route table, then judge the code."**

1. Write a route table (method, path, who may call, rule) for three routes of a product you care about. Your own words, no agent.
2. In a clone of the public starter, brief an agent to add the routes using the prompt above.
3. Run the API locally and try each route with `curl`, including bad input and a missing token. Record what you sent and what came back.
4. Walk the nine-step review list. For each step, write "pass", "fail" or "not checked", with one sentence.
5. Send the agent back for every "fail". Record what changed.

**Deliverable in git:** `docs/api-routes.md` (your table), `docs/reviews/api-review-001.md` (your nine steps and the `curl` evidence) and a merge request that says what the agent did and what you rejected.

## 8. Checklist

- [ ] I wrote the route table myself.
- [ ] Every input is validated at the API.
- [ ] I can say, for each route, who may call it and how the code checks.
- [ ] Health and readiness routes exist and differ.
- [ ] Errors are safe and logs hold no secrets.
- [ ] Tests cover refusals, not only success.
- [ ] I know the shared token is a placeholder, and real login is on the roadmap.

## 9. Further learning

Read the Hono docs and the short Philosophy page for why the framework is built the way it is. The Bun page shows the smallest working example. The validation and testing guides match the two habits above, and the secure headers page shows how one middleware raises the baseline. Zod's introduction explains the validation library. The OWASP REST Security Cheat Sheet is the best single checklist for the review you now do after every agent-written route.

**Next:** [A is for AI](/library/tracks/phantoms-stack/06-a-ai-adapter/).
