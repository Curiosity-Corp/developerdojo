---
title: "Find and judge sources"
description: "Learn where to look, what kinds of source exist and how to judge them. Ends with a printable checklist for verifying anything an AI agent cites: does it exist, does it say that, can you trust it."
section: "Research and evidence"
order: 2
track: "research-and-evidence"
level: "core"
duration: "2 to 3 hours"
outcomes:
  - "Search for sources with a written plan and keep a record of where you looked"
  - "Tell primary, secondary and opinion sources apart, and peer-reviewed from not"
  - "Judge a source on authority, purpose, date, method and documentation"
  - "Check that an agent's source exists, says what the agent claims and has not been withdrawn"
resources:
  - "google/scholar-search-help"
  - "cornell-university-library/tutorial-evaluating-information"
  - "uc-berkeley-library/evaluating-resources"
  - "harvard-library/evaluating-sources"
  - "harvard-kennedy-school/lateral-reading-study"
  - "crossref/rest-api"
  - "retraction-watch/database-user-guide"
prerequisites:
  - "week-1-see-the-whole-product"
  - "disclose-ai-use"
updated: 2026-11-03
---

**Supports:** Developer, weeks 1 and 3 (the evidence behind your brief and your epics) and the Master Developer Product Package. **Time:** about two to three hours.

## 1. Why this matters

Finding a source has become easy. Judging it has not. An agent can hand you ten sources in a minute, and some may be invented: a title that sounds right, an author who fits the topic, a link that leads to a home page. Others are real but do not say what the agent says they say. This is not rare bad luck. The tools write text that looks like a good answer, and a reference list is one more piece of text to look like.

If you pass an invented source to a customer, a funder or your own team, you lose trust that is hard to get back. For a Product Development Manager (PDM), claims are the raw material of strategy, marketing copy and epics. A false claim in a roadmap sends real people and real agents to build the wrong thing.

This lesson has two halves: how to **find** sources, and how to **judge** them, above all how to **check what an agent gives you**. The result is a one-page checklist you can print and reuse.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| Which sources are good enough for which claim, and which claims you will not make | Searching, collecting, summarising and comparing sources, in a written brief | Every source exists, says what the agent says, is trustworthy and is still standing | Legal (copyright and permitted use), finance (numbers), brand and marketing (public claims), security (what you paste into agents) |

## 2. Key ideas

### Where to look

Different questions live in different places. Pick the place first, then search.

- **Laws, rules, official guidance:** the website of the body that makes them.
- **Numbers about people, markets or places:** national and international statistics offices.
- **What researchers found:** scholarly search, such as Google Scholar, and university library catalogues.
- **What other products do:** their own pages, help centres, prices and changelogs.
- **What people think:** interviews and reviews (treat these as opinion).

A **search plan** is a short list: the question, the keywords and their synonyms, the places and the date. Keep a note of what you searched, or you will repeat yourself and you cannot say what you did *not* find.

Google Scholar's help page explains useful moves. The "Cited by" link finds newer work that uses a paper, and the library link helps you reach the full text. A paper's reference list leads to the sources *it* relies on.

### Kinds of source

| Kind | What it is | Example |
|---|---|---|
| Primary | A first-hand record | A law, a data table, a price list, your own test |
| Secondary | A report about primary material | A review article, a news story |
| Tertiary | A summary of summaries | An encyclopaedia, a "top 10" list |
| Opinion or marketing | Someone arguing or selling | A blog post, a vendor white paper |
| Grey literature | Reports not from a journal | A government study, a charity report |

Each step away from the first-hand record adds a person who chose and shaped what you see, and errors pass along. Grey literature is not peer-reviewed but may be the best source you have.

**Peer review** means outside experts read a paper before a journal publishes it. It is a useful filter, not a guarantee. A **preprint** is a paper shared before review; say that it is one. A claim with no source at all ("studies show...") is unsupported until you find one.

### Six questions for any source

Library guides give slightly different lists, but they agree on the core. Use these six:

1. **Authority.** Who made it? What do they know about this? Can you find them somewhere else?
2. **Purpose.** Why does it exist: to inform, to persuade, to sell, to entertain?
3. **Publication.** Who published it? Is there an editor, a review, a correction policy?
4. **Date.** When was it made, and does the topic change fast?
5. **Method and relevance.** How did they find out? Does it fit *your* question, your place and your time?
6. **Documentation.** Does it show its own sources, and do those exist?

### Read sideways: check the claim away from the page

A website will always say it is trustworthy, so do not judge it only from inside. **Lateral reading** means you leave the page and look at what *other* sources say about the author, the publisher and the claim. One open study found that a short online course could teach students this habit, and its authors say they do not know whether the habit lasts. Keep practising it.

Two cheap sideways moves: search the publisher's name plus a word such as "review" or "criticism", and search an exact sentence from the page to see where else it appears.

### How agents fail with sources

