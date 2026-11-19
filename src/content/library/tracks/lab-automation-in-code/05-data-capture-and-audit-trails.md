---
title: "Data capture and audit trails"
description: "Record every run so a stranger can check it. Use structured data and metadata, FAIR and ALCOA+ as checklists, SHA-256 hashes and a hash-chained log, git for protocols, and meet 21 CFR Part 11 as awareness only."
section: "Lab automation in code"
order: 5
track: "lab-automation-in-code"
level: "core"
duration: "3 hours"
outcomes:
  - "Capture each run as structured data with the metadata needed to understand it"
  - "Use FAIR and ALCOA+ as checklists for your own records"
  - "Build a hash-chained audit log, verify it and show what it can and cannot prove"
  - "Keep protocols and logs in git so each result links to the exact code that made it"
  - "Say what 21 CFR Part 11 is about, without claiming that your project complies with it"
resources:
  - "fda/data-integrity-and-compliance-with-drug-cgmp"
  - "who/guideline-on-data-integrity"
  - "go-fair/fair-principles"
  - "legal-information-institute/21-cfr-part-11"
  - "elabftw/elabftw-documentation"
  - "git/pro-git"
  - "turing-way/guide-for-reproducible-research"
prerequisites:
  - "tracks/lab-automation-in-code/04-bayesian-optimisation-for-the-next-experiment"
updated: 2026-11-19
---

**Supports:** this track, the Developer path (logs and audit trails) and the Master Developer Product Package (evidence behind a decision). **Time:** about three hours. **Simulation only.**

## 1. Why this matters

A closed loop makes records quickly. In a few minutes it designs a batch, writes a protocol, runs it, reads the plate and learns. Months later someone asks: "Where did this number come from? Which protocol made it? Did anyone change the data?" If your only record is a folder of files with names like `final2.csv`, you cannot answer.

Records also protect you from yourself. A loop can look as if it works because a result was edited, a failed run was left out or the wrong protocol was kept. A plain, checkable record makes each of those visible.

This lesson shows how to record a run so that a stranger can follow it from design to result, with small tools you can read in one sitting. It also shows their limits, because a record that claims too much is worse than none.

### What the PDM decides here

| You decide | You may delegate to an agent | You verify | Other disciplines involved |
|---|---|---|---|
| What must be recorded, how long it is kept, who may change it and what the record is allowed to claim | Writing the logging and verification code and its tests, from a written brief | That a tamper test fails when it should, that failed runs are logged too and that the README claims no more than the code does | Quality and compliance (what a regulated lab must keep), security (who has write access), the bench scientist (what metadata matters) |

## 2. Key ideas

### Structured capture

Capture data in a form a program can read: JSON or CSV with fixed field names, one folder per run, never a screenshot or a free-text note alone. A good run folder holds:

- the **design** (what you meant to do),
- the **protocol** that was run,
- the **simulator or run log** (what the robot did),
- the **raw readings** (before any correction),
- the **results** (after correction), and
- the **code version** that produced them.

Keep the raw data. You must be able to redo every correction and plot from it.

### Metadata

**Metadata** is the contextual information needed to understand a data value. The FDA data-integrity guidance puts it the same way: a value on its own means little without the context. For a run, useful metadata includes the date and time in UTC, who or what ran it, the software versions, the random seed, the labware and the units. A number like `37.5` needs a unit and a meaning.

### FAIR

The **FAIR** principles say that data should be **F**indable, **A**ccessible, **I**nteroperable and **R**eusable. In practice, for your repository: give each run a stable identifier, say where the data lives, use open formats and common field names, and state how it may be reused. The GO FAIR Foundation explains each principle. FAIR does not mean "open to everyone". It means that someone with the right access can find and use the data without asking you.

### ALCOA and ALCOA+

Regulators of medicines ask that records be trustworthy. The US FDA guidance on data integrity says that complete, consistent and accurate data should be **attributable, legible, contemporaneously recorded, original or a true copy, and accurate (ALCOA)**. The WHO data-integrity guideline uses the extended name **ALCOA+**, which adds **complete, consistent, enduring and available**.

You can use the list as a checklist for any record, without being in a regulated lab. Here is how each word maps to the log you will build.

