"""Media pathway (Developer Dojo): from a recording to a measured, normalised programme loudness.

    python -I tools/media_pathway.py <pathway folder> <output folder>

Standard library only. The method is Recommendation ITU-R BS.1770-5 (11/2023): K-weighting (Tables 1 and 2),
channel weights (Table 3), 400 ms gating blocks with 75 % overlap and the -70 LKFS absolute and -10 LU relative
gates (equations 1 to 7), and the true-peak algorithm of Annex 2. Momentary (0.4 s) and short-term (3 s) loudness
are the sliding windows of EBU Tech 3341 (V4, November 2023), and the target is EBU R 128 (V5, November 2023):
-23.0 LUFS, a maximum true peak of -1 dBTP.

Before it measures anything else, the script synthesizes the EBU Tech 3341 minimum-requirements test signals that
are defined by their tones (Table 1: cases 1 to 6, 9, 10, 12 and 13; true peak: cases 15 to 19) and checks its own
meter against the expected responses and tolerances Tech 3341 publishes. If any falls outside, it exits with an
error and writes nothing. Then it writes:

- inspection.json: the structure of the NASA recording and its sample-level statistics (MED-001);
- loudness.json and loudness-series.csv: integrated, momentary and short-term loudness and true peak (MED-002);
- normalisation.json: the gain R 128 asks for, what it does to the true peak, and the peak-limited alternative
  (MED-003);
- randori/cards.json: the Randori cards recomputed;
- reference-checks.json, manifest.json and summary.md.

The meter is written for 48 kHz, the sample rate the BS.1770-5 coefficients are published for; it refuses any
other. The input is NASA's public-domain launch recording, unchanged; see tools/fetch_input.py.
"""

from __future__ import annotations

import hashlib
import json
import math
import shutil
import sys
import wave
from array import array
from pathlib import Path

INPUT = "inputs/artemis-ii-launch-pad-camera-site-4.wav"
RATE = 48000

# Rec. ITU-R BS.1770-5, Table 1 (stage 1, the head model) and Table 2 (stage 2, the high-pass), at 48 kHz.
STAGE1 = (1.53512485958697, -2.69169618940638, 1.19839281085285, -1.69065929318241, 0.73248077421585)
STAGE2 = (1.0, -2.0, 1.0, -1.99004745483398, 0.99007225036621)
# Table 3: L, R, C, Ls, Rs. A recording with fewer channels uses the first ones (mono and stereo are front channels).
CHANNEL_WEIGHTS = (1.0, 1.0, 1.0, 1.41, 1.41)
ABSOLUTE_GATE = -70.0
RELATIVE_GATE = -10.0
BLOCK = round(0.4 * RATE)  # gating block and momentary window, 400 ms
STEP = BLOCK // 4  # 75 % overlap, 100 ms
SHORT = 3 * RATE  # short-term window, 3 s

# Annex 2: the order-48, 4-phase FIR interpolating filter, one column per phase.
TRUE_PEAK_PHASES = (
    (0.0017089843750, 0.0109863281250, -0.0196533203125, 0.0332031250000, -0.0594482421875, 0.1373291015625,
     0.9721679687500, -0.1022949218750, 0.0476074218750, -0.0266113281250, 0.0148925781250, -0.0083007812500),
    (-0.0291748046875, 0.0292968750000, -0.0517578125000, 0.0891113281250, -0.1665039062500, 0.4650878906250,
     0.7797851562500, -0.2003173828125, 0.1015625000000, -0.0582275390625, 0.0330810546875, -0.0189208984375),
    (-0.0189208984375, 0.0330810546875, -0.0582275390625, 0.1015625000000, -0.2003173828125, 0.7797851562500,
     0.4650878906250, -0.1665039062500, 0.0891113281250, -0.0517578125000, 0.0292968750000, -0.0291748046875),
    (-0.0083007812500, 0.0148925781250, -0.0266113281250, 0.0476074218750, -0.1022949218750, 0.9721679687500,
     0.1373291015625, -0.0594482421875, 0.0332031250000, -0.0196533203125, 0.0109863281250, 0.0017089843750),
)

# EBU R 128 (2023): the target level and its tolerance for programmes that are not live, and the maximum true peak.
TARGET_LUFS = -23.0
TARGET_TOLERANCE_LU = 0.5
MAX_TRUE_PEAK_DBTP = -1.0


class ReferenceMismatch(Exception):
    """A Tech 3341 test signal did not give the published response within its tolerance."""


