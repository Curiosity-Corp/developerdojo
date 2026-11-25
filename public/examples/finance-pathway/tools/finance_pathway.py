"""Finance pathway (Developer Dojo): from a loan's terms to a checked annual percentage rate.

    python -I tools/finance_pathway.py <pathway folder> <output folder>

Standard library only. The method is the actuarial method of Regulation Z (12 CFR part 1026), Appendix J, and the
accuracy tolerance of 12 CFR 1026.22(a). The script first reproduces the worked examples Appendix J publishes:
the iteration of paragraph (b)(9), and the unit-periods and annual percentage rates of the examples in paragraphs
(c)(1) and (c)(3). If any differs, it exits with an error and writes nothing. Then it writes:

- reference-checks.json: every published value next to the computed one;
- apr.json: each example's terms, its unit-periods worked out from its dates, and its annual percentage rate;
- schedule.csv and disclosure.json: example (c)(1)(i) amortized to the cent, and its disclosure figures;
- tolerance.json: the tolerance read from the served text of 1026.22, applied to every example, and what happens
  when the odd days before the first payment are ignored;
- randori/cards.json: the Randori cards recomputed;
- manifest.json and summary.md.

Appendix J and 1026.22 are US government works. The numbers below are the terms and results Appendix J prints
in its examples (the examples are images in the regulation; the paragraph is named next to each).
"""

from __future__ import annotations

import calendar
import csv
import hashlib
import html
import io
import json
import re
import shutil
import sys
from dataclasses import dataclass
from datetime import date
from decimal import ROUND_CEILING, ROUND_FLOOR, ROUND_HALF_UP, Decimal
from fractions import Fraction
from pathlib import Path

INPUT = "inputs/ecfr-12-cfr-1026-22.xml"
CENT = Decimal("0.01")


@dataclass(frozen=True)
class Example:
    id: str
    paragraph: str
    title: str
    advance: Decimal  # A, the amount advanced
    payment: Decimal  # P, the regular payment
    count: int  # n, the number of payments
    unit: str  # month, semimonth or week
    unit_length: int  # months per unit-period (month), or weeks per unit-period (week)
    per_year: int  # w, unit-periods per year
    advanced_on: date
    first_payment_on: date
    published_t: int
    published_f: str  # as printed, unreduced
    published_apr: str  # as printed, percent
    final_payment: Decimal | None = None  # Pn, when the final payment differs


# Appendix J, paragraph (c)(1), examples (i) to (v), and paragraph (c)(3), examples (i) and (ii).
EXAMPLES = [
    Example("c1-i", "(c)(1) example (i)", "Monthly payments, regular first period", Decimal("5000"), Decimal("230"), 24, "month", 1, 12, date(1978, 1, 10), date(1978, 2, 10), 1, "0", "9.69"),
    Example("c1-ii", "(c)(1) example (ii)", "Monthly payments, long first period", Decimal("6000"), Decimal("200"), 36, "month", 1, 12, date(1978, 2, 10), date(1978, 4, 1), 1, "19/30", "11.82"),
    Example("c1-iii", "(c)(1) example (iii)", "Semimonthly payments, short first period", Decimal("5000"), Decimal("219.17"), 24, "semimonth", 1, 24, date(1978, 2, 23), date(1978, 3, 1), 0, "6/15", "10.34"),
    Example("c1-iv", "(c)(1) example (iv)", "Quarterly payments, long first period", Decimal("10000"), Decimal("385"), 40, "month", 3, 4, date(1978, 5, 23), date(1978, 10, 1), 1, "39/90", "8.97"),
    Example("c1-v", "(c)(1) example (v)", "Weekly payments, long first period", Decimal("500"), Decimal("17.60"), 30, "week", 1, 52, date(1978, 3, 20), date(1978, 4, 21), 4, "4/7", "14.96"),
    Example("c3-i", "(c)(3) example (i)", "Monthly payments, regular first period, irregular final payment", Decimal("5000"), Decimal("230"), 24, "month", 1, 12, date(1978, 1, 10), date(1978, 2, 10), 1, "0", "10.50", Decimal("280")),
    Example("c3-ii", "(c)(3) example (ii)", "Payments every 2 weeks, short first period, irregular final payment", Decimal("200"), Decimal("9.50"), 20, "week", 2, 26, date(1978, 4, 3), date(1978, 4, 11), 0, "8/14", "12.22", Decimal("30")),
]

