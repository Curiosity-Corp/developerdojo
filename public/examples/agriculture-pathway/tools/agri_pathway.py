"""Agriculture pathway (Developer Dojo): from a daily weather record to a checked irrigation-need estimate.

Standard library only (Python 3.12). Usage, from the folder that holds inputs/:

    python -I tools/agri_pathway.py . my-output
    diff -r my-output generated

Every equation number below is from FAO Irrigation and Drainage Paper 56 (FAO, 1998),
"Crop evapotranspiration: guidelines for computing crop water requirements". The effective rainfall formula is from
FAO Irrigation Water Management Training Manual No. 3 (FAO, 1986), section 4.2.

The script first reproduces FAO's own worked examples (reference checks) and exits with an error if any of them
does not match, so a wrong equation can never produce published numbers. Missing weather values are reported as
unavailable (null), never as zero. Nothing here is an irrigation recommendation for a real field.
"""

from __future__ import annotations

import csv
import hashlib
import json
import math
import platform
import shutil
import sys
from datetime import date, timedelta
from pathlib import Path

INPUT = "inputs/noaa-ghcnd-USW00093193-2023.csv"

# FAO-56 constants and the choices this pathway makes. Each choice is written into manifest.json.
GSC = 0.0820            # solar constant, MJ m-2 min-1 (eq. 21)
SIGMA = 4.903e-9        # Stefan-Boltzmann constant, MJ K-4 m-2 day-1 (eq. 39)
ALBEDO = 0.23           # grass reference albedo (eq. 38)
KRS = 0.16              # Hargreaves radiation adjustment for an interior location (eq. 50)
U2_DEFAULT = 2.0        # wind speed at 2 m when none is recorded, m/s (FAO-56 chapter 3, "Missing wind speed data")
TDEW_OFFSET = 0.0       # dewpoint = Tmin - offset (eq. 48); FAO-56 suggests 2 to 3 degrees C for arid sites (Randori card B)

# Maize (grain), FAO-56 Table 11 (stage lengths, "Spain (spr, sum.); Calif.", April planting) and Table 12 (Kc).
CROP = {
    "name": "Maize (grain)",
    "planting": "2023-04-01",
    "stages_days": {"initial": 30, "development": 40, "mid": 50, "late": 30},
    "kc": {"initial": 0.30, "mid": 1.20, "end": 0.35},
}

RANDORI = {
    "A": {"title": "The grower harvests the grain wet: use Kc end 0.60, the other end of the Table 12 range", "crop": {"kc": {"initial": 0.30, "mid": 1.20, "end": 0.60}}},
    "B": {"title": "The site is arid: estimate dewpoint as Tmin minus 2 degrees C (FAO-56, eq. 48 note)", "tdew_offset": 2.0},
    "C": {"title": "Planting moves to 1 May 2023, same stage lengths", "crop": {"planting": "2023-05-01"}},
}


# ---------- FAO-56 equations ----------

def pressure(z: float) -> float:  # eq. 7, kPa
    return 101.3 * ((293 - 0.0065 * z) / 293) ** 5.26


def psychrometric(p: float) -> float:  # eq. 8, kPa/C
    return 0.665e-3 * p


def sat_vp(t: float) -> float:  # eq. 11, kPa
    return 0.6108 * math.exp(17.27 * t / (t + 237.3))


def slope_vp(t: float) -> float:  # eq. 13, kPa/C
    return 4098 * sat_vp(t) / (t + 237.3) ** 2


def solar_geometry(lat_deg: float, j: int) -> dict[str, float]:  # eqs. 22-25
    phi = math.pi / 180 * lat_deg
    dr = 1 + 0.033 * math.cos(2 * math.pi * j / 365)
    delta = 0.409 * math.sin(2 * math.pi * j / 365 - 1.39)
    ws = math.acos(-math.tan(phi) * math.tan(delta))
    return {"phi": phi, "dr": dr, "delta": delta, "ws": ws}


def extraterrestrial(lat_deg: float, j: int) -> float:  # eq. 21, MJ m-2 day-1
    g = solar_geometry(lat_deg, j)
    return 24 * 60 / math.pi * GSC * g["dr"] * (
        g["ws"] * math.sin(g["phi"]) * math.sin(g["delta"]) + math.cos(g["phi"]) * math.cos(g["delta"]) * math.sin(g["ws"])
    )


