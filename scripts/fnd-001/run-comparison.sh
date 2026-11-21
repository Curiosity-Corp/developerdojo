#!/usr/bin/env bash
# FND-001 controlled comparison runner (#84). Idempotent: a run whose record already exists is
# skipped, so re-running only fills gaps. FORCE=1 re-runs everything.
#
# Each run starts a fresh Claude Code CLI process in a new empty folder with:
#   - no settings files, CLAUDE.md or memory (--setting-sources ""), no MCP servers (--strict-mcp-config),
#   - no built-in tools (--tools ""), so the model can only answer in text and cannot run or test anything,
#   - a pinned model and effort, and no saved session.
# The environment is cleared (env -i) except HOME, PATH and CLAUDE_CONFIG_DIR, which the CLI needs to
# find the signed-in account. No credential is read, printed or written by this script.
#
# Cells change exactly one variable against the baseline:
#   baseline      prompt A, claude-sonnet-5-5
#   instructions  prompt B (A plus a self-review request), claude-sonnet-5-5
#   model         prompt A, claude-haiku-5-5
# Repetition r of every cell runs at the same time, so time-of-day and service load affect cells alike.
#
# Output: public/examples/fnd-001/runs/<cell>-r<n>.json (the CLI's own measurements and the full response).
# Check the responses with: node scripts/fnd-001/check-pocket-garden.mjs
# Then: scripts/fnd-001/run-comparison.sh --correct   (one correction round for each failed run)
# and run the checker again to check the corrected files.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
EVIDENCE="$ROOT/public/examples/fnd-001"
REPS="${REPS:-3}"
EFFORT="high"

command -v claude >/dev/null || { echo "claude CLI not found on PATH; see https://code.claude.com/docs/en/quickstart" >&2; exit 2; }
command -v jq >/dev/null || { echo "jq not found on PATH" >&2; exit 2; }
mkdir -p "$EVIDENCE/runs"
VERSION="$(claude --version | head -n1)"

cell_prompt() { case "$1" in baseline|model) echo A ;; instructions) echo B ;; *) echo "unknown cell $1" >&2; exit 2 ;; esac; }
cell_model()  { case "$1" in baseline|instructions) echo claude-sonnet-5-5 ;; model) echo claude-haiku-5-5 ;; *) echo "unknown cell $1" >&2; exit 2 ;; esac; }

run_one() {
  local cell="$1" rep="$2"
  local out="$EVIDENCE/runs/$cell-r$rep.json"
  if [[ -s "$out" && "${FORCE:-0}" != 1 ]]; then echo "skip $cell r$rep (exists)"; return 0; fi
  local prompt model work raw started
  prompt="$(cell_prompt "$cell")"; model="$(cell_model "$cell")"
  work="$(mktemp -d)"; raw="$work/raw.json"
  started="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  if ! (cd "$work" && env -i HOME="$HOME" PATH="$PATH" CLAUDE_CONFIG_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}" \
      claude -p --model "$model" --effort "$EFFORT" --setting-sources "" --strict-mcp-config --tools "" \
      --no-session-persistence --output-format json < "$EVIDENCE/prompts/$prompt.txt" > "$raw"); then
    echo "run $cell r$rep failed; raw output kept in $raw" >&2; return 1
  fi
  jq --arg cell "$cell" --argjson rep "$rep" --arg prompt "prompts/$prompt.txt" --arg model "$model" \
     --arg effort "$EFFORT" --arg version "$VERSION" --arg started "$started" '{
      cell: $cell, repetition: $rep, startedAt: $started, harness: ("Claude Code " + $version),
      requestedModel: $model, effort: $effort, prompt: $prompt,
      flags: "-p --setting-sources \"\" --strict-mcp-config --tools \"\" --no-session-persistence --output-format json",
      modelsUsed: (.modelUsage | keys), isError: .is_error, subtype: .subtype, numTurns: .num_turns,
      durationMs: .duration_ms, durationApiMs: .duration_api_ms,
      costUsd: .total_cost_usd, costBasis: ([.modelUsage[].costBasis] | unique | join(",")),
      outputTokens: .usage.output_tokens, thinkingTokens: (.usage.output_tokens_details.thinking_tokens // null),
      response: .result }' "$raw" > "$out"
  rm -rf "$work"
  echo "done $cell r$rep"
}