# Appendix J, paragraph (b)(9): the iteration worked for A = 1000, P = 33.61, n = 36, monthly, t = 1, f = 0.
# Appendix J says its rates came from a 10-digit programmable calculator, so the printed intermediate values are
# compared at the precision both agree to; the annual percentage rate at the two decimals the appendix requires.
B9 = {"advance": Decimal("1000"), "payment": Decimal("33.61"), "count": 36, "per_year": 12, "t": 1, "f": Fraction(0), "first_estimate": 12.50}
B9_PUBLISHED = [
    ("b9-A1", "A′ at the first estimate, 12.50 %", "1004.674391", 4),
    ("b9-A2", "A″ at 12.60 %", "1003.235366", 4),
    ("b9-I1", "Interpolated rate after step 3, %", "12.82483042", 4),
    ("b9-I2", "Rate after the first iteration, %", "12.82557859", 4),
    ("b9-I3", "Rate after the second iteration, %", "12.82557529", 4),
    ("b9-APR", "Annual percentage rate, %", "12.83", 2),
]


class ReferenceMismatch(Exception):
    pass


def rounded(value: float | Decimal, places: int) -> Decimal:
    return Decimal(str(value)).quantize(Decimal(1).scaleb(-places), rounding=ROUND_HALF_UP)


def add_months(day: date, months: int) -> date:
    """The same date in another month; the last day of the month when it has no such date (Appendix J (b)(3)(iv))."""
    index = day.year * 12 + day.month - 1 + months
    year, month = divmod(index, 12)
    return date(year, month + 1, min(day.day, calendar.monthrange(year, month + 1)[1]))


def unit_periods(earlier: date, later: date, unit: str, unit_length: int) -> tuple[int, Fraction]:
    """Full unit-periods t and the fraction f between two dates, by Appendix J (b)(5)(ii) to (iv)."""
    if later < earlier:
        raise ValueError(f"{later} is before {earlier}")
    if unit == "week":
        days = (later - earlier).days
        per = 7 * unit_length
        return days // per, Fraction(days % per, per)
    if unit not in ("month", "semimonth"):
        raise ValueError(f"unit-period {unit!r} is not handled")
    months = 0
    while add_months(later, -(months + 1)) >= earlier:
        months += 1
    remaining_days = (add_months(later, -months) - earlier).days
    if unit == "month" and unit_length == 1:
        return months, Fraction(remaining_days, 30)  # (b)(5)(ii)
    days = 30 * months + remaining_days  # (b)(5)(iii)
    per = 15 if unit == "semimonth" else 30 * unit_length
    return days // per, Fraction(days % per, per)


def payments_of(example: Example | dict, t: int, f: Fraction) -> list[tuple[float, int, float]]:
    """Each payment with its whole unit-periods and fraction from the advance (general equation, (b)(8))."""
    count = example.count if isinstance(example, Example) else example["count"]
    payment = example.payment if isinstance(example, Example) else example["payment"]
    final = example.final_payment if isinstance(example, Example) else None
    rows = [(float(payment), t + k, float(f)) for k in range(count)]
    if final is not None:
        rows[-1] = (float(final), t + count - 1, float(f))
    return rows


def present_value(rate_percent: float, per_year: int, payments: list[tuple[float, int, float]]) -> float:
    i = rate_percent / (100 * per_year)
    return sum(amount / ((1 + fraction * i) * (1 + i) ** periods) for amount, periods, fraction in payments)


def solve_apr(advance: float, per_year: int, payments: list[tuple[float, int, float]], first_estimate: float = 12.50) -> list[dict[str, float]]:
    """The iteration of Appendix J (b)(9): evaluate at I1 and I1 + 0.1, interpolate, repeat until it settles."""
    steps = []
    estimate = first_estimate
    for _ in range(100):
        a1 = present_value(estimate, per_year, payments)
        a2 = present_value(estimate + 0.1, per_year, payments)
        new = estimate + 0.1 * (advance - a1) / (a2 - a1)
        steps.append({"I1": estimate, "A1": a1, "A2": a2, "I": new})
        if abs(new - estimate) < 1e-10:
            return steps
        estimate = new
    raise ArithmeticError("the iteration did not settle in 100 steps")


