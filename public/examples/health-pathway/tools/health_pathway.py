"""Health pathway (Developer Dojo): from a growth reference table to a checked BMI-for-age percentile.

    python -I tools/health_pathway.py <pathway folder> <output folder>

Standard library only. The method is the one CDC's National Center for Health Statistics publishes for its BMI-for-age
growth charts: the LMS method of the CDC 2000 growth charts up to the 95th percentile, and the extended method of the
2022 Extended BMI-for-age growth charts above it. The script first reproduces what CDC publishes:

- the four worked examples on CDC's page "Extended BMI-for-age growth charts: data files" and the worked example on
  CDC's page "Child and teen BMI categories", each with the table values CDC prints for it;
- every percentile and z-score column of the 2022 data file (bmi-age-2022.csv), from its own L, M, S and sigma;
- every percentile of the 2000 data file (bmiagerev.csv), from its L, M and S, and CDC's statement that the 2022 file
  repeats the 2000 file's L, M, S and percentiles up to the 95th.

If any differs, it exits with an error and writes nothing. Then it writes:

- inspection.json: what the two tables hold and how they differ (HLT-001);
- scores.json and children.csv: BMI, z-score, percentile, per cent of the 95th percentile and CDC's BMI category for
  the six fictional children of scenario/children.csv (HLT-002 and HLT-003);
- randori/cards.json: the Randori cards recomputed;
- manifest.json and summary.md.

The tables are CDC's files, unchanged; see tools/fetch_input.py. The children are fictional: they are not measurements
of any real child, and nothing here is a clinical assessment.
"""

from __future__ import annotations

import csv
import hashlib
import io
import json
import shutil
import sys
from decimal import Decimal
from pathlib import Path
from statistics import NormalDist

TABLE_2022 = "inputs/bmi-age-2022.csv"
TABLE_2000 = "inputs/bmiagerev.csv"
SCENARIO = "scenario/children.csv"
STANDARD_NORMAL = NormalDist()
SEX = {"1": "male", "2": "female"}
SEX_CODE = {"male": "1", "female": "2"}
# CDC's child and teen BMI calculator covers ages 2 through 19 years; from 20 the adult categories apply.
FIRST_MONTH, LAST_MONTH = 24, 239
PERCENTILE_COLUMNS = {"P3": 3, "P5": 5, "P10": 10, "P25": 25, "P50": 50, "P75": 75, "P85": 85, "P90": 90, "P95": 95,
                      "P98": 98, "P99": 99, "P99_9": 99.9, "P99_99": 99.99}
Z_COLUMNS = {"Z2neg": -2.0, "Z1_5neg": -1.5, "Z1neg": -1.0, "Z0_5neg": -0.5, "Z0": 0.0, "Z0_5": 0.5, "Z1": 1.0,
             "Z1_5": 1.5, "Z2": 2.0, "Z2_5": 2.5, "Z3": 3.0, "Z3_5": 3.5, "Z4": 4.0, "Z4_5": 4.5, "Z5": 5.0}
COLUMNS_2000 = ["Sex", "Agemos", "L", "M", "S", "P3", "P5", "P10", "P25", "P50", "P75", "P85", "P90", "P95", "P97"]
COLUMNS_2022 = ["sex", "agemos", "L", "M", "S", "sigma", *PERCENTILE_COLUMNS, "pct120ofP95", *Z_COLUMNS]
# The CDC 2000 file prints eight decimals, but its L, M and S carry about nine significant digits, so the eighth
# decimal of a percentile cannot be recomputed from them. Its percentiles are checked to within this, in kg/m2.
TOLERANCE_2000 = 1e-6
# Adult BMI categories (CDC, "Adult BMI categories"), used only by a Randori card to show why they do not apply.
ADULT_CATEGORIES = ((18.5, "underweight"), (25.0, "healthy weight"), (30.0, "overweight"), (float("inf"), "obesity"))


class ReferenceMismatch(Exception):
    """A value CDC publishes did not reproduce."""


def fixed(value: float, decimals: int) -> str:
    """A value at a fixed number of decimals, never '-0.000'."""
    text = f"{value:.{decimals}f}"
    return text[1:] if text.startswith("-") and float(text) == 0 else text


