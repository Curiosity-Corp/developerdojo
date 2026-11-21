#!/usr/bin/env node
// Armory smoke test client (#88): start an MCP server over stdio, list its tools, run tool calls in order
// and print one JSON transcript. Usage:
//   node scripts/armory/mcp-smoke.mjs <command> [args...] -- '<JSON array of {name, arguments}>'
// Run it in a disposable folder with a clean environment (env -i HOME=<empty dir> PATH=...); see
// docs/armory-registry.md. It sends nothing but the calls you pass.
import { spawn } from 'node:child_process';
const [cmd, ...args] = process.argv.slice(2, process.argv.indexOf('--'));
const calls = JSON.parse(process.argv[process.argv.indexOf('--') + 1]);
const child = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });
let buf = ''; const waiters = new Map(); let stderr = '';
child.stderr.on('data', d => { stderr += d; });
child.stdout.on('data', d => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { const line = buf.slice(0, i); buf = buf.slice(i + 1); if (!line.trim()) continue; try { const m = JSON.parse(line); if (m.id !== undefined && waiters.has(m.id)) { waiters.get(m.id)(m); waiters.delete(m.id); } } catch {} } });
let id = 0;
const rpc = (method, params) => new Promise((res, rej) => { const n = ++id; waiters.set(n, res); child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: n, method, params }) + '\n'); setTimeout(() => rej(new Error('timeout ' + method)), 120000); });
const out = { startedAt: new Date().toISOString(), steps: [] };
try {
  const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'dojo-armory-smoke', version: '1' } });
  out.server = init.result?.serverInfo; out.protocolVersion = init.result?.protocolVersion;
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
  const tl = await rpc('tools/list', {});
  out.tools = (tl.result?.tools ?? []).map(t => ({ name: t.name, readOnlyHint: t.annotations?.readOnlyHint, destructiveHint: t.annotations?.destructiveHint }));
  for (const c of calls) { const r = await rpc('tools/call', { name: c.name, arguments: c.arguments }); out.steps.push({ call: c, isError: r.result?.isError ?? !!r.error, text: (r.result?.content ?? []).filter(x => x.type === 'text').map(x => x.text).join('\n').slice(0, 1500), error: r.error?.message }); }
} catch (e) { out.failure = String(e); }
out.stderrTail = stderr.slice(-800);
child.kill();
console.log(JSON.stringify(out, null, 2));
process.exit(0);
