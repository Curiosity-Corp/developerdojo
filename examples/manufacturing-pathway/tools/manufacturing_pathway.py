"""Manufacturing pathway (Developer Dojo): from a process record to control limits and the sources of variation.

    python -I tools/manufacturing_pathway.py <pathway folder> <output folder>

Standard library only. The methods are those of the NIST/SEMATECH e-Handbook of Statistical Methods, chapter 6
(Process or Product Monitoring and Control). The script first reproduces values the handbook publishes:

- the numerical summary of the lithography case study (section 6.6.1.2) and its nested analysis of variance and
  variance components (section 6.6.1.3), from the case study's own data;
- the factor table for X-bar and R charts (A2, D3 and D4 for n = 2 to 10, section 6.3.2.1), worked out from the
  distribution of the range of normal samples, and the c4 factor example (section 6.3.2);
- the individuals chart example (section 6.3.2.2);
- the capability index example and the table that translates Cp into rejects (section 6.1.6).

If any differs, it exits with an error and writes nothing. Then it writes:

- inspection.json: the structure of the lithography record and its numerical summary (MFG-001);
- control-limits.json and subgroups.csv: Shewhart X-bar and s, and R, limits with the wafer as the subgroup, and an
  individuals chart on the cassette means (MFG-002);
- variation.json: the nested analysis of variance, the variance components and what they mean for the sigma a
  capability index uses (MFG-003);
- randori/cards.json: the Randori cards recomputed;
- manifest.json and summary.md.

The input is the 450 data rows of the handbook's file LITHOGRA.DAT, unchanged; see tools/fetch_input.py.
The handbook is a NIST publication; the published values below are named by the section that prints them.
"""

from __future__ import annotations

import csv
import hashlib
import io
import json
import math
import shutil
import statistics
import sys
from collections import defaultdict
from pathlib import Path

INPUT = "inputs/lithogra-data-rows.dat"
SITES = {1: "Top", 2: "Left", 3: "Center", 4: "Right", 5: "Bottom"}
# The individuals chart example of section 6.3.2.2: flow rates of the first 10 batches of a new process.
FLOW_RATES = [49.6, 47.6, 49.9, 51.3, 47.8, 51.2, 52.6, 52.4, 53.6, 52.1]


class ReferenceMismatch(Exception):
    """A value the handbook publishes did not reproduce."""


def fixed(value: float, decimals: int) -> str:
    """A value at a fixed number of decimals, never '-0.000'."""
    text = f"{value:.{decimals}f}"
    return text[1:] if text.startswith("-") and float(text) == 0 else text


# ---------------------------------------------------------------- reading the record

def read_rows(raw: bytes) -> list[dict[str, object]]:
    try:
        text = raw.decode("ascii")
    except UnicodeDecodeError as error:
        raise ValueError(f"{INPUT}: not plain ASCII: {error}") from error
    rows = []
    for number, line in enumerate(text.splitlines(), start=1):
        fields = line.split()
        if len(fields) != 6:
            raise ValueError(f"{INPUT} line {number}: expected 6 columns, found {len(fields)}")
        try:
            cassette, wafer, site, width, sequence, cleaned = (float(field) for field in fields)
        except ValueError as error:
            raise ValueError(f"{INPUT} line {number}: {error}") from error
        rows.append({"cassette": int(cassette), "wafer": int(wafer), "site": int(site), "width": width, "sequence": int(sequence), "cleaned": cleaned})
    return rows


def inspect(rows: list[dict[str, object]]) -> dict[str, object]:
    cassettes = sorted({row["cassette"] for row in rows})
    wafers = defaultdict(set)
    sites = defaultdict(set)
    for row in rows:
        wafers[row["cassette"]].add(row["wafer"])
        sites[(row["cassette"], row["wafer"])].add(row["site"])
    problems = []
    if cassettes != list(range(1, 31)):
        problems.append("cassettes are not 1 to 30")
    if any(sorted(found) != [1, 2, 3] for found in wafers.values()):
        problems.append("a cassette does not have wafers 1, 2 and 3")
    if any(sorted(found) != [1, 2, 3, 4, 5] for found in sites.values()):
        problems.append("a wafer does not have the five sites")
    if [row["sequence"] for row in rows] != list(range(1, len(rows) + 1)):
        problems.append("the sequence numbers are not 1 to 450 in order")
    if problems:
        raise ValueError(f"{INPUT}: " + "; ".join(problems))
    return {"cassettes": len(cassettes), "wafersPerCassette": 3, "sitesPerWafer": 5, "rows": len(rows)}


