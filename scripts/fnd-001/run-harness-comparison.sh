#!/usr/bin/env bash
# FND-001 harness comparison runner (#89). Idempotent: a run whose file already exists is skipped, so
# re-running only fills gaps. FORCE=1 re-runs everything.
#
# One variable changes: the harness. Both arms send prompt A to the same model, at the same effort,
# through the same recording relay (scripts/fnd-001/relay.mjs) to the same upstream endpoint, account
# and serving provider, with no tools, no MCP servers, no project instructions or memory and no saved
# session. The relay holds the upstream key; the harnesses only ever see a placeholder.
#
#   claude-code   Claude Code in print mode
#   qwen-code     Qwen Code in non-interactive mode, Anthropic Messages API auth type
#
# Each run starts a fresh harness process with a new, empty home folder and working folder, so no
# sign-in, settings, memory or history from this machine is visible to it. Repetition r of both arms
# starts at the same moment.
#
# Before running: start the relay, for example
#   RELAY_UPSTREAM_KEY=<your OpenRouter key> RELAY_LOG=relay.jsonl RELAY_PROVIDER=amazon-bedrock node scripts/fnd-001/relay.mjs
# Then:   RELAY_LOG=relay.jsonl scripts/fnd-001/run-harness-comparison.sh
#         node scripts/fnd-001/check-pocket-garden.mjs fnd-001-harness
#         RELAY_LOG=relay.jsonl scripts/fnd-001/run-harness-comparison.sh --correct   (one correction round per failed run)
#         node scripts/fnd-001/check-pocket-garden.mjs fnd-001-harness
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
EVIDENCE="$ROOT/public/examples/fnd-001-harness"
REPS="${REPS:-3}"
EFFORT="high"
MODEL="${MODEL:-anthropic/claude-sonnet-5.5}"
RELAY_URL="${RELAY_URL:-http://127.0.0.1:8790}"
RELAY_LOG="${RELAY_LOG:?set RELAY_LOG to the log file of the relay}"
ENDPOINT="${ENDPOINT:-OpenRouter Anthropic Messages API, provider pinned to amazon-bedrock, through the recording relay}"
QWEN_TOOLS="read_mcp_resource,skill,read_file,search_memory,zoom_image,grep_search,cron_list,cron_delete,autofix_pr,web_fetch,tool_search,list_agents,task_stop,enter_worktree,exit_worktree,record_artifact,get_goal,update_goal,tool_call,agent,send_message,glob,report_findings,cron_create,loop_wakeup,manage_memory,run_shell_command,write_file,edit,replace,ls,list_directory,read_many_files,todo_write,save_memory,web_search,exit_plan_mode,ask_user_question,monitor,exec,structured_output,lsp"

for tool in claude qwen jq node curl; do command -v "$tool" >/dev/null || { echo "$tool not found on PATH" >&2; exit 2; }; done
curl -s -o /dev/null "$RELAY_URL/" || { echo "the relay is not answering at $RELAY_URL; start scripts/fnd-001/relay.mjs first" >&2; exit 2; }
mkdir -p "$EVIDENCE/runs"
CLAUDE_VERSION="$(claude --version | head -n1)"
QWEN_VERSION="$(qwen --version | head -n1)"
CLAUDE_FLAGS='-p --model <model> --effort high --setting-sources "" --strict-mcp-config --tools "" --no-session-persistence --output-format json'
QWEN_FLAGS="--safe-mode --chat-recording false --exclude-tools <every built-in tool> --output-format json; settings: qwen-settings.json (auth type anthropic, reasoning effort high)"

harness_label() { case "$1" in claude-code) echo "Claude Code $CLAUDE_VERSION" ;; qwen-code) echo "Qwen Code $QWEN_VERSION" ;; *) echo "unknown cell $1" >&2; exit 2 ;; esac; }
harness_flags() { case "$1" in claude-code) echo "$CLAUDE_FLAGS" ;; qwen-code) echo "$QWEN_FLAGS" ;; *) echo "unknown cell $1" >&2; exit 2 ;; esac; }

