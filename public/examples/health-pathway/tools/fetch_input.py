"""Fetch the health pathway's inputs (Developer Dojo maintainers only; CI never runs this).

    python -I tools/fetch_input.py .

Downloads CDC's two BMI-for-age data files, writes them to inputs/ byte for byte and prints the SHA-256 of each:

- bmiagerev.csv, the BMI-for-age file of the CDC 2000 growth charts;
- bmi-age-2022.csv, the file of the 2022 Extended BMI-for-age growth charts.

CDC may revise either file. If a hash changes, update the pack record (src/data/sector-packs.ts), the tests and the
generated files together, and never edit the written bytes.
"""

from __future__ import annotations

import hashlib
import sys
import urllib.request
from pathlib import Path

SOURCES = {
    "inputs/bmiagerev.csv": ("https://www.cdc.gov/growthcharts/data/zscore/bmiagerev.csv", b"Sex,Agemos,L,M,S,P3,"),
    "inputs/bmi-age-2022.csv": ("https://www.cdc.gov/growthcharts/data/extended-bmi/bmi-age-2022.csv", b"sex,agemos,L,M,S,sigma,"),
}


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: fetch_input.py <folder that holds inputs/>", file=sys.stderr)
        return 2
    for target, (source, start) in SOURCES.items():
        request = urllib.request.Request(source, headers={"User-Agent": "developerdojo-health-pathway-fetch"})
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                if response.status != 200:
                    print(f"{source}: HTTP {response.status}", file=sys.stderr)
                    return 1
                body = response.read()
        except OSError as error:
            print(f"{source}: download failed: {error}", file=sys.stderr)
            return 1
        if not body.startswith(start) or not body.endswith(b"\r\n"):
            print(f"{source}: unexpected content, first bytes {body[:60]!r}", file=sys.stderr)
            return 1
        path = Path(argv[1]) / target
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(body)
        print(f"{target} {len(body)} bytes sha256 {hashlib.sha256(body).hexdigest()}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
