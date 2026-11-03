---
title: "S is for SeaweedFS"
description: "Where a product keeps files: object storage and the S3 protocol in plain words, what SeaweedFS offers, the privacy and recovery rules that apply to uploads, and how to choose between running your own store and using a managed one."
section: "The PHANTOMS stack"
order: 11
track: "phantoms-stack"
level: "advanced"
duration: "90 min"
outcomes:
  - "Explain object storage, buckets, keys and the S3 protocol in plain words"
  - "State why file data does not belong in the database or in git"
  - "List the security, retention and recovery rules for customer uploads"
  - "Compare self-hosted object storage with a managed service and record the decision"
prerequisites:
  - "the-way-five-rules"
resources:
  - "seaweedfs/seaweedfs-wiki"
  - "seaweedfs/seaweedfs-s3-api"
  - "seaweedfs/seaweedfs-security-overview"
  - "seaweedfs/seaweedfs-repository"
  - "amazon-s3/what-is-amazon-s3"
  - "owasp/secrets-management-cheat-sheet"
updated: 2026-11-03
---

This is lesson 11 of the PHANTOMS track. It supports the Master Developer modules on platform and production launch. S is the last optional piece. Like O and M, its main lesson is a decision: do you need to keep files, and if so, who will run the place where they live?

## 1. Why this matters

Orders, cafés and statuses are small, structured records, and they belong in PostgreSQL. A photo of a damaged cup, a PDF invoice, a delivery proof or a 40-megabyte video is different. These are **files**, also called **objects** or **blobs** (binary large objects). Putting them in the database makes it huge, slow to back up and costly to restore. Putting them in git makes the repository heavy and makes private data impossible to remove. Neither belongs there.

The usual home for files is an **object store**: a service that keeps objects in containers called **buckets**, each object found by a name called a **key**, such as `orders/2026/11/damage-photo-123.jpg`. You put an object, get it, delete it and list keys. There are no folders in the strict sense, and no way to edit part of a file. This simplicity is why object stores scale well and cost little per gigabyte.

The world has settled on one way to talk to them: the **S3 API**, named after Amazon's storage service. Many tools and libraries speak it, and many stores, including **SeaweedFS**, offer it. SeaweedFS is an open source distributed storage system. In PHANTOMS it is the **S**: an optional, S3-compatible object store you can run yourself, and the place where Milvus can keep its blocks and indexes.

Why does the manager care? Because uploads change your risk. A text field is hard to attack. An upload can be huge, can be the wrong type, can hold a person's face or a document with personal data, and must be kept, protected and eventually deleted. And "we will run our own storage" is a promise to operate a stateful service for years.

The 2030 Product Development Manager decides **whether the product needs files at all, which files, who may see them, how long they live, and who runs the store**. Those are product, privacy, security and cost decisions.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| Whether to accept uploads, what types and sizes, who may see them, retention and deletion, self-hosted or managed | Writing upload and download code, signed-link logic, size and type checks, tests, setup scripts for a test store | Testing that a stranger cannot fetch a private file, that links expire, that deletion works, that a restore brings files back | Security (access and scanning), legal and privacy (personal data, retention), finance (storage and transfer cost), operations (capacity, backup, upgrades), support (what customers can upload) |

## 2. Key ideas, explained

### Object storage in four ideas

- **Bucket.** A named container. One bucket per purpose, with its own access rules.
- **Key.** The object's name. Make keys predictable for you and unguessable for attackers: a random id in the key beats the customer's name.
- **Metadata.** Small facts attached to the object: type, size, owner. Your database should hold the record "this order has this photo", pointing to the key. The file lives in the store; the **meaning** lives in PostgreSQL.
- **Immutability.** To change an object you replace it. This makes caching and backup simpler.

### The S3 protocol keeps you free

If your code speaks S3, you can move between stores by changing configuration: a managed cloud store, a self-run SeaweedFS, or a test store on a laptop. That is the same idea as the AI adapter in lesson 6: **keep the protocol standard and the vendor replaceable.** The SeaweedFS wiki has a page describing exactly which parts of S3 it supports. Read it. "S3-compatible" rarely means "identical", and the differences are where bugs live. The starter's own warning is: "Test S3 behavior, retention, access control, and recovery with the chosen client."

### What SeaweedFS is made of

