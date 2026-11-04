---
title: "Supply chain and artifact security: SBOMs, signing and SLSA"
description: "How to know what is inside your product, where it came from and that nobody changed it on the way, using SBOMs, vulnerability scans, signatures and SLSA levels."
section: "Frameworks"
order: 26
track: "frameworks"
level: "advanced"
duration: "65 min"
outcomes:
  - "Explain what a software supply chain is and name its main risks"
  - "Read an SBOM, a scan report and a signature check, and say what each does and does not prove"
  - "Choose a SLSA level target and write the steps to reach the next level"
resources:
  - "openssf/slsa"
  - "openssf/slsa-security-levels"
  - "openssf/scorecard"
  - "openssf/concise-guide-evaluating-oss"
  - "sigstore/sigstore-overview"
  - "cisa/software-bill-of-materials"
  - "cyclonedx/bill-of-materials-standard"
  - "linux-foundation/spdx"
prerequisites:
  - "tracks/frameworks/25-launch-sequence-six-stages"
updated: 2026-11-03
---

**Dojo programme link:** this lesson supports the Master Developer module on production launch and the security fundamentals track. It deepens stages 2 and 3 of [Launch Sequence](/library/tracks/frameworks/25-launch-sequence-six-stages/). It also supports the Developer week 6 rule that the product package must show where its parts come from (see [Open source first](/library/open-source-first) and [Open source licences](/library/open-source-licences)).

## 1. Why this matters

Almost no product is written from nothing. Even a small web app uses hundreds of other people's packages, a base image for its container, build tools, and services. When an AI agent scaffolds a project for you, it adds more, often quickly and without telling you why.

Each of these parts is a way in for a problem. A package can have a known flaw. A maintainer's account can be taken over. A build can be tampered with. A look-alike package name can be installed by mistake. You, as the PDM, are responsible for what ships, including the parts you did not write.

You do not need to become a security engineer. You need to ask four questions and know how to check the answers:

1. **What is in it?** (the list of parts)
2. **Are any of the parts known to be bad?** (vulnerabilities, licences, project health)
3. **Is this really what we built?** (signature, provenance)
4. **Where did the build happen, and could someone change it?** (build trust level)

## 2. Key ideas, explained

### 2.1 The software supply chain

Think of a product as a meal in a restaurant. The **supply chain** is everything between the farm and the plate: farms, trucks, kitchens. In software it is everything between the first line of someone else's code and the running product: source code, dependencies, build tools, build servers, image registries and deployment systems.

An attack or an accident can happen at any link. Therefore supply chain security is about **visibility** (knowing the links), **verification** (checking each one) and **integrity** (making sure nothing changes unseen).

