"""Science pathway (Developer Dojo): from a published research record to a result with its uncertainty.

Standard library only (Python 3.12). Usage, from the folder that holds inputs/:

    python -I tools/science_pathway.py . my-output
    diff -r my-output generated

The methods are from the Guide to the expression of uncertainty in measurement (GUM), JCGM 100:2008: the
experimental standard deviation of the mean (clause 4.2, equations 3 to 5), the law of propagation of uncertainty
with correlated inputs (clause 5.2, equations 14, 16 and 17, and Annex H.2) and the least-squares calibration
line (Annex H.3, equations H.13a to H.13g, H.15 and H.16).

The script first reproduces the GUM's own worked examples (Annex H.2 and H.3) and exits with an error, writing
nothing, if any value differs at the precision the GUM prints. Only then does it read the record. A missing value
(an asterisk cell in the record) is reported as unavailable (null), never as zero. Nothing here is a calibration
certificate, and the trend uncertainty it reports is not the uncertainty of the record.
"""

from __future__ import annotations

import csv
import hashlib
import json
import math
import platform
import shutil
import sys
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

INPUT = "inputs/gistemp-v4-global-land-ocean.csv"
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
BASE_PERIOD = (1951, 1980)  # GISS states its anomalies are relative to 1951-1980 (GISTEMP FAQ, and the .txt table header)
TREND = {"first": 1991, "last": 2020, "t0": 1991.0, "series": "annual"}

RANDORI = {
    "A": {"title": "Another 30 years: fit 1981 to 2010 instead of 1991 to 2020", "first": 1981, "last": 2010, "t0": 1981.0},
    "B": {"title": "Use the 360 monthly values of 1991 to 2020 instead of the 30 annual means", "series": "monthly"},
    "C": {"title": "Move the reference year t0 to the middle of the period, as the GUM does in H.3.5", "t0": 2005.5},
}

# ---------- GUM Annex H data: the GUM's illustrative values, used here only as reference checks ----------

# Table H.2: five sets of simultaneous observations of V (volts), I (milliamperes) and phi (radians).
H2_SETS = [
    (5.007, 19.663, 1.0456),
    (4.994, 19.639, 1.0438),
    (5.005, 19.640, 1.0468),
    (4.990, 19.685, 1.0428),
    (4.999, 19.678, 1.0433),
]

# Table H.6: thermometer readings t_k and observed corrections b_k, both in degrees C, and the predicted corrections.
H6_READINGS = [
    (21.521, -0.171), (22.012, -0.169), (22.512, -0.166), (23.003, -0.159), (23.507, -0.164), (23.999, -0.165),
    (24.513, -0.156), (25.002, -0.157), (25.503, -0.159), (26.010, -0.161), (26.511, -0.160),
]
H6_PREDICTED = [-0.1679, -0.1668, -0.1657, -0.1646, -0.1635, -0.1625, -0.1614, -0.1603, -0.1592, -0.1581, -0.1570]


# ---------- GUM clause 4.2 and 5.2 ----------

def mean(values: list[float]) -> float:  # GUM eq. 3
    return math.fsum(values) / len(values)


def std_of_mean(values: list[float]) -> float:  # GUM eqs. 4 and 5: s(q_bar) = s(q_k) / sqrt(n)
    m = mean(values)
    n = len(values)
    return math.sqrt(math.fsum((v - m) ** 2 for v in values) / (n * (n - 1)))


def cov_of_means(a: list[float], b: list[float]) -> float:  # GUM eq. 17
    ma, mb = mean(a), mean(b)
    n = len(a)
    return math.fsum((x - ma) * (y - mb) for x, y in zip(a, b)) / (n * (n - 1))


def propagate(grad_l: list[float], grad_m: list[float], cov: list[list[float]]) -> float:  # GUM eq. 16, eq. H.9
    return math.fsum(grad_l[i] * grad_m[j] * cov[i][j] for i in range(len(grad_l)) for j in range(len(grad_m)))


def impedance(v: float, i_ma: float, phi: float) -> dict[str, float]:  # GUM eq. H.7, with I in amperes
    i = i_ma / 1000
    return {"R": v / i * math.cos(phi), "X": v / i * math.sin(phi), "Z": v / i}


