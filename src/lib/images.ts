import { existsSync } from 'node:fs';
import { join } from 'node:path';

const EXTENSIONS = ['avif', 'webp', 'jpg', 'jpeg', 'png', 'svg'] as const;

/**
 * Resolve an art asset by base name from public/images at build time.
 * `findImage('hero-dojo')` returns "/images/hero-dojo.webp" (first extension that exists) or
 * undefined, so components fall back to their CSS/SVG placeholder until the art lands, and pick
 * the art up automatically afterwards with no code change.
 */
export function findImage(baseName: string): string | undefined {
  const dir = join(process.cwd(), 'public', 'images');
  for (const ext of EXTENSIONS) {
    if (existsSync(join(dir, `${baseName}.${ext}`))) return `/images/${baseName}.${ext}`;
  }
  return undefined;
}
