// Types for the parts of ux_usability.mjs the site's unit tests call (tests/ux-usability.test.ts).
export interface PathStep { n: number; from: string; to: string; kind: string; control: string | null; variant: string | null; trigger: string }
export interface TaskCheck { id: string; description: string; pass: boolean; failures: string[] }
export interface TaskResult {
  id: string; scenario: string; observe: string; start: string; goal: string; via?: string; maxSteps: number;
  steps: PathStep[]; stepCount: number | null;
  recoveries: { error: string; via: number; steps: number; path: number[] }[];
  findings: { check: string; item: string; decision: string }[];
  pass: boolean; checks: TaskCheck[];
}
export interface TaskInput { id: string; scenario: string; observe: string; start: string; goal: string; via?: string; maxSteps: number; acceptedFindings?: { check: string; item: string; decision: string }[] }
export function shortestPath(flow: unknown, from: string, to: string): { n: number; from: string; to: string }[] | null;
export function walkTask(flow: unknown, task: TaskInput): TaskResult;
export function renderUsability(flow: unknown, taskFile: { tasks: TaskInput[] }): { files: [string, string][]; failures: string[] };