def impedance_gradients(v: float, i_ma: float, phi: float) -> dict[str, list[float]]:
    """Sensitivity coefficients of R, X and Z to V (per volt), I (per ampere) and phi (per radian)."""
    i = i_ma / 1000
    return {
        "R": [math.cos(phi) / i, -v * math.cos(phi) / i ** 2, -v / i * math.sin(phi)],
        "X": [math.sin(phi) / i, -v * math.sin(phi) / i ** 2, v / i * math.cos(phi)],
        "Z": [1 / i, -v / i ** 2, 0.0],
    }


def h2_budget() -> dict:
    """GUM Annex H.2: Type A evaluation of V, I and phi, then R, X and Z with and without the input correlations."""
    cols = [[s[k] for s in H2_SETS] for k in range(3)]
    scale = [1.0, 1 / 1000, 1.0]  # I is observed in mA; covariances go in amperes
    est = [mean(c) for c in cols]
    u = [std_of_mean(c) for c in cols]
    cov = [[cov_of_means(cols[a], cols[b]) * scale[a] * scale[b] for b in range(3)] for a in range(3)]
    r_in = {f"{p},{q}": cov_of_means(cols[a], cols[b]) / (u[a] * u[b]) for (a, p), (b, q) in [((0, "V"), (1, "I")), ((0, "V"), (2, "phi")), ((1, "I"), (2, "phi"))]}
    values = impedance(*est)
    grads = impedance_gradients(*est)
    diag = [[cov[a][b] if a == b else 0.0 for b in range(3)] for a in range(3)]
    names = ["R", "X", "Z"]
    uc = {k: math.sqrt(propagate(grads[k], grads[k], cov)) for k in names}
    uc0 = {k: math.sqrt(propagate(grads[k], grads[k], diag)) for k in names}
    pairs = [("R", "X"), ("R", "Z"), ("X", "Z")]
    r_out = {f"{a},{b}": propagate(grads[a], grads[b], cov) / (uc[a] * uc[b]) for a, b in pairs}
    r_out0 = {f"{a},{b}": propagate(grads[a], grads[b], diag) / (uc0[a] * uc0[b]) for a, b in pairs}
    # Approach 2 (Table H.4): R, X and Z from each set, then their means, standard deviations of the means and correlations.
    per_set = [impedance(*s) for s in H2_SETS]
    series = {k: [p[k] for p in per_set] for k in names}
    approach2 = {
        "mean": {k: mean(series[k]) for k in names},
        "u": {k: std_of_mean(series[k]) for k in names},
        "r": {f"{a},{b}": cov_of_means(series[a], series[b]) / (std_of_mean(series[a]) * std_of_mean(series[b])) for a, b in pairs},
    }
    return {
        "inputs": {"V": {"unit": "V", "estimate": est[0], "u": u[0]}, "I": {"unit": "mA", "estimate": est[1], "u": u[1]}, "phi": {"unit": "rad", "estimate": est[2], "u": u[2]}},
        "inputCorrelations": r_in, "values": values, "gradients": grads, "uc": uc, "r": r_out, "ucUncorrelated": uc0, "rUncorrelated": r_out0,
        "approach2": approach2, "uInputs": [u[0], u[1] / 1000, u[2]],
    }


# ---------- GUM Annex H.3: least-squares line ----------

def linear_fit(ts: list[float], bs: list[float], t0: float) -> dict[str, float]:
    """GUM eqs. H.13a to H.13g for b(t) = y1 + y2 (t - t0)."""
    n = len(ts)
    th = [t - t0 for t in ts]
    s_t, s_tt = math.fsum(th), math.fsum(x * x for x in th)
    s_b, s_bt = math.fsum(bs), math.fsum(b * x for b, x in zip(bs, th))
    d = n * s_tt - s_t ** 2
    y1 = (s_b * s_tt - s_bt * s_t) / d
    y2 = (n * s_bt - s_b * s_t) / d
    residuals = [b - (y1 + y2 * x) for b, x in zip(bs, th)]
    s2 = math.fsum(e * e for e in residuals) / (n - 2)
    u1, u2 = math.sqrt(s2 * s_tt / d), math.sqrt(n * s2 / d)
    r = -s_t / math.sqrt(n * s_tt)
    return {"n": n, "t0": t0, "y1": y1, "y2": y2, "s": math.sqrt(s2), "u1": u1, "u2": u2, "r": r, "residuals": residuals, "tbar": mean(ts)}


