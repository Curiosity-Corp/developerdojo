# Finance pathway files

The worked example for the finance pathway (/katas/finance-pathway): from a loan's terms to a checked annual
percentage rate. Everything under `generated/` is computed by `tools/finance_pathway.py`. The site's CI reruns the
script on every pipeline (job `finance_pathway`) and fails if any file differs from the published copy, so these
results are not typed by hand.

## Files

| File | What it is | Terms |
| --- | --- | --- |
| `inputs/ecfr-12-cfr-1026-22.xml` | 12 CFR 1026.22 (Regulation Z, determination of the annual percentage rate), exactly as the eCFR served it for 2026-11-23 | US government work (see below) |
| `tools/finance_pathway.py` | The script: reference checks against Appendix J, unit-periods from dates, the annual percentage rate, the schedule, the tolerance and the Randori cards. Python 3.12 standard library only | MIT, Developer Dojo |
| `tools/fetch_input.py` | Downloads 12 CFR 1026.22 for a maintainer, for a date given, and prints its SHA-256. CI never runs it | MIT, Developer Dojo |
| `generated/reference-checks.json` | The values Appendix J publishes in its worked examples and the script's values | MIT, Developer Dojo |
| `generated/apr.json` | Each example's terms, its unit-periods worked out from its dates, and its annual percentage rate | MIT, Developer Dojo |
| `generated/schedule.csv` | Example (c)(1)(i) amortized month by month: date, payment, interest, principal and balance | MIT, Developer Dojo |
| `generated/disclosure.json` | The disclosure figures of example (c)(1)(i): amount financed, finance charge, total of payments and annual percentage rate | MIT, Developer Dojo |
| `generated/tolerance.json` | The tolerances read from 12 CFR 1026.22(a), the range of accurate disclosures for each example, and the effect of ignoring the odd days before the first payment | MIT, Developer Dojo |
| `generated/randori/cards.json` | The three Randori cards recomputed | MIT, Developer Dojo |
| `generated/manifest.json` | Python version, the method, the SHA-256 of the input and the list of outputs | MIT, Developer Dojo |
| `generated/summary.md` | The results in one page | MIT, Developer Dojo |

## Sources

- **Regulation Z, Appendix J** (12 CFR part 1026, Appendix J, the actuarial method for closed-end credit),
  published by the Consumer Financial Protection Bureau, read on 2026-11-25 at
  `https://www.consumerfinance.gov/rules-policy/regulations/1026/j/`. Its general equation, the (b)(5) rules for
  counting unit-periods between dates, the iteration of paragraph (b)(9) and the examples of paragraphs (c)(1) and
  (c)(3) are the method and the reference values. The examples are printed as images in the regulation, so the
  script holds their terms and results and names the paragraph of each.
- **12 CFR 1026.22** (determination of the annual percentage rate; the accuracy tolerances in (a)(2) and (a)(3)),
  from the eCFR point-in-time API for 2026-11-23,
  `https://www.ecfr.gov/api/versioner/v1/full/2026-11-23/title-12.xml?part=1026&section=1026.22`, served here
  unchanged, SHA-256 `ed61b93aa82d23aa6f02600936871b1e00432b34507fdd9c681fbbbaf2db0d7e`. The script reads the
  tolerances from this text rather than from a typed number.
- **12 CFR 1026.18** (content of disclosures: amount financed, finance charge, annual percentage rate and total of
  payments), read on 2026-11-25 at `https://www.consumerfinance.gov/rules-policy/regulations/1026/18/`. Cited only.
- **Terms.** The Code of Federal Regulations is a work of the United States government and is not subject to
  copyright in the United States (17 U.S.C. 105). The eCFR is an editorial compilation, not the official legal
  edition; the official edition is the annual Code of Federal Regulations and the Federal Register.

## Method

- **Unit-periods.** From the date of the advance to the first payment, by Appendix J (b)(5): for a monthly
  unit-period, full months are counted back from the later date and the remaining days are divided by 30; for a
  semimonthly or multimonthly one, days are 30 per full month plus the remaining days, divided by 15 or by 30 per
  month of the unit-period; for weekly ones, days are divided by 7 per week. A date the month does not have becomes
  the month's last day.
- **Annual percentage rate.** The general equation of (b)(8): the amount advanced equals the sum of the payments,
  each discounted by (1 + f i)(1 + i)^t for its whole unit-periods t and fraction f, where i is the rate per
  unit-period and the annual percentage rate is i times the unit-periods per year. It is solved by the iteration of
  (b)(9): evaluate at an estimate and at the estimate plus 0.1, interpolate, and repeat until the rate changes by
  less than 1e-10 percent.
- **Schedule.** Example (c)(1)(i) at its unrounded periodic rate. Each month the interest is the balance times
  that rate, rounded half up to the cent. The balance after the last payment shows what the rounding leaves.
- **Disclosure figures.** Total of payments is the sum of the scheduled payments; the finance charge is the total
  of payments minus the amount financed. Appendix J gives only the amount advanced, so the example treats it as the
  amount financed, with no prepaid finance charge and nothing else financed.
- **Tolerance.** 1/8 of 1 percentage point for a regular transaction and 1/4 for an irregular one, read from the
  served text of 1026.22(a)(2) and (a)(3). By (a)(3), an odd first period and an irregular first or final payment do
  not make a transaction irregular, so every example here uses 1/8.

## Rerun the checks

Python 3.12 (the CI image is `python:3.12-slim`); nothing to install:

    python3.12 -I tools/finance_pathway.py . my-output
    diff -r my-output generated

Run it from this folder. The script removes and recreates the output folder you name, so give it a new one. It
first reproduces Appendix J's worked examples and exits with an error, writing nothing, if any differs. `diff`
prints nothing when your results match the published ones. Another Python version changes only the `python` field
in `manifest.json`.

## Limits

- This is practice on the regulation's own examples, not a compliance review. Nothing here says that any real loan,
  disclosure or calculation tool meets Regulation Z, and no compliance specialist, lawyer or accountant has reviewed
  it.
- Only closed-end credit with a single advance and a regular series of payments (with an odd first period or an odd
  final payment) is covered. Multiple advances, irregular payment series, the United States Rule method, open-end
  credit, mortgage-specific tolerances (1026.22(a)(4) and (a)(5)) and the rules on what belongs in the finance
  charge (1026.4) are not.
- What a real finance charge includes depends on the fees of the real transaction; the example has none.
- Appendix J's examples use dates in 1978 and are illustrative; they are not a current market rate or offer.
- No learner has run these katas yet.