def daylight_hours(lat_deg: float, j: int) -> float:  # eq. 34
    return 24 / math.pi * solar_geometry(lat_deg, j)["ws"]


def clear_sky(ra: float, z: float) -> float:  # eq. 37
    return (0.75 + 2e-5 * z) * ra


def net_longwave(tmax: float, tmin: float, ea: float, rs: float, rso: float) -> float:  # eq. 39
    return SIGMA * ((tmax + 273.16) ** 4 + (tmin + 273.16) ** 4) / 2 * (0.34 - 0.14 * math.sqrt(ea)) * (1.35 * min(rs / rso, 1.0) - 0.35)


def penman_monteith(tmax: float, tmin: float, rn: float, ea: float, u2: float, z: float) -> float:  # eq. 6 with eqs. 9, 12
    t = (tmax + tmin) / 2
    gamma = psychrometric(pressure(z))
    es = (sat_vp(tmax) + sat_vp(tmin)) / 2
    d = slope_vp(t)
    return (0.408 * d * rn + gamma * 900 / (t + 273) * u2 * (es - ea)) / (d + gamma * (1 + 0.34 * u2))


def daily_temperature_only(tmax: float, tmin: float, lat: float, z: float, j: int, tdew_offset: float) -> dict[str, float]:
    """FAO-56 Penman-Monteith with the chapter 3 estimates for missing humidity (eq. 48), radiation (eq. 50) and wind."""
    ra = extraterrestrial(lat, j)
    rso = clear_sky(ra, z)
    rs = min(KRS * math.sqrt(max(tmax - tmin, 0.0)) * ra, rso)  # eq. 50, limited to Rso as FAO-56 says
    ea = sat_vp(tmin - tdew_offset)  # eq. 48
    rn = (1 - ALBEDO) * rs - net_longwave(tmax, tmin, ea, rs, rso)  # eqs. 38, 40; G = 0 for a day (eq. 42)
    et0 = max(penman_monteith(tmax, tmin, rn, ea, U2_DEFAULT, z), 0.0)
    harg = 0.0023 * ((tmax + tmin) / 2 + 17.8) * math.sqrt(max(tmax - tmin, 0.0)) * 0.408 * ra  # eq. 52, Ra as mm/day (eq. 20)
    return {"ra": ra, "rs": rs, "rn": rn, "et0_pm": et0, "et0_hargreaves": harg}


def effective_rainfall(p: float) -> float:  # FAO Training Manual 3, section 4.2 (monthly totals, mm)
    return max(0.8 * p - 25 if p > 75 else 0.6 * p - 10, 0.0)


def kc_on(day_index: int, crop: dict) -> float:  # FAO-56 crop coefficient curve, eq. 66 between the stage points
    s = crop["stages_days"]
    k = crop["kc"]
    ini, dev, mid = s["initial"], s["initial"] + s["development"], s["initial"] + s["development"] + s["mid"]
    if day_index < ini:
        return k["initial"]
    if day_index < dev:
        return k["initial"] + (day_index - ini + 1) / s["development"] * (k["mid"] - k["initial"])
    if day_index < mid:
        return k["mid"]
    return k["mid"] + (day_index - mid + 1) / s["late"] * (k["end"] - k["mid"])


# ---------- reference checks: FAO's own worked examples ----------

def check(cid: str, source: str, quantity: str, published: float, computed: float, decimals: int) -> dict:
    shown = round(computed, decimals)
    return {"id": cid, "source": source, "quantity": quantity, "published": published, "computed": shown,
            "status": "pass" if abs(shown - published) < 10 ** -decimals / 2 + 1e-9 else "fail"}