def summary_statistics(values: list[float]) -> dict[str, float]:
    """The numerical summary of section 6.6.1.2. The autocorrelation is the lag-1 coefficient of section 1.3.5.12."""
    n = len(values)
    mean = sum(values) / n
    lag = sum((values[i] - mean) * (values[i + 1] - mean) for i in range(n - 1))
    total = sum((value - mean) ** 2 for value in values)
    return {
        "n": n, "mean": mean, "median": statistics.median(values), "minimum": min(values), "maximum": max(values),
        "range": max(values) - min(values), "standardDeviation": statistics.stdev(values), "autocorrelation": lag / total,
    }


def nested_anova(rows: list[dict[str, object]], column: str = "width") -> dict[str, dict[str, float]]:
    """Sums of squares for cassette, wafer within cassette and site within wafer (section 6.6.1.3)."""
    grand = sum(row[column] for row in rows) / len(rows)
    by_cassette: dict[int, list[float]] = defaultdict(list)
    by_wafer: dict[tuple[int, int], list[float]] = defaultdict(list)
    for row in rows:
        by_cassette[row["cassette"]].append(row[column])
        by_wafer[(row["cassette"], row["wafer"])].append(row[column])
    cassette_mean = {key: sum(values) / len(values) for key, values in by_cassette.items()}
    wafer_mean = {key: sum(values) / len(values) for key, values in by_wafer.items()}
    ss_cassette = sum(len(by_cassette[key]) * (mean - grand) ** 2 for key, mean in cassette_mean.items())
    ss_wafer = sum(len(by_wafer[key]) * (mean - cassette_mean[key[0]]) ** 2 for key, mean in wafer_mean.items())
    ss_site = sum((value - wafer_mean[key]) ** 2 for key, values in by_wafer.items() for value in values)
    df = {"cassette": len(by_cassette) - 1, "wafer": len(by_wafer) - len(by_cassette), "site": len(rows) - len(by_wafer)}
    ss = {"cassette": ss_cassette, "wafer": ss_wafer, "site": ss_site}
    ms = {key: ss[key] / df[key] for key in ss}
    sites, wafers = 5, 3
    components = {
        "site": ms["site"],
        "wafer": (ms["wafer"] - ms["site"]) / sites,
        "cassette": (ms["cassette"] - ms["wafer"]) / (sites * wafers),
    }
    return {"df": df, "ss": ss, "ms": ms, "components": components}


# ---------------------------------------------------------------- control chart factors

def normal_cdf(x: float) -> float:
    return 0.5 * math.erfc(-x / math.sqrt(2.0))


def normal_pdf(x: float) -> float:
    return math.exp(-x * x / 2.0) / math.sqrt(2.0 * math.pi)


def simpson(values: list[float], step: float) -> float:
    last = len(values) - 1
    if last % 2:
        raise ArithmeticError("Simpson's rule needs an even number of intervals")
    weights = (1 if i in (0, last) else 4 if i % 2 else 2 for i in range(last + 1))
    return step / 3.0 * sum(weight * value for weight, value in zip(weights, values))


def range_constants(n: int) -> tuple[float, float]:
    """d2 and d3 for samples of n from a normal distribution: the mean and standard deviation of the relative range W.

    d2 = integral of 1 - Phi(x)^n - (1 - Phi(x))^n over x; E[W^2] = 2 * integral of w (1 - F(w)) over w >= 0,
    with F(w) = n * integral of phi(x) (Phi(x + w) - Phi(x))^(n - 1) over x. Simpson's rule on |x| <= 8, w <= 12.
    """
    step = 0.01
    xs = [-8.0 + i * step for i in range(1601)]
    cdf = [normal_cdf(x) for x in xs]
    pdf = [normal_pdf(x) for x in xs]
    d2 = simpson([1.0 - p ** n - (1.0 - p) ** n for p in cdf], step)
    second_moment = []
    for j in range(1201):
        w = j * step
        below = n * simpson([pdf[i] * (normal_cdf(xs[i] + w) - cdf[i]) ** (n - 1) for i in range(len(xs))], step)
        second_moment.append(w * (1.0 - below))
    d3 = math.sqrt(2.0 * simpson(second_moment, step) - d2 * d2)
    return d2, d3


