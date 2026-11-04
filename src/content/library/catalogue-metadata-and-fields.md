---
title: "Catalogue metadata and fields, explained"
description: "Every Master Catalogue field and every metadata header field explained in plain words, with a TrailMug example, a bad answer and a good answer for each."
section: "Catalogue framework"
order: 7
level: foundation
duration: "60 min"
outcomes:
  - "Fill every Master Catalogue field with a correct, checkable answer."
  - "Write the metadata header for each of the four catalogues."
  - "Spot a weak answer and rewrite it."
  - "Know which values to write as Not confirmed or Not applicable."
resources:
  - atlassian/service-catalog
  - backstage/software-catalog
  - c4model/c4
  - gov-uk/service-standard-simple
  - owasp/secrets-management-cheat-sheet
prerequisites:
  - catalogue-master-layer
---

The [Master layer](/library/catalogue-master-layer) uses eight fields. Every catalogue starts with a metadata header of eight more. This page explains each, one at a time, in plain words. Each field has an example from TrailMug (fictional), a weak answer and a strong one.

## Why it matters

A field is a question. If you answer vaguely, the catalogue looks complete and says nothing. Most bad catalogues have every box filled and no box useful. The difference is small, concrete, checkable answers.

## Key ideas

- **Checkable.** A stranger could verify the answer.
- **Short.** One sentence or one list.
- **Honest.** Use "Not confirmed" or "Not applicable". Never invent.
- **Same names everywhere.** The name in one field is the name in all.

## Part 1: The eight Master Catalogue fields

| Field | In plain words | Strong TrailMug answer | Weak answer |
|---|---|---|---|
| Repo or service name | The exact name people type | `trailmug-svc-returns` | "The returns thing" |
| URL or domain | Where it lives. "Not available" if there is none. | `https://git.example.org/trailmug/trailmug-svc-returns` | "On our server" |
| Type | What kind of thing it is | API | "Software" |
| Purpose | One sentence on why it exists | Records each cup return and starts the deposit refund. | "Handles returns and also some other things and reporting" |
| What it ties into | What it depends on and what depends on it, with direction and purpose | Called by the café tablet page to record a return. Calls the email sender to send a refund notice. Writes to the CRM. | "Many systems" |
| Owner | One accountable person, team or organisation. "Not confirmed" if unknown. | Operations lead (Leo) | "Everyone" |
| Planning access | Which plan, task list or board holds the work, and who can see it. "Not confirmed" or "Not applicable". | Planning group trailmug, board "Returns". Visible to the product team. | "Yes" |
| Notes and findings | Verified observations, gaps, risks, open questions, links | Opened 2027-03-02. No alert if a refund fails for a day. Runbook linked. | "Works fine" |

Plus the **status**: FOUND, NOT FOUND or PLANNED, with evidence or search scope.

### Allowed types

Repository, application, API, database, cloud service, integration, infrastructure, agent, documentation. Pick one. If two seem right, you may be looking at two rows.

### When to write Not confirmed, Not applicable or Not available

| Phrase | Use when |
|---|---|
| Not confirmed | You looked and could not verify, or you did not look yet |
| Not applicable | The question does not apply to this kind of item |
| Not available | A value such as a URL does not exist |

## Part 2: The metadata header

Put this table at the top of every catalogue page. It makes the page reviewable.

| Field | In plain words | TrailMug example |
|---|---|---|
| Product or system | The name of what is described | TrailMug |
| Catalogue type | Master, ORBITAL, ANDROID or Tech | Master |
| Document owner | One accountable person or role | Product manager (Maya) |
| Version | Major.minor. Raise major for structural change, minor for small edits | 1.2 |
| Status | Draft, In review, Approved or Archived | In review |
| Last updated | A date in the form year-month-day | 2027-03-18 |
| Next review | A date, also in a calendar | 2027-06-18 |
| Related catalogues | Links to the other three | Links to ORBITAL, ANDROID and Tech pages |

Copy the table as it is and fill every value. An empty "Next review" is a red flag.

## Part 3: Fields for a single service entry

When you write the small [catalogue entry template](/library/template-catalogue-entry) for one service, use the same discipline. The key fields are id, name, kind, owner, tier, lifecycle, repos, dependencies, service levels, support contact, runbook and data class. Each has an example in that template page.

## Steps to check your fields

1. Pick any row. Ask: could a stranger verify each cell in five minutes?
2. Replace every word like "stuff", "various", "several" or "etc." with a name or a number.
3. Check that every owner is one accountable name.
4. Check that all "ties into" cells name rows that exist.
5. Check the header: owner, version, status, dates, links.

## Working with AI agents

- **May:** flag vague words, check that "ties into" names exist as rows, check dates are in the right form.
- **May not:** fill owner, purpose or status for you.
- **A safe brief:** "List every cell in this table that contains the words various, several, stuff, misc or etc. Give row and column. Do not rewrite."

## Common mistakes

1. **Vague purpose.** One sentence, one job.
2. **Owner is a group chat.** Name a role.
3. **Ties without direction.**
4. **Status missing.** Every row has one.
5. **Dates in different formats.** Use year-month-day.
6. **Header without a next review.**

## Practice

1. Take three rows of your catalogue. Rewrite each weak cell into a strong one.
2. Fill the metadata header for your Master page.
3. Choose one row and write the ties with direction.
4. Replace three "Not confirmed" cells with checked facts, or leave them honest.

## Checklist

- [ ] All eight fields are filled in every row.
- [ ] Types come from the list.
- [ ] Ties have direction and purpose.
- [ ] The metadata header is complete and dated.
- [ ] No vague words and no secrets.

## The 2030 Product Development Manager lens

- **You decide:** what a good answer looks like, and who is accountable for each row.
- **You delegate to agents:** the vague-word scan, the link and name checks, the date format checks, a first draft of purposes from READMEs.
- **A sample brief:** "Compare the names in the 'ties into' column with the names in the first column. List any that do not match."
- **You verify by:** testing two rows with the five-minute stranger test.
- **Disciplines involved:** product, engineering, operations and documentation.
- **On the agent ladder:** **use** to clean fields, **delegate** to scan for gaps. A person owns every answer.

## Further learning

Next: the [full TrailMug catalogue](/library/catalogue-trailmug-full-example). Revisit [governance and the checklist](/library/catalogue-governance-and-checklist) for the review rules.