def reference_checks() -> list[dict]:
    ex8 = "FAO-56 Example 8 (3 September, 20 degrees S)"
    g = solar_geometry(-20, 246)
    out = [
        check("EX8-dr", ex8, "inverse relative distance Earth-Sun dr (eq. 23)", 0.985, g["dr"], 3),
        check("EX8-delta", ex8, "solar declination, rad (eq. 24)", 0.120, g["delta"], 3),
        check("EX8-ws", ex8, "sunset hour angle, rad (eq. 25)", 1.527, g["ws"], 3),
        check("EX8-Ra", ex8, "extraterrestrial radiation Ra, MJ m-2 day-1 (eq. 21)", 32.2, extraterrestrial(-20, 246), 1),
    ]
    # Example 18: measured humidity, wind and sunshine, so this exercises eq. 6 with the full inputs.
    ex18 = "FAO-56 Example 18 (Uccle, Brussels, 6 July)"
    lat, z, j, tmax, tmin = 50.80, 100.0, 187, 21.5, 12.3
    u2 = 10 / 3.6 * 4.87 / math.log(67.8 * 10 - 5.42)  # eq. 47, 10 km/h at 10 m
    ea = (sat_vp(tmin) * 0.84 + sat_vp(tmax) * 0.63) / 2  # eq. 17
    ra = extraterrestrial(lat, j)
    n_hours = daylight_hours(lat, j)
    rs = (0.25 + 0.50 * 9.25 / n_hours) * ra  # eq. 35
    rso = clear_sky(ra, z)
    rn = (1 - ALBEDO) * rs - net_longwave(tmax, tmin, ea, rs, rso)
    out += [
        check("EX18-Ra", ex18, "extraterrestrial radiation Ra, MJ m-2 day-1 (eq. 21)", 41.09, ra, 2),
        check("EX18-ea", ex18, "actual vapour pressure ea, kPa (eq. 17)", 1.409, ea, 3),
        check("EX18-ET0", ex18, "grass reference evapotranspiration ET0, mm/day (eq. 6)", 3.9, penman_monteith(tmax, tmin, rn, ea, u2, z), 1),
    ]
    tm3 = "FAO Training Manual 3, section 4.2 question"
    for p, pe in [(35, 11), (90, 47), (116, 68), (5, 0), (260, 183), (75, 35)]:
        out.append(check(f"TM3-Pe-{p}", tm3, f"effective rainfall for {p} mm/month", pe, effective_rainfall(p), 0))
    return out


# ---------- the weather record ----------

def read_record(path: Path) -> tuple[dict, list[dict]]:
    with path.open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    if not rows:
        raise SystemExit(f"{path}: no rows")
    first = rows[0]
    station = {"id": first["STATION"], "latitude": float(first["LATITUDE"]), "longitude": float(first["LONGITUDE"]), "elevation_m": float(first["ELEVATION"])}
    return station, rows


def value(row: dict, key: str) -> float | None:
    raw = row.get(key, "")
    return None if raw == "" else float(raw)


def inspect(station: dict, rows: list[dict]) -> dict:
    dates = [row["DATE"] for row in rows]
    start, end = date.fromisoformat(dates[0]), date.fromisoformat(dates[-1])
    expected = [(start + timedelta(days=i)).isoformat() for i in range((end - start).days + 1)]
    elements = {}
    for key, unit in (("PRCP", "mm"), ("TMAX", "degrees C"), ("TMIN", "degrees C")):
        present = [value(row, key) for row in rows if value(row, key) is not None]
        attrs = [row.get(f"{key}_ATTRIBUTES", "").split(",") for row in rows]
        mflags: dict[str, int] = {}
        qflags: dict[str, int] = {}
        sources: dict[str, int] = {}
        for parts in attrs:
            parts += [""] * (3 - len(parts))
            if parts[0]:
                mflags[parts[0]] = mflags.get(parts[0], 0) + 1
            if parts[1]:
                qflags[parts[1]] = qflags.get(parts[1], 0) + 1
            sources[parts[2] or "none"] = sources.get(parts[2] or "none", 0) + 1
        elements[key] = {
            "unit": unit, "values": len(present), "missing": len(expected) - len(present),
            "min": min(present) if present else None, "max": max(present) if present else None,
            "measurementFlags": dict(sorted(mflags.items())), "qualityFlags": dict(sorted(qflags.items())), "sourceFlags": dict(sorted(sources.items())),
        }
    elements["PRCP"]["total"] = round(sum(value(row, "PRCP") or 0 for row in rows if value(row, "PRCP") is not None), 1)
    swapped = [row["DATE"] for row in rows if value(row, "TMAX") is not None and value(row, "TMIN") is not None and value(row, "TMIN") > value(row, "TMAX")]
    return {
        "station": station, "first": dates[0], "last": dates[-1], "daysExpected": len(expected), "rows": len(rows),
        "missingDates": sorted(set(expected) - set(dates)), "duplicateDates": sorted({d for d in dates if dates.count(d) > 1}),
        "tminAboveTmax": swapped, "elements": elements,
    }