def decimals_of(text: str) -> int:
    exponent = Decimal(text).as_tuple().exponent
    return max(0, -exponent) if isinstance(exponent, int) else 0


# ---------------------------------------------------------------- the method

def lms_z(bmi: float, L: float, M: float, S: float) -> float:
    """CDC 2000 growth charts: z = ((BMI / M)^L - 1) / (L S)."""
    return ((bmi / M) ** L - 1.0) / (L * S)


def lms_value(z: float, L: float, M: float, S: float) -> float:
    """CDC 2000 growth charts: BMI = M (1 + L S z)^(1 / L)."""
    return M * (1.0 + L * S * z) ** (1.0 / L)


def extended_percentile(bmi: float, p95: float, sigma: float) -> float:
    """Extended BMI-for-age: percentile = 90 + 10 Phi((BMI - P95) / sigma), above the 95th percentile."""
    return 90.0 + 10.0 * STANDARD_NORMAL.cdf((bmi - p95) / sigma)


def extended_value(percentile: float, p95: float, sigma: float) -> float:
    """Extended BMI-for-age: BMI = Phi^-1((percentile - 90) / 10) sigma + P95, above the 95th percentile."""
    return STANDARD_NORMAL.inv_cdf((percentile - 90.0) / 10.0) * sigma + p95


def z_ceiling(L: float, S: float) -> float:
    """With L < 0, (BMI / M)^L tends to 0 as BMI grows, so the LMS z-score can never reach -1 / (L S)."""
    return -1.0 / (L * S)


# ---------------------------------------------------------------- reading the tables

def read_table(raw: bytes, name: str, columns: list[str]) -> tuple[list[dict[str, str]], dict[str, object]]:
    try:
        text = raw.decode("ascii")
    except UnicodeDecodeError as error:
        raise ValueError(f"{name}: not plain ASCII: {error}") from error
    lines = text.split("\r\n")
    if lines[-1] != "":
        raise ValueError(f"{name}: expected CRLF line endings and a final CRLF")
    lines = lines[:-1]
    if any("\n" in line or "\r" in line for line in lines):
        raise ValueError(f"{name}: mixed line endings")
    header = lines[0].split(",")
    if header != columns:
        raise ValueError(f"{name}: unexpected header {header}")
    rows: list[dict[str, str]] = []
    repeated: list[int] = []
    for number, line in enumerate(lines[1:], start=2):
        cells = line.split(",")
        if cells == header:
            repeated.append(number)
            continue
        if len(cells) != len(header):
            raise ValueError(f"{name} line {number}: expected {len(header)} columns, found {len(cells)}")
        for cell in cells:
            try:
                float(cell)
            except ValueError as error:
                raise ValueError(f"{name} line {number}: {error}") from error
        row = dict(zip(header, cells))
        row["line"] = str(number)
        rows.append(row)
    return rows, {"lines": len(lines), "dataRows": len(rows), "repeatedHeaderLines": repeated, "lineEndings": "CRLF"}


def keyed(rows: list[dict[str, str]], sex: str, age: str) -> dict[tuple[str, float], dict[str, str]]:
    table = {}
    for row in rows:
        key = (row[sex], float(row[age]))
        if key in table:
            raise ValueError(f"line {row['line']}: a second row for sex {key[0]}, age {key[1]} months")
        table[key] = row
    return table


def numbers(row: dict[str, str]) -> tuple[float, float, float]:
    return float(row["L"]), float(row["M"]), float(row["S"])


# ---------------------------------------------------------------- reference checks

def check(checks: list[dict[str, object]], cid: str, source: str, quantity: str, published: str, computed: str) -> None:
    ok = computed == published
    checks.append({"id": cid, "source": source, "quantity": quantity, "published": published, "computed": computed, "status": "pass" if ok else "fail"})
    if not ok:
        raise ReferenceMismatch(f"{cid} ({source}, {quantity}): published {published}, computed {computed}")


