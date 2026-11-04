---
title: "Keep an evidence log in git"
description: "Record every claim with its source, your check and a grade, in plain files under version control. Then put it all together: direct an agent to draft a summary, verify every claim and link, and file the log."
section: "Research and evidence"
order: 3
track: "research-and-evidence"
level: "core"
duration: "3 hours"
outcomes:
  - "Design an evidence log with a fixed set of fields, kept in git"
  - "Record each claim with its source, a short quote, the check result and a grade"
  - "Keep a search record, a list of rejected sources and an AI-use note"
  - "Direct an agent to draft a summary, verify it claim by claim and file the log in a merge request"
resources:
  - "brown-university-library/documenting-methods-and-describing-data"
  - "national-university-library/database-research-log"
  - "adr/architectural-decision-records"
  - "cognitect/documenting-architecture-decisions"
  - "gitlab/git-guides"
  - "gov-uk/service-manual-user-research"
prerequisites:
  - "week-1-see-the-whole-product"
  - "disclose-ai-use"
updated: 2026-11-03
---

**Supports:** Developer, weeks 1, 3 and 4 (reasons for epics and defending the roadmap) and the Master Developer Product Package, which needs evidence a reviewer can check. **Time:** about three hours, because the practice asks you to verify every link.

## 1. Why this matters

Six weeks from now someone will ask, "Where did we get that?" It may be a teammate, a funder, a reviewer, a customer or you. If the answer lives in a chat window or in your memory, you will not find it. If an agent produced the research and the chat is gone, the claim is an orphan: it sounds true and nobody can prove it.

An **evidence log** is a plain file in git that records each claim, where it came from, what you checked and how far you trust it. It makes research repeatable, reviewable and honest. It is also how the decisions in your roadmap and your decision records get their reasons. When a source changes or is withdrawn, the log tells you which decisions rest on it.

For a Product Development Manager (PDM) the log is a management tool. You will direct many agents, and each one produces words faster than you can read. The log is the gate: **nothing becomes a fact in your product until it has an entry that a person has checked.**

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What the log must record, which claims enter it, the grade of each, and who signs off | Drafting a summary, filling the first version of log rows from sources, formatting, finding broken links | Every row: source opened, quote found, check result true, grade fair | Legal and privacy (what you may store), finance (numbers), operations (who keeps the log up to date), brand (public claims) |

## 2. Key ideas

### Why git

Git keeps every version of a file with a date, an author and a message. You can compare two versions, see who changed a grade, and go back. A merge request lets a second person read the change before it joins the main line. This is the same discipline you use for code, applied to knowledge. The Dojo rule that git is the source of truth covers research too (see [Git is the source of truth](/library/git-is-the-source-of-truth)).

### What a log entry holds

One entry is one **claim**. Keep these fields:

| Field | What goes in it |
|---|---|
| `id` | A short code, such as `E-014` |
| `claim` | The claim in **your** words, one sentence |
| `question` | Which question card it helps (`Q01`) |
| `source` | Exact title as shown, and the publisher |
| `address` | The full link, or the DOI |
| `kind` | primary, secondary, tertiary, opinion or grey |
| `quote` | A short exact quote, or the table and page |
| `found_by` | you, or an agent (and which task) |
| `checked_by` | A person's role or initials, and the date |
| `check` | verified, partly, failed or not checked |
| `grade` | strong, medium or weak |
| `contrary` | Anything that disagrees, with its source |
| `note` | Warnings, limits, what is missing |

Use the same grades as in [Make sense of the evidence and decide](/library/tracks/product-discovery/04-make-sense-of-evidence-and-decide). **Strong** means several independent sources, or first-hand data, that fit your question. **Medium** means one good source or several that agree in words. **Weak** means one voice, an opinion, or a source you could only partly check.

### Four files, not one

Research produces more than claims. Keep four files in `research/`:

1. `evidence-log.md`: the claims, one entry each.
2. `search-record.md`: what you searched, where, with which words, on which date. A library guide on a "database research log" shows the idea: record the databases, the terms and the limits you used, and what worked. It stops you repeating yourself and shows what you did *not* find.
3. `rejected-sources.md`: sources you dropped and why. This is where invented agent sources go. It is valuable: it shows your method worked.
4. `README.md`: a short note on what the folder holds, the AI-use disclosure, and how often entries must be re-checked.

A university data-management guide recommends the same habit in science: keep a notebook of decisions and methods, plus a README that explains how files were made. The same applies here.

### Make a claim traceable, not just recorded

An entry is only useful if a stranger can check it. That means the exact address, the exact quote and a date. Pages change, so write the date you opened it. Keep an archived copy or a note of the page version when the claim matters. Do not store whole copies of articles: copyright may not allow it. Store the link, a short quote and your own words.

### Evidence ages

