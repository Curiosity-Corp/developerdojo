"""Fetch the education pathway's inputs (Developer Dojo maintainers only; CI never runs this).

    python -I tools/fetch_input.py .

Downloads, byte for byte, into inputs/:

- the W3C ACT test case index (testcases.json) and the approved test cases of the four rules the pathway runs;
- the IANA Language Subtag Registry;
- the Wikibooks page "High School Mathematics Extensions/Matrices" as served to a reader, and
  checks that it is revision 266672.

Then it prints the SHA-256 of every file. The page view carries values that change when Wikibooks re-renders it
(a cache timestamp, skin markup), so a later download can differ: if the hash changes, update the pack record (src/data/sector-packs.ts), the
tests and the generated files together, and never edit the written bytes.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
import urllib.request
from pathlib import Path

RULES = ("2779a5", "b5c3f8", "bf051a", "b4f0c3")
TESTCASES = "https://www.w3.org/WAI/content-assets/wcag-act-rules/testcases.json"
TESTCASE_BASE = "https://www.w3.org/WAI/content-assets/wcag-act-rules/"
REGISTRY = "https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry"
PAGE = "https://en.wikibooks.org/wiki/High_School_Mathematics_Extensions/Matrices"
PAGE_REVISION = 266672
AGENT = "developer-dojo-education-pathway/1.0"


def get(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": AGENT})
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return response.read()
    except OSError as error:
        raise SystemExit(f"{url}: download failed: {error}")


def write(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    print(f"{hashlib.sha256(data).hexdigest()}  {path}")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: fetch_input.py <folder that holds inputs/>", file=sys.stderr)
        return 2
    inputs = Path(argv[1]) / "inputs"

    index = get(TESTCASES)
    try:
        cases = json.loads(index)["testcases"]
    except (ValueError, KeyError) as error:
        raise SystemExit(f"{TESTCASES}: not the ACT test case index: {error}")
    write(inputs / "act-rules" / "testcases.json", index)
    for case in cases:
        if case.get("ruleId") in RULES and case.get("approved") is True:
            write(inputs / "act-rules" / case["relativePath"], get(TESTCASE_BASE + case["relativePath"]))

    registry = get(REGISTRY)
    if not registry.startswith(b"File-Date: "):
        raise SystemExit(f"{REGISTRY}: not the Language Subtag Registry")
    write(inputs / "language-subtag-registry.txt", registry)

    page = get(PAGE)
    revision = re.search(rb'"wgRevisionId":(\d+)', page)
    if revision is None or int(revision.group(1)) != PAGE_REVISION:
        raise SystemExit(f"{PAGE}: expected revision {PAGE_REVISION}, got {revision.group(1).decode() if revision else 'none'}")
    write(inputs / "matrices.html", page)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
