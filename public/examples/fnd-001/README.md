# FND-001 evidence

Evidence for the FND-001 kata record (`src/data/kata-recipes/fnd-001.ts`, #84). Everything here was produced on 2026-11-20 with Claude Code 2.1.329 and can be reproduced with the two scripts in `scripts/fnd-001/`.

| Path | What it is |
| --- | --- |
| `prompts/A.txt`, `prompts/B.txt` | The baseline prompt and the instructions variant, the same text as on /katas/stack-workbench. |
| `prompts/correction-<run>.txt` | The exact correction prompt sent for each failed run. |
| `runs/<cell>-r<n>.json` | One run: stack, flags, the CLI's own time and cost measurements, and the full response. |
| `runs/<run>-fix.json` | One correction round for a run that failed a check. |
| `runs/<run>.html` | The HTML extracted from the response, exactly as checked. Open it to inspect the result. |
| `results.json` | Every check result for the reference and each run, written by `scripts/fnd-001/check-pocket-garden.mjs`. |

How it is kept honest:

- `tests/fnd-001-record.test.ts` recomputes every number in the record from these files and checks that each verified comparison changed exactly one variable.
- `e2e/fnd-001-evidence.spec.ts` re-runs the browser checks in CI and fails if any result in `results.json` changes. Negative controls show that the checker fails broken files.
- Costs are list-price figures reported by the CLI (`costBasis: "list"`), not an invoice.

Limitations: three runs per arm, one task, one date, one harness version. The harness, skill, tool and delegation variants in the record are proposed and were not run.