def same_text(checks: list[dict[str, object]], cid: str, source: str, quantity: str, published: str, row: dict[str, str], column: str, decimals: int | None = None) -> None:
    """A table value CDC prints in the worked example, against the same value in the file."""
    value = row[column] if decimals is None else fixed(float(row[column]), decimals)
    check(checks, cid, source, quantity + f" (file line {row['line']})", published, value)


def worked_examples(table: dict[tuple[str, float], dict[str, str]]) -> list[dict[str, object]]:
    checks: list[dict[str, object]] = []
    page = "CDC extended BMI data files"

    row = table[("2", 114.5)]
    s = page + ", example 1"
    for column, published in (("L", "-2.257782149"), ("M", "16.57626713"), ("S", "0.132796819"), ("P95", "22.3979")):
        same_text(checks, f"ex1-{column}", s, f"{column}, girl, 114.5 months", published, row, column)
    z = lms_z(21.2, *numbers(row))
    check(checks, "ex1-z", s, "z-score for BMI 21.2", "1.4215", fixed(z, 4))
    check(checks, "ex1-percentile", s, "Percentile for BMI 21.2", "92.2", fixed(100 * STANDARD_NORMAL.cdf(z), 1))

    row = table[("1", 50.5)]
    s = page + ", example 2"
    same_text(checks, "ex2-P95", s, "P95, boy, 50.5 months", "17.8219", row, "P95")
    same_text(checks, "ex2-sigma", s, "Sigma, boy, 50.5 months, as printed in the text", "2.3983", row, "sigma", 4)
    same_text(checks, "ex2-sigma-formula", s, "Sigma, as printed in the formula", "2.398288", row, "sigma")
    percentile = extended_percentile(22.6, float(row["P95"]), float(row["sigma"]))
    check(checks, "ex2-percentile", s, "Percentile for BMI 22.6", "99.7683", fixed(percentile, 4))
    check(checks, "ex2-z", s, "z-score for BMI 22.6", "2.83", fixed(STANDARD_NORMAL.inv_cdf(percentile / 100), 2))

    row = table[("2", 184.5)]
    s = page + ", example 3"
    for column, published in (("L", "-2.060616513"), ("M", "20.11172291"), ("S", "0.150079322")):
        same_text(checks, f"ex3-{column}", s, f"{column}, girl, 184.5 months", published, row, column)
    check(checks, "ex3-percentile", s, "Percentile at z-score 1.5", "93.3", fixed(100 * STANDARD_NORMAL.cdf(1.5), 1))
    check(checks, "ex3-bmi", s, "BMI at z-score 1.5", "27.2", fixed(lms_value(1.5, *numbers(row)), 1))

    row = table[("1", 92.5)]
    s = page + ", example 4"
    same_text(checks, "ex4-P95", s, "P95, boy, 92.5 months", "19.7477", row, "P95")
    same_text(checks, "ex4-sigma", s, "Sigma, boy, 92.5 months, as printed in the text", "3.8373", row, "sigma", 4)
    same_text(checks, "ex4-sigma-formula", s, "Sigma, as printed in the formula", "3.837343", row, "sigma")
    check(checks, "ex4-z", s, "z-score at the 98.7th percentile", "2.226", fixed(STANDARD_NORMAL.inv_cdf(0.987), 3))
    check(checks, "ex4-bmi", s, "BMI at the 98.7th percentile", "24.1", fixed(extended_value(98.7, float(row["P95"]), float(row["sigma"])), 1))

    # CDC, "Child and teen BMI categories": a 12-year-old girl, 5 feet tall, 136 pounds. Age 12 years 0 months is the
    # row for 144.5 months; the result for every month of age 12 is in inspection.json.
    s = "CDC child and teen BMI categories, example"
    bmi = imperial_bmi(60, 136)
    score = score_bmi(bmi, table[("2", 144.5)])
    check(checks, "categories-bmi", s, "BMI, 5 feet and 136 pounds", "26.6", fixed(bmi, 1))
    check(checks, "categories-percentile", s, "Percentile, girl aged 12 (144.5 months)", "96", fixed(score["percentile"], 0))
    check(checks, "categories-category", s, "BMI category", "obesity", score["category"])
    return checks


def imperial_bmi(inches: float, pounds: float) -> float:
    """Exact conversions: 1 inch = 0.0254 m, 1 pound = 0.45359237 kg."""
    return pounds * 0.45359237 / (inches * 0.0254) ** 2


