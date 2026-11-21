export interface ExpectedBuild {
  commit: string;
  pipeline: string;
}

export interface MatchResult {
  ok: boolean;
  state: string;
}

export interface WaitResult extends MatchResult {
  attempts: number;
}

export interface FetchResponse {
  ok: boolean;
  status: number;
  text(): Promise<string>;
}

export interface WaitOptions {
  url: string;
  expected: ExpectedBuild;
  timeoutMs: number;
  intervalMs: number;
  fetchImpl?: (url: URL, init: { headers: Record<string, string>; signal: AbortSignal }) => Promise<FetchResponse>;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  log?: (line: string) => void;
}

export interface CliOptions extends ExpectedBuild {
  url: string;
  timeoutSeconds: number;
  intervalSeconds: number;
}

export function matchBuild(body: string, expected: ExpectedBuild): MatchResult;
export function waitForLiveBuild(options: WaitOptions): Promise<WaitResult>;
export function parseArgs(argv: string[]): CliOptions;