def c4(n: int) -> float:
    """Section 6.3.2: c4 = sqrt(2 / (n - 1)) * (n/2 - 1)! / ((n - 1)/2 - 1)!, with x! = Gamma(x + 1)."""
    return math.sqrt(2.0 / (n - 1)) * math.gamma(n / 2.0) / math.gamma((n - 1) / 2.0)


def chart_factors() -> dict[int, dict[str, float]]:
    factors = {}
    for n in range(2, 11):
        d2, d3 = range_constants(n)
        factors[n] = {"d2": d2, "d3": d3, "A2": 3.0 / (d2 * math.sqrt(n)), "D3": max(0.0, 1.0 - 3.0 * d3 / d2), "D4": 1.0 + 3.0 * d3 / d2, "c4": c4(n)}
    return factors


# ---------------------------------------------------------------- capability

def capability(usl: float, lsl: float, mean: float, sd: float) -> dict[str, float]:
    """Section 6.1.6."""
    cp = (usl - lsl) / (6 * sd)
    k = abs((usl + lsl) / 2 - mean) / ((usl - lsl) / 2)
    cpu = (usl - mean) / (3 * sd)
    cpl = (mean - lsl) / (3 * sd)
    return {"Cp": cp, "k": k, "Cpk": cp * (1 - k), "Cpu": cpu, "Cpl": cpl}


def rejects(cp: float) -> float:
    """Fraction outside both limits for a centred normal process: the limits sit 3 Cp standard deviations away."""
    return 2 * normal_cdf(-3 * cp)


# ---------------------------------------------------------------- reference checks

def check(checks: list[dict[str, object]], cid: str, source: str, quantity: str, published: str, computed: float, decimals: int, note: str | None = None) -> None:
    """Compare at the precision the handbook prints. A check with a note passes within one unit of the last printed
    digit; the note says why the printed value differs from what the handbook's own method gives."""
    shown = fixed(computed, decimals)
    unit = 10.0 ** -decimals
    ok = shown == published or (note is not None and abs(computed - float(published)) <= unit * (1 + 1e-9))
    entry: dict[str, object] = {"id": cid, "source": source, "quantity": quantity, "published": published, "computed": shown, "status": "pass" if ok else "fail"}
    if note:
        entry["note"] = note
    checks.append(entry)
    if not ok:
        raise ReferenceMismatch(f"{cid} ({source}, {quantity}): published {published}, computed {shown}")


PUBLISHED_FACTORS = {
    2: ("1.880", "0", "3.267"), 3: ("1.023", "0", "2.575"), 4: ("0.729", "0", "2.282"), 5: ("0.577", "0", "2.115"),
    6: ("0.483", "0", "2.004"), 7: ("0.419", "0.076", "1.924"), 8: ("0.373", "0.136", "1.864"),
    9: ("0.337", "0.184", "1.816"), 10: ("0.308", "0.223", "1.777"),
}