The Dojo is not alone in caring. Governments and large buyers now ask for it. For example, the U.S. [NIST Secure Software Development Framework](https://csrc.nist.gov/projects/ssdf) lists practices that many buyers use as a reference, and [CISA's Secure-by-Design](https://www.cisa.gov/resources-tools/resources/secure-by-design) guidance asks product makers to take responsibility for security early. You do not need to memorise them. You need to know that a customer may ask for evidence, and that your pipeline can produce it.

### 2.2 Dependencies, lockfiles and pinning

A **dependency** is a package your product uses. Most dependencies pull in their own, called **transitive dependencies**. A **lockfile** (such as `package-lock.json` or `bun.lock`) records the exact version of every one. **Pinning** means you install exactly the versions in the lockfile, so today's build equals last week's.

Rules of thumb:

- Commit the lockfile.
- Install from the lockfile in the pipeline (a "frozen" install that fails if the file is out of date).
- Update on purpose, in a merge request, with the changes visible.
- Prefer fewer, well-maintained dependencies. Each new dependency is a decision. In lesson 22, Maya's agent was told to stop and ask before adding one. This is why.

### 2.3 Evaluating a dependency before you adopt it

Before you accept a new package, ask:

- Is it actively maintained? When was the last release?
- Is it widely used, or is it one person's weekend project?
- What licence does it use, and can you comply with it?
- Does it do something dangerous (run commands, read files, call the network)?
- What does an independent score say?

The [OpenSSF Scorecard](https://scorecard.dev/) automatically scores open source projects on practices such as code review, branch protection and signed releases. The [Concise Guide for Evaluating Open Source Software](https://best.openssf.org/Concise-Guide-for-Evaluating-Open-Source-Software) is a short human checklist. A score is a signal, not a verdict. A low score on a tiny, stable library you could replace in an hour is a different risk from a low score on your payment library.

### 2.4 SBOM: the list of parts

An **SBOM** (software bill of materials) is a machine-readable list of the components inside a product, with their versions and, ideally, licences and where they came from. It works like the ingredients label on food.

There are two common formats: [CycloneDX](https://cyclonedx.org/) and [SPDX](https://spdx.dev/). Many tools produce either. [Syft](https://github.com/anchore/syft) is one open source generator for images and folders. CISA explains why buyers ask for them in its [SBOM overview](https://www.cisa.gov/sbom).

What an SBOM **gives** you:

- You can answer "do we use this broken package?" in seconds when a new problem is announced.
- A buyer or auditor can check your parts without reading your source.

What it does **not** give you:

- It does not say a component is safe. It only lists it.
- It is only as good as the tool that created it. Generate it from the **built artifact**, not just the source, because the image may contain parts the source did not mention.

### 2.5 Vulnerability scanning

A **vulnerability** is a known flaw in a specific version of a component, listed in public databases with an identifier (a CVE number). A **scanner** compares your SBOM or lockfile with those databases. Examples are [Trivy](https://trivy.dev/latest/docs/) and [OSV-Scanner](https://google.github.io/osv-scanner/). GitLab can also show a [dependency list](https://docs.gitlab.com/user/application_security/dependency_list/) with known problems; availability depends on your plan.

A scan produces a list, and lists can be long. The PDM question is not "is the list empty?" It is "which findings matter here?" Ask for each finding:

- **Is the vulnerable code reachable** in our product? A flaw in a function we never call is lower risk.
- **Is there a fixed version,** and is the upgrade safe?
- **How bad is it,** and is anyone known to be using it?
- **Can we reduce harm another way** (turn off a feature, block a path)?

When you decide to accept a finding, write down: the finding, the reason, the owner, and the date you will look again. Nothing should be accepted without an end date. Some teams use a standard document called a **VEX** (Vulnerability Exploitability eXchange) to say "this product is affected" or "not affected" for each finding. You can start with a plain markdown file.

### 2.6 Artifact scanning and base images

After the build you scan the **artifact**, the actual image or package. Two reasons: the build may add things not in your lockfile, and the **base image** (the starting layer, such as an operating system layer) brings its own parts. Choose small, maintained base images, update them on a schedule, and scan the final image, not just the source.

Also scan for **secrets** and **personal data** accidentally baked into the artifact: test files, `.env` files, logs.

### 2.7 Signing and verification

A **digital signature** lets you say, "this exact file was produced by this identity, and nothing changed afterwards." To sign you use a key, or an identity proof. To verify, anyone can check the signature against a public record.

[Sigstore](https://docs.sigstore.dev/) is an open project that makes signing and checking much simpler, including a way to sign without keeping long-lived secret keys. Its tool [Cosign](https://docs.sigstore.dev/cosign/signing/overview/) signs and verifies container images.

Two rules make signatures useful:

1. **Sign the exact digest.** A container image has a **digest**, a long fingerprint of its content. A tag such as `latest` can move to point at a different image. Signing a tag is like signing a sticker. Sign and verify the digest.
2. **Verify before you deploy.** A signature nobody checks proves nothing. The deployment stage must refuse unsigned or mismatched artifacts.

The public PHANTOMS starter on GitHub ([Curiosity-Corp/phantoms](https://github.com/Curiosity-Corp/phantoms)) shows a version of this: it signs the build digest, and a gate checks the signature, the presence of an SBOM and that the digest matches before smoke tests run. Read its CI/CD document to see the idea in a real repository.

### 2.8 Provenance and SLSA

**Provenance** is a signed statement of how an artifact was built: which source, which build system, which steps. **SLSA** (pronounced "salsa", for Supply-chain Levels for Software Artifacts) is a framework from the Open Source Security Foundation. It defines levels of trust in a build. See [slsa.dev](https://slsa.dev/) and the page on [security levels](https://slsa.dev/spec/v1.0/levels).

In the current version (v1.0) the build levels are, in plain words:

| Level | What it means |
|---|---|
| Build L0 | No guarantees. |
| Build L1 | Provenance exists. You have a record of how it was built, even if it can be faked. |
| Build L2 | A hosted build platform produced and signed the provenance. Harder to forge. |
| Build L3 | Hardened builds. The build platform stops one build from tampering with another and from touching the signing material. |

Check the specification for the exact requirements. Treat the levels as a ladder. A small product can reach L1 quickly and L2 by using a hosted pipeline that produces signed provenance. Choose a target, write it down, and plan the next step. Do not claim a level you cannot demonstrate.

### 2.9 Putting it in the pipeline

| Question | Pipeline step | Evidence saved |
|---|---|---|
| What is in it? | Generate SBOM from the artifact | SBOM file |
| Any known bad parts? | Scan dependencies and image | Scan report |
| Licences OK? | Licence check against policy | Licence report |
| Parts healthy? | Scorecard on new dependencies | Score and a note |
| Is it ours? | Sign the digest | Signature |
| How was it built? | Create provenance | Provenance statement |
| Did anything change? | Verify signature and digest before deploy | Verify log |

## 3. Step by step: add supply chain checks to a small product

1. **Commit the lockfile.** Make the pipeline install with a frozen lockfile.
2. **Add a dependency scan** as a warning. Read the first report with an agent's help and decide on each finding.
3. **Write `launch/risk-register.md`:** each accepted finding, with reason, owner and a review date.
4. **Generate an SBOM** from the built image. Store it with the release.
5. **Add a licence check** against a list of licences you accept (see [Open source licences](/library/open-source-licences)).
6. **Sign the image digest** in the pipeline.
7. **Verify the signature** in the deploy job.
8. **Create provenance** if your platform supports it. Write your SLSA target in `launch/slsa.md`.
9. **Add a dependency rule:** a new dependency needs a one-paragraph justification and a Scorecard check in the merge request.
10. **Run a drill.** Imagine a new vulnerability was announced in one package. Use your SBOM to find out how many minutes it takes to answer "are we affected?" Write down the time.

## 4. Worked example: TrailMug adds a QR library

Maya's agent proposes a QR-code reading library for the counter page. The merge request must include the justification. Maya asks for:

- What the library does and why a standard browser feature is not enough.
- The licence (permissive, compatible).
- The Scorecard result and the date of the last release.
- The size of its own dependency tree.
- The vulnerability scan after adding it.

The Scorecard result is middling: a few maintainers, no signed releases. Maya decides that the library is small and replaceable, accepts it, and writes in the risk register: "QR library, reason, owner Maya, review in 90 days; replacement option: browser barcode feature." The pipeline then builds the image, generates the SBOM (which now lists the library), scans, signs the digest and verifies it before staging.

Three weeks later a public advisory is released about a different package. Maya asks the agent to check the SBOM from the latest release. In two minutes she has her answer: not affected. That is what the SBOM is for.

## 5. Working with AI agents on this

**What the PDM decides.** Which licences are acceptable. How much risk each finding deserves. Your SLSA target. Whether to accept a dependency. These are decisions about risk and money.

**What agents can do.**

- Write the pipeline jobs for scans, SBOM, signing and verification.
- Triage scan results: explain each finding in plain words, say whether the vulnerable code is used, and propose the smallest safe upgrade.
- Prepare the dependency justification text.
- Update the risk register draft and remind you of review dates.
- Keep dependencies current with small merge requests.

**What agents must not do.** Add a dependency without the justification step. Mark a finding as "not affected" without evidence. Disable a scanner to make the pipeline green. Handle signing keys directly.

**A brief you can adapt:**

```text
Read the latest scan report in the pipeline artifacts. For each HIGH or
CRITICAL finding give: package and version, what the flaw is in one
sentence, whether our code calls the affected feature (show the file, or
write NOT FOUND), the fixed version if any, and the smallest change that
would remove it. Do not edit any files. If you are unsure, say UNSURE.
```

**How to check.** Choose one "not reachable" claim and check it yourself by searching the code. Check one fixed version number against the package page. Keep a count of how often the agent was wrong; it tells you how much to trust it.

**Beware of agent-suggested packages.** AI systems sometimes suggest a package name that does not exist, or a look-alike of a real one. Attackers can register such names. Verify any new package on the official registry page before installing, and check how many people use it.

**Other disciplines.** Security helps decide the policy. Legal or a licence-aware colleague reviews licences. Finance cares if a vulnerability notice has a cost (for example, a customer contract). Operations runs the drill.

**From delegating to orchestrating.** Sessions add code and dependencies quickly, so the supply chain checks in this lesson matter more with agents, not less. Make them gates, and keep sessions away from signing keys and release credentials. See Agent orchestration for how gates work across a fleet.

## 6. Common mistakes and how to avoid them

- **Treating a clean scan as proof of safety.** It shows only known problems.
- **Scanning source but not the image.** Scan the artifact.
- **Signing a tag, not a digest.** Tags move.
- **Signing but never verifying.** Make the deploy job verify.
- **Accepting findings with no end date.** Every acceptance has a review date and an owner.
- **Installing whatever the agent suggests.** Verify new packages by hand.
- **Claiming a SLSA level you cannot show.** State your real level and your next step.
- **Letting `latest` drift.** Pin base images and tools to versions or digests.

## 7. Practice

**Deliverable in git:** a branch `supply-chain` with:

1. A frozen-lockfile install in your pipeline.
2. A generated SBOM for one built artifact, saved as a pipeline artifact, and a note in `launch/sbom.md` with the answer to: "which three components are the most worrying and why?"
3. `launch/risk-register.md` with at least two findings decided by you (accept with date, or fix), each with a reason.
4. A `launch/slsa.md` stating your current level, your evidence and the next step.
5. A merge request that adds one new dependency with the justification block, including a Scorecard or equivalent check.
6. The drill result: how long it took to answer "are we affected by package X?".
7. Agent use noted in the merge request.

## 8. Checklist

- [ ] Lockfile is committed and the pipeline uses it.
- [ ] An SBOM is generated from the built artifact and stored.
- [ ] A vulnerability scan runs and a person decides each serious finding.
- [ ] Accepted risks have an owner and a review date.
- [ ] The image digest is signed and verified before deploy.
- [ ] My SLSA level is stated honestly with evidence.
- [ ] New dependencies need a justification.
- [ ] No secrets or personal data in artifacts.

**Next:** [lesson 27](/library/tracks/frameworks/27-deployment-governance-and-go-to-market/) covers deployment, governance and go-to-market.
