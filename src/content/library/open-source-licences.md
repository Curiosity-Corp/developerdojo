---
title: "Open source licences in plain English"
description: "The licence families, the traps (especially network copyleft), and how to check a licence."
section: "Master Developer"
order: 4
---

This page is not legal advice. It is the working knowledge a developer needs to avoid common errors. When in doubt, stop and ask a person with legal responsibility.

## Why the licence matters

When you use someone else's code you accept a deal. The licence is the deal. If you break it, you may lose the right to use the code or have to publish your own.

Three questions decide everything:

1. **How do you use it?** Inside your company only? As a service over the web? Handed to customers as a program or image?
2. **How do you connect it?** As a library inside your program, or as a separate service?
3. **Do you change it?**

## The licence families

| Family | Examples (SPDX id) | In plain English |
|---|---|---|
| Permissive | MIT, BSD-2-Clause, BSD-3-Clause, ISC, Apache-2.0 | Do almost anything. Keep the copyright notice. Apache-2.0 also gives a patent licence. |
| Weak copyleft | LGPL-2.1-or-later, LGPL-3.0-or-later, MPL-2.0 | If you change the library (LGPL) or the file (MPL) and distribute it, share those changes. Your own code stays yours. |
| Strong copyleft | GPL-2.0-only, GPL-3.0-or-later and similar | If you distribute a program containing the code, the whole program must be offered under the GPL with source. |
| Network copyleft | AGPL-3.0-only, AGPL-3.0-or-later | Like GPL, and if you modify it and let people use it over a network, you must offer them the source. |
| Source-available (not open source) | BUSL-1.1, SSPL-1.0, Elastic License 2.0, Commons Clause, FSL | The code is visible but use is limited, often "no competing service". Not approved by the Open Source Initiative. |
| No licence | No file, or custom text | You have no right to use it. Stop. |

**Copyleft** means: if you pass on the code, you must pass on the same freedoms. The name is a joke on "copyright".

**Dual licence:** one project offers two licences. You choose the one that fits. The commercial one costs money.

**Open core:** the base is open and some folders are paid. Always read the top-level licence file for lines such as "content under the enterprise folder is licensed under...".

## A quick matrix

| Licence | Inside company only | Service to customers | Give to customers | Link as library | Run as separate service | You modify it |
|---|---|---|---|---|---|---|
| MIT, BSD, ISC | OK | OK | OK, keep notice | OK, keep notice | OK | OK, keep notice |
| Apache-2.0 | OK | OK | OK, keep notice file | OK | OK | OK, mark changes |
| MPL-2.0 | OK | OK | Offer MPL files | OK (file level) | OK | Share changed MPL files if distributed |
| LGPL | OK | OK | Offer library source | OK if swappable | OK | Share library changes if distributed |
| GPL | OK | OK | Offer whole work source | Not in a closed product | OK at arm's length | Share if distributed |
| AGPL | OK unmodified | Ask first. Modified: share source with users. | Offer whole work source | Not in a closed product | OK if unmodified | Share source with every user |
| SSPL, BUSL, Elastic, Commons Clause, FSL | Often OK | Usually NO | Ask | Ask | Usually NO | Ask |
| No licence | NO | NO | NO | NO | NO | NO |

"Ask" means stop and get a decision from a person responsible for legal matters.

## The network-copyleft trap

Most services are software as a service. For plain GPL, running software on your own servers for customers is not distribution, so no source duty appears. **AGPL closes that gap on purpose.** If you modify an AGPL program and let users use it over a network, you must offer them your modified source.

For a business this can mean publishing code you wanted to keep private. So: an unmodified AGPL tool used internally is usually fine. A modified AGPL tool offered to customers needs a decision from a person with legal responsibility.

## Compatibility between licences

Sometimes you combine two components in one program. You must be able to obey both licences at once.

- MIT, BSD and Apache-2.0 can go into a GPL or AGPL program.
- Apache-2.0 with GPL-3.0 works.
- Apache-2.0 with GPL-2.0-only does **not** work in one distributed program.
- GPL-2.0-only and GPL-3.0 do not work together.
- GPL-2.0-or-later can be used as GPL-3.0.

This is why the SPDX id matters. `GPL-2.0-only` and `GPL-2.0-or-later` are different deals. Read the file header.

## Containers are distribution

If you give a customer an image, it contains every package inside, including base-system packages. Most are GPL or LGPL. That is usually fine when they are separate programs, but you must keep the notices and be ready to offer source.

## Patents, attribution, SBOM

- Apache-2.0 includes a patent grant. MIT does not mention patents.
- Keep copyright and notice files when the licence asks.
- A **software bill of materials (SBOM)** lists the parts inside your software and their licences. Produce one in your pipeline.

## How to check a licence

1. Find the licence file at the top of the repo. Read it.
2. Write the SPDX id.
3. Check subfolders for different licences.
4. Answer the three questions: how do you use it, how do you connect it, do you change it?
5. Look up the result in the matrix.
6. Record it. Use a licence check record.

## Worked check

TrailMug wants a free scheduling tool. The repo has an MIT licence file at the top and a folder `enterprise/` with its own paid licence. Use as a separate service, unmodified. Result: OK for the MIT part. The `enterprise/` features are paid, so they do **not** count toward fit. Record the SPDX id, the file read and the date.

## Mistakes

- "It is on a public site, so it is free to use."
- Counting features from a paid folder as free.
- Copying code from a paid folder "just to learn".
- Not re-checking the licence after an update. Licences can change.

## Key points

- The licence is the deal. Read it.
- Check how you use it, connect it and change it.
- Treat network copyleft and source-available licences with care.
- Write the result down.
