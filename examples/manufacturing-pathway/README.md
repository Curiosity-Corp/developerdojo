# Manufacturing pathway files

The worked example for the manufacturing pathway (/katas/manufacturing-pathway): from a process record to control
limits and the sources of variation. Everything under `generated/` is computed by `tools/manufacturing_pathway.py`.
The site's CI reruns the script on every pipeline (job `manufacturing_pathway`) and fails if any file differs from
the published copy, so these results are not typed by hand.

## Files

| File | What it is | Terms |
| --- | --- | --- |
| `inputs/lithogra-data-rows.dat` | The 450 data rows of `LITHOGRA.DAT`, the data file of the handbook's lithography case study, byte for byte | NIST public information (see below) |
| `tools/manufacturing_pathway.py` | The script: reference checks against the handbook, the record inspection, control limits, variance components and the Randori cards. Python 3.12 standard library only | MIT, Developer Dojo |
| `tools/fetch_input.py` | Downloads `LITHOGRA.DAT` for a maintainer, writes its data rows and prints both SHA-256 values. CI never runs it | MIT, Developer Dojo |
| `generated/reference-checks.json` | The values the handbook publishes and the script's values | MIT, Developer Dojo |
| `generated/inspection.json` | The record's structure, its numerical summary and the mean of each site (MFG-001) | MIT, Developer Dojo |
| `generated/control-limits.json` | X-bar and s, and X-bar and R, limits with the wafer as subgroup, and an individuals chart on the cassette means (MFG-002) | MIT, Developer Dojo |
| `generated/subgroups.csv` | The 90 wafer subgroups: mean, standard deviation, range, and whether the mean is outside the X-bar and s limits | MIT, Developer Dojo |
| `generated/variation.json` | The nested analysis of variance, the variance components and the sigma a capability index would use (MFG-003) | MIT, Developer Dojo |
| `generated/randori/cards.json` | The three Randori cards recomputed | MIT, Developer Dojo |
| `generated/manifest.json` | Python version, the method, the SHA-256 of the input and the list of outputs | MIT, Developer Dojo |
| `generated/summary.md` | The results in one page | MIT, Developer Dojo |

## Sources

- **NIST/SEMATECH e-Handbook of Statistical Methods**, `https://www.itl.nist.gov/div898/handbook/`,
  DOI 10.18434/M32189, web edition last updated 2022-04-27; read on 2026-11-25. Cited as the handbook asks:
  NIST/SEMATECH e-Handbook of Statistical Methods, https://www.itl.nist.gov/div898/handbook/, 2026-11-25.
  The sections used are 6.1.6 (process capability), 6.3.2 (variables control charts and c4), 6.3.2.1 (X-bar and R
  and s charts, and the factor table), 6.3.2.2 (individuals charts) and 6.6.1 (the lithography case study).
- **The data.** `https://www.itl.nist.gov/div898/handbook/datasets/LITHOGRA.DAT`, downloaded on 2026-11-25:
  25,353 bytes, SHA-256 `777cd68453b8ff18b89d02f312259cdfdbd7980215b75687b156d248d7d0f1fc`. The file starts with a
  25-line header; the Dojo serves only the 450 rows after it, unchanged (24,300 bytes, SHA-256
  `d7c27b047ed06606dbd3aaf8deead0a094a1a628cebf2ee2f002f7ed7e7c2204`), because the header names the person who
  supplied the data and the Dojo publishes no person's name. The header says: the response is line width on a
  silicon wafer in micrometres; the columns are cassette (1 to 30), wafer in the cassette (1 to 3), site (1 Top,
  2 Left, 3 Center, 4 Right, 5 Bottom), line width, run sequence and a cleaned-up version of the line width.
- **Terms.** NIST's copyright statement (`https://www.nist.gov/disclaimer`, read on 2026-11-25) says that, except for
  material marked as copyrighted, information on NIST sites is public information and may be distributed or
  copied, with credit requested. The handbook and this data file carry no copyright mark. Nothing here implies
  endorsement by NIST.
- **ISO 7870-2:2023**, Control charts, Part 2: Shewhart control charts, is the current international standard for
  the same charts (ISO's catalogue lists it as edition 2, published March 2023). It is cited only: the Dojo has not
  read its text, and nothing here claims conformance to it.

## Method

- **Inspection.** Every cassette has wafers 1 to 3, every wafer the five sites, and the run sequence is 1 to 450 in
  order; the script stops otherwise. The summary is the handbook's: mean, median, minimum, maximum, range, sample
  standard deviation and the lag-1 autocorrelation of section 1.3.5.12.
- **Chart factors.** d2 and d3, the mean and standard deviation of the range of n normal observations in units of
  sigma, are integrated numerically (Simpson's rule, step 0.01); A2 = 3 / (d2 sqrt(n)), D3 = max(0, 1 - 3 d3 / d2)
  and D4 = 1 + 3 d3 / d2. c4 is computed from the gamma function, as in section 6.3.2.
- **Control limits.** Three-sigma X-bar and s limits from the average within-subgroup standard deviation and c4,
  and X-bar and R limits from the average range and the factors above, with the wafer (5 sites) as subgroup. The
  cassette means are charted as individuals, with limits from their average moving range divided by 1.128, so
  their limits carry the lot-to-lot variation, as section 6.6.1.4 recommends.
- **Variance components.** A nested random-effects analysis of variance (cassette, wafer within cassette, site
  within wafer), with the mean squares equated to their expected mean squares, as in section 6.6.1.3.
- **Capability.** Cp, k, Cpk, Cpu and Cpl as in section 6.1.6, and rejects for a centred normal process as
  2 Phi(-3 Cp). The case study publishes no specification limits, so no index is computed for its line widths.

## Rerun the checks

Python 3.12 (the CI image is `python:3.12-slim`); nothing to install:

    python3.12 -I tools/manufacturing_pathway.py . my-output
    diff -r my-output generated

Run it from this folder. The script removes and recreates the output folder you name, so give it a new one. It
first reproduces the handbook's published values and exits with an error, writing nothing, if any differs. `diff`
prints nothing when your results match the published ones. Another Python version changes only the `python` field
in `manifest.json`.

## Limits

- This is practice on the handbook's own case study, not an engineering review. Nothing here says that any real
  process is in control or capable, or that any quality system or chart meets a standard, and no quality engineer,
  statistician or process engineer has reviewed it.
- Two printed values differ by one unit in their last digit from what the handbook's own method gives: D4 for n = 5
  and the rejects at Cp 1.33. `reference-checks.json` says why for each.
- Only Shewhart charts for variables and the nested variance components are covered. Attribute charts, CUSUM and
  EWMA charts, run rules beyond the three-sigma limits, measurement system analysis and non-normal capability are
  not.
- No learner has run these katas yet.
