/** WCAG 2.2 contrast for two opaque sRGB hex colours; never rounds the comparison. */
export function normalizeHex(value: string): string | null {
  const hex = value.trim();
  if (!/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(hex)) return null;
  if (hex.length === 4) return `#${[...hex.slice(1)].map((digit) => digit + digit).join('').toLowerCase()}`;
  return hex.toLowerCase();
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (channels[0] ?? 0) + 0.7152 * (channels[1] ?? 0) + 0.0722 * (channels[2] ?? 0);
}

export interface ContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  normalTextPasses: boolean;
  largeTextPasses: boolean;
}

export function checkContrast(foreground: string, background: string): ContrastResult | null {
  const fg = normalizeHex(foreground);
  const bg = normalizeHex(background);
  if (!fg || !bg) return null;
  const a = luminance(fg);
  const b = luminance(bg);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  return { foreground: fg, background: bg, ratio, normalTextPasses: ratio >= 4.5, largeTextPasses: ratio >= 3 };
}
