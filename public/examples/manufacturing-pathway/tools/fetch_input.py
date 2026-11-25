"""Fetch the manufacturing pathway's input (Developer Dojo maintainers only; CI never runs this).

    python -I tools/fetch_input.py .

Downloads LITHOGRA.DAT, the data file of the lithography case study in the NIST/SEMATECH e-Handbook of Statistical
Methods (section 6.6.1), and writes its 450 data rows to inputs/, byte for byte. The file's 25-line header is left out:
it names the person who supplied the data, and the Dojo publishes no person's name. What the header says about the
columns is in the README. The script prints the SHA-256 of the whole file and of the rows it wrote. If the handbook
changes the file, update the pack record (src/data/sector-packs.ts), the tests and the generated files together, and
never edit the written bytes.
"""

from __future__ import annotations

import hashlib
import sys
import urllib.request
from pathlib import Path

SOURCE = "https://www.itl.nist.gov/div898/handbook/datasets/LITHOGRA.DAT"
TARGET = "inputs/lithogra-data-rows.dat"
HEADER_LINES = 25
DATA_ROWS = 450


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: fetch_input.py <folder that holds inputs/>", file=sys.stderr)
        return 2
    request = urllib.request.Request(SOURCE, headers={"User-Agent": "developerdojo-manufacturing-pathway-fetch"})
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            if response.status != 200:
                print(f"{SOURCE}: HTTP {response.status}", file=sys.stderr)
                return 1
            body = response.read()
    except OSError as error:
        print(f"{SOURCE}: download failed: {error}", file=sys.stderr)
        return 1
    lines = body.split(b"\r\n")
    if not body.startswith(b"This is Dataplot data file LITHOGRA.DAT") or len(lines) < HEADER_LINES or not lines[HEADER_LINES - 1].startswith(b"----"):
        print(f"{SOURCE}: unexpected content, first bytes {body[:80]!r}", file=sys.stderr)
        return 1
    offset = sum(len(line) + 2 for line in lines[:HEADER_LINES])
    rows = body[offset:]
    count = len([line for line in rows.split(b"\r\n") if line.strip()])
    if count != DATA_ROWS or not rows.endswith(b"\r\n"):
        print(f"{SOURCE}: expected {DATA_ROWS} data rows ending in CRLF, found {count}", file=sys.stderr)
        return 1
    target = Path(argv[1]) / TARGET
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(rows)
    print(f"LITHOGRA.DAT {len(body)} bytes sha256 {hashlib.sha256(body).hexdigest()}")
    print(f"{TARGET} {len(rows)} bytes sha256 {hashlib.sha256(rows).hexdigest()}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
