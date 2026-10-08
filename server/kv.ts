/** The subset of a Netlify Blobs store the server uses; tests provide an in-memory version */
export interface JsonStore {
  getWithMetadata(key: string, options: { type: 'json' }): Promise<{ data: unknown; etag?: string } | null>;
  setJSON(key: string, value: unknown, options?: { onlyIfMatch?: string } | { onlyIfNew?: boolean }): Promise<{ modified: boolean; etag?: string }>;
  delete(key: string): Promise<void>;
  list(): Promise<{ blobs: { key: string }[] }>;
}

export class ConflictError extends Error {}

/**
 * Read-modify-write with optimistic locking: the write only lands if nobody changed the
 * value since we read it, otherwise we re-read and try again. This keeps concurrent
 * updates (e.g. two stock decrements) from overwriting each other.
 */
export const updateJSON = async <T>(
  store: JsonStore,
  key: string,
  mutate: (current: T | null) => T | null,
  attempts = 6
): Promise<T | null> => {
  for (let i = 0; i < attempts; i++) {
    const current = await store.getWithMetadata(key, { type: 'json' });
    const next = mutate(current ? structuredClone(current.data as T) : null);
    if (next === null) return null;
    const result = current?.etag
      ? await store.setJSON(key, next, { onlyIfMatch: current.etag })
      : await store.setJSON(key, next, { onlyIfNew: true });
    if (result.modified) return next;
  }
  throw new ConflictError(`Too many concurrent updates on ${key}`);
};
