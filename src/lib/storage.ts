/**
 * Small shared helper for everything the learning tools save on the learner's own device.
 *
 * Rules it enforces:
 * - Keys are namespaced: "dojo:<name>". Nothing else in localStorage is touched (the theme choice
 *   and the older progress key are handled explicitly, see LEGACY_KEYS).
 * - Every value is wrapped in an envelope { v, savedAt, data } so a tool can change its format later.
 *   A value with another version is ignored (or migrated, when the tool gives a `migrate` function).
 * - Every storage call is inside try/catch. When storage is blocked or full the store keeps the
 *   values in memory for the life of the page, so the tool still works; `persistent` says which.
 * - Nothing is ever sent anywhere. Export hands the learner their own data as text.
 *
 * Pure of the DOM: callers pass a `getStorage` function, so unit tests can use a fake storage.
 */

export const NAMESPACE = 'dojo:';

/** Older keys written by tools built before this helper. Included in export and clear-all. */
export const LEGACY_KEYS: readonly string[] = ['dojo-progress-v1'];

export interface StorageLike {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface Envelope {
  v: number;
  savedAt: string;
  data: unknown;
}

export interface LoadOptions<T> {
  /** The format version this tool writes and understands now. */
  version: number;
  /** Turn unknown data into a safe value, or return undefined when it is not usable. */
  validate: (data: unknown) => T | undefined;
  /** Optional: upgrade data written by an older version. Return undefined to drop it. */
  migrate?: (fromVersion: number, data: unknown) => unknown;
}

export interface DojoStore {
  /** True when the browser accepted a test write. False means values live in memory only. */
  readonly persistent: boolean;
  load<T>(name: string, options: LoadOptions<T>): T | undefined;
  /** Returns true when the value reached real storage. It always stays readable in memory. */
  save(name: string, version: number, data: unknown): boolean;
  remove(name: string): boolean;
  /** Names (without the namespace) that currently hold a value. */
  names(): string[];
  /** Everything saved by the Dojo tools, as plain data the learner can read. */
  exportAll(): Record<string, unknown>;
  /** Removes every Dojo key (and the legacy ones). Returns how many were removed. */
  clearAll(): number;
}

export function storageKey(name: string): string {
  return `${NAMESPACE}${name}`;
}

function isEnvelope(value: unknown): value is Envelope {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate['v'] === 'number' && Number.isInteger(candidate['v']) && 'data' in candidate;
}

function parseEnvelope(raw: string | null): Envelope | undefined {
  if (!raw) return undefined;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isEnvelope(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/** The real storage, or undefined when the browser refuses even to hand it over. */
export function browserStorage(): StorageLike | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

export function createStore(getStorage: () => StorageLike | undefined = browserStorage, now: () => Date = () => new Date()): DojoStore {
  const memory = new Map<string, string>();

  function storage(): StorageLike | undefined {
    try {
      return getStorage();
    } catch {
      return undefined;
    }
  }

  function readRaw(key: string): string | null {
    const target = storage();
    if (target) {
      try {
        const value = target.getItem(key);
        if (value !== null) return value;
      } catch {
        /* fall through to memory */
      }
    }
    return memory.get(key) ?? null;
  }

  function writeRaw(key: string, value: string): boolean {
    memory.set(key, value);
    const target = storage();
    if (!target) return false;
    try {
      target.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  function probe(): boolean {
    const target = storage();
    if (!target) return false;
    try {
      const key = `${NAMESPACE}probe`;
      target.setItem(key, '1');
      target.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  function savedKeys(): string[] {
    const keys = new Set<string>(
      [...memory.keys()].filter((key) => key.startsWith(NAMESPACE) || LEGACY_KEYS.includes(key)),
    );
    const target = storage();
    if (target) {
      try {
        for (let index = 0; index < target.length; index += 1) {
          const key = target.key(index);
          if (key && (key.startsWith(NAMESPACE) || LEGACY_KEYS.includes(key))) keys.add(key);
        }
      } catch {
        /* ignore: memory keys are still listed */
      }
    }
    keys.delete(`${NAMESPACE}probe`);
    return [...keys].sort();
  }

  return {
    persistent: probe(),

    load<T>(name: string, options: LoadOptions<T>): T | undefined {
      const envelope = parseEnvelope(readRaw(storageKey(name)));
      if (!envelope) return undefined;
      if (envelope.v === options.version) return options.validate(envelope.data);
      if (options.migrate && envelope.v < options.version) {
        const upgraded = options.migrate(envelope.v, envelope.data);
        return upgraded === undefined ? undefined : options.validate(upgraded);
      }
      return undefined;
    },

    save(name: string, version: number, data: unknown): boolean {
      const envelope: Envelope = { v: version, savedAt: now().toISOString(), data };
      return writeRaw(storageKey(name), JSON.stringify(envelope));
    },

    remove(name: string): boolean {
      const key = storageKey(name);
      memory.delete(key);
      const target = storage();
      if (!target) return false;
      try {
        target.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },

    names(): string[] {
      return savedKeys()
        .filter((key) => key.startsWith(NAMESPACE))
        .map((key) => key.slice(NAMESPACE.length));
    },

    exportAll(): Record<string, unknown> {
      const out: Record<string, unknown> = {};
      for (const key of savedKeys()) {
        const raw = readRaw(key);
        if (raw === null) continue;
        try {
          out[key] = JSON.parse(raw);
        } catch {
          /* unreadable value: leave it out of the export */
        }
      }
      return out;
    },

    clearAll(): number {
      const keys = savedKeys();
      const target = storage();
      for (const key of keys) {
        memory.delete(key);
        try {
          target?.removeItem(key);
        } catch {
          /* ignore */
        }
      }
      return keys.length;
    },
  };
}

/** Friendly names for the export and clear panel. Unknown names fall back to the raw name. */
export function describeKey(key: string): string {
  if (key === 'dojo-progress-v1') return 'Module progress on the Train page';
  const name = key.startsWith(NAMESPACE) ? key.slice(NAMESPACE.length) : key;
  if (name === 'self-assessment:track-a') return 'Track A self-assessment';
  if (name === 'lessons') return 'Lessons marked done';
  if (name.startsWith('checklist:')) return `Checklist ticks on ${name.slice('checklist:'.length)}`;
  if (name.startsWith('draft:')) return `Template draft: ${name.slice('draft:'.length)}`;
  return name;
}
