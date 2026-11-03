---
title: "A is for AI: the replaceable adapter"
description: "How a product uses language models without being welded to one vendor: the adapter, server-side configuration, budgets, output checks, privacy and an evaluation set that tells you whether the AI feature works."
section: "The PHANTOMS stack"
order: 6
track: "phantoms-stack"
level: "core"
duration: "110 min"
outcomes:
  - "Explain an AI adapter and why it protects cost, privacy and choice"
  - "Say what the starter's adapter does and what it deliberately does not do"
  - "Set limits for an AI feature: timeouts, size, budget, data sent, fallback"
  - "Design a small evaluation set to judge an AI feature before and after a model change"
prerequisites:
  - "the-way-five-rules"
resources:
  - "ai-sdk/ai-sdk-docs"
  - "ai-sdk/providers-and-models"
  - "ai-sdk/openai-compatible-providers"
  - "owasp/llm-applications-top-10"
  - "anthropic/building-effective-ai-agents"
  - "zod/zod-intro"
updated: 2026-11-03
---

This is lesson 6 of the PHANTOMS track. It supports the Master Developer module on AI-agent orchestration, and it pairs with the Working with AI agents track. A is the letter most likely to change under your feet, which is exactly why the starter treats it as a boundary and not a vendor.

## 1. Why this matters

There are two different things people call "AI in a product". The first is **the agents that build your product**: the coding assistants you direct in this track. The second is **AI inside the product**: a feature that calls a language model when a customer uses it, such as a drafted message, a summary or a classification. The A in PHANTOMS is about the second. (Lesson 9 on OpenClaw touches agents that run as part of a product.)

Models change quickly. Prices change. Quality changes. Providers change their rules, their data handling, their regions and sometimes their availability. A product that calls one vendor's library from fifty places has handed that vendor control of its cost and risk.

PHANTOMS' answer is the **adapter**. The starter's guide says: "PHANTOMS uses AI as a capability boundary, not as a single model vendor." An **adapter** is a small piece of your own code with a simple promise: "give me a prompt, I give you text back, within limits". Everything else in the product talks to the adapter. Which model, which provider, and which server it runs on sit behind it, in configuration.

The 2030 Product Development Manager decides **what the AI feature is for, what it may see, how much it may cost, what happens when it is wrong or down, and how you will know it works**. Those are product, privacy, finance and quality decisions. Agents implement them. They cannot invent them.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What the AI feature does, what data it may see, the budget, the fallback, the quality bar | Writing the adapter code, prompts, schemas, fake adapters for tests and the evaluation harness | Reading the limits in code, running the evaluation set, checking logs hold no personal data | Legal and privacy (what leaves the system), finance (cost per use), security (untrusted output), design (what users see when it fails) |

## 2. Key ideas, explained

### What the starter's adapter does

The `packages/ai` package is small on purpose. In plain words:

- It reads three settings from the server's environment: the provider's **base URL**, an optional **API key**, and a **model name**. They are empty in `.env.example`, so nothing calls out until you decide.
- It checks that configuration with a schema (a malformed URL is refused).
- It exposes one function that takes a prompt and returns text.
- It refuses prompts that are empty or longer than 8,000 characters.
- It sets a **timeout** (15 seconds by default, between half a second and a minute) and a **maximum output size** of 512 tokens (a token is a small piece of text, roughly a short word or part of a word).
- It talks to the model through the AI SDK's "OpenAI-compatible" provider, a common protocol that many hosted and self-hosted model servers speak. That is how one adapter can reach many providers.
- It makes **no live model call at startup or in tests.**

That is the whole idea: small, limited, replaceable. The docs say it directly: "Application code imports a small PHANTOMS AI interface, not a vendor package."

### Why configuration lives on the server

An API key is a secret that spends money. If it reaches the browser, anyone can copy it and spend yours. The rule: model credentials are server-side only, and are **never** put in `NEXT_PUBLIC_*` variables, which are published to every visitor. This is a classic mistake, and a frequent one when an agent is told "make the AI work".

### Limits are product decisions

Every limit in the adapter is a decision someone must own:

| Limit | Question for the manager |
|---|---|
| Timeout | How long will a customer wait before we show the fallback? |
| Maximum output | How long may an answer be, and what does it cost? |
| Prompt size | What is the most we will send? Less data sent means less risk. |
| Retries | How many tries before we give up? Retried side effects must be safe to repeat. |
| Budget per user or tenant | What is the most one customer may spend us? |
| Fallback | What does the user see if the model is slow or down? |

### Data sent is data shared

A prompt can contain customer data. Before you send it to any provider, hosted or self-hosted, review the provider's **privacy, retention, access and cost terms**. The guide says to configure a provider "only when you have reviewed" them. Send only what the task needs, and remove secrets, credentials and unnecessary personal information first. In a drafted order message you need the order status and the café's name. You do not need a phone number.

### Treat model output as untrusted

A model answer is just text from a stranger. It can be wrong. It can be manipulated by the text it was shown, a trick called **prompt injection**, where hidden instructions in a document or message tell the model to misbehave. So:

- Escape text before showing it on a page.
- Validate any structured answer with a schema before it changes a record or triggers an action.
- Never treat instructions found in retrieved data as trusted policy.
- Require **human review** for money, accounts, access, deletion and messages that leave the company.

### Tests must not call a model

The starter keeps tests deterministic: use a **fake adapter** in unit tests, one that returns a fixed answer. A real model call in a unit test makes tests slow, flaky and costly. Quality is tested separately, with an **evaluation set**.

### An evaluation set is how you know it works

An **evaluation set** (an "eval") is a list of example inputs with a note on what a good answer looks like. You run the feature on all of them and score the results. It is the AI equivalent of a test suite. It tells you whether a model change, a prompt change or a provider change made the feature better or worse. The docs say: "run separately gated evaluations for quality-sensitive behavior." Without an eval, changing models is a guess.

## 3. Step by step: how to add an AI feature responsibly

1. **Write the job and the user.** "Draft a short, polite message telling a café their order is delayed."
2. **Decide the human step.** "A TrailMug staff member reads and sends every message." If you cannot name the human, do not ship.
3. **List the data the prompt needs, and nothing more.**
4. **Review the provider terms** for data handling and cost. Record the decision.
5. **Set the limits**: timeout, output size, retries, budget, fallback.
6. **Define the output shape.** A short text, or a structured object with a schema.
7. **Build the evaluation set** first, 15 to 30 realistic cases, written by you, with a note on what good looks like.
8. **Brief an agent** to implement behind the adapter, with a fake adapter in the tests.
9. **Run the evals**, read the failures yourself, and decide whether quality is good enough.
10. **Monitor in use.** Record model, adapter version, latency, token use and outcome. Do not log full prompts or responses by default.

## 4. Worked example: TrailMug

Maya's order tracker works. She now wants one AI feature: when a delivery is late, the warehouse needs a polite message to the café. She writes the job and the human step herself: "Draft only. A staff member edits and sends. The model never sends anything."

She lists the data: the café's name, the order's status, the original delivery date and the new date. No phone numbers, no addresses. She checks the provider's data terms and writes the result in a decision record.

She sets limits: a 10-second timeout, a maximum of 200 tokens, one retry, and a monthly budget she can afford. The fallback: the staff member sees a plain template and is told "draft unavailable".

Then, before any agent writes code, she builds the **evaluation set**: twenty late-delivery situations she wrote by hand. Some are easy. Some are hard: a café that has been delayed twice, an order with a changed cup count, a very angry earlier message. For each she writes what a good draft contains: apologises once, gives the new date, offers one clear next step, makes no promise TrailMug cannot keep, and does not blame a person.

Now the agent has a target. It builds the feature behind the adapter, with a fake adapter in the tests. Maya runs the eval and reads the results. Seventeen are good. Three promise a refund that TrailMug does not offer. She does not "fix the model". She tightens the brief, adds a rule to the prompt, and runs the eval again. This is the loop: **you define good; the eval measures; the agent adjusts.**