The same failures come again and again. Learn their shapes.

| Failure | What it looks like | How you catch it |
|---|---|---|
| Invented source | A plausible title, author and year that do not exist | Search the exact title; look up the DOI |
| Real author, wrong work | A real person or body, but they did not write that | Open the author's own list of work |
| Real source, wrong claim or detail | The paper exists but says something else, or the year or number is wrong | Find the sentence in the source |
| Link to a home page | The link works, but the article is not there | Find the exact page, or drop the claim |
| Source laundering | A site repeats a number that no one can trace | Trace it back to the first source |

A **DOI** (digital object identifier) is a permanent code for a published work, such as one for a journal article. Crossref runs a free, open service that returns the details of a work from its DOI, without sign-up. If an agent gives a DOI, you can look it up and compare the title, authors and year. A DOI that Crossref does not know may still exist with another registry, so treat a miss as a reason to look further, not as proof.

## 3. Step by step

1. **Start from your question card.** Copy the question, the good enough answer and the stop rule into your working file.
2. **Write a search plan.** List keywords and alternative words, the places you will look and the sources you expect to be primary. Save it as `research/search-plan.md`.
3. **Search and collect.** Open each result; do not trust a snippet. Note the title, publisher, date and exact address. Save an archived copy of any web page that matters, because pages change and disappear. Keep the link and a short quote, not the whole text.
4. **Sort by kind.** Label each source primary, secondary, tertiary, opinion or grey. The kind limits what you can claim from it.
5. **Run the checklist below** for every source, whether you found it or an agent did.
6. **Decide a verdict.** Mark each source **keep**, **keep with a warning** (say what) or **drop**, and write the reason. Dropped sources are worth recording too.
7. **Compare with your stop rule.** If you have the good enough answer, stop. If not, search again or say plainly what is missing.

### The source-checking checklist (print and reuse)

Copy this into a file, print it, or paste it into any issue. Use one copy per source. **Never accept a source from an agent until every line in blocks A and B is ticked.**

```markdown
# Source check

Source (title, as shown):
Where it came from:  [ ] I found it  [ ] an agent gave it to me
Date checked:        Checked by:

## A. Does it exist?
- [ ] I opened the link myself and it loads the exact page, not a home page.
- [ ] The title, publisher and date on the page match what I was told.
- [ ] The author or organisation is real (found on another site).
- [ ] For a paper: I searched the title in a scholarly search, or looked up
      the DOI, and the details match.

## B. Does it say that?
- [ ] I found the sentence, table or figure that supports the claim.
- [ ] The numbers, names and dates match the source exactly.
- [ ] The claim is no stronger than the source ("some" is not "all",
      "linked to" is not "causes").
- [ ] The source does not say something that weakens or reverses the claim.
- [ ] I copied a short exact quote and where to find it.

## C. Who made it, and why?
- [ ] I know who wrote it and what they know about this.
- [ ] I know why it exists: inform, persuade or sell.
- [ ] I checked what other sources say about the author or publisher.

## D. Is it right for my question?
- [ ] The date is recent enough for this topic.
- [ ] The place, people and time match my question.
- [ ] I know the kind: primary, secondary, tertiary, opinion, grey.
- [ ] I know if it is peer-reviewed, a preprint or neither.

## E. Is it still standing?
- [ ] I looked for a retraction, correction or later update.
- [ ] I saved an archived copy or a dated note of the page.

## F. Do others agree?
- [ ] One independent source supports it, or I wrote "single source".
- [ ] For a number: I traced it back to the first source.

## Verdict
[ ] keep   [ ] keep with warning: ____   [ ] drop: ____
Strength of evidence: [ ] strong  [ ] medium  [ ] weak
```

Blocks A and B take a few minutes and catch the worst failures. The other blocks take longer, so do them in full for the sources that carry your decision.

## 4. Worked example: TrailMug

TrailMug is fictional; the sources and results here are invented for teaching.

The founder has her Q01 card on how cafés in the pilot district handle returned cups. She briefs an agent to draft a short summary with sources. It returns six paragraphs and eight references. She runs the checklist on each. Here are five rows of her table.

| Claim in the draft | Source the agent gave | What she found | Verdict |
|---|---|---|---|
| Food-safety rules limit reuse of shared cups | A page on the city's health department site | Page exists; the sentence is there but applies to dine-in cups only | Keep with warning: wording |
| A named report says most cafés want a returns system | "Report by an industry group", with a title | No such title found; the group's site has no such report | Drop: invented |
| Washing a cup costs the café a set amount | A link to a trade magazine article | Link opens the magazine home page; the article is not found | Drop until found |
| Cafés in the district use deposits | A blog post | Real post; opinion by a cup seller | Keep with warning: opinion, seller |
| A university paper shows reuse lowers waste | A DOI | Crossref has no record of the DOI, or returns a different paper | Drop, then search by title |