# Correction round: for every run whose recorded check failed, send the run's own HTML and the
# checker's observations to a fresh process (same harness, model and flags as the run) and ask for a
# complete corrected file. Output: runs/<run>-fix.json. Needs results.json from the checker.
correct_one() {
  local run="$1"
  local out="$EVIDENCE/runs/$run-fix.json" prompt_file="$EVIDENCE/prompts/correction-$run.txt"
  if [[ -s "$out" && "${FORCE:-0}" != 1 ]]; then echo "skip $run correction (exists)"; return 0; fi
  local cell model work raw started
  cell="${run%-r*}"; model="$(cell_model "$cell")"
  {
    echo "Here is a Pocket Garden HTML file you made earlier. An independent browser check found these problems:"
    jq -r --arg run "$run" '.results[$run].checks | to_entries[] | select(.value.pass | not) | "- \(.key): \(.value.detail)"' "$EVIDENCE/results.json"
    echo
    echo "Fix only these problems and keep everything else the same. Return the complete corrected HTML in one code block, followed by one sentence saying what you changed. Do not claim you ran or tested anything unless you actually did."
    echo
    echo '```html'
    cat "$EVIDENCE/runs/$run.html"
    echo '```'
  } > "$prompt_file"
  work="$(mktemp -d)"; raw="$work/raw.json"; started="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  if ! (cd "$work" && env -i HOME="$HOME" PATH="$PATH" CLAUDE_CONFIG_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}" \
      claude -p --model "$model" --effort "$EFFORT" --setting-sources "" --strict-mcp-config --tools "" \
      --no-session-persistence --output-format json < "$prompt_file" > "$raw"); then
    echo "correction of $run failed; raw output kept in $raw" >&2; return 1
  fi
  jq --arg cell "$cell" --arg of "$run" --arg prompt "prompts/correction-$run.txt" --arg model "$model" \
     --arg effort "$EFFORT" --arg version "$VERSION" --arg started "$started" '{
      cell: $cell, correctionOf: $of, startedAt: $started, harness: ("Claude Code " + $version),
      requestedModel: $model, effort: $effort, prompt: $prompt,
      flags: "-p --setting-sources \"\" --strict-mcp-config --tools \"\" --no-session-persistence --output-format json",
      modelsUsed: (.modelUsage | keys), isError: .is_error, subtype: .subtype, numTurns: .num_turns,
      durationMs: .duration_ms, durationApiMs: .duration_api_ms,
      costUsd: .total_cost_usd, costBasis: ([.modelUsage[].costBasis] | unique | join(",")),
      outputTokens: .usage.output_tokens, thinkingTokens: (.usage.output_tokens_details.thinking_tokens // null),
      response: .result }' "$raw" > "$out"
  rm -rf "$work"
  echo "done $run correction"
}

if [[ "${1:-}" == "--correct" ]]; then
  [[ -s "$EVIDENCE/results.json" ]] || { echo "run node scripts/fnd-001/check-pocket-garden.mjs first" >&2; exit 2; }
  mapfile -t failed < <(jq -r '.results | to_entries[] | select(.key != "reference" and (.key | endswith("-fix") | not)) | select([.value.checks[] | .pass] | all | not) | .key' "$EVIDENCE/results.json")
  pids=(); for run in "${failed[@]}"; do correct_one "$run" & pids+=($!); done
  status=0; for pid in "${pids[@]}"; do wait "$pid" || status=1; done
  exit $status
fi

for rep in $(seq 1 "$REPS"); do
  pids=()
  for cell in baseline instructions model; do run_one "$cell" "$rep" & pids+=($!); done
  status=0; for pid in "${pids[@]}"; do wait "$pid" || status=1; done
  [[ $status == 0 ]] || { echo "repetition $rep had a failed run" >&2; exit 1; }
done
