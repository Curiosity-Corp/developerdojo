---
title: "Threats and the OWASP Top 10"
description: "Who attacks software and how, the families of weakness that cause most breaches, and the plain questions that turn them into security requirements and review checks."
section: "Security fundamentals"
order: 1
track: "security-fundamentals"
level: "foundation"
duration: "75 min"
outcomes:
  - "Explain in plain words who attacks software and what they want"
  - "Name the families of weakness in the OWASP Top 10 and turn each into a review question"
  - "Write security acceptance criteria into a spec"
  - "Direct an agent to review a change for security weaknesses and verify that the findings are real"
prerequisites:
  - "the-way-five-rules"
resources:
  - "owasp/top-10"
  - "owasp/cheat-sheet-series"
  - "owasp/application-security-verification-standard"
  - "owasp/webgoat"
  - "owasp/juice-shop"
  - "openssf/developing-secure-software-lfd121"
  - "cisa/secure-by-design"
updated: 2026-11-03
---

Lesson 1 of the Security fundamentals track. It stands alone, and it is the vocabulary for the three lessons that follow.

## 1. Why this matters

Most successful attacks on software do not use clever, new techniques. They use well-known weaknesses that were built in by accident: a page that trusts what a user types, a permission check that someone forgot, a setting left at its default, a library nobody updated. The same short list of weakness families appears year after year.

That is good news for a product manager. A short list can be learned. Each item on it can become a question you ask in a spec review, an acceptance criterion you write down, and a check you ask an agent to run. You do not need to find the weakness yourself. You need to make sure someone looked for it, and that you can tell whether they did.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What must be protected, what level of risk is acceptable, which security criteria go in each spec | Reviewing a change against the weakness families, writing security tests, drafting a threat summary, explaining a finding | Reproducing each reported weakness, reading the test that proves the fix, checking that criteria were met and not only claimed | Security engineering (depth and tooling), legal and privacy (what data may be held), operations (monitoring and response), design (safe defaults in the interface) |

## 2. Key ideas, explained

### Who attacks, and what they want

Think in four groups, and ask what each wants.

| Who | What they want | What it means for you |
|---|---|---|
| **Opportunists and automated scanners** | Anything open. They test every address on the internet for known flaws, all day. | Basic hygiene stops most of them. A known flaw left unfixed is found within hours or days. |
| **Criminals** | Money: stolen data, access to sell, ransom, fraud, computing power. | Anything of value, including customer lists and credentials, is a target. |
| **Insiders and mistakes** | Not always malice. A tired person, a wrong click, a leaked key, an over-broad permission. | Most real incidents are mistakes. Design so that one mistake is not fatal. |
| **Targeted attackers** | A specific organisation or person. They are patient. | Defence in depth and fast detection matter more than one strong wall. |

Notice that three of four are not after *you*. They are after whatever is easy. The first job of security is not to be easy.

### The three things to protect

Security people use three words, often shortened to the CIA triad.

- **Confidentiality:** only the right people can see it.
- **Integrity:** it cannot be changed without permission and without a trace.
- **Availability:** it works when needed.

A spec should say which of the three matters most for each feature. A customer's address needs confidentiality. A payment amount needs integrity. A booking page needs availability. When you give an agent a task, naming the one that matters most changes what it checks.

### Attack surface and trust boundaries

The **attack surface** is every place an outsider can reach: pages, interfaces other programs call, file uploads, login forms, open network ports, the tools and plug-ins an agent uses. Fewer entry points mean fewer chances. A **trust boundary** is a line where data moves from something you do not control to something you do: the user's browser to your server, a third-party service to your application, a web page to an agent. **Everything that crosses a trust boundary must be checked.** Almost every weakness below is a failure to check something that crossed a line.

### The OWASP Top 10