def reference_checks(summary: dict[str, float], anova: dict[str, dict[str, float]], factors: dict[int, dict[str, float]]) -> list[dict[str, object]]:
    checks: list[dict[str, object]] = []
    s = "Handbook 6.6.1.2"
    check(checks, "litho-n", s, "Sample size", "450", summary["n"], 0)
    for key, label in (("mean", "Mean"), ("median", "Median"), ("minimum", "Minimum"), ("maximum", "Maximum"), ("range", "Range"), ("standardDeviation", "Standard deviation"), ("autocorrelation", "Autocorrelation (lag 1)")):
        published = {"mean": "2.53228", "median": "2.45334", "minimum": "0.74655", "maximum": "5.16867", "range": "4.42212", "standardDeviation": "0.69376", "autocorrelation": "0.60726"}[key]
        check(checks, f"litho-{key}", s, label + ", micrometres" if key not in ("autocorrelation",) else label, published, summary[key], 5)
    s = "Handbook 6.6.1.3"
    for key, label, ss, ms in (("cassette", "Cassette", "127.40293", "4.3932"), ("wafer", "Wafer (cassette)", "25.52089", "0.4253"), ("site", "Site (cassette, wafer)", "63.17865", "0.1755")):
        check(checks, f"anova-ss-{key}", s, f"Sum of squares, {label}", ss, anova["ss"][key], 5)
        check(checks, f"anova-ms-{key}", s, f"Mean square, {label}", ms, anova["ms"][key], 4)
    for key, published, decimals in (("cassette", "0.2645", 4), ("wafer", "0.04997", 5), ("site", "0.1755", 4)):
        check(checks, f"component-{key}", s, f"Variance component, {key}", published, anova["components"][key], decimals)
    s = "Handbook 6.3.2.1"
    for n, (a2, d3, d4) in PUBLISHED_FACTORS.items():
        f = factors[n]
        check(checks, f"A2-{n}", s, f"A2, n = {n}", a2, f["A2"], 3)
        check(checks, f"D3-{n}", s, f"D3, n = {n}", d3, f["D3"], 3 if d3 != "0" else 0)
        note = None
        if n == 5:
            note = (f"The range distribution gives D4 = {f['D4']:.6f} (d2 = {f['d2']:.5f}, d3 = {f['d3']:.5f}), which rounds to "
                    f"{fixed(f['D4'], 3)}; the handbook prints 2.115. Accepted within one unit of the last printed digit.")
        check(checks, f"D4-{n}", s, f"D4, n = {n}", d4, f["D4"], 3, note)
    s = "Handbook 6.3.2"
    check(checks, "c4-10", s, "c4, n = 10", "0.9727", factors[10]["c4"], 4)
    check(checks, "factorial-3.5", s, "(3.5)!", "11.632", math.gamma(4.5), 3)
    s = "Handbook 6.3.2.2"
    mean = sum(FLOW_RATES) / len(FLOW_RATES)
    mr = sum(abs(b - a) for a, b in zip(FLOW_RATES, FLOW_RATES[1:])) / (len(FLOW_RATES) - 1)
    check(checks, "individuals-mean", s, "Mean flow rate", "50.81", mean, 2)
    check(checks, "individuals-MR", s, "Average moving range", "1.8778", mr, 4)
    check(checks, "individuals-d2", s, "d2 for n = 2", "1.128", factors[2]["d2"], 3)
    check(checks, "individuals-UCL", s, "Upper control limit", "55.8041", mean + 3 * mr / 1.128, 4)
    check(checks, "individuals-LCL", s, "Lower control limit", "45.8159", mean - 3 * mr / 1.128, 4)
    s = "Handbook 6.1.6"
    example = capability(20, 8, 16, 2)
    for key, published in (("Cp", "1.0"), ("k", "0.3333"), ("Cpk", "0.6667"), ("Cpu", "0.6667"), ("Cpl", "1.3333")):
        check(checks, f"capability-{key}", s, f"{key}, USL 20, LSL 8, mean 16, s 2", published, example[key], len(published.split(".")[1]))
    check(checks, "rejects-6", s, "Rejects at Cp 1.00 (limits 6 sigma apart), %", "0.27", rejects(1.0) * 100, 2)
    check(checks, "rejects-8", s, "Rejects at Cp 1.33 (limits 8 sigma apart), ppm", "64", rejects(4 / 3) * 1e6, 0,
          f"Limits 4 sigma either side leave 2 x Phi(-4) = {rejects(4 / 3) * 1e6:.1f} ppm outside, which rounds to "
          f"{rejects(4 / 3) * 1e6:.0f}; the handbook prints 64. Accepted within one unit of the last printed digit.")
    check(checks, "rejects-10", s, "Rejects at Cp 1.66 (limits 10 sigma apart), ppm", "0.6", rejects(5 / 3) * 1e6, 1)
    check(checks, "rejects-12", s, "Rejects at Cp 2.00 (limits 12 sigma apart), ppb", "2", rejects(2.0) * 1e9, 0)
    return checks


# ---------------------------------------------------------------- control limits

def subgroups(rows: list[dict[str, object]], key: str, column: str = "width") -> list[dict[str, object]]:
    groups: dict[tuple[int, ...], list[float]] = defaultdict(list)
    for row in rows:
        ident = (row["cassette"],) if key == "cassette" else (row["cassette"], row["wafer"])
        groups[ident].append(row[column])
    result = []
    for ident in sorted(groups):
        values = groups[ident]
        result.append({"id": ident, "n": len(values), "mean": sum(values) / len(values), "sd": statistics.stdev(values), "range": max(values) - min(values)})
    return result