# run_harness <cell> <run-id> <prompt file> <work dir> <raw output file>
run_harness() {
  local cell="$1" id="$2" prompt="$3" work="$4" raw="$5"
  local base="$RELAY_URL/run/$id"
  mkdir -p "$work/home" "$work/folder"
  case "$cell" in
    claude-code)
      mkdir -p "$work/config"
      (cd "$work/folder" && env -i HOME="$work/home" PATH="$PATH" CLAUDE_CONFIG_DIR="$work/config" \
        ANTHROPIC_BASE_URL="$base" ANTHROPIC_AUTH_TOKEN=relay-placeholder \
        claude -p --model "$MODEL" --effort "$EFFORT" --setting-sources "" --strict-mcp-config --tools "" \
        --no-session-persistence --output-format json < "$prompt" > "$raw" 2> "$work/stderr.txt") ;;
    qwen-code)
      mkdir -p "$work/home/.qwen"
      jq --arg model "$MODEL" --arg base "$base" '.model.name = $model | .modelProviders.anthropic[0].id = $model
        | .modelProviders.anthropic[0].name = $model | .modelProviders.anthropic[0].baseUrl = $base' \
        "$EVIDENCE/qwen-settings.json" > "$work/home/.qwen/settings.json"
      (cd "$work/folder" && env -i HOME="$work/home" PATH="$PATH" ANTHROPIC_BASE_URL="$base" ANTHROPIC_API_KEY=relay-placeholder \
        qwen --safe-mode --chat-recording false --exclude-tools "$QWEN_TOOLS" --output-format json \
        < "$prompt" > "$raw" 2> "$work/stderr.txt") ;;
  esac
}

# record <cell> <run-id> <prompt rel> <repetition or ""> <correction-of or ""> <out>
record() {
  local cell="$1" id="$2" prompt_rel="$3" rep="$4" of="$5" out="$6"
  local work raw started t0 t1
  work="$(mktemp -d)"; raw="$work/raw.json"
  started="$(date -u +%Y-%m-%dT%H:%M:%SZ)"; t0="$(date +%s%3N)"
  if ! run_harness "$cell" "$id" "$EVIDENCE/$prompt_rel" "$work" "$raw"; then
    echo "run $id failed; output kept in $work" >&2; return 1
  fi
  t1="$(date +%s%3N)"
  sleep 1 # let the relay finish writing its log line
  jq -n --arg runId "$id" --arg cell "$cell" --arg rep "$rep" --arg of "$of" --arg started "$started" \
    --arg harness "$(harness_label "$cell")" --arg model "$MODEL" --arg effort "$EFFORT" --arg prompt "$prompt_rel" \
    --arg flags "$(harness_flags "$cell")" --arg endpoint "$ENDPOINT" --argjson wall "$((t1 - t0))" '{
      runId: $runId, cell: $cell, repetition: (if $rep == "" then null else ($rep | tonumber) end),
      correctionOf: (if $of == "" then null else $of end), startedAt: $started, harness: $harness, model: $model,
      effort: $effort, prompt: $prompt, flags: $flags, endpoint: $endpoint, wallMs: $wall }' > "$work/meta.json"
  node "$ROOT/scripts/fnd-001/harness-run-file.mjs" "$work/meta.json" "$raw" "$RELAY_LOG" "$out"
  rm -rf "$work"
  echo "done $id"
}

run_one() {
  local cell="$1" rep="$2" out="$EVIDENCE/runs/$1-r$2.json"
  if [[ -s "$out" && "${FORCE:-0}" != 1 ]]; then echo "skip $cell r$rep (exists)"; return 0; fi
  record "$cell" "$cell-r$rep" "prompts/A.txt" "$rep" "" "$out"
}

# Correction round, as in the FND-001 runner: the run's own HTML and the checker's findings go to a fresh
# process of the same harness, model and flags. Output: runs/<run>-fix.json. Needs results.json.
correct_one() {
  local run="$1" cell="${1%-r*}"
  local out="$EVIDENCE/runs/$run-fix.json" prompt_file="$EVIDENCE/prompts/correction-$run.txt"
  if [[ -s "$out" && "${FORCE:-0}" != 1 ]]; then echo "skip $run correction (exists)"; return 0; fi
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
  record "$cell" "$run-fix" "prompts/correction-$run.txt" "" "$run" "$out"
}

if [[ "${1:-}" == "--correct" ]]; then
  [[ -s "$EVIDENCE/results.json" ]] || { echo "run node scripts/fnd-001/check-pocket-garden.mjs fnd-001-harness first" >&2; exit 2; }
  mapfile -t failed < <(jq -r '.results | to_entries[] | select(.key != "reference" and (.key | endswith("-fix") | not)) | select([.value.checks[] | .pass] | all | not) | .key' "$EVIDENCE/results.json")
  pids=(); for run in "${failed[@]}"; do correct_one "$run" & pids+=($!); done
  status=0; for pid in "${pids[@]}"; do wait "$pid" || status=1; done
  exit $status
fi

for rep in $(seq 1 "$REPS"); do
  pids=()
  for cell in claude-code qwen-code; do run_one "$cell" "$rep" & pids+=($!); done
  status=0; for pid in "${pids[@]}"; do wait "$pid" || status=1; done
  [[ $status == 0 ]] || { echo "repetition $rep had a failed run" >&2; exit 1; }
done
