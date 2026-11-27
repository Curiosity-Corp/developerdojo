"""Fetch the robotics pathway's inputs (Developer Dojo maintainers only; CI never runs this).

    python -I tools/fetch_input.py .

Downloads, at one pinned commit of the Universal Robots ROS 2 Description, the UR5 kinematics file and the
repository's licence, writes them to inputs/ byte for byte and prints the SHA-256 of each. To move to a later commit,
change COMMIT, rerun, and update the pack record (src/data/sector-packs.ts), the tests and the generated files
together; never edit the written bytes.
"""

from __future__ import annotations

import hashlib
import sys
import urllib.request
from pathlib import Path

COMMIT = "0eb1a861f7772fceb38510d90fa2f98ec668070c"
BASE = f"https://raw.githubusercontent.com/UniversalRobots/Universal_Robots_ROS2_Description/{COMMIT}/"
SOURCES = {
    "inputs/ur5-default-kinematics.yaml": (BASE + "config/ur5/default_kinematics.yaml", b"kinematics:\n"),
    "inputs/ur-description-LICENSE.txt": (BASE + "LICENSE", b"Redistribution and use in source and binary forms"),
}


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: fetch_input.py <folder that holds inputs/>", file=sys.stderr)
        return 2
    for target, (source, start) in SOURCES.items():
        request = urllib.request.Request(source, headers={"User-Agent": "developerdojo-robotics-pathway-fetch"})
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                if response.status != 200:
                    print(f"{source}: HTTP {response.status}", file=sys.stderr)
                    return 1
                body = response.read()
        except OSError as error:
            print(f"{source}: download failed: {error}", file=sys.stderr)
            return 1
        if not body.startswith(start):
            print(f"{source}: unexpected content, first bytes {body[:60]!r}", file=sys.stderr)
            return 1
        path = Path(argv[1]) / target
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(body)
        print(f"{target} {len(body)} bytes sha256 {hashlib.sha256(body).hexdigest()}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