def daily_series(station: dict, rows: list[dict], tdew_offset: float) -> list[dict]:
    out = []
    for row in rows:
        day = date.fromisoformat(row["DATE"])
        tmax, tmin, prcp = value(row, "TMAX"), value(row, "TMIN"), value(row, "PRCP")
        item = {"date": row["DATE"], "tmax": tmax, "tmin": tmin, "prcp": prcp, "ra": None, "rs": None, "et0_pm": None, "et0_hargreaves": None}
        if tmax is not None and tmin is not None:
            calc = daily_temperature_only(tmax, tmin, station["latitude"], station["elevation_m"], day.timetuple().tm_yday, tdew_offset)
            item.update({k: round(v, 2) for k, v in calc.items() if k != "rn"})
        out.append(item)
    return out


def monthly(series: list[dict]) -> list[dict]:
    months: dict[str, list[dict]] = {}
    for item in series:
        months.setdefault(item["date"][:7], []).append(item)
    out = []
    for month, items in months.items():
        complete = [i for i in items if i["et0_pm"] is not None]
        unavailable = len(items) - len(complete)
        pm = round(sum(i["et0_pm"] for i in complete), 1)
        hg = round(sum(i["et0_hargreaves"] for i in complete), 1)
        out.append({"month": month, "days": len(items), "daysUnavailable": unavailable,
                    "et0_pm_mm": pm if unavailable == 0 else None, "et0_hargreaves_mm": hg if unavailable == 0 else None,
                    "hargreavesOverPm": round(hg / pm, 2) if unavailable == 0 and pm else None,
                    "rain_mm": round(sum(i["prcp"] for i in items if i["prcp"] is not None), 1) if all(i["prcp"] is not None for i in items) else None})
    return out


def irrigation(series: list[dict], crop: dict) -> dict:
    planting = date.fromisoformat(crop["planting"])
    length = sum(crop["stages_days"].values())
    by_date = {item["date"]: item for item in series}
    months: dict[str, dict] = {}
    unavailable_days = 0
    for i in range(length):
        day = planting + timedelta(days=i)
        item = by_date.get(day.isoformat())
        m = months.setdefault(day.isoformat()[:7], {"month": day.isoformat()[:7], "seasonDays": 0, "et0_mm": 0.0, "etc_mm": 0.0, "rain_mm": 0.0, "daysUnavailable": 0})
        m["seasonDays"] += 1
        if item is None or item["et0_pm"] is None or item["prcp"] is None:
            m["daysUnavailable"] += 1
            unavailable_days += 1
            continue
        kc = kc_on(i, crop)
        m["et0_mm"] += item["et0_pm"]
        m["etc_mm"] += kc * item["et0_pm"]
        m["rain_mm"] += item["prcp"]
    rows = []
    for m in months.values():
        ok = m["daysUnavailable"] == 0
        pe = effective_rainfall(m["rain_mm"]) if ok else None
        rows.append({
            "month": m["month"], "seasonDays": m["seasonDays"], "daysUnavailable": m["daysUnavailable"],
            "et0_mm": round(m["et0_mm"], 1) if ok else None, "etc_mm": round(m["etc_mm"], 1) if ok else None,
            "rain_mm": round(m["rain_mm"], 1) if ok else None, "effectiveRain_mm": round(pe, 1) if pe is not None else None,
            "irrigationNeed_mm": round(max(m["etc_mm"] - pe, 0.0), 1) if pe is not None else None,
        })
    total = (lambda key: round(sum(r[key] for r in rows), 1) if unavailable_days == 0 else None)
    s = crop["stages_days"]
    edges = [0, s["initial"], s["initial"] + s["development"], s["initial"] + s["development"] + s["mid"], length]
    names = ["initial", "development", "mid", "late"]
    return {
        "crop": crop["name"], "planting": crop["planting"], "harvest": (planting + timedelta(days=length - 1)).isoformat(), "seasonDays": length,
        "kc": crop["kc"],
        "stages": [{"stage": n, "from": (planting + timedelta(days=edges[k])).isoformat(), "to": (planting + timedelta(days=edges[k + 1] - 1)).isoformat()} for k, n in enumerate(names)],
        "months": rows,
        "season": {"et0_mm": total("et0_mm"), "etc_mm": total("etc_mm"), "rain_mm": total("rain_mm"), "effectiveRain_mm": total("effectiveRain_mm"), "irrigationNeed_mm": total("irrigationNeed_mm")},
    }


