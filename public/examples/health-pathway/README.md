# Health pathway files

The worked example for the health pathway (/katas/health-pathway): from a growth reference table to a checked
BMI-for-age percentile. Everything under `generated/` is computed by `tools/health_pathway.py`. The site's CI reruns
the script on every pipeline (job `health_pathway`) and fails if any file differs from the published copy, so these
results are not typed by hand.

The children in `scenario/children.csv` are fictional. They are not measurements of any real child, and nothing here
is a clinical assessment, a diagnosis or medical advice.

## Files

| File | What it is | Terms |
| --- | --- | --- |
| `inputs/bmiagerev.csv` | CDC's BMI-for-age data file of the CDC 2000 growth charts, byte for byte | US government work, public domain (see below) |
| `inputs/bmi-age-2022.csv` | CDC's data file of the 2022 Extended BMI-for-age growth charts, byte for byte | US government work, public domain (see below) |
| `scenario/children.csv` | Six fictional children: sex, age in years and months, height and weight. Written by the Dojo | MIT, Developer Dojo |
| `tools/health_pathway.py` | The script: reference checks against CDC's worked examples and both tables, the table inspection, the scores and the Randori cards. Python 3.12 standard library only | MIT, Developer Dojo |
| `tools/fetch_input.py` | Downloads the two CDC files for a maintainer and prints their SHA-256. CI never runs it | MIT, Developer Dojo |
| `generated/reference-checks.json` | The values CDC prints in its worked examples, the script's values, and the recomputation of every column of both tables | MIT, Developer Dojo |
| `generated/inspection.json` | What the two tables hold, how age is listed, and where they differ (HLT-001) | MIT, Developer Dojo |
| `generated/scores.json` | Each fictional child's BMI, the table row used, the method, z-score, percentile, per cent of the 95th percentile and BMI category (HLT-002 and HLT-003) | MIT, Developer Dojo |
| `generated/children.csv` | The same scores, one row per child | MIT, Developer Dojo |
| `generated/randori/cards.json` | The four Randori cards recomputed | MIT, Developer Dojo |
| `generated/manifest.json` | Python version, the method, the SHA-256 of every input and the list of outputs | MIT, Developer Dojo |
| `generated/summary.md` | The results in one page | MIT, Developer Dojo |

## Sources

- **CDC 2000 growth charts, BMI-for-age data file.** `https://www.cdc.gov/growthcharts/data/zscore/bmiagerev.csv`,
  downloaded on 2026-11-26: 72,022 bytes, SHA-256
  `cbeea0e8d500ee15c652f3fdc45bcd02cb9c15d4d1e86f4d8048bbfea8d166e5`.
- **CDC 2022 Extended BMI-for-age growth charts, data file.**
  `https://www.cdc.gov/growthcharts/data/extended-bmi/bmi-age-2022.csv`, downloaded on 2026-11-26: 124,895 bytes,
  SHA-256 `7f416a213157a5209bb6cbfd1b19292510248f3f31fe43c9ff63f6d8e39f7890`.
- **The method and the worked examples.** CDC, "Extended BMI-for-age growth charts: data files",
  `https://www.cdc.gov/growthcharts/extended-bmi-data-files.htm` (last reviewed by CDC on 2 September 2024; read on
  2026-11-26). It gives the formulas below and four worked examples, each with the table values it uses. It cites
  National Health Statistics Reports no. 63 (2013) on the construction of the LMS parameters and Annals of Human
  Biology 47(6):514-521 (2020) on the method above the 95th percentile.
- **The categories.** CDC, "Child and teen BMI categories",
  `https://www.cdc.gov/bmi/child-teen-calculator/bmi-categories.html` (read on 2026-11-26): underweight below the
  5th percentile, healthy weight from the 5th to below the 85th, overweight from the 85th to below the 95th, obesity
  at the 95th or above, and severe obesity at 120 % of the 95th percentile or above. Its worked example (a 12-year-old
  girl, 5 feet tall and 136 pounds, BMI 26.6, 96th percentile) is reproduced too. CDC, "Adult BMI categories",
  `https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html`, gives the cut-offs one Randori card misapplies.
- **Terms.** CDC's page on reusing its material (`https://www.cdc.gov/other/agencymaterials.html`, read on
  2026-11-26) says most information on CDC's websites is not subject to copyright, is in the public domain and may be
  freely used or reproduced; the exceptions are logos and marks, and material from contractors or third parties,
  which carries a copyright statement. The two data files carry none and are works of CDC's National Center for
  Health Statistics. No CDC or HHS logo is used, and nothing here implies endorsement by CDC.

## Method

- **Inspection.** Both files must be ASCII with CRLF line endings and the expected columns; the script stops
  otherwise. The 2000 file repeats its header line before the rows for girls (line 221), which the script reports
  and skips. Age is listed at the half month: 48.5 months stands for 48.0 up to, not including, 49.0 months. Each
  file also has rows at exactly 24.0 and 240.0 months, which an age in completed months never selects.
- **Up to the 95th percentile (LMS).** z = ((BMI / M)^L - 1) / (L S), percentile = 100 Phi(z), and the reverse,
  BMI = M (1 + L S z)^(1 / L), with L, M and S from the row for the child's sex and age.
- **Above the 95th percentile (extended).** percentile = 90 + 10 Phi((BMI - P95) / sigma) and
  z = Phi^-1(percentile / 100), with P95 and sigma from the same row; the reverse is
  BMI = Phi^-1((percentile - 90) / 10) sigma + P95. Phi is the standard normal distribution
  (`statistics.NormalDist`).
- **Why both.** L is negative in every row, so the LMS z-score can never reach -1 / (L S), however high the BMI: it
  compresses the highest values. The extended method spreads them out again. `scores.json` gives both z-scores
  and this ceiling for every child.
- **Age.** A child's age in completed months plus 0.5 selects the row. Ages 2 through 19 years (24 to 239 completed
  months) are scored; at any other age the result is unavailable, never zero.
- **Reference checks.** The worked examples must match at the precision CDC prints, or the script writes nothing.
  Every percentile and z-score column of the 2022 file is recomputed from the row's own L, M, S and sigma and must
  be within one unit of its last printed digit; the counts of exact matches and the largest difference are in
  `reference-checks.json`. The 2000 file prints eight decimals, but its L, M and S carry only about nine significant
  digits, so its percentiles must agree within 0.000001 kg/m2.

## Rerun the checks

Python 3.12 (the CI image is `python:3.12-slim`); nothing to install:

    python3.12 -I tools/health_pathway.py . my-output
    diff -r my-output generated

Run it from this folder. The script removes and recreates the output folder you name, so give it a new one. It
first reproduces CDC's published values and exits with an error, writing nothing, if any differs. `diff` prints
nothing when your results match the published ones. Another Python version changes only the `python` field in
`manifest.json`.

## Limits

- This is practice on fictional children, not a clinical assessment or medical advice. BMI is a screening measure,
  not a diagnosis; CDC says so, and so does every page of this pathway. No paediatrician, registered dietitian or
  epidemiologist has reviewed it.
- Only BMI-for-age is covered. Weight-for-age, height-for-age, the WHO growth standards used under age 2, and
  measurement technique are not.
- Ages between table rows are not interpolated, and the sigma regression CDC gives for ages finer than a month is
  not used.
- In the 2022 table, a few dozen printed values are more than half a unit but less than one unit from the value
  recomputed from the row's own parameters; `reference-checks.json` gives the count and the largest difference for
  each column.
- No learner has run these katas yet.
