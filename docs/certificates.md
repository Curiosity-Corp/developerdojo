# Certificate issuing and verification procedure

How a Developer Dojo certificate is decided, added to the public list, corrected and removed. Written for the
Maintainer and for the Senseis who review work. Read it with the [maintainer handbook](handbook.md), whose
section 1 facts apply to every sentence here.

**The registry starts empty, and that is correct.** The list in `src/data/certificates.json` holds `[]` until
the first real certificate is approved. No entry is ever added to test, to demonstrate or to "get ready".

Contents: [1 What a certificate is](#1-what-a-certificate-is-and-is-not) · [2 Wording rules](#2-wording-rules)
· [3 Who decides](#3-who-decides) · [4 Evidence](#4-the-evidence-that-must-exist) · [5 Consent](#5-consent-before-anything-is-published)
· [6 ID format](#6-the-certificate-id) · [7 The entry](#7-the-registry-entry) · [8 Issue](#8-issue-a-certificate)
· [9 Correct](#9-correct-an-entry) · [10 Revoke and renew](#10-revoke-or-renew-an-entry) · [11 How a visitor checks](#11-how-a-visitor-checks-a-certificate)
· [12 The Certificates page check](#12-the-certificates-page-copy-check) · [13 Walk through it](#13-walk-through-the-procedure-with-a-pretend-learner)
· [14 What the tests check](#14-what-the-tests-check)

## 1. What a certificate is (and is not)

A Developer Dojo certificate says one thing: **a person did real work, and people at the Dojo checked it against
a written standard.** There are three ranks: Developer, Master Developer and Sensei. The requirements for each are
on the public [Certificates page](https://developerdojo.org/certificates).

A certificate is the Dojo's own. It is **not** an accredited qualification, a degree, a licence or a promise of
anything. CRC's 501(c)(3) application is **pending**. The proof that a certificate is real is one thing only: it
appears in the public list on the Certificates page. A document, a picture or a message without a matching entry in
that list is unverified.

## 2. Wording rules

These apply to the Certificates page, to every lesson, to every message a Maintainer or Sensei sends, and to any
text a learner is given about their certificate.

| Never write | Why | Write instead |
| --- | --- | --- |
| "accredited", "accreditation", "recognised by [a body]" | The Dojo has no outside accreditation. | "The Dojo's own certificate." "The Dojo has no outside accreditation." |
| "tax-exempt", "tax-deductible", "approved as a charity" | CRC's 501(c)(3) application is pending. | "CRC's 501(c)(3) application is pending." Say it only when asked, and say no more. |
| A job, pay, hiring or career promise ("you will get hired", "employers value this") | We cannot know what an employer does. | "A certificate shows the work you did and that people checked it." |
| "guaranteed", "you will pass", "a certificate is assured" | A Sensei review is one input. The Dojo team decides. | "I can tell you what I saw in the work." |
| "official", "licensed", "degree", "diploma", "qualification" | These words suggest an outside authority. | "certificate" |
| A score, a ranking, a grade shown next to a name | Scores are private to the learner and the reviewers. | Nothing. The list shows ID, name, rank and date. |
| "Verified" for something that is not in the list | The list is the only proof. | "Unverified. Not in the public list." |

Allowed and true: "A certificate is valid for one year and is renewed by a new review of recent work" (this is the
rule on the Certificates page), "We list a person only when they agreed to be listed", "Certificates are checked
by people".

## 3. Who decides

| Role | Does | Must not |
| --- | --- | --- |
| **The learner** | Asks for review. Shares access to the private repository. Decides what is published. | |
| **The reviewing Sensei** | Reviews the evidence against the rubric and writes a recommendation. | Approve a certificate. Promise a result. Review someone they have a conflict of interest with. |
| **The Maintainer** | Reads the recommendation, checks the evidence, asks for consent, decides, and merges the registry change. | Approve a certificate with no Sensei review (for Developer and Master Developer). Approve their own. |

Rules:

1. **Two people.** The reviewer and the approver are different people. Nobody reviews or approves their own work.
2. **Conflicts.** A reviewer who is related to the learner, works with them or has a business with them says so and
   a different Sensei is chosen. The Maintainer does the same for approval; ask a project Owner to approve instead.
3. **Developer certificate:** a Sensei reviews against the [Product Package rubric](https://developerdojo.org/library/product-package-rubric); the Maintainer approves.
4. **Master Developer certificate:** a Sensei or mentor observes the practicals and the oral review, against the
   [Master Developer assessment](https://developerdojo.org/library/master-developer-assessment); the Maintainer approves.
5. **Sensei certificate:** it is by application or invitation, not by exam. The Maintainer and the Dojo team talk with the
   applicant (see the Sensei page) and the Maintainer decides. No Sensei approves another Sensei alone.

"Not yet" is a valid result. It comes with a written plan to close the gaps. It is not a failure and not a record.

## 4. The evidence that must exist

The learner's repository is private and stays private. The reviewer is given access to read it. Everything below
must be found in it, by the reviewer opening the files. A learner saying "it is there" is not evidence.

### Developer

- The Product Package folder, with all eight parts present (current state, product website, brand name, catalogue,
  roadmap, demo, next-version mockups, evidence of epic management). See the [Product Package standard](https://developerdojo.org/library/product-package-standard).
- `assessment/score-sheet.md` with the learner's own scores **and** the coach's scores for the six skills. Level 3 or
  above on every skill and no skill below level 2. Each score has one evidence line.
- The weekly notes, with an honest AI-use note, and `08-evidence/ai-use.md`.
- The 15 minute presentation was given and the reviewer's notes say so, with the honesty questions asked.
- Epics and the roadmap in the learner's own words. The commit history shows the learner writing them.
- No secrets, no real customer data, fake data in the demo.

### Master Developer

- The four gates, each with a written test and an observed practical, then the final exam, the oral review and the
  capstone, with the pass rules written on the [Master Developer assessment](https://developerdojo.org/library/master-developer-assessment) page. The Maintainer checks every rule on that page; this
  procedure does not repeat the numbers, so they cannot drift apart.
- No critical failure in any practical.
- The five critical behaviours are shown in the capstone repository (no plain secrets, no direct cluster change, fix
  forward, licence checked, the merge request is the change record).
- Test and observation records kept in a private repository, and AI use disclosed.

### Sensei

- The applicant holds a Master Developer certificate, or the Dojo team invited them.
- A note in the case issue that the conversation about coaching and the code of conduct took place.
- Nothing else is needed from a repository.

## 5. Consent before anything is published

The registry is public. Before an entry is made the learner must agree, **in writing**, to publish exactly:

- the **name** they want shown (as they write it, which may be a short form);
- the **rank**;
- the **issue date**;
- optionally, one **public link** to work they chose to share.

Nothing else is published: no email, phone, photo, country, employer, score or comment. The schema rejects other
fields, and a test checks it.

Tell the learner **before** they agree:

- Removing an entry removes it from the website. The earlier versions of the file remain in the project history.
- If they do not agree to be listed, **no certificate is issued**, because a certificate is real only when it is in
  the public list. Their review result is still theirs, and they can say yes later.
- If you are not sure the person can agree for themselves (for example, because of their age), stop and ask a
  project Owner before anything else.

Keep the consent as a comment by the learner in the case issue (section 8). Do not store it anywhere else.

## 6. The certificate ID

Format: **`DD-<year>-<number>`**

- `DD` for Developer Dojo.
- `<year>`: the four digit year of the issue date.
- `<number>`: four digits, starting at `0001` in each year, going up by one. Never reused, never skipped on purpose.
- Upper case letters, digits and hyphens only. The schema accepts 6 to 32 of them; this procedure uses the shape above.

Shape only (this is not an issued ID): `DD-2027-0001`.

To find the next number, open the file history of `src/data/certificates.json` (GitLab: open the file, click
**History**) and look at every earlier version for the highest number used that year. Removed entries count: an ID
is **never** given to a second person, even after revocation. `DD-TEST-...` is reserved for test fixtures and must
never appear in the real registry (a test checks this).

## 7. The registry entry

One object in the array in `src/data/certificates.json`.

| Field | Required | Rule |
| --- | --- | --- |
| `code` | yes | The ID from section 6. Unique. |
| `holder` | yes | The display name the learner agreed to. Not empty. |
| `level` | yes | Exactly one of `developer`, `master-developer`, `sensei`. |
| `issuedOn` | yes | A real date, `YYYY-MM-DD`: the day the Maintainer approved, or the day of the last renewal. |
| `evidenceUrl` | no | A public `https://` link to work the learner chose to share. It must open without a login. |

The file is checked three times: by the build (a bad file fails the build with a readable message), by the lookup in
the visitor's browser (a damaged list is reported, never trusted), and by the tests (section 14).

## 8. Issue a certificate

1. **Open a confidential issue** in GitLab, titled "Certificate review, <learner initials>". Never put a full name,
   a score or a link to private work in the title. Label it `type::docs` and `area::program`. This issue is the
   record of the whole case.
2. **Check the rank's requirements** against the Certificates page. For the Sensei rank, skip steps 3 to 6, and write
   in the issue that the conversation with the applicant took place (section 4).
3. **Choose a reviewing Sensei** with no conflict (section 3). Ask the learner to give them read access to the private repository.
4. **The Sensei reviews.** The Sensei handbook in the library describes the review. The Sensei scores the rubric
   only, with one evidence line per skill, and asks the three honesty questions.
5. **The Sensei writes a recommendation** as a comment in the issue: the rank, each skill's score and evidence line,
   the files opened, the honesty answers, whether the AI-use note was found, and any concern. No promise.
6. **The Maintainer checks the evidence** themselves: opens the files, checks section 4 for the rank, searches the
   repository for secrets, and checks that the AI-use note is honest. If anything fails, record "not yet" and the plan,
   tell the learner, and stop.
7. **Ask for consent** (section 5) in the issue. Wait for the learner's written yes.
8. **Record the decision** in the issue: approved, the rank, the date, the reviewer, and the ID from section 6.
9. **Open a merge request** that adds one entry to `src/data/certificates.json`. The title is "Add certificate DD-YYYY-NNNN". The description holds
   the ID, the rank and the date. It does **not** hold scores, evidence or personal details. Do not use `Closes` yet.
10. **Wait for a green pipeline**, check the diff is exactly one new object, then merge (Maintainer only).
11. **After the `publish_github_pages` job is green**, open the live Certificates page. Look up the new ID, then the
    name. Both must show "Verified." and the right rank and date.
12. **Tell the learner their ID** and give the link to the Certificates page. The entry in the list is the proof.
    Do not send an image or a document and call it the certificate; there is no other proof.
13. **Close the issue** with a comment that says the entry is live. Keep the issue confidential.

## 9. Correct an entry

Use this for a mistake in what is shown: a misspelled name, a wrong date, a wrong rank caused by a typing error.
A different rank because the review result changed is **not** a correction: revoke (section 10) and issue again with a new ID.

1. **Open a confidential issue**, "Certificate correction, DD-YYYY-NNNN". The holder asks for it, or the Maintainer
   found the mistake and tells the holder.
2. **Confirm who is asking.** The request must come from the holder through the route they used before. Never act on
   a request from a third party.
3. **Write what is wrong and what is right** in the issue, and keep the proof (the holder's message, the review record).
4. **Open a merge request** that changes only that field of that entry. The `code` does not change. The description
   says "Correct entry DD-YYYY-NNNN" and the field name, nothing else.
5. **Merge on green**, wait for the publish job, then look the entry up on the live page.
6. **Tell the holder,** and close the issue.

## 10. Revoke or renew an entry

### Revoke

Revoke when: the holder asks to be removed; the evidence is found to be false or the AI-use rules were broken in
a hidden way; the entry was added by mistake; or the certificate has run out (see below).

1. **Open a confidential issue**, "Certificate revocation, DD-YYYY-NNNN". Write the reason. Keep it short and factual.
2. **Tell the holder** what is planned and why, and give them time to answer, unless they asked to be removed.
   For a quality or honesty reason, a Sensei who has no conflict reads the case with the Maintainer. Two people agree.
3. **Record the decision** and the date in the issue.
4. **Open a merge request** that removes exactly that object. The description says "Remove entry DD-YYYY-NNNN". It gives
   **no reason** and no detail. The reason stays in the confidential issue.
5. **Merge on green,** wait for the publish job, then look the ID up on the live page. It must say "Not found."
6. **Tell the holder,** and close the issue. The ID is never reused.

The public lookup shows the same "Not found." for a removed entry as for one that never existed. We do not publish
reasons. Say this to the holder.

### Renew, and what happens when a year passes

The Certificates page says a certificate is valid for one year and is renewed after a new review of recent work.
The list shows only the date of issue or last renewal, so the Maintainer keeps it true:

1. **Renew:** open a confidential issue, run the review steps of section 8 (steps 3 to 6) on recent work, check the holder still agrees to be listed, and, if it passes, change only
   `issuedOn` to the renewal date in a merge request. The `code` stays.
2. **Not renewed:** each month, in the [monthly review](handbook.md#7-the-monthly-review), look for entries whose `issuedOn` is
   more than one year ago. Tell the holder. If there is no renewal, remove the entry as in "Revoke", with the reason "expired".

## 11. How a visitor checks a certificate

1. Open https://developerdojo.org/certificates and go to **Verify a certificate**.
2. Type the ID printed on the certificate, or the holder's name (at least three letters). With JavaScript turned
   off, read the full list on the same page.
3. "Verified." shows the name, rank, ID and date. A shared name can belong to two people, so check the ID, rank and
   date too.
4. "Not found." means unverified, including when the list is empty. The page tells the visitor to contact us with the ID.

A visitor who reports a certificate that is not in the list gets an honest answer: it cannot be verified. Never
say it is "probably real" and never add an entry because someone asks.

## 12. The Certificates page copy check

The copy on the Certificates page was read against section 2 on 3 November 2026. Result:

| Rule | Found in the page copy |
| --- | --- |
| No "accredited", "tax-exempt" or similar | None |
| No job, pay, hiring or career promise | None |
| No "guaranteed" or "you will pass" | None |
| No score shown next to a name | None. The list shows ID, name, rank and date. |
| Empty list is stated honestly | "No certificates have been issued yet." |
| Validity | "Valid for one year" is the Dojo's own rule, and is kept true by section 10 |

A test (`tests/certificates.test.ts`) reads the page source and fails if one of the never-write words appears.
Re-run the check whenever the page text changes.

## 13. Walk through the procedure with a pretend learner

Do this once in a **branch that is never merged**, to see that the guard rails work:

1. Make a branch. Add one entry to `src/data/certificates.json` for a pretend learner, with the code `DD-TEST-0001`.
2. Run the tests (`npx vitest run`). Three must fail: the check that the registry starts empty, the check that no `DD-TEST` entry is in
   the real registry, and the check that the ID follows the format of section 6.
3. Remove a required field from the pretend entry (for example `holder`) and run the build or the tests: they must fail with a message that names the field.
4. Delete the pretend entry, run the tests again (all green), and delete the branch.

The registry on `master` must hold `[]` until the first real certificate.

## 14. What the tests check

In `tests/certificates.test.ts` and `tests/schemas.test.ts`:

- an entry with a missing `code`, `holder`, `level` or `issuedOn` is rejected, one test per field;
- an empty `holder`, a bad code, an unknown level, a date that is not a real date and a link that is not `https://` are rejected;
- extra fields (for example an email) are rejected, so personal data cannot slip in;
- duplicate codes are rejected;
- the real registry holds no `DD-TEST` entries, and any real entry follows the ID format of section 6;
- the real registry is empty until the first approved certificate (`schemas.test.ts`);
- the Certificates page contains none of the never-write words of section 2;
- this procedure exists, has the issue, correct and revoke sections, and is linked from the maintainer handbook.

When the first real certificate is approved, the test "starts as an empty registry" in `tests/schemas.test.ts` must be
changed in the same merge request, by the Maintainer, to say that the registry holds the real entries. That is the only
change to it that is allowed, and it is part of step 9 of section 8.
