---
title: "Role lens: marketing and growth"
description: "How a marketer uses DREAM, personas, Launch Sequence stage six and the GROWTH review to reach the right people honestly, how agent sessions draft and measure under policy, and how to verify claims before anything is published."
section: "Frameworks"
order: 44
track: "frameworks"
level: "core"
duration: "45 min"
outcomes:
  - "Describe the marketing seat in terms of DREAM, the go-to-market stage and GROWTH"
  - "Write a positioning page and launch plan that only claim what the evidence supports"
  - "Use agent sessions for drafts and measurement with a human approving every public message"
resources:
  - "atlassian/product-launch"
  - "y-combinator/library"
  - "mit-ocw/new-enterprises"
  - "sba/plan-your-business"
  - "w3c/intro-web-accessibility"
  - "dora/dora-research-program"
prerequisites:
  - "tracks/frameworks/40-role-lens-one-shared-language"
updated: 2026-11-03
---

**Dojo programme link:** this lens supports Developer week 5 (brand and website) and the go-to-market work of the launch (lesson 27 and lesson 34).

## 1. Why this matters

A product nobody hears about, or that people hear about wrongly, does not help anyone. Marketing is the work of reaching the people who have the problem, telling them truthfully what the product does, and learning from what they say back.

It is also the seat with the sharpest risk when agents join. A session can write a hundred posts and emails in a minute. If one contains a claim you cannot support, such as a result, an approval or a customer you do not have, it is public, and trust is hard to win back. So the marketing rule is the simplest of all: **a person approves every public word, and every claim has a source.**

## 2. Key ideas, explained

### 2.1 What the seat owns

| Responsibility | Framework or artefact | File in git |
|---|---|---|
| Know who it is for and what they say | DREAM (Discover, Relate), personas | `docs/personas.md`, `research/` |
| Say what it is, and why it is different | Positioning | `marketing/positioning.md` |
| Plan the launch | Launch Sequence stage 6 (go-to-market), LAUNCH people checklist | `docs/launch/gtm.md` |
| Choose channels | Channel plan, with budget | `marketing/channels.md` |
| Tell and persuade | DREAM (Advise, Motivate): the message | `marketing/messages/` |
| Measure and learn | GROWTH (Gauge, Research, Target) | `docs/growth/` |

### 2.2 DREAM for marketers

DREAM is the Dojo's way of approaching people: **D**iscover their situation, **R**elate to what matters to them, **E**mpower them to act, **A**dvise with honest information, **M**otivate. Used well it is the opposite of pressure: you learn first, speak plainly, and give people what they need to decide. In a marketing plan, each message should map to one persona and one journey step (for example, a partner café considering joining).

### 2.3 Positioning in four lines

A short positioning statement keeps every channel consistent:

1. **For** (the persona) **who** (has this problem),
2. **[Product]** is a (category) **that** (the key benefit).
3. **Unlike** (the alternative people use now), it (the real difference).
4. **Evidence:** (the facts that back it up, with sources).