def fixed(value: float, decimals: int) -> str:
    """A value at a fixed number of decimals, never '-0.00'; minus infinity as '-inf'."""
    if value == -math.inf:
        return "-inf"
    text = f"{value:.{decimals}f}"
    return text[1:] if text.startswith("-") and float(text) == 0 else text


def db(power_or_amplitude: float, factor: float) -> float:
    return factor * math.log10(power_or_amplitude) if power_or_amplitude > 0 else -math.inf


# ---------------------------------------------------------------- the meter (BS.1770-5)

def k_weighted_energy(samples: array) -> array:
    """K-weight one channel (two biquads, transposed direct form II) and return the running sum of y squared,
    prefix[i] = sum of y[0..i-1]^2, so any window's mean square is one subtraction."""
    b10, b11, b12, a11, a12 = STAGE1
    b20, b21, b22, a21, a22 = STAGE2
    s11 = s12 = s21 = s22 = 0.0
    total = 0.0
    prefix = array("d", [0.0])
    append = prefix.append
    for x in samples:
        y1 = b10 * x + s11
        s11 = b11 * x - a11 * y1 + s12
        s12 = b12 * x - a12 * y1
        y2 = b20 * y1 + s21
        s21 = b21 * y1 - a21 * y2 + s22
        s22 = b22 * y1 - a22 * y2
        total += y2 * y2
        append(total)
    return prefix


class Meter:
    """BS.1770-5 loudness of one programme: K-weighted energy per channel, weighted by Table 3."""

    def __init__(self, channels: list[array], gain_db: float = 0.0, k_weighting: bool = True) -> None:
        if not 1 <= len(channels) <= 5:
            raise ValueError(f"BS.1770-5 measures one to five channels, not {len(channels)}")
        self.frames = len(channels[0])
        scale = 10.0 ** (gain_db / 20.0)
        self.prefixes: list[array] = []
        for samples in channels:
            scaled = samples if scale == 1.0 else array("d", (s * scale for s in samples))
            self.prefixes.append(k_weighted_energy(scaled) if k_weighting else unweighted_energy(scaled))
        self.weights = CHANNEL_WEIGHTS[: len(channels)]

    def loudness(self, start: int, end: int) -> float:
        """Equation 4: -0.691 + 10 log10 of the weighted sum of the channels' mean squares over [start, end)."""
        power = sum(g * (p[end] - p[start]) for g, p in zip(self.weights, self.prefixes)) / (end - start)
        return -0.691 + db(power, 10.0)

    def gated(self, relative: bool = True) -> dict[str, float]:
        """Equations 5 to 7: the integrated (gated) loudness."""
        block_starts = list(range(0, self.frames - BLOCK + 1, STEP))
        levels = [self.loudness(s, s + BLOCK) for s in block_starts]
        above_absolute = [i for i, level in enumerate(levels) if level > ABSOLUTE_GATE]
        if not above_absolute:
            return {"integrated": -math.inf, "relativeGate": -math.inf, "blocks": len(levels), "blocksUsed": 0}
        absolute_gated = self._mean_loudness(block_starts, above_absolute)
        gate = absolute_gated + RELATIVE_GATE
        used = [i for i in above_absolute if levels[i] > gate] if relative else above_absolute
        return {"integrated": self._mean_loudness(block_starts, used), "relativeGate": gate if relative else -math.inf, "blocks": len(levels), "blocksUsed": len(used)}

    def _mean_loudness(self, block_starts: list[int], indices: list[int]) -> float:
        """Equation 5: -0.691 + 10 log10 of the weighted channel sum of the mean of the blocks' mean squares."""
        total = 0.0
        for g, p in zip(self.weights, self.prefixes):
            total += g * sum(p[block_starts[i] + BLOCK] - p[block_starts[i]] for i in indices) / (BLOCK * len(indices))
        return -0.691 + db(total, 10.0)

    def window(self, length: int, first_end: int | None = None) -> list[float]:
        """A sliding window's loudness ending at every sample from first_end (default: the first full window)."""
        first = length if first_end is None else max(first_end, length)
        return [self.loudness(end - length, end) for end in range(first, self.frames + 1)]

    def window_at_steps(self, length: int) -> list[tuple[float, float]]:
        """The window's loudness every 100 ms, as (time of the window's end in s, loudness)."""
        return [(end / RATE, self.loudness(end - length, end)) for end in range(length, self.frames + 1, STEP)]


