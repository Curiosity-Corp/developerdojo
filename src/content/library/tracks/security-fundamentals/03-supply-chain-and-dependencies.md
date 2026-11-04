---
title: "Supply chain and dependencies"
description: "Almost all of your product is other people's code. How to judge a dependency, read a bill of materials, and understand what signatures and build provenance prove and do not prove."
section: "Security fundamentals"
order: 3
track: "security-fundamentals"
level: "core"
duration: "80 min"
outcomes:
  - "Explain the software supply chain and the main ways it is attacked"
  - "Judge a dependency before adding it, including one an agent suggests"
  - "Explain what a bill of materials, a signature and build provenance each prove"
  - "Direct an agent to audit dependencies and verify the findings"
prerequisites:
  - "the-way-five-rules"
resources:
  - "openssf/slsa"
  - "sigstore/sigstore-overview"
  - "owasp/dependency-check"
  - "gitlab/dependency-scanning"
  - "nist/secure-software-development-framework"
  - "cisa/secure-by-design"
updated: 2026-11-03
---

Lesson 3 of the Security fundamentals track. It deepens CI/CD lesson 4, which introduced pinning and scanning.

## 1. Why this matters

A typical product contains a little of your own code and a great deal of code written by others: libraries, frameworks, base images, build tools, plug-ins. Together with the systems that build and deliver it, this is the **software supply chain**. Attackers have learned that it is easier to poison something many people use than to break into each of them.

You will not read every line of every dependency. You can still make good decisions about which to trust, require evidence that a release is what it claims, and make sure you find out quickly when a dependency is found to be flawed. With agents the question gets sharper: agents add dependencies quickly and sometimes suggest ones that do not exist or that were published by someone hoping to be installed by mistake.

| The 2030 PDM decides | Delegates to agents | Verifies by | Other disciplines |
|---|---|---|---|
| What standard a dependency must meet, who approves a new one, how fast known flaws must be fixed, what evidence a release needs | Auditing dependency lists, researching a package's health, writing the scanner configuration, drafting update merge requests | Checking that each package exists and is the one intended, reading scanner results, confirming the build proves what is claimed | Security engineering (tooling), legal (licences), platform engineering (build systems), procurement (paid vendors) |

## 2. Key ideas, explained

### The links in the chain

| Link | What can go wrong |
|---|---|
| **Your own code** | A mistake, or a change by someone who should not have access. |
| **Direct dependencies** | A library you chose has a flaw, is abandoned, or is taken over. |
| **Indirect dependencies** | The libraries your libraries use. You did not choose them and may never see them. |
| **Build and delivery systems** | The pipeline, runners and registries are compromised, and malicious code is added during the build. |
| **Base images and tools** | The container image or compiler you start from carries a flaw. |
| **Update channels** | A trusted update mechanism delivers something hostile. |

### Typical attacks

- **A known flaw in an old version.** The most common by far. Someone publishes a flaw, attackers scan for everyone still using the old version.
- **Typosquatting.** A package with a name one letter away from a popular one, hoping to be installed by mistake.
- **Dependency confusion.** A public package with the same name as one of your private ones, hoping the build picks it.
- **A hijacked maintainer or package.** A real, trusted package is taken over and a new release carries something hostile.
- **A poisoned build.** The source is fine, but the build environment adds something.
- **Hallucinated packages.** An AI agent suggests a package that does not exist. An attacker registers that name. The next person who follows the suggestion installs it.

### Judging a dependency before adding it

Ask these questions. An agent can gather the facts. A person decides.

| Question | Why |
|---|---|
| Is this the exact package we intended? | Typosquats and hallucinated names look right. Check the name, the publisher and the link from the project's own page. |
| Do we need it at all? | Every dependency is a permanent obligation. A few lines of our own code may be safer. |
| Is it maintained? | Recent releases, responsive maintainers, more than one of them. |
| Is it widely used? | Popularity is not safety, but obscurity makes problems slower to find. |
| What does it run, and with what permissions? | Does it need the network, the file system, a build script that runs on install? |
| What is the licence? | Some licences impose conditions on your product. Ask the people responsible. |
| How many indirect dependencies does it bring? | Each is another link. |
| Is there a known history of flaws and how fast were they fixed? | A guide to how seriously it is run. |

