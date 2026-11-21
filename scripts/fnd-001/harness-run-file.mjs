#!/usr/bin/env node
// Writes one Arena run file (run format v1) for the FND-001 harness comparison (#89) from what the
// harness printed and what the recording relay saw. Every arm is measured the same way: wall-clock time
// from the runner, billed cost and served model from the relay, the answer text from the harness.
//
//   node scripts/fnd-001/harness-run-file.mjs <meta.json> <harness-output.json> <relay.jsonl> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';

const [metaPath, rawPath, relayPath, outPath] = process.argv.slice(2);
if (!outPath) { console.error('usage: harness-run-file.mjs <meta.json> <harness-output.json> <relay.jsonl> <out.json>'); process.exit(2); }

const readJson = (path, what) => {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch (error) { throw new Error(`cannot read ${what} ${path}: ${error.message}`); }
};
const meta = readJson(metaPath, 'run metadata');
const raw = readJson(rawPath, 'harness output');

/** Claude Code prints one result object; Qwen Code prints a list of events ending in a result. */
function harnessResult(output) {
  const result = Array.isArray(output) ? output.findLast((event) => event?.type === 'result') : output;
  if (!result || typeof result !== 'object') throw new Error('the harness output has no result object');
  return result;
}
const result = harnessResult(raw);

let relayLines;
try {
  relayLines = readFileSync(relayPath, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
} catch (error) {
  throw new Error(`cannot read relay log ${relayPath}: ${error.message}`);
}
const requests = relayLines.filter((line) => line.type === 'request' && line.runId === meta.runId && line.method === 'POST' && line.path === '/v1/messages');
if (requests.length === 0) throw new Error(`the relay saw no model request for ${meta.runId}`);

const costs = requests.map((line) => line.response?.usage?.cost);
const costKnown = costs.every((cost) => typeof cost === 'number');
const served = [...new Set(requests.map((line) => line.response?.model).filter(Boolean))];
const failedRequests = requests.filter((line) => line.status !== 200).length;

const run = {
  cell: meta.cell,
  ...(meta.repetition ? { repetition: meta.repetition } : {}),
  ...(meta.correctionOf ? { correctionOf: meta.correctionOf } : {}),
  startedAt: meta.startedAt,
  harness: meta.harness,
  requestedModel: meta.model,
  effort: meta.effort,
  prompt: meta.prompt,
  flags: meta.flags,
  modelsUsed: served,
  isError: result.is_error === true || failedRequests > 0,
  subtype: result.subtype ?? null,
  numTurns: result.num_turns ?? null,
  // Wall-clock time of the whole harness process, measured by the runner the same way for both arms.
  durationMs: meta.wallMs,
  harnessReportedDurationMs: result.duration_ms ?? null,
  // Billed cost: the sum the upstream reported with each response, the same basis for both arms.
  costUsd: costKnown ? Number(costs.reduce((sum, cost) => sum + cost, 0).toFixed(8)) : null,
  costBasis: costKnown ? 'billed by the upstream (OpenRouter usage.cost)' : null,
  harnessReportedCostUsd: typeof result.total_cost_usd === 'number' ? result.total_cost_usd : null,
  endpoint: meta.endpoint,
  // What the harness sent and what came back, per model request, as recorded by the relay. Text is hashed.
  requests: requests.map((line) => ({
    status: line.status,
    userAgent: line.userAgent,
    anthropicBeta: line.anthropicBeta,
    provider: line.provider,
    sent: line.request,
    servedModel: line.response?.model ?? null,
    stopReason: line.response?.stopReason ?? null,
    usage: line.response?.usage ? {
      inputTokens: line.response.usage.input_tokens ?? null,
      cacheCreationInputTokens: line.response.usage.cache_creation_input_tokens ?? null,
      cacheReadInputTokens: line.response.usage.cache_read_input_tokens ?? null,
      outputTokens: line.response.usage.output_tokens ?? null,
      thinkingTokens: line.response.usage.output_tokens_details?.thinking_tokens ?? null,
      costUsd: line.response.usage.cost ?? null,
    } : null,
  })),
  response: typeof result.result === 'string' ? result.result : '',
};
writeFileSync(outPath, JSON.stringify(run, null, 2) + '\n');