def table_checks(rows_2022: list[dict[str, str]], rows_2000: list[dict[str, str]], table_2022: dict[tuple[str, float], dict[str, str]]) -> dict[str, object]:
    """Every percentile and z-score column, recomputed from each row's own parameters."""
    columns: dict[str, dict[str, object]] = {}

    def record(column: str, method: str, printed: str, value: float) -> None:
        entry = columns.setdefault(column, {"column": column, "method": method, "values": 0, "matchWhenRounded": 0, "withinOneUnit": 0, "largestDifferenceInLastDigit": 0.0})
        decimals = decimals_of(printed)
        difference = abs(value - float(printed)) / 10.0 ** -decimals
        entry["values"] += 1
        if fixed(value, decimals) == fixed(float(printed), decimals):
            entry["matchWhenRounded"] += 1
        if difference <= 1.0:
            entry["withinOneUnit"] += 1
        else:
            raise ReferenceMismatch(f"{TABLE_2022} line {row_line}, {column}: printed {printed}, computed {value!r}")
        entry["largestDifferenceInLastDigit"] = max(entry["largestDifferenceInLastDigit"], difference)

    for row in rows_2022:
        row_line = row["line"]
        L, M, S = numbers(row)
        sigma = float(row["sigma"])
        p95 = lms_value(STANDARD_NORMAL.inv_cdf(0.95), L, M, S)
        for column, percentile in PERCENTILE_COLUMNS.items():
            if percentile <= 95:
                record(column, "LMS", row[column], lms_value(STANDARD_NORMAL.inv_cdf(percentile / 100), L, M, S))
            else:
                record(column, "extended", row[column], extended_value(percentile, p95, sigma))
        for column, z in Z_COLUMNS.items():
            if z <= 1.645:
                record(column, "LMS", row[column], lms_value(z, L, M, S))
            else:
                record(column, "extended", row[column], extended_value(100 * STANDARD_NORMAL.cdf(z), p95, sigma))
        record("pct120ofP95", "1.2 x P95", row["pct120ofP95"], 1.2 * p95)

    summary_2022 = []
    for entry in columns.values():
        entry["largestDifferenceInLastDigit"] = fixed(entry["largestDifferenceInLastDigit"], 2)
        summary_2022.append(entry)

    # The 2000 file: every percentile from L, M and S, to within TOLERANCE_2000.
    largest = 0.0
    count = 0
    for row in rows_2000:
        L, M, S = numbers(row)
        for column in COLUMNS_2000[5:]:
            value = lms_value(STANDARD_NORMAL.inv_cdf(int(column[1:]) / 100), L, M, S)
            difference = abs(value - float(row[column]))
            if difference > TOLERANCE_2000:
                raise ReferenceMismatch(f"{TABLE_2000} line {row['line']}, {column}: printed {row[column]}, computed {value!r}")
            largest = max(largest, difference)
            count += 1

    # CDC's statement: the 2022 file's L, M, S and the 3rd to 95th percentiles are those of the 2000 file.
    identical_lms = 0
    agreeing_percentiles = 0
    for row in rows_2000:
        other = table_2022.get((row["Sex"], float(row["Agemos"])))
        if other is None:
            raise ReferenceMismatch(f"{TABLE_2022} has no row for sex {row['Sex']}, {row['Agemos']} months")
        for column in ("L", "M", "S"):
            if row[column] != other[column]:
                raise ReferenceMismatch(f"{column} differs at sex {row['Sex']}, {row['Agemos']} months: {row[column]} and {other[column]}")
            identical_lms += 1
        for column in COLUMNS_2000[5:14]:
            decimals = decimals_of(other[column])
            if fixed(float(row[column]), decimals) != fixed(float(other[column]), decimals):
                raise ReferenceMismatch(f"{column} differs at sex {row['Sex']}, {row['Agemos']} months: {row[column]} and {other[column]}")
            agreeing_percentiles += 1
    if len(rows_2000) != len(rows_2022):
        raise ReferenceMismatch(f"the files have {len(rows_2000)} and {len(rows_2022)} rows")

    values = sum(entry["values"] for entry in summary_2022)
    return {
        "table2022": {"file": TABLE_2022, "values": values, "matchWhenRounded": sum(entry["matchWhenRounded"] for entry in summary_2022),
                      "withinOneUnit": sum(entry["withinOneUnit"] for entry in summary_2022), "columns": summary_2022,
                      "rule": "Each printed value is recomputed from the row's own L, M, S and sigma (the extended columns from the unrounded LMS 95th percentile). A value passes if it is within one unit of its last printed digit; most also match exactly when rounded."},
        "table2000": {"file": TABLE_2000, "values": count, "largestDifference": f"{largest:.1e}", "tolerance": f"{TOLERANCE_2000:.0e}",
                      "rule": "Each printed percentile is recomputed from the row's L, M and S with the exact normal quantile. The file prints eight decimals, but L, M and S carry about nine significant digits, so a percentile passes within 0.000001 kg/m2."},
        "sameAs2000": {"rows": len(rows_2000), "identicalLMS": identical_lms, "agreeingPercentiles": agreeing_percentiles,
                       "rule": "L, M and S are the same text in both files, and the 3rd to 95th percentiles agree at the decimals the 2022 file prints, as CDC states."},
    }