A source from last year may be wrong today. Add a **review by** date to the README: for example, "re-check strong entries every six months, and weak ones before they are used". A calendar entry or an issue with a due date makes this real.

### Private and sensitive material

The log is for public sources and your own notes. Do not put names, contact details or private conversations in it. If interviews support a claim, point to the coded notes (C1, C3) stored as in [Talk to customers](/library/tracks/product-discovery/02-talk-to-customers). Do not paste non-public documents into an agent to summarise them unless your organisation allows it.

### Log decisions, too

When a claim leads to a decision, write a decision record and link the log entries it rests on. The [decision record template](/library/template-decision-record) and the short posts on architectural decision records explain the pattern: one small file per decision, with the context, the options and the reason. When a source is dropped or a grade changes, you can search the log for the decisions that need a second look. In the Dojo, **people write the epics and the roadmap**; the log is what they point to when they explain why.

## 3. Step by step

### Step 1: Create the folder

```bash
mkdir -p research/questions
touch research/evidence-log.md research/search-record.md \
      research/rejected-sources.md research/README.md
```

### Step 2: Write the README

State the purpose, the question cards it serves, the grades, the review-by rule, and the AI-use note. Commit it first.

### Step 3: Write the entry template

Put one blank entry at the top of `evidence-log.md`, so every entry has the same fields.

```markdown
## E-000: <one-sentence claim in my words>
- Question: Q01
- Source: <exact title>, <publisher>
- Address: <full link or DOI>
- Kind: primary | secondary | tertiary | opinion | grey
- Quote: "<short exact quote>" (<where in the source>)
- Found by: me | agent (<task>)
- Checked by: <initials>, <date>
- Check: verified | partly | failed | not checked
- Grade: strong | medium | weak
- Contrary: <what disagrees, with source, or "none found after ...">
- Note: <limits, warnings, what is missing>
```

### Step 4: Add entries as you verify

Only add a claim after you have run the source-checking checklist from [Find and judge sources](/library/tracks/research-and-evidence/02-find-and-judge-sources). A claim you could not check goes in with `Check: not checked`, or does not go in at all. Never leave an unchecked claim looking like a verified one.

### Step 5: Record the search and the rejects

Add a line to `search-record.md` for each search (date, place, words, result). Add each dropped source to `rejected-sources.md` with the reason: not found, wrong claim, opinion only, broken link.

### Step 6: Commit in small steps

Make one commit for every batch of checked entries. A good message says what changed: `Add six verified entries for Q01 and reject two invented sources`. Small commits make a log easy to review and to undo by moving forward.

### Step 7: Open a merge request and get a second pair of eyes

Open a merge request for the whole batch. Ask another person to pick three entries at random and repeat the check. If one fails, check them all again. This is your review gate.

### Step 8: Use the log

Link the entries you rely on from your decision records and from the issues behind your epics. When a claim changes, fix it forward in a new commit. Do not delete the old entry: change its check to failed or its grade, and say why.

## 4. Worked example: TrailMug

TrailMug is fictional. The source and the cost here are invented for the example.

The founder has her checked table from lesson 2. She files two entries. One is verified; one is a drop.

```markdown
## E-001: Reuse of shared cups is restricted for dine-in service in the pilot city
- Question: Q01
- Source: "Food handling guidance for cafés" (example title), City Health Department (fictional)
- Address: https://example.org/guidance/cafes (example address)
- Kind: primary
- Quote: "..." (section 4, shared containers)
- Found by: agent (search task 1)
- Checked by: F., 3 November 2026
- Check: partly (the rule applies to dine-in cups; takeaway is not covered)
- Grade: medium
- Contrary: none found after three searches
- Note: ask the health department in writing about returned takeaway cups.
```

And in `rejected-sources.md`:

```markdown
- "Report on café attitudes to returns" (title given by the agent):
  not found on the publisher's site or in a scholarly search. Dropped.
  Found by agent on 3 November 2026.
```

Her decision record for the pilot location now says: "Medium evidence: the rule covers dine-in only; take written advice before launch." The entry E-001 is linked. A reviewer reading the record can click through to the exact check.

Notice what the log did. It shows the claim was *partly* verified, not fully. It keeps the invented report as a lesson. It tells the founder what to do next: ask the department. A reader can trust the entry, because it states its own limits.

## 5. Working with AI agents on this

**What the PDM decides.** The fields of the log, the grade scale, who must sign off, and the rule that no claim reaches a public page or a decision without a checked entry.

**What you delegate, and the exact brief.** You can delegate two kinds of work: drafting the summary, and the clerical work of building the log from sources you have verified.

First, the research draft:

