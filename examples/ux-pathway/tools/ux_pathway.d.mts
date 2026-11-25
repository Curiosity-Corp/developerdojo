// Types for the parts of ux_pathway.mjs the site's unit tests call (tests/ux-randori.test.ts).
export interface CheckResult { id: string; description: string; pass: boolean; failures: string[]; detail?: Record<string, unknown> }
export function checkStructure(flow: unknown): CheckResult[];