def predict(fit: dict, t: float) -> tuple[float, float]:  # GUM eqs. H.12 and H.15
    dt = t - fit["t0"]
    var = fit["u1"] ** 2 + dt ** 2 * fit["u2"] ** 2 + 2 * dt * fit["u1"] * fit["u2"] * fit["r"]
    return fit["y1"] + fit["y2"] * dt, math.sqrt(var)


def lag1_autocorrelation(values: list[float]) -> float:
    """r1: sum of (Y_i - mean)(Y_i+1 - mean) over sum of (Y_i - mean)^2 (NIST/SEMATECH e-Handbook, section 1.3.5.12)."""
    m = mean(values)
    c0 = math.fsum((v - m) ** 2 for v in values)
    c1 = math.fsum((values[k] - m) * (values[k + 1] - m) for k in range(len(values) - 1))
    return c1 / c0


# ---------- reference checks: the GUM's own worked examples ----------

def check(cid: str, source: str, quantity: str, published: float, computed: float, decimals: int) -> dict:
    shown = round(computed, decimals)
    return {"id": cid, "source": source, "quantity": quantity, "published": published, "computed": shown,
            "status": "pass" if abs(shown - published) < 10 ** -decimals / 2 + 1e-12 else "fail"}


def reference_checks() -> list[dict]:
    b = h2_budget()
    h2, h3, h4, h5 = "GUM Table H.2", "GUM Table H.3", "GUM Table H.4", "GUM Table H.5"
    inp = b["inputs"]
    out = [
        check("H2-V-mean", h2, "mean of V, volts", 4.9990, inp["V"]["estimate"], 4),
        check("H2-I-mean", h2, "mean of I, milliamperes", 19.6610, inp["I"]["estimate"], 4),
        check("H2-phi-mean", h2, "mean of phi, radians", 1.04446, inp["phi"]["estimate"], 5),
        check("H2-V-u", h2, "experimental standard deviation of the mean of V, volts", 0.0032, inp["V"]["u"], 4),
        check("H2-I-u", h2, "experimental standard deviation of the mean of I, milliamperes", 0.0095, inp["I"]["u"], 4),
        check("H2-phi-u", h2, "experimental standard deviation of the mean of phi, radians", 0.00075, inp["phi"]["u"], 5),
        check("H2-r-V-I", h2, "correlation coefficient r(V, I)", -0.36, b["inputCorrelations"]["V,I"], 2),
        check("H2-r-V-phi", h2, "correlation coefficient r(V, phi)", 0.86, b["inputCorrelations"]["V,phi"], 2),
        check("H2-r-I-phi", h2, "correlation coefficient r(I, phi)", -0.65, b["inputCorrelations"]["I,phi"], 2),
    ]
    for k, value, uc in [("R", 127.732, 0.071), ("X", 219.847, 0.295), ("Z", 254.260, 0.236)]:
        out.append(check(f"H3-{k}", h3, f"{k}, ohms (approach 1)", value, b["values"][k], 3))
        out.append(check(f"H3-uc-{k}", h3, f"combined standard uncertainty of {k}, ohms", uc, b["uc"][k], 3))
    for pair, r in [("R,X", -0.588), ("R,Z", -0.485), ("X,Z", 0.993)]:
        out.append(check(f"H3-r-{pair.replace(',', '-')}", h3, f"correlation coefficient r({pair.replace(',', ', ')})", r, b["r"][pair], 3))
    a2 = b["approach2"]
    for k, value, u in [("R", 127.732, 0.071), ("X", 219.847, 0.295), ("Z", 254.260, 0.236)]:
        out.append(check(f"H4-{k}", h4, f"mean of the five values of {k}, ohms (approach 2)", value, a2["mean"][k], 3))
        out.append(check(f"H4-u-{k}", h4, f"experimental standard deviation of the mean of {k}, ohms", u, a2["u"][k], 3))
    for pair, r in [("R,X", -0.588), ("R,Z", -0.485), ("X,Z", 0.993)]:
        out.append(check(f"H4-r-{pair.replace(',', '-')}", h4, f"correlation coefficient r({pair.replace(',', ', ')}), approach 2", r, a2["r"][pair], 3))
    for k, uc in [("R", 0.195), ("X", 0.201), ("Z", 0.204)]:
        out.append(check(f"H5-uc-{k}", h5, f"combined standard uncertainty of {k} if the inputs were uncorrelated, ohms", uc, b["ucUncorrelated"][k], 3))
    for pair, r in [("R,X", 0.056), ("R,Z", 0.527), ("X,Z", 0.878)]:
        out.append(check(f"H5-r-{pair.replace(',', '-')}", h5, f"correlation coefficient r({pair.replace(',', ', ')}) if the inputs were uncorrelated", r, b["rUncorrelated"][pair], 3))

    h3c = "GUM H.3 (thermometer calibration)"
    fit = linear_fit([t for t, _ in H6_READINGS], [c for _, c in H6_READINGS], 20.0)
    b30, u30 = predict(fit, 30.0)
    tmin = fit["t0"] - fit["u1"] * fit["r"] / fit["u2"]
    y1_prime = fit["y1"] + fit["y2"] * (fit["tbar"] - fit["t0"])
    u1_prime = fit["u1"] * math.sqrt(1 - fit["r"] ** 2)
    out += [
        check("H3-y1", h3c, "intercept y1, degrees C (eq. H.13a)", -0.1712, fit["y1"], 4),
        check("H3-y2", h3c, "slope y2 (eq. H.13b)", 0.00218, fit["y2"], 5),
        check("H3-u-y1", h3c, "standard uncertainty of y1, degrees C (eq. H.13c)", 0.0029, fit["u1"], 4),
        check("H3-u-y2", h3c, "standard uncertainty of y2 (eq. H.13d)", 0.00067, fit["u2"], 5),
        check("H3-r-y1-y2", h3c, "correlation coefficient r(y1, y2) (eq. H.13e)", -0.930, fit["r"], 3),
        check("H3-s", h3c, "standard deviation of the fit s, degrees C (eq. H.13f)", 0.0035, fit["s"], 4),
        check("H3-tmin", h3c, "temperature where the predicted correction is least uncertain, degrees C", 24.0085, tmin, 4),
        check("H3-b30", h3c, "predicted correction b(30 degrees C), degrees C (eq. H.14)", -0.1494, b30, 4),
        check("H3-u-b30", h3c, "combined standard uncertainty of b(30 degrees C), degrees C (eq. H.15)", 0.0041, u30, 4),
        check("H3-y1-prime", h3c, "intercept at t0 = t_bar, degrees C (eq. H.17a)", -0.1625, y1_prime, 4),
        check("H3-u-y1-prime", h3c, "standard uncertainty of that intercept, degrees C (eq. H.17a)", 0.0011, u1_prime, 4),
    ]
    for k, ((t, _), published) in enumerate(zip(H6_READINGS, H6_PREDICTED), start=1):
        out.append(check(f"H6-b-{k}", "GUM Table H.6", f"predicted correction b(t_{k}) at {t} degrees C", published, predict(fit, t)[0], 4))
    return out