Six months later a cheaper model appears. Because of the adapter, switching is a configuration change plus an eval run. If the eval score holds, she switches. If not, she keeps the old one. That is the freedom the pattern buys.

## 5. Working with AI agents on this

**What to delegate.** Implementing the feature behind the adapter, writing the fake adapter and tests, writing the prompt text, building the eval runner, summarising eval results and failures.

**What you must do yourself.** Decide the job and the human step. Review privacy and cost terms. Set the budget and the fallback. Write the eval cases and what good looks like. Decide whether the quality is good enough. Own the decision to ship.

**A prompt you can adapt:**

> Work in the PHANTOMS starter. Read AGENTS.md, docs/ai.md and docs/security.md first. Task: add a function `draftDelayMessage` that uses the existing AI adapter in packages/ai to draft a delivery-delay message from an order summary. Rules: no vendor package imported outside packages/ai; no credentials in browser code or NEXT_PUBLIC variables; the model never sends anything and the output is shown to staff for editing; send only café name, status, original date and new date; validate any structured output with a schema; keep the adapter's timeout and output limits; unit tests use a fake adapter and make no network call; do not log prompts or responses. Create a separate evaluation script under packages/ai/evals that reads my cases from evals/delay-cases.json and prints a score table. Run the checks from AGENTS.md. Report what you could not verify.

**How to check the output.** Search the diff for any import of a vendor package outside `packages/ai`. Search for `NEXT_PUBLIC` and for logging calls. Read the data the prompt includes. Run the eval yourself. Read every failing case.

**Disclose.** Mark AI-drafted messages as drafts to staff, say in the merge request that an agent built the feature, and tell customers where it matters. See [disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Importing a vendor library across the codebase.** Keep it inside the adapter package. Check with a search.
- **Putting keys where the browser can see them.** Server only. Review environment variable names.
- **No timeout, no budget.** A slow or looping call becomes an outage or a bill.
- **Sending whole records.** Send the minimum. Less data sent is less exposure.
- **Acting on model output without validation.** Check it against a schema, and put a person in front of anything consequential.
- **Calling a real model in unit tests.** Use a fake adapter and run evals separately.
- **Changing models without an eval.** Then you cannot tell better from worse.
- **Pretending all models are the same.** Provider-specific features exist. Make them visible in the adapter, not hidden.

## 7. Practice

**Exercise: "Define good before you build."**

1. Choose one AI feature for a product you care about, or TrailMug's delay message.
2. Write the job, the human step, the data it may see, and the limits (timeout, size, retries, budget, fallback). One page, no agent.
3. Write 15 evaluation cases as a JSON file: an input and a plain-words description of a good answer. Include at least three hard cases.
4. Ask an agent to review your page and your cases and list anything ambiguous or missing. Do not let it write the cases.
5. Ask an agent to implement the feature behind the adapter with a fake adapter in tests. Do not configure a real provider unless you reviewed its terms.
6. Read the code for the five mistakes above and write one line for each: found or not found.

**Deliverable in git:** `docs/ai-feature-spec.md`, `packages/ai/evals/cases.json` (your cases), the implementation on a branch and a merge request that says what the agent did and what you checked.

## 8. Checklist

- [ ] The feature has a named human step.
- [ ] Credentials are server-side only and never in `NEXT_PUBLIC_*` variables.
- [ ] Timeout, output size, retries, budget and fallback are set and written down.
- [ ] The prompt carries only the data the task needs.
- [ ] Model output is validated and escaped before use.
- [ ] Tests use a fake adapter, and evals run separately.
- [ ] I wrote the evaluation cases and I read the failures.
- [ ] Provider terms were reviewed and recorded.

## 9. Further learning

The AI SDK documentation explains the provider model and the OpenAI-compatible route the starter uses. Read the "Providers and Models" page first. The OWASP list of risks for language-model applications will give you the vocabulary for prompt injection and excessive agency, and Anthropic's article on building effective agents shows why simple, well-measured designs usually beat clever ones. Zod's intro covers the validation library used for configuration and structured output.

**Next:** [N is for Next.js](/library/tracks/phantoms-stack/07-n-nextjs/).
