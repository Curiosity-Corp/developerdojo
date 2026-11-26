"""Education pathway (Developer Dojo): from a learning page to a checked accessibility report.

    python -I tools/education_pathway.py <pathway folder> <output folder>

Standard library only. The method is four rules of the W3C Accessibility Conformance Testing (ACT) Rules, written to
the ACT Rules Format 1.1 and mapped to WCAG 2.2 (W3C Recommendation, 12 December 2024):

- 2779a5  HTML page has non-empty title            WCAG 2.4.2 Page Titled (Level A)
- b5c3f8  HTML page has lang attribute             WCAG 3.1.1 Language of Page (Level A)
- bf051a  HTML page lang attribute has valid language tag  WCAG 3.1.1 Language of Page (Level A)
- b4f0c3  Meta viewport allows for zoom            WCAG 1.4.4 Resize text (Level AA)

A "known primary language tag" is looked up in the IANA Language Subtag Registry, committed with its File-Date.

Before it checks anything else, the script runs the four rules on every approved test case the W3C publishes for
them (inputs/act-rules/testcases.json) and compares its outcome with the expected one. If any differs, it exits with
an error and writes nothing. Then it writes:

- inspection.json: the structure of the Wikibooks page as served, before any script runs (EDU-001);
- rules.json: the four rules' outcomes on the page, target by target (EDU-002);
- report.json: what those outcomes say about each WCAG success criterion, by the ACT outcome mapping, and what they
  leave untested (EDU-003);
- randori/cards.json: the Randori cards, each a one-change copy of the page, recomputed;
- reference-checks.json, manifest.json and summary.md.

The page is the CC BY-SA 4.0 Wikibooks page "High School Mathematics Extensions/Matrices",
revision 266672, unchanged; see tools/fetch_input.py.
"""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import sys
from html.parser import HTMLParser
from pathlib import Path

PAGE = "inputs/matrices.html"
REGISTRY = "inputs/language-subtag-registry.txt"
INDEX = "inputs/act-rules/testcases.json"
CASES = "inputs/act-rules"

RULES = {
    "2779a5": {"name": "HTML page has non-empty title", "sc": "2.4.2", "criterion": "Page Titled", "level": "A"},
    "b5c3f8": {"name": "HTML page has lang attribute", "sc": "3.1.1", "criterion": "Language of Page", "level": "A"},
    "bf051a": {"name": "HTML page lang attribute has valid language tag", "sc": "3.1.1", "criterion": "Language of Page", "level": "A"},
    "b4f0c3": {"name": "Meta viewport allows for zoom", "sc": "1.4.4", "criterion": "Resize text", "level": "AA"},
}
CONTENT_TYPES = {".html": "text/html", ".svg": "image/svg+xml", ".xml": "application/xml"}
ASCII_WHITESPACE = "\t\n\f\r "
FOREIGN = {"svg", "math"}
NUMBER = re.compile(r"[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?")


class ReferenceMismatch(Exception):
    """A rule gave an outcome that differs from the W3C's expected outcome for a published test case."""