# ---------- the record ----------

def parse_cell(raw: str, where: str) -> Decimal | None:
    cell = raw.strip()
    if cell and set(cell) == {"*"}:
        return None
    try:
        return Decimal(cell)
    except ArithmeticError as error:
        raise SystemExit(f"{where}: cannot read {raw!r} as a number or a missing marker") from error


def read_record(path: Path) -> tuple[str, list[str], list[dict]]:
    lines = path.read_text(encoding="utf-8").splitlines()
    if len(lines) < 3:
        raise SystemExit(f"{path}: expected a title line, a header line and data")
    title = lines[0].strip()
    header = [h.strip() for h in lines[1].split(",")]
    for needed in ["Year", *MONTHS, "J-D"]:
        if needed not in header:
            raise SystemExit(f"{path}: the header has no column {needed}")
    rows = []
    for number, line in enumerate(lines[2:], start=3):
        if not line.strip():
            continue
        cells = line.split(",")
        if len(cells) != len(header):
            raise SystemExit(f"{path}:{number}: {len(cells)} cells, the header has {len(header)}")
        row = {"Year": int(cells[0])}
        for name, raw in zip(header[1:], cells[1:]):
            row[name] = parse_cell(raw, f"{path}:{number} {name}")
        rows.append(row)
    return title, header, rows