The fourth line is the discipline. If you cannot fill it, you are not ready to say the first three in public. The [Atlassian guide to product launches](https://www.atlassian.com/agile/product-management/product-launch) and the [YC Startup Library](https://www.ycombinator.com/library) give free views on positioning and early customers; read them with the same critical eye you give any advice.

### 2.4 Go-to-market inside Launch Sequence

Stage six of Launch Sequence (see [lesson 27](/library/tracks/frameworks/27-deployment-governance-and-go-to-market/)) asks whether the people who need to know are told, supported and measured. The LAUNCH checklist for people covers Logistics, Application, Users, Navigation, Channel and Hive. Practical items:

- A **help page and a support route**, before the announcement.
- A **short note to each partner**, in their words.
- A **press or community note**, only when there is something real to say.
- **Measures** agreed before launch, so you can tell if it worked.
- A **rollback message** ready, in case the feature is switched off.

### 2.5 Honest claims

Rules the Dojo keeps for itself and teaches:

- Do not state results you do not have; mark examples as examples.
- Do not claim approvals, accreditation or partnerships that are not confirmed. "Application in progress" is honest, "approved" is not unless it is.
- Do not use hype words as proof ("revolutionary", "inevitable success"). Describe what the thing does.
- Disclose use of AI where people would reasonably want to know (see [Disclose AI use](/library/disclose-ai-use)).
- Make marketing pages accessible; the [W3C guide](https://www.w3.org/WAI/fundamentals/accessibility-intro/) is a starting point.
- Respect privacy: do not publish a real person's story or photo without their written agreement.

### 2.6 Measure with care

Choose measures that change decisions: partner sign-ups, activation (first successful cup return), referral, support questions. Avoid counting only impressions. Record the source and the date of each number. The GROWTH Gauge and Target parts (lesson 35) use these. Be aware of tracking rules and of collecting more data than you need; collect only what you will use.

## 3. Step by step

1. **Pick one persona and one journey step** for this campaign.
2. **Write the positioning** with evidence for each claim.
3. **Choose two channels** you can serve well, not six.
4. **Write the messages** by hand for the first campaign. Then use sessions to adapt length and format.
5. **Build the claims table** (`marketing/claims.md`): each claim, its source, the date checked, who approved.
6. **Prepare support**: help page, contact route, a short FAQ.
7. **Set measures** and the review date.
8. **Approve every public message** yourself or through a named approver.
9. **Launch small**, then review in GROWTH.

## 4. Worked example: TrailMug

Maya and a volunteer prepare to invite more cafés to join.

- **Persona and step:** Leo, café owner, Consider.
- **Positioning:** For café owners who want to cut cup waste without slowing the counter, TrailMug is a cup-return service that scans in under ten seconds. Unlike a paper-slip scheme, it needs no staff training beyond a ten-minute guide. Evidence: measured median return time at four cafés (with the dates), the setup guide.
- **Claims table (extract):**

| Claim | Source | Checked | Approved by |
|---|---|---|---|
| Median return time 18 seconds | Mission Control board, week 4 | 2026-11-03 | Maya |
| Setup under 30 minutes | Setup log of two cafés | 2026-11-03 | Maya |
| "Used by hundreds" | none | not allowed | rejected |

The agent draft of the invitation email said "used by hundreds of cafés". The claims table caught it, since only four cafés use the service, and Maya removed the sentence. The email went to ten cafés she had already spoken to, with a help page and a phone number. She measured replies, visits booked and cafés live, and reviewed them in the monthly GROWTH review.

## 5. Working with AI agents on this

**What the marketer decides.** Who to reach, what to say, which claims are true, which channels, when to publish, and what to do when the response is not what you expected.

**What is delegated, with the exact brief.**

```text
Read marketing/positioning.md and marketing/claims.md. Write three short
invitation emails for café owners (under 150 words each, plain words).
Use only claims that appear in claims.md with a source. Mark each claim
in the email with its row number. Do not add numbers, names or promises
that are not in the table. Do not send anything.
```

```text
Read marketing/messages/*.md. For each, list every factual claim and say
whether it appears in marketing/claims.md. Output a table: message, claim,
IN TABLE or NOT IN TABLE. Do not edit the messages.
```

```text
Read data/outreach.csv (anonymised). Compute for each week: emails sent,
replies, visits booked, cafés live. Show the formulas you used. Do not
interpret causes.
```

**How to verify.** Read each draft. Trace each claim to its source file. Recompute one weekly row by hand. Check that nothing was sent.

**Disciplines involved.** Product (what is true about the product), design (brand and pages), engineering (tracking and the help page), operations (support readiness), finance (channel cost), founder (promises).

**Policy.** Sessions that touch marketing have **read and draft** access only. Sending, posting and spending need a person. A gate that blocks publishing a message whose claims are not in the claims table is a good first policy for an agent-assisted team. For how larger operations structure sessions and decisions, see [Agent orchestration](/library/tracks/agent-orchestration/).

## 6. Common mistakes and how to avoid them

- **Claims without sources.** Keep a claims table.
- **Hype words.** Describe the behaviour instead.
- **Overclaiming approvals or customers.** State only what is confirmed.
- **Six channels, none done well.** Start with two.
- **Launching before support is ready.** Help page first.
- **Sending agent drafts unread.** Approve every public word.
- **Counting only impressions.** Count outcomes.
- **Publishing a person's story without consent.** Ask in writing.
- **Hiding AI use.** Disclose where it matters.

## 7. Practice

**Deliverable in git:** a branch `marketing-lens`:

1. `marketing/positioning.md` in the four-line form with evidence.
2. `marketing/claims.md` with at least eight claims, sources, dates and approver.
3. `marketing/channels.md` with two channels, budget and measure.
4. Three drafted messages in `marketing/messages/`, one written by hand and two adapted by a session, with a note on what you changed.
5. `docs/launch/gtm.md`: help page, support route, partner note, rollback message, measures.
6. A merge request listing agent briefs and your checks, and noting any claim you removed.

## 8. Review checklist

- [ ] Each message maps to a persona and journey step.
- [ ] Every claim has a source and a date.
- [ ] No claim of an approval, partner or result I cannot show.
- [ ] Support is ready before the announcement.
- [ ] A named person approves every public message.
- [ ] Measures are agreed, with a review date.
- [ ] Accessibility of pages is checked.
- [ ] AI use is disclosed where it matters.

**Next:** the [finance and operations lens](/library/tracks/frameworks/45-role-lens-finance-and-operations/) covers what it costs and how it keeps running.