class Document(HTMLParser):
    """What the four rules and the page inspection need from an HTML document, as an HTML parser reads it."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root: dict[str, str] | None = None
        self.titles: list[str] = []
        self.metas: list[dict[str, str]] = []
        self.headings: list[dict[str, object]] = []
        self.images: list[dict[str, str]] = []
        self.links = 0
        self.tables = 0
        self.tables_with_caption = 0
        self._foreign = 0
        self._title: list[str] | None = None
        self._heading: tuple[int, list[str]] | None = None

    @staticmethod
    def first(attrs: list[tuple[str, str | None]]) -> dict[str, str]:
        values: dict[str, str] = {}
        for key, value in attrs:
            values.setdefault(key, "" if value is None else value)
        return values

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = self.first(attrs)
        if tag in FOREIGN:
            self._foreign += 1
        if self._foreign:
            return
        if tag == "html" and self.root is None:
            self.root = values
        elif tag == "title" and self._title is None:
            self._title = []
        elif tag == "meta":
            self.metas.append(values)
        elif tag == "img":
            self.images.append(values)
        elif tag == "a" and "href" in values:
            self.links += 1
        elif tag == "table":
            self.tables += 1
        elif tag == "caption":
            self.tables_with_caption += 1
        elif re.fullmatch(r"h[1-6]", tag) and self._heading is None:
            self._heading = (int(tag[1]), [])

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in FOREIGN:
            return
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag: str) -> None:
        if tag in FOREIGN and self._foreign:
            self._foreign -= 1
            return
        if self._foreign:
            return
        if tag == "title" and self._title is not None:
            self.titles.append("".join(self._title))
            self._title = None
        elif self._heading is not None and tag == f"h{self._heading[0]}":
            self.headings.append({"level": self._heading[0], "text": " ".join("".join(self._heading[1]).split())})
            self._heading = None

    def handle_data(self, data: str) -> None:
        if self._title is not None:
            self._title.append(data)
        if self._heading is not None:
            self._heading[1].append(data)


def parse(text: str) -> Document:
    document = Document()
    document.feed(text)
    document.close()
    return document


def blank(value: str) -> bool:
    return value.strip(ASCII_WHITESPACE) == ""


def load_registry(path: Path) -> tuple[str, set[str], list[tuple[str, str]]]:
    """Primary language subtags (Type: language) of the IANA registry: single subtags and ranges such as qaa..qtz."""
    text = path.read_text(encoding="utf-8")
    date = text.splitlines()[0].removeprefix("File-Date: ").strip()
    single: set[str] = set()
    ranges: list[tuple[str, str]] = []
    for record in text.split("\n%%\n")[1:]:
        fields = dict(line.split(": ", 1) for line in record.splitlines() if ": " in line and not line.startswith(" "))
        if fields.get("Type") != "language":
            continue
        subtag = fields["Subtag"].lower()
        if ".." in subtag:
            low, high = subtag.split("..")
            ranges.append((low, high))
        else:
            single.add(subtag)
    if not single:
        raise ValueError(f"{path}: no language subtags found")
    return date, single, ranges


class Rules:
    def __init__(self, languages: set[str], language_ranges: list[tuple[str, str]]) -> None:
        self.languages = languages
        self.language_ranges = language_ranges

    def known_primary_language(self, tag: str) -> bool:
        primary = tag.strip(ASCII_WHITESPACE).split("-")[0].lower()
        if primary in self.languages:
            return True
        return any(len(primary) == len(low) and low <= primary <= high and primary.isalpha() for low, high in self.language_ranges)

    def run(self, rule: str, content_type: str, document: Document | None) -> list[dict[str, str]]:
        """The rule's targets with their outcome; an empty list means the rule is inapplicable."""
        if content_type != "text/html" or document is None:
            return []
        root = document.root if document.root is not None else {}
        if rule == "2779a5":
            if not document.titles:
                return [{"target": "html", "outcome": "failed", "why": "no title element"}]
            first = document.titles[0]
            if blank(first):
                return [{"target": "html", "outcome": "failed", "why": "the first title element is empty or only whitespace"}]
            return [{"target": "html", "outcome": "passed", "why": f"first title: {first.strip()}"}]
        if rule == "b5c3f8":
            lang = root.get("lang")
            if lang is None:
                return [{"target": "html", "outcome": "failed", "why": "no lang attribute"}]
            if blank(lang):
                return [{"target": "html", "outcome": "failed", "why": "lang is empty or only whitespace"}]
            return [{"target": "html", "outcome": "passed", "why": f"lang={lang}"}]
        if rule == "bf051a":
            lang = root.get("lang")
            if lang is None or blank(lang):
                return []
            known = self.known_primary_language(lang)
            return [{"target": "html", "outcome": "passed" if known else "failed", "why": f"lang={lang}: primary subtag {'is' if known else 'is not'} a language subtag in the registry"}]
        if rule == "b4f0c3":
            return [target for meta in document.metas if (target := self.viewport(meta)) is not None]
        raise ValueError(f"unknown rule {rule}")

    @staticmethod
    def viewport(meta: dict[str, str]) -> dict[str, str] | None:
        if meta.get("name", "").strip(ASCII_WHITESPACE).lower() != "viewport" or "content" not in meta:
            return None
        pairs: dict[str, str] = {}
        for item in re.split(r"[,;]", meta["content"]):
            if "=" in item:
                key, value = item.split("=", 1)
                pairs.setdefault(key.strip(ASCII_WHITESPACE).lower(), value.strip(ASCII_WHITESPACE).lower())
        if "maximum-scale" not in pairs and "user-scalable" not in pairs:
            return None

        def number(value: str) -> float | None:
            match = NUMBER.match(value)
            return float(match.group(0)) if match else None

        problems = []
        if "user-scalable" in pairs:
            value = pairs["user-scalable"]
            n = number(value)
            if not (value in ("yes", "device-width", "device-height") or (n is not None and not -1 < n < 1)):
                problems.append(f"user-scalable={value} turns zoom off")
        if "maximum-scale" in pairs:
            value = pairs["maximum-scale"]
            n = number(value)
            if not (value in ("device-width", "device-height") or (n is not None and (n < 0 or n >= 2))):
                problems.append(f"maximum-scale={value} caps zoom below 2")
        return {"target": f'meta content="{meta["content"]}"', "outcome": "failed" if problems else "passed", "why": "; ".join(problems) or "zoom of at least 200 % allowed"}


