/**
 * A small ZIP reader and writer (stored or deflated entries, no encryption, no ZIP64), enough to
 * read and rewrite a Penpot v3 file, which is a ZIP of JSON (help.penpot.app/user-guide/export-import/penpot-file-format/).
 * The writer uses a fixed timestamp so the same entries always give the same bytes.
 * Plain, erasable TypeScript: the generator runs it with Node's type stripping.
 */
import { crc32, deflateRawSync, inflateRawSync } from 'node:zlib';

export interface ZipEntry { name: string; data: Uint8Array }

const EOCD = 0x06054b50;
const CENTRAL = 0x02014b50;
const LOCAL = 0x04034b50;

/** Every file entry in the archive, in central-directory order. Throws on a malformed or unsupported archive. */
export function readZip(bytes: Uint8Array): ZipEntry[] {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 22 - 65535); i -= 1) {
    if (view.getUint32(i, true) === EOCD) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('ZIP: no end-of-central-directory record; not a ZIP file');
  const count = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder();
  const entries: ZipEntry[] = [];
  for (let i = 0; i < count; i += 1) {
    if (view.getUint32(offset, true) !== CENTRAL) throw new Error(`ZIP: bad central directory entry ${i}`);
    const method = view.getUint16(offset + 10, true);
    const compressed = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const local = view.getUint32(offset + 42, true);
    const name = decoder.decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
    if (view.getUint32(local, true) !== LOCAL) throw new Error(`ZIP: bad local header for ${name}`);
    const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
    const raw = bytes.subarray(start, start + compressed);
    if (method !== 0 && method !== 8) throw new Error(`ZIP: ${name} uses unsupported compression method ${method}`);
    if (!name.endsWith('/')) entries.push({ name, data: method === 8 ? new Uint8Array(inflateRawSync(raw)) : raw.slice() });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

/** A deflated ZIP of the entries, dated 1980-01-01 00:00 so the output depends only on the entries. */
export function writeZip(entries: readonly ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder();
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const entry of entries) {
    const name = encoder.encode(entry.name);
    const data = new Uint8Array(deflateRawSync(entry.data, { level: 9 }));
    const crc = crc32(entry.data);
    const header = new DataView(new ArrayBuffer(30));
    header.setUint32(0, LOCAL, true); header.setUint16(4, 20, true); header.setUint16(6, 0x0800, true); header.setUint16(8, 8, true);
    header.setUint16(10, 0, true); header.setUint16(12, 0x21, true); header.setUint32(14, crc, true);
    header.setUint32(18, data.length, true); header.setUint32(22, entry.data.length, true); header.setUint16(26, name.length, true);
    const central = new DataView(new ArrayBuffer(46));
    central.setUint32(0, CENTRAL, true); central.setUint16(4, 20, true); central.setUint16(6, 20, true); central.setUint16(8, 0x0800, true);
    central.setUint16(10, 8, true); central.setUint16(12, 0, true); central.setUint16(14, 0x21, true); central.setUint32(16, crc, true);
    central.setUint32(20, data.length, true); central.setUint32(24, entry.data.length, true); central.setUint16(28, name.length, true);
    central.setUint32(42, offset, true);
    locals.push(new Uint8Array(header.buffer), name, data);
    centrals.push(new Uint8Array(central.buffer), name);
    offset += 30 + name.length + data.length;
  }
  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, EOCD, true); end.setUint16(8, entries.length, true); end.setUint16(10, entries.length, true);
  end.setUint32(12, centralSize, true); end.setUint32(16, offset, true);
  const parts = [...locals, ...centrals, new Uint8Array(end.buffer)];
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let at = 0;
  for (const part of parts) { out.set(part, at); at += part.length; }
  return out;
}
