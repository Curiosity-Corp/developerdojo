"""Fetch the media pathway's input (Developer Dojo maintainers only; CI never runs this).

    python -I tools/fetch_input.py .

Downloads NASA's Artemis II launch recording from Pad Camera Site 4 (a US government work in the public domain) from
Wikimedia Commons and writes it to inputs/, byte for byte. It checks the SHA-1 Commons publishes for the file and
that the file is 48 kHz, 16-bit PCM WAV, then prints its SHA-256. If the file changes, update the pack record
(src/data/sector-packs.ts), the tests and the generated files together, and never edit the written bytes.
"""

from __future__ import annotations

import hashlib
import io
import sys
import urllib.request
import wave
from pathlib import Path

SOURCE = (
    "https://upload.wikimedia.org/wikipedia/commons/d/d9/Artemis_II_Live_Launch_Coverage_-_Pad_Camera_Site_4_"
    "%28KSC-20260401-AU-LMM01-0001-Artemis_II_Live_Launch_Coverage_Pad_Camera_Site_4%29.wav"
)
COMMONS_SHA1 = "b05c096ee0279ce700741f0852dea19f80038b4e"
TARGET = "inputs/artemis-ii-launch-pad-camera-site-4.wav"


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: fetch_input.py <folder that holds inputs/>", file=sys.stderr)
        return 2
    request = urllib.request.Request(SOURCE, headers={"User-Agent": "developerdojo-media-pathway-fetch"})
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            if response.status != 200:
                print(f"{SOURCE}: HTTP {response.status}", file=sys.stderr)
                return 1
            body = response.read()
    except OSError as error:
        print(f"{SOURCE}: download failed: {error}", file=sys.stderr)
        return 1
    sha1 = hashlib.sha1(body).hexdigest()
    if sha1 != COMMONS_SHA1:
        print(f"{SOURCE}: SHA-1 {sha1} differs from the one Commons published, {COMMONS_SHA1}", file=sys.stderr)
        return 1
    try:
        with wave.open(io.BytesIO(body), "rb") as reader:
            params = (reader.getnchannels(), reader.getsampwidth(), reader.getframerate())
    except (wave.Error, EOFError) as error:
        print(f"{SOURCE}: not a readable PCM WAV file: {error}", file=sys.stderr)
        return 1
    if params != (2, 2, 48000):
        print(f"{SOURCE}: expected 2 channels, 16-bit, 48000 Hz; found {params}", file=sys.stderr)
        return 1
    target = Path(argv[1]) / TARGET
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(body)
    print(f"{TARGET} {len(body)} bytes sha256 {hashlib.sha256(body).hexdigest()}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
