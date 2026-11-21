# Agriculture pathway files

The worked example for the agriculture pathway (/katas/agriculture-pathway). Everything under `generated/` is
computed by `tools/agri_pathway.py`. The site's CI reruns the script on every pipeline (job `agriculture_pathway`)
and fails if any file differs from the published copy, so these results are not typed by hand.

## Files

| File | What it is | Terms |
| --- | --- | --- |
| `inputs/noaa-ghcnd-USW00093193-2023.csv` | NOAA GHCN-Daily record for station USW00093193 (Fresno Yosemite International, California), 2023: TMAX, TMIN and PRCP in metric units with their attributes, exactly as NOAA's data service returned it | US government work (see below) |
| `tools/agri_pathway.py` | The script: reference checks, inspection, ET0, the maize estimate and the Randori cards. Python 3.12 standard library only | MIT, Developer Dojo |
| `generated/reference-checks.json` | FAO's published worked-example values and the script's values | MIT, Developer Dojo |
| `generated/inspection.json` | Station, dates, gaps, ranges and every flag per element | MIT, Developer Dojo |
| `generated/et0-daily.csv` | Daily Ra, estimated Rs, Penman-Monteith ET0 and Hargreaves ET0 | MIT, Developer Dojo |
| `generated/et0-monthly.json` | Monthly ET0 by both methods, their ratio, rain and unavailable days | MIT, Developer Dojo |
| `generated/irrigation.json` | Maize stages, Kc, and monthly ETc, rain, effective rain and net irrigation need | MIT, Developer Dojo |
| `generated/randori/cards.json` | The three Randori cards recomputed | MIT, Developer Dojo |
| `generated/manifest.json` | Python version, the method, the SHA-256 of the input and the list of outputs | MIT, Developer Dojo |
| `generated/summary.md` | The results in one page | MIT, Developer Dojo |

## Sources

- **Weather record.** NOAA National Centers for Environmental Information, Global Historical Climatology Network -
  Daily (GHCN-Daily), version 3, doi:10.7289/V5D21VHZ. Retrieved 2026-11-21 from
  `https://www.ncei.noaa.gov/access/services/data/v1?dataset=daily-summaries&stations=USW00093193&startDate=2023-01-01&endDate=2023-12-31&dataTypes=PRCP,TMAX,TMIN&units=metric&format=csv&includeStationLocation=1&includeAttributes=true`,
  SHA-256 `abde499065220574370762a23f9acc7a60b76c0951a02da95b770bc003b3b9a7`.
  Terms: the dataset metadata
  (`https://www.ncei.noaa.gov/metadata/geoportal/rest/metadata/item/gov.noaa.ncdc:C00861/xml`) asks users to cite
  the dataset, disclaims warranty, and says GHCN-Daily is not homogenized. It names no licence; works of the US
  federal government are not under copyright in the US (17 U.S.C. 105).
- **Method.** FAO Irrigation and Drainage Paper 56, Crop evapotranspiration (FAO, 1998),
  `https://www.fao.org/4/x0490e/x0490e00.htm`: equations 6-8, 11, 13, 17, 20, 21, 23-25, 34, 35, 37-39, 42, 47, 48, 50, 52 and 66,
  Tables 11 and 12, and Examples 8 and 18. FAO Irrigation Water Management Training Manual 3, Irrigation Water
  Needs (FAO, 1986), section 4.2, `https://www.fao.org/4/s2022e/s2022e08.htm`: the effective-rainfall formula
  and its worked answers. Both are © FAO; this folder uses their equations and published numbers and copies no text.

## Method

- Reference evapotranspiration: FAO-56 Penman-Monteith (eq. 6), daily. The record has no humidity, radiation or
  wind, so the chapter 3 estimates for missing data are used: dewpoint equal to Tmin (eq. 48), solar radiation
  from the temperature range with kRs 0.16 for an interior site, limited to clear-sky radiation (eqs. 50 and 37),
  and wind 2 m/s. Hargreaves (eq. 52) is computed beside it as a comparison.
- Crop: maize (grain), planted 2023-04-01, stage lengths 30, 40, 50 and 30 days (Table 11), Kc 0.30, 1.20 and
  0.35 (Table 12), Kc mid and end not adjusted for climate.
- Effective rain per calendar month of the season: 0.8 P - 25 when P is over 75 mm, else 0.6 P - 10, never
  below zero. Net irrigation need is ETc minus effective rain.
- A missing value is reported as unavailable (null) and the day is left out of every sum, never filled with zero.
  The 2023 record has none.

## Rerun the checks

Python 3.12 (the CI image is `python:3.12-slim`); nothing to install:

    python3.12 -I tools/agri_pathway.py . my-output
    diff -r my-output generated

Run it from this folder. The script removes and recreates the output folder you name, so give it a new one. It
first reproduces FAO's worked examples and exits with an error, writing nothing, if any differs. `diff` prints
nothing when your results match the published ones. Another Python version changes only the `python` field in
`manifest.json`.

## Limits

- Nothing here is an irrigation recommendation. No agronomist, irrigation engineer or water authority has
  reviewed it, and real water use needs the qualified people and local rules that apply to it.
- ET0 is estimated from temperature, not measured; no station that measures humidity, radiation and wind was
  compared.
- The crop values are FAO's general table values. Nothing was grown, and no real field, soil or irrigation system
  is described.
- The net need leaves out system efficiency, soil water storage, leaching, salinity and runoff.
- One station and one year say nothing about a trend, and NOAA says the record is not homogenized.