| Word | In plain words | In the colour lab |
|---|---|---|
| Attributable | You can tell who or what did it | Every entry has an `actor` |
| Legible | A person can read it | Plain JSON lines |
| Contemporaneous | Recorded when it happened | A UTC time written at each event |
| Original | The first record is kept | Raw readings stored before any correction |
| Accurate | It is correct | The simulator's volumes are compared with the design |
| Complete | Nothing is left out | Failed and repeated steps are logged too |
| Consistent | The order and format are the same | Sequence numbers and a fixed field set |
| Enduring | It lasts | Kept in git |
| Available | It can be read when needed | In the repository, readable with a text editor |

### Run logs and hashes

A **run log** is the list of what happened, in order. The simulator log from lesson 2 is one. An **audit trail** adds who and when, and makes the record hard to change quietly. The FDA guidance defines it as a secure, computer-generated, time-stamped record that lets you reconstruct the course of events when an electronic record was created, changed or deleted.

A **hash** is a fixed-size fingerprint of some data. SHA-256, which you will use, turns any file into 64 hexadecimal characters. Change one character of the file and the fingerprint changes completely. So a hash lets you say "this exact file", and later check that it has not changed.

A **hash chain** goes one step further. Each log entry stores the hash of the entry before it. If someone edits an old entry, its hash no longer matches, and every later entry now points at the wrong one. You can then see where the damage begins.

### What a hash chain does not do

This is the limit, and you must state it. The chain is **tamper-evident, not tamper-proof**. A person who can rewrite the whole file can recompute every hash and make the chain consistent again. Deleting the last lines goes unseen too. There is no secret key in this design. To make this visible, keep a copy of the latest hash somewhere the writer cannot reach, such as a commit signed by someone else, or a number printed in the report. Real systems add signatures and access control, and an organisation adds procedures. Your small log is a teaching tool and a useful habit, nothing more.

### Git for protocols

Protocols are code, so keep them in git. Commit the protocol before the run. Put the commit hash in the run's metadata. Then any result links to the exact version that made it. Use branches and merge requests for changes. A protected branch and a required review mean nobody changes a protocol alone. See [Git mental model](/library/tracks/git-and-gitlab/01-git-mental-model).

### Electronic lab notebooks

An **electronic lab notebook** (ELN) is software for recording experiments. One free, open-source example is eLabFTW. Its source is licensed under the GNU Affero General Public License, version 3, and its documentation describes installing it with Docker. An ELN gives you users, permissions and a place for people to write. It does not replace your run logs. In a real lab, a protocol file or a run folder could be linked from an ELN entry. This track does not need one.

### 21 CFR Part 11, as awareness only

Title 21, Part 11 of the US Code of Federal Regulations covers electronic records and electronic signatures in work regulated by the FDA. Section 11.1 says it sets out the criteria under which the FDA considers electronic records and signatures trustworthy, reliable and generally equivalent to paper. Section 11.10(e) calls for secure, computer-generated, time-stamped audit trails, and says that record changes shall not obscure previously recorded information.

Read this as awareness. It explains why audit trails exist. **This track makes no claim that the colour lab, or any code in it, complies with Part 11.** Compliance depends on the whole system: validation, procedures, training, access control and more. If you need it, work with people who do this for a living.

## 3. Step by step

1. **List what a run produces:** design, protocol, simulator log, raw readings, results and metadata.
2. **Give each run a folder and an identifier,** for example `runs/round-01/`.
3. **Write the design before the run** and commit it.
4. **Record the context:** UTC time, actor, software versions, seed, code commit.
5. **Log each step as an event** with a sequence number, the time, the actor, the event name, its data and the hashes of the files it touched.
6. **Chain the entries.** Store the previous entry's hash in each new one.
7. **Verify.** Write a function that recomputes every hash and reports each problem. Run it after every run and in the test suite.
8. **Test tampering.** Edit an entry, edit a file and delete a file. Each must be reported.
9. **Anchor the last hash** outside the log: in the report, and in the commit message.
10. **Log failures too.** A run that stopped is part of the record.

## 4. Worked example: the colour lab's audit log

Here is the core of the audit log for the capstone. It is about fifty lines, so you can read all of it.

