/**
 * Generic Bounded LRU Cache for API memoization.
 * Enforces maximum size to eliminate memory exhaustion vulnerabilities.
 */
export class BoundedLRUCache<K, V> {
  private readonly maxSize: number;
  private readonly ttlMs: number;
  private readonly cache = new Map<K, { value: V; expiresAt: number }>();

  constructor(maxSize = 100, ttlMs = 3600000) { // 1 hour TTL default
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  get(key: K): V | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    // Re-insert to refresh LRU order
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Evict oldest item
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const contractAnalysisCache = new BoundedLRUCache<string, any>(100, 3600000);