def tolerances(xml: str) -> dict[str, object]:
    """Read the two accuracy tolerances from the served text of 12 CFR 1026.22(a)(2) and (a)(3)."""
    text = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", xml)))
    found = {}
    for key, opening in (("regular", "(2) As a general rule"), ("irregular", "(3) In an irregular transaction")):
        match = re.search(re.escape(opening) + r"[^.]*?not more than (\d+)/(\d+) of 1 percentage point above or below[^.]*\.", text)
        if not match:
            raise ValueError(f"12 CFR 1026.22: the sentence starting {opening!r} with a tolerance was not found in {INPUT}")
        found[key] = {"paragraph": "1026.22(a)" + opening[:3], "percentagePoints": str(Decimal(match.group(1)) / Decimal(match.group(2))), "text": match.group(0)}
    definition = re.search(r"an irregular transaction is one that includes[^.]*\.", text)
    if not definition:
        raise ValueError(f"12 CFR 1026.22(a)(3): the definition of an irregular transaction was not found in {INPUT}")
    found["irregularDefinition"] = definition.group(0)
    return found


def reference_checks() -> tuple[list[dict[str, object]], dict[str, dict[str, object]]]:
    checks: list[dict[str, object]] = []

    def check(check_id: str, source: str, quantity: str, published: str, computed: float | Decimal | str, places: int | None, note: str | None = None) -> None:
        shown = str(computed) if places is None else str(rounded(computed, places))
        expected = published if places is None else str(rounded(Decimal(published), places))
        row: dict[str, object] = {"id": check_id, "source": source, "quantity": quantity, "published": published, "computed": shown, "status": "pass" if shown == expected else "fail"}
        if note:
            row["note"] = note
        checks.append(row)

    b9_payments = payments_of(B9, B9["t"], B9["f"])
    steps = solve_apr(float(B9["advance"]), B9["per_year"], b9_payments, B9["first_estimate"])
    b9_values = [steps[0]["A1"], steps[0]["A2"], steps[0]["I"], steps[1]["I"], steps[2]["I"], steps[-1]["I"]]
    for (check_id, quantity, published, places), value in zip(B9_PUBLISHED, b9_values):
        note = None if places == 2 else "Appendix J prints this from a 10-digit calculator; compared at 4 decimals"
        check(check_id, "Appendix J (b)(9)", quantity, published, value, places, note)

    results: dict[str, dict[str, object]] = {}
    for example in EXAMPLES:
        t, f = unit_periods(example.advanced_on, example.first_payment_on, example.unit, example.unit_length)
        source = "Appendix J " + example.paragraph
        published_tf = f"t = {example.published_t}; f = {example.published_f}"
        # The appendix prints f unreduced (6/15); equal fractions are the same value.
        computed_tf = published_tf if (t, f) == (example.published_t, Fraction(example.published_f)) else f"t = {t}; f = {fraction_text(f)}"
        check(example.id + "-tf", source, "Unit-periods from the advance to the first payment", published_tf, computed_tf, None)
        exact = solve_apr(float(example.advance), example.per_year, payments_of(example, t, f))[-1]["I"]
        check(example.id + "-APR", source, "Annual percentage rate, %", example.published_apr, exact, 2)
        results[example.id] = {"t": t, "f": f, "exact": exact}
    return checks, results


def fraction_text(value: Fraction) -> str:
    return "0" if value == 0 else f"{value.numerator}/{value.denominator}"


def amortize(example: Example, exact_apr: float) -> tuple[list[list[str]], dict[str, object]]:
    """Example (c)(1)(i) at its exact periodic rate, interest rounded half up to the cent each month."""
    i = Decimal(repr(exact_apr)) / Decimal(100 * example.per_year)
    balance = example.advance
    rows = []
    interest_total = Decimal(0)
    for k in range(example.count):
        due = add_months(example.first_payment_on, k)
        interest = (balance * i).quantize(CENT, rounding=ROUND_HALF_UP)
        principal = example.payment - interest
        balance -= principal
        interest_total += interest
        rows.append([str(k + 1), due.isoformat(), f"{example.payment:.2f}", f"{interest:.2f}", f"{principal:.2f}", f"{balance:.2f}"])
    total = example.payment * example.count
    disclosure = {
        "example": "Appendix J " + example.paragraph,
        "assumption": "Appendix J gives only the amount advanced; the box treats it as the amount financed, with no prepaid finance charge and nothing else financed.",
        "amountFinanced": f"{example.advance:.2f}",
        "totalOfPayments": f"{total:.2f}",
        "financeCharge": f"{total - example.advance:.2f}",
        "annualPercentageRate": f"{rounded(exact_apr, 2)}",
        "periodicRate": f"{rounded(i, 10)}",
        "interestInSchedule": f"{interest_total:.2f}",
        "balanceAfterLastPayment": f"{balance:.2f}",
        "rounding": "Interest each month is the balance times the periodic rate, rounded half up to the cent; the balance after the last payment shows what that rounding leaves.",
        "disclosureTerms": {
            "amountFinanced": "12 CFR 1026.18(b)",
            "financeCharge": "12 CFR 1026.18(d)",
            "annualPercentageRate": "12 CFR 1026.18(e)",
            "totalOfPayments": "12 CFR 1026.18(h)",
        },
    }
    return rows, disclosure