def unweighted_energy(samples: array) -> array:
    """The running sum of x squared with no K-weighting (used only by a Randori card)."""
    total = 0.0
    prefix = array("d", [0.0])
    append = prefix.append
    for x in samples:
        total += x * x
        append(total)
    return prefix


def true_peak(samples: array) -> float:
    """Annex 2: 4x over-sampling through the 4-phase interpolating filter, then the largest absolute value, in dBTP.
    The calculation is in floating point, so the 12.04 dB attenuation and its compensation cancel and are left out."""
    peak = 0.0
    history = [0.0] * 12
    for x in samples:
        history.pop()
        history.insert(0, x)
        for phase in TRUE_PEAK_PHASES:
            value = abs(sum(h * v for h, v in zip(phase, history)))
            if value > peak:
                peak = value
    return db(peak, 20.0)


def sample_peak(samples: array) -> float:
    return db(max((abs(x) for x in samples), default=0.0), 20.0)


# ---------------------------------------------------------------- Tech 3341 test signals

def tone(seconds: float, dbfs: float, frequency: float = 1000.0) -> array:
    """A sine at a per-channel peak level in dBFS, starting at phase 0."""
    amplitude = 10.0 ** (dbfs / 20.0)
    w = 2.0 * math.pi * frequency / RATE
    return array("d", (amplitude * math.sin(w * n) for n in range(round(seconds * RATE))))


def silence(seconds: float) -> array:
    return array("d", bytes(8 * round(seconds * RATE)))


def joined(*parts: array) -> array:
    out = array("d")
    for part in parts:
        out.extend(part)
    return out


def peak_tone(frequency: float, amplitude: float, phase_degrees: float) -> array:
    """True-peak test tones (cases 15 to 19): 1 s with a 10 ms linear fade-in and fade-out. Tech 3341 says the
    duration does not matter and asks for a taper without fixing its shape."""
    n = RATE
    fade = round(0.01 * RATE)
    phase = math.radians(phase_degrees)
    w = 2.0 * math.pi * frequency / RATE
    out = array("d")
    for i in range(n):
        taper = min(1.0, i / fade, (n - 1 - i) / fade)
        out.append(taper * amplitude * math.sin(w * i + phase))
    return out


def check(checks: list[dict[str, object]], cid: str, case: int, quantity: str, expected: float, low: float, high: float, computed: float, unit: str) -> None:
    ok = expected + low - 1e-9 <= computed <= expected + high + 1e-9
    tolerance = f"+/-{high:.1f}" if low == -high else f"+{high:.1f}/{low:.1f}"
    entry: dict[str, object] = {"id": cid, "case": case, "quantity": quantity, "expected": f"{fixed(expected, 1)} {tolerance} {unit}", "computed": f"{fixed(computed, 2)} {unit}", "status": "pass" if ok else "fail"}
    checks.append(entry)
    if not ok:
        raise ReferenceMismatch(f"{cid} (Tech 3341 case {case}, {quantity}): expected {entry['expected']}, computed {entry['computed']}")


def stereo(signal: array) -> list[array]:
    """Tech 3341: the signal applied in phase to both channels."""
    return [signal, array("d", signal)]