def num(value: Decimal | None) -> float | None:
    return None if value is None else float(value)


def dmean(values: list[Decimal]) -> Decimal:
    return sum(values, Decimal(0)) / len(values)


def inspect(title: str, header: list[str], rows: list[dict]) -> dict:
    missing = {name: [r["Year"] for r in rows if r[name] is None] for name in header[1:]}
    monthly = [(r["Year"], m, r[m]) for r in rows for m in MONTHS if r[m] is not None]
    lo = min(monthly, key=lambda item: item[2])
    hi = max(monthly, key=lambda item: item[2])
    annual = [(r["Year"], r["J-D"]) for r in rows if r["J-D"] is not None]
    alo = min(annual, key=lambda item: item[1])
    ahi = max(annual, key=lambda item: item[1])
    base = [r for r in rows if BASE_PERIOD[0] <= r["Year"] <= BASE_PERIOD[1]]
    base_month_means = {m: float(dmean([r[m] for r in base]).quantize(Decimal("0.001"), ROUND_HALF_UP)) for m in MONTHS}
    complete = [r for r in rows if all(r[m] is not None for m in MONTHS) and r["J-D"] is not None]
    diffs = []
    exact = 0
    for r in complete:
        m = dmean([r[k] for k in MONTHS])
        if m.quantize(Decimal("0.01"), ROUND_HALF_UP) == r["J-D"]:
            exact += 1
        diffs.append((r["Year"], r["J-D"] - m))
    worst = max(diffs, key=lambda item: abs(item[1]))
    return {
        "title": title,
        "columns": header,
        "unit": "degrees C, anomaly from the 1951-1980 mean for the same place and time of year (as GISS states; the CSV itself does not say)",
        "firstYear": rows[0]["Year"], "lastYear": rows[-1]["Year"], "years": len(rows),
        "missingMarker": "a cell of asterisks",
        "missingCells": sum(len(v) for v in missing.values()),
        "missingByColumn": {k: v for k, v in missing.items() if v},
        "yearsWithAllMonths": len([r for r in rows if all(r[m] is not None for m in MONTHS)]),
        "monthly": {"values": len(monthly), "min": {"year": lo[0], "month": lo[1], "value": float(lo[2])}, "max": {"year": hi[0], "month": hi[1], "value": float(hi[2])}},
        "annual": {"values": len(annual), "min": {"year": alo[0], "value": float(alo[1])}, "max": {"year": ahi[0], "value": float(ahi[1])}},
        "basePeriod": {
            "years": f"{BASE_PERIOD[0]}-{BASE_PERIOD[1]}",
            "meanOfAnnualValues": float(dmean([r["J-D"] for r in base]).quantize(Decimal("0.001"), ROUND_HALF_UP)),
            "meanOfEachMonth": base_month_means,
            "largestMonthMean": max(abs(v) for v in base_month_means.values()),
        },
        "annualAgainstMonths": {
            "yearsCompared": len(complete),
            "sameAtTwoDecimals": exact,
            "withinRounding": len([d for _, d in diffs if abs(d) <= Decimal("0.01")]),
            "largestDifference": {"year": worst[0], "value": float(worst[1].quantize(Decimal("0.0001"), ROUND_HALF_UP))},
            "rule": "J-D compared with the mean of the twelve monthly values; both are printed to 0.01, so a difference up to 0.01 is rounding",
        },
    }


def series(rows: list[dict], first: int, last: int, kind: str) -> tuple[list[float], list[float], list[str]]:
    ts, ys, unavailable = [], [], []
    for r in rows:
        if not first <= r["Year"] <= last:
            continue
        if kind == "annual":
            if r["J-D"] is None:
                unavailable.append(str(r["Year"]))
            else:
                ts.append(float(r["Year"]))
                ys.append(float(r["J-D"]))
        else:
            for k, m in enumerate(MONTHS):
                if r[m] is None:
                    unavailable.append(f"{r['Year']}-{k + 1:02d}")
                else:
                    ts.append(r["Year"] + (k + 0.5) / 12)
                    ys.append(float(r[m]))
    return ts, ys, unavailable


