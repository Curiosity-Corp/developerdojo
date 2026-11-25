// Types for the parts of ux_randori.mjs the site's unit tests call (tests/ux-randori.test.ts).
export interface CheckResult { id: string; description: string; pass: boolean; failures: string[] }
export interface FlowDiff { statesAdded: string[]; statesRemoved: string[]; transitionsAdded: string[]; transitionsRemoved: string[] }
export const CONSTRAINT_CHECKS: Readonly<Record<string, { description: string; screens?: boolean }>>;
export function checkConstraint(flow: unknown, constraintId: string): CheckResult;
export function diffFlows(first: unknown, adapted: unknown): FlowDiff;
export function screenHtml(flow: unknown, state: unknown, roundId: string, which: 'first' | 'adapted'): string;