def accurate_band(exact: float, tolerance: Decimal) -> tuple[str, str]:
    value = Decimal(repr(exact))
    low = (value - tolerance).quantize(CENT, rounding=ROUND_CEILING)
    high = (value + tolerance).quantize(CENT, rounding=ROUND_FLOOR)
    return str(low), str(high)


def build(folder: Path, out: Path) -> None:
    source = folder / INPUT
    try:
        raw = source.read_bytes()
    except OSError as error:
        raise SystemExit(f"{source}: cannot read the input: {error}")
    tol = tolerances(raw.decode("utf-8"))
    regular = Decimal(tol["regular"]["percentagePoints"])  # type: ignore[index]

    checks, results = reference_checks()
    failed = [c for c in checks if c["status"] != "pass"]
    if failed:
        raise ReferenceMismatch("; ".join(f"{c['id']}: published {c['published']}, computed {c['computed']}" for c in failed))

    apr_rows = {}
    tolerance_rows = {}
    for example in EXAMPLES:
        r = results[example.id]
        exact = float(r["exact"])  # type: ignore[arg-type]
        apr_rows[example.id] = {
            "paragraph": "Appendix J " + example.paragraph,
            "title": example.title,
            "amountAdvanced": f"{example.advance:.2f}",
            "payment": f"{example.payment:.2f}",
            "finalPayment": None if example.final_payment is None else f"{example.final_payment:.2f}",
            "payments": example.count,
            "unitPeriod": f"{example.unit_length} {example.unit}" + ("s" if example.unit_length > 1 else ""),
            "unitPeriodsPerYear": example.per_year,
            "advancedOn": example.advanced_on.isoformat(),
            "firstPaymentOn": example.first_payment_on.isoformat(),
            "t": r["t"],
            "f": example.published_f,  # equal to the computed fraction (checked above), as Appendix J prints it
            "apr_percent": str(rounded(exact, 2)),
            "aprUnrounded_percent": str(rounded(exact, 6)),
        }
        # The shortcut: treat the first payment as exactly one unit-period after the advance.
        shortcut = solve_apr(float(example.advance), example.per_year, payments_of(example, 1, Fraction(0)))[-1]["I"]
        low, high = accurate_band(exact, regular)
        tolerance_rows[example.id] = {
            "tolerance_percentagePoints": str(regular),
            "tolerance": "regular: an odd first period and an irregular first or final payment do not make a transaction irregular (1026.22(a)(3))",
            "accurateDisclosures_percent": [low, high],
            "ignoringOddDays_percent": str(rounded(shortcut, 2)),
            "ignoringOddDaysDifference_percentagePoints": str(rounded(shortcut - exact, 2)),
            "ignoringOddDaysWithinTolerance": abs(Decimal(repr(shortcut)) - Decimal(repr(exact))) <= regular,
        }

    base = EXAMPLES[0]
    schedule, disclosure = amortize(base, float(results[base.id]["exact"]))  # type: ignore[arg-type]

    base_exact = float(results[base.id]["exact"])  # type: ignore[arg-type]
    card_terms = {
        "A": ("The first payment moves one month later, to 10 March 1978", base.advance, payments_of(base, 2, Fraction(0))),
        "B": ("$50 of the $5,000 is a prepaid finance charge, so the amount financed is $4,950", base.advance - 50, payments_of(base, 1, Fraction(0))),
        "C": ("The final payment is $280 instead of $230 (Appendix J (c)(3) example (i))", base.advance, payments_of(EXAMPLES[5], 1, Fraction(0))),
    }
    cards = {}
    for card_id, (title, advance, payments) in card_terms.items():
        apr = solve_apr(float(advance), base.per_year, payments)[-1]["I"]
        change = Decimal(repr(apr)) - Decimal(repr(base_exact))
        cards[card_id] = {
            "title": title,
            "apr_percent": str(rounded(apr, 2)),
            "change_percentagePoints": str(rounded(change, 2)),
            "beyondTolerance": abs(change) > regular,
        }

    if out.exists():
        shutil.rmtree(out)
    (out / "randori").mkdir(parents=True)

    def write_json(name: str, value: object) -> None:
        (out / name).write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    passed = len(checks)
    write_json("reference-checks.json", {"source": "Regulation Z, 12 CFR part 1026, Appendix J", "passed": passed, "failed": 0, "checks": checks})
    write_json("apr.json", apr_rows)
    write_json("disclosure.json", disclosure)
    write_json("tolerance.json", {"source": "12 CFR 1026.22(a), as served in " + INPUT, "regular": tol["regular"], "irregular": tol["irregular"], "irregularDefinition": tol["irregularDefinition"], "examples": tolerance_rows})
    write_json("randori/cards.json", cards)
    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator="\n")
    writer.writerow(["payment", "date", "payment_usd", "interest_usd", "principal_usd", "balance_usd"])
    writer.writerows(schedule)
    (out / "schedule.csv").write_text(buffer.getvalue(), encoding="utf-8")

    outside = [k for k, row in tolerance_rows.items() if not row["ignoringOddDaysWithinTolerance"]]
    summary = [
        "# Finance pathway results",
        "",
        "Computed by `tools/finance_pathway.py` with the actuarial method of Regulation Z, Appendix J. This is practice",
        "on the regulation's own examples, not a compliance review of any real loan or disclosure.",
        "",
        f"- Reference checks: {passed} of {passed} published Appendix J values reproduced (the (b)(9) iteration, and the",
        "  unit-periods and annual percentage rates of the (c)(1) and (c)(3) examples).",
        f"- Example (c)(1)(i): amount financed ${disclosure['amountFinanced']}, finance charge ${disclosure['financeCharge']},",
        f"  total of payments ${disclosure['totalOfPayments']}, annual percentage rate {disclosure['annualPercentageRate']} %.",
        f"  Amortized at that rate with interest rounded to the cent, the balance after the last payment is ${disclosure['balanceAfterLastPayment']}.",
        f"- Tolerance read from 12 CFR 1026.22(a)(2): {regular} percentage point for a regular transaction.",
        f"- Ignoring the odd days before the first payment moves the rate beyond that tolerance in {len(outside)} of {len(EXAMPLES)} examples ({', '.join(outside)}).",
        "- Randori cards: " + "; ".join(f"{k} {v['change_percentagePoints']} points" for k, v in cards.items()) + ".",
        "",
    ]
    (out / "summary.md").write_text("\n".join(summary), encoding="utf-8")

    outputs = sorted(p.relative_to(out).as_posix() for p in out.rglob("*") if p.is_file()) + ["manifest.json"]
    write_json("manifest.json", {
        "script": "tools/finance_pathway.py",
        "python": f"{sys.version_info.major}.{sys.version_info.minor}",
        "inputs": {INPUT: hashlib.sha256(raw).hexdigest()},
        "method": {
            "referenceChecks": "Regulation Z, 12 CFR part 1026, Appendix J: the iteration of paragraph (b)(9) and the examples of paragraphs (c)(1) and (c)(3)",
            "unitPeriods": "Appendix J (b)(5)(ii) to (iv): full unit-periods and the fraction from the dates of the advance and the first payment",
            "apr": "Appendix J (b)(8) general equation, solved by the (b)(9) iteration until the rate changes by less than 1e-10 percent",
            "tolerance": "12 CFR 1026.22(a)(2) and (a)(3), read from the served text",
            "schedule": "interest each unit-period is the balance times the unrounded periodic rate, rounded half up to the cent",
        },
        "outputs": sorted(outputs),
    })


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: finance_pathway.py <pathway folder> <output folder>", file=sys.stderr)
        return 2
    try:
        build(Path(argv[1]), Path(argv[2]))
    except ReferenceMismatch as error:
        print(f"Appendix J reference values did not reproduce; nothing written: {error}", file=sys.stderr)
        return 1
    except (ValueError, ArithmeticError) as error:
        print(f"finance pathway: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
