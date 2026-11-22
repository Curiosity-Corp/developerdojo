# FND-001 evidence

Evidence for the FND-001 kata, "Build a working prototype, then change one stack variable" (/katas/fnd-001-stack-comparison), and its Arena record ARN-001 (/arena/evidence/fnd-001-pocket-garden). Everything here was produced on 2026-11-20 with Claude Code 2.1.329 in print mode, with no tools and no inherited configuration. The harness comparison has its own evidence folder, /examples/fnd-001-harness (ARN-003).

| Path | What it is |
| --- | --- |
| `prompts/A.txt`, `prompts/B.txt` | The baseline prompt and the instructions variant, the same text as on /katas/stack-workbench. |
| `prompts/correction-<run>.txt` | The exact correction prompt sent for each failed run. |
| `runs/<cell>-r<n>.json` | One run: stack, flags, the CLI's own time and cost measurements, and the full response. |
| `runs/<run>-fix.json` | One correction round for a run that failed a check. |
| `runs/<run>.html` | The HTML extracted from the response, exactly as checked. Open it to inspect the result. |
| `results.json` | Every check result for the reference page and each run, written by the independent browser checker. |

How to repeat it:

- Follow the setup on the kata page and send `prompts/A.txt` (or `B.txt`) in a fresh session, three times per arm.
- Score each saved HTML file with the check sheet on the kata page (fnd-001-check-sheet.md). It lists all 14 checks and how to do each one by hand. Score the reference page (/examples/pocket-garden.html) first: it passes all 14.

How it is kept honest:

- Every pipeline re-runs the browser checks on every stored response and the reference, and fails if any result in `results.json` changes. Negative controls show that the checker fails broken files.
- The counts, times and costs on the kata and Arena pages are computed from these files when the site is built. None of them is typed by hand.
- Costs are list-price figures reported by the CLI (`costBasis: "list"`), not an invoice.

Limitations: three runs per arm, one task, one date, one harness version. These are observations to repeat, not a ranking. The skill, tool and delegation comparisons were designed but not run.