def trend(rows: list[dict], spec: dict) -> dict:
    ts, ys, unavailable = series(rows, spec["first"], spec["last"], spec["series"])
    fit = linear_fit(ts, ys, spec["t0"])
    return {
        "series": "annual means (J-D)" if spec["series"] == "annual" else "monthly values",
        "period": f"{spec['first']}-{spec['last']}", "n": fit["n"], "unavailable": unavailable, "t0": spec["t0"],
        "intercept_C": round(fit["y1"], 3), "u_intercept_C": round(fit["u1"], 3),
        "slope_C_per_decade": round(10 * fit["y2"], 3), "u_slope_C_per_decade": round(10 * fit["u2"], 4),
        "r_intercept_slope": round(fit["r"], 3), "s_C": round(fit["s"], 3), "degreesOfFreedom": fit["n"] - 2,
        "slopeOverItsUncertainty": round(fit["y2"] / fit["u2"], 1),
        "residualLag1Autocorrelation": round(lag1_autocorrelation(fit["residuals"]), 2),
        "_fit": fit, "_ts": ts, "_ys": ys,
    }


def public(result: dict) -> dict:
    return {k: v for k, v in result.items() if not k.startswith("_")}


def sig(x: float, digits: int = 6) -> float:
    return float(f"{x:.{digits}g}")