def reference_checks() -> list[dict[str, object]]:
    checks: list[dict[str, object]] = []
    tol = (-0.1, 0.1)

    for case, level in ((1, -23.0), (2, -33.0)):
        meter = Meter(stereo(tone(20, level)))
        check(checks, f"case{case}-M", case, "Momentary loudness, highest", level, *tol, max(meter.window(BLOCK)), "LUFS")
        check(checks, f"case{case}-S", case, "Short-term loudness, highest", level, *tol, max(meter.window(SHORT)), "LUFS")
        check(checks, f"case{case}-I", case, "Integrated loudness", level, *tol, meter.gated()["integrated"], "LUFS")

    integrated_cases = {
        3: joined(tone(10, -36), tone(60, -23), tone(10, -36)),
        4: joined(tone(10, -72), tone(10, -36), tone(60, -23), tone(10, -36), tone(10, -72)),
        5: joined(tone(20, -26), tone(20.1, -20), tone(20, -26)),
    }
    for case, signal in integrated_cases.items():
        check(checks, f"case{case}-I", case, "Integrated loudness", -23.0, *tol, Meter(stereo(signal)).gated()["integrated"], "LUFS")
    five = [tone(20, -28), tone(20, -28), tone(20, -24), tone(20, -30), tone(20, -30)]  # L, R, C, Ls, Rs
    check(checks, "case6-I", 6, "Integrated loudness, 5.0 channels", -23.0, *tol, Meter(five).gated()["integrated"], "LUFS")

    case9 = Meter(stereo(joined(*[joined(tone(1.34, -20), tone(1.66, -30)) for _ in range(5)])))
    s_after = case9.window(SHORT, first_end=3 * RATE)
    check(checks, "case9-S-low", 9, "Short-term loudness after 3 s, lowest", -23.0, *tol, min(s_after), "LUFS")
    check(checks, "case9-S-high", 9, "Short-term loudness after 3 s, highest", -23.0, *tol, max(s_after), "LUFS")

    for i in range(20):
        meter = Meter(stereo(joined(silence(i * 0.15), tone(3, -23), silence(1))))
        check(checks, f"case10-{i:02d}", 10, f"Short-term loudness, highest, segment {i + 1} of 20", -23.0, *tol, max(meter.window(SHORT)), "LUFS")

    case12 = Meter(stereo(joined(*[joined(tone(0.18, -20), tone(0.22, -30)) for _ in range(25)])))
    m_after = case12.window(BLOCK, first_end=RATE)
    check(checks, "case12-M-low", 12, "Momentary loudness after 1 s, lowest", -23.0, *tol, min(m_after), "LUFS")
    check(checks, "case12-M-high", 12, "Momentary loudness after 1 s, highest", -23.0, *tol, max(m_after), "LUFS")

    for i in range(20):
        meter = Meter(stereo(joined(silence(i * 0.02), tone(0.4, -23), silence(1))))
        check(checks, f"case13-{i:02d}", 13, f"Momentary loudness, highest, segment {i + 1} of 20", -23.0, *tol, max(meter.window(BLOCK)), "LUFS")

    peak_cases = {15: (RATE / 4, 0.50, 0.0, -6.0), 16: (RATE / 4, 0.50, 45.0, -6.0), 17: (RATE / 6, 0.50, 60.0, -6.0), 18: (RATE / 8, 0.50, 67.5, -6.0), 19: (RATE / 4, 1.41, 45.0, 3.0)}
    for case, (frequency, amplitude, phase, expected) in peak_cases.items():
        signal = peak_tone(frequency, amplitude, phase)
        check(checks, f"case{case}-TP", case, "Maximum true-peak level", expected, -0.4, 0.2, max(true_peak(c) for c in stereo(signal)), "dBTP")
    return checks


# ---------------------------------------------------------------- the recording

def read_wav(path: Path) -> tuple[dict[str, object], list[array], bytes]:
    raw = path.read_bytes()
    try:
        with wave.open(str(path), "rb") as reader:
            channels, width, rate, frames = reader.getnchannels(), reader.getsampwidth(), reader.getframerate(), reader.getnframes()
            data = reader.readframes(frames)
    except (wave.Error, EOFError) as error:
        raise ValueError(f"{path}: not a readable PCM WAV file: {error}") from error
    if width != 2:
        raise ValueError(f"{path}: expected 16-bit samples, found {8 * width}-bit")
    if rate != RATE:
        raise ValueError(f"{path}: the BS.1770-5 coefficients are published for {RATE} Hz; this file is {rate} Hz")
    pcm = array("h")
    pcm.frombytes(data)
    if sys.byteorder != "little":
        pcm.byteswap()
    split = [array("d", (s / 32768.0 for s in pcm[c::channels])) for c in range(channels)]
    header = {"format": "PCM WAV (RIFF), integer samples", "channels": channels, "sampleRate_Hz": rate, "bitsPerSample": 8 * width, "frames": frames, "duration_s": fixed(frames / rate, 3), "bytes": len(raw)}
    return header, split, raw


def inspect(header: dict[str, object], channels: list[array], raw_pcm: list[array]) -> dict[str, object]:
    names = ["left", "right", "centre", "left surround", "right surround"][: len(channels)]
    per_channel = []
    for name, samples, ints in zip(names, channels, raw_pcm):
        n = len(samples)
        mean = math.fsum(samples) / n
        rms = math.sqrt(math.fsum(x * x for x in samples) / n)
        per_channel.append({
            "channel": name,
            "samplePeak_dBFS": fixed(sample_peak(samples), 2),
            "rms_dBFS": fixed(db(rms, 20.0), 2),
            "dcOffset_percentFS": fixed(100 * mean, 4),
            "samplesAtFullScale": sum(1 for s in ints if s in (32767, -32768)),
        })
    identical = len(channels) > 1 and all(channels[0] == other for other in channels[1:])
    return {"header": header, "channels": per_channel, "channelsIdentical": identical}