```python
import hashlib
import json
from collections.abc import Callable
from datetime import datetime, timezone
from pathlib import Path

GENESIS = "0" * 64


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _entry_hash(body: dict) -> str:
    canonical = json.dumps(body, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class AuditLog:
    """Who did what, when, with which files (by hash). Tamper-evident, not tamper-proof."""

    def __init__(self, path: Path, actor: str, clock: Callable[[], str] = _utc_now) -> None:
        self.path, self.actor, self.clock = path, actor, clock
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def _last(self) -> tuple[int, str]:
        if not self.path.exists():
            return 0, GENESIS
        lines = self.path.read_text(encoding="utf-8").splitlines()
        if not lines:
            return 0, GENESIS
        last = json.loads(lines[-1])
        return last["seq"], last["hash"]

    def append(self, event: str, data: dict, files: list[Path] | None = None) -> dict:
        seq, prev = self._last()
        body = {
            "seq": seq + 1, "time_utc": self.clock(), "actor": self.actor, "event": event,
            "data": data, "files": {str(p): sha256_file(p) for p in (files or [])}, "prev": prev,
        }
        entry = {**body, "hash": _entry_hash(body)}
        with self.path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(entry, sort_keys=True) + "\n")
        return entry


def verify(path: Path) -> list[str]:
    """Return a list of problems. An empty list means the chain and the file hashes hold."""
    problems: list[str] = []
    prev = GENESIS
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        entry = json.loads(line)
        body = {k: v for k, v in entry.items() if k != "hash"}
        if entry["prev"] != prev:
            problems.append(f"line {number}: chain broken (prev hash does not match)")
        if _entry_hash(body) != entry["hash"]:
            problems.append(f"line {number}: entry was changed (hash does not match)")
        for name, digest in entry["files"].items():
            file = Path(name)
            if not file.exists():
                problems.append(f"line {number}: {name} is missing")
            elif sha256_file(file) != digest:
                problems.append(f"line {number}: {name} changed after it was logged")
        prev = entry["hash"]
    return problems
```

Each line of the log is one JSON object, such as the first entry of a real run:

```json
{"actor": "colourlab.loop", "data": {"batch": 8, "mode": "simulation", "rounds": 3, "seed": 20261119}, "event": "start", "files": {}, "hash": "cd7108d3...", "prev": "0000...0000", "seq": 1, "time_utc": "2026-11-19T23:09:12+00:00"}
```

The hash strings are shortened here. A full three-round run of the loop writes 17 such lines: a start, then for each round a design, a protocol, a simulation, a read and a learn event, then a finish. Each file event stores the SHA-256 of the design, protocol, simulator log and readings it relates to.

Now the test that matters. It changes a file, then an entry, and checks that `verify` notices both.

```python
def test_audit_log_detects_edits(tmp_path):
    artefact = tmp_path / "design.json"
    artefact.write_text("{}", encoding="utf-8")
    log = AuditLog(tmp_path / "audit.jsonl", actor="test", clock=lambda: "2026-01-01T00:00:00+00:00")
    log.append("start", {"x": 1})
    log.append("design", {"round": 1}, [artefact])
    assert verify(tmp_path / "audit.jsonl") == []

    artefact.write_text('{"changed": true}', encoding="utf-8")
    assert any("changed after it was logged" in p for p in verify(tmp_path / "audit.jsonl"))
    artefact.write_text("{}", encoding="utf-8")

    lines = (tmp_path / "audit.jsonl").read_text(encoding="utf-8").splitlines()
    first = json.loads(lines[0])
    first["data"]["x"] = 2
    lines[0] = json.dumps(first, sort_keys=True)
    (tmp_path / "audit.jsonl").write_text("\n".join(lines) + "\n", encoding="utf-8")
    assert any("entry was changed" in p for p in verify(tmp_path / "audit.jsonl"))
```

Notice what the test does not do. It does not rewrite the whole chain. That attack works, as the key ideas say. The defence is outside the file: the capstone report prints the last hash, and you commit it, so a rewrite has to change a place that someone else can see.

Now map this to ALCOA+. Is it attributable? The `actor` is a program name, not a person, so a real lab would also need a user. Is it original? Only if you saved the raw readings before correction. Is it complete? Only if failed runs are logged too. The mapping is how you find gaps. Write them down.

## 5. Working with AI agents on this

**What the PDM decides.** What a record must contain and what it may claim. The claim "tamper-evident" is yours. The agent may not upgrade it to "secure" or "compliant".