def outcome(targets: list[dict[str, str]]) -> str:
    if not targets:
        return "inapplicable"
    return "failed" if any(t["outcome"] == "failed" for t in targets) else "passed"


def reference_checks(folder: Path, rules: Rules) -> tuple[list[dict[str, str]], dict[str, str]]:
    index = json.loads((folder / INDEX).read_text(encoding="utf-8"))
    checks: list[dict[str, str]] = []
    hashes: dict[str, str] = {}
    for case in index["testcases"]:
        rule = case["ruleId"]
        if rule not in RULES or case.get("approved") is not True:
            continue
        path = folder / CASES / case["relativePath"]
        raw = path.read_bytes()
        hashes[f"{CASES}/{case['relativePath']}"] = hashlib.sha256(raw).hexdigest()
        content_type = CONTENT_TYPES[path.suffix]
        document = parse(raw.decode("utf-8")) if content_type == "text/html" else None
        computed = outcome(rules.run(rule, content_type, document))
        title = case["testcaseTitle"]
        checks.append({
            "id": f"{rule}-{title.split()[0].lower()}-{title.split()[-1]}",
            "rule": rule,
            "case": title,
            "file": case["relativePath"],
            "expected": case["expected"],
            "computed": computed,
            "status": "pass" if computed == case["expected"] else "fail",
        })
    failures = [c for c in checks if c["status"] != "pass"]
    if failures:
        raise ReferenceMismatch("; ".join(f"{c['id']} expected {c['expected']}, got {c['computed']}" for c in failures))
    if len({c["id"] for c in checks}) != len(checks):
        raise ValueError("two test cases share an id")
    return checks, hashes


def check_page(rules: Rules, text: str) -> dict[str, dict[str, object]]:
    document = parse(text)
    results: dict[str, dict[str, object]] = {}
    for rule, meta in RULES.items():
        targets = rules.run(rule, "text/html", document)
        results[rule] = {"name": meta["name"], "outcome": outcome(targets), "targets": targets}
    return results


def verdicts(results: dict[str, dict[str, object]]) -> list[dict[str, object]]:
    """The ACT outcome mapping each rule page gives: any failed outcome means the criterion is not satisfied; passed
    or inapplicable outcomes leave it to further testing."""
    rows = []
    for sc in sorted({meta["sc"] for meta in RULES.values()}, key=lambda s: [int(p) for p in s.split(".")]):
        rule_ids = [rule for rule, meta in RULES.items() if meta["sc"] == sc]
        failed = [rule for rule in rule_ids if results[rule]["outcome"] == "failed"]
        meta = RULES[rule_ids[0]]
        rows.append({
            "successCriterion": sc,
            "name": meta["criterion"],
            "level": meta["level"],
            "rules": {rule: results[rule]["outcome"] for rule in rule_ids},
            "conclusion": "not satisfied" if failed else "further testing needed",
        })
    return rows