# ---------------------------------------------------------------- scoring

def category(percentile: float, percent_of_p95: float) -> str:
    """CDC, Child and teen BMI categories: severe obesity is 120 % of the 95th percentile or more."""
    if percentile < 5:
        return "underweight"
    if percentile < 85:
        return "healthy weight"
    if percentile < 95:
        return "overweight"
    return "severe obesity" if percent_of_p95 >= 120 else "obesity"


def score_bmi(bmi: float, row: dict[str, str]) -> dict[str, object]:
    L, M, S = numbers(row)
    p95, sigma = float(row["P95"]), float(row["sigma"])
    z_lms = lms_z(bmi, L, M, S)
    if bmi <= p95:
        method, z, percentile = "LMS", z_lms, 100 * STANDARD_NORMAL.cdf(z_lms)
    else:
        method = "extended"
        percentile = extended_percentile(bmi, p95, sigma)
        z = STANDARD_NORMAL.inv_cdf(percentile / 100)
    percent_of_p95 = 100 * bmi / p95
    return {"method": method, "z": z, "percentile": percentile, "lmsZ": z_lms, "lmsPercentile": 100 * STANDARD_NORMAL.cdf(z_lms),
            "zCeiling": z_ceiling(L, S), "percentOfP95": percent_of_p95, "category": category(percentile, percent_of_p95),
            "P95": row["P95"], "sigma": row["sigma"], "L": row["L"], "M": row["M"], "S": row["S"]}


def read_children(raw: bytes) -> list[dict[str, object]]:
    try:
        text = raw.decode("ascii")
    except UnicodeDecodeError as error:
        raise ValueError(f"{SCENARIO}: not plain ASCII: {error}") from error
    reader = csv.DictReader(io.StringIO(text))
    if reader.fieldnames != ["child", "sex", "age_years", "age_months", "height_cm", "weight_kg"]:
        raise ValueError(f"{SCENARIO}: unexpected header {reader.fieldnames}")
    children = []
    for number, row in enumerate(reader, start=2):
        if row["sex"] not in SEX_CODE:
            raise ValueError(f"{SCENARIO} line {number}: sex must be male or female, found {row['sex']!r}")
        try:
            years, months = int(row["age_years"]), int(row["age_months"])
            height, weight = float(row["height_cm"]), float(row["weight_kg"])
        except ValueError as error:
            raise ValueError(f"{SCENARIO} line {number}: {error}") from error
        if not 0 <= months <= 11 or height <= 0 or weight <= 0:
            raise ValueError(f"{SCENARIO} line {number}: age months must be 0 to 11, height and weight positive")
        children.append({"child": row["child"], "sex": row["sex"], "years": years, "months": months, "height_cm": height, "weight_kg": weight})
    return children


def age_text(years: int, months: int) -> str:
    return f"{years} year{'' if years == 1 else 's'} {months} month{'' if months == 1 else 's'}"


