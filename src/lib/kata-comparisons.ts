import { COMPARISON_KINDS, type ComparisonKind } from './arena-record';
import { COMPARISON_LABELS, proportion, type ArmMeasurement, type Proportion, type ResolvedArenaRecord } from './arena-records';

/**
 * The controlled comparisons a kata recipe page shows (#84): every comparison in the Arena records that
 * name the kata (`kataId`), with the shared measures computed from the run files by resolveArenaRecords.
 * Nothing here is typed by hand, so the recipe page cannot disagree with the Arena record pages.
 *
 * Rules:
 *   - a superseded record is left out; its replacement carries the comparison;
 *   - a measured comparison shows both arms' measures, or none when an arm was not measured by the Dojo;
 *   - a proposed comparison shows only when no record measured that variable for the kata, and once per
 *     variable, so a design that a later record ran is not shown as still waiting.
 * Rows follow COMPARISON_KINDS order, newest record first within a variable.
 */

export interface ComparisonArm {
  id: string;
  label: string;
  /** Absent when the arm was not measured from Dojo run files. */
  measured?: {
    runs: number;
    passingAll: Proportion;
    /** Runs passing every check after at most one correction round. */
    afterCorrection: Proportion;
    /** Null when a run did not report it. Never 0 for unknown. */
    meanSeconds: number | null;
    totalCostUsd: number | null;
    costBasis: string | null;
  };
}

interface ComparisonBase {
  variable: ComparisonKind;
  label: string;
  recordId: string;
  recordHref: string;
  recordDate: string;
  stale: boolean;
  change: string;
  control: ComparisonArm;
}
export interface MeasuredKataComparison extends ComparisonBase { status: 'measured'; variant: ComparisonArm; reading: string }
export interface ProposedKataComparison extends ComparisonBase { status: 'proposed'; whyNotRun: string }
export type KataComparison = MeasuredKataComparison | ProposedKataComparison;

function armOf(item: ResolvedArenaRecord, id: string): ComparisonArm {
  const label = item.record.arms.find((arm) => arm.id === id)?.label ?? id;
  const value = item.arms[id];
  if (value?.kind !== 'measured') return { id, label };
  const measurement: ArmMeasurement = value;
  return {
    id,
    label,
    measured: {
      runs: measurement.runs,
      passingAll: measurement.passingAll,
      afterCorrection: proportion(measurement.passingAll.count + measurement.corrections.passingAll, measurement.runs),
      meanSeconds: measurement.meanSeconds,
      totalCostUsd: measurement.totalCostUsd,
      costBasis: measurement.costBasis,
    },
  };
}

export function kataComparisons(kataId: string, records: readonly ResolvedArenaRecord[]): KataComparison[] {
  const current = records
    .filter((item) => item.record.kataId === kataId && !item.supersededBy)
    .sort((a, b) => b.record.date.localeCompare(a.record.date) || a.record.id.localeCompare(b.record.id));
  const rows: KataComparison[] = [];
  for (const item of current) {
    for (const comparison of item.record.comparisons) {
      const base = {
        variable: comparison.variable,
        label: COMPARISON_LABELS[comparison.variable],
        recordId: item.record.id,
        recordHref: item.href,
        recordDate: item.record.date,
        stale: item.stale,
        change: comparison.change,
        control: armOf(item, comparison.control),
      };
      rows.push(comparison.status === 'measured'
        ? { ...base, status: 'measured', variant: armOf(item, comparison.variant), reading: comparison.reading }
        : { ...base, status: 'proposed', whyNotRun: comparison.whyNotRun });
    }
  }
  const measuredVariables = new Set(rows.filter((row) => row.status === 'measured').map((row) => row.variable));
  const proposedShown = new Set<ComparisonKind>();
  const kept = rows.filter((row) => {
    if (row.status === 'measured') return true;
    if (measuredVariables.has(row.variable) || proposedShown.has(row.variable)) return false;
    proposedShown.add(row.variable);
    return true;
  });
  const order = (variable: ComparisonKind) => (variable === 'harness' ? -1 : COMPARISON_KINDS.indexOf(variable));
  return kept
    .map((row, index) => ({ row, index }))
    .sort((a, b) => order(a.row.variable) - order(b.row.variable) || a.index - b.index)
    .map(({ row }) => row);
}