def inspect(text: str, raw: bytes) -> dict[str, object]:
    document = parse(text)
    root = document.root or {}
    viewport = [m.get("content", "") for m in document.metas if m.get("name", "").lower() == "viewport"]
    levels = [h["level"] for h in document.headings]
    skips = [f"h{a} to h{b}" for a, b in zip(levels, levels[1:]) if isinstance(a, int) and isinstance(b, int) and b > a + 1]
    revision = re.search(r'"wgRevisionId":(\d+)', text)
    return {
        "bytes": len(raw),
        "revision": int(revision.group(1)) if revision else None,
        "title": document.titles[0].strip() if document.titles else None,
        "titleElements": len(document.titles),
        "htmlLang": root.get("lang"),
        "htmlDir": root.get("dir"),
        "viewport": viewport,
        "headings": {
            "count": len(levels),
            "byLevel": {f"h{n}": levels.count(n) for n in range(1, 7)},
            "outline": document.headings,
            "skippedLevels": skips,
        },
        "images": {
            "count": len(document.images),
            "withAltText": sum(1 for i in document.images if "alt" in i and not blank(i["alt"])),
            "withEmptyAlt": sum(1 for i in document.images if "alt" in i and blank(i["alt"])),
            "withoutAlt": sum(1 for i in document.images if "alt" not in i),
        },
        "links": document.links,
        "tables": {"count": document.tables, "captions": document.tables_with_caption},
    }


CARD_CHANGES = {
    "A": ("The html element loses its lang attribute", 'clientpref-browser" lang="en" dir="ltr">', 'clientpref-browser" dir="ltr">'),
    "B": ("The page language is written as a word: lang=\"english\"", 'clientpref-browser" lang="en" dir="ltr">', 'clientpref-browser" lang="english" dir="ltr">'),
    "C": ("The viewport caps zoom: maximum-scale=1 is added", '<meta name="viewport" content="width=1120">', '<meta name="viewport" content="width=1120, maximum-scale=1">'),
    "D": ("The title element is emptied", "<title>High School Mathematics Extensions/Matrices - Wikibooks, open books for an open world</title>", "<title></title>"),
}


def randori(rules: Rules, text: str, baseline: dict[str, dict[str, object]]) -> dict[str, dict[str, object]]:
    cards: dict[str, dict[str, object]] = {}
    base = {row["successCriterion"]: row["conclusion"] for row in verdicts(baseline)}
    for card, (title, old, new) in CARD_CHANGES.items():
        if text.count(old) != 1:
            raise ValueError(f"Randori card {card}: expected one occurrence of {old!r} in the page, found {text.count(old)}")
        results = check_page(rules, text.replace(old, new))
        changed_rules = {rule: f"{baseline[rule]['outcome']} -> {results[rule]['outcome']}" for rule in RULES if results[rule]["outcome"] != baseline[rule]["outcome"]}
        changed_sc = {row["successCriterion"]: f"{base[row['successCriterion']]} -> {row['conclusion']}" for row in verdicts(results) if row["conclusion"] != base[row["successCriterion"]]}
        cards[card] = {"title": title, "rulesChanged": changed_rules, "criteriaChanged": changed_sc}
    return cards


