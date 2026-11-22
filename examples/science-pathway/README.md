# Science pathway files

The worked example for the science and research pathway (/katas/science-pathway). Everything under `generated/`
is computed by `tools/science_pathway.py`. The site's CI reruns the script on every pipeline (job
`science_pathway`) and fails if any file differs from the published copy, so these results are not typed by hand.

## Files

| File | What it is | Terms |
| --- | --- | --- |
| `inputs/gistemp-v4-global-land-ocean.csv` | NASA GISS GISTEMP v4 global land-ocean temperature anomalies (GLB.Ts+dSST.csv), monthly, annual and seasonal means from 1880, exactly as NASA served it | US government work (see below) |
| `tools/science_pathway.py` | The script: reference checks against the GUM, the record inspection, the uncertainty budget, the least-squares line and the Randori cards. Python 3.12 standard library only | MIT, Developer Dojo |
| `tools/fetch_input.py` | Downloads a new copy of the record for a maintainer and prints its SHA-256. CI never runs it | MIT, Developer Dojo |
| `generated/reference-checks.json` | The GUM's published worked-example values (Annex H.2 and H.3) and the script's values | MIT, Developer Dojo |
| `generated/inspection.json` | Years, columns, unit, unavailable cells, ranges, the base period and the annual-against-monthly check | MIT, Developer Dojo |
| `generated/uncertainty-budget.json` | GUM H.2: inputs, their Type A standard uncertainties and correlations, and R, X and Z with their combined standard uncertainties | MIT, Developer Dojo |
| `generated/uncertainty-budget.csv` | The same budget as rows: output, input, sensitivity coefficient, standard uncertainty and contribution | MIT, Developer Dojo |
| `generated/trend.json` | The least-squares line through the 1991-2020 annual means, with the standard uncertainties of its parameters | MIT, Developer Dojo |
| `generated/trend-residuals.csv` | Year, annual mean, fitted value and residual | MIT, Developer Dojo |
| `generated/randori/cards.json` | The three Randori cards recomputed | MIT, Developer Dojo |
| `generated/manifest.json` | Python version, the method, the SHA-256 of the input and the list of outputs | MIT, Developer Dojo |
| `generated/summary.md` | The results in one page | MIT, Developer Dojo |

## Sources

- **Temperature record.** GISTEMP Team, 2026: GISS Surface Temperature Analysis (GISTEMP), version 4. NASA
  Goddard Institute for Space Studies. Dataset accessed 2026-11-21 at
  `https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv`, SHA-256 `a7b1939db2e7e484c798e925e0f07f8184356c52ac0e7ce264adcd0f25e81253`.
  Analysis paper: doi:10.1029/2023JD040179 (2024). GISTEMP combines NOAA GHCN v4 (land stations) and ERSST v5
  (sea surface). GISS revises the record every month as new data arrive, so a new download differs: this folder
  pins one copy by its hash. Terms: NASA material is generally not subject to copyright in the United States
  (17 U.S.C. 105); NASA asks to be acknowledged as the source and its use must not imply NASA endorsement.
- **Method and reference values.** JCGM 100:2008, Evaluation of measurement data, Guide to the expression of
  uncertainty in measurement (GUM), `https://www.bipm.org/en/doi/10.59161/JCGM100-2008E`: clause 4.2 (Type A
  evaluation, eqs. 3 to 5), clause 5.2 (correlated inputs, eqs. 16 and 17), Annex H.2 (Tables H.2 to H.5) and
  Annex H.3 (Table H.6, eqs. H.13 to H.17). © JCGM 2008; free to read, and it may not be republished. This folder
  uses only its published numbers, as checks, and copies no text. The GUM says the Annex H data are illustrative,
  not real measurements.
- **The same method from NIST.** NIST Technical Note 1297 (1994),
  `https://www.nist.gov/pml/nist-technical-note-1297`, and the NIST/SEMATECH e-Handbook of Statistical Methods,
  section 1.3.5.12 (autocorrelation), `https://www.itl.nist.gov/div898/handbook/eda/section3/eda35c.htm`. Cited
  only.

## Method

- Inspection: a cell of asterisks is unavailable (null) and is left out of every sum, never read as zero. Each
  complete year's J-D value is compared with the mean of its twelve months; both are printed to 0.01 degrees C, so
  a difference up to 0.01 is rounding.
- Uncertainty budget (GUM H.2): means and experimental standard deviations of the means of V, I and phi (Type A,
  eqs. 3 to 5), their correlations from the covariance of the means (eq. 17), and R = V cos(phi) / I,
  X = V sin(phi) / I and Z = V / I with combined standard uncertainties by the law of propagation for correlated
  inputs (eq. 16).
- Least-squares line (GUM H.3): b(t) = y1 + y2 (t - t0) with the standard uncertainties of y1 and y2 and their
  correlation from eqs. H.13; a prediction and its uncertainty from eq. H.15.
- Trend on the record: the same fit through the GISTEMP annual means (J-D) for 1991-2020, years as t, t0 = 1991.
  The least-squares standard uncertainties assume independent residuals. The lag-1 autocorrelation of the
  residuals (NIST/SEMATECH e-Handbook 1.3.5.12) is reported so you can see whether that holds.

## Rerun the checks

Python 3.12 (the CI image is `python:3.12-slim`); nothing to install:

    python3.12 -I tools/science_pathway.py . my-output
    diff -r my-output generated

Run it from this folder. The script removes and recreates the output folder you name, so give it a new one. It
first reproduces the GUM's worked examples and exits with an error, writing nothing, if any differs. `diff`
prints nothing when your results match the published ones. Another Python version changes only the `python` field
in `manifest.json`.

## Limits

- This is practice, not a calibration certificate. Nothing here claims traceability, accreditation or conformity
  with any standard, and no metrologist, statistician or climate scientist has reviewed it.
- The H.2 and H.3 data are the GUM's illustrative numbers, not measurements of any instrument.
- The trend uncertainty is the least-squares uncertainty of a straight line through one copy of the record. It is
  not the uncertainty of the record: GISS estimates that separately (about 0.05 degrees C for annual global means
  after 1960, in its FAQ), and this pathway does not evaluate it.
- The least-squares uncertainty assumes independent residuals. The annual residuals have a lag-1 autocorrelation of
  0.19; whether that matters is not tested here. The monthly residuals (Randori card B) have 0.61, so the smaller
  monthly uncertainty reflects the independence assumption, not more information.
- A straight line over 30 years describes those years only; it is not a forecast.