```text
Task: draft a one-page summary that answers the question on the card below.
Card: <paste the card>

Rules:
1. Every factual sentence ends with a number in square brackets that points
   to a numbered source list at the end.
2. The source list gives, for each source: exact title as shown, publisher,
   date, full address, and a short exact quote with its location.
3. Do not include a claim that you cannot tie to a source. Put such points
   under a heading "Not supported".
4. Never invent a source, a DOI, an author, a quote or a number. If you did
   not open a source, write "not opened".
5. Separate what the sources say from what you infer.
6. End with "What this does not tell us".
Length: about 400 words plus the source list.
```

Then the clerical work, only for claims you have checked:

```text
Here are my verified claims with my notes. Turn each into an entry in the
exact template below. Do not change the claim, the quote, the address or my
check result. Do not add sources. If a field is missing, write "missing"
and list it at the end.
```

**How you verify.** Do the checklist for **every** claim in the draft: open the source, find the quote, compare numbers, look for retraction and corrections, and find a second source when a decision depends on the claim. Then check the clerical output: compare each entry to your notes and reject any change you did not ask for. Use the review in the merge request to make a second person repeat a random sample. Keep the raw agent draft in git, marked "draft, unverified", so that the difference between the draft and the log is visible. That difference is your evidence that you checked.

**Which disciplines are involved.** Legal and privacy: the sources you may store and the data you may paste into an agent. Finance: numbers must carry their date and source. Brand and marketing: a public claim must trace to a *verified* entry. Operations: someone owns the review-by dates. Security: keep private material and secrets out of the research folder.

**Where this sits on the ladder.** You **delegate** the draft and the clerical work with a written brief, and your checks are the acceptance criteria. When several agents work on several questions, you **orchestrate**: one folder, one log format and one question card each. The review in the merge request, the "no entry without a check" rule and the review-by dates are your first **governance**: written rules that keep the work safe without you watching every step.

**Disclose.** Put in `research/README.md`: "The first draft of the summary was written by an AI agent from my brief. I opened every source, checked every claim and link, and recorded the result. Rejected sources are in rejected-sources.md." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **A log of links, not claims.** A link without a claim, a quote and a check does not help a reviewer.
- **Marking everything verified.** Use "partly" and "not checked" honestly. They protect you.
- **Only logging what supports you.** Keep the contrary field and fill it.
- **Writing the claim in the source's words.** Use your own, with a short exact quote beside it.
- **Storing whole articles.** Keep the link, a quote and a note.
- **Changing history.** Do not delete a failed entry. Mark it failed and explain. Fix forward.
- **No dates.** Pages change. Write when you opened it.
- **No owner.** A log with no one responsible for review-by dates goes stale.
- **Pasting private notes into the log or an agent.** Keep codes, not names.
- **Letting the agent "tidy" the log.** It may quietly change a quote or a result. Compare every changed line.

## 7. Practice: draft with an agent, verify everything, file the log

This is the practice for the whole track.

**Deliverable:** these files in `research/`, in one merge request.

1. A question card from lesson 1 (`questions/Q01-...md`).
2. `agent-draft.md`: the unedited summary your agent wrote from the first brief above, with a header line "Draft, unverified. Written by an AI agent."
3. `evidence-log.md`: one entry for **every factual claim** in the draft that you can support, each verified with the checklist from lesson 2. Any claim you cannot support goes in `rejected-sources.md` or in a "Not supported" list.
4. `search-record.md` and `rejected-sources.md`.
5. `verification-notes.md`: a short report with the counts (how many claims, how many verified, partly, failed), the three most serious problems you found, and what you changed in the summary because of them.
6. `summary.md`: your final summary, rewritten so that every sentence rests on a verified entry, and with a section "What this does not tell us".
7. `README.md`: the purpose, the grades, the review-by rule and the AI-use note.

In the merge request description, say what the question was, what you verified, and that an agent helped. Ask one other person to repeat the check on three entries.

**Check:** a stranger should be able to open any entry and verify it in five minutes. Test that on a friend.

## 8. Checklist

- [ ] The log has the same fields for every entry.
- [ ] Every entry has an exact address, a short exact quote and a checked date.
- [ ] I used "partly" and "not checked" where they were true.
- [ ] Every claim has a grade and a contrary field.
- [ ] I kept a search record and a list of rejected sources.
- [ ] The raw agent draft is in git, marked as unverified.
- [ ] A second person repeated the check on a sample.
- [ ] The README has a review-by rule and my AI-use note.
- [ ] My final summary contains no claim without a verified entry.

## 9. Further learning

The Brown University guide on documenting methods describes the research notebook and README habit in plain words. The National University page shows a simple search log. The ADR community site and the short post on documenting architecture decisions show how to write one small file per decision, which is the model for linking decisions to evidence. GitLab's Git guide helps you read the history of your log, and the UK service manual on user research shows a public team recording what it learns. When you have a verified log, use it to write the reasons behind the epics in your [roadmapping and epics track](/library/tracks/roadmapping-and-epics/).
