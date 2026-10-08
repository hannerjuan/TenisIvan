import type { JsonStore } from '../server/kv';

/**
 * In-memory stand-in for a Netlify Blobs store with the same etag semantics. Every call
 * yields to the event loop, so concurrent read-modify-write cycles really interleave.
 */
export const memoryStore = (): JsonStore & { raw: Map<string, { data: unknown; etag: string }> } => {
  const raw = new Map<string, { data: unknown; etag: string }>();
  let version = 0;
  const tick = () => new Promise((r) => setTimeout(r, Math.random() * 3));
  return {
    raw,
    async getWithMetadata(key) {
      await tick();
      const entry = raw.get(key);
      return entry ? { data: structuredClone(entry.data), etag: entry.etag } : null;
    },
    async setJSON(key, value, options = {}) {
      await tick();
      const entry = raw.get(key);
      if ('onlyIfMatch' in options && options.onlyIfMatch && entry?.etag !== options.onlyIfMatch) return { modified: false };
      if ('onlyIfNew' in options && options.onlyIfNew && entry) return { modified: false };
      const etag = `v${++version}`;
      raw.set(key, { data: structuredClone(value), etag });
      return { modified: true, etag };
    },
    async delete(key) {
      raw.delete(key);
    },
    async list() {
      return { blobs: [...raw.keys()].map((key) => ({ key })) };
    }
  };
};
