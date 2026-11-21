export interface NameMatcher {
  name: string;
  pattern: RegExp;
}
export interface NameFinding {
  file: string;
  name: string;
  where: string;
}
export const DENYLIST_PATH: string;
export function parseDenylist(text: string): string[];
export function compileDenylist(names: readonly string[]): NameMatcher[];
export function loadDenylist(path?: string): Promise<NameMatcher[]>;
export function findNames(text: string, matchers: readonly NameMatcher[]): Array<{ name: string; line: number }>;
export function scanDirectories(
  dirs: readonly string[],
  matchers: readonly NameMatcher[],
): Promise<{ scanned: number; findings: NameFinding[] }>;