def write_json(path: Path, data: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def budget_outputs(b: dict) -> tuple[dict, list[dict]]:
    names = {"V": "V", "I": "I", "phi": "phi"}
    u_si = b["uInputs"]
    rows = []
    outputs = {}
    for k in ["R", "X", "Z"]:
        contributions = []
        for idx, q in enumerate(names):
            c = b["gradients"][k][idx]
            contributions.append({"input": q, "sensitivityCoefficient": sig(c), "standardUncertainty_SI": sig(u_si[idx]), "contribution_ohm": sig(c * u_si[idx])})
            rows.append({"output": k, "input": q, "sensitivity_coefficient": sig(c), "standard_uncertainty_si": sig(u_si[idx]), "contribution_ohm": sig(c * u_si[idx])})
        outputs[k] = {
            "estimate_ohm": round(b["values"][k], 3),
            "combinedStandardUncertainty_ohm": round(b["uc"][k], 3),
            "relative": sig(b["uc"][k] / b["values"][k], 2),
            "ifInputsUncorrelated_ohm": round(b["ucUncorrelated"][k], 3),
            "contributions": contributions,
        }
    return outputs, rows


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: science_pathway.py <folder with inputs/> <output folder>", file=sys.stderr)
        return 2
    root, out = Path(argv[1]), Path(argv[2])
    source = root / INPUT
    if not source.is_file():
        print(f"{source}: input record not found", file=sys.stderr)
        return 2
    checks = reference_checks()
    failed = [c for c in checks if c["status"] != "pass"]
    if failed:
        for c in failed:
            print(f"reference check {c['id']} failed: published {c['published']}, computed {c['computed']}", file=sys.stderr)
        print("reference checks failed, nothing written", file=sys.stderr)
        return 1
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    title, header, rows = read_record(source)
    write_json(out / "reference-checks.json", {"passed": len(checks), "failed": 0, "checks": checks})
    inspection = inspect(title, header, rows)
    write_json(out / "inspection.json", inspection)

    b = h2_budget()
    outputs, budget_rows = budget_outputs(b)
    write_json(out / "uncertainty-budget.json", {
        "example": "GUM Annex H.2: resistance R, reactance X and impedance Z from five sets of V, I and phi",
        "inputs": {k: {"unit": v["unit"], "estimate": sig(v["estimate"]), "standardUncertainty": sig(v["u"], 2), "observations": len(H2_SETS), "degreesOfFreedom": len(H2_SETS) - 1, "evaluation": "Type A, GUM eqs. 3 to 5"} for k, v in b["inputs"].items()},
        "inputCorrelations": {k: round(v, 2) for k, v in b["inputCorrelations"].items()},
        "outputs": outputs,
        "outputCorrelations": {k: round(v, 3) for k, v in b["r"].items()},
        "outputCorrelationsIfInputsUncorrelated": {k: round(v, 3) for k, v in b["rUncorrelated"].items()},
    })
    with (out / "uncertainty-budget.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(budget_rows[0].keys()), lineterminator="\n")
        writer.writeheader()
        writer.writerows(budget_rows)

    base = trend(rows, TREND)
    write_json(out / "trend.json", {
        **public(base),
        "method": "GUM Annex H.3 least-squares line b(t) = y1 + y2 (t - t0), years as t",
        "assumption": "The standard uncertainties assume independent residuals, as the least-squares formulas do. The residual lag-1 autocorrelation is reported so you can see whether that holds; this is not the uncertainty of the record.",
    })
    with (out / "trend-residuals.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(["year", "anomaly_c", "fitted_c", "residual_c"])
        fit = base["_fit"]
        for t, y, e in zip(base["_ts"], base["_ys"], fit["residuals"]):
            writer.writerow([int(t), f"{y:.2f}", f"{y - e:.4f}", f"{e:.4f}"])

    cards = {}
    for card, change in RANDORI.items():
        spec = {**TREND, **{k: v for k, v in change.items() if k != "title"}}
        result = trend(rows, spec)
        cards[card] = {
            "title": change["title"], **public(result),
            "changeInSlope_C_per_decade": round(result["slope_C_per_decade"] - base["slope_C_per_decade"], 3),
            "uncertaintyRatio": round(result["_fit"]["u2"] / base["_fit"]["u2"], 2),
        }
    write_json(out / "randori" / "cards.json", cards)

    summary = [
        "# Science pathway: results", "",
        f"Record: {title}, {inspection['firstYear']} to {inspection['lastYear']}, {inspection['missingCells']} cells unavailable.", "",
        f"Reference checks against the GUM's worked examples (Annex H.2 and H.3): {len(checks)} passed, 0 failed.", "",
        f"Least-squares line through the annual means {base['period']} ({base['n']} years):", "",
        "| Quantity | Value |", "| --- | --- |",
        f"| Slope | {base['slope_C_per_decade']} degrees C per decade |",
        f"| Standard uncertainty of the slope (least squares) | {base['u_slope_C_per_decade']} degrees C per decade |",
        f"| Correlation of intercept and slope, t0 = {int(base['t0'])} | {base['r_intercept_slope']} |",
        f"| Lag-1 autocorrelation of the residuals | {base['residualLag1Autocorrelation']} |", "",
        "The least-squares uncertainty assumes independent residuals. It is not the uncertainty of the record, which this pathway does not evaluate.",
        "Practice on a published record and on the GUM's illustrative data. Not a calibration certificate, and not reviewed by a metrologist, statistician or climate scientist.", "",
    ]
    (out / "summary.md").write_text("\n".join(summary), encoding="utf-8")
    write_json(out / "manifest.json", {
        "script": "tools/science_pathway.py",
        "python": platform.python_version_tuple()[0] + "." + platform.python_version_tuple()[1],
        "inputs": {INPUT: hashlib.sha256(source.read_bytes()).hexdigest()},
        "method": {
            "referenceChecks": "GUM (JCGM 100:2008) Annex H.2, Tables H.2 to H.5, and Annex H.3, Table H.6 and eqs. H.13 to H.17",
            "typeA": "GUM clause 4.2, eqs. 3 to 5; covariance of means, eq. 17",
            "propagation": "GUM clause 5.2, eq. 16, with sensitivity coefficients from eq. H.7",
            "trend": f"GUM Annex H.3 least squares on the {TREND['series']} values {TREND['first']}-{TREND['last']}, t0 = {TREND['t0']}",
            "autocorrelation": "lag-1 autocorrelation coefficient of the residuals (NIST/SEMATECH e-Handbook of Statistical Methods, section 1.3.5.12)",
            "missing": "asterisk cells are unavailable (null) and left out of every sum, never read as zero",
        },
        "outputs": sorted(str(p.relative_to(out)) for p in out.rglob("*") if p.is_file()),
    })
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
