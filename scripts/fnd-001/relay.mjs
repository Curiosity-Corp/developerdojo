#!/usr/bin/env node
// Recording relay for Arena harness comparisons (#89). Two harnesses send the same model requests to
// one upstream through this relay, so the endpoint, account and key are held constant and only the
// harness changes. The relay records what each harness actually sent (model, effort, thinking, output
// limit, system prompt size and hash, tool names, prompt hash, user agent) and what the upstream
// answered (model, stop reason, token usage and the billed cost the upstream reports with the usage).
// RELAY_PROVIDER pins the upstream's serving provider for every request (OpenRouter provider routing),
// so one arm cannot be served by a different provider than the other.
//
// The relay holds the upstream key; the harnesses get a placeholder. The key is read from the
// environment only and is never logged, printed or written. Request text is stored only as a hash.
//
//   RELAY_UPSTREAM_KEY=... RELAY_LOG=relay.jsonl node scripts/fnd-001/relay.mjs
//   Point a harness at http://127.0.0.1:<port>/run/<run-id> as its Anthropic base URL.
//
// Env: RELAY_UPSTREAM_KEY (required), RELAY_LOG (required, JSON lines), RELAY_PORT (default 8790),
// RELAY_UPSTREAM (default https://openrouter.ai/api), RELAY_PROVIDER (for example "anthropic"; unset: no pin).
import { createHash } from 'node:crypto';
import { appendFileSync } from 'node:fs';
import { createServer } from 'node:http';

const KEY = process.env.RELAY_UPSTREAM_KEY;
const LOG = process.env.RELAY_LOG;
const PORT = Number(process.env.RELAY_PORT ?? 8790);
const UPSTREAM = (process.env.RELAY_UPSTREAM ?? 'https://openrouter.ai/api').replace(/\/$/, '');
const PROVIDER = process.env.RELAY_PROVIDER ?? '';
if (!KEY) { console.error('relay: RELAY_UPSTREAM_KEY is not set'); process.exit(2); }
if (!LOG) { console.error('relay: RELAY_LOG is not set'); process.exit(2); }

const HOP = new Set(['host', 'connection', 'content-length', 'transfer-encoding', 'keep-alive', 'upgrade', 'accept-encoding',
  'authorization', 'x-api-key', 'proxy-authorization']);
const sha256 = (text) => createHash('sha256').update(text).digest('hex');
const record = (entry) => appendFileSync(LOG, JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n');

const textOf = (content) => typeof content === 'string' ? content
  : Array.isArray(content) ? content.filter((part) => part?.type === 'text').map((part) => part.text).join('\n') : '';

/** What the harness sent, without the text itself. */
function describeRequest(body) {
  if (!body || typeof body !== 'object') return null;
  const system = textOf(body.system);
  const firstUser = (body.messages ?? []).find((message) => message.role === 'user');
  return {
    model: body.model ?? null,
    maxTokens: body.max_tokens ?? null,
    thinking: body.thinking ?? null,
    outputConfig: body.output_config ?? null,
    temperature: body.temperature ?? null,
    stream: body.stream === true,
    systemChars: system.length,
    systemSha256: system ? sha256(system) : null,
    tools: (body.tools ?? []).map((tool) => tool.name ?? tool.type ?? 'unnamed'),
    messages: (body.messages ?? []).length,
    firstUserTextSha256: firstUser ? sha256(textOf(firstUser.content)) : null,
  };
}

/** The upstream's answer: from a JSON body or from server-sent events. */
function describeResponse(text, contentType) {
  const out = { id: null, model: null, stopReason: null, usage: null };
  const take = (message) => {
    if (!message || typeof message !== 'object') return;
    if (message.id) out.id = message.id;
    if (message.model) out.model = message.model;
    if (message.stop_reason) out.stopReason = message.stop_reason;
    if (message.usage) out.usage = { ...(out.usage ?? {}), ...message.usage };
  };
  try {
    if (contentType.includes('text/event-stream')) {
      for (const line of text.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const event = JSON.parse(line.slice(5).trim() || 'null');
        if (event?.type === 'message_start') take(event.message);
        if (event?.type === 'message_delta') { take(event.delta); if (event.usage) out.usage = { ...(out.usage ?? {}), ...event.usage }; }
      }
    } else if (contentType.includes('json')) take(JSON.parse(text));
  } catch (error) {
    out.parseError = String(error?.message ?? error);
  }
  return out;
}

const server = createServer(async (req, res) => {
  const started = Date.now();
  const match = /^\/run\/([A-Za-z0-9._-]+)(\/.*)$/.exec(req.url ?? '');
  if (!match) { record({ type: 'refused', url: (req.url ?? '').slice(0, 200) }); res.writeHead(404).end('use /run/<run-id>/...'); return; }
  const [, runId, rest] = match;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks);
  let body = null;
  try { body = raw.length ? JSON.parse(raw.toString('utf8')) : null; } catch { body = null; }
  const headers = {};
  for (const [name, value] of Object.entries(req.headers)) if (!HOP.has(name) && value !== undefined) headers[name] = Array.isArray(value) ? value.join(', ') : value;
  headers.authorization = 'Bearer ' + KEY;
  let forward = raw;
  if (PROVIDER && body && typeof body === 'object' && rest.startsWith('/v1/messages')) {
    forward = Buffer.from(JSON.stringify({ ...body, provider: { order: [PROVIDER], allow_fallbacks: false } }));
  }
  let upstream;
  try {
    upstream = await fetch(UPSTREAM + rest, { method: req.method, headers, body: forward.length ? forward : undefined });
  } catch (error) {
    record({ type: 'request', runId, method: req.method, path: rest, status: null, error: 'upstream unreachable: ' + String(error?.message ?? error) });
    res.writeHead(502).end('relay: upstream unreachable');
    return;
  }
  const contentType = upstream.headers.get('content-type') ?? '';
  const out = {};
  upstream.headers.forEach((value, name) => { if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(name)) out[name] = value; });
  res.writeHead(upstream.status, out);
  const kept = [];
  let keptBytes = 0;
  if (upstream.body) {
    for await (const chunk of upstream.body) {
      res.write(chunk);
      if (keptBytes < 32 * 1024 * 1024) { kept.push(Buffer.from(chunk)); keptBytes += chunk.length; }
    }
  }
  res.end();
  const answer = describeResponse(Buffer.concat(kept).toString('utf8'), contentType);
  record({ type: 'request', runId, method: req.method, path: rest.split('?')[0], status: upstream.status, durationMs: Date.now() - started,
    userAgent: req.headers['user-agent'] ?? null, anthropicBeta: req.headers['anthropic-beta'] ?? null,
    provider: PROVIDER || null, request: describeRequest(body), response: answer });
});
server.listen(PORT, '127.0.0.1', () => console.log('relay listening on 127.0.0.1:' + PORT + ', upstream ' + UPSTREAM));
