import type { Page } from '@playwright/test';

export type CheckResult = { pass: boolean; detail: string };
export type CheckResults = Record<string, CheckResult>;
export type Artifact = { id: string; source: string; html: string; response: string | undefined };

export const EVIDENCE_DIR: string;
export const REFERENCE_FILE: string;
export const ORIGIN: string;
export const PLANTS: readonly string[];
export const CHECKS: readonly string[];
export function extractHtmlBlocks(response: string): string[];
export function proseOutsideCode(response: string): string;
export function findTestClaims(response: string): string[];
export function checkPocketGarden(page: Page, html: string, response: string | undefined): Promise<CheckResults>;
export function listArtifacts(): Artifact[];
