// Types for the parts of ux_review.mjs the site's unit tests call (tests/ux-randori-unseen.test.ts).
export const UNSEEN_INPUT: string;
export interface ReviewRow { id: string; criterion: string; judge: 'script' | 'reviewer' | 'partner' | 'learner'; status: string; findings: string[] }
export interface Review {
  round: string; product: string; states: number; transitions: number; scriptPass: boolean; rows: ReviewRow[];
  first: { constraintMet: boolean; diff: { statesAdded: string[]; statesRemoved: string[]; transitionsAdded: string[]; transitionsRemoved: string[] } } | null;
}
export function validateUnseen(input: unknown, worked: unknown, structuralCheckIds: string[]): string[];
export function reviewFlow(input: unknown, adapted: unknown, options: { checkStructure: (flow: unknown) => { id: string; pass: boolean; failures: string[] }[]; first?: unknown }): Review;
export function reviewSheetMd(input: unknown, review: Review | null): string;
export function renderUnseen(input: unknown, worked: unknown, structuralCheckIds: string[]): { files: [string, string][]; failures: string[] };