def xbar_s_limits(groups: list[dict[str, object]]) -> dict[str, float]:
    """Section 6.3.2.1: X-bar and s chart from the average within-subgroup standard deviation."""
    n = groups[0]["n"]
    grand = sum(g["mean"] for g in groups) / len(groups)
    s_bar = sum(g["sd"] for g in groups) / len(groups)
    factor = c4(n)
    half = 3 * s_bar / (factor * math.sqrt(n))
    s_half = 3 * s_bar / factor * math.sqrt(1 - factor ** 2)
    return {"n": n, "center": grand, "sBar": s_bar, "c4": factor, "UCL": grand + half, "LCL": grand - half,
            "sUCL": s_bar + s_half, "sLCL": max(0.0, s_bar - s_half), "sigma": s_bar / factor}


def xbar_r_limits(groups: list[dict[str, object]], factors: dict[int, dict[str, float]]) -> dict[str, float]:
    """Section 6.3.2.1: X-bar and R chart, with the factors computed above (unrounded)."""
    n = groups[0]["n"]
    f = factors[n]
    grand = sum(g["mean"] for g in groups) / len(groups)
    r_bar = sum(g["range"] for g in groups) / len(groups)
    return {"n": n, "center": grand, "rBar": r_bar, "UCL": grand + f["A2"] * r_bar, "LCL": grand - f["A2"] * r_bar,
            "rUCL": f["D4"] * r_bar, "rLCL": f["D3"] * r_bar, "sigma": r_bar / f["d2"]}


def beyond(groups: list[dict[str, object]], limits: dict[str, float]) -> list[dict[str, object]]:
    return [g for g in groups if g["mean"] > limits["UCL"] or g["mean"] < limits["LCL"]]


def label(ident: tuple[int, ...]) -> str:
    return f"cassette {ident[0]}" + (f", wafer {ident[1]}" if len(ident) > 1 else "")


def individuals_limits(values: list[float]) -> dict[str, float]:
    """Section 6.3.2.2: individuals chart from the average moving range."""
    mean = sum(values) / len(values)
    mr = sum(abs(b - a) for a, b in zip(values, values[1:])) / (len(values) - 1)
    return {"center": mean, "MRbar": mr, "UCL": mean + 3 * mr / 1.128, "LCL": mean - 3 * mr / 1.128}


# ---------------------------------------------------------------- build