def write_json(path: Path, data: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def merged(base: dict, change: dict) -> dict:
    out = json.loads(json.dumps(base))
    for key, val in change.items():
        out[key] = {**out[key], **val} if isinstance(val, dict) and isinstance(out.get(key), dict) else val
    return out


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: agri_pathway.py <folder with inputs/> <output folder>", file=sys.stderr)
        return 2
    root, out = Path(argv[1]), Path(argv[2])
    source = root / INPUT
    if not source.is_file():
        print(f"{source}: input weather record not found", file=sys.stderr)
        return 2
    checks = reference_checks()
    failed = [c["id"] for c in checks if c["status"] != "pass"]
    if failed:
        print("reference checks failed, nothing written: " + ", ".join(failed), file=sys.stderr)
        return 1
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    station, rows = read_record(source)
    series = daily_series(station, rows, TDEW_OFFSET)
    plan = irrigation(series, CROP)
    write_json(out / "reference-checks.json", {"passed": len(checks), "failed": 0, "checks": checks})
    write_json(out / "inspection.json", inspect(station, rows))
    write_json(out / "et0-monthly.json", monthly(series))
    write_json(out / "irrigation.json", plan)
    with (out / "et0-daily.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(series[0].keys()), lineterminator="\n")
        writer.writeheader()
        for item in series:
            writer.writerow({k: "" if v is None else v for k, v in item.items()})

    cards = {}
    for card, spec in RANDORI.items():
        crop = merged(CROP, spec.get("crop", {}))
        result = irrigation(daily_series(station, rows, spec.get("tdew_offset", TDEW_OFFSET)), crop)
        cards[card] = {"title": spec["title"], "season": result["season"], "harvest": result["harvest"],
                       "changeInIrrigationNeed_mm": round(result["season"]["irrigationNeed_mm"] - plan["season"]["irrigationNeed_mm"], 1)}
    write_json(out / "randori" / "cards.json", cards)

    s = plan["season"]
    summary = [
        "# Agriculture pathway: results", "",
        f"Station {station['id']} ({station['latitude']}, {station['longitude']}, {station['elevation_m']} m), {rows[0]['DATE']} to {rows[-1]['DATE']}.", "",
        f"Reference checks against FAO's worked examples: {len(checks)} passed, 0 failed.", "",
        f"{plan['crop']}, planted {plan['planting']}, {plan['seasonDays']} days to {plan['harvest']}:", "",
        "| Month | ET0 mm | ETc mm | Rain mm | Effective rain mm | Irrigation need mm |", "| --- | --- | --- | --- | --- | --- |",
        *[f"| {r['month']} | {r['et0_mm']} | {r['etc_mm']} | {r['rain_mm']} | {r['effectiveRain_mm']} | {r['irrigationNeed_mm']} |" for r in plan["months"]],
        f"| Season | {s['et0_mm']} | {s['etc_mm']} | {s['rain_mm']} | {s['effectiveRain_mm']} | {s['irrigationNeed_mm']} |", "",
        "Practice estimate from temperature and rain only. Not an irrigation recommendation, and not reviewed by an agronomist or irrigation engineer.", "",
    ]
    (out / "summary.md").write_text("\n".join(summary), encoding="utf-8")
    write_json(out / "manifest.json", {
        "script": "tools/agri_pathway.py",
        "python": platform.python_version_tuple()[0] + "." + platform.python_version_tuple()[1],
        "inputs": {INPUT: hashlib.sha256(source.read_bytes()).hexdigest()},
        "method": {
            "reference": "FAO-56 Penman-Monteith (eq. 6), daily, with the chapter 3 estimates for missing data",
            "humidity": f"dewpoint = Tmin - {TDEW_OFFSET} degrees C (eq. 48)",
            "radiation": f"Hargreaves radiation formula, kRs = {KRS} (interior), limited to clear-sky Rso (eqs. 50, 37)",
            "wind": f"u2 = {U2_DEFAULT} m/s (no wind in the record)",
            "comparison": "Hargreaves ET0 (eq. 52)",
            "crop": "FAO-56 Table 11 stage lengths and Table 12 Kc for maize (grain), Kc curve as FAO-56 eq. 66, no climate adjustment of Kc mid",
            "effectiveRain": "FAO Training Manual 3, section 4.2, on in-season rain per calendar month",
        },
        "outputs": sorted(str(p.relative_to(out)) for p in out.rglob("*") if p.is_file()),
    })
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