def build(folder: Path, out: Path) -> None:
    try:
        registry_date, languages, ranges = load_registry(folder / REGISTRY)
        raw = (folder / PAGE).read_bytes()
    except OSError as error:
        raise SystemExit(f"cannot read the inputs: {error}")
    rules = Rules(languages, ranges)
    checks, case_hashes = reference_checks(folder, rules)

    text = raw.decode("utf-8")
    inspection = inspect(text, raw)
    results = check_page(rules, text)
    report_rows = verdicts(results)
    report = {
        "standard": "WCAG 2.2 (W3C Recommendation, 12 December 2024)",
        "page": "Wikibooks, High School Mathematics Extensions/Matrices, revision 266672, as served",
        "criteria": report_rows,
        "failedCriteria": [row["successCriterion"] for row in report_rows if row["conclusion"] == "not satisfied"],
        "outcomeMapping": "ACT rule pages: any failed outcome means the success criterion is not satisfied; passed and inapplicable outcomes mean further testing is needed",
        "notTested": [
            "Every other WCAG 2.2 success criterion, including 1.1.1 Non-text Content (alternative text), 1.3.1 Info and Relationships (headings and tables) and 1.4.3 Contrast (Minimum)",
            "Whether the title describes the page (ACT rule c4a8a4) and whether lang matches the language of the text (ACT rule ucwvc8): both need a person",
            "The page after its scripts run, in a browser, with assistive technology",
        ],
    }
    cards = randori(rules, text, results)

    if out.exists():
        shutil.rmtree(out)
    (out / "randori").mkdir(parents=True)

    def write_json(name: str, value: object) -> None:
        (out / name).write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    passed = len(checks)
    write_json("reference-checks.json", {
        "source": "W3C ACT Rules test cases (testcases.json, approved cases), downloaded 2026-11-25",
        "rules": {rule: {"name": meta["name"], "successCriterion": meta["sc"]} for rule, meta in RULES.items()},
        "languageSubtagRegistry": registry_date,
        "passed": passed,
        "failed": 0,
        "checks": checks,
    })
    write_json("inspection.json", inspection)
    write_json("rules.json", results)
    write_json("report.json", report)
    write_json("randori/cards.json", cards)

    by_rule = {rule: sum(1 for c in checks if c["rule"] == rule) for rule in RULES}
    lines = [
        "# Education pathway results",
        "",
        "Computed by `tools/education_pathway.py` with four W3C ACT Rules mapped to WCAG 2.2. This is practice on one",
        "openly licensed textbook page, not an accessibility conformance claim or a legal compliance check of any site.",
        "",
        f"- Reference checks: {passed} of {passed} approved W3C test cases give their expected outcome ("
        + ", ".join(f"{rule} {n}" for rule, n in by_rule.items()) + f"); language subtags from the IANA registry of {registry_date}.",
        f"- The page: revision {inspection['revision']}, {inspection['bytes']} bytes, lang \"{inspection['htmlLang']}\", "
        f"{inspection['headings']['count']} headings, {inspection['images']['count']} images ({inspection['images']['withoutAlt']} without an alt attribute), {inspection['links']} links.",
        "- Rules on the page: " + "; ".join(f"{rule} {r['outcome']}" for rule, r in results.items()) + ".",
        "- WCAG 2.2: " + "; ".join(f"{row['successCriterion']} {row['conclusion']}" for row in report_rows) + ".",
        "- Randori cards: " + "; ".join(f"{card} " + (", ".join(f"{sc} {change}" for sc, change in c["criteriaChanged"].items()) or "no criterion changes") for card, c in cards.items()) + ".",
        "",
    ]
    (out / "summary.md").write_text("\n".join(lines), encoding="utf-8")

    inputs = {
        PAGE: hashlib.sha256(raw).hexdigest(),
        REGISTRY: hashlib.sha256((folder / REGISTRY).read_bytes()).hexdigest(),
        INDEX: hashlib.sha256((folder / INDEX).read_bytes()).hexdigest(),
    }
    inputs.update(dict(sorted(case_hashes.items())))
    outputs = sorted(p.relative_to(out).as_posix() for p in out.rglob("*") if p.is_file()) + ["manifest.json"]
    write_json("manifest.json", {
        "script": "tools/education_pathway.py",
        "python": f"{sys.version_info.major}.{sys.version_info.minor}",
        "inputs": inputs,
        "method": {
            "referenceChecks": "Every approved W3C ACT test case of rules 2779a5, b5c3f8, bf051a and b4f0c3; .svg and .xml cases are not text/html",
            "rules": "ACT rules 2779a5 (2.4.2), b5c3f8 and bf051a (3.1.1), b4f0c3 (1.4.4), read from the served HTML with an HTML parser, before any script runs",
            "languageTags": "Known primary language tag: the first hyphen-separated subtag has Type: language in the IANA Language Subtag Registry, compared case-insensitively",
            "report": "ACT outcome mapping to WCAG 2.2: failed means not satisfied; passed and inapplicable leave further testing needed",
        },
        "outputs": sorted(outputs),
    })


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: education_pathway.py <pathway folder> <output folder>", file=sys.stderr)
        return 2
    try:
        build(Path(argv[1]), Path(argv[2]))
    except ReferenceMismatch as error:
        print(f"W3C ACT test cases did not reproduce; nothing written: {error}", file=sys.stderr)
        return 1
    except (ValueError, KeyError, UnicodeDecodeError) as error:
        print(f"education pathway: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