At a high level, SeaweedFS has a part that keeps track of where data lives (the master), parts that store the data (volume servers), an optional part that gives a folder-like view (the filer), and an S3 gateway that speaks the S3 protocol. You do not need the details to make decisions. You need to know that **it is several cooperating processes**, each of which needs to be secured, monitored and upgraded. The wiki describes the parts and how to start them. The starter's version policy lists SeaweedFS 4.48 as a reference pin, not a tested combination.

### Uploads are untrusted input

A file from a user is as untrusted as any text, and bigger. Rules to expect in an upload feature:

- **Limit size** at the API and at the store, so one upload cannot fill the disk or the budget.
- **Limit types** by checking the content, not only the file name.
- **Never serve uploads from your main origin as active content.** A malicious HTML or script file served from your own site can attack your users.
- **Consider scanning** for malware when the product shares files between users.
- **Strip or review metadata**, such as the location data inside photos.
- **Keep uploaded content private by default.** The security guide says exactly that, and asks you to verify access controls and the expiry of signed links.

### Signed links

A **signed URL** is a web address that grants access to one object for a short time. Your API checks that the user may see the file, then produces a link that expires in minutes. The browser downloads straight from the store, and the store never needs to know who your users are. The security guide asks you to verify "signed-URL expiry". Two questions to test: does the link really stop working after it expires, and can one user's link be used to reach another user's file by changing the key?

### Retention, deletion and backup

Files follow the same rules as database records, and need their own plan.

- **Retention.** How long do you keep each kind of file? Write it down. Keeping data forever is a liability.
- **Deletion.** When a customer asks to be forgotten, files must go too, from the store, from backups on their schedule, and from any index that refers to them.
- **Backup and restore.** The guides ask you to "encrypt backups and test restoration". A store you have never restored is a hope. Include the files in your restore drill.
- **Encryption.** In transit (TLS) and, where the store supports it, at rest. Secrets for the store are server-side only, kept in a secret manager.

### Self-hosted or managed

This is the central decision of the lesson.

| Question | Self-hosted (such as SeaweedFS) | Managed S3-compatible service |
|---|---|---|
| Who patches and upgrades? | Your team | The provider |
| Who handles disk failures, capacity, durability? | Your team | The provider |
| Control over where data lives | Full | Per the provider's regions and terms |
| Cost shape | Servers, disks and people time | Per gigabyte stored and transferred |
| Best when | You have the skills and a reason (control, scale, cost at size, a private network) | You want files without running storage |

The Dojo's honest default for a small product: **use a managed S3-compatible store when files are needed, and keep your code on the S3 protocol so you can move later.** Choose a self-hosted store when you have a measured reason and a person who owns it. Because your code speaks S3, this stays a reversible decision.

## 3. Step by step: how to decide and how to add file storage safely

1. **Write the user need.** "A café can attach a photo to a damaged-cup report."
2. **List the file types, sizes and counts.** One photo up to 5 megabytes. A few per week per café.
3. **List the data risk.** Do photos show faces, addresses, number plates? Who may view them?
4. **Decide the retention.** "Delete 12 months after the report is closed."
5. **Compare self-hosted and managed** with the table above, and add the cost of one person-hour per week for operations.
6. **Decide and record it**, with the trigger for revisiting.
7. **Design the flow.** Upload through the API, which checks size, type and permission, then stores the object under a random key and saves the key in PostgreSQL. Download through short-lived signed links.
8. **Brief an agent to build it** against a local test store, with tests.
9. **Prove the rules:** a stranger cannot read a private file, links expire, wrong types are refused, deletion removes the object, a restore brings files back.

## 4. Worked example: TrailMug

Sam, TrailMug's operations lead, says café owners report damaged cups by email with phone photos. It is slow and the photos get lost. Maya writes the epic herself: "A café can report a damaged cup with a photo and see the status of the report."

She runs the steps. The need and the limits are clear: one photo, at most 5 megabytes, JPEG or PNG. The photos may show café interiors, and occasionally staff. She decides: private by default, visible only to that café and to TrailMug warehouse staff, kept for 12 months after the report closes.