The Open Worldwide Application Security Project publishes the [OWASP Top 10](https://owasp.org/projects/top-ten), a regularly updated, consensus list of the most critical risks for web applications. Its exact ranking and wording change between editions, so read the current edition, but the families are stable. Here they are as questions you can ask.

| Family | Plain meaning | The question to ask |
|---|---|---|
| **Broken access control** | A person can do or see something they should not, such as another customer's record. | For every action: who is allowed, and where is that checked on the server? |
| **Cryptographic failures** | Sensitive data is not protected in transit or at rest, or uses weak methods. | What sensitive data do we hold, and is it encrypted when stored and when sent? |
| **Injection** | Input is treated as instructions: a database command, a shell command, a page script. | Is anything a user supplies ever put inside a command or query without being handled safely? |
| **Insecure design** | The feature works as built but was never thought through for abuse. | What would an attacker do with this feature? Was that discussed before building? |
| **Security misconfiguration** | Defaults left on, debug switched on, open storage, verbose errors. | What are the settings, and who checked them against a baseline? |
| **Vulnerable and outdated components** | A library or service with a known flaw. | What do we depend on, and how do we learn about and apply fixes? |
| **Identification and authentication failures** | Weak sign-in, no protection against guessing, bad session handling. | How does a person prove who they are, and what happens after many wrong tries? |
| **Software and data integrity failures** | Code or data updated or loaded without checking where it came from. | How do we know that what we run is what we built? |
| **Logging and monitoring failures** | Nobody would notice an attack in progress or be able to reconstruct it. | If this were abused tonight, what would we see tomorrow? |
| **Server-side request forgery** | A server is tricked into fetching an address chosen by an attacker, often reaching internal systems. | Does the server fetch addresses supplied by users, and what can it reach? |

Use this table as a review prompt. It will not find every problem. It will find the common ones.

### Defence in depth

No single control is perfect, so layers are used: checks in the interface, checks on the server, narrow permissions, encryption, monitoring, backups, and a way to respond. When you review a design, ask what happens if the first layer fails. If the answer is "everything is exposed", add a layer.

### Security acceptance criteria

Security becomes real when it is written as a testable criterion in the spec.

Weak: "The feature should be secure."

Strong:

- "Only the signed-in owner of an order can read or change it. A request for another customer's order returns a refusal, and a test proves it."
- "No user input is placed into a database command except through parameters, and a test submits a hostile string and shows it stored as plain text."
- "Passwords are never stored in readable form or written to logs."
- "After five wrong sign-in attempts the account is slowed or locked, and the event is logged."
- "The service cannot fetch addresses outside the allowed list."

Each can be verified. Each can be given to an agent as a requirement and to a reviewer as a check.

### Safe places to practise

Two free, deliberately vulnerable applications let you see weaknesses for real: [OWASP Juice Shop](https://owasp.org/projects/juice-shop) and [WebGoat](https://owasp.org/projects/webgoat). Run them only in a place you own or an isolated lab, never on a shared network or against a system that is not yours. The [Cheat Sheet Series](https://cheatsheetseries.owasp.org/) gives short, practical guidance on each topic, and the [Application Security Verification Standard](https://asvs.owasp.org/) is a longer list of requirements you can borrow criteria from. The Linux Foundation's free course [Developing Secure Software](https://training.linuxfoundation.org/training/developing-secure-software-lfd121/) is a good deeper introduction, and CISA's [Secure by Design](https://www.cisa.gov/securebydesign) explains why vendors should make safe defaults the norm.

## 3. Step by step: add security to a spec

1. **Name what is valuable** in this feature: data, actions, availability.
2. **Pick the one of confidentiality, integrity, availability** that matters most.
3. **Draw the trust boundaries:** list every place data enters from outside.
4. **Walk the table** in section 2 and write one question per family that applies.
5. **Turn each question into an acceptance criterion** that a test can check.
6. **Write what must not be possible** ("a customer cannot read another customer's order").
7. **Add a logging criterion:** what event is recorded when a rule is broken.
8. **Brief an agent** to implement and to write the tests for each criterion.
9. **Review the tests**, not only the code: do they try the hostile case?
10. **Record any accepted risk** with a name and a date.

## 4. Worked example: TrailMug

TrailMug lets customers save a favourite mug design and order a copy. Maya writes the spec for "view my order history". She names what is valuable: customers' names, addresses and order contents. Confidentiality matters most.

She draws the trust boundaries: the customer's browser sends a request containing an order number; the server fetches from the database; the page shows the result. She walks the table and writes five criteria:

1. Only the signed-in owner can see an order. A request with another customer's order number is refused, and a test shows it.
2. The order number is never used in a database command except as a parameter.
3. Addresses are not written to logs.
4. After a refused request for someone else's order, a log entry records the signed-in user and the order number.
5. The page loads no scripts from addresses outside TrailMug's own control.

She briefs an agent to implement the feature and write tests for each criterion, and then asks it to review its own work against the table in a separate step. The agent reports "all criteria met". Maya reads the tests. Criterion 1's test signs in as customer A and requests A's own order, and passes. It never requests customer B's order. The test proves nothing about the risk. She rejects it, and asks for a test that signs in as A and requests B's order.

The new test fails. The code fetched the order by number alone and checked ownership only in the page, not on the server. The agent fixes it by adding the owner check where the data is fetched. The new test passes. The review note in her merge request says: "Test for criterion 1 first tested only the owner's own order; replaced with a cross-customer test; the first version of the code had a real access control flaw."

She did not need to know how to fix it. She needed to know what question to ask and to read the test with the question in mind.

## 5. Working with AI agents on this

**What the PDM decides:** what is valuable, which risk matters most, what level of risk is acceptable, and who may accept a risk.

**Delegate:** drafting security criteria from the family table, implementing them, writing hostile-case tests, reviewing a diff against the table, explaining a finding in plain words.

**Verify:** that each test would fail if the weakness were present; that each reported finding can be reproduced; that nothing was disabled to make a check pass.

**Prompt to draft criteria:**

```text
Here is a feature spec. For each of these weakness families, say whether it applies
and, if so, write one testable acceptance criterion: broken access control,
injection, cryptographic failures, security misconfiguration, authentication
failures, logging failures, server-side request forgery. For each criterion, say
what test would prove it. Do not write code. Mark any family where you need more
information from me.
<paste spec>
```

**Prompt to review a change:**

```text
Review this change for security weaknesses using the OWASP Top 10 families. For each
finding give the file and line, the family, how an attacker would use it, and a
test that would show it. Say separately what you checked and found nothing. Do not
fix anything yet. If you are not sure, say so rather than guessing.
<paste diff>
```

**Disclose** AI-assisted security review in the merge request. An agent's "no findings" is a claim, not a result.

## 6. Common mistakes and how to avoid them

- **"The feature should be secure."** Fix: testable criteria per weakness family.
- **Tests that only check the happy path.** Fix: every security criterion needs a hostile case.
- **Checking only in the interface.** Fix: checks on the server, where the data is.
- **Trusting what crosses a boundary.** Fix: list the boundaries and check each.
- **Believing "all criteria met".** Fix: read the tests and reproduce one failure.
- **Practising against real systems.** Fix: only deliberately vulnerable apps you run yourself.
- **Treating the list as complete.** Fix: it finds common problems, not all problems.
- **No owner for accepted risk.** Fix: name, date, review.

## 7. Practice

**Deliverable in git:** `specs/sec-01.md`, `briefs/sec-01.md`, `reviews/sec-01.md`, and a merge request.

1. Choose a small feature with a person's data in it, real or invented.
2. Write the spec with five security criteria derived from the family table, including at least one hostile-case test for each.
3. Brief an agent to implement the feature and the tests. Forbid it from weakening or skipping a test.
4. Review the tests first. For each, ask: would this fail if the weakness were present? Record the answer in `reviews/sec-01.md`.
5. Ask the agent to review its own change against the table in a fresh session. Compare its findings with yours.
6. Reproduce one finding yourself or watch the failing test run.
7. Open a merge request with a disclosure block and the accepted risks, each with an owner.

## 8. Checklist

- [ ] I can say who attacks software and what each group wants.
- [ ] I can name the OWASP families and the question for each.
- [ ] The spec has testable security criteria, not a general wish.
- [ ] Each criterion has a hostile-case test.
- [ ] I read the tests, not only the agent's summary.
- [ ] Findings were reproduced before being trusted or dismissed.
- [ ] Accepted risks have an owner and a date.
- [ ] I practised only on systems I own.

## 9. Further learning

Read the current OWASP Top 10 once, end to end, and then keep the Cheat Sheet Series open when you write criteria. Try a few challenges in Juice Shop or WebGoat in an isolated lab to feel how small these mistakes are. The Linux Foundation course is a good next step if you want depth. The next lesson turns to the thing attackers most want: secrets.