def score_child(child: dict[str, object], table: dict[tuple[str, float], dict[str, str]], sex: str | None = None, completed_months: int | None = None) -> dict[str, object]:
    """Age is listed at the half month: 48.5 months stands for 48.0 up to 49.0 (CDC)."""
    months = 12 * child["years"] + child["months"] if completed_months is None else completed_months
    bmi = child["weight_kg"] / (child["height_cm"] / 100) ** 2
    result: dict[str, object] = {"child": child["child"], "sex": child["sex"], "age": age_text(child["years"], child["months"]),
                                 "completedMonths": months, "height_cm": fixed(child["height_cm"], 1), "weight_kg": fixed(child["weight_kg"], 1), "bmi": fixed(bmi, 2)}
    if not FIRST_MONTH <= months <= LAST_MONTH:
        result.update({"row": None, "unavailable": "The BMI-for-age charts cover ages 2 through 19 years (24 to 239 completed months); no percentile or category is given for this age.",
                       "method": None, "z": None, "percentile": None, "percentOfP95": None, "category": None})
        return result
    row = table[(SEX_CODE[sex or child["sex"]], months + 0.5)]
    score = score_bmi(bmi, row)
    result.update({
        "row": {"sex": SEX[row["sex"]], "agemos": row["agemos"], "line": int(row["line"]), "L": score["L"], "M": score["M"], "S": score["S"], "P95": score["P95"], "sigma": score["sigma"]},
        "method": score["method"], "z": fixed(score["z"], 3), "percentile": fixed(score["percentile"], 2),
        "percentOfP95": fixed(score["percentOfP95"], 1), "category": score["category"],
        "lmsZ": fixed(score["lmsZ"], 3), "lmsPercentile": fixed(score["lmsPercentile"], 2), "zCeiling": fixed(score["zCeiling"], 3),
    })
    return result


def adult_category(bmi: float) -> str:
    for limit, name in ADULT_CATEGORIES:
        if bmi < limit:
            return name
    raise ArithmeticError(f"no adult category for BMI {bmi}")


# ---------------------------------------------------------------- build