def int_channels(path: Path, count: int) -> list[array]:
    with wave.open(str(path), "rb") as reader:
        pcm = array("h")
        pcm.frombytes(reader.readframes(reader.getnframes()))
    if sys.byteorder != "little":
        pcm.byteswap()
    return [pcm[c::count] for c in range(count)]


def build(folder: Path, out: Path) -> None:
    checks = reference_checks()

    source = folder / INPUT
    try:
        header, channels, raw = read_wav(source)
    except OSError as error:
        raise SystemExit(f"{source}: cannot read the input: {error}")
    inspection = inspect(header, channels, int_channels(source, len(channels)))

    meter = Meter(channels)
    gated = meter.gated()
    momentary = meter.window_at_steps(BLOCK)
    short = meter.window_at_steps(SHORT)
    peaks = [true_peak(c) for c in channels]
    sample_peaks = [sample_peak(c) for c in channels]
    integrated = gated["integrated"]
    tp = max(peaks)
    loudness = {
        "integrated_LUFS": fixed(integrated, 2),
        "relativeGate_LUFS": fixed(gated["relativeGate"], 2),
        "gatingBlocks": gated["blocks"],
        "gatingBlocksUsed": gated["blocksUsed"],
        "maxMomentary_LUFS": fixed(max(meter.window(BLOCK)), 2),
        "maxShortTerm_LUFS": fixed(max(meter.window(SHORT)), 2),
        "truePeak_dBTP": {name["channel"]: fixed(p, 2) for name, p in zip(inspection["channels"], peaks)},
        "samplePeak_dBFS": {name["channel"]: fixed(p, 2) for name, p in zip(inspection["channels"], sample_peaks)},
        "maxTruePeak_dBTP": fixed(tp, 2),
        "truePeakAboveSamplePeak_dB": fixed(tp - max(sample_peaks), 2),
    }
    series = ["time_s,momentary_LUFS,shortTerm_LUFS"]
    short_at = {round(t * 10): level for t, level in short}
    for t, level in momentary:
        s = short_at.get(round(t * 10))
        series.append(f"{t:.1f},{fixed(level, 2)},{'' if s is None else fixed(s, 2)}")

    gain = TARGET_LUFS - integrated
    normalised = Meter(channels, gain_db=gain).gated()["integrated"]
    tp_after = tp + gain
    peak_room = MAX_TRUE_PEAK_DBTP - tp
    limited = min(gain, peak_room)
    normalisation = {
        "target_LUFS": fixed(TARGET_LUFS, 1),
        "toleranceNotLive_LU": fixed(TARGET_TOLERANCE_LU, 1),
        "maxTruePeak_dBTP": fixed(MAX_TRUE_PEAK_DBTP, 1),
        "measured_LUFS": fixed(integrated, 2),
        "withinToleranceAsDelivered": abs(integrated - TARGET_LUFS) <= TARGET_TOLERANCE_LU,
        "gain_dB": fixed(gain, 2),
        "remeasuredAfterGain_LUFS": fixed(normalised, 2),
        "truePeakAfterGain_dBTP": fixed(tp_after, 2),
        "truePeakWithinLimitAfterGain": tp_after <= MAX_TRUE_PEAK_DBTP,
        "gainAllowedByTruePeak_dB": fixed(peak_room, 2),
        "gainOnlyResult": {
            "gain_dB": fixed(limited, 2),
            "loudness_LUFS": fixed(integrated + limited, 2),
            "truePeak_dBTP": fixed(tp + limited, 2),
            "meetsTarget": abs(integrated + limited - TARGET_LUFS) <= TARGET_TOLERANCE_LU,
        },
    }

    unweighted = Meter(channels, k_weighting=False).gated()["integrated"]
    ungated = meter.gated(relative=False)["integrated"]
    mono = Meter(channels[:1]).gated()["integrated"]
    cards = {
        "A": {"title": "Leave out the K-weighting: the same gates on the plain mean square", "integrated_LUFS": fixed(unweighted, 2), "changeFromBS1770_LU": fixed(unweighted - integrated, 2)},
        "B": {"title": "Leave out the relative gate: only the -70 LUFS absolute gate", "integrated_LUFS": fixed(ungated, 2), "changeFromBS1770_LU": fixed(ungated - integrated, 2)},
        "C": {"title": "Deliver the left channel alone as a mono file (the two channels are identical)", "integrated_LUFS": fixed(mono, 2), "changeFromBS1770_LU": fixed(mono - integrated, 2), "gainToTarget_dB": fixed(TARGET_LUFS - mono, 2), "truePeakAfterThatGain_dBTP": fixed(peaks[0] + TARGET_LUFS - mono, 2)},
    }

    if out.exists():
        shutil.rmtree(out)
    (out / "randori").mkdir(parents=True)

    def write_json(name: str, value: object) -> None:
        (out / name).write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    passed = len(checks)
    write_json("reference-checks.json", {"source": "EBU Tech 3341 (V4, November 2023), minimum requirements test signals; ITU-R BS.1770-5", "passed": passed, "failed": 0, "checks": checks})
    write_json("inspection.json", inspection)
    write_json("loudness.json", loudness)
    write_json("normalisation.json", normalisation)
    write_json("randori/cards.json", cards)
    (out / "loudness-series.csv").write_text("\n".join(series) + "\n", encoding="utf-8")

    first = inspection["channels"][0]
    lines = [
        "# Media pathway results",
        "",
        "Computed by `tools/media_pathway.py` with the method of Recommendation ITU-R BS.1770-5, the EBU Mode meter of",
        "EBU Tech 3341 and the target of EBU R 128. This is practice on NASA's own launch recording, not a broadcast",
        "compliance check of any real programme.",
        "",
        f"- Reference checks: {passed} of {passed} EBU Tech 3341 test responses reproduced within their published tolerances",
        "  (loudness cases 1 to 6, 9, 10, 12 and 13; true-peak cases 15 to 19).",
        f"- The recording: {header['channels']} channels, {header['sampleRate_Hz']} Hz, {header['bitsPerSample']}-bit, {header['duration_s']} s;"
        f" left sample peak {first['samplePeak_dBFS']} dBFS, {sum(c['samplesAtFullScale'] for c in inspection['channels'])} samples at full scale.",
        f"- Loudness: integrated {loudness['integrated_LUFS']} LUFS ({gated['blocksUsed']} of {gated['blocks']} blocks used), highest momentary"
        f" {loudness['maxMomentary_LUFS']}, highest short-term {loudness['maxShortTerm_LUFS']} LUFS; true peak {loudness['maxTruePeak_dBTP']} dBTP.",
        f"- R 128: a gain of {normalisation['gain_dB']} dB reaches {normalisation['remeasuredAfterGain_LUFS']} LUFS with the true peak at"
        f" {normalisation['truePeakAfterGain_dBTP']} dBTP ({'within' if normalisation['truePeakWithinLimitAfterGain'] else 'over'} the -1 dBTP limit).",
        "- Randori cards: " + "; ".join(f"{k} " + ", ".join(f"{key} {value}" for key, value in v.items() if key != "title") for k, v in cards.items()) + ".",
        "",
    ]
    (out / "summary.md").write_text("\n".join(lines), encoding="utf-8")

    outputs = sorted(p.relative_to(out).as_posix() for p in out.rglob("*") if p.is_file()) + ["manifest.json"]
    write_json("manifest.json", {
        "script": "tools/media_pathway.py",
        "python": f"{sys.version_info.major}.{sys.version_info.minor}",
        "inputs": {INPUT: hashlib.sha256(raw).hexdigest()},
        "method": {
            "referenceChecks": "EBU Tech 3341 (V4, 2023) Table 1 cases 1-6, 9, 10, 12, 13 and true-peak cases 15-19, synthesized at 48 kHz",
            "loudness": "ITU-R BS.1770-5: K-weighting (Tables 1 and 2), channel weights (Table 3), 400 ms blocks with 75 % overlap, gates at -70 LKFS and -10 LU (equations 1-7)",
            "windows": "EBU Tech 3341: momentary 0.4 s and short-term 3 s sliding rectangular windows, ungated; highest values over every sample position",
            "truePeak": "ITU-R BS.1770-5 Annex 2: 4x over-sampling with the order-48, 4-phase interpolating filter, in floating point",
            "normalisation": "EBU R 128 (V5, 2023): target -23.0 LUFS, +/-0.5 LU for programmes that are not live, maximum true peak -1 dBTP",
        },
        "outputs": sorted(outputs),
    })


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: media_pathway.py <pathway folder> <output folder>", file=sys.stderr)
        return 2
    try:
        build(Path(argv[1]), Path(argv[2]))
    except ReferenceMismatch as error:
        print(f"EBU Tech 3341 test responses did not reproduce; nothing written: {error}", file=sys.stderr)
        return 1
    except (ValueError, ArithmeticError) as error:
        print(f"media pathway: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
