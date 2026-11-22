// Types for the parts of ux_hifi.mjs the site's unit tests call (tests/ux-pathway-artifacts.test.ts).
export interface Theme { readonly tokens: Map<string, { resolved: string; type: string }>; readonly [key: string]: unknown }
export interface AuditResult {
  pass: boolean;
  counts: Record<'colours' | 'fontSizes' | 'fontWeights' | 'radii' | 'borderWidths' | 'texts' | 'controls', number>;
  minTextContrast: number | null;
  minControlContrast: number | null;
  components: string[];
  failures: string[];
}
export function theme(tokenFile: unknown): Theme;
export function audit(svg: string, ctx: Theme, expectElements?: number): AuditResult;
