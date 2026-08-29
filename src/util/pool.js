/**
 * Fixed-capacity object pool. Avoids per-frame allocation for bullets and
 * particles, which the GC would otherwise churn on.
 *
 *   const pool = new Pool(256, () => ({ x: 0, y: 0, alive: false }));
 *   const obj = pool.acquire();   // or null when full
 *   pool.release(obj);
 *   pool.forEachActive(fn);
 */
export class Pool {
  constructor(capacity, factory) {
    this.items = new Array(capacity);
    for (let i = 0; i < capacity; i++) {
      const item = factory();
      item.alive = false;
      this.items[i] = item;
    }
    this.activeCount = 0;
  }

  acquire() {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (!item.alive) {
        item.alive = true;
        this.activeCount++;
        return item;
      }
    }
    return null; // pool exhausted — caller decides whether that matters
  }

  release(item) {
    if (item.alive) {
      item.alive = false;
      this.activeCount--;
    }
  }

  forEachActive(fn) {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.alive) fn(item, i);
    }
  }

  releaseAll() {
    for (const item of this.items) item.alive = false;
    this.activeCount = 0;
  }
}