On self-hosted versus managed: TrailMug has nobody to run storage. The volume is a handful of photos a week. She chooses a managed S3-compatible service, keeps all code on the S3 protocol, and writes the revisit trigger: "reconsider self-hosting if storage cost exceeds the cost of a person-day per month or if a customer requires data to stay in our own network". PostgreSQL stores each report with the key of its photo. SeaweedFS stays on the shelf, with a note that it would plug in behind the same S3 settings.

She briefs an agent to build the upload flow against a local test store. Then she verifies with her own hands. She uploads a photo and copies the link. She waits past the expiry time and tries again: refused, good. She changes one character in the key: refused, good. She tries to upload a text file renamed `.jpg`: the type check catches it. She tries a 50-megabyte file: refused at the API, good. She deletes a closed report and checks the object is gone from the store. Finally she asks Sam: "Is the photo bucket in our restore drill?" It is not. She adds a task and holds back the release until the drill passes.

## 5. Working with AI agents on this

**What to delegate.** Writing the upload and download flow, signed-link code, size and type checks, a local test store setup, tests for each rule, a draft of the retention job.

**What you must do yourself.** Decide whether files are needed and which. Decide privacy, retention and who may view. Choose self-hosted or managed. Approve every new credential and every public access setting. Own the restore drill.

**A prompt you can adapt:**

> Work in the PHANTOMS starter on a branch. Read AGENTS.md, docs/security.md and docs/architecture.md. Task: add photo upload for damage reports. Spec: JPEG or PNG only, checked by content not only by name; maximum 5 MB enforced at the API; objects stored in a private bucket under a random key; the key stored in PostgreSQL through packages/db; downloads only through signed links that expire after 5 minutes and are issued only after the API checks that the caller may see the report. Code must speak the S3 protocol through one small module so the store can be swapped by configuration; credentials only from server-side environment variables; no public bucket; no new service in the default Compose file (use a clearly marked optional Compose profile for a local test store). Write tests for: wrong type, too large, no permission, expired link, deletion. Do not log file contents or personal data. Run the checks from AGENTS.md and report what you could not verify.

**How to check the output.** Read the bucket settings for anything public. Search for credentials in the diff. Try the five attacks from the worked example by hand. Check that deletion removes the object, not only the database row.

**Disclose.** Say in the merge request what the agent built and which attacks you tried yourself. See [disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes and how to avoid them

- **Storing files in the database or in git.** Use an object store and keep only the key in the database.
- **Public buckets.** Private by default. Make a deliberate, written exception if you must.
- **Guessable keys.** Use random ids in keys.
- **Trusting the file name.** Check content type and size.
- **Links that never expire.** Test expiry.
- **Forgetting files in deletion and backup plans.** Include them.
- **Self-hosting to save money without counting people time.** Count operations.
- **Believing "S3-compatible" means identical.** Test your exact client against your exact store.

## 7. Practice

**Exercise: "Self-host or buy? Decide with evidence."**

1. Choose a file feature for a product you care about, or use TrailMug's damage photos.
2. Write the need, the limits, the data risk and the retention rule in your own words.
3. Fill in the comparison table for your case, with your own estimates of effort in person-hours. State clearly which numbers are estimates.
4. Write a decision record with the choice and the trigger for revisiting.
5. Brief an agent to build the flow against a local test store using the prompt above. Do not connect any real service.
6. Try the five attacks by hand and record the results.

**Deliverable in git:** `docs/decisions/005-file-storage.md`, the implementation on a branch, `docs/reviews/upload-attacks.md` with your results, and a merge request that says what the agent did.

## 8. Checklist

- [ ] I can explain bucket, key and signed link.
- [ ] Files are stored in an object store, with only the key in the database.
- [ ] The bucket is private, keys are random and links expire.
- [ ] Size and type are checked on the server.
- [ ] Retention, deletion and restore cover files too.
- [ ] I compared self-hosted with managed and recorded the trigger to revisit.
- [ ] I tried the attacks by hand.

## 9. Further learning

Start with the AWS introduction to S3 for the vocabulary, then read the SeaweedFS wiki, its S3 API page and its security overview. The repository shows releases and the licence. OWASP's secrets management cheat sheet covers the credentials that every store needs. If you completed lesson 10, notice how often the same four words come back: permissions, freshness, deletion and recovery.

**Next:** [Capstone: TrailMug's order tracker on PHANTOMS](/library/tracks/phantoms-stack/12-capstone-trailmug-order-tracker/).
