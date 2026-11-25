"""Fetch the finance pathway's input (Developer Dojo maintainers only; CI never runs this).

    python -I tools/fetch_input.py . 2026-11-23

Downloads 12 CFR 1026.22 (Regulation Z, determination of the annual percentage rate) from the eCFR as it stood on
the date given, to inputs/, and prints its SHA-256. A later date can give different bytes: update the pack record
(src/data/sector-packs.ts), the tests and the generated files together, and never edit the downloaded bytes.
"""

from __future__ import annotations

import gzip
import hashlib
import re
import sys
import urllib.request
from pathlib import Path

SOURCE = "https://www.ecfr.gov/api/versioner/v1/full/{date}/title-12.xml?part=1026&section=1026.22"
TARGET = "inputs/ecfr-12-cfr-1026-22.xml"


def main(argv: list[str]) -> int:
    if len(argv) != 3 or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", argv[2]):
        print("usage: fetch_input.py <folder that holds inputs/> <YYYY-MM-DD>", file=sys.stderr)
        return 2
    source = SOURCE.format(date=argv[2])
    target = Path(argv[1]) / TARGET
    # The eCFR API refuses requests that do not accept a compressed response.
    request = urllib.request.Request(source, headers={"User-Agent": "developerdojo-finance-pathway-fetch", "Accept-Encoding": "gzip"})
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            if response.status != 200:
                print(f"{source}: HTTP {response.status}", file=sys.stderr)
                return 1
            body = response.read()
            if response.headers.get("Content-Encoding") == "gzip":
                body = gzip.decompress(body)
    except OSError as error:
        print(f"{source}: download failed: {error}", file=sys.stderr)
        return 1
    if b'N="1026.22"' not in body[:400]:
        print(f"{source}: unexpected content, first bytes {body[:80]!r}", file=sys.stderr)
        return 1
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(body)
    print(f"{TARGET} {len(body)} bytes sha256 {hashlib.sha256(body).hexdigest()}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