def build(folder: Path, out: Path) -> None:
    source = folder / INPUT
    try:
        raw = source.read_bytes()
    except OSError as error:
        raise SystemExit(f"{source}: cannot read the input: {error}")
    rows = read_rows(raw)
    structure = inspect(rows)
    widths = [row["width"] for row in rows]
    summary = summary_statistics(widths)
    anova = nested_anova(rows)
    factors = chart_factors()
    checks = reference_checks(summary, anova, factors)

    # MFG-001: the record.
    site_means = {SITES[site]: fixed(statistics.fmean(row["width"] for row in rows if row["site"] == site), 4) for site in SITES}
    inspection = {
        "source": "NIST/SEMATECH e-Handbook of Statistical Methods, section 6.6.1, data file LITHOGRA.DAT (data rows only)",
        "measurement": "Line width on a silicon wafer, micrometres",
        "structure": structure,
        "columns": ["cassette (1 to 30)", "wafer in the cassette (1 to 3)", "site (1 Top, 2 Left, 3 Center, 4 Right, 5 Bottom)", "line width, raw", "run sequence", "line width, cleaned"],
        "missing": 0,
        "summary": {key: (value if key == "n" else fixed(value, 5)) for key, value in summary.items()},
        "siteMeans": site_means,
        "lowestSite": min(site_means, key=lambda name: float(site_means[name])),
    }

    # MFG-002: control limits with the wafer as subgroup, and an individuals chart on the cassette means.
    wafer_groups = subgroups(rows, "wafer")
    xs = xbar_s_limits(wafer_groups)
    xr = xbar_r_limits(wafer_groups, factors)
    cassette_groups = subgroups(rows, "cassette")
    lot = individuals_limits([g["mean"] for g in cassette_groups])
    out_s = beyond(wafer_groups, xs)
    out_lot = beyond(cassette_groups, lot)
    s_high = [g for g in wafer_groups if g["sd"] > xs["sUCL"]]
    r_high = [g for g in wafer_groups if g["range"] > xr["rUCL"]]

    def limits_text(limits: dict[str, float], keys: tuple[str, ...]) -> dict[str, str]:
        return {key: fixed(limits[key], 4) for key in keys}

    control = {
        "subgroup": "wafer (5 sites), 90 subgroups",
        "xbarS": {**limits_text(xs, ("center", "sBar", "c4", "UCL", "LCL", "sUCL", "sLCL", "sigma")), "n": xs["n"],
                   "meansBeyondLimits": len(out_s), "sdAboveUCL": len(s_high)},
        "xbarR": {**limits_text(xr, ("center", "rBar", "UCL", "LCL", "rUCL", "rLCL", "sigma")), "n": xr["n"],
                   "meansBeyondLimits": len(beyond(wafer_groups, xr)), "rangeAboveUCL": len(r_high)},
        "lotMeans": {**limits_text(lot, ("center", "MRbar", "UCL", "LCL")), "points": len(cassette_groups),
                      "beyondLimits": [label(g["id"]) for g in out_lot],
                      "method": "Individuals chart on the 30 cassette means, limits from their average moving range (handbook 6.3.2.2), so the limits carry the lot-to-lot variation (handbook 6.6.1.4)"},
        "noLowerSdLimit": xs["sLCL"] == 0.0,
    }
    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator="\n")
    writer.writerow(["cassette", "wafer", "mean_um", "sd_um", "range_um", "mean_beyond_xbar_s_limits"])
    for g in wafer_groups:
        writer.writerow([g["id"][0], g["id"][1], fixed(g["mean"], 5), fixed(g["sd"], 5), fixed(g["range"], 5), "yes" if g in out_s else "no"])

    # MFG-003: the sources of variation, and the sigma a capability index would use.
    comp = anova["components"]
    total = sum(comp.values())
    variation = {
        "source": "Nested random-effects analysis of variance, expected mean squares as in handbook 6.6.1.3",
        "anova": {key: {"df": anova["df"][key], "sumOfSquares": fixed(anova["ss"][key], 5), "meanSquare": fixed(anova["ms"][key], 5)} for key in ("cassette", "wafer", "site")},
        "components": {key: {"variance": fixed(comp[key], 5), "share_percent": fixed(100 * comp[key] / total, 1), "sd_um": fixed(math.sqrt(comp[key]), 4)} for key in ("cassette", "wafer", "site")},
        "totalVariance": fixed(total, 5),
        "totalSd_um": fixed(math.sqrt(total), 4),
        "sampleSd_um": fixed(summary["standardDeviation"], 4),
        "withinWaferSd_um": fixed(math.sqrt(comp["site"]), 4),
        "xbarSChartSigma_um": fixed(xs["sigma"], 4),
        "overstatement": {
            "ratio": fixed(math.sqrt(total) / xs["sigma"], 2),
            "meaning": "A capability index is inversely proportional to the sigma it uses. With the sigma of the X-bar and s chart (within wafers), any Cp or Cpk for single sites would come out this many times larger than with the sigma of all three sources together.",
        },
        "capabilityExample": {key: fixed(value, 4) for key, value in capability(20, 8, 16, 2).items()},
        "noSpecification": "The case study publishes no specification limits for line width, so no capability index is computed for it.",
    }

    # Randori: each card changes one choice of MFG-002, the X-bar and s chart with the wafer as subgroup.
    def card(title: str, limits: dict[str, float], groups: list[dict[str, object]]) -> dict[str, object]:
        half = limits["UCL"] - limits["center"]
        base_half = xs["UCL"] - xs["center"]
        count = len(beyond(groups, limits))
        return {"title": title, "subgroups": len(groups), "center": fixed(limits["center"], 4), "halfWidth": fixed(half, 4),
                "halfWidthChange_percent": fixed(100 * (half / base_half - 1), 1), "meansBeyondLimits": count,
                "changeInMeansBeyond": count - len(out_s)}

    cleaned_groups = subgroups(rows, "wafer", "cleaned")
    cards = {
        "A": card("Use the cleaned line width column instead of the raw one", xbar_s_limits(cleaned_groups), cleaned_groups),
        "B": card("Use the cassette (15 measurements) as the subgroup instead of the wafer", xbar_s_limits(cassette_groups), cassette_groups),
        "C": card("Estimate sigma from the average range (R-bar / d2) instead of s-bar / c4", xr, wafer_groups),
    }

    if out.exists():
        shutil.rmtree(out)
    (out / "randori").mkdir(parents=True)

    def write_json(name: str, value: object) -> None:
        (out / name).write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    passed = len(checks)
    write_json("reference-checks.json", {"source": "NIST/SEMATECH e-Handbook of Statistical Methods, chapter 6", "passed": passed, "failed": 0, "checks": checks})
    write_json("inspection.json", inspection)
    write_json("control-limits.json", control)
    write_json("variation.json", variation)
    write_json("randori/cards.json", cards)
    (out / "subgroups.csv").write_text(buffer.getvalue(), encoding="utf-8")

    shares = variation["components"]
    lines = [
        "# Manufacturing pathway results",
        "",
        "Computed by `tools/manufacturing_pathway.py` with the methods of the NIST/SEMATECH e-Handbook of Statistical",
        "Methods, chapter 6. This is practice on the handbook's own case study, not an engineering review of any real",
        "process, part or quality system.",
        "",
        f"- Reference checks: {passed} of {passed} published handbook values reproduced (the lithography case study's summary,",
        "  analysis of variance and variance components; the X-bar and R chart factors for n = 2 to 10; c4; the individuals",
        "  chart example; the capability example and the table of rejects).",
        f"- The record: {structure['rows']} line widths, {structure['cassettes']} cassettes x 3 wafers x 5 sites, nothing missing; the {inspection['lowestSite'].lower()} site has the lowest mean.",
        f"- X-bar and s chart, wafer as subgroup (n = 5): centre {control['xbarS']['center']}, limits {control['xbarS']['LCL']} to {control['xbarS']['UCL']} um;",
        f"  {len(out_s)} of {len(wafer_groups)} wafer means fall outside them.",
        f"- Individuals chart on the {len(cassette_groups)} cassette means: limits {control['lotMeans']['LCL']} to {control['lotMeans']['UCL']} um; {len(out_lot)} outside.",
        f"- Variance components: cassette {shares['cassette']['share_percent']} %, wafer {shares['wafer']['share_percent']} %, site {shares['site']['share_percent']} % of {variation['totalVariance']} um^2.",
        f"  A capability index on the within-wafer sigma would be {variation['overstatement']['ratio']} times too large for single sites.",
        "- Randori cards: " + "; ".join(f"{k} {v['meansBeyondLimits']} outside ({v['changeInMeansBeyond']:+d})" for k, v in cards.items()) + ".",
        "",
    ]
    (out / "summary.md").write_text("\n".join(lines), encoding="utf-8")

    outputs = sorted(p.relative_to(out).as_posix() for p in out.rglob("*") if p.is_file()) + ["manifest.json"]
    write_json("manifest.json", {
        "script": "tools/manufacturing_pathway.py",
        "python": f"{sys.version_info.major}.{sys.version_info.minor}",
        "inputs": {INPUT: hashlib.sha256(raw).hexdigest()},
        "method": {
            "referenceChecks": "NIST/SEMATECH e-Handbook of Statistical Methods: sections 6.6.1.2 and 6.6.1.3 (lithography case study), 6.3.2.1 (factor table), 6.3.2 (c4), 6.3.2.2 (individuals chart example) and 6.1.6 (capability example and rejects)",
            "factors": "d2 and d3 from the distribution of the range of n normal observations, Simpson's rule with step 0.01; A2 = 3 / (d2 sqrt(n)), D3 = max(0, 1 - 3 d3 / d2), D4 = 1 + 3 d3 / d2",
            "controlLimits": "X-bar and s, and X-bar and R, three-sigma limits (6.3.2.1) with the wafer as subgroup; individuals chart (6.3.2.2) on the cassette means",
            "varianceComponents": "Nested random-effects analysis of variance, mean squares equated to expected mean squares (6.6.1.3)",
        },
        "outputs": sorted(outputs),
    })


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: manufacturing_pathway.py <pathway folder> <output folder>", file=sys.stderr)
        return 2
    try:
        build(Path(argv[1]), Path(argv[2]))
    except ReferenceMismatch as error:
        print(f"Handbook reference values did not reproduce; nothing written: {error}", file=sys.stderr)
        return 1
    except (ValueError, ArithmeticError) as error:
        print(f"manufacturing pathway: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