For agents, a standing rule helps: **an agent may not add a new dependency without a short justification, and a person must approve it.** Updating an existing one within the same family can be allowed with checks.

### Pinning and lock files

A **lock file** records the exact version of every dependency, direct and indirect, and usually a hash (a fingerprint) of each. With it, the same build gets the same code, and a surprise change is visible in a merge request. Without it, a build may quietly pick up a new version that was published an hour ago. Always commit the lock file, and review changes to it as you would review code. Pin base images by their fingerprint, not just a moving label like `latest`.

### Scanning for known flaws

Dependency scanners compare your list of dependencies with public databases of known flaws and report matches. The OWASP [Dependency-Check](https://owasp.org/projects/dependency-check) project is a free open source example, and GitLab offers [dependency scanning](https://docs.gitlab.com/user/application_security/dependency_scanning/) as part of its security features; check which parts your plan includes. Treat results this way.

1. **Is the vulnerable part actually used** by our code? Many are not reachable.
2. **How severe** is it, and is anyone exploiting it?
3. **Is there a fixed version,** and what does the upgrade change?
4. **Decide:** fix now, schedule, or accept with a reason, an owner and a review date.

Scanners have both noise and blind spots. A flaw published yesterday will not be in anyone's database today. A clean result means "no known flaw matched".

### A bill of materials

A **software bill of materials** (SBOM) is a list of everything in a release: each component, its version and where it came from, like an ingredients label. Its value shows when a new flaw is announced: you can answer "are we affected?" in minutes by searching the list, instead of hunting through projects. Generate one in the pipeline for each release and keep it with the release. NIST's [Secure Software Development Framework](https://csrc.nist.gov/projects/ssdf) is a broad reference for practices of this kind, and CISA's [Secure by Design](https://www.cisa.gov/securebydesign) sets out expectations for vendors.

### Signatures and provenance

Two ideas let you check that a release is what it claims.

- A **signature** shows that a particular identity vouches for an artifact and that it has not changed since. Projects like [Sigstore](https://www.sigstore.dev/) make signing available without managing long-lived keys, by tying signatures to identities that can be checked.
- **Build provenance** is a signed record of how an artifact was built: from which source, by which build system, with which inputs. The [SLSA](https://slsa.dev/) framework describes increasing levels of confidence in how a build was produced, from simply recording it to making it hard to tamper with.

Be clear about what each proves.

| Evidence | It proves | It does not prove |
|---|---|---|
| **A signature** | This identity signed this exact artifact; it was not altered afterwards. | That the identity is trustworthy or that the code is safe. |
| **Provenance** | This artifact came from this source through this build. | That the source itself is free of flaws. |
| **An SBOM** | What is inside. | That what is inside is safe. |
| **A clean scan** | No known matching flaw. | No unknown flaw. |

Each is evidence you can require and check. None is a guarantee. Together they let you answer the question "where did this come from and what does it contain" and refuse to run what cannot answer it.

### The pipeline is part of the chain

Anyone who can change the pipeline can change what is shipped, so treat pipeline files as code with owners and review (CI/CD lesson 4). Keep build credentials narrow and short-lived. Where possible, build in clean, short-lived environments rather than long-lived machines that accumulate state.

## 3. Step by step: put a dependency policy in place

1. **List current dependencies** with versions, from the lock file.
2. **Write the policy:** the questions in section 2, the approver, and the speed for fixing known flaws by severity.
3. **Commit lock files** and pin base images by fingerprint.
4. **Turn on a dependency scan** for every merge request.
5. **Generate an SBOM** for every release and store it with the release.
6. **Add a rule for agents:** no new dependency without a justification and an approval.
7. **Set an update routine:** a regular, small, reviewed update, not a rare, large one.
8. **Add signing and provenance** to releases where the platform supports it, and check them before deployment.
9. **Practise the question** "are we affected by this announced flaw?" and time how long it takes to answer.
10. **Record exceptions** with an owner and a date.

## 4. Worked example: TrailMug

TrailMug's agent is asked to add a feature that formats order dates for different countries. The agent proposes to add a package called by a name close to a popular date library. In its summary it says: "added the standard date formatting library".

Maya's rule says new dependencies need a justification and an approval, so the merge request has a section called "New dependencies". She reads it and asks four questions of the agent in a separate session, with the exact prompt in section 5. The report comes back:

- The name differs by one letter from the well-known library.
- It was first published nine days ago, with one maintainer and a handful of downloads.
- Its install step runs a script that makes a network call.
- A well-established library already in the project has the function needed.

She rejects the package and asks the agent to use the existing library. She adds a line to her notes: the agent's description "the standard library" was wrong. The check against the project's own page was what showed it.

Later that month, a flaw is announced in a library TrailMug uses. Because each release has an SBOM, she asks an agent to search the list for the affected version across the last five releases. The answer arrives in minutes: the current release is affected, the previous two are not. The scanner then confirms it, and the team ships a fixed version the same day. In the retrospective she records the time to answer as a number to improve.

## 5. Working with AI agents on this

**What the PDM decides:** the dependency standard, who approves, how quickly flaws must be fixed, what evidence a release needs.

**Delegate:** researching a package's facts, scanning, drafting update merge requests, generating and searching an SBOM, writing the policy text.

**Verify:** the package is the intended one (check from the project's own page); scanner findings are real and reachable; a signature or provenance check passes before deployment.

**Never delegate:** approving a new dependency, accepting a known flaw, or changing signing identities.

**Prompt to vet a package:**

```text
Research this package before we add it. Report: the exact name and publisher, the
date it was first published, number of maintainers, recent release history, whether
the name is close to a more popular package, what its install step does, what
permissions it needs, its licence, the number of indirect dependencies it adds, and
known past flaws. Link the project's own page for each fact. Say whether an existing
dependency already does the job. Do not add it. Mark anything you could not verify.
<paste package name>
```

**Prompt to triage scanner results:**

```text
Here are the dependency scan results. For each finding, say whether our code calls
the affected part (show where), the severity, whether a fixed version exists, and
what upgrading changes. Group them as: fix now, schedule, or accept with a reason.
Do not upgrade anything yet. Mark every judgement you are unsure about.
<paste results>
```

**Disclose** AI-suggested dependencies in the merge request and record who approved them.

## 6. Common mistakes and how to avoid them

- **Trusting a package name.** Fix: verify from the project's own page.
- **Letting agents add dependencies freely.** Fix: justification and approval.
- **No lock file, or an unreviewed one.** Fix: commit it and review changes.
- **Moving labels on base images.** Fix: pin by fingerprint.
- **Scanning once.** Fix: scan every merge request and on a schedule.
- **Treating "signed" as "safe".** Fix: a signature proves who and unchanged, not good.
- **Rare, huge updates.** Fix: small, regular, reviewed updates.
- **No way to answer "are we affected?".** Fix: an SBOM for every release.

## 7. Practice

**Deliverable in git:** `specs/sec-03.md`, `briefs/sec-03.md`, `reviews/sec-03.md`, `docs/dependency-policy.md`.

1. Write `docs/dependency-policy.md` using the questions in section 2, an approver and fix times by severity.
2. Pick a small project with a dependency list.
3. Write a spec for an audit with at least six acceptance criteria, including "every finding states whether it is reachable".
4. Brief an agent to audit the list and vet the three least familiar packages with the vetting prompt.
5. Check the agent's claims against each project's own page. Record mismatches in `reviews/sec-03.md`.
6. Time how long it takes to answer: "does any release contain version X of library Y?" Write down the time.
7. Open a merge request with the policy, a disclosure block and a note of any package the agent got wrong.

## 8. Checklist

- [ ] I know the links in our supply chain.
- [ ] Lock files are committed and reviewed.
- [ ] New dependencies need a justification and a person's approval.
- [ ] A dependency scan runs on every merge request.
- [ ] Each release has an SBOM I can search.
- [ ] I know what a signature, provenance and a clean scan each prove.
- [ ] I checked at least one agent claim about a package against its own page.

## 9. Further learning

Read the SLSA introduction to see the levels of build confidence, and the Sigstore overview to see how signing works without handling long-lived keys. Try a dependency scanner on a project you know, and keep the NIST framework as a reference when you write policy. The last lesson applies these limits to the agents themselves.