def build(folder: Path, out: Path) -> None:
    raws = {}
    for name in (TABLE_2022, TABLE_2000, SCENARIO):
        try:
            raws[name] = (folder / name).read_bytes()
        except OSError as error:
            raise SystemExit(f"{folder / name}: cannot read the input: {error}")
    rows_2022, shape_2022 = read_table(raws[TABLE_2022], TABLE_2022, COLUMNS_2022)
    rows_2000, shape_2000 = read_table(raws[TABLE_2000], TABLE_2000, COLUMNS_2000)
    table_2022 = keyed(rows_2022, "sex", "agemos")
    keyed(rows_2000, "Sex", "Agemos")
    checks = worked_examples(table_2022)
    tables = table_checks(rows_2022, rows_2000, table_2022)
    children = read_children(raws[SCENARIO])

    # HLT-001: what the tables hold.
    def ages(sex: str) -> list[float]:
        return sorted(age for code, age in table_2022 if code == sex)

    off_rule = sorted({age for sex in SEX for age in ages(sex) if age != int(age) + 0.5})
    medians_equal = sum(1 for row in rows_2022 if fixed(float(row["M"]), decimals_of(row["P50"])) == fixed(float(row["P50"]), decimals_of(row["P50"])))
    girl_twelve = []
    bmi_example = imperial_bmi(60, 136)
    for month in range(144, 156):
        result = score_bmi(bmi_example, table_2022[("2", month + 0.5)])
        girl_twelve.append({"agemos": month + 0.5, "percentile": fixed(result["percentile"], 2), "rounded": fixed(result["percentile"], 0)})
    inspection = {
        "source": "CDC National Center for Health Statistics: BMI-for-age data files of the CDC 2000 growth charts (bmiagerev.csv) and of the 2022 Extended BMI-for-age growth charts (bmi-age-2022.csv)",
        "measurement": "Body mass index (BMI), kg/m2, by sex (1 male, 2 female) and age in months",
        "files": {
            TABLE_2000: {**shape_2000, "columns": COLUMNS_2000, "note": "The header line is repeated before the rows for girls; a reader that does not skip it reads a row of text."},
            TABLE_2022: {**shape_2022, "columns": COLUMNS_2022},
        },
        "rowsPerSex": {SEX[sex]: len(ages(sex)) for sex in SEX},
        "ageRange": {"firstAgemos": ages("1")[0], "lastAgemos": ages("1")[-1]},
        "halfMonthRule": "Age is listed at the half month: 48.5 months stands for 48.0 up to, not including, 49.0 months (CDC).",
        "rowsOffTheRule": off_rule,
        "rowsOffTheRuleNote": "Each file also has a row at exactly 24.0 and 240.0 months for each sex. A child's age in completed months plus 0.5 never selects them.",
        "scoredAges": {"firstCompletedMonth": FIRST_MONTH, "lastCompletedMonth": LAST_MONTH, "note": "CDC's child and teen BMI categories cover ages 2 through 19; from age 20 the adult categories apply, so the 240.0 and 240.5 rows are not used here."},
        "negativeL": sum(1 for row in rows_2022 if float(row["L"]) < 0),
        "medianEqualsP50": medians_equal,
        "zCeilingRange": {"lowest": fixed(min(z_ceiling(float(row["L"]), float(row["S"])) for row in rows_2022), 3), "highest": fixed(max(z_ceiling(float(row["L"]), float(row["S"])) for row in rows_2022), 3)},
        "sameAs2000": tables["sameAs2000"],
        "categoriesExampleAcrossAgeTwelve": girl_twelve,
    }

    # HLT-002 and HLT-003: the fictional children.
    scored = [score_child(child, table_2022) for child in children]
    by_id = {child["child"]: child for child in children}
    scored_by_id = {row["child"]: row for row in scored}
    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator="\n")
    columns = ["child", "sex", "age", "completedMonths", "height_cm", "weight_kg", "bmi", "method", "z", "percentile", "percentOfP95", "category"]
    writer.writerow(columns + ["table_agemos"])
    for row in scored:
        writer.writerow([row[column] if row[column] is not None else "unavailable" for column in columns] + [row["row"]["agemos"] if row["row"] else "unavailable"])

    # Randori: each card changes one choice for one child.
    def card(title: str, child_id: str, changed: dict[str, object], change: str) -> dict[str, object]:
        base = scored_by_id[child_id]
        entry = {"title": title, "child": child_id, "change": change,
                 "before": {"percentile": base["percentile"], "z": base["z"], "category": base["category"]},
                 "after": changed}
        if "percentile" in changed and changed["percentile"] is not None:
            entry["percentileChange"] = fixed(float(changed["percentile"]) - float(base["percentile"]), 2)
        entry["categoryChanged"] = changed.get("category") != base["category"]
        return entry

    e = scored_by_id["E"]
    c_years = score_child(by_id["C"], table_2022, completed_months=12 * by_id["C"]["years"])
    c_other = score_child(by_id["C"], table_2022, sex="male")
    d_bmi = by_id["D"]["weight_kg"] / (by_id["D"]["height_cm"] / 100) ** 2
    cards = {
        "A": card("Score above the 95th percentile with the 2000 LMS formula instead of the extended method", "E",
                  {"percentile": e["lmsPercentile"], "z": e["lmsZ"], "category": e["category"], "zCeiling": e["zCeiling"]},
                  f"The LMS z-score for this row can never reach {e['zCeiling']}, however high the BMI."),
        "B": card("Use the age in completed years: the row for 15 years 0 months instead of 15 years 4 months", "C",
                  {"percentile": c_years["percentile"], "z": c_years["z"], "category": c_years["category"], "agemos": c_years["row"]["agemos"]},
                  f"Row {c_years['row']['agemos']} months instead of {scored_by_id['C']['row']['agemos']}."),
        "C": card("Read the row for the other sex", "C",
                  {"percentile": c_other["percentile"], "z": c_other["z"], "category": c_other["category"], "sex": c_other["row"]["sex"]},
                  "The boys' row for the same age."),
        "D": card("Apply the adult BMI categories to a child", "D",
                  {"percentile": None, "z": None, "category": adult_category(d_bmi)},
                  f"BMI {fixed(d_bmi, 2)} read against the adult cut-offs of 18.5, 25 and 30 kg/m2, which CDC applies from age 20 only."),
    }

    if out.exists():
        shutil.rmtree(out)
    (out / "randori").mkdir(parents=True)

    def write_json(name: str, value: object) -> None:
        (out / name).write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    t22 = tables["table2022"]
    t00 = tables["table2000"]
    write_json("reference-checks.json", {
        "source": "CDC National Center for Health Statistics: Extended BMI-for-age growth charts data files page, Child and teen BMI categories page, and the two BMI-for-age data files",
        "passed": len(checks), "failed": 0, "checks": checks, "tables": tables,
    })
    write_json("inspection.json", inspection)
    write_json("scores.json", {"method": "BMI = weight (kg) / height (m)^2. Up to the 95th percentile: LMS z and percentile (CDC 2000). Above it: the extended percentile and z (CDC 2022). Category: CDC child and teen BMI categories (underweight, healthy weight, overweight, obesity, severe obesity); severe obesity is 120 % of the 95th percentile or more.",
                               "children": scored})
    write_json("randori/cards.json", cards)
    (out / "children.csv").write_text(buffer.getvalue(), encoding="utf-8")

    lines = [
        "# Health pathway results",
        "",
        "Computed by `tools/health_pathway.py` with the method CDC publishes for its BMI-for-age growth charts. This is",
        "practice on fictional children, not a clinical assessment of any real child, and not medical advice.",
        "",
        f"- Worked examples: {len(checks)} of {len(checks)} values CDC prints reproduced (four examples on the extended",
        "  BMI-for-age data files page and one on the child and teen BMI categories page).",
        f"- The 2022 table: {t22['withinOneUnit']} of {t22['values']} printed percentiles and z-score values recomputed within one unit of",
        f"  the last printed digit; {t22['matchWhenRounded']} match exactly when rounded.",
        f"- The 2000 table: {t00['values']} printed percentiles recomputed within {t00['tolerance']} kg/m2 (largest difference {t00['largestDifference']});",
        f"  L, M and S are the same in both files ({tables['sameAs2000']['rows']} rows), as CDC states.",
        "- The fictional children: " + "; ".join(f"{row['child']} {row['category'] or 'unavailable'}" + (f" ({row['percentile']})" if row["percentile"] else "") for row in scored) + ".",
        "- Randori cards: " + "; ".join(f"{key} {value['before']['category']} to {value['after']['category']}" for key, value in cards.items()) + ".",
        "",
    ]
    (out / "summary.md").write_text("\n".join(lines), encoding="utf-8")

    outputs = sorted(p.relative_to(out).as_posix() for p in out.rglob("*") if p.is_file()) + ["manifest.json"]
    write_json("manifest.json", {
        "script": "tools/health_pathway.py",
        "python": f"{sys.version_info.major}.{sys.version_info.minor}",
        "inputs": {name: hashlib.sha256(raw).hexdigest() for name, raw in raws.items()},
        "method": {
            "referenceChecks": "CDC, Extended BMI-for-age growth charts: data files (four worked examples) and Child and teen BMI categories (one worked example); every percentile and z-score column of both data files",
            "lms": "z = ((BMI / M)^L - 1) / (L S); BMI = M (1 + L S z)^(1 / L) (CDC 2000 growth charts)",
            "extended": "Above the 95th percentile: percentile = 90 + 10 Phi((BMI - P95) / sigma); z = Phi^-1(percentile / 100) (CDC 2022 Extended BMI-for-age)",
            "age": "Completed months plus 0.5 selects the row; ages 2 through 19 years only",
            "normal": "Python statistics.NormalDist for Phi and its inverse",
        },
        "outputs": sorted(outputs),
    })


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: health_pathway.py <pathway folder> <output folder>", file=sys.stderr)
        return 2
    try:
        build(Path(argv[1]), Path(argv[2]))
    except ReferenceMismatch as error:
        print(f"CDC reference values did not reproduce; nothing written: {error}", file=sys.stderr)
        return 1
    except (ValueError, ArithmeticError, KeyError) as error:
        print(f"health pathway: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