Look at the pattern. Two sources did not exist or could not be found. One was real but biased. One was real but narrower than the claim. If she had used the draft as it came, much of it would have been unsupported. Instead she has a short list of what is solid and a clear note of what is missing: she still has no cost figure. Her stop rule says she does not yet have the good enough answer, so she searches again for a cost.

## 5. Working with AI agents on this

**What the PDM decides.** Which claims matter to the decision, what counts as a good enough source for each, and what you leave unsaid because the evidence is thin.

**What you delegate, and the exact brief.** You may hand an agent a whole research task. This is the **delegate** rung: you give a written brief with acceptance criteria, and you check the result.

```text
Task: find sources for the research question on the card below.
Card: <paste the question card>

Rules:
1. For every claim, give the source title exactly as shown, the publisher,
   the date and the full address of the exact page.
2. Give a short exact quote for each claim and say where in the page it is.
3. If you cannot open a source, say "not opened". Do not guess its content.
4. Never create a source, a DOI, an author or a number. If you do not know,
   write "I did not find one".
5. Mark each source primary, secondary, opinion or grey.
6. Separate what a source says from what you infer.
Output: a table with the columns claim, source, publisher, date, address,
quote, kind, then a list of claims you could not support. Maximum 10 claims.
```

These rules do not make the agent honest. They make its failures easier to test. Treat the whole table as a draft.

**How you verify.** Run the checklist, one source at a time, on every row. Open the links yourself. Do not ask the same agent "are these real?". It will usually say yes. A second agent can test that links load, but it is not independent evidence, because both can be wrong in the same way. You do block B (does it say that) with your own eyes on the source. When a claim carries a decision, find a second source. Record the results in the log (lesson 3).

**Which disciplines are involved.** Legal asks whether you may quote and store the source. Finance wants each number's origin and date. Brand and marketing need every public claim to trace to a source you checked. Security asks you not to paste private documents into an agent.

**Where this sits on the ladder.** This is **delegate**: a whole task, a written brief, and your checklist as the acceptance test. It becomes **orchestrate** when several agents each research a sub-question at once. Then you need one table format and a rule that a claim does not enter your log until a person has ticked the checks. That rule, enforced by a review step before merging, is **governing**. The more agents you run, the more your checks must be written down.

**Disclose.** Add to your working file: "Sources were found by an agent from my brief. I opened each source and checked each claim myself. Rejected sources are listed." See [Disclose AI use](/library/disclose-ai-use) and, for the general method, [Reviewing and verifying AI output](/library/tracks/working-with-ai-agents/07-reviewing-and-verifying-ai-output).

## 6. Common mistakes

- **Trusting a snippet, a title or a link that loads.** A home page is not the article. Find the exact claim.
- **Asking the agent to check its own work.** It may repeat the error with confidence.
- **Counting the same number twice.** Ten pages repeating one statistic are one source.
- **Treating "peer-reviewed" as "true".** It is a filter. Read what the paper shows and what it does not.
- **Stronger words than the source.** "Linked to" is not "causes". "In one district" is not "everywhere".
- **Forgetting dates and dropped sources.** An old source on a fast topic can be wrong now. Record rejected sources so you do not find them again.

## 7. Practice: search, check and judge

**Deliverable:** three files in `research/` in your git repository.

1. `search-plan.md`: your question (from lesson 1), keywords, places to look, and the stop rule.
2. `source-checks/`: one filled-in copy of the checklist for each of **at least five** sources. At least two must come from an agent, using the brief above. If you do not have two, ask an agent for a short list on your topic.
3. `source-verdicts.md`: a table with every source, its kind, the verdict (keep, keep with warning, drop) and the reason. Include at least one dropped source, or write "none dropped" and say how you made sure.

**Check:** pick one real lesson or article, run the checklist on one of its outside sources, and rewrite any unclear line in your own words.

## 8. Checklist

- [ ] I wrote a search plan before I searched.
- [ ] I opened every source myself; I did not rely on snippets or on the agent.
- [ ] I labelled each source primary, secondary, tertiary, opinion or grey.
- [ ] I ran blocks A and B of the checklist on every agent-supplied source.
- [ ] I looked for retractions or corrections for papers that carry a decision.
- [ ] I traced each important number back to its first source.
- [ ] I recorded dropped sources and why.
- [ ] I recorded my AI use.

## 9. Further learning

Cornell's tutorial explains scholarly source types, peer review and grey literature. The Berkeley guide gives six questions and the Harvard Library page a similar five-point list, so you can compare them. The open Harvard Kennedy School study explains lateral reading with evidence. Google Scholar's help page shows how to find a paper and its newer citations. Crossref's open API looks up a DOI, and the Retraction Watch guide shows how to check whether a paper was withdrawn. Next, in [Keep an evidence log in git](/library/tracks/research-and-evidence/03-keep-an-evidence-log-in-git), you record everything so that someone else can check it.
