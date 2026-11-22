"""Fetch the science pathway's input record (Developer Dojo maintainers only; CI never runs this).

    python -I tools/fetch_input.py .

Downloads the NASA GISS GISTEMP v4 global land-ocean table to inputs/ and prints its SHA-256. The record is
revised every month, so a new download changes the hash: update the pack record (src/data/sector-packs.ts), the
tests and the generated files together, and never edit the downloaded bytes.
"""

from __future__ import annotations

import hashlib
import sys
import urllib.request
from pathlib import Path

SOURCE = "https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv"
TARGET = "inputs/gistemp-v4-global-land-ocean.csv"


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: fetch_input.py <folder that holds inputs/>", file=sys.stderr)
        return 2
    target = Path(argv[1]) / TARGET
    request = urllib.request.Request(SOURCE, headers={"User-Agent": "developerdojo-science-pathway-fetch"})
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            if response.status != 200:
                print(f"{SOURCE}: HTTP {response.status}", file=sys.stderr)
                return 1
            body = response.read()
    except OSError as error:
        print(f"{SOURCE}: download failed: {error}", file=sys.stderr)
        return 1
    if not body.startswith(b"Land-Ocean: Global Means"):
        print(f"{SOURCE}: unexpected content, first bytes {body[:40]!r}", file=sys.stderr)
        return 1
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(body)
    print(f"{TARGET} {len(body)} bytes sha256 {hashlib.sha256(body).hexdigest()}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