**What you delegate, and the exact brief.** You may hand an agent the logging code and its tests. This is the **delegate** rung: a written brief and acceptance criteria.

```text
Task: write audit.py and test_audit.py for a run log, standard library only.
Behaviour: an append-only JSON Lines file. Each entry has seq, time_utc,
actor, event, data, files (path to SHA-256), prev and hash. The hash is the
SHA-256 of the canonical JSON of the entry without the hash field.
A verify(path) function returns a list of problems.

Rules:
1. Tests must cover: a good log passes; an edited entry is reported; an edited
   file is reported; a deleted file is reported; a removed line in the middle is reported.
2. Do not call the result secure, tamper-proof or compliant. In the docstring,
   say what it cannot detect (a full rewrite of the chain).
3. Do not add a signature or key unless I ask.
4. Use UTC for times, and pass the clock in so tests are deterministic.
Output: audit.py, test_audit.py, and a paragraph on its limits.
```

**How you verify.** Run the tests. Then break the code on purpose: remove the `prev` check and see that a test fails. If none fails, the tests are weak. Search the docstring and README for "secure", "tamper-proof", "compliant" and "guaranteed", and take them out.

**Which disciplines are involved.** Quality and compliance people say what a regulated lab must keep. Security decides who has write access to the log. The bench scientist says what metadata a reader will need.

**Where this sits on the ladder.** This is **delegate**. It becomes **govern** when a pipeline check runs `verify` on every committed log and blocks a merge if it reports a problem. That is the control that does not depend on someone remembering.

**Disclose.** Add to the README: "The audit code was drafted by an AI agent from my brief. I wrote the tamper tests' expectations and ran them against deliberate breaks myself." See [Disclose AI use](/library/disclose-ai-use).

## 6. Common mistakes

- **Calling the log "secure" or "compliant".** It is tamper-evident, and only against edits that leave the rest of the chain alone.
- **Keeping only the corrected data.** Keep the raw readings.
- **Logging only the successes.** A stopped or repeated run belongs in the record.
- **Hashing nothing.** Without file hashes, a log entry can name a file that was later swapped.
- **Local time with no zone.** Use UTC.
- **No anchor for the last hash.** Without one, a full rewrite goes unseen.
- **Treating Part 11 as a checklist you can copy.** It applies to regulated systems, and it needs people and procedures.

## 7. Practice: an audit log for your own run

**Deliverable:** `lab/audit/audit.py`, `lab/audit/test_audit.py`, a sample log and `lab/audit/NOTES.md` in your git repository.

1. Write or adapt the audit code, with tests for the five cases in the brief.
2. Run a small script that appends five events for a made-up run, hashing at least two files, and write the log to `lab/audit/sample-audit.jsonl`.
3. In `NOTES.md`, fill in the ALCOA+ table for your own log. For each word, write what you do and what is missing. Mark at least two gaps.
4. In the notes, write one paragraph on what the log cannot detect, and where you anchor the last hash.
5. Add a line to `NOTES.md` saying that nothing here claims compliance with any regulation.
6. Commit with a message such as `feat: add hash-chained audit log with tamper tests`.

**Check:** edit one character in the sample log by hand and run `verify`. Which line does it point to?

## 8. Checklist

- [ ] Each run has a folder with the design, protocol, log, raw readings and results.
- [ ] Metadata includes UTC time, actor, versions, seed and code commit.
- [ ] Every log entry stores the previous entry's hash.
- [ ] File hashes are stored and checked.
- [ ] Failed runs are logged.
- [ ] The tamper tests fail when I break the code on purpose.
- [ ] The last hash is anchored outside the log.
- [ ] My README says "tamper-evident" and not "secure" or "compliant".
- [ ] I recorded my AI use.

## 9. Further learning

The FDA data-integrity guidance and the WHO data-integrity guideline are the sources for ALCOA and ALCOA+. They are written for medicines, so use them for ideas and not as rules for your project. The GO FAIR page explains the FAIR principles. Cornell's Legal Information Institute publishes the text of 21 CFR Part 11. The eLabFTW documentation shows what an open-source electronic lab notebook looks like. Pro Git and the Turing Way cover version control and reproducible research. Next, in [Capstone: a closed loop in simulation](/library/tracks/lab-automation-in-code/06-capstone-a-closed-loop-in-simulation), you put the whole track together.
