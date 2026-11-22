import { kataCatalog } from '../data/kata-catalog';
import { loadArmory } from './armory-content';
import { lifecycleLedger, recordLifecycle, type LifecycleLedger, type LifecycleLedgerEntry, type LifecycleView } from './catalog-lifecycle';
import { validateCuratedLifecycle } from './kata-catalog';
import { loadKataRecipes } from './kata-recipe-content';

export interface LoadedLifecycle {
  /** Curated kata pages, by href. */
  katas: Map<string, LifecycleView>;
  ledger: LifecycleLedger;
}

let cached: Promise<LoadedLifecycle> | undefined;

/**
 * Every catalog entry's lifecycle on the build date (#96): the curated kata catalog (validated here, so a
 * missing lifecycle field fails the build), kata recipes and Armory entries. The ledger is published at
 * /catalog-lifecycle.json and read by the weekly scheduled check (scripts/list-stale-resources.mjs --catalog).
 */
export function loadCatalogLifecycle(): Promise<LoadedLifecycle> {
  cached ??= (async () => {
    const today = new Date().toISOString().slice(0, 10);
    const katas = new Map<string, LifecycleView>();
    const rows: LifecycleLedgerEntry[] = [];
    for (const entry of validateCuratedLifecycle(kataCatalog)) {
      const view = recordLifecycle(entry.lifecycle, today);
      katas.set(entry.href, view);
      rows.push({ id: entry.metadata.id, surface: 'kata', title: entry.linkLabel, href: entry.href, ...view });
    }
    for (const resolved of await loadKataRecipes()) {
      if (resolved.recipe.status === 'fixture') continue;
      rows.push({ id: resolved.recipe.metadata.id, surface: 'recipe', title: resolved.recipe.metadata.title, href: resolved.href, ...resolved.lifecycle });
    }
    const { armory } = await loadArmory();
    for (const resolved of armory.entries) {
      rows.push({ id: resolved.entry.id, surface: 'armory', title: resolved.entry.name, href: `/armory/registry#${resolved.entry.id}`, ...resolved.lifecycle });
    }
    return { katas, ledger: lifecycleLedger(rows, today) };
  })();
  return cached;
}
